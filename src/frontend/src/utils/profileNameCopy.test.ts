import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  CHAMPION_NAME_HINT,
  PROFILE_NAME_HINT,
  PROFILE_NAME_LABEL,
  PROFILE_SUBMIT_LABEL,
} from "./profileNameCopy.ts";

const profileSource = readFileSync(
  fileURLToPath(new URL("../components/ProfileSetup.tsx", import.meta.url)),
  "utf8",
);

describe("profileNameCopy", () => {
  it("does not claim the account name is shown on the board", () => {
    assert.equal(/shown on the board/i.test(PROFILE_NAME_HINT), false);
    assert.match(PROFILE_NAME_HINT, /chat/i);
    assert.match(PROFILE_NAME_HINT, /champion/i);
    assert.match(PROFILE_NAME_HINT, /Board|HUD/i);
  });

  it("separates account vs champion surfaces", () => {
    assert.match(PROFILE_NAME_LABEL, /account/i);
    assert.match(CHAMPION_NAME_HINT, /champion name/i);
    assert.match(CHAMPION_NAME_HINT, /HUD|Board/i);
    assert.match(CHAMPION_NAME_HINT, /chat/i);
    assert.match(PROFILE_SUBMIT_LABEL, /forge/i);
    assert.equal(/enter the realm/i.test(PROFILE_SUBMIT_LABEL), false);
  });

  it("is not wired — ProfileSetup still claims the account name is on the board", () => {
    assert.match(profileSource, /shown on the\s+board/);
    assert.match(profileSource, /Enter the Realm/);
    assert.equal(profileSource.includes("profileNameCopy"), false);
  });
});
