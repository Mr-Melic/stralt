/**
 * Combat action parity: player turn-start Void Rift tick vs live WX
 * no-op. A decided End Turn / timer on a Void Rift map must debit
 * `VOID_RIFT_TICK` through `playerTakesDamage` (RES then Shield Charm).
 * Live only warps a tile and leaves HP / Untouchable untouched.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  isChallengeCompleted,
  recordChallengeDamageTaken,
  recordChallengeWalkHazardDamage,
} from "../utils/challengeCompletion.ts";
import {
  PLAGUE_ZONE_TICK,
  VOID_RIFT_TICK,
  battleWalkHazardDamages,
  playerTurnStartModifierTarget,
  shouldAwardVictory,
  shouldContinuePlayerTurnAfterHazard,
} from "./battleSetup.ts";
import {
  liveWxPlayerVoidRiftTurnStart,
  planVoidRiftPlayerTurnStart,
  playerRosterMissesVoidRiftTurnStart,
  recordVoidRiftChallengeDamage,
  shouldApplyVoidRiftPlayerTurnStart,
  shouldDispatchDeathAfterVoidRift,
} from "./voidRiftPlayerTurnStart.ts";

const UNTOUCHABLE = {
  id: "legendary_1",
  tier: "legendary" as const,
  description: "Win without taking any damage at all",
  condition: "no_damage_taken" as const,
  rewards: { doka: 500, xp: 1000, badge: "Untouchable" },
};

function progress(totalDamage: number) {
  return {
    turnCount: 1,
    totalDamage,
    healUsed: false,
    directHit: true,
    maxApUsedInTurn: 4,
    directHitAttempts: 1,
  };
}

function wxSource(): string {
  return readFileSync(
    join(
      dirname(fileURLToPath(import.meta.url)),
      "../components/WorldExploration.tsx",
    ),
    "utf8",
  );
}

describe("void rift player turn-start tick vs live WX no-op", () => {
  it("keeps the live Void Rift tick of 3", () => {
    assert.equal(VOID_RIFT_TICK, 3);
  });

  it("keys off the void_rift modifier, not plague/thorn/lava/spikes", () => {
    assert.equal(shouldApplyVoidRiftPlayerTurnStart(true), true);
    assert.equal(shouldApplyVoidRiftPlayerTurnStart(false), false);
  });

  it("live player Void Rift arm only warps a tile and never writes HP", () => {
    const wx = wxSource();
    const warpLog = wx.indexOf("Void Rift warps tile");
    assert.ok(warpLog >= 0, "player Void Rift warp-tile log is present");
    const warpBlock = wx.slice(warpLog - 900, warpLog + 400);
    assert.match(warpBlock, /setVoidRiftTile/);
    assert.match(warpBlock, /if \(isVoidRift\)/);
    assert.match(
      warpBlock,
      /Void Rift: pick a new random walkable void tile each turn/,
    );
    assert.equal(warpBlock.includes("VOID_RIFT_TICK"), false);
    assert.equal(warpBlock.includes("hpAfterIncomingDamage"), false);
    assert.equal(warpBlock.includes("setCharacterStats"), false);
    assert.equal(warpBlock.includes("playerTakesDamage("), false);
    assert.equal(warpBlock.includes("planVoidRiftPlayerTurnStart"), false);
    assert.equal(warpBlock.includes("shieldHpRef"), false);
    assert.equal(warpBlock.includes("recordChallengeDamageTaken"), false);
    assert.equal(warpBlock.includes("_handlePlayerDeath"), false);
    assert.ok(
      wx.includes("Void Rift deals 3 damage to"),
      "enemy / summon Void Rift store commit stays on WX",
    );
  });

  it("skips applyTurnStart when the player is absent from combatantsRef", () => {
    const enemiesOnly = [{ id: "rat-1" }, { id: "golem-1" }];
    assert.equal(playerTurnStartModifierTarget(enemiesOnly), undefined);
    assert.equal(playerRosterMissesVoidRiftTurnStart(enemiesOnly), true);
    assert.equal(
      playerRosterMissesVoidRiftTurnStart([{ id: "player" }, { id: "rat-1" }]),
      false,
    );
  });

  it("lets a no-shield Untouchable run fail the advertised 3-damage tick", () => {
    // Sequence: Untouchable → Void Rift map → End Turn / timer.
    // Live skipped the tick, so totalDamage stayed 0 and the 500 Doka /
    // 1000 XP objective still completed while enemies paid 3 / turn.
    assert.equal(VOID_RIFT_TICK, 3);

    const live = liveWxPlayerVoidRiftTurnStart(50, 0);
    assert.equal(live.newHp, 50);
    assert.equal(live.challengeDamage, 0);
    assert.equal(live.lethal, false);
    assert.equal(
      isChallengeCompleted(UNTOUCHABLE, progress(live.challengeDamage)),
      true,
      "live no-op incorrectly keeps Untouchable completable",
    );

    const expected = planVoidRiftPlayerTurnStart({
      incoming: VOID_RIFT_TICK,
      hp: 50,
      res: 0,
      resModifier: 1,
      shieldHp: 0,
    });
    assert.equal(expected.damageAfterRes, 3);
    assert.equal(expected.shieldAbsorb, 0);
    assert.equal(expected.hpLost, 3);
    assert.equal(expected.newHp, 47);
    assert.equal(expected.lethal, false);
    assert.equal(expected.challengeDamage, 3);
    assert.notEqual(live.challengeDamage, expected.challengeDamage);
    const total = recordVoidRiftChallengeDamage(0, expected.challengeDamage);
    assert.equal(isChallengeCompleted(UNTOUCHABLE, progress(total)), false);
  });

  it("lets Shield Charm soak the tick the way playerTakesDamage does", () => {
    // Sequence: Shield Charm 20, Untouchable, Void Rift, End Turn.
    // Live also leaves HP unchanged — but the shield stack never moves.
    const live = liveWxPlayerVoidRiftTurnStart(50, 20);
    assert.equal(live.newHp, 50);
    assert.equal(live.remainingShield, 20);
    assert.equal(live.challengeDamage, 0);

    const soaked = planVoidRiftPlayerTurnStart({
      incoming: VOID_RIFT_TICK,
      hp: 50,
      res: 0,
      resModifier: 1,
      shieldHp: 20,
    });
    assert.equal(soaked.damageAfterRes, 3);
    assert.equal(soaked.shieldAbsorb, 3);
    assert.equal(soaked.remainingShield, 17);
    assert.equal(soaked.hpLost, 0);
    assert.equal(soaked.newHp, 50);
    assert.equal(soaked.lethal, false);
    assert.equal(soaked.challengeDamage, 0);
    assert.notEqual(live.remainingShield, soaked.remainingShield);
    const total = recordVoidRiftChallengeDamage(0, soaked.challengeDamage);
    assert.equal(isChallengeCompleted(UNTOUCHABLE, progress(total)), true);
  });

  it("applies RES before the shield, matching playerTakesDamage", () => {
    // tick 3, RES 50 → 2 after RES (round(3 * 0.5) = 2), shield 0 → 2 HP lost.
    const hit = planVoidRiftPlayerTurnStart({
      incoming: VOID_RIFT_TICK,
      hp: 30,
      res: 50,
      resModifier: 1,
      shieldHp: 0,
    });
    assert.equal(hit.damageAfterRes, 2);
    assert.equal(hit.shieldAbsorb, 0);
    assert.equal(hit.hpLost, 2);
    assert.equal(hit.newHp, 28);
    assert.equal(hit.lethal, false);

    const live = liveWxPlayerVoidRiftTurnStart(30, 0);
    assert.equal(live.newHp, 30);
    assert.equal(live.challengeDamage, 0);
  });

  it("does not mint a 1 HP hit from a missing Void Rift packet", () => {
    const hit = planVoidRiftPlayerTurnStart({
      incoming: 0,
      hp: 12,
      res: 0,
      resModifier: 1,
      shieldHp: 8,
    });
    assert.equal(hit.hpLost, 0);
    assert.equal(hit.newHp, 12);
    assert.equal(hit.remainingShield, 8);
    assert.equal(hit.challengeDamage, 0);
    assert.equal(hit.lethal, false);
  });

  it("kills a 3 HP unshielded player so last-hostile victory cannot fire", () => {
    // Sequence: Void Rift, 3 HP, End Turn / timer.
    // Live left HP at 3, restored AP, and a last-hostile kill could
    // shouldAwardVictory. Expected lethal stops the player turn.
    const live = liveWxPlayerVoidRiftTurnStart(3, 0);
    assert.equal(live.newHp, 3);
    assert.equal(live.lethal, false);
    assert.equal(shouldDispatchDeathAfterVoidRift(live.lethal), false);
    assert.equal(
      shouldContinuePlayerTurnAfterHazard({
        deathTriggered: false,
        liveHp: live.newHp,
      }),
      true,
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: 0,
      }),
      true,
      "live no-op leaves deathTriggered false so a later last-hostile kill awards",
    );

    const expected = planVoidRiftPlayerTurnStart({
      incoming: VOID_RIFT_TICK,
      hp: 3,
      res: 0,
      resModifier: 1,
      shieldHp: 0,
    });
    assert.equal(expected.newHp, 0);
    assert.equal(expected.lethal, true);
    assert.equal(expected.challengeDamage, 3);
    assert.equal(shouldDispatchDeathAfterVoidRift(expected.lethal), true);
    assert.equal(
      shouldContinuePlayerTurnAfterHazard({
        deathTriggered: true,
        liveHp: expected.newHp,
      }),
      false,
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: true,
        battleStartIdsSize: 1,
        hostilesRemaining: 0,
      }),
      false,
    );
  });

  it("keeps a 3 HP shielded player alive through the turn-start tick", () => {
    const live = liveWxPlayerVoidRiftTurnStart(3, 20);
    assert.equal(live.newHp, 3);
    assert.equal(live.remainingShield, 20);

    const soaked = planVoidRiftPlayerTurnStart({
      incoming: VOID_RIFT_TICK,
      hp: 3,
      res: 0,
      resModifier: 1,
      shieldHp: 20,
    });
    assert.equal(soaked.newHp, 3);
    assert.equal(soaked.lethal, false);
    assert.equal(soaked.remainingShield, 17);
    assert.equal(soaked.challengeDamage, 0);
    assert.equal(shouldDispatchDeathAfterVoidRift(soaked.lethal), false);
    assert.notEqual(live.remainingShield, soaked.remainingShield);
  });

  it("records challenge damage only when HP is actually lost", () => {
    const soaked = planVoidRiftPlayerTurnStart({
      incoming: VOID_RIFT_TICK,
      hp: 40,
      res: 0,
      resModifier: 1,
      shieldHp: 5,
    });
    assert.equal(soaked.hpLost, 0);
    assert.equal(recordVoidRiftChallengeDamage(0, soaked.hpLost), 0);
    assert.equal(recordChallengeDamageTaken(0, soaked.hpLost), 0);

    const unsoaked = planVoidRiftPlayerTurnStart({
      incoming: VOID_RIFT_TICK,
      hp: 40,
      res: 0,
      resModifier: 1,
      shieldHp: 0,
    });
    assert.equal(recordVoidRiftChallengeDamage(0, unsoaked.hpLost), 3);
  });

  it("does not steal Thorned Ground / Void Rift battle-walk soak (#1097)", () => {
    const damages = battleWalkHazardDamages({
      thornedActive: true,
      pathLength: 3,
      voidRiftActive: true,
      dest: { x: 8, y: 3 },
      riftTile: { x: 8, y: 3 },
    });
    assert.equal(damages.thornDmg, 10);
    assert.equal(damages.riftDmg, VOID_RIFT_TICK);
    const rawThornRift = recordChallengeWalkHazardDamage(0, damages);
    assert.equal(rawThornRift, 13);
    const turnStart = planVoidRiftPlayerTurnStart({
      incoming: VOID_RIFT_TICK,
      hp: 50,
      res: 0,
      resModifier: 1,
      shieldHp: 20,
    });
    assert.equal(turnStart.challengeDamage, 0);
    assert.notEqual(turnStart.challengeDamage, rawThornRift);
  });

  it("does not steal Plague Zone player turn-start soak (#1142)", () => {
    assert.equal(PLAGUE_ZONE_TICK, 2);
    assert.notEqual(PLAGUE_ZONE_TICK, VOID_RIFT_TICK);
    const wx = wxSource();
    assert.ok(wx.includes("Plague Zone deals 2 damage to you!"));
    const rift = planVoidRiftPlayerTurnStart({
      incoming: VOID_RIFT_TICK,
      hp: 50,
      res: 0,
      resModifier: 1,
      shieldHp: 0,
    });
    assert.equal(rift.hpLost, 3);
    assert.notEqual(rift.hpLost, PLAGUE_ZONE_TICK);
  });

  it("does not steal leftover-walk lava / spikes soak (#1100)", () => {
    const wx = wxSource();
    assert.ok(wx.includes("You stepped on lava!"));
    assert.ok(wx.includes("You stepped on spikes!"));
    const rift = planVoidRiftPlayerTurnStart({
      incoming: VOID_RIFT_TICK,
      hp: 50,
      res: 0,
      resModifier: 1,
      shieldHp: 0,
    });
    assert.equal(rift.hpLost, 3);
    assert.ok(rift.hpLost < 5);
  });

  it("shouldDispatchDeathAfterVoidRift is true only for a lethal soaked packet", () => {
    assert.equal(shouldDispatchDeathAfterVoidRift(true), true);
    assert.equal(shouldDispatchDeathAfterVoidRift(false), false);
  });
});
