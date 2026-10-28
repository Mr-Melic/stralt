/**
 * Catalog Turnstile Ember (`WF-HAZ-TURNSTILE_EMBER`) plants **one** walkable
 * HP-tax cinder (`extraHazardCount` min = max = 1) that occupies one **arm
 * of a painted 4-tile plus** and **rotates 90° clockwise onto the next arm
 * at each round start**. Placement is a `"floor"` raster of pluses that
 * skips portals and Chebyshev ≤ 3 from the **legalized spawn**
 * (`SPAWN_SAFE_RADIUS` / `isTileReservedForSpawnOrPortal`, not grid center
 * `WORLD_GRID_SIZE/2`) with **no** occupancy / void / fight-graph check.
 * Occupancy 1+1 unseal relocates combatants and cannot move the ember.
 * Occupancy floods still walk portals, leftover-islands stays 0, unique-
 * bridge unseal never runs, and the whole plus can sit on a far-side
 * leftover CA crumb or a floor-under-void — the −5% max-HP landing tax
 * never appears on the fight graph. The occupancy-blind clockwise hop
 * then visits that far crumb even when the current arm was still on the
 * fight graph.
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
 * Shift Slab / Raise Slab / Ratchet Cog helpers (#589–#1258). Those snap
 * units, rewrite walls, plant impassable voids, plant walkable tax, plant
 * one chasing orb, plant a clockwise **4-cycle square**, plant a 3-tile
 * one-way lane, plant delayed walls after three leaves **or three
 * round-starts**, plant teleports, plant a 1 AP wall **roll**, rewrite
 * every body, plant one unarmed extra portal, plant a 5-tile reverse
 * nave, plant a two-cell oscillating **wall pair**, plant a 1 AP
 * floor→wall pry, or plant a **2-cell adjacent HP-tax swap**. This is a
 * **walkable 4-arm plus that rotates clockwise** (implicit hollow; four
 * cardinal arms; one ember; hop every round start — not a filled 2×2,
 * not a 5-tile nave, not two adjacent cells, not two orbs on a 4-tile
 * line, not a 2-tile in-out bar). `#1013` is walk-blockers (impassable).
 * `#1071` is Orbiting Cinder (filled 2×2 square; consecutive hops are
 * Manhattan 1). `#1086` is Gutter Steam (two even/odd vents). `#1038` is
 * Hunting Lantern (chase). `#1201` is Pendulum Censer (5-tile reverse).
 * `#1258` is Ratchet Cog (2-cell adjacent swap). Unique-corridor /
 * destacked-player / occupied dests stay when all four arms are fight-
 * graph floor (walk flood unchanged). Drop leftover-island pluses rather
 * than punch. Rotate onto portal / void / leftover crumb **stays** (drop
 * the hop). Occupied next arm **rotates** (landing tax). All four painted
 * arms must be fight-graph floor — the ember visits each. The hollow is
 * not painted and is not a cut.
 *
 * Fight-graph snap of the plus (keep ember index). Does not restack
 * occupancy.ts, occupancyRatchetCogUnseal, occupancyRaiseSlabUnseal,
 * occupancyShiftSlabUnseal, occupancyPendulumCenserUnseal,
 * occupancyOrbitingCinderUnseal, occupancyHourglassArchUnseal,
 * occupancyWalkBlockerUnseal, WorldExploration, worldFeatures.ts,
 * useBossSystem, targeting.ts, or mapGen.simulate.ts.
 */

import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";

/** Catalog `extraHazardCount` for Turnstile Ember is exactly one ember. */
export const TURNSTILE_EMBER_COUNT = 1;

/** Painted track is four cardinal arms around an implicit hollow. */
export const TURNSTILE_EMBER_PLUS_SIZE = 4;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const TURNSTILE_EMBER_SPAWN_CLEAR = 3;

/** Catalog landing tax as a fraction of current max HP. */
export const TURNSTILE_EMBER_HP_TAX_PCT = 0.05;

export const TURNSTILE_EMBER_FEATURE_ID = "WF-HAZ-TURNSTILE_EMBER";

/**
 * Clockwise arms from the implicit hollow, y-down screen space:
 * N → E → S → W. Distinct from Orbiting Cinder's filled 2×2
 * (NW, NE, SE, SW) whose consecutive hops are Manhattan 1.
 */
