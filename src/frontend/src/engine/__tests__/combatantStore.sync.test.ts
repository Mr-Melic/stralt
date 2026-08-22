import { describe, expect, it, vi } from "vitest";
import {
  addCombatant,
  deriveBattleEnemies,
  resetCombatantStore,
  syncCombatants,
} from "../combatantStore";
import { makeEnemy, makeStoreCtx, makeTurnEntry } from "./fixtures";

function playerThenBossCtx() {
  const boss = makeEnemy({ id: "boss", isBoss: true });
  return {
    boss,
    ctx: makeStoreCtx(
      [boss],
      [
        makeTurnEntry({ id: "player", type: "player" }),
        makeTurnEntry({ id: "boss" }),
      ],
    ),
  };
}

describe("syncCombatants", () => {
  it("rebuilds the turn queue from store combatants and drops a player entry", () => {
    // Mid-battle boss-minion REPLACE: syncCombatants rebuilds turnOrder from
    // next ∩ battleStartIds. The player is injected only at battle start and
    // is not in the combatant store, so REPLACE drops them and the fight
    // becomes an endless enemy/minion cycle.
    const { ctx, boss } = playerThenBossCtx();
    const larva = makeEnemy({ id: "larva", x: 2, y: 2, isBossMinion: true });

    syncCombatants(ctx, [boss, larva]);

    expect(ctx.combatantsRef.current.map((c) => c.id)).toEqual([
      "boss",
      "larva",
    ]);
    expect(ctx.turnOrderRef.current.map((e) => e.id)).toEqual(["boss"]);
    expect(
      ctx.turnOrderRef.current.some(
        (e) => e.id === "player" || e.type === "player",
      ),
    ).toBe(false);
    expect(ctx.battleStartIds.has("larva")).toBe(false);
    expect(deriveBattleEnemies(ctx).map((c) => c.id)).toEqual(["boss"]);
  });

  it("rebuilds battleStartIds when resetBattle is true", () => {
    const a = makeEnemy({ id: "a" });
    const b = makeEnemy({ id: "b" });
    const ctx = makeStoreCtx([a]);

    syncCombatants(ctx, [a, b], { resetBattle: true });

    expect([...ctx.battleStartIds].sort()).toEqual(["a", "b"]);
    expect(deriveBattleEnemies(ctx).map((c) => c.id)).toEqual(["a", "b"]);
    expect(ctx.turnOrderRef.current.map((e) => e.id)).toEqual(["a", "b"]);
  });
});

describe("addCombatant mid-battle spawn", () => {
  it("keeps the player in turn order and enrolls a minion in the battle roster", () => {
    const { ctx } = playerThenBossCtx();
    const larva = makeEnemy({
      id: "larva",
      x: 2,
      y: 2,
      isBossMinion: true,
    });

    addCombatant(ctx, larva, { battleParticipant: true });

    expect(ctx.combatantsRef.current.map((c) => c.id)).toEqual([
      "boss",
      "larva",
    ]);
    expect(ctx.turnOrderRef.current.map((e) => e.id)).toEqual([
      "player",
      "boss",
      "larva",
    ]);
    expect(ctx.battleStartIds.has("larva")).toBe(true);
    expect(deriveBattleEnemies(ctx).map((c) => c.id)).toEqual([
      "boss",
      "larva",
    ]);
    expect(ctx.turnOrderRef.current[0].type).toBe("player");
  });

  it("inserts a spawn after a turn-order-only player id", () => {
    const { ctx } = playerThenBossCtx();

    addCombatant(
      ctx,
      makeEnemy({
        id: "wolf",
        isSummon: true,
        side: "player",
        ownerId: "player",
      }),
      { battleParticipant: true, insertAfterId: "player" },
    );

    expect(ctx.turnOrderRef.current.map((e) => e.id)).toEqual([
      "player",
      "wolf",
      "boss",
    ]);
    expect(ctx.turnOrderRef.current[1].type).toBe("summon");
  });

  it("does not enroll a world-level spawn in the battle roster", () => {
    const { ctx } = playerThenBossCtx();

    addCombatant(ctx, makeEnemy({ id: "wanderer" }));

    expect(ctx.battleStartIds.has("wanderer")).toBe(false);
    expect(deriveBattleEnemies(ctx).map((c) => c.id)).toEqual(["boss"]);
    expect(ctx.combatantsRef.current.map((c) => c.id)).toEqual([
      "boss",
      "wanderer",
    ]);
  });
});

describe("resetCombatantStore", () => {
  it("clears roster mirrors and battle ids without moving the turn index", () => {
    const { ctx } = playerThenBossCtx();
    ctx.currentTurnIndexRef.current = 1;
    const onMutation = vi.fn();
    ctx.onMutation = onMutation;

    resetCombatantStore(ctx);

    expect(ctx.combatantsRef.current).toEqual([]);
    expect(ctx.enemiesRef.current).toEqual([]);
    expect(ctx.battleEnemiesRef.current).toEqual([]);
    expect(ctx.turnOrderRef.current).toEqual([]);
    expect(ctx.battleStartIds.size).toBe(0);
    expect(deriveBattleEnemies(ctx)).toEqual([]);
    expect(ctx.currentTurnIndexRef.current).toBe(1);
    expect(onMutation).not.toHaveBeenCalled();
  });

  it("fires onMutation after add and sync but not after reset", () => {
    const ctx = makeStoreCtx([makeEnemy({ id: "a" })]);
    const onMutation = vi.fn();
    ctx.onMutation = onMutation;

    addCombatant(ctx, makeEnemy({ id: "b" }), { battleParticipant: true });
    syncCombatants(ctx, ctx.combatantsRef.current);
    expect(onMutation).toHaveBeenCalledTimes(2);

    resetCombatantStore(ctx);
    expect(onMutation).toHaveBeenCalledTimes(2);
  });
});
