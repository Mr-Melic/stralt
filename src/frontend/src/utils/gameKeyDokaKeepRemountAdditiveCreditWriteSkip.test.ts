import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clampSaveBattleStatsWrite } from "./absoluteStatsClamp.ts";
import { committedDokaAfterAchievementCredit } from "./achievementReward.ts";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  clearGameKeyDokaKeepRemountAdditiveCredit,
  committedDokaAfterAchievementCreditWithGameKeyDokaKeepRemount,
  committedDokaAfterGameKeyRedeemWithGameKeyDokaKeepRemount,
  dokaAfterShopSpendWithGameKeyDokaKeepRemountAdditiveCredit,
  dokaForGameKeyDokaKeepRemountAdditiveCredit,
  dokaFromGameKeyDokaKeepAdditiveCreditWalletRecord,
  gameKeyDokaKeepRemountAdditiveCreditKey,
  hasGameKeyDokaKeepRemountAdditiveCredit,
  noteGameKeyDokaKeepRemountAdditiveCredit,
  persistAdditiveCreditThroughGameKeyDokaKeepRemount,
  persistClaimThroughGameKeyDokaKeepRemount,
  persistRedeemThroughGameKeyDokaKeepRemount,
  readGameKeyDokaKeepRemountAdditiveCredit,
  sessionDokaAfterGameKeyDokaKeepRemountAdditiveCredit,
  shouldRefuseGameKeyDokaKeepRemountAdditiveCreditStaleDoka,
} from "./gameKeyDokaKeepRemountAdditiveCreditWriteSkip.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applyShopCreditDeltaToUi,
  applySpendToCommitted,
  createProgressPersist,
} from "./progressPersist.ts";
import { committedDokaAfterRename } from "./renameCharacter.ts";
import { committedDokaAfterGameKeyRedeem } from "./shopPurchase.ts";

const PLAY_ENTRY_DOKA = 200;
const GAMEKEY_KEEP_GRANT = 1000;
const CANISTER_DOKA_AFTER_GAMEKEY = PLAY_ENTRY_DOKA + GAMEKEY_KEEP_GRANT;
const SHOP_SPEND = 50;
const FEAT_GRANT = 100;
const LATER_GAMEKEY_GRANT = 1000;
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

/** Production remount lock: GameFlow Doka after GameKey throw-after-add. */
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

