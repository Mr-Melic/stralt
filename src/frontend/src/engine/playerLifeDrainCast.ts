/**
 * Player Life Drain advertised SP vs the drain-then-return execute arms.
 *
 * Catalog Life Drain (`starter-drain`) is `spellType: "drain"`,
 * `effectType: "drain"`, `damage: 10`, `healAmount: 5`, `debuffStat: "sp"`,
 * `debuffModifier: 0.8`, `debuffDuration: 2`, `range: 2`, `apCost: 3`,
 * `targetType: "enemy"`, not `hitsMultiple`. Description: "Drain 10 HP from
 * enemy and gain 5 HP, reduce target SP by 20% for 2 turns". Mouse /
 * sprite / touch / keyboard / Attack Nearest paint the tile through
 * `computeTargetableTiles` === `isTileCastableLive` (Chebyshev vs
 * `spellRangeBase`, player LoS only when `!!lineOfSight`).
 *
 * Execute then:
 *   1. `resolvePlayerCast` enters the damage loop because `targetEnemy`
 *      (`spellEngine.ts` ~876) and **returns "cast"** — it never reads
 *      `debuffStat`. Drain heal is `applyDamageToEnemy` (`#440`).
 *   2. `resolveSpellCast` takes `damage > 0 && isDrain` and **returns**
 *      before the `debuffStat` arm (~448–548).
 *   3. `executeSummonAction` applyCast deals `damage > 0` and **returns**
 *      before `applyEffect` (no `debuffStat` / `debuffModifier`).
 *
 * WX enemy apply already copies nested `debuffStat` after the hit (#762).
 * Boss kit Starved Vampire Pawn first-id Life Drain also writes `sp` on
 * the player (WX ~15907). Player-bar / control / applyCast therefore
 * spend AP, deal 10, and heal without writing `sp` on the clicked
 * hostile. `getStatModifier` products type-"debuff" rows with
 * `stat === "sp"` (multiplicative; no #658 mapping needed), so a
 * follow-up enemy/player SP shred stays at 1.0. Summon kits do not
 * include Life Drain; `SUMMON_AP` max 2 cannot afford AP 3 anyway.
 *
 * Intended previous: a highlighted living hostile meant drain **and** the
 * advertised −20% SP / 2, the same payload WX enemy / boss kit Life Drain
 * still writes. Incoming enemy spells already consume player `sp`
 * (`getStatModifier("player", "sp")` at WX ~16478). #440 owns Life Drain
 * HP restore. #543 owns Lifesteal Nova empty-anchor drain. #562 owns the
 * drain occupant live gate. #555 restacks `resolvePlayerCast` onto
 * `playerDamageDebuff.ts` (Frost / Nova / Drain / Cursed Wound / Expose
 * as a combined helper) — this sidecar is the highlight / AP / occupant
 * execute gate and must not restack spellEngine. #905 owns Frost Bolt MP
 * (`debuffStat === "mp"`). #913 owns Expose / Shadow Veil (`res_sp`).
 * #915 owns Cursed Wound (`healRecv`). #917 owns Frost Nova AoE MP.
 *
 * This module is that execute gate. `shouldHighlightPlayerLifeDrainCast`
 * === `canExecutePlayerLifeDrainCast` (`planPlayerCastAttempt` AP +
 * cooldown + live geometry, plus `isActiveHostile` on the clicked
 * occupant). Empty Strike-like rings stay painted; advertised SP cannot
 * land without a living hostile. Do not switch enemy/summon range to
 * `spellRangeBase` (would rebalance). Do not steal Frost Bolt (#905),
 * Expose / Shadow Veil (#913), Cursed Wound (#915), Frost Nova (#917),
 * Slow / Weaken (#528/#878), Drain Courage (`debuffStat === "ap"`), or
 * Lifesteal Nova (#543). Do not require `spell.name`.
 *
 * Unique vs #440/#528/#543/#555/#562/#762/#878/#905/#913/#915/#917.
 * WorldExploration / enemyAI / summonExecutor / targeting / spellEngine
 * / statusEffects / castHelpers left untouched so older open PRs stay
 * merge-clean. Restack the three drain-return arms onto
 * `executePlayerLifeDrainCast` after those PRs land.
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

export type PlayerLifeDrainCastSpell =
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

export type PlayerLifeDrainCastTile = CasterPosition;

export type PlayerLifeDrainOccupant = {
  id: string;
  x: number;
  y: number;
  hp: number;
  isSummon?: boolean;
  side?: "player" | "enemy";
};

export type PlayerLifeDrainFields = {
  stat: string;
  modifier: number;
  duration: number;
};

export type PlayerLifeDrainExecute = {
  tile: PlayerLifeDrainCastTile;
  targetId: string;
  debuff: PlayerLifeDrainFields;
};

export type PlayerLifeDrainLiveKind = "damage" | "debuff" | "drain" | "heal";

function isDrainSpell(spell: PlayerLifeDrainCastSpell): boolean {
  if ((spell.spellType ?? "") === "drain") return true;
  return String(spell.effectType ?? "")
    .toLowerCase()
    .includes("drain");
}

/**
 * Catalog single-target drain+SP kits. `debuffStat === "sp"` plus drain
 * plus `damage > 0` is the live Life Drain shape — do not require
 * `spellType === "debuff"` (catalog uses `"drain"`) or the display name.
 * Drain Courage stays off this arm (`debuffStat === "ap"`). Lifesteal
 * Nova stays on #543 (`hitsMultiple`, no `debuffStat`). Frost Bolt stays
 * on #905 (`mp`, not drain).
 */
