import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  createProgressPersist,
  resolveCommittedDokaForAbsoluteWrite,
  shouldClearUnconfirmedWalletCredit,
  shouldSkipAbsoluteDokaWrite,
} from "./progressPersist.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_SPEND,
  hasUnconfirmedWalletSpend,
  noteUnconfirmedSpend,
  shouldSkipAbsoluteDokaSpendWrite,
  shouldSkipAbsoluteUnconfirmedDokaWrite,
} from "./progressPersistSpend.ts";

describe("unconfirmed wallet spend throw-after-debit", () => {
  it("skips a stale-equal live read and seeds a live drop", async () => {
    // Chronology:
    // 1. Seeded lock 500. renameCharacter deducts 100 then throws.
    // 2. Lock stays 500. Retry hits "Name already in use".
    // 3. Recap shop used to applySpendToCommitted(500, 50) → 450 and
    //    saveBattleStats-write 450. Canister 400; never mints, item free.
    // 4. noteUnconfirmedSpend + stale getCallerDokaBalance skips.
    // 5. A later drop (400) seeds, then the shop spend writes 350.
    assert.equal(
      shouldSkipAbsoluteDokaSpendWrite({
        unconfirmedWalletSpend: true,
        liveDoka: 500,
        committedDoka: 500,
      }),
      true,
    );
    assert.equal(
      shouldSkipAbsoluteDokaSpendWrite({
        unconfirmedWalletSpend: true,
        liveDoka: null,
        committedDoka: 500,
      }),
      true,
    );
    assert.equal(
      shouldSkipAbsoluteDokaSpendWrite({
        unconfirmedWalletSpend: true,
        liveDoka: 400,
        committedDoka: 500,
      }),
      false,
    );
    assert.equal(
      shouldSkipAbsoluteUnconfirmedDokaWrite({
        unconfirmedWalletCredit: false,
        unconfirmedWalletSpend: true,
        liveDoka: 400,
        committedDoka: 500,
        creditSkip: shouldSkipAbsoluteDokaWrite,
      }),
      false,
    );
    assert.equal(
      shouldSkipAbsoluteUnconfirmedDokaWrite({
        unconfirmedWalletCredit: true,
        unconfirmedWalletSpend: true,
        liveDoka: 500,
        committedDoka: 500,
        creditSkip: shouldSkipAbsoluteDokaWrite,
      }),
      true,
      "both flags: stale-equal still skips",
    );
    assert.equal(
      shouldSkipAbsoluteUnconfirmedDokaWrite({
        unconfirmedWalletCredit: true,
        unconfirmedWalletSpend: true,
        liveDoka: 450,
        committedDoka: 500,
        creditSkip: shouldSkipAbsoluteDokaWrite,
      }),
      false,
      "both flags: a drop is the replica catching up",
    );

    const lock = createProgressPersist({ doka: 500, xp: 0, level: 1 });
    noteUnconfirmedSpend(lock);
    assert.equal(hasUnconfirmedWalletSpend(lock), true);

    await assert.rejects(
      () => resolveCommittedDokaForAbsoluteWrite(lock, async () => 500),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_SPEND),
    );
    assert.equal(lock.snapshot().doka, 500);
    assert.equal(hasUnconfirmedWalletSpend(lock), true);

    const caughtUp = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => 400,
    );
    assert.equal(caughtUp, 400);
    assert.equal(hasUnconfirmedWalletSpend(lock), false);
    const wrote = applySpendToCommitted(lock.snapshot().doka, 50);
    lock.commit({ doka: wrote });
    assert.equal(wrote, 350);
  });

  it("keeps an unconfirmed credit through a successful spend commit", async () => {
    // Union with #375: rename/upgrade commit({ doka: lock - spend }) must
    // not clear a seeded one-shot keep. Recap heal would then skip the
    // live re-fetch and saveBattleStats-wipe the grant (never mints).
    assert.equal(
      shouldClearUnconfirmedWalletCredit({
        unconfirmed: true,
        previousDoka: 500,
        nextDoka: 400,
      }),
      false,
    );
    const lock = createProgressPersist({ doka: 500, xp: 0, level: 1 });
    lock.noteUnconfirmedCredit();
    lock.commit({ doka: 400 });
    assert.equal(lock.snapshot().doka, 400);
    assert.equal(lock.hasUnconfirmedWalletCredit(), true);
    assert.equal(hasUnconfirmedWalletSpend(lock), false);

    await assert.rejects(
      () => resolveCommittedDokaForAbsoluteWrite(lock, async () => 400),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    const caughtUp = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => 450,
    );
    assert.equal(caughtUp, 450);
    assert.equal(lock.hasUnconfirmedWalletCredit(), false);
  });
});
