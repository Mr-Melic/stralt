/**
 * WorldExploration enemy heal advertised CHC vs the heal-then-stop apply arm.
 *
 * `decideHealer` / queen+king `buildEnemyKit` pick Blood Mend
 * (`starter-heal`) or Rallying Cry (`spell-rallying-cry`) when
 * `spellType === "heal"` or `healAmount > 0`. Catalog rows are
 * `healAmount` 12 / 20, `buffStat: "chc"`, `buffModifier: 0.15`,
 * `buffDuration: 2`, `range: 0`, `targetType: "self"`.
 *
 * After dest commit, WX fires (WorldExploration enemy apply block):
 *   1. inRange && (spellType damage|drain) && Number(damage) > 0
 *      → `wxEnemyCastExecute.ts` (#762), not this module
 *   2. else if inRange && spellType === "heal" && Number(range) === 0
 *      → `hpAfterHeal` on `enemyId` (the caster). No `buffStat`.
 *      Range-0 plus inRange is `#757` (`enemyHealExecute.ts`).
 *   3. else if inRange && debuffStat && debuffDuration
 *
 * There is no fourth buff arm. A decided in-range Blood Mend / Rallying
 * Cry therefore spends the kit slot, restores HP, and never writes CHC.
 * `getStatModifier` only reads type-"buff" rows with `stat === "chc"`, so
 * a follow-up enemy/player crit chance stays at 1.0. Boss-kit WX apply
 * has the same heal-then-skip (#857). Summon applyCast returns after
 * healAmount (#862). Player `resolvePlayerCast` skips the same CHC after
 * self-heal (#692).
 *
 * Intended previous: a decided legal range-0 heal on the caster tile meant
 * HP **and** the advertised +15% CHC / 2, the same payload the catalog
 * still advertises. Do not remap a distant ally / player dest onto the
 * caster — live WX `inRange` uses `targetCell` (wounded ally or the
 * player) vs `Number(range)`, so a range-0 heal aimed off the caster
 * cannot execute (#757). Do not add AP (WX does not debit enemy AP here).
 * Do not switch to `spellRangeBase` (would rebalance). Do not steal
 * Strike damage, Slow debuff, Iron Skin buff (#843 / #865), Inferno DoT
 * (#856 / #799), Drain, Frost Bolt / Nova, or boss-kit heal+buff (#857).
 * Do not require `spell.name`.
 *
 * This module is that execute gate. `shouldDecideWxEnemyHealBuffCast`
 * === `canExecuteWxEnemyHealBuffCast` (Chebyshev vs `Number(spell.range)`
 * on the **decided target cell**, no LoS — healer skips LoS on purpose).
 * Unique vs #692 / #757 / #857 / #862. WorldExploration / enemyAI /
 * summonExecutor / targeting / spellEngine / statusEffects left
 * untouched so older open PRs stay merge-clean. Restack the WX heal
 * arm onto `executeWxEnemyHealBuffCast` after those PRs land.
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import {
  type CasterPosition,
  enemyCastRangeOk,
  enemySpellRange,
} from "./targeting.ts";

export type WxEnemyHealBuffSpell =
  | Pick<
      SpellConfig,
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
      | "effectType"
      | "isSummon"
      | "isSwap"
      | "isMark"
      | "isMirror"
      | "isBarrier"
    >
  | {
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
      effectType?: string | null;
      isSummon?: boolean | null;
      isSwap?: boolean | null;
      isMark?: boolean | null;
      isMirror?: boolean | null;
      isBarrier?: boolean | null;
    };

export type WxEnemyHealBuffTile = CasterPosition;

export type WxEnemyHealBuffFields = {
  stat: string;
  modifier: number;
  duration: number;
};

export type WxEnemyHealBuffExecute = {
  tile: WxEnemyHealBuffTile;
  heal: number;
  buff: WxEnemyHealBuffFields;
};

export type WxEnemyHealBuffLiveKind = "damage" | "heal" | "debuff" | "buff";

/**
 * Catalog heal that also advertises a buff. Do not require
 * `effectType === "heal"` (name/category heuristic). Iron Skin / Enrage
 * stay on the buff-only path (`spellType: "damage"`). Heal-only kits
 * without `buffStat` are not this gate (#757). Drain kits keep the
 * damage arm (#762 / #921 / #922).
 */
export function isWxEnemyHealBuffExecuteSpell(
  spell: WxEnemyHealBuffSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "heal") return false;
  if (!spell.healAmount || Number(spell.healAmount) <= 0) return false;
  if (!spell.buffStat || !spell.buffDuration) return false;
  const targetType = spell.targetType ?? "enemy";
  if (targetType !== "self" && targetType !== "ally") return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (spell.debuffStat && spell.debuffDuration) return false;
  if (
    Number(spell.dotDamage ?? 0) > 0 ||
    Number(spell.dotDamagePerTurn ?? 0) > 0
  ) {
    return false;
  }
  if (spell.isSummon || spell.isSwap || spell.isMark || spell.isMirror) {
    return false;
  }
  if (spell.isBarrier) return false;
  return true;
}

