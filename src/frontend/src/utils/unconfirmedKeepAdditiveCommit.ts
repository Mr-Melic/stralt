/**
 * Seeded one-shot transport-keep (`noteUnconfirmedCredit`) plus a later
 * feat claim / GameKey redeem additive commit.
 *
 * `commit({ doka })` clears `unconfirmedWalletCredit` on any Doka write,
 * including a wallet *rise*. Older persist PRs keep the flag through a
 * spend (`shouldClearUnconfirmedWalletCredit`) and re-fetch after a
 * throw-after-add (`noteUnconfirmedCredit` on the catch). They do not
 * stop `creditAchievementRewardThroughPersist` /
 * `redeemGameKeyThroughPersist` from adding `#ok` onto the *pre-keep*
 * lock snapshot.
 *
 * Chronology (feat after shrine/ground/dungeon-complete keep):
 * 1. World hydrated. Lock doka=200, seeded. Canister 200.
 * 2. Ground Doka `applyRewards` +50 then throws. Settle `keep`.
 *    `noteUnconfirmedCredit`. Canister 250. Lock stays 200.
 * 3. Claim `#ok(100)`. Leftover `commit({ doka: 200+100 })` → 300 and
 *    *clears* unconfirmed (a rise). Canister 350. Lock 300.
 * 4. Recap heal spends 10. Leftover `resolveCommittedDoka` returns 300
 *    with no fetch (`seeded && !unconfirmed`).
 * 5. `saveBattleStats` writes 290. Incoming-below-stored is applied;
 *    the method never mints. The 50 pickup is gone.
 *
 * Same wipe-class for GameKey `#ok(1000)`: leftover writes 1190 against
 * canister 1250.
 *
 * An absolute `applyRewards` `newDoka` commit is the live canister
 * (pickup included) and must still run on the raw lock. Gate only the
 * additive claim/redeem helpers.
 *
 * Production hook is `persistClaimThroughUnconfirmedKeep` /
 * `persistRedeemThroughUnconfirmedKeep`. `WorldExploration.tsx`,
 * `achievementReward.ts`, `shopPurchase.ts`, and `DokaGameKeyShop.tsx`
 * are occupied by older persist PRs, so this PR does not restack them.
 * Tests reproduce the call site. Restack the feat / GameKey persist jobs
 * onto these helpers after those PRs land.
 *
 * Death / heal keep the original `resolveCommittedDokaForAbsoluteWrite`
 * call — an older persist PR inserts `resolveCommittedXpForAbsoluteWrite`
 * next to both.
 */

import { creditAchievementRewardThroughPersist } from "./achievementReward.ts";
import { redeemGameKeyThroughPersist } from "./shopPurchase.ts";

export type UnconfirmedKeepAdditivePersist = {
  enqueue: <T>(fn: () => Promise<T>) => Promise<T>;
  commit: (next: { doka?: number }) => void;
  snapshot: () => { doka: number };
  isWalletSeeded: () => boolean;
  hasUnconfirmedWalletCredit?: () => boolean;
  noteUnconfirmedCredit?: () => void;
  noteUnseededCredit?: () => void;
};

/**
 * Additive `#ok` onto a seeded lock is safe only when that snapshot is
 * confirmed. A keep-flagged lock is the pre-credit wallet; committing
 * `snapshot + grant` would clear unconfirmed and let recap heal wipe
 * the kept pickup.
 */
export function shouldCommitAdditiveCreditOnLock(args: {
  walletSeeded: boolean;
  unconfirmedWalletCredit: boolean;
}): boolean {
  return args.walletSeeded === true && args.unconfirmedWalletCredit !== true;
}

/**
 * Wrap `commit` so an additive Doka write is skipped while the lock is
 * in seeded one-shot keep. Victory / heal / death still use the raw
 * persist object (absolute `newDoka` / re-fetched spend).
 */
export function gateAdditiveCommitWhileUnconfirmed<
  T extends UnconfirmedKeepAdditivePersist,
>(persist: T): T {
  return {
    ...persist,
    commit(next: { doka?: number }) {
      if (
        next.doka != null &&
        persist.hasUnconfirmedWalletCredit?.() === true
      ) {
        persist.noteUnconfirmedCredit?.();
        return;
      }
      persist.commit(next);
    },
  };
}

/**
 * `creditAchievementRewardThroughPersist` already enqueues. Wrap the
 * persist object so `#ok` cannot commit onto a kept pre-credit snapshot.
 * Call this instead of the bare helper when restacking AchievementsPanel.
 */
export async function persistClaimThroughUnconfirmedKeep(
  actor: Parameters<typeof creditAchievementRewardThroughPersist>[0],
  persist: UnconfirmedKeepAdditivePersist,
  achievementId: string,
): ReturnType<typeof creditAchievementRewardThroughPersist> {
  return creditAchievementRewardThroughPersist(
    actor,
    gateAdditiveCommitWhileUnconfirmed(persist),
    achievementId,
  );
}

/**
 * `redeemGameKeyThroughPersist` already enqueues. Same gate as feat
 * claim: `#ok` must not clear a seeded keep by adding onto the stale lock.
 */
export async function persistRedeemThroughUnconfirmedKeep(
  actor: Parameters<typeof redeemGameKeyThroughPersist>[0],
  persist: UnconfirmedKeepAdditivePersist,
  code: string,
): ReturnType<typeof redeemGameKeyThroughPersist> {
  return redeemGameKeyThroughPersist(
    actor,
    gateAdditiveCommitWhileUnconfirmed(persist),
    code,
  );
}
