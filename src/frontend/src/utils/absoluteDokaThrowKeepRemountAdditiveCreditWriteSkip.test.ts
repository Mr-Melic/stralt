import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  absoluteDokaThrowKeepRemountAdditiveCreditKey,
  clearAbsoluteDokaThrowKeepRemountAdditiveCredit,
  committedDokaAfterAchievementCreditWithAbsoluteDokaThrowKeepRemount,
  committedDokaAfterGameKeyRedeemWithAbsoluteDokaThrowKeepRemount,
  dokaAfterShopSpendWithAbsoluteDokaThrowKeepRemountAdditiveCredit,
  dokaForAbsoluteDokaThrowKeepRemountAdditiveCredit,
  dokaFromAbsoluteDokaThrowAdditiveCreditWalletRecord,
  hasAbsoluteDokaThrowKeepRemountAdditiveCredit,
  noteAbsoluteDokaThrowKeepRemountAdditiveCredit,
  persistAdditiveCreditThroughAbsoluteDokaThrowKeepRemount,
  persistClaimThroughAbsoluteDokaThrowKeepRemount,
  persistRedeemThroughAbsoluteDokaThrowKeepRemount,
  readAbsoluteDokaThrowKeepRemountAdditiveCredit,
  sessionDokaAfterAbsoluteDokaThrowKeepRemountAdditiveCredit,
  shouldRefuseAbsoluteDokaThrowKeepRemountAdditiveCreditStaleDoka,
} from "./absoluteDokaThrowKeepRemountAdditiveCreditWriteSkip.ts";
import { clampSaveBattleStatsWrite } from "./absoluteStatsClamp.ts";
import { committedDokaAfterAchievementCredit } from "./achievementReward.ts";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applyShopCreditDeltaToUi,
  applySpendToCommitted,
  createProgressPersist,
} from "./progressPersist.ts";
import { committedDokaAfterRename } from "./renameCharacter.ts";
import { committedDokaAfterGameKeyRedeem } from "./shopPurchase.ts";

const ROLLBACK_DOKA = 200;
const CANISTER_DOKA_AFTER_HEAL = 183;
const CANISTER_DOKA_AFTER_SHOP = 150;
const HEAL_SPEND = 17;
const SHOP_SPEND = 50;
const FEAT_GRANT = 100;
const GAMEKEY_GRANT = 1000;
const LEVEL = 1;
const GAME_KEY = "A".repeat(120);

function memStorage(): DeathPenaltyStorage {
  const storage = new Map<string, string>();
  return {
    getItem: (k) => storage.get(k) ?? null,
    setItem: (k, v) => {
      storage.set(k, v);
    },
    removeItem: (k) => {
      storage.delete(k);
    },
  };
}

/** Production remount lock: GameFlow Doka after heal/shop-throw HUD rollback. */
function remountLock() {
  return createProgressPersist({
    doka: ROLLBACK_DOKA,
    xp: 100,
    level: LEVEL,
  });
}

function canisterAfterAbsoluteWrite(
  storedDoka: number,
  incomingDoka: number,
): number {
  return clampSaveBattleStatsWrite(
    { doka: storedDoka, xp: 100, level: LEVEL },
    { doka: incomingDoka, xp: 100, level: LEVEL },
  ).doka;
}

describe("absoluteDokaThrowKeepRemountAdditiveCreditKey", () => {
  it("reads the same #964 slot key, not #926's spend-keep key", () => {
    assert.equal(
      absoluteDokaThrowKeepRemountAdditiveCreditKey(1),
      "pbv_absolute_doka_throw_keep_remount_slot1",
    );
    assert.equal(
      absoluteDokaThrowKeepRemountAdditiveCreditKey(3),
      "pbv_absolute_doka_throw_keep_remount_slot3",
    );
    assert.notEqual(
      absoluteDokaThrowKeepRemountAdditiveCreditKey(1),
      "pbv_spend_keep_remount_slot1",
    );
    assert.notEqual(
      absoluteDokaThrowKeepRemountAdditiveCreditKey(1),
      "pbv_feat_doka_keep_remount_slot1",
    );
    assert.notEqual(
      absoluteDokaThrowKeepRemountAdditiveCreditKey(1),
      "pbv_gamekey_doka_keep_remount_slot1",
    );
  });
});

