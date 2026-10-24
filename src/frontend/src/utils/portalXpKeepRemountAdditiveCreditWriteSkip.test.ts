import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clampSaveBattleStatsWrite } from "./absoluteStatsClamp.ts";
import { committedDokaAfterAchievementCredit } from "./achievementReward.ts";
import { PORTAL_TRANSITION_XP } from "./applyRewardsResult.ts";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  clearPortalXpKeepRemountAdditiveCredit,
  hasPortalXpKeepRemountAdditiveCredit,
  leftoverShopWriteAfterGameKeyWithPortalXpKeepRemount,
  leftoverShopWriteAfterPortalXpKeepRemountAdditiveCredit,
  notePortalXpKeepRemountAdditiveCredit,
  persistAdditiveCreditThroughPortalXpKeepRemount,
  persistClaimThroughPortalXpKeepRemount,
  persistRedeemThroughPortalXpKeepRemount,
  portalXpKeepRemountAdditiveCreditKey,
  readPortalXpKeepRemountAdditiveCredit,
  sessionXpAfterPortalXpKeepRemountAdditiveCredit,
  shouldRefusePortalXpKeepRemountAdditiveCreditStaleXp,
  xpForPortalXpKeepRemountAdditiveCredit,
  xpFromPortalXpKeepAdditiveCreditCharacterRecord,
} from "./portalXpKeepRemountAdditiveCreditWriteSkip.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  createProgressPersist,
} from "./progressPersist.ts";
import { committedDokaAfterRename } from "./renameCharacter.ts";
import { committedDokaAfterGameKeyRedeem } from "./shopPurchase.ts";

const PLAY_ENTRY_XP = 100;
const PLAY_ENTRY_DOKA = 200;
const PORTAL_LEFTOVER_XP = PLAY_ENTRY_XP + PORTAL_TRANSITION_XP;
const SHOP_SPEND = 50;
const FEAT_GRANT = 100;
const GAMEKEY_GRANT = 1000;
const LEVEL = 4;
const GAME_KEY = "A".repeat(120);

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

