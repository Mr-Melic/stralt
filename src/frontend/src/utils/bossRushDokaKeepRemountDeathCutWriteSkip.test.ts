import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  bossRushDokaKeepRemountDeathCutKey,
  clearBossRushDokaKeepRemountDeathCut,
  deathPenaltyAfterBossRushDokaKeepRemount,
  dokaForBossRushDokaKeepRemountDeathCut,
  dokaFromBossRushDeathCutWallet,
  hasBossRushDokaKeepRemountDeathCut,
  noteBossRushDokaKeepRemountDeathCut,
  persistDeathPenaltyThroughBossRushDokaKeepRemount,
  readBossRushDokaKeepRemountDeathCut,
  resolveCommittedDokaAfterBossRushDokaKeepRemountDeathCut,
  shouldRefuseBossRushDokaKeepRemountDeathCutStaleDoka,
} from "./bossRushDokaKeepRemountDeathCutWriteSkip.ts";
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

describe("shouldRefuseBossRushDokaKeepRemountDeathCutStaleDoka", () => {
  it("refuses stale Play-entry wallet equal to stamped preDoka", () => {
    assert.equal(
      shouldRefuseBossRushDokaKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("refuses placeholder 0 below stamped preDoka", () => {
    assert.equal(
      shouldRefuseBossRushDokaKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 0,
        stampedPreDoka: 200,
      }),
      true,
    );
  });

  it("does not refuse a fresh room-clear wallet 700", () => {
    assert.equal(
      shouldRefuseBossRushDokaKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: 200 + ROOM_CLEAR_DOKA,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseBossRushDokaKeepRemountDeathCutStaleDoka({
        keep: false,
        liveDoka: 200,
        stampedPreDoka: 200,
      }),
      false,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseBossRushDokaKeepRemountDeathCutStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: 200,
      }),
      true,
    );
  });
});

describe("dokaFromBossRushDeathCutWallet", () => {
  it("reads a number wallet", () => {
    assert.equal(dokaFromBossRushDeathCutWallet(700), 700);
  });

  it("reads bigint and #ok wrappers", () => {
    assert.equal(dokaFromBossRushDeathCutWallet(700n), 700);
    assert.equal(dokaFromBossRushDeathCutWallet({ ok: 700 }), 700);
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromBossRushDeathCutWallet(null), null);
    assert.equal(dokaFromBossRushDeathCutWallet(undefined), null);
    assert.equal(dokaFromBossRushDeathCutWallet("nope"), null);
  });
});

