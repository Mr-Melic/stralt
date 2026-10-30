/**
 * Overworld boss victory persist reads `currentBossConfigRef` **after**
 * `cleanupBattle` has already nulled it.
 *
 * Production (`WorldExploration.tsx`):
 *   - Boss portal entry writes `currentBossConfigRef` (6494).
 *   - `cleanupBattle` sets `currentBossConfigRef.current = null` (11662).
 *   - `handleBattleEnd` calls `cleanupBattle()` (12328) **before** reading
 *     `activeBossConfForXP` (12370), `activeBossConf` (12434), recap
 *     `bossDefeated` (12471), and `clientTrustedVictoryAchievementConditions`
 *     `bossId: activeBossConf?.id` (12494).
 *   - Catalog / Boss Guide advertise `rewardDokaMultiplier` ≥ 5 and
 *     `rewardXpMultiplier` ≥ 3 (`bossDefaults.ts` pale_archbishop is
 *     5 / 3; later bosses go higher). After cleanup those reads are
 *     always `null` → multiplier 1. `applyRewards` persists the
 *     unboosted `baseDoka` / `baseXp`. `markAchievementUnlocked` never
 *     sees `boss_defeated_${id}` from this path.
 *
 * Contrast: `handleBossRushRoomClear` snapshots `currentBossConfigRef`
 * (12901) **before** `cleanupBattle` (12937). Room-clear does not apply
 * catalog reward multipliers (its own `dokaPerEnemy` formula) — that is
 * a different leftover. This sidecar is the overworld
 * cleanup-then-read wipe only.
 *
 * Chronology:
 * 1. World hydrated. Lock seeded. Player steps a Pale Archbishop portal.
 *    `currentBossConfigRef` = catalog `{ id: "pale_archbishop",
 *    rewardDokaMultiplier: 5, rewardXpMultiplier: 3 }`.
 * 2. Boss fight. Last hostile dies. Victory gate calls
 *    `handleBattleEnd` (not room-clear). Challenge refs are snapshotted
 *    before cleanup (12300–12317). Boss config is not.
 * 3. `cleanupBattle()` nulls `currentBossConfigRef`.
 * 4. XP uses multiplier 1 instead of 3. Doka uses multiplier 1 instead
 *    of 5. Recap `bossDefeated` is undefined. Feat snap `bossId` is
 *    undefined. `applyRewards` commits the unboosted grant.
 * 5. Unique leftover vs **#1328** (survive_1hp render HP), **#1321**
 *    (spell_master bar), **#1317** (jackpot banner), **#1308** (loot
 *    count), **#904** (Boss Rush wallet/level feats after persist):
 *    advertised 5× Doka / 3× XP never reach the canister on an
 *    overworld boss win. Regular (non-boss) victories have a null
 *    config before *and* after cleanup — no leftover.
 *
 * `WorldExploration.tsx`, `victoryAchievements.ts`, `rewardResolver.ts`,
 * `progressPersist.ts`, and occupied persist/feat sidecars stay
 * merge-clean. Restack `handleBattleEnd` onto
 * `snapshotOverworldBossConfigBeforeCleanupBattle` **before**
 * `cleanupBattle`, then `persistOverworldBossVictoryThroughCleanupSnapshot`
 * for the multipliers / feat id. No Motoko.
 */

import { clampApplyRewardsDeltas } from "./applyRewardsResult.ts";

/** Catalog Pale Archbishop — advertised Boss Guide 5× Doka / 3× XP. */
export const OVERWORLD_BOSS_CLEANUP_EXAMPLE_ID = "pale_archbishop";

export const OVERWORLD_BOSS_CLEANUP_EXAMPLE_NAME = "The Pale Archbishop";

/** Catalog `rewardDokaMultiplier` on the 12-boss default set. */
export const OVERWORLD_BOSS_CLEANUP_ADVERTISED_DOKA_MULT = 5;

/** Catalog `rewardXpMultiplier` on the 12-boss default set. */
export const OVERWORLD_BOSS_CLEANUP_ADVERTISED_XP_MULT = 3;

/**
 * Live leftover: `handleBattleEnd` reads the boss config after
 * `cleanupBattle` has already nulled the ref.
 */
export function liveWxReadsBossConfigAfterCleanupBattle(): boolean {
  return true;
}

/**
 * Live leftover: `handleBattleEnd` does not snapshot the config before
 * cleanup the way challenge refs are snapshotted at 12300.
 */
export function liveWxSnapshotsBossConfigBeforeCleanupBattle(): boolean {
  return false;
}

/**
 * Contrast: Boss Rush room-clear reads `currentBossConfigRef` before
 * `cleanupBattle`. Not this leftover (and it still ignores catalog
 * reward multipliers).
 */
export function liveWxBossRushSnapshotsBossConfigBeforeCleanup(): boolean {
  return true;
}

export type OverworldBossCleanupSnapshot = {
  id: string;
  name: string;
  rewardDokaMultiplier: number;
  rewardXpMultiplier: number;
};

function finitePositiveMultiplier(raw: unknown): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 1;
  return n;
}

