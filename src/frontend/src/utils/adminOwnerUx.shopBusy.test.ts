import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createShopWalletLock,
  endShopWalletOp,
  shopWalletControlLabel,
  shopWalletOpBusyLabel,
  shouldBlockShopWalletControls,
  tryBeginShopWalletOp,
} from "./adminOwnerUx.shopBusy.ts";

describe("shop wallet busy lock", () => {
  it("rejects a second begin until end", () => {
    const lock = createShopWalletLock();
    assert.equal(shouldBlockShopWalletControls(lock), false);
    assert.equal(tryBeginShopWalletOp(lock, "grant"), true);
    assert.equal(shouldBlockShopWalletControls(lock), true);
    assert.equal(tryBeginShopWalletOp(lock, "grant"), false);
    assert.equal(tryBeginShopWalletOp(lock, "ban"), false);
    endShopWalletOp(lock);
    assert.equal(shouldBlockShopWalletControls(lock), false);
    assert.equal(tryBeginShopWalletOp(lock, "unban"), true);
  });

  it("blocks controls when the lock is in flight", () => {
    assert.equal(shouldBlockShopWalletControls(null), false);
    assert.equal(shouldBlockShopWalletControls(undefined), false);
    assert.equal(shouldBlockShopWalletControls({ current: null }), false);
    assert.equal(shouldBlockShopWalletControls({ current: "ban" }), true);
  });

  it("labels only the in-flight op as busy", () => {
    const lock = createShopWalletLock();
    tryBeginShopWalletOp(lock, "grant");
    assert.equal(
      shopWalletControlLabel({ op: "grant", lock, idle: "Grant" }),
      "Granting…",
    );
    assert.equal(
      shopWalletControlLabel({ op: "ban", lock, idle: "Ban" }),
      "Ban",
    );
    assert.equal(shopWalletOpBusyLabel("unban"), "Unbanning…");
  });
});
