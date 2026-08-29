import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  decideDungeonChainPortal,
  dungeonChainCompletionBonus,
  filterRunPortals,
  getRunMode,
  isProgressionLocked,
  isProgressionPortalUnlocked,
  shouldSpawnWhitePortal,
  shouldSuppressPortal,
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

describe("filterRunPortals", () => {
  const mixed = [
    "regular",
    "dungeonEntry",
    "bossRushEntry",
    "deathRealm",
    "progression",
    "white",
  ] as const;

  it("passes candidates through during free exploration", () => {
    assert.deepEqual(
      filterRunPortals({
        runMode: "none",
        mapCleared: false,
        candidates: [...mixed],
      }),
      [...mixed],
    );
    assert.equal(shouldSuppressPortal("dungeonEntry", "none", false), false);
    assert.equal(getRunMode(false, false), "none");
  });

  it("hides every portal until a dungeon or boss-rush map is cleared", () => {
    assert.deepEqual(
      filterRunPortals({
        runMode: "dungeon",
        mapCleared: false,
        candidates: [...mixed],
      }),
      [],
    );
    assert.equal(shouldSuppressPortal("progression", "dungeon", false), true);
    assert.equal(shouldSuppressPortal("regular", "dungeon", true), true);
    assert.equal(isProgressionLocked("dungeon", false), true);
    assert.equal(isProgressionPortalUnlocked("dungeon", false), false);
  });

  it("keeps only the progression portal after a run map is cleared", () => {
    assert.deepEqual(
      filterRunPortals({
        runMode: "bossRush",
        mapCleared: true,
        candidates: [...mixed],
      }),
      ["progression"],
    );
    assert.equal(shouldSuppressPortal("progression", "bossRush", true), false);
    assert.equal(isProgressionPortalUnlocked("bossRush", true), true);
    assert.equal(getRunMode(true, true), "bossRush");
    assert.equal(shouldSpawnWhitePortal(true, false), true);
    assert.equal(shouldSpawnWhitePortal(false, false), false);
  });
});
