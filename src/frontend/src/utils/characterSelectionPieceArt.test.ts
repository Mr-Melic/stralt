import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

function readRelative(relativeFromUtils: string): string {
  return readFileSync(
    fileURLToPath(new URL(relativeFromUtils, import.meta.url)),
    "utf8",
  );
}

describe("character-selection pieceArt (PERF-2026-10-23-168)", () => {
  it("imports chessPiecePatterns from pieceArt instead of inlining a lobby copy", () => {
    const src = readRelative("../components/CharacterSelection.tsx");
    assert.match(src, /from ["']\.\.\/data\/pieceArt["']/);
    assert.match(src, /chessPiecePatterns/);
    assert.equal(
      /const CHESS_PIECE_PATTERNS/.test(src),
      false,
      "do not restore a second lobby table",
    );
  });

  it("keeps the six chess pieces and four views in the shared catalog", () => {
    const art = readRelative("../data/pieceArt.ts");
    assert.match(art, /export const chessPiecePatterns/);
    for (const piece of ["king", "queen", "pawn", "rook", "bishop", "knight"]) {
      assert.match(art, new RegExp(`${piece}:\\s*\\{`));
    }
    const kingBlock = art.slice(art.indexOf("king:"));
    for (const view of ["front", "right", "back", "left"]) {
      assert.match(kingBlock, new RegExp(`${view}:\\s*\\[`));
    }
  });

  it("falls back to king.front the same way CharacterPreview did", () => {
    const src = readRelative("../components/CharacterSelection.tsx");
    assert.match(src, /chessPiecePatterns\[pieceType\]\?\.\[view\]/);
    assert.match(src, /chessPiecePatterns\.king\.front/);
  });
});
