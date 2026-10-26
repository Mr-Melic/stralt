/**
 * Catalog Slipstream (`WF-TEL-SLIPSTREAM`) plants **two** linked walkable
 * pads painted A → B (catalog mechanic is the one-way pair;
 * `extraHazardCount` is omitted so `extraHazardRoll` would plant nothing)
 * from a `"floor"` raster that skips portals and Chebyshev ≤ 3 from the
 * **legalized spawn** (`SPAWN_SAFE_RADIUS` /
 * `isTileReservedForSpawnOrPortal`, not grid center `WORLD_GRID_SIZE/2`)
 * with **no** occupancy / void / fight-graph check. Occupancy 1+1 unseal
 * relocates combatants and cannot move the pads. Occupancy floods still
 * walk portals, so leftover-islands stays 0, unique-bridge unseal never
 * runs, and B can sit on a far-side leftover CA crumb or a
 * floor-under-void. Entering fight-graph A for 1 MP then exits at B —
 * occupancy-blind, including leftover crumbs — and if B is occupied the
 * travelers **swap**, so a required body parks permanently off the fight
 * graph without walking the portal choke. B does not send anyone back.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swapPositions /
 * ignore-walls / ghost raster / Eternal Pawn advance / Twin Bishop /
 * summoner midpoint / VOID / ANCHOR / SPIKE / LAVA / greedy moveToward /
 * erratic / king-step / SHOCK / ILLUSION / LARVAE / INK_VEIL / adjacent
 * SpawnData / BOARD_CLAIM / Void Rift / eligibleHazard / walk-blocker /
 * Creeping Ash / Ember Vein / Hunting Lantern / Orbiting Cinder / Gutter
 * Steam / Frost Pane / Triune Pads / Spent Bridge helpers (#589–#1127).
 * Those snap units, rewrite walls, raster-scan `SpawnData`, take one
 * occupancy-blind toward-axis orthogonal step, point-reflect, average two
 * bodies, plant impassable voids at Manhattan-2, plant *two* required-step
 * DAMAGE_IMMUNE glyphs, plant a walkable spike at a knight L dest, plant
 * lava at the *origin*, pick the closest orthogonal `floor||portal`
 * neighbor, pick a random orthogonal `!== "wall"` neighbor, take the
 * Chebyshev king corner, plant `activeShockTiles`, plant IllusionData,
 * plant LarvaData, plant 3–4 stealth/trap `glyphedTiles`, plant
 * count-capped adjacent `SpawnData`, plant a 2×2 AP-tax `boardClaimZone`,
 * plant one runtime `voidRiftTile`, plant generate-time lava/ice/spikes
 * from a floor raster that skips the **center 7×7**, plant one impassable
 * `blocksWalk` cell, plant one contiguous **3-tile orthogonal lane**,
 * plant 3–6 **independent always-on** extraHazard dests, plant **one
 * chasing orb**, plant one **closed 4-cycle square**, plant **two
 * independent even/odd vents**, plant **one walkable LoS wall**, plant a
 * **3-pad clockwise carousel**, or plant a **delayed floor→wall after
 * three leaves**. This is a **one-way A→B pair with occupancy swap**
 * (walkable floor; 1 MP travel; occupied dest swaps; B never returns —
 * not occupancy unseal, not `hazardTiles`, not HP/AP tax, not a painted
 * lane, not a chase, not a 2×2 orb, not two vents, not a LoS wall, not a
 * 3-pad carousel, not a delayed wall). `#697` is `swapPositions` (raw
 * cell write, no pad index). `#965` is BOARD_CLAIM (static 2×2 AP tax).
 * `#1030` is Ember Vein (3–6 independent HP-tax dests). `#1071` is
 * Orbiting Cinder (orb steps a 2×2; units do not teleport). `#1086` is
 * Gutter Steam (keeps 1 of 2 vents). `#1093` is Frost Pane. `#1103` is
 * Triune Pads (3-pad 1→2→3→1; B would still send you on). `#1127` is
 * Spent Bridge (delayed wall). Unique-corridor / destacked-player /
 * occupied dests stay (walkable; swap is intended on the fight graph).
 * Drop leftover-island dests rather than punch. An incomplete pair
 * (fewer than two distinct fight-graph pads) drops **all** pads — unlike
 * Gutter Steam. A→B onto portal / void / leftover crumb **stays** (drop
 * the teleport) rather than hop the choke. Standing on B is a free stay.
 *
 * Fight-graph snap of each dest, then all-or-nothing pair. Does not
 * restack occupancy.ts, occupancyTriunePadsUnseal,
 * occupancySpentBridgeUnseal, occupancyFrostPaneUnseal,
 * occupancyGutterSteamUnseal, occupancyOrbitingCinderUnseal,
 * occupancyHuntingLanternUnseal, occupancyEmberVeinUnseal,
 * occupancyCreepingAshUnseal, occupancyWalkBlockerUnseal,
 * occupancyEligibleHazardUnseal, occupancyBoardClaimUnseal,
 * occupancyVoidRiftUnseal, occupancySwapUnseal, WorldExploration,
 * worldFeatures.ts, useBossSystem, targeting.ts, or mapGen.simulate.ts.
 */

