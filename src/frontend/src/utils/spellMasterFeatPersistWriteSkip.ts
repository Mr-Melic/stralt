/**
 * Spell Master feat (`spell_master_8`, 100 Doka) unlocks from
 * `WorldExploration.tsx` 3629–3636 as soon as `activeSpells.length >= 8`.
 * `handleSetActiveSpells` sets that optimistic bar at 2887–2895 **before**
 * the 1000ms debounced `setSpellBarOrder` (`flushSpellBarSave` 2951–3056).
 * Unmount clears the debounce without flush (3081–3090). `#err` / throw
 * keep replica at 7. `markAchievementUnlocked` is never retracted.
 *
 * #1268 stamps remount leftover **bar order**
 * (`pbv_spell_bar_keep_remount_slotN`) and retries the flush. Those
 * helpers never write feat unlock. #1317 gates `jackpot_heal` until
 * heal persist true. #1308 gates `loot_10_doka` until ground-Doka
 * settle `commit`. #1276 is shop inventory. Spell-bar persist is
 * `setSpellBarOrder` (off-lock — not a wallet/XP writer).
 *
 * Chronology:
 * 1. World hydrated. Replica bar has 7 owned spells. Feat locked.
 * 2. Player equips the 8th. Optimistic `setActiveSpellIds` length 8.
 *    `useEffect` fires `checkAndFireAchievement("spell_master_8")` →
 *    `markAchievementUnlocked`. Debounce 1000ms starts. Persist not
 *    sent. No unpaid death.
 * 3. Actor reconnect unmounts within 1000ms: cleanup clears the
 *    timeout (`setSpellBarOrderDebounceRef`) without `flushSpellBarSave`.
 *    Same class: persist `#err` / throw. Replica still 7. HUD may
 *    hydrate stale `getCharacter.spellBarOrder`. Feat stays unlocked.
 *    #1268 stamps bar keep — does **not** retract the feat. Victory
 *    `clientTrustedVictoryAchievementConditions` also reads the
 *    optimistic `activeSpells.length` (12487).
 * 4. Claim Spell Master. Unique leftover: 100 Doka feat from a bar
 *    the canister never stored.
 *
 * This sidecar unlocks only when persist returns `#ok` **and** the
 * saved order has ≥ 8 ids. `false` / `#err` / throw / unmount-without-
 * flush must not unlock (delayed feat is safer than minting 100 Doka).
 * Transport throw-after-accept is unconfirmed — do not unlock.
 *
 * `WorldExploration.tsx`, `victoryAchievements.ts`, `progressPersist.ts`,
 * `achievementReward.ts`, and #1268 / #1317 / #1308 / #1276 files are
 * occupied / unmerged, so this PR does not restack them. Tests reproduce
 * ungated bar-length unlock vs the gated persist. Restack
 * `handleSetActiveSpells` + the length effect + victory snap onto
 * `persistSpellBarThroughFeatGate` after those PRs land. No Motoko.
 */

/** Must match `admin.mo` default `spell_master` condition. */
export const SPELL_MASTER_FEAT_CONDITION = "spell_master_8";

/** Claim reward on `spell_master_8` (`admin.mo` catalog). */
export const SPELL_MASTER_FEAT_DOKA_REWARD = 100;

/** Live WX bar cap and feat threshold. */
export const SPELL_MASTER_BAR_COUNT = 8;

/** Live WX debounce before `flushSpellBarSave`. */
export const SPELL_BAR_SAVE_DEBOUNCE_MS = 1000;

/**
 * Live WX fires the feat from the `activeSpells.length >= 8` effect,
 * in the same tick as the optimistic bar, before persist settles.
 */
export function liveWxUnlocksSpellMasterFeatOnBarLength(): boolean {
  return true;
}

/** Production must not unlock from the length effect / optimistic set. */
export function shouldUnlockSpellMasterFeatOnBarLength(): boolean {
  return false;
}

/** Live WX increments / unlocks on the equip click. Must not. */
export function shouldUnlockSpellMasterFeatOnOptimisticSet(): boolean {
  return false;
}

/**
 * Victory snap currently reads HUD `activeSpells.length`. Gated path
 * must not unlock from that snapshot alone.
 */
export function shouldUnlockSpellMasterFeatOnVictorySnap(): boolean {
  return false;
}

/** Live WX unmount clears the debounce without flush. Production should flush. */
export function liveWxFlushesSpellBarOnUnmount(): boolean {
  return false;
}

export function shouldFlushSpellBarOnUnmount(): boolean {
  return true;
}

/**
 * Motoko `{#ok}` / `{#err:Text}` arrives as `{ _ok }` / `{ _err }` or
 * `{ ok }` / `{ err }`. Boolean wrappers are accepted for tests.
 */
export function isSpellBarPersistOk(result: unknown): boolean {
  if (result === true) return true;
  if (result === false || result == null) return false;
  if (typeof result !== "object") return false;
  const rec = result as {
    _err?: unknown;
    err?: unknown;
  };
  if (typeof rec._err === "string" || typeof rec.err === "string") {
    return false;
  }
  return true;
}

export function spellBarOrderCount(
  orderIds: readonly string[] | null | undefined,
): number {
  if (!Array.isArray(orderIds)) return 0;
  let n = 0;
  for (const id of orderIds) {
    if (typeof id === "string" && id.length > 0) n += 1;
  }
  return n;
}

/**
 * Confirmed `setSpellBarOrder` `#ok` only, with a full 8-spell order.
 * Delayed Spell Master is safer than minting 100 Doka from a bar the
 * replica never stored.
 */
export function shouldUnlockSpellMasterFeatAfterPersist(
  persistOk: boolean,
  orderCount: number,
): boolean {
  return persistOk === true && orderCount >= SPELL_MASTER_BAR_COUNT;
}

/**
 * Live WX never retracts `markAchievementUnlocked` when persist fails
 * or never runs, while replica still has fewer than 8 spells.
 */
export function leftoverSpellMasterFeatUnlocksAfterFailedPersist(args: {
  persistOk: boolean;
  optimisticCount: number;
  replicaCount: number;
  ungatedUnlockOnBarLength: boolean;
}): boolean {
  if (args.ungatedUnlockOnBarLength !== true) return false;
  if (args.optimisticCount < SPELL_MASTER_BAR_COUNT) return false;
  if (
    shouldUnlockSpellMasterFeatAfterPersist(
      args.persistOk,
      args.optimisticCount,
    )
  ) {
    return false;
  }
  return args.replicaCount < SPELL_MASTER_BAR_COUNT;
}

export type SpellMasterFeatPersistResult = {
  ok: boolean;
  unlockFeat: boolean;
};

/**
 * Spell-bar persist then feat gate. Call this instead of unlocking from
 * `activeSpells.length` when restacking WorldExploration.
 *
 * A throwing persist is fail-closed (no unlock). Live `flushSpellBarSave`
 * already `.catch`es and retries; that retry is still unconfirmed.
 */
export async function persistSpellBarThroughFeatGate(args: {
  persistBar: () => Promise<unknown>;
  orderCount: number;
}): Promise<SpellMasterFeatPersistResult> {
  try {
    const result = await args.persistBar();
    const ok = isSpellBarPersistOk(result);
    return {
      ok,
      unlockFeat: shouldUnlockSpellMasterFeatAfterPersist(ok, args.orderCount),
    };
  } catch {
    return { ok: false, unlockFeat: false };
  }
}
