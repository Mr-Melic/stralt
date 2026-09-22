import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { creditLiveDoka, syncLiveDokaFromProp } from "./itemShop.ts";
import { nextLiveDokaAfterOneShotCommit } from "./oneShotCreditHud.ts";
import {
  applySpendToCommitted,
  createProgressPersist,
  spendFromUiBalance,
} from "./progressPersist.ts";

describe("nextLiveDokaAfterOneShotCommit", () => {
  it("adopts the absolute newDoka when the lock was still a placeholder", () => {
    assert.equal(
      nextLiveDokaAfterOneShotCommit({
        walletSeededBeforeCommit: false,
        liveDoka: 0,
        pickupDelta: 50,
        committedDoka: 250,
      }),
      250,
    );
  });

  it("adds the pickup delta onto a seeded live wallet", () => {
    assert.equal(
      nextLiveDokaAfterOneShotCommit({
        walletSeededBeforeCommit: true,
        liveDoka: 200,
        pickupDelta: 50,
        committedDoka: 250,
      }),
      250,
    );
  });

  it("does not replace a seeded live spend with absolute newDoka", () => {
    // Recap heal deducted 10 while this one-shot waited on the lock.
    // applyRewards newDoka is 250 (pre-heal). Adding the 50 coin onto 190
    // keeps the spend; snapping to 250 would refund it.
    assert.equal(
      nextLiveDokaAfterOneShotCommit({
        walletSeededBeforeCommit: true,
        liveDoka: 190,
        pickupDelta: 50,
        committedDoka: 250,
      }),
      240,
    );
  });
});

describe("unseeded one-shot HUD vs recap shop affordability", () => {
  it("does not leave a short HUD that ignores the later wallet query", () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    assert.equal(lock.isWalletSeeded(), false);

    const live = { current: 0 };
    let prevProp = 0;

    const walletSeededBefore = lock.isWalletSeeded();
    lock.commit({ doka: 250 });
    live.current = nextLiveDokaAfterOneShotCommit({
      walletSeededBeforeCommit: walletSeededBefore,
      liveDoka: live.current,
      pickupDelta: 50,
      committedDoka: 250,
    });
    assert.equal(live.current, 250);
    assert.equal(lock.snapshot().doka, 250);

    const afterQuery = syncLiveDokaFromProp({
      propDoka: 200,
      prevPropDoka: prevProp,
      liveDoka: live.current,
    });
    prevProp = afterQuery.prevPropDoka;
    live.current = afterQuery.liveDoka;
    assert.equal(
      live.current,
      250,
      "a late placeholder query must not cut the post-pickup live wallet",
    );

    assert.equal(live.current >= 100, true, "100 Doka shop item is affordable");
  });

  it("the old placeholder+delta HUD stays stuck at 50 after the query", () => {
    const live = { current: 0 };
    creditLiveDoka(live, 50);
    assert.equal(live.current, 50);

    const afterQuery = syncLiveDokaFromProp({
      propDoka: 200,
      prevPropDoka: 0,
      liveDoka: live.current,
    });
    assert.equal(
      afterQuery.liveDoka,
      50,
      "diverged live 50 !== last prop 0, so query 200 is dropped",
    );
    assert.equal(afterQuery.liveDoka >= 100, false);
  });

  it("seeded spend-from-live still deducts only the heal cost from the lock", () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    const live = { current: 200 };
    live.current = nextLiveDokaAfterOneShotCommit({
      walletSeededBeforeCommit: true,
      liveDoka: live.current,
      pickupDelta: 50,
      committedDoka: 250,
    });
    lock.commit({ doka: 250 });
    assert.equal(live.current, 250);

    const next = 240;
    const spend = spendFromUiBalance(live.current, next);
    assert.equal(spend, 10);
    assert.equal(applySpendToCommitted(lock.snapshot().doka, spend), 240);
  });
});