describe("note / read / clear AbsoluteDokaThrowKeepRemountAdditiveCredit", () => {
  it("round-trips the #964 { preDoka } shape", () => {
    const storage = memStorage();
    assert.equal(
      hasAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1),
      false,
    );
    noteAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1, ROLLBACK_DOKA);
    assert.deepEqual(
      readAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1),
      { preDoka: ROLLBACK_DOKA },
    );
    assert.equal(
      hasAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1),
      true,
    );
    clearAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1);
    assert.equal(
      readAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1),
      null,
    );
  });

  it("isolates character slots", () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1, ROLLBACK_DOKA);
    noteAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 2, 90);
    assert.deepEqual(
      readAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1),
      { preDoka: ROLLBACK_DOKA },
    );
    assert.deepEqual(
      readAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 2),
      { preDoka: 90 },
    );
    clearAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1);
    assert.equal(
      readAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1),
      null,
    );
    assert.equal(
      hasAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 2),
      true,
    );
  });
});

describe("dokaFromAbsoluteDokaThrowAdditiveCreditWalletRecord", () => {
  it("reads number, bigint, and { ok } wallets", () => {
    assert.equal(
      dokaFromAbsoluteDokaThrowAdditiveCreditWalletRecord(
        CANISTER_DOKA_AFTER_HEAL,
      ),
      183,
    );
    assert.equal(
      dokaFromAbsoluteDokaThrowAdditiveCreditWalletRecord(183n),
      183,
    );
    assert.equal(
      dokaFromAbsoluteDokaThrowAdditiveCreditWalletRecord({
        ok: CANISTER_DOKA_AFTER_SHOP,
      }),
      150,
    );
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(
      dokaFromAbsoluteDokaThrowAdditiveCreditWalletRecord(null),
      null,
    );
    assert.equal(dokaFromAbsoluteDokaThrowAdditiveCreditWalletRecord({}), null);
    assert.equal(
      dokaFromAbsoluteDokaThrowAdditiveCreditWalletRecord({ ok: "nope" }),
      null,
    );
  });
});

describe("shouldRefuseAbsoluteDokaThrowKeepRemountAdditiveCreditStaleDoka", () => {
  it("fail-closes when live still equals or sits above stamped preDoka", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: ROLLBACK_DOKA,
        stampedPreDoka: ROLLBACK_DOKA,
      }),
      true,
    );
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: 250,
        stampedPreDoka: ROLLBACK_DOKA,
      }),
      true,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: ROLLBACK_DOKA,
      }),
      true,
    );
  });

  it("does not refuse a dropped replica wallet", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: CANISTER_DOKA_AFTER_HEAL,
        stampedPreDoka: ROLLBACK_DOKA,
      }),
      false,
    );
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: CANISTER_DOKA_AFTER_SHOP,
        stampedPreDoka: ROLLBACK_DOKA,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountAdditiveCreditStaleDoka({
        keep: false,
        liveDoka: ROLLBACK_DOKA,
        stampedPreDoka: ROLLBACK_DOKA,
      }),
      false,
    );
  });
});

describe("heal saveBattleStats throw-after-accept then remount feat without unpaid death", () => {
  it("leftover remount claim commits 300 over canister 283", () => {
    // Chronology:
    // 1. World hydrated. Lock Doka 200. Canister 200.
    // 2. Doka-heal saveBattleStats accepts 183 then throws. Catch
    //    returns false. HUD rollback 200. #964 stamps preDoka=200.
    // 3. Actor reconnect remounts. Lock Doka 200.
    // 4. Claim committedDokaAfterAchievementCredit(200, 100) → 300.
    //    Canister adds 100 to 183 → 283.
    const leftoverCommit = committedDokaAfterAchievementCredit(
      ROLLBACK_DOKA,
      FEAT_GRANT,
    );
    assert.equal(leftoverCommit, 300);
    const canisterAfterClaim = CANISTER_DOKA_AFTER_HEAL + FEAT_GRANT;
    assert.equal(canisterAfterClaim, 283);
    assert.equal(
      leftoverCommit - canisterAfterClaim,
      HEAL_SPEND,
      "lock sits the original heal fee above stored",
    );
  });

  it("leftover shop after that claim writes 250 over canister 283", () => {
    const leftoverShop = applySpendToCommitted(
      committedDokaAfterAchievementCredit(ROLLBACK_DOKA, FEAT_GRANT),
      SHOP_SPEND,
    );
    assert.equal(leftoverShop, 250);
    assert.equal(
      canisterAfterAbsoluteWrite(283, leftoverShop),
      250,
      "incoming-below-stored refunds the 17 heal fee (correct remaining 233)",
    );
    assert.equal(
      applySpendToCommitted(CANISTER_DOKA_AFTER_HEAL + FEAT_GRANT, SHOP_SPEND),
      233,
    );
  });

  it("gated remount claim commits 283", () => {
    const gated =
      committedDokaAfterAchievementCreditWithAbsoluteDokaThrowKeepRemount({
        remountDoka: ROLLBACK_DOKA,
        liveDoka: CANISTER_DOKA_AFTER_HEAL,
        keep: true,
        stampedPreDoka: ROLLBACK_DOKA,
        granted: FEAT_GRANT,
      });
    assert.equal(gated, 283);
    const gatedShop =
      dokaAfterShopSpendWithAbsoluteDokaThrowKeepRemountAdditiveCredit({
        remountDoka: ROLLBACK_DOKA,
        liveDoka: CANISTER_DOKA_AFTER_HEAL,
        keep: true,
        stampedPreDoka: ROLLBACK_DOKA,
        granted: FEAT_GRANT,
        shopSpend: SHOP_SPEND,
      });
    assert.equal(gatedShop, 233);
    assert.equal(canisterAfterAbsoluteWrite(283, gatedShop ?? 0), 233);
  });
});

