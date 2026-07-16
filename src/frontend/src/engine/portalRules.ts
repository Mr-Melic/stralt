/**
 * engine/portalRules.ts
 *
 * Pure helpers that decide which portals may spawn on a generated map while a
 * dungeon or boss-rush run is active. Keeping this logic in a single pure
 * module lets WorldExploration.tsx call one function instead of scattering
 * mode checks across the map-generation / portal-spawn code.
 *
 * Section 2 — Dungeon & Boss Rush Run Integrity:
 *  - While a run is active, maps contain ONLY the run's progression portal.
 *  - No regular/colored portals, no dungeon-entry portals, no boss-rush-entry
 *    portals, no death-realm portals.
 */

/** Coarse portal kind identifiers used by the spawn code. */
export type PortalKind =
  | "regular"
  | "dungeonEntry"
  | "bossRushEntry"
  | "deathRealm"
  | "progression"
  | "white";

/** Run mode the player is currently inside (if any). */
export type RunMode = "none" | "dungeon" | "bossRush";

/**
 * Inputs the spawn code already has at the point it decides which portals to
 * generate. Kept intentionally small so the helper stays pure and testable.
 */
export interface PortalFilterInput {
  /** Active run mode; "none" means free exploration. */
  runMode: RunMode;
  /**
   * Whether every enemy on the current run map has been defeated. The
   * progression portal is only usable (and only spawned) when this is true.
   */
  mapCleared: boolean;
  /** The full set of portals the map generator proposed for this map. */
  candidates: PortalKind[];
}

/**
 * Decide the final portal set for a generated map.
 *
 * Rules:
 *  - Free exploration (runMode === "none"): pass candidates through unchanged.
 *  - Active run: keep ONLY the progression portal, and only when the map is
 *    cleared. While the map is not yet cleared, return an empty list so no
 *    portal spawns at all (the way forward is locked until the last enemy
 *    dies).
 */
export function filterRunPortals(input: PortalFilterInput): PortalKind[] {
  const { runMode, mapCleared, candidates } = input;

  if (runMode === "none") {
    return candidates;
  }

  // Inside a dungeon or boss-rush run: suppress every non-progression portal.
  if (!mapCleared) {
    return [];
  }

  return candidates.includes("progression") ? ["progression"] : [];
}

/**
 * Convenience predicate: should a portal of `kind` be suppressed right now?
 * Useful for the spawn loop when it builds portals one at a time.
 */
export function shouldSuppressPortal(
  kind: PortalKind,
  runMode: RunMode,
  mapCleared: boolean,
): boolean {
  if (runMode === "none") return false;
  if (kind === "progression") return !mapCleared;
  return true;
}

/**
 * Whether the progression portal should render in its locked (dimmed) style.
 * Inside a run we still want to *show* the locked progression portal even
 * before the map is cleared, so the player understands the goal — but it must
 * not be usable. The spawn code can use this to pick the locked visual.
 */
export function isProgressionLocked(
  runMode: RunMode,
  mapCleared: boolean,
): boolean {
  return runMode !== "none" && !mapCleared;
}

/**
 * Derive the current run mode from the two active-run flags. Boss rush takes
 * priority over the dungeon chain (the two are mutually exclusive in practice,
 * but the precedence is explicit here). Returns "none" during free exploration.
 */
export function getRunMode(
  bossRushActive: boolean,
  dungeonChainActive: boolean,
): RunMode {
  if (bossRushActive) return "bossRush";
  if (dungeonChainActive) return "dungeon";
  return "none";
}

/** Shape of the run-state refs the reset helper touches. */
export interface RunStateRefs {
  bossRushActiveRef: { current: boolean };
  dungeonChainActiveRef: { current: boolean };
  dungeonChainDepthRef: { current: number };
  dungeonChainMaxDepthRef: { current: number };
  /** Aborts an in-progress boss rush (no-op when no rush is active). */
  abortBossRush: () => Promise<void>;
}

/**
 * Reset every piece of run state before a flow that must see free-exploration
 * mode (e.g. the player-death → Death Realm transition). Clears the boss-rush
 * flag and aborts the rush, then clears the dungeon-chain flag and zeroes its
 * depth/max-depth counters. Safe to call when no run is active.
 */
export function resetRunState(refs: RunStateRefs): void {
  if (refs.bossRushActiveRef.current) {
    refs.bossRushActiveRef.current = false;
    void refs.abortBossRush();
  }
  if (refs.dungeonChainActiveRef.current) {
    refs.dungeonChainActiveRef.current = false;
    refs.dungeonChainDepthRef.current = 0;
    refs.dungeonChainMaxDepthRef.current = 0;
  }
}

/**
 * Complete a run successfully (player cleared the final boss-rush room or the
 * last dungeon-chain depth). This is the NON-penalty counterpart to the
 * death-flow reset: it reuses `resetRunState` to clear the boss-rush flag,
 * abort the rush, and zero the dungeon-chain flag/depth/max-depth counters —
 * but it does NOT apply the death penalty (XP 20% / Doka 40%). Rewards earned
 * during the run stay with the player. After this call the world is back in
 * free-exploration mode so the next map can generate normally.
 *
 * Flags reset (delegated to resetRunState):
 *  - bossRushActiveRef → false (and abortBossRush() invoked)
 *  - dungeonChainActiveRef → false
 *  - dungeonChainDepthRef → 0
 *  - dungeonChainMaxDepthRef → 0
 */
export function completeRun(refs: RunStateRefs): void {
  resetRunState(refs);
}

/**
 * Whether a white "sanctuary" portal should spawn on the just-cleared run map.
 * A white portal leads the player back to the rest map (safe zone) after a
 * successful run completion. Returns true only when the run that just ended
 * was actually completed (not aborted, not fled, not still in progress).
 *
 * @param bossRushComplete  true when the final boss-rush room was cleared
 * @param dungeonComplete   true when the final dungeon-chain depth was cleared
 */
export function shouldSpawnWhitePortal(
  bossRushComplete: boolean,
  dungeonComplete: boolean,
): boolean {
  return bossRushComplete || dungeonComplete;
}
