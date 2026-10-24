import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clampSaveBattleStatsWrite } from "./absoluteStatsClamp.ts";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
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
import {
  clearSpendKeepRemountRenameSpend,
  committedDokaAfterRenameWithSpendKeepRemount,
  committedDokaAfterSpellUpgradeWithSpendKeepRemount,
  dokaAfterShopSpendWithSpendKeepRemountRename,
  dokaForSpendKeepRemountRenameSpend,
  dokaFromSpendKeepRenameSpendWalletRecord,
  hasSpendKeepRemountRenameSpend,
  noteSpendKeepRemountRenameSpend,
  persistRenameSpendThroughSpendKeepRemount,
  readSpendKeepRemountRenameSpend,
  sessionDokaAfterSpendKeepRemountRenameSpend,
  shouldRefuseSpendKeepRemountRenameSpendStaleDoka,
  spendKeepRemountRenameSpendKey,
} from "./spendKeepRemountRenameSpendWriteSkip.ts";

const PLAY_ENTRY_DOKA = 200;
const RENAME_THROW_CANISTER = PLAY_ENTRY_DOKA - RENAME_DOKA_COST;
const UPGRADE_COST = 10;
const UPGRADE_THROW_CANISTER = PLAY_ENTRY_DOKA - UPGRADE_COST;
const SHOP_SPEND = 50;
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

describe("spendKeepRemountRenameSpendKey", () => {
  it("reads the same #926 slot key, not #977's shop-throw rename key", () => {
    assert.equal(
      spendKeepRemountRenameSpendKey(1),
      "pbv_spend_keep_remount_slot1",
    );
    assert.equal(
      spendKeepRemountRenameSpendKey(3),
      "pbv_spend_keep_remount_slot3",
    );
    assert.notEqual(
      spendKeepRemountRenameSpendKey(1),
      "pbv_absolute_doka_throw_keep_remount_slot1",
    );
    assert.notEqual(
      spendKeepRemountRenameSpendKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spendKeepRemountRenameSpendKey(1),
      "pbv_spend_keep_remount_death_slot1",
    );
  });
});

