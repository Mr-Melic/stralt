/**
 * Survivor feat (`survive_1hp`, 100 Doka) unlocks from
 * `WorldExploration.tsx` `handleBattleEnd` (12483–12487) and
 * `handleBossRushRoomClear` (12902–12907) via
 * `clientTrustedVictoryAchievementConditions({ hp: characterStats.hp })`.
 * That `hp` is the **render snapshot**. `setCharacterStats` eagerly writes
 * `characterStatsRef` inside React's updater (`WorldExploration.tsx`
 * 3261–3270; `itemShop.ts` documents the same eager write). An in-battle
 * potion (`handleUseItem` 3557–3572) or heal spell can raise live HP
 * above 1 in the same tick that the last hostile dies (DoT / lava /
 * minion). `handleBattleEndRef` still holds the previous render's
 * closure (`characterStats.hp === 1`). `markAchievementUnlocked` is
 * never retracted.
 *
 * #1321 gates `spell_master_8` until bar persist `#ok`. #1317 gates
 * `jackpot_heal` until heal persist true. #1308 gates `loot_10_doka`
 * until ground-Doka settle `commit`. Those helpers never read victory
 * HP. `survive_1hp` is client-trusted (not `achievementUnlockRejected`).
 *
 * Chronology:
 * 1. Battle. Player at 1 HP. Render snapshot 1. Live ref 1. Feat locked.
 * 2. Player uses a health potion (or a heal spell). Eager updater writes
 *    `characterStatsRef.hp` to 1 + 30% max (e.g. 51). React state still 1.
 *    No unpaid death. Persist lock is not this leftover (feat unlock is
 *    off-lock; claim later is 100 Doka through `claimAchievementReward`).
 * 3. Last hostile dies in the same tick (DoT / lava / leftover minion).
 *    `handleBattleEndRef.current` is still the previous render. Victory
 *    snap reads `characterStats.hp === 1` → `survive_1hp` →
 *    `markAchievementUnlocked`. Live ref is already 51.
 * 4. Claim Survivor. Unique leftover: 100 Doka feat from a battle that
 *    ended above 1 HP on the live ref.
 *
 * This sidecar unlocks only when **live** HP is exactly 1 at victory.
 * Stale render `hp === 1` with live HP above 1 must not unlock (delayed
 * Survivor is safer than minting 100 Doka). Live HP 1 still unlocks.
 *
 * `WorldExploration.tsx`, `victoryAchievements.ts`, `progressPersist.ts`,
 * `achievementReward.ts`, and #1321 / #1317 / #1308 / #1276 files are
 * occupied / unmerged, so this PR does not restack them. Tests reproduce
 * ungated render-snapshot unlock vs the gated live-HP path. Restack
 * victory / Boss Rush snaps onto
 * `shouldUnlockSurvive1hpFeatFromLiveHp(characterStatsRef.current.hp)`
 * after those PRs land. No Motoko.
 */

/** Must match `admin.mo` default `survivor` condition. */
export const SURVIVE_1HP_FEAT_CONDITION = "survive_1hp";

/** Claim reward on `survive_1hp` (`admin.mo` catalog). */
export const SURVIVE_1HP_FEAT_DOKA_REWARD = 100;

/** Catalog copy: survive the battle with exactly 1 HP remaining. */
export const SURVIVE_1HP_THRESHOLD = 1;

/**
 * Live WX fires the feat from `characterStats.hp` (render snapshot) at
 * victory / Boss Rush room-clear, not from `characterStatsRef`.
 */
export function liveWxUnlocksSurvive1hpFromRenderSnapshot(): boolean {
  return true;
}

/** Production must not unlock from the render snapshot alone. */
export function shouldUnlockSurvive1hpFeatFromRenderSnapshot(): boolean {
  return false;
}

/** Victory snap currently reads HUD `characterStats.hp`. Gated path must not. */
export function shouldUnlockSurvive1hpFeatOnVictorySnap(): boolean {
  return false;
}

export function shouldUnlockSurvive1hpFeatOnBossRushSnap(): boolean {
  return false;
}

export function readLiveHp(raw: unknown): number {
  const n = Math.floor(Number(raw) || 0);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

/**
 * Confirmed live HP at victory only. Delayed Survivor is safer than
 * minting 100 Doka from a stale 1 HP render snapshot after a same-tick
 * heal already raised the ref.
 */
export function shouldUnlockSurvive1hpFeatFromLiveHp(liveHp: unknown): boolean {
  return readLiveHp(liveHp) === SURVIVE_1HP_THRESHOLD;
}

/**
 * Live WX never retracts `markAchievementUnlocked` when the render
 * snapshot is 1 but the eager live ref is already above 1.
 */
export function leftoverSurvive1hpFeatUnlocksAfterHeal(args: {
  renderHp: unknown;
  liveHp: unknown;
  ungatedUnlockFromRender: boolean;
}): boolean {
  if (args.ungatedUnlockFromRender !== true) return false;
  if (readLiveHp(args.renderHp) !== SURVIVE_1HP_THRESHOLD) return false;
  if (shouldUnlockSurvive1hpFeatFromLiveHp(args.liveHp)) return false;
  return readLiveHp(args.liveHp) > SURVIVE_1HP_THRESHOLD;
}

export type Survive1hpFeatPersistResult = {
  unlockFeat: boolean;
};

/**
 * Victory / room-clear feat gate. Call this instead of unlocking from
 * `characterStats.hp` when restacking WorldExploration.
 */
export function persistVictoryThroughSurvive1hpFeatGate(args: {
  liveHp: unknown;
}): Survive1hpFeatPersistResult {
  return {
    unlockFeat: shouldUnlockSurvive1hpFeatFromLiveHp(args.liveHp),
  };
}
