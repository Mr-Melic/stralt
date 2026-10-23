import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  absoluteHpThrowKeepRemountHealSpendKey,
  clearAbsoluteHpThrowKeepRemountHealSpend,
  dokaAfterHealSpendWithAbsoluteHpThrowKeepRemount,
  hasAbsoluteHpThrowKeepRemountHealSpend,
  hpFromThrowHealSpendCharacterRecord,
  noteAbsoluteHpThrowKeepRemountHealSpend,
  persistHealSpendThroughAbsoluteHpThrowKeepRemount,
  readAbsoluteHpThrowKeepRemountHealSpend,
  sessionHpAfterAbsoluteHpThrowKeepRemountHealSpend,
  shouldSkipHealSpendAfterAbsoluteHpThrowKeepRemount,
} from "./absoluteHpThrowKeepRemountHealSpendWriteSkip.ts";
import { clampSaveBattleStatsWrite } from "./absoluteStatsClamp.ts";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import { resolveOverworldHealSpend, shouldStartDokaHeal } from "./itemShop.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  clampAbsoluteProgressWrite,
  createProgressPersist,
  spendFromUiBalance,
} from "./progressPersist.ts";

const PLAY_ENTRY_HP = 50;
const HEALED_HP = 100;
const HIGH_PLAY_ENTRY_HP = 100;
const PARTIAL_HEAL_HP = 70;
const ROLLBACK_DOKA = 200;
const CANISTER_DOKA_AFTER_HEAL = 183;
const HEAL_SPEND = 17;
const SHOP_SPEND = 50;
const LEVEL = 1;
const MAX_HP = 100;

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

/** Production remount lock: GameFlow Doka after heal-throw HUD rollback. */
function remountLock() {
  return createProgressPersist({
    doka: ROLLBACK_DOKA,
    xp: 100,
    level: LEVEL,
  });
}

function leftoverHealWriteDoka(baseDoka: number, spend: number): number {
  return clampAbsoluteProgressWrite(
    applySpendToCommitted(baseDoka, spend),
    baseDoka,
  );
}

function canisterAfterAbsoluteWrite(
  storedDoka: number,
  incomingDoka: number,
): number {
  return clampSaveBattleStatsWrite(
    { doka: storedDoka, xp: 100, level: LEVEL },
    { doka: incomingDoka, xp: 100, level: LEVEL },
  ).doka;
}

describe("absoluteHpThrowKeepRemountHealSpendKey", () => {
  it("reads the same #860 slot key, not #927's success key", () => {
    assert.equal(
      absoluteHpThrowKeepRemountHealSpendKey(1),
      "pbv_absolute_hp_throw_keep_remount_slot1",
    );
    assert.equal(
      absoluteHpThrowKeepRemountHealSpendKey(3),
      "pbv_absolute_hp_throw_keep_remount_slot3",
    );
    assert.notEqual(
      absoluteHpThrowKeepRemountHealSpendKey(1),
      "pbv_absolute_hp_keep_remount_slot1",
    );
  });
});

