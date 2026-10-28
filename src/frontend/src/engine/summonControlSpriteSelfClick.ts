/**
 * Player-controlled summon kit has no sprite-first dest for self/ally
 * (`kind === "summon"`) sprites.
 *
 * Player mouse / sprite / touch share `hitTestSprite` (pad 10 / 14) before
 * `clientToGrid` so a body drawn at `CHARACTER_Y_OFFSET` above the diamond
 * still casts at the entity's logical tile. While a summon is controlled,
 * `shouldRouteCanvasToSummonControl` runs first and **returns** after
 * `clientToGrid` + `pickSummonControlClickTarget` (`#757`). Sprite-first
 * never runs. `#1260` prefers living **enemy** sprites only. Player-side
 * summons are tagged `kind: "summon"` (`enemy.side === "player"`). Blood
 * Mend / Rallying Cry require the caster tile; Shield / Iron Skin require
 * a living player-side summon. A pointer that hits the summon body but
 * whose diamond tile is an empty neighbour drops the kit cast.
 *
 * Distinct from enemy-sprite dest (`#1260`), Attack Nearest / S dest
 * (`#1238`), tile remaining consult (`#1205`), execute arm (`#1206`), kit
 * select remaining (`#1211`), summon-turn remaining tick (`#1214`), and
 * LoS/AP highlight (`#757`). Catalog wisp `summonUnitDef.ap` is 2, which
 * cannot pay Blood Mend 3 — unique fire needs `currentAp >= 3`; do not
 * rebalance (`#762`).
 *
 * Unique fire: controlling wisp, Blood Mend selected, the wisp sprite
 * rect contains the pointer while `clientToGrid` landed on an empty
 * neighbour. Live click target is null. Sprite dest is the caster tile
 * and is in the highlight set. Enemy sprite / corpse / empty / no kit /
 * player turn / Inferno / Strike / Frost / Venom / Poison / bomber
 * cannot as this leftover.
 *
 * Do not restack WorldExploration / BattleUIPanel / SummonControlPanel /
 * summonControlCast / targeting / spellEngine. Restack summon-control
 * mouse/touch onto `pickSummonControlSelfSpriteClickTile` after older
 * combat PRs land.
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import {
  type SummonKitCatalogSpell,
  pickSummonControlClickTarget,
} from "../utils/summonControlCast.ts";
import type { TileType } from "./targeting.ts";

/** Live spriteRectsRef kind for a player-side summon. */
export const SUMMON_CONTROL_SELF_SPRITE_KIND = "summon";

export type SummonControlSelfSpriteHit = {
  kind: string;
  logicalX: number;
  logicalY: number;
  isAlive?: boolean;
} | null;

export type SummonControlSelfSpriteClickArgs = {
  routedToSummonControl: boolean;
  selectedKitSpellId: string | null | undefined;
  spriteHit: SummonControlSelfSpriteHit;
  gridTile: { x: number; y: number } | null;
};

/**
 * Player-side summon sprite identity. Do not treat `"enemy"` (`#1260`) or
 * `"player"` (Blood Mend on the champion, `decideSpriteCastClick`) as this
 * dest.
 */
export function isSummonControlSelfSpriteKind(kind: string): boolean {
  return kind === SUMMON_CONTROL_SELF_SPRITE_KIND;
}

/**
 * Prefer the sprite's logical tile when summon-control has a kit selected
 * and the pointer hit a living player-side summon sprite. Walk (no kit),
 * player-turn, and enemy-sprite dest (`#1260`) keep the diamond tile.
 */
export function shouldPreferSummonControlSelfSpriteLogicalTile(
  args: Omit<SummonControlSelfSpriteClickArgs, "gridTile">,
): boolean {
  if (args.routedToSummonControl !== true) return false;
  if (!args.selectedKitSpellId) return false;
  const hit = args.spriteHit;
  if (!hit) return false;
  if (!isSummonControlSelfSpriteKind(hit.kind)) return false;
  if (hit.isAlive === false) return false;
  return Number.isFinite(hit.logicalX) && Number.isFinite(hit.logicalY);
}

/**
 * Sprite-first dest for a summon-control self/ally kit click. Live WX
 * still uses `clientToGrid` only; restack replaces that tile with this
 * return.
 */
export function pickSummonControlSelfSpriteClickTile(
  args: SummonControlSelfSpriteClickArgs,
): { x: number; y: number } | null {
  if (shouldPreferSummonControlSelfSpriteLogicalTile(args)) {
    const hit = args.spriteHit;
    if (!hit) return args.gridTile;
    return { x: hit.logicalX, y: hit.logicalY };
  }
  return args.gridTile;
}

export type SummonControlSelfSpriteClickWorld<
  T extends { x: number; y: number },
> = {
  caster: T;
  combatants: T[];
  tiles: TileType[][];
  barrierTiles?: Map<string, number>;
};

/**
 * Occupant the kit click should pass to resolveSpellCast, from the
 * self/ally sprite dest when it applies. Same live gate as a legal tile
 * click (`pickSummonControlClickTarget`).
 */
export function executeSummonControlSelfSpriteClick<
  T extends {
    id: string;
    x: number;
    y: number;
    hp?: number;
    side?: string;
    isSummon?: boolean;
  },
>(
  args: SummonControlSelfSpriteClickArgs & {
    spell:
      | (Pick<SummonKitCatalogSpell, "targetType"> & Partial<SpellConfig>)
      | null
      | undefined;
    world: SummonControlSelfSpriteClickWorld<T>;
  },
): T | null {
  if (args.routedToSummonControl !== true) return null;
  if (!args.selectedKitSpellId || !args.spell) return null;
  const tile = pickSummonControlSelfSpriteClickTile(args);
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

/** Highlighted self/ally sprite dest is executable when the click target matches. */
export function summonControlSelfSpriteClickHighlightedIsExecutable(args: {
  highlighted: boolean;
  executable: boolean;
}): boolean {
  return args.highlighted === true && args.executable === true;
}
