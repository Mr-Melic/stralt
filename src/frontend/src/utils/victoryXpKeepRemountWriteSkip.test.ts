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
  clearVictoryXpKeepRemount,
  hasVictoryXpKeepRemount,
  noteVictoryXpKeepRemount,
  persistVictoryXpThroughVictoryXpKeepRemount,
  readVictoryXpKeepRemount,
  resolveCommittedXpAfterVictoryXpKeepRemount,
  shouldNoteVictoryXpKeepRemount,
  shouldRefuseVictoryXpKeepRemountStaleXp,
  xpForVictoryXpKeepRemountHonour,
} from "./victoryXpKeepRemountWriteSkip.ts";

/** Typical `computeVictoryExp` for one level-4 kill (`level * 20`). */
const VICTORY_XP_DELTA = 80;

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

describe("shouldNoteVictoryXpKeepRemount", () => {
  it("notes transport-keep after a victory XP grant without unpaid death", () => {
    assert.equal(
      shouldNoteVictoryXpKeepRemount({
        xpDelta: VICTORY_XP_DELTA,
        error: new Error("replica went away"),
      }),
      true,
    );
  });

  it("notes Boss Rush room-clear leftover the same way", () => {
    assert.equal(
      shouldNoteVictoryXpKeepRemount({
        xpDelta: 40,
        error: new Error("replica went away"),
      }),
      true,
    );
  });

  it("does not note pickup-only Doka (xpDelta 0)", () => {
    assert.equal(
      shouldNoteVictoryXpKeepRemount({
        xpDelta: 0,
        error: new Error("replica went away"),
      }),
      false,
    );
  });

  it("does not note explicit applyRewards failed", () => {
    assert.equal(
      shouldNoteVictoryXpKeepRemount({
        xpDelta: VICTORY_XP_DELTA,
        error: new Error("applyRewards failed: over cap"),
      }),
      false,
    );
  });
});

