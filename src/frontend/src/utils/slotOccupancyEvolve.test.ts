import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  bossRushKey,
  buffInventoryKey,
  dungeonRecordKey,
  hydrateBuffStacksIntoSlot,
  leftoversAfterDeleteCharacter,
} from "./slotOccupancyEvolve.ts";

describe("deleteCharacter occupancy leftovers", () => {
  it("clears Boss Rush for the slot but keeps dungeon and canister buff stacks", () => {
    assert.deepEqual(leftoversAfterDeleteCharacter(), {
      dungeonRecord: true,
      buffInventory: true,
      bossRush: false,
    });
    assert.equal(dungeonRecordKey("aaaaa-aa", 1), "principal");
    assert.equal(dungeonRecordKey("aaaaa-aa", 2), "principal");
    assert.equal(bossRushKey("aaaaa-aa", 2), "aaaaa-aa#2");
    assert.equal(buffInventoryKey("aaaaa-aa", 1), "aaaaa-aa#1");
  });

  it("hydrates principal-scoped BuffShop stacks into an empty slot without summing", () => {
    assert.equal(
      hydrateBuffStacksIntoSlot({ slotExisting: 0, principalExisting: 3 }),
      3,
    );
    assert.equal(
      hydrateBuffStacksIntoSlot({ slotExisting: 2, principalExisting: 5 }),
      2,
    );
  });
});
