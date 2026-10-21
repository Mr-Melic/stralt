/**
 * adminDeleteAchievementConfig with existing progress soft-retires
 * (active=false, id kept). markAchievementUnlocked rejects inactive.
 * claimAchievementReward does not check config.active and still pays the
 * live dokaReward (SDEG-008). Official AchievementsPanel filters
 * configs.filter(cfg => cfg.active), so an unlocked-but-unclaimed retired
 * feat disappears from the claim UI.
 *
 * A player who owned the feat yesterday and had not claimed can no longer
 * press Claim after retire; a raw client still can. Distinct from SDEG-008
 * (freeze amount) and 09-25-009 (rename orphans id). No schema. Do not
 * edit main.mo / AchievementsPanel while older persist PRs queue.
 */

import { shouldRejectInactiveAchievementUnlock } from "./adminSafety.ts";

export function officialFeatsPanelHidesInactiveConfigs(): boolean {
  return true;
}

export function claimAchievementRewardChecksConfigActive(): boolean {
  return false;
}

export function markAchievementUnlockedRejectsInactive(): boolean {
  return shouldRejectInactiveAchievementUnlock(false);
}

/**
 * True when official UI cannot claim a stored unlocked row because the
 * catalog row is retired, even though the canister claim path still works.
 */
export function retiredUnclaimedFeatHiddenFromOfficialClaim(args: {
  active: boolean;
  unlocked: boolean;
  claimed: boolean;
}): boolean {
  return (
    args.unlocked &&
    !args.claimed &&
    officialFeatsPanelHidesInactiveConfigs() &&
    shouldRejectInactiveAchievementUnlock(args.active) &&
    claimAchievementRewardChecksConfigActive() === false
  );
}
