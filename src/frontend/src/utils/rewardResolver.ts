import type { BattleRecapData } from "../components/PostBattleRecap";

export interface RewardInput {
  victory: boolean;
  enemiesDefeated: Array<{ name: string; level: number }>;
  completedChallenges: { name: string; dokaReward: number }[];
  dungeonMultiplier: number;
  bossRushRoomReward?: { doka: number; xp: number };
  baseDoka: number;
  baseXp: number;
}

/**
 * Pass this when callers have already baked dungeon/boss multipliers into
 * baseDoka / baseXp. resolveBattleRewards multiplies again otherwise.
 */
export const PREAPPLIED_REWARD_MULTIPLIER = 1;

/** Boss-rush room totals are already final — do not re-apply dungeonMultiplier. */
export function buildBossRushPersistInput(args: {
  enemiesDefeated: Array<{ name: string; level: number }>;
  baseDoka: number;
  baseXp: number;
}): RewardInput {
  return {
    victory: true,
    enemiesDefeated: args.enemiesDefeated,
    completedChallenges: [],
    dungeonMultiplier: PREAPPLIED_REWARD_MULTIPLIER,
    baseDoka: args.baseDoka,
    baseXp: args.baseXp,
  };
}

export function computeRewardDeltas(input: RewardInput): {
  dokaDelta: number;
  xpDelta: number;
  dokaFromChallenges: number;
} {
  let dokaDelta = 0;
  let xpDelta = 0;

  if (input.victory) {
    dokaDelta += Math.floor(input.baseDoka * input.dungeonMultiplier);
    xpDelta += Math.floor(input.baseXp * input.dungeonMultiplier);
  }

  let dokaFromChallenges = 0;
  for (const ch of input.completedChallenges) {
    dokaFromChallenges += ch.dokaReward;
  }
  dokaDelta += dokaFromChallenges;

  if (input.bossRushRoomReward) {
    dokaDelta += input.bossRushRoomReward.doka;
    xpDelta += input.bossRushRoomReward.xp;
  }

  return {
    dokaDelta: Math.max(0, dokaDelta),
    xpDelta: Math.max(0, xpDelta),
    dokaFromChallenges,
  };
}

export async function resolveBattleRewards(
  actor: any,
  selectedSlot: number,
  input: RewardInput,
): Promise<BattleRecapData> {
  const {
    victory,
    enemiesDefeated,
    completedChallenges,
    dungeonMultiplier,
    baseDoka,
  } = input;
  const { dokaDelta, xpDelta, dokaFromChallenges } = computeRewardDeltas(input);

  // Call backend atomic applyRewards
  const result = await actor.applyRewards(
    BigInt(selectedSlot),
    BigInt(dokaDelta),
    BigInt(xpDelta),
  );

  if ("err" in result) {
    throw new Error(`applyRewards failed: ${result.err}`);
  }

  const { newDoka, newXp, newLevel } = result.ok;

  // Build recap data
  const recap: BattleRecapData = {
    xpEarned: xpDelta,
    dokaEarned: dokaDelta,
    dokaFromVictory: victory ? Math.floor(baseDoka * dungeonMultiplier) : 0,
    dokaFromChallenges: dokaFromChallenges,
    completedChallenges: completedChallenges.map((c) => c.name),
    enemiesDefeated: enemiesDefeated,
    currentLevel: Number(newLevel),
    currentXP: Number(newXp),
    newDoka: Number(newDoka),
    newXp: Number(newXp),
    xpForNextLevel: 0,
    mapTitle: "",
    hitsDealt: 0,
    dokaBreakdown: [],
  };

  return recap;
}
