import assert from "node:assert/strict";
import { describe, it } from "node:test";
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
  shouldSkipAbsoluteDokaWrite,
} from "./progressPersist.ts";
import {
  flushPendingDeathPenaltyThroughUnconfirmedKeep,
  resolveCommittedDokaAfterDeathCutKeep,
  shouldSkipUnconfirmedKeepAfterDeathCut,
} from "./unconfirmedKeepDeathCutWriteSkip.ts";

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

describe("shouldSkipUnconfirmedKeepAfterDeathCut", () => {
  it("still skips keep-only live <= committed", () => {
    assert.equal(
      shouldSkipUnconfirmedKeepAfterDeathCut({
        unconfirmedWalletCredit: true,
        liveDoka: 200,
        committedDoka: 200,
        pendingPreDoka: null,
      }),
      true,
    );
    assert.equal(
      shouldSkipAbsoluteDokaWrite({
        unconfirmedWalletCredit: true,
        liveDoka: 200,
        committedDoka: 200,
      }),
      true,
    );
  });

  it("skips stale pre-death 200 after catch-cut lock 120", () => {
    assert.equal(
      shouldSkipAbsoluteDokaWrite({
        unconfirmedWalletCredit: true,
        liveDoka: 200,
        committedDoka: 120,
      }),
      false,
      "original skip misses the hole: stale 200 > cut lock 120",
    );
    assert.equal(
      shouldSkipUnconfirmedKeepAfterDeathCut({
        unconfirmedWalletCredit: true,
        liveDoka: 200,
        committedDoka: 120,
        pendingPreDoka: 200,
      }),
      true,
    );
  });

  it("allows a live rise past the unpaid pre-cut (kept pickup)", () => {
    assert.equal(
      shouldSkipUnconfirmedKeepAfterDeathCut({
        unconfirmedWalletCredit: true,
        liveDoka: 250,
        committedDoka: 120,
        pendingPreDoka: 200,
      }),
      false,
    );
  });

  it("does not extra-skip when there is no unpaid pre-cut", () => {
    assert.equal(
      shouldSkipUnconfirmedKeepAfterDeathCut({
        unconfirmedWalletCredit: true,
        liveDoka: 200,
        committedDoka: 120,
        pendingPreDoka: null,
      }),
      false,
    );
  });

  it("does not extra-skip when the keep flag is clear", () => {
    assert.equal(
      shouldSkipUnconfirmedKeepAfterDeathCut({
        unconfirmedWalletCredit: false,
        liveDoka: 200,
        committedDoka: 120,
        pendingPreDoka: 200,
      }),
      false,
    );
  });
});

describe("death-fail catch-commit then keep vs leftover absolute write", () => {
  it("leftover resolve seeds stale 200 and saveBattleStats-wipes the pickup at 110", async () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200.
    // 2. Death saveBattleStats rejects. Catch commits lock 120 / XP 80.
    //    Pending preDoka=200. Canister still 200.
    // 3. Ground Doka applyRewards +50 then throws. Keep.
    //    noteUnconfirmedCredit. Canister 250. Lock 120.
    // 4. Recap heal leftover resolve: live 200 > committed 120, seed 200.
    // 5. Spend 10, honour unpaid 80 → write 110. Pickup gone.
    const leftover = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    leftover.commit({ doka: 120, xp: 80 });
    leftover.noteUnconfirmedCredit();
    assert.equal(leftover.snapshot().doka, 120);
    assert.equal(leftover.hasUnconfirmedWalletCredit(), true);

    const stale = await resolveCommittedDokaForAbsoluteWrite(
      leftover,
      async () => 200,
    );
    assert.equal(stale, 200);
    assert.equal(leftover.hasUnconfirmedWalletCredit(), false);
    const wrote = honourHealWrite(
      UNPAID,
      leftover.snapshot().xp,
      stale ?? 0,
      10,
    );
    leftover.commit({ doka: wrote });
    assert.equal(wrote, 110);
  });

  it("does not saveBattleStats-wipe the kept pickup after a gated stale resolve", async () => {
    const guarded = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    guarded.commit({ doka: 120, xp: 80 });
    guarded.noteUnconfirmedCredit();

    await assert.rejects(
      () =>
        resolveCommittedDokaAfterDeathCutKeep(guarded, async () => 200, 200),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(guarded.snapshot().doka, 120);
    assert.equal(guarded.hasUnconfirmedWalletCredit(), true);

    const fetched = await resolveCommittedDokaAfterDeathCutKeep(
      guarded,
      async () => 250,
      200,
    );
    assert.equal(fetched, 250);
    const wrote = honourHealWrite(
      UNPAID,
      guarded.snapshot().xp,
      fetched ?? 0,
      10,
    );
    guarded.commit({ doka: wrote });
    assert.equal(wrote, 160, "pickup + unpaid 20/40 + heal spend");
    assert.equal(wrote > 110, true);
  });

  it("leftover beforeEach flush writes 120 over canister 250", async () => {
    const leftover = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    leftover.commit({ doka: 120, xp: 80 });
    leftover.noteUnconfirmedCredit();
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

  it("does not flush-wipe the kept pickup after a gated stale snapshot", async () => {
    const guarded = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    guarded.commit({ doka: 120, xp: 80 });
    guarded.noteUnconfirmedCredit();
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    let backendXp = 100;
    let backendDoka = 250;
    const skipped = await flushPendingDeathPenaltyThroughUnconfirmedKeep({
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
    assert.equal(guarded.snapshot().doka, 120);
    assert.equal(guarded.hasUnconfirmedWalletCredit(), true);
    assert.deepEqual(readPendingDeathPenalty(storage, 1), UNPAID);

    const flushed = await flushPendingDeathPenaltyThroughUnconfirmedKeep({
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

  it("keep-only (no unpaid death) still throws on stale live <= committed", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    lock.noteUnconfirmedCredit();
    await assert.rejects(
      () => resolveCommittedDokaAfterDeathCutKeep(lock, async () => 200, null),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    const caughtUp = await resolveCommittedDokaAfterDeathCutKeep(
      lock,
      async () => 250,
      null,
    );
    assert.equal(caughtUp, 250);
    const wrote = applySpendToCommitted(lock.snapshot().doka, 10);
    lock.commit({ doka: wrote });
    assert.equal(wrote, 240);
  });

  it("death-fail without keep still flushes the unpaid 20/40 onto 200", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    lock.commit({ doka: 120, xp: 80 });
    assert.equal(lock.hasUnconfirmedWalletCredit(), false);
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    let backendDoka = 200;
    let backendXp = 100;
    const flushed = await flushPendingDeathPenaltyThroughUnconfirmedKeep({
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

  it("successful death persist then keep still skips stale live 120", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    lock.commit({ doka: 120, xp: 80 });
    lock.noteUnconfirmedCredit();
    await assert.rejects(
      () => resolveCommittedDokaAfterDeathCutKeep(lock, async () => 120, null),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    const fetched = await resolveCommittedDokaAfterDeathCutKeep(
      lock,
      async () => 170,
      null,
    );
    assert.equal(fetched, 170);
    const wrote = applySpendToCommitted(fetched ?? 0, 10);
    lock.commit({ doka: wrote });
    assert.equal(wrote, 160);
  });
});
