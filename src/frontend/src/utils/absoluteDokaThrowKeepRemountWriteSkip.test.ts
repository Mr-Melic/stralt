import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  absoluteDokaThrowKeepRemountKey,
  clearAbsoluteDokaThrowKeepRemount,
  dokaForAbsoluteDokaThrowKeepRemountHonour,
  dokaFromAbsoluteDokaThrowKeepRemountWalletRecord,
  hasAbsoluteDokaThrowKeepRemount,
  isExplicitAbsoluteDokaThrowReject,
  noteAbsoluteDokaThrowKeepRemount,
  persistAbsoluteDokaThroughAbsoluteDokaThrowKeepRemount,
  readAbsoluteDokaThrowKeepRemount,
  resolveCommittedDokaAfterAbsoluteDokaThrowKeepRemount,
  shouldNoteAbsoluteDokaThrowKeepRemount,
  shouldRefuseAbsoluteDokaThrowKeepRemountStaleDoka,
} from "./absoluteDokaThrowKeepRemountWriteSkip.ts";
import { clampSaveBattleStatsWrite } from "./absoluteStatsClamp.ts";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import { resolveAbsoluteWriteHp, shouldStartDokaHeal } from "./itemShop.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  clampAbsoluteProgressWrite,
  createProgressPersist,
} from "./progressPersist.ts";

const PLAY_ENTRY_DOKA = 200;
const HEAL_SPEND = 10;
const SHOP_SPEND = 50;
const HEALED_HP = 70;
const PLAY_ENTRY_HP = 100;
const LEVEL = 4;

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

/** Production remount lock: GameFlow Doka after heal / shop rollback. */
function remountLock() {
  return createProgressPersist({
    doka: PLAY_ENTRY_DOKA,
    xp: 100,
    level: LEVEL,
  });
}

