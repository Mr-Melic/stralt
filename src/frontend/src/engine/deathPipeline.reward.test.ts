import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { processCombatantDeath } from "./deathPipeline.ts";

describe("death pipeline reward attribution", () => {
  it("cannot live-lookup a kill after removeCombatant; snapshot before remove keeps it", () => {
    const roster = [
      { id: "rat-1", pieceType: "plague_rat", level: 5 },
      { id: "golem-1", pieceType: "iron_golem", level: 8 },
    ];
    const attributed: Array<{
      id: string;
      name: string;
      pieceType: string;
      level: number;
    }> = [];
    let pending: (typeof attributed)[number] | null = null;
    const events: string[] = [];

    const ran = processCombatantDeath("rat-1", {
      isCombatantRemoved: (id) => roster.find((c) => c.id === id) === undefined,
      getCombatantName: (id) => {
        const c = roster.find((e) => e.id === id);
        if (c) {
          pending = {
            id,
            name: c.pieceType,
            pieceType: c.pieceType,
            level: c.level,
          };
        }
        return c?.pieceType ?? "Unknown";
      },
      getCombatantPos: () => ({ x: 0, y: 0 }),
      removeCombatant: (id) => {
        const idx = roster.findIndex((c) => c.id === id);
        if (idx >= 0) roster.splice(idx, 1);
      },
      removeFromTurnQueue: () => {},
      removeFromInitiativeStrip: () => {},
      triggerShatter: () => {},
      logDefeated: () => {},
      applyLeaderDeathBoost: () => {},
      recheckVictory: () => {
        events.push("recheck");
      },
      attributeKillReward: (deadId) => {
        events.push("attribute");
        const live = roster.find((e) => e.id === deadId);
        assert.equal(
          live,
          undefined,
          "live roster lookup after remove must miss",
        );
        if (pending?.id === deadId) {
          attributed.push(pending);
          pending = null;
        }
      },
    });

    assert.equal(ran, true);
    assert.deepEqual(events, ["recheck", "attribute"]);
    assert.deepEqual(attributed, [
      {
        id: "rat-1",
        name: "plague_rat",
        pieceType: "plague_rat",
        level: 5,
      },
    ]);
    assert.equal(
      roster.find((c) => c.id === "rat-1"),
      undefined,
    );

    let secondAttribute = 0;
    const second = processCombatantDeath("rat-1", {
      isCombatantRemoved: (id) => roster.find((c) => c.id === id) === undefined,
      getCombatantName: () => "Unknown",
      getCombatantPos: () => ({ x: 0, y: 0 }),
      removeCombatant: () => {},
      removeFromTurnQueue: () => {},
      removeFromInitiativeStrip: () => {},
      triggerShatter: () => {},
      logDefeated: () => {},
      applyLeaderDeathBoost: () => {},
      recheckVictory: () => {},
      attributeKillReward: () => {
        secondAttribute += 1;
      },
    });
    assert.equal(second, false, "already-removed combatant must be a no-op");
    assert.equal(secondAttribute, 0, "must not double-attribute a kill");
  });
});
