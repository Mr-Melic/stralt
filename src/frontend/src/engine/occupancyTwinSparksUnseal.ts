/**
 * Catalog Twin Sparks (`WF-HAZ-TWIN_SPARK`) plants **two** walkable HP-tax
 * orbs (`extraHazardCount` min = max = 2) on **opposite cells of a painted
 * 4-tile orthogonal line** and **swaps them onto the other opposite pair
 * at each round start**. Placement is a `"floor"` raster of 4-cell lines
 * that skips portals and Chebyshev ≤ 3 from the **legalized spawn**
 * (`SPAWN_SAFE_RADIUS` / `isTileReservedForSpawnOrPortal`, not grid center
 * `WORLD_GRID_SIZE/2`) with **no** occupancy / void / fight-graph check.
 * Occupancy 1+1 unseal relocates combatants and cannot move the sparks.
 * Occupancy floods still walk portals, leftover-islands stays 0, unique-
 * bridge unseal never runs, and the whole line can sit on a far-side
 * leftover CA crumb or a floor-under-void — the −5% max-HP landing tax
 * never appears on the fight graph. The occupancy-blind opposite-pair
 * swap then visits that far crumb even when the current pair was still
 * on the fight graph.
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
 * Shift Slab / Raise Slab / Ratchet Cog / Turnstile Ember helpers
 * (#589–#1265). Those snap units, rewrite walls, plant impassable voids,
 * plant walkable tax, plant one chasing orb, plant a clockwise **4-cycle
 * square**, plant a 3-tile one-way lane, plant delayed walls after three
 * leaves **or three round-starts**, plant teleports, plant a 1 AP wall
 * **roll**, rewrite every body, plant one unarmed extra portal, plant a
 * 5-tile reverse nave, plant a two-cell oscillating **wall pair**, plant
 * a 1 AP floor→wall pry, plant a **2-cell adjacent HP-tax swap**, or
 * plant a **4-arm plus clockwise rotate**. This is a **walkable 4-tile
 * line whose two opposite orbs swap onto the other opposite pair** (even
 * indices 0+2 ↔ odd indices 1+3; hop every round start — not a filled
 * 2×2, not a plus, not two adjacent cells, not two independent even/odd
 * vents, not a 2-tile in-out bar, not a 5-tile nave). `#1013` is
 * walk-blockers (impassable). `#1071` is Orbiting Cinder (one orb on a
 * filled 2×2). `#1086` is Gutter Steam (two even/odd vents, in place).
 * `#1201` is Pendulum Censer (5-tile reverse). `#1258` is Ratchet Cog
 * (one cog, two adjacent cells, Manhattan 1). `#1265` is Turnstile Ember
 * (one ember, 4-arm plus, Manhattan 2). Unique-corridor / destacked-
 * player / occupied dests stay when all four painted cells are fight-
 * graph floor (walk flood unchanged). Drop leftover-island lines rather
 * than punch. Swap onto portal / void / leftover crumb **stays** (drop
 * the hop). Occupied next pair **swaps** (landing tax). Both opposite
 * pairs must be fight-graph floor — the sparks visit each. Consecutive
 * painted cells are Manhattan 1; opposite orbs are Manhattan 2.
 *
 * Fight-graph snap of the line (keep axis + phase). Does not restack
 * occupancy.ts, occupancyTurnstileEmberUnseal, occupancyRatchetCogUnseal,
 * occupancyRaiseSlabUnseal, occupancyShiftSlabUnseal,
 * occupancyPendulumCenserUnseal, occupancyOrbitingCinderUnseal,
 * occupancyGutterSteamUnseal, occupancyWalkBlockerUnseal,
 * WorldExploration, worldFeatures.ts, useBossSystem, targeting.ts, or
 * mapGen.simulate.ts.
 */

import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";

/** Catalog `extraHazardCount` for Twin Sparks is exactly two orbs. */
export const TWIN_SPARK_ORB_COUNT = 2;

/** One Twin Sparks plant is one 4-tile line. */
export const TWIN_SPARK_COUNT = 1;

/** Painted track is four collinear orthogonal cells. */
export const TWIN_SPARK_LINE_SIZE = 4;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const TWIN_SPARK_SPAWN_CLEAR = 3;

/** Catalog landing tax as a fraction of current max HP. */
export const TWIN_SPARK_HP_TAX_PCT = 0.05;

export const TWIN_SPARK_FEATURE_ID = "WF-HAZ-TWIN_SPARK";

/** Horizontal = +x; vertical = +y (y-down screen space). */
export type TwinSparkAxis = "h" | "v";

