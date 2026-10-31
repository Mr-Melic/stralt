import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { critCastLog } from "./critFormulaCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("critFormulaCopy", () => {
  it("names the hit and never prints the x2= intern formula", () => {
    assert.equal(
      critCastLog({
        attackerName: "Wraith Bishop",
        spellName: "Strike",
        damage: 24,
      }),
      "Critical hit! Wraith Bishop casts Strike for 24 damage.",
    );
    assert.equal(
      critCastLog({
        attackerName: "Wraith Bishop",
        spellName: "Strike",
        damage: 24,
        targetName: "Dire Wolf",
      }),
      "Critical hit! Wraith Bishop casts Strike on Dire Wolf for 24 damage.",
    );
    assert.equal(
      /x2=/.test(
        critCastLog({
          attackerName: "Wraith Bishop",
          spellName: "Strike",
          damage: 24,
        }),
      ),
      false,
    );
    assert.equal(
      /CRITICAL HIT!/.test(
        critCastLog({
          attackerName: "Wraith Bishop",
          spellName: "Strike",
          damage: 24,
        }),
      ),
      false,
    );
  });

  it("is not wired — WorldExploration still interpolates rawDmg x2= dmgAC", () => {
    assert.match(worldSource, /CRITICAL HIT! \$\{enemy\.pieceType\}/);
    assert.match(worldSource, /\$\{rawDmg\}x2=\$\{dmgAC\} dmg/);
    assert.equal(worldSource.includes("critFormulaCopy"), false);
  });
});
