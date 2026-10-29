/**
 * Catalog Plumb Ember (`WF-HAZ-CINDER_PLUMB`) plants **one** walkable
 * HP-tax cinder (`extraHazardCount` min = max = 1) that occupies one cell
 * of a painted **4-tile vertical column** and **falls one cell toward the
 * marked bottom at each round start, wrapping to the top**. Placement is
 * a `"floor"` raster of 4-cell south runs that skips portals and
 * Chebyshev ≤ 3 from the **legalized spawn** (`SPAWN_SAFE_RADIUS` /
 * `isTileReservedForSpawnOrPortal`, not grid center `WORLD_GRID_SIZE/2`)
 * with **no** occupancy / void / fight-graph check. Occupancy 1+1 unseal
 * relocates combatants and cannot move the cinder. Occupancy floods still
 * walk portals, leftover-islands stays 0, unique-bridge unseal never
 * runs, and the whole column can sit on a far-side leftover CA crumb or a
 * floor-under-void — the −5% max-HP landing tax never appears on the
 * fight graph. The occupancy-blind wrap fall then visits that far crumb
 * even when the current cell was still on the fight graph.
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
 * Windrow / Skipping Cinder helpers (#589–#1318). Those snap units,
 * rewrite walls, plant impassable voids, plant walkable tax, plant one
 * chasing orb, plant a clockwise **4-cycle square**, plant a 3-tile
 * one-way lane, plant delayed walls after three leaves **or three
 * round-starts**, plant teleports, plant a 1 AP wall **roll**, rewrite
 * every body, plant one unarmed extra portal, plant a **5-tile reverse
 * nave**, plant a two-cell oscillating **wall pair**, plant a 1 AP
 * floor→wall pry, plant a **2-cell adjacent HP-tax swap**, plant a
 * **4-arm plus clockwise rotate**, plant a **4-tile collinear
 * opposite-pair swap**, plant a **2-tile bar that hops onto the parallel
 * pair of a painted 2×2**, or plant a **5-tile line whose one cinder hops
 * two tiles and wraps**. This is a **walkable 4-tile vertical column
 * whose one cinder falls one tile and wraps** (period 4: 0→1→2→3→0;
 * south heading only; wrap fall Manhattan 3). `#1023` is Creeping Ash
 * (3-tile one-way, 1-tile advance, both axes). `#1071` is Orbiting Cinder
 * (one orb, 4-cycle square wrap). `#1201` is Pendulum Censer (5-tile,
 * **1-tile reverse**, never wraps, both axes). `#1258` is Ratchet Cog
 * (two adjacent cells). `#1265` is Turnstile Ember (4-arm plus). `#1275`
 * is Twin Sparks (two orbs on a 4-tile **line**). `#1283` is Windrow
 * (2-tile bar on a 2×2). `#1318` is Skipping Cinder (5-tile, **2-tile
 * hop wrap**, east **and** south). Unique-corridor / destacked-player /
 * occupied dests stay when all four painted cells are fight-graph floor.
 * A vertical 1-wide of length ≥ 4 stays (unlike Windrow / Turnstile
 * Ember). A horizontal 1-wide drops (unlike Skipping Cinder). Drop
 * leftover-island columns rather than punch. Fall onto portal / void /
 * leftover crumb **stays** (drop the hop). Occupied next cell still falls
 * (landing tax). All four painted cells must be fight-graph floor — the
 * cinder visits each.
 *
 * Fight-graph snap of the 4-cell origin (keep south heading / index).
 * Does not restack occupancy.ts, occupancySkipCinderUnseal,
 * occupancyWindrowUnseal, occupancyTwinSparksUnseal,
 * occupancyTurnstileEmberUnseal, occupancyPendulumCenserUnseal,
 * occupancyOrbitingCinderUnseal, occupancyCreepingAshUnseal,
 * occupancyWalkBlockerUnseal, WorldExploration, worldFeatures.ts,
 * useBossSystem, targeting.ts, or mapGen.simulate.ts.
 */