export const TURNSTILE_EMBER_CLOCKWISE: ReadonlyArray<
  readonly [number, number]
> = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

export type TurnstileEmber = {
  /** Implicit hollow. Not painted; not a walk cut. */
  center: OccCell;
  /** 0..3 index into `TURNSTILE_EMBER_CLOCKWISE`. */
  emberIndex: number;
};

export type TurnstileEmberStayReason = "off-graph";

export type TurnstileEmberAdvance =
  | { kind: "stay"; reason: TurnstileEmberStayReason }
  | { kind: "rotate"; plus: TurnstileEmber };

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

export function clampTurnstileEmberIndex(index: number): number {
  const n = TURNSTILE_EMBER_PLUS_SIZE;
  return ((index % n) + n) % n;
}

export function cloneTurnstileEmber(plus: TurnstileEmber): TurnstileEmber {
  return {
    center: { x: plus.center.x, y: plus.center.y },
    emberIndex: clampTurnstileEmberIndex(plus.emberIndex),
  };
}

export function turnstileEmberPlusKey(plus: TurnstileEmber): string {
  return occKey(plus.center.x, plus.center.y);
}

/** Four painted arms in clockwise order from `center`. The hollow is omitted. */
export function turnstileEmberCells(center: OccCell): OccCell[] {
  return TURNSTILE_EMBER_CLOCKWISE.map(([dx, dy]) => ({
    x: center.x + dx,
    y: center.y + dy,
  }));
}

/** The live ember cell. Catalog extraHazard budget is this one tile. */
export function turnstileEmberOrb(plus: TurnstileEmber): OccCell {
  const cells = turnstileEmberCells(plus.center);
  const i = clampTurnstileEmberIndex(plus.emberIndex);
  const cell = cells[i] ?? cells[0];
  return { x: cell.x, y: cell.y };
}

/** Consecutive clockwise arms are diagonal (Manhattan 2), not a filled 2×2. */
export function turnstileEmberAdjacentArmsManhattan(
  a: OccCell,
  b: OccCell,
): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function turnstileEmberIsPlusNotSquare(center: OccCell): boolean {
  const arms = turnstileEmberCells(center);
  for (let i = 0; i < arms.length; i++) {
    const a = arms[i];
    const b = arms[(i + 1) % arms.length];
    if (!a || !b) return false;
    if (turnstileEmberAdjacentArmsManhattan(a, b) !== 2) return false;
  }
  return true;
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 * A Turnstile Ember is **not** a cut (walk occupancy is floor).
 */
export function floodTurnstileEmberBattleGraph(
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

export function isOnTurnstileEmberBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodTurnstileEmberBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the player cannot step on the ember (gate, void, leftover crumb).
 * The Turnstile Ember landing tax then never hits the fight graph.
 */
export function turnstileEmberUnreachable(
  player: OccCell,
  plus: TurnstileEmber | null,
  ctx: OccupancyContext,
): boolean {
  if (!plus) return true;
  return !isOnTurnstileEmberBattleGraph(turnstileEmberOrb(plus), player, ctx);
}

/** True when none of the four painted arms sit on the fight graph. */
export function turnstileEmberPlusUnreachable(
  player: OccCell,
  plus: TurnstileEmber,
  ctx: OccupancyContext,
): boolean {
  return turnstileEmberCells(plus.center).every(
    (arm) => !isOnTurnstileEmberBattleGraph(arm, player, ctx),
  );
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isTurnstileEmberSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= TURNSTILE_EMBER_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= TURNSTILE_EMBER_SPAWN_CLEAR
  );
}

/**
 * Raw catalog pluses: row-major implicit hollows whose four cardinal arms
 * are `"floor"` cells outside spawn±3. Occupancy `tiles` is `!== "wall"`
 * (floor OR portal); production `=== "floor"` skips the gate. No occupancy
 * / void / fight-graph check — leftover crumbs and floor-under-void are
 * included. `existing` skips already-budgeted hazard keys (`MAX_HAZARD_TILES`).
 * Default: the north arm holds the ember.
 */
export function rawTurnstileEmberPluses(
  ctx: OccupancyContext,
  spawn: OccCell,
  existing?: ReadonlySet<string>,
): TurnstileEmber[] {
  const pluses: TurnstileEmber[] = [];
  const { w, h } = gridSize(ctx);
  const eligible = (x: number, y: number): boolean => {
    if (!inGrid({ x, y }, w, h)) return false;
    if (!ctx.tiles[y]?.[x]) return false;
    const k = occKey(x, y);
    if (ctx.portals.has(k)) return false;
    if (isTurnstileEmberSpawnClear(x, y, spawn)) return false;
    if (existing?.has(k)) return false;
    return true;
  };
  for (let cy = 0; cy < h; cy++) {
    for (let cx = 0; cx < w; cx++) {
      const center = { x: cx, y: cy };
      const arms = turnstileEmberCells(center);
      if (arms.length !== TURNSTILE_EMBER_PLUS_SIZE) continue;
      if (!arms.every((arm) => eligible(arm.x, arm.y))) continue;
      pluses.push({ center, emberIndex: 0 });
    }
  }
  return pluses;
}

/** Catalog `extraHazardRoll` for Turnstile Ember is always 1. */
export function pickTurnstileEmberCount(): number {
  return TURNSTILE_EMBER_COUNT;
}

/** Fisher–Yates pick of `count` pluses; rng picks which arm holds the ember. */
export function pickTurnstileEmberPluses(
  pluses: readonly TurnstileEmber[],
  rng: () => number,
  count: number = TURNSTILE_EMBER_COUNT,
): TurnstileEmber[] {
  const shuffled = pluses.map((p) => cloneTurnstileEmber(p));
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }
  const n = Math.min(count, shuffled.length);
  return shuffled.slice(0, n).map((plus) => ({
    center: { x: plus.center.x, y: plus.center.y },
    emberIndex: clampTurnstileEmberIndex(
      Math.floor(rng() * TURNSTILE_EMBER_PLUS_SIZE),
    ),
  }));
}

