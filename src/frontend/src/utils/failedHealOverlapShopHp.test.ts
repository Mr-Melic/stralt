import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  FAILED_HEAL_OVERLAP_MAX_HP,
  FAILED_HEAL_OVERLAP_PRE_DOKA,
  FAILED_HEAL_OVERLAP_PRE_HP,
  FAILED_HEAL_OVERLAP_SHOP_COST,
  leftoverUnpaidHealHpAfterFailedPersistOverlapShop,
  liveWxAndsHealRollbackAxes,
  officialHealClickStillPaysFromLiveWallet,
  persistHealThenShopThroughHpGate,
  shouldAllowShopSpendWhileHealPersist,
  shouldRollbackFailedHealDoka,
  shouldRollbackFailedHealHp,
} from "./failedHealOverlapShopHp.ts";
import {
  resolveAbsoluteWriteHp,
  resolveOverworldHealSpend,
  shouldAllowShopSpend,
  shouldRollbackFailedHeal,
  shouldStartDokaHeal,
} from "./itemShop.ts";
import {
  applySpendToCommitted,
  createProgressPersist,
  spendFromUiBalance,
} from "./progressPersist.ts";

describe("shouldRollbackFailedHealHp / Doka", () => {
  it("rolls HP back when this click still owns HP even if Doka moved", () => {
    assert.equal(
      shouldRollbackFailedHealHp({ liveHp: 80, expectedHp: 80 }),
      true,
    );
    assert.equal(
      shouldRollbackFailedHealDoka({ liveDoka: 40, expectedDoka: 90 }),
      false,
    );
  });

  it("keeps a potion HP restore that moved live HP off this click", () => {
    assert.equal(
      shouldRollbackFailedHealHp({ liveHp: 110, expectedHp: 80 }),
      false,
    );
  });

  it("records that live WX ANDs both axes", () => {
    assert.equal(liveWxAndsHealRollbackAxes(), true);
    assert.equal(
      shouldRollbackFailedHeal({
        liveHp: 80,
        liveDoka: 40,
        expectedHp: 80,
        expectedDoka: 90,
      }),
      false,
    );
  });
});

describe("shouldAllowShopSpendWhileHealPersist", () => {
  it("blocks BuffShop while Heal saveBattleStats is in flight", () => {
    assert.equal(shouldAllowShopSpendWhileHealPersist(true), false);
    assert.equal(shouldAllowShopSpendWhileHealPersist(false), true);
  });
});

