/**
 * `swapPositions` exchanges the player with a target enemy and writes both
 * cells raw. Unique-bridge slide / dual-path 1+1 unseal live on occupancy.ts
 * but are never called, so a player standing on a corridor who swaps with a
 * pocket unit leaves that unit on the only (or last remaining) player→exit
 * route and the unlocked progression portal stays sealed.
 *
 * Unique extra vs occupancy.ts unique-bridge relocate / dual-path 1+1 unseal
 * (those run only when callers invoke `unsealProgressionOccupants`) and vs
 * destack/wander dump punches, choke-pocket snap, 2+2 joint peel, and
 * knockback landing (#589/#600/#603/#608/#628/#648/#651/#656/#688: those
 * are not a two-body swap).
 *
 * After the tentative exchange, relocate non-player occupants onto the
 * fight-graph flood from the player's new cell so a player→exit route
 * remains. Skip leftover-island hops (refuse a swap that would put the
 * player on a CA crumb). Not imported from occupancy.ts,
 * WorldExploration, or mapGen.simulate.ts — those files 3-way on the
 * oldest-first prefix. Property tests apply the helper after destack/wander.
 * Call after live `swapPositions` when that hunk lands.
 */

import {
  type OccCell,
  type OccupancyContext,
  collectOccupiedCells,
  findNearestFreeCell,
  occKey,
  occupantsSealProgression,
  progressionSearchRadius,
  unsealProgressionOccupants,
} from "./occupancy.ts";

const DIRS: [number, number][] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function gridSize(tiles: boolean[][]): { w: number; h: number } {
  return { h: tiles.length, w: tiles[0]?.length ?? 0 };
}

/**
 * Fight-graph flood from `start` (portals / voids / barriers are walls).
 * Occupants are not walls — dump alcoves must stay legal landings.
 */
export function floodSwapBattleGraph(
  ctx: OccupancyContext,
  start: OccCell,
): Set<string> {
  const { w, h } = gridSize(ctx.tiles);
  const walk = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return false;
    if (!ctx.tiles[y]?.[x]) return false;
    const k = occKey(x, y);
    if (ctx.voidTiles.has(k) || ctx.barriers.has(k) || ctx.portals.has(k)) {
      return false;
    }
    return true;
  };
  const starts: OccCell[] = [];
  if (walk(start.x, start.y)) {
    starts.push(start);
  } else {
    for (const [dx, dy] of DIRS) {
      const nx = start.x + dx;
      const ny = start.y + dy;
      if (walk(nx, ny)) starts.push({ x: nx, y: ny });
    }
  }
  const seen = new Set<string>();
  const q: OccCell[] = [];
  for (const s of starts) {
    const k = occKey(s.x, s.y);
    if (seen.has(k)) continue;
    seen.add(k);
    q.push(s);
  }
  while (q.length > 0) {
    const cur = q.shift()!;
    for (const [dx, dy] of DIRS) {
      const nx = cur.x + dx;
      const ny = cur.y + dy;
      const k = occKey(nx, ny);
      if (seen.has(k) || !walk(nx, ny)) continue;
      seen.add(k);
      q.push({ x: nx, y: ny });
    }
  }
  return seen;
}

export interface SwapUnsealResult {
  player: OccCell;
  occupants: OccCell[];
}

function occupyingSwap(
  ctx: OccupancyContext,
  playerFrom: OccCell,
  enemyFrom: OccCell,
  playerTo: OccCell,
  enemyTo: OccCell,
): OccupancyContext {
  const playerFromK = occKey(playerFrom.x, playerFrom.y);
  const enemyFromK = occKey(enemyFrom.x, enemyFrom.y);
  const playerToK = occKey(playerTo.x, playerTo.y);
  const enemyToK = occKey(enemyTo.x, enemyTo.y);
  return {
    ...ctx,
    progressStart: playerTo,
    isOccupied: (c) => {
      const k = occKey(c.x, c.y);
      if (k === playerToK || k === enemyToK) return true;
      if (k === playerFromK || k === enemyFromK) return false;
      return ctx.isOccupied(c);
    },
  };
}

function occupyingPlayerAnd(
  ctx: OccupancyContext,
  player: OccCell,
  occupants: OccCell[],
): OccupancyContext {
  const playerK = occKey(player.x, player.y);
  const taken = new Set(occupants.map((o) => occKey(o.x, o.y)));
  return {
    ...ctx,
    progressStart: player,
    isOccupied: (c) => {
      const k = occKey(c.x, c.y);
      if (k === playerK) return true;
      return taken.has(k);
    },
  };
}

