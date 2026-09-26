import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  liveDrawReadsStoredPixelPattern,
  liveDrawVisualPersistKey,
  persistSafePieceFallback,
  spriteUrlRequiredOnCharacter,
} from "./pieceTypeVisualPersistEvolve.ts";

describe("pieceTypeVisualPersistEvolve", () => {
  it("treats pieceType as the live visual persist key and falls back for unknown ids", () => {
    assert.equal(liveDrawReadsStoredPixelPattern(), false);
    assert.equal(liveDrawVisualPersistKey(), "pieceType");
    assert.equal(spriteUrlRequiredOnCharacter(), false);
    assert.equal(persistSafePieceFallback("king"), "catalog");
    assert.equal(
      persistSafePieceFallback("retired_or_renamed_piece"),
      "king.front",
    );
  });
});
