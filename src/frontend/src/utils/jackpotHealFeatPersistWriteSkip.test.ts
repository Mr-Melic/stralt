import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  resolveOverworldHealSpend,
  shouldRollbackFailedHeal,
} from "./itemShop.ts";
import {
  JACKPOT_HEAL_BANNER_MS,
  JACKPOT_HEAL_FEAT_CONDITION,
  JACKPOT_HEAL_FEAT_DOKA_REWARD,
  leftoverJackpotHealFeatUnlocksAfterFailedPersist,
  liveWxUnlocksJackpotHealFeatOnBanner,
  persistJackpotHealThroughFeatGate,
  shouldShowJackpotHealBannerOnClick,
  shouldUnlockJackpotHealFeatAfterPersist,
  shouldUnlockJackpotHealFeatOnBanner,
  shouldUnlockJackpotHealFeatOnClick,
} from "./jackpotHealFeatPersistWriteSkip.ts";
import { createProgressPersist } from "./progressPersist.ts";

const PRE_HP = 50;
const MAX_HP = 200;
const PRE_DOKA = 200;

describe("shouldUnlockJackpotHealFeatAfterPersist", () => {
  it("unlocks only after saveBattleStats returns true", () => {
    assert.equal(shouldUnlockJackpotHealFeatAfterPersist(true), true);
  });

  it("does not unlock on persist false (reject / unseeded / catch)", () => {
    assert.equal(shouldUnlockJackpotHealFeatAfterPersist(false), false);
  });

  it("does not unlock on the Heal click or the banner effect", () => {
    assert.equal(shouldUnlockJackpotHealFeatOnClick(), false);
    assert.equal(shouldUnlockJackpotHealFeatOnBanner(), false);
  });

  it("records that live WX unlocks from the banner", () => {
    assert.equal(liveWxUnlocksJackpotHealFeatOnBanner(), true);
  });
});

describe("shouldShowJackpotHealBannerOnClick", () => {
  it("keeps banner juice on a jackpot click", () => {
    assert.equal(shouldShowJackpotHealBannerOnClick(true), true);
    assert.equal(shouldShowJackpotHealBannerOnClick(false), false);
    assert.equal(JACKPOT_HEAL_BANNER_MS, 3000);
  });
});

describe("ungated banner unlock then persist false rollback", () => {
  it("leftover is a 200 Doka Jackpot claim from a rolled-back heal", () => {
    const spend = resolveOverworldHealSpend({
      currentHp: PRE_HP,
      maxHp: MAX_HP,
      liveDoka: PRE_DOKA,
      jackpot: true,
    });
    assert.deepEqual(spend, {
      nextHp: MAX_HP,
      nextDoka: PRE_DOKA - 1,
      hpGained: MAX_HP - PRE_HP,
      dokaCost: 1,
      jackpot: true,
    });

    const ungatedUnlockOnBanner = liveWxUnlocksJackpotHealFeatOnBanner();
    assert.equal(ungatedUnlockOnBanner, true, "live WX already unlocked");
    assert.equal(shouldUnlockJackpotHealFeatOnBanner(), false);

    const persistOk = false;
    assert.equal(
      shouldRollbackFailedHeal({
        liveHp: spend!.nextHp,
        liveDoka: spend!.nextDoka,
        expectedHp: spend!.nextHp,
        expectedDoka: spend!.nextDoka,
      }),
      true,
      "same-click reject still owns the live refs",
    );
    assert.equal(
      leftoverJackpotHealFeatUnlocksAfterFailedPersist({
        persistOk,
        liveHp: spend!.nextHp,
        liveDoka: spend!.nextDoka,
        expectedHp: spend!.nextHp,
        expectedDoka: spend!.nextDoka,
        ungatedUnlockOnBanner,
      }),
      true,
    );
    assert.equal(shouldUnlockJackpotHealFeatAfterPersist(persistOk), false);
    assert.equal(JACKPOT_HEAL_FEAT_CONDITION, "jackpot_heal");
    assert.equal(JACKPOT_HEAL_FEAT_DOKA_REWARD, 200);
  });

  it("gated path does not unlock when persist false even if banner showed", () => {
    const spend = resolveOverworldHealSpend({
      currentHp: PRE_HP,
      maxHp: MAX_HP,
      liveDoka: PRE_DOKA,
      jackpot: true,
    });
    assert.equal(shouldShowJackpotHealBannerOnClick(spend!.jackpot), true);
    assert.equal(
      leftoverJackpotHealFeatUnlocksAfterFailedPersist({
        persistOk: false,
        liveHp: spend!.nextHp,
        liveDoka: spend!.nextDoka,
        expectedHp: spend!.nextHp,
        expectedDoka: spend!.nextDoka,
        ungatedUnlockOnBanner: shouldUnlockJackpotHealFeatOnBanner(),
      }),
      false,
    );
  });

  it("does not treat a superseded heal rollback as this leftover", () => {
    const spend = resolveOverworldHealSpend({
      currentHp: PRE_HP,
      maxHp: MAX_HP,
      liveDoka: PRE_DOKA,
      jackpot: true,
    });
    assert.equal(
      leftoverJackpotHealFeatUnlocksAfterFailedPersist({
        persistOk: false,
        liveHp: 110,
        liveDoka: 50,
        expectedHp: spend!.nextHp,
        expectedDoka: spend!.nextDoka,
        ungatedUnlockOnBanner: true,
      }),
      false,
      "later potion / credit moved live refs — leftover heal rollback is skipped",
    );
  });

  it("does not leftover-unlock after a confirmed persist", () => {
    const spend = resolveOverworldHealSpend({
      currentHp: PRE_HP,
      maxHp: MAX_HP,
      liveDoka: PRE_DOKA,
      jackpot: true,
    });
    assert.equal(
      leftoverJackpotHealFeatUnlocksAfterFailedPersist({
        persistOk: true,
        liveHp: spend!.nextHp,
        liveDoka: spend!.nextDoka,
        expectedHp: spend!.nextHp,
        expectedDoka: spend!.nextDoka,
        ungatedUnlockOnBanner: true,
      }),
      false,
    );
    assert.equal(shouldUnlockJackpotHealFeatAfterPersist(true), true);
  });
});

