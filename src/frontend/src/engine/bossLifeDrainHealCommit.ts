/**
 * Starved Vampire Pawn LIFE_DRAIN trigger heal (`WorldExploration` ~16025).
 *
 * `applyLifeDrain` (`useBossSystem.ts` ~1034) tracks
 * `vampirePawnDrainAccumulated`. At ≥10 it returns
 * `{ newBossState: { vampirePawnDrainAccumulated: remainder },
 *    logMessages: ["… It heals 15 HP and gains +1 attack!"] }`
 * with **no** boss HP / atk field. `useBossAI` fires that ability when
 * adjacent (`type: "ability"`, `BossAbility.LIFE_DRAIN`). Live
 * WorldExploration then:
 *   `if (res?.damageToPlayer && res.damageToPlayer > 0) { apply player HP }`
 *   merge `newBossState` (accumulator only)
 *   `updateCombatant({ x, y })`
 * so the log fires and boss HP / atk never move. A 10/60 pawn stays 10
 * (Strike 10 kills it; with the heal it is 25). `atk` 8 stays 8.
 * Player `healUsed` stays false — this is a **boss** self-heal, not Dawn.
 *
 * `useBossAI` also calls `applyBossAbility(LIFE_DRAIN, p)` without
 * `extra.damageDealtToPlayer`, so the live accumulator often stays 0 and
 * the trigger log never appears. This sidecar still locks the **commit**
 * leftover: when the grow-stronger log is present, WX drops the 15 HP /
 * +1 atk. Kit `starter-drain` (`healAmount` 5 via the type:"spell" arm at
 * ~15873) is a different path — not this 15 / +1.
 *
 * Unique extra vs:
 * - #948 `bossDawnHealCommit`: Twin Monarchs `damageToPlayer: -10` heals
 *   the **player** and flips `healUsed`. Negative damage must not become
 *   this 15 HP boss heal, and this heal must not fail easy_1.
 * - #916 `bossAttackDamageCommit`: melee player HP when `damageToPlayer`
 *   is missing. This ability has no player HP field either — leftover
 *   player HP stays put; do not swing `baseStats.atk` 8 at the player.
 * - #921 player Life Drain advertised SP (`resolvePlayerCast`).
 * - Kit drain ~15873 `healAmount` 5 (no +atk).
 * - VAMPIRIC_AOE `damageToPlayer: 10` (player HP, no boss self-heal field).
 * - #924 pack-enemy heal CHC.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * bossDawnHealCommit.ts, bossAttackDamageCommit.ts, spellEngine.ts, or
 * challengeCompletion.ts. Restack the WX ability apply onto
 * `resolveBossLifeDrainHpCommit` after those PRs land.
 */

import { hpAfterHeal, isAliveCombatant } from "./battleSetup.ts";

export const LIFE_DRAIN_TRIGGER_LOG =
  "The Starved Vampire Pawn drains your life force, growing stronger! It heals 15 HP and gains +1 attack!";

/** `applyLifeDrain` trigger threshold (damageDealt accumulated). */
export const LIFE_DRAIN_TRIGGER_THRESHOLD = 10;

/** Advertised boss self-heal on the grow-stronger log. */
export const LIFE_DRAIN_HEAL_AMOUNT = 15;

/** Advertised permanent atk gain on the same trigger. */
export const LIFE_DRAIN_ATK_GAIN = 1;

export const LIFE_DRAIN_ABILITY = "LIFE_DRAIN";

export type BossLifeDrainHealActionLike = {
  type?: string | null;
  ability?: string | null;
  abilityResult?: {
    damageToPlayer?: number | null;
    logMessages?: string[] | null;
    newBossState?: {
      vampirePawnDrainAccumulated?: number | null;
    } | null;
    playerApModifier?: number | null;
    healAmount?: number | null;
  } | null;
};

export type BossLifeDrainHealCommit = {
  hp: number;
  atk: number;
  restored: number;
  atkGained: number;
  healUsed: boolean;
  hostilesRemaining: number;
};

