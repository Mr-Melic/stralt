/**
 * Chessboard Lich `BOARD_CLAIM` plants a random 2×2 AP-tax zone with
 * `Math.floor(Math.random() * 14)` on a 16×16 board and **no** `allTiles`
 * filter. Occupancy 1+1 unseal relocates combatants and cannot move
 * `bossState.boardClaimZone`. Occupancy floods still walk portals, so
 * leftover-islands stays 0, unique-bridge unseal never runs, and the whole
 * 2×2 can sit on walls, the gate, or a far-side leftover CA crumb — the
 * −2 AP tax never appears on the fight graph.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop / summoner midpoint / VOID /
 * ANCHOR / SPIKE / LAVA / greedy moveToward / erratic / king-step / SHOCK /
 * ILLUSION / LARVAE / INK_VEIL / adjacent SpawnData helpers (#589–#933).
 * Those snap units, rewrite walls, raster-scan `SpawnData` from (0,0), take
 * one occupancy-blind toward-axis orthogonal step, point-reflect, average
 * two bodies, plant impassable voids at Manhattan-2, plant *two*
 * required-step DAMAGE_IMMUNE glyphs, plant a walkable spike at a knight L
 * dest, plant lava at the *origin*, pick the closest orthogonal
 * `floor||portal` neighbor, pick a random orthogonal `!== "wall"` neighbor,
 * take the Chebyshev king corner, plant `activeShockTiles`, plant
 * IllusionData, plant LarvaData, plant 3–4 stealth/trap `glyphedTiles`, or
 * plant count-capped adjacent `SpawnData`. This is one contiguous 2×2
 * `boardClaimZone` origin (AP tax, not occupancy, not `glyphedTiles`, not
 * `hazardTiles`) with no `allTiles` filter — `#770` is the two-glyph ANCHOR
 * batch, `#925` is the 3–4 INK_VEIL shuffle. Unique-corridor landings stay
 * legal (walkable AP tax; unlike VOID they must not punch the only exit).
 * Covering the player cell stays legal (that is the claim-time tax; INK_VEIL
 * skips the player tile). Drop leftover-island dests rather than punch.
 *
 * Fight-graph snap of the 2×2 origin so at least one cell is steppable.
 * Does not restack occupancy.ts, occupancyInkVeilUnseal, occupancyAnchorUnseal,
 * occupancyAdjacentSpawnUnseal, WorldExploration, useBossSystem, or
 * mapGen.simulate.ts.
 */

import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";

/** Production `applyBoardClaim` zone is always 2×2 from the top-left origin. */
export const BOARD_CLAIM_ZONE_SIZE = 2;

/**
 * Production `Math.floor(Math.random() * 14)` on a 16×16 board is `size - 2`,
 * so origin ∈ 0..13 and cell 15 is never inside a raw claim. Legalize may
 * still use origin `size - 2` (14 on 16×16) to cover the last row/col.
 */
export function boardClaimRawOriginSpan(size: number): number {
  return Math.max(1, size - 2);
}

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

function originMax(w: number, h: number): { maxX: number; maxY: number } {
  return { maxX: w - BOARD_CLAIM_ZONE_SIZE, maxY: h - BOARD_CLAIM_ZONE_SIZE };
}

export function isValidBoardClaimOrigin(
  origin: OccCell,
  w: number,
  h: number,
): boolean {
  const { maxX, maxY } = originMax(w, h);
  if (maxX < 0 || maxY < 0) return false;
  return origin.x >= 0 && origin.y >= 0 && origin.x <= maxX && origin.y <= maxY;
}

/** The four cells of a BOARD_CLAIM 2×2, matching production `inZone`. */
export function boardClaimCells(origin: OccCell): OccCell[] {
  return [
    { x: origin.x, y: origin.y },
    { x: origin.x + 1, y: origin.y },
    { x: origin.x, y: origin.y + 1 },
    { x: origin.x + 1, y: origin.y + 1 },
  ];
}

