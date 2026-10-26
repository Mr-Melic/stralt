import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerConfirmWriteAmount,
  ownerConfirmWritePrincipal,
  ownerGameKeyApproveIgnoresStoredAmountOnMain,
  ownerShopGrantResamplesLiveAmountOnMain,
  shouldBlockOwnerConfirmIfSnapshotDrift,
} from "./adminOwnerUx.confirmSnapshot.ts";

describe("owner confirm snapshot", () => {
  it("writes the amount and principal shown in the dialog", () => {
    assert.equal(ownerConfirmWriteAmount(500), 500);
    assert.equal(ownerConfirmWritePrincipal("  aaaaa-aa  "), "aaaaa-aa");
  });

  it("blocks confirm when live fields drifted from the title", () => {
    assert.equal(
      shouldBlockOwnerConfirmIfSnapshotDrift({
        dialogAmount: 500,
        liveAmount: 5000,
      }),
      true,
    );
    assert.equal(
      shouldBlockOwnerConfirmIfSnapshotDrift({
        dialogPrincipal: "aaaaa-aa",
        livePrincipal: "bbbbb-bb",
      }),
      true,
    );
    assert.equal(
      shouldBlockOwnerConfirmIfSnapshotDrift({
        dialogAmount: 500,
        liveAmount: 500,
        dialogPrincipal: "aaaaa-aa",
        livePrincipal: "aaaaa-aa",
      }),
      false,
    );
  });

  it("documents that main Grant/Approve resample live state", () => {
    assert.equal(ownerShopGrantResamplesLiveAmountOnMain(), true);
    assert.equal(ownerGameKeyApproveIgnoresStoredAmountOnMain(), true);
  });
});
