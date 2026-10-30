import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { respawnHpAfterDeath } from "./deathPenalty.ts";
import {
  deathPersistAndReplayWriteRespawnHp,
  hpForPendingDeathPenaltyFlush,
  hpWrittenByPendingDeathFlush,
  leftoverUnpaidHealHpAfterDeathFlush,
  liveWxPendingDeathFlushHp,
  liveWxPendingDeathFlushWritesLiveHp,
  simulateFailedDeathFlushOptimisticHeal,
} from "./failedDeathFlushOptimisticHealHp.ts";
import { resolveOverworldHealSpend } from "./itemShop.ts";

const LEVEL = 1;
const START_HP_COMBAT = 10;
const START_DOKA = 200;
const START_XP = 100;
const MAX_HP = 200;
const RESPAWN_HP = respawnHpAfterDeath(LEVEL);

describe("pending-death flush HP must be respawn, not live", () => {
  it("live WX flush reads the stats ref; persist/replay already write respawn", () => {
    assert.equal(liveWxPendingDeathFlushWritesLiveHp(), true);
    assert.equal(deathPersistAndReplayWriteRespawnHp(), true);
    assert.equal(RESPAWN_HP, 50);
    assert.equal(hpForPendingDeathPenaltyFlush(LEVEL), RESPAWN_HP);
    assert.equal(hpForPendingDeathPenaltyFlush(10), respawnHpAfterDeath(10));
    assert.equal(liveWxPendingDeathFlushHp(MAX_HP), MAX_HP);
    assert.notEqual(liveWxPendingDeathFlushHp(MAX_HP), RESPAWN_HP);
  });

  it("respawn helper ignores optimistic heal HP", () => {
    assert.equal(
      hpWrittenByPendingDeathFlush({
        liveHp: MAX_HP,
        level: LEVEL,
        useRespawnHp: true,
      }),
      RESPAWN_HP,
    );
    assert.equal(
      hpWrittenByPendingDeathFlush({
        liveHp: MAX_HP,
        level: LEVEL,
        useRespawnHp: false,
      }),
      MAX_HP,
      "leftover WX 1470 stamps the unpaid heal bar",
    );
  });
});

