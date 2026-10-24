import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clampSaveBattleStatsWrite } from "./absoluteStatsClamp.ts";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  clearGameKeyDokaKeepRemountRenameSpend,
  committedDokaAfterRenameWithGameKeyDokaKeepRemount,
  committedDokaAfterSpellUpgradeWithGameKeyDokaKeepRemount,
  dokaAfterShopSpendWithGameKeyDokaKeepRemountRename,
  dokaForGameKeyDokaKeepRemountRenameSpend,
  dokaFromGameKeyDokaKeepRenameSpendWalletRecord,
  gameKeyDokaKeepRemountRenameSpendKey,
  hasGameKeyDokaKeepRemountRenameSpend,
  noteGameKeyDokaKeepRemountRenameSpend,
  persistRenameSpendThroughGameKeyDokaKeepRemount,
  readGameKeyDokaKeepRemountRenameSpend,
  sessionDokaAfterGameKeyDokaKeepRemountRenameSpend,
  shouldRefuseGameKeyDokaKeepRemountRenameSpendStaleDoka,
} from "./gameKeyDokaKeepRemountRenameSpendWriteSkip.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  createProgressPersist,
} from "./progressPersist.ts";
import {
  RENAME_DOKA_COST,
  committedDokaAfterRename,
  shouldStartRename,
} from "./renameCharacter.ts";
import { committedDokaAfterSpellUpgrade } from "./spellUpgrade.ts";

const PLAY_ENTRY_DOKA = 200;
const GAMEKEY_GRANT = 1000;
const CANISTER_DOKA_AFTER_GAMEKEY = PLAY_ENTRY_DOKA + GAMEKEY_GRANT;
const SHOP_SPEND = 50;
const UPGRADE_COST = 10;
const LEVEL = 1;

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

