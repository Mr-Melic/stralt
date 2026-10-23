import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  absoluteDokaThrowKeepRemountRenameSpendKey,
  clearAbsoluteDokaThrowKeepRemountRenameSpend,
  committedDokaAfterRenameWithAbsoluteDokaThrowKeepRemount,
  committedDokaAfterSpellUpgradeWithAbsoluteDokaThrowKeepRemount,
  dokaAfterShopSpendWithAbsoluteDokaThrowKeepRemountRename,
  dokaForAbsoluteDokaThrowKeepRemountRenameSpend,
  dokaFromAbsoluteDokaThrowRenameSpendWalletRecord,
  hasAbsoluteDokaThrowKeepRemountRenameSpend,
  noteAbsoluteDokaThrowKeepRemountRenameSpend,
  persistRenameSpendThroughAbsoluteDokaThrowKeepRemount,
  readAbsoluteDokaThrowKeepRemountRenameSpend,
  sessionDokaAfterAbsoluteDokaThrowKeepRemountRenameSpend,
  shouldRefuseAbsoluteDokaThrowKeepRemountRenameSpendStaleDoka,
} from "./absoluteDokaThrowKeepRemountRenameSpendWriteSkip.ts";
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

const ROLLBACK_DOKA = 200;
const CANISTER_DOKA_AFTER_HEAL = 183;
const CANISTER_DOKA_AFTER_SHOP = 150;
const HEAL_SPEND = 17;
const SHOP_SPEND = 50;
const UPGRADE_COST = 10;
const LARGE_SHOP_SPEND = 120;
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

describe("absoluteDokaThrowKeepRemountRenameSpendKey", () => {
  it("reads the same #964 slot key, not #926's spend-keep key", () => {
    assert.equal(
      absoluteDokaThrowKeepRemountRenameSpendKey(1),
      "pbv_absolute_doka_throw_keep_remount_slot1",
    );
    assert.equal(
      absoluteDokaThrowKeepRemountRenameSpendKey(3),
      "pbv_absolute_doka_throw_keep_remount_slot3",
    );
    assert.notEqual(
      absoluteDokaThrowKeepRemountRenameSpendKey(1),
      "pbv_spend_keep_remount_slot1",
    );
    assert.notEqual(
      absoluteDokaThrowKeepRemountRenameSpendKey(1),
      "pbv_absolute_hp_throw_keep_remount_slot1",
    );
  });
});

describe("note / read / clear AbsoluteDokaThrowKeepRemountRenameSpend", () => {
  it("round-trips the #964 { preDoka } shape", () => {
    const storage = memStorage();
    assert.equal(hasAbsoluteDokaThrowKeepRemountRenameSpend(storage, 1), false);
    noteAbsoluteDokaThrowKeepRemountRenameSpend(storage, 1, ROLLBACK_DOKA);
    assert.deepEqual(readAbsoluteDokaThrowKeepRemountRenameSpend(storage, 1), {
      preDoka: ROLLBACK_DOKA,
    });
    assert.equal(hasAbsoluteDokaThrowKeepRemountRenameSpend(storage, 1), true);
    clearAbsoluteDokaThrowKeepRemountRenameSpend(storage, 1);
    assert.equal(readAbsoluteDokaThrowKeepRemountRenameSpend(storage, 1), null);
  });

  it("isolates character slots", () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountRenameSpend(storage, 1, ROLLBACK_DOKA);
    noteAbsoluteDokaThrowKeepRemountRenameSpend(storage, 2, 90);
    assert.deepEqual(readAbsoluteDokaThrowKeepRemountRenameSpend(storage, 1), {
      preDoka: ROLLBACK_DOKA,
    });
    assert.deepEqual(readAbsoluteDokaThrowKeepRemountRenameSpend(storage, 2), {
      preDoka: 90,
    });
    clearAbsoluteDokaThrowKeepRemountRenameSpend(storage, 1);
    assert.equal(readAbsoluteDokaThrowKeepRemountRenameSpend(storage, 1), null);
    assert.equal(hasAbsoluteDokaThrowKeepRemountRenameSpend(storage, 2), true);
  });
});

