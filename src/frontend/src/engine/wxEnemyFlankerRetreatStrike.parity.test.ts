/**
 * Combat action parity: pack-enemy `decideFlanker` wounded-retreat vs
 * advertised in-range Strike. A decided legal Strike dest (living hostile
 * in Chebyshev range 1, flanker HP below 30% so live would retreat) is
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
  canExecuteWxEnemyFlankerRetreatStrikeCast,
  isWxEnemyFlankerRetreatStrikeBlockedBuffSpell,
  isWxEnemyFlankerRetreatStrikeBlockedDotSpell,
  isWxEnemyFlankerRetreatStrikeHealKitSpell,
  isWxEnemyFlankerRetreatStrikeSpell,
  pickWxEnemyFlankerRetreatStrikeSpell,
  shouldDecideWxEnemyFlankerRetreatStrikeCast,
  wxEnemyFlankerLiveWouldRetreatForStrike,
  wxEnemyFlankerRetreatStrikeHighlightedTargetIsExecutable,
  wxEnemyFlankerRetreatStrikeInRange,
  wxEnemyFlankerRetreatStrikeKitIsHealer,
  wxEnemyFlankerRetreatStrikeLivePickBestDamageSpell,
  wxEnemyFlankerRetreatStrikePieceIsFlanker,
  wxEnemyFlankerRetreatStrikeRange,
  wxEnemyFlankerRetreatStrikeWouldRetreat,
} from "./wxEnemyFlankerRetreatStrike.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function playerAt(id: string, x: number, y: number, hp = 40) {
  return { id, x, y, hp, side: "player" as const };
}

function flankerAt(
  id: string,
  x: number,
  y: number,
  hp: number,
  maxHp: number,
  pieceType = "knight",
) {
  return { id, x, y, hp, maxHp, side: "enemy" as const, pieceType };
}

describe("WX enemy decideFlanker wounded-retreat vs advertised Strike", () => {
  const mend = mustSpell("starter-heal");
  const rally = mustSpell("spell-rallying-cry");
  const frost = mustSpell("starter-frost");
  const strike = physicalAttackSpell;
  const origin = { x: 4, y: 4 };
  const strikeDest = { x: 5, y: 4 };
  const woundedKnight = flankerAt("knight-1", 4, 4, 20, 100);
  const healthyKnight = flankerAt("knight-1", 4, 4, 80, 100);
  const opponents = [playerAt("player", 5, 4)];

  it("treats catalog Strike as the wounded-retreat fallback", () => {
    assert.equal(strike.spellType, "damage");
    assert.equal(Number(strike.damage), 10);
    assert.equal(strike.debuffStat, undefined);
    assert.equal(Number(strike.range), 1);
    assert.equal(strike.isPhysical, true);
    assert.equal(isWxEnemyFlankerRetreatStrikeSpell(strike), true);
    assert.equal(
      wxEnemyFlankerRetreatStrikeRange(strike),
      enemySpellRange(strike),
    );
    assert.equal(isWxEnemyFlankerRetreatStrikeHealKitSpell(strike), false);
    assert.equal(isWxEnemyFlankerRetreatStrikeHealKitSpell(mend), true);
    assert.equal(isWxEnemyFlankerRetreatStrikeHealKitSpell(rally), true);
    assert.equal(rally.usableByEnemy, false);
    assert.equal(ENEMY_RETREAT_HP_PCT, 0.3);
  });

  it("knight kits are Strike flankers; pawn Strike-only is charger", () => {
    assert.deepEqual(buildEnemyKit("knight", 0), ["physical_attack"]);
    assert.deepEqual(buildEnemyKit("knight", 2), ["physical_attack"]);
    assert.deepEqual(buildEnemyKit("pawn", 0), ["physical_attack"]);
    assert.equal(wxEnemyFlankerRetreatStrikePieceIsFlanker("knight"), true);
    assert.equal(wxEnemyFlankerRetreatStrikePieceIsFlanker("pawn"), false);
    assert.equal(wxEnemyFlankerRetreatStrikePieceIsFlanker("bishop"), false);
    assert.equal(wxEnemyFlankerRetreatStrikePieceIsFlanker("rook"), false);
    assert.equal(wxEnemyFlankerRetreatStrikeKitIsHealer([strike]), false);
    assert.equal(wxEnemyFlankerRetreatStrikeKitIsHealer([strike, mend]), true);
    assert.equal(wxEnemyFlankerRetreatStrikeKitIsHealer([frost, rally]), true);
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isWxEnemyFlankerRetreatStrikeSpell({
        spellType: "damage",
        damage: 10,
        range: 1,
        targetType: "enemy",
      }),
      true,
    );
    assert.equal(
      isWxEnemyFlankerRetreatStrikeSpell({
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
    assert.equal(isWxEnemyFlankerRetreatStrikeSpell(frost), false);
    assert.equal(isWxEnemyFlankerRetreatStrikeSpell(mend), false);
    assert.equal(
      isWxEnemyFlankerRetreatStrikeSpell(mustSpell("spell-slow")),
      false,
      "#528/#762/#878 own 0-damage Slow",
    );
    assert.equal(
      isWxEnemyFlankerRetreatStrikeSpell(mustSpell("spell-iron-skin")),
      false,
      "#978 owns pack buff decide",
    );
    assert.equal(
      isWxEnemyFlankerRetreatStrikeSpell(mustSpell("starter-poison")),
      false,
      "#967 owns pack DoT decide",
    );
    assert.equal(
      isWxEnemyFlankerRetreatStrikeSpell(mustSpell("spell-inferno")),
      false,
    );
    assert.equal(
      isWxEnemyFlankerRetreatStrikeSpell(mustSpell("starter-drain")),
      false,
      "#921 owns Life Drain SP",
    );
    assert.equal(
      isWxEnemyFlankerRetreatStrikeSpell(mustSpell("spell-frost-nova")),
      false,
      "#917 owns player Frost Nova; hitsMultiple is not this leftover",
    );
    assert.equal(
      isWxEnemyFlankerRetreatStrikeBlockedDotSpell(mustSpell("spell-inferno")),
      true,
    );
    assert.equal(
      isWxEnemyFlankerRetreatStrikeBlockedDotSpell(mustSpell("starter-poison")),
      true,
    );
    assert.equal(
      isWxEnemyFlankerRetreatStrikeBlockedBuffSpell(
        mustSpell("spell-iron-skin"),
      ),
      true,
    );
  });

  it("live decideFlanker still retreats below 30% HP before pickBestDamageSpell", () => {
    const ai = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "enemyAI.ts"),
      "utf8",
    );
    const start = ai.indexOf("function decideFlanker");
    assert.ok(start >= 0, "live decideFlanker is present");
    const body = ai.slice(start, start + 2800);
    const retreatAt = body.indexOf("ENEMY_RETREAT_HP_PCT");
    const pickAt = body.indexOf("pickBestDamageSpell");
    assert.ok(retreatAt >= 0, "decideFlanker still gates on retreat HP");
    assert.ok(pickAt >= 0, "decideFlanker still calls pickBestDamageSpell");
    assert.ok(
      retreatAt < pickAt,
      "retreat still returns before the Strike pick",
    );
    assert.ok(body.includes('intent: "retreat"'));
    assert.ok(body.includes("falls back, wounded"));
    const inferStart = ai.indexOf("function inferArchetype");
    const inferBody = ai.slice(inferStart, inferStart + 1600);
    const knightAt = inferBody.indexOf('pt === "knight"');
    const chargerAt = inferBody.indexOf("charger");
    assert.ok(knightAt >= 0, "inferArchetype still pins knight as flanker");
    assert.ok(knightAt < chargerAt, "knight flanker still beats melee charger");
    assert.equal(wxEnemyFlankerRetreatStrikeWouldRetreat(woundedKnight), true);
    assert.equal(wxEnemyFlankerRetreatStrikeWouldRetreat(healthyKnight), false);
    assert.equal(
      wxEnemyFlankerRetreatStrikeWouldRetreat(
        flankerAt("knight-1", 4, 4, 30, 100),
      ),
      false,
      "hpFrac 0.3 is not < ENEMY_RETREAT_HP_PCT",
    );
    assert.equal(
      wxEnemyFlankerLiveWouldRetreatForStrike({
        availableSpells: [strike],
        flanker: woundedKnight,
        opponents,
      }),
      true,
    );
    assert.equal(
      wxEnemyFlankerRetreatStrikeLivePickBestDamageSpell({
        availableSpells: [strike],
        origin,
        targetCell: strikeDest,
      })?.id,
      "physical_attack",
      "Strike at Chebyshev 1 is the live damage pick if retreat did not run",
    );
  });

  it("picks in-range Strike when live would retreat a wounded knight", () => {
    const occupant = playerAt("player", 5, 4);
    const available = [strike];
    assert.equal(
      wxEnemyFlankerRetreatStrikeInRange(origin, strikeDest, strike),
      true,
    );
    assert.equal(
      pickWxEnemyFlankerRetreatStrikeSpell({
        availableSpells: available,
        origin,
        targetCell: strikeDest,
        opponents,
        flanker: woundedKnight,
      })?.id,
      "physical_attack",
    );
    const decided = shouldDecideWxEnemyFlankerRetreatStrikeCast({
      spell: strike,
      availableSpells: available,
      origin,
      targetCell: strikeDest,
      occupant,
      opponents,
      flanker: woundedKnight,
      flankerSide: "enemy",
    });
    const executable = canExecuteWxEnemyFlankerRetreatStrikeCast({
      spell: strike,
      availableSpells: available,
      origin,
      targetCell: strikeDest,
      occupant,
      opponents,
      flanker: woundedKnight,
      flankerSide: "enemy",
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      wxEnemyFlankerRetreatStrikeHighlightedTargetIsExecutable({
        decided,
        executable,
      }),
      true,
    );
  });

  it("cannot execute Strike beyond range 1, on a corpse, ally, or empty tile", () => {
    const available = [strike];
    const tooFar = { x: 6, y: 4 };
    assert.equal(enemyCastRangeOk(origin, tooFar, strike), false);
    assert.equal(
      wxEnemyFlankerRetreatStrikeInRange(origin, tooFar, strike),
      false,
    );
    const base = {
      spell: strike,
      availableSpells: available,
      origin,
      opponents,
      flanker: woundedKnight,
      flankerSide: "enemy" as const,
    };
    assert.equal(
      canExecuteWxEnemyFlankerRetreatStrikeCast({
        ...base,
        targetCell: tooFar,
        occupant: playerAt("player", 6, 4),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyFlankerRetreatStrikeCast({
        ...base,
        targetCell: strikeDest,
        occupant: playerAt("player", 5, 4, 0),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyFlankerRetreatStrikeCast({
        ...base,
        targetCell: strikeDest,
        occupant: { id: "knight-2", x: 5, y: 4, hp: 12, side: "enemy" },
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyFlankerRetreatStrikeCast({
        ...base,
        targetCell: strikeDest,
        occupant: null,
      }),
      false,
    );
    assert.equal(
      wxEnemyFlankerRetreatStrikeHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("does not fire when the flanker is healthy (live already casts)", () => {
    assert.equal(
      wxEnemyFlankerLiveWouldRetreatForStrike({
        availableSpells: [strike],
        flanker: healthyKnight,
        opponents,
      }),
      false,
    );
    assert.equal(
      pickWxEnemyFlankerRetreatStrikeSpell({
        availableSpells: [strike],
        origin,
        targetCell: strikeDest,
        opponents,
        flanker: healthyKnight,
      }),
      null,
      "healthy flanker already reaches pickBestDamageSpell (#762)",
    );
  });

  it("does not steal healer self-heal (#985), guard (#1034), or fallback-retreat Frost (#1085)", () => {
    const woundedQueen = flankerAt("queen-1", 4, 4, 20, 100, "queen");
    assert.equal(
      wxEnemyFlankerLiveWouldRetreatForStrike({
        assignedSpells: [frost, mend],
        availableSpells: [frost, mend],
        flanker: woundedQueen,
        opponents,
      }),
      false,
    );
    assert.equal(
      pickWxEnemyFlankerRetreatStrikeSpell({
        assignedSpells: [frost, mend],
        availableSpells: [frost, mend],
        origin,
        targetCell: strikeDest,
        opponents,
        flanker: woundedQueen,
      }),
      null,
      "#985 / #1034 / #1085 own queen heal leftovers",
    );
  });

  it("does not steal caster Frost retreat (#1054) or LoS-reposition (#1081)", () => {
    const woundedBishop = flankerAt("bishop-1", 4, 4, 20, 100, "bishop");
    assert.equal(
      wxEnemyFlankerLiveWouldRetreatForStrike({
        availableSpells: [frost],
        flanker: woundedBishop,
        opponents,
      }),
      false,
    );
    assert.equal(
      pickWxEnemyFlankerRetreatStrikeSpell({
        availableSpells: [frost],
        origin,
        targetCell: { x: 7, y: 4 },
        opponents: [playerAt("player", 7, 4)],
        flanker: woundedBishop,
      }),
      null,
      "#1054 / #1081 own bishop Frost leftovers",
    );
    assert.equal(
      pickWxEnemyFlankerRetreatStrikeSpell({
        availableSpells: [frost, strike],
        origin,
        targetCell: strikeDest,
        opponents,
        flanker: woundedKnight,
      }),
      null,
      "Frost out-damages Strike in the live pick — #1054 owns Frost",
    );
  });

  it("does not steal pawn charger or rook Iron Skin leftovers", () => {
    const inferno = mustSpell("spell-inferno");
    const iron = mustSpell("spell-iron-skin");
    const woundedPawn = flankerAt("pawn-1", 4, 4, 20, 100, "pawn");
    const woundedRook = flankerAt("rook-1", 4, 4, 20, 100, "rook");
    assert.equal(
      pickWxEnemyFlankerRetreatStrikeSpell({
        availableSpells: [strike],
        origin,
        targetCell: strikeDest,
        opponents,
        flanker: woundedPawn,
      }),
      null,
      "pawn Strike-only infers charger — chargers have no 30% retreat",
    );
    assert.equal(
      pickWxEnemyFlankerRetreatStrikeSpell({
        availableSpells: [strike, iron],
        origin,
        targetCell: strikeDest,
        opponents,
        flanker: woundedRook,
      }),
      null,
      "rook z>=1 infers caster via Iron Skin; leftover E is not this sidecar",
    );
    assert.equal(
      pickWxEnemyFlankerRetreatStrikeSpell({
        availableSpells: [inferno],
        origin,
        targetCell: strikeDest,
        opponents,
        flanker: woundedKnight,
      }),
      null,
      "Inferno-only is #967 — live damage>0 pick is empty",
    );
    assert.equal(
      pickWxEnemyFlankerRetreatStrikeSpell({
        availableSpells: [iron],
        origin,
        targetCell: origin,
        opponents,
        flanker: woundedKnight,
      }),
      null,
      "Iron Skin stays #978",
    );
  });

  it("king assigned Rallying Cry still infers healer and yields", () => {
    const king = flankerAt("king-1", 4, 4, 20, 100, "king");
    assert.equal(
      wxEnemyFlankerLiveWouldRetreatForStrike({
        assignedSpells: [frost, rally],
        availableSpells: [frost],
        flanker: king,
        opponents,
      }),
      false,
      "assigned Rallying Cry infers healer even when usableByEnemy drops it",
    );
    assert.equal(
      pickWxEnemyFlankerRetreatStrikeSpell({
        assignedSpells: [frost, rally],
        availableSpells: [frost],
        origin,
        targetCell: strikeDest,
        opponents,
        flanker: king,
      }),
      null,
    );
  });

  it("still decides adjacent Strike (WX skips LoS) and does not debit AP", () => {
    assert.equal(Number(strike.apCost), 2);
    assert.equal(
      canExecuteWxEnemyFlankerRetreatStrikeCast({
        spell: strike,
        availableSpells: [strike],
        origin,
        targetCell: strikeDest,
        occupant: playerAt("player", 5, 4),
        opponents,
        flanker: woundedKnight,
        flankerSide: "enemy",
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
      flanker: woundedKnight,
      flankerSide: "enemy" as const,
    };
    assert.equal(
      canExecuteWxEnemyFlankerRetreatStrikeCast({
        ...base,
        spell: frost,
        availableSpells: [frost],
        targetCell: { x: 7, y: 4 },
        occupant: playerAt("player", 7, 4),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyFlankerRetreatStrikeCast({
        ...base,
        spell: mustSpell("spell-slow"),
        availableSpells: [mustSpell("spell-slow")],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyFlankerRetreatStrikeCast({
        ...base,
        spell: mustSpell("spell-inferno"),
        availableSpells: [mustSpell("spell-inferno")],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyFlankerRetreatStrikeCast({
        ...base,
        spell: mend,
        availableSpells: [strike, mend],
        assignedSpells: [strike, mend],
        flanker: flankerAt("queen-1", 4, 4, 20, 100, "queen"),
      }),
      false,
      "#985 owns the range-0 heal picker; do not remap dest onto the caster",
    );
  });
});
