import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clampSaveBattleStatsWrite } from "./absoluteStatsClamp.ts";
import { committedDokaAfterAchievementCredit } from "./achievementReward.ts";
import { PORTAL_TRANSITION_XP } from "./applyRewardsResult.ts";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  clearPortalXpKeepRemountOneShotCredit,
  committedDokaAfterOneShotWithPortalXpKeep,
  hasPortalXpKeepRemountOneShotCredit,
  leftoverShopWriteAfterOneShotWithPortalXpKeep,
  notePortalXpKeepRemountOneShotCredit,
  persistDokaCreditThroughPortalXpKeepRemount,
  persistOneShotThroughPortalXpKeepRemount,
  portalXpKeepRemountOneShotCreditKey,
  readPortalXpKeepRemountOneShotCredit,
  sessionXpAfterPortalXpKeepRemountOneShotCredit,
  shouldRefusePortalXpKeepRemountOneShotCreditStaleXp,
  xpForPortalXpKeepRemountOneShotCredit,
  xpFromPortalXpKeepOneShotCreditCharacterRecord,
} from "./portalXpKeepRemountOneShotCreditWriteSkip.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  createProgressPersist,
} from "./progressPersist.ts";
import {
  RENAME_DOKA_COST,
  committedDokaAfterRename,
} from "./renameCharacter.ts";

const PLAY_ENTRY_XP = 100;
const PLAY_ENTRY_DOKA = 200;
const PORTAL_LEFTOVER_XP = PLAY_ENTRY_XP + PORTAL_TRANSITION_XP;
const GROUND_PICKUP = 50;
const SHRINE_PICKUP = 300;
const DUNGEON_COMPLETE_BONUS = 150;
const SHOP_SPEND = 50;
const FEAT_GRANT = 100;
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

