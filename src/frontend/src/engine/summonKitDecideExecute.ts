/**
 * Summon kit decide vs `executeSummonAction` applyCast.
 *
 * `decideSummonGuardian` / bomber / healer pick a kit spell with
 * Chebyshev `enemyCastRangeOk` and never read AP. applyCast then
 * rejects when `currentAp < Number(apCost)` (same debit as
 * `resolveCastApCost` / `canAffordCastAp` with identity `applyApCost`).
 * A decided in-range Shield can therefore fail at 1 AP, and Iron Skin
 * (3 AP) is decided on a 2-AP golem that cannot spend it.
 *
 * This module is that shared gate: AP + Chebyshev range, no LoS
 * (guardian / healer / bomber skip LoS on purpose). Do not switch
 * range to `spellRangeBase` (would rebalance). enemyAI /
 * summonExecutor / WorldExploration are left untouched so older open
 * PRs stay merge-clean (#379 summon AP, #417 AI range, #432 execute
 * range, #757 summon-control highlight).
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import {
  type CasterPosition,
  canAffordCastAp,
  enemyCastRangeOk,
  resolveCastApCost,
} from "./targeting.ts";

export type SummonKitCastSpell =
  | Pick<SpellConfig, "apCost" | "range">
  | {
      apCost?: unknown;
      range?: unknown;
    };

/** Same debit applyCast uses after #379 (`resolveCastApCost(Number(apCost))`). */
export function summonKitCastApCost(spell: SummonKitCastSpell): number {
  return resolveCastApCost(Number(spell.apCost ?? 0));
}

export function canAffordSummonKitCast(
  currentAp: number,
  spell: SummonKitCastSpell,
): boolean {
  return canAffordCastAp(currentAp, Number(spell.apCost ?? 0));
}

export function summonKitCastRangeOk(
  origin: CasterPosition,
  target: CasterPosition,
  spell: SummonKitCastSpell,
): boolean {
  return enemyCastRangeOk(origin, target, spell as Pick<SpellConfig, "range">);
}

/**
 * Execute gate: AP wallet plus Chebyshev range. Decide must use this
 * so a chosen kit target actually applies.
 */
export function canExecuteSummonKitCast(args: {
  currentAp: number;
  origin: CasterPosition;
  target: CasterPosition;
  spell: SummonKitCastSpell;
}): boolean {
  return (
    canAffordSummonKitCast(args.currentAp, args.spell) &&
    summonKitCastRangeOk(args.origin, args.target, args.spell)
  );
}

/** Alias so decide and execute cannot fork. */
export function shouldDecideSummonKitCast(
  args: Parameters<typeof canExecuteSummonKitCast>[0],
): boolean {
  return canExecuteSummonKitCast(args);
}

export function summonKitHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