/**
 * Occupancy-blind round-start hop. Unlike Orbiting Cinder this is a **plus
 * wrap** (Manhattan-2 diagonal onto the next arm). Unlike Pendulum this
 * never reverses. Unlike Ratchet Cog there are four arms, not two cells.
 */
export function rawTurnstileEmberAdvance(plus: TurnstileEmber): TurnstileEmber {
  return {
    center: { x: plus.center.x, y: plus.center.y },
    emberIndex: clampTurnstileEmberIndex(plus.emberIndex + 1),
  };
}

function acceptArm(
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
  if (isTurnstileEmberSpawnClear(cell.x, cell.y, spawn)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  return battle.has(k);
}

function acceptPlus(
  plus: TurnstileEmber,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
): boolean {
  const arms = turnstileEmberCells(plus.center);
  const keys = new Set(arms.map((arm) => occKey(arm.x, arm.y)));
  if (keys.size !== TURNSTILE_EMBER_PLUS_SIZE) return false;
  if (!turnstileEmberIsPlusNotSquare(plus.center)) return false;
  return arms.every((arm) => acceptArm(arm, spawn, ctx, battle, placed));
}

function preferEmberIndex(
  center: OccCell,
  destEmber: OccCell,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
): TurnstileEmber | null {
  const candidates: TurnstileEmber[] = [];
  for (let i = 0; i < TURNSTILE_EMBER_PLUS_SIZE; i++) {
    const plus = { center: { x: center.x, y: center.y }, emberIndex: i };
    if (acceptPlus(plus, spawn, ctx, battle, placed)) candidates.push(plus);
  }
  if (candidates.length === 0) return null;
  const keepEmber = candidates.find((plus) => {
    const orb = turnstileEmberOrb(plus);
    return orb.x === destEmber.x && orb.y === destEmber.y;
  });
  if (keepEmber) return keepEmber;
  return candidates[0] ?? null;
}

/**
 * Relocate a Turnstile Ember plus onto four fight-graph arms so **all**
 * are steppable. Returns `null` when the fight graph cannot host a plus
 * (caller drops the hazard instead of punching). Unique-corridor overlap
 * stays legal when N/E/S/W alcoves exist. Covering a destacked player
 * outside spawn±3 stays legal. Occupied fight-graph cells stay legal (no
 * occupancy filter — landing tax). Leftover-island dests snap onto the
 * fight graph or drop — they must not punch a join. Unlike BOARD_CLAIM,
 * one steppable arm of four is not enough.
 */
export function legalizeTurnstileEmberPlacement(
  dest: TurnstileEmber,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
  spawn: OccCell = player,
): TurnstileEmber | null {
  const { w, h } = gridSize(ctx);
  const battle = floodTurnstileEmberBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const destEmber = turnstileEmberOrb(dest);
  const tryCenter = (center: OccCell): TurnstileEmber | null =>
    preferEmberIndex(center, destEmber, spawn, ctx, battle, placed);
  const direct = tryCenter(dest.center);
  if (direct) return direct;
  const origins: OccCell[] = [
    { x: dest.center.x, y: dest.center.y },
    destEmber,
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
          const snapped = tryCenter(cell);
          if (snapped) return snapped;
        }
      }
    }
  }
  return null;
}

