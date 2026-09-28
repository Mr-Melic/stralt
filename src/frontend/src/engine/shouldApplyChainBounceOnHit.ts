/**
 * Chain Lightning bounce lives in the per-target applyDamageToEnemy body.
 * Drain already heals once (`hitTarget === targetsToHit[0]`). Bounce did
 * not: starter-blast is `hitsMultiple` + `bounces: 2`, so every in-range
 * occupant retriggered two hops and stacked extra 50%/25% on top of the
 * full hitsMultiple hits.
 *
 * Gate hops to the occupant of the clicked tile (the advertised primary).
 * Do not use loop `isFirstTarget` — getAoETargets filter order is the
 * combatant array, not the click.
 */

export function shouldApplyChainBounceOnHit(opts: {
  bounceCount: unknown;
  hitId: unknown;
  hitX: unknown;
  hitY: unknown;
  clickX: unknown;
  clickY: unknown;
}): boolean {
  const n = Math.floor(Number(opts.bounceCount) || 0);
  if (n <= 0) return false;
  const hitId = typeof opts.hitId === "string" ? opts.hitId : "";
  if (!hitId || hitId === "__player__") return false;
  const hitX = Math.floor(Number(opts.hitX));
  const hitY = Math.floor(Number(opts.hitY));
  const clickX = Math.floor(Number(opts.clickX));
  const clickY = Math.floor(Number(opts.clickY));
  if (
    !Number.isFinite(hitX) ||
    !Number.isFinite(hitY) ||
    !Number.isFinite(clickX) ||
    !Number.isFinite(clickY)
  ) {
    return false;
  }
  return hitX === clickX && hitY === clickY;
}
