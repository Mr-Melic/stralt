import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ENEMY_REGISTER_FOOTER_NOTE,
  ENEMY_REGISTER_HONESTY,
  ENEMY_REGISTER_SUBTITLE,
  ENEMY_REGISTER_TITLE,
} from "./enemyRegisterCopy.ts";

describe("enemyRegisterCopy", () => {
  it("titles the panel Enemy Register, not a live bestiary", () => {
    assert.equal(ENEMY_REGISTER_TITLE, "ENEMY REGISTER");
    assert.equal(/bestiary/i.test(ENEMY_REGISTER_TITLE), false);
    assert.equal(/bestiary/i.test(ENEMY_REGISTER_SUBTITLE), false);
    assert.match(ENEMY_REGISTER_SUBTITLE, /flavor/i);
  });

  it("says entries are flavor, not the current spawn roster", () => {
    assert.match(ENEMY_REGISTER_HONESTY, /flavor/i);
    assert.match(ENEMY_REGISTER_HONESTY, /not the live spawn roster/i);
    assert.match(ENEMY_REGISTER_HONESTY, /inspect/i);
    assert.equal(
      /bestiary of the current build/i.test(ENEMY_REGISTER_HONESTY),
      false,
    );
    assert.match(ENEMY_REGISTER_FOOTER_NOTE, /flavor/i);
    assert.match(ENEMY_REGISTER_FOOTER_NOTE, /not live/i);
  });
});
