/**
 * Combat action parity: pack-enemy `decideCaster` wounded-retreat vs
 * advertised in-range Strike. A decided legal Strike dest (living hostile
 * in Chebyshev range 1, caster HP below 30% so live would retreat) is
 * executable; an illegal dest cannot execute; live still retreats.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ENEMY_RETREAT_HP_PCT } from "../data/gameConstants.ts";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { buildEnemyKit } from "./enemyAI.ts";
import { enemyCastRangeOk, enemySpellRange } from "./targeting.ts";
import {
  canExecuteWxEnemyCasterRetreatStrikeCast,
  isWxEnemyCasterRetreatStrikeBlockedBuffSpell,
  isWxEnemyCasterRetreatStrikeBlockedDotSpell,
  isWxEnemyCasterRetreatStrikeHealKitSpell,
  isWxEnemyCasterRetreatStrikeSpell,
  pickWxEnemyCasterRetreatStrikeSpell,
  shouldDecideWxEnemyCasterRetreatStrikeCast,
  wxEnemyCasterLiveWouldRetreatForStrike,
  wxEnemyCasterRetreatStrikeHighlightedTargetIsExecutable,
  wxEnemyCasterRetreatStrikeInRange,
  wxEnemyCasterRetreatStrikeKitIsCaster,
  wxEnemyCasterRetreatStrikeKitIsHealer,
  wxEnemyCasterRetreatStrikeLivePickBestDamageSpell,
  wxEnemyCasterRetreatStrikeRange,
  wxEnemyCasterRetreatStrikeWouldRetreat,
} from "./wxEnemyCasterRetreatStrike.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function playerAt(id: string, x: number, y: number, hp = 40) {
  return { id, x, y, hp, side: "player" as const };
}

function casterAt(
  id: string,
  x: number,
  y: number,
  hp: number,
  maxHp: number,
  pieceType = "rook",
) {
  return { id, x, y, hp, maxHp, side: "enemy" as const, pieceType };
}

describe("WX enemy decideCaster wounded-retreat vs advertised Strike", () => {
  const mend = mustSpell("starter-heal");
  const rally = mustSpell("spell-rallying-cry");
  const frost = mustSpell("starter-frost");
  const strike = physicalAttackSpell;
  const iron = mustSpell("spell-iron-skin");
  const venom = mustSpell("spell-venom-strike");
  const origin = { x: 4, y: 4 };
  const strikeDest = { x: 5, y: 4 };
  const woundedRook = casterAt("rook-1", 4, 4, 20, 100);
  const healthyRook = casterAt("rook-1", 4, 4, 80, 100);
  const opponents = [playerAt("player", 5, 4)];
  const rookKit = [strike, iron];
  const pawnKit = [strike, venom];

  it("treats catalog Strike as the wounded-retreat fallback", () => {
    assert.equal(strike.spellType, "damage");
    assert.equal(Number(strike.damage), 10);
    assert.equal(strike.debuffStat, undefined);
    assert.equal(Number(strike.range), 1);
    assert.equal(strike.isPhysical, true);
    assert.equal(isWxEnemyCasterRetreatStrikeSpell(strike), true);
    assert.equal(
      wxEnemyCasterRetreatStrikeRange(strike),
      enemySpellRange(strike),
    );
    assert.equal(isWxEnemyCasterRetreatStrikeHealKitSpell(strike), false);
    assert.equal(isWxEnemyCasterRetreatStrikeHealKitSpell(mend), true);
    assert.equal(isWxEnemyCasterRetreatStrikeHealKitSpell(rally), true);
    assert.equal(rally.usableByEnemy, false);
    assert.equal(ENEMY_RETREAT_HP_PCT, 0.3);
  });

  it("rook/pawn z>=1 kits infer caster via Iron Skin / Venom; z=0 is charger", () => {
    assert.deepEqual(buildEnemyKit("rook", 0), ["physical_attack"]);
    assert.deepEqual(buildEnemyKit("rook", 1), [
      "physical_attack",
      "spell-iron-skin",
    ]);
    assert.deepEqual(buildEnemyKit("pawn", 0), ["physical_attack"]);
    assert.deepEqual(buildEnemyKit("pawn", 1), [
      "physical_attack",
      "spell-venom-strike",
    ]);
    assert.equal(wxEnemyCasterRetreatStrikeKitIsCaster([strike]), false);
    assert.equal(wxEnemyCasterRetreatStrikeKitIsCaster(rookKit), true);
    assert.equal(wxEnemyCasterRetreatStrikeKitIsCaster(pawnKit), true);
    assert.equal(wxEnemyCasterRetreatStrikeKitIsCaster([frost]), true);
    assert.equal(wxEnemyCasterRetreatStrikeKitIsHealer([strike]), false);
    assert.equal(wxEnemyCasterRetreatStrikeKitIsHealer([strike, mend]), true);
    assert.equal(wxEnemyCasterRetreatStrikeKitIsHealer([frost, rally]), true);
    assert.equal(
      wxEnemyCasterRetreatStrikeKitIsCaster([frost, rally]),
      false,
      "heal kits never infer caster",
    );
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isWxEnemyCasterRetreatStrikeSpell({
        spellType: "damage",
        damage: 10,
        range: 1,
        targetType: "enemy",
      }),
      true,
    );
    assert.equal(
      isWxEnemyCasterRetreatStrikeSpell({
        spellType: "damage",
        damage: 20,
        debuffStat: "mp",
        debuffDuration: 1,
        range: 4,
        targetType: "enemy",
      }),
      false,
      "Frost-shaped damage with advertised MP is #1054, not this leftover",
    );
  });

  it("does not steal Frost, Slow, Iron Skin, Drain, Poison, Inferno, Nova, or heal", () => {
    assert.equal(isWxEnemyCasterRetreatStrikeSpell(frost), false);
    assert.equal(isWxEnemyCasterRetreatStrikeSpell(mend), false);
    assert.equal(
      isWxEnemyCasterRetreatStrikeSpell(mustSpell("spell-slow")),
      false,
      "#528/#762/#878 own 0-damage Slow",
    );
    assert.equal(
      isWxEnemyCasterRetreatStrikeSpell(iron),
      false,
      "#978 owns pack buff decide",
    );
    assert.equal(
      isWxEnemyCasterRetreatStrikeSpell(venom),
      false,
      "#967 owns pack DoT decide",
    );
    assert.equal(
      isWxEnemyCasterRetreatStrikeSpell(mustSpell("starter-poison")),
      false,
      "#967 owns pack DoT decide",
    );
    assert.equal(
      isWxEnemyCasterRetreatStrikeSpell(mustSpell("spell-inferno")),
      false,
    );
    assert.equal(
      isWxEnemyCasterRetreatStrikeSpell(mustSpell("starter-drain")),
      false,
      "#921 owns Life Drain SP",
    );
    assert.equal(
      isWxEnemyCasterRetreatStrikeSpell(mustSpell("spell-frost-nova")),
      false,
      "#917 owns player Frost Nova; hitsMultiple is not this leftover",
    );
    assert.equal(
      isWxEnemyCasterRetreatStrikeBlockedDotSpell(mustSpell("spell-inferno")),
      true,
    );
    assert.equal(isWxEnemyCasterRetreatStrikeBlockedDotSpell(venom), true);
    assert.equal(isWxEnemyCasterRetreatStrikeBlockedBuffSpell(iron), true);
  });

  it("live decideCaster still retreats below 30% HP before pickBestDamageSpell", () => {
    const ai = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "enemyAI.ts"),
      "utf8",
    );
    const start = ai.indexOf("function decideCaster");
    assert.ok(start >= 0, "live decideCaster is present");
    const body = ai.slice(start, start + 2800);
    const retreatAt = body.indexOf("ENEMY_RETREAT_HP_PCT");
    const pickAt = body.indexOf("pickBestDamageSpell");
    assert.ok(retreatAt >= 0, "decideCaster still gates on retreat HP");
    assert.ok(pickAt >= 0, "decideCaster still calls pickBestDamageSpell");
    assert.ok(
      retreatAt < pickAt,
      "retreat still returns before the Strike pick",
    );
    assert.ok(body.includes('intent: "retreat"'));
    assert.ok(body.includes("falls back, wounded"));
    const inferStart = ai.indexOf("function inferArchetype");
    const inferBody = ai.slice(inferStart, inferStart + 1600);
    const casterAtPos = inferBody.indexOf('return "caster"');
    const knightAt = inferBody.indexOf('pt === "knight"');
    const chargerAt = inferBody.indexOf("charger");
    assert.ok(casterAtPos >= 0, "inferArchetype still has a caster return");
    assert.ok(casterAtPos < knightAt, "caster still beats knight flanker");
    assert.ok(knightAt < chargerAt, "knight flanker still beats melee charger");
    assert.equal(wxEnemyCasterRetreatStrikeWouldRetreat(woundedRook), true);
    assert.equal(wxEnemyCasterRetreatStrikeWouldRetreat(healthyRook), false);
    assert.equal(
      wxEnemyCasterRetreatStrikeWouldRetreat(casterAt("rook-1", 4, 4, 30, 100)),
      false,
      "hpFrac 0.3 is not < ENEMY_RETREAT_HP_PCT",
    );
    assert.equal(
      wxEnemyCasterLiveWouldRetreatForStrike({
        assignedSpells: rookKit,
        availableSpells: rookKit,
        caster: woundedRook,
        opponents,
      }),
      true,
    );
    assert.equal(
      wxEnemyCasterRetreatStrikeLivePickBestDamageSpell({
        availableSpells: rookKit,
        origin,
        targetCell: strikeDest,
      })?.id,
      "physical_attack",
      "Strike at Chebyshev 1 is the live damage pick if retreat did not run",
    );
  });

  it("picks in-range Strike when live would retreat a wounded rook caster", () => {
    const occupant = playerAt("player", 5, 4);
    assert.equal(
      wxEnemyCasterRetreatStrikeInRange(origin, strikeDest, strike),
      true,
    );
    assert.equal(
      pickWxEnemyCasterRetreatStrikeSpell({
        assignedSpells: rookKit,
        availableSpells: rookKit,
        origin,
        targetCell: strikeDest,
        opponents,
        caster: woundedRook,
      })?.id,
      "physical_attack",
    );
    const decided = shouldDecideWxEnemyCasterRetreatStrikeCast({
      spell: strike,
      assignedSpells: rookKit,
      availableSpells: rookKit,
      origin,
      targetCell: strikeDest,
      occupant,
      opponents,
      caster: woundedRook,
      casterSide: "enemy",
    });
    const executable = canExecuteWxEnemyCasterRetreatStrikeCast({
      spell: strike,
      assignedSpells: rookKit,
      availableSpells: rookKit,
      origin,
      targetCell: strikeDest,
      occupant,
      opponents,
      caster: woundedRook,
      casterSide: "enemy",
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      wxEnemyCasterRetreatStrikeHighlightedTargetIsExecutable({
        decided,
        executable,
      }),
      true,
    );
  });

  it("picks in-range Strike when live would retreat a wounded pawn caster", () => {
    const woundedPawn = casterAt("pawn-1", 4, 4, 20, 100, "pawn");
    assert.equal(
      pickWxEnemyCasterRetreatStrikeSpell({
        assignedSpells: pawnKit,
        availableSpells: pawnKit,
        origin,
        targetCell: strikeDest,
        opponents,
        caster: woundedPawn,
      })?.id,
      "physical_attack",
    );
  });

  it("cannot execute Strike beyond range 1, on a corpse, ally, or empty tile", () => {
    const tooFar = { x: 6, y: 4 };
    assert.equal(enemyCastRangeOk(origin, tooFar, strike), false);
    assert.equal(
      wxEnemyCasterRetreatStrikeInRange(origin, tooFar, strike),
      false,
    );
    const base = {
      spell: strike,
      assignedSpells: rookKit,
      availableSpells: rookKit,
      origin,
      opponents,
      caster: woundedRook,
      casterSide: "enemy" as const,
    };
    assert.equal(
      canExecuteWxEnemyCasterRetreatStrikeCast({
        ...base,
        targetCell: tooFar,
        occupant: playerAt("player", 6, 4),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyCasterRetreatStrikeCast({
        ...base,
        targetCell: strikeDest,
        occupant: playerAt("player", 5, 4, 0),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyCasterRetreatStrikeCast({
        ...base,
        targetCell: strikeDest,
        occupant: { id: "rook-2", x: 5, y: 4, hp: 12, side: "enemy" },
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyCasterRetreatStrikeCast({
        ...base,
        targetCell: strikeDest,
        occupant: null,
      }),
      false,
    );
    assert.equal(
      wxEnemyCasterRetreatStrikeHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("does not fire when the caster is healthy (live already casts)", () => {
    assert.equal(
      wxEnemyCasterLiveWouldRetreatForStrike({
        assignedSpells: rookKit,
        availableSpells: rookKit,
        caster: healthyRook,
        opponents,
      }),
      false,
    );
    assert.equal(
      pickWxEnemyCasterRetreatStrikeSpell({
        assignedSpells: rookKit,
        availableSpells: rookKit,
        origin,
        targetCell: strikeDest,
        opponents,
        caster: healthyRook,
      }),
      null,
      "healthy caster already reaches pickBestDamageSpell (#762)",
    );
  });

  it("does not steal healer self-heal (#985), guard (#1034), or fallback-retreat Frost (#1085)", () => {
    const woundedQueen = casterAt("queen-1", 4, 4, 20, 100, "queen");
    assert.equal(
      wxEnemyCasterLiveWouldRetreatForStrike({
        assignedSpells: [frost, mend],
        availableSpells: [frost, mend],
        caster: woundedQueen,
        opponents,
      }),
      false,
    );
    assert.equal(
      pickWxEnemyCasterRetreatStrikeSpell({
        assignedSpells: [frost, mend],
        availableSpells: [frost, mend],
        origin,
        targetCell: strikeDest,
        opponents,
        caster: woundedQueen,
      }),
      null,
      "#985 / #1034 / #1085 own queen heal leftovers",
    );
  });

  it("does not steal caster Frost retreat (#1054) or LoS-reposition (#1081)", () => {
    const woundedBishop = casterAt("bishop-1", 4, 4, 20, 100, "bishop");
    assert.equal(
      wxEnemyCasterLiveWouldRetreatForStrike({
        availableSpells: [frost],
        caster: woundedBishop,
        opponents: [playerAt("player", 7, 4)],
      }),
      true,
      "Frost-only still infers caster, but the pick must stay Frost",
    );
    assert.equal(
      pickWxEnemyCasterRetreatStrikeSpell({
        availableSpells: [frost],
        origin,
        targetCell: { x: 7, y: 4 },
        opponents: [playerAt("player", 7, 4)],
        caster: woundedBishop,
      }),
      null,
      "#1054 / #1081 own bishop Frost leftovers",
    );
    assert.equal(
      pickWxEnemyCasterRetreatStrikeSpell({
        assignedSpells: [frost, strike],
        availableSpells: [frost, strike],
        origin,
        targetCell: strikeDest,
        opponents,
        caster: woundedBishop,
      }),
      null,
      "Frost out-damages Strike in the live pick — #1054 owns Frost",
    );
  });

  it("does not steal knight flanker (#1087) or charger Strike-only leftovers", () => {
    const woundedKnight = casterAt("knight-1", 4, 4, 20, 100, "knight");
    const woundedPawn = casterAt("pawn-1", 4, 4, 20, 100, "pawn");
    const woundedRookZ0 = casterAt("rook-1", 4, 4, 20, 100, "rook");
    assert.equal(
      pickWxEnemyCasterRetreatStrikeSpell({
        availableSpells: [strike],
        origin,
        targetCell: strikeDest,
        opponents,
        caster: woundedKnight,
      }),
      null,
      "knight Strike-only infers flanker — #1087",
    );
    assert.equal(
      pickWxEnemyCasterRetreatStrikeSpell({
        availableSpells: [strike],
        origin,
        targetCell: strikeDest,
        opponents,
        caster: woundedPawn,
      }),
      null,
      "pawn Strike-only infers charger — chargers have no 30% retreat",
    );
    assert.equal(
      pickWxEnemyCasterRetreatStrikeSpell({
        availableSpells: [strike],
        origin,
        targetCell: strikeDest,
        opponents,
        caster: woundedRookZ0,
      }),
      null,
      "rook z=0 Strike-only infers charger",
    );
  });

  it("does not steal Iron Skin (#978) or Venom/Inferno (#967) when Strike is absent", () => {
    const inferno = mustSpell("spell-inferno");
    assert.equal(
      pickWxEnemyCasterRetreatStrikeSpell({
        assignedSpells: [iron],
        availableSpells: [iron],
        origin,
        targetCell: origin,
        opponents,
        caster: woundedRook,
      }),
      null,
      "Iron Skin-only stays #978 — live damage>0 pick is empty",
    );
    assert.equal(
      pickWxEnemyCasterRetreatStrikeSpell({
        assignedSpells: [venom],
        availableSpells: [venom],
        origin,
        targetCell: strikeDest,
        opponents,
        caster: casterAt("pawn-1", 4, 4, 20, 100, "pawn"),
      }),
      null,
      "Venom-only is #967 — live damage>0 pick is empty",
    );
    assert.equal(
      pickWxEnemyCasterRetreatStrikeSpell({
        availableSpells: [inferno],
        origin,
        targetCell: strikeDest,
        opponents,
        caster: woundedRook,
      }),
      null,
      "Inferno-only is #967 — live damage>0 pick is empty",
    );
  });

  it("king assigned Rallying Cry still infers healer and yields", () => {
    const king = casterAt("king-1", 4, 4, 20, 100, "king");
    assert.equal(
      wxEnemyCasterLiveWouldRetreatForStrike({
        assignedSpells: [frost, rally],
        availableSpells: [frost],
        caster: king,
        opponents,
      }),
      false,
      "assigned Rallying Cry infers healer even when usableByEnemy drops it",
    );
    assert.equal(
      pickWxEnemyCasterRetreatStrikeSpell({
        assignedSpells: [frost, rally],
        availableSpells: [frost],
        origin,
        targetCell: strikeDest,
        opponents,
        caster: king,
      }),
      null,
    );
  });

  it("still decides adjacent Strike (WX skips LoS) and does not debit AP", () => {
    assert.equal(Number(strike.apCost), 2);
    assert.equal(
      canExecuteWxEnemyCasterRetreatStrikeCast({
        spell: strike,
        assignedSpells: rookKit,
        availableSpells: rookKit,
        origin,
        targetCell: strikeDest,
        occupant: playerAt("player", 5, 4),
        opponents,
        caster: woundedRook,
        casterSide: "enemy",
      }),
      true,
      "catalog Strike has no lineOfSight flag; WX pack execute skips LoS",
    );
  });

  it("cannot decide Frost, Slow, Iron Skin, Drain, Inferno, or heal as this Strike leftover", () => {
    const occupant = playerAt("player", 5, 4);
    const base = {
      origin,
      targetCell: strikeDest,
      occupant,
      opponents,
      caster: woundedRook,
      casterSide: "enemy" as const,
    };
    assert.equal(
      canExecuteWxEnemyCasterRetreatStrikeCast({
        ...base,
        spell: frost,
        assignedSpells: [frost],
        availableSpells: [frost],
        targetCell: { x: 7, y: 4 },
        occupant: playerAt("player", 7, 4),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyCasterRetreatStrikeCast({
        ...base,
        spell: mustSpell("spell-slow"),
        availableSpells: [mustSpell("spell-slow")],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyCasterRetreatStrikeCast({
        ...base,
        spell: mustSpell("spell-inferno"),
        availableSpells: [mustSpell("spell-inferno")],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyCasterRetreatStrikeCast({
        ...base,
        spell: mend,
        assignedSpells: [strike, mend],
        availableSpells: [strike, mend],
        caster: casterAt("queen-1", 4, 4, 20, 100, "queen"),
      }),
      false,
      "#985 owns the range-0 heal picker; do not remap dest onto the caster",
    );
  });
});
