import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  browserLeftoverKeysAfterDeleteCharacter,
  characterSlotProgressKey,
  covenantBuffStorageKey,
  deleteCharacterClearsBrowserSlotKeys,
} from "./slotBrowserLeftoverEvolve.ts";

describe("slotBrowserLeftoverEvolve", () => {
  it("lists the slot-scoped browser keys a new occupant inherits today", () => {
    assert.equal(deleteCharacterClearsBrowserSlotKeys(), false);
    const keys = browserLeftoverKeysAfterDeleteCharacter("aaaaa-aa", 2);
    assert.ok(
      keys.includes(
        characterSlotProgressKey("aaaaa-aa", 2, "pbv_maps_visited_count"),
      ),
    );
    assert.ok(
      keys.includes(
        characterSlotProgressKey("aaaaa-aa", 2, "pbv_ground_doka_pickups"),
      ),
    );
    assert.ok(keys.includes(covenantBuffStorageKey("aaaaa-aa", 2)));
    assert.ok(keys.includes("pbv_pending_death_penalty_slot2"));
    assert.equal(keys.includes("pbv_pending_death_penalty_slot1"), false);
  });
});
