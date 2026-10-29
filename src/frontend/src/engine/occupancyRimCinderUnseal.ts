/**
 * Catalog Rim Cinder (`WF-HAZ-RIM_CINDER`) plants **one** walkable HP-tax
 * cinder (`extraHazardCount` min = max = 1) that occupies one cell of a
 * painted **outer ring** (the perimeter of an axis-aligned floor
 * rectangle of size ≥ 3×3) and **slides one cell clockwise along that
 * rim at each round start, wrapping**. Placement is a `"floor"` raster of
 * those perimeters that skips portals and Chebyshev ≤ 3 from the
 * **legalized spawn** (`SPAWN_SAFE_RADIUS` /
 * `isTileReservedForSpawnOrPortal`, not grid center `WORLD_GRID_SIZE/2`)
 * with **no** occupancy / void / fight-graph check. Occupancy 1+1 unseal
 * relocates combatants and cannot move the cinder. Occupancy floods still
 * walk portals, leftover-islands stays 0, unique-bridge unseal never
 * runs, and the whole ring can sit on a far-side leftover CA crumb or a
 * floor-under-void — the −5% max-HP landing tax never appears on the
 * fight graph. The occupancy-blind wrap slide then visits that far crumb
 * even when the current cell was still on the fight graph. The interior
 * of the rectangle is unmarked floor (not a painted tax cell).
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swapPositions /
 * ignore-walls / ghost raster / Eternal Pawn advance / Twin Bishop /
 * summoner midpoint / VOID / ANCHOR / SPIKE / LAVA / greedy moveToward /
 * erratic / king-step / SHOCK / ILLUSION / LARVAE / INK_VEIL / adjacent
 * SpawnData / BOARD_CLAIM / Void Rift / eligibleHazard / walk-blocker /
 * Creeping Ash / Ember Vein / Hunting Lantern / Orbiting Cinder / Gutter
 * Steam / Frost Pane / Triune Pads / Spent Bridge / Slipstream / Cinder
 * Barrel / MAP_ROTATE / Latch Gate / Pendulum Censer / Hourglass Arch /
 * Shift Slab / Raise Slab / Ratchet Cog / Turnstile Ember / Twin Sparks /
 * Windrow / Skipping Cinder / Plumb Ember helpers (#589–#1319). Those
 * snap units, rewrite walls, plant impassable voids, plant walkable tax,
 * plant one chasing orb, plant a clockwise **4-cycle square**, plant a
 * 3-tile one-way lane, plant delayed walls after three leaves **or three
 * round-starts**, plant teleports, plant a 1 AP wall **roll**, rewrite
 * every body, plant one unarmed extra portal, plant a **5-tile reverse
 * nave**, plant a two-cell oscillating **wall pair**, plant a 1 AP
 * floor→wall pry, plant a **2-cell adjacent HP-tax swap**, plant a
 * **4-arm plus clockwise rotate**, plant a **4-tile collinear
 * opposite-pair swap**, plant a **2-tile bar that hops onto the parallel
 * pair of a painted 2×2**, plant a **5-tile line whose one cinder hops
 * two tiles and wraps**, or plant a **4-tile vertical column whose one
 * cinder falls one tile and wraps**. This is a **walkable outer rim of a
 * ≥ 3×3 floor rectangle whose one cinder slides one tile clockwise and
 * wraps** (period ≥ 8; consecutive **and** wrap Manhattan 1; interior
 * unmarked). `#1071` is Orbiting Cinder (filled **2×2**, period 4, no
 * interior). `#1201` is Pendulum Censer (5-tile reverse, never wraps).
 * `#1265` is Turnstile Ember (4-arm plus, hops Manhattan 2). `#1275` is
 * Twin Sparks (two orbs on a 4-tile line). `#1283` is Windrow (2-tile bar
 * on a 2×2; 2-wide stays). `#1318` is Skipping Cinder (5-tile, 2-tile hop
 * wrap). `#1319` is Plumb Ember (4-tile vertical, wrap Manhattan 3).
 * Unique-corridor / destacked-player / occupied dests stay when every
 * rim **and** interior cell is fight-graph floor. A 1-wide drops. A
 * 2-wide drops (unlike Windrow). A 3-wide of length ≥ 3 stays. Drop
 * leftover-island rings rather than punch. Slide onto portal / void /
 * leftover crumb **stays** (drop the hop). Occupied next cell still
 * slides (landing tax). All painted rim cells must be fight-graph floor
 * — the cinder visits each. Interior is never a tax cell.
 *
 * Fight-graph snap of the painted rectangle (keep width / height /
 * index). Does not restack occupancy.ts, occupancyPlumbEmberUnseal,
 * occupancySkipCinderUnseal, occupancyWindrowUnseal,
 * occupancyTwinSparksUnseal, occupancyTurnstileEmberUnseal,
 * occupancyOrbitingCinderUnseal, occupancyPendulumCenserUnseal,
 * occupancyCreepingAshUnseal, occupancyWalkBlockerUnseal,
 * WorldExploration, worldFeatures.ts, useBossSystem, targeting.ts, or
 * mapGen.simulate.ts.
 */

