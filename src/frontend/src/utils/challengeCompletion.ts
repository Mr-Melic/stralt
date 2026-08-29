/**
 * Battle-challenge completion predicates.
 *
 * handleBattleEnd persists advertised Doka/XP only when
 * `isChallengeCompleted(liveChallenge, progress)` is true. A wrong
 * boundary here silently drops 400–1000 XP or credits a failed objective.
 */

export type ChallengeTier = "easy" | "hard" | "legendary";

export type ChallengeCondition =
  | "no_healing"
  | "under_15_turns"
  | "under_50_damage"
  | "no_healing_under_30_damage"
  | "under_10_turns"
  | "under_8_ap_per_turn"
  | "no_damage_taken"
  | "under_5_turns"
  | "direct_hit";

export interface Challenge {
  id: string;
  tier: ChallengeTier;
  description: string;
  condition: ChallengeCondition;
  rewards: { doka?: number; xp?: number; badge?: string };
}

export interface ChallengePanelProgress {
  turnCount: number;
  totalDamage: number;
  healUsed: boolean;
  directHit: boolean;
  maxApUsedInTurn: number;
}

export const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: "easy_1",
    tier: "easy",
    description: "Win without using healing spells",
    condition: "no_healing",
    rewards: { doka: 50 },
  },
  {
    id: "easy_2",
    tier: "easy",
    description: "Defeat all enemies within 15 turns",
    condition: "under_15_turns",
    rewards: { doka: 75 },
  },
  {
    id: "easy_3",
    tier: "easy",
    description: "Take less than 50 damage total",
    condition: "under_50_damage",
    rewards: { doka: 60 },
  },
  {
    id: "hard_1",
    tier: "hard",
    description: "Win without healing and take under 30 damage",
    condition: "no_healing_under_30_damage",
    rewards: { doka: 200, xp: 500 },
  },
  {
    id: "hard_2",
    tier: "hard",
    description: "Defeat all enemies within 10 turns",
    condition: "under_10_turns",
    rewards: { doka: 175, xp: 400 },
  },
  {
    id: "hard_3",
    tier: "hard",
    description: "Never spend more than 8 AP in any single turn",
    condition: "under_8_ap_per_turn",
    rewards: { doka: 150, xp: 450 },
  },
  {
    id: "legendary_1",
    tier: "legendary",
    description: "Win without taking any damage at all",
    condition: "no_damage_taken",
    rewards: { doka: 500, xp: 1000, badge: "Untouchable" },
  },
  {
    id: "legendary_2",
    tier: "legendary",
    description: "Defeat all enemies in under 5 turns",
    condition: "under_5_turns",
    rewards: { doka: 450, xp: 900, badge: "Blitz" },
  },
  {
    id: "legendary_3",
    tier: "legendary",
    description:
      "Win using only spells cast on targets within 2 tiles (Chebyshev distance ≤ 2)",
    condition: "direct_hit",
    rewards: { doka: 400, xp: 800, badge: "Striker" },
  },
];

export function isChallengeCompleted(
  challenge: Challenge,
  progress: ChallengePanelProgress,
): boolean {
  switch (challenge.condition) {
    case "no_healing":
      return !progress.healUsed;
    case "under_15_turns":
      return progress.turnCount <= 15;
    case "under_50_damage":
      return progress.totalDamage < 50;
    case "no_healing_under_30_damage":
      return !progress.healUsed && progress.totalDamage < 30;
    case "under_10_turns":
      return progress.turnCount <= 10;
    case "under_8_ap_per_turn":
      return progress.maxApUsedInTurn <= 8;
    case "no_damage_taken":
      return progress.totalDamage === 0;
    case "under_5_turns":
      return progress.turnCount <= 5;
    case "direct_hit":
      return progress.directHit;
    default:
      return false;
  }
}

/**
 * Accumulate HP actually lost this battle for challenge predicates.
 *
 * handleBattleEnd / handleBossRushRoomClear persist advertised Untouchable
 * (1000 XP / 500 Doka) and under-50-damage rewards from this total. Only
 * the boss-ability branch used to increment it, so a regular melee or
 * spell hit left totalDamage at 0 and credited a failed objective.
 */
export function recordChallengeDamageTaken(
  current: number,
  incoming: number,
): number {
  const base = Math.max(0, Math.floor(Number(current) || 0));
  const add = Math.max(0, Math.floor(Number(incoming) || 0));
  return base + add;
}

/**
 * True when the condition can no longer be satisfied this battle
 * (banner chip should flip to ✗). "under_N_turns" challenges are only
 * failed at battle end (turn count is final only on victory), so they
 * report false mid-battle.
 */
export function isChallengeFailed(
  challenge: Challenge,
  progress: ChallengePanelProgress,
): boolean {
  switch (challenge.condition) {
    case "no_healing":
      return progress.healUsed;
    case "under_15_turns":
      return false;
    case "under_50_damage":
      return progress.totalDamage >= 50;
    case "no_healing_under_30_damage":
      return progress.healUsed || progress.totalDamage >= 30;
    case "under_10_turns":
      return false;
    case "under_8_ap_per_turn":
      return progress.maxApUsedInTurn > 8;
    case "no_damage_taken":
      return progress.totalDamage > 0;
    case "under_5_turns":
      return false;
    case "direct_hit":
      return !progress.directHit;
    default:
      return false;
  }
}
