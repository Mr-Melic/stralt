/**
 * Catalog Hourglass Arch (`WF-OBS-HOURGLASS_ARCH`) plants **one** short-path
 * floor cell with three painted sand pips from a `"floor"` raster that skips
 * portals and Chebyshev ≤ 3 from the **legalized spawn**
 * (`SPAWN_SAFE_RADIUS` / `isTileReservedForSpawnOrPortal`, not grid center
 * `WORLD_GRID_SIZE/2`) with **no** occupancy / void / fight-graph check.
 * `extraHazardCount` is omitted so `extraHazardRoll` would plant nothing.
 * Occupancy 1+1 unseal relocates combatants and cannot move the marker or
 * lift the wall after the third round start. Occupancy floods still walk
 * portals, leftover-islands stays 0, unique-bridge unseal never runs, and
 * the dest can sit on a unique player→exit corridor or a far-side leftover
 * CA crumb — the cell stays walkable until three round-starts fire, then
 * occupancy-blind collapse walls the tile and seals the unlocked portal.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swapPositions /
 * ignore-walls / ghost raster / Eternal Pawn advance / Twin Bishop /
 * summoner midpoint / VOID / ANCHOR / SPIKE / LAVA / greedy moveToward /
 * erratic / king-step / SHOCK / ILLUSION / LARVAE / INK_VEIL / adjacent
 * SpawnData / BOARD_CLAIM / Void Rift / eligibleHazard / walk-blocker /
 * Creeping Ash / Ember Vein / Hunting Lantern / Orbiting Cinder / Gutter
 * Steam / Frost Pane / Triune Pads / Spent Bridge / Slipstream / Cinder
 * Barrel / MAP_ROTATE / Latch Gate / Pendulum Censer helpers (#589–#1201).
 * Those snap units, rewrite walls, plant impassable voids, plant walkable
 * tax, plant one chasing orb, plant a clockwise 4-cycle square, plant a
 * 3-tile one-way lane, plant delayed walls **after three leaves**, plant
 * teleports, plant a 1 AP wall roll, rewrite every body, plant one unarmed
 * extra portal, or plant a 5-tile reverse nave. This is a **delayed
 * floor→wall after three round-starts** (global clock; nobody needs to
 * leave — not HP/AP tax, not a painted lane, not a chase, not a 2×2, not
 * two vents, not a LoS wall, not a teleport swap, not a 3-leave collapse).
 * `#1013` is walk-blockers (immediate wall; occupied / player dests snap
 * off). `#1127` is Spent Bridge (three **leaves**). Fallen Gate is the
 * inverse (wall→floor after 2 rounds). Unique-corridor dests snap off at
 * plant (catalog: evaluate solvability as if already a wall). Occupied /
 * destacked-player dests on a dual path **stay** (walkable until the third
 * round start). Drop leftover-island dests rather than punch. Collapse onto
 * a unique corridor / portal / void / leftover crumb **stays painted as
 * floor** (drop the wall-off) rather than punch.
 *
 * Fight-graph snap of the dest. Does not restack occupancy.ts,
 * occupancySpentBridgeUnseal, occupancyWalkBlockerUnseal,
 * occupancyPendulumCenserUnseal, occupancyLatchGateUnseal,
 * occupancyCinderBarrelUnseal, occupancySlipstreamUnseal,
 * WorldExploration, worldFeatures.ts, useBossSystem, targeting.ts, or
 * mapGen.simulate.ts.
 */

import {
  type OccCell,
  type OccupancyContext,
  occKey,
  occupantsSealProgression,
  progressionReserved,
} from "./occupancy.ts";

/** Catalog mechanic is three round-starts, then wall. */
export const HOURGLASS_ARCH_ROUNDS = 3;

/** Catalog plants one cell. `extraHazardCount` is omitted. */
export const HOURGLASS_ARCH_GENERATE_MIN = 1;
export const HOURGLASS_ARCH_GENERATE_MAX = 1;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const HOURGLASS_ARCH_SPAWN_CLEAR = 3;

export const HOURGLASS_ARCH_FEATURE_ID = "WF-OBS-HOURGLASS_ARCH";

