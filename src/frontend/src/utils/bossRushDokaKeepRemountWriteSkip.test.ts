import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clearBossRushDokaKeepRemount,
  dokaForBossRushDokaKeepRemountHonour,
  dokaFromWalletRecord,
  hasBossRushDokaKeepRemount,
  noteBossRushDokaKeepRemount,
  persistBossRushDokaThroughBossRushDokaKeepRemount,
  readBossRushDokaKeepRemount,
  resolveCommittedDokaAfterBossRushDokaKeepRemount,
  shouldNoteBossRushDokaKeepRemount,
  shouldRefuseBossRushDokaKeepRemountStaleDoka,
} from "./bossRushDokaKeepRemountWriteSkip.ts";
import {
  type DeathPenaltyStorage,
  applyUnpaidDeathPenaltyToWrite,
} from "./deathPenalty.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  clampAbsoluteProgressWrite,
  createProgressPersist,
} from "./progressPersist.ts";

/** Advertised room-0 clear (`BOSS_RUSH_ROOMS[0].dokaReward`). */
const ROOM_CLEAR_DOKA = 500;

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

/** Production remount lock: GameFlow session cache (HUD never credited). */
function remountLock() {
  return createProgressPersist({ doka: 200, xp: 100, level: 4 });
}

function honourHealWrite(honourDoka: number, spend: number): { doka: number } {
  return {
    doka: clampAbsoluteProgressWrite(
      applySpendToCommitted(honourDoka, spend),
      honourDoka,
    ),
  };
}

describe("shouldNoteBossRushDokaKeepRemount", () => {
  it("notes transport-keep after a room-clear Doka grant without unpaid death", () => {
    assert.equal(
      shouldNoteBossRushDokaKeepRemount({
        dokaDelta: ROOM_CLEAR_DOKA,
        error: new Error("replica went away"),
      }),
      true,
    );
  });

  it("does not note portal-only XP (dokaDelta 0)", () => {
    assert.equal(
      shouldNoteBossRushDokaKeepRemount({
        dokaDelta: 0,
        error: new Error("replica went away"),
      }),
      false,
    );
  });

  it("does not note explicit applyRewards failed", () => {
    assert.equal(
      shouldNoteBossRushDokaKeepRemount({
        dokaDelta: ROOM_CLEAR_DOKA,
        error: new Error("applyRewards failed: over cap"),
      }),
      false,
    );
  });
});

