import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerChangelogConfirmBody,
  ownerChangelogPublishGate,
  shouldRunOwnerChangelogPublish,
} from "./adminOwnerUx.changelogPublish.ts";

describe("owner changelog publish", () => {
  it("blocks empty version and does not treat a saved draft as live", () => {
    const gate = ownerChangelogPublishGate({ version: "", text: "notes" });
    assert.equal(gate.allow, false);
    assert.match(gate.reason ?? "", /version cannot be empty/);
    assert.equal(
      shouldRunOwnerChangelogPublish({
        version: "1.2.0",
        text: "notes",
        confirmed: false,
      }),
      false,
    );
  });

  it("allows a confirmed valid publish and labels it live", () => {
    const gate = ownerChangelogPublishGate({
      version: "1.2.0",
      text: "Hotfix",
    });
    assert.equal(gate.allow, true);
    assert.equal(
      shouldRunOwnerChangelogPublish({
        version: "1.2.0",
        text: "Hotfix",
        confirmed: true,
      }),
      true,
    );
    const body = ownerChangelogConfirmBody("1.2.0");
    assert.match(body, /1.2.0/);
    assert.match(body, /not a draft/i);
  });
});
