import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clampSaveBattleStatsWrite } from "./absoluteStatsClamp.ts";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  clearOneShotDokaKeepRemountRenameSpend,
  committedDokaAfterRenameWithOneShotDokaKeepRemount,
  committedDokaAfterSpellUpgradeWithOneShotDokaKeepRemount,
  dokaAfterShopSpendWithOneShotDokaKeepRemountRename,
  dokaForOneShotDokaKeepRemountRenameSpend,
  dokaFromOneShotDokaKeepRenameSpendWalletRecord,
  hasOneShotDokaKeepRemountRenameSpend,
  noteOneShotDokaKeepRemountRenameSpend,
  oneShotDokaKeepRemountRenameSpendKey,
  persistRenameSpendThroughOneShotDokaKeepRemount,
  readOneShotDokaKeepRemountRenameSpend,
  sessionDokaAfterOneShotDokaKeepRemountRenameSpend,
  shouldRefuseOneShotDokaKeepRemountRenameSpendStaleDoka,
} from "./oneShotDokaKeepRemountRenameSpendWriteSkip.ts";
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
const PICKUP_GRANT = 50;
const SHRINE_GRANT = 300;
const CANISTER_DOKA_AFTER_PICKUP = PLAY_ENTRY_DOKA + PICKUP_GRANT;
const CANISTER_DOKA_AFTER_SHRINE = PLAY_ENTRY_DOKA + SHRINE_GRANT;
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

