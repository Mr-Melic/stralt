import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  absoluteHpKeepRemountHealSpendKey,
  clearAbsoluteHpKeepRemountHealSpend,
  dokaAfterHealSpendWithAbsoluteHpKeepRemount,
  hasAbsoluteHpKeepRemountHealSpend,
  hpFromHealSpendCharacterRecord,
  noteAbsoluteHpKeepRemountHealSpend,
  persistHealSpendThroughAbsoluteHpKeepRemount,
  readAbsoluteHpKeepRemountHealSpend,
  sessionHpAfterAbsoluteHpKeepRemountHealSpend,
  shouldSkipHealSpendAfterAbsoluteHpKeepRemount,
} from "./absoluteHpKeepRemountHealSpendWriteSkip.ts";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import { resolveOverworldHealSpend, shouldStartDokaHeal } from "./itemShop.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  clampAbsoluteProgressWrite,
  createProgressPersist,
} from "./progressPersist.ts";

const PLAY_ENTRY_HP = 50;
const HEALED_HP = 100;
const HIGH_PLAY_ENTRY_HP = 100;
const PARTIAL_HEAL_HP = 70;
const LOCK_DOKA = 183;
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

function remountLock() {
  return createProgressPersist({ doka: LOCK_DOKA, xp: 100, level: LEVEL });
}

function leftoverHealWriteDoka(remountDoka: number, spend: number): number {
  return clampAbsoluteProgressWrite(
    applySpendToCommitted(remountDoka, spend),
    remountDoka,
  );
}

describe("absoluteHpKeepRemountHealSpendKey", () => {
  it("reads the same #854 slot key", () => {
    assert.equal(
      absoluteHpKeepRemountHealSpendKey(1),
      "pbv_absolute_hp_keep_remount_slot1",
    );
    assert.equal(
      absoluteHpKeepRemountHealSpendKey(3),
      "pbv_absolute_hp_keep_remount_slot3",
    );
  });
});