describe("gameKeyDokaKeepRemountAdditiveCreditKey", () => {
  it("reads the same #811 slot key, not victory / one-shot / feat / shop-throw keys", () => {
    assert.equal(
      gameKeyDokaKeepRemountAdditiveCreditKey(1),
      "pbv_gamekey_doka_keep_remount_slot1",
    );
    assert.equal(
      gameKeyDokaKeepRemountAdditiveCreditKey(3),
      "pbv_gamekey_doka_keep_remount_slot3",
    );
    assert.notEqual(
      gameKeyDokaKeepRemountAdditiveCreditKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    assert.notEqual(
      gameKeyDokaKeepRemountAdditiveCreditKey(1),
      "pbv_oneshot_doka_keep_remount_slot1",
    );
    assert.notEqual(
      gameKeyDokaKeepRemountAdditiveCreditKey(1),
      "pbv_boss_rush_doka_keep_remount_slot1",
    );
    assert.notEqual(
      gameKeyDokaKeepRemountAdditiveCreditKey(1),
      "pbv_feat_doka_keep_remount_slot1",
    );
    assert.notEqual(
      gameKeyDokaKeepRemountAdditiveCreditKey(1),
      "pbv_absolute_doka_throw_keep_remount_slot1",
    );
    assert.notEqual(
      gameKeyDokaKeepRemountAdditiveCreditKey(1),
      "pbv_spend_keep_remount_slot1",
    );
  });
});

describe("note / read / clear GameKeyDokaKeepRemountAdditiveCredit", () => {
  it("round-trips the #811 { preDoka } shape", () => {
    const storage = memStorage();
    assert.equal(hasGameKeyDokaKeepRemountAdditiveCredit(storage, 1), false);
    noteGameKeyDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    assert.deepEqual(readGameKeyDokaKeepRemountAdditiveCredit(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(hasGameKeyDokaKeepRemountAdditiveCredit(storage, 1), true);
    clearGameKeyDokaKeepRemountAdditiveCredit(storage, 1);
    assert.equal(readGameKeyDokaKeepRemountAdditiveCredit(storage, 1), null);
  });

  it("isolates character slots", () => {
    const storage = memStorage();
    noteGameKeyDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    noteGameKeyDokaKeepRemountAdditiveCredit(storage, 2, 90);
    assert.deepEqual(readGameKeyDokaKeepRemountAdditiveCredit(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.deepEqual(readGameKeyDokaKeepRemountAdditiveCredit(storage, 2), {
      preDoka: 90,
    });
    clearGameKeyDokaKeepRemountAdditiveCredit(storage, 1);
    assert.equal(readGameKeyDokaKeepRemountAdditiveCredit(storage, 1), null);
    assert.equal(hasGameKeyDokaKeepRemountAdditiveCredit(storage, 2), true);
  });
});

describe("dokaFromGameKeyDokaKeepAdditiveCreditWalletRecord", () => {
  it("reads number, bigint, and { ok } wallets", () => {
    assert.equal(
      dokaFromGameKeyDokaKeepAdditiveCreditWalletRecord(
        CANISTER_DOKA_AFTER_GAMEKEY,
      ),
      1200,
    );
    assert.equal(
      dokaFromGameKeyDokaKeepAdditiveCreditWalletRecord(1200n),
      1200,
    );
    assert.equal(
      dokaFromGameKeyDokaKeepAdditiveCreditWalletRecord({
        ok: CANISTER_DOKA_AFTER_GAMEKEY,
      }),
      1200,
    );
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromGameKeyDokaKeepAdditiveCreditWalletRecord(null), null);
    assert.equal(dokaFromGameKeyDokaKeepAdditiveCreditWalletRecord({}), null);
    assert.equal(
      dokaFromGameKeyDokaKeepAdditiveCreditWalletRecord({ ok: "nope" }),
      null,
    );
  });
});

describe("shouldRefuseGameKeyDokaKeepRemountAdditiveCreditStaleDoka", () => {
  it("fail-closes when live still equals or sits below stamped preDoka", () => {
    assert.equal(
      shouldRefuseGameKeyDokaKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
    assert.equal(
      shouldRefuseGameKeyDokaKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: 0,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseGameKeyDokaKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("does not refuse a risen replica wallet", () => {
    assert.equal(
      shouldRefuseGameKeyDokaKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: CANISTER_DOKA_AFTER_GAMEKEY,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseGameKeyDokaKeepRemountAdditiveCreditStaleDoka({
        keep: false,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });
});

describe("GameKey redeem throw-after-add then remount feat without unpaid death", () => {
  it("leftover remount claim commits 300 over canister 1300", () => {
    // Chronology:
    // 1. World hydrated. Lock Doka 200. Canister 200.
    // 2. redeemGameKey adds 1000 then throws. Catch only toasts.
    //    HUD stays 200. #811 stamps preDoka=200. Retry already used.
    // 3. Actor reconnect remounts. Lock Doka 200.
    // 4. Claim committedDokaAfterAchievementCredit(200, 100) → 300.
    //    Canister adds 100 to 1200 → 1300.
    const leftoverCommit = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
      FEAT_GRANT,
    );
    assert.equal(leftoverCommit, 300);
    const canisterAfterClaim = CANISTER_DOKA_AFTER_GAMEKEY + FEAT_GRANT;
    assert.equal(canisterAfterClaim, 1300);
    assert.equal(
      canisterAfterClaim - leftoverCommit,
      GAMEKEY_KEEP_GRANT,
      "lock sits the paid GameKey grant below stored",
    );
  });

  it("leftover shop after that claim writes 250 over canister 1300", () => {
    const leftoverShop = applySpendToCommitted(
      committedDokaAfterAchievementCredit(PLAY_ENTRY_DOKA, FEAT_GRANT),
      SHOP_SPEND,
    );
    assert.equal(leftoverShop, 250);
    assert.equal(
      canisterAfterAbsoluteWrite(1300, leftoverShop),
      250,
      "incoming-below-stored wipes the 1000 GameKey grant (correct remaining 1250)",
    );
    assert.equal(
      applySpendToCommitted(
        CANISTER_DOKA_AFTER_GAMEKEY + FEAT_GRANT,
        SHOP_SPEND,
      ),
      1250,
    );
  });

  it("gated remount claim commits 1300", () => {
    const gated = committedDokaAfterAchievementCreditWithGameKeyDokaKeepRemount(
      {
        remountDoka: PLAY_ENTRY_DOKA,
        liveDoka: CANISTER_DOKA_AFTER_GAMEKEY,
        keep: true,
        stampedPreDoka: PLAY_ENTRY_DOKA,
        granted: FEAT_GRANT,
      },
    );
    assert.equal(gated, 1300);
    const gatedShop =
      dokaAfterShopSpendWithGameKeyDokaKeepRemountAdditiveCredit({
        remountDoka: PLAY_ENTRY_DOKA,
        liveDoka: CANISTER_DOKA_AFTER_GAMEKEY,
        keep: true,
        stampedPreDoka: PLAY_ENTRY_DOKA,
        granted: FEAT_GRANT,
        shopSpend: SHOP_SPEND,
      });
    assert.equal(gatedShop, 1250);
    assert.equal(canisterAfterAbsoluteWrite(1300, gatedShop ?? 0), 1250);
  });
});

describe("later GameKey leftover when remount lock is Play-entry 200", () => {
  it("leftover remount redeem commits 1200 over canister 2200", () => {
    const leftover = committedDokaAfterGameKeyRedeem(
      PLAY_ENTRY_DOKA,
      LATER_GAMEKEY_GRANT,
    );
    assert.equal(leftover, 1200);
    const canisterAfterRedeem =
      CANISTER_DOKA_AFTER_GAMEKEY + LATER_GAMEKEY_GRANT;
    assert.equal(canisterAfterRedeem, 2200);
    const leftoverShop = applySpendToCommitted(leftover, SHOP_SPEND);
    assert.equal(leftoverShop, 1150);
    assert.equal(
      canisterAfterAbsoluteWrite(2200, leftoverShop),
      1150,
      "incoming-below-stored wipes the first 1000 GameKey grant after a later redeem",
    );
  });

  it("gated remount redeem commits 2200", () => {
    const gated = committedDokaAfterGameKeyRedeemWithGameKeyDokaKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_GAMEKEY,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      granted: LATER_GAMEKEY_GRANT,
    });
    assert.equal(gated, 2200);
    assert.equal(applySpendToCommitted(gated ?? 0, SHOP_SPEND), 2150);
  });
});

describe("sessionDokaAfterGameKeyDokaKeepRemountAdditiveCredit", () => {
  it("ungated remount HUD stays Play-entry 200 so live credit adds onto a lie", () => {
    const session = sessionDokaAfterGameKeyDokaKeepRemountAdditiveCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_GAMEKEY,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, PLAY_ENTRY_DOKA);
    assert.equal(applyShopCreditDeltaToUi(session, FEAT_GRANT), 300);
  });

  it("honour replica 1200 so HUD credit matches the canister", () => {
    const session = sessionDokaAfterGameKeyDokaKeepRemountAdditiveCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_GAMEKEY,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, CANISTER_DOKA_AFTER_GAMEKEY);
    assert.equal(applyShopCreditDeltaToUi(session, FEAT_GRANT), 1300);
  });
});

describe("pickup-only remount still credits from Play-entry 200", () => {
  it("does not honour without a keep stamp", () => {
    const claimed =
      committedDokaAfterAchievementCreditWithGameKeyDokaKeepRemount({
        remountDoka: PLAY_ENTRY_DOKA,
        liveDoka: CANISTER_DOKA_AFTER_GAMEKEY,
        keep: false,
        stampedPreDoka: PLAY_ENTRY_DOKA,
        granted: FEAT_GRANT,
      });
    assert.equal(claimed, 300);
    const shop = dokaAfterShopSpendWithGameKeyDokaKeepRemountAdditiveCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_GAMEKEY,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      granted: FEAT_GRANT,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(shop, 250);
  });
});

describe("persistAdditiveCreditThroughGameKeyDokaKeepRemount", () => {
  it("adopts replica 1200 then feat #ok commits 1300", async () => {
    const storage = memStorage();
    noteGameKeyDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    const ok = await persistAdditiveCreditThroughGameKeyDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_GAMEKEY,
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
    assert.equal(persist.snapshot().doka, 1300);
    assert.equal(
      hasGameKeyDokaKeepRemountAdditiveCredit(storage, 1),
      false,
      "clear the stamp after honour so leftover shop cannot reconstruct 200",
    );
  });

  it("adopts replica 1200 then later GameKey #ok commits 2200", async () => {
    const storage = memStorage();
    noteGameKeyDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    await persistAdditiveCreditThroughGameKeyDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_GAMEKEY,
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterGameKeyRedeem(
            persist.snapshot().doka,
            LATER_GAMEKEY_GRANT,
          ),
        });
        return true;
      },
    });
    assert.equal(persist.snapshot().doka, 2200);
  });

  it("throws and does not apply when live Doka is still Play-entry", async () => {
    const storage = memStorage();
    noteGameKeyDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistAdditiveCreditThroughGameKeyDokaKeepRemount({
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
      hasGameKeyDokaKeepRemountAdditiveCredit(storage, 1),
      true,
      "fail-close keeps the stamp",
    );
  });

  it("throws when getCallerDokaBalance fails so a stale claim cannot land", async () => {
    const storage = memStorage();
    noteGameKeyDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistAdditiveCreditThroughGameKeyDokaKeepRemount({
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
    const ok = await persistAdditiveCreditThroughGameKeyDokaKeepRemount({
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
    noteGameKeyDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    let flushed = 0;
    const persist = createProgressPersist(
      { doka: PLAY_ENTRY_DOKA, xp: 100, level: LEVEL },
      {
        beforeEach: async () => {
          flushed += 1;
        },
      },
    );
    await persistAdditiveCreditThroughGameKeyDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_GAMEKEY,
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

describe("persistClaimThroughGameKeyDokaKeepRemount", () => {
  it("production leftover claim on remount lock commits 300", async () => {
    const persist = remountLock();
    const leftover = await persistClaimThroughGameKeyDokaKeepRemount(
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

  it("gated remount claim honours replica then commits 1300", async () => {
    const storage = memStorage();
    noteGameKeyDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let claimed = 0;
    const parsed = await persistClaimThroughGameKeyDokaKeepRemount(
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
        readWallet: async () => CANISTER_DOKA_AFTER_GAMEKEY,
      },
    );
    assert.deepEqual(parsed, { ok: FEAT_GRANT });
    assert.equal(claimed, 1);
    assert.equal(persist.snapshot().doka, 1300);
    assert.equal(hasGameKeyDokaKeepRemountAdditiveCredit(storage, 1), false);
  });

  it("already claimed does not adopt a stale Play-entry onto the lock", async () => {
    const storage = memStorage();
    noteGameKeyDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    const parsed = await persistClaimThroughGameKeyDokaKeepRemount(
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
        readWallet: async () => CANISTER_DOKA_AFTER_GAMEKEY,
      },
    );
    assert.equal("err" in parsed, true);
    assert.equal(
      persist.snapshot().doka,
      CANISTER_DOKA_AFTER_GAMEKEY,
      "honour still lands so a later leftover shop cannot reconstruct 200",
    );
  });
});

describe("persistRedeemThroughGameKeyDokaKeepRemount", () => {
  it("gated remount later redeem honours replica then commits 2200", async () => {
    const storage = memStorage();
    noteGameKeyDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    const { result } = await persistRedeemThroughGameKeyDokaKeepRemount(
      {
        redeemGameKey: async () => ({ ok: LATER_GAMEKEY_GRANT }),
      },
      persist,
      GAME_KEY,
      {
        storage,
        slot: 1,
        readWallet: async () => CANISTER_DOKA_AFTER_GAMEKEY,
      },
    );
    assert.deepEqual(result, { ok: LATER_GAMEKEY_GRANT });
    assert.equal(persist.snapshot().doka, 2200);
  });

  it("explicit redeemGameKey failed still honours replica without granting", async () => {
    const storage = memStorage();
    noteGameKeyDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    const { result } = await persistRedeemThroughGameKeyDokaKeepRemount(
      {
        redeemGameKey: async () => ({ err: "GameKey already used" }),
      },
      persist,
      GAME_KEY,
      {
        storage,
        slot: 1,
        readWallet: async () => CANISTER_DOKA_AFTER_GAMEKEY,
      },
    );
    assert.deepEqual(result, { err: "GameKey already used" });
    assert.equal(persist.snapshot().doka, CANISTER_DOKA_AFTER_GAMEKEY);
  });
});

describe("distinct from #811 shop honour, #900 death, #1019 rename, #1028/#1029 claim", () => {
  it("uses pbv_gamekey_doka_keep_remount_slotN, not victory / one-shot / feat keep keys", () => {
    const storage = memStorage();
    noteGameKeyDokaKeepRemountAdditiveCredit(storage, 2, PLAY_ENTRY_DOKA);
    assert.equal(
      gameKeyDokaKeepRemountAdditiveCreditKey(2),
      "pbv_gamekey_doka_keep_remount_slot2",
    );
    assert.equal(
      storage.getItem("pbv_gamekey_doka_keep_remount_slot2") != null,
      true,
    );
    assert.equal(storage.getItem("pbv_victory_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_oneshot_doka_keep_remount_slot2"), null);
    assert.equal(
      storage.getItem("pbv_boss_rush_doka_keep_remount_slot2"),
      null,
    );
    assert.equal(storage.getItem("pbv_feat_doka_keep_remount_slot2"), null);
    assert.equal(
      storage.getItem("pbv_absolute_doka_throw_keep_remount_slot2"),
      null,
    );
    assert.equal(storage.getItem("pbv_spend_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot2"), null);
  });

  it("does not treat #811 remount shop spend 50 from 1200 as this claim path", () => {
    const shopHonour = applySpendToCommitted(
      CANISTER_DOKA_AFTER_GAMEKEY,
      SHOP_SPEND,
    );
    assert.equal(shopHonour, 1150, "#811 gated shop path");
    const deathCut = Math.floor(CANISTER_DOKA_AFTER_GAMEKEY * 0.6);
    assert.equal(deathCut, 720, "#900 taxes replica 1200, not this claim");
    const leftoverRename = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.equal(leftoverRename, 100, "#1019 leftover rename, not this claim");
    const leftoverClaim = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
      FEAT_GRANT,
    );
    assert.notEqual(leftoverClaim, shopHonour);
    assert.notEqual(leftoverClaim, deathCut);
    assert.notEqual(leftoverClaim, leftoverRename);
  });

  it("does not skip leftover shop/heal honour — that stays #811", () => {
    const honour = dokaForGameKeyDokaKeepRemountAdditiveCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_GAMEKEY,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(honour, CANISTER_DOKA_AFTER_GAMEKEY);
    assert.equal(
      applySpendToCommitted(honour ?? 0, SHOP_SPEND),
      1150,
      "shop leftover still spends from honoured replica; this sidecar only gates claim/redeem",
    );
  });

  it("does not treat #1019 remount rename debit as this additive path", () => {
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

  it("does not treat #1028/#1029 remount claim (rise 50) as this paid +1000", () => {
    const smallKeepLeftoverClaim = 300;
    const smallKeepCanisterAfterClaim = 350;
    assert.equal(
      smallKeepCanisterAfterClaim - smallKeepLeftoverClaim,
      50,
      "#1028/#1029 leftover sits a +50 credit below stored",
    );
    const leftoverClaim = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
      FEAT_GRANT,
    );
    const canisterAfterClaim = CANISTER_DOKA_AFTER_GAMEKEY + FEAT_GRANT;
    assert.equal(leftoverClaim, 300);
    assert.equal(canisterAfterClaim, 1300);
    assert.equal(
      canisterAfterClaim - leftoverClaim,
      GAMEKEY_KEEP_GRANT,
      "this leftover sits the paid GameKey grant below stored",
    );
    assert.notEqual(
      gameKeyDokaKeepRemountAdditiveCreditKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    assert.notEqual(
      gameKeyDokaKeepRemountAdditiveCreditKey(1),
      "pbv_oneshot_doka_keep_remount_slot1",
    );
  });

  it("does not treat #1025 Boss Rush remount claim (rise 500) as this +1000", () => {
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
    const canisterAfterClaim = CANISTER_DOKA_AFTER_GAMEKEY + FEAT_GRANT;
    assert.equal(leftoverClaim, 300);
    assert.equal(canisterAfterClaim, 1300);
    assert.equal(
      canisterAfterClaim - leftoverClaim,
      GAMEKEY_KEEP_GRANT,
      "this leftover sits the paid GameKey grant below stored",
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
    const canisterAfterClaim = CANISTER_DOKA_AFTER_GAMEKEY + FEAT_GRANT;
    assert.equal(leftoverClaim, 300);
    assert.equal(canisterAfterClaim, 1300);
    assert.equal(
      canisterAfterClaim - leftoverClaim,
      GAMEKEY_KEEP_GRANT,
      "this leftover sits the paid GameKey grant below stored",
    );
  });
});
