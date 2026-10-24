/**
 * #811 stamps remount Doka keep after GameKey `redeemGameKey`
 * throw-after-add (`pbv_gamekey_doka_keep_remount_slotN`) and honours replica
 * wallet on remount **heal / shop** `persistAbsoluteProgress`. #900
 * honours that stamp as the remount **death-cut** base. Those helpers
 * never enter `handleRenameCharacter` / `handleUpgradeSpell`.
 *
 * Production rename commits `committedDokaAfterRename(snapshot().doka)`
 * from the remount lock. `createProgressPersist` on remount seeds
 * GameFlow `dokaBalance` — GameKey HUD credit waits for parsed `#ok`
 * then `onDokaCredited` in `DokaGameKeyShop.redeem`, so a throw-after-add
 * leaves that seed at **200**. `renameCharacter` deducts 100 from the
 * **canister** wallet (1200 after a +1000 grant). The lock then sits
 * 1000 below stored. Seeded leftover `persistAbsoluteProgress` does not
 * fetch; a later Items Buy writes that lie and wipes the paid GameKey
 * grant (`saveBattleStats` incoming-below-stored). Retry hits
 * "GameKey already used".
 *
 * `upgradeSpell` with a fresh `getCallerDokaBalance` already adopts a
 * **drop** vs remount 200 (`committedDokaAfterSpellUpgrade(200, 173)`).
 * A GameKey keep replica **rose** (1190), so `after < before` is false
 * and the advertised spend still commits **190** over canister 1190.
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200: HUD credit waits for parsed `#ok`, and
 *    `shouldApplyCallerDokaHydrate` ignores later wallet refetches while
 *    the world session is mounted.
 * 2. Shop `redeemGameKey` adds 1000 (canister 1200) then the replica
 *    rejects. `#ok` is never parsed. Commit never runs. Shop catch only
 *    toasts "Redeem failed". Lock stays 200. No unpaid death. #811 stamps
 *    `{ preDoka: 200 }`. #811 / #900 do not enter rename.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are
 *    gone. `shouldStartRename(200)` is true.
 * 4. Leftover #811: shop / heal honour replica 1200. Leftover #900:
 *    death taxes replica. Unique leftover: Rename
 *    `committedDokaAfterRename(200)` commits **100**. Canister
 *    `renameCharacter` deducts 100 from 1200 → **1100**. Leftover shop
 *    spend 50 then writes **50** over 1100 (wipes the +1000 grant;
 *    correct remaining is 1050). Upgrade with no wallet query, or with
 *    a risen 1190 query, commits 190 over canister 1190.
 *
 * Unique vs **#811** (heal/shop honour of this stamp), **#900** (death
 * honour), **#979** (victory applyRewards remount rename — different
 * stamp key; grant is +50), **#987** (one-shot remount rename), **#992**
 * (feat remount rename), **#977** (shop/heal throw remount rename —
 * replica dropped), **#864** (Boss Rush remount heal), **#926**
 * (rename/upgrade throw-after-debit remount shop), and **#938** (that
 * spend stamp's remount death).
 *
 * This sidecar reads the same #811 stamp and honours replica wallet as
 * the rename / upgrade debit **base** so the lock commit is 1100 / 1190,
 * not Play-entry 100 / 190. Stale live ≤ stamped `preDoka` fail-closes
 * (`redeemGameKey` only adds — a live wallet that did not rise is stale
 * or placeholder 0). Pickup-only (no stamp) still commits 200 − 100.
 *
 * Do not stamp here — #811 notes keep after GameKey throw-after-add.
 * Explicit `#err` (`GameKey already used`, `Invalid GameKey`, `not yet
 * approved`, `redeemGameKey failed`) never stamps. Parsed `#err` from
 * `redeemGameKeyThroughPersist` is a return, not a throw.
 * Do not restack WX / progressPersist / shopPurchase / DokaGameKeyShop /
 * renameCharacter / spellUpgrade / #811 / #900 / #977 / #979 files.
 *
 * Tests reproduce remount rename / upgrade vs the gated honour.
 * Restack rename / upgrade enqueue onto
 * `persistRenameSpendThroughGameKeyDokaKeepRemount` after #811 lands.
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
 * Same key as #811 `gameKeyDokaKeepRemountKey`. Remount rename /
 * upgrade honour must read the GameKey throw-after-add stamp, not a
 * second key and not #979's victory rename key or #992's feat rename
 * key.
 */
