import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { committedDokaAfterAchievementCredit } from "./achievementReward.ts";
import { PORTAL_TRANSITION_XP } from "./applyRewardsResult.ts";
import {
  persistDeathReplayThroughDeathCutCreditRemount,
  readDeathCutCreditRemountStamp,
  resolveDeathReplayAfterDeathCutCreditRemount,
  shouldSkipDeathCutCreditRemountReplay,
  shouldStampDeathCutConfirmedCreditRemount,
  wrapPersistCommitForDeathCutCreditRemount,
} from "./deathCutConfirmedCreditReplayRemountWriteSkip.ts";
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

/** Production remount lock: HUD catch-cut Doka + Play-entry leftover XP. */
function remountLock() {
  return createProgressPersist({ doka: 120, xp: 100, level: 4 });
}

describe("shouldStampDeathCutConfirmedCreditRemount", () => {
  it("does not stamp death-fail catch-commit (lock still 120/80)", () => {
    assert.equal(
      shouldStampDeathCutConfirmedCreditRemount(UNPAID, { doka: 120, xp: 80 }),
      false,
    );
  });

  it("does not stamp remount HUD 120 / Play-entry XP 100 as a portal credit", () => {
    assert.equal(
      shouldStampDeathCutConfirmedCreditRemount(UNPAID, { doka: 120, xp: 100 }),
      false,
      "#710 XP skip treats Play-entry 100 > after 80 as a credit",
    );
  });

  it("does not stamp unseeded placeholder 0 as an upgrade spend", () => {
    assert.equal(
      shouldStampDeathCutConfirmedCreditRemount(UNPAID, { doka: 0, xp: 100 }),
      false,
    );
  });

  it("does not stamp a stale pre-death hydrate 200 as a pickup", () => {
    assert.equal(
      shouldStampDeathCutConfirmedCreditRemount(UNPAID, { doka: 200, xp: 100 }),
      false,
    );
  });

  it("stamps a confirmed one-shot / feat / GameKey / victory / portal / upgrade", () => {
    assert.equal(
      shouldStampDeathCutConfirmedCreditRemount(UNPAID, { doka: 250, xp: 80 }),
      true,
    );
    assert.equal(
      shouldStampDeathCutConfirmedCreditRemount(UNPAID, { doka: 220, xp: 80 }),
      true,
    );
    assert.equal(
      shouldStampDeathCutConfirmedCreditRemount(UNPAID, { doka: 1120, xp: 80 }),
      true,
    );
    assert.equal(
      shouldStampDeathCutConfirmedCreditRemount(UNPAID, { doka: 280, xp: 24 }),
      true,
    );
    assert.equal(
      shouldStampDeathCutConfirmedCreditRemount(UNPAID, {
        doka: 120,
        xp: 100 + PORTAL_TRANSITION_XP,
      }),
      true,
    );
    assert.equal(
      shouldStampDeathCutConfirmedCreditRemount(UNPAID, {
        doka: committedDokaAfterSpellUpgrade(120, 190, 10),
        xp: 80,
      }),
      true,
    );
  });
});

describe("shouldSkipDeathCutCreditRemountReplay", () => {
  it("does not skip unpaid remount without a stamp (Play-entry XP 100)", () => {
    assert.equal(
      shouldSkipDeathCutCreditRemountReplay({
        stamp: null,
        liveDoka: 200,
        liveXp: 100,
      }),
      false,
    );
  });

  it("skips stale pre-death 200 after a stamped one-shot credit", () => {
    assert.equal(
      shouldSkipDeathCutCreditRemountReplay({
        stamp: {
          ...UNPAID,
          committedDoka: 250,
          committedXp: 80,
        },
        liveDoka: 200,
        liveXp: 100,
      }),
      true,
    );
  });

  it("allows a live rise past the unpaid pre-cut (kept credit)", () => {
    assert.equal(
      shouldSkipDeathCutCreditRemountReplay({
        stamp: {
          ...UNPAID,
          committedDoka: 250,
          committedXp: 80,
        },
        liveDoka: 250,
        liveXp: 100,
      }),
      false,
    );
  });

  it("fail-closes when a stamped credit cannot read live Doka", () => {
    assert.equal(
      shouldSkipDeathCutCreditRemountReplay({
        stamp: {
          ...UNPAID,
          committedDoka: 250,
          committedXp: 80,
        },
        liveDoka: null,
        liveXp: 100,
      }),
      true,
    );
  });
});

