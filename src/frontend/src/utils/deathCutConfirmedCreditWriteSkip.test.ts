import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { committedDokaAfterAchievementCredit } from "./achievementReward.ts";
import {
  flushPendingDeathPenaltyThroughDeathCutCredit,
  resolveCommittedDokaAfterDeathCutCredit,
  shouldSkipDeathCutConfirmedCreditWrite,
} from "./deathCutConfirmedCreditWriteSkip.ts";
import {
  type DeathPenaltyStorage,
  applyUnpaidDeathPenaltyToWrite,
  flushPendingDeathPenalty,
  readPendingDeathPenalty,
  writePendingDeathPenalty,
} from "./deathPenalty.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  clampAbsoluteProgressWrite,
  createProgressPersist,
  resolveCommittedDokaForAbsoluteWrite,
} from "./progressPersist.ts";
import { committedDokaAfterGameKeyRedeem } from "./shopPurchase.ts";

function memStorage(): DeathPenaltyStorage {
  const storage = new Map<string, string>();
  return {
    getItem: (k) => storage.get(k) ?? null,
    setItem: (k, v) => {
      storage.set(k, v);
    },
    removeItem: (k) => {
      storage.delete(k);
    },
  };
}

const UNPAID = {
  slot: 1,
  preXp: 100,
  preDoka: 200,
  afterXp: 80,
  afterDoka: 120,
};

function honourHealWrite(
  pending: typeof UNPAID,
  committedXp: number,
  dokaBase: number,
  spend: number,
): number {
  const spent = applySpendToCommitted(dokaBase, spend);
  const honoured = applyUnpaidDeathPenaltyToWrite(pending, committedXp, spent);
  return clampAbsoluteProgressWrite(honoured.doka, dokaBase);
}

describe("shouldSkipDeathCutConfirmedCreditWrite", () => {
  it("does not skip death-fail without a later credit (lock still 120)", () => {
    assert.equal(
      shouldSkipDeathCutConfirmedCreditWrite({
        liveDoka: 200,
        committedDoka: 120,
        pendingPreDoka: 200,
        pendingAfterDoka: 120,
      }),
      false,
    );
  });

  it("skips stale pre-death 200 after catch-cut then a confirmed credit", () => {
    assert.equal(
      shouldSkipDeathCutConfirmedCreditWrite({
        liveDoka: 200,
        committedDoka: 250,
        pendingPreDoka: 200,
        pendingAfterDoka: 120,
      }),
      true,
    );
  });

  it("allows a live rise past the unpaid pre-cut (kept credit)", () => {
    assert.equal(
      shouldSkipDeathCutConfirmedCreditWrite({
        liveDoka: 250,
        committedDoka: 250,
        pendingPreDoka: 200,
        pendingAfterDoka: 120,
      }),
      false,
    );
  });

  it("does not extra-skip keep-only (lock still at afterDoka)", () => {
    assert.equal(
      shouldSkipDeathCutConfirmedCreditWrite({
        liveDoka: 200,
        committedDoka: 120,
        pendingPreDoka: 200,
        pendingAfterDoka: 120,
      }),
      false,
      "#698 owns unconfirmed keep while lock stays 120",
    );
  });

  it("does not extra-skip when there is no unpaid pre-cut", () => {
    assert.equal(
      shouldSkipDeathCutConfirmedCreditWrite({
        liveDoka: 200,
        committedDoka: 250,
        pendingPreDoka: null,
        pendingAfterDoka: null,
      }),
      false,
    );
  });

  it("fail-closes when the later-credit lock cannot read live Doka", () => {
    assert.equal(
      shouldSkipDeathCutConfirmedCreditWrite({
        liveDoka: null,
        committedDoka: 250,
        pendingPreDoka: 200,
        pendingAfterDoka: 120,
      }),
      true,
    );
  });
});

