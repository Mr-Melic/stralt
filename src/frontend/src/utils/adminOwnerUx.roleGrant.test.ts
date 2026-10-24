import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  OWNER_ROLE_GRANT_TOKEN,
  ownerRoleGrantButtonUnlockedOnMain,
  ownerRoleGrantConfirmBody,
  ownerRoleGrantConfirmTitle,
  ownerRoleGrantTokenMatches,
  shouldAssignOwnerRole,
  shouldEnableOwnerRoleGrantButton,
} from "./adminOwnerUx.roleGrant.ts";

describe("owner role grant confirm", () => {
  it("requires an exact TRANSFER token, not a case-folded match", () => {
    assert.equal(OWNER_ROLE_GRANT_TOKEN, "TRANSFER");
    assert.equal(ownerRoleGrantTokenMatches("TRANSFER"), true);
    assert.equal(ownerRoleGrantTokenMatches("transfer"), false);
    assert.equal(ownerRoleGrantTokenMatches(" TRANSFER "), false);
  });

  it("keeps the red button disabled until principal + token are ready", () => {
    assert.equal(
      shouldEnableOwnerRoleGrantButton({
        token: "",
        principal: "aaaaa-aa",
        pending: false,
      }),
      false,
    );
    assert.equal(
      shouldEnableOwnerRoleGrantButton({
        token: "TRANSFER",
        principal: "  ",
        pending: false,
      }),
      false,
    );
    assert.equal(
      shouldEnableOwnerRoleGrantButton({
        token: "TRANSFER",
        principal: "aaaaa-aa",
        pending: true,
      }),
      false,
    );
    assert.equal(
      shouldEnableOwnerRoleGrantButton({
        token: "TRANSFER",
        principal: "aaaaa-aa",
        pending: false,
      }),
      true,
    );
  });

  it("flags main's unlocked Transfer button and still requires a dialog", () => {
    assert.equal(
      ownerRoleGrantButtonUnlockedOnMain({
        tokenMatches: false,
        pending: false,
      }),
      true,
    );
    assert.equal(
      shouldAssignOwnerRole({
        token: "TRANSFER",
        principal: "aaaaa-aa",
        pending: false,
        dialogConfirmed: false,
      }),
      false,
    );
    assert.equal(
      shouldAssignOwnerRole({
        token: "TRANSFER",
        principal: "aaaaa-aa",
        pending: false,
        dialogConfirmed: true,
      }),
      true,
    );
  });

  it("keeps confirm copy from sounding like the caller loses admin", () => {
    assert.equal(
      ownerRoleGrantConfirmTitle("aaaaa-aa"),
      "Grant admin to aaaaa-aa?",
    );
    const body = ownerRoleGrantConfirmBody();
    assert.match(body, /unchanged/);
    assert.match(body, /Cancel does not write/);
    assert.equal(/only admin/i.test(body), true);
    assert.equal(/remove your/i.test(body), false);
  });
});
