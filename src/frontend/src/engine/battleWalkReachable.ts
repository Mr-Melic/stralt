/**
 * Battle-walk highlight BFS shared with execute occupancy and hover MP.
 *
 * Player `findPath` still walks *through* living units; Occupied only
 * rejects the destination. The green ring used to paint occupied dests
 * (execute floated Occupied) and hover used Manhattan × Frozen/Slime
 * instead of the BFS step total the click debits.
 *
 * Unique vs queued #379 (`isBattleWalkDestinationOccupied` on
 * walkRejectCopy + WX wrap) and #417 (`battleWalkHoverMpPreview` lookup
 * into an already-computed cost). This module owns the flood itself so
 * WorldExploration / battleWalkMp / walkRejectCopy stay merge-clean.
 * Do not change walk-through or the 2× Frozen/Slime formula.
 */

export type BattleWalkCell = { x: number; y: number };

export interface ComputeBattleWalkReachableArgs {
  origin: BattleWalkCell;
  mpBudget: number;
  costPerTile: number;
  worldGridSize: number;
  isBlocked: (x: number, y: number) => boolean;
  /**
   * Living occupant on the destination (not the walker). Execute rejects
   * these tiles so they must not be highlighted. Traversal stays allowed.
   */
  isOccupiedDest?: (x: number, y: number) => boolean;
}

export interface BattleWalkReachable {
  tiles: Set<string>;
  /** MP the hover label and execute debit must share for each dest. */
  costByKey: Map<string, number>;
}

/** Living dest occupancy: walker tile is free; corpses (`hp <= 0`) are free. */
export function battleWalkDestOccupiedByLiving(args: {
  dest: BattleWalkCell;
  walker?: BattleWalkCell;
  livingOccupants: ReadonlyArray<{ x: number; y: number; hp?: number }>;
  extraOccupied?: ReadonlyArray<BattleWalkCell>;
}): boolean {
  const { dest } = args;
  if (args.walker && args.walker.x === dest.x && args.walker.y === dest.y) {
    return false;
  }
  for (const extra of args.extraOccupied ?? []) {
    if (extra.x === dest.x && extra.y === dest.y) return true;
  }
  return args.livingOccupants.some(
    (e) => (e.hp ?? 0) > 0 && e.x === dest.x && e.y === dest.y,
  );
}

/**
 * Cardinal BFS. Occupied destinations are omitted from `tiles` so a green
 * cell is executable. Neighbours behind an occupant stay reachable.
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

/** Hover MP label: BFS dest cost, not Manhattan-from-player. */
export function battleWalkDestHoverMp(
  costByKey: ReadonlyMap<string, number>,
  tile: BattleWalkCell,
): number | null {
  const cost = costByKey.get(`${tile.x},${tile.y}`);
  return cost === undefined ? null : cost;
}

/**
 * Highlight membership is the execute gate: a painted dest is affordable
 * along the BFS; a missing dest cannot walk (occupied / wall / over budget).
 */
export function canExecuteBattleWalkDest(
  reachable: Pick<BattleWalkReachable, "tiles">,
  dest: BattleWalkCell,
): boolean {
  return reachable.tiles.has(`${dest.x},${dest.y}`);
}
