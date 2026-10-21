/**
 * Character.pixelPattern is a required Text blob (create/update size-capped
 * at 16_384). Official CharacterCreation writes JSON.stringify of the
 * catalog chessPiecePatterns[selectedPiece] — not the editor's randomized
 * grid. Combat portrait/RAF uses getPersistedPiecePattern(pieceType) and
 * ignores the blob. Unknown pieceType paints king.front.
 *
 * Owner-uploaded sprite URLs stay optional catalog fields;
 * adminDeletePlayerSpriteConfig does not delete the Character.
 *
 * Promoting the stored JSON (or a sprite URL) to a mandatory gameplay
 * look would make schema/format changes and deactivations load-breakers
 * for every cohort. Distinct from 09-26-003 (pieceType vs unused blob):
 * this locks the create payload as catalog JSON and the combat source as
 * pieceType. No schema.
 */

export function combatDrawUsesStoredPixelPattern(): boolean {
  return false;
}

export function characterCreatePersistsCatalogPieceJson(): boolean {
  return true;
}

export function storedPixelPatternIsMandatoryGameplay(): boolean {
  return false;
}

export function deleteSpriteConfigDeletesCharacter(): boolean {
  return false;
}

/** getPersistedPiecePattern unknown id → chessPiecePatterns.king.front. */
export function unknownPieceTypeFallsBackToKingFront(): boolean {
  return true;
}
