import { describe, expect, it, vi } from "vitest";
import {
  addCombatant,
  reconcileBattleState,
  removeCombatant,
  updateCombatant,
} from "../combatantStore";
import { makeEnemy, makeStoreCtx, makeTurnEntry } from "./fixtures";

describe("removeCombatant", () => {
  it("snapshots the removed combatant before dropping it from the roster", () => {
    const goblin = makeEnemy({ id: "gob", x: 2, y: 3, pieceType: "rook" });
    const ctx = makeStoreCtx([goblin, makeEnemy({ id: "rat" })]);
    removeCombatant(ctx, "gob");
    expect(ctx.lastRemovedCombatant?.id).toBe("gob");
    expect(ctx.lastRemovedCombatant?.pieceType).toBe("rook");
    expect(ctx.combatantsRef.current.map((c) => c.id)).toEqual(["rat"]);
    expect(ctx.enemiesRef.current.map((c) => c.id)).toEqual(["rat"]);
    expect(ctx.battleStartIds.has("gob")).toBe(false);
    expect(ctx.turnOrderRef.current.map((c) => c.id)).toEqual(["rat"]);
  });

  it("clears a stale lastRemoved snapshot when the id is already gone", () => {
    const ctx = makeStoreCtx([makeEnemy({ id: "live" })]);
    ctx.lastRemovedCombatant = makeEnemy({ id: "stale" });
    removeCombatant(ctx, "missing");
    expect(ctx.lastRemovedCombatant).toBeNull();
    expect(ctx.combatantsRef.current.map((c) => c.id)).toEqual(["live"]);
  });
});

describe("addCombatant", () => {
  it("inserts a summon adjacent to its owner in the turn order", () => {
    const owner = makeEnemy({ id: "caster", side: "player" });
    const other = makeEnemy({ id: "mob" });
    const ctx = makeStoreCtx([owner, other]);
    addCombatant(
      ctx,
      makeEnemy({
        id: "wolf",
        isSummon: true,
        side: "player",
        ownerId: "caster",
      }),
      { battleParticipant: true, insertAfterId: "caster" },
    );
    expect(ctx.combatantsRef.current.map((c) => c.id)).toEqual([
      "caster",
      "mob",
      "wolf",
    ]);
    expect(ctx.turnOrderRef.current.map((c) => c.id)).toEqual([
      "caster",
      "wolf",
      "mob",
    ]);
    expect(ctx.turnOrderRef.current[1].type).toBe("summon");
    expect(ctx.battleStartIds.has("wolf")).toBe(true);
  });
});

describe("updateCombatant death-pipeline guard", () => {
  it("rejects HP writes to a removed or already-dead combatant", () => {
    const dead = makeEnemy({ id: "dead", hp: 0 });
    const live = makeEnemy({ id: "live", hp: 20 });
    const ctx = makeStoreCtx([dead, live]);
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);

    updateCombatant(ctx, "dead", { hp: 40 }, "phase-heal");
    expect(ctx.combatantsRef.current.find((c) => c.id === "dead")?.hp).toBe(0);

    removeCombatant(ctx, "live");
    updateCombatant(ctx, "live", { hp: 99 }, "post-death");
    expect(
      ctx.combatantsRef.current.find((c) => c.id === "live"),
    ).toBeUndefined();
    expect(
      log.mock.calls.some((c) => String(c[0]).includes("rejected-write")),
    ).toBe(true);
    log.mockRestore();
  });

  it("still applies HP writes to a living combatant", () => {
    const ctx = makeStoreCtx([makeEnemy({ id: "live", hp: 20 })]);
    updateCombatant(ctx, "live", { hp: 12 }, "resolveSpellCast-damage");
    expect(ctx.combatantsRef.current[0].hp).toBe(12);
    expect(ctx.turnOrderRef.current[0].hp).toBe(12);
  });
});

describe("reconcileBattleState", () => {
  it("drops ghost turn-queue ids and keeps the player entry", () => {
    const live = makeEnemy({ id: "alive" });
    const ctx = makeStoreCtx([live]);
    ctx.turnOrderRef.current = [
      makeTurnEntry({ id: "player", type: "player" }),
      makeTurnEntry({ id: "ghost" }),
      makeTurnEntry({ id: "alive" }),
    ];
    ctx.currentTurnIndexRef.current = 2;
    const triggerVictory = vi.fn();
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    reconcileBattleState(ctx, {
      inBattle: true,
      victoryFiredThisBattleRef: { current: false },
      triggerVictory,
    });
    expect(ctx.turnOrderRef.current.map((c) => c.id)).toEqual([
      "player",
      "alive",
    ]);
    expect(ctx.currentTurnIndexRef.current).toBe(1);
    expect(triggerVictory).not.toHaveBeenCalled();
    expect(
      log.mock.calls.some((c) => String(c[0]).includes("dropped ghost")),
    ).toBe(true);
    log.mockRestore();
  });

  it("fires victory once when no hostiles remain and a battle roster exists", () => {
    const summon = makeEnemy({
      id: "wolf",
      isSummon: true,
      side: "player",
      hp: 20,
    });
    const ctx = makeStoreCtx([summon]);
    const victoryFiredThisBattleRef = { current: false };
    const triggerVictory = vi.fn();
    reconcileBattleState(ctx, {
      inBattle: true,
      victoryFiredThisBattleRef,
      triggerVictory,
    });
    reconcileBattleState(ctx, {
      inBattle: true,
      victoryFiredThisBattleRef,
      triggerVictory,
    });
    expect(triggerVictory).toHaveBeenCalledTimes(1);
    expect(victoryFiredThisBattleRef.current).toBe(true);
  });

  it("does not fire victory outside battle", () => {
    const ctx = makeStoreCtx([
      makeEnemy({ id: "wolf", isSummon: true, side: "player" }),
    ]);
    const triggerVictory = vi.fn();
    reconcileBattleState(ctx, {
      inBattle: false,
      victoryFiredThisBattleRef: { current: false },
      triggerVictory,
    });
    expect(triggerVictory).not.toHaveBeenCalled();
  });
});
