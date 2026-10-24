import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clampSaveBattleStatsWrite } from "./absoluteStatsClamp.ts";
import { committedDokaAfterAchievementCredit } from "./achievementReward.ts";
import { PORTAL_TRANSITION_XP } from "./applyRewardsResult.ts";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  createProgressPersist,
} from "./progressPersist.ts";
import { committedDokaAfterRename } from "./renameCharacter.ts";
import { committedDokaAfterGameKeyRedeem } from "./shopPurchase.ts";
import {
  clearXpCreditKeepRemountAdditiveCredit,
  hasXpCreditKeepRemountAdditiveCredit,
  leftoverShopWriteAfterGameKeyWithXpCreditKeepRemount,
  leftoverShopWriteAfterXpCreditKeepRemountAdditiveCredit,
  noteXpCreditKeepRemountAdditiveCredit,
  persistAdditiveCreditThroughXpCreditKeepRemount,
  persistClaimThroughXpCreditKeepRemount,
  persistRedeemThroughXpCreditKeepRemount,
  readXpCreditKeepRemountAdditiveCredit,
  sessionXpAfterXpCreditKeepRemountAdditiveCredit,
  shouldRefuseXpCreditKeepRemountAdditiveCreditStaleXp,
  xpCreditKeepRemountAdditiveCreditKey,
  xpForXpCreditKeepRemountAdditiveCredit,
  xpFromXpCreditKeepAdditiveCreditCharacterRecord,
} from "./xpCreditKeepRemountAdditiveCreditWriteSkip.ts";

/** Catalog victory leftover used in #813 chronology (kills/challenges). */
const VICTORY_XP = 80;
const PLAY_ENTRY_XP = 100;
const PLAY_ENTRY_DOKA = 200;
const PORTAL_LEFTOVER_XP = PLAY_ENTRY_XP + PORTAL_TRANSITION_XP;
const VICTORY_LEFTOVER_XP = PLAY_ENTRY_XP + VICTORY_XP;
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

