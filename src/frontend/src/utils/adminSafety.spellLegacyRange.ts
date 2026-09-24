/**
 * Client mirror of AdminGuard.spellLegacyRangeRejected.
 * Backend enforcement is authoritative; this proves the failure path.
 *
 * Failure: Admin Range StatRow writes legacy `range` while Min/Max Range
 * writes `maxRange`. Player clicks use spellRangeBase → maxRange; enemy AI
 * uses Number(spell.range) from the backend catalog. range=10 with
 * maxRange=3 lets hostiles outrange the player. Shipped reflect_barrier is
 * range=1 / maxRange=0 (self buff) and must still re-save.
 */

export function spellLegacyRangeRejected(args: {
  range: number;
  maxRange: number;
}): string | null {
  const range = Number(args.range);
  const maxRange = Number(args.maxRange);
  if (!Number.isFinite(range) || !Number.isFinite(maxRange)) {
    return "range cannot exceed maxRange";
  }
  if (range > maxRange) {
    if (maxRange === 0 && range <= 1) return null;
    return "range cannot exceed maxRange";
  }
  return null;
}
