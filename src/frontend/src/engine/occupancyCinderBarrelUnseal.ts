/**
 * Catalog Cinder Barrel (`WF-TER-CINDER_BARREL`) plants **one** impassable
 * floor cell (blocks walk + LoS) from a `"floor"` raster that skips portals
 * and Chebyshev ≤ 3 from the **legalized spawn** (`SPAWN_SAFE_RADIUS` /
 * `isTileReservedForSpawnOrPortal`, not grid center `WORLD_GRID_SIZE/2`)
 * with **no** occupancy / void / fight-graph check. `extraHazardCount` is
 * omitted so `extraHazardRoll` would plant nothing. Occupancy 1+1 unseal
 * relocates combatants and cannot move the barrel or lift it after a 1 AP
 * roll. Occupancy floods still walk portals, leftover-islands stays 0,
 * unique-bridge unseal never runs, and the dest can sit on a unique
 * player→exit corridor or a far-side leftover CA crumb — then an
 * occupancy-blind cardinal roll hops the wall onto that leftover or the
 * unlocked gate.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swapPositions /
 * ignore-walls / ghost raster / Eternal Pawn advance / Twin Bishop /
 * summoner midpoint / VOID / ANCHOR / SPIKE / LAVA / greedy moveToward /
 * erratic / king-step / SHOCK / ILLUSION / LARVAE / INK_VEIL / adjacent
 * SpawnData / BOARD_CLAIM / Void Rift / eligibleHazard / walk-blocker /
 * Creeping Ash / Ember Vein / Hunting Lantern / Orbiting Cinder / Gutter
 * Steam / Frost Pane / Triune Pads / Spent Bridge / Slipstream helpers
 * (#589–#1146). Those snap units, rewrite walls, plant impassable voids
 * at Manhattan-2, plant generate-time lava/ice/spikes that skip the
 * center 7×7, plant one impassable `blocksWalk` cell **in place**, plant
 * one contiguous 3-tile orthogonal lane, plant 3–6 independent always-on
 * dests, plant one chasing **walkable** orb, plant a closed 4-cycle
 * square, plant two independent even/odd vents, plant one walkable LoS
 * wall, plant a 3-pad clockwise carousel, plant a delayed floor→wall
 * after three leaves, or plant a one-way A→B pair. This is a **1 AP
 * cardinal roll of a wall** (impassable until smashed; occupied dest
 * stays and taxes; empty dest hops the marker — not HP-tax chase, not a
 * painted lane, not a delayed wall, not a teleport). `#1013` is
 * walk-blockers (static plant; no roll). `#1038` is Hunting Lantern
 * (walkable chase toward the last MP spender). `#1127` is Spent Bridge
 * (walls the painted cell; does not relocate). Unique-corridor / player /
 * occupied dests snap off at plant. Drop leftover-island dests rather
 * than punch. Roll onto a unique corridor / portal / void / leftover
 * crumb **stays** (drop the hop) rather than punch. Occupied fight-graph
 * dests stay as a hit (barrel does not move).
 *
 * Fight-graph snap of the dest. Does not restack occupancy.ts,
 * occupancyWalkBlockerUnseal, occupancyHuntingLanternUnseal,
 * occupancySpentBridgeUnseal, occupancySlipstreamUnseal,
 * occupancyTriunePadsUnseal, occupancyFrostPaneUnseal,
 * occupancyGutterSteamUnseal, occupancyOrbitingCinderUnseal,
 * occupancyEmberVeinUnseal, occupancyCreepingAshUnseal,
 * occupancyEligibleHazardUnseal, WorldExploration, worldFeatures.ts,
 * useBossSystem, targeting.ts, or mapGen.simulate.ts.
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

/** Catalog plants one cell. `extraHazardCount` is omitted. */
export const CINDER_BARREL_GENERATE_MIN = 1;
export const CINDER_BARREL_GENERATE_MAX = 1;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const CINDER_BARREL_SPAWN_CLEAR = 3;

