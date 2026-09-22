/**
 * skipBeforeEach death persist vs beforeEach flush.
 *
 * skipBeforeEach exists so the death job does not flush *itself* and then
 * computeDeathPenalty on the already-cut lock (progressPersist.ts). That
 * does not cover a *different* queued job:
 *
 * Chronology:
 * 1. Recap shop/heal enqueues saveBattleStats (pointer-events: none).
 * 2. Lava death writes pending 20/40 and enqueues skipBeforeEach death save.
 * 3. Heal runs first: beforeEach flushPendingDeathPenalty writes the cut,
 *    commits the lock, and clears the marker.
 * 4. Death job used to computeDeathPenalty on the already-cut lock — a
 *    second 20/40 (XP 80→64, Doka 120→72).
 *
 * Skip the queued cut when flush already honoured the marker. Still cut
 * when the pending 20/40 is unpaid. Lives beside deathPenalty.ts so older
 * persist PRs (#385 owner-key, #356 XP keep) can merge that file.
 */

import {
  type PendingDeathPenalty,
  applyUnpaidDeathPenaltyToWrite,
  computeDeathPenalty,
} from "./deathPenalty.ts";

function floorNat(n: number): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

/**
 * Flush already wrote the 20/40 (marker gone / cutConfirmed) or the lock
 * already absorbed the unpaid loss. A second computeDeathPenalty would
 * recut.
 */
export function shouldSkipQueuedDeathPenaltyCut(args: {
  pending: PendingDeathPenalty | null | undefined;
  lockXp: number;
  lockDoka: number;
}): boolean {
  const pending = args.pending;
  if (pending == null) return true;
  if (pending.cutConfirmed === true) return true;
  const lockXp = floorNat(args.lockXp);
  const lockDoka = floorNat(args.lockDoka);
  const honoured = applyUnpaidDeathPenaltyToWrite(pending, lockXp, lockDoka);
  return honoured.xp === lockXp && honoured.doka === lockDoka;
}

/**
 * Cut the persist-lock snapshot for the skipBeforeEach death job.
 * Null means flush already honoured — do not saveBattleStats a second 20/40.
 */
export function queuedDeathPenaltyCut(args: {
  pending: PendingDeathPenalty | null | undefined;
  lockXp: number;
  lockDoka: number;
}): ReturnType<typeof computeDeathPenalty> | null {
  if (shouldSkipQueuedDeathPenaltyCut(args)) return null;
  return computeDeathPenalty(args.lockXp, args.lockDoka);
}