function finiteNonNeg(raw: unknown): number {
  const n = Math.floor(Number(raw) || 0);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

/**
 * Capture the live boss config before `cleanupBattle`. Null when this
 * fight is not an overworld boss portal.
 */
export function snapshotOverworldBossConfigBeforeCleanupBattle(
  config: {
    id?: unknown;
    name?: unknown;
    rewardDokaMultiplier?: unknown;
    rewardXpMultiplier?: unknown;
  } | null,
): OverworldBossCleanupSnapshot | null {
  if (config == null) return null;
  const id = typeof config.id === "string" ? config.id.trim() : "";
  if (!id) return null;
  const name = typeof config.name === "string" ? config.name : "";
  return {
    id,
    name,
    rewardDokaMultiplier: finitePositiveMultiplier(config.rewardDokaMultiplier),
    rewardXpMultiplier: finitePositiveMultiplier(config.rewardXpMultiplier),
  };
}

/** Post-cleanup live ref is always null, so the multiplier collapses to 1. */
export function bossRewardMultiplierAfterCleanup(
  configAfterCleanup: OverworldBossCleanupSnapshot | null,
): { doka: number; xp: number } {
  if (configAfterCleanup == null) {
    return { doka: 1, xp: 1 };
  }
  return {
    doka: finitePositiveMultiplier(configAfterCleanup.rewardDokaMultiplier),
    xp: finitePositiveMultiplier(configAfterCleanup.rewardXpMultiplier),
  };
}

export type OverworldBossVictoryPersistGrant = {
  dokaDelta: number;
  xpDelta: number;
  bossId: string | undefined;
  bossName: string | undefined;
};

/**
 * Apply catalog reward multipliers from a **pre-cleanup** snapshot, then
 * clamp to canister maxima. `chainMult` matches the dungeon-chain factor
 * already applied in handleBattleEnd (still live after cleanupBattle —
 * those refs are only zeroed in cleanupMap).
 */
export function persistOverworldBossVictoryThroughCleanupSnapshot(args: {
  snapshot: OverworldBossCleanupSnapshot | null;
  rawDoka: unknown;
  derivedBaseXp: unknown;
  chainMult?: unknown;
}): OverworldBossVictoryPersistGrant {
  const rawDoka = finiteNonNeg(args.rawDoka);
  const derivedBaseXp = finiteNonNeg(args.derivedBaseXp);
  const chainMult = finitePositiveMultiplier(args.chainMult ?? 1);
  const mult = bossRewardMultiplierAfterCleanup(args.snapshot);
  const clamped = clampApplyRewardsDeltas(
    Math.round(rawDoka * chainMult * mult.doka),
    Math.round(derivedBaseXp * mult.xp),
  );
  return {
    dokaDelta: clamped.dokaDelta,
    xpDelta: clamped.xpDelta,
    bossId: args.snapshot?.id,
    bossName: args.snapshot?.name || undefined,
  };
}

/**
 * Live WX path: cleanup has already run, so the snapshot is null and
 * persist is unboosted.
 */
export function leftoverOverworldBossVictoryAfterCleanup(args: {
  rawDoka: unknown;
  derivedBaseXp: unknown;
  chainMult?: unknown;
}): OverworldBossVictoryPersistGrant {
  return persistOverworldBossVictoryThroughCleanupSnapshot({
    snapshot: null,
    rawDoka: args.rawDoka,
    derivedBaseXp: args.derivedBaseXp,
    chainMult: args.chainMult,
  });
}

export function leftoverUnmultipliedBossVictoryDoka(args: {
  rawDoka: unknown;
  chainMult?: unknown;
  advertisedDokaMult: unknown;
}): number {
  const rawDoka = finiteNonNeg(args.rawDoka);
  const chainMult = finitePositiveMultiplier(args.chainMult ?? 1);
  const advertised = finitePositiveMultiplier(args.advertisedDokaMult);
  const leftover = Math.round(rawDoka * chainMult * 1);
  const gated = Math.round(rawDoka * chainMult * advertised);
  return Math.max(0, gated - leftover);
}

export function leftoverUnmultipliedBossVictoryXp(args: {
  derivedBaseXp: unknown;
  advertisedXpMult: unknown;
}): number {
  const derivedBaseXp = finiteNonNeg(args.derivedBaseXp);
  const advertised = finitePositiveMultiplier(args.advertisedXpMult);
  const leftover = Math.round(derivedBaseXp * 1);
  const gated = Math.round(derivedBaseXp * advertised);
  return Math.max(0, gated - leftover);
}

/**
 * Feat snap `bossId` after cleanup is always undefined on handleBattleEnd.
 * Room-clear still has the live ref (not this leftover).
 */
export function leftoverBossDefeatedFeatIdAfterCleanup(args: {
  snapshotBeforeCleanup: OverworldBossCleanupSnapshot | null;
  readAfterCleanup: boolean;
}): string | undefined {
  if (args.readAfterCleanup) return undefined;
  return args.snapshotBeforeCleanup?.id;
}
