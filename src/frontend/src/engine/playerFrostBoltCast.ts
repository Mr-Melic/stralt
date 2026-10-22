/**
 * Player Frost Bolt advertised MP vs the damage-then-return execute arms.
 *
 * Catalog Frost Bolt (`starter-frost`) is `spellType: "damage"`, `damage: 20`,
 * `debuffStat: "mp"`, `debuffModifier: -1`, `debuffDuration: 1`, `range: 4`,
 * `apCost: 3`, `targetType: "enemy"`, not `hitsMultiple`. Description:
 * "Deal 20 damage and reduce target MP by -1 for 1 turn". Mouse / sprite /
 * touch / keyboard / Attack Nearest paint the tile through
 * `computeTargetableTiles` === `isTileCastableLive` (Chebyshev vs
 * `spellRangeBase`, player LoS only when `!!lineOfSight`).
 *
 * Execute then:
 *   1. `resolvePlayerCast` damage loop deals scaled damage and **returns
 *      "cast"** — it never reads `debuffStat` (spellEngine.ts ~876–1028).
 *   2. `resolveSpellCast` (summon-control WX ~9849, summonAI `tryKitCast`)
 *      takes `damage > 0` and **returns** before the `debuffStat` arm
 *      (~483–548).
 *   3. `executeSummonAction` applyCast deals `damage > 0` and **returns**
 *      before `applyEffect` (no `debuffStat` / `debuffModifier`).
 *
 * Bishop / queen / king kits decide `starter-frost`; WX enemy apply already
 * copies nested `debuffStat` after the hit (#762). Player-bar / control /
 * applyCast therefore spend AP and deal 20 without writing MP. `getStatModifier`
 * only sums type-"debuff" rows with `stat === "mp"`, so restore stays at
 * PLAYER_BASE_MP. Summon kits do not include Frost Bolt; `SUMMON_AP` max 2
 * cannot afford AP 3 anyway.
 *
 * Intended previous: a highlighted living hostile meant damage **and** the
 * advertised −1 MP / 1, the same payload WX enemy Frost Bolt still writes.
 * #528 owns 0-damage Weaken/Slow (`decidePlayerDebuffOnlyCast`) and
 * explicitly leaves Frost on the damage loop. #555 restacks
 * `resolvePlayerCast` onto `playerDamageDebuff.ts` (also drain / Nova) —
 * this sidecar is the highlight / AP / occupant execute gate and must not
 * restack spellEngine. #878 owns summon-kit 0-damage Slow.
 *
 * This module is that execute gate. `shouldHighlightPlayerFrostBoltCast`
 * === `canExecutePlayerFrostBoltCast` (`planPlayerCastAttempt` AP + cooldown
 * + live geometry, plus `isActiveHostile` on the clicked occupant). Empty
 * Strike-like rings stay painted; advertised MP cannot land without a
 * living hostile. Do not switch enemy/summon range to `spellRangeBase`
 * (would rebalance bishop frost). Do not convert −1 into a multiplier.
 * Do not steal Slow / Weaken (#528/#878), Life Drain / Drain Courage
 * (drain arm), Frost Nova (`hitsMultiple` / `targetType: "area"`), Poison,
 * Shield, Blood Mend, or Inferno. Do not require `spell.name`.
 *
 * Unique vs #528/#555/#598/#762/#878. WorldExploration / enemyAI /
 * summonExecutor / targeting / spellEngine left untouched so older open
 * PRs stay merge-clean. Restack the three damage-return arms onto
 * `executePlayerFrostBoltCast` after those PRs land.
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

export type PlayerFrostBoltCastSpell =
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

export type PlayerFrostBoltCastTile = CasterPosition;

export type PlayerFrostBoltOccupant = {
  id: string;
  x: number;
  y: number;
  hp: number;
  isSummon?: boolean;
  side?: "player" | "enemy";
};

export type PlayerFrostBoltFields = {
  stat: string;
  modifier: number;
  duration: number;
};

export type PlayerFrostBoltExecute = {
  tile: PlayerFrostBoltCastTile;
  targetId: string;
  debuff: PlayerFrostBoltFields;
};

export type PlayerFrostBoltLiveKind = "damage" | "debuff" | "drain" | "heal";

/**
 * Catalog single-target damage+MP kits. `debuffStat === "mp"` plus
 * `damage > 0` is the live Frost Bolt shape — do not require
 * `spellType === "debuff"` (catalog uses `"damage"`) or the display name.
 * Frost Nova stays off this arm (`hitsMultiple` / `targetType: "area"`).
 * Slow / Weaken are 0-damage (#528 / #878). Drain kits keep the drain arm.
 */
