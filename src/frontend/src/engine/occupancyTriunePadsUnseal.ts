/**
 * Catalog Triune Pads (`WF-TEL-TRIUNE_PADS`) plants **three** linked
 * walkable pads painted 1→2→3→1 (catalog mechanic is the trio;
 * `extraHazardCount` is omitted so `extraHazardRoll` would plant nothing)
 * from a `"floor"` raster that skips portals and Chebyshev ≤ 3 from the
 * **legalized spawn** (`SPAWN_SAFE_RADIUS` /
 * `isTileReservedForSpawnOrPortal`, not grid center `WORLD_GRID_SIZE/2`)
 * with **no** occupancy / void / fight-graph check. Occupancy 1+1 unseal
 * relocates combatants and cannot move the pads. Occupancy floods still
 * walk portals, so leftover-islands stays 0, unique-bridge unseal never
 * runs, and one pad can sit on a far-side leftover CA crumb or a
 * floor-under-void. Entering a fight-graph pad for 1 MP then exits at the
 * next clockwise pad — occupancy-blind, including leftover crumbs — and
 * if that pad is occupied the travelers **swap**, so a required body
 * parks permanently off the fight graph without walking the portal choke.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swapPositions /
 * ignore-walls / ghost raster / Eternal Pawn advance / Twin Bishop /
 * summoner midpoint / VOID / ANCHOR / SPIKE / LAVA / greedy moveToward /
 * erratic / king-step / SHOCK / ILLUSION / LARVAE / INK_VEIL / adjacent
 * SpawnData / BOARD_CLAIM / Void Rift / eligibleHazard / walk-blocker /
 * Creeping Ash / Ember Vein / Hunting Lantern / Orbiting Cinder / Gutter
 * Steam / Frost Pane helpers (#589–#1093). Those snap units, rewrite
 * walls, raster-scan `SpawnData`, take one occupancy-blind toward-axis
 * orthogonal step, point-reflect, average two bodies, plant impassable
 * voids at Manhattan-2, plant *two* required-step DAMAGE_IMMUNE glyphs,
 * plant a walkable spike at a knight L dest, plant lava at the *origin*,
 * pick the closest orthogonal `floor||portal` neighbor, pick a random
 * orthogonal `!== "wall"` neighbor, take the Chebyshev king corner, plant
 * `activeShockTiles`, plant IllusionData, plant LarvaData, plant 3–4
 * stealth/trap `glyphedTiles`, plant count-capped adjacent `SpawnData`,
 * plant a 2×2 AP-tax `boardClaimZone`, plant one runtime `voidRiftTile`,
 * plant generate-time lava/ice/spikes from a floor raster that skips the
 * **center 7×7**, plant one impassable `blocksWalk` cell, plant one
 * contiguous **3-tile orthogonal lane**, plant 3–6 **independent
 * always-on** extraHazard dests, plant **one chasing orb**, plant one
 * **closed 4-cycle square**, plant **two independent even/odd vents**, or
 * plant **one walkable LoS wall**. This is a **3-pad clockwise carousel
 * with occupancy swap** (walkable floor; 1 MP travel; occupied dest
 * swaps — not occupancy unseal, not `hazardTiles`, not HP/AP tax, not a
 * painted lane, not a chase, not a 2×2 orb, not two vents, not a LoS
 * wall). `#697` is `swapPositions` (raw cell write, no pad index). `#965`
 * is BOARD_CLAIM (static 2×2 AP tax). `#1030` is Ember Vein (3–6
 * independent HP-tax dests; a partial scatter stays). `#1071` is Orbiting
 * Cinder (orb steps a 2×2; units do not teleport). `#1086` is Gutter
 * Steam (keeps 1 of 2 vents). `#1093` is Frost Pane (one LoS sheet).
 * Unique-corridor / destacked-player / occupied dests stay (walkable;
 * swap is intended on the fight graph). Drop leftover-island dests
 * rather than punch. An incomplete trio (fewer than three distinct
 * fight-graph pads) drops **all** pads — unlike Gutter Steam. Clockwise
 * onto portal / void / leftover crumb **stays** (drop the teleport)
 * rather than hop the choke.
 *
 * Fight-graph snap of each dest, then all-or-nothing trio. Does not
 * restack occupancy.ts, occupancyFrostPaneUnseal,
 * occupancyGutterSteamUnseal, occupancyOrbitingCinderUnseal,
 * occupancyHuntingLanternUnseal, occupancyEmberVeinUnseal,
 * occupancyCreepingAshUnseal, occupancyWalkBlockerUnseal,
 * occupancyEligibleHazardUnseal, occupancyBoardClaimUnseal,
 * occupancyVoidRiftUnseal, occupancySwapUnseal, WorldExploration,
 * worldFeatures.ts, useBossSystem, targeting.ts, or mapGen.simulate.ts.
 */

