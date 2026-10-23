import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  absoluteDokaThrowKeepRemountDeathCutKey,
  clearAbsoluteDokaThrowKeepRemountDeathCut,
  deathPenaltyAfterAbsoluteDokaThrowKeepRemount,
  dokaForAbsoluteDokaThrowKeepRemountDeathCut,
  dokaFromAbsoluteDokaThrowDeathCutWallet,
  hasAbsoluteDokaThrowKeepRemountDeathCut,
  noteAbsoluteDokaThrowKeepRemountDeathCut,
  persistDeathPenaltyThroughAbsoluteDokaThrowKeepRemount,
  readAbsoluteDokaThrowKeepRemountDeathCut,
  resolveCommittedDokaAfterAbsoluteDokaThrowKeepRemountDeathCut,
  shouldRefuseAbsoluteDokaThrowKeepRemountDeathCutStaleDoka,
} from "./absoluteDokaThrowKeepRemountDeathCutWriteSkip.ts";
import { clampSaveBattleStatsWrite } from "./absoluteStatsClamp.ts";
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

/** Typical Doka-heal fee after lava (200 → 190). */
const HEAL_SPEND = 10;
/** Items Buy spend at full HP (200 → 150). */
const SHOP_SPEND = 50;

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

/** Production remount lock: GameFlow rollback cache after throw. */
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

function canisterAfterDeathWrite(
  storedDoka: number,
  incomingDoka: number,
): number {
  return clampSaveBattleStatsWrite(
    { doka: storedDoka, xp: 100, level: 4 },
    { doka: incomingDoka, xp: 80, level: 4 },
  ).doka;
}

describe("shouldRefuseAbsoluteDokaThrowKeepRemountDeathCutStaleDoka", () => {
  it("refuses stale Play-entry wallet equal to stamped preDoka", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("refuses a ghost-high live wallet above stamped preDoka", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 250,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("does not refuse a fresh heal wallet 190", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 200 - HEAL_SPEND,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("does not refuse a fresh shop wallet 150", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 200 - SHOP_SPEND,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountDeathCutStaleDoka({
        keep: false,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: 200,
      }),
      true,
    );
  });
});

describe("dokaFromAbsoluteDokaThrowDeathCutWallet", () => {
  it("reads a number wallet", () => {
    assert.equal(dokaFromAbsoluteDokaThrowDeathCutWallet(190), 190);
  });

  it("reads bigint and #ok wrappers", () => {
    assert.equal(dokaFromAbsoluteDokaThrowDeathCutWallet(150n), 150);
    assert.equal(dokaFromAbsoluteDokaThrowDeathCutWallet({ ok: 190 }), 190);
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromAbsoluteDokaThrowDeathCutWallet(null), null);
    assert.equal(dokaFromAbsoluteDokaThrowDeathCutWallet(undefined), null);
    assert.equal(dokaFromAbsoluteDokaThrowDeathCutWallet("nope"), null);
  });
});