import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";

/** Catalog `extraHazardCount` for Plumb Ember is exactly one cinder. */
export const PLUMB_EMBER_COUNT = 1;

/** Painted track is a 4-cell vertical column. */
export const PLUMB_EMBER_COLUMN_LENGTH = 4;

/** Catalog fall is one tile toward the marked bottom. */
export const PLUMB_EMBER_FALL = 1;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const PLUMB_EMBER_SPAWN_CLEAR = 3;

/** Catalog landing tax as a fraction of current max HP. */
export const PLUMB_EMBER_HP_TAX_PCT = 0.05;

export const PLUMB_EMBER_FEATURE_ID = "WF-HAZ-CINDER_PLUMB";

export interface PlumbEmberHeading {
  dx: number;
  dy: number;
}

/**
 * South only. A 4-cell wrap column is gravity toward a marked bottom;
 * the opposite heading is the same physical run. Skipping Cinder also
 * paints east 5-cell lines; Pendulum Censer paints both axes and
 * reverses.
 */
export const PLUMB_EMBER_HEADINGS: readonly PlumbEmberHeading[] = [
  { dx: 0, dy: 1 },
];

export interface PlumbEmber {
  origin: OccCell;
  heading: PlumbEmberHeading;
  /** 0..3 index along `heading` from `origin` (0 = top). */
  index: number;
}

export type PlumbEmberStayReason = "off-graph";

export type PlumbEmberFall =
  | { kind: "stay"; reason: PlumbEmberStayReason }
  | { kind: "fall"; column: PlumbEmber };

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

export function clampPlumbEmberIndex(index: number): number {
  const n = PLUMB_EMBER_COLUMN_LENGTH;
  const wrapped = ((index % n) + n) % n;
  return wrapped;
}

export function clonePlumbEmberHeading(
  heading: PlumbEmberHeading,
): PlumbEmberHeading {
  return { dx: heading.dx, dy: heading.dy };
}

export function clonePlumbEmber(column: PlumbEmber): PlumbEmber {
  return {
    origin: { x: column.origin.x, y: column.origin.y },
    heading: clonePlumbEmberHeading(column.heading),
    index: clampPlumbEmberIndex(column.index),
  };
}

/** Four painted cells from `origin` along `heading` (south). */
export function plumbEmberCells(
  origin: OccCell,
  heading: PlumbEmberHeading,
): OccCell[] {
  const cells: OccCell[] = [];
  for (let i = 0; i < PLUMB_EMBER_COLUMN_LENGTH; i++) {
    cells.push({
      x: origin.x + heading.dx * i,
      y: origin.y + heading.dy * i,
    });
  }
  return cells;
}

/** The live cinder cell. Catalog extraHazard budget is this one tile. */
export function plumbEmberOrb(column: PlumbEmber): OccCell {
  const cells = plumbEmberCells(column.origin, column.heading);
  const i = clampPlumbEmberIndex(column.index);
  const cell = cells[i] ?? cells[0];
  return { x: cell.x, y: cell.y };
}

/** Origin identifies one painted column; index is the live orb. */
export function plumbEmberColumnKey(column: PlumbEmber): string {
  return occKey(column.origin.x, column.origin.y);
}

/**
 * True when the +1 fall wraps past the last painted cell (index 3→0).
 * Pendulum Censer never wraps — it reverses at the ends. Skipping Cinder
 * wraps a **2-tile** hop on a **5-tile** line.
 */
export function plumbEmberWraps(column: PlumbEmber): boolean {
  const index = clampPlumbEmberIndex(column.index);
  return index + PLUMB_EMBER_FALL >= PLUMB_EMBER_COLUMN_LENGTH;
}

/**
 * Grid Manhattan between the live orb and the occupancy-blind landing.
 * Non-wrap falls are 1; wrap falls are 3 (the column is only 4 cells).
 * Skipping Cinder non-wrap hops are 2. Pendulum's reverse step is always
 * Manhattan 1 and never wraps.
 */
