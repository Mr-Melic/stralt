import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  releasePickupId,
  settleOneShotAfterCredit,
  tryClaimPickupId,
} from "./dokaPersist.ts";
import {
  LOOT_10_DOKA_FEAT_DOKA_REWARD,
  LOOT_10_DOKA_FEAT_THRESHOLD,
  groundDokaFeatCountKey,
  honourGroundDokaFeatCountHydrate,
  incrementGroundDokaFeatCount,
  nextGroundDokaFeatCountAfterSettle,
  persistGroundDokaFeatThroughSettle,
  readGroundDokaFeatCount,
  shouldCountGroundDokaFeatAfterSettle,
  shouldCountGroundDokaFeatOnClaim,
  shouldUnlockLoot10DokaFeat,
  writeGroundDokaFeatCount,
} from "./groundDokaFeatCountSettleWriteSkip.ts";
import { createProgressPersist } from "./progressPersist.ts";

const USER = "VampireBob";
const SLOT = 1;
const COIN = "doka-1-2";
const PRE_COUNT = 9;

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

function remountLock() {
  return createProgressPersist({
    doka: 200,
    xp: 100,
    level: 4,
  });
}

describe("shouldCountGroundDokaFeatAfterSettle", () => {
  it("counts a confirmed one-shot commit", () => {
    assert.equal(shouldCountGroundDokaFeatAfterSettle("commit"), true);
  });

  it("does not count an explicit applyRewards #err release", () => {
    assert.equal(shouldCountGroundDokaFeatAfterSettle("release"), false);
  });

  it("does not count transport-keep (unconfirmed credit)", () => {
    assert.equal(shouldCountGroundDokaFeatAfterSettle("keep"), false);
  });

  it("does not count on tryClaimPickupId", () => {
    assert.equal(shouldCountGroundDokaFeatOnClaim(), false);
  });
});

describe("nextGroundDokaFeatCountAfterSettle", () => {
  it("increments only on commit", () => {
    assert.equal(
      nextGroundDokaFeatCountAfterSettle({ kind: "commit", current: 9 }),
      10,
    );
    assert.equal(
      nextGroundDokaFeatCountAfterSettle({ kind: "release", current: 9 }),
      9,
    );
    assert.equal(
      nextGroundDokaFeatCountAfterSettle({ kind: "keep", current: 9 }),
      9,
    );
  });
});

describe("ungated claim-count then #err release then retry", () => {
  it("leftover remount / retry is 11 after one paid pickup", () => {
    const claimed = new Set<string>();
    let count = PRE_COUNT;
    assert.equal(tryClaimPickupId(claimed, COIN), true);
    assert.equal(shouldCountGroundDokaFeatOnClaim(), false);
    count += 1;
    assert.equal(count, 10, "live WX already wrote 10 before persist");
    const settle = settleOneShotAfterCredit({
      err: "rejected",
    });
    assert.equal(settle, "release");
    releasePickupId(claimed, COIN);
    assert.equal(
      nextGroundDokaFeatCountAfterSettle({
        kind: "release",
        current: PRE_COUNT,
      }),
      PRE_COUNT,
      "gated path stays 9",
    );
    assert.equal(tryClaimPickupId(claimed, COIN), true, "same coin retried");
    count += 1;
    assert.equal(count, 11, "ungated retry double-counts the feat");
    assert.equal(shouldUnlockLoot10DokaFeat(count), true);
    assert.equal(
      nextGroundDokaFeatCountAfterSettle({
        kind: "commit",
        current: PRE_COUNT,
      }),
      LOOT_10_DOKA_FEAT_THRESHOLD,
      "gated retry is 10 after one #ok",
    );
  });

  it("ungated #err at 9 already unlocks Loot Hunter before any credit", () => {
    const ungated = PRE_COUNT + 1;
    assert.equal(shouldUnlockLoot10DokaFeat(ungated), true);
    assert.equal(shouldUnlockLoot10DokaFeat(PRE_COUNT), false);
    assert.equal(LOOT_10_DOKA_FEAT_DOKA_REWARD, 75);
  });
});

