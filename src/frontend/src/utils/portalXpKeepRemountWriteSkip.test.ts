import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PORTAL_TRANSITION_XP } from "./applyRewardsResult.ts";
import {
  type DeathPenaltyStorage,
  applyUnpaidDeathPenaltyToWrite,
  computeDeathPenalty,
} from "./deathPenalty.ts";
import {
  clearPortalXpKeepRemount,
  hasPortalXpKeepRemount,
  notePortalXpKeepRemount,
  persistPortalXpThroughPortalXpKeepRemount,
  readPortalXpKeepRemount,
  resolveCommittedXpAfterPortalXpKeepRemount,
  shouldNotePortalXpKeepRemount,
  shouldRefusePortalXpKeepRemountStaleXp,
  xpForPortalXpKeepRemountHonour,
} from "./portalXpKeepRemountWriteSkip.ts";
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

describe("shouldNotePortalXpKeepRemount", () => {
  it("notes transport-keep after an XP grant without unpaid death", () => {
    assert.equal(
      shouldNotePortalXpKeepRemount({
        xpDelta: PORTAL_TRANSITION_XP,
        error: new Error("replica went away"),
      }),
      true,
    );
  });

  it("does not note pickup-only Doka (xpDelta 0)", () => {
    assert.equal(
      shouldNotePortalXpKeepRemount({
        xpDelta: 0,
        error: new Error("replica went away"),
      }),
      false,
    );
  });

  it("does not note explicit applyRewards failed", () => {
    assert.equal(
      shouldNotePortalXpKeepRemount({
        xpDelta: PORTAL_TRANSITION_XP,
        error: new Error("applyRewards failed: over cap"),
      }),
      false,
    );
  });
});

