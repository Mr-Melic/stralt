import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { CombatantEntry } from "../components/InitiativeStrip";
import type { Enemy } from "../types/gameTypes";
import {
  addCombatant,
  getLiveCombatants,
  initCombatantStore,
  removeCombatant,
  syncCombatants,
} from "./combatantStore.ts";
import { expireSummonsAtTurnStart } from "./summonLifespan.ts";
import { liveTurnOrder, nextTurnIndex } from "./turnQueue.ts";

function enemy(id: string, extra: Partial<Enemy> = {}): Enemy {
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

describe("advanceTurn summon lifespan uses the live store", () => {
  it("ticks a mid-fight wolf that exists only on combatantsRef", () => {
    // advanceTurn is a long-lived callback and does not list `enemies` in
    // its deps. After Dire Wolf is summoned, that snapshot is still the
    // pre-summon roster. WX must tick getLiveCombatants, not the closed
    // React array — otherwise the wolf never fades and End Turn drops it
    // from the debug roster / Attack Nearest list.
    const rat = enemy("rat-1");
    const ctx = store([rat]);
    const staleSnapshot = [...getLiveCombatants(ctx)];

    addCombatant(
      ctx,
      enemy("wolf-1", {
        isSummon: true,
        side: "player",
        name: "Wolf",
        turnsRemaining: 4,
        hp: 20,
        maxHp: 20,
      }),
      { battleParticipant: true, insertAfterId: "rat-1" },
    );

    assert.deepEqual(
      staleSnapshot.map((c) => c.id),
      ["rat-1"],
    );
    assert.deepEqual(
      getLiveCombatants(ctx).map((c) => c.id),
      ["rat-1", "wolf-1"],
    );

    const wolf = getLiveCombatants(ctx).find((c) => c.id === "wolf-1");
    assert.ok(wolf);

    const staleExpired = expireSummonsAtTurnStart(
      staleSnapshot,
      () => {},
      "wolf-1",
    );
    assert.deepEqual(staleExpired, []);
    assert.equal(wolf.turnsRemaining, 4);

    const liveExpired = expireSummonsAtTurnStart(
      getLiveCombatants(ctx),
      () => {},
      "wolf-1",
    );
    assert.deepEqual(liveExpired, []);
    assert.equal(wolf.turnsRemaining, 3);
    assert.equal(wolf.hp, 20);
  });

  it("removeCombatant after live-store expiry drops the ghost turn slot", () => {
    // WX expires via expireSummonsAtTurnStart(getLiveCombatants) then
    // removeCombatant. Leaving the faded wolf on turnOrderRef made
    // (idx + 1) % length land on a removed id and skip the next living
    // combatant — or dispatch a corpse.
    const player = enemy("player", { side: "player", name: "Hero" });
    const ctx = store([player]);
    addCombatant(
      ctx,
      enemy("wolf-1", {
        isSummon: true,
        side: "player",
        name: "Wolf",
        turnsRemaining: 1,
        hp: 20,
        maxHp: 20,
      }),
      { battleParticipant: true, insertAfterId: "player" },
    );

    ctx.currentTurnIndexRef.current = 0;
    const expired = expireSummonsAtTurnStart(
      getLiveCombatants(ctx),
      () => {},
      "wolf-1",
    );
    assert.deepEqual(expired, ["wolf-1"]);
    for (const id of expired) removeCombatant(ctx, id);

    assert.equal(
      getLiveCombatants(ctx).some((c) => c.id === "wolf-1"),
      false,
    );
    assert.deepEqual(
      ctx.turnOrderRef.current.map((c) => c.id),
      ["player"],
    );
    const order = liveTurnOrder([], ctx.turnOrderRef.current);
    const nextIdx = nextTurnIndex(
      ctx.currentTurnIndexRef.current,
      order.length,
    );
    assert.equal(order[nextIdx]?.id, "player");
    assert.notEqual(order[nextIdx]?.id, "wolf-1");
  });
});