describe("Boss Rush throw-after-add then remount death without unpaid death", () => {
  it("leftover remount death writes Doka 120 over canister 700 (the wipe)", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 seeded. Canister 200.
    // 2. Room-clear applyRewards(500, xp) invokes then throws.
    //    Canister 700. Commit never runs. No unpaid death pending.
    //    #864 stamps keep for remount heal.
    // 3. Actor reconnect remounts. New lock Play-entry Doka 200.
    // 4. Lava death persistDeathPenalty uses committed.doka 200.
    //    computeDeathPenalty → 120. saveBattleStats writes 120 over 700.
    const remount = remountLock();
    const after = deathPenaltyAfterBossRushDokaKeepRemount({
      xp: remount.snapshot().xp,
      remountDoka: remount.snapshot().doka,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.equal(after?.newDoka, 120, "ungated remount death taxes 200");
    assert.equal(after?.newXp, 80);
    assert.notEqual(after?.newDoka, 420, "must not tax replica 700");
  });

  it("does not saveBattleStats-wipe room-clear +500 after a gated fresh death cut", () => {
    const remount = remountLock();
    const after = deathPenaltyAfterBossRushDokaKeepRemount({
      xp: remount.snapshot().xp,
      remountDoka: remount.snapshot().doka,
      liveDoka: 200 + ROOM_CLEAR_DOKA,
      keep: true,
      stampedPreDoka: 200,
    });
    assert.equal(after?.newDoka, 420, "40% of room-clear wallet 700");
    assert.equal(after?.dokaLost, 280);
    assert.equal(after?.newXp, 80);
    assert.notEqual(after?.newDoka, 120, "must not cut Play-entry 200");
  });

  it("fail-closes stale Play-entry 200 when the Doka-keep stamp is set", () => {
    assert.equal(
      deathPenaltyAfterBossRushDokaKeepRemount({
        xp: 100,
        remountDoka: 200,
        liveDoka: 200,
        keep: true,
        stampedPreDoka: 200,
      }),
      null,
    );
    assert.equal(
      dokaForBossRushDokaKeepRemountDeathCut({
        remountDoka: 200,
        liveDoka: 200,
        keep: true,
        stampedPreDoka: 200,
      }),
      null,
    );
  });

  it("pickup-only remount (no stamp) still cuts 200 → 120", () => {
    const after = deathPenaltyAfterBossRushDokaKeepRemount({
      xp: 100,
      remountDoka: 200,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.deepEqual(after, computeDeathPenalty(100, 200));
    assert.equal(after?.newDoka, 120);
  });

  it("#864 remount heal spends 10 from 700; death is 40% of 700 not that spend", () => {
    const heal = honourHealWrite(700, 10);
    assert.equal(heal.doka, 690, "#864 gated heal path");
    const death = computeDeathPenalty(100, 700);
    assert.equal(death.newDoka, 420);
    assert.notEqual(death.newDoka, heal.doka);
  });
});

describe("resolveCommittedDokaAfterBossRushDokaKeepRemountDeathCut", () => {
  it("returns remount wallet when keep is unset", async () => {
    const remount = remountLock();
    const storage = memStorage();
    const live = await resolveCommittedDokaAfterBossRushDokaKeepRemountDeathCut(
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
    noteBossRushDokaKeepRemountDeathCut(storage, 1, 200);
    const live = await resolveCommittedDokaAfterBossRushDokaKeepRemountDeathCut(
      remount,
      async () => 200 + ROOM_CLEAR_DOKA,
      storage,
      1,
    );
    assert.equal(live, 700);
    assert.equal(remount.snapshot().doka, 700, "lock adopts replica wallet");
    assert.equal(
      hasBossRushDokaKeepRemountDeathCut(storage, 1),
      false,
      "stamp cleared so a later heal cannot recut Play-entry",
    );
    const after = computeDeathPenalty(remount.snapshot().xp, live);
    assert.equal(after.newDoka, 420);
  });

  it("reads bigint wallet from getCallerDokaBalance", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteBossRushDokaKeepRemountDeathCut(storage, 1, 200);
    const live = await resolveCommittedDokaAfterBossRushDokaKeepRemountDeathCut(
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
    noteBossRushDokaKeepRemountDeathCut(storage, 1, 200);
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterBossRushDokaKeepRemountDeathCut(
          remount,
          async () => 200,
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(remount.snapshot().doka, 200);
    assert.equal(hasBossRushDokaKeepRemountDeathCut(storage, 1), true);
  });

  it("fail-closes when getCallerDokaBalance throws after keep", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteBossRushDokaKeepRemountDeathCut(storage, 1, 200);
    await assert.rejects(
      () =>
        resolveCommittedDokaAfterBossRushDokaKeepRemountDeathCut(
          remount,
          async () => {
            throw new Error("replica unavailable");
          },
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(hasBossRushDokaKeepRemountDeathCut(storage, 1), true);
  });
});

describe("persistDeathPenaltyThroughBossRushDokaKeepRemount", () => {
  it("leftover remount death enqueue writes 120 when keep is unset", async () => {
    const persist = remountLock();
    const storage = memStorage();
    let wroteDoka = 0;
    await persistDeathPenaltyThroughBossRushDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => 700,
      applyAndCommit: async (after) => {
        wroteDoka = after.newDoka;
        persist.commit({ doka: after.newDoka, xp: after.newXp });
        return after;
      },
    });
    assert.equal(wroteDoka, 120, "ungated death taxes remount 200");
    assert.equal(persist.snapshot().doka, 120);
  });

  it("does not saveBattleStats-wipe room-clear +500 after a gated death persist", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteBossRushDokaKeepRemountDeathCut(storage, 1, 200);
    let canisterDoka = 700;
    const after = await persistDeathPenaltyThroughBossRushDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => 700,
      applyAndCommit: async (cut) => {
        canisterDoka = cut.newDoka;
        persist.commit({ doka: cut.newDoka, xp: cut.newXp });
        return cut;
      },
    });
    assert.equal(after.newDoka, 420);
    assert.equal(canisterDoka, 420, "40% of replica 700");
    assert.equal(persist.snapshot().doka, 420);
    assert.equal(hasBossRushDokaKeepRemountDeathCut(storage, 1), false);
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
    noteBossRushDokaKeepRemountDeathCut(storage, 1, 200);
    await persistDeathPenaltyThroughBossRushDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => 700,
      applyAndCommit: async (after) => after,
    });
    assert.equal(flushed, 0);
  });

  it("fail-closes gated death persist when replica still looks like Play-entry", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteBossRushDokaKeepRemountDeathCut(storage, 1, 200);
    let wrote = false;
    await assert.rejects(
      () =>
        persistDeathPenaltyThroughBossRushDokaKeepRemount({
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
    assert.equal(hasBossRushDokaKeepRemountDeathCut(storage, 1), true);
  });

  it("clears a keep stamp explicitly", () => {
    const storage = memStorage();
    noteBossRushDokaKeepRemountDeathCut(storage, 1, 200);
    assert.equal(hasBossRushDokaKeepRemountDeathCut(storage, 1), true);
    clearBossRushDokaKeepRemountDeathCut(storage, 1);
    assert.equal(hasBossRushDokaKeepRemountDeathCut(storage, 1), false);
  });
});

describe("distinct from Boss Rush remount heal #864, victory remount #774, death-cut remount #742", () => {
  it("reads the #864 stamp key, not a second death-cut key", () => {
    const storage = memStorage();
    noteBossRushDokaKeepRemountDeathCut(storage, 1, 200);
    assert.equal(
      bossRushDokaKeepRemountDeathCutKey(1),
      "pbv_boss_rush_doka_keep_remount_slot1",
    );
    assert.equal(
      storage.getItem("pbv_boss_rush_doka_keep_remount_slot1") != null,
      true,
    );
    assert.deepEqual(readBossRushDokaKeepRemountDeathCut(storage, 1), {
      preDoka: 200,
    });
    assert.equal(
      storage.getItem("pbv_victory_doka_keep_remount_slot1"),
      null,
      "#774 victory remount key stays empty",
    );
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot1"), null);
    assert.equal(
      storage.getItem("pbv_death_cut_credit_replay_remount_slot1"),
      null,
      "#742 death-cut remount key stays empty",
    );
  });

  it("does not extra-skip when keep is unset (death-fail without a later credit)", () => {
    const after = deathPenaltyAfterBossRushDokaKeepRemount({
      xp: 100,
      remountDoka: 200,
      liveDoka: 200,
      keep: false,
      stampedPreDoka: 200,
    });
    assert.equal(after?.newDoka, 120);
  });

  it("unpaid honour on top of gated room-clear death cut still applies 40%", () => {
    const pending = {
      slot: 1,
      preXp: 100,
      preDoka: 200,
      afterXp: 80,
      afterDoka: 120,
    };
    const wrote = applyUnpaidDeathPenaltyToWrite(pending, 80, 420);
    assert.equal(wrote.xp, 80, "XP already at unpaid after");
    assert.equal(wrote.doka, 340, "unpaid 80 on gated death snapshot 420");
  });

  it("does not treat #864 heal spend 690 as this death-cut path", () => {
    const heal = honourHealWrite(700, 10);
    const death = computeDeathPenalty(100, 700);
    assert.equal(heal.doka, 690);
    assert.equal(death.newDoka, 420);
    assert.equal(heal.doka > death.newDoka, true);
  });
});
