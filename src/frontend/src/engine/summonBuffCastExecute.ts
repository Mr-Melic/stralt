/**
 * Summon kit buff-only decide vs `executeSummonAction` applyCast.
 *
 * `decideSummonGuardian` prefers Shield (`starter-shield`) on the scored
 * ward, else Iron Skin (`spell-iron-skin`) on self. applyCast then:
 *   1. rejects when `currentAp < Number(apCost)`
 *   2. deals damage only when `Number(damage) > 0` and
 *      `getEnemyById(targetId)` resolves
 *   3. heals `targetId` when `healAmount > 0` and **returns** (#862)
 *   4. else `applyEffect` with type from `effectType`, duration from
 *      `buffDuration ?? debuffDuration ?? dotDuration ?? 1`, and **no
 *      `buffStat` / `buffModifier`**
 *
 * Catalog Shield / Iron Skin are `spellType: "damage"`, `damage: 0`,
 * `healAmount` unset, `buffStat: "res"`, `buffModifier: 1.3`,
 * `buffDuration: 3`, `targetType: "ally"`. They miss (2) and (3) and
 * land on (4). `getStatModifier` only reads type-"buff" rows with a
 * matching `stat`, so a decided in-range Shield spends 2 AP and writes
 * a no-op RES×1 instead of the advertised +30%. Golem `maxAp` 2 also
 * cannot afford Iron Skin 3.
 *
 * Intended previous: deciding Shield meant the ward's RES rose the same
 * way player-controlled `resolveSpellCast` still copies `buffStat`
 * (`spellEngine.ts` buff arm). Callers: `decideSummonGuardian` →
 * `executeSummonAction` applyCast (auto-summon WX ~15200 and hostile
 * `#842` kits). Downstream: `getStatModifier(wardId, "res")` on player
 * and enemy damage. Alternative path: SummonControlPanel clicks resolve
 * the catalog kit through `resolveSpellCast` and **do** write RES.
 *
 * Fix A (`executeSummonAction` extract) caused bug B: the simplified
 * applyEffect arm dropped `stat` / `modifier` that the player path
 * still copies. Do not undo that extract. #862 reserved this sidecar
 * (`summonBuffCastExecute`) and must keep the heal+buff early-return
 * exclusive. #843 owns boss-kit WX `buffStat`, not this executor.
 *
 * This module is that execute gate. `shouldDecideSummonBuffCast` ===
 * `canExecuteSummonBuffCast` (AP + Chebyshev vs `Number(spell.range)`
 * on the **ward / self tile**, no LoS — guardian skips LoS on purpose).
 * Advertised `buffStat` / `buffModifier` / `buffDuration`. Do not
 * switch to `spellRangeBase` (would rebalance). Do not steal Strike
 * damage, Slow debuff, Blood Mend / Rallying Cry heal+buff (#862),
 * Poison / Venom (#856), or Inferno (#799). Do not require
 * `spell.name` or `spellType === "buff"` (catalog uses `"damage"`).
 *
 * Unique vs #762 kit AP+range (no effect payload), #843 boss WX buff,
 * #857 boss heal+buff, #862 summon heal+buff. WorldExploration /
 * enemyAI / summonExecutor / targeting / spellEngine left untouched
 * so older open PRs stay merge-clean. Restack applyCast onto
 * `executeSummonBuffCast` after those PRs land.
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import {
  type CasterPosition,
  canAffordCastAp,
  enemyCastRangeOk,
  resolveCastApCost,
} from "./targeting.ts";

export type SummonBuffCastSpell =
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
      | "effectType"
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
      effectType?: string | null;
      isSummon?: boolean | null;
      isSwap?: boolean | null;
      isMark?: boolean | null;
      isMirror?: boolean | null;
      isBarrier?: boolean | null;
    };

export type SummonBuffCastTile = CasterPosition;

export type SummonBuffFields = {
  stat: string;
  modifier: number;
  duration: number;
};

export type SummonBuffExecute = {
  tile: SummonBuffCastTile;
  buff: SummonBuffFields;
};

export type SummonBuffApplyCastKind = "damage" | "heal" | "effect";

/**
 * Catalog 0-damage self/ally kits that advertise a buff and do not
 * heal. `spellType === "damage"` is the live Shield / Iron Skin shape —
 * do not require `spellType === "buff"`. Heal+buff kits stay on #862.
 */
