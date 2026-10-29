import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerRevealDestinationCopy,
  ownerRevealHidesDestinationOnMain,
} from "./adminOwnerUx.revealDest.ts";

describe("ownerRevealDestinationCopy", () => {
  it("shows the destination email so Copy is not anonymous", () => {
    const copy = ownerRevealDestinationCopy({
      email: "ada@example.com",
      emailConsent: true,
    });
    assert.match(copy.destination, /ada@example.com/);
    assert.equal(copy.missingEmail, false);
    assert.match(copy.consent, /given/i);
  });

  it("treats a missing address as a warning, not a valid mail-anyway default", () => {
    const copy = ownerRevealDestinationCopy({
      email: "  ",
      emailConsent: false,
    });
    assert.equal(copy.missingEmail, true);
    assert.match(copy.destination, /No destination email/i);
    assert.match(copy.consent, /copy only/i);
    assert.equal(/valid default/i.test(copy.destination), false);
    assert.equal(ownerRevealHidesDestinationOnMain(), true);
  });

  it("does not tell the operator to mail when consent is false", () => {
    const copy = ownerRevealDestinationCopy({
      email: "ada@example.com",
      emailConsent: false,
    });
    assert.match(copy.consent, /not given/i);
    assert.match(copy.consent, /copy only/i);
    assert.equal(/open mailto/i.test(copy.consent), false);
  });
});
