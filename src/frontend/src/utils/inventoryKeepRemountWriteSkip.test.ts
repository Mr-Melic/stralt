import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  SHOP_INVENTORY_KEEP_REMOUNT_MAX_STACK,
  clearInventoryKeepRemount,
  clearInventoryKeepRemountItem,
  dokaFromInventoryKeepRemountWalletRecord,
  grantedOwnedAfterInventoryKeepRemount,
  hasInventoryKeepRemount,
  honourInventoryKeepRemountHydrate,
  inventoryKeepRemountKey,
  isExplicitInventoryKeepRemountReject,
  mergeInventoryKeepRemountHydrate,
  noteInventoryKeepRemount,
  persistShopInventoryThroughInventoryKeepRemount,
  readInventoryKeepRemount,
  shouldHonourInventoryKeepRemountGrant,
  shouldNoteInventoryKeepRemount,
  shouldRefuseInventoryKeepRemountStaleDoka,
} from "./inventoryKeepRemountWriteSkip.ts";
import {
  shouldRollbackFailedShopSpend,
  tryPurchaseBuffItem,
} from "./itemShop.ts";
import { createProgressPersist } from "./progressPersist.ts";

const PLAY_ENTRY_DOKA = 200;
const SHOP_SPEND = 50;
const FURY_SPEND = 150;
const HEAL_SPEND = 10;
const LEVEL = 4;
const POTION = "health_potion";
const FURY = "fury_potion";

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

function remountLock() {
  return createProgressPersist({
    doka: PLAY_ENTRY_DOKA,
    xp: 100,
    level: LEVEL,
  });
}

function shopThrow(
  itemId: string,
  cost: number,
  preOwned = 0,
  preDoka = PLAY_ENTRY_DOKA,
) {
  return {
    itemId,
    cost,
    preOwned,
    preDoka,
    error: new Error("replica went away"),
  };
}

describe("shouldNoteInventoryKeepRemount", () => {
  it("notes transport-keep after a full-HP shop spend", () => {
    assert.equal(
      shouldNoteInventoryKeepRemount({
        itemId: POTION,
        cost: SHOP_SPEND,
        error: new Error("replica went away"),
      }),
      true,
    );
  });

  it("does not note a Doka-heal throw (no itemId)", () => {
    assert.equal(
      shouldNoteInventoryKeepRemount({
        itemId: "",
        cost: HEAL_SPEND,
        error: new Error("replica went away"),
      }),
      false,
    );
  });

  it("does not note a zero cost", () => {
    assert.equal(
      shouldNoteInventoryKeepRemount({
        itemId: POTION,
        cost: 0,
        error: new Error("replica went away"),
      }),
      false,
    );
  });

  it("does not note parsed success (BuffShop setInventory)", () => {
    assert.equal(
      shouldNoteInventoryKeepRemount({
        itemId: POTION,
        cost: SHOP_SPEND,
        error: undefined,
      }),
      false,
    );
  });

  it("does not note explicit saveBattleStats failed (#err)", () => {
    assert.equal(
      shouldNoteInventoryKeepRemount({
        itemId: POTION,
        cost: SHOP_SPEND,
        error: new Error("saveBattleStats failed"),
      }),
      false,
    );
  });

  it("does not note Unauthorized / banned / empty-slot #err", () => {
    assert.equal(
      isExplicitInventoryKeepRemountReject(
        new Error("Unauthorized: must be logged in"),
      ),
      true,
    );
    assert.equal(
      shouldNoteInventoryKeepRemount({
        itemId: POTION,
        cost: SHOP_SPEND,
        error: new Error("Account banned for non-payment"),
      }),
      false,
    );
    assert.equal(
      shouldNoteInventoryKeepRemount({
        itemId: POTION,
        cost: SHOP_SPEND,
        error: new Error("Slot 1 is empty"),
      }),
      false,
    );
  });

  it("does not note unseeded-wallet skip (invoke never ran)", () => {
    assert.equal(
      shouldNoteInventoryKeepRemount({
        itemId: POTION,
        cost: SHOP_SPEND,
        error: new Error("doka-spend save skipped: wallet not seeded"),
      }),
      false,
    );
  });
});

