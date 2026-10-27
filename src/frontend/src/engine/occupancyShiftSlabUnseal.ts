/**
 * Catalog Shift Slab (`WF-OBS-SHIFT_SLAB`) plants **two** painted adjacent
 * short-path cells from a `"floor"` raster that skips portals and Chebyshev
 * ≤ 3 from the **legalized spawn** (`SPAWN_SAFE_RADIUS` /
 * `isTileReservedForSpawnOrPortal`, not grid center `WORLD_GRID_SIZE/2`)
 * with **no** occupancy / void / fight-graph check. Exactly one cell is a
 * wall and the other is floor; they swap at each round start. `extraHazardCount`
 * is omitted so `extraHazardRoll` would plant nothing. Occupancy 1+1 unseal
 * relocates combatants and cannot swap the pair or lift the shut cell.
 * Occupancy floods still walk portals, leftover-islands stays 0,
 * unique-bridge unseal never runs, and the pair can sit on a unique
 * player→exit corridor or a far-side leftover CA crumb — occupancy-blind
 * swap then walls the open corridor cell even when a long path was painted
 * as the other slab.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swapPositions /
 * ignore-walls / ghost raster / Eternal Pawn advance / Twin Bishop /
 * summoner midpoint / VOID / ANCHOR / SPIKE / LAVA / greedy moveToward /
 * erratic / king-step / SHOCK / ILLUSION / LARVAE / INK_VEIL / adjacent
 * SpawnData / BOARD_CLAIM / Void Rift / eligibleHazard / walk-blocker /
 * Creeping Ash / Ember Vein / Hunting Lantern / Orbiting Cinder / Gutter
 * Steam / Frost Pane / Triune Pads / Spent Bridge / Slipstream / Cinder
 * Barrel / MAP_ROTATE / Latch Gate / Pendulum Censer / Hourglass Arch
 * helpers (#589–#1209). Those snap units, rewrite walls, plant impassable
 * voids, plant walkable tax, plant one chasing orb, plant a clockwise
 * 4-cycle square, plant a 3-tile one-way lane, plant delayed walls after
 * three leaves **or three round-starts**, plant teleports, plant a 1 AP
 * wall roll, rewrite every body, plant one unarmed extra portal, plant a
 * 5-tile reverse nave, or plant **one** delayed floor→wall. This is a
 * **two-cell oscillating pair** (exactly one wall; swap every round start
 * — not HP/AP tax, not a painted lane, not a chase, not a 2×2, not two
 * vents, not a LoS wall, not a teleport swap, not a 3-leave / 3-round
 * collapse that stays wall). `#1013` is walk-blockers (one immediate
 * wall). `#1127` is Spent Bridge (three leaves). `#1209` is Hourglass Arch
 * (three round-starts, then stays wall). Tide Door is one cell odd/even
 * (covered by #1013 plant snap). Ratchet Cog is a walkable 2-cell HP-tax
 * swap. Unique-corridor cells snap off at plant (catalog: a spawn→portal
 * route must exist with cell A walled **and** with cell B walled). Occupied
 * / destacked-player dests on a dual path stay as the **open** slab.
 * Drop leftover-island pairs rather than punch. Swap onto a unique
 * corridor / leftover crumb / portal / void / occupied shut **stays** in
 * the current orientation (drop the swap) rather than punch.
 *
 * Fight-graph snap of the pair. Does not restack occupancy.ts,
 * occupancyHourglassArchUnseal, occupancySpentBridgeUnseal,
 * occupancyWalkBlockerUnseal, occupancyPendulumCenserUnseal,
 * occupancyLatchGateUnseal, occupancyCinderBarrelUnseal,
 * WorldExploration, worldFeatures.ts,
 * useBossSystem, targeting.ts, or mapGen.simulate.ts.
 */

import {
  type OccCell,
  type OccupancyContext,
  occKey,
  occupantsSealProgression,
  progressionReserved,
} from "./occupancy.ts";

