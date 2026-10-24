import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clampSaveBattleStatsWrite } from "./absoluteStatsClamp.ts";
import { committedDokaAfterAchievementCredit } from "./achievementReward.ts";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applyShopCreditDeltaToUi,
  applySpendToCommitted,
  createProgressPersist,
} from "./progressPersist.ts";
import {
  RENAME_DOKA_COST,
  committedDokaAfterRename,
} from "./renameCharacter.ts";
import { committedDokaAfterGameKeyRedeem } from "./shopPurchase.ts";
import {
  clearSpendKeepRemountAdditiveCredit,
  committedDokaAfterAchievementCreditWithSpendKeepRemount,
  committedDokaAfterGameKeyRedeemWithSpendKeepRemount,
  dokaAfterShopSpendWithSpendKeepRemountAdditiveCredit,
  dokaForSpendKeepRemountAdditiveCredit,
  dokaFromSpendKeepAdditiveCreditWalletRecord,
  hasSpendKeepRemountAdditiveCredit,
  noteSpendKeepRemountAdditiveCredit,
  persistAdditiveCreditThroughSpendKeepRemount,
  persistClaimThroughSpendKeepRemount,
  persistRedeemThroughSpendKeepRemount,
  readSpendKeepRemountAdditiveCredit,
  sessionDokaAfterSpendKeepRemountAdditiveCredit,
  shouldRefuseSpendKeepRemountAdditiveCreditStaleDoka,
  spendKeepRemountAdditiveCreditKey,
} from "./spendKeepRemountAdditiveCreditWriteSkip.ts";

const PLAY_ENTRY_DOKA = 200;
const RENAME_THROW_CANISTER = PLAY_ENTRY_DOKA - RENAME_DOKA_COST;
const UPGRADE_COST = 10;
const UPGRADE_THROW_CANISTER = PLAY_ENTRY_DOKA - UPGRADE_COST;
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