describe("death-fail catch-commit then confirmed credit vs leftover remount lock", () => {
  it("leftover remount skipBeforeEach replay writes 120 over canister 250", async () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200.
    // 2. Death saveBattleStats rejects. Catch commits lock 120 / XP 80.
    // 3. Ground Doka applyRewards +50 succeeds. Settle commit 250.
    // 4. Actor reconnect remounts. New lock HUD 120 / Play-entry XP 100.
    //    Leftover resolvePendingDeathReplay uses stale 200/100 only.
    const session = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    session.commit({ doka: 120, xp: 80 });
    session.commit({ doka: 250 });
    const remount = remountLock();
    assert.equal(remount.snapshot().doka, 120);
    assert.equal(remount.snapshot().xp, 100);
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    let backendXp = 100;
    let backendDoka = 250;
    const stale = { xp: 100, doka: 200 };
    const decision = resolvePendingDeathReplay(stale.xp, stale.doka, UNPAID);
    assert.equal(decision.action, "write");
    if (decision.action !== "write") return;
    await remount.enqueue(
      async () => {
        backendXp = decision.newXp;
        backendDoka = decision.newDoka;
        remount.commit({ doka: decision.newDoka, xp: decision.newXp });
      },
      { skipBeforeEach: true },
    );
    assert.equal(backendDoka, 120, "stale remount replay wiped the 50 pickup");
    assert.equal(backendXp, 80);
    assert.equal(remount.snapshot().doka, 120);
    assert.equal(session.snapshot().doka, 250);
    assert.equal(readPendingDeathPenalty(storage, 1)?.preDoka, 200);
  });

  it("does not replay-wipe the confirmed pickup after a stamped remount", async () => {
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    const session = wrapPersistCommitForDeathCutCreditRemount(
      createProgressPersist({ doka: 200, xp: 100, level: 4 }),
      storage,
      1,
    );
    session.commit({ doka: 120, xp: 80 });
    session.commit({ doka: 250 });
    assert.equal(
      readDeathCutCreditRemountStamp(storage, 1)?.committedDoka,
      250,
    );

    const remount = remountLock();
    let backendXp = 100;
    let backendDoka = 250;
    const skipped = await persistDeathReplayThroughDeathCutCreditRemount({
      persist: remount,
      storage,
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
    assert.equal(remount.snapshot().doka, 120);
    assert.deepEqual(readPendingDeathPenalty(storage, 1), UNPAID);

    const flushed = await persistDeathReplayThroughDeathCutCreditRemount({
      persist: remount,
      storage,
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
    assert.equal(remount.snapshot().doka, 170);
    const spent = applySpendToCommitted(remount.snapshot().doka, 10);
    remount.commit({ doka: spent });
    assert.equal(spent, 160);
  });

  it("leftover feat remount replay writes 120 over canister 300", async () => {
    const session = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    session.commit({ doka: 120, xp: 80 });
    session.commit({
      doka: committedDokaAfterAchievementCredit(session.snapshot().doka, 100),
    });
    assert.equal(session.snapshot().doka, 220);
    const remount = remountLock();
    const stale = { xp: 100, doka: 200 };
    const decision = resolvePendingDeathReplay(stale.xp, stale.doka, UNPAID);
    assert.equal(decision.action, "write");
    if (decision.action !== "write") return;
    let backendDoka = 300;
    await remount.enqueue(
      async () => {
        backendDoka = decision.newDoka;
        remount.commit({ doka: decision.newDoka, xp: decision.newXp });
      },
      { skipBeforeEach: true },
    );
    assert.equal(backendDoka, 120, "stale remount replay wiped the feat grant");
    assert.equal(remount.snapshot().doka, 120);
  });

  it("does not replay-wipe the feat grant after a stamped remount", async () => {
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    const session = wrapPersistCommitForDeathCutCreditRemount(
      createProgressPersist({ doka: 200, xp: 100, level: 4 }),
      storage,
      1,
    );
    session.commit({ doka: 120, xp: 80 });
    session.commit({
      doka: committedDokaAfterAchievementCredit(session.snapshot().doka, 100),
    });
    const remount = remountLock();
    const skipped = await persistDeathReplayThroughDeathCutCreditRemount({
      persist: remount,
      storage,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 200 }),
      writePenalty: async () => {
        throw new Error("must not write");
      },
    });
    assert.equal(skipped, "skipped");
    assert.equal(session.snapshot().doka, 220);

    let backendDoka = 300;
    let backendXp = 100;
    const flushed = await persistDeathReplayThroughDeathCutCreditRemount({
      persist: remount,
      storage,
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

  it("leftover GameKey remount replay writes 120 over canister 1200", async () => {
    const session = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    session.commit({ doka: 120, xp: 80 });
    session.commit({
      doka: committedDokaAfterGameKeyRedeem(session.snapshot().doka, 1000),
    });
    const remount = remountLock();
    const decision = resolvePendingDeathReplay(100, 200, UNPAID);
    assert.equal(decision.action, "write");
    if (decision.action !== "write") return;
    let backendDoka = 1200;
    await remount.enqueue(
      async () => {
        backendDoka = decision.newDoka;
        remount.commit({ doka: decision.newDoka, xp: decision.newXp });
      },
      { skipBeforeEach: true },
    );
    assert.equal(backendDoka, 120, "stale remount replay wiped the GameKey");
  });

  it("does not replay-wipe GameKey after a stamped remount", async () => {
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    const session = wrapPersistCommitForDeathCutCreditRemount(
      createProgressPersist({ doka: 200, xp: 100, level: 4 }),
      storage,
      1,
    );
    session.commit({ doka: 120, xp: 80 });
    session.commit({
      doka: committedDokaAfterGameKeyRedeem(session.snapshot().doka, 1000),
    });
    const remount = remountLock();
    const skipped = await persistDeathReplayThroughDeathCutCreditRemount({
      persist: remount,
      storage,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 200 }),
      writePenalty: async () => {
        throw new Error("must not write");
      },
    });
    assert.equal(skipped, "skipped");
    assert.equal(session.snapshot().doka, 1120);

    let backendDoka = 1200;
    const flushed = await persistDeathReplayThroughDeathCutCreditRemount({
      persist: remount,
      storage,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 1200 }),
      writePenalty: async (_newXp, newDoka) => {
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, "wrote");
    assert.equal(backendDoka, 1120, "unpaid 80 applied on top of the 1000");
  });

  it("leftover victory remount replay writes 120 over canister 280", async () => {
    const session = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    session.commit({ doka: 120, xp: 80 });
    session.commit({ doka: 280, xp: 24, level: 5 });
    const remount = remountLock();
    const decision = resolvePendingDeathReplay(100, 200, UNPAID);
    assert.equal(decision.action, "write");
    if (decision.action !== "write") return;
    let backendDoka = 280;
    await remount.enqueue(
      async () => {
        backendDoka = decision.newDoka;
        remount.commit({ doka: decision.newDoka, xp: decision.newXp });
      },
      { skipBeforeEach: true },
    );
    assert.equal(backendDoka, 120, "stale remount replay wiped victory Doka");
  });

  it("does not replay-wipe victory after a stamped remount", async () => {
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    const session = wrapPersistCommitForDeathCutCreditRemount(
      createProgressPersist({ doka: 200, xp: 100, level: 4 }),
      storage,
      1,
    );
    session.commit({ doka: 120, xp: 80 });
    session.commit({ doka: 280, xp: 24, level: 5 });
    const remount = remountLock();
    const skipped = await persistDeathReplayThroughDeathCutCreditRemount({
      persist: remount,
      storage,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 200 }),
      writePenalty: async () => {
        throw new Error("must not write");
      },
    });
    assert.equal(skipped, "skipped");
    assert.equal(session.snapshot().doka, 280);

    let backendDoka = 280;
    const flushed = await persistDeathReplayThroughDeathCutCreditRemount({
      persist: remount,
      storage,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 24, doka: 280 }),
      writePenalty: async (_newXp, newDoka) => {
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, "wrote");
    assert.equal(backendDoka, 200, "unpaid 80 applied on top of victory 80");
  });

  it("leftover portal remount replay writes XP 80 over canister 110", async () => {
    const session = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    session.commit({ doka: 120, xp: 80 });
    session.commit({ xp: 100 + PORTAL_TRANSITION_XP });
    assert.equal(session.snapshot().xp, 110);
    const remount = remountLock();
    const decision = resolvePendingDeathReplay(100, 200, UNPAID);
    assert.equal(decision.action, "write");
    if (decision.action !== "write") return;
    let backendXp = 110;
    let backendDoka = 200;
    await remount.enqueue(
      async () => {
        backendXp = decision.newXp;
        backendDoka = decision.newDoka;
        remount.commit({ doka: decision.newDoka, xp: decision.newXp });
      },
      { skipBeforeEach: true },
    );
    assert.equal(backendXp, 80, "stale remount replay wiped portal +10");
    assert.equal(backendDoka, 120);
  });

  it("does not replay-wipe portal +10 after a stamped remount", async () => {
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    const session = wrapPersistCommitForDeathCutCreditRemount(
      createProgressPersist({ doka: 200, xp: 100, level: 4 }),
      storage,
      1,
    );
    session.commit({ doka: 120, xp: 80 });
    session.commit({ xp: 100 + PORTAL_TRANSITION_XP });
    const remount = remountLock();
    const skipped = resolveDeathReplayAfterDeathCutCreditRemount(
      { xp: 100, doka: 200 },
      UNPAID,
      readDeathCutCreditRemountStamp(storage, 1),
    );
    assert.equal(skipped.action, "skip");
    assert.equal(session.snapshot().xp, 110);
    assert.equal(remount.snapshot().xp, 100);

    let backendXp = 110;
    let backendDoka = 200;
    const flushed = await persistDeathReplayThroughDeathCutCreditRemount({
      persist: remount,
      storage,
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

  it("leftover upgrade remount replay writes 120 over canister 190", async () => {
    const session = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    session.commit({ doka: 120, xp: 80 });
    session.commit({
      doka: committedDokaAfterSpellUpgrade(session.snapshot().doka, 190, 10),
    });
    assert.equal(session.snapshot().doka, 110);
    const remount = remountLock();
    const decision = resolvePendingDeathReplay(100, 200, UNPAID);
    assert.equal(decision.action, "write");
    if (decision.action !== "write") return;
    let backendDoka = 190;
    await remount.enqueue(
      async () => {
        backendDoka = decision.newDoka;
        remount.commit({ doka: decision.newDoka, xp: decision.newXp });
      },
      { skipBeforeEach: true },
    );
    assert.equal(backendDoka, 120, "stale remount replay refunded upgrade");
  });

  it("does not replay-refund upgrade after a stamped remount", async () => {
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    const session = wrapPersistCommitForDeathCutCreditRemount(
      createProgressPersist({ doka: 200, xp: 100, level: 4 }),
      storage,
      1,
    );
    session.commit({ doka: 120, xp: 80 });
    session.commit({
      doka: committedDokaAfterSpellUpgrade(session.snapshot().doka, 190, 10),
    });
    const remount = remountLock();
    const skipped = await persistDeathReplayThroughDeathCutCreditRemount({
      persist: remount,
      storage,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 200 }),
      writePenalty: async () => {
        throw new Error("must not write");
      },
    });
    assert.equal(skipped, "skipped");
    assert.equal(session.snapshot().doka, 110);

    let backendDoka = 190;
    const flushed = await persistDeathReplayThroughDeathCutCreditRemount({
      persist: remount,
      storage,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 190 }),
      writePenalty: async (_newXp, newDoka) => {
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, "wrote");
    assert.equal(backendDoka, 110, "unpaid 80 applied on top of the 10 spend");
  });

  it("death-fail remount without a later credit still writes unpaid 20/40 onto 200", async () => {
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    const remount = remountLock();
    let backendDoka = 200;
    let backendXp = 100;
    const flushed = await persistDeathReplayThroughDeathCutCreditRemount({
      persist: remount,
      storage,
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
    assert.equal(
      readDeathCutCreditRemountStamp(storage, 1),
      null,
      "Play-entry XP 100 must not stamp an unpaid remount",
    );
  });

  it("keep-only remount (no stamp) still writes unpaid 20/40 onto 200", async () => {
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    const session = wrapPersistCommitForDeathCutCreditRemount(
      createProgressPersist({ doka: 200, xp: 100, level: 4 }),
      storage,
      1,
    );
    session.commit({ doka: 120, xp: 80 });
    session.noteUnconfirmedCredit();
    assert.equal(session.snapshot().doka, 120);
    assert.equal(readDeathCutCreditRemountStamp(storage, 1), null);
    const remount = remountLock();
    let backendDoka = 200;
    const flushed = await persistDeathReplayThroughDeathCutCreditRemount({
      persist: remount,
      storage,
      pending: UNPAID,
      fetchSnapshot: async () => ({ xp: 100, doka: 200 }),
      writePenalty: async (_newXp, newDoka) => {
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, "wrote");
    assert.equal(backendDoka, 120, "#698 keep-only remount must still flush");
  });

  it("re-decides inside the job so a credit that lands while queued is not wiped", async () => {
    const storage = memStorage();
    writePendingDeathPenalty(storage, UNPAID);
    const session = wrapPersistCommitForDeathCutCreditRemount(
      createProgressPersist({ doka: 200, xp: 100, level: 4 }),
      storage,
      1,
    );
    session.commit({ doka: 120, xp: 80 });
    let backendDoka = 200;
    let backendXp = 100;
    const credit = session.enqueue(async () => {
      backendDoka = 250;
      session.commit({ doka: 250 });
    });
    const replay = persistDeathReplayThroughDeathCutCreditRemount({
      persist: session,
      storage,
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
    assert.equal(session.snapshot().doka, 250);
  });

  it("cutConfirmed pending still clears instead of skip-stalling the marker", () => {
    const pending: PendingDeathPenalty = { ...UNPAID, cutConfirmed: true };
    const decision = resolveDeathReplayAfterDeathCutCreditRemount(
      { xp: 100, doka: 250 },
      pending,
      {
        ...UNPAID,
        committedDoka: 250,
        committedXp: 80,
      },
    );
    assert.equal(decision.action, "clear");
  });
});
