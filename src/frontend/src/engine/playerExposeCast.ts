/**
 * Player Expose advertised RES+SP vs the damage-then-return execute arms.
 *
 * Catalog Expose (`spell-expose`) is `spellType: "damage"`, `damage: 15`,
 * `debuffStat: "res_sp"`, `debuffModifier: 0.8`, `debuffDuration: 2`,
 * `range: 3`, `apCost: 3`, `targetType: "enemy"`, not `hitsMultiple`.
 * Description: "Deal 15 damage + debuff target RES and SP by -20% for 2
 * turns". Shadow Veil is the same shape (`damage: 18`, `res_sp` 0.85 / 2).
 * Mouse / sprite / touch / keyboard / Attack Nearest paint the tile through
 * `computeTargetableTiles` === `isTileCastableLive` (Chebyshev vs
 * `spellRangeBase`, player LoS only when `!!lineOfSight`).
 *
 * Execute then:
 *   1. `resolvePlayerCast` damage loop deals scaled damage and **returns
 *      "cast"** — it never reads `debuffStat` (spellEngine.ts ~876–1028).
 *   2. `resolveSpellCast` (summon-control WX ~9849) takes `damage > 0` and
 *      **returns** before the `debuffStat` arm (~483–548).
 *   3. `executeSummonAction` applyCast deals `damage > 0` and **returns**
 *      before `applyEffect` (no `debuffStat` / `debuffModifier`).
 *
 * WX enemy apply already copies nested `debuffStat` after the hit (#762).
 * Player-bar / control / applyCast therefore spend AP and deal 15 without
 * writing `res_sp`. `getStatModifier` only sums type-"debuff" rows with
 * `stat === query` (until #658 maps `res_sp` onto `res`/`sp`), so Shielded
 * follow-up hits and SP mitigation stay at 1.0. Summon kits do not include
 * Expose; `SUMMON_AP` max 2 cannot afford AP 3 anyway.
 *
 * Intended previous: a highlighted living hostile meant damage **and** the
 * advertised −20% RES+SP / 2, the same payload WX enemy Expose still
 * writes. #528 owns 0-damage Weaken/Slow. #555 restacks `resolvePlayerCast`
 * onto `playerDamageDebuff.ts` (Frost / Nova / Drain / Cursed Wound /
 * Expose as a combined helper) — this sidecar is the highlight / AP /
 * occupant execute gate and must not restack spellEngine. #658 owns the
 * `res_sp` **read** mapping once a row exists. #905 owns Frost Bolt MP
 * (`debuffStat === "mp"`). #878 owns summon-kit 0-damage Slow.
 *
 * This module is that execute gate. `shouldHighlightPlayerExposeCast` ===
 * `canExecutePlayerExposeCast` (`planPlayerCastAttempt` AP + cooldown +
 * live geometry, plus `isActiveHostile` on the clicked occupant). Empty
 * Strike-like rings stay painted; advertised RES+SP cannot land without a
 * living hostile. Do not switch enemy/summon range to `spellRangeBase`
 * (would rebalance). Do not steal Frost Bolt (#905), Slow / Weaken
 * (#528/#878), Life Drain / Drain Courage (drain arm), Frost Nova
 * (`hitsMultiple` / `targetType: "area"`), Cursed Wound (`healRecv`),
 * Poison, Shield, or Inferno. Do not require `spell.name`. Do not map
 * `res_sp` onto `res` here (#658).
 *
 * Unique vs #528/#555/#658/#762/#878/#905. WorldExploration / enemyAI /
 * summonExecutor / targeting / spellEngine / statusEffects left untouched
 * so older open PRs stay merge-clean. Restack the three damage-return arms
 * onto `executePlayerExposeCast` after those PRs land.
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

export type PlayerExposeCastSpell =
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

export type PlayerExposeCastTile = CasterPosition;

export type PlayerExposeOccupant = {
  id: string;
  x: number;
  y: number;
  hp: number;
  isSummon?: boolean;
  side?: "player" | "enemy";
};

export type PlayerExposeFields = {
  stat: string;
  modifier: number;
  duration: number;
};

export type PlayerExposeExecute = {
  tile: PlayerExposeCastTile;
  targetId: string;
  debuff: PlayerExposeFields;
};

export type PlayerExposeLiveKind = "damage" | "debuff" | "drain" | "heal";

/**
 * Catalog single-target damage+RES/SP kits. `debuffStat === "res_sp"` plus
 * `damage > 0` is the live Expose / Shadow Veil shape — do not require
 * `spellType === "debuff"` (catalog uses `"damage"`) or the display name.
 * Frost Bolt stays on #905 (`mp`). Frost Nova stays off this arm
 * (`hitsMultiple` / `targetType: "area"`). Slow / Weaken are 0-damage.
 * Drain kits keep the drain arm. Cursed Wound keeps `healRecv`.
 */
