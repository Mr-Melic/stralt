import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerPiiColumnsHiddenCopy,
  redactOwnerEmail,
  redactOwnerPrincipal,
} from "./adminOwnerUx.piiRedact.ts";

describe("owner PII redact", () => {
  it("keeps empty email / principal as a valid default", () => {
    assert.equal(redactOwnerEmail("", true), "");
    assert.equal(redactOwnerPrincipal(undefined, true), "");
    assert.equal(redactOwnerEmail("   ", false), "");
  });

  it("redacts email local-part and long principals without dropping the row", () => {
    assert.equal(redactOwnerEmail("ada@example.com", false), "ada@example.com");
    assert.equal(redactOwnerEmail("ada@example.com", true), "a•••@example.com");
    const principal = "aaaaa-bbbbb-ccccc-ddddd-cai";
    const redacted = redactOwnerPrincipal(principal, true);
    assert.equal(redacted.includes("bbbbb"), false);
    assert.match(redacted, /aaaaa…/);
    assert.match(ownerPiiColumnsHiddenCopy(true), /redacted/);
  });
});
