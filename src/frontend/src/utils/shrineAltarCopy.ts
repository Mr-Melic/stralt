/**
 * Dungeon-chain shrine altar chrome. Display only.
 *
 * On origin/main a dungeon-chain room rolls ~25% `isShrineRoom`. The altar
 * is the map-center tile (same cell as spawn keep-clear). There is no draw
 * pass, no HUD chip (`_isShrineRoom` / `_shrineCompleted` are unused), and
 * no toast: stepping the tile credits 300 Doka through persistDokaCreditResult.
 * A “pure path” covenant is written to localStorage and never read.
 *
 * This helper is locked, not wired — WorldExploration is owned by older
 * open PRs. Do not change the 300 Doka credit, spawn keep-clear, or
 * deathGuards when wiring.
 */

export const SHRINE_ALTAR_DOKA = 300;

export const SHRINE_ROOM_CHIP = "Shrine";

export const SHRINE_ROOM_HINT =
  "The center tile is an altar. Step it for 300 Doka.";

export function shrineAltarHover(doka: number = SHRINE_ALTAR_DOKA): string {
  const n = Number.isFinite(doka) && doka > 0 ? doka : SHRINE_ALTAR_DOKA;
  return `Altar — step here for ${n.toLocaleString()} Doka`;
}

export function shrineCreditToast(doka: number = SHRINE_ALTAR_DOKA): string {
  const n = Number.isFinite(doka) && doka > 0 ? doka : SHRINE_ALTAR_DOKA;
  return `+${n.toLocaleString()} Doka from the altar`;
}
