import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applySpendToCommitted,
  createProgressPersist,
  resolveCommittedDokaForAbsoluteWrite,
  spendFromUiBalance,
} from "./progressPersist.ts";
import {
  ABSOLUTE_WRITE_STALE_UNSEEDED_CREDIT,
  clearUnseededCreditFloor,
  getUnseededCreditFloor,
  noteUnseededCreditFloorIfNeeded,
  resolveCommittedDokaForAbsoluteWriteGuardingUnseededCredit,
  shouldRefuseStaleUnseededCreditSeed,
  wrapPersistSeedWallet,
} from "./unseededCreditFloor.ts";

describe("unseeded GameKey/feat #ok vs stale absolute-write fetch", () => {
  it("refuses a live read below the granted floor", () => {
    assert.equal(
      shouldRefuseStaleUnseededCreditSeed({
        walletSeeded: false,
        creditFloor: 1000,
        liveDoka: 200,
      }),
      true,
    );
    assert.equal(
      shouldRefuseStaleUnseededCreditSeed({
        walletSeeded: false,
        creditFloor: 1000,
        liveDoka: null,
      }),
      true,
    );
    assert.equal(
      shouldRefuseStaleUnseededCreditSeed({
        walletSeeded: false,
        creditFloor: 1000,
        liveDoka: 1200,
      }),
      false,
    );
    assert.equal(
      shouldRefuseStaleUnseededCreditSeed({
        walletSeeded: true,
        creditFloor: 1000,
        liveDoka: 200,
      }),
      false,
      "seeded locks keep the existing resolveCommittedDoka path",
    );
    assert.equal(
      shouldRefuseStaleUnseededCreditSeed({
        walletSeeded: false,
        creditFloor: 0,
        liveDoka: 200,
      }),
      false,
    );
  });

  it("notes a floor only while the lock is still a placeholder", () => {
    const unseeded = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    noteUnseededCreditFloorIfNeeded(unseeded, 1000);
    assert.equal(getUnseededCreditFloor(unseeded), 1000);
    noteUnseededCreditFloorIfNeeded(unseeded, 100);
    assert.equal(getUnseededCreditFloor(unseeded), 1100);

    const seeded = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    noteUnseededCreditFloorIfNeeded(seeded, 1000);
    assert.equal(getUnseededCreditFloor(seeded), 0);
  });

  it("does not saveBattleStats-wipe a paid grant via a stale pre-credit fetch", async () => {
    // Chronology:
    // 1. World mounts. Lock doka=0 unseeded. Canister 200.
    // 2. redeemGameKey / claimAchievementReward #ok(1000). Canister 1200.
    //    Lock stays 0. noteUnseededCreditFloorIfNeeded(1000).
    // 3. Recap heal spends 10. Leftover resolveCommittedDoka seeded 200
    //    and wrote 190 — wiping 1000 (never mints incoming-below-stored).
    let canister = 1200;
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    assert.equal(lock.isWalletSeeded(), false);
    lock.noteUnseededCredit();
    noteUnseededCreditFloorIfNeeded(lock, 1000);

    const leftover = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => 200,
    );
    assert.equal(leftover, 200, "leftover path still seeds the stale snapshot");
    assert.equal(lock.isWalletSeeded(), true);
    lock.commit({ doka: applySpendToCommitted(leftover ?? 0, 10) });
    assert.equal(lock.snapshot().doka, 190);

    const guarded = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    guarded.noteUnseededCredit();
    noteUnseededCreditFloorIfNeeded(guarded, 1000);
    await assert.rejects(
      () =>
        resolveCommittedDokaForAbsoluteWriteGuardingUnseededCredit(
          guarded,
          async () => 200,
        ),
      new RegExp(ABSOLUTE_WRITE_STALE_UNSEEDED_CREDIT),
    );
    assert.equal(guarded.isWalletSeeded(), false);
    assert.equal(guarded.snapshot().doka, 0);
    assert.equal(getUnseededCreditFloor(guarded), 1000);

    const caughtUp =
      await resolveCommittedDokaForAbsoluteWriteGuardingUnseededCredit(
        guarded,
        async () => canister,
      );
    assert.equal(caughtUp, 1200);
    assert.equal(guarded.isWalletSeeded(), true);
    assert.equal(getUnseededCreditFloor(guarded), 0);
    const spend = spendFromUiBalance(1000, 990);
    const wrote = applySpendToCommitted(caughtUp ?? 0, spend);
    guarded.commit({ doka: wrote });
    assert.equal(wrote, 1190);
    assert.equal(wrote > 190, true, "paid grant survived the recap heal");
  });

  it("wraps seedWallet so leftover resolveCommittedDoka cannot seed a stale fetch", async () => {
    // WorldExploration keeps the original resolveCommittedDoka import and
    // death/heal call sites (#356 inserts resolveCommittedXp next to both).
    // wrapPersistSeedWallet throws; resolve swallows that as null so the
    // unseeded skip path runs instead of saveBattleStats-writing 190.
    const wrapped = wrapPersistSeedWallet(
      createProgressPersist({ doka: 0, xp: 80, level: 4 }),
    );
    wrapped.noteUnseededCredit();
    noteUnseededCreditFloorIfNeeded(wrapped, 1000);

    const skipped = await resolveCommittedDokaForAbsoluteWrite(
      wrapped,
      async () => 200,
    );
    assert.equal(skipped, null);
    assert.equal(wrapped.isWalletSeeded(), false);
    assert.equal(wrapped.snapshot().doka, 0);
    assert.equal(getUnseededCreditFloor(wrapped), 1000);

    const caughtUp = await resolveCommittedDokaForAbsoluteWrite(
      wrapped,
      async () => 1200,
    );
    assert.equal(caughtUp, 1200);
    assert.equal(wrapped.isWalletSeeded(), true);
    assert.equal(getUnseededCreditFloor(wrapped), 0);
    const wrote = applySpendToCommitted(caughtUp ?? 0, 10);
    wrapped.commit({ doka: wrote });
    assert.equal(wrote, 1190);
  });

  it("clears the floor after a live read that includes the grant", async () => {
    const lock = createProgressPersist({ doka: 0, xp: 0, level: 1 });
    noteUnseededCreditFloorIfNeeded(lock, 1000);
    const live =
      await resolveCommittedDokaForAbsoluteWriteGuardingUnseededCredit(
        lock,
        async () => 1000,
      );
    assert.equal(live, 1000);
    assert.equal(getUnseededCreditFloor(lock), 0);
    clearUnseededCreditFloor(lock);
    assert.equal(getUnseededCreditFloor(lock), 0);
  });
});
