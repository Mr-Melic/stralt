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
  clearVictoryXpKeepRemountDeathCut,
  deathPenaltyAfterVictoryXpKeepRemount,
  hasVictoryXpKeepRemountDeathCut,
  noteVictoryXpKeepRemountDeathCut,
  persistDeathPenaltyThroughVictoryXpKeepRemount,
  readVictoryXpKeepRemountDeathCut,
  resolveCommittedXpAfterVictoryXpKeepRemountDeathCut,
  shouldRefuseVictoryXpKeepRemountDeathCutStaleXp,
  victoryXpKeepRemountDeathCutKey,
  xpForVictoryXpKeepRemountDeathCut,
  xpFromVictoryDeathCutCharacter,
} from "./victoryXpKeepRemountDeathCutWriteSkip.ts";

/** Typical `computeVictoryExp` for one level-4 kill (`level * 20`). */
const VICTORY_XP_DELTA = 80;
/** Catalog Boss Rush room-clear leftover used in #807 chronology. */
const BOSS_RUSH_XP_DELTA = 40;

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

/** Production remount lock: GameFlow Play-entry leftover XP. */
function remountLock() {
  return createProgressPersist({ doka: 200, xp: 100, level: 4 });
}

function honourHealWrite(
  honourXp: number,
  dokaBase: number,
  spend: number,
): { xp: number; doka: number } {
  return {
    xp: honourXp,
    doka: clampAbsoluteProgressWrite(
      applySpendToCommitted(dokaBase, spend),
      dokaBase,
    ),
  };
}

