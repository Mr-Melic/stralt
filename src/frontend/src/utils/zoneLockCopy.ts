/**
 * Zone Tier lock chrome. Display only.
 *
 * WorldExploration always paints a bottom-right “Zone Tier n” chip
 * (`currentZoneTier` starts at 1; the gate is `> 0`). The dialog does not
 * explain that Zone Tier is map difficulty, or why a player would lock it.
 *
 * This helper is locked, not wired — WorldExploration is in older open PRs
 * (#327 / #331 / #340 and later). Wire zoneLockChipAria / ZONE_LOCK_BODY after
 * those land. Do not change spawn or portal math.
 */

export const ZONE_LOCK_TITLE = "Zone Lock";

export function zoneLockChipAria(tier: number, locked: boolean): string {
  const n = Number.isFinite(tier) ? Math.max(0, Math.floor(tier)) : 0;
  return locked
    ? `Zone Tier ${n}, locked — next maps stay at this difficulty`
    : `Zone Tier ${n} — lock to keep the next map at this difficulty`;
}

export function zoneLockBody(tier: number): string {
  const n = Number.isFinite(tier) ? Math.max(0, Math.floor(tier)) : 0;
  return `Maps get harder as Zone Tier rises. Lock keeps the next portal at Zone Tier ${n} so you can keep exploring at this difficulty.`;
}

export const ZONE_LOCK_ON_LABEL = "Locked";
export const ZONE_LOCK_OFF_LABEL = "Unlocked";