import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";

/** Catalog `extraHazardCount` for Rim Cinder is exactly one cinder. */
export const RIM_CINDER_COUNT = 1;

/** Smallest painted ring is a 3×3 rectangle (8-cell perimeter). */
export const RIM_CINDER_MIN_SIZE = 3;

/** Perimeter of a 3×3. Orbiting Cinder's 2×2 is 4. */
export const RIM_CINDER_MIN_RIM = 8;

/** Catalog slide is one tile clockwise. */
export const RIM_CINDER_SLIDE = 1;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const RIM_CINDER_SPAWN_CLEAR = 3;

/** Catalog landing tax as a fraction of current max HP. */
export const RIM_CINDER_HP_TAX_PCT = 0.05;

export const RIM_CINDER_FEATURE_ID = "WF-HAZ-RIM_CINDER";

export interface RimCinder {
  origin: OccCell;
  width: number;
  height: number;
  /** 0..rimLength-1 clockwise from `origin` (top-left, then east). */
  index: number;
}

export type RimCinderStayReason = "off-graph";

export type RimCinderSlide =
  | { kind: "stay"; reason: RimCinderStayReason }
  | { kind: "slide"; ring: RimCinder };

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

function inGrid(cell: OccCell, w: number, h: number): boolean {
  return cell.x >= 0 && cell.y >= 0 && cell.x < w && cell.y < h;
}

/** Painted perimeter length of a `width`×`height` rectangle. */
export function rimCinderRimLength(width: number, height: number): number {
  if (width < RIM_CINDER_MIN_SIZE || height < RIM_CINDER_MIN_SIZE) return 0;
  return 2 * (width + height) - 4;
}

export function clampRimCinderIndex(
  index: number,
  width: number,
  height: number,
): number {
  const n = rimCinderRimLength(width, height);
  if (n <= 0) return 0;
  return ((index % n) + n) % n;
}

export function cloneRimCinder(ring: RimCinder): RimCinder {
  return {
    origin: { x: ring.origin.x, y: ring.origin.y },
    width: ring.width,
    height: ring.height,
    index: clampRimCinderIndex(ring.index, ring.width, ring.height),
  };
}

/**
 * Clockwise perimeter from top-left: east along the top, south along the
 * right, west along the bottom, north along the left (skipping origin).
 * Consecutive cells and the wrap are orthogonal Manhattan 1.
 */
