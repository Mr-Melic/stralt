import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { SpellConfig } from "../types/gameTypes.ts";
import { spellbookCatalogRange } from "./spellbookAdvertisedRange.ts";
import {
  collectHighlightLiveMismatches,
  isTileCastableLive,
  shouldExecuteLiveCast,
  spellHighlightRangeBase,
  spellRangeBase,
} from "./targeting.ts";

function floorGrid(size: number): Array<Array<"floor" | "wall" | "portal">> {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "floor" as const),
  );
}

function strike(overrides: Partial<SpellConfig> = {}): SpellConfig {
  return {
    id: "physical_attack",
    name: "Strike",
    description: "",
    iconEmoji: "",
    apCost: 2n,
    mpCost: 0n,
    damage: 10n,
    range: 1n,
    effectType: "damage",
    targetType: "enemy",
    minRange: 1,
    ...overrides,
  } as SpellConfig;
}

describe("spellbook catalog range vs highlight / live", () => {
  it("uses spellHighlightRangeBase so maxRange matches the painted ring", () => {
    const grown = strike({ range: 2n, maxRange: 5 });
    assert.equal(spellbookCatalogRange(grown), spellHighlightRangeBase(grown));
    assert.equal(spellbookCatalogRange(grown), spellRangeBase(grown));
    assert.equal(spellbookCatalogRange(grown), 5);
    assert.notEqual(
      spellbookCatalogRange(grown),
      Number(grown.range),
      "raw range would advertise 2 while highlight paints 5",
    );
  });

  it("a catalog-range highlighted hostile is executable; farther is not", () => {
    const spell = strike({ range: 1n, maxRange: 3 });
    const caster = { x: 4, y: 4 };
    const tiles = floorGrid(9);
    const inRange = {
      id: "rat",
      x: 7,
      y: 4,
      hp: 20,
      maxHp: 20,
      name: "rat",
      pieceType: "pawn",
    };
    const out = {
      id: "far",
      x: 8,
      y: 4,
      hp: 20,
      maxHp: 20,
      name: "far",
      pieceType: "pawn",
    };
    const range = spellbookCatalogRange(spell);
    const mismatch = collectHighlightLiveMismatches(
      spell,
      caster,
      [inRange, out] as never,
      tiles,
      range,
    );
    assert.deepEqual(mismatch.highlightOnly, []);
    assert.deepEqual(mismatch.liveOnly, []);

    const legal = isTileCastableLive(
      spell,
      caster,
      { x: 7, y: 4 },
      [inRange, out] as never,
      tiles,
      range,
    );
    const illegal = isTileCastableLive(
      spell,
      caster,
      { x: 8, y: 4 },
      [inRange, out] as never,
      tiles,
      range,
    );
    assert.equal(shouldExecuteLiveCast(legal), true);
    assert.equal(shouldExecuteLiveCast(illegal), false);
  });
});
