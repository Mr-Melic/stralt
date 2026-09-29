import assert from "node:assert/strict";
import { describe, it } from "node:test";
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
import {
  clearVictoryDokaKeepRemount,
  dokaForVictoryDokaKeepRemountHonour,
  dokaFromWalletRecord,
  hasVictoryDokaKeepRemount,
  noteVictoryDokaKeepRemount,
  persistVictoryDokaThroughVictoryDokaKeepRemount,
  readVictoryDokaKeepRemount,
  resolveCommittedDokaAfterVictoryDokaKeepRemount,
  shouldNoteVictoryDokaKeepRemount,
  shouldRefuseVictoryDokaKeepRemountStaleDoka,
} from "./victoryDokaKeepRemountWriteSkip.ts";

const VICTORY_DOKA = 50;

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

describe("shouldNoteVictoryDokaKeepRemount", () => {
  it("notes transport-keep after a Doka grant without unpaid death", () => {
    assert.equal(
      shouldNoteVictoryDokaKeepRemount({
        dokaDelta: VICTORY_DOKA,
        error: new Error("replica went away"),
      }),
      true,
    );
  });

  it("does not note portal-only XP (dokaDelta 0)", () => {
    assert.equal(
      shouldNoteVictoryDokaKeepRemount({
        dokaDelta: 0,
        error: new Error("replica went away"),
      }),
      false,
    );
  });

  it("does not note explicit applyRewards failed", () => {
    assert.equal(
      shouldNoteVictoryDokaKeepRemount({
        dokaDelta: VICTORY_DOKA,
        error: new Error("applyRewards failed: over cap"),
      }),
      false,
    );
  });
});

