/**
 * Death persist vs beforeEach flush race (double 20/40).
 *
 * `createProgressPersist` runs `beforeEach` → `flushPendingDeathPenalty` at
 * the head of every enqueue except death's own `{ skipBeforeEach: true }`
 * (`progressPersist.ts` 214–218 / 342–343). Death skips beforeEach so **its**
 * job cannot flush-then-`computeDeathPenalty` on the already-cut lock.
 *
 * That guard does not cover a job that was already queued **before** death
 * armed the pending marker. Live wiring (`WorldExploration.tsx` 1445–1485
 * always flushes; 12972–13091 writes pending then enqueues death with
 * `skipBeforeEach`):
 *
 * Chronology (victory / portal / heal already on the lock, then lava death):
 * 1. Lock seeded `{ xp: 1000, doka: 500 }`. Victory `applyRewards` enqueued
 *    (job A). No pending marker yet.
 * 2. Lava death. Optimistic UI cuts. `writePendingDeathPenalty` stores
 *    `pre=1000/500`, `after=800/300`. Death job B enqueues with
 *    `skipBeforeEach: true`. `deathPersistInFlight = true`.
 * 3. Job A starts. Live `beforeEach` always calls
 *    `flushPendingDeathPenalty` → canister + lock go to 800/300, pending
 *    cleared (`cutConfirmed` + remove).
 * 4. Job A `applyRewards` credits victory (e.g. +200 XP / +100 Doka) onto
 *    the already-cut base → lock `{ xp: 1000, doka: 400 }`.
 * 5. Job B death runs. It does **not** re-read pending; it
 *    `computeDeathPenalty` on the post-credit snapshot → second 20/40
 *    (`xp: 800`, `doka: 240`). Canister keeps the double cut on reload.
 *
 * Expected (one post-credit 20/40, AGENTS.md death-during-victory intent):
 * job A credits on the uncut wallet first (`1200/600`), job B cuts once
 * (`960/360`). Actual: flush steals the marker pre-credit, then death
 * re-cuts post-credit.
 *
 * Distinct from unpaid death marker + replay (#653), victory throw-after-add
 * (#356), `shouldApplyVictoryLiveHydrate` (#652/#959), and remount wipe
 * keep family through #1276. Flush is correct when death persist **already
 * finished** (failed replica / reload) and a later heal/shop/applyRewards
 * must honour the unpaid marker — only the in-flight window must skip.
 *
 * `WorldExploration.tsx`, `deathPenalty.ts`, `progressPersist.ts`, and the
 * remount-wipe sidecars are occupied / unmerged, so this PR does not
 * restack them. Restack `setBeforeEach` onto
 * `shouldFlushPendingDeathBeforeCredit(deathPersistInFlight)` and wrap the
 * death enqueue with `withDeathPersistInFlight` after those land. No Motoko.
 */

import { computeDeathPenalty } from "./deathPenalty.ts";
import { createProgressPersist } from "./progressPersist.ts";

/** Live WX `setBeforeEach` always flushes, even while death owns the cut. */
export function liveWxFlushesPendingDeathWhileDeathPersistInFlight(): boolean {
  return true;
}

/**
 * Production beforeEach must not flush while the death job is still on the
 * lock — that job applies the single post-credit 20/40.
 */
export function shouldFlushPendingDeathBeforeCredit(
  deathPersistInFlight: boolean,
): boolean {
  return deathPersistInFlight !== true;
}

export type DeathCutSnapshot = {
  xp: number;
  doka: number;
};

export type DeathDuringCreditSimResult = {
  final: DeathCutSnapshot;
  cutsApplied: number;
  pendingClearedByFlush: boolean;
};

/**
 * Simulate the live race: prior credit job flushes pending, credits, then
 * the death job recomputes 20/40 on the post-credit lock.
 *
 * When `flushWhileDeathInFlight` is true (live WX), the wallet is
 * double-cut. When false (gated), death applies one post-credit cut.
 */