/** Catalog adjacent 1 AP roll / 2 AP smash. */
export const CINDER_BARREL_ROLL_AP = 1;
export const CINDER_BARREL_SMASH_AP = 2;

/** Catalog hit tax when the next cell holds a unit. */
export const CINDER_BARREL_HIT_TAX_PCT = 0.05;

export const CINDER_BARREL_FEATURE_ID = "WF-TER-CINDER_BARREL";

export type CinderBarrelHeading = Readonly<{ dx: number; dy: number }>;

export const CINDER_BARREL_HEADINGS: readonly CinderBarrelHeading[] = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
];

export type CinderBarrelStayReason =
  | "not-cardinal"
  | "blocked"
  | "would-seal"
  | "off-graph"
  | "no-ap";

export type CinderBarrelRoll =
  | { kind: "stay"; reason: CinderBarrelStayReason }
  | { kind: "move"; from: OccCell; to: OccCell }
  | { kind: "hit"; from: OccCell; to: OccCell };

export type CinderBarrelSmash =
  | { kind: "stay"; reason: "no-ap" | "missing" }
  | { kind: "floor"; cell: OccCell };

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
 * A planted Cinder Barrel is a cut (wall occupancy).
 */
export function floodCinderBarrelBattleGraph(
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

export function isOnCinderBarrelBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodCinderBarrelBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

function withBarrelWalls(
  ctx: OccupancyContext,
  extra: readonly OccCell[],
): OccupancyContext {
  if (extra.length === 0) return ctx;
  const voidTiles = new Set(ctx.voidTiles);
  for (const cell of extra) voidTiles.add(occKey(cell.x, cell.y));
  return { ...ctx, voidTiles };
}

function withRolledBarrel(
  ctx: OccupancyContext,
  from: OccCell,
  to: OccCell,
): OccupancyContext {
  const voidTiles = new Set(ctx.voidTiles);
  voidTiles.delete(occKey(from.x, from.y));
  voidTiles.add(occKey(to.x, to.y));
  return { ...ctx, voidTiles };
}

/**
 * True when adding `extra` as occupancy voids (wall occupancy) cuts every
 * player→exit route. Catalog: skip a plant that would fail
 * `evaluateSolvability` with the barrel intact.
 */
export function cinderBarrelSealsProgression(
  player: OccCell,
  extra: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.size === 0) return false;
  const live = withBarrelWalls(ctx, extra);
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
 * True when rolling the barrel from `from` onto `to` (origin becomes
 * floor, dest becomes wall) cuts every player→exit route.
 */
export function cinderBarrelRollSealsProgression(
  player: OccCell,
  from: OccCell,
  to: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.size === 0) return false;
  const live = withRolledBarrel(ctx, from, to);
  let start = player;
  if (occKey(player.x, player.y) === occKey(to.x, to.y)) {
    start = from;
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
 * The wall occupancy then never taxes the battle route.
 */
export function cinderBarrelUnreachable(
  player: OccCell,
  dests: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (dests.length === 0) return true;
  return !dests.some((cell) => isOnCinderBarrelBattleGraph(cell, player, ctx));
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isCinderBarrelSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= CINDER_BARREL_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= CINDER_BARREL_SPAWN_CLEAR
  );
}

export function isCinderBarrelHeading(heading: CinderBarrelHeading): boolean {
  return CINDER_BARREL_HEADINGS.some(
    (orth) => orth.dx === heading.dx && orth.dy === heading.dy,
  );
}

export function cinderBarrelRollCostsAp(roll: CinderBarrelRoll): boolean {
  return roll.kind === "move" || roll.kind === "hit";
}

/**
 * Raw catalog dests: row-major `"floor"` cells outside spawn±3. Occupancy
 * `tiles` is `!== "wall"` (floor OR portal); production `=== "floor"` skips
 * the gate. No occupancy / void / fight-graph check — leftover crumbs and
 * floor-under-void are included. `existing` matches a second `blocksWalk`
 * roll (`Do not place on the same cell as another blocksWalk feature`).
 */
export function rawCinderBarrelDests(
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
      if (isCinderBarrelSpawnClear(gx, gy, spawn)) continue;
      if (existing?.has(k)) continue;
      dests.push({ x: gx, y: gy });
    }
  }
  return dests;
}

