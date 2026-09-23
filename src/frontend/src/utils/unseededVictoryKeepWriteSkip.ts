/**
 * Unseeded victory / Boss Rush `applyRewards` can land then throw.
 * `noteUnconfirmedCredit` only sets `unconfirmedWalletCredit` when the
 * persist lock is already seeded, so `resolveCommittedDokaForAbsoluteWrite`
 * still re-fetches and *seeds* whatever the replica returns.
 *
 * A stale in-flight `getCallerDokaBalance` is the pre-credit wallet.
 * Seeding that snapshot lets recap heal `saveBattleStats` write it
 * (incoming-below-stored is applied; the method never mints).
 *
 * Chronology:
 * 1. World mounts before the wallet query. Lock doka=0, unseeded. Canister 200.
 * 2. Victory / room-clear `applyRewards` adds 80 (canister 280) then the
 *    replica rejects. Commit never runs. Lock stays 0.
 * 3. Recap heal spends 10. Leftover `resolveCommittedDoka` seeds 200.
 * 4. `saveBattleStats` writes 190. The 80 grant is gone.
 *
 * One-shot keep is an older persist PR (`settleOneShotPersistLock`).
 * GameKey / feat `#ok` floors are older persist PRs. Portal +10 is XP-only
 * (older persist PR). This notes skip on victory / Boss Rush transport-keep
 * so leftover resolve swallows `seedWallet` as null.
 *
 * Death / heal keep the original `resolveCommittedDokaForAbsoluteWrite`
 * call — an older persist PR inserts `resolveCommittedXpForAbsoluteWrite`
 * next to both. Wrap throws; leftover resolve swallows unknown seed errors
 * as null so the unseeded skip path runs.
 *
 * Explicit `applyRewards failed` (`#err`) means the canister did not add.
 * Do not note a skip then — a later heal must still persist.
 */

export const ABSOLUTE_WRITE_UNSEEDED_VICTORY_KEEP =
  "absolute write skipped: unseeded victory keep";

const unseededVictoryKeepWriteSkip = new WeakSet<object>();
const wrappedSeedWallet = new WeakSet<object>();

export type UnseededVictoryKeepWriteSkipPersist = {
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
export function shouldNoteUnseededVictoryTransportKeep(
  error: unknown,
): boolean {
  const msg = toMessage(error);
  if (!msg) return false;
  if (msg.includes("applyRewards failed")) return false;
  return true;
}

export function hasUnseededVictoryKeepWriteSkip(persist: object): boolean {
  return unseededVictoryKeepWriteSkip.has(persist);
}

export function clearUnseededVictoryKeepWriteSkip(persist: object): void {
  unseededVictoryKeepWriteSkip.delete(persist);
}

export function shouldSkipUnseededVictoryKeepAbsoluteWrite(persist: {
  isWalletSeeded?: () => boolean;
}): boolean {
  if (persist.isWalletSeeded?.() === true) {
    clearUnseededVictoryKeepWriteSkip(persist);
    return false;
  }
  return hasUnseededVictoryKeepWriteSkip(persist);
}

export function assertUnseededVictoryKeepAbsoluteWriteAllowed(persist: {
  isWalletSeeded?: () => boolean;
}): void {
  if (shouldSkipUnseededVictoryKeepAbsoluteWrite(persist)) {
    throw new Error(ABSOLUTE_WRITE_UNSEEDED_VICTORY_KEEP);
  }
}

function wrapSeedWalletOnce(
  persist: UnseededVictoryKeepWriteSkipPersist,
): void {
  if (!persist.seedWallet || wrappedSeedWallet.has(persist)) return;
  wrappedSeedWallet.add(persist);
  const orig = persist.seedWallet.bind(persist);
  persist.seedWallet = (doka: number) => {
    if (shouldSkipUnseededVictoryKeepAbsoluteWrite(persist)) {
      throw new Error(ABSOLUTE_WRITE_UNSEEDED_VICTORY_KEEP);
    }
    orig(doka);
  };
}

/**
 * After an unseeded victory / Boss Rush transport-keep, refuse every
 * `seedWallet` until an authoritative `commit({ doka })` seeds the lock.
 * A later one-shot / GameKey `commit({ doka })` is not `seedWallet`, so
 * heals can then resolve against the post-credit wallet.
 *
 * Explicit canister `#err` does not note — there is no grant to protect.
 */
export function noteUnseededVictoryKeepWriteSkip(
  persist: UnseededVictoryKeepWriteSkipPersist,
  error: unknown,
): void {
  if (!shouldNoteUnseededVictoryTransportKeep(error)) return;
  if (typeof persist.isWalletSeeded !== "function") return;
  if (persist.isWalletSeeded()) {
    clearUnseededVictoryKeepWriteSkip(persist);
    return;
  }
  persist.noteUnconfirmedCredit?.();
  unseededVictoryKeepWriteSkip.add(persist);
  wrapSeedWalletOnce(persist);
}

let activeVictoryKeepPersist: UnseededVictoryKeepWriteSkipPersist | null = null;

/**
 * WorldExploration builds one persist lock per mount. Register it so
 * `resolveBattleRewards` throw-after-add can note the skip without a
 * WorldExploration import (older persist PRs occupy that file).
 */
export function registerUnseededVictoryKeepPersist(
  persist: UnseededVictoryKeepWriteSkipPersist,
): void {
  activeVictoryKeepPersist = persist;
}

/** Note skip on the registered world persist. No-op when none is registered. */
export function noteUnseededVictoryKeepWriteSkipOnActive(error: unknown): void {
  if (!activeVictoryKeepPersist) return;
  noteUnseededVictoryKeepWriteSkip(activeVictoryKeepPersist, error);
}
