import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { CombatantEntry } from "../components/InitiativeStrip";
import type { Enemy } from "../types/gameTypes";
import { activeHostilesRemaining, shouldAwardVictory } from "./battleSetup.ts";
import {
  deriveBattleEnemies,
  initCombatantStore,
  removeCombatant,
  resetCombatantStore,
  syncCombatants,
  updateCombatant,
} from "./combatantStore.ts";

function enemy(id: string, hp = 40): Enemy {
  return {
    id,
    x: 1,
    y: 1,
    level: 3,
    hp,
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
  };
}

function store(initial: Enemy[]) {
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

describe("removeCombatant preserves the battle-start snapshot", () => {
  it("still awards victory after the last hostile is removed", () => {
    const ctx = store([enemy("rat-1"), enemy("golem-1")]);
    assert.equal(ctx.battleStartIds.size, 2);

    removeCombatant(ctx, "rat-1");
    assert.equal(activeHostilesRemaining(ctx.combatantsRef.current), 1);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: ctx.battleStartIds.size,
        hostilesRemaining: activeHostilesRemaining(ctx.combatantsRef.current),
      }),
      false,
      "first kill must not persist rewards",
    );

    removeCombatant(ctx, "golem-1");
    assert.deepEqual(
      [...ctx.battleStartIds].sort(),
      ["golem-1", "rat-1"],
      "last kill must not empty the battle-open snapshot",
    );
    assert.deepEqual(
      deriveBattleEnemies(ctx).map((c) => c.id),
      [],
      "living battle view is empty after the last kill",
    );
    assert.equal(activeHostilesRemaining(ctx.combatantsRef.current), 0);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: ctx.battleStartIds.size,
        hostilesRemaining: 0,
      }),
      true,
      "victory gate must fire so applyRewards / recap can run",
    );
  });

  it("React-only hazard HP write leaves the last enemy blocking victory", () => {
    const ctx = store([enemy("rat-1", 10)]);
    // Simulate the old lava path: enemyHpMap / turnOrder drop to 0, store
    // hp stays 10. Victory reads combatantsRef via isActiveHostile.
    assert.equal(activeHostilesRemaining(ctx.combatantsRef.current), 1);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: ctx.battleStartIds.size,
        hostilesRemaining: activeHostilesRemaining(ctx.combatantsRef.current),
      }),
      false,
      "UI 0 HP must not award while the store still has a living hostile",
    );

    updateCombatant(ctx, "rat-1", { hp: 0 });
    removeCombatant(ctx, "rat-1");
    assert.equal(activeHostilesRemaining(ctx.combatantsRef.current), 0);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: ctx.battleStartIds.size,
        hostilesRemaining: 0,
      }),
      true,
      "store write + processCombatantDeath must award so applyRewards can run",
    );
  });

  it("still clears the snapshot on store reset so idle maps cannot award", () => {
    const ctx = store([enemy("rat-1")]);
    removeCombatant(ctx, "rat-1");
    resetCombatantStore(ctx);
    assert.equal(ctx.battleStartIds.size, 0);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: ctx.battleStartIds.size,
        hostilesRemaining: 0,
      }),
      false,
    );
  });
});