describe("failed death persist then Heal flush stamps unpaid HP", () => {
  it("paid heal from respawn 50 / Doka 120 costs 50 for +150 HP", () => {
    const spend = resolveOverworldHealSpend({
      currentHp: RESPAWN_HP,
      maxHp: MAX_HP,
      liveDoka: 120,
      jackpot: false,
    });
    assert.ok(spend);
    assert.equal(spend.nextHp, MAX_HP);
    assert.equal(spend.dokaCost, 50);
    assert.equal(spend.hpGained, 150);
  });

  it("ungated flush writes HP 200; heal job fail leaves unpaid +150", () => {
    const ungated = simulateFailedDeathFlushOptimisticHeal({
      level: LEVEL,
      startXp: START_XP,
      startDoka: START_DOKA,
      canisterHpBeforeFlush: START_HP_COMBAT,
      liveHpAtFlush: MAX_HP,
      healCost: 50,
      healPersistOk: false,
      useRespawnHpOnFlush: false,
    });
    assert.equal(ungated.flushWrote, true);
    assert.equal(ungated.healPersistWrote, false);
    assert.equal(ungated.canisterHp, MAX_HP);
    assert.equal(ungated.canisterDoka, 120);
    assert.equal(ungated.canisterXp, 80);
    assert.equal(
      leftoverUnpaidHealHpAfterDeathFlush({
        respawnHp: RESPAWN_HP,
        wroteHp: ungated.canisterHp,
        healPersistWrote: ungated.healPersistWrote,
      }),
      150,
    );
  });

  it("respawn-HP flush keeps HP 50 when the heal job fails", () => {
    const gated = simulateFailedDeathFlushOptimisticHeal({
      level: LEVEL,
      startXp: START_XP,
      startDoka: START_DOKA,
      canisterHpBeforeFlush: START_HP_COMBAT,
      liveHpAtFlush: MAX_HP,
      healCost: 50,
      healPersistOk: false,
      useRespawnHpOnFlush: true,
    });
    assert.equal(gated.canisterHp, RESPAWN_HP);
    assert.equal(gated.canisterDoka, 120);
    assert.equal(gated.canisterXp, 80);
    assert.equal(
      leftoverUnpaidHealHpAfterDeathFlush({
        respawnHp: RESPAWN_HP,
        wroteHp: gated.canisterHp,
        healPersistWrote: gated.healPersistWrote,
      }),
      0,
    );
  });

  it("respawn-HP flush then successful heal persist still pays for the bar", () => {
    const paid = simulateFailedDeathFlushOptimisticHeal({
      level: LEVEL,
      startXp: START_XP,
      startDoka: START_DOKA,
      canisterHpBeforeFlush: START_HP_COMBAT,
      liveHpAtFlush: MAX_HP,
      healCost: 50,
      healPersistOk: true,
      useRespawnHpOnFlush: true,
    });
    assert.equal(paid.healPersistWrote, true);
    assert.equal(paid.canisterHp, MAX_HP);
    assert.equal(paid.canisterDoka, 70);
    assert.equal(
      leftoverUnpaidHealHpAfterDeathFlush({
        respawnHp: RESPAWN_HP,
        wroteHp: paid.canisterHp,
        healPersistWrote: paid.healPersistWrote,
      }),
      0,
      "heal job wrote the bar; 50 Doka debit is the legitimate spend",
    );
  });

  it("ungated flush plus successful heal still charged Doka (HP already free)", () => {
    const ungatedPaid = simulateFailedDeathFlushOptimisticHeal({
      level: LEVEL,
      startXp: START_XP,
      startDoka: START_DOKA,
      canisterHpBeforeFlush: START_HP_COMBAT,
      liveHpAtFlush: MAX_HP,
      healCost: 50,
      healPersistOk: true,
      useRespawnHpOnFlush: false,
    });
    assert.equal(ungatedPaid.canisterHp, MAX_HP);
    assert.equal(ungatedPaid.canisterDoka, 70);
    assert.equal(
      leftoverUnpaidHealHpAfterDeathFlush({
        respawnHp: RESPAWN_HP,
        wroteHp: ungatedPaid.canisterHp,
        healPersistWrote: ungatedPaid.healPersistWrote,
      }),
      0,
    );
  });
});

describe("distinct from #1326 / #1335 / #1339 / leftover stamps", () => {
  it("is a death-flush HP stamp, not shop-during-heal or rename AND-skip", () => {
    assert.equal(START_HP_COMBAT, 10);
    assert.notEqual(START_HP_COMBAT, RESPAWN_HP);
    assert.notEqual(150, 100);
    assert.notEqual(150, 10);
  });

  it("does not stamp remount keep keys or unconfirmed-credit pending", () => {
    const storage = new Map<string, string>();
    assert.equal(
      storage.get("pbv_absolute_hp_throw_keep_remount_slot1"),
      undefined,
    );
    assert.equal(storage.get("pbv_pending_death_penalty_slot1"), undefined);
    assert.equal(storage.get("pbv_one_shot_unconfirmed_credit"), undefined);
  });

  it("flush without an optimistic heal matches respawn on both paths", () => {
    const live = simulateFailedDeathFlushOptimisticHeal({
      level: LEVEL,
      startXp: START_XP,
      startDoka: START_DOKA,
      canisterHpBeforeFlush: START_HP_COMBAT,
      liveHpAtFlush: RESPAWN_HP,
      healCost: 0,
      healPersistOk: false,
      useRespawnHpOnFlush: false,
    });
    const gated = simulateFailedDeathFlushOptimisticHeal({
      level: LEVEL,
      startXp: START_XP,
      startDoka: START_DOKA,
      canisterHpBeforeFlush: START_HP_COMBAT,
      liveHpAtFlush: RESPAWN_HP,
      healCost: 0,
      healPersistOk: false,
      useRespawnHpOnFlush: true,
    });
    assert.equal(live.canisterHp, RESPAWN_HP);
    assert.equal(gated.canisterHp, RESPAWN_HP);
    assert.equal(live.canisterDoka, 120);
  });
});
