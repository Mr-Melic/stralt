/**
 * Player Drain Courage advertised AP vs the drain-then-return execute arms.
 *
 * Catalog Drain Courage (`spell-drain-courage`) is `spellType: "drain"`,
 * `effectType: "drain"`, `damage: 18`, `healAmount: 9`, `debuffStat: "ap"`,
 * `debuffModifier: -1`, `debuffDuration: 1`, `range: 2`, `apCost: 4`,
 * `targetType: "enemy"`, not `hitsMultiple`. Description: "Drain target
 * for 18 (heal self 9) + reduce target AP by -1 next turn". Mouse /
 * sprite / touch / keyboard / Attack Nearest paint the tile through
 * `computeTargetableTiles` === `isTileCastableLive` (Chebyshev vs
 * `spellRangeBase`, player LoS only when `!!lineOfSight`).
 *
 * Execute then:
 *   1. `resolvePlayerCast` enters the damage loop because `targetEnemy`
 *      (`spellEngine.ts` ~876) and **returns "cast"** — it never reads
 *      `debuffStat`. Drain heal is `applyDamageToEnemy` (`#440` for Life
 *      Drain HP; Drain Courage heal is the same arm).
 *   2. `resolveSpellCast` takes `damage > 0 && isDrain` and **returns**
 *      before the `debuffStat` arm (~448–548).
 *   3. `executeSummonAction` applyCast deals `damage > 0` and **returns**
 *      before `applyEffect` (no `debuffStat` / `debuffModifier`).
 *
 * WX enemy apply already copies nested `debuffStat` after the hit (#762)
 * and sets `playerApWasDebuffedRef` when the target is the player. WX
 * boss apply (~15907) does the same for Eternal Pawn / Vampire second-id
 * Drain Courage on the player. Player-bar / control / applyCast therefore
 * spend 4 AP, deal 18, and heal without writing `ap` on the clicked
 * hostile. `getStatModifier` sums type-"debuff" rows with `stat === "ap"`
 * (additive; no #658 mapping needed), so a follow-up enemy AP pool stays
 * at 0 extra instead of −1. Summon kits do not include Drain Courage;
 * `SUMMON_AP` max 2 cannot afford AP 4 anyway.
 *
 * Intended previous: a highlighted living hostile meant drain **and** the
 * advertised −1 AP / 1, the same payload WX enemy / boss kit Drain
 * Courage still writes on the player. Incoming player AP already consumes
 * `getStatModifier("player", "ap")` (WX ~9367 / ~12111). #440 owns Life
 * Drain HP restore. #921 owns Life Drain SP (`debuffStat === "sp"`).
 * #543 owns Lifesteal Nova empty-anchor drain. #562 owns the drain
 * occupant live gate. #555 restacks `resolvePlayerCast` onto
 * `playerDamageDebuff.ts` (Frost / Nova / Drain / Cursed Wound / Expose
 * as a combined helper) — this sidecar is the highlight / AP / occupant
 * execute gate and must not restack spellEngine. #905 owns Frost Bolt MP.
 * #913 owns Expose / Shadow Veil (`res_sp`). #915 owns Cursed Wound
 * (`healRecv`). #917 owns Frost Nova AoE MP.
 *
 * This module is that execute gate. `shouldHighlightPlayerDrainCourageCast`
 * === `canExecutePlayerDrainCourageCast` (`planPlayerCastAttempt` AP +
 * cooldown + live geometry, plus `isActiveHostile` on the clicked
 * occupant). Empty Strike-like rings stay painted; advertised AP cannot
 * land without a living hostile. Do not switch enemy/summon range to
 * `spellRangeBase` (would rebalance). Do not steal Frost Bolt (#905),
 * Expose / Shadow Veil (#913), Cursed Wound (#915), Frost Nova (#917),
 * Slow / Weaken (#528/#878), Life Drain SP (#921), or Lifesteal Nova
 * (#543). Do not require `spell.name`.
 *
 * Unique vs #440/#528/#543/#555/#562/#762/#878/#905/#913/#915/#917/#921.
 * WorldExploration / enemyAI / summonExecutor / targeting / spellEngine
 * / statusEffects / castHelpers left untouched so older open PRs stay
 * merge-clean. Restack the three drain-return arms onto
 * `executePlayerDrainCourageCast` after those PRs land.
 */

import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import { isActiveHostile } from "./battleSetup.ts";
import { planPlayerCastAttempt } from "./playerCastPlan.ts";
import {
  type BarrierTiles,
  type CasterPosition,
  type TileType,
  canAffordCastAp,
  resolveCastApCost,
  spellRangeBase,
} from "./targeting.ts";

