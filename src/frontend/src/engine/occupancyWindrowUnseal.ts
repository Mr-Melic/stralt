/**
 * Catalog Windrow (`WF-HAZ-WINDROW`) plants **two** walkable HP-tax embers
 * (`extraHazardCount` min = max = 2) as a **2-tile bar on one pair of a
 * painted 2×2** and **hops that bar onto the parallel adjacent pair at
 * each round start** (a 2-cycle in-out). Placement is a `"floor"` raster
 * of 2×2 rects that skips portals and Chebyshev ≤ 3 from the **legalized
 * spawn** (`SPAWN_SAFE_RADIUS` / `isTileReservedForSpawnOrPortal`, not
 * grid center `WORLD_GRID_SIZE/2`) with **no** occupancy / void /
 * fight-graph check. Occupancy 1+1 unseal relocates combatants and cannot
 * move the bar. Occupancy floods still walk portals, leftover-islands
 * stays 0, unique-bridge unseal never runs, and the whole 2×2 can sit on
 * a far-side leftover CA crumb or a floor-under-void — the −5% max-HP
 * landing tax never appears on the fight graph. The occupancy-blind
 * in-out hop then visits that far crumb even when the current pair was
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
 * Shift Slab / Raise Slab / Ratchet Cog / Turnstile Ember / Twin Sparks
 * helpers (#589–#1275). Those snap units, rewrite walls, plant
 * impassable voids, plant walkable tax, plant one chasing orb, plant a
 * clockwise **4-cycle square**, plant a 3-tile one-way lane, plant
 * delayed walls after three leaves **or three round-starts**, plant
 * teleports, plant a 1 AP wall **roll**, rewrite every body, plant one
 * unarmed extra portal, plant a 5-tile reverse nave, plant a two-cell
 * oscillating **wall pair**, plant a 1 AP floor→wall pry, plant a
 * **2-cell adjacent HP-tax swap**, plant a **4-arm plus clockwise
 * rotate**, or plant a **4-tile collinear opposite-pair swap**. This is
 * a **walkable 2-tile bar that hops onto the parallel pair of a painted
 * 2×2** (2-cycle in-out; consecutive bar cells Manhattan 1; hop
 * Manhattan 1 perpendicular to the bar — not a collinear 4-tile line,
 * not a filled 2×2 with one orb, not a plus, not two adjacent cells
 * only, not two independent even/odd vents). `#1013` is walk-blockers
 * (impassable). `#1071` is Orbiting Cinder (one orb, 4-cycle square).
 * `#1086` is Gutter Steam (two even/odd vents, in place). `#1201` is
 * Pendulum Censer (5-tile reverse). `#1258` is Ratchet Cog (one cog, two
 * adjacent cells, no parallel pair). `#1265` is Turnstile Ember (one
 * ember, 4-arm plus). `#1275` is Twin Sparks (two orbs on a 4-tile
 * **line**). Unique-corridor / destacked-player / occupied dests stay
 * when all four painted cells are fight-graph floor (walk flood
 * unchanged). A 1-wide cannot host a 2×2 (unlike Twin Sparks). Drop
 * leftover-island rects rather than punch. Hop onto portal / void /
 * leftover crumb **stays** (drop the hop). Occupied next pair **hops**
 * (landing tax). Both pairs must be fight-graph floor — the bar visits
 * each.
 *
 * Fight-graph snap of the 2×2 (keep barAxis + phase). Does not restack
 * occupancy.ts, occupancyTwinSparksUnseal, occupancyTurnstileEmberUnseal,
 * occupancyRatchetCogUnseal, occupancyOrbitingCinderUnseal,
 * occupancyGutterSteamUnseal, occupancyWalkBlockerUnseal,
 * WorldExploration, worldFeatures.ts, useBossSystem, targeting.ts, or
 * mapGen.simulate.ts.
 */

import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";

/** Catalog `extraHazardCount` for Windrow is exactly two bar cells. */
export const WINDROW_BAR_SIZE = 2;

