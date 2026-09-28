/**
 * Twin Bishop `TWIN_FLANK` writes a point reflection across the player and
 * only clamps to 0..15. It does not consult walkability, occupancy, voids, or
 * portals — unlike ADVANCE_PER_TURN / getAdjacentTiles (those still require
 * `tilesForBossAI`) and unlike rotate/mirror/leap (board-wide or L-shape).
 * The dest can be a wall, the gate, or a far-side overworld crumb in one hop.
 * Occupancy floods still walk portals, so unique-bridge unseal never runs and
 * `isProgressionLocked` never clears.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance helpers (those stay on already-walkable
 * fight-graph cells, rewrite walls, raster-scan, or take one orthogonal
 * allTiles step). This is an unbounded reflection with no allTiles filter.
 *
 * Fight-graph snap; prefer dump so occupancy unseal is not needed; refuse
 * leftover-island hops. Does not punch walls or join CA crumbs.
 */

import {
  type OccCell,
  type OccupancyContext,
  findNearestFreeCell,
  occKey,
  occupancyVacating,
  progressionReserved,
  progressionSearchRadius,
} from "./occupancy.ts";

const ORTH: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function gridSize(ctx: OccupancyContext): { w: number; h: number } {
  const h = ctx.tiles.length;
  const w = ctx.tiles[0]?.length ?? 0;
  return { w, h };
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 */
export function floodTwinFlankBattleGraph(
  start: OccCell,
  ctx: OccupancyContext,
): Set<string> {
  const { w, h } = gridSize(ctx);
  const seen = new Set<string>();
  const walk = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return false;
    if (!ctx.tiles[y]?.[x]) return false;
    const k = occKey(x, y);
    if (ctx.voidTiles.has(k) || ctx.barriers.has(k) || ctx.portals.has(k)) {
      return false;
    }
    return true;
  };
  const seeds: OccCell[] = [];
  if (walk(start.x, start.y)) {
    seeds.push({ x: start.x, y: start.y });
  } else {
    for (const [dx, dy] of ORTH) {
      const nx = start.x + dx;
      const ny = start.y + dy;
      if (walk(nx, ny)) seeds.push({ x: nx, y: ny });
    }
  }
  for (const seed of seeds) {
    const sk = occKey(seed.x, seed.y);
    if (seen.has(sk)) continue;
    const q: OccCell[] = [seed];
    seen.add(sk);
    while (q.length > 0) {
      const cur = q.shift()!;
      for (const [dx, dy] of ORTH) {
        const nx = cur.x + dx;
        const ny = cur.y + dy;
        const k = occKey(nx, ny);
        if (seen.has(k) || !walk(nx, ny)) continue;
        seen.add(k);
        q.push({ x: nx, y: ny });
      }
    }
  }
  return seen;
}

export function isOnTwinFlankBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodTwinFlankBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * Raw Twin Bishop reflection: `2 * player - boss`, then clamp to the
 * occupancy grid. No walkability / occupancy check — matches
 * `applyTwinFlank` (which hardcodes 0..15).
 */
export function rawTwinFlankDest(
  boss: OccCell,
  player: OccCell,
  w: number,
  h: number,
): OccCell {
  const maxX = Math.max(0, w - 1);
  const maxY = Math.max(0, h - 1);
  const mirrorX = 2 * player.x - boss.x;
  const mirrorY = 2 * player.y - boss.y;
  return {
    x: Math.max(0, Math.min(maxX, mirrorX)),
    y: Math.max(0, Math.min(maxY, mirrorY)),
  };
}

function snapOntoFightGraph(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): OccCell | null {
  const graph = floodTwinFlankBattleGraph(player, ctx);
  if (graph.size === 0) return null;
  const destKey = occKey(dest.x, dest.y);
  if (graph.has(destKey) && !ctx.portals.has(destKey)) {
    const mandatory =
      ctx.progressStart && ctx.portals.size > 0
        ? progressionReserved(ctx, player)
        : new Set<string>();
    if (!mandatory.has(destKey)) return { x: dest.x, y: dest.y };
  }
  const mandatory =
    ctx.progressStart && ctx.portals.size > 0
      ? progressionReserved(ctx, player)
      : new Set<string>();
  const radius = progressionSearchRadius(ctx);
  const dump = findNearestFreeCell(dest, ctx, radius, undefined, (cell) => {
    const k = occKey(cell.x, cell.y);
    return graph.has(k) && !mandatory.has(k);
  });
  if (dump) return dump;
  return findNearestFreeCell(dest, ctx, radius, undefined, (cell) =>
    graph.has(occKey(cell.x, cell.y)),
  );
}

/**
 * Relocate a reflection landing onto the player's fight graph.
 * Returns `dest` unchanged when it is already a legal fight-graph cell.
 * Returns `null` when no fight-graph cell exists (caller keeps the origin).
 */
export function legalizeTwinFlankLanding(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): OccCell | null {
  return snapOntoFightGraph(dest, player, ctx);
}

/**
 * One Twin Bishop reflection, then snap off the wall / portal / far crumb.
 * Vacates `origin` (the twin, or the boss when the twin is a new spawn) so
 * the snap can reuse that cell. Stays at `origin` when the snap would join
 * a leftover island that is not on the player's fight graph.
 */
export function resolveTwinFlankLanding(
  boss: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  origin: OccCell = boss,
): OccCell {
  const { w, h } = gridSize(ctx);
  const raw = rawTwinFlankDest(boss, player, w, h);
  const moving = occupancyVacating(ctx, origin);
  const snapped = snapOntoFightGraph(raw, player, moving);
  if (!snapped) return { x: origin.x, y: origin.y };
  return snapped;
}

/**
 * Snap several reflection landings off portal tiles, walls, and far-side
 * crumbs. Skips leftover-island joins. Does not restack occupancy unseal.
 */
export function legalizeTwinFlankLandings(
  landings: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
): OccCell[] {
  const taken = new Set<string>();
  const result: OccCell[] = [];
  for (const landing of landings) {
    const avoid = new Set(taken);
    const graph = floodTwinFlankBattleGraph(player, ctx);
    const landingKey = occKey(landing.x, landing.y);
    if (
      graph.has(landingKey) &&
      !ctx.portals.has(landingKey) &&
      !avoid.has(landingKey)
    ) {
      taken.add(landingKey);
      result.push({ x: landing.x, y: landing.y });
      continue;
    }
    const snapped = findNearestFreeCell(
      landing,
      ctx,
      progressionSearchRadius(ctx),
      avoid,
      (cell) => graph.has(occKey(cell.x, cell.y)),
    );
    if (snapped) {
      taken.add(occKey(snapped.x, snapped.y));
      result.push(snapped);
    } else {
      result.push({ x: landing.x, y: landing.y });
    }
  }
  return result;
}
