import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import {
  bossKitRangedPrimaryChebyshev,
  bossKitRangedPrimaryHighlightedIsExecutable,
  canExecuteBossKitRangedPrimary,
  isBossKitRangedPrimarySpell,
  liveBossKitRangedPrimaryApplies,
  shouldDecideBossKitRangedPrimary,
} from "./bossKitRangedPrimaryExecute.ts";

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

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

const strike = physicalAttackSpell;
const inferno = mustSpell("spell-inferno");
const cursed = mustSpell("spell-cursed-wound");
const venom = mustSpell("spell-venom-strike");
const slow = mustSpell("spell-slow");
const drain = mustSpell("starter-drain");
const blast = mustSpell("starter-blast");
const swap = mustSpell("spell-swap");
const mark = mustSpell("spell-mark");
const rally = mustSpell("spell-rallying-cry");
const iron = mustSpell("spell-iron-skin");
const archer = mustSpell("summon-archer");

const boss = { x: 4, y: 4 };
const adjacent = { x: 5, y: 4 };
const chebyshev2 = { x: 6, y: 4 };
const chebyshev3 = { x: 7, y: 4 };
const chebyshev4 = { x: 8, y: 4 };

describe("first-id kit always decides ranged primaries", () => {
  it("Strike / Inferno / Cursed Wound / Venom / Slow / Drain are phase-1 first ids", () => {
    assert.equal(phase1FirstId("bone_cavalier"), "physical_attack");
    assert.equal(phase1FirstId("weeping_pawn"), "physical_attack");
    assert.equal(phase1FirstId("final_pawn"), "physical_attack");
    assert.equal(phase1FirstId("alabaster_fortress"), "physical_attack");
    assert.equal(phase1FirstId("crimson_countess"), "spell-inferno");
    assert.equal(phase1FirstId("pale_archbishop"), "spell-cursed-wound");
    assert.equal(phase1FirstId("midnight_bishop"), "spell-cursed-wound");
    assert.equal(phase1FirstId("chessboard_lich"), "spell-cursed-wound");
    assert.equal(phase1FirstId("pale_archivist"), "spell-cursed-wound");
    assert.equal(phase1FirstId("fetid_rook"), "spell-venom-strike");
    assert.equal(phase1FirstId("eternal_pawn_king"), "spell-slow");
    assert.equal(phase1FirstId("starved_vampire_pawn"), "starter-drain");
  });

  it("does not steal Chain Lightning / Swap / Rallying Cry first-ids", () => {
    assert.equal(phase1FirstId("void_grandmaster"), "starter-blast");
    assert.equal(phase1FirstId("enthroned_void"), "spell-swap");
    assert.equal(phase1FirstId("twin_monarchs"), "spell-rallying-cry");
  });
});

describe("isBossKitRangedPrimarySpell", () => {
  it("treats Strike / Inferno / Cursed Wound / Venom / Slow / Drain as ranged primaries", () => {
    assert.equal(isBossKitRangedPrimarySpell(strike), true);
    assert.equal(isBossKitRangedPrimarySpell(inferno), true);
    assert.equal(isBossKitRangedPrimarySpell(cursed), true);
    assert.equal(isBossKitRangedPrimarySpell(venom), true);
    assert.equal(isBossKitRangedPrimarySpell(slow), true);
    assert.equal(isBossKitRangedPrimarySpell(drain), true);
    assert.equal(Number(strike.range), 1);
    assert.equal(Number(inferno.range), 3);
    assert.equal(Number(cursed.range), 3);
    assert.equal(Number(venom.range), 2);
    assert.equal(Number(slow.range), 3);
    assert.equal(Number(drain.range), 2);
  });

  it("does not steal Chain Lightning, Swap, Mark, Rallying Cry, Iron Skin, or summons", () => {
    assert.equal(isBossKitRangedPrimarySpell(blast), false);
    assert.equal(isBossKitRangedPrimarySpell(swap), false);
    assert.equal(isBossKitRangedPrimarySpell(mark), false);
    assert.equal(isBossKitRangedPrimarySpell(rally), false);
    assert.equal(isBossKitRangedPrimarySpell(iron), false);
    assert.equal(isBossKitRangedPrimarySpell(archer), false);
    assert.equal(isBossKitRangedPrimarySpell(null), false);
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isBossKitRangedPrimarySpell({
        id: "custom-jab",
        damage: 10,
        range: 1,
        spellType: "damage",
        targetType: "enemy",
      }),
      true,
    );
  });
});

