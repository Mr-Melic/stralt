import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  type DeathPenaltyStorage,
  applyUnpaidDeathPenaltyToWrite,
} from "./deathPenalty.ts";
import {
  clearOneShotDokaKeepRemount,
  dokaForOneShotDokaKeepRemountHonour,
  dokaFromOneShotKeepRemountWallet,
  hasOneShotDokaKeepRemount,
  noteOneShotDokaKeepRemount,
  persistOneShotDokaThroughOneShotDokaKeepRemount,
  readOneShotDokaKeepRemount,
  resolveCommittedDokaAfterOneShotDokaKeepRemount,
  shouldNoteOneShotDokaKeepRemount,
  shouldRefuseOneShotDokaKeepRemountStaleDoka,
} from "./oneShotDokaKeepRemountWriteSkip.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  clampAbsoluteProgressWrite,
  createProgressPersist,
} from "./progressPersist.ts";

const PICKUP_DOKA = 50;

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

describe("shouldNoteOneShotDokaKeepRemount", () => {
  it("notes seeded transport-keep without unpaid death", () => {
    assert.equal(
      shouldNoteOneShotDokaKeepRemount({
        settleKind: "keep",
        walletSeeded: true,
      }),
      true,
    );
  });

  it("does not note a confirmed commit", () => {
    assert.equal(
      shouldNoteOneShotDokaKeepRemount({
        settleKind: "commit",
        walletSeeded: true,
      }),
      false,
    );
  });

  it("does not note explicit applyRewards failed (release)", () => {
    assert.equal(
      shouldNoteOneShotDokaKeepRemount({
        settleKind: "release",
        walletSeeded: true,
      }),
      false,
    );
  });

  it("does not note unseeded keep (#493 already fetches)", () => {
    assert.equal(
      shouldNoteOneShotDokaKeepRemount({
        settleKind: "keep",
        walletSeeded: false,
      }),
      false,
    );
  });
});