describe("gameKeyDokaKeepRemountRenameSpendKey", () => {
  it("reads the same #811 slot key, not #979 victory or #992 feat rename keys", () => {
    assert.equal(
      gameKeyDokaKeepRemountRenameSpendKey(1),
      "pbv_gamekey_doka_keep_remount_slot1",
    );
    assert.equal(
      gameKeyDokaKeepRemountRenameSpendKey(3),
      "pbv_gamekey_doka_keep_remount_slot3",
    );
    assert.notEqual(
      gameKeyDokaKeepRemountRenameSpendKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    assert.notEqual(
      gameKeyDokaKeepRemountRenameSpendKey(1),
      "pbv_feat_doka_keep_remount_slot1",
    );
    assert.notEqual(
      gameKeyDokaKeepRemountRenameSpendKey(1),
      "pbv_oneshot_doka_keep_remount_slot1",
    );
    assert.notEqual(
      gameKeyDokaKeepRemountRenameSpendKey(1),
      "pbv_absolute_doka_throw_keep_remount_slot1",
    );
    assert.notEqual(
      gameKeyDokaKeepRemountRenameSpendKey(1),
      "pbv_spend_keep_remount_slot1",
    );
    assert.notEqual(
      gameKeyDokaKeepRemountRenameSpendKey(1),
      "pbv_boss_rush_doka_keep_remount_slot1",
    );
  });
});

describe("note / read / clear GameKeyDokaKeepRemountRenameSpend", () => {
  it("round-trips the #811 { preDoka } shape", () => {
    const storage = memStorage();
    assert.equal(hasGameKeyDokaKeepRemountRenameSpend(storage, 1), false);
    noteGameKeyDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    assert.deepEqual(readGameKeyDokaKeepRemountRenameSpend(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(hasGameKeyDokaKeepRemountRenameSpend(storage, 1), true);
    clearGameKeyDokaKeepRemountRenameSpend(storage, 1);
    assert.equal(readGameKeyDokaKeepRemountRenameSpend(storage, 1), null);
  });

  it("isolates character slots", () => {
    const storage = memStorage();
    noteGameKeyDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    noteGameKeyDokaKeepRemountRenameSpend(storage, 2, 90);
    assert.deepEqual(readGameKeyDokaKeepRemountRenameSpend(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.deepEqual(readGameKeyDokaKeepRemountRenameSpend(storage, 2), {
      preDoka: 90,
    });
    clearGameKeyDokaKeepRemountRenameSpend(storage, 1);
    assert.equal(readGameKeyDokaKeepRemountRenameSpend(storage, 1), null);
    assert.equal(hasGameKeyDokaKeepRemountRenameSpend(storage, 2), true);
  });
});

describe("dokaFromGameKeyDokaKeepRenameSpendWalletRecord", () => {
  it("reads number, bigint, and { ok } wallets", () => {
    assert.equal(
      dokaFromGameKeyDokaKeepRenameSpendWalletRecord(
        CANISTER_DOKA_AFTER_GAMEKEY,
      ),
      1200,
    );
    assert.equal(dokaFromGameKeyDokaKeepRenameSpendWalletRecord(1200n), 1200);
    assert.equal(
      dokaFromGameKeyDokaKeepRenameSpendWalletRecord({
        ok: CANISTER_DOKA_AFTER_GAMEKEY,
      }),
      1200,
    );
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromGameKeyDokaKeepRenameSpendWalletRecord(null), null);
    assert.equal(dokaFromGameKeyDokaKeepRenameSpendWalletRecord({}), null);
    assert.equal(
      dokaFromGameKeyDokaKeepRenameSpendWalletRecord({ ok: "nope" }),
      null,
    );
  });
});

describe("shouldRefuseGameKeyDokaKeepRemountRenameSpendStaleDoka", () => {
  it("fail-closes when live still equals or sits below stamped preDoka", () => {
    assert.equal(
      shouldRefuseGameKeyDokaKeepRemountRenameSpendStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
    assert.equal(
      shouldRefuseGameKeyDokaKeepRemountRenameSpendStaleDoka({
        keep: true,
        liveDoka: 0,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseGameKeyDokaKeepRemountRenameSpendStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("does not refuse a risen replica wallet", () => {
    assert.equal(
      shouldRefuseGameKeyDokaKeepRemountRenameSpendStaleDoka({
        keep: true,
        liveDoka: CANISTER_DOKA_AFTER_GAMEKEY,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseGameKeyDokaKeepRemountRenameSpendStaleDoka({
        keep: false,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });
});

describe("GameKey redeem throw-after-add then remount rename without unpaid death", () => {
  it("leftover remount rename commits 100 over canister 1100", () => {
    // Chronology:
    // 1. World hydrated. Lock Doka 200. Canister 200.
    // 2. redeemGameKey accepts 1200 then throws. Shop catch only
    //    toasts. HUD stays 200. #811 stamps preDoka=200.
    // 3. Actor reconnect remounts. Lock Doka 200.
    // 4. Rename committedDokaAfterRename(200) → 100. Canister deducts
    //    100 from 1200 → 1100.
    const leftoverCommit = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.equal(leftoverCommit, 100);
    const canisterAfterRename = CANISTER_DOKA_AFTER_GAMEKEY - RENAME_DOKA_COST;
    assert.equal(canisterAfterRename, 1100);
    assert.equal(
      canisterAfterRename - leftoverCommit,
      GAMEKEY_GRANT,
      "lock sits the GameKey grant below stored",
    );
  });

  it("leftover shop after that rename writes 50 over canister 1100", () => {
    const leftoverShop = applySpendToCommitted(
      committedDokaAfterRename(PLAY_ENTRY_DOKA),
      SHOP_SPEND,
    );
    assert.equal(leftoverShop, 50);
    assert.equal(
      canisterAfterAbsoluteWrite(1100, leftoverShop),
      50,
      "incoming-below-stored wipes the 1000 GameKey grant (correct remaining 1050)",
    );
    assert.equal(
      applySpendToCommitted(
        CANISTER_DOKA_AFTER_GAMEKEY - RENAME_DOKA_COST,
        SHOP_SPEND,
      ),
      1050,
    );
  });

  it("gated remount rename commits 1100", () => {
    const gated = committedDokaAfterRenameWithGameKeyDokaKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_GAMEKEY,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(gated, 1100);
    const gatedShop = dokaAfterShopSpendWithGameKeyDokaKeepRemountRename({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_GAMEKEY,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(gatedShop, 1050);
    assert.equal(canisterAfterAbsoluteWrite(1100, gatedShop ?? 0), 1050);
  });
});

describe("upgrade leftover when getCallerDokaBalance is missing or risen", () => {
  it("leftover remount upgrade commits 190 over canister 1190", () => {
    const leftover = committedDokaAfterSpellUpgrade(
      PLAY_ENTRY_DOKA,
      undefined,
      UPGRADE_COST,
    );
    assert.equal(leftover, 190);
    const canisterAfterUpgrade = CANISTER_DOKA_AFTER_GAMEKEY - UPGRADE_COST;
    assert.equal(canisterAfterUpgrade, 1190);
    const leftoverShop = applySpendToCommitted(leftover, SHOP_SPEND);
    assert.equal(leftoverShop, 140);
    assert.equal(
      canisterAfterAbsoluteWrite(1190, leftoverShop),
      140,
      "incoming-below-stored wipes the 1000 GameKey grant after upgrade",
    );
  });

  it("risen upgrade query does not self-heal vs remount 200", () => {
    const leftoverRisen = committedDokaAfterSpellUpgrade(
      PLAY_ENTRY_DOKA,
      1190,
      UPGRADE_COST,
    );
    assert.equal(
      leftoverRisen,
      190,
      "production upgrade only adopts a dropped query; 1190 > 200 stays 200 − 10",
    );
  });

  it("gated remount upgrade with no query commits 1190", () => {
    const gated = committedDokaAfterSpellUpgradeWithGameKeyDokaKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_GAMEKEY,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      backendDokaAfter: undefined,
      advertisedCost: UPGRADE_COST,
    });
    assert.equal(gated, 1190);
  });

  it("gated remount upgrade with risen query still commits 1190", () => {
    const gated = committedDokaAfterSpellUpgradeWithGameKeyDokaKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_GAMEKEY,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      backendDokaAfter: 1190,
      advertisedCost: UPGRADE_COST,
    });
    assert.equal(gated, 1190);
  });
});

describe("sessionDokaAfterGameKeyDokaKeepRemountRenameSpend", () => {
  it("ungated remount HUD stays Play-entry 200 so Rename still opens", () => {
    const session = sessionDokaAfterGameKeyDokaKeepRemountRenameSpend({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_GAMEKEY,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, PLAY_ENTRY_DOKA);
    assert.equal(shouldStartRename(false, session), true);
  });

  it("honour replica 1200 so HUD debit matches the canister", () => {
    const session = sessionDokaAfterGameKeyDokaKeepRemountRenameSpend({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_GAMEKEY,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, CANISTER_DOKA_AFTER_GAMEKEY);
    assert.equal(shouldStartRename(false, session), true);
  });
});

describe("pickup-only remount still spends from Play-entry 200", () => {
  it("does not honour without a keep stamp", () => {
    const renamed = committedDokaAfterRenameWithGameKeyDokaKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_GAMEKEY,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(renamed, 100);
    const shop = dokaAfterShopSpendWithGameKeyDokaKeepRemountRename({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_GAMEKEY,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(shop, 50);
  });
});

describe("persistRenameSpendThroughGameKeyDokaKeepRemount", () => {
  it("adopts replica 1200 then rename commits 1100", async () => {
    const storage = memStorage();
    noteGameKeyDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    const ok = await persistRenameSpendThroughGameKeyDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_GAMEKEY,
      applyAndCommit: async () => {
        applied = true;
        persist.commit({
          doka: committedDokaAfterRename(persist.snapshot().doka),
        });
        return true;
      },
    });
    assert.equal(ok, true);
    assert.equal(applied, true);
    assert.equal(persist.snapshot().doka, 1100);
    assert.equal(
      hasGameKeyDokaKeepRemountRenameSpend(storage, 1),
      false,
      "clear the stamp after honour so leftover shop cannot reconstruct 200",
    );
  });

  it("adopts replica 1200 then missing-query upgrade commits 1190", async () => {
    const storage = memStorage();
    noteGameKeyDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    await persistRenameSpendThroughGameKeyDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_GAMEKEY,
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterSpellUpgrade(
            persist.snapshot().doka,
            undefined,
            UPGRADE_COST,
          ),
        });
        return true;
      },
    });
    assert.equal(persist.snapshot().doka, 1190);
  });

  it("throws and does not apply when live Doka is still Play-entry", async () => {
    const storage = memStorage();
    noteGameKeyDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistRenameSpendThroughGameKeyDokaKeepRemount({
          persist,
          storage,
          slot: 1,
          readWallet: async () => PLAY_ENTRY_DOKA,
          applyAndCommit: async () => {
            applied = true;
            persist.commit({
              doka: committedDokaAfterRename(persist.snapshot().doka),
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
      hasGameKeyDokaKeepRemountRenameSpend(storage, 1),
      true,
      "fail-close keeps the stamp",
    );
  });

  it("throws when getCallerDokaBalance fails so a stale rename cannot land", async () => {
    const storage = memStorage();
    noteGameKeyDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistRenameSpendThroughGameKeyDokaKeepRemount({
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
    const ok = await persistRenameSpendThroughGameKeyDokaKeepRemount({
      persist,
      storage: memStorage(),
      slot: 1,
      readWallet: async () => {
        throw new Error("must not fetch without a stamp");
      },
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterRename(persist.snapshot().doka),
        });
        return true;
      },
    });
    assert.equal(ok, true);
    assert.equal(persist.snapshot().doka, 100);
  });

  it("runs beforeEach so rename persist can flush unpaid death (#445)", async () => {
    const storage = memStorage();
    noteGameKeyDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    let flushed = 0;
    const persist = createProgressPersist(
      { doka: PLAY_ENTRY_DOKA, xp: 100, level: LEVEL },
      {
        beforeEach: async () => {
          flushed += 1;
        },
      },
    );
    await persistRenameSpendThroughGameKeyDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_GAMEKEY,
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterRename(persist.snapshot().doka),
        });
        return true;
      },
    });
    assert.equal(flushed, 1);
  });
});

describe("distinct from #811 shop honour, #900 death, #979 victory rename", () => {
  it("uses pbv_gamekey_doka_keep_remount_slotN, not victory / feat / shop-throw keys", () => {
    const storage = memStorage();
    noteGameKeyDokaKeepRemountRenameSpend(storage, 2, PLAY_ENTRY_DOKA);
    assert.equal(
      gameKeyDokaKeepRemountRenameSpendKey(2),
      "pbv_gamekey_doka_keep_remount_slot2",
    );
    assert.equal(
      storage.getItem("pbv_gamekey_doka_keep_remount_slot2") != null,
      true,
    );
    assert.equal(storage.getItem("pbv_victory_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_feat_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_oneshot_doka_keep_remount_slot2"), null);
    assert.equal(
      storage.getItem("pbv_absolute_doka_throw_keep_remount_slot2"),
      null,
    );
    assert.equal(storage.getItem("pbv_spend_keep_remount_slot2"), null);
    assert.equal(
      storage.getItem("pbv_boss_rush_doka_keep_remount_slot2"),
      null,
    );
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot2"), null);
  });

  it("does not treat #811 remount shop spend 50 from 1200 as this rename path", () => {
    const shopHonour = applySpendToCommitted(
      CANISTER_DOKA_AFTER_GAMEKEY,
      SHOP_SPEND,
    );
    assert.equal(shopHonour, 1150, "#811 gated shop path");
    const deathCut = Math.floor(CANISTER_DOKA_AFTER_GAMEKEY * 0.6);
    assert.equal(deathCut, 720, "#900 taxes replica 1200, not this rename");
    const leftoverRename = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.notEqual(leftoverRename, shopHonour);
    assert.notEqual(leftoverRename, deathCut);
  });

  it("does not skip leftover shop/heal honour — that stays #811", () => {
    const honour = dokaForGameKeyDokaKeepRemountRenameSpend({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_GAMEKEY,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(honour, CANISTER_DOKA_AFTER_GAMEKEY);
    assert.equal(
      applySpendToCommitted(honour ?? 0, SHOP_SPEND),
      1150,
      "shop leftover still spends from honoured replica; this sidecar only gates rename/upgrade",
    );
  });
});
