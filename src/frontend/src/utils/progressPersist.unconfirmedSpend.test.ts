import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  createProgressPersist,
  resolveCommittedDokaForAbsoluteWrite,
  shouldClearUnconfirmedWalletCredit,
} from "./progressPersist.ts";

describe("unconfirmed wallet spend commits", () => {
  it("keeps unconfirmed after a spell-upgrade spend so a later heal cannot wipe the grant", async () => {
    // Chronology:
    // 1. Seeded lock 500. Ground applyRewards +50 then transport-keep.
    // 2. upgradeSpell spends 10 (canister 540). Stale query still 500, so
    //    committedDokaAfterSpellUpgrade writes 490.
    // 3. commit({ doka: 490 }) used to clear unconfirmed. Recap heal then
    //    saveBattleStats-wrote 490 and wiped the +50 (never mints).
    assert.equal(
      shouldClearUnconfirmedWalletCredit({
        unconfirmed: true,
        previousDoka: 500,
        nextDoka: 490,
      }),
      false,
    );
    assert.equal(
      shouldClearUnconfirmedWalletCredit({
        unconfirmed: true,
        previousDoka: 500,
        nextDoka: 500,
      }),
      false,
    );
    assert.equal(
      shouldClearUnconfirmedWalletCredit({
        unconfirmed: true,
        previousDoka: 500,
        nextDoka: 550,
      }),
      true,
    );
    assert.equal(
      shouldClearUnconfirmedWalletCredit({
        unconfirmed: false,
        previousDoka: 500,
        nextDoka: 490,
      }),
      true,
    );

    const lock = createProgressPersist({ doka: 500, xp: 0, level: 1 });
    lock.noteUnconfirmedCredit();
    lock.commit({ doka: 490 });
    assert.equal(lock.snapshot().doka, 490);
    assert.equal(lock.hasUnconfirmedWalletCredit(), true);

    await assert.rejects(
      () => resolveCommittedDokaForAbsoluteWrite(lock, async () => 490),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );

    const caughtUp = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => 540,
    );
    assert.equal(caughtUp, 540);
    assert.equal(lock.hasUnconfirmedWalletCredit(), false);
    const wrote = applySpendToCommitted(lock.snapshot().doka, 10);
    lock.commit({ doka: wrote });
    assert.equal(wrote, 530);
  });
});
