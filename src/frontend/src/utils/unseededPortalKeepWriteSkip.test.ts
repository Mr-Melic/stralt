import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PORTAL_TRANSITION_XP,
  persistIncrementalRewards,
} from "./applyRewardsResult.ts";
import {
  applySpendToCommitted,
  createProgressPersist,
  resolveCommittedDokaForAbsoluteWrite,
} from "./progressPersist.ts";
import {
  ABSOLUTE_WRITE_UNSEEDED_PORTAL_KEEP,
  assertUnseededPortalKeepAbsoluteWriteAllowed,
  clearUnseededPortalKeepWriteSkip,
  hasUnseededPortalKeepWriteSkip,
  noteUnseededPortalKeepWriteSkip,
  persistPortalXpThroughLock,
  shouldNoteUnseededPortalTransportKeep,
  shouldSkipUnseededPortalKeepAbsoluteWrite,
} from "./unseededPortalKeepWriteSkip.ts";

describe("unseeded portal keep vs stale absolute-write fetch", () => {
  it("notes transport-keep and not explicit applyRewards #err", () => {
    assert.equal(
      shouldNoteUnseededPortalTransportKeep(
        new Error("replica reject after add"),
      ),
      true,
    );
    assert.equal(
      shouldNoteUnseededPortalTransportKeep(
        new Error("applyRewards transport keep"),
      ),
      true,
    );
    assert.equal(
      shouldNoteUnseededPortalTransportKeep(
        new Error("applyRewards missing ok payload"),
      ),
      true,
    );
    assert.equal(
      shouldNoteUnseededPortalTransportKeep(
        new Error("applyRewards failed: Account banned"),
      ),
      false,
    );
    assert.equal(
      shouldNoteUnseededPortalTransportKeep(new Error("applyRewards failed")),
      false,
    );
  });

  it("refuses every fetch while an unseeded portal keep is outstanding", () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    assert.equal(shouldSkipUnseededPortalKeepAbsoluteWrite(lock), false);
    noteUnseededPortalKeepWriteSkip(
      lock,
      new Error("replica reject after add"),
    );
    assert.equal(hasUnseededPortalKeepWriteSkip(lock), true);
    assert.equal(shouldSkipUnseededPortalKeepAbsoluteWrite(lock), true);
    assert.throws(
      () => assertUnseededPortalKeepAbsoluteWriteAllowed(lock),
      new RegExp(ABSOLUTE_WRITE_UNSEEDED_PORTAL_KEEP),
    );
  });

  it("does not saveBattleStats-wipe portal +10 via a stale pre-credit 200", async () => {
    // Chronology:
    // 1. World mounts. Lock doka=0 unseeded, XP leftover 80. Canister Doka 200.
    // 2. Portal persistIncrementalRewards adds +10 XP (canister leftover 90)
    //    then throws. Commit never runs. noteUnconfirmedCredit only blocks
    //    idle hydrate.
    // 3. Recap heal spends 10. Leftover resolveCommittedDoka seeded 200
    //    (unconfirmedWalletCredit is false while unseeded) and wrote XP 80.
    const leftover = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    leftover.noteUnconfirmedCredit();
    leftover.seedWallet(200);
    leftover.commit({
      doka: applySpendToCommitted(leftover.snapshot().doka, 10),
    });
    assert.equal(leftover.isWalletSeeded(), true);
    assert.equal(leftover.snapshot().doka, 190);
    assert.equal(leftover.snapshot().xp, 80, "leftover wrote Play-entry XP");

    const guarded = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    noteUnseededPortalKeepWriteSkip(
      guarded,
      new Error("replica reject after add"),
    );
    assert.equal(guarded.isWalletSeeded(), false);
    assert.equal(guarded.hasUnconfirmedWalletCredit(), false);
    assert.equal(hasUnseededPortalKeepWriteSkip(guarded), true);

    const skipped = await resolveCommittedDokaForAbsoluteWrite(
      guarded,
      async () => 200,
    );
    assert.equal(skipped, null, "wrap throws; resolve swallows as null");
    assert.throws(
      () => assertUnseededPortalKeepAbsoluteWriteAllowed(guarded),
      new RegExp(ABSOLUTE_WRITE_UNSEEDED_PORTAL_KEEP),
    );
    assert.equal(guarded.isWalletSeeded(), false);
    assert.equal(guarded.snapshot().doka, 0);
    assert.equal(guarded.snapshot().xp, 80);

    guarded.commit({ doka: 200, xp: 90 });
    assert.equal(guarded.isWalletSeeded(), true);
    assert.equal(shouldSkipUnseededPortalKeepAbsoluteWrite(guarded), false);
    const wrote = applySpendToCommitted(guarded.snapshot().doka, 10);
    guarded.commit({ doka: wrote });
    assert.equal(wrote, 190);
    assert.equal(guarded.snapshot().xp, 90, "portal leftover survived heal");
  });

  it("does not note a skip on a seeded lock (existing unconfirmed path owns that)", () => {
    const seeded = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    noteUnseededPortalKeepWriteSkip(
      seeded,
      new Error("replica reject after add"),
    );
    assert.equal(seeded.hasUnconfirmedWalletCredit(), false);
    assert.equal(hasUnseededPortalKeepWriteSkip(seeded), false);
    assert.equal(shouldSkipUnseededPortalKeepAbsoluteWrite(seeded), false);
    clearUnseededPortalKeepWriteSkip(seeded);
    assert.equal(hasUnseededPortalKeepWriteSkip(seeded), false);
  });

  it("does not note a skip after an explicit applyRewards #err", async () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    noteUnseededPortalKeepWriteSkip(
      lock,
      new Error("applyRewards failed: Account banned"),
    );
    assert.equal(hasUnseededPortalKeepWriteSkip(lock), false);
    const fetched = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => 200,
    );
    assert.equal(fetched, 200);
    assert.equal(lock.isWalletSeeded(), true);
  });

  it("notes skip from persistPortalXpThroughLock after applyRewards throw-after-add", async () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    await assert.rejects(
      persistPortalXpThroughLock(lock, async () => {
        throw new Error("replica reject after add");
      }),
      /replica reject after add/,
    );
    assert.equal(lock.isWalletSeeded(), false);
    assert.equal(hasUnseededPortalKeepWriteSkip(lock), true);
    const skipped = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => 200,
    );
    assert.equal(skipped, null);
    assert.equal(lock.snapshot().doka, 0);
    assert.equal(lock.snapshot().xp, 80);
  });

  it("notes skip from the portal persist catch after enqueue rejects", async () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    try {
      await lock.enqueue(async () => {
        throw new Error("replica reject after add");
      });
    } catch (persistErr) {
      noteUnseededPortalKeepWriteSkip(lock, persistErr);
    }
    assert.equal(hasUnseededPortalKeepWriteSkip(lock), true);
    const skipped = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => 200,
    );
    assert.equal(skipped, null);
    assert.equal(lock.isWalletSeeded(), false);
  });

  it("notes skip from persistIncrementalRewards throw inside portal enqueue", async () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    let canisterXp = 80;
    await assert.rejects(
      persistPortalXpThroughLock(lock, () =>
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
    assert.equal(hasUnseededPortalKeepWriteSkip(lock), true);
    const skipped = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => 200,
    );
    assert.equal(skipped, null);
    assert.equal(lock.snapshot().xp, 80, "lock leftover stays pre-portal");
  });
});
