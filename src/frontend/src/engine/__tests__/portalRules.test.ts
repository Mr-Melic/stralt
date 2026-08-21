import { describe, expect, it, vi } from "vitest";
import {
  PROGRESSION_PORTAL_KIND,
  type RunStateRefs,
  completeRun,
  filterRunPortals,
  getRunMode,
  isProgressionLocked,
  isProgressionPortalUnlocked,
  resetRunState,
  shouldSpawnWhitePortal,
  shouldSuppressPortal,
} from "../portalRules";

function makeRefs(opts?: {
  bossRush?: boolean;
  dungeon?: boolean;
}): RunStateRefs {
  return {
    bossRushActiveRef: { current: opts?.bossRush ?? false },
    dungeonChainActiveRef: { current: opts?.dungeon ?? false },
    dungeonChainDepthRef: { current: opts?.dungeon ? 3 : 0 },
    dungeonChainMaxDepthRef: { current: opts?.dungeon ? 5 : 0 },
    abortBossRush: vi.fn(async () => undefined),
  };
}

describe("filterRunPortals", () => {
  const mixed = [
    "regular",
    "dungeonEntry",
    "progression",
    "deathRealm",
    "white",
  ] as const;

  it("passes candidates through during free exploration", () => {
    expect(
      filterRunPortals({
        runMode: "none",
        mapCleared: false,
        candidates: [...mixed],
      }),
    ).toEqual([...mixed]);
  });

  it("suppresses every portal while a run map is not cleared", () => {
    expect(
      filterRunPortals({
        runMode: "dungeon",
        mapCleared: false,
        candidates: [...mixed],
      }),
    ).toEqual([]);
    expect(
      filterRunPortals({
        runMode: "bossRush",
        mapCleared: false,
        candidates: [...mixed],
      }),
    ).toEqual([]);
  });

  it("keeps only the progression portal after a run map is cleared", () => {
    expect(
      filterRunPortals({
        runMode: "dungeon",
        mapCleared: true,
        candidates: [...mixed],
      }),
    ).toEqual([PROGRESSION_PORTAL_KIND]);
    expect(
      filterRunPortals({
        runMode: "bossRush",
        mapCleared: true,
        candidates: ["regular", "white"],
      }),
    ).toEqual([]);
  });
});

describe("shouldSuppressPortal / progression lock", () => {
  it("never suppresses portals in free exploration", () => {
    expect(shouldSuppressPortal("regular", "none", false)).toBe(false);
    expect(shouldSuppressPortal("progression", "none", false)).toBe(false);
  });

  it("locks the progression portal until the run map is cleared", () => {
    expect(shouldSuppressPortal("progression", "dungeon", false)).toBe(true);
    expect(shouldSuppressPortal("progression", "dungeon", true)).toBe(false);
    expect(shouldSuppressPortal("regular", "dungeon", true)).toBe(true);
    expect(isProgressionLocked("bossRush", false)).toBe(true);
    expect(isProgressionLocked("bossRush", true)).toBe(false);
    expect(isProgressionLocked("none", false)).toBe(false);
    expect(isProgressionPortalUnlocked("dungeon", true)).toBe(true);
    expect(isProgressionPortalUnlocked("none", true)).toBe(false);
    expect(isProgressionPortalUnlocked("bossRush", false)).toBe(false);
  });
});

describe("getRunMode and run-state reset", () => {
  it("gives boss rush priority over dungeon", () => {
    expect(getRunMode(true, true)).toBe("bossRush");
    expect(getRunMode(false, true)).toBe("dungeon");
    expect(getRunMode(false, false)).toBe("none");
  });

  it("clears run flags and aborts an active boss rush", () => {
    const refs = makeRefs({ bossRush: true, dungeon: true });
    resetRunState(refs);
    expect(refs.bossRushActiveRef.current).toBe(false);
    expect(refs.dungeonChainActiveRef.current).toBe(false);
    expect(refs.dungeonChainDepthRef.current).toBe(0);
    expect(refs.dungeonChainMaxDepthRef.current).toBe(0);
    expect(refs.abortBossRush).toHaveBeenCalledTimes(1);
  });

  it("completeRun reuses the same reset without applying a death penalty", () => {
    const refs = makeRefs({ dungeon: true });
    completeRun(refs);
    expect(refs.dungeonChainActiveRef.current).toBe(false);
    expect(refs.abortBossRush).not.toHaveBeenCalled();
  });

  it("spawns a white portal only after a completed run", () => {
    expect(shouldSpawnWhitePortal(false, false)).toBe(false);
    expect(shouldSpawnWhitePortal(true, false)).toBe(true);
    expect(shouldSpawnWhitePortal(false, true)).toBe(true);
  });
});
