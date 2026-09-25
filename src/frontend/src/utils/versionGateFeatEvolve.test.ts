import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  GROUND_DOKA_PICKUPS_PROGRESS_BASE,
  MAPS_VISITED_PROGRESS_BASE,
  shouldPreserveFeatSessionVersionGateKey,
} from "./versionGateFeatEvolve.ts";

describe("versionGateFeatEvolve", () => {
  it("keeps feat counters and shrine/covenant keys, not bar or panel layout", () => {
    assert.equal(
      shouldPreserveFeatSessionVersionGateKey(
        `aaaaa-aa_slot1_${MAPS_VISITED_PROGRESS_BASE}`,
      ),
      true,
    );
    assert.equal(
      shouldPreserveFeatSessionVersionGateKey(
        `aaaaa-aa_slot2_${GROUND_DOKA_PICKUPS_PROGRESS_BASE}`,
      ),
      true,
    );
    assert.equal(
      shouldPreserveFeatSessionVersionGateKey(
        "pbv_covenant_buff_aaaaa-aa_slot1",
      ),
      true,
    );
    assert.equal(
      shouldPreserveFeatSessionVersionGateKey(
        "pbv_shrine_count_aaaaa-aa_slot1",
      ),
      true,
    );
    assert.equal(
      shouldPreserveFeatSessionVersionGateKey(
        "aaaaa-aa_slot1_pbv_active_spells",
      ),
      false,
    );
    assert.equal(
      shouldPreserveFeatSessionVersionGateKey("pbv_panel_layout_aaaaa-aa"),
      false,
    );
    assert.equal(
      shouldPreserveFeatSessionVersionGateKey("aaaaa-aa_inventory"),
      false,
    );
  });
});