describe("shop saveBattleStats throw-after-accept then remount feat without unpaid death", () => {
  it("leftover remount claim then shop refunds the original 50 purchase", () => {
    // Items Buy accepts 150 then throws. Remount lock 200.
    // Claim commits 300; canister 150 + 100 = 250. Leftover shop spend
    // 50 writes 250 over stored 250 — the first purchase is refunded.
    const leftoverClaim = committedDokaAfterAchievementCredit(
      ROLLBACK_DOKA,
      FEAT_GRANT,
    );
    assert.equal(leftoverClaim, 300);
    const canisterAfterClaim = CANISTER_DOKA_AFTER_SHOP + FEAT_GRANT;
    assert.equal(canisterAfterClaim, 250);
    const leftoverShop = applySpendToCommitted(leftoverClaim, SHOP_SPEND);
    assert.equal(leftoverShop, 250);
    assert.equal(canisterAfterAbsoluteWrite(250, leftoverShop), 250);
    assert.equal(
      applySpendToCommitted(canisterAfterClaim, SHOP_SPEND),
      200,
      "correct remaining after honouring replica 150 then claim + shop",
    );
  });

  it("gated remount claim then shop writes 200", () => {
    const gatedClaim =
      committedDokaAfterAchievementCreditWithAbsoluteDokaThrowKeepRemount({
        remountDoka: ROLLBACK_DOKA,
        liveDoka: CANISTER_DOKA_AFTER_SHOP,
        keep: true,
        stampedPreDoka: ROLLBACK_DOKA,
        granted: FEAT_GRANT,
      });
    assert.equal(gatedClaim, 250);
    const gatedShop =
      dokaAfterShopSpendWithAbsoluteDokaThrowKeepRemountAdditiveCredit({
        remountDoka: ROLLBACK_DOKA,
        liveDoka: CANISTER_DOKA_AFTER_SHOP,
        keep: true,
        stampedPreDoka: ROLLBACK_DOKA,
        granted: FEAT_GRANT,
        shopSpend: SHOP_SPEND,
      });
    assert.equal(gatedShop, 200);
    assert.equal(canisterAfterAbsoluteWrite(250, gatedShop ?? 0), 200);
  });
});

describe("GameKey leftover when remount lock is rollback 200", () => {
  it("leftover remount redeem commits 1200 over canister 1183", () => {
    const leftover = committedDokaAfterGameKeyRedeem(
      ROLLBACK_DOKA,
      GAMEKEY_GRANT,
    );
    assert.equal(leftover, 1200);
    const canisterAfterRedeem = CANISTER_DOKA_AFTER_HEAL + GAMEKEY_GRANT;
    assert.equal(canisterAfterRedeem, 1183);
    const leftoverShop = applySpendToCommitted(leftover, SHOP_SPEND);
    assert.equal(leftoverShop, 1150);
    assert.equal(
      canisterAfterAbsoluteWrite(1183, leftoverShop),
      1150,
      "incoming-below-stored refunds the 17 heal fee after GameKey",
    );
  });

  it("gated remount redeem commits 1183", () => {
    const gated =
      committedDokaAfterGameKeyRedeemWithAbsoluteDokaThrowKeepRemount({
        remountDoka: ROLLBACK_DOKA,
        liveDoka: CANISTER_DOKA_AFTER_HEAL,
        keep: true,
        stampedPreDoka: ROLLBACK_DOKA,
        granted: GAMEKEY_GRANT,
      });
    assert.equal(gated, 1183);
  });

  it("gated remount redeem after shop throw commits 1150", () => {
    const gated =
      committedDokaAfterGameKeyRedeemWithAbsoluteDokaThrowKeepRemount({
        remountDoka: ROLLBACK_DOKA,
        liveDoka: CANISTER_DOKA_AFTER_SHOP,
        keep: true,
        stampedPreDoka: ROLLBACK_DOKA,
        granted: GAMEKEY_GRANT,
      });
    assert.equal(gated, 1150);
    assert.equal(applySpendToCommitted(gated ?? 0, SHOP_SPEND), 1100);
  });
});

