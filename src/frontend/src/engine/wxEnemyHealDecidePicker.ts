/**
 * Pack-enemy `decideHealer` vs advertised range-0 self-heal kits.
 *
 * Queen `buildEnemyKit` z≥1 carries Blood Mend (`starter-heal`) as
 * `spellType: "heal"`, `healAmount: 12`, `range: 0`, `targetType:
 * "self"` (and advertised CHC — execute of that buff is #924). King
 * kits assign Rallying Cry, but `usableByEnemy: false` drops it from
 * WX `availableSpells`, so this leftover is the queen Blood Mend path.
 *
 * Live `decideEnemyAction` builds `allies` as `side === "enemy" && id
 * !== enemy.id`. WX `ctx.combatants` also skips the acting enemy.
 * `decideHealer` then heals the most-wounded *ally* below
 * `ENEMY_HEAL_ALLY_THRESHOLD_PCT` when Chebyshev ≤ `Number(range)`.
 * Range 0 never reaches a distinct ally, so a wounded ally yields
 * `kind: "move"` toward them. With no wounded ally the healer falls
 * through to backline / `decideCaster` even when `ctx.enemy` is below
 * the same 50% threshold and Blood Mend is ready.
 *
 * This module is that decide leftover those call sites must restack
 * onto. It does **not** steal:
 *   - an in-range ally heal (ranged catalog heals — live already casts)
 *   - the live move-toward-wounded-ally when range 0 cannot reach
 *   - a healthy caster's Frost / Inferno fallback (#762 / #967)
 *   - drain-as-healSpell (`healAmount > 0` but `spellType !== "heal"`)
 *   - Iron Skin / Shield (#978 / #974), DoT (#967 / #947), Slow (#878)
 *   - HP writes (#757 `enemyHealExecute`) or CHC writes (#924)
 *
 * Only when live falls through AND the first live healSpell is a
 * range-0 self/ally heal AND the caster is wounded and alive does it
 * select that spell on the caster tile. Chebyshev vs
 * `Number(spell.range)` — do not switch to `spellRangeBase`. No LoS
 * (healer skips LoS). No AP (WX does not debit enemy AP). Target id is
 * the caster so WX `targetCell` is the origin (range-0 `inRange`).
 *
 * Unique vs #757 / #762 / #862 / #924 / #967 / #978. WorldExploration /
 * enemyAI / summonExecutor / targeting / spellEngine / statusEffects
 * left untouched so older open PRs stay merge-clean. Restack
 * `decideHealer` onto `pickWxEnemyHealDecideSpell` after those PRs
 * land. Do not expand #924 execute.
 */

import { ENEMY_HEAL_ALLY_THRESHOLD_PCT } from "../data/gameConstants.ts";
import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  enemyCastRangeOk,
  enemySpellRange,
} from "./targeting.ts";

export type WxEnemyHealDecideSpell =
  | Pick<
      SpellConfig,
      | "id"
      | "range"
      | "spellType"
      | "damage"
      | "targetType"
      | "healAmount"
      | "buffStat"
      | "buffDuration"
      | "debuffStat"
      | "debuffDuration"
      | "dotDamage"
      | "dotDamagePerTurn"
      | "dotDuration"
      | "effectType"
      | "isDotSpell"
      | "isSummon"
      | "isSwap"
      | "isMark"
      | "isMirror"
      | "isBarrier"
    >
  | {
      id?: string;
      range?: unknown;
      spellType?: string | null;
      damage?: unknown;
      targetType?: string | null;
      healAmount?: unknown;
      buffStat?: string | null;
      buffDuration?: unknown;
      debuffStat?: string | null;
      debuffDuration?: unknown;
      dotDamage?: unknown;
      dotDamagePerTurn?: unknown;
      dotDuration?: unknown;
      effectType?: string | null;
      isDotSpell?: boolean | null;
      isSummon?: boolean | null;
      isSwap?: boolean | null;
      isMark?: boolean | null;
      isMirror?: boolean | null;
      isBarrier?: boolean | null;
    };

export type WxEnemyHealDecideTile = CasterPosition;

export type WxEnemyHealDecideUnit = WxEnemyHealDecideTile & {
  id: string;
  hp: number;
  maxHp?: number;
  side?: string;
};

/**
 * Catalog range-0 self/ally heals (Blood Mend / Rallying Cry). Do not
 * require `spell.name` or `buffStat` — CHC execute stays on #924;
 * heal-only range-0 still feeds #757 HP. Drain kits keep the damage
 * arm (`spellType !== "heal"`).
 */
export function isWxEnemyHealDecidePickerSpell(
  spell: WxEnemyHealDecideSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "heal") return false;
  if (Number(spell.healAmount ?? 0) <= 0) return false;
  const targetType = spell.targetType ?? "enemy";
  if (targetType !== "self" && targetType !== "ally") return false;
  if (wxEnemyHealDecidePickerRange(spell) !== 0) return false;
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

