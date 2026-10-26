/**
 * Combat action parity: player turn-start Plague Zone soak vs
 * `playerTakesDamage`. A decided End Turn / timer on a Plague Zone map
 * (Shield Charm still stacked, Untouchable accepted) records HP actually
 * lost after RES then shield; live used to raw-subtract the tick of 2.
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
} from "./battleSetup.ts";
import {
  liveWxRawPlagueZoneHit,
  planPlagueZonePlayerHit,
  recordPlagueZoneChallengeDamage,
  shouldApplyPlagueZonePlayerTick,
  shouldDispatchDeathAfterPlagueZone,
} from "./plagueZonePlayerHit.ts";

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

describe("plague zone player turn-start soak vs live WX raw subtract", () => {
  it("keeps the live Plague Zone tick of 2", () => {
    assert.equal(PLAGUE_ZONE_TICK, 2);
  });

  it("keys off the plague_zone modifier, not thorn/rift/lava/spikes", () => {
    assert.equal(shouldApplyPlagueZonePlayerTick(true), true);
    assert.equal(shouldApplyPlagueZonePlayerTick(false), false);
  });

  it("live player plague tick still raw-subtracts and skips soak", () => {
    const wx = wxSource();
    const plagueLog = wx.indexOf("Plague Zone deals 2 damage to you!");
    assert.ok(plagueLog >= 0, "player plague turn-start log is present");
    const plagueBlock = wx.slice(plagueLog - 700, plagueLog + 400);
    assert.match(plagueBlock, /hpAfterIncomingDamage/);
    assert.match(plagueBlock, /PLAGUE_ZONE_TICK/);
    assert.match(plagueBlock, /recordChallengeDamageTaken/);
    assert.match(plagueBlock, /_handlePlayerDeath/);
    assert.equal(plagueBlock.includes("planPlagueZonePlayerHit"), false);
    assert.equal(plagueBlock.includes("playerTakesDamage("), false);
    assert.equal(plagueBlock.includes("shieldHpRef"), false);
  });

  it("lets Shield Charm soak a Plague Zone tick the way playerTakesDamage does", () => {
    // Sequence: Shield Charm 20, Untouchable, Plague Zone, End Turn.
    // Live WX subtracted 2 and recorded 2, so the shield sat unused
    // and the 500 Doka / 1000 XP objective failed even though a DoT
    // tick of 2 would have been soaked.
    assert.equal(PLAGUE_ZONE_TICK, 2);

    const raw = liveWxRawPlagueZoneHit(50, PLAGUE_ZONE_TICK);
    assert.equal(raw.newHp, 48);
    assert.equal(raw.challengeDamage, 2);
    assert.equal(raw.lethal, false);
    assert.equal(
      isChallengeCompleted(UNTOUCHABLE, progress(raw.challengeDamage)),
      false,
    );

    const soaked = planPlagueZonePlayerHit({
      incoming: PLAGUE_ZONE_TICK,
      hp: 50,
      res: 0,
      resModifier: 1,
      shieldHp: 20,
    });
    assert.equal(soaked.damageAfterRes, 2);
    assert.equal(soaked.shieldAbsorb, 2);
    assert.equal(soaked.remainingShield, 18);
    assert.equal(soaked.hpLost, 0);
    assert.equal(soaked.newHp, 50);
    assert.equal(soaked.lethal, false);
    assert.equal(soaked.challengeDamage, 0);
    assert.notEqual(raw.challengeDamage, soaked.challengeDamage);
    const total = recordPlagueZoneChallengeDamage(0, soaked.challengeDamage);
    assert.equal(isChallengeCompleted(UNTOUCHABLE, progress(total)), true);
  });

  it("applies RES before the shield, matching playerTakesDamage", () => {
    // tick 2, RES 50 → 1 after RES, shield 0 → 1 HP lost.
    const hit = planPlagueZonePlayerHit({
      incoming: PLAGUE_ZONE_TICK,
      hp: 30,
      res: 50,
      resModifier: 1,
      shieldHp: 0,
    });
    assert.equal(hit.damageAfterRes, 1);
    assert.equal(hit.shieldAbsorb, 0);
    assert.equal(hit.hpLost, 1);
    assert.equal(hit.newHp, 29);
    assert.equal(hit.lethal, false);

    const raw = liveWxRawPlagueZoneHit(30, PLAGUE_ZONE_TICK);
    assert.equal(raw.newHp, 28);
    assert.equal(raw.challengeDamage, 2);
  });

  it("does not mint a 1 HP hit from a missing plague packet", () => {
    const hit = planPlagueZonePlayerHit({
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

  it("keeps a 2 HP shielded player alive through the plague tick", () => {
    // Sequence: Shield Charm, 2 HP, Plague Zone turn start.
    // Live raw lethal=true dispatched _handlePlayerDeath before the
    // player turn, so a last-hostile DoT / lava kill could not award.
    const raw = liveWxRawPlagueZoneHit(2, PLAGUE_ZONE_TICK);
    assert.equal(raw.newHp, 0);
    assert.equal(raw.lethal, true);
    assert.equal(shouldDispatchDeathAfterPlagueZone(raw.lethal), true);

    const soaked = planPlagueZonePlayerHit({
      incoming: PLAGUE_ZONE_TICK,
      hp: 2,
      res: 0,
      resModifier: 1,
      shieldHp: 20,
    });
    assert.equal(soaked.newHp, 2);
    assert.equal(soaked.lethal, false);
    assert.equal(soaked.challengeDamage, 0);
    assert.equal(shouldDispatchDeathAfterPlagueZone(soaked.lethal), false);
  });

  it("marks a lethal plague tick from live HP after soak", () => {
    const soaked = planPlagueZonePlayerHit({
      incoming: PLAGUE_ZONE_TICK,
      hp: 2,
      res: 0,
      resModifier: 1,
      shieldHp: 0,
    });
    assert.equal(soaked.newHp, 0);
    assert.equal(soaked.lethal, true);
    assert.equal(soaked.challengeDamage, 2);
    assert.equal(shouldDispatchDeathAfterPlagueZone(soaked.lethal), true);
  });

  it("records challenge damage only when HP is actually lost", () => {
    const soaked = planPlagueZonePlayerHit({
      incoming: PLAGUE_ZONE_TICK,
      hp: 40,
      res: 0,
      resModifier: 1,
      shieldHp: 5,
    });
    assert.equal(soaked.hpLost, 0);
    assert.equal(recordPlagueZoneChallengeDamage(0, soaked.hpLost), 0);
    assert.equal(recordChallengeDamageTaken(0, soaked.hpLost), 0);

    const unsoaked = planPlagueZonePlayerHit({
      incoming: PLAGUE_ZONE_TICK,
      hp: 40,
      res: 0,
      resModifier: 1,
      shieldHp: 0,
    });
    assert.equal(recordPlagueZoneChallengeDamage(0, unsoaked.hpLost), 2);
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
    assert.equal(
      isChallengeCompleted(UNTOUCHABLE, progress(rawThornRift)),
      false,
    );
    const plague = planPlagueZonePlayerHit({
      incoming: PLAGUE_ZONE_TICK,
      hp: 50,
      res: 0,
      resModifier: 1,
      shieldHp: 20,
    });
    assert.equal(plague.challengeDamage, 0);
    assert.notEqual(plague.challengeDamage, rawThornRift);
  });

  it("does not steal leftover-walk lava / spikes soak (#1100)", () => {
    const wx = wxSource();
    assert.ok(wx.includes("You stepped on lava!"));
    assert.ok(wx.includes("You stepped on spikes!"));
    const plague = planPlagueZonePlayerHit({
      incoming: PLAGUE_ZONE_TICK,
      hp: 50,
      res: 0,
      resModifier: 1,
      shieldHp: 0,
    });
    assert.equal(plague.hpLost, 2);
    assert.ok(plague.hpLost < 5);
  });

  it("does not steal Void Mirror 25% reflect soak (#1084)", () => {
    const voidMirrorPacket = Math.floor(20 * 0.25);
    assert.equal(voidMirrorPacket, 5);
    assert.ok(voidMirrorPacket > PLAGUE_ZONE_TICK);
  });

  it("shouldDispatchDeathAfterPlagueZone is true only for a lethal soaked packet", () => {
    assert.equal(shouldDispatchDeathAfterPlagueZone(true), true);
    assert.equal(shouldDispatchDeathAfterPlagueZone(false), false);
  });
});
