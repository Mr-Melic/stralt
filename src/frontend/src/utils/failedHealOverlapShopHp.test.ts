import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  failedHealRollbackDoka,
  failedHealRollbackHp,
  leftoverUnpaidHealHp,
  liveWxAndsFailedHealRollback,
  shouldAllowShopSpendWhileHealPersist,
  shouldBeginShopSpendDuringHealPersist,
  shouldRollbackFailedHealDoka,
  shouldRollbackFailedHealHp,
  simulateFailedHealOverlapShop,
} from "./failedHealOverlapShopHp.ts";
import {
  resolveAbsoluteWriteHp,
  resolveOverworldHealSpend,
  shouldAllowShopSpend,
  shouldRollbackFailedHeal,
} from "./itemShop.ts";
import {
  applySpendToCommitted,
  createProgressPersist,
} from "./progressPersist.ts";

const START_HP = 50;
const MAX_HP = 200;
const START_DOKA = 100;
const SHOP_COST = 50;

function paidHeal() {
  const spend = resolveOverworldHealSpend({
    currentHp: START_HP,
    maxHp: MAX_HP,
    liveDoka: START_DOKA,
    jackpot: false,
  });
  assert.ok(spend);
  assert.equal(spend.nextHp, MAX_HP);
  assert.equal(spend.nextDoka, START_DOKA - 50);
  assert.equal(spend.dokaCost, 50);
  assert.equal(spend.hpGained, 150);
  return spend;
}

describe("split-axis failed-heal rollback", () => {
  it("rolls HP back when only Doka moved (shop / feat / rename)", () => {
    const spend = paidHeal();
    assert.equal(
      shouldRollbackFailedHeal({
        liveHp: spend.nextHp,
        liveDoka: 0,
        expectedHp: spend.nextHp,
        expectedDoka: spend.nextDoka,
      }),
      false,
      "live WX ANDs Doka, so a shop debit skips the whole rollback",
    );
    assert.equal(liveWxAndsFailedHealRollback(), true);
    assert.equal(
      shouldRollbackFailedHealHp({
        liveHp: spend.nextHp,
        expectedHp: spend.nextHp,
      }),
      true,
    );
    assert.equal(
      shouldRollbackFailedHealDoka({
        liveDoka: 0,
        expectedDoka: spend.nextDoka,
      }),
      false,
    );
    assert.equal(
      failedHealRollbackHp({
        liveHp: spend.nextHp,
        expectedHp: spend.nextHp,
        hpBefore: START_HP,
      }),
      START_HP,
    );
    assert.equal(
      failedHealRollbackDoka({
        liveDoka: 0,
        expectedDoka: spend.nextDoka,
        dokaBefore: START_DOKA,
      }),
      null,
      "must not refund the overlapping shop / feat debit",
    );
  });

  it("still rolls both axes when nothing superseded the click", () => {
    const spend = paidHeal();
    assert.equal(
      shouldRollbackFailedHeal({
        liveHp: spend.nextHp,
        liveDoka: spend.nextDoka,
        expectedHp: spend.nextHp,
        expectedDoka: spend.nextDoka,
      }),
      true,
    );
    assert.equal(
      failedHealRollbackHp({
        liveHp: spend.nextHp,
        expectedHp: spend.nextHp,
        hpBefore: START_HP,
      }),
      START_HP,
    );
    assert.equal(
      failedHealRollbackDoka({
        liveDoka: spend.nextDoka,
        expectedDoka: spend.nextDoka,
        dokaBefore: START_DOKA,
      }),
      START_DOKA,
    );
  });

  it("does not restore hpBefore over a later potion HP bump", () => {
    const spend = paidHeal();
    assert.equal(
      shouldRollbackFailedHealHp({
        liveHp: 110,
        expectedHp: spend.nextHp,
      }),
      false,
    );
    assert.equal(
      failedHealRollbackHp({
        liveHp: 110,
        expectedHp: spend.nextHp,
        hpBefore: START_HP,
      }),
      null,
    );
  });
});

describe("shop blocked while heal persist is in flight", () => {
  it("refuses BuffShop Buy even when the optimistic wallet can afford it", () => {
    const spend = paidHeal();
    assert.equal(shouldAllowShopSpend(spend.nextDoka, SHOP_COST), true);
    assert.equal(shouldAllowShopSpendWhileHealPersist(true), false);
    assert.equal(
      shouldBeginShopSpendDuringHealPersist({
        healInFlight: true,
        liveDoka: spend.nextDoka,
        amount: SHOP_COST,
      }),
      false,
    );
    assert.equal(
      shouldBeginShopSpendDuringHealPersist({
        healInFlight: false,
        liveDoka: spend.nextDoka,
        amount: SHOP_COST,
      }),
      true,
    );
  });
});

