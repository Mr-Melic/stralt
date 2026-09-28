/**
 * Seeded death-persist catch-commit plus a later *confirmed* lock move,
 * then **remount replay** after WorldExploration recreates the persist lock.
 *
 * #710 skip reads `persist.snapshot()` from the same lock that committed
 * 250 / 220 / 1120 / 280 / XP 110 / spend 110. Production remount
 * `createProgressPersist` seeds from GameFlow HUD Doka (catch-cut 120) and
 * Play-entry `character.experience` (never updated after applyRewards, so
 * leftover XP 100). That snapshot is *not* the credited lock:
 *
 * - Doka 120 === `afterDoka` so the Doka skip is false.
 * - Play-entry XP 100 > `afterXp` 80 and live XP 100 ≤ `preXp` 100, so
 *   #710's XP skip is a **false positive**: unpaid remount 200 → 120 never
 *   writes, and a later credit is only skipped by accident.
 *
 * Leftover remount `resolvePendingDeathReplay(stale 200/100)` still writes
 * **120/80** over canister 250/300/1200/280/110/190 and `commit`s the new
 * lock back to the catch-cut.
 *
 * Chronology (actor reconnect after death-fail catch-commit then a credit):
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200.
 * 2. Lava death `saveBattleStats` rejects. Catch commits lock 120 / XP 80.
 *    Pending `preDoka=200` `afterDoka=120`. Canister still 200. HUD Doka 120.
 * 3. Confirmed mutation lands on the *session* lock (settle 250, feat 220,
 *    GameKey 1120, victory 280, portal XP 110, upgrade 110).
 * 4. Actor reconnect remounts WorldExploration. New lock `{ doka: 120,
 *    xp: 100 }`. Leftover replay fetches stale 200/100, writes 120/80.
 *
 * Persist the session lock-move in a sidecar localStorage key (do not add
 * fields to `PendingDeathPenalty` — `readPendingDeathPenalty` drops
 * unknowns). Remount skip reads that stamp, not the new lock. Play-entry
 * XP 100 / HUD 120 / placeholder 0 must not stamp.
 *
 * Death-fail without a later mutation must still write 200 → 120. Keep-only
 * (#698) does not commit off `after`; this helper does not extra-skip that.
 * #705 flush/resolve and #710 same-lock replay stay on those PRs.
 *
 * `WorldExploration.tsx`, `progressPersist.ts`, `deathPenalty.ts`, and
 * `deathCutConfirmedCreditReplayWriteSkip.ts` (#710) are occupied /
 * unmerged, so this PR does not restack them. Tests reproduce the call
 * site. Restack remount replay onto
 * `persistDeathReplayThroughDeathCutCreditRemount` and wrap session
 * `commit` after those PRs land.
 */

import {
  type DeathPenaltyStorage,
  type PendingDeathPenalty,
  type PendingDeathReplay,
  readPendingDeathPenalty,
  resolvePendingDeathReplay,
} from "./deathPenalty.ts";
import type {
  CommittedProgress,
  ProgressPersistEnqueueOptions,
} from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

export function deathCutCreditRemountStampKey(slot: number): string {
  return `pbv_death_cut_credit_replay_remount_slot${Math.max(1, toNat(slot))}`;
}

export type DeathCutCreditRemountStamp = {
  preDoka: number;
  afterDoka: number;
  preXp: number;
  afterXp: number;
  committedDoka: number;
  committedXp: number;
};

export type DeathCutCreditRemountCommitted = {
  doka: number;
  xp: number;
};

export type DeathCutCreditRemountSnap = {
  xp: number;
  doka: number;
};

export type DeathCutCreditRemountDecision =
  | PendingDeathReplay
  | { action: "skip" };

/**
 * Session lock actually moved off the catch-cut. Play-entry remount XP
 * (`preXp`) and HUD Doka (`afterDoka`) and placeholder 0 must not stamp.
 */
