import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  decideDungeonChainPortal,
  dungeonChainCompletionBonus,
  dungeonDokaMultiplierFor,
  resetRunState,
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

describe("dungeonDokaMultiplierFor", () => {
  it("is 1x outside a run and scales with live depth while active", () => {
    assert.equal(dungeonDokaMultiplierFor(false, 3), 1);
    assert.equal(dungeonDokaMultiplierFor(true, 0), 1);
    assert.equal(dungeonDokaMultiplierFor(true, 1), 1.5);
    assert.equal(dungeonDokaMultiplierFor(true, 3), 2.5);
    assert.equal(dungeonDokaMultiplierFor(true, 5), 4);
  });
});

describe("resetRunState", () => {
  it("clears dungeon React state so the HUD and multiplier cannot stick", () => {
    let active = true;
    let depth = 3;
    let maxDepth = 4;
    const refs = {
      bossRushActiveRef: { current: false },
      dungeonChainActiveRef: { current: true },
      dungeonChainDepthRef: { current: 3 },
      dungeonChainMaxDepthRef: { current: 4 },
      abortBossRush: async () => {},
      setDungeonChainActive: (next: boolean) => {
        active = next;
      },
      setDungeonChainDepth: (next: number) => {
        depth = next;
      },
      setDungeonChainMaxDepth: (next: number) => {
        maxDepth = next;
      },
    };
    resetRunState(refs);
    assert.equal(refs.dungeonChainActiveRef.current, false);
    assert.equal(refs.dungeonChainDepthRef.current, 0);
    assert.equal(refs.dungeonChainMaxDepthRef.current, 0);
    assert.equal(active, false);
    assert.equal(depth, 0);
    assert.equal(maxDepth, 0);
    assert.equal(dungeonDokaMultiplierFor(active, depth), 1);
  });
});
