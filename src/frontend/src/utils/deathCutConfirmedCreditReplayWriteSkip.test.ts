import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { committedDokaAfterAchievementCredit } from "./achievementReward.ts";
import { PORTAL_TRANSITION_XP } from "./applyRewardsResult.ts";
import {
  persistDeathReplayThroughDeathCutCredit,
  resolveDeathReplayAfterDeathCutCredit,
  shouldSkipDeathCutConfirmedCreditReplay,
} from "./deathCutConfirmedCreditReplayWriteSkip.ts";
import {
  type DeathPenaltyStorage,
  type PendingDeathPenalty,
  readPendingDeathPenalty,
  resolvePendingDeathReplay,
  writePendingDeathPenalty,
} from "./deathPenalty.ts";
import {
  applySpendToCommitted,
  createProgressPersist,
} from "./progressPersist.ts";
import { committedDokaAfterGameKeyRedeem } from "./shopPurchase.ts";
import { committedDokaAfterSpellUpgrade } from "./spellUpgrade.ts";

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

describe("shouldSkipDeathCutConfirmedCreditReplay", () => {
  it("does not skip death-fail without a later credit (lock still 120)", () => {
    assert.equal(
      shouldSkipDeathCutConfirmedCreditReplay({
        liveDoka: 200,
        committedDoka: 120,
        pendingPreDoka: 200,
        pendingAfterDoka: 120,
      }),
      false,
    );
  });

  it("skips stale pre-death 200 after catch-cut then a confirmed credit", () => {
    assert.equal(
      shouldSkipDeathCutConfirmedCreditReplay({
        liveDoka: 200,
        committedDoka: 250,
        pendingPreDoka: 200,
        pendingAfterDoka: 120,
      }),
      true,
    );
  });

  it("allows a live rise past the unpaid pre-cut (kept credit)", () => {
    assert.equal(
      shouldSkipDeathCutConfirmedCreditReplay({
        liveDoka: 250,
        committedDoka: 250,
        pendingPreDoka: 200,
        pendingAfterDoka: 120,
      }),
      false,
    );
  });

  it("does not extra-skip keep-only (lock still at afterDoka)", () => {
    assert.equal(
      shouldSkipDeathCutConfirmedCreditReplay({
        liveDoka: 200,
        committedDoka: 120,
        pendingPreDoka: 200,
        pendingAfterDoka: 120,
      }),
      false,
      "#698 owns unconfirmed keep while lock stays 120; replay must still flush",
    );
  });

  it("fail-closes when the later-credit lock cannot read live Doka", () => {
    assert.equal(
      shouldSkipDeathCutConfirmedCreditReplay({
        liveDoka: null,
        committedDoka: 250,
        pendingPreDoka: 200,
        pendingAfterDoka: 120,
      }),
      true,
    );
  });

  it("skips stale pre-death XP after catch-cut then portal +10", () => {
    assert.equal(
      shouldSkipDeathCutConfirmedCreditReplay({
        liveDoka: 200,
        committedDoka: 120,
        pendingPreDoka: 200,
        pendingAfterDoka: 120,
        liveXp: 100,
        committedXp: 100 + PORTAL_TRANSITION_XP,
        pendingPreXp: 100,
        pendingAfterXp: 80,
      }),
      true,
    );
  });

  it("skips stale uncut Doka after catch-cut then a confirmed upgrade spend", () => {
    assert.equal(
      shouldSkipDeathCutConfirmedCreditReplay({
        liveDoka: 200,
        committedDoka: committedDokaAfterSpellUpgrade(120, 190, 10),
        pendingPreDoka: 200,
        pendingAfterDoka: 120,
      }),
      true,
    );
  });

  it("allows a fresh post-spend wallet below unpaid pre so honour can land", () => {
    assert.equal(
      shouldSkipDeathCutConfirmedCreditReplay({
        liveDoka: 190,
        committedDoka: committedDokaAfterSpellUpgrade(120, 190, 10),
        pendingPreDoka: 200,
        pendingAfterDoka: 120,
      }),
      false,
    );
  });
});