describe("note / read / clear SpendKeepRemountRenameSpend", () => {
  it("round-trips the #926 { preDoka } shape", () => {
    const storage = memStorage();
    assert.equal(hasSpendKeepRemountRenameSpend(storage, 1), false);
    noteSpendKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    assert.deepEqual(readSpendKeepRemountRenameSpend(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(hasSpendKeepRemountRenameSpend(storage, 1), true);
    clearSpendKeepRemountRenameSpend(storage, 1);
    assert.equal(readSpendKeepRemountRenameSpend(storage, 1), null);
  });

  it("isolates character slots", () => {
    const storage = memStorage();
    noteSpendKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    noteSpendKeepRemountRenameSpend(storage, 2, 90);
    assert.deepEqual(readSpendKeepRemountRenameSpend(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.deepEqual(readSpendKeepRemountRenameSpend(storage, 2), {
      preDoka: 90,
    });
    clearSpendKeepRemountRenameSpend(storage, 1);
    assert.equal(readSpendKeepRemountRenameSpend(storage, 1), null);
    assert.equal(hasSpendKeepRemountRenameSpend(storage, 2), true);
  });
});

describe("dokaFromSpendKeepRenameSpendWalletRecord", () => {
  it("reads number, bigint, and { ok } wallets", () => {
    assert.equal(
      dokaFromSpendKeepRenameSpendWalletRecord(RENAME_THROW_CANISTER),
      100,
    );
    assert.equal(dokaFromSpendKeepRenameSpendWalletRecord(100n), 100);
    assert.equal(
      dokaFromSpendKeepRenameSpendWalletRecord({
        ok: RENAME_THROW_CANISTER,
      }),
      100,
    );
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromSpendKeepRenameSpendWalletRecord(null), null);
    assert.equal(dokaFromSpendKeepRenameSpendWalletRecord({}), null);
    assert.equal(
      dokaFromSpendKeepRenameSpendWalletRecord({ ok: "nope" }),
      null,
    );
  });
});

describe("shouldRefuseSpendKeepRemountRenameSpendStaleDoka", () => {
  it("fail-closes when live still equals or sits above stamped preDoka", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountRenameSpendStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
    assert.equal(
      shouldRefuseSpendKeepRemountRenameSpendStaleDoka({
        keep: true,
        liveDoka: 250,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountRenameSpendStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("does not refuse a dropped replica wallet", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountRenameSpendStaleDoka({
        keep: true,
        liveDoka: RENAME_THROW_CANISTER,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountRenameSpendStaleDoka({
        keep: false,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });
});

describe("rename throw-after-debit then remount rename without unpaid death", () => {
  it("leftover remount rename commits 100 over canister 0", () => {
    // Chronology:
    // 1. World hydrated. Lock Doka 200. Canister 200.
    // 2. Rename deducts 100 then throws. Catch toasts. HUD stays 200.
    //    #926 stamps preDoka=200.
    // 3. Actor reconnect remounts. Lock Doka 200.
    // 4. Rename committedDokaAfterRename(200) → 100. Canister deducts
    //    100 from 100 → 0.
    const leftoverCommit = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.equal(leftoverCommit, 100);
    const canisterAfterRename = RENAME_THROW_CANISTER - RENAME_DOKA_COST;
    assert.equal(canisterAfterRename, 0);
    assert.equal(
      leftoverCommit - canisterAfterRename,
      RENAME_DOKA_COST,
      "lock sits the first rename fee above stored",
    );
  });

  it("leftover shop after that rename never-raises 50 over canister 0", () => {
    const leftoverShop = applySpendToCommitted(
      committedDokaAfterRename(PLAY_ENTRY_DOKA),
      SHOP_SPEND,
    );
    assert.equal(leftoverShop, 50);
    assert.equal(
      canisterAfterAbsoluteWrite(0, leftoverShop),
      0,
      "incoming-above-stored never-raise: free BuffShop item, canister stays 0",
    );
    assert.equal(
      applySpendToCommitted(
        RENAME_THROW_CANISTER - RENAME_DOKA_COST,
        SHOP_SPEND,
      ),
      0,
    );
  });

  it("gated remount rename commits 0", () => {
    const gated = committedDokaAfterRenameWithSpendKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_THROW_CANISTER,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(gated, 0);
    const gatedShop = dokaAfterShopSpendWithSpendKeepRemountRename({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_THROW_CANISTER,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(gatedShop, 0);
    assert.equal(canisterAfterAbsoluteWrite(0, gatedShop ?? 0), 0);
  });
});

describe("upgrade throw-after-debit then remount rename refunds the fee", () => {
  it("leftover remount rename commits 100 over canister 90", () => {
    const leftoverCommit = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.equal(leftoverCommit, 100);
    const canisterAfterRename = UPGRADE_THROW_CANISTER - RENAME_DOKA_COST;
    assert.equal(canisterAfterRename, 90);
    assert.equal(
      leftoverCommit - canisterAfterRename,
      UPGRADE_COST,
      "lock sits the upgrade fee above stored",
    );
  });

  it("leftover shop after that rename writes 50 over canister 90", () => {
    const leftoverShop = applySpendToCommitted(
      committedDokaAfterRename(PLAY_ENTRY_DOKA),
      SHOP_SPEND,
    );
    assert.equal(leftoverShop, 50);
    assert.equal(
      canisterAfterAbsoluteWrite(90, leftoverShop),
      50,
      "incoming-below-stored refunds the 10 upgrade fee (correct remaining 40)",
    );
    assert.equal(
      applySpendToCommitted(
        UPGRADE_THROW_CANISTER - RENAME_DOKA_COST,
        SHOP_SPEND,
      ),
      40,
    );
  });

  it("gated remount rename commits 90", () => {
    const gated = committedDokaAfterRenameWithSpendKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: UPGRADE_THROW_CANISTER,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(gated, 90);
    const gatedShop = dokaAfterShopSpendWithSpendKeepRemountRename({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: UPGRADE_THROW_CANISTER,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(gatedShop, 40);
    assert.equal(canisterAfterAbsoluteWrite(90, gatedShop ?? 0), 40);
  });
});

describe("upgrade leftover when getCallerDokaBalance is missing or stale-high", () => {
  it("leftover remount upgrade after rename throw commits 190 over canister 90", () => {
    const leftover = committedDokaAfterSpellUpgrade(
      PLAY_ENTRY_DOKA,
      undefined,
      UPGRADE_COST,
    );
    assert.equal(leftover, 190);
    const canisterAfterUpgrade = RENAME_THROW_CANISTER - UPGRADE_COST;
    assert.equal(canisterAfterUpgrade, 90);
    const leftoverShop = applySpendToCommitted(leftover, SHOP_SPEND);
    assert.equal(leftoverShop, 140);
    assert.equal(
      canisterAfterAbsoluteWrite(90, leftoverShop),
      90,
      "incoming-above-stored never-raise: free BuffShop item, 50 Doka uncharged",
    );
  });

  it("stale-high upgrade query does not self-heal vs remount 200", () => {
    const leftoverStaleHigh = committedDokaAfterSpellUpgrade(
      PLAY_ENTRY_DOKA,
      PLAY_ENTRY_DOKA,
      UPGRADE_COST,
    );
    assert.equal(
      leftoverStaleHigh,
      190,
      "production upgrade only adopts a dropped query; 200 >= 200 stays 200 − 10",
    );
  });

  it("dropped upgrade query already self-heals vs remount 200", () => {
    const adopted = committedDokaAfterSpellUpgrade(
      PLAY_ENTRY_DOKA,
      RENAME_THROW_CANISTER - UPGRADE_COST,
      UPGRADE_COST,
    );
    assert.equal(adopted, 90, "after 90 < before 200 is adopted");
  });

  it("gated remount upgrade with no query commits 90", () => {
    const gated = committedDokaAfterSpellUpgradeWithSpendKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_THROW_CANISTER,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      backendDokaAfter: undefined,
      advertisedCost: UPGRADE_COST,
    });
    assert.equal(gated, 90);
  });

  it("gated remount upgrade with dropped query still commits 90", () => {
    const gated = committedDokaAfterSpellUpgradeWithSpendKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_THROW_CANISTER,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      backendDokaAfter: 90,
      advertisedCost: UPGRADE_COST,
    });
    assert.equal(gated, 90);
  });
});

describe("sessionDokaAfterSpendKeepRemountRenameSpend", () => {
  it("ungated remount HUD stays Play-entry 200 so Rename still opens", () => {
    const session = sessionDokaAfterSpendKeepRemountRenameSpend({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_THROW_CANISTER,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, PLAY_ENTRY_DOKA);
    assert.equal(shouldStartRename(false, session), true);
  });

  it("honour replica 100 so HUD debit matches the canister", () => {
    const session = sessionDokaAfterSpendKeepRemountRenameSpend({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_THROW_CANISTER,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, RENAME_THROW_CANISTER);
    assert.equal(shouldStartRename(false, session), true);
  });

  it("honour replica 190 after upgrade throw still opens Rename", () => {
    const session = sessionDokaAfterSpendKeepRemountRenameSpend({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: UPGRADE_THROW_CANISTER,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, UPGRADE_THROW_CANISTER);
    assert.equal(shouldStartRename(false, session), true);
  });
});

describe("pickup-only remount still spends from Play-entry 200", () => {
  it("does not honour without a keep stamp", () => {
    const renamed = committedDokaAfterRenameWithSpendKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_THROW_CANISTER,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(renamed, 100);
    const shop = dokaAfterShopSpendWithSpendKeepRemountRename({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_THROW_CANISTER,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(shop, 50);
  });
});

describe("persistRenameSpendThroughSpendKeepRemount", () => {
  it("adopts replica 100 then rename commits 0", async () => {
    const storage = memStorage();
    noteSpendKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    const ok = await persistRenameSpendThroughSpendKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => RENAME_THROW_CANISTER,
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
    assert.equal(persist.snapshot().doka, 0);
    assert.equal(
      hasSpendKeepRemountRenameSpend(storage, 1),
      false,
      "clear the stamp after honour so leftover shop cannot reconstruct 200",
    );
  });

  it("adopts replica 190 then rename commits 90", async () => {
    const storage = memStorage();
    noteSpendKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    await persistRenameSpendThroughSpendKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => UPGRADE_THROW_CANISTER,
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterRename(persist.snapshot().doka),
        });
        return true;
      },
    });
    assert.equal(persist.snapshot().doka, 90);
  });

  it("adopts replica 100 then missing-query upgrade commits 90", async () => {
    const storage = memStorage();
    noteSpendKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    await persistRenameSpendThroughSpendKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => RENAME_THROW_CANISTER,
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
    assert.equal(persist.snapshot().doka, 90);
  });

  it("throws and does not apply when live Doka is still Play-entry", async () => {
    const storage = memStorage();
    noteSpendKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistRenameSpendThroughSpendKeepRemount({
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
      hasSpendKeepRemountRenameSpend(storage, 1),
      true,
      "fail-close keeps the stamp",
    );
  });

  it("throws when getCallerDokaBalance fails so a stale rename cannot land", async () => {
    const storage = memStorage();
    noteSpendKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistRenameSpendThroughSpendKeepRemount({
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
    const ok = await persistRenameSpendThroughSpendKeepRemount({
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
    noteSpendKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    let flushed = 0;
    const persist = createProgressPersist(
      { doka: PLAY_ENTRY_DOKA, xp: 100, level: LEVEL },
      {
        beforeEach: async () => {
          flushed += 1;
        },
      },
    );
    await persistRenameSpendThroughSpendKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => RENAME_THROW_CANISTER,
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

describe("distinct from #926 shop honour, #938 death, #977 shop-throw rename", () => {
  it("uses pbv_spend_keep_remount_slotN, not shop-throw / victory keys", () => {
    const storage = memStorage();
    noteSpendKeepRemountRenameSpend(storage, 2, PLAY_ENTRY_DOKA);
    assert.equal(
      spendKeepRemountRenameSpendKey(2),
      "pbv_spend_keep_remount_slot2",
    );
    assert.equal(storage.getItem("pbv_spend_keep_remount_slot2") != null, true);
    assert.equal(
      storage.getItem("pbv_absolute_doka_throw_keep_remount_slot2"),
      null,
    );
    assert.equal(storage.getItem("pbv_victory_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot2"), null);
  });

  it("does not treat #926 remount shop spend 50 from 100 as this rename path", () => {
    const shopHonour = applySpendToCommitted(RENAME_THROW_CANISTER, SHOP_SPEND);
    assert.equal(shopHonour, 50, "#926 gated shop path");
    const deathCut = Math.floor(RENAME_THROW_CANISTER * 0.6);
    assert.equal(deathCut, 60, "#938 taxes replica 100, not this rename");
    const leftoverRename = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.notEqual(leftoverRename, shopHonour);
    assert.notEqual(leftoverRename, deathCut);
  });

  it("does not skip leftover shop/heal honour — that stays #926", () => {
    const honour = dokaForSpendKeepRemountRenameSpend({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_THROW_CANISTER,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(honour, RENAME_THROW_CANISTER);
    assert.equal(
      applySpendToCommitted(honour ?? 0, SHOP_SPEND),
      50,
      "shop leftover still spends from honoured replica; this sidecar only gates rename/upgrade",
    );
  });
});
