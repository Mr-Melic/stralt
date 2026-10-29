import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { summonKitActorLabel, summonKitCastLog } from "./summonKitCastCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("summonKitCastCopy", () => {
  it("names the summon and the spell, never pieceType or a spell id", () => {
    assert.equal(
      summonKitActorLabel({ name: "Dire Wolf", assignedName: "wolf" }),
      "Dire Wolf",
    );
    assert.equal(
      summonKitCastLog("Dire Wolf", "Poison Arrow"),
      "Dire Wolf casts Poison Arrow.",
    );
    assert.equal(
      /pieceType/.test(summonKitCastLog("Dire Wolf", "Poison Arrow")),
      false,
    );
    assert.equal(
      /spell-/.test(summonKitCastLog("Dire Wolf", "Poison Arrow")),
      false,
    );
  });

  it("is not wired — WorldExploration still interpolates summon.pieceType", () => {
    assert.match(
      worldSource,
      /\$\{summon\.pieceType\} casts \$\{plan\.spell\.name \?\? plan\.spell\.id\}/,
    );
    assert.equal(worldSource.includes("summonKitCastCopy"), false);
  });
});
