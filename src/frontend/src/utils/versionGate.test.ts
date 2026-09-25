import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  GROUND_DOKA_PICKUPS_PROGRESS_BASE,
  MAPS_VISITED_PROGRESS_BASE,
  collectPreservedLocalStorage,
  shouldPreserveVersionGateKey,
} from "./versionGate.ts";

describe("versionGate", () => {
  it("keeps paid buff inventory, admin spawn caches, unpaid death, feat counters, and shrine/covenant across a version wipe", () => {
    assert.equal(shouldPreserveVersionGateKey("pbv_tier_spawn_config"), true);
    assert.equal(shouldPreserveVersionGateKey("pbv_levelup_config"), true);
    assert.equal(shouldPreserveVersionGateKey("aaaaa-aa_inventory"), true);
    assert.equal(
      shouldPreserveVersionGateKey("pbv_pending_death_penalty_slot1"),
      true,
    );
    assert.equal(
      shouldPreserveVersionGateKey("pbv_pending_death_penalty_aaaaa-aa_slot2"),
      true,
    );
    assert.equal(
      shouldPreserveVersionGateKey(
        `aaaaa-aa_slot1_${MAPS_VISITED_PROGRESS_BASE}`,
      ),
      true,
    );
    assert.equal(
      shouldPreserveVersionGateKey(
        `aaaaa-aa_slot2_${GROUND_DOKA_PICKUPS_PROGRESS_BASE}`,
      ),
      true,
    );
    assert.equal(
      shouldPreserveVersionGateKey("pbv_covenant_buff_aaaaa-aa_slot1"),
      true,
    );
    assert.equal(
      shouldPreserveVersionGateKey("pbv_shrine_count_aaaaa-aa_slot1"),
      true,
    );
    assert.equal(shouldPreserveVersionGateKey("pbv_app_version"), false);
    assert.equal(shouldPreserveVersionGateKey("pbv_show_changelog"), false);
    assert.equal(
      shouldPreserveVersionGateKey("aaaaa-aa_slot1_pbv_active_spells"),
      false,
    );
    assert.equal(
      shouldPreserveVersionGateKey("pbv_panel_layout_aaaaa-aa"),
      false,
    );

    const store: Record<string, string> = {
      pbv_tier_spawn_config: "{}",
      "aaaaa-aa_inventory": '{"health_potion":2}',
      pbv_pending_death_penalty_slot1: '{"slot":1}',
      "aaaaa-aa_slot1_pbv_maps_visited_count": "17",
      "aaaaa-aa_slot1_pbv_ground_doka_pickups": "4",
      pbv_covenant_buff_aaaaa_slot1: "3",
      pbv_shrine_count_aaaaa_slot1: "2",
      "aaaaa-aa_slot1_pbv_active_spells": "[]",
      pbv_app_version: "v162",
      other: "drop",
    };
    assert.deepEqual(
      collectPreservedLocalStorage(
        Object.keys(store),
        (key) => store[key] ?? null,
      ),
      {
        pbv_tier_spawn_config: "{}",
        "aaaaa-aa_inventory": '{"health_potion":2}',
        pbv_pending_death_penalty_slot1: '{"slot":1}',
        "aaaaa-aa_slot1_pbv_maps_visited_count": "17",
        "aaaaa-aa_slot1_pbv_ground_doka_pickups": "4",
        pbv_covenant_buff_aaaaa_slot1: "3",
        pbv_shrine_count_aaaaa_slot1: "2",
      },
    );
  });
});
