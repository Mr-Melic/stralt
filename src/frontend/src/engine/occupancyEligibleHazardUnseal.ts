/**
 * Generate-time `eligibleHazard` (WX `generateRandomMap`) and portal-transition
 * `eligMod` plant lava/ice/spikes by raster-scanning `tiles === "floor"` with
 * **no** occupancy / void / fight-graph check. They skip portals and the
 * Chebyshev ≤ 3 diamond around grid center (`WORLD_GRID_SIZE/2`, not the
 * legalized spawn), then Fisher–Yates 1–3 dests (15% generate) or 3–8 dests
 * (modifier). Occupancy 1+1 unseal relocates combatants and cannot move
 * `GameMap.hazardTiles`. Occupancy floods still walk portals, so
 * leftover-islands stays 0, unique-bridge unseal never runs, and every
 * hazard can sit on a far-side leftover CA crumb or a floor-under-void —
 * the walk HP/MP tax never appears on the fight graph. After
 * `applyFinalizedLayout` walls leftover crumbs, those keys stay on the
 * hazard Map pointing at walls.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop / summoner midpoint / VOID /
 * ANCHOR / SPIKE / LAVA / greedy moveToward / erratic / king-step / SHOCK /
 * ILLUSION / LARVAE / INK_VEIL / adjacent SpawnData / BOARD_CLAIM / Void Rift
 * helpers (#589–#970). Those snap units, rewrite walls, raster-scan
 * `SpawnData`, take one occupancy-blind toward-axis orthogonal step,
 * point-reflect, average two bodies, plant impassable voids at Manhattan-2,
 * plant *two* required-step DAMAGE_IMMUNE glyphs, plant a walkable spike at
 * a knight L dest, plant lava at the *origin* of a hop, pick the closest
 * orthogonal `floor||portal` neighbor, pick a random orthogonal `!== "wall"`
 * neighbor, take the Chebyshev king corner, plant `activeShockTiles`, plant
 * IllusionData, plant LarvaData, plant 3–4 stealth/trap `glyphedTiles`,
 * plant count-capped adjacent `SpawnData`, plant a 2×2 AP-tax
 * `boardClaimZone`, or plant one runtime `voidRiftTile` per player turn.
 * This is generate-time / modifier-time `hazardTiles` (lava | ice | spikes)
 * from a floor-only raster that also skips the center 7×7 — not
 * `voidRiftTile`, not INK_VEIL `allTiles` (which includes portals and
 * skips occupied/player), not LAVA_TRAIL origin, not SPIKE_ON_LAND knight
 * dest. `#846` is SPIKE_ON_LAND. `#855` is LAVA_TRAIL. `#925` is INK_VEIL.
 * `#970` is Void Rift. Unique-corridor landings stay legal (walkable tax;
 * unlike VOID they must not punch the only exit). Covering the player
 * stays legal when spawn legalize left the center diamond. Occupied
 * fight-graph cells stay legal (no occupancy filter). Drop leftover-island
 * dests rather than punch.
 *
 * Fight-graph snap of each dest. Does not restack occupancy.ts,
 * occupancyVoidRiftUnseal, occupancyInkVeilUnseal, occupancyLavaUnseal,
 * occupancySpikeUnseal, occupancyBoardClaimUnseal, WorldExploration,
 * worldFeatures.ts, useBossSystem, or mapGen.simulate.ts.
 */

import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";

/** WX generateRandomMap / eligMod skip Chebyshev ≤ 3 from grid center. */
export const ELIGIBLE_HAZARD_CENTER_CLEAR = 3;

/** Generate-time `1 + floor(random * 3)` (1–3). */
export const ELIGIBLE_HAZARD_GENERATE_MIN = 1;
export const ELIGIBLE_HAZARD_GENERATE_MAX = 3;

/** Modifier `3 + floor(random * 6)` (3–8). */
export const ELIGIBLE_HAZARD_MOD_MIN = 3;
export const ELIGIBLE_HAZARD_MOD_MAX = 8;

export const ELIGIBLE_HAZARD_TYPES = ["lava", "ice", "spikes"] as const;
export type EligibleHazardType = (typeof ELIGIBLE_HAZARD_TYPES)[number];

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
 */
