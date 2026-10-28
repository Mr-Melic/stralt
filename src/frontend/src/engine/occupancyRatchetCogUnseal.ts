/**
 * Catalog Ratchet Cog (`WF-HAZ-RATCHET_COG`) plants **one** walkable HP-tax
 * cog (`extraHazardCount` min = max = 1) that occupies one of **two painted
 * adjacent floor cells** and **swaps to the other at each round start**.
 * Placement is a `"floor"` raster of orthogonal pairs that skips portals
 * and Chebyshev ≤ 3 from the **legalized spawn** (`SPAWN_SAFE_RADIUS` /
 * `isTileReservedForSpawnOrPortal`, not grid center `WORLD_GRID_SIZE/2`)
 * with **no** occupancy / void / fight-graph check. Occupancy 1+1 unseal
 * relocates combatants and cannot move the cog. Occupancy floods still
 * walk portals, leftover-islands stays 0, unique-bridge unseal never
 * runs, and the whole pair can sit on a far-side leftover CA crumb or a
 * floor-under-void — the −5% max-HP landing tax never appears on the
 * fight graph. The occupancy-blind swap then visits that far crumb even
 * when the current cog cell was still on the fight graph.
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
 * Shift Slab / Raise Slab helpers (#589–#1229). Those snap units, rewrite
 * walls, plant impassable voids, plant walkable tax, plant one chasing
 * orb, plant a clockwise 4-cycle square, plant a 3-tile one-way lane,
 * plant delayed walls after three leaves **or three round-starts**, plant
 * teleports, plant a 1 AP wall **roll**, rewrite every body, plant one
 * unarmed extra portal, plant a 5-tile reverse nave, plant a two-cell
 * oscillating **wall pair**, or plant a 1 AP floor→wall pry. This is a
 * **walkable 2-cell HP-tax swap** (both cells floor; one cog; swap every
 * round start — not a wall, not a 5-tile nave, not a 2×2, not two
 * independent vents, not a chase, not two orbs on a 4-tile line).
 * `#1013` is walk-blockers (impassable). `#1071` is Orbiting Cinder
 * (4-cycle square). `#1086` is Gutter Steam (two even/odd vents).
 * `#1038` is Hunting Lantern (chase). `#1201` is Pendulum Censer
 * (5-tile reverse). `#1213` is Shift Slab (exactly one wall; auto-swap).
 * `#1229` is Raise Slab (1 AP pry). Unique-corridor / destacked-player /
 * occupied dests stay (walk flood unchanged). Drop leftover-island pairs
 * rather than punch. Swap onto portal / void / leftover crumb **stays**
 * (drop the swap). Occupied rest **swaps** (landing tax). Both painted
 * cells must be fight-graph floor — the cog visits each.
 *
 * Fight-graph snap of the pair. Does not restack occupancy.ts,
 * occupancyRaiseSlabUnseal, occupancyShiftSlabUnseal,
 * occupancyPendulumCenserUnseal, occupancyHourglassArchUnseal,
 * occupancyWalkBlockerUnseal, occupancyHuntingLanternUnseal,
 * occupancyOrbitingCinderUnseal, occupancyGutterSteamUnseal,
 * WorldExploration, worldFeatures.ts, useBossSystem, targeting.ts, or
 * mapGen.simulate.ts.
 */

import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";

/** Catalog `extraHazardCount` for Ratchet Cog is exactly one cog. */
export const RATCHET_COG_COUNT = 1;

/** Painted pair is two adjacent floor cells. */
export const RATCHET_COG_PAIR_LENGTH = 2;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const RATCHET_COG_SPAWN_CLEAR = 3;

/** Catalog landing tax as a fraction of current max HP. */
export const RATCHET_COG_HP_TAX_PCT = 0.05;

export const RATCHET_COG_FEATURE_ID = "WF-HAZ-RATCHET_COG";

export type RatchetCogPair = {
  /** Cell the cog occupies this round. */
  cog: OccCell;
  /** The other painted cell; next swap dest. */
  rest: OccCell;
};

export type RatchetCogStayReason = "off-graph";

export type RatchetCogSwap =
  | { kind: "stay"; reason: RatchetCogStayReason }
  | { kind: "swap"; pair: RatchetCogPair };

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

export function cloneRatchetCogPair(pair: RatchetCogPair): RatchetCogPair {
  return {
    cog: { x: pair.cog.x, y: pair.cog.y },
    rest: { x: pair.rest.x, y: pair.rest.y },
  };
}

export function ratchetCogCellsOrthogonal(a: OccCell, b: OccCell): boolean {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return dx + dy === 1;
}

