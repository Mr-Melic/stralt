import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  LEAVE_REALM_ARIA,
  LEAVE_REALM_LABEL,
  LEAVE_REALM_TITLE,
} from "./leaveRealmCopy.ts";

describe("leave-realm display copy", () => {
  it("names the next stop as champion slots, not a SaaS account switcher", () => {
    assert.equal(LEAVE_REALM_LABEL, "Champions");
    assert.match(LEAVE_REALM_TITLE, /champion slots/i);
    assert.match(LEAVE_REALM_TITLE, /already saved/i);
    assert.match(LEAVE_REALM_ARIA, /Leave the realm/i);
    assert.equal(/dashboard|account/i.test(LEAVE_REALM_LABEL), false);
  });
});
