import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  absoluteHpKeepRemountKey,
  clearAbsoluteHpKeepRemount,
  hasAbsoluteHpKeepRemount,
  hpForAbsoluteHpKeepRemountHonour,
  hpFromCharacterRecord,
  noteAbsoluteHpKeepRemount,
  persistAbsoluteHpThroughAbsoluteHpKeepRemount,
  readAbsoluteHpKeepRemount,
  resolveAbsoluteWriteHpAfterAbsoluteHpKeepRemount,
  shouldNoteAbsoluteHpKeepRemount,
  shouldRefuseAbsoluteHpKeepRemountStaleHp,
} from "./absoluteHpKeepRemountWriteSkip.ts";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import { resolveAbsoluteWriteHp, shouldStartDokaHeal } from "./itemShop.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  clampAbsoluteProgressWrite,
  createProgressPersist,
} from "./progressPersist.ts";

const PLAY_ENTRY_HP = 100;
const HEALED_HP = 70;
const DAMAGED_HP = 85;
const SHOP_SPEND = 50;
const LEVEL = 4;

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

/** Production remount lock: GameFlow Doka (post-heal spend) + Play-entry leftover XP. */
function remountLock() {
  return createProgressPersist({ doka: 190, xp: 100, level: LEVEL });
}

function leftoverShopWriteHp(remountLiveHp: number, clickHp: number): number {
  return resolveAbsoluteWriteHp(remountLiveHp, clickHp);
}

function honourShopWrite(
  honourHp: number,
  dokaBase: number,
  spend: number,
): {
  hp: number;
  doka: number;
} {
  return {
    hp: honourHp,
    doka: clampAbsoluteProgressWrite(
      applySpendToCommitted(dokaBase, spend),
      dokaBase,
    ),
  };
}

describe("shouldNoteAbsoluteHpKeepRemount", () => {
  it("notes keep after a successful shop / heal persist without death", () => {
    assert.equal(
      shouldNoteAbsoluteHpKeepRemount({
        persisted: true,
        preHp: PLAY_ENTRY_HP,
        postHp: HEALED_HP,
      }),
      true,
    );
    assert.equal(
      shouldNoteAbsoluteHpKeepRemount({
        persisted: true,
        preHp: PLAY_ENTRY_HP,
        postHp: DAMAGED_HP,
      }),
      true,
    );
  });

  it("does not note catch / unpaid (#445)", () => {
    assert.equal(
      shouldNoteAbsoluteHpKeepRemount({
        persisted: false,
        preHp: PLAY_ENTRY_HP,
        postHp: HEALED_HP,
      }),
      false,
    );
  });

  it("does not note a full-HP shop spend (pre === post)", () => {
    assert.equal(
      shouldNoteAbsoluteHpKeepRemount({
        persisted: true,
        preHp: PLAY_ENTRY_HP,
        postHp: PLAY_ENTRY_HP,
      }),
      false,
    );
  });
});

