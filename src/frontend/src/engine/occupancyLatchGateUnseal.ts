/**
 * Catalog Latch Gate (`WF-PRT-LATCH_GATE`) plants **one** extra sealed
 * portal from a `"floor"` raster that skips existing portals and
 * Chebyshev ≤ 3 from the **legalized spawn** (`SPAWN_SAFE_RADIUS` /
 * `isTileReservedForSpawnOrPortal`, not grid center `WORLD_GRID_SIZE/2`)
 * with **no** occupancy / void / fight-graph check. `extraHazardCount` is
 * omitted so `extraHazardRoll` would plant nothing. Occupancy 1+1 unseal
 * relocates combatants and cannot lift a sealed portal. Occupancy floods
 * still walk portal cells (`occupancyTiles` = `!== "wall"`), leftover-islands
 * stays 0, unique-bridge unseal never runs, and a floor→portal stamp on a
 * unique player→exit corridor or a far-side leftover CA crumb never appears
 * as a cut — production that then pushes the latch into the `portals` Set
 * treats it as a reachable **exit** (`occupantsSealProgression` deletes
 * portal keys from the flood block list) while battle walk
 * (`isBattleWalkTileBlocked`) still refuses the cell. Unarmed it is **not**
 * an exit. Clearing never unlocks the stable portal behind that choke.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swapPositions /
 * ignore-walls / ghost raster / Eternal Pawn advance / Twin Bishop /
 * summoner midpoint / VOID / ANCHOR / SPIKE / LAVA / greedy moveToward /
 * erratic / king-step / SHOCK / ILLUSION / LARVAE / INK_VEIL / adjacent
 * SpawnData / BOARD_CLAIM / Void Rift / eligibleHazard / walk-blockers /
 * Creeping Ash / Ember Vein / Hunting Lantern / Orbiting Cinder / Gutter
 * Steam / Frost Pane / Triune Pads / Spent Bridge / Slipstream / Cinder
 * Barrel / MAP_ROTATE helpers (#589–#1161). Those snap units, rewrite
 * walls, plant impassable voids at Manhattan-2, plant generate-time
 * lava/ice/spikes that skip the center 7×7, plant one impassable
 * `blocksWalk` cell **in place** (void overlay; never an exit), plant one
 * contiguous 3-tile orthogonal lane, plant 3–6 independent always-on
 * dests, plant one chasing orb, plant a closed 4-cycle square, plant two
 * independent even/odd vents, plant one walkable LoS wall, plant a 3-pad
 * clockwise carousel, plant a delayed floor→wall after three leaves, plant
 * a one-way A→B pair, plant a 1 AP cardinal wall roll, or rewrite every
 * body with a board-wide 90° / mirror. This is a **floor→sealed-portal
 * choke that occupancy treats as an extra exit** (unarmed ≠ exit; 1 AP
 * adjacent to arm — not a wall, not a delayed wall, not a roll, not a
 * teleport). `#1013` is walk-blockers (void overlay; unique-corridor snaps
 * off). `#1127` is Spent Bridge (delayed wall). `#1146` is Slipstream.
 * `#1154` is Cinder Barrel. `#1161` is MAP_ROTATE. Flicker / Echo gates
 * count as exits from plant. Unique-corridor / player / occupied dests
 * snap off. Drop leftover-island dests rather than punch. Never the only
 * portal. Arming does not relocate units.
 *
 * Fight-graph snap of the dest. Does not restack occupancy.ts,
 * occupancyWalkBlockerUnseal, occupancyCinderBarrelUnseal,
 * occupancySpentBridgeUnseal, occupancySlipstreamUnseal,
 * occupancyMapRotateUnseal, occupancyTriunePadsUnseal,
 * occupancyFrostPaneUnseal, occupancyGutterSteamUnseal,
 * occupancyOrbitingCinderUnseal, occupancyHuntingLanternUnseal,
 * occupancyEmberVeinUnseal, occupancyCreepingAshUnseal,
 * occupancyEligibleHazardUnseal, WorldExploration, worldFeatures.ts,
 * useBossSystem, targeting.ts, walkRejectCopy.ts, or mapGen.simulate.ts.
 */

import {
  type OccCell,
  type OccupancyContext,
  findNearestFreeCell,
  isCellFree,
  occKey,
  occupantsSealProgression,
  progressionReserved,
  progressionSearchRadius,
} from "./occupancy.ts";

/** Catalog plants one extra sealed portal. `extraHazardCount` is omitted. */
export const LATCH_GATE_GENERATE_MIN = 1;
export const LATCH_GATE_GENERATE_MAX = 1;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const LATCH_GATE_SPAWN_CLEAR = 3;

/** Catalog adjacent 1 AP arms the glyph. */
export const LATCH_GATE_ARM_AP = 1;