/** Catalog plants one pair. `extraHazardCount` is omitted. */
export const SHIFT_SLAB_GENERATE_MIN = 1;
export const SHIFT_SLAB_GENERATE_MAX = 1;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const SHIFT_SLAB_SPAWN_CLEAR = 3;

export const SHIFT_SLAB_FEATURE_ID = "WF-OBS-SHIFT_SLAB";

export type ShiftSlabPair = {
  open: OccCell;
  shut: OccCell;
};

export type ShiftSlabStayReason = "would-seal" | "off-graph" | "occupied-shut";

export type ShiftSlabSwap =
  | { kind: "stay"; reason: ShiftSlabStayReason }
  | { kind: "swap"; pair: ShiftSlabPair };

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

function sameCell(a: OccCell, b: OccCell): boolean {
  return a.x === b.x && a.y === b.y;
}

export function shiftSlabCellsOrthogonal(a: OccCell, b: OccCell): boolean {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return dx + dy === 1;
}

export function shiftSlabPairKey(pair: ShiftSlabPair): string {
  const a = occKey(pair.open.x, pair.open.y);
  const b = occKey(pair.shut.x, pair.shut.y);
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 * Shift Slab shut occupancy is applied by the caller via `withShiftSlabWalls`.
 */
export function floodShiftSlabBattleGraph(
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

export function isOnShiftSlabBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodShiftSlabBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * Overlay exactly one shut wall and force the open slab walkable so a live
 * tile rewrite (or a marker-only plant) can be evaluated the same way.
 */
export function withShiftSlabWalls(
  ctx: OccupancyContext,
  pair: ShiftSlabPair,
): OccupancyContext {
  const { w, h } = gridSize(ctx);
  const tiles = ctx.tiles.map((row) => row.slice());
  if (inGrid(pair.open, w, h)) {
    const row = tiles[pair.open.y];
    if (row) row[pair.open.x] = true;
  }
  const voidTiles = new Set(ctx.voidTiles);
  voidTiles.delete(occKey(pair.open.x, pair.open.y));
  voidTiles.add(occKey(pair.shut.x, pair.shut.y));
  return { ...ctx, tiles, voidTiles };
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
 * True when walling `shut` (and keeping `open` floor) cuts every player→exit
 * route. Catalog: a spawn→portal route must exist with cell A walled and
 * with cell B walled. If the player is standing on the shut slab, flood from
 * a neighbor — the swap fires under them.
 */
export function shiftSlabSealsProgression(
  player: OccCell,
  pair: ShiftSlabPair,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.size === 0) return false;
  const live = withShiftSlabWalls(ctx, pair);
  const shutKey = occKey(pair.shut.x, pair.shut.y);
  let start = player;
  if (sameCell(player, pair.shut)) {
    const neighbor = walkableNeighbor(player, live, new Set([shutKey]));
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
 * True when no painted cell sits on the fight graph (gate, void, leftover
 * crumb). The oscillating wall then never taxes the battle route.
 */
export function shiftSlabUnreachable(
  player: OccCell,
  pair: ShiftSlabPair,
  ctx: OccupancyContext,
): boolean {
  return (
    !isOnShiftSlabBattleGraph(pair.open, player, ctx) &&
    !isOnShiftSlabBattleGraph(pair.shut, player, ctx)
  );
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isShiftSlabSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= SHIFT_SLAB_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= SHIFT_SLAB_SPAWN_CLEAR
  );
}

function cellBlockedByExisting(
  cell: OccCell,
  existing?: ReadonlySet<string>,
): boolean {
  return existing?.has(occKey(cell.x, cell.y)) === true;
}

/**
 * Raw catalog pairs: row-major `"floor"` cells outside spawn±3, each with
 * a +x / +y orthogonal neighbor. Occupancy `tiles` is `!== "wall"` (floor
 * OR portal); production `=== "floor"` skips the gate. No occupancy / void
 * / fight-graph check — leftover crumbs and floor-under-void are included.
 * `existing` matches a second `blocksWalk` roll (`Do not share a cell with
 * another blocksWalk feature`). Default: the earlier cell is open.
 */
export function rawShiftSlabPairs(
  ctx: OccupancyContext,
  spawn: OccCell,
  existing?: ReadonlySet<string>,
): ShiftSlabPair[] {
  const pairs: ShiftSlabPair[] = [];
  const { w, h } = gridSize(ctx);
  const eligible = (x: number, y: number): boolean => {
    if (!ctx.tiles[y]?.[x]) return false;
    const k = occKey(x, y);
    if (ctx.portals.has(k)) return false;
    if (isShiftSlabSpawnClear(x, y, spawn)) return false;
    if (existing?.has(k)) return false;
    return true;
  };
  for (let gy = 0; gy < h; gy++) {
    for (let gx = 0; gx < w; gx++) {
      if (!eligible(gx, gy)) continue;
      for (const [dx, dy] of [
        [1, 0],
        [0, 1],
      ] as const) {
        const nx = gx + dx;
        const ny = gy + dy;
        if (!inGrid({ x: nx, y: ny }, w, h)) continue;
        if (!eligible(nx, ny)) continue;
        pairs.push({
          open: { x: gx, y: gy },
          shut: { x: nx, y: ny },
        });
      }
    }
  }
  return pairs;
}

/** Catalog plants exactly one pair. `extraHazardRoll` is 0 (band omitted). */
export function pickShiftSlabCount(rng?: () => number): number {
  if (!rng) return SHIFT_SLAB_GENERATE_MIN;
  return (
    SHIFT_SLAB_GENERATE_MIN +
    Math.floor(rng() * (SHIFT_SLAB_GENERATE_MAX - SHIFT_SLAB_GENERATE_MIN + 1))
  );
}

/** Fisher–Yates pick of `count` pairs. */
export function pickShiftSlabPairs(
  pairs: readonly ShiftSlabPair[],
  rng: () => number,
  count: number = SHIFT_SLAB_GENERATE_MIN,
): ShiftSlabPair[] {
  const shuffled = pairs.map((p) => ({
    open: { x: p.open.x, y: p.open.y },
    shut: { x: p.shut.x, y: p.shut.y },
  }));
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }
  const n = Math.min(count, shuffled.length);
  return shuffled.slice(0, n);
}

export function rawShiftSlabSwap(pair: ShiftSlabPair): ShiftSlabPair {
  return {
    open: { x: pair.shut.x, y: pair.shut.y },
    shut: { x: pair.open.x, y: pair.open.y },
  };
}

function acceptOrientation(
  pair: ShiftSlabPair,
  player: OccCell,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
  reserved: Set<string>,
): boolean {
  const { w, h } = gridSize(ctx);
  if (!inGrid(pair.open, w, h) || !inGrid(pair.shut, w, h)) return false;
  if (sameCell(pair.open, pair.shut)) return false;
  if (!shiftSlabCellsOrthogonal(pair.open, pair.shut)) return false;
  const openK = occKey(pair.open.x, pair.open.y);
  const shutK = occKey(pair.shut.x, pair.shut.y);
  if (placed.has(openK) || placed.has(shutK)) return false;
  if (ctx.portals.has(openK) || ctx.portals.has(shutK)) return false;
  if (isShiftSlabSpawnClear(pair.open.x, pair.open.y, spawn)) return false;
  if (isShiftSlabSpawnClear(pair.shut.x, pair.shut.y, spawn)) return false;
  if (ctx.voidTiles.has(openK) || ctx.barriers.has(openK)) return false;
  if (ctx.voidTiles.has(shutK) || ctx.barriers.has(shutK)) return false;
  if (!ctx.tiles[pair.open.y]?.[pair.open.x]) return false;
  if (!ctx.tiles[pair.shut.y]?.[pair.shut.x]) return false;
  if (!battle.has(openK) || !battle.has(shutK)) return false;
  if (reserved.has(openK) && openK !== occKey(player.x, player.y)) return false;
  if (reserved.has(shutK) && shutK !== occKey(player.x, player.y)) return false;
  if (sameCell(player, pair.shut)) return false;
  if (ctx.isOccupied(pair.shut) && !sameCell(player, pair.shut)) return false;
  const flipped = rawShiftSlabSwap(pair);
  if (shiftSlabSealsProgression(player, pair, ctx)) return false;
  if (shiftSlabSealsProgression(player, flipped, ctx)) return false;
  return true;
}

function preferOrientation(
  a: OccCell,
  b: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell,
  battle: Set<string>,
  placed: ReadonlySet<string>,
  reserved: Set<string>,
): ShiftSlabPair | null {
  const candidates: ShiftSlabPair[] = [
    { open: { x: a.x, y: a.y }, shut: { x: b.x, y: b.y } },
    { open: { x: b.x, y: b.y }, shut: { x: a.x, y: a.y } },
  ];
  const ok = candidates.filter((pair) =>
    acceptOrientation(pair, player, spawn, ctx, battle, placed, reserved),
  );
  if (ok.length === 0) return null;
  const playerOn = ok.find((pair) => sameCell(pair.open, player));
  if (playerOn) return playerOn;
  const occupiedOn = ok.find(
    (pair) => ctx.isOccupied(pair.open) && !sameCell(pair.open, player),
  );
  if (occupiedOn) return occupiedOn;
  return ok[0] ?? null;
}

/**
 * Relocate a Shift Slab pair onto two adjacent fight-graph dump cells that
 * still reach an exit after **either** cell is the wall. Returns `null`
 * when every candidate would seal (caller drops the pair instead of punching
 * a leftover island). Unique-corridor overlap must not stay. Covering a
 * destacked player / occupied fight-graph cell on a dual path stays legal
 * as the **open** slab. Leftover-island dests snap onto the fight graph or
 * drop — they must not punch a join.
 */
export function legalizeShiftSlabPlacement(
  dest: ShiftSlabPair,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
  spawn: OccCell = player,
): ShiftSlabPair | null {
  const { w, h } = gridSize(ctx);
  const battle = floodShiftSlabBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const reserved = progressionReserved(ctx, player);
  const tryPair = (a: OccCell, b: OccCell): ShiftSlabPair | null =>
    preferOrientation(a, b, player, ctx, spawn, battle, placed, reserved);
  const direct = tryPair(dest.open, dest.shut);
  if (direct) return direct;
  const origins: OccCell[] = [
    { x: dest.open.x, y: dest.open.y },
    { x: dest.shut.x, y: dest.shut.y },
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
          for (const [ox, oy] of ORTH) {
            const n = { x: cell.x + ox, y: cell.y + oy };
            const snapped = tryPair(cell, n);
            if (snapped) return snapped;
          }
        }
      }
    }
  }
  return null;
}

