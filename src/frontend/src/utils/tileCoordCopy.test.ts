import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { tileCoordLabel } from "./tileCoordCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("tileCoordCopy", () => {
  it("names the value as a tile, not a bare pair", () => {
    assert.equal(tileCoordLabel(8, 8), "Tile (8, 8)");
    assert.match(tileCoordLabel(0, 14), /^Tile \(0, 14\)$/);
    assert.equal(/^📍/.test(tileCoordLabel(1, 1)), false);
  });

  it("is not wired — WorldExploration still prints a pin + raw pair", () => {
    assert.match(worldSource, /📍 \(/);
    assert.match(worldSource, /playerPositionRef\.current\.x/);
    assert.equal(worldSource.includes("tileCoordCopy"), false);
  });
});
