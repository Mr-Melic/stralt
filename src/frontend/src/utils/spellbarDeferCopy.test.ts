import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  SPELLBAR_APPLIED_TOAST,
  SPELLBAR_QUEUE_TOAST,
} from "./spellbarDeferCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("spellbarDeferCopy", () => {
  it("names the spell bar on both toasts", () => {
    assert.equal(
      SPELLBAR_QUEUE_TOAST,
      "Spell bar changes apply after this fight.",
    );
    assert.equal(SPELLBAR_APPLIED_TOAST, "Spell bar changes applied.");
    assert.match(SPELLBAR_QUEUE_TOAST, /spell bar/i);
    assert.match(SPELLBAR_APPLIED_TOAST, /spell bar/i);
  });

  it("is not wired — WorldExploration still uses two different sentences", () => {
    assert.match(worldSource, /Changes will apply after battle/);
    assert.match(worldSource, /Spell bar changes applied after battle/);
    assert.equal(worldSource.includes("spellbarDeferCopy"), false);
  });
});