describe("ungated AND-rollback then overlapping shop", () => {
  it("leftover is unpaid HP on the canister after shop persist", () => {
    const spend = resolveOverworldHealSpend({
      currentHp: FAILED_HEAL_OVERLAP_PRE_HP,
      maxHp: FAILED_HEAL_OVERLAP_MAX_HP,
      liveDoka: FAILED_HEAL_OVERLAP_PRE_DOKA,
      jackpot: false,
    });
    assert.deepEqual(spend, {
      nextHp: 200,
      nextDoka: 50,
      hpGained: 150,
      dokaCost: 50,
      jackpot: false,
    });
    assert.equal(officialHealClickStillPaysFromLiveWallet(), true);
    assert.equal(
      shouldStartDokaHeal({
        currentHp: FAILED_HEAL_OVERLAP_PRE_HP,
        maxHp: FAILED_HEAL_OVERLAP_MAX_HP,
        liveDoka: FAILED_HEAL_OVERLAP_PRE_DOKA,
      }),
      true,
    );

    const lock = createProgressPersist({
      doka: FAILED_HEAL_OVERLAP_PRE_DOKA,
      xp: 0,
      level: 1,
    });
    const persistOk = false;
    const liveHp = spend!.nextHp;
    const liveDoka = spend!.nextDoka - FAILED_HEAL_OVERLAP_SHOP_COST;
    assert.equal(
      shouldAllowShopSpend(
        liveDoka + FAILED_HEAL_OVERLAP_SHOP_COST,
        FAILED_HEAL_OVERLAP_SHOP_COST,
      ),
      true,
    );
    assert.equal(
      shouldRollbackFailedHeal({
        liveHp,
        liveDoka,
        expectedHp: spend!.nextHp,
        expectedDoka: spend!.nextDoka,
      }),
      false,
      "AND-rollback skips because shop moved Doka",
    );
    const shopSpend = spendFromUiBalance(spend!.nextDoka, liveDoka);
    const wroteDoka = applySpendToCommitted(lock.snapshot().doka, shopSpend);
    const wroteHp = resolveAbsoluteWriteHp(liveHp, spend!.nextHp);
    assert.equal(wroteHp, 200);
    assert.equal(wroteDoka, 50);
    assert.equal(
      leftoverUnpaidHealHpAfterFailedPersistOverlapShop({
        persistOk,
        liveHp,
        liveDoka,
        expectedHp: spend!.nextHp,
        expectedDoka: spend!.nextDoka,
        shopWroteHp: wroteHp,
        preHp: FAILED_HEAL_OVERLAP_PRE_HP,
        ungatedAndRollback: liveWxAndsHealRollbackAxes(),
      }),
      true,
    );
    assert.equal(
      100 - 0 - shopSpend,
      wroteDoka,
      "start 100 − unpaid heal 0 − shop 50 = 50",
    );
    assert.equal(wroteHp - FAILED_HEAL_OVERLAP_PRE_HP, 150, "unpaid +150 HP");
  });

  it("gated path rolls HP back so shop persist writes the pre-heal strip", () => {
    const spend = resolveOverworldHealSpend({
      currentHp: FAILED_HEAL_OVERLAP_PRE_HP,
      maxHp: FAILED_HEAL_OVERLAP_MAX_HP,
      liveDoka: FAILED_HEAL_OVERLAP_PRE_DOKA,
      jackpot: false,
    });
    const liveHpAfterShop = spend!.nextHp;
    const liveDokaAfterShop = spend!.nextDoka - FAILED_HEAL_OVERLAP_SHOP_COST;
    assert.equal(
      shouldRollbackFailedHealHp({
        liveHp: liveHpAfterShop,
        expectedHp: spend!.nextHp,
      }),
      true,
    );
    const rolledHp = FAILED_HEAL_OVERLAP_PRE_HP;
    const wroteHp = resolveAbsoluteWriteHp(rolledHp, spend!.nextHp);
    assert.equal(wroteHp, FAILED_HEAL_OVERLAP_PRE_HP);
    const wroteDoka = applySpendToCommitted(
      FAILED_HEAL_OVERLAP_PRE_DOKA,
      FAILED_HEAL_OVERLAP_SHOP_COST,
    );
    assert.equal(wroteDoka, 50);
    assert.equal(liveDokaAfterShop, 0);
    assert.equal(
      leftoverUnpaidHealHpAfterFailedPersistOverlapShop({
        persistOk: false,
        liveHp: rolledHp,
        liveDoka: liveDokaAfterShop,
        expectedHp: spend!.nextHp,
        expectedDoka: spend!.nextDoka,
        shopWroteHp: wroteHp,
        preHp: FAILED_HEAL_OVERLAP_PRE_HP,
        ungatedAndRollback: false,
      }),
      false,
    );
  });
});

