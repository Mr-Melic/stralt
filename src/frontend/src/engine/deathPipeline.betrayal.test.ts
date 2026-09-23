import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  processCombatantDeath,
  shouldApplyLeaderDeathBoost,
  shouldProcessBetrayalKill,
} from "./deathPipeline.ts";

describe("shouldProcessBetrayalKill", () => {
  it("routes a lethal ally hit through the death pipeline", () => {
    assert.equal(shouldProcessBetrayalKill(0), true);
    assert.equal(shouldProcessBetrayalKill(-1), true);
  });

  it("keeps a surviving ally on the HP-write path", () => {
    assert.equal(shouldProcessBetrayalKill(1), false);
    assert.equal(shouldProcessBetrayalKill(50), false);
  });

  it("does not treat non-finite HP as a kill", () => {
    assert.equal(shouldProcessBetrayalKill(Number.NaN), false);
    assert.equal(shouldProcessBetrayalKill(Number.POSITIVE_INFINITY), false);
  });
});

describe("betrayal kill attribution", () => {
  function makeCtx() {
    const roster = [
      {
        id: "wolf-1",
        pieceType: "dire_wolf",
        level: 5,
        side: "enemy" as const,
      },
      {
        id: "rat-1",
        pieceType: "plague_rat",
        level: 3,
        side: "enemy" as const,
      },
    ];
    const attributed: string[] = [];
    const leaderSlain: string[] = [];
    const removed = new Set<string>();
    const ctx = {
      isCombatantRemoved: (id: string) => removed.has(id),
      getCombatantName: (id: string) =>
        roster.find((c) => c.id === id)?.pieceType ?? "Unknown",
      getCombatantPos: () => ({ x: 0, y: 0 }),
      removeCombatant: (id: string) => {
        removed.add(id);
      },
      removeFromTurnQueue: () => {},
      removeFromInitiativeStrip: () => {},
      triggerShatter: () => {},
      logDefeated: () => {},
      applyLeaderDeathBoost: (deadId: string) => {
        if (
          shouldApplyLeaderDeathBoost(deadId, "wolf-1", leaderSlain.length > 0)
        ) {
          leaderSlain.push(deadId);
        }
      },
      attributeKillReward: (deadId: string) => {
        const row = roster.find((c) => c.id === deadId);
        if (row && row.side === "enemy") attributed.push(deadId);
      },
      recheckVictory: () => {},
    };
    return { roster, attributed, leaderSlain, removed, ctx };
  }

  it("bare removeCombatant omits the victim from victory XP/Doka", () => {
    const { attributed, leaderSlain, removed, ctx } = makeCtx();
    // Live betrayal used to drop the ally with removeCombatant only.
    ctx.removeCombatant("wolf-1");
    assert.equal(removed.has("wolf-1"), true);
    assert.deepEqual(attributed, []);
    assert.deepEqual(leaderSlain, []);
  });

  it("processCombatantDeath attributes the victim and credits leader_slayer", () => {
    const { attributed, leaderSlain, ctx } = makeCtx();
    assert.equal(shouldProcessBetrayalKill(0), true);
    assert.equal(processCombatantDeath("wolf-1", ctx), true);
    assert.deepEqual(attributed, ["wolf-1"]);
    assert.deepEqual(leaderSlain, ["wolf-1"]);
  });
});