/**
 * Snap several Turnstile Ember pluses off leftover crumbs, voids, portals,
 * and the spawn diamond. Unique-corridor overlap stays when the plus fits.
 * Drops a plus that cannot legalize. Does not restack occupancy unseal or
 * punch walls.
 */
export function legalizeTurnstileEmberPlacements(
  dests: readonly TurnstileEmber[],
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
  already: ReadonlySet<string> = new Set(),
): TurnstileEmber[] {
  const placed = new Set(already);
  const result: TurnstileEmber[] = [];
  const seen = new Set<string>();
  for (const dest of dests) {
    const snapped = legalizeTurnstileEmberPlacement(
      dest,
      player,
      ctx,
      placed,
      spawn,
    );
    if (!snapped) continue;
    const id = turnstileEmberPlusKey(snapped);
    if (seen.has(id)) continue;
    const arms = turnstileEmberCells(snapped.center);
    if (arms.some((arm) => placed.has(occKey(arm.x, arm.y)))) continue;
    seen.add(id);
    for (const arm of arms) placed.add(occKey(arm.x, arm.y));
    result.push(snapped);
  }
  return result;
}

function advanceOffGraph(
  plus: TurnstileEmber,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell,
): boolean {
  const battle = floodTurnstileEmberBattleGraph(player, ctx);
  return !acceptArm(turnstileEmberOrb(plus), spawn, ctx, battle, new Set());
}

/**
 * Occupancy-blind round-start hop. If the next arm is a portal, spawn
 * diamond, void, or leftover crumb, **drop the hop** (stay) rather than
 * snap the plus sideways or hop the choke. Unlike initial placement, rotate
 * must not relocate the painted plus onto a different hollow. Occupied
 * next arm still rotates — landing tax, not a wall.
 */
export function legalizeTurnstileEmberAdvance(
  plus: TurnstileEmber,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): TurnstileEmberAdvance {
  const raw = rawTurnstileEmberAdvance(plus);
  if (advanceOffGraph(raw, player, ctx, spawn)) {
    return { kind: "stay", reason: "off-graph" };
  }
  return { kind: "rotate", plus: raw };
}

/**
 * Apply one round start. The hop lands only when the next arm still sits
 * on the fight graph. A dropped hop keeps the current arm so later ticks
 * retry the same legalize instead of punching.
 */
export function resolveTurnstileEmberAfterRoundStart(
  plus: TurnstileEmber,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): TurnstileEmber {
  const action = legalizeTurnstileEmberAdvance(plus, player, ctx, spawn);
  if (action.kind === "rotate") return action.plus;
  return cloneTurnstileEmber(plus);
}

/**
 * Raw catalog pluses from the occupancy grid, then snap so all four arms
 * sit on the fight graph. Empty when the fight graph cannot host a plus.
 */
export function resolveTurnstileEmber(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  dests?: readonly TurnstileEmber[],
  existing?: ReadonlySet<string>,
  spawn: OccCell = player,
): TurnstileEmber[] {
  const raw =
    dests ??
    (rng
      ? pickTurnstileEmberPluses(
          rawTurnstileEmberPluses(ctx, spawn, existing),
          rng,
          pickTurnstileEmberCount(),
        )
      : rawTurnstileEmberPluses(ctx, spawn, existing).slice(
          0,
          TURNSTILE_EMBER_COUNT,
        ));
  return legalizeTurnstileEmberPlacements(
    raw,
    player,
    ctx,
    spawn,
    existing ?? new Set(),
  );
}

/**
 * Live round-start hop of a painted plus. Stays on the current arm when
 * the next cell would leave the fight graph.
 */
export function resolveTurnstileEmberAdvance(
  plus: TurnstileEmber,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): TurnstileEmberAdvance {
  return legalizeTurnstileEmberAdvance(plus, player, ctx, spawn);
}
