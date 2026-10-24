import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatSummonDisplayName } from "./summonDisplayName.ts";

describe("formatSummonDisplayName", () => {
  it("title-cases pieceType labels", () => {
    assert.equal(formatSummonDisplayName("knight"), "Knight");
    assert.equal(formatSummonDisplayName("blood_pawn"), "Blood Pawn");
    assert.equal(formatSummonDisplayName(""), "Summon");
  });
});