describe("dokaFromAbsoluteDokaThrowRenameSpendWalletRecord", () => {
  it("reads number, bigint, and { ok } wallets", () => {
    assert.equal(
      dokaFromAbsoluteDokaThrowRenameSpendWalletRecord(
        CANISTER_DOKA_AFTER_HEAL,
      ),
      183,
    );
    assert.equal(dokaFromAbsoluteDokaThrowRenameSpendWalletRecord(183n), 183);
    assert.equal(
      dokaFromAbsoluteDokaThrowRenameSpendWalletRecord({
        ok: CANISTER_DOKA_AFTER_SHOP,
      }),
      150,
    );
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromAbsoluteDokaThrowRenameSpendWalletRecord(null), null);
    assert.equal(dokaFromAbsoluteDokaThrowRenameSpendWalletRecord({}), null);
    assert.equal(
      dokaFromAbsoluteDokaThrowRenameSpendWalletRecord({ ok: "nope" }),
      null,
    );
  });
});

describe("shouldRefuseAbsoluteDokaThrowKeepRemountRenameSpendStaleDoka", () => {
  it("fail-closes when live still equals or sits above stamped preDoka", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountRenameSpendStaleDoka({
        keep: true,
        liveDoka: ROLLBACK_DOKA,
        stampedPreDoka: ROLLBACK_DOKA,
      }),
      true,
    );
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountRenameSpendStaleDoka({
        keep: true,
        liveDoka: 250,
        stampedPreDoka: ROLLBACK_DOKA,
      }),
      true,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountRenameSpendStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: ROLLBACK_DOKA,
      }),
      true,
    );
  });

  it("does not refuse a dropped replica wallet", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountRenameSpendStaleDoka({
        keep: true,
        liveDoka: CANISTER_DOKA_AFTER_HEAL,
        stampedPreDoka: ROLLBACK_DOKA,
      }),
      false,
    );
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountRenameSpendStaleDoka({
        keep: true,
        liveDoka: CANISTER_DOKA_AFTER_SHOP,
        stampedPreDoka: ROLLBACK_DOKA,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountRenameSpendStaleDoka({
        keep: false,
        liveDoka: ROLLBACK_DOKA,
        stampedPreDoka: ROLLBACK_DOKA,
      }),
      false,
    );
  });
});

