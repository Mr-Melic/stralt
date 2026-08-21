import { describe, expect, it } from "vitest";
import {
  type DeathPipelineCtx,
  processCombatantDeath,
  processPlayerDeath,
} from "../deathPipeline";

function makeCtx(opts?: {
  alreadyRemoved?: boolean;
  side?: "player" | "enemy";
  isSummon?: boolean;
  withReconcile?: boolean;
}): { ctx: DeathPipelineCtx; calls: string[] } {
  const calls: string[] = [];
  let removed = opts?.alreadyRemoved ?? false;
  const ctx: DeathPipelineCtx = {
    isCombatantRemoved: () => removed,
    getCombatantName: () => "Wraith",
    getCombatantPos: () => ({ x: 3, y: 4 }),
    getCombatantSide: () => opts?.side ?? "enemy",
    getCombatantIsSummon: () => opts?.isSummon ?? false,
    removeCombatant: () => {
      removed = true;
      calls.push("removeCombatant");
    },
    removeFromTurnQueue: () => {
      calls.push("removeFromTurnQueue");
    },
    removeFromInitiativeStrip: () => {
      calls.push("removeFromInitiativeStrip");
    },
    triggerShatter: (_id, x, y) => {
      calls.push(`shatter:${x},${y}`);
    },
    logDefeated: (name) => {
      calls.push(`log:${name}`);
    },
    applyLeaderDeathBoost: (id, side, isSummon) => {
      calls.push(`boost:${id}:${side}:${isSummon}`);
    },
    recheckVictory: () => {
      calls.push("recheckVictory");
    },
    attributeKillReward: (id) => {
      calls.push(`reward:${id}`);
    },
  };
  if (opts?.withReconcile !== false) {
    ctx.reconcileBattleState = () => {
      calls.push("reconcile");
    };
  }
  return { ctx, calls };
}

describe("processCombatantDeath", () => {
  it("runs the death sequence once in the documented order", () => {
    const { ctx, calls } = makeCtx();
    expect(processCombatantDeath("e1", ctx, "player-cast")).toBe(true);
    expect(calls).toEqual([
      "removeCombatant",
      "removeFromTurnQueue",
      "removeFromInitiativeStrip",
      "shatter:3,4",
      "log:Wraith",
      "boost:e1:enemy:false",
      "recheckVictory",
      "reward:e1",
      "reconcile",
    ]);
  });

  it("is idempotent after the combatant has been removed", () => {
    const { ctx, calls } = makeCtx();
    expect(processCombatantDeath("e1", ctx)).toBe(true);
    const first = calls.length;
    expect(processCombatantDeath("e1", ctx, "dot")).toBe(false);
    expect(calls).toHaveLength(first);
  });

  it("is a no-op when the combatant is already removed", () => {
    const { ctx, calls } = makeCtx({ alreadyRemoved: true });
    expect(processCombatantDeath("e1", ctx)).toBe(false);
    expect(calls).toEqual([]);
  });

  it("snapshots side and summon flags before roster removal", () => {
    const { ctx, calls } = makeCtx({ side: "enemy", isSummon: true });
    processCombatantDeath("sum-1", ctx);
    expect(calls.indexOf("removeCombatant")).toBeLessThan(
      calls.indexOf("boost:sum-1:enemy:true"),
    );
    expect(calls).toContain("boost:sum-1:enemy:true");
  });

  it("skips reconcile when the caller omitted the hook", () => {
    const { ctx, calls } = makeCtx({ withReconcile: false });
    expect(processCombatantDeath("e1", ctx)).toBe(true);
    expect(calls).not.toContain("reconcile");
    expect(calls).toContain("reward:e1");
  });
});

describe("processPlayerDeath", () => {
  it("removes the player but skips leader boost and kill reward", () => {
    const { ctx, calls } = makeCtx();
    expect(processPlayerDeath("__player__", ctx, "enemy-melee")).toBe(true);
    expect(calls).toEqual([
      "removeCombatant",
      "removeFromTurnQueue",
      "removeFromInitiativeStrip",
      "shatter:3,4",
      "log:Wraith",
      "recheckVictory",
      "reconcile",
    ]);
    expect(calls.some((c) => c.startsWith("boost:"))).toBe(false);
    expect(calls.some((c) => c.startsWith("reward:"))).toBe(false);
  });

  it("is idempotent for a player who is already dead", () => {
    const { ctx, calls } = makeCtx();
    expect(processPlayerDeath("__player__", ctx)).toBe(true);
    expect(processPlayerDeath("__player__", ctx)).toBe(false);
    expect(calls.filter((c) => c === "removeCombatant")).toHaveLength(1);
  });
});
