/**
 * #800 stamps remount Doka keep after shrine / ground / dungeon-complete
 * `persistDokaCreditResult` transport-keep (`pbv_oneshot_doka_keep_remount_slotN`)
 * and honours replica wallet on remount **heal / shop**
 * `persistAbsoluteProgress`. #877 honours that stamp as the remount
 * **death-cut** base. #986 honours replica as the remount **rename /
 * upgrade debit** base. #1029 honours it **before feat / GameKey**.
 * Those helpers never enter portal
 * `persistIncrementalRewards(0, PORTAL_TRANSITION_XP)`.
 *
 * Production portal persist commits `{ xp: persisted.newXp, level }`
 * only (`WorldExploration.tsx` 6815–6818). `createProgressPersist` on
 * remount seeds GameFlow `dokaBalance` — HUD credit waits for settle
 * `commit`, and one-shot transport-keep only `noteUnconfirmedCredit`s
 * on the dying session lock, so that seed is still **200**.
 * `persistIncrementalRewards` dokaDelta 0 still returns canister
 * `newDoka` **250**, but production does not commit it. Seeded leftover
 * `persistAbsoluteProgress` does not fetch (`resolveCommittedDokaForAbsoluteWrite`
 * 390–391); a later Items Buy writes Play-entry Doka and wipes the
 * pickup grant (`saveBattleStats` incoming-below-stored). The one-shot
 * id is already claimed, so the grant cannot be re-farmed. Portal
 * `newXp` *does* land (Play-entry leftover +10), so this is the Doka
 * dual of leftover-XP × one-shot (#1099) and the one-shot dual of
 * victory Doka keep × portal (#1129).
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
 *    GameFlow `dokaBalance` stays 200: HUD credit waits for settle
 *    commit, and `shouldApplyCallerDokaHydrate` ignores later wallet
 *    refetches while the world session is mounted.
 * 2. Ground / shrine `applyRewards(slot, 50, 0)` invokes then throws
 *    transport (canister 250 / XP 100). Confirm still reads 200.
 *    `settle` is `keep`. `settleOneShotPersistLock` notes unconfirmed
 *    on the session lock. No unpaid death. #800 stamps `{ preDoka: 200 }`.
 *    #800 / #877 / #986 / #1029 do not enter portal persist. Overworld
 *    portals stay live after remount.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance, xp: character.experience }` = **200 / 100**.
 *    Session unconfirmed flags are gone.
 * 4. Leftover #800: shop / heal honour replica 250. Leftover #877:
 *    death taxes replica. Leftover #986: rename / upgrade debit from
 *    replica. Leftover #1029: feat / GameKey add onto replica. Unique
 *    leftover: portal `persistIncrementalRewards(0, 10)` `#ok` commits
 *    leftover+10 XP **110** while lock Doka stays **200**. Leftover shop
 *    spend 50 writes `{ xp: 110, doka: 150 }` over canister
 *    `{ xp: 110, doka: 250 }` and wipes the +50 pickup grant.
 *
 * Unique vs **#800** (heal/shop honour of this stamp), **#877** (death
 * honour), **#986** (rename/upgrade debit), **#1029** (feat / GameKey
 * additive — claim adds a granted Nat; portal dokaDelta is 0), **#1129**
 * (victory Doka `pbv_victory_doka_keep_remount_*` × portal — different
 * stamp), **#767** / **#1092** (portal XP throw then one-shot — reverse
 * order, leftover **XP**), **#813** / **#1099** (leftover XP keep ×
 * one-shot — XP stamp, Doka-only settle), **#774** / **#1088** (victory
 * Doka / XP throw), **#864** / **#1020** (Boss Rush Doka stamp), and
 * **#657** (session unconfirmed keep — not remount).
 *
 * This sidecar reads the same #800 stamp and honours replica wallet
 * onto the remount lock **before** portal persist so leftover shop
 * writes 250, not Play-entry 200. Stale live ≤ stamped `preDoka`
 * fail-closes (`applyRewards` only adds — a live wallet that did not
 * rise is stale or placeholder 0). Pickup-only portal (no stamp) still
 * commits leftover+10 XP with remount Doka.
 *
 * Do not stamp here — #800 notes keep after one-shot transport-keep.
 * `dokaDelta <= 0` never stamps (portal). Explicit `applyRewards failed`
 * is settle `release` and never stamps. Do not restack WX /
 * progressPersist / deathPenalty / applyRewardsResult / rewardResolver /
 * achievementReward / shopPurchase / renameCharacter / spellUpgrade /
 * dokaPersist / #800 / #877 / #986 / #1029 / #767 / #1092 / #1099 /
 * #1129 files.
 *
 * Tests reproduce remount portal vs the gated Doka honour. Restack
 * portal enqueue onto
 * `persistIncrementalRewardsThroughOneShotDokaKeepRemount` after #800
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
 * Same key as #800 `oneShotDokaKeepRemountKey`. Remount portal honour
 * must read the one-shot transport-keep stamp, not a second key and not
 * #767 / #1092 portal-throw XP keys, #813 / #1099 leftover-XP keys, or
 * #774 / #1129 victory Doka keys.
 */