describe("canExecuteBossKitRangedPrimary vs live WX apply", () => {
  it("executes in-range Strike (Chebyshev 1 <= range 1)", () => {
    assert.equal(bossKitRangedPrimaryChebyshev(boss, adjacent), 1);
    assert.equal(
      canExecuteBossKitRangedPrimary({
        spell: strike,
        from: boss,
        to: adjacent,
      }),
      true,
    );
    assert.equal(
      shouldDecideBossKitRangedPrimary({
        spell: strike,
        from: boss,
        to: adjacent,
      }),
      true,
    );
    assert.equal(
      bossKitRangedPrimaryHighlightedIsExecutable({
        decided: true,
        executable: true,
      }),
      true,
    );
  });

  it("does not execute Strike beyond advertised range (Chebyshev 2 > 1)", () => {
    assert.equal(bossKitRangedPrimaryChebyshev(boss, chebyshev2), 2);
    const decided = shouldDecideBossKitRangedPrimary({
      spell: strike,
      from: boss,
      to: chebyshev2,
    });
    const executable = canExecuteBossKitRangedPrimary({
      spell: strike,
      from: boss,
      to: chebyshev2,
    });
    assert.equal(decided, false);
    assert.equal(executable, false);
    assert.equal(
      bossKitRangedPrimaryHighlightedIsExecutable({ decided, executable }),
      false,
    );
    assert.equal(
      liveBossKitRangedPrimaryApplies(strike),
      true,
      "live WX apply still lands Strike map-wide",
    );
  });

  it("does not execute Inferno at Chebyshev 4 > range 3", () => {
    assert.equal(
      canExecuteBossKitRangedPrimary({
        spell: inferno,
        from: boss,
        to: chebyshev4,
      }),
      false,
    );
    assert.equal(
      canExecuteBossKitRangedPrimary({
        spell: inferno,
        from: boss,
        to: chebyshev3,
      }),
      true,
    );
    assert.equal(liveBossKitRangedPrimaryApplies(inferno), true);
  });

  it("does not execute Drain at Chebyshev 3 > range 2", () => {
    assert.equal(
      canExecuteBossKitRangedPrimary({
        spell: drain,
        from: boss,
        to: chebyshev3,
      }),
      false,
    );
    assert.equal(
      canExecuteBossKitRangedPrimary({
        spell: drain,
        from: boss,
        to: chebyshev2,
      }),
      true,
    );
  });

  it("does not execute Venom at Chebyshev 3 > range 2", () => {
    assert.equal(
      canExecuteBossKitRangedPrimary({
        spell: venom,
        from: boss,
        to: chebyshev3,
      }),
      false,
    );
    assert.equal(
      canExecuteBossKitRangedPrimary({
        spell: venom,
        from: boss,
        to: chebyshev2,
      }),
      true,
    );
  });

  it("still executes a wall-blocked in-range Slow (WX skips LoS)", () => {
    assert.equal(
      canExecuteBossKitRangedPrimary({
        spell: slow,
        from: boss,
        to: chebyshev3,
      }),
      true,
      "boss kit inRange is Chebyshev only; do not merge player LoS",
    );
  });

  it("cannot execute Chain Lightning / Swap / Rallying Cry as a ranged primary", () => {
    for (const spell of [blast, swap, rally]) {
      assert.equal(
        canExecuteBossKitRangedPrimary({
          spell,
          from: boss,
          to: adjacent,
        }),
        false,
      );
    }
  });
});
