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
 * Mark heal-used for `no_healing` / `no_healing_under_30_damage`.
 *
 * handleBattleEnd persists easy_1 (50 Doka) and hard_1 (200 Doka / 500 XP)
 * from `healUsed`. The flag is only cleared in cleanupBattle (battle end),
 * not at the next battle start. The overworld Doka-to-HP button used to
 * flip it, so a pre-fight heal failed the following no-heal challenge
 * even when no healing spell was cast.
 */
export function recordInBattleChallengeHealUsed(
  inBattle: boolean,
  alreadyUsed: boolean,
): boolean {
  if (!inBattle) return alreadyUsed === true;
  return true;
}

/**
 * Lava / spike tiles live on the overworld map and also deal HP during
 * combat walks. The challenge counter is zeroed in cleanupBattle, not at
 * battle start, so an out-of-combat hazard step must not increment it —
 * leftover overworld damage would fail the next fight's Untouchable.
 */
export function recordInBattleChallengeDamage(
  inBattle: boolean,
  current: number,
  incoming: number,
): number {
  if (!inBattle) return current;
  return recordChallengeDamageTaken(current, incoming);
}

/**
 * AP actually spent this battle for `under_8_ap_per_turn`.
 *
 * handleBattleEnd persists hard_3 (150 Doka / 450 XP) from the peak
 * `maxApUsedInTurn`. The live ref used to reset to 0 at every player
 * turn start, so a 9+ AP dump on turn 1 followed by a cheap finish
 * still credited the reward.
 *
 * Keep a per-turn accumulator (reset on turn start) and a peak that
 * only clears in cleanupBattle.
 */
export function recordChallengeApSpend(
  peak: number,
  spentThisTurn: number,
  cost: number,
): { peak: number; spentThisTurn: number } {
  const add = Math.max(0, Math.floor(Number(cost) || 0));
  const thisTurn = Math.max(0, Math.floor(Number(spentThisTurn) || 0)) + add;
  return {
    spentThisTurn: thisTurn,
    peak: Math.max(0, Math.floor(Number(peak) || 0), thisTurn),
  };
}

/**
 * legendary_3 Striker (400 Doka / 800 XP) requires every spent attempt
 * to land within Chebyshev distance 2. Sprite-click (the primary enemy
 * targeting path) used to skip the follow-up that flipped
 * `challengeDirectHitRef`, so a range-3+ Poison / Inferno / Frost hit
 * still persisted the reward. Once false, it stays false for the fight.
 */
export function recordChallengeDirectHit(
  stillDirect: boolean,
  caster: { x: number; y: number },
  target: { x: number; y: number },
): boolean {
  if (!stillDirect) return false;
  const dx = Math.abs(Number(target.x) - Number(caster.x));
  const dy = Math.abs(Number(target.y) - Number(caster.y));
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) return false;
  return Math.max(dx, dy) <= 2;
}

/**
 * resolvePlayerCast results that consumed the spell attempt.
 * `summon` must debit the same as `cast` / `fizzled` — canvas click
 * routed summons through executeCastAttempt and then skipped the
 * follow-up debit because a stale comment claimed it was already paid.
 */
export function castResultSpendsAp(result: string): boolean {
  return result === "cast" || result === "fizzled" || result === "summon";
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
