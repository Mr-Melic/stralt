import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  type DeathPenaltyStorage,
  applyUnpaidDeathPenaltyToWrite,
} from "./deathPenalty.ts";
import {
  clearGameKeyDokaKeepRemount,
  dokaForGameKeyDokaKeepRemountHonour,
  dokaFromGameKeyKeepRemountWallet,
  hasGameKeyDokaKeepRemount,
  noteGameKeyDokaKeepRemount,
  persistGameKeyThroughGameKeyDokaKeepRemount,
  readGameKeyDokaKeepRemount,
  resolveCommittedDokaAfterGameKeyDokaKeepRemount,
  shouldNoteGameKeyDokaKeepRemount,
  shouldRefuseGameKeyDokaKeepRemountStaleDoka,
} from "./gameKeyDokaKeepRemountWriteSkip.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  clampAbsoluteProgressWrite,
  createProgressPersist,
} from "./progressPersist.ts";
import { redeemGameKeyThroughPersist } from "./shopPurchase.ts";

const GAMEKEY_DOKA = 1000;

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

describe("shouldNoteGameKeyDokaKeepRemount", () => {
  it("notes transport-keep after redeem without unpaid death", () => {
    assert.equal(
      shouldNoteGameKeyDokaKeepRemount(new Error("replica went away")),
      true,
    );
  });

  it("does not note explicit redeemGameKey failed", () => {
    assert.equal(
      shouldNoteGameKeyDokaKeepRemount(
        new Error("redeemGameKey failed: Account banned"),
      ),
      false,
    );
  });

  it("does not note already used / invalid / not approved", () => {
    assert.equal(
      shouldNoteGameKeyDokaKeepRemount(new Error("GameKey already used")),
      false,
    );
    assert.equal(
      shouldNoteGameKeyDokaKeepRemount(new Error("Invalid GameKey")),
      false,
    );
    assert.equal(
      shouldNoteGameKeyDokaKeepRemount(
        new Error("GameKey is not yet approved"),
      ),
      false,
    );
  });

  it("does not note applyRewards failed (that is #774 / #800)", () => {
    assert.equal(
      shouldNoteGameKeyDokaKeepRemount(
        new Error("applyRewards failed: over cap"),
      ),
      false,
    );
  });
});

