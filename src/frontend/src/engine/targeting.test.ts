import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import { computeTargetableTiles, isTileCastableLive } from "./targeting.ts";

function floorGrid(size: number): Array<Array<"floor" | "wall" | "portal">> {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "floor" as const),
  );
}

function enemySpell(range: number): SpellConfig {
  return {
    id: "starter-poison",
    name: "Poison",
    description: "",
    iconEmoji: "",
    apCost: 2n,
    mpCost: 0n,
    damage: 8n,
    range: BigInt(range),
    effectType: "damage",
    targetType: "enemy",
    maxRange: range,
    minRange: 1,
  } as SpellConfig;
}

describe("isTileCastableLive effective range", () => {
  it("accepts the highlight ring when the level-grown range is passed through", () => {
    const tiles = floorGrid(20);
    const caster = { x: 10, y: 10 };
    const tile = { x: 15, y: 10 };
    const enemies: Enemy[] = [
      {
        id: "rat-1",
        x: 15,
        y: 10,
        hp: 20,
        maxHp: 20,
        name: "Rat",
        pieceType: "pawn",
      } as Enemy,
    ];
    const spell = enemySpell(4);
    const highlighted = computeTargetableTiles(spell, caster, {
      tiles,
      enemies,
      worldGridSize: 20,
      effectiveRange: 5,
      barrierTiles: new Map(),
    });
    assert.equal(highlighted.has("15,10"), true);

    const raw = isTileCastableLive(spell, caster, tile, enemies, tiles);
    assert.equal(raw.ok, false, "base maxRange 4 must reject Chebyshev 5");

    const live = isTileCastableLive(spell, caster, tile, enemies, tiles, 5);
    assert.equal(live.ok, true, "effectiveRange 5 must match the highlight");
  });
});
