/**
 * Battle-walk MP cost shared by highlight BFS, hover, player debit, and
 * summon-control debit.
 *
 * Frozen Terrain / Slime Flood implement `onMpCost: (c) => c * 2`. Preview
 * already used `mapModifierRegistry.applyMpCost`; execute charged
 * `path.length` (1 MP/tile). A 6-MP Frozen walk could split into leftover
 * 1-MP slices and exceed the highlighted ring.
 *
 * Do not change the 2× formula — only apply it at execute too.
 */

export function battleWalkCostPerTile(
  applyMpCost: (base: number) => number,
): number {
  const per = Math.floor(Number(applyMpCost(1)) || 0);
  return Math.max(1, per);
}

export function battleWalkMpCost(
  pathLength: number,
  costPerTile: number,
): number {
  const tiles = Math.max(0, Math.floor(Number(pathLength) || 0));
  const per = Math.max(1, Math.floor(Number(costPerTile) || 1));
  return tiles * per;
}

export function canAffordBattleWalk(
  currentMp: number,
  pathLength: number,
  costPerTile: number,
): boolean {
  const mp = Math.max(0, Math.floor(Number(currentMp) || 0));
  return mp >= battleWalkMpCost(pathLength, costPerTile);
}

/**
 * Highlight BFS budget. Origin is already the controlled summon tile;
 * using leftover player MP made a 2-MP player / 3-MP wolf paint 2 green
 * tiles and then walk 3.
 */
export function battleWalkMpBudget(args: {
  playerMp: number;
  controllingSummon: boolean;
  summonMp?: number | null;
}): number {
  if (args.controllingSummon) {
    return Math.max(0, Math.floor(Number(args.summonMp) || 0));
  }
  return Math.max(0, Math.floor(Number(args.playerMp) || 0));
}

export type BattleWalkCell = { x: number; y: number };

export interface ComputeBattleWalkReachableArgs {
  origin: BattleWalkCell;
  mpBudget: number;
  costPerTile: number;
  worldGridSize: number;
  isBlocked: (x: number, y: number) => boolean;
  /**
   * Living occupant on the destination (not the walker). Execute rejects
   * these tiles ("Occupied") so they must not be highlighted. Traversal
   * stays allowed — player `findPath` still walks through occupants.
   */
  isOccupiedDest?: (x: number, y: number) => boolean;
}

export interface BattleWalkReachable {
  tiles: Set<string>;
  /** MP the hover label and execute debit must share for each dest. */
  costByKey: Map<string, number>;
}

/**
 * Battle-walk highlight BFS. Same 4-neighbour flood, MP budget, and
 * per-tile Frozen/Slime cost as player/summon execute. Occupied
 * destinations are omitted from `tiles` so a green cell is executable.
 */
export function computeBattleWalkReachable(
  args: ComputeBattleWalkReachableArgs,
): BattleWalkReachable {
  const tiles = new Set<string>();
  const costByKey = new Map<string, number>();
  const size = Math.max(0, Math.floor(Number(args.worldGridSize) || 0));
  const budget = Math.max(0, Math.floor(Number(args.mpBudget) || 0));
  const per = Math.max(1, Math.floor(Number(args.costPerTile) || 1));
  if (budget <= 0 || size <= 0) return { tiles, costByKey };

  const visited = new Map<string, number>();
  const queue: { x: number; y: number; steps: number }[] = [
    { x: args.origin.x, y: args.origin.y, steps: 0 },
  ];
  visited.set(`${args.origin.x},${args.origin.y}`, 0);
  const dirs = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];
  while (queue.length > 0) {
    const current = queue.shift()!;
    const nextSteps = current.steps + per;
    if (nextSteps > budget) continue;
    for (const d of dirs) {
      const nx = current.x + d.x;
      const ny = current.y + d.y;
      if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
      const key = `${nx},${ny}`;
      if (args.isBlocked(nx, ny)) continue;
      const prevBest = visited.get(key);
      if (prevBest !== undefined && prevBest <= nextSteps) continue;
      visited.set(key, nextSteps);
      if (args.isOccupiedDest?.(nx, ny) !== true) {
        tiles.add(key);
        costByKey.set(key, nextSteps);
      }
      if (nextSteps < budget) {
        queue.push({ x: nx, y: ny, steps: nextSteps });
      }
    }
  }
  return { tiles, costByKey };
}

/** Hover MP label: BFS cost, not Manhattan-from-player. */
export function hoverBattleWalkMpCost(
  costByKey: ReadonlyMap<string, number>,
  tile: BattleWalkCell,
): number | null {
  const cost = costByKey.get(`${tile.x},${tile.y}`);
  return cost === undefined ? null : cost;
}
