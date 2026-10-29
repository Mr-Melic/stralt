import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { chainBounceLog, chainBounceTargetLabel } from "./chainBounceCopy.ts";

const helpersSource = readFileSync(
  fileURLToPath(new URL("../engine/castHelpers.ts", import.meta.url)),
  "utf8",
);

describe("chainBounceCopy", () => {
  it("names the bounce target, never an intern id", () => {
    assert.equal(
      chainBounceTargetLabel({ id: "e-3", name: "Wraith Bishop" }),
      "Wraith Bishop",
    );
    assert.equal(chainBounceTargetLabel({ id: "e-3" }), "an enemy");
    assert.equal(
      chainBounceLog("Chain Lightning", "Wraith Bishop", 8),
      "Chain Lightning bounced to Wraith Bishop for 8 damage!",
    );
    assert.equal(
      chainBounceLog("Chain Lightning", "e-3", 8),
      "Chain Lightning bounced to an enemy for 8 damage!",
    );
    assert.equal(
      /e-\d/.test(chainBounceLog("Chain Lightning", "e-3", 8)),
      false,
    );
  });

  it("is not wired — castHelpers still interpolates bounceEnemy.id", () => {
    assert.match(
      helpersSource,
      /bounced to \$\{bounceEnemy\.id\} for \$\{bounceDmg\} damage!/,
    );
    assert.equal(helpersSource.includes("chainBounceCopy"), false);
  });
});
