/**
 * Catalog Skipping Cinder (`WF-HAZ-SKIP_CINDER`) plants **one** walkable
 * HP-tax cinder (`extraHazardCount` min = max = 1) that occupies one cell
 * of a painted **5-tile orthogonal line** and **hops two tiles along that
 * line at each round start, wrapping**. Cells it skips this hop are safe.
 * Placement is a `"floor"` raster of 5-cell orthogonal runs that skips
 * portals and Chebyshev ≤ 3 from the **legalized spawn**
 * (`SPAWN_SAFE_RADIUS` / `isTileReservedForSpawnOrPortal`, not grid
 * center `WORLD_GRID_SIZE/2`) with **no** occupancy / void / fight-graph
 * check. Occupancy 1+1 unseal relocates combatants and cannot move the
 * cinder. Occupancy floods still walk portals, leftover-islands stays 0,
 * unique-bridge unseal never runs, and the whole line can sit on a
 * far-side leftover CA crumb or a floor-under-void — the −5% max-HP
 * landing tax never appears on the fight graph. The occupancy-blind
 * wrap hop then visits that far crumb even when the current cell was
 * still on the fight graph.
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
 * Windrow helpers (#589–#1283). Those snap units, rewrite walls, plant
 * impassable voids, plant walkable tax, plant one chasing orb, plant a
 * clockwise **4-cycle square**, plant a 3-tile one-way lane, plant
 * delayed walls after three leaves **or three round-starts**, plant
 * teleports, plant a 1 AP wall **roll**, rewrite every body, plant one
 * unarmed extra portal, plant a **5-tile reverse nave**, plant a two-cell
 * oscillating **wall pair**, plant a 1 AP floor→wall pry, plant a
 * **2-cell adjacent HP-tax swap**, plant a **4-arm plus clockwise
 * rotate**, plant a **4-tile collinear opposite-pair swap**, or plant a
 * **2-tile bar that hops onto the parallel pair of a painted 2×2**. This
 * is a **walkable 5-tile line whose one cinder hops two tiles and
 * wraps** (period 5; skipped cell is the one between; wrap hops
 * Manhattan 3). `#1023` is Creeping Ash (3-tile one-way, 1-tile advance).
 * `#1071` is Orbiting Cinder (one orb, 4-cycle square wrap). `#1201` is
 * Pendulum Censer (5-tile, **1-tile reverse**, never wraps). `#1258` is
 * Ratchet Cog (two adjacent cells). `#1265` is Turnstile Ember (4-arm
 * plus). `#1275` is Twin Sparks (two orbs on a 4-tile line). `#1283` is
 * Windrow (2-tile bar on a 2×2). Unique-corridor / destacked-player /
 * occupied dests stay when all five painted cells are fight-graph floor.
 * A 1-wide of length ≥ 5 stays (unlike Windrow / Turnstile Ember). Drop
 * leftover-island lines rather than punch. Hop onto portal / void /
 * leftover crumb **stays** (drop the hop). Occupied next cell still hops
 * (landing tax). All five painted cells must be fight-graph floor — the
 * cinder visits each.
 *
 * Fight-graph snap of the 5-cell origin (keep heading / index). Does not
 * restack occupancy.ts, occupancyWindrowUnseal, occupancyTwinSparksUnseal,
 * occupancyTurnstileEmberUnseal, occupancyRatchetCogUnseal,
 * occupancyPendulumCenserUnseal, occupancyOrbitingCinderUnseal,
 * occupancyCreepingAshUnseal, occupancyWalkBlockerUnseal,
 * WorldExploration, worldFeatures.ts, useBossSystem, targeting.ts, or
 * mapGen.simulate.ts.
 */

import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";

/** Catalog `extraHazardCount` for Skipping Cinder is exactly one cinder. */
export const SKIP_CINDER_COUNT = 1;

/** Painted track is a 5-cell orthogonal line. */
export const SKIP_CINDER_LINE_LENGTH = 5;

/** Catalog hop is two tiles along the painted line. */
export const SKIP_CINDER_HOP = 2;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const SKIP_CINDER_SPAWN_CLEAR = 3;

/** Catalog landing tax as a fraction of current max HP. */
export const SKIP_CINDER_HP_TAX_PCT = 0.05;

export const SKIP_CINDER_FEATURE_ID = "WF-HAZ-SKIP_CINDER";

export interface SkipCinderHeading {
  dx: number;
  dy: number;
}

/**
 * East and south only. A 5-cell wrap line is the same physical run as its
 * opposite heading, unlike Creeping Ash's one-way cloud.
 */