describe("xpCreditKeepRemountAdditiveCreditKey", () => {
  it("reads the same #813 slot key, not portal/victory throw or Doka keep keys", () => {
    assert.equal(
      xpCreditKeepRemountAdditiveCreditKey(1),
      "pbv_xp_credit_keep_remount_slot1",
    );
    assert.equal(
      xpCreditKeepRemountAdditiveCreditKey(3),
      "pbv_xp_credit_keep_remount_slot3",
    );
    assert.notEqual(
      xpCreditKeepRemountAdditiveCreditKey(1),
      "pbv_portal_xp_keep_remount_slot1",
    );
    assert.notEqual(
      xpCreditKeepRemountAdditiveCreditKey(1),
      "pbv_victory_xp_keep_remount_slot1",
    );
    assert.notEqual(
      xpCreditKeepRemountAdditiveCreditKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    assert.notEqual(
      xpCreditKeepRemountAdditiveCreditKey(1),
      "pbv_feat_doka_keep_remount_slot1",
    );
    assert.notEqual(
      xpCreditKeepRemountAdditiveCreditKey(1),
      "pbv_spend_keep_remount_slot1",
    );
  });
});

describe("note / read / clear XpCreditKeepRemountAdditiveCredit", () => {
  it("round-trips the #813 { preXp } shape", () => {
    const storage = memStorage();
    assert.equal(hasXpCreditKeepRemountAdditiveCredit(storage, 1), false);
    noteXpCreditKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    assert.deepEqual(readXpCreditKeepRemountAdditiveCredit(storage, 1), {
      preXp: PLAY_ENTRY_XP,
    });
    assert.equal(hasXpCreditKeepRemountAdditiveCredit(storage, 1), true);
    clearXpCreditKeepRemountAdditiveCredit(storage, 1);
    assert.equal(readXpCreditKeepRemountAdditiveCredit(storage, 1), null);
  });

  it("isolates character slots", () => {
    const storage = memStorage();
    noteXpCreditKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    noteXpCreditKeepRemountAdditiveCredit(storage, 2, 90);
    assert.deepEqual(readXpCreditKeepRemountAdditiveCredit(storage, 1), {
      preXp: PLAY_ENTRY_XP,
    });
    assert.deepEqual(readXpCreditKeepRemountAdditiveCredit(storage, 2), {
      preXp: 90,
    });
    clearXpCreditKeepRemountAdditiveCredit(storage, 1);
    assert.equal(readXpCreditKeepRemountAdditiveCredit(storage, 1), null);
    assert.equal(hasXpCreditKeepRemountAdditiveCredit(storage, 2), true);
  });
});

describe("xpFromXpCreditKeepAdditiveCreditCharacterRecord", () => {
  it("reads number, bigint, and { ok } leftover", () => {
    assert.equal(
      xpFromXpCreditKeepAdditiveCreditCharacterRecord({
        experience: PORTAL_LEFTOVER_XP,
      }),
      110,
    );
    assert.equal(
      xpFromXpCreditKeepAdditiveCreditCharacterRecord({
        experience: 110n,
      }),
      110,
    );
    assert.equal(
      xpFromXpCreditKeepAdditiveCreditCharacterRecord({
        ok: { experience: PORTAL_LEFTOVER_XP },
      }),
      110,
    );
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(xpFromXpCreditKeepAdditiveCreditCharacterRecord(null), null);
    assert.equal(xpFromXpCreditKeepAdditiveCreditCharacterRecord({}), null);
    assert.equal(
      xpFromXpCreditKeepAdditiveCreditCharacterRecord({ experience: "nope" }),
      null,
    );
  });
});

describe("shouldRefuseXpCreditKeepRemountAdditiveCreditStaleXp", () => {
  it("fail-closes when live still equals stamped preXp", () => {
    assert.equal(
      shouldRefuseXpCreditKeepRemountAdditiveCreditStaleXp({
        keep: true,
        liveXp: PLAY_ENTRY_XP,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      true,
    );
  });

  it("fail-closes when keep is set and live XP is missing", () => {
    assert.equal(
      shouldRefuseXpCreditKeepRemountAdditiveCreditStaleXp({
        keep: true,
        liveXp: null,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      true,
    );
  });

  it("does not refuse a risen portal leftover 110", () => {
    assert.equal(
      shouldRefuseXpCreditKeepRemountAdditiveCreditStaleXp({
        keep: true,
        liveXp: PORTAL_LEFTOVER_XP,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      false,
    );
  });

  it("does not refuse victory leftover 180", () => {
    assert.equal(
      shouldRefuseXpCreditKeepRemountAdditiveCreditStaleXp({
        keep: true,
        liveXp: VICTORY_LEFTOVER_XP,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      false,
    );
  });

  it("does not refuse victory leftover already below preXp (level-up)", () => {
    assert.equal(
      shouldRefuseXpCreditKeepRemountAdditiveCreditStaleXp({
        keep: true,
        liveXp: 24,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseXpCreditKeepRemountAdditiveCreditStaleXp({
        keep: false,
        liveXp: PLAY_ENTRY_XP,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      false,
    );
  });
});

describe("successful leftover XP then remount feat without unpaid death", () => {
  it("leftover remount claim keeps Play-entry XP 100 while canister leftover is 110", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 / XP 100. Canister 200/100.
    // 2. Portal persistIncrementalRewards(0, 10) commits leftover 110.
    //    GameFlow Play-entry stays 100. #813 stamps preXp=100.
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
      leftoverShopWriteAfterXpCreditKeepRemountAdditiveCredit({
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
    const gatedShop = leftoverShopWriteAfterXpCreditKeepRemountAdditiveCredit({
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

  it("gated remount claim honours victory leftover 180", () => {
    const gatedShop = leftoverShopWriteAfterXpCreditKeepRemountAdditiveCredit({
      remountXp: PLAY_ENTRY_XP,
      liveXp: VICTORY_LEFTOVER_XP,
      keep: true,
      stampedPreXp: PLAY_ENTRY_XP,
      remountDoka: PLAY_ENTRY_DOKA,
      granted: FEAT_GRANT,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(gatedShop, { xp: 180, doka: 250 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: 300, xp: VICTORY_LEFTOVER_XP },
        gatedShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 250, xp: 180 },
    );
  });
});

describe("GameKey leftover when remount lock is Play-entry XP 100", () => {
  it("leftover remount redeem writes XP 100 over canister 110 after GameKey", () => {
    const leftover = leftoverShopWriteAfterGameKeyWithXpCreditKeepRemount({
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
    const gated = leftoverShopWriteAfterGameKeyWithXpCreditKeepRemount({
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

describe("sessionXpAfterXpCreditKeepRemountAdditiveCredit", () => {
  it("ungated remount leftover stays Play-entry 100 so leftover shop writes a lie", () => {
    const session = sessionXpAfterXpCreditKeepRemountAdditiveCredit({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: false,
      stampedPreXp: PLAY_ENTRY_XP,
    });
    assert.equal(session, PLAY_ENTRY_XP);
  });

  it("honour replica leftover 110 so leftover shop matches the canister", () => {
    const session = sessionXpAfterXpCreditKeepRemountAdditiveCredit({
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
    const shop = leftoverShopWriteAfterXpCreditKeepRemountAdditiveCredit({
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

describe("persistAdditiveCreditThroughXpCreditKeepRemount", () => {
  it("adopts replica leftover 110 then feat #ok commits Doka 300", async () => {
    const storage = memStorage();
    noteXpCreditKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    let applied = false;
    const ok = await persistAdditiveCreditThroughXpCreditKeepRemount({
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
      hasXpCreditKeepRemountAdditiveCredit(storage, 1),
      false,
      "clear the stamp after honour so leftover shop cannot reconstruct 100",
    );
  });

  it("adopts replica leftover 110 then GameKey #ok commits Doka 1200", async () => {
    const storage = memStorage();
    noteXpCreditKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    await persistAdditiveCreditThroughXpCreditKeepRemount({
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

  it("honours victory leftover already below stamped preXp", async () => {
    const storage = memStorage();
    noteXpCreditKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    await persistAdditiveCreditThroughXpCreditKeepRemount({
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
    noteXpCreditKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistAdditiveCreditThroughXpCreditKeepRemount({
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
      hasXpCreditKeepRemountAdditiveCredit(storage, 1),
      true,
      "fail-close keeps the stamp",
    );
  });

  it("throws when getCharacter fails so a stale claim cannot land", async () => {
    const storage = memStorage();
    noteXpCreditKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistAdditiveCreditThroughXpCreditKeepRemount({
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
    const ok = await persistAdditiveCreditThroughXpCreditKeepRemount({
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
    noteXpCreditKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    let flushed = 0;
    const persist = createProgressPersist(
      { doka: PLAY_ENTRY_DOKA, xp: PLAY_ENTRY_XP, level: LEVEL },
      {
        beforeEach: async () => {
          flushed += 1;
        },
      },
    );
    await persistAdditiveCreditThroughXpCreditKeepRemount({
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

describe("persistClaimThroughXpCreditKeepRemount", () => {
  it("production leftover claim on remount lock commits Doka 300 / XP 100", async () => {
    const persist = remountLock();
    const leftover = await persistClaimThroughXpCreditKeepRemount(
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
    noteXpCreditKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    let claimed = 0;
    const parsed = await persistClaimThroughXpCreditKeepRemount(
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
    assert.equal(hasXpCreditKeepRemountAdditiveCredit(storage, 1), false);
  });

  it("already claimed still honours leftover XP onto the lock", async () => {
    const storage = memStorage();
    noteXpCreditKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    const parsed = await persistClaimThroughXpCreditKeepRemount(
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

describe("persistRedeemThroughXpCreditKeepRemount", () => {
  it("gated remount redeem honours leftover 110 then commits Doka 1200", async () => {
    const storage = memStorage();
    noteXpCreditKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    const { result } = await persistRedeemThroughXpCreditKeepRemount(
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
    noteXpCreditKeepRemountAdditiveCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    const { result } = await persistRedeemThroughXpCreditKeepRemount(
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

describe("distinct from #813 shop honour, #919 death, #767 throw, #1028 Doka claim", () => {
  it("uses pbv_xp_credit_keep_remount_slotN, not portal/victory throw or Doka keys", () => {
    const storage = memStorage();
    noteXpCreditKeepRemountAdditiveCredit(storage, 2, PLAY_ENTRY_XP);
    assert.equal(
      xpCreditKeepRemountAdditiveCreditKey(2),
      "pbv_xp_credit_keep_remount_slot2",
    );
    assert.equal(
      storage.getItem("pbv_xp_credit_keep_remount_slot2") != null,
      true,
    );
    assert.equal(storage.getItem("pbv_portal_xp_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_victory_xp_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_victory_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_feat_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_spend_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot2"), null);
  });

  it("does not treat #813 remount shop spend as this claim path", () => {
    const shopHonour = xpForXpCreditKeepRemountAdditiveCredit({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: true,
      stampedPreXp: PLAY_ENTRY_XP,
    });
    assert.equal(shopHonour, PORTAL_LEFTOVER_XP, "#813 gated shop leftover XP");
    const leftoverClaim = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
      FEAT_GRANT,
    );
    assert.equal(leftoverClaim, 300);
    assert.notEqual(leftoverClaim, shopHonour);
  });

  it("does not skip leftover shop/heal XP honour — that stays #813", () => {
    const honour = xpForXpCreditKeepRemountAdditiveCredit({
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

  it("does not treat #919 remount death-cut of leftover 110 as this claim path", () => {
    const deathCutXp = Math.floor(PORTAL_LEFTOVER_XP * 0.8);
    assert.equal(deathCutXp, 88, "#919 taxes replica leftover 110, not 100");
    const leftoverClaimXp = PLAY_ENTRY_XP;
    assert.notEqual(leftoverClaimXp, deathCutXp);
  });

  it("does not treat #1028 victory Doka remount claim (rise 50) as this leftover XP", () => {
    const victoryDokaLeftoverClaim = 300;
    const victoryDokaCanisterAfterClaim = 350;
    assert.equal(
      victoryDokaCanisterAfterClaim - victoryDokaLeftoverClaim,
      50,
      "#1028 leftover sits the victory Doka grant below stored",
    );
    const leftoverClaim = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
      FEAT_GRANT,
    );
    assert.equal(leftoverClaim, 300);
    assert.equal(
      leftoverClaim,
      PLAY_ENTRY_DOKA + FEAT_GRANT,
      "portal leftover XP does not change Doka; this leftover sits leftover XP below stored",
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
