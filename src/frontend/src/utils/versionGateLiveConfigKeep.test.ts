import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldPreserveVersionGateKey } from "./versionGate.ts";
import {
  colorPaletteIsMandatoryGameplayPersistDep,
  isLiveGameplayLocalConfigKey,
  shouldPreserveLiveGameplayLocalConfigKey,
  versionGateOnMainDropsLiveGameplayLocalConfig,
} from "./versionGateLiveConfigKeep.ts";

describe("versionGateLiveConfigKeep", () => {
  it("names the live boss / rush localStorage catalogs", () => {
    assert.equal(isLiveGameplayLocalConfigKey("pbv_boss_configs"), true);
    assert.equal(isLiveGameplayLocalConfigKey("bossRushConfig"), true);
    assert.equal(isLiveGameplayLocalConfigKey("pbv_boss_rush_config"), true);
    assert.equal(isLiveGameplayLocalConfigKey("pbv_color_palette"), false);
    assert.equal(isLiveGameplayLocalConfigKey("pbv_tier_spawn_config"), false);
  });

  it("HEAD version-gate drops those catalogs while keeping spawn/level-up/inventory", () => {
    assert.equal(shouldPreserveVersionGateKey("pbv_boss_configs"), false);
    assert.equal(shouldPreserveVersionGateKey("bossRushConfig"), false);
    assert.equal(shouldPreserveVersionGateKey("pbv_boss_rush_config"), false);
    assert.equal(shouldPreserveVersionGateKey("pbv_tier_spawn_config"), true);
    assert.equal(shouldPreserveVersionGateKey("pbv_levelup_config"), true);
    assert.equal(shouldPreserveVersionGateKey("aaaaa-aa_inventory"), true);
    assert.equal(
      versionGateOnMainDropsLiveGameplayLocalConfig("pbv_boss_configs"),
      true,
    );
  });

  it("intends to keep live catalogs and still treats palette as optional", () => {
    assert.equal(
      shouldPreserveLiveGameplayLocalConfigKey("pbv_boss_configs"),
      true,
    );
    assert.equal(
      shouldPreserveLiveGameplayLocalConfigKey("pbv_color_palette"),
      false,
    );
    assert.equal(colorPaletteIsMandatoryGameplayPersistDep(), false);
  });
});
