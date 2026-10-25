/**
 * Combat action parity: leftover-walk lava / spikes soak vs
 * `playerTakesDamage`. A decided legal in-battle lava or spikes step
 * (Shield Charm still stacked, Untouchable accepted) records HP actually
 * lost after RES then shield; an overworld step cannot tax the next
 * fight; live still raw-subtracts.
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
  recordInBattleChallengeDamage,
} from "../utils/challengeCompletion.ts";
import { battleWalkHazardDamages } from "./battleSetup.ts";
import {
  LAVA_WALK_DAMAGE_MAX,
  LAVA_WALK_DAMAGE_MIN,
  SPIKE_WALK_DAMAGE_MAX,
  SPIKE_WALK_DAMAGE_MIN,
  isLavaSpikeWalkBlockedThornRiftHazard,
  isLavaSpikeWalkHazardType,
  liveWxRawLavaSpikeWalkHit,
  planLavaSpikeWalkHit,
  recordLavaSpikeWalkChallengeDamage,
  rollLavaWalkDamage,
  rollSpikeWalkDamage,
  shouldDispatchDeathAfterLavaSpikeWalk,
} from "./lavaSpikeWalkHit.ts";

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

describe("lava / spikes leftover-walk soak vs live WX raw subtract", () => {
  it("keeps live leftover-walk lava 8–15 and spikes 5–10 rolls", () => {
    assert.equal(
      rollLavaWalkDamage(() => 0),
      LAVA_WALK_DAMAGE_MIN,
    );
    assert.equal(
      rollLavaWalkDamage(() => 0.999),
      LAVA_WALK_DAMAGE_MAX,
    );
    assert.equal(LAVA_WALK_DAMAGE_MIN, 8);
    assert.equal(LAVA_WALK_DAMAGE_MAX, 15);
    assert.equal(
      rollSpikeWalkDamage(() => 0),
      SPIKE_WALK_DAMAGE_MIN,
    );
    assert.equal(
      rollSpikeWalkDamage(() => 0.999),
      SPIKE_WALK_DAMAGE_MAX,
    );
    assert.equal(SPIKE_WALK_DAMAGE_MIN, 5);
    assert.equal(SPIKE_WALK_DAMAGE_MAX, 10);
  });

  it("keys off hazard-tile metadata, not thorn/rift or ice", () => {
    assert.equal(isLavaSpikeWalkHazardType("lava"), true);
    assert.equal(isLavaSpikeWalkHazardType("spikes"), true);
    assert.equal(isLavaSpikeWalkHazardType("ice"), false);
    assert.equal(isLavaSpikeWalkHazardType("thorned_ground"), false);
    assert.equal(isLavaSpikeWalkHazardType("void_rift"), false);
    assert.equal(isLavaSpikeWalkBlockedThornRiftHazard("thorned_ground"), true);
    assert.equal(isLavaSpikeWalkBlockedThornRiftHazard("void_rift"), true);
    assert.equal(isLavaSpikeWalkBlockedThornRiftHazard("lava"), false);
    assert.equal(isLavaSpikeWalkBlockedThornRiftHazard("spikes"), false);
  });

  it("live leftover-walk rAF still raw-subtracts lava / spikes and skips soak", () => {
    const wx = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/WorldExploration.tsx",
      ),
      "utf8",
    );
    const lavaLog = wx.indexOf("You stepped on lava!");
    assert.ok(lavaLog >= 0, "player lava leftover-walk log is present");
    const lavaBlock = wx.slice(lavaLog - 700, lavaLog + 400);
    assert.match(lavaBlock, /8 \+ Math\.floor\(Math\.random\(\) \* 8\)/);
    assert.match(lavaBlock, /hp: Math\.max\(0, prev\.hp - rawDmg\)/);
    assert.match(lavaBlock, /recordInBattleChallengeDamage/);
    assert.equal(lavaBlock.includes("playerTakesDamage"), false);
    assert.equal(lavaBlock.includes("shieldHpRef"), false);
    assert.equal(lavaBlock.includes("_handlePlayerDeath"), false);

    const spikeLog = wx.indexOf("You stepped on spikes!");
    assert.ok(spikeLog >= 0, "player spikes leftover-walk log is present");
    const spikeBlock = wx.slice(spikeLog - 700, spikeLog + 200);
    assert.match(spikeBlock, /5 \+ Math\.floor\(Math\.random\(\) \* 6\)/);
    assert.match(spikeBlock, /hp: Math\.max\(0, prev\.hp - spikeDmg\)/);
    assert.match(spikeBlock, /recordInBattleChallengeDamage/);
    assert.equal(spikeBlock.includes("playerTakesDamage"), false);
    assert.equal(spikeBlock.includes("shieldHpRef"), false);
    assert.equal(spikeBlock.includes("_handlePlayerDeath"), false);
  });

  it("lets Shield Charm soak an in-battle lava step the way playerTakesDamage does", () => {
    // Sequence: Shield Charm 20, Untouchable, lava roll 10.
    // Live WX subtracted 10 and recorded 10, so the shield sat unused
    // and the 500 Doka / 1000 XP objective failed even though an enemy
    // kit hit of 10 would have been soaked.
    const incoming = 10;
    assert.equal(isLavaSpikeWalkHazardType("lava"), true);

    const raw = liveWxRawLavaSpikeWalkHit(50, incoming);
    assert.equal(raw.newHp, 40);
    assert.equal(raw.challengeDamage, 10);
    assert.equal(
      isChallengeCompleted(UNTOUCHABLE, progress(raw.challengeDamage)),
      false,
    );

    const soaked = planLavaSpikeWalkHit({
      incoming,
      hp: 50,
      res: 0,
      resModifier: 1,
      shieldHp: 20,
    });
    assert.equal(soaked.damageAfterRes, 10);
    assert.equal(soaked.shieldAbsorb, 10);
    assert.equal(soaked.remainingShield, 10);
    assert.equal(soaked.hpLost, 0);
    assert.equal(soaked.newHp, 50);
    assert.equal(soaked.lethal, false);
    assert.equal(soaked.challengeDamage, 0);
    assert.notEqual(raw.challengeDamage, soaked.challengeDamage);
    const total = recordLavaSpikeWalkChallengeDamage(
      true,
      0,
      soaked.challengeDamage,
    );
    assert.equal(isChallengeCompleted(UNTOUCHABLE, progress(total)), true);
  });

  it("lets Shield Charm soak an in-battle spikes step", () => {
    const incoming = 7;
    const raw = liveWxRawLavaSpikeWalkHit(80, incoming);
    assert.equal(
      isChallengeCompleted(UNTOUCHABLE, progress(raw.challengeDamage)),
      false,
    );

    const soaked = planLavaSpikeWalkHit({
      incoming,
      hp: 80,
      res: 0,
      resModifier: 1,
      shieldHp: 20,
    });
    assert.equal(soaked.hpLost, 0);
    assert.equal(soaked.remainingShield, 13);
    assert.equal(soaked.newHp, 80);
    assert.equal(soaked.challengeDamage, 0);
    const total = recordChallengeDamageTaken(0, soaked.challengeDamage);
    assert.equal(isChallengeCompleted(UNTOUCHABLE, progress(total)), true);
  });

  it("applies RES before the shield, matching playerTakesDamage", () => {
    // lava 10, RES 50 → 5 after RES, shield 3 → 2 HP lost.
    const hit = planLavaSpikeWalkHit({
      incoming: 10,
      hp: 30,
      res: 50,
      resModifier: 1,
      shieldHp: 3,
    });
    assert.equal(hit.damageAfterRes, 5);
    assert.equal(hit.shieldAbsorb, 3);
    assert.equal(hit.hpLost, 2);
    assert.equal(hit.newHp, 28);
    assert.equal(hit.lethal, false);

    const raw = liveWxRawLavaSpikeWalkHit(30, 10);
    assert.equal(raw.newHp, 20);
    assert.equal(raw.challengeDamage, 10);
  });

  it("does not mint a 1 HP hit from a missing hazard packet", () => {
    const hit = planLavaSpikeWalkHit({
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

  it("marks a lethal in-battle lava step from live HP after soak", () => {
    const soaked = planLavaSpikeWalkHit({
      incoming: 10,
      hp: 2,
      res: 0,
      resModifier: 1,
      shieldHp: 0,
    });
    assert.equal(soaked.newHp, 0);
    assert.equal(soaked.lethal, true);
    assert.equal(soaked.challengeDamage, 10);
    assert.equal(shouldDispatchDeathAfterLavaSpikeWalk(soaked.lethal), true);

    const raw = liveWxRawLavaSpikeWalkHit(2, 10);
    assert.equal(raw.newHp, 0);
    assert.equal(shouldDispatchDeathAfterLavaSpikeWalk(raw.newHp === 0), true);
  });

  it("does not dispatch death when Shield Charm soaks a lethal-sized lava packet", () => {
    const soaked = planLavaSpikeWalkHit({
      incoming: 12,
      hp: 2,
      res: 0,
      resModifier: 1,
      shieldHp: 20,
    });
    assert.equal(soaked.newHp, 2);
    assert.equal(soaked.lethal, false);
    assert.equal(soaked.challengeDamage, 0);
    assert.equal(shouldDispatchDeathAfterLavaSpikeWalk(soaked.lethal), false);
  });

  it("overworld lava / spikes must not tax the next fight's Untouchable", () => {
    const soaked = planLavaSpikeWalkHit({
      incoming: 10,
      hp: 50,
      res: 0,
      resModifier: 1,
      shieldHp: 0,
    });
    assert.equal(soaked.hpLost, 10);
    const overworld = recordLavaSpikeWalkChallengeDamage(
      false,
      0,
      soaked.hpLost,
    );
    assert.equal(overworld, 0);
    assert.equal(recordInBattleChallengeDamage(false, 0, 15), 0);
    assert.equal(isChallengeCompleted(UNTOUCHABLE, progress(overworld)), true);

    const inBattle = recordLavaSpikeWalkChallengeDamage(true, 0, soaked.hpLost);
    assert.equal(inBattle, 10);
    assert.equal(isChallengeCompleted(UNTOUCHABLE, progress(inBattle)), false);
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
    assert.equal(damages.riftDmg, 3);
    assert.equal(isLavaSpikeWalkHazardType("thorned_ground"), false);
    assert.equal(isLavaSpikeWalkHazardType("void_rift"), false);
    const rawThornRift = recordChallengeWalkHazardDamage(0, damages);
    assert.equal(rawThornRift, 13);
    assert.equal(
      isChallengeCompleted(UNTOUCHABLE, progress(rawThornRift)),
      false,
    );
  });

  it("does not steal Void Mirror 25% reflect soak (#1084)", () => {
    const voidMirrorPacket = Math.floor(20 * 0.25);
    assert.equal(voidMirrorPacket, 5);
    assert.equal(isLavaSpikeWalkHazardType("void_mirror"), false);
    assert.equal(voidMirrorPacket < LAVA_WALK_DAMAGE_MIN, true);
  });

  it("shouldDispatchDeathAfterLavaSpikeWalk is true only for a lethal soaked packet", () => {
    assert.equal(shouldDispatchDeathAfterLavaSpikeWalk(true), true);
    assert.equal(shouldDispatchDeathAfterLavaSpikeWalk(false), false);
  });
});