export const SKIP_CINDER_HEADINGS: readonly SkipCinderHeading[] = [
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
];

export interface SkipCinder {
  origin: OccCell;
  heading: SkipCinderHeading;
  /** 0..4 index along `heading` from `origin`. */
  index: number;
}

export type SkipCinderStayReason = "off-graph";

export type SkipCinderHop =
  | { kind: "stay"; reason: SkipCinderStayReason }
  | { kind: "hop"; line: SkipCinder };

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

function sameHeading(a: SkipCinderHeading, b: SkipCinderHeading): boolean {
  return a.dx === b.dx && a.dy === b.dy;
}

export function clampSkipCinderIndex(index: number): number {
  const n = SKIP_CINDER_LINE_LENGTH;
  const wrapped = ((index % n) + n) % n;
  return wrapped;
}

export function cloneSkipCinderHeading(
  heading: SkipCinderHeading,
): SkipCinderHeading {
  return { dx: heading.dx, dy: heading.dy };
}

export function cloneSkipCinder(line: SkipCinder): SkipCinder {
  return {
    origin: { x: line.origin.x, y: line.origin.y },
    heading: cloneSkipCinderHeading(line.heading),
    index: clampSkipCinderIndex(line.index),
  };
}

/** Five painted cells from `origin` along `heading`. */
export function skipCinderCells(
  origin: OccCell,
  heading: SkipCinderHeading,
): OccCell[] {
  const cells: OccCell[] = [];
  for (let i = 0; i < SKIP_CINDER_LINE_LENGTH; i++) {
    cells.push({
      x: origin.x + heading.dx * i,
      y: origin.y + heading.dy * i,
    });
  }
  return cells;
}

/** The live cinder cell. Catalog extraHazard budget is this one tile. */
export function skipCinderOrb(line: SkipCinder): OccCell {
  const cells = skipCinderCells(line.origin, line.heading);
  const i = clampSkipCinderIndex(line.index);
  const cell = cells[i] ?? cells[0];
  return { x: cell.x, y: cell.y };
}

/**
 * The one cell between the current orb and the landing. Catalog: skipped
 * cells this hop are safe (no landing tax). Wrap 3→0 skips index 4;
 * wrap 4→1 skips index 0.
 */
export function skipCinderSkipped(line: SkipCinder): OccCell {
  const cells = skipCinderCells(line.origin, line.heading);
  const i = clampSkipCinderIndex(line.index + 1);
  const cell = cells[i] ?? cells[0];
  return { x: cell.x, y: cell.y };
}

/** Origin + heading identify one painted line; index is the live orb. */
export function skipCinderLineKey(line: SkipCinder): string {
  return `${occKey(line.origin.x, line.origin.y)}:${line.heading.dx},${line.heading.dy}`;
}

/**
 * True when the +2 hop wraps past the last painted cell (index 3→0 or
 * 4→1). Pendulum Censer never wraps — it reverses at the ends.
 */
export function skipCinderWraps(line: SkipCinder): boolean {
  const index = clampSkipCinderIndex(line.index);
  return index + SKIP_CINDER_HOP >= SKIP_CINDER_LINE_LENGTH;
}

/**
 * Grid Manhattan between the live orb and the occupancy-blind landing.
 * Non-wrap hops are 2; wrap hops are 3 (the line is only 5 cells).
 * Pendulum's reverse step is always Manhattan 1. Twin Sparks opposite
 * orbs are Manhattan 2 on a **4**-tile line.
 */
export function skipCinderHopManhattan(line: SkipCinder): number {
  const before = skipCinderOrb(line);
  const after = skipCinderOrb(rawSkipCinderHop(line));
  return Math.abs(before.x - after.x) + Math.abs(before.y - after.y);
}

/**
 * Painted run is a 5-cell orthogonal line, not Windrow's filled 2×2,
 * not Turnstile Ember's hollow plus, not Orbiting Cinder's 2×2 square.
 */
export function skipCinderIsLineNotSquare(line: SkipCinder): boolean {
  const cells = skipCinderCells(line.origin, line.heading);
  if (cells.length !== SKIP_CINDER_LINE_LENGTH) return false;
  const keys = new Set(cells.map((cell) => occKey(cell.x, cell.y)));
  if (keys.size !== SKIP_CINDER_LINE_LENGTH) return false;
  const xs = new Set(cells.map((cell) => cell.x));
  const ys = new Set(cells.map((cell) => cell.y));
  const collinear = xs.size === 1 || ys.size === 1;
  if (!collinear) return false;
  if (xs.size === 1 && ys.size === 1) return false;
  for (let i = 1; i < cells.length; i++) {
    const a = cells[i - 1];
    const b = cells[i];
    if (!a || !b) return false;
    if (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) !== 1) return false;
  }
  return true;
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 * Skipping Cinder is **not** a cut (walk occupancy is floor).
 */