export function plumbEmberFallManhattan(column: PlumbEmber): number {
  const before = plumbEmberOrb(column);
  const after = plumbEmberOrb(rawPlumbEmberFall(column));
  return Math.abs(before.x - after.x) + Math.abs(before.y - after.y);
}

/**
 * Painted run is a 4-cell vertical column, not Skipping Cinder's 5-cell
 * line (east or south), not Windrow's filled 2×2, not Turnstile Ember's
 * hollow plus, not Orbiting Cinder's 2×2 square, not Twin Sparks' 4-tile
 * **horizontal** opposite-pair line.
 */
export function plumbEmberIsColumnNotRow(column: PlumbEmber): boolean {
  const cells = plumbEmberCells(column.origin, column.heading);
  if (cells.length !== PLUMB_EMBER_COLUMN_LENGTH) return false;
  const keys = new Set(cells.map((cell) => occKey(cell.x, cell.y)));
  if (keys.size !== PLUMB_EMBER_COLUMN_LENGTH) return false;
  const xs = new Set(cells.map((cell) => cell.x));
  const ys = new Set(cells.map((cell) => cell.y));
  if (xs.size !== 1 || ys.size !== PLUMB_EMBER_COLUMN_LENGTH) return false;
  if (column.heading.dx !== 0 || column.heading.dy !== 1) return false;
  for (let i = 1; i < cells.length; i++) {
    const a = cells[i - 1];
    const b = cells[i];
    if (!a || !b) return false;
    if (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) !== 1) return false;
    if (b.y !== a.y + 1) return false;
  }
  return true;
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 * Plumb Ember is **not** a cut (walk occupancy is floor).
 */
export function floodPlumbEmberBattleGraph(
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

export function isOnPlumbEmberBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodPlumbEmberBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the player cannot step on the live cinder (gate, void,
 * leftover crumb). The Plumb Ember landing tax then never hits the
 * fight graph.
 */
export function plumbEmberUnreachable(
  player: OccCell,
  column: PlumbEmber | null,
  ctx: OccupancyContext,
): boolean {
  if (!column) return true;
  return !isOnPlumbEmberBattleGraph(plumbEmberOrb(column), player, ctx);
}

/** True when none of the four painted cells sit on the fight graph. */
export function plumbEmberColumnUnreachable(
  player: OccCell,
  column: PlumbEmber,
  ctx: OccupancyContext,
): boolean {
  return plumbEmberCells(column.origin, column.heading).every(
    (cell) => !isOnPlumbEmberBattleGraph(cell, player, ctx),
  );
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isPlumbEmberSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= PLUMB_EMBER_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= PLUMB_EMBER_SPAWN_CLEAR
  );
}

/**
 * Raw catalog 4-cell columns: row-major origins whose four cells are
 * `"floor"` outside spawn±3. Occupancy `tiles` is `!== "wall"` (floor OR
 * portal); production `=== "floor"` skips the gate. No occupancy / void /
 * fight-graph check — leftover crumbs and floor-under-void are included.
 * `existing` skips already-budgeted hazard keys (`MAX_HAZARD_TILES`).
 * Default: index 0 (top).
 */
export function rawPlumbEmberColumns(
  ctx: OccupancyContext,
  spawn: OccCell,
  existing?: ReadonlySet<string>,
): PlumbEmber[] {
  const dests: PlumbEmber[] = [];
  const { w, h } = gridSize(ctx);
  for (const heading of PLUMB_EMBER_HEADINGS) {
    for (let gy = 0; gy < h; gy++) {
      for (let gx = 0; gx < w; gx++) {
        const origin = { x: gx, y: gy };
        const cells = plumbEmberCells(origin, heading);
        if (!cells.every((c) => inGrid(c, w, h))) continue;
        if (!cells.every((c) => ctx.tiles[c.y]?.[c.x])) continue;
        if (cells.some((c) => ctx.portals.has(occKey(c.x, c.y)))) continue;
        if (cells.some((c) => isPlumbEmberSpawnClear(c.x, c.y, spawn))) {
          continue;
        }
        if (existing && cells.some((c) => existing.has(occKey(c.x, c.y)))) {
          continue;
        }
        dests.push({
          origin,
          heading: clonePlumbEmberHeading(heading),
          index: 0,
        });
      }
    }
  }
  return dests;
}