describe("persistHealThenShopThroughHpGate", () => {
  it("blocks shop while heal persist is in flight and rolls HP back on false", async () => {
    const liveHp = { current: 80 };
    const liveDoka = { current: 90 };
    const lock = createProgressPersist({
      doka: FAILED_HEAL_OVERLAP_PRE_DOKA,
      xp: 0,
      level: 1,
    });
    const result = await persistHealThenShopThroughHpGate({
      persistHeal: async () => false,
      persistShop: async (hp, doka) => {
        lock.commit({ doka });
        liveHp.current = hp;
        return true;
      },
      liveHp,
      liveDoka,
      healHp: 80,
      healDoka: 90,
      preHp: FAILED_HEAL_OVERLAP_PRE_HP,
      preDoka: FAILED_HEAL_OVERLAP_PRE_DOKA,
      shopCost: FAILED_HEAL_OVERLAP_SHOP_COST,
      healInFlight: true,
    });
    assert.equal(result.ok, false);
    assert.equal(result.wroteHp, FAILED_HEAL_OVERLAP_PRE_HP);
    assert.equal(result.wroteDoka, FAILED_HEAL_OVERLAP_PRE_DOKA);
    assert.equal(lock.snapshot().doka, FAILED_HEAL_OVERLAP_PRE_DOKA);
  });

  it("after a true heal persist, a later shop spends from the post-heal wallet", async () => {
    const liveHp = { current: 80 };
    const liveDoka = { current: 90 };
    const lock = createProgressPersist({
      doka: FAILED_HEAL_OVERLAP_PRE_DOKA,
      xp: 0,
      level: 1,
    });
    const result = await persistHealThenShopThroughHpGate({
      persistHeal: () =>
        lock.enqueue(async () => {
          lock.commit({ doka: 90 });
          return true;
        }),
      persistShop: (hp, doka) =>
        lock.enqueue(async () => {
          lock.commit({
            doka: applySpendToCommitted(lock.snapshot().doka, 50),
          });
          liveHp.current = hp;
          liveDoka.current = doka;
          return true;
        }),
      liveHp,
      liveDoka,
      healHp: 80,
      healDoka: 90,
      preHp: FAILED_HEAL_OVERLAP_PRE_HP,
      preDoka: FAILED_HEAL_OVERLAP_PRE_DOKA,
      shopCost: FAILED_HEAL_OVERLAP_SHOP_COST,
      healInFlight: false,
    });
    assert.equal(result.ok, true);
    assert.equal(lock.snapshot().doka, 40);
    assert.equal(result.wroteHp, 80);
  });

  it("does not unlock unpaid HP when persistHeal throws", async () => {
    const liveHp = { current: 80 };
    const liveDoka = { current: 90 };
    const result = await persistHealThenShopThroughHpGate({
      persistHeal: async () => {
        throw new Error("doka-spend save skipped: wallet not seeded");
      },
      persistShop: async () => true,
      liveHp,
      liveDoka,
      healHp: 80,
      healDoka: 90,
      preHp: FAILED_HEAL_OVERLAP_PRE_HP,
      preDoka: FAILED_HEAL_OVERLAP_PRE_DOKA,
      shopCost: FAILED_HEAL_OVERLAP_SHOP_COST,
      healInFlight: false,
    });
    assert.equal(result.ok, false);
    assert.equal(result.wroteHp, FAILED_HEAL_OVERLAP_PRE_HP);
  });
});

describe("distinct from upgrade/rename #1310 and jackpot feat #1317", () => {
  it("is unpaid HP, not a deferred-debit overspend or jackpot_heal 200", () => {
    const spend = resolveOverworldHealSpend({
      currentHp: FAILED_HEAL_OVERLAP_PRE_HP,
      maxHp: FAILED_HEAL_OVERLAP_MAX_HP,
      liveDoka: FAILED_HEAL_OVERLAP_PRE_DOKA,
      jackpot: false,
    });
    assert.equal(spend!.jackpot, false);
    assert.equal(spend!.hpGained, 150);
    assert.notEqual(spend!.dokaCost, 1);
  });

  it("does not stamp leftover-Doka / inventory / bar keep keys", () => {
    const storage = new Map<string, string>();
    assert.equal(
      storage.get("pbv_absolute_doka_throw_keep_remount_slot1"),
      undefined,
    );
    assert.equal(
      storage.get("pbv_absolute_hp_throw_keep_remount_slot1"),
      undefined,
    );
    assert.equal(storage.get("pbv_inventory_keep_remount_slot1"), undefined);
  });
});
