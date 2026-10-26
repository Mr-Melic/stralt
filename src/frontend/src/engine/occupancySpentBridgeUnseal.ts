/**
 * Catalog Spent Bridge (`WF-OBS-SPENT_BRIDGE`) plants **one** short-path
 * floor cell with three painted pips from a `"floor"` raster that skips
 * portals and Chebyshev ≤ 3 from the **legalized spawn**
 * (`SPAWN_SAFE_RADIUS` / `isTileReservedForSpawnOrPortal`, not grid center
 * `WORLD_GRID_SIZE/2`) with **no** occupancy / void / fight-graph check.
 * `extraHazardCount` is omitted so `extraHazardRoll` would plant nothing.
 * Occupancy 1+1 unseal relocates combatants and cannot move the marker or
 * lift the wall after the third leave. Occupancy floods still walk portals,
 * leftover-islands stays 0, unique-bridge unseal never runs, and the dest
 * can sit on a unique player→exit corridor or a far-side leftover CA crumb
 * — the cell stays walkable until three units leave it, then occupancy-blind
 * collapse walls the tile and seals the unlocked portal.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swapPositions /
 * ignore-walls / ghost raster / Eternal Pawn advance / Twin Bishop /
 * summoner midpoint / VOID / ANCHOR / SPIKE / LAVA / greedy moveToward /
 * erratic / king-step / SHOCK / ILLUSION / LARVAE / INK_VEIL / adjacent
 * SpawnData / BOARD_CLAIM / Void Rift / eligibleHazard / walk-blocker /
 * Creeping Ash / Ember Vein / Hunting Lantern / Orbiting Cinder / Gutter
 * Steam / Frost Pane / Triune Pads helpers (#589–#1103). Those snap units,
 * rewrite walls, plant impassable voids at Manhattan-2, plant generate-time
 * lava/ice/spikes that skip the center 7×7, plant one impassable
 * `blocksWalk` cell **immediately**, plant one contiguous 3-tile orthogonal
 * lane, plant 3–6 independent always-on dests, plant one chasing orb, plant
 * a closed 4-cycle square, plant two independent even/odd vents, plant one
 * walkable LoS wall, or plant a 3-pad clockwise carousel. This is a
 * **delayed floor→wall after three leaves** (walkable until the third leave;
 * then wall occupancy — not HP/AP tax, not a painted lane, not a chase, not
 * a 2×2, not two vents, not a LoS wall, not a teleport swap). `#1013` is
 * walk-blockers (immediate wall; occupied / player dests snap off). `#732`
 * ADVANCE is one orthogonal step of a *unit*. Unique-corridor dests snap
 * off at plant (catalog: evaluate solvability as if already a wall). Occupied
 * / destacked-player dests on a dual path **stay** (walkable until leave).
 * Drop leftover-island dests rather than punch. Collapse onto a unique
 * corridor / portal / void / leftover crumb **stays painted as floor**
 * (drop the wall-off) rather than punch.
 *
 * Fight-graph snap of the dest. Does not restack occupancy.ts,
 * occupancyWalkBlockerUnseal, occupancyTriunePadsUnseal,
 * occupancyFrostPaneUnseal, occupancyGutterSteamUnseal,
 * occupancyOrbitingCinderUnseal, occupancyHuntingLanternUnseal,
 * occupancyEmberVeinUnseal, occupancyCreepingAshUnseal,
 * occupancyEligibleHazardUnseal, WorldExploration, worldFeatures.ts,
 * useBossSystem, targeting.ts, or mapGen.simulate.ts.
 */

import {
  type OccCell,
  type OccupancyContext,
  occKey,
  occupantsSealProgression,
  progressionReserved,
} from "./occupancy.ts";

/** Catalog mechanic is three shared crossings, then wall. */
export const SPENT_BRIDGE_CROSSINGS = 3;

/** Catalog plants one cell. `extraHazardCount` is omitted. */
export const SPENT_BRIDGE_GENERATE_MIN = 1;
export const SPENT_BRIDGE_GENERATE_MAX = 1;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const SPENT_BRIDGE_SPAWN_CLEAR = 3;

export const SPENT_BRIDGE_FEATURE_ID = "WF-OBS-SPENT_BRIDGE";

export type SpentBridgeStayReason =
  | "pips-remain"
  | "already-collapsed"
  | "not-on-bridge"
  | "would-seal"
  | "off-graph";

