import { describe, expect, it } from "vitest";
import type { TileType } from "../targeting";
import {
  applyHealBuffSideEffect,
  computeTargetableTiles,
  isTileCastableLive,
} from "../targeting";
import { makeEnemy, makeSpell } from "./fixtures";

function floorGrid(size = 8): TileType[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "floor" as const),
  );
}

function gridState(
  overrides: {
    tiles?: TileType[][];
    enemies?: ReturnType<typeof makeEnemy>[];
    effectiveRange?: number;
    barrierTiles?: Map<string, number>;
  } = {},
) {
  const tiles = overrides.tiles ?? floorGrid();
  return {
    tiles,
    enemies: overrides.enemies ?? [],
    worldGridSize: tiles.length,
    effectiveRange: overrides.effectiveRange ?? 2,
    barrierTiles: overrides.barrierTiles ?? new Map<string, number>(),
  };
}

describe("computeTargetableTiles", () => {
  it("highlights only the caster tile for self spells", () => {
    const tiles = computeTargetableTiles(
      makeSpell({ targetType: "self" }),
      { x: 2, y: 2 },
      gridState(),
    );
    expect([...tiles]).toEqual(["2,2"]);
  });

  it("includes the caster and in-range player summons for ally spells", () => {
    const tiles = computeTargetableTiles(
      makeSpell({ targetType: "ally" }),
      { x: 1, y: 1 },
      gridState({
        effectiveRange: 2,
        enemies: [
          makeEnemy({ id: "ally", x: 2, y: 2, isSummon: true, side: "player" }),
          makeEnemy({ id: "foe", x: 3, y: 1, isSummon: true, side: "enemy" }),
        ],
      }),
    );
    expect(tiles.has("1,1")).toBe(true);
    expect(tiles.has("2,2")).toBe(true);
    expect(tiles.has("3,1")).toBe(false);
  });

  it("uses Manhattan range for ground spells and Chebyshev for enemy spells", () => {
    const caster = { x: 3, y: 3 };
    const ground = computeTargetableTiles(
      makeSpell({ targetType: "ground" }),
      caster,
      gridState({ effectiveRange: 2 }),
    );
    expect(ground.has("5,3")).toBe(true);
    expect(ground.has("5,5")).toBe(false);
    expect(ground.has("3,3")).toBe(false);

    const enemy = computeTargetableTiles(
      makeSpell({ targetType: "enemy" }),
      caster,
      gridState({ effectiveRange: 2 }),
    );
    expect(enemy.has("5,5")).toBe(true);
    expect(enemy.has("6,3")).toBe(false);
    expect(enemy.has("3,3")).toBe(false);
  });

  it("blocks line-of-sight when a wall sits between caster and target", () => {
    const tiles = floorGrid();
    tiles[3][4] = "wall";
    const withLos = computeTargetableTiles(
      makeSpell({ targetType: "enemy", lineOfSight: true }),
      { x: 3, y: 3 },
      gridState({ tiles, effectiveRange: 3 }),
    );
    expect(withLos.has("5,3")).toBe(false);
    const noLos = computeTargetableTiles(
      makeSpell({ targetType: "enemy", lineOfSight: false }),
      { x: 3, y: 3 },
      gridState({ tiles, effectiveRange: 3 }),
    );
    expect(noLos.has("5,3")).toBe(true);
  });
});

describe("isTileCastableLive", () => {
  it("agrees with computeTargetableTiles on self / ground / enemy rules", () => {
    const map = floorGrid();
    const caster = { x: 2, y: 2 };
    const self = makeSpell({ targetType: "self", maxRange: 3 });
    expect(isTileCastableLive(self, caster, { x: 2, y: 2 }, [], map).ok).toBe(
      true,
    );
    expect(
      isTileCastableLive(self, caster, { x: 3, y: 2 }, [], map).reason,
    ).toBe("self_other_tile");

    const ground = makeSpell({ targetType: "ground", maxRange: 2 });
    expect(isTileCastableLive(ground, caster, { x: 4, y: 2 }, [], map).ok).toBe(
      true,
    );
    expect(isTileCastableLive(ground, caster, { x: 4, y: 4 }, [], map).ok).toBe(
      false,
    );

    const enemy = makeSpell({ targetType: "enemy", maxRange: 2 });
    expect(isTileCastableLive(enemy, caster, { x: 4, y: 4 }, [], map).ok).toBe(
      true,
    );
    expect(isTileCastableLive(enemy, caster, { x: 5, y: 2 }, [], map).ok).toBe(
      false,
    );
  });

  it("rejects walls and out-of-bounds tiles", () => {
    const map = floorGrid();
    map[1][1] = "wall";
    const spell = makeSpell({ targetType: "enemy", maxRange: 3 });
    expect(
      isTileCastableLive(spell, { x: 0, y: 0 }, { x: 1, y: 1 }, [], map).reason,
    ).toBe("wall_tile");
    expect(
      isTileCastableLive(spell, { x: 0, y: 0 }, { x: -1, y: 0 }, [], map)
        .reason,
    ).toBe("out_of_bounds");
  });
});

describe("applyHealBuffSideEffect", () => {
  it("clears the pacifist flag only for offensive metadata", () => {
    const ref = { current: true };
    applyHealBuffSideEffect(makeSpell({ targetType: "self" }), ref);
    expect(ref.current).toBe(true);
    applyHealBuffSideEffect(
      makeSpell({ targetType: "enemy", effectCategory: "damage" }),
      ref,
    );
    expect(ref.current).toBe(false);
  });
});
