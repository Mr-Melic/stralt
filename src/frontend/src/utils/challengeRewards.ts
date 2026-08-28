export type CompletedChallengeReward = {
  name: string;
  dokaReward: number;
  xpReward?: number;
};

/**
 * Battle challenges advertise both Doka and XP. handleBattleEnd used to
 * persist only dokaReward and drop rewards.xp, so a completed hard/legendary
 * objective never credited the 400–1000 XP shown in the challenge panel.
 */
export function battleChallengePersistEntries(
  completed: boolean,
  challenge: {
    rewards?: { doka?: number; xp?: number };
  } | null,
): CompletedChallengeReward[] {
  if (!completed || !challenge) return [];
  return [
    {
      name: "Battle Challenge",
      dokaReward: challenge.rewards?.doka || 0,
      xpReward: challenge.rewards?.xp || 0,
    },
  ];
}

export function challengeXpFromEntries(
  entries: CompletedChallengeReward[],
): number {
  return entries.reduce((sum, ch) => sum + (ch.xpReward || 0), 0);
}

export function addChallengeRewardDeltas(
  dokaDelta: number,
  xpDelta: number,
  challenges: CompletedChallengeReward[],
): { dokaDelta: number; xpDelta: number; dokaFromChallenges: number } {
  let dokaFromChallenges = 0;
  let xpFromChallenges = 0;
  for (const ch of challenges) {
    dokaFromChallenges += ch.dokaReward;
    xpFromChallenges += ch.xpReward || 0;
  }
  return {
    dokaDelta: dokaDelta + dokaFromChallenges,
    xpDelta: xpDelta + xpFromChallenges,
    dokaFromChallenges,
  };
}
