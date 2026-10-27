/**
 * Player-controlled summon kit *select* ignores remaining cooldown.
 *
 * Catalog Inferno is the only summon-kit row with `cooldown: 3`. Player
 * BattleUIPanel disables slots when `spellCooldowns[id] > 0` (`#708`).
 * `SummonControlPanel` kit buttons disable only on `currentAp < apCost`.
 * WorldExploration maps kit rows to `{ id, name, apCost }` — no remaining
 * field — and `onSpellSelect` always writes `selectedSummonSpellId`.
 *
 * Distinct from tile remaining consult (`#1205` `summonControlCooldown.ts`),
 * control-path execute never writing remaining (`#1206`
 * `summonControlCooldownArm.ts`), auto-AI applyCast never writing CD
 * (`#1166`), WX summon availableSpells unfiltered (`#1158`), findKitSpell
 * assigned fallback (`#1150`), pack Inferno CD nested under `damage > 0`
 * (`#972`), player-bar AP/CD highlight (`#708`), and summon-control LoS/AP
 * highlight (`#757`). Cluster radius / self-detonate stay `#799`. Inferno
 * ticks stay `#856` / `#947`. Catalog bomber `summonUnitDef.ap` is 1, which
 * cannot pay Inferno 5 — unique fire needs `currentAp >= 5`; do not
 * rebalance. Remaining-already-3 *tile* empty-set is `#1205`. Arm after a
 * legal dest is `#1206`. Auto-AI (`controllingSummon !== true`) is `#1166`.
 *
 * Unique fire: remaining 0 / 5 AP Inferno kit is selectable and a
 * Chebyshev-3 living hostile dest executes; remaining 3 still enables the
 * live panel while this sidecar refuses select. Chebyshev 4 / corpse /
 * ally / empty cannot execute. Strike / Frost / Drain / Venom / Poison /
 * Slow / Blood Mend / hunter / archer / queen cannot. Wall-blocked still
 * executes (player LoS is `!!spell.lineOfSight`; Inferno has no flag).
 *
 * Do not restack WorldExploration / SummonControlPanel /
 * summonControlCast / targeting / spellEngine / enemyAI /
 * summonExecutor / statusEffects. Restack kit `disabled` +
 * `onSpellSelect` onto `shouldSelectSummonControlKitCooldown` after older
 * combat PRs land.
 */

import {
  isSpellOnCooldown,
  nextSpellCooldownTurns,
} from "../utils/challengeCompletion.ts";
import { canAffordCastAp } from "./targeting.ts";

export type SummonControlKitSelectCooldownSpell = {
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

export type SummonControlKitSelectCooldownArgs = {
  controllingSummon: boolean;
  remaining?: unknown;
  currentAp: number;
  spell: SummonControlKitSelectCooldownSpell;
};

function isZeroDamageDot(spell: SummonControlKitSelectCooldownSpell): boolean {
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
export function isSummonControlKitSelectCooldownSpell(
  spell: SummonControlKitSelectCooldownSpell,
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
  if (summonControlKitSelectCooldownTurns(spell) <= 0) return false;
  return Number(spell.range) === 3;
}

/** Advertised lock length. Catalog Inferno is 3. */
export function summonControlKitSelectCooldownTurns(
  spell: SummonControlKitSelectCooldownSpell,
): number {
  return nextSpellCooldownTurns(spell.cooldown);
}

export function summonControlKitSelectIsReady(remaining?: unknown): boolean {
  return !isSpellOnCooldown(remaining);
}

/**
 * Live `SummonControlPanel` disable: AP only. Remaining is unused.
 * Remaining 3 + 5 AP still enables Inferno.
 */
export function liveSummonControlKitSlotDisabled(args: {
  currentAp: number;
  apCost: unknown;
}): boolean {
  const have = Math.max(0, Math.floor(Number(args.currentAp) || 0));
  const cost = Math.max(0, Math.floor(Number(args.apCost) || 0));
  return have < cost;
}

/**
 * Live kit select never reads remaining. Always true: proven by the
 * panel / WX mapping source scan in the test file.
 */
export function liveSummonControlKitSelectIgnoresCooldown(): boolean {
  return true;
}

/**
 * Remaining 3 with enough AP still enables the live button. Tile remaining
 * empty-set is `#1205`. Arm-after-dest is `#1206`.
 */
export function liveSummonControlWouldSelectThroughCooldown(args: {
  currentAp: number;
  spell: SummonControlKitSelectCooldownSpell;
  remaining?: unknown;
}): boolean {
  if (!isSummonControlKitSelectCooldownSpell(args.spell)) return false;
  if (!isSpellOnCooldown(args.remaining)) return false;
  return !liveSummonControlKitSlotDisabled({
    currentAp: args.currentAp,
    apCost: args.spell.apCost,
  });
}

/**
 * Kit-button highlight. Remaining already 3 is this leftover (select),
 * not `#1205` (tile). Auto-AI is `#1166`. Catalog bomber AP 1 cannot pay.
 */
export function shouldSelectSummonControlKitCooldown(
  args: SummonControlKitSelectCooldownArgs,
): boolean {
  if (args.controllingSummon !== true) return false;
  if (!isSummonControlKitSelectCooldownSpell(args.spell)) return false;
  if (!summonControlKitSelectIsReady(args.remaining)) return false;
  return canAffordCastAp(args.currentAp, Number(args.spell.apCost ?? 0));
}

export function shouldHighlightSummonControlKitSelect(
  args: SummonControlKitSelectCooldownArgs,
): boolean {
  return shouldSelectSummonControlKitCooldown(args);
}

/**
 * Select + dest. Remaining 3 refuses even when the dest is otherwise
 * legal. Chebyshev 4 / corpse / ally / empty pass select (when remaining
 * 0) and fail only at dest.
 */
export function canExecuteSummonControlKitSelectCooldownCast(args: {
  controllingSummon: boolean;
  remaining?: unknown;
  currentAp: number;
  spell: SummonControlKitSelectCooldownSpell;
  executedLegalDest: boolean;
}): boolean {
  if (!shouldSelectSummonControlKitCooldown(args)) return false;
  return args.executedLegalDest === true;
}

export function summonControlKitSelectHighlightedTargetIsExecutable(args: {
  selected: boolean;
  executable: boolean;
}): boolean {
  return args.selected === true && args.executable === true;
}
