/**
 * #774 stamps remount Doka keep after handleBattleEnd
 * `resolveBattleRewards` / `applyRewards` throw-after-add
 * (`pbv_victory_doka_keep_remount_slotN`) and honours replica wallet on
 * remount **heal / shop** `persistAbsoluteProgress`. #869 honours that
 * stamp as the remount **death-cut** base. #979 honours replica as the
 * remount **rename / upgrade debit** base. #1028 honours it **before
 * feat / GameKey**. Those helpers never enter portal
 * `persistIncrementalRewards(0, PORTAL_TRANSITION_XP)`.
 *
 * Production portal persist commits `{ xp: persisted.newXp, level }`
 * only (`WorldExploration.tsx` generate path after white / rest /
 * rest-exit / Boss Rush early `return`s). `createProgressPersist` on
 * remount seeds GameFlow `dokaBalance` — HUD credit waits for `.then`
 * after `resolveBattleRewards` commit, and the throw-after-add catch
 * only `logDebugInfo`s, so that seed is still **200**.
 * `persistIncrementalRewards` dokaDelta 0 still returns canister
 * `newDoka` **250**, but production does not commit it. Seeded leftover
 * `persistAbsoluteProgress` does not fetch; a later Items Buy writes
 * Play-entry Doka and wipes the victory grant (`saveBattleStats`
 * incoming-below-stored). The battle already ended, so the grant cannot
 * be re-farmed. Portal `newXp` *does* land (applyRewards leftover +10),
 * so this is the Doka dual of leftover-XP × one-shot (#1099).
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
 *    GameFlow `dokaBalance` stays 200: HUD credit waits for commit, and
 *    `shouldApplyCallerDokaHydrate` ignores later wallet refetches while
 *    the world session is mounted.
 * 2. Victory `applyRewards(slot, 50, 80)` invokes then throws (canister
 *    250 / leftover 180). Catch only `logDebugInfo`s. Lock stays 200/100.
 *    No unpaid death. #774 stamps `{ preDoka: 200 }`. #774 / #869 /
 *    #979 / #1028 do not enter portal persist. Overworld portals stay
 *    live after remount.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance, xp: character.experience }` = **200 / 100**.
 *    Session unconfirmed flags are gone.
 * 4. Leftover #774: shop / heal honour replica 250. Leftover #869:
 *    death taxes replica. Leftover #979: rename / upgrade debit from
 *    replica. Leftover #1028: feat / GameKey add onto replica. Unique
 *    leftover: portal `persistIncrementalRewards(0, 10)` `#ok` commits
 *    leftover+10 XP **190** while lock Doka stays **200**. Leftover shop
 *    spend 50 writes `{ xp: 190, doka: 150 }` over canister
 *    `{ xp: 190, doka: 250 }` and wipes the +50 victory grant.
 *
 * Unique vs **#774** (heal/shop honour of this stamp), **#869** (death
 * honour), **#979** (rename/upgrade debit), **#1028** (feat / GameKey
 * additive — claim adds a granted Nat; portal dokaDelta is 0), **#767**
 * / **#1092** (portal XP throw `pbv_portal_xp_keep_remount_*` — XP
 * stamp, not this wallet), **#813** / **#1099** (leftover XP keep ×
 * one-shot — XP stamp, Doka-only settle), **#807** / **#1088** (victory
 * XP throw × one-shot), **#864** / **#1020** (Boss Rush Doka stamp),
 * **#800** / **#986** (one-shot Doka stamp), and **#657** (session
 * unconfirmed keep — not remount).
 *
 * This sidecar reads the same #774 stamp and honours replica wallet
 * onto the remount lock **before** portal persist so leftover shop
 * writes 250, not Play-entry 200. Stale live ≤ stamped `preDoka`
 * fail-closes (`applyRewards` only adds — a live wallet that did not
 * rise is stale or placeholder 0). Pickup-only portal (no stamp) still
 * commits leftover+10 XP with remount Doka.
 *
 * Do not stamp here — #774 notes keep after victory throw-after-add.
 * `dokaDelta <= 0` never stamps (portal / shrine / ground). Explicit
 * `applyRewards failed` never stamps. Do not restack WX /
 * progressPersist / deathPenalty / applyRewardsResult / rewardResolver /
 * achievementReward / shopPurchase / renameCharacter / spellUpgrade /
 * dokaPersist / #774 / #869 / #979 / #1028 / #767 / #1099 files.
 *
 * Tests reproduce remount portal vs the gated Doka honour. Restack
 * portal enqueue onto
 * `persistIncrementalRewardsThroughVictoryDokaKeepRemount` after #774
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
 * Same key as #774 `victoryDokaKeepRemountKey`. Remount portal honour
 * must read the victory throw-after-add stamp, not a second key and not
 * #767 / #1092 portal-throw XP keys, #813 / #1099 leftover-XP keys, or
 * #800 / #1029 one-shot Doka keys.
 */
