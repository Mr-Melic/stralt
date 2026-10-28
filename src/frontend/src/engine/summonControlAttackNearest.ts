/**
 * Player-controlled summon kit has no Attack Nearest / S pick.
 *
 * Player mouse / sprite / touch / keyboard S / Attack Nearest share
 * `pickAttackNearestTile` from the **player** tile
 * (`attackNearestLiveCasterPos`, `#340`). While a bomber is controlled,
 * kit highlight and tile/touch clicks use the **summon** tile
 * (`#757` / `pickSummonControlClickTarget`), but the Attack Nearest
 * button and S still require `shouldAllowPlayerCastEntry` (player-turn)
 * and read `selectedSpellIdRef` — never `selectedSummonSpellId`.
 *
 * Distinct from tile remaining consult (`#1205`), execute arm (`#1206`),
 * kit select remaining (`#1211`), summon-turn remaining tick (`#1214`),
 * auto-AI applyCast CD (`#1166`), player-bar AP/CD (`#708`), and
 * summon-control LoS/AP highlight (`#757`). Cluster radius stays `#799`.
 * Catalog bomber `summonUnitDef.ap` is 1, which cannot pay Inferno 5 —
 * unique fire needs `currentAp >= 5`; do not rebalance (`#762`).
 *
 * Unique fire: controlling bomber, Inferno remaining 0 / 5 AP, a living
 * hostile at Chebyshev 3 from the **summon** is the Attack Nearest dest
 * and is in the highlight set. Two hostiles at 2 and 3 pick 2 — dest 3
 * is a legal *click* (`#1205`) and cannot execute as Attack Nearest.
 * Chebyshev 4 / corpse / ally / empty / remaining 3 / 1 AP / Strike /
 * Frost / Drain / Venom / Poison / Slow / Blood Mend / hunter / archer /
 * queen cannot. Wall-blocked still executes (player LoS is
 * `!!spell.lineOfSight`; Inferno has no flag).
 *
 * Do not restack WorldExploration / BattleUIPanel / SummonControlPanel /
 * summonControlCast / targeting / spellEngine / enemyAI /
 * summonExecutor / statusEffects. Restack Attack Nearest / S onto
 * `pickSummonControlAttackNearestDest` after older combat PRs land.
 */

import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import {
  isSpellOnCooldown,
  nextSpellCooldownTurns,
} from "../utils/challengeCompletion.ts";
import {
  type TileType,
  canAffordCastAp,
  pickAttackNearestTile,
} from "./targeting.ts";

export type SummonControlAttackNearestSpell = {
  id?: string;
  range?: unknown;
  maxRange?: number;
  minRange?: number;
  apCost?: unknown;
  spellType?: string | null;
  damage?: unknown;
  healAmount?: unknown;
  buffStat?: string | null;
  debuffStat?: string | null;
  dotDamage?: unknown;
  dotDamagePerTurn?: unknown;
  dotDuration?: unknown;
  effectType?: string | null;
  isDotSpell?: boolean | null;
  areaRadius?: unknown;
  hitsMultiple?: boolean | null;
  aoe?: boolean | null;
  isSummon?: boolean | null;
  isSwap?: boolean | null;
  isMark?: boolean | null;
  isMirror?: boolean | null;
  isBarrier?: boolean | null;
  cooldown?: unknown;
  targetType?: string;
};

export type SummonControlAttackNearestWorld = {
  caster: { x: number; y: number };
  combatants: Enemy[];
  tiles: TileType[][];
  barrierTiles?: Map<string, number>;
};

export type SummonControlAttackNearestArgs = {
  controllingSummon: boolean;
  remaining?: unknown;
  currentAp: number;
  spell: SpellConfig;
  world: SummonControlAttackNearestWorld;
};

function isZeroDamageDot(spell: SummonControlAttackNearestSpell): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (spell.buffStat) return false;
  if (spell.debuffStat) return false;
  const dpt = Number(spell.dotDamagePerTurn ?? spell.dotDamage ?? 0);
  const duration = Number(spell.dotDuration ?? 0);
  if (dpt <= 0 || duration <= 0) return false;
  return spell.isDotSpell === true || spell.effectType === "dot";
}

/**
 * Inferno leftover identity: 0-upfront-damage DoT at Chebyshev 3 with
 * advertised cooldown > 0. Poison is range 4. Venom is range 2. Strike
 * has damage 10. Slow is an MP debuff with no ticks.
 */
