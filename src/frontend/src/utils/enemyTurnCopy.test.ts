import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  enemyEndsTurnLog,
  enemyHealsLog,
  enemyMovesLog,
  enemySkipLog,
  enemyUsesLog,
} from "./enemyTurnCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("enemyTurnCopy", () => {
  it("names the unit, never pieceType or intern skip tokens", () => {
    assert.equal(
      enemyHealsLog("Wraith Bishop", 12),
      "Wraith Bishop heals 12 HP.",
    );
    assert.equal(
      enemyUsesLog("Wraith Bishop", "Strike"),
      "Wraith Bishop uses Strike!",
    );
    assert.equal(
      enemyEndsTurnLog("Wraith Bishop"),
      "Wraith Bishop ends their turn.",
    );
    assert.equal(
      enemySkipLog("Wraith Bishop", "cooldown"),
      "Wraith Bishop holds.",
    );
    assert.equal(
      enemySkipLog("Wraith Bishop", "no-spell"),
      "Wraith Bishop holds.",
    );
    assert.equal(enemyMovesLog("Wraith Bishop"), "Wraith Bishop moves.");
    assert.equal(/pieceType/.test(enemyHealsLog("Wraith Bishop", 1)), false);
    assert.equal(
      /cooldown/.test(enemySkipLog("Wraith Bishop", "cooldown")),
      false,
    );
  });

  it("is not wired — WorldExploration still interpolates enemy.pieceType", () => {
    assert.match(worldSource, /\$\{enemy\.pieceType\} heals \$\{ha\} HP/);
    assert.match(worldSource, /\$\{enemy\.pieceType\} ends turn/);
    assert.match(worldSource, /skipped \(out of range\)/);
    assert.equal(worldSource.includes("enemyTurnCopy"), false);
  });
});
