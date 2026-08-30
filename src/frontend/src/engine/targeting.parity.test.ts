import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import {
  collectHighlightLiveMismatches,
  computeTargetableTiles,
  findAttackNearestTarget,
  isTileCastableLive,
  shouldExecuteLiveCast,
  spellRangeBase,
} from "./targeting.ts";

function floorGrid(size: number): Array<Array<"floor" | "wall" | "portal">> {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "floor" as const),
  );
}

function unit(
  id: string,
  x: number,
  y: number,
  extras: Partial<Enemy> = {},
): Enemy {
  return {
    id,
    x,
    y,
    hp: 20,
    maxHp: 20,
    name: id,
    pieceType: "pawn",
    ...extras,
  } as Enemy;
}

function baseSpell(overrides: Partial<SpellConfig>): SpellConfig {
  return {
    id: "test-spell",
    name: "Test",
    description: "",
    iconEmoji: "",
    apCost: 2n,
    mpCost: 0n,
    damage: 8n,
    range: 3n,
    effectType: "damage",
    targetType: "enemy",
    maxRange: 3,
    minRange: 1,
    ...overrides,
  } as SpellConfig;
}

function assertParity(
  spell: SpellConfig,
  caster: { x: number; y: number },
  tiles: Array<Array<"floor" | "wall" | "portal">>,
  enemies: Enemy[],
  range: number,
  barriers: Map<string, number> = new Map(),
): void {
  const { highlightOnly, liveOnly } = collectHighlightLiveMismatches(
    spell,
    caster,
    enemies,
    tiles,
    range,
    barriers,
  );
  assert.deepEqual(
    highlightOnly,
    [],
    `highlighted but not executable: ${highlightOnly.join(" ")}`,
  );
  assert.deepEqual(
    liveOnly,
    [],
    `executable but not highlighted: ${liveOnly.join(" ")}`,
  );
}

describe("spellRangeBase", () => {
  it("prefers maxRange over range so Attack Nearest matches the highlight", () => {
    const spell = baseSpell({ range: 2n, maxRange: 5 });
    assert.equal(spellRangeBase(spell), 5);
    assert.equal(
      spellRangeBase(baseSpell({ range: 4n, maxRange: undefined })),
      4,
    );
  });
});

