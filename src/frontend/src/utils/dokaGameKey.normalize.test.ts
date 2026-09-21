import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  GAME_KEY_ALPHABET,
  GAME_KEY_LENGTH,
  normalizeGameKeyInput,
  validateGameKeyFormat,
} from "./dokaGameKey.ts";

describe("normalizeGameKeyInput", () => {
  it("strips spaces, tabs, and newlines so a pasted key still validates", () => {
    const valid = GAME_KEY_ALPHABET[0].repeat(GAME_KEY_LENGTH);
    assert.equal(normalizeGameKeyInput(` ${valid}\n`), valid);
    const wrapped = `${valid.slice(0, 60)}\n${valid.slice(60)}`;
    assert.equal(normalizeGameKeyInput(wrapped), valid);
    assert.equal(
      validateGameKeyFormat(normalizeGameKeyInput(`\t${valid} `)),
      null,
    );
  });

  it("does not invent characters or change a clean key", () => {
    const valid = GAME_KEY_ALPHABET[0].repeat(GAME_KEY_LENGTH);
    assert.equal(normalizeGameKeyInput(valid), valid);
    assert.equal(normalizeGameKeyInput(""), "");
  });
});