describe("portalXpKeepRemountOneShotCreditKey", () => {
  it("reads the same #767 slot key, not leftover-credit, victory, or one-shot Doka keys", () => {
    assert.equal(
      portalXpKeepRemountOneShotCreditKey(1),
      "pbv_portal_xp_keep_remount_slot1",
    );
    assert.equal(
      portalXpKeepRemountOneShotCreditKey(3),
      "pbv_portal_xp_keep_remount_slot3",
    );
    assert.notEqual(
      portalXpKeepRemountOneShotCreditKey(1),
      "pbv_xp_credit_keep_remount_slot1",
    );
    assert.notEqual(
      portalXpKeepRemountOneShotCreditKey(1),
      "pbv_victory_xp_keep_remount_slot1",
    );
    assert.notEqual(
      portalXpKeepRemountOneShotCreditKey(1),
      "pbv_oneshot_doka_keep_remount_slot1",
    );
    assert.notEqual(
      portalXpKeepRemountOneShotCreditKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    assert.notEqual(
      portalXpKeepRemountOneShotCreditKey(1),
      "pbv_feat_doka_keep_remount_slot1",
    );
  });
});

describe("note / read / clear PortalXpKeepRemountOneShotCredit", () => {
  it("round-trips the #767 { preXp } shape", () => {
    const storage = memStorage();
    assert.equal(hasPortalXpKeepRemountOneShotCredit(storage, 1), false);
    notePortalXpKeepRemountOneShotCredit(storage, 1, PLAY_ENTRY_XP);
    assert.deepEqual(readPortalXpKeepRemountOneShotCredit(storage, 1), {
      preXp: PLAY_ENTRY_XP,
    });
    assert.equal(hasPortalXpKeepRemountOneShotCredit(storage, 1), true);
    clearPortalXpKeepRemountOneShotCredit(storage, 1);
    assert.equal(readPortalXpKeepRemountOneShotCredit(storage, 1), null);
  });

  it("isolates character slots", () => {
    const storage = memStorage();
    notePortalXpKeepRemountOneShotCredit(storage, 1, PLAY_ENTRY_XP);
    notePortalXpKeepRemountOneShotCredit(storage, 2, 90);
    assert.deepEqual(readPortalXpKeepRemountOneShotCredit(storage, 1), {
      preXp: PLAY_ENTRY_XP,
    });
    assert.deepEqual(readPortalXpKeepRemountOneShotCredit(storage, 2), {
      preXp: 90,
    });
    clearPortalXpKeepRemountOneShotCredit(storage, 1);
    assert.equal(readPortalXpKeepRemountOneShotCredit(storage, 1), null);
    assert.equal(hasPortalXpKeepRemountOneShotCredit(storage, 2), true);
  });
});

describe("xpFromPortalXpKeepOneShotCreditCharacterRecord", () => {
  it("reads number, bigint, and { ok } leftover", () => {
    assert.equal(
      xpFromPortalXpKeepOneShotCreditCharacterRecord({
        experience: PORTAL_LEFTOVER_XP,
      }),
      110,
    );
    assert.equal(
      xpFromPortalXpKeepOneShotCreditCharacterRecord({
        experience: 110n,
      }),
      110,
    );
    assert.equal(
      xpFromPortalXpKeepOneShotCreditCharacterRecord({
        ok: { experience: PORTAL_LEFTOVER_XP },
      }),
      110,
    );
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(xpFromPortalXpKeepOneShotCreditCharacterRecord(null), null);
    assert.equal(xpFromPortalXpKeepOneShotCreditCharacterRecord({}), null);
    assert.equal(
      xpFromPortalXpKeepOneShotCreditCharacterRecord({ experience: "nope" }),
      null,
    );
  });
});

describe("shouldRefusePortalXpKeepRemountOneShotCreditStaleXp", () => {
  it("fail-closes when live still equals stamped preXp", () => {
    assert.equal(
      shouldRefusePortalXpKeepRemountOneShotCreditStaleXp({
        keep: true,
        liveXp: PLAY_ENTRY_XP,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      true,
    );
  });

  it("fail-closes when keep is set and live XP is missing", () => {
    assert.equal(
      shouldRefusePortalXpKeepRemountOneShotCreditStaleXp({
        keep: true,
        liveXp: null,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      true,
    );
  });

  it("does not refuse a risen portal leftover 110", () => {
    assert.equal(
      shouldRefusePortalXpKeepRemountOneShotCreditStaleXp({
        keep: true,
        liveXp: PORTAL_LEFTOVER_XP,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      false,
    );
  });

  it("does not refuse leftover already below preXp (level-up)", () => {
    assert.equal(
      shouldRefusePortalXpKeepRemountOneShotCreditStaleXp({
        keep: true,
        liveXp: 24,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefusePortalXpKeepRemountOneShotCreditStaleXp({
        keep: false,
        liveXp: PLAY_ENTRY_XP,
        stampedPreXp: PLAY_ENTRY_XP,
      }),
      false,
    );
  });
});

describe("portal XP throw then remount one-shot without unpaid death", () => {
  it("leftover remount ground settle keeps Play-entry XP 100 while canister leftover is 110", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 / XP 100. Canister 200/100.
    // 2. Portal persistIncrementalRewards(0, 10) invokes then throws.
    //    Canister leftover 110. Lock stays 100. GameFlow Play-entry
    //    stays 100. #767 stamps preXp=100.
    // 3. Actor reconnect remounts. Lock XP 100.
    // 4. Ground applyRewards(slot, 50, 0) #ok newDoka=250. Settle
    //    commits Doka 250. Lock XP stays 100.
    const leftoverCommit = committedDokaAfterOneShotWithPortalXpKeep(
      PLAY_ENTRY_DOKA + GROUND_PICKUP,
    );
    assert.equal(leftoverCommit, 250);
    const remount = remountLock();
    assert.equal(remount.snapshot().xp, PLAY_ENTRY_XP);
    assert.equal(PORTAL_TRANSITION_XP, 10);
    assert.equal(PORTAL_LEFTOVER_XP, 110);
  });

  it("leftover shop after that ground pickup writes XP 100 over canister 110", () => {
    const leftoverShop = leftoverShopWriteAfterOneShotWithPortalXpKeep({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: false,
      stampedPreXp: PLAY_ENTRY_XP,
      canisterNewDoka: PLAY_ENTRY_DOKA + GROUND_PICKUP,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(leftoverShop, { xp: 100, doka: 200 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: PLAY_ENTRY_DOKA + GROUND_PICKUP, xp: PORTAL_LEFTOVER_XP },
        leftoverShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 200, xp: 100 },
      "incoming-below-stored wipes portal leftover (Doka spend is legitimate)",
    );
  });

  it("gated remount ground honour leftover 110 so leftover shop cannot wipe it", () => {
    const gatedShop = leftoverShopWriteAfterOneShotWithPortalXpKeep({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: true,
      stampedPreXp: PLAY_ENTRY_XP,
      canisterNewDoka: PLAY_ENTRY_DOKA + GROUND_PICKUP,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(gatedShop, { xp: 110, doka: 200 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: PLAY_ENTRY_DOKA + GROUND_PICKUP, xp: PORTAL_LEFTOVER_XP },
        gatedShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 200, xp: 110 },
    );
  });
});

describe("shrine and dungeon-complete are the same one-shot path", () => {
  it("leftover remount shrine writes XP 100 over canister 110 after +300", () => {
    const leftoverShop = leftoverShopWriteAfterOneShotWithPortalXpKeep({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: false,
      stampedPreXp: PLAY_ENTRY_XP,
      canisterNewDoka: PLAY_ENTRY_DOKA + SHRINE_PICKUP,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(leftoverShop, { xp: 100, doka: 450 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: PLAY_ENTRY_DOKA + SHRINE_PICKUP, xp: PORTAL_LEFTOVER_XP },
        leftoverShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 450, xp: 100 },
    );
  });

  it("gated remount shrine leftover shop keeps leftover 110", () => {
    const gated = leftoverShopWriteAfterOneShotWithPortalXpKeep({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: true,
      stampedPreXp: PLAY_ENTRY_XP,
      canisterNewDoka: PLAY_ENTRY_DOKA + SHRINE_PICKUP,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(gated, { xp: 110, doka: 450 });
  });

  it("leftover remount dungeon-complete writes XP 100 after +150", () => {
    const leftoverShop = leftoverShopWriteAfterOneShotWithPortalXpKeep({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: false,
      stampedPreXp: PLAY_ENTRY_XP,
      canisterNewDoka: PLAY_ENTRY_DOKA + DUNGEON_COMPLETE_BONUS,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(leftoverShop, { xp: 100, doka: 300 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        {
          doka: PLAY_ENTRY_DOKA + DUNGEON_COMPLETE_BONUS,
          xp: PORTAL_LEFTOVER_XP,
        },
        leftoverShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 300, xp: 100 },
    );
  });
});

describe("sessionXpAfterPortalXpKeepRemountOneShotCredit", () => {
  it("ungated remount leftover stays Play-entry 100 so leftover shop writes a lie", () => {
    const session = sessionXpAfterPortalXpKeepRemountOneShotCredit({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: false,
      stampedPreXp: PLAY_ENTRY_XP,
    });
    assert.equal(session, PLAY_ENTRY_XP);
  });

  it("honour replica leftover 110 so leftover shop matches the canister", () => {
    const session = sessionXpAfterPortalXpKeepRemountOneShotCredit({
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
    const shop = leftoverShopWriteAfterOneShotWithPortalXpKeep({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: false,
      stampedPreXp: PLAY_ENTRY_XP,
      canisterNewDoka: PLAY_ENTRY_DOKA + GROUND_PICKUP,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(shop, { xp: 100, doka: 200 });
  });
});

describe("persistOneShotThroughPortalXpKeepRemount", () => {
  it("adopts replica leftover 110 then ground settle commits Doka 250", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountOneShotCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    let applied = false;
    const ok = await persistOneShotThroughPortalXpKeepRemount({
      persist,
      storage,
      slot: 1,
      readCharacter: async () => ({ experience: PORTAL_LEFTOVER_XP }),
      applyAndCommit: async () => {
        applied = true;
        persist.commit({
          doka: committedDokaAfterOneShotWithPortalXpKeep(
            PLAY_ENTRY_DOKA + GROUND_PICKUP,
          ),
        });
        return true;
      },
    });
    assert.equal(ok, true);
    assert.equal(applied, true);
    assert.equal(persist.snapshot().doka, 250);
    assert.equal(persist.snapshot().xp, PORTAL_LEFTOVER_XP);
    assert.equal(
      hasPortalXpKeepRemountOneShotCredit(storage, 1),
      false,
      "clear the stamp after honour so leftover shop cannot reconstruct 100",
    );
  });

  it("adopts replica leftover 110 then shrine settle commits Doka 500", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountOneShotCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    await persistOneShotThroughPortalXpKeepRemount({
      persist,
      storage,
      slot: 1,
      readCharacter: async () => ({ experience: PORTAL_LEFTOVER_XP }),
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterOneShotWithPortalXpKeep(
            PLAY_ENTRY_DOKA + SHRINE_PICKUP,
          ),
        });
        return true;
      },
    });
    assert.equal(persist.snapshot().doka, 500);
    assert.equal(persist.snapshot().xp, PORTAL_LEFTOVER_XP);
  });

  it("honours leftover already below stamped preXp", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountOneShotCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    await persistOneShotThroughPortalXpKeepRemount({
      persist,
      storage,
      slot: 1,
      readCharacter: async () => ({ experience: 24 }),
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterOneShotWithPortalXpKeep(
            PLAY_ENTRY_DOKA + GROUND_PICKUP,
          ),
        });
        return true;
      },
    });
    assert.equal(persist.snapshot().xp, 24);
    assert.equal(persist.snapshot().doka, 250);
  });

  it("throws and does not apply when live XP is still Play-entry", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountOneShotCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistOneShotThroughPortalXpKeepRemount({
          persist,
          storage,
          slot: 1,
          readCharacter: async () => ({ experience: PLAY_ENTRY_XP }),
          applyAndCommit: async () => {
            applied = true;
            persist.commit({
              doka: committedDokaAfterOneShotWithPortalXpKeep(
                PLAY_ENTRY_DOKA + GROUND_PICKUP,
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
      hasPortalXpKeepRemountOneShotCredit(storage, 1),
      true,
      "fail-close keeps the stamp",
    );
  });

  it("throws when getCharacter fails so a stale pickup cannot land", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountOneShotCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistOneShotThroughPortalXpKeepRemount({
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
    const ok = await persistOneShotThroughPortalXpKeepRemount({
      persist,
      storage: memStorage(),
      slot: 1,
      readCharacter: async () => {
        throw new Error("must not fetch without a stamp");
      },
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterOneShotWithPortalXpKeep(
            PLAY_ENTRY_DOKA + GROUND_PICKUP,
          ),
        });
        return true;
      },
    });
    assert.equal(ok, true);
    assert.equal(persist.snapshot().doka, 250);
    assert.equal(persist.snapshot().xp, PLAY_ENTRY_XP);
  });

  it("runs beforeEach so one-shot persist can flush unpaid death (#445)", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountOneShotCredit(storage, 1, PLAY_ENTRY_XP);
    let flushed = 0;
    const persist = createProgressPersist(
      { doka: PLAY_ENTRY_DOKA, xp: PLAY_ENTRY_XP, level: LEVEL },
      {
        beforeEach: async () => {
          flushed += 1;
        },
      },
    );
    await persistOneShotThroughPortalXpKeepRemount({
      persist,
      storage,
      slot: 1,
      readCharacter: async () => ({ experience: PORTAL_LEFTOVER_XP }),
      applyAndCommit: async () => {
        persist.commit({
          doka: committedDokaAfterOneShotWithPortalXpKeep(
            PLAY_ENTRY_DOKA + GROUND_PICKUP,
          ),
        });
        return true;
      },
    });
    assert.equal(flushed, 1);
  });
});

describe("persistDokaCreditThroughPortalXpKeepRemount", () => {
  it("honours leftover 110 then ground #ok settle commits canister newDoka 250", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountOneShotCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    const kind = await persistDokaCreditThroughPortalXpKeepRemount({
      actor: {
        applyRewards: async () => ({
          ok: {
            newDoka: BigInt(PLAY_ENTRY_DOKA + GROUND_PICKUP),
            newXp: BigInt(PORTAL_LEFTOVER_XP),
            newLevel: BigInt(LEVEL),
          },
        }),
      },
      persist,
      storage,
      slot: 1,
      amount: GROUND_PICKUP,
      readCharacter: async () => ({ experience: PORTAL_LEFTOVER_XP }),
      readWallet: async () => PLAY_ENTRY_DOKA + GROUND_PICKUP,
    });
    assert.equal(kind, "commit");
    assert.equal(persist.snapshot().doka, 250);
    assert.equal(persist.snapshot().xp, PORTAL_LEFTOVER_XP);
    assert.equal(hasPortalXpKeepRemountOneShotCredit(storage, 1), false);
  });

  it("honours leftover 110 then shrine #ok settle commits 500", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountOneShotCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    const kind = await persistDokaCreditThroughPortalXpKeepRemount({
      actor: {
        applyRewards: async () => ({
          ok: {
            newDoka: BigInt(PLAY_ENTRY_DOKA + SHRINE_PICKUP),
            newXp: BigInt(PORTAL_LEFTOVER_XP),
            newLevel: BigInt(LEVEL),
          },
        }),
      },
      persist,
      storage,
      slot: 1,
      amount: SHRINE_PICKUP,
      readCharacter: async () => ({ experience: PORTAL_LEFTOVER_XP }),
      readWallet: async () => PLAY_ENTRY_DOKA + SHRINE_PICKUP,
    });
    assert.equal(kind, "commit");
    assert.equal(persist.snapshot().doka, 500);
    assert.equal(persist.snapshot().xp, PORTAL_LEFTOVER_XP);
  });

  it("does not invoke applyRewards when live XP is still Play-entry", async () => {
    const storage = memStorage();
    notePortalXpKeepRemountOneShotCredit(storage, 1, PLAY_ENTRY_XP);
    const persist = remountLock();
    let invoked = 0;
    await assert.rejects(
      () =>
        persistDokaCreditThroughPortalXpKeepRemount({
          actor: {
            applyRewards: async () => {
              invoked += 1;
              return {
                ok: {
                  newDoka: BigInt(PLAY_ENTRY_DOKA + GROUND_PICKUP),
                  newXp: BigInt(PLAY_ENTRY_XP),
                  newLevel: BigInt(LEVEL),
                },
              };
            },
          },
          persist,
          storage,
          slot: 1,
          amount: GROUND_PICKUP,
          readCharacter: async () => ({ experience: PLAY_ENTRY_XP }),
          readWallet: async () => PLAY_ENTRY_DOKA,
        }),
      (err: unknown) =>
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
    );
    assert.equal(invoked, 0);
    assert.equal(persist.snapshot().doka, PLAY_ENTRY_DOKA);
    assert.equal(persist.snapshot().xp, PLAY_ENTRY_XP);
  });
});

describe("distinct from #767 shop, #912 death, #1037 feat, #1045 rename, #1088 victory, #800 one-shot Doka", () => {
  it("uses pbv_portal_xp_keep_remount_slotN, not leftover-credit, victory, or one-shot Doka keys", () => {
    const storage = memStorage();
    notePortalXpKeepRemountOneShotCredit(storage, 2, PLAY_ENTRY_XP);
    assert.equal(
      portalXpKeepRemountOneShotCreditKey(2),
      "pbv_portal_xp_keep_remount_slot2",
    );
    assert.equal(
      storage.getItem("pbv_portal_xp_keep_remount_slot2") != null,
      true,
    );
    assert.equal(storage.getItem("pbv_xp_credit_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_victory_xp_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_oneshot_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_victory_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_feat_doka_keep_remount_slot2"), null);
    assert.equal(storage.getItem("pbv_pending_death_penalty_slot2"), null);
  });

  it("does not treat #767 remount shop spend as this one-shot path", () => {
    const shopHonour = xpForPortalXpKeepRemountOneShotCredit({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: true,
      stampedPreXp: PLAY_ENTRY_XP,
    });
    assert.equal(shopHonour, PORTAL_LEFTOVER_XP, "#767 gated shop leftover XP");
    const leftoverPickup = committedDokaAfterOneShotWithPortalXpKeep(
      PLAY_ENTRY_DOKA + GROUND_PICKUP,
    );
    assert.equal(leftoverPickup, 250);
    assert.notEqual(leftoverPickup, shopHonour);
  });

  it("does not skip leftover shop/heal XP honour — that stays #767", () => {
    const honour = xpForPortalXpKeepRemountOneShotCredit({
      remountXp: PLAY_ENTRY_XP,
      liveXp: PORTAL_LEFTOVER_XP,
      keep: true,
      stampedPreXp: PLAY_ENTRY_XP,
    });
    assert.equal(honour, PORTAL_LEFTOVER_XP);
    assert.equal(
      applySpendToCommitted(PLAY_ENTRY_DOKA, SHOP_SPEND),
      150,
      "shop leftover still spends from remount Doka when no pickup ran; this sidecar only gates one-shot leftover XP",
    );
  });

  it("does not treat #912 remount death-cut of leftover 110 as this one-shot path", () => {
    const deathCutXp = Math.floor(PORTAL_LEFTOVER_XP * 0.8);
    assert.equal(deathCutXp, 88, "#912 taxes replica leftover 110, not 100");
    const leftoverOneShotXp = PLAY_ENTRY_XP;
    assert.notEqual(leftoverOneShotXp, deathCutXp);
  });

  it("does not treat #1037 remount feat add as this one-shot leftover-XP path", () => {
    const leftoverClaim = committedDokaAfterAchievementCredit(
      PLAY_ENTRY_DOKA,
      FEAT_GRANT,
    );
    assert.equal(leftoverClaim, 300);
    const leftoverPickup = committedDokaAfterOneShotWithPortalXpKeep(
      PLAY_ENTRY_DOKA + GROUND_PICKUP,
    );
    assert.equal(leftoverPickup, 250);
    assert.equal(
      leftoverClaim - leftoverPickup,
      50,
      "claim adds 100 onto 200; ground settle writes canister 250",
    );
  });

  it("does not treat #1045 remount rename debit as this one-shot leftover-XP path", () => {
    const leftoverRename = committedDokaAfterRename(PLAY_ENTRY_DOKA);
    assert.equal(leftoverRename, PLAY_ENTRY_DOKA - RENAME_DOKA_COST);
    const leftoverPickup = committedDokaAfterOneShotWithPortalXpKeep(
      PLAY_ENTRY_DOKA + GROUND_PICKUP,
    );
    assert.equal(leftoverPickup, 250);
    assert.notEqual(leftoverRename, leftoverPickup);
  });

  it("does not treat #1088 victory leftover-XP one-shot as this portal stamp", () => {
    assert.equal(
      portalXpKeepRemountOneShotCreditKey(1),
      "pbv_portal_xp_keep_remount_slot1",
    );
    assert.notEqual(
      portalXpKeepRemountOneShotCreditKey(1),
      "pbv_victory_xp_keep_remount_slot1",
      "#1088 honours leftover +80 after a victory throw; this honours leftover +10 after a portal throw",
    );
    assert.notEqual(PORTAL_LEFTOVER_XP, 180);
  });

  it("does not treat #800 / #1029 one-shot Doka keep as this portal XP throw stamp", () => {
    assert.equal(
      portalXpKeepRemountOneShotCreditKey(1),
      "pbv_portal_xp_keep_remount_slot1",
    );
    assert.notEqual(
      portalXpKeepRemountOneShotCreditKey(1),
      "pbv_oneshot_doka_keep_remount_slot1",
      "#800 / #1029 honour replica Doka after a pickup throw; this honours leftover XP after a portal throw",
    );
  });
});
