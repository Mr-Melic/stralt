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
 * Remaining MP after a legal walk, or `null` when the live wallet cannot pay.
 *
 * Mouse/touch execute used React `currentBattleMp`. AP already writes
 * `currentBattleApRef` in the same tick; MP only mirrored after paint.
 * A double-click (or touch + a second click outside the 400ms ghost window)
 * still saw the pre-walk snapshot, queued a second path, and applied
 * Thorned Ground twice. Frozen 6 MP / 3 tiles costs 6 — the second click
 * must read 0, not 6.
 */
export function remainingMpAfterBattleWalk(
  liveMp: number,
  pathLength: number,
  costPerTile: number,
): number | null {
  const mp = Math.max(0, Math.floor(Number(liveMp) || 0));
  if (!canAffordBattleWalk(mp, pathLength, costPerTile)) return null;
  return mp - battleWalkMpCost(pathLength, costPerTile);
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