export function isPlayerLifeDrainCastSpell(
  spell: PlayerLifeDrainCastSpell,
): boolean {
  if (spell.debuffStat !== "sp") return false;
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

export function playerLifeDrainCastApCost(
  spell: PlayerLifeDrainCastSpell,
): number {
  return resolveCastApCost(Number(spell.apCost ?? 0));
}

export function canAffordPlayerLifeDrainCast(
  currentAp: number,
  spell: PlayerLifeDrainCastSpell,
): boolean {
  return canAffordCastAp(currentAp, Number(spell.apCost ?? 0));
}

/**
 * Player highlight range. Do not use `enemySpellRange` here — AI kits
 * stay on `Number(spell.range)` so they are not rebalanced.
 */
export function playerLifeDrainCastRange(
  spell: PlayerLifeDrainCastSpell,
): number {
  return spellRangeBase(spell as Pick<SpellConfig, "range" | "maxRange">);
}

/**
 * Live `resolveSpellCast` / applyCast / `resolvePlayerCast` drain-loop
 * branch order. Life Drain yields `["drain"]` — there is no nested
 * `debuffStat` after the hit the way WX enemy / boss kit apply still copies.
 */
export function playerLifeDrainLiveResolveKinds(
  spell: PlayerLifeDrainCastSpell,
): PlayerLifeDrainLiveKind[] {
  if (Number(spell.damage ?? 0) > 0 && isDrainSpell(spell)) return ["drain"];
  if (Number(spell.damage ?? 0) > 0) return ["damage"];
  if (Number(spell.healAmount ?? 0) > 0) return ["heal"];
  if (spell.debuffStat) return ["debuff"];
  return ["damage"];
}

/** Advertised Life Drain payload. Drain Courage / Nova / Frost return null. */
export function playerLifeDrainEffectFields(
  spell: PlayerLifeDrainCastSpell,
): PlayerLifeDrainFields | null {
  if (!isPlayerLifeDrainCastSpell(spell) || !spell.debuffStat) return null;
  return {
    stat: spell.debuffStat,
    modifier: Number(spell.debuffModifier ?? 1),
    duration: Math.max(1, Math.floor(Number(spell.debuffDuration) || 0)),
  };
}

export function playerLifeDrainAdvertisedKinds(
  spell: PlayerLifeDrainCastSpell,
): PlayerLifeDrainLiveKind[] {
  if (!isPlayerLifeDrainCastSpell(spell)) {
    return playerLifeDrainLiveResolveKinds(spell);
  }
  return ["drain", "debuff"];
}

/** WX enemy apply (~16594) already nests `debuffStat` after the hit (#762). */
export function playerLifeDrainWxEnemyAppliesNestedDebuff(): boolean {
  return true;
}

/** WX boss apply (~15907) already nests `debuffStat` after the hit. */
export function playerLifeDrainWxBossAppliesNestedDebuff(): boolean {
  return true;
}

export function isPlayerLifeDrainHostileOccupant(
  occupant: PlayerLifeDrainOccupant | null,
): boolean {
  if (!occupant) return false;
  return isActiveHostile({
    hp: occupant.hp,
    isSummon: occupant.isSummon,
    side: occupant.side,
    id: occupant.id,
  });
}

export function canExecutePlayerLifeDrainCast(args: {
  currentAp: number;
  cooldownTurnsRemaining?: unknown;
  spell: SpellConfig;
  origin: PlayerLifeDrainCastTile;
  target: PlayerLifeDrainCastTile;
  occupant: PlayerLifeDrainOccupant | null;
  liveCombatants: Enemy[];
  mapTiles: TileType[][];
  effectiveRange?: number;
  barrierTiles?: BarrierTiles;
}): boolean {
  if (!isPlayerLifeDrainCastSpell(args.spell)) return false;
  if (!args.occupant) return false;
  if (args.occupant.x !== args.target.x || args.occupant.y !== args.target.y) {
    return false;
  }
  if (!isPlayerLifeDrainHostileOccupant(args.occupant)) return false;
  const plan = planPlayerCastAttempt({
    spell: args.spell,
    caster: args.origin,
    tile: args.target,
    liveCombatants: args.liveCombatants,
    mapTiles: args.mapTiles,
    effectiveRange: args.effectiveRange ?? playerLifeDrainCastRange(args.spell),
    barrierTiles: args.barrierTiles,
    currentAp: args.currentAp,
    baseApCost: Number(args.spell.apCost ?? 0),
    cooldownTurnsRemaining: args.cooldownTurnsRemaining ?? 0,
  });
  return plan.ok;
}

/** Alias so highlight and execute cannot fork. */
export function shouldHighlightPlayerLifeDrainCast(
  args: Parameters<typeof canExecutePlayerLifeDrainCast>[0],
): boolean {
  return canExecutePlayerLifeDrainCast(args);
}

export function playerLifeDrainHighlightedTargetIsExecutable(args: {
  highlighted: boolean;
  executable: boolean;
}): boolean {
  return args.highlighted === true && args.executable === true;
}

/**
 * Execute a highlighted Life Drain. Non-drain returns null so restack
 * cannot treat Strike / Frost / Expose / Nova / Drain Courage as an SP
 * write. The tile is the living hostile, not the caster. Catalog `stat`
 * stays `"sp"` — incoming enemy spells already read that key on the
 * player; enemy outgoing SP consume is a separate leftover.
 */
export function executePlayerLifeDrainCast(args: {
  currentAp: number;
  cooldownTurnsRemaining?: unknown;
  spell: SpellConfig;
  origin: PlayerLifeDrainCastTile;
  target: PlayerLifeDrainCastTile;
  occupant: PlayerLifeDrainOccupant | null;
  liveCombatants: Enemy[];
  mapTiles: TileType[][];
  effectiveRange?: number;
  barrierTiles?: BarrierTiles;
}): PlayerLifeDrainExecute | null {
  if (!canExecutePlayerLifeDrainCast(args) || !args.occupant) return null;
  const debuff = playerLifeDrainEffectFields(args.spell);
  if (!debuff) return null;
  return {
    tile: { x: args.target.x, y: args.target.y },
    targetId: args.occupant.id,
    debuff,
  };
}
