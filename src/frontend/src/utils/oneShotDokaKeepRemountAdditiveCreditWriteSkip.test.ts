import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clampSaveBattleStatsWrite } from "./absoluteStatsClamp.ts";
import { committedDokaAfterAchievementCredit } from "./achievementReward.ts";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  clearOneShotDokaKeepRemountAdditiveCredit,
  committedDokaAfterAchievementCreditWithOneShotDokaKeepRemount,
  committedDokaAfterGameKeyRedeemWithOneShotDokaKeepRemount,
  dokaAfterShopSpendWithOneShotDokaKeepRemountAdditiveCredit,
  dokaForOneShotDokaKeepRemountAdditiveCredit,
  dokaFromOneShotDokaKeepAdditiveCreditWalletRecord,
  hasOneShotDokaKeepRemountAdditiveCredit,
  noteOneShotDokaKeepRemountAdditiveCredit,
  oneShotDokaKeepRemountAdditiveCreditKey,
  persistAdditiveCreditThroughOneShotDokaKeepRemount,
  persistClaimThroughOneShotDokaKeepRemount,
  persistRedeemThroughOneShotDokaKeepRemount,
  readOneShotDokaKeepRemountAdditiveCredit,
  sessionDokaAfterOneShotDokaKeepRemountAdditiveCredit,
  shouldRefuseOneShotDokaKeepRemountAdditiveCreditStaleDoka,
} from "./oneShotDokaKeepRemountAdditiveCreditWriteSkip.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applyShopCreditDeltaToUi,
  applySpendToCommitted,
  createProgressPersist,
} from "./progressPersist.ts";
import { committedDokaAfterRename } from "./renameCharacter.ts";
import { committedDokaAfterGameKeyRedeem } from "./shopPurchase.ts";

const PLAY_ENTRY_DOKA = 200;
const ONESHOT_GRANT = 50;
const CANISTER_DOKA_AFTER_ONESHOT = PLAY_ENTRY_DOKA + ONESHOT_GRANT;
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

/** Production remount lock: GameFlow Doka after one-shot transport-keep. */
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

