import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PORTAL_TRANSITION_XP } from "./applyRewardsResult.ts";
import {
  resolveCommittedXpAfterDeathCutCreditRemount,
  shouldHonourDeathCutCreditRemountLiveXp,
  xpForDeathCutCreditRemountHonour,
} from "./deathCutConfirmedCreditReplayRemountXpHonour.ts";
import {
  type PendingDeathPenalty,
  applyUnpaidDeathPenaltyToWrite,
} from "./deathPenalty.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  clampAbsoluteProgressWrite,
  createProgressPersist,
} from "./progressPersist.ts";

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

describe("shouldHonourDeathCutCreditRemountLiveXp", () => {
  it("fetches when remount leftover equals unpaid Play-entry preXp", () => {
    assert.equal(
      shouldHonourDeathCutCreditRemountLiveXp({
        remountXp: 100,
        pendingPreXp: 100,
        pendingAfterXp: 80,
      }),
      true,
    );
  });

  it("does not fetch session catch-cut leftover (lock still 80)", () => {
    assert.equal(
      shouldHonourDeathCutCreditRemountLiveXp({
        remountXp: 80,
        pendingPreXp: 100,
        pendingAfterXp: 80,
      }),
      false,
    );
  });

  it("does not fetch after a session portal commit already moved leftover", () => {
    assert.equal(
      shouldHonourDeathCutCreditRemountLiveXp({
        remountXp: 100 + PORTAL_TRANSITION_XP,
        pendingPreXp: 100,
        pendingAfterXp: 80,
      }),
      false,
    );
  });

  it("does not fetch cutConfirmed pending", () => {
    assert.equal(
      shouldHonourDeathCutCreditRemountLiveXp({
        remountXp: 100,
        pendingPreXp: 100,
        pendingAfterXp: 80,
        cutConfirmed: true,
      }),
      false,
    );
  });
});