export type HourglassArchStayReason =
  | "pips-remain"
  | "already-collapsed"
  | "would-seal"
  | "off-graph";

export type HourglassArchCollapse =
  | { kind: "stay"; reason: HourglassArchStayReason }
  | { kind: "wall"; cell: OccCell };

export type HourglassArchState = {
  cell: OccCell;
  pipsLeft: number;
  collapsed: boolean;
};

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

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 * An uncollapsed Hourglass Arch is **not** a cut (walk occupancy is floor).
 */
export function floodHourglassArchBattleGraph(
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

export function isOnHourglassArchBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodHourglassArchBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

function withCollapsedArches(
  ctx: OccupancyContext,
  extra: readonly OccCell[],
): OccupancyContext {
  if (extra.length === 0) return ctx;
  const voidTiles = new Set(ctx.voidTiles);
  for (const cell of extra) voidTiles.add(occKey(cell.x, cell.y));
  return { ...ctx, voidTiles };
}

function walkableNeighbor(
  cell: OccCell,
  ctx: OccupancyContext,
  banned: ReadonlySet<string>,
): OccCell | null {
  const { w, h } = gridSize(ctx);
  for (const [dx, dy] of ORTH) {
    const x = cell.x + dx;
    const y = cell.y + dy;
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    if (!ctx.tiles[y]?.[x]) continue;
    const k = occKey(x, y);
    if (banned.has(k)) continue;
    if (ctx.voidTiles.has(k) || ctx.barriers.has(k) || ctx.portals.has(k)) {
      continue;
    }
    return { x, y };
  }
  return null;
}

/**
 * True when collapsing `extra` into wall occupancy cuts every player→exit
 * route. Catalog: evaluate solvability as if the arch were already a wall.
 * If the player is standing on a candidate at the third round start, flood
 * from a neighbor — the timer fires under them.
 */
export function hourglassArchSealsProgression(
  player: OccCell,
  extra: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.size === 0) return false;
  const live = withCollapsedArches(ctx, extra);
  const extraKeys = new Set(extra.map((c) => occKey(c.x, c.y)));
  let start = player;
  if (extraKeys.has(occKey(player.x, player.y))) {
    const neighbor = walkableNeighbor(player, live, extraKeys);
    if (!neighbor) return true;
    start = neighbor;
  }
  return occupantsSealProgression(
    live.tiles,
    live.voidTiles,
    live.portals,
    start,
    [],
    live.barriers,
  );
}

/**
 * True when no dest sits on the fight graph (gate, void, leftover crumb).
 * The delayed wall then never taxes the battle route.
 */
export function hourglassArchUnreachable(
  player: OccCell,
  dests: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (dests.length === 0) return true;
  return !dests.some((cell) => isOnHourglassArchBattleGraph(cell, player, ctx));
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isHourglassArchSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= HOURGLASS_ARCH_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= HOURGLASS_ARCH_SPAWN_CLEAR
  );
}

export function initialHourglassArchState(cell: OccCell): HourglassArchState {
  return {
    cell: { x: cell.x, y: cell.y },
    pipsLeft: HOURGLASS_ARCH_ROUNDS,
    collapsed: false,
  };
}

export function hourglassArchIsWall(state: HourglassArchState): boolean {
  return state.collapsed;
}

/**
 * Raw catalog dests: row-major `"floor"` cells outside spawn±3. Occupancy
 * `tiles` is `!== "wall"` (floor OR portal); production `=== "floor"` skips
 * the gate. No occupancy / void / fight-graph check — leftover crumbs and
 * floor-under-void are included. `existing` matches a second `blocksWalk`
 * roll (`Do not place on the same cell as another blocksWalk feature`).
 */
export function rawHourglassArchDests(
  ctx: OccupancyContext,
  spawn: OccCell,
  existing?: ReadonlySet<string>,
): OccCell[] {
  const dests: OccCell[] = [];
  const { w, h } = gridSize(ctx);
  for (let gy = 0; gy < h; gy++) {
    for (let gx = 0; gx < w; gx++) {
      if (!ctx.tiles[gy]?.[gx]) continue;
      const k = occKey(gx, gy);
      if (ctx.portals.has(k)) continue;
      if (isHourglassArchSpawnClear(gx, gy, spawn)) continue;
      if (existing?.has(k)) continue;
      dests.push({ x: gx, y: gy });
    }
  }
  return dests;
}

