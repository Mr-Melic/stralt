/**
 * #774 stamps remount Doka keep after victory `applyRewards` throw-after-add
 * (`pbv_victory_doka_keep_remount_slotN`) and honours replica wallet on
 * remount **heal / shop** `persistAbsoluteProgress`. #869 honours that
 * stamp as the remount **death-cut** base. Those helpers never enter
 * `handleRenameCharacter` / `handleUpgradeSpell`.
 *
 * Production rename commits `committedDokaAfterRename(snapshot().doka)`
 * from the remount lock. `createProgressPersist` on remount seeds
 * GameFlow `dokaBalance` — victory HUD credit waits for commit, and the
 * throw-after-add catch only `logDebugInfo`s, so that seed is still
 * **200**. `renameCharacter` deducts 100 from the **canister** wallet
 * (250 after a +50 grant). The lock then sits 50 below stored. Seeded
 * leftover `persistAbsoluteProgress` does not fetch; a later Items Buy
 * writes that lie and wipes the victory grant (`saveBattleStats`
 * incoming-below-stored).
 *
 * `upgradeSpell` with a fresh `getCallerDokaBalance` already adopts a
 * **drop** vs remount 200 (`committedDokaAfterSpellUpgrade(200, 173)`).
 * A victory keep replica **rose** (240), so `after < before` is false
 * and the advertised spend still commits **190** over canister 240.
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200: HUD credit waits for commit, and
 *    `shouldApplyCallerDokaHydrate` ignores later wallet refetches while
 *    the world session is mounted.
 * 2. Victory `applyRewards(slot, 50, xp)` invokes then throws (canister
 *    250). Catch only `logDebugInfo`s. Lock stays 200. No unpaid death.
 *    #774 stamps `{ preDoka: 200 }`. #869 / #774 do not enter rename.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are
 *    gone. `shouldStartRename(200)` is true.
 * 4. Leftover #774: shop / heal honour replica 250. Leftover #869:
 *    death taxes replica. Unique leftover: Rename
 *    `committedDokaAfterRename(200)` commits **100**. Canister
 *    `renameCharacter` deducts 100 from 250 → **150**. Leftover shop
 *    spend 50 then writes **50** over 150 (wipes the +50 grant;
 *    correct remaining is 100). Upgrade with no wallet query, or with
 *    a risen 240 query, commits 190 over canister 240.
 *
 * Unique vs **#774** (heal/shop honour of this stamp), **#869** (death
 * honour), **#977** (shop/heal throw remount rename — different stamp
 * key; replica dropped), **#926** (rename/upgrade throw-after-debit
 * remount shop), and **#938** (that spend stamp's remount death).
 *
 * This sidecar reads the same #774 stamp and honours replica wallet as
 * the rename / upgrade debit **base** so the lock commit is 150 / 240,
 * not Play-entry 100 / 190. Stale live ≤ stamped `preDoka` fail-closes
 * (`applyRewards` only adds — a live wallet that did not rise is stale
 * or placeholder 0). Pickup-only (no stamp) still commits 200 − 100.
 *
 * Do not stamp here — #774 notes keep after victory throw-after-add.
 * Explicit `applyRewards failed` never stamps.
 * Do not restack WX / progressPersist / deathPenalty / rewardResolver /
 * renameCharacter / spellUpgrade / #774 / #869 / #977 files.
 *
 * Tests reproduce remount rename / upgrade vs the gated honour.
 * Restack rename / upgrade enqueue onto
 * `persistRenameSpendThroughVictoryDokaKeepRemount` after #774 lands.
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
 * Same key as #774 `victoryDokaKeepRemountKey`. Remount rename /
 * upgrade honour must read the victory throw-after-add stamp, not a
 * second key and not #977's shop-throw rename key.
 */