import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";

/** Catalog mechanic is the one-way A→B pair. `extraHazardCount` is omitted. */
export const SLIPSTREAM_PAD_COUNT = 2;

/** Catalog enter cost. Stay (leftover dest / incomplete / on B) does not debit. */
export const SLIPSTREAM_MP_COST = 1;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const SLIPSTREAM_SPAWN_CLEAR = 3;

export const SLIPSTREAM_FEATURE_ID = "WF-TEL-SLIPSTREAM";

/** Index 0 is entry A; index 1 is exit B. B never sends anyone back. */
export const SLIPSTREAM_ENTRY_INDEX = 0;
export const SLIPSTREAM_EXIT_INDEX = 1;

export type SlipstreamStayReason =
  | "not-on-entry"
  | "incomplete-pair"
  | "dest-off-graph"
  | "no-mp";

export type SlipstreamTravel =
  | { kind: "stay"; reason: SlipstreamStayReason }
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
 * Slipstream markers are **not** cuts (walk occupancy is floor).
 */
export function floodSlipstreamBattleGraph(
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

export function isOnSlipstreamBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodSlipstreamBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the player cannot step on any of `dests` (gate, void, barrier,
 * leftover crumb). The one-way skip then never hits the fight graph.
 */
export function slipstreamUnreachable(
  player: OccCell,
  dests: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (dests.length === 0) return true;
  return !dests.some((cell) => isOnSlipstreamBattleGraph(cell, player, ctx));
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isSlipstreamSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= SLIPSTREAM_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= SLIPSTREAM_SPAWN_CLEAR
  );
}

export function slipstreamPadIndexAt(
  pads: readonly OccCell[],
  cell: OccCell,
): number {
  const k = occKey(cell.x, cell.y);
  return pads.findIndex((p) => occKey(p.x, p.y) === k);
}

export function isOnSlipstreamEntry(
  pads: readonly OccCell[],
  cell: OccCell,
): boolean {
  return slipstreamPadIndexAt(pads, cell) === SLIPSTREAM_ENTRY_INDEX;
}

export function isSlipstreamPairComplete(pads: readonly OccCell[]): boolean {
  if (pads.length !== SLIPSTREAM_PAD_COUNT) return false;
  const keys = new Set(pads.map((p) => occKey(p.x, p.y)));
  return keys.size === SLIPSTREAM_PAD_COUNT;
}

export function slipstreamTravelCostsMp(travel: SlipstreamTravel): boolean {
  return travel.kind === "move" || travel.kind === "swap";
}

/**
 * Raw Slipstream dests: row-major `"floor"` cells outside spawn±3.
 * Occupancy `tiles` is `!== "wall"` (floor OR portal); production
 * `=== "floor"` skips the gate. No occupancy / void / fight-graph check —
 * leftover crumbs and floor-under-void are included. `existing` skips
 * already-budgeted hazard keys (`MAX_HAZARD_TILES`).
 */
export function rawSlipstreamDests(
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
      if (isSlipstreamSpawnClear(gx, gy, spawn)) continue;
      if (existing?.has(k)) continue;
      dests.push({ x: gx, y: gy });
    }
  }
  return dests;
}

/** Catalog plants exactly two pads. `extraHazardRoll` is 0 (band omitted). */
export function pickSlipstreamCount(): number {
  return SLIPSTREAM_PAD_COUNT;
}

