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

/**
 * XP granted for a victory.
 *
 * Reconcile-driven victory calls historically passed `expGained = 0` and
 * raced ahead of the useEffect that knew the real formula, so applyRewards
 * persisted 0 XP. Prefer an explicit positive grant; otherwise use the
 * canonical kill formula: sum(enemy.level * 20), falling back to
 * characterLevel * 20 when the defeated list is empty.
 */
export function computeVictoryExp(
  expGained: number | undefined,
  enemiesDefeated: Array<{ level: number }>,
  characterLevel: number,
): number {
  if (
    typeof expGained === "number" &&
    Number.isFinite(expGained) &&
    expGained > 0
  ) {
    return Math.round(expGained);
  }
  const fromKills = enemiesDefeated.reduce(
    (sum, enemy) => sum + Number(enemy.level) * 20,
    0,
  );
  if (fromKills > 0) return fromKills;
  const fallbackLevel = Number(characterLevel);
  return (
    (Number.isFinite(fallbackLevel) && fallbackLevel > 0 ? fallbackLevel : 1) *
    20
  );
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
