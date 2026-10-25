/**
 * Combat action parity: pack-enemy healer-kit fallback into
 * `decideCaster` wounded-retreat vs advertised in-range Frost.
 *
 * King z>=1 assigns Rallying Cry (`healAmount > 0`) so `inferArchetype`
 * marks healer, but `usableByEnemy: false` drops it from WX
 * `availableSpells`. Live then skips ally-heal, skips backline-guard
 * when there are no allies (or the king already stands on the guard
 * tile), and `decideCaster` retreats below 30% HP before
 * `pickBestDamageSpell`. A decided legal Frost dest (living hostile in
 * Chebyshev range on that leftover) is executable; an illegal dest
 * cannot execute; live still retreats.
 *
 * #1054 owns Frost *casters* (queen z=0 / bishop) and yields healer
 * kits. #985 / #1026 / #1034 own Blood Mend self-heal, wounded-ally
 * approach, and off-guard backline.
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
  ENEMY_RETREAT_HP_PCT,
} from "../data/gameConstants.ts";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { buildEnemyKit } from "./enemyAI.ts";
import { enemyCastRangeOk, enemySpellRange } from "./targeting.ts";
import {
  canExecuteWxEnemyHealRetreatFrostCast,
  isWxEnemyHealRetreatFrostBlockedBuffSpell,
  isWxEnemyHealRetreatFrostBlockedDotSpell,
  isWxEnemyHealRetreatFrostHealKitSpell,
  isWxEnemyHealRetreatFrostSpell,
  isWxEnemyHealRetreatFrostTriggerSpell,
  pickWxEnemyHealRetreatFrostSpell,
  shouldDecideWxEnemyHealRetreatFrostCast,
  wxEnemyHealLiveWouldBacklineGuardForFrost,
  wxEnemyHealLiveWouldHealOrApproachWoundedAlly,
  wxEnemyHealLiveWouldRetreatForFrost,
  wxEnemyHealRetreatFrostCasterWouldRetreat,
  wxEnemyHealRetreatFrostHighlightedTargetIsExecutable,
  wxEnemyHealRetreatFrostIdealGuardCell,
  wxEnemyHealRetreatFrostInRange,
  wxEnemyHealRetreatFrostKitIsHealer,
  wxEnemyHealRetreatFrostLivePickBestDamageSpell,
  wxEnemyHealRetreatFrostRange,
  wxEnemyHealRetreatFrostYieldsToWoundedCasterSelfHeal,
} from "./wxEnemyHealRetreatFrost.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function playerAt(id: string, x: number, y: number, hp = 40) {
  return { id, x, y, hp, side: "player" as const };
}

function enemyAt(
  id: string,
  x: number,
  y: number,
  hp: number,
  maxHp: number,
  extras: { isSummon?: boolean } = {},
) {
  return { id, x, y, hp, maxHp, side: "enemy" as const, ...extras };
}

describe("WX enemy healer-kit fallback-retreat vs advertised Frost", () => {
  const mend = mustSpell("starter-heal");
  const rally = mustSpell("spell-rallying-cry");
  const frost = mustSpell("starter-frost");
  const origin = { x: 4, y: 4 };
  const frostDest = { x: 7, y: 4 };
  const woundedKing = enemyAt("king-1", 4, 4, 20, 100);
  const healthyKing = enemyAt("king-1", 4, 4, 80, 100);
  const opponents = [playerAt("player", 7, 4)];
  const kingAssigned = [frost, rally];
  const kingAvailable = [frost];

  it("treats catalog Frost Bolt as the healer-kit fallback leftover", () => {
    assert.equal(frost.spellType, "damage");
    assert.equal(Number(frost.damage), 20);
    assert.equal(frost.debuffStat, "mp");
    assert.equal(Number(frost.range), 4);
    assert.equal(isWxEnemyHealRetreatFrostSpell(frost), true);
    assert.equal(wxEnemyHealRetreatFrostRange(frost), enemySpellRange(frost));
    assert.equal(isWxEnemyHealRetreatFrostHealKitSpell(frost), false);
    assert.equal(isWxEnemyHealRetreatFrostHealKitSpell(mend), true);
    assert.equal(isWxEnemyHealRetreatFrostHealKitSpell(rally), true);
    assert.equal(isWxEnemyHealRetreatFrostTriggerSpell(mend), true);
    assert.equal(isWxEnemyHealRetreatFrostTriggerSpell(rally), true);
    assert.equal(rally.usableByEnemy, false);
    assert.equal(ENEMY_RETREAT_HP_PCT, 0.3);
    assert.equal(ENEMY_HEAL_ALLY_THRESHOLD_PCT, 0.5);
    assert.equal(AI_BACKLINE_PROTECT_ENABLED, true);
    assert.equal(AI_BACKLINE_GUARD_DISTANCE, 1);
  });

  it("king z>=1 assigns Rallying Cry (healer) while queen z=0 / bishop stay casters", () => {
    assert.deepEqual(buildEnemyKit("king", 1), [
      "starter-frost",
      "spell-rallying-cry",
    ]);
    assert.deepEqual(buildEnemyKit("queen", 0), ["starter-frost"]);
    assert.deepEqual(buildEnemyKit("bishop", 0), ["starter-frost"]);
    assert.deepEqual(buildEnemyKit("queen", 1), [
      "starter-frost",
      "starter-heal",
    ]);
    assert.equal(wxEnemyHealRetreatFrostKitIsHealer([frost]), false);
    assert.equal(wxEnemyHealRetreatFrostKitIsHealer([frost, mend]), true);
    assert.equal(wxEnemyHealRetreatFrostKitIsHealer([frost, rally]), true);
    assert.equal(
      wxEnemyHealRetreatFrostKitIsHealer(kingAvailable),
      false,
      "availableSpells drop Rallying Cry — inferArchetype still uses assigned",
    );
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isWxEnemyHealRetreatFrostSpell({
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
      isWxEnemyHealRetreatFrostSpell({
        spellType: "damage",
        damage: 20,
        range: 4,
        targetType: "enemy",
      }),
      false,
      "Strike-shaped damage without advertised MP is #762, not this leftover",
    );
  });

  it("does not steal Strike, Slow, Iron Skin, Drain, Poison, Inferno, Nova, or heal", () => {
    assert.equal(isWxEnemyHealRetreatFrostSpell(physicalAttackSpell), false);
    assert.equal(isWxEnemyHealRetreatFrostSpell(mend), false);
    assert.equal(isWxEnemyHealRetreatFrostSpell(rally), false);
    assert.equal(
      isWxEnemyHealRetreatFrostSpell(mustSpell("spell-slow")),
      false,
      "#528/#762/#878 own 0-damage Slow",
    );
    assert.equal(
      isWxEnemyHealRetreatFrostSpell(mustSpell("spell-iron-skin")),
      false,
      "#978 owns pack buff decide",
    );
    assert.equal(
      isWxEnemyHealRetreatFrostSpell(mustSpell("starter-poison")),
      false,
      "#967 owns pack DoT decide",
    );
    assert.equal(
      isWxEnemyHealRetreatFrostSpell(mustSpell("spell-inferno")),
      false,
    );
    assert.equal(
      isWxEnemyHealRetreatFrostSpell(mustSpell("starter-drain")),
      false,
      "#921 owns Life Drain SP",
    );
    assert.equal(
      isWxEnemyHealRetreatFrostSpell(mustSpell("spell-frost-nova")),
      false,
      "#917 owns player Frost Nova; hitsMultiple is not this leftover",
    );
    assert.equal(
      isWxEnemyHealRetreatFrostBlockedDotSpell(mustSpell("spell-inferno")),
      true,
    );
    assert.equal(
      isWxEnemyHealRetreatFrostBlockedDotSpell(mustSpell("starter-poison")),
      true,
    );
    assert.equal(
      isWxEnemyHealRetreatFrostBlockedBuffSpell(mustSpell("spell-iron-skin")),
      true,
    );
  });

  it("live decideHealer still falls through to decideCaster retreat before pickBestDamageSpell", () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const ai = readFileSync(join(here, "enemyAI.ts"), "utf8");
    const wx = readFileSync(
      join(here, "../components/WorldExploration.tsx"),
      "utf8",
    );
    const infer = ai.indexOf("function inferArchetype");
    assert.ok(infer >= 0, "live inferArchetype is present");
    const inferBody = ai.slice(infer, infer + 900);
    assert.ok(inferBody.includes("ctx.assignedSpells"));
    assert.ok(inferBody.includes('return "healer"'));
    const healerAt = ai.indexOf("function decideHealer");
    assert.ok(healerAt >= 0, "live decideHealer is present");
    const healerBody = ai.slice(healerAt, healerAt + 4200);
    assert.ok(healerBody.includes("ctx.availableSpells.find"));
    assert.ok(healerBody.includes("decideCaster("));
    assert.ok(healerBody.includes("fallback-caster"));
    const casterAt = ai.indexOf("function decideCaster");
    assert.ok(casterAt >= 0, "live decideCaster is present");
    const casterBody = ai.slice(casterAt, casterAt + 2800);
    const retreatAt = casterBody.indexOf("ENEMY_RETREAT_HP_PCT");
    const pickAt = casterBody.indexOf("pickBestDamageSpell");
    assert.ok(retreatAt >= 0, "decideCaster still gates on retreat HP");
    assert.ok(pickAt >= 0, "decideCaster still calls pickBestDamageSpell");
    assert.ok(
      retreatAt < pickAt,
      "retreat still returns before the Frost pick",
    );
    assert.ok(casterBody.includes('intent: "retreat"'));
    assert.ok(wx.includes("s.usableByEnemy !== false"));
    assert.equal(wxEnemyHealRetreatFrostCasterWouldRetreat(woundedKing), true);
    assert.equal(wxEnemyHealRetreatFrostCasterWouldRetreat(healthyKing), false);
    assert.equal(
      wxEnemyHealRetreatFrostCasterWouldRetreat(
        enemyAt("king-1", 4, 4, 30, 100),
      ),
      false,
      "hpFrac 0.3 is not < ENEMY_RETREAT_HP_PCT",
    );
    assert.equal(
      wxEnemyHealLiveWouldRetreatForFrost({
        assignedSpells: kingAssigned,
        availableSpells: kingAvailable,
        origin,
        caster: woundedKing,
        opponents,
      }),
      true,
    );
    assert.equal(
      wxEnemyHealRetreatFrostLivePickBestDamageSpell({
        availableSpells: kingAvailable,
        origin,
        targetCell: frostDest,
      })?.id,
      "starter-frost",
      "Frost at Chebyshev 3 is the live damage pick if retreat did not run",
    );
  });

  it("picks in-range Frost on a solo wounded king (Rallying Cry assigned, not available)", () => {
    const occupant = playerAt("player", 7, 4);
    assert.equal(
      wxEnemyHealRetreatFrostInRange(origin, frostDest, frost),
      true,
    );
    assert.equal(
      pickWxEnemyHealRetreatFrostSpell({
        assignedSpells: kingAssigned,
        availableSpells: kingAvailable,
        origin,
        targetCell: frostDest,
        opponents,
        caster: woundedKing,
      })?.id,
      "starter-frost",
    );
    const decided = shouldDecideWxEnemyHealRetreatFrostCast({
      spell: frost,
      assignedSpells: kingAssigned,
      availableSpells: kingAvailable,
      origin,
      targetCell: frostDest,
      occupant,
      opponents,
      caster: woundedKing,
      casterSide: "enemy",
    });
    const executable = canExecuteWxEnemyHealRetreatFrostCast({
      spell: frost,
      assignedSpells: kingAssigned,
      availableSpells: kingAvailable,
      origin,
      targetCell: frostDest,
      occupant,
      opponents,
      caster: woundedKing,
      casterSide: "enemy",
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      wxEnemyHealRetreatFrostHighlightedTargetIsExecutable({
        decided,
        executable,
      }),
      true,
    );
  });

  it("picks Frost when a pack king already stands on the ideal guard tile", () => {
    const ward = enemyAt("pawn-1", 3, 4, 80, 100);
    const kingOnGuard = enemyAt("king-1", 4, 4, 20, 100);
    const guardOrigin = { x: 4, y: 4 };
    const guard = wxEnemyHealRetreatFrostIdealGuardCell(ward, opponents[0]);
    assert.deepEqual(guard, { x: 4, y: 4 });
    assert.equal(
      wxEnemyHealLiveWouldBacklineGuardForFrost({
        availableSpells: kingAvailable,
        origin: guardOrigin,
        allies: [ward],
        opponents,
        casterSide: "enemy",
        casterId: kingOnGuard.id,
      }),
      false,
      "already on the guard tile — live falls through to decideCaster",
    );
    assert.equal(
      pickWxEnemyHealRetreatFrostSpell({
        assignedSpells: kingAssigned,
        availableSpells: kingAvailable,
        origin: guardOrigin,
        targetCell: frostDest,
        allies: [ward],
        opponents,
        caster: kingOnGuard,
      })?.id,
      "starter-frost",
    );
  });

  it("cannot execute Frost beyond range 4, on a corpse, ally, or empty tile", () => {
    const tooFar = { x: 9, y: 4 };
    assert.equal(enemyCastRangeOk(origin, tooFar, frost), false);
    assert.equal(wxEnemyHealRetreatFrostInRange(origin, tooFar, frost), false);
    const base = {
      spell: frost,
      assignedSpells: kingAssigned,
      availableSpells: kingAvailable,
      origin,
      opponents,
      caster: woundedKing,
      casterSide: "enemy" as const,
    };
    assert.equal(
      canExecuteWxEnemyHealRetreatFrostCast({
        ...base,
        targetCell: tooFar,
        occupant: playerAt("player", 9, 4),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealRetreatFrostCast({
        ...base,
        targetCell: frostDest,
        occupant: playerAt("player", 7, 4, 0),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealRetreatFrostCast({
        ...base,
        targetCell: frostDest,
        occupant: { id: "king-2", x: 7, y: 4, hp: 12, side: "enemy" },
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealRetreatFrostCast({
        ...base,
        targetCell: frostDest,
        occupant: null,
      }),
      false,
    );
    assert.equal(
      wxEnemyHealRetreatFrostHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("does not fire when the king is healthy (live never reaches retreat)", () => {
    assert.equal(
      wxEnemyHealLiveWouldRetreatForFrost({
        assignedSpells: kingAssigned,
        availableSpells: kingAvailable,
        origin,
        caster: healthyKing,
        opponents,
      }),
      false,
    );
    assert.equal(
      pickWxEnemyHealRetreatFrostSpell({
        assignedSpells: kingAssigned,
        availableSpells: kingAvailable,
        origin,
        targetCell: frostDest,
        opponents,
        caster: healthyKing,
      }),
      null,
      "healthy healer-kit fallback already reaches pickBestDamageSpell (#762)",
    );
  });

  it("yields queen Blood Mend self-heal (#985) and wounded-ally approach (#1026)", () => {
    const woundedQueen = enemyAt("queen-1", 4, 4, 20, 100);
    const queenAssigned = [frost, mend];
    const queenAvailable = [frost, mend];
    assert.equal(
      wxEnemyHealRetreatFrostYieldsToWoundedCasterSelfHeal({
        availableSpells: queenAvailable,
        allies: [],
        caster: woundedQueen,
        casterSide: "enemy",
        casterId: woundedQueen.id,
      }),
      true,
    );
    assert.equal(
      pickWxEnemyHealRetreatFrostSpell({
        assignedSpells: queenAssigned,
        availableSpells: queenAvailable,
        origin,
        targetCell: frostDest,
        opponents,
        caster: woundedQueen,
      }),
      null,
      "#985 owns queen z>=1 Blood Mend self-heal",
    );
    const woundedAlly = enemyAt("pawn-1", 8, 4, 20, 100);
    assert.equal(
      wxEnemyHealLiveWouldHealOrApproachWoundedAlly({
        availableSpells: queenAvailable,
        allies: [woundedAlly],
        casterSide: "enemy",
        casterId: woundedQueen.id,
      }),
      true,
    );
    assert.equal(
      pickWxEnemyHealRetreatFrostSpell({
        assignedSpells: queenAssigned,
        availableSpells: queenAvailable,
        origin,
        targetCell: frostDest,
        allies: [woundedAlly],
        opponents,
        caster: woundedQueen,
      }),
      null,
      "#1026 owns wounded-ally Blood Mend approach",
    );
  });

  it("yields Frost casters to #1054 and off-guard pack kings to #1034", () => {
    const woundedBishop = enemyAt("bishop-1", 4, 4, 20, 100);
    assert.equal(
      wxEnemyHealLiveWouldRetreatForFrost({
        assignedSpells: [frost],
        availableSpells: [frost],
        origin,
        caster: woundedBishop,
        opponents,
      }),
      false,
      "bishop is a Frost caster — #1054 owns wounded-retreat",
    );
    assert.equal(
      pickWxEnemyHealRetreatFrostSpell({
        assignedSpells: [frost],
        availableSpells: [frost],
        origin,
        targetCell: frostDest,
        opponents,
        caster: woundedBishop,
      }),
      null,
    );
    const offGuardKing = enemyAt("king-1", 4, 4, 20, 100);
    const farWard = enemyAt("pawn-1", 2, 4, 80, 100);
    assert.equal(
      wxEnemyHealLiveWouldBacklineGuardForFrost({
        availableSpells: kingAvailable,
        origin,
        allies: [farWard],
        opponents,
        casterSide: "enemy",
        casterId: offGuardKing.id,
      }),
      true,
    );
    assert.equal(
      pickWxEnemyHealRetreatFrostSpell({
        assignedSpells: kingAssigned,
        availableSpells: kingAvailable,
        origin,
        targetCell: frostDest,
        allies: [farWard],
        opponents,
        caster: offGuardKing,
      }),
      null,
      "#1034 owns pack healer Frost backline-guard while guard !== origin",
    );
  });

  it("does not steal queen Inferno+heal or rook Iron Skin leftovers", () => {
    const inferno = mustSpell("spell-inferno");
    const iron = mustSpell("spell-iron-skin");
    const woundedQueen = enemyAt("queen-1", 4, 4, 20, 100);
    assert.equal(
      pickWxEnemyHealRetreatFrostSpell({
        assignedSpells: [inferno, mend],
        availableSpells: [inferno, mend],
        origin,
        targetCell: frostDest,
        opponents,
        caster: woundedQueen,
      }),
      null,
      "queen z>=2 Inferno stays #967 / #1039",
    );
    assert.equal(
      pickWxEnemyHealRetreatFrostSpell({
        assignedSpells: kingAssigned,
        availableSpells: [inferno],
        origin,
        targetCell: frostDest,
        opponents,
        caster: woundedKing,
      }),
      null,
      "Inferno-only is #967 — live damage>0 pick is empty",
    );
    assert.equal(
      pickWxEnemyHealRetreatFrostSpell({
        assignedSpells: kingAssigned,
        availableSpells: [iron],
        origin,
        targetCell: origin,
        opponents,
        caster: woundedKing,
      }),
      null,
      "Iron Skin stays #978",
    );
  });

  it("king Frost+Poison still picks Frost, not the DoT leftover", () => {
    const poison = mustSpell("starter-poison");
    assert.equal(
      pickWxEnemyHealRetreatFrostSpell({
        assignedSpells: kingAssigned,
        availableSpells: [frost, poison],
        origin,
        targetCell: frostDest,
        opponents,
        caster: woundedKing,
      })?.id,
      "starter-frost",
    );
    assert.equal(
      pickWxEnemyHealRetreatFrostSpell({
        assignedSpells: kingAssigned,
        availableSpells: [poison],
        origin,
        targetCell: frostDest,
        opponents,
        caster: woundedKing,
      }),
      null,
      "#967 owns Poison when Frost is absent",
    );
  });

  it("still decides wall-blocked Frost (WX skips LoS) and does not debit AP", () => {
    assert.equal(Number(frost.apCost), 3);
    assert.equal(
      canExecuteWxEnemyHealRetreatFrostCast({
        spell: frost,
        assignedSpells: kingAssigned,
        availableSpells: kingAvailable,
        origin,
        targetCell: frostDest,
        occupant: playerAt("player", 7, 4),
        opponents,
        caster: woundedKing,
        casterSide: "enemy",
      }),
      true,
      "catalog Frost has no lineOfSight flag; WX pack execute skips LoS",
    );
  });

  it("cannot decide Strike, Slow, Iron Skin, Drain, Inferno, or heal as this Frost leftover", () => {
    const occupant = playerAt("player", 7, 4);
    const base = {
      origin,
      targetCell: frostDest,
      occupant,
      opponents,
      caster: woundedKing,
      casterSide: "enemy" as const,
    };
    assert.equal(
      canExecuteWxEnemyHealRetreatFrostCast({
        ...base,
        spell: physicalAttackSpell,
        assignedSpells: kingAssigned,
        availableSpells: [physicalAttackSpell],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealRetreatFrostCast({
        ...base,
        spell: mustSpell("spell-slow"),
        assignedSpells: kingAssigned,
        availableSpells: [mustSpell("spell-slow")],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealRetreatFrostCast({
        ...base,
        spell: mustSpell("spell-inferno"),
        assignedSpells: kingAssigned,
        availableSpells: [mustSpell("spell-inferno")],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealRetreatFrostCast({
        ...base,
        spell: mend,
        assignedSpells: [frost, mend],
        availableSpells: [frost, mend],
        caster: enemyAt("queen-1", 4, 4, 20, 100),
      }),
      false,
      "#985 owns the range-0 heal picker; do not remap dest onto the caster",
    );
  });
});
