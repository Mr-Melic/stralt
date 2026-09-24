/**
 * Unseeded portal `persistIncrementalRewards` can land then throw.
 * `noteUnconfirmedCredit` only sets `unconfirmedWalletCredit` when the
 * persist lock is already seeded, so leftover
 * `resolveCommittedDokaForAbsoluteWrite` still re-fetches and *seeds*
 * whatever the replica returns.
 *
 * Portal +10 is XP-only (`dokaDelta` 0). Recap heal / death
 * `saveBattleStats` still writes leftover XP from the lock in the same
 * absolute snapshot. Seeding the pre-credit wallet lets that write
 * persist Play-entry leftover and wipe the +10 (incoming-below-stored
 * is applied; the method never mints).
 *
 * Chronology:
 * 1. World mounts before the wallet query. Lock doka=0, unseeded.
 *    Lock XP = Play-entry leftover 80. Canister Doka 200, XP 80.
 * 2. Portal `persistIncrementalRewards(0, 10)` adds leftover 80→90
 *    then the replica rejects. Commit never runs. Catch only
 *    `console.warn`. Lock stays doka=0 / xp=80.
 * 3. Recap heal spends 10. Leftover `resolveCommittedDoka` seeds 200.
 * 4. `saveBattleStats` writes Doka 190 and XP 80. The +10 is gone.
 *
 * handleBattleEnd keep is an older persist PR
 * (`persistHandleBattleEndRewardsThroughLock`). Boss Rush keep, one-shot
 * keep, GameKey / feat floors, and seeded portal XP confirm
 * (`persistIncrementalXpThroughLock`) stay on older persist PRs. This
 * notes skip on portal transport-keep so leftover resolve swallows
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
 * Production hook is `persistPortalXpThroughLock` (enqueue +
 * `persistIncrementalRewards`). WorldExploration still uses bare enqueue;
 * that file and `applyRewardsResult.ts` are occupied by older persist PRs,
 * so this PR does not restack them. Tests reproduce the call site. Restack
 * the portal persist job onto this helper after those PRs land.
 */

export const ABSOLUTE_WRITE_UNSEEDED_PORTAL_KEEP =
  "absolute write skipped: unseeded portal keep";

const unseededPortalKeepWriteSkip = new WeakSet<object>();
const wrappedSeedWallet = new WeakSet<object>();

export type UnseededPortalKeepWriteSkipPersist = {
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
export function shouldNoteUnseededPortalTransportKeep(error: unknown): boolean {
  const msg = toMessage(error);
  if (!msg) return false;
  if (msg.includes("applyRewards failed")) return false;
  return true;
}

export function hasUnseededPortalKeepWriteSkip(persist: object): boolean {
  return unseededPortalKeepWriteSkip.has(persist);
}

export function clearUnseededPortalKeepWriteSkip(persist: object): void {
  unseededPortalKeepWriteSkip.delete(persist);
}

export function shouldSkipUnseededPortalKeepAbsoluteWrite(persist: {
  isWalletSeeded?: () => boolean;
}): boolean {
  if (persist.isWalletSeeded?.() === true) {
    clearUnseededPortalKeepWriteSkip(persist);
    return false;
  }
  return hasUnseededPortalKeepWriteSkip(persist);
}

export function assertUnseededPortalKeepAbsoluteWriteAllowed(persist: {
  isWalletSeeded?: () => boolean;
}): void {
  if (shouldSkipUnseededPortalKeepAbsoluteWrite(persist)) {
    throw new Error(ABSOLUTE_WRITE_UNSEEDED_PORTAL_KEEP);
  }
}

function wrapSeedWalletOnce(persist: UnseededPortalKeepWriteSkipPersist): void {
  if (!persist.seedWallet || wrappedSeedWallet.has(persist)) return;
  wrappedSeedWallet.add(persist);
  const orig = persist.seedWallet.bind(persist);
  persist.seedWallet = (doka: number) => {
    if (shouldSkipUnseededPortalKeepAbsoluteWrite(persist)) {
      throw new Error(ABSOLUTE_WRITE_UNSEEDED_PORTAL_KEEP);
    }
    orig(doka);
  };
}

/**
 * After an unseeded portal transport-keep, refuse every `seedWallet`
 * until an authoritative `commit({ doka })` seeds the lock. A later
 * one-shot / GameKey `commit({ doka })` is not `seedWallet`, so heals
 * can then resolve against the post-credit wallet.
 *
 * Explicit canister `#err` does not note — there is no grant to protect.
 */
export function noteUnseededPortalKeepWriteSkip(
  persist: UnseededPortalKeepWriteSkipPersist,
  error: unknown,
): void {
  if (!shouldNoteUnseededPortalTransportKeep(error)) return;
  if (typeof persist.isWalletSeeded !== "function") return;
  if (persist.isWalletSeeded()) {
    clearUnseededPortalKeepWriteSkip(persist);
    return;
  }
  persist.noteUnconfirmedCredit?.();
  unseededPortalKeepWriteSkip.add(persist);
  wrapSeedWalletOnce(persist);
}

/**
 * Portal transition enqueues `persistIncrementalRewards(0, 10)` then
 * `commit({ xp, level })`. That path never entered handleBattleEnd or
 * Boss Rush keep helpers. Wrap the job so a throw-after-add notes skip
 * before recap heal can seed. Call this instead of bare `enqueue` when
 * restacking WorldExploration.
 */
export async function persistPortalXpThroughLock<T>(
  lock: UnseededPortalKeepWriteSkipPersist & {
    enqueue: <U>(fn: () => Promise<U>) => Promise<U>;
  },
  applyAndCommit: () => Promise<T>,
): Promise<T> {
  return lock.enqueue(async () => {
    try {
      return await applyAndCommit();
    } catch (err) {
      noteUnseededPortalKeepWriteSkip(lock, err);
      throw err;
    }
  });
}
