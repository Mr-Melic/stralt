import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { applyUnpaidDeathPenaltyToWrite } from "./deathPenalty.ts";
import {
  committedDokaAfterGameKeyUnpaidDeath,
  unpaidDeathDokaAlreadyHonouredOnLock,
} from "./gameKeyUnpaidDeath.ts";
import { committedDokaAfterGameKeyRedeem } from "./shopPurchase.ts";

const UNCUT = {
  slot: 1,
  preXp: 100,
  preDoka: 200,
  afterXp: 80,
  afterDoka: 120,
};

describe("GameKey redeem vs unpaid death 20/40", () => {
  it("matches raw GameKey add when there is no pending marker", () => {
    assert.equal(
      committedDokaAfterGameKeyUnpaidDeath({
        pending: null,
        lockDoka: 200,
        gained: 1000,
        walletSeeded: true,
      }),
      committedDokaAfterGameKeyRedeem(200, 1000),
    );
  });

  it("cuts an uncut seeded lock then adds the grant (200 + 1000 − 80 = 1120)", () => {
    assert.equal(unpaidDeathDokaAlreadyHonouredOnLock(UNCUT, 200), false);
    assert.equal(
      committedDokaAfterGameKeyUnpaidDeath({
        pending: UNCUT,
        lockDoka: 200,
        gained: 1000,
        walletSeeded: true,
      }),
      1120,
    );
    assert.deepEqual(applyUnpaidDeathPenaltyToWrite(UNCUT, 80, 200), {
      xp: 80,
      doka: 120,
    });
  });

  it("does not recut when the lock is already at afterDoka", () => {
    assert.equal(unpaidDeathDokaAlreadyHonouredOnLock(UNCUT, 120), true);
    assert.equal(
      committedDokaAfterGameKeyUnpaidDeath({
        pending: UNCUT,
        lockDoka: 120,
        gained: 1000,
        walletSeeded: true,
      }),
      1120,
      "120 + 1000, not applyUnpaid(120 + 1000) = 1040",
    );
    assert.deepEqual(
      applyUnpaidDeathPenaltyToWrite(UNCUT, 80, 1120),
      { xp: 80, doka: 1040 },
      "naive lock+grant into applyUnpaidDeathPenaltyToWrite recuts",
    );
  });

  it("does not recut a cutConfirmed wallet even if the lock still looks uncut", () => {
    const confirmed = { ...UNCUT, cutConfirmed: true as const };
    assert.equal(unpaidDeathDokaAlreadyHonouredOnLock(confirmed, 200), true);
    assert.equal(
      committedDokaAfterGameKeyUnpaidDeath({
        pending: confirmed,
        lockDoka: 200,
        gained: 1000,
        walletSeeded: true,
      }),
      1200,
    );
  });

  it("does not treat an unseeded placeholder 0 as an honoured cut", () => {
    assert.equal(
      unpaidDeathDokaAlreadyHonouredOnLock(UNCUT, 0),
      true,
      "drop from pre 200 to 0 is ≥ the 80 loss — honour check alone is unsafe",
    );
    assert.equal(
      committedDokaAfterGameKeyUnpaidDeath({
        pending: UNCUT,
        lockDoka: 0,
        gained: 1000,
        walletSeeded: false,
      }),
      1000,
      "unseeded redeem must not commit a cut-taxed placeholder",
    );
  });

  it("honours a heal spend on an uncut lock then adds the grant", () => {
    assert.equal(unpaidDeathDokaAlreadyHonouredOnLock(UNCUT, 190), false);
    assert.equal(
      committedDokaAfterGameKeyUnpaidDeath({
        pending: UNCUT,
        lockDoka: 190,
        gained: 1000,
        walletSeeded: true,
      }),
      1110,
    );
  });

  it("leaves the lock unchanged when the grant is zero", () => {
    assert.equal(
      committedDokaAfterGameKeyUnpaidDeath({
        pending: UNCUT,
        lockDoka: 200,
        gained: 0,
        walletSeeded: true,
      }),
      200,
    );
  });
});
