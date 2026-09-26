/**
 * Character visual persist vs live draw.
 *
 * Motoko `Character.pixelPattern` is required Text. CharacterCreation writes
 * `JSON.stringify(chessPiecePatterns[selectedPiece])` (`CharacterCreation.tsx`
 * 273) — the catalog object, not the editor grid. WorldExploration live draw
 * uses `getPersistedPiecePattern(pieceType)` (portrait ~3719, RAF ~8289) and
 * never reads `character.pixelPattern`. Unknown/retired `pieceType` falls
 * back to `king.front` (SDEG-2026-09-01-006). Sprite URLs stay optional
 * (`adminDeletePlayerSpriteConfig` does not delete the Character).
 *
 * Catalog piece art changes therefore rewrite every old champion's look
 * without a migration. Stored JSON is not a gameplay dependency — keep it
 * that way. Do not make `spriteUrl` required.
 */

export const KNOWN_PIECE_TYPES = [
  "king",
  "queen",
  "pawn",
  "rook",
  "bishop",
  "knight",
] as const;

export function liveDrawReadsStoredPixelPattern(): boolean {
  return false;
}

export function liveDrawVisualPersistKey(): "pieceType" | "pixelPattern" {
  return "pieceType";
}

export function spriteUrlRequiredOnCharacter(): boolean {
  return false;
}

/** Mirrors getPersistedPiecePattern: unknown ids paint king.front. */
export function persistSafePieceFallback(
  pieceType: string,
  known: readonly string[] = KNOWN_PIECE_TYPES,
): "catalog" | "king.front" {
  return known.includes(pieceType) ? "catalog" : "king.front";
}
