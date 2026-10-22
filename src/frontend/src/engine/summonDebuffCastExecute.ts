/**
 * Summon kit Slow decide vs `executeSummonAction` applyCast.
 *
 * `decideSummonArcher` prefers Poison Arrow, then Slow-on-approaching
 * (`spell-slow`) when poison is out of range / LoS-blocked. applyCast then:
 *   1. rejects when `currentAp < Number(apCost)`
 *   2. deals damage only when `Number(damage) > 0` and
 *      `getEnemyById(targetId)` resolves
 *   3. heals `targetId` when `healAmount > 0` and **returns** (#862)
 *   4. else `applyEffect` with type from `effectType`, duration from
 *      `buffDuration ?? debuffDuration ?? dotDuration ?? 1`, and **no
 *      `debuffStat` / `debuffModifier`**
 *
 * Catalog Slow is `spellType: "damage"`, `damage: 0`, `healAmount` unset,
 * `debuffStat: "mp"`, `debuffModifier: -2`, `debuffDuration: 2`,
 * `targetType: "enemy"`, range 3, AP 2. It misses (2) and (3) and lands
 * on (4). Hostile-summon Slow at the player also misses (2) because
 * `getEnemyById` only reads `enemiesRef` (id `"player"` is absent) —
 * the effect still writes, just without `stat`. `getStatModifier` only
 * sums type-"debuff" rows with `stat === "mp"`, so a decided in-range
 * Slow spends 2 AP and leaves restore at PLAYER_BASE_MP (4) instead of
 * the advertised −2 (restore 2). Archer `maxAp` 2 can afford Slow 2.
 *
 * Intended previous: deciding Slow meant the target's MP fell the same
 * way player-controlled `resolveSpellCast` still copies `debuffStat`
 * (`spellEngine.ts` debuff arm) and WX enemy Slow still copies it
 * (~16671). Callers: `decideSummonArcher` → `executeSummonAction`
 * applyCast (auto-summon WX ~15200 and hostile `#842` kits). Downstream:
 * player turn restore `getStatModifier("player", "mp")` (~14359) and
 * `#598` summon walk budget. Alternative path: SummonControlPanel clicks
 * resolve the catalog kit through `resolveSpellCast` and **do** write MP.
 *
 * Fix A (`executeSummonAction` extract) caused bug B: the simplified
 * applyEffect arm dropped `stat` / `modifier` that the player path still
 * copies. Do not undo that extract. #700 restacks the executor with a
 * combined Shield/Slow/Poison helper — do not steal that restack.
 * #865 owns buff-only RES. #856 owns Poison ticks. #862 owns heal+buff
 * CHC. #528 owns player-bar Weaken/Slow. #762 owns kit AP+range (no
 * effect payload) and WX enemy Slow execute.
 *
 * This module is that execute gate. `shouldDecideSummonDebuffCast` ===
 * `canExecuteSummonDebuffCast` (AP + Chebyshev vs `Number(spell.range)`
 * + living opposite-side occupant). No LoS — applyCast skips it;
 * archer LoS lives only in decide. Advertised `debuffStat` /
 * `debuffModifier` / `debuffDuration`. Do not switch to `spellRangeBase`
 * (would rebalance). Do not steal Strike damage, Shield / Iron Skin
 * (#865), Blood Mend / Rallying Cry (#862), Poison / Venom (#856), or
 * Inferno (#799). Do not require `spell.name` or `spellType === "debuff"`
 * (catalog uses `"damage"`).
 *
 * Unique vs #528 player Slow, #598 control-mode budget, #700 executor
 * restack, #762 AP+range, #856 DoT, #862 heal+buff, #865 buff-only.
 * WorldExploration / enemyAI / summonExecutor / targeting / spellEngine
 * left untouched so older open PRs stay merge-clean. Restack applyCast
 * onto `executeSummonDebuffCast` after those PRs land.
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  canAffordCastAp,
  enemyCastRangeOk,
  resolveCastApCost,
} from "./targeting.ts";

export type SummonDebuffCastSpell =
  | Pick<
      SpellConfig,
      | "apCost"
      | "range"
      | "spellType"
      | "damage"
      | "targetType"
      | "healAmount"
      | "buffStat"
      | "buffDuration"
      | "debuffStat"
      | "debuffModifier"
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
      apCost?: unknown;
      range?: unknown;
      spellType?: string | null;
      damage?: unknown;
      targetType?: string | null;
      healAmount?: unknown;
      buffStat?: string | null;
      buffDuration?: unknown;
      debuffStat?: string | null;
      debuffModifier?: unknown;
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

export type SummonDebuffCastTile = CasterPosition;

export type SummonDebuffOccupant = CasterPosition & {
  id: string;
  hp?: number;
  side?: string;
};

export type SummonDebuffFields = {
  stat: string;
  modifier: number;
  duration: number;
};

export type SummonDebuffExecute = {
  targetId: string;
  tile: SummonDebuffCastTile;
  debuff: SummonDebuffFields;
};

export type SummonDebuffApplyCastKind = "damage" | "heal" | "effect";

/**
 * Catalog 0-damage enemy kits that advertise a debuff and do not heal
 * or buff. `spellType === "damage"` is the live Slow shape — do not
 * require `spellType === "debuff"`. Damage+debuff (Frost Bolt / Expose)
 * stays on the damage branch. Heal+buff stays on #862.
 */
