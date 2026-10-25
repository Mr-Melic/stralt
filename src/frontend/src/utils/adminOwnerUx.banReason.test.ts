import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  OWNER_BAN_REASON_MAX,
  ownerBanReasonConfirmBody,
  ownerBanReasonError,
  ownerShopBanCollectsReasonOnMain,
  ownerShopBanMethodOnMain,
  shouldSubmitOwnerBan,
} from "./adminOwnerUx.banReason.ts";

describe("owner ban reason for audit", () => {
  it("requires a 1–200 character reason before the live ban", () => {
    assert.equal(
      ownerBanReasonError(""),
      "Ban reason is required for the audit log",
    );
    assert.equal(
      ownerBanReasonError("   "),
      "Ban reason is required for the audit log",
    );
    assert.equal(ownerBanReasonError("chargeback"), null);
    assert.equal(
      ownerBanReasonError("x".repeat(OWNER_BAN_REASON_MAX + 1)),
      "Ban reason exceeds 200 characters",
    );
    assert.equal(ownerBanReasonError("x".repeat(OWNER_BAN_REASON_MAX)), null);
  });

  it("still requires principal + ConfirmDialog on top of the reason", () => {
    const ready = {
      principalOk: true,
      reason: "chargeback",
      dialogConfirmed: true,
      pending: false,
    };
    assert.equal(shouldSubmitOwnerBan(ready), true);
    assert.equal(shouldSubmitOwnerBan({ ...ready, principalOk: false }), false);
    assert.equal(
      shouldSubmitOwnerBan({ ...ready, dialogConfirmed: false }),
      false,
    );
    assert.equal(shouldSubmitOwnerBan({ ...ready, pending: true }), false);
    assert.equal(shouldSubmitOwnerBan({ ...ready, reason: "" }), false);
  });

  it("documents that Shop Ban on main has no reason and uses adminBanAccount", () => {
    assert.equal(ownerShopBanCollectsReasonOnMain(), false);
    assert.equal(ownerShopBanMethodOnMain(), "adminBanAccount");
    const body = ownerBanReasonConfirmBody("chargeback");
    assert.match(body, /chargeback/);
    assert.match(body, /kept/);
    assert.match(body, /Cancel does not write/);
  });
});