describe("shouldRefuseAbsoluteHpKeepRemountStaleHp", () => {
  it("refuses stale Play-entry HP equal to stamped preHp", () => {
    assert.equal(
      shouldRefuseAbsoluteHpKeepRemountStaleHp({
        keep: true,
        liveHp: PLAY_ENTRY_HP,
        remountLiveHp: PLAY_ENTRY_HP,
        stampedPreHp: PLAY_ENTRY_HP,
        stampedPostHp: HEALED_HP,
      }),
      true,
    );
  });

  it("refuses remount Play-entry replica when persisted HP was already lower", () => {
    assert.equal(
      shouldRefuseAbsoluteHpKeepRemountStaleHp({
        keep: true,
        liveHp: PLAY_ENTRY_HP,
        remountLiveHp: PLAY_ENTRY_HP,
        stampedPreHp: 40,
        stampedPostHp: HEALED_HP,
      }),
      true,
    );
  });

  it("does not refuse a fresh healed replica", () => {
    assert.equal(
      shouldRefuseAbsoluteHpKeepRemountStaleHp({
        keep: true,
        liveHp: HEALED_HP,
        remountLiveHp: PLAY_ENTRY_HP,
        stampedPreHp: PLAY_ENTRY_HP,
        stampedPostHp: HEALED_HP,
      }),
      false,
    );
  });

  it("does not refuse a later paid heal already on the canister", () => {
    assert.equal(
      shouldRefuseAbsoluteHpKeepRemountStaleHp({
        keep: true,
        liveHp: HEALED_HP + 10,
        remountLiveHp: PLAY_ENTRY_HP,
        stampedPreHp: PLAY_ENTRY_HP,
        stampedPostHp: HEALED_HP,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseAbsoluteHpKeepRemountStaleHp({
        keep: false,
        liveHp: PLAY_ENTRY_HP,
        remountLiveHp: PLAY_ENTRY_HP,
        stampedPreHp: PLAY_ENTRY_HP,
        stampedPostHp: HEALED_HP,
      }),
      false,
    );
  });

  it("fail-closes when keep is set and live HP is missing", () => {
    assert.equal(
      shouldRefuseAbsoluteHpKeepRemountStaleHp({
        keep: true,
        liveHp: null,
        remountLiveHp: PLAY_ENTRY_HP,
        stampedPreHp: PLAY_ENTRY_HP,
        stampedPostHp: HEALED_HP,
      }),
      true,
    );
  });
});

describe("hpFromCharacterRecord", () => {
  it("reads number and bigint stats.hp", () => {
    assert.equal(hpFromCharacterRecord({ stats: { hp: HEALED_HP } }), 70);
    assert.equal(hpFromCharacterRecord({ stats: { hp: 70n } }), 70);
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(hpFromCharacterRecord(null), null);
    assert.equal(hpFromCharacterRecord({}), null);
    assert.equal(hpFromCharacterRecord({ stats: { hp: "nope" } }), null);
  });
});

describe("successful shop / heal persist then remount shop without death", () => {
  it("leftover remount shop writes HP 100 over canister 70 (the wipe)", () => {
    // Chronology:
    // 1. World hydrated. Play-entry HP 100 / Doka 200.
    // 2. Lava 100→40 local. Doka-heal persistAbsoluteProgress accepts 70 / 190.
    //    No unpaid death. GameFlow stats.hp stays 100. #445 / #847 do not run.
    // 3. Actor reconnect remounts. characterStats.hp = Play-entry 100.
    //    maxHp is also s.hp, so Doka-heal is blocked.
    // 4. Items Buy persistAbsoluteProgress(100, 140). writeHp = min(100, 100).
    assert.equal(
      shouldStartDokaHeal({
        currentHp: PLAY_ENTRY_HP,
        maxHp: PLAY_ENTRY_HP,
        liveDoka: 190,
      }),
      false,
      "remount Doka-heal is blocked; shop is the wipe path",
    );
    const leftoverHp = leftoverShopWriteHp(PLAY_ENTRY_HP, PLAY_ENTRY_HP);
    assert.equal(
      leftoverHp,
      PLAY_ENTRY_HP,
      "ungated remount trusts Play-entry",
    );
    const honourHp = hpForAbsoluteHpKeepRemountHonour({
      remountLiveHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP,
      liveHp: PLAY_ENTRY_HP,
      keep: false,
      stampedPreHp: PLAY_ENTRY_HP,
      stampedPostHp: HEALED_HP,
    });
    assert.equal(honourHp, PLAY_ENTRY_HP);
    const wrote = honourShopWrite(honourHp ?? 0, 190, SHOP_SPEND);
    assert.equal(wrote.hp, 100, "Play-entry honour wiped paid heal HP");
    assert.equal(wrote.doka, 140);
  });

  it("leftover remount shop writes HP 100 over canister damage 85", () => {
    const leftoverHp = leftoverShopWriteHp(PLAY_ENTRY_HP, PLAY_ENTRY_HP);
    assert.equal(leftoverHp, PLAY_ENTRY_HP);
    const wrote = honourShopWrite(leftoverHp, 150, SHOP_SPEND);
    assert.equal(wrote.hp, 100, "Play-entry honour wiped persisted damage");
  });

  it("does not saveBattleStats-wipe healed HP after a gated fresh honour", () => {
    const honourHp = hpForAbsoluteHpKeepRemountHonour({
      remountLiveHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP,
      liveHp: HEALED_HP,
      keep: true,
      stampedPreHp: PLAY_ENTRY_HP,
      stampedPostHp: HEALED_HP,
    });
    assert.equal(honourHp, HEALED_HP);
    const wrote = honourShopWrite(honourHp ?? 0, 190, SHOP_SPEND);
    assert.equal(wrote.hp, 70, "paid heal HP survives remount shop");
    assert.equal(wrote.doka, 140);
  });

  it("does not saveBattleStats-wipe persisted damage after a gated honour", () => {
    const honourHp = hpForAbsoluteHpKeepRemountHonour({
      remountLiveHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP,
      liveHp: DAMAGED_HP,
      keep: true,
      stampedPreHp: PLAY_ENTRY_HP,
      stampedPostHp: DAMAGED_HP,
    });
    assert.equal(honourHp, DAMAGED_HP);
    const wrote = honourShopWrite(honourHp ?? 0, 150, SHOP_SPEND);
    assert.equal(wrote.hp, 85, "persisted damage survives remount shop");
  });

  it("fail-closes stale Play-entry 100 when the HP-keep stamp is set", () => {
    assert.equal(
      hpForAbsoluteHpKeepRemountHonour({
        remountLiveHp: PLAY_ENTRY_HP,
        clickHp: PLAY_ENTRY_HP,
        liveHp: PLAY_ENTRY_HP,
        keep: true,
        stampedPreHp: PLAY_ENTRY_HP,
        stampedPostHp: HEALED_HP,
      }),
      null,
    );
  });

  it("shop 0-delta HP still honours replica healed HP", () => {
    const honourHp = hpForAbsoluteHpKeepRemountHonour({
      remountLiveHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP,
      liveHp: HEALED_HP,
      keep: true,
      stampedPreHp: PLAY_ENTRY_HP,
      stampedPostHp: HEALED_HP,
    });
    assert.equal(honourHp, 70, "Items Buy does not restore Play-entry HP");
  });

  it("applies a paid heal delta onto replica persisted HP", () => {
    const honourHp = hpForAbsoluteHpKeepRemountHonour({
      remountLiveHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP + 9,
      liveHp: HEALED_HP,
      keep: true,
      stampedPreHp: PLAY_ENTRY_HP,
      stampedPostHp: HEALED_HP,
    });
    assert.equal(honourHp, 79);
  });

  it("incoming-above-stored XP 100 over leftover 80 is not this wipe", () => {
    // saveBattleStats never raises XP. Remount writeXp 100 is ignored.
    // HP is the unique absolute-raise leftover vs #813.
    assert.equal(PLAY_ENTRY_HP > 80, true);
    assert.equal(HEALED_HP < PLAY_ENTRY_HP, true);
  });
});

describe("resolveAbsoluteWriteHpAfterAbsoluteHpKeepRemount", () => {
  it("returns leftover min(live, click) when keep is unset", async () => {
    const storage = memStorage();
    const wrote = await resolveAbsoluteWriteHpAfterAbsoluteHpKeepRemount({
      liveHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP,
      readCharacter: async () => ({ stats: { hp: HEALED_HP } }),
      storage,
      slot: 1,
    });
    assert.equal(wrote, PLAY_ENTRY_HP);
  });

  it("fetches replica healed HP when the HP-keep stamp is set", async () => {
    const storage = memStorage();
    noteAbsoluteHpKeepRemount(storage, 1, {
      persisted: true,
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
    const wrote = await resolveAbsoluteWriteHpAfterAbsoluteHpKeepRemount({
      liveHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP,
      readCharacter: async () => ({ stats: { hp: HEALED_HP } }),
      storage,
      slot: 1,
    });
    assert.equal(wrote, HEALED_HP);
    assert.equal(
      hasAbsoluteHpKeepRemount(storage, 1),
      true,
      "stamp stays: HP is not on the persist lock",
    );
  });

  it("reads bigint stats.hp from a character record", async () => {
    const storage = memStorage();
    noteAbsoluteHpKeepRemount(storage, 1, {
      persisted: true,
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
    const wrote = await resolveAbsoluteWriteHpAfterAbsoluteHpKeepRemount({
      liveHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP,
      readCharacter: async () => ({ stats: { hp: 70n } }),
      storage,
      slot: 1,
    });
    assert.equal(wrote, 70);
  });

  it("honours a later paid heal already on the canister", async () => {
    const storage = memStorage();
    noteAbsoluteHpKeepRemount(storage, 1, {
      persisted: true,
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
    const wrote = await resolveAbsoluteWriteHpAfterAbsoluteHpKeepRemount({
      liveHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP,
      readCharacter: async () => ({ stats: { hp: HEALED_HP + 10 } }),
      storage,
      slot: 1,
    });
    assert.equal(wrote, 80);
  });

  it("fail-closes when getCharacter returns Play-entry HP after keep", async () => {
    const storage = memStorage();
    noteAbsoluteHpKeepRemount(storage, 1, {
      persisted: true,
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
    await assert.rejects(
      () =>
        resolveAbsoluteWriteHpAfterAbsoluteHpKeepRemount({
          liveHp: PLAY_ENTRY_HP,
          clickHp: PLAY_ENTRY_HP,
          readCharacter: async () => ({ stats: { hp: PLAY_ENTRY_HP } }),
          storage,
          slot: 1,
        }),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(hasAbsoluteHpKeepRemount(storage, 1), true);
  });

  it("fail-closes when getCharacter throws after keep", async () => {
    const storage = memStorage();
    noteAbsoluteHpKeepRemount(storage, 1, {
      persisted: true,
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
    await assert.rejects(
      () =>
        resolveAbsoluteWriteHpAfterAbsoluteHpKeepRemount({
          liveHp: PLAY_ENTRY_HP,
          clickHp: PLAY_ENTRY_HP,
          readCharacter: async () => {
            throw new Error("replica unavailable");
          },
          storage,
          slot: 1,
        }),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
  });
});

describe("persistAbsoluteHpThroughAbsoluteHpKeepRemount", () => {
  it("stamps remount HP keep after a successful heal persist without death", async () => {
    const storage = memStorage();
    const persist = remountLock();
    let canisterHp = PLAY_ENTRY_HP;
    const persisted = await persistAbsoluteHpThroughAbsoluteHpKeepRemount({
      persist,
      storage,
      slot: 1,
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
      applyAndCommit: async () => {
        canisterHp = HEALED_HP;
        persist.commit({ doka: 190 });
        return { hp: canisterHp };
      },
    });
    assert.equal(canisterHp, 70);
    assert.equal(persisted.hp, 70);
    assert.equal(persist.snapshot().doka, 190);
    assert.deepEqual(readAbsoluteHpKeepRemount(storage, 1), {
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
  });

  it("stamps remount HP keep after a successful shop persist of damage", async () => {
    const storage = memStorage();
    const persist = remountLock();
    await persistAbsoluteHpThroughAbsoluteHpKeepRemount({
      persist,
      storage,
      slot: 1,
      preHp: PLAY_ENTRY_HP,
      postHp: DAMAGED_HP,
      applyAndCommit: async () => {
        persist.commit({ doka: 150 });
        return { hp: DAMAGED_HP };
      },
    });
    assert.deepEqual(readAbsoluteHpKeepRemount(storage, 1), {
      preHp: PLAY_ENTRY_HP,
      postHp: DAMAGED_HP,
    });
  });

  it("does not stamp keep when applyAndCommit throws (that is #445 / #847 catch)", async () => {
    const storage = memStorage();
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistAbsoluteHpThroughAbsoluteHpKeepRemount({
          persist,
          storage,
          slot: 1,
          preHp: PLAY_ENTRY_HP,
          postHp: HEALED_HP,
          applyAndCommit: async () => {
            persist.commit({ doka: 190 });
            throw new Error("saveBattleStats failed");
          },
        }),
      /saveBattleStats failed/,
    );
    assert.equal(readAbsoluteHpKeepRemount(storage, 1), null);
    assert.equal(persist.snapshot().doka, 190, "catch still spends the lock");
  });

  it("does not stamp a full-HP shop spend", async () => {
    const storage = memStorage();
    const persist = remountLock();
    await persistAbsoluteHpThroughAbsoluteHpKeepRemount({
      persist,
      storage,
      slot: 1,
      preHp: PLAY_ENTRY_HP,
      postHp: PLAY_ENTRY_HP,
      applyAndCommit: async () => {
        persist.commit({ doka: 150 });
        return { hp: PLAY_ENTRY_HP };
      },
    });
    assert.equal(hasAbsoluteHpKeepRemount(storage, 1), false);
  });

  it("runs beforeEach so shop persist can flush unpaid death (#445)", async () => {
    const storage = memStorage();
    let flushed = 0;
    const persist = createProgressPersist(
      { doka: 200, xp: 100, level: LEVEL },
      {
        beforeEach: async () => {
          flushed += 1;
        },
      },
    );
    await persistAbsoluteHpThroughAbsoluteHpKeepRemount({
      persist,
      storage,
      slot: 1,
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
      applyAndCommit: async () => {
        persist.commit({ doka: 190 });
        return { hp: HEALED_HP };
      },
    });
    assert.equal(flushed, 1);
    assert.equal(hasAbsoluteHpKeepRemount(storage, 1), true);
  });

  it("clears a keep stamp explicitly", () => {
    const storage = memStorage();
    noteAbsoluteHpKeepRemount(storage, 1, {
      persisted: true,
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
    assert.equal(hasAbsoluteHpKeepRemount(storage, 1), true);
    clearAbsoluteHpKeepRemount(storage, 1);
    assert.equal(hasAbsoluteHpKeepRemount(storage, 1), false);
  });
});

describe("distinct from unpaid remount #445 and death HP remount #847", () => {
  it("notes keep with no unpaid pending and no death persist", () => {
    assert.equal(
      shouldNoteAbsoluteHpKeepRemount({
        persisted: true,
        preHp: PLAY_ENTRY_HP,
        postHp: HEALED_HP,
      }),
      true,
      "this sidecar stamps parsed shop/heal HP, not death respawn",
    );
  });

  it("uses pbv_absolute_hp_keep_remount_slotN, not death / unpaid / XP keys", () => {
    const storage = memStorage();
    noteAbsoluteHpKeepRemount(storage, 2, {
      persisted: true,
      preHp: PLAY_ENTRY_HP,
      postHp: HEALED_HP,
    });
    assert.equal(
      absoluteHpKeepRemountKey(2),
      "pbv_absolute_hp_keep_remount_slot2",
    );
    assert.equal(
      storage.getItem("pbv_absolute_hp_keep_remount_slot2") != null,
      true,
    );
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot2"), null);
    assert.equal(storage.getItem("pbv_death_hp_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_xp_credit_keep_remount_slot2"), null);
  });
});