export function floodSkipCinderBattleGraph(
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

export function isOnSkipCinderBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodSkipCinderBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the player cannot step on the live cinder (gate, void,
 * leftover crumb). The Skipping Cinder landing tax then never hits the
 * fight graph.
 */
export function skipCinderUnreachable(
  player: OccCell,
  line: SkipCinder | null,
  ctx: OccupancyContext,
): boolean {
  if (!line) return true;
  return !isOnSkipCinderBattleGraph(skipCinderOrb(line), player, ctx);
}

/** True when none of the five painted cells sit on the fight graph. */
export function skipCinderLineUnreachable(
  player: OccCell,
  line: SkipCinder,
  ctx: OccupancyContext,
): boolean {
  return skipCinderCells(line.origin, line.heading).every(
    (cell) => !isOnSkipCinderBattleGraph(cell, player, ctx),
  );
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isSkipCinderSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= SKIP_CINDER_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= SKIP_CINDER_SPAWN_CLEAR
  );
}

/**
 * Raw catalog 5-cell lines: row-major origins whose five cells are
 * `"floor"` outside spawn±3. Occupancy `tiles` is `!== "wall"` (floor OR
 * portal); production `=== "floor"` skips the gate. No occupancy / void /
 * fight-graph check — leftover crumbs and floor-under-void are included.
 * `existing` skips already-budgeted hazard keys (`MAX_HAZARD_TILES`).
 * Default: index 0.
 */
export function rawSkipCinderLines(
  ctx: OccupancyContext,
  spawn: OccCell,
  existing?: ReadonlySet<string>,
): SkipCinder[] {
  const dests: SkipCinder[] = [];
  const { w, h } = gridSize(ctx);
  for (const heading of SKIP_CINDER_HEADINGS) {
    for (let gy = 0; gy < h; gy++) {
      for (let gx = 0; gx < w; gx++) {
        const origin = { x: gx, y: gy };
        const cells = skipCinderCells(origin, heading);
        if (!cells.every((c) => inGrid(c, w, h))) continue;
        if (!cells.every((c) => ctx.tiles[c.y]?.[c.x])) continue;
        if (cells.some((c) => ctx.portals.has(occKey(c.x, c.y)))) continue;
        if (cells.some((c) => isSkipCinderSpawnClear(c.x, c.y, spawn))) {
          continue;
        }
        if (existing && cells.some((c) => existing.has(occKey(c.x, c.y)))) {
          continue;
        }
        dests.push({
          origin,
          heading: cloneSkipCinderHeading(heading),
          index: 0,
        });
      }
    }
  }
  return dests;
}

/** Catalog Skipping Cinder plants one 5-tile line (one cinder). */
export function pickSkipCinderCount(): number {
  return SKIP_CINDER_COUNT;
}

/** Uniform pick of the 5-cell line, then a uniform live index. */
export function pickSkipCinderLine(
  lines: readonly SkipCinder[],
  rng: () => number,
): SkipCinder | null {
  if (lines.length === 0) return null;
  const i = Math.floor(rng() * lines.length);
  const picked = lines[i];
  if (!picked) return null;
  const index = Math.floor(rng() * SKIP_CINDER_LINE_LENGTH);
  return {
    origin: { x: picked.origin.x, y: picked.origin.y },
    heading: cloneSkipCinderHeading(picked.heading),
    index: clampSkipCinderIndex(index),
  };
}

/**
 * Occupancy-blind round-start hop. Unlike Pendulum Censer this hops **two
 * tiles and wraps** (never reverses at the ends). Unlike Creeping Ash this
 * does not translate the painted cells. Unlike Orbiting Cinder this is a
 * 5-cycle line, not a 4-cycle square. Unlike Twin Sparks this is one orb
 * on five cells, not two orbs swapping on four. Unlike Windrow this is a
 * collinear 5-tile line, not a 2-tile bar on a 2×2.
 */