/** One Windrow plant is one 2×2. */
export const WINDROW_COUNT = 1;

/** Painted track is four cells of a filled 2×2. */
export const WINDROW_RECT_SIZE = 4;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const WINDROW_SPAWN_CLEAR = 3;

/** Catalog landing tax as a fraction of current max HP. */
export const WINDROW_HP_TAX_PCT = 0.05;

export const WINDROW_FEATURE_ID = "WF-HAZ-WINDROW";

/**
 * `h` = the bar occupies a row and hops south/north onto the other row.
 * `v` = the bar occupies a column and hops east/west onto the other column.
 */
export type WindrowBarAxis = "h" | "v";

export type WindrowRect = {
  /** Top-left of the painted 2×2. */
  origin: OccCell;
  barAxis: WindrowBarAxis;
  /**
   * 0 = origin-side pair (north row if `h`, west column if `v`).
   * 1 = far-side pair (south row if `h`, east column if `v`).
   */
  phase: 0 | 1;
};

export type WindrowStayReason = "off-graph";

export type WindrowHop =
  | { kind: "stay"; reason: WindrowStayReason }
  | { kind: "hop"; rect: WindrowRect };

const ORTH: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const AXES: ReadonlyArray<WindrowBarAxis> = ["h", "v"];

function gridSize(ctx: OccupancyContext): { w: number; h: number } {
  const h = ctx.tiles.length;
  const w = ctx.tiles[0]?.length ?? 0;
  return { w, h };
}

function inGrid(cell: OccCell, w: number, h: number): boolean {
  return cell.x >= 0 && cell.y >= 0 && cell.x < w && cell.y < h;
}

export function clampWindrowPhase(phase: number): 0 | 1 {
  return phase % 2 === 0 ? 0 : 1;
}

export function cloneWindrowRect(rect: WindrowRect): WindrowRect {
  return {
    origin: { x: rect.origin.x, y: rect.origin.y },
    barAxis: rect.barAxis,
    phase: clampWindrowPhase(rect.phase),
  };
}

/** Two phases share one painted 2×2 and one bar axis. */
export function windrowRectKey(rect: WindrowRect): string {
  return `${occKey(rect.origin.x, rect.origin.y)}:${rect.barAxis}`;
}

/** Four painted cells of the filled 2×2, row-major from `origin`. */
export function windrowCells(rect: WindrowRect): OccCell[] {
  const { x, y } = rect.origin;
  return [
    { x, y },
    { x: x + 1, y },
    { x, y: y + 1 },
    { x: x + 1, y: y + 1 },
  ];
}

/** Live bar cells. Catalog extraHazard budget is these two tiles. */
export function windrowBar(rect: WindrowRect): OccCell[] {
  const { x, y } = rect.origin;
  const phase = clampWindrowPhase(rect.phase);
  if (rect.barAxis === "h") {
    const row = y + phase;
    return [
      { x, y: row },
      { x: x + 1, y: row },
    ];
  }
  const col = x + phase;
  return [
    { x: col, y },
    { x: col, y: y + 1 },
  ];
}

/** The two empty 2×2 cells the player may stand on this round. */
export function windrowEmpty(rect: WindrowRect): OccCell[] {
  return windrowBar({
    origin: rect.origin,
    barAxis: rect.barAxis,
    phase: clampWindrowPhase(rect.phase + 1),
  });
}

