import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MAX_DUNGEON_DEPTH } from "./adminSafety.ts";
import {
  dungeonDepthIsCappedAt16,
  dungeonRecordsSurviveCharacterDelete,
  liveDungeonChainIsSessionRefs,
  missingDungeonRecordReadsAsNull,
  nullCanisterRowMeansOfficialNeverPersisted,
  officialClientWritesDungeonRecords,
  officialReloadWouldKeepDungeonDepth,
} from "./dungeonRecordsOfficialPersist.ts";

describe("dungeonRecordsOfficialPersist", () => {
  it("treats canister dungeonRecords as unused by official play", () => {
    assert.equal(officialClientWritesDungeonRecords(), false);
    assert.equal(liveDungeonChainIsSessionRefs(), true);
    assert.equal(missingDungeonRecordReadsAsNull(), true);
    assert.equal(officialReloadWouldKeepDungeonDepth(), false);
    assert.equal(dungeonRecordsSurviveCharacterDelete(), true);
    assert.equal(nullCanisterRowMeansOfficialNeverPersisted(), true);
    assert.equal(MAX_DUNGEON_DEPTH, 16);
    assert.equal(dungeonDepthIsCappedAt16(16), true);
    assert.equal(dungeonDepthIsCappedAt16(99), true);
  });
});
