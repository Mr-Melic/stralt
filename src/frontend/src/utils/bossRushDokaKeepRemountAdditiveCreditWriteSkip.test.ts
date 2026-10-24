import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clampSaveBattleStatsWrite } from "./absoluteStatsClamp.ts";
import { committedDokaAfterAchievementCredit } from "./achievementReward.ts";
import {
  bossRushDokaKeepRemountAdditiveCreditKey,
  clearBossRushDokaKeepRemountAdditiveCredit,
  committedDokaAfterAchievementCreditWithBossRushDokaKeepRemount,
  committedDokaAfterGameKeyRedeemWithBossRushDokaKeepRemount,
  dokaAfterShopSpendWithBossRushDokaKeepRemountAdditiveCredit,
  dokaForBossRushDokaKeepRemountAdditiveCredit,
  dokaFromBossRushDokaKeepAdditiveCreditWalletRecord,
  hasBossRushDokaKeepRemountAdditiveCredit,
  noteBossRushDokaKeepRemountAdditiveCredit,
  persistAdditiveCreditThroughBossRushDokaKeepRemount,
  persistClaimThroughBossRushDokaKeepRemount,
  persistRedeemThroughBossRushDokaKeepRemount,
  readBossRushDokaKeepRemountAdditiveCredit,
  sessionDokaAfterBossRushDokaKeepRemountAdditiveCredit,
  shouldRefuseBossRushDokaKeepRemountAdditiveCreditStaleDoka,
} from "./bossRushDokaKeepRemountAdditiveCreditWriteSkip.ts";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applyShopCreditDeltaToUi,
  applySpendToCommitted,
  createProgressPersist,
} from "./progressPersist.ts";
import { committedDokaAfterRename } from "./renameCharacter.ts";
import { committedDokaAfterGameKeyRedeem } from "./shopPurchase.ts";

const PLAY_ENTRY_DOKA = 200;
const BOSS_RUSH_GRANT = 500;
const CANISTER_DOKA_AFTER_BOSS_RUSH = PLAY_ENTRY_DOKA + BOSS_RUSH_GRANT;
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

/** Production remount lock: GameFlow Doka after Boss Rush throw-after-add. */
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

