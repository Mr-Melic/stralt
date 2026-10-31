import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { enemyHazardLog } from "./enemyHazardCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("enemyHazardCopy", () => {
  it("names the unit, says Frozen on ice, never Slowed or pieceType", () => {
    assert.equal(
      enemyHazardLog("Wraith Bishop", "lava", 12),
      "Wraith Bishop walked on lava! -12 HP",
    );
    assert.equal(
      enemyHazardLog("Wraith Bishop", "ice"),
      "Wraith Bishop stepped on ice! Frozen!",
    );
    assert.equal(
      enemyHazardLog("Wraith Bishop", "spikes", 8),
      "Wraith Bishop hit spikes! -8 HP",
    );
    assert.equal(/Slowed/i.test(enemyHazardLog("Wraith Bishop", "ice")), false);
    assert.equal(
      /pieceType/.test(enemyHazardLog("Wraith Bishop", "lava", 1)),
      false,
    );
  });

  it("is not wired — WorldExploration still interpolates enemy.pieceType", () => {
    assert.match(worldSource, /\$\{enemy\.pieceType\} walked on lava!/);
    assert.match(worldSource, /\$\{enemy\.pieceType\} stepped on ice! Slowed!/);
    assert.match(worldSource, /\$\{enemy\.pieceType\} hit spikes!/);
    assert.equal(worldSource.includes("enemyHazardCopy"), false);
  });
});