describe("shouldRefuseGameKeyDokaKeepRemountStaleDoka", () => {
  it("refuses stale Play-entry wallet equal to stamped preDoka", () => {
    assert.equal(
      shouldRefuseGameKeyDokaKeepRemountStaleDoka({
        keep: true,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("refuses placeholder 0 below stamped preDoka", () => {
    assert.equal(
      shouldRefuseGameKeyDokaKeepRemountStaleDoka({
        keep: true,
        liveDoka: 0,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("does not refuse a fresh GameKey wallet 1200", () => {
    assert.equal(
      shouldRefuseGameKeyDokaKeepRemountStaleDoka({
        keep: true,
        liveDoka: 200 + GAMEKEY_DOKA,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseGameKeyDokaKeepRemountStaleDoka({
        keep: false,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseGameKeyDokaKeepRemountStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: 200,
      }),
      true,
    );
  });
});

describe("dokaFromGameKeyKeepRemountWallet", () => {
  it("reads a number wallet", () => {
    assert.equal(dokaFromGameKeyKeepRemountWallet(1200), 1200);
  });

  it("reads bigint and #ok wrappers", () => {
    assert.equal(dokaFromGameKeyKeepRemountWallet(1200n), 1200);
    assert.equal(dokaFromGameKeyKeepRemountWallet({ ok: 1200 }), 1200);
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromGameKeyKeepRemountWallet(null), null);
    assert.equal(dokaFromGameKeyKeepRemountWallet(undefined), null);
    assert.equal(dokaFromGameKeyKeepRemountWallet("nope"), null);
  });
});

describe("GameKey throw-after-add then remount heal without unpaid death", () => {
  it("leftover remount heal writes Doka 190 over canister 1200 (the wipe)", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 seeded. Canister 200.
    // 2. redeemGameKey adds 1000 then throws. Canister 1200. Commit never
    //    runs. No unpaid death pending. HUD stays 200.
    // 3. Actor reconnect remounts. New lock Play-entry Doka 200.
    //    #545 / #552 session flags are gone. #774 / #800 do not stamp
    //    redeemGameKey.
    // 4. Heal spends 10. writeDoka = committed.doka 200 − 10.
    const remount = remountLock();
    const honourDoka = dokaForGameKeyDokaKeepRemountHonour({
      remountDoka: remount.snapshot().doka,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.equal(honourDoka, 200, "ungated remount trusts Play-entry 200");
    const wrote = honourHealWrite(honourDoka ?? 0, 10);
    assert.equal(wrote.doka, 190, "Play-entry honour wiped GameKey +1000");
  });

  it("does not saveBattleStats-wipe GameKey +1000 after a gated fresh wallet honour", () => {
    const remount = remountLock();
    const honourDoka = dokaForGameKeyDokaKeepRemountHonour({
      remountDoka: remount.snapshot().doka,
      liveDoka: 200 + GAMEKEY_DOKA,
      keep: true,
      stampedPreDoka: 200,
    });
    assert.equal(honourDoka, 1200);
    const wrote = honourHealWrite(honourDoka ?? 0, 10);
    assert.equal(wrote.doka, 1190, "GameKey +1000 survives remount heal");
  });

  it("fail-closes stale Play-entry 200 when the Doka-keep stamp is set", () => {
    assert.equal(
      dokaForGameKeyDokaKeepRemountHonour({
        remountDoka: 200,
        liveDoka: 200,
        keep: true,
        stampedPreDoka: 200,
      }),
      null,
    );
  });
});

describe("resolveCommittedDokaAfterGameKeyDokaKeepRemount", () => {
  it("returns remount wallet when keep is unset", async () => {
    const remount = remountLock();
    const storage = memStorage();
    const live = await resolveCommittedDokaAfterGameKeyDokaKeepRemount(
      remount,
      async () => 1200,
      storage,
      1,
    );
    assert.equal(live, 200);
  });

  it("fetches replica wallet when the Doka-keep stamp is set", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteGameKeyDokaKeepRemount(storage, 1, {
      error: new Error("replica went away"),
      preDoka: 200,
    });
    const live = await resolveCommittedDokaAfterGameKeyDokaKeepRemount(
      remount,
      async () => 200 + GAMEKEY_DOKA,
      storage,
      1,
    );
    assert.equal(live, 1200);
    assert.equal(remount.snapshot().doka, 1200, "lock adopts replica wallet");
    assert.equal(hasGameKeyDokaKeepRemount(storage, 1), false, "stamp cleared");
    const wrote = honourHealWrite(live, 10);
    assert.equal(wrote.doka, 1190);
  });

  it("reads bigint wallet from getCallerDokaBalance", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteGameKeyDokaKeepRemount(storage, 1, {
      error: new Error("replica went away"),
      preDoka: 200,
    });
    const live = await resolveCommittedDokaAfterGameKeyDokaKeepRemount(
      remount,
      async () => 1200n,
      storage,
      1,
    );
    assert.equal(live, 1200);
  });

  it("fail-closes when getCallerDokaBalance returns Play-entry wallet after keep", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteGameKeyDokaKeepRemount(storage, 1, {
      error: new Error("replica went away"),
      preDoka: 200,
    });
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterGameKeyDokaKeepRemount(
          remount,
          async () => 200,
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(remount.snapshot().doka, 200);
    assert.equal(hasGameKeyDokaKeepRemount(storage, 1), true);
  });

  it("fail-closes when getCallerDokaBalance throws after keep", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteGameKeyDokaKeepRemount(storage, 1, {
      error: new Error("replica went away"),
      preDoka: 200,
    });
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterGameKeyDokaKeepRemount(
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

describe("persistGameKeyThroughGameKeyDokaKeepRemount", () => {
  it("stamps remount Doka keep after GameKey throw-after-add without unpaid death", async () => {
    const storage = memStorage();
    const persist = remountLock();
    let canisterDoka = 200;
    await assert.rejects(
      () =>
        persistGameKeyThroughGameKeyDokaKeepRemount({
          persist,
          storage,
          slot: 1,
          redeemAndCommit: async () => {
            canisterDoka += GAMEKEY_DOKA;
            throw new Error("replica went away");
          },
        }),
      /replica went away/,
    );
    assert.equal(canisterDoka, 1200);
    assert.deepEqual(readGameKeyDokaKeepRemount(storage, 1), { preDoka: 200 });
    assert.equal(persist.snapshot().doka, 200, "GameKey commit never ran");
  });

  it("does not stamp keep on explicit redeemGameKey failed", async () => {
    const storage = memStorage();
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistGameKeyThroughGameKeyDokaKeepRemount({
          persist,
          storage,
          slot: 1,
          redeemAndCommit: async () => {
            throw new Error("redeemGameKey failed: Account banned");
          },
        }),
      /redeemGameKey failed/,
    );
    assert.equal(readGameKeyDokaKeepRemount(storage, 1), null);
  });

  it("notes unconfirmed from redeemGameKeyThroughPersist throw inside the wrap", async () => {
    const storage = memStorage();
    const persist = remountLock();
    let canisterDoka = 200;
    await assert.rejects(
      persistGameKeyThroughGameKeyDokaKeepRemount({
        persist,
        storage,
        slot: 1,
        redeemAndCommit: () =>
          redeemGameKeyThroughPersist(
            {
              redeemGameKey: async () => {
                canisterDoka += GAMEKEY_DOKA;
                throw new Error("replica reject after add");
              },
            },
            persist,
            "A".repeat(120),
          ),
      }),
      /replica reject after add/,
    );
    assert.equal(canisterDoka, 1200);
    assert.equal(
      persist.snapshot().doka,
      200,
      "lock leftover stays pre-redeem",
    );
    assert.deepEqual(readGameKeyDokaKeepRemount(storage, 1), { preDoka: 200 });
  });

  it("clears a keep stamp explicitly", () => {
    const storage = memStorage();
    noteGameKeyDokaKeepRemount(storage, 1, {
      error: new Error("replica went away"),
      preDoka: 200,
    });
    assert.equal(hasGameKeyDokaKeepRemount(storage, 1), true);
    clearGameKeyDokaKeepRemount(storage, 1);
    assert.equal(hasGameKeyDokaKeepRemount(storage, 1), false);
  });
});

describe("distinct from victory Doka remount #774, one-shot #800, session #545/#552", () => {
  it("notes keep with no unpaid pending ( #742 stamps a death-cut lock-move )", () => {
    assert.equal(
      shouldNoteGameKeyDokaKeepRemount(new Error("replica went away")),
      true,
      "this sidecar does not gate on unpaid death pending",
    );
  });

  it("does not note applyRewards failed (victory / one-shot credit paths)", () => {
    assert.equal(
      shouldNoteGameKeyDokaKeepRemount(
        new Error("applyRewards failed: over cap"),
      ),
      false,
    );
  });

  it("unpaid honour on top of gated GameKey wallet still applies 40%", () => {
    const pending = {
      slot: 1,
      preXp: 100,
      preDoka: 200,
      afterXp: 80,
      afterDoka: 120,
    };
    const wrote = applyUnpaidDeathPenaltyToWrite(pending, 100, 1190);
    assert.equal(wrote.xp, 80, "unpaid XP 20 on leftover 100");
    assert.equal(wrote.doka, 1110, "unpaid 80 on GameKey spend snapshot 1190");
  });
});
