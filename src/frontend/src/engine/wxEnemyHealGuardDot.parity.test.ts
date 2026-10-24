/**
 * Combat action parity: pack-enemy `decideHealer` backline-guard vs
 * advertised in-range Inferno. A decided legal Inferno dest (living
 * hostile in Chebyshev range, healthy pack so live would guard) is
 * executable; an illegal dest cannot execute; live still
 * backline-guards and `pickBestDamageSpell` still skips `damage: 0`.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  AI_BACKLINE_GUARD_DISTANCE,
  AI_BACKLINE_PROTECT_ENABLED,
  AI_KAMIKAZE_BLAST_RADIUS,
  ENEMY_HEAL_ALLY_THRESHOLD_PCT,
} from "../data/gameConstants.ts";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { buildEnemyKit } from "./enemyAI.ts";
import { enemyCastRangeOk, enemySpellRange } from "./targeting.ts";
import {
  canExecuteWxEnemyHealGuardDotCast,
  isWxEnemyHealGuardDotBlockedBuffSpell,
  isWxEnemyHealGuardDotBlockedFrostSpell,
  isWxEnemyHealGuardDotSpell,
  isWxEnemyHealGuardDotTriggerSpell,
  isWxEnemyHealGuardDotWoundedAlly,
  pickWxEnemyHealGuardDotSpell,
  pickWxEnemyHealGuardDotTriggerSpell,
  shouldDecideWxEnemyHealGuardDotCast,
  wxEnemyHealGuardDotCasterIsWounded,
  wxEnemyHealGuardDotHighlightedTargetIsExecutable,
  wxEnemyHealGuardDotIdealCell,
  wxEnemyHealGuardDotInRange,
  wxEnemyHealGuardDotLivePickBestDamageSpell,
  wxEnemyHealGuardDotRange,
  wxEnemyHealGuardDotTriggerRequiresZeroRange,
  wxEnemyHealLiveWouldBacklineGuardForDot,
  wxEnemyHealLiveWouldHealOrApproachWoundedAlly,
} from "./wxEnemyHealGuardDot.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function playerAt(id: string, x: number, y: number, hp = 40) {
  return { id, x, y, hp, side: "player" as const };
}

function allyAt(
  id: string,
  x: number,
  y: number,
  hp: number,
  maxHp: number,
  isSummon = false,
) {
  return { id, x, y, hp, maxHp, side: "enemy" as const, isSummon };
}

describe("WX enemy decideHealer backline-guard vs advertised Inferno", () => {
  const mend = mustSpell("starter-heal");
  const rally = mustSpell("spell-rallying-cry");
  const inferno = mustSpell("spell-inferno");
  const frost = mustSpell("starter-frost");
  const origin = { x: 4, y: 4 };
  const infernoDest = { x: 7, y: 4 };
  const healthyAlly = allyAt("pawn-1", 2, 4, 80, 100);
  const healthyQueen = allyAt("queen-1", 4, 4, 80, 100);
  const opponents = [playerAt("player", 7, 4)];
  const allies = [healthyAlly];

  it("treats catalog Blood Mend as range-0 heal trigger and Inferno as DoT fallback", () => {
    assert.equal(mend.spellType, "heal");
    assert.equal(Number(mend.damage), 0);
    assert.equal(Number(mend.healAmount), 12);
    assert.equal(Number(mend.range), 0);
    assert.equal(mend.targetType, "self");
    assert.equal(isWxEnemyHealGuardDotTriggerSpell(mend), true);
    assert.equal(wxEnemyHealGuardDotTriggerRequiresZeroRange(mend), true);
    assert.equal(inferno.spellType, "damage");
    assert.equal(Number(inferno.damage), 0);
    assert.equal(inferno.isDotSpell, true);
    assert.equal(inferno.effectType, "dot");
    assert.equal(Number(inferno.dotDamagePerTurn), 8);
    assert.equal(Number(inferno.dotDuration), 3);
    assert.equal(Number(inferno.range), 3);
    assert.equal(Number(inferno.areaRadius ?? 0), 0);
    assert.equal(isWxEnemyHealGuardDotSpell(inferno), true);
    assert.equal(wxEnemyHealGuardDotRange(inferno), enemySpellRange(inferno));
    assert.equal(isWxEnemyHealGuardDotTriggerSpell(rally), true);
    assert.equal(rally.usableByEnemy, false);
    assert.notEqual(
      Number(inferno.areaRadius ?? 0),
      AI_KAMIKAZE_BLAST_RADIUS,
      "#799 owns bomber radius-2 splash, not pack Inferno ticks",
    );
  });

  it("queen z>=2 kit carries Inferno + Blood Mend; queen z=1 is Frost", () => {
    assert.deepEqual(buildEnemyKit("queen", 2), [
      "spell-inferno",
      "starter-heal",
    ]);
    assert.deepEqual(buildEnemyKit("queen", 1), [
      "starter-frost",
      "starter-heal",
    ]);
    assert.equal(buildEnemyKit("queen", 0).includes("starter-heal"), false);
    assert.equal(buildEnemyKit("king", 2).includes("spell-inferno"), true);
    assert.equal(buildEnemyKit("king", 2).includes("spell-rallying-cry"), true);
    assert.equal(buildEnemyKit("rook", 1).includes("starter-heal"), false);
    assert.equal(AI_BACKLINE_PROTECT_ENABLED, true);
    assert.equal(AI_BACKLINE_GUARD_DISTANCE, 1);
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isWxEnemyHealGuardDotTriggerSpell({
        spellType: "heal",
        damage: 0,
        healAmount: 12,
        range: 0,
        targetType: "self",
      }),
      true,
    );
    assert.equal(
      isWxEnemyHealGuardDotSpell({
        spellType: "damage",
        damage: 0,
        isDotSpell: true,
        effectType: "dot",
        dotDamagePerTurn: 8,
        dotDuration: 3,
        range: 3,
        targetType: "enemy",
      }),
      true,
    );
    assert.equal(
      isWxEnemyHealGuardDotSpell({
        spellType: "damage",
        damage: 0,
        effectType: "dot",
        dotDuration: 3,
        range: 3,
      }),
      false,
      "DoT flag without advertised dpt is not this leftover",
    );
    assert.equal(ENEMY_HEAL_ALLY_THRESHOLD_PCT, 0.5);
  });

  it("does not steal Strike, Slow, Iron Skin, Drain, Poison-as-Frost, Nova, or heal", () => {
    assert.equal(isWxEnemyHealGuardDotSpell(physicalAttackSpell), false);
    assert.equal(isWxEnemyHealGuardDotSpell(mend), false);
    assert.equal(
      isWxEnemyHealGuardDotSpell(mustSpell("spell-slow")),
      false,
      "#528/#762/#878 own 0-damage Slow",
    );
    assert.equal(
      isWxEnemyHealGuardDotSpell(mustSpell("spell-iron-skin")),
      false,
      "#978 owns pack buff decide",
    );
    assert.equal(
      isWxEnemyHealGuardDotSpell(frost),
      false,
      "#1034 owns pack healer Frost guard",
    );
    assert.equal(isWxEnemyHealGuardDotBlockedFrostSpell(frost), true);
    assert.equal(
      isWxEnemyHealGuardDotSpell(mustSpell("starter-drain")),
      false,
      "#921 owns Life Drain SP",
    );
    assert.equal(
      isWxEnemyHealGuardDotSpell(mustSpell("spell-frost-nova")),
      false,
      "#917 owns player Frost Nova; hitsMultiple is not this leftover",
    );
    assert.equal(
      isWxEnemyHealGuardDotBlockedBuffSpell(mustSpell("spell-iron-skin")),
      true,
    );
    assert.equal(isWxEnemyHealGuardDotTriggerSpell(inferno), false);
    assert.equal(
      isWxEnemyHealGuardDotTriggerSpell(mustSpell("starter-drain")),
      false,
    );
  });

  it("live decideHealer still backline-guards a healthy pack before decideCaster", () => {
    const ai = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "enemyAI.ts"),
      "utf8",
    );
    const start = ai.indexOf("function decideHealer");
    assert.ok(start >= 0, "live decideHealer is present");
    const body = ai.slice(start, start + 4500);
    assert.ok(body.includes("AI_BACKLINE_PROTECT_ENABLED"));
    assert.ok(body.includes("backline-guard"));
    assert.ok(body.includes("interpose"));
    assert.ok(body.includes("decideCaster"));
    const picker = ai.indexOf("function pickBestDamageSpell");
    assert.ok(picker >= 0, "live pickBestDamageSpell is present");
    const pickerBody = ai.slice(picker, picker + 700);
    assert.ok(pickerBody.includes("Number(s.damage) > 0"));
    const guard = wxEnemyHealGuardDotIdealCell(healthyAlly, infernoDest);
    assert.deepEqual(guard, { x: 3, y: 4 });
    assert.equal(
      wxEnemyHealLiveWouldBacklineGuardForDot({
        availableSpells: [inferno, mend],
        origin,
        allies,
        opponents,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      true,
    );
    assert.equal(
      wxEnemyHealLiveWouldHealOrApproachWoundedAlly({
        availableSpells: [inferno, mend],
        origin,
        allies,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      false,
    );
    assert.equal(
      wxEnemyHealGuardDotLivePickBestDamageSpell({
        availableSpells: [inferno, mend],
        origin,
        targetCell: infernoDest,
      }),
      null,
      "Inferno damage 0 never passes live pickBestDamageSpell (#967 owns that miss once guard is skipped)",
    );
  });

  it("picks in-range Inferno when live would backline-guard a healthy pack", () => {
    const occupant = playerAt("player", 7, 4);
    const available = [inferno, mend];
    assert.equal(
      wxEnemyHealGuardDotInRange(origin, infernoDest, inferno),
      true,
    );
    assert.equal(
      pickWxEnemyHealGuardDotTriggerSpell(available)?.id,
      "starter-heal",
    );
    assert.equal(
      isWxEnemyHealGuardDotWoundedAlly({
        ally: healthyAlly,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      false,
    );
    assert.equal(wxEnemyHealGuardDotCasterIsWounded(healthyQueen), false);
    assert.equal(
      pickWxEnemyHealGuardDotSpell({
        availableSpells: available,
        origin,
        targetCell: infernoDest,
        allies,
        opponents,
        caster: healthyQueen,
        casterSide: "enemy",
        casterId: "queen-1",
      })?.id,
      "spell-inferno",
    );
    const decided = shouldDecideWxEnemyHealGuardDotCast({
      spell: inferno,
      availableSpells: available,
      origin,
      targetCell: infernoDest,
      occupant,
      allies,
      opponents,
      caster: healthyQueen,
      casterSide: "enemy",
      casterId: "queen-1",
    });
    const executable = canExecuteWxEnemyHealGuardDotCast({
      spell: inferno,
      availableSpells: available,
      origin,
      targetCell: infernoDest,
      occupant,
      allies,
      opponents,
      caster: healthyQueen,
      casterSide: "enemy",
      casterId: "queen-1",
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      wxEnemyHealGuardDotHighlightedTargetIsExecutable({
        decided,
        executable,
      }),
      true,
    );
  });

  it("cannot execute Inferno beyond range 3, on a corpse, ally, or empty tile", () => {
    const available = [inferno, mend];
    const tooFar = { x: 8, y: 4 };
    assert.equal(enemyCastRangeOk(origin, tooFar, inferno), false);
    assert.equal(wxEnemyHealGuardDotInRange(origin, tooFar, inferno), false);
    const base = {
      spell: inferno,
      availableSpells: available,
      origin,
      allies,
      opponents,
      caster: healthyQueen,
      casterSide: "enemy" as const,
      casterId: "queen-1",
    };
    assert.equal(
      canExecuteWxEnemyHealGuardDotCast({
        ...base,
        targetCell: tooFar,
        occupant: playerAt("player", 8, 4),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealGuardDotCast({
        ...base,
        targetCell: infernoDest,
        occupant: playerAt("player", 7, 4, 0),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealGuardDotCast({
        ...base,
        targetCell: infernoDest,
        occupant: { id: "queen-2", x: 7, y: 4, hp: 12, side: "enemy" },
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealGuardDotCast({
        ...base,
        targetCell: infernoDest,
        occupant: null,
      }),
      false,
    );
    assert.equal(
      wxEnemyHealGuardDotHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("does not steal wounded-ally approach (#1033) or wounded-caster self-heal (#985)", () => {
    const available = [inferno, mend];
    const woundedAlly = allyAt("pawn-1", 6, 4, 20, 100);
    assert.equal(
      wxEnemyHealLiveWouldHealOrApproachWoundedAlly({
        availableSpells: available,
        origin,
        allies: [woundedAlly],
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      true,
    );
    assert.equal(
      pickWxEnemyHealGuardDotSpell({
        availableSpells: available,
        origin,
        targetCell: infernoDest,
        allies: [woundedAlly],
        opponents,
        caster: healthyQueen,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      null,
      "#1033 owns wounded-ally approach vs Inferno",
    );
    const woundedQueen = allyAt("queen-1", 4, 4, 40, 100);
    assert.equal(wxEnemyHealGuardDotCasterIsWounded(woundedQueen), true);
    assert.equal(
      pickWxEnemyHealGuardDotSpell({
        availableSpells: available,
        origin,
        targetCell: infernoDest,
        allies,
        opponents,
        caster: woundedQueen,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      null,
      "#985 owns wounded-caster self-heal when no wounded ally",
    );
  });

  it("does not fire when already on the guard tile (live already falls through to #967)", () => {
    const onGuard = { x: 3, y: 4 };
    const casterOnGuard = allyAt("queen-1", 3, 4, 80, 100);
    assert.deepEqual(
      wxEnemyHealGuardDotIdealCell(healthyAlly, infernoDest),
      onGuard,
    );
    assert.equal(
      wxEnemyHealLiveWouldBacklineGuardForDot({
        availableSpells: [inferno, mend],
        origin: onGuard,
        allies,
        opponents,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      false,
    );
    assert.equal(
      pickWxEnemyHealGuardDotSpell({
        availableSpells: [inferno, mend],
        origin: onGuard,
        targetCell: infernoDest,
        allies,
        opponents,
        caster: casterOnGuard,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      null,
      "already-on-guard falls through to decideCaster (#967 / #989)",
    );
  });

  it("does not steal queen z=1 Frost guard or rook Iron Skin leftovers", () => {
    const iron = mustSpell("spell-iron-skin");
    assert.equal(
      pickWxEnemyHealGuardDotSpell({
        availableSpells: [frost, mend],
        origin,
        targetCell: infernoDest,
        allies,
        opponents,
        caster: healthyQueen,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      null,
      "queen z=1 Frost stays #1034 guard / #1026 approach",
    );
    assert.equal(
      pickWxEnemyHealGuardDotSpell({
        availableSpells: [frost, inferno, mend],
        origin,
        targetCell: infernoDest,
        allies,
        opponents,
        caster: healthyQueen,
        casterSide: "enemy",
        casterId: "queen-1",
      })?.id,
      "spell-inferno",
      "#1034 already yields Frost guard when Inferno is also in range",
    );
    assert.equal(
      pickWxEnemyHealGuardDotSpell({
        availableSpells: [iron, inferno, mend],
        origin,
        targetCell: origin,
        allies,
        opponents,
        caster: healthyQueen,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      null,
      "Iron Skin stays #978",
    );
  });

  it("king Rallying Cry filtered from availableSpells still guards then Infernos", () => {
    const available = [inferno];
    const king = allyAt("king-1", 4, 4, 80, 100);
    assert.equal(pickWxEnemyHealGuardDotTriggerSpell(available), null);
    assert.equal(
      wxEnemyHealLiveWouldHealOrApproachWoundedAlly({
        availableSpells: available,
        origin,
        allies: [allyAt("pawn-1", 6, 4, 20, 100)],
        casterSide: "enemy",
        casterId: "king-1",
      }),
      false,
      "usableByEnemy false drops Rallying Cry; live skips the wounded-ally branch",
    );
    assert.equal(
      wxEnemyHealLiveWouldBacklineGuardForDot({
        availableSpells: available,
        origin,
        allies,
        opponents,
        casterSide: "enemy",
        casterId: "king-1",
      }),
      true,
    );
    assert.equal(
      pickWxEnemyHealGuardDotSpell({
        availableSpells: available,
        origin,
        targetCell: infernoDest,
        allies,
        opponents,
        caster: king,
        casterSide: "enemy",
        casterId: "king-1",
      })?.id,
      "spell-inferno",
    );
  });

  it("still decides wall-blocked Inferno (picker skips LoS) and does not debit AP", () => {
    const available = [inferno, mend];
    assert.equal(Number(inferno.apCost), 5);
    assert.equal(Number(mend.apCost), 3);
    assert.equal(Number(inferno.cooldown), 3);
    assert.equal(
      canExecuteWxEnemyHealGuardDotCast({
        spell: inferno,
        availableSpells: available,
        origin,
        targetCell: infernoDest,
        occupant: playerAt("player", 7, 4),
        allies,
        opponents,
        caster: healthyQueen,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      true,
      "catalog Inferno has no lineOfSight flag; healer / WX skip LoS. #972 owns CD, not this leftover",
    );
  });

  it("cannot decide Strike, Frost, Slow, Iron Skin, Drain, or heal as this Inferno leftover", () => {
    const occupant = playerAt("player", 7, 4);
    const base = {
      origin,
      targetCell: infernoDest,
      occupant,
      allies,
      opponents,
      caster: healthyQueen,
      casterSide: "enemy" as const,
      casterId: "queen-1",
    };
    assert.equal(
      canExecuteWxEnemyHealGuardDotCast({
        ...base,
        spell: physicalAttackSpell,
        availableSpells: [physicalAttackSpell, mend],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealGuardDotCast({
        ...base,
        spell: frost,
        availableSpells: [frost, mend],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealGuardDotCast({
        ...base,
        spell: mustSpell("spell-slow"),
        availableSpells: [mustSpell("spell-slow"), mend],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealGuardDotCast({
        ...base,
        spell: mend,
        availableSpells: [inferno, mend],
      }),
      false,
      "#985 / #989 own the range-0 heal picker; do not remap dest onto the caster",
    );
  });
});