/**
 * Snap several Shift Slab pairs off unique corridors, leftover crumbs,
 * voids, and the spawn diamond. Drops a pair that cannot legalize. Does
 * not restack occupancy unseal or punch walls.
 */
export function legalizeShiftSlabPlacements(
  dests: readonly ShiftSlabPair[],
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
  already: ReadonlySet<string> = new Set(),
): ShiftSlabPair[] {
  const placed = new Set(already);
  const result: ShiftSlabPair[] = [];
  const seen = new Set<string>();
  for (const dest of dests) {
    const snapped = legalizeShiftSlabPlacement(
      dest,
      player,
      ctx,
      placed,
      spawn,
    );
    if (!snapped) continue;
    const id = shiftSlabPairKey(snapped);
    if (seen.has(id)) continue;
    const openK = occKey(snapped.open.x, snapped.open.y);
    const shutK = occKey(snapped.shut.x, snapped.shut.y);
    if (placed.has(openK) || placed.has(shutK)) continue;
    seen.add(id);
    placed.add(openK);
    placed.add(shutK);
    result.push(snapped);
  }
  return result;
}

function swapOffGraph(
  pair: ShiftSlabPair,
  player: OccCell,
  ctx: OccupancyContext,
): boolean {
  const k = occKey(pair.shut.x, pair.shut.y);
  if (ctx.portals.has(k)) return true;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return true;
  if (!isOnShiftSlabBattleGraph(pair.shut, player, ctx)) return true;
  if (!isOnShiftSlabBattleGraph(pair.open, player, ctx)) return true;
  return false;
}

