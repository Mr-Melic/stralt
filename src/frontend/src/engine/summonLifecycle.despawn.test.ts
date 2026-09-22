import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { CombatantEntry } from "../components/InitiativeStrip";
import type { Enemy } from "../types/gameTypes.ts";
import { selectDefeatedEnemiesForRewards } from "../utils/rewardResolver.ts";
import {
  activeHostilesRemaining,
  countsTowardKillRewards,
  shouldAwardVictory,
} from "./battleSetup.ts";
import {
  type CombatantStoreCtx,
  addCombatant,
  getLiveCombatants,
  initCombatantStore,
  removeCombatant,
  syncCombatants,
  updateCombatant,
} from "./combatantStore.ts";
import { type OccupancyContext, isCellFree } from "./occupancy.ts";
import type { SpellContext } from "./spellEngine.ts";
import { executeSummonAction } from "./summonExecutor.ts";

function unit(id: string, extra: Partial<Enemy> = {}): Enemy {
  return {
    id,
    x: 1,
    y: 1,
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
    ...extra,
  };
}

function store(initial: Enemy[]): CombatantStoreCtx {
  const combatantsRef = { current: [] as Enemy[] };
  const enemiesRef = { current: [] as Enemy[] };
  const battleEnemiesRef = { current: [] as Enemy[] };
  const turnOrderRef = { current: [] as CombatantEntry[] };
  const currentTurnIndexRef = { current: 0 };
  const ctx = initCombatantStore(
    combatantsRef,
    enemiesRef,
    battleEnemiesRef,
    turnOrderRef,
    currentTurnIndexRef,
    () => {},
    () => {},
    () => {},
  );
  syncCombatants(ctx, initial, { resetBattle: true });
  return ctx;
}

/**
 * Same occupancy predicate WorldExploration uses for summon / AI
 * `isOccupied`: live store rows, including hp=0 corpses until
 * `removeCombatant` / `processCombatantDeath`.
 */
function wxOccupiesTile(
  ctx: CombatantStoreCtx,
  tile: { x: number; y: number },
): boolean {
  return getLiveCombatants(ctx).some((e) => e.x === tile.x && e.y === tile.y);
}

function walkableOccupancy(ctx: CombatantStoreCtx): OccupancyContext {
  const tiles = Array.from({ length: 6 }, () =>
    Array.from({ length: 6 }, () => true),
  );
  return {
    tiles,
    barriers: new Set(),
    voidTiles: new Set(),
    portals: new Set(),
    isOccupied: (c) => wxOccupiesTile(ctx, c),
  };
}

function dummyCtx(): SpellContext {
  return {
    rng: () => 0,
    getEffectiveStat: () => 0,
    dealDamage: () => 0,
    heal: () => {},
    applyEffect: () => {},
    placeBarrier: () => {},
    spawnUnit: () => {},
    log: () => {},
    isCellFree: () => true,
    getCombatantAt: () => null,
  };
}