describe("bossRushDokaKeepRemountAdditiveCreditKey", () => {
  it("reads the same #864 slot key, not victory / GameKey / shop-throw keys", () => {
    assert.equal(
      bossRushDokaKeepRemountAdditiveCreditKey(1),
      "pbv_boss_rush_doka_keep_remount_slot1",
    );
    assert.equal(
      bossRushDokaKeepRemountAdditiveCreditKey(3),
      "pbv_boss_rush_doka_keep_remount_slot3",
    );
    assert.notEqual(
      bossRushDokaKeepRemountAdditiveCreditKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    assert.notEqual(
      bossRushDokaKeepRemountAdditiveCreditKey(1),
      "pbv_gamekey_doka_keep_remount_slot1",
    );
    assert.notEqual(
      bossRushDokaKeepRemountAdditiveCreditKey(1),
      "pbv_feat_doka_keep_remount_slot1",
    );
    assert.notEqual(
      bossRushDokaKeepRemountAdditiveCreditKey(1),
      "pbv_oneshot_doka_keep_remount_slot1",
    );
    assert.notEqual(
      bossRushDokaKeepRemountAdditiveCreditKey(1),
      "pbv_absolute_doka_throw_keep_remount_slot1",
    );
    assert.notEqual(
      bossRushDokaKeepRemountAdditiveCreditKey(1),
      "pbv_spend_keep_remount_slot1",
    );
  });
});

describe("note / read / clear BossRushDokaKeepRemountAdditiveCredit", () => {
  it("round-trips the #864 { preDoka } shape", () => {
    const storage = memStorage();
    assert.equal(hasBossRushDokaKeepRemountAdditiveCredit(storage, 1), false);
    noteBossRushDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    assert.deepEqual(readBossRushDokaKeepRemountAdditiveCredit(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(hasBossRushDokaKeepRemountAdditiveCredit(storage, 1), true);
    clearBossRushDokaKeepRemountAdditiveCredit(storage, 1);
    assert.equal(readBossRushDokaKeepRemountAdditiveCredit(storage, 1), null);
  });

  it("isolates character slots", () => {
    const storage = memStorage();
    noteBossRushDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    noteBossRushDokaKeepRemountAdditiveCredit(storage, 2, 90);
    assert.deepEqual(readBossRushDokaKeepRemountAdditiveCredit(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.deepEqual(readBossRushDokaKeepRemountAdditiveCredit(storage, 2), {
      preDoka: 90,
    });
    clearBossRushDokaKeepRemountAdditiveCredit(storage, 1);
    assert.equal(readBossRushDokaKeepRemountAdditiveCredit(storage, 1), null);
    assert.equal(hasBossRushDokaKeepRemountAdditiveCredit(storage, 2), true);
  });
});

describe("dokaFromBossRushDokaKeepAdditiveCreditWalletRecord", () => {
  it("reads number, bigint, and { ok } wallets", () => {
    assert.equal(
      dokaFromBossRushDokaKeepAdditiveCreditWalletRecord(
        CANISTER_DOKA_AFTER_BOSS_RUSH,
      ),
      700,
    );
    assert.equal(dokaFromBossRushDokaKeepAdditiveCreditWalletRecord(700n), 700);
    assert.equal(
      dokaFromBossRushDokaKeepAdditiveCreditWalletRecord({
        ok: CANISTER_DOKA_AFTER_BOSS_RUSH,
      }),
      700,
    );
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(
      dokaFromBossRushDokaKeepAdditiveCreditWalletRecord(null),
      null,
    );
    assert.equal(dokaFromBossRushDokaKeepAdditiveCreditWalletRecord({}), null);
    assert.equal(
      dokaFromBossRushDokaKeepAdditiveCreditWalletRecord({ ok: "nope" }),
      null,
    );
  });
});

describe("shouldRefuseBossRushDokaKeepRemountAdditiveCreditStaleDoka", () => {
  it("fail-closes when live still equals or sits below stamped preDoka", () => {
    assert.equal(
      shouldRefuseBossRushDokaKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
    assert.equal(
      shouldRefuseBossRushDokaKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: 0,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseBossRushDokaKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("does not refuse a risen replica wallet", () => {
    assert.equal(
      shouldRefuseBossRushDokaKeepRemountAdditiveCreditStaleDoka({
        keep: true,
        liveDoka: CANISTER_DOKA_AFTER_BOSS_RUSH,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseBossRushDokaKeepRemountAdditiveCreditStaleDoka({
        keep: false,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });
});

describe("Boss Rush applyRewards throw-after-add then remount feat without unpaid death", () => {
  it("leftover remount claim commits 300 over canister 800", () => {
    // Chronology:
    // 1. World hydrated. Lock Doka 200. Canister 200.
    // 2. Room-clear persistRoomClear then applyRewards accepts 700 then
    //    throws. Catch only logDebugError. HUD stays 200. #864 stamps
    //    preDoka=200. Room already advanced.
    // 3. Actor reconnect remounts. Lock Doka 200.
    // 4. Claim committedDokaAfterAchievementCredit(200, 100) → 300.
    //    Canister adds 100 to 700 → 800.
    const leftoverCommit = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
      FEAT_GRANT,
    );
    assert.equal(leftoverCommit, 300);
    const canisterAfterClaim = CANISTER_DOKA_AFTER_BOSS_RUSH + FEAT_GRANT;
    assert.equal(canisterAfterClaim, 800);
    assert.equal(
      canisterAfterClaim - leftoverCommit,
      BOSS_RUSH_GRANT,
      "lock sits the room-clear grant below stored",
    );
  });

  it("leftover shop after that claim writes 250 over canister 800", () => {
    const leftoverShop = applySpendToCommitted(
      committedDokaAfterAchievementCredit(PLAY_ENTRY_DOKA, FEAT_GRANT),
      SHOP_SPEND,
    );
    assert.equal(leftoverShop, 250);
    assert.equal(
      canisterAfterAbsoluteWrite(800, leftoverShop),
      250,
      "incoming-below-stored wipes the 500 room-clear grant and the feat (correct remaining 750)",
    );
    assert.equal(
      applySpendToCommitted(
        CANISTER_DOKA_AFTER_BOSS_RUSH + FEAT_GRANT,
        SHOP_SPEND,
      ),
      750,
    );
  });

  it("gated remount claim commits 800", () => {
    const gated =
      committedDokaAfterAchievementCreditWithBossRushDokaKeepRemount({
        remountDoka: PLAY_ENTRY_DOKA,
        liveDoka: CANISTER_DOKA_AFTER_BOSS_RUSH,
        keep: true,
        stampedPreDoka: PLAY_ENTRY_DOKA,
        granted: FEAT_GRANT,
      });
    assert.equal(gated, 800);
    const gatedShop =
      dokaAfterShopSpendWithBossRushDokaKeepRemountAdditiveCredit({
        remountDoka: PLAY_ENTRY_DOKA,
        liveDoka: CANISTER_DOKA_AFTER_BOSS_RUSH,
        keep: true,
        stampedPreDoka: PLAY_ENTRY_DOKA,
        granted: FEAT_GRANT,
        shopSpend: SHOP_SPEND,
      });
    assert.equal(gatedShop, 750);
    assert.equal(canisterAfterAbsoluteWrite(800, gatedShop ?? 0), 750);
  });
});

describe("GameKey leftover when remount lock is Play-entry 200", () => {
  it("leftover remount redeem commits 1200 over canister 1700", () => {
    const leftover = committedDokaAfterGameKeyRedeem(
      PLAY_ENTRY_DOKA,
      GAMEKEY_GRANT,
    );
    assert.equal(leftover, 1200);
    const canisterAfterRedeem = CANISTER_DOKA_AFTER_BOSS_RUSH + GAMEKEY_GRANT;
    assert.equal(canisterAfterRedeem, 1700);
    const leftoverShop = applySpendToCommitted(leftover, SHOP_SPEND);
    assert.equal(leftoverShop, 1150);
    assert.equal(
      canisterAfterAbsoluteWrite(1700, leftoverShop),
      1150,
      "incoming-below-stored wipes the 500 room-clear grant after GameKey",
    );
  });

  it("gated remount redeem commits 1700", () => {
    const gated = committedDokaAfterGameKeyRedeemWithBossRushDokaKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_BOSS_RUSH,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      granted: GAMEKEY_GRANT,
    });
    assert.equal(gated, 1700);
    assert.equal(applySpendToCommitted(gated ?? 0, SHOP_SPEND), 1650);
  });
});

describe("sessionDokaAfterBossRushDokaKeepRemountAdditiveCredit", () => {
  it("ungated remount HUD stays Play-entry 200 so live credit adds onto a lie", () => {
    const session = sessionDokaAfterBossRushDokaKeepRemountAdditiveCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_BOSS_RUSH,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, PLAY_ENTRY_DOKA);
    assert.equal(applyShopCreditDeltaToUi(session, FEAT_GRANT), 300);
  });

  it("honour replica 700 so HUD credit matches the canister", () => {
    const session = sessionDokaAfterBossRushDokaKeepRemountAdditiveCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_BOSS_RUSH,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, CANISTER_DOKA_AFTER_BOSS_RUSH);
    assert.equal(applyShopCreditDeltaToUi(session, FEAT_GRANT), 800);
  });
});

describe("pickup-only remount still credits from Play-entry 200", () => {
  it("does not honour without a keep stamp", () => {
    const claimed =
      committedDokaAfterAchievementCreditWithBossRushDokaKeepRemount({
        remountDoka: PLAY_ENTRY_DOKA,
        liveDoka: CANISTER_DOKA_AFTER_BOSS_RUSH,
        keep: false,
        stampedPreDoka: PLAY_ENTRY_DOKA,
        granted: FEAT_GRANT,
      });
    assert.equal(claimed, 300);
    const shop = dokaAfterShopSpendWithBossRushDokaKeepRemountAdditiveCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_BOSS_RUSH,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      granted: FEAT_GRANT,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(shop, 250);
  });
});

describe("persistAdditiveCreditThroughBossRushDokaKeepRemount", () => {
  it("adopts replica 700 then feat #ok commits 800", async () => {
    const storage = memStorage();
    noteBossRushDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    const ok = await persistAdditiveCreditThroughBossRushDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_BOSS_RUSH,
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
    assert.equal(persist.snapshot().doka, 800);
    assert.equal(
      hasBossRushDokaKeepRemountAdditiveCredit(storage, 1),
      false,
      "clear the stamp after honour so leftover shop cannot reconstruct 200",
    );
  });

  it("adopts replica 700 then GameKey #ok commits 1700", async () => {
    const storage = memStorage();
    noteBossRushDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    await persistAdditiveCreditThroughBossRushDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_BOSS_RUSH,
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
    assert.equal(persist.snapshot().doka, 1700);
  });

  it("throws and does not apply when live Doka is still Play-entry", async () => {
    const storage = memStorage();
    noteBossRushDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistAdditiveCreditThroughBossRushDokaKeepRemount({
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
      hasBossRushDokaKeepRemountAdditiveCredit(storage, 1),
      true,
      "fail-close keeps the stamp",
    );
  });

  it("throws when getCallerDokaBalance fails so a stale claim cannot land", async () => {
    const storage = memStorage();
    noteBossRushDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistAdditiveCreditThroughBossRushDokaKeepRemount({
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
    const ok = await persistAdditiveCreditThroughBossRushDokaKeepRemount({
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
    noteBossRushDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    let flushed = 0;
    const persist = createProgressPersist(
      { doka: PLAY_ENTRY_DOKA, xp: 100, level: LEVEL },
      {
        beforeEach: async () => {
          flushed += 1;
        },
      },
    );
    await persistAdditiveCreditThroughBossRushDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_BOSS_RUSH,
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

describe("persistClaimThroughBossRushDokaKeepRemount", () => {
  it("production leftover claim on remount lock commits 300", async () => {
    const persist = remountLock();
    const leftover = await persistClaimThroughBossRushDokaKeepRemount(
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

  it("gated remount claim honours replica then commits 800", async () => {
    const storage = memStorage();
    noteBossRushDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let claimed = 0;
    const parsed = await persistClaimThroughBossRushDokaKeepRemount(
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
        readWallet: async () => CANISTER_DOKA_AFTER_BOSS_RUSH,
      },
    );
    assert.deepEqual(parsed, { ok: FEAT_GRANT });
    assert.equal(claimed, 1);
    assert.equal(persist.snapshot().doka, 800);
    assert.equal(hasBossRushDokaKeepRemountAdditiveCredit(storage, 1), false);
  });

  it("already claimed does not adopt a stale Play-entry onto the lock", async () => {
    const storage = memStorage();
    noteBossRushDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    const parsed = await persistClaimThroughBossRushDokaKeepRemount(
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
        readWallet: async () => CANISTER_DOKA_AFTER_BOSS_RUSH,
      },
    );
    assert.equal("err" in parsed, true);
    assert.equal(
      persist.snapshot().doka,
      CANISTER_DOKA_AFTER_BOSS_RUSH,
      "honour still lands so a later leftover shop cannot reconstruct 200",
    );
  });
});

describe("persistRedeemThroughBossRushDokaKeepRemount", () => {
  it("gated remount redeem honours replica then commits 1700", async () => {
    const storage = memStorage();
    noteBossRushDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    const { result } = await persistRedeemThroughBossRushDokaKeepRemount(
      {
        redeemGameKey: async () => ({ ok: GAMEKEY_GRANT }),
      },
      persist,
      GAME_KEY,
      {
        storage,
        slot: 1,
        readWallet: async () => CANISTER_DOKA_AFTER_BOSS_RUSH,
      },
    );
    assert.deepEqual(result, { ok: GAMEKEY_GRANT });
    assert.equal(persist.snapshot().doka, 1700);
  });

  it("explicit redeemGameKey failed still honours replica without granting", async () => {
    const storage = memStorage();
    noteBossRushDokaKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    const { result } = await persistRedeemThroughBossRushDokaKeepRemount(
      {
        redeemGameKey: async () => ({ err: "Invalid GameKey" }),
      },
      persist,
      GAME_KEY,
      {
        storage,
        slot: 1,
        readWallet: async () => CANISTER_DOKA_AFTER_BOSS_RUSH,
      },
    );
    assert.deepEqual(result, { err: "Invalid GameKey" });
    assert.equal(persist.snapshot().doka, CANISTER_DOKA_AFTER_BOSS_RUSH);
  });
});

describe("distinct from #864 shop honour, #866 death, #1020 rename, #1021 shop-throw claim", () => {
  it("uses pbv_boss_rush_doka_keep_remount_slotN, not feat/GameKey keep keys", () => {
    const storage = memStorage();
    noteBossRushDokaKeepRemountAdditiveCredit(storage, 2, PLAY_ENTRY_DOKA);
    assert.equal(
      bossRushDokaKeepRemountAdditiveCreditKey(2),
      "pbv_boss_rush_doka_keep_remount_slot2",
    );
    assert.equal(
      storage.getItem("pbv_boss_rush_doka_keep_remount_slot2") != null,
      true,
    );
    assert.equal(storage.getItem("pbv_victory_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_gamekey_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_feat_doka_keep_remount_slot2"), null);
    assert.equal(
      storage.getItem("pbv_absolute_doka_throw_keep_remount_slot2"),
      null,
    );
    assert.equal(storage.getItem("pbv_spend_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot2"), null);
  });

  it("does not treat #864 remount shop spend 50 from 700 as this claim path", () => {
    const shopHonour = applySpendToCommitted(
      CANISTER_DOKA_AFTER_BOSS_RUSH,
      SHOP_SPEND,
    );
    assert.equal(shopHonour, 650, "#864 gated shop path");
    const deathCut = Math.floor(CANISTER_DOKA_AFTER_BOSS_RUSH * 0.6);
    assert.equal(deathCut, 420, "#866 taxes replica 700, not this claim");
    const leftoverRename = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.equal(leftoverRename, 100, "#1020 leftover rename, not this claim");
    const leftoverClaim = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
      FEAT_GRANT,
    );
    assert.notEqual(leftoverClaim, shopHonour);
    assert.notEqual(leftoverClaim, deathCut);
    assert.notEqual(leftoverClaim, leftoverRename);
  });

  it("does not skip leftover shop/heal honour — that stays #864", () => {
    const honour = dokaForBossRushDokaKeepRemountAdditiveCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_BOSS_RUSH,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(honour, CANISTER_DOKA_AFTER_BOSS_RUSH);
    assert.equal(
      applySpendToCommitted(honour ?? 0, SHOP_SPEND),
      650,
      "shop leftover still spends from honoured replica; this sidecar only gates claim/redeem",
    );
  });

  it("does not treat #1020 remount rename debit as this additive path", () => {
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
    const canisterAfterClaim = CANISTER_DOKA_AFTER_BOSS_RUSH + FEAT_GRANT;
    assert.equal(leftoverClaim, 300);
    assert.equal(canisterAfterClaim, 800);
    assert.equal(
      canisterAfterClaim - leftoverClaim,
      BOSS_RUSH_GRANT,
      "this leftover sits the risen room-clear grant below stored",
    );
  });
});
