/**
 * #864 stamps remount Doka keep after Boss Rush room-clear `applyRewards`
 * throw-after-add (`pbv_boss_rush_doka_keep_remount_slotN`) and honours
 * replica wallet on remount **heal / shop** `persistAbsoluteProgress`.
 * #866 honours that stamp as the remount **death-cut** base. Those
 * helpers never enter `handleRenameCharacter` / `handleUpgradeSpell`.
 *
 * Production rename commits `committedDokaAfterRename(snapshot().doka)`
 * from the remount lock. `createProgressPersist` on remount seeds
 * GameFlow `dokaBalance` — room-clear HUD credit waits for `.then` after
 * `persistBossRushRewardsThroughLock`, and the throw-after-add catch
 * only `logDebugError`s, so that seed is still **200**. `renameCharacter`
 * deducts 100 from the **canister** wallet (700 after a +500 grant).
 * The lock then sits 500 below stored. Seeded leftover
 * `persistAbsoluteProgress` does not fetch; a later Items Buy writes
 * that lie and wipes the room-clear grant (`saveBattleStats`
 * incoming-below-stored). The room already advanced, so the grant
 * cannot be re-farmed.
 *
 * `upgradeSpell` with a fresh `getCallerDokaBalance` already adopts a
 * **drop** vs remount 200 (`committedDokaAfterSpellUpgrade(200, 173)`).
 * A Boss Rush keep replica **rose** (690), so `after < before` is false
 * and the advertised spend still commits **190** over canister 690.
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200: HUD credit waits for commit, and
 *    `shouldApplyCallerDokaHydrate` ignores later wallet refetches while
 *    the world session is mounted.
 * 2. Room 0 clear writes `currentRoom` first, then
 *    `applyRewards(slot, 500, xp)` invokes then throws (canister 700).
 *    Catch only `logDebugError`s. Lock stays 200. No unpaid death.
 *    #864 stamps `{ preDoka: 200 }`. #864 / #866 do not enter rename.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are
 *    gone. `shouldStartRename(200)` is true.
 * 4. Leftover #864: shop / heal honour replica 700. Leftover #866:
 *    death taxes replica. Unique leftover: Rename
 *    `committedDokaAfterRename(200)` commits **100**. Canister
 *    `renameCharacter` deducts 100 from 700 → **600**. Leftover shop
 *    spend 50 then writes **50** over 600 (wipes the +500 grant;
 *    correct remaining is 550). Upgrade with no wallet query, or with
 *    a risen 690 query, commits 190 over canister 690.
 *
 * Unique vs **#864** (heal/shop honour of this stamp), **#866** (death
 * honour), **#979** (handleBattleEnd victory remount rename — different
 * stamp key; grant is +50), **#1019** (GameKey remount rename), **#992**
 * (feat remount rename), **#986** (one-shot remount rename), **#977**
 * (shop/heal throw remount rename — replica dropped), **#1002** (spend
 * keep remount rename), **#926** (rename/upgrade throw-after-debit
 * remount shop), and **#938** (that spend stamp's remount death).
 *
 * This sidecar reads the same #864 stamp and honours replica wallet as
 * the rename / upgrade debit **base** so the lock commit is 600 / 690,
 * not Play-entry 100 / 190. Stale live ≤ stamped `preDoka` fail-closes
 * (`applyRewards` only adds — a live wallet that did not rise is stale
 * or placeholder 0). Pickup-only (no stamp) still commits 200 − 100.
 *
 * Do not stamp here — #864 notes keep after Boss Rush throw-after-add.
 * Stamp only after `persistRoomClear` succeeded and `applyAndCommit`
 * threw. A progress-only reject never invoked `applyRewards`. Explicit
 * `applyRewards failed` never stamps.
 * Do not restack WX / progressPersist / deathPenalty / rewardResolver /
 * bossRushProgress / renameCharacter / spellUpgrade / #864 / #866 /
 * #979 files.
 *
 * Tests reproduce remount rename / upgrade vs the gated honour.
 * Restack rename / upgrade enqueue onto
 * `persistRenameSpendThroughBossRushDokaKeepRemount` after #864 lands.
 * No Motoko.
 */

import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
} from "./progressPersist.ts";
import { committedDokaAfterRename } from "./renameCharacter.ts";
import { committedDokaAfterSpellUpgrade } from "./spellUpgrade.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

/**
 * Same key as #864 `bossRushDokaKeepRemountKey`. Remount rename /
 * upgrade honour must read the Boss Rush throw-after-add stamp, not a
 * second key and not #979's victory rename key or #1019's GameKey
 * rename key.
 */