export type TwinSparkLine = {
  /** Cell 0 of the painted 4-tile line. */
  origin: OccCell;
  axis: TwinSparkAxis;
  /**
   * 0 = even opposite pair (indices 0 and 2).
   * 1 = odd opposite pair (indices 1 and 3).
   */
  phase: 0 | 1;
};

export type TwinSparkStayReason = "off-graph";

export type TwinSparkSwap =
  | { kind: "stay"; reason: TwinSparkStayReason }
  | { kind: "swap"; line: TwinSparkLine };

const ORTH: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const AXES: ReadonlyArray<TwinSparkAxis> = ["h", "v"];

function gridSize(ctx: OccupancyContext): { w: number; h: number } {
  const h = ctx.tiles.length;
  const w = ctx.tiles[0]?.length ?? 0;
  return { w, h };
}

function inGrid(cell: OccCell, w: number, h: number): boolean {
  return cell.x >= 0 && cell.y >= 0 && cell.x < w && cell.y < h;
}

export function clampTwinSparkPhase(phase: number): 0 | 1 {
  return phase % 2 === 0 ? 0 : 1;
}

export function cloneTwinSparkLine(line: TwinSparkLine): TwinSparkLine {
  return {
    origin: { x: line.origin.x, y: line.origin.y },
    axis: line.axis,
    phase: clampTwinSparkPhase(line.phase),
  };
}

/** Two phases share one painted line. */
export function twinSparkLineKey(line: TwinSparkLine): string {
  return `${occKey(line.origin.x, line.origin.y)}:${line.axis}`;
}

function axisStep(axis: TwinSparkAxis): OccCell {
  return axis === "h" ? { x: 1, y: 0 } : { x: 0, y: 1 };
}

/** Four painted cells in line order from `origin`. */
export function twinSparkCells(line: TwinSparkLine): OccCell[] {
  const step = axisStep(line.axis);
  const cells: OccCell[] = [];
  for (let i = 0; i < TWIN_SPARK_LINE_SIZE; i++) {
    cells.push({
      x: line.origin.x + step.x * i,
      y: line.origin.y + step.y * i,
    });
  }
  return cells;
}

/** Live orb cells. Catalog extraHazard budget is these two tiles. */
export function twinSparkOrbs(line: TwinSparkLine): OccCell[] {
  const cells = twinSparkCells(line);
  const phase = clampTwinSparkPhase(line.phase);
  const a = cells[phase];
  const b = cells[phase + 2];
  if (!a || !b) return [];
  return [
    { x: a.x, y: a.y },
    { x: b.x, y: b.y },
  ];
}

/** The two empty line cells the player may stand on this round. */
export function twinSparkEmpty(line: TwinSparkLine): OccCell[] {
  return twinSparkOrbs({
    origin: line.origin,
    axis: line.axis,
    phase: clampTwinSparkPhase(line.phase + 1),
  });
}

