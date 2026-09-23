/**
 * Unseeded one-shot transport-keep (`settleOneShotPersistLock` →
 * `noteUnconfirmedCredit`) leaves the persist lock at placeholder 0.
 * `unconfirmedWalletCredit` is only set when the lock is already seeded,
 * so `resolveCommittedDokaForAbsoluteWrite` still re-fetches and *seeds*
 * whatever the replica returns.
 *
 * A stale in-flight `getCallerDokaBalance` is the pre-credit wallet.
 * Seeding that snapshot lets `saveBattleStats` write it
 * (incoming-below-stored is applied; the method never mints).
 *
 * Chronology (ground / shrine / dungeon-complete keep):
 * 1. World mounts before the wallet query. Lock doka=0, unseeded. Canister 200.
 * 2. Pickup `applyRewards` adds 50 (canister 250) then the replica rejects.
 *    Settle is `keep` (do not remint). `noteUnconfirmedCredit` only blocks
 *    idle hydrate.
 * 3. Recap heal spends 10. Leftover `resolveCommittedDoka` seeds 200.
 * 4. `saveBattleStats` writes 190. The 50 grant is gone.
 *
 * Seeded keep already re-fetches and skips when live ≤ committed
 * (`ABSOLUTE_WRITE_UNCONFIRMED_CREDIT`). GameKey / feat `#ok` floors are
 * older persist PRs. `settleOneShotPersistLock` notes this skip on keep
 * so WorldExploration stays off this delta (older persist PRs occupy
 * the summonControlCast import hole).
 *
 * Death / heal keep the original `resolveCommittedDokaForAbsoluteWrite`
 * call — #356 inserts `resolveCommittedXpForAbsoluteWrite` next to both.
 * Wrap throws; leftover resolve swallows unknown seed errors as null so
 * the unseeded skip path runs.
 */

export const ABSOLUTE_WRITE_UNSEEDED_KEEP =
  "absolute write skipped: unseeded keep";

const unseededKeepWriteSkip = new WeakSet<object>();
const wrappedNote = new WeakSet<object>();
const wrappedSeedWallet = new WeakSet<object>();

export type UnseededKeepWriteSkipPersist = {
  isWalletSeeded: () => boolean;
  seedWallet?: (doka: number) => void;
  noteUnconfirmedCredit?: () => void;
};

export function hasUnseededKeepWriteSkip(persist: object): boolean {
  return unseededKeepWriteSkip.has(persist);
}

export function clearUnseededKeepWriteSkip(persist: object): void {
  unseededKeepWriteSkip.delete(persist);
}

/**
 * After an unseeded keep, refuse every `seedWallet` until an authoritative
 * `commit({ doka })` seeds the lock. A later victory / one-shot `#ok`
 * commit is not `seedWallet`, so heals can then resolve against the
 * post-credit wallet.
 */
export function noteUnseededKeepWriteSkip(
  persist: UnseededKeepWriteSkipPersist,
): void {
  if (persist.isWalletSeeded()) {
    clearUnseededKeepWriteSkip(persist);
    return;
  }
  unseededKeepWriteSkip.add(persist);
  wrapSeedWalletOnce(persist);
}

export function shouldSkipUnseededKeepAbsoluteWrite(persist: {
  isWalletSeeded: () => boolean;
}): boolean {
  if (persist.isWalletSeeded()) {
    clearUnseededKeepWriteSkip(persist);
    return false;
  }
  return hasUnseededKeepWriteSkip(persist);
}

export function assertUnseededKeepAbsoluteWriteAllowed(persist: {
  isWalletSeeded: () => boolean;
}): void {
  if (shouldSkipUnseededKeepAbsoluteWrite(persist)) {
    throw new Error(ABSOLUTE_WRITE_UNSEEDED_KEEP);
  }
}

function wrapSeedWalletOnce(persist: UnseededKeepWriteSkipPersist): void {
  if (!persist.seedWallet || wrappedSeedWallet.has(persist)) return;
  wrappedSeedWallet.add(persist);
  const orig = persist.seedWallet.bind(persist);
  persist.seedWallet = (doka: number) => {
    if (shouldSkipUnseededKeepAbsoluteWrite(persist)) {
      throw new Error(ABSOLUTE_WRITE_UNSEEDED_KEEP);
    }
    orig(doka);
  };
}

function wrapNoteUnconfirmedCreditOnce(
  persist: UnseededKeepWriteSkipPersist,
): void {
  if (!persist.noteUnconfirmedCredit || wrappedNote.has(persist)) return;
  wrappedNote.add(persist);
  const orig = persist.noteUnconfirmedCredit.bind(persist);
  persist.noteUnconfirmedCredit = () => {
    orig();
    noteUnseededKeepWriteSkip(persist);
  };
}

/**
 * Optional intercept for tests / leftover `noteUnconfirmedCredit` callers
 * that do not go through `settleOneShotPersistLock`. Production keep is
 * noted inside that settle. Idempotent.
 */
export function wrapUnseededKeepWriteSkip<
  T extends UnseededKeepWriteSkipPersist,
>(persist: T): T {
  wrapNoteUnconfirmedCreditOnce(persist);
  return persist;
}