export function rimCinderCells(ring: RimCinder): OccCell[] {
  const cells: OccCell[] = [];
  const ox = ring.origin.x;
  const oy = ring.origin.y;
  const width = ring.width;
  const height = ring.height;
  if (width < RIM_CINDER_MIN_SIZE || height < RIM_CINDER_MIN_SIZE) return cells;
  for (let i = 0; i < width; i++) {
    cells.push({ x: ox + i, y: oy });
  }
  for (let j = 1; j < height; j++) {
    cells.push({ x: ox + width - 1, y: oy + j });
  }
  for (let i = width - 2; i >= 0; i--) {
    cells.push({ x: ox + i, y: oy + height - 1 });
  }
  for (let j = height - 2; j >= 1; j--) {
    cells.push({ x: ox, y: oy + j });
  }
  return cells;
}

/** Unmarked interior of the painted rectangle. Never a tax cell. */
export function rimCinderInteriorCells(ring: RimCinder): OccCell[] {
  const cells: OccCell[] = [];
  for (let y = ring.origin.y + 1; y < ring.origin.y + ring.height - 1; y++) {
    for (let x = ring.origin.x + 1; x < ring.origin.x + ring.width - 1; x++) {
      cells.push({ x, y });
    }
  }
  return cells;
}

/** The live cinder cell. Catalog extraHazard budget is this one tile. */
export function rimCinderOrb(ring: RimCinder): OccCell {
  const cells = rimCinderCells(ring);
  const i = clampRimCinderIndex(ring.index, ring.width, ring.height);
  const cell = cells[i] ?? cells[0];
  if (!cell) return { x: ring.origin.x, y: ring.origin.y };
  return { x: cell.x, y: cell.y };
}

/** Origin + size identifies one painted ring; index is the live orb. */
export function rimCinderRingKey(ring: RimCinder): string {
  return `${occKey(ring.origin.x, ring.origin.y)}:${ring.width}x${ring.height}`;
}

/**
 * True when the +1 slide wraps past the last painted rim cell.
 * Pendulum Censer never wraps — it reverses at the ends. Plumb Ember
 * wrap is Manhattan 3 on a 4-cell column. Rim wrap is Manhattan 1.
 */
export function rimCinderWraps(ring: RimCinder): boolean {
  const n = rimCinderRimLength(ring.width, ring.height);
  if (n <= 0) return false;
  const index = clampRimCinderIndex(ring.index, ring.width, ring.height);
  return index + RIM_CINDER_SLIDE >= n;
}

/**
 * Grid Manhattan between the live orb and the occupancy-blind landing.
 * Consecutive **and** wrap slides are 1 on a closed orthogonal rim.
 * Plumb Ember wrap is 3. Skipping Cinder non-wrap hops are 2.
 * Turnstile Ember consecutive arms are 2.
 */
export function rimCinderSlideManhattan(ring: RimCinder): number {
  const before = rimCinderOrb(ring);
  const after = rimCinderOrb(rawRimCinderAdvance(ring));
  return Math.abs(before.x - after.x) + Math.abs(before.y - after.y);
}

/**
 * Painted run is a ≥ 3×3 perimeter with unmarked interior, not Orbiting
 * Cinder's filled 2×2, not Plumb Ember's 4-cell column, not Turnstile
 * Ember's hollow plus, not Windrow's filled 2×2 bar, not Twin Sparks'
 * 4-tile line.
 */
export function rimCinderIsOuterRing(ring: RimCinder): boolean {
  if (ring.width < RIM_CINDER_MIN_SIZE || ring.height < RIM_CINDER_MIN_SIZE) {
    return false;
  }
  const cells = rimCinderCells(ring);
  const expected = rimCinderRimLength(ring.width, ring.height);
  if (cells.length !== expected || expected < RIM_CINDER_MIN_RIM) return false;
  const keys = new Set(cells.map((cell) => occKey(cell.x, cell.y)));
  if (keys.size !== expected) return false;
  const interior = rimCinderInteriorCells(ring);
  if (interior.length === 0) return false;
  if (interior.some((cell) => keys.has(occKey(cell.x, cell.y)))) return false;
  for (let i = 0; i < cells.length; i++) {
    const a = cells[i];
    const b = cells[(i + 1) % cells.length];
    if (!a || !b) return false;
    if (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) !== 1) return false;
  }
  const xs = new Set(cells.map((cell) => cell.x));
  const ys = new Set(cells.map((cell) => cell.y));
  if (xs.size < RIM_CINDER_MIN_SIZE || ys.size < RIM_CINDER_MIN_SIZE) {
    return false;
  }
  return true;
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 * Rim Cinder is **not** a cut (walk occupancy is floor).
 */
