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
  clearSpendKeepRemountPortalCredit,
  committedProgressAfterPortalWithSpendKeep,
  dokaForSpendKeepRemountPortalCredit,
  dokaFromSpendKeepRemountPortalCreditWalletRecord,
  hasSpendKeepRemountPortalCredit,
  leftoverShopWriteAfterPortalWithSpendKeep,
  noteSpendKeepRemountPortalCredit,
  persistIncrementalRewardsThroughSpendKeepRemount,
  persistPortalThroughSpendKeepRemount,
  readSpendKeepRemountPortalCredit,
  sessionDokaAfterSpendKeepRemountPortalCredit,
  shouldRefuseSpendKeepRemountPortalCreditStaleDoka,
  spendKeepRemountPortalCreditKey,
} from "./spendKeepRemountPortalCreditWriteSkip.ts";

const PLAY_ENTRY_XP = 100;
const PLAY_ENTRY_DOKA = 200;
const RENAME_DOKA = PLAY_ENTRY_DOKA - RENAME_DOKA_COST;
const UPGRADE_SPEND = 10;
const UPGRADE_DOKA = PLAY_ENTRY_DOKA - UPGRADE_SPEND;
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

describe("spendKeepRemountPortalCreditKey", () => {
  it("reads the same #926 slot key, not credit-Doka or leftover-XP keys", () => {
    assert.equal(
      spendKeepRemountPortalCreditKey(1),
      "pbv_spend_keep_remount_slot1",
    );
    assert.equal(
      spendKeepRemountPortalCreditKey(3),
      "pbv_spend_keep_remount_slot3",
    );
    assert.notEqual(
      spendKeepRemountPortalCreditKey(1),
      "pbv_gamekey_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spendKeepRemountPortalCreditKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spendKeepRemountPortalCreditKey(1),
      "pbv_oneshot_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spendKeepRemountPortalCreditKey(1),
      "pbv_feat_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spendKeepRemountPortalCreditKey(1),
      "pbv_boss_rush_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spendKeepRemountPortalCreditKey(1),
      "pbv_absolute_doka_throw_keep_remount_slot1",
    );
    assert.notEqual(
      spendKeepRemountPortalCreditKey(1),
      "pbv_portal_xp_keep_remount_slot1",
    );
    assert.notEqual(
      spendKeepRemountPortalCreditKey(1),
      "pbv_victory_xp_keep_remount_slot1",
    );
    assert.notEqual(
      spendKeepRemountPortalCreditKey(1),
      "pbv_xp_credit_keep_remount_slot1",
    );
  });
});