describe("oneShotDokaKeepRemountRenameSpendKey", () => {
  it("reads the same #800 slot key, not #979's victory rename key", () => {
    assert.equal(
      oneShotDokaKeepRemountRenameSpendKey(1),
      "pbv_oneshot_doka_keep_remount_slot1",
    );
    assert.equal(
      oneShotDokaKeepRemountRenameSpendKey(3),
      "pbv_oneshot_doka_keep_remount_slot3",
    );
    assert.notEqual(
      oneShotDokaKeepRemountRenameSpendKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    assert.notEqual(
      oneShotDokaKeepRemountRenameSpendKey(1),
      "pbv_absolute_doka_throw_keep_remount_slot1",
    );
    assert.notEqual(
      oneShotDokaKeepRemountRenameSpendKey(1),
      "pbv_spend_keep_remount_slot1",
    );
    assert.notEqual(
      oneShotDokaKeepRemountRenameSpendKey(1),
      "pbv_oneshot_doka_keep_remount_death_slot1",
    );
  });
});

describe("note / read / clear OneShotDokaKeepRemountRenameSpend", () => {
  it("round-trips the #800 { preDoka } shape", () => {
    const storage = memStorage();
    assert.equal(hasOneShotDokaKeepRemountRenameSpend(storage, 1), false);
    noteOneShotDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    assert.deepEqual(readOneShotDokaKeepRemountRenameSpend(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(hasOneShotDokaKeepRemountRenameSpend(storage, 1), true);
    clearOneShotDokaKeepRemountRenameSpend(storage, 1);
    assert.equal(readOneShotDokaKeepRemountRenameSpend(storage, 1), null);
  });

  it("isolates character slots", () => {
    const storage = memStorage();
    noteOneShotDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    noteOneShotDokaKeepRemountRenameSpend(storage, 2, 90);
    assert.deepEqual(readOneShotDokaKeepRemountRenameSpend(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.deepEqual(readOneShotDokaKeepRemountRenameSpend(storage, 2), {
      preDoka: 90,
    });
    clearOneShotDokaKeepRemountRenameSpend(storage, 1);
    assert.equal(readOneShotDokaKeepRemountRenameSpend(storage, 1), null);
    assert.equal(hasOneShotDokaKeepRemountRenameSpend(storage, 2), true);
  });
});

describe("dokaFromOneShotDokaKeepRenameSpendWalletRecord", () => {
  it("reads number, bigint, and { ok } wallets", () => {
    assert.equal(
      dokaFromOneShotDokaKeepRenameSpendWalletRecord(
        CANISTER_DOKA_AFTER_PICKUP,
      ),
      250,
    );
    assert.equal(dokaFromOneShotDokaKeepRenameSpendWalletRecord(250n), 250);
    assert.equal(
      dokaFromOneShotDokaKeepRenameSpendWalletRecord({
        ok: CANISTER_DOKA_AFTER_PICKUP,
      }),
      250,
    );
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromOneShotDokaKeepRenameSpendWalletRecord(null), null);
    assert.equal(dokaFromOneShotDokaKeepRenameSpendWalletRecord({}), null);
    assert.equal(
      dokaFromOneShotDokaKeepRenameSpendWalletRecord({ ok: "nope" }),
      null,
    );
  });
});

describe("shouldRefuseOneShotDokaKeepRemountRenameSpendStaleDoka", () => {
  it("fail-closes when live still equals or sits below stamped preDoka", () => {
    assert.equal(
      shouldRefuseOneShotDokaKeepRemountRenameSpendStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
    assert.equal(
      shouldRefuseOneShotDokaKeepRemountRenameSpendStaleDoka({
        keep: true,
        liveDoka: 0,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseOneShotDokaKeepRemountRenameSpendStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("does not refuse a risen replica wallet", () => {
    assert.equal(
      shouldRefuseOneShotDokaKeepRemountRenameSpendStaleDoka({
        keep: true,
        liveDoka: CANISTER_DOKA_AFTER_PICKUP,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseOneShotDokaKeepRemountRenameSpendStaleDoka({
        keep: false,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });
});

describe("one-shot applyRewards transport-keep then remount rename without unpaid death", () => {
  it("leftover remount rename commits 100 over canister 150", () => {
    // Chronology:
    // 1. World hydrated. Lock Doka 200. Canister 200.
    // 2. Ground persistDokaCreditResult(50) invokes then throws.
    //    Confirm stale 200. settle keep. HUD stays 200. #800 stamps
    //    preDoka=200.
    // 3. Actor reconnect remounts. Lock Doka 200.
    // 4. Rename committedDokaAfterRename(200) → 100. Canister deducts
    //    100 from 250 → 150.
    const leftoverCommit = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.equal(leftoverCommit, 100);
    const canisterAfterRename = CANISTER_DOKA_AFTER_PICKUP - RENAME_DOKA_COST;
    assert.equal(canisterAfterRename, 150);
    assert.equal(
      canisterAfterRename - leftoverCommit,
      PICKUP_GRANT,
      "lock sits the pickup grant below stored",
    );
  });

  it("leftover shop after that rename writes 50 over canister 150", () => {
    const leftoverShop = applySpendToCommitted(
      committedDokaAfterRename(PLAY_ENTRY_DOKA),
      SHOP_SPEND,
    );
    assert.equal(leftoverShop, 50);
    assert.equal(
      canisterAfterAbsoluteWrite(150, leftoverShop),
      50,
      "incoming-below-stored wipes the 50 pickup (correct remaining 100)",
    );
    assert.equal(
      applySpendToCommitted(
        CANISTER_DOKA_AFTER_PICKUP - RENAME_DOKA_COST,
        SHOP_SPEND,
      ),
      100,
    );
  });

  it("gated remount rename commits 150", () => {
    const gated = committedDokaAfterRenameWithOneShotDokaKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_PICKUP,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(gated, 150);
    const gatedShop = dokaAfterShopSpendWithOneShotDokaKeepRemountRename({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_PICKUP,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(gatedShop, 100);
    assert.equal(canisterAfterAbsoluteWrite(150, gatedShop ?? 0), 100);
  });

  it("same class: shrine +300 leftover rename then shop wipes the altar grant", () => {
    const leftoverCommit = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.equal(leftoverCommit, 100);
    const canisterAfterRename = CANISTER_DOKA_AFTER_SHRINE - RENAME_DOKA_COST;
    assert.equal(canisterAfterRename, 400);
    const leftoverShop = applySpendToCommitted(leftoverCommit, SHOP_SPEND);
    assert.equal(leftoverShop, 50);
    assert.equal(
      canisterAfterAbsoluteWrite(400, leftoverShop),
      50,
      "incoming-below-stored wipes shrine +300 (correct remaining 350)",
    );
    const gated = committedDokaAfterRenameWithOneShotDokaKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_SHRINE,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(gated, 400);
    const gatedShop = dokaAfterShopSpendWithOneShotDokaKeepRemountRename({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_SHRINE,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(gatedShop, 350);
    assert.equal(canisterAfterAbsoluteWrite(400, gatedShop ?? 0), 350);
  });
});

describe("upgrade leftover when getCallerDokaBalance is missing or risen", () => {
  it("leftover remount upgrade commits 190 over canister 240", () => {
    const leftover = committedDokaAfterSpellUpgrade(
      PLAY_ENTRY_DOKA,
      undefined,
      UPGRADE_COST,
    );
    assert.equal(leftover, 190);
    const canisterAfterUpgrade = CANISTER_DOKA_AFTER_PICKUP - UPGRADE_COST;
    assert.equal(canisterAfterUpgrade, 240);
    const leftoverShop = applySpendToCommitted(leftover, SHOP_SPEND);
    assert.equal(leftoverShop, 140);
    assert.equal(
      canisterAfterAbsoluteWrite(240, leftoverShop),
      140,
      "incoming-below-stored wipes the 50 pickup after upgrade",
    );
  });

  it("risen upgrade query does not self-heal vs remount 200", () => {
    const leftoverRisen = committedDokaAfterSpellUpgrade(
      PLAY_ENTRY_DOKA,
      240,
      UPGRADE_COST,
    );
    assert.equal(
      leftoverRisen,
      190,
      "production upgrade only adopts a dropped query; 240 > 200 stays 200 − 10",
    );
  });

  it("gated remount upgrade with no query commits 240", () => {
    const gated = committedDokaAfterSpellUpgradeWithOneShotDokaKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_PICKUP,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      backendDokaAfter: undefined,
      advertisedCost: UPGRADE_COST,
    });
    assert.equal(gated, 240);
  });

  it("gated remount upgrade with risen query still commits 240", () => {
    const gated = committedDokaAfterSpellUpgradeWithOneShotDokaKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_PICKUP,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      backendDokaAfter: 240,
      advertisedCost: UPGRADE_COST,
    });
    assert.equal(gated, 240);
  });
});

describe("sessionDokaAfterOneShotDokaKeepRemountRenameSpend", () => {
  it("ungated remount HUD stays Play-entry 200 so Rename still opens", () => {
    const session = sessionDokaAfterOneShotDokaKeepRemountRenameSpend({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_PICKUP,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, PLAY_ENTRY_DOKA);
    assert.equal(shouldStartRename(false, session), true);
  });

  it("honour replica 250 so HUD debit matches the canister", () => {
    const session = sessionDokaAfterOneShotDokaKeepRemountRenameSpend({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_PICKUP,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, CANISTER_DOKA_AFTER_PICKUP);
    assert.equal(shouldStartRename(false, session), true);
  });
});

describe("pickup-only remount still spends from Play-entry 200", () => {
  it("does not honour without a keep stamp", () => {
    const renamed = committedDokaAfterRenameWithOneShotDokaKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_PICKUP,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(renamed, 100);
    const shop = dokaAfterShopSpendWithOneShotDokaKeepRemountRename({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_PICKUP,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(shop, 50);
  });
});

describe("persistRenameSpendThroughOneShotDokaKeepRemount", () => {
  it("adopts replica 250 then rename commits 150", async () => {
    const storage = memStorage();
    noteOneShotDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    const ok = await persistRenameSpendThroughOneShotDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_PICKUP,
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
    assert.equal(persist.snapshot().doka, 150);
    assert.equal(
      hasOneShotDokaKeepRemountRenameSpend(storage, 1),
      false,
      "clear the stamp after honour so leftover shop cannot reconstruct 200",
    );
  });

  it("adopts replica 500 then shrine rename commits 400", async () => {
    const storage = memStorage();
    noteOneShotDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    await persistRenameSpendThroughOneShotDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_SHRINE,
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterRename(persist.snapshot().doka),
        });
        return true;
      },
    });
    assert.equal(persist.snapshot().doka, 400);
  });

  it("adopts replica 250 then missing-query upgrade commits 240", async () => {
    const storage = memStorage();
    noteOneShotDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    await persistRenameSpendThroughOneShotDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_PICKUP,
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
    assert.equal(persist.snapshot().doka, 240);
  });

  it("throws and does not apply when live Doka is still Play-entry", async () => {
    const storage = memStorage();
    noteOneShotDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistRenameSpendThroughOneShotDokaKeepRemount({
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
      hasOneShotDokaKeepRemountRenameSpend(storage, 1),
      true,
      "fail-close keeps the stamp",
    );
  });

  it("throws when getCallerDokaBalance fails so a stale rename cannot land", async () => {
    const storage = memStorage();
    noteOneShotDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistRenameSpendThroughOneShotDokaKeepRemount({
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
    const ok = await persistRenameSpendThroughOneShotDokaKeepRemount({
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
    noteOneShotDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    let flushed = 0;
    const persist = createProgressPersist(
      { doka: PLAY_ENTRY_DOKA, xp: 100, level: LEVEL },
      {
        beforeEach: async () => {
          flushed += 1;
        },
      },
    );
    await persistRenameSpendThroughOneShotDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_PICKUP,
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

describe("distinct from #800 shop honour, #877 death, #979 victory rename", () => {
  it("uses pbv_oneshot_doka_keep_remount_slotN, not victory / shop-throw keys", () => {
    const storage = memStorage();
    noteOneShotDokaKeepRemountRenameSpend(storage, 2, PLAY_ENTRY_DOKA);
    assert.equal(
      oneShotDokaKeepRemountRenameSpendKey(2),
      "pbv_oneshot_doka_keep_remount_slot2",
    );
    assert.equal(
      storage.getItem("pbv_oneshot_doka_keep_remount_slot2") != null,
      true,
    );
    assert.equal(storage.getItem("pbv_victory_doka_keep_remount_slot2"), null);
    assert.equal(
      storage.getItem("pbv_absolute_doka_throw_keep_remount_slot2"),
      null,
    );
    assert.equal(storage.getItem("pbv_spend_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot2"), null);
  });

  it("does not treat #800 remount shop spend 50 from 250 as this rename path", () => {
    const shopHonour = applySpendToCommitted(
      CANISTER_DOKA_AFTER_PICKUP,
      SHOP_SPEND,
    );
    assert.equal(shopHonour, 200, "#800 gated shop path");
    const deathCut = Math.floor(CANISTER_DOKA_AFTER_PICKUP * 0.6);
    assert.equal(deathCut, 150, "#877 taxes replica 250, not this rename");
    const leftoverRename = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.notEqual(leftoverRename, shopHonour);
    assert.notEqual(leftoverRename, deathCut);
  });

  it("does not skip leftover shop/heal honour — that stays #800", () => {
    const honour = dokaForOneShotDokaKeepRemountRenameSpend({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_PICKUP,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(honour, CANISTER_DOKA_AFTER_PICKUP);
    assert.equal(
      applySpendToCommitted(honour ?? 0, SHOP_SPEND),
      200,
      "shop leftover still spends from honoured replica; this sidecar only gates rename/upgrade",
    );
  });
});