/** Opposite orbs are Manhattan 2, not Ratchet Cog's adjacent Manhattan 1. */
export function twinSparkOppositeManhattan(line: TwinSparkLine): number {
  const orbs = twinSparkOrbs(line);
  const a = orbs[0];
  const b = orbs[1];
  if (!a || !b) return -1;
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/** Consecutive painted cells are Manhattan 1 (a line, not a 2×2 / plus). */
export function twinSparkIsLineNotSquare(line: TwinSparkLine): boolean {
  const cells = twinSparkCells(line);
  if (cells.length !== TWIN_SPARK_LINE_SIZE) return false;
  const xs = new Set(cells.map((c) => c.x));
  const ys = new Set(cells.map((c) => c.y));
  if (xs.size > 1 && ys.size > 1) return false;
  for (let i = 0; i < cells.length - 1; i++) {
    const a = cells[i];
    const b = cells[i + 1];
    if (!a || !b) return false;
    if (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) !== 1) return false;
  }
  return twinSparkOppositeManhattan(line) === 2;
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 * Twin Sparks is **not** a cut (walk occupancy is floor).
 */
export function floodTwinSparkBattleGraph(
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

export function isOnTwinSparkBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodTwinSparkBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the player cannot step on either live orb (gate, void, leftover
 * crumb). The Twin Sparks landing tax then never hits the fight graph.
 */
export function twinSparkUnreachable(
  player: OccCell,
  line: TwinSparkLine | null,
  ctx: OccupancyContext,
): boolean {
  if (!line) return true;
  return twinSparkOrbs(line).every(
    (orb) => !isOnTwinSparkBattleGraph(orb, player, ctx),
  );
}

/** True when none of the four painted cells sit on the fight graph. */
export function twinSparkLineUnreachable(
  player: OccCell,
  line: TwinSparkLine,
  ctx: OccupancyContext,
): boolean {
  return twinSparkCells(line).every(
    (cell) => !isOnTwinSparkBattleGraph(cell, player, ctx),
  );
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isTwinSparkSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= TWIN_SPARK_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= TWIN_SPARK_SPAWN_CLEAR
  );
}

/**
 * Raw catalog lines: row-major origins whose four collinear cells are
 * `"floor"` outside spawn±3. Occupancy `tiles` is `!== "wall"` (floor OR
 * portal); production `=== "floor"` skips the gate. No occupancy / void /
 * fight-graph check — leftover crumbs and floor-under-void are included.
 * `existing` skips already-budgeted hazard keys (`MAX_HAZARD_TILES`).
 * Default: even opposite pair (phase 0).
 */
export function rawTwinSparkLines(
  ctx: OccupancyContext,
  spawn: OccCell,
  existing?: ReadonlySet<string>,
): TwinSparkLine[] {
  const lines: TwinSparkLine[] = [];
  const { w, h } = gridSize(ctx);
  const eligible = (x: number, y: number): boolean => {
    if (!inGrid({ x, y }, w, h)) return false;
    if (!ctx.tiles[y]?.[x]) return false;
    const k = occKey(x, y);
    if (ctx.portals.has(k)) return false;
    if (isTwinSparkSpawnClear(x, y, spawn)) return false;
    if (existing?.has(k)) return false;
    return true;
  };
  for (let oy = 0; oy < h; oy++) {
    for (let ox = 0; ox < w; ox++) {
      for (const axis of AXES) {
        const line: TwinSparkLine = {
          origin: { x: ox, y: oy },
          axis,
          phase: 0,
        };
        const cells = twinSparkCells(line);
        if (cells.length !== TWIN_SPARK_LINE_SIZE) continue;
        if (!cells.every((cell) => eligible(cell.x, cell.y))) continue;
        lines.push(line);
      }
    }
  }
  return lines;
}

/** Catalog Twin Sparks plants one 4-tile line (two orbs). */
export function pickTwinSparkCount(): number {
  return TWIN_SPARK_COUNT;
}

/** Fisher–Yates pick of `count` lines; rng picks even/odd opposite pair. */
export function pickTwinSparkLines(
  lines: readonly TwinSparkLine[],
  rng: () => number,
  count: number = TWIN_SPARK_COUNT,
): TwinSparkLine[] {
  const shuffled = lines.map((line) => cloneTwinSparkLine(line));
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }
  const n = Math.min(count, shuffled.length);
  return shuffled.slice(0, n).map((line) => ({
    origin: { x: line.origin.x, y: line.origin.y },
    axis: line.axis,
    phase: clampTwinSparkPhase(Math.floor(rng() * 2)),
  }));
}

/**
 * Occupancy-blind round-start hop. Unlike Ratchet Cog this swaps **two
 * orbs** onto the other opposite pair of the same 4-tile line (Manhattan 2
 * between orbs). Unlike Orbiting Cinder / Turnstile Ember this is a
 * 2-cycle, not a 4-cycle. Unlike Gutter Steam the orbs hop; they do not
 * jet in place.
 */