describe("shouldRefuseVictoryDokaKeepRemountStaleDoka", () => {
  it("refuses stale Play-entry wallet equal to stamped preDoka", () => {
    assert.equal(
      shouldRefuseVictoryDokaKeepRemountStaleDoka({
        keep: true,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("refuses placeholder 0 below stamped preDoka", () => {
    assert.equal(
      shouldRefuseVictoryDokaKeepRemountStaleDoka({
        keep: true,
        liveDoka: 0,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("does not refuse a fresh victory wallet 250", () => {
    assert.equal(
      shouldRefuseVictoryDokaKeepRemountStaleDoka({
        keep: true,
        liveDoka: 200 + VICTORY_DOKA,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseVictoryDokaKeepRemountStaleDoka({
        keep: false,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseVictoryDokaKeepRemountStaleDoka({
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
    assert.equal(dokaFromWalletRecord(250), 250);
  });

  it("reads bigint and #ok wrappers", () => {
    assert.equal(dokaFromWalletRecord(250n), 250);
    assert.equal(dokaFromWalletRecord({ ok: 250 }), 250);
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromWalletRecord(null), null);
    assert.equal(dokaFromWalletRecord(undefined), null);
    assert.equal(dokaFromWalletRecord("nope"), null);
  });
});

describe("victory throw-after-add then remount heal without unpaid death", () => {
  it("leftover remount heal writes Doka 190 over canister 250 (the wipe)", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 seeded. Canister 200.
    // 2. Victory applyRewards(50, xp) invokes then throws.
    //    Canister 250. Commit never runs. No unpaid death pending.
    // 3. Actor reconnect remounts. New lock Play-entry Doka 200.
    //    #742 / #767 do not stamp (no death-cut / portal XP-only).
    // 4. Heal spends 10. writeDoka = committed.doka 200 − 10.
    const remount = remountLock();
    const honourDoka = dokaForVictoryDokaKeepRemountHonour({
      remountDoka: remount.snapshot().doka,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.equal(honourDoka, 200, "ungated remount trusts Play-entry 200");
    const wrote = honourHealWrite(honourDoka ?? 0, 10);
    assert.equal(wrote.doka, 190, "Play-entry honour wiped victory +50");
  });

  it("does not saveBattleStats-wipe victory +50 after a gated fresh wallet honour", () => {
    const remount = remountLock();
    const honourDoka = dokaForVictoryDokaKeepRemountHonour({
      remountDoka: remount.snapshot().doka,
      liveDoka: 200 + VICTORY_DOKA,
      keep: true,
      stampedPreDoka: 200,
    });
    assert.equal(honourDoka, 250);
    const wrote = honourHealWrite(honourDoka ?? 0, 10);
    assert.equal(wrote.doka, 240, "victory +50 survives remount heal");
  });

  it("fail-closes stale Play-entry 200 when the Doka-keep stamp is set", () => {
    assert.equal(
      dokaForVictoryDokaKeepRemountHonour({
        remountDoka: 200,
        liveDoka: 200,
        keep: true,
        stampedPreDoka: 200,
      }),
      null,
    );
  });
});

describe("resolveCommittedDokaAfterVictoryDokaKeepRemount", () => {
  it("returns remount wallet when keep is unset", async () => {
    const remount = remountLock();
    const storage = memStorage();
    const live = await resolveCommittedDokaAfterVictoryDokaKeepRemount(
      remount,
      async () => 250,
      storage,
      1,
    );
    assert.equal(live, 200);
  });

  it("fetches replica wallet when the Doka-keep stamp is set", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteVictoryDokaKeepRemount(storage, 1, {
      dokaDelta: VICTORY_DOKA,
      error: new Error("replica went away"),
      preDoka: 200,
    });
    const live = await resolveCommittedDokaAfterVictoryDokaKeepRemount(
      remount,
      async () => 200 + VICTORY_DOKA,
      storage,
      1,
    );
    assert.equal(live, 250);
    assert.equal(remount.snapshot().doka, 250, "lock adopts replica wallet");
    assert.equal(hasVictoryDokaKeepRemount(storage, 1), false, "stamp cleared");
    const wrote = honourHealWrite(live, 10);
    assert.equal(wrote.doka, 240);
  });

  it("reads bigint wallet from getCallerDokaBalance", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteVictoryDokaKeepRemount(storage, 1, {
      dokaDelta: VICTORY_DOKA,
      error: new Error("replica went away"),
      preDoka: 200,
    });
    const live = await resolveCommittedDokaAfterVictoryDokaKeepRemount(
      remount,
      async () => 250n,
      storage,
      1,
    );
    assert.equal(live, 250);
  });

  it("fail-closes when getCallerDokaBalance returns Play-entry wallet after keep", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteVictoryDokaKeepRemount(storage, 1, {
      dokaDelta: VICTORY_DOKA,
      error: new Error("replica went away"),
      preDoka: 200,
    });
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterVictoryDokaKeepRemount(
          remount,
          async () => 200,
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(remount.snapshot().doka, 200);
    assert.equal(hasVictoryDokaKeepRemount(storage, 1), true);
  });

  it("fail-closes when getCallerDokaBalance throws after keep", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteVictoryDokaKeepRemount(storage, 1, {
      dokaDelta: VICTORY_DOKA,
      error: new Error("replica went away"),
      preDoka: 200,
    });
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterVictoryDokaKeepRemount(
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

describe("persistVictoryDokaThroughVictoryDokaKeepRemount", () => {
  it("stamps remount Doka keep after victory throw-after-add without unpaid death", async () => {
    const storage = memStorage();
    const persist = remountLock();
    let canisterDoka = 200;
    await assert.rejects(
      () =>
        persistVictoryDokaThroughVictoryDokaKeepRemount({
          persist,
          storage,
          slot: 1,
          dokaDelta: VICTORY_DOKA,
          applyAndCommit: async () => {
            canisterDoka += VICTORY_DOKA;
            throw new Error("replica went away");
          },
        }),
      /replica went away/,
    );
    assert.equal(canisterDoka, 250);
    assert.deepEqual(readVictoryDokaKeepRemount(storage, 1), { preDoka: 200 });
    assert.equal(persist.snapshot().doka, 200, "victory commit never ran");
  });

  it("does not stamp keep on explicit applyRewards failed", async () => {
    const storage = memStorage();
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistVictoryDokaThroughVictoryDokaKeepRemount({
          persist,
          storage,
          slot: 1,
          dokaDelta: VICTORY_DOKA,
          applyAndCommit: async () => {
            throw new Error("applyRewards failed: over cap");
          },
        }),
      /applyRewards failed/,
    );
    assert.equal(readVictoryDokaKeepRemount(storage, 1), null);
  });

  it("does not stamp keep for an XP-only credit", async () => {
    const storage = memStorage();
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistVictoryDokaThroughVictoryDokaKeepRemount({
          persist,
          storage,
          slot: 1,
          dokaDelta: 0,
          applyAndCommit: async () => {
            throw new Error("replica went away");
          },
        }),
      /replica went away/,
    );
    assert.equal(hasVictoryDokaKeepRemount(storage, 1), false);
  });

  it("clears a keep stamp explicitly", () => {
    const storage = memStorage();
    noteVictoryDokaKeepRemount(storage, 1, {
      dokaDelta: VICTORY_DOKA,
      error: new Error("replica went away"),
      preDoka: 200,
    });
    assert.equal(hasVictoryDokaKeepRemount(storage, 1), true);
    clearVictoryDokaKeepRemount(storage, 1);
    assert.equal(hasVictoryDokaKeepRemount(storage, 1), false);
  });
});

describe("distinct from portal XP remount #767 and death-cut remount #742", () => {
  it("notes keep with no unpaid pending ( #742 stamps a death-cut lock-move )", () => {
    assert.equal(
      shouldNoteVictoryDokaKeepRemount({
        dokaDelta: VICTORY_DOKA,
        error: new Error("replica went away"),
      }),
      true,
      "this sidecar does not gate on unpaid death pending",
    );
  });

  it("does not note portal +10 XP (dokaDelta 0 — that is #767)", () => {
    assert.equal(
      shouldNoteVictoryDokaKeepRemount({
        dokaDelta: 0,
        error: new Error("replica went away"),
      }),
      false,
    );
  });

  it("unpaid honour on top of gated victory wallet still applies 40%", () => {
    const pending = {
      slot: 1,
      preXp: 100,
      preDoka: 200,
      afterXp: 80,
      afterDoka: 120,
    };
    const wrote = applyUnpaidDeathPenaltyToWrite(pending, 100, 240);
    assert.equal(wrote.xp, 80, "unpaid XP 20 on leftover 100");
    assert.equal(wrote.doka, 160, "unpaid 80 on victory spend snapshot 240");
  });
});
