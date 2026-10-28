import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  PACK_ERRATIC_LOG,
  unitErraticLog,
  wildCastLog,
} from "./leaderDiedCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("leaderDiedCopy", () => {
  it("names the pack and the unit, with no bracket tag or pieceType", () => {
    assert.equal(PACK_ERRATIC_LOG, "The pack scatters — their leader fell.");
    assert.equal(unitErraticLog("Wraith Bishop"), "Wraith Bishop acts wildly.");
    assert.equal(
      wildCastLog("Wraith Bishop", "Strike"),
      "Wraith Bishop wildly casts Strike!",
    );
    assert.equal(/\[Leader died\]/.test(PACK_ERRATIC_LOG), false);
    assert.equal(
      /\[Leader died\]/.test(unitErraticLog("Wraith Bishop")),
      false,
    );
  });

  it("is not wired — WorldExploration still prefixes [Leader died]", () => {
    assert.match(worldSource, /\[Leader died\] Enemies acting erratically!/);
    assert.match(
      worldSource,
      /\[Leader died\] \$\{enemy\.pieceType\} acts erratically!/,
    );
    assert.equal(worldSource.includes("leaderDiedCopy"), false);
  });
});
