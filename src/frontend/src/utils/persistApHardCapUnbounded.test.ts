import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MAX_PERSISTED_AP,
  MAX_PERSISTED_MP,
  maxPersistedAp,
} from "./adminSafety.ts";
import {
  AP_MP_THRESHOLD_ADMIN_MIN,
  DEFAULT_AP_MP_THRESHOLD,
  adminMaySetApMpThreshold,
  firstLevelWherePersistApHitsHardCap,
  persistApHardCapIsSilentMax,
  persistMpHardCapIsSilentMax,
  uncappedPersistedAp,
} from "./persistApHardCapUnbounded.ts";

describe("persistApHardCapUnbounded", () => {
  it("caps persist AP at 20 while the uncapped formula keeps growing", () => {
    assert.equal(adminMaySetApMpThreshold(AP_MP_THRESHOLD_ADMIN_MIN), true);
    assert.equal(adminMaySetApMpThreshold(0), false);
    assert.equal(firstLevelWherePersistApHitsHardCap(1), 12);
    assert.equal(
      firstLevelWherePersistApHitsHardCap(DEFAULT_AP_MP_THRESHOLD),
      300,
    );
    assert.equal(maxPersistedAp(12, 1), MAX_PERSISTED_AP);
    assert.equal(uncappedPersistedAp(13, 1), 21);
    assert.equal(persistApHardCapIsSilentMax(13, 1), true);
    assert.equal(persistApHardCapIsSilentMax(11, 1), false);
    assert.equal(
      persistApHardCapIsSilentMax(300, DEFAULT_AP_MP_THRESHOLD),
      false,
    );
    assert.equal(
      persistApHardCapIsSilentMax(325, DEFAULT_AP_MP_THRESHOLD),
      true,
    );
    assert.equal(persistMpHardCapIsSilentMax(17, 1), true);
    assert.equal(MAX_PERSISTED_MP, 20);
  });
});