export function ratchetCogPairKey(pair: RatchetCogPair): string {
  const a = occKey(pair.cog.x, pair.cog.y);
  const b = occKey(pair.rest.x, pair.rest.y);
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/** Both painted cells. Catalog extraHazard budget is the live cog only. */
export function ratchetCogCells(pair: RatchetCogPair): OccCell[] {
  return [
    { x: pair.cog.x, y: pair.cog.y },
    { x: pair.rest.x, y: pair.rest.y },
  ];
}

/** The live cog cell. Catalog extraHazard budget is this one tile. */
export function ratchetCogOrb(pair: RatchetCogPair): OccCell {
  return { x: pair.cog.x, y: pair.cog.y };
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 * A Ratchet Cog is **not** a cut (walk occupancy is floor).
 */
export function floodRatchetCogBattleGraph(
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

export function isOnRatchetCogBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodRatchetCogBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the player cannot step on the cog (gate, void, leftover crumb).
 * The Ratchet Cog landing tax then never hits the fight graph.
 */
export function ratchetCogUnreachable(
  player: OccCell,
  pair: RatchetCogPair | null,
  ctx: OccupancyContext,
): boolean {
  if (!pair) return true;
  return !isOnRatchetCogBattleGraph(ratchetCogOrb(pair), player, ctx);
}

/** True when neither painted cell sits on the fight graph. */
export function ratchetCogPairUnreachable(
  player: OccCell,
  pair: RatchetCogPair,
  ctx: OccupancyContext,
): boolean {
  return (
    !isOnRatchetCogBattleGraph(pair.cog, player, ctx) &&
    !isOnRatchetCogBattleGraph(pair.rest, player, ctx)
  );
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isRatchetCogSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= RATCHET_COG_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= RATCHET_COG_SPAWN_CLEAR
  );
}

/**
 * Raw catalog pairs: row-major `"floor"` cells outside spawn±3, each with
 * a +x / +y orthogonal neighbor. Occupancy `tiles` is `!== "wall"` (floor
 * OR portal); production `=== "floor"` skips the gate. No occupancy / void
 * / fight-graph check — leftover crumbs and floor-under-void are included.
 * `existing` skips already-budgeted hazard keys (`MAX_HAZARD_TILES`).
 * Default: the earlier cell holds the cog.
 */
export function rawRatchetCogPairs(
  ctx: OccupancyContext,
  spawn: OccCell,
  existing?: ReadonlySet<string>,
): RatchetCogPair[] {
  const pairs: RatchetCogPair[] = [];
  const { w, h } = gridSize(ctx);
  const eligible = (x: number, y: number): boolean => {
    if (!ctx.tiles[y]?.[x]) return false;
    const k = occKey(x, y);
    if (ctx.portals.has(k)) return false;
    if (isRatchetCogSpawnClear(x, y, spawn)) return false;
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
          cog: { x: gx, y: gy },
          rest: { x: nx, y: ny },
        });
      }
    }
  }
  return pairs;
}

/** Catalog `extraHazardRoll` for Ratchet Cog is always 1. */
export function pickRatchetCogCount(): number {
  return RATCHET_COG_COUNT;
}

/** Fisher–Yates pick of `count` pairs; coin-flip which cell holds the cog. */
export function pickRatchetCogPairs(
  pairs: readonly RatchetCogPair[],
  rng: () => number,
  count: number = RATCHET_COG_COUNT,
): RatchetCogPair[] {
  const shuffled = pairs.map((p) => cloneRatchetCogPair(p));
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }
  const n = Math.min(count, shuffled.length);
  const picked = shuffled.slice(0, n);
  return picked.map((pair) => {
    if (rng() < 0.5) return pair;
    return {
      cog: { x: pair.rest.x, y: pair.rest.y },
      rest: { x: pair.cog.x, y: pair.cog.y },
    };
  });
}

/**
 * Occupancy-blind round-start swap. Unlike Pendulum this is a **2-cell
 * reverse**. Unlike Shift Slab both cells stay floor. Unlike Twin Sparks
 * there is one cog, not two orbs on a 4-tile line.
 */
export function rawRatchetCogSwap(pair: RatchetCogPair): RatchetCogPair {
  return {
    cog: { x: pair.rest.x, y: pair.rest.y },
    rest: { x: pair.cog.x, y: pair.cog.y },
  };
}

