/**
 * Catalog Raise Slab (`WF-TER-RAISE_SLAB`) plants **one** loose flagstone
 * that starts as clear floor from a `"floor"` raster that skips portals
 * and Chebyshev ≤ 3 from the **legalized spawn** (`SPAWN_SAFE_RADIUS` /
 * `isTileReservedForSpawnOrPortal`, not grid center `WORLD_GRID_SIZE/2`)
 * with **no** occupancy / void / fight-graph check. `extraHazardCount`
 * is omitted so `extraHazardRoll` would plant nothing. Occupancy 1+1
 * unseal relocates combatants and cannot pry the slab or lower it after
 * a 1 AP adjacent raise. Occupancy floods still walk portals,
 * leftover-islands stays 0, unique-bridge unseal never runs, and the
 * dest can sit on a unique player→exit corridor or a far-side leftover
 * CA crumb — occupancy-blind 1 AP pry then walls that cell and seals
 * the unlocked portal.
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
 * Shift Slab helpers (#589–#1213). Those snap units, rewrite walls,
 * plant impassable voids, plant walkable tax, plant one chasing orb,
 * plant a clockwise 4-cycle square, plant a 3-tile one-way lane, plant
 * delayed walls after three leaves **or three round-starts**, plant
 * teleports, plant a 1 AP wall **roll**, rewrite every body, plant one
 * unarmed extra portal, plant a 5-tile reverse nave, or plant a
 * two-cell oscillating **wall pair**. This is a **1 AP adjacent
 * floor→wall pry** (starts floor; permanent wall; cannot lower — not
 * HP/AP tax, not a painted lane, not a chase, not a 2×2, not two vents,
 * not a LoS wall, not a teleport swap, not a 3-leave collapse, not a
 * 3-round-start collapse, not an oscillating pair, not a barrel hop).
 * `#1013` is walk-blockers (immediate wall; occupied / player dests snap
 * off). `#1127` is Spent Bridge (three **leaves**). `#1154` is Cinder
 * Barrel (1 AP cardinal **roll** of an existing wall). `#1209` is
 * Hourglass Arch (three **round-starts**, nobody needs to leave).
 * `#1213` is Shift Slab (two cells; exactly one wall; auto-swap).
 * Fallen Gate is the inverse (wall→floor after 2 rounds). Crumble
 * Pillar is 2 AP smash-to-clear. Unique-corridor dests snap off at
 * plant (catalog: evaluate solvability as if already a wall). Occupied /
 * destacked-player dests on a dual path **stay** (walkable until raised).
 * Drop leftover-island dests rather than punch. Raise onto a unique
 * corridor / portal / void / leftover crumb / occupied body **stays
 * painted as floor** (drop the pry) rather than punch.
 *
 * Fight-graph snap of the dest. Does not restack occupancy.ts,
 * occupancyHourglassArchUnseal, occupancyShiftSlabUnseal,
 * occupancySpentBridgeUnseal, occupancyWalkBlockerUnseal,
 * occupancyCinderBarrelUnseal, occupancyPendulumCenserUnseal,
 * occupancyLatchGateUnseal, WorldExploration, worldFeatures.ts,
 * useBossSystem, targeting.ts, or mapGen.simulate.ts.
 */

import {
  type OccCell,
  type OccupancyContext,
  occKey,
  occupantsSealProgression,
  progressionReserved,
} from "./occupancy.ts";

/** Catalog adjacent 1 AP pry. Cannot lower. */
export const RAISE_SLAB_AP = 1;

/** Catalog plants one cell. `extraHazardCount` is omitted. */
export const RAISE_SLAB_GENERATE_MIN = 1;
export const RAISE_SLAB_GENERATE_MAX = 1;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const RAISE_SLAB_SPAWN_CLEAR = 3;

export const RAISE_SLAB_FEATURE_ID = "WF-TER-RAISE_SLAB";

export type RaiseSlabStayReason =
  | "already-raised"
  | "no-ap"
  | "not-adjacent"
  | "occupied"
  | "would-seal"
  | "off-graph";

export type RaiseSlabRaise =
  | { kind: "stay"; reason: RaiseSlabStayReason }
  | { kind: "wall"; cell: OccCell };