export function floodRimCinderBattleGraph(
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

export function isOnRimCinderBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodRimCinderBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the player cannot step on the live cinder (gate, void,
 * leftover crumb). The Rim Cinder landing tax then never hits the
 * fight graph.
 */
export function rimCinderUnreachable(
  player: OccCell,
  ring: RimCinder | null,
  ctx: OccupancyContext,
): boolean {
  if (!ring) return true;
  return !isOnRimCinderBattleGraph(rimCinderOrb(ring), player, ctx);
}

/** True when none of the painted rim cells sit on the fight graph. */
export function rimCinderRingUnreachable(
  player: OccCell,
  ring: RimCinder,
  ctx: OccupancyContext,
): boolean {
  return rimCinderCells(ring).every(
    (cell) => !isOnRimCinderBattleGraph(cell, player, ctx),
  );
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isRimCinderSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= RIM_CINDER_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= RIM_CINDER_SPAWN_CLEAR
  );
}

function rectangleCells(ring: RimCinder): OccCell[] {
  const cells: OccCell[] = [];
  for (let y = ring.origin.y; y < ring.origin.y + ring.height; y++) {
    for (let x = ring.origin.x; x < ring.origin.x + ring.width; x++) {
      cells.push({ x, y });
    }
  }
  return cells;
}

/**
 * Raw catalog ≥ 3×3 rings: row-major origins whose full rectangle is
 * `"floor"` and whose **rim** sits outside spawn±3. Occupancy `tiles` is
 * `!== "wall"` (floor OR portal); production `=== "floor"` skips the
 * gate. No occupancy / void / fight-graph check — leftover crumbs and
 * floor-under-void are included. `existing` skips already-budgeted
 * hazard keys (`MAX_HAZARD_TILES`). Default: index 0 (top-left).
 */
export function rawRimCinderRings(
  ctx: OccupancyContext,
  spawn: OccCell,
  existing?: ReadonlySet<string>,
): RimCinder[] {
  const dests: RimCinder[] = [];
  const { w, h } = gridSize(ctx);
  for (let gy = 0; gy < h; gy++) {
    for (let gx = 0; gx < w; gx++) {
      for (let height = RIM_CINDER_MIN_SIZE; height <= h - gy; height++) {
        for (let width = RIM_CINDER_MIN_SIZE; width <= w - gx; width++) {
          const ring: RimCinder = {
            origin: { x: gx, y: gy },
            width,
            height,
            index: 0,
          };
          const rect = rectangleCells(ring);
          if (!rect.every((c) => inGrid(c, w, h))) continue;
          if (!rect.every((c) => ctx.tiles[c.y]?.[c.x])) continue;
          const rim = rimCinderCells(ring);
          if (rim.some((c) => ctx.portals.has(occKey(c.x, c.y)))) continue;
          if (rect.some((c) => ctx.portals.has(occKey(c.x, c.y)))) continue;
          if (rim.some((c) => isRimCinderSpawnClear(c.x, c.y, spawn))) {
            continue;
          }
          if (existing && rim.some((c) => existing.has(occKey(c.x, c.y)))) {
            continue;
          }
          if (!rimCinderIsOuterRing(ring)) continue;
          dests.push(ring);
        }
      }
    }
  }
  return dests;
}

/** Catalog Rim Cinder plants one outer ring (one cinder). */
export function pickRimCinderCount(): number {
  return RIM_CINDER_COUNT;
}

