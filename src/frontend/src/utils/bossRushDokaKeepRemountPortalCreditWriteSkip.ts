/**
 * #864 stamps remount Doka keep after Boss Rush room-clear `applyRewards`
 * throw-after-add (`pbv_boss_rush_doka_keep_remount_slotN`) and honours
 * replica wallet on remount **heal / shop** `persistAbsoluteProgress`.
 * #866 honours that stamp as the remount **death-cut** base. #1020
 * honours replica as the remount **rename / upgrade debit** base. #1025
 * honours it **before feat / GameKey**. Those helpers never enter portal
 * `persistIncrementalRewards(0, PORTAL_TRANSITION_XP)`.
 *
 * Production portal persist commits `{ xp: persisted.newXp, level }`
 * only (`WorldExploration.tsx` 6815–6818). `createProgressPersist` on
 * remount seeds GameFlow `dokaBalance` — HUD credit waits for persist
 * commit then `creditLiveDoka`, and the throw-after-add catch only
 * `logDebugError`s, so that seed is still **200**.
 * `persistIncrementalRewards` dokaDelta 0 still returns canister
 * `newDoka` **700**, but production does not commit it. Seeded leftover
 * `persistAbsoluteProgress` does not fetch
 * (`resolveCommittedDokaForAbsoluteWrite` 390–391); a later Items Buy
 * writes Play-entry Doka and wipes the room-clear grant
 * (`saveBattleStats` incoming-below-stored). Room already advanced, so
 * the grant cannot be re-farmed. Portal `newXp` *does* land (Play-entry
 * leftover +10), so this is the Boss Rush dual of victory Doka keep ×
 * portal (#1129), one-shot Doka keep × portal (#1145), GameKey Doka
 * keep × portal (#1147), and feat Doka keep × portal (#1149).
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
 *    GameFlow `dokaBalance` stays 200: HUD credit waits for persist
 *    commit then `creditLiveDoka`, and `shouldApplyCallerDokaHydrate`
 *    ignores later wallet refetches while the world session is mounted.
 * 2. Room 0 clear writes `currentRoom` first, then
 *    `applyRewards(slot, 500, xp)` adds 500 (canister 700) then throws
 *    transport. Commit never runs. Catch only logs. Lock stays 200/100.
 *    No unpaid death. #864 stamps `{ preDoka: 200 }`. #864 / #866 /
 *    #1020 / #1025 do not enter portal persist. Overworld portals stay
 *    live after remount.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance, xp: character.experience }` = **200 / 100**.
 *    Session unconfirmed flags are gone.
 * 4. Leftover #864: shop / heal honour replica 700. Leftover #866:
 *    death taxes replica. Leftover #1020: rename / upgrade debit from
 *    replica. Leftover #1025: feat / GameKey add onto replica. Unique
 *    leftover: portal `persistIncrementalRewards(0, 10)` `#ok` commits
 *    leftover+10 XP **110** while lock Doka stays **200**. Leftover shop
 *    spend 50 writes `{ xp: 110, doka: 150 }` over canister
 *    `{ xp: 110, doka: 700 }` and wipes the +500 room-clear grant.
 *
 * Unique vs **#864** (heal/shop honour of this stamp), **#866** (death
 * honour), **#1020** (rename/upgrade debit), **#1025** (feat / GameKey
 * additive — claim adds a granted Nat; portal dokaDelta is 0), **#1129**
 * (victory Doka `pbv_victory_doka_keep_remount_*` × portal — different
 * stamp; handleBattleEnd never runs during a Rush), **#1145** (one-shot
 * Doka `pbv_oneshot_doka_keep_remount_*` × portal — shrine/ground
 * pickup, not room-clear), **#1147** (GameKey Doka
 * `pbv_gamekey_doka_keep_remount_*` × portal — `redeemGameKey`),
 * **#1149** (feat Doka `pbv_feat_doka_keep_remount_*` × portal —
 * `claimAchievementReward`, not Boss Rush), **#767** / **#1092**
 * (portal XP throw then leftover-XP — reverse order, leftover **XP**),
 * **#813** / **#1099** (leftover XP keep × one-shot — XP stamp,
 * Doka-only settle), **#812** / **#1032** (feat Doka stamp), **#811** /
 * **#1031** (GameKey Doka stamp), and **#657** (session unconfirmed
 * keep — not remount).
 *
 * This sidecar reads the same #864 stamp and honours replica wallet
 * onto the remount lock **before** portal persist so leftover shop
 * writes 700, not Play-entry 200. Stale live ≤ stamped `preDoka`
 * fail-closes (`applyRewards` only adds — a live wallet that did not
 * rise is stale or placeholder 0). Pickup-only portal (no stamp) still
 * commits leftover+10 XP with remount Doka.
 *
 * Do not stamp here — #864 notes keep after Boss Rush throw-after-add.
 * `dokaDelta <= 0` never stamps (portal). Explicit `applyRewards failed`
 * never stamps (canister did not add). A progress-only reject never
 * invoked `applyRewards`. Do not restack WX / progressPersist /
 * deathPenalty / applyRewardsResult / rewardResolver /
 * bossRushProgress / shopPurchase / renameCharacter / spellUpgrade /
 * dokaPersist / #864 / #866 / #1020 / #1025 / #1129 / #1145 / #1147 /
 * #1149 files.
 *
 * Tests reproduce remount portal vs the gated Doka honour. Restack
 * portal enqueue onto
 * `persistIncrementalRewardsThroughBossRushDokaKeepRemount` after #864
 * lands. No Motoko.
 */

