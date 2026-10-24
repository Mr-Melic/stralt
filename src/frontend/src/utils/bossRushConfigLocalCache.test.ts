import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ADMIN_BOSS_RUSH_CONFIG_KEY,
  WX_BOSS_RUSH_CONFIG_KEY,
  getBossRushConfigReturnsJsonText,
  jsonStringifyDoubleEncodesBossRushConfigText,
  officialPlayParsesCanisterBossRushConfigOnce,
  officialPlayReadsWxBossRushConfigKey,
  parseBossRushConfigCache,
  serializeBossRushConfigForLocalCache,
  wxBossRushConfigKeyMatchesAdminDraftKey,
} from "./bossRushConfigLocalCache.ts";

describe("bossRushConfigLocalCache", () => {
  const canisterText = '{"rewardMultiplier":2.5,"room0Enabled":true}';

  it("treats getBossRushConfig as JSON Text and does not stringify it", () => {
    assert.equal(getBossRushConfigReturnsJsonText(), true);
    assert.equal(
      serializeBossRushConfigForLocalCache(canisterText),
      canisterText,
    );
    assert.equal(
      jsonStringifyDoubleEncodesBossRushConfigText(canisterText),
      true,
    );
    assert.equal(JSON.stringify(canisterText).startsWith('"'), true);
  });

  it("keeps the WX cache off the official reward path and off the admin draft key", () => {
    assert.equal(WX_BOSS_RUSH_CONFIG_KEY, "pbv_boss_rush_config");
    assert.equal(ADMIN_BOSS_RUSH_CONFIG_KEY, "bossRushConfig");
    assert.equal(wxBossRushConfigKeyMatchesAdminDraftKey(), false);
    assert.equal(officialPlayReadsWxBossRushConfigKey(), false);
    assert.equal(officialPlayParsesCanisterBossRushConfigOnce(), true);
  });

  it("parses raw JSON and the HEAD double-encoded blob", () => {
    assert.equal(parseBossRushConfigCache(canisterText)?.rewardMultiplier, 2.5);
    assert.equal(
      parseBossRushConfigCache(JSON.stringify(canisterText))?.rewardMultiplier,
      2.5,
    );
    assert.equal(parseBossRushConfigCache(""), null);
    assert.equal(parseBossRushConfigCache("not-json"), null);
  });
});
