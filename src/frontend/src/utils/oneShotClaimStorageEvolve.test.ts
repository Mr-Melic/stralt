import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  oneShotClaimIsLocalStorageOnly,
  oneShotClaimStorageKind,
  versionWipeRemintsOneShotViaClaimLoss,
} from "./oneShotClaimStorageEvolve.ts";

describe("oneShotClaimStorageEvolve", () => {
  it("documents memory-only claims (no version-wipe remint via claim id)", () => {
    assert.equal(oneShotClaimStorageKind(), "memory");
    assert.equal(oneShotClaimIsLocalStorageOnly(), false);
    assert.equal(versionWipeRemintsOneShotViaClaimLoss(), false);
  });
});
