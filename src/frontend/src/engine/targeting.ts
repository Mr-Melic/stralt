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
          out.add(key);
        }
      }
    }
    return out;
  }

  // Helper: Bresenham line-of-sight — tests every grid cell the ray passes through
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
      // If this intermediate cell (not origin, not destination) is a wall, LoS blocked
      if (
        (x0 !== casterPos.x || y0 !== casterPos.y) &&
        (x0 !== x1 || y0 !== y1)
      ) {
        if (tiles[y0]?.[x0] === "wall") return false;
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