export async function simulateDeathDuringQueuedCredit(args: {
  preXp: number;
  preDoka: number;
  creditXp: number;
  creditDoka: number;
  flushWhileDeathInFlight: boolean;
}): Promise<DeathDuringCreditSimResult> {
  const preXp = Math.max(0, Math.floor(Number(args.preXp) || 0));
  const preDoka = Math.max(0, Math.floor(Number(args.preDoka) || 0));
  const creditXp = Math.max(0, Math.floor(Number(args.creditXp) || 0));
  const creditDoka = Math.max(0, Math.floor(Number(args.creditDoka) || 0));
  const firstCut = computeDeathPenalty(preXp, preDoka);

  const lock = createProgressPersist({
    doka: preDoka,
    xp: preXp,
    level: 4,
  });

  let pending: {
    preXp: number;
    preDoka: number;
    afterXp: number;
    afterDoka: number;
  } | null = null;
  let cutsApplied = 0;
  let pendingClearedByFlush = false;
  let deathPersistInFlight = false;

  const runBeforeEachFlush = () => {
    const allowFlush = args.flushWhileDeathInFlight
      ? liveWxFlushesPendingDeathWhileDeathPersistInFlight()
      : shouldFlushPendingDeathBeforeCredit(deathPersistInFlight);
    if (!allowFlush || pending == null) return;
    const snap = lock.snapshot();
    if (snap.xp !== pending.afterXp || snap.doka !== pending.afterDoka) {
      lock.commit({ xp: pending.afterXp, doka: pending.afterDoka });
      cutsApplied += 1;
    }
    pending = null;
    pendingClearedByFlush = true;
  };

  // Mirror live WX `setBeforeEach` → flush. skipBeforeEach on death does
  // not protect this prior credit job's beforeEach.
  lock.setBeforeEach(async () => {
    runBeforeEachFlush();
  });

  const creditJob = lock.enqueue(async () => {
    const snap = lock.snapshot();
    lock.commit({
      xp: snap.xp + creditXp,
      doka: snap.doka + creditDoka,
    });
  });

  // Death arms after credit is queued (lava during in-flight victory/portal).
  pending = {
    preXp,
    preDoka,
    afterXp: firstCut.newXp,
    afterDoka: firstCut.newDoka,
  };
  deathPersistInFlight = true;

  const deathJob = lock.enqueue(
    async () => {
      const snap = lock.snapshot();
      const after = computeDeathPenalty(snap.xp, snap.doka);
      lock.commit({ xp: after.newXp, doka: after.newDoka });
      cutsApplied += 1;
      pending = null;
    },
    { skipBeforeEach: true },
  );

  await creditJob;
  await deathJob;
  deathPersistInFlight = false;

  return {
    final: { xp: lock.snapshot().xp, doka: lock.snapshot().doka },
    cutsApplied,
    pendingClearedByFlush,
  };
}

/**
 * Wrap a death persist job so callers can flip the in-flight flag around
 * the enqueue (WX restack target).
 */
export async function withDeathPersistInFlight<T>(args: {
  setInFlight: (next: boolean) => void;
  run: () => Promise<T>;
}): Promise<T> {
  args.setInFlight(true);
  try {
    return await args.run();
  } finally {
    args.setInFlight(false);
  }
}

/**
 * Expected single post-credit cut when flush is gated off during in-flight.
 */
export function expectedSinglePostCreditDeathCut(args: {
  preXp: number;
  preDoka: number;
  creditXp: number;
  creditDoka: number;
}): DeathCutSnapshot {
  const postXp =
    Math.max(0, Math.floor(Number(args.preXp) || 0)) +
    Math.max(0, Math.floor(Number(args.creditXp) || 0));
  const postDoka =
    Math.max(0, Math.floor(Number(args.preDoka) || 0)) +
    Math.max(0, Math.floor(Number(args.creditDoka) || 0));
  const cut = computeDeathPenalty(postXp, postDoka);
  return { xp: cut.newXp, doka: cut.newDoka };
}

/**
 * Live leftover final wallet after flush-then-credit-then-death re-cut.
 */
export function leftoverDoubleCutAfterFlushThenCredit(args: {
  preXp: number;
  preDoka: number;
  creditXp: number;
  creditDoka: number;
}): DeathCutSnapshot {
  const first = computeDeathPenalty(args.preXp, args.preDoka);
  const creditedXp =
    first.newXp + Math.max(0, Math.floor(Number(args.creditXp) || 0));
  const creditedDoka =
    first.newDoka + Math.max(0, Math.floor(Number(args.creditDoka) || 0));
  const second = computeDeathPenalty(creditedXp, creditedDoka);
  return { xp: second.newXp, doka: second.newDoka };
}
