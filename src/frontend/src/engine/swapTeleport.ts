/**
 * Official Swap (`spell-swap`, `isSwap`) is a teleport between the caster's
 * live tile and the target. Range / LoS already use `playerPositionRef`.
 * The WorldExploration `swapPositions` callback used to close over React
 * `playerPosition`, which lags the first RAF walk step, and left the MP-walk
 * stepper running after MP hit 0 and the HUD flipped to attack.
 *
 * Do not edit the walk rAF loop here — bump `movementGen` the same way
 * `cleanupBattle` / `handleBossRushRoomClear` abort leftover steps.
 */

export type SwapTile = { x: number; y: number };

export function sameSwapTile(a: SwapTile, b: SwapTile): boolean {
  return a.x === b.x && a.y === b.y;
}

/**
 * Enemy dest is the caster's live tile (ref), not the walk-start snapshot
 * captured when `playerSpellContext` last rendered.
 */
export function resolveSwapTeleport(args: {
  livePlayerPos: SwapTile;
  targetPos: SwapTile;
}): { playerDest: SwapTile; enemyDest: SwapTile } {
  return {
    playerDest: { x: args.targetPos.x, y: args.targetPos.y },
    enemyDest: { x: args.livePlayerPos.x, y: args.livePlayerPos.y },
  };
}

/**
 * A leftover walk rAF still holds the pre-swap path. Applying that cell
 * after Swap is occupancy-unsound (player walks off the swapped tile;
 * enemy stays on the origin).
 */
export function leftoverWalkOverridesSwap(
  playerAfterSwap: SwapTile,
  leftoverPathCell: SwapTile,
): boolean {
  return !sameSwapTile(playerAfterSwap, leftoverPathCell);
}

/**
 * Always bump generation. A stale `isMoving` flag must not skip the abort.
 * Harmless when the player is already stationary.
 */
export function abortInFlightWalkAfterSwap(movementGen: number): {
  nextMovementGen: number;
  isMoving: false;
  movementPath: [];
  currentStepIndex: 0;
} {
  const gen = Math.max(0, Math.floor(Number(movementGen) || 0));
  return {
    nextMovementGen: gen + 1,
    isMoving: false,
    movementPath: [],
    currentStepIndex: 0,
  };
}
