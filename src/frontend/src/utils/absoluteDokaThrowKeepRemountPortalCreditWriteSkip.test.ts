import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  absoluteDokaThrowKeepRemountPortalCreditKey,
  clearAbsoluteDokaThrowKeepRemountPortalCredit,
  committedProgressAfterPortalWithAbsoluteDokaThrowKeep,
  dokaForAbsoluteDokaThrowKeepRemountPortalCredit,
  dokaFromAbsoluteDokaThrowKeepRemountPortalCreditWalletRecord,
  hasAbsoluteDokaThrowKeepRemountPortalCredit,
  leftoverShopWriteAfterPortalWithAbsoluteDokaThrowKeep,
  noteAbsoluteDokaThrowKeepRemountPortalCredit,
  persistIncrementalRewardsThroughAbsoluteDokaThrowKeepRemount,
  persistPortalThroughAbsoluteDokaThrowKeepRemount,
  readAbsoluteDokaThrowKeepRemountPortalCredit,
  sessionDokaAfterAbsoluteDokaThrowKeepRemountPortalCredit,
  shouldRefuseAbsoluteDokaThrowKeepRemountPortalCreditStaleDoka,
} from "./absoluteDokaThrowKeepRemountPortalCreditWriteSkip.ts";
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

const PLAY_ENTRY_XP = 100;
const PLAY_ENTRY_DOKA = 200;
const HEAL_SPEND = 10;
const HEAL_DOKA = PLAY_ENTRY_DOKA - HEAL_SPEND;
const SHOP_SPEND = 50;
const SHOP_DOKA = PLAY_ENTRY_DOKA - SHOP_SPEND;
const PORTAL_XP = PLAY_ENTRY_XP + PORTAL_TRANSITION_XP;
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

