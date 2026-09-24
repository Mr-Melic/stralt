import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  leftoverWalkAfterSummonAbort,
  remainingWalkOccupies,
  shouldAbortInFlightWalkAfterSummon,
} from "./inFlightWalk.ts";

const leftoverPath = [
  { x: 6, y: 5 },
  { x: 7, y: 5 },
  { x: 8, y: 5 },
];

describe("shouldAbortInFlightWalkAfterSummon", () => {
  it("aborts only while leftover rAF still owns a path", () => {
    assert.equal(shouldAbortInFlightWalkAfterSummon(leftoverPath.length), true);
    assert.equal(shouldAbortInFlightWalkAfterSummon(1), true);
    assert.equal(shouldAbortInFlightWalkAfterSummon(0), false);
  });
});

describe("remainingWalkOccupies", () => {
  it("treats remaining path tiles as reserved, not the live origin", () => {
    assert.equal(remainingWalkOccupies({ x: 7, y: 5 }, leftoverPath), true);
    assert.equal(remainingWalkOccupies({ x: 8, y: 5 }, leftoverPath), true);
    assert.equal(remainingWalkOccupies({ x: 5, y: 5 }, leftoverPath), false);
    assert.equal(remainingWalkOccupies({ x: 6, y: 4 }, leftoverPath), false);
  });
});

describe("leftoverWalkAfterSummonAbort", () => {
  it("clears leftover path so a dest-on-path summon is no longer reserved", () => {
    const dest = { x: 7, y: 5 };
    assert.equal(remainingWalkOccupies(dest, leftoverPath), true);
    const after = leftoverWalkAfterSummonAbort(leftoverPath);
    assert.deepEqual(after, []);
    assert.equal(shouldAbortInFlightWalkAfterSummon(after.length), false);
    assert.equal(remainingWalkOccupies(dest, after), false);
  });

  it("is a no-op when no leftover walk is in flight", () => {
    assert.deepEqual(leftoverWalkAfterSummonAbort([]), []);
  });
});
