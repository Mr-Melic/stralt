import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { committedDokaAfterAchievementCredit } from "./achievementReward.ts";
import {
  PORTAL_TRANSITION_XP,
  persistIncrementalRewards,
} from "./applyRewardsResult.ts";
import {
  hasDeathCutCreditRemountXpKeepReplay,
  noteDeathCutCreditRemountXpKeepReplay,
  persistDeathReplayThroughDeathCutCreditRemountXpKeep,
  resolveDeathReplayAfterDeathCutCreditRemountXpKeep,
  shouldNoteDeathCutCreditRemountXpKeepReplay,
  shouldSkipDeathCutCreditRemountXpKeepReplay,
  writeDeathCutCreditRemountXpKeepReplay,
} from "./deathCutConfirmedCreditReplayRemountXpKeepReplay.ts";
import {
  type DeathPenaltyStorage,
  type PendingDeathPenalty,
  readPendingDeathPenalty,
  resolvePendingDeathReplay,
  writePendingDeathPenalty,
} from "./deathPenalty.ts";
import { createProgressPersist } from "./progressPersist.ts";
import { committedDokaAfterGameKeyRedeem } from "./shopPurchase.ts";

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

function stampXpKeep(storage: DeathPenaltyStorage, pending = UNPAID): void {
  writePendingDeathPenalty(storage, pending);
  writeDeathCutCreditRemountXpKeepReplay(storage, pending.slot, {
    preXp: pending.preXp,
    afterXp: pending.afterXp,
  });
}

describe("shouldSkipDeathCutCreditRemountXpKeepReplay", () => {
  it("does not skip death-fail without an XP-keep stamp", () => {
    assert.equal(
      shouldSkipDeathCutCreditRemountXpKeepReplay({
        keep: false,
        liveXp: 100,
        pendingPreXp: 100,
      }),
      false,
    );
  });

  it("skips stale Play-entry leftover 100 while the XP-keep stamp is set", () => {
    assert.equal(
      shouldSkipDeathCutCreditRemountXpKeepReplay({
        keep: true,
        liveXp: 100,
        pendingPreXp: 100,
      }),
      true,
    );
  });

  it("allows a fresh portal leftover 110 so unpaid 20 can land on the grant", () => {
    assert.equal(
      shouldSkipDeathCutCreditRemountXpKeepReplay({
        keep: true,
        liveXp: 100 + PORTAL_TRANSITION_XP,
        pendingPreXp: 100,
      }),
      false,
    );
  });

  it("does not fail-close victory leftover 24 (already below preXp)", () => {
    assert.equal(
      shouldSkipDeathCutCreditRemountXpKeepReplay({
        keep: true,
        liveXp: 24,
        pendingPreXp: 100,
      }),
      false,
    );
  });

  it("fail-closes when the keep stamp cannot read live leftover", () => {
    assert.equal(
      shouldSkipDeathCutCreditRemountXpKeepReplay({
        keep: true,
        liveXp: null,
        pendingPreXp: 100,
      }),
      true,
    );
  });

  it("does not extra-skip after cutConfirmed", () => {
    assert.equal(
      shouldSkipDeathCutCreditRemountXpKeepReplay({
        keep: true,
        liveXp: 100,
        pendingPreXp: 100,
        cutConfirmed: true,
      }),
      false,
    );
  });
});

describe("shouldNoteDeathCutCreditRemountXpKeepReplay", () => {
  it("stamps after a portal throw-after-add on an unpaid marker", () => {
    assert.equal(
      shouldNoteDeathCutCreditRemountXpKeepReplay({
        xpDelta: PORTAL_TRANSITION_XP,
        error: new Error("replica transport"),
        pending: UNPAID,
      }),
      true,
    );
  });

  it("does not stamp explicit applyRewards failed", () => {
    assert.equal(
      shouldNoteDeathCutCreditRemountXpKeepReplay({
        xpDelta: PORTAL_TRANSITION_XP,
        error: new Error("applyRewards failed: cap"),
        pending: UNPAID,
      }),
      false,
    );
  });

  it("does not stamp a Doka-only credit", () => {
    assert.equal(
      shouldNoteDeathCutCreditRemountXpKeepReplay({
        xpDelta: 0,
        error: new Error("replica transport"),
        pending: UNPAID,
      }),
      false,
    );
  });
});

