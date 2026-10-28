/**
 * Player-controlled summon kit has no sprite-first dest pick.
 *
 * Player mouse / sprite / touch share `hitTestSprite` (pad 10 / 14) before
 * `clientToGrid` so a body drawn at `CHARACTER_Y_OFFSET` above the diamond
 * still casts at the entity's logical tile. While a summon is controlled,
 * `shouldRouteCanvasToSummonControl` runs first and **returns** after
 * `clientToGrid` + `pickSummonControlClickTarget` (`#757`). Sprite-first
 * never runs. A pointer that hits the sprite rect but whose diamond tile
 * is empty (or a neighbour) drops the kit cast.
 *
 * Distinct from Attack Nearest / S dest (`#1238`), tile remaining
 * consult (`#1205`), execute arm (`#1206`), kit select remaining
 * (`#1211`), summon-turn remaining tick (`#1214`), and LoS/AP highlight
 * (`#757`). Catalog bomber `summonUnitDef.ap` is 1, which cannot pay
 * Inferno 5 — unique fire needs `currentAp >= 5`; do not rebalance
 * (`#762`).
 *
 * Unique fire: controlling bomber, Inferno selected, a living hostile
 * at Chebyshev 3 whose sprite rect contains the pointer while
 * `clientToGrid` landed on an empty neighbour. Live click target is
 * null. Sprite dest is the hostile's logical tile and is in the
 * highlight set. Chebyshev 4 / corpse / ally / empty / no kit / player
 * turn / hunter Venom / archer Poison cannot as this leftover.
 *
 * Do not restack WorldExploration / BattleUIPanel / SummonControlPanel /
 * summonControlCast / targeting / spellEngine. Restack summon-control
 * mouse/touch onto `pickSummonControlSpriteClickTile` after older combat
 * PRs land.
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import {
  type SummonKitCatalogSpell,
  pickSummonControlClickTarget,
} from "../utils/summonControlCast.ts";
import type { TileType } from "./targeting.ts";

/** Live `hitTestSprite` mouse pad (`handleCanvasClick`). */
export const SUMMON_CONTROL_SPRITE_PAD_MOUSE = 10;

/** Live `hitTestSprite` touch pad (`handleCanvasTouch`). */
export const SUMMON_CONTROL_SPRITE_PAD_TOUCH = 14;

export type SummonControlSpriteHit = {
  kind: string;
  logicalX: number;
  logicalY: number;
  isAlive?: boolean;
} | null;

export type SummonControlSpriteClickArgs = {
  routedToSummonControl: boolean;
  selectedKitSpellId: string | null | undefined;
  spriteHit: SummonControlSpriteHit;
  gridTile: { x: number; y: number } | null;
};

/**
 * Prefer the sprite's logical tile when summon-control has a kit selected
 * and the pointer hit a living enemy sprite. Walk (no kit) and player-turn
 * keep the diamond tile. Ally / player sprites are Blood Mend leftovers,
 * not this dest.
 */
export function shouldPreferSummonControlSpriteLogicalTile(
  args: Omit<SummonControlSpriteClickArgs, "gridTile">,
): boolean {
  if (args.routedToSummonControl !== true) return false;
  if (!args.selectedKitSpellId) return false;
  const hit = args.spriteHit;
  if (!hit) return false;
  if (hit.kind !== "enemy") return false;
  if (hit.isAlive === false) return false;
  return Number.isFinite(hit.logicalX) && Number.isFinite(hit.logicalY);
}

/**
 * Sprite-first dest for a summon-control kit click. Live WX still uses
 * `clientToGrid` only; restack replaces that tile with this return.
 */
export function pickSummonControlSpriteClickTile(
  args: SummonControlSpriteClickArgs,
): { x: number; y: number } | null {
  if (shouldPreferSummonControlSpriteLogicalTile(args)) {
    const hit = args.spriteHit;
    if (!hit) return args.gridTile;
    return { x: hit.logicalX, y: hit.logicalY };
  }
  return args.gridTile;
}

export type SummonControlSpriteClickWorld<T extends { x: number; y: number }> =
  {
    caster: T;
    combatants: T[];
    tiles: TileType[][];
    barrierTiles?: Map<string, number>;
  };

/**
 * Occupant the kit click should pass to resolveSpellCast, from the
 * sprite-first dest when it applies. Same live gate as a legal tile
 * click (`pickSummonControlClickTarget`).
 */
export function executeSummonControlSpriteClick<
  T extends {
    id: string;
    x: number;
    y: number;
    hp?: number;
    side?: string;
    isSummon?: boolean;
  },
>(
  args: SummonControlSpriteClickArgs & {
    spell:
      | (Pick<SummonKitCatalogSpell, "targetType"> & Partial<SpellConfig>)
      | null
      | undefined;
    world: SummonControlSpriteClickWorld<T>;
  },
): T | null {
  if (args.routedToSummonControl !== true) return null;
  if (!args.selectedKitSpellId || !args.spell) return null;
  const tile = pickSummonControlSpriteClickTile(args);
  if (!tile) return null;
  return pickSummonControlClickTarget({
    spell: args.spell,
    caster: args.world.caster,
    tile,
    combatants: args.world.combatants,
    tiles: args.world.tiles,
    barrierTiles: args.world.barrierTiles,
  });
}

/**
 * Live summon-control routing returns before sprite-first. Proven by the
 * WX source scan in the test file.
 */
export function liveWxSummonControlRunsSpriteFirst(): boolean {
  return false;
}

/** Live mouse pad. Always 10: proven by the WX source scan. */
export function liveWxSummonControlSpritePadMouse(): number {
  return SUMMON_CONTROL_SPRITE_PAD_MOUSE;
}

/** Live touch pad. Always 14: proven by the WX source scan. */
export function liveWxSummonControlSpritePadTouch(): number {
  return SUMMON_CONTROL_SPRITE_PAD_TOUCH;
}

/** Enemy-sprite pad identity. Do not merge mouse 10 with touch 14. */
export function isSummonControlSpriteClickPad(
  padding: number,
  pointer: "mouse" | "touch",
): boolean {
  return pointer === "touch"
    ? padding === SUMMON_CONTROL_SPRITE_PAD_TOUCH
    : padding === SUMMON_CONTROL_SPRITE_PAD_MOUSE;
}

/** Highlighted sprite dest is executable when the click target matches. */
export function summonControlSpriteClickHighlightedIsExecutable(args: {
  highlighted: boolean;
  executable: boolean;
}): boolean {
  return args.highlighted === true && args.executable === true;
}