/** Same `Number(spell.range)` the WX `spellRange === 0` gate uses. */
export function wxEnemyHealBuffExecuteRange(
  spell: WxEnemyHealBuffSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

/**
 * WX heal branch requires `spellRange === 0`. Ally-range heals never
 * enter it (#757). Catalog Blood Mend / Rallying Cry are range 0.
 */
export function wxEnemyHealBuffRequiresZeroRange(
  spell: WxEnemyHealBuffSpell,
): boolean {
  return wxEnemyHealBuffExecuteRange(spell) === 0;
}

/**
 * Live WX `inRange` is Chebyshev vs `Number(spell.range)` from the
 * post-move tile to `targetCell` (wounded ally or the player). Range 0
 * therefore means the decided dest **is** the caster tile. Do not
 * remap onto origin — that would make every distant Rallying Cry
 * execute and rebalance vs #757.
 */
export function wxEnemyHealBuffInRange(
  origin: WxEnemyHealBuffTile,
  targetCell: WxEnemyHealBuffTile,
  spell: WxEnemyHealBuffSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/**
 * Live WX enemy apply if / else-if order for the branches this module
 * observes. Damage / standalone-debuff stay #762. Range-0 heal HP stays
 * #757 — Rallying Cry still yields `["heal"]` here because there is no
 * nested `buffStat` after `hpAfterHeal`.
 */
export function wxEnemyHealBuffLiveKinds(
  spell: WxEnemyHealBuffSpell,
): WxEnemyHealBuffLiveKind[] {
  const spellType = spell.spellType ?? "damage";
  if (
    (spellType === "damage" || spellType === "drain") &&
    Number(spell.damage ?? 0) > 0
  ) {
    return ["damage"];
  }
  if (spellType === "heal" && wxEnemyHealBuffRequiresZeroRange(spell)) {
    return ["heal"];
  }
  if (spell.debuffStat && spell.debuffDuration) {
    return ["debuff"];
  }
  return [];
}

export function wxEnemyHealBuffAdvertisedKinds(
  spell: WxEnemyHealBuffSpell,
): WxEnemyHealBuffLiveKind[] {
  if (!isWxEnemyHealBuffExecuteSpell(spell)) {
    return wxEnemyHealBuffLiveKinds(spell);
  }
  return ["heal", "buff"];
}

/** Advertised heal+buff payload. Heal-only or buff-only returns null. */
export function wxEnemyHealBuffEffectFields(
  spell: WxEnemyHealBuffSpell,
): Omit<WxEnemyHealBuffExecute, "tile"> | null {
  if (!isWxEnemyHealBuffExecuteSpell(spell) || !spell.buffStat) return null;
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
 * Live WX heal payload — kept only to lock the drift. HP is copied;
 * advertised CHC is not.
 */
export function wxEnemyHealBuffLegacyHealFields(
  spell: WxEnemyHealBuffSpell,
): { heal: number } | null {
  const heal = Math.max(0, Math.floor(Number(spell.healAmount) || 0));
  if (heal <= 0) return null;
  return { heal };
}

export function canExecuteWxEnemyHealBuffCast(args: {
  spell: WxEnemyHealBuffSpell;
  origin: WxEnemyHealBuffTile;
  targetCell: WxEnemyHealBuffTile;
}): boolean {
  return (
    isWxEnemyHealBuffExecuteSpell(args.spell) &&
    wxEnemyHealBuffRequiresZeroRange(args.spell) &&
    wxEnemyHealBuffInRange(args.origin, args.targetCell, args.spell)
  );
}

/** Alias so decide and the WX heal+buff branch cannot fork. */
export function shouldDecideWxEnemyHealBuffCast(
  args: Parameters<typeof canExecuteWxEnemyHealBuffCast>[0],
): boolean {
  return canExecuteWxEnemyHealBuffCast(args);
}

export function wxEnemyHealBuffHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Execute a decided range-0 heal+buff. Non-heal-buff returns null so
 * restack cannot treat Strike / Iron Skin / Drain as a CHC write. The
 * shield tile is the decided dest, which live WX already requires to be
 * the caster for range 0.
 */
export function executeWxEnemyHealBuffCast(args: {
  spell: WxEnemyHealBuffSpell;
  origin: WxEnemyHealBuffTile;
  targetCell: WxEnemyHealBuffTile;
}): WxEnemyHealBuffExecute | null {
  if (!canExecuteWxEnemyHealBuffCast(args)) return null;
  const fields = wxEnemyHealBuffEffectFields(args.spell);
  if (!fields) return null;
  return {
    tile: { x: args.targetCell.x, y: args.targetCell.y },
    heal: fields.heal,
    buff: fields.buff,
  };
}