export function victoryDokaKeepRemountRenameSpendKey(slot: number): string {
  return `pbv_victory_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type VictoryDokaKeepRemountRenameSpendStamp = {
  /** Lock wallet before the throw-after-add grant. */
  preDoka: number;
};

export function readVictoryDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): VictoryDokaKeepRemountRenameSpendStamp | null {
  try {
    const raw = storage.getItem(victoryDokaKeepRemountRenameSpendKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<VictoryDokaKeepRemountRenameSpendStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeVictoryDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: VictoryDokaKeepRemountRenameSpendStamp,
): void {
  try {
    storage.setItem(
      victoryDokaKeepRemountRenameSpendKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearVictoryDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(victoryDokaKeepRemountRenameSpendKey(slot));
  } catch {
    // ignore
  }
}

export function hasVictoryDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readVictoryDokaKeepRemountRenameSpend(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #774
 * `noteVictoryDokaKeepRemount` after victory throw-after-add.
 */
export function noteVictoryDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeVictoryDokaKeepRemountRenameSpend(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

export function dokaFromVictoryDokaKeepRenameSpendWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromVictoryDokaKeepRenameSpendWalletRecord(
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
export function shouldRefuseVictoryDokaKeepRemountRenameSpendStaleDoka(args: {
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
 * wallet when the #774 keep stamp says victory already invoked.
 * Stale Play-entry equal to stamped `preDoka` must not fall back to
 * remount wallet (that is the wipe: rename commits 100 over 150).
 */
export function dokaForVictoryDokaKeepRemountRenameSpend(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseVictoryDokaKeepRemountRenameSpendStaleDoka({
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
 * Gated fresh victory 250 → 150.
 */
export function committedDokaAfterRenameWithVictoryDokaKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  const base = dokaForVictoryDokaKeepRemountRenameSpend(args);
  if (base == null) return null;
  return committedDokaAfterRename(base);
}

/**
 * Upgrade lock commit. A risen replica (240) is **not** adopted by
 * `committedDokaAfterSpellUpgrade(200, 240)` (`after < before` is
 * false). Honour replica first so the advertised spend is 250 − 10 =
 * 240.
 */
export function committedDokaAfterSpellUpgradeWithVictoryDokaKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  backendDokaAfter: number | undefined;
  advertisedCost: number;
}): number | null {
  const base = dokaForVictoryDokaKeepRemountRenameSpend(args);
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
export function sessionDokaAfterVictoryDokaKeepRemountRenameSpend(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number {
  const honoured = dokaForVictoryDokaKeepRemountRenameSpend(args);
  return honoured == null ? toNat(args.remountDoka) : honoured;
}

/**
 * Leftover shop after the remount rename lock-lie. Ungated writes
 * `rename(200) − shopSpend` over the canister post-rename wallet and
 * wipes the victory grant.
 */
export function dokaAfterShopSpendWithVictoryDokaKeepRemountRename(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  shopSpend: number;
}): number | null {
  const renamed = committedDokaAfterRenameWithVictoryDokaKeepRemount({
    remountDoka: args.remountDoka,
    liveDoka: args.liveDoka,
    keep: args.keep,
    stampedPreDoka: args.stampedPreDoka,
  });
  if (renamed == null) return null;
  return applySpendToCommitted(renamed, args.shopSpend);
}

function refuseStaleVictoryDokaKeepRemountRenameSpend(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type VictoryDokaKeepRemountRenameSpendPersist = {
  snapshot: () => { doka: number };
  commit?: (next: { doka?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * Rename / upgrade remount wallet used Play-entry Doka 200 after a
 * victory applyRewards throw-after-add. Fetch `getCallerDokaBalance`
 * when the #774 remount keep stamp exists. Stale live ≤ stamped
 * `preDoka` throws so the lock cannot commit `200 − 100`. Fresh
 * replica is adopted onto the lock **before** `applyAndCommit` so
 * production `committedDokaAfterRename(snapshot)` /
 * `committedDokaAfterSpellUpgrade(snapshot, …)` spend from 250.
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry again. Fail-close keeps the stamp. Do not skip the
 * canister rename / upgrade — those already debit stored Doka.
 */
export async function persistRenameSpendThroughVictoryDokaKeepRemount<T>(args: {
  persist: VictoryDokaKeepRemountRenameSpendPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readVictoryDokaKeepRemountRenameSpend(
      args.storage,
      args.slot,
    );
    if (!stamp) return args.applyAndCommit();

    let liveDoka: number | null = null;
    try {
      liveDoka = dokaFromVictoryDokaKeepRenameSpendWalletRecord(
        await args.readWallet(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleVictoryDokaKeepRemountRenameSpend();
    }

    const honoured = dokaForVictoryDokaKeepRemountRenameSpend({
      remountDoka: toNat(args.persist.snapshot().doka),
      liveDoka,
      keep: true,
      stampedPreDoka: stamp.preDoka,
    });
    if (honoured == null) refuseStaleVictoryDokaKeepRemountRenameSpend();
    args.persist.commit?.({ doka: honoured });
    clearVictoryDokaKeepRemountRenameSpend(args.storage, args.slot);
    return args.applyAndCommit();
  });
}