function honourShopWrite(honourDoka: number, spend: number): { doka: number } {
  return {
    doka: clampAbsoluteProgressWrite(
      applySpendToCommitted(honourDoka, spend),
      honourDoka,
    ),
  };
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

describe("shouldNoteAbsoluteDokaThrowKeepRemount", () => {
  it("notes transport-keep after a heal spend without unpaid death", () => {
    assert.equal(
      shouldNoteAbsoluteDokaThrowKeepRemount({
        spend: HEAL_SPEND,
        error: new Error("replica went away"),
      }),
      true,
    );
  });

  it("notes transport-keep after a full-HP shop spend (#860 skips equal HP)", () => {
    assert.equal(
      shouldNoteAbsoluteDokaThrowKeepRemount({
        spend: SHOP_SPEND,
        error: new Error("replica went away"),
      }),
      true,
    );
  });

  it("does not note a zero spend", () => {
    assert.equal(
      shouldNoteAbsoluteDokaThrowKeepRemount({
        spend: 0,
        error: new Error("replica went away"),
      }),
      false,
    );
  });

  it("does not note parsed success (that is #854)", () => {
    assert.equal(
      shouldNoteAbsoluteDokaThrowKeepRemount({
        spend: HEAL_SPEND,
        error: undefined,
      }),
      false,
    );
  });

  it("does not note explicit saveBattleStats failed (#err)", () => {
    assert.equal(
      shouldNoteAbsoluteDokaThrowKeepRemount({
        spend: HEAL_SPEND,
        error: new Error("saveBattleStats failed"),
      }),
      false,
    );
  });

  it("does not note Unauthorized / banned / empty-slot #err", () => {
    assert.equal(
      isExplicitAbsoluteDokaThrowReject(
        new Error("Unauthorized: must be logged in"),
      ),
      true,
    );
    assert.equal(
      shouldNoteAbsoluteDokaThrowKeepRemount({
        spend: SHOP_SPEND,
        error: new Error("Account banned for non-payment"),
      }),
      false,
    );
    assert.equal(
      shouldNoteAbsoluteDokaThrowKeepRemount({
        spend: SHOP_SPEND,
        error: new Error("Slot 1 is empty"),
      }),
      false,
    );
  });

  it("does not note unseeded-wallet skip (invoke never ran)", () => {
    assert.equal(
      shouldNoteAbsoluteDokaThrowKeepRemount({
        spend: HEAL_SPEND,
        error: new Error("doka-spend save skipped: wallet not seeded"),
      }),
      false,
    );
  });
});

describe("shouldRefuseAbsoluteDokaThrowKeepRemountStaleDoka", () => {
  it("refuses stale Play-entry wallet equal to stamped preDoka", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("refuses a ghost-high live wallet above stamped preDoka", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountStaleDoka({
        keep: true,
        liveDoka: 250,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("does not refuse a fresh heal wallet 190", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA - HEAL_SPEND,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });

  it("does not refuse a fresh shop wallet 150", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA - SHOP_SPEND,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountStaleDoka({
        keep: false,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });
});

describe("dokaFromAbsoluteDokaThrowKeepRemountWalletRecord", () => {
  it("reads a number wallet", () => {
    assert.equal(dokaFromAbsoluteDokaThrowKeepRemountWalletRecord(190), 190);
  });

  it("reads bigint and #ok wrappers", () => {
    assert.equal(dokaFromAbsoluteDokaThrowKeepRemountWalletRecord(150n), 150);
    assert.equal(
      dokaFromAbsoluteDokaThrowKeepRemountWalletRecord({ ok: 190 }),
      190,
    );
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromAbsoluteDokaThrowKeepRemountWalletRecord(null), null);
    assert.equal(
      dokaFromAbsoluteDokaThrowKeepRemountWalletRecord(undefined),
      null,
    );
    assert.equal(
      dokaFromAbsoluteDokaThrowKeepRemountWalletRecord("nope"),
      null,
    );
  });
});

describe("shop / heal saveBattleStats throw-after-accept then remount shop", () => {
  it("leftover remount shop writes Doka 150 over canister 190 (the over-cut)", () => {
    // Chronology:
    // 1. World hydrated. Play-entry HP 100 / Doka 200.
    // 2. Lava 100→40 local. Doka-heal saveBattleStats accepts 70 / 190 then
    //    throws. Catch returns false. Heal rollback HUD 40 / 200.
    //    No unpaid death. #860 stamps HP keep. This sidecar would stamp Doka.
    // 3. Actor reconnect remounts. Lock Doka = Play-entry 200.
    // 4. Items Buy persistAbsoluteProgress(100, 150). writeDoka = 200 − 50.
    assert.equal(
      shouldStartDokaHeal({
        currentHp: PLAY_ENTRY_HP,
        maxHp: PLAY_ENTRY_HP,
        liveDoka: PLAY_ENTRY_DOKA,
      }),
      false,
      "remount Doka-heal is blocked; shop is the wipe path",
    );
    const remount = remountLock();
    const honourDoka = dokaForAbsoluteDokaThrowKeepRemountHonour({
      remountDoka: remount.snapshot().doka,
      liveDoka: PLAY_ENTRY_DOKA,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(honourDoka, PLAY_ENTRY_DOKA, "ungated remount trusts 200");
    const wrote = honourShopWrite(honourDoka ?? 0, SHOP_SPEND);
    assert.equal(wrote.doka, 150, "Play-entry honour over-cut heal spend");
    assert.equal(
      canisterAfterAbsoluteWrite(PLAY_ENTRY_DOKA - HEAL_SPEND, wrote.doka),
      150,
      "incoming 150 < stored 190 applies — extra 40 Doka cut",
    );
  });

  it("leftover remount heal writes incoming 190 over shop canister 150 (free heal)", () => {
    const remount = remountLock();
    const honourDoka = dokaForAbsoluteDokaThrowKeepRemountHonour({
      remountDoka: remount.snapshot().doka,
      liveDoka: PLAY_ENTRY_DOKA,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    const wrote = honourShopWrite(honourDoka ?? 0, HEAL_SPEND);
    assert.equal(wrote.doka, 190);
    assert.equal(
      canisterAfterAbsoluteWrite(PLAY_ENTRY_DOKA - SHOP_SPEND, wrote.doka),
      150,
      "incoming 190 > stored 150 is ignored — heal HP still applies",
    );
  });

  it("does not saveBattleStats-over-cut after a gated heal honour", () => {
    const remount = remountLock();
    const honourDoka = dokaForAbsoluteDokaThrowKeepRemountHonour({
      remountDoka: remount.snapshot().doka,
      liveDoka: PLAY_ENTRY_DOKA - HEAL_SPEND,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(honourDoka, 190);
    const wrote = honourShopWrite(honourDoka ?? 0, SHOP_SPEND);
    assert.equal(wrote.doka, 140, "heal fee survives remount shop");
    assert.equal(
      canisterAfterAbsoluteWrite(PLAY_ENTRY_DOKA - HEAL_SPEND, wrote.doka),
      140,
    );
  });

  it("does not saveBattleStats-skip the shop fee after a gated shop honour heal", () => {
    const remount = remountLock();
    const honourDoka = dokaForAbsoluteDokaThrowKeepRemountHonour({
      remountDoka: remount.snapshot().doka,
      liveDoka: PLAY_ENTRY_DOKA - SHOP_SPEND,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(honourDoka, 150);
    const wrote = honourShopWrite(honourDoka ?? 0, HEAL_SPEND);
    assert.equal(wrote.doka, 140, "shop fee survives remount heal");
    assert.equal(
      canisterAfterAbsoluteWrite(PLAY_ENTRY_DOKA - SHOP_SPEND, wrote.doka),
      140,
    );
  });

  it("fail-closes stale Play-entry 200 when the Doka-throw stamp is set", () => {
    assert.equal(
      dokaForAbsoluteDokaThrowKeepRemountHonour({
        remountDoka: PLAY_ENTRY_DOKA,
        liveDoka: PLAY_ENTRY_DOKA,
        keep: true,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      null,
    );
  });

  it("#860 remount shop honours HP 70; this leftover is the Doka 150 write", () => {
    assert.equal(
      resolveAbsoluteWriteHp(PLAY_ENTRY_HP, PLAY_ENTRY_HP),
      PLAY_ENTRY_HP,
    );
    const leftoverHp = HEALED_HP;
    const leftoverDoka = honourShopWrite(PLAY_ENTRY_DOKA, SHOP_SPEND).doka;
    assert.equal(leftoverHp, 70, "#860 gated HP path");
    assert.equal(leftoverDoka, 150, "ungated Doka still spends from 200");
  });

  it("pickup-only remount (no stamp) still spends from 200", () => {
    const wrote = honourShopWrite(PLAY_ENTRY_DOKA, SHOP_SPEND);
    assert.equal(wrote.doka, 150);
  });
});

describe("resolveCommittedDokaAfterAbsoluteDokaThrowKeepRemount", () => {
  it("returns remount wallet when keep is unset", async () => {
    const remount = remountLock();
    const storage = memStorage();
    const live = await resolveCommittedDokaAfterAbsoluteDokaThrowKeepRemount(
      remount,
      async () => 190,
      storage,
      1,
    );
    assert.equal(live, PLAY_ENTRY_DOKA);
  });

  it("fetches replica wallet when the Doka-throw stamp is set", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemount(storage, 1, {
      spend: HEAL_SPEND,
      error: new Error("replica went away"),
      preDoka: PLAY_ENTRY_DOKA,
    });
    const live = await resolveCommittedDokaAfterAbsoluteDokaThrowKeepRemount(
      remount,
      async () => PLAY_ENTRY_DOKA - HEAL_SPEND,
      storage,
      1,
    );
    assert.equal(live, 190);
    assert.equal(remount.snapshot().doka, 190, "lock adopts replica wallet");
    assert.equal(
      hasAbsoluteDokaThrowKeepRemount(storage, 1),
      false,
      "stamp cleared",
    );
    const wrote = honourShopWrite(live, SHOP_SPEND);
    assert.equal(wrote.doka, 140);
  });

  it("reads bigint wallet from getCallerDokaBalance", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemount(storage, 1, {
      spend: SHOP_SPEND,
      error: new Error("replica went away"),
      preDoka: PLAY_ENTRY_DOKA,
    });
    const live = await resolveCommittedDokaAfterAbsoluteDokaThrowKeepRemount(
      remount,
      async () => 150n,
      storage,
      1,
    );
    assert.equal(live, 150);
  });

  it("fail-closes when getCallerDokaBalance returns Play-entry wallet after keep", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemount(storage, 1, {
      spend: HEAL_SPEND,
      error: new Error("replica went away"),
      preDoka: PLAY_ENTRY_DOKA,
    });
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterAbsoluteDokaThrowKeepRemount(
          remount,
          async () => PLAY_ENTRY_DOKA,
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(remount.snapshot().doka, PLAY_ENTRY_DOKA);
    assert.equal(hasAbsoluteDokaThrowKeepRemount(storage, 1), true);
  });

  it("fail-closes when getCallerDokaBalance throws after keep", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemount(storage, 1, {
      spend: SHOP_SPEND,
      error: new Error("replica went away"),
      preDoka: PLAY_ENTRY_DOKA,
    });
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterAbsoluteDokaThrowKeepRemount(
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

describe("persistAbsoluteDokaThroughAbsoluteDokaThrowKeepRemount", () => {
  it("stamps remount Doka keep after a heal throw-after-accept without death", async () => {
    const storage = memStorage();
    const persist = remountLock();
    let canisterDoka = PLAY_ENTRY_DOKA;
    await assert.rejects(
      () =>
        persistAbsoluteDokaThroughAbsoluteDokaThrowKeepRemount({
          persist,
          storage,
          slot: 1,
          spend: HEAL_SPEND,
          applyAndCommit: async () => {
            canisterDoka -= HEAL_SPEND;
            throw new Error("replica went away");
          },
        }),
      /replica went away/,
    );
    assert.equal(canisterDoka, 190);
    assert.equal(
      persist.snapshot().doka,
      PLAY_ENTRY_DOKA,
      "heal commit never ran",
    );
    assert.deepEqual(readAbsoluteDokaThrowKeepRemount(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
  });

  it("stamps remount Doka keep after a full-HP shop throw-after-accept", async () => {
    const storage = memStorage();
    const persist = remountLock();
    let canisterDoka = PLAY_ENTRY_DOKA;
    await assert.rejects(
      () =>
        persistAbsoluteDokaThroughAbsoluteDokaThrowKeepRemount({
          persist,
          storage,
          slot: 1,
          spend: SHOP_SPEND,
          applyAndCommit: async () => {
            canisterDoka -= SHOP_SPEND;
            throw new Error("replica went away");
          },
        }),
      /replica went away/,
    );
    assert.equal(canisterDoka, 150);
    assert.deepEqual(readAbsoluteDokaThrowKeepRemount(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
  });

  it("does not stamp parsed success (that is #854)", async () => {
    const storage = memStorage();
    const persist = remountLock();
    const persisted =
      await persistAbsoluteDokaThroughAbsoluteDokaThrowKeepRemount({
        persist,
        storage,
        slot: 1,
        spend: HEAL_SPEND,
        applyAndCommit: async () => {
          persist.commit({ doka: PLAY_ENTRY_DOKA - HEAL_SPEND });
          return { doka: 190 };
        },
      });
    assert.equal(persisted.doka, 190);
    assert.equal(hasAbsoluteDokaThrowKeepRemount(storage, 1), false);
    assert.equal(persist.snapshot().doka, 190);
  });

  it("does not stamp explicit saveBattleStats failed", async () => {
    const storage = memStorage();
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistAbsoluteDokaThroughAbsoluteDokaThrowKeepRemount({
          persist,
          storage,
          slot: 1,
          spend: HEAL_SPEND,
          applyAndCommit: async () => {
            throw new Error("saveBattleStats failed");
          },
        }),
      /saveBattleStats failed/,
    );
    assert.equal(readAbsoluteDokaThrowKeepRemount(storage, 1), null);
  });

  it("does not stamp a zero-spend throw", async () => {
    const storage = memStorage();
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistAbsoluteDokaThroughAbsoluteDokaThrowKeepRemount({
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
    assert.equal(hasAbsoluteDokaThrowKeepRemount(storage, 1), false);
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
        persistAbsoluteDokaThroughAbsoluteDokaThrowKeepRemount({
          persist,
          storage,
          slot: 1,
          spend: HEAL_SPEND,
          applyAndCommit: async () => {
            throw new Error("replica went away");
          },
        }),
      /replica went away/,
    );
    assert.equal(flushed, 1);
    assert.equal(hasAbsoluteDokaThrowKeepRemount(storage, 1), true);
  });

  it("clears a keep stamp explicitly", () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemount(storage, 1, {
      spend: HEAL_SPEND,
      error: new Error("replica went away"),
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(hasAbsoluteDokaThrowKeepRemount(storage, 1), true);
    clearAbsoluteDokaThrowKeepRemount(storage, 1);
    assert.equal(hasAbsoluteDokaThrowKeepRemount(storage, 1), false);
  });
});

describe("distinct from HP throw #860, success HP #854, rename/upgrade spend #926", () => {
  it("notes keep with no unpaid pending, no death persist, and a Doka spend", () => {
    assert.equal(
      shouldNoteAbsoluteDokaThrowKeepRemount({
        spend: SHOP_SPEND,
        error: new Error("replica went away"),
      }),
      true,
      "this sidecar stamps transport-keep shop/heal Doka, not HP",
    );
  });

  it("uses pbv_absolute_doka_throw_keep_remount_slotN, not HP / spend / credit keys", () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemount(storage, 2, {
      spend: HEAL_SPEND,
      error: new Error("replica went away"),
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(
      absoluteDokaThrowKeepRemountKey(2),
      "pbv_absolute_doka_throw_keep_remount_slot2",
    );
    assert.equal(
      storage.getItem("pbv_absolute_doka_throw_keep_remount_slot2") != null,
      true,
    );
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot2"), null);
    assert.equal(
      storage.getItem("pbv_absolute_hp_throw_keep_remount_slot2"),
      null,
    );
    assert.equal(storage.getItem("pbv_absolute_hp_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_spend_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_victory_doka_keep_remount_slot2"), null);
  });

  it("refuses live ≥ preDoka (credit remounts refuse live ≤ preDoka)", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
      "stale-equal is a missed debit",
    );
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountStaleDoka({
        keep: true,
        liveDoka: 190,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
      "a drop is the replica catching up — credit skip would stuck-skip this",
    );
  });

  it("does not treat #860 HP honour 70 as this Doka write", () => {
    assert.equal(HEALED_HP, 70);
    const leftoverDoka = honourShopWrite(PLAY_ENTRY_DOKA, SHOP_SPEND).doka;
    const gatedDoka = honourShopWrite(
      PLAY_ENTRY_DOKA - HEAL_SPEND,
      SHOP_SPEND,
    ).doka;
    assert.equal(leftoverDoka, 150);
    assert.equal(gatedDoka, 140);
    assert.notEqual(leftoverDoka, gatedDoka);
  });
});