export function isPlayerFrostBoltCastSpell(
  spell: PlayerFrostBoltCastSpell,
): boolean {
  if (spell.debuffStat !== "mp") return false;
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

export function playerFrostBoltCastApCost(
  spell: PlayerFrostBoltCastSpell,
): number {
  return resolveCastApCost(Number(spell.apCost ?? 0));
}

export function canAffordPlayerFrostBoltCast(
  currentAp: number,
  spell: PlayerFrostBoltCastSpell,
): boolean {
  return canAffordCastAp(currentAp, Number(spell.apCost ?? 0));
}

/**
 * Player highlight range. Do not use `enemySpellRange` here — bishop frost
 * stays on `Number(spell.range)` so AI is not rebalanced.
 */
export function playerFrostBoltCastRange(
  spell: PlayerFrostBoltCastSpell,
): number {
  return spellRangeBase(spell as Pick<SpellConfig, "range" | "maxRange">);
}

/**
 * Live `resolveSpellCast` / applyCast / `resolvePlayerCast` damage-loop
 * branch order. Frost Bolt yields `["damage"]` — there is no nested
 * `debuffStat` after the hit the way WX enemy apply still copies.
 */
export function playerFrostBoltLiveResolveKinds(
  spell: PlayerFrostBoltCastSpell,
): PlayerFrostBoltLiveKind[] {
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

/** Advertised Frost Bolt payload. Drain / Slow / Nova return null. */
export function playerFrostBoltEffectFields(
  spell: PlayerFrostBoltCastSpell,
): PlayerFrostBoltFields | null {
  if (!isPlayerFrostBoltCastSpell(spell) || !spell.debuffStat) return null;
  return {
    stat: spell.debuffStat,
    modifier: Number(spell.debuffModifier ?? 1),
    duration: Math.max(1, Math.floor(Number(spell.debuffDuration) || 0)),
  };
}

export function playerFrostBoltAdvertisedKinds(
  spell: PlayerFrostBoltCastSpell,
): PlayerFrostBoltLiveKind[] {
  if (!isPlayerFrostBoltCastSpell(spell)) {
    return playerFrostBoltLiveResolveKinds(spell);
  }
  return ["damage", "debuff"];
}

/** WX enemy apply (~16594) already nests `debuffStat` after the hit (#762). */
export function playerFrostBoltWxEnemyAppliesNestedDebuff(): boolean {
  return true;
}

export function isPlayerFrostBoltHostileOccupant(
  occupant: PlayerFrostBoltOccupant | null,
): boolean {
  if (!occupant) return false;
  return isActiveHostile({
    hp: occupant.hp,
    isSummon: occupant.isSummon,
    side: occupant.side,
    id: occupant.id,
  });
}

export function canExecutePlayerFrostBoltCast(args: {
  currentAp: number;
  cooldownTurnsRemaining?: unknown;
  spell: SpellConfig;
  origin: PlayerFrostBoltCastTile;
  target: PlayerFrostBoltCastTile;
  occupant: PlayerFrostBoltOccupant | null;
  liveCombatants: Enemy[];
  mapTiles: TileType[][];
  effectiveRange?: number;
  barrierTiles?: BarrierTiles;
}): boolean {
  if (!isPlayerFrostBoltCastSpell(args.spell)) return false;
  if (!args.occupant) return false;
  if (args.occupant.x !== args.target.x || args.occupant.y !== args.target.y) {
    return false;
  }
  if (!isPlayerFrostBoltHostileOccupant(args.occupant)) return false;
  const plan = planPlayerCastAttempt({
    spell: args.spell,
    caster: args.origin,
    tile: args.target,
    liveCombatants: args.liveCombatants,
    mapTiles: args.mapTiles,
    effectiveRange: args.effectiveRange ?? playerFrostBoltCastRange(args.spell),
    barrierTiles: args.barrierTiles,
    currentAp: args.currentAp,
    baseApCost: Number(args.spell.apCost ?? 0),
    cooldownTurnsRemaining: args.cooldownTurnsRemaining ?? 0,
  });
  return plan.ok;
}

/** Alias so highlight and execute cannot fork. */
export function shouldHighlightPlayerFrostBoltCast(
  args: Parameters<typeof canExecutePlayerFrostBoltCast>[0],
): boolean {
  return canExecutePlayerFrostBoltCast(args);
}

export function playerFrostBoltHighlightedTargetIsExecutable(args: {
  highlighted: boolean;
  executable: boolean;
}): boolean {
  return args.highlighted === true && args.executable === true;
}

/**
 * Execute a highlighted Frost Bolt. Non-frost returns null so restack
 * cannot treat Strike / Slow / Nova as an MP write. The tile is the
 * living hostile, not the caster.
 */
export function executePlayerFrostBoltCast(args: {
  currentAp: number;
  cooldownTurnsRemaining?: unknown;
  spell: SpellConfig;
  origin: PlayerFrostBoltCastTile;
  target: PlayerFrostBoltCastTile;
  occupant: PlayerFrostBoltOccupant | null;
  liveCombatants: Enemy[];
  mapTiles: TileType[][];
  effectiveRange?: number;
  barrierTiles?: BarrierTiles;
}): PlayerFrostBoltExecute | null {
  if (!canExecutePlayerFrostBoltCast(args) || !args.occupant) return null;
  const debuff = playerFrostBoltEffectFields(args.spell);
  if (!debuff) return null;
  return {
    tile: { x: args.target.x, y: args.target.y },
    targetId: args.occupant.id,
    debuff,
  };
}
