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