describe("sessionDokaAfterAbsoluteDokaThrowKeepRemountAdditiveCredit", () => {
  it("ungated remount HUD stays rollback 200 so live credit adds onto a lie", () => {
    const session = sessionDokaAfterAbsoluteDokaThrowKeepRemountAdditiveCredit({
      remountDoka: ROLLBACK_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_HEAL,
      keep: false,
      stampedPreDoka: ROLLBACK_DOKA,
    });
    assert.equal(session, ROLLBACK_DOKA);
    assert.equal(applyShopCreditDeltaToUi(session, FEAT_GRANT), 300);
  });

  it("honour replica 183 so HUD credit matches the canister", () => {
    const session = sessionDokaAfterAbsoluteDokaThrowKeepRemountAdditiveCredit({
      remountDoka: ROLLBACK_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_HEAL,
      keep: true,
      stampedPreDoka: ROLLBACK_DOKA,
    });
    assert.equal(session, CANISTER_DOKA_AFTER_HEAL);
    assert.equal(applyShopCreditDeltaToUi(session, FEAT_GRANT), 283);
  });
});

describe("pickup-only remount still credits from Play-entry 200", () => {
  it("does not honour without a keep stamp", () => {
    const claimed =
      committedDokaAfterAchievementCreditWithAbsoluteDokaThrowKeepRemount({
        remountDoka: ROLLBACK_DOKA,
        liveDoka: CANISTER_DOKA_AFTER_HEAL,
        keep: false,
        stampedPreDoka: ROLLBACK_DOKA,
        granted: FEAT_GRANT,
      });
    assert.equal(claimed, 300);
    const shop =
      dokaAfterShopSpendWithAbsoluteDokaThrowKeepRemountAdditiveCredit({
        remountDoka: ROLLBACK_DOKA,
        liveDoka: CANISTER_DOKA_AFTER_HEAL,
        keep: false,
        stampedPreDoka: ROLLBACK_DOKA,
        granted: FEAT_GRANT,
        shopSpend: SHOP_SPEND,
      });
    assert.equal(shop, 250);
  });
});