export type RaiseSlabState = {
  cell: OccCell;
  raised: boolean;
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
 * An unraised Raise Slab is **not** a cut (walk occupancy is floor).
 */
export function floodRaiseSlabBattleGraph(
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

export function isOnRaiseSlabBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodRaiseSlabBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

function withRaisedSlabs(
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
 * True when raising `extra` into wall occupancy cuts every player→exit
 * route. Catalog: evaluate solvability as if the slab were already a wall.
 * If the player is standing on a candidate, flood from a neighbor — the
 * pry still fires under them.
 */
export function raiseSlabSealsProgression(
  player: OccCell,
  extra: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.size === 0) return false;
  const live = withRaisedSlabs(ctx, extra);
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
 * The 1 AP wall then never taxes the battle route.
 */
export function raiseSlabUnreachable(
  player: OccCell,
  dests: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (dests.length === 0) return true;
  return !dests.some((cell) => isOnRaiseSlabBattleGraph(cell, player, ctx));
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isRaiseSlabSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= RAISE_SLAB_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= RAISE_SLAB_SPAWN_CLEAR
  );
}

/** Orthogonal adjacent — catalog pry is not a diagonal or a self-cell. */
export function isAdjacentRaiseSlab(actor: OccCell, slab: OccCell): boolean {
  return Math.abs(actor.x - slab.x) + Math.abs(actor.y - slab.y) === 1;
}

export function initialRaiseSlabState(cell: OccCell): RaiseSlabState {
  return {
    cell: { x: cell.x, y: cell.y },
    raised: false,
  };
}

export function raiseSlabIsWall(state: RaiseSlabState): boolean {
  return state.raised;
}

/**
 * Raw catalog dests: row-major `"floor"` cells outside spawn±3. Occupancy
 * `tiles` is `!== "wall"` (floor OR portal); production `=== "floor"` skips
 * the gate. No occupancy / void / fight-graph check — leftover crumbs and
 * floor-under-void are included. `existing` matches a second `blocksWalk`
 * roll (`Do not place on the same cell as another blocksWalk feature`).
 */
export function rawRaiseSlabDests(
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
      if (isRaiseSlabSpawnClear(gx, gy, spawn)) continue;
      if (existing?.has(k)) continue;
      dests.push({ x: gx, y: gy });
    }
  }
  return dests;
}

/** Catalog plants exactly one cell. `extraHazardRoll` is 0 (band omitted). */
export function pickRaiseSlabCount(rng?: () => number): number {
  if (!rng) return RAISE_SLAB_GENERATE_MIN;
  return (
    RAISE_SLAB_GENERATE_MIN +
    Math.floor(rng() * (RAISE_SLAB_GENERATE_MAX - RAISE_SLAB_GENERATE_MIN + 1))
  );
}

