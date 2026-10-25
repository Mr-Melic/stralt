/**
 * In-battle lava / spikes movement-stepper soak.
 *
 * The leftover-walk rAF (`movePlayer`) still subtracts the raw lava
 * (`8 + floor(random * 8)` → 8–15) or spikes (`5 + floor(random * 6)` →
 * 5–10) packet from HP and records that same number through
 * `recordInBattleChallengeDamage`. Enemy kit spells and DoT ticks go
 * through `playerTakesDamage` (RES, then Shield Charm, then HP actually
 * lost).
 *
 * Sequence: Shield Charm → Untouchable → in-battle step onto lava or
 * spikes. Live WX skipped the soak, so the shield sat unused and the
 * 500 Doka / 1000 XP objective failed even though an enemy kit hit of
 * the same size would have been soaked. A 2 HP lava step also skipped
 * the plague-style synchronous `_handlePlayerDeath`, so End Turn could
 * still let the last hostile die to DoT and `shouldAwardVictory` while
 * `deathTriggered` was false.
 *
 * Distinct from Thorned Ground / Void Rift battle-walk soak (#1097,
 * `applyBattleWalkHazards` after `battleWalkHazardDamages`), Void Mirror
 * / Reflect Shield (#1084 / #973), Mirror Field (#1079), leftover-walk
 * lava rAF halt (#546), leftover-walk Flee (#820), and liveHp-0
 * killing-blow victory (#652). Lava / spikes roll formulas are
 * unchanged; this is the RES-then-shield packet `playerTakesDamage`
 * applies. Incoming ≤ 0 is a no-op (do not mint 1 HP from
 * `Math.max(1, …)`). Overworld steps still must not increment the
 * next fight's counter (`recordInBattleChallengeDamage`).
 *
 * Unique vs #546 / #652 / #820 / #973 / #1079 / #1084 / #1097.
 * WorldExploration leftover-walk rAF / challengeCompletion /
 * progressPersist / deathPenalty / battleSetup walk-hazard helpers
 * left untouched so older open PRs stay merge-clean. Restack the
 * lava / spikes stepper branch onto `planLavaSpikeWalkHit` after
 * those PRs land.
 */

import { recordInBattleChallengeDamage } from "../utils/challengeCompletion.ts";
import { hpAfterIncomingDamage } from "./battleSetup.ts";

export const LAVA_WALK_DAMAGE_MIN = 8;
export const LAVA_WALK_DAMAGE_SPAN = 8;
export const LAVA_WALK_DAMAGE_MAX =
  LAVA_WALK_DAMAGE_MIN + LAVA_WALK_DAMAGE_SPAN - 1;
export const SPIKE_WALK_DAMAGE_MIN = 5;
export const SPIKE_WALK_DAMAGE_SPAN = 6;
export const SPIKE_WALK_DAMAGE_MAX =
  SPIKE_WALK_DAMAGE_MIN + SPIKE_WALK_DAMAGE_SPAN - 1;

export type LavaSpikeWalkHazard = "lava" | "spikes";

export interface LavaSpikeWalkHitInput {
  incoming: number;
  hp: number;
  res: number;
  resModifier?: number;
  shieldHp: number;
}

export interface LavaSpikeWalkHit {
  damageAfterRes: number;
  shieldAbsorb: number;
  remainingShield: number;
  hpLost: number;
  newHp: number;
  lethal: boolean;
  challengeDamage: number;
}

