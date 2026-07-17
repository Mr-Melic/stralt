// Pure map-generation helpers — extracted from WorldExploration.tsx
// Zero React / DOM dependencies.

export const MAP_ARCHETYPES = [
  {
    type: "openField" as const,
    fillDensity: 0.22,
    smoothPasses: 2,
    weight: 25,
  },
  {
    type: "corridorMaze" as const,
    fillDensity: 0.55,
    smoothPasses: 4,
    weight: 15,
  },
  {
    type: "fortress" as const,
    fillDensity: 0.4,
    smoothPasses: 3,
    weight: 15,
  },
  {
    type: "ruinsIslands" as const,
    fillDensity: 0.3,
    smoothPasses: 2,
    weight: 15,
  },
  { type: "arena" as const, fillDensity: 0.12, smoothPasses: 1, weight: 10 },
  {
    type: "asymmetric" as const,
    fillDensity: 0.35,
    smoothPasses: 3,
    weight: 10,
  },
  {
    type: "chessboard" as const,
    fillDensity: 0.5,
    smoothPasses: 2,
    weight: 10,
  },
];

export function pickMapArchetype() {
  const totalWeight = MAP_ARCHETYPES.reduce((s, a) => s + a.weight, 0);
  let r = Math.random() * totalWeight;
  for (const a of MAP_ARCHETYPES) {
    r -= a.weight;
    if (r <= 0) return a;
  }
  return MAP_ARCHETYPES[0];
}

export function countWalkableVoid(
  tilesArr: string[][],
  vt: Set<string>,
  w: number,
  h: number,
): number {
  let n = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if ((tilesArr[y]?.[x] as string) !== "wall" && !vt.has(`${x},${y}`)) n++;
  return n;
}

export function checkVoidConnectivity(
  tilesArr: string[][],
  vt: Set<string>,
  w: number,
  h: number,
): boolean {
  let sx = -1;
  let sy = -1;
  outer: for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if ((tilesArr[y]?.[x] as string) !== "wall" && !vt.has(`${x},${y}`)) {
        sx = x;
        sy = y;
        break outer;
      }
  if (sx < 0) return true;
  const vis = new Set<string>();
  const q = [`${sx},${sy}`];
  while (q.length > 0) {
    const k = q.shift()!;
    if (vis.has(k)) continue;
    vis.add(k);
    const ps = k.split(",");
    const kx = Number(ps[0]);
    const ky = Number(ps[1]);
    for (const d of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ] as [number, number][]) {
      const nx = kx + d[0];
      const ny = ky + d[1];
      const nk = `${nx},${ny}`;
      if (
        tilesArr[ny]?.[nx] &&
        (tilesArr[ny][nx] as string) !== "wall" &&
        !vt.has(nk) &&
        !vis.has(nk)
      )
        q.push(nk);
    }
  }
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (
        (tilesArr[y]?.[x] as string) !== "wall" &&
        !vt.has(`${x},${y}`) &&
        !vis.has(`${x},${y}`)
      )
        return false;
  return true;
}

