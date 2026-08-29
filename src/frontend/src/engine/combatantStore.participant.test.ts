import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { CombatantEntry } from "../components/InitiativeStrip.tsx";
import type { Enemy } from "../types/gameTypes.ts";
import {
  addCombatant,
  initCombatantStore,
  syncCombatants,
} from "./combatantStore.ts";

function enemy(overrides: Partial<Enemy> = {}): Enemy {
  return {
    id: "rat",
    x: 3,
    y: 3,
    level: 2,
    hp: 20,
    maxHp: 20,
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
    ...overrides,
  };
}

function makeStore(initial: Enemy[] = []) {
  const combatantsRef = { current: [...initial] };
  const enemiesRef = { current: [...initial] };
  const battleEnemiesRef = { current: [...initial] };
  const turnOrderRef = { current: [] as CombatantEntry[] };
  const currentTurnIndexRef = { current: 0 };
  const ctx = initCombatantStore(
    combatantsRef,
    enemiesRef,
    battleEnemiesRef,
    turnOrderRef,
    currentTurnIndexRef,
    (fn) => {
      enemiesRef.current = fn(enemiesRef.current);
    },
    (fn) => {
      battleEnemiesRef.current = fn(battleEnemiesRef.current);
    },
    (fn) => {
      turnOrderRef.current = fn(turnOrderRef.current);
    },
    initial,
  );
  return {
    ctx,
    combatantsRef,
    battleEnemiesRef,
    turnOrderRef,
  };
}

describe("addCombatant battleParticipant", () => {
  it("keeps a mid-battle minion on the roster only when battleParticipant is set", () => {
    const { ctx, turnOrderRef } = makeStore();
    const opener = enemy({ id: "wraith" });
    syncCombatants(ctx, [opener], { resetBattle: true });

    addCombatant(ctx, enemy({ id: "larva", isSummon: true, side: "enemy" }));
    assert.equal(ctx.battleStartIds.has("larva"), false);
    // ADD always appends to the live queue. The flag only seeds battleStartIds.
    assert.equal(
      turnOrderRef.current.some((e) => e.id === "larva"),
      true,
    );

    addCombatant(ctx, enemy({ id: "minion", isBossMinion: true }), {
      battleParticipant: true,
    });
    assert.equal(ctx.battleStartIds.has("minion"), true);

    // World-movement REPLACE rebuilds turnOrder from store ∩ battleStartIds.
    // The player is not in the store. A minion added without the flag
    // drops out of the battle queue; the flagged minion stays.
    syncCombatants(ctx, ctx.combatantsRef.current, { resetBattle: false });
    const ids = turnOrderRef.current.map((e) => e.id);
    assert.deepEqual(ids, ["wraith", "minion"]);
    assert.equal(ids.includes("larva"), false);
  });

  it("inserts a summon immediately after its owner, not at the tail", () => {
    const { ctx, turnOrderRef } = makeStore();
    syncCombatants(ctx, [enemy({ id: "summoner" }), enemy({ id: "other" })], {
      resetBattle: true,
    });
    addCombatant(
      ctx,
      enemy({
        id: "wolf",
        isSummon: true,
        side: "player",
        ownerId: "summoner",
      }),
      { battleParticipant: true, insertAfterId: "summoner" },
    );
    assert.deepEqual(
      turnOrderRef.current.map((e) => e.id),
      ["summoner", "wolf", "other"],
    );
    assert.equal(turnOrderRef.current[1].type, "summon");
  });
});
