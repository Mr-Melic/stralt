import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { phase2Log } from "./phase2Copy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("phase2Copy", () => {
  it("names the boss and never prints Stats boosted or ×N", () => {
    assert.equal(
      phase2Log("Static King", 1.5),
      "Static King enters phase 2 — stronger now.",
    );
    assert.equal(phase2Log(""), "The boss enters phase 2 — stronger now.");
    assert.equal(/Stats boosted/i.test(phase2Log("Static King", 2)), false);
    assert.equal(/×/.test(phase2Log("Static King", 1.3)), false);
    assert.equal(/1\.5/.test(phase2Log("Static King", 1.5)), false);
  });

  it("is not wired — WorldExploration still shouts Stats boosted ×N", () => {
    assert.match(worldSource, /PHASE 2! Stats boosted ×\$\{mult\}!/);
    assert.equal(worldSource.includes("phase2Copy"), false);
  });
});