describe("shouldRefuseVictoryXpKeepRemountDeathCutStaleXp", () => {
  it("refuses stale Play-entry leftover equal to stamped preXp", () => {
    assert.equal(
      shouldRefuseVictoryXpKeepRemountDeathCutStaleXp({
        keep: true,
        liveXp: 100,
        stampedPreXp: 100,
      }),
      true,
    );
  });

  it("does not refuse a fresh victory leftover 180", () => {
    assert.equal(
      shouldRefuseVictoryXpKeepRemountDeathCutStaleXp({
        keep: true,
        liveXp: 100 + VICTORY_XP_DELTA,
        stampedPreXp: 100,
      }),
      false,
    );
  });

  it("does not refuse leftover already below preXp after a level-up", () => {
    assert.equal(
      shouldRefuseVictoryXpKeepRemountDeathCutStaleXp({
        keep: true,
        liveXp: 24,
        stampedPreXp: 100,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseVictoryXpKeepRemountDeathCutStaleXp({
        keep: false,
        liveXp: 100,
        stampedPreXp: 100,
      }),
      false,
    );
  });

  it("fail-closes when keep is set and live XP is missing", () => {
    assert.equal(
      shouldRefuseVictoryXpKeepRemountDeathCutStaleXp({
        keep: true,
        liveXp: null,
        stampedPreXp: 100,
      }),
      true,
    );
  });
});

describe("xpFromVictoryDeathCutCharacter", () => {
  it("reads a number leftover", () => {
    assert.equal(xpFromVictoryDeathCutCharacter({ experience: 180 }), 180);
  });

  it("reads bigint leftover", () => {
    assert.equal(xpFromVictoryDeathCutCharacter({ experience: 180n }), 180);
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(xpFromVictoryDeathCutCharacter(null), null);
    assert.equal(xpFromVictoryDeathCutCharacter(undefined), null);
    assert.equal(xpFromVictoryDeathCutCharacter({}), null);
    assert.equal(xpFromVictoryDeathCutCharacter({ experience: "nope" }), null);
  });
});

describe("victory throw-after-add then remount death without unpaid death", () => {
  it("leftover remount death writes XP 80 over canister 180 (the wipe)", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
    // 2. Victory resolveBattleRewards applyRewards(slot, doka, 80) invokes
    //    then throws. Canister leftover 180. Commit never runs. No unpaid
    //    death pending. #807 stamps keep for remount heal.
    // 3. Actor reconnect remounts. New lock Play-entry XP 100.
    // 4. Lava death persistDeathPenalty uses committed.xp 100.
    //    computeDeathPenalty → 80. saveBattleStats writes 80 over 180.
    const remount = remountLock();
    const after = deathPenaltyAfterVictoryXpKeepRemount({
      remountXp: remount.snapshot().xp,
      remountDoka: remount.snapshot().doka,
      liveXp: 100,
      keep: false,
      stampedPreXp: 100,
    });
    assert.equal(after?.newXp, 80, "ungated remount death taxes 100");
    assert.equal(after?.newDoka, 120);
    assert.notEqual(after?.newXp, 144, "must not tax replica 180");
  });

  it("does not saveBattleStats-wipe victory leftover after a gated fresh death cut", () => {
    const remount = remountLock();
    const after = deathPenaltyAfterVictoryXpKeepRemount({
      remountXp: remount.snapshot().xp,
      remountDoka: remount.snapshot().doka,
      liveXp: 100 + VICTORY_XP_DELTA,
      keep: true,
      stampedPreXp: 100,
    });
    assert.equal(after?.newXp, 144, "20% of victory leftover 180");
    assert.equal(after?.xpLost, 36);
    assert.equal(after?.newDoka, 120, "victory Doka keep is a different stamp");
    assert.notEqual(after?.newXp, 80, "must not cut Play-entry 100");
  });

  it("Boss Rush room-clear leftover death-cuts from replica 140, not 100", () => {
    const after = deathPenaltyAfterVictoryXpKeepRemount({
      remountXp: 100,
      remountDoka: 200,
      liveXp: 100 + BOSS_RUSH_XP_DELTA,
      keep: true,
      stampedPreXp: 100,
    });
    assert.equal(after?.newXp, 112, "20% of Boss Rush leftover 140");
    assert.notEqual(after?.newXp, 80);
  });

  it("fail-closes stale Play-entry 100 when the XP-keep stamp is set", () => {
    assert.equal(
      deathPenaltyAfterVictoryXpKeepRemount({
        remountXp: 100,
        remountDoka: 200,
        liveXp: 100,
        keep: true,
        stampedPreXp: 100,
      }),
      null,
    );
    assert.equal(
      xpForVictoryXpKeepRemountDeathCut({
        remountXp: 100,
        liveXp: 100,
        keep: true,
        stampedPreXp: 100,
      }),
      null,
    );
  });

  it("pickup-only remount (no stamp) still cuts 100 → 80", () => {
    const after = deathPenaltyAfterVictoryXpKeepRemount({
      remountXp: 100,
      remountDoka: 200,
      liveXp: 100,
      keep: false,
      stampedPreXp: 100,
    });
    assert.deepEqual(after, computeDeathPenalty(100, 200));
    assert.equal(after?.newXp, 80);
  });

  it("#807 remount heal writes 180; death is 20% of 180 not that write", () => {
    const heal = honourHealWrite(180, 200, 10);
    assert.equal(heal.xp, 180, "#807 gated heal path");
    assert.equal(heal.doka, 190);
    const death = computeDeathPenalty(180, 200);
    assert.equal(death.newXp, 144);
    assert.notEqual(death.newXp, heal.xp);
  });
});

describe("resolveCommittedXpAfterVictoryXpKeepRemountDeathCut", () => {
  it("returns remount leftover when keep is unset", async () => {
    const persist = remountLock();
    const storage = memStorage();
    const live = await resolveCommittedXpAfterVictoryXpKeepRemountDeathCut(
      persist,
      async () => ({ experience: 180 }),
      storage,
      1,
    );
    assert.equal(live, 100);
  });

  it("fetches replica leftover when the XP-keep stamp is set", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteVictoryXpKeepRemountDeathCut(storage, 1, 100);
    const live = await resolveCommittedXpAfterVictoryXpKeepRemountDeathCut(
      persist,
      async () => ({ experience: 100 + VICTORY_XP_DELTA }),
      storage,
      1,
    );
    assert.equal(live, 180);
    assert.equal(persist.snapshot().xp, 180, "lock adopts replica leftover");
    assert.equal(
      hasVictoryXpKeepRemountDeathCut(storage, 1),
      false,
      "stamp cleared so a later heal cannot recut Play-entry",
    );
    const after = computeDeathPenalty(live, persist.snapshot().doka);
    assert.equal(after.newXp, 144);
  });

  it("reads bigint leftover from getCharacter", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteVictoryXpKeepRemountDeathCut(storage, 1, 100);
    const live = await resolveCommittedXpAfterVictoryXpKeepRemountDeathCut(
      persist,
      async () => ({ experience: 180n }),
      storage,
      1,
    );
    assert.equal(live, 180);
  });

  it("fail-closes when getCharacter returns Play-entry leftover after keep", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteVictoryXpKeepRemountDeathCut(storage, 1, 100);
    await assert.rejects(
      () =>
        resolveCommittedXpAfterVictoryXpKeepRemountDeathCut(
          persist,
          async () => ({ experience: 100 }),
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(persist.snapshot().xp, 100);
    assert.equal(hasVictoryXpKeepRemountDeathCut(storage, 1), true);
  });

  it("fail-closes when getCharacter throws after keep", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteVictoryXpKeepRemountDeathCut(storage, 1, 100);
    await assert.rejects(
      () =>
        resolveCommittedXpAfterVictoryXpKeepRemountDeathCut(
          persist,
          async () => {
            throw new Error("replica unavailable");
          },
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(hasVictoryXpKeepRemountDeathCut(storage, 1), true);
  });

  it("honours leftover already below stamped preXp after a level-up", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteVictoryXpKeepRemountDeathCut(storage, 1, 100);
    const live = await resolveCommittedXpAfterVictoryXpKeepRemountDeathCut(
      persist,
      async () => ({ experience: 24 }),
      storage,
      1,
    );
    assert.equal(live, 24);
    const after = computeDeathPenalty(live, persist.snapshot().doka);
    assert.equal(after.newXp, 20, "20% of leftover 24");
  });
});