function acceptCogCell(
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
  if (isRatchetCogSpawnClear(cell.x, cell.y, spawn)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  return battle.has(k);
}

function acceptPair(
  pair: RatchetCogPair,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
): boolean {
  if (sameCell(pair.cog, pair.rest)) return false;
  if (!ratchetCogCellsOrthogonal(pair.cog, pair.rest)) return false;
  return (
    acceptCogCell(pair.cog, spawn, ctx, battle, placed) &&
    acceptCogCell(pair.rest, spawn, ctx, battle, placed)
  );
}

function preferOrientation(
  a: OccCell,
  b: OccCell,
  destCog: OccCell,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
): RatchetCogPair | null {
  const candidates: RatchetCogPair[] = [
    { cog: { x: a.x, y: a.y }, rest: { x: b.x, y: b.y } },
    { cog: { x: b.x, y: b.y }, rest: { x: a.x, y: a.y } },
  ];
  const ok = candidates.filter((pair) =>
    acceptPair(pair, spawn, ctx, battle, placed),
  );
  if (ok.length === 0) return null;
  const keepCog = ok.find((pair) => sameCell(pair.cog, destCog));
  if (keepCog) return keepCog;
  return ok[0] ?? null;
}

/**
 * Relocate a Ratchet Cog pair onto two adjacent fight-graph cells so
 * **both** are steppable. Returns `null` when the fight graph cannot host
 * a 2-cell run (caller drops the hazard instead of punching). Unique-
 * corridor overlap stays legal. Covering a destacked player outside
 * spawn±3 stays legal. Occupied fight-graph cells stay legal (no
 * occupancy filter — landing tax). Leftover-island dests snap onto the
 * fight graph or drop — they must not punch a join. Unlike BOARD_CLAIM,
 * one steppable cell of two is not enough.
 */
export function legalizeRatchetCogPlacement(
  dest: RatchetCogPair,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
  spawn: OccCell = player,
): RatchetCogPair | null {
  const { w, h } = gridSize(ctx);
  const battle = floodRatchetCogBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const tryPair = (a: OccCell, b: OccCell): RatchetCogPair | null =>
    preferOrientation(a, b, dest.cog, spawn, ctx, battle, placed);
  const direct = tryPair(dest.cog, dest.rest);
  if (direct) return direct;
  const origins: OccCell[] = [
    { x: dest.cog.x, y: dest.cog.y },
    { x: dest.rest.x, y: dest.rest.y },
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
 * Snap several Ratchet Cog pairs off leftover crumbs, voids, portals, and
 * the spawn diamond. Unique-corridor overlap stays. Drops a pair that
 * cannot legalize. Does not restack occupancy unseal or punch walls.
 */
export function legalizeRatchetCogPlacements(
  dests: readonly RatchetCogPair[],
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
  already: ReadonlySet<string> = new Set(),
): RatchetCogPair[] {
  const placed = new Set(already);
  const result: RatchetCogPair[] = [];
  const seen = new Set<string>();
  for (const dest of dests) {
    const snapped = legalizeRatchetCogPlacement(
      dest,
      player,
      ctx,
      placed,
      spawn,
    );
    if (!snapped) continue;
    const id = ratchetCogPairKey(snapped);
    if (seen.has(id)) continue;
    const cogK = occKey(snapped.cog.x, snapped.cog.y);
    const restK = occKey(snapped.rest.x, snapped.rest.y);
    if (placed.has(cogK) || placed.has(restK)) continue;
    seen.add(id);
    placed.add(cogK);
    placed.add(restK);
    result.push(snapped);
  }
  return result;
}

function swapOffGraph(
  pair: RatchetCogPair,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell,
): boolean {
  const battle = floodRatchetCogBattleGraph(player, ctx);
  return !acceptCogCell(pair.cog, spawn, ctx, battle, new Set());
}

/**
 * Occupancy-blind round-start swap. If the next cell is a portal, spawn
 * diamond, void, or leftover crumb, **drop the swap** (stay) rather than
 * snap the pair sideways or hop the choke. Unlike initial placement, swap
 * must not relocate the painted pair onto a different origin. Occupied
 * rest still swaps — landing tax, not a wall.
 */
export function legalizeRatchetCogSwap(
  pair: RatchetCogPair,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): RatchetCogSwap {
  const raw = rawRatchetCogSwap(pair);
  if (swapOffGraph(raw, player, ctx, spawn)) {
    return { kind: "stay", reason: "off-graph" };
  }
  return { kind: "swap", pair: raw };
}

/**
 * Apply one round start. The swap lands only when the next cell still sits
 * on the fight graph. A dropped swap keeps the current orientation so later
 * ticks retry the same legalize instead of punching.
 */
export function resolveRatchetCogAfterRoundStart(
  pair: RatchetCogPair,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): RatchetCogPair {
  const swap = legalizeRatchetCogSwap(pair, player, ctx, spawn);
  if (swap.kind === "swap") return swap.pair;
  return cloneRatchetCogPair(pair);
}

/**
 * Raw catalog pairs from the occupancy grid, then snap so both cells sit
 * on the fight graph. Empty when the fight graph cannot host a 2-cell run.
 */
export function resolveRatchetCog(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  dests?: readonly RatchetCogPair[],
  existing?: ReadonlySet<string>,
  spawn: OccCell = player,
): RatchetCogPair[] {
  const raw =
    dests ??
    (rng
      ? pickRatchetCogPairs(
          rawRatchetCogPairs(ctx, spawn, existing),
          rng,
          pickRatchetCogCount(),
        )
      : rawRatchetCogPairs(ctx, spawn, existing).slice(0, RATCHET_COG_COUNT));
  return legalizeRatchetCogPlacements(
    raw,
    player,
    ctx,
    spawn,
    existing ?? new Set(),
  );
}

/**
 * Live round-start swap of a painted pair. Stays in the current orientation
 * when the next cell would leave the fight graph.
 */
export function resolveRatchetCogSwap(
  pair: RatchetCogPair,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): RatchetCogSwap {
  return legalizeRatchetCogSwap(pair, player, ctx, spawn);
}