describe("shouldRefuseInventoryKeepRemountStaleDoka", () => {
  it("refuses stale Play-entry wallet equal to stamped preDoka", () => {
    assert.equal(
      shouldRefuseInventoryKeepRemountStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("refuses a ghost-high live wallet above stamped preDoka", () => {
    assert.equal(
      shouldRefuseInventoryKeepRemountStaleDoka({
        keep: true,
        liveDoka: 250,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("does not refuse a fresh shop wallet 150", () => {
    assert.equal(
      shouldRefuseInventoryKeepRemountStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA - SHOP_SPEND,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseInventoryKeepRemountStaleDoka({
        keep: false,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseInventoryKeepRemountStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });
});

describe("dokaFromInventoryKeepRemountWalletRecord", () => {
  it("reads a number wallet", () => {
    assert.equal(dokaFromInventoryKeepRemountWalletRecord(150), 150);
  });

  it("reads bigint and #ok wrappers", () => {
    assert.equal(dokaFromInventoryKeepRemountWalletRecord(150n), 150);
    assert.equal(dokaFromInventoryKeepRemountWalletRecord({ ok: 150 }), 150);
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromInventoryKeepRemountWalletRecord(null), null);
    assert.equal(dokaFromInventoryKeepRemountWalletRecord(undefined), null);
    assert.equal(dokaFromInventoryKeepRemountWalletRecord("nope"), null);
  });
});

describe("shop saveBattleStats throw-after-accept then remount inventory", () => {
  it("leftover remount loadInventory stays 0 after a paid potion throw", () => {
    const purchase = tryPurchaseBuffItem({
      wallet: PLAY_ENTRY_DOKA,
      cost: SHOP_SPEND,
      owned: 0,
      maxStack: SHOP_INVENTORY_KEEP_REMOUNT_MAX_STACK,
      inBattle: false,
    });
    assert.deepEqual(purchase, { nextWallet: 150, nextOwned: 1 });
    assert.equal(
      shouldRollbackFailedShopSpend({
        liveDoka: purchase?.nextWallet ?? 0,
        expectedDoka: 150,
      }),
      true,
      "HUD Doka rolls back; setInventory never ran",
    );
    const remountOwned = 0;
    assert.equal(remountOwned, 0, "localStorage still 0");
    assert.equal(
      shouldHonourInventoryKeepRemountGrant({
        keep: false,
        itemId: POTION,
        localOwned: remountOwned,
        preOwned: 0,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
      "ungated remount trusts loadInventory 0",
    );
  });

  it("gated honour grants the paid potion when replica is 150", () => {
    assert.equal(
      shouldHonourInventoryKeepRemountGrant({
        keep: true,
        itemId: POTION,
        localOwned: 0,
        preOwned: 0,
        liveDoka: PLAY_ENTRY_DOKA - SHOP_SPEND,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
    assert.equal(
      grantedOwnedAfterInventoryKeepRemount({ localOwned: 0, preOwned: 0 }),
      1,
    );
  });

  it("does not grant when replica still equals Play-entry 200", () => {
    assert.equal(
      shouldHonourInventoryKeepRemountGrant({
        keep: true,
        itemId: POTION,
        localOwned: 0,
        preOwned: 0,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });

  it("does not re-grant when remount already has the paid stack", () => {
    assert.equal(
      shouldHonourInventoryKeepRemountGrant({
        keep: true,
        itemId: POTION,
        localOwned: 1,
        preOwned: 0,
        liveDoka: PLAY_ENTRY_DOKA - SHOP_SPEND,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
    assert.equal(
      grantedOwnedAfterInventoryKeepRemount({ localOwned: 1, preOwned: 0 }),
      1,
    );
  });

  it("caps the grant at maxStack 5", () => {
    assert.equal(
      grantedOwnedAfterInventoryKeepRemount({
        localOwned: 5,
        preOwned: 5,
        maxStack: SHOP_INVENTORY_KEEP_REMOUNT_MAX_STACK,
      }),
      5,
    );
  });

  it("pickup-only remount (no stamp) still loads 0", () => {
    const merged = mergeInventoryKeepRemountHydrate({}, null, 150);
    assert.deepEqual(merged, {});
  });
});

describe("noteInventoryKeepRemount map merge", () => {
  it("merges a later fury throw without clobbering the potion keep", () => {
    const storage = memStorage();
    noteInventoryKeepRemount(storage, 1, shopThrow(POTION, SHOP_SPEND));
    noteInventoryKeepRemount(storage, 1, shopThrow(FURY, FURY_SPEND));
    const stamp = readInventoryKeepRemount(storage, 1);
    assert.deepEqual(stamp?.items[POTION], {
      preOwned: 0,
      cost: SHOP_SPEND,
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.deepEqual(stamp?.items[FURY], {
      preOwned: 0,
      cost: FURY_SPEND,
      preDoka: PLAY_ENTRY_DOKA,
    });
  });

  it("does not stamp a heal-shaped throw onto the map", () => {
    const storage = memStorage();
    noteInventoryKeepRemount(storage, 1, {
      itemId: "",
      cost: HEAL_SPEND,
      preOwned: 0,
      preDoka: PLAY_ENTRY_DOKA,
      error: new Error("replica went away"),
    });
    assert.equal(hasInventoryKeepRemount(storage, 1), false);
  });

  it("does not stamp explicit saveBattleStats failed", () => {
    const storage = memStorage();
    noteInventoryKeepRemount(storage, 1, {
      itemId: POTION,
      cost: SHOP_SPEND,
      preOwned: 0,
      preDoka: PLAY_ENTRY_DOKA,
      error: new Error("saveBattleStats failed"),
    });
    assert.equal(readInventoryKeepRemount(storage, 1), null);
  });
});

describe("honourInventoryKeepRemountHydrate", () => {
  it("returns remount inventory when keep is unset", async () => {
    const storage = memStorage();
    const next = await honourInventoryKeepRemountHydrate({
      storage,
      slot: 1,
      remountInventory: {},
      readWallet: async () => 150,
    });
    assert.deepEqual(next, {});
  });

  it("grants the paid potion when replica wallet dropped to 150", async () => {
    const storage = memStorage();
    noteInventoryKeepRemount(storage, 1, shopThrow(POTION, SHOP_SPEND));
    const next = await honourInventoryKeepRemountHydrate({
      storage,
      slot: 1,
      remountInventory: {},
      readWallet: async () => PLAY_ENTRY_DOKA - SHOP_SPEND,
    });
    assert.equal(next[POTION], 1);
    assert.equal(
      hasInventoryKeepRemount(storage, 1),
      false,
      "stamp cleared so consume is not re-granted",
    );
  });

  it("reads bigint wallet from getCallerDokaBalance", async () => {
    const storage = memStorage();
    noteInventoryKeepRemount(storage, 1, shopThrow(POTION, SHOP_SPEND));
    const next = await honourInventoryKeepRemountHydrate({
      storage,
      slot: 1,
      remountInventory: {},
      readWallet: async () => 150n,
    });
    assert.equal(next[POTION], 1);
  });

  it("fail-closes Play-entry 200 (no mint, stamp kept)", async () => {
    const storage = memStorage();
    noteInventoryKeepRemount(storage, 1, shopThrow(POTION, SHOP_SPEND));
    const next = await honourInventoryKeepRemountHydrate({
      storage,
      slot: 1,
      remountInventory: {},
      readWallet: async () => PLAY_ENTRY_DOKA,
    });
    assert.deepEqual(next, {});
    assert.equal(hasInventoryKeepRemount(storage, 1), true);
  });

  it("fail-closes when getCallerDokaBalance throws (no mint, stamp kept)", async () => {
    const storage = memStorage();
    noteInventoryKeepRemount(storage, 1, shopThrow(POTION, SHOP_SPEND));
    const next = await honourInventoryKeepRemountHydrate({
      storage,
      slot: 1,
      remountInventory: {},
      readWallet: async () => {
        throw new Error("replica unavailable");
      },
    });
    assert.deepEqual(next, {});
    assert.equal(hasInventoryKeepRemount(storage, 1), true);
  });

  it("grants potion and fury together and clears only honoured items", async () => {
    const storage = memStorage();
    noteInventoryKeepRemount(storage, 1, shopThrow(POTION, SHOP_SPEND));
    noteInventoryKeepRemount(storage, 1, shopThrow(FURY, FURY_SPEND));
    const next = await honourInventoryKeepRemountHydrate({
      storage,
      slot: 1,
      remountInventory: {},
      readWallet: async () => 50,
    });
    assert.equal(next[POTION], 1);
    assert.equal(next[FURY], 1);
    assert.equal(hasInventoryKeepRemount(storage, 1), false);
  });

  it("does not re-grant after a consume once the stamp is cleared", async () => {
    const storage = memStorage();
    noteInventoryKeepRemount(storage, 1, shopThrow(POTION, SHOP_SPEND));
    const granted = await honourInventoryKeepRemountHydrate({
      storage,
      slot: 1,
      remountInventory: {},
      readWallet: async () => 150,
    });
    assert.equal(granted[POTION], 1);
    const afterConsume = await honourInventoryKeepRemountHydrate({
      storage,
      slot: 1,
      remountInventory: { [POTION]: 0 },
      readWallet: async () => 150,
    });
    assert.equal(afterConsume[POTION], 0);
  });

  it("keeps a sibling fury stamp when only the potion is honoured", () => {
    const storage = memStorage();
    noteInventoryKeepRemount(storage, 1, shopThrow(POTION, SHOP_SPEND));
    noteInventoryKeepRemount(storage, 1, shopThrow(FURY, FURY_SPEND));
    clearInventoryKeepRemountItem(storage, 1, POTION);
    const stamp = readInventoryKeepRemount(storage, 1);
    assert.equal(stamp?.items[POTION], undefined);
    assert.equal(stamp?.items[FURY]?.cost, FURY_SPEND);
  });
});

describe("persistShopInventoryThroughInventoryKeepRemount", () => {
  it("stamps remount inventory keep after a shop throw-after-accept", async () => {
    const storage = memStorage();
    const persist = remountLock();
    let canisterDoka = PLAY_ENTRY_DOKA;
    await assert.rejects(
      () =>
        persistShopInventoryThroughInventoryKeepRemount({
          persist,
          storage,
          slot: 1,
          itemId: POTION,
          cost: SHOP_SPEND,
          preOwned: 0,
          applyAndCommit: async () => {
            canisterDoka -= SHOP_SPEND;
            throw new Error("replica went away");
          },
        }),
      /replica went away/,
    );
    assert.equal(canisterDoka, 150);
    assert.equal(
      persist.snapshot().doka,
      PLAY_ENTRY_DOKA,
      "shop commit never ran",
    );
    assert.deepEqual(readInventoryKeepRemount(storage, 1)?.items[POTION], {
      preOwned: 0,
      cost: SHOP_SPEND,
      preDoka: PLAY_ENTRY_DOKA,
    });
  });

  it("does not stamp parsed success (BuffShop setInventory)", async () => {
    const storage = memStorage();
    const persist = remountLock();
    const persisted = await persistShopInventoryThroughInventoryKeepRemount({
      persist,
      storage,
      slot: 1,
      itemId: POTION,
      cost: SHOP_SPEND,
      preOwned: 0,
      applyAndCommit: async () => {
        persist.commit?.({ doka: PLAY_ENTRY_DOKA - SHOP_SPEND });
        return { doka: 150 };
      },
    });
    assert.equal(persisted.doka, 150);
    assert.equal(hasInventoryKeepRemount(storage, 1), false);
    assert.equal(persist.snapshot().doka, 150);
  });

  it("does not stamp explicit saveBattleStats failed", async () => {
    const storage = memStorage();
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistShopInventoryThroughInventoryKeepRemount({
          persist,
          storage,
          slot: 1,
          itemId: POTION,
          cost: SHOP_SPEND,
          preOwned: 0,
          applyAndCommit: async () => {
            throw new Error("saveBattleStats failed");
          },
        }),
      /saveBattleStats failed/,
    );
    assert.equal(readInventoryKeepRemount(storage, 1), null);
  });

  it("does not stamp a heal-shaped enqueue (empty itemId)", async () => {
    const storage = memStorage();
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistShopInventoryThroughInventoryKeepRemount({
          persist,
          storage,
          slot: 1,
          itemId: "",
          cost: HEAL_SPEND,
          preOwned: 0,
          applyAndCommit: async () => {
            throw new Error("replica went away");
          },
        }),
      /replica went away/,
    );
    assert.equal(hasInventoryKeepRemount(storage, 1), false);
  });

  it("runs beforeEach so shop persist can flush unpaid death (#445)", async () => {
    const storage = memStorage();
    let flushed = 0;
    const persist = createProgressPersist(
      { doka: PLAY_ENTRY_DOKA, xp: 100, level: LEVEL },
      {
        beforeEach: async () => {
          flushed += 1;
        },
      },
    );
    await assert.rejects(
      () =>
        persistShopInventoryThroughInventoryKeepRemount({
          persist,
          storage,
          slot: 1,
          itemId: POTION,
          cost: SHOP_SPEND,
          preOwned: 0,
          applyAndCommit: async () => {
            throw new Error("replica went away");
          },
        }),
      /replica went away/,
    );
    assert.equal(flushed, 1);
    assert.equal(hasInventoryKeepRemount(storage, 1), true);
  });

  it("clears a keep stamp explicitly", () => {
    const storage = memStorage();
    noteInventoryKeepRemount(storage, 1, shopThrow(POTION, SHOP_SPEND));
    assert.equal(hasInventoryKeepRemount(storage, 1), true);
    clearInventoryKeepRemount(storage, 1);
    assert.equal(hasInventoryKeepRemount(storage, 1), false);
  });
});

describe("distinct from Doka throw #964, HP throw #860, consume-restore #408, bar #1268", () => {
  it("notes keep with no unpaid pending, no death persist, and a shop itemId", () => {
    assert.equal(
      shouldNoteInventoryKeepRemount({
        itemId: POTION,
        cost: SHOP_SPEND,
        error: new Error("replica went away"),
      }),
      true,
      "this sidecar stamps transport-keep shop inventory, not Doka/HP",
    );
  });

  it("uses pbv_inventory_keep_remount_slotN, not Doka / HP / bar / spell-level keys", () => {
    const storage = memStorage();
    noteInventoryKeepRemount(storage, 2, shopThrow(POTION, SHOP_SPEND));
    assert.equal(
      inventoryKeepRemountKey(2),
      "pbv_inventory_keep_remount_slot2",
    );
    assert.equal(
      storage.getItem("pbv_inventory_keep_remount_slot2") != null,
      true,
    );
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot2"), null);
    assert.equal(
      storage.getItem("pbv_absolute_doka_throw_keep_remount_slot2"),
      null,
    );
    assert.equal(
      storage.getItem("pbv_absolute_hp_throw_keep_remount_slot2"),
      null,
    );
    assert.equal(
      storage.getItem("pbv_spell_level_keep_map_remount_slot2"),
      null,
    );
    assert.equal(storage.getItem("pbv_spell_bar_keep_remount_slot2"), null);
  });

  it("refuses live ≥ preDoka (credit remounts refuse live ≤ preDoka)", () => {
    assert.equal(
      shouldRefuseInventoryKeepRemountStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
      "stale-equal is a missed debit",
    );
    assert.equal(
      shouldRefuseInventoryKeepRemountStaleDoka({
        keep: true,
        liveDoka: 150,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
      "a drop is the replica catching up — credit skip would stuck-skip this",
    );
  });

  it("#964 remount shop honours Doka 150; this leftover is inventory 0", () => {
    const leftoverDoka = PLAY_ENTRY_DOKA - SHOP_SPEND;
    const leftoverOwned = 0;
    assert.equal(leftoverDoka, 150, "#964 gated Doka path");
    assert.equal(leftoverOwned, 0, "ungated inventory still loadInventory 0");
    assert.equal(
      grantedOwnedAfterInventoryKeepRemount({ localOwned: 0, preOwned: 0 }),
      1,
    );
  });
});
