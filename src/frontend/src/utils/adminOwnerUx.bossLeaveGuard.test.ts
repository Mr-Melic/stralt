import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerHasOpenEditorOmitsBossesOnMain,
  ownerLeaveGuardNeedsBossDraft,
} from "./adminOwnerUx.bossLeaveGuard.ts";

describe("ownerLeaveGuardNeedsBossDraft", () => {
  it("warns when a boss row is expanded even with no saved drafts", () => {
    assert.equal(ownerLeaveGuardNeedsBossDraft("pale_archbishop", []), true);
    assert.equal(ownerLeaveGuardNeedsBossDraft(null, []), false);
    assert.equal(ownerLeaveGuardNeedsBossDraft("", []), false);
    assert.equal(ownerHasOpenEditorOmitsBossesOnMain(), true);
  });

  it("warns when in-memory drafts exist after the row is collapsed", () => {
    assert.equal(
      ownerLeaveGuardNeedsBossDraft(null, ["pale_archbishop"]),
      true,
    );
    assert.equal(ownerLeaveGuardNeedsBossDraft(undefined, []), false);
  });
});