describe("shouldRefuseOneShotDokaKeepRemountStaleDoka", () => {
  it("refuses stale Play-entry wallet equal to stamped preDoka", () => {
    assert.equal(
      shouldRefuseOneShotDokaKeepRemountStaleDoka({
        keep: true,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("refuses placeholder 0 below stamped preDoka", () => {
    assert.equal(
      shouldRefuseOneShotDokaKeepRemountStaleDoka({
        keep: true,
        liveDoka: 0,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("does not refuse a fresh pickup wallet 250", () => {
    assert.equal(
      shouldRefuseOneShotDokaKeepRemountStaleDoka({
        keep: true,
        liveDoka: 200 + PICKUP_DOKA,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseOneShotDokaKeepRemountStaleDoka({
        keep: false,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseOneShotDokaKeepRemountStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: 200,
      }),
      true,
    );
  });
});

describe("dokaFromOneShotKeepRemountWallet", () => {
  it("reads a number wallet", () => {
    assert.equal(dokaFromOneShotKeepRemountWallet(250), 250);
  });

  it("reads bigint and #ok wrappers", () => {
    assert.equal(dokaFromOneShotKeepRemountWallet(250n), 250);
    assert.equal(dokaFromOneShotKeepRemountWallet({ ok: 250 }), 250);
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromOneShotKeepRemountWallet(null), null);
    assert.equal(dokaFromOneShotKeepRemountWallet(undefined), null);
    assert.equal(dokaFromOneShotKeepRemountWallet("nope"), null);
  });
});

describe("one-shot keep then remount heal without unpaid death", () => {
  it("leftover remount heal writes Doka 190 over canister 250 (the wipe)", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 seeded. Canister 200.
    // 2. Ground/shrine/dungeon-complete applyRewards(50, 0) invokes then
    //    throws transport. Canister 250. Confirm stale 200. settle keep.
    //    #330 notes unconfirmed on the session lock. No unpaid death.
    // 3. Actor reconnect remounts. New lock Play-entry Doka 200.
    //    Session flag is gone. #742 / #767 / #774 do not stamp.
    // 4. Heal spends 10. writeDoka = committed.doka 200 − 10.
    const remount = remountLock();
    const honourDoka = dokaForOneShotDokaKeepRemountHonour({
      remountDoka: remount.snapshot().doka,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.equal(honourDoka, 200, "ungated remount trusts Play-entry 200");
    const wrote = honourHealWrite(honourDoka ?? 0, 10);
    assert.equal(wrote.doka, 190, "Play-entry honour wiped pickup +50");
  });

  it("does not saveBattleStats-wipe pickup +50 after a gated fresh wallet honour", () => {
    const remount = remountLock();
    const honourDoka = dokaForOneShotDokaKeepRemountHonour({
      remountDoka: remount.snapshot().doka,
      liveDoka: 200 + PICKUP_DOKA,
      keep: true,
      stampedPreDoka: 200,
    });
    assert.equal(honourDoka, 250);
    const wrote = honourHealWrite(honourDoka ?? 0, 10);
    assert.equal(wrote.doka, 240, "pickup +50 survives remount heal");
  });

  it("fail-closes stale Play-entry 200 when the Doka-keep stamp is set", () => {
    assert.equal(
      dokaForOneShotDokaKeepRemountHonour({
        remountDoka: 200,
        liveDoka: 200,
        keep: true,
        stampedPreDoka: 200,
      }),
      null,
    );
  });
});

describe("resolveCommittedDokaAfterOneShotDokaKeepRemount", () => {
  it("returns remount wallet when keep is unset", async () => {
    const remount = remountLock();
    const storage = memStorage();
    const live = await resolveCommittedDokaAfterOneShotDokaKeepRemount(
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
    noteOneShotDokaKeepRemount(storage, 1, {
      settleKind: "keep",
      walletSeeded: true,
      preDoka: 200,
    });
    const live = await resolveCommittedDokaAfterOneShotDokaKeepRemount(
      remount,
      async () => 200 + PICKUP_DOKA,
      storage,
      1,
    );
    assert.equal(live, 250);
    assert.equal(remount.snapshot().doka, 250, "lock adopts replica wallet");
    assert.equal(hasOneShotDokaKeepRemount(storage, 1), false, "stamp cleared");
    const wrote = honourHealWrite(live, 10);
    assert.equal(wrote.doka, 240);
  });

  it("reads bigint wallet from getCallerDokaBalance", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteOneShotDokaKeepRemount(storage, 1, {
      settleKind: "keep",
      walletSeeded: true,
      preDoka: 200,
    });
    const live = await resolveCommittedDokaAfterOneShotDokaKeepRemount(
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
    noteOneShotDokaKeepRemount(storage, 1, {
      settleKind: "keep",
      walletSeeded: true,
      preDoka: 200,
    });
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterOneShotDokaKeepRemount(
          remount,
          async () => 200,
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(remount.snapshot().doka, 200);
    assert.equal(hasOneShotDokaKeepRemount(storage, 1), true);
  });

  it("fail-closes when getCallerDokaBalance throws after keep", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteOneShotDokaKeepRemount(storage, 1, {
      settleKind: "keep",
      walletSeeded: true,
      preDoka: 200,
    });
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterOneShotDokaKeepRemount(
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

describe("persistOneShotDokaThroughOneShotDokaKeepRemount", () => {
  it("stamps remount Doka keep after seeded transport-keep without unpaid death", async () => {
    const storage = memStorage();
    const persist = remountLock();
    let canisterDoka = 200;
    const settle = await persistOneShotDokaThroughOneShotDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      doka: PICKUP_DOKA,
      readWallet: async () => 200,
      actor: {
        applyRewards: async (_slot, doka) => {
          canisterDoka += Number(doka);
          throw new Error("replica went away");
        },
      },
    });
    assert.equal(settle.kind, "keep");
    assert.equal(canisterDoka, 250);
    assert.deepEqual(readOneShotDokaKeepRemount(storage, 1), { preDoka: 200 });
    assert.equal(persist.snapshot().doka, 200, "one-shot commit never ran");
    assert.equal(
      persist.hasUnconfirmedWalletCredit(),
      true,
      "#330 session flag",
    );
  });

  it("does not stamp keep on explicit applyRewards failed", async () => {
    const storage = memStorage();
    const persist = remountLock();
    const settle = await persistOneShotDokaThroughOneShotDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      doka: PICKUP_DOKA,
      readWallet: async () => 200,
      actor: {
        applyRewards: async () => {
          throw new Error("applyRewards failed: over cap");
        },
      },
    });
    assert.equal(settle.kind, "release");
    assert.equal(readOneShotDokaKeepRemount(storage, 1), null);
  });

  it("does not stamp keep on an unseeded lock", async () => {
    const storage = memStorage();
    const persist = createProgressPersist({ doka: 0, xp: 0, level: 1 });
    const settle = await persistOneShotDokaThroughOneShotDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      doka: PICKUP_DOKA,
      readWallet: async () => 5000,
      actor: {
        applyRewards: async () => {
          throw new Error("replica went away");
        },
      },
    });
    assert.equal(settle.kind, "keep");
    assert.equal(hasOneShotDokaKeepRemount(storage, 1), false);
  });

  it("clears a keep stamp on confirmed commit", async () => {
    const storage = memStorage();
    const persist = remountLock();
    noteOneShotDokaKeepRemount(storage, 1, {
      settleKind: "keep",
      walletSeeded: true,
      preDoka: 200,
    });
    const settle = await persistOneShotDokaThroughOneShotDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      doka: PICKUP_DOKA,
      readWallet: async () => 200 + PICKUP_DOKA,
      actor: {
        applyRewards: async () => ({
          ok: { newDoka: 250n, newXp: 100n, newLevel: 4n },
        }),
      },
    });
    assert.equal(settle.kind, "commit");
    assert.equal(hasOneShotDokaKeepRemount(storage, 1), false);
  });

  it("clears a keep stamp explicitly", () => {
    const storage = memStorage();
    noteOneShotDokaKeepRemount(storage, 1, {
      settleKind: "keep",
      walletSeeded: true,
      preDoka: 200,
    });
    assert.equal(hasOneShotDokaKeepRemount(storage, 1), true);
    clearOneShotDokaKeepRemount(storage, 1);
    assert.equal(hasOneShotDokaKeepRemount(storage, 1), false);
  });
});

describe("distinct from victory remount #774, portal XP remount #767, death-cut remount #742", () => {
  it("notes keep with no unpaid pending ( #742 stamps a death-cut lock-move )", () => {
    assert.equal(
      shouldNoteOneShotDokaKeepRemount({
        settleKind: "keep",
        walletSeeded: true,
      }),
      true,
      "this sidecar does not gate on unpaid death pending",
    );
  });

  it("stamps persistDokaCreditResult keep, not victory throw-after-add (#774)", () => {
    assert.equal(
      shouldNoteOneShotDokaKeepRemount({
        settleKind: "keep",
        walletSeeded: true,
      }),
      true,
    );
    assert.equal(
      shouldNoteOneShotDokaKeepRemount({
        settleKind: "release",
        walletSeeded: true,
      }),
      false,
      "explicit applyRewards failed is release, not a victory enqueue catch",
    );
  });

  it("does not use portal +10 XP (dokaDelta 0 — that is #767)", () => {
    assert.equal(
      oneShotPickupIsDokaDelta(PICKUP_DOKA),
      true,
      "shrine/ground/dungeon-complete credits Doka, not portal XP",
    );
    assert.equal(oneShotPickupIsDokaDelta(0), false);
  });

  it("unpaid honour on top of gated pickup wallet still applies 40%", () => {
    const pending = {
      slot: 1,
      preXp: 100,
      preDoka: 200,
      afterXp: 80,
      afterDoka: 120,
    };
    const wrote = applyUnpaidDeathPenaltyToWrite(pending, 100, 240);
    assert.equal(wrote.xp, 80, "unpaid XP 20 on leftover 100");
    assert.equal(wrote.doka, 160, "unpaid 80 on pickup spend snapshot 240");
  });
});

function oneShotPickupIsDokaDelta(dokaDelta: number): boolean {
  return Math.max(0, Math.floor(Number(dokaDelta) || 0)) > 0;
}
