import assert from "node:assert/strict";
import { describe, it } from "node:test";
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
import { RENAME_DOKA_COST } from "./renameCharacter.ts";
import {
  clearSpendKeepRemountDeathCut,
  deathPenaltyAfterSpendKeepRemount,
  dokaForSpendKeepRemountDeathCut,
  dokaFromSpendDeathCutWallet,
  hasSpendKeepRemountDeathCut,
  noteSpendKeepRemountDeathCut,
  persistDeathPenaltyThroughSpendKeepRemount,
  readSpendKeepRemountDeathCut,
  resolveCommittedDokaAfterSpendKeepRemountDeathCut,
  shouldRefuseSpendKeepRemountDeathCutStaleDoka,
  spendKeepRemountDeathCutKey,
} from "./spendKeepRemountDeathCutWriteSkip.ts";

const UPGRADE_SPEND = 10;
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

/** Production remount lock: GameFlow session cache (HUD never debited). */
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

describe("shouldRefuseSpendKeepRemountDeathCutStaleDoka", () => {
  it("refuses stale Play-entry wallet equal to stamped preDoka", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("refuses a ghost-high live wallet above stamped preDoka", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 250,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("does not refuse a fresh rename wallet 100", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 200 - RENAME_DOKA_COST,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("does not refuse a fresh upgrade wallet 190", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 200 - UPGRADE_SPEND,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountDeathCutStaleDoka({
        keep: false,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: 200,
      }),
      true,
    );
  });
});

describe("dokaFromSpendDeathCutWallet", () => {
  it("reads a number wallet", () => {
    assert.equal(dokaFromSpendDeathCutWallet(100), 100);
  });

  it("reads bigint and #ok wrappers", () => {
    assert.equal(dokaFromSpendDeathCutWallet(100n), 100);
    assert.equal(dokaFromSpendDeathCutWallet({ ok: 190 }), 190);
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromSpendDeathCutWallet(null), null);
    assert.equal(dokaFromSpendDeathCutWallet(undefined), null);
    assert.equal(dokaFromSpendDeathCutWallet("nope"), null);
  });
});

