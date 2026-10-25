/**
 * Catalog Gutter Steam (`WF-ENV-GUTTER_STEAM`) plants **two** independent
 * walkable vent tiles (`extraHazardCount` min = max = 2) from a `"floor"`
 * raster that skips portals and Chebyshev ≤ 3 from the **legalized spawn**
 * (`SPAWN_SAFE_RADIUS` / `isTileReservedForSpawnOrPortal`, not grid center
 * `WORLD_GRID_SIZE/2`) with **no** occupancy / void / fight-graph check.
 * Occupancy 1+1 unseal relocates combatants and cannot move the vents.
 * Occupancy floods still walk portals, so leftover-islands stays 0, unique-
 * bridge unseal never runs, and both dests can sit on a far-side leftover
 * CA crumb or a floor-under-void — the −4% max-HP **even-round end-of-turn**
 * tax never appears on the fight graph. Odd rounds the vents are inert
 * floor; even rounds they jet in place (they do not chase, orbit, or slide).
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop / summoner midpoint / VOID /
 * ANCHOR / SPIKE / LAVA / greedy moveToward / erratic / king-step / SHOCK /
 * ILLUSION / LARVAE / INK_VEIL / adjacent SpawnData / BOARD_CLAIM / Void
 * Rift / eligibleHazard / walk-blocker / Creeping Ash / Ember Vein /
 * Hunting Lantern / Orbiting Cinder helpers (#589–#1071). Those snap units,
 * rewrite walls, raster-scan `SpawnData`, take one occupancy-blind toward-
 * axis orthogonal step, point-reflect, average two bodies, plant
 * impassable voids at Manhattan-2, plant *two* required-step DAMAGE_IMMUNE
 * glyphs, plant a walkable spike at a knight L dest, plant lava at the
 * *origin*, pick the closest orthogonal `floor||portal` neighbor, pick a
 * random orthogonal `!== "wall"` neighbor, take the Chebyshev king corner,
 * plant `activeShockTiles`, plant IllusionData, plant LarvaData, plant
 * 3–4 stealth/trap `glyphedTiles`, plant count-capped adjacent `SpawnData`,
 * plant a 2×2 AP-tax `boardClaimZone`, plant one runtime `voidRiftTile`,
 * plant generate-time lava/ice/spikes from a floor raster that skips the
 * **center 7×7**, plant one impassable `blocksWalk` cell, plant one
 * contiguous **3-tile orthogonal lane** that then shifts by its heading,
 * plant 3–6 **independent always-on** extraHazard dests, plant **one
 * chasing orb**, or plant one **closed 4-cycle square**. This is **two
 * independent even/odd vents** (walkable end-of-turn HP tax on even
 * rounds, inert on odd — not occupancy, not `hazardTiles` lava/ice/spikes,
 * not a painted lane, not a static 3–6 scatter, not a chase, not a
 * clockwise 2×2). `#965` is BOARD_CLAIM (static 2×2 AP tax, at-least-one
 * steppable). `#970` is Void Rift (one floor cell/turn). `#976` is
 * eligibleHazard (independent dests, skip is grid center, count 1–3 /
 * 3–8). `#1013` is walk-blockers (impassable; unique-corridor snaps off).
 * `#1023` is Creeping Ash (contiguous 3-tile lane + advance). `#1030` is
 * Ember Vein (3–6 independent always-on dests). `#1038` is Hunting Lantern
 * (one chasing orb). `#1071` is Orbiting Cinder (4-tile clockwise square).
 * Unique-corridor / destacked-player / occupied dests stay. Drop leftover-
 * island dests rather than punch. Even-round jets that sit on portal /
 * void / leftover crumb **stay painted** (drop the tax) rather than snap
 * or hop the choke.
 *
 * Fight-graph snap of each dest. Does not restack occupancy.ts,
 * occupancyOrbitingCinderUnseal, occupancyHuntingLanternUnseal,
 * occupancyEmberVeinUnseal, occupancyCreepingAshUnseal,
 * occupancyWalkBlockerUnseal, occupancyEligibleHazardUnseal,
 * occupancyBoardClaimUnseal, occupancyVoidRiftUnseal, WorldExploration,
 * worldFeatures.ts, useBossSystem, or mapGen.simulate.ts.
 */

import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";

/** Catalog `extraHazardCount` for Gutter Steam is exactly two vents. */
export const GUTTER_STEAM_COUNT = 2;

/** Catalog `hpTaxPctOfMax` for a jetting vent occupant. */
export const GUTTER_STEAM_HP_TAX_PCT = 0.04;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const GUTTER_STEAM_SPAWN_CLEAR = 3;

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
 */
export function floodGutterSteamBattleGraph(
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

export function isOnGutterSteamBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodGutterSteamBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the player cannot step on any of `dests` (gate, void, barrier,
 * leftover crumb). The Gutter Steam even-round tax then never hits the
 * fight graph.
 */
export function gutterSteamUnreachable(
  player: OccCell,
  dests: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (dests.length === 0) return true;
  return !dests.some((cell) => isOnGutterSteamBattleGraph(cell, player, ctx));
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isGutterSteamSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= GUTTER_STEAM_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= GUTTER_STEAM_SPAWN_CLEAR
  );
}

/**
 * Even integers jet; odd integers are inert floor. Catalog "even rounds"
 * uses the combat round number (0, 2, 4… or 2, 4, 6… both jet).
 */
