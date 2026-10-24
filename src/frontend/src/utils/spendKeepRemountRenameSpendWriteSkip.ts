/**
 * #926 stamps remount Doka spend keep after `renameCharacter` /
 * `upgradeSpell` throw-after-debit (`pbv_spend_keep_remount_slotN`) and
 * honours replica wallet on remount **heal / shop**
 * `persistAbsoluteProgress`. #938 honours that stamp as the remount
 * **death-cut** base. Those helpers never enter `handleRenameCharacter`
 * / `handleUpgradeSpell`.
 *
 * Production rename commits `committedDokaAfterRename(snapshot().doka)`
 * from the remount lock. `createProgressPersist` on remount seeds
 * GameFlow `dokaBalance` — HUD debit waits for parsed `#ok` /
 * `persistSpellUpgrade` return, so that seed is still **200**.
 * `renameCharacter` deducts 100 from the **canister** wallet (100 after
 * a rename throw, 190 after an upgrade throw). The lock then sits 100 /
 * 10 above stored. Seeded leftover `persistAbsoluteProgress` does not
 * fetch; a later Items Buy writes that lie. `saveBattleStats` never
 * mints incoming-above-stored, so the item still lands while the
 * original fee is refunded (upgrade→rename shop writes 50 over 90) or
 * skipped entirely (rename→upgrade shop writes 140 over 90).
 *
 * `upgradeSpell` with a fresh `getCallerDokaBalance` already adopts the
 * dropped query (`committedDokaAfterSpellUpgrade(200, 90)` → 90). The
 * leftover is the missing / stale-high query path: advertised spend
 * from remount 200 → commit **190** over canister 90.
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200: HUD debit waits for parsed success, and
 *    `shouldApplyCallerDokaHydrate` ignores later wallet refetches
 *    while the world session is mounted.
 * 2. `renameCharacter` deducts 100 (canister 100) then throws
 *    (`replica went away`). Catch only toasts. Lock stays 200. Same
 *    class: `upgradeSpell` deducts 10 (canister 190) then throws. No
 *    unpaid death. #387 session WeakMap dies on remount. #926 stamps
 *    `{ preDoka: 200 }`. #926 / #938 do not enter rename / upgrade.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed-spend
 *    flags are gone. `shouldStartRename(200)` is true.
 * 4. Leftover #926: shop / heal honour replica 100 / 190. Leftover
 *    #938: death taxes replica. Unique leftover: Rename
 *    `committedDokaAfterRename(200)` commits **100**. Canister
 *    `renameCharacter` deducts 100 from 100 → **0** (rename throw) or
 *    190 → **90** (upgrade throw). Leftover shop spend 50 then writes
 *    **50** over 0 (never-raise; free BuffShop item) or **50** over 90
 *    (refunds the 10 upgrade fee). Upgrade with no wallet query, or
 *    with a stale-high 200 query, commits 190 over canister 90.
 *
 * Unique vs **#926** (heal/shop honour of this stamp), **#938** (death
 * honour), **#977** (shop/heal throw remount rename — different stamp
 * key), and **#979** (victory keep remount rename — replica rose).
 *
 * This sidecar reads the same #926 stamp and honours replica wallet as
 * the rename / upgrade debit **base** so the lock commit is 0 / 90 /
 * 180, not Play-entry 100 / 190. Stale live ≥ stamped `preDoka`
 * fail-closes (`renameCharacter` / `upgradeSpell` only debit — a live
 * wallet that did not drop is stale or the Play-entry cache).
 * Pickup-only (no stamp) still commits 200 − 100.
 *
 * Do not stamp here — #926 notes keep after rename / upgrade
 * throw-after-debit. Explicit `upgradeSpell failed` / parsed rename
 * `#err` never stamps. Do not restack WX / progressPersist /
 * deathPenalty / itemShop / renameCharacter / spellUpgrade / #926 /
 * #938 / #977 files.
 *
 * Tests reproduce remount rename / upgrade vs the gated honour.
 * Restack rename / upgrade enqueue onto
 * `persistRenameSpendThroughSpendKeepRemount` after #926 lands.
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
 * Same key as #926 `spendKeepRemountKey`. Remount rename / upgrade
 * honour must read the rename / upgrade throw-after-debit stamp, not a
 * second key and not #977's shop-throw rename key.
 */
