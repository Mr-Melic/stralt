import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clampSaveBattleStatsWrite } from "./absoluteStatsClamp.ts";
import { committedDokaAfterAchievementCredit } from "./achievementReward.ts";
import { PORTAL_TRANSITION_XP } from "./applyRewardsResult.ts";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  clearPortalXpKeepRemountRenameSpend,
  hasPortalXpKeepRemountRenameSpend,
  leftoverShopWriteAfterRenameWithPortalXpKeep,
  leftoverShopWriteAfterUpgradeWithPortalXpKeep,
  notePortalXpKeepRemountRenameSpend,
  persistRenameSpendThroughPortalXpKeepRemount,
  portalXpKeepRemountRenameSpendKey,
  readPortalXpKeepRemountRenameSpend,
  sessionXpAfterPortalXpKeepRemountRenameSpend,
  shouldRefusePortalXpKeepRemountRenameSpendStaleXp,
  xpForPortalXpKeepRemountRenameSpend,
  xpFromPortalXpKeepRenameSpendCharacterRecord,
} from "./portalXpKeepRemountRenameSpendWriteSkip.ts";
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

const PLAY_ENTRY_XP = 100;
const PLAY_ENTRY_DOKA = 200;
const PORTAL_LEFTOVER_XP = PLAY_ENTRY_XP + PORTAL_TRANSITION_XP;
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

describe("portalXpKeepRemountRenameSpendKey", () => {
  it("reads the same #767 slot key, not leftover-credit or Doka keep keys", () => {
    assert.equal(
      portalXpKeepRemountRenameSpendKey(1),
      "pbv_portal_xp_keep_remount_slot1",
    );
    assert.equal(
      portalXpKeepRemountRenameSpendKey(3),
      "pbv_portal_xp_keep_remount_slot3",
    );
    assert.notEqual(
      portalXpKeepRemountRenameSpendKey(1),
      "pbv_xp_credit_keep_remount_slot1",
    );
    assert.notEqual(
      portalXpKeepRemountRenameSpendKey(1),
      "pbv_victory_xp_keep_remount_slot1",
    );
    assert.notEqual(
      portalXpKeepRemountRenameSpendKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    assert.notEqual(
      portalXpKeepRemountRenameSpendKey(1),
      "pbv_feat_doka_keep_remount_slot1",
    );
    assert.notEqual(
      portalXpKeepRemountRenameSpendKey(1),
      "pbv_spend_keep_remount_slot1",
    );
  });
});

describe("note / read / clear PortalXpKeepRemountRenameSpend", () => {
  it("round-trips the #767 { preXp } shape", () => {
    const storage = memStorage();
    assert.equal(hasPortalXpKeepRemountRenameSpend(storage, 1), false);
    notePortalXpKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_XP);
    assert.deepEqual(readPortalXpKeepRemountRenameSpend(storage, 1), {
      preXp: PLAY_ENTRY_XP,
    });
    assert.equal(hasPortalXpKeepRemountRenameSpend(storage, 1), true);
    clearPortalXpKeepRemountRenameSpend(storage, 1);
    assert.equal(readPortalXpKeepRemountRenameSpend(storage, 1), null);
  });

  it("isolates character slots", () => {
    const storage = memStorage();
    notePortalXpKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_XP);
    notePortalXpKeepRemountRenameSpend(storage, 2, 90);
    assert.deepEqual(readPortalXpKeepRemountRenameSpend(storage, 1), {
      preXp: PLAY_ENTRY_XP,
    });
    assert.deepEqual(readPortalXpKeepRemountRenameSpend(storage, 2), {
      preXp: 90,
    });
    clearPortalXpKeepRemountRenameSpend(storage, 1);
    assert.equal(readPortalXpKeepRemountRenameSpend(storage, 1), null);
    assert.equal(hasPortalXpKeepRemountRenameSpend(storage, 2), true);
  });
});