export const LATCH_GATE_FEATURE_ID = "WF-PRT-LATCH_GATE";

export type LatchGateStayReason =
  | "already-armed"
  | "not-adjacent"
  | "no-ap"
  | "missing";

export type LatchGateArm =
  | { kind: "stay"; reason: LatchGateStayReason }
  | { kind: "armed"; cell: OccCell };

export type LatchGateState = {
  cell: OccCell;
  armed: boolean;
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

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 * An unarmed Latch Gate is a cut (portal occupancy) and is **not** an
 * exit until armed.
 */
export function floodLatchGateBattleGraph(
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

export function isOnLatchGateBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodLatchGateBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * Unarmed latch occupancy is a battle-walk choke, **not** an extra exit.
 * Overlay as voids so `occupantsSealProgression` cannot treat the glyph as
 * a reachable portal goal the way a naive `portals.add(latch)` would.
 */
function withUnarmedLatchCuts(
  ctx: OccupancyContext,
  extra: readonly OccCell[],
): OccupancyContext {
  if (extra.length === 0) return ctx;
  const voidTiles = new Set(ctx.voidTiles);
  for (const cell of extra) voidTiles.add(occKey(cell.x, cell.y));
  return { ...ctx, voidTiles };
}

/** Unarmed Latch Gate never counts as a progression exit. Armed it does. */
export function latchGateCountsAsExit(state: LatchGateState): boolean {
  return state.armed;
}

export function initialLatchGateState(cell: OccCell): LatchGateState {
  return { cell: { x: cell.x, y: cell.y }, armed: false };
}

/**
 * True when adding `extra` as unarmed portal occupancy (void overlay on
 * the **stable** portal set) cuts every player→exit route.
 */
export function latchGateSealsProgression(
  player: OccCell,
  extra: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.size === 0) return true;
  const live = withUnarmedLatchCuts(ctx, extra);
  return occupantsSealProgression(
    live.tiles,
    live.voidTiles,
    live.portals,
    player,
    [],
    live.barriers,
  );
}

/**
 * True when occupancy 1+1 unseal would miss a unique-corridor latch: adding
 * the dest to `portals` makes `occupantsSealProgression` report an open
 * exit (flood walks portal cells; portal keys are deleted from the block
 * list) while the unarmed void overlay still seals the stable gate.
 */
export function latchGateOccupancyFakeExitHidesSeal(
  player: OccCell,
  dest: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (!latchGateSealsProgression(player, [dest], ctx)) return false;
  const fakePortals = new Set(ctx.portals);
  fakePortals.add(occKey(dest.x, dest.y));
  return !occupantsSealProgression(
    ctx.tiles,
    ctx.voidTiles,
    fakePortals,
    player,
    [],
    ctx.barriers,
  );
}

/**
 * True when no dest sits on the fight graph (gate, void, leftover crumb).
 * The unarmed choke then never taxes the battle route.
 */
export function latchGateUnreachable(
  player: OccCell,
  dests: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (dests.length === 0) return true;
  return !dests.some((cell) => isOnLatchGateBattleGraph(cell, player, ctx));
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isLatchGateSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= LATCH_GATE_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= LATCH_GATE_SPAWN_CLEAR
  );
}

export function isLatchGateAdjacent(from: OccCell, gate: OccCell): boolean {
  return Math.abs(from.x - gate.x) + Math.abs(from.y - gate.y) === 1;
}

/**
 * Raw catalog dests: row-major `"floor"` cells outside spawn±3. Occupancy
 * `tiles` is `!== "wall"` (floor OR portal); production `=== "floor"` skips
 * the gate. No occupancy / void / fight-graph check — leftover crumbs and
 * floor-under-void are included. `existing` matches a second unstable-portal
 * roll (never stack two extra gates on one cell).
 */
export function rawLatchGateDests(
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
      if (isLatchGateSpawnClear(gx, gy, spawn)) continue;
      if (existing?.has(k)) continue;
      dests.push({ x: gx, y: gy });
    }
  }
  return dests;
}

/** Catalog plants exactly one cell. `extraHazardRoll` is 0 (band omitted). */
export function pickLatchGateCount(rng?: () => number): number {
  if (!rng) return LATCH_GATE_GENERATE_MIN;
  return (
    LATCH_GATE_GENERATE_MIN +
    Math.floor(rng() * (LATCH_GATE_GENERATE_MAX - LATCH_GATE_GENERATE_MIN + 1))
  );
}

