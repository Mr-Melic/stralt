/**
 * Pure targeting computation extracted from WorldExploration.tsx.
 *
 * `computeTargetableTiles` is the body of `getSpellRangeTiles` (formerly lines
 * 5998-6172 of WorldExploration.tsx) lifted into a React-free, DOM-free pure
 * function. The wrapper in WorldExploration.tsx retains:
 *   - the `useCallback` shell,
 *   - the `spellRangeCacheRef` cache check + set, and
 *   - the `battleOnlyHealBuffSpellsRef.current = false` side-effect (#19 Pacifist Run).
 *
 * What moves here:
 *   - the `self` / `all` early-returns,
 *   - the Manhattan ground branch (ground + isBarrier spells), and
 *   - the Chebyshev area/enemy branch (with Bresenham LoS, area expansion).
 *
 * The wrapper precomputes `effectiveRange` (a number) by calling
 * `getEffectiveSpellRange(baseRange, spell.modifiableRange ? spell.id : undefined)`
 * and passes it in via `gridState.effectiveRange`. The pure function NEVER
 * calls back into React state or callbacks.
 *
 * Canonical targeting rules preserved verbatim:
 *   - ground / barrier spells use MANHATTAN distance (|dx|+|dy| <= range),
 *   - area / enemy spells use CHEBYSHEV distance (max(|dx|,|dy|) <= range).
 * This asymmetry is intentional and is the single source of truth for both the
 * blue preview highlights and the castability check.
 */

import type { Enemy, SpellConfig } from "../types/gameTypes";

/**
 * #19 Pacifist Run side-effect: flip the `battleOnlyHealBuffSpellsRef` flag to
 * false the moment the player selects ANY offensive spell. Kept here (next to
 * the targeting geometry it relates to) so the wrapper in WorldExploration.tsx
 * is a single one-line call instead of an inline ~25-line block.
 *
 * The ref is a React ref owned by the component, so it is passed in as a
 * parameter rather than imported — this keeps the helper pure-ish and
 * testable in isolation.
 *
 * Offensive categories mirror the original inline list verbatim.
 */
const OFFENSIVE_SPELL_CATEGORIES = [
  "damage",
  "drain",
  "aoe",
  "dot",
  "pushback",
  "attract",
  "cc",
  "teleport",
] as const;

export function applyHealBuffSideEffect(
  spell: SpellConfig,
  ref: { current: boolean },
): void {
  const targetType = (spell.targetType ?? "enemy") as string;
  const isDrainSpell = (spell.spellType ?? "") === "drain";
  const isPhysical = spell.isPhysical ?? false;
  const effectCat = (spell.effectCategory ?? "").toLowerCase();
  if (
    targetType === "enemy" ||
    targetType === "area" ||
    targetType === "line" ||
    isDrainSpell ||
    isPhysical ||
    OFFENSIVE_SPELL_CATEGORIES.includes(
      effectCat as (typeof OFFENSIVE_SPELL_CATEGORIES)[number],
    )
  ) {
    ref.current = false;
  }
}

/** Tile cell kind used by the world grid. */
export type TileType = "floor" | "wall" | "portal";

/**
 * Grid state snapshot passed into the pure targeting function.
 *
 * Every field is a primitive or a plain data structure — no React refs, no
 * callbacks, no component closures. The wrapper assembles this from live refs
 * before each call.
 */
export interface TargetGridState {
  /** Full world tile grid indexed as `tiles[y][x]`. */
  tiles: TileType[][];
  /** Enemies currently on the map (used for `freeCells` / occupied checks). */
  enemies: Enemy[];
  /** Edge length of the square world grid (WORLD_GRID_SIZE). */
  worldGridSize: number;
  /** Precomputed effective range for THIS spell (level + mod bonuses applied). */
  effectiveRange: number;
  /** Active barrier tiles → turns remaining (impassable, treated as walls). */
  barrierTiles: Map<string, number>;
}

/** Caster position on the grid. */
export interface CasterPosition {
  x: number;
  y: number;
}

/**
 * Compute the set of `"x,y"` tile keys that the given spell can target from
 * `casterPos` on the supplied grid.
 *
 * Returns an empty Set for `self`/`all`/`ground`/`area`/`enemy` spells when
 * no tiles qualify. The caller (wrapper) is responsible for cache + the
 * pacifist-flag side-effect; this function only does the geometric work.
 */
