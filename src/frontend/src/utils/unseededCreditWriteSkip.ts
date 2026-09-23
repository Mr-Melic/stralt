/**
 * Unseeded GameKey / feat `#ok` leaves the persist lock at placeholder 0
 * (`shouldCommitGameKeyRedeem` / `shouldCommitAchievementCredit` are false
 * so grant-only cannot seed). The next heal/shop/death still calls
 * `resolveCommittedDokaForAbsoluteWrite`, which re-fetches and *seeds*
 * whatever the replica returns.
 *
 * #482 refuses `seedWallet` when live < grant. A feat grant of 100 still
 * accepts a stale pre-credit wallet of 200 (`200 >= 100`). Recap heal then
 * `saveBattleStats`-writes 190 — wiping the 100 (incoming-below-stored;
 * the method never mints).
 *
 * Spell-upgrade `commit({ doka: query })` seeds without going through
 * `seedWallet`, so that wrap never sees a stale 200 either.
 *
 * Chronology (small feat grant):
 * 1. World mounts before the wallet query. Lock doka=0, unseeded. Canister 200.
 * 2. claimAchievementReward `#ok(100)`. Canister 200→300. Lock stays 0.
 * 3. Recap heal spends 10. Leftover `resolveCommittedDoka` seeds 200.
 * 4. `saveBattleStats` writes 190. The 100 grant is gone.
 *
 * Chronology (spell-upgrade commit bypass):
 * 1. Same unseeded mount. redeemGameKey `#ok(1000)`. Canister 1200.
 * 2. Player upgrades a spell. `committedBefore` is 0; stale
 *    `getCallerDokaBalance` is 200. `committedDokaAfterSpellUpgrade`
 *    returns 200 (`before === 0` keeps the query). `commit({ doka: 200 })`
 *    seeds the lock. Recap heal writes 190 and wipes the paid 1000.
 *
 * While an unseeded `#ok` is outstanding, wrap `seedWallet` so leftover
 * `resolveCommittedDoka` throws and is swallowed as null (existing
 * unseeded skip). Do not `commit` an upgrade query either. A later
 * `applyRewards` `commit({ doka: newDoka })` seeds the lock; heals then
 * proceed against the post-credit wallet.
 *
 * Notes the floor inside `creditAchievementRewardThroughPersist` /
 * `redeemGameKeyThroughPersist` so WorldExploration claim/redeem sites
 * stay the #482 insert. Death/heal keep the original
 * `resolveCommittedDokaForAbsoluteWrite` call — #356 inserts
 * `resolveCommittedXpForAbsoluteWrite` next to both. Do not add a WX
 * import hole after summonControlCast (#482 occupies that with
 * `unseededCreditFloor`).
 */

export const ABSOLUTE_WRITE_UNSEEDED_CREDIT =
  "absolute write skipped: unseeded credit";

const unseededCreditWriteSkipFloor = new WeakMap<object, number>();
const wrappedSeedWallet = new WeakSet<object>();

export type UnseededCreditWriteSkipPersist = {
  isWalletSeeded: () => boolean;
  seedWallet?: (doka: number) => void;
  unseededCreditWriteSkipFloor?: number;
};

function toNat(n: number): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

export function getUnseededCreditWriteSkipFloor(persist: object): number {
  return (
    (persist as UnseededCreditWriteSkipPersist).unseededCreditWriteSkipFloor ??
    unseededCreditWriteSkipFloor.get(persist) ??
    0
  );
}

export function clearUnseededCreditWriteSkip(persist: object): void {
  unseededCreditWriteSkipFloor.delete(persist);
  (persist as UnseededCreditWriteSkipPersist).unseededCreditWriteSkipFloor =
    undefined;
}

function wrapSeedWalletOnce(persist: UnseededCreditWriteSkipPersist): void {
  if (!persist.seedWallet || wrappedSeedWallet.has(persist)) return;
  wrappedSeedWallet.add(persist);
  const orig = persist.seedWallet.bind(persist);
  persist.seedWallet = (doka: number) => {
    if (shouldSkipUnseededCreditAbsoluteWrite(persist)) {
      throw new Error(ABSOLUTE_WRITE_UNSEEDED_CREDIT);
    }
    orig(doka);
  };
}

/**
 * After an unseeded `#ok`, remember that a grant is outstanding so a later
 * absolute write cannot seed a stale pre-credit snapshot. Seeded locks
 * already committed lock+grant. Sum repeated unseeded credits (feat then
 * GameKey) so a stale mid-pair snapshot cannot sneak under the first floor.
 *
 * Wraps `seedWallet` once so leftover `resolveCommittedDoka` (which
 * swallows unknown throws as null) cannot seed. WorldExploration death /
 * heal sites stay the original call.
 */
export function noteUnseededCreditWriteSkip(
  persist: UnseededCreditWriteSkipPersist,
  gained: number,
): void {
  if (persist.isWalletSeeded()) return;
  const add = toNat(gained);
  if (add <= 0) return;
  const next = getUnseededCreditWriteSkipFloor(persist) + add;
  unseededCreditWriteSkipFloor.set(persist, next);
  persist.unseededCreditWriteSkipFloor = next;
  wrapSeedWalletOnce(persist);
}

/**
 * Skip saveBattleStats while an unseeded `#ok` has not yet been absorbed by
 * an authoritative `commit({ doka })`. Once the lock is seeded (victory /
 * one-shot applyRewards), clear the floor and let the existing resolve path
 * run.
 *
 * Unlike #482's `live < grant` test, this refuses the 200-vs-100 false
 * accept: any fetch while the floor is outstanding can be the pre-credit
 * replica.
 */
export function shouldSkipUnseededCreditAbsoluteWrite(persist: {
  isWalletSeeded: () => boolean;
}): boolean {
  if (persist.isWalletSeeded()) {
    clearUnseededCreditWriteSkip(persist);
    return false;
  }
  return getUnseededCreditWriteSkipFloor(persist) > 0;
}

export function assertUnseededCreditAbsoluteWriteAllowed(persist: {
  isWalletSeeded: () => boolean;
}): void {
  if (shouldSkipUnseededCreditAbsoluteWrite(persist)) {
    throw new Error(ABSOLUTE_WRITE_UNSEEDED_CREDIT);
  }
}

/**
 * Unseeded upgrade used to `commit({ doka: post-upgrade query })` so the
 * next heal would not double-charge the spend. After an unseeded GameKey /
 * feat `#ok`, that query is the stale pre-credit wallet and must not seed.
 */
export function shouldCommitSpellUpgradeAfterUnseededCredit(persist: {
  isWalletSeeded: () => boolean;
}): boolean {
  if (persist.isWalletSeeded()) return true;
  return getUnseededCreditWriteSkipFloor(persist) <= 0;
}
