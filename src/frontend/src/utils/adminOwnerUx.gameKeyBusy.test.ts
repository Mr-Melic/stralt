import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createGameKeyAdminLock,
  endGameKeyAdminOp,
  gameKeyAdminControlLabel,
  gameKeyAdminOpBusyLabel,
  shouldBlockGameKeyAdminControls,
  tryBeginGameKeyAdminOp,
} from "./adminOwnerUx.gameKeyBusy.ts";

describe("GameKey admin busy lock", () => {
  it("rejects a second begin until end", () => {
    const lock = createGameKeyAdminLock();
    assert.equal(shouldBlockGameKeyAdminControls(lock), false);
    assert.equal(tryBeginGameKeyAdminOp(lock, "approve"), true);
    assert.equal(shouldBlockGameKeyAdminControls(lock), true);
    assert.equal(tryBeginGameKeyAdminOp(lock, "approve"), false);
    assert.equal(tryBeginGameKeyAdminOp(lock, "reject"), false);
    endGameKeyAdminOp(lock);
    assert.equal(shouldBlockGameKeyAdminControls(lock), false);
    assert.equal(tryBeginGameKeyAdminOp(lock, "emailed"), true);
  });

  it("blocks controls when the lock is in flight", () => {
    assert.equal(shouldBlockGameKeyAdminControls(null), false);
    assert.equal(shouldBlockGameKeyAdminControls(undefined), false);
    assert.equal(shouldBlockGameKeyAdminControls({ current: null }), false);
    assert.equal(shouldBlockGameKeyAdminControls({ current: "reveal" }), true);
  });

  it("labels only the in-flight op as busy", () => {
    const lock = createGameKeyAdminLock();
    tryBeginGameKeyAdminOp(lock, "approve");
    assert.equal(
      gameKeyAdminControlLabel({ op: "approve", lock, idle: "Approve" }),
      "Approving…",
    );
    assert.equal(
      gameKeyAdminControlLabel({ op: "reject", lock, idle: "Reject" }),
      "Reject",
    );
    assert.equal(gameKeyAdminOpBusyLabel("emailed"), "Wiping…");
  });
});
