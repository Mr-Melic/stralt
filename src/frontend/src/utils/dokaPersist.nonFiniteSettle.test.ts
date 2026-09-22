import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  confirmKeptOneShotCredit,
  persistDokaCreditAmount,
  resolveOneShotCreditSettle,
  settleOneShotAfterCredit,
  settleOneShotPersistLock,
} from "./dokaPersist.ts";
import { createProgressPersist } from "./progressPersist.ts";

describe("settleOneShotAfterCredit non-finite ok", () => {
  it("does not commit NaN or Infinity into the persist lock", async () => {
    // readApplyRewardsOk does Number(newDoka). A missing / overflow payload
    // becomes NaN or Infinity. `ok > 0` is true for Infinity, so the lock
    // used to commit Infinity; the next saveBattleStats / shop spend then
    // wrote a poisoned wallet.
    assert.equal(
      settleOneShotAfterCredit({ ok: Number.POSITIVE_INFINITY }),
      "keep",
    );
    assert.equal(settleOneShotAfterCredit({ ok: Number.NaN }), "keep");
    assert.equal(settleOneShotAfterCredit({ ok: 0 }), "keep");
    assert.equal(settleOneShotAfterCredit({ ok: -1 }), "keep");
    assert.equal(settleOneShotAfterCredit({ ok: 550 }), "commit");

    const infAmount = persistDokaCreditAmount({
      ok: Number.POSITIVE_INFINITY,
    });
    assert.equal(Number.isFinite(infAmount), false);

    const lock = createProgressPersist({ doka: 500, xp: 0, level: 1 });
    const settled = await resolveOneShotCreditSettle(
      { ok: Number.POSITIVE_INFINITY },
      {
        committedDoka: lock.snapshot().doka,
        walletSeeded: true,
        readWallet: async () => 500,
      },
    );
    assert.deepEqual(settled, { kind: "keep" });
    settleOneShotPersistLock(lock, settled);
    assert.equal(lock.snapshot().doka, 500);
    assert.equal(Number.isFinite(lock.snapshot().doka), true);
    assert.equal(lock.hasUnconfirmedWalletCredit(), true);
  });

  it("does not confirm a live wallet of Infinity as a shrine credit", async () => {
    const confirmed = await confirmKeptOneShotCredit(
      500,
      async () => Number.POSITIVE_INFINITY,
      true,
    );
    assert.equal(confirmed, null);

    const nanLive = await confirmKeptOneShotCredit(
      500,
      async () => Number.NaN,
      true,
    );
    assert.equal(nanLive, null);

    const rise = await confirmKeptOneShotCredit(500, async () => 550, true);
    assert.equal(rise, 550);
  });
});