export function isSummonDebuffExecuteSpell(
  spell: SummonDebuffCastSpell,
): boolean {
  if (!spell.debuffStat || !spell.debuffDuration) return false;
  const targetType = spell.targetType ?? "enemy";
  if (targetType !== "enemy") return false;
  if ((spell.spellType ?? "damage") === "heal") return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (spell.buffStat && spell.buffDuration) return false;
  if (spell.isDotSpell === true) return false;
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

export function summonDebuffCastApCost(spell: SummonDebuffCastSpell): number {
  return resolveCastApCost(Number(spell.apCost ?? 0));
}

export function canAffordSummonDebuffCast(
  currentAp: number,
  spell: SummonDebuffCastSpell,
): boolean {
  return canAffordCastAp(currentAp, Number(spell.apCost ?? 0));
}

/** Slow lands on the decide `targetId` cell. Do not force the caster tile. */
export function summonDebuffApplyCell(
  targetCell: SummonDebuffCastTile,
): SummonDebuffCastTile {
  return { x: targetCell.x, y: targetCell.y };
}

/** Same Chebyshev vs `Number(spell.range)` applyCast does not re-check. */
export function summonDebuffCastRangeOk(
  origin: SummonDebuffCastTile,
  targetCell: SummonDebuffCastTile,
  spell: SummonDebuffCastSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    summonDebuffApplyCell(targetCell),
    spell as Pick<SpellConfig, "range">,
  );
}

/**
 * Live applyCast branch order. Slow yields `["effect"]` — there is no
 * debuffStat arm after the generic applyEffect.
 */
export function summonDebuffApplyCastKinds(
  spell: SummonDebuffCastSpell,
  hasResolvedTarget: boolean,
): SummonDebuffApplyCastKind[] {
  if (Number(spell.damage ?? 0) > 0 && hasResolvedTarget) {
    return ["damage"];
  }
  if (Number(spell.healAmount ?? 0) > 0) {
    return ["heal"];
  }
  return ["effect"];
}

/** Advertised debuff payload. Buff-only / heal / damage / DoT return null. */
export function summonDebuffEffectFields(
  spell: SummonDebuffCastSpell,
): SummonDebuffFields | null {
  if (!isSummonDebuffExecuteSpell(spell) || !spell.debuffStat) return null;
  return {
    stat: spell.debuffStat,
    modifier: Number(spell.debuffModifier ?? 1),
    duration: Math.max(1, Math.floor(Number(spell.debuffDuration) || 0)),
  };
}

function liveApplyCastEffectType(
  spell: SummonDebuffCastSpell,
): "buff" | "debuff" | "dot" {
  if (spell.effectType === "buff") return "buff";
  if (spell.effectType === "debuff") return "debuff";
  return "dot";
}

/**
 * Live applyCast effect payload — kept only to lock the drift.
 * Type and duration are copied; advertised MP is not.
 */
export function summonDebuffLegacyApplyCastFields(
  spell: SummonDebuffCastSpell,
): {
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

export function isSummonDebuffHostileOccupant(args: {
  occupant: SummonDebuffOccupant;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.casterSide;
}

export function canExecuteSummonDebuffCast(args: {
  currentAp: number;
  spell: SummonDebuffCastSpell;
  origin: SummonDebuffCastTile;
  targetCell: SummonDebuffCastTile;
  occupant: SummonDebuffOccupant | null;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isSummonDebuffExecuteSpell(args.spell)) return false;
  if (!canAffordSummonDebuffCast(args.currentAp, args.spell)) return false;
  if (!summonDebuffCastRangeOk(args.origin, args.targetCell, args.spell)) {
    return false;
  }
  if (!args.occupant) return false;
  if (
    args.occupant.x !== args.targetCell.x ||
    args.occupant.y !== args.targetCell.y
  ) {
    return false;
  }
  return isSummonDebuffHostileOccupant({
    occupant: args.occupant,
    casterSide: args.casterSide,
  });
}

/** Alias so decide and applyCast cannot fork. */
export function shouldDecideSummonDebuffCast(
  args: Parameters<typeof canExecuteSummonDebuffCast>[0],
): boolean {
  return canExecuteSummonDebuffCast(args);
}

export function summonDebuffHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Execute a decided kit Slow. Non-debuff returns null so restack cannot
 * treat Strike / Shield / Poison as an MP write. Hostile Slow on the
 * player uses occupant id `"player"` — `getEnemyById` is not required.
 */
export function executeSummonDebuffCast(args: {
  currentAp: number;
  spell: SummonDebuffCastSpell;
  origin: SummonDebuffCastTile;
  targetCell: SummonDebuffCastTile;
  occupant: SummonDebuffOccupant | null;
  casterSide: "player" | "enemy";
}): SummonDebuffExecute | null {
  if (!canExecuteSummonDebuffCast(args) || !args.occupant) return null;
  const debuff = summonDebuffEffectFields(args.spell);
  if (!debuff) return null;
  return {
    targetId: args.occupant.id,
    tile: summonDebuffApplyCell(args.targetCell),
    debuff,
  };
}