describe("rename/upgrade throw-after-debit then remount death without unpaid death", () => {
  it("leftover remount death writes Doka 120 over canister 100 (missed tax)", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 seeded. Canister 200.
    // 2. Rename renameCharacter deducts 100 then throws. Canister 100.
    //    Commit never runs. HUD stays 200. No unpaid death pending.
    //    #926 stamps keep for remount heal.
    // 3. Actor reconnect remounts. New lock Play-entry Doka 200.
    // 4. Lava death persistDeathPenalty uses committed.doka 200.
    //    computeDeathPenalty → 120. saveBattleStats never mints 120 over 100.
    const remount = remountLock();
    const after = deathPenaltyAfterSpendKeepRemount({
      xp: remount.snapshot().xp,
      remountDoka: remount.snapshot().doka,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.equal(after?.newDoka, 120, "ungated remount death taxes 200");
    assert.equal(after?.newXp, 80);
    assert.equal(
      canisterAfterDeathWrite(100, after?.newDoka ?? 0),
      100,
      "incoming 120 > stored 100 is ignored — missed 40 Doka tax",
    );
    assert.notEqual(after?.newDoka, 60, "must not tax replica 100");
  });

  it("leftover remount death writes Doka 120 over upgrade canister 190", () => {
    const after = computeDeathPenalty(100, 200);
    assert.equal(after.newDoka, 120);
    assert.equal(
      canisterAfterDeathWrite(190, after.newDoka),
      120,
      "incoming-below-stored over-cuts remaining after the upgrade fee",
    );
  });

  it("does not saveBattleStats-skip the rename tax after a gated fresh death cut", () => {
    const remount = remountLock();
    const after = deathPenaltyAfterSpendKeepRemount({
      xp: remount.snapshot().xp,
      remountDoka: remount.snapshot().doka,
      liveDoka: 200 - RENAME_DOKA_COST,
      keep: true,
      stampedPreDoka: 200,
    });
    assert.equal(after?.newDoka, 60, "40% of rename wallet 100");
    assert.equal(after?.dokaLost, 40);
    assert.equal(after?.newXp, 80);
    assert.equal(canisterAfterDeathWrite(100, after?.newDoka ?? 0), 60);
    assert.notEqual(after?.newDoka, 120, "must not cut Play-entry 200");
  });

  it("does not saveBattleStats-over-cut after a gated upgrade death cut", () => {
    const remount = remountLock();
    const after = deathPenaltyAfterSpendKeepRemount({
      xp: remount.snapshot().xp,
      remountDoka: remount.snapshot().doka,
      liveDoka: 200 - UPGRADE_SPEND,
      keep: true,
      stampedPreDoka: 200,
    });
    assert.equal(after?.newDoka, 114, "40% of upgrade wallet 190");
    assert.equal(after?.dokaLost, 76);
    assert.equal(canisterAfterDeathWrite(190, after?.newDoka ?? 0), 114);
  });

  it("fail-closes stale Play-entry 200 when the spend-keep stamp is set", () => {
    assert.equal(
      deathPenaltyAfterSpendKeepRemount({
        xp: 100,
        remountDoka: 200,
        liveDoka: 200,
        keep: true,
        stampedPreDoka: 200,
      }),
      null,
    );
    assert.equal(
      dokaForSpendKeepRemountDeathCut({
        remountDoka: 200,
        liveDoka: 200,
        keep: true,
        stampedPreDoka: 200,
      }),
      null,
    );
  });

  it("pickup-only remount (no stamp) still cuts 200 → 120", () => {
    const after = deathPenaltyAfterSpendKeepRemount({
      xp: 100,
      remountDoka: 200,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.deepEqual(after, computeDeathPenalty(100, 200));
    assert.equal(after?.newDoka, 120);
  });

  it("#926 remount heal spends 50 from 100; death is 40% of 100 not that spend", () => {
    const heal = honourHealWrite(100, SHOP_SPEND);
    assert.equal(heal.doka, 50, "#926 gated heal path");
    const death = computeDeathPenalty(100, 100);
    assert.equal(death.newDoka, 60);
    assert.notEqual(death.newDoka, heal.doka);
  });
});

describe("resolveCommittedDokaAfterSpendKeepRemountDeathCut", () => {
  it("returns remount wallet when keep is unset", async () => {
    const remount = remountLock();
    const storage = memStorage();
    const live = await resolveCommittedDokaAfterSpendKeepRemountDeathCut(
      remount,
      async () => 100,
      storage,
      1,
    );
    assert.equal(live, 200);
  });

  it("fetches replica wallet when the spend-keep stamp is set", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteSpendKeepRemountDeathCut(storage, 1, 200);
    const live = await resolveCommittedDokaAfterSpendKeepRemountDeathCut(
      persist,
      async () => 200 - RENAME_DOKA_COST,
      storage,
      1,
    );
    assert.equal(live, 100);
    assert.equal(persist.snapshot().doka, 100, "lock adopts replica wallet");
    assert.equal(
      hasSpendKeepRemountDeathCut(storage, 1),
      false,
      "stamp cleared so a later heal cannot tax Play-entry",
    );
    const after = computeDeathPenalty(persist.snapshot().xp, live);
    assert.equal(after.newDoka, 60);
  });

  it("reads bigint wallet from getCallerDokaBalance", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteSpendKeepRemountDeathCut(storage, 1, 200);
    const live = await resolveCommittedDokaAfterSpendKeepRemountDeathCut(
      persist,
      async () => 190n,
      storage,
      1,
    );
    assert.equal(live, 190);
  });

  it("fail-closes when getCallerDokaBalance returns Play-entry wallet after keep", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteSpendKeepRemountDeathCut(storage, 1, 200);
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterSpendKeepRemountDeathCut(
          persist,
          async () => 200,
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(persist.snapshot().doka, 200);
    assert.equal(hasSpendKeepRemountDeathCut(storage, 1), true);
  });

  it("fail-closes when getCallerDokaBalance throws after keep", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteSpendKeepRemountDeathCut(storage, 1, 200);
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterSpendKeepRemountDeathCut(
          persist,
          async () => {
            throw new Error("replica unavailable");
          },
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(hasSpendKeepRemountDeathCut(storage, 1), true);
  });
});

describe("persistDeathPenaltyThroughSpendKeepRemount", () => {
  it("leftover remount death enqueue writes 120 when keep is unset", async () => {
    const persist = remountLock();
    const storage = memStorage();
    let wroteDoka = 0;
    await persistDeathPenaltyThroughSpendKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => 100,
      applyAndCommit: async (after) => {
        wroteDoka = after.newDoka;
        persist.commit({ doka: after.newDoka, xp: after.newXp });
        return after;
      },
    });
    assert.equal(wroteDoka, 120, "ungated death taxes remount 200");
    assert.equal(persist.snapshot().doka, 120);
  });

  it("does not miss the rename tax after a gated death persist", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteSpendKeepRemountDeathCut(storage, 1, 200);
    let canisterDoka = 100;
    const after = await persistDeathPenaltyThroughSpendKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => 100,
      applyAndCommit: async (cut) => {
        canisterDoka = canisterAfterDeathWrite(canisterDoka, cut.newDoka);
        persist.commit({ doka: cut.newDoka, xp: cut.newXp });
        return cut;
      },
    });
    assert.equal(after.newDoka, 60);
    assert.equal(canisterDoka, 60, "40% of replica 100");
    assert.equal(persist.snapshot().doka, 60);
    assert.equal(hasSpendKeepRemountDeathCut(storage, 1), false);
  });

  it("does not over-cut upgrade 190 after a gated death persist", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteSpendKeepRemountDeathCut(storage, 1, 200);
    let canisterDoka = 190;
    const after = await persistDeathPenaltyThroughSpendKeepRemount({
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
    noteSpendKeepRemountDeathCut(storage, 1, 200);
    await persistDeathPenaltyThroughSpendKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => 100,
      applyAndCommit: async (after) => after,
    });
    assert.equal(flushed, 0);
  });

  it("fail-closes gated death persist when replica still looks like Play-entry", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteSpendKeepRemountDeathCut(storage, 1, 200);
    let wrote = false;
    await assert.rejects(
      () =>
        persistDeathPenaltyThroughSpendKeepRemount({
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
    assert.equal(hasSpendKeepRemountDeathCut(storage, 1), true);
  });

  it("clears a keep stamp explicitly", () => {
    const storage = memStorage();
    noteSpendKeepRemountDeathCut(storage, 1, 200);
    assert.equal(hasSpendKeepRemountDeathCut(storage, 1), true);
    clearSpendKeepRemountDeathCut(storage, 1);
    assert.equal(hasSpendKeepRemountDeathCut(storage, 1), false);
  });
});

