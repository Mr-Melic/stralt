/**
 * Pale Archivist `INK_VEIL` raster-scans the full board with `allTiles`
 * (floor OR portal) and plants 3–4 stealth/trap glyphs with no walkability /
 * occupancy / void / fight-graph check. Occupancy 1+1 unseal relocates
 * combatants and cannot move glyph markers (`isOccupied` never sees
 * `bossState.glyphedTiles`). Occupancy floods still walk portals, so
 * leftover-islands stays 0, unique-bridge unseal never runs, and every
 * glyph can sit on the gate or a far-side leftover CA crumb — GLYPH_TRAP
 * and tile-invisibility never appear on the fight graph, so the intended
 * tax never lands on the player route.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop reflection / summoner
 * midpoint / VOID_TILES / ANCHOR_TILES / SPIKE_ON_LAND / LAVA_TRAIL /
 * greedy `moveToward` / erratic / Chebyshev king-step / SHOCK_TILES /
 * ILLUSION_SPLIT / LARVAE_SPAWN helpers (#589–#920). Those snap units,
 * rewrite walls, raster-spawn `SpawnData` minions, take one occupancy-blind
 * toward-axis orthogonal step, point-reflect, average two bodies, plant
 * impassable voids at Manhattan-2, plant *two* required-step DAMAGE_IMMUNE
 * glyphs, plant a walkable spike at a knight L dest, plant walkable lava
 * at the *origin*, pick the closest orthogonal `floor||portal` neighbor,
 * pick a random orthogonal `!== "wall"` neighbor, take the Chebyshev king
 * corner, plant `activeShockTiles` at the moveToward origin, plant
 * IllusionData copies, or plant LarvaData. This is 3–4 stealth/trap
 * `glyphedTiles` (not DAMAGE_IMMUNE, not `turnsLeft` tick, not SpawnData,
 * not IllusionData, not ShockTile, not hazardTiles, not LarvaData).
 * `#770` snaps the two-glyph ANCHOR required-step batch; this pass is the
 * 3–4 INK_VEIL shuffle. Unique-corridor landings stay legal (glyphs are
 * walkable traps; unlike VOID_TILES they must not punch the only exit).
 *
 * Fight-graph snap onto a steppable cell; drop leftover-island dests rather
 * than punch. Does not restack occupancy.ts, occupancyAnchorUnseal,
 * occupancyLarvaUnseal, WorldExploration, useBossSystem, or
 * mapGen.simulate.ts.
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

/** `applyInkVeil` plants `3 + floor(random * 2)` glyphs (3 or 4). */
export const INK_VEIL_MIN_COUNT = 3;
export const INK_VEIL_MAX_COUNT = 4;

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
export function floodInkVeilBattleGraph(
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

export function isOnInkVeilBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodInkVeilBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the player cannot step on any of `glyphs` (gate, void, barrier,
 * leftover crumb). GLYPH_TRAP / invisibility then never tax the fight graph.
 */
export function inkGlyphsUnreachable(
  player: OccCell,
  glyphs: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (glyphs.length === 0) return true;
  return !glyphs.some((cell) => isOnInkVeilBattleGraph(cell, player, ctx));
}

/**
 * Raw INK_VEIL dests: row-major `allTiles` cells that are not occupied
 * (floor OR portal — matches `applyInkVeil`). Production hardcodes 16×16;
 * tests use the live occupancy grid. No unique-bridge / void / fight-graph
 * check. Shuffle happens in {@link pickInkVeilDests}.
 */
export function rawInkVeilDests(
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

/** Production `3 + Math.floor(Math.random() * 2)`. */
export function pickInkVeilCount(rng: () => number): number {
  return (
    INK_VEIL_MIN_COUNT +
    Math.floor(rng() * (INK_VEIL_MAX_COUNT - INK_VEIL_MIN_COUNT + 1))
  );
}

/** Fisher–Yates pick of `count` dests. Production uses `Math.random` sort. */
export function pickInkVeilDests(
  dests: readonly OccCell[],
  rng: () => number,
  count: number = pickInkVeilCount(rng),
): OccCell[] {
  const shuffled = dests.map((c) => ({ x: c.x, y: c.y }));
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }
  const n = Math.min(count, shuffled.length);
  return shuffled.slice(0, n);
}

function acceptInkVeilLanding(
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
 * Relocate a stealth/trap glyph onto a fight-graph cell the player can
 * walk. Returns `null` when every candidate is a leftover island (caller
 * drops the glyph instead of punching). Unique-corridor cells stay legal.
 */
export function legalizeInkVeilPlacement(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
): OccCell | null {
  const battle = floodInkVeilBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const ok = (cell: OccCell) =>
    acceptInkVeilLanding(cell, player, ctx, battle, placed);
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
 * Snap several stealth/trap glyphs off the gate, voids, and leftover
 * crumbs. Drops a dest that cannot legalize. Does not restack occupancy
 * unseal or punch walls.
 */
export function legalizeInkVeilPlacements(
  dests: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
): OccCell[] {
  const placed = new Set<string>();
  const result: OccCell[] = [];
  for (const dest of dests) {
    const snapped = legalizeInkVeilPlacement(dest, player, ctx, placed);
    if (!snapped) continue;
    const k = occKey(snapped.x, snapped.y);
    placed.add(k);
    result.push(snapped);
  }
  return result;
}

/**
 * Raw INK_VEIL dests from the occupancy grid, then snap off the portal /
 * far crumb / void. Empty when the fight graph cannot host a glyph.
 */
export function resolveInkVeilTiles(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  count?: number,
): OccCell[] {
  const raw = rawInkVeilDests(ctx.tiles, occupiedKeys(ctx));
  const n = count ?? (rng ? pickInkVeilCount(rng) : INK_VEIL_MIN_COUNT);
  const picked = rng ? pickInkVeilDests(raw, rng, n) : raw.slice(0, n);
  return legalizeInkVeilPlacements(picked, player, ctx);
}