describe("heal saveBattleStats throw-after-accept then remount rename without unpaid death", () => {
  it("leftover remount rename commits 100 over canister 83", () => {
    // Chronology:
    // 1. World hydrated. Lock Doka 200. Canister 200.
    // 2. Doka-heal saveBattleStats accepts 183 then throws. Catch
    //    returns false. HUD rollback 200. #964 stamps preDoka=200.
    // 3. Actor reconnect remounts. Lock Doka 200.
    // 4. Rename committedDokaAfterRename(200) → 100. Canister deducts
    //    100 from 183 → 83.
    const leftoverCommit = committedDokaAfterRename(ROLLBACK_DOKA);
    assert.equal(leftoverCommit, 100);
    const canisterAfterRename = CANISTER_DOKA_AFTER_HEAL - RENAME_DOKA_COST;
    assert.equal(canisterAfterRename, 83);
    assert.equal(
      leftoverCommit - canisterAfterRename,
      HEAL_SPEND,
      "lock sits the original heal fee above stored",
    );
  });

  it("leftover shop after that rename writes 50 over canister 83", () => {
    const leftoverShop = applySpendToCommitted(
      committedDokaAfterRename(ROLLBACK_DOKA),
      SHOP_SPEND,
    );
    assert.equal(leftoverShop, 50);
    assert.equal(
      canisterAfterAbsoluteWrite(83, leftoverShop),
      50,
      "incoming-below-stored refunds the 17 heal fee (correct remaining 33)",
    );
    assert.equal(
      applySpendToCommitted(
        CANISTER_DOKA_AFTER_HEAL - RENAME_DOKA_COST,
        SHOP_SPEND,
      ),
      33,
    );
  });

  it("gated remount rename commits 83", () => {
    const gated = committedDokaAfterRenameWithAbsoluteDokaThrowKeepRemount({
      remountDoka: ROLLBACK_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_HEAL,
      keep: true,
      stampedPreDoka: ROLLBACK_DOKA,
    });
    assert.equal(gated, 83);
    const gatedShop = dokaAfterShopSpendWithAbsoluteDokaThrowKeepRemountRename({
      remountDoka: ROLLBACK_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_HEAL,
      keep: true,
      stampedPreDoka: ROLLBACK_DOKA,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(gatedShop, 33);
    assert.equal(canisterAfterAbsoluteWrite(83, gatedShop ?? 0), 33);
  });
});

describe("shop saveBattleStats throw-after-accept then remount rename without unpaid death", () => {
  it("leftover remount rename then shop refunds the original 50 purchase", () => {
    // Items Buy accepts 150 then throws. Remount lock 200.
    // Rename commits 100; canister 150 − 100 = 50. Leftover shop spend
    // 50 writes 50 over stored 50 — the first purchase is refunded.
    const leftoverRename = committedDokaAfterRename(ROLLBACK_DOKA);
    assert.equal(leftoverRename, 100);
    const canisterAfterRename = CANISTER_DOKA_AFTER_SHOP - RENAME_DOKA_COST;
    assert.equal(canisterAfterRename, 50);
    const leftoverShop = applySpendToCommitted(leftoverRename, SHOP_SPEND);
    assert.equal(leftoverShop, 50);
    assert.equal(canisterAfterAbsoluteWrite(50, leftoverShop), 50);
    assert.equal(
      applySpendToCommitted(canisterAfterRename, SHOP_SPEND),
      0,
      "correct remaining after honouring replica 150 then rename + shop",
    );
  });

  it("gated remount rename then shop writes 0", () => {
    const gatedRename =
      committedDokaAfterRenameWithAbsoluteDokaThrowKeepRemount({
        remountDoka: ROLLBACK_DOKA,
        liveDoka: CANISTER_DOKA_AFTER_SHOP,
        keep: true,
        stampedPreDoka: ROLLBACK_DOKA,
      });
    assert.equal(gatedRename, 50);
    const gatedShop = dokaAfterShopSpendWithAbsoluteDokaThrowKeepRemountRename({
      remountDoka: ROLLBACK_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_SHOP,
      keep: true,
      stampedPreDoka: ROLLBACK_DOKA,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(gatedShop, 0);
    assert.equal(canisterAfterAbsoluteWrite(50, gatedShop ?? 0), 0);
  });
});

describe("upgrade leftover when getCallerDokaBalance is missing", () => {
  it("leftover remount upgrade commits 190 over canister 173", () => {
    const leftover = committedDokaAfterSpellUpgrade(
      ROLLBACK_DOKA,
      undefined,
      UPGRADE_COST,
    );
    assert.equal(leftover, 190);
    const canisterAfterUpgrade = CANISTER_DOKA_AFTER_HEAL - UPGRADE_COST;
    assert.equal(canisterAfterUpgrade, 173);
    const leftoverShop = applySpendToCommitted(leftover, SHOP_SPEND);
    assert.equal(leftoverShop, 140);
    assert.equal(
      canisterAfterAbsoluteWrite(173, leftoverShop),
      140,
      "incoming-below-stored refunds the 17 heal fee after upgrade",
    );
  });

  it("gated remount upgrade with no query commits 173", () => {
    const gated =
      committedDokaAfterSpellUpgradeWithAbsoluteDokaThrowKeepRemount({
        remountDoka: ROLLBACK_DOKA,
        liveDoka: CANISTER_DOKA_AFTER_HEAL,
        keep: true,
        stampedPreDoka: ROLLBACK_DOKA,
        backendDokaAfter: undefined,
        advertisedCost: UPGRADE_COST,
      });
    assert.equal(gated, 173);
  });

  it("fresh upgrade query already self-heals vs remount 200 — gated still 173", () => {
    const leftoverFresh = committedDokaAfterSpellUpgrade(
      ROLLBACK_DOKA,
      173,
      UPGRADE_COST,
    );
    assert.equal(
      leftoverFresh,
      173,
      "production upgrade with a dropped query already adopts 173",
    );
    const gated =
      committedDokaAfterSpellUpgradeWithAbsoluteDokaThrowKeepRemount({
        remountDoka: ROLLBACK_DOKA,
        liveDoka: CANISTER_DOKA_AFTER_HEAL,
        keep: true,
        stampedPreDoka: ROLLBACK_DOKA,
        backendDokaAfter: 173,
        advertisedCost: UPGRADE_COST,
      });
    assert.equal(gated, 173);
  });
});

describe("sessionDokaAfterAbsoluteDokaThrowKeepRemountRenameSpend", () => {
  it("ungated remount HUD stays rollback 200 so Rename still opens", () => {
    const session = sessionDokaAfterAbsoluteDokaThrowKeepRemountRenameSpend({
      remountDoka: ROLLBACK_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_HEAL,
      keep: false,
      stampedPreDoka: ROLLBACK_DOKA,
    });
    assert.equal(session, ROLLBACK_DOKA);
    assert.equal(shouldStartRename(false, session), true);
  });

  it("honour replica 183 so HUD debit matches the canister", () => {
    const session = sessionDokaAfterAbsoluteDokaThrowKeepRemountRenameSpend({
      remountDoka: ROLLBACK_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_HEAL,
      keep: true,
      stampedPreDoka: ROLLBACK_DOKA,
    });
    assert.equal(session, CANISTER_DOKA_AFTER_HEAL);
    assert.equal(shouldStartRename(false, session), true);
  });

  it("honour replica 80 after a large shop throw hides Rename", () => {
    const leftoverOpens = shouldStartRename(false, ROLLBACK_DOKA);
    assert.equal(leftoverOpens, true);
    const session = sessionDokaAfterAbsoluteDokaThrowKeepRemountRenameSpend({
      remountDoka: ROLLBACK_DOKA,
      liveDoka: ROLLBACK_DOKA - LARGE_SHOP_SPEND,
      keep: true,
      stampedPreDoka: ROLLBACK_DOKA,
    });
    assert.equal(session, 80);
    assert.equal(
      shouldStartRename(false, session),
      false,
      "canister would #err Not enough Doka; leftover HUD 200 still opened Rename",
    );
  });
});

describe("pickup-only remount still spends from Play-entry 200", () => {
  it("does not honour without a keep stamp", () => {
    const renamed = committedDokaAfterRenameWithAbsoluteDokaThrowKeepRemount({
      remountDoka: ROLLBACK_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_HEAL,
      keep: false,
      stampedPreDoka: ROLLBACK_DOKA,
    });
    assert.equal(renamed, 100);
    const shop = dokaAfterShopSpendWithAbsoluteDokaThrowKeepRemountRename({
      remountDoka: ROLLBACK_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_HEAL,
      keep: false,
      stampedPreDoka: ROLLBACK_DOKA,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(shop, 50);
  });
});

describe("persistRenameSpendThroughAbsoluteDokaThrowKeepRemount", () => {
  it("adopts replica 183 then rename commits 83", async () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountRenameSpend(storage, 1, ROLLBACK_DOKA);
    const persist = remountLock();
    let applied = false;
    const ok = await persistRenameSpendThroughAbsoluteDokaThrowKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_HEAL,
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
    assert.equal(persist.snapshot().doka, 83);
    assert.equal(
      hasAbsoluteDokaThrowKeepRemountRenameSpend(storage, 1),
      false,
      "clear the stamp after honour so leftover shop cannot reconstruct 200",
    );
  });

  it("adopts replica 150 then rename commits 50", async () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountRenameSpend(storage, 1, ROLLBACK_DOKA);
    const persist = remountLock();
    await persistRenameSpendThroughAbsoluteDokaThrowKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_SHOP,
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterRename(persist.snapshot().doka),
        });
        return true;
      },
    });
    assert.equal(persist.snapshot().doka, 50);
  });

  it("adopts replica 183 then missing-query upgrade commits 173", async () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountRenameSpend(storage, 1, ROLLBACK_DOKA);
    const persist = remountLock();
    await persistRenameSpendThroughAbsoluteDokaThrowKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_HEAL,
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
    assert.equal(persist.snapshot().doka, 173);
  });

  it("throws and does not apply when live Doka is still the rollback HUD", async () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountRenameSpend(storage, 1, ROLLBACK_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistRenameSpendThroughAbsoluteDokaThrowKeepRemount({
          persist,
          storage,
          slot: 1,
          readWallet: async () => ROLLBACK_DOKA,
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
    assert.equal(persist.snapshot().doka, ROLLBACK_DOKA);
    assert.equal(
      hasAbsoluteDokaThrowKeepRemountRenameSpend(storage, 1),
      true,
      "fail-close keeps the stamp",
    );
  });

  it("throws when getCallerDokaBalance fails so a stale rename cannot land", async () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountRenameSpend(storage, 1, ROLLBACK_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistRenameSpendThroughAbsoluteDokaThrowKeepRemount({
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
    const ok = await persistRenameSpendThroughAbsoluteDokaThrowKeepRemount({
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
    noteAbsoluteDokaThrowKeepRemountRenameSpend(storage, 1, ROLLBACK_DOKA);
    let flushed = 0;
    const persist = createProgressPersist(
      { doka: ROLLBACK_DOKA, xp: 100, level: LEVEL },
      {
        beforeEach: async () => {
          flushed += 1;
        },
      },
    );
    await persistRenameSpendThroughAbsoluteDokaThrowKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_HEAL,
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

describe("distinct from #964 shop honour, #969 death, #971 heal skip, #926 spend keep", () => {
  it("uses pbv_absolute_doka_throw_keep_remount_slotN, not spend-keep / HP keys", () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountRenameSpend(storage, 2, ROLLBACK_DOKA);
    assert.equal(
      absoluteDokaThrowKeepRemountRenameSpendKey(2),
      "pbv_absolute_doka_throw_keep_remount_slot2",
    );
    assert.equal(
      storage.getItem("pbv_absolute_doka_throw_keep_remount_slot2") != null,
      true,
    );
    assert.equal(storage.getItem("pbv_spend_keep_remount_slot2"), null);
    assert.equal(
      storage.getItem("pbv_absolute_hp_throw_keep_remount_slot2"),
      null,
    );
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot2"), null);
  });

  it("does not treat #964 remount shop spend 50 from 183 as this rename path", () => {
    const shopHonour = applySpendToCommitted(
      CANISTER_DOKA_AFTER_HEAL,
      SHOP_SPEND,
    );
    assert.equal(shopHonour, 133, "#964 gated shop path");
    const deathCut = Math.floor(CANISTER_DOKA_AFTER_HEAL * 0.6);
    assert.equal(deathCut, 109, "#969 taxes replica 183, not this rename");
    const leftoverRename = committedDokaAfterRename(ROLLBACK_DOKA);
    assert.notEqual(leftoverRename, shopHonour);
    assert.notEqual(leftoverRename, deathCut);
  });

  it("does not skip leftover shop/heal honour — that stays #964", () => {
    const honour = dokaForAbsoluteDokaThrowKeepRemountRenameSpend({
      remountDoka: ROLLBACK_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_HEAL,
      keep: true,
      stampedPreDoka: ROLLBACK_DOKA,
    });
    assert.equal(honour, CANISTER_DOKA_AFTER_HEAL);
    assert.equal(
      applySpendToCommitted(honour ?? 0, SHOP_SPEND),
      133,
      "shop leftover still spends from honoured replica; this sidecar only gates rename/upgrade",
    );
  });
});
