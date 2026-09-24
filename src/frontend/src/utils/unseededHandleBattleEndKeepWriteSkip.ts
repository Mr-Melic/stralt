/**
 * Unseeded handleBattleEnd `applyRewards` can land then throw.
 * `noteUnconfirmedCredit` only sets `unconfirmedWalletCredit` when the
 * persist lock is already seeded, so leftover
 * `resolveCommittedDokaForAbsoluteWrite` still re-fetches and *seeds*
 * whatever the replica returns.
 *
 * A stale in-flight `getCallerDokaBalance` is the pre-credit wallet.
 * Seeding that snapshot lets recap heal `saveBattleStats` write it
 * (incoming-below-stored is applied; the method never mints).
 *
 * Chronology:
 * 1. World mounts before the wallet query. Lock doka=0, unseeded. Canister 200.
 * 2. Victory `resolveBattleRewards` / `applyRewards` adds 80 (canister 280)
 *    then the replica rejects. Commit never runs. Lock stays 0.
 * 3. Recap heal spends 10. Leftover `resolveCommittedDoka` seeds 200.
 * 4. `saveBattleStats` writes 190. The 80 grant is gone.
 *
 * Boss Rush room-clear keep is an older persist PR
 * (`persistBossRushRewardsThroughLock`). One-shot keep, GameKey / feat
 * `#ok` floors, and portal +10 stay on older persist PRs. This notes skip
 * on handleBattleEnd transport-keep so leftover resolve swallows
 * `seedWallet` as null.
 *
 * Death / heal keep the original `resolveCommittedDokaForAbsoluteWrite`
 * call — an older persist PR inserts `resolveCommittedXpForAbsoluteWrite`
 * next to both. Wrap throws; leftover resolve swallows unknown seed errors
 * as null so the unseeded skip path runs.
 *
 * Explicit `applyRewards failed` (`#err`) means the canister did not add.
 * Do not note a skip then — a later heal must still persist.
 *
 * Production hook is `persistHandleBattleEndRewardsThroughLock` (enqueue +
 * `resolveBattleRewards`). WorldExploration still uses bare enqueue; that
 * file and `rewardResolver.ts` are occupied by older persist PRs, so this
 * PR does not restack them. Tests reproduce the call site. Restack the
 * handleBattleEnd persist job onto this helper after those PRs land.
 */

export const ABSOLUTE_WRITE_UNSEEDED_HANDLE_BATTLE_END_KEEP =
  "absolute write skipped: unseeded handleBattleEnd keep";

const unseededHandleBattleEndKeepWriteSkip = new WeakSet<object>();
const wrappedSeedWallet = new WeakSet<object>();

export type UnseededHandleBattleEndKeepWriteSkipPersist = {
  isWalletSeeded?: () => boolean;
  seedWallet?: (doka: number) => void;
  noteUnconfirmedCredit?: () => void;
};

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * `#err` / `applyRewards failed` means the canister did not add.
 * `applyRewards transport keep` is the older persist-PR keep throw.
 * Any other throw is after-or-during invoke — the replica may have the grant.
 */
export function shouldNoteUnseededHandleBattleEndTransportKeep(
  error: unknown,
): boolean {
  const msg = toMessage(error);
  if (!msg) return false;
  if (msg.includes("applyRewards failed")) return false;
  return true;
}

export function hasUnseededHandleBattleEndKeepWriteSkip(
  persist: object,
): boolean {
  return unseededHandleBattleEndKeepWriteSkip.has(persist);
}

export function clearUnseededHandleBattleEndKeepWriteSkip(
  persist: object,
): void {
  unseededHandleBattleEndKeepWriteSkip.delete(persist);
}

export function shouldSkipUnseededHandleBattleEndKeepAbsoluteWrite(persist: {
  isWalletSeeded?: () => boolean;
}): boolean {
  if (persist.isWalletSeeded?.() === true) {
    clearUnseededHandleBattleEndKeepWriteSkip(persist);
    return false;
  }
  return hasUnseededHandleBattleEndKeepWriteSkip(persist);
}

export function assertUnseededHandleBattleEndKeepAbsoluteWriteAllowed(persist: {
  isWalletSeeded?: () => boolean;
}): void {
  if (shouldSkipUnseededHandleBattleEndKeepAbsoluteWrite(persist)) {
    throw new Error(ABSOLUTE_WRITE_UNSEEDED_HANDLE_BATTLE_END_KEEP);
  }
}

function wrapSeedWalletOnce(
  persist: UnseededHandleBattleEndKeepWriteSkipPersist,
): void {
  if (!persist.seedWallet || wrappedSeedWallet.has(persist)) return;
  wrappedSeedWallet.add(persist);
  const orig = persist.seedWallet.bind(persist);
  persist.seedWallet = (doka: number) => {
    if (shouldSkipUnseededHandleBattleEndKeepAbsoluteWrite(persist)) {
      throw new Error(ABSOLUTE_WRITE_UNSEEDED_HANDLE_BATTLE_END_KEEP);
    }
    orig(doka);
  };
}

/**
 * After an unseeded handleBattleEnd transport-keep, refuse every
 * `seedWallet` until an authoritative `commit({ doka })` seeds the lock.
 * A later one-shot / GameKey `commit({ doka })` is not `seedWallet`, so
 * heals can then resolve against the post-credit wallet.
 *
 * Explicit canister `#err` does not note — there is no grant to protect.
 */
export function noteUnseededHandleBattleEndKeepWriteSkip(
  persist: UnseededHandleBattleEndKeepWriteSkipPersist,
  error: unknown,
): void {
  if (!shouldNoteUnseededHandleBattleEndTransportKeep(error)) return;
  if (typeof persist.isWalletSeeded !== "function") return;
  if (persist.isWalletSeeded()) {
    clearUnseededHandleBattleEndKeepWriteSkip(persist);
    return;
  }
  persist.noteUnconfirmedCredit?.();
  unseededHandleBattleEndKeepWriteSkip.add(persist);
  wrapSeedWalletOnce(persist);
}

/**
 * handleBattleEnd enqueues `resolveBattleRewards` then `commit`. That
 * path never entered `persistBossRushRewardsThroughLock`. Wrap the job
 * so a throw-after-add notes skip before recap heal can seed. Call this
 * instead of bare `enqueue` when restacking WorldExploration.
 */
export async function persistHandleBattleEndRewardsThroughLock<T>(
  lock: UnseededHandleBattleEndKeepWriteSkipPersist & {
    enqueue: <U>(fn: () => Promise<U>) => Promise<U>;
  },
  applyAndCommit: () => Promise<T>,
): Promise<T> {
  return lock.enqueue(async () => {
    try {
      return await applyAndCommit();
    } catch (err) {
      noteUnseededHandleBattleEndKeepWriteSkip(lock, err);
      throw err;
    }
  });
}
