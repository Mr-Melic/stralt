/**
 * Death Realm / Rest Area HUD chips. Display only — not wired into
 * WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-DEATH-REALM-NEXT-CHIP: the region chip can read “Death Realm” with no
 * next step. Distinct from UX-PORTAL-LEGEND (canvas labels) and
 * UX-DEATH-REALM-WAIT-BEAT (the 1.5s lava wait).
 * UX-REST-AREA-NEXT-CHIP: Rest Area has three unlabeled exits; the chip
 * never says to pick one.
 */

export const DEATH_REALM_HUD_CHIP = "Death Realm — walk to a portal";

export const REST_AREA_HUD_CHIP = "Rest Area — pick an exit";

export const UNKNOWN_REGION_CHIP = "Unknown region";

/** Region chip on the live HUD. */
export function safeMapHudChip(opts: {
  isDeathRealm: boolean;
  isRestMap: boolean;
  zoneName?: string | null;
}): string {
  if (opts.isDeathRealm) return DEATH_REALM_HUD_CHIP;
  if (opts.isRestMap) return REST_AREA_HUD_CHIP;
  const name = String(opts.zoneName ?? "").trim();
  return name.length > 0 ? name : UNKNOWN_REGION_CHIP;
}