describe("shouldRefuseBossRushDokaKeepRemountStaleDoka", () => {
  it("refuses stale Play-entry wallet equal to stamped preDoka", () => {
    assert.equal(
      shouldRefuseBossRushDokaKeepRemountStaleDoka({
        keep: true,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("refuses placeholder 0 below stamped preDoka", () => {
    assert.equal(
      shouldRefuseBossRushDokaKeepRemountStaleDoka({
        keep: true,
        liveDoka: 0,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("does not refuse a fresh room-clear wallet 700", () => {
    assert.equal(
      shouldRefuseBossRushDokaKeepRemountStaleDoka({
        keep: true,
        liveDoka: 200 + ROOM_CLEAR_DOKA,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseBossRushDokaKeepRemountStaleDoka({
        keep: false,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseBossRushDokaKeepRemountStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: 200,
      }),
      true,
    );
  });
});

describe("dokaFromWalletRecord", () => {
  it("reads a number wallet", () => {
    assert.equal(dokaFromWalletRecord(700), 700);
  });

  it("reads bigint and #ok wrappers", () => {
    assert.equal(dokaFromWalletRecord(700n), 700);
    assert.equal(dokaFromWalletRecord({ ok: 700 }), 700);
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromWalletRecord(null), null);
    assert.equal(dokaFromWalletRecord(undefined), null);
    assert.equal(dokaFromWalletRecord("nope"), null);
  });
});

describe("Boss Rush throw-after-add then remount heal without unpaid death", () => {
  it("leftover remount heal writes Doka 190 over canister 700 (the wipe)", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 seeded. Canister 200.
    // 2. Room-clear applyRewards(500, xp) invokes then throws.
    //    Canister 700. Commit never runs. No unpaid death pending.
    // 3. Actor reconnect remounts. New lock Play-entry Doka 200.
    //    #742 / #767 / #774 do not stamp (no death-cut / portal XP /
    //    handleBattleEnd victory).
    // 4. Heal spends 10. writeDoka = committed.doka 200 − 10.
    const remount = remountLock();
    const honourDoka = dokaForBossRushDokaKeepRemountHonour({
      remountDoka: remount.snapshot().doka,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.equal(honourDoka, 200, "ungated remount trusts Play-entry 200");
    const wrote = honourHealWrite(honourDoka ?? 0, 10);
    assert.equal(wrote.doka, 190, "Play-entry honour wiped room-clear +500");
  });

  it("does not saveBattleStats-wipe room-clear +500 after a gated fresh wallet honour", () => {
    const remount = remountLock();
    const honourDoka = dokaForBossRushDokaKeepRemountHonour({
      remountDoka: remount.snapshot().doka,
      liveDoka: 200 + ROOM_CLEAR_DOKA,
      keep: true,
      stampedPreDoka: 200,
    });
    assert.equal(honourDoka, 700);
    const wrote = honourHealWrite(honourDoka ?? 0, 10);
    assert.equal(wrote.doka, 690, "room-clear +500 survives remount heal");
  });

  it("fail-closes stale Play-entry 200 when the Doka-keep stamp is set", () => {
    assert.equal(
      dokaForBossRushDokaKeepRemountHonour({
        remountDoka: 200,
        liveDoka: 200,
        keep: true,
        stampedPreDoka: 200,
      }),
      null,
    );
  });
});

describe("resolveCommittedDokaAfterBossRushDokaKeepRemount", () => {
  it("returns remount wallet when keep is unset", async () => {
    const remount = remountLock();
    const storage = memStorage();
    const live = await resolveCommittedDokaAfterBossRushDokaKeepRemount(
      remount,
      async () => 700,
      storage,
      1,
    );
    assert.equal(live, 200);
  });

  it("fetches replica wallet when the Doka-keep stamp is set", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteBossRushDokaKeepRemount(storage, 1, {
      dokaDelta: ROOM_CLEAR_DOKA,
      error: new Error("replica went away"),
      preDoka: 200,
    });
    const live = await resolveCommittedDokaAfterBossRushDokaKeepRemount(
      remount,
      async () => 200 + ROOM_CLEAR_DOKA,
      storage,
      1,
    );
    assert.equal(live, 700);
    assert.equal(remount.snapshot().doka, 700, "lock adopts replica wallet");
    assert.equal(
      hasBossRushDokaKeepRemount(storage, 1),
      false,
      "stamp cleared",
    );
    const wrote = honourHealWrite(live, 10);
    assert.equal(wrote.doka, 690);
  });

  it("reads bigint wallet from getCallerDokaBalance", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteBossRushDokaKeepRemount(storage, 1, {
      dokaDelta: ROOM_CLEAR_DOKA,
      error: new Error("replica went away"),
      preDoka: 200,
    });
    const live = await resolveCommittedDokaAfterBossRushDokaKeepRemount(
      remount,
      async () => 700n,
      storage,
      1,
    );
    assert.equal(live, 700);
  });

  it("fail-closes when getCallerDokaBalance returns Play-entry wallet after keep", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteBossRushDokaKeepRemount(storage, 1, {
      dokaDelta: ROOM_CLEAR_DOKA,
      error: new Error("replica went away"),
      preDoka: 200,
    });
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterBossRushDokaKeepRemount(
          remount,
          async () => 200,
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(remount.snapshot().doka, 200);
    assert.equal(hasBossRushDokaKeepRemount(storage, 1), true);
  });

  it("fail-closes when getCallerDokaBalance throws after keep", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteBossRushDokaKeepRemount(storage, 1, {
      dokaDelta: ROOM_CLEAR_DOKA,
      error: new Error("replica went away"),
      preDoka: 200,
    });
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterBossRushDokaKeepRemount(
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

describe("persistBossRushDokaThroughBossRushDokaKeepRemount", () => {
  it("stamps remount Doka keep after room-clear throw-after-add without unpaid death", async () => {
    const storage = memStorage();
    const persist = remountLock();
    let canisterDoka = 200;
    let roomAdvanced = false;
    await assert.rejects(
      () =>
        persistBossRushDokaThroughBossRushDokaKeepRemount({
          persist,
          persistRoomClear: async () => {
            roomAdvanced = true;
          },
          storage,
          slot: 1,
          dokaDelta: ROOM_CLEAR_DOKA,
          applyAndCommit: async () => {
            canisterDoka += ROOM_CLEAR_DOKA;
            throw new Error("replica went away");
          },
        }),
      /replica went away/,
    );
    assert.equal(roomAdvanced, true, "currentRoom already advanced");
    assert.equal(canisterDoka, 700);
    assert.deepEqual(readBossRushDokaKeepRemount(storage, 1), { preDoka: 200 });
    assert.equal(persist.snapshot().doka, 200, "room-clear commit never ran");
  });

  it("does not stamp keep when persistRoomClear throws before applyRewards", async () => {
    const storage = memStorage();
    const persist = remountLock();
    let applyRan = false;
    await assert.rejects(
      () =>
        persistBossRushDokaThroughBossRushDokaKeepRemount({
          persist,
          persistRoomClear: async () => {
            throw new Error("setBossRushProgress rejected");
          },
          storage,
          slot: 1,
          dokaDelta: ROOM_CLEAR_DOKA,
          applyAndCommit: async () => {
            applyRan = true;
            return { ok: true };
          },
        }),
      /setBossRushProgress rejected/,
    );
    assert.equal(applyRan, false);
    assert.equal(readBossRushDokaKeepRemount(storage, 1), null);
  });

  it("does not stamp keep on explicit applyRewards failed", async () => {
    const storage = memStorage();
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistBossRushDokaThroughBossRushDokaKeepRemount({
          persist,
          persistRoomClear: async () => {},
          storage,
          slot: 1,
          dokaDelta: ROOM_CLEAR_DOKA,
          applyAndCommit: async () => {
            throw new Error("applyRewards failed: over cap");
          },
        }),
      /applyRewards failed/,
    );
    assert.equal(readBossRushDokaKeepRemount(storage, 1), null);
  });

  it("does not stamp keep for an XP-only credit", async () => {
    const storage = memStorage();
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistBossRushDokaThroughBossRushDokaKeepRemount({
          persist,
          persistRoomClear: async () => {},
          storage,
          slot: 1,
          dokaDelta: 0,
          applyAndCommit: async () => {
            throw new Error("replica went away");
          },
        }),
      /replica went away/,
    );
    assert.equal(hasBossRushDokaKeepRemount(storage, 1), false);
  });

  it("clears a keep stamp explicitly", () => {
    const storage = memStorage();
    noteBossRushDokaKeepRemount(storage, 1, {
      dokaDelta: ROOM_CLEAR_DOKA,
      error: new Error("replica went away"),
      preDoka: 200,
    });
    assert.equal(hasBossRushDokaKeepRemount(storage, 1), true);
    clearBossRushDokaKeepRemount(storage, 1);
    assert.equal(hasBossRushDokaKeepRemount(storage, 1), false);
  });
});

describe("distinct from victory remount #774, portal XP remount #767, death-cut remount #742", () => {
  it("notes keep with no unpaid pending ( #742 stamps a death-cut lock-move )", () => {
    assert.equal(
      shouldNoteBossRushDokaKeepRemount({
        dokaDelta: ROOM_CLEAR_DOKA,
        error: new Error("replica went away"),
      }),
      true,
      "this sidecar does not gate on unpaid death pending",
    );
  });

  it("does not note portal +10 XP (dokaDelta 0 — that is #767)", () => {
    assert.equal(
      shouldNoteBossRushDokaKeepRemount({
        dokaDelta: 0,
        error: new Error("replica went away"),
      }),
      false,
    );
  });

  it("uses a Boss Rush stamp key, not the #774 victory remount key", () => {
    const storage = memStorage();
    noteBossRushDokaKeepRemount(storage, 1, {
      dokaDelta: ROOM_CLEAR_DOKA,
      error: new Error("replica went away"),
      preDoka: 200,
    });
    assert.equal(
      storage.getItem("pbv_boss_rush_doka_keep_remount_slot1") != null,
      true,
    );
    assert.equal(
      storage.getItem("pbv_victory_doka_keep_remount_slot1"),
      null,
      "#774 victory remount key stays empty",
    );
  });

  it("unpaid honour on top of gated room-clear wallet still applies 40%", () => {
    const pending = {
      slot: 1,
      preXp: 100,
      preDoka: 200,
      afterXp: 80,
      afterDoka: 120,
    };
    const wrote = applyUnpaidDeathPenaltyToWrite(pending, 100, 690);
    assert.equal(wrote.xp, 80, "unpaid XP 20 on leftover 100");
    assert.equal(wrote.doka, 610, "unpaid 80 on room-clear spend snapshot 690");
  });
});
