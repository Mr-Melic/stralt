import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { formatSummonDisplayName } from "./summonDisplayName.ts";

const wxSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("formatSummonDisplayName", () => {
  it("title-cases pieceType labels", () => {
    assert.equal(formatSummonDisplayName("knight"), "Knight");
    assert.equal(formatSummonDisplayName("blood_pawn"), "Blood Pawn");
    assert.equal(formatSummonDisplayName(""), "Summon");
  });

  it("is not wired — summon bar still receives raw pieceType", () => {
    assert.match(wxSource, /summonName=\{summon\.pieceType\}/);
    assert.equal(wxSource.includes("formatSummonDisplayName"), false);
  });
});