describe("oneShotDokaKeepRemountAdditiveCreditKey", () => {
  it("reads the same #800 slot key, not victory / Boss Rush / shop-throw keys", () => {
    assert.equal(
      oneShotDokaKeepRemountAdditiveCreditKey(1),
      "pbv_oneshot_doka_keep_remount_slot1",
    );
    assert.equal(
      oneShotDokaKeepRemountAdditiveCreditKey(3),
      "pbv_oneshot_doka_keep_remount_slot3",
    );
    assert.notEqual(
      oneShotDokaKeepRemountAdditiveCreditKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    assert.notEqual(
      oneShotDokaKeepRemountAdditiveCreditKey(1),
      "pbv_boss_rush_doka_keep_remount_slot1",
    );
    assert.notEqual(
      oneShotDokaKeepRemountAdditiveCreditKey(1),
      "pbv_gamekey_doka_keep_remount_slot1",
    );
    assert.notEqual(
      oneShotDokaKeepRemountAdditiveCreditKey(1),
      "pbv_feat_doka_keep_remount_slot1",
    );
    assert.notEqual(
      oneShotDokaKeepRemountAdditiveCreditKey(1),
      "pbv_absolute_doka_throw_keep_remount_slot1",
    );
    assert.notEqual(
      oneShotDokaKeepRemountAdditiveCreditKey(1),
      "pbv_spend_keep_remount_slot1",
    );
  });
});

describe("note / read / clear OneShotDokaKeepRemountAdditiveCredit", () => {
  it("round-trips the #800 { preDoka } shape", () => {
    const storage = memStorage();
    assert.equal(hasOneShotDokaKeepRemountAdditiveCredit(storage, 1), false);
    noteOneShotDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    assert.deepEqual(readOneShotDokaKeepRemountAdditiveCredit(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(hasOneShotDokaKeepRemountAdditiveCredit(storage, 1), true);
    clearOneShotDokaKeepRemountAdditiveCredit(storage, 1);
    assert.equal(readOneShotDokaKeepRemountAdditiveCredit(storage, 1), null);
  });

  it("isolates character slots", () => {
    const storage = memStorage();
    noteOneShotDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    noteOneShotDokaKeepRemountAdditiveCredit(storage, 2, 90);
    assert.deepEqual(readOneShotDokaKeepRemountAdditiveCredit(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.deepEqual(readOneShotDokaKeepRemountAdditiveCredit(storage, 2), {
      preDoka: 90,
    });
    clearOneShotDokaKeepRemountAdditiveCredit(storage, 1);
    assert.equal(readOneShotDokaKeepRemountAdditiveCredit(storage, 1), null);
    assert.equal(hasOneShotDokaKeepRemountAdditiveCredit(storage, 2), true);
  });
});

describe("dokaFromOneShotDokaKeepAdditiveCreditWalletRecord", () => {
  it("reads number, bigint, and { ok } wallets", () => {
    assert.equal(
      dokaFromOneShotDokaKeepAdditiveCreditWalletRecord(
        CANISTER_DOKA_AFTER_ONESHOT,
      ),
      250,
    );
    assert.equal(dokaFromOneShotDokaKeepAdditiveCreditWalletRecord(250n), 250);
    assert.equal(
      dokaFromOneShotDokaKeepAdditiveCreditWalletRecord({
        ok: CANISTER_DOKA_AFTER_ONESHOT,
      }),
      250,
    );
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromOneShotDokaKeepAdditiveCreditWalletRecord(null), null);
    assert.equal(dokaFromOneShotDokaKeepAdditiveCreditWalletRecord({}), null);
    assert.equal(
      dokaFromOneShotDokaKeepAdditiveCreditWalletRecord({ ok: "nope" }),
      null,
    );
  });
});

describe("shouldRefuseOneShotDokaKeepRemountAdditiveCreditStaleDoka", () => {
  it("fail-closes when live still equals or sits below stamped preDoka", () => {
    assert.equal(
      shouldRefuseOneShotDokaKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
    assert.equal(
      shouldRefuseOneShotDokaKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: 0,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseOneShotDokaKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("does not refuse a risen replica wallet", () => {
    assert.equal(
      shouldRefuseOneShotDokaKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: CANISTER_DOKA_AFTER_ONESHOT,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseOneShotDokaKeepRemountAdditiveCreditStaleDoka({
        keep: false,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });
});

describe("one-shot applyRewards transport-keep then remount feat without unpaid death", () => {
  it("leftover remount claim commits 300 over canister 350", () => {
    // Chronology:
    // 1. World hydrated. Lock Doka 200. Canister 200.
    // 2. Ground persistDokaCreditResult applyRewards accepts 250 then
    //    transport-misses. Confirm still 200. settle is keep. HUD stays
    //    200. #800 stamps preDoka=200. Pickup id already claimed.
    // 3. Actor reconnect remounts. Lock Doka 200.
    // 4. Claim committedDokaAfterAchievementCredit(200, 100) → 300.
    //    Canister adds 100 to 250 → 350.
    const leftoverCommit = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
      FEAT_GRANT,
    );
    assert.equal(leftoverCommit, 300);
    const canisterAfterClaim = CANISTER_DOKA_AFTER_ONESHOT + FEAT_GRANT;
    assert.equal(canisterAfterClaim, 350);
    assert.equal(
      canisterAfterClaim - leftoverCommit,
      ONESHOT_GRANT,
      "lock sits the pickup grant below stored",
    );
  });

  it("leftover shop after that claim writes 250 over canister 350", () => {
    const leftoverShop = applySpendToCommitted(
      committedDokaAfterAchievementCredit(PLAY_ENTRY_DOKA, FEAT_GRANT),
      SHOP_SPEND,
    );
    assert.equal(leftoverShop, 250);
    assert.equal(
      canisterAfterAbsoluteWrite(350, leftoverShop),
      250,
      "incoming-below-stored wipes the 50 pickup (correct remaining 300)",
    );
    assert.equal(
      applySpendToCommitted(
        CANISTER_DOKA_AFTER_ONESHOT + FEAT_GRANT,
        SHOP_SPEND,
      ),
      300,
    );
  });

  it("gated remount claim commits 350", () => {
    const gated = committedDokaAfterAchievementCreditWithOneShotDokaKeepRemount(
      {
        remountDoka: PLAY_ENTRY_DOKA,
        liveDoka: CANISTER_DOKA_AFTER_ONESHOT,
        keep: true,
        stampedPreDoka: PLAY_ENTRY_DOKA,
        granted: FEAT_GRANT,
      },
    );
    assert.equal(gated, 350);
    const gatedShop =
      dokaAfterShopSpendWithOneShotDokaKeepRemountAdditiveCredit({
        remountDoka: PLAY_ENTRY_DOKA,
        liveDoka: CANISTER_DOKA_AFTER_ONESHOT,
        keep: true,
        stampedPreDoka: PLAY_ENTRY_DOKA,
        granted: FEAT_GRANT,
        shopSpend: SHOP_SPEND,
      });
    assert.equal(gatedShop, 300);
    assert.equal(canisterAfterAbsoluteWrite(350, gatedShop ?? 0), 300);
  });
});

describe("GameKey leftover when remount lock is Play-entry 200", () => {
  it("leftover remount redeem commits 1200 over canister 1250", () => {
    const leftover = committedDokaAfterGameKeyRedeem(
      PLAY_ENTRY_DOKA,
      GAMEKEY_GRANT,
    );
    assert.equal(leftover, 1200);
    const canisterAfterRedeem = CANISTER_DOKA_AFTER_ONESHOT + GAMEKEY_GRANT;
    assert.equal(canisterAfterRedeem, 1250);
    const leftoverShop = applySpendToCommitted(leftover, SHOP_SPEND);
    assert.equal(leftoverShop, 1150);
    assert.equal(
      canisterAfterAbsoluteWrite(1250, leftoverShop),
      1150,
      "incoming-below-stored wipes the 50 pickup after GameKey",
    );
  });

  it("gated remount redeem commits 1250", () => {
    const gated = committedDokaAfterGameKeyRedeemWithOneShotDokaKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_ONESHOT,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      granted: GAMEKEY_GRANT,
    });
    assert.equal(gated, 1250);
    assert.equal(applySpendToCommitted(gated ?? 0, SHOP_SPEND), 1200);
  });
});

describe("sessionDokaAfterOneShotDokaKeepRemountAdditiveCredit", () => {
  it("ungated remount HUD stays Play-entry 200 so live credit adds onto a lie", () => {
    const session = sessionDokaAfterOneShotDokaKeepRemountAdditiveCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_ONESHOT,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, PLAY_ENTRY_DOKA);
    assert.equal(applyShopCreditDeltaToUi(session, FEAT_GRANT), 300);
  });

  it("honour replica 250 so HUD credit matches the canister", () => {
    const session = sessionDokaAfterOneShotDokaKeepRemountAdditiveCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_ONESHOT,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, CANISTER_DOKA_AFTER_ONESHOT);
    assert.equal(applyShopCreditDeltaToUi(session, FEAT_GRANT), 350);
  });
});

describe("pickup-only remount still credits from Play-entry 200", () => {
  it("does not honour without a keep stamp", () => {
    const claimed =
      committedDokaAfterAchievementCreditWithOneShotDokaKeepRemount({
        remountDoka: PLAY_ENTRY_DOKA,
        liveDoka: CANISTER_DOKA_AFTER_ONESHOT,
        keep: false,
        stampedPreDoka: PLAY_ENTRY_DOKA,
        granted: FEAT_GRANT,
      });
    assert.equal(claimed, 300);
    const shop = dokaAfterShopSpendWithOneShotDokaKeepRemountAdditiveCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_ONESHOT,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      granted: FEAT_GRANT,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(shop, 250);
  });
});

describe("persistAdditiveCreditThroughOneShotDokaKeepRemount", () => {
  it("adopts replica 250 then feat #ok commits 350", async () => {
    const storage = memStorage();
    noteOneShotDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    const ok = await persistAdditiveCreditThroughOneShotDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_ONESHOT,
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
    assert.equal(persist.snapshot().doka, 350);
    assert.equal(
      hasOneShotDokaKeepRemountAdditiveCredit(storage, 1),
      false,
      "clear the stamp after honour so leftover shop cannot reconstruct 200",
    );
  });

  it("adopts replica 250 then GameKey #ok commits 1250", async () => {
    const storage = memStorage();
    noteOneShotDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    await persistAdditiveCreditThroughOneShotDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_ONESHOT,
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
    assert.equal(persist.snapshot().doka, 1250);
  });

  it("throws and does not apply when live Doka is still Play-entry", async () => {
    const storage = memStorage();
    noteOneShotDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistAdditiveCreditThroughOneShotDokaKeepRemount({
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
      hasOneShotDokaKeepRemountAdditiveCredit(storage, 1),
      true,
      "fail-close keeps the stamp",
    );
  });

  it("throws when getCallerDokaBalance fails so a stale claim cannot land", async () => {
    const storage = memStorage();
    noteOneShotDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistAdditiveCreditThroughOneShotDokaKeepRemount({
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
    const ok = await persistAdditiveCreditThroughOneShotDokaKeepRemount({
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
    noteOneShotDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    let flushed = 0;
    const persist = createProgressPersist(
      { doka: PLAY_ENTRY_DOKA, xp: 100, level: LEVEL },
      {
        beforeEach: async () => {
          flushed += 1;
        },
      },
    );
    await persistAdditiveCreditThroughOneShotDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_ONESHOT,
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

describe("persistClaimThroughOneShotDokaKeepRemount", () => {
  it("production leftover claim on remount lock commits 300", async () => {
    const persist = remountLock();
    const leftover = await persistClaimThroughOneShotDokaKeepRemount(
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

  it("gated remount claim honours replica then commits 350", async () => {
    const storage = memStorage();
    noteOneShotDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let claimed = 0;
    const parsed = await persistClaimThroughOneShotDokaKeepRemount(
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
        readWallet: async () => CANISTER_DOKA_AFTER_ONESHOT,
      },
    );
    assert.deepEqual(parsed, { ok: FEAT_GRANT });
    assert.equal(claimed, 1);
    assert.equal(persist.snapshot().doka, 350);
    assert.equal(hasOneShotDokaKeepRemountAdditiveCredit(storage, 1), false);
  });

  it("already claimed does not adopt a stale Play-entry onto the lock", async () => {
    const storage = memStorage();
    noteOneShotDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    const parsed = await persistClaimThroughOneShotDokaKeepRemount(
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
        readWallet: async () => CANISTER_DOKA_AFTER_ONESHOT,
      },
    );
    assert.equal("err" in parsed, true);
    assert.equal(
      persist.snapshot().doka,
      CANISTER_DOKA_AFTER_ONESHOT,
      "honour still lands so a later leftover shop cannot reconstruct 200",
    );
  });
});

describe("persistRedeemThroughOneShotDokaKeepRemount", () => {
  it("gated remount redeem honours replica then commits 1250", async () => {
    const storage = memStorage();
    noteOneShotDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    const { result } = await persistRedeemThroughOneShotDokaKeepRemount(
      {
        redeemGameKey: async () => ({ ok: GAMEKEY_GRANT }),
      },
      persist,
      GAME_KEY,
      {
        storage,
        slot: 1,
        readWallet: async () => CANISTER_DOKA_AFTER_ONESHOT,
      },
    );
    assert.deepEqual(result, { ok: GAMEKEY_GRANT });
    assert.equal(persist.snapshot().doka, 1250);
  });

  it("explicit redeemGameKey failed still honours replica without granting", async () => {
    const storage = memStorage();
    noteOneShotDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    const { result } = await persistRedeemThroughOneShotDokaKeepRemount(
      {
        redeemGameKey: async () => ({ err: "Invalid GameKey" }),
      },
      persist,
      GAME_KEY,
      {
        storage,
        slot: 1,
        readWallet: async () => CANISTER_DOKA_AFTER_ONESHOT,
      },
    );
    assert.deepEqual(result, { err: "Invalid GameKey" });
    assert.equal(persist.snapshot().doka, CANISTER_DOKA_AFTER_ONESHOT);
  });
});

describe("distinct from #800 shop honour, #877 death, #986 rename, #1028 victory claim", () => {
  it("uses pbv_oneshot_doka_keep_remount_slotN, not victory/feat/GameKey keep keys", () => {
    const storage = memStorage();
    noteOneShotDokaKeepRemountAdditiveCredit(storage, 2, PLAY_ENTRY_DOKA);
    assert.equal(
      oneShotDokaKeepRemountAdditiveCreditKey(2),
      "pbv_oneshot_doka_keep_remount_slot2",
    );
    assert.equal(
      storage.getItem("pbv_oneshot_doka_keep_remount_slot2") != null,
      true,
    );
    assert.equal(storage.getItem("pbv_victory_doka_keep_remount_slot2"), null);
    assert.equal(
      storage.getItem("pbv_boss_rush_doka_keep_remount_slot2"),
      null,
    );
    assert.equal(storage.getItem("pbv_gamekey_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_feat_doka_keep_remount_slot2"), null);
    assert.equal(
      storage.getItem("pbv_absolute_doka_throw_keep_remount_slot2"),
      null,
    );
    assert.equal(storage.getItem("pbv_spend_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot2"), null);
  });

  it("does not treat #800 remount shop spend 50 from 250 as this claim path", () => {
    const shopHonour = applySpendToCommitted(
      CANISTER_DOKA_AFTER_ONESHOT,
      SHOP_SPEND,
    );
    assert.equal(shopHonour, 200, "#800 gated shop path");
    const deathCut = Math.floor(CANISTER_DOKA_AFTER_ONESHOT * 0.6);
    assert.equal(deathCut, 150, "#877 taxes replica 250, not this claim");
    const leftoverRename = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.equal(leftoverRename, 100, "#986 leftover rename, not this claim");
    const leftoverClaim = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
      FEAT_GRANT,
    );
    assert.notEqual(leftoverClaim, shopHonour);
    assert.notEqual(leftoverClaim, deathCut);
    assert.notEqual(leftoverClaim, leftoverRename);
  });

  it("does not skip leftover shop/heal honour — that stays #800", () => {
    const honour = dokaForOneShotDokaKeepRemountAdditiveCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_ONESHOT,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(honour, CANISTER_DOKA_AFTER_ONESHOT);
    assert.equal(
      applySpendToCommitted(honour ?? 0, SHOP_SPEND),
      200,
      "shop leftover still spends from honoured replica; this sidecar only gates claim/redeem",
    );
  });

  it("does not treat #986 remount rename debit as this additive path", () => {
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

  it("does not treat #1028 victory remount claim as this one-shot stamp", () => {
    assert.notEqual(
      oneShotDokaKeepRemountAdditiveCreditKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    const leftoverClaim = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
      FEAT_GRANT,
    );
    const canisterAfterClaim = CANISTER_DOKA_AFTER_ONESHOT + FEAT_GRANT;
    assert.equal(leftoverClaim, 300);
    assert.equal(canisterAfterClaim, 350);
    assert.equal(
      canisterAfterClaim - leftoverClaim,
      ONESHOT_GRANT,
      "this leftover sits the risen pickup below stored on the #800 stamp",
    );
  });

  it("does not treat #1025 Boss Rush remount claim (rise 500) as this +50", () => {
    const brLeftoverClaim = 300;
    const brCanisterAfterClaim = 800;
    assert.equal(
      brCanisterAfterClaim - brLeftoverClaim,
      500,
      "#1025 leftover sits the room-clear grant below stored",
    );
    const leftoverClaim = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
      FEAT_GRANT,
    );
    const canisterAfterClaim = CANISTER_DOKA_AFTER_ONESHOT + FEAT_GRANT;
    assert.equal(leftoverClaim, 300);
    assert.equal(canisterAfterClaim, 350);
    assert.equal(
      canisterAfterClaim - leftoverClaim,
      ONESHOT_GRANT,
      "this leftover sits the risen pickup below stored",
    );
  });

  it("does not treat #1021 shop/heal-throw remount claim (drop) as this rise", () => {
    const shopThrowClaimOverHeal = 300;
    const shopThrowCanisterAfterHealClaim = 283;
    assert.equal(
      shopThrowClaimOverHeal - shopThrowCanisterAfterHealClaim,
      17,
      "#1021 leftover sits the heal fee above stored",
    );
    const leftoverClaim = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
      FEAT_GRANT,
    );
    const canisterAfterClaim = CANISTER_DOKA_AFTER_ONESHOT + FEAT_GRANT;
    assert.equal(leftoverClaim, 300);
    assert.equal(canisterAfterClaim, 350);
    assert.equal(
      canisterAfterClaim - leftoverClaim,
      ONESHOT_GRANT,
      "this leftover sits the risen pickup below stored",
    );
  });
});