describe("persistAdditiveCreditThroughAbsoluteDokaThrowKeepRemount", () => {
  it("adopts replica 183 then feat #ok commits 283", async () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1, ROLLBACK_DOKA);
    const persist = remountLock();
    let applied = false;
    const ok = await persistAdditiveCreditThroughAbsoluteDokaThrowKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_HEAL,
      applyAndCommit: async () => {
        applied = true;
        persist.commit({
          doka: committedDokaAfterAchievementCredit(
            persist.snapshot().doka,
            FEAT_GRANT,
          ),
        });
        return true;
      },
    });
    assert.equal(ok, true);
    assert.equal(applied, true);
    assert.equal(persist.snapshot().doka, 283);
    assert.equal(
      hasAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1),
      false,
      "clear the stamp after honour so leftover shop cannot reconstruct 200",
    );
  });

  it("adopts replica 150 then feat #ok commits 250", async () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1, ROLLBACK_DOKA);
    const persist = remountLock();
    await persistAdditiveCreditThroughAbsoluteDokaThrowKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_SHOP,
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterAchievementCredit(
            persist.snapshot().doka,
            FEAT_GRANT,
          ),
        });
        return true;
      },
    });
    assert.equal(persist.snapshot().doka, 250);
  });

  it("adopts replica 183 then GameKey #ok commits 1183", async () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1, ROLLBACK_DOKA);
    const persist = remountLock();
    await persistAdditiveCreditThroughAbsoluteDokaThrowKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_HEAL,
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterGameKeyRedeem(
            persist.snapshot().doka,
            GAMEKEY_GRANT,
          ),
        });
        return true;
      },
    });
    assert.equal(persist.snapshot().doka, 1183);
  });

  it("throws and does not apply when live Doka is still the rollback HUD", async () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1, ROLLBACK_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistAdditiveCreditThroughAbsoluteDokaThrowKeepRemount({
          persist,
          storage,
          slot: 1,
          readWallet: async () => ROLLBACK_DOKA,
          applyAndCommit: async () => {
            applied = true;
            persist.commit({
              doka: committedDokaAfterAchievementCredit(
                persist.snapshot().doka,
                FEAT_GRANT,
              ),
            });
            return true;
          },
        }),
      (err: unknown) =>
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
    );
    assert.equal(applied, false);
    assert.equal(persist.snapshot().doka, ROLLBACK_DOKA);
    assert.equal(
      hasAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1),
      true,
      "fail-close keeps the stamp",
    );
  });

  it("throws when getCallerDokaBalance fails so a stale claim cannot land", async () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1, ROLLBACK_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistAdditiveCreditThroughAbsoluteDokaThrowKeepRemount({
          persist,
          storage,
          slot: 1,
          readWallet: async () => {
            throw new Error("replica went away");
          },
          applyAndCommit: async () => {
            applied = true;
            return true;
          },
        }),
      (err: unknown) =>
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
    );
    assert.equal(applied, false);
  });

  it("applies when no stamp exists without fetching", async () => {
    const persist = remountLock();
    const ok = await persistAdditiveCreditThroughAbsoluteDokaThrowKeepRemount({
      persist,
      storage: memStorage(),
      slot: 1,
      readWallet: async () => {
        throw new Error("must not fetch without a stamp");
      },
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterAchievementCredit(
            persist.snapshot().doka,
            FEAT_GRANT,
          ),
        });
        return true;
      },
    });
    assert.equal(ok, true);
    assert.equal(persist.snapshot().doka, 300);
  });

  it("runs beforeEach so claim persist can flush unpaid death (#445)", async () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1, ROLLBACK_DOKA);
    let flushed = 0;
    const persist = createProgressPersist(
      { doka: ROLLBACK_DOKA, xp: 100, level: LEVEL },
      {
        beforeEach: async () => {
          flushed += 1;
        },
      },
    );
    await persistAdditiveCreditThroughAbsoluteDokaThrowKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_HEAL,
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterAchievementCredit(
            persist.snapshot().doka,
            FEAT_GRANT,
          ),
        });
        return true;
      },
    });
    assert.equal(flushed, 1);
  });
});

describe("persistClaimThroughAbsoluteDokaThrowKeepRemount", () => {
  it("production leftover claim on remount lock commits 300", async () => {
    const persist = remountLock();
    const leftover = await persistClaimThroughAbsoluteDokaThrowKeepRemount(
      {
        claimAchievementReward: async () => ({ ok: FEAT_GRANT }),
      },
      persist,
      "doka_1000",
      {
        storage: memStorage(),
        slot: 1,
        readWallet: async () => {
          throw new Error("must not fetch without a stamp");
        },
      },
    );
    assert.deepEqual(leftover, { ok: FEAT_GRANT });
    assert.equal(persist.snapshot().doka, 300);
  });

  it("gated remount claim honours replica then commits 283", async () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1, ROLLBACK_DOKA);
    const persist = remountLock();
    let claimed = 0;
    const parsed = await persistClaimThroughAbsoluteDokaThrowKeepRemount(
      {
        claimAchievementReward: async () => {
          claimed += 1;
          return { ok: FEAT_GRANT };
        },
      },
      persist,
      "doka_1000",
      {
        storage,
        slot: 1,
        readWallet: async () => CANISTER_DOKA_AFTER_HEAL,
      },
    );
    assert.deepEqual(parsed, { ok: FEAT_GRANT });
    assert.equal(claimed, 1);
    assert.equal(persist.snapshot().doka, 283);
    assert.equal(
      hasAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1),
      false,
    );
  });

  it("already claimed does not adopt a stale rollback onto the lock", async () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1, ROLLBACK_DOKA);
    const persist = remountLock();
    const parsed = await persistClaimThroughAbsoluteDokaThrowKeepRemount(
      {
        claimAchievementReward: async () => ({
          err: "Reward already claimed",
        }),
      },
      persist,
      "doka_1000",
      {
        storage,
        slot: 1,
        readWallet: async () => CANISTER_DOKA_AFTER_HEAL,
      },
    );
    assert.equal("err" in parsed, true);
    assert.equal(
      persist.snapshot().doka,
      CANISTER_DOKA_AFTER_HEAL,
      "honour still lands so a later leftover shop cannot reconstruct 200",
    );
  });
});