export function applyVoidTiles(
  tilesArr: string[][],
  arch: string,
  vt: Set<string>,
  prot: Set<string>,
  mw: number,
  mh: number,
): void {
  const ec =
    arch === "arena"
      ? 0.04
      : arch === "corridorMaze"
        ? 0.18
        : arch === "ruinsIslands"
          ? 0.32
          : 0.13;
  for (let x = 0; x < mw; x++)
    for (let y = 0; y < mh; y++) {
      if ((tilesArr[y]?.[x] as string) === "wall" || prot.has(`${x},${y}`))
        continue;
      if (
        (x <= 1 || y <= 1 || x >= mw - 2 || y >= mh - 2) &&
        Math.random() < ec
      )
        vt.add(`${x},${y}`);
    }
  if (arch === "corridorMaze" || arch === "arena") return;
  const cc =
    arch === "ruinsIslands"
      ? 5 + Math.floor(Math.random() * 3)
      : 2 + Math.floor(Math.random() * 2);
  const mw2 = countWalkableVoid(tilesArr, vt, mw, mh) * 0.55;
  for (let c = 0; c < cc; c++) {
    const ad: string[] = [];
    let at = 0;
    let cx = 0;
    let cy = 0;
    do {
      cx = 2 + Math.floor(Math.random() * (mw - 4));
      cy = 2 + Math.floor(Math.random() * (mh - 4));
      at++;
    } while (
      at < 20 &&
      ((tilesArr[cy]?.[cx] as string) === "wall" ||
        vt.has(`${cx},${cy}`) ||
        prot.has(`${cx},${cy}`))
    );
    if (at >= 20) continue;
    const sz = 2 + Math.floor(Math.random() * 3);
    const q = [`${cx},${cy}`];
    while (ad.length < sz && q.length > 0) {
      const k = q.shift()!;
      if (vt.has(k) || prot.has(k)) continue;
      const p = k.split(",");
      const kx = Number(p[0]);
      const ky = Number(p[1]);
      if (!tilesArr[ky]?.[kx] || (tilesArr[ky][kx] as string) === "wall")
        continue;
      ad.push(k);
      vt.add(k);
      for (const d of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ] as [number, number][])
        q.push(`${kx + d[0]},${ky + d[1]}`);
    }
    if (countWalkableVoid(tilesArr, vt, mw, mh) < mw2) {
      for (const k of ad) vt.delete(k);
    }
  }
  // M3 fix: run connectivity check once after all clusters placed
  if (!checkVoidConnectivity(tilesArr, vt, mw, mh)) {
    vt.clear();
  }
}

// ── SECTION 6: MAP REACHABILITY LOCK-IN ────────────────────────────────────
// Pure post-generation pass. Flood-fills from the player spawn over walkable
// (non-wall, non-void) tiles, then guarantees every enemy spawn and the portal
// are reachable from the player. Enclosed spawns are either connected by
// carving the fewest possible walls to floor, or relocated to the nearest
// reachable cell when carving is impractical (deep void pocket).
//
// Runs AFTER archetype post-steps, void tile application, and enemy spawn
// placement, BEFORE state commit. Self-contained — no React / DOM imports.

