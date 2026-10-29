/**
 * Jackpot Heal feat (`jackpot_heal`, 200 Doka) unlocks from
 * `WorldExploration.tsx` 2287–2290 as soon as `jackpotHealVisible` is
 * true. The heal click sets that banner at 18436–18443 **before**
 * `persistAbsoluteProgress` (18456–18484) settles. A failed
 * `saveBattleStats` then rolls HP/Doka back via
 * `shouldRollbackFailedHeal` and never clears the banner or the
 * `achievementsShownRef` / `markAchievementUnlocked` side effect.
 *
 * #964 / #860 stamp remount leftover **wallet / HP** after a shop/heal
 * throw-after-accept (`pbv_absolute_doka_throw_keep_remount_slotN`).
 * Those helpers never write feat unlock. #1308 gates `loot_10_doka`
 * until ground-Doka settle `commit`. #1268 is spell-bar keep.
 * #1276 is shop inventory. Heal click is `saveBattleStats`, not
 * `applyRewards`.
 *
 * Chronology:
 * 1. World hydrated. HP 50/200. Canister Doka 200. Lock seeded 200.
 *    Jackpot feat locked.
 * 2. Overworld Heal click. `resolveOverworldHealSpend` jackpot=true.
 *    Optimistic HP 200, Doka 199, `setJackpotHealVisible(true)`.
 *    Maps-visit-style useEffect fires `checkAndFireAchievement(
 *    "jackpot_heal")` → `markAchievementUnlocked`. Persist still in
 *    flight. No unpaid death.
 * 3. `persistAbsoluteProgress` catch returns false (unseeded skip /
 *    replica reject / transport). `shouldRollbackFailedHeal` is true
 *    (live still matches this click). HP 50 and Doka 200 restored.
 *    Banner stays up for 3s. Feat stays unlocked. #964 does **not**
 *    stamp (explicit false, not a throw-after-add keep).
 * 4. Claim Jackpot. Unique leftover: 200 Doka feat from a heal the
 *    canister never took. Remount still has the unlock; HP/Doka are
 *    the pre-click snapshot.
 *
 * This sidecar unlocks only when persist returns true. `false` must
 * not unlock (safe retry / delayed feat is safer than minting 200
 * Doka). Transport throw-after-accept that returns false is
 * unconfirmed — do not unlock (#1308 `keep` / #964 honour replica
 * **Doka**, not this feat). Banner juice may still fire on click.
 *
 * `WorldExploration.tsx`, `itemShop.ts`, `progressPersist.ts`,
 * `deathPenalty.ts`, `achievementReward.ts`, and #964 / #860 / #1308 /
 * #1268 / #1276 files are occupied / unmerged, so this PR does not
 * restack them. Tests reproduce ungated banner-unlock vs the gated
 * persist. Restack the heal click + `jackpotHealVisible` effect onto
 * `persistJackpotHealThroughFeatGate` after those PRs land. No Motoko.
 */

import { shouldRollbackFailedHeal } from "./itemShop.ts";

/** Must match `admin.mo` default `jackpot` condition. */
export const JACKPOT_HEAL_FEAT_CONDITION = "jackpot_heal";

/** Claim reward on `jackpot_heal` (`admin.mo` catalog). */
export const JACKPOT_HEAL_FEAT_DOKA_REWARD = 200;

/** Live WX banner duration after a jackpot click. */
export const JACKPOT_HEAL_BANNER_MS = 3000;

/**
 * Live WX fires the feat from the `jackpotHealVisible` effect, in the
 * same tick as the optimistic banner, before persist settles.
 */
export function liveWxUnlocksJackpotHealFeatOnBanner(): boolean {
  return true;
}

/** Production must not unlock from the banner / click. */
export function shouldUnlockJackpotHealFeatOnBanner(): boolean {
  return false;
}

/** Live WX increments / unlocks on the Heal click. Must not. */
export function shouldUnlockJackpotHealFeatOnClick(): boolean {
  return false;
}

/**
 * Confirmed `saveBattleStats` only. `persistAbsoluteProgress` returns
 * false on missing actor, spend-0 skip, unseeded throw, replica reject,
 * and catch-after-invoke. Delayed Jackpot is safer than minting 200
 * Doka from a rolled-back heal.
 */
export function shouldUnlockJackpotHealFeatAfterPersist(
  persistOk: boolean,
): boolean {
  return persistOk === true;
}

/**
 * Banner juice may still fire on the click. Feat unlock is a different
 * gate. Failed persist must not be required to hide the banner for this
 * leftover — live WX leaves it up for 3s either way.
 */
export function shouldShowJackpotHealBannerOnClick(jackpot: boolean): boolean {
  return jackpot === true;
}

/**
 * Live WX rolls HP/Doka back on persist false when this click still
 * owns the live refs, and never retracts `markAchievementUnlocked`.
 */
export function leftoverJackpotHealFeatUnlocksAfterFailedPersist(args: {
  persistOk: boolean;
  liveHp: number;
  liveDoka: number;
  expectedHp: number;
  expectedDoka: number;
  ungatedUnlockOnBanner: boolean;
}): boolean {
  if (args.ungatedUnlockOnBanner !== true) return false;
  if (shouldUnlockJackpotHealFeatAfterPersist(args.persistOk)) return false;
  return shouldRollbackFailedHeal({
    liveHp: args.liveHp,
    liveDoka: args.liveDoka,
    expectedHp: args.expectedHp,
    expectedDoka: args.expectedDoka,
  });
}

export type JackpotHealFeatPersistResult = {
  ok: boolean;
  unlockFeat: boolean;
};

/**
 * Heal persist then feat gate. Call this instead of unlocking from
 * `jackpotHealVisible` when restacking WorldExploration.
 *
 * A throwing persist is fail-closed (no unlock). Live
 * `persistAbsoluteProgress` already catches and returns false.
 */
export async function persistJackpotHealThroughFeatGate(args: {
  persistHeal: () => Promise<boolean>;
}): Promise<JackpotHealFeatPersistResult> {
  try {
    const ok = await args.persistHeal();
    return {
      ok,
      unlockFeat: shouldUnlockJackpotHealFeatAfterPersist(ok),
    };
  } catch {
    return { ok: false, unlockFeat: false };
  }
}