export function victoryDokaKeepRemountPortalCreditKey(slot: number): string {
  return `pbv_victory_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type VictoryDokaKeepRemountPortalCreditStamp = {
  /** Lock wallet before the throw-after-add grant. */
  preDoka: number;
};

export function readVictoryDokaKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): VictoryDokaKeepRemountPortalCreditStamp | null {
  try {
    const raw = storage.getItem(victoryDokaKeepRemountPortalCreditKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<VictoryDokaKeepRemountPortalCreditStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeVictoryDokaKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: VictoryDokaKeepRemountPortalCreditStamp,
): void {
  try {
    storage.setItem(
      victoryDokaKeepRemountPortalCreditKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearVictoryDokaKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(victoryDokaKeepRemountPortalCreditKey(slot));
  } catch {
    // ignore
  }
}

export function hasVictoryDokaKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readVictoryDokaKeepRemountPortalCredit(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #774
 * `noteVictoryDokaKeepRemount` after victory throw-after-add.
 */
export function noteVictoryDokaKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeVictoryDokaKeepRemountPortalCredit(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

/**
 * `getCallerDokaBalance` wallet. Unwrap `{ ok }` bindgen Results, then
 * read a number or bigint the same way death-replay does.
 */
export function dokaFromVictoryDokaKeepPortalCreditWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromVictoryDokaKeepPortalCreditWalletRecord(
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
export function shouldRefuseVictoryDokaKeepRemountPortalCreditStaleDoka(args: {
  keep: boolean;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) <= toNat(args.stampedPreDoka);
}

/**
 * Honour remount Doka from replica when the #774 keep stamp says
 * victory already invoked. Stale Play-entry equal to stamped `preDoka`
 * must not fall back to remount wallet (that is the wipe: leftover shop
 * writes 200 over 250).
 */
export function dokaForVictoryDokaKeepRemountPortalCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseVictoryDokaKeepRemountPortalCreditStaleDoka({
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
export function sessionDokaAfterVictoryDokaKeepRemountPortalCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number {
  const honoured = dokaForVictoryDokaKeepRemountPortalCredit(args);
  return honoured == null ? toNat(args.remountDoka) : honoured;
}

/**
 * Production portal persist commits leftover+10 XP from applyRewards
 * `newXp` / `newLevel`. Doka stays whatever the remount lock holds
 * unless this sidecar honoured replica first.
 */
export function committedProgressAfterPortalWithVictoryDokaKeep(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  portalNewXp: number;
  portalNewLevel: number;
}): { doka: number; xp: number; level: number } | null {
  const doka = dokaForVictoryDokaKeepRemountPortalCredit(args);
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
 * victory Doka.
 */
export function leftoverShopWriteAfterPortalWithVictoryDokaKeep(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  portalNewXp: number;
  portalNewLevel: number;
  shopSpend: number;
}): { xp: number; doka: number } | null {
  const afterPortal = committedProgressAfterPortalWithVictoryDokaKeep(args);
  if (afterPortal == null) return null;
  return {
    xp: afterPortal.xp,
    doka: applySpendToCommitted(afterPortal.doka, args.shopSpend),
  };
}

function refuseStaleVictoryDokaKeepRemountPortalCredit(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type VictoryDokaKeepRemountPortalCreditPersist = {
  snapshot: () => { doka: number; xp: number; level: number };
  commit?: (next: { doka?: number; xp?: number; level?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * Portal remount wallet used Play-entry Doka 200 after a victory
 * applyRewards throw-after-add. Fetch `getCallerDokaBalance` when the
 * #774 remount keep stamp exists. Stale live ≤ stamped `preDoka` throws
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
export async function persistPortalThroughVictoryDokaKeepRemount<T>(args: {
  persist: VictoryDokaKeepRemountPortalCreditPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readVictoryDokaKeepRemountPortalCredit(
      args.storage,
      args.slot,
    );
    if (!stamp) return args.applyAndCommit();

    let liveDoka: number | null = null;
    try {
      liveDoka = dokaFromVictoryDokaKeepPortalCreditWalletRecord(
        await args.readWallet(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleVictoryDokaKeepRemountPortalCredit();
    }

    const honoured = dokaForVictoryDokaKeepRemountPortalCredit({
      remountDoka: toNat(args.persist.snapshot().doka),
      liveDoka,
      keep: true,
      stampedPreDoka: stamp.preDoka,
    });
    if (honoured == null) {
      refuseStaleVictoryDokaKeepRemountPortalCredit();
    }
    args.persist.commit?.({ doka: honoured });
    clearVictoryDokaKeepRemountPortalCredit(args.storage, args.slot);
    return args.applyAndCommit();
  });
}

/**
 * Production portal already enqueues, then `persistIncrementalRewards`
 * + `{ xp, level }` commit. Honour replica Doka first, then run that
 * body without a nested queue hop.
 */
export async function persistIncrementalRewardsThroughVictoryDokaKeepRemount(args: {
  // Same loose actor type as persistIncrementalRewards — Caffeine bindings vary.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actor: any;
  persist: VictoryDokaKeepRemountPortalCreditPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  dokaDelta: number;
  xpDelta: number;
  readWallet: () => Promise<unknown>;
}): Promise<ApplyRewardsOk> {
  return persistPortalThroughVictoryDokaKeepRemount({
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
