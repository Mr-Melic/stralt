import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { summonSpawnLog, summonSpawnUnitLabel } from "./summonSpawnCopy.ts";

const engineSource = readFileSync(
  fileURLToPath(new URL("../engine/spellEngine.ts", import.meta.url)),
  "utf8",
);

describe("summonSpawnCopy", () => {
  it("names the summoned unit, never a raw pieceType", () => {
    assert.equal(
      summonSpawnUnitLabel({ name: "Dire Wolf", pieceType: "wolf" }),
      "Dire Wolf",
    );
    assert.equal(summonSpawnUnitLabel({ pieceType: "wolf" }), "Dire Wolf");
    assert.equal(summonSpawnUnitLabel({ pieceType: "golem" }), "Sentinel");
    assert.equal(
      summonSpawnLog("Summon Dire Wolf", "Dire Wolf"),
      "Summon Dire Wolf summoned Dire Wolf!",
    );
    assert.equal(
      /wolf!/.test(summonSpawnLog("Summon Dire Wolf", "Dire Wolf")),
      false,
    );
    assert.equal(
      /pieceType/.test(summonSpawnLog("Summon Dire Wolf", "Dire Wolf")),
      false,
    );
  });

  it("is not wired — spellEngine still interpolates def.pieceType", () => {
    assert.match(engineSource, /summoned a \$\{def\.pieceType\}!/);
    assert.equal(engineSource.includes("summonSpawnCopy"), false);
  });
});