export function isGutterSteamJettingRound(round: number): boolean {
  return Math.trunc(round) % 2 === 0;
}

/**
 * Occupancy-blind even-round jet set. Odd rounds return nothing (inert
 * floor). Even rounds return every painted vent — including leftover
 * crumbs and the gate, because production has no fight-graph check.
 */
export function rawGutterSteamJets(
  vents: readonly OccCell[],
  round: number,
): OccCell[] {
  if (!isGutterSteamJettingRound(round)) return [];
  return vents.map((c) => ({ x: c.x, y: c.y }));
}

/**
 * End-of-turn tax: occupying a jetting vent. Odd rounds never tax.
 * Production does not consult occupancy / void / fight-graph — a leftover
 * crumb occupant would still pay, but that occupant is already isolated.
 */
export function gutterSteamOccupantPaysTax(
  occupant: OccCell,
  vents: readonly OccCell[],
  round: number,
): boolean {
  if (!isGutterSteamJettingRound(round)) return false;
  const k = occKey(occupant.x, occupant.y);
  return vents.some((v) => occKey(v.x, v.y) === k);
}

/**
 * Raw Gutter Steam dests: row-major `"floor"` cells outside spawn±3.
 * Occupancy `tiles` is `!== "wall"` (floor OR portal); production
 * `=== "floor"` skips the gate. No occupancy / void / fight-graph check —
 * leftover crumbs and floor-under-void are included. `existing` skips
 * already-budgeted hazard keys (`MAX_HAZARD_TILES`).
 */
export function rawGutterSteamDests(
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
      if (isGutterSteamSpawnClear(gx, gy, spawn)) continue;
      if (existing?.has(k)) continue;
      dests.push({ x: gx, y: gy });
    }
  }
  return dests;
}

/** Catalog `extraHazardRoll` for Gutter Steam is always 2. */
export function pickGutterSteamCount(): number {
  return GUTTER_STEAM_COUNT;
}

/** Fisher–Yates pick of `count` dests. Catalog plants independent cells. */
export function pickGutterSteamDests(
  dests: readonly OccCell[],
  rng: () => number,
  count: number = GUTTER_STEAM_COUNT,
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

function acceptGutterSteamLanding(
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
  if (isGutterSteamSpawnClear(cell.x, cell.y, spawn)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  return battle.has(k);
}

/**
 * Relocate a Gutter Steam vent onto the fight graph. Returns `null` when
 * the fight graph is empty (caller drops the hazard instead of punching).
 * Unique-corridor overlap stays legal. Covering a destacked player
 * outside spawn±3 stays legal. Occupied fight-graph cells stay legal (no
 * occupancy filter). Leftover-island dests snap onto the fight graph or
 * drop — they must not punch a join.
 */
export function legalizeGutterSteamPlacement(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
  placed: ReadonlySet<string> = new Set(),
): OccCell | null {
  const { w, h } = gridSize(ctx);
  const battle = floodGutterSteamBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const ok = (cell: OccCell) =>
    acceptGutterSteamLanding(cell, spawn, ctx, battle, placed);
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
 * Snap several Gutter Steam dests off leftover crumbs, voids, and the
 * spawn diamond. Drops a dest that cannot legalize. Does not restack
 * occupancy unseal or punch walls.
 */
export function legalizeGutterSteamPlacements(
  dests: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): OccCell[] {
  const placed = new Set<string>();
  const result: OccCell[] = [];
  for (const dest of dests) {
    const snapped = legalizeGutterSteamPlacement(
      dest,
      player,
      ctx,
      spawn,
      placed,
    );
    if (!snapped) continue;
    placed.add(occKey(snapped.x, snapped.y));
    result.push(snapped);
  }
  return result;
}

/**
 * Occupancy-blind even-round jet. If a painted vent is a portal, spawn
 * diamond, void, or leftover crumb, **drop that vent from the tax set**
 * (stay painted) rather than snap sideways or hop the choke. Odd rounds
 * return nothing — the vents are inert floor. Unlike initial placement,
 * a jet must not relocate a vent onto a different origin.
 */
export function legalizeGutterSteamJets(
  vents: readonly OccCell[],
  round: number,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): OccCell[] {
  if (!isGutterSteamJettingRound(round)) return [];
  const battle = floodGutterSteamBattleGraph(player, ctx);
  return vents.filter((v) =>
    acceptGutterSteamLanding(v, spawn, ctx, battle, new Set()),
  );
}

/**
 * Raw catalog dests from the occupancy grid, then snap so Gutter Steam
 * sits on the fight graph. Empty when the fight graph cannot host a vent.
 */
export function resolveGutterSteam(
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
      ? pickGutterSteamDests(
          rawGutterSteamDests(ctx, spawn, existing),
          rng,
          pickGutterSteamCount(),
        )
      : rawGutterSteamDests(ctx, spawn, existing).slice(0, GUTTER_STEAM_COUNT));
  return legalizeGutterSteamPlacements(raw, player, ctx, spawn);
}

/**
 * Even-round jet of live vents. Empty on odd rounds, and empty for any
 * vent that would leave the fight graph.
 */
export function resolveGutterSteamJets(
  vents: readonly OccCell[],
  round: number,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): OccCell[] {
  return legalizeGutterSteamJets(vents, round, player, ctx, spawn);
}
