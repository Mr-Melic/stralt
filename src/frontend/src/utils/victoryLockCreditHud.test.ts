import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  creditLiveDoka,
  syncLiveDokaFromProp,
  writeLiveDoka,
} from "./itemShop.ts";
import { createProgressPersist } from "./progressPersist.ts";
import { nextLiveDokaAfterLockCredit } from "./victoryLockCreditHud.ts";

describe("nextLiveDokaAfterLockCredit", () => {
  it("adopts the committed absolute wallet after unseeded victory applyRewards", () => {
    // Chronology:
    // 1. World mounts before getCallerDokaBalance. Lock doka=0 unseeded, HUD 0.
    // 2. Victory applyRewards 200→280 (dokaEarned 80).
    // 3. lock.commit({ doka: 280 }) seeds.
    // 4. creditLiveDoka(0, 80) used to leave HUD at 80.
    // 5. GameFlow query 200: live 80 !== last prop 0, so syncLiveDokaFromProp
    //    keeps 80. 100 Doka shop/rename stay unaffordable despite lock 280.
    assert.equal(
      nextLiveDokaAfterLockCredit({
        walletSeededBeforeCredit: false,
        liveDoka: 0,
        creditDelta: 80,
        committedDoka: 280,
      }),
      280,
    );
  });

  it("adds the recap delta onto a seeded live wallet", () => {
    assert.equal(
      nextLiveDokaAfterLockCredit({
        walletSeededBeforeCredit: true,
        liveDoka: 200,
        creditDelta: 80,
        committedDoka: 280,
      }),
      280,
    );
  });

  it("does not replace a seeded recap-heal spend with absolute newDoka", () => {
    // Recap overlay is pointer-events: none. A paid heal deducted 10 while
    // victory applyRewards waited on the lock. newDoka is 280 (pre-heal).
    // Adding 80 onto 190 keeps the spend; snapping to 280 would refund it.
    assert.equal(
      nextLiveDokaAfterLockCredit({
        walletSeededBeforeCredit: true,
        liveDoka: 190,
        creditDelta: 80,
        committedDoka: 280,
      }),
      270,
    );
  });

  it("does not let a later GameFlow query overwrite the unseeded adopt", () => {
    const live = { current: 0 };
    writeLiveDoka(
      live,
      nextLiveDokaAfterLockCredit({
        walletSeededBeforeCredit: false,
        liveDoka: live.current,
        creditDelta: 80,
        committedDoka: 280,
      }),
    );
    assert.equal(live.current, 280);
    const synced = syncLiveDokaFromProp({
      propDoka: 200,
      prevPropDoka: 0,
      liveDoka: live.current,
    });
    assert.equal(synced.liveDoka, 280);
    assert.equal(synced.liveDoka >= 100, true);
  });

  it("reproduces the leftover creditLiveDoka undercount vs the helper", () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    assert.equal(lock.isWalletSeeded(), false);
    const live = { current: 0 };
    const walletSeededBeforeCredit = lock.isWalletSeeded();
    lock.commit({ doka: 280 });
    assert.equal(lock.isWalletSeeded(), true);

    const leftoverHud = creditLiveDoka({ current: 0 }, 80);
    assert.equal(leftoverHud, 80);
    const afterLeftoverQuery = syncLiveDokaFromProp({
      propDoka: 200,
      prevPropDoka: 0,
      liveDoka: leftoverHud,
    });
    assert.equal(
      afterLeftoverQuery.liveDoka,
      80,
      "leftover HUD 80 !== last prop 0 keeps the undercount",
    );

    writeLiveDoka(
      live,
      nextLiveDokaAfterLockCredit({
        walletSeededBeforeCredit,
        liveDoka: live.current,
        creditDelta: 80,
        committedDoka: lock.snapshot().doka,
      }),
    );
    assert.equal(live.current, 280);
  });
});
