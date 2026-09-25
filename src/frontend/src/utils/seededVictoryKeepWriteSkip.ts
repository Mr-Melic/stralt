/**
 * Seeded Boss Rush / victory `applyRewards` can land then throw.
 *
 * `persistBossRushRewardsThroughLock` on main has no catch note.
 * An older persist PR (`noteUnseededVictoryKeepWriteSkip`) returns
 * without noting when `isWalletSeeded()` is true — it owns the
 * unseeded `seedWallet` wrap. `noteUnconfirmedCredit` *does* set
 * `unconfirmedWalletCredit` on a seeded lock, but nothing on the
 * room-clear / handleBattleEnd catch calls it (those catches only log).
 *
 * Leftover `resolveCommittedDokaForAbsoluteWrite` then returns the
 * pre-credit lock snapshot immediately (`seeded && !unconfirmed`). Recap
 * heal `saveBattleStats` writes that snapshot (incoming-below-stored is
 * applied; the method never mints). The grant is gone.
 *
 * Chronology (Boss Rush room clear):
 * 1. World hydrated. Lock doka=200, seeded. Canister 200.
 * 2. Room-clear `applyRewards` adds 80 (canister 280) then the replica
 *    rejects. Commit never runs. Catch only logs. Lock stays 200.
 *    `unconfirmedWalletCredit` stays false.
 * 3. Recap heal spends 10. Leftover resolve returns 200 with no fetch.
 * 4. `saveBattleStats` writes 190. The 80 grant is gone.
 *
 * Same wipe for handleBattleEnd victory `resolveBattleRewards`
 * throw-after-add (bare enqueue + log-only catch).
 *
 * This notes `noteUnconfirmedCredit` on victory / Boss Rush
 * transport-keep so leftover resolve re-fetches. A stale live ≤
 * committed throws `ABSOLUTE_WRITE_UNCONFIRMED_CREDIT` and skips the
 * write. A live rise seeds then the heal spend applies to the
 * post-credit wallet.
 *
 * Explicit `applyRewards failed` (`#err`) means the canister did not
 * add. Do not note then — a later heal must still persist.
 * `persistRoomClear` throwing before `applyRewards` also must not note.
 *
 * Production hooks are `persistSeededBossRushRewardsThroughLock` /
 * `persistSeededHandleBattleEndRewardsThroughLock`. WorldExploration,
 * `bossRushProgress.ts`, and `rewardResolver.ts` are occupied by older
 * persist PRs, so this PR does not restack them. Tests reproduce the
 * call site. Restack the room-clear / victory persist jobs onto these
 * helpers after those PRs land.
 *
 * Death / heal keep the original `resolveCommittedDokaForAbsoluteWrite`
 * call — an older persist PR inserts `resolveCommittedXpForAbsoluteWrite`
 * next to both.
 */

import { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT } from "./progressPersist.ts";

export { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT };

export type SeededVictoryKeepWriteSkipPersist = {
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
export function shouldNoteSeededVictoryTransportKeep(error: unknown): boolean {
  const msg = toMessage(error);
  if (!msg) return false;
  if (msg.includes("applyRewards failed")) return false;
  return true;
}

/**
 * After a seeded victory / Boss Rush transport-keep, force the next
 * absolute write to re-fetch. A stale snapshot must not wipe the grant.
 *
 * Unseeded throw-after-add is an older persist PR (seedWallet wrap). Do
 * not note here — leftover resolve still fetches, and this flag only
 * skips when `live <= committed` on a *seeded* lock.
 */
export function noteSeededVictoryKeepWriteSkip(
  persist: SeededVictoryKeepWriteSkipPersist,
  error: unknown,
): void {
  if (!shouldNoteSeededVictoryTransportKeep(error)) return;
  if (persist.isWalletSeeded?.() !== true) return;
  persist.noteUnconfirmedCredit?.();
}

/**
 * Room-clear persist: write currentRoom, then applyRewards + commit.
 * Note unconfirmed only when applyAndCommit throws so a persistRoomClear
 * miss cannot stuck-skip later heals.
 *
 * Call this instead of bare `persistBossRushRewardsThroughLock` when
 * restacking WorldExploration.
 */
export async function persistSeededBossRushRewardsThroughLock<T>(
  lock: SeededVictoryKeepWriteSkipPersist & {
    enqueue: <U>(fn: () => Promise<U>) => Promise<U>;
  },
  persistRoomClear: () => Promise<void>,
  applyAndCommit: () => Promise<T>,
): Promise<T> {
  return lock.enqueue(async () => {
    await persistRoomClear();
    try {
      return await applyAndCommit();
    } catch (err) {
      noteSeededVictoryKeepWriteSkip(lock, err);
      throw err;
    }
  });
}

/**
 * handleBattleEnd enqueues `resolveBattleRewards` then `commit`. That
 * path never entered `persistBossRushRewardsThroughLock`. Wrap the job
 * so a throw-after-add notes unconfirmed before recap heal can write
 * the pre-credit snapshot. Call this instead of bare `enqueue` when
 * restacking WorldExploration.
 */
export async function persistSeededHandleBattleEndRewardsThroughLock<T>(
  lock: SeededVictoryKeepWriteSkipPersist & {
    enqueue: <U>(fn: () => Promise<U>) => Promise<U>;
  },
  applyAndCommit: () => Promise<T>,
): Promise<T> {
  return lock.enqueue(async () => {
    try {
      return await applyAndCommit();
    } catch (err) {
      noteSeededVictoryKeepWriteSkip(lock, err);
      throw err;
    }
  });
}