export function gameKeyDokaKeepRemountRenameSpendKey(slot: number): string {
  return `pbv_gamekey_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type GameKeyDokaKeepRemountRenameSpendStamp = {
  /** Lock wallet before the throw-after-add grant. */
  preDoka: number;
};

export function readGameKeyDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): GameKeyDokaKeepRemountRenameSpendStamp | null {
  try {
    const raw = storage.getItem(gameKeyDokaKeepRemountRenameSpendKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<GameKeyDokaKeepRemountRenameSpendStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeGameKeyDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: GameKeyDokaKeepRemountRenameSpendStamp,
): void {
  try {
    storage.setItem(
      gameKeyDokaKeepRemountRenameSpendKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearGameKeyDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(gameKeyDokaKeepRemountRenameSpendKey(slot));
  } catch {
    // ignore
  }
}

export function hasGameKeyDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readGameKeyDokaKeepRemountRenameSpend(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #811
 * `noteGameKeyDokaKeepRemount` after GameKey throw-after-add.
 */
export function noteGameKeyDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeGameKeyDokaKeepRemountRenameSpend(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

export function dokaFromGameKeyDokaKeepRenameSpendWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromGameKeyDokaKeepRenameSpendWalletRecord(
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
export function shouldRefuseGameKeyDokaKeepRemountRenameSpendStaleDoka(args: {
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
 * wallet when the #811 keep stamp says GameKey already invoked.
 * Stale Play-entry equal to stamped `preDoka` must not fall back to
 * remount wallet (that is the wipe: rename commits 100 over 1100).
 */
export function dokaForGameKeyDokaKeepRemountRenameSpend(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseGameKeyDokaKeepRemountRenameSpendStaleDoka({
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
 * Gated fresh GameKey 1200 → 1100.
 */
export function committedDokaAfterRenameWithGameKeyDokaKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  const base = dokaForGameKeyDokaKeepRemountRenameSpend(args);
  if (base == null) return null;
  return committedDokaAfterRename(base);
}

/**
 * Upgrade lock commit. A risen replica (1190) is **not** adopted by
 * `committedDokaAfterSpellUpgrade(200, 1190)` (`after < before` is
 * false). Honour replica first so the advertised spend is 1200 − 10 =
 * 1190.
 */
export function committedDokaAfterSpellUpgradeWithGameKeyDokaKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  backendDokaAfter: number | undefined;
  advertisedCost: number;
}): number | null {
  const base = dokaForGameKeyDokaKeepRemountRenameSpend(args);
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
export function sessionDokaAfterGameKeyDokaKeepRemountRenameSpend(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number {
  const honoured = dokaForGameKeyDokaKeepRemountRenameSpend(args);
  return honoured == null ? toNat(args.remountDoka) : honoured;
}

/**
 * Leftover shop after the remount rename lock-lie. Ungated writes
 * `rename(200) − shopSpend` over the canister post-rename wallet and
 * wipes the paid GameKey grant.
 */
export function dokaAfterShopSpendWithGameKeyDokaKeepRemountRename(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  shopSpend: number;
}): number | null {
  const renamed = committedDokaAfterRenameWithGameKeyDokaKeepRemount({
    remountDoka: args.remountDoka,
    liveDoka: args.liveDoka,
    keep: args.keep,
    stampedPreDoka: args.stampedPreDoka,
  });
  if (renamed == null) return null;
  return applySpendToCommitted(renamed, args.shopSpend);
}

function refuseStaleGameKeyDokaKeepRemountRenameSpend(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type GameKeyDokaKeepRemountRenameSpendPersist = {
  snapshot: () => { doka: number };
  commit?: (next: { doka?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * Rename / upgrade remount wallet used Play-entry Doka 200 after a
 * GameKey redeem throw-after-add. Fetch `getCallerDokaBalance` when the
 * #811 remount keep stamp exists. Stale live ≤ stamped `preDoka`
 * throws so the lock cannot commit `200 − 100`. Fresh replica is
 * adopted onto the lock **before** `applyAndCommit` so production
 * `committedDokaAfterRename(snapshot)` /
 * `committedDokaAfterSpellUpgrade(snapshot, …)` spend from 1200.
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry again. Fail-close keeps the stamp. Do not skip the
 * canister rename / upgrade — those already debit stored Doka.
 */
export async function persistRenameSpendThroughGameKeyDokaKeepRemount<T>(args: {
  persist: GameKeyDokaKeepRemountRenameSpendPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readGameKeyDokaKeepRemountRenameSpend(
      args.storage,
      args.slot,
    );
    if (!stamp) return args.applyAndCommit();

    let liveDoka: number | null = null;
    try {
      liveDoka = dokaFromGameKeyDokaKeepRenameSpendWalletRecord(
        await args.readWallet(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleGameKeyDokaKeepRemountRenameSpend();
    }

    const honoured = dokaForGameKeyDokaKeepRemountRenameSpend({
      remountDoka: toNat(args.persist.snapshot().doka),
      liveDoka,
      keep: true,
      stampedPreDoka: stamp.preDoka,
    });
    if (honoured == null) refuseStaleGameKeyDokaKeepRemountRenameSpend();
    args.persist.commit?.({ doka: honoured });
    clearGameKeyDokaKeepRemountRenameSpend(args.storage, args.slot);
    return args.applyAndCommit();
  });
}
