/**
 * Ground-Doka feat counter policy (SDEG-2026-10-25-001 / 002).
 *
 * WorldExploration currently increments `groundDokaPickupCountRef` and writes
 * `*_pbv_ground_doka_pickups` before one-shot credit settle. On release the
 * pickup id is freed for a safe wallet retry, but the feat counter is not
 * rolled back — retries inflate `loot_10_doka`.
 *
 * Wire WX to call these helpers when that file is editable again. Do not
 * change applyRewards amounts or claim ids here.
 */

export type OneShotSettleKind = "commit" | "release" | "keep";

/**
 * Only a committed credit should advance the client-trusted loot counter.
 * `release` must not count (retry will try again). `keep` (transport after
 * invoke) must not count either — confirmKept may later commit the wallet
 * without re-entering the pickup site; counting here would desync from a
 * path that never marks the coin collected.
 */
export function shouldCountGroundDokaPickupForFeat(
  settle: OneShotSettleKind,
): boolean {
  return settle === "commit";
}

/**
 * Idle achievement effect: loot_10 must re-evaluate when the pickup counter
 * changes, not only when mapsVisited changes (mapsVisited-gated check delays
 * overworld unlocks until the next portal).
 */
export function shouldRecheckLoot10DokaFeat(args: {
  mapsVisitedChanged: boolean;
  groundDokaPickupsChanged: boolean;
  groundDokaPickups: number;
}): boolean {
  if (args.groundDokaPickups < 10) return false;
  return (
    args.mapsVisitedChanged === true || args.groundDokaPickupsChanged === true
  );
}

/** Clamp a persisted counter read; non-finite / negative → 0. */
export function readGroundDokaPickupCount(
  raw: string | null | undefined,
): number {
  const n = Number.parseInt(raw ?? "0", 10);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

export function nextGroundDokaPickupCount(current: number): number {
  return Math.max(0, Math.floor(Number(current) || 0)) + 1;
}
