/**
 * resolvePlayerCast heals and self-buffs only when
 * `gridPos === ctx.playerPosition`. Attack Nearest, the self live-gate, and
 * leftover-walk RAF already use `playerPositionRef` via
 * `setPlayerPositionSynced`, which writes the ref before React commits.
 *
 * `playerSpellContext` used to capture the React snapshot. A Blood Mend /
 * Rallying Cry clicked (or Attack Nearest'd) on the live tile then spent AP,
 * set `challengeHealUsed`, and restored 0 HP.
 *
 * Pass the live ref into the context at call time. Do not change heal math.
 */

export type PlayerCastTile = { x: number; y: number };

export function playerCastContextPosition(
  livePlayerPos: PlayerCastTile,
): PlayerCastTile {
  return {
    x: Math.round(Number(livePlayerPos?.x) || 0),
    y: Math.round(Number(livePlayerPos?.y) || 0),
  };
}

/** Same equality `resolvePlayerCast` uses for isPlayerTile. */
export function isPlayerCastTile(
  gridPos: PlayerCastTile,
  contextPlayerPos: PlayerCastTile,
): boolean {
  return gridPos.x === contextPlayerPos.x && gridPos.y === contextPlayerPos.y;
}

/**
 * Attack Nearest heal / live self-highlight target the live tile. The
 * resolver only heals when that tile matches the context origin.
 */
export function selfHealResolvesOnLiveTile(args: {
  livePlayerPos: PlayerCastTile;
  reactPlayerPos: PlayerCastTile;
  useLiveContext: boolean;
}): boolean {
  const clicked = playerCastContextPosition(args.livePlayerPos);
  const contextPos = args.useLiveContext
    ? playerCastContextPosition(args.livePlayerPos)
    : playerCastContextPosition(args.reactPlayerPos);
  return isPlayerCastTile(clicked, contextPos);
}
