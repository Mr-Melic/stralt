import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { CombatantEntry } from "../components/InitiativeStrip.tsx";
import { removeCombatantFromTurnQueue } from "./turnQueue.ts";

function entry(
  id: string,
  type: CombatantEntry["type"] = "enemy",
): CombatantEntry {
  return {
    id,
    type,
    initiative: 10,
    name: id,
    pieceIcon: "",
    hp: 20,
    maxHp: 20,
    level: 2,
  };
}

function queue(ids: string[], current: number) {
  const order = ids.map((id) =>
    entry(id, id === "player" ? "player" : "enemy"),
  );
  const turnOrderRef = { current: [...order] };
  const currentTurnIndexRef = { current };
  const setTurnOrder = (
    updater: (prev: CombatantEntry[]) => CombatantEntry[],
  ) => {
    turnOrderRef.current = updater(turnOrderRef.current);
  };
  return { order, turnOrderRef, currentTurnIndexRef, setTurnOrder };
}

describe("removeCombatantFromTurnQueue", () => {
  it("does not skip the next combatant when the active unit dies", () => {
    // [player, enemyA, enemyB], enemyA is acting. After removal the index
    // must sit on player so advanceTurn (idx+1)%len lands on enemyB —
    // not wrap to player and skip enemyB.
    const q = queue(["player", "enemyA", "enemyB"], 1);
    removeCombatantFromTurnQueue(
      q.order,
      q.turnOrderRef,
      q.currentTurnIndexRef,
      "enemyA",
      q.setTurnOrder,
    );
    assert.deepEqual(
      q.turnOrderRef.current.map((e) => e.id),
      ["player", "enemyB"],
    );
    assert.equal(q.currentTurnIndexRef.current, 0);
    const next =
      (q.currentTurnIndexRef.current + 1) % q.turnOrderRef.current.length;
    assert.equal(q.turnOrderRef.current[next].id, "enemyB");
  });

  it("keeps the same actor when an earlier entry dies", () => {
    const q = queue(["player", "enemyA", "enemyB"], 1);
    removeCombatantFromTurnQueue(
      q.order,
      q.turnOrderRef,
      q.currentTurnIndexRef,
      "player",
      q.setTurnOrder,
    );
    assert.deepEqual(
      q.turnOrderRef.current.map((e) => e.id),
      ["enemyA", "enemyB"],
    );
    assert.equal(q.currentTurnIndexRef.current, 0);
    assert.equal(q.turnOrderRef.current[0].id, "enemyA");
  });

  it("leaves the active index alone when a later entry dies", () => {
    const q = queue(["player", "enemyA", "enemyB"], 1);
    removeCombatantFromTurnQueue(
      q.order,
      q.turnOrderRef,
      q.currentTurnIndexRef,
      "enemyB",
      q.setTurnOrder,
    );
    assert.deepEqual(
      q.turnOrderRef.current.map((e) => e.id),
      ["player", "enemyA"],
    );
    assert.equal(q.currentTurnIndexRef.current, 1);
    assert.equal(q.turnOrderRef.current[1].id, "enemyA");
  });

  it("wraps to the last entry when index 0 expires on its own turn", () => {
    const q = queue(["summon", "player"], 0);
    removeCombatantFromTurnQueue(
      q.order,
      q.turnOrderRef,
      q.currentTurnIndexRef,
      "summon",
      q.setTurnOrder,
    );
    assert.deepEqual(
      q.turnOrderRef.current.map((e) => e.id),
      ["player"],
    );
    assert.equal(q.currentTurnIndexRef.current, 0);
  });

  it("is a no-op for an id that is not in the queue", () => {
    const q = queue(["player", "enemyA"], 1);
    removeCombatantFromTurnQueue(
      q.order,
      q.turnOrderRef,
      q.currentTurnIndexRef,
      "missing",
      q.setTurnOrder,
    );
    assert.deepEqual(
      q.turnOrderRef.current.map((e) => e.id),
      ["player", "enemyA"],
    );
    assert.equal(q.currentTurnIndexRef.current, 1);
  });
});
