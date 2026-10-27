import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { statusDurationLog } from "./statusTickCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("statusTickCopy", () => {
  it("says left vs ended from remaining turns, not expired-every-tick", () => {
    assert.equal(
      statusDurationLog("Fury", 2, "+2", "ap"),
      "Fury: 2 turns left (+2 AP).",
    );
    assert.equal(
      statusDurationLog("Frozen", 1, "-2", "mp"),
      "Frozen: 1 turn left (-2 MP).",
    );
    assert.equal(
      statusDurationLog("Fury", 0, "+2", "ap"),
      "Fury ended (+2 AP).",
    );
    assert.equal(
      /expired/i.test(statusDurationLog("Fury", 2, "+2", "ap")),
      false,
    );
  });

  it("is not wired — WorldExploration still logs expired on every decrement", () => {
    assert.match(
      worldSource,
      /\$\{eff\.effectName \|\| "Effect"\} expired \(\$\{signedMag\}/,
    );
    assert.equal(worldSource.includes("statusTickCopy"), false);
  });
});