const REACH_DIRS: [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function isWalkable(
  tiles: string[][],
  vt: Set<string>,
  x: number,
  y: number,
  w: number,
  h: number,
): boolean {
  if (x < 0 || y < 0 || x >= w || y >= h) return false;
  const t = tiles[y]?.[x] as string;
  if (t === "wall") return false;
  if (vt.has(`${x},${y}`)) return false;
  return true;
}

function floodFillReachable(
  tiles: string[][],
  vt: Set<string>,
  start: { x: number; y: number },
  w: number,
  h: number,
): Set<string> {
  const visited = new Set<string>();
  if (!isWalkable(tiles, vt, start.x, start.y, w, h)) return visited;
  const q: { x: number; y: number }[] = [start];
  visited.add(`${start.x},${start.y}`);
  while (q.length > 0) {
    const cur = q.shift()!;
    for (const d of REACH_DIRS) {
      const nx = cur.x + d[0];
      const ny = cur.y + d[1];
      const k = `${nx},${ny}`;
      if (visited.has(k)) continue;
      if (!isWalkable(tiles, vt, nx, ny, w, h)) continue;
      visited.add(k);
      q.push({ x: nx, y: ny });
    }
  }
  return visited;
}

// BFS from `start` to any cell in `targetSet`, treating walls as walkable
// (cost 1) and floor/portal as walkable (cost 0). Returns the sequence of
// wall cells to convert to floor, or null if no path exists (e.g. blocked by
// void or grid bounds).
function bfsCarvePath(
  tiles: string[][],
  vt: Set<string>,
  start: { x: number; y: number },
  targetSet: Set<string>,
  w: number,
  h: number,
): { x: number; y: number }[] | null {
  // 0-1 BFS using two queues (floor = front, wall = back).
  const visited = new Set<string>();
  const parent = new Map<string, { x: number; y: number } | null>();
  const startKey = `${start.x},${start.y}`;
  // Start cell must be in-bounds and not void. It may be a wall (we'll carve it).
  if (
    start.x < 0 ||
    start.y < 0 ||
    start.x >= w ||
    start.y >= h ||
    vt.has(startKey)
  )
    return null;
  const floorQ: { x: number; y: number }[] = [];
  const wallQ: { x: number; y: number }[] = [];
  if ((tiles[start.y]?.[start.x] as string) === "wall") {
    wallQ.push(start);
  } else {
    floorQ.push(start);
  }
  visited.add(startKey);
  parent.set(startKey, null);
  let foundKey: string | null = null;
  while (floorQ.length > 0 || wallQ.length > 0) {
    const cur = floorQ.length > 0 ? floorQ.shift()! : wallQ.shift()!;
    const ck = `${cur.x},${cur.y}`;
    if (targetSet.has(ck) && ck !== startKey) {
      foundKey = ck;
      break;
    }
    for (const d of REACH_DIRS) {
      const nx = cur.x + d[0];
      const ny = cur.y + d[1];
      const nk = `${nx},${ny}`;
      if (visited.has(nk)) continue;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      if (vt.has(nk)) continue; // void is never traversable
      visited.add(nk);
      parent.set(nk, cur);
      if ((tiles[ny]?.[nx] as string) === "wall") {
        wallQ.push({ x: nx, y: ny });
      } else {
        floorQ.push({ x: nx, y: ny });
      }
    }
  }
  if (foundKey === null) return null;
  // Walk back from foundKey to start, collecting wall cells only.
  const carve: { x: number; y: number }[] = [];
  let curKey: string | null = foundKey;
  while (curKey !== null && curKey !== startKey) {
    const p = curKey.split(",");
    const px = Number(p[0]);
    const py = Number(p[1]);
    if ((tiles[py]?.[px] as string) === "wall") {
      carve.push({ x: px, y: py });
    }
    const par = parent.get(curKey);
    if (!par) break;
    curKey = `${par.x},${par.y}`;
  }
  // Also carve the start cell itself if it's a wall (so the spawn sits on floor).
  if ((tiles[start.y]?.[start.x] as string) === "wall") {
    carve.push({ x: start.x, y: start.y });
  }
  return carve;
}

// Find the nearest cell in `reachable` to `target` by Chebyshev distance that
// is also walkable. Used as the relocation fallback.
function nearestReachableCell(
  target: { x: number; y: number },
  reachable: Set<string>,
  w: number,
  h: number,
): { x: number; y: number } | null {
  let best: { x: number; y: number } | null = null;
  let bestDist = Number.POSITIVE_INFINITY;
  for (const k of reachable) {
    const p = k.split(",");
    const rx = Number(p[0]);
    const ry = Number(p[1]);
    if (rx < 0 || ry < 0 || rx >= w || ry >= h) continue;
    const dist = Math.max(Math.abs(rx - target.x), Math.abs(ry - target.y));
    if (dist < bestDist) {
      bestDist = dist;
      best = { x: rx, y: ry };
    }
  }
  return best;
}

export function ensureReachability(
  tiles: string[][],
  voidTiles: Set<string>,
  spawns: { x: number; y: number }[],
  playerSpawn: { x: number; y: number },
  portal: { x: number; y: number },
  w: number,
  h: number,
): { tiles: string[][]; spawns: { x: number; y: number }[] } {
  // Deep-copy tiles so we never mutate the caller's grid.
  const out: string[][] = tiles.map((row) => (row ? row.slice() : []));
  const vt = voidTiles;
  // Defensive copy of spawns (we may relocate individual entries).
  const outSpawns: { x: number; y: number }[] = spawns.map((s) => ({
    x: s.x,
    y: s.y,
  }));

  // 1. Flood-fill from the player spawn over walkable tiles.
  let reachable = floodFillReachable(out, vt, playerSpawn, w, h);

  // If the player spawn itself is enclosed (no walkable neighbours and not
  // already on a walkable cell), relocate the player spawn to the nearest
  // walkable cell in the grid and re-flood.
  if (reachable.size === 0) {
    const alt = nearestReachableCell(playerSpawn, new Set(), w, h);
    // Fall back to scanning the whole grid for any walkable cell.
    let fallback: { x: number; y: number } | null = alt;
    if (!fallback) {
      outerScan: for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (isWalkable(out, vt, x, y, w, h)) {
            fallback = { x, y };
            break outerScan;
          }
        }
      }
    }
    if (fallback) {
      reachable = floodFillReachable(out, vt, fallback, w, h);
    } else {
      // Entire grid is walls/void — carve a 3x3 clearing at the player spawn
      // as a last resort so the game remains playable.
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = playerSpawn.x + dx;
          const ny = playerSpawn.y + dy;
          if (
            nx >= 0 &&
            ny >= 0 &&
            nx < w &&
            ny < h &&
            !vt.has(`${nx},${ny}`)
          ) {
            out[ny][nx] = "floor";
          }
        }
      }
      reachable = floodFillReachable(out, vt, playerSpawn, w, h);
    }
  }

  // 2. For each enemy spawn not reachable, carve or relocate.
  for (let i = 0; i < outSpawns.length; i++) {
    const sp = outSpawns[i];
    const key = `${sp.x},${sp.y}`;
    if (reachable.has(key)) continue;
    // Try carving a minimal path to the reachable set.
    const carve = bfsCarvePath(out, vt, sp, reachable, w, h);
    if (carve !== null && carve.length <= 6) {
      for (const c of carve) {
        if ((out[c.y]?.[c.x] as string) === "wall") {
          out[c.y][c.x] = "floor";
          reachable.add(`${c.x},${c.y}`);
        }
      }
      // Re-flood from the player spawn to expand the reachable set through
      // the newly opened corridor.
      reachable = floodFillReachable(out, vt, playerSpawn, w, h);
      if (!reachable.has(`${sp.x},${sp.y}`)) {
        // Carving didn't connect (e.g. spawn sits in a void pocket). Relocate.
        const near = nearestReachableCell(sp, reachable, w, h);
        if (near) outSpawns[i] = near;
      }
    } else {
      // Carving impractical (too long or no path). Relocate to nearest
      // reachable cell.
      const near = nearestReachableCell(sp, reachable, w, h);
      if (near) outSpawns[i] = near;
    }
  }

  // 3. Guarantee the portal is reachable from the player spawn.
  const portalKey = `${portal.x},${portal.y}`;
  if (!reachable.has(portalKey)) {
    const carve = bfsCarvePath(out, vt, portal, reachable, w, h);
    if (carve !== null && carve.length <= 8) {
      for (const c of carve) {
        if ((out[c.y]?.[c.x] as string) === "wall") {
          out[c.y][c.x] = "floor";
          reachable.add(`${c.x},${c.y}`);
        }
      }
      reachable = floodFillReachable(out, vt, playerSpawn, w, h);
    }
    // If the portal still isn't reachable, carve a 3x3 clearing around it as a
    // last resort (the portal must always be reachable — player progression
    // depends on it).
    if (!reachable.has(portalKey)) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = portal.x + dx;
          const ny = portal.y + dy;
          if (
            nx >= 0 &&
            ny >= 0 &&
            nx < w &&
            ny < h &&
            !vt.has(`${nx},${ny}`)
          ) {
            if ((out[ny]?.[nx] as string) === "wall") {
              out[ny][nx] = "floor";
            }
          }
        }
      }
      reachable = floodFillReachable(out, vt, playerSpawn, w, h);
    }
  }

  return { tiles: out, spawns: outSpawns };
}