/** Catalog plants exactly one cell. `extraHazardRoll` is 0 (band omitted). */
export function pickHourglassArchCount(rng?: () => number): number {
  if (!rng) return HOURGLASS_ARCH_GENERATE_MIN;
  return (
    HOURGLASS_ARCH_GENERATE_MIN +
    Math.floor(
      rng() * (HOURGLASS_ARCH_GENERATE_MAX - HOURGLASS_ARCH_GENERATE_MIN + 1),
    )
  );
}

/** Fisher–Yates pick of `count` dests. */
export function pickHourglassArchDests(
  dests: readonly OccCell[],
  rng: () => number,
  count: number = HOURGLASS_ARCH_GENERATE_MIN,
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

function acceptHourglassArchLanding(
  cell: OccCell,
  player: OccCell,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
  reserved: Set<string>,
): boolean {
  const { w, h } = gridSize(ctx);
  if (!inGrid(cell, w, h)) return false;
  const k = occKey(cell.x, cell.y);
  if (placed.has(k)) return false;
  if (ctx.portals.has(k)) return false;
  if (isHourglassArchSpawnClear(cell.x, cell.y, spawn)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  if (!battle.has(k)) return false;
  if (reserved.has(k) && k !== occKey(player.x, player.y)) return false;
  return !hourglassArchSealsProgression(
    player,
    [{ x: cell.x, y: cell.y }],
    ctx,
  );
}

/**
 * Relocate an Hourglass Arch onto a fight-graph dump cell that still reaches
 * an exit after the third round start walls it. Returns `null` when every
 * candidate would seal (caller drops the arch instead of punching a leftover
 * island). Unique-corridor overlap must not stay. Covering a destacked
 * player / occupied fight-graph cell on a dual path stays legal (walkable
 * until the timer). Leftover-island dests snap onto the fight graph or drop
 * — they must not punch a join.
 */
export function legalizeHourglassArchPlacement(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
  spawn: OccCell = player,
): OccCell | null {
  const { w, h } = gridSize(ctx);
  const battle = floodHourglassArchBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const reserved = progressionReserved(ctx, player);
  const ok = (cell: OccCell) =>
    acceptHourglassArchLanding(
      cell,
      player,
      spawn,
      ctx,
      battle,
      placed,
      reserved,
    );
  if (ok(dest)) return { x: dest.x, y: dest.y };
  const maxR = Math.max(1, w + h);
  for (let r = 1; r <= maxR; r++) {
    for (let dx = -r; dx <= r; dx++) {
      const dy = r - Math.abs(dx);
      const a = { x: dest.x + dx, y: dest.y + dy };
      if (ok(a)) return a;
      if (dy !== 0) {
        const b = { x: dest.x + dx, y: dest.y - dy };
        if (ok(b)) return b;
      }
    }
  }
  return null;
}

/**
 * Snap several Hourglass Arch dests off unique corridors, leftover crumbs,
 * voids, and the spawn diamond. Drops a dest that cannot legalize. Does
 * not restack occupancy unseal or punch walls.
 */
export function legalizeHourglassArchPlacements(
  dests: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
  already: ReadonlySet<string> = new Set(),
): OccCell[] {
  const placed = new Set(already);
  const result: OccCell[] = [];
  let live = ctx;
  if (already.size > 0) {
    const prior: OccCell[] = [];
    for (const k of already) {
      const [xs, ys] = k.split(",");
      prior.push({ x: Number(xs), y: Number(ys) });
    }
    live = withCollapsedArches(live, prior);
  }
  for (const dest of dests) {
    const snapped = legalizeHourglassArchPlacement(
      dest,
      player,
      live,
      placed,
      spawn,
    );
    if (!snapped) continue;
    const k = occKey(snapped.x, snapped.y);
    placed.add(k);
    result.push(snapped);
    live = withCollapsedArches(live, [snapped]);
  }
  return result;
}

/**
 * Occupancy-blind third round start. Production walls the painted cell even
 * when it is a unique corridor, a leftover crumb, a portal, or a void, and
 * even when nobody left the cell (unlike Spent Bridge).
 */
export function rawHourglassArchCollapse(
  state: HourglassArchState,
): HourglassArchCollapse {
  if (state.collapsed) {
    return { kind: "stay", reason: "already-collapsed" };
  }
  if (state.pipsLeft > 0) {
    return { kind: "stay", reason: "pips-remain" };
  }
  return { kind: "wall", cell: { x: state.cell.x, y: state.cell.y } };
}

function acceptHourglassArchCollapse(
  cell: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): boolean {
  const k = occKey(cell.x, cell.y);
  if (ctx.portals.has(k)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!isOnHourglassArchBattleGraph(cell, player, ctx)) return false;
  return !hourglassArchSealsProgression(player, [cell], ctx);
}

/**
 * Occupancy-blind third-round-start wall-off. If collapsing the painted
 * cell would seal a unique corridor, sit on a leftover crumb, a portal,
 * or a void, **drop the wall-off** (stay painted as floor) rather than
 * snap the arch sideways or punch a join. Unlike initial placement,
 * collapse must not relocate the marker onto a different origin.
 */
export function legalizeHourglassArchCollapse(
  state: HourglassArchState,
  player: OccCell,
  ctx: OccupancyContext,
): HourglassArchCollapse {
  const raw = rawHourglassArchCollapse(state);
  if (raw.kind === "stay") return raw;
  const k = occKey(raw.cell.x, raw.cell.y);
  if (
    ctx.portals.has(k) ||
    ctx.voidTiles.has(k) ||
    ctx.barriers.has(k) ||
    !isOnHourglassArchBattleGraph(raw.cell, player, ctx)
  ) {
    return { kind: "stay", reason: "off-graph" };
  }
  if (!acceptHourglassArchCollapse(raw.cell, player, ctx)) {
    return { kind: "stay", reason: "would-seal" };
  }
  return raw;
}

/** Burn one sand pip at round start. Leaves do not spend pips. */
export function recordHourglassArchRoundStart(
  state: HourglassArchState,
): HourglassArchState {
  if (state.collapsed) return state;
  if (state.pipsLeft <= 0) return state;
  return { ...state, pipsLeft: state.pipsLeft - 1 };
}

/**
 * Apply one round start. The third tick walls the tile only when that wall
 * still leaves a player→exit route. A dropped collapse stays floor
 * (`collapsed` false, `pipsLeft` 0) so later ticks retry the same legalize
 * instead of punching. Nobody needs to leave the cell.
 */
export function resolveHourglassArchAfterRoundStart(
  state: HourglassArchState,
  player: OccCell,
  ctx: OccupancyContext,
): HourglassArchState {
  const next = recordHourglassArchRoundStart(state);
  if (next.collapsed) return next;
  const collapse = legalizeHourglassArchCollapse(next, player, ctx);
  if (collapse.kind === "wall") {
    return { ...next, pipsLeft: 0, collapsed: true };
  }
  return next;
}

/**
 * Raw catalog dests from the occupancy grid, then snap so the arch sits
 * on a non-cut-vertex fight-graph cell. Empty when the fight graph cannot
 * host a delayed wall plant.
 */
export function resolveHourglassArch(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  dests?: readonly OccCell[],
  existing?: ReadonlySet<string>,
  spawn: OccCell = player,
): OccCell[] {
  const raw =
    dests ??
    (rng
      ? pickHourglassArchDests(
          rawHourglassArchDests(ctx, spawn, existing),
          rng,
          pickHourglassArchCount(rng),
        )
      : rawHourglassArchDests(ctx, spawn, existing).slice(
          0,
          HOURGLASS_ARCH_GENERATE_MIN,
        ));
  return legalizeHourglassArchPlacements(
    raw,
    player,
    ctx,
    spawn,
    existing ?? new Set(),
  );
}

/**
 * Live third-round-start collapse of a painted arch. Stays floor when the
 * wall would leave the fight graph or seal every exit.
 */
export function resolveHourglassArchCollapse(
  state: HourglassArchState,
  player: OccCell,
  ctx: OccupancyContext,
): HourglassArchCollapse {
  return legalizeHourglassArchCollapse(state, player, ctx);
}
