import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PORTAL_TRANSITION_XP } from "./applyRewardsResult.ts";
import {
  clearDeathCutCreditRemountXpKeep,
  flushPendingDeathPenaltyThroughDeathCutCreditRemountXpKeep,
  hasDeathCutCreditRemountXpKeep,
  noteDeathCutCreditRemountXpKeep,
  persistIncrementalXpThroughDeathCutCreditRemountXpKeep,
  persistPortalXpThroughDeathCutCreditRemountXpKeep,
  readDeathCutCreditRemountXpKeep,
  resolveCommittedXpAfterDeathCutCreditRemountXpKeep,
  shouldNoteDeathCutCreditRemountXpKeep,
  shouldRefuseDeathCutCreditRemountStaleXp,
  xpForDeathCutCreditRemountXpKeepHonour,
} from "./deathCutConfirmedCreditReplayRemountXpKeep.ts";
import {
  type DeathPenaltyStorage,
  type PendingDeathPenalty,
  applyUnpaidDeathPenaltyToWrite,
  flushPendingDeathPenalty,
  writePendingDeathPenalty,
} from "./deathPenalty.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  clampAbsoluteProgressWrite,
  createProgressPersist,
} from "./progressPersist.ts";

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

const UNPAID: PendingDeathPenalty = {
  slot: 1,
  preXp: 100,
  preDoka: 200,
  afterXp: 80,
  afterDoka: 120,
};

/** Production remount lock: HUD catch-cut Doka + Play-entry leftover XP. */
function remountLock() {
  return createProgressPersist({ doka: 120, xp: 100, level: 4 });
}

function honourHealWrite(
  pending: PendingDeathPenalty,
  honourXp: number,
  dokaBase: number,
  spend: number,
): { xp: number; doka: number } {
  const spent = applySpendToCommitted(dokaBase, spend);
  const honoured = applyUnpaidDeathPenaltyToWrite(pending, honourXp, spent);
  return {
    xp: honoured.xp,
    doka: clampAbsoluteProgressWrite(honoured.doka, dokaBase),
  };
}

describe("shouldNoteDeathCutCreditRemountXpKeep", () => {
  it("notes transport-keep after an XP grant while unpaid death is pending", () => {
    assert.equal(
      shouldNoteDeathCutCreditRemountXpKeep({
        xpDelta: PORTAL_TRANSITION_XP,
        error: new Error("replica went away"),
        pending: UNPAID,
      }),
      true,
    );
  });

  it("does not note pickup-only Doka (xpDelta 0)", () => {
    assert.equal(
      shouldNoteDeathCutCreditRemountXpKeep({
        xpDelta: 0,
        error: new Error("replica went away"),
        pending: UNPAID,
      }),
      false,
    );
  });

  it("does not note explicit applyRewards failed", () => {
    assert.equal(
      shouldNoteDeathCutCreditRemountXpKeep({
        xpDelta: PORTAL_TRANSITION_XP,
        error: new Error("applyRewards failed: over cap"),
        pending: UNPAID,
      }),
      false,
    );
  });

  it("does not note when there is no unpaid pending", () => {
    assert.equal(
      shouldNoteDeathCutCreditRemountXpKeep({
        xpDelta: PORTAL_TRANSITION_XP,
        error: new Error("replica went away"),
        pending: null,
      }),
      false,
    );
  });

  it("does not note cutConfirmed pending", () => {
    assert.equal(
      shouldNoteDeathCutCreditRemountXpKeep({
        xpDelta: PORTAL_TRANSITION_XP,
        error: new Error("replica went away"),
        pending: { ...UNPAID, cutConfirmed: true },
      }),
      false,
    );
  });
});