describe("death-fail catch-commit then confirmed credit vs leftover absolute write", () => {
  it("leftover beforeEach flush writes 120 over canister 250 after a one-shot commit", async () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200.
    // 2. Death saveBattleStats rejects. Catch commits lock 120 / XP 80.
    //    Pending preDoka=200. Canister still 200.
    // 3. Ground Doka applyRewards +50 succeeds. Settle commit 250.
    //    Canister 250. Lock 250. Unconfirmed false.
    // 4. Recap heal leftover flush fetches stale 200 and writes 120.
    const leftover = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    leftover.commit({ doka: 120, xp: 80 });
    leftover.commit({ doka: 250 });
    assert.equal(leftover.hasUnconfirmedWalletCredit(), false);
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    let backendXp = 100;
    let backendDoka = 250;
    const flushed = await flushPendingDeathPenalty({
      storage,
      slot: 1,
      persist: leftover,
      fetchSnapshot: async () => ({ xp: 100, doka: 200 }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, true);
    assert.equal(backendDoka, 120, "stale pre-death flush wiped the 50 pickup");
    assert.equal(backendXp, 80);
    assert.equal(leftover.snapshot().doka, 120);
    assert.equal(readPendingDeathPenalty(storage, 1), null);
  });

  it("does not flush-wipe the confirmed pickup after a gated stale snapshot", async () => {
    const guarded = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    guarded.commit({ doka: 120, xp: 80 });
    guarded.commit({ doka: 250 });
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    let backendXp = 100;
    let backendDoka = 250;
    const skipped = await flushPendingDeathPenaltyThroughDeathCutCredit({
      storage,
      slot: 1,
      persist: guarded,
      fetchSnapshot: async () => ({ xp: 100, doka: 200 }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(skipped, false);
    assert.equal(backendDoka, 250);
    assert.equal(backendXp, 100);
    assert.equal(guarded.snapshot().doka, 250);
    assert.deepEqual(readPendingDeathPenalty(storage, 1), UNPAID);

    const flushed = await flushPendingDeathPenaltyThroughDeathCutCredit({
      storage,
      slot: 1,
      persist: guarded,
      fetchSnapshot: async () => ({ xp: 100, doka: 250 }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, true);
    assert.equal(backendDoka, 170, "unpaid 80 applied on top of the 50 pickup");
    assert.equal(backendXp, 80);
    assert.equal(guarded.snapshot().doka, 170);
    assert.equal(readPendingDeathPenalty(storage, 1), null);

    const spent = applySpendToCommitted(guarded.snapshot().doka, 10);
    guarded.commit({ doka: spent });
    assert.equal(spent, 160);
  });

  it("leftover feat resolve honours unpaid against lock 220 and writes 130", async () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 seeded. Canister 200.
    // 2. Death catch-commits 120. Pending preDoka=200. Canister 200.
    // 3. Claim #ok(100). leftover commit snapshot+100 = 220. Canister 300.
    // 4. Recap heal leftover resolve is seeded and unconfirmed-clear, so it
    //    returns 220 with no fetch. Spend 10, honour unpaid 80 → write 130.
    const leftover = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    leftover.commit({ doka: 120, xp: 80 });
    leftover.commit({
      doka: committedDokaAfterAchievementCredit(leftover.snapshot().doka, 100),
    });
    assert.equal(leftover.snapshot().doka, 220);
    assert.equal(leftover.hasUnconfirmedWalletCredit(), false);

    const stale = await resolveCommittedDokaForAbsoluteWrite(
      leftover,
      async () => 300,
    );
    assert.equal(stale, 220, "seeded leftover resolve never fetches 300");
    const wrote = honourHealWrite(
      UNPAID,
      leftover.snapshot().xp,
      stale ?? 0,
      10,
    );
    leftover.commit({ doka: wrote });
    assert.equal(wrote, 130);
  });

  it("does not saveBattleStats-wipe the feat grant after a gated stale resolve", async () => {
    const guarded = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    guarded.commit({ doka: 120, xp: 80 });
    guarded.commit({
      doka: committedDokaAfterAchievementCredit(guarded.snapshot().doka, 100),
    });

    await assert.rejects(
      () =>
        resolveCommittedDokaAfterDeathCutCredit(
          guarded,
          async () => 200,
          200,
          120,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(guarded.snapshot().doka, 220);

    const fetched = await resolveCommittedDokaAfterDeathCutCredit(
      guarded,
      async () => 300,
      200,
      120,
    );
    assert.equal(fetched, 300);
    const wrote = honourHealWrite(
      UNPAID,
      guarded.snapshot().xp,
      fetched ?? 0,
      10,
    );
    guarded.commit({ doka: wrote });
    assert.equal(wrote, 210, "feat + unpaid 20/40 + heal spend");
    assert.equal(wrote > 130, true);
  });

  it("leftover GameKey flush writes 120 over canister 1200", async () => {
    const leftover = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    leftover.commit({ doka: 120, xp: 80 });
    leftover.commit({
      doka: committedDokaAfterGameKeyRedeem(leftover.snapshot().doka, 1000),
    });
    assert.equal(leftover.snapshot().doka, 1120);
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    let backendDoka = 1200;
    let backendXp = 100;
    const flushed = await flushPendingDeathPenalty({
      storage,
      slot: 1,
      persist: leftover,
      fetchSnapshot: async () => ({ xp: 100, doka: 200 }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, true);
    assert.equal(backendDoka, 120, "stale pre-death flush wiped the GameKey");
    assert.equal(backendXp, 80);
  });

  it("does not flush-wipe GameKey after a gated stale snapshot", async () => {
    const guarded = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    guarded.commit({ doka: 120, xp: 80 });
    guarded.commit({
      doka: committedDokaAfterGameKeyRedeem(guarded.snapshot().doka, 1000),
    });
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    let backendDoka = 1200;
    let backendXp = 100;
    const skipped = await flushPendingDeathPenaltyThroughDeathCutCredit({
      storage,
      slot: 1,
      persist: guarded,
      fetchSnapshot: async () => ({ xp: 100, doka: 200 }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(skipped, false);
    assert.equal(backendDoka, 1200);
    assert.equal(readPendingDeathPenalty(storage, 1)?.preDoka, 200);

    const flushed = await flushPendingDeathPenaltyThroughDeathCutCredit({
      storage,
      slot: 1,
      persist: guarded,
      fetchSnapshot: async () => ({ xp: 100, doka: 1200 }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, true);
    assert.equal(backendDoka, 1120, "unpaid 80 applied on top of the 1000");
    assert.equal(backendXp, 80);
    const spent = applySpendToCommitted(guarded.snapshot().doka, 10);
    guarded.commit({ doka: spent });
    assert.equal(spent, 1110);
  });

  it("leftover victory flush writes 120 over canister 280", async () => {
    const leftover = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    leftover.commit({ doka: 120, xp: 80 });
    leftover.commit({ doka: 280, xp: 24, level: 5 });
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    let backendDoka = 280;
    const flushed = await flushPendingDeathPenalty({
      storage,
      slot: 1,
      persist: leftover,
      fetchSnapshot: async () => ({ xp: 100, doka: 200 }),
      writePenalty: async (_newXp, newDoka) => {
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, true);
    assert.equal(backendDoka, 120, "stale pre-death flush wiped victory Doka");
  });

  it("does not flush-wipe victory after a gated stale snapshot", async () => {
    const guarded = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    guarded.commit({ doka: 120, xp: 80 });
    guarded.commit({ doka: 280, xp: 24, level: 5 });
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    let backendDoka = 280;
    const skipped = await flushPendingDeathPenaltyThroughDeathCutCredit({
      storage,
      slot: 1,
      persist: guarded,
      fetchSnapshot: async () => ({ xp: 100, doka: 200 }),
      writePenalty: async (_newXp, newDoka) => {
        backendDoka = newDoka;
      },
    });
    assert.equal(skipped, false);
    assert.equal(backendDoka, 280);

    const flushed = await flushPendingDeathPenaltyThroughDeathCutCredit({
      storage,
      slot: 1,
      persist: guarded,
      fetchSnapshot: async () => ({ xp: 24, doka: 280 }),
      writePenalty: async (_newXp, newDoka) => {
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, true);
    assert.equal(backendDoka, 200, "unpaid 80 applied on top of victory 80");
    const spent = applySpendToCommitted(guarded.snapshot().doka, 10);
    guarded.commit({ doka: spent });
    assert.equal(spent, 190);
  });

  it("death-fail without a later credit still flushes the unpaid 20/40 onto 200", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    lock.commit({ doka: 120, xp: 80 });
    assert.equal(lock.hasUnconfirmedWalletCredit(), false);
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    let backendDoka = 200;
    let backendXp = 100;
    const flushed = await flushPendingDeathPenaltyThroughDeathCutCredit({
      storage,
      slot: 1,
      persist: lock,
      fetchSnapshot: async () => ({ xp: backendXp, doka: backendDoka }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, true);
    assert.equal(backendDoka, 120);
    assert.equal(backendXp, 80);
  });

  it("keep-only (lock still 120) still defers to the original unconfirmed skip", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    lock.commit({ doka: 120, xp: 80 });
    lock.noteUnconfirmedCredit();
    assert.equal(
      shouldSkipDeathCutConfirmedCreditWrite({
        liveDoka: 200,
        committedDoka: lock.snapshot().doka,
        pendingPreDoka: 200,
        pendingAfterDoka: 120,
      }),
      false,
    );
    const fetched = await resolveCommittedDokaAfterDeathCutCredit(
      lock,
      async () => 200,
      200,
      120,
    );
    assert.equal(
      fetched,
      200,
      "keep hole stays on #698; this helper passes through",
    );
  });
});
