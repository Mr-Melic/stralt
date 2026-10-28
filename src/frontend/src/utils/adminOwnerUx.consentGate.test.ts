import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerConsentStatusCopy,
  ownerMailtoHrefWhenConsentMissing,
  shouldEnableOwnerMailto,
} from "./adminOwnerUx.consentGate.ts";

describe("ownerConsentStatusCopy", () => {
  it("treats missing consent as a warning, not an empty-valid default", () => {
    assert.deepEqual(ownerConsentStatusCopy(true), {
      label: "Email consent given",
      tone: "ok",
    });
    const missing = ownerConsentStatusCopy(false);
    assert.equal(missing.tone, "warn");
    assert.match(missing.label, /do not mail/i);
  });
});

describe("shouldEnableOwnerMailto", () => {
  it("blocks mailto when the player did not consent", () => {
    const blocked = shouldEnableOwnerMailto({
      emailConsent: false,
      email: "ada@example.com",
    });
    assert.equal("err" in blocked, true);
    if ("err" in blocked) {
      assert.match(blocked.err, /did not consent/i);
    }
    assert.equal(ownerMailtoHrefWhenConsentMissing(), "#");
  });

  it("still rejects a consented but unsafe address", () => {
    const blocked = shouldEnableOwnerMailto({
      emailConsent: true,
      email: "ada@example.com?subject=x",
    });
    assert.equal("err" in blocked, true);
  });

  it("allows mailto only with consent and a valid address", () => {
    assert.deepEqual(
      shouldEnableOwnerMailto({
        emailConsent: true,
        email: "ada@example.com",
      }),
      { ok: true },
    );
  });
});
