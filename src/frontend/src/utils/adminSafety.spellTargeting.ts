/**
 * Client mirror of AdminGuard.spellTargetingRejected.
 * Backend enforcement is authoritative; this proves the failure path.
 *
 * Failure: validateSpellConfig capped minRange/maxRange at 20 but left
 * legacy `range` (and hitTiles offsets) unbounded. Enemy AI uses
 * Number(spell.range) from the backend catalog, so a raw
 * adminSetSpellConfig(range=1_000_000) made hostiles map-wide.
 */

export const MAX_SPELL_TARGETING = 20;

export function spellTargetingRejected(args: {
  range: number;
  hitTiles?: readonly (readonly [number, number])[];
}): string | null {
  const range = Number(args.range);
  if (!Number.isFinite(range) || range < 0 || range > MAX_SPELL_TARGETING) {
    return "range must be at most 20";
  }
  for (const tile of args.hitTiles ?? []) {
    const dx = Number(tile[0]);
    const dy = Number(tile[1]);
    if (
      !Number.isFinite(dx) ||
      !Number.isFinite(dy) ||
      dx < -MAX_SPELL_TARGETING ||
      dx > MAX_SPELL_TARGETING ||
      dy < -MAX_SPELL_TARGETING ||
      dy > MAX_SPELL_TARGETING
    ) {
      return "hitTiles offsets must be between -20 and 20";
    }
  }
  return null;
}