export function rawSkipCinderHop(line: SkipCinder): SkipCinder {
  return {
    origin: { x: line.origin.x, y: line.origin.y },
    heading: cloneSkipCinderHeading(line.heading),
    index: clampSkipCinderIndex(line.index + SKIP_CINDER_HOP),
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
  if (isSkipCinderSpawnClear(cell.x, cell.y, spawn)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  return battle.has(k);
}

function acceptLine(
  line: SkipCinder,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
): boolean {
  const cells = skipCinderCells(line.origin, line.heading);
  if (cells.length !== SKIP_CINDER_LINE_LENGTH) return false;
  if (!skipCinderIsLineNotSquare(line)) return false;
  return cells.every((cell) => acceptCell(cell, spawn, ctx, battle, placed));
}

function preferLineAtOrigin(
  origin: OccCell,
  dest: SkipCinder,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
): SkipCinder | null {
  const keep: SkipCinder = {
    origin: { x: origin.x, y: origin.y },
    heading: cloneSkipCinderHeading(dest.heading),
    index: dest.index,
  };
  if (acceptLine(keep, spawn, ctx, battle, placed)) return keep;
  for (const heading of SKIP_CINDER_HEADINGS) {
    if (sameHeading(heading, dest.heading)) continue;
    const line: SkipCinder = {
      origin: { x: origin.x, y: origin.y },
      heading: cloneSkipCinderHeading(heading),
      index: dest.index,
    };
    if (acceptLine(line, spawn, ctx, battle, placed)) return line;
  }
  return null;
}

/**
 * Relocate a Skipping Cinder 5-cell line onto five fight-graph cells so
 * **every** cell is steppable. Returns `null` when the fight graph cannot
 * host a 5-cell run (caller drops the hazard instead of punching).
 * Unique-corridor overlap stays legal when a 1-wide of length ≥ 5 exists
 * outside spawn±3. Covering a destacked player outside spawn±3 stays
 * legal. Occupied fight-graph cells stay legal (no occupancy filter —
 * landing tax). Leftover-island dests snap onto the fight graph or drop
 * — they must not punch a join. Unlike BOARD_CLAIM, one steppable cell of
 * five is not enough. Unlike Windrow, a 1-wide of length ≥ 5 is enough.
 */
export function legalizeSkipCinderPlacement(
  dest: SkipCinder,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
  spawn: OccCell = player,
): SkipCinder | null {
  const { w, h } = gridSize(ctx);
  const battle = floodSkipCinderBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const tryOrigin = (origin: OccCell): SkipCinder | null =>
    preferLineAtOrigin(origin, dest, spawn, ctx, battle, placed);
  const direct = tryOrigin(dest.origin);
  if (direct) return direct;
  const origins: OccCell[] = [
    { x: dest.origin.x, y: dest.origin.y },
    skipCinderOrb(dest),
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
 * Occupancy-blind round-start hop. If the next landing is a portal, spawn
 * diamond, void, or leftover crumb, **drop the hop** (stay) rather than
 * snap the line sideways or hop the choke. Unlike initial placement, hop
 * must not relocate the painted line onto a different origin. Occupied
 * next cell still hops — landing tax, not a wall. The skipped cell is
 * never taxed and does not block the hop.
 */
export function legalizeSkipCinderHop(
  line: SkipCinder,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): SkipCinderHop {
  const raw = rawSkipCinderHop(line);
  const battle = floodSkipCinderBattleGraph(player, ctx);
  if (!acceptCell(skipCinderOrb(raw), spawn, ctx, battle, new Set())) {
    return { kind: "stay", reason: "off-graph" };
  }
  return { kind: "hop", line: raw };
}

/**
 * Apply one round start. The hop lands only when the next cell still sits
 * on the fight graph. A dropped hop keeps the current cell so later ticks
 * retry the same legalize instead of punching.
 */
export function resolveSkipCinderAfterRoundStart(
  line: SkipCinder,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): SkipCinder {
  const action = legalizeSkipCinderHop(line, player, ctx, spawn);
  if (action.kind === "hop") return action.line;
  return cloneSkipCinder(line);
}

/**
 * Raw catalog 5-cell line from the occupancy grid, then snap so all five
 * cells sit on the fight graph. `null` when the fight graph cannot host a
 * 5-cell run.
 */
export function resolveSkipCinder(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  dest?: SkipCinder,
  existing?: ReadonlySet<string>,
  spawn: OccCell = player,
): SkipCinder | null {
  const raw =
    dest ??
    (rng
      ? pickSkipCinderLine(rawSkipCinderLines(ctx, spawn, existing), rng)
      : (rawSkipCinderLines(ctx, spawn, existing)[0] ?? null));
  if (!raw) return null;
  return legalizeSkipCinderPlacement(
    raw,
    player,
    ctx,
    existing ?? new Set(),
    spawn,
  );
}

/**
 * Live round-start hop of a painted 5-tile line. Stays on the current
 * cell when the next landing would leave the fight graph.
 */
export function resolveSkipCinderHop(
  line: SkipCinder,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): SkipCinderHop {
  return legalizeSkipCinderHop(line, player, ctx, spawn);
}
