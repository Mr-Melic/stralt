/**
 * Player Frost Nova advertised MP vs the damage-then-return execute arms.
 *
 * Catalog Frost Nova (`spell-frost-nova`) is `spellType: "damage"`,
 * `damage: 15`, `hitsMultiple: true`, `targetType: "area"`, `range: 1`,
 * `areaRadius: 2`, `apCost: 4`, `debuffStat: "mp"`, `debuffModifier: -1`,
 * `debuffDuration: 1`. Description: "AoE ice burst around caster — deals
 * 15 damage and slows all nearby". Mouse / sprite / touch / keyboard /
 * Attack Nearest paint the tile through `computeTargetableTiles` ===
 * `isTileCastableLive` (Chebyshev vs `spellRangeBase` plus `areaRadius`
 * expansion, player LoS only when `!!lineOfSight`).
 *
 * Execute then:
 *   1. `resolvePlayerCast` enters the damage loop because
 *      `hitsMultiple` (`spellEngine.ts` ~876) and **returns "cast"** —
 *      it never reads `debuffStat`.
 *   2. `getAoETargets` splashes living hostiles within Chebyshev
 *      `spellRangeBase` of the **click** (not preview `areaRadius` — that
 *      would rebalance Nova / Lifesteal Nova).
 *   3. `resolveSpellCast` takes `damage > 0` and **returns** before the
 *      `debuffStat` arm. applyCast does the same.
 *
 * WX enemy apply (~16594) and WX boss apply (~15907) already copy nested
 * `debuffStat` after the hit (#762). Player-bar / control / applyCast
 * therefore spend 4 AP and deal 15 without writing MP on any splash
 * victim. `getStatModifier` MP stays 0. Summon kits omit Frost Nova;
 * `SUMMON_AP` max 2 cannot afford AP 4 anyway.
 *
 * Intended previous: a highlighted legal click with a living hostile in
 * the hitsMultiple splash meant damage **and** the advertised −1 MP / 1
 * on every splash victim, the same payload WX enemy Frost Nova still
 * writes. #905 owns single-target Frost Bolt (`targetType: "enemy"`, not
 * `hitsMultiple`). #543 owns Lifesteal Nova empty-anchor drain. #562 owns
 * the hitsMultiple live-victim gate. #555 restacks `resolvePlayerCast`
 * onto `playerDamageDebuff.ts` (Frost / Nova / Drain) — this sidecar is
 * the highlight / AP / splash execute gate and must not restack
 * spellEngine. #913 owns Expose `res_sp`. #915 owns Cursed Wound
 * `healRecv`.
 *
 * This module is that execute gate. `shouldHighlightPlayerFrostNovaCast`
 * === `canExecutePlayerFrostNovaCast` (`planPlayerCastAttempt` AP +
 * cooldown + live area geometry, plus at least one `isActiveHostile` in
 * the hitsMultiple splash). Empty Strike-like / far `areaRadius`
 * expansion tiles stay painted by the live ring; advertised MP cannot
 * land without a splash victim. Do not switch splash radius to
 * `areaRadius` (would rebalance). Do not steal Frost Bolt (#905),
 * Lifesteal Nova (#543), Expose (#913), Cursed Wound (#915), Slow /
 * Weaken (#528/#878), or Drain Courage. Do not require `spell.name`.
 *
 * Unique vs #528/#543/#555/#562/#762/#878/#905/#913/#915.
 * WorldExploration / enemyAI / summonExecutor / targeting / spellEngine
 * / statusEffects / castHelpers left untouched so older open PRs stay
 * merge-clean. Restack the three damage-return arms onto
 * `executePlayerFrostNovaCast` after those PRs land.
 */

import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import { isActiveHostile } from "./battleSetup.ts";
import { planPlayerCastAttempt } from "./playerCastPlan.ts";
import {
  type BarrierTiles,
  type CasterPosition,
  type TileType,
  canAffordCastAp,
  hitsMultipleIncludesOccupant,
  resolveCastApCost,
  spellRangeBase,
} from "./targeting.ts";

export type PlayerFrostNovaCastSpell =
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
      | "areaRadius"
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
      areaRadius?: unknown;
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