describe("groundDokaFeatCountKey / storage", () => {
  it("uses the production namespaced feat key, not one-shot Doka keep", () => {
    const storage = memStorage();
    writeGroundDokaFeatCount(storage, USER, SLOT, 3);
    assert.equal(
      groundDokaFeatCountKey(USER, SLOT),
      "VampireBob_slot1_pbv_ground_doka_pickups",
    );
    assert.equal(
      storage.getItem("VampireBob_slot1_pbv_ground_doka_pickups"),
      "3",
    );
    assert.equal(storage.getItem("pbv_oneshot_doka_keep_remount_slot1"), null);
    assert.equal(storage.getItem("pbv_inventory_keep_remount_slot1"), null);
    assert.equal(storage.getItem("pbv_spell_bar_keep_remount_slot1"), null);
    assert.equal(
      storage.getItem("pbv_spell_level_keep_map_remount_slot1"),
      null,
    );
  });

  it("falls back to the legacy un-namespaced key", () => {
    assert.equal(
      groundDokaFeatCountKey(undefined, 2),
      "pbv_ground_doka_pickups",
    );
    assert.equal(groundDokaFeatCountKey("", 2), "pbv_ground_doka_pickups");
  });

  it("reads missing as 0 and increments", () => {
    const storage = memStorage();
    assert.equal(readGroundDokaFeatCount(storage, USER, SLOT), 0);
    assert.equal(incrementGroundDokaFeatCount(storage, USER, SLOT), 1);
    assert.equal(incrementGroundDokaFeatCount(storage, USER, SLOT), 2);
    assert.equal(readGroundDokaFeatCount(storage, USER, SLOT), 2);
  });

  it("floors a non-numeric blob to 0 before increment", () => {
    const storage = memStorage();
    storage.setItem(groundDokaFeatCountKey(USER, SLOT), "nope");
    assert.equal(readGroundDokaFeatCount(storage, USER, SLOT), 0);
  });
});

describe("honourGroundDokaFeatCountHydrate", () => {
  it("keeps remount 9 when in-flight settle later released", () => {
    assert.equal(
      honourGroundDokaFeatCountHydrate({
        remountCount: PRE_COUNT,
        settleKind: "release",
      }),
      PRE_COUNT,
    );
  });

  it("counts remount 9→10 when in-flight settle committed", () => {
    assert.equal(
      honourGroundDokaFeatCountHydrate({
        remountCount: PRE_COUNT,
        settleKind: "commit",
      }),
      10,
    );
  });

  it("does not count remount keep (unconfirmed)", () => {
    assert.equal(
      honourGroundDokaFeatCountHydrate({
        remountCount: PRE_COUNT,
        settleKind: "keep",
      }),
      PRE_COUNT,
    );
  });

  it("returns remount count when no settle ran", () => {
    assert.equal(
      honourGroundDokaFeatCountHydrate({
        remountCount: 4,
        settleKind: null,
      }),
      4,
    );
  });
});