/** Catalog Plumb Ember plants one 4-tile column (one cinder). */
export function pickPlumbEmberCount(): number {
  return PLUMB_EMBER_COUNT;
}

/** Uniform pick of the 4-cell column, then a uniform live index. */
export function pickPlumbEmberColumn(
  columns: readonly PlumbEmber[],
  rng: () => number,
): PlumbEmber | null {
  if (columns.length === 0) return null;
  const i = Math.floor(rng() * columns.length);
  const picked = columns[i];
  if (!picked) return null;
  const index = Math.floor(rng() * PLUMB_EMBER_COLUMN_LENGTH);
  return {
    origin: { x: picked.origin.x, y: picked.origin.y },
    heading: clonePlumbEmberHeading(picked.heading),
    index: clampPlumbEmberIndex(index),
  };
}

/**
 * Occupancy-blind round-start fall. Unlike Pendulum Censer this falls
 * **one tile and wraps** (never reverses at the ends). Unlike Creeping
 * Ash this does not translate the painted cells. Unlike Orbiting Cinder
 * this is a 4-cycle **column**, not a 4-cycle square. Unlike Twin Sparks
 * this is one orb on four **vertical** cells, not two orbs swapping on a
 * line. Unlike Skipping Cinder this is a **4-tile south column** with a
 * **1-tile** wrap fall, not a 5-tile line with a 2-tile hop.
 */