/** Production remount lock: GameFlow Doka after rename/upgrade throw-after-debit. */
function remountLock() {
  return createProgressPersist({
    doka: PLAY_ENTRY_DOKA,
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

describe("spendKeepRemountAdditiveCreditKey", () => {
  it("reads the same #926 slot key, not #1021's shop-throw additive key", () => {
    assert.equal(
      spendKeepRemountAdditiveCreditKey(1),
      "pbv_spend_keep_remount_slot1",
    );
    assert.equal(
      spendKeepRemountAdditiveCreditKey(3),
      "pbv_spend_keep_remount_slot3",
    );
    assert.notEqual(
      spendKeepRemountAdditiveCreditKey(1),
      "pbv_absolute_doka_throw_keep_remount_slot1",
    );
    assert.notEqual(
      spendKeepRemountAdditiveCreditKey(1),
      "pbv_feat_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spendKeepRemountAdditiveCreditKey(1),
      "pbv_gamekey_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spendKeepRemountAdditiveCreditKey(1),
      "pbv_spend_keep_remount_death_slot1",
    );
  });
});

describe("note / read / clear SpendKeepRemountAdditiveCredit", () => {
  it("round-trips the #926 { preDoka } shape", () => {
    const storage = memStorage();
    assert.equal(hasSpendKeepRemountAdditiveCredit(storage, 1), false);
    noteSpendKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    assert.deepEqual(readSpendKeepRemountAdditiveCredit(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(hasSpendKeepRemountAdditiveCredit(storage, 1), true);
    clearSpendKeepRemountAdditiveCredit(storage, 1);
    assert.equal(readSpendKeepRemountAdditiveCredit(storage, 1), null);
  });

  it("isolates character slots", () => {
    const storage = memStorage();
    noteSpendKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    noteSpendKeepRemountAdditiveCredit(storage, 2, 90);
    assert.deepEqual(readSpendKeepRemountAdditiveCredit(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.deepEqual(readSpendKeepRemountAdditiveCredit(storage, 2), {
      preDoka: 90,
    });
    clearSpendKeepRemountAdditiveCredit(storage, 1);
    assert.equal(readSpendKeepRemountAdditiveCredit(storage, 1), null);
    assert.equal(hasSpendKeepRemountAdditiveCredit(storage, 2), true);
  });
});

describe("dokaFromSpendKeepAdditiveCreditWalletRecord", () => {
  it("reads number, bigint, and { ok } wallets", () => {
    assert.equal(
      dokaFromSpendKeepAdditiveCreditWalletRecord(RENAME_THROW_CANISTER),
      100,
    );
    assert.equal(dokaFromSpendKeepAdditiveCreditWalletRecord(100n), 100);
    assert.equal(
      dokaFromSpendKeepAdditiveCreditWalletRecord({
        ok: UPGRADE_THROW_CANISTER,
      }),
      190,
    );
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromSpendKeepAdditiveCreditWalletRecord(null), null);
    assert.equal(dokaFromSpendKeepAdditiveCreditWalletRecord({}), null);
    assert.equal(
      dokaFromSpendKeepAdditiveCreditWalletRecord({ ok: "nope" }),
      null,
    );
  });
});

describe("shouldRefuseSpendKeepRemountAdditiveCreditStaleDoka", () => {
  it("fail-closes when live still equals or sits above stamped preDoka", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
    assert.equal(
      shouldRefuseSpendKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: 250,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("does not refuse a dropped replica wallet", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: RENAME_THROW_CANISTER,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
    assert.equal(
      shouldRefuseSpendKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: UPGRADE_THROW_CANISTER,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountAdditiveCreditStaleDoka({
        keep: false,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });
});

describe("rename throw-after-debit then remount feat without unpaid death", () => {
  it("leftover remount claim commits 300 over canister 200", () => {
    // Chronology:
    // 1. World hydrated. Lock Doka 200. Canister 200.
    // 2. Rename deducts 100 then throws. Catch toasts. HUD stays 200.
    //    #926 stamps preDoka=200.
    // 3. Actor reconnect remounts. Lock Doka 200.
    // 4. Claim committedDokaAfterAchievementCredit(200, 100) → 300.
    //    Canister adds 100 to 100 → 200.
    const leftoverCommit = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
      FEAT_GRANT,
    );
    assert.equal(leftoverCommit, 300);
    const canisterAfterClaim = RENAME_THROW_CANISTER + FEAT_GRANT;
    assert.equal(canisterAfterClaim, 200);
    assert.equal(
      leftoverCommit - canisterAfterClaim,
      RENAME_DOKA_COST,
      "lock sits the first rename fee above stored",
    );
  });

  it("leftover shop after that claim never-raises 250 over canister 200", () => {
    const leftoverShop = applySpendToCommitted(
      committedDokaAfterAchievementCredit(PLAY_ENTRY_DOKA, FEAT_GRANT),
      SHOP_SPEND,
    );
    assert.equal(leftoverShop, 250);
    assert.equal(
      canisterAfterAbsoluteWrite(200, leftoverShop),
      200,
      "incoming-above-stored never-raise: free BuffShop item, canister stays 200",
    );
    assert.equal(
      applySpendToCommitted(RENAME_THROW_CANISTER + FEAT_GRANT, SHOP_SPEND),
      150,
    );
  });

  it("gated remount claim commits 200", () => {
    const gated = committedDokaAfterAchievementCreditWithSpendKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_THROW_CANISTER,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      granted: FEAT_GRANT,
    });
    assert.equal(gated, 200);
    const gatedShop = dokaAfterShopSpendWithSpendKeepRemountAdditiveCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_THROW_CANISTER,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      granted: FEAT_GRANT,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(gatedShop, 150);
    assert.equal(canisterAfterAbsoluteWrite(200, gatedShop ?? 0), 150);
  });
});

describe("upgrade throw-after-debit then remount feat refunds the fee", () => {
  it("leftover remount claim commits 300 over canister 290", () => {
    const leftoverCommit = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
      FEAT_GRANT,
    );
    assert.equal(leftoverCommit, 300);
    const canisterAfterClaim = UPGRADE_THROW_CANISTER + FEAT_GRANT;
    assert.equal(canisterAfterClaim, 290);
    assert.equal(
      leftoverCommit - canisterAfterClaim,
      UPGRADE_COST,
      "lock sits the upgrade fee above stored",
    );
  });

  it("leftover shop after that claim writes 250 over canister 290", () => {
    const leftoverShop = applySpendToCommitted(
      committedDokaAfterAchievementCredit(PLAY_ENTRY_DOKA, FEAT_GRANT),
      SHOP_SPEND,
    );
    assert.equal(leftoverShop, 250);
    assert.equal(
      canisterAfterAbsoluteWrite(290, leftoverShop),
      250,
      "incoming-below-stored refunds the 10 upgrade fee (correct remaining 240)",
    );
    assert.equal(
      applySpendToCommitted(UPGRADE_THROW_CANISTER + FEAT_GRANT, SHOP_SPEND),
      240,
    );
  });

  it("gated remount claim commits 290", () => {
    const gated = committedDokaAfterAchievementCreditWithSpendKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: UPGRADE_THROW_CANISTER,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      granted: FEAT_GRANT,
    });
    assert.equal(gated, 290);
    const gatedShop = dokaAfterShopSpendWithSpendKeepRemountAdditiveCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: UPGRADE_THROW_CANISTER,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      granted: FEAT_GRANT,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(gatedShop, 240);
    assert.equal(canisterAfterAbsoluteWrite(290, gatedShop ?? 0), 240);
  });
});

describe("GameKey leftover when remount lock is Play-entry 200", () => {
  it("leftover remount redeem commits 1200 over canister 1100", () => {
    const leftover = committedDokaAfterGameKeyRedeem(
      PLAY_ENTRY_DOKA,
      GAMEKEY_GRANT,
    );
    assert.equal(leftover, 1200);
    const canisterAfterRedeem = RENAME_THROW_CANISTER + GAMEKEY_GRANT;
    assert.equal(canisterAfterRedeem, 1100);
    const leftoverShop = applySpendToCommitted(leftover, SHOP_SPEND);
    assert.equal(leftoverShop, 1150);
    assert.equal(
      canisterAfterAbsoluteWrite(1100, leftoverShop),
      1100,
      "incoming-above-stored never-raise: free BuffShop item after GameKey",
    );
  });

  it("gated remount redeem commits 1100", () => {
    const gated = committedDokaAfterGameKeyRedeemWithSpendKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_THROW_CANISTER,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      granted: GAMEKEY_GRANT,
    });
    assert.equal(gated, 1100);
  });

  it("gated remount redeem after upgrade throw commits 1190", () => {
    const gated = committedDokaAfterGameKeyRedeemWithSpendKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: UPGRADE_THROW_CANISTER,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      granted: GAMEKEY_GRANT,
    });
    assert.equal(gated, 1190);
    assert.equal(applySpendToCommitted(gated ?? 0, SHOP_SPEND), 1140);
  });
});