describe("shop/heal saveBattleStats throw-after-accept then remount death without unpaid death", () => {
  it("leftover remount death writes Doka 120 over heal canister 190", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 seeded. Canister 200.
    // 2. Doka-heal saveBattleStats accepts 190 then throws. Canister 190.
    //    Commit never runs. HUD rolls back to 200. No unpaid death.
    //    #964 stamps keep for remount heal / shop.
    // 3. Actor reconnect remounts. New lock Play-entry Doka 200.
    // 4. Lava death persistDeathPenalty uses committed.doka 200.
    //    computeDeathPenalty → 120. Incoming-below-stored over-cuts 190.
    const remount = remountLock();
    const after = deathPenaltyAfterAbsoluteDokaThrowKeepRemount({
      xp: remount.snapshot().xp,
      remountDoka: remount.snapshot().doka,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.equal(after?.newDoka, 120, "ungated remount death taxes 200");
    assert.equal(after?.newXp, 80);
    assert.equal(
      canisterAfterDeathWrite(190, after?.newDoka ?? 0),
      120,
      "incoming-below-stored over-cuts remaining after the heal fee",
    );
    assert.notEqual(after?.newDoka, 114, "must not tax replica 190");
  });

  it("leftover remount death writes Doka 120 over shop canister 150", () => {
    const after = computeDeathPenalty(100, 200);
    assert.equal(after.newDoka, 120);
    assert.equal(
      canisterAfterDeathWrite(150, after.newDoka),
      120,
      "incoming-below-stored over-cuts remaining after the shop spend",
    );
  });

  it("does not saveBattleStats-over-cut after a gated heal death cut", () => {
    const remount = remountLock();
    const after = deathPenaltyAfterAbsoluteDokaThrowKeepRemount({
      xp: remount.snapshot().xp,
      remountDoka: remount.snapshot().doka,
      liveDoka: 200 - HEAL_SPEND,
      keep: true,
      stampedPreDoka: 200,
    });
    assert.equal(after?.newDoka, 114, "40% of heal wallet 190");
    assert.equal(after?.dokaLost, 76);
    assert.equal(after?.newXp, 80);
    assert.equal(canisterAfterDeathWrite(190, after?.newDoka ?? 0), 114);
    assert.notEqual(after?.newDoka, 120, "must not cut Play-entry 200");
  });

  it("does not saveBattleStats-over-cut after a gated shop death cut", () => {
    const remount = remountLock();
    const after = deathPenaltyAfterAbsoluteDokaThrowKeepRemount({
      xp: remount.snapshot().xp,
      remountDoka: remount.snapshot().doka,
      liveDoka: 200 - SHOP_SPEND,
      keep: true,
      stampedPreDoka: 200,
    });
    assert.equal(after?.newDoka, 90, "40% of shop wallet 150");
    assert.equal(after?.dokaLost, 60);
    assert.equal(canisterAfterDeathWrite(150, after?.newDoka ?? 0), 90);
  });

  it("fail-closes stale Play-entry 200 when the throw-keep stamp is set", () => {
    assert.equal(
      deathPenaltyAfterAbsoluteDokaThrowKeepRemount({
        xp: 100,
        remountDoka: 200,
        liveDoka: 200,
        keep: true,
        stampedPreDoka: 200,
      }),
      null,
    );
    assert.equal(
      dokaForAbsoluteDokaThrowKeepRemountDeathCut({
        remountDoka: 200,
        liveDoka: 200,
        keep: true,
        stampedPreDoka: 200,
      }),
      null,
    );
  });

  it("pickup-only remount (no stamp) still cuts 200 → 120", () => {
    const after = deathPenaltyAfterAbsoluteDokaThrowKeepRemount({
      xp: 100,
      remountDoka: 200,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.deepEqual(after, computeDeathPenalty(100, 200));
    assert.equal(after?.newDoka, 120);
  });

  it("#964 remount heal spends 50 from 190; death is 40% of 190 not that spend", () => {
    const heal = honourHealWrite(190, SHOP_SPEND);
    assert.equal(heal.doka, 140, "#964 gated heal path");
    const death = computeDeathPenalty(100, 190);
    assert.equal(death.newDoka, 114);
    assert.notEqual(death.newDoka, heal.doka);
  });
});

describe("resolveCommittedDokaAfterAbsoluteDokaThrowKeepRemountDeathCut", () => {
  it("returns remount wallet when keep is unset", async () => {
    const remount = remountLock();
    const storage = memStorage();
    const live =
      await resolveCommittedDokaAfterAbsoluteDokaThrowKeepRemountDeathCut(
        remount,
        async () => 190,
        storage,
        1,
      );
    assert.equal(live, 200);
  });

  it("fetches replica wallet when the throw-keep stamp is set", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountDeathCut(storage, 1, 200);
    const live =
      await resolveCommittedDokaAfterAbsoluteDokaThrowKeepRemountDeathCut(
        persist,
        async () => 200 - HEAL_SPEND,
        storage,
        1,
      );
    assert.equal(live, 190);
    assert.equal(persist.snapshot().doka, 190, "lock adopts replica wallet");
    assert.equal(
      hasAbsoluteDokaThrowKeepRemountDeathCut(storage, 1),
      false,
      "stamp cleared so a later heal cannot tax Play-entry",
    );
    const after = computeDeathPenalty(persist.snapshot().xp, live);
    assert.equal(after.newDoka, 114);
  });

  it("reads bigint wallet from getCallerDokaBalance", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountDeathCut(storage, 1, 200);
    const live =
      await resolveCommittedDokaAfterAbsoluteDokaThrowKeepRemountDeathCut(
        persist,
        async () => 150n,
        storage,
        1,
      );
    assert.equal(live, 150);
  });

  it("fail-closes when getCallerDokaBalance returns Play-entry wallet after keep", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountDeathCut(storage, 1, 200);
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterAbsoluteDokaThrowKeepRemountDeathCut(
          persist,
          async () => 200,
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(persist.snapshot().doka, 200);
    assert.equal(hasAbsoluteDokaThrowKeepRemountDeathCut(storage, 1), true);
  });

  it("fail-closes when getCallerDokaBalance throws after keep", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountDeathCut(storage, 1, 200);
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterAbsoluteDokaThrowKeepRemountDeathCut(
          persist,
          async () => {
            throw new Error("replica unavailable");
          },
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(hasAbsoluteDokaThrowKeepRemountDeathCut(storage, 1), true);
  });
});

describe("persistDeathPenaltyThroughAbsoluteDokaThrowKeepRemount", () => {
  it("leftover remount death enqueue writes 120 when keep is unset", async () => {
    const persist = remountLock();
    const storage = memStorage();
    let wroteDoka = 0;
    await persistDeathPenaltyThroughAbsoluteDokaThrowKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => 190,
      applyAndCommit: async (after) => {
        wroteDoka = after.newDoka;
        persist.commit({ doka: after.newDoka, xp: after.newXp });
        return after;
      },
    });
    assert.equal(wroteDoka, 120, "ungated death taxes remount 200");
    assert.equal(persist.snapshot().doka, 120);
  });

  it("does not over-cut heal 190 after a gated death persist", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountDeathCut(storage, 1, 200);
    let canisterDoka = 190;
    const after = await persistDeathPenaltyThroughAbsoluteDokaThrowKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => 190,
      applyAndCommit: async (cut) => {
        canisterDoka = canisterAfterDeathWrite(canisterDoka, cut.newDoka);
        persist.commit({ doka: cut.newDoka, xp: cut.newXp });
        return cut;
      },
    });
    assert.equal(after.newDoka, 114);
    assert.equal(canisterDoka, 114, "40% of replica 190");
    assert.equal(persist.snapshot().doka, 114);
    assert.equal(hasAbsoluteDokaThrowKeepRemountDeathCut(storage, 1), false);
  });

  it("does not over-cut shop 150 after a gated death persist", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountDeathCut(storage, 1, 200);
    let canisterDoka = 150;
    const after = await persistDeathPenaltyThroughAbsoluteDokaThrowKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => 150,
      applyAndCommit: async (cut) => {
        canisterDoka = canisterAfterDeathWrite(canisterDoka, cut.newDoka);
        persist.commit({ doka: cut.newDoka, xp: cut.newXp });
        return cut;
      },
    });
    assert.equal(after.newDoka, 90);
    assert.equal(canisterDoka, 90, "40% of replica 150");
    assert.equal(persist.snapshot().doka, 90);
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
    noteAbsoluteDokaThrowKeepRemountDeathCut(storage, 1, 200);
    await persistDeathPenaltyThroughAbsoluteDokaThrowKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => 190,
      applyAndCommit: async (after) => after,
    });
    assert.equal(flushed, 0);
  });

  it("fail-closes gated death persist when replica still looks like Play-entry", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountDeathCut(storage, 1, 200);
    let wrote = false;
    await assert.rejects(
      () =>
        persistDeathPenaltyThroughAbsoluteDokaThrowKeepRemount({
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
    assert.equal(hasAbsoluteDokaThrowKeepRemountDeathCut(storage, 1), true);
  });

  it("clears a keep stamp explicitly", () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountDeathCut(storage, 1, 200);
    assert.equal(hasAbsoluteDokaThrowKeepRemountDeathCut(storage, 1), true);
    clearAbsoluteDokaThrowKeepRemountDeathCut(storage, 1);
    assert.equal(hasAbsoluteDokaThrowKeepRemountDeathCut(storage, 1), false);
  });
});