describe("portalXpKeepRemountAdditiveCreditKey", () => {
  it("reads the same #767 slot key, not leftover-credit or victory-throw keys", () => {
    assert.equal(
      portalXpKeepRemountAdditiveCreditKey(1),
      "pbv_portal_xp_keep_remount_slot1",
    );
    assert.equal(
      portalXpKeepRemountAdditiveCreditKey(3),
      "pbv_portal_xp_keep_remount_slot3",
    );
    assert.notEqual(
      portalXpKeepRemountAdditiveCreditKey(1),
      "pbv_xp_credit_keep_remount_slot1",
    );
    assert.notEqual(
      portalXpKeepRemountAdditiveCreditKey(1),
      "pbv_victory_xp_keep_remount_slot1",
    );
    assert.notEqual(
      portalXpKeepRemountAdditiveCreditKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    assert.notEqual(
      portalXpKeepRemountAdditiveCreditKey(1),
      "pbv_feat_doka_keep_remount_slot1",
    );
    assert.notEqual(
      portalXpKeepRemountAdditiveCreditKey(1),
      "pbv_spend_keep_remount_slot1",
    );
  });
});

describe("note / read / clear PortalXpKeepRemountAdditiveCredit", () => {
  it("round-trips the #767 { preXp } shape", () => {
    const storage = memStorage();
    assert.equal(hasPortalXpKeepRemountAdditiveCredit(storage, 1), false);
    notePortalXpKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    assert.deepEqual(readPortalXpKeepRemountAdditiveCredit(storage, 1), {
      preXp: PLAY_ENTRY_XP,
    });
    assert.equal(hasPortalXpKeepRemountAdditiveCredit(storage, 1), true);
    clearPortalXpKeepRemountAdditiveCredit(storage, 1);
    assert.equal(readPortalXpKeepRemountAdditiveCredit(storage, 1), null);
  });

  it("isolates character slots", () => {
    const storage = memStorage();
    notePortalXpKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    notePortalXpKeepRemountAdditiveCredit(storage, 2, 90);
    assert.deepEqual(readPortalXpKeepRemountAdditiveCredit(storage, 1), {
      preXp: PLAY_ENTRY_XP,
    });
    assert.deepEqual(readPortalXpKeepRemountAdditiveCredit(storage, 2), {
      preXp: 90,
    });
    clearPortalXpKeepRemountAdditiveCredit(storage, 1);
    assert.equal(readPortalXpKeepRemountAdditiveCredit(storage, 1), null);
    assert.equal(hasPortalXpKeepRemountAdditiveCredit(storage, 2), true);
  });
});

describe("xpFromPortalXpKeepAdditiveCreditCharacterRecord", () => {
  it("reads number, bigint, and { ok } leftover", () => {
    assert.equal(
      xpFromPortalXpKeepAdditiveCreditCharacterRecord({
        experience: PORTAL_LEFTOVER_XP,
      }),
      110,
    );
    assert.equal(
      xpFromPortalXpKeepAdditiveCreditCharacterRecord({
        experience: 110n,
      }),
      110,
    );
    assert.equal(
      xpFromPortalXpKeepAdditiveCreditCharacterRecord({
        ok: { experience: PORTAL_LEFTOVER_XP },
      }),
      110,
    );
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(xpFromPortalXpKeepAdditiveCreditCharacterRecord(null), null);
    assert.equal(xpFromPortalXpKeepAdditiveCreditCharacterRecord({}), null);
    assert.equal(
      xpFromPortalXpKeepAdditiveCreditCharacterRecord({ experience: "nope" }),
      null,
    );
  });
});

describe("shouldRefusePortalXpKeepRemountAdditiveCreditStaleXp", () => {
  it("fail-closes when live still equals stamped preXp", () => {
    assert.equal(
      shouldRefusePortalXpKeepRemountAdditiveCreditStaleXp({
        keep: true,
        liveXp: PLAY_ENTRY_XP,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      true,
    );
  });

  it("fail-closes when keep is set and live XP is missing", () => {
    assert.equal(
      shouldRefusePortalXpKeepRemountAdditiveCreditStaleXp({
        keep: true,
        liveXp: null,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      true,
    );
  });

  it("does not refuse a risen portal leftover 110", () => {
    assert.equal(
      shouldRefusePortalXpKeepRemountAdditiveCreditStaleXp({
        keep: true,
        liveXp: PORTAL_LEFTOVER_XP,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      false,
    );
  });

  it("does not refuse leftover already below preXp (level-up)", () => {
    assert.equal(
      shouldRefusePortalXpKeepRemountAdditiveCreditStaleXp({
        keep: true,
        liveXp: 24,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefusePortalXpKeepRemountAdditiveCreditStaleXp({
        keep: false,
        liveXp: PLAY_ENTRY_XP,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      false,
    );
  });
});

describe("portal throw-after-add then remount feat without unpaid death", () => {
  it("leftover remount claim keeps Play-entry XP 100 while canister leftover is 110", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 / XP 100. Canister 200/100.
    // 2. Portal persistIncrementalRewards(0, 10) invokes then throws.
    //    Canister leftover 110. Commit never runs. GameFlow Play-entry
    //    stays 100. #767 stamps preXp=100.
    // 3. Actor reconnect remounts. Lock XP 100.
    // 4. Claim committedDokaAfterAchievementCredit(200, 100) → 300.
    //    Canister Doka 300 (portal did not change Doka). Lock XP stays 100.
    const leftoverCommit = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
      FEAT_GRANT,
    );
    assert.equal(leftoverCommit, 300);
    const remount = remountLock();
    assert.equal(remount.snapshot().xp, PLAY_ENTRY_XP);
    assert.equal(
      remount.snapshot().xp,
      PLAY_ENTRY_XP,
      "feat commit does not touch leftover XP",
    );
  });

  it("leftover shop after that claim writes XP 100 over canister 110", () => {
    const leftoverShop =
      leftoverShopWriteAfterPortalXpKeepRemountAdditiveCredit({
        remountXp: PLAY_ENTRY_XP,
        liveXp: PORTAL_LEFTOVER_XP,
        keep: false,
        stampedPreXp: PLAY_ENTRY_XP,
        remountDoka: PLAY_ENTRY_DOKA,
        granted: FEAT_GRANT,
        shopSpend: SHOP_SPEND,
      });
    assert.deepEqual(leftoverShop, { xp: 100, doka: 250 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: 300, xp: PORTAL_LEFTOVER_XP },
        leftoverShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 250, xp: 100 },
      "incoming-below-stored wipes portal +10 (Doka spend is legitimate)",
    );
  });

  it("gated remount claim honours leftover 110 so leftover shop cannot wipe it", () => {
    const gatedShop = leftoverShopWriteAfterPortalXpKeepRemountAdditiveCredit({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: true,
      stampedPreXp: PLAY_ENTRY_XP,
      remountDoka: PLAY_ENTRY_DOKA,
      granted: FEAT_GRANT,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(gatedShop, { xp: 110, doka: 250 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: 300, xp: PORTAL_LEFTOVER_XP },
        gatedShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 250, xp: 110 },
    );
  });
});

describe("GameKey leftover when remount lock is Play-entry XP 100", () => {
  it("leftover remount redeem writes XP 100 over canister 110 after GameKey", () => {
    const leftover = leftoverShopWriteAfterGameKeyWithPortalXpKeepRemount({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: false,
      stampedPreXp: PLAY_ENTRY_XP,
      remountDoka: PLAY_ENTRY_DOKA,
      granted: GAMEKEY_GRANT,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(leftover, { xp: 100, doka: 1150 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: PLAY_ENTRY_DOKA + GAMEKEY_GRANT, xp: PORTAL_LEFTOVER_XP },
        leftover ?? { xp: 0, doka: 0 },
      ),
      { doka: 1150, xp: 100 },
      "incoming-below-stored wipes portal +10 after GameKey",
    );
  });

  it("gated remount redeem writes leftover 110 after GameKey shop spend", () => {
    const gated = leftoverShopWriteAfterGameKeyWithPortalXpKeepRemount({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: true,
      stampedPreXp: PLAY_ENTRY_XP,
      remountDoka: PLAY_ENTRY_DOKA,
      granted: GAMEKEY_GRANT,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(gated, { xp: 110, doka: 1150 });
  });
});

describe("sessionXpAfterPortalXpKeepRemountAdditiveCredit", () => {
  it("ungated remount leftover stays Play-entry 100 so leftover shop writes a lie", () => {
    const session = sessionXpAfterPortalXpKeepRemountAdditiveCredit({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: false,
      stampedPreXp: PLAY_ENTRY_XP,
    });
    assert.equal(session, PLAY_ENTRY_XP);
  });

  it("honour replica leftover 110 so leftover shop matches the canister", () => {
    const session = sessionXpAfterPortalXpKeepRemountAdditiveCredit({
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
    const shop = leftoverShopWriteAfterPortalXpKeepRemountAdditiveCredit({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: false,
      stampedPreXp: PLAY_ENTRY_XP,
      remountDoka: PLAY_ENTRY_DOKA,
      granted: FEAT_GRANT,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(shop, { xp: 100, doka: 250 });
  });
});

describe("persistAdditiveCreditThroughPortalXpKeepRemount", () => {
  it("adopts replica leftover 110 then feat #ok commits Doka 300", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    let applied = false;
    const ok = await persistAdditiveCreditThroughPortalXpKeepRemount({
      persist,
      storage,
      slot: 1,
      readCharacter: async () => ({ experience: PORTAL_LEFTOVER_XP }),
      applyAndCommit: async () => {
        applied = true;
        persist.commit({
          doka: committedDokaAfterAchievementCredit(
            persist.snapshot().doka,
            FEAT_GRANT,
          ),
        });
        return true;
      },
    });
    assert.equal(ok, true);
    assert.equal(applied, true);
    assert.equal(persist.snapshot().doka, 300);
    assert.equal(persist.snapshot().xp, PORTAL_LEFTOVER_XP);
    assert.equal(
      hasPortalXpKeepRemountAdditiveCredit(storage, 1),
      false,
      "clear the stamp after honour so leftover shop cannot reconstruct 100",
    );
  });

  it("adopts replica leftover 110 then GameKey #ok commits Doka 1200", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    await persistAdditiveCreditThroughPortalXpKeepRemount({
      persist,
      storage,
      slot: 1,
      readCharacter: async () => ({ experience: PORTAL_LEFTOVER_XP }),
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterGameKeyRedeem(
            persist.snapshot().doka,
            GAMEKEY_GRANT,
          ),
        });
        return true;
      },
    });
    assert.equal(persist.snapshot().doka, 1200);
    assert.equal(persist.snapshot().xp, PORTAL_LEFTOVER_XP);
  });

  it("honours leftover already below stamped preXp", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    await persistAdditiveCreditThroughPortalXpKeepRemount({
      persist,
      storage,
      slot: 1,
      readCharacter: async () => ({ experience: 24 }),
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterAchievementCredit(
            persist.snapshot().doka,
            FEAT_GRANT,
          ),
        });
        return true;
      },
    });
    assert.equal(persist.snapshot().xp, 24);
    assert.equal(persist.snapshot().doka, 300);
  });

  it("throws and does not apply when live XP is still Play-entry", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistAdditiveCreditThroughPortalXpKeepRemount({
          persist,
          storage,
          slot: 1,
          readCharacter: async () => ({ experience: PLAY_ENTRY_XP }),
          applyAndCommit: async () => {
            applied = true;
            persist.commit({
              doka: committedDokaAfterAchievementCredit(
                persist.snapshot().doka,
                FEAT_GRANT,
              ),
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
      hasPortalXpKeepRemountAdditiveCredit(storage, 1),
      true,
      "fail-close keeps the stamp",
    );
  });

  it("throws when getCharacter fails so a stale claim cannot land", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistAdditiveCreditThroughPortalXpKeepRemount({
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
    const ok = await persistAdditiveCreditThroughPortalXpKeepRemount({
      persist,
      storage: memStorage(),
      slot: 1,
      readCharacter: async () => {
        throw new Error("must not fetch without a stamp");
      },
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterAchievementCredit(
            persist.snapshot().doka,
            FEAT_GRANT,
          ),
        });
        return true;
      },
    });
    assert.equal(ok, true);
    assert.equal(persist.snapshot().doka, 300);
    assert.equal(persist.snapshot().xp, PLAY_ENTRY_XP);
  });

  it("runs beforeEach so claim persist can flush unpaid death (#445)", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    let flushed = 0;
    const persist = createProgressPersist(
      { doka: PLAY_ENTRY_DOKA, xp: PLAY_ENTRY_XP, level: LEVEL },
      {
        beforeEach: async () => {
          flushed += 1;
        },
      },
    );
    await persistAdditiveCreditThroughPortalXpKeepRemount({
      persist,
      storage,
      slot: 1,
      readCharacter: async () => ({ experience: PORTAL_LEFTOVER_XP }),
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterAchievementCredit(
            persist.snapshot().doka,
            FEAT_GRANT,
          ),
        });
        return true;
      },
    });
    assert.equal(flushed, 1);
  });
});

describe("persistClaimThroughPortalXpKeepRemount", () => {
  it("production leftover claim on remount lock commits Doka 300 / XP 100", async () => {
    const persist = remountLock();
    const leftover = await persistClaimThroughPortalXpKeepRemount(
      {
        claimAchievementReward: async () => ({ ok: FEAT_GRANT }),
      },
      persist,
      "doka_1000",
      {
        storage: memStorage(),
        slot: 1,
        readCharacter: async () => {
          throw new Error("must not fetch without a stamp");
        },
      },
    );
    assert.deepEqual(leftover, { ok: FEAT_GRANT });
    assert.equal(persist.snapshot().doka, 300);
    assert.equal(persist.snapshot().xp, PLAY_ENTRY_XP);
  });

  it("gated remount claim honours leftover 110 then commits Doka 300", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    let claimed = 0;
    const parsed = await persistClaimThroughPortalXpKeepRemount(
      {
        claimAchievementReward: async () => {
          claimed += 1;
          return { ok: FEAT_GRANT };
        },
      },
      persist,
      "doka_1000",
      {
        storage,
        slot: 1,
        readCharacter: async () => ({ experience: PORTAL_LEFTOVER_XP }),
      },
    );
    assert.deepEqual(parsed, { ok: FEAT_GRANT });
    assert.equal(claimed, 1);
    assert.equal(persist.snapshot().doka, 300);
    assert.equal(persist.snapshot().xp, PORTAL_LEFTOVER_XP);
    assert.equal(hasPortalXpKeepRemountAdditiveCredit(storage, 1), false);
  });

  it("already claimed still honours leftover XP onto the lock", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    const parsed = await persistClaimThroughPortalXpKeepRemount(
      {
        claimAchievementReward: async () => ({
          err: "Reward already claimed",
        }),
      },
      persist,
      "doka_1000",
      {
        storage,
        slot: 1,
        readCharacter: async () => ({ experience: PORTAL_LEFTOVER_XP }),
      },
    );
    assert.equal("err" in parsed, true);
    assert.equal(
      persist.snapshot().xp,
      PORTAL_LEFTOVER_XP,
      "honour still lands so a later leftover shop cannot reconstruct 100",
    );
    assert.equal(persist.snapshot().doka, PLAY_ENTRY_DOKA);
  });
});

describe("persistRedeemThroughPortalXpKeepRemount", () => {
  it("gated remount redeem honours leftover 110 then commits Doka 1200", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    const { result } = await persistRedeemThroughPortalXpKeepRemount(
      {
        redeemGameKey: async () => ({ ok: GAMEKEY_GRANT }),
      },
      persist,
      GAME_KEY,
      {
        storage,
        slot: 1,
        readCharacter: async () => ({ experience: PORTAL_LEFTOVER_XP }),
      },
    );
    assert.deepEqual(result, { ok: GAMEKEY_GRANT });
    assert.equal(persist.snapshot().doka, 1200);
    assert.equal(persist.snapshot().xp, PORTAL_LEFTOVER_XP);
  });

  it("explicit redeemGameKey failed still honours leftover without granting", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    const { result } = await persistRedeemThroughPortalXpKeepRemount(
      {
        redeemGameKey: async () => ({ err: "Invalid GameKey" }),
      },
      persist,
      GAME_KEY,
      {
        storage,
        slot: 1,
        readCharacter: async () => ({ experience: PORTAL_LEFTOVER_XP }),
      },
    );
    assert.deepEqual(result, { err: "Invalid GameKey" });
    assert.equal(persist.snapshot().xp, PORTAL_LEFTOVER_XP);
    assert.equal(persist.snapshot().doka, PLAY_ENTRY_DOKA);
  });
});