describe("shouldRefusePortalXpKeepRemountStaleXp", () => {
  it("refuses stale Play-entry leftover equal to stamped preXp", () => {
    assert.equal(
      shouldRefusePortalXpKeepRemountStaleXp({
        keep: true,
        liveXp: 100,
        stampedPreXp: 100,
      }),
      true,
    );
  });

  it("does not refuse a fresh portal leftover 110", () => {
    assert.equal(
      shouldRefusePortalXpKeepRemountStaleXp({
        keep: true,
        liveXp: 100 + PORTAL_TRANSITION_XP,
        stampedPreXp: 100,
      }),
      false,
    );
  });

  it("does not refuse victory leftover already below preXp", () => {
    assert.equal(
      shouldRefusePortalXpKeepRemountStaleXp({
        keep: true,
        liveXp: 24,
        stampedPreXp: 100,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefusePortalXpKeepRemountStaleXp({
        keep: false,
        liveXp: 100,
        stampedPreXp: 100,
      }),
      false,
    );
  });

  it("fail-closes when keep is set and live XP is missing", () => {
    assert.equal(
      shouldRefusePortalXpKeepRemountStaleXp({
        keep: true,
        liveXp: null,
        stampedPreXp: 100,
      }),
      true,
    );
  });
});

describe("portal throw-after-add then remount heal without unpaid death", () => {
  it("leftover remount heal writes XP 100 over canister 110 (the wipe)", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
    // 2. Portal persistIncrementalRewards(0, 10) invokes then throws.
    //    Canister XP 110. Commit never runs. No unpaid death pending.
    // 3. Actor reconnect remounts. New lock Play-entry XP 100.
    //    #759 does not stamp (pending null). Session unconfirmed flags gone.
    // 4. Heal spends 10 from Doka 200. writeXp = committed.xp 100.
    const remount = remountLock();
    const honourXp = xpForPortalXpKeepRemountHonour({
      remountXp: remount.snapshot().xp,
      liveXp: 100,
      keep: false,
      stampedPreXp: 100,
    });
    assert.equal(honourXp, 100, "ungated remount trusts Play-entry 100");
    const wrote = honourHealWrite(honourXp ?? 0, 200, 10);
    assert.equal(wrote.xp, 100, "Play-entry honour wiped portal +10");
    assert.equal(wrote.doka, 190);
  });

  it("does not saveBattleStats-wipe portal +10 after a gated fresh XP honour", () => {
    const remount = remountLock();
    const honourXp = xpForPortalXpKeepRemountHonour({
      remountXp: remount.snapshot().xp,
      liveXp: 100 + PORTAL_TRANSITION_XP,
      keep: true,
      stampedPreXp: 100,
    });
    assert.equal(honourXp, 110);
    const wrote = honourHealWrite(honourXp ?? 0, 200, 10);
    assert.equal(wrote.xp, 110, "portal +10 survives remount heal");
    assert.equal(wrote.doka, 190);
  });

  it("fail-closes stale Play-entry 100 when the XP-keep stamp is set", () => {
    assert.equal(
      xpForPortalXpKeepRemountHonour({
        remountXp: 100,
        liveXp: 100,
        keep: true,
        stampedPreXp: 100,
      }),
      null,
    );
  });

  it("fresh lava death after remount cuts from replica 110, not Play-entry 100", () => {
    const remount = remountLock();
    const honourXp = xpForPortalXpKeepRemountHonour({
      remountXp: remount.snapshot().xp,
      liveXp: 100 + PORTAL_TRANSITION_XP,
      keep: true,
      stampedPreXp: 100,
    });
    assert.equal(honourXp, 110);
    const after = computeDeathPenalty(honourXp ?? 0, 200);
    assert.equal(after.newXp, 88, "20% of portal leftover 110");
    assert.notEqual(after.newXp, 80, "must not cut Play-entry 100");
  });

  it("ungated remount death cuts Play-entry 100 → 80 over canister 110", () => {
    const after = computeDeathPenalty(100, 200);
    assert.equal(after.newXp, 80, "ungated remount death wiped portal +10");
  });
});

describe("resolveCommittedXpAfterPortalXpKeepRemount", () => {
  it("returns remount leftover when keep is unset", async () => {
    const remount = remountLock();
    const storage = memStorage();
    const live = await resolveCommittedXpAfterPortalXpKeepRemount(
      remount,
      async () => ({ experience: 110 }),
      storage,
      1,
    );
    assert.equal(live, 100);
  });

  it("fetches replica leftover when the XP-keep stamp is set", async () => {
    const remount = remountLock();
    const storage = memStorage();
    notePortalXpKeepRemount(storage, 1, {
      xpDelta: PORTAL_TRANSITION_XP,
      error: new Error("replica went away"),
      preXp: 100,
    });
    const live = await resolveCommittedXpAfterPortalXpKeepRemount(
      remount,
      async () => ({ experience: 100 + PORTAL_TRANSITION_XP }),
      storage,
      1,
    );
    assert.equal(live, 110);
    assert.equal(remount.snapshot().xp, 110, "lock adopts replica leftover");
    assert.equal(hasPortalXpKeepRemount(storage, 1), false, "stamp cleared");
    const wrote = honourHealWrite(live, 200, 10);
    assert.equal(wrote.xp, 110);
  });

  it("reads bigint experience from a character record", async () => {
    const remount = remountLock();
    const storage = memStorage();
    notePortalXpKeepRemount(storage, 1, {
      xpDelta: PORTAL_TRANSITION_XP,
      error: new Error("replica went away"),
      preXp: 100,
    });
    const live = await resolveCommittedXpAfterPortalXpKeepRemount(
      remount,
      async () => ({ experience: 110n }),
      storage,
      1,
    );
    assert.equal(live, 110);
  });

  it("fail-closes when getCharacter returns Play-entry leftover after keep", async () => {
    const remount = remountLock();
    const storage = memStorage();
    notePortalXpKeepRemount(storage, 1, {
      xpDelta: PORTAL_TRANSITION_XP,
      error: new Error("replica went away"),
      preXp: 100,
    });
    await assert.rejects(
      () =>
        resolveCommittedXpAfterPortalXpKeepRemount(
          remount,
          async () => ({ experience: 100 }),
          storage,
          1,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(remount.snapshot().xp, 100);
    assert.equal(hasPortalXpKeepRemount(storage, 1), true);
  });

  it("fail-closes when getCharacter throws after keep", async () => {
    const remount = remountLock();
    const storage = memStorage();
    notePortalXpKeepRemount(storage, 1, {
      xpDelta: PORTAL_TRANSITION_XP,
      error: new Error("replica went away"),
      preXp: 100,
    });
    await assert.rejects(
      () =>
        resolveCommittedXpAfterPortalXpKeepRemount(
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

  it("honours victory leftover already below stamped preXp", async () => {
    const remount = remountLock();
    const storage = memStorage();
    notePortalXpKeepRemount(storage, 1, {
      xpDelta: 50,
      error: new Error("replica went away"),
      preXp: 100,
    });
    const live = await resolveCommittedXpAfterPortalXpKeepRemount(
      remount,
      async () => ({ experience: 24 }),
      storage,
      1,
    );
    assert.equal(live, 24);
  });
});

describe("persistPortalXpThroughPortalXpKeepRemount", () => {
  it("stamps remount XP keep after portal throw-after-add without unpaid death", async () => {
    const storage = memStorage();
    const persist = remountLock();
    let canisterXp = 100;
    await assert.rejects(
      () =>
        persistPortalXpThroughPortalXpKeepRemount({
          persist,
          storage,
          slot: 1,
          applyAndCommit: async () => {
            canisterXp += PORTAL_TRANSITION_XP;
            throw new Error("replica went away");
          },
        }),
      /replica went away/,
    );
    assert.equal(canisterXp, 110);
    assert.deepEqual(readPortalXpKeepRemount(storage, 1), { preXp: 100 });
    assert.equal(persist.snapshot().xp, 100, "portal commit never ran");
  });

  it("does not stamp keep on explicit applyRewards failed", async () => {
    const storage = memStorage();
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistPortalXpThroughPortalXpKeepRemount({
          persist,
          storage,
          slot: 1,
          applyAndCommit: async () => {
            throw new Error("applyRewards failed: over cap");
          },
        }),
      /applyRewards failed/,
    );
    assert.equal(readPortalXpKeepRemount(storage, 1), null);
  });

  it("does not stamp keep for a Doka-only credit", async () => {
    const storage = memStorage();
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistPortalXpThroughPortalXpKeepRemount({
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
    assert.equal(hasPortalXpKeepRemount(storage, 1), false);
  });

  it("clears a keep stamp explicitly", () => {
    const storage = memStorage();
    notePortalXpKeepRemount(storage, 1, {
      xpDelta: PORTAL_TRANSITION_XP,
      error: new Error("replica went away"),
      preXp: 100,
    });
    assert.equal(hasPortalXpKeepRemount(storage, 1), true);
    clearPortalXpKeepRemount(storage, 1);
    assert.equal(hasPortalXpKeepRemount(storage, 1), false);
  });
});

describe("distinct from unpaid-death remount #759", () => {
  it("notes keep with no unpaid pending ( #759 shouldNote requires pending )", () => {
    assert.equal(
      shouldNotePortalXpKeepRemount({
        xpDelta: PORTAL_TRANSITION_XP,
        error: new Error("replica went away"),
      }),
      true,
      "this sidecar does not gate on unpaid death pending",
    );
  });

  it("unpaid honour on top of gated portal leftover still applies 20%", () => {
    const pending = {
      slot: 1,
      preXp: 100,
      preDoka: 200,
      afterXp: 80,
      afterDoka: 120,
    };
    const wrote = applyUnpaidDeathPenaltyToWrite(pending, 110, 190);
    assert.equal(wrote.xp, 90, "unpaid 20 on portal 110");
    assert.equal(wrote.doka, 110, "unpaid 80 on spend snapshot 190");
  });
});
