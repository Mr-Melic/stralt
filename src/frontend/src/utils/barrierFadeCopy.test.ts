import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { BARRIER_FADED_LOG } from "./barrierFadeCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("barrierFadeCopy", () => {
  it("does not print a tile key", () => {
    assert.equal(BARRIER_FADED_LOG, "A barrier faded from the field.");
    assert.equal(/\$\{/.test(BARRIER_FADED_LOG), false);
    assert.equal(/\d+,\d+/.test(BARRIER_FADED_LOG), false);
  });

  it("is not wired — WorldExploration still interpolates bKey", () => {
    assert.match(worldSource, /Barrier at \$\{bKey\} has faded/);
    assert.equal(worldSource.includes("barrierFadeCopy"), false);
  });
});