describe("persistDeathPenaltyThroughVictoryXpKeepRemount", () => {
  it("leftover remount death enqueue writes 80 when keep is unset", async () => {
    const persist = remountLock();
    const storage = memStorage();
    let wroteXp = 0;
    await persistDeathPenaltyThroughVictoryXpKeepRemount({
      persist,
      storage,
      slot: 1,
      readCharacter: async () => ({ experience: 180 }),
      applyAndCommit: async (after) => {
        wroteXp = after.newXp;
        persist.commit({ doka: after.newDoka, xp: after.newXp });
        return after;
      },
    });
    assert.equal(wroteXp, 80, "ungated death taxes remount 100");
    assert.equal(persist.snapshot().xp, 80);
  });

  it("does not saveBattleStats-wipe victory leftover after a gated death persist", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteVictoryXpKeepRemountDeathCut(storage, 1, 100);
    let canisterXp = 180;
    const after = await persistDeathPenaltyThroughVictoryXpKeepRemount({
      persist,
      storage,
      slot: 1,
      readCharacter: async () => ({ experience: 180 }),
      applyAndCommit: async (cut) => {
        canisterXp = cut.newXp;
        persist.commit({ doka: cut.newDoka, xp: cut.newXp });
        return cut;
      },
    });
    assert.equal(after.newXp, 144);
    assert.equal(canisterXp, 144, "20% of replica 180");
    assert.equal(persist.snapshot().xp, 144);
    assert.equal(after.newDoka, 120);
    assert.equal(hasVictoryXpKeepRemountDeathCut(storage, 1), false);
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
    noteVictoryXpKeepRemountDeathCut(storage, 1, 100);
    await persistDeathPenaltyThroughVictoryXpKeepRemount({
      persist,
      storage,
      slot: 1,
      readCharacter: async () => ({ experience: 180 }),
      applyAndCommit: async (after) => after,
    });
    assert.equal(flushed, 0);
  });

  it("fail-closes gated death persist when replica still looks like Play-entry", async () => {
    const persist = remountLock();
    const storage = memStorage();
    noteVictoryXpKeepRemountDeathCut(storage, 1, 100);
    let wrote = false;
    await assert.rejects(
      () =>
        persistDeathPenaltyThroughVictoryXpKeepRemount({
          persist,
          storage,
          slot: 1,
          readCharacter: async () => ({ experience: 100 }),
          applyAndCommit: async (after) => {
            wrote = true;
            persist.commit({ xp: after.newXp });
            return after;
          },
        }),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(wrote, false);
    assert.equal(persist.snapshot().xp, 100, "catch must not commit 80 here");
    assert.equal(hasVictoryXpKeepRemountDeathCut(storage, 1), true);
  });

  it("clears a keep stamp explicitly", () => {
    const storage = memStorage();
    noteVictoryXpKeepRemountDeathCut(storage, 1, 100);
    assert.equal(hasVictoryXpKeepRemountDeathCut(storage, 1), true);
    clearVictoryXpKeepRemountDeathCut(storage, 1);
    assert.equal(hasVictoryXpKeepRemountDeathCut(storage, 1), false);
  });
});

