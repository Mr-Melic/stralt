/**
 * #811 stamps remount Doka keep after shop `redeemGameKey` throw-after-add
 * (`pbv_gamekey_doka_keep_remount_slotN`) and honours replica wallet on
 * remount **heal / shop** `persistAbsoluteProgress`. #900 honours that
 * stamp as the remount **death-cut** base. #1019 honours replica as the
 * remount **rename / upgrade debit** base. #1031 honours it **before
 * feat / GameKey**. Those helpers never enter portal
 * `persistIncrementalRewards(0, PORTAL_TRANSITION_XP)`.
 *
 * Production portal persist commits `{ xp: persisted.newXp, level }`
 * only (`WorldExploration.tsx` 6815–6818). `createProgressPersist` on
 * remount seeds GameFlow `dokaBalance` — HUD credit waits for parsed
 * `#ok`, and the throw-after-add catch only toasts, so that seed is
 * still **200**. `persistIncrementalRewards` dokaDelta 0 still returns
 * canister `newDoka` **1200**, but production does not commit it.
 * Seeded leftover `persistAbsoluteProgress` does not fetch
 * (`resolveCommittedDokaForAbsoluteWrite` 390–391); a later Items Buy
 * writes Play-entry Doka and wipes the paid grant (`saveBattleStats`
 * incoming-below-stored). Retry hits "GameKey already used", so the
 * grant cannot be re-farmed. Portal `newXp` *does* land (Play-entry
 * leftover +10), so this is the GameKey dual of victory Doka keep ×
 * portal (#1129) and one-shot Doka keep × portal (#1145).
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
 *    GameFlow `dokaBalance` stays 200: HUD credit waits for parsed
 *    `#ok` then `onDokaCredited`, and `shouldApplyCallerDokaHydrate`
 *    ignores later wallet refetches while the world session is mounted.
 * 2. Shop `redeemGameKey` adds 1000 (canister 1200) then throws
 *    transport. `#ok` is never parsed. Commit never runs. Catch only
 *    toasts "Redeem failed". Lock stays 200/100. No unpaid death.
 *    #811 stamps `{ preDoka: 200 }`. #811 / #900 / #1019 / #1031 do
 *    not enter portal persist. Overworld portals stay live after remount.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance, xp: character.experience }` = **200 / 100**.
 *    Session unconfirmed flags are gone.
 * 4. Leftover #811: shop / heal honour replica 1200. Leftover #900:
 *    death taxes replica. Leftover #1019: rename / upgrade debit from
 *    replica. Leftover #1031: feat / GameKey add onto replica. Unique
 *    leftover: portal `persistIncrementalRewards(0, 10)` `#ok` commits
 *    leftover+10 XP **110** while lock Doka stays **200**. Leftover shop
 *    spend 50 writes `{ xp: 110, doka: 150 }` over canister
 *    `{ xp: 110, doka: 1200 }` and wipes the +1000 paid grant.
 *
 * Unique vs **#811** (heal/shop honour of this stamp), **#900** (death
 * honour), **#1019** (rename/upgrade debit), **#1031** (feat / GameKey
 * additive — claim adds a granted Nat; portal dokaDelta is 0), **#1129**
 * (victory Doka `pbv_victory_doka_keep_remount_*` × portal — different
 * stamp), **#1145** (one-shot Doka `pbv_oneshot_doka_keep_remount_*` ×
 * portal — `applyRewards` pickup, not `redeemGameKey`), **#767** /
 * **#1092** (portal XP throw then leftover-XP — reverse order, leftover
 * **XP**), **#813** / **#1099** (leftover XP keep × one-shot — XP stamp,
 * Doka-only settle), **#864** / **#1020** (Boss Rush Doka stamp),
 * **#812** / **#1032** (feat Doka stamp), and **#657** (session
 * unconfirmed keep — not remount).
 *
 * This sidecar reads the same #811 stamp and honours replica wallet
 * onto the remount lock **before** portal persist so leftover shop
 * writes 1200, not Play-entry 200. Stale live ≤ stamped `preDoka`
 * fail-closes (`redeemGameKey` only adds — a live wallet that did not
 * rise is stale or placeholder 0). Pickup-only portal (no stamp) still
 * commits leftover+10 XP with remount Doka.
 *
 * Do not stamp here — #811 notes keep after GameKey throw-after-add.
 * `dokaDelta <= 0` never stamps (portal). Explicit `already used` /
 * `Invalid GameKey` / `redeemGameKey failed` never stamps. Do not
 * restack WX / progressPersist / deathPenalty / applyRewardsResult /
 * rewardResolver / achievementReward / shopPurchase / renameCharacter /
 * spellUpgrade / dokaPersist / DokaGameKeyShop / #811 / #900 / #1019 /
 * #1031 / #1129 / #1145 files.
 *
 * Tests reproduce remount portal vs the gated Doka honour. Restack
 * portal enqueue onto
 * `persistIncrementalRewardsThroughGameKeyDokaKeepRemount` after #811
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
 * Same key as #811 `gameKeyDokaKeepRemountKey`. Remount portal honour
 * must read the GameKey throw-after-add stamp, not a second key and not
 * #1129 victory Doka keys, #1145 one-shot Doka keys, #767 / #1092
 * portal-throw XP keys, or #813 / #1099 leftover-XP keys.
 */