describe("note / read / clear AbsoluteHpKeepRemountHealSpend", () => {
  it("round-trips the #854 { preHp, postHp } shape", () => {
    const storage = memStorage();
    assert.equal(hasAbsoluteHpKeepRemountHealSpend(storage, 1), false);
    noteAbsoluteHpKeepRemountHealSpend(storage, 1, {
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
    assert.deepEqual(readAbsoluteHpKeepRemountHealSpend(storage, 1), {
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
    assert.equal(hasAbsoluteHpKeepRemountHealSpend(storage, 1), true);
    clearAbsoluteHpKeepRemountHealSpend(storage, 1);
    assert.equal(readAbsoluteHpKeepRemountHealSpend(storage, 1), null);
  });
});

describe("hpFromHealSpendCharacterRecord", () => {
  it("reads number and bigint stats.hp", () => {
    assert.equal(
      hpFromHealSpendCharacterRecord({ stats: { hp: HEALED_HP } }),
      100,
    );
    assert.equal(hpFromHealSpendCharacterRecord({ stats: { hp: 100n } }), 100);
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(hpFromHealSpendCharacterRecord(null), null);
    assert.equal(hpFromHealSpendCharacterRecord({}), null);
    assert.equal(
      hpFromHealSpendCharacterRecord({ stats: { hp: "nope" } }),
      null,
    );
  });
});

describe("shouldSkipHealSpendAfterAbsoluteHpKeepRemount", () => {
  it("skips a second heal when replica already holds the paid HP", () => {
    assert.equal(
      shouldSkipHealSpendAfterAbsoluteHpKeepRemount({
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
      shouldSkipHealSpendAfterAbsoluteHpKeepRemount({
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
      shouldSkipHealSpendAfterAbsoluteHpKeepRemount({
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

  it("does not skip leftover shop (clickHp === remountHp) — that is #854", () => {
    assert.equal(
      shouldSkipHealSpendAfterAbsoluteHpKeepRemount({
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

  it("does not skip #854 HIGH Play-entry polarity (postHp < preHp)", () => {
    assert.equal(
      shouldSkipHealSpendAfterAbsoluteHpKeepRemount({
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
      shouldSkipHealSpendAfterAbsoluteHpKeepRemount({
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

describe("sessionHpAfterAbsoluteHpKeepRemountHealSpend", () => {
  it("ungated remount HUD stays Play-entry 50 against derived max 100", () => {
    assert.equal(
      sessionHpAfterAbsoluteHpKeepRemountHealSpend({
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
        liveDoka: LOCK_DOKA,
      }),
      true,
      "derived maxHp 100 vs Play-entry 50 re-opens the heal button",
    );
  });

  it("honour replica paid HP so the heal button hides", () => {
    const honoured = sessionHpAfterAbsoluteHpKeepRemountHealSpend({
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
        liveDoka: LOCK_DOKA,
      }),
      false,
    );
  });
});

describe("successful heal persist then remount re-heal without unpaid death", () => {
  it("ungated remount re-heal writes Doka 166 over canister 183 (the wipe)", () => {
    const resolved = resolveOverworldHealSpend({
      currentHp: PLAY_ENTRY_HP,
      maxHp: MAX_HP,
      liveDoka: LOCK_DOKA,
      jackpot: false,
    });
    assert.ok(resolved);
    assert.equal(resolved.nextHp, HEALED_HP);
    assert.equal(resolved.dokaCost, HEAL_SPEND);
    const leftover = leftoverHealWriteDoka(LOCK_DOKA, resolved.dokaCost);
    assert.equal(
      leftover,
      166,
      "second 17 Doka spent for HP already on canister",
    );
  });

  it("gated remount re-heal keeps canister Doka 183", () => {
    const honoured = dokaAfterHealSpendWithAbsoluteHpKeepRemount({
      remountDoka: LOCK_DOKA,
      spend: HEAL_SPEND,
      keep: true,
      remountHp: PLAY_ENTRY_HP,
      clickHp: HEALED_HP,
      liveHp: HEALED_HP,
      stampedPreHp: PLAY_ENTRY_HP,
      stampedPostHp: HEALED_HP,
    });
    assert.equal(honoured, LOCK_DOKA);
  });

  it("gated shop leftover still spends Doka (that write is #854 HP)", () => {
    const honoured = dokaAfterHealSpendWithAbsoluteHpKeepRemount({
      remountDoka: LOCK_DOKA,
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
    const honoured = dokaAfterHealSpendWithAbsoluteHpKeepRemount({
      remountDoka: 200,
      spend: HEAL_SPEND,
      keep: false,
      remountHp: PLAY_ENTRY_HP,
      clickHp: HEALED_HP,
      liveHp: PLAY_ENTRY_HP,
      stampedPreHp: PLAY_ENTRY_HP,
      stampedPostHp: HEALED_HP,
    });
    assert.equal(honoured, 183);
  });

  it("replica still wounded still charges the first heal", () => {
    const honoured = dokaAfterHealSpendWithAbsoluteHpKeepRemount({
      remountDoka: 200,
      spend: HEAL_SPEND,
      keep: true,
      remountHp: PLAY_ENTRY_HP,
      clickHp: HEALED_HP,
      liveHp: PLAY_ENTRY_HP,
      stampedPreHp: PLAY_ENTRY_HP,
      stampedPostHp: HEALED_HP,
    });
    assert.equal(honoured, 183);
  });
});

describe("persistHealSpendThroughAbsoluteHpKeepRemount", () => {
  it("throws and does not apply when replica already holds the paid HP", async () => {
    const storage = memStorage();
    noteAbsoluteHpKeepRemountHealSpend(storage, 1, {
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistHealSpendThroughAbsoluteHpKeepRemount({
          persist,
          storage,
          slot: 1,
          remountHp: PLAY_ENTRY_HP,
          clickHp: HEALED_HP,
          readCharacter: async () => ({ stats: { hp: HEALED_HP } }),
          applyAndCommit: async () => {
            applied = true;
            persist.commit({ doka: LOCK_DOKA - HEAL_SPEND });
            return true;
          },
        }),
      (err: unknown) =>
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
    );
    assert.equal(applied, false);
    assert.equal(persist.snapshot().doka, LOCK_DOKA);
    assert.equal(
      hasAbsoluteHpKeepRemountHealSpend(storage, 1),
      true,
      "do not clear the stamp: HP is not on the persist lock",
    );
  });

  it("applies a real heal when replica is still wounded", async () => {
    const storage = memStorage();
    noteAbsoluteHpKeepRemountHealSpend(storage, 1, {
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
    const persist = createProgressPersist({ doka: 200, xp: 100, level: LEVEL });
    const ok = await persistHealSpendThroughAbsoluteHpKeepRemount({
      persist,
      storage,
      slot: 1,
      remountHp: PLAY_ENTRY_HP,
      clickHp: HEALED_HP,
      readCharacter: async () => ({ stats: { hp: PLAY_ENTRY_HP } }),
      applyAndCommit: async () => {
        persist.commit({ doka: 200 - HEAL_SPEND });
        return true;
      },
    });
    assert.equal(ok, true);
    assert.equal(persist.snapshot().doka, 183);
  });

  it("applies leftover shop without skip (HP honour stays #854)", async () => {
    const storage = memStorage();
    noteAbsoluteHpKeepRemountHealSpend(storage, 1, {
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
    const persist = remountLock();
    const ok = await persistHealSpendThroughAbsoluteHpKeepRemount({
      persist,
      storage,
      slot: 1,
      remountHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP,
      readCharacter: async () => ({ stats: { hp: HEALED_HP } }),
      applyAndCommit: async () => {
        persist.commit({ doka: LOCK_DOKA - SHOP_SPEND });
        return true;
      },
    });
    assert.equal(ok, true);
    assert.equal(persist.snapshot().doka, 133);
  });

  it("throws when getCharacter fails so a stale spend cannot land", async () => {
    const storage = memStorage();
    noteAbsoluteHpKeepRemountHealSpend(storage, 1, {
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistHealSpendThroughAbsoluteHpKeepRemount({
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
    const persist = createProgressPersist({ doka: 200, xp: 100, level: LEVEL });
    const ok = await persistHealSpendThroughAbsoluteHpKeepRemount({
      persist,
      storage: memStorage(),
      slot: 1,
      remountHp: PLAY_ENTRY_HP,
      clickHp: HEALED_HP,
      readCharacter: async () => {
        throw new Error("must not fetch without a stamp");
      },
      applyAndCommit: async () => {
        persist.commit({ doka: 183 });
        return true;
      },
    });
    assert.equal(ok, true);
    assert.equal(persist.snapshot().doka, 183);
  });
});