describe("absoluteDokaThrowKeepRemountPortalCreditKey", () => {
  it("reads the same #964 slot key, not spend-keep or leftover-XP keys", () => {
    assert.equal(
      absoluteDokaThrowKeepRemountPortalCreditKey(1),
      "pbv_absolute_doka_throw_keep_remount_slot1",
    );
    assert.equal(
      absoluteDokaThrowKeepRemountPortalCreditKey(3),
      "pbv_absolute_doka_throw_keep_remount_slot3",
    );
    assert.notEqual(
      absoluteDokaThrowKeepRemountPortalCreditKey(1),
      "pbv_spend_keep_remount_slot1",
    );
    assert.notEqual(
      absoluteDokaThrowKeepRemountPortalCreditKey(1),
      "pbv_gamekey_doka_keep_remount_slot1",
    );
    assert.notEqual(
      absoluteDokaThrowKeepRemountPortalCreditKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    assert.notEqual(
      absoluteDokaThrowKeepRemountPortalCreditKey(1),
      "pbv_oneshot_doka_keep_remount_slot1",
    );
    assert.notEqual(
      absoluteDokaThrowKeepRemountPortalCreditKey(1),
      "pbv_feat_doka_keep_remount_slot1",
    );
    assert.notEqual(
      absoluteDokaThrowKeepRemountPortalCreditKey(1),
      "pbv_boss_rush_doka_keep_remount_slot1",
    );
    assert.notEqual(
      absoluteDokaThrowKeepRemountPortalCreditKey(1),
      "pbv_portal_xp_keep_remount_slot1",
    );
    assert.notEqual(
      absoluteDokaThrowKeepRemountPortalCreditKey(1),
      "pbv_victory_xp_keep_remount_slot1",
    );
    assert.notEqual(
      absoluteDokaThrowKeepRemountPortalCreditKey(1),
      "pbv_xp_credit_keep_remount_slot1",
    );
  });
});

describe("note / read / clear AbsoluteDokaThrowKeepRemountPortalCredit", () => {
  it("round-trips the #964 { preDoka } shape", () => {
    const storage = memStorage();
    assert.equal(
      hasAbsoluteDokaThrowKeepRemountPortalCredit(storage, 1),
      false,
    );
    noteAbsoluteDokaThrowKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    assert.deepEqual(readAbsoluteDokaThrowKeepRemountPortalCredit(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(hasAbsoluteDokaThrowKeepRemountPortalCredit(storage, 1), true);
    clearAbsoluteDokaThrowKeepRemountPortalCredit(storage, 1);
    assert.equal(
      readAbsoluteDokaThrowKeepRemountPortalCredit(storage, 1),
      null,
    );
  });

  it("isolates character slots", () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    noteAbsoluteDokaThrowKeepRemountPortalCredit(storage, 2, 90);
    assert.deepEqual(readAbsoluteDokaThrowKeepRemountPortalCredit(storage, 1), {
      preDoka: PLAY_ENTRY_DOKA,
    });
    assert.deepEqual(readAbsoluteDokaThrowKeepRemountPortalCredit(storage, 2), {
      preDoka: 90,
    });
    clearAbsoluteDokaThrowKeepRemountPortalCredit(storage, 1);
    assert.equal(
      readAbsoluteDokaThrowKeepRemountPortalCredit(storage, 1),
      null,
    );
    assert.equal(hasAbsoluteDokaThrowKeepRemountPortalCredit(storage, 2), true);
  });
});

describe("dokaFromAbsoluteDokaThrowKeepRemountPortalCreditWalletRecord", () => {
  it("reads number, bigint, and { ok } wallet", () => {
    assert.equal(
      dokaFromAbsoluteDokaThrowKeepRemountPortalCreditWalletRecord(HEAL_DOKA),
      HEAL_DOKA,
    );
    assert.equal(
      dokaFromAbsoluteDokaThrowKeepRemountPortalCreditWalletRecord(
        BigInt(HEAL_DOKA),
      ),
      HEAL_DOKA,
    );
    assert.equal(
      dokaFromAbsoluteDokaThrowKeepRemountPortalCreditWalletRecord({
        ok: HEAL_DOKA,
      }),
      HEAL_DOKA,
    );
  });

  it("returns null for missing / non-numeric payloads", () => {
    assert.equal(
      dokaFromAbsoluteDokaThrowKeepRemountPortalCreditWalletRecord(null),
      null,
    );
    assert.equal(
      dokaFromAbsoluteDokaThrowKeepRemountPortalCreditWalletRecord("nope"),
      null,
    );
    assert.equal(
      dokaFromAbsoluteDokaThrowKeepRemountPortalCreditWalletRecord({}),
      null,
    );
  });
});

describe("shouldRefuseAbsoluteDokaThrowKeepRemountPortalCreditStaleDoka", () => {
  it("fail-closes when live still equals stamped preDoka", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountPortalCreditStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("fail-closes when live sits above stamped preDoka", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountPortalCreditStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA + 50,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("fail-closes when keep is set and live Doka is missing", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountPortalCreditStaleDoka({
        keep: true,
        liveDoka: null,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
    );
  });

  it("does not refuse a dropped heal wallet 190", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountPortalCreditStaleDoka({
        keep: true,
        liveDoka: HEAL_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });

  it("does not refuse a dropped shop wallet 150", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountPortalCreditStaleDoka({
        keep: true,
        liveDoka: SHOP_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });

  it("does not refuse when keep is unset", () => {
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountPortalCreditStaleDoka({
        keep: false,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      false,
    );
  });
});

describe("successful shop-throw keep then remount portal without unpaid death", () => {
  it("leftover remount portal commit keeps Play-entry Doka 200 while canister is 190", () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 / XP 100. Canister 200/100.
    // 2. Doka-heal saveBattleStats accepts 190 then throws. Catch rolls
    //    HUD back to 200. #964 stamps preDoka=200.
    //    #926 / #774 / #800 / #812 do not stamp this spend.
    // 3. Actor reconnect remounts. Lock Doka 200 / XP 100.
    // 4. Portal persistIncrementalRewards(0, 10) #ok newXp=110, newDoka=190.
    //    Production commits XP/level only. Lock Doka stays 200.
    const afterPortal = committedProgressAfterPortalWithAbsoluteDokaThrowKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: HEAL_DOKA,
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

  it("leftover shop after that portal writes Doka 150 over heal 190 (refunds the fee)", () => {
    const leftoverShop = leftoverShopWriteAfterPortalWithAbsoluteDokaThrowKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: HEAL_DOKA,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(leftoverShop, { xp: PORTAL_XP, doka: 150 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: HEAL_DOKA, xp: PORTAL_XP },
        leftoverShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 150, xp: PORTAL_XP },
      "incoming-below-stored writes 150 over heal 190 (refunds the 10 fee)",
    );
  });

  it("gated remount portal honour replica 190 so leftover shop writes 140", () => {
    const gatedShop = leftoverShopWriteAfterPortalWithAbsoluteDokaThrowKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: HEAL_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(gatedShop, { xp: PORTAL_XP, doka: 140 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: HEAL_DOKA, xp: PORTAL_XP },
        gatedShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 140, xp: PORTAL_XP },
    );
  });

  it("ungated leftover shop after shop-throw never-mints 150 over 150 (free leftover item)", () => {
    const leftoverShop = leftoverShopWriteAfterPortalWithAbsoluteDokaThrowKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: SHOP_DOKA,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(leftoverShop, { xp: PORTAL_XP, doka: 150 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: SHOP_DOKA, xp: PORTAL_XP },
        leftoverShop ?? { xp: 0, doka: 0 },
      ),
      { doka: SHOP_DOKA, xp: PORTAL_XP },
      "incoming-equal never-mints; leftover item still lands from lock 200",
    );
  });

  it("gated remount portal honour replica 150 so leftover shop charges the paid wallet", () => {
    const gatedShop = leftoverShopWriteAfterPortalWithAbsoluteDokaThrowKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: SHOP_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
      shopSpend: SHOP_SPEND,
    });
    assert.deepEqual(gatedShop, { xp: PORTAL_XP, doka: 100 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: SHOP_DOKA, xp: PORTAL_XP },
        gatedShop ?? { xp: 0, doka: 0 },
      ),
      { doka: 100, xp: PORTAL_XP },
    );
  });

  it("ungated leftover heal after shop-throw writes 190 over 150 (free heal, never-mint)", () => {
    const leftoverHeal = leftoverShopWriteAfterPortalWithAbsoluteDokaThrowKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: SHOP_DOKA,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
      shopSpend: HEAL_SPEND,
    });
    assert.deepEqual(leftoverHeal, { xp: PORTAL_XP, doka: 190 });
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: SHOP_DOKA, xp: PORTAL_XP },
        leftoverHeal ?? { xp: 0, doka: 0 },
      ),
      { doka: SHOP_DOKA, xp: PORTAL_XP },
      "incoming-above-stored never-mints; heal HP still applies",
    );
  });

  it("portal +10 XP still lands from applyRewards newXp", () => {
    const gated = committedProgressAfterPortalWithAbsoluteDokaThrowKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: HEAL_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
    });
    assert.equal(gated?.xp, PLAY_ENTRY_XP + PORTAL_TRANSITION_XP);
    assert.equal(gated?.doka, HEAL_DOKA);
  });
});

