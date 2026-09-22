import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import { getAoETargets } from "./castHelpers.ts";
import {
  bounceHopDistance,
  chainBounceVictimAllowed,
  pickChainBounceTargets,
} from "./chainBounce.ts";
import {
  chebyshevOnBoard,
  collectHighlightLiveMismatches,
  isTileCastableLive,
  shouldExecuteLiveCast,
  spellHighlightRangeBase,
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
    level: 3,
    hp: 40,
    maxHp: 40,
    res: 0,
    sp: 0,
    chc: 0,
    init: 8,
    pieceType: "pawn",
    currentView: "front",
    isMoving: false,
    movementPath: [],
    scaleX: 1,
    scaleY: 1,
    nextMoveTime: 0,
    family: "plague_rat",
    ...extras,
  };
}

const chain = {
  id: "starter-blast",
  name: "Chain Lightning",
  hitsMultiple: true,
  bounces: 2,
  maxRange: 4,
  range: 4n,
  targetType: "enemy" as const,
  minRange: 1,
  apCost: 4n,
  mpCost: 0n,
  damage: 20n,
  effectType: "damage",
  description: "",
  iconEmoji: "",
} as SpellConfig;

describe("chain bounce hops vs highlight / live", () => {
  it("keeps Manhattan hops (diagonal 1,1 is not closer than cardinal 2,0)", () => {
    const primary = { x: 4, y: 4 };
    assert.equal(bounceHopDistance(primary, { x: 5, y: 5 }), 2);
    assert.equal(bounceHopDistance(primary, { x: 6, y: 4 }), 2);
    assert.equal(chebyshevOnBoard(primary, { x: 5, y: 5 }), 1);
    assert.equal(chebyshevOnBoard(primary, { x: 6, y: 4 }), 2);
  });

  it("a highlighted legal primary is executable; bounce/AoE cannot hit a corpse", () => {
    const caster = { x: 2, y: 4 };
    const tiles = floorGrid(9);
    const liveRat = unit("rat", 4, 4, { side: "enemy" });
    const corpse = unit("dead", 5, 4, { side: "enemy", hp: 0 });
    const range = spellHighlightRangeBase(chain);
    const mismatch = collectHighlightLiveMismatches(
      chain,
      caster,
      [liveRat, corpse],
      tiles,
      range,
    );
    assert.deepEqual(mismatch.highlightOnly, []);
    assert.deepEqual(mismatch.liveOnly, []);

    const legal = isTileCastableLive(
      chain,
      caster,
      { x: 4, y: 4 },
      [liveRat, corpse],
      tiles,
      range,
    );
    assert.equal(shouldExecuteLiveCast(legal), true);

    const splash = getAoETargets({
      spell: chain,
      gridPos: { x: 4, y: 4 },
      targetEnemy: liveRat,
      enemies: [liveRat, corpse],
      playerPosition: caster,
      characterName: "Hero",
      characterStats: {
        level: 1,
        res: 0,
        sp: 0,
        chc: 0,
        hp: 50,
        maxHp: 50,
      },
      getEffectiveSpellRange: (base) => base,
      logBattleEntry: () => {},
    });
    assert.deepEqual(
      splash.map((t) => t.id),
      ["rat"],
      "hitsMultiple execute must drop the corpse",
    );
    assert.deepEqual(
      pickChainBounceTargets(liveRat, [liveRat, corpse], 2).map((h) => h.id),
      [],
      "bounce hops from a legal primary cannot execute on a corpse",
    );
  });

  it("bounce hops skip corpses and player summons; nearest living hostile proceeds", () => {
    const primary = unit("rat", 4, 4, { side: "enemy" });
    const near = unit("near", 5, 4, { side: "enemy" });
    const far = unit("far", 8, 4, { side: "enemy" });
    const corpse = unit("dead", 4, 5, { side: "enemy", hp: 0 });
    const wolf = unit("wolf", 4, 3, { isSummon: true, side: "player" });
    assert.equal(chainBounceVictimAllowed(corpse, "rat"), false);
    assert.equal(chainBounceVictimAllowed(wolf, "rat"), false);
    assert.equal(chainBounceVictimAllowed(near, "rat"), true);

    const hops = pickChainBounceTargets(
      primary,
      [near, far, corpse, wolf, primary],
      2,
    );
    assert.deepEqual(
      hops.map((h) => h.id),
      ["near", "far"],
    );
    assert.equal(
      pickChainBounceTargets(primary, [near], 0).length,
      0,
      "no configured bounces → no hop",
    );
  });
});