describe("highlight vs live parity", () => {
  const caster = { x: 5, y: 5 };

  it("keeps enemy / self / ally / ground / area / line / chain / all in lockstep", () => {
    const tiles = floorGrid(11);
    const wolf = unit("wolf", 7, 5, { isSummon: true, side: "player" });
    const rat = unit("rat", 8, 5, { side: "enemy" });
    const deadAlly = unit("corpse", 6, 6, {
      isSummon: true,
      side: "player",
      hp: 0,
    });
    const enemies = [wolf, rat, deadAlly];

    assertParity(baseSpell({ targetType: "enemy" }), caster, tiles, enemies, 3);
    assertParity(baseSpell({ targetType: "self" }), caster, tiles, enemies, 3);
    assertParity(baseSpell({ targetType: "ally" }), caster, tiles, enemies, 3);
    assertParity(
      baseSpell({ targetType: "ground" }),
      caster,
      tiles,
      enemies,
      3,
    );
    assertParity(
      baseSpell({ targetType: "area", areaRadius: 1 }),
      caster,
      tiles,
      enemies,
      3,
    );
    assertParity(baseSpell({ targetType: "line" }), caster, tiles, enemies, 3);
    assertParity(baseSpell({ targetType: "chain" }), caster, tiles, enemies, 3);
    assertParity(baseSpell({ targetType: "all" }), caster, tiles, enemies, 3);
  });

  it("rejects a dead ally on both the highlight and the live gate", () => {
    const tiles = floorGrid(11);
    const dead = unit("dead-wolf", 7, 5, {
      isSummon: true,
      side: "player",
      hp: 0,
    });
    const spell = baseSpell({ targetType: "ally", maxRange: 4 });
    const highlighted = computeTargetableTiles(spell, caster, {
      tiles,
      enemies: [dead],
      worldGridSize: 11,
      effectiveRange: 4,
      barrierTiles: new Map(),
    });
    assert.equal(highlighted.has("7,5"), false);
    const live = isTileCastableLive(
      spell,
      caster,
      { x: 7, y: 5 },
      [dead],
      tiles,
      4,
    );
    assert.equal(shouldExecuteLiveCast(live), false);
  });

  it("does not highlight or execute a line tile inside minRange", () => {
    const tiles = floorGrid(11);
    const spell = baseSpell({ targetType: "line", minRange: 2, maxRange: 4 });
    const highlighted = computeTargetableTiles(spell, caster, {
      tiles,
      enemies: [],
      worldGridSize: 11,
      effectiveRange: 4,
      barrierTiles: new Map(),
    });
    assert.equal(highlighted.has("6,5"), false);
    assert.equal(highlighted.has("7,5"), true);
    const near = isTileCastableLive(
      spell,
      caster,
      { x: 6, y: 5 },
      [],
      tiles,
      4,
    );
    const far = isTileCastableLive(spell, caster, { x: 7, y: 5 }, [], tiles, 4);
    assert.equal(shouldExecuteLiveCast(near), false);
    assert.equal(shouldExecuteLiveCast(far), true);
  });

  it("blocks LoS on both preview and execution when a barrier sits between", () => {
    const tiles = floorGrid(11);
    const barriers = new Map<string, number>([["6,5", 2]]);
    const rat = unit("rat", 8, 5, { side: "enemy" });
    const spell = baseSpell({
      targetType: "enemy",
      lineOfSight: true,
      maxRange: 4,
    });
    assertParity(spell, caster, tiles, [rat], 4, barriers);
    const highlighted = computeTargetableTiles(spell, caster, {
      tiles,
      enemies: [rat],
      worldGridSize: 11,
      effectiveRange: 4,
      barrierTiles: barriers,
    });
    assert.equal(highlighted.has("8,5"), false);
    const live = isTileCastableLive(
      spell,
      caster,
      { x: 8, y: 5 },
      [rat],
      tiles,
      4,
      barriers,
    );
    assert.equal(shouldExecuteLiveCast(live), false);
    assert.equal(live.reason, "los_blocked");
  });

  it("keeps area+freeCells occupied tiles off the anchor set on both sides", () => {
    const tiles = floorGrid(9);
    const origin = { x: 4, y: 4 };
    const blocked = unit("block", 6, 4, { side: "enemy" });
    tiles[3][5] = "wall";
    tiles[3][6] = "wall";
    tiles[3][7] = "wall";
    tiles[4][5] = "wall";
    tiles[4][7] = "wall";
    tiles[5][5] = "wall";
    tiles[5][6] = "wall";
    tiles[5][7] = "wall";
    const spell = baseSpell({
      targetType: "area",
      areaRadius: 1,
      freeCells: true,
      maxRange: 3,
    });
    assertParity(spell, origin, tiles, [blocked], 3);
    const live = isTileCastableLive(
      spell,
      origin,
      { x: 6, y: 4 },
      [blocked],
      tiles,
      3,
    );
    assert.equal(shouldExecuteLiveCast(live), false);
  });
});

describe("findAttackNearestTarget", () => {
  it("picks a highlighted legal hostile and refuses a LoS-blocked nearer one", () => {
    const tiles = floorGrid(11);
    const caster = { x: 5, y: 5 };
    const blocked = unit("blocked", 7, 5, { side: "enemy" });
    const open = unit("open", 5, 8, { side: "enemy" });
    const barriers = new Map<string, number>([["6,5", 2]]);
    const spell = baseSpell({
      targetType: "enemy",
      lineOfSight: true,
      maxRange: 4,
    });
    const picked = findAttackNearestTarget(
      spell,
      caster,
      [blocked, open],
      tiles,
      4,
      barriers,
    );
    assert.deepEqual(picked, { x: 5, y: 8 });
    const live = isTileCastableLive(
      spell,
      caster,
      picked!,
      [blocked, open],
      tiles,
      4,
      barriers,
    );
    assert.equal(shouldExecuteLiveCast(live), true);
    const illegal = isTileCastableLive(
      spell,
      caster,
      { x: 7, y: 5 },
      [blocked, open],
      tiles,
      4,
      barriers,
    );
    assert.equal(shouldExecuteLiveCast(illegal), false);
  });

  it("returns the caster tile for self spells and null when nothing is legal", () => {
    const tiles = floorGrid(7);
    const caster = { x: 3, y: 3 };
    const heal = baseSpell({
      targetType: "self",
      effectType: "heal",
      maxRange: 1,
    });
    assert.deepEqual(
      findAttackNearestTarget(heal, caster, [], tiles, 1),
      caster,
    );
    const losSpell = baseSpell({
      targetType: "enemy",
      lineOfSight: true,
      maxRange: 2,
    });
    const behindWall = unit("hid", 3, 6, { side: "enemy" });
    tiles[4][3] = "wall";
    tiles[5][3] = "wall";
    assert.equal(
      findAttackNearestTarget(losSpell, caster, [behindWall], tiles, 2),
      null,
    );
  });
});
