import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DUNGEON_CHAIN_COMPLETE_CREDIT_ID,
  SHRINE_ALTAR_CREDIT_ID,
} from "./dokaPersist.ts";
import {
  HEAD_GROUND_DOKA_ID_PREFIX,
  claimedPickupSetSurvivesReload,
  headDungeonCompleteCreditId,
  headDungeonCompleteCreditIsRunScoped,
  headGroundDokaPickupId,
  headGroundDokaPickupIdSurvivesReload,
  headShrineAltarCreditId,
  headShrineAltarCreditIsVisitScoped,
  recommendedDungeonCompleteCreditId,
  recommendedGroundDokaPickupId,
  recommendedShrineCreditId,
  shouldAddRequiredCharacterPickupIdSet,
  stablePickupIdRequiredBeforePersistingMapLoot,
} from "./groundDokaPickupIdPersist.ts";

describe("groundDokaPickupIdPersist", () => {
  it("HEAD ground Doka ids include Date.now and do not survive reload", () => {
    assert.equal(HEAD_GROUND_DOKA_ID_PREFIX, "doka-");
    assert.equal(
      headGroundDokaPickupId(1700000000000, 3, 4),
      "doka-1700000000000-3-4",
    );
    assert.equal(
      headGroundDokaPickupIdSurvivesReload({
        spawnedAtMs: 1700000000000,
        reloadedAtMs: 1700000001000,
        tileX: 3,
        tileY: 4,
      }),
      false,
    );
    assert.equal(
      recommendedGroundDokaPickupId("seed-a", 3, 4),
      recommendedGroundDokaPickupId("seed-a", 3, 4),
    );
    assert.notEqual(
      recommendedGroundDokaPickupId("seed-a", 3, 4),
      recommendedGroundDokaPickupId("seed-b", 3, 4),
    );
    assert.equal(recommendedGroundDokaPickupId("", 3, 4), "");
  });

  it("HEAD shrine/dungeon credits are constants; recommended ids are visit/run scoped", () => {
    assert.equal(headShrineAltarCreditId(), SHRINE_ALTAR_CREDIT_ID);
    assert.equal(headShrineAltarCreditId(), "shrine-altar");
    assert.equal(
      headDungeonCompleteCreditId(),
      DUNGEON_CHAIN_COMPLETE_CREDIT_ID,
    );
    assert.equal(headShrineAltarCreditIsVisitScoped(), false);
    assert.equal(headDungeonCompleteCreditIsRunScoped(), false);
    assert.equal(recommendedShrineCreditId("visit-1"), "shrine:visit-1");
    assert.notEqual(
      recommendedShrineCreditId("visit-1"),
      recommendedShrineCreditId("visit-2"),
    );
    assert.equal(recommendedDungeonCompleteCreditId("run-4"), "dungeon:run-4");
    assert.equal(claimedPickupSetSurvivesReload(), false);
    assert.equal(shouldAddRequiredCharacterPickupIdSet(), false);
    assert.equal(stablePickupIdRequiredBeforePersistingMapLoot(), true);
  });
});
