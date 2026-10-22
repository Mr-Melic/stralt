import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  type DeathPenaltyStorage,
  applyUnpaidDeathPenaltyToWrite,
  computeDeathPenalty,
} from "./deathPenalty.ts";
import {
  clearOneShotDokaKeepRemountDeathCut,
  deathPenaltyAfterOneShotDokaKeepRemount,
  dokaForOneShotDokaKeepRemountDeathCut,
  dokaFromOneShotDeathCutWallet,
  hasOneShotDokaKeepRemountDeathCut,
  noteOneShotDokaKeepRemountDeathCut,
  oneShotDokaKeepRemountDeathCutKey,
  persistDeathPenaltyThroughOneShotDokaKeepRemount,
  readOneShotDokaKeepRemountDeathCut,
  resolveCommittedDokaAfterOneShotDokaKeepRemountDeathCut,
  shouldRefuseOneShotDokaKeepRemountDeathCutStaleDoka,
} from "./oneShotDokaKeepRemountDeathCutWriteSkip.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  clampAbsoluteProgressWrite,
  createProgressPersist,
} from "./progressPersist.ts";

/** Typical ground Doka pickup used by #800 (`canister 250`). */
const GROUND_DOKA = 50;
/** Production shrine altar credit in WorldExploration. */
const SHRINE_ALTAR_DOKA = 300;
/** Depth-3 dungeon-complete bonus (`maxDepth * 50`). */
const DUNGEON_COMPLETE_DOKA = 150;

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

