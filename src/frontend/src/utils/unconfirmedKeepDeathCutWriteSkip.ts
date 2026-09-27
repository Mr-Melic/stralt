/**
 * Seeded death-persist catch-commit plus a later one-shot transport-keep.
 *
 * Death `saveBattleStats` can fail after retries. Production catch-commits
 * the 20/40 cut onto the lock (so a later heal cannot persist the uncut
 * snapshot) and leaves `pbv_pending_death_penalty_*` unpaid. The canister
 * stays whole. `commit({ doka })` also clears `unconfirmedWalletCredit`.
 *
 * A later shrine/ground/dungeon-complete `applyRewards` keep then
 * `noteUnconfirmedCredit`s. `shouldSkipAbsoluteDokaWrite` is `live <=
 * committed`. After the catch-cut the lock is 120 while a stale
 * `getCallerDokaBalance` is still the pre-death 200 — strictly above the
 * lock — so leftover resolve *seeds 200* and clears the keep flag.
 * Recap heal honours the unpaid 80 against that stale 200 and
 * `saveBattleStats`-writes 110. Incoming-below-stored is applied; the
 * method never mints. The kept +50 pickup is gone.
 *
 * The same stale 200 hits `flushPendingDeathPenalty` (heal `beforeEach`)
 * first: `applyUnpaidDeathPenaltyToWrite` emits 120 and writes that over
 * canister 250.
 *
 * Chronology (heal after death-fail catch-commit then keep):
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. XP leftover 100.
 * 2. Lava death `saveBattleStats` rejects. Catch commits lock 120 / XP 80.
 *    Pending `preDoka=200` `afterDoka=120`. Canister still 200.
 * 3. Ground Doka `applyRewards` +50 then throws. Settle `keep`.
 *    `noteUnconfirmedCredit`. Canister 250. Lock stays 120.
 * 4. Recap heal `beforeEach` leftover flush fetches stale 200 and writes
 *    120. Pickup gone. If flush misses, leftover resolve seeds 200
 *    (`200 > 120`), honour unpaid 80, spend 10, write 110.
 *
 * Skip the unconfirmed absolute write / unpaid flush when live is still
 * at or below the unpaid pre-cut wallet. A later rise above `preDoka`
 * (250) seeds, then honour unpaid keeps the pickup (170, or 160 after a
 * 10 Doka heal).
 *
 * Keep-only (lock still 200) already skips `live <= committed`. Successful
 * death persist clears the marker, so this extra `preDoka` floor does not
 * run; stale live 120 <= lock 120 still skips via the original helper.
 *
 * Production hooks are `flushPendingDeathPenaltyThroughUnconfirmedKeep`
 * (beforeEach) and `resolveCommittedDokaAfterDeathCutKeep` (heal / shop
 * `saveBattleStats`). `WorldExploration.tsx`, `progressPersist.ts`, and
 * `deathPenalty.ts` are occupied by older persist PRs, so this PR does
 * not restack them. Tests reproduce the call site. Restack those two
 * sites onto these helpers after those PRs land.
 */

import {
  type FlushPendingDeathArgs,
  flushPendingDeathPenalty,
  readPendingDeathPenalty,
} from "./deathPenalty.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  type AbsoluteWritePersist,
  resolveCommittedDokaForAbsoluteWrite,
  shouldSkipAbsoluteDokaWrite,
} from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

function readWalletNumber(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export type DeathCutKeepWritePersist = AbsoluteWritePersist & {
  hasUnconfirmedWalletCredit?: () => boolean;
};

/**
 * `live <= committed` still covers keep-only. After a failed death catch
 * the lock is already the cut (120) while a stale replica is the uncut
 * pre (200), so also skip when live has not risen past `pending.preDoka`.
 */
export function shouldSkipUnconfirmedKeepAfterDeathCut(args: {
  unconfirmedWalletCredit: boolean;
  liveDoka: number | null;
  committedDoka: number;
  pendingPreDoka?: number | null;
}): boolean {
  if (
    shouldSkipAbsoluteDokaWrite({
      unconfirmedWalletCredit: args.unconfirmedWalletCredit,
      liveDoka: args.liveDoka,
      committedDoka: args.committedDoka,
    })
  ) {
    return true;
  }
  if (args.unconfirmedWalletCredit !== true) return false;
  if (args.liveDoka == null) return true;
  if (args.pendingPreDoka == null) return false;
  const live = toNat(args.liveDoka);
  const pre = toNat(args.pendingPreDoka);
  return live <= pre;
}

function refuseStaleUnconfirmedWrite(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

/**
 * Fetch-first when a keep flag sits on an unpaid death pre-cut. Original
 * `resolveCommittedDokaForAbsoluteWrite` would seed any live > lock —
 * including the stale pre-death 200 after catch-commit 120.
 *
 * A rise above `pendingPreDoka` seeds once (no second fetch). Otherwise
 * throw so heal/shop cannot `saveBattleStats`-wipe the kept pickup.
 */
export async function resolveCommittedDokaAfterDeathCutKeep(
  persist: DeathCutKeepWritePersist,
  readWallet: () => Promise<unknown>,
  pendingPreDoka: number | null,
): Promise<number | null> {
  const unconfirmed = persist.hasUnconfirmedWalletCredit?.() === true;
  if (!unconfirmed || pendingPreDoka == null) {
    return resolveCommittedDokaForAbsoluteWrite(persist, readWallet);
  }
  let live: number | null = null;
  try {
    live = readWalletNumber(await readWallet());
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
    ) {
      throw err;
    }
    refuseStaleUnconfirmedWrite();
  }
  if (
    shouldSkipUnconfirmedKeepAfterDeathCut({
      unconfirmedWalletCredit: true,
      liveDoka: live,
      committedDoka: persist.snapshot().doka,
      pendingPreDoka,
    })
  ) {
    refuseStaleUnconfirmedWrite();
  }
  if (live == null) refuseStaleUnconfirmedWrite();
  persist.seedWallet(live);
  return live;
}

export type DeathCutKeepFlushPersist = FlushPendingDeathArgs["persist"] & {
  snapshot: () => { doka: number };
  hasUnconfirmedWalletCredit?: () => boolean;
};

/**
 * Heal/shop `beforeEach` leftover flush used the stale pre-death wallet
 * as `fetchSnapshot` and wrote 120 over canister 250. Skip that write
 * while the keep flag is set and live has not risen past `preDoka`.
 * Leave the unpaid marker so a later fresh 250 still honours 20/40.
 */
export async function flushPendingDeathPenaltyThroughUnconfirmedKeep(
  args: Omit<FlushPendingDeathArgs, "persist"> & {
    persist: DeathCutKeepFlushPersist;
  },
): Promise<boolean> {
  const pending = readPendingDeathPenalty(args.storage, args.slot);
  if (!pending) return false;
  if (args.persist.hasUnconfirmedWalletCredit?.() === true) {
    const snap = await args.fetchSnapshot();
    if (
      !snap ||
      shouldSkipUnconfirmedKeepAfterDeathCut({
        unconfirmedWalletCredit: true,
        liveDoka: snap.doka,
        committedDoka: args.persist.snapshot().doka,
        pendingPreDoka: pending.preDoka,
      })
    ) {
      return false;
    }
  }
  return flushPendingDeathPenalty(args);
}
