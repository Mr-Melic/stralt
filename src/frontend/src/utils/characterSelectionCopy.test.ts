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

describe("character-selection display copy", () => {
  it("asks the player to choose a champion, not a leftover product nickname", () => {
    const src = readComponent("../components/CharacterSelection.tsx");
    assert.match(src, /Choose your champion/);
    assert.equal(/Paper Baby Vampire/.test(src), false);
  });

  it("labels leftover XP as this level on the slot card", () => {
    const src = readComponent("../components/CharacterSelection.tsx");
    assert.match(src, /data-ocid="character_selection\.xp_this_level"/);
    assert.match(src, /this level/);
    assert.match(src, /Leftover experience in this level/);
  });

  it("names Play as entering the realm", () => {
    const src = readComponent("../components/CharacterSelection.tsx");
    assert.match(src, /title="Enter the realm"/);
    assert.match(src, /aria-label="Play — enter the realm"/);
  });

  it("announces slot-load errors to assistive tech", () => {
    const src = readComponent("../components/CharacterSelection.tsx");
    assert.match(src, /data-ocid="character_selection\.error_state"/);
    assert.match(src, /role="alert"/);
  });
});