/** Uniform pick of a painted ring, then a uniform live index. */
export function pickRimCinderRing(
  rings: readonly RimCinder[],
  rng: () => number,
): RimCinder | null {
  if (rings.length === 0) return null;
  const i = Math.floor(rng() * rings.length);
  const picked = rings[i];
  if (!picked) return null;
  const n = rimCinderRimLength(picked.width, picked.height);
  const index = n > 0 ? Math.floor(rng() * n) : 0;
  return {
    origin: { x: picked.origin.x, y: picked.origin.y },
    width: picked.width,
    height: picked.height,
    index: clampRimCinderIndex(index, picked.width, picked.height),
  };
}

/**
 * Occupancy-blind round-start slide. Unlike Pendulum Censer this slides
 * **one tile and wraps** (never reverses at the ends). Unlike Creeping
 * Ash this does not translate the painted cells. Unlike Orbiting Cinder
 * this is a ≥ 8-cell **outer rim**, not a 4-cycle square. Unlike Plumb
 * Ember this wraps Manhattan 1 on a closed ring, not Manhattan 3 on a
 * column. Unlike Skipping Cinder this is a **1-tile** wrap, not a 2-tile
 * hop. Unlike Turnstile Ember consecutive cells are Manhattan 1, not 2.
 */
export function rawRimCinderAdvance(ring: RimCinder): RimCinder {
  return {
    origin: { x: ring.origin.x, y: ring.origin.y },
    width: ring.width,
    height: ring.height,
    index: clampRimCinderIndex(
      ring.index + RIM_CINDER_SLIDE,
      ring.width,
      ring.height,
    ),
  };
}

