import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldAllowShopSpend } from "./itemShop.ts";
import {
  applySpendToCommitted,
  createProgressPersist,
} from "./progressPersist.ts";
import { RENAME_DOKA_COST, beginRename } from "./renameCharacter.ts";
import {
  adjustReservedSpellUpgradeSpend,
  liveWalletAfterRenameReserve,
  liveWalletAfterUpgradeReserve,
  lockDokaAfterRenameReserve,
  lockDokaAfterUpgradeReserve,
  refundReservedRenameDoka,
  refundReservedSpellUpgradeSpend,
  reserveSpellUpgradeLiveSpend,
  shouldDisableRenameCancelWhileSaving,
  shouldReserveRenameDokaOnBegin,
} from "./upgradeRenameLiveSpendReserve.ts";

describe("upgrade live-wallet reserve", () => {
  it("maps summon advertised 100 onto the canister spend of 10", () => {
    assert.equal(reserveSpellUpgradeLiveSpend(100), 10);
    assert.equal(reserveSpellUpgradeLiveSpend(20), 20);
    assert.equal(adjustReservedSpellUpgradeSpend(10, 10), 0);
    assert.equal(adjustReservedSpellUpgradeSpend(10, 20), 10);
    assert.equal(adjustReservedSpellUpgradeSpend(20, 10), -10);
  });

  it("blocks overlapping shop after reserve so the unpaid upgrade cannot land", () => {
    // Defect without a click-time reserve: start 100, upgrade 10, shop 100.
    // UI still shows 100 so BuffShop clears; lock runs upgrade first then
    // applySpendToCommitted floors the 100 spend to the remaining 90 → 0.
    // Canister ends at 0 with both goods (need 110). Unpaid upgrade = 10.
    const unreservedLock = createProgressPersist({
      doka: 100,
      xp: 0,
      level: 1,
    });
    unreservedLock.commit({
      doka: lockDokaAfterUpgradeReserve(100, 10),
    });
    assert.equal(shouldAllowShopSpend(100, 100), true);
    assert.equal(applySpendToCommitted(unreservedLock.snapshot().doka, 100), 0);

    const live = liveWalletAfterUpgradeReserve(100, 10);
    assert.equal(live, 90);
    assert.equal(
      shouldAllowShopSpend(live, 100),
      false,
      "shop must not afford a 100 item while a 10 upgrade is reserved",
    );
    const lock = createProgressPersist({ doka: 100, xp: 0, level: 1 });
    lock.commit({ doka: lockDokaAfterUpgradeReserve(100, 10) });
    const shopSpend = shouldAllowShopSpend(live, 100) ? 100 : 0;
    assert.equal(shopSpend, 0);
    assert.equal(lock.snapshot().doka, 90);
    assert.equal(
      100 - reserveSpellUpgradeLiveSpend(10) - shopSpend,
      lock.snapshot().doka,
      "start 100 − upgrade 10 − shop 0 = 90",
    );
  });

  it("refunds a failed upgrade so a later shop spends from the start wallet", () => {
    const reserved = reserveSpellUpgradeLiveSpend(10);
    const live = liveWalletAfterUpgradeReserve(100, 10);
    assert.equal(refundReservedSpellUpgradeSpend(live, reserved), 100);
  });
});

describe("rename live-wallet reserve", () => {
  it("blocks Cancel+shop overspend while Saving", () => {
    const inFlight = { current: false };
    const began = beginRename(inFlight, 100);
    assert.equal(shouldReserveRenameDokaOnBegin(began), true);
    assert.equal(shouldDisableRenameCancelWhileSaving(true), true);
    assert.equal(shouldDisableRenameCancelWhileSaving(false), false);

    // Defect without a click-time reserve: start 100, rename 100, shop 100.
    // Cancel during Saving left the UI at 100; lock ran rename first then
    // applySpendToCommitted floored the shop spend — both goods for 100.
    const unreservedLock = createProgressPersist({
      doka: 100,
      xp: 0,
      level: 1,
    });
    unreservedLock.commit({
      doka: lockDokaAfterRenameReserve(unreservedLock.snapshot().doka),
    });
    assert.equal(shouldAllowShopSpend(100, 100), true);
    assert.equal(applySpendToCommitted(unreservedLock.snapshot().doka, 100), 0);

    const live = liveWalletAfterRenameReserve(100);
    assert.equal(live, 0);
    assert.equal(
      shouldAllowShopSpend(live, 100),
      false,
      "BuffShop 100-cost item must not clear while rename is reserved",
    );
    const lock = createProgressPersist({ doka: 100, xp: 0, level: 1 });
    lock.commit({ doka: lockDokaAfterRenameReserve(lock.snapshot().doka) });
    const shopSpend = shouldAllowShopSpend(live, 100) ? 100 : 0;
    assert.equal(shopSpend, 0);
    assert.equal(lock.snapshot().doka, 0);
    assert.equal(refundReservedRenameDoka(live), 100);
    assert.equal(RENAME_DOKA_COST, 100);
  });
});
