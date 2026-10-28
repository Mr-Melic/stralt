import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { DEFEAT_LOG, VICTORY_LOG } from "./defeatLogCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("defeatLogCopy", () => {
  it("names the Death Realm, not a return to the map", () => {
    assert.equal(VICTORY_LOG, "Victory! All enemies defeated.");
    assert.equal(DEFEAT_LOG, "Defeated — next you enter the Death Realm.");
    assert.equal(/Returning to map/i.test(DEFEAT_LOG), false);
  });

  it("is not wired — WorldExploration still logs Returning to map", () => {
    assert.match(worldSource, /Defeated! Returning to map\./);
    assert.equal(worldSource.includes("defeatLogCopy"), false);
  });
});