/** Production `playerEntry` inside `[origin, origin+1]` on both axes. */
export function inBoardClaimZone(player: OccCell, origin: OccCell): boolean {
  return (
    player.x >= origin.x &&
    player.x <= origin.x + 1 &&
    player.y >= origin.y &&
    player.y <= origin.y + 1
  );
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 */
export function floodBoardClaimBattleGraph(
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

export function isOnBoardClaimBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodBoardClaimBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

export function boardClaimOverlapsBattleGraph(
  origin: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): boolean {
  return boardClaimCells(origin).some((cell) =>
    isOnBoardClaimBattleGraph(cell, player, ctx),
  );
}

/**
 * True when the player cannot step on any of the 2×2 cells (gate, void,
 * barrier, leftover crumb, wall). The −2 AP tax then never hits the fight
 * graph.
 */
export function boardClaimUnreachable(
  player: OccCell,
  origin: OccCell | null,
  ctx: OccupancyContext,
): boolean {
  if (!origin) return true;
  return !boardClaimOverlapsBattleGraph(origin, player, ctx);
}

/**
 * Raw BOARD_CLAIM origins production `Math.random() * 14` can pick. No
 * `allTiles` / occupancy / void / fight-graph check — wall top-lefts are
 * included. Span is `size - 2` (14 on 16×16), not `size - 1`.
 */
export function rawBoardClaimOrigins(w: number, h: number): OccCell[] {
  const xSpan = boardClaimRawOriginSpan(w);
  const ySpan = boardClaimRawOriginSpan(h);
  const dests: OccCell[] = [];
  for (let y = 0; y < ySpan; y++) {
    for (let x = 0; x < xSpan; x++) {
      dests.push({ x, y });
    }
  }
  return dests;
}

/** Production `Math.floor(Math.random() * 14)` on each axis. */
export function pickBoardClaimOrigin(
  rng: () => number,
  w: number,
  h: number,
): OccCell | null {
  if (w < BOARD_CLAIM_ZONE_SIZE || h < BOARD_CLAIM_ZONE_SIZE) return null;
  const xSpan = boardClaimRawOriginSpan(w);
  const ySpan = boardClaimRawOriginSpan(h);
  return {
    x: Math.floor(rng() * xSpan),
    y: Math.floor(rng() * ySpan),
  };
}

function zoneOverlaps(
  origin: OccCell,
  battle: Set<string>,
  ctx: OccupancyContext,
): boolean {
  for (const cell of boardClaimCells(origin)) {
    const k = occKey(cell.x, cell.y);
    if (ctx.portals.has(k)) continue;
    if (battle.has(k)) return true;
  }
  return false;
}

/**
 * Relocate a 2×2 AP-tax origin so at least one cell is on the fight graph.
 * Returns `null` when the fight graph is empty (caller drops the claim
 * instead of punching). Unique-corridor overlap stays legal. Covering the
 * player stays legal. Leftover-island-only dests snap onto the fight graph
 * or drop — they must not punch a join.
 */
export function legalizeBoardClaimOrigin(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): OccCell | null {
  const { w, h } = gridSize(ctx);
  const { maxX, maxY } = originMax(w, h);
  if (maxX < 0 || maxY < 0) return null;
  const battle = floodBoardClaimBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const ok = (origin: OccCell) =>
    isValidBoardClaimOrigin(origin, w, h) && zoneOverlaps(origin, battle, ctx);
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
 * Raw BOARD_CLAIM origin from the occupancy grid, then snap so the 2×2
 * taxes the fight graph. `null` when the fight graph cannot host a claim.
 */
export function resolveBoardClaimZone(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  dest?: OccCell,
): OccCell | null {
  const { w, h } = gridSize(ctx);
  const raw =
    dest ??
    (rng ? pickBoardClaimOrigin(rng, w, h) : rawBoardClaimOrigins(w, h)[0]);
  if (!raw) return null;
  return legalizeBoardClaimOrigin(raw, player, ctx);
}