describe("shouldRefuseDeathCutCreditRemountStaleXp", () => {
  it("refuses stale Play-entry leftover equal to unpaid preXp", () => {
    assert.equal(
      shouldRefuseDeathCutCreditRemountStaleXp({
        keep: true,
        liveXp: 100,
        pendingPreXp: 100,
      }),
      true,
    );
  });

  it("does not refuse a fresh portal leftover 110", () => {
    assert.equal(
      shouldRefuseDeathCutCreditRemountStaleXp({
        keep: true,
        liveXp: 100 + PORTAL_TRANSITION_XP,
        pendingPreXp: 100,
      }),
      false,
    );
  });

  it("does not refuse victory leftover 24 (already below preXp)", () => {
    assert.equal(
      shouldRefuseDeathCutCreditRemountStaleXp({
        keep: true,
        liveXp: 24,
        pendingPreXp: 100,
      }),
      false,
    );
  });

  it("does not refuse pickup-only when keep is unset", () => {
    assert.equal(
      shouldRefuseDeathCutCreditRemountStaleXp({
        keep: false,
        liveXp: 100,
        pendingPreXp: 100,
      }),
      false,
    );
  });

  it("fail-closes when keep is set and live XP is missing", () => {
    assert.equal(
      shouldRefuseDeathCutCreditRemountStaleXp({
        keep: true,
        liveXp: null,
        pendingPreXp: 100,
      }),
      true,
    );
  });
});

describe("death-fail catch-commit then remount honour vs stale getCharacter XP", () => {
  it("leftover remount honour writes XP 80 over canister 110 after a stale Play-entry fetch", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
    // 2. Death saveBattleStats rejects. Catch commits lock 120 / XP 80.
    // 3. Ground Doka applyRewards +50 #ok. Settle commit 250. Canister 250.
    //    #742 remount stamp committedXp stays catch-cut 80.
    // 4. White portal persistIncrementalRewards(0, 10) invokes then throws.
    //    Canister XP 110. Commit never runs.
    // 5. Actor reconnect remounts. New lock Play-entry XP 100.
    //    #742 remount resolve seeds Doka 250. #756 fetches stale
    //    getCharacter 100 (Play-entry cache) → unpaid writes 80.
    const remount = remountLock();
    const honourXp = xpForDeathCutCreditRemountXpKeepHonour({
      remountXp: remount.snapshot().xp,
      liveXp: 100,
      keep: false,
      pendingPreXp: UNPAID.preXp,
    });
    assert.equal(honourXp, 100, "#756 leftover trusts stale live 100");
    const wrote = honourHealWrite(UNPAID, honourXp ?? 0, 250, 10);
    assert.equal(wrote.xp, 80, "stale Play-entry honour wiped portal +10");
    assert.equal(wrote.doka, 160);
  });

  it("does not saveBattleStats-wipe portal +10 after a gated fresh XP honour", () => {
    const remount = remountLock();
    const honourXp = xpForDeathCutCreditRemountXpKeepHonour({
      remountXp: remount.snapshot().xp,
      liveXp: 100 + PORTAL_TRANSITION_XP,
      keep: true,
      pendingPreXp: UNPAID.preXp,
    });
    assert.equal(honourXp, 110);
    const wrote = honourHealWrite(UNPAID, honourXp ?? 0, 250, 10);
    assert.equal(wrote.xp, 90, "unpaid 20 applied on top of portal +10");
    assert.equal(wrote.doka, 160, "pickup + unpaid 20/40 + heal spend");
  });

  it("fail-closes stale Play-entry 100 when the XP-keep stamp is set", () => {
    assert.equal(
      xpForDeathCutCreditRemountXpKeepHonour({
        remountXp: 100,
        liveXp: 100,
        keep: true,
        pendingPreXp: UNPAID.preXp,
      }),
      null,
    );
  });

  it("leftover remount honour writes XP 80 over canister 110 after a feat seed", () => {
    const remount = remountLock();
    const honourXp = xpForDeathCutCreditRemountXpKeepHonour({
      remountXp: remount.snapshot().xp,
      liveXp: 100,
      keep: false,
      pendingPreXp: UNPAID.preXp,
    });
    const wrote = honourHealWrite(UNPAID, honourXp ?? 0, 300, 10);
    assert.equal(wrote.xp, 80, "stale Play-entry honour wiped portal +10");
    assert.equal(wrote.doka, 210);
  });

  it("does not wipe portal +10 after a gated feat live XP honour", () => {
    const remount = remountLock();
    const honourXp = xpForDeathCutCreditRemountXpKeepHonour({
      remountXp: remount.snapshot().xp,
      liveXp: 100 + PORTAL_TRANSITION_XP,
      keep: true,
      pendingPreXp: UNPAID.preXp,
    });
    const wrote = honourHealWrite(UNPAID, honourXp ?? 0, 300, 10);
    assert.equal(wrote.xp, 90);
    assert.equal(wrote.doka, 210, "feat + unpaid 20/40 + heal spend");
  });

  it("leftover remount honour writes XP 80 over canister 110 after a GameKey seed", () => {
    const remount = remountLock();
    const honourXp = xpForDeathCutCreditRemountXpKeepHonour({
      remountXp: remount.snapshot().xp,
      liveXp: 100,
      keep: false,
      pendingPreXp: UNPAID.preXp,
    });
    const wrote = honourHealWrite(UNPAID, honourXp ?? 0, 1200, 10);
    assert.equal(wrote.xp, 80);
    assert.equal(wrote.doka, 1110);
  });

  it("does not wipe portal +10 after a gated GameKey live XP honour", () => {
    const remount = remountLock();
    const honourXp = xpForDeathCutCreditRemountXpKeepHonour({
      remountXp: remount.snapshot().xp,
      liveXp: 100 + PORTAL_TRANSITION_XP,
      keep: true,
      pendingPreXp: UNPAID.preXp,
    });
    const wrote = honourHealWrite(UNPAID, honourXp ?? 0, 1200, 10);
    assert.equal(wrote.xp, 90);
    assert.equal(wrote.doka, 1110);
  });

  it("honours victory leftover 24 from the replica instead of failing closed", () => {
    const remount = remountLock();
    const honourXp = xpForDeathCutCreditRemountXpKeepHonour({
      remountXp: remount.snapshot().xp,
      liveXp: 24,
      keep: true,
      pendingPreXp: UNPAID.preXp,
    });
    assert.equal(honourXp, 24);
    const wrote = honourHealWrite(UNPAID, honourXp ?? 0, 280, 10);
    assert.equal(
      wrote.xp,
      24,
      "victory leftover already dropped more than 20%",
    );
    assert.equal(wrote.doka, 190, "victory + unpaid 20/40 + heal spend");
  });

  it("pickup-only remount still honours unpaid 20 onto replica XP 100", () => {
    const remount = remountLock();
    const honourXp = xpForDeathCutCreditRemountXpKeepHonour({
      remountXp: remount.snapshot().xp,
      liveXp: 100,
      keep: false,
      pendingPreXp: UNPAID.preXp,
    });
    assert.equal(honourXp, 100);
    const wrote = honourHealWrite(UNPAID, honourXp ?? 0, 250, 10);
    assert.equal(wrote.xp, 80);
    assert.equal(wrote.doka, 160);
  });
});