describe("sessionDokaAfterSpendKeepRemountAdditiveCredit", () => {
  it("ungated remount HUD stays Play-entry 200 so live credit adds onto a lie", () => {
    const session = sessionDokaAfterSpendKeepRemountAdditiveCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_THROW_CANISTER,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, PLAY_ENTRY_DOKA);
    assert.equal(applyShopCreditDeltaToUi(session, FEAT_GRANT), 300);
  });

  it("honour replica 100 so HUD credit matches the canister", () => {
    const session = sessionDokaAfterSpendKeepRemountAdditiveCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_THROW_CANISTER,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, RENAME_THROW_CANISTER);
    assert.equal(applyShopCreditDeltaToUi(session, FEAT_GRANT), 200);
  });
});

describe("pickup-only remount still credits from Play-entry 200", () => {
  it("does not honour without a keep stamp", () => {
    const claimed = committedDokaAfterAchievementCreditWithSpendKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_THROW_CANISTER,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      granted: FEAT_GRANT,
    });
    assert.equal(claimed, 300);
    const shop = dokaAfterShopSpendWithSpendKeepRemountAdditiveCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_THROW_CANISTER,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      granted: FEAT_GRANT,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(shop, 250);
  });
});

describe("persistAdditiveCreditThroughSpendKeepRemount", () => {
  it("adopts replica 100 then feat #ok commits 200", async () => {
    const storage = memStorage();
    noteSpendKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    const ok = await persistAdditiveCreditThroughSpendKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => RENAME_THROW_CANISTER,
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
    assert.equal(persist.snapshot().doka, 200);
    assert.equal(
      hasSpendKeepRemountAdditiveCredit(storage, 1),
      false,
      "clear the stamp after honour so leftover shop cannot reconstruct 200",
    );
  });

  it("adopts replica 190 then feat #ok commits 290", async () => {
    const storage = memStorage();
    noteSpendKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    await persistAdditiveCreditThroughSpendKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => UPGRADE_THROW_CANISTER,
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
    assert.equal(persist.snapshot().doka, 290);
  });

  it("adopts replica 100 then GameKey #ok commits 1100", async () => {
    const storage = memStorage();
    noteSpendKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    await persistAdditiveCreditThroughSpendKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => RENAME_THROW_CANISTER,
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
    assert.equal(persist.snapshot().doka, 1100);
  });

  it("throws and does not apply when live Doka is still Play-entry", async () => {
    const storage = memStorage();
    noteSpendKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistAdditiveCreditThroughSpendKeepRemount({
          persist,
          storage,
          slot: 1,
          readWallet: async () => PLAY_ENTRY_DOKA,
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
    assert.equal(persist.snapshot().doka, PLAY_ENTRY_DOKA);
    assert.equal(
      hasSpendKeepRemountAdditiveCredit(storage, 1),
      true,
      "fail-close keeps the stamp",
    );
  });

  it("throws when getCallerDokaBalance fails so a stale claim cannot land", async () => {
    const storage = memStorage();
    noteSpendKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistAdditiveCreditThroughSpendKeepRemount({
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
    const ok = await persistAdditiveCreditThroughSpendKeepRemount({
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
    noteSpendKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    let flushed = 0;
    const persist = createProgressPersist(
      { doka: PLAY_ENTRY_DOKA, xp: 100, level: LEVEL },
      {
        beforeEach: async () => {
          flushed += 1;
        },
      },
    );
    await persistAdditiveCreditThroughSpendKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => RENAME_THROW_CANISTER,
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

describe("persistClaimThroughSpendKeepRemount", () => {
  it("production leftover claim on remount lock commits 300", async () => {
    const persist = remountLock();
    const leftover = await persistClaimThroughSpendKeepRemount(
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

  it("gated remount claim honours replica then commits 200", async () => {
    const storage = memStorage();
    noteSpendKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let claimed = 0;
    const parsed = await persistClaimThroughSpendKeepRemount(
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
        readWallet: async () => RENAME_THROW_CANISTER,
      },
    );
    assert.deepEqual(parsed, { ok: FEAT_GRANT });
    assert.equal(claimed, 1);
    assert.equal(persist.snapshot().doka, 200);
    assert.equal(hasSpendKeepRemountAdditiveCredit(storage, 1), false);
  });

  it("already claimed does not adopt a stale Play-entry onto the lock", async () => {
    const storage = memStorage();
    noteSpendKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    const parsed = await persistClaimThroughSpendKeepRemount(
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
        readWallet: async () => RENAME_THROW_CANISTER,
      },
    );
    assert.equal("err" in parsed, true);
    assert.equal(
      persist.snapshot().doka,
      RENAME_THROW_CANISTER,
      "honour still lands so a later leftover shop cannot reconstruct 200",
    );
  });
});

describe("persistRedeemThroughSpendKeepRemount", () => {
  it("gated remount redeem honours replica then commits 1100", async () => {
    const storage = memStorage();
    noteSpendKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    const { result } = await persistRedeemThroughSpendKeepRemount(
      {
        redeemGameKey: async () => ({ ok: GAMEKEY_GRANT }),
      },
      persist,
      GAME_KEY,
      {
        storage,
        slot: 1,
        readWallet: async () => RENAME_THROW_CANISTER,
      },
    );
    assert.deepEqual(result, { ok: GAMEKEY_GRANT });
    assert.equal(persist.snapshot().doka, 1100);
  });

  it("explicit redeemGameKey failed still honours replica without granting", async () => {
    const storage = memStorage();
    noteSpendKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    const { result } = await persistRedeemThroughSpendKeepRemount(
      {
        redeemGameKey: async () => ({ err: "Invalid GameKey" }),
      },
      persist,
      GAME_KEY,
      {
        storage,
        slot: 1,
        readWallet: async () => RENAME_THROW_CANISTER,
      },
    );
    assert.deepEqual(result, { err: "Invalid GameKey" });
    assert.equal(persist.snapshot().doka, RENAME_THROW_CANISTER);
  });
});

describe("distinct from #926 shop honour, #938 death, #1002 rename, #1021 shop-throw claim", () => {
  it("uses pbv_spend_keep_remount_slotN, not shop-throw / feat keep keys", () => {
    const storage = memStorage();
    noteSpendKeepRemountAdditiveCredit(storage, 2, PLAY_ENTRY_DOKA);
    assert.equal(
      spendKeepRemountAdditiveCreditKey(2),
      "pbv_spend_keep_remount_slot2",
    );
    assert.equal(storage.getItem("pbv_spend_keep_remount_slot2") != null, true);
    assert.equal(
      storage.getItem("pbv_absolute_doka_throw_keep_remount_slot2"),
      null,
    );
    assert.equal(storage.getItem("pbv_feat_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_gamekey_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot2"), null);
  });

  it("does not treat #926 remount shop spend 50 from 100 as this claim path", () => {
    const shopHonour = applySpendToCommitted(RENAME_THROW_CANISTER, SHOP_SPEND);
    assert.equal(shopHonour, 50, "#926 gated shop path");
    const deathCut = Math.floor(RENAME_THROW_CANISTER * 0.6);
    assert.equal(deathCut, 60, "#938 taxes replica 100, not this claim");
    const leftoverRename = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.equal(leftoverRename, 100, "#1002 leftover rename, not this claim");
    const leftoverClaim = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
      FEAT_GRANT,
    );
    assert.notEqual(leftoverClaim, shopHonour);
    assert.notEqual(leftoverClaim, deathCut);
    assert.notEqual(leftoverClaim, leftoverRename);
  });

  it("does not skip leftover shop/heal honour — that stays #926", () => {
    const honour = dokaForSpendKeepRemountAdditiveCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_THROW_CANISTER,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(honour, RENAME_THROW_CANISTER);
    assert.equal(
      applySpendToCommitted(honour ?? 0, SHOP_SPEND),
      50,
      "shop leftover still spends from honoured replica; this sidecar only gates claim/redeem",
    );
  });

  it("does not treat #1002 remount rename debit as this additive path", () => {
    const leftoverRename = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.equal(leftoverRename, 100);
    const leftoverClaim = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
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
