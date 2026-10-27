/**
 * Player-controlled summon kit execute never arms remaining cooldown.
 *
 * Catalog Inferno is the only summon-kit row with `cooldown: 3`. Player
 * `executeCastAttempt` writes `spellCooldownsRef` after a spent cast
 * (`nextSpellCooldownTurns` + `castResultAppliesCooldown`). The control
 * path (`castControlledSummonSpell` → `planSummonControlCast` →
 * `resolveSpellCast`) deducts AP and returns. It never reads remaining
 * and never writes it. `summonCastCommittedRef` plus leftover AP 0
 * (Inferno costs 5) block a same-turn recast; the next bomber turn
 * restores AP via `summonTurnBudget` while remaining is still 0, so
 * Inferno recasts immediately instead of waiting 3 turns.
 *
 * Distinct from remaining-already-3 highlight vs execute (`#1205`
 * `summonControlCooldown.ts`), auto-AI applyCast never writing CD
 * (`#1166`), WX summon availableSpells unfiltered (`#1158`),
 * findKitSpell assigned fallback (`#1150`), pack Inferno CD nested
 * under `damage > 0` (`#972`), and player-bar AP/CD highlight (`#708`).
 *
 * Unique fire: remaining 0 / legal dest / `currentAp >= 5` / Chebyshev 3
 * living hostile executes; advertised remaining becomes 3 so the next
 * turn cannot recast; live remaining stays 0 so it can. Catalog bomber
 * `summonUnitDef.ap` is 1, which cannot pay Inferno 5 — `#762`; do not
 * rebalance. Remaining already 3 is `#1205`. Auto-AI
 * (`controllingSummon !== true`) is `#1166`.
 *
 * Do not restack WorldExploration / SummonControlPanel /
 * summonControlCast / targeting / spellEngine / enemyAI /
 * summonExecutor / statusEffects. Restack `castControlledSummonSpell`
 * onto `armSummonControlCooldownAfterLegalDest` after older combat PRs
 * land.
 */

import {
  isSpellOnCooldown,
  nextSpellCooldownTurns,
} from "../utils/challengeCompletion.ts";
import { canAffordCastAp } from "./targeting.ts";

export type SummonControlCooldownArmSpell = {
  id?: string;
  range?: unknown;
  maxRange?: number;
  apCost?: unknown;
  spellType?: string | null;
  damage?: unknown;
  healAmount?: unknown;
  buffStat?: string | null;
  debuffStat?: string | null;
  dotDamage?: unknown;
  dotDamagePerTurn?: unknown;
  dotDuration?: unknown;
  effectType?: string | null;
  isDotSpell?: boolean | null;
  areaRadius?: unknown;
  hitsMultiple?: boolean | null;
  aoe?: boolean | null;
  isSummon?: boolean | null;
  isSwap?: boolean | null;
  isMark?: boolean | null;
  isMirror?: boolean | null;
  isBarrier?: boolean | null;
  cooldown?: unknown;
};

export type SummonControlCooldownArmArgs = {
  controllingSummon: boolean;
  remainingBefore?: unknown;
  executedLegalDest: boolean;
  spell: SummonControlCooldownArmSpell;
};

function finiteNonNegative(n: unknown): number {
  const v = Math.max(0, Math.floor(Number(n) || 0));
  return Number.isFinite(v) ? v : 0;
}

function isZeroDamageDot(spell: SummonControlCooldownArmSpell): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (spell.buffStat) return false;
  if (spell.debuffStat) return false;
  const dpt = Number(spell.dotDamagePerTurn ?? spell.dotDamage ?? 0);
  const duration = Number(spell.dotDuration ?? 0);
  if (dpt <= 0 || duration <= 0) return false;
  return spell.isDotSpell === true || spell.effectType === "dot";
}

/**
 * Inferno leftover identity: 0-upfront-damage DoT at Chebyshev 3 with
 * advertised cooldown > 0. Poison is range 4. Venom is range 2. Strike
 * has damage 10. Slow is an MP debuff with no ticks.
 */
export function isSummonControlCooldownArmSpell(
  spell: SummonControlCooldownArmSpell,
): boolean {
  if (!isZeroDamageDot(spell)) return false;
  if (spell.hitsMultiple || spell.aoe) return false;
  if (Math.max(0, Math.floor(Number(spell.areaRadius ?? 0))) > 0) {
    return false;
  }
  if (spell.isSummon || spell.isSwap || spell.isMark || spell.isMirror) {
    return false;
  }
  if (spell.isBarrier) return false;
  if (summonControlCooldownArmTurns(spell) <= 0) return false;
  return Number(spell.range) === 3;
}

/** Advertised lock length. Catalog Inferno is 3. */
export function summonControlCooldownArmTurns(
  spell: SummonControlCooldownArmSpell,
): number {
  return nextSpellCooldownTurns(spell.cooldown);
}

export function summonControlCooldownArmRemaining(
  remainingBefore?: unknown,
): number {
  return finiteNonNegative(remainingBefore);
}

export function summonControlCooldownArmIsReady(
  remainingBefore?: unknown,
): boolean {
  return !isSpellOnCooldown(remainingBefore);
}

/**
 * Live `castControlledSummonSpell` never writes remaining after a legal
 * dest. Always false: proven by the WX source scan in the test file.
 */
export function liveWxArmsSummonControlCooldownAfterLegalDest(): boolean {
  return false;
}

/** Live execute leaves remaining unchanged. */
export function remainingAfterLiveWxSummonControlExecute(
  remainingBefore?: unknown,
): number {
  return summonControlCooldownArmRemaining(remainingBefore);
}

/**
 * Arm only a ready Inferno on the player-control path after a legal dest.
 * Remaining already 3 is `#1205`. Auto-AI is `#1166`.
 */
export function canArmSummonControlCooldown(
  args: SummonControlCooldownArmArgs,
): boolean {
  if (args.controllingSummon !== true) return false;
  if (!summonControlCooldownArmIsReady(args.remainingBefore)) return false;
  if (args.executedLegalDest !== true) return false;
  if (!isSummonControlCooldownArmSpell(args.spell)) return false;
  return summonControlCooldownArmTurns(args.spell) > 0;
}

export function shouldDecideSummonControlCooldownArm(
  args: SummonControlCooldownArmArgs,
): boolean {
  return canArmSummonControlCooldown(args);
}

/**
 * Remaining after a legal dest. Ready Inferno becomes advertised 3.
 * Otherwise remaining is unchanged (already-armed `#1205`, auto-AI
 * `#1166`, or a skipped dest).
 */
export function armSummonControlCooldownAfterLegalDest(
  args: SummonControlCooldownArmArgs,
): number {
  if (!canArmSummonControlCooldown(args)) {
    return summonControlCooldownArmRemaining(args.remainingBefore);
  }
  return summonControlCooldownArmTurns(args.spell);
}

export function summonControlCooldownArmHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/** Next-turn recast: remaining 0 + enough AP. Remaining 3 must refuse. */
export function canRecastSummonControlInfernoAfterArm(args: {
  remaining: unknown;
  currentAp: number;
  spell: SummonControlCooldownArmSpell;
}): boolean {
  if (!isSummonControlCooldownArmSpell(args.spell)) return false;
  if (isSpellOnCooldown(args.remaining)) return false;
  return canAffordCastAp(args.currentAp, Number(args.spell.apCost ?? 0));
}