export function computeTargetableTiles(
  spell: SpellConfig,
  casterPos: CasterPosition,
  gridState: TargetGridState,
): Set<string> {
  const { tiles, enemies, worldGridSize, effectiveRange, barrierTiles } =
    gridState;
  const targetType = (spell.targetType ?? "enemy") as string;
  const range = effectiveRange;
  const minR = spell.minRange ?? 1;

  // ── Self-targeting spells (heals, buffs, shields) only highlight the caster tile
  if (targetType === "self") {
    return new Set([`${casterPos.x},${casterPos.y}`]);
  }

  // ── Ally-targeting spells (Shield/Iron Skin/Haste/Enrage): self tile + allied
  // summon tiles within range. Allied summons are enemies with isSummon=true and
  // side='player'. ADDITIVE branch — does not affect existing branches.
  if (targetType === "ally") {
    const out = new Set<string>();
    out.add(`${casterPos.x},${casterPos.y}`);
    for (const e of enemies) {
      if (!e.isSummon || e.side !== "player") continue;
      const dx = Math.abs(e.x - casterPos.x);
      const dy = Math.abs(e.y - casterPos.y);
      if (Math.max(dx, dy) <= range) {
        out.add(`${e.x},${e.y}`);
      }
    }
    return out;
  }

  // "all" spells affect every non-wall tile on the map
  if (targetType === "all") {
    const allTiles = new Set<string>();
    for (let y = 0; y < worldGridSize; y++) {
      for (let x = 0; x < worldGridSize; x++) {
        if (tiles[y][x] !== "wall") {
          allTiles.add(`${x},${y}`);
        }
      }
    }
    return allTiles;
  }

  const out = new Set<string>();

  // Helper: Bresenham line-of-sight — tests every grid cell the ray passes
  // through. Blocks on walls AND active barrier tiles. Void tiles are NOT in
  // the TileType union and must NOT block LoS (casting over void is allowed).
  // Defined here (before all branches) so the ground/barrier and line branches
  // can also apply LoS when spell.lineOfSight is truthy.
  const hasLoS = (tx: number, ty: number): boolean => {
    let x0 = casterPos.x;
    let y0 = casterPos.y;
    const x1 = tx;
    const y1 = ty;
    const ddx = Math.abs(x1 - x0);
    const ddy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = ddx - ddy;
    while (true) {
      // If this intermediate cell (not origin, not destination) is a wall OR
      // an active barrier tile, LoS is blocked. Void tiles are NOT in the
      // TileType union and must NOT block LoS (casting over void is allowed).
      if (
        (x0 !== casterPos.x || y0 !== casterPos.y) &&
        (x0 !== x1 || y0 !== y1)
      ) {
        if (tiles[y0]?.[x0] === "wall") return false;
        if (barrierTiles.has(`${x0},${y0}`)) return false;
      }
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -ddy) {
        err -= ddy;
        x0 += sx;
      }
      if (e2 < ddx) {
        err += ddx;
        y0 += sy;
      }
    }
    return true;
  };

  // ── Ground / barrier branch: MANHATTAN distance ─────────────────────────────
  if (targetType === "ground" || spell.isBarrier) {
    const occupied = new Set<string>();
    for (const e of enemies) occupied.add(`${e.x},${e.y}`);
    occupied.add(`${casterPos.x},${casterPos.y}`);
    for (let dx = -range; dx <= range; dx++) {
      for (let dy = -range; dy <= range; dy++) {
        const nx = casterPos.x + dx;
        const ny = casterPos.y + dy;
        if (nx < 0 || ny < 0 || nx >= worldGridSize || ny >= worldGridSize)
          continue;
        if (Math.abs(dx) + Math.abs(dy) > range && !spell.diagonal) continue;
        if (barrierTiles.has(`${nx},${ny}`)) continue;
        const key = `${nx},${ny}`;
        if (!occupied.has(key) && tiles[ny]?.[nx] !== "wall") {
          // LoS: ground/barrier spells with truthy spell.lineOfSight require
          // an unobstructed ray from caster to target. Spells with falsy
          // spell.lineOfSight (e.g. Barrier, which has no lineOfSight field)
          // bypass this and keep placing on any in-range free tile.
          if (spell.lineOfSight && !hasLoS(nx, ny)) continue;
          out.add(key);
        }
      }
    }
    return out;
  }

  // ── Line branch: tiles in a straight line from caster up to range using
  // Bresenham LoS. Walks every cell the ray passes through; stops at walls,
  // barriers, or grid bounds. ADDITIVE — does not affect existing branches.
  if (targetType === "line") {
    const out = new Set<string>();
    // Cast rays in all 8 directions (cardinal + diagonal) up to `range` tiles.
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];
    for (const [dx, dy] of dirs) {
      for (let step = 1; step <= range; step++) {
        const nx = casterPos.x + dx * step;
        const ny = casterPos.y + dy * step;
        if (nx < 0 || ny < 0 || nx >= worldGridSize || ny >= worldGridSize)
          break;
        if (tiles[ny]?.[nx] === "wall") break;
        if (barrierTiles.has(`${nx},${ny}`)) break;
        // LoS: line spells with truthy spell.lineOfSight require an
        // unobstructed ray. The ray-walk break above already stops at walls
        // and barriers, so hasLoS is satisfied for any tile reached; this
        // explicit guard keeps the line branch consistent with the
        // enemy/area/ground branches. Spells with falsy spell.lineOfSight
        // bypass it.
        if (spell.lineOfSight && !hasLoS(nx, ny)) break;
        out.add(`${nx},${ny}`);
      }
    }
    return out;
  }

  // ── Chain branch: single-target castability (same shape as 'enemy', no area
  // expansion). Bounces are handled in castHelpers, not targeting. ADDITIVE.
  if (targetType === "chain") {
    const out = new Set<string>();
    for (let dy = -range; dy <= range; dy++) {
      for (let dx = -range; dx <= range; dx++) {
        const chebyshev = Math.max(Math.abs(dx), Math.abs(dy));
        if (chebyshev > range) continue;
        if (chebyshev < minR) continue;
        if (dx === 0 && dy === 0) continue;
        const nx = casterPos.x + dx;
        const ny = casterPos.y + dy;
        if (nx < 0 || nx >= worldGridSize || ny < 0 || ny >= worldGridSize)
          continue;
        if (tiles[ny][nx] === "wall") continue;
        if (barrierTiles.has(`${nx},${ny}`)) continue;
        if (spell.lineOfSight && !hasLoS(nx, ny)) continue;
        out.add(`${nx},${ny}`);
      }
    }
    return out;
  }

  // ── Area / enemy branch: CHEBYSHEV distance ─────────────────────────────────
  const areaRadius = spell.areaRadius ?? 0;
  const targetTiles = new Set<string>();
  for (let dy = -range; dy <= range; dy++) {
    for (let dx = -range; dx <= range; dx++) {
      const chebyshev = Math.max(Math.abs(dx), Math.abs(dy));
      if (chebyshev > range) continue;
      if (chebyshev < minR) continue;
      if (dx === 0 && dy === 0) continue;
      const nx = casterPos.x + dx;
      const ny = casterPos.y + dy;
      if (nx < 0 || nx >= worldGridSize || ny < 0 || ny >= worldGridSize)
        continue;
      if (tiles[ny][nx] === "wall") continue;

      // Linear: only cardinal directions (dx=0 or dy=0)
      if (spell.linear && dx !== 0 && dy !== 0) continue;
      // Diagonal: only diagonal lines (|dx|===|dy|)
      if (spell.diagonal && Math.abs(dx) !== Math.abs(dy)) continue;
      // Free cells: skip tiles occupied by enemies or player
      if (spell.freeCells) {
        const occupied =
          enemies.some((e) => e.x === nx && e.y === ny) ||
          (nx === casterPos.x && ny === casterPos.y);
        if (occupied) continue;
      }
      // Line of sight check
      if (spell.lineOfSight && !hasLoS(nx, ny)) continue;

      // H3: barrier tiles are impassable (treat as walls for LoS and range)
      if (barrierTiles.has(`${nx},${ny}`)) continue;
      targetTiles.add(`${nx},${ny}`);
    }
  }

  // For area spells, expand each target tile by areaRadius
  if (targetType === "area" && areaRadius > 0) {
    for (const key of targetTiles) {
      const [tx, ty] = key.split(",").map(Number);
      for (let dy = -areaRadius; dy <= areaRadius; dy++) {
        for (let dx = -areaRadius; dx <= areaRadius; dx++) {
          const chebyshev = Math.max(Math.abs(dx), Math.abs(dy));
          if (chebyshev > areaRadius) continue;
          const nx = tx + dx;
          const ny = ty + dy;
          if (nx < 0 || nx >= worldGridSize || ny < 0 || ny >= worldGridSize)
            continue;
          if (tiles[ny][nx] === "wall") continue;
          out.add(`${nx},${ny}`);
        }
      }
    }
  } else {
    for (const key of targetTiles) out.add(key);
  }

  return out;
}