describe("distinct from spend remount heal #926, credit remount death, session spend #387", () => {
  it("reads the #926 stamp key, not a second death-cut key", () => {
    const storage = memStorage();
    noteSpendKeepRemountDeathCut(storage, 1, 200);
    assert.equal(
      spendKeepRemountDeathCutKey(1),
      "pbv_spend_keep_remount_slot1",
    );
    assert.equal(storage.getItem("pbv_spend_keep_remount_slot1") != null, true);
    assert.deepEqual(readSpendKeepRemountDeathCut(storage, 1), {
      preDoka: 200,
    });
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
      storage.getItem("pbv_death_cut_credit_replay_remount_slot1"),
      null,
      "#742 death-cut remount key stays empty",
    );
  });

  it("does not extra-skip when keep is unset (death-fail without a later spend)", () => {
    const after = deathPenaltyAfterSpendKeepRemount({
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
      shouldRefuseSpendKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      true,
      "stale-equal is a missed debit",
    );
    assert.equal(
      shouldRefuseSpendKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 100,
        stampedPreDoka: 200,
      }),
      false,
      "a drop is the replica catching up — credit skip would stuck-skip this",
    );
  });

  it("unpaid honour on top of gated rename death cut still applies 40%", () => {
    const pending = {
      slot: 1,
      preXp: 100,
      preDoka: 200,
      afterXp: 80,
      afterDoka: 120,
    };
    const wrote = applyUnpaidDeathPenaltyToWrite(pending, 80, 60);
    assert.equal(wrote.xp, 80, "XP already at unpaid after");
    assert.equal(wrote.doka, 60, "already dropped 140 from 200");
  });

  it("does not treat #926 heal spend 50 as this death-cut path", () => {
    const heal = honourHealWrite(100, SHOP_SPEND);
    const death = computeDeathPenalty(100, 100);
    assert.equal(heal.doka, 50);
    assert.equal(death.newDoka, 60);
    assert.equal(heal.doka < death.newDoka, true);
  });
});
