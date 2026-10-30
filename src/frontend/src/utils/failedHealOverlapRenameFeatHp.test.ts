import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  leftoverUnpaidHealHpAfterRenameFeat,
  liveWxAndsFailedHealRollbackForRenameFeat,
  restoreUnpaidHealDokaAfterOverlap,
  restoreUnpaidHealHpAfterOverlap,
  shopWhileHealGateBlocksRenameFeatOverlap,
  shouldRestoreUnpaidHealDokaAfterOverlap,
  shouldRestoreUnpaidHealHpAfterOverlap,
  simulateRenameFeatBeforeFailedHeal,
} from "./failedHealOverlapRenameFeatHp.ts";
import { shouldRollbackFailedHeal } from "./itemShop.ts";

describe("failed heal + rename/feat overlap unpaid HP", () => {
  it("live WX ANDs HP+Doka and shop-while-heal gate does not cover rename/feat", () => {
    assert.equal(liveWxAndsFailedHealRollbackForRenameFeat(), true);
    assert.equal(shopWhileHealGateBlocksRenameFeatOverlap(), false);
    assert.equal(
      shouldRollbackFailedHeal({
        liveHp: 200,
        liveDoka: 50,
        expectedHp: 200,
        expectedDoka: 150,
      }),
      false,
      "rename UI debit after heal optimistic skips the whole rollback",
    );
  });

  it("split-axis restores HP when only Doka moved", () => {
    assert.equal(
      shouldRestoreUnpaidHealHpAfterOverlap({
        liveHp: 200,
        expectedHp: 200,
      }),
      true,
    );
    assert.equal(
      restoreUnpaidHealHpAfterOverlap({
        liveHp: 200,
        expectedHp: 200,
        hpBefore: 50,
      }),
      50,
    );
    assert.equal(
      shouldRestoreUnpaidHealDokaAfterOverlap({
        liveDoka: 50,
        expectedDoka: 150,
      }),
      false,
    );
    assert.equal(
      restoreUnpaidHealDokaAfterOverlap({
        liveDoka: 50,
        expectedDoka: 150,
        dokaBefore: 200,
      }),
      null,
    );
  });

  it("rename-before-failed-heal then shop stamps unpaid +150 HP", () => {
    const ungated = simulateRenameFeatBeforeFailedHeal({
      startHp: 50,
      startDoka: 200,
      healExpectedHp: 200,
      healExpectedDoka: 150,
      overlap: "rename_debit",
      overlapAmount: 100,
      laterShopCost: 50,
      splitAxisRollback: false,
    });
    assert.equal(ungated.laterAbsoluteWrote, true);
    assert.equal(ungated.canisterHp, 200);
    assert.equal(ungated.liveHp, 200);
    assert.equal(
      leftoverUnpaidHealHpAfterRenameFeat({
        startHp: 50,
        wroteHp: ungated.canisterHp,
      }),
      150,
    );
    // Rename 100 + shop 50 from start 200 → canister Doka 50.
    assert.equal(ungated.canisterDoka, 50);
  });

  it("split-axis rollback prevents the later shop from minting heal HP", () => {
    const gated = simulateRenameFeatBeforeFailedHeal({
      startHp: 50,
      startDoka: 200,
      healExpectedHp: 200,
      healExpectedDoka: 150,
      overlap: "rename_debit",
      overlapAmount: 100,
      laterShopCost: 50,
      splitAxisRollback: true,
    });
    assert.equal(gated.laterAbsoluteWrote, true);
    assert.equal(gated.canisterHp, 50);
    assert.equal(gated.liveHp, 50);
    assert.equal(
      leftoverUnpaidHealHpAfterRenameFeat({
        startHp: 50,
        wroteHp: gated.canisterHp,
      }),
      0,
    );
    // Rename spend kept (Doka axis not restored); shop 50 → 50.
    assert.equal(gated.canisterDoka, 50);
  });

  it("upgrade debit axis matches rename", () => {
    const ungated = simulateRenameFeatBeforeFailedHeal({
      startHp: 50,
      startDoka: 200,
      healExpectedHp: 200,
      healExpectedDoka: 150,
      overlap: "upgrade_debit",
      overlapAmount: 10,
      laterShopCost: 50,
      splitAxisRollback: false,
    });
    assert.equal(ungated.canisterHp, 200);
    assert.equal(
      leftoverUnpaidHealHpAfterRenameFeat({
        startHp: 50,
        wroteHp: ungated.canisterHp,
      }),
      150,
    );
  });

  it("feat credit also skips AND rollback and later absolute write mints HP", () => {
    const ungated = simulateRenameFeatBeforeFailedHeal({
      startHp: 50,
      startDoka: 200,
      healExpectedHp: 200,
      healExpectedDoka: 150,
      overlap: "feat_credit",
      overlapAmount: 100,
      laterShopCost: 50,
      splitAxisRollback: false,
    });
    assert.equal(ungated.canisterHp, 200);
    assert.equal(
      leftoverUnpaidHealHpAfterRenameFeat({
        startHp: 50,
        wroteHp: ungated.canisterHp,
      }),
      150,
    );
    const gated = simulateRenameFeatBeforeFailedHeal({
      startHp: 50,
      startDoka: 200,
      healExpectedHp: 200,
      healExpectedDoka: 150,
      overlap: "feat_credit",
      overlapAmount: 100,
      laterShopCost: 50,
      splitAxisRollback: true,
    });
    assert.equal(gated.canisterHp, 50);
    assert.equal(gated.liveHp, 50);
  });

  it("without a later absolute write the unpaid HP stays local only", () => {
    const local = simulateRenameFeatBeforeFailedHeal({
      startHp: 50,
      startDoka: 200,
      healExpectedHp: 200,
      healExpectedDoka: 150,
      overlap: "rename_debit",
      overlapAmount: 100,
      laterShopCost: 0,
      splitAxisRollback: false,
    });
    assert.equal(local.laterAbsoluteWrote, false);
    assert.equal(local.canisterHp, 50);
    assert.equal(local.liveHp, 200);
  });
});
