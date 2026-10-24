/**
 * #800 stamps remount Doka keep after shrine / ground / dungeon-complete
 * `persistDokaCreditResult` transport-keep (`pbv_oneshot_doka_keep_remount_slotN`)
 * and honours replica wallet on remount **heal / shop**
 * `persistAbsoluteProgress`. #877 honours that stamp as the remount
 * **death-cut** base. Those helpers never enter `handleRenameCharacter` /
 * `handleUpgradeSpell`.
 *
 * Production rename commits `committedDokaAfterRename(snapshot().doka)`
 * from the remount lock. `createProgressPersist` on remount seeds
 * GameFlow `dokaBalance` — one-shot HUD credit waits for settle
 * `commit`, and transport-keep + stale confirm never call
 * `onDokaBalanceChange`, so that seed is still **200**.
 * `renameCharacter` deducts 100 from the **canister** wallet (250 after
 * a +50 pickup, or 500 after shrine 300). The lock then sits the grant
 * below stored. Seeded leftover `persistAbsoluteProgress` does not
 * fetch; a later Items Buy writes that lie and wipes the pickup
 * (`saveBattleStats` incoming-below-stored).
 *
 * `upgradeSpell` with a fresh `getCallerDokaBalance` already adopts a
 * **drop** vs remount 200 (`committedDokaAfterSpellUpgrade(200, 173)`).
 * A one-shot keep replica **rose** (240), so `after < before` is false
 * and the advertised spend still commits **190** over canister 240.
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200: HUD credit waits for settle `commit`, and
 *    `shouldApplyCallerDokaHydrate` ignores later wallet refetches while
 *    the world session is mounted.
 * 2. Ground / shrine / dungeon-complete `applyRewards(slot, doka, 0)`
 *    invokes then transport-misses (canister 250). Confirm still reads
 *    200. `settle` is `keep`. `settleOneShotPersistLock` notes
 *    unconfirmed on the session lock. No unpaid death. #800 stamps
 *    `{ preDoka: 200 }`. #877 / #800 do not enter rename.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are
 *    gone. `shouldStartRename(200)` is true.
 * 4. Leftover #800: shop / heal honour replica 250. Leftover #877:
 *    death taxes replica. Unique leftover: Rename
 *    `committedDokaAfterRename(200)` commits **100**. Canister
 *    `renameCharacter` deducts 100 from 250 → **150**. Leftover shop
 *    spend 50 then writes **50** over 150 (wipes the +50 grant;
 *    correct remaining is 100). Upgrade with no wallet query, or with
 *    a risen 240 query, commits 190 over canister 240.
 *
 * Unique vs **#800** (heal/shop honour of this stamp), **#877** (death
 * honour), **#979** (victory Doka keep remount rename — different stamp
 * key `pbv_victory_doka_keep_remount_slotN`), **#977** (shop/heal throw
 * remount rename — replica dropped), **#926** (rename/upgrade
 * throw-after-debit remount shop), and **#938** (that spend stamp's
 * remount death).
 *
 * This sidecar reads the same #800 stamp and honours replica wallet as
 * the rename / upgrade debit **base** so the lock commit is 150 / 240,
 * not Play-entry 100 / 190. Stale live ≤ stamped `preDoka` fail-closes
 * (`applyRewards` only adds — a live wallet that did not rise is stale
 * or placeholder 0). Pickup-only (no stamp) still commits 200 − 100.
 *
 * Do not stamp here — #800 notes keep after one-shot transport-keep.
 * Explicit `applyRewards failed` is settle `release` and never stamps.
 * Do not restack WX / progressPersist / dokaPersist / deathPenalty /
 * renameCharacter / spellUpgrade / #800 / #877 / #979 files.
 *
 * Tests reproduce remount rename / upgrade vs the gated honour.
 * Restack rename / upgrade enqueue onto
 * `persistRenameSpendThroughOneShotDokaKeepRemount` after #800 lands.
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
 * Same key as #800 `oneShotDokaKeepRemountKey`. Remount rename /
 * upgrade honour must read the one-shot transport-keep stamp, not a
 * second key and not #979's victory rename key.
 */
