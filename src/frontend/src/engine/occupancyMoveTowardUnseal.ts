/**
 * Generic boss `moveToward` (`getWalkableMoves` + closest-to-player reduce
 * in `useBossAI`) treats portal tiles as floor — the same
 * `tilesForBossAI` map WorldExploration passes (`t === "floor" ||
 * t === "portal"`). Unlike Eternal Pawn `ADVANCE_PER_TURN` (horizontal
 * then vertical, occupancy-blind), the greedy scan skips occupied
 * neighbors. When the toward-axis floor is stacked, a side portal can be
 * the closest remaining `allTiles` step, so the *unit* sits on the gate;
 * the next hop parks it on a far-side leftover CA crumb. Occupancy floods
 * still walk portals, so leftover-islands stays 0, unique-bridge unseal
 * never runs, and `isProgressionLocked` never clears.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop reflection / summoner
 * midpoint / VOID_TILES / ANCHOR_TILES / SPIKE_ON_LAND / LAVA_TRAIL
 * helpers (those snap units onto already-walkable fight-graph cells,
 * rewrite walls, raster-spawn minions, take one occupancy-blind toward-
 * player axis step, point-reflect, average two bodies, plant impassable
 * voids at Manhattan-2, plant required-step glyphs, plant a walkable spike
 * at a knight L dest, or plant walkable lava at the *origin* of the hop).
 * This is the *destination* of the occupancy-aware all-neighbor reduce.
 * Production `LAVA_TRAIL` legalizes the origin cell the boss leaves;
 * `#732` ADVANCE still writes the occupied toward-axis cell and never
 * considers the side portal.
 *
 * Fight-graph snap; prefer dump so occupancy unseal is not needed; refuse
 * leftover-island hops. Unique-corridor landings stay legal. Does not
 * restack occupancy.ts, occupancyAdvanceUnseal, occupancyLavaUnseal,
 * WorldExploration, useBossSystem, or mapGen.simulate.ts.
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

/** N, S, W, E — same order as `getWalkableMoves` in `useBossAI`. */
const MOVE_TOWARD_DIRS: ReadonlyArray<readonly [number, number]> = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
];

function gridSize(ctx: OccupancyContext): { w: number; h: number } {
  const h = ctx.tiles.length;
  const w = ctx.tiles[0]?.length ?? 0;
  return { w, h };
}

function manhattan(a: OccCell, b: OccCell): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/** WX `tilesForBossAI`: portals count as walkable floor for boss AI. */
export function tilesForMoveTowardAi(tiles: string[][]): boolean[][] {
  return tiles.map((row) =>
    (row ?? []).map((t) => t === "floor" || t === "portal"),
  );
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 */
export function floodMoveTowardBattleGraph(
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
    for (const [dx, dy] of MOVE_TOWARD_DIRS) {
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
      for (const [dx, dy] of MOVE_TOWARD_DIRS) {
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

export function isOnMoveTowardBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodMoveTowardBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when every greedy dest sits off the fight graph (gate, void,
 * leftover crumb, or empty pick). The required boss then cannot be
 * engaged, so clearing never unlocks.
 */
export function moveTowardOffFightGraph(
  player: OccCell,
  dests: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (dests.length === 0) return true;
  return !dests.some((cell) => isOnMoveTowardBattleGraph(cell, player, ctx));
}

function greedyWalkableMoves(
  boss: OccCell,
  allTiles: boolean[][],
  occupied: readonly OccCell[],
): OccCell[] {
  const h = allTiles.length;
  const w = allTiles[0]?.length ?? 0;
  const blocked = new Set(occupied.map((o) => occKey(o.x, o.y)));
  const dests: OccCell[] = [];
  for (const [dx, dy] of MOVE_TOWARD_DIRS) {
    const x = boss.x + dx;
    const y = boss.y + dy;
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    if (!allTiles[y]?.[x]) continue;
    if (blocked.has(occKey(x, y))) continue;
    dests.push({ x, y });
  }
  return dests;
}

/**
 * Closest orthogonal `tilesForBossAI` step toward the player — same
 * N→S→W→E reduce as `moveToward` in `useBossAI` (ties keep the later
 * offset). Occupied cells besides the boss are skipped. Player cell is
 * blocked so the hop never stacks.
 */
export function rawGreedyMoveTowardDest(
  boss: OccCell,
  player: OccCell,
  allTiles: boolean[][],
  occupied: readonly OccCell[] = [],
): OccCell | null {
  const others = occupied.filter((o) => !(o.x === boss.x && o.y === boss.y));
  const blocked = [...others, { x: player.x, y: player.y }];
  const moves = greedyWalkableMoves(boss, allTiles, blocked);
  if (moves.length === 0) return null;
  return moves.reduce((a, b) =>
    manhattan(a, player) < manhattan(b, player) ? a : b,
  );
}

function snapOntoFightGraph(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): OccCell | null {
  const graph = floodMoveTowardBattleGraph(player, ctx);
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
 * Relocate a portal-as-floor greedy landing onto the player's fight graph.
 * Returns `dest` unchanged when it is already a legal fight-graph cell.
 * Returns `null` when no fight-graph cell exists (caller keeps the origin).
 */
export function legalizeMoveTowardLanding(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): OccCell | null {
  return snapOntoFightGraph(dest, player, ctx);
}

/**
 * Snap several greedy dests off the gate and leftover crumbs. Drops a dest
 * that cannot legalize. Does not restack occupancy unseal or punch walls.
 */
export function legalizeMoveTowardLandings(
  dests: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
): OccCell[] {
  const taken = new Set<string>();
  const result: OccCell[] = [];
  for (const dest of dests) {
    const avoid = new Set(taken);
    const graph = floodMoveTowardBattleGraph(player, ctx);
    const destKey = occKey(dest.x, dest.y);
    if (
      graph.has(destKey) &&
      !ctx.portals.has(destKey) &&
      !avoid.has(destKey)
    ) {
      taken.add(destKey);
      result.push({ x: dest.x, y: dest.y });
      continue;
    }
    const snapped = findNearestFreeCell(
      dest,
      ctx,
      progressionSearchRadius(ctx),
      avoid,
      (cell) => graph.has(occKey(cell.x, cell.y)),
    );
    if (snapped) {
      taken.add(occKey(snapped.x, snapped.y));
      result.push(snapped);
    }
  }
  return result;
}

/**
 * One greedy `moveToward` step, then snap off the portal / far crumb.
 * Vacates the boss origin so the snap can reuse that cell.
 * Stays put when the raw step is missing or the snap would join a leftover
 * island that is not on the player's fight graph.
 */
export function resolveMoveTowardLanding(
  boss: OccCell,
  player: OccCell,
  allTiles: boolean[][],
  ctx: OccupancyContext,
  occupied: readonly OccCell[] = [],
): OccCell {
  const raw = rawGreedyMoveTowardDest(boss, player, allTiles, occupied);
  if (!raw) return { x: boss.x, y: boss.y };
  const moving = occupancyVacating(ctx, boss);
  const snapped = snapOntoFightGraph(raw, player, moving);
  if (!snapped) return { x: boss.x, y: boss.y };
  return snapped;
}