export type SpentBridgeCollapse =
  | { kind: "stay"; reason: SpentBridgeStayReason }
  | { kind: "wall"; cell: OccCell };

export type SpentBridgeState = {
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
 * An uncollapsed Spent Bridge is **not** a cut (walk occupancy is floor).
 */
export function floodSpentBridgeBattleGraph(
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

export function isOnSpentBridgeBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodSpentBridgeBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

function withCollapsedBridges(
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
 * route. Catalog: evaluate solvability as if the bridge were already a wall.
 * If the player is standing on a candidate, flood from a neighbor — collapse
 * runs after they leave.
 */
export function spentBridgeSealsProgression(
  player: OccCell,
  extra: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.size === 0) return false;
  const live = withCollapsedBridges(ctx, extra);
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
export function spentBridgeUnreachable(
  player: OccCell,
  dests: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (dests.length === 0) return true;
  return !dests.some((cell) => isOnSpentBridgeBattleGraph(cell, player, ctx));
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isSpentBridgeSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= SPENT_BRIDGE_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= SPENT_BRIDGE_SPAWN_CLEAR
  );
}

export function initialSpentBridgeState(cell: OccCell): SpentBridgeState {
  return {
    cell: { x: cell.x, y: cell.y },
    pipsLeft: SPENT_BRIDGE_CROSSINGS,
    collapsed: false,
  };
}

export function spentBridgeIsWall(state: SpentBridgeState): boolean {
  return state.collapsed;
}

/**
 * Raw catalog dests: row-major `"floor"` cells outside spawn±3. Occupancy
 * `tiles` is `!== "wall"` (floor OR portal); production `=== "floor"` skips
 * the gate. No occupancy / void / fight-graph check — leftover crumbs and
 * floor-under-void are included. `existing` matches a second `blocksWalk`
 * roll (`Do not place on the same cell as another blocksWalk feature`).
 */
export function rawSpentBridgeDests(
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
      if (isSpentBridgeSpawnClear(gx, gy, spawn)) continue;
      if (existing?.has(k)) continue;
      dests.push({ x: gx, y: gy });
    }
  }
  return dests;
}

/** Catalog plants exactly one cell. `extraHazardRoll` is 0 (band omitted). */
export function pickSpentBridgeCount(rng?: () => number): number {
  if (!rng) return SPENT_BRIDGE_GENERATE_MIN;
  return (
    SPENT_BRIDGE_GENERATE_MIN +
    Math.floor(
      rng() * (SPENT_BRIDGE_GENERATE_MAX - SPENT_BRIDGE_GENERATE_MIN + 1),
    )
  );
}