describe("persistRedeemThroughAbsoluteDokaThrowKeepRemount", () => {
  it("gated remount redeem honours replica then commits 1183", async () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1, ROLLBACK_DOKA);
    const persist = remountLock();
    const { result } = await persistRedeemThroughAbsoluteDokaThrowKeepRemount(
      {
        redeemGameKey: async () => ({ ok: GAMEKEY_GRANT }),
      },
      persist,
      GAME_KEY,
      {
        storage,
        slot: 1,
        readWallet: async () => CANISTER_DOKA_AFTER_HEAL,
      },
    );
    assert.deepEqual(result, { ok: GAMEKEY_GRANT });
    assert.equal(persist.snapshot().doka, 1183);
  });

  it("explicit redeemGameKey failed still honours replica without granting", async () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 1, ROLLBACK_DOKA);
    const persist = remountLock();
    const { result } = await persistRedeemThroughAbsoluteDokaThrowKeepRemount(
      {
        redeemGameKey: async () => ({ err: "Invalid GameKey" }),
      },
      persist,
      GAME_KEY,
      {
        storage,
        slot: 1,
        readWallet: async () => CANISTER_DOKA_AFTER_HEAL,
      },
    );
    assert.deepEqual(result, { err: "Invalid GameKey" });
    assert.equal(persist.snapshot().doka, CANISTER_DOKA_AFTER_HEAL);
  });
});

describe("distinct from #964 shop honour, #969 death, #977 rename, #657 session keep", () => {
  it("uses pbv_absolute_doka_throw_keep_remount_slotN, not feat/GameKey keep keys", () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, 2, ROLLBACK_DOKA);
    assert.equal(
      absoluteDokaThrowKeepRemountAdditiveCreditKey(2),
      "pbv_absolute_doka_throw_keep_remount_slot2",
    );
    assert.equal(
      storage.getItem("pbv_absolute_doka_throw_keep_remount_slot2") != null,
      true,
    );
    assert.equal(storage.getItem("pbv_spend_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_feat_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_gamekey_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot2"), null);
  });

  it("does not treat #964 remount shop spend 50 from 183 as this claim path", () => {
    const shopHonour = applySpendToCommitted(
      CANISTER_DOKA_AFTER_HEAL,
      SHOP_SPEND,
    );
    assert.equal(shopHonour, 133, "#964 gated shop path");
    const deathCut = Math.floor(CANISTER_DOKA_AFTER_HEAL * 0.6);
    assert.equal(deathCut, 109, "#969 taxes replica 183, not this claim");
    const leftoverRename = committedDokaAfterRename(ROLLBACK_DOKA);
    assert.equal(leftoverRename, 100, "#977 leftover rename, not this claim");
    const leftoverClaim = committedDokaAfterAchievementCredit(
      ROLLBACK_DOKA,
      FEAT_GRANT,
    );
    assert.notEqual(leftoverClaim, shopHonour);
    assert.notEqual(leftoverClaim, deathCut);
    assert.notEqual(leftoverClaim, leftoverRename);
  });

  it("does not skip leftover shop/heal honour — that stays #964", () => {
    const honour = dokaForAbsoluteDokaThrowKeepRemountAdditiveCredit({
      remountDoka: ROLLBACK_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_HEAL,
      keep: true,
      stampedPreDoka: ROLLBACK_DOKA,
    });
    assert.equal(honour, CANISTER_DOKA_AFTER_HEAL);
    assert.equal(
      applySpendToCommitted(honour ?? 0, SHOP_SPEND),
      133,
      "shop leftover still spends from honoured replica; this sidecar only gates claim/redeem",
    );
  });

  it("does not treat #977 remount rename debit as this additive path", () => {
    const leftoverRename = committedDokaAfterRename(ROLLBACK_DOKA);
    assert.equal(leftoverRename, 100);
    const leftoverClaim = committedDokaAfterAchievementCredit(
      ROLLBACK_DOKA,
      FEAT_GRANT,
    );
    assert.equal(leftoverClaim, 300);
    assert.equal(
      leftoverClaim - leftoverRename,
      200,
      "claim adds 100 onto 200; rename subtracts 100 from 200",
    );
  });
});
