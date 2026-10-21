/**
 * Boss kit buff decide vs WorldExploration boss apply.
 *
 * `pickBossKitSpell` returns the first off-cooldown kit id. Every
 * `decide*Action` then sends `{ type: "spell", targetX/Y: player }`.
 * The WX boss apply block (WorldExploration boss kit spell branch):
 *   1. damage / drain only when `Number(damage) > 0`
 *   2. heal when `spellType === "heal"`
 *   3. `debuffStat` + `debuffDuration`
 *   4. DoT fields
 *   5. else-if spellType is NOT damage|drain|heal AND no debuff/dot
 *      AND targetType self|ally → "buff" using **debuffStat ?? "atk"**
 *
 * Catalog Iron Skin / Shield / Haste / Enrage are `spellType: "damage"`,
 * `damage: 0`, `buffStat` set. They miss (1) because damage is 0 and
 * miss (5) because spellType is "damage". A decided in-range kit buff
 * therefore ends the boss turn with no advertised RES / DMG / MP buff.
 *
 * This module is that execute gate: 0-damage self/ally `buffStat` kits
 * apply advertised `buffStat` / `buffModifier` / `buffDuration`, with
 * Chebyshev vs `Number(spell.range)` (same as WX enemy `inRange`, no
 * LoS). Do not switch to `spellRangeBase` (would rebalance). Do not
 * steal Strike damage, Slow debuff, Blood Mend heal, or Inferno DoT.
 * WorldExploration / useBossAI / targeting left untouched so older
 * open PRs stay merge-clean.
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import { enemyCastRangeOk } from "./targeting.ts";

export type BossKitCastSpell =
  | Pick<
      SpellConfig,
      | "range"
      | "spellType"
      | "damage"
      | "targetType"
      | "buffStat"
      | "buffModifier"
      | "buffDuration"
      | "debuffStat"
      | "debuffModifier"
      | "debuffDuration"
      | "healAmount"
      | "dotDamage"
      | "dotDamagePerTurn"
    >
  | {
      range?: unknown;
      spellType?: string | null;
      damage?: unknown;
      targetType?: string | null;
      buffStat?: string | null;
      buffModifier?: unknown;
      buffDuration?: unknown;
      debuffStat?: string | null;
      debuffModifier?: unknown;
      debuffDuration?: unknown;
      healAmount?: unknown;
      dotDamage?: unknown;
      dotDamagePerTurn?: unknown;
    };

export type BossKitBuffFields = {
  stat: string;
  modifier: number;
  duration: number;
};

/** Same Chebyshev vs `Number(spell.range)` the WX enemy apply uses. */
export function bossKitInRange(
  origin: { x: number; y: number },
  targetCell: { x: number; y: number },
  spell: BossKitCastSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/**
 * Catalog self/ally kits that advertise a buff and deal no direct damage.
 * `spellType === "damage"` is the live Iron Skin / Shield / Haste / Enrage
 * shape — do not require `spellType === "buff"` (no starter kit uses that).
 */
export function isBossKitBuffExecuteSpell(spell: BossKitCastSpell): boolean {
  if (!spell.buffStat || !spell.buffDuration) return false;
  const targetType = spell.targetType ?? "enemy";
  if (targetType !== "self" && targetType !== "ally") return false;
  if ((spell.spellType ?? "damage") === "heal") return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (spell.debuffStat && spell.debuffDuration) return false;
  // WX applies DoT before the buff else-if; Inferno must stay on that branch.
  if (
    Number(spell.dotDamage ?? 0) > 0 ||
    Number(spell.dotDamagePerTurn ?? 0) > 0
  ) {
    return false;
  }
  return true;
}

/**
 * Advertised buff payload. Must not use the live WX fallback
 * (`debuffStat ?? "atk"`, `debuffModifier ?? 1`, `debuffDuration ?? 3`)
 * — that writes a no-op atk×1 on Iron Skin even if the branch ran.
 */
export function bossKitBuffEffectFields(
  spell: BossKitCastSpell,
): BossKitBuffFields | null {
  if (!isBossKitBuffExecuteSpell(spell) || !spell.buffStat) return null;
  return {
    stat: spell.buffStat,
    modifier: Number(spell.buffModifier ?? 1),
    duration: Math.max(1, Math.floor(Number(spell.buffDuration) || 0)),
  };
}

/** Live WX boss-buff branch fields — kept only to lock the drift. */
export function bossKitBuffLegacyDebuffFallback(
  spell: BossKitCastSpell,
): BossKitBuffFields {
  return {
    stat: spell.debuffStat ?? "atk",
    modifier: Number(spell.debuffModifier ?? 1),
    duration: Math.max(1, Math.floor(Number(spell.debuffDuration ?? 3) || 3)),
  };
}

export function canExecuteBossKitBuffCast(args: {
  spell: BossKitCastSpell;
  origin: { x: number; y: number };
  targetCell: { x: number; y: number };
}): boolean {
  return (
    isBossKitBuffExecuteSpell(args.spell) &&
    bossKitInRange(args.origin, args.targetCell, args.spell)
  );
}

/** Alias so decide and the WX boss-buff branch cannot fork. */
export function shouldDecideBossKitBuffCast(
  args: Parameters<typeof canExecuteBossKitBuffCast>[0],
): boolean {
  return canExecuteBossKitBuffCast(args);
}

export function bossKitHighlightedBuffIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