describe("note / read / clear AbsoluteHpThrowKeepRemountHealSpend", () => {
  it("round-trips the #860 { preHp, postHp } shape", () => {
    const storage = memStorage();
    assert.equal(hasAbsoluteHpThrowKeepRemountHealSpend(storage, 1), false);
    noteAbsoluteHpThrowKeepRemountHealSpend(storage, 1, {
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
    assert.deepEqual(readAbsoluteHpThrowKeepRemountHealSpend(storage, 1), {
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
    assert.equal(hasAbsoluteHpThrowKeepRemountHealSpend(storage, 1), true);
    clearAbsoluteHpThrowKeepRemountHealSpend(storage, 1);
    assert.equal(readAbsoluteHpThrowKeepRemountHealSpend(storage, 1), null);
  });
});

describe("hpFromThrowHealSpendCharacterRecord", () => {
  it("reads number and bigint stats.hp", () => {
    assert.equal(
      hpFromThrowHealSpendCharacterRecord({ stats: { hp: HEALED_HP } }),
      100,
    );
    assert.equal(
      hpFromThrowHealSpendCharacterRecord({ stats: { hp: 100n } }),
      100,
    );
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(hpFromThrowHealSpendCharacterRecord(null), null);
    assert.equal(hpFromThrowHealSpendCharacterRecord({}), null);
    assert.equal(
      hpFromThrowHealSpendCharacterRecord({ stats: { hp: "nope" } }),
      null,
    );
  });
});

describe("shouldSkipHealSpendAfterAbsoluteHpThrowKeepRemount", () => {
  it("skips a second heal when replica already holds the paid HP", () => {
    assert.equal(
      shouldSkipHealSpendAfterAbsoluteHpThrowKeepRemount({
        keep: true,
        remountHp: PLAY_ENTRY_HP,
        clickHp: HEALED_HP,
        liveHp: HEALED_HP,
        stampedPreHp: PLAY_ENTRY_HP,
        stampedPostHp: HEALED_HP,
      }),
      true,
    );
  });

  it("fail-closes skip when keep is set and live HP is missing", () => {
    assert.equal(
      shouldSkipHealSpendAfterAbsoluteHpThrowKeepRemount({
        keep: true,
        remountHp: PLAY_ENTRY_HP,
        clickHp: HEALED_HP,
        liveHp: null,
        stampedPreHp: PLAY_ENTRY_HP,
        stampedPostHp: HEALED_HP,
      }),
      true,
    );
  });

  it("does not skip when the first heal never landed (replica still wounded)", () => {
    assert.equal(
      shouldSkipHealSpendAfterAbsoluteHpThrowKeepRemount({
        keep: true,
        remountHp: PLAY_ENTRY_HP,
        clickHp: HEALED_HP,
        liveHp: PLAY_ENTRY_HP,
        stampedPreHp: PLAY_ENTRY_HP,
        stampedPostHp: HEALED_HP,
      }),
      false,
    );
  });

  it("does not skip leftover shop (clickHp === remountHp) — that is #860", () => {
    assert.equal(
      shouldSkipHealSpendAfterAbsoluteHpThrowKeepRemount({
        keep: true,
        remountHp: PLAY_ENTRY_HP,
        clickHp: PLAY_ENTRY_HP,
        liveHp: HEALED_HP,
        stampedPreHp: PLAY_ENTRY_HP,
        stampedPostHp: HEALED_HP,
      }),
      false,
    );
  });

  it("does not skip #860 HIGH Play-entry polarity (postHp < preHp)", () => {
    assert.equal(
      shouldSkipHealSpendAfterAbsoluteHpThrowKeepRemount({
        keep: true,
        remountHp: HIGH_PLAY_ENTRY_HP,
        clickHp: HIGH_PLAY_ENTRY_HP,
        liveHp: PARTIAL_HEAL_HP,
        stampedPreHp: HIGH_PLAY_ENTRY_HP,
        stampedPostHp: PARTIAL_HEAL_HP,
      }),
      false,
    );
  });

  it("does not skip when keep is unset", () => {
    assert.equal(
      shouldSkipHealSpendAfterAbsoluteHpThrowKeepRemount({
        keep: false,
        remountHp: PLAY_ENTRY_HP,
        clickHp: HEALED_HP,
        liveHp: HEALED_HP,
        stampedPreHp: PLAY_ENTRY_HP,
        stampedPostHp: HEALED_HP,
      }),
      false,
    );
  });
});

describe("sessionHpAfterAbsoluteHpThrowKeepRemountHealSpend", () => {
  it("ungated remount HUD stays Play-entry 50 against derived max 100", () => {
    assert.equal(
      sessionHpAfterAbsoluteHpThrowKeepRemountHealSpend({
        remountHp: PLAY_ENTRY_HP,
        liveHp: HEALED_HP,
        keep: false,
        stampedPreHp: PLAY_ENTRY_HP,
        stampedPostHp: HEALED_HP,
      }),
      PLAY_ENTRY_HP,
    );
    assert.equal(
      shouldStartDokaHeal({
        currentHp: PLAY_ENTRY_HP,
        maxHp: MAX_HP,
        liveDoka: ROLLBACK_DOKA,
      }),
      true,
      "derived maxHp 100 vs Play-entry 50 re-opens the heal button",
    );
  });

  it("honour replica paid HP so the heal button hides", () => {
    const honoured = sessionHpAfterAbsoluteHpThrowKeepRemountHealSpend({
      remountHp: PLAY_ENTRY_HP,
      liveHp: HEALED_HP,
      keep: true,
      stampedPreHp: PLAY_ENTRY_HP,
      stampedPostHp: HEALED_HP,
    });
    assert.equal(honoured, HEALED_HP);
    assert.equal(
      shouldStartDokaHeal({
        currentHp: honoured,
        maxHp: MAX_HP,
        liveDoka: ROLLBACK_DOKA,
      }),
      false,
    );
  });
});

describe("heal saveBattleStats throw-after-accept then remount re-heal without unpaid death", () => {
  it("leftover #964 honour then remount re-heal writes Doka 166 over canister 183", () => {
    // Chronology:
    // 1. World hydrated. Play-entry HP 50 / Doka 200. Canister 50/200.
    // 2. Doka-heal saveBattleStats accepts 100 / 183 then throws.
    //    Catch returns false. HUD rollback 50 / 200. #860 stamps HP.
    //    #964 stamps Doka keep. No unpaid death.
    // 3. Actor reconnect remounts. Session HP 50. Lock Doka 200.
    // 4. Second heal spend is computed from rollback HUD 200 → 17.
    //    #964 honour fetches replica 183. applySpend(183, 17) → 166.
    const resolved = resolveOverworldHealSpend({
      currentHp: PLAY_ENTRY_HP,
      maxHp: MAX_HP,
      liveDoka: ROLLBACK_DOKA,
      jackpot: false,
    });
    assert.ok(resolved);
    assert.equal(resolved.nextHp, HEALED_HP);
    assert.equal(resolved.dokaCost, HEAL_SPEND);
    assert.equal(
      spendFromUiBalance(ROLLBACK_DOKA, resolved.nextDoka),
      HEAL_SPEND,
    );
    const leftover = leftoverHealWriteDoka(
      CANISTER_DOKA_AFTER_HEAL,
      resolved.dokaCost,
    );
    assert.equal(
      leftover,
      166,
      "second 17 Doka spent from #964 honoured replica 183",
    );
    assert.equal(
      canisterAfterAbsoluteWrite(CANISTER_DOKA_AFTER_HEAL, leftover),
      166,
      "incoming-below-stored over-cuts remaining after the first heal fee",
    );
  });

  it("ungated remount (no #964 honour) writes 183 over canister 183 — HUD correction only", () => {
    const leftover = leftoverHealWriteDoka(ROLLBACK_DOKA, HEAL_SPEND);
    assert.equal(leftover, CANISTER_DOKA_AFTER_HEAL);
    assert.equal(
      canisterAfterAbsoluteWrite(CANISTER_DOKA_AFTER_HEAL, leftover),
      CANISTER_DOKA_AFTER_HEAL,
      "without #964 honour the second write matches stored 183",
    );
  });

  it("gated remount re-heal keeps canister Doka 183", () => {
    const honoured = dokaAfterHealSpendWithAbsoluteHpThrowKeepRemount({
      remountDoka: CANISTER_DOKA_AFTER_HEAL,
      spend: HEAL_SPEND,
      keep: true,
      remountHp: PLAY_ENTRY_HP,
      clickHp: HEALED_HP,
      liveHp: HEALED_HP,
      stampedPreHp: PLAY_ENTRY_HP,
      stampedPostHp: HEALED_HP,
    });
    assert.equal(honoured, CANISTER_DOKA_AFTER_HEAL);
    assert.equal(
      canisterAfterAbsoluteWrite(CANISTER_DOKA_AFTER_HEAL, honoured),
      CANISTER_DOKA_AFTER_HEAL,
    );
  });

  it("gated shop leftover still spends Doka (that write is #860 HP / #964 Doka)", () => {
    const honoured = dokaAfterHealSpendWithAbsoluteHpThrowKeepRemount({
      remountDoka: CANISTER_DOKA_AFTER_HEAL,
      spend: SHOP_SPEND,
      keep: true,
      remountHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP,
      liveHp: HEALED_HP,
      stampedPreHp: PLAY_ENTRY_HP,
      stampedPostHp: HEALED_HP,
    });
    assert.equal(honoured, 133);
  });

  it("pickup-only remount still charges a real heal", () => {
    const honoured = dokaAfterHealSpendWithAbsoluteHpThrowKeepRemount({
      remountDoka: ROLLBACK_DOKA,
      spend: HEAL_SPEND,
      keep: false,
      remountHp: PLAY_ENTRY_HP,
      clickHp: HEALED_HP,
      liveHp: PLAY_ENTRY_HP,
      stampedPreHp: PLAY_ENTRY_HP,
      stampedPostHp: HEALED_HP,
    });
    assert.equal(honoured, CANISTER_DOKA_AFTER_HEAL);
  });

  it("replica still wounded still charges the first heal", () => {
    const honoured = dokaAfterHealSpendWithAbsoluteHpThrowKeepRemount({
      remountDoka: ROLLBACK_DOKA,
      spend: HEAL_SPEND,
      keep: true,
      remountHp: PLAY_ENTRY_HP,
      clickHp: HEALED_HP,
      liveHp: PLAY_ENTRY_HP,
      stampedPreHp: PLAY_ENTRY_HP,
      stampedPostHp: HEALED_HP,
    });
    assert.equal(honoured, CANISTER_DOKA_AFTER_HEAL);
  });
});

describe("persistHealSpendThroughAbsoluteHpThrowKeepRemount", () => {
  it("throws and does not apply when replica already holds the paid HP", async () => {
    const storage = memStorage();
    noteAbsoluteHpThrowKeepRemountHealSpend(storage, 1, {
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistHealSpendThroughAbsoluteHpThrowKeepRemount({
          persist,
          storage,
          slot: 1,
          remountHp: PLAY_ENTRY_HP,
          clickHp: HEALED_HP,
          readCharacter: async () => ({ stats: { hp: HEALED_HP } }),
          applyAndCommit: async () => {
            applied = true;
            persist.commit({ doka: CANISTER_DOKA_AFTER_HEAL - HEAL_SPEND });
            return true;
          },
        }),
      (err: unknown) =>
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
    );
    assert.equal(applied, false);
    assert.equal(persist.snapshot().doka, ROLLBACK_DOKA);
    assert.equal(
      hasAbsoluteHpThrowKeepRemountHealSpend(storage, 1),
      true,
      "do not clear the stamp: HP is not on the persist lock",
    );
  });

  it("applies a real heal when replica is still wounded", async () => {
    const storage = memStorage();
    noteAbsoluteHpThrowKeepRemountHealSpend(storage, 1, {
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
    const persist = remountLock();
    const ok = await persistHealSpendThroughAbsoluteHpThrowKeepRemount({
      persist,
      storage,
      slot: 1,
      remountHp: PLAY_ENTRY_HP,
      clickHp: HEALED_HP,
      readCharacter: async () => ({ stats: { hp: PLAY_ENTRY_HP } }),
      applyAndCommit: async () => {
        persist.commit({ doka: ROLLBACK_DOKA - HEAL_SPEND });
        return true;
      },
    });
    assert.equal(ok, true);
    assert.equal(persist.snapshot().doka, CANISTER_DOKA_AFTER_HEAL);
  });

  it("applies leftover shop without skip (HP honour stays #860)", async () => {
    const storage = memStorage();
    noteAbsoluteHpThrowKeepRemountHealSpend(storage, 1, {
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
    const persist = remountLock();
    const ok = await persistHealSpendThroughAbsoluteHpThrowKeepRemount({
      persist,
      storage,
      slot: 1,
      remountHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP,
      readCharacter: async () => ({ stats: { hp: HEALED_HP } }),
      applyAndCommit: async () => {
        persist.commit({ doka: CANISTER_DOKA_AFTER_HEAL - SHOP_SPEND });
        return true;
      },
    });
    assert.equal(ok, true);
    assert.equal(persist.snapshot().doka, 133);
  });

  it("throws when getCharacter fails so a stale spend cannot land", async () => {
    const storage = memStorage();
    noteAbsoluteHpThrowKeepRemountHealSpend(storage, 1, {
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistHealSpendThroughAbsoluteHpThrowKeepRemount({
          persist,
          storage,
          slot: 1,
          remountHp: PLAY_ENTRY_HP,
          clickHp: HEALED_HP,
          readCharacter: async () => {
            throw new Error("replica went away");
          },
          applyAndCommit: async () => {
            applied = true;
            return true;
          },
        }),
      (err: unknown) =>
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
    );
    assert.equal(applied, false);
  });

  it("applies when no stamp exists", async () => {
    const persist = remountLock();
    const ok = await persistHealSpendThroughAbsoluteHpThrowKeepRemount({
      persist,
      storage: memStorage(),
      slot: 1,
      remountHp: PLAY_ENTRY_HP,
      clickHp: HEALED_HP,
      readCharacter: async () => {
        throw new Error("must not fetch without a stamp");
      },
      applyAndCommit: async () => {
        persist.commit({ doka: CANISTER_DOKA_AFTER_HEAL });
        return true;
      },
    });
    assert.equal(ok, true);
    assert.equal(persist.snapshot().doka, CANISTER_DOKA_AFTER_HEAL);
  });

  it("runs beforeEach so heal persist can flush unpaid death (#445)", async () => {
    const storage = memStorage();
    noteAbsoluteHpThrowKeepRemountHealSpend(storage, 1, {
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
    let flushed = 0;
    const persist = createProgressPersist(
      { doka: ROLLBACK_DOKA, xp: 100, level: LEVEL },
      {
        beforeEach: async () => {
          flushed += 1;
        },
      },
    );
    await persistHealSpendThroughAbsoluteHpThrowKeepRemount({
      persist,
      storage,
      slot: 1,
      remountHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP,
      readCharacter: async () => ({ stats: { hp: HEALED_HP } }),
      applyAndCommit: async () => true,
    });
    assert.equal(flushed, 1);
  });
});

describe("distinct from #927 success re-heal, #860 shop HP, #964 shop Doka, #969 death", () => {
  it("uses pbv_absolute_hp_throw_keep_remount_slotN, not success / Doka / death keys", () => {
    const storage = memStorage();
    noteAbsoluteHpThrowKeepRemountHealSpend(storage, 2, {
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
    assert.equal(
      absoluteHpThrowKeepRemountHealSpendKey(2),
      "pbv_absolute_hp_throw_keep_remount_slot2",
    );
    assert.equal(
      storage.getItem("pbv_absolute_hp_throw_keep_remount_slot2") != null,
      true,
    );
    assert.equal(
      storage.getItem("pbv_absolute_hp_keep_remount_slot2"),
      null,
      "#927 / #854 parsed-success remount key stays empty",
    );
    assert.equal(
      storage.getItem("pbv_absolute_doka_throw_keep_remount_slot2"),
      null,
      "#964 / #969 Doka-throw remount key stays empty in this fixture",
    );
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot2"), null);
    assert.equal(storage.getItem("pbv_spend_keep_remount_slot2"), null);
  });

  it("does not treat #964 remount shop spend 50 from 183 as this heal skip", () => {
    const shop = leftoverHealWriteDoka(CANISTER_DOKA_AFTER_HEAL, SHOP_SPEND);
    assert.equal(shop, 133, "#964 gated shop path");
    const deathCut = Math.floor(CANISTER_DOKA_AFTER_HEAL * 0.6);
    assert.equal(deathCut, 109, "#969 taxes replica 183, not this skip");
    const skip = shouldSkipHealSpendAfterAbsoluteHpThrowKeepRemount({
      keep: true,
      remountHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP,
      liveHp: HEALED_HP,
      stampedPreHp: PLAY_ENTRY_HP,
      stampedPostHp: HEALED_HP,
    });
    assert.equal(skip, false, "shop leftover must still spend");
  });

  it("does not extra-skip HIGH Play-entry heal-throw (that is #860 shop)", () => {
    assert.equal(
      shouldStartDokaHeal({
        currentHp: HIGH_PLAY_ENTRY_HP,
        maxHp: MAX_HP,
        liveDoka: ROLLBACK_DOKA,
      }),
      false,
      "remount Doka-heal is blocked; shop is the #860 wipe path",
    );
    assert.equal(
      shouldSkipHealSpendAfterAbsoluteHpThrowKeepRemount({
        keep: true,
        remountHp: HIGH_PLAY_ENTRY_HP,
        clickHp: HIGH_PLAY_ENTRY_HP,
        liveHp: PARTIAL_HEAL_HP,
        stampedPreHp: HIGH_PLAY_ENTRY_HP,
        stampedPostHp: PARTIAL_HEAL_HP,
      }),
      false,
    );
  });
});
