/**
 * Seeded death-persist catch-commit plus a later *confirmed* lock move,
 * then remount **replay**.
 *
 * #705 covers heal/shop `beforeEach` flush and `resolveCommittedDoka`
 * after the lock moved off `afterDoka` / `afterXp`. Production remount
 * replay never hits those hooks: it calls `resolvePendingDeathReplay` on
 * the replica snapshot alone, then `enqueue(..., { skipBeforeEach: true })`.
 * A stale pre-death 200/100 still looks unpaid, so leftover writes
 * **120/80** over the credited canister and `commit`s the lock back to
 * the catch-cut.
 *
 * Chronology (actor reconnect after death-fail catch-commit then a credit):
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
 * 4. Actor reconnect remounts WorldExploration. Leftover replay fetches
 *    stale 200/100, `resolvePendingDeathReplay` emits write 120/80,
 *    skipBeforeEach enqueue `saveBattleStats`-writes it. Pickup / grant /
 *    portal +10 gone, or the upgrade spend refunded.
 *
 * Skip the replay write while the lock already moved off the catch-cut
 * *and* live still looks like the unpaid pre-cut replica (credit: live ≤
 * pre; spend: live ≥ pre). A later rise above `preDoka` (250 / 300 /
 * 1200 / 280) or a fresh post-spend 190 honours unpaid on top of the
 * mutation. Death-fail without a later mutation (lock still 120/80) must
 * still write 200 → 120. Keep-only (#698) leaves lock at `afterDoka`;
 * this helper does not extra-skip that hole.
 *
 * Re-decide *inside* the persist job. Leftover computes the write from
 * the replica *before* enqueue; a credit that lands while the job waits
 * still gets wiped. `WorldExploration.tsx`, `progressPersist.ts`,
 * `deathPenalty.ts`, and `deathCutConfirmedCreditWriteSkip.ts` (#705)
 * are occupied / unmerged, so this PR does not restack them. Tests
 * reproduce the call site. Restack remount replay onto
 * `persistDeathReplayThroughDeathCutCredit` after those PRs land.
 */

import {
  type PendingDeathPenalty,
  type PendingDeathReplay,
  resolvePendingDeathReplay,
} from "./deathPenalty.ts";
import type { ProgressPersistEnqueueOptions } from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

export type DeathCutCreditReplayCommitted = {
  doka: number;
  xp: number;
};

export type DeathCutCreditReplaySnap = {
  xp: number;
  doka: number;
};

export type DeathCutCreditReplayDecision =
  | PendingDeathReplay
  | { action: "skip" };

/**
 * Later confirmed mutation moved the lock off the catch-cut. A stale
 * replica still sitting at unpaid `pre` must not replay-write `after`
 * over the credited / spent canister.
 *
 * Credit (settle / feat / GameKey / victory / portal XP): lock rose past
 * `after` while live is still ≤ `pre`.
 * Spend (`upgradeSpell` / rename): lock dropped below `after` while live
 * is still ≥ `pre` (uncut replica). A fresh post-spend 190 is < `pre` and
 * must still replay so honour unpaid can land on top of the debit.
 */
export function shouldSkipDeathCutConfirmedCreditReplay(args: {
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

/**
 * Leftover remount replay: `resolvePendingDeathReplay(stale 200)` never
 * sees the persist lock, so skipBeforeEach writes 120 over a later credit.
 *
 * `cutConfirmed` still clears. Fail-closed when the replica snapshot is
 * missing after the lock already moved.
 */
export function resolveDeathReplayAfterDeathCutCredit(
  snap: DeathCutCreditReplaySnap | null,
  pending: PendingDeathPenalty,
  committed: DeathCutCreditReplayCommitted,
): DeathCutCreditReplayDecision {
  if (pending.cutConfirmed === true) {
    return resolvePendingDeathReplay(
      snap?.xp ?? pending.afterXp,
      snap?.doka ?? pending.afterDoka,
      pending,
    );
  }
  if (
    shouldSkipDeathCutConfirmedCreditReplay({
      liveDoka: snap?.doka ?? null,
      committedDoka: committed.doka,
      pendingPreDoka: pending.preDoka,
      pendingAfterDoka: pending.afterDoka,
      liveXp: snap?.xp ?? null,
      committedXp: committed.xp,
      pendingPreXp: pending.preXp,
      pendingAfterXp: pending.afterXp,
    })
  ) {
    return { action: "skip" };
  }
  if (!snap) return { action: "skip" };
  return resolvePendingDeathReplay(snap.xp, snap.doka, pending);
}

export type DeathCutCreditReplayPersist = {
  enqueue<T>(
    fn: () => Promise<T>,
    enqueueOptions?: ProgressPersistEnqueueOptions,
  ): Promise<T>;
  snapshot(): DeathCutCreditReplayCommitted;
  commit(next: { doka?: number; xp?: number }): void;
};

/**
 * Production remount replay must re-decide inside the persist job
 * (`skipBeforeEach` so it cannot flush itself). A credit that lands
 * while this job waits on the queue is visible in `snapshot()` then.
 */
export async function persistDeathReplayThroughDeathCutCredit(args: {
  persist: DeathCutCreditReplayPersist;
  pending: PendingDeathPenalty;
  fetchSnapshot: () => Promise<DeathCutCreditReplaySnap | null>;
  writePenalty: (newXp: number, newDoka: number) => Promise<void>;
}): Promise<"wrote" | "skipped" | "cleared"> {
  return args.persist.enqueue(
    async () => {
      const snap = await args.fetchSnapshot();
      const decision = resolveDeathReplayAfterDeathCutCredit(
        snap,
        args.pending,
        args.persist.snapshot(),
      );
      if (decision.action === "skip") return "skipped";
      if (decision.action === "clear") return "cleared";
      await args.writePenalty(decision.newXp, decision.newDoka);
      args.persist.commit({ doka: decision.newDoka, xp: decision.newXp });
      return "wrote";
    },
    { skipBeforeEach: true },
  );
}
