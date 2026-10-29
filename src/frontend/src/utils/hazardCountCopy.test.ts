import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { hazardCountLog, hazardKindList } from "./hazardCountCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("hazardCountCopy", () => {
  it("names lava / ice / spikes, never detected or a raw count", () => {
    assert.deepEqual(hazardKindList(["spikes", "lava", "lava", "ice"]), [
      "lava",
      "ice",
      "spikes",
    ]);
    assert.equal(
      hazardCountLog(["lava", "ice", "spikes"]),
      "This map has lava, ice, and spikes.",
    );
    assert.equal(hazardCountLog(["ice"]), "This map has ice. Watch your step.");
    assert.equal(/detected/i.test(hazardCountLog(["lava"])), false);
    assert.equal(/hazard tile/i.test(hazardCountLog(["lava"])), false);
  });

  it("is not wired — WorldExploration still says hazard tiles detected", () => {
    assert.match(
      worldSource,
      /hazard tile\$\{hazardMap\.size !== 1 \? "s" : ""\} detected on this map!/,
    );
    assert.equal(worldSource.includes("hazardCountCopy"), false);
  });
});
