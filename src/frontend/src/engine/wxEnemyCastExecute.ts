/**
 * WorldExploration enemy damage / standalone-debuff execute vs decide.
 *
 * After dest commit, WX fires (WorldExploration enemy apply block):
 *   1. inRange && (spellType damage|drain) && Number(damage) > 0
 *   2. else if inRange && spellType === "heal" && range === 0
 *      → `enemyHealExecute.ts` (#757), not this module
 *   3. else if inRange && debuffStat && debuffDuration
 *
 * inRange is Chebyshev vs `Number(spell.range)` from the post-move
 * tile. There is no LoS re-check (do not merge with
 * `enemyCastGeometryOk` / player `!!lineOfSight`). Do not add AP
 * (WX does not debit enemy AP here). Do not switch range to
 * `spellRangeBase`.
 *
 * Unique vs #417 `enemyCastExecute` (range wiring into decide) and
 * #757 heal-only execute. WorldExploration / enemyAI / targeting
 * left untouched.
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import { enemyCastRangeOk, enemySpellRange } from "./targeting.ts";

export type WxEnemyCastSpell =
  | Pick<
      SpellConfig,
      "range" | "spellType" | "damage" | "debuffStat" | "debuffDuration"
    >
  | {
      range?: unknown;
      spellType?: string | null;
      damage?: unknown;
      debuffStat?: string | null;
      debuffDuration?: unknown;
    };

export function wxEnemyExecuteRange(spell: WxEnemyCastSpell): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

export function wxEnemyInRange(
  origin: { x: number; y: number },
  targetCell: { x: number; y: number },
  spell: WxEnemyCastSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/**
 * WX `if (inRange && (spellType === "damage" || spellType === "drain")
 * && spellDmg > 0)` — Slow / Weaken (damage 0) never enter this.
 */
export function isWxEnemyDamageExecuteSpell(spell: WxEnemyCastSpell): boolean {
  const spellType = spell.spellType ?? "damage";
  const spellDmg = Number(spell.damage);
  return (spellType === "damage" || spellType === "drain") && spellDmg > 0;
}

/** WX standalone else-if fields (0-damage Slow / Weaken). */
export function isWxEnemyDebuffExecuteSpell(spell: WxEnemyCastSpell): boolean {
  return Boolean(spell.debuffStat) && Boolean(spell.debuffDuration);
}

export function canExecuteWxEnemyDamageCast(args: {
  spell: WxEnemyCastSpell;
  origin: { x: number; y: number };
  targetCell: { x: number; y: number };
}): boolean {
  return (
    isWxEnemyDamageExecuteSpell(args.spell) &&
    wxEnemyInRange(args.origin, args.targetCell, args.spell)
  );
}

export function canExecuteWxEnemyDebuffCast(args: {
  spell: WxEnemyCastSpell;
  origin: { x: number; y: number };
  targetCell: { x: number; y: number };
}): boolean {
  return (
    isWxEnemyDebuffExecuteSpell(args.spell) &&
    wxEnemyInRange(args.origin, args.targetCell, args.spell)
  );
}

/** Alias so decide and the WX damage branch cannot fork. */
export function shouldDecideWxEnemyDamageCast(
  args: Parameters<typeof canExecuteWxEnemyDamageCast>[0],
): boolean {
  return canExecuteWxEnemyDamageCast(args);
}

/** Alias so decide and the WX standalone-debuff branch cannot fork. */
export function shouldDecideWxEnemyDebuffCast(
  args: Parameters<typeof canExecuteWxEnemyDebuffCast>[0],
): boolean {
  return canExecuteWxEnemyDebuffCast(args);
}

/**
 * WX if / else-if order for the branches this module owns. Heal
 * (spellType heal && range 0 && inRange) is #757 — reported as none
 * here so Slow cannot steal a self-heal and Strike cannot steal heal.
 */
export function wxEnemyPrimaryExecuteBranch(args: {
  spell: WxEnemyCastSpell;
  origin: { x: number; y: number };
  targetCell: { x: number; y: number };
}): "damage" | "debuff" | "none" {
  if (canExecuteWxEnemyDamageCast(args)) return "damage";
  const spellType = args.spell.spellType ?? "damage";
  if (
    spellType === "heal" &&
    wxEnemyExecuteRange(args.spell) === 0 &&
    wxEnemyInRange(args.origin, args.targetCell, args.spell)
  ) {
    return "none";
  }
  if (canExecuteWxEnemyDebuffCast(args)) return "debuff";
  return "none";
}

export function wxEnemyHighlightedTileIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
