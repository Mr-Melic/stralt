/**
 * Doka credits that stay live during the Death Realm wait.
 *
 * persistDeathPenalty restores respawn HP in the same death tick, then waits
 * 1.5s (exploration) / 300ms (in-battle lava). Portals and encounters already
 * use isDeathRealmTransitionPending. Heal is an older persist PR; Items buy
 * is an older persist PR; Rename / Spellbook Upgrade are an older persist PR.
 * Recap overlay is pointer-events: none, so HUD Trophy (Feats Claim) and
 * Buy Doka (GameKey redeem) stay clickable.
 *
 * Those writes (claimAchievementReward +N, redeemGameKey +N) land after the
 * 20/40 snapshot. The feat / GameKey is one-shot consumed, and the grant is
 * not taxed by death. A later recap heal saveBattleStats then persists the
 * post-credit wallet — extra Doka that survived Death Realm load / reload.
 *
 * WorldExploration persistAchievementClaim / DokaGameKeyShop are occupied by
 * older persist PRs, so this PR does not restack them. Production hook is
 * persistClaimThroughDeathRealmGate / persistRedeemThroughDeathRealmGate.
 * Tests reproduce the call site. Restack those handlers onto this helper
 * after those PRs land.
 *
 * Does not restack achievementReward.ts, shopPurchase.ts, deathGuards.ts,
 * deathPenalty.ts, itemShop.ts, or WorldExploration.tsx.
 */

import { shouldBeginAchievementClaim } from "./achievementReward.ts";
import { shouldStartShopPurchase } from "./shopPurchase.ts";

/** False while the Death Realm timer is pending after HP restore. */
export function shouldAllowProgressCreditDuringDeathRealm(
  deathRealmPending: boolean | undefined,
): boolean {
  return deathRealmPending !== true;
}

/**
 * Feats Claim during the wait credits Doka after the death snapshot and
 * consumes the one-shot reward. Wraps shouldBeginAchievementClaim so
 * achievementReward.ts stays on older persist PRs.
 */
export function shouldStartAchievementClaimDuringDeathRealm(args: {
  inFlightIds: ReadonlySet<string>;
  achievementId: string;
  deathRealmPending?: boolean;
}): boolean {
  if (!shouldAllowProgressCreditDuringDeathRealm(args.deathRealmPending)) {
    return false;
  }
  return shouldBeginAchievementClaim(args.inFlightIds, args.achievementId);
}

/**
 * GameKey redeem during the wait credits the paid grant after the death
 * snapshot and consumes the single-use code. Wraps shouldStartShopPurchase
 * so shopPurchase.ts stays on older persist PRs.
 */
export function shouldStartGameKeyRedeemDuringDeathRealm(args: {
  inFlight: boolean;
  deathRealmPending?: boolean;
}): boolean {
  if (!shouldAllowProgressCreditDuringDeathRealm(args.deathRealmPending)) {
    return false;
  }
  return shouldStartShopPurchase(args.inFlight);
}

export const DEATH_REALM_CREDIT_BLOCKED = "Death Realm is loading";

/**
 * persistAchievementClaim enqueues claimAchievementReward on the persist
 * lock. Call this instead of the bare persist job when restacking
 * WorldExploration so a Claim click during the 1.5s wait cannot land
 * after the 20/40 snapshot.
 */
export async function persistClaimThroughDeathRealmGate<T>(
  deathRealmPending: boolean | undefined,
  persistClaim: () => Promise<T>,
): Promise<T | { err: string }> {
  if (!shouldAllowProgressCreditDuringDeathRealm(deathRealmPending)) {
    return { err: DEATH_REALM_CREDIT_BLOCKED };
  }
  return persistClaim();
}

/**
 * DokaGameKeyShop redeem enqueues redeemGameKey on the persist lock.
 * Call this instead of the bare redeem job when restacking that shop.
 */
export async function persistRedeemThroughDeathRealmGate<T>(
  deathRealmPending: boolean | undefined,
  persistRedeem: () => Promise<T>,
): Promise<T | { err: string }> {
  if (!shouldAllowProgressCreditDuringDeathRealm(deathRealmPending)) {
    return { err: DEATH_REALM_CREDIT_BLOCKED };
  }
  return persistRedeem();
}
