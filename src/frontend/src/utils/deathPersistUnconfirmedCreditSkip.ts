/**
 * Death persist writes a pre-credit pending marker before the unconfirmed
 * one-shot skip, then a later beforeEach flush applies that 20/40 and
 * wipes the grant.
 *
 * Seeded one-shot transport-keep (`noteUnconfirmedCredit`) leaves the
 * persist lock at the pre-credit wallet when confirm did not see a rise.
 * `resolveCommittedDokaForAbsoluteWrite` then throws
 * `ABSOLUTE_WRITE_UNCONFIRMED_CREDIT` when the live read is stale
 * (`live <= committed`). Recap heal already skips that write (#144bfc3a
 * `shouldSkipAbsoluteDokaWrite`).
 *
 * Death persist is different: `persistDeathPenalty` writes the pending
 * marker from the live (pre-credit) refs, then enqueues
 * `{ skipBeforeEach: true }` which calls `resolveCommittedDokaForAbsoluteWrite`
 * *after* the marker exists. The throw leaves that pre-credit 20/40
 * pending. The next heal / shop / applyRewards `beforeEach` flushes it
 * via `flushPendingDeathPenalty` — saveBattleStats of 60% of the
 * pre-credit wallet, wiping the canister grant the same way heal used to.
 *
 * Sequence: ground Doka one-shot transport-keep (lock 1000, canister may
 * be 1100, query stale 1000) → lava death → advertised skip the pending
 * write until a live read is strictly above the lock, then one 20/40 on
 * 1100 (= 660). Live leftover pending 1000→600, flush writes 600.
 *
 * Unique vs:
 * - **#1323** in-flight death pending flushed by a *prior* credit job's
 *   beforeEach, then death recuts 20/40 (double cut). This pass is the
 *   unconfirmed-credit throw *after* death already wrote pending.
 * - **#144bfc3a / `shouldSkipAbsoluteDokaWrite`** recap heal wipe after
 *   transport-keep (heal snapshot, not death 20/40 pending).
 * - **#653** unpaid replay on reload (canister still matches `pre`).
 *
 * Do not restack WorldExploration / progressPersist / deathPenalty.
 * Restack death persist onto
 * `shouldWritePendingDeathPenaltyBeforeUnconfirmedAbsoluteWrite` after
 * older persist PRs land. Do not change 20/40 rates (balance).
 */

import { computeDeathPenalty } from "./deathPenalty.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  shouldSkipAbsoluteDokaWrite,
} from "./progressPersist.ts";

export { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT };

/**
 * Live leftover — `persistDeathPenalty` writes the pending marker from
 * the live refs before the enqueue that may throw unconfirmed-credit.
 */
export function liveWxWritesPendingDeathBeforeUnconfirmedAbsoluteWrite(): boolean {
  return true;
}

/**
 * Live leftover — death enqueue skipBeforeEach does not skip the *later*
 * job's beforeEach flush of that pending marker.
 */
export function liveWxLaterCreditJobFlushesPreCreditDeathPending(): boolean {
  return true;
}

/**
 * Advertised: do not stamp a pre-credit 20/40 pending record when the
 * absolute write would skip/throw for unconfirmed one-shot credit.
 * Same stale-read rule as `shouldSkipAbsoluteDokaWrite`.
 */
export function shouldWritePendingDeathPenaltyBeforeUnconfirmedAbsoluteWrite(args: {
  unconfirmedWalletCredit: boolean;
  liveDoka: number | null;
  committedDoka: number;
}): boolean {
  return !shouldSkipAbsoluteDokaWrite(args);
}

export type UnconfirmedDeathCutTrace = {
  pendingAfter: number | null;
  flushedAfter: number | null;
  advertisedAfter: number | null;
};

/**
 * Ground-Doka transport-keep then lava death.
 *
 * `committedDoka` is the seeded lock (pre-credit). `liveQuery` is the
 * stale getCallerDokaBalance. `canisterDoka` is the grant that confirm
 * missed.
 */
export function simulateDeathAfterUnconfirmedOneShotCredit(args: {
  committedDoka: number;
  liveQuery: number;
  canisterDoka: number;
}): UnconfirmedDeathCutTrace {
  const committed = Math.max(0, Math.floor(Number(args.committedDoka) || 0));
  const liveQuery = Math.max(0, Math.floor(Number(args.liveQuery) || 0));
  const canister = Math.max(0, Math.floor(Number(args.canisterDoka) || 0));
  const skip = shouldSkipAbsoluteDokaWrite({
    unconfirmedWalletCredit: true,
    liveDoka: liveQuery,
    committedDoka: committed,
  });

  const livePending = liveWxWritesPendingDeathBeforeUnconfirmedAbsoluteWrite()
    ? computeDeathPenalty(0, committed).newDoka
    : null;
  const flushedAfter = skip
    ? livePending
    : computeDeathPenalty(0, liveQuery).newDoka;

  const advertisedWritesPending =
    shouldWritePendingDeathPenaltyBeforeUnconfirmedAbsoluteWrite({
      unconfirmedWalletCredit: true,
      liveDoka: liveQuery,
      committedDoka: committed,
    });
  const advertisedAfter = advertisedWritesPending
    ? computeDeathPenalty(0, liveQuery).newDoka
    : computeDeathPenalty(0, canister).newDoka;

  return {
    pendingAfter: livePending,
    flushedAfter,
    advertisedAfter,
  };
}
