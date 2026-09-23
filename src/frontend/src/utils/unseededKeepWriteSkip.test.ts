import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { settleOneShotPersistLock } from "./dokaPersist.ts";
import {
  applySpendToCommitted,
  createProgressPersist,
  resolveCommittedDokaForAbsoluteWrite,
} from "./progressPersist.ts";
import {
  ABSOLUTE_WRITE_UNSEEDED_KEEP,
  assertUnseededKeepAbsoluteWriteAllowed,
  clearUnseededKeepWriteSkip,
  hasUnseededKeepWriteSkip,
  noteUnseededKeepWriteSkip,
  shouldSkipUnseededKeepAbsoluteWrite,
  wrapUnseededKeepWriteSkip,
} from "./unseededKeepWriteSkip.ts";

describe("unseeded one-shot keep vs stale absolute-write fetch", () => {
  it("refuses every fetch while an unseeded keep is outstanding", () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    assert.equal(shouldSkipUnseededKeepAbsoluteWrite(lock), false);
    noteUnseededKeepWriteSkip(lock);
    assert.equal(hasUnseededKeepWriteSkip(lock), true);
    assert.equal(shouldSkipUnseededKeepAbsoluteWrite(lock), true);
    assert.throws(
      () => assertUnseededKeepAbsoluteWriteAllowed(lock),
      new RegExp(ABSOLUTE_WRITE_UNSEEDED_KEEP),
    );
  });

  it("does not saveBattleStats-wipe a pickup via a stale pre-credit 200", async () => {
    // Chronology:
    // 1. World mounts. Lock doka=0 unseeded. Canister 200.
    // 2. Ground/shrine applyRewards adds 50 (canister 250) then throws.
    //    Settle keep. noteUnconfirmedCredit only blocks idle hydrate.
    // 3. Recap heal spends 10. Leftover resolveCommittedDoka seeded 200
    //    (unconfirmedWalletCredit is false while unseeded) and wrote 190.
    const leftover = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    leftover.noteUnconfirmedCredit();
    leftover.seedWallet(200);
    leftover.commit({
      doka: applySpendToCommitted(leftover.snapshot().doka, 10),
    });
    assert.equal(leftover.isWalletSeeded(), true);
    assert.equal(leftover.snapshot().doka, 190);

    // Production path: settleOneShotPersistLock notes the skip. No WX wrap.
    const guarded = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    settleOneShotPersistLock(guarded, { kind: "keep" });
    assert.equal(guarded.isWalletSeeded(), false);
    assert.equal(guarded.hasUnconfirmedWalletCredit(), false);
    assert.equal(hasUnseededKeepWriteSkip(guarded), true);

    const skipped = await resolveCommittedDokaForAbsoluteWrite(
      guarded,
      async () => 200,
    );
    assert.equal(skipped, null, "wrap throws; resolve swallows as null");
    assert.throws(
      () => assertUnseededKeepAbsoluteWriteAllowed(guarded),
      new RegExp(ABSOLUTE_WRITE_UNSEEDED_KEEP),
    );
    assert.equal(guarded.isWalletSeeded(), false);
    assert.equal(guarded.snapshot().doka, 0);

    guarded.commit({ doka: 250 });
    assert.equal(guarded.isWalletSeeded(), true);
    assert.equal(shouldSkipUnseededKeepAbsoluteWrite(guarded), false);
    const wrote = applySpendToCommitted(guarded.snapshot().doka, 10);
    guarded.commit({ doka: wrote });
    assert.equal(wrote, 240);
    assert.equal(wrote > 190, true, "pickup grant survived the recap heal");
  });

  it("does not note a skip on a seeded lock (existing unconfirmed path owns that)", () => {
    const seeded = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    wrapUnseededKeepWriteSkip(seeded);
    seeded.noteUnconfirmedCredit();
    assert.equal(seeded.hasUnconfirmedWalletCredit(), true);
    assert.equal(hasUnseededKeepWriteSkip(seeded), false);
    assert.equal(shouldSkipUnseededKeepAbsoluteWrite(seeded), false);
    clearUnseededKeepWriteSkip(seeded);
    assert.equal(hasUnseededKeepWriteSkip(seeded), false);
  });

  it("wrap is idempotent across leftover noteUnconfirmedCredit callers", () => {
    const lock = createProgressPersist({ doka: 0, xp: 0, level: 1 });
    wrapUnseededKeepWriteSkip(lock);
    wrapUnseededKeepWriteSkip(lock);
    lock.noteUnconfirmedCredit();
    assert.equal(hasUnseededKeepWriteSkip(lock), true);
    assert.equal(lock.isWalletSeeded(), false);
  });
});
