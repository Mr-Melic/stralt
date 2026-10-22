import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  type DeathPenaltyStorage,
  applyUnpaidDeathPenaltyToWrite,
  computeDeathPenalty,
} from "./deathPenalty.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  clampAbsoluteProgressWrite,
  createProgressPersist,
} from "./progressPersist.ts";
import { RENAME_DOKA_COST } from "./renameCharacter.ts";
import {
  clearSpendKeepRemount,
  dokaForSpendKeepRemountHonour,
  dokaFromSpendKeepRemountWalletRecord,
  hasSpendKeepRemount,
  noteSpendKeepRemount,
  persistSpendThroughSpendKeepRemount,
  readSpendKeepRemount,
  resolveCommittedDokaAfterSpendKeepRemount,
  shouldNoteSpendKeepRemount,
  shouldRefuseSpendKeepRemountStaleDoka,
} from "./spendKeepRemountWriteSkip.ts";

const UPGRADE_SPEND = 10;
const SHOP_SPEND = 50;

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

/** Production remount lock: GameFlow session cache (HUD never debited). */
function remountLock() {
  return createProgressPersist({ doka: 200, xp: 100, level: 4 });
}

function honourShopWrite(honourDoka: number, spend: number): { doka: number } {
  return {
    doka: clampAbsoluteProgressWrite(
      applySpendToCommitted(honourDoka, spend),
      honourDoka,
    ),
  };
}

describe("shouldNoteSpendKeepRemount", () => {
  it("notes transport-keep after a rename debit without unpaid death", () => {
    assert.equal(
      shouldNoteSpendKeepRemount({
        spend: RENAME_DOKA_COST,
        error: new Error("replica went away"),
      }),
      true,
    );
  });

  it("notes transport-keep after an upgrade debit", () => {
    assert.equal(
      shouldNoteSpendKeepRemount({
        spend: UPGRADE_SPEND,
        error: new Error("replica went away"),
      }),
      true,
    );
  });

  it("does not note a zero spend", () => {
    assert.equal(
      shouldNoteSpendKeepRemount({
        spend: 0,
        error: new Error("replica went away"),
      }),
      false,
    );
  });

  it("does not note explicit upgradeSpell failed", () => {
    assert.equal(
      shouldNoteSpendKeepRemount({
        spend: UPGRADE_SPEND,
        error: new Error("upgradeSpell failed: Account banned"),
      }),
      false,
    );
  });

  it("does not note explicit renameCharacter failed", () => {
    assert.equal(
      shouldNoteSpendKeepRemount({
        spend: RENAME_DOKA_COST,
        error: new Error("renameCharacter failed: Name already in use"),
      }),
      false,
    );
  });
});

