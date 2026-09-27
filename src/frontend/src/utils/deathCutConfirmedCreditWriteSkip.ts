/**
 * Seeded death-persist catch-commit plus a later *confirmed* Doka credit.
 *
 * Death `saveBattleStats` can fail after retries. Production catch-commits
 * the 20/40 cut onto the lock (so a later heal cannot persist the uncut
 * snapshot) and leaves `pbv_pending_death_penalty_*` unpaid. The canister
 * stays whole. `commit({ doka })` also clears `unconfirmedWalletCredit`.
 *
 * #698 covers the follow-up *keep* (throw-after-add, unconfirmed, lock
 * stays 120). This file covers the follow-up *success*: shrine/ground/
 * dungeon-complete `settle` commit, victory / Boss Rush `applyRewards`
 * `newDoka`, feat `#ok`, or GameKey `#ok`. Those write doka onto the lock
 * and leave unconfirmed false, so leftover `resolveCommittedDoka` returns
 * the lock immediately and leftover `flushPendingDeathPenalty` treats a
 * stale pre-death 200 as the unpaid `pre` snapshot.
 *
 * Chronology (heal after death-fail catch-commit then a confirmed credit):
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200.
 * 2. Lava death `saveBattleStats` rejects. Catch commits lock 120 / XP 80.
 *    Pending `preDoka=200` `afterDoka=120`. Canister still 200.
 * 3. Confirmed credit lands. Examples:
 *    - Ground Doka `applyRewards` +50 `#ok`. Settle commit 250. Canister 250.
 *    - Feat `#ok(100)`. Lock 220. Canister 300.
 *    - GameKey `#ok(1000)`. Lock 1120. Canister 1200.
 *    - Victory `newDoka` 280. Lock 280. Canister 280.
 * 4. Recap heal `beforeEach` leftover flush fetches stale 200 and writes
 *    **120**, wiping the credit. If flush misses, leftover feat/GameKey
 *    resolve returns the cut-plus-grant lock (220 / 1120) with no fetch;
 *    honour unpaid then `saveBattleStats`-writes **130** / **1030**.
 *
 * Skip the unpaid flush / absolute write while live is still at or below
 * the unpaid pre-cut wallet *and* the lock already moved past `afterDoka`
 * (a later credit committed). A later rise above `preDoka` (250 / 300 /
 * 1200 / 280) seeds, then honour unpaid keeps the credit.
 *
 * Death-fail without a later credit (lock still 120) must still flush 200
 * → 120. Keep-only (#698) leaves lock at `afterDoka`; this helper does
 * not extra-skip that hole.
 *
 * Production hooks are `flushPendingDeathPenaltyThroughDeathCutCredit`
 * (beforeEach) and `resolveCommittedDokaAfterDeathCutCredit` (heal / shop
 * `saveBattleStats`). `WorldExploration.tsx`, `progressPersist.ts`,
 * `deathPenalty.ts`, `dokaPersist.ts`, `achievementReward.ts`, and
 * `shopPurchase.ts` are occupied by older persist PRs, so this PR does
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
} from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

function readWalletNumber(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export type DeathCutCreditWritePersist = AbsoluteWritePersist & {
  snapshot: () => { doka: number };
};

/**
 * Later confirmed credit moved the lock past the catch-cut. A stale
 * replica still sitting at (or below) unpaid `preDoka` must not flush
 * `afterDoka` over the credited canister.
 */
export function shouldSkipDeathCutConfirmedCreditWrite(args: {
  liveDoka: number | null;
  committedDoka: number;
  pendingPreDoka?: number | null;
  pendingAfterDoka?: number | null;
}): boolean {
  if (args.pendingPreDoka == null || args.pendingAfterDoka == null) {
    return false;
  }
  const committed = toNat(args.committedDoka);
  const after = toNat(args.pendingAfterDoka);
  if (committed <= after) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) <= toNat(args.pendingPreDoka);
}

function refuseStaleDeathCutCreditWrite(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

/**
 * Fetch-first when an unpaid death cut sits under a later confirmed Doka
 * commit. Original `resolveCommittedDokaForAbsoluteWrite` returns the lock
 * immediately once seeded and unconfirmed is clear — including feat/GameKey
 * `snapshot+grant` (220 / 1120) — so leftover honour unpaid double-cuts.
 *
 * A rise above `pendingPreDoka` seeds once. Otherwise throw so heal/shop
 * cannot `saveBattleStats`-wipe the credit.
 */
export async function resolveCommittedDokaAfterDeathCutCredit(
  persist: DeathCutCreditWritePersist,
  readWallet: () => Promise<unknown>,
  pendingPreDoka: number | null,
  pendingAfterDoka: number | null,
): Promise<number | null> {
  if (
    pendingPreDoka == null ||
    pendingAfterDoka == null ||
    toNat(persist.snapshot().doka) <= toNat(pendingAfterDoka)
  ) {
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
    refuseStaleDeathCutCreditWrite();
  }
  if (
    shouldSkipDeathCutConfirmedCreditWrite({
      liveDoka: live,
      committedDoka: persist.snapshot().doka,
      pendingPreDoka,
      pendingAfterDoka,
    })
  ) {
    refuseStaleDeathCutCreditWrite();
  }
  if (live == null) refuseStaleDeathCutCreditWrite();
  persist.seedWallet(live);
  return live;
}

export type DeathCutCreditFlushPersist = FlushPendingDeathArgs["persist"] & {
  snapshot: () => { doka: number };
};

/**
 * Heal/shop `beforeEach` leftover flush used the stale pre-death wallet
 * as `fetchSnapshot` and wrote 120 over the credited canister. Skip that
 * write while the lock already moved past `afterDoka` and live has not
 * risen past `preDoka`. Leave the unpaid marker so a later fresh snapshot
 * still honours 20/40 on top of the credit.
 */
export async function flushPendingDeathPenaltyThroughDeathCutCredit(
  args: Omit<FlushPendingDeathArgs, "persist"> & {
    persist: DeathCutCreditFlushPersist;
  },
): Promise<boolean> {
  const pending = readPendingDeathPenalty(args.storage, args.slot);
  if (!pending) return false;
  if (toNat(args.persist.snapshot().doka) > toNat(pending.afterDoka)) {
    const snap = await args.fetchSnapshot();
    if (
      !snap ||
      shouldSkipDeathCutConfirmedCreditWrite({
        liveDoka: snap.doka,
        committedDoka: args.persist.snapshot().doka,
        pendingPreDoka: pending.preDoka,
        pendingAfterDoka: pending.afterDoka,
      })
    ) {
      return false;
    }
  }
  return flushPendingDeathPenalty(args);
}
