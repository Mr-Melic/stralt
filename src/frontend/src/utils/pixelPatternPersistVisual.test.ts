import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  characterCreatePersistsCatalogPieceJson,
  combatDrawUsesStoredPixelPattern,
  deleteSpriteConfigDeletesCharacter,
  storedPixelPatternIsMandatoryGameplay,
  unknownPieceTypeFallsBackToKingFront,
} from "./pixelPatternPersistVisual.ts";

describe("pixelPatternPersistVisual", () => {
  it("keeps stored pixelPattern and sprite URLs off the combat persist path", () => {
    assert.equal(combatDrawUsesStoredPixelPattern(), false);
    assert.equal(characterCreatePersistsCatalogPieceJson(), true);
    assert.equal(storedPixelPatternIsMandatoryGameplay(), false);
    assert.equal(deleteSpriteConfigDeletesCharacter(), false);
    assert.equal(unknownPieceTypeFallsBackToKingFront(), true);
  });
});