export function rawPlumbEmberFall(column: PlumbEmber): PlumbEmber {
  return {
    origin: { x: column.origin.x, y: column.origin.y },
    heading: clonePlumbEmberHeading(column.heading),
    index: clampPlumbEmberIndex(column.index + PLUMB_EMBER_FALL),
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
  if (isPlumbEmberSpawnClear(cell.x, cell.y, spawn)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  return battle.has(k);
}

function acceptColumn(
  column: PlumbEmber,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
): boolean {
  const cells = plumbEmberCells(column.origin, column.heading);
  if (cells.length !== PLUMB_EMBER_COLUMN_LENGTH) return false;
  if (!plumbEmberIsColumnNotRow(column)) return false;
  return cells.every((cell) => acceptCell(cell, spawn, ctx, battle, placed));
}

function preferColumnAtOrigin(
  origin: OccCell,
  dest: PlumbEmber,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
): PlumbEmber | null {
  const keep: PlumbEmber = {
    origin: { x: origin.x, y: origin.y },
    heading: clonePlumbEmberHeading(dest.heading),
    index: dest.index,
  };
  if (acceptColumn(keep, spawn, ctx, battle, placed)) return keep;
  for (const heading of PLUMB_EMBER_HEADINGS) {
    const column: PlumbEmber = {
      origin: { x: origin.x, y: origin.y },
      heading: clonePlumbEmberHeading(heading),
      index: dest.index,
    };
    if (acceptColumn(column, spawn, ctx, battle, placed)) return column;
  }
  return null;
}

/**
 * Relocate a Plumb Ember 4-cell column onto four fight-graph cells so
 * **every** cell is steppable. Returns `null` when the fight graph cannot
 * host a 4-cell south run (caller drops the hazard instead of punching).
 * Unique-corridor overlap stays legal when a **vertical** 1-wide of
 * length ≥ 4 exists outside spawn±3. A horizontal 1-wide drops (Skipping
 * Cinder would stay). Covering a destacked player outside spawn±3 stays
 * legal. Occupied fight-graph cells stay legal (no occupancy filter —
 * landing tax). Leftover-island dests snap onto the fight graph or drop
 * — they must not punch a join. Unlike BOARD_CLAIM, one steppable cell of
 * four is not enough. Unlike Windrow, a 1-wide of length ≥ 4 is enough
 * when it is vertical.
 */
export function legalizePlumbEmberPlacement(
  dest: PlumbEmber,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
  spawn: OccCell = player,
): PlumbEmber | null {
  const { w, h } = gridSize(ctx);
  const battle = floodPlumbEmberBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const tryOrigin = (origin: OccCell): PlumbEmber | null =>
    preferColumnAtOrigin(origin, dest, spawn, ctx, battle, placed);
  const direct = tryOrigin(dest.origin);
  if (direct) return direct;
  const origins: OccCell[] = [
    { x: dest.origin.x, y: dest.origin.y },
    plumbEmberOrb(dest),
  ];
  const maxR = Math.max(1, w + h);
  for (const origin of origins) {
    for (let r = 0; r <= maxR; r++) {
      for (let dx = -r; dx <= r; dx++) {
        const dy = r - Math.abs(dx);
        const cells: OccCell[] = [{ x: origin.x + dx, y: origin.y + dy }];
        if (dy !== 0) cells.push({ x: origin.x + dx, y: origin.y - dy });
        for (const cell of cells) {
          if (!inGrid(cell, w, h)) continue;
          const snapped = tryOrigin(cell);
          if (snapped) return snapped;
        }
      }
    }
  }
  return null;
}

/**
 * Occupancy-blind round-start fall. If the next landing is a portal,
 * spawn diamond, void, or leftover crumb, **drop the hop** (stay) rather
 * than snap the column sideways or hop the choke. Unlike initial
 * placement, fall must not relocate the painted column onto a different
 * origin. Occupied next cell still falls — landing tax, not a wall.
 */
export function legalizePlumbEmberFall(
  column: PlumbEmber,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): PlumbEmberFall {
  const raw = rawPlumbEmberFall(column);
  const battle = floodPlumbEmberBattleGraph(player, ctx);
  if (!acceptCell(plumbEmberOrb(raw), spawn, ctx, battle, new Set())) {
    return { kind: "stay", reason: "off-graph" };
  }
  return { kind: "fall", column: raw };
}

/**
 * Apply one round start. The fall lands only when the next cell still
 * sits on the fight graph. A dropped hop keeps the current cell so later
 * ticks retry the same legalize instead of punching.
 */
export function resolvePlumbEmberAfterRoundStart(
  column: PlumbEmber,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): PlumbEmber {
  const action = legalizePlumbEmberFall(column, player, ctx, spawn);
  if (action.kind === "fall") return action.column;
  return clonePlumbEmber(column);
}

/**
 * Raw catalog 4-cell column from the occupancy grid, then snap so all
 * four cells sit on the fight graph. `null` when the fight graph cannot
 * host a 4-cell south run.
 */
export function resolvePlumbEmber(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  dest?: PlumbEmber,
  existing?: ReadonlySet<string>,
  spawn: OccCell = player,
): PlumbEmber | null {
  const raw =
    dest ??
    (rng
      ? pickPlumbEmberColumn(rawPlumbEmberColumns(ctx, spawn, existing), rng)
      : (rawPlumbEmberColumns(ctx, spawn, existing)[0] ?? null));
  if (!raw) return null;
  return legalizePlumbEmberPlacement(
    raw,
    player,
    ctx,
    existing ?? new Set(),
    spawn,
  );
}

/**
 * Live round-start fall of a painted 4-tile column. Stays on the current
 * cell when the next landing would leave the fight graph.
 */
export function resolvePlumbEmberFall(
  column: PlumbEmber,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): PlumbEmberFall {
  return legalizePlumbEmberFall(column, player, ctx, spawn);
}
