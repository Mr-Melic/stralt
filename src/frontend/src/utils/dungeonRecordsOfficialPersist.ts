/**
 * Official dungeon-chain progress is session refs (`snapshotDungeonChain` in
 * portalRules.ts), not canister `dungeonRecords`.
 *
 * updateDungeonProgress / getDungeonRecord / resetDungeonChain have no
 * official UI callers (bindgen + mocks only). A player who ran a dungeon
 * yesterday loses depth on reload. SDEG-007 (idempotent Principal-keyed
 * +1 maps) still applies to the raw-client / future-wire surface; it is
 * not live player history on this HEAD.
 *
 * Distinct from SDEG-007 (writer idempotency) and 09-27-002 (canister
 * leftovers if anything did write). No schema. Do not edit main.mo / WX
 * while older persist PRs queue.
 */

import { MAX_DUNGEON_DEPTH, clampDungeonDepth } from "./adminSafety.ts";

export function officialClientWritesDungeonRecords(): boolean {
  return false;
}

export function liveDungeonChainIsSessionRefs(): boolean {
  return true;
}

/** Missing dungeonRecords row → getDungeonRecord null. */
export function missingDungeonRecordReadsAsNull(): boolean {
  return true;
}

/**
 * Official play keeps depth only in WorldExploration refs. Reload / new
 * device / APP_VERSION wipe cannot restore it from the canister.
 */
export function officialReloadWouldKeepDungeonDepth(): boolean {
  return false;
}

/** Canister map is Principal-keyed and is not cleared by deleteCharacter. */
export function dungeonRecordsSurviveCharacterDelete(): boolean {
  return true;
}

export function dungeonDepthIsCappedAt16(depth: number): boolean {
  return (
    clampDungeonDepth(depth) ===
    Math.min(Math.max(0, Math.floor(depth)), MAX_DUNGEON_DEPTH)
  );
}

/** Live session chain is lost; do not treat a null canister row as “never entered”. */
export function nullCanisterRowMeansOfficialNeverPersisted(): boolean {
  return (
    officialClientWritesDungeonRecords() === false &&
    missingDungeonRecordReadsAsNull() &&
    officialReloadWouldKeepDungeonDepth() === false
  );
}