describe("shouldRefuseOneShotDokaKeepRemountDeathCutStaleDoka", () => {
  it("refuses stale Play-entry wallet equal to stamped preDoka", () => {
    assert.equal(
      shouldRefuseOneShotDokaKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("refuses placeholder 0 below stamped preDoka", () => {
    assert.equal(
      shouldRefuseOneShotDokaKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 0,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("does not refuse a fresh ground pickup wallet 250", () => {
    assert.equal(
      shouldRefuseOneShotDokaKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 200 + GROUND_DOKA,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("does not refuse a fresh shrine altar wallet 500", () => {
    assert.equal(
      shouldRefuseOneShotDokaKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 200 + SHRINE_ALTAR_DOKA,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseOneShotDokaKeepRemountDeathCutStaleDoka({
        keep: false,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseOneShotDokaKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: 200,
      }),
      true,
    );
  });
});

describe("dokaFromOneShotDeathCutWallet", () => {
  it("reads a number wallet", () => {
    assert.equal(dokaFromOneShotDeathCutWallet(250), 250);
  });

  it("reads bigint and #ok wrappers", () => {
    assert.equal(dokaFromOneShotDeathCutWallet(250n), 250);
    assert.equal(dokaFromOneShotDeathCutWallet({ ok: 250 }), 250);
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromOneShotDeathCutWallet(null), null);
    assert.equal(dokaFromOneShotDeathCutWallet(undefined), null);
    assert.equal(dokaFromOneShotDeathCutWallet("nope"), null);
  });
});

describe("one-shot keep then remount death without unpaid death", () => {
  it("leftover remount death writes Doka 120 over canister 250 (the wipe)", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 seeded. Canister 200.
    // 2. Ground applyRewards(50, 0) invokes then throws. Settle keep.
    //    Canister 250. Commit never runs. No unpaid death pending.
    //    #800 stamps keep for remount heal.
    // 3. Actor reconnect remounts. New lock Play-entry Doka 200.
    // 4. Lava death persistDeathPenalty uses committed.doka 200.
    //    computeDeathPenalty → 120. saveBattleStats writes 120 over 250.
    const remount = remountLock();
    const after = deathPenaltyAfterOneShotDokaKeepRemount({
      xp: remount.snapshot().xp,
      remountDoka: remount.snapshot().doka,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.equal(after?.newDoka, 120, "ungated remount death taxes 200");
    assert.equal(after?.newXp, 80);
    assert.notEqual(after?.newDoka, 150, "must not tax replica 250");
  });

  it("does not saveBattleStats-wipe ground +50 after a gated fresh death cut", () => {
    const remount = remountLock();
    const after = deathPenaltyAfterOneShotDokaKeepRemount({
      xp: remount.snapshot().xp,
      remountDoka: remount.snapshot().doka,
      liveDoka: 200 + GROUND_DOKA,
      keep: true,
      stampedPreDoka: 200,
    });
    assert.equal(after?.newDoka, 150, "40% of pickup wallet 250");
    assert.equal(after?.dokaLost, 100);
    assert.equal(after?.newXp, 80);
    assert.notEqual(after?.newDoka, 120, "must not cut Play-entry 200");
  });

  it("does not saveBattleStats-wipe shrine +300 after a gated fresh death cut", () => {
    const after = deathPenaltyAfterOneShotDokaKeepRemount({
      xp: 100,
      remountDoka: 200,
      liveDoka: 200 + SHRINE_ALTAR_DOKA,
      keep: true,
      stampedPreDoka: 200,
    });
    assert.equal(after?.newDoka, 300, "40% of shrine wallet 500");
    assert.equal(after?.dokaLost, 200);
    assert.notEqual(after?.newDoka, 150, "must not use victory +50 math");
    assert.notEqual(after?.newDoka, 120);
  });

  it("does not saveBattleStats-wipe dungeon-complete +150 after a gated fresh death cut", () => {
    const after = deathPenaltyAfterOneShotDokaKeepRemount({
      xp: 100,
      remountDoka: 200,
      liveDoka: 200 + DUNGEON_COMPLETE_DOKA,
      keep: true,
      stampedPreDoka: 200,
    });
    assert.equal(after?.newDoka, 210, "40% of dungeon-complete wallet 350");
    assert.equal(after?.dokaLost, 140);
    assert.notEqual(after?.newDoka, 150);
    assert.notEqual(after?.newDoka, 120);
  });

  it("fail-closes stale Play-entry 200 when the Doka-keep stamp is set", () => {
    assert.equal(
      deathPenaltyAfterOneShotDokaKeepRemount({
        xp: 100,
        remountDoka: 200,
        liveDoka: 200,
        keep: true,
        stampedPreDoka: 200,
      }),
      null,
    );
    assert.equal(
      dokaForOneShotDokaKeepRemountDeathCut({
        remountDoka: 200,
        liveDoka: 200,
        keep: true,
        stampedPreDoka: 200,
      }),
      null,
    );
  });

  it("pickup-only remount (no stamp) still cuts 200 → 120", () => {
    const after = deathPenaltyAfterOneShotDokaKeepRemount({
      xp: 100,
      remountDoka: 200,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.deepEqual(after, computeDeathPenalty(100, 200));
    assert.equal(after?.newDoka, 120);
  });

  it("#800 remount heal spends 10 from 250; death is 40% of 250 not that spend", () => {
    const heal = honourHealWrite(250, 10);
    assert.equal(heal.doka, 240, "#800 gated heal path");
    const death = computeDeathPenalty(100, 250);
    assert.equal(death.newDoka, 150);
    assert.notEqual(death.newDoka, heal.doka);
  });
});

describe("resolveCommittedDokaAfterOneShotDokaKeepRemountDeathCut", () => {
  it("returns remount wallet when keep is unset", async () => {
    const remount = remountLock();
    const storage = memStorage();
    const live = await resolveCommittedDokaAfterOneShotDokaKeepRemountDeathCut(
      remount,
      async () => 250,
      storage,
      1,
    );
    assert.equal(live, 200);
  });

  it("fetches replica wallet when the Doka-keep stamp is set", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteOneShotDokaKeepRemountDeathCut(storage, 1, 200);
    const live = await resolveCommittedDokaAfterOneShotDokaKeepRemountDeathCut(
      persist,
      async () => 200 + GROUND_DOKA,
      storage,
      1,
    );
    assert.equal(live, 250);
    assert.equal(persist.snapshot().doka, 250, "lock adopts replica wallet");
    assert.equal(
      hasOneShotDokaKeepRemountDeathCut(storage, 1),
      false,
      "stamp cleared so a later heal cannot recut Play-entry",
    );
    const after = computeDeathPenalty(persist.snapshot().xp, live);
    assert.equal(after.newDoka, 150);
  });

  it("reads bigint shrine wallet from getCallerDokaBalance", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteOneShotDokaKeepRemountDeathCut(storage, 1, 200);
    const live = await resolveCommittedDokaAfterOneShotDokaKeepRemountDeathCut(
      persist,
      async () => 500n,
      storage,
      1,
    );
    assert.equal(live, 500);
    const after = computeDeathPenalty(persist.snapshot().xp, live);
    assert.equal(after.newDoka, 300);
  });

  it("fail-closes when getCallerDokaBalance returns Play-entry wallet after keep", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteOneShotDokaKeepRemountDeathCut(storage, 1, 200);
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterOneShotDokaKeepRemountDeathCut(
          persist,
          async () => 200,
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(persist.snapshot().doka, 200);
    assert.equal(hasOneShotDokaKeepRemountDeathCut(storage, 1), true);
  });

  it("fail-closes when getCallerDokaBalance throws after keep", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteOneShotDokaKeepRemountDeathCut(storage, 1, 200);
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterOneShotDokaKeepRemountDeathCut(
          persist,
          async () => {
            throw new Error("replica unavailable");
          },
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(hasOneShotDokaKeepRemountDeathCut(storage, 1), true);
  });
});

describe("persistDeathPenaltyThroughOneShotDokaKeepRemount", () => {
  it("leftover remount death enqueue writes 120 when keep is unset", async () => {
    const persist = remountLock();
    const storage = memStorage();
    let wroteDoka = 0;
    await persistDeathPenaltyThroughOneShotDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => 250,
      applyAndCommit: async (after) => {
        wroteDoka = after.newDoka;
        persist.commit({ doka: after.newDoka, xp: after.newXp });
        return after;
      },
    });
    assert.equal(wroteDoka, 120, "ungated death taxes remount 200");
    assert.equal(persist.snapshot().doka, 120);
  });

  it("does not saveBattleStats-wipe ground +50 after a gated death persist", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteOneShotDokaKeepRemountDeathCut(storage, 1, 200);
    let canisterDoka = 250;
    const after = await persistDeathPenaltyThroughOneShotDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => 250,
      applyAndCommit: async (cut) => {
        canisterDoka = cut.newDoka;
        persist.commit({ doka: cut.newDoka, xp: cut.newXp });
        return cut;
      },
    });
    assert.equal(after.newDoka, 150);
    assert.equal(canisterDoka, 150, "40% of replica 250");
    assert.equal(persist.snapshot().doka, 150);
    assert.equal(hasOneShotDokaKeepRemountDeathCut(storage, 1), false);
  });

  it("does not saveBattleStats-wipe shrine +300 after a gated death persist", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteOneShotDokaKeepRemountDeathCut(storage, 1, 200);
    const after = await persistDeathPenaltyThroughOneShotDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => 200 + SHRINE_ALTAR_DOKA,
      applyAndCommit: async (cut) => {
        persist.commit({ doka: cut.newDoka, xp: cut.newXp });
        return cut;
      },
    });
    assert.equal(after.newDoka, 300, "40% of shrine replica 500");
    assert.equal(persist.snapshot().doka, 300);
  });

  it("skips beforeEach so unpaid flush cannot recut the death job", async () => {
    let flushed = 0;
    const persist = createProgressPersist(
      { doka: 200, xp: 100, level: 4 },
      {
        beforeEach: async () => {
          flushed += 1;
        },
      },
    );
    const storage = memStorage();
    noteOneShotDokaKeepRemountDeathCut(storage, 1, 200);
    await persistDeathPenaltyThroughOneShotDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => 250,
      applyAndCommit: async (after) => after,
    });
    assert.equal(flushed, 0);
  });

  it("fail-closes gated death persist when replica still looks like Play-entry", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteOneShotDokaKeepRemountDeathCut(storage, 1, 200);
    let wrote = false;
    await assert.rejects(
      () =>
        persistDeathPenaltyThroughOneShotDokaKeepRemount({
          persist,
          storage,
          slot: 1,
          readWallet: async () => 200,
          applyAndCommit: async (after) => {
            wrote = true;
            persist.commit({ doka: after.newDoka });
            return after;
          },
        }),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(wrote, false);
    assert.equal(
      persist.snapshot().doka,
      200,
      "catch must not commit 120 here",
    );
    assert.equal(hasOneShotDokaKeepRemountDeathCut(storage, 1), true);
  });

  it("clears a keep stamp explicitly", () => {
    const storage = memStorage();
    noteOneShotDokaKeepRemountDeathCut(storage, 1, 200);
    assert.equal(hasOneShotDokaKeepRemountDeathCut(storage, 1), true);
    clearOneShotDokaKeepRemountDeathCut(storage, 1);
    assert.equal(hasOneShotDokaKeepRemountDeathCut(storage, 1), false);
  });
});

