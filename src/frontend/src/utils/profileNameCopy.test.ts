import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CHAMPION_NAME_HINT,
  PROFILE_NAME_HINT,
  PROFILE_NAME_LABEL,
  PROFILE_SUBMIT_LABEL,
} from "./profileNameCopy.ts";

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
});
