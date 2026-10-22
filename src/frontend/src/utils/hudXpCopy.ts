/**
 * Live HUD leftover-XP chrome. Display only.
 *
 * WorldExploration’s top strip prints “XP” plus leftover/threshold numerals
 * (`characterStats.exp` / `expToNext`). Changelog and recap already say this
 * is leftover in the current level — the HUD label does not.
 *
 * This helper is locked, not wired — WorldExploration is owned by older
 * open PRs. Do not restore the dummy GameFlow 0/100 bar. Do not recolor
 * the Dofus leftover-XP fill (`--dofus-xp-color` hue 310).
 */

export const HUD_XP_LABEL = "XP";

export const HUD_XP_TITLE = "Leftover XP in this level — not a lifetime total";

export function hudXpReadout(current: number, toNext: number): string {
  const c = Number.isFinite(current) ? Math.max(0, Math.floor(current)) : 0;
  const n = Number.isFinite(toNext) && toNext > 0 ? Math.floor(toNext) : 1;
  return `${c}/${n}`;
}