export function oneShotDokaKeepRemountPortalCreditKey(slot: number): string {
  return `pbv_oneshot_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type OneShotDokaKeepRemountPortalCreditStamp = {
  /** Lock wallet before the transport-keep grant. */
  preDoka: number;
};

export function readOneShotDokaKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): OneShotDokaKeepRemountPortalCreditStamp | null {
  try {
    const raw = storage.getItem(oneShotDokaKeepRemountPortalCreditKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<OneShotDokaKeepRemountPortalCreditStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeOneShotDokaKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: OneShotDokaKeepRemountPortalCreditStamp,
): void {
  try {
    storage.setItem(
      oneShotDokaKeepRemountPortalCreditKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearOneShotDokaKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(oneShotDokaKeepRemountPortalCreditKey(slot));
  } catch {
    // ignore
  }
}

export function hasOneShotDokaKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readOneShotDokaKeepRemountPortalCredit(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #800
 * `noteOneShotDokaKeepRemount` after one-shot transport-keep.
 */
export function noteOneShotDokaKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeOneShotDokaKeepRemountPortalCredit(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

/**
 * `getCallerDokaBalance` wallet. Unwrap `{ ok }` bindgen Results, then
 * read a number or bigint the same way death-replay does.
 */
export function dokaFromOneShotDokaKeepPortalCreditWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromOneShotDokaKeepPortalCreditWalletRecord(
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
export function shouldRefuseOneShotDokaKeepRemountPortalCreditStaleDoka(args: {
  keep: boolean;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) <= toNat(args.stampedPreDoka);
}

/**
 * Honour remount Doka from replica when the #800 keep stamp says
 * one-shot already invoked. Stale Play-entry equal to stamped `preDoka`
 * must not fall back to remount wallet (that is the wipe: leftover shop
 * writes 200 over 250).
 */
export function dokaForOneShotDokaKeepRemountPortalCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseOneShotDokaKeepRemountPortalCreditStaleDoka({
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
 * persistAbsoluteProgress writes 250.
 */
export function sessionDokaAfterOneShotDokaKeepRemountPortalCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number {
  const honoured = dokaForOneShotDokaKeepRemountPortalCredit(args);
  return honoured == null ? toNat(args.remountDoka) : honoured;
}

/**
 * Production portal persist commits leftover+10 XP from applyRewards
 * `newXp` / `newLevel`. Doka stays whatever the remount lock holds
 * unless this sidecar honoured replica first.
 */
export function committedProgressAfterPortalWithOneShotDokaKeep(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  portalNewXp: number;
  portalNewLevel: number;
}): { doka: number; xp: number; level: number } | null {
  const doka = dokaForOneShotDokaKeepRemountPortalCredit(args);
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
 * `committed.doka`. Ungated writes Play-entry Doka over canister
 * pickup Doka.
 */
export function leftoverShopWriteAfterPortalWithOneShotDokaKeep(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  portalNewXp: number;
  portalNewLevel: number;
  shopSpend: number;
}): { xp: number; doka: number } | null {
  const afterPortal = committedProgressAfterPortalWithOneShotDokaKeep(args);
  if (afterPortal == null) return null;
  return {
    xp: afterPortal.xp,
    doka: applySpendToCommitted(afterPortal.doka, args.shopSpend),
  };
}

function refuseStaleOneShotDokaKeepRemountPortalCredit(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type OneShotDokaKeepRemountPortalCreditPersist = {
  snapshot: () => { doka: number; xp: number; level: number };
  commit?: (next: { doka?: number; xp?: number; level?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * Portal remount wallet used Play-entry Doka 200 after a one-shot
 * applyRewards transport-keep. Fetch `getCallerDokaBalance` when the
 * #800 remount keep stamp exists. Stale live ≤ stamped `preDoka` throws
 * so leftover shop cannot write Play-entry Doka. Fresh replica is
 * adopted onto the lock **before** `applyAndCommit` so production
 * leftover shop writes 250, not 200. Portal still commits XP / level
 * from applyRewards `newXp` (this sidecar does not reconstruct an XP
 * keep — that is #767 / #813 / #807).
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry Doka again. Fail-close keeps the stamp. Do not skip
 * the canister portal +10 — applyRewards already added leftover XP.
 */
export async function persistPortalThroughOneShotDokaKeepRemount<T>(args: {
  persist: OneShotDokaKeepRemountPortalCreditPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readOneShotDokaKeepRemountPortalCredit(
      args.storage,
      args.slot,
    );
    if (!stamp) return args.applyAndCommit();

    let liveDoka: number | null = null;
    try {
      liveDoka = dokaFromOneShotDokaKeepPortalCreditWalletRecord(
        await args.readWallet(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleOneShotDokaKeepRemountPortalCredit();
    }

    const honoured = dokaForOneShotDokaKeepRemountPortalCredit({
      remountDoka: toNat(args.persist.snapshot().doka),
      liveDoka,
      keep: true,
      stampedPreDoka: stamp.preDoka,
    });
    if (honoured == null) {
      refuseStaleOneShotDokaKeepRemountPortalCredit();
    }
    args.persist.commit?.({ doka: honoured });
    clearOneShotDokaKeepRemountPortalCredit(args.storage, args.slot);
    return args.applyAndCommit();
  });
}

/**
 * Production portal already enqueues, then `persistIncrementalRewards`
 * + `{ xp, level }` commit. Honour replica Doka first, then run that
 * body without a nested queue hop.
 */
export async function persistIncrementalRewardsThroughOneShotDokaKeepRemount(args: {
  // Same loose actor type as persistIncrementalRewards — Caffeine bindings vary.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actor: any;
  persist: OneShotDokaKeepRemountPortalCreditPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  dokaDelta: number;
  xpDelta: number;
  readWallet: () => Promise<unknown>;
}): Promise<ApplyRewardsOk> {
  return persistPortalThroughOneShotDokaKeepRemount({
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
