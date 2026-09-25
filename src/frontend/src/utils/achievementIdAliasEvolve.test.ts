import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  achievementIdHasAliasTable,
  achievementProgressKey,
  achievementRenameShouldKeepId,
  adminSetNewIdPreservesOldProgress,
} from "./achievementIdAliasEvolve.ts";

describe("achievementIdAliasEvolve", () => {
  it("keys progress by principal#id and has no remap table", () => {
    assert.equal(
      achievementProgressKey("aaaaa-aa", "explore_25_maps"),
      "aaaaa-aa#explore_25_maps",
    );
    assert.equal(achievementIdHasAliasTable(), false);
    assert.equal(adminSetNewIdPreservesOldProgress(), false);
    assert.equal(achievementRenameShouldKeepId(), true);
  });
});
