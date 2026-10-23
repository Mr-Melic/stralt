import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ADMIN_DEFAULT_ELIGIBILITY_LEVEL_MAX,
  PICK_ENEMY_LEVEL_PLAYER_CAP,
  encounterLevelCapSilencesPlayerLevel,
  matchingRegionIds,
  regionEligibilityMissesPlayer,
} from "./unboundedEncounterLevelCap.ts";

describe("unboundedEncounterLevelCap", () => {
  it("pickEnemyLevelFromTiers silently caps players above 999", () => {
    assert.equal(PICK_ENEMY_LEVEL_PLAYER_CAP, 999);
    assert.equal(encounterLevelCapSilencesPlayerLevel(999), false);
    assert.equal(encounterLevelCapSilencesPlayerLevel(1000), true);
    assert.equal(encounterLevelCapSilencesPlayerLevel(50_000), true);
  });

  it("region bands leave a player unmatched above every levelMax", () => {
    const regions = [
      { id: "low", levelMin: 1, levelMax: 30 },
      { id: "mid", levelMin: 31n, levelMax: 100n },
    ];
    assert.deepEqual(matchingRegionIds(10, regions), ["low"]);
    assert.deepEqual(matchingRegionIds(50, regions), ["mid"]);
    assert.equal(regionEligibilityMissesPlayer(101, regions), true);
    assert.equal(
      ADMIN_DEFAULT_ELIGIBILITY_LEVEL_MAX > PICK_ENEMY_LEVEL_PLAYER_CAP,
      true,
    );
    assert.equal(
      regionEligibilityMissesPlayer(2000, [
        {
          levelMin: 1,
          levelMax: ADMIN_DEFAULT_ELIGIBILITY_LEVEL_MAX,
        },
      ]),
      false,
    );
  });
});
