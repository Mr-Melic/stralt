import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  classifyWalkReject,
  playerFacingWalkReject,
} from "./walkRejectCopy.ts";

describe("playerFacingWalkReject", () => {
  it("uses short carved-stone walk copy", () => {
    assert.equal(playerFacingWalkReject("no_mp"), "No MP");
    assert.equal(playerFacingWalkReject("not_enough_mp"), "Not enough MP");
    assert.equal(playerFacingWalkReject("blocked"), "Can't reach");
    assert.equal(playerFacingWalkReject("unreachable"), "Can't reach");
  });
});

describe("classifyWalkReject", () => {
  it("explains 0 MP before reachability", () => {
    assert.equal(
      classifyWalkReject({
        currentMp: 0,
        isBlocked: false,
        reachable: true,
        pathLength: 2,
      }),
      "no_mp",
    );
  });

  it("treats walls and void as blocked", () => {
    assert.equal(
      classifyWalkReject({
        currentMp: 4,
        isBlocked: true,
        reachable: false,
        pathLength: 0,
      }),
      "blocked",
    );
  });

  it("rejects tiles outside the MP BFS or with no path", () => {
    assert.equal(
      classifyWalkReject({
        currentMp: 4,
        isBlocked: false,
        reachable: false,
        pathLength: 0,
      }),
      "unreachable",
    );
    assert.equal(
      classifyWalkReject({
        currentMp: 4,
        isBlocked: false,
        reachable: true,
        pathLength: 0,
      }),
      "unreachable",
    );
  });

  it("rejects a path longer than remaining MP", () => {
    assert.equal(
      classifyWalkReject({
        currentMp: 2,
        isBlocked: false,
        reachable: true,
        pathLength: 3,
      }),
      "not_enough_mp",
    );
  });

  it("allows a legal walk", () => {
    assert.equal(
      classifyWalkReject({
        currentMp: 3,
        isBlocked: false,
        reachable: true,
        pathLength: 3,
      }),
      null,
    );
  });
});
