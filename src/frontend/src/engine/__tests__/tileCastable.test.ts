import { describe, expect, it } from "vitest";
import {
  type TileType,
  computeTargetableTiles,
  isTileCastableLive,
} from "../targeting";
import { makeEnemy, makeSpell } from "./fixtures";

function floorGrid(size = 8): TileType[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "floor" as const),
  );
}

const caster = { x: 3, y: 3 };

describe("isTileCastableLive area expansion", () => {
  it("accepts a tile outside range when it sits in an in-range AoE footprint", () => {
    const map = floorGrid();
    const spell = makeSpell({
      targetType: "area",
      maxRange: 2,
      areaRadius: 1,
    });
    // (6,3) is Chebyshev 3 from the caster, but (5,3) is a legal range-2
    // anchor and the clicked tile is within areaRadius 1 of that anchor.
    const live = isTileCastableLive(spell, caster, { x: 6, y: 3 }, [], map);
    expect(live).toEqual({ ok: true, reason: "area_expansion" });

    const tiles = computeTargetableTiles(spell, caster, {
      tiles: map,
      enemies: [],
      worldGridSize: map.length,
      effectiveRange: 2,
      barrierTiles: new Map(),
    });
    expect(tiles.has("6,3")).toBe(true);
    expect(tiles.has("5,3")).toBe(true);
  });

  it("rejects a tile that no in-range anchor can cover", () => {
    const map = floorGrid();
    const spell = makeSpell({
      targetType: "area",
      maxRange: 2,
      areaRadius: 1,
    });
    const live = isTileCastableLive(spell, caster, { x: 7, y: 3 }, [], map);
    expect(live.ok).toBe(false);
    expect(live.reason).toBe("area_no_anchor");
  });

  it("rejects area spells that declare no radius when the tile is out of range", () => {
    const map = floorGrid();
    const spell = makeSpell({
      targetType: "area",
      maxRange: 2,
      areaRadius: 0,
    });
    expect(
      isTileCastableLive(spell, caster, { x: 6, y: 3 }, [], map).reason,
    ).toBe("area_no_radius");
  });
});

describe("isTileCastableLive linear / diagonal / freeCells", () => {
  it("rejects off-axis tiles for linear and diagonal enemy spells", () => {
    const map = floorGrid();
    expect(
      isTileCastableLive(
        makeSpell({ targetType: "enemy", maxRange: 3, linear: true }),
        caster,
        { x: 4, y: 4 },
        [],
        map,
      ).reason,
    ).toBe("linear_off_axis");
    expect(
      isTileCastableLive(
        makeSpell({ targetType: "enemy", maxRange: 3, diagonal: true }),
        caster,
        { x: 5, y: 3 },
        [],
        map,
      ).reason,
    ).toBe("diagonal_off_axis");
  });

  it("still allows an off-axis area click when a legal cardinal anchor covers it", () => {
    const map = floorGrid();
    const spell = makeSpell({
      targetType: "area",
      maxRange: 2,
      areaRadius: 1,
      linear: true,
    });
    // (6,4) is Chebyshev 3 from the caster (not a direct anchor) and off the
    // cardinal axes, but (5,3) is a legal linear range-2 anchor whose
    // radius-1 footprint covers (6,4).
    expect(isTileCastableLive(spell, caster, { x: 6, y: 4 }, [], map)).toEqual({
      ok: true,
      reason: "area_expansion",
    });
  });

  it("rejects occupied tiles for freeCells enemy spells but not for area anchors", () => {
    const map = floorGrid();
    const occupants = [makeEnemy({ id: "mob", x: 5, y: 3 })];
    expect(
      isTileCastableLive(
        makeSpell({ targetType: "enemy", maxRange: 3, freeCells: true }),
        caster,
        { x: 5, y: 3 },
        occupants,
        map,
      ).reason,
    ).toBe("free_cells_occupied");
    expect(
      isTileCastableLive(
        makeSpell({
          targetType: "area",
          maxRange: 3,
          areaRadius: 1,
          freeCells: true,
        }),
        caster,
        { x: 5, y: 3 },
        occupants,
        map,
      ).ok,
    ).toBe(true);
  });
});

describe("isTileCastableLive line and minRange", () => {
  it("rejects off-axis and wall-blocked line tiles", () => {
    const map = floorGrid();
    map[3][4] = "wall";
    const spell = makeSpell({ targetType: "line", maxRange: 3 });
    expect(
      isTileCastableLive(spell, caster, { x: 4, y: 5 }, [], map).reason,
    ).toBe("line_off_axis");
    expect(
      isTileCastableLive(spell, caster, { x: 5, y: 3 }, [], map).reason,
    ).toBe("line_blocked_wall");
    expect(
      isTileCastableLive(spell, { x: 3, y: 4 }, { x: 5, y: 4 }, [], map).ok,
    ).toBe(true);
  });

  it("rejects enemy tiles below minRange", () => {
    const map = floorGrid();
    const spell = makeSpell({ targetType: "enemy", maxRange: 3, minRange: 2 });
    expect(
      isTileCastableLive(spell, caster, { x: 4, y: 3 }, [], map).reason,
    ).toBe("no_matching_branch");
    expect(isTileCastableLive(spell, caster, { x: 5, y: 3 }, [], map).ok).toBe(
      true,
    );
  });
});

describe("computeTargetableTiles linear / diagonal / freeCells", () => {
  it("restricts linear and diagonal enemy highlights and skips occupied freeCells", () => {
    const map = floorGrid();
    const linear = computeTargetableTiles(
      makeSpell({ targetType: "enemy", linear: true }),
      caster,
      {
        tiles: map,
        enemies: [],
        worldGridSize: map.length,
        effectiveRange: 2,
        barrierTiles: new Map(),
      },
    );
    expect(linear.has("5,3")).toBe(true);
    expect(linear.has("4,4")).toBe(false);

    const diagonal = computeTargetableTiles(
      makeSpell({ targetType: "enemy", diagonal: true }),
      caster,
      {
        tiles: map,
        enemies: [],
        worldGridSize: map.length,
        effectiveRange: 2,
        barrierTiles: new Map(),
      },
    );
    expect(diagonal.has("4,4")).toBe(true);
    expect(diagonal.has("5,3")).toBe(false);

    const free = computeTargetableTiles(
      makeSpell({ targetType: "enemy", freeCells: true }),
      caster,
      {
        tiles: map,
        enemies: [makeEnemy({ id: "mob", x: 5, y: 3 })],
        worldGridSize: map.length,
        effectiveRange: 2,
        barrierTiles: new Map(),
      },
    );
    expect(free.has("5,3")).toBe(false);
    expect(free.has("5,4")).toBe(true);
  });
});