export type PlayerFrostNovaCastTile = CasterPosition;

export type PlayerFrostNovaOccupant = {
  id: string;
  x: number;
  y: number;
  hp: number;
  isSummon?: boolean;
  side?: "player" | "enemy";
};

export type PlayerFrostNovaFields = {
  stat: string;
  modifier: number;
  duration: number;
};

export type PlayerFrostNovaExecute = {
  tile: PlayerFrostNovaCastTile;
  victims: string[];
  debuff: PlayerFrostNovaFields;
};

export type PlayerFrostNovaLiveKind = "damage" | "debuff" | "drain" | "heal";

/**
 * Catalog AoE damage+MP kits. `hitsMultiple` + `targetType === "area"` +
 * `debuffStat === "mp"` + `damage > 0` is the live Frost Nova shape — do
 * not require `spellType === "debuff"` or the display name. Frost Bolt
 * stays on #905 (single-target `enemy`, not `hitsMultiple`). Lifesteal
 * Nova stays on #543 (drain arm, no `debuffStat`). Slow / Weaken are
 * 0-damage.
 */
export function isPlayerFrostNovaCastSpell(
  spell: PlayerFrostNovaCastSpell,
): boolean {
  if (spell.hitsMultiple !== true) return false;
  if ((spell.targetType ?? "enemy") !== "area") return false;
  if (spell.debuffStat !== "mp") return false;
  if (Number(spell.damage ?? 0) <= 0) return false;
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

export function playerFrostNovaCastApCost(
  spell: PlayerFrostNovaCastSpell,
): number {
  return resolveCastApCost(Number(spell.apCost ?? 0));
}

export function canAffordPlayerFrostNovaCast(
  currentAp: number,
  spell: PlayerFrostNovaCastSpell,
): boolean {
  return canAffordCastAp(currentAp, Number(spell.apCost ?? 0));
}

/**
 * Player highlight range (anchor Chebyshev). Splash radius is this same
 * number — not `areaRadius`. Do not use `enemySpellRange` here.
 */
export function playerFrostNovaCastRange(
  spell: PlayerFrostNovaCastSpell,
): number {
  return spellRangeBase(spell as Pick<SpellConfig, "range" | "maxRange">);
}

/** Preview footprint only. Execute splash must not use this (#543 / Nova). */
export function playerFrostNovaPreviewAreaRadius(
  spell: PlayerFrostNovaCastSpell,
): number {
  return Math.max(0, Math.floor(Number(spell.areaRadius ?? 0)));
}

/**
 * Live `resolveSpellCast` / applyCast / `resolvePlayerCast` damage-loop
 * branch order. Frost Nova yields `["damage"]` — there is no nested
 * `debuffStat` after the hit the way WX enemy / boss apply still copies.
 */
export function playerFrostNovaLiveResolveKinds(
  spell: PlayerFrostNovaCastSpell,
): PlayerFrostNovaLiveKind[] {
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

/** Advertised Frost Nova payload. Bolt / Drain / Slow / Expose return null. */
export function playerFrostNovaEffectFields(
  spell: PlayerFrostNovaCastSpell,
): PlayerFrostNovaFields | null {
  if (!isPlayerFrostNovaCastSpell(spell) || !spell.debuffStat) return null;
  return {
    stat: spell.debuffStat,
    modifier: Number(spell.debuffModifier ?? 1),
    duration: Math.max(1, Math.floor(Number(spell.debuffDuration) || 0)),
  };
}

export function playerFrostNovaAdvertisedKinds(
  spell: PlayerFrostNovaCastSpell,
): PlayerFrostNovaLiveKind[] {
  if (!isPlayerFrostNovaCastSpell(spell)) {
    return playerFrostNovaLiveResolveKinds(spell);
  }
  return ["damage", "debuff"];
}

/** WX enemy apply (~16594) already nests `debuffStat` after the hit (#762). */
export function playerFrostNovaWxEnemyAppliesNestedDebuff(): boolean {
  return true;
}

/** WX boss apply (~15907) already nests `debuffStat` after the hit. */
export function playerFrostNovaWxBossAppliesNestedDebuff(): boolean {
  return true;
}

export function isPlayerFrostNovaHostileOccupant(
  occupant: PlayerFrostNovaOccupant | null,
): boolean {
  if (!occupant) return false;
  return isActiveHostile({
    hp: occupant.hp,
    isSummon: occupant.isSummon,
    side: occupant.side,
    id: occupant.id,
  });
}

/**
 * Living hostiles `getAoETargets` would splash from `click`. Radius is
 * {@link playerFrostNovaCastRange}, not preview `areaRadius`.
 */
export function playerFrostNovaSplashVictims(args: {
  spell: PlayerFrostNovaCastSpell;
  click: PlayerFrostNovaCastTile;
  liveCombatants: readonly PlayerFrostNovaOccupant[];
}): PlayerFrostNovaOccupant[] {
  const radius = playerFrostNovaCastRange(args.spell);
  return args.liveCombatants.filter(
    (occupant) =>
      isPlayerFrostNovaHostileOccupant(occupant) &&
      hitsMultipleIncludesOccupant(occupant, args.click, radius),
  );
}

export function canExecutePlayerFrostNovaCast(args: {
  currentAp: number;
  cooldownTurnsRemaining?: unknown;
  spell: SpellConfig;
  origin: PlayerFrostNovaCastTile;
  target: PlayerFrostNovaCastTile;
  occupant?: PlayerFrostNovaOccupant | null;
  liveCombatants: Enemy[];
  mapTiles: TileType[][];
  effectiveRange?: number;
  barrierTiles?: BarrierTiles;
}): boolean {
  if (!isPlayerFrostNovaCastSpell(args.spell)) return false;
  if (
    playerFrostNovaSplashVictims({
      spell: args.spell,
      click: args.target,
      liveCombatants: args.liveCombatants,
    }).length === 0
  ) {
    return false;
  }
  const plan = planPlayerCastAttempt({
    spell: args.spell,
    caster: args.origin,
    tile: args.target,
    liveCombatants: args.liveCombatants,
    mapTiles: args.mapTiles,
    effectiveRange: args.effectiveRange ?? playerFrostNovaCastRange(args.spell),
    barrierTiles: args.barrierTiles,
    currentAp: args.currentAp,
    baseApCost: Number(args.spell.apCost ?? 0),
    cooldownTurnsRemaining: args.cooldownTurnsRemaining ?? 0,
  });
  return plan.ok;
}

/** Alias so highlight and execute cannot fork. */
export function shouldHighlightPlayerFrostNovaCast(
  args: Parameters<typeof canExecutePlayerFrostNovaCast>[0],
): boolean {
  return canExecutePlayerFrostNovaCast(args);
}

export function playerFrostNovaHighlightedTargetIsExecutable(args: {
  highlighted: boolean;
  executable: boolean;
}): boolean {
  return args.highlighted === true && args.executable === true;
}

/**
 * Execute a highlighted Frost Nova. Non-nova returns null so restack
 * cannot treat Strike / Bolt / Expose / Drain as an AoE MP write. Splash
 * victims are living hostiles within Chebyshev `spellRangeBase` of the
 * click. Catalog modifier stays −1 — do not convert into a multiplier.
 */
export function executePlayerFrostNovaCast(args: {
  currentAp: number;
  cooldownTurnsRemaining?: unknown;
  spell: SpellConfig;
  origin: PlayerFrostNovaCastTile;
  target: PlayerFrostNovaCastTile;
  occupant?: PlayerFrostNovaOccupant | null;
  liveCombatants: Enemy[];
  mapTiles: TileType[][];
  effectiveRange?: number;
  barrierTiles?: BarrierTiles;
}): PlayerFrostNovaExecute | null {
  if (!canExecutePlayerFrostNovaCast(args)) return null;
  const debuff = playerFrostNovaEffectFields(args.spell);
  if (!debuff) return null;
  const victims = playerFrostNovaSplashVictims({
    spell: args.spell,
    click: args.target,
    liveCombatants: args.liveCombatants,
  }).map((occupant) => occupant.id);
  if (victims.length === 0) return null;
  return {
    tile: { x: args.target.x, y: args.target.y },
    victims,
    debuff,
  };
}
