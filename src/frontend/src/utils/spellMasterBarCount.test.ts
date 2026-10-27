import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SPELL_MASTER_8_CONDITION,
  SPELL_MASTER_8_THRESHOLD,
  emptyBarPlaceholderLengthIsNotEquipped,
  equippedSpellBarCount,
  resolveHydratedSpellBarIds,
  shouldAppendCatalogToEmptyBarSlots,
  shouldUnlockSpellMaster8,
} from "./spellMasterBarCount.ts";

const library = [
  "physical_attack",
  "starter-shield",
  "starter-heal",
  "shadow_strike",
  "soul_rend",
  "vampire_bite",
  "reflect_barrier",
  "thunder_clap",
  "void_collapse",
];

describe("spellMasterBarCount", () => {
  it("does not treat eight null placeholders as eight equipped spells", () => {
    assert.equal(SPELL_MASTER_8_CONDITION, "spell_master_8");
    assert.equal(SPELL_MASTER_8_THRESHOLD, 8);
    assert.equal(
      Array(8).fill(null).length,
      8,
      "HEAD empty-bar fallback length",
    );
    assert.equal(emptyBarPlaceholderLengthIsNotEquipped(), true);
    assert.equal(equippedSpellBarCount(Array(8).fill(null)), 0);
    assert.equal(shouldUnlockSpellMaster8(0), false);
  });

  it("counts only entries with a non-empty id", () => {
    assert.equal(
      equippedSpellBarCount([
        "physical_attack",
        { id: "starter-shield" },
        { id: "" },
        null,
        undefined,
        "  ",
      ]),
      2,
    );
    assert.equal(shouldUnlockSpellMaster8(7), false);
    assert.equal(shouldUnlockSpellMaster8(8), true);
  });

  it("keeps a short persisted bar and does not pad with live catalog ids", () => {
    assert.equal(shouldAppendCatalogToEmptyBarSlots(), false);
    assert.deepEqual(
      resolveHydratedSpellBarIds({
        savedOrder: ["physical_attack", "starter-shield", "retired_gone"],
        libraryIds: library,
      }),
      ["physical_attack", "starter-shield"],
    );
    assert.equal(
      shouldUnlockSpellMaster8(
        equippedSpellBarCount(
          resolveHydratedSpellBarIds({
            savedOrder: ["physical_attack", "starter-shield"],
            libraryIds: library,
          }),
        ),
      ),
      false,
    );
  });

  it("empty persisted bar stays empty — catalog growth is not a learn event", () => {
    assert.deepEqual(
      resolveHydratedSpellBarIds({
        savedOrder: null,
        libraryIds: library,
      }),
      [],
    );
    assert.deepEqual(
      resolveHydratedSpellBarIds({
        savedOrder: [],
        libraryIds: library,
      }),
      [],
    );
    assert.equal(
      shouldUnlockSpellMaster8(
        equippedSpellBarCount(
          resolveHydratedSpellBarIds({
            savedOrder: null,
            libraryIds: library,
          }),
        ),
      ),
      false,
    );
  });
});