export function isSummonBuffExecuteSpell(spell: SummonBuffCastSpell): boolean {
  if (!spell.buffStat || !spell.buffDuration) return false;
  const targetType = spell.targetType ?? "enemy";
  if (targetType !== "self" && targetType !== "ally") return false;
  if ((spell.spellType ?? "damage") === "heal") return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
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

export function summonBuffCastApCost(spell: SummonBuffCastSpell): number {
  return resolveCastApCost(Number(spell.apCost ?? 0));
}

export function canAffordSummonBuffCast(
  currentAp: number,
  spell: SummonBuffCastSpell,
): boolean {
  return canAffordCastAp(currentAp, Number(spell.apCost ?? 0));
}

/**
 * Ally buffs land on the decide `targetId` cell (ward). Self range 0
 * uses the caster tile. Do not force the caster tile for `ally` —
 * that would Shield the golem instead of the scored ward.
 */
export function summonBuffApplyCell(
  spell: SummonBuffCastSpell,
  origin: SummonBuffCastTile,
  targetCell: SummonBuffCastTile,
): SummonBuffCastTile {
  if (spell.targetType === "self") {
    return { x: origin.x, y: origin.y };
  }
  return { x: targetCell.x, y: targetCell.y };
}

/** Same Chebyshev vs `Number(spell.range)` applyCast does not re-check. */
export function summonBuffInRange(
  origin: SummonBuffCastTile,
  targetCell: SummonBuffCastTile,
  spell: SummonBuffCastSpell,
): boolean {
  const applyCell = summonBuffApplyCell(spell, origin, targetCell);
  return enemyCastRangeOk(
    origin,
    applyCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/**
 * Live applyCast branch order. Shield / Iron Skin yield `["effect"]`
 * — there is no buffStat arm after the generic applyEffect.
 */
export function summonBuffApplyCastKinds(
  spell: SummonBuffCastSpell,
  hasResolvedTarget: boolean,
): SummonBuffApplyCastKind[] {
  if (Number(spell.damage ?? 0) > 0 && hasResolvedTarget) {
    return ["damage"];
  }
  if (Number(spell.healAmount ?? 0) > 0) {
    return ["heal"];
  }
  return ["effect"];
}

/** Advertised buff payload. Heal+buff / damage / Slow return null. */
export function summonBuffEffectFields(
  spell: SummonBuffCastSpell,
): SummonBuffFields | null {
  if (!isSummonBuffExecuteSpell(spell) || !spell.buffStat) return null;
  return {
    stat: spell.buffStat,
    modifier: Number(spell.buffModifier ?? 1),
    duration: Math.max(1, Math.floor(Number(spell.buffDuration) || 0)),
  };
}

function liveApplyCastEffectType(
  spell: SummonBuffCastSpell,
): "buff" | "debuff" | "dot" {
  if (spell.effectType === "buff") return "buff";
  if (spell.effectType === "debuff") return "debuff";
  return "dot";
}

/**
 * Live applyCast effect payload — kept only to lock the drift.
 * Type and duration are copied; advertised RES is not.
 */
export function summonBuffLegacyApplyCastFields(spell: SummonBuffCastSpell): {
  type: "buff" | "debuff" | "dot";
  duration: number;
} {
  return {
    type: liveApplyCastEffectType(spell),
    duration: Math.max(
      1,
      Math.floor(
        Number(
          spell.buffDuration ?? spell.debuffDuration ?? spell.dotDuration ?? 1,
        ) || 1,
      ),
    ),
  };
}

export function canExecuteSummonBuffCast(args: {
  currentAp: number;
  spell: SummonBuffCastSpell;
  origin: SummonBuffCastTile;
  targetCell: SummonBuffCastTile;
}): boolean {
  return (
    isSummonBuffExecuteSpell(args.spell) &&
    canAffordSummonBuffCast(args.currentAp, args.spell) &&
    summonBuffInRange(args.origin, args.targetCell, args.spell)
  );
}

/** Alias so decide and applyCast cannot fork. */
export function shouldDecideSummonBuffCast(
  args: Parameters<typeof canExecuteSummonBuffCast>[0],
): boolean {
  return canExecuteSummonBuffCast(args);
}

export function summonBuffHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Execute a decided kit buff. Non-buff returns null so restack cannot
 * treat Strike / Slow / Rallying Cry as a RES write. The shield tile is
 * the ward cell, not the golem, unless `targetType` is self.
 */
export function executeSummonBuffCast(args: {
  currentAp: number;
  spell: SummonBuffCastSpell;
  origin: SummonBuffCastTile;
  targetCell: SummonBuffCastTile;
}): SummonBuffExecute | null {
  if (!canExecuteSummonBuffCast(args)) return null;
  const buff = summonBuffEffectFields(args.spell);
  if (!buff) return null;
  const tile = summonBuffApplyCell(args.spell, args.origin, args.targetCell);
  return { tile, buff };
}
