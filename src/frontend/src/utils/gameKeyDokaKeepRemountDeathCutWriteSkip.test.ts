import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  type DeathPenaltyStorage,
  applyUnpaidDeathPenaltyToWrite,
  computeDeathPenalty,
} from "./deathPenalty.ts";
import {
  clearGameKeyDokaKeepRemountDeathCut,
  deathPenaltyAfterGameKeyDokaKeepRemount,
  dokaForGameKeyDokaKeepRemountDeathCut,
  dokaFromGameKeyDeathCutWallet,
  gameKeyDokaKeepRemountDeathCutKey,
  hasGameKeyDokaKeepRemountDeathCut,
  noteGameKeyDokaKeepRemountDeathCut,
  persistDeathPenaltyThroughGameKeyDokaKeepRemount,
  readGameKeyDokaKeepRemountDeathCut,
  resolveCommittedDokaAfterGameKeyDokaKeepRemountDeathCut,
  shouldRefuseGameKeyDokaKeepRemountDeathCutStaleDoka,
} from "./gameKeyDokaKeepRemountDeathCutWriteSkip.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  clampAbsoluteProgressWrite,
  createProgressPersist,
} from "./progressPersist.ts";

/** Typical paid GameKey grant used by #811 (`#ok(1000)`). */
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