export function shouldStampDeathCutConfirmedCreditRemount(
  pending: PendingDeathPenalty,
  committed: DeathCutCreditRemountCommitted,
): boolean {
  if (pending.cutConfirmed === true) return false;
  const doka = toNat(committed.doka);
  const xp = toNat(committed.xp);
  const afterDoka = toNat(pending.afterDoka);
  const afterXp = toNat(pending.afterXp);
  const preDoka = toNat(pending.preDoka);
  const preXp = toNat(pending.preXp);
  const creditDoka = doka > afterDoka && doka !== preDoka;
  const creditXp = xp > afterXp && xp !== preXp;
  const spendDoka = doka < afterDoka && doka > 0;
  return creditDoka || creditXp || spendDoka;
}

export function readDeathCutCreditRemountStamp(
  storage: DeathPenaltyStorage,
  slot: number,
): DeathCutCreditRemountStamp | null {
  try {
    const raw = storage.getItem(deathCutCreditRemountStampKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DeathCutCreditRemountStamp>;
    if (
      parsed.preDoka == null ||
      parsed.afterDoka == null ||
      parsed.preXp == null ||
      parsed.afterXp == null ||
      parsed.committedDoka == null ||
      parsed.committedXp == null
    ) {
      return null;
    }
    return {
      preDoka: toNat(parsed.preDoka),
      afterDoka: toNat(parsed.afterDoka),
      preXp: toNat(parsed.preXp),
      afterXp: toNat(parsed.afterXp),
      committedDoka: toNat(parsed.committedDoka),
      committedXp: toNat(parsed.committedXp),
    };
  } catch {
    return null;
  }
}

export function writeDeathCutCreditRemountStamp(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: DeathCutCreditRemountStamp,
): void {
  try {
    storage.setItem(
      deathCutCreditRemountStampKey(slot),
      JSON.stringify({
        preDoka: toNat(stamp.preDoka),
        afterDoka: toNat(stamp.afterDoka),
        preXp: toNat(stamp.preXp),
        afterXp: toNat(stamp.afterXp),
        committedDoka: toNat(stamp.committedDoka),
        committedXp: toNat(stamp.committedXp),
      }),
    );
  } catch {
    // private mode
  }
}

export function clearDeathCutCreditRemountStamp(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(deathCutCreditRemountStampKey(slot));
  } catch {
    // ignore
  }
}

export function noteDeathCutConfirmedCreditRemount(
  storage: DeathPenaltyStorage,
  pending: PendingDeathPenalty,
  committed: DeathCutCreditRemountCommitted,
): void {
  if (!shouldStampDeathCutConfirmedCreditRemount(pending, committed)) return;
  writeDeathCutCreditRemountStamp(storage, pending.slot, {
    preDoka: pending.preDoka,
    afterDoka: pending.afterDoka,
    preXp: pending.preXp,
    afterXp: pending.afterXp,
    committedDoka: committed.doka,
    committedXp: committed.xp,
  });
}

/**
 * Later confirmed mutation was stamped on the session lock. A remount
 * lock at HUD 120 / Play-entry XP 100 must not replay-write `after` over
 * the credited / spent canister while live still looks like unpaid `pre`.
 *
 * Credit: stamped committed rose past `after` while live is still ≤ `pre`.
 * Spend: stamped committed dropped below `after` while live is still ≥ `pre`.
 * A later rise above `pre` (250 / 300 / 1200 / 280 / XP 110) or a fresh
 * post-spend 190 still honours unpaid on top of the mutation.
 */
export function shouldSkipDeathCutCreditRemountReplay(args: {
  stamp: DeathCutCreditRemountStamp | null;
  liveDoka: number | null;
  liveXp?: number | null;
}): boolean {
  if (!args.stamp) return false;
  const stamp = args.stamp;
  const committedDoka = toNat(stamp.committedDoka);
  const afterDoka = toNat(stamp.afterDoka);
  const preDoka = toNat(stamp.preDoka);
  if (committedDoka > afterDoka) {
    if (args.liveDoka == null) return true;
    if (toNat(args.liveDoka) <= preDoka) return true;
  } else if (committedDoka < afterDoka) {
    if (args.liveDoka == null) return true;
    if (toNat(args.liveDoka) >= preDoka) return true;
  }
  const committedXp = toNat(stamp.committedXp);
  const afterXp = toNat(stamp.afterXp);
  const preXp = toNat(stamp.preXp);
  if (committedXp > afterXp) {
    if (args.liveXp == null) return true;
    if (toNat(args.liveXp) <= preXp) return true;
  }
  return false;
}

