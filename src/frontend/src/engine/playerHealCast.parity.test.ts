import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { starterSpells } from "../data/spellData.ts";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import { planPlayerCastAttempt } from "./playerCastPlan.ts";
import {
  applyPlayerHealAdvertisedBuff,
  normalizeHealBuffModifier,
  playerCastIsSelfHeal,
  playerHealAdvertisedBuffEffect,
} from "./playerHealCast.ts";
import {
  collectHighlightLiveMismatches,
  computeTargetableTiles,
  pickAttackNearestTile,
  shouldExecuteLiveCast,
} from "./targeting.ts";

function floorGrid(size: number): Array<Array<"floor" | "wall" | "portal">> {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "floor" as const),
  );
}

function unit(
  id: string,
  x: number,
  y: number,
  extras: Partial<Enemy> = {},
): Enemy {
  return {
    id,
    x,
    y,
    hp: 20,
    maxHp: 20,
    name: id,
    pieceType: "pawn",
    ...extras,
  } as Enemy;
}

function bloodMend(): SpellConfig {
  const found = starterSpells.find((s) => s.id === "starter-heal");
  assert.ok(found);
  return found;
}

function rallyingCry(): SpellConfig {
  const found = starterSpells.find((s) => s.id === "spell-rallying-cry");
  assert.ok(found);
  return found;
}

describe("playerCastIsSelfHeal", () => {
  it("matches Blood Mend and Rallying Cry, not Shield", () => {
    assert.equal(playerCastIsSelfHeal(bloodMend()), true);
    assert.equal(playerCastIsSelfHeal(rallyingCry()), true);
    assert.equal(
      playerCastIsSelfHeal({ targetType: "self", effectType: "buff" }),
      false,
    );
    assert.equal(
      playerCastIsSelfHeal({ targetType: "ally", effectType: "heal" }),
      false,
    );
  });
});

describe("normalizeHealBuffModifier", () => {
  it("maps advertised +15% (0.15) onto Shield's 1.15 multiplicative form", () => {
    assert.equal(normalizeHealBuffModifier(0.15), 1.15);
    assert.equal(normalizeHealBuffModifier(1.3), 1.3);
    assert.equal(normalizeHealBuffModifier(0), null);
    assert.equal(normalizeHealBuffModifier(undefined), null);
  });
});

describe("playerHealAdvertisedBuffEffect", () => {
  it("builds the +15% CHC row Blood Mend advertises", () => {
    const effect = playerHealAdvertisedBuffEffect(bloodMend(), "player");
    assert.ok(effect);
    assert.equal(effect.stat, "chc");
    assert.equal(effect.modifier, 1.15);
    assert.equal(effect.duration, 2);
    assert.equal(effect.description, "+15% CHC for 2 turns");
  });

  it("builds the Rallying Cry CHC row without using the Shield branch", () => {
    const effect = playerHealAdvertisedBuffEffect(rallyingCry(), "player");
    assert.ok(effect);
    assert.equal(effect.stat, "chc");
    assert.equal(effect.modifier, 1.15);
    assert.equal(effect.duration, 2);
  });

  it("no-ops when the heal has no buffStat", () => {
    assert.equal(
      playerHealAdvertisedBuffEffect({ name: "Mend" }, "player"),
      null,
    );
  });
});

describe("applyPlayerHealAdvertisedBuff", () => {
  it("applies the buff after a highlighted self-heal executes", () => {
    const applied: unknown[] = [];
    const logs: string[] = [];
    const ok = applyPlayerHealAdvertisedBuff(
      bloodMend(),
      {
        applyEffect: (effect) => {
          applied.push(effect);
        },
        log: (msg) => {
          logs.push(msg);
        },
      },
      "player",
    );
    assert.equal(ok, true);
    assert.equal(applied.length, 1);
    const row = applied[0] as { modifier: number; stat: string };
    assert.equal(row.stat, "chc");
    assert.equal(row.modifier, 1.15);
    assert.equal(logs.length, 1);
  });
});

describe("self-heal highlight vs execute", () => {
  it("paints only the caster tile and lets that tile execute", () => {
    const spell = bloodMend();
    const caster = { x: 2, y: 2 };
    const tiles = floorGrid(5);
    const enemies = [unit("rat", 3, 2)];
    const grid = {
      tiles,
      enemies,
      worldGridSize: 5,
      effectiveRange: 1,
      barrierTiles: new Map<string, number>(),
    };
    const highlighted = computeTargetableTiles(spell, caster, grid);
    assert.deepEqual([...highlighted], ["2,2"]);
    const mismatch = collectHighlightLiveMismatches(spell, caster, grid);
    assert.deepEqual(mismatch.highlightOnly, []);
    assert.deepEqual(mismatch.liveOnly, []);

    const legal = planPlayerCastAttempt({
      spell,
      caster,
      tile: caster,
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: 1,
      currentAp: 6,
      baseApCost: Number(spell.apCost),
      cooldownTurnsRemaining: 0,
    });
    assert.equal(legal.ok, true);
    assert.equal(shouldExecuteLiveCast(legal.live), true);

    const illegal = planPlayerCastAttempt({
      spell,
      caster,
      tile: { x: 3, y: 2 },
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: 1,
      currentAp: 6,
      baseApCost: Number(spell.apCost),
      cooldownTurnsRemaining: 0,
    });
    assert.equal(illegal.ok, false);
    assert.equal(shouldExecuteLiveCast(illegal.live), false);
  });

  it("lets Attack Nearest land on the highlighted self tile, not the rat", () => {
    const spell = rallyingCry();
    const caster = { x: 1, y: 1 };
    const tiles = floorGrid(4);
    const enemies = [unit("rat", 2, 1)];
    const pick = pickAttackNearestTile(
      spell,
      caster,
      enemies,
      tiles,
      1,
      new Map(),
    );
    assert.deepEqual(pick, caster);
    const highlighted = computeTargetableTiles(spell, caster, {
      tiles,
      enemies,
      worldGridSize: 4,
      effectiveRange: 1,
      barrierTiles: new Map(),
    });
    assert.equal(highlighted.has("1,1"), true);
    assert.equal(highlighted.has("2,1"), false);
  });
});
