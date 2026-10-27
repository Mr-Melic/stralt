import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  OWNER_GAMEKEY_COPIED_TOAST,
  ownerGameKeyCopiedToast,
  ownerGameKeyCopiedToastOnMain,
  shouldRemindMarkEmailedAfterCopy,
} from "./adminOwnerUx.copyFollowup.ts";

describe("owner GameKey copy follow-up", () => {
  it("reminds the operator to mark emailed after copy", () => {
    assert.match(ownerGameKeyCopiedToast(), /Mark emailed/i);
    assert.match(OWNER_GAMEKEY_COPIED_TOAST, /wiped/i);
    assert.equal(shouldRemindMarkEmailedAfterCopy(), true);
  });

  it("documents that main toasts only GameKey copied", () => {
    assert.equal(ownerGameKeyCopiedToastOnMain(), "GameKey copied");
  });
});