describe("distinct from one-shot remount heal #800, victory death #869, Boss Rush death #866, death-cut remount #742", () => {
  it("reads the #800 stamp key, not a second death-cut key", () => {
    const storage = memStorage();
    noteOneShotDokaKeepRemountDeathCut(storage, 1, 200);
    assert.equal(
      oneShotDokaKeepRemountDeathCutKey(1),
      "pbv_oneshot_doka_keep_remount_slot1",
    );
    assert.equal(
      storage.getItem("pbv_oneshot_doka_keep_remount_slot1") != null,
      true,
    );
    assert.deepEqual(readOneShotDokaKeepRemountDeathCut(storage, 1), {
      preDoka: 200,
    });
    assert.equal(
      storage.getItem("pbv_victory_doka_keep_remount_slot1"),
      null,
      "#869 victory remount key stays empty",
    );
    assert.equal(
      storage.getItem("pbv_boss_rush_doka_keep_remount_slot1"),
      null,
      "#866 Boss Rush remount key stays empty",
    );
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot1"), null);
    assert.equal(
      storage.getItem("pbv_death_cut_credit_replay_remount_slot1"),
      null,
      "#742 death-cut remount key stays empty",
    );
  });

  it("does not extra-skip when keep is unset (death-fail without a later credit)", () => {
    const after = deathPenaltyAfterOneShotDokaKeepRemount({
      xp: 100,
      remountDoka: 200,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.equal(after?.newDoka, 120);
  });

  it("unpaid honour on top of gated one-shot death cut still applies 40%", () => {
    const pending = {
      slot: 1,
      preXp: 100,
      preDoka: 200,
      afterXp: 80,
      afterDoka: 120,
    };
    const wrote = applyUnpaidDeathPenaltyToWrite(pending, 80, 150);
    assert.equal(wrote.xp, 80, "XP already at unpaid after");
    assert.equal(wrote.doka, 70, "unpaid 80 on gated death snapshot 150");
  });

  it("does not treat #800 heal spend 240 as this death-cut path", () => {
    const heal = honourHealWrite(250, 10);
    const death = computeDeathPenalty(100, 250);
    assert.equal(heal.doka, 240);
    assert.equal(death.newDoka, 150);
    assert.equal(heal.doka > death.newDoka, true);
  });
});
