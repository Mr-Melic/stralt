import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { windstormMissLog } from "./windstormMissCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("windstormMissCopy", () => {
  it("names the caster and matches the player miss sentence", () => {
    assert.equal(
      windstormMissLog("Wraith Bishop", "Strike"),
      "Paper Windstorm blows Wraith Bishop's Strike off course!",
    );
    assert.equal(
      /pieceType/.test(windstormMissLog("Wraith Bishop", "Strike")),
      false,
    );
    assert.equal(
      /missed!/.test(windstormMissLog("Wraith Bishop", "Strike")),
      false,
    );
  });

  it("is not wired — WorldExploration still interpolates enemy.pieceType", () => {
    assert.match(
      worldSource,
      /Paper Windstorm! \$\{enemy\.pieceType\}'s \$\{chosenSpell\.name\} missed!/,
    );
    assert.equal(worldSource.includes("windstormMissCopy"), false);
  });
});
