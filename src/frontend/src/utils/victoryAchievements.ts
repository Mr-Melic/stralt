import {
  shouldDeferAchievementUnlockUntilRewardsPersist,
  thresholdAchievementConditionsFromPersist,
} from "./adminSafety.ts";

/**
 * Client-trusted victory feats fired from handleBattleEnd before recap.
 * The victory gate routes Boss Rush room-clear to handleBossRushRoomClear
 * instead, which used to skip this list — pacifist_run (500 Doka),
 * leader_slayer (150), first_battle_win (50), critical_5_in_battle (150),
 * and survive_1hp (100) never unlocked after a room-clear, then battle
 * start reset the per-fight refs.
 *
 * Wallet / level feats (doka_1000, doka_10000, level_10) stay deferred
 * until applyRewards commits — do not add them here.
 */

export interface ClientTrustedVictoryFeatSnapshot {
  hp: number;
  mapsVisited: number;
  groundDokaPickups: number;
  spellBarCount: number;
  hasSpellAtLeast5: boolean;
  critHits: number;
  pacifist: boolean;
  betrayal: boolean;
  doubleBetrayal: boolean;
  leaderSlain: boolean;
  bossId?: string | null;
}

export function clientTrustedVictoryAchievementConditions(
  snap: ClientTrustedVictoryFeatSnapshot,
): string[] {
  const conditions: string[] = ["first_battle_win"];
  if (snap.hp === 1) conditions.push("survive_1hp");
  if (snap.mapsVisited >= 25) conditions.push("explore_25_maps");
  if (snap.groundDokaPickups >= 10) conditions.push("loot_10_doka");
  if (snap.spellBarCount >= 8) conditions.push("spell_master_8");
  if (snap.hasSpellAtLeast5) conditions.push("spell_level_5");
  if (snap.critHits >= 5) conditions.push("critical_5_in_battle");
  if (snap.pacifist) conditions.push("pacifist_run");
  if (snap.betrayal) conditions.push("betrayal_witness");
  if (snap.doubleBetrayal) conditions.push("double_betrayal");
  if (snap.leaderSlain) conditions.push("leader_slayer");
  const bossId = snap.bossId;
  if (typeof bossId === "string" && bossId.length > 0) {
    conditions.push(`boss_defeated_${bossId}`);
  }
  return conditions;
}

export type PersistedThresholdUnlockStep =
  | "fire-threshold-in-battle"
  | "refresh-recap"
  | "hydrate-live";

/**
 * After applyRewards commits, fire wallet/level feats with inBattle=true so
 * they land on BattleRecapData. A later idle toast never reaches the recap.
 *
 * Wire in `handleBossRushRoomClear`'s persist `.then` *before* live hydrate
 * (`setCharacterStats` / `onDokaBalanceChange`) and refresh the recap when
 * `shouldRefreshRecapAfterPersistedThresholdUnlocks` is true. handleBattleEnd
 * already does this inline; room-clear used to skip it.
 */
export function firePersistedThresholdUnlocks(args: {
  level: number;
  doka: number;
  fire: (condition: string, inBattle: boolean) => void;
}): string[] {
  const conditions = thresholdAchievementConditionsFromPersist({
    level: args.level,
    doka: args.doka,
  }).filter(shouldDeferAchievementUnlockUntilRewardsPersist);
  for (const condition of conditions) {
    args.fire(condition, true);
  }
  return conditions;
}

export function shouldRefreshRecapAfterPersistedThresholdUnlocks(
  conditions: readonly string[],
): boolean {
  return conditions.length > 0;
}

/**
 * Boss Rush room-clear used to hydrate the live wallet first (and
 * cleanupBattle had already set inBattle=false). The idle doka/level
 * effects then toasted doka_1000 / level_10, and achievementsShownRef
 * blocked any recap attach. HandleBattleEnd fires inside the persist
 * enqueue before live hydrate — room-clear must use the same order.
 */
export function bossRushRoomClearPersistSuccessSteps(opts: {
  thresholdConditions: readonly string[];
  hydrateLive: boolean;
}): PersistedThresholdUnlockStep[] {
  const steps: PersistedThresholdUnlockStep[] = [];
  if (
    shouldRefreshRecapAfterPersistedThresholdUnlocks(opts.thresholdConditions)
  ) {
    steps.push("fire-threshold-in-battle");
    steps.push("refresh-recap");
  }
  if (opts.hydrateLive) {
    steps.push("hydrate-live");
  }
  return steps;
}

/**
 * Proves the recap vs toast split for a room-clear that crossed a wallet
 * or level threshold. `fireBeforeHydrate` is the handleBattleEnd order.
 */
export function recapUnlocksAfterBossRushPersist(opts: {
  persistedLevel: number;
  persistedDoka: number;
  fireBeforeHydrate: boolean;
  inBattleAfterCleanup: boolean;
}): { recapConditions: string[]; toastConditions: string[] } {
  const conditions = thresholdAchievementConditionsFromPersist({
    level: opts.persistedLevel,
    doka: opts.persistedDoka,
  }).filter(shouldDeferAchievementUnlockUntilRewardsPersist);
  if (conditions.length === 0) {
    return { recapConditions: [], toastConditions: [] };
  }
  if (opts.fireBeforeHydrate) {
    return { recapConditions: conditions, toastConditions: [] };
  }
  if (!opts.inBattleAfterCleanup) {
    return { recapConditions: [], toastConditions: conditions };
  }
  return { recapConditions: conditions, toastConditions: [] };
}
