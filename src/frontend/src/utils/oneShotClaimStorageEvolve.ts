/**
 * One-shot ground / shrine / dungeon-complete credit ids.
 *
 * dokaPersist helpers claim into an in-memory Set
 * (`claimedGroundLootIdsRef` in WorldExploration). Those ids are never
 * written to localStorage / sessionStorage, so APP_VERSION wipe does not
 * affect them. Remint risk is same-session remount or map regen that
 * rebuilds loot with `collected: false` while the Set was reset
 * (WorldExploration clears the Set when spawning loot).
 */

export type OneShotClaimStorage = "memory" | "localStorage";

export function oneShotClaimStorageKind(): OneShotClaimStorage {
  return "memory";
}

export function oneShotClaimSurvivesVersionWipe(): boolean {
  return false;
}

export function oneShotClaimSurvivesRemount(): boolean {
  return false;
}

export function oneShotClaimIsLocalStorageOnly(
  kind: OneShotClaimStorage = oneShotClaimStorageKind(),
): boolean {
  return kind === "localStorage";
}

/** Version wipe cannot remint via claim-id loss — the claim lives in RAM. */
export function versionWipeRemintsOneShotViaClaimLoss(
  kind: OneShotClaimStorage = oneShotClaimStorageKind(),
  survivesWipe = oneShotClaimSurvivesVersionWipe(),
): boolean {
  return kind === "localStorage" && survivesWipe === false;
}