function nonPlayerOccupants(ctx: OccupancyContext, player: OccCell): OccCell[] {
  const pk = occKey(player.x, player.y);
  return collectOccupiedCells(ctx).filter((o) => occKey(o.x, o.y) !== pk);
}

function sealedFrom(
  ctx: OccupancyContext,
  player: OccCell,
  occupants: OccCell[],
): boolean {
  if (ctx.portals.size === 0) return false;
  return occupantsSealProgression(
    ctx.tiles,
    ctx.voidTiles,
    ctx.portals,
    player,
    occupants,
    ctx.barriers,
  );
}

function snapOntoFightGraph(
  cell: OccCell,
  player: OccCell,
  occupants: OccCell[],
  ctx: OccupancyContext,
  battle: Set<string>,
): OccCell {
  const spawnKey = occKey(player.x, player.y);
  const others = occupants.filter(
    (o) => occKey(o.x, o.y) !== occKey(cell.x, cell.y),
  );
  const onGraph = (c: OccCell) => {
    const k = occKey(c.x, c.y);
    if (k === spawnKey || ctx.portals.has(k)) return false;
    return battle.size === 0 || battle.has(k);
  };
  const trialSeals = (c: OccCell) => sealedFrom(ctx, player, [...others, c]);
  if (onGraph(cell) && !trialSeals(cell)) return cell;
  const live = occupyingPlayerAnd(ctx, player, others);
  const found = findNearestFreeCell(
    cell,
    live,
    progressionSearchRadius(live),
    new Set([spawnKey, ...ctx.portals]),
    (c) => onGraph(c) && !trialSeals(c),
  );
  return found ?? cell;
}

/**
 * After the player has already moved (swap/teleport/player-push), relocate
 * other occupants that jointly cut every player→exit route. Stays on the
 * fight graph so a corpse cannot hop a portal choke onto a leftover island.
 */
export function unsealOccupantsAfterPlayerDisplace(
  player: OccCell,
  ctx: OccupancyContext,
): OccCell[] {
  if (ctx.portals.size === 0) {
    return nonPlayerOccupants(ctx, player);
  }
  const start = player;
  const movers = nonPlayerOccupants(ctx, player);
  if (movers.length === 0) return movers;
  if (!sealedFrom(ctx, start, movers)) return movers;
  const live: OccupancyContext = { ...ctx, progressStart: start };
  const cut = unsealProgressionOccupants(
    movers,
    ctx.tiles,
    ctx.voidTiles,
    ctx.portals,
    start,
    live,
  );
  const battle = floodSwapBattleGraph(ctx, start);
  const placed = cut.map((c) => ({ x: c.x, y: c.y }));
  for (let i = 0; i < placed.length; i++) {
    placed[i] = snapOntoFightGraph(placed[i], start, placed, ctx, battle);
  }
  return placed;
}

/**
 * Resolve a player↔enemy swap so the player cannot be stranded in a pocket
 * (or leftover island) with the enemy sealing the unlocked portal.
 */
export function resolveSwapPositions(
  player: OccCell,
  enemy: OccCell,
  ctx: OccupancyContext,
): SwapUnsealResult {
  const originalOccupants = nonPlayerOccupants(ctx, player);
  if (player.x === enemy.x && player.y === enemy.y) {
    return { player, occupants: originalOccupants };
  }
  const battleFromPlayer = floodSwapBattleGraph(ctx, player);
  const enemyKey = occKey(enemy.x, enemy.y);
  if (battleFromPlayer.size > 0 && !battleFromPlayer.has(enemyKey)) {
    // Leftover CA crumb: swapping would strand the player off the fight graph.
    return { player, occupants: originalOccupants };
  }
  const nextPlayer = { x: enemy.x, y: enemy.y };
  const nextEnemy = { x: player.x, y: player.y };
  const swapped = occupyingSwap(ctx, player, enemy, nextPlayer, nextEnemy);
  const after = unsealOccupantsAfterPlayerDisplace(nextPlayer, swapped);
  if (sealedFrom(ctx, nextPlayer, after)) {
    return { player, occupants: originalOccupants };
  }
  const battle = floodSwapBattleGraph(ctx, nextPlayer);
  if (battle.size > 0 && !battle.has(occKey(nextPlayer.x, nextPlayer.y))) {
    return { player, occupants: originalOccupants };
  }
  return { player: nextPlayer, occupants: after };
}