/**
 * Occupancy-blind round-start swap. Production walls the open slab even
 * when it is a unique corridor, a leftover crumb, a portal, or a void.
 */
export function legalizeShiftSlabSwap(
  pair: ShiftSlabPair,
  player: OccCell,
  ctx: OccupancyContext,
): ShiftSlabSwap {
  const raw = rawShiftSlabSwap(pair);
  if (swapOffGraph(raw, player, ctx)) {
    return { kind: "stay", reason: "off-graph" };
  }
  if (ctx.isOccupied(raw.shut)) {
    return { kind: "stay", reason: "occupied-shut" };
  }
  if (shiftSlabSealsProgression(player, raw, ctx)) {
    return { kind: "stay", reason: "would-seal" };
  }
  return { kind: "swap", pair: raw };
}

/**
 * Apply one round start. The swap walls the previously open slab only when
 * that wall still leaves a player→exit route. A dropped swap keeps the
 * current orientation so later ticks retry the same legalize instead of
 * punching.
 */
export function resolveShiftSlabAfterRoundStart(
  pair: ShiftSlabPair,
  player: OccCell,
  ctx: OccupancyContext,
): ShiftSlabPair {
  const swap = legalizeShiftSlabSwap(pair, player, ctx);
  if (swap.kind === "swap") return swap.pair;
  return {
    open: { x: pair.open.x, y: pair.open.y },
    shut: { x: pair.shut.x, y: pair.shut.y },
  };
}

