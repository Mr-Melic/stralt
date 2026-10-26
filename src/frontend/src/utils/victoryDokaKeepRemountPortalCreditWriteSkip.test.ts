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
import {
  RENAME_DOKA_COST,
  committedDokaAfterRename,
} from "./renameCharacter.ts";
import { committedDokaAfterGameKeyRedeem } from "./shopPurchase.ts";
import {
  clearVictoryDokaKeepRemountPortalCredit,
  committedProgressAfterPortalWithVictoryDokaKeep,
  dokaForVictoryDokaKeepRemountPortalCredit,
  dokaFromVictoryDokaKeepPortalCreditWalletRecord,
  hasVictoryDokaKeepRemountPortalCredit,
  leftoverShopWriteAfterPortalWithVictoryDokaKeep,
  noteVictoryDokaKeepRemountPortalCredit,
  persistIncrementalRewardsThroughVictoryDokaKeepRemount,
  persistPortalThroughVictoryDokaKeepRemount,
  readVictoryDokaKeepRemountPortalCredit,
  sessionDokaAfterVictoryDokaKeepRemountPortalCredit,
  shouldRefuseVictoryDokaKeepRemountPortalCreditStaleDoka,
  victoryDokaKeepRemountPortalCreditKey,
} from "./victoryDokaKeepRemountPortalCreditWriteSkip.ts";

const PLAY_ENTRY_XP = 100;
const PLAY_ENTRY_DOKA = 200;
const VICTORY_DOKA_DELTA = 50;
const VICTORY_DOKA = PLAY_ENTRY_DOKA + VICTORY_DOKA_DELTA;
const VICTORY_XP_DELTA = 80;
const VICTORY_LEFTOVER_XP = PLAY_ENTRY_XP + VICTORY_XP_DELTA;
const PORTAL_XP = VICTORY_LEFTOVER_XP + PORTAL_TRANSITION_XP;
const SHOP_SPEND = 50;
const FEAT_GRANT = 100;
const GAMEKEY_GRANT = 1000;
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

/** Production remount lock: GameFlow Play-entry wallet / leftover. */
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