/**
 * Leftover remount replay: `resolvePendingDeathReplay(stale 200)` never
 * sees the session lock, so skipBeforeEach writes 120 over a later credit.
 *
 * `cutConfirmed` still clears. Fail-closed when the replica snapshot is
 * missing after a stamp.
 */
export function resolveDeathReplayAfterDeathCutCreditRemount(
  snap: DeathCutCreditRemountSnap | null,
  pending: PendingDeathPenalty,
  stamp: DeathCutCreditRemountStamp | null,
): DeathCutCreditRemountDecision {
  if (pending.cutConfirmed === true) {
    return resolvePendingDeathReplay(
      snap?.xp ?? pending.afterXp,
      snap?.doka ?? pending.afterDoka,
      pending,
    );
  }
  if (
    shouldSkipDeathCutCreditRemountReplay({
      stamp,
      liveDoka: snap?.doka ?? null,
      liveXp: snap?.xp ?? null,
    })
  ) {
    return { action: "skip" };
  }
  if (!snap) return { action: "skip" };
  return resolvePendingDeathReplay(snap.xp, snap.doka, pending);
}

export type DeathCutCreditRemountPersist = {
  enqueue<T>(
    fn: () => Promise<T>,
    enqueueOptions?: ProgressPersistEnqueueOptions,
  ): Promise<T>;
  snapshot(): DeathCutCreditRemountCommitted;
  commit: (next: Partial<CommittedProgress>) => void;
};

/**
 * Stamp a confirmed post-cut commit onto sidecar storage so a later
 * remount lock (HUD 120 / Play-entry XP 100) can still skip.
 */
export function wrapPersistCommitForDeathCutCreditRemount<
  T extends DeathCutCreditRemountPersist,
>(persist: T, storage: DeathPenaltyStorage, slot: number): T {
  const inner = persist.commit.bind(persist);
  persist.commit = (next: Partial<CommittedProgress>) => {
    inner(next);
    const pending = readPendingDeathPenalty(storage, slot);
    if (!pending) return;
    noteDeathCutConfirmedCreditRemount(storage, pending, persist.snapshot());
  };
  return persist;
}

/**
 * Production remount replay must re-decide inside the persist job
 * (`skipBeforeEach` so it cannot flush itself). A credit that lands
 * while this job waits stamps storage; `snapshot()` on a remount lock
 * is HUD/Play-entry and must not be the skip signal.
 */
export async function persistDeathReplayThroughDeathCutCreditRemount(args: {
  persist: DeathCutCreditRemountPersist;
  storage: DeathPenaltyStorage;
  pending: PendingDeathPenalty;
  fetchSnapshot: () => Promise<DeathCutCreditRemountSnap | null>;
  writePenalty: (newXp: number, newDoka: number) => Promise<void>;
}): Promise<"wrote" | "skipped" | "cleared"> {
  return args.persist.enqueue(
    async () => {
      const pending =
        readPendingDeathPenalty(args.storage, args.pending.slot) ??
        args.pending;
      const stamp = readDeathCutCreditRemountStamp(args.storage, pending.slot);
      const snap = await args.fetchSnapshot();
      const decision = resolveDeathReplayAfterDeathCutCreditRemount(
        snap,
        pending,
        stamp,
      );
      if (decision.action === "skip") return "skipped";
      if (decision.action === "clear") {
        clearDeathCutCreditRemountStamp(args.storage, pending.slot);
        return "cleared";
      }
      await args.writePenalty(decision.newXp, decision.newDoka);
      args.persist.commit({ doka: decision.newDoka, xp: decision.newXp });
      clearDeathCutCreditRemountStamp(args.storage, pending.slot);
      return "wrote";
    },
    { skipBeforeEach: true },
  );
}