export function isPlayerExposeCastSpell(spell: PlayerExposeCastSpell): boolean {
  if (spell.debuffStat !== "res_sp") return false;
  if (Number(spell.damage ?? 0) <= 0) return false;
  const targetType = spell.targetType ?? "enemy";
  if (targetType !== "enemy") return false;
  if ((spell.spellType ?? "damage") === "heal") return false;
  if ((spell.spellType ?? "") === "drain") return false;
  if (
    String(spell.effectType ?? "")
      .toLowerCase()
      .includes("drain")
  ) {
    return false;
  }
  if (Number(spell.healAmount ?? 0) > 0) return false;
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

export function playerExposeCastApCost(spell: PlayerExposeCastSpell): number {
  return resolveCastApCost(Number(spell.apCost ?? 0));
}

export function canAffordPlayerExposeCast(
  currentAp: number,
  spell: PlayerExposeCastSpell,
): boolean {
  return canAffordCastAp(currentAp, Number(spell.apCost ?? 0));
}

/**
 * Player highlight range. Do not use `enemySpellRange` here — AI kits
 * stay on `Number(spell.range)` so they are not rebalanced.
 */
export function playerExposeCastRange(spell: PlayerExposeCastSpell): number {
  return spellRangeBase(spell as Pick<SpellConfig, "range" | "maxRange">);
}

/**
 * Live `resolveSpellCast` / applyCast / `resolvePlayerCast` damage-loop
 * branch order. Expose yields `["damage"]` — there is no nested
 * `debuffStat` after the hit the way WX enemy apply still copies.
 */
export function playerExposeLiveResolveKinds(
  spell: PlayerExposeCastSpell,
): PlayerExposeLiveKind[] {
  const isDrain =
    (spell.spellType ?? "") === "drain" ||
    String(spell.effectType ?? "")
      .toLowerCase()
      .includes("drain");
  if (Number(spell.damage ?? 0) > 0 && isDrain) return ["drain"];
  if (Number(spell.damage ?? 0) > 0) return ["damage"];
  if (Number(spell.healAmount ?? 0) > 0) return ["heal"];
  if (spell.debuffStat) return ["debuff"];
  return ["damage"];
}

/** Advertised Expose payload. Drain / Slow / Frost / Nova return null. */
export function playerExposeEffectFields(
  spell: PlayerExposeCastSpell,
): PlayerExposeFields | null {
  if (!isPlayerExposeCastSpell(spell) || !spell.debuffStat) return null;
  return {
    stat: spell.debuffStat,
    modifier: Number(spell.debuffModifier ?? 1),
    duration: Math.max(1, Math.floor(Number(spell.debuffDuration) || 0)),
  };
}

export function playerExposeAdvertisedKinds(
  spell: PlayerExposeCastSpell,
): PlayerExposeLiveKind[] {
  if (!isPlayerExposeCastSpell(spell)) {
    return playerExposeLiveResolveKinds(spell);
  }
  return ["damage", "debuff"];
}

/** WX enemy apply (~16594) already nests `debuffStat` after the hit (#762). */
export function playerExposeWxEnemyAppliesNestedDebuff(): boolean {
  return true;
}

export function isPlayerExposeHostileOccupant(
  occupant: PlayerExposeOccupant | null,
): boolean {
  if (!occupant) return false;
  return isActiveHostile({
    hp: occupant.hp,
    isSummon: occupant.isSummon,
    side: occupant.side,
    id: occupant.id,
  });
}

export function canExecutePlayerExposeCast(args: {
  currentAp: number;
  cooldownTurnsRemaining?: unknown;
  spell: SpellConfig;
  origin: PlayerExposeCastTile;
  target: PlayerExposeCastTile;
  occupant: PlayerExposeOccupant | null;
  liveCombatants: Enemy[];
  mapTiles: TileType[][];
  effectiveRange?: number;
  barrierTiles?: BarrierTiles;
}): boolean {
  if (!isPlayerExposeCastSpell(args.spell)) return false;
  if (!args.occupant) return false;
  if (args.occupant.x !== args.target.x || args.occupant.y !== args.target.y) {
    return false;
  }
  if (!isPlayerExposeHostileOccupant(args.occupant)) return false;
  const plan = planPlayerCastAttempt({
    spell: args.spell,
    caster: args.origin,
    tile: args.target,
    liveCombatants: args.liveCombatants,
    mapTiles: args.mapTiles,
    effectiveRange: args.effectiveRange ?? playerExposeCastRange(args.spell),
    barrierTiles: args.barrierTiles,
    currentAp: args.currentAp,
    baseApCost: Number(args.spell.apCost ?? 0),
    cooldownTurnsRemaining: args.cooldownTurnsRemaining ?? 0,
  });
  return plan.ok;
}

/** Alias so highlight and execute cannot fork. */
export function shouldHighlightPlayerExposeCast(
  args: Parameters<typeof canExecutePlayerExposeCast>[0],
): boolean {
  return canExecutePlayerExposeCast(args);
}

export function playerExposeHighlightedTargetIsExecutable(args: {
  highlighted: boolean;
  executable: boolean;
}): boolean {
  return args.highlighted === true && args.executable === true;
}

/**
 * Execute a highlighted Expose. Non-expose returns null so restack cannot
 * treat Strike / Frost / Nova / Drain as a RES+SP write. The tile is the
 * living hostile, not the caster. Catalog `stat` stays `"res_sp"` — #658
 * owns mapping that key onto `res` / `sp` queries.
 */
export function executePlayerExposeCast(args: {
  currentAp: number;
  cooldownTurnsRemaining?: unknown;
  spell: SpellConfig;
  origin: PlayerExposeCastTile;
  target: PlayerExposeCastTile;
  occupant: PlayerExposeOccupant | null;
  liveCombatants: Enemy[];
  mapTiles: TileType[][];
  effectiveRange?: number;
  barrierTiles?: BarrierTiles;
}): PlayerExposeExecute | null {
  if (!canExecutePlayerExposeCast(args) || !args.occupant) return null;
  const debuff = playerExposeEffectFields(args.spell);
  if (!debuff) return null;
  return {
    tile: { x: args.target.x, y: args.target.y },
    targetId: args.occupant.id,
    debuff,
  };
}
