import type { BattleRecapData } from "../components/PostBattleRecap";
import { readApplyRewardsOk } from "./applyRewardsResult.ts";

export type { ApplyRewardsOk } from "./applyRewardsResult.ts";
export {
  persistIncrementalRewards,
  readApplyRewardsOk,
} from "./applyRewardsResult.ts";

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
 * Marker passed as `dungeonMultiplier` to signal that the caller has already
 * multiplied `baseDoka` by the dungeon chain multiplier. When present,
 * `resolveBattleRewards` must NOT multiply the victory Doka again, so the
 * dungeon-chain victory persists exactly once (no double multiplier).
 */
export const PREAPPLIED_REWARD_MULTIPLIER = 1;

export type AttributedKill = {
  name?: string;
  pieceType?: string;
  level?: number;
};

/**
 * Picks the defeated roster for victory XP/Doka persist.
 *
 * Death-pipeline `recheckVictory` runs BEFORE `attributeKillReward` and used
 * to call handleBattleEnd with `[]`. The live combatant list is also empty
 * after the last death. Prefer the per-kill attributed roster (complete only
 * after every death has been attributed). Fall back to the caller-supplied
 * list when nothing has been attributed yet.
 */
export function selectDefeatedEnemiesForRewards(
  passed: Array<{ name: string; level: number }> | undefined,
  attributed: AttributedKill[],
): Array<{ name: string; level: number }> {
  if (attributed.length > 0) {
    return attributed.map((e) => ({
      name: e.pieceType ?? e.name ?? "unknown",
      level: e.level ?? 1,
    }));
  }
  return passed ?? [];
}

export interface VictoryExpInput {
  /** Explicit positive XP grant; wins over the derived fallbacks when > 0. */
  explicitGrant?: number;
  defeatedEnemies: Array<{ name: string; level: number }>;
  characterLevel: number;
}

/**
 * Derives the XP for a won battle: an explicit positive grant wins, otherwise
 * the sum of defeated enemies' level * 20, falling back to characterLevel * 20.
 */
export function computeVictoryExp({
  explicitGrant,
  defeatedEnemies,
  characterLevel,
}: VictoryExpInput): number {
  if (explicitGrant !== undefined && explicitGrant > 0) {
    return explicitGrant;
  }
  if (defeatedEnemies.length > 0) {
    return defeatedEnemies.reduce((sum, enemy) => sum + enemy.level * 20, 0);
  }
  return characterLevel * 20;
}

export interface BossRushPersistInput {
  defeatedEnemies: Array<{ name: string; level: number }>;
  characterLevel: number;
  baseDoka: number;
}

/**
 * Builds the reward input for a Boss Rush room clear with multiplier 1,
 * reading the defeated list so mid-battle minion kills count toward XP.
 */
export function buildBossRushPersistInput({
  defeatedEnemies,
  characterLevel,
  baseDoka,
}: BossRushPersistInput): RewardInput {
  return {
    victory: true,
    enemiesDefeated: defeatedEnemies,
    completedChallenges: [],
    dungeonMultiplier: PREAPPLIED_REWARD_MULTIPLIER,
    baseDoka,
    baseXp: computeVictoryExp({ defeatedEnemies, characterLevel }),
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
    const dokaAlreadyApplied =
      input.dungeonMultiplier === PREAPPLIED_REWARD_MULTIPLIER;
    dokaDelta += dokaAlreadyApplied
      ? input.baseDoka
      : Math.floor(input.baseDoka * input.dungeonMultiplier);
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

  const { newDoka, newXp, newLevel } = readApplyRewardsOk(result);

  // Build recap data
  const recap: BattleRecapData = {
    xpEarned: xpDelta,
    dokaEarned: dokaDelta,
    dokaFromVictory: victory
      ? dungeonMultiplier === PREAPPLIED_REWARD_MULTIPLIER
        ? baseDoka
        : Math.floor(baseDoka * dungeonMultiplier)
      : 0,
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
