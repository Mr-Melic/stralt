/**
 * Summon kit heal+buff decide vs `executeSummonAction` applyCast.
 *
 * `decideSummonHealer` prefers Blood Mend (`starter-heal`) on a wounded
 * ally, else Rallying Cry (`spell-rallying-cry`) on the rally ward.
 * Allies exclude the caster, and both catalog rows are `range: 0` /
 * `targetType: "self"`, so decide still aims `targetId` at that ally.
 * applyCast then:
 *   1. rejects when `currentAp < Number(apCost)`
 *   2. deals damage only when `Number(damage) > 0`
 *   3. heals `targetId` when `healAmount > 0` and **returns**
 *   4. else `applyEffect` with type from `effectType` and **no
 *      `buffStat` / `buffModifier`**
 *
 * Catalog Blood Mend / Rallying Cry are `spellType: "heal"`,
 * `healAmount` 12 / 20, `buffStat: "chc"`, `buffModifier: 0.15`,
 * `buffDuration: 2`. They miss (2) and land on (3). `getStatModifier`
 * only reads type-"buff" rows with a matching `stat`, so a decided
 * heal spends AP and restores HP with no advertised CHC +15%. Wisp
 * `maxAp` 2 also cannot afford Blood Mend 3 / Rallying Cry 4.
 *
 * This module is that execute gate. `shouldDecideSummonHealBuffCast`
 * === `canExecuteSummonHealBuffCast` (AP + Chebyshev vs
 * `Number(spell.range)` on the **caster tile**, no LoS). Self range 0
 * cannot use the decide action's ally cell as the dest (that would
 * skip every legal Rallying Cry). Advertised `healAmount` + `buffStat`
 * / `buffModifier` / `buffDuration`. Do not switch to `spellRangeBase`
 * (would rebalance). Do not steal Strike damage, Slow debuff, Shield /
 * Iron Skin buff-only (#843 / next-cron summonBuffCastExecute),
 * Poison / Venom (#856), or Inferno (#799). Do not require
 * `spell.name` (metadata only).
 *
 * Unique vs #692 player self-heal CHC, #757 WX enemy heal
 * range/recipient, #857 boss-kit heal+buff, #762 kit AP+range (no
 * effect payload). WorldExploration / enemyAI / summonExecutor /
 * targeting / spellEngine left untouched so older open PRs stay
 * merge-clean. Restack applyCast onto `executeSummonHealBuffCast`
 * after those PRs land.
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import {
  type CasterPosition,
  canAffordCastAp,
  enemyCastRangeOk,
  resolveCastApCost,
} from "./targeting.ts";

export type SummonHealBuffSpell =
  | Pick<
      SpellConfig,
      | "apCost"
      | "range"
      | "spellType"
      | "damage"
      | "targetType"
      | "healAmount"
      | "buffStat"
      | "buffModifier"
      | "buffDuration"
      | "debuffStat"
      | "debuffDuration"
      | "dotDamage"
      | "dotDamagePerTurn"
      | "dotDuration"
      | "isSummon"
      | "isSwap"
      | "isMark"
      | "isMirror"
      | "isBarrier"
    >
  | {
      apCost?: unknown;
      range?: unknown;
      spellType?: string | null;
      damage?: unknown;
      targetType?: string | null;
      healAmount?: unknown;
      buffStat?: string | null;
      buffModifier?: unknown;
      buffDuration?: unknown;
      debuffStat?: string | null;
      debuffDuration?: unknown;
      dotDamage?: unknown;
      dotDamagePerTurn?: unknown;
      dotDuration?: unknown;
      isSummon?: boolean | null;
      isSwap?: boolean | null;
      isMark?: boolean | null;
      isMirror?: boolean | null;
      isBarrier?: boolean | null;
    };

export type SummonHealBuffTile = CasterPosition;

export type SummonHealBuffFields = {
  stat: string;
  modifier: number;
  duration: number;
};

export type SummonHealBuffExecute = {
  tile: SummonHealBuffTile;
  heal: number;
  buff: SummonHealBuffFields;
};

export type SummonApplyCastKind = "damage" | "heal" | "effect";

/**
 * Catalog heal that also advertises a buff. Do not require
 * `effectType === "heal"` (name/category heuristic). Iron Skin / Shield
 * stay on the buff-only path (`spellType: "damage"`). Heal-only kits
 * without `buffStat` are not this gate (#757).
 */
export function isSummonHealBuffExecuteSpell(
  spell: SummonHealBuffSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "heal") return false;
  if (!spell.healAmount || Number(spell.healAmount) <= 0) return false;
  if (!spell.buffStat || !spell.buffDuration) return false;
  const targetType = spell.targetType ?? "enemy";
  if (targetType !== "self" && targetType !== "ally") return false;
  if (spell.isSummon || spell.isSwap || spell.isMark || spell.isMirror) {
    return false;
  }
  if (spell.isBarrier) return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (spell.debuffStat && spell.debuffDuration) return false;
  if (
    Number(spell.dotDamage ?? 0) > 0 ||
    Number(spell.dotDamagePerTurn ?? 0) > 0
  ) {
    return false;
  }
  return true;
}