export function floodEligibleHazardBattleGraph(
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
      const cur = q.shift()!;
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

export function isOnEligibleHazardBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodEligibleHazardBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the player cannot step on any of `dests` (gate, void, barrier,
 * leftover crumb). The lava/ice/spikes walk tax then never hits the fight
 * graph.
 */
export function eligibleHazardUnreachable(
  player: OccCell,
  dests: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (dests.length === 0) return true;
  return !dests.some((cell) =>
    isOnEligibleHazardBattleGraph(cell, player, ctx),
  );
}

/** Production `|hx - 8| <= 3 && |hy - 8| <= 3` on a 16×16 grid. */
export function isEligibleHazardCenterClear(x: number, y: number): boolean {
  const cx = Math.floor(WORLD_GRID_SIZE / 2);
  const cy = Math.floor(WORLD_GRID_SIZE / 2);
  return (
    Math.abs(x - cx) <= ELIGIBLE_HAZARD_CENTER_CLEAR &&
    Math.abs(y - cy) <= ELIGIBLE_HAZARD_CENTER_CLEAR
  );
}

/**
 * Raw eligible-hazard dests: row-major `"floor"` cells outside the center
 * 7×7. Occupancy `tiles` is `!== "wall"` (floor OR portal); production
 * `=== "floor"` skips the gate. No occupancy / void / fight-graph check —
 * leftover crumbs and floor-under-void are included. `existing` matches
 * portal-transition `eligMod` (`hazardMap.has`). Production hardcodes
 * 16×16; tests use the live occupancy grid, still skipping WORLD_GRID
 * center so small fixtures keep their leftover crumbs.
 */
export function rawEligibleHazardDests(
  ctx: OccupancyContext,
  existing?: ReadonlySet<string>,
): OccCell[] {
  const dests: OccCell[] = [];
  const { w, h } = gridSize(ctx);
  for (let gy = 0; gy < h; gy++) {
    for (let gx = 0; gx < w; gx++) {
      if (!ctx.tiles[gy]?.[gx]) continue;
      const k = occKey(gx, gy);
      if (ctx.portals.has(k)) continue;
      if (isEligibleHazardCenterClear(gx, gy)) continue;
      if (existing?.has(k)) continue;
      dests.push({ x: gx, y: gy });
    }
  }
  return dests;
}

/** Production generate-time `1 + Math.floor(Math.random() * 3)`. */
export function pickGenerateHazardCount(rng: () => number): number {
  return (
    ELIGIBLE_HAZARD_GENERATE_MIN +
    Math.floor(
      rng() * (ELIGIBLE_HAZARD_GENERATE_MAX - ELIGIBLE_HAZARD_GENERATE_MIN + 1),
    )
  );
}

/** Production modifier `3 + Math.floor(Math.random() * 6)`. */
export function pickModHazardCount(rng: () => number): number {
  return (
    ELIGIBLE_HAZARD_MOD_MIN +
    Math.floor(rng() * (ELIGIBLE_HAZARD_MOD_MAX - ELIGIBLE_HAZARD_MOD_MIN + 1))
  );
}

export function pickEligibleHazardType(rng: () => number): EligibleHazardType {
  return ELIGIBLE_HAZARD_TYPES[
    Math.floor(rng() * ELIGIBLE_HAZARD_TYPES.length)
  ];
}

/** Fisher–Yates pick of `count` dests. Production shuffles then takes first N. */
export function pickEligibleHazardDests(
  dests: readonly OccCell[],
  rng: () => number,
  count: number,
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

function acceptEligibleHazardLanding(
  cell: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
): boolean {
  const k = occKey(cell.x, cell.y);
  if (placed.has(k)) return false;
  if (ctx.portals.has(k)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  return battle.has(k);
}

/**
 * Relocate a lava/ice/spikes marker onto the fight graph. Returns `null`
 * when the fight graph is empty (caller drops the hazard instead of
 * punching). Unique-corridor overlap stays legal. Covering the player
 * stays legal. Occupied fight-graph cells stay legal (production has no
 * occupancy filter). Leftover-island dests snap onto the fight graph or
 * drop — they must not punch a join.
 */
export function legalizeEligibleHazardPlacement(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
): OccCell | null {
  const { w, h } = gridSize(ctx);
  const battle = floodEligibleHazardBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const ok = (cell: OccCell) =>
    acceptEligibleHazardLanding(cell, ctx, battle, placed);
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
 * Snap several generate-time / modifier hazards off leftover crumbs and
 * voids. Drops a dest that cannot legalize. Does not restack occupancy
 * unseal or punch walls.
 */
export function legalizeEligibleHazardPlacements(
  dests: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
): OccCell[] {
  const placed = new Set<string>();
  const result: OccCell[] = [];
  for (const dest of dests) {
    const snapped = legalizeEligibleHazardPlacement(dest, player, ctx, placed);
    if (!snapped) continue;
    placed.add(occKey(snapped.x, snapped.y));
    result.push(snapped);
  }
  return result;
}

/**
 * Raw generate-time dests from the occupancy grid, then snap so lava/ice/
 * spikes sit on the fight graph. Empty when the fight graph cannot host a
 * hazard.
 */
export function resolveEligibleHazards(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  dests?: readonly OccCell[],
  existing?: ReadonlySet<string>,
): OccCell[] {
  const raw =
    dests ??
    (rng
      ? pickEligibleHazardDests(
          rawEligibleHazardDests(ctx, existing),
          rng,
          pickGenerateHazardCount(rng),
        )
      : rawEligibleHazardDests(ctx, existing).slice(
          0,
          ELIGIBLE_HAZARD_GENERATE_MIN,
        ));
  return legalizeEligibleHazardPlacements(raw, player, ctx);
}

/**
 * Portal-transition `eligMod` dests (3–8 of one type). Same fight-graph
 * snap as generate-time; skips cells already in `existing`.
 */
export function resolveModHazards(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  dests?: readonly OccCell[],
  existing?: ReadonlySet<string>,
): OccCell[] {
  const raw =
    dests ??
    (rng
      ? pickEligibleHazardDests(
          rawEligibleHazardDests(ctx, existing),
          rng,
          pickModHazardCount(rng),
        )
      : rawEligibleHazardDests(ctx, existing).slice(
          0,
          ELIGIBLE_HAZARD_MOD_MIN,
        ));
  return legalizeEligibleHazardPlacements(raw, player, ctx);
}