describe("shouldRefuseGameKeyDokaKeepRemountDeathCutStaleDoka", () => {
  it("refuses stale Play-entry wallet equal to stamped preDoka", () => {
    assert.equal(
      shouldRefuseGameKeyDokaKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("refuses placeholder 0 below stamped preDoka", () => {
    assert.equal(
      shouldRefuseGameKeyDokaKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 0,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("does not refuse a fresh GameKey wallet 1200", () => {
    assert.equal(
      shouldRefuseGameKeyDokaKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 200 + GAMEKEY_DOKA,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseGameKeyDokaKeepRemountDeathCutStaleDoka({
        keep: false,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseGameKeyDokaKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: 200,
      }),
      true,
    );
  });
});

describe("dokaFromGameKeyDeathCutWallet", () => {
  it("reads a number wallet", () => {
    assert.equal(dokaFromGameKeyDeathCutWallet(1200), 1200);
  });

  it("reads bigint and #ok wrappers", () => {
    assert.equal(dokaFromGameKeyDeathCutWallet(1200n), 1200);
    assert.equal(dokaFromGameKeyDeathCutWallet({ ok: 1200 }), 1200);
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromGameKeyDeathCutWallet(null), null);
    assert.equal(dokaFromGameKeyDeathCutWallet(undefined), null);
    assert.equal(dokaFromGameKeyDeathCutWallet("nope"), null);
  });
});

describe("GameKey throw-after-add then remount death without unpaid death", () => {
  it("leftover remount death writes Doka 120 over canister 1200 (the wipe)", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 seeded. Canister 200.
    // 2. redeemGameKey adds 1000 then throws. Canister 1200. Commit
    //    never runs. No unpaid death pending. #811 stamps keep for
    //    remount heal.
    // 3. Actor reconnect remounts. New lock Play-entry Doka 200.
    // 4. Lava death persistDeathPenalty uses committed.doka 200.
    //    computeDeathPenalty → 120. saveBattleStats writes 120 over 1200.
    const remount = remountLock();
    const after = deathPenaltyAfterGameKeyDokaKeepRemount({
      xp: remount.snapshot().xp,
      remountDoka: remount.snapshot().doka,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.equal(after?.newDoka, 120, "ungated remount death taxes 200");
    assert.equal(after?.newXp, 80);
    assert.notEqual(after?.newDoka, 720, "must not tax replica 1200");
  });

  it("does not saveBattleStats-wipe GameKey +1000 after a gated fresh death cut", () => {
    const remount = remountLock();
    const after = deathPenaltyAfterGameKeyDokaKeepRemount({
      xp: remount.snapshot().xp,
      remountDoka: remount.snapshot().doka,
      liveDoka: 200 + GAMEKEY_DOKA,
      keep: true,
      stampedPreDoka: 200,
    });
    assert.equal(after?.newDoka, 720, "40% of GameKey wallet 1200");
    assert.equal(after?.dokaLost, 480);
    assert.equal(after?.newXp, 80);
    assert.notEqual(after?.newDoka, 120, "must not cut Play-entry 200");
  });

  it("fail-closes stale Play-entry 200 when the Doka-keep stamp is set", () => {
    assert.equal(
      deathPenaltyAfterGameKeyDokaKeepRemount({
        xp: 100,
        remountDoka: 200,
        liveDoka: 200,
        keep: true,
        stampedPreDoka: 200,
      }),
      null,
    );
    assert.equal(
      dokaForGameKeyDokaKeepRemountDeathCut({
        remountDoka: 200,
        liveDoka: 200,
        keep: true,
        stampedPreDoka: 200,
      }),
      null,
    );
  });

  it("pickup-only remount (no stamp) still cuts 200 → 120", () => {
    const after = deathPenaltyAfterGameKeyDokaKeepRemount({
      xp: 100,
      remountDoka: 200,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.deepEqual(after, computeDeathPenalty(100, 200));
    assert.equal(after?.newDoka, 120);
  });

  it("#811 remount heal spends 10 from 1200; death is 40% of 1200 not that spend", () => {
    const heal = honourHealWrite(1200, 10);
    assert.equal(heal.doka, 1190, "#811 gated heal path");
    const death = computeDeathPenalty(100, 1200);
    assert.equal(death.newDoka, 720);
    assert.notEqual(death.newDoka, heal.doka);
  });
});

describe("resolveCommittedDokaAfterGameKeyDokaKeepRemountDeathCut", () => {
  it("returns remount wallet when keep is unset", async () => {
    const remount = remountLock();
    const storage = memStorage();
    const live = await resolveCommittedDokaAfterGameKeyDokaKeepRemountDeathCut(
      remount,
      async () => 1200,
      storage,
      1,
    );
    assert.equal(live, 200);
  });

  it("fetches replica wallet when the Doka-keep stamp is set", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteGameKeyDokaKeepRemountDeathCut(storage, 1, 200);
    const live = await resolveCommittedDokaAfterGameKeyDokaKeepRemountDeathCut(
      persist,
      async () => 200 + GAMEKEY_DOKA,
      storage,
      1,
    );
    assert.equal(live, 1200);
    assert.equal(persist.snapshot().doka, 1200, "lock adopts replica wallet");
    assert.equal(
      hasGameKeyDokaKeepRemountDeathCut(storage, 1),
      false,
      "stamp cleared so a later heal cannot recut Play-entry",
    );
    const after = computeDeathPenalty(persist.snapshot().xp, live);
    assert.equal(after.newDoka, 720);
  });

  it("reads bigint wallet from getCallerDokaBalance", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteGameKeyDokaKeepRemountDeathCut(storage, 1, 200);
    const live = await resolveCommittedDokaAfterGameKeyDokaKeepRemountDeathCut(
      persist,
      async () => 1200n,
      storage,
      1,
    );
    assert.equal(live, 1200);
  });

  it("fail-closes when getCallerDokaBalance returns Play-entry wallet after keep", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteGameKeyDokaKeepRemountDeathCut(storage, 1, 200);
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterGameKeyDokaKeepRemountDeathCut(
          persist,
          async () => 200,
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(persist.snapshot().doka, 200);
    assert.equal(hasGameKeyDokaKeepRemountDeathCut(storage, 1), true);
  });

  it("fail-closes when getCallerDokaBalance throws after keep", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteGameKeyDokaKeepRemountDeathCut(storage, 1, 200);
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterGameKeyDokaKeepRemountDeathCut(
          persist,
          async () => {
            throw new Error("replica unavailable");
          },
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(hasGameKeyDokaKeepRemountDeathCut(storage, 1), true);
  });
});

describe("persistDeathPenaltyThroughGameKeyDokaKeepRemount", () => {
  it("leftover remount death enqueue writes 120 when keep is unset", async () => {
    const persist = remountLock();
    const storage = memStorage();
    let wroteDoka = 0;
    await persistDeathPenaltyThroughGameKeyDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => 1200,
      applyAndCommit: async (after) => {
        wroteDoka = after.newDoka;
        persist.commit({ doka: after.newDoka, xp: after.newXp });
        return after;
      },
    });
    assert.equal(wroteDoka, 120, "ungated death taxes remount 200");
    assert.equal(persist.snapshot().doka, 120);
  });

  it("does not saveBattleStats-wipe GameKey +1000 after a gated death persist", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteGameKeyDokaKeepRemountDeathCut(storage, 1, 200);
    let canisterDoka = 1200;
    const after = await persistDeathPenaltyThroughGameKeyDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => 1200,
      applyAndCommit: async (cut) => {
        canisterDoka = cut.newDoka;
        persist.commit({ doka: cut.newDoka, xp: cut.newXp });
        return cut;
      },
    });
    assert.equal(after.newDoka, 720);
    assert.equal(canisterDoka, 720, "40% of replica 1200");
    assert.equal(persist.snapshot().doka, 720);
    assert.equal(hasGameKeyDokaKeepRemountDeathCut(storage, 1), false);
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
    noteGameKeyDokaKeepRemountDeathCut(storage, 1, 200);
    await persistDeathPenaltyThroughGameKeyDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => 1200,
      applyAndCommit: async (after) => after,
    });
    assert.equal(flushed, 0);
  });

  it("fail-closes gated death persist when replica still looks like Play-entry", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteGameKeyDokaKeepRemountDeathCut(storage, 1, 200);
    let wrote = false;
    await assert.rejects(
      () =>
        persistDeathPenaltyThroughGameKeyDokaKeepRemount({
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
    assert.equal(hasGameKeyDokaKeepRemountDeathCut(storage, 1), true);
  });

  it("clears a keep stamp explicitly", () => {
    const storage = memStorage();
    noteGameKeyDokaKeepRemountDeathCut(storage, 1, 200);
    assert.equal(hasGameKeyDokaKeepRemountDeathCut(storage, 1), true);
    clearGameKeyDokaKeepRemountDeathCut(storage, 1);
    assert.equal(hasGameKeyDokaKeepRemountDeathCut(storage, 1), false);
  });
});

describe("distinct from GameKey remount heal #811, one-shot death #877, victory death #869", () => {
  it("reads the #811 stamp key, not a second death-cut key", () => {
    const storage = memStorage();
    noteGameKeyDokaKeepRemountDeathCut(storage, 1, 200);
    assert.equal(
      gameKeyDokaKeepRemountDeathCutKey(1),
      "pbv_gamekey_doka_keep_remount_slot1",
    );
    assert.equal(
      storage.getItem("pbv_gamekey_doka_keep_remount_slot1") != null,
      true,
    );
    assert.deepEqual(readGameKeyDokaKeepRemountDeathCut(storage, 1), {
      preDoka: 200,
    });
    assert.equal(
      storage.getItem("pbv_oneshot_doka_keep_remount_slot1"),
      null,
      "#877 / #800 one-shot remount key stays empty",
    );
    assert.equal(
      storage.getItem("pbv_victory_doka_keep_remount_slot1"),
      null,
      "#869 / #774 victory remount key stays empty",
    );
    assert.equal(
      storage.getItem("pbv_boss_rush_doka_keep_remount_slot1"),
      null,
      "#866 Boss Rush remount key stays empty",
    );
    assert.equal(
      storage.getItem("pbv_feat_doka_keep_remount_slot1"),
      null,
      "#812 feat remount key stays empty",
    );
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot1"), null);
    assert.equal(
      storage.getItem("pbv_death_cut_credit_replay_remount_slot1"),
      null,
      "#742 death-cut remount key stays empty",
    );
  });

  it("does not extra-skip when keep is unset (death-fail without a later credit)", () => {
    const after = deathPenaltyAfterGameKeyDokaKeepRemount({
      xp: 100,
      remountDoka: 200,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.equal(after?.newDoka, 120);
  });

  it("unpaid honour on top of gated GameKey death cut still applies 40%", () => {
    const pending = {
      slot: 1,
      preXp: 100,
      preDoka: 200,
      afterXp: 80,
      afterDoka: 120,
    };
    const wrote = applyUnpaidDeathPenaltyToWrite(pending, 80, 720);
    assert.equal(wrote.xp, 80, "XP already at unpaid after");
    assert.equal(wrote.doka, 640, "unpaid 80 on gated death snapshot 720");
  });

  it("does not treat #811 heal spend 1190 as this death-cut path", () => {
    const heal = honourHealWrite(1200, 10);
    const death = computeDeathPenalty(100, 1200);
    assert.equal(heal.doka, 1190);
    assert.equal(death.newDoka, 720);
    assert.equal(heal.doka > death.newDoka, true);
  });
});
