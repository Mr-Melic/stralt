import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { creditAchievementRewardThroughPersist } from "./achievementReward.ts";
import {
  type DeathPenaltyStorage,
  applyUnpaidDeathPenaltyToWrite,
} from "./deathPenalty.ts";
import {
  clearFeatDokaKeepRemount,
  dokaForFeatDokaKeepRemountHonour,
  dokaFromFeatKeepRemountWallet,
  hasFeatDokaKeepRemount,
  noteFeatDokaKeepRemount,
  persistFeatThroughFeatDokaKeepRemount,
  readFeatDokaKeepRemount,
  resolveCommittedDokaAfterFeatDokaKeepRemount,
  shouldNoteFeatDokaKeepRemount,
  shouldRefuseFeatDokaKeepRemountStaleDoka,
} from "./featDokaKeepRemountWriteSkip.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  clampAbsoluteProgressWrite,
  createProgressPersist,
} from "./progressPersist.ts";

/** Catalog first_blood / typical feat claim. Distinct from GameKey +1000 (#811). */
const FEAT_DOKA = 500;

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

describe("shouldNoteFeatDokaKeepRemount", () => {
  it("notes transport-keep after claim without unpaid death", () => {
    assert.equal(
      shouldNoteFeatDokaKeepRemount(new Error("replica went away")),
      true,
    );
  });

  it("does not note explicit claimAchievementReward failed", () => {
    assert.equal(
      shouldNoteFeatDokaKeepRemount(
        new Error("claimAchievementReward failed: Account banned"),
      ),
      false,
    );
  });

  it("does not note already claimed / not unlocked / unknown", () => {
    assert.equal(
      shouldNoteFeatDokaKeepRemount(new Error("Reward already claimed")),
      false,
    );
    assert.equal(
      shouldNoteFeatDokaKeepRemount(new Error("Achievement not yet unlocked")),
      false,
    );
    assert.equal(
      shouldNoteFeatDokaKeepRemount(
        new Error("Unknown achievement: first_blood"),
      ),
      false,
    );
  });

  it("does not note applyRewards failed (that is #774 / #800)", () => {
    assert.equal(
      shouldNoteFeatDokaKeepRemount(new Error("applyRewards failed: over cap")),
      false,
    );
  });

  it("does not note GameKey already used (that is #811)", () => {
    assert.equal(
      shouldNoteFeatDokaKeepRemount(new Error("GameKey already used")),
      false,
    );
  });
});

