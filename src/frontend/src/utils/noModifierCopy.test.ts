import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  CLEAR_AREA_LOG,
  NO_MODIFIER_LOG,
  noModifierLog,
} from "./noModifierCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("noModifierCopy", () => {
  it("stays silent by default and never says No map modifier", () => {
    assert.equal(noModifierLog(), "");
    assert.equal(NO_MODIFIER_LOG, "");
    assert.equal(CLEAR_AREA_LOG, "This area is clear of map effects.");
    assert.equal(/No map modifier/i.test(noModifierLog()), false);
    assert.equal(/this area/i.test(noModifierLog()), false);
  });

  it("is not wired — WorldExploration still logs No map modifier this area", () => {
    assert.match(worldSource, /No map modifier this area\./);
    assert.equal(worldSource.includes("noModifierCopy"), false);
  });
});
