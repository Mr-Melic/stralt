import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  decideDungeonChainPortal,
  dungeonChainCompletionBonus,
  restExitSpawnDepth,
  shouldArmDungeonChainOnRestExit,
  snapshotDungeonChain,
} from "./portalRules.ts";

describe("snapshotDungeonChain", () => {
  it("captures refs before cleanupMap zeroes them", () => {
    const refs = {
      dungeonChainActiveRef: { current: true },
      dungeonChainDepthRef: { current: 2 },
      dungeonChainMaxDepthRef: { current: 4 },
    };
    const snap = snapshotDungeonChain(refs);
    refs.dungeonChainActiveRef.current = false;
    refs.dungeonChainDepthRef.current = 0;
    refs.dungeonChainMaxDepthRef.current = 0;
    assert.deepEqual(snap, { active: true, depth: 2, maxDepth: 4 });
    assert.deepEqual(decideDungeonChainPortal(false, snap), {
      kind: "progress",
      nextDepth: 3,
    });
    assert.deepEqual(
      decideDungeonChainPortal(false, snapshotDungeonChain(refs)),
      { kind: "none" },
    );
  });
});

describe("decideDungeonChainPortal", () => {
  it("enters only from a dungeon-entry portal while no run is active", () => {
    assert.deepEqual(
      decideDungeonChainPortal(true, { active: false, depth: 0, maxDepth: 0 }),
      { kind: "enter" },
    );
    assert.deepEqual(
      decideDungeonChainPortal(false, {
        active: false,
        depth: 0,
        maxDepth: 0,
      }),
      { kind: "none" },
    );
  });

  it("progresses and completes from the live snapshot, not wiped zeros", () => {
    assert.deepEqual(
      decideDungeonChainPortal(false, { active: true, depth: 1, maxDepth: 4 }),
      { kind: "progress", nextDepth: 2 },
    );
    assert.deepEqual(
      decideDungeonChainPortal(false, { active: true, depth: 4, maxDepth: 4 }),
      { kind: "complete", bonus: dungeonChainCompletionBonus(4) },
    );
    assert.equal(dungeonChainCompletionBonus(4), 200);
  });
});

describe("rest-exit dungeon spawn", () => {
  it("re-arms the chain at depth 1 so generateEnemies is not called at 0", () => {
    assert.equal(shouldArmDungeonChainOnRestExit("dungeon"), true);
    assert.equal(restExitSpawnDepth("dungeon"), 1);
    assert.equal(shouldArmDungeonChainOnRestExit("normal"), false);
    assert.equal(restExitSpawnDepth("normal"), 0);
    assert.equal(shouldArmDungeonChainOnRestExit(undefined), false);
  });
});
