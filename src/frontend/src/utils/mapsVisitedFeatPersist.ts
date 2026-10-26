/**
 * Explorer feat persist (SDEG-2026-10-26-001).
 *
 * WorldExploration increments `mapsVisitedCountRef` and writes
 * `${userId}_slotN_pbv_maps_visited_count` on every portal/map apply,
 * including Death Realm and Rest Area. `explore_25_maps` ("Visit 25
 * different maps") reads that scalar. Procedural maps have no stable id,
 * so a later unique-map set cannot be recovered from the counter.
 *
 * Wire WX when that file is editable. Do not add required Character map-id
 * fields until a later chain file after 20260901.
 */

export const EXPLORE_25_MAPS_CONDITION = "explore_25_maps";
export const EXPLORE_25_MAPS_THRESHOLD = 25;

export function mapsVisitedStorageKey(userId: string, slot: number): string {
  const owner = (userId ?? "").trim() || "guest";
  const n = Number.isFinite(slot) ? Math.floor(slot) : 0;
  return `${owner}_slot${n}_pbv_maps_visited_count`;
}

/** HEAD persist is a portal-transition counter, not a set of map ids. */
export function explore25ProgressIsUniqueMapIdSet(): boolean {
  return false;
}

/** A counter cannot be expanded into which maps a six-month-old player visited. */
export function uniqueMapIdsCannotBeRecoveredFromVisitCounter(): boolean {
  return true;
}

/**
 * Death Realm / Rest Area are not overworld exploration. Counting them
 * toward Explorer inflates a feat whose copy says "different maps".
 * Revisits cannot be detected until maps have stable ids.
 */
export function shouldCountPortalTransitionTowardExplore25(args: {
  isDeathRealm: boolean;
  isRestArea: boolean;
}): boolean {
  return args.isDeathRealm !== true && args.isRestArea !== true;
}

export function readMapsVisitedCount(raw: string | null | undefined): number {
  const n = Number.parseInt(raw ?? "0", 10);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

export function explore25ConditionMet(mapsVisited: number): boolean {
  return mapsVisited >= EXPLORE_25_MAPS_THRESHOLD;
}