export type PlayerDrainCourageCastSpell =
  | Pick<
      SpellConfig,
      | "apCost"
      | "range"
      | "maxRange"
      | "minRange"
      | "spellType"
      | "effectType"
      | "damage"
      | "targetType"
      | "healAmount"
      | "buffStat"
      | "debuffStat"
      | "debuffModifier"
      | "debuffDuration"
      | "dotDamage"
      | "dotDamagePerTurn"
      | "hitsMultiple"
      | "aoe"
      | "isDotSpell"
      | "isSummon"
      | "isSwap"
      | "isMark"
      | "isMirror"
      | "isBarrier"
      | "isSacrifice"
      | "isTimestep"
      | "lineOfSight"
    >
  | {
      apCost?: unknown;
      range?: unknown;
      maxRange?: number;
      minRange?: number;
      spellType?: string | null;
      effectType?: string | null;
      damage?: unknown;
      targetType?: string | null;
      healAmount?: unknown;
      buffStat?: string | null;
      debuffStat?: string | null;
      debuffModifier?: unknown;
      debuffDuration?: unknown;
      dotDamage?: unknown;
      dotDamagePerTurn?: unknown;
      hitsMultiple?: boolean | null;
      aoe?: boolean | null;
      isDotSpell?: boolean | null;
      isSummon?: boolean | null;
      isSwap?: boolean | null;
      isMark?: boolean | null;
      isMirror?: boolean | null;
      isBarrier?: boolean | null;
      isSacrifice?: boolean | null;
      isTimestep?: boolean | null;
      lineOfSight?: boolean;
    };

export type PlayerDrainCourageCastTile = CasterPosition;

export type PlayerDrainCourageOccupant = {
  id: string;
  x: number;
  y: number;
  hp: number;
  isSummon?: boolean;
  side?: "player" | "enemy";
};

export type PlayerDrainCourageFields = {
  stat: string;
  modifier: number;
  duration: number;
};

export type PlayerDrainCourageExecute = {
  tile: PlayerDrainCourageCastTile;
  targetId: string;
  debuff: PlayerDrainCourageFields;
};

export type PlayerDrainCourageLiveKind = "damage" | "debuff" | "drain" | "heal";

function isDrainSpell(spell: PlayerDrainCourageCastSpell): boolean {
  if ((spell.spellType ?? "") === "drain") return true;
  return String(spell.effectType ?? "")
    .toLowerCase()
    .includes("drain");
}

/**
 * Catalog single-target drain+AP kits. `debuffStat === "ap"` plus drain
 * plus `damage > 0` is the live Drain Courage shape — do not require
 * `spellType === "debuff"` (catalog uses `"drain"`) or the display name.
 * Life Drain stays on #921 (`debuffStat === "sp"`). Lifesteal Nova stays
 * on #543 (`hitsMultiple`, no `debuffStat`). Frost Bolt stays on #905
 * (`mp`, not drain).
 */
export function isPlayerDrainCourageCastSpell(
  spell: PlayerDrainCourageCastSpell,
): boolean {
  if (spell.debuffStat !== "ap") return false;
  if (!isDrainSpell(spell)) return false;
  if (Number(spell.damage ?? 0) <= 0) return false;
  const targetType = spell.targetType ?? "enemy";
  if (targetType !== "enemy") return false;
  if ((spell.spellType ?? "") === "heal") return false;
  if (spell.hitsMultiple === true || spell.aoe === true) return false;
  if (spell.buffStat) return false;
  if (
    Number(spell.dotDamage ?? 0) > 0 ||
    Number(spell.dotDamagePerTurn ?? 0) > 0 ||
    spell.isDotSpell === true
  ) {
    return false;
  }
  if (
    spell.isSummon ||
    spell.isSwap ||
    spell.isMark ||
    spell.isMirror ||
    spell.isBarrier ||
    spell.isSacrifice ||
    spell.isTimestep
  ) {
    return false;
  }
  return Number(spell.debuffDuration ?? 0) > 0;
}

export function playerDrainCourageCastApCost(
  spell: PlayerDrainCourageCastSpell,
): number {
  return resolveCastApCost(Number(spell.apCost ?? 0));
}

export function canAffordPlayerDrainCourageCast(
  currentAp: number,
  spell: PlayerDrainCourageCastSpell,
): boolean {
  return canAffordCastAp(currentAp, Number(spell.apCost ?? 0));
}

/**
 * Player highlight range. Do not use `enemySpellRange` here — AI kits
 * stay on `Number(spell.range)` so they are not rebalanced.
 */
export function playerDrainCourageCastRange(
  spell: PlayerDrainCourageCastSpell,
): number {
  return spellRangeBase(spell as Pick<SpellConfig, "range" | "maxRange">);
}

/**
 * Live `resolveSpellCast` / applyCast / `resolvePlayerCast` drain-loop
 * branch order. Drain Courage yields `["drain"]` — there is no nested
 * `debuffStat` after the hit the way WX enemy / boss kit apply still copies.
 */
