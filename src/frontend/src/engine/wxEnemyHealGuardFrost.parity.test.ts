/**
 * Combat action parity: pack-enemy `decideHealer` backline-guard vs
 * advertised in-range Frost. A decided legal Frost dest (living hostile
 * in Chebyshev range, healthy pack so live would guard) is executable;
 * an illegal dest cannot execute; live still backline-guards.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  AI_BACKLINE_GUARD_DISTANCE,
  AI_BACKLINE_PROTECT_ENABLED,
  ENEMY_HEAL_ALLY_THRESHOLD_PCT,
} from "../data/gameConstants.ts";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { buildEnemyKit } from "./enemyAI.ts";
import { enemyCastRangeOk, enemySpellRange } from "./targeting.ts";
import {
  canExecuteWxEnemyHealGuardFrostCast,
  isWxEnemyHealGuardFrostBlockedBuffSpell,
  isWxEnemyHealGuardFrostBlockedDotSpell,
  isWxEnemyHealGuardFrostSpell,
  isWxEnemyHealGuardFrostTriggerSpell,
  isWxEnemyHealGuardFrostWoundedAlly,
  pickWxEnemyHealGuardFrostSpell,
  pickWxEnemyHealGuardFrostTriggerSpell,
  shouldDecideWxEnemyHealGuardFrostCast,
  wxEnemyHealGuardFrostCasterIsWounded,
  wxEnemyHealGuardFrostHighlightedTargetIsExecutable,
  wxEnemyHealGuardFrostIdealCell,
  wxEnemyHealGuardFrostInRange,
  wxEnemyHealGuardFrostLivePickBestDamageSpell,
  wxEnemyHealGuardFrostRange,
  wxEnemyHealGuardFrostTriggerRequiresZeroRange,
  wxEnemyHealLiveWouldBacklineGuardForFrost,
  wxEnemyHealLiveWouldHealOrApproachWoundedAlly,
} from "./wxEnemyHealGuardFrost.ts";

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

describe("WX enemy decideHealer backline-guard vs advertised Frost", () => {
  const mend = mustSpell("starter-heal");
  const rally = mustSpell("spell-rallying-cry");
  const frost = mustSpell("starter-frost");
  const origin = { x: 4, y: 4 };
  const frostDest = { x: 7, y: 4 };
  const healthyAlly = allyAt("pawn-1", 2, 4, 80, 100);
  const healthyQueen = allyAt("queen-1", 4, 4, 80, 100);
  const opponents = [playerAt("player", 7, 4)];
  const allies = [healthyAlly];

  it("treats catalog Blood Mend as range-0 heal trigger and Frost Bolt as fallback", () => {
    assert.equal(mend.spellType, "heal");
    assert.equal(Number(mend.damage), 0);
    assert.equal(Number(mend.healAmount), 12);
    assert.equal(Number(mend.range), 0);
    assert.equal(mend.targetType, "self");
    assert.equal(isWxEnemyHealGuardFrostTriggerSpell(mend), true);
    assert.equal(wxEnemyHealGuardFrostTriggerRequiresZeroRange(mend), true);
    assert.equal(frost.spellType, "damage");
    assert.equal(Number(frost.damage), 20);
    assert.equal(frost.debuffStat, "mp");
    assert.equal(Number(frost.range), 4);
    assert.equal(isWxEnemyHealGuardFrostSpell(frost), true);
    assert.equal(wxEnemyHealGuardFrostRange(frost), enemySpellRange(frost));
    assert.equal(isWxEnemyHealGuardFrostTriggerSpell(rally), true);
    assert.equal(rally.usableByEnemy, false);
  });

  it("queen z>=1 kit carries Frost + Blood Mend; king Rallying Cry is not usableByEnemy", () => {
    assert.deepEqual(buildEnemyKit("queen", 1), [
      "starter-frost",
      "starter-heal",
    ]);
    assert.deepEqual(buildEnemyKit("queen", 2), [
      "spell-inferno",
      "starter-heal",
    ]);
    assert.equal(buildEnemyKit("queen", 0).includes("starter-heal"), false);
    assert.equal(buildEnemyKit("king", 1).includes("spell-rallying-cry"), true);
    assert.equal(buildEnemyKit("king", 1).includes("starter-frost"), true);
    assert.equal(buildEnemyKit("rook", 1).includes("starter-heal"), false);
    assert.equal(AI_BACKLINE_PROTECT_ENABLED, true);
    assert.equal(AI_BACKLINE_GUARD_DISTANCE, 1);
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isWxEnemyHealGuardFrostTriggerSpell({
        spellType: "heal",
        damage: 0,
        healAmount: 12,
        range: 0,
        targetType: "self",
      }),
      true,
    );
    assert.equal(
      isWxEnemyHealGuardFrostSpell({
        spellType: "damage",
        damage: 20,
        debuffStat: "mp",
        debuffDuration: 1,
        range: 4,
        targetType: "enemy",
      }),
      true,
    );
    assert.equal(
      isWxEnemyHealGuardFrostSpell({
        spellType: "damage",
        damage: 20,
        range: 4,
        targetType: "enemy",
      }),
      false,
      "Strike-shaped damage without advertised MP is #762, not this leftover",
    );
    assert.equal(ENEMY_HEAL_ALLY_THRESHOLD_PCT, 0.5);
  });

  it("does not steal Strike, Slow, Iron Skin, Drain, Poison, Inferno, Nova, or heal", () => {
    assert.equal(isWxEnemyHealGuardFrostSpell(physicalAttackSpell), false);
    assert.equal(isWxEnemyHealGuardFrostSpell(mend), false);
    assert.equal(
      isWxEnemyHealGuardFrostSpell(mustSpell("spell-slow")),
      false,
      "#528/#762/#878 own 0-damage Slow",
    );
    assert.equal(
      isWxEnemyHealGuardFrostSpell(mustSpell("spell-iron-skin")),
      false,
      "#978 owns pack buff decide",
    );
    assert.equal(
      isWxEnemyHealGuardFrostSpell(mustSpell("starter-poison")),
      false,
      "#967 owns pack DoT decide",
    );
    assert.equal(
      isWxEnemyHealGuardFrostSpell(mustSpell("spell-inferno")),
      false,
    );
    assert.equal(
      isWxEnemyHealGuardFrostSpell(mustSpell("starter-drain")),
      false,
      "#921 owns Life Drain SP",
    );
    assert.equal(
      isWxEnemyHealGuardFrostSpell(mustSpell("spell-frost-nova")),
      false,
      "#917 owns player Frost Nova; hitsMultiple is not this leftover",
    );
    assert.equal(
      isWxEnemyHealGuardFrostBlockedDotSpell(mustSpell("spell-inferno")),
      true,
    );
    assert.equal(
      isWxEnemyHealGuardFrostBlockedBuffSpell(mustSpell("spell-iron-skin")),
      true,
    );
    assert.equal(isWxEnemyHealGuardFrostTriggerSpell(frost), false);
    assert.equal(
      isWxEnemyHealGuardFrostTriggerSpell(mustSpell("starter-drain")),
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
    const guard = wxEnemyHealGuardFrostIdealCell(healthyAlly, frostDest);
    assert.deepEqual(guard, { x: 3, y: 4 });
    assert.equal(
      wxEnemyHealLiveWouldBacklineGuardForFrost({
        availableSpells: [frost, mend],
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
        availableSpells: [frost, mend],
        origin,
        allies,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      false,
    );
    assert.equal(
      wxEnemyHealGuardFrostLivePickBestDamageSpell({
        availableSpells: [frost, mend],
        origin,
        targetCell: frostDest,
      })?.id,
      "starter-frost",
      "Frost at Chebyshev 3 is the live damage pick if decideCaster ran",
    );
  });

  it("picks in-range Frost when live would backline-guard a healthy pack", () => {
    const occupant = playerAt("player", 7, 4);
    const available = [frost, mend];
    assert.equal(wxEnemyHealGuardFrostInRange(origin, frostDest, frost), true);
    assert.equal(
      pickWxEnemyHealGuardFrostTriggerSpell(available)?.id,
      "starter-heal",
    );
    assert.equal(
      isWxEnemyHealGuardFrostWoundedAlly({
        ally: healthyAlly,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      false,
    );
    assert.equal(wxEnemyHealGuardFrostCasterIsWounded(healthyQueen), false);
    assert.equal(
      pickWxEnemyHealGuardFrostSpell({
        availableSpells: available,
        origin,
        targetCell: frostDest,
        allies,
        opponents,
        caster: healthyQueen,
        casterSide: "enemy",
        casterId: "queen-1",
      })?.id,
      "starter-frost",
    );
    const decided = shouldDecideWxEnemyHealGuardFrostCast({
      spell: frost,
      availableSpells: available,
      origin,
      targetCell: frostDest,
      occupant,
      allies,
      opponents,
      caster: healthyQueen,
      casterSide: "enemy",
      casterId: "queen-1",
    });
    const executable = canExecuteWxEnemyHealGuardFrostCast({
      spell: frost,
      availableSpells: available,
      origin,
      targetCell: frostDest,
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
      wxEnemyHealGuardFrostHighlightedTargetIsExecutable({
        decided,
        executable,
      }),
      true,
    );
  });

  it("cannot execute Frost beyond range 4, on a corpse, ally, or empty tile", () => {
    const available = [frost, mend];
    const tooFar = { x: 9, y: 4 };
    assert.equal(enemyCastRangeOk(origin, tooFar, frost), false);
    assert.equal(wxEnemyHealGuardFrostInRange(origin, tooFar, frost), false);
    const base = {
      spell: frost,
      availableSpells: available,
      origin,
      allies,
      opponents,
      caster: healthyQueen,
      casterSide: "enemy" as const,
      casterId: "queen-1",
    };
    assert.equal(
      canExecuteWxEnemyHealGuardFrostCast({
        ...base,
        targetCell: tooFar,
        occupant: playerAt("player", 9, 4),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealGuardFrostCast({
        ...base,
        targetCell: frostDest,
        occupant: playerAt("player", 7, 4, 0),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealGuardFrostCast({
        ...base,
        targetCell: frostDest,
        occupant: { id: "queen-2", x: 7, y: 4, hp: 12, side: "enemy" },
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealGuardFrostCast({
        ...base,
        targetCell: frostDest,
        occupant: null,
      }),
      false,
    );
    assert.equal(
      wxEnemyHealGuardFrostHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("does not steal wounded-ally approach (#1026) or wounded-caster self-heal (#985)", () => {
    const available = [frost, mend];
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
      pickWxEnemyHealGuardFrostSpell({
        availableSpells: available,
        origin,
        targetCell: frostDest,
        allies: [woundedAlly],
        opponents,
        caster: healthyQueen,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      null,
      "#1026 owns wounded-ally approach vs Frost",
    );
    const woundedQueen = allyAt("queen-1", 4, 4, 40, 100);
    assert.equal(wxEnemyHealGuardFrostCasterIsWounded(woundedQueen), true);
    assert.equal(
      pickWxEnemyHealGuardFrostSpell({
        availableSpells: available,
        origin,
        targetCell: frostDest,
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

  it("does not fire when already on the guard tile (live already falls through)", () => {
    const onGuard = { x: 3, y: 4 };
    const casterOnGuard = allyAt("queen-1", 3, 4, 80, 100);
    assert.deepEqual(
      wxEnemyHealGuardFrostIdealCell(healthyAlly, frostDest),
      onGuard,
    );
    assert.equal(
      wxEnemyHealLiveWouldBacklineGuardForFrost({
        availableSpells: [frost, mend],
        origin: onGuard,
        allies,
        opponents,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      false,
    );
    assert.equal(
      pickWxEnemyHealGuardFrostSpell({
        availableSpells: [frost, mend],
        origin: onGuard,
        targetCell: frostDest,
        allies,
        opponents,
        caster: casterOnGuard,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      null,
      "already-on-guard falls through to decideCaster (#762 / #989)",
    );
  });

  it("does not steal queen Inferno+heal or rook Iron Skin leftovers", () => {
    const inferno = mustSpell("spell-inferno");
    const iron = mustSpell("spell-iron-skin");
    assert.equal(
      pickWxEnemyHealGuardFrostSpell({
        availableSpells: [inferno, mend],
        origin,
        targetCell: frostDest,
        allies,
        opponents,
        caster: healthyQueen,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      null,
      "queen z>=2 Inferno stays #1033 approach / next-cron guard",
    );
    assert.equal(
      pickWxEnemyHealGuardFrostSpell({
        availableSpells: [frost, inferno, mend],
        origin,
        targetCell: frostDest,
        allies,
        opponents,
        caster: healthyQueen,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      null,
      "in-range Inferno leftover is not this Frost fill",
    );
    assert.equal(
      pickWxEnemyHealGuardFrostSpell({
        availableSpells: [iron, mend],
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

  it("king Rallying Cry filtered from availableSpells still guards then Frosts", () => {
    const available = [frost];
    const king = allyAt("king-1", 4, 4, 80, 100);
    assert.equal(pickWxEnemyHealGuardFrostTriggerSpell(available), null);
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
      wxEnemyHealLiveWouldBacklineGuardForFrost({
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
      pickWxEnemyHealGuardFrostSpell({
        availableSpells: available,
        origin,
        targetCell: frostDest,
        allies,
        opponents,
        caster: king,
        casterSide: "enemy",
        casterId: "king-1",
      })?.id,
      "starter-frost",
    );
  });

  it("still decides wall-blocked Frost (picker skips LoS) and does not debit AP", () => {
    const available = [frost, mend];
    assert.equal(Number(frost.apCost), 3);
    assert.equal(Number(mend.apCost), 3);
    assert.equal(
      canExecuteWxEnemyHealGuardFrostCast({
        spell: frost,
        availableSpells: available,
        origin,
        targetCell: frostDest,
        occupant: playerAt("player", 7, 4),
        allies,
        opponents,
        caster: healthyQueen,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      true,
      "catalog Frost has no lineOfSight flag; healer / WX skip LoS",
    );
  });

  it("cannot decide Strike, Slow, Iron Skin, Drain, Inferno, or heal as this Frost leftover", () => {
    const occupant = playerAt("player", 7, 4);
    const base = {
      origin,
      targetCell: frostDest,
      occupant,
      allies,
      opponents,
      caster: healthyQueen,
      casterSide: "enemy" as const,
      casterId: "queen-1",
    };
    assert.equal(
      canExecuteWxEnemyHealGuardFrostCast({
        ...base,
        spell: physicalAttackSpell,
        availableSpells: [physicalAttackSpell, mend],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealGuardFrostCast({
        ...base,
        spell: mustSpell("spell-slow"),
        availableSpells: [mustSpell("spell-slow"), mend],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealGuardFrostCast({
        ...base,
        spell: mustSpell("spell-inferno"),
        availableSpells: [mustSpell("spell-inferno"), mend],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealGuardFrostCast({
        ...base,
        spell: mend,
        availableSpells: [frost, mend],
      }),
      false,
      "#985 / #989 own the range-0 heal picker; do not remap dest onto the caster",
    );
  });
});