describe("shouldRefuseSpendKeepRemountStaleDoka", () => {
  it("refuses stale Play-entry wallet equal to stamped preDoka", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountStaleDoka({
        keep: true,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("refuses a ghost-high live wallet above stamped preDoka", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountStaleDoka({
        keep: true,
        liveDoka: 250,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("does not refuse a fresh rename wallet 100", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountStaleDoka({
        keep: true,
        liveDoka: 200 - RENAME_DOKA_COST,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("does not refuse a fresh upgrade wallet 190", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountStaleDoka({
        keep: true,
        liveDoka: 200 - UPGRADE_SPEND,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountStaleDoka({
        keep: false,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: 200,
      }),
      true,
    );
  });
});

describe("dokaFromSpendKeepRemountWalletRecord", () => {
  it("reads a number wallet", () => {
    assert.equal(dokaFromSpendKeepRemountWalletRecord(100), 100);
  });

  it("reads bigint and #ok wrappers", () => {
    assert.equal(dokaFromSpendKeepRemountWalletRecord(100n), 100);
    assert.equal(dokaFromSpendKeepRemountWalletRecord({ ok: 190 }), 190);
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromSpendKeepRemountWalletRecord(null), null);
    assert.equal(dokaFromSpendKeepRemountWalletRecord(undefined), null);
    assert.equal(dokaFromSpendKeepRemountWalletRecord("nope"), null);
  });
});

describe("rename/upgrade throw-after-debit then remount shop without unpaid death", () => {
  it("leftover remount shop writes Doka 150 over canister 100 (the free item)", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 seeded. Canister 200.
    // 2. Rename renameCharacter deducts 100 then throws. Canister 100.
    //    Commit never runs. HUD stays 200. No unpaid death pending.
    // 3. Actor reconnect remounts. New lock Play-entry Doka 200.
    //    #387 session WeakMap is gone. Credit remount keys do not stamp.
    // 4. Items Buy spends 50. writeDoka = committed.doka 200 − 50.
    const remount = remountLock();
    const honourDoka = dokaForSpendKeepRemountHonour({
      remountDoka: remount.snapshot().doka,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.equal(honourDoka, 200, "ungated remount trusts Play-entry 200");
    const wrote = honourShopWrite(honourDoka ?? 0, SHOP_SPEND);
    assert.equal(wrote.doka, 150, "Play-entry honour made the item free");
  });

  it("leftover remount shop writes Doka 150 over canister upgrade 190", () => {
    const remount = remountLock();
    const honourDoka = dokaForSpendKeepRemountHonour({
      remountDoka: remount.snapshot().doka,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    const wrote = honourShopWrite(honourDoka ?? 0, SHOP_SPEND);
    assert.equal(
      wrote.doka,
      150,
      "Play-entry honour underpaid the upgrade fee",
    );
  });

  it("does not saveBattleStats-free the item after a gated rename honour", () => {
    const remount = remountLock();
    const honourDoka = dokaForSpendKeepRemountHonour({
      remountDoka: remount.snapshot().doka,
      liveDoka: 200 - RENAME_DOKA_COST,
      keep: true,
      stampedPreDoka: 200,
    });
    assert.equal(honourDoka, 100);
    const wrote = honourShopWrite(honourDoka ?? 0, SHOP_SPEND);
    assert.equal(wrote.doka, 50, "rename fee survives remount shop");
  });

  it("does not saveBattleStats-underpay after a gated upgrade honour", () => {
    const remount = remountLock();
    const honourDoka = dokaForSpendKeepRemountHonour({
      remountDoka: remount.snapshot().doka,
      liveDoka: 200 - UPGRADE_SPEND,
      keep: true,
      stampedPreDoka: 200,
    });
    assert.equal(honourDoka, 190);
    const wrote = honourShopWrite(honourDoka ?? 0, SHOP_SPEND);
    assert.equal(wrote.doka, 140, "upgrade fee survives remount shop");
  });

  it("fail-closes stale Play-entry 200 when the spend-keep stamp is set", () => {
    assert.equal(
      dokaForSpendKeepRemountHonour({
        remountDoka: 200,
        liveDoka: 200,
        keep: true,
        stampedPreDoka: 200,
      }),
      null,
    );
  });

  it("ungated remount death taxes Play-entry 200 → 120 over canister 100", () => {
    const after = computeDeathPenalty(100, 200);
    assert.equal(after.newDoka, 120, "ungated remount death over-taxed spend");
  });

  it("fresh lava death after remount taxes replica 100, not Play-entry 200", () => {
    const remount = remountLock();
    const honourDoka = dokaForSpendKeepRemountHonour({
      remountDoka: remount.snapshot().doka,
      liveDoka: 200 - RENAME_DOKA_COST,
      keep: true,
      stampedPreDoka: 200,
    });
    assert.equal(honourDoka, 100);
    const after = computeDeathPenalty(100, honourDoka ?? 0);
    assert.equal(after.newDoka, 60, "40% of rename wallet 100");
    assert.notEqual(after.newDoka, 120, "must not tax Play-entry 200");
  });
});

describe("resolveCommittedDokaAfterSpendKeepRemount", () => {
  it("returns remount wallet when keep is unset", async () => {
    const remount = remountLock();
    const storage = memStorage();
    const live = await resolveCommittedDokaAfterSpendKeepRemount(
      remount,
      async () => 100,
      storage,
      1,
    );
    assert.equal(live, 200);
  });

  it("fetches replica wallet when the spend-keep stamp is set", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteSpendKeepRemount(storage, 1, {
      spend: RENAME_DOKA_COST,
      error: new Error("replica went away"),
      preDoka: 200,
    });
    const live = await resolveCommittedDokaAfterSpendKeepRemount(
      remount,
      async () => 200 - RENAME_DOKA_COST,
      storage,
      1,
    );
    assert.equal(live, 100);
    assert.equal(remount.snapshot().doka, 100, "lock adopts replica wallet");
    assert.equal(hasSpendKeepRemount(storage, 1), false, "stamp cleared");
    const wrote = honourShopWrite(live, SHOP_SPEND);
    assert.equal(wrote.doka, 50);
  });

  it("reads bigint wallet from getCallerDokaBalance", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteSpendKeepRemount(storage, 1, {
      spend: UPGRADE_SPEND,
      error: new Error("replica went away"),
      preDoka: 200,
    });
    const live = await resolveCommittedDokaAfterSpendKeepRemount(
      remount,
      async () => 190n,
      storage,
      1,
    );
    assert.equal(live, 190);
  });

  it("fail-closes when getCallerDokaBalance returns Play-entry wallet after keep", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteSpendKeepRemount(storage, 1, {
      spend: RENAME_DOKA_COST,
      error: new Error("replica went away"),
      preDoka: 200,
    });
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterSpendKeepRemount(
          remount,
          async () => 200,
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(remount.snapshot().doka, 200);
    assert.equal(hasSpendKeepRemount(storage, 1), true);
  });

  it("fail-closes when getCallerDokaBalance throws after keep", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteSpendKeepRemount(storage, 1, {
      spend: UPGRADE_SPEND,
      error: new Error("replica went away"),
      preDoka: 200,
    });
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterSpendKeepRemount(
          remount,
          async () => {
            throw new Error("replica unavailable");
          },
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
  });
});

describe("persistSpendThroughSpendKeepRemount", () => {
  it("stamps remount spend keep after rename throw-after-debit without unpaid death", async () => {
    const storage = memStorage();
    const persist = remountLock();
    let canisterDoka = 200;
    await assert.rejects(
      () =>
        persistSpendThroughSpendKeepRemount({
          persist,
          storage,
          slot: 1,
          spend: RENAME_DOKA_COST,
          applyAndCommit: async () => {
            canisterDoka -= RENAME_DOKA_COST;
            throw new Error("replica went away");
          },
        }),
      /replica went away/,
    );
    assert.equal(canisterDoka, 100);
    assert.deepEqual(readSpendKeepRemount(storage, 1), { preDoka: 200 });
    assert.equal(persist.snapshot().doka, 200, "rename commit never ran");
  });

  it("stamps remount spend keep after upgrade throw-after-debit", async () => {
    const storage = memStorage();
    const persist = remountLock();
    let canisterDoka = 200;
    await assert.rejects(
      () =>
        persistSpendThroughSpendKeepRemount({
          persist,
          storage,
          slot: 1,
          spend: UPGRADE_SPEND,
          applyAndCommit: async () => {
            canisterDoka -= UPGRADE_SPEND;
            throw new Error("replica went away");
          },
        }),
      /replica went away/,
    );
    assert.equal(canisterDoka, 190);
    assert.deepEqual(readSpendKeepRemount(storage, 1), { preDoka: 200 });
  });

  it("does not stamp keep on explicit upgradeSpell failed", async () => {
    const storage = memStorage();
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistSpendThroughSpendKeepRemount({
          persist,
          storage,
          slot: 1,
          spend: UPGRADE_SPEND,
          applyAndCommit: async () => {
            throw new Error("upgradeSpell failed: Account banned");
          },
        }),
      /upgradeSpell failed/,
    );
    assert.equal(readSpendKeepRemount(storage, 1), null);
  });

  it("does not stamp keep on a successful spend commit", async () => {
    const storage = memStorage();
    const persist = remountLock();
    const result = await persistSpendThroughSpendKeepRemount({
      persist,
      storage,
      slot: 1,
      spend: UPGRADE_SPEND,
      applyAndCommit: async () => {
        persist.commit({ doka: 190 });
        return { newLevel: 2 };
      },
    });
    assert.deepEqual(result, { newLevel: 2 });
    assert.equal(hasSpendKeepRemount(storage, 1), false);
    assert.equal(persist.snapshot().doka, 190);
  });

  it("does not stamp keep for a zero spend", async () => {
    const storage = memStorage();
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistSpendThroughSpendKeepRemount({
          persist,
          storage,
          slot: 1,
          spend: 0,
          applyAndCommit: async () => {
            throw new Error("replica went away");
          },
        }),
      /replica went away/,
    );
    assert.equal(hasSpendKeepRemount(storage, 1), false);
  });

  it("clears a keep stamp explicitly", () => {
    const storage = memStorage();
    noteSpendKeepRemount(storage, 1, {
      spend: RENAME_DOKA_COST,
      error: new Error("replica went away"),
      preDoka: 200,
    });
    assert.equal(hasSpendKeepRemount(storage, 1), true);
    clearSpendKeepRemount(storage, 1);
    assert.equal(hasSpendKeepRemount(storage, 1), false);
  });
});

describe("distinct from credit remount #774/#800/#811/#812/#864 and session spend #387", () => {
  it("notes keep with no unpaid pending (#742 stamps a death-cut lock-move)", () => {
    assert.equal(
      shouldNoteSpendKeepRemount({
        spend: RENAME_DOKA_COST,
        error: new Error("replica went away"),
      }),
      true,
      "this sidecar does not gate on unpaid death pending",
    );
  });

  it("uses pbv_spend_keep_remount_slotN, not credit remount keys", () => {
    const storage = memStorage();
    noteSpendKeepRemount(storage, 2, {
      spend: UPGRADE_SPEND,
      error: new Error("replica went away"),
      preDoka: 200,
    });
    assert.equal(storage.getItem("pbv_spend_keep_remount_slot2") != null, true);
    assert.equal(storage.getItem("pbv_victory_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_oneshot_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_gamekey_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_feat_doka_keep_remount_slot2"), null);
    assert.equal(
      storage.getItem("pbv_boss_rush_doka_keep_remount_slot2"),
      null,
    );
  });

  it("refuses live ≥ preDoka (credit remounts refuse live ≤ preDoka)", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountStaleDoka({
        keep: true,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      true,
      "stale-equal is a missed debit",
    );
    assert.equal(
      shouldRefuseSpendKeepRemountStaleDoka({
        keep: true,
        liveDoka: 100,
        stampedPreDoka: 200,
      }),
      false,
      "a drop is the replica catching up — credit skip would stuck-skip this",
    );
  });

  it("unpaid honour on top of gated upgrade shop still applies 40%", () => {
    const pending = {
      slot: 1,
      preXp: 100,
      preDoka: 200,
      afterXp: 80,
      afterDoka: 120,
    };
    const wrote = applyUnpaidDeathPenaltyToWrite(pending, 100, 140);
    assert.equal(wrote.xp, 80, "unpaid XP 20 on leftover 100");
    assert.equal(wrote.doka, 60, "unpaid 80 on upgrade shop snapshot 140");
  });
});
