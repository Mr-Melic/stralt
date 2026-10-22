import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  achievementConditionShouldBeConfigurable,
  bossDefeatAchievementCondition,
  isBossDefeatAchievementCondition,
} from "./achievementConditionIds.ts";
import {
  KNOWN_ACHIEVEMENT_CONDITIONS,
  knownAchievementCondition,
} from "./adminSafety.ts";
import { clientTrustedVictoryAchievementConditions } from "./victoryAchievements.ts";

describe("achievementConditionIds", () => {
  it("builds a stable boss-defeat condition from the content id", () => {
    assert.equal(
      bossDefeatAchievementCondition("starved_pawn"),
      "boss_defeated_starved_pawn",
    );
    assert.equal(bossDefeatAchievementCondition("  "), "");
    assert.equal(
      isBossDefeatAchievementCondition("boss_defeated_starved_pawn"),
      true,
    );
    assert.equal(isBossDefeatAchievementCondition("boss_defeated_"), false);
    assert.equal(isBossDefeatAchievementCondition("leader_slayer"), false);
  });

  it("victory emits the helper id, but the live allowlist still rejects it", () => {
    const condition = bossDefeatAchievementCondition("starved_pawn");
    const emitted = clientTrustedVictoryAchievementConditions({
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
      bossId: "starved_pawn",
    });
    assert.ok(emitted.includes(condition));
    // Live gap: SDEG-2026-10-22-001. Flip this when adminGuard + adminSafety
    // accept the prefix (do not add a required persist field).
    assert.equal(knownAchievementCondition(condition), false);
    assert.equal(
      (KNOWN_ACHIEVEMENT_CONDITIONS as readonly string[]).includes(condition),
      false,
    );
    assert.equal(
      achievementConditionShouldBeConfigurable(
        condition,
        KNOWN_ACHIEVEMENT_CONDITIONS,
      ),
      true,
    );
    assert.equal(
      achievementConditionShouldBeConfigurable(
        "instant_win",
        KNOWN_ACHIEVEMENT_CONDITIONS,
      ),
      false,
    );
  });
});