export function spendKeepRemountRenameSpendKey(slot: number): string {
  return `pbv_spend_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type SpendKeepRemountRenameSpendStamp = {
  /** Lock wallet before the throw-after-debit spend. */
  preDoka: number;
};

export function readSpendKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): SpendKeepRemountRenameSpendStamp | null {
  try {
    const raw = storage.getItem(spendKeepRemountRenameSpendKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SpendKeepRemountRenameSpendStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeSpendKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: SpendKeepRemountRenameSpendStamp,
): void {
  try {
    storage.setItem(
      spendKeepRemountRenameSpendKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearSpendKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(spendKeepRemountRenameSpendKey(slot));
  } catch {
    // ignore
  }
}

export function hasSpendKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readSpendKeepRemountRenameSpend(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #926
 * `noteSpendKeepRemount` after rename / upgrade throw-after-debit.
 */
export function noteSpendKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeSpendKeepRemountRenameSpend(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

export function dokaFromSpendKeepRenameSpendWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromSpendKeepRenameSpendWalletRecord(
      (raw as { ok: unknown }).ok,
    );
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return toNat(n);
}

/**
 * Stale Play-entry / session cache still equals or sits above the
 * pre-spend lock. `renameCharacter` / `upgradeSpell` only debit, so a
 * live wallet that did not drop is stale (or the Play-entry cache).
 * Missing live is fail-closed only when a keep stamp exists.
 */
export function shouldRefuseSpendKeepRemountRenameSpendStaleDoka(args: {
  keep: boolean;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) >= toNat(args.stampedPreDoka);
}

/**
 * Honour remount rename / upgrade debit **base** Doka from replica
 * wallet when the #926 keep stamp says a fee may already be on the
 * canister. Stale Play-entry equal to stamped `preDoka` must not fall
 * back to remount wallet (that is the free-item lie: rename commits
 * 100 over 0).
 */
export function dokaForSpendKeepRemountRenameSpend(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseSpendKeepRemountRenameSpendStaleDoka({
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
 * Gated fresh rename-throw 100 → 0; upgrade-throw 190 → 90.
 */
export function committedDokaAfterRenameWithSpendKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  const base = dokaForSpendKeepRemountRenameSpend(args);
  if (base == null) return null;
  return committedDokaAfterRename(base);
}

/**
 * Upgrade lock commit. Fresh `getCallerDokaBalance` already adopts a
 * drop vs remount 200; the leftover is a missing / stale-high query
 * (`committedDokaAfterSpellUpgrade(200, undefined, 10)` → 190).
 * Honour replica first so the advertised spend is 100 − 10 = 90.
 */
export function committedDokaAfterSpellUpgradeWithSpendKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  backendDokaAfter: number | undefined;
  advertisedCost: number;
}): number | null {
  const base = dokaForSpendKeepRemountRenameSpend(args);
  if (base == null) return null;
  return committedDokaAfterSpellUpgrade(
    base,
    args.backendDokaAfter,
    args.advertisedCost,
  );
}

/**
 * Session HUD after remount. Ungated Play-entry 200 still opens Rename
 * even when replica already paid the first fee. Honour replica so the
 * debit / affordability check matches the canister.
 */
export function sessionDokaAfterSpendKeepRemountRenameSpend(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number {
  const honoured = dokaForSpendKeepRemountRenameSpend(args);
  return honoured == null ? toNat(args.remountDoka) : honoured;
}

/**
 * Leftover shop after the remount rename lock-lie. Ungated writes
 * `rename(200) − shopSpend` over the canister post-rename wallet:
 * never-raise free item after a rename throw, or incoming-below-stored
 * refund of the upgrade fee after an upgrade throw.
 */
export function dokaAfterShopSpendWithSpendKeepRemountRename(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  shopSpend: number;
}): number | null {
  const renamed = committedDokaAfterRenameWithSpendKeepRemount({
    remountDoka: args.remountDoka,
    liveDoka: args.liveDoka,
    keep: args.keep,
    stampedPreDoka: args.stampedPreDoka,
  });
  if (renamed == null) return null;
  return applySpendToCommitted(renamed, args.shopSpend);
}

function refuseStaleSpendKeepRemountRenameSpend(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type SpendKeepRemountRenameSpendPersist = {
  snapshot: () => { doka: number };
  commit?: (next: { doka?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * Rename / upgrade remount wallet used Play-entry Doka 200 after a
 * rename / upgrade throw-after-debit. Fetch `getCallerDokaBalance`
 * when the #926 remount keep stamp exists. Stale live ≥ stamped
 * `preDoka` throws so the lock cannot commit `200 − 100`. Fresh
 * replica is adopted onto the lock **before** `applyAndCommit` so
 * production `committedDokaAfterRename(snapshot)` /
 * `committedDokaAfterSpellUpgrade(snapshot, …)` spend from 100 / 190.
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry again. Fail-close keeps the stamp. Do not skip the
 * canister rename / upgrade — those already debit stored Doka.
 */
export async function persistRenameSpendThroughSpendKeepRemount<T>(args: {
  persist: SpendKeepRemountRenameSpendPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readSpendKeepRemountRenameSpend(args.storage, args.slot);
    if (!stamp) return args.applyAndCommit();

    let liveDoka: number | null = null;
    try {
      liveDoka = dokaFromSpendKeepRenameSpendWalletRecord(
        await args.readWallet(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleSpendKeepRemountRenameSpend();
    }

    const honoured = dokaForSpendKeepRemountRenameSpend({
      remountDoka: toNat(args.persist.snapshot().doka),
      liveDoka,
      keep: true,
      stampedPreDoka: stamp.preDoka,
    });
    if (honoured == null) refuseStaleSpendKeepRemountRenameSpend();
    args.persist.commit?.({ doka: honoured });
    clearSpendKeepRemountRenameSpend(args.storage, args.slot);
    return args.applyAndCommit();
  });
}
