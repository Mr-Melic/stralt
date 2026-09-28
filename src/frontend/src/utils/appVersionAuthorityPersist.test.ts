import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  frontendAndCanisterAppVersionsAreIndependent,
  officialDismissMarksCanisterChangelog,
  officialVersionWipeUsesFrontendAppVersion,
  versionGatePreservesAppVersionKey,
  versionGatePreservesBossConfigCache,
  versionGatePreservesBossRushConfigCache,
  versionGatePreservesColorPaletteCache,
  versionGatePreservesShowChangelogFlag,
} from "./appVersionAuthorityPersist.ts";

describe("appVersionAuthorityPersist", () => {
  it("documents frontend APP_VERSION wipe vs unused canister changelog maps", () => {
    assert.equal(officialVersionWipeUsesFrontendAppVersion(), true);
    assert.equal(officialDismissMarksCanisterChangelog(), false);
    assert.equal(frontendAndCanisterAppVersionsAreIndependent(), true);
    assert.equal(versionGatePreservesShowChangelogFlag(), false);
    assert.equal(versionGatePreservesAppVersionKey(), false);
    assert.equal(versionGatePreservesBossConfigCache(), false);
    assert.equal(versionGatePreservesColorPaletteCache(), false);
    assert.equal(versionGatePreservesBossRushConfigCache(), false);
  });
});
