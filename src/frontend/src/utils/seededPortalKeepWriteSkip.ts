/**
 * Seeded portal `persistIncrementalRewards(0, 10)` can land then throw.
 *
 * `persistPortalXpThroughLock` on an older persist PR returns without
 * noting when `isWalletSeeded()` is true — it owns the unseeded
 * `seedWallet` wrap. Seeded Boss Rush / handleBattleEnd keep
 * (`noteSeededVictoryKeepWriteSkip`) never wraps the portal enqueue.
 * `noteUnconfirmedCredit` *does* set `unconfirmedWalletCredit` on a
 * seeded lock, but the portal catch only `console.warn`s.
 *
 * Leftover `resolveCommittedDokaForAbsoluteWrite` then returns the
 * pre-credit lock snapshot immediately (`seeded && !unconfirmed`). Recap
 * heal `saveBattleStats` writes that snapshot's leftover XP
 * (incoming-below-stored is applied; the method never mints). Portal
 * +10 is gone.
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200, XP leftover 80, seeded. Canister
 *    Doka 200 / XP 80.
 * 2. Portal `persistIncrementalRewards(0, 10)` adds leftover 80→90
 *    then the replica rejects. Commit never runs. Catch only warns.
 *    Lock stays XP 80. `unconfirmedWalletCredit` stays false.
 * 3. Recap heal spends 10. Leftover resolve returns 200 with no fetch.
 * 4. `saveBattleStats` writes Doka 190 and XP 80. The +10 is gone.
 *
 * This notes `noteUnconfirmedCredit` on portal transport-keep so leftover
 * resolve re-fetches. A stale live ≤ committed throws
 * `ABSOLUTE_WRITE_UNCONFIRMED_CREDIT` and skips the write. Portal Doka
 * delta is 0, so a live Doka rise is not expected; skipping is how the
 * leftover XP grant survives. A later Doka `commit` clears the flag.
 *
 * Explicit `applyRewards failed` (`#err`) means the canister did not
 * add. Do not note then — a later heal must still persist.
 *
 * Production hook is `persistSeededPortalXpThroughLock`.
 * WorldExploration and `applyRewardsResult.ts` are occupied by older
 * persist PRs, so this PR does not restack them. Tests reproduce the
 * call site. Restack the portal persist job onto this helper after
 * those PRs land.
 *
 * Death / heal keep the original `resolveCommittedDokaForAbsoluteWrite`
 * call — an older persist PR inserts `resolveCommittedXpForAbsoluteWrite`
 * next to both.
 */

import { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT } from "./progressPersist.ts";

export { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT };

export type SeededPortalKeepWriteSkipPersist = {
  isWalletSeeded?: () => boolean;
  noteUnconfirmedCredit?: () => void;
  hasUnconfirmedWalletCredit?: () => boolean;
};

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Parsed `#err` / `applyRewards failed` means the canister did not add.
 * Any other throw is after-or-during invoke — the replica may have the grant.
 */
export function shouldNoteSeededPortalTransportKeep(error: unknown): boolean {
  const msg = toMessage(error);
  if (!msg) return false;
  if (msg.includes("applyRewards failed")) return false;
  return true;
}

/**
 * After a seeded portal transport-keep, force the next absolute write to
 * re-fetch. A stale snapshot must not wipe leftover XP.
 *
 * Unseeded throw-after-add is an older persist PR (seedWallet wrap). Do
 * not note here — leftover resolve still fetches, and this flag only
 * skips when `live <= committed` on a *seeded* lock.
 */
export function noteSeededPortalKeepWriteSkip(
  persist: SeededPortalKeepWriteSkipPersist,
  error: unknown,
): void {
  if (!shouldNoteSeededPortalTransportKeep(error)) return;
  if (persist.isWalletSeeded?.() !== true) return;
  persist.noteUnconfirmedCredit?.();
}

/**
 * Portal transition enqueues `persistIncrementalRewards(0, 10)` then
 * `commit({ xp, level })`. That path never entered seeded victory /
 * GameKey keep helpers. Wrap the job so a throw-after-add notes
 * unconfirmed before recap heal can write Play-entry leftover. Call
 * this instead of bare `enqueue` when restacking WorldExploration.
 */
export async function persistSeededPortalXpThroughLock<T>(
  lock: SeededPortalKeepWriteSkipPersist & {
    enqueue: <U>(fn: () => Promise<U>) => Promise<U>;
  },
  applyAndCommit: () => Promise<T>,
): Promise<T> {
  return lock.enqueue(async () => {
    try {
      return await applyAndCommit();
    } catch (err) {
      noteSeededPortalKeepWriteSkip(lock, err);
      throw err;
    }
  });
}
