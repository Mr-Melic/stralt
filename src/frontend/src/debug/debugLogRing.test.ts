import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clearDebugLogRing,
  createDebugLogRing,
  pushDebugLogEntry,
  snapshotDebugLogRing,
} from "./debugLogRing.ts";

describe("debugLogRing", () => {
  it("keeps insertion order before the cap", () => {
    const ring = createDebugLogRing<number>(4);
    pushDebugLogEntry(ring, 1);
    pushDebugLogEntry(ring, 2);
    pushDebugLogEntry(ring, 3);
    assert.deepEqual(snapshotDebugLogRing(ring), [1, 2, 3]);
    assert.equal(ring.size, 3);
  });

  it("drops the oldest entry in place when the cap is exceeded", () => {
    const ring = createDebugLogRing<number>(3);
    pushDebugLogEntry(ring, 1);
    pushDebugLogEntry(ring, 2);
    pushDebugLogEntry(ring, 3);
    pushDebugLogEntry(ring, 4);
    pushDebugLogEntry(ring, 5);
    assert.deepEqual(snapshotDebugLogRing(ring), [3, 4, 5]);
    assert.equal(ring.size, 3);
  });

  it("clear drops retained entry references", () => {
    const ring = createDebugLogRing<{ n: number }>(2);
    const first = { n: 1 };
    pushDebugLogEntry(ring, first);
    pushDebugLogEntry(ring, { n: 2 });
    clearDebugLogRing(ring);
    assert.deepEqual(snapshotDebugLogRing(ring), []);
    assert.equal(ring.size, 0);
    assert.equal(ring.slots[0], undefined);
    assert.equal(ring.slots[1], undefined);
  });

  it("is a no-op when cap is 0", () => {
    const ring = createDebugLogRing<number>(0);
    pushDebugLogEntry(ring, 1);
    assert.deepEqual(snapshotDebugLogRing(ring), []);
  });
});