describe("bomber kamikaze must leave the live roster", () => {
  it("updateCombatant(hp=0) still occupies the tile; removeCombatant frees it", () => {
    // WorldExploration used to write executeSummonAction.hp through
    // updateCombatant only. Bomber detonate (and any executor hp===0)
    // then stayed in getLiveCombatants, so isOccupied blocked the cell
    // for the rest of the fight — a sealed unique corridor, a stuck
    // walk, a summon that could not land.
    const tile = { x: 4, y: 3 };
    const ctx = store([
      unit("rat-1", { x: 2, y: 3, side: "enemy" }),
      unit("bomber-1", {
        x: tile.x,
        y: tile.y,
        hp: 50,
        maxHp: 50,
        isSummon: true,
        side: "player",
        summonAI: "bomber",
        currentAp: 1,
        currentMp: 4,
        maxAp: 1,
        maxMp: 4,
        name: "Bomber",
      }),
    ]);
    const occupancy = walkableOccupancy(ctx);
    assert.equal(isCellFree(tile, occupancy), false);

    const bomber = getLiveCombatants(ctx).find((e) => e.id === "bomber-1");
    assert.ok(bomber);
    const result = executeSummonAction(
      {
        archetype: "bomber",
        kind: "cast",
        destination: tile,
        spell: {
          name: "Blast",
          apCost: 1,
          damage: 10,
        },
        targetId: "rat-1",
        intent: "detonates",
        intentColor: "#ff7a1a",
        retreating: false,
      } as Parameters<typeof executeSummonAction>[0],
      bomber,
      dummyCtx(),
      {
        calcScaledDamage: (n) => n,
        occupancyCtx: occupancy,
        worldGridSize: 6,
        mpCostPerTile: 1,
        meleeApCost: 1,
        getEnemyById: (id) =>
          getLiveCombatants(ctx).find((e) => e.id === id) as Enemy,
        getAoEVictims: () => [],
      },
    );
    assert.equal(result.hp, 0, "bomber kit damage cast must detonate");

    updateCombatant(ctx, "bomber-1", {
      x: result.newPosition.x,
      y: result.newPosition.y,
      hp: result.hp,
    });
    const corpse = getLiveCombatants(ctx).find((e) => e.id === "bomber-1");
    assert.ok(corpse);
    assert.equal(corpse.hp, 0);
    assert.equal(
      wxOccupiesTile(ctx, tile),
      true,
      "hp=0 write without removeCombatant is the pre-fix corpse",
    );
    assert.equal(isCellFree(tile, occupancy), false);
    assert.equal(
      countsTowardKillRewards(corpse),
      false,
      "player-side bomber kamikaze must not enter applyRewards",
    );
    assert.deepEqual(
      selectDefeatedEnemiesForRewards(
        [],
        [
          {
            name: corpse.pieceType,
            pieceType: corpse.pieceType,
            level: corpse.level,
            isSummon: true,
            side: "player",
          },
        ],
      ),
      [],
    );

    // Fix: processCombatantDeath → removeCombatant (WX hp<=0 branch).
    removeCombatant(ctx, "bomber-1");
    assert.equal(
      getLiveCombatants(ctx).some((e) => e.id === "bomber-1"),
      false,
    );
    assert.equal(wxOccupiesTile(ctx, tile), false);
    assert.equal(isCellFree(tile, occupancy), true);
    assert.deepEqual(
      ctx.turnOrderRef.current.map((e) => e.id),
      ["rat-1"],
    );
  });
});

describe("mid-fight summon spawn must append, not REPLACE", () => {
  it("addCombatant keeps live hostiles; a stale syncCombatants REPLACE awards a false victory", () => {
    // Spawn used to build newEnemies from the closure `enemies` snapshot
    // then syncCombatants. A stale / empty snapshot wiped the real
    // hostiles out of combatantsRef and fired the victory gate — recap
    // and applyRewards with an empty kill list.
    const ctx = store([
      unit("rat-1", { x: 2, y: 2, side: "enemy" }),
      unit("golem-1", { x: 6, y: 2, side: "enemy" }),
    ]);
    const staleSnapshot: Enemy[] = [];
    const wolf = unit("wolf-1", {
      x: 3,
      y: 3,
      isSummon: true,
      side: "player",
      hp: 20,
      maxHp: 20,
      name: "Wolf",
    });

    const wiped = store([
      unit("rat-1", { x: 2, y: 2, side: "enemy" }),
      unit("golem-1", { x: 6, y: 2, side: "enemy" }),
    ]);
    syncCombatants(wiped, [...staleSnapshot, wolf], { resetBattle: false });
    assert.deepEqual(
      getLiveCombatants(wiped).map((e) => e.id),
      ["wolf-1"],
    );
    assert.equal(activeHostilesRemaining(getLiveCombatants(wiped)), 0);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: wiped.battleStartIds.size,
        hostilesRemaining: 0,
      }),
      true,
      "REPLACE from a stale snapshot used to fire victory with no kills",
    );

    addCombatant(ctx, wolf, {
      battleParticipant: true,
      insertAfterId: "player",
    });
    assert.deepEqual(
      getLiveCombatants(ctx).map((e) => e.id),
      ["rat-1", "golem-1", "wolf-1"],
    );
    assert.equal(activeHostilesRemaining(getLiveCombatants(ctx)), 2);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: ctx.battleStartIds.size,
        hostilesRemaining: activeHostilesRemaining(getLiveCombatants(ctx)),
      }),
      false,
    );
  });
});