/**
 * Raw catalog pairs from the occupancy grid, then snap so both slabs sit
 * on non-cut-vertex fight-graph cells. Empty when the fight graph cannot
 * host an oscillating pair.
 */
export function resolveShiftSlab(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  dests?: readonly ShiftSlabPair[],
  existing?: ReadonlySet<string>,
  spawn: OccCell = player,
): ShiftSlabPair[] {
  const raw =
    dests ??
    (rng
      ? pickShiftSlabPairs(
          rawShiftSlabPairs(ctx, spawn, existing),
          rng,
          pickShiftSlabCount(rng),
        )
      : rawShiftSlabPairs(ctx, spawn, existing).slice(
          0,
          SHIFT_SLAB_GENERATE_MIN,
        ));
  return legalizeShiftSlabPlacements(
    raw,
    player,
    ctx,
    spawn,
    existing ?? new Set(),
  );
}

/**
 * Live round-start swap of a painted pair. Stays in the current orientation
 * when the new wall would leave the fight graph or seal every exit.
 */
export function resolveShiftSlabSwap(
  pair: ShiftSlabPair,
  player: OccCell,
  ctx: OccupancyContext,
): ShiftSlabSwap {
  return legalizeShiftSlabSwap(pair, player, ctx);
}

/** Unused by plant; kept so a second blocksWalk roll can skip a cell. */
export function shiftSlabSharesExisting(
  pair: ShiftSlabPair,
  existing?: ReadonlySet<string>,
): boolean {
  return (
    cellBlockedByExisting(pair.open, existing) ||
    cellBlockedByExisting(pair.shut, existing)
  );
}
