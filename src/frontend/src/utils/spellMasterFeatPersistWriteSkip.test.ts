import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SPELL_BAR_SAVE_DEBOUNCE_MS,
  SPELL_MASTER_BAR_COUNT,
  SPELL_MASTER_FEAT_CONDITION,
  SPELL_MASTER_FEAT_DOKA_REWARD,
  isSpellBarPersistOk,
  leftoverSpellMasterFeatUnlocksAfterFailedPersist,
  liveWxFlushesSpellBarOnUnmount,
  liveWxUnlocksSpellMasterFeatOnBarLength,
  persistSpellBarThroughFeatGate,
  shouldFlushSpellBarOnUnmount,
  shouldUnlockSpellMasterFeatAfterPersist,
  shouldUnlockSpellMasterFeatOnBarLength,
  shouldUnlockSpellMasterFeatOnOptimisticSet,
  shouldUnlockSpellMasterFeatOnVictorySnap,
  spellBarOrderCount,
} from "./spellMasterFeatPersistWriteSkip.ts";

const SEVEN = [
  "strike",
  "heal",
  "shield",
  "fireball",
  "ice",
  "push",
  "pull",
] as const;
const EIGHT = [...SEVEN, "summon"] as const;

describe("shouldUnlockSpellMasterFeatAfterPersist", () => {
  it("unlocks only after setSpellBarOrder #ok with 8 ids", () => {
    assert.equal(shouldUnlockSpellMasterFeatAfterPersist(true, 8), true);
  });

  it("does not unlock on persist false (unmount / #err / catch)", () => {
    assert.equal(shouldUnlockSpellMasterFeatAfterPersist(false, 8), false);
  });

  it("does not unlock a confirmed 7-spell bar", () => {
    assert.equal(shouldUnlockSpellMasterFeatAfterPersist(true, 7), false);
  });

  it("does not unlock on the equip click or the length effect", () => {
    assert.equal(shouldUnlockSpellMasterFeatOnOptimisticSet(), false);
    assert.equal(shouldUnlockSpellMasterFeatOnBarLength(), false);
    assert.equal(shouldUnlockSpellMasterFeatOnVictorySnap(), false);
  });

  it("records that live WX unlocks from the length effect", () => {
    assert.equal(liveWxUnlocksSpellMasterFeatOnBarLength(), true);
  });
});

describe("isSpellBarPersistOk / spellBarOrderCount", () => {
  it("treats candid #ok shapes as confirmed", () => {
    assert.equal(isSpellBarPersistOk({ _ok: null }), true);
    assert.equal(isSpellBarPersistOk({ ok: null }), true);
    assert.equal(isSpellBarPersistOk(true), true);
  });

  it("treats #err and missing results as unconfirmed", () => {
    assert.equal(
      isSpellBarPersistOk({ _err: "setSpellBarOrder failed" }),
      false,
    );
    assert.equal(isSpellBarPersistOk({ err: "banned" }), false);
    assert.equal(isSpellBarPersistOk(false), false);
    assert.equal(isSpellBarPersistOk(null), false);
  });

  it("counts non-empty spell ids only", () => {
    assert.equal(spellBarOrderCount(SEVEN), 7);
    assert.equal(spellBarOrderCount(EIGHT), 8);
    assert.equal(spellBarOrderCount(["strike", "", "heal"]), 2);
    assert.equal(spellBarOrderCount(null), 0);
  });
});

describe("ungated length unlock then persist never lands", () => {
  it("leftover is a 100 Doka Spell Master claim from a 7-spell replica", () => {
    const optimisticCount = spellBarOrderCount(EIGHT);
    const replicaCount = spellBarOrderCount(SEVEN);
    assert.equal(optimisticCount, SPELL_MASTER_BAR_COUNT);
    assert.equal(replicaCount, 7);

    const ungatedUnlockOnBarLength = liveWxUnlocksSpellMasterFeatOnBarLength();
    assert.equal(ungatedUnlockOnBarLength, true, "live WX already unlocked");
    assert.equal(shouldUnlockSpellMasterFeatOnBarLength(), false);

    const persistOk = false;
    assert.equal(liveWxFlushesSpellBarOnUnmount(), false);
    assert.equal(shouldFlushSpellBarOnUnmount(), true);
    assert.equal(SPELL_BAR_SAVE_DEBOUNCE_MS, 1000);

    assert.equal(
      leftoverSpellMasterFeatUnlocksAfterFailedPersist({
        persistOk,
        optimisticCount,
        replicaCount,
        ungatedUnlockOnBarLength,
      }),
      true,
    );
    assert.equal(
      shouldUnlockSpellMasterFeatAfterPersist(persistOk, optimisticCount),
      false,
    );
    assert.equal(SPELL_MASTER_FEAT_CONDITION, "spell_master_8");
    assert.equal(SPELL_MASTER_FEAT_DOKA_REWARD, 100);
  });

  it("gated path does not unlock when persist false even if HUD shows 8", () => {
    assert.equal(
      leftoverSpellMasterFeatUnlocksAfterFailedPersist({
        persistOk: false,
        optimisticCount: 8,
        replicaCount: 7,
        ungatedUnlockOnBarLength: shouldUnlockSpellMasterFeatOnBarLength(),
      }),
      false,
    );
  });

  it("does not leftover-unlock when replica already stored 8", () => {
    assert.equal(
      leftoverSpellMasterFeatUnlocksAfterFailedPersist({
        persistOk: false,
        optimisticCount: 8,
        replicaCount: 8,
        ungatedUnlockOnBarLength: true,
      }),
      false,
      "replica already has the bar — feat is earned, not this leftover",
    );
  });

  it("does not leftover-unlock a 7-spell optimistic bar", () => {
    assert.equal(
      leftoverSpellMasterFeatUnlocksAfterFailedPersist({
        persistOk: false,
        optimisticCount: 7,
        replicaCount: 7,
        ungatedUnlockOnBarLength: true,
      }),
      false,
    );
  });

  it("does not leftover-unlock after a confirmed persist", () => {
    assert.equal(
      leftoverSpellMasterFeatUnlocksAfterFailedPersist({
        persistOk: true,
        optimisticCount: 8,
        replicaCount: 8,
        ungatedUnlockOnBarLength: true,
      }),
      false,
    );
    assert.equal(shouldUnlockSpellMasterFeatAfterPersist(true, 8), true);
  });

  it("victory snap of optimistic 8 is the same leftover while replica is 7", () => {
    assert.equal(shouldUnlockSpellMasterFeatOnVictorySnap(), false);
    assert.equal(
      leftoverSpellMasterFeatUnlocksAfterFailedPersist({
        persistOk: false,
        optimisticCount: 8,
        replicaCount: 7,
        ungatedUnlockOnBarLength: true,
      }),
      true,
    );
  });
});