/** Bar cells are Manhattan 1, like Ratchet Cog's pair — but a parallel pair remains. */
export function windrowBarManhattan(rect: WindrowRect): number {
  const bar = windrowBar(rect);
  const a = bar[0];
  const b = bar[1];
  if (!a || !b) return -1;
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * Each bar cell hops Manhattan 1 perpendicular to the bar. Twin Sparks
 * opposite orbs are Manhattan 2 along a line. Orbiting Cinder moves one
 * orb around a 2×2.
 */
export function windrowHopManhattan(rect: WindrowRect): number {
  const before = windrowBar(rect);
  const after = windrowBar(rawWindrowHop(rect));
  const a0 = before[0];
  const a1 = before[1];
  const b0 = after[0];
  const b1 = after[1];
  if (!a0 || !a1 || !b0 || !b1) return -1;
  const d0 = Math.abs(a0.x - b0.x) + Math.abs(a0.y - b0.y);
  const d1 = Math.abs(a1.x - b1.x) + Math.abs(a1.y - b1.y);
  if (d0 !== d1) return -1;
  return d0;
}

/**
 * Painted run is a filled 2×2 (both axes), not Twin Sparks' collinear
 * 4-tile line and not Turnstile Ember's hollow plus.
 */
export function windrowIsRectNotLine(rect: WindrowRect): boolean {
  const cells = windrowCells(rect);
  if (cells.length !== WINDROW_RECT_SIZE) return false;
  const keys = new Set(cells.map((cell) => occKey(cell.x, cell.y)));
  if (keys.size !== WINDROW_RECT_SIZE) return false;
  const xs = new Set(cells.map((cell) => cell.x));
  const ys = new Set(cells.map((cell) => cell.y));
  if (xs.size !== 2 || ys.size !== 2) return false;
  if (windrowBarManhattan(rect) !== 1) return false;
  if (windrowHopManhattan(rect) !== 1) return false;
  return windrowBar(rect).length === WINDROW_BAR_SIZE;
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 * Windrow is **not** a cut (walk occupancy is floor).
 */
export function floodWindrowBattleGraph(
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

export function isOnWindrowBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodWindrowBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the player cannot step on either live bar cell (gate, void,
 * leftover crumb). The Windrow landing tax then never hits the fight graph.
 */
export function windrowUnreachable(
  player: OccCell,
  rect: WindrowRect | null,
  ctx: OccupancyContext,
): boolean {
  if (!rect) return true;
  return windrowBar(rect).every(
    (cell) => !isOnWindrowBattleGraph(cell, player, ctx),
  );
}

/** True when none of the four painted cells sit on the fight graph. */
export function windrowRectUnreachable(
  player: OccCell,
  rect: WindrowRect,
  ctx: OccupancyContext,
): boolean {
  return windrowCells(rect).every(
    (cell) => !isOnWindrowBattleGraph(cell, player, ctx),
  );
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isWindrowSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= WINDROW_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= WINDROW_SPAWN_CLEAR
  );
}

/**
 * Raw catalog 2×2s: row-major origins whose four cells are `"floor"`
 * outside spawn±3. Occupancy `tiles` is `!== "wall"` (floor OR portal);
 * production `=== "floor"` skips the gate. No occupancy / void /
 * fight-graph check — leftover crumbs and floor-under-void are included.
 * `existing` skips already-budgeted hazard keys (`MAX_HAZARD_TILES`).
 * Default: origin-side pair (phase 0).
 */
export function rawWindrowRects(
  ctx: OccupancyContext,
  spawn: OccCell,
  existing?: ReadonlySet<string>,
): WindrowRect[] {
  const rects: WindrowRect[] = [];
  const { w, h } = gridSize(ctx);
  const eligible = (x: number, y: number): boolean => {
    if (!inGrid({ x, y }, w, h)) return false;
    if (!ctx.tiles[y]?.[x]) return false;
    const k = occKey(x, y);
    if (ctx.portals.has(k)) return false;
    if (isWindrowSpawnClear(x, y, spawn)) return false;
    if (existing?.has(k)) return false;
    return true;
  };
  for (let oy = 0; oy < h; oy++) {
    for (let ox = 0; ox < w; ox++) {
      for (const barAxis of AXES) {
        const rect: WindrowRect = {
          origin: { x: ox, y: oy },
          barAxis,
          phase: 0,
        };
        const cells = windrowCells(rect);
        if (cells.length !== WINDROW_RECT_SIZE) continue;
        if (!cells.every((cell) => eligible(cell.x, cell.y))) continue;
        rects.push(rect);
      }
    }
  }
  return rects;
}

/** Catalog Windrow plants one 2×2 (two bar cells). */
export function pickWindrowCount(): number {
  return WINDROW_COUNT;
}

/** Fisher–Yates pick of `count` rects; rng picks origin-side vs far-side pair. */
export function pickWindrowRects(
  rects: readonly WindrowRect[],
  rng: () => number,
  count: number = WINDROW_COUNT,
): WindrowRect[] {
  const shuffled = rects.map((rect) => cloneWindrowRect(rect));
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }
  const n = Math.min(count, shuffled.length);
  return shuffled.slice(0, n).map((rect) => ({
    origin: { x: rect.origin.x, y: rect.origin.y },
    barAxis: rect.barAxis,
    phase: clampWindrowPhase(Math.floor(rng() * 2)),
  }));
}

/**
 * Occupancy-blind round-start hop. Unlike Twin Sparks this hops a **2-tile
 * bar** onto the parallel pair of a 2×2 (not opposite cells of a 4-tile
 * line). Unlike Orbiting Cinder / Turnstile Ember this is a 2-cycle, not
 * a 4-cycle. Unlike Ratchet Cog the painted track is four cells, not two.
 * Unlike Gutter Steam the bar hops; it does not jet in place.
 */
export function rawWindrowHop(rect: WindrowRect): WindrowRect {
  return {
    origin: { x: rect.origin.x, y: rect.origin.y },
    barAxis: rect.barAxis,
    phase: clampWindrowPhase(rect.phase + 1),
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
  if (isWindrowSpawnClear(cell.x, cell.y, spawn)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  return battle.has(k);
}

function acceptRect(
  rect: WindrowRect,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
): boolean {
  const cells = windrowCells(rect);
  const keys = new Set(cells.map((cell) => occKey(cell.x, cell.y)));
  if (keys.size !== WINDROW_RECT_SIZE) return false;
  if (!windrowIsRectNotLine(rect)) return false;
  if (windrowBar(rect).length !== WINDROW_BAR_SIZE) return false;
  return cells.every((cell) => acceptCell(cell, spawn, ctx, battle, placed));
}

function preferRectAtOrigin(
  origin: OccCell,
  dest: WindrowRect,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
): WindrowRect | null {
  const keep: WindrowRect = {
    origin: { x: origin.x, y: origin.y },
    barAxis: dest.barAxis,
    phase: dest.phase,
  };
  if (acceptRect(keep, spawn, ctx, battle, placed)) return keep;
  for (const barAxis of AXES) {
    if (barAxis === dest.barAxis) continue;
    const rect: WindrowRect = {
      origin: { x: origin.x, y: origin.y },
      barAxis,
      phase: dest.phase,
    };
    if (acceptRect(rect, spawn, ctx, battle, placed)) return rect;
  }
  return null;
}

/**
 * Relocate a Windrow 2×2 onto four fight-graph cells so **both** pairs
 * are steppable. Returns `null` when the fight graph cannot host a 2×2
 * (caller drops the hazard instead of punching). Unique-corridor overlap
 * stays legal only when a 2-wide pocket exists outside spawn±3. Covering
 * a destacked player outside spawn±3 stays legal. Occupied fight-graph
 * cells stay legal (no occupancy filter — landing tax). Leftover-island
 * dests snap onto the fight graph or drop — they must not punch a join.
 * Unlike BOARD_CLAIM, one steppable cell of four is not enough. Unlike
 * Ratchet Cog, two adjacent cells are not enough. Unlike Twin Sparks, a
 * 1-wide of length ≥ 4 is not enough.
 */
export function legalizeWindrowPlacement(
  dest: WindrowRect,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
  spawn: OccCell = player,
): WindrowRect | null {
  const { w, h } = gridSize(ctx);
  const battle = floodWindrowBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const tryOrigin = (origin: OccCell): WindrowRect | null =>
    preferRectAtOrigin(origin, dest, spawn, ctx, battle, placed);
  const direct = tryOrigin(dest.origin);
  if (direct) return direct;
  const origins: OccCell[] = [
    { x: dest.origin.x, y: dest.origin.y },
    ...windrowBar(dest),
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
 * Snap several Windrow 2×2s off leftover crumbs, voids, portals, and the
 * spawn diamond. Unique-corridor overlap stays when a 2×2 fits. Drops a
 * rect that cannot legalize. Does not restack occupancy unseal or punch
 * walls.
 */
export function legalizeWindrowPlacements(
  dests: readonly WindrowRect[],
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
  already: ReadonlySet<string> = new Set(),
): WindrowRect[] {
  const placed = new Set(already);
  const result: WindrowRect[] = [];
  const seen = new Set<string>();
  for (const dest of dests) {
    const snapped = legalizeWindrowPlacement(dest, player, ctx, placed, spawn);
    if (!snapped) continue;
    const id = windrowRectKey(snapped);
    if (seen.has(id)) continue;
    const cells = windrowCells(snapped);
    if (cells.some((cell) => placed.has(occKey(cell.x, cell.y)))) continue;
    seen.add(id);
    for (const cell of cells) placed.add(occKey(cell.x, cell.y));
    result.push(snapped);
  }
  return result;
}

function hopOffGraph(
  rect: WindrowRect,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell,
): boolean {
  const battle = floodWindrowBattleGraph(player, ctx);
  return windrowBar(rect).some(
    (cell) => !acceptCell(cell, spawn, ctx, battle, new Set()),
  );
}

/**
 * Occupancy-blind round-start hop. If either next-pair cell is a portal,
 * spawn diamond, void, or leftover crumb, **drop the hop** (stay) rather
 * than snap the 2×2 sideways or hop the choke. Unlike initial placement,
 * hop must not relocate the painted 2×2 onto a different origin. Occupied
 * next pair still hops — landing tax, not a wall.
 */
export function legalizeWindrowHop(
  rect: WindrowRect,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): WindrowHop {
  const raw = rawWindrowHop(rect);
  if (hopOffGraph(raw, player, ctx, spawn)) {
    return { kind: "stay", reason: "off-graph" };
  }
  return { kind: "hop", rect: raw };
}

/**
 * Apply one round start. The hop lands only when both next-pair cells still
 * sit on the fight graph. A dropped hop keeps the current pair so later
 * ticks retry the same legalize instead of punching.
 */
export function resolveWindrowAfterRoundStart(
  rect: WindrowRect,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): WindrowRect {
  const action = legalizeWindrowHop(rect, player, ctx, spawn);
  if (action.kind === "hop") return action.rect;
  return cloneWindrowRect(rect);
}

/**
 * Raw catalog 2×2s from the occupancy grid, then snap so all four cells
 * sit on the fight graph. Empty when the fight graph cannot host a 2×2.
 */
export function resolveWindrow(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  dests?: readonly WindrowRect[],
  existing?: ReadonlySet<string>,
  spawn: OccCell = player,
): WindrowRect[] {
  const raw =
    dests ??
    (rng
      ? pickWindrowRects(
          rawWindrowRects(ctx, spawn, existing),
          rng,
          pickWindrowCount(),
        )
      : rawWindrowRects(ctx, spawn, existing).slice(0, WINDROW_COUNT));
  return legalizeWindrowPlacements(
    raw,
    player,
    ctx,
    spawn,
    existing ?? new Set(),
  );
}

/**
 * Live round-start hop of a painted 2×2. Stays on the current pair when
 * either next cell would leave the fight graph.
 */
export function resolveWindrowHop(
  rect: WindrowRect,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): WindrowHop {
  return legalizeWindrowHop(rect, player, ctx, spawn);
}
