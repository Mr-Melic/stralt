/**
 * EnemyList Delete confirm (`AdminDashboard.tsx` ~2278) says the live
 * template is removed and "Players can encounter it until you recreate
 * it." That sentence is inverted, and the Enemies CatalogNote already
 * says overworld spawn does not read getEnemyConfigs.
 *
 * Unique 2026-10-29 file — do not merge into adminOwnerUx.spellDeleteCopy.ts
 * (#1223) or restack EnemyList (#341 / #413). Not wired (stack).
 */

export function ownerEnemyDeleteConfirmBody(): string {
  return "This removes the catalog spawn-template row only. Overworld encounters still use player-relative tiers and chess-piece pixels — they do not read getEnemyConfigs. Empty sprite URL is a valid Default Pixel Visual, not an error. This cannot be undone in the catalog.";
}

export function ownerEnemyDeleteConfirmLooksLiveOnMain(): true {
  return true;
}