/**
 * Result of a live single-tile castability probe. `ok` is true when the tile
 * is a legal target for `spell` from `casterPos` against the CURRENT world
 * (no cache). When `ok` is false, `reason` is a short stable string the click
 * handlers log on rejection.
 */
export interface TileCastableResult {
  ok: boolean;
  reason: string;
}

/**
 * #1A — Live single-tile validation helper (PURE, no cache).
 *
 * Validates range metric + line-of-sight + target rules for ONE tile against
 * the CURRENT world. Reuses the SAME range metric and LoS logic as
 * {@link computeTargetableTiles} so the highlight (precomputed set) and the
 * live gate (this helper) can never disagree on geometry:
 *   - ground / barrier spells → MANHATTAN distance (|dx|+|dy| <= range),
 *   - area / enemy / chain spells → CHEBYSHEV distance (max(|dx|,|dy|) <= range),
 *   - line spells → Bresenham LoS ray-walk (must reach the tile),
 *   - LoS (when `spell.lineOfSight` is truthy) → Bresenham unobstructed ray.
 *
 * Target rules are honored using EXPLICIT metadata only (the `targetType`
 * field plus `spell.isBarrier` / `spell.lineOfSight` / `spell.freeCells` /
 * `spell.linear` / `spell.diagonal` / `spell.areaRadius` / `spell.minRange`)
 * — never name-based heuristics.
 *
 * `self` / `all` / `ally` are handled inline (self → only the caster tile;
 * all → any non-wall tile; ally → caster tile or a player-side summon tile
 * within Chebyshev range). `ground` / `barrier` use Manhattan. `line` walks
 * the Bresenham ray. `area` / `enemy` / `chain` use Chebyshev (area expands
 * the destination by `areaRadius` so a tile inside the AoE footprint of a
 * legal anchor is itself legal).
 *
 * `liveCombatants` is the live combatant array (typically
 * `getLiveCombatants(combatantStoreCtx)`) used for occupied/free-cell checks.
 * `mapTiles` is the world tile grid. Both are read-only here.
 */