export function rawTwinSparkSwap(line: TwinSparkLine): TwinSparkLine {
  return {
    origin: { x: line.origin.x, y: line.origin.y },
    axis: line.axis,
    phase: clampTwinSparkPhase(line.phase + 1),
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
  if (isTwinSparkSpawnClear(cell.x, cell.y, spawn)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  return battle.has(k);
}

function acceptLine(
  line: TwinSparkLine,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
): boolean {
  const cells = twinSparkCells(line);
  const keys = new Set(cells.map((cell) => occKey(cell.x, cell.y)));
  if (keys.size !== TWIN_SPARK_LINE_SIZE) return false;
  if (!twinSparkIsLineNotSquare(line)) return false;
  if (twinSparkOrbs(line).length !== TWIN_SPARK_ORB_COUNT) return false;
  return cells.every((cell) => acceptCell(cell, spawn, ctx, battle, placed));
}

function preferLineAtOrigin(
  origin: OccCell,
  dest: TwinSparkLine,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
): TwinSparkLine | null {
  const candidates: TwinSparkLine[] = [];
  for (const axis of AXES) {
    const line: TwinSparkLine = {
      origin: { x: origin.x, y: origin.y },
      axis,
      phase: dest.phase,
    };
    if (acceptLine(line, spawn, ctx, battle, placed)) candidates.push(line);
  }
  if (candidates.length === 0) return null;
  const keepAxis = candidates.find((line) => line.axis === dest.axis);
  return keepAxis ?? candidates[0] ?? null;
}

/**
 * Relocate a Twin Sparks line onto four fight-graph cells so **both**
 * opposite pairs are steppable. Returns `null` when the fight graph cannot
 * host a line (caller drops the hazard instead of punching). Unique-
 * corridor overlap stays legal on a 1-wide of length ≥ 4 outside spawn±3.
 * Covering a destacked player outside spawn±3 stays legal. Occupied
 * fight-graph cells stay legal (no occupancy filter — landing tax).
 * Leftover-island dests snap onto the fight graph or drop — they must not
 * punch a join. Unlike BOARD_CLAIM, one steppable cell of four is not
 * enough. Unlike Ratchet Cog, two adjacent cells are not enough.
 */
export function legalizeTwinSparkPlacement(
  dest: TwinSparkLine,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
  spawn: OccCell = player,
): TwinSparkLine | null {
  const { w, h } = gridSize(ctx);
  const battle = floodTwinSparkBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const tryOrigin = (origin: OccCell): TwinSparkLine | null =>
    preferLineAtOrigin(origin, dest, spawn, ctx, battle, placed);
  const direct = tryOrigin(dest.origin);
  if (direct) return direct;
  const origins: OccCell[] = [
    { x: dest.origin.x, y: dest.origin.y },
    ...twinSparkOrbs(dest),
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
 * Snap several Twin Sparks lines off leftover crumbs, voids, portals, and
 * the spawn diamond. Unique-corridor overlap stays when the line fits.
 * Drops a line that cannot legalize. Does not restack occupancy unseal or
 * punch walls.
 */
export function legalizeTwinSparkPlacements(
  dests: readonly TwinSparkLine[],
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
  already: ReadonlySet<string> = new Set(),
): TwinSparkLine[] {
  const placed = new Set(already);
  const result: TwinSparkLine[] = [];
  const seen = new Set<string>();
  for (const dest of dests) {
    const snapped = legalizeTwinSparkPlacement(
      dest,
      player,
      ctx,
      placed,
      spawn,
    );
    if (!snapped) continue;
    const id = twinSparkLineKey(snapped);
    if (seen.has(id)) continue;
    const cells = twinSparkCells(snapped);
    if (cells.some((cell) => placed.has(occKey(cell.x, cell.y)))) continue;
    seen.add(id);
    for (const cell of cells) placed.add(occKey(cell.x, cell.y));
    result.push(snapped);
  }
  return result;
}

function swapOffGraph(
  line: TwinSparkLine,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell,
): boolean {
  const battle = floodTwinSparkBattleGraph(player, ctx);
  return twinSparkOrbs(line).some(
    (orb) => !acceptCell(orb, spawn, ctx, battle, new Set()),
  );
}

/**
 * Occupancy-blind round-start hop. If either next-pair cell is a portal,
 * spawn diamond, void, or leftover crumb, **drop the hop** (stay) rather
 * than snap the line sideways or hop the choke. Unlike initial placement,
 * swap must not relocate the painted line onto a different origin. Occupied
 * next pair still swaps — landing tax, not a wall.
 */
export function legalizeTwinSparkSwap(
  line: TwinSparkLine,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): TwinSparkSwap {
  const raw = rawTwinSparkSwap(line);
  if (swapOffGraph(raw, player, ctx, spawn)) {
    return { kind: "stay", reason: "off-graph" };
  }
  return { kind: "swap", line: raw };
}

/**
 * Apply one round start. The hop lands only when both next-pair cells still
 * sit on the fight graph. A dropped hop keeps the current pair so later
 * ticks retry the same legalize instead of punching.
 */
export function resolveTwinSparksAfterRoundStart(
  line: TwinSparkLine,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): TwinSparkLine {
  const action = legalizeTwinSparkSwap(line, player, ctx, spawn);
  if (action.kind === "swap") return action.line;
  return cloneTwinSparkLine(line);
}

/**
 * Raw catalog lines from the occupancy grid, then snap so all four cells
 * sit on the fight graph. Empty when the fight graph cannot host a line.
 */
export function resolveTwinSparks(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  dests?: readonly TwinSparkLine[],
  existing?: ReadonlySet<string>,
  spawn: OccCell = player,
): TwinSparkLine[] {
  const raw =
    dests ??
    (rng
      ? pickTwinSparkLines(
          rawTwinSparkLines(ctx, spawn, existing),
          rng,
          pickTwinSparkCount(),
        )
      : rawTwinSparkLines(ctx, spawn, existing).slice(0, TWIN_SPARK_COUNT));
  return legalizeTwinSparkPlacements(
    raw,
    player,
    ctx,
    spawn,
    existing ?? new Set(),
  );
}

/**
 * Live round-start hop of a painted line. Stays on the current pair when
 * either next cell would leave the fight graph.
 */
export function resolveTwinSparkSwap(
  line: TwinSparkLine,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): TwinSparkSwap {
  return legalizeTwinSparkSwap(line, player, ctx, spawn);
}