describe("distinct from #767 shop honour, #912 death, #1036 leftover-credit, #807 throw", () => {
  it("uses pbv_portal_xp_keep_remount_slotN, not leftover-credit or victory-throw keys", () => {
    const storage = memStorage();
    notePortalXpKeepRemountAdditiveCredit(storage, 2, PLAY_ENTRY_XP);
    assert.equal(
      portalXpKeepRemountAdditiveCreditKey(2),
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

  it("does not treat #767 remount shop spend as this claim path", () => {
    const shopHonour = xpForPortalXpKeepRemountAdditiveCredit({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: true,
      stampedPreXp: PLAY_ENTRY_XP,
    });
    assert.equal(shopHonour, PORTAL_LEFTOVER_XP, "#767 gated shop leftover XP");
    const leftoverClaim = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
      FEAT_GRANT,
    );
    assert.equal(leftoverClaim, 300);
    assert.notEqual(leftoverClaim, shopHonour);
  });

  it("does not skip leftover shop/heal XP honour — that stays #767", () => {
    const honour = xpForPortalXpKeepRemountAdditiveCredit({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: true,
      stampedPreXp: PLAY_ENTRY_XP,
    });
    assert.equal(honour, PORTAL_LEFTOVER_XP);
    assert.equal(
      applySpendToCommitted(PLAY_ENTRY_DOKA, SHOP_SPEND),
      150,
      "shop leftover still spends from remount Doka; this sidecar only gates claim/redeem leftover XP",
    );
  });

  it("does not treat #912 remount death-cut of leftover 110 as this claim path", () => {
    const deathCutXp = Math.floor(PORTAL_LEFTOVER_XP * 0.8);
    assert.equal(deathCutXp, 88, "#912 taxes replica leftover 110, not 100");
    const leftoverClaimXp = PLAY_ENTRY_XP;
    assert.notEqual(leftoverClaimXp, deathCutXp);
  });

  it("does not treat #1036 leftover-credit remount claim as this throw stamp", () => {
    assert.notEqual(
      portalXpKeepRemountAdditiveCreditKey(1),
      "pbv_xp_credit_keep_remount_slot1",
    );
    const leftoverClaim = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
      FEAT_GRANT,
    );
    assert.equal(leftoverClaim, 300);
    assert.equal(
      leftoverClaim,
      PLAY_ENTRY_DOKA + FEAT_GRANT,
      "portal leftover XP does not change Doka; this leftover sits leftover XP below stored after a throw, not a parsed leftover commit",
    );
  });

  it("does not treat leftover rename debit as this additive leftover-XP path", () => {
    const leftoverRename = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.equal(leftoverRename, 100);
    const leftoverClaim = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
      FEAT_GRANT,
    );
    assert.equal(leftoverClaim, 300);
    assert.equal(
      leftoverClaim - leftoverRename,
      200,
      "claim adds 100 onto 200; rename subtracts 100 from 200",
    );
  });
});
