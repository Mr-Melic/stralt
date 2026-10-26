/**
 * Chessboard Lich `MAP_ROTATE` / `MIRROR_INVERT` (`applyMapRotate` /
 * `applyMirrorInvert` in useBossSystem) rewrite every body with a
 * board-wide geometric transform and **no** walkability / occupancy /
 * void / fight-graph check. `MAP_ROTATE` is 90° clockwise
 * (`newX = N-1-y`, `newY = x`, `N = 16`). `MIRROR_INVERT` is a
 * horizontal flip (`newX = N-1-x`, `newY = y`). The boss is **not**
 * transformed with the pack — both abilities teleport it to map center
 * `(7, 7)`. Occupancy 1+1 unseal relocates combatants after the fact
 * and still **walks portals**, so leftover-islands stays 0, unique-bridge
 * unseal never runs, and a required body on a far-side leftover CA crumb
 * never appears on the fight graph — clearing never unlocks.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swapPositions /
 * ignore-walls / ghost raster / Eternal Pawn advance / Twin Bishop /
 * summoner midpoint / VOID / ANCHOR / SPIKE / LAVA / greedy moveToward /
 * erratic / king-step / SHOCK / ILLUSION / LARVAE / INK_VEIL / adjacent
 * SpawnData / BOARD_CLAIM / Void Rift / eligibleHazard / walk-blocker /
 * Creeping Ash / Ember Vein / Hunting Lantern / Orbiting Cinder / Gutter
 * Steam / Frost Pane / Triune Pads / Spent Bridge / Slipstream / Cinder
 * Barrel helpers (#589–#1154). Those snap **one local hop** (orthogonal
 * step, knight L, point-reflect, midpoint, 1 AP cardinal wall roll) or
 * plant markers. This is a **board-wide 90° / mirror rewrite of every
 * body**, plus a center teleport for the boss — not a painted tile, not
 * a 2×2, not a one-way pad. `#755` Twin Flank is point-reflect across
 * the player. `#859` greedy `moveToward` is one occupancy-aware
 * orthogonal step. `#697` `swapPositions` writes two cells.
 *
 * Fight-graph snap; prefer dump so occupancy unseal is not needed;
 * refuse leftover-island hops. Unique-corridor landings stay legal
 * (the unit is walkable occupancy). Drop a dest that cannot legalize
 * rather than punch. Does not restack occupancy.ts, occupancyTwinFlankUnseal,
 * occupancyMoveTowardUnseal, occupancySwapUnseal, occupancyCinderBarrelUnseal,
 * WorldExploration, useBossSystem, targeting.ts, or mapGen.simulate.ts.
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

/** Production `N` in `applyMapRotate` / `applyMirrorInvert`. */
export const MAP_ROTATE_BOARD_N = 16;

/** Production `newBossPosition` for both abilities. */
export const MAP_ROTATE_BOSS_CENTER: OccCell = { x: 7, y: 7 };

const ORTH: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

export type MapRotateBodies = {
  player: OccCell;
  boss: OccCell;
  others: readonly OccCell[];
};

function gridSize(ctx: OccupancyContext): { w: number; h: number } {
  const h = ctx.tiles.length;
  const w = ctx.tiles[0]?.length ?? 0;
  return { w, h };
}

function inGrid(cell: OccCell, w: number, h: number): boolean {
  return cell.x >= 0 && cell.y >= 0 && cell.x < w && cell.y < h;
}

/** Production uses `N = 16`. Tests on a smaller fixture pass that width. */
export function mapRotateBoardN(ctx: OccupancyContext): number {
  const { w } = gridSize(ctx);
  return w > 0 ? w : MAP_ROTATE_BOARD_N;
}

/**
 * Production center is `(7, 7)` on 16×16 (`floor((N-1)/2)`). Smaller
 * fixtures use the same formula so the analog still sits on the board.
 */
export function mapRotateBossCenter(n: number = MAP_ROTATE_BOARD_N): OccCell {
  const c = Math.floor((n - 1) / 2);
  return { x: c, y: c };
}

/** Production `newX = N-1-y`, `newY = x`. */
export function rotateClockwiseCell(
  cell: OccCell,
  n: number = MAP_ROTATE_BOARD_N,
): OccCell {
  return { x: n - 1 - cell.y, y: cell.x };
}

