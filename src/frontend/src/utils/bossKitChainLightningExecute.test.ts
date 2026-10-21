import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { starterSpells } from "../data/spellData.ts";
import {
  bossKitChainLightningBounceDamage,
  bossKitChainLightningChebyshev,
  canExecuteBossKitChainLightning,
  executeBossKitChainLightning,
  isBossKitChainLightningBounceOccupant,
  liveBossKitChainLightningHits,
  shouldDecideBossKitChainLightning,
} from "./bossKitChainLightningExecute.ts";

/** Avoid importing bossKits.ts (bossTypes has no .js specifier under node --test). */
function phase1FirstId(bossId: string): string | null {
  const src = readFileSync(
    new URL("../data/bossKits.ts", import.meta.url),
    "utf8",
  );
  const block = src.split(`${bossId}:`)[1] ?? "";
  const match = block.match(/phase1SpellIds:\s*\[([^\]]+)\]/);
  if (!match) return null;
  const first = match[1].match(/"([^"]+)"/);
  return first?.[1] ?? null;
}

const blast = starterSpells.find((spell) => spell.id === "starter-blast");
const inferno = starterSpells.find((spell) => spell.id === "spell-inferno");
const swap = starterSpells.find((spell) => spell.id === "spell-swap");
const mark = starterSpells.find((spell) => spell.id === "spell-mark");
const rally = starterSpells.find((spell) => spell.id === "spell-rallying-cry");
const strike = starterSpells.find((spell) => spell.id === "physical_attack");

const boss = { x: 4, y: 4 };
const player = { id: "player", x: 6, y: 4, hp: 80, side: "player" as const };

function summon(
  id: string,
  x: number,
  y: number,
  extras: { hp?: number; side?: string } = {},
) {
  return {
    id,
    x,
    y,
    hp: extras.hp ?? 40,
    side: extras.side ?? "player",
  };
}

describe("starter-blast catalog metadata", () => {
  it("advertises hitsMultiple, two bounces, 20 damage, range 4", () => {
    assert.ok(blast);
    assert.equal(blast.hitsMultiple, true);
    assert.equal(blast.bounces, 2);
    assert.equal(Number(blast.damage), 20);
    assert.equal(Number(blast.range), 4);
    assert.equal(blast.spellType, "damage");
  });
});

describe("first-id kit always decides starter-blast", () => {
  it("Void Grandmaster / Starborn Queen / Lord of Static / Mirror Sovereign phase 1", () => {
    assert.equal(phase1FirstId("void_grandmaster"), "starter-blast");
    assert.equal(phase1FirstId("starborn_queen"), "starter-blast");
    assert.equal(phase1FirstId("lord_of_static"), "starter-blast");
    assert.equal(phase1FirstId("mirror_sovereign"), "starter-blast");
  });

  it("does not steal Swap / Inferno / Rallying Cry first-ids", () => {
    assert.equal(phase1FirstId("enthroned_void"), "spell-swap");
    assert.equal(phase1FirstId("crimson_countess"), "spell-inferno");
    assert.equal(phase1FirstId("twin_monarchs"), "spell-rallying-cry");
    assert.notEqual(phase1FirstId("pale_archivist"), "starter-blast");
  });
});

describe("shouldDecideBossKitChainLightning", () => {
  it("decides catalog Chain Lightning from metadata, not the name", () => {
    assert.equal(shouldDecideBossKitChainLightning(blast), true);
    assert.equal(
      shouldDecideBossKitChainLightning({
        id: "custom-arc",
        hitsMultiple: true,
        bounces: 2,
        damage: 20,
        range: 4,
      }),
      true,
    );
  });

  it("does not decide Inferno / Swap / Mark / Rallying Cry / Strike", () => {
    assert.equal(shouldDecideBossKitChainLightning(inferno), false);
    assert.equal(shouldDecideBossKitChainLightning(swap), false);
    assert.equal(shouldDecideBossKitChainLightning(mark), false);
    assert.equal(shouldDecideBossKitChainLightning(rally), false);
    assert.equal(shouldDecideBossKitChainLightning(strike), false);
    assert.equal(shouldDecideBossKitChainLightning(null), false);
  });
});

describe("canExecuteBossKitChainLightning", () => {
  it("executes in-range (Chebyshev 2 <= range 4)", () => {
    assert.equal(bossKitChainLightningChebyshev(boss, player), 2);
    assert.equal(
      canExecuteBossKitChainLightning({ spell: blast, from: boss, to: player }),
      true,
    );
  });

  it("does not execute out of advertised range (Chebyshev 5 > 4)", () => {
    assert.equal(
      canExecuteBossKitChainLightning({
        spell: blast,
        from: boss,
        to: { x: 9, y: 4 },
      }),
      false,
    );
  });
});