function finiteNumber(n: unknown): number | null {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  return v;
}

function finiteAtk(atk: number): number {
  const n = finiteNumber(atk);
  return n == null ? 0 : n;
}

/**
 * Advertised 15 HP boss self-heal. Positive / negative `damageToPlayer`
 * is player HP (queen rays, Glyph Trap, Dawn) — not this helper. Kit
 * `healAmount` on type:"spell" is the ~15873 drain arm.
 */
export function bossLifeDrainHealFromAction(
  action: BossLifeDrainHealActionLike,
): number | null {
  if (
    action.type === "attack" ||
    action.type === "spell" ||
    action.type === "move"
  ) {
    return null;
  }
  const dmg = finiteNumber(action.abilityResult?.damageToPlayer);
  if (dmg != null && dmg !== 0) return null;
  const logs = action.abilityResult?.logMessages ?? [];
  if (!logs.includes(LIFE_DRAIN_TRIGGER_LOG)) return null;
  return LIFE_DRAIN_HEAL_AMOUNT;
}

export function bossLifeDrainAtkFromAction(
  action: BossLifeDrainHealActionLike,
): number | null {
  if (bossLifeDrainHealFromAction(action) == null) return null;
  return LIFE_DRAIN_ATK_GAIN;
}

function commitLifeDrain(opts: {
  hp: number;
  maxHp: number;
  atk: number;
  action: BossLifeDrainHealActionLike;
  applyHeal: boolean;
  healUsed?: boolean;
}): BossLifeDrainHealCommit {
  const heal = opts.applyHeal ? bossLifeDrainHealFromAction(opts.action) : null;
  const atkGain = opts.applyHeal
    ? bossLifeDrainAtkFromAction(opts.action)
    : null;
  const beforeHp = finiteNumber(opts.hp) ?? 0;
  const nextHp =
    heal != null ? hpAfterHeal(opts.hp, opts.maxHp, heal) : beforeHp;
  const beforeAtk = finiteAtk(opts.atk);
  const nextAtk = atkGain != null ? beforeAtk + atkGain : beforeAtk;
  return {
    hp: nextHp,
    atk: nextAtk,
    restored: nextHp - beforeHp,
    atkGained: nextAtk - beforeAtk,
    healUsed: opts.healUsed === true,
    hostilesRemaining: isAliveCombatant({ hp: nextHp }) ? 1 : 0,
  };
}

/**
 * Production WX (~16025 / ~16226): only `damageToPlayer > 0` as player HP
 * loss, then `updateCombatant({ x, y })`. Trigger log is skipped; boss HP
 * / atk stay put.
 */
export function wxBossLifeDrainCommitWithoutHeal(opts: {
  hp: number;
  maxHp: number;
  atk: number;
  action: BossLifeDrainHealActionLike;
  healUsed?: boolean;
}): BossLifeDrainHealCommit {
  return commitLifeDrain({ ...opts, applyHeal: false });
}

/**
 * Apply advertised LIFE_DRAIN trigger heal + atk. Caps HP at `maxHp`.
 * Does **not** record player `healUsed` (boss self-heal). Positive /
 * negative `damageToPlayer` is not applied here.
 */
export function resolveBossLifeDrainHpCommit(opts: {
  hp: number;
  maxHp: number;
  atk: number;
  action: BossLifeDrainHealActionLike;
  healUsed?: boolean;
}): BossLifeDrainHealCommit {
  return commitLifeDrain({ ...opts, applyHeal: true });
}

/** True when live WX would leave the advertised 15 HP / +1 atk on the floor. */
export function wxBossLifeDrainDroppedHeal(opts: {
  hp: number;
  maxHp: number;
  atk: number;
  action: BossLifeDrainHealActionLike;
  healUsed?: boolean;
}): boolean {
  const live = wxBossLifeDrainCommitWithoutHeal(opts);
  const fixed = resolveBossLifeDrainHpCommit(opts);
  return fixed.hp > live.hp || fixed.atk > live.atk;
}
