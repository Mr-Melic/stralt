import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clampSaveBattleStatsWrite } from "./absoluteStatsClamp.ts";
import { committedDokaAfterAchievementCredit } from "./achievementReward.ts";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  createProgressPersist,
} from "./progressPersist.ts";
import {
  RENAME_DOKA_COST,
  committedDokaAfterRename,
  shouldStartRename,
} from "./renameCharacter.ts";
import { committedDokaAfterSpellUpgrade } from "./spellUpgrade.ts";
import {
  clearVictoryXpKeepRemountRenameSpend,
  hasVictoryXpKeepRemountRenameSpend,
  leftoverShopWriteAfterRenameWithVictoryXpKeep,
  leftoverShopWriteAfterUpgradeWithVictoryXpKeep,
  noteVictoryXpKeepRemountRenameSpend,
  persistRenameSpendThroughVictoryXpKeepRemount,
  readVictoryXpKeepRemountRenameSpend,
  sessionXpAfterVictoryXpKeepRemountRenameSpend,
  shouldRefuseVictoryXpKeepRemountRenameSpendStaleXp,
  victoryXpKeepRemountRenameSpendKey,
  xpForVictoryXpKeepRemountRenameSpend,
  xpFromVictoryXpKeepRenameSpendCharacterRecord,
} from "./victoryXpKeepRemountRenameSpendWriteSkip.ts";

const PLAY_ENTRY_XP = 100;
const PLAY_ENTRY_DOKA = 200;
const VICTORY_XP_DELTA = 80;
const VICTORY_LEFTOVER_XP = PLAY_ENTRY_XP + VICTORY_XP_DELTA;
const SHOP_SPEND = 50;
const FEAT_GRANT = 100;
const UPGRADE_COST = 10;
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

/** Production remount lock: GameFlow Play-entry leftover XP. */
function remountLock() {
  return createProgressPersist({
    doka: PLAY_ENTRY_DOKA,
    xp: PLAY_ENTRY_XP,
    level: LEVEL,
  });
}

function canisterAfterAbsoluteWrite(
  stored: { doka: number; xp: number },
  incoming: { doka: number; xp: number },
): { doka: number; xp: number } {
  const wrote = clampSaveBattleStatsWrite(
    { doka: stored.doka, xp: stored.xp, level: LEVEL },
    { doka: incoming.doka, xp: incoming.xp, level: LEVEL },
  );
  return { doka: wrote.doka, xp: wrote.xp };
}

describe("victoryXpKeepRemountRenameSpendKey", () => {
  it("reads the same #807 slot key, not leftover-credit or portal throw keys", () => {
    assert.equal(
      victoryXpKeepRemountRenameSpendKey(1),
      "pbv_victory_xp_keep_remount_slot1",
    );
    assert.equal(
      victoryXpKeepRemountRenameSpendKey(3),
      "pbv_victory_xp_keep_remount_slot3",
    );
    assert.notEqual(
      victoryXpKeepRemountRenameSpendKey(1),
      "pbv_xp_credit_keep_remount_slot1",
    );
    assert.notEqual(
      victoryXpKeepRemountRenameSpendKey(1),
      "pbv_portal_xp_keep_remount_slot1",
    );
    assert.notEqual(
      victoryXpKeepRemountRenameSpendKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    assert.notEqual(
      victoryXpKeepRemountRenameSpendKey(1),
      "pbv_feat_doka_keep_remount_slot1",
    );
    assert.notEqual(
      victoryXpKeepRemountRenameSpendKey(1),
      "pbv_spend_keep_remount_slot1",
    );
  });
});

describe("note / read / clear VictoryXpKeepRemountRenameSpend", () => {
  it("round-trips the #807 { preXp } shape", () => {
    const storage = memStorage();
    assert.equal(hasVictoryXpKeepRemountRenameSpend(storage, 1), false);
    noteVictoryXpKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_XP);
    assert.deepEqual(readVictoryXpKeepRemountRenameSpend(storage, 1), {
      preXp: PLAY_ENTRY_XP,
    });
    assert.equal(hasVictoryXpKeepRemountRenameSpend(storage, 1), true);
    clearVictoryXpKeepRemountRenameSpend(storage, 1);
    assert.equal(readVictoryXpKeepRemountRenameSpend(storage, 1), null);
  });

  it("isolates character slots", () => {
    const storage = memStorage();
    noteVictoryXpKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_XP);
    noteVictoryXpKeepRemountRenameSpend(storage, 2, 90);
    assert.deepEqual(readVictoryXpKeepRemountRenameSpend(storage, 1), {
      preXp: PLAY_ENTRY_XP,
    });
    assert.deepEqual(readVictoryXpKeepRemountRenameSpend(storage, 2), {
      preXp: 90,
    });
    clearVictoryXpKeepRemountRenameSpend(storage, 1);
    assert.equal(readVictoryXpKeepRemountRenameSpend(storage, 1), null);
    assert.equal(hasVictoryXpKeepRemountRenameSpend(storage, 2), true);
  });
});