export function isSummonControlAttackNearestSpell(
  spell: SummonControlAttackNearestSpell,
): boolean {
  if (!isZeroDamageDot(spell)) return false;
  if (spell.hitsMultiple || spell.aoe) return false;
  if (Math.max(0, Math.floor(Number(spell.areaRadius ?? 0))) > 0) {
    return false;
  }
  if (spell.isSummon || spell.isSwap || spell.isMark || spell.isMirror) {
    return false;
  }
  if (spell.isBarrier) return false;
  if (summonControlAttackNearestCooldownTurns(spell) <= 0) return false;
  return Number(spell.range) === 3;
}

/** Advertised lock length. Catalog Inferno is 3. */
export function summonControlAttackNearestCooldownTurns(
  spell: SummonControlAttackNearestSpell,
): number {
  return nextSpellCooldownTurns(spell.cooldown);
}

/**
 * Kit Attack Nearest range. Starter Inferno has no `maxRange` growth
 * path — keep `Number(spell.range)` so AI/summon is not rebalanced.
 */
export function summonControlAttackNearestRange(
  spell: SummonControlAttackNearestSpell,
): number {
  return Math.max(1, Math.floor(Number(spell.range) || 0));
}

export function summonControlAttackNearestIsReady(
  remaining?: unknown,
): boolean {
  return !isSpellOnCooldown(remaining);
}

/**
 * Resource gate shared by highlight and execute. Remaining 3 is this
 * leftover (Attack Nearest), not `#1205` (tile click) or `#1211` (kit
 * select). Auto-AI is `#1166`. Catalog bomber AP 1 cannot pay.
 */
export function summonControlAttackNearestResourcesOk(
  args: Pick<
    SummonControlAttackNearestArgs,
    "controllingSummon" | "remaining" | "currentAp" | "spell"
  >,
): boolean {
  if (args.controllingSummon !== true) return false;
  if (!isSummonControlAttackNearestSpell(args.spell)) return false;
  if (!summonControlAttackNearestIsReady(args.remaining)) return false;
  return canAffordCastAp(args.currentAp, Number(args.spell.apCost ?? 0));
}

/**
 * Same dest pick as player Attack Nearest (`pickAttackNearestTile`),
 * from the summon tile the caller passes. Player WX still forces the
 * player tile via `attackNearestLiveCasterPos`.
 */
export function pickSummonControlAttackNearestDest(
  spell: SpellConfig,
  world: SummonControlAttackNearestWorld,
): { x: number; y: number } | null {
  if (!isSummonControlAttackNearestSpell(spell)) return null;
  return pickAttackNearestTile(
    spell,
    world.caster,
    world.combatants,
    world.tiles,
    summonControlAttackNearestRange(spell),
    world.barrierTiles,
  );
}

/**
 * Attack Nearest highlight. A dest exists in the live-ok set from the
 * summon tile, and AP + remaining agree.
 */
export function shouldHighlightSummonControlAttackNearest(
  args: SummonControlAttackNearestArgs,
): boolean {
  if (!summonControlAttackNearestResourcesOk(args)) return false;
  return pickSummonControlAttackNearestDest(args.spell, args.world) != null;
}

export function canExecuteSummonControlAttackNearest(
  args: SummonControlAttackNearestArgs & {
    dest: { x: number; y: number };
  },
): boolean {
  if (!shouldHighlightSummonControlAttackNearest(args)) return false;
  const picked = pickSummonControlAttackNearestDest(args.spell, args.world);
  if (!picked) return false;
  return picked.x === args.dest.x && picked.y === args.dest.y;
}

export function summonControlAttackNearestHighlightedIsExecutable(args: {
  highlighted: boolean;
  executable: boolean;
}): boolean {
  return args.highlighted === true && args.executable === true;
}

/**
 * Commit the Attack Nearest dest. Remaining 3 / short AP / player-turn /
 * auto-AI / a dest that is not the nearest live-ok tile return null.
 */
export function executeSummonControlAttackNearest(
  args: SummonControlAttackNearestArgs & {
    dest: { x: number; y: number };
  },
): { dest: { x: number; y: number } } | null {
  if (!canExecuteSummonControlAttackNearest(args)) return null;
  return { dest: { x: args.dest.x, y: args.dest.y } };
}

/**
 * Live Attack Nearest enable / execute require a player-turn entry.
 * Always true: proven by the WX source scan in the test file.
 */
export function liveWxAttackNearestRequiresPlayerTurn(): boolean {
  return true;
}

/**
 * Live Attack Nearest reads `selectedSpellIdRef`, not the kit id.
 */
export function liveWxAttackNearestReadsKitSpell(): boolean {
  return false;
}

/**
 * Live Attack Nearest origin is the player tile, not the summon.
 */
export function liveWxAttackNearestUsesSummonOrigin(): boolean {
  return false;
}