/** Fisher–Yates pick of `count` dests. First is A, second is B. */
export function pickSlipstreamDests(
  dests: readonly OccCell[],
  rng: () => number,
  count: number = SLIPSTREAM_PAD_COUNT,
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

function acceptSlipstreamLanding(
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
  if (isSlipstreamSpawnClear(cell.x, cell.y, spawn)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  return battle.has(k);
}

/**
 * Relocate one Slipstream pad onto the fight graph. Returns `null` when the
 * fight graph is empty (caller drops the pair instead of punching).
 * Unique-corridor overlap stays legal (walkable floor). Covering a
 * destacked player outside spawn±3 stays legal. Occupied fight-graph
 * cells stay legal (no occupancy filter — swap is the intended
 * interaction on B). Leftover-island dests snap onto the fight graph or
 * drop — they must not punch a join.
 */
export function legalizeSlipstreamPlacement(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
  placed: ReadonlySet<string> = new Set(),
): OccCell | null {
  const { w, h } = gridSize(ctx);
  const battle = floodSlipstreamBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const ok = (cell: OccCell) =>
    acceptSlipstreamLanding(cell, spawn, ctx, battle, placed);
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
 * Snap several Slipstream dests off leftover crumbs, voids, and the spawn
 * diamond. Drops the **entire pair** when fewer than two distinct
 * fight-graph pads land — unlike Gutter Steam, a 1-pad remainder is not
 * a one-way A→B skip. Does not restack occupancy unseal or punch walls.
 */
export function legalizeSlipstreamPlacements(
  dests: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): OccCell[] {
  if (dests.length < SLIPSTREAM_PAD_COUNT) return [];
  const placed = new Set<string>();
  const result: OccCell[] = [];
  for (const dest of dests.slice(0, SLIPSTREAM_PAD_COUNT)) {
    const snapped = legalizeSlipstreamPlacement(
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
  if (!isSlipstreamPairComplete(result)) return [];
  return result;
}

/**
 * Occupancy-blind one-way exit. If the traveler is on A, dest is B even
 * when that cell is a leftover crumb, a portal, or a void — production
 * has no fight-graph check. Occupied dests swap. Standing on B never
 * returns to A (unlike Mirror Step / Triune Pads).
 */
export function rawSlipstreamTravel(
  traveler: OccCell,
  pads: readonly OccCell[],
  ctx: OccupancyContext,
  mp: number = SLIPSTREAM_MP_COST,
): SlipstreamTravel {
  if (!isSlipstreamPairComplete(pads)) {
    return { kind: "stay", reason: "incomplete-pair" };
  }
  if (!isOnSlipstreamEntry(pads, traveler)) {
    return { kind: "stay", reason: "not-on-entry" };
  }
  if (mp < SLIPSTREAM_MP_COST) return { kind: "stay", reason: "no-mp" };
  const dest = pads[SLIPSTREAM_EXIT_INDEX];
  if (!dest) return { kind: "stay", reason: "incomplete-pair" };
  const destKey = occKey(dest.x, dest.y);
  const fromKey = occKey(traveler.x, traveler.y);
  if (destKey === fromKey) return { kind: "stay", reason: "incomplete-pair" };
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
 * Occupancy-blind A→B hop. If B is a portal, spawn diamond, void, or
 * leftover crumb, **drop the teleport** (stay painted) rather than snap
 * the pad sideways or hop the choke. Unlike initial placement, travel
 * must not relocate a pad onto a different origin. Occupied fight-graph
 * dests still swap. Standing on B stays.
 */
export function legalizeSlipstreamTravel(
  traveler: OccCell,
  pads: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
  mp: number = SLIPSTREAM_MP_COST,
): SlipstreamTravel {
  const raw = rawSlipstreamTravel(traveler, pads, ctx, mp);
  if (raw.kind === "stay") return raw;
  const battle = floodSlipstreamBattleGraph(player, ctx);
  if (!acceptSlipstreamLanding(raw.to, spawn, ctx, battle, new Set())) {
    return { kind: "stay", reason: "dest-off-graph" };
  }
  return raw;
}

/**
 * Raw catalog dests from the occupancy grid, then snap so the pair sits
 * on the fight graph. Empty when the fight graph cannot host two
 * distinct pads.
 */
export function resolveSlipstream(
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
      ? pickSlipstreamDests(
          rawSlipstreamDests(ctx, spawn, existing),
          rng,
          pickSlipstreamCount(),
        )
      : rawSlipstreamDests(ctx, spawn, existing).slice(
          0,
          SLIPSTREAM_PAD_COUNT,
        ));
  return legalizeSlipstreamPlacements(
    raw.slice(0, pickSlipstreamCount()),
    player,
    ctx,
    spawn,
  );
}

/**
 * Live one-way travel of a painted pair. Stays put when B would leave
 * the fight graph, when the traveler is on B, and does not debit MP on
 * stay.
 */
export function resolveSlipstreamTravel(
  traveler: OccCell,
  pads: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
  mp: number = SLIPSTREAM_MP_COST,
): SlipstreamTravel {
  return legalizeSlipstreamTravel(traveler, pads, player, ctx, spawn, mp);
}
