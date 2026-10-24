import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  COLOR_PALETTE_KEYS,
  characterColorsAreHexOnTheRecord,
  colorPaletteIsMandatoryGameplayDependency,
  combatDrawReadsColorPaletteLocalStorage,
  deletingColorPaletteCorruptsCharacter,
  versionGateKeepsColorPaletteKeys,
} from "./colorPaletteGameplayDependency.ts";

describe("colorPaletteGameplayDependency", () => {
  it("keeps admin palettes off the Character persist path", () => {
    assert.deepEqual(COLOR_PALETTE_KEYS, [
      "pbv_color_palette",
      "paperVertexPalette",
    ]);
    assert.equal(combatDrawReadsColorPaletteLocalStorage(), false);
    assert.equal(characterColorsAreHexOnTheRecord(), true);
    assert.equal(colorPaletteIsMandatoryGameplayDependency(), false);
    assert.equal(deletingColorPaletteCorruptsCharacter(), false);
    assert.equal(versionGateKeepsColorPaletteKeys(), false);
  });
});