describe("shouldRefuseFeatDokaKeepRemountStaleDoka", () => {
  it("refuses stale Play-entry wallet equal to stamped preDoka", () => {
    assert.equal(
      shouldRefuseFeatDokaKeepRemountStaleDoka({
        keep: true,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("refuses placeholder 0 below stamped preDoka", () => {
    assert.equal(
      shouldRefuseFeatDokaKeepRemountStaleDoka({
        keep: true,
        liveDoka: 0,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("does not refuse a fresh feat wallet 700", () => {
    assert.equal(
      shouldRefuseFeatDokaKeepRemountStaleDoka({
        keep: true,
        liveDoka: 200 + FEAT_DOKA,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseFeatDokaKeepRemountStaleDoka({
        keep: false,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseFeatDokaKeepRemountStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: 200,
      }),
      true,
    );
  });
});

describe("dokaFromFeatKeepRemountWallet", () => {
  it("reads a number wallet", () => {
    assert.equal(dokaFromFeatKeepRemountWallet(700), 700);
  });

  it("reads bigint and #ok wrappers", () => {
    assert.equal(dokaFromFeatKeepRemountWallet(700n), 700);
    assert.equal(dokaFromFeatKeepRemountWallet({ ok: 700 }), 700);
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromFeatKeepRemountWallet(null), null);
    assert.equal(dokaFromFeatKeepRemountWallet(undefined), null);
    assert.equal(dokaFromFeatKeepRemountWallet("nope"), null);
  });
});

describe("feat throw-after-add then remount heal without unpaid death", () => {
  it("leftover remount heal writes Doka 190 over canister 700 (the wipe)", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 seeded. Canister 200.
    // 2. claimAchievementReward adds 500 then throws. Canister 700.
    //    Commit never runs. No unpaid death pending. HUD stays 200.
    // 3. Actor reconnect remounts. New lock Play-entry Doka 200.
    //    #545 / #552 session flags are gone. #774 / #800 / #811 do not
    //    stamp claimAchievementReward.
    // 4. Heal spends 10. writeDoka = committed.doka 200 − 10.
    const remount = remountLock();
    const honourDoka = dokaForFeatDokaKeepRemountHonour({
      remountDoka: remount.snapshot().doka,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.equal(honourDoka, 200, "ungated remount trusts Play-entry 200");
    const wrote = honourHealWrite(honourDoka ?? 0, 10);
    assert.equal(wrote.doka, 190, "Play-entry honour wiped feat +500");
  });

  it("does not saveBattleStats-wipe feat +500 after a gated fresh wallet honour", () => {
    const remount = remountLock();
    const honourDoka = dokaForFeatDokaKeepRemountHonour({
      remountDoka: remount.snapshot().doka,
      liveDoka: 200 + FEAT_DOKA,
      keep: true,
      stampedPreDoka: 200,
    });
    assert.equal(honourDoka, 700);
    const wrote = honourHealWrite(honourDoka ?? 0, 10);
    assert.equal(wrote.doka, 690, "feat +500 survives remount heal");
  });

  it("fail-closes stale Play-entry 200 when the Doka-keep stamp is set", () => {
    assert.equal(
      dokaForFeatDokaKeepRemountHonour({
        remountDoka: 200,
        liveDoka: 200,
        keep: true,
        stampedPreDoka: 200,
      }),
      null,
    );
  });
});

describe("resolveCommittedDokaAfterFeatDokaKeepRemount", () => {
  it("returns remount wallet when keep is unset", async () => {
    const remount = remountLock();
    const storage = memStorage();
    const live = await resolveCommittedDokaAfterFeatDokaKeepRemount(
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
    noteFeatDokaKeepRemount(storage, 1, {
      error: new Error("replica went away"),
      preDoka: 200,
    });
    const live = await resolveCommittedDokaAfterFeatDokaKeepRemount(
      remount,
      async () => 200 + FEAT_DOKA,
      storage,
      1,
    );
    assert.equal(live, 700);
    assert.equal(remount.snapshot().doka, 700, "lock adopts replica wallet");
    assert.equal(hasFeatDokaKeepRemount(storage, 1), false, "stamp cleared");
    const wrote = honourHealWrite(live, 10);
    assert.equal(wrote.doka, 690);
  });

  it("reads bigint wallet from getCallerDokaBalance", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteFeatDokaKeepRemount(storage, 1, {
      error: new Error("replica went away"),
      preDoka: 200,
    });
    const live = await resolveCommittedDokaAfterFeatDokaKeepRemount(
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
    noteFeatDokaKeepRemount(storage, 1, {
      error: new Error("replica went away"),
      preDoka: 200,
    });
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterFeatDokaKeepRemount(
          remount,
          async () => 200,
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(remount.snapshot().doka, 200);
    assert.equal(hasFeatDokaKeepRemount(storage, 1), true);
  });

  it("fail-closes when getCallerDokaBalance throws after keep", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteFeatDokaKeepRemount(storage, 1, {
      error: new Error("replica went away"),
      preDoka: 200,
    });
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterFeatDokaKeepRemount(
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

describe("persistFeatThroughFeatDokaKeepRemount", () => {
  it("stamps remount Doka keep after feat throw-after-add without unpaid death", async () => {
    const storage = memStorage();
    const persist = remountLock();
    let canisterDoka = 200;
    await assert.rejects(
      () =>
        persistFeatThroughFeatDokaKeepRemount({
          persist,
          storage,
          slot: 1,
          claimAndCommit: async () => {
            canisterDoka += FEAT_DOKA;
            throw new Error("replica went away");
          },
        }),
      /replica went away/,
    );
    assert.equal(canisterDoka, 700);
    assert.deepEqual(readFeatDokaKeepRemount(storage, 1), { preDoka: 200 });
    assert.equal(persist.snapshot().doka, 200, "feat commit never ran");
  });

  it("does not stamp keep on explicit Reward already claimed", async () => {
    const storage = memStorage();
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistFeatThroughFeatDokaKeepRemount({
          persist,
          storage,
          slot: 1,
          claimAndCommit: async () => {
            throw new Error("Reward already claimed");
          },
        }),
      /already claimed/,
    );
    assert.equal(readFeatDokaKeepRemount(storage, 1), null);
  });

  it("does not stamp parsed #err from creditAchievementRewardThroughPersist", async () => {
    const storage = memStorage();
    const persist = remountLock();
    const parsed = await persistFeatThroughFeatDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      claimAndCommit: () =>
        creditAchievementRewardThroughPersist(
          {
            claimAchievementReward: async () => ({
              __kind__: "err",
              err: "Reward already claimed",
            }),
          },
          persist,
          "first_blood",
        ),
    });
    assert.deepEqual(parsed, { err: "Reward already claimed" });
    assert.equal(readFeatDokaKeepRemount(storage, 1), null);
    assert.equal(persist.snapshot().doka, 200);
  });

  it("notes unconfirmed from creditAchievementRewardThroughPersist throw inside the wrap", async () => {
    const storage = memStorage();
    const persist = remountLock();
    let canisterDoka = 200;
    await assert.rejects(
      persistFeatThroughFeatDokaKeepRemount({
        persist,
        storage,
        slot: 1,
        claimAndCommit: () =>
          creditAchievementRewardThroughPersist(
            {
              claimAchievementReward: async () => {
                canisterDoka += FEAT_DOKA;
                throw new Error("replica reject after add");
              },
            },
            persist,
            "first_blood",
          ),
      }),
      /replica reject after add/,
    );
    assert.equal(canisterDoka, 700);
    assert.equal(persist.snapshot().doka, 200, "lock leftover stays pre-claim");
    assert.deepEqual(readFeatDokaKeepRemount(storage, 1), { preDoka: 200 });
  });

  it("clears a keep stamp explicitly", () => {
    const storage = memStorage();
    noteFeatDokaKeepRemount(storage, 1, {
      error: new Error("replica went away"),
      preDoka: 200,
    });
    assert.equal(hasFeatDokaKeepRemount(storage, 1), true);
    clearFeatDokaKeepRemount(storage, 1);
    assert.equal(hasFeatDokaKeepRemount(storage, 1), false);
  });
});

describe("distinct from GameKey remount #811, victory Doka #774, one-shot #800, session #545/#552", () => {
  it("notes keep with no unpaid pending ( #742 stamps a death-cut lock-move )", () => {
    assert.equal(
      shouldNoteFeatDokaKeepRemount(new Error("replica went away")),
      true,
      "this sidecar does not gate on unpaid death pending",
    );
  });

  it("does not note applyRewards failed (victory / one-shot credit paths)", () => {
    assert.equal(
      shouldNoteFeatDokaKeepRemount(new Error("applyRewards failed: over cap")),
      false,
    );
  });

  it("uses pbv_feat_doka_keep_remount_slotN, not GameKey or victory keys", () => {
    const storage = memStorage();
    noteFeatDokaKeepRemount(storage, 2, {
      error: new Error("replica went away"),
      preDoka: 200,
    });
    assert.equal(
      storage.getItem("pbv_feat_doka_keep_remount_slot2") != null,
      true,
    );
    assert.equal(storage.getItem("pbv_gamekey_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_victory_doka_keep_remount_slot2"), null);
  });

  it("unpaid honour on top of gated feat wallet still applies 40%", () => {
    const pending = {
      slot: 1,
      preXp: 100,
      preDoka: 200,
      afterXp: 80,
      afterDoka: 120,
    };
    const wrote = applyUnpaidDeathPenaltyToWrite(pending, 100, 690);
    assert.equal(wrote.xp, 80, "unpaid XP 20 on leftover 100");
    assert.equal(wrote.doka, 610, "unpaid 80 on feat spend snapshot 690");
  });
});
