import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clampSaveBattleStatsWrite } from "./absoluteStatsClamp.ts";
import { committedDokaAfterAchievementCredit } from "./achievementReward.ts";
import { PORTAL_TRANSITION_XP } from "./applyRewardsResult.ts";
import {
  bossRushDokaKeepRemountPortalCreditKey,
  clearBossRushDokaKeepRemountPortalCredit,
  committedProgressAfterPortalWithBossRushDokaKeep,
  dokaForBossRushDokaKeepRemountPortalCredit,
  dokaFromBossRushDokaKeepPortalCreditWalletRecord,
  hasBossRushDokaKeepRemountPortalCredit,
  leftoverShopWriteAfterPortalWithBossRushDokaKeep,
  noteBossRushDokaKeepRemountPortalCredit,
  persistIncrementalRewardsThroughBossRushDokaKeepRemount,
  persistPortalThroughBossRushDokaKeepRemount,
  readBossRushDokaKeepRemountPortalCredit,
  sessionDokaAfterBossRushDokaKeepRemountPortalCredit,
  shouldRefuseBossRushDokaKeepRemountPortalCreditStaleDoka,
} from "./bossRushDokaKeepRemountPortalCreditWriteSkip.ts";
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

const PLAY_ENTRY_XP = 100;
const PLAY_ENTRY_DOKA = 200;
const BOSS_RUSH_GRANT = 500;
const BOSS_RUSH_DOKA = PLAY_ENTRY_DOKA + BOSS_RUSH_GRANT;
const PORTAL_XP = PLAY_ENTRY_XP + PORTAL_TRANSITION_XP;
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