describe("death-fail catch-commit then remount replay vs stale getCharacter XP", () => {
  it("leftover remount replay writes XP 80 over canister 110 after mixed 250/100", async () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
    // 2. Death saveBattleStats rejects. Catch commits lock 120 / XP 80.
    // 3. Ground Doka commit 250 stamps #742 Doka. White portal
    //    persistIncrementalRewards(0, 10) invokes then throws (canister 110).
    //    Portal commit never runs. #742 committedXp stays catch-cut 80.
    // 4. Remount replay fetches fresh Doka 250 + stale getCharacter 100.
    //    #742 skip is false (250 > pre 200; committedXp 80 is not > after 80).
    //    #759 honour/flush never run — replay is first.
    const leftover = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    leftover.commit({ doka: 120, xp: 80 });
    leftover.commit({ doka: 250 });
    leftover.commit({ doka: 120, xp: 100 });
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    let backendXp = 110;
    let backendDoka = 250;
    const stale = { xp: 100, doka: 250 };
    const decision = resolvePendingDeathReplay(stale.xp, stale.doka, UNPAID);
    assert.equal(decision.action, "write");
    if (decision.action !== "write") return;
    await leftover.enqueue(
      async () => {
        backendXp = decision.newXp;
        backendDoka = decision.newDoka;
        leftover.commit({ doka: decision.newDoka, xp: decision.newXp });
      },
      { skipBeforeEach: true },
    );
    assert.equal(backendXp, 80, "stale Play-entry replay wiped portal +10");
    assert.equal(backendDoka, 170, "fresh wallet still honoured unpaid 40%");
    assert.equal(leftover.snapshot().xp, 80);
  });

  it("does not replay-wipe portal +10 after a gated mixed 250/100 snapshot", async () => {
    const guarded = createProgressPersist({ doka: 120, xp: 100, level: 4 });
    guarded.commit({ doka: 250 });
    const storage = memStorage();
    stampXpKeep(storage);
    let backendXp = 110;
    let backendDoka = 250;
    const skipped = await persistDeathReplayThroughDeathCutCreditRemountXpKeep({
      persist: guarded,
      storage,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 250 }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(skipped, "skipped");
    assert.equal(backendXp, 110);
    assert.equal(backendDoka, 250);
    assert.equal(guarded.snapshot().xp, 100);
    assert.deepEqual(readPendingDeathPenalty(storage, 1), UNPAID);
    assert.equal(
      hasDeathCutCreditRemountXpKeepReplay(storage, 1, UNPAID),
      true,
    );

    const flushed = await persistDeathReplayThroughDeathCutCreditRemountXpKeep({
      persist: guarded,
      storage,
      pending: UNPAID,
      fetchSnapshot: async () => ({
        xp: 100 + PORTAL_TRANSITION_XP,
        doka: 250,
      }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, "wrote");
    assert.equal(backendXp, 90, "unpaid 20 applied on top of portal +10");
    assert.equal(backendDoka, 170, "unpaid 80 applied on top of the 50 pickup");
    assert.equal(guarded.snapshot().xp, 90);
    assert.equal(readPendingDeathPenalty(storage, 1)?.preXp, 100);
  });

  it("leftover remount replay writes 80/120 over portal-only canister 110/200", async () => {
    const leftover = createProgressPersist({ doka: 120, xp: 100, level: 4 });
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    let backendXp = 110;
    let backendDoka = 200;
    const decision = resolvePendingDeathReplay(100, 200, UNPAID);
    assert.equal(decision.action, "write");
    if (decision.action !== "write") return;
    await leftover.enqueue(
      async () => {
        backendXp = decision.newXp;
        backendDoka = decision.newDoka;
        leftover.commit({ doka: decision.newDoka, xp: decision.newXp });
      },
      { skipBeforeEach: true },
    );
    assert.equal(backendXp, 80, "portal-only stale replay wiped +10");
    assert.equal(backendDoka, 120);
  });

  it("does not replay-wipe portal-only +10 after a gated stale 100/200 snapshot", async () => {
    const guarded = createProgressPersist({ doka: 120, xp: 100, level: 4 });
    const storage = memStorage();
    stampXpKeep(storage);
    let backendXp = 110;
    let backendDoka = 200;
    const skipped = await persistDeathReplayThroughDeathCutCreditRemountXpKeep({
      persist: guarded,
      storage,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 200 }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(skipped, "skipped");
    assert.equal(backendXp, 110);
    assert.equal(backendDoka, 200);
  });

  it("leftover remount replay writes XP 80 after a feat seed", async () => {
    const leftover = createProgressPersist({ doka: 120, xp: 100, level: 4 });
    leftover.commit({
      doka: committedDokaAfterAchievementCredit(120, 100),
    });
    let backendXp = 110;
    let backendDoka = 300;
    const decision = resolvePendingDeathReplay(100, 300, UNPAID);
    assert.equal(decision.action, "write");
    if (decision.action !== "write") return;
    await leftover.enqueue(
      async () => {
        backendXp = decision.newXp;
        backendDoka = decision.newDoka;
        leftover.commit({ doka: decision.newDoka, xp: decision.newXp });
      },
      { skipBeforeEach: true },
    );
    assert.equal(backendXp, 80, "stale Play-entry replay wiped portal +10");
    assert.equal(backendDoka, 220);
  });

  it("does not wipe portal +10 after a gated feat live XP replay", async () => {
    const guarded = createProgressPersist({ doka: 120, xp: 100, level: 4 });
    guarded.commit({
      doka: committedDokaAfterAchievementCredit(120, 100),
    });
    const storage = memStorage();
    stampXpKeep(storage);
    let backendXp = 110;
    let backendDoka = 300;
    const skipped = await persistDeathReplayThroughDeathCutCreditRemountXpKeep({
      persist: guarded,
      storage,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 300 }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(skipped, "skipped");
    assert.equal(backendXp, 110);
    assert.equal(backendDoka, 300);

    const flushed = await persistDeathReplayThroughDeathCutCreditRemountXpKeep({
      persist: guarded,
      storage,
      pending: UNPAID,
      fetchSnapshot: async () => ({
        xp: 100 + PORTAL_TRANSITION_XP,
        doka: 300,
      }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, "wrote");
    assert.equal(backendXp, 90);
    assert.equal(backendDoka, 220);
  });

  it("leftover remount replay writes XP 80 after a GameKey seed", async () => {
    const leftover = createProgressPersist({ doka: 120, xp: 100, level: 4 });
    leftover.commit({
      doka: committedDokaAfterGameKeyRedeem(120, 1000),
    });
    let backendXp = 110;
    let backendDoka = 1200;
    const decision = resolvePendingDeathReplay(100, 1200, UNPAID);
    assert.equal(decision.action, "write");
    if (decision.action !== "write") return;
    await leftover.enqueue(
      async () => {
        backendXp = decision.newXp;
        backendDoka = decision.newDoka;
        leftover.commit({ doka: decision.newDoka, xp: decision.newXp });
      },
      { skipBeforeEach: true },
    );
    assert.equal(backendXp, 80);
    assert.equal(backendDoka, 1120);
  });

  it("does not wipe portal +10 after a gated GameKey live XP replay", async () => {
    const guarded = createProgressPersist({ doka: 120, xp: 100, level: 4 });
    guarded.commit({
      doka: committedDokaAfterGameKeyRedeem(120, 1000),
    });
    const storage = memStorage();
    stampXpKeep(storage);
    let backendXp = 110;
    let backendDoka = 1200;
    const skipped = await persistDeathReplayThroughDeathCutCreditRemountXpKeep({
      persist: guarded,
      storage,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 1200 }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(skipped, "skipped");
    assert.equal(backendXp, 110);
    assert.equal(backendDoka, 1200);
  });

  it("honours victory leftover 24 from the replica instead of failing closed", async () => {
    const guarded = createProgressPersist({ doka: 120, xp: 100, level: 4 });
    guarded.commit({ doka: 280 });
    const storage = memStorage();
    stampXpKeep(storage);
    let backendXp = 24;
    let backendDoka = 280;
    const wrote = await persistDeathReplayThroughDeathCutCreditRemountXpKeep({
      persist: guarded,
      storage,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 24, doka: 280 }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(wrote, "wrote");
    assert.equal(
      backendXp,
      24,
      "victory leftover already dropped more than 20%",
    );
    assert.equal(backendDoka, 200);
  });

  it("pickup-only remount still honours unpaid 20 onto replica XP 100", async () => {
    const guarded = createProgressPersist({ doka: 120, xp: 100, level: 4 });
    guarded.commit({ doka: 250 });
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    let backendXp = 100;
    let backendDoka = 250;
    const wrote = await persistDeathReplayThroughDeathCutCreditRemountXpKeep({
      persist: guarded,
      storage,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 250 }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(wrote, "wrote");
    assert.equal(backendXp, 80);
    assert.equal(backendDoka, 170);
  });

  it("fail-closes remount replay when keep is set and the replica snapshot is missing", async () => {
    const guarded = createProgressPersist({ doka: 120, xp: 100, level: 4 });
    const storage = memStorage();
    stampXpKeep(storage);
    let wrote = false;
    const skipped = await persistDeathReplayThroughDeathCutCreditRemountXpKeep({
      persist: guarded,
      storage,
      pending: UNPAID,
      fetchSnapshot: async () => null,
      writePenalty: async () => {
        wrote = true;
      },
    });
    assert.equal(skipped, "skipped");
    assert.equal(wrote, false);
    assert.equal(guarded.snapshot().xp, 100);
  });

  it("cutConfirmed remount replay still clears", async () => {
    const guarded = createProgressPersist({ doka: 120, xp: 100, level: 4 });
    const storage = memStorage();
    const confirmed: PendingDeathPenalty = { ...UNPAID, cutConfirmed: true };
    writePendingDeathPenalty(storage, confirmed);
    writeDeathCutCreditRemountXpKeepReplay(storage, 1, {
      preXp: 100,
      afterXp: 80,
    });
    const cleared = await persistDeathReplayThroughDeathCutCreditRemountXpKeep({
      persist: guarded,
      storage,
      pending: confirmed,
      fetchSnapshot: async () => ({ xp: 110, doka: 250 }),
      writePenalty: async () => {
        throw new Error("must not rewrite a confirmed cut");
      },
    });
    assert.equal(cleared, "cleared");
    assert.equal(hasDeathCutCreditRemountXpKeepReplay(storage, 1), false);
  });

  it("re-decides inside the job so a late character refetch 110 still honours", async () => {
    const guarded = createProgressPersist({ doka: 120, xp: 100, level: 4 });
    const storage = memStorage();
    stampXpKeep(storage);
    let backendXp = 110;
    let backendDoka = 250;
    let fetches = 0;
    const wrote = await persistDeathReplayThroughDeathCutCreditRemountXpKeep({
      persist: guarded,
      storage,
      pending: UNPAID,
      fetchSnapshot: async () => {
        fetches += 1;
        return { xp: 100 + PORTAL_TRANSITION_XP, doka: 250 };
      },
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(fetches, 1);
    assert.equal(wrote, "wrote");
    assert.equal(backendXp, 90);
    assert.equal(backendDoka, 170);
  });
});

describe("resolveDeathReplayAfterDeathCutCreditRemountXpKeep", () => {
  it("skips mixed fresh Doka + stale Play-entry leftover", () => {
    assert.deepEqual(
      resolveDeathReplayAfterDeathCutCreditRemountXpKeep(
        { xp: 100, doka: 250 },
        UNPAID,
        true,
      ),
      { action: "skip" },
    );
  });

  it("honours unpaid 20 onto a fresh portal leftover", () => {
    assert.deepEqual(
      resolveDeathReplayAfterDeathCutCreditRemountXpKeep(
        { xp: 110, doka: 250 },
        UNPAID,
        true,
      ),
      { action: "write", newXp: 90, newDoka: 170 },
    );
  });

  it("pickup-only without keep still writes 100 → 80", () => {
    assert.deepEqual(
      resolveDeathReplayAfterDeathCutCreditRemountXpKeep(
        { xp: 100, doka: 250 },
        UNPAID,
        false,
      ),
      { action: "write", newXp: 80, newDoka: 170 },
    );
  });
});

describe("noteDeathCutCreditRemountXpKeepReplay after persistIncrementalRewards", () => {
  it("stamps remount XP keep after portal throw-after-add", async () => {
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    let canisterXp = 100;
    const actor = {
      applyRewards: async () => {
        canisterXp += PORTAL_TRANSITION_XP;
        throw new Error("HTTP 503");
      },
    };
    await assert.rejects(
      () => persistIncrementalRewards(actor, 1, 0, PORTAL_TRANSITION_XP),
      /HTTP 503/,
    );
    noteDeathCutCreditRemountXpKeepReplay(storage, 1, {
      xpDelta: PORTAL_TRANSITION_XP,
      error: new Error("HTTP 503"),
    });
    assert.equal(canisterXp, 110);
    assert.equal(
      hasDeathCutCreditRemountXpKeepReplay(storage, 1, UNPAID),
      true,
    );
  });

  it("does not stamp after explicit applyRewards failed", async () => {
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    let canisterXp = 100;
    const actor = {
      applyRewards: async () => {
        return { err: "cap" };
      },
    };
    await assert.rejects(
      () => persistIncrementalRewards(actor, 1, 0, PORTAL_TRANSITION_XP),
      /applyRewards failed/,
    );
    noteDeathCutCreditRemountXpKeepReplay(storage, 1, {
      xpDelta: PORTAL_TRANSITION_XP,
      error: new Error("applyRewards failed: cap"),
    });
    assert.equal(canisterXp, 100);
    assert.equal(
      hasDeathCutCreditRemountXpKeepReplay(storage, 1, UNPAID),
      false,
    );
  });
});