export function bossRushDokaKeepRemountRenameSpendKey(slot: number): string {
  return `pbv_boss_rush_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type BossRushDokaKeepRemountRenameSpendStamp = {
  /** Lock wallet before the throw-after-add grant. */
  preDoka: number;
};

export function readBossRushDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): BossRushDokaKeepRemountRenameSpendStamp | null {
  try {
    const raw = storage.getItem(bossRushDokaKeepRemountRenameSpendKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<BossRushDokaKeepRemountRenameSpendStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeBossRushDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: BossRushDokaKeepRemountRenameSpendStamp,
): void {
  try {
    storage.setItem(
      bossRushDokaKeepRemountRenameSpendKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearBossRushDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(bossRushDokaKeepRemountRenameSpendKey(slot));
  } catch {
    // ignore
  }
}

export function hasBossRushDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readBossRushDokaKeepRemountRenameSpend(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #864
 * `noteBossRushDokaKeepRemount` after Boss Rush throw-after-add.
 */
export function noteBossRushDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeBossRushDokaKeepRemountRenameSpend(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

export function dokaFromBossRushDokaKeepRenameSpendWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromBossRushDokaKeepRenameSpendWalletRecord(
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
export function shouldRefuseBossRushDokaKeepRemountRenameSpendStaleDoka(args: {
  keep: boolean;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) <= toNat(args.stampedPreDoka);
}

/**
 * Honour remount rename / upgrade debit **base** Doka from replica
 * wallet when the #864 keep stamp says room-clear already invoked.
 * Stale Play-entry equal to stamped `preDoka` must not fall back to
 * remount wallet (that is the wipe: rename commits 100 over 600).
 */
export function dokaForBossRushDokaKeepRemountRenameSpend(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseBossRushDokaKeepRemountRenameSpendStaleDoka({
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
 * Rename lock commit. Ungated remount uses Play-entry 200 → 100.
 * Gated fresh Boss Rush 700 → 600.
 */
export function committedDokaAfterRenameWithBossRushDokaKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  const base = dokaForBossRushDokaKeepRemountRenameSpend(args);
  if (base == null) return null;
  return committedDokaAfterRename(base);
}

/**
 * Upgrade lock commit. A risen replica (690) is **not** adopted by
 * `committedDokaAfterSpellUpgrade(200, 690)` (`after < before` is
 * false). Honour replica first so the advertised spend is 700 − 10 =
 * 690.
 */
export function committedDokaAfterSpellUpgradeWithBossRushDokaKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  backendDokaAfter: number | undefined;
  advertisedCost: number;
}): number | null {
  const base = dokaForBossRushDokaKeepRemountRenameSpend(args);
  if (base == null) return null;
  return committedDokaAfterSpellUpgrade(
    base,
    args.backendDokaAfter,
    args.advertisedCost,
  );
}

/**
 * Session HUD after remount. Ungated Play-entry 200 still opens Rename
 * even when replica already holds the grant. Honour replica so the
 * debit matches the canister.
 */
export function sessionDokaAfterBossRushDokaKeepRemountRenameSpend(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number {
  const honoured = dokaForBossRushDokaKeepRemountRenameSpend(args);
  return honoured == null ? toNat(args.remountDoka) : honoured;
}

/**
 * Leftover shop after the remount rename lock-lie. Ungated writes
 * `rename(200) − shopSpend` over the canister post-rename wallet and
 * wipes the room-clear grant.
 */
export function dokaAfterShopSpendWithBossRushDokaKeepRemountRename(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  shopSpend: number;
}): number | null {
  const renamed = committedDokaAfterRenameWithBossRushDokaKeepRemount({
    remountDoka: args.remountDoka,
    liveDoka: args.liveDoka,
    keep: args.keep,
    stampedPreDoka: args.stampedPreDoka,
  });
  if (renamed == null) return null;
  return applySpendToCommitted(renamed, args.shopSpend);
}

function refuseStaleBossRushDokaKeepRemountRenameSpend(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type BossRushDokaKeepRemountRenameSpendPersist = {
  snapshot: () => { doka: number };
  commit?: (next: { doka?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * Rename / upgrade remount wallet used Play-entry Doka 200 after a
 * Boss Rush applyRewards throw-after-add. Fetch `getCallerDokaBalance`
 * when the #864 remount keep stamp exists. Stale live ≤ stamped
 * `preDoka` throws so the lock cannot commit `200 − 100`. Fresh
 * replica is adopted onto the lock **before** `applyAndCommit` so
 * production `committedDokaAfterRename(snapshot)` /
 * `committedDokaAfterSpellUpgrade(snapshot, …)` spend from 700.
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry again. Fail-close keeps the stamp. Do not skip the
 * canister rename / upgrade — those already debit stored Doka.
 */
export async function persistRenameSpendThroughBossRushDokaKeepRemount<
  T,
>(args: {
  persist: BossRushDokaKeepRemountRenameSpendPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readBossRushDokaKeepRemountRenameSpend(
      args.storage,
      args.slot,
    );
    if (!stamp) return args.applyAndCommit();

    let liveDoka: number | null = null;
    try {
      liveDoka = dokaFromBossRushDokaKeepRenameSpendWalletRecord(
        await args.readWallet(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleBossRushDokaKeepRemountRenameSpend();
    }

    const honoured = dokaForBossRushDokaKeepRemountRenameSpend({
      remountDoka: toNat(args.persist.snapshot().doka),
      liveDoka,
      keep: true,
      stampedPreDoka: stamp.preDoka,
    });
    if (honoured == null) refuseStaleBossRushDokaKeepRemountRenameSpend();
    args.persist.commit?.({ doka: honoured });
    clearBossRushDokaKeepRemountRenameSpend(args.storage, args.slot);
    return args.applyAndCommit();
  });
}
