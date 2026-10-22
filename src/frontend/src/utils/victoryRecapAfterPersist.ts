/**
 * handleBattleEnd refreshes the app-root victory recap after
 * thresholdAchievementConditionsFromPersist fires. That refresh must use
 * the same death/epoch gate as shouldApplyVictoryLiveHydrate.
 *
 * Sequence:
 * 1. Victory recap opens; applyRewards is still on the persist lock.
 * 2. Exploration lava/spike death replaces the overlay with an isDefeat
 *    recap and bumps deathEpoch.
 * 3. Live hydrate correctly skips (shouldApplyVictoryLiveHydrate === false).
 * 4. An ungated onShowBattleSummary(attachRecapUnlocks(finalRecapData, …))
 *    would republish the victory payload over the defeat recap.
 *
 * handleBossRushRoomClear's persist `.then` also uses these steps so
 * doka_1000 / level_10 fire with inBattle=true and attach to the recap
 * before live hydrate (idle doka effects would otherwise toast them).
 * #904's helper still refreshes when hydrateLive is false; this gate omits
 * "refresh-recap" in that case.
 */

import { shouldApplyVictoryLiveHydrate } from "./deathPenalty.ts";

export function shouldPublishVictoryRecapAfterPersist(opts: {
  thresholdConditions: readonly string[];
  deathTriggered: boolean;
  deathEpochAtPersistStart?: number;
  deathEpochNow?: number;
}): boolean {
  if (opts.thresholdConditions.length === 0) return false;
  return shouldApplyVictoryLiveHydrate(
    opts.deathTriggered,
    opts.deathEpochAtPersistStart,
    opts.deathEpochNow,
  );
}

/**
 * Ordered post-persist steps for a victory / Boss Rush room-clear credit.
 * Unlike #904's bossRushRoomClearPersistSuccessSteps, "refresh-recap" is
 * omitted when death skipped live hydrate so a defeat overlay is not
 * overwritten by a ghost victory payload.
 */
export type VictoryPersistSuccessStep =
  | "fire-threshold-in-battle"
  | "refresh-recap"
  | "hydrate-live";

export function victoryPersistSuccessSteps(opts: {
  thresholdConditions: readonly string[];
  deathTriggered: boolean;
  deathEpochAtPersistStart?: number;
  deathEpochNow?: number;
}): VictoryPersistSuccessStep[] {
  const hydrateLive = shouldApplyVictoryLiveHydrate(
    opts.deathTriggered,
    opts.deathEpochAtPersistStart,
    opts.deathEpochNow,
  );
  const steps: VictoryPersistSuccessStep[] = [];
  if (opts.thresholdConditions.length > 0) {
    // Feats still fire against the post-credit snapshot (earned before death).
    steps.push("fire-threshold-in-battle");
    if (
      shouldPublishVictoryRecapAfterPersist({
        thresholdConditions: opts.thresholdConditions,
        deathTriggered: opts.deathTriggered,
        deathEpochAtPersistStart: opts.deathEpochAtPersistStart,
        deathEpochNow: opts.deathEpochNow,
      })
    ) {
      steps.push("refresh-recap");
    }
  }
  if (hydrateLive) steps.push("hydrate-live");
  return steps;
}