import {
  type ApplyRewardsOk,
  persistIncrementalRewards,
} from "./applyRewardsResult.ts";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
} from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

/**
 * Same key as #864 `bossRushDokaKeepRemountKey`. Remount portal honour
 * must read the Boss Rush throw-after-add stamp, not a second key and
 * not #1129 victory Doka keys, #1145 one-shot Doka keys, #1147 GameKey
 * Doka keys, #1149 feat Doka keys, #767 / #1092 portal-throw XP keys,
 * or #813 / #1099 leftover-XP keys.
 */
export function bossRushDokaKeepRemountPortalCreditKey(slot: number): string {
  return `pbv_boss_rush_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type BossRushDokaKeepRemountPortalCreditStamp = {
  /** Lock wallet before the throw-after-add grant. */
  preDoka: number;
};

export function readBossRushDokaKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): BossRushDokaKeepRemountPortalCreditStamp | null {
  try {
    const raw = storage.getItem(bossRushDokaKeepRemountPortalCreditKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<BossRushDokaKeepRemountPortalCreditStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeBossRushDokaKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: BossRushDokaKeepRemountPortalCreditStamp,
): void {
  try {
    storage.setItem(
      bossRushDokaKeepRemountPortalCreditKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearBossRushDokaKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(bossRushDokaKeepRemountPortalCreditKey(slot));
  } catch {
    // ignore
  }
}

export function hasBossRushDokaKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readBossRushDokaKeepRemountPortalCredit(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #864
 * `noteBossRushDokaKeepRemount` after Boss Rush throw-after-add.
 */
export function noteBossRushDokaKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeBossRushDokaKeepRemountPortalCredit(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

/**
 * `getCallerDokaBalance` wallet. Unwrap `{ ok }` bindgen Results, then
 * read a number or bigint the same way death-replay does.
 */
export function dokaFromBossRushDokaKeepPortalCreditWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromBossRushDokaKeepPortalCreditWalletRecord(
      (raw as { ok: unknown }).ok,
    );
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return toNat(n);
}

/**
 * Stale Play-entry / session cache still equals or sits below the
 * pre-keep lock. `applyRewards` only adds, so a live wallet that did
 * not rise is stale (or placeholder 0). Missing live is fail-closed
 * only when a keep stamp exists.
 */
export function shouldRefuseBossRushDokaKeepRemountPortalCreditStaleDoka(args: {
  keep: boolean;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) <= toNat(args.stampedPreDoka);
}

/**
 * Honour remount Doka from replica when the #864 keep stamp says Boss
 * Rush already invoked. Stale Play-entry equal to stamped `preDoka`
 * must not fall back to remount wallet (that is the wipe: leftover shop
 * writes 200 over 700).
 */
export function dokaForBossRushDokaKeepRemountPortalCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseBossRushDokaKeepRemountPortalCreditStaleDoka({
      keep: args.keep,
      liveDoka: args.liveDoka,
      stampedPreDoka: args.stampedPreDoka,
    })
  ) {
    return null;
  }
  if (args.keep === true) {
    return args.liveDoka == null ? null : toNat(args.liveDoka);
  }
  return toNat(args.remountDoka);
}

/**
 * Session wallet after remount. Ungated Play-entry 200 still looks like
 * the pre-grant wallet so leftover shop writes a lie. Honour replica so
 * persistAbsoluteProgress writes 700.
 */
export function sessionDokaAfterBossRushDokaKeepRemountPortalCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number {
  const honoured = dokaForBossRushDokaKeepRemountPortalCredit(args);
  return honoured == null ? toNat(args.remountDoka) : honoured;
}

/**
 * Production portal persist commits leftover+10 XP from applyRewards
 * `newXp` / `newLevel`. Doka stays whatever the remount lock holds
 * unless this sidecar honoured replica first.
 */
export function committedProgressAfterPortalWithBossRushDokaKeep(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  portalNewXp: number;
  portalNewLevel: number;
}): { doka: number; xp: number; level: number } | null {
  const doka = dokaForBossRushDokaKeepRemountPortalCredit(args);
  if (doka == null) return null;
  return {
    doka,
    xp: toNat(args.portalNewXp),
    level: Math.max(1, toNat(args.portalNewLevel)),
  };
}

/**
 * Leftover shop after the remount portal. Portal persist only commits
 * XP / level; leftover shop `persistAbsoluteProgress` writes
 * `committed.doka`. Ungated writes Play-entry Doka over canister Boss
 * Rush Doka.
 */
export function leftoverShopWriteAfterPortalWithBossRushDokaKeep(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  portalNewXp: number;
  portalNewLevel: number;
  shopSpend: number;
}): { xp: number; doka: number } | null {
  const afterPortal = committedProgressAfterPortalWithBossRushDokaKeep(args);
  if (afterPortal == null) return null;
  return {
    xp: afterPortal.xp,
    doka: applySpendToCommitted(afterPortal.doka, args.shopSpend),
  };
}

function refuseStaleBossRushDokaKeepRemountPortalCredit(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type BossRushDokaKeepRemountPortalCreditPersist = {
  snapshot: () => { doka: number; xp: number; level: number };
  commit?: (next: { doka?: number; xp?: number; level?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * Portal remount wallet used Play-entry Doka 200 after a Boss Rush
 * room-clear throw-after-add. Fetch `getCallerDokaBalance` when the
 * #864 remount keep stamp exists. Stale live ≤ stamped `preDoka`
 * throws so leftover shop cannot write Play-entry Doka. Fresh replica
 * is adopted onto the lock **before** `applyAndCommit` so production
 * leftover shop writes 700, not 200. Portal still commits XP / level
 * from applyRewards `newXp` (this sidecar does not reconstruct an XP
 * keep — that is #767 / #813 / #807).
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry Doka again. Fail-close keeps the stamp. Do not skip
 * the canister portal +10 — applyRewards already added leftover XP.
 */
export async function persistPortalThroughBossRushDokaKeepRemount<T>(args: {
  persist: BossRushDokaKeepRemountPortalCreditPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readBossRushDokaKeepRemountPortalCredit(
      args.storage,
      args.slot,
    );
    if (!stamp) return args.applyAndCommit();

    let liveDoka: number | null = null;
    try {
      liveDoka = dokaFromBossRushDokaKeepPortalCreditWalletRecord(
        await args.readWallet(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleBossRushDokaKeepRemountPortalCredit();
    }

    const honoured = dokaForBossRushDokaKeepRemountPortalCredit({
      remountDoka: toNat(args.persist.snapshot().doka),
      liveDoka,
      keep: true,
      stampedPreDoka: stamp.preDoka,
    });
    if (honoured == null) {
      refuseStaleBossRushDokaKeepRemountPortalCredit();
    }
    args.persist.commit?.({ doka: honoured });
    clearBossRushDokaKeepRemountPortalCredit(args.storage, args.slot);
    return args.applyAndCommit();
  });
}

/**
 * Production portal already enqueues, then `persistIncrementalRewards`
 * + `{ xp, level }` commit. Honour replica Doka first, then run that
 * body without a nested queue hop.
 */
export async function persistIncrementalRewardsThroughBossRushDokaKeepRemount(args: {
  // Same loose actor type as persistIncrementalRewards — Caffeine bindings vary.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actor: any;
  persist: BossRushDokaKeepRemountPortalCreditPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  dokaDelta: number;
  xpDelta: number;
  readWallet: () => Promise<unknown>;
}): Promise<ApplyRewardsOk> {
  return persistPortalThroughBossRushDokaKeepRemount({
    persist: args.persist,
    storage: args.storage,
    slot: args.slot,
    readWallet: args.readWallet,
    applyAndCommit: async () => {
      const persisted = await persistIncrementalRewards(
        args.actor,
        args.slot,
        args.dokaDelta,
        args.xpDelta,
      );
      args.persist.commit?.({
        xp: persisted.newXp,
        level: persisted.newLevel,
      });
      return persisted;
    },
  });
}