/** Fisher–Yates pick of `count` dests. */
export function pickSpentBridgeDests(
  dests: readonly OccCell[],
  rng: () => number,
  count: number = SPENT_BRIDGE_GENERATE_MIN,
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

function acceptSpentBridgeLanding(
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
  if (isSpentBridgeSpawnClear(cell.x, cell.y, spawn)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  if (!battle.has(k)) return false;
  if (reserved.has(k) && k !== occKey(player.x, player.y)) return false;
  return !spentBridgeSealsProgression(player, [{ x: cell.x, y: cell.y }], ctx);
}

/**
 * Relocate a Spent Bridge onto a fight-graph dump cell that still reaches
 * an exit after the third leave walls it. Returns `null` when every
 * candidate would seal (caller drops the bridge instead of punching a
 * leftover island). Unique-corridor overlap must not stay. Covering a
 * destacked player / occupied fight-graph cell on a dual path stays legal
 * (walkable until leave). Leftover-island dests snap onto the fight graph
 * or drop — they must not punch a join.
 */
export function legalizeSpentBridgePlacement(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
  spawn: OccCell = player,
): OccCell | null {
  const { w, h } = gridSize(ctx);
  const battle = floodSpentBridgeBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const reserved = progressionReserved(ctx, player);
  const ok = (cell: OccCell) =>
    acceptSpentBridgeLanding(
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
 * Snap several Spent Bridge dests off unique corridors, leftover crumbs,
 * voids, and the spawn diamond. Drops a dest that cannot legalize. Does
 * not restack occupancy unseal or punch walls.
 */
export function legalizeSpentBridgePlacements(
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
    live = withCollapsedBridges(live, prior);
  }
  for (const dest of dests) {
    const snapped = legalizeSpentBridgePlacement(
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
    live = withCollapsedBridges(live, [snapped]);
  }
  return result;
}

/**
 * Occupancy-blind third leave. Production walls the painted cell even when
 * it is a unique corridor, a leftover crumb, a portal, or a void.
 */
export function rawSpentBridgeCollapse(
  state: SpentBridgeState,
  from: OccCell,
): SpentBridgeCollapse {
  if (state.collapsed) {
    return { kind: "stay", reason: "already-collapsed" };
  }
  if (occKey(from.x, from.y) !== occKey(state.cell.x, state.cell.y)) {
    return { kind: "stay", reason: "not-on-bridge" };
  }
  if (state.pipsLeft > 0) {
    return { kind: "stay", reason: "pips-remain" };
  }
  return { kind: "wall", cell: { x: state.cell.x, y: state.cell.y } };
}

function acceptSpentBridgeCollapse(
  cell: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): boolean {
  const k = occKey(cell.x, cell.y);
  if (ctx.portals.has(k)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!isOnSpentBridgeBattleGraph(cell, player, ctx)) return false;
  return !spentBridgeSealsProgression(player, [cell], ctx);
}

/**
 * Occupancy-blind third-leave wall-off. If collapsing the painted cell
 * would seal a unique corridor, sit on a leftover crumb, a portal, or a
 * void, **drop the wall-off** (stay painted as floor) rather than snap
 * the bridge sideways or punch a join. Unlike initial placement, collapse
 * must not relocate the marker onto a different origin.
 */
export function legalizeSpentBridgeCollapse(
  state: SpentBridgeState,
  from: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): SpentBridgeCollapse {
  const raw = rawSpentBridgeCollapse(state, from);
  if (raw.kind === "stay") return raw;
  const k = occKey(raw.cell.x, raw.cell.y);
  if (
    ctx.portals.has(k) ||
    ctx.voidTiles.has(k) ||
    ctx.barriers.has(k) ||
    !isOnSpentBridgeBattleGraph(raw.cell, player, ctx)
  ) {
    return { kind: "stay", reason: "off-graph" };
  }
  if (!acceptSpentBridgeCollapse(raw.cell, player, ctx)) {
    return { kind: "stay", reason: "would-seal" };
  }
  return raw;
}

export function recordSpentBridgeLeave(
  state: SpentBridgeState,
  from: OccCell,
): SpentBridgeState {
  if (state.collapsed) return state;
  if (occKey(from.x, from.y) !== occKey(state.cell.x, state.cell.y)) {
    return state;
  }
  if (state.pipsLeft <= 0) return state;
  return { ...state, pipsLeft: state.pipsLeft - 1 };
}

/**
 * Apply one leave of the painted cell. The third leave walls the tile only
 * when that wall still leaves a player→exit route. A dropped collapse
 * stays floor (`collapsed` false, `pipsLeft` 0) so later leaves retry the
 * same legalize instead of punching.
 */
export function resolveSpentBridgeAfterLeave(
  state: SpentBridgeState,
  from: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): SpentBridgeState {
  const next = recordSpentBridgeLeave(state, from);
  if (next.collapsed) return next;
  if (occKey(from.x, from.y) !== occKey(state.cell.x, state.cell.y)) {
    return next;
  }
  const collapse = legalizeSpentBridgeCollapse(next, from, player, ctx);
  if (collapse.kind === "wall") {
    return { ...next, pipsLeft: 0, collapsed: true };
  }
  return next;
}

/**
 * Raw catalog dests from the occupancy grid, then snap so the bridge sits
 * on a non-cut-vertex fight-graph cell. Empty when the fight graph cannot
 * host a delayed wall plant.
 */
export function resolveSpentBridge(
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
      ? pickSpentBridgeDests(
          rawSpentBridgeDests(ctx, spawn, existing),
          rng,
          pickSpentBridgeCount(rng),
        )
      : rawSpentBridgeDests(ctx, spawn, existing).slice(
          0,
          SPENT_BRIDGE_GENERATE_MIN,
        ));
  return legalizeSpentBridgePlacements(
    raw,
    player,
    ctx,
    spawn,
    existing ?? new Set(),
  );
}

/**
 * Live third-leave collapse of a painted bridge. Stays floor when the wall
 * would leave the fight graph or seal every exit.
 */
export function resolveSpentBridgeCollapse(
  state: SpentBridgeState,
  from: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): SpentBridgeCollapse {
  return legalizeSpentBridgeCollapse(state, from, player, ctx);
}
