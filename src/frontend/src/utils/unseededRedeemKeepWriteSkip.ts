/**
 * Unseeded GameKey / feat credit can land then throw.
 * `noteUnconfirmedCredit` only sets `unconfirmedWalletCredit` when the
 * persist lock is already seeded, so leftover
 * `resolveCommittedDokaForAbsoluteWrite` still re-fetches and *seeds*
 * whatever the replica returns.
 *
 * `redeemGameKeyThroughPersist` / `creditAchievementRewardThroughPersist`
 * only `noteUnseededCredit` on a parsed `#ok`. A replica reject after the
 * canister added never notes. `#ok` floors stay on older persist PRs.
 *
 * A stale in-flight `getCallerDokaBalance` is the pre-credit wallet.
 * Seeding that snapshot lets recap heal `saveBattleStats` write it
 * (incoming-below-stored is applied; the method never mints).
 *
 * Chronology (GameKey):
 * 1. World mounts before the wallet query. Lock doka=0, unseeded. Canister 200.
 * 2. `redeemGameKey` adds 1000 (canister 1200) then the replica rejects.
 *    `#ok` is never parsed. Commit never runs. Shop catch only toasts
 *    "Redeem failed" and clears in-flight. Lock stays 0.
 * 3. Recap heal spends 10. Leftover `resolveCommittedDoka` seeds 200.
 * 4. `saveBattleStats` writes 190. The paid 1000 is gone. Retry hits
 *    "already used".
 *
 * Portal keep is an older persist PR (`persistPortalXpThroughLock`).
 * handleBattleEnd keep, Boss Rush keep, one-shot keep, and GameKey / feat
 * `#ok` floors stay on older persist PRs. This notes skip on redeem / claim
 * transport-keep so leftover resolve swallows `seedWallet` as null.
 *
 * Death / heal keep the original `resolveCommittedDokaForAbsoluteWrite`
 * call — an older persist PR inserts `resolveCommittedXpForAbsoluteWrite`
 * next to both. Wrap throws; leftover resolve swallows unknown seed errors
 * as null so the unseeded skip path runs.
 *
 * Explicit `#err` (`already used`, `Invalid GameKey`, `already claimed`,
 * `redeemGameKey failed`, `claimAchievementReward failed`) means the
 * canister did not add. Do not note a skip then — a later heal must
 * still persist.
 *
 * Production hook is `persistRedeemThroughLock` / `persistClaimThroughLock`
 * (try/catch around the existing enqueue helpers). `DokaGameKeyShop` and
 * `shopPurchase.ts` / `achievementReward.ts` are occupied by older persist
 * PRs, so this PR does not restack them. Tests reproduce the call site.
 * Restack the shop / feat persist jobs onto these helpers after those PRs
 * land.
 */

export const ABSOLUTE_WRITE_UNSEEDED_REDEEM_KEEP =
  "absolute write skipped: unseeded redeem keep";

const unseededRedeemKeepWriteSkip = new WeakSet<object>();
const wrappedSeedWallet = new WeakSet<object>();

export type UnseededRedeemKeepWriteSkipPersist = {
  isWalletSeeded?: () => boolean;
  seedWallet?: (doka: number) => void;
  noteUnconfirmedCredit?: () => void;
};

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Parsed `#err` / `already used` / `already claimed` means the canister
 * did not add. `applyRewards failed` is an older persist-PR #err throw.
 * Any other throw is after-or-during invoke — the replica may have the grant.
 */
export function shouldNoteUnseededRedeemTransportKeep(error: unknown): boolean {
  const msg = toMessage(error);
  if (!msg) return false;
  const lower = msg.toLowerCase();
  if (msg.includes("applyRewards failed")) return false;
  if (lower.includes("redeemgamekey failed")) return false;
  if (lower.includes("claimachievementreward failed")) return false;
  if (lower.includes("already used")) return false;
  if (lower.includes("already claimed")) return false;
  if (lower.includes("invalid gamekey")) return false;
  if (lower.includes("not yet approved")) return false;
  if (lower.includes("gamekey is too short")) return false;
  return true;
}

export function hasUnseededRedeemKeepWriteSkip(persist: object): boolean {
  return unseededRedeemKeepWriteSkip.has(persist);
}

export function clearUnseededRedeemKeepWriteSkip(persist: object): void {
  unseededRedeemKeepWriteSkip.delete(persist);
}

export function shouldSkipUnseededRedeemKeepAbsoluteWrite(persist: {
  isWalletSeeded?: () => boolean;
}): boolean {
  if (persist.isWalletSeeded?.() === true) {
    clearUnseededRedeemKeepWriteSkip(persist);
    return false;
  }
  return hasUnseededRedeemKeepWriteSkip(persist);
}

export function assertUnseededRedeemKeepAbsoluteWriteAllowed(persist: {
  isWalletSeeded?: () => boolean;
}): void {
  if (shouldSkipUnseededRedeemKeepAbsoluteWrite(persist)) {
    throw new Error(ABSOLUTE_WRITE_UNSEEDED_REDEEM_KEEP);
  }
}

function wrapSeedWalletOnce(persist: UnseededRedeemKeepWriteSkipPersist): void {
  if (!persist.seedWallet || wrappedSeedWallet.has(persist)) return;
  wrappedSeedWallet.add(persist);
  const orig = persist.seedWallet.bind(persist);
  persist.seedWallet = (doka: number) => {
    if (shouldSkipUnseededRedeemKeepAbsoluteWrite(persist)) {
      throw new Error(ABSOLUTE_WRITE_UNSEEDED_REDEEM_KEEP);
    }
    orig(doka);
  };
}

/**
 * After an unseeded redeem / claim transport-keep, refuse every
 * `seedWallet` until an authoritative `commit({ doka })` seeds the lock.
 * A later one-shot / GameKey `commit({ doka })` is not `seedWallet`, so
 * heals can then resolve against the post-credit wallet.
 *
 * Explicit canister `#err` does not note — there is no grant to protect.
 */
export function noteUnseededRedeemKeepWriteSkip(
  persist: UnseededRedeemKeepWriteSkipPersist,
  error: unknown,
): void {
  if (!shouldNoteUnseededRedeemTransportKeep(error)) return;
  if (typeof persist.isWalletSeeded !== "function") return;
  if (persist.isWalletSeeded()) {
    clearUnseededRedeemKeepWriteSkip(persist);
    return;
  }
  persist.noteUnconfirmedCredit?.();
  unseededRedeemKeepWriteSkip.add(persist);
  wrapSeedWalletOnce(persist);
}

/**
 * `redeemGameKeyThroughPersist` already enqueues. Wrap the call so a
 * throw-after-add notes skip before recap heal can seed. Call this
 * instead of the bare helper when restacking DokaGameKeyShop.
 */
export async function persistRedeemThroughLock<T>(
  lock: UnseededRedeemKeepWriteSkipPersist,
  redeem: () => Promise<T>,
): Promise<T> {
  try {
    return await redeem();
  } catch (err) {
    noteUnseededRedeemKeepWriteSkip(lock, err);
    throw err;
  }
}

/**
 * `creditAchievementRewardThroughPersist` already enqueues. Same keep
 * as GameKey: `#ok` floors stay on older persist PRs; throw-after-add
 * never noted.
 */
export async function persistClaimThroughLock<T>(
  lock: UnseededRedeemKeepWriteSkipPersist,
  claim: () => Promise<T>,
): Promise<T> {
  try {
    return await claim();
  } catch (err) {
    noteUnseededRedeemKeepWriteSkip(lock, err);
    throw err;
  }
}
