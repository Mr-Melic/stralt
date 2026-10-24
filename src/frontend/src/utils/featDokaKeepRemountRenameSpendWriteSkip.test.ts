import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clampSaveBattleStatsWrite } from "./absoluteStatsClamp.ts";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  clearFeatDokaKeepRemountRenameSpend,
  committedDokaAfterRenameWithFeatDokaKeepRemount,
  committedDokaAfterSpellUpgradeWithFeatDokaKeepRemount,
  dokaAfterShopSpendWithFeatDokaKeepRemountRename,
  dokaForFeatDokaKeepRemountRenameSpend,
  dokaFromFeatDokaKeepRenameSpendWalletRecord,
  featDokaKeepRemountRenameSpendKey,
  hasFeatDokaKeepRemountRenameSpend,
  noteFeatDokaKeepRemountRenameSpend,
  persistRenameSpendThroughFeatDokaKeepRemount,
  readFeatDokaKeepRemountRenameSpend,
  sessionDokaAfterFeatDokaKeepRemountRenameSpend,
  shouldRefuseFeatDokaKeepRemountRenameSpendStaleDoka,
} from "./featDokaKeepRemountRenameSpendWriteSkip.ts";
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
const FEAT_GRANT = 500;
const CANISTER_DOKA_AFTER_FEAT = PLAY_ENTRY_DOKA + FEAT_GRANT;
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

/** Production remount lock: GameFlow Doka after feat throw-after-add. */
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