describe("xpFromVictoryXpKeepRenameSpendCharacterRecord", () => {
  it("reads number, bigint, and { ok } leftover", () => {
    assert.equal(
      xpFromVictoryXpKeepRenameSpendCharacterRecord({
        experience: VICTORY_LEFTOVER_XP,
      }),
      180,
    );
    assert.equal(
      xpFromVictoryXpKeepRenameSpendCharacterRecord({
        experience: 180n,
      }),
      180,
    );
    assert.equal(
      xpFromVictoryXpKeepRenameSpendCharacterRecord({
        ok: { experience: VICTORY_LEFTOVER_XP },
      }),
      180,
    );
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(xpFromVictoryXpKeepRenameSpendCharacterRecord(null), null);
    assert.equal(xpFromVictoryXpKeepRenameSpendCharacterRecord({}), null);
    assert.equal(
      xpFromVictoryXpKeepRenameSpendCharacterRecord({ experience: "nope" }),
      null,
    );
  });
});

describe("shouldRefuseVictoryXpKeepRemountRenameSpendStaleXp", () => {
  it("fail-closes when live still equals stamped preXp", () => {
    assert.equal(
      shouldRefuseVictoryXpKeepRemountRenameSpendStaleXp({
        keep: true,
        liveXp: PLAY_ENTRY_XP,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      true,
    );
  });

  it("fail-closes when keep is set and live XP is missing", () => {
    assert.equal(
      shouldRefuseVictoryXpKeepRemountRenameSpendStaleXp({
        keep: true,
        liveXp: null,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      true,
    );
  });

  it("does not refuse a risen victory leftover 180", () => {
    assert.equal(
      shouldRefuseVictoryXpKeepRemountRenameSpendStaleXp({
        keep: true,
        liveXp: VICTORY_LEFTOVER_XP,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      false,
    );
  });

  it("does not refuse leftover already below preXp (level-up)", () => {
    assert.equal(
      shouldRefuseVictoryXpKeepRemountRenameSpendStaleXp({
        keep: true,
        liveXp: 24,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseVictoryXpKeepRemountRenameSpendStaleXp({
        keep: false,
        liveXp: PLAY_ENTRY_XP,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      false,
    );
  });
});

describe("victory XP throw then remount rename without unpaid death", () => {
  it("leftover remount rename keeps Play-entry XP 100 while canister leftover is 180", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 / XP 100. Canister 200/100.
    // 2. Victory applyRewards(slot, doka, 80) invokes then throws.
    //    Canister leftover 180. Lock stays 100. GameFlow Play-entry
    //    stays 100. #807 stamps preXp=100.
    // 3. Actor reconnect remounts. Lock XP 100.
    // 4. Rename committedDokaAfterRename(200) → 100. Lock XP stays 100.
    const leftoverCommit = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.equal(leftoverCommit, 100);
    const remount = remountLock();
    assert.equal(remount.snapshot().xp, PLAY_ENTRY_XP);
    assert.equal(leftoverCommit, PLAY_ENTRY_DOKA - RENAME_DOKA_COST);
  });

  it("leftover shop after that rename writes XP 100 over canister 180", () => {
    const leftoverShop = leftoverShopWriteAfterRenameWithVictoryXpKeep({
      remountXp: PLAY_ENTRY_XP,
      liveXp: VICTORY_LEFTOVER_XP,
      keep: false,
      stampedPreXp: PLAY_ENTRY_XP,
      remountDoka: PLAY_ENTRY_DOKA,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(leftoverShop, { xp: 100, doka: 50 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: 100, xp: VICTORY_LEFTOVER_XP },
        leftoverShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 50, xp: 100 },
      "incoming-below-stored wipes victory leftover (Doka spend is legitimate)",
    );
  });

  it("gated remount rename honours leftover 180 so leftover shop cannot wipe it", () => {
    const gatedShop = leftoverShopWriteAfterRenameWithVictoryXpKeep({
      remountXp: PLAY_ENTRY_XP,
      liveXp: VICTORY_LEFTOVER_XP,
      keep: true,
      stampedPreXp: PLAY_ENTRY_XP,
      remountDoka: PLAY_ENTRY_DOKA,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(gatedShop, { xp: 180, doka: 50 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: 100, xp: VICTORY_LEFTOVER_XP },
        gatedShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 50, xp: 180 },
    );
  });
});

describe("Boss Rush room-clear throw is the same #807 stamp", () => {
  it("leftover remount rename after room-clear throw still writes Play-entry XP", () => {
    const leftoverShop = leftoverShopWriteAfterRenameWithVictoryXpKeep({
      remountXp: PLAY_ENTRY_XP,
      liveXp: VICTORY_LEFTOVER_XP,
      keep: false,
      stampedPreXp: PLAY_ENTRY_XP,
      remountDoka: PLAY_ENTRY_DOKA,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(leftoverShop, { xp: 100, doka: 50 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: 100, xp: VICTORY_LEFTOVER_XP },
        leftoverShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 50, xp: 100 },
    );
  });
});

describe("upgrade leftover when remount lock is Play-entry XP 100", () => {
  it("leftover remount upgrade writes XP 100 over canister 180 after upgrade", () => {
    const leftover = leftoverShopWriteAfterUpgradeWithVictoryXpKeep({
      remountXp: PLAY_ENTRY_XP,
      liveXp: VICTORY_LEFTOVER_XP,
      keep: false,
      stampedPreXp: PLAY_ENTRY_XP,
      remountDoka: PLAY_ENTRY_DOKA,
      advertisedCost: UPGRADE_COST,
      backendDokaAfter: undefined,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(leftover, { xp: 100, doka: 140 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: PLAY_ENTRY_DOKA - UPGRADE_COST, xp: VICTORY_LEFTOVER_XP },
        leftover ?? { xp: 0, doka: 0 },
      ),
      { doka: 140, xp: 100 },
      "incoming-below-stored wipes victory leftover after upgrade",
    );
  });

  it("risen leftover-XP upgrade query does not self-heal remount XP", () => {
    const leftoverRisen = leftoverShopWriteAfterUpgradeWithVictoryXpKeep({
      remountXp: PLAY_ENTRY_XP,
      liveXp: VICTORY_LEFTOVER_XP,
      keep: false,
      stampedPreXp: PLAY_ENTRY_XP,
      remountDoka: PLAY_ENTRY_DOKA,
      advertisedCost: UPGRADE_COST,
      backendDokaAfter: PLAY_ENTRY_DOKA - UPGRADE_COST,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(
      leftoverRisen,
      { xp: 100, doka: 140 },
      "production upgrade adopts a dropped Doka query; leftover XP stays Play-entry",
    );
  });

  it("gated remount upgrade writes leftover 180 after upgrade shop spend", () => {
    const gated = leftoverShopWriteAfterUpgradeWithVictoryXpKeep({
      remountXp: PLAY_ENTRY_XP,
      liveXp: VICTORY_LEFTOVER_XP,
      keep: true,
      stampedPreXp: PLAY_ENTRY_XP,
      remountDoka: PLAY_ENTRY_DOKA,
      advertisedCost: UPGRADE_COST,
      backendDokaAfter: undefined,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(gated, { xp: 180, doka: 140 });
  });
});

describe("sessionXpAfterVictoryXpKeepRemountRenameSpend", () => {
  it("ungated remount leftover stays Play-entry 100 so leftover shop writes a lie", () => {
    const session = sessionXpAfterVictoryXpKeepRemountRenameSpend({
      remountXp: PLAY_ENTRY_XP,
      liveXp: VICTORY_LEFTOVER_XP,
      keep: false,
      stampedPreXp: PLAY_ENTRY_XP,
    });
    assert.equal(session, PLAY_ENTRY_XP);
    assert.equal(shouldStartRename(false, PLAY_ENTRY_DOKA), true);
  });

  it("honour replica leftover 180 so leftover shop matches the canister", () => {
    const session = sessionXpAfterVictoryXpKeepRemountRenameSpend({
      remountXp: PLAY_ENTRY_XP,
      liveXp: VICTORY_LEFTOVER_XP,
      keep: true,
      stampedPreXp: PLAY_ENTRY_XP,
    });
    assert.equal(session, VICTORY_LEFTOVER_XP);
  });
});

describe("pickup-only remount still uses Play-entry leftover XP", () => {
  it("does not honour without a keep stamp", () => {
    const shop = leftoverShopWriteAfterRenameWithVictoryXpKeep({
      remountXp: PLAY_ENTRY_XP,
      liveXp: VICTORY_LEFTOVER_XP,
      keep: false,
      stampedPreXp: PLAY_ENTRY_XP,
      remountDoka: PLAY_ENTRY_DOKA,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(shop, { xp: 100, doka: 50 });
  });
});

describe("persistRenameSpendThroughVictoryXpKeepRemount", () => {
  it("adopts replica leftover 180 then rename commits Doka 100", async () => {
    const storage = memStorage();
    noteVictoryXpKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    let applied = false;
    const ok = await persistRenameSpendThroughVictoryXpKeepRemount({
      persist,
      storage,
      slot: 1,
      readCharacter: async () => ({ experience: VICTORY_LEFTOVER_XP }),
      applyAndCommit: async () => {
        applied = true;
        persist.commit({
          doka: committedDokaAfterRename(persist.snapshot().doka),
        });
        return true;
      },
    });
    assert.equal(ok, true);
    assert.equal(applied, true);
    assert.equal(persist.snapshot().doka, 100);
    assert.equal(persist.snapshot().xp, VICTORY_LEFTOVER_XP);
    assert.equal(
      hasVictoryXpKeepRemountRenameSpend(storage, 1),
      false,
      "clear the stamp after honour so leftover shop cannot reconstruct 100",
    );
  });

  it("adopts replica leftover 180 then missing-query upgrade commits Doka 190", async () => {
    const storage = memStorage();
    noteVictoryXpKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    await persistRenameSpendThroughVictoryXpKeepRemount({
      persist,
      storage,
      slot: 1,
      readCharacter: async () => ({ experience: VICTORY_LEFTOVER_XP }),
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterSpellUpgrade(
            persist.snapshot().doka,
            undefined,
            UPGRADE_COST,
          ),
        });
        return true;
      },
    });
    assert.equal(persist.snapshot().doka, 190);
    assert.equal(persist.snapshot().xp, VICTORY_LEFTOVER_XP);
  });

  it("honours leftover already below stamped preXp", async () => {
    const storage = memStorage();
    noteVictoryXpKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    await persistRenameSpendThroughVictoryXpKeepRemount({
      persist,
      storage,
      slot: 1,
      readCharacter: async () => ({ experience: 24 }),
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterRename(persist.snapshot().doka),
        });
        return true;
      },
    });
    assert.equal(persist.snapshot().xp, 24);
    assert.equal(persist.snapshot().doka, 100);
  });

  it("throws and does not apply when live XP is still Play-entry", async () => {
    const storage = memStorage();
    noteVictoryXpKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistRenameSpendThroughVictoryXpKeepRemount({
          persist,
          storage,
          slot: 1,
          readCharacter: async () => ({ experience: PLAY_ENTRY_XP }),
          applyAndCommit: async () => {
            applied = true;
            persist.commit({
              doka: committedDokaAfterRename(persist.snapshot().doka),
            });
            return true;
          },
        }),
      (err: unknown) =>
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
    );
    assert.equal(applied, false);
    assert.equal(persist.snapshot().xp, PLAY_ENTRY_XP);
    assert.equal(persist.snapshot().doka, PLAY_ENTRY_DOKA);
    assert.equal(
      hasVictoryXpKeepRemountRenameSpend(storage, 1),
      true,
      "fail-close keeps the stamp",
    );
  });

  it("throws when getCharacter fails so a stale rename cannot land", async () => {
    const storage = memStorage();
    noteVictoryXpKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistRenameSpendThroughVictoryXpKeepRemount({
          persist,
          storage,
          slot: 1,
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

  it("applies when no stamp exists without fetching", async () => {
    const persist = remountLock();
    const ok = await persistRenameSpendThroughVictoryXpKeepRemount({
      persist,
      storage: memStorage(),
      slot: 1,
      readCharacter: async () => {
        throw new Error("must not fetch without a stamp");
      },
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterRename(persist.snapshot().doka),
        });
        return true;
      },
    });
    assert.equal(ok, true);
    assert.equal(persist.snapshot().doka, 100);
    assert.equal(persist.snapshot().xp, PLAY_ENTRY_XP);
  });

  it("runs beforeEach so rename persist can flush unpaid death (#445)", async () => {
    const storage = memStorage();
    noteVictoryXpKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_XP);
    let flushed = 0;
    const persist = createProgressPersist(
      { doka: PLAY_ENTRY_DOKA, xp: PLAY_ENTRY_XP, level: LEVEL },
      {
        beforeEach: async () => {
          flushed += 1;
        },
      },
    );
    await persistRenameSpendThroughVictoryXpKeepRemount({
      persist,
      storage,
      slot: 1,
      readCharacter: async () => ({ experience: VICTORY_LEFTOVER_XP }),
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterRename(persist.snapshot().doka),
        });
        return true;
      },
    });
    assert.equal(flushed, 1);
  });
});

describe("distinct from #807 shop, #918 death, #1043 feat, #1041 leftover rename, #1045 portal", () => {
  it("uses pbv_victory_xp_keep_remount_slotN, not leftover-credit or portal keys", () => {
    const storage = memStorage();
    noteVictoryXpKeepRemountRenameSpend(storage, 2, PLAY_ENTRY_XP);
    assert.equal(
      victoryXpKeepRemountRenameSpendKey(2),
      "pbv_victory_xp_keep_remount_slot2",
    );
    assert.equal(
      storage.getItem("pbv_victory_xp_keep_remount_slot2") != null,
      true,
    );
    assert.equal(storage.getItem("pbv_xp_credit_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_portal_xp_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_victory_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_feat_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_spend_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot2"), null);
  });

  it("does not treat #807 remount shop spend as this rename path", () => {
    const shopHonour = xpForVictoryXpKeepRemountRenameSpend({
      remountXp: PLAY_ENTRY_XP,
      liveXp: VICTORY_LEFTOVER_XP,
      keep: true,
      stampedPreXp: PLAY_ENTRY_XP,
    });
    assert.equal(
      shopHonour,
      VICTORY_LEFTOVER_XP,
      "#807 gated shop leftover XP",
    );
    const leftoverRename = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.equal(leftoverRename, 100);
    assert.notEqual(leftoverRename, shopHonour);
  });

  it("does not skip leftover shop/heal XP honour — that stays #807", () => {
    const honour = xpForVictoryXpKeepRemountRenameSpend({
      remountXp: PLAY_ENTRY_XP,
      liveXp: VICTORY_LEFTOVER_XP,
      keep: true,
      stampedPreXp: PLAY_ENTRY_XP,
    });
    assert.equal(honour, VICTORY_LEFTOVER_XP);
    assert.equal(
      applySpendToCommitted(PLAY_ENTRY_DOKA, SHOP_SPEND),
      150,
      "shop leftover still spends from remount Doka; this sidecar only gates rename/upgrade leftover XP",
    );
  });

  it("does not treat #918 remount death-cut of leftover 180 as this rename path", () => {
    const deathCutXp = Math.floor(VICTORY_LEFTOVER_XP * 0.8);
    assert.equal(deathCutXp, 144, "#918 taxes replica leftover 180, not 100");
    const leftoverRenameXp = PLAY_ENTRY_XP;
    assert.notEqual(leftoverRenameXp, deathCutXp);
  });

  it("does not treat #1043 remount feat add as this rename leftover-XP path", () => {
    const leftoverClaim = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
      FEAT_GRANT,
    );
    assert.equal(leftoverClaim, 300);
    const leftoverRename = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.equal(leftoverRename, 100);
    assert.equal(
      leftoverClaim - leftoverRename,
      200,
      "claim adds 100 onto 200; rename subtracts 100 from 200",
    );
  });

  it("does not treat #1041 leftover-credit remount rename as this throw stamp", () => {
    assert.equal(
      victoryXpKeepRemountRenameSpendKey(1),
      "pbv_victory_xp_keep_remount_slot1",
    );
    assert.notEqual(
      victoryXpKeepRemountRenameSpendKey(1),
      "pbv_xp_credit_keep_remount_slot1",
      "#1041 honours a parsed leftover commit; this honours a victory throw",
    );
  });

  it("does not treat #1045 portal-throw remount rename as this victory stamp", () => {
    assert.notEqual(
      victoryXpKeepRemountRenameSpendKey(1),
      "pbv_portal_xp_keep_remount_slot1",
      "#1045 honours portal +10 throw; this honours victory leftover throw",
    );
  });
});
