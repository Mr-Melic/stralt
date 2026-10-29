import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerMailtoDeadCopy,
  ownerMailtoHashLooksLiveOnMain,
  ownerMailtoHrefLooksLive,
} from "./adminOwnerUx.mailtoDead.ts";
import { gameKeyMailtoHref } from "./dokaGameKey.ts";

describe("ownerMailtoHrefLooksLive", () => {
  it("does not treat href # as a live compose action", () => {
    assert.equal(ownerMailtoHrefLooksLive("#"), false);
    assert.equal(ownerMailtoHrefLooksLive(""), false);
    assert.equal(ownerMailtoHrefLooksLive("mailto:"), false);
    assert.equal(
      ownerMailtoHrefLooksLive(
        gameKeyMailtoHref("ada@example.com", "A".repeat(120)),
      ),
      true,
    );
    assert.equal(
      ownerMailtoHrefLooksLive(
        gameKeyMailtoHref("ada@example.com?subject=x", "A".repeat(120)),
      ),
      false,
    );
  });
});

describe("ownerMailtoDeadCopy", () => {
  it("labels the dead control so it cannot be mistaken for Open mailto", () => {
    const copy = ownerMailtoDeadCopy();
    assert.equal(copy.enabled, false);
    assert.match(copy.label, /unavailable/i);
    assert.equal(/open mailto/i.test(copy.label), false);
    assert.match(copy.hint, /copy the GameKey/i);
    assert.equal(ownerMailtoHashLooksLiveOnMain(), true);
  });
});
