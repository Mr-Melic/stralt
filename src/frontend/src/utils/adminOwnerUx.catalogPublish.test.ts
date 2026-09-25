import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  LIVE_CATALOG_PUBLISH_NOTE,
  LIVE_CATALOG_PUBLISH_SPELL_LIST_NOTE,
} from "./adminOwnerUx.catalogPublish.ts";

describe("LIVE_CATALOG_PUBLISH_NOTE", () => {
  it("says Save is live and not a draft", () => {
    assert.match(LIVE_CATALOG_PUBLISH_NOTE, /live canister catalog/i);
    assert.match(LIVE_CATALOG_PUBLISH_NOTE, /not a draft/i);
  });
});

describe("LIVE_CATALOG_PUBLISH_SPELL_LIST_NOTE", () => {
  it("points operators at summon controls instead of claiming they are missing", () => {
    assert.match(LIVE_CATALOG_PUBLISH_SPELL_LIST_NOTE, /summon/i);
    assert.doesNotMatch(
      LIVE_CATALOG_PUBLISH_SPELL_LIST_NOTE,
      /no summon controls/i,
    );
  });
});
