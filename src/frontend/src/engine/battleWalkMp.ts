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

export type BattleWalkHoverMpPreview = {
  mpCost: number;
  affordable: boolean;
};

/**
 * Canvas hover used Manhattan from the player tile (`|dx|+|dy| * applyMpCost`).
 * Highlight BFS and execute debit {@link battleWalkMpCost} from the active
 * caster along the cardinal path (walls detour; Frozen/Slime already baked
 * into the BFS step total). A far/blocked floor therefore showed a cheap
 * green cost the click then rejected, and a wall-around tile showed 2 MP
 * while execute charged 4.
 *
 * Show a cost only for a highlighted destination, using the same MP the
 * walk click will spend. Origin (cost 0) and illegal tiles stay quiet.
 */
export function battleWalkHoverMpPreview(args: {
  destKey: string;
  reachable: ReadonlySet<string>;
  mpCost: number;
  currentMp: number;
}): BattleWalkHoverMpPreview | null {
  if (!args.reachable.has(args.destKey)) return null;
  const mpCost = Math.max(0, Math.floor(Number(args.mpCost) || 0));
  if (mpCost <= 0) return null;
  const currentMp = Math.max(0, Math.floor(Number(args.currentMp) || 0));
  return {
    mpCost,
    affordable: currentMp >= mpCost,
  };
}