function acceptCell(
  cell: OccCell,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
): boolean {
  const { w, h } = gridSize(ctx);
  if (!inGrid(cell, w, h)) return false;
  const k = occKey(cell.x, cell.y);
  if (placed.has(k)) return false;
  if (ctx.portals.has(k)) return false;
  if (isRimCinderSpawnClear(cell.x, cell.y, spawn)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  return battle.has(k);
}

function acceptInteriorCell(
  cell: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
): boolean {
  const { w, h } = gridSize(ctx);
  if (!inGrid(cell, w, h)) return false;
  const k = occKey(cell.x, cell.y);
  if (ctx.portals.has(k)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  return battle.has(k);
}

function acceptRing(
  ring: RimCinder,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
): boolean {
  if (!rimCinderIsOuterRing(ring)) return false;
  const rim = rimCinderCells(ring);
  if (!rim.every((cell) => acceptCell(cell, spawn, ctx, battle, placed))) {
    return false;
  }
  return rimCinderInteriorCells(ring).every((cell) =>
    acceptInteriorCell(cell, ctx, battle),
  );
}

function chebyshev(a: OccCell, b: OccCell): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

function nearestAcceptingRing(
  width: number,
  height: number,
  index: number,
  from: OccCell,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
): RimCinder | null {
  const { w, h } = gridSize(ctx);
  let best: RimCinder | null = null;
  let bestD = Number.POSITIVE_INFINITY;
  for (let gy = 0; gy < h; gy++) {
    for (let gx = 0; gx < w; gx++) {
      const ring: RimCinder = {
        origin: { x: gx, y: gy },
        width,
        height,
        index: clampRimCinderIndex(index, width, height),
      };
      if (!acceptRing(ring, spawn, ctx, battle, placed)) continue;
      const d = chebyshev(ring.origin, from);
      if (d < bestD) {
        bestD = d;
        best = ring;
      }
    }
  }
  return best;
}

/**
 * Relocate a Rim Cinder ≥ 3×3 ring onto fight-graph cells so **every**
 * rim and interior cell is steppable. Returns `null` when the fight
 * graph cannot host a 3×3 (caller drops the hazard instead of punching).
 * Unique-corridor overlap stays legal when a **3-wide** of length ≥ 3
 * exists outside spawn±3. A 1-wide drops. A 2-wide drops (Windrow would
 * stay). Covering a destacked player outside spawn±3 stays legal.
 * Occupied fight-graph cells stay legal (no occupancy filter — landing
 * tax). Leftover-island dests snap onto the fight graph or drop — they
 * must not punch a join. Unlike BOARD_CLAIM, one steppable cell of the
 * rectangle is not enough. Unlike Orbiting Cinder, a 2×2 is not enough.
 * Prefer the dest size (nearest origin); fall back to a 3×3.
 */
export function legalizeRimCinderPlacement(
  dest: RimCinder,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
  spawn: OccCell = player,
): RimCinder | null {
  const battle = floodRimCinderBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const keep: RimCinder = {
    origin: { x: dest.origin.x, y: dest.origin.y },
    width: dest.width,
    height: dest.height,
    index: clampRimCinderIndex(dest.index, dest.width, dest.height),
  };
  if (acceptRing(keep, spawn, ctx, battle, placed)) return keep;
  const same = nearestAcceptingRing(
    dest.width,
    dest.height,
    dest.index,
    dest.origin,
    spawn,
    ctx,
    battle,
    placed,
  );
  if (same) return same;
  if (
    dest.width === RIM_CINDER_MIN_SIZE &&
    dest.height === RIM_CINDER_MIN_SIZE
  ) {
    return null;
  }
  return nearestAcceptingRing(
    RIM_CINDER_MIN_SIZE,
    RIM_CINDER_MIN_SIZE,
    dest.index,
    dest.origin,
    spawn,
    ctx,
    battle,
    placed,
  );
}

/**
 * Occupancy-blind round-start slide. If the next landing is a portal,
 * spawn diamond, void, or leftover crumb, **drop the hop** (stay) rather
 * than snap the ring sideways or hop the choke. Unlike initial
 * placement, slide must not relocate the painted rectangle onto a
 * different origin. Occupied next cell still slides — landing tax, not a
 * wall.
 */
export function legalizeRimCinderAdvance(
  ring: RimCinder,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): RimCinderSlide {
  const raw = rawRimCinderAdvance(ring);
  const battle = floodRimCinderBattleGraph(player, ctx);
  if (!acceptCell(rimCinderOrb(raw), spawn, ctx, battle, new Set())) {
    return { kind: "stay", reason: "off-graph" };
  }
  return { kind: "slide", ring: raw };
}

/**
 * Apply one round start. The slide lands only when the next cell still
 * sits on the fight graph. A dropped hop keeps the current cell so later
 * ticks retry the same legalize instead of punching.
 */
export function resolveRimCinderAfterRoundStart(
  ring: RimCinder,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): RimCinder {
  const action = legalizeRimCinderAdvance(ring, player, ctx, spawn);
  if (action.kind === "slide") return action.ring;
  return cloneRimCinder(ring);
}

/**
 * Raw catalog ≥ 3×3 ring from the occupancy grid, then snap so all rim
 * and interior cells sit on the fight graph. `null` when the fight graph
 * cannot host a 3×3.
 */
export function resolveRimCinder(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  dest?: RimCinder,
  existing?: ReadonlySet<string>,
  spawn: OccCell = player,
): RimCinder | null {
  const raw =
    dest ??
    (rng
      ? pickRimCinderRing(rawRimCinderRings(ctx, spawn, existing), rng)
      : (rawRimCinderRings(ctx, spawn, existing)[0] ?? null));
  if (!raw) return null;
  return legalizeRimCinderPlacement(
    raw,
    player,
    ctx,
    existing ?? new Set(),
    spawn,
  );
}

/**
 * Live round-start slide of a painted outer ring. Stays on the current
 * cell when the next landing would leave the fight graph.
 */
export function resolveRimCinderAdvance(
  ring: RimCinder,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): RimCinderSlide {
  return legalizeRimCinderAdvance(ring, player, ctx, spawn);
}