describe("in-range Chain Lightning bounce vs live WX apply", () => {
  const wolf = summon("summon-wolf", 6, 5);
  const wisp = summon("summon-wisp", 8, 4);
  const otherBoss = summon("boss-mirror", 5, 5, { side: "enemy", hp: 200 });
  const deadWolf = summon("summon-dead", 6, 3, { hp: 0 });

  it("plans primary 20 plus 50%/25% bounces onto the two nearest summons", () => {
    const plan = executeBossKitChainLightning({
      spell: blast,
      from: boss,
      primary: player,
      occupants: [wolf, wisp, otherBoss, deadWolf],
    });
    assert.ok(plan);
    assert.equal(plan.primaryId, "player");
    assert.equal(plan.primaryDamage, 20);
    assert.deepEqual(plan.bounces, [
      { id: "summon-wolf", damage: 10 },
      { id: "summon-wisp", damage: 5 },
    ]);
    assert.equal(bossKitChainLightningBounceDamage(20, 0), 10);
    assert.equal(bossKitChainLightningBounceDamage(20, 1), 5);
  });

  it("live WX apply hits the player only — summons keep full HP", () => {
    const plan = executeBossKitChainLightning({
      spell: blast,
      from: boss,
      primary: player,
      occupants: [wolf, wisp],
    });
    const hp: Record<string, number> = {
      player: 80,
      "summon-wolf": 40,
      "summon-wisp": 40,
    };
    for (const id of liveBossKitChainLightningHits(plan)) {
      if (id === "player") hp.player -= plan?.primaryDamage ?? 0;
    }
    assert.deepEqual(liveBossKitChainLightningHits(plan), ["player"]);
    assert.equal(hp.player, 60, "primary 20 landed");
    assert.equal(hp["summon-wolf"], 40, "live apply skipped bounce 10");
    assert.equal(hp["summon-wisp"], 40, "live apply skipped bounce 5");
  });

  it("gated execute would debit the summons", () => {
    const plan = executeBossKitChainLightning({
      spell: blast,
      from: boss,
      primary: player,
      occupants: [wolf, wisp],
    });
    assert.ok(plan);
    const hp: Record<string, number> = {
      player: 80,
      "summon-wolf": 40,
      "summon-wisp": 40,
    };
    hp.player -= plan.primaryDamage;
    for (const bounce of plan.bounces) {
      hp[bounce.id] -= bounce.damage;
    }
    assert.equal(hp.player, 60);
    assert.equal(hp["summon-wolf"], 30);
    assert.equal(hp["summon-wisp"], 35);
  });

  it("does not bounce onto the other Boss Rush boss or a corpse", () => {
    assert.equal(
      isBossKitChainLightningBounceOccupant(otherBoss, "player"),
      false,
    );
    assert.equal(
      isBossKitChainLightningBounceOccupant(deadWolf, "player"),
      false,
    );
    const plan = executeBossKitChainLightning({
      spell: blast,
      from: boss,
      primary: player,
      occupants: [otherBoss, deadWolf],
    });
    assert.ok(plan);
    assert.deepEqual(plan.bounces, []);
  });

  it("player-only field still hits the primary and has nowhere to bounce", () => {
    const plan = executeBossKitChainLightning({
      spell: blast,
      from: boss,
      primary: player,
      occupants: [],
    });
    assert.ok(plan);
    assert.equal(plan.primaryDamage, 20);
    assert.deepEqual(plan.bounces, []);
  });

  it("out-of-range primary does not bounce either", () => {
    const plan = executeBossKitChainLightning({
      spell: blast,
      from: boss,
      primary: { ...player, x: 12, y: 4 },
      occupants: [wolf, wisp],
    });
    assert.equal(plan, null);
    assert.deepEqual(liveBossKitChainLightningHits(plan), []);
  });
});

describe("distinct from player bounce #766 and kit specials", () => {
  it("player bounce requires a non-player primary; this plan bounces FROM the player", () => {
    const plan = executeBossKitChainLightning({
      spell: blast,
      from: boss,
      primary: player,
      occupants: [summon("summon-wolf", 6, 5)],
    });
    assert.equal(plan?.primaryId, "player");
    assert.equal(plan?.bounces[0]?.id, "summon-wolf");
  });

  it("does not treat Swap / Mark / Inferno / Strike as Chain Lightning", () => {
    for (const spell of [swap, mark, inferno, strike]) {
      assert.equal(
        executeBossKitChainLightning({
          spell,
          from: boss,
          primary: player,
          occupants: [summon("summon-wolf", 6, 5)],
        }),
        null,
      );
    }
  });
});
