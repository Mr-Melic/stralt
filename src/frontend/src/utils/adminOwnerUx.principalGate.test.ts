import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerPrincipalConfirmOpensOnNonEmptyOnlyOnMain,
  ownerPrincipalParseError,
  ownerPrincipalParsedAfterConfirmOnMain,
  shouldOpenOwnerPrincipalConfirm,
} from "./adminOwnerUx.principalGate.ts";

describe("owner principal parse-before-confirm", () => {
  it("accepts a real IC principal and rejects empty / garbage before the dialog", () => {
    assert.equal(ownerPrincipalParseError("aaaaa-aa"), null);
    assert.equal(shouldOpenOwnerPrincipalConfirm("aaaaa-aa"), true);
    assert.equal(ownerPrincipalParseError(""), "Enter a principal ID");
    assert.equal(ownerPrincipalParseError("   "), "Enter a principal ID");
    assert.equal(
      ownerPrincipalParseError("not-a-principal"),
      "Principal ID is not valid",
    );
    assert.equal(shouldOpenOwnerPrincipalConfirm("not-a-principal"), false);
    assert.equal(shouldOpenOwnerPrincipalConfirm(""), false);
  });

  it("documents that main opens confirm on any non-empty string", () => {
    assert.equal(ownerPrincipalParsedAfterConfirmOnMain(), true);
    assert.equal(
      ownerPrincipalConfirmOpensOnNonEmptyOnlyOnMain({
        trimmedLength: "not-a-principal".length,
        parsedOk: false,
      }),
      true,
    );
    assert.equal(
      ownerPrincipalConfirmOpensOnNonEmptyOnlyOnMain({
        trimmedLength: "aaaaa-aa".length,
        parsedOk: true,
      }),
      false,
    );
  });
});
