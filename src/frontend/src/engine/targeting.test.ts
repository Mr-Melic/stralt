import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import {
  canAttackNearestLive,
  computeTargetableTiles,
  isTileCastableLive,
  pickNearestLiveHostileTile,
  shouldExecuteLiveCast,
  spellHighlightRangeBase,
} from "./targeting.ts";

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

function strikeSpell(): SpellConfig {
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
    isPhysical: true,
    maxRange: 1,
    minRange: 1,
  } as SpellConfig;
}

describe("sprite-basic live gate", () => {
  it("rejects Strike beyond Chebyshev 1 so executeCastAttempt cannot snipe", () => {
    const tiles = floorGrid(20);
    const caster = { x: 10, y: 10 };
    const adjacent = { x: 11, y: 10 };
    const distant = { x: 14, y: 10 };
    const enemies: Enemy[] = [
      {
        id: "rat-adj",
        x: 11,
        y: 10,
        hp: 20,
        maxHp: 20,
        name: "Rat",
        pieceType: "pawn",
      } as Enemy,
      {
        id: "rat-far",
        x: 14,
        y: 10,
        hp: 20,
        maxHp: 20,
        name: "Rat",
        pieceType: "pawn",
      } as Enemy,
    ];
    const spell = strikeSpell();
    const near = isTileCastableLive(spell, caster, adjacent, enemies, tiles, 1);
    const far = isTileCastableLive(spell, caster, distant, enemies, tiles, 1);
    assert.equal(shouldExecuteLiveCast(near), true);
    assert.equal(shouldExecuteLiveCast(far), false);
    assert.equal(far.ok, false, "Chebyshev 4 must fail melee range 1");
  });
});

describe("Attack Nearest live gate", () => {
  it("uses maxRange as the highlight base so grown rings stay searchable", () => {
    const spell = enemySpell(3);
    spell.maxRange = 5;
    assert.equal(spellHighlightRangeBase(spell), 5);
    assert.equal(spellHighlightRangeBase({ ...spell, maxRange: undefined }), 3);
  });

  it("skips a nearer LoS-blocked hostile so Attack Nearest cannot snipe", () => {
    const tiles = floorGrid(20);
    tiles[10][11] = "wall";
    const caster = { x: 10, y: 10 };
    const blocked = {
      id: "blocked",
      x: 12,
      y: 10,
      hp: 20,
      maxHp: 20,
      name: "Wraith",
      pieceType: "bishop",
    } as Enemy;
    const open = {
      id: "open",
      x: 10,
      y: 13,
      hp: 20,
      maxHp: 20,
      name: "Rat",
      pieceType: "pawn",
    } as Enemy;
    const spell = {
      ...enemySpell(5),
      lineOfSight: true,
    };
    const highlighted = computeTargetableTiles(spell, caster, {
      tiles,
      enemies: [blocked, open],
      worldGridSize: 20,
      effectiveRange: 5,
      barrierTiles: new Map(),
    });
    assert.equal(highlighted.has("12,10"), false);
    assert.equal(highlighted.has("10,13"), true);

    const hostiles = [blocked, open];
    const picked = pickNearestLiveHostileTile(
      spell,
      caster,
      hostiles,
      hostiles,
      tiles,
      5,
    );
    assert.deepEqual(picked, { x: 10, y: 13 });
    assert.equal(
      canAttackNearestLive(spell, caster, hostiles, hostiles, tiles, 5),
      true,
    );
  });
});
