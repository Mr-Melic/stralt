/**
 * Enthroned Void `ANCHOR_TILES` raster-scans the full board with `allTiles`
 * (floor OR portal) and plants two required-step glyphs with no walkability /
 * occupancy / void check. Occupancy 1+1 unseal relocates units and cannot
 * move glyph markers. Occupancy floods still walk portals, so leftover-islands
 * stays 0, unique-bridge unseal never runs, and a DAMAGE_IMMUNE boss cannot
 * be damaged when every anchor sits on the gate or a far-side crumb —
 * clearing never unlocks.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop reflection / summoner midpoint /
 * VOID_TILES helpers (those snap units onto already-walkable fight-graph
 * cells, rewrite walls, raster-spawn minions, take one orthogonal allTiles
 * step, point-reflect, average two bodies, or plant impassable voids at
 * Manhattan-2). This plants required interactable tiles via a full-board
 * shuffle. Unique-corridor landings stay legal — the player must step on
 * the glyph, unlike a void on the same cell.
 *
 * Fight-graph snap onto a steppable cell; drop leftover-island dests rather
 * than punch. Does not restack occupancy.ts, WorldExploration, useBossSystem,
 * or mapGen.simulate.ts.
 */

import {
  type OccCell,
  type OccupancyContext,
  collectOccupiedCells,
  findNearestFreeCell,
  isCellFree,
  occKey,
  progressionSearchRadius,
} from "./occupancy.ts";

/** `applyAnchorTiles` keeps two glyphs per boss turn. */
export const ANCHOR_PICK_COUNT = 2;

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
export function floodAnchorBattleGraph(
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

export function isOnAnchorBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodAnchorBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the player cannot step on any of `anchors` (gate, void, barrier,
 * leftover crumb). DAMAGE_IMMUNE then never leaves phase 1.
 */
export function anchorsUnreachable(
  player: OccCell,
  anchors: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (anchors.length === 0) return true;
  return !anchors.some((cell) => isOnAnchorBattleGraph(cell, player, ctx));
}

/**
 * Raw ANCHOR_TILES dests: row-major `allTiles` cells that are not occupied
 * (floor OR portal — matches `applyAnchorTiles`). No unique-bridge / void /
 * fight-graph check. Shuffle happens in {@link pickAnchorDests}.
 */
export function rawAnchorDests(
  tiles: boolean[][],
  occupied: ReadonlySet<string>,
): OccCell[] {
  const dests: OccCell[] = [];
  for (let gy = 0; gy < tiles.length; gy++) {
    for (let gx = 0; gx < (tiles[gy]?.length ?? 0); gx++) {
      if (!tiles[gy]?.[gx]) continue;
      if (occupied.has(occKey(gx, gy))) continue;
      dests.push({ x: gx, y: gy });
    }
  }
  return dests;
}

function occupiedKeys(ctx: OccupancyContext): Set<string> {
  return new Set(collectOccupiedCells(ctx).map((c) => occKey(c.x, c.y)));
}

/** Fisher–Yates pick of `count` dests. Production uses `Math.random`. */
export function pickAnchorDests(
  dests: readonly OccCell[],
  rng: () => number,
  count: number = ANCHOR_PICK_COUNT,
): OccCell[] {
  const shuffled = dests.map((c) => ({ x: c.x, y: c.y }));
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function acceptAnchorLanding(
  cell: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
): boolean {
  const k = occKey(cell.x, cell.y);
  if (placed.has(k)) return false;
  if (ctx.portals.has(k)) return false;
  if (k === occKey(player.x, player.y)) return false;
  if (!battle.has(k)) return false;
  if (!isCellFree(cell, ctx)) return false;
  return true;
}

/**
 * Relocate a required-step glyph onto a fight-graph cell the player can
 * walk. Returns `null` when every candidate is a leftover island (caller
 * drops the glyph instead of punching). Unique-corridor cells stay legal.
 */
export function legalizeAnchorPlacement(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
): OccCell | null {
  const battle = floodAnchorBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const ok = (cell: OccCell) =>
    acceptAnchorLanding(cell, player, ctx, battle, placed);
  if (ok(dest)) return { x: dest.x, y: dest.y };
  return findNearestFreeCell(
    dest,
    ctx,
    progressionSearchRadius(ctx),
    new Set([occKey(player.x, player.y), ...ctx.portals, ...placed]),
    (cell) => ok(cell),
  );
}

/**
 * Snap several required-step glyphs off the gate, voids, and leftover
 * crumbs. Drops a dest that cannot legalize. Does not restack occupancy
 * unseal or punch walls.
 */
export function legalizeAnchorPlacements(
  dests: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
): OccCell[] {
  const placed = new Set<string>();
  const result: OccCell[] = [];
  for (const dest of dests) {
    const snapped = legalizeAnchorPlacement(dest, player, ctx, placed);
    if (!snapped) continue;
    const k = occKey(snapped.x, snapped.y);
    placed.add(k);
    result.push(snapped);
  }
  return result;
}

/**
 * Raw ANCHOR_TILES dests from the occupancy grid, then snap off the portal /
 * far crumb / void. Empty when the fight graph cannot host a glyph.
 */
export function resolveAnchorTiles(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  count: number = ANCHOR_PICK_COUNT,
): OccCell[] {
  const raw = rawAnchorDests(ctx.tiles, occupiedKeys(ctx));
  const picked = rng ? pickAnchorDests(raw, rng, count) : raw.slice(0, count);
  return legalizeAnchorPlacements(picked, player, ctx);
}
