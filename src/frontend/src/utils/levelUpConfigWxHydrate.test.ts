import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CANISTER_AP_MP_FIELD,
  FRONTEND_AP_MP_FIELD,
  compoundingHpWouldClipOnPersist,
  compoundingProgressionHp,
  linearPersistHp,
  officialWxCallsGetLevelUpConfig,
  wxLevelUpBlobCanDivergeFromCanister,
  wxSpreadKeepsFrontendApMpAlias,
} from "./levelUpConfigWxHydrate.ts";

describe("levelUpConfigWxHydrate", () => {
  it("does not treat localStorage as a substitute for getLevelUpConfig", () => {
    assert.equal(officialWxCallsGetLevelUpConfig(), false);
    assert.equal(
      wxLevelUpBlobCanDivergeFromCanister({
        blobGrowthPercent: 5,
        canisterGrowthPercent: 10,
      }),
      true,
    );
    assert.equal(
      wxLevelUpBlobCanDivergeFromCanister({
        blobGrowthPercent: 5,
        canisterGrowthPercent: 5,
      }),
      false,
    );
  });

  it("keeps DEFAULT apMpGrowthEveryNLevels when the blob only has canister name", () => {
    assert.equal(
      wxSpreadKeepsFrontendApMpAlias({
        defaults: { [FRONTEND_AP_MP_FIELD]: 25, statGrowthPercent: 5 },
        blob: { [CANISTER_AP_MP_FIELD]: 1, statGrowthPercent: 5 },
      }),
      true,
    );
    assert.equal(
      wxSpreadKeepsFrontendApMpAlias({
        defaults: { [FRONTEND_AP_MP_FIELD]: 25 },
        blob: { [FRONTEND_AP_MP_FIELD]: 10 },
      }),
      false,
    );
  });

  it("persist HP is linear; compounding getPlayerBaseStats HP clips at L20", () => {
    assert.equal(linearPersistHp(10, 5), 145);
    assert.equal(compoundingProgressionHp(10, 5), Math.round(100 * 1.05 ** 9));
    assert.equal(
      compoundingHpWouldClipOnPersist({ level: 1, growthPercent: 5 }),
      false,
    );
    assert.equal(
      compoundingHpWouldClipOnPersist({ level: 20, growthPercent: 5 }),
      true,
    );
  });
});
