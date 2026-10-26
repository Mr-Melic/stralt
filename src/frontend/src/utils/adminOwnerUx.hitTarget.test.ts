import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  OWNER_MIN_HIT_PX,
  ownerDashboardBtnMinHeightOnMain,
  ownerFieldMinHeightOnMain,
  ownerHitTargetMeetsMinimum,
  ownerListSearchMinHeightOnMain,
  ownerPurchasesControlMinHeightOnMain,
  ownerSidebarTabMinHeightOnMain,
} from "./adminOwnerUx.hitTarget.ts";

describe("owner 44px hit targets", () => {
  it("accepts 44px and above", () => {
    assert.equal(OWNER_MIN_HIT_PX, 44);
    assert.equal(ownerHitTargetMeetsMinimum(44), true);
    assert.equal(ownerHitTargetMeetsMinimum(48), true);
    assert.equal(ownerHitTargetMeetsMinimum(43), false);
    assert.equal(ownerHitTargetMeetsMinimum(Number.NaN), false);
  });

  it("documents dashboard vs Purchases on main", () => {
    assert.equal(ownerDashboardBtnMinHeightOnMain(), null);
    assert.equal(ownerFieldMinHeightOnMain(), null);
    assert.equal(ownerListSearchMinHeightOnMain(), null);
    assert.equal(ownerSidebarTabMinHeightOnMain(), null);
    assert.equal(
      ownerHitTargetMeetsMinimum(ownerPurchasesControlMinHeightOnMain()),
      true,
    );
  });
});
