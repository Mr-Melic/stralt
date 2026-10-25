import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  characterStoresShopPackageId,
  lastShopPackageIsProtected,
  officialClientWritesPurchaseRecords,
  persistingPackageIdOnCharacterWouldBreakOldPlayers,
  purchaseRecordsKeepPackageIdAfterDelete,
  shopPackageDeleteIsHardRemove,
} from "./shopPackageHardDelete.ts";

describe("shopPackageHardDelete", () => {
  it("locks hard-delete vs purchaseRecords.packageId and no Character field", () => {
    assert.equal(shopPackageDeleteIsHardRemove(), true);
    assert.equal(lastShopPackageIsProtected(), true);
    assert.equal(purchaseRecordsKeepPackageIdAfterDelete(), true);
    assert.equal(characterStoresShopPackageId(), false);
    assert.equal(persistingPackageIdOnCharacterWouldBreakOldPlayers(), true);
    assert.equal(officialClientWritesPurchaseRecords(), false);
  });
});
