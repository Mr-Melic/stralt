import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

function readComponent(relativeFromUtils: string): string {
  return readFileSync(
    fileURLToPath(new URL(relativeFromUtils, import.meta.url)),
    "utf8",
  );
}

describe("player-journey display copy", () => {
  it("explains champion name length on the forge form", () => {
    const src = readComponent("../components/CharacterCreation.tsx");
    assert.match(src, /data-ocid="character_creation\.name_hint"/);
    assert.match(src, /Up to 20 characters/);
    assert.match(src, /maxLength=\{20\}/);
  });

  it("announces profile save errors to assistive tech", () => {
    const src = readComponent("../components/ProfileSetup.tsx");
    assert.match(src, /data-ocid="profile_setup\.error_state"/);
    assert.match(src, /role="alert"/);
  });

  it("does not announce the landing admin camouflage as product version v1.0", () => {
    const src = readComponent("../components/LandingPage.tsx");
    assert.match(src, /data-ocid="landing\.admin_trigger"/);
    assert.match(src, /aria-label="Hidden admin trigger"/);
    assert.equal(/aria-label="v1\.0"/.test(src), false);
    assert.match(src, />\s*v1\.0\s*</);
  });

  it("titles the potion store Items, matching the GameFlow door", () => {
    const src = readComponent("../components/BuffShop.tsx");
    assert.match(src, /aria-label="Items"/);
    assert.match(src, /Close Items/);
    assert.equal(/Item Shop/.test(src), false);
  });

  it("tells the player summon upgrades cost 10× Doka", () => {
    const src = readComponent("../components/SpellbookModal.tsx");
    assert.match(src, /data-ocid="spellbook\.summon_upgrade_tax"/);
    assert.match(src, /10× the usual Doka/);
  });

  it("explains the challenge accept window and skip-bonus door", () => {
    const src = readComponent("../components/ChallengePanel.tsx");
    assert.match(src, /data-ocid="challenge\.accept_window_hint"/);
    assert.match(src, /offer ends on your first/);
    assert.match(src, /Skip bonus/);
  });
});
