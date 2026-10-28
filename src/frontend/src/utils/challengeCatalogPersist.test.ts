import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  FRONTEND_ONLY_CHALLENGE_IDS,
  aliasTableRequiredBeforePersistingChallengeIds,
  challengeCatalogIsFrontendOnly,
  challengeRewardsPersistWithoutChallengeId,
  characterRecordStoresChallengeIds,
  renamingChallengeIdPreservesCompletionHistory,
  retiredChallengeIdCorruptsCharacterSave,
  shouldAddRequiredCharacterChallengeIds,
} from "./challengeCatalogPersist.ts";
import { DEFAULT_CHALLENGES } from "./challengeCompletion.ts";

describe("challengeCatalogPersist", () => {
  it("live catalog ids exist only on the frontend DEFAULT_CHALLENGES list", () => {
    assert.equal(challengeCatalogIsFrontendOnly(), true);
    assert.equal(characterRecordStoresChallengeIds(), false);
    const liveIds = DEFAULT_CHALLENGES.map((row) => row.id).sort();
    const locked = [...FRONTEND_ONLY_CHALLENGE_IDS].sort();
    assert.deepEqual(liveIds, locked);
    assert.ok(liveIds.includes("easy_1"));
    assert.ok(liveIds.includes("legendary_3"));
  });

  it("renames and retirements cannot preserve or corrupt a history that is not stored", () => {
    assert.equal(renamingChallengeIdPreservesCompletionHistory(), false);
    assert.equal(retiredChallengeIdCorruptsCharacterSave(), false);
    assert.equal(challengeRewardsPersistWithoutChallengeId(), true);
  });

  it("does not approve a required Character.challengeIds field", () => {
    assert.equal(shouldAddRequiredCharacterChallengeIds(), false);
    assert.equal(aliasTableRequiredBeforePersistingChallengeIds(), true);
  });
});
