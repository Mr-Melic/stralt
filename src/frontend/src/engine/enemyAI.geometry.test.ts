import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import { type DecideEnemyContext, decideEnemyAction } from "./enemyAI.ts";
import { enemyCastGeometryOk, hasBresenhamLoS } from "./targeting.ts";

function frost(lineOfSight?: boolean): SpellConfig {
  return {
    id: "starter-frost",
    name: "Frost",
    description: "",
    iconEmoji: "",
    apCost: 2n,
    mpCost: 0n,
    damage: 8n,
    range: 4n,
    effectType: "damage",
    spellType: "damage",
    targetType: "enemy",
    ...(lineOfSight === undefined ? {} : { lineOfSight }),
  };
}

function casterPawn(x: number, y: number): Enemy {
  return {
    id: "bishop",
    x,
    y,
    level: 3,
    hp: 30,
    maxHp: 30,
    res: 0,
    sp: 0,
    chc: 0,
    init: 6,
    pieceType: "bishop",
    currentView: "front",
    isMoving: false,
    movementPath: [],
    scaleX: 1,
    scaleY: 1,
    nextMoveTime: 0,
    family: "plague_rat",
    side: "enemy",
  };
}

function ctx(
  enemy: Enemy,
  player: { x: number; y: number },
  spell: SpellConfig,
  tiles: Array<Array<"floor" | "wall" | "portal">>,
): DecideEnemyContext {
  const passable = tiles.map((row) => row.map((t) => t !== "wall"));
  return {
    enemy,
    combatants: [
      {
        id: "player",
        side: "player",
        name: "hero",
        x: player.x,
        y: player.y,
        hp: 40,
        maxHp: 40,
        level: 3,
      },
    ],
    grid: passable,
    occupied: new Set([`${player.x},${player.y}`]),
    barriers: new Set(),
    portals: new Set(),
    voidTiles: new Set(),
    hazardTiles: new Map(),
    availableSpells: [spell],
    assignedSpells: [spell],
    battleTurn: 1,
    allyCount: 0,
    enemyCount: 1,
    enrageMultiplier: 1,
    isSlimeFlood: false,
    rng: () => 0,
    getEffectiveStat: () => 0,
    calcScaledDamage: (base) => base,
    hasLineOfSight: (from, to) => hasBresenhamLoS(tiles, from, to),
    log: () => {},
    focusTargetId: null,
    setFocusTargetId: () => {},
    focusAlreadySet: false,
    markFocusSet: () => {},
  };
}

describe("enemy AI highlight vs execute geometry", () => {
  it("casts a no-LoS spell through a wall that default-on LoS would block", () => {
    const tiles = Array.from({ length: WORLD_GRID_SIZE }, () =>
      Array.from({ length: WORLD_GRID_SIZE }, () => "floor" as const),
    );
    tiles[2][4] = "wall";
    const enemy = casterPawn(2, 2);
    const player = { x: 6, y: 2 };
    const noLos = frost(false);
    assert.equal(
      enemyCastGeometryOk({
        origin: { x: 2, y: 2 },
        target: player,
        spell: noLos,
        hasLoS: hasBresenhamLoS(tiles, { x: 2, y: 2 }, player),
      }),
      true,
    );
    const action = decideEnemyAction(enemy, ctx(enemy, player, noLos, tiles));
    assert.equal(action.kind, "cast");
    assert.equal(action.targetId, "player");
    assert.equal(action.spell?.id, "starter-frost");
    assert.deepEqual(action.destination, { x: 2, y: 2 });
  });

  it("does not cast a default-LoS spell through that same wall from origin", () => {
    const tiles = Array.from({ length: WORLD_GRID_SIZE }, () =>
      Array.from({ length: WORLD_GRID_SIZE }, () => "floor" as const),
    );
    tiles[2][4] = "wall";
    const enemy = casterPawn(2, 2);
    const player = { x: 6, y: 2 };
    const withLos = frost();
    assert.equal(hasBresenhamLoS(tiles, { x: 2, y: 2 }, player), false);
    const action = decideEnemyAction(enemy, ctx(enemy, player, withLos, tiles));
    const castFromOrigin =
      action.kind === "cast" &&
      action.destination.x === 2 &&
      action.destination.y === 2;
    assert.equal(castFromOrigin, false);
  });
});