describe("victoryDokaKeepRemountPortalCreditKey", () => {
  it("reads the same #774 slot key, not XP-throw or one-shot Doka keys", () => {
    assert.equal(
      victoryDokaKeepRemountPortalCreditKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    assert.equal(
      victoryDokaKeepRemountPortalCreditKey(3),
      "pbv_victory_doka_keep_remount_slot3",
    );
    assert.notEqual(
      victoryDokaKeepRemountPortalCreditKey(1),
      "pbv_victory_xp_keep_remount_slot1",
    );
    assert.notEqual(
      victoryDokaKeepRemountPortalCreditKey(1),
      "pbv_portal_xp_keep_remount_slot1",
    );
    assert.notEqual(
      victoryDokaKeepRemountPortalCreditKey(1),
      "pbv_xp_credit_keep_remount_slot1",
    );
    assert.notEqual(
      victoryDokaKeepRemountPortalCreditKey(1),
      "pbv_oneshot_doka_keep_remount_slot1",
    );
    assert.notEqual(
      victoryDokaKeepRemountPortalCreditKey(1),
      "pbv_boss_rush_doka_keep_remount_slot1",
    );
    assert.notEqual(
      victoryDokaKeepRemountPortalCreditKey(1),
      "pbv_feat_doka_keep_remount_slot1",
    );
    assert.notEqual(
      victoryDokaKeepRemountPortalCreditKey(1),
      "pbv_spend_keep_remount_slot1",
    );
  });
});

describe("note / read / clear VictoryDokaKeepRemountPortalCredit", () => {
  it("round-trips the #774 { preDoka } shape", () => {
    const storage = memStorage();
    assert.equal(hasVictoryDokaKeepRemountPortalCredit(storage, 1), false);
    noteVictoryDokaKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    assert.deepEqual(readVictoryDokaKeepRemountPortalCredit(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(hasVictoryDokaKeepRemountPortalCredit(storage, 1), true);
    clearVictoryDokaKeepRemountPortalCredit(storage, 1);
    assert.equal(readVictoryDokaKeepRemountPortalCredit(storage, 1), null);
  });

  it("isolates character slots", () => {
    const storage = memStorage();
    noteVictoryDokaKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    noteVictoryDokaKeepRemountPortalCredit(storage, 2, 90);
    assert.deepEqual(readVictoryDokaKeepRemountPortalCredit(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.deepEqual(readVictoryDokaKeepRemountPortalCredit(storage, 2), {
      preDoka: 90,
    });
    clearVictoryDokaKeepRemountPortalCredit(storage, 1);
    assert.equal(readVictoryDokaKeepRemountPortalCredit(storage, 1), null);
    assert.equal(hasVictoryDokaKeepRemountPortalCredit(storage, 2), true);
  });
});

describe("dokaFromVictoryDokaKeepPortalCreditWalletRecord", () => {
  it("reads number, bigint, and { ok } wallet", () => {
    assert.equal(dokaFromVictoryDokaKeepPortalCreditWalletRecord(250), 250);
    assert.equal(dokaFromVictoryDokaKeepPortalCreditWalletRecord(250n), 250);
    assert.equal(
      dokaFromVictoryDokaKeepPortalCreditWalletRecord({ ok: VICTORY_DOKA }),
      250,
    );
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromVictoryDokaKeepPortalCreditWalletRecord(null), null);
    assert.equal(dokaFromVictoryDokaKeepPortalCreditWalletRecord({}), null);
    assert.equal(dokaFromVictoryDokaKeepPortalCreditWalletRecord("nope"), null);
  });
});

describe("shouldRefuseVictoryDokaKeepRemountPortalCreditStaleDoka", () => {
  it("fail-closes when live still equals stamped preDoka", () => {
    assert.equal(
      shouldRefuseVictoryDokaKeepRemountPortalCreditStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("fail-closes when live sits below stamped preDoka", () => {
    assert.equal(
      shouldRefuseVictoryDokaKeepRemountPortalCreditStaleDoka({
        keep: true,
        liveDoka: 0,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseVictoryDokaKeepRemountPortalCreditStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("does not refuse a risen victory wallet 250", () => {
    assert.equal(
      shouldRefuseVictoryDokaKeepRemountPortalCreditStaleDoka({
        keep: true,
        liveDoka: VICTORY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseVictoryDokaKeepRemountPortalCreditStaleDoka({
        keep: false,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });
});

describe("successful victory Doka throw-after-add then remount portal without unpaid death", () => {
  it("leftover remount portal commit keeps Play-entry Doka 200 while canister is 250", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 / XP 100. Canister 200/100.
    // 2. Victory applyRewards(slot, 50, 80) invokes then throws (250/180).
    //    Catch only logDebugInfo. GameFlow Play-entry stays 200. #774 stamps
    //    preDoka=200. #767 / #813 do not stamp this wallet.
    // 3. Actor reconnect remounts. Lock Doka 200 / XP 100.
    // 4. Portal persistIncrementalRewards(0, 10) #ok newXp=190, newDoka=250.
    //    Production commits XP/level only. Lock Doka stays 200.
    const afterPortal = committedProgressAfterPortalWithVictoryDokaKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: VICTORY_DOKA,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
    });
    assert.deepEqual(afterPortal, {
      doka: PLAY_ENTRY_DOKA,
      xp: PORTAL_XP,
      level: LEVEL,
    });
    const remount = remountLock();
    assert.equal(remount.snapshot().doka, PLAY_ENTRY_DOKA);
  });

  it("leftover shop after that portal writes Doka 150 over canister 250", () => {
    const leftoverShop = leftoverShopWriteAfterPortalWithVictoryDokaKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: VICTORY_DOKA,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(leftoverShop, { xp: PORTAL_XP, doka: 150 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: VICTORY_DOKA, xp: PORTAL_XP },
        leftoverShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 150, xp: PORTAL_XP },
      "incoming-below-stored wipes victory Doka (portal leftover XP is kept)",
    );
  });

  it("gated remount portal honour replica 250 so leftover shop cannot wipe it", () => {
    const gatedShop = leftoverShopWriteAfterPortalWithVictoryDokaKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: VICTORY_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(gatedShop, { xp: PORTAL_XP, doka: 200 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: VICTORY_DOKA, xp: PORTAL_XP },
        gatedShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 200, xp: PORTAL_XP },
    );
  });

  it("portal +10 XP still lands from applyRewards newXp", () => {
    const gated = committedProgressAfterPortalWithVictoryDokaKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: VICTORY_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
    });
    assert.equal(gated?.xp, VICTORY_LEFTOVER_XP + PORTAL_TRANSITION_XP);
    assert.equal(gated?.doka, VICTORY_DOKA);
  });
});

describe("sessionDokaAfterVictoryDokaKeepRemountPortalCredit", () => {
  it("ungated remount wallet stays Play-entry 200 so leftover shop writes a lie", () => {
    const session = sessionDokaAfterVictoryDokaKeepRemountPortalCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: VICTORY_DOKA,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, PLAY_ENTRY_DOKA);
  });

  it("honour replica 250 so leftover shop matches the canister", () => {
    const session = sessionDokaAfterVictoryDokaKeepRemountPortalCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: VICTORY_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, VICTORY_DOKA);
  });
});

describe("pickup-only remount portal still uses Play-entry Doka", () => {
  it("does not honour without a keep stamp", () => {
    const shop = leftoverShopWriteAfterPortalWithVictoryDokaKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: VICTORY_DOKA,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PLAY_ENTRY_XP + PORTAL_TRANSITION_XP,
      portalNewLevel: LEVEL,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(shop, {
      xp: PLAY_ENTRY_XP + PORTAL_TRANSITION_XP,
      doka: 150,
    });
  });
});

describe("unique vs heal/shop, death, rename, feat/GameKey, leftover-XP one-shot", () => {
  it("heal/shop #774 would honour 250 before persistAbsoluteProgress", () => {
    assert.equal(
      dokaForVictoryDokaKeepRemountPortalCredit({
        remountDoka: PLAY_ENTRY_DOKA,
        liveDoka: VICTORY_DOKA,
        keep: true,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      VICTORY_DOKA,
    );
  });

  it("rename #979 would debit replica 250, not Play-entry 200", () => {
    const honoured = dokaForVictoryDokaKeepRemountPortalCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: VICTORY_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(committedDokaAfterRename(honoured ?? 0), 150);
    assert.notEqual(
      committedDokaAfterRename(PLAY_ENTRY_DOKA),
      committedDokaAfterRename(honoured ?? 0),
    );
    assert.equal(RENAME_DOKA_COST, 100);
  });

  it("feat #1028 would add grant onto replica 250, not Play-entry 200", () => {
    const honoured = dokaForVictoryDokaKeepRemountPortalCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: VICTORY_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(
      committedDokaAfterAchievementCredit(honoured ?? 0, FEAT_GRANT),
      350,
    );
    assert.equal(
      committedDokaAfterAchievementCredit(PLAY_ENTRY_DOKA, FEAT_GRANT),
      300,
    );
  });

  it("GameKey #1028 would add 1000 onto replica 250, not Play-entry 200", () => {
    const honoured = dokaForVictoryDokaKeepRemountPortalCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: VICTORY_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(
      committedDokaAfterGameKeyRedeem(honoured ?? 0, GAMEKEY_GRANT),
      1250,
    );
    assert.equal(
      committedDokaAfterGameKeyRedeem(PLAY_ENTRY_DOKA, GAMEKEY_GRANT),
      1200,
    );
  });

  it("leftover-XP one-shot #1099 is the dual: Doka settle, XP wipe — this is XP settle, Doka wipe", () => {
    const portalShop = leftoverShopWriteAfterPortalWithVictoryDokaKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: VICTORY_DOKA,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(portalShop?.xp, PORTAL_XP);
    assert.equal(portalShop?.doka, applySpendToCommitted(PLAY_ENTRY_DOKA, 50));
  });
});

describe("persistPortalThroughVictoryDokaKeepRemount", () => {
  it("adopts replica 250 then portal commits leftover+10 XP", async () => {
    const storage = memStorage();
    noteVictoryDokaKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    const ok = await persistPortalThroughVictoryDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => VICTORY_DOKA,
      applyAndCommit: async () => {
        applied = true;
        persist.commit({ xp: PORTAL_XP, level: LEVEL });
        return true;
      },
    });
    assert.equal(ok, true);
    assert.equal(applied, true);
    assert.equal(persist.snapshot().doka, VICTORY_DOKA);
    assert.equal(persist.snapshot().xp, PORTAL_XP);
    assert.equal(
      hasVictoryDokaKeepRemountPortalCredit(storage, 1),
      false,
      "clear the stamp after honour so leftover shop cannot reconstruct 200",
    );
  });

  it("throws and does not apply when live Doka is still Play-entry", async () => {
    const storage = memStorage();
    noteVictoryDokaKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistPortalThroughVictoryDokaKeepRemount({
          persist,
          storage,
          slot: 1,
          readWallet: async () => PLAY_ENTRY_DOKA,
          applyAndCommit: async () => {
            applied = true;
            persist.commit({ xp: PORTAL_XP, level: LEVEL });
            return true;
          },
        }),
      (err: unknown) =>
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
    );
    assert.equal(applied, false);
    assert.equal(persist.snapshot().doka, PLAY_ENTRY_DOKA);
    assert.equal(persist.snapshot().xp, PLAY_ENTRY_XP);
    assert.equal(
      hasVictoryDokaKeepRemountPortalCredit(storage, 1),
      true,
      "fail-close keeps the stamp",
    );
  });

  it("throws when live wallet is missing", async () => {
    const storage = memStorage();
    noteVictoryDokaKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistPortalThroughVictoryDokaKeepRemount({
          persist,
          storage,
          slot: 1,
          readWallet: async () => null,
          applyAndCommit: async () => true,
        }),
      (err: unknown) =>
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
    );
    assert.equal(hasVictoryDokaKeepRemountPortalCredit(storage, 1), true);
  });

  it("throws when the wallet read throws", async () => {
    const storage = memStorage();
    noteVictoryDokaKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistPortalThroughVictoryDokaKeepRemount({
          persist,
          storage,
          slot: 1,
          readWallet: async () => {
            throw new Error("replica lag");
          },
          applyAndCommit: async () => true,
        }),
      (err: unknown) =>
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
    );
    assert.equal(hasVictoryDokaKeepRemountPortalCredit(storage, 1), true);
  });

  it("passthrough without a stamp still runs portal persist", async () => {
    const persist = remountLock();
    let applied = false;
    await persistPortalThroughVictoryDokaKeepRemount({
      persist,
      storage: memStorage(),
      slot: 1,
      readWallet: async () => VICTORY_DOKA,
      applyAndCommit: async () => {
        applied = true;
        persist.commit({ xp: PLAY_ENTRY_XP + PORTAL_TRANSITION_XP });
        return true;
      },
    });
    assert.equal(applied, true);
    assert.equal(persist.snapshot().doka, PLAY_ENTRY_DOKA);
    assert.equal(persist.snapshot().xp, PLAY_ENTRY_XP + PORTAL_TRANSITION_XP);
  });
});

describe("persistIncrementalRewardsThroughVictoryDokaKeepRemount", () => {
  it("honours replica 250 then portal applyRewards commits leftover+10 XP, dokaDelta 0", async () => {
    const storage = memStorage();
    noteVictoryDokaKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    const canister = { doka: VICTORY_DOKA, xp: VICTORY_LEFTOVER_XP };
    const persisted =
      await persistIncrementalRewardsThroughVictoryDokaKeepRemount({
        actor: {
          applyRewards: async (
            _slot: bigint,
            dokaDelta: bigint,
            xpDelta: bigint,
          ) => {
            canister.doka += Number(dokaDelta);
            canister.xp += Number(xpDelta);
            return {
              ok: {
                newDoka: canister.doka,
                newXp: canister.xp,
                newLevel: LEVEL,
              },
            };
          },
        },
        persist,
        storage,
        slot: 1,
        dokaDelta: 0,
        xpDelta: PORTAL_TRANSITION_XP,
        readWallet: async () => VICTORY_DOKA,
      });
    assert.equal(persisted.newDoka, VICTORY_DOKA);
    assert.equal(persisted.newXp, PORTAL_XP);
    assert.equal(
      canister.doka,
      VICTORY_DOKA,
      "portal dokaDelta 0 must not mint",
    );
    assert.equal(canister.xp, PORTAL_XP);
    assert.equal(persist.snapshot().doka, VICTORY_DOKA);
    assert.equal(persist.snapshot().xp, PORTAL_XP);
    assert.equal(hasVictoryDokaKeepRemountPortalCredit(storage, 1), false);

    const leftoverShop = {
      xp: persist.snapshot().xp,
      doka: applySpendToCommitted(persist.snapshot().doka, SHOP_SPEND),
    };
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: canister.doka, xp: canister.xp },
        leftoverShop,
      ),
      { doka: 200, xp: PORTAL_XP },
    );
  });

  it("ungated portal (no stamp) commits XP while lock Doka stays Play-entry", async () => {
    const persist = remountLock();
    const canister = { doka: VICTORY_DOKA, xp: VICTORY_LEFTOVER_XP };
    await persistIncrementalRewardsThroughVictoryDokaKeepRemount({
      actor: {
        applyRewards: async (
          _slot: bigint,
          dokaDelta: bigint,
          xpDelta: bigint,
        ) => {
          canister.doka += Number(dokaDelta);
          canister.xp += Number(xpDelta);
          return {
            ok: {
              newDoka: canister.doka,
              newXp: canister.xp,
              newLevel: LEVEL,
            },
          };
        },
      },
      persist,
      storage: memStorage(),
      slot: 1,
      dokaDelta: 0,
      xpDelta: PORTAL_TRANSITION_XP,
      readWallet: async () => VICTORY_DOKA,
    });
    assert.equal(persist.snapshot().doka, PLAY_ENTRY_DOKA);
    assert.equal(persist.snapshot().xp, PORTAL_XP);
    assert.equal(canister.doka, VICTORY_DOKA);
    const leftoverShop = {
      xp: persist.snapshot().xp,
      doka: applySpendToCommitted(persist.snapshot().doka, SHOP_SPEND),
    };
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: canister.doka, xp: canister.xp },
        leftoverShop,
      ),
      { doka: 150, xp: PORTAL_XP },
    );
  });
});

describe("dokaForVictoryDokaKeepRemountPortalCredit", () => {
  it("returns remount wallet when keep is unset", () => {
    assert.equal(
      dokaForVictoryDokaKeepRemountPortalCredit({
        remountDoka: PLAY_ENTRY_DOKA,
        liveDoka: VICTORY_DOKA,
        keep: false,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      PLAY_ENTRY_DOKA,
    );
  });

  it("returns null when keep is set and live is stale", () => {
    assert.equal(
      dokaForVictoryDokaKeepRemountPortalCredit({
        remountDoka: PLAY_ENTRY_DOKA,
        liveDoka: PLAY_ENTRY_DOKA,
        keep: true,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      null,
    );
  });

  it("leftover shop helper fail-closes on stale live", () => {
    assert.equal(
      leftoverShopWriteAfterPortalWithVictoryDokaKeep({
        remountDoka: PLAY_ENTRY_DOKA,
        liveDoka: PLAY_ENTRY_DOKA,
        keep: true,
        stampedPreDoka: PLAY_ENTRY_DOKA,
        portalNewXp: PORTAL_XP,
        portalNewLevel: LEVEL,
        shopSpend: SHOP_SPEND,
      }),
      null,
    );
  });
});