export function playerDrainCourageLiveResolveKinds(
  spell: PlayerDrainCourageCastSpell,
): PlayerDrainCourageLiveKind[] {
  if (Number(spell.damage ?? 0) > 0 && isDrainSpell(spell)) return ["drain"];
  if (Number(spell.damage ?? 0) > 0) return ["damage"];
  if (Number(spell.healAmount ?? 0) > 0) return ["heal"];
  if (spell.debuffStat) return ["debuff"];
  return ["damage"];
}

/** Advertised Drain Courage payload. Life Drain / Nova / Frost return null. */
export function playerDrainCourageEffectFields(
  spell: PlayerDrainCourageCastSpell,
): PlayerDrainCourageFields | null {
  if (!isPlayerDrainCourageCastSpell(spell) || !spell.debuffStat) return null;
  return {
    stat: spell.debuffStat,
    modifier: Number(spell.debuffModifier ?? 0),
    duration: Math.max(1, Math.floor(Number(spell.debuffDuration) || 0)),
  };
}

export function playerDrainCourageAdvertisedKinds(
  spell: PlayerDrainCourageCastSpell,
): PlayerDrainCourageLiveKind[] {
  if (!isPlayerDrainCourageCastSpell(spell)) {
    return playerDrainCourageLiveResolveKinds(spell);
  }
  return ["drain", "debuff"];
}

/** WX enemy apply (~16594) already nests `debuffStat` after the hit (#762). */
export function playerDrainCourageWxEnemyAppliesNestedDebuff(): boolean {
  return true;
}

/** WX boss apply (~15907) already nests `debuffStat` after the hit. */
export function playerDrainCourageWxBossAppliesNestedDebuff(): boolean {
  return true;
}

export function isPlayerDrainCourageHostileOccupant(
  occupant: PlayerDrainCourageOccupant | null,
): boolean {
  if (!occupant) return false;
  return isActiveHostile({
    hp: occupant.hp,
    isSummon: occupant.isSummon,
    side: occupant.side,
    id: occupant.id,
  });
}

export function canExecutePlayerDrainCourageCast(args: {
  currentAp: number;
  cooldownTurnsRemaining?: unknown;
  spell: SpellConfig;
  origin: PlayerDrainCourageCastTile;
  target: PlayerDrainCourageCastTile;
  occupant: PlayerDrainCourageOccupant | null;
  liveCombatants: Enemy[];
  mapTiles: TileType[][];
  effectiveRange?: number;
  barrierTiles?: BarrierTiles;
}): boolean {
  if (!isPlayerDrainCourageCastSpell(args.spell)) return false;
  if (!args.occupant) return false;
  if (args.occupant.x !== args.target.x || args.occupant.y !== args.target.y) {
    return false;
  }
  if (!isPlayerDrainCourageHostileOccupant(args.occupant)) return false;
  const plan = planPlayerCastAttempt({
    spell: args.spell,
    caster: args.origin,
    tile: args.target,
    liveCombatants: args.liveCombatants,
    mapTiles: args.mapTiles,
    effectiveRange:
      args.effectiveRange ?? playerDrainCourageCastRange(args.spell),
    barrierTiles: args.barrierTiles,
    currentAp: args.currentAp,
    baseApCost: Number(args.spell.apCost ?? 0),
    cooldownTurnsRemaining: args.cooldownTurnsRemaining ?? 0,
  });
  return plan.ok;
}

/** Alias so highlight and execute cannot fork. */
export function shouldHighlightPlayerDrainCourageCast(
  args: Parameters<typeof canExecutePlayerDrainCourageCast>[0],
): boolean {
  return canExecutePlayerDrainCourageCast(args);
}

export function playerDrainCourageHighlightedTargetIsExecutable(args: {
  highlighted: boolean;
  executable: boolean;
}): boolean {
  return args.highlighted === true && args.executable === true;
}

/**
 * Execute a highlighted Drain Courage. Non-courage returns null so restack
 * cannot treat Strike / Frost / Expose / Nova / Life Drain as an AP write.
 * The tile is the living hostile, not the caster. Catalog `stat` stays
 * `"ap"` — incoming player AP already reads that key; enemy outgoing AP
 * consume is a separate leftover.
 */
export function executePlayerDrainCourageCast(args: {
  currentAp: number;
  cooldownTurnsRemaining?: unknown;
  spell: SpellConfig;
  origin: PlayerDrainCourageCastTile;
  target: PlayerDrainCourageCastTile;
  occupant: PlayerDrainCourageOccupant | null;
  liveCombatants: Enemy[];
  mapTiles: TileType[][];
  effectiveRange?: number;
  barrierTiles?: BarrierTiles;
}): PlayerDrainCourageExecute | null {
  if (!canExecutePlayerDrainCourageCast(args) || !args.occupant) return null;
  const debuff = playerDrainCourageEffectFields(args.spell);
  if (!debuff) return null;
  return {
    tile: { x: args.target.x, y: args.target.y },
    targetId: args.occupant.id,
    debuff,
  };
}
