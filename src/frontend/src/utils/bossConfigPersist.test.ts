import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BOSS_CONFIG_LOCAL_STORAGE_KEY,
  FRONTEND_BOSS_CONFIG_ONLY_FIELDS,
  MOTOKO_BOSS_CONFIG_ONLY_FIELDS,
  bossConfigSchemasCompatibleForDirectBindgen,
  isOfficialBossConfigCanisterLive,
  resolveOfficialBossConfigLoadSource,
} from "./bossConfigPersist.ts";

describe("bossConfigPersist", () => {
  it("keeps official boss config on localStorage, not the canister", () => {
    assert.equal(isOfficialBossConfigCanisterLive(), false);
    assert.equal(resolveOfficialBossConfigLoadSource(), "localStorage");
    assert.equal(BOSS_CONFIG_LOCAL_STORAGE_KEY, "pbv_boss_configs");
  });

  it("records Motoko vs frontend BossConfig field skew", () => {
    assert.deepEqual(
      [...MOTOKO_BOSS_CONFIG_ONLY_FIELDS],
      ["defeated", "adminNotes"],
    );
    assert.deepEqual(
      [...FRONTEND_BOSS_CONFIG_ONLY_FIELDS],
      ["iconEmoji", "loreText", "chc"],
    );
    assert.equal(bossConfigSchemasCompatibleForDirectBindgen(), false);
  });
});