/** Catalog plants exactly one cell. `extraHazardRoll` is 0 (band omitted). */
export function pickCinderBarrelCount(rng?: () => number): number {
  if (!rng) return CINDER_BARREL_GENERATE_MIN;
  return (
    CINDER_BARREL_GENERATE_MIN +
    Math.floor(
      rng() * (CINDER_BARREL_GENERATE_MAX - CINDER_BARREL_GENERATE_MIN + 1),
    )
  );
}

/** Fisher–Yates pick of `count` dests. */
export function pickCinderBarrelDests(
  dests: readonly OccCell[],
  rng: () => number,
  count: number = CINDER_BARREL_GENERATE_MIN,
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

function acceptCinderBarrelLanding(
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
  if (k === occKey(player.x, player.y)) return false;
  if (isCinderBarrelSpawnClear(cell.x, cell.y, spawn)) return false;
  if (!battle.has(k)) return false;
  if (reserved.has(k)) return false;
  if (!isCellFree(cell, ctx)) return false;
  return !cinderBarrelSealsProgression(player, [{ x: cell.x, y: cell.y }], ctx);
}

/**
 * Relocate a Cinder Barrel onto a fight-graph dump cell that still
 * reaches an exit. Returns `null` when every candidate would seal (caller
 * drops the barrel instead of punching a leftover island). Unique-corridor
 * overlap must not stay. Covering the player / an occupied cell must not
 * stay. Leftover-island dests snap onto the fight graph or drop.
 */
export function legalizeCinderBarrelPlacement(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
  spawn: OccCell = player,
): OccCell | null {
  const battle = floodCinderBarrelBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const reserved = progressionReserved(ctx, player);
  const ok = (cell: OccCell) =>
    acceptCinderBarrelLanding(
      cell,
      player,
      spawn,
      ctx,
      battle,
      placed,
      reserved,
    );
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
 * Snap several catalog barrels off the gate, unique bridges, spawn diamond,
 * occupied cells, and leftover crumbs. Drops a dest that cannot legalize.
 * Does not restack occupancy unseal or punch walls.
 */
export function legalizeCinderBarrelPlacements(
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
    live = withBarrelWalls(live, prior);
  }
  for (const dest of dests) {
    const snapped = legalizeCinderBarrelPlacement(
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
    live = withBarrelWalls(live, [snapped]);
  }
  return result;
}

/**
 * Occupancy-blind 1 AP cardinal roll. Production hops onto `!== "wall"`
 * (floor OR portal), leftover crumbs, and unique corridors. Occupied dests
 * stay as a hit. Non-cardinal / OOB / wall dests stay.
 */
export function rawCinderBarrelRoll(
  from: OccCell,
  heading: CinderBarrelHeading,
  ctx: OccupancyContext,
  ap: number = CINDER_BARREL_ROLL_AP,
): CinderBarrelRoll {
  if (ap < CINDER_BARREL_ROLL_AP) {
    return { kind: "stay", reason: "no-ap" };
  }
  if (!isCinderBarrelHeading(heading)) {
    return { kind: "stay", reason: "not-cardinal" };
  }
  const { w, h } = gridSize(ctx);
  const to = { x: from.x + heading.dx, y: from.y + heading.dy };
  if (!inGrid(to, w, h)) return { kind: "stay", reason: "blocked" };
  if (!ctx.tiles[to.y]?.[to.x]) return { kind: "stay", reason: "blocked" };
  if (ctx.isOccupied(to)) {
    return {
      kind: "hit",
      from: { x: from.x, y: from.y },
      to: { x: to.x, y: to.y },
    };
  }
  return {
    kind: "move",
    from: { x: from.x, y: from.y },
    to: { x: to.x, y: to.y },
  };
}

function acceptCinderBarrelRollDest(
  from: OccCell,
  to: OccCell,
  player: OccCell,
  spawn: OccCell,
  ctx: OccupancyContext,
): boolean {
  const k = occKey(to.x, to.y);
  if (ctx.portals.has(k)) return false;
  if (isCinderBarrelSpawnClear(to.x, to.y, spawn)) return false;
  if (ctx.voidTiles.has(k) && k !== occKey(from.x, from.y)) return false;
  if (ctx.barriers.has(k)) return false;
  if (!isOnCinderBarrelBattleGraph(to, player, ctx)) return false;
  return !cinderBarrelRollSealsProgression(player, from, to, ctx);
}

/**
 * Occupancy-blind 1 AP cardinal roll. If hopping the painted cell would
 * seal a unique corridor, sit on a leftover crumb, a portal, or a void,
 * **drop the hop** (stay) rather than snap the barrel sideways or punch
 * a join. Unlike initial placement, roll must not relocate the marker onto
 * a different origin. Occupied dests still hit (barrel stays).
 */
export function legalizeCinderBarrelRoll(
  from: OccCell,
  heading: CinderBarrelHeading,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
  ap: number = CINDER_BARREL_ROLL_AP,
): CinderBarrelRoll {
  const raw = rawCinderBarrelRoll(from, heading, ctx, ap);
  if (raw.kind === "stay") return raw;
  if (raw.kind === "hit") return raw;
  if (!acceptCinderBarrelRollDest(raw.from, raw.to, player, spawn, ctx)) {
    const k = occKey(raw.to.x, raw.to.y);
    if (
      ctx.portals.has(k) ||
      isCinderBarrelSpawnClear(raw.to.x, raw.to.y, spawn) ||
      (ctx.voidTiles.has(k) && k !== occKey(raw.from.x, raw.from.y)) ||
      ctx.barriers.has(k) ||
      !isOnCinderBarrelBattleGraph(raw.to, player, ctx)
    ) {
      return { kind: "stay", reason: "off-graph" };
    }
    return { kind: "stay", reason: "would-seal" };
  }
  return raw;
}

/**
 * Raw catalog dests from the occupancy grid, then snap so the barrel sits
 * on a non-cut-vertex fight-graph cell. Empty when the fight graph cannot
 * host a wall plant.
 */
export function resolveCinderBarrel(
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
      ? pickCinderBarrelDests(
          rawCinderBarrelDests(ctx, spawn, existing),
          rng,
          pickCinderBarrelCount(rng),
        )
      : rawCinderBarrelDests(ctx, spawn, existing).slice(
          0,
          CINDER_BARREL_GENERATE_MIN,
        ));
  return legalizeCinderBarrelPlacements(
    raw,
    player,
    ctx,
    spawn,
    existing ?? new Set(),
  );
}

/**
 * Live 1 AP cardinal roll of a painted barrel. Stays put when the hop
 * would leave the fight graph or seal every exit. Hits when the next
 * cell is occupied.
 */
export function resolveCinderBarrelRoll(
  from: OccCell,
  heading: CinderBarrelHeading,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
  ap: number = CINDER_BARREL_ROLL_AP,
): CinderBarrelRoll {
  return legalizeCinderBarrelRoll(from, heading, player, ctx, spawn, ap);
}

/**
 * 2 AP adjacent smash. Opens the cell to floor. Smash cannot seal a
 * route (it only removes a wall) so leftover / unique-corridor barrels
 * still smash rather than stay.
 */
export function resolveCinderBarrelSmash(
  cell: OccCell | null,
  ap: number = CINDER_BARREL_SMASH_AP,
): CinderBarrelSmash {
  if (!cell) return { kind: "stay", reason: "missing" };
  if (ap < CINDER_BARREL_SMASH_AP) return { kind: "stay", reason: "no-ap" };
  return { kind: "floor", cell: { x: cell.x, y: cell.y } };
}
