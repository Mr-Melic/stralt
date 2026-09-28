/**
 * Seeded death-persist catch-commit plus a later XP grant that invoked
 * `applyRewards` then threw, then **remount replay** after
 * WorldExploration recreates the persist lock.
 *
 * #759 remount honour / heal `beforeEach` flush refuse live XP === unpaid
 * `preXp` while `pbv_death_cut_credit_replay_remount_xp_keep_slotN` is
 * set. Production remount replay never calls those helpers. It fetches
 * `getCallerDokaBalance` + `getCharacter` and `resolvePendingDeathReplay`s
 * **before** enqueue (`skipBeforeEach`), then `saveBattleStats`-writes
 * that decision.
 *
 * #742 remount skip needs live Doka ≤ `preDoka` or stamped
 * `committedXp > afterXp`. A Doka credit that #742 can stamp plus a
 * portal throw-after-add never committed XP, so `committedXp` stays
 * catch-cut 80. A **fresh** wallet query (250 / 300 / 1200 / 280) is
 * above `preDoka` 200, so #742 does not skip. Mixed replica
 * (fresh Doka + stale Play-entry getCharacter 100) writes **80/170**
 * over canister 110/250. `saveBattleStats` incoming-below-stored is
 * applied; portal +10 is gone. Honour / flush never run — replay is
 * first.
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
 * 2. Lava death `saveBattleStats` rejects. Catch commits lock 120 / XP 80.
 *    Pending `preXp=100` `afterXp=80`. HUD Doka 120. Canister still 200/100.
 * 3. Ground Doka / feat / GameKey `commit({ doka })` stamps #742 Doka.
 *    White portal `persistIncrementalRewards(0, 10)` invokes then throws
 *    (canister XP 110). Portal commit never runs. #759 stamps XP keep.
 *    Session `noteUnconfirmedCredit` dies with the remount.
 * 4. Actor reconnect remounts WorldExploration. Replay fetches mixed
 *    getCallerDokaBalance **250** + getCharacter **100**. #742 remount
 *    skip: live Doka 250 > pre 200 and committedXp 80 is not > after 80.
 *    Leftover `resolvePendingDeathReplay(100, 250)` writes **80/170**.
 *
 * Portal-only (no Doka stamp) is the same wipe at 80/120 over 110/200.
 * Pickup-only replica 100 (no XP keep) must still honour 100 → 80.
 * Victory leftover 24 is already below `preXp` and must not fail-close.
 * Explicit `applyRewards failed` must not stamp (canister did not add).
 *
 * Same storage key as #759 so a restacked portal note is visible here.
 * Do not add pending JSON fields — `readPendingDeathPenalty` drops
 * unknowns.
 *
 * `WorldExploration.tsx`, `progressPersist.ts`, `deathPenalty.ts`,
 * `applyRewardsResult.ts`, and the #742 / #756 / #759 remount files are
 * occupied / unmerged, so this PR does not restack them. Tests reproduce
 * leftover remount replay vs the gated skip. Restack remount replay onto
 * `persistDeathReplayThroughDeathCutCreditRemountXpKeep` after those PRs
 * land.
 */

import {
  type DeathPenaltyStorage,
  type PendingDeathPenalty,
  type PendingDeathReplay,
  readPendingDeathPenalty,
  resolvePendingDeathReplay,
} from "./deathPenalty.ts";
import type { ProgressPersistEnqueueOptions } from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Same key as #759 `deathCutCreditRemountXpKeepKey`. */
export function deathCutCreditRemountXpKeepReplayKey(slot: number): string {
  return `pbv_death_cut_credit_replay_remount_xp_keep_slot${Math.max(1, toNat(slot))}`;
}

export type DeathCutCreditRemountXpKeepReplay = {
  preXp: number;
  afterXp: number;
};

/**
 * Parsed `#err` / `applyRewards failed` means the canister did not add.
 * Any other throw is after-or-during invoke — the replica may have the grant.
 */
export function shouldNoteDeathCutCreditRemountXpKeepReplay(args: {
  xpDelta: number;
  error: unknown;
  pending: PendingDeathPenalty | null;
}): boolean {
  if (!args.pending || args.pending.cutConfirmed === true) return false;
  if (toNat(args.xpDelta) <= 0) return false;
  const msg = toMessage(args.error);
  if (!msg) return false;
  if (msg.includes("applyRewards failed")) return false;
  return true;
}

export function readDeathCutCreditRemountXpKeepReplay(
  storage: DeathPenaltyStorage,
  slot: number,
): DeathCutCreditRemountXpKeepReplay | null {
  try {
    const raw = storage.getItem(deathCutCreditRemountXpKeepReplayKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<DeathCutCreditRemountXpKeepReplay>;
    if (parsed.preXp == null || parsed.afterXp == null) return null;
    return {
      preXp: toNat(parsed.preXp),
      afterXp: toNat(parsed.afterXp),
    };
  } catch {
    return null;
  }
}

export function writeDeathCutCreditRemountXpKeepReplay(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: DeathCutCreditRemountXpKeepReplay,
): void {
  try {
    storage.setItem(
      deathCutCreditRemountXpKeepReplayKey(slot),
      JSON.stringify({
        preXp: toNat(stamp.preXp),
        afterXp: toNat(stamp.afterXp),
      }),
    );
  } catch {
    // private mode
  }
}

export function clearDeathCutCreditRemountXpKeepReplay(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(deathCutCreditRemountXpKeepReplayKey(slot));
  } catch {
    // ignore
  }
}