export function isTileCastableLive(
  spell: SpellConfig,
  casterPos: CasterPosition,
  tile: { x: number; y: number },
  liveCombatants: Enemy[],
  mapTiles: TileType[][],
): TileCastableResult {
  const targetType = (spell.targetType ?? "enemy") as string;
  const worldGridSize = mapTiles.length;
  const range = spell.maxRange ?? Math.max(1, Number(spell.range));
  const minR = spell.minRange ?? 1;
  const tx = tile.x;
  const ty = tile.y;

  // Bounds check — out-of-grid tiles are never castable.
  if (
    !Number.isFinite(tx) ||
    !Number.isFinite(ty) ||
    tx < 0 ||
    ty < 0 ||
    tx >= worldGridSize ||
    ty >= worldGridSize ||
    mapTiles.length <= ty ||
    mapTiles[ty]?.length <= tx
  ) {
    return { ok: false, reason: "out_of_bounds" };
  }

  // Wall tiles are never castable (every branch rejects them).
  if (mapTiles[ty][tx] === "wall") {
    return { ok: false, reason: "wall_tile" };
  }

  // ── self: only the caster tile.
  if (targetType === "self") {
    if (tx === casterPos.x && ty === casterPos.y) {
      return { ok: true, reason: "self" };
    }
    return { ok: false, reason: "self_other_tile" };
  }

  // ── all: any non-wall tile (wall already rejected above).
  if (targetType === "all") {
    return { ok: true, reason: "all" };
  }

  // ── ally: caster tile OR a player-side summon within Chebyshev range.
  if (targetType === "ally") {
    if (tx === casterPos.x && ty === casterPos.y) {
      return { ok: true, reason: "ally_self" };
    }
    const dx = Math.abs(tx - casterPos.x);
    const dy = Math.abs(ty - casterPos.y);
    if (Math.max(dx, dy) > range) {
      return { ok: false, reason: "ally_out_of_range" };
    }
    const ally = liveCombatants.find(
      (e) =>
        e.x === tx &&
        e.y === ty &&
        e.isSummon === true &&
        e.side === "player" &&
        e.hp > 0,
    );
    if (ally) return { ok: true, reason: "ally_summon" };
    return { ok: false, reason: "ally_no_summon_at_tile" };
  }

  // Bresenham LoS — identical to the one inside computeTargetableTiles so the
  // live gate and the highlight set use the SAME obstruction logic.
  const hasLoS = (
    lx0: number,
    ly0: number,
    lx1: number,
    ly1: number,
  ): boolean => {
    let x0 = lx0;
    let y0 = ly0;
    const ddx = Math.abs(lx1 - x0);
    const ddy = Math.abs(ly1 - y0);
    const sx = x0 < lx1 ? 1 : -1;
    const sy = y0 < ly1 ? 1 : -1;
    let err = ddx - ddy;
    while (true) {
      if ((x0 !== lx0 || y0 !== ly0) && (x0 !== lx1 || y0 !== ly1)) {
        if (mapTiles[y0]?.[x0] === "wall") return false;
        if (spell.isBarrier) {
          // barrierTiles are not passed to the live helper; barrier spells
          // do not require LoS (lineOfSight is falsy on Barrier), so this
          // branch is unreachable for barrier spells. Kept for parity.
        }
      }
      if (x0 === lx1 && y0 === ly1) break;
      const e2 = 2 * err;
      if (e2 > -ddy) {
        err -= ddy;
        x0 += sx;
      }
      if (e2 < ddx) {
        err += ddx;
        y0 += sy;
      }
    }
    return true;
  };

  // ── ground / barrier: MANHATTAN distance.
  if (targetType === "ground" || spell.isBarrier) {
    const dx = Math.abs(tx - casterPos.x);
    const dy = Math.abs(ty - casterPos.y);
    if (Math.abs(dx) + Math.abs(dy) > range && !spell.diagonal) {
      return { ok: false, reason: "ground_out_of_range" };
    }
    // Occupied tiles (by a combatant or the caster) are not castable ground.
    const occupied =
      liveCombatants.some((e) => e.x === tx && e.y === ty) ||
      (tx === casterPos.x && ty === casterPos.y);
    if (occupied) {
      return { ok: false, reason: "ground_occupied" };
    }
    if (spell.lineOfSight && !hasLoS(casterPos.x, casterPos.y, tx, ty)) {
      return { ok: false, reason: "ground_los_blocked" };
    }
    return { ok: true, reason: "ground" };
  }

  // ── line: Bresenham ray-walk from caster toward the tile in the matching
  // direction; the tile is castable iff the ray reaches it before hitting a
  // wall / barrier / grid bound. This mirrors the line branch in
  // computeTargetableTiles exactly.
  if (targetType === "line") {
    const ddx = tx - casterPos.x;
    const ddy = ty - casterPos.y;
    // Line spells only travel along the 8 cardinal/diagonal directions.
    const isCardinal = ddx === 0 || ddy === 0;
    const isDiagonal = Math.abs(ddx) === Math.abs(ddy);
    if (!isCardinal && !isDiagonal) {
      return { ok: false, reason: "line_off_axis" };
    }
    const stepX = ddx === 0 ? 0 : ddx > 0 ? 1 : -1;
    const stepY = ddy === 0 ? 0 : ddy > 0 ? 1 : -1;
    const cheb = Math.max(Math.abs(ddx), Math.abs(ddy));
    if (cheb > range) return { ok: false, reason: "line_out_of_range" };
    if (cheb < minR) return { ok: false, reason: "line_below_min_range" };
    let cx = casterPos.x;
    let cy = casterPos.y;
    for (let step = 1; step <= cheb; step++) {
      cx += stepX;
      cy += stepY;
      if (cx < 0 || cy < 0 || cx >= worldGridSize || cy >= worldGridSize) {
        return { ok: false, reason: "line_blocked_bounds" };
      }
      if (mapTiles[cy]?.[cx] === "wall") {
        return { ok: false, reason: "line_blocked_wall" };
      }
      if (cx === tx && cy === ty) {
        // Reached the target tile along an unobstructed ray.
        return { ok: true, reason: "line" };
      }
    }
    return { ok: false, reason: "line_not_reached" };
  }

  // ── area / enemy / chain: CHEBYSHEV distance (with area expansion for
  // `area`). The clicked tile is castable when it is within Chebyshev range
  // of the caster (enemy/chain) OR within `areaRadius` of an in-range anchor
  // tile (area). LoS, linear, diagonal, freeCells, and minRange are honored.
  const dx = tx - casterPos.x;
  const dy = ty - casterPos.y;
  const chebyshev = Math.max(Math.abs(dx), Math.abs(dy));

  // Linear: only cardinal directions (dx=0 or dy=0).
  if (spell.linear && dx !== 0 && dy !== 0) {
    // For area spells, the tile may still be inside the AoE footprint of a
    // legal cardinal anchor — check the area expansion path below before
    // rejecting.
    if (targetType !== "area") {
      return { ok: false, reason: "linear_off_axis" };
    }
  }
  // Diagonal: only diagonal lines (|dx|===|dy|).
  if (spell.diagonal && Math.abs(dx) !== Math.abs(dy)) {
    if (targetType !== "area") {
      return { ok: false, reason: "diagonal_off_axis" };
    }
  }

  // freeCells: skip tiles occupied by a combatant or the caster.
  if (spell.freeCells) {
    const occupied =
      liveCombatants.some((e) => e.x === tx && e.y === ty) ||
      (tx === casterPos.x && ty === casterPos.y);
    if (occupied) {
      // For area spells an occupied anchor is still a valid anchor (the AoE
      // expands around it); only reject when freeCells is set AND the spell
      // is not area.
      if (targetType !== "area") {
        return { ok: false, reason: "free_cells_occupied" };
      }
    }
  }

  // Direct in-range check (enemy / chain / area anchor).
  if (chebyshev <= range && chebyshev >= minR && !(dx === 0 && dy === 0)) {
    if (spell.lineOfSight && !hasLoS(casterPos.x, casterPos.y, tx, ty)) {
      // Fall through to area-expansion check for area spells.
      if (targetType !== "area") {
        return { ok: false, reason: "los_blocked" };
      }
    } else {
      return {
        ok: true,
        reason: targetType === "area" ? "area_anchor" : targetType,
      };
    }
  }

  // Area expansion: the clicked tile is castable when it sits inside the
  // areaRadius footprint of a legal anchor tile. Walk candidate anchors
  // within Chebyshev range of the caster and check whether the clicked tile
  // is within areaRadius of any of them (and that anchor has LoS, etc.).
  if (targetType === "area") {
    const areaRadius = spell.areaRadius ?? 0;
    if (areaRadius <= 0) {
      return { ok: false, reason: "area_no_radius" };
    }
    for (let ay = -range; ay <= range; ay++) {
      for (let ax = -range; ax <= range; ax++) {
        const aCheb = Math.max(Math.abs(ax), Math.abs(ay));
        if (aCheb > range) continue;
        if (aCheb < minR) continue;
        if (ax === 0 && ay === 0) continue;
        const axN = casterPos.x + ax;
        const ayN = casterPos.y + ay;
        if (axN < 0 || ayN < 0 || axN >= worldGridSize || ayN >= worldGridSize)
          continue;
        if (mapTiles[ayN]?.[axN] === "wall") continue;
        if (spell.linear && ax !== 0 && ay !== 0) continue;
        if (spell.diagonal && Math.abs(ax) !== Math.abs(ay)) continue;
        if (spell.lineOfSight && !hasLoS(casterPos.x, casterPos.y, axN, ayN))
          continue;
        // Is the clicked tile within areaRadius of this anchor?
        const tdx = Math.abs(tx - axN);
        const tdy = Math.abs(ty - ayN);
        if (Math.max(tdx, tdy) <= areaRadius) {
          return { ok: true, reason: "area_expansion" };
        }
      }
    }
    return { ok: false, reason: "area_no_anchor" };
  }

  return { ok: false, reason: "no_matching_branch" };
}