describe("bossRushDokaKeepRemountPortalCreditKey", () => {
  it("reads the same #864 slot key, not XP-throw or other Doka keys", () => {
    assert.equal(
      bossRushDokaKeepRemountPortalCreditKey(1),
      "pbv_boss_rush_doka_keep_remount_slot1",
    );
    assert.equal(
      bossRushDokaKeepRemountPortalCreditKey(3),
      "pbv_boss_rush_doka_keep_remount_slot3",
    );
    assert.notEqual(
      bossRushDokaKeepRemountPortalCreditKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    assert.notEqual(
      bossRushDokaKeepRemountPortalCreditKey(1),
      "pbv_oneshot_doka_keep_remount_slot1",
    );
    assert.notEqual(
      bossRushDokaKeepRemountPortalCreditKey(1),
      "pbv_gamekey_doka_keep_remount_slot1",
    );
    assert.notEqual(
      bossRushDokaKeepRemountPortalCreditKey(1),
      "pbv_feat_doka_keep_remount_slot1",
    );
    assert.notEqual(
      bossRushDokaKeepRemountPortalCreditKey(1),
      "pbv_victory_xp_keep_remount_slot1",
    );
    assert.notEqual(
      bossRushDokaKeepRemountPortalCreditKey(1),
      "pbv_portal_xp_keep_remount_slot1",
    );
    assert.notEqual(
      bossRushDokaKeepRemountPortalCreditKey(1),
      "pbv_xp_credit_keep_remount_slot1",
    );
    assert.notEqual(
      bossRushDokaKeepRemountPortalCreditKey(1),
      "pbv_spend_keep_remount_slot1",
    );
  });
});

describe("note / read / clear BossRushDokaKeepRemountPortalCredit", () => {
  it("round-trips the #864 { preDoka } shape", () => {
    const storage = memStorage();
    assert.equal(hasBossRushDokaKeepRemountPortalCredit(storage, 1), false);
    noteBossRushDokaKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    assert.deepEqual(readBossRushDokaKeepRemountPortalCredit(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(hasBossRushDokaKeepRemountPortalCredit(storage, 1), true);
    clearBossRushDokaKeepRemountPortalCredit(storage, 1);
    assert.equal(readBossRushDokaKeepRemountPortalCredit(storage, 1), null);
  });

  it("isolates character slots", () => {
    const storage = memStorage();
    noteBossRushDokaKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    noteBossRushDokaKeepRemountPortalCredit(storage, 2, 90);
    assert.deepEqual(readBossRushDokaKeepRemountPortalCredit(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.deepEqual(readBossRushDokaKeepRemountPortalCredit(storage, 2), {
      preDoka: 90,
    });
    clearBossRushDokaKeepRemountPortalCredit(storage, 1);
    assert.equal(readBossRushDokaKeepRemountPortalCredit(storage, 1), null);
    assert.equal(hasBossRushDokaKeepRemountPortalCredit(storage, 2), true);
  });
});

describe("dokaFromBossRushDokaKeepPortalCreditWalletRecord", () => {
  it("reads number, bigint, and { ok } wallet", () => {
    assert.equal(
      dokaFromBossRushDokaKeepPortalCreditWalletRecord(BOSS_RUSH_DOKA),
      BOSS_RUSH_DOKA,
    );
    assert.equal(
      dokaFromBossRushDokaKeepPortalCreditWalletRecord(BigInt(BOSS_RUSH_DOKA)),
      BOSS_RUSH_DOKA,
    );
    assert.equal(
      dokaFromBossRushDokaKeepPortalCreditWalletRecord({ ok: BOSS_RUSH_DOKA }),
      BOSS_RUSH_DOKA,
    );
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromBossRushDokaKeepPortalCreditWalletRecord(null), null);
    assert.equal(
      dokaFromBossRushDokaKeepPortalCreditWalletRecord("nope"),
      null,
    );
    assert.equal(dokaFromBossRushDokaKeepPortalCreditWalletRecord({}), null);
  });
});

describe("shouldRefuseBossRushDokaKeepRemountPortalCreditStaleDoka", () => {
  it("fail-closes when live still equals stamped preDoka", () => {
    assert.equal(
      shouldRefuseBossRushDokaKeepRemountPortalCreditStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("fail-closes when live sits below stamped preDoka", () => {
    assert.equal(
      shouldRefuseBossRushDokaKeepRemountPortalCreditStaleDoka({
        keep: true,
        liveDoka: 0,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseBossRushDokaKeepRemountPortalCreditStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("does not refuse a risen Boss Rush wallet 700", () => {
    assert.equal(
      shouldRefuseBossRushDokaKeepRemountPortalCreditStaleDoka({
        keep: true,
        liveDoka: BOSS_RUSH_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseBossRushDokaKeepRemountPortalCreditStaleDoka({
        keep: false,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });
});

describe("successful Boss Rush Doka keep then remount portal without unpaid death", () => {
  it("leftover remount portal commit keeps Play-entry Doka 200 while canister is 700", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 / XP 100. Canister 200/100.
    // 2. Room 0 applyRewards adds 500 then throws (700/100). Catch logs.
    //    GameFlow Play-entry stays 200. #864 stamps preDoka=200.
    //    #774 / #800 / #811 / #812 / #767 / #813 do not stamp this wallet.
    // 3. Actor reconnect remounts. Lock Doka 200 / XP 100.
    // 4. Portal persistIncrementalRewards(0, 10) #ok newXp=110, newDoka=700.
    //    Production commits XP/level only. Lock Doka stays 200.
    const afterPortal = committedProgressAfterPortalWithBossRushDokaKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: BOSS_RUSH_DOKA,
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

  it("leftover shop after that portal writes Doka 150 over canister 700", () => {
    const leftoverShop = leftoverShopWriteAfterPortalWithBossRushDokaKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: BOSS_RUSH_DOKA,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(leftoverShop, { xp: PORTAL_XP, doka: 150 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: BOSS_RUSH_DOKA, xp: PORTAL_XP },
        leftoverShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 150, xp: PORTAL_XP },
      "incoming-below-stored wipes Boss Rush Doka (portal leftover XP is kept)",
    );
  });

  it("gated remount portal honour replica 700 so leftover shop cannot wipe it", () => {
    const gatedShop = leftoverShopWriteAfterPortalWithBossRushDokaKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: BOSS_RUSH_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(gatedShop, { xp: PORTAL_XP, doka: 650 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: BOSS_RUSH_DOKA, xp: PORTAL_XP },
        gatedShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 650, xp: PORTAL_XP },
    );
  });

  it("portal +10 XP still lands from applyRewards newXp", () => {
    const gated = committedProgressAfterPortalWithBossRushDokaKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: BOSS_RUSH_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
    });
    assert.equal(gated?.xp, PLAY_ENTRY_XP + PORTAL_TRANSITION_XP);
    assert.equal(gated?.doka, BOSS_RUSH_DOKA);
  });
});

describe("sessionDokaAfterBossRushDokaKeepRemountPortalCredit", () => {
  it("ungated remount wallet stays Play-entry 200 so leftover shop writes a lie", () => {
    const session = sessionDokaAfterBossRushDokaKeepRemountPortalCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: BOSS_RUSH_DOKA,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, PLAY_ENTRY_DOKA);
  });

  it("honour replica 700 so leftover shop matches the canister", () => {
    const session = sessionDokaAfterBossRushDokaKeepRemountPortalCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: BOSS_RUSH_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, BOSS_RUSH_DOKA);
  });
});

describe("pickup-only remount portal still uses Play-entry Doka", () => {
  it("does not honour without a keep stamp", () => {
    const shop = leftoverShopWriteAfterPortalWithBossRushDokaKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: BOSS_RUSH_DOKA,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(shop, {
      xp: PORTAL_XP,
      doka: 150,
    });
  });
});

describe("unique vs heal/shop, death, rename, feat/GameKey, sibling portals", () => {
  it("heal/shop #864 would honour 700 before persistAbsoluteProgress", () => {
    assert.equal(
      dokaForBossRushDokaKeepRemountPortalCredit({
        remountDoka: PLAY_ENTRY_DOKA,
        liveDoka: BOSS_RUSH_DOKA,
        keep: true,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      BOSS_RUSH_DOKA,
    );
  });

  it("rename #1020 would debit replica 700, not Play-entry 200", () => {
    const honoured = dokaForBossRushDokaKeepRemountPortalCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: BOSS_RUSH_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(committedDokaAfterRename(honoured ?? 0), 600);
    assert.notEqual(
      committedDokaAfterRename(PLAY_ENTRY_DOKA),
      committedDokaAfterRename(honoured ?? 0),
    );
    assert.equal(RENAME_DOKA_COST, 100);
  });

  it("feat #1025 would add grant onto replica 700, not Play-entry 200", () => {
    const honoured = dokaForBossRushDokaKeepRemountPortalCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: BOSS_RUSH_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(
      committedDokaAfterAchievementCredit(honoured ?? 0, FEAT_GRANT),
      800,
    );
    assert.equal(
      committedDokaAfterAchievementCredit(PLAY_ENTRY_DOKA, FEAT_GRANT),
      300,
    );
  });

  it("GameKey #1025 would add 1000 onto replica 700, not Play-entry 200", () => {
    const honoured = dokaForBossRushDokaKeepRemountPortalCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: BOSS_RUSH_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(
      committedDokaAfterGameKeyRedeem(honoured ?? 0, GAMEKEY_GRANT),
      1700,
    );
    assert.equal(
      committedDokaAfterGameKeyRedeem(PLAY_ENTRY_DOKA, GAMEKEY_GRANT),
      1200,
    );
  });

  it("leftover-XP one-shot #1092 is reverse order leftover XP — this is Doka wipe", () => {
    const portalShop = leftoverShopWriteAfterPortalWithBossRushDokaKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: BOSS_RUSH_DOKA,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(portalShop?.xp, PORTAL_XP);
    assert.equal(portalShop?.doka, applySpendToCommitted(PLAY_ENTRY_DOKA, 50));
  });

  it("victory Doka keep × portal is #1129 (different stamp key)", () => {
    assert.notEqual(
      bossRushDokaKeepRemountPortalCreditKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
  });

  it("one-shot Doka keep × portal is #1145 (different stamp key)", () => {
    assert.notEqual(
      bossRushDokaKeepRemountPortalCreditKey(1),
      "pbv_oneshot_doka_keep_remount_slot1",
    );
  });

  it("GameKey Doka keep × portal is #1147 (different stamp key)", () => {
    assert.notEqual(
      bossRushDokaKeepRemountPortalCreditKey(1),
      "pbv_gamekey_doka_keep_remount_slot1",
    );
  });

  it("feat Doka keep × portal is #1149 (different stamp key)", () => {
    assert.notEqual(
      bossRushDokaKeepRemountPortalCreditKey(1),
      "pbv_feat_doka_keep_remount_slot1",
    );
  });
});

describe("persistPortalThroughBossRushDokaKeepRemount", () => {
  it("adopts replica 700 then portal commits leftover+10 XP", async () => {
    const storage = memStorage();
    noteBossRushDokaKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    const ok = await persistPortalThroughBossRushDokaKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => BOSS_RUSH_DOKA,
      applyAndCommit: async () => {
        applied = true;
        persist.commit({ xp: PORTAL_XP, level: LEVEL });
        return true;
      },
    });
    assert.equal(ok, true);
    assert.equal(applied, true);
    assert.equal(persist.snapshot().doka, BOSS_RUSH_DOKA);
    assert.equal(persist.snapshot().xp, PORTAL_XP);
    assert.equal(
      hasBossRushDokaKeepRemountPortalCredit(storage, 1),
      false,
      "clear the stamp after honour so leftover shop cannot reconstruct 200",
    );
  });

  it("throws and does not apply when live Doka is still Play-entry", async () => {
    const storage = memStorage();
    noteBossRushDokaKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistPortalThroughBossRushDokaKeepRemount({
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
      hasBossRushDokaKeepRemountPortalCredit(storage, 1),
      true,
      "fail-close keeps the stamp",
    );
  });

  it("throws when live wallet is missing", async () => {
    const storage = memStorage();
    noteBossRushDokaKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistPortalThroughBossRushDokaKeepRemount({
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
    assert.equal(hasBossRushDokaKeepRemountPortalCredit(storage, 1), true);
  });

  it("throws when the wallet read throws", async () => {
    const storage = memStorage();
    noteBossRushDokaKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistPortalThroughBossRushDokaKeepRemount({
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
    assert.equal(hasBossRushDokaKeepRemountPortalCredit(storage, 1), true);
  });

  it("passthrough without a stamp still runs portal persist", async () => {
    const persist = remountLock();
    let applied = false;
    await persistPortalThroughBossRushDokaKeepRemount({
      persist,
      storage: memStorage(),
      slot: 1,
      readWallet: async () => BOSS_RUSH_DOKA,
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

describe("persistIncrementalRewardsThroughBossRushDokaKeepRemount", () => {
  it("honours replica 700 then portal applyRewards commits leftover+10 XP, dokaDelta 0", async () => {
    const storage = memStorage();
    noteBossRushDokaKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    const canister = { doka: BOSS_RUSH_DOKA, xp: PLAY_ENTRY_XP };
    const persisted =
      await persistIncrementalRewardsThroughBossRushDokaKeepRemount({
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
        readWallet: async () => BOSS_RUSH_DOKA,
      });
    assert.equal(persisted.newDoka, BOSS_RUSH_DOKA);
    assert.equal(persisted.newXp, PORTAL_XP);
    assert.equal(
      canister.doka,
      BOSS_RUSH_DOKA,
      "portal dokaDelta 0 must not mint",
    );
    assert.equal(canister.xp, PORTAL_XP);
    assert.equal(persist.snapshot().doka, BOSS_RUSH_DOKA);
    assert.equal(persist.snapshot().xp, PORTAL_XP);
    assert.equal(hasBossRushDokaKeepRemountPortalCredit(storage, 1), false);

    const leftoverShop = {
      xp: persist.snapshot().xp,
      doka: applySpendToCommitted(persist.snapshot().doka, SHOP_SPEND),
    };
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: canister.doka, xp: canister.xp },
        leftoverShop,
      ),
      { doka: 650, xp: PORTAL_XP },
    );
  });

  it("ungated portal (no stamp) commits XP while lock Doka stays Play-entry", async () => {
    const persist = remountLock();
    const canister = { doka: BOSS_RUSH_DOKA, xp: PLAY_ENTRY_XP };
    await persistIncrementalRewardsThroughBossRushDokaKeepRemount({
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
      readWallet: async () => BOSS_RUSH_DOKA,
    });
    assert.equal(persist.snapshot().doka, PLAY_ENTRY_DOKA);
    assert.equal(persist.snapshot().xp, PORTAL_XP);
    assert.equal(canister.doka, BOSS_RUSH_DOKA);
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

describe("dokaForBossRushDokaKeepRemountPortalCredit", () => {
  it("returns remount wallet when keep is unset", () => {
    assert.equal(
      dokaForBossRushDokaKeepRemountPortalCredit({
        remountDoka: PLAY_ENTRY_DOKA,
        liveDoka: BOSS_RUSH_DOKA,
        keep: false,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      PLAY_ENTRY_DOKA,
    );
  });

  it("returns null when keep is set and live is stale", () => {
    assert.equal(
      dokaForBossRushDokaKeepRemountPortalCredit({
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
      leftoverShopWriteAfterPortalWithBossRushDokaKeep({
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
