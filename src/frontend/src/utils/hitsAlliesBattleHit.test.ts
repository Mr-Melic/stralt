import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldAwardVictory } from "../engine/battleSetup.ts";
import {
  HITS_ALLIES_PLAYER_SENTINEL_ID,
  hitsAlliesBattleHitDelta,
  hitsAlliesPlayerHpAfterSelfHit,
  isHitsAlliesPlayerSentinel,
  shouldAwardVictoryAfterHitsAlliesAoE,
  shouldRunHitsAlliesPlayerDeath,
} from "./hitsAlliesBattleHit.ts";
import { clientTrustedVictoryAchievementConditions } from "./victoryAchievements.ts";

const featBase = {
  hp: 80,
  mapsVisited: 3,
  groundDokaPickups: 0,
  spellBarCount: 4,
  hasSpellAtLeast5: false,
  critHits: 0,
  pacifist: false,
  betrayal: false,
  doubleBetrayal: false,
  leaderSlain: false,
  bossId: null as string | null,
};

/** Live applyDamageToEnemy: increment before the `__player__` identity branch. */
function liveHitsAlliesBattleHitDelta(opts: {
  hitTargetId: string | undefined | null;
  isCrit: boolean;
}): { hits: number; crits: number } {
  void opts.hitTargetId;
  return { hits: 1, crits: opts.isCrit === true ? 1 : 0 };
}

function sumTally(
  targets: string[],
  isCrit: boolean,
  tally: typeof hitsAlliesBattleHitDelta,
): { hits: number; crits: number } {
  return targets.reduce(
    (acc, hitTargetId) => {
      const delta = tally({ hitTargetId, isCrit });
      return { hits: acc.hits + delta.hits, crits: acc.crits + delta.crits };
    },
    { hits: 0, crits: 0 },
  );
}

describe("isHitsAlliesPlayerSentinel", () => {
  it("matches only the getAoETargets player sentinel", () => {
    assert.equal(HITS_ALLIES_PLAYER_SENTINEL_ID, "__player__");
    assert.equal(isHitsAlliesPlayerSentinel("__player__"), true);
    assert.equal(isHitsAlliesPlayerSentinel("player"), false);
    assert.equal(isHitsAlliesPlayerSentinel("rat-1"), false);
    assert.equal(isHitsAlliesPlayerSentinel(null), false);
  });
});

describe("hitsAlliesBattleHitDelta vs live applyDamageToEnemy", () => {
  it("does not count a self-AoE as a battle hit or crit", () => {
    assert.deepEqual(
      hitsAlliesBattleHitDelta({
        hitTargetId: "__player__",
        isCrit: true,
      }),
      { hits: 0, crits: 0 },
    );
    assert.deepEqual(
      hitsAlliesBattleHitDelta({
        hitTargetId: "__player__",
        isCrit: false,
      }),
      { hits: 0, crits: 0 },
    );
  });

  it("still counts the hostile in the same AoE", () => {
    assert.deepEqual(
      hitsAlliesBattleHitDelta({ hitTargetId: "rat-1", isCrit: true }),
      { hits: 1, crits: 1 },
    );
    assert.deepEqual(
      hitsAlliesBattleHitDelta({ hitTargetId: "rat-1", isCrit: false }),
      { hits: 1, crits: 0 },
    );
  });

  it("proves live tally farms critical_5_in_battle from self-AoE crits", () => {
    // Three crit casts: each hits last remaining rats + the player tile.
    const oneCast = ["rat-1", "__player__"];
    const live = { hits: 0, crits: 0 };
    const expected = { hits: 0, crits: 0 };
    for (let i = 0; i < 3; i += 1) {
      const liveCast = sumTally(oneCast, true, liveHitsAlliesBattleHitDelta);
      const expectedCast = sumTally(oneCast, true, hitsAlliesBattleHitDelta);
      live.hits += liveCast.hits;
      live.crits += liveCast.crits;
      expected.hits += expectedCast.hits;
      expected.crits += expectedCast.crits;
    }
    assert.deepEqual(live, { hits: 6, crits: 6 });
    assert.deepEqual(expected, { hits: 3, crits: 3 });
    assert.notEqual(live.crits, expected.crits);

    const liveFeats = clientTrustedVictoryAchievementConditions({
      ...featBase,
      critHits: live.crits,
    });
    const expectedFeats = clientTrustedVictoryAchievementConditions({
      ...featBase,
      critHits: expected.crits,
    });
    assert.equal(liveFeats.includes("critical_5_in_battle"), true);
    assert.equal(expectedFeats.includes("critical_5_in_battle"), false);
  });

  it("does not unlock critical_5_in_battle from five self-only crits", () => {
    const fiveSelfHits = Array.from({ length: 5 }, () => "__player__");
    const live = sumTally(fiveSelfHits, true, liveHitsAlliesBattleHitDelta);
    const expected = sumTally(fiveSelfHits, true, hitsAlliesBattleHitDelta);
    assert.deepEqual(live, { hits: 5, crits: 5 });
    assert.deepEqual(expected, { hits: 0, crits: 0 });
    assert.equal(
      clientTrustedVictoryAchievementConditions({
        ...featBase,
        critHits: live.crits,
      }).includes("critical_5_in_battle"),
      true,
    );
    assert.equal(
      clientTrustedVictoryAchievementConditions({
        ...featBase,
        critHits: expected.crits,
      }).includes("critical_5_in_battle"),
      false,
    );
  });
});

describe("hitsAlliesPlayerHpAfterSelfHit lethal vs victory", () => {
  it("marks a killing self-AoE lethal without changing damage math", () => {
    assert.deepEqual(hitsAlliesPlayerHpAfterSelfHit(8, 10), {
      newHp: 0,
      lethal: true,
    });
    assert.deepEqual(hitsAlliesPlayerHpAfterSelfHit(50, 12), {
      newHp: 38,
      lethal: false,
    });
    assert.equal(shouldRunHitsAlliesPlayerDeath(true), true);
    assert.equal(shouldRunHitsAlliesPlayerDeath(false), false);
  });

  it("refuses applyRewards when the same AoE kills the last hostile and the player", () => {
    const lastHostileDown = {
      inBattle: true,
      deathTriggered: false,
      battleStartIdsSize: 1,
      hostilesRemaining: 0,
    };
    // Live: HP-watch has not set deathTriggered yet (same cast, enemies first).
    assert.equal(shouldAwardVictory(lastHostileDown), true);
    assert.equal(
      shouldAwardVictoryAfterHitsAlliesAoE({
        ...lastHostileDown,
        selfHitLethal: true,
      }),
      false,
    );
    assert.equal(
      shouldAwardVictoryAfterHitsAlliesAoE({
        ...lastHostileDown,
        selfHitLethal: false,
      }),
      true,
    );
  });

  it("still refuses when deathTriggered is already set (HP-watch / melee linchpin)", () => {
    assert.equal(
      shouldAwardVictoryAfterHitsAlliesAoE({
        inBattle: true,
        deathTriggered: true,
        selfHitLethal: false,
        battleStartIdsSize: 1,
        hostilesRemaining: 0,
      }),
      false,
    );
  });
});
