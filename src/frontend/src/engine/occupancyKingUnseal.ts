/**
 * Summon `moveToward` / `moveAway` in `summonAI.ts` (and any Chebyshev
 * `isCellFree` dest `executeSummonAction` will accept) tries horizontal,
 * then vertical, then the **diagonal king corner** as a single step:
 *   `(from.x + stepX, from.y + stepY)` when both axes are nonzero.
 *
 * Shared `isCellFree` rejects portals / voids / barriers, so this hop
 * never sits on the gate the way `#732` ADVANCE / `#859` greedy
 * `moveToward` / `#863` erratic (`!== "wall"`) can. It *does* land on a
 * leftover CA crumb that is Chebyshev-1 from the unit when both
 * cardinals fail (walls, occupied, portal). Occupancy floods still walk
 * portals, leftover-islands stays 0, unique-bridge unseal never runs,
 * and `isProgressionLocked` never clears because the required unit
 * cannot be engaged on the far crumb.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop reflection / summoner
 * midpoint / VOID_TILES / ANCHOR_TILES / SPIKE_ON_LAND / LAVA_TRAIL /
 * greedy `moveToward` / erratic orthogonal hop (#589–#863). Those snap
 * units onto already-walkable fight-graph cells, rewrite walls,
 * raster-spawn minions, take one occupancy-blind toward-axis orthogonal
 * step, point-reflect, average two bodies, plant impassable voids at
 * Manhattan-2, plant required-step glyphs, plant a walkable spike at a
 * knight L dest, plant walkable lava at the *origin*, pick the closest
 * orthogonal `floor||portal` neighbor, or pick a random orthogonal
 * `!== "wall"` neighbor. This is the *diagonal king corner* of the
 * Chebyshev 1-step. `#732` ADVANCE never pushes that third candidate.
 * `#859` `getWalkableMoves` is N→S→W→E only. `#863` erratic is W→E→N→S
 * only. `findNearestFreeCell` radius 1 is Manhattan (no diagonal);
 * radius 2 can prefer a different Manhattan-2 cell before this corner.
 *
 * Fight-graph snap; prefer dump so occupancy unseal is not needed; refuse
 * leftover-island hops. Unique-corridor landings stay legal. Does not
 * restack occupancy.ts, occupancyMoveTowardUnseal, occupancyErraticUnseal,
 * WorldExploration, summonAI.ts, or mapGen.simulate.ts.
 */

import {
  type OccCell,
  type OccupancyContext,
  findNearestFreeCell,
  isCellFree,
  occKey,
  occupancyVacating,
  progressionReserved,
  progressionSearchRadius,
} from "./occupancy.ts";

/** Orthogonal flood for the fight graph — portals are cuts, not floor. */
const FLOOD_DIRS: ReadonlyArray<readonly [number, number]> = [
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

function axisStep(delta: number): number {
  if (delta > 0) return 1;
  if (delta < 0) return -1;
  return 0;
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 */
export function floodKingBattleGraph(
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
    for (const [dx, dy] of FLOOD_DIRS) {
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
      for (const [dx, dy] of FLOOD_DIRS) {
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

export function isOnKingBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodKingBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when every king dest sits off the fight graph (gate, void,
 * leftover crumb, or empty pick). The required unit then cannot be
 * engaged, so clearing never unlocks.
 */
export function kingOffFightGraph(
  player: OccCell,
  dests: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (dests.length === 0) return true;
  return !dests.some((cell) => isOnKingBattleGraph(cell, player, ctx));
}

/**
 * Horizontal, then vertical, then the diagonal king corner — same order
 * as `moveToward` / `moveAway` in `summonAI.ts`. Empty when `toward`
 * is the origin cell.
 */
export function kingStepCandidates(from: OccCell, toward: OccCell): OccCell[] {
  const stepX = axisStep(toward.x - from.x);
  const stepY = axisStep(toward.y - from.y);
  const candidates: OccCell[] = [];
  if (stepX !== 0) candidates.push({ x: from.x + stepX, y: from.y });
  if (stepY !== 0) candidates.push({ x: from.x, y: from.y + stepY });
  if (stepX !== 0 && stepY !== 0) {
    candidates.push({ x: from.x + stepX, y: from.y + stepY });
  }
  return candidates;
}

/**
 * First `isCellFree` king-step toward `toward`. Cardinals can fail
 * (wall / portal / void / occupied) while the diagonal leftover crumb
 * still passes — that dest is the unique extra.
 */
export function rawKingTowardDest(
  from: OccCell,
  toward: OccCell,
  ctx: OccupancyContext,
): OccCell | null {
  if (from.x === toward.x && from.y === toward.y) return null;
  const moving = occupancyVacating(ctx, from);
  for (const cell of kingStepCandidates(from, toward)) {
    if (isCellFree(cell, moving)) return { x: cell.x, y: cell.y };
  }
  return null;
}

/**
 * First `isCellFree` king-step away from `threat` — `moveAway` in
 * `summonAI.ts` (sign of the delta is flipped).
 */
export function rawKingAwayDest(
  from: OccCell,
  threat: OccCell,
  ctx: OccupancyContext,
): OccCell | null {
  const away = {
    x: from.x + (from.x - threat.x),
    y: from.y + (from.y - threat.y),
  };
  return rawKingTowardDest(from, away, ctx);
}

function snapOntoFightGraph(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): OccCell | null {
  const graph = floodKingBattleGraph(player, ctx);
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
 * Relocate a Chebyshev king landing onto the player's fight graph.
 * Returns `dest` unchanged when it is already a legal fight-graph cell.
 * Returns `null` when no fight-graph cell exists (caller keeps the origin).
 */
export function legalizeKingLanding(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): OccCell | null {
  return snapOntoFightGraph(dest, player, ctx);
}

/**
 * Snap several king dests off leftover crumbs. Drops a dest that cannot
 * legalize. Does not restack occupancy unseal or punch walls.
 */
export function legalizeKingLandings(
  dests: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
): OccCell[] {
  const taken = new Set<string>();
  const result: OccCell[] = [];
  for (const dest of dests) {
    const avoid = new Set(taken);
    const graph = floodKingBattleGraph(player, ctx);
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
 * One summonAI king-step toward `toward`, then snap off the leftover crumb.
 * Vacates the origin so the snap can reuse that cell. Stays put when the
 * raw step is missing or the snap would join a leftover island that is
 * not on the player's fight graph.
 */
export function resolveKingLanding(
  from: OccCell,
  toward: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): OccCell {
  const raw = rawKingTowardDest(from, toward, ctx);
  if (!raw) return { x: from.x, y: from.y };
  const moving = occupancyVacating(ctx, from);
  const snapped = snapOntoFightGraph(raw, player, moving);
  if (!snapped) return { x: from.x, y: from.y };
  return snapped;
}