import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";

/** Catalog mechanic is the 1→2→3→1 trio. `extraHazardCount` is omitted. */
export const TRIUNE_PAD_COUNT = 3;

/** Catalog enter cost. Stay (leftover dest / incomplete) does not debit. */
export const TRIUNE_PAD_MP_COST = 1;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const TRIUNE_PAD_SPAWN_CLEAR = 3;

export const TRIUNE_PAD_FEATURE_ID = "WF-TEL-TRIUNE_PADS";

export type TriunePadStayReason =
  | "not-on-pad"
  | "incomplete-trio"
  | "dest-off-graph"
  | "no-mp";

export type TriunePadTravel =
  | { kind: "stay"; reason: TriunePadStayReason }
  | { kind: "move"; from: OccCell; to: OccCell }
  | { kind: "swap"; from: OccCell; to: OccCell };

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
 * Triune Pads markers are **not** cuts (walk occupancy is floor).
 */
export function floodTriunePadsBattleGraph(
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

export function isOnTriunePadsBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodTriunePadsBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the player cannot step on any of `dests` (gate, void, barrier,
 * leftover crumb). The clockwise carousel then never hits the fight graph.
 */
export function triunePadsUnreachable(
  player: OccCell,
  dests: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (dests.length === 0) return true;
  return !dests.some((cell) => isOnTriunePadsBattleGraph(cell, player, ctx));
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isTriunePadsSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= TRIUNE_PAD_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= TRIUNE_PAD_SPAWN_CLEAR
  );
}

export function clampTriunePadIndex(index: number): number {
  const n = TRIUNE_PAD_COUNT;
  return ((index % n) + n) % n;
}

/** Painted 1→2→3→1. Index order, not geometric clockwise on a 2×2. */
export function nextTriunePadIndex(index: number): number {
  return clampTriunePadIndex(index + 1);
}

export function triunePadIndexAt(
  pads: readonly OccCell[],
  cell: OccCell,
): number {
  const k = occKey(cell.x, cell.y);
  return pads.findIndex((p) => occKey(p.x, p.y) === k);
}

export function isTriunePadTrioComplete(pads: readonly OccCell[]): boolean {
  if (pads.length !== TRIUNE_PAD_COUNT) return false;
  const keys = new Set(pads.map((p) => occKey(p.x, p.y)));
  return keys.size === TRIUNE_PAD_COUNT;
}

export function triunePadTravelCostsMp(travel: TriunePadTravel): boolean {
  return travel.kind === "move" || travel.kind === "swap";
}

/**
 * Raw Triune Pads dests: row-major `"floor"` cells outside spawn±3.
 * Occupancy `tiles` is `!== "wall"` (floor OR portal); production
 * `=== "floor"` skips the gate. No occupancy / void / fight-graph check —
 * leftover crumbs and floor-under-void are included. `existing` skips
 * already-budgeted hazard keys (`MAX_HAZARD_TILES`).
 */
export function rawTriunePadsDests(
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
      if (isTriunePadsSpawnClear(gx, gy, spawn)) continue;
      if (existing?.has(k)) continue;
      dests.push({ x: gx, y: gy });
    }
  }
  return dests;
}

/** Catalog plants exactly three pads. `extraHazardRoll` is 0 (band omitted). */
export function pickTriunePadCount(): number {
  return TRIUNE_PAD_COUNT;
}