describe("distinct from #964 shop remount, #938 rename/upgrade death, credit remount death", () => {
  it("reads the #964 stamp key, not a second death-cut key", () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountDeathCut(storage, 1, 200);
    assert.equal(
      absoluteDokaThrowKeepRemountDeathCutKey(1),
      "pbv_absolute_doka_throw_keep_remount_slot1",
    );
    assert.equal(
      storage.getItem("pbv_absolute_doka_throw_keep_remount_slot1") != null,
      true,
    );
    assert.deepEqual(readAbsoluteDokaThrowKeepRemountDeathCut(storage, 1), {
      preDoka: 200,
    });
    assert.equal(
      storage.getItem("pbv_spend_keep_remount_slot1"),
      null,
      "#938 / #926 rename-upgrade remount key stays empty",
    );
    assert.equal(
      storage.getItem("pbv_feat_doka_keep_remount_slot1"),
      null,
      "#909 / #812 feat remount key stays empty",
    );
    assert.equal(
      storage.getItem("pbv_gamekey_doka_keep_remount_slot1"),
      null,
      "#900 / #811 GameKey remount key stays empty",
    );
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
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot1"), null);
    assert.equal(
      storage.getItem("pbv_absolute_hp_throw_keep_remount_slot1"),
      null,
      "#860 HP throw remount key stays empty",
    );
  });

  it("does not extra-skip when keep is unset (death-fail without a later spend)", () => {
    const after = deathPenaltyAfterAbsoluteDokaThrowKeepRemount({
      xp: 100,
      remountDoka: 200,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.equal(after?.newDoka, 120);
  });

  it("refuses live ≥ preDoka (credit remount deaths refuse live ≤ preDoka)", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      true,
      "stale-equal is a missed debit",
    );
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 190,
        stampedPreDoka: 200,
      }),
      false,
      "a drop is the replica catching up — credit skip would stuck-skip this",
    );
  });

  it("unpaid honour on top of gated heal death cut still applies 40%", () => {
    const pending = {
      slot: 1,
      preXp: 100,
      preDoka: 200,
      afterXp: 80,
      afterDoka: 120,
    };
    const wrote = applyUnpaidDeathPenaltyToWrite(pending, 80, 114);
    assert.equal(wrote.xp, 80, "XP already at unpaid after");
    assert.equal(wrote.doka, 114, "already dropped 86 from 200");
  });

  it("does not treat #964 heal spend 50 as this death-cut path", () => {
    const heal = honourHealWrite(190, SHOP_SPEND);
    const death = computeDeathPenalty(100, 190);
    assert.equal(heal.doka, 140);
    assert.equal(death.newDoka, 114);
    assert.equal(heal.doka > death.newDoka, true);
  });

  it("does not use the #938 rename/upgrade stamp key", () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountDeathCut(storage, 1, 200);
    assert.equal(
      absoluteDokaThrowKeepRemountDeathCutKey(1),
      "pbv_absolute_doka_throw_keep_remount_slot1",
    );
    assert.notEqual(
      absoluteDokaThrowKeepRemountDeathCutKey(1),
      "pbv_spend_keep_remount_slot1",
    );
  });
});