function toNat(n: number): number {
  const value = Math.floor(Number(n));
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function rollInRange(min: number, span: number, rng: () => number): number {
  const unit = Number(rng());
  if (!Number.isFinite(unit)) return min;
  const clamped = Math.max(0, Math.min(0.999999999, unit));
  return min + Math.floor(clamped * span);
}

/** Live leftover-walk lava packet: `8 + floor(random * 8)` → 8–15. */
export function rollLavaWalkDamage(rng: () => number = Math.random): number {
  return rollInRange(LAVA_WALK_DAMAGE_MIN, LAVA_WALK_DAMAGE_SPAN, rng);
}

/** Live leftover-walk spikes packet: `5 + floor(random * 6)` → 5–10. */
export function rollSpikeWalkDamage(rng: () => number = Math.random): number {
  return rollInRange(SPIKE_WALK_DAMAGE_MIN, SPIKE_WALK_DAMAGE_SPAN, rng);
}

export function isLavaSpikeWalkHazardType(
  hazardType: string | null | undefined,
): hazardType is LavaSpikeWalkHazard {
  return hazardType === "lava" || hazardType === "spikes";
}

/** Thorned Ground / Void Rift leftover identity (#1097). */
export function isLavaSpikeWalkBlockedThornRiftHazard(
  hazardType: string | null | undefined,
): boolean {
  return hazardType === "thorned_ground" || hazardType === "void_rift";
}

/**
 * RES-then-shield packet for one positive lava / spikes debit.
 *
 * Matches `playerTakesDamage`: `effRes = res * resModifier`, then
 * `max(1, round(incoming * (1 - effRes/100)))`, then Shield Charm.
 * Incoming ≤ 0 is a no-op so a missing hazard cannot mint a 1 HP hit
 * from that floor.
 */
export function planLavaSpikeWalkHit(
  args: LavaSpikeWalkHitInput,
): LavaSpikeWalkHit {
  const hp = toNat(args.hp);
  const shieldHp = toNat(args.shieldHp);
  const incoming = Number(args.incoming);
  if (!Number.isFinite(incoming) || incoming <= 0) {
    return {
      damageAfterRes: 0,
      shieldAbsorb: 0,
      remainingShield: shieldHp,
      hpLost: 0,
      newHp: hp,
      lethal: false,
      challengeDamage: 0,
    };
  }

  const res = Number(args.res);
  const resModifier = Number(args.resModifier);
  const effRes =
    (Number.isFinite(res) ? res : 0) *
    (Number.isFinite(resModifier) ? resModifier : 1);
  const damageAfterRes = Math.max(
    1,
    Math.round(incoming * Math.max(0, 1 - effRes / 100)),
  );
  const shieldAbsorb = Math.min(shieldHp, damageAfterRes);
  const hpLost = Math.max(0, damageAfterRes - shieldAbsorb);
  const remainingShield = Math.max(0, shieldHp - shieldAbsorb);
  const { newHp, lethal } = hpAfterIncomingDamage(hp, hpLost);
  return {
    damageAfterRes,
    shieldAbsorb,
    remainingShield,
    hpLost,
    newHp,
    lethal,
    challengeDamage: hpLost,
  };
}

/**
 * Live leftover-walk rAF wrote `max(0, hp - incoming)` and recorded
 * `incoming` even when Shield Charm still had stack. Keep this as the
 * divergence proof — do not call it from production.
 */
export function liveWxRawLavaSpikeWalkHit(
  hp: number,
  incoming: number,
): { newHp: number; challengeDamage: number } {
  const cur = toNat(hp);
  const add = Number.isFinite(incoming) ? Math.max(0, incoming) : 0;
  return {
    newHp: Math.max(0, cur - add),
    challengeDamage: add,
  };
}

/**
 * Challenge counter is zeroed in `cleanupBattle`, not at battle start.
 * Overworld lava / spikes must not fail the next fight's Untouchable.
 */
export function recordLavaSpikeWalkChallengeDamage(
  inBattle: boolean,
  current: number,
  hpLost: number,
): number {
  return recordInBattleChallengeDamage(inBattle, current, hpLost);
}

/**
 * Plague turn-start already calls `_handlePlayerDeath` on the same stack.
 * Lava / spikes leftover-walk used to rely on the async HP-watch, so a
 * lethal step left `deathTriggered` false through End Turn.
 */
export function shouldDispatchDeathAfterLavaSpikeWalk(
  lethal: boolean,
): boolean {
  return lethal === true;
}