export function gameKeyDokaKeepRemountPortalCreditKey(slot: number): string {
  return `pbv_gamekey_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type GameKeyDokaKeepRemountPortalCreditStamp = {
  /** Lock wallet before the throw-after-add grant. */
  preDoka: number;
};

export function readGameKeyDokaKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): GameKeyDokaKeepRemountPortalCreditStamp | null {
  try {
    const raw = storage.getItem(gameKeyDokaKeepRemountPortalCreditKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<GameKeyDokaKeepRemountPortalCreditStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeGameKeyDokaKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: GameKeyDokaKeepRemountPortalCreditStamp,
): void {
  try {
    storage.setItem(
      gameKeyDokaKeepRemountPortalCreditKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearGameKeyDokaKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(gameKeyDokaKeepRemountPortalCreditKey(slot));
  } catch {
    // ignore
  }
}

export function hasGameKeyDokaKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readGameKeyDokaKeepRemountPortalCredit(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #811
 * `noteGameKeyDokaKeepRemount` after GameKey throw-after-add.
 */
export function noteGameKeyDokaKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeGameKeyDokaKeepRemountPortalCredit(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

/**
 * `getCallerDokaBalance` wallet. Unwrap `{ ok }` bindgen Results, then
 * read a number or bigint the same way death-replay does.
 */
export function dokaFromGameKeyDokaKeepPortalCreditWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromGameKeyDokaKeepPortalCreditWalletRecord(
      (raw as { ok: unknown }).ok,
    );
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return toNat(n);
}

/**
 * Stale Play-entry / session cache still equals or sits below the
 * pre-keep lock. `redeemGameKey` only adds, so a live wallet that did
 * not rise is stale (or placeholder 0). Missing live is fail-closed
 * only when a keep stamp exists.
 */
export function shouldRefuseGameKeyDokaKeepRemountPortalCreditStaleDoka(args: {
  keep: boolean;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) <= toNat(args.stampedPreDoka);
}

/**
 * Honour remount Doka from replica when the #811 keep stamp says
 * GameKey already invoked. Stale Play-entry equal to stamped `preDoka`
 * must not fall back to remount wallet (that is the wipe: leftover shop
 * writes 200 over 1200).
 */
export function dokaForGameKeyDokaKeepRemountPortalCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseGameKeyDokaKeepRemountPortalCreditStaleDoka({
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
 * persistAbsoluteProgress writes 1200.
 */
export function sessionDokaAfterGameKeyDokaKeepRemountPortalCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number {
  const honoured = dokaForGameKeyDokaKeepRemountPortalCredit(args);
  return honoured == null ? toNat(args.remountDoka) : honoured;
}

/**
 * Production portal persist commits leftover+10 XP from applyRewards
 * `newXp` / `newLevel`. Doka stays whatever the remount lock holds
 * unless this sidecar honoured replica first.
 */
export function committedProgressAfterPortalWithGameKeyDokaKeep(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  portalNewXp: number;
  portalNewLevel: number;
}): { doka: number; xp: number; level: number } | null {
  const doka = dokaForGameKeyDokaKeepRemountPortalCredit(args);
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
 * GameKey Doka.
 */
export function leftoverShopWriteAfterPortalWithGameKeyDokaKeep(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  portalNewXp: number;
  portalNewLevel: number;
  shopSpend: number;
}): { xp: number; doka: number } | null {
  const afterPortal = committedProgressAfterPortalWithGameKeyDokaKeep(args);
  if (afterPortal == null) return null;
  return {
    xp: afterPortal.xp,
    doka: applySpendToCommitted(afterPortal.doka, args.shopSpend),
  };
}

function refuseStaleGameKeyDokaKeepRemountPortalCredit(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type GameKeyDokaKeepRemountPortalCreditPersist = {
  snapshot: () => { doka: number; xp: number; level: number };
  commit?: (next: { doka?: number; xp?: number; level?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * Portal remount wallet used Play-entry Doka 200 after a GameKey
 * redeem throw-after-add. Fetch `getCallerDokaBalance` when the #811
 * remount keep stamp exists. Stale live ≤ stamped `preDoka` throws
 * so leftover shop cannot write Play-entry Doka. Fresh replica is
 * adopted onto the lock **before** `applyAndCommit` so production
 * leftover shop writes 1200, not 200. Portal still commits XP / level
 * from applyRewards `newXp` (this sidecar does not reconstruct an XP
 * keep — that is #767 / #813 / #807).
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry Doka again. Fail-close keeps the stamp. Do not skip
 * the canister portal +10 — applyRewards already added leftover XP.
 */
export async function persistPortalThroughGameKeyDokaKeepRemount<T>(args: {
  persist: GameKeyDokaKeepRemountPortalCreditPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readGameKeyDokaKeepRemountPortalCredit(
      args.storage,
      args.slot,
    );
    if (!stamp) return args.applyAndCommit();

    let liveDoka: number | null = null;
    try {
      liveDoka = dokaFromGameKeyDokaKeepPortalCreditWalletRecord(
        await args.readWallet(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleGameKeyDokaKeepRemountPortalCredit();
    }

    const honoured = dokaForGameKeyDokaKeepRemountPortalCredit({
      remountDoka: toNat(args.persist.snapshot().doka),
      liveDoka,
      keep: true,
      stampedPreDoka: stamp.preDoka,
    });
    if (honoured == null) {
      refuseStaleGameKeyDokaKeepRemountPortalCredit();
    }
    args.persist.commit?.({ doka: honoured });
    clearGameKeyDokaKeepRemountPortalCredit(args.storage, args.slot);
    return args.applyAndCommit();
  });
}

/**
 * Production portal already enqueues, then `persistIncrementalRewards`
 * + `{ xp, level }` commit. Honour replica Doka first, then run that
 * body without a nested queue hop.
 */
export async function persistIncrementalRewardsThroughGameKeyDokaKeepRemount(args: {
  // Same loose actor type as persistIncrementalRewards — Caffeine bindings vary.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actor: any;
  persist: GameKeyDokaKeepRemountPortalCreditPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  dokaDelta: number;
  xpDelta: number;
  readWallet: () => Promise<unknown>;
}): Promise<ApplyRewardsOk> {
  return persistPortalThroughGameKeyDokaKeepRemount({
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