export function summonHealBuffCastApCost(spell: SummonHealBuffSpell): number {
  return resolveCastApCost(Number(spell.apCost ?? 0));
}

export function canAffordSummonHealBuffCast(
  currentAp: number,
  spell: SummonHealBuffSpell,
): boolean {
  return canAffordCastAp(currentAp, Number(spell.apCost ?? 0));
}

/**
 * Self heal+buff shields the caster tile. Decide still aims `targetId`
 * at a wounded ally / rally ward; using that cell vs range 0 would skip
 * every legal cast.
 */
export function summonHealBuffApplyCell(
  spell: SummonHealBuffSpell,
  origin: SummonHealBuffTile,
  targetCell: SummonHealBuffTile,
): SummonHealBuffTile {
  if (isSummonHealBuffExecuteSpell(spell) || spell.targetType === "self") {
    return { x: origin.x, y: origin.y };
  }
  return { x: targetCell.x, y: targetCell.y };
}

/** Same Chebyshev vs `Number(spell.range)` applyCast does not re-check. */
export function summonHealBuffInRange(
  origin: SummonHealBuffTile,
  targetCell: SummonHealBuffTile,
  spell: SummonHealBuffSpell,
): boolean {
  const applyCell = summonHealBuffApplyCell(spell, origin, targetCell);
  return enemyCastRangeOk(
    origin,
    applyCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/**
 * Live applyCast branch order. Rallying Cry / Blood Mend yield
 * `["heal"]` — there is no second buff arm after a heal.
 */
export function summonApplyCastKinds(
  spell: SummonHealBuffSpell,
  hasResolvedTarget: boolean,
): SummonApplyCastKind[] {
  if (Number(spell.damage ?? 0) > 0 && hasResolvedTarget) {
    return ["damage"];
  }
  if (Number(spell.healAmount ?? 0) > 0) {
    return ["heal"];
  }
  return ["effect"];
}

/** Advertised heal+buff payload. Heal-only or buff-only returns null. */
export function summonHealBuffEffectFields(
  spell: SummonHealBuffSpell,
): Omit<SummonHealBuffExecute, "tile"> | null {
  if (!isSummonHealBuffExecuteSpell(spell) || !spell.buffStat) return null;
  return {
    heal: Math.max(0, Math.floor(Number(spell.healAmount) || 0)),
    buff: {
      stat: spell.buffStat,
      modifier: Number(spell.buffModifier ?? 1),
      duration: Math.max(1, Math.floor(Number(spell.buffDuration) || 0)),
    },
  };
}

/**
 * Live applyCast heal payload — kept only to lock the drift.
 * HP is copied; advertised CHC is not.
 */
export function summonHealBuffLegacyApplyCastFields(
  spell: SummonHealBuffSpell,
): { heal: number } | null {
  const heal = Math.max(0, Math.floor(Number(spell.healAmount) || 0));
  if (heal <= 0) return null;
  return { heal };
}

export function canExecuteSummonHealBuffCast(args: {
  currentAp: number;
  spell: SummonHealBuffSpell;
  origin: SummonHealBuffTile;
  targetCell: SummonHealBuffTile;
}): boolean {
  return (
    isSummonHealBuffExecuteSpell(args.spell) &&
    canAffordSummonHealBuffCast(args.currentAp, args.spell) &&
    summonHealBuffInRange(args.origin, args.targetCell, args.spell)
  );
}

/** Alias so decide and applyCast cannot fork. */
export function shouldDecideSummonHealBuffCast(
  args: Parameters<typeof canExecuteSummonHealBuffCast>[0],
): boolean {
  return canExecuteSummonHealBuffCast(args);
}

export function summonHealBuffHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Execute a decided kit heal+buff. Non-heal-buff returns null so restack
 * cannot treat a distant ally dest as a walk tile. The shield tile is
 * the caster cell, not the decide action's ward cell.
 */
export function executeSummonHealBuffCast(args: {
  currentAp: number;
  spell: SummonHealBuffSpell;
  origin: SummonHealBuffTile;
  targetCell: SummonHealBuffTile;
}): SummonHealBuffExecute | null {
  if (!canExecuteSummonHealBuffCast(args)) return null;
  const fields = summonHealBuffEffectFields(args.spell);
  if (!fields) return null;
  const tile = summonHealBuffApplyCell(
    args.spell,
    args.origin,
    args.targetCell,
  );
  return { tile, heal: fields.heal, buff: fields.buff };
}
