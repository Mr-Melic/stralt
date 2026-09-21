import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import {
  canAttackNearestAgainstLive,
  collectHighlightLiveMismatches,
  computeTargetableTiles,
  decideSpriteCastClick,
  decideTileCastClick,
  findAttackNearestTarget,
  livingOccupantAt,
  playerCastStatusRejects,
  probeLiveCast,
  shouldExecuteLiveCast,
  spellHighlightRangeBase,
  spellbookRangeCaption,
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

function baseSpell(overrides: Partial<SpellConfig> = {}): SpellConfig {
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
): void {
  const { highlightOnly, liveOnly } = collectHighlightLiveMismatches(
    spell,
    caster,
    enemies,
    tiles,
    range,
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

describe("living occupancy vs corpses", () => {
  it("lets ground highlight and execute on a corpse the walk path already treats as free", () => {
    const tiles = floorGrid(9);
    const caster = { x: 4, y: 4 };
    const corpse = unit("dead", 5, 4, { side: "enemy", hp: 0 });
    const living = unit("rat", 4, 6, { side: "enemy", hp: 12 });
    const spell = baseSpell({
      targetType: "ground",
      isBarrier: true,
      freeCells: true,
      maxRange: 2,
      range: 2n,
    });
    assert.equal(livingOccupantAt([corpse, living], { x: 5, y: 4 }), false);
    assert.equal(livingOccupantAt([corpse, living], { x: 4, y: 6 }), true);
    assertParity(spell, caster, tiles, [corpse, living], 2);
    const highlighted = computeTargetableTiles(spell, caster, {
      tiles,
      enemies: [corpse, living],
      worldGridSize: 9,
      effectiveRange: 2,
      barrierTiles: new Map(),
    });
    assert.equal(highlighted.has("5,4"), true, "corpse must not block ground");
    assert.equal(highlighted.has("4,6"), false, "living occupant still blocks");
    assert.equal(
      shouldExecuteLiveCast(
        probeLiveCast(
          spell,
          caster,
          { x: 5, y: 4 },
          [corpse, living],
          tiles,
          2,
        ),
      ),
      true,
    );
    assert.equal(
      shouldExecuteLiveCast(
        probeLiveCast(
          spell,
          caster,
          { x: 4, y: 6 },
          [corpse, living],
          tiles,
          2,
        ),
      ),
      false,
    );
  });
});

describe("timestep spent status vs highlight/execute", () => {
  const tiles = floorGrid(7);
  const caster = { x: 3, y: 3 };
  const timestep = baseSpell({
    id: "spell-timestep",
    targetType: "self",
    effectType: "buff",
    apCost: 0n,
    maxRange: 0,
    range: 0n,
    minRange: 0,
    isTimestep: true,
  });

  it("paints and executes Timestep only before it is spent", () => {
    assert.equal(playerCastStatusRejects(timestep, {}), null);
    assert.equal(
      playerCastStatusRejects(timestep, { timestepUsed: true }),
      "timestep_spent",
    );
    const openGrid = {
      tiles,
      enemies: [] as Enemy[],
      worldGridSize: 7,
      effectiveRange: 0,
      barrierTiles: new Map<string, number>(),
    };
    assert.deepEqual(
      collectHighlightLiveMismatches(timestep, caster, openGrid),
      { highlightOnly: [], liveOnly: [] },
    );
    assert.equal(
      computeTargetableTiles(timestep, caster, openGrid).has("3,3"),
      true,
    );
    const spentGrid = { ...openGrid, castStatus: { timestepUsed: true } };
    assert.deepEqual(
      collectHighlightLiveMismatches(timestep, caster, spentGrid),
      { highlightOnly: [], liveOnly: [] },
    );
    assert.equal(
      computeTargetableTiles(timestep, caster, spentGrid).has("3,3"),
      false,
    );
    const legal = probeLiveCast(
      timestep,
      caster,
      caster,
      [],
      tiles,
      0,
      new Map(),
    );
    const spent = probeLiveCast(
      timestep,
      caster,
      caster,
      [],
      tiles,
      0,
      new Map(),
      { timestepUsed: true },
    );
    assert.equal(shouldExecuteLiveCast(legal), true);
    assert.equal(shouldExecuteLiveCast(spent), false);
    assert.equal(spent.reason, "timestep_spent");
    assert.deepEqual(
      decideTileCastClick({
        live: legal,
        tileHighlighted: true,
        occupantIsLiveHostile: false,
      }),
      { action: "execute", bypassHighlight: false },
    );
    assert.deepEqual(
      decideTileCastClick({
        live: spent,
        tileHighlighted: false,
        occupantIsLiveHostile: false,
      }),
      { action: "reject", reason: "out_of_range" },
    );
    assert.deepEqual(
      decideSpriteCastClick({
        selectedSpellId: "spell-timestep",
        hasSelectedSpell: true,
        hitKind: "player",
        playerCastOk: true,
        inBattle: true,
        liveOk: shouldExecuteLiveCast(spent),
        selfOrAllySpell: true,
        hasBasicAttack: false,
      }),
      { action: "reject_live" },
    );
    assert.deepEqual(
      findAttackNearestTarget(timestep, caster, [], tiles, 0),
      caster,
    );
    assert.equal(
      findAttackNearestTarget(timestep, caster, [], tiles, 0, new Map(), {
        timestepUsed: true,
      }),
      null,
    );
    assert.equal(
      canAttackNearestAgainstLive(timestep, caster, [], tiles, 0, new Map(), {
        timestepUsed: true,
      }),
      false,
    );
  });
});

describe("spellbook caption vs highlight range", () => {
  it("uses maxRange the preview grid paints, not raw range", () => {
    const grown = baseSpell({
      range: 2n,
      maxRange: 5,
      targetType: "enemy",
    });
    assert.equal(spellHighlightRangeBase(grown), 5);
    assert.equal(spellbookRangeCaption(grown), "Range — 5 tiles");
    assert.equal(
      spellbookRangeCaption(baseSpell({ targetType: "self" })),
      "Self target",
    );
    assert.equal(
      spellbookRangeCaption(
        baseSpell({
          targetType: "area",
          areaRadius: 2,
          maxRange: 1,
          range: 1n,
        }),
      ),
      "Area — radius 2",
    );
  });
});
