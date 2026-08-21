import { describe, expect, it } from "vitest";
import { removeCombatantFromTurnQueue } from "../turnQueue";
import { makeTurnEntry } from "./fixtures";

function setup(ids: string[], current: number) {
  const order = ids.map((id) => makeTurnEntry({ id }));
  const turnOrderRef = { current: [...order] };
  const currentTurnIndexRef = { current };
  let lastSet: typeof order | null = null;
  const setTurnOrder = (updater: (prev: typeof order) => typeof order) => {
    lastSet = updater(turnOrderRef.current);
    turnOrderRef.current = lastSet;
  };
  return {
    order,
    turnOrderRef,
    currentTurnIndexRef,
    setTurnOrder,
    getLastSet: () => lastSet,
  };
}

describe("removeCombatantFromTurnQueue", () => {
  it("shifts the active index down when an earlier combatant dies", () => {
    const q = setup(["a", "b", "c"], 1);
    removeCombatantFromTurnQueue(
      q.order,
      q.turnOrderRef,
      q.currentTurnIndexRef,
      "a",
      q.setTurnOrder,
    );
    expect(q.turnOrderRef.current.map((c) => c.id)).toEqual(["b", "c"]);
    expect(q.currentTurnIndexRef.current).toBe(0);
  });

  it("points at the predecessor when the active combatant dies so advanceTurn lands on the next", () => {
    const q = setup(["a", "b", "c"], 1);
    removeCombatantFromTurnQueue(
      q.order,
      q.turnOrderRef,
      q.currentTurnIndexRef,
      "b",
      q.setTurnOrder,
    );
    expect(q.turnOrderRef.current.map((c) => c.id)).toEqual(["a", "c"]);
    expect(q.currentTurnIndexRef.current).toBe(0);
    const nextIdx =
      (q.currentTurnIndexRef.current + 1) % q.turnOrderRef.current.length;
    expect(q.turnOrderRef.current[nextIdx].id).toBe("c");
  });

  it("wraps to the last entry when index 0 dies on its own turn", () => {
    const q = setup(["a", "b", "c"], 0);
    removeCombatantFromTurnQueue(
      q.order,
      q.turnOrderRef,
      q.currentTurnIndexRef,
      "a",
      q.setTurnOrder,
    );
    expect(q.turnOrderRef.current.map((c) => c.id)).toEqual(["b", "c"]);
    expect(q.currentTurnIndexRef.current).toBe(1);
    const nextIdx =
      (q.currentTurnIndexRef.current + 1) % q.turnOrderRef.current.length;
    expect(q.turnOrderRef.current[nextIdx].id).toBe("b");
  });

  it("leaves the active index unchanged when a later combatant dies", () => {
    const q = setup(["a", "b", "c"], 1);
    removeCombatantFromTurnQueue(
      q.order,
      q.turnOrderRef,
      q.currentTurnIndexRef,
      "c",
      q.setTurnOrder,
    );
    expect(q.turnOrderRef.current.map((c) => c.id)).toEqual(["a", "b"]);
    expect(q.currentTurnIndexRef.current).toBe(1);
  });

  it("is a no-op when the id is not in the queue", () => {
    const q = setup(["a", "b"], 1);
    removeCombatantFromTurnQueue(
      q.order,
      q.turnOrderRef,
      q.currentTurnIndexRef,
      "missing",
      q.setTurnOrder,
    );
    expect(q.currentTurnIndexRef.current).toBe(1);
    expect(q.getLastSet()).toBeNull();
    expect(q.turnOrderRef.current.map((c) => c.id)).toEqual(["a", "b"]);
  });

  it("forces the index to 0 when the last combatant is removed", () => {
    const q = setup(["solo"], 0);
    removeCombatantFromTurnQueue(
      q.order,
      q.turnOrderRef,
      q.currentTurnIndexRef,
      "solo",
      q.setTurnOrder,
    );
    expect(q.turnOrderRef.current).toEqual([]);
    expect(q.currentTurnIndexRef.current).toBe(0);
  });
});