describe("xpFromPortalXpKeepRenameSpendCharacterRecord", () => {
  it("reads number, bigint, and { ok } leftover", () => {
    assert.equal(
      xpFromPortalXpKeepRenameSpendCharacterRecord({
        experience: PORTAL_LEFTOVER_XP,
      }),
      110,
    );
    assert.equal(
      xpFromPortalXpKeepRenameSpendCharacterRecord({
        experience: 110n,
      }),
      110,
    );
    assert.equal(
      xpFromPortalXpKeepRenameSpendCharacterRecord({
        ok: { experience: PORTAL_LEFTOVER_XP },
      }),
      110,
    );
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(xpFromPortalXpKeepRenameSpendCharacterRecord(null), null);
    assert.equal(xpFromPortalXpKeepRenameSpendCharacterRecord({}), null);
    assert.equal(
      xpFromPortalXpKeepRenameSpendCharacterRecord({ experience: "nope" }),
      null,
    );
  });
});

describe("shouldRefusePortalXpKeepRemountRenameSpendStaleXp", () => {
  it("fail-closes when live still equals stamped preXp", () => {
    assert.equal(
      shouldRefusePortalXpKeepRemountRenameSpendStaleXp({
        keep: true,
        liveXp: PLAY_ENTRY_XP,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      true,
    );
  });

  it("fail-closes when keep is set and live XP is missing", () => {
    assert.equal(
      shouldRefusePortalXpKeepRemountRenameSpendStaleXp({
        keep: true,
        liveXp: null,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      true,
    );
  });

  it("does not refuse a risen portal leftover 110", () => {
    assert.equal(
      shouldRefusePortalXpKeepRemountRenameSpendStaleXp({
        keep: true,
        liveXp: PORTAL_LEFTOVER_XP,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      false,
    );
  });

  it("does not refuse leftover already below preXp (level-up)", () => {
    assert.equal(
      shouldRefusePortalXpKeepRemountRenameSpendStaleXp({
        keep: true,
        liveXp: 24,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefusePortalXpKeepRemountRenameSpendStaleXp({
        keep: false,
        liveXp: PLAY_ENTRY_XP,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      false,
    );
  });
});

describe("portal throw-after-add then remount rename without unpaid death", () => {
  it("leftover remount rename keeps Play-entry XP 100 while canister leftover is 110", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 / XP 100. Canister 200/100.
    // 2. Portal persistIncrementalRewards(0, 10) invokes then throws.
    //    Canister leftover 110. #767 stamps preXp=100.
    // 3. Actor reconnect remounts. Lock XP 100.
    // 4. Rename committedDokaAfterRename(200) → 100. Canister Doka 100
    //    (portal did not change Doka). Lock XP stays 100.
    const leftoverCommit = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.equal(leftoverCommit, 100);
    const remount = remountLock();
    assert.equal(remount.snapshot().xp, PLAY_ENTRY_XP);
    assert.equal(
      leftoverCommit,
      PLAY_ENTRY_DOKA - RENAME_DOKA_COST,
      "portal leftover XP does not change Doka; rename debit matches canister",
    );
  });

  it("leftover shop after that rename writes XP 100 over canister 110", () => {
    const leftoverShop = leftoverShopWriteAfterRenameWithPortalXpKeep({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: false,
      stampedPreXp: PLAY_ENTRY_XP,
      remountDoka: PLAY_ENTRY_DOKA,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(leftoverShop, { xp: 100, doka: 50 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: 100, xp: PORTAL_LEFTOVER_XP },
        leftoverShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 50, xp: 100 },
      "incoming-below-stored wipes portal +10 (Doka spend is legitimate)",
    );
  });

  it("gated remount rename honours leftover 110 so leftover shop cannot wipe it", () => {
    const gatedShop = leftoverShopWriteAfterRenameWithPortalXpKeep({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: true,
      stampedPreXp: PLAY_ENTRY_XP,
      remountDoka: PLAY_ENTRY_DOKA,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(gatedShop, { xp: 110, doka: 50 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: 100, xp: PORTAL_LEFTOVER_XP },
        gatedShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 50, xp: 110 },
    );
  });
});

describe("upgrade leftover when remount lock is Play-entry XP 100", () => {
  it("leftover remount upgrade writes XP 100 over canister 110 after upgrade", () => {
    const leftover = leftoverShopWriteAfterUpgradeWithPortalXpKeep({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
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
        { doka: PLAY_ENTRY_DOKA - UPGRADE_COST, xp: PORTAL_LEFTOVER_XP },
        leftover ?? { xp: 0, doka: 0 },
      ),
      { doka: 140, xp: 100 },
      "incoming-below-stored wipes portal +10 after upgrade",
    );
  });

  it("risen leftover-XP upgrade query does not self-heal remount XP", () => {
    const leftoverRisen = leftoverShopWriteAfterUpgradeWithPortalXpKeep({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
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

  it("gated remount upgrade writes leftover 110 after upgrade shop spend", () => {
    const gated = leftoverShopWriteAfterUpgradeWithPortalXpKeep({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: true,
      stampedPreXp: PLAY_ENTRY_XP,
      remountDoka: PLAY_ENTRY_DOKA,
      advertisedCost: UPGRADE_COST,
      backendDokaAfter: undefined,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(gated, { xp: 110, doka: 140 });
  });
});

describe("sessionXpAfterPortalXpKeepRemountRenameSpend", () => {
  it("ungated remount leftover stays Play-entry 100 so leftover shop writes a lie", () => {
    const session = sessionXpAfterPortalXpKeepRemountRenameSpend({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: false,
      stampedPreXp: PLAY_ENTRY_XP,
    });
    assert.equal(session, PLAY_ENTRY_XP);
    assert.equal(shouldStartRename(false, PLAY_ENTRY_DOKA), true);
  });

  it("honour replica leftover 110 so leftover shop matches the canister", () => {
    const session = sessionXpAfterPortalXpKeepRemountRenameSpend({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: true,
      stampedPreXp: PLAY_ENTRY_XP,
    });
    assert.equal(session, PORTAL_LEFTOVER_XP);
  });
});

describe("pickup-only remount still uses Play-entry leftover XP", () => {
  it("does not honour without a keep stamp", () => {
    const shop = leftoverShopWriteAfterRenameWithPortalXpKeep({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: false,
      stampedPreXp: PLAY_ENTRY_XP,
      remountDoka: PLAY_ENTRY_DOKA,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(shop, { xp: 100, doka: 50 });
  });
});

describe("persistRenameSpendThroughPortalXpKeepRemount", () => {
  it("adopts replica leftover 110 then rename commits Doka 100", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    let applied = false;
    const ok = await persistRenameSpendThroughPortalXpKeepRemount({
      persist,
      storage,
      slot: 1,
      readCharacter: async () => ({ experience: PORTAL_LEFTOVER_XP }),
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
    assert.equal(persist.snapshot().xp, PORTAL_LEFTOVER_XP);
    assert.equal(
      hasPortalXpKeepRemountRenameSpend(storage, 1),
      false,
      "clear the stamp after honour so leftover shop cannot reconstruct 100",
    );
  });

  it("adopts replica leftover 110 then missing-query upgrade commits Doka 190", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    await persistRenameSpendThroughPortalXpKeepRemount({
      persist,
      storage,
      slot: 1,
      readCharacter: async () => ({ experience: PORTAL_LEFTOVER_XP }),
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
    assert.equal(persist.snapshot().xp, PORTAL_LEFTOVER_XP);
  });

  it("honours leftover already below stamped preXp", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    await persistRenameSpendThroughPortalXpKeepRemount({
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
    notePortalXpKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistRenameSpendThroughPortalXpKeepRemount({
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
      hasPortalXpKeepRemountRenameSpend(storage, 1),
      true,
      "fail-close keeps the stamp",
    );
  });

  it("throws when getCharacter fails so a stale rename cannot land", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistRenameSpendThroughPortalXpKeepRemount({
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
    const ok = await persistRenameSpendThroughPortalXpKeepRemount({
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
    notePortalXpKeepRemountRenameSpend(storage, 1, PLAY_ENTRY_XP);
    let flushed = 0;
    const persist = createProgressPersist(
      { doka: PLAY_ENTRY_DOKA, xp: PLAY_ENTRY_XP, level: LEVEL },
      {
        beforeEach: async () => {
          flushed += 1;
        },
      },
    );
    await persistRenameSpendThroughPortalXpKeepRemount({
      persist,
      storage,
      slot: 1,
      readCharacter: async () => ({ experience: PORTAL_LEFTOVER_XP }),
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

describe("distinct from #767 shop honour, #912 death, #1037 feat, #1041 leftover-credit rename", () => {
  it("uses pbv_portal_xp_keep_remount_slotN, not leftover-credit or Doka keys", () => {
    const storage = memStorage();
    notePortalXpKeepRemountRenameSpend(storage, 2, PLAY_ENTRY_XP);
    assert.equal(
      portalXpKeepRemountRenameSpendKey(2),
      "pbv_portal_xp_keep_remount_slot2",
    );
    assert.equal(
      storage.getItem("pbv_portal_xp_keep_remount_slot2") != null,
      true,
    );
    assert.equal(storage.getItem("pbv_xp_credit_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_victory_xp_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_victory_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_feat_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_spend_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot2"), null);
  });

  it("does not treat #767 remount shop spend as this rename path", () => {
    const shopHonour = xpForPortalXpKeepRemountRenameSpend({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: true,
      stampedPreXp: PLAY_ENTRY_XP,
    });
    assert.equal(shopHonour, PORTAL_LEFTOVER_XP, "#767 gated shop leftover XP");
    const leftoverRename = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.equal(leftoverRename, 100);
    assert.notEqual(leftoverRename, shopHonour);
  });

  it("does not skip leftover shop/heal XP honour — that stays #767", () => {
    const honour = xpForPortalXpKeepRemountRenameSpend({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: true,
      stampedPreXp: PLAY_ENTRY_XP,
    });
    assert.equal(honour, PORTAL_LEFTOVER_XP);
    assert.equal(
      applySpendToCommitted(PLAY_ENTRY_DOKA, SHOP_SPEND),
      150,
      "shop leftover still spends from remount Doka; this sidecar only gates rename/upgrade leftover XP",
    );
  });

  it("does not treat #912 remount death-cut of leftover 110 as this rename path", () => {
    const deathCutXp = Math.floor(PORTAL_LEFTOVER_XP * 0.8);
    assert.equal(deathCutXp, 88, "#912 taxes replica leftover 110, not 100");
    const leftoverRenameXp = PLAY_ENTRY_XP;
    assert.notEqual(leftoverRenameXp, deathCutXp);
  });

  it("does not treat #1037 remount feat add as this rename leftover-XP path", () => {
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
    assert.notEqual(
      portalXpKeepRemountRenameSpendKey(1),
      "pbv_xp_credit_keep_remount_slot1",
    );
    const leftoverRename = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.equal(leftoverRename, 100);
    assert.equal(
      leftoverRename,
      PLAY_ENTRY_DOKA - RENAME_DOKA_COST,
      "portal leftover XP does not change Doka; this leftover sits leftover XP below stored",
    );
  });

  it("does not treat #992 feat Doka remount rename (rise 500) as this leftover XP", () => {
    const featDokaCanisterAfterRename = 600;
    const leftoverRename = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.equal(leftoverRename, 100);
    assert.equal(
      featDokaCanisterAfterRename - leftoverRename,
      500,
      "#992 leftover sits the feat grant below stored",
    );
  });
});
