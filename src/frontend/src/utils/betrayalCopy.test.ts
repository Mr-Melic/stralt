import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  betrayalLog,
  doubleBetrayalLog,
  leaderBetrayalLog,
} from "./betrayalCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("betrayalCopy", () => {
  it("names the units, never pieceType or DOUBLE BETRAYAL shout", () => {
    assert.equal(
      betrayalLog("Fetid Rook", "Wraith Bishop"),
      "Fetid Rook turns on Wraith Bishop! Betrayal!",
    );
    assert.equal(
      leaderBetrayalLog("Wraith Bishop"),
      "The pack's leader Wraith Bishop fell to betrayal.",
    );
    assert.equal(
      doubleBetrayalLog("Ash Knight"),
      "Another betrayal — Ash Knight turns as well!",
    );
    assert.equal(
      /DOUBLE BETRAYAL/.test(doubleBetrayalLog("Ash Knight")),
      false,
    );
    assert.equal(/pieceType/.test(betrayalLog("Fetid Rook", "pawn")), false);
  });

  it("is not wired — WorldExploration still interpolates pieceType", () => {
    assert.match(
      worldSource,
      /\$\{enemy\.pieceType\} turns on \$\{allyT\.pieceType\}! Betrayal!/,
    );
    assert.match(
      worldSource,
      /DOUBLE BETRAYAL! \$\{sb\.pieceType\} also turns!/,
    );
    assert.equal(worldSource.includes("betrayalCopy"), false);
  });
});