describe("death-fail catch-commit then remount honour vs Play-entry leftover XP", () => {
  it("leftover remount honour writes XP 80 over canister 110 after a portal grant", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
    // 2. Death saveBattleStats rejects. Catch commits lock 120 / XP 80.
    // 3. Ground Doka applyRewards +50 #ok. Settle commit 250. Canister 250.
    //    #742 remount stamp committedXp stays catch-cut 80.
    // 4. White portal persistIncrementalRewards(0, 10) invokes then throws.
    //    Canister XP 110. Commit never runs.
    // 5. Actor reconnect remounts. New lock Play-entry XP 100.
    //    #742 remount resolve seeds Doka 250. Leftover honour uses 100 → 80.
    const remount = remountLock();
    const leftoverXp = remount.snapshot().xp;
    const wrote = honourHealWrite(UNPAID, leftoverXp, 250, 10);
    assert.equal(leftoverXp, 100);
    assert.equal(wrote.xp, 80, "Play-entry honour wiped portal +10");
    assert.equal(wrote.doka, 160);
  });

  it("does not saveBattleStats-wipe portal +10 after a gated live XP honour", () => {
    const remount = remountLock();
    const honourXp = xpForDeathCutCreditRemountHonour({
      remountXp: remount.snapshot().xp,
      liveXp: 100 + PORTAL_TRANSITION_XP,
      pendingPreXp: UNPAID.preXp,
      pendingAfterXp: UNPAID.afterXp,
    });
    assert.equal(honourXp, 110);
    const wrote = honourHealWrite(UNPAID, honourXp ?? 0, 250, 10);
    assert.equal(wrote.xp, 90, "unpaid 20 applied on top of portal +10");
    assert.equal(wrote.doka, 160, "pickup + unpaid 20/40 + heal spend");
  });

  it("leftover remount honour writes XP 80 over canister 110 after a feat seed", () => {
    const remount = remountLock();
    const wrote = honourHealWrite(UNPAID, remount.snapshot().xp, 300, 10);
    assert.equal(wrote.xp, 80, "Play-entry honour wiped portal +10");
    assert.equal(wrote.doka, 210);
  });

  it("does not wipe portal +10 after a gated feat live XP honour", () => {
    const remount = remountLock();
    const honourXp = xpForDeathCutCreditRemountHonour({
      remountXp: remount.snapshot().xp,
      liveXp: 100 + PORTAL_TRANSITION_XP,
      pendingPreXp: UNPAID.preXp,
      pendingAfterXp: UNPAID.afterXp,
    });
    const wrote = honourHealWrite(UNPAID, honourXp ?? 0, 300, 10);
    assert.equal(wrote.xp, 90);
    assert.equal(wrote.doka, 210, "feat + unpaid 20/40 + heal spend");
  });

  it("leftover remount honour writes XP 80 over canister 110 after a GameKey seed", () => {
    const remount = remountLock();
    const wrote = honourHealWrite(UNPAID, remount.snapshot().xp, 1200, 10);
    assert.equal(wrote.xp, 80, "Play-entry honour wiped portal +10");
    assert.equal(wrote.doka, 1110);
  });

  it("does not wipe portal +10 after a gated GameKey live XP honour", () => {
    const remount = remountLock();
    const honourXp = xpForDeathCutCreditRemountHonour({
      remountXp: remount.snapshot().xp,
      liveXp: 100 + PORTAL_TRANSITION_XP,
      pendingPreXp: UNPAID.preXp,
      pendingAfterXp: UNPAID.afterXp,
    });
    const wrote = honourHealWrite(UNPAID, honourXp ?? 0, 1200, 10);
    assert.equal(wrote.xp, 90);
    assert.equal(wrote.doka, 1110);
  });

  it("leftover remount honour taxes Play-entry 100 after a victory leftover 24", () => {
    const remount = remountLock();
    const wrote = honourHealWrite(UNPAID, remount.snapshot().xp, 280, 10);
    assert.equal(wrote.xp, 80, "Play-entry honour ignores victory leftover 24");
    assert.equal(wrote.doka, 190);
  });

  it("honours victory leftover 24 from the replica instead of Play-entry 100", () => {
    const remount = remountLock();
    const honourXp = xpForDeathCutCreditRemountHonour({
      remountXp: remount.snapshot().xp,
      liveXp: 24,
      pendingPreXp: UNPAID.preXp,
      pendingAfterXp: UNPAID.afterXp,
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
    const honourXp = xpForDeathCutCreditRemountHonour({
      remountXp: remount.snapshot().xp,
      liveXp: 100,
      pendingPreXp: UNPAID.preXp,
      pendingAfterXp: UNPAID.afterXp,
    });
    assert.equal(honourXp, 100);
    const wrote = honourHealWrite(UNPAID, honourXp ?? 0, 250, 10);
    assert.equal(wrote.xp, 80);
    assert.equal(wrote.doka, 160);
  });

  it("fail-closes when remount leftover looks like Play-entry and live XP is missing", () => {
    assert.equal(
      xpForDeathCutCreditRemountHonour({
        remountXp: 100,
        liveXp: null,
        pendingPreXp: UNPAID.preXp,
        pendingAfterXp: UNPAID.afterXp,
      }),
      null,
    );
  });

  it("death-fail remount without a later XP grant still honours 100 → 80", () => {
    const remount = remountLock();
    const honourXp = xpForDeathCutCreditRemountHonour({
      remountXp: remount.snapshot().xp,
      liveXp: 100,
      pendingPreXp: UNPAID.preXp,
      pendingAfterXp: UNPAID.afterXp,
    });
    const wrote = honourHealWrite(UNPAID, honourXp ?? 0, 200, 0);
    assert.equal(wrote.xp, 80);
    assert.equal(wrote.doka, 120);
  });

  it("session catch-cut lock still honours from committed leftover 80", () => {
    const session = createProgressPersist({ doka: 120, xp: 80, level: 4 });
    const honourXp = xpForDeathCutCreditRemountHonour({
      remountXp: session.snapshot().xp,
      liveXp: 100 + PORTAL_TRANSITION_XP,
      pendingPreXp: UNPAID.preXp,
      pendingAfterXp: UNPAID.afterXp,
    });
    assert.equal(
      honourXp,
      80,
      "same-session catch-cut leftover is already the honour base",
    );
  });
});

describe("resolveCommittedXpAfterDeathCutCreditRemount", () => {
  it("leftover remount snapshot XP 100 never fetches canister 110", async () => {
    const remount = remountLock();
    let fetched = 0;
    const leftover = remount.snapshot().xp;
    assert.equal(leftover, 100);
    assert.equal(fetched, 0, "leftover honour never called getCharacter");
  });

  it("fetches replica leftover when remount lock still looks like Play-entry", async () => {
    const remount = remountLock();
    const live = await resolveCommittedXpAfterDeathCutCreditRemount(
      remount,
      async () => ({ experience: 100 + PORTAL_TRANSITION_XP }),
      UNPAID,
    );
    assert.equal(live, 110);
    const wrote = honourHealWrite(UNPAID, live, 250, 10);
    assert.equal(wrote.xp, 90);
  });

  it("reads bigint experience from a character record", async () => {
    const remount = remountLock();
    const live = await resolveCommittedXpAfterDeathCutCreditRemount(
      remount,
      async () => ({ experience: 110n }),
      UNPAID,
    );
    assert.equal(live, 110);
  });

  it("fail-closes when getCharacter throws after a Play-entry remount", async () => {
    const remount = remountLock();
    await assert.rejects(
      () =>
        resolveCommittedXpAfterDeathCutCreditRemount(
          remount,
          async () => {
            throw new Error("replica unavailable");
          },
          UNPAID,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(remount.snapshot().xp, 100);
  });

  it("fail-closes when getCharacter returns no experience", async () => {
    const remount = remountLock();
    await assert.rejects(
      () =>
        resolveCommittedXpAfterDeathCutCreditRemount(
          remount,
          async () => ({}),
          UNPAID,
        ),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
  });

  it("returns remount leftover when there is no unpaid pending", async () => {
    const remount = remountLock();
    const live = await resolveCommittedXpAfterDeathCutCreditRemount(
      remount,
      async () => ({ experience: 110 }),
      null,
    );
    assert.equal(live, 100);
  });

  it("returns remount leftover for cutConfirmed pending", async () => {
    const remount = remountLock();
    const live = await resolveCommittedXpAfterDeathCutCreditRemount(
      remount,
      async () => ({ experience: 110 }),
      { ...UNPAID, cutConfirmed: true },
    );
    assert.equal(live, 100);
  });
});
