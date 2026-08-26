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

export interface ApplyRewardsActor {
  applyRewards: (
    slot: bigint,
    dokaDelta: bigint,
    xpDelta: bigint,
  ) => Promise<
    | { ok: { newDoka: bigint | number }; err?: undefined }
    | { err: string; ok?: undefined }
    | { __kind__: "ok"; ok: { newDoka: bigint | number } }
    | { __kind__: "err"; err: string }
  >;
}

/** Clamp a world Doka credit to a non-negative integer. */
export function normalizeDokaCredit(amount: number): number {
  if (!Number.isFinite(amount)) return 0;
  return Math.max(0, Math.floor(amount));
}

/**
 * Persist a Doka-only credit through the atomic applyRewards funnel.
 * Used for world pickups, shrine completion, and dungeon-chain bonuses so
 * GameFlow's getCallerDokaBalance hydration cannot wipe unpersisted grants.
 */
export async function persistDokaCredit(
  actor: ApplyRewardsActor,
  slot: number,
  dokaDelta: number,
): Promise<number> {
  const credit = normalizeDokaCredit(dokaDelta);
  if (credit === 0) {
    throw new Error("persistDokaCredit requires a positive doka delta");
  }
  const result = await actor.applyRewards(
    BigInt(slot),
    BigInt(credit),
    BigInt(0),
  );
  if (result && typeof result === "object" && "err" in result && result.err) {
    throw new Error(`applyRewards failed: ${result.err}`);
  }
  const payload =
    result && typeof result === "object" && "ok" in result ? result.ok : null;
  const newDoka = payload?.newDoka;
  if (newDoka === undefined || newDoka === null) {
    throw new Error("applyRewards returned no newDoka");
  }
  return Number(newDoka);
}