/** Same `Number(spell.range)` live `decideHealer` compares to Chebyshev. */
export function wxEnemyHealDecidePickerRange(
  spell: WxEnemyHealDecideSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

/** Live healer range half: Chebyshev vs `Number(spell.range)`. No LoS. */
export function wxEnemyHealDecidePickerInRange(
  origin: WxEnemyHealDecideTile,
  targetCell: WxEnemyHealDecideTile,
  spell: WxEnemyHealDecideSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/** Byte-for-byte live `hpFrac`: `hp / max(1, maxHp)` clamped to [0, 1]. */
export function wxEnemyHealLiveHpFrac(unit: {
  hp: number;
  maxHp?: number;
}): number {
  const max = Math.max(1, Number(unit.maxHp));
  const frac = unit.hp / max;
  if (!Number.isFinite(frac)) return 0;
  return Math.max(0, Math.min(1, frac));
}

export function wxEnemyHealCasterIsWounded(caster: {
  hp: number;
  maxHp?: number;
}): boolean {
  return wxEnemyHealLiveHpFrac(caster) < ENEMY_HEAL_ALLY_THRESHOLD_PCT;
}

/**
 * Live `decideHealer` healSpell: first `spellType === "heal"` or
 * `healAmount > 0` in `availableSpells` order. Drain can win this race.
 */
export function wxEnemyHealLiveHealSpell<T extends WxEnemyHealDecideSpell>(
  availableSpells: readonly T[],
): T | undefined {
  return availableSpells.find(
    (s) => s.spellType === "heal" || Number(s.healAmount ?? 0) > 0,
  );
}

/**
 * Most-wounded ally below the live 50% threshold. Acting enemy is not
 * an ally — WX / `decideEnemyAction` already dropped it.
 */
export function wxEnemyHealLiveWoundedAlly<T extends WxEnemyHealDecideUnit>(
  allies: readonly T[],
): T | undefined {
  const wounded = allies
    .filter((a) => wxEnemyHealLiveHpFrac(a) < ENEMY_HEAL_ALLY_THRESHOLD_PCT)
    .sort((a, b) => wxEnemyHealLiveHpFrac(a) - wxEnemyHealLiveHpFrac(b));
  return wounded[0];
}

export function wxEnemyHealLiveDecideHealerSelectsAllyCast(args: {
  availableSpells: readonly WxEnemyHealDecideSpell[];
  origin: WxEnemyHealDecideTile;
  allies: readonly WxEnemyHealDecideUnit[];
}): boolean {
  const healSpell = wxEnemyHealLiveHealSpell(args.availableSpells);
  const wounded = wxEnemyHealLiveWoundedAlly(args.allies);
  if (!healSpell || !wounded) return false;
  return wxEnemyHealDecidePickerInRange(args.origin, wounded, healSpell);
}

/**
 * Live leftover when a wounded ally exists but range cannot reach —
 * Blood Mend range 0 always takes this path. Do not replace it with
 * a self-heal.
 */
export function wxEnemyHealLiveDecideHealerMovesToAlly(args: {
  availableSpells: readonly WxEnemyHealDecideSpell[];
  origin: WxEnemyHealDecideTile;
  allies: readonly WxEnemyHealDecideUnit[];
}): boolean {
  const healSpell = wxEnemyHealLiveHealSpell(args.availableSpells);
  const wounded = wxEnemyHealLiveWoundedAlly(args.allies);
  if (!healSpell || !wounded) return false;
  return !wxEnemyHealDecidePickerInRange(args.origin, wounded, healSpell);
}

/**
 * Unique leftover: live ally cast / move did not fire, the first live
 * healSpell is a range-0 self/ally heal, and the caster is wounded.
 */
export function pickWxEnemyHealDecideSpell<
  T extends WxEnemyHealDecideSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyHealDecideTile;
  allies: readonly WxEnemyHealDecideUnit[];
  caster: WxEnemyHealDecideUnit;
}): T | null {
  if (
    wxEnemyHealLiveDecideHealerSelectsAllyCast({
      availableSpells: args.availableSpells,
      origin: args.origin,
      allies: args.allies,
    })
  ) {
    return null;
  }
  if (
    wxEnemyHealLiveDecideHealerMovesToAlly({
      availableSpells: args.availableSpells,
      origin: args.origin,
      allies: args.allies,
    })
  ) {
    return null;
  }
  const healSpell = wxEnemyHealLiveHealSpell(args.availableSpells);
  if (!healSpell) return null;
  if (!isWxEnemyHealDecidePickerSpell(healSpell)) return null;
  if (!isAliveCombatant({ hp: args.caster.hp })) return null;
  if (!wxEnemyHealCasterIsWounded(args.caster)) return null;
  return healSpell;
}

/** WX `hpAfterHeal` writes `enemyId` (the caster). Do not remap to an ally. */
export function wxEnemyHealDecideTargetId(casterId: string): string {
  return casterId;
}

export function canExecuteWxEnemyHealDecidePickerCast(args: {
  spell: WxEnemyHealDecideSpell;
  origin: WxEnemyHealDecideTile;
  targetCell: WxEnemyHealDecideTile;
  caster: WxEnemyHealDecideUnit;
}): boolean {
  if (!isWxEnemyHealDecidePickerSpell(args.spell)) return false;
  if (!isAliveCombatant({ hp: args.caster.hp })) return false;
  if (
    args.targetCell.x !== args.origin.x ||
    args.targetCell.y !== args.origin.y
  ) {
    return false;
  }
  return wxEnemyHealDecidePickerInRange(
    args.origin,
    args.targetCell,
    args.spell,
  );
}

/** Alias so decide and the WX range-0 heal branch cannot fork. */
export function shouldDecideWxEnemyHealPickerCast(
  args: Parameters<typeof canExecuteWxEnemyHealDecidePickerCast>[0],
): boolean {
  return canExecuteWxEnemyHealDecidePickerCast(args);
}

export function wxEnemyHealPickerHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