describe("death-fail catch-commit then confirmed credit vs leftover remount replay", () => {
  it("leftover skipBeforeEach replay writes 120 over canister 250 after a one-shot commit", async () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200.
    // 2. Death saveBattleStats rejects. Catch commits lock 120 / XP 80.
    // 3. Ground Doka applyRewards +50 succeeds. Settle commit 250.
    // 4. Actor reconnect remounts. Leftover resolvePendingDeathReplay uses
    //    stale 200/100 only (never the lock), then skipBeforeEach writes 120.
    const leftover = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    leftover.commit({ doka: 120, xp: 80 });
    leftover.commit({ doka: 250 });
    assert.equal(leftover.hasUnconfirmedWalletCredit(), false);
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    let backendXp = 100;
    let backendDoka = 250;
    const stale = { xp: 100, doka: 200 };
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
    assert.equal(backendDoka, 120, "stale remount replay wiped the 50 pickup");
    assert.equal(backendXp, 80);
    assert.equal(leftover.snapshot().doka, 120);
    assert.equal(readPendingDeathPenalty(storage, 1)?.preDoka, 200);
  });

  it("does not replay-wipe the confirmed pickup after a gated stale snapshot", async () => {
    const guarded = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    guarded.commit({ doka: 120, xp: 80 });
    guarded.commit({ doka: 250 });
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    let backendXp = 100;
    let backendDoka = 250;
    const skipped = await persistDeathReplayThroughDeathCutCredit({
      persist: guarded,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 200 }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(skipped, "skipped");
    assert.equal(backendDoka, 250);
    assert.equal(backendXp, 100);
    assert.equal(guarded.snapshot().doka, 250);
    assert.deepEqual(readPendingDeathPenalty(storage, 1), UNPAID);

    const flushed = await persistDeathReplayThroughDeathCutCredit({
      persist: guarded,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 250 }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, "wrote");
    assert.equal(backendDoka, 170, "unpaid 80 applied on top of the 50 pickup");
    assert.equal(backendXp, 80);
    assert.equal(guarded.snapshot().doka, 170);
    const spent = applySpendToCommitted(guarded.snapshot().doka, 10);
    guarded.commit({ doka: spent });
    assert.equal(spent, 160);
  });

  it("leftover feat replay writes 120 over canister 300", async () => {
    const leftover = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    leftover.commit({ doka: 120, xp: 80 });
    leftover.commit({
      doka: committedDokaAfterAchievementCredit(leftover.snapshot().doka, 100),
    });
    assert.equal(leftover.snapshot().doka, 220);
    const stale = { xp: 100, doka: 200 };
    const decision = resolvePendingDeathReplay(stale.xp, stale.doka, UNPAID);
    assert.equal(decision.action, "write");
    if (decision.action !== "write") return;
    let backendDoka = 300;
    await leftover.enqueue(
      async () => {
        backendDoka = decision.newDoka;
        leftover.commit({ doka: decision.newDoka, xp: decision.newXp });
      },
      { skipBeforeEach: true },
    );
    assert.equal(backendDoka, 120, "stale remount replay wiped the feat grant");
    assert.equal(leftover.snapshot().doka, 120);
  });

  it("does not replay-wipe the feat grant after a gated stale snapshot", async () => {
    const guarded = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    guarded.commit({ doka: 120, xp: 80 });
    guarded.commit({
      doka: committedDokaAfterAchievementCredit(guarded.snapshot().doka, 100),
    });
    const skipped = await persistDeathReplayThroughDeathCutCredit({
      persist: guarded,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 200 }),
      writePenalty: async () => {
        throw new Error("must not write");
      },
    });
    assert.equal(skipped, "skipped");
    assert.equal(guarded.snapshot().doka, 220);

    let backendDoka = 300;
    let backendXp = 100;
    const flushed = await persistDeathReplayThroughDeathCutCredit({
      persist: guarded,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 300 }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, "wrote");
    assert.equal(backendDoka, 220, "unpaid 80 applied on top of the 100 grant");
    assert.equal(backendXp, 80);
  });

  it("leftover GameKey replay writes 120 over canister 1200", async () => {
    const leftover = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    leftover.commit({ doka: 120, xp: 80 });
    leftover.commit({
      doka: committedDokaAfterGameKeyRedeem(leftover.snapshot().doka, 1000),
    });
    assert.equal(leftover.snapshot().doka, 1120);
    const decision = resolvePendingDeathReplay(100, 200, UNPAID);
    assert.equal(decision.action, "write");
    if (decision.action !== "write") return;
    let backendDoka = 1200;
    await leftover.enqueue(
      async () => {
        backendDoka = decision.newDoka;
        leftover.commit({ doka: decision.newDoka, xp: decision.newXp });
      },
      { skipBeforeEach: true },
    );
    assert.equal(backendDoka, 120, "stale remount replay wiped the GameKey");
  });

  it("does not replay-wipe GameKey after a gated stale snapshot", async () => {
    const guarded = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    guarded.commit({ doka: 120, xp: 80 });
    guarded.commit({
      doka: committedDokaAfterGameKeyRedeem(guarded.snapshot().doka, 1000),
    });
    const skipped = await persistDeathReplayThroughDeathCutCredit({
      persist: guarded,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 200 }),
      writePenalty: async () => {
        throw new Error("must not write");
      },
    });
    assert.equal(skipped, "skipped");
    assert.equal(guarded.snapshot().doka, 1120);

    let backendDoka = 1200;
    const flushed = await persistDeathReplayThroughDeathCutCredit({
      persist: guarded,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 1200 }),
      writePenalty: async (_newXp, newDoka) => {
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, "wrote");
    assert.equal(backendDoka, 1120, "unpaid 80 applied on top of the 1000");
  });

  it("leftover victory replay writes 120 over canister 280", async () => {
    const leftover = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    leftover.commit({ doka: 120, xp: 80 });
    leftover.commit({ doka: 280, xp: 24, level: 5 });
    const decision = resolvePendingDeathReplay(100, 200, UNPAID);
    assert.equal(decision.action, "write");
    if (decision.action !== "write") return;
    let backendDoka = 280;
    await leftover.enqueue(
      async () => {
        backendDoka = decision.newDoka;
        leftover.commit({ doka: decision.newDoka, xp: decision.newXp });
      },
      { skipBeforeEach: true },
    );
    assert.equal(backendDoka, 120, "stale remount replay wiped victory Doka");
  });

  it("does not replay-wipe victory after a gated stale snapshot", async () => {
    const guarded = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    guarded.commit({ doka: 120, xp: 80 });
    guarded.commit({ doka: 280, xp: 24, level: 5 });
    const skipped = await persistDeathReplayThroughDeathCutCredit({
      persist: guarded,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 200 }),
      writePenalty: async () => {
        throw new Error("must not write");
      },
    });
    assert.equal(skipped, "skipped");
    assert.equal(guarded.snapshot().doka, 280);

    let backendDoka = 280;
    const flushed = await persistDeathReplayThroughDeathCutCredit({
      persist: guarded,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 24, doka: 280 }),
      writePenalty: async (_newXp, newDoka) => {
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, "wrote");
    assert.equal(backendDoka, 200, "unpaid 80 applied on top of victory 80");
  });

  it("leftover portal replay writes XP 80 over canister 110", async () => {
    const leftover = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    leftover.commit({ doka: 120, xp: 80 });
    leftover.commit({ xp: 100 + PORTAL_TRANSITION_XP });
    assert.equal(leftover.snapshot().xp, 110);
    const decision = resolvePendingDeathReplay(100, 200, UNPAID);
    assert.equal(decision.action, "write");
    if (decision.action !== "write") return;
    let backendXp = 110;
    let backendDoka = 200;
    await leftover.enqueue(
      async () => {
        backendXp = decision.newXp;
        backendDoka = decision.newDoka;
        leftover.commit({ doka: decision.newDoka, xp: decision.newXp });
      },
      { skipBeforeEach: true },
    );
    assert.equal(backendXp, 80, "stale remount replay wiped portal +10");
    assert.equal(backendDoka, 120);
  });

  it("does not replay-wipe portal +10 after a gated stale snapshot", async () => {
    const guarded = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    guarded.commit({ doka: 120, xp: 80 });
    guarded.commit({ xp: 100 + PORTAL_TRANSITION_XP });
    const skipped = resolveDeathReplayAfterDeathCutCredit(
      { xp: 100, doka: 200 },
      UNPAID,
      guarded.snapshot(),
    );
    assert.equal(skipped.action, "skip");
    assert.equal(guarded.snapshot().xp, 110);

    let backendXp = 110;
    let backendDoka = 200;
    const flushed = await persistDeathReplayThroughDeathCutCredit({
      persist: guarded,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 110, doka: 200 }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, "wrote");
    assert.equal(backendXp, 90, "unpaid 20 applied on top of portal +10");
    assert.equal(backendDoka, 120);
  });

  it("leftover upgrade replay writes 120 over canister 190", async () => {
    const leftover = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    leftover.commit({ doka: 120, xp: 80 });
    leftover.commit({
      doka: committedDokaAfterSpellUpgrade(leftover.snapshot().doka, 190, 10),
    });
    assert.equal(leftover.snapshot().doka, 110);
    const decision = resolvePendingDeathReplay(100, 200, UNPAID);
    assert.equal(decision.action, "write");
    if (decision.action !== "write") return;
    let backendDoka = 190;
    await leftover.enqueue(
      async () => {
        backendDoka = decision.newDoka;
        leftover.commit({ doka: decision.newDoka, xp: decision.newXp });
      },
      { skipBeforeEach: true },
    );
    assert.equal(backendDoka, 120, "stale remount replay refunded upgrade");
  });

  it("does not replay-refund upgrade after a gated stale snapshot", async () => {
    const guarded = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    guarded.commit({ doka: 120, xp: 80 });
    guarded.commit({
      doka: committedDokaAfterSpellUpgrade(guarded.snapshot().doka, 190, 10),
    });
    const skipped = await persistDeathReplayThroughDeathCutCredit({
      persist: guarded,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 200 }),
      writePenalty: async () => {
        throw new Error("must not write");
      },
    });
    assert.equal(skipped, "skipped");
    assert.equal(guarded.snapshot().doka, 110);

    let backendDoka = 190;
    const flushed = await persistDeathReplayThroughDeathCutCredit({
      persist: guarded,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 190 }),
      writePenalty: async (_newXp, newDoka) => {
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, "wrote");
    assert.equal(backendDoka, 110, "unpaid 80 applied on top of the 10 spend");
  });

  it("death-fail without a later credit still replays the unpaid 20/40 onto 200", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    lock.commit({ doka: 120, xp: 80 });
    let backendDoka = 200;
    let backendXp = 100;
    const flushed = await persistDeathReplayThroughDeathCutCredit({
      persist: lock,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: backendXp, doka: backendDoka }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, "wrote");
    assert.equal(backendDoka, 120);
    assert.equal(backendXp, 80);
  });

  it("re-decides inside the job so a credit that lands while queued is not wiped", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    lock.commit({ doka: 120, xp: 80 });
    let backendDoka = 200;
    let backendXp = 100;
    const credit = lock.enqueue(async () => {
      backendDoka = 250;
      lock.commit({ doka: 250 });
    });
    const replay = persistDeathReplayThroughDeathCutCredit({
      persist: lock,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 200 }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    await credit;
    const result = await replay;
    assert.equal(result, "skipped");
    assert.equal(backendDoka, 250, "queued credit survived remount replay");
    assert.equal(backendXp, 100);
    assert.equal(lock.snapshot().doka, 250);
  });

  it("cutConfirmed pending still clears instead of skip-stalling the marker", () => {
    const pending: PendingDeathPenalty = { ...UNPAID, cutConfirmed: true };
    const decision = resolveDeathReplayAfterDeathCutCredit(
      { xp: 100, doka: 250 },
      pending,
      { doka: 250, xp: 80 },
    );
    assert.equal(decision.action, "clear");
  });
});
