import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  decideDungeonChainPortal,
  dungeonChainCompletionBonus,
  dungeonDokaMultiplierFor,
  filterRunPortals,
  isProgressionLocked,
  isProgressionPortalUnlocked,
  isRunProgressionPortal,
  placeWhitePortalAtSpawn,
  resetRunState,
  restExitSpawnDepth,
  shouldArmDungeonChainOnRestExit,
  shouldSpawnWhitePortal,
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

describe("resetRunState", () => {
  it("clears dungeon React state and the Doka multiplier after death", () => {
    let active = true;
    let depth = 4;
    let maxDepth = 5;
    const multiplier = { current: 3 };
    resetRunState({
      bossRushActiveRef: { current: false },
      dungeonChainActiveRef: { current: false },
      dungeonChainDepthRef: { current: 0 },
      dungeonChainMaxDepthRef: { current: 0 },
      abortBossRush: async () => {},
      setDungeonChainActive: (next) => {
        active = next;
      },
      setDungeonChainDepth: (next) => {
        depth = next;
      },
      setDungeonChainMaxDepth: (next) => {
        maxDepth = next;
      },
      dungeonDokaMultiplierRef: multiplier,
    });
    assert.equal(active, false);
    assert.equal(depth, 0);
    assert.equal(maxDepth, 0);
    assert.equal(multiplier.current, 1);
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

describe("placeWhitePortalAtSpawn", () => {
  it("relocates a (0,0) dungeon-complete portal onto the walkable spawn", () => {
    const pending = {
      x: 0,
      y: 0,
      color: "white" as const,
      isWhitePortal: true,
    };
    const atSpawn = placeWhitePortalAtSpawn(pending, { x: 8, y: 8 });
    assert.deepEqual(atSpawn, {
      x: 8,
      y: 8,
      color: "white",
      isWhitePortal: true,
    });
    assert.notEqual(atSpawn.x, 0);
    assert.notEqual(atSpawn.y, 0);
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

describe("progression lock and unlock", () => {
  it("suppresses non-progression portals inside a run until the map is clear", () => {
    assert.deepEqual(
      filterRunPortals({
        runMode: "dungeon",
        mapCleared: false,
        candidates: ["regular", "dungeonEntry", "progression"],
      }),
      [],
    );
    assert.deepEqual(
      filterRunPortals({
        runMode: "bossRush",
        mapCleared: true,
        candidates: ["regular", "progression"],
      }),
      ["progression"],
    );
  });

  it("treats an unmarked fallback portal as the run exit", () => {
    assert.equal(isRunProgressionPortal({ color: "blue" }, "bossRush"), true);
    assert.equal(
      isRunProgressionPortal(
        { isWhitePortal: true, color: "white" },
        "bossRush",
      ),
      false,
    );
    assert.equal(
      isRunProgressionPortal({ isProgressionPortal: true }, "none"),
      false,
    );
  });

  it("unlocks only after the last hostile dies inside a run", () => {
    assert.equal(isProgressionLocked("dungeon", false), true);
    assert.equal(isProgressionPortalUnlocked("dungeon", true), true);
    assert.equal(shouldSpawnWhitePortal(true, false), true);
    assert.equal(shouldSpawnWhitePortal(false, false), false);
  });
});
