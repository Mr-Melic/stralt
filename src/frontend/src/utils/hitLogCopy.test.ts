import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  combatantLogName,
  enemyCastsOnYouLog,
  takesDamageLog,
} from "./hitLogCopy.ts";

const helpersSource = readFileSync(
  fileURLToPath(new URL("../engine/castHelpers.ts", import.meta.url)),
  "utf8",
);
const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("hitLogCopy", () => {
  it("prefers assigned name over pieceType", () => {
    assert.equal(
      combatantLogName({
        name: "Wraith Bishop",
        pieceType: "bishop",
      }),
      "Wraith Bishop",
    );
    assert.equal(
      combatantLogName({ assignedName: "Iron Golem", pieceType: "rook" }),
      "Iron Golem",
    );
    assert.equal(combatantLogName({ pieceType: "pawn" }), "pawn");
  });

  it("writes takes-damage and cast-on-you without requiring pieceType", () => {
    assert.equal(
      takesDamageLog("Wraith Bishop", 12, 40),
      "Wraith Bishop takes 12 damage (40 HP left)",
    );
    assert.equal(
      enemyCastsOnYouLog("Ember Knight", "Strike", 9),
      "Ember Knight casts Strike on you for 9 dmg",
    );
  });

  it("is not wired — hosts still interpolate pieceType", () => {
    assert.match(helpersSource, /hitTarget\.pieceType\} takes \$\{finalDmg\}/);
    assert.match(
      worldSource,
      /enemy\.pieceType\} casts \$\{chosenSpell\.name\} on you/,
    );
    assert.equal(helpersSource.includes("hitLogCopy"), false);
    assert.equal(worldSource.includes("hitLogCopy"), false);
  });
});