/** Production `newX = N-1-x`, `newY = y`. */
export function mirrorInvertCell(
  cell: OccCell,
  n: number = MAP_ROTATE_BOARD_N,
): OccCell {
  return { x: n - 1 - cell.x, y: cell.y };
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 */
export function floodMapRotateBattleGraph(
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
      const cur = q.shift();
      if (!cur) break;
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

export function isOnMapRotateBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodMapRotateBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when every transform dest sits off the fight graph (gate, void,
 * leftover crumb, or empty pick). The required body then cannot be
 * engaged, so clearing never unlocks.
 */
export function mapRotateOffFightGraph(
  player: OccCell,
  dests: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (dests.length === 0) return true;
  return !dests.some((cell) => isOnMapRotateBattleGraph(cell, player, ctx));
}

export function rawMapRotateDest(
  cell: OccCell,
  n: number = MAP_ROTATE_BOARD_N,
): OccCell {
  return rotateClockwiseCell(cell, n);
}

export function rawMirrorInvertDest(
  cell: OccCell,
  n: number = MAP_ROTATE_BOARD_N,
): OccCell {
  return mirrorInvertCell(cell, n);
}

/**
 * Raw production rewrite: every non-boss body rotates; the boss teleports
 * to center. No tile / occupancy filter.
 */
export function rawMapRotateBodies(
  bodies: MapRotateBodies,
  n: number = MAP_ROTATE_BOARD_N,
): MapRotateBodies {
  return {
    player: rotateClockwiseCell(bodies.player, n),
    boss: mapRotateBossCenter(n),
    others: bodies.others.map((o) => rotateClockwiseCell(o, n)),
  };
}

export function rawMirrorInvertBodies(
  bodies: MapRotateBodies,
  n: number = MAP_ROTATE_BOARD_N,
): MapRotateBodies {
  return {
    player: mirrorInvertCell(bodies.player, n),
    boss: mapRotateBossCenter(n),
    others: bodies.others.map((o) => mirrorInvertCell(o, n)),
  };
}

function occupancyVacatingAll(
  ctx: OccupancyContext,
  cells: readonly OccCell[],
): OccupancyContext {
  let live = ctx;
  for (const cell of cells) {
    live = occupancyVacating(live, cell);
  }
  return live;
}

function snapOntoFightGraph(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  avoid: ReadonlySet<string> = new Set(),
): OccCell | null {
  const graph = floodMapRotateBattleGraph(player, ctx);
  if (graph.size === 0) return null;
  const destKey = occKey(dest.x, dest.y);
  if (graph.has(destKey) && !ctx.portals.has(destKey) && !avoid.has(destKey)) {
    return { x: dest.x, y: dest.y };
  }
  const mandatory =
    ctx.progressStart && ctx.portals.size > 0
      ? progressionReserved(ctx, player)
      : new Set<string>();
  const radius = progressionSearchRadius(ctx);
  const avoidSet = new Set(avoid);
  const dump = findNearestFreeCell(dest, ctx, radius, avoidSet, (cell) => {
    const k = occKey(cell.x, cell.y);
    return graph.has(k) && !mandatory.has(k);
  });
  if (dump) return dump;
  return findNearestFreeCell(dest, ctx, radius, avoidSet, (cell) =>
    graph.has(occKey(cell.x, cell.y)),
  );
}

/**
 * Relocate a portal-as-floor / leftover / wall transform landing onto the
 * player's fight graph. Returns `dest` unchanged when it is already a
 * legal fight-graph cell. Returns `null` when no fight-graph cell exists
 * (caller keeps the origin — never punch a leftover island).
 */
export function legalizeMapRotateLanding(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  avoid: ReadonlySet<string> = new Set(),
): OccCell | null {
  const { w, h } = gridSize(ctx);
  if (!inGrid(dest, w, h)) {
    return snapOntoFightGraph(player, player, ctx, avoid);
  }
  return snapOntoFightGraph(dest, player, ctx, avoid);
}

/**
 * Snap several transform dests off the gate and leftover crumbs. Drops a
 * dest that cannot legalize. Does not restack occupancy unseal or punch
 * walls. Unique-corridor landings stay.
 */
export function legalizeMapRotateLandings(
  dests: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
): OccCell[] {
  const taken = new Set<string>();
  const result: OccCell[] = [];
  for (const dest of dests) {
    const snapped = legalizeMapRotateLanding(dest, player, ctx, taken);
    if (!snapped) continue;
    const k = occKey(snapped.x, snapped.y);
    if (taken.has(k)) continue;
    taken.add(k);
    result.push(snapped);
  }
  return result;
}

/**
 * One body after a raw transform. Vacates the origin so the snap can
 * reuse that cell. Stays put when the snap would join a leftover island
 * that is not on the player's fight graph.
 */
export function resolveMapRotateLanding(
  dest: OccCell,
  origin: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  avoid: ReadonlySet<string> = new Set(),
): OccCell {
  const moving = occupancyVacating(ctx, origin);
  const snapped = legalizeMapRotateLanding(dest, player, moving, avoid);
  if (!snapped) return { x: origin.x, y: origin.y };
  return snapped;
}

function resolveBodies(
  raw: MapRotateBodies,
  origin: MapRotateBodies,
  ctx: OccupancyContext,
): MapRotateBodies {
  const vacated = occupancyVacatingAll(ctx, [
    origin.player,
    origin.boss,
    ...origin.others,
  ]);
  const taken = new Set<string>();
  const place = (dest: OccCell, from: OccCell): OccCell => {
    const landed = resolveMapRotateLanding(
      dest,
      from,
      origin.player,
      vacated,
      taken,
    );
    taken.add(occKey(landed.x, landed.y));
    return landed;
  };
  const player = place(raw.player, origin.player);
  const boss = place(raw.boss, origin.boss);
  const others = origin.others.map((from, i) =>
    place(raw.others[i] ?? from, from),
  );
  return { player, boss, others };
}

/**
 * Full `MAP_ROTATE` rewrite, then snap every body onto the original
 * player's fight graph. Boss dest is the production center teleport.
 */
export function resolveMapRotate(
  bodies: MapRotateBodies,
  ctx: OccupancyContext,
): MapRotateBodies {
  const n = mapRotateBoardN(ctx);
  return resolveBodies(rawMapRotateBodies(bodies, n), bodies, ctx);
}

/**
 * Full `MIRROR_INVERT` rewrite, then snap every body onto the original
 * player's fight graph. Boss dest is the production center teleport.
 */
export function resolveMirrorInvert(
  bodies: MapRotateBodies,
  ctx: OccupancyContext,
): MapRotateBodies {
  const n = mapRotateBoardN(ctx);
  return resolveBodies(rawMirrorInvertBodies(bodies, n), bodies, ctx);
}
