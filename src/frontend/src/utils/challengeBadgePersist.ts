/**
 * Legendary challenge badges (Untouchable / Blitz / Striker) are advertised on
 * DEFAULT_CHALLENGES but never enter the applyRewards funnel.
 *
 * CompletedChallengeReward only carries name / dokaReward / xpReward.
 * Official victory persist uses name "Battle Challenge". No canister map
 * stores badge strings; they are session UI / recap copy only.
 */

export type ChallengeRewardShape = {
  doka?: number;
  xp?: number;
  badge?: string;
};

export type CompletedChallengeRewardShape = {
  name: string;
  dokaReward: number;
  xpReward?: number;
  badge?: string;
};

export function challengeBadgePersistsToCanister(): boolean {
  return false;
}

/** Fields that survive into resolveBattleRewards completedChallenges. */
export function challengeRewardFieldsPersisted(
  rewards: ChallengeRewardShape | undefined,
): Pick<CompletedChallengeRewardShape, "dokaReward" | "xpReward"> {
  return {
    dokaReward: rewards?.doka || 0,
    xpReward: rewards?.xp || 0,
  };
}

export function challengeBadgeDroppedOnPersist(
  rewards: ChallengeRewardShape | undefined,
): boolean {
  return (
    Boolean(rewards?.badge) && challengeBadgePersistsToCanister() === false
  );
}

export const LEGENDARY_CHALLENGE_BADGES = [
  "Untouchable",
  "Blitz",
  "Striker",
] as const;
