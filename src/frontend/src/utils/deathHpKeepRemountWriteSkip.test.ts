import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clearDeathHpKeepRemount,
  deathHpKeepRemountKey,
  hasDeathHpKeepRemount,
  hpForDeathHpKeepRemountHonour,
  hpFromCharacterRecord,
  noteDeathHpKeepRemount,
  persistDeathPenaltyThroughDeathHpKeepRemount,
  readDeathHpKeepRemount,
  resolveAbsoluteWriteHpAfterDeathHpKeepRemount,
  shouldNoteDeathHpKeepRemount,
  shouldRefuseDeathHpKeepRemountStaleHp,
} from "./deathHpKeepRemountWriteSkip.ts";
import {
  type DeathPenaltyStorage,
  respawnHpAfterDeath,
} from "./deathPenalty.ts";
import { resolveAbsoluteWriteHp } from "./itemShop.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  clampAbsoluteProgressWrite,
  createProgressPersist,
} from "./progressPersist.ts";

const PLAY_ENTRY_HP = 100;
const LEVEL = 4;
const RESPAWN_HP = respawnHpAfterDeath(LEVEL);
const SHOP_SPEND = 50;

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

/** Production remount lock: GameFlow Doka (cut) + Play-entry leftover XP. */
function remountLock() {
  return createProgressPersist({ doka: 120, xp: 100, level: LEVEL });
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

describe("shouldNoteDeathHpKeepRemount", () => {
  it("notes keep after a successful death persist without unpaid marker", () => {
    assert.equal(
      shouldNoteDeathHpKeepRemount({ persisted: true, postHp: RESPAWN_HP }),
      true,
    );
  });

  it("does not note catch / unpaid (#445)", () => {
    assert.equal(
      shouldNoteDeathHpKeepRemount({ persisted: false, postHp: RESPAWN_HP }),
      false,
    );
  });

  it("does not note a zero postHp", () => {
    assert.equal(
      shouldNoteDeathHpKeepRemount({ persisted: true, postHp: 0 }),
      false,
    );
  });
});

describe("shouldRefuseDeathHpKeepRemountStaleHp", () => {
  it("refuses stale Play-entry HP equal to stamped preHp", () => {
    assert.equal(
      shouldRefuseDeathHpKeepRemountStaleHp({
        keep: true,
        liveHp: PLAY_ENTRY_HP,
        remountLiveHp: PLAY_ENTRY_HP,
        stampedPreHp: PLAY_ENTRY_HP,
        stampedPostHp: RESPAWN_HP,
      }),
      true,
    );
  });

  it("refuses remount Play-entry replica when death HP was already lower", () => {
    assert.equal(
      shouldRefuseDeathHpKeepRemountStaleHp({
        keep: true,
        liveHp: PLAY_ENTRY_HP,
        remountLiveHp: PLAY_ENTRY_HP,
        stampedPreHp: 40,
        stampedPostHp: RESPAWN_HP,
      }),
      true,
    );
  });

  it("does not refuse a fresh respawn replica", () => {
    assert.equal(
      shouldRefuseDeathHpKeepRemountStaleHp({
        keep: true,
        liveHp: RESPAWN_HP,
        remountLiveHp: PLAY_ENTRY_HP,
        stampedPreHp: PLAY_ENTRY_HP,
        stampedPostHp: RESPAWN_HP,
      }),
      false,
    );
  });

  it("does not refuse a later paid heal already on the canister", () => {
    assert.equal(
      shouldRefuseDeathHpKeepRemountStaleHp({
        keep: true,
        liveHp: RESPAWN_HP + 10,
        remountLiveHp: PLAY_ENTRY_HP,
        stampedPreHp: PLAY_ENTRY_HP,
        stampedPostHp: RESPAWN_HP,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseDeathHpKeepRemountStaleHp({
        keep: false,
        liveHp: PLAY_ENTRY_HP,
        remountLiveHp: PLAY_ENTRY_HP,
        stampedPreHp: PLAY_ENTRY_HP,
        stampedPostHp: RESPAWN_HP,
      }),
      false,
    );
  });

  it("fail-closes when keep is set and live HP is missing", () => {
    assert.equal(
      shouldRefuseDeathHpKeepRemountStaleHp({
        keep: true,
        liveHp: null,
        remountLiveHp: PLAY_ENTRY_HP,
        stampedPreHp: PLAY_ENTRY_HP,
        stampedPostHp: RESPAWN_HP,
      }),
      true,
    );
  });
});

describe("hpFromCharacterRecord", () => {
  it("reads number and bigint stats.hp", () => {
    assert.equal(hpFromCharacterRecord({ stats: { hp: RESPAWN_HP } }), 57);
    assert.equal(hpFromCharacterRecord({ stats: { hp: 57n } }), 57);
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(hpFromCharacterRecord(null), null);
    assert.equal(hpFromCharacterRecord({}), null);
    assert.equal(hpFromCharacterRecord({ stats: { hp: "nope" } }), null);
  });
});

describe("successful death persist then remount shop without unpaid death", () => {
  it("leftover remount shop writes HP 100 over canister 57 (the wipe)", () => {
    // Chronology:
    // 1. World hydrated. Play-entry HP 100 / XP 100 / Doka 200.
    // 2. Lava death persistDeathPenalty accepts respawn 57 / XP 80 / Doka 120.
    //    Marker confirmed and cleared. HUD HP 57. GameFlow stats.hp stays 100.
    //    #445 does not run (no unpaid pending).
    // 3. Actor reconnect remounts. characterStats.hp = Play-entry 100.
    //    maxHp is also s.hp, so Doka-heal is blocked.
    // 4. Items Buy persistAbsoluteProgress(100, 70). writeHp = min(100, 100).
    assert.equal(RESPAWN_HP, 57);
    const leftoverHp = leftoverShopWriteHp(PLAY_ENTRY_HP, PLAY_ENTRY_HP);
    assert.equal(
      leftoverHp,
      PLAY_ENTRY_HP,
      "ungated remount trusts Play-entry",
    );
    const honourHp = hpForDeathHpKeepRemountHonour({
      remountLiveHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP,
      liveHp: PLAY_ENTRY_HP,
      keep: false,
      stampedPreHp: PLAY_ENTRY_HP,
      stampedPostHp: RESPAWN_HP,
    });
    assert.equal(honourHp, PLAY_ENTRY_HP);
    const wrote = honourShopWrite(honourHp ?? 0, 120, SHOP_SPEND);
    assert.equal(wrote.hp, 100, "Play-entry honour wiped respawn HP");
    assert.equal(wrote.doka, 70);
  });

  it("does not saveBattleStats-wipe respawn HP after a gated fresh honour", () => {
    const honourHp = hpForDeathHpKeepRemountHonour({
      remountLiveHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP,
      liveHp: RESPAWN_HP,
      keep: true,
      stampedPreHp: PLAY_ENTRY_HP,
      stampedPostHp: RESPAWN_HP,
    });
    assert.equal(honourHp, RESPAWN_HP);
    const wrote = honourShopWrite(honourHp ?? 0, 120, SHOP_SPEND);
    assert.equal(wrote.hp, 57, "respawn HP survives remount shop");
    assert.equal(wrote.doka, 70);
  });

  it("fail-closes stale Play-entry 100 when the HP-keep stamp is set", () => {
    assert.equal(
      hpForDeathHpKeepRemountHonour({
        remountLiveHp: PLAY_ENTRY_HP,
        clickHp: PLAY_ENTRY_HP,
        liveHp: PLAY_ENTRY_HP,
        keep: true,
        stampedPreHp: PLAY_ENTRY_HP,
        stampedPostHp: RESPAWN_HP,
      }),
      null,
    );
  });

  it("shop 0-delta HP still honours replica respawn", () => {
    const honourHp = hpForDeathHpKeepRemountHonour({
      remountLiveHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP,
      liveHp: RESPAWN_HP,
      keep: true,
      stampedPreHp: PLAY_ENTRY_HP,
      stampedPostHp: RESPAWN_HP,
    });
    assert.equal(honourHp, 57, "Items Buy does not restore Play-entry HP");
  });

  it("applies a paid heal delta onto replica respawn", () => {
    const honourHp = hpForDeathHpKeepRemountHonour({
      remountLiveHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP + 9,
      liveHp: RESPAWN_HP,
      keep: true,
      stampedPreHp: PLAY_ENTRY_HP,
      stampedPostHp: RESPAWN_HP,
    });
    assert.equal(honourHp, 66);
  });

  it("incoming-above-stored XP 100 over death-cut 80 is not this wipe", () => {
    // saveBattleStats never raises XP. Remount writeXp 100 is ignored.
    // HP is the unique absolute-raise leftover vs #813.
    assert.equal(PLAY_ENTRY_HP > 80, true);
    assert.equal(RESPAWN_HP < PLAY_ENTRY_HP, true);
  });
});

describe("resolveAbsoluteWriteHpAfterDeathHpKeepRemount", () => {
  it("returns leftover min(live, click) when keep is unset", async () => {
    const storage = memStorage();
    const wrote = await resolveAbsoluteWriteHpAfterDeathHpKeepRemount({
      liveHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP,
      readCharacter: async () => ({ stats: { hp: RESPAWN_HP } }),
      storage,
      slot: 1,
    });
    assert.equal(wrote, PLAY_ENTRY_HP);
  });

  it("fetches replica respawn when the HP-keep stamp is set", async () => {
    const storage = memStorage();
    noteDeathHpKeepRemount(storage, 1, {
      persisted: true,
      preHp: PLAY_ENTRY_HP,
      postHp: RESPAWN_HP,
    });
    const wrote = await resolveAbsoluteWriteHpAfterDeathHpKeepRemount({
      liveHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP,
      readCharacter: async () => ({ stats: { hp: RESPAWN_HP } }),
      storage,
      slot: 1,
    });
    assert.equal(wrote, RESPAWN_HP);
    assert.equal(
      hasDeathHpKeepRemount(storage, 1),
      true,
      "stamp stays: HP is not on the persist lock",
    );
  });

  it("reads bigint stats.hp from a character record", async () => {
    const storage = memStorage();
    noteDeathHpKeepRemount(storage, 1, {
      persisted: true,
      preHp: PLAY_ENTRY_HP,
      postHp: RESPAWN_HP,
    });
    const wrote = await resolveAbsoluteWriteHpAfterDeathHpKeepRemount({
      liveHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP,
      readCharacter: async () => ({ stats: { hp: 57n } }),
      storage,
      slot: 1,
    });
    assert.equal(wrote, 57);
  });

  it("honours a later paid heal already on the canister", async () => {
    const storage = memStorage();
    noteDeathHpKeepRemount(storage, 1, {
      persisted: true,
      preHp: PLAY_ENTRY_HP,
      postHp: RESPAWN_HP,
    });
    const wrote = await resolveAbsoluteWriteHpAfterDeathHpKeepRemount({
      liveHp: PLAY_ENTRY_HP,
      clickHp: PLAY_ENTRY_HP,
      readCharacter: async () => ({ stats: { hp: RESPAWN_HP + 10 } }),
      storage,
      slot: 1,
    });
    assert.equal(wrote, 67);
  });

  it("fail-closes when getCharacter returns Play-entry HP after keep", async () => {
    const storage = memStorage();
    noteDeathHpKeepRemount(storage, 1, {
      persisted: true,
      preHp: PLAY_ENTRY_HP,
      postHp: RESPAWN_HP,
    });
    await assert.rejects(
      () =>
        resolveAbsoluteWriteHpAfterDeathHpKeepRemount({
          liveHp: PLAY_ENTRY_HP,
          clickHp: PLAY_ENTRY_HP,
          readCharacter: async () => ({ stats: { hp: PLAY_ENTRY_HP } }),
          storage,
          slot: 1,
        }),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(hasDeathHpKeepRemount(storage, 1), true);
  });

  it("fail-closes when getCharacter throws after keep", async () => {
    const storage = memStorage();
    noteDeathHpKeepRemount(storage, 1, {
      persisted: true,
      preHp: PLAY_ENTRY_HP,
      postHp: RESPAWN_HP,
    });
    await assert.rejects(
      () =>
        resolveAbsoluteWriteHpAfterDeathHpKeepRemount({
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

describe("persistDeathPenaltyThroughDeathHpKeepRemount", () => {
  it("stamps remount HP keep after a successful death persist without unpaid death", async () => {
    const storage = memStorage();
    const persist = remountLock();
    let canisterHp = PLAY_ENTRY_HP;
    const persisted = await persistDeathPenaltyThroughDeathHpKeepRemount({
      persist,
      storage,
      slot: 1,
      preHp: PLAY_ENTRY_HP,
      postHp: RESPAWN_HP,
      applyAndCommit: async () => {
        canisterHp = RESPAWN_HP;
        persist.commit({ doka: 120, xp: 80 });
        return { hp: canisterHp };
      },
    });
    assert.equal(canisterHp, 57);
    assert.equal(persisted.hp, 57);
    assert.equal(persist.snapshot().doka, 120);
    assert.deepEqual(readDeathHpKeepRemount(storage, 1), {
      preHp: PLAY_ENTRY_HP,
      postHp: RESPAWN_HP,
    });
  });

  it("does not stamp keep when applyAndCommit throws (that is #445)", async () => {
    const storage = memStorage();
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistDeathPenaltyThroughDeathHpKeepRemount({
          persist,
          storage,
          slot: 1,
          preHp: PLAY_ENTRY_HP,
          postHp: RESPAWN_HP,
          applyAndCommit: async () => {
            persist.commit({ doka: 120, xp: 80 });
            throw new Error("saveBattleStats failed");
          },
        }),
      /saveBattleStats failed/,
    );
    assert.equal(readDeathHpKeepRemount(storage, 1), null);
    assert.equal(persist.snapshot().doka, 120, "catch still cuts the lock");
  });

  it("skips beforeEach so death persist cannot flush itself", async () => {
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
    await persistDeathPenaltyThroughDeathHpKeepRemount({
      persist,
      storage,
      slot: 1,
      preHp: PLAY_ENTRY_HP,
      postHp: RESPAWN_HP,
      applyAndCommit: async () => {
        persist.commit({ doka: 120, xp: 80 });
        return { hp: RESPAWN_HP };
      },
    });
    assert.equal(flushed, 0);
    assert.equal(hasDeathHpKeepRemount(storage, 1), true);
  });

  it("clears a keep stamp explicitly", () => {
    const storage = memStorage();
    noteDeathHpKeepRemount(storage, 1, {
      persisted: true,
      preHp: PLAY_ENTRY_HP,
      postHp: RESPAWN_HP,
    });
    assert.equal(hasDeathHpKeepRemount(storage, 1), true);
    clearDeathHpKeepRemount(storage, 1);
    assert.equal(hasDeathHpKeepRemount(storage, 1), false);
  });
});

describe("distinct from unpaid remount #445 and leftover XP remount #813", () => {
  it("notes keep with no unpaid pending and no throw", () => {
    assert.equal(
      shouldNoteDeathHpKeepRemount({ persisted: true, postHp: RESPAWN_HP }),
      true,
      "this sidecar stamps parsed death HP, not unpaid replay",
    );
  });

  it("uses pbv_death_hp_keep_remount_slotN, not unpaid / XP keys", () => {
    const storage = memStorage();
    noteDeathHpKeepRemount(storage, 2, {
      persisted: true,
      preHp: PLAY_ENTRY_HP,
      postHp: RESPAWN_HP,
    });
    assert.equal(deathHpKeepRemountKey(2), "pbv_death_hp_keep_remount_slot2");
    assert.equal(
      storage.getItem("pbv_death_hp_keep_remount_slot2") != null,
      true,
    );
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot2"), null);
    assert.equal(storage.getItem("pbv_xp_credit_keep_remount_slot2"), null);
  });

  it("level 4 respawn is 57, not Play-entry 100 and not the old 255 formula", () => {
    assert.equal(respawnHpAfterDeath(4), 57);
    assert.notEqual(respawnHpAfterDeath(1), Math.floor((50 + 1) * 10 * 0.5));
  });
});