describe("persistSpellBarThroughFeatGate", () => {
  it("unlocks after a #ok persist of 8 ids", async () => {
    const result = await persistSpellBarThroughFeatGate({
      persistBar: async () => ({ _ok: null }),
      orderCount: 8,
    });
    assert.deepEqual(result, { ok: true, unlockFeat: true });
  });

  it("does not unlock after persist #err", async () => {
    const result = await persistSpellBarThroughFeatGate({
      persistBar: async () => ({ _err: "setSpellBarOrder failed" }),
      orderCount: 8,
    });
    assert.deepEqual(result, { ok: false, unlockFeat: false });
  });

  it("does not unlock when persistBar throws", async () => {
    const result = await persistSpellBarThroughFeatGate({
      persistBar: async () => {
        throw new Error("replica went away");
      },
      orderCount: 8,
    });
    assert.deepEqual(result, { ok: false, unlockFeat: false });
  });

  it("does not unlock a transport-false throw-after-accept", async () => {
    const result = await persistSpellBarThroughFeatGate({
      persistBar: async () => false,
      orderCount: 8,
    });
    assert.equal(result.unlockFeat, false);
    assert.equal(
      shouldUnlockSpellMasterFeatAfterPersist(result.ok, 8),
      false,
      "delayed Spell Master is safer than minting 100 Doka from an unconfirmed bar",
    );
  });

  it("does not unlock #ok of a 7-spell order", async () => {
    const result = await persistSpellBarThroughFeatGate({
      persistBar: async () => ({ ok: null }),
      orderCount: 7,
    });
    assert.deepEqual(result, { ok: true, unlockFeat: false });
  });
});

describe("distinct from leftover bar #1268, jackpot #1317, loot_10_doka #1308", () => {
  it("is spell_master_8 100 Doka, not jackpot_heal 200 or loot_10_doka 75", () => {
    assert.equal(SPELL_MASTER_FEAT_CONDITION, "spell_master_8");
    assert.equal(SPELL_MASTER_FEAT_DOKA_REWARD, 100);
    assert.notEqual(SPELL_MASTER_FEAT_CONDITION, "jackpot_heal");
    assert.notEqual(SPELL_MASTER_FEAT_CONDITION, "loot_10_doka");
  });

  it("does not stamp leftover-Doka / inventory / bar keep keys", () => {
    const storage = new Map<string, string>();
    assert.equal(storage.get("pbv_spell_bar_keep_remount_slot1"), undefined);
    assert.equal(
      storage.get("pbv_absolute_doka_throw_keep_remount_slot1"),
      undefined,
    );
    assert.equal(storage.get("pbv_inventory_keep_remount_slot1"), undefined);
    assert.equal(
      storage.get("VampireBob_slot1_pbv_ground_doka_pickups"),
      undefined,
    );
    assert.equal(storage.get("pbv_pending_death_penalty_slot1"), undefined);
  });

  it("#1268 remount honours bar HUD; this leftover is the feat", () => {
    const leftoverReplica = spellBarOrderCount(SEVEN);
    assert.equal(leftoverReplica, 7, "replica still 7, not #1268 keep 8");
    assert.equal(shouldUnlockSpellMasterFeatAfterPersist(false, 8), false);
    assert.equal(SPELL_MASTER_FEAT_DOKA_REWARD, 100);
  });

  it("in-battle stash does not unlock (bar still 7 until cleanupBattle)", () => {
    assert.equal(
      leftoverSpellMasterFeatUnlocksAfterFailedPersist({
        persistOk: false,
        optimisticCount: 7,
        replicaCount: 7,
        ungatedUnlockOnBarLength: true,
      }),
      false,
    );
  });
});
