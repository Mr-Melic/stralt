import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ZONE_LOCK_OFF_LABEL,
  ZONE_LOCK_ON_LABEL,
  ZONE_LOCK_TITLE,
  zoneLockBody,
  zoneLockChipAria,
} from "./zoneLockCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("zoneLockCopy", () => {
  it("names difficulty and lock without SaaS toggle words", () => {
    assert.equal(ZONE_LOCK_TITLE, "Zone Lock");
    assert.match(zoneLockChipAria(2, false), /Zone Tier 2/);
    assert.match(zoneLockChipAria(2, false), /lock to keep the next map/);
    assert.match(zoneLockChipAria(2, true), /locked/);
    assert.match(zoneLockBody(3), /Zone Tier 3/);
    assert.match(zoneLockBody(3), /difficulty/);
    assert.equal(ZONE_LOCK_ON_LABEL, "Locked");
    assert.equal(ZONE_LOCK_OFF_LABEL, "Unlocked");
    assert.equal(
      /ON|OFF/.test(ZONE_LOCK_ON_LABEL + ZONE_LOCK_OFF_LABEL),
      false,
    );
  });

  it("WorldExploration still always shows the Zone Tier chip", () => {
    assert.match(worldSource, /currentZoneTier > 0/);
    assert.match(worldSource, /Zone Tier \{currentZoneTier\}/);
    assert.match(worldSource, /aestralto_zone_locked/);
    assert.match(worldSource, /When locked, the next map stays at Zone Tier/);
  });
});