describe("note / read / clear SpendKeepRemountPortalCredit", () => {
  it("round-trips the #926 { preDoka } shape", () => {
    const storage = memStorage();
    assert.equal(hasSpendKeepRemountPortalCredit(storage, 1), false);
    noteSpendKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    assert.deepEqual(readSpendKeepRemountPortalCredit(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(hasSpendKeepRemountPortalCredit(storage, 1), true);
    clearSpendKeepRemountPortalCredit(storage, 1);
    assert.equal(readSpendKeepRemountPortalCredit(storage, 1), null);
  });

  it("isolates character slots", () => {
    const storage = memStorage();
    noteSpendKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    noteSpendKeepRemountPortalCredit(storage, 2, 90);
    assert.deepEqual(readSpendKeepRemountPortalCredit(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.deepEqual(readSpendKeepRemountPortalCredit(storage, 2), {
      preDoka: 90,
    });
    clearSpendKeepRemountPortalCredit(storage, 1);
    assert.equal(readSpendKeepRemountPortalCredit(storage, 1), null);
    assert.equal(hasSpendKeepRemountPortalCredit(storage, 2), true);
  });
});

describe("dokaFromSpendKeepRemountPortalCreditWalletRecord", () => {
  it("reads number, bigint, and { ok } wallet", () => {
    assert.equal(
      dokaFromSpendKeepRemountPortalCreditWalletRecord(RENAME_DOKA),
      RENAME_DOKA,
    );
    assert.equal(
      dokaFromSpendKeepRemountPortalCreditWalletRecord(BigInt(RENAME_DOKA)),
      RENAME_DOKA,
    );
    assert.equal(
      dokaFromSpendKeepRemountPortalCreditWalletRecord({ ok: RENAME_DOKA }),
      RENAME_DOKA,
    );
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(dokaFromSpendKeepRemountPortalCreditWalletRecord(null), null);
    assert.equal(
      dokaFromSpendKeepRemountPortalCreditWalletRecord("nope"),
      null,
    );
    assert.equal(dokaFromSpendKeepRemountPortalCreditWalletRecord({}), null);
  });
});

describe("shouldRefuseSpendKeepRemountPortalCreditStaleDoka", () => {
  it("fail-closes when live still equals stamped preDoka", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountPortalCreditStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("fail-closes when live sits above stamped preDoka", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountPortalCreditStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA + 50,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountPortalCreditStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("does not refuse a dropped rename wallet 100", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountPortalCreditStaleDoka({
        keep: true,
        liveDoka: RENAME_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });

  it("does not refuse a dropped upgrade wallet 190", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountPortalCreditStaleDoka({
        keep: true,
        liveDoka: UPGRADE_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseSpendKeepRemountPortalCreditStaleDoka({
        keep: false,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });
});

describe("successful spend keep then remount portal without unpaid death", () => {
  it("leftover remount portal commit keeps Play-entry Doka 200 while canister is 100", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 / XP 100. Canister 200/100.
    // 2. renameCharacter deducts 100 then throws (100/100). Catch toasts.
    //    GameFlow Play-entry stays 200. #926 stamps preDoka=200.
    //    #811 / #774 / #800 / #964 do not stamp this spend.
    // 3. Actor reconnect remounts. Lock Doka 200 / XP 100.
    // 4. Portal persistIncrementalRewards(0, 10) #ok newXp=110, newDoka=100.
    //    Production commits XP/level only. Lock Doka stays 200.
    const afterPortal = committedProgressAfterPortalWithSpendKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_DOKA,
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

  it("leftover shop after that portal writes Doka 150; never-mint leaves rename 100 (free item)", () => {
    const leftoverShop = leftoverShopWriteAfterPortalWithSpendKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_DOKA,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(leftoverShop, { xp: PORTAL_XP, doka: 150 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: RENAME_DOKA, xp: PORTAL_XP },
        leftoverShop ?? { xp: 0, doka: 0 },
      ),
      { doka: RENAME_DOKA, xp: PORTAL_XP },
      "incoming-above-stored never-mints; item still lands from lock 200",
    );
  });

  it("gated remount portal honour replica 100 so leftover shop charges the rename wallet", () => {
    const gatedShop = leftoverShopWriteAfterPortalWithSpendKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(gatedShop, { xp: PORTAL_XP, doka: 50 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: RENAME_DOKA, xp: PORTAL_XP },
        gatedShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 50, xp: PORTAL_XP },
    );
  });

  it("ungated leftover shop after upgrade refunds the 10 Doka fee (150 over 190)", () => {
    const leftoverShop = leftoverShopWriteAfterPortalWithSpendKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: UPGRADE_DOKA,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(leftoverShop, { xp: PORTAL_XP, doka: 150 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: UPGRADE_DOKA, xp: PORTAL_XP },
        leftoverShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 150, xp: PORTAL_XP },
      "incoming-below-stored writes 150 over upgrade 190 (refunds the fee)",
    );
  });

  it("gated remount portal honour replica 190 so leftover shop writes 140", () => {
    const gatedShop = leftoverShopWriteAfterPortalWithSpendKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: UPGRADE_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(gatedShop, { xp: PORTAL_XP, doka: 140 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: UPGRADE_DOKA, xp: PORTAL_XP },
        gatedShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 140, xp: PORTAL_XP },
    );
  });

  it("portal +10 XP still lands from applyRewards newXp", () => {
    const gated = committedProgressAfterPortalWithSpendKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
    });
    assert.equal(gated?.xp, PLAY_ENTRY_XP + PORTAL_TRANSITION_XP);
    assert.equal(gated?.doka, RENAME_DOKA);
  });
});

describe("sessionDokaAfterSpendKeepRemountPortalCredit", () => {
  it("ungated remount wallet stays Play-entry 200 so leftover shop writes a lie", () => {
    const session = sessionDokaAfterSpendKeepRemountPortalCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_DOKA,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, PLAY_ENTRY_DOKA);
  });

  it("honour replica 100 so leftover shop matches the canister", () => {
    const session = sessionDokaAfterSpendKeepRemountPortalCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, RENAME_DOKA);
  });
});

describe("pickup-only remount portal still uses Play-entry Doka", () => {
  it("does not honour without a keep stamp", () => {
    const shop = leftoverShopWriteAfterPortalWithSpendKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_DOKA,
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

describe("unique vs heal/shop, death, rename, feat/GameKey, credit-Doka portal", () => {
  it("heal/shop #926 would honour 100 before persistAbsoluteProgress", () => {
    assert.equal(
      dokaForSpendKeepRemountPortalCredit({
        remountDoka: PLAY_ENTRY_DOKA,
        liveDoka: RENAME_DOKA,
        keep: true,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      RENAME_DOKA,
    );
  });

  it("rename #1002 would debit replica 100, not Play-entry 200", () => {
    const honoured = dokaForSpendKeepRemountPortalCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(committedDokaAfterRename(honoured ?? 0), 0);
    assert.notEqual(
      committedDokaAfterRename(PLAY_ENTRY_DOKA),
      committedDokaAfterRename(honoured ?? 0),
    );
    assert.equal(RENAME_DOKA_COST, 100);
    assert.equal(committedDokaAfterRename(PLAY_ENTRY_DOKA), 100);
  });

  it("feat #1024 would add grant onto replica 100, not Play-entry 200", () => {
    const honoured = dokaForSpendKeepRemountPortalCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(
      committedDokaAfterAchievementCredit(honoured ?? 0, FEAT_GRANT),
      200,
    );
    assert.equal(
      committedDokaAfterAchievementCredit(PLAY_ENTRY_DOKA, FEAT_GRANT),
      300,
    );
  });

  it("GameKey #1024 would add 1000 onto replica 100, not Play-entry 200", () => {
    const honoured = dokaForSpendKeepRemountPortalCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(
      committedDokaAfterGameKeyRedeem(honoured ?? 0, GAMEKEY_GRANT),
      1100,
    );
    assert.equal(
      committedDokaAfterGameKeyRedeem(PLAY_ENTRY_DOKA, GAMEKEY_GRANT),
      1200,
    );
  });

  it("leftover-XP one-shot #1092 is reverse order leftover XP — this is Doka spend", () => {
    const portalShop = leftoverShopWriteAfterPortalWithSpendKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: RENAME_DOKA,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(portalShop?.xp, PORTAL_XP);
    assert.equal(portalShop?.doka, applySpendToCommitted(PLAY_ENTRY_DOKA, 50));
  });

  it("GameKey Doka keep × portal is #1147 (different stamp key, opposite skip)", () => {
    assert.notEqual(
      spendKeepRemountPortalCreditKey(1),
      "pbv_gamekey_doka_keep_remount_slot1",
    );
    assert.equal(
      shouldRefuseSpendKeepRemountPortalCreditStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
      "spend skip is live >= pre (Play-entry did not drop)",
    );
  });

  it("shop/heal throw keep × portal is leftover (different stamp key)", () => {
    assert.notEqual(
      spendKeepRemountPortalCreditKey(1),
      "pbv_absolute_doka_throw_keep_remount_slot1",
    );
  });
});

describe("persistPortalThroughSpendKeepRemount", () => {
  it("adopts replica 100 then portal commits leftover+10 XP", async () => {
    const storage = memStorage();
    noteSpendKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    const ok = await persistPortalThroughSpendKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => RENAME_DOKA,
      applyAndCommit: async () => {
        applied = true;
        persist.commit({ xp: PORTAL_XP, level: LEVEL });
        return true;
      },
    });
    assert.equal(ok, true);
    assert.equal(applied, true);
    assert.equal(persist.snapshot().doka, RENAME_DOKA);
    assert.equal(persist.snapshot().xp, PORTAL_XP);
    assert.equal(
      hasSpendKeepRemountPortalCredit(storage, 1),
      false,
      "clear the stamp after honour so leftover shop cannot reconstruct 200",
    );
  });

  it("throws and does not apply when live Doka is still Play-entry", async () => {
    const storage = memStorage();
    noteSpendKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistPortalThroughSpendKeepRemount({
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
      hasSpendKeepRemountPortalCredit(storage, 1),
      true,
      "fail-close keeps the stamp",
    );
  });

  it("throws when live wallet is missing", async () => {
    const storage = memStorage();
    noteSpendKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistPortalThroughSpendKeepRemount({
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
    assert.equal(hasSpendKeepRemountPortalCredit(storage, 1), true);
  });

  it("throws when the wallet read throws", async () => {
    const storage = memStorage();
    noteSpendKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistPortalThroughSpendKeepRemount({
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
    assert.equal(hasSpendKeepRemountPortalCredit(storage, 1), true);
  });

  it("passthrough without a stamp still runs portal persist", async () => {
    const persist = remountLock();
    let applied = false;
    await persistPortalThroughSpendKeepRemount({
      persist,
      storage: memStorage(),
      slot: 1,
      readWallet: async () => RENAME_DOKA,
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

describe("persistIncrementalRewardsThroughSpendKeepRemount", () => {
  it("honours replica 100 then portal applyRewards commits leftover+10 XP, dokaDelta 0", async () => {
    const storage = memStorage();
    noteSpendKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    const canister = { doka: RENAME_DOKA, xp: PLAY_ENTRY_XP };
    const persisted = await persistIncrementalRewardsThroughSpendKeepRemount({
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
      readWallet: async () => RENAME_DOKA,
    });
    assert.equal(persisted.newDoka, RENAME_DOKA);
    assert.equal(persisted.newXp, PORTAL_XP);
    assert.equal(
      canister.doka,
      RENAME_DOKA,
      "portal dokaDelta 0 must not mint",
    );
    assert.equal(canister.xp, PORTAL_XP);
    assert.equal(persist.snapshot().doka, RENAME_DOKA);
    assert.equal(persist.snapshot().xp, PORTAL_XP);
    assert.equal(hasSpendKeepRemountPortalCredit(storage, 1), false);

    const leftoverShop = {
      xp: persist.snapshot().xp,
      doka: applySpendToCommitted(persist.snapshot().doka, SHOP_SPEND),
    };
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: canister.doka, xp: canister.xp },
        leftoverShop,
      ),
      { doka: 50, xp: PORTAL_XP },
    );
  });

  it("ungated portal (no stamp) commits XP while lock Doka stays Play-entry", async () => {
    const persist = remountLock();
    const canister = { doka: RENAME_DOKA, xp: PLAY_ENTRY_XP };
    await persistIncrementalRewardsThroughSpendKeepRemount({
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
      readWallet: async () => RENAME_DOKA,
    });
    assert.equal(persist.snapshot().doka, PLAY_ENTRY_DOKA);
    assert.equal(persist.snapshot().xp, PORTAL_XP);
    assert.equal(canister.doka, RENAME_DOKA);
    const leftoverShop = {
      xp: persist.snapshot().xp,
      doka: applySpendToCommitted(persist.snapshot().doka, SHOP_SPEND),
    };
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: canister.doka, xp: canister.xp },
        leftoverShop,
      ),
      { doka: RENAME_DOKA, xp: PORTAL_XP },
      "ungated leftover 150 never-mints over rename 100",
    );
  });
});

describe("dokaForSpendKeepRemountPortalCredit", () => {
  it("returns remount wallet when keep is unset", () => {
    assert.equal(
      dokaForSpendKeepRemountPortalCredit({
        remountDoka: PLAY_ENTRY_DOKA,
        liveDoka: RENAME_DOKA,
        keep: false,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      PLAY_ENTRY_DOKA,
    );
  });

  it("returns null when keep is set and live is stale", () => {
    assert.equal(
      dokaForSpendKeepRemountPortalCredit({
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
      leftoverShopWriteAfterPortalWithSpendKeep({
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
