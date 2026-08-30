import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Enemy } from "../types/gameTypes.ts";

function findNearestHostile(
  casterPos: { x: number; y: number },
  effectiveRange: number,
  liveCombatants: Array<
    Partial<Enemy> & {
      id: string;
      x: number;
      y: number;
      side?: string;
      hp?: number;
    }
  >,
): (typeof liveCombatants)[0] | null {
  const liveHostiles = liveCombatants.filter(
    (e) => e.side !== "player" && (e.hp ?? 0) > 0,
  );
  let nearest: (typeof liveHostiles)[0] | null = null;
  let nearestDist = Number.POSITIVE_INFINITY;
  for (const e of liveHostiles) {
    const dx = Math.abs(e.x - casterPos.x);
    const dy = Math.abs(e.y - casterPos.y);
    const dist = Math.max(dx, dy);
    if (dist <= effectiveRange && dist < nearestDist) {
      nearest = e;
      nearestDist = dist;
    }
  }
  return nearest;
}

describe("findNearestHostile", () => {
  it("targets enemy-side summons that are only in the live combatant store", () => {
    const liveCombatants = [
      { id: "player-summon-wolf", x: 2, y: 2, side: "player", hp: 20 },
      { id: "enemy-minion-rat", x: 3, y: 3, side: "enemy", hp: 15 },
    ];
    const target = findNearestHostile({ x: 1, y: 1 }, 3, liveCombatants);
    assert.ok(target);
    assert.equal(target?.id, "enemy-minion-rat");
  });

  it("ignores dead enemies and player-side allies", () => {
    const liveCombatants = [
      { id: "dead-enemy", x: 2, y: 2, side: "enemy", hp: 0 },
      { id: "player-ally", x: 2, y: 2, side: "player", hp: 50 },
    ];
    const target = findNearestHostile({ x: 1, y: 1 }, 3, liveCombatants);
    assert.equal(target, null);
  });
});
