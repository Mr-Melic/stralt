import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  resistanceAbsorbedNote,
  spellDealtDamageLog,
} from "./dmgBreakdownCopy.ts";

const engineSource = readFileSync(
  fileURLToPath(new URL("../engine/spellEngine.ts", import.meta.url)),
  "utf8",
);

describe("dmgBreakdownCopy", () => {
  it("prints the final hit without an SP/SR/RES pipeline", () => {
    assert.equal(spellDealtDamageLog("Strike", 11), "Strike dealt 11 damage.");
    assert.equal(/sp \+/.test(spellDealtDamageLog("Strike", 11)), false);
    assert.equal(/base /.test(spellDealtDamageLog("Strike", 11)), false);
    assert.equal(resistanceAbsorbedNote(4), " Resistance absorbed 4.");
    assert.equal(resistanceAbsorbedNote(0), "");
  });

  it("is not wired — spellEngine still appends the breakdown string", () => {
    assert.match(
      engineSource,
      /\$\{spell\.name\} dealt \$\{finalDamage\} damage\. \$\{breakdown\}/,
    );
    assert.equal(engineSource.includes("dmgBreakdownCopy"), false);
  });
});
