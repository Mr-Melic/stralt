import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ICE_STEP_LOG } from "./iceHazardCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("iceHazardCopy", () => {
  it("names Frozen and the MP cut, not Slowed or a reject glyph", () => {
    assert.equal(
      ICE_STEP_LOG,
      "You stepped on ice — Frozen: -2 MP for 2 turns.",
    );
    assert.match(ICE_STEP_LOG, /Frozen/);
    assert.match(ICE_STEP_LOG, /-2 MP/);
    assert.equal(/Slowed/i.test(ICE_STEP_LOG), false);
    assert.equal(ICE_STEP_LOG.includes("❌"), false);
  });

  it("is not wired — WorldExploration still logs Slowed with a reject glyph", () => {
    assert.match(worldSource, /You stepped on ice! Slowed!/);
    assert.equal(worldSource.includes("iceHazardCopy"), false);
  });
});
