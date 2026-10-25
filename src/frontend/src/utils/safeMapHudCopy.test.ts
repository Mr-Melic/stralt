import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  DEATH_REALM_HUD_CHIP,
  REST_AREA_HUD_CHIP,
  UNKNOWN_REGION_CHIP,
  safeMapHudChip,
} from "./safeMapHudCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("safeMapHudCopy", () => {
  it("Death Realm chip names the next step", () => {
    assert.equal(
      safeMapHudChip({ isDeathRealm: true, isRestMap: false }),
      DEATH_REALM_HUD_CHIP,
    );
    assert.match(DEATH_REALM_HUD_CHIP, /Death Realm/);
    assert.match(DEATH_REALM_HUD_CHIP, /portal/i);
  });

  it("Rest Area chip tells the player to pick an exit", () => {
    assert.equal(
      safeMapHudChip({ isDeathRealm: false, isRestMap: true }),
      REST_AREA_HUD_CHIP,
    );
    assert.match(REST_AREA_HUD_CHIP, /Rest Area/);
    assert.match(REST_AREA_HUD_CHIP, /exit/i);
  });

  it("falls back to Unknown region when the zone name is empty", () => {
    assert.equal(
      safeMapHudChip({ isDeathRealm: false, isRestMap: false, zoneName: "" }),
      UNKNOWN_REGION_CHIP,
    );
    assert.equal(
      safeMapHudChip({
        isDeathRealm: false,
        isRestMap: false,
        zoneName: "Crypt",
      }),
      "Crypt",
    );
  });

  it("is not wired — HUD still prints the raw zone name", () => {
    assert.match(worldSource, /currentMap\.levelZone\?\.name \?\? "Unknown"/);
    assert.equal(worldSource.includes("safeMapHudCopy"), false);
    assert.equal(worldSource.includes("DEATH_REALM_HUD_CHIP"), false);
  });
});
