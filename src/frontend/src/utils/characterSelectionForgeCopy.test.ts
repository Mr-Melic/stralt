import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

function readComponent(relativeFromUtils: string): string {
  return readFileSync(
    fileURLToPath(new URL(relativeFromUtils, import.meta.url)),
    "utf8",
  );
}

describe("character-selection forge copy", () => {
  it("names empty-slot create as forging a champion", () => {
    const src = readComponent("../components/CharacterSelection.tsx");
    assert.match(src, /data-ocid="character_selection\.create_button"/);
    assert.match(src, /Forge a Champion/);
    assert.match(src, /aria-label="Forge a champion in this empty slot"/);
    assert.match(src, /Name a piece, pick colors, then Play from this slot/);
    assert.equal(/Create Character/.test(src), false);
  });

  it("asks the player to select a champion or forge a new one", () => {
    const src = readComponent("../components/CharacterSelection.tsx");
    assert.match(src, /Select a champion or forge a new one/);
  });

  it("explains delete as leaving the slot open for another forge", () => {
    const src = readComponent("../components/CharacterSelection.tsx");
    assert.match(src, /data-ocid="character_selection\.delete_copy"/);
    assert.match(src, /You can\s+forge another in its place/);
    assert.equal(/This action cannot be\s+undone/.test(src), false);
  });
});