describe("sessionDokaAfterAbsoluteDokaThrowKeepRemountPortalCredit", () => {
  it("ungated remount wallet stays Play-entry 200 so leftover shop writes a lie", () => {
    const session = sessionDokaAfterAbsoluteDokaThrowKeepRemountPortalCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: HEAL_DOKA,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, PLAY_ENTRY_DOKA);
  });

  it("honour replica 190 so leftover shop matches the canister", () => {
    const session = sessionDokaAfterAbsoluteDokaThrowKeepRemountPortalCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: HEAL_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(session, HEAL_DOKA);
  });
});

describe("pickup-only remount portal still uses Play-entry Doka", () => {
  it("does not honour without a keep stamp", () => {
    const shop = leftoverShopWriteAfterPortalWithAbsoluteDokaThrowKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: HEAL_DOKA,
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

describe("unique vs heal/shop, death, rename, feat/GameKey, spend-keep portal", () => {
  it("heal/shop #964 would honour 190 before persistAbsoluteProgress", () => {
    assert.equal(
      dokaForAbsoluteDokaThrowKeepRemountPortalCredit({
        remountDoka: PLAY_ENTRY_DOKA,
        liveDoka: HEAL_DOKA,
        keep: true,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      HEAL_DOKA,
    );
  });

  it("rename #977 would debit replica 190, not Play-entry 200", () => {
    const honoured = dokaForAbsoluteDokaThrowKeepRemountPortalCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: HEAL_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(committedDokaAfterRename(honoured ?? 0), 90);
    assert.notEqual(
      committedDokaAfterRename(PLAY_ENTRY_DOKA),
      committedDokaAfterRename(honoured ?? 0),
    );
    assert.equal(RENAME_DOKA_COST, 100);
    assert.equal(committedDokaAfterRename(PLAY_ENTRY_DOKA), 100);
  });

  it("feat #1021 would add grant onto replica 190, not Play-entry 200", () => {
    const honoured = dokaForAbsoluteDokaThrowKeepRemountPortalCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: HEAL_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(
      committedDokaAfterAchievementCredit(honoured ?? 0, FEAT_GRANT),
      290,
    );
    assert.equal(
      committedDokaAfterAchievementCredit(PLAY_ENTRY_DOKA, FEAT_GRANT),
      300,
    );
  });

  it("GameKey #1021 would add 1000 onto replica 190, not Play-entry 200", () => {
    const honoured = dokaForAbsoluteDokaThrowKeepRemountPortalCredit({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: HEAL_DOKA,
      keep: true,
      stampedPreDoka: PLAY_ENTRY_DOKA,
    });
    assert.equal(
      committedDokaAfterGameKeyRedeem(honoured ?? 0, GAMEKEY_GRANT),
      1190,
    );
    assert.equal(
      committedDokaAfterGameKeyRedeem(PLAY_ENTRY_DOKA, GAMEKEY_GRANT),
      1200,
    );
  });

  it("leftover-XP one-shot #1092 is reverse order leftover XP — this is Doka spend", () => {
    const portalShop = leftoverShopWriteAfterPortalWithAbsoluteDokaThrowKeep({
      remountDoka: PLAY_ENTRY_DOKA,
      liveDoka: HEAL_DOKA,
      keep: false,
      stampedPreDoka: PLAY_ENTRY_DOKA,
      portalNewXp: PORTAL_XP,
      portalNewLevel: LEVEL,
      shopSpend: SHOP_SPEND,
    });
    assert.equal(portalShop?.xp, PORTAL_XP);
    assert.equal(portalShop?.doka, applySpendToCommitted(PLAY_ENTRY_DOKA, 50));
  });

  it("spend-keep × portal is #1153 (different stamp key)", () => {
    assert.notEqual(
      absoluteDokaThrowKeepRemountPortalCreditKey(1),
      "pbv_spend_keep_remount_slot1",
    );
    assert.equal(
      shouldRefuseAbsoluteDokaThrowKeepRemountPortalCreditStaleDoka({
        keep: true,
        liveDoka: PLAY_ENTRY_DOKA,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      true,
      "spend skip is live >= pre (Play-entry did not drop)",
    );
  });

  it("victory Doka keep × portal is #1129 (different stamp key, opposite skip)", () => {
    assert.notEqual(
      absoluteDokaThrowKeepRemountPortalCreditKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
  });
});

describe("persistPortalThroughAbsoluteDokaThrowKeepRemount", () => {
  it("adopts replica 190 then portal commits leftover+10 XP", async () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    const ok = await persistPortalThroughAbsoluteDokaThrowKeepRemount({
      persist,
      storage,
      slot: 1,
      readWallet: async () => HEAL_DOKA,
      applyAndCommit: async () => {
        applied = true;
        persist.commit({ xp: PORTAL_XP, level: LEVEL });
        return true;
      },
    });
    assert.equal(ok, true);
    assert.equal(applied, true);
    assert.equal(persist.snapshot().doka, HEAL_DOKA);
    assert.equal(persist.snapshot().xp, PORTAL_XP);
    assert.equal(
      hasAbsoluteDokaThrowKeepRemountPortalCredit(storage, 1),
      false,
      "clear the stamp after honour so leftover shop cannot reconstruct 200",
    );
  });

  it("throws and does not apply when live Doka is still Play-entry", async () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    let applied = false;
    await assert.rejects(
      () =>
        persistPortalThroughAbsoluteDokaThrowKeepRemount({
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
      hasAbsoluteDokaThrowKeepRemountPortalCredit(storage, 1),
      true,
      "fail-close keeps the stamp",
    );
  });

  it("throws when live wallet is missing", async () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistPortalThroughAbsoluteDokaThrowKeepRemount({
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
    assert.equal(hasAbsoluteDokaThrowKeepRemountPortalCredit(storage, 1), true);
  });

  it("throws when the wallet read throws", async () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    await assert.rejects(
      () =>
        persistPortalThroughAbsoluteDokaThrowKeepRemount({
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
    assert.equal(hasAbsoluteDokaThrowKeepRemountPortalCredit(storage, 1), true);
  });

  it("passthrough without a stamp still runs portal persist", async () => {
    const persist = remountLock();
    let applied = false;
    await persistPortalThroughAbsoluteDokaThrowKeepRemount({
      persist,
      storage: memStorage(),
      slot: 1,
      readWallet: async () => HEAL_DOKA,
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

describe("persistIncrementalRewardsThroughAbsoluteDokaThrowKeepRemount", () => {
  it("honours replica 190 then portal applyRewards commits leftover+10 XP, dokaDelta 0", async () => {
    const storage = memStorage();
    noteAbsoluteDokaThrowKeepRemountPortalCredit(storage, 1, PLAY_ENTRY_DOKA);
    const persist = remountLock();
    const canister = { doka: HEAL_DOKA, xp: PLAY_ENTRY_XP };
    const persisted =
      await persistIncrementalRewardsThroughAbsoluteDokaThrowKeepRemount({
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
        readWallet: async () => HEAL_DOKA,
      });
    assert.equal(persisted.newDoka, HEAL_DOKA);
    assert.equal(persisted.newXp, PORTAL_XP);
    assert.equal(canister.doka, HEAL_DOKA, "portal dokaDelta 0 must not mint");
    assert.equal(canister.xp, PORTAL_XP);
    assert.equal(persist.snapshot().doka, HEAL_DOKA);
    assert.equal(persist.snapshot().xp, PORTAL_XP);
    assert.equal(
      hasAbsoluteDokaThrowKeepRemountPortalCredit(storage, 1),
      false,
    );

    const leftoverShop = {
      xp: persist.snapshot().xp,
      doka: applySpendToCommitted(persist.snapshot().doka, SHOP_SPEND),
    };
    assert.deepEqual(
      canisterAfterAbsoluteWrite(
        { doka: canister.doka, xp: canister.xp },
        leftoverShop,
      ),
      { doka: 140, xp: PORTAL_XP },
    );
  });

  it("ungated portal (no stamp) commits XP while lock Doka stays Play-entry", async () => {
    const persist = remountLock();
    const canister = { doka: HEAL_DOKA, xp: PLAY_ENTRY_XP };
    await persistIncrementalRewardsThroughAbsoluteDokaThrowKeepRemount({
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
      readWallet: async () => HEAL_DOKA,
    });
    assert.equal(persist.snapshot().doka, PLAY_ENTRY_DOKA);
    assert.equal(persist.snapshot().xp, PORTAL_XP);
    assert.equal(canister.doka, HEAL_DOKA);
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
      "ungated leftover 150 refunds heal 190",
    );
  });
});

describe("dokaForAbsoluteDokaThrowKeepRemountPortalCredit", () => {
  it("returns remount wallet when keep is unset", () => {
    assert.equal(
      dokaForAbsoluteDokaThrowKeepRemountPortalCredit({
        remountDoka: PLAY_ENTRY_DOKA,
        liveDoka: HEAL_DOKA,
        keep: false,
        stampedPreDoka: PLAY_ENTRY_DOKA,
      }),
      PLAY_ENTRY_DOKA,
    );
  });

  it("returns null when keep is set and live is stale", () => {
    assert.equal(
      dokaForAbsoluteDokaThrowKeepRemountPortalCredit({
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
      leftoverShopWriteAfterPortalWithAbsoluteDokaThrowKeep({
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
