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
import {
  clearVictoryDokaKeepRemountDeathCut,
  deathPenaltyAfterVictoryDokaKeepRemount,
  dokaForVictoryDokaKeepRemountDeathCut,
  dokaFromVictoryDeathCutWallet,
  hasVictoryDokaKeepRemountDeathCut,
  noteVictoryDokaKeepRemountDeathCut,
  persistDeathPenaltyThroughVictoryDokaKeepRemount,
  readVictoryDokaKeepRemountDeathCut,
  resolveCommittedDokaAfterVictoryDokaKeepRemountDeathCut,
  shouldRefuseVictoryDokaKeepRemountDeathCutStaleDoka,
  victoryDokaKeepRemountDeathCutKey,
} from "./victoryDokaKeepRemountDeathCutWriteSkip.ts";

/** Typical overworld victory grant used by #774 (`dokaEarned` 50). */
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

describe("shouldRefuseVictoryDokaKeepRemountDeathCutStaleDoka", () => {
  it("refuses stale Play-entry wallet equal to stamped preDoka", () => {
    assert.equal(
      shouldRefuseVictoryDokaKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("refuses placeholder 0 below stamped preDoka", () => {
    assert.equal(
      shouldRefuseVictoryDokaKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 0,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("does not refuse a fresh victory wallet 250", () => {
    assert.equal(
      shouldRefuseVictoryDokaKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 200 + VICTORY_DOKA,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseVictoryDokaKeepRemountDeathCutStaleDoka({
        keep: false,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseVictoryDokaKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: 200,
      }),
      true,
    );
  });
});

describe("dokaFromVictoryDeathCutWallet", () => {
  it("reads a number wallet", () => {
    assert.equal(dokaFromVictoryDeathCutWallet(250), 250);
  });

  it("reads bigint and #ok wrappers", () => {
    assert.equal(dokaFromVictoryDeathCutWallet(250n), 250);
    assert.equal(dokaFromVictoryDeathCutWallet({ ok: 250 }), 250);
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromVictoryDeathCutWallet(null), null);
    assert.equal(dokaFromVictoryDeathCutWallet(undefined), null);
    assert.equal(dokaFromVictoryDeathCutWallet("nope"), null);
  });
});

describe("victory throw-after-add then remount death without unpaid death", () => {
  it("leftover remount death writes Doka 120 over canister 250 (the wipe)", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 seeded. Canister 200.
    // 2. Victory applyRewards(50, xp) invokes then throws.
    //    Canister 250. Commit never runs. No unpaid death pending.
    //    #774 stamps keep for remount heal.
    // 3. Actor reconnect remounts. New lock Play-entry Doka 200.
    // 4. Lava death persistDeathPenalty uses committed.doka 200.
    //    computeDeathPenalty → 120. saveBattleStats writes 120 over 250.
    const remount = remountLock();
    const after = deathPenaltyAfterVictoryDokaKeepRemount({
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

  it("does not saveBattleStats-wipe victory +50 after a gated fresh death cut", () => {
    const remount = remountLock();
    const after = deathPenaltyAfterVictoryDokaKeepRemount({
      xp: remount.snapshot().xp,
      remountDoka: remount.snapshot().doka,
      liveDoka: 200 + VICTORY_DOKA,
      keep: true,
      stampedPreDoka: 200,
    });
    assert.equal(after?.newDoka, 150, "40% of victory wallet 250");
    assert.equal(after?.dokaLost, 100);
    assert.equal(after?.newXp, 80);
    assert.notEqual(after?.newDoka, 120, "must not cut Play-entry 200");
  });

  it("fail-closes stale Play-entry 200 when the Doka-keep stamp is set", () => {
    assert.equal(
      deathPenaltyAfterVictoryDokaKeepRemount({
        xp: 100,
        remountDoka: 200,
        liveDoka: 200,
        keep: true,
        stampedPreDoka: 200,
      }),
      null,
    );
    assert.equal(
      dokaForVictoryDokaKeepRemountDeathCut({
        remountDoka: 200,
        liveDoka: 200,
        keep: true,
        stampedPreDoka: 200,
      }),
      null,
    );
  });

  it("pickup-only remount (no stamp) still cuts 200 → 120", () => {
    const after = deathPenaltyAfterVictoryDokaKeepRemount({
      xp: 100,
      remountDoka: 200,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.deepEqual(after, computeDeathPenalty(100, 200));
    assert.equal(after?.newDoka, 120);
  });

  it("#774 remount heal spends 10 from 250; death is 40% of 250 not that spend", () => {
    const heal = honourHealWrite(250, 10);
    assert.equal(heal.doka, 240, "#774 gated heal path");
    const death = computeDeathPenalty(100, 250);
    assert.equal(death.newDoka, 150);
    assert.notEqual(death.newDoka, heal.doka);
  });
});

describe("resolveCommittedDokaAfterVictoryDokaKeepRemountDeathCut", () => {
  it("returns remount wallet when keep is unset", async () => {
    const remount = remountLock();
    const storage = memStorage();
    const live = await resolveCommittedDokaAfterVictoryDokaKeepRemountDeathCut(
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
    noteVictoryDokaKeepRemountDeathCut(storage, 1, 200);
    const live = await resolveCommittedDokaAfterVictoryDokaKeepRemountDeathCut(
      persist,
      async () => 200 + VICTORY_DOKA,
      storage,
      1,
    );
    assert.equal(live, 250);
    assert.equal(persist.snapshot().doka, 250, "lock adopts replica wallet");
    assert.equal(
      hasVictoryDokaKeepRemountDeathCut(storage, 1),
      false,
      "stamp cleared so a later heal cannot recut Play-entry",
    );
    const after = computeDeathPenalty(persist.snapshot().xp, live);
    assert.equal(after.newDoka, 150);
  });

  it("reads bigint wallet from getCallerDokaBalance", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteVictoryDokaKeepRemountDeathCut(storage, 1, 200);
    const live = await resolveCommittedDokaAfterVictoryDokaKeepRemountDeathCut(
      persist,
      async () => 250n,
      storage,
      1,
    );
    assert.equal(live, 250);
  });

  it("fail-closes when getCallerDokaBalance returns Play-entry wallet after keep", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteVictoryDokaKeepRemountDeathCut(storage, 1, 200);
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterVictoryDokaKeepRemountDeathCut(
          persist,
          async () => 200,
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(persist.snapshot().doka, 200);
    assert.equal(hasVictoryDokaKeepRemountDeathCut(storage, 1), true);
  });

  it("fail-closes when getCallerDokaBalance throws after keep", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteVictoryDokaKeepRemountDeathCut(storage, 1, 200);
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterVictoryDokaKeepRemountDeathCut(
          persist,
          async () => {
            throw new Error("replica unavailable");
          },
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(hasVictoryDokaKeepRemountDeathCut(storage, 1), true);
  });
});

describe("persistDeathPenaltyThroughVictoryDokaKeepRemount", () => {
  it("leftover remount death enqueue writes 120 when keep is unset", async () => {
    const persist = remountLock();
    const storage = memStorage();
    let wroteDoka = 0;
    await persistDeathPenaltyThroughVictoryDokaKeepRemount({
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

  it("does not saveBattleStats-wipe victory +50 after a gated death persist", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteVictoryDokaKeepRemountDeathCut(storage, 1, 200);
    let canisterDoka = 250;
    const after = await persistDeathPenaltyThroughVictoryDokaKeepRemount({
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
    assert.equal(hasVictoryDokaKeepRemountDeathCut(storage, 1), false);
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
    noteVictoryDokaKeepRemountDeathCut(storage, 1, 200);
    await persistDeathPenaltyThroughVictoryDokaKeepRemount({
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
    noteVictoryDokaKeepRemountDeathCut(storage, 1, 200);
    let wrote = false;
    await assert.rejects(
      () =>
        persistDeathPenaltyThroughVictoryDokaKeepRemount({
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
    assert.equal(hasVictoryDokaKeepRemountDeathCut(storage, 1), true);
  });

  it("clears a keep stamp explicitly", () => {
    const storage = memStorage();
    noteVictoryDokaKeepRemountDeathCut(storage, 1, 200);
    assert.equal(hasVictoryDokaKeepRemountDeathCut(storage, 1), true);
    clearVictoryDokaKeepRemountDeathCut(storage, 1);
    assert.equal(hasVictoryDokaKeepRemountDeathCut(storage, 1), false);
  });
});

describe("distinct from victory remount heal #774, Boss Rush death #866, death-cut remount #742", () => {
  it("reads the #774 stamp key, not a second death-cut key", () => {
    const storage = memStorage();
    noteVictoryDokaKeepRemountDeathCut(storage, 1, 200);
    assert.equal(
      victoryDokaKeepRemountDeathCutKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    assert.equal(
      storage.getItem("pbv_victory_doka_keep_remount_slot1") != null,
      true,
    );
    assert.deepEqual(readVictoryDokaKeepRemountDeathCut(storage, 1), {
      preDoka: 200,
    });
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
    const after = deathPenaltyAfterVictoryDokaKeepRemount({
      xp: 100,
      remountDoka: 200,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.equal(after?.newDoka, 120);
  });

  it("unpaid honour on top of gated victory death cut still applies 40%", () => {
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

  it("does not treat #774 heal spend 240 as this death-cut path", () => {
    const heal = honourHealWrite(250, 10);
    const death = computeDeathPenalty(100, 250);
    assert.equal(heal.doka, 240);
    assert.equal(death.newDoka, 150);
    assert.equal(heal.doka > death.newDoka, true);
  });
});