describe("shouldRefuseVictoryXpKeepRemountStaleXp", () => {
  it("refuses stale Play-entry leftover equal to stamped preXp", () => {
    assert.equal(
      shouldRefuseVictoryXpKeepRemountStaleXp({
        keep: true,
        liveXp: 100,
        stampedPreXp: 100,
      }),
      true,
    );
  });

  it("does not refuse a fresh victory leftover 180", () => {
    assert.equal(
      shouldRefuseVictoryXpKeepRemountStaleXp({
        keep: true,
        liveXp: 100 + VICTORY_XP_DELTA,
        stampedPreXp: 100,
      }),
      false,
    );
  });

  it("does not refuse leftover already below preXp after a level-up", () => {
    assert.equal(
      shouldRefuseVictoryXpKeepRemountStaleXp({
        keep: true,
        liveXp: 24,
        stampedPreXp: 100,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseVictoryXpKeepRemountStaleXp({
        keep: false,
        liveXp: 100,
        stampedPreXp: 100,
      }),
      false,
    );
  });

  it("fail-closes when keep is set and live XP is missing", () => {
    assert.equal(
      shouldRefuseVictoryXpKeepRemountStaleXp({
        keep: true,
        liveXp: null,
        stampedPreXp: 100,
      }),
      true,
    );
  });
});

describe("victory throw-after-add then remount heal without unpaid death", () => {
  it("leftover remount heal writes XP 100 over canister 180 (the wipe)", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
    // 2. Victory resolveBattleRewards applyRewards(slot, doka, 80) invokes
    //    then throws. Canister leftover 180. Commit never runs. No unpaid
    //    death pending. #767 stamps portal +10 only. #774 stamps Doka.
    // 3. Actor reconnect remounts. New lock Play-entry XP 100.
    //    #759 does not stamp (pending null). Session unconfirmed flags gone.
    // 4. Heal spends 10 from Doka 200. writeXp = committed.xp 100.
    const remount = remountLock();
    const honourXp = xpForVictoryXpKeepRemountHonour({
      remountXp: remount.snapshot().xp,
      liveXp: 100,
      keep: false,
      stampedPreXp: 100,
    });
    assert.equal(honourXp, 100, "ungated remount trusts Play-entry 100");
    const wrote = honourHealWrite(honourXp ?? 0, 200, 10);
    assert.equal(wrote.xp, 100, "Play-entry honour wiped victory leftover");
    assert.equal(wrote.doka, 190);
  });

  it("does not saveBattleStats-wipe victory leftover after a gated fresh XP honour", () => {
    const remount = remountLock();
    const honourXp = xpForVictoryXpKeepRemountHonour({
      remountXp: remount.snapshot().xp,
      liveXp: 100 + VICTORY_XP_DELTA,
      keep: true,
      stampedPreXp: 100,
    });
    assert.equal(honourXp, 180);
    const wrote = honourHealWrite(honourXp ?? 0, 200, 10);
    assert.equal(wrote.xp, 180, "victory leftover survives remount heal");
    assert.equal(wrote.doka, 190);
  });

  it("fail-closes stale Play-entry 100 when the XP-keep stamp is set", () => {
    assert.equal(
      xpForVictoryXpKeepRemountHonour({
        remountXp: 100,
        liveXp: 100,
        keep: true,
        stampedPreXp: 100,
      }),
      null,
    );
  });

  it("fresh lava death after remount cuts from replica 180, not Play-entry 100", () => {
    const remount = remountLock();
    const honourXp = xpForVictoryXpKeepRemountHonour({
      remountXp: remount.snapshot().xp,
      liveXp: 100 + VICTORY_XP_DELTA,
      keep: true,
      stampedPreXp: 100,
    });
    assert.equal(honourXp, 180);
    const after = computeDeathPenalty(honourXp ?? 0, 200);
    assert.equal(after.newXp, 144, "20% of victory leftover 180");
    assert.notEqual(after.newXp, 80, "must not cut Play-entry 100");
  });

  it("ungated remount death cuts Play-entry 100 → 80 over canister 180", () => {
    const after = computeDeathPenalty(100, 200);
    assert.equal(
      after.newXp,
      80,
      "ungated remount death wiped victory leftover",
    );
  });
});

describe("resolveCommittedXpAfterVictoryXpKeepRemount", () => {
  it("returns remount leftover when keep is unset", async () => {
    const remount = remountLock();
    const storage = memStorage();
    const live = await resolveCommittedXpAfterVictoryXpKeepRemount(
      remount,
      async () => ({ experience: 180 }),
      storage,
      1,
    );
    assert.equal(live, 100);
  });

  it("fetches replica leftover when the XP-keep stamp is set", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteVictoryXpKeepRemount(storage, 1, {
      xpDelta: VICTORY_XP_DELTA,
      error: new Error("replica went away"),
      preXp: 100,
    });
    const live = await resolveCommittedXpAfterVictoryXpKeepRemount(
      remount,
      async () => ({ experience: 100 + VICTORY_XP_DELTA }),
      storage,
      1,
    );
    assert.equal(live, 180);
    assert.equal(remount.snapshot().xp, 180, "lock adopts replica leftover");
    assert.equal(hasVictoryXpKeepRemount(storage, 1), false, "stamp cleared");
    const wrote = honourHealWrite(live, 200, 10);
    assert.equal(wrote.xp, 180);
  });

  it("reads bigint experience from a character record", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteVictoryXpKeepRemount(storage, 1, {
      xpDelta: VICTORY_XP_DELTA,
      error: new Error("replica went away"),
      preXp: 100,
    });
    const live = await resolveCommittedXpAfterVictoryXpKeepRemount(
      remount,
      async () => ({ experience: 180n }),
      storage,
      1,
    );
    assert.equal(live, 180);
  });

  it("fail-closes when getCharacter returns Play-entry leftover after keep", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteVictoryXpKeepRemount(storage, 1, {
      xpDelta: VICTORY_XP_DELTA,
      error: new Error("replica went away"),
      preXp: 100,
    });
    await assert.rejects(
      () =>
        resolveCommittedXpAfterVictoryXpKeepRemount(
          remount,
          async () => ({ experience: 100 }),
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(remount.snapshot().xp, 100);
    assert.equal(hasVictoryXpKeepRemount(storage, 1), true);
  });

  it("fail-closes when getCharacter throws after keep", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteVictoryXpKeepRemount(storage, 1, {
      xpDelta: VICTORY_XP_DELTA,
      error: new Error("replica went away"),
      preXp: 100,
    });
    await assert.rejects(
      () =>
        resolveCommittedXpAfterVictoryXpKeepRemount(
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

  it("honours leftover already below stamped preXp after a level-up", async () => {
    const remount = remountLock();
    const storage = memStorage();
    noteVictoryXpKeepRemount(storage, 1, {
      xpDelta: 80,
      error: new Error("replica went away"),
      preXp: 100,
    });
    const live = await resolveCommittedXpAfterVictoryXpKeepRemount(
      remount,
      async () => ({ experience: 24 }),
      storage,
      1,
    );
    assert.equal(live, 24);
  });
});

describe("persistVictoryXpThroughVictoryXpKeepRemount", () => {
  it("stamps remount XP keep after victory throw-after-add without unpaid death", async () => {
    const storage = memStorage();
    const persist = remountLock();
    let canisterXp = 100;
    await assert.rejects(
      () =>
        persistVictoryXpThroughVictoryXpKeepRemount({
          persist,
          storage,
          slot: 1,
          xpDelta: VICTORY_XP_DELTA,
          applyAndCommit: async () => {
            canisterXp += VICTORY_XP_DELTA;
            throw new Error("replica went away");
          },
        }),
      /replica went away/,
    );
    assert.equal(canisterXp, 180);
    assert.deepEqual(readVictoryXpKeepRemount(storage, 1), { preXp: 100 });
    assert.equal(persist.snapshot().xp, 100, "victory commit never ran");
  });

  it("stamps remount XP keep after Boss Rush room-clear throw-after-add", async () => {
    const storage = memStorage();
    const persist = remountLock();
    let canisterXp = 100;
    await assert.rejects(
      () =>
        persistVictoryXpThroughVictoryXpKeepRemount({
          persist,
          storage,
          slot: 1,
          xpDelta: 40,
          applyAndCommit: async () => {
            canisterXp += 40;
            throw new Error("replica went away");
          },
        }),
      /replica went away/,
    );
    assert.equal(canisterXp, 140);
    assert.deepEqual(readVictoryXpKeepRemount(storage, 1), { preXp: 100 });
  });

  it("does not stamp keep on explicit applyRewards failed", async () => {
    const storage = memStorage();
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistVictoryXpThroughVictoryXpKeepRemount({
          persist,
          storage,
          slot: 1,
          xpDelta: VICTORY_XP_DELTA,
          applyAndCommit: async () => {
            throw new Error("applyRewards failed: over cap");
          },
        }),
      /applyRewards failed/,
    );
    assert.equal(readVictoryXpKeepRemount(storage, 1), null);
  });

  it("does not stamp keep for a Doka-only credit", async () => {
    const storage = memStorage();
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistVictoryXpThroughVictoryXpKeepRemount({
          persist,
          storage,
          slot: 1,
          xpDelta: 0,
          applyAndCommit: async () => {
            throw new Error("replica went away");
          },
        }),
      /replica went away/,
    );
    assert.equal(hasVictoryXpKeepRemount(storage, 1), false);
  });

  it("clears a keep stamp explicitly", () => {
    const storage = memStorage();
    noteVictoryXpKeepRemount(storage, 1, {
      xpDelta: VICTORY_XP_DELTA,
      error: new Error("replica went away"),
      preXp: 100,
    });
    assert.equal(hasVictoryXpKeepRemount(storage, 1), true);
    clearVictoryXpKeepRemount(storage, 1);
    assert.equal(hasVictoryXpKeepRemount(storage, 1), false);
  });
});

describe("distinct from unpaid-death remount #759 / portal #767 / Doka #774", () => {
  it("notes keep with no unpaid pending ( #759 shouldNote requires pending )", () => {
    assert.equal(
      shouldNoteVictoryXpKeepRemount({
        xpDelta: VICTORY_XP_DELTA,
        error: new Error("replica went away"),
      }),
      true,
      "this sidecar does not gate on unpaid death pending",
    );
  });

  it("uses a different storage key than portal +10 keep", () => {
    const storage = memStorage();
    noteVictoryXpKeepRemount(storage, 1, {
      xpDelta: VICTORY_XP_DELTA,
      error: new Error("replica went away"),
      preXp: 100,
    });
    assert.equal(
      storage.getItem("pbv_victory_xp_keep_remount_slot1") != null,
      true,
    );
    assert.equal(storage.getItem("pbv_portal_xp_keep_remount_slot1"), null);
    assert.equal(storage.getItem("pbv_victory_doka_keep_remount_slot1"), null);
  });

  it("unpaid honour on top of gated victory leftover still applies 20%", () => {
    const pending = {
      slot: 1,
      preXp: 100,
      preDoka: 200,
      afterXp: 80,
      afterDoka: 120,
    };
    const wrote = applyUnpaidDeathPenaltyToWrite(pending, 180, 190);
    assert.equal(wrote.xp, 160, "unpaid 20 on victory leftover 180");
    assert.equal(wrote.doka, 110, "unpaid 80 on spend snapshot 190");
  });
});
