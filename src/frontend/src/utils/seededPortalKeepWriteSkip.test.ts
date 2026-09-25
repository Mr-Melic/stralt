import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PORTAL_TRANSITION_XP,
  persistIncrementalRewards,
} from "./applyRewardsResult.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  createProgressPersist,
  resolveCommittedDokaForAbsoluteWrite,
} from "./progressPersist.ts";
import {
  noteSeededPortalKeepWriteSkip,
  persistSeededPortalXpThroughLock,
  shouldNoteSeededPortalTransportKeep,
} from "./seededPortalKeepWriteSkip.ts";

describe("seeded portal keep vs leftover absolute-write snapshot", () => {
  it("notes transport-keep and not explicit applyRewards #err", () => {
    assert.equal(
      shouldNoteSeededPortalTransportKeep(
        new Error("replica reject after add"),
      ),
      true,
    );
    assert.equal(
      shouldNoteSeededPortalTransportKeep(
        new Error("applyRewards transport keep"),
      ),
      true,
    );
    assert.equal(
      shouldNoteSeededPortalTransportKeep(
        new Error("applyRewards missing ok payload"),
      ),
      true,
    );
    assert.equal(
      shouldNoteSeededPortalTransportKeep(
        new Error("applyRewards failed: Account banned"),
      ),
      false,
    );
    assert.equal(
      shouldNoteSeededPortalTransportKeep(new Error("applyRewards failed")),
      false,
    );
  });

  it("does not note on an unseeded lock (older persist PR owns that wrap)", () => {
    const unseeded = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    noteSeededPortalKeepWriteSkip(
      unseeded,
      new Error("replica reject after add"),
    );
    assert.equal(unseeded.isWalletSeeded(), false);
    assert.equal(unseeded.hasUnconfirmedWalletCredit(), false);
  });

  it("leftover seeded portal throw-after-add saveBattleStats-wipes leftover XP", async () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 seeded, XP leftover 80. Canister 200/80.
    // 2. Portal persistIncrementalRewards adds +10 (canister leftover 90)
    //    then throws. Commit never runs. unconfirmedWalletCredit stays false.
    // 3. Recap heal spends 10. Leftover resolveCommittedDoka returns 200
    //    immediately (seeded && !unconfirmed) and wrote XP 80.
    const leftover = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    assert.equal(leftover.isWalletSeeded(), true);
    assert.equal(leftover.hasUnconfirmedWalletCredit(), false);
    await assert.rejects(
      leftover.enqueue(async () => {
        throw new Error("replica reject after add");
      }),
      /replica reject after add/,
    );
    assert.equal(leftover.hasUnconfirmedWalletCredit(), false);
    const stale = await resolveCommittedDokaForAbsoluteWrite(
      leftover,
      async () => {
        throw new Error("must not refetch a seeded confirmed lock");
      },
    );
    assert.equal(stale, 200);
    leftover.commit({
      doka: applySpendToCommitted(stale ?? 0, 10),
      xp: leftover.snapshot().xp,
    });
    assert.equal(leftover.snapshot().doka, 190);
    assert.equal(leftover.snapshot().xp, 80, "leftover wrote Play-entry XP");
  });

  it("does not saveBattleStats-wipe portal +10 via the pre-credit leftover", async () => {
    const guarded = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    noteSeededPortalKeepWriteSkip(
      guarded,
      new Error("replica reject after add"),
    );
    assert.equal(guarded.isWalletSeeded(), true);
    assert.equal(guarded.hasUnconfirmedWalletCredit(), true);

    await assert.rejects(
      () => resolveCommittedDokaForAbsoluteWrite(guarded, async () => 200),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(guarded.snapshot().doka, 200);
    assert.equal(guarded.snapshot().xp, 80);
    assert.equal(guarded.isWalletSeeded(), true);
  });

  it("does not note after an explicit applyRewards #err so a later heal can persist", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    noteSeededPortalKeepWriteSkip(
      lock,
      new Error("applyRewards failed: Account banned"),
    );
    assert.equal(lock.hasUnconfirmedWalletCredit(), false);
    const fetched = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => {
        throw new Error("must not refetch");
      },
    );
    assert.equal(fetched, 200);
  });

  it("notes unconfirmed from persistSeededPortalXpThroughLock after throw-after-add", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    await assert.rejects(
      persistSeededPortalXpThroughLock(lock, async () => {
        throw new Error("replica reject after add");
      }),
      /replica reject after add/,
    );
    assert.equal(lock.hasUnconfirmedWalletCredit(), true);
    await assert.rejects(
      () => resolveCommittedDokaForAbsoluteWrite(lock, async () => 200),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(lock.snapshot().doka, 200);
    assert.equal(lock.snapshot().xp, 80);
  });

  it("notes unconfirmed from the WorldExploration portal catch after enqueue rejects", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    try {
      await lock.enqueue(async () => {
        throw new Error("replica reject after add");
      });
    } catch (persistErr) {
      noteSeededPortalKeepWriteSkip(lock, persistErr);
    }
    assert.equal(lock.hasUnconfirmedWalletCredit(), true);
    await assert.rejects(
      () => resolveCommittedDokaForAbsoluteWrite(lock, async () => 200),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
  });

  it("notes unconfirmed from persistIncrementalRewards throw inside persistSeededPortalXpThroughLock", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    let canisterXp = 80;
    await assert.rejects(
      persistSeededPortalXpThroughLock(lock, () =>
        persistIncrementalRewards(
          {
            applyRewards: async (_slot: bigint, doka: bigint, xp: bigint) => {
              assert.equal(Number(doka), 0);
              assert.equal(Number(xp), PORTAL_TRANSITION_XP);
              canisterXp += Number(xp);
              throw new Error("replica reject after add");
            },
          },
          1,
          0,
          PORTAL_TRANSITION_XP,
        ),
      ),
      /replica reject after add/,
    );
    assert.equal(canisterXp, 90);
    assert.equal(lock.isWalletSeeded(), true);
    assert.equal(lock.snapshot().doka, 200);
    assert.equal(lock.snapshot().xp, 80, "lock leftover stays pre-portal");
    assert.equal(lock.hasUnconfirmedWalletCredit(), true);
    await assert.rejects(
      () => resolveCommittedDokaForAbsoluteWrite(lock, async () => 200),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(lock.snapshot().xp, 80);
  });

  it("clears the skip after a later Doka commit so a heal can persist", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    noteSeededPortalKeepWriteSkip(lock, new Error("replica reject after add"));
    await assert.rejects(
      () => resolveCommittedDokaForAbsoluteWrite(lock, async () => 200),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    lock.commit({ doka: 280, xp: 90 });
    assert.equal(lock.hasUnconfirmedWalletCredit(), false);
    const fetched = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => {
        throw new Error("must not refetch a seeded confirmed lock");
      },
    );
    assert.equal(fetched, 280);
    const wrote = applySpendToCommitted(fetched ?? 0, 10);
    lock.commit({ doka: wrote });
    assert.equal(wrote, 270);
    assert.equal(lock.snapshot().xp, 90, "portal leftover survived the heal");
  });
});
