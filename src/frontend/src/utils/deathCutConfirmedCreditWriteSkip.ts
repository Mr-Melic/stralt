/**
 * Seeded death-persist catch-commit plus a later *confirmed* lock move.
 *
 * Death `saveBattleStats` can fail after retries. Production catch-commits
 * the 20/40 cut onto the lock (so a later heal cannot persist the uncut
 * snapshot) and leaves `pbv_pending_death_penalty_*` unpaid. The canister
 * stays whole. `commit({ doka })` also clears `unconfirmedWalletCredit`.
 *
 * #698 covers the follow-up *keep* (throw-after-add, unconfirmed, lock
 * stays 120). This file covers the follow-up *success* that moves the
 * lock off `afterDoka` / `afterXp`:
 * - shrine/ground/dungeon-complete `settle` commit
 * - victory / Boss Rush `applyRewards` `newDoka`
 * - feat `#ok` / GameKey `#ok`
 * - portal `persistIncrementalRewards(0, 10)` (Doka-neutral XP credit)
 * - `upgradeSpell` / rename confirmed spend (lock drops below `afterDoka`)
 *
 * Those leave unconfirmed false, so leftover `resolveCommittedDoka`
 * returns the lock immediately and leftover `flushPendingDeathPenalty`
 * treats a stale pre-death 200/100 as the unpaid `pre` snapshot.
 *
 * Chronology (heal after death-fail catch-commit then a confirmed credit):
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200.
 * 2. Lava death `saveBattleStats` rejects. Catch commits lock 120 / XP 80.
 *    Pending `preDoka=200` `afterDoka=120`. Canister still 200.
 * 3. Confirmed mutation lands. Examples:
 *    - Ground Doka `applyRewards` +50 `#ok`. Settle commit 250. Canister 250.
 *    - Feat `#ok(100)`. Lock 220. Canister 300.
 *    - GameKey `#ok(1000)`. Lock 1120. Canister 1200.
 *    - Victory `newDoka` 280. Lock 280. Canister 280.
 *    - White-portal +10 XP. Lock XP 110 / Doka 120. Canister XP 110.
 *    - `upgradeSpell` advertised 10. Lock 110. Canister 190.
 * 4. Recap heal `beforeEach` leftover flush fetches stale 200/100 and
 *    writes **120/80**, wiping the credit, the portal +10, or refunding
 *    the upgrade. If flush misses, leftover feat/GameKey resolve returns
 *    the cut-plus-grant lock (220 / 1120) with no fetch; honour unpaid
 *    then `saveBattleStats`-writes **130** / **1030**.
 *
 * Skip the unpaid flush / absolute write while the lock already moved
 * off the catch-cut *and* live still looks like the unpaid pre-cut
 * replica (credit: live ≤ pre; spend: live ≥ pre). A later rise above
 * `preDoka` (250 / 300 / 1200 / 280) or a fresh post-spend 190 seeds,
 * then honour unpaid keeps the mutation.
 *
 * Death-fail without a later mutation (lock still 120/80) must still
 * flush 200 → 120. Keep-only (#698) leaves lock at `afterDoka`; this
 * helper does not extra-skip that hole.
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
 * Later confirmed mutation moved the lock off the catch-cut. A stale
 * replica still sitting at unpaid `pre` must not flush `after` over the
 * credited / spent canister.
 *
 * Credit (settle / feat / GameKey / victory / portal XP): lock rose past
 * `after` while live is still ≤ `pre`.
 * Spend (`upgradeSpell` / rename): lock dropped below `after` while live
 * is still ≥ `pre` (uncut replica). A fresh post-spend 190 is < `pre` and
 * must still flush so honour unpaid can land on top of the debit.
 */
export function shouldSkipDeathCutConfirmedCreditWrite(args: {
  liveDoka: number | null;
  committedDoka: number;
  pendingPreDoka?: number | null;
  pendingAfterDoka?: number | null;
  liveXp?: number | null;
  committedXp?: number | null;
  pendingPreXp?: number | null;
  pendingAfterXp?: number | null;
}): boolean {
  if (args.pendingPreDoka != null && args.pendingAfterDoka != null) {
    const committed = toNat(args.committedDoka);
    const after = toNat(args.pendingAfterDoka);
    const pre = toNat(args.pendingPreDoka);
    if (committed > after) {
      if (args.liveDoka == null) return true;
      if (toNat(args.liveDoka) <= pre) return true;
    } else if (committed < after) {
      if (args.liveDoka == null) return true;
      if (toNat(args.liveDoka) >= pre) return true;
    }
  }
  if (
    args.pendingPreXp != null &&
    args.pendingAfterXp != null &&
    args.committedXp != null
  ) {
    const committed = toNat(args.committedXp);
    const after = toNat(args.pendingAfterXp);
    const pre = toNat(args.pendingPreXp);
    if (committed > after) {
      if (args.liveXp == null) return true;
      if (toNat(args.liveXp) <= pre) return true;
    }
  }
  return false;
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
  snapshot: () => { doka: number; xp: number };
};

/**
 * Heal/shop `beforeEach` leftover flush used the stale pre-death wallet
 * as `fetchSnapshot` and wrote 120/80 over the credited or spent canister.
 * Skip that write while the lock already moved off `afterDoka`/`afterXp`
 * and live has not caught up past `pre`. Leave the unpaid marker so a
 * later fresh snapshot still honours 20/40 on top of the mutation.
 */
export async function flushPendingDeathPenaltyThroughDeathCutCredit(
  args: Omit<FlushPendingDeathArgs, "persist"> & {
    persist: DeathCutCreditFlushPersist;
  },
): Promise<boolean> {
  const pending = readPendingDeathPenalty(args.storage, args.slot);
  if (!pending) return false;
  const committed = args.persist.snapshot();
  const lockMoved =
    toNat(committed.doka) !== toNat(pending.afterDoka) ||
    toNat(committed.xp) !== toNat(pending.afterXp);
  if (lockMoved) {
    const snap = await args.fetchSnapshot();
    if (
      !snap ||
      shouldSkipDeathCutConfirmedCreditWrite({
        liveDoka: snap.doka,
        committedDoka: committed.doka,
        pendingPreDoka: pending.preDoka,
        pendingAfterDoka: pending.afterDoka,
        liveXp: snap.xp,
        committedXp: committed.xp,
        pendingPreXp: pending.preXp,
        pendingAfterXp: pending.afterXp,
      })
    ) {
      return false;
    }
  }
  return flushPendingDeathPenalty(args);
}