export function noteDeathCutCreditRemountXpKeepReplay(
  storage: DeathPenaltyStorage,
  slot: number,
  args: { xpDelta: number; error: unknown },
): void {
  const pending = readPendingDeathPenalty(storage, slot);
  if (
    !shouldNoteDeathCutCreditRemountXpKeepReplay({
      xpDelta: args.xpDelta,
      error: args.error,
      pending,
    })
  ) {
    return;
  }
  if (!pending) return;
  writeDeathCutCreditRemountXpKeepReplay(storage, pending.slot, {
    preXp: pending.preXp,
    afterXp: pending.afterXp,
  });
}

export function hasDeathCutCreditRemountXpKeepReplay(
  storage: DeathPenaltyStorage,
  slot: number,
  pending?: PendingDeathPenalty | null,
): boolean {
  const keep = readDeathCutCreditRemountXpKeepReplay(storage, slot);
  if (!keep) return false;
  if (!pending) return true;
  return (
    toNat(keep.preXp) === toNat(pending.preXp) &&
    toNat(keep.afterXp) === toNat(pending.afterXp)
  );
}

/**
 * Stale Play-entry leftover equals unpaid `preXp`. Victory leftover 24 is
 * already below `preXp` and must still honour. Missing live is fail-closed
 * only when a keep stamp exists.
 *
 * Fresh wallet 250 with stale XP 100 is the remount-replay wipe: #742
 * Doka skip is false (`live > pre`), and honour/flush never run.
 */
export function shouldSkipDeathCutCreditRemountXpKeepReplay(args: {
  keep: boolean;
  liveXp: number | null;
  pendingPreXp: number;
  cutConfirmed?: boolean;
}): boolean {
  if (args.cutConfirmed === true) return false;
  if (args.keep !== true) return false;
  if (args.liveXp == null) return true;
  return toNat(args.liveXp) === toNat(args.pendingPreXp);
}

export type DeathCutCreditRemountXpKeepReplaySnap = {
  xp: number;
  doka: number;
};

export type DeathCutCreditRemountXpKeepReplayDecision =
  | PendingDeathReplay
  | { action: "skip" };

/**
 * Remount replay leftover: mixed fresh Doka + stale getCharacter 100
 * never sees the XP-keep stamp, so skipBeforeEach writes 80 over 110.
 *
 * `cutConfirmed` still clears. Fail-closed when the replica snapshot is
 * missing after a stamp. Fresh 110 still honours unpaid 20 on top of the
 * grant (write 90).
 */
export function resolveDeathReplayAfterDeathCutCreditRemountXpKeep(
  snap: DeathCutCreditRemountXpKeepReplaySnap | null,
  pending: PendingDeathPenalty,
  keep: boolean,
): DeathCutCreditRemountXpKeepReplayDecision {
  if (pending.cutConfirmed === true) {
    return resolvePendingDeathReplay(
      snap?.xp ?? pending.afterXp,
      snap?.doka ?? pending.afterDoka,
      pending,
    );
  }
  if (
    shouldSkipDeathCutCreditRemountXpKeepReplay({
      keep,
      liveXp: snap?.xp ?? null,
      pendingPreXp: pending.preXp,
      cutConfirmed: pending.cutConfirmed,
    })
  ) {
    return { action: "skip" };
  }
  if (!snap) return { action: "skip" };
  return resolvePendingDeathReplay(snap.xp, snap.doka, pending);
}

export type DeathCutCreditRemountXpKeepReplayPersist = {
  enqueue<T>(
    fn: () => Promise<T>,
    enqueueOptions?: ProgressPersistEnqueueOptions,
  ): Promise<T>;
  snapshot(): { doka: number; xp: number };
  commit: (next: { doka?: number; xp?: number }) => void;
};

/**
 * Production remount replay must re-decide inside the persist job
 * (`skipBeforeEach` so it cannot flush itself). A credit that lands
 * while this job waits can refresh getCharacter to 110; skip only while
 * live leftover still looks like unpaid Play-entry `preXp`.
 */
export async function persistDeathReplayThroughDeathCutCreditRemountXpKeep(args: {
  persist: DeathCutCreditRemountXpKeepReplayPersist;
  storage: DeathPenaltyStorage;
  pending: PendingDeathPenalty;
  fetchSnapshot: () => Promise<DeathCutCreditRemountXpKeepReplaySnap | null>;
  writePenalty: (newXp: number, newDoka: number) => Promise<void>;
}): Promise<"wrote" | "skipped" | "cleared"> {
  return args.persist.enqueue(
    async () => {
      const pending =
        readPendingDeathPenalty(args.storage, args.pending.slot) ??
        args.pending;
      const keep = hasDeathCutCreditRemountXpKeepReplay(
        args.storage,
        pending.slot,
        pending,
      );
      const snap = await args.fetchSnapshot();
      const decision = resolveDeathReplayAfterDeathCutCreditRemountXpKeep(
        snap,
        pending,
        keep,
      );
      if (decision.action === "skip") return "skipped";
      if (decision.action === "clear") {
        clearDeathCutCreditRemountXpKeepReplay(args.storage, pending.slot);
        return "cleared";
      }
      await args.writePenalty(decision.newXp, decision.newDoka);
      args.persist.commit({ doka: decision.newDoka, xp: decision.newXp });
      clearDeathCutCreditRemountXpKeepReplay(args.storage, pending.slot);
      return "wrote";
    },
    { skipBeforeEach: true },
  );
}
