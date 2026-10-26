import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  groundDokaCollectedLog,
  groundDokaSpottedLog,
} from "./groundDokaCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("groundDokaCopy", () => {
  it("spots coins without a debug tag", () => {
    assert.equal(
      groundDokaSpottedLog(1),
      "You notice a Doka coin on the ground.",
    );
    assert.equal(
      groundDokaSpottedLog(3),
      "You notice 3 Doka coins on the ground.",
    );
    assert.equal(/\[COLLECT\]/.test(groundDokaSpottedLog(2)), false);
  });

  it("collects a value without [COLLECT]", () => {
    assert.equal(
      groundDokaCollectedLog(12),
      "You found 12 Doka on the ground.",
    );
    assert.equal(/\[COLLECT\]/.test(groundDokaCollectedLog(4)), false);
  });

  it("is not wired — collect log still prefixes [COLLECT]", () => {
    assert.match(worldSource, /\[COLLECT\] You found/);
    assert.equal(worldSource.includes("groundDokaCopy"), false);
  });
});
