/**
 * Seeded GameKey / feat credit can land then throw.
 *
 * `redeemGameKeyThroughPersist` / `creditAchievementRewardThroughPersist`
 * only `noteUnseededCredit` on a parsed `#ok`. A replica reject after the
 * canister added never notes. `noteUnconfirmedCredit` *does* set
 * `unconfirmedWalletCredit` when the lock is already seeded — but nothing
 * on the redeem / claim catch calls it (shop catch only toasts).
 *
 * Leftover `resolveCommittedDokaForAbsoluteWrite` then returns the
 * pre-credit lock snapshot immediately (`seeded && !unconfirmed`). Recap
 * heal `saveBattleStats` writes that snapshot (incoming-below-stored is
 * applied; the method never mints). The paid grant is gone. Retry hits
 * "already used" / "already claimed".
 *
 * Unseeded throw-after-add stays on an older persist PR
 * (`unseededRedeemKeepWriteSkip` / `persistRedeemThroughLock`). That helper
 * returns without noting when `isWalletSeeded()` is true.
 *
 * Chronology (GameKey):
 * 1. World hydrated. Lock doka=200, seeded. Canister 200.
 * 2. `redeemGameKey` adds 1000 (canister 1200) then the replica rejects.
 *    `#ok` is never parsed. Commit never runs. Shop catch only toasts
 *    "Redeem failed" and clears in-flight. Lock stays 200.
 *    `unconfirmedWalletCredit` stays false.
 * 3. Recap heal spends 10. Leftover resolve returns 200 with no fetch.
 * 4. `saveBattleStats` writes 190. The paid 1000 is gone.
 *
 * Same wipe for `claimAchievementReward` throw-after-add (feat grant 100:
 * leftover writes 190).
 *
 * This notes `noteUnconfirmedCredit` on redeem / claim transport-keep so
 * leftover resolve re-fetches. A stale live ≤ committed throws
 * `ABSOLUTE_WRITE_UNCONFIRMED_CREDIT` and skips the write. A live rise
 * seeds then the heal spend applies to the post-credit wallet.
 *
 * Explicit `#err` (`already used`, `Invalid GameKey`, `already claimed`,
 * `redeemGameKey failed`, `claimAchievementReward failed`) means the
 * canister did not add. Do not note then — a later heal must still persist.
 *
 * Production hook is `persistSeededRedeemThroughLock` /
 * `persistSeededClaimThroughLock` (try/catch around the existing enqueue
 * helpers). `DokaGameKeyShop`, `shopPurchase.ts`, `achievementReward.ts`,
 * and `WorldExploration.tsx` are occupied by older persist PRs, so this
 * PR does not restack them. Tests reproduce the call site. Restack the
 * shop / feat persist jobs onto these helpers after those PRs land.
 *
 * Death / heal keep the original `resolveCommittedDokaForAbsoluteWrite`
 * call — an older persist PR inserts `resolveCommittedXpForAbsoluteWrite`
 * next to both.
 */

import { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT } from "./progressPersist.ts";

export { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT };

export type SeededCreditKeepWriteSkipPersist = {
  isWalletSeeded?: () => boolean;
  noteUnconfirmedCredit?: () => void;
  hasUnconfirmedWalletCredit?: () => boolean;
};

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Parsed `#err` / `already used` / `already claimed` means the canister
 * did not add. `applyRewards failed` is an older persist-PR #err throw.
 * Any other throw is after-or-during invoke — the replica may have the grant.
 */
export function shouldNoteSeededCreditTransportKeep(error: unknown): boolean {
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

/**
 * After a seeded redeem / claim transport-keep, force the next absolute
 * write to re-fetch. A stale snapshot must not wipe the grant.
 *
 * Unseeded throw-after-add is an older persist PR (seedWallet wrap). Do
 * not note here — leftover resolve still fetches, and this flag only
 * skips when `live <= committed` on a *seeded* lock.
 */
export function noteSeededCreditKeepWriteSkip(
  persist: SeededCreditKeepWriteSkipPersist,
  error: unknown,
): void {
  if (!shouldNoteSeededCreditTransportKeep(error)) return;
  if (persist.isWalletSeeded?.() !== true) return;
  persist.noteUnconfirmedCredit?.();
}

/**
 * `redeemGameKeyThroughPersist` already enqueues. Wrap the call so a
 * throw-after-add notes unconfirmed before recap heal can write the
 * pre-credit snapshot. Call this instead of the bare helper when
 * restacking DokaGameKeyShop.
 */
export async function persistSeededRedeemThroughLock<T>(
  lock: SeededCreditKeepWriteSkipPersist,
  redeem: () => Promise<T>,
): Promise<T> {
  try {
    return await redeem();
  } catch (err) {
    noteSeededCreditKeepWriteSkip(lock, err);
    throw err;
  }
}

/**
 * `creditAchievementRewardThroughPersist` already enqueues. Same keep
 * as GameKey: `#ok` floors stay on older persist PRs; throw-after-add
 * never noted on a seeded lock.
 */
export async function persistSeededClaimThroughLock<T>(
  lock: SeededCreditKeepWriteSkipPersist,
  claim: () => Promise<T>,
): Promise<T> {
  try {
    return await claim();
  } catch (err) {
    noteSeededCreditKeepWriteSkip(lock, err);
    throw err;
  }
}
