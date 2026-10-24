/**
 * Owner / admin color palettes live as a canister JSON Text plus two
 * localStorage keys (`pbv_color_palette`, legacy `paperVertexPalette`).
 * WorldExploration writes the canister blob on mount. Combat / portrait
 * draw never reads those keys — Character.colors are hex strings on the
 * record, and piece art uses `pieceType` → `getPersistedPiecePattern`.
 *
 * Deleting or deactivating a custom palette therefore cannot corrupt a
 * Character. Promoting the blob (or an uploaded sprite URL) to a mandatory
 * gameplay look would make yesterday / six-month / pre-palette cohorts
 * unloadable after a wipe or a schema change.
 *
 * Distinct from SDEG-2026-10-21-003 (stored pixelPattern JSON vs pieceType).
 * No schema. Palette keys are not in the version-gate keep-list.
 */

export const COLOR_PALETTE_KEYS = [
  "pbv_color_palette",
  "paperVertexPalette",
] as const;

export function combatDrawReadsColorPaletteLocalStorage(): boolean {
  return false;
}

export function characterColorsAreHexOnTheRecord(): boolean {
  return true;
}

export function colorPaletteIsMandatoryGameplayDependency(): boolean {
  return false;
}

export function deletingColorPaletteCorruptsCharacter(): boolean {
  return (
    colorPaletteIsMandatoryGameplayDependency() ||
    combatDrawReadsColorPaletteLocalStorage()
  );
}

export function versionGateKeepsColorPaletteKeys(): boolean {
  return false;
}
