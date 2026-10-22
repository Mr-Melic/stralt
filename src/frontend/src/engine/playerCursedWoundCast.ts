/**
 * Player Cursed Wound advertised healRecv vs the damage-then-return execute arms.
 *
 * Catalog Cursed Wound (`spell-cursed-wound`) is `spellType: "damage"`,
 * `damage: 22`, `debuffStat: "healRecv"`, `debuffModifier: 0.5`,
 * `debuffDuration: 2`, `range: 3`, `apCost: 3`, `targetType: "enemy"`,
 * not `hitsMultiple`. Description: "Deal 22 damage + reduce target heal
 * received by -50% for 2 turns". Mouse / sprite / touch / keyboard /
 * Attack Nearest paint the tile through `computeTargetableTiles` ===
 * `isTileCastableLive` (Chebyshev vs `spellRangeBase`, player LoS only
 * when `!!lineOfSight`).
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
 * Boss kit Pale Archivist / Midnight Bishop / Chessboard Lich first-id
 * Cursed Wound also writes `healRecv` on the player (WX ~15907). Player-bar
 * / control / applyCast therefore spend AP and deal 22 without writing
 * `healRecv` on the clicked hostile. `getStatModifier` sums type-"debuff"
 * rows with `stat === "healRecv"` (multiplicative; no #658 mapping needed),
 * so a follow-up Wisp / enemy self-heal / Blood Mend on that target stays
 * at 1.0. Summon kits do not include Cursed Wound; `SUMMON_AP` max 2 cannot
 * afford AP 3 anyway.
 *
 * Intended previous: a highlighted living hostile meant damage **and** the
 * advertised −50% heal received / 2, the same payload WX enemy / boss kit
 * Cursed Wound still writes. Player heals already consume `healRecv`
 * (`resolvePlayerCast` Blood Mend uses `getEffectiveStat("player",
 * "healRecv")`). #528 owns 0-damage Weaken/Slow. #555 restacks
 * `resolvePlayerCast` onto `playerDamageDebuff.ts` (Frost / Nova / Drain /
 * Cursed Wound / Expose as a combined helper) — this sidecar is the
 * highlight / AP / occupant execute gate and must not restack spellEngine.
 * #905 owns Frost Bolt MP (`debuffStat === "mp"`). #913 owns Expose /
 * Shadow Veil (`debuffStat === "res_sp"`). #888 owns boss kit first-id
 * **range** (Cursed Wound included). #878 owns summon-kit 0-damage Slow.
 *
 * This module is that execute gate. `shouldHighlightPlayerCursedWoundCast`
 * === `canExecutePlayerCursedWoundCast` (`planPlayerCastAttempt` AP +
 * cooldown + live geometry, plus `isActiveHostile` on the clicked occupant).
 * Empty Strike-like rings stay painted; advertised healRecv cannot land
 * without a living hostile. Do not switch enemy/summon range to
 * `spellRangeBase` (would rebalance). Do not steal Frost Bolt (#905),
 * Expose / Shadow Veil (#913), Slow / Weaken (#528/#878), Life Drain /
 * Drain Courage (drain arm), Frost Nova (`hitsMultiple` / `targetType:
 * "area"`), Poison, Shield, or Inferno. Do not require `spell.name`.
 *
 * Unique vs #528/#555/#762/#878/#888/#905/#910/#913. WorldExploration /
 * enemyAI / summonExecutor / targeting / spellEngine / statusEffects left
 * untouched so older open PRs stay merge-clean. Restack the three
 * damage-return arms onto `executePlayerCursedWoundCast` after those PRs
 * land.
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

export type PlayerCursedWoundCastSpell =
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

export type PlayerCursedWoundCastTile = CasterPosition;

export type PlayerCursedWoundOccupant = {
  id: string;
  x: number;
  y: number;
  hp: number;
  isSummon?: boolean;
  side?: "player" | "enemy";
};

export type PlayerCursedWoundFields = {
  stat: string;
  modifier: number;
  duration: number;
};

export type PlayerCursedWoundExecute = {
  tile: PlayerCursedWoundCastTile;
  targetId: string;
  debuff: PlayerCursedWoundFields;
};

export type PlayerCursedWoundLiveKind = "damage" | "debuff" | "drain" | "heal";

/**
 * Catalog single-target damage+healRecv kits. `debuffStat === "healRecv"`
 * plus `damage > 0` is the live Cursed Wound shape — do not require
 * `spellType === "debuff"` (catalog uses `"damage"`) or the display name.
 * Frost Bolt stays on #905 (`mp`). Expose / Shadow Veil stay on #913
 * (`res_sp`). Frost Nova stays off this arm (`hitsMultiple` /
 * `targetType: "area"`). Slow / Weaken are 0-damage. Drain kits keep the
 * drain arm.
 */