describe("distinct from victory remount heal #807, portal death #912, leftover XP #813", () => {
  it("reads the #807 stamp key, not a second death-cut key", () => {
    const storage = memStorage();
    noteVictoryXpKeepRemountDeathCut(storage, 1, 100);
    assert.equal(
      victoryXpKeepRemountDeathCutKey(1),
      "pbv_victory_xp_keep_remount_slot1",
    );
    assert.equal(
      storage.getItem("pbv_victory_xp_keep_remount_slot1") != null,
      true,
    );
    assert.deepEqual(readVictoryXpKeepRemountDeathCut(storage, 1), {
      preXp: 100,
    });
    assert.equal(
      storage.getItem("pbv_portal_xp_keep_remount_slot1"),
      null,
      "#912 / #767 portal XP remount key stays empty",
    );
    assert.equal(
      storage.getItem("pbv_xp_credit_keep_remount_slot1"),
      null,
      "#813 leftover XP remount key stays empty",
    );
    assert.equal(
      storage.getItem("pbv_victory_doka_keep_remount_slot1"),
      null,
      "#869 / #774 victory Doka remount key stays empty",
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
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot1"), null);
    assert.equal(
      storage.getItem("pbv_death_cut_credit_replay_remount_xp_keep_slot1"),
      null,
      "#759 unpaid-death remount XP keep key stays empty",
    );
  });

  it("does not extra-skip when keep is unset (death-fail without a later credit)", () => {
    const after = deathPenaltyAfterVictoryXpKeepRemount({
      remountXp: 100,
      remountDoka: 200,
      liveXp: 100,
      keep: false,
      stampedPreXp: 100,
    });
    assert.equal(after?.newXp, 80);
  });

  it("unpaid honour on top of gated victory death cut still applies 20%", () => {
    const pending = {
      slot: 1,
      preXp: 100,
      preDoka: 200,
      afterXp: 80,
      afterDoka: 120,
    };
    const wrote = applyUnpaidDeathPenaltyToWrite(pending, 144, 120);
    assert.equal(wrote.xp, 124, "unpaid 20 on gated death snapshot 144");
    assert.equal(wrote.doka, 120, "Doka already at unpaid after");
  });

  it("does not treat #807 heal leftover 180 as this death-cut path", () => {
    const heal = honourHealWrite(180, 200, 10);
    const death = computeDeathPenalty(180, 200);
    assert.equal(heal.xp, 180);
    assert.equal(death.newXp, 144);
    assert.equal(heal.xp > death.newXp, true);
  });
});