describe("resolveCommittedXpAfterDeathCutCreditRemountXpKeep", () => {
  it("returns remount leftover when keep is unset (pickup-only)", async () => {
    const remount = remountLock();
    const storage = memStorage();
    const live = await resolveCommittedXpAfterDeathCutCreditRemountXpKeep(
      remount,
      async () => ({ experience: 110 }),
      UNPAID,
      storage,
      UNPAID.slot,
    );
    assert.equal(live, 100);
  });

  it("fetches replica leftover when the XP-keep stamp is set", async () => {
    const remount = remountLock();
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    noteDeathCutCreditRemountXpKeep(storage, UNPAID.slot, {
      xpDelta: PORTAL_TRANSITION_XP,
      error: new Error("replica went away"),
    });
    const live = await resolveCommittedXpAfterDeathCutCreditRemountXpKeep(
      remount,
      async () => ({ experience: 100 + PORTAL_TRANSITION_XP }),
      UNPAID,
      storage,
      UNPAID.slot,
    );
    assert.equal(live, 110);
    const wrote = honourHealWrite(UNPAID, live, 250, 10);
    assert.equal(wrote.xp, 90);
  });

  it("reads bigint experience from a character record", async () => {
    const remount = remountLock();
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    noteDeathCutCreditRemountXpKeep(storage, UNPAID.slot, {
      xpDelta: PORTAL_TRANSITION_XP,
      error: new Error("replica went away"),
    });
    const live = await resolveCommittedXpAfterDeathCutCreditRemountXpKeep(
      remount,
      async () => ({ experience: 110n }),
      UNPAID,
      storage,
      UNPAID.slot,
    );
    assert.equal(live, 110);
  });

  it("fail-closes when getCharacter returns Play-entry leftover after keep", async () => {
    const remount = remountLock();
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    noteDeathCutCreditRemountXpKeep(storage, UNPAID.slot, {
      xpDelta: PORTAL_TRANSITION_XP,
      error: new Error("replica went away"),
    });
    await assert.rejects(
      () =>
        resolveCommittedXpAfterDeathCutCreditRemountXpKeep(
          remount,
          async () => ({ experience: 100 }),
          UNPAID,
          storage,
          UNPAID.slot,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(remount.snapshot().xp, 100);
  });

  it("fail-closes when getCharacter throws after keep", async () => {
    const remount = remountLock();
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    noteDeathCutCreditRemountXpKeep(storage, UNPAID.slot, {
      xpDelta: PORTAL_TRANSITION_XP,
      error: new Error("replica went away"),
    });
    await assert.rejects(
      () =>
        resolveCommittedXpAfterDeathCutCreditRemountXpKeep(
          remount,
          async () => {
            throw new Error("replica unavailable");
          },
          UNPAID,
          storage,
          UNPAID.slot,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
  });

  it("returns remount leftover for cutConfirmed pending", async () => {
    const remount = remountLock();
    const storage = memStorage();
    writePendingDeathPenalty(storage, { ...UNPAID, cutConfirmed: true });
    noteDeathCutCreditRemountXpKeep(storage, UNPAID.slot, {
      xpDelta: PORTAL_TRANSITION_XP,
      error: new Error("replica went away"),
    });
    const live = await resolveCommittedXpAfterDeathCutCreditRemountXpKeep(
      remount,
      async () => ({ experience: 110 }),
      { ...UNPAID, cutConfirmed: true },
      storage,
      UNPAID.slot,
    );
    assert.equal(live, 100);
    assert.equal(hasDeathCutCreditRemountXpKeep(storage, UNPAID.slot), false);
  });
});

describe("flushPendingDeathPenaltyThroughDeathCutCreditRemountXpKeep", () => {
  it("leftover remount flush writes XP 80 over canister 110 with mixed 250/100", async () => {
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    const persist = remountLock();
    let wroteXp: number | null = null;
    let wroteDoka: number | null = null;
    const leftover = await flushPendingDeathPenalty({
      storage,
      slot: UNPAID.slot,
      persist,
      fetchSnapshot: async () => ({ xp: 100, doka: 250 }),
      writePenalty: async (newXp, newDoka) => {
        wroteXp = newXp;
        wroteDoka = newDoka;
      },
    });
    assert.equal(leftover, true);
    assert.equal(wroteXp, 80, "stale character cache wiped portal +10");
    assert.equal(wroteDoka, 170, "fresh wallet still honoured unpaid 40%");
  });

  it("skips stale Play-entry flush while the XP-keep stamp is set", async () => {
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    noteDeathCutCreditRemountXpKeep(storage, UNPAID.slot, {
      xpDelta: PORTAL_TRANSITION_XP,
      error: new Error("replica went away"),
    });
    const persist = remountLock();
    let wrote = 0;
    const skipped =
      await flushPendingDeathPenaltyThroughDeathCutCreditRemountXpKeep({
        storage,
        slot: UNPAID.slot,
        persist,
        fetchSnapshot: async () => ({ xp: 100, doka: 250 }),
        writePenalty: async () => {
          wrote += 1;
        },
      });
    assert.equal(skipped, false);
    assert.equal(wrote, 0);
    assert.equal(hasDeathCutCreditRemountXpKeep(storage, UNPAID.slot), true);
    assert.ok(storage.getItem("pbv_pending_death_penalty_slot1"));
  });

  it("flushes unpaid 20 onto a fresh portal leftover 110", async () => {
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    noteDeathCutCreditRemountXpKeep(storage, UNPAID.slot, {
      xpDelta: PORTAL_TRANSITION_XP,
      error: new Error("replica went away"),
    });
    const persist = remountLock();
    let wroteXp: number | null = null;
    let wroteDoka: number | null = null;
    const flushed =
      await flushPendingDeathPenaltyThroughDeathCutCreditRemountXpKeep({
        storage,
        slot: UNPAID.slot,
        persist,
        fetchSnapshot: async () => ({
          xp: 100 + PORTAL_TRANSITION_XP,
          doka: 250,
        }),
        writePenalty: async (newXp, newDoka) => {
          wroteXp = newXp;
          wroteDoka = newDoka;
        },
      });
    assert.equal(flushed, true);
    assert.equal(wroteXp, 90);
    assert.equal(wroteDoka, 170);
    assert.equal(hasDeathCutCreditRemountXpKeep(storage, UNPAID.slot), false);
  });

  it("pickup-only flush without keep still honours 100 → 80", async () => {
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    const persist = remountLock();
    let wroteXp: number | null = null;
    const flushed =
      await flushPendingDeathPenaltyThroughDeathCutCreditRemountXpKeep({
        storage,
        slot: UNPAID.slot,
        persist,
        fetchSnapshot: async () => ({ xp: 100, doka: 250 }),
        writePenalty: async (newXp) => {
          wroteXp = newXp;
        },
      });
    assert.equal(flushed, true);
    assert.equal(wroteXp, 80);
  });
});

describe("persistIncrementalXpThroughDeathCutCreditRemountXpKeep", () => {
  it("stamps remount XP keep after portal throw-after-add", async () => {
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    const persist = remountLock();
    let canisterXp = 100;
    await assert.rejects(
      () =>
        persistIncrementalXpThroughDeathCutCreditRemountXpKeep({
          persist,
          storage,
          slot: UNPAID.slot,
          xpDelta: PORTAL_TRANSITION_XP,
          applyAndCommit: async () => {
            canisterXp += PORTAL_TRANSITION_XP;
            throw new Error("replica went away");
          },
        }),
      /replica went away/,
    );
    assert.equal(canisterXp, 110);
    assert.deepEqual(readDeathCutCreditRemountXpKeep(storage, UNPAID.slot), {
      preXp: 100,
      afterXp: 80,
    });
    assert.equal(persist.snapshot().xp, 100, "portal commit never ran");
  });

  it("does not stamp keep on explicit applyRewards failed", async () => {
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistPortalXpThroughDeathCutCreditRemountXpKeep(
          {
            applyRewards: async () => ({ err: "over cap" }),
          },
          UNPAID.slot,
          persist,
          storage,
          PORTAL_TRANSITION_XP,
        ),
      /applyRewards failed/,
    );
    assert.equal(readDeathCutCreditRemountXpKeep(storage, UNPAID.slot), null);
  });

  it("does not stamp keep for a Doka-only credit", async () => {
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistIncrementalXpThroughDeathCutCreditRemountXpKeep({
          persist,
          storage,
          slot: UNPAID.slot,
          xpDelta: 0,
          applyAndCommit: async () => {
            throw new Error("replica went away");
          },
        }),
      /replica went away/,
    );
    assert.equal(hasDeathCutCreditRemountXpKeep(storage, UNPAID.slot), false);
  });

  it("clears a keep stamp explicitly", () => {
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    noteDeathCutCreditRemountXpKeep(storage, UNPAID.slot, {
      xpDelta: PORTAL_TRANSITION_XP,
      error: new Error("replica went away"),
    });
    assert.equal(hasDeathCutCreditRemountXpKeep(storage, UNPAID.slot), true);
    clearDeathCutCreditRemountXpKeep(storage, UNPAID.slot);
    assert.equal(hasDeathCutCreditRemountXpKeep(storage, UNPAID.slot), false);
  });
});