/** Fisher–Yates pick of `count` dests. */
export function pickRaiseSlabDests(
  dests: readonly OccCell[],
  rng: () => number,
  count: number = RAISE_SLAB_GENERATE_MIN,
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

function acceptRaiseSlabLanding(
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
  if (isRaiseSlabSpawnClear(cell.x, cell.y, spawn)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  if (!battle.has(k)) return false;
  if (reserved.has(k) && k !== occKey(player.x, player.y)) return false;
  return !raiseSlabSealsProgression(player, [{ x: cell.x, y: cell.y }], ctx);
}

/**
 * Relocate a Raise Slab onto a fight-graph dump cell that still reaches
 * an exit after the 1 AP pry walls it. Returns `null` when every
 * candidate would seal (caller drops the slab instead of punching a
 * leftover island). Unique-corridor overlap must not stay. Covering a
 * destacked player / occupied fight-graph cell on a dual path stays
 * legal (walkable until raised). Leftover-island dests snap onto the
 * fight graph or drop — they must not punch a join.
 */
export function legalizeRaiseSlabPlacement(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
  spawn: OccCell = player,
): OccCell | null {
  const { w, h } = gridSize(ctx);
  const battle = floodRaiseSlabBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const reserved = progressionReserved(ctx, player);
  const ok = (cell: OccCell) =>
    acceptRaiseSlabLanding(cell, player, spawn, ctx, battle, placed, reserved);
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
 * Snap several Raise Slab dests off unique corridors, leftover crumbs,
 * voids, and the spawn diamond. Drops a dest that cannot legalize. Does
 * not restack occupancy unseal or punch walls.
 */
export function legalizeRaiseSlabPlacements(
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
    live = withRaisedSlabs(live, prior);
  }
  for (const dest of dests) {
    const snapped = legalizeRaiseSlabPlacement(
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
    live = withRaisedSlabs(live, [snapped]);
  }
  return result;
}

/**
 * Occupancy-blind 1 AP adjacent pry. Production walls the painted cell
 * even when it is a unique corridor, a leftover crumb, a portal, a void,
 * or occupied — Hourglass waits three round-starts; Spent Bridge waits
 * three leaves; this fires on the first adjacent 1 AP.
 */
export function rawRaiseSlabRaise(
  state: RaiseSlabState,
  actor: OccCell,
  ap: number,
): RaiseSlabRaise {
  if (state.raised) {
    return { kind: "stay", reason: "already-raised" };
  }
  if (ap < RAISE_SLAB_AP) {
    return { kind: "stay", reason: "no-ap" };
  }
  if (!isAdjacentRaiseSlab(actor, state.cell)) {
    return { kind: "stay", reason: "not-adjacent" };
  }
  return { kind: "wall", cell: { x: state.cell.x, y: state.cell.y } };
}

function acceptRaiseSlabRaise(
  cell: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): boolean {
  const k = occKey(cell.x, cell.y);
  if (ctx.portals.has(k)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (ctx.isOccupied(cell)) return false;
  if (!isOnRaiseSlabBattleGraph(cell, player, ctx)) return false;
  return !raiseSlabSealsProgression(player, [cell], ctx);
}

/**
 * Occupancy-blind 1 AP pry. If raising the painted cell would seal a
 * unique corridor, sit on a leftover crumb, a portal, a void, or a
 * living body, **drop the pry** (stay painted as floor) rather than
 * snap the slab sideways or punch a join. Unlike initial placement,
 * raise must not relocate the marker onto a different origin. Unlike
 * Cinder Barrel, the wall does not hop a cardinal neighbor.
 */
export function legalizeRaiseSlabRaise(
  state: RaiseSlabState,
  actor: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  ap: number,
): RaiseSlabRaise {
  const raw = rawRaiseSlabRaise(state, actor, ap);
  if (raw.kind === "stay") return raw;
  const k = occKey(raw.cell.x, raw.cell.y);
  if (
    ctx.portals.has(k) ||
    ctx.voidTiles.has(k) ||
    ctx.barriers.has(k) ||
    !isOnRaiseSlabBattleGraph(raw.cell, player, ctx)
  ) {
    return { kind: "stay", reason: "off-graph" };
  }
  if (ctx.isOccupied(raw.cell)) {
    return { kind: "stay", reason: "occupied" };
  }
  if (!acceptRaiseSlabRaise(raw.cell, player, ctx)) {
    return { kind: "stay", reason: "would-seal" };
  }
  return raw;
}

/**
 * Apply one adjacent 1 AP pry. The wall lands only when it still leaves
 * a player→exit route and does not trap a living body. A dropped pry
 * stays floor (`raised` false) so a later legal raise can retry the
 * same cell instead of punching. Round-starts and leaves do not pry.
 * Cannot lower: a raised slab stays a wall.
 */
export function resolveRaiseSlabAfterRaise(
  state: RaiseSlabState,
  actor: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  ap: number,
): RaiseSlabState {
  if (state.raised) return state;
  const action = legalizeRaiseSlabRaise(state, actor, player, ctx, ap);
  if (action.kind === "wall") {
    return { ...state, raised: true };
  }
  return state;
}

/**
 * Raw catalog dests from the occupancy grid, then snap so the slab sits
 * on a non-cut-vertex fight-graph cell. Empty when the fight graph cannot
 * host a delayed-wall plant.
 */
export function resolveRaiseSlab(
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
      ? pickRaiseSlabDests(
          rawRaiseSlabDests(ctx, spawn, existing),
          rng,
          pickRaiseSlabCount(rng),
        )
      : rawRaiseSlabDests(ctx, spawn, existing).slice(
          0,
          RAISE_SLAB_GENERATE_MIN,
        ));
  return legalizeRaiseSlabPlacements(
    raw,
    player,
    ctx,
    spawn,
    existing ?? new Set(),
  );
}

/**
 * Live 1 AP pry of a painted slab. Stays floor when the wall would leave
 * the fight graph, trap a body, or seal every exit.
 */
export function resolveRaiseSlabRaise(
  state: RaiseSlabState,
  actor: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  ap: number,
): RaiseSlabRaise {
  return legalizeRaiseSlabRaise(state, actor, player, ctx, ap);
}