describe("persistJackpotHealThroughFeatGate", () => {
  it("unlocks after a true persist", async () => {
    const persist = createProgressPersist({
      doka: PRE_DOKA,
      xp: 100,
      level: 4,
    });
    const result = await persistJackpotHealThroughFeatGate({
      persistHeal: () =>
        persist.enqueue(async () => {
          persist.commit({ doka: PRE_DOKA - 1 });
          return true;
        }),
    });
    assert.deepEqual(result, { ok: true, unlockFeat: true });
    assert.equal(persist.snapshot().doka, PRE_DOKA - 1);
  });

  it("does not unlock after persist false", async () => {
    const result = await persistJackpotHealThroughFeatGate({
      persistHeal: async () => false,
    });
    assert.deepEqual(result, { ok: false, unlockFeat: false });
  });

  it("does not unlock when persistHeal throws", async () => {
    const result = await persistJackpotHealThroughFeatGate({
      persistHeal: async () => {
        throw new Error("doka-spend save skipped: wallet not seeded");
      },
    });
    assert.deepEqual(result, { ok: false, unlockFeat: false });
  });

  it("does not unlock a transport-false throw-after-accept", async () => {
    const result = await persistJackpotHealThroughFeatGate({
      persistHeal: async () => false,
    });
    assert.equal(result.unlockFeat, false);
    assert.equal(
      shouldUnlockJackpotHealFeatAfterPersist(result.ok),
      false,
      "delayed Jackpot is safer than minting 200 Doka from unconfirmed heal",
    );
  });

  it("runs on the persist lock so a death flush can still precede the heal", async () => {
    let flushed = 0;
    const persist = createProgressPersist(
      { doka: PRE_DOKA, xp: 100, level: 4 },
      {
        beforeEach: async () => {
          flushed += 1;
        },
      },
    );
    const result = await persistJackpotHealThroughFeatGate({
      persistHeal: () =>
        persist.enqueue(async () => {
          persist.commit({ doka: PRE_DOKA - 1 });
          return true;
        }),
    });
    assert.equal(flushed, 1);
    assert.equal(result.unlockFeat, true);
  });
});

describe("distinct from leftover Doka #964, HP #860, loot_10_doka #1308", () => {
  it("is jackpot_heal 200 Doka, not loot_10_doka 75", () => {
    assert.equal(JACKPOT_HEAL_FEAT_CONDITION, "jackpot_heal");
    assert.equal(JACKPOT_HEAL_FEAT_DOKA_REWARD, 200);
    assert.notEqual(JACKPOT_HEAL_FEAT_CONDITION, "loot_10_doka");
  });

  it("does not stamp leftover-Doka / inventory / bar keep keys", () => {
    const storage = new Map<string, string>();
    assert.equal(
      storage.get("pbv_absolute_doka_throw_keep_remount_slot1"),
      undefined,
    );
    assert.equal(
      storage.get("pbv_absolute_hp_throw_keep_remount_slot1"),
      undefined,
    );
    assert.equal(storage.get("pbv_oneshot_doka_keep_remount_slot1"), undefined);
    assert.equal(
      storage.get("VampireBob_slot1_pbv_ground_doka_pickups"),
      undefined,
    );
    assert.equal(storage.get("pbv_inventory_keep_remount_slot1"), undefined);
    assert.equal(storage.get("pbv_spell_bar_keep_remount_slot1"), undefined);
    assert.equal(storage.get("pbv_pending_death_penalty_slot1"), undefined);
  });

  it("#964 remount shop honours replica Doka; this leftover is the feat", () => {
    const leftoverDoka = PRE_DOKA;
    assert.equal(leftoverDoka, 200, "rolled-back wallet, not #964 keep 199");
    assert.equal(shouldUnlockJackpotHealFeatAfterPersist(false), false);
    assert.equal(JACKPOT_HEAL_FEAT_DOKA_REWARD, 200);
  });

  it("non-jackpot heal does not show the banner or unlock", () => {
    const spend = resolveOverworldHealSpend({
      currentHp: PRE_HP,
      maxHp: MAX_HP,
      liveDoka: PRE_DOKA,
      jackpot: false,
    });
    assert.equal(spend!.jackpot, false);
    assert.equal(shouldShowJackpotHealBannerOnClick(false), false);
    assert.equal(shouldUnlockJackpotHealFeatOnClick(), false);
  });
});