/** Fisher–Yates pick of `count` dests. Catalog plants independent cells. */
export function pickTriunePadDests(
  dests: readonly OccCell[],
  rng: () => number,
  count: number = TRIUNE_PAD_COUNT,
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

function acceptTriunePadLanding(
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
  if (isTriunePadsSpawnClear(cell.x, cell.y, spawn)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  return battle.has(k);
}

/**
 * Relocate one Triune Pad onto the fight graph. Returns `null` when the
 * fight graph is empty (caller drops the trio instead of punching).
 * Unique-corridor overlap stays legal (walkable floor). Covering a
 * destacked player outside spawn±3 stays legal. Occupied fight-graph
 * cells stay legal (no occupancy filter — swap is the intended
 * interaction). Leftover-island dests snap onto the fight graph or drop
 * — they must not punch a join.
 */
export function legalizeTriunePadPlacement(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
  placed: ReadonlySet<string> = new Set(),
): OccCell | null {
  const { w, h } = gridSize(ctx);
  const battle = floodTriunePadsBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const ok = (cell: OccCell) =>
    acceptTriunePadLanding(cell, spawn, ctx, battle, placed);
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
 * Snap several Triune Pad dests off leftover crumbs, voids, and the spawn
 * diamond. Drops the **entire trio** when fewer than three distinct
 * fight-graph pads land — unlike Gutter Steam, a 1- or 2-pad remainder
 * is not a clockwise 1→2→3→1 carousel. Does not restack occupancy unseal
 * or punch walls.
 */
export function legalizeTriunePadPlacements(
  dests: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): OccCell[] {
  if (dests.length < TRIUNE_PAD_COUNT) return [];
  const placed = new Set<string>();
  const result: OccCell[] = [];
  for (const dest of dests.slice(0, TRIUNE_PAD_COUNT)) {
    const snapped = legalizeTriunePadPlacement(
      dest,
      player,
      ctx,
      spawn,
      placed,
    );
    if (!snapped) return [];
    placed.add(occKey(snapped.x, snapped.y));
    result.push(snapped);
  }
  if (!isTriunePadTrioComplete(result)) return [];
  return result;
}

/**
 * Occupancy-blind clockwise exit. If the traveler is on pad i, dest is
 * pad (i+1)%3 even when that cell is a leftover crumb, a portal, or a
 * void — production has no fight-graph check. Occupied dests swap.
 */
export function rawTriunePadTravel(
  traveler: OccCell,
  pads: readonly OccCell[],
  ctx: OccupancyContext,
  mp: number = TRIUNE_PAD_MP_COST,
): TriunePadTravel {
  if (!isTriunePadTrioComplete(pads)) {
    return { kind: "stay", reason: "incomplete-trio" };
  }
  const index = triunePadIndexAt(pads, traveler);
  if (index < 0) return { kind: "stay", reason: "not-on-pad" };
  if (mp < TRIUNE_PAD_MP_COST) return { kind: "stay", reason: "no-mp" };
  const dest = pads[nextTriunePadIndex(index)];
  if (!dest) return { kind: "stay", reason: "incomplete-trio" };
  const destKey = occKey(dest.x, dest.y);
  const fromKey = occKey(traveler.x, traveler.y);
  if (destKey === fromKey) return { kind: "stay", reason: "incomplete-trio" };
  if (ctx.isOccupied(dest)) {
    return {
      kind: "swap",
      from: { x: traveler.x, y: traveler.y },
      to: { x: dest.x, y: dest.y },
    };
  }
  return {
    kind: "move",
    from: { x: traveler.x, y: traveler.y },
    to: { x: dest.x, y: dest.y },
  };
}

/**
 * Occupancy-blind clockwise hop. If the next pad is a portal, spawn
 * diamond, void, or leftover crumb, **drop the teleport** (stay painted)
 * rather than snap the pad sideways or hop the choke. Unlike initial
 * placement, travel must not relocate a pad onto a different origin.
 * Occupied fight-graph dests still swap.
 */
export function legalizeTriunePadTravel(
  traveler: OccCell,
  pads: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
  mp: number = TRIUNE_PAD_MP_COST,
): TriunePadTravel {
  const raw = rawTriunePadTravel(traveler, pads, ctx, mp);
  if (raw.kind === "stay") return raw;
  const battle = floodTriunePadsBattleGraph(player, ctx);
  if (!acceptTriunePadLanding(raw.to, spawn, ctx, battle, new Set())) {
    return { kind: "stay", reason: "dest-off-graph" };
  }
  return raw;
}

/**
 * Raw catalog dests from the occupancy grid, then snap so the trio sits
 * on the fight graph. Empty when the fight graph cannot host three
 * distinct pads.
 */
export function resolveTriunePads(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  dests?: readonly OccCell[],
  spawn: OccCell = player,
  existing?: ReadonlySet<string>,
): OccCell[] {
  const raw =
    dests ??
    (rng
      ? pickTriunePadDests(
          rawTriunePadsDests(ctx, spawn, existing),
          rng,
          pickTriunePadCount(),
        )
      : rawTriunePadsDests(ctx, spawn, existing).slice(0, TRIUNE_PAD_COUNT));
  return legalizeTriunePadPlacements(
    raw.slice(0, pickTriunePadCount()),
    player,
    ctx,
    spawn,
  );
}

/**
 * Live clockwise travel of a painted trio. Stays put when the next pad
 * would leave the fight graph, and does not debit MP on stay.
 */
export function resolveTriunePadTravel(
  traveler: OccCell,
  pads: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
  mp: number = TRIUNE_PAD_MP_COST,
): TriunePadTravel {
  return legalizeTriunePadTravel(traveler, pads, player, ctx, spawn, mp);
}
