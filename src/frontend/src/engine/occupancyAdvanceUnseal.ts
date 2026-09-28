/**
 * Eternal Pawn ADVANCE_PER_TURN (and boss-adjacent minion landings) treat
 * portal tiles as floor — the same `tilesForBossAI` map WorldExploration
 * passes (`t === "floor" || t === "portal"`). One orthogonal step lands on
 * the gate; the next lands on the far-side overworld crumb. Occupancy floods
 * still walk portals, so unique-bridge unseal never runs and
 * `isProgressionLocked` never clears.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster helpers (those stay on already-walkable fight-graph cells, rewrite
 * walls, or raster-scan the full board). This is a directed one-step toward
 * the player that can chain through a portal cut.
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

/** WX `tilesForBossAI`: portals count as walkable floor for boss AI. */
export function bossAiTilesFromMap(tiles: string[][]): boolean[][] {
  return tiles.map((row) =>
    (row ?? []).map((t) => t === "floor" || t === "portal"),
  );
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 */
export function floodAdvanceBattleGraph(
  start: OccCell,
  ctx: OccupancyContext,
): Set<string> {
  const h = ctx.tiles.length;
  const w = ctx.tiles[0]?.length ?? 0;
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

export function isOnAdvanceBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodAdvanceBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * Raw Eternal Pawn step: prefer horizontal then vertical, accept any
 * `allTiles` cell (portals included). No occupancy check — matches
 * `applyAdvancePerTurn`.
 */
export function rawAdvanceDest(
  boss: OccCell,
  player: OccCell,
  allTiles: boolean[][],
): OccCell | null {
  const h = allTiles.length;
  const w = allTiles[0]?.length ?? 0;
  const dx = Math.sign(player.x - boss.x);
  const dy = Math.sign(player.y - boss.y);
  const candidates: OccCell[] = [];
  if (dx !== 0) candidates.push({ x: boss.x + dx, y: boss.y });
  if (dy !== 0) candidates.push({ x: boss.x, y: boss.y + dy });
  const valid = candidates.filter(
    (p) => p.x >= 0 && p.x < w && p.y >= 0 && p.y < h && allTiles[p.y]?.[p.x],
  );
  return valid[0] ?? null;
}

/**
 * Orthogonal neighbors that `getAdjacentTiles` would return when portals
 * are marked walkable.
 */
export function rawAdjacentPortalAsFloor(
  origin: OccCell,
  allTiles: boolean[][],
  occupied: readonly OccCell[] = [],
): OccCell[] {
  const h = allTiles.length;
  const w = allTiles[0]?.length ?? 0;
  const out: OccCell[] = [];
  for (const [dx, dy] of ORTH) {
    const x = origin.x + dx;
    const y = origin.y + dy;
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    if (!allTiles[y]?.[x]) continue;
    if (occupied.some((o) => o.x === x && o.y === y)) continue;
    out.push({ x, y });
  }
  return out;
}

function snapOntoFightGraph(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): OccCell | null {
  const graph = floodAdvanceBattleGraph(player, ctx);
  if (graph.size === 0) return null;
  const destKey = occKey(dest.x, dest.y);
  if (graph.has(destKey) && !ctx.portals.has(destKey)) {
    return { x: dest.x, y: dest.y };
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
 * Relocate a portal-as-floor landing onto the player's fight graph.
 * Returns `dest` unchanged when it is already a legal fight-graph cell.
 * Returns `null` when no fight-graph cell exists (caller keeps the origin).
 */
export function legalizeAdvanceLanding(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): OccCell | null {
  return snapOntoFightGraph(dest, player, ctx);
}

/**
 * One Eternal Pawn step, then snap off the portal / far crumb.
 * Vacates the boss origin so the snap can reuse that cell.
 * Stays put when the raw step is missing or the snap would join a leftover
 * island that is not on the player's fight graph.
 */
export function resolveAdvancePerTurnLanding(
  boss: OccCell,
  player: OccCell,
  allTiles: boolean[][],
  ctx: OccupancyContext,
): OccCell {
  const raw = rawAdvanceDest(boss, player, allTiles);
  if (!raw) return { x: boss.x, y: boss.y };
  const moving = occupancyVacating(ctx, boss);
  const snapped = snapOntoFightGraph(raw, player, moving);
  if (!snapped) return { x: boss.x, y: boss.y };
  return snapped;
}

/**
 * Snap boss-adjacent minion/illusion landings off portal tiles and far-side
 * crumbs. Skips leftover-island joins. Does not restack occupancy unseal.
 */
export function legalizeAdjacentMinionLandings(
  landings: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
): OccCell[] {
  const taken = new Set<string>();
  const result: OccCell[] = [];
  for (const landing of landings) {
    const avoid = new Set(taken);
    const graph = floodAdvanceBattleGraph(player, ctx);
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
