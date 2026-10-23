/**
 * Map-modifier Void Rift plants one walk-tax tile per player turn by
 * raster-scanning `tiles === "floor"` (WX `setVoidRiftTile`) with
 * `Math.floor(Math.random() * walkable.length)` and **no** occupancy /
 * void / fight-graph check. Occupancy 1+1 unseal relocates combatants
 * and cannot move `voidRiftTile`. Occupancy floods still walk portals,
 * so leftover-islands stays 0, unique-bridge unseal never runs, and the
 * pick can sit on a far-side leftover CA crumb or a generation void —
 * the −3 HP walk dest tax never appears on the fight graph.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop / summoner midpoint / VOID /
 * ANCHOR / SPIKE / LAVA / greedy moveToward / erratic / king-step / SHOCK /
 * ILLUSION / LARVAE / INK_VEIL / adjacent SpawnData / BOARD_CLAIM helpers
 * (#589–#965). Those snap units, rewrite walls, raster-scan `SpawnData`,
 * take one occupancy-blind toward-axis orthogonal step, point-reflect,
 * average two bodies, plant impassable voids at Manhattan-2, plant *two*
 * required-step DAMAGE_IMMUNE glyphs, plant a walkable spike at a knight L
 * dest, plant lava at the *origin*, pick the closest orthogonal
 * `floor||portal` neighbor, pick a random orthogonal `!== "wall"` neighbor,
 * take the Chebyshev king corner, plant `activeShockTiles`, plant
 * IllusionData, plant LarvaData, plant 3–4 stealth/trap `glyphedTiles`,
 * plant count-capped adjacent `SpawnData`, or plant a 2×2 AP-tax
 * `boardClaimZone` with no `allTiles` filter. This is one `voidRiftTile`
 * dest (walk HP tax, not occupancy, not `glyphedTiles`, not `hazardTiles`,
 * not `boardClaimZone`) from a floor-only raster — production skips
 * portals because they are not `"floor"`, unlike INK_VEIL `allTiles`.
 * `#765` is VOID_TILES (impassable Manhattan-2). `#925` is the 3–4
 * occupied-skipping INK_VEIL shuffle. `#965` is BOARD_CLAIM 2×2.
 * Unique-corridor landings stay legal (walkable tax; unlike VOID they
 * must not punch the only exit). Covering the player stays legal (that
 * is a legal walk dest; INK_VEIL skips the player tile). Drop
 * leftover-island dests rather than punch.
 *
 * Fight-graph snap of the single dest. Does not restack occupancy.ts,
 * occupancyInkVeilUnseal, occupancyBoardClaimUnseal, occupancyVoidUnseal,
 * WorldExploration, useBossSystem, or mapGen.simulate.ts.
 */

import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";

/** Production Void Rift plants exactly one walk-tax tile per turn. */
export const VOID_RIFT_COUNT = 1;

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
export function floodVoidRiftBattleGraph(
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

export function isOnVoidRiftBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodVoidRiftBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the player cannot step on the rift (gate, void, barrier,
 * leftover crumb). The −3 HP walk dest tax then never hits the fight
 * graph.
 */
export function voidRiftUnreachable(
  player: OccCell,
  dest: OccCell | null,
  ctx: OccupancyContext,
): boolean {
  if (!dest) return true;
  return !isOnVoidRiftBattleGraph(dest, player, ctx);
}

/**
 * Raw Void Rift dests: row-major `"floor"` cells. Occupancy `tiles` is
 * `!== "wall"` (floor OR portal); production `=== "floor"` skips the
 * gate. No occupancy / void / fight-graph check — leftover crumbs and
 * floor-under-void are included. Production hardcodes 16×16; tests use
 * the live occupancy grid.
 */
export function rawVoidRiftDests(ctx: OccupancyContext): OccCell[] {
  const dests: OccCell[] = [];
  const { w, h } = gridSize(ctx);
  for (let gy = 0; gy < h; gy++) {
    for (let gx = 0; gx < w; gx++) {
      if (!ctx.tiles[gy]?.[gx]) continue;
      if (ctx.portals.has(occKey(gx, gy))) continue;
      dests.push({ x: gx, y: gy });
    }
  }
  return dests;
}

/** Production `walkable[Math.floor(Math.random() * walkable.length)]`. */
export function pickVoidRiftDest(
  dests: readonly OccCell[],
  rng: () => number,
): OccCell | null {
  if (dests.length === 0) return null;
  return dests[Math.floor(rng() * dests.length)];
}

function acceptVoidRiftLanding(
  cell: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
): boolean {
  const k = occKey(cell.x, cell.y);
  if (ctx.portals.has(k)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  return battle.has(k);
}

/**
 * Relocate a Void Rift walk-tax tile onto the fight graph. Returns
 * `null` when the fight graph is empty (caller drops the rift instead
 * of punching). Unique-corridor overlap stays legal. Covering the
 * player stays legal. Occupied fight-graph cells stay legal (production
 * has no occupancy filter). Leftover-island dests snap onto the fight
 * graph or drop — they must not punch a join.
 */
export function legalizeVoidRiftPlacement(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): OccCell | null {
  const { w, h } = gridSize(ctx);
  const battle = floodVoidRiftBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const ok = (cell: OccCell) => acceptVoidRiftLanding(cell, ctx, battle);
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
 * Raw Void Rift dest from the occupancy grid, then snap so the −3 HP
 * walk tax sits on the fight graph. `null` when the fight graph cannot
 * host a rift.
 */
export function resolveVoidRiftTile(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  dest?: OccCell,
): OccCell | null {
  const raw =
    dest ??
    (rng
      ? pickVoidRiftDest(rawVoidRiftDests(ctx), rng)
      : rawVoidRiftDests(ctx)[0]);
  if (!raw) return null;
  return legalizeVoidRiftPlacement(raw, player, ctx);
}
