/**
 * Enemy heal decide vs WorldExploration execute.
 *
 * `decideHealer` / `decideSummonHealer` pick any `spellType === "heal"`
 * or `healAmount > 0` (so a drain can be chosen) on a wounded ally in
 * Chebyshev range. The WX apply block only fires
 * `spellType === "heal" && Number(range) === 0` and then heals the
 * caster (`enemyId`), not `action.targetId`. Range-0 plus in-range
 * means the target cell is the caster tile.
 *
 * This module is that execute gate. A decided legal heal is executable
 * and a drain / ranged-ally heal cannot execute as a heal. Do not
 * change heal amounts, AoE, or ally-target policy (that would rebalance).
 * WorldExploration / enemyAI are left untouched so older open PRs stay
 * merge-clean (#340 picker, #379 walk/summon AP, #417 AI range).
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import { chebyshevOnBoard } from "./targeting.ts";

export function enemyHealExecuteRange(
  spell: Pick<SpellConfig, "range"> | { range?: unknown },
): number {
  return Number(spell.range);
}

export function isEnemyHealExecuteSpell(spell: {
  spellType?: string | null;
}): boolean {
  return (spell.spellType ?? "damage") === "heal";
}

/**
 * WX heal branch requires `spellRange === 0`. Ally-range heals and
 * `healAmount`-only drains never enter it.
 */
export function enemyHealRequiresZeroRange(
  spell: Pick<SpellConfig, "range"> | { range?: unknown },
): boolean {
  return enemyHealExecuteRange(spell) === 0;
}

export function enemyHealInRange(
  caster: { x: number; y: number },
  targetCell: { x: number; y: number },
  spell: Pick<SpellConfig, "range"> | { range?: unknown },
): boolean {
  return chebyshevOnBoard(caster, targetCell) <= enemyHealExecuteRange(spell);
}

/**
 * Same predicate as the WX `else if (inRange && spellType === "heal" &&
 * spellRange === 0)` branch. Decide must use this so a chosen heal
 * actually applies.
 */
export function canExecuteEnemyHealCast(args: {
  spell:
    | Pick<SpellConfig, "range" | "spellType">
    | {
        range?: unknown;
        spellType?: string | null;
      };
  caster: { x: number; y: number };
  targetCell: { x: number; y: number };
}): boolean {
  return (
    isEnemyHealExecuteSpell(args.spell) &&
    enemyHealRequiresZeroRange(args.spell) &&
    enemyHealInRange(args.caster, args.targetCell, args.spell)
  );
}

/** Alias so decide and execute cannot fork. */
export function shouldDecideEnemyHealCast(
  args: Parameters<typeof canExecuteEnemyHealCast>[0],
): boolean {
  return canExecuteEnemyHealCast(args);
}

/**
 * WX writes `hpAfterHeal` onto `enemyId` (the caster). `targetId` is
 * ignored even when decide pointed at a wounded ally.
 */
export function enemyHealRecipientId(
  casterId: string,
  _decidedTargetId?: string | null,
): string {
  return casterId;
}

export function enemyHealHighlightedTileIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
