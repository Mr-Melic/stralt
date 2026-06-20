import type { BattleRecapData } from "../components/PostBattleRecap";
import { EnemyConfig } from "../types/gameTypes";

export interface RewardInput {
  victory: boolean;
  enemiesDefeated: Array<{ name: string; level: number }>;
  completedChallenges: { name: string; dokaReward: number }[];
  dungeonMultiplier: number;
  bossRushRoomReward?: { doka: number; xp: number };
  baseDoka: number;
  baseXp: number;
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
    bossRushRoomReward,
    baseDoka,
    baseXp,
  } = input;

  // Compute deltas
  let dokaDelta = 0;
  let xpDelta = 0;

  if (victory) {
    dokaDelta += Math.floor(baseDoka * dungeonMultiplier);
    xpDelta += Math.floor(baseXp * dungeonMultiplier);
  }

  // Challenge rewards
  let dokaFromChallenges = 0;
  for (const ch of completedChallenges) {
    dokaFromChallenges += ch.dokaReward;
  }
  dokaDelta += dokaFromChallenges;

  // Boss rush room reward
  if (bossRushRoomReward) {
    dokaDelta += bossRushRoomReward.doka;
    xpDelta += bossRushRoomReward.xp;
  }

  // Ensure non-negative
  dokaDelta = Math.max(0, dokaDelta);
  xpDelta = Math.max(0, xpDelta);

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
