import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  playerFacingWalkReject,
  spawnWalkRejectFloat,
} from "./walkRejectCopy.ts";

describe("playerFacingWalkReject", () => {
  it("maps each walk reject to short player copy", () => {
    assert.equal(playerFacingWalkReject("no_mp"), "No MP");
    assert.equal(playerFacingWalkReject("blocked"), "Can't walk there");
    assert.equal(playerFacingWalkReject("cant_reach"), "Can't reach");
    assert.equal(playerFacingWalkReject("not_enough_mp"), "Not enough MP");
  });
});

describe("spawnWalkRejectFloat", () => {
  it("spawns the mapped copy at the given screen point", () => {
    const calls: Array<{ x: number; y: number; text: string }> = [];
    spawnWalkRejectFloat(
      {
        spawnFloatText: (x, y, text) => {
          calls.push({ x, y, text });
        },
      },
      { x: 40, y: 80 },
      "cant_reach",
    );
    assert.deepEqual(calls, [{ x: 40, y: 80, text: "Can't reach" }]);
  });

  it("no-ops when the effects manager is missing", () => {
    assert.doesNotThrow(() =>
      spawnWalkRejectFloat(null, { x: 1, y: 1 }, "no_mp"),
    );
    assert.doesNotThrow(() =>
      spawnWalkRejectFloat(undefined, { x: 1, y: 1 }, "blocked"),
    );
  });
});