describe("persistGroundDokaFeatThroughSettle", () => {
  it("increments after a commit settle", async () => {
    const storage = memStorage();
    writeGroundDokaFeatCount(storage, USER, SLOT, PRE_COUNT);
    const persist = remountLock();
    const claimed = new Set<string>();
    assert.equal(tryClaimPickupId(claimed, COIN), true);
    const settle = await persistGroundDokaFeatThroughSettle({
      persist,
      storage,
      userId: USER,
      slot: SLOT,
      applyAndSettle: async () => ({ kind: "commit" as const, doka: 250 }),
    });
    assert.equal(settle.kind, "commit");
    assert.equal(readGroundDokaFeatCount(storage, USER, SLOT), 10);
    assert.equal(shouldUnlockLoot10DokaFeat(10), true);
  });

  it("does not increment after a release settle", async () => {
    const storage = memStorage();
    writeGroundDokaFeatCount(storage, USER, SLOT, PRE_COUNT);
    const persist = remountLock();
    const claimed = new Set<string>();
    assert.equal(tryClaimPickupId(claimed, COIN), true);
    const settle = await persistGroundDokaFeatThroughSettle({
      persist,
      storage,
      userId: USER,
      slot: SLOT,
      applyAndSettle: async () => ({ kind: "release" as const }),
    });
    assert.equal(settle.kind, "release");
    releasePickupId(claimed, COIN);
    assert.equal(readGroundDokaFeatCount(storage, USER, SLOT), PRE_COUNT);
    assert.equal(tryClaimPickupId(claimed, COIN), true);
    const retry = await persistGroundDokaFeatThroughSettle({
      persist,
      storage,
      userId: USER,
      slot: SLOT,
      applyAndSettle: async () => ({ kind: "commit" as const, doka: 230 }),
    });
    assert.equal(retry.kind, "commit");
    assert.equal(
      readGroundDokaFeatCount(storage, USER, SLOT),
      10,
      "one paid pickup after a released #err is 10, not 11",
    );
  });

  it("does not increment after a keep settle", async () => {
    const storage = memStorage();
    writeGroundDokaFeatCount(storage, USER, SLOT, PRE_COUNT);
    const persist = remountLock();
    await persistGroundDokaFeatThroughSettle({
      persist,
      storage,
      userId: USER,
      slot: SLOT,
      applyAndSettle: async () => ({ kind: "keep" as const }),
    });
    assert.equal(readGroundDokaFeatCount(storage, USER, SLOT), PRE_COUNT);
    assert.equal(shouldUnlockLoot10DokaFeat(PRE_COUNT), false);
  });

  it("does not unlock Loot Hunter from a released pickup at 9", async () => {
    const storage = memStorage();
    writeGroundDokaFeatCount(storage, USER, SLOT, PRE_COUNT);
    const persist = remountLock();
    await persistGroundDokaFeatThroughSettle({
      persist,
      storage,
      userId: USER,
      slot: SLOT,
      applyAndSettle: async () => ({ kind: "release" as const }),
    });
    const remount = readGroundDokaFeatCount(storage, USER, SLOT);
    assert.equal(shouldUnlockLoot10DokaFeat(remount), false);
    assert.equal(
      honourGroundDokaFeatCountHydrate({
        remountCount: remount,
        settleKind: "release",
      }),
      PRE_COUNT,
    );
  });

  it("runs beforeEach so a death flush can still precede the credit", async () => {
    const storage = memStorage();
    let flushed = 0;
    const persist = createProgressPersist(
      { doka: 200, xp: 100, level: 4 },
      {
        beforeEach: async () => {
          flushed += 1;
        },
      },
    );
    await persistGroundDokaFeatThroughSettle({
      persist,
      storage,
      userId: USER,
      slot: SLOT,
      applyAndSettle: async () => ({ kind: "commit" as const, doka: 250 }),
    });
    assert.equal(flushed, 1);
    assert.equal(readGroundDokaFeatCount(storage, USER, SLOT), 1);
  });
});

describe("distinct from one-shot Doka keep #800, shrine #1156, inventory #1276", () => {
  it("notes feat count with no unpaid pending and a commit settle", () => {
    assert.equal(shouldCountGroundDokaFeatAfterSettle("commit"), true);
    assert.equal(shouldCountGroundDokaFeatOnClaim(), false);
  });

  it("uses pbv_ground_doka_pickups, not Doka-keep / inventory / bar keys", () => {
    const storage = memStorage();
    incrementGroundDokaFeatCount(storage, USER, 2);
    assert.equal(
      groundDokaFeatCountKey(USER, 2),
      "VampireBob_slot2_pbv_ground_doka_pickups",
    );
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot2"), null);
    assert.equal(storage.getItem("pbv_oneshot_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_inventory_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_spell_bar_keep_remount_slot2"), null);
  });

  it("#800 remount shop honours replica Doka; this leftover is feat count 10", () => {
    const leftoverDoka = 250;
    const leftoverFeat = 10;
    assert.equal(leftoverDoka, 250, "#800 gated Doka path");
    assert.equal(
      leftoverFeat,
      LOOT_10_DOKA_FEAT_THRESHOLD,
      "ungated feat already at Loot Hunter",
    );
    assert.equal(
      nextGroundDokaFeatCountAfterSettle({
        kind: "release",
        current: PRE_COUNT,
      }),
      PRE_COUNT,
    );
  });

  it("slot 1 increment does not clobber slot 2", () => {
    const storage = memStorage();
    incrementGroundDokaFeatCount(storage, USER, 1);
    incrementGroundDokaFeatCount(storage, USER, 1);
    incrementGroundDokaFeatCount(storage, USER, 2);
    assert.equal(readGroundDokaFeatCount(storage, USER, 1), 2);
    assert.equal(readGroundDokaFeatCount(storage, USER, 2), 1);
  });
});