export function isPlayerCursedWoundCastSpell(
  spell: PlayerCursedWoundCastSpell,
): boolean {
  if (spell.debuffStat !== "healRecv") return false;
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

export function playerCursedWoundCastApCost(
  spell: PlayerCursedWoundCastSpell,
): number {
  return resolveCastApCost(Number(spell.apCost ?? 0));
}

export function canAffordPlayerCursedWoundCast(
  currentAp: number,
  spell: PlayerCursedWoundCastSpell,
): boolean {
  return canAffordCastAp(currentAp, Number(spell.apCost ?? 0));
}

/**
 * Player highlight range. Do not use `enemySpellRange` here — AI kits
 * stay on `Number(spell.range)` so they are not rebalanced.
 */
export function playerCursedWoundCastRange(
  spell: PlayerCursedWoundCastSpell,
): number {
  return spellRangeBase(spell as Pick<SpellConfig, "range" | "maxRange">);
}

/**
 * Live `resolveSpellCast` / applyCast / `resolvePlayerCast` damage-loop
 * branch order. Cursed Wound yields `["damage"]` — there is no nested
 * `debuffStat` after the hit the way WX enemy / boss kit apply still copies.
 */
export function playerCursedWoundLiveResolveKinds(
  spell: PlayerCursedWoundCastSpell,
): PlayerCursedWoundLiveKind[] {
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

/** Advertised Cursed Wound payload. Drain / Slow / Frost / Expose return null. */
export function playerCursedWoundEffectFields(
  spell: PlayerCursedWoundCastSpell,
): PlayerCursedWoundFields | null {
  if (!isPlayerCursedWoundCastSpell(spell) || !spell.debuffStat) return null;
  return {
    stat: spell.debuffStat,
    modifier: Number(spell.debuffModifier ?? 1),
    duration: Math.max(1, Math.floor(Number(spell.debuffDuration) || 0)),
  };
}

export function playerCursedWoundAdvertisedKinds(
  spell: PlayerCursedWoundCastSpell,
): PlayerCursedWoundLiveKind[] {
  if (!isPlayerCursedWoundCastSpell(spell)) {
    return playerCursedWoundLiveResolveKinds(spell);
  }
  return ["damage", "debuff"];
}

/** WX enemy apply (~16594) already nests `debuffStat` after the hit (#762). */
export function playerCursedWoundWxEnemyAppliesNestedDebuff(): boolean {
  return true;
}

export function isPlayerCursedWoundHostileOccupant(
  occupant: PlayerCursedWoundOccupant | null,
): boolean {
  if (!occupant) return false;
  return isActiveHostile({
    hp: occupant.hp,
    isSummon: occupant.isSummon,
    side: occupant.side,
    id: occupant.id,
  });
}

export function canExecutePlayerCursedWoundCast(args: {
  currentAp: number;
  cooldownTurnsRemaining?: unknown;
  spell: SpellConfig;
  origin: PlayerCursedWoundCastTile;
  target: PlayerCursedWoundCastTile;
  occupant: PlayerCursedWoundOccupant | null;
  liveCombatants: Enemy[];
  mapTiles: TileType[][];
  effectiveRange?: number;
  barrierTiles?: BarrierTiles;
}): boolean {
  if (!isPlayerCursedWoundCastSpell(args.spell)) return false;
  if (!args.occupant) return false;
  if (args.occupant.x !== args.target.x || args.occupant.y !== args.target.y) {
    return false;
  }
  if (!isPlayerCursedWoundHostileOccupant(args.occupant)) return false;
  const plan = planPlayerCastAttempt({
    spell: args.spell,
    caster: args.origin,
    tile: args.target,
    liveCombatants: args.liveCombatants,
    mapTiles: args.mapTiles,
    effectiveRange:
      args.effectiveRange ?? playerCursedWoundCastRange(args.spell),
    barrierTiles: args.barrierTiles,
    currentAp: args.currentAp,
    baseApCost: Number(args.spell.apCost ?? 0),
    cooldownTurnsRemaining: args.cooldownTurnsRemaining ?? 0,
  });
  return plan.ok;
}

/** Alias so highlight and execute cannot fork. */
export function shouldHighlightPlayerCursedWoundCast(
  args: Parameters<typeof canExecutePlayerCursedWoundCast>[0],
): boolean {
  return canExecutePlayerCursedWoundCast(args);
}

export function playerCursedWoundHighlightedTargetIsExecutable(args: {
  highlighted: boolean;
  executable: boolean;
}): boolean {
  return args.highlighted === true && args.executable === true;
}

/**
 * Execute a highlighted Cursed Wound. Non-wound returns null so restack
 * cannot treat Strike / Frost / Expose / Nova / Drain as a healRecv write.
 * The tile is the living hostile, not the caster. Catalog `stat` stays
 * `"healRecv"` — player Blood Mend already reads that key; enemy
 * `hpAfterHeal` consume is a separate leftover.
 */
export function executePlayerCursedWoundCast(args: {
  currentAp: number;
  cooldownTurnsRemaining?: unknown;
  spell: SpellConfig;
  origin: PlayerCursedWoundCastTile;
  target: PlayerCursedWoundCastTile;
  occupant: PlayerCursedWoundOccupant | null;
  liveCombatants: Enemy[];
  mapTiles: TileType[][];
  effectiveRange?: number;
  barrierTiles?: BarrierTiles;
}): PlayerCursedWoundExecute | null {
  if (!canExecutePlayerCursedWoundCast(args) || !args.occupant) return null;
  const debuff = playerCursedWoundEffectFields(args.spell);
  if (!debuff) return null;
  return {
    tile: { x: args.target.x, y: args.target.y },
    targetId: args.occupant.id,
    debuff,
  };
}