export function oneShotDokaKeepRemountRenameSpendKey(slot: number): string {
  return `pbv_oneshot_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type OneShotDokaKeepRemountRenameSpendStamp = {
  /** Lock wallet before the transport-keep grant. */
  preDoka: number;
};

export function readOneShotDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): OneShotDokaKeepRemountRenameSpendStamp | null {
  try {
    const raw = storage.getItem(oneShotDokaKeepRemountRenameSpendKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<OneShotDokaKeepRemountRenameSpendStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeOneShotDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: OneShotDokaKeepRemountRenameSpendStamp,
): void {
  try {
    storage.setItem(
      oneShotDokaKeepRemountRenameSpendKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearOneShotDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(oneShotDokaKeepRemountRenameSpendKey(slot));
  } catch {
    // ignore
  }
}

export function hasOneShotDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readOneShotDokaKeepRemountRenameSpend(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #800
 * `noteOneShotDokaKeepRemount` after one-shot transport-keep.
 */
export function noteOneShotDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeOneShotDokaKeepRemountRenameSpend(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

export function dokaFromOneShotDokaKeepRenameSpendWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromOneShotDokaKeepRenameSpendWalletRecord(
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
export function shouldRefuseOneShotDokaKeepRemountRenameSpendStaleDoka(args: {
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
 * wallet when the #800 keep stamp says a one-shot grant already
 * invoked. Stale Play-entry equal to stamped `preDoka` must not fall
 * back to remount wallet (that is the wipe: rename commits 100 over
 * 150).
 */
export function dokaForOneShotDokaKeepRemountRenameSpend(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseOneShotDokaKeepRemountRenameSpendStaleDoka({
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
 * Gated fresh one-shot 250 → 150.
 */
export function committedDokaAfterRenameWithOneShotDokaKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  const base = dokaForOneShotDokaKeepRemountRenameSpend(args);
  if (base == null) return null;
  return committedDokaAfterRename(base);
}

/**
 * Upgrade lock commit. A risen replica (240) is **not** adopted by
 * `committedDokaAfterSpellUpgrade(200, 240)` (`after < before` is
 * false). Honour replica first so the advertised spend is 250 − 10 =
 * 240.
 */
export function committedDokaAfterSpellUpgradeWithOneShotDokaKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  backendDokaAfter: number | undefined;
  advertisedCost: number;
}): number | null {
  const base = dokaForOneShotDokaKeepRemountRenameSpend(args);
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
export function sessionDokaAfterOneShotDokaKeepRemountRenameSpend(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number {
  const honoured = dokaForOneShotDokaKeepRemountRenameSpend(args);
  return honoured == null ? toNat(args.remountDoka) : honoured;
}

/**
 * Leftover shop after the remount rename lock-lie. Ungated writes
 * `rename(200) − shopSpend` over the canister post-rename wallet and
 * wipes the one-shot grant.
 */
export function dokaAfterShopSpendWithOneShotDokaKeepRemountRename(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  shopSpend: number;
}): number | null {
  const renamed = committedDokaAfterRenameWithOneShotDokaKeepRemount({
    remountDoka: args.remountDoka,
    liveDoka: args.liveDoka,
    keep: args.keep,
    stampedPreDoka: args.stampedPreDoka,
  });
  if (renamed == null) return null;
  return applySpendToCommitted(renamed, args.shopSpend);
}

function refuseStaleOneShotDokaKeepRemountRenameSpend(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type OneShotDokaKeepRemountRenameSpendPersist = {
  snapshot: () => { doka: number };
  commit?: (next: { doka?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * Rename / upgrade remount wallet used Play-entry Doka 200 after a
 * one-shot applyRewards transport-keep. Fetch `getCallerDokaBalance`
 * when the #800 remount keep stamp exists. Stale live ≤ stamped
 * `preDoka` throws so the lock cannot commit `200 − 100`. Fresh
 * replica is adopted onto the lock **before** `applyAndCommit` so
 * production `committedDokaAfterRename(snapshot)` /
 * `committedDokaAfterSpellUpgrade(snapshot, …)` spend from 250.
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry again. Fail-close keeps the stamp. Do not skip the
 * canister rename / upgrade — those already debit stored Doka.
 */
export async function persistRenameSpendThroughOneShotDokaKeepRemount<T>(args: {
  persist: OneShotDokaKeepRemountRenameSpendPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readOneShotDokaKeepRemountRenameSpend(
      args.storage,
      args.slot,
    );
    if (!stamp) return args.applyAndCommit();

    let liveDoka: number | null = null;
    try {
      liveDoka = dokaFromOneShotDokaKeepRenameSpendWalletRecord(
        await args.readWallet(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleOneShotDokaKeepRemountRenameSpend();
    }

    const honoured = dokaForOneShotDokaKeepRemountRenameSpend({
      remountDoka: toNat(args.persist.snapshot().doka),
      liveDoka,
      keep: true,
      stampedPreDoka: stamp.preDoka,
    });
    if (honoured == null) refuseStaleOneShotDokaKeepRemountRenameSpend();
    args.persist.commit?.({ doka: honoured });
    clearOneShotDokaKeepRemountRenameSpend(args.storage, args.slot);
    return args.applyAndCommit();
  });
}