describe("featDokaKeepRemountRenameSpendKey", () => {
  it("reads the same #812 slot key, not #979 victory or #977 shop-throw rename keys", () => {
    assert.equal(
      featDokaKeepRemountRenameSpendKey(1),
      "pbv_feat_doka_keep_remount_slot1",
    );
    assert.equal(
      featDokaKeepRemountRenameSpendKey(3),
      "pbv_feat_doka_keep_remount_slot3",
    );
    assert.notEqual(
      featDokaKeepRemountRenameSpendKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    assert.notEqual(
      featDokaKeepRemountRenameSpendKey(1),
      "pbv_absolute_doka_throw_keep_remount_slot1",
    );
    assert.notEqual(
      featDokaKeepRemountRenameSpendKey(1),
      "pbv_spend_keep_remount_slot1",
    );
    assert.notEqual(
      featDokaKeepRemountRenameSpendKey(1),
      "pbv_gamekey_doka_keep_remount_slot1",
    );
  });
});

describe("note / read / clear FeatDokaKeepRemountRenameSpend", () => {
  it("round-trips the #812 { preDoka } shape", () => {
    const storage = memStorage();
    assert.equal(hasFeatDokaKeepRemountRenameSpend(storage, 1), false);
    noteFeatDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    assert.deepEqual(readFeatDokaKeepRemountRenameSpend(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(hasFeatDokaKeepRemountRenameSpend(storage, 1), true);
    clearFeatDokaKeepRemountRenameSpend(storage, 1);
    assert.equal(readFeatDokaKeepRemountRenameSpend(storage, 1), null);
  });

  it("isolates character slots", () => {
    const storage = memStorage();
    noteFeatDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    noteFeatDokaKeepRemountRenameSpend(storage, 2, 90);
    assert.deepEqual(readFeatDokaKeepRemountRenameSpend(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.deepEqual(readFeatDokaKeepRemountRenameSpend(storage, 2), {
      preDoka: 90,
    });
    clearFeatDokaKeepRemountRenameSpend(storage, 1);
    assert.equal(readFeatDokaKeepRemountRenameSpend(storage, 1), null);
    assert.equal(hasFeatDokaKeepRemountRenameSpend(storage, 2), true);
  });
});

describe("dokaFromFeatDokaKeepRenameSpendWalletRecord", () => {
  it("reads number, bigint, and { ok } wallets", () => {
    assert.equal(
      dokaFromFeatDokaKeepRenameSpendWalletRecord(CANISTER_DOKA_AFTER_FEAT),
      700,
    );
    assert.equal(dokaFromFeatDokaKeepRenameSpendWalletRecord(700n), 700);
    assert.equal(
      dokaFromFeatDokaKeepRenameSpendWalletRecord({
        ok: CANISTER_DOKA_AFTER_FEAT,
      }),
      700,
    );
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromFeatDokaKeepRenameSpendWalletRecord(null), null);
    assert.equal(dokaFromFeatDokaKeepRenameSpendWalletRecord({}), null);
    assert.equal(
      dokaFromFeatDokaKeepRenameSpendWalletRecord({ ok: "nope" }),
      null,
    );
  });
});

describe("shouldRefuseFeatDokaKeepRemountRenameSpendStaleDoka", () => {
  it("fail-closes when live still equals or sits below stamped preDoka", () => {
    assert.equal(
      shouldRefuseFeatDokaKeepRemountRenameSpendStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
    assert.equal(
      shouldRefuseFeatDokaKeepRemountRenameSpendStaleDoka({
        keep: true,
        liveDoka: 0,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseFeatDokaKeepRemountRenameSpendStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("does not refuse a risen replica wallet", () => {
    assert.equal(
      shouldRefuseFeatDokaKeepRemountRenameSpendStaleDoka({
        keep: true,
        liveDoka: CANISTER_DOKA_AFTER_FEAT,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseFeatDokaKeepRemountRenameSpendStaleDoka({
        keep: false,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });
});

describe("feat claim throw-after-add then remount rename without unpaid death", () => {
  it("leftover remount rename commits 100 over canister 600", () => {
    // Chronology:
    // 1. World hydrated. Lock Doka 200. Canister 200.
    // 2. Feat claimAchievementReward accepts 700 then throws. Panel
    //    catch only toasts. HUD stays 200. #812 stamps preDoka=200.
    // 3. Actor reconnect remounts. Lock Doka 200.
    // 4. Rename committedDokaAfterRename(200) → 100. Canister deducts
    //    100 from 700 → 600.
    const leftoverCommit = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.equal(leftoverCommit, 100);
    const canisterAfterRename = CANISTER_DOKA_AFTER_FEAT - RENAME_DOKA_COST;
    assert.equal(canisterAfterRename, 600);
    assert.equal(
      canisterAfterRename - leftoverCommit,
      FEAT_GRANT,
      "lock sits the feat grant below stored",
    );
  });

  it("leftover shop after that rename writes 50 over canister 600", () => {
    const leftoverShop = applySpendToCommitted(
      committedDokaAfterRename(PLAY_ENTRY_DOKA),
      SHOP_SPEND,
    );
    assert.equal(leftoverShop, 50);
    assert.equal(
      canisterAfterAbsoluteWrite(600, leftoverShop),
      50,
      "incoming-below-stored wipes the 500 feat grant (correct remaining 550)",
    );
    assert.equal(
      applySpendToCommitted(
        CANISTER_DOKA_AFTER_FEAT - RENAME_DOKA_COST,
        SHOP_SPEND,
      ),
      550,
    );
  });

  it("gated remount rename commits 600", () => {
    const gated = committedDokaAfterRenameWithFeatDokaKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_FEAT,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(gated, 600);
    const gatedShop = dokaAfterShopSpendWithFeatDokaKeepRemountRename({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_FEAT,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(gatedShop, 550);
    assert.equal(canisterAfterAbsoluteWrite(600, gatedShop ?? 0), 550);
  });
});

describe("upgrade leftover when getCallerDokaBalance is missing or risen", () => {
  it("leftover remount upgrade commits 190 over canister 690", () => {
    const leftover = committedDokaAfterSpellUpgrade(
      PLAY_ENTRY_DOKA,
      undefined,
      UPGRADE_COST,
    );
    assert.equal(leftover, 190);
    const canisterAfterUpgrade = CANISTER_DOKA_AFTER_FEAT - UPGRADE_COST;
    assert.equal(canisterAfterUpgrade, 690);
    const leftoverShop = applySpendToCommitted(leftover, SHOP_SPEND);
    assert.equal(leftoverShop, 140);
    assert.equal(
      canisterAfterAbsoluteWrite(690, leftoverShop),
      140,
      "incoming-below-stored wipes the 500 feat grant after upgrade",
    );
  });

  it("risen upgrade query does not self-heal vs remount 200", () => {
    const leftoverRisen = committedDokaAfterSpellUpgrade(
      PLAY_ENTRY_DOKA,
      690,
      UPGRADE_COST,
    );
    assert.equal(
      leftoverRisen,
      190,
      "production upgrade only adopts a dropped query; 690 > 200 stays 200 − 10",
    );
  });

  it("gated remount upgrade with no query commits 690", () => {
    const gated = committedDokaAfterSpellUpgradeWithFeatDokaKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_FEAT,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      backendDokaAfter: undefined,
      advertisedCost: UPGRADE_COST,
    });
    assert.equal(gated, 690);
  });

  it("gated remount upgrade with risen query still commits 690", () => {
    const gated = committedDokaAfterSpellUpgradeWithFeatDokaKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_FEAT,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      backendDokaAfter: 690,
      advertisedCost: UPGRADE_COST,
    });
    assert.equal(gated, 690);
  });
});

describe("sessionDokaAfterFeatDokaKeepRemountRenameSpend", () => {
  it("ungated remount HUD stays Play-entry 200 so Rename still opens", () => {
    const session = sessionDokaAfterFeatDokaKeepRemountRenameSpend({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_FEAT,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, PLAY_ENTRY_DOKA);
    assert.equal(shouldStartRename(false, session), true);
  });

  it("honour replica 700 so HUD debit matches the canister", () => {
    const session = sessionDokaAfterFeatDokaKeepRemountRenameSpend({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_FEAT,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, CANISTER_DOKA_AFTER_FEAT);
    assert.equal(shouldStartRename(false, session), true);
  });
});

describe("pickup-only remount still spends from Play-entry 200", () => {
  it("does not honour without a keep stamp", () => {
    const renamed = committedDokaAfterRenameWithFeatDokaKeepRemount({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_FEAT,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(renamed, 100);
    const shop = dokaAfterShopSpendWithFeatDokaKeepRemountRename({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_FEAT,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(shop, 50);
  });
});

describe("persistRenameSpendThroughFeatDokaKeepRemount", () => {
  it("adopts replica 700 then rename commits 600", async () => {
    const storage = memStorage();
    noteFeatDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    const ok = await persistRenameSpendThroughFeatDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_FEAT,
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
    assert.equal(persist.snapshot().doka, 600);
    assert.equal(
      hasFeatDokaKeepRemountRenameSpend(storage, 1),
      false,
      "clear the stamp after honour so leftover shop cannot reconstruct 200",
    );
  });

  it("adopts replica 700 then missing-query upgrade commits 690", async () => {
    const storage = memStorage();
    noteFeatDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    await persistRenameSpendThroughFeatDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_FEAT,
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
    assert.equal(persist.snapshot().doka, 690);
  });

  it("throws and does not apply when live Doka is still Play-entry", async () => {
    const storage = memStorage();
    noteFeatDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistRenameSpendThroughFeatDokaKeepRemount({
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
      hasFeatDokaKeepRemountRenameSpend(storage, 1),
      true,
      "fail-close keeps the stamp",
    );
  });

  it("throws when getCallerDokaBalance fails so a stale rename cannot land", async () => {
    const storage = memStorage();
    noteFeatDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistRenameSpendThroughFeatDokaKeepRemount({
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
    const ok = await persistRenameSpendThroughFeatDokaKeepRemount({
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
    noteFeatDokaKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_DOKA);
    let flushed = 0;
    const persist = createProgressPersist(
      { doka: PLAY_ENTRY_DOKA, xp: 100, level: LEVEL },
      {
        beforeEach: async () => {
          flushed += 1;
        },
      },
    );
    await persistRenameSpendThroughFeatDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => CANISTER_DOKA_AFTER_FEAT,
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

describe("distinct from #812 shop honour, #909 death, #979 victory rename", () => {
  it("uses pbv_feat_doka_keep_remount_slotN, not victory / shop-throw / spend-keep keys", () => {
    const storage = memStorage();
    noteFeatDokaKeepRemountRenameSpend(storage, 2, PLAY_ENTRY_DOKA);
    assert.equal(
      featDokaKeepRemountRenameSpendKey(2),
      "pbv_feat_doka_keep_remount_slot2",
    );
    assert.equal(
      storage.getItem("pbv_feat_doka_keep_remount_slot2") != null,
      true,
    );
    assert.equal(storage.getItem("pbv_victory_doka_keep_remount_slot2"), null);
    assert.equal(
      storage.getItem("pbv_absolute_doka_throw_keep_remount_slot2"),
      null,
    );
    assert.equal(storage.getItem("pbv_spend_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_gamekey_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot2"), null);
  });

  it("does not treat #812 remount shop spend 50 from 700 as this rename path", () => {
    const shopHonour = applySpendToCommitted(
      CANISTER_DOKA_AFTER_FEAT,
      SHOP_SPEND,
    );
    assert.equal(shopHonour, 650, "#812 gated shop path");
    const deathCut = Math.floor(CANISTER_DOKA_AFTER_FEAT * 0.6);
    assert.equal(deathCut, 420, "#909 taxes replica 700, not this rename");
    const leftoverRename = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.notEqual(leftoverRename, shopHonour);
    assert.notEqual(leftoverRename, deathCut);
    const victoryRename = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.equal(
      victoryRename,
      leftoverRename,
      "Play-entry 200 − 100 is the same arithmetic as #979 leftover, but the stamp and replica (700 vs 250) are different",
    );
  });

  it("does not skip leftover shop/heal honour — that stays #812", () => {
    const honour = dokaForFeatDokaKeepRemountRenameSpend({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: CANISTER_DOKA_AFTER_FEAT,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(honour, CANISTER_DOKA_AFTER_FEAT);
    assert.equal(
      applySpendToCommitted(honour ?? 0, SHOP_SPEND),
      650,
      "shop leftover still spends from honoured replica; this sidecar only gates rename/upgrade",
    );
  });
});