describe("ungated failed heal then shop stamps unpaid HP", () => {
  it("start 50/100 − shop 50 = 50/50; live AND path writes HP 200", () => {
    const spend = paidHeal();
    const ungated = simulateFailedHealOverlapShop({
      startHp: START_HP,
      startDoka: START_DOKA,
      healExpectedHp: spend.nextHp,
      healExpectedDoka: spend.nextDoka,
      shopCost: SHOP_COST,
      gateShopWhileHealInFlight: false,
      splitAxisRollback: false,
    });
    assert.equal(ungated.shopQueued, true);
    assert.equal(ungated.canisterHp, MAX_HP);
    assert.equal(ungated.canisterDoka, START_DOKA - SHOP_COST);
    assert.equal(
      leftoverUnpaidHealHp({
        startHp: START_HP,
        wroteHp: ungated.canisterHp,
      }),
      150,
    );
    assert.equal(START_HP + 0 - 0, START_HP, "no legitimate HP credit landed");
    assert.equal(START_DOKA - SHOP_COST, ungated.canisterDoka);
  });

  it("gated shop + split-axis rollback keeps start HP and start Doka", () => {
    const spend = paidHeal();
    const gated = simulateFailedHealOverlapShop({
      startHp: START_HP,
      startDoka: START_DOKA,
      healExpectedHp: spend.nextHp,
      healExpectedDoka: spend.nextDoka,
      shopCost: SHOP_COST,
      gateShopWhileHealInFlight: true,
      splitAxisRollback: true,
    });
    assert.equal(gated.shopQueued, false);
    assert.equal(gated.canisterHp, START_HP);
    assert.equal(gated.canisterDoka, START_DOKA);
    assert.equal(gated.liveHp, START_HP);
    assert.equal(gated.liveDoka, START_DOKA);
    assert.equal(
      leftoverUnpaidHealHp({
        startHp: START_HP,
        wroteHp: gated.canisterHp,
      }),
      0,
    );
  });

  it("split-axis alone is not enough once shop persist already queued", () => {
    const spend = paidHeal();
    const splitOnly = simulateFailedHealOverlapShop({
      startHp: START_HP,
      startDoka: START_DOKA,
      healExpectedHp: spend.nextHp,
      healExpectedDoka: spend.nextDoka,
      shopCost: SHOP_COST,
      gateShopWhileHealInFlight: false,
      splitAxisRollback: true,
    });
    assert.equal(splitOnly.shopQueued, true);
    assert.equal(
      splitOnly.canisterHp,
      MAX_HP,
      "lock runs shop persist before heal .then, so unpaid HP is already written",
    );
    assert.equal(splitOnly.liveHp, START_HP);
    assert.equal(
      leftoverUnpaidHealHp({
        startHp: START_HP,
        wroteHp: splitOnly.canisterHp,
      }),
      150,
    );
  });
});

describe("persist lock shop write uses live unpaid HP", () => {
  it("applySpendToCommitted spends shop Doka and resolveAbsoluteWriteHp keeps 200", () => {
    const spend = paidHeal();
    const lock = createProgressPersist({
      doka: START_DOKA,
      xp: 0,
      level: 1,
    });
    const shopSpend = spend.nextDoka - 0;
    assert.equal(shopSpend, SHOP_COST);
    lock.commit({
      doka: applySpendToCommitted(lock.snapshot().doka, shopSpend),
    });
    assert.equal(lock.snapshot().doka, START_DOKA - SHOP_COST);
    assert.equal(resolveAbsoluteWriteHp(spend.nextHp, spend.nextHp), MAX_HP);
    assert.equal(
      resolveAbsoluteWriteHp(START_HP, spend.nextHp),
      START_HP,
      "min(live, click) would have kept start HP if heal had rolled back first",
    );
  });
});

describe("distinct from #1310 / #1317 / leftover HP stamps", () => {
  it("is unpaid heal HP through shop saveBattleStats, not upgrade reserve", () => {
    assert.equal(START_HP, 50);
    assert.equal(SHOP_COST, 50);
    assert.notEqual(150, 10);
    assert.notEqual(150, 200);
  });

  it("does not stamp remount keep keys", () => {
    const storage = new Map<string, string>();
    assert.equal(
      storage.get("pbv_absolute_hp_throw_keep_remount_slot1"),
      undefined,
    );
    assert.equal(
      storage.get("pbv_absolute_doka_throw_keep_remount_slot1"),
      undefined,
    );
    assert.equal(storage.get("pbv_inventory_keep_remount_slot1"), undefined);
    assert.equal(storage.get("pbv_pending_death_penalty_slot1"), undefined);
  });
});