/** Fisher–Yates pick of `count` dests. */
export function pickLatchGateDests(
  dests: readonly OccCell[],
  rng: () => number,
  count: number = LATCH_GATE_GENERATE_MIN,
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

function acceptLatchGateLanding(
  cell: OccCell,
  player: OccCell,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
  reserved: Set<string>,
): boolean {
  const k = occKey(cell.x, cell.y);
  if (placed.has(k)) return false;
  if (ctx.portals.has(k)) return false;
  if (k === occKey(player.x, player.y)) return false;
  if (isLatchGateSpawnClear(cell.x, cell.y, spawn)) return false;
  if (!battle.has(k)) return false;
  if (reserved.has(k)) return false;
  if (!isCellFree(cell, ctx)) return false;
  return !latchGateSealsProgression(player, [{ x: cell.x, y: cell.y }], ctx);
}

/**
 * Relocate an unarmed Latch Gate onto a fight-graph dump cell that still
 * reaches the **stable** exit. Returns `null` when every candidate would
 * seal (caller drops the gate instead of punching a leftover island) or
 * when there is no stable portal (catalog: never the only portal).
 * Unique-corridor overlap must not stay. Covering the player / an occupied
 * cell must not stay. Leftover-island dests snap onto the fight graph or
 * drop.
 */
export function legalizeLatchGatePlacement(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
  spawn: OccCell = player,
): OccCell | null {
  if (ctx.portals.size === 0) return null;
  const battle = floodLatchGateBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const reserved = progressionReserved(ctx, player);
  const ok = (cell: OccCell) =>
    acceptLatchGateLanding(cell, player, spawn, ctx, battle, placed, reserved);
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
 * Snap several catalog latches off the gate, unique bridges, spawn diamond,
 * occupied cells, and leftover crumbs. Drops a dest that cannot legalize.
 * Does not restack occupancy unseal or punch walls.
 */
export function legalizeLatchGatePlacements(
  dests: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
  already: ReadonlySet<string> = new Set(),
): OccCell[] {
  if (ctx.portals.size === 0) return [];
  const placed = new Set(already);
  const result: OccCell[] = [];
  let live = ctx;
  if (already.size > 0) {
    const prior: OccCell[] = [];
    for (const k of already) {
      const [xs, ys] = k.split(",");
      prior.push({ x: Number(xs), y: Number(ys) });
    }
    live = withUnarmedLatchCuts(live, prior);
  }
  for (const dest of dests) {
    const snapped = legalizeLatchGatePlacement(
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
    live = withUnarmedLatchCuts(live, [snapped]);
  }
  return result;
}

/**
 * Occupancy-blind adjacent 1 AP arm. Production flips the glyph even on a
 * leftover crumb. Does not relocate units.
 */
export function rawLatchGateArm(
  state: LatchGateState | null,
  from: OccCell,
  ap: number = LATCH_GATE_ARM_AP,
): LatchGateArm {
  if (!state) return { kind: "stay", reason: "missing" };
  if (state.armed) return { kind: "stay", reason: "already-armed" };
  if (ap < LATCH_GATE_ARM_AP) return { kind: "stay", reason: "no-ap" };
  if (!isLatchGateAdjacent(from, state.cell)) {
    return { kind: "stay", reason: "not-adjacent" };
  }
  return { kind: "armed", cell: { x: state.cell.x, y: state.cell.y } };
}

/**
 * Occupancy-blind arm. Leftover / portal / void dests still arm the glyph
 * (no relocate) but `latchGateCountsAsExit` is the only progression change
 * — an off-graph armed latch never replaces the stable exit.
 */
export function legalizeLatchGateArm(
  state: LatchGateState | null,
  from: OccCell,
  ap: number = LATCH_GATE_ARM_AP,
): LatchGateArm {
  return rawLatchGateArm(state, from, ap);
}

export function resolveLatchGateArm(
  state: LatchGateState | null,
  from: OccCell,
  ap: number = LATCH_GATE_ARM_AP,
): LatchGateState | null {
  if (!state) return null;
  const arm = legalizeLatchGateArm(state, from, ap);
  if (arm.kind === "stay") return state;
  return { ...state, armed: true };
}

/**
 * Raw catalog dests from the occupancy grid, then snap so the unarmed
 * latch sits on a non-cut-vertex fight-graph cell beside a stable portal.
 * Empty when the fight graph cannot host a sealed-portal plant.
 */
export function resolveLatchGate(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  dests?: readonly OccCell[],
  existing?: ReadonlySet<string>,
  spawn: OccCell = player,
): OccCell[] {
  if (ctx.portals.size === 0) return [];
  const raw =
    dests ??
    (rng
      ? pickLatchGateDests(
          rawLatchGateDests(ctx, spawn, existing),
          rng,
          pickLatchGateCount(rng),
        )
      : rawLatchGateDests(ctx, spawn, existing).slice(
          0,
          LATCH_GATE_GENERATE_MIN,
        ));
  return legalizeLatchGatePlacements(
    raw,
    player,
    ctx,
    spawn,
    existing ?? new Set(),
  );
}
