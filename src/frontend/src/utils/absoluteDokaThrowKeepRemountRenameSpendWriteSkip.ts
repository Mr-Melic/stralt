/**
 * #964 stamps remount Doka keep after shop / Doka-heal `saveBattleStats`
 * throw-after-accept (`pbv_absolute_doka_throw_keep_remount_slotN`) and
 * honours replica wallet on remount **heal / shop**
 * `persistAbsoluteProgress`. #969 honours that stamp as the remount
 * **death-cut** base. #971 skips a second Doka-heal when replica HP is
 * already the paid postHp. Those helpers never enter
 * `handleRenameCharacter` / `handleUpgradeSpell`.
 *
 * Production rename commits `committedDokaAfterRename(snapshot().doka)`
 * from the remount lock. `createProgressPersist` on remount seeds
 * GameFlow `dokaBalance` — heal / shop catch rolls HUD Doka back to
 * Play-entry, so that seed is still **200**. `renameCharacter` deducts
 * 100 from the **canister** wallet (183 after a heal throw, 150 after a
 * shop throw). The lock then sits 17 / 50 above stored. Seeded
 * leftover `persistAbsoluteProgress` does not fetch; a later Items Buy
 * writes that lie and refunds the original fee (`saveBattleStats`
 * incoming-below-stored).
 *
 * `upgradeSpell` with a fresh `getCallerDokaBalance` already adopts the
 * dropped query (`committedDokaAfterSpellUpgrade(200, 173)` → 173). The
 * leftover is the missing / stale-high query path: advertised spend
 * from remount 200 → commit **190** over canister 173.
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200.
 * 2. Doka-heal `saveBattleStats` accepts Doka 183 then throws
 *    (`replica went away`). Commit never runs. Catch returns false.
 *    Heal rollback HUD 200. Same class: Items Buy accepts Doka 150
 *    then throws; HUD + inventory roll back. No unpaid death. #964
 *    stamps `{ preDoka: 200 }`. #971 does not enter rename / upgrade.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are
 *    gone. `shouldStartRename(200)` is true.
 * 4. Leftover #964: shop / heal honour replica 183 / 150. Leftover
 *    #969: death taxes replica. Leftover #971: skip second heal.
 *    Unique leftover: Rename `committedDokaAfterRename(200)` commits
 *    **100**. Canister `renameCharacter` deducts 100 from 183 → **83**
 *    (heal) or 150 → **50** (shop). Leftover shop spend 50 then writes
 *    **50** over 83 (refunds the 17 heal fee) or **50** over 50
 *    (refunds the original 50 purchase). Upgrade with no wallet query
 *    commits 190 over canister 173.
 *
 * Unique vs **#964** (heal/shop honour of this stamp), **#969** (death
 * honour), **#971** (second Doka-heal skip of the #860 HP stamp),
 * **#926** (rename/upgrade throw-after-debit remount shop — different
 * stamp key), and **#938** (that spend stamp's remount death).
 *
 * This sidecar reads the same #964 stamp and honours replica wallet as
 * the rename / upgrade debit **base** so the lock commit is 83 / 50 /
 * 173, not Play-entry 100 / 190. Stale live ≥ stamped `preDoka`
 * fail-closes (a live wallet that did not drop is stale or the
 * rollback cache). Pickup-only (no stamp) still commits 200 − 100.
 *
 * Do not stamp here — #964 notes keep after shop / heal
 * throw-after-accept. Explicit `saveBattleStats failed` never stamps.
 * Do not restack WX / progressPersist / deathPenalty / itemShop /
 * renameCharacter / spellUpgrade / #964 / #969 / #971 files.
 *
 * Tests reproduce remount rename / upgrade vs the gated honour.
 * Restack rename / upgrade enqueue onto
 * `persistRenameSpendThroughAbsoluteDokaThrowKeepRemount` after #964
 * lands. No Motoko.
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
 * Same key as #964 `absoluteDokaThrowKeepRemountKey`. Remount rename /
 * upgrade honour must read the shop / heal throw-after-accept stamp,
 * not a second key and not #926's spend-keep key.
 */
export function absoluteDokaThrowKeepRemountRenameSpendKey(
  slot: number,
): string {
  return `pbv_absolute_doka_throw_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type AbsoluteDokaThrowKeepRemountRenameSpendStamp = {
  /** Lock wallet before the shop / heal saveBattleStats throw. */
  preDoka: number;
};

export function readAbsoluteDokaThrowKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): AbsoluteDokaThrowKeepRemountRenameSpendStamp | null {
  try {
    const raw = storage.getItem(
      absoluteDokaThrowKeepRemountRenameSpendKey(slot),
    );
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<AbsoluteDokaThrowKeepRemountRenameSpendStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeAbsoluteDokaThrowKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: AbsoluteDokaThrowKeepRemountRenameSpendStamp,
): void {
  try {
    storage.setItem(
      absoluteDokaThrowKeepRemountRenameSpendKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearAbsoluteDokaThrowKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(absoluteDokaThrowKeepRemountRenameSpendKey(slot));
  } catch {
    // ignore
  }
}

export function hasAbsoluteDokaThrowKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readAbsoluteDokaThrowKeepRemountRenameSpend(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #964
 * `noteAbsoluteDokaThrowKeepRemount` after shop / heal throw-after-accept.
 */
export function noteAbsoluteDokaThrowKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeAbsoluteDokaThrowKeepRemountRenameSpend(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

export function dokaFromAbsoluteDokaThrowRenameSpendWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromAbsoluteDokaThrowRenameSpendWalletRecord(
      (raw as { ok: unknown }).ok,
    );
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return toNat(n);
}

/**
 * Stale Play-entry / rollback HUD still equals or sits above the
 * pre-spend lock. Shop / heal only debit, so a live wallet that did not
 * drop is stale (or the rollback cache). Missing live is fail-closed
 * only when a keep stamp exists.
 */
export function shouldRefuseAbsoluteDokaThrowKeepRemountRenameSpendStaleDoka(args: {
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
 * wallet when the #964 keep stamp says shop / heal already invoked.
 * Stale Play-entry equal to stamped `preDoka` must not fall back to
 * remount wallet (that is the refund: rename commits 100 over 83 / 50).
 */
export function dokaForAbsoluteDokaThrowKeepRemountRenameSpend(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseAbsoluteDokaThrowKeepRemountRenameSpendStaleDoka({
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
 * Gated fresh heal 183 → 83; shop 150 → 50.
 */
export function committedDokaAfterRenameWithAbsoluteDokaThrowKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  const base = dokaForAbsoluteDokaThrowKeepRemountRenameSpend(args);
  if (base == null) return null;
  return committedDokaAfterRename(base);
}

/**
 * Upgrade lock commit. Fresh `getCallerDokaBalance` already adopts a
 * drop vs remount 200; the leftover is a missing / stale-high query
 * (`committedDokaAfterSpellUpgrade(200, undefined, 10)` → 190).
 * Honour replica first so the advertised spend is 183 − 10 = 173.
 */
export function committedDokaAfterSpellUpgradeWithAbsoluteDokaThrowKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  backendDokaAfter: number | undefined;
  advertisedCost: number;
}): number | null {
  const base = dokaForAbsoluteDokaThrowKeepRemountRenameSpend(args);
  if (base == null) return null;
  return committedDokaAfterSpellUpgrade(
    base,
    args.backendDokaAfter,
    args.advertisedCost,
  );
}

/**
 * Session HUD after remount. Ungated rollback 200 still opens Rename
 * (`shouldStartRename`) even when replica already paid the shop / heal
 * fee. Honour replica so the debit / affordability check matches the
 * canister.
 */
export function sessionDokaAfterAbsoluteDokaThrowKeepRemountRenameSpend(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number {
  const honoured = dokaForAbsoluteDokaThrowKeepRemountRenameSpend(args);
  return honoured == null ? toNat(args.remountDoka) : honoured;
}

/**
 * Leftover shop after the remount rename lock-lie. Ungated writes
 * `rename(200) − shopSpend` over the canister post-rename wallet and
 * refunds the original shop / heal fee.
 */
export function dokaAfterShopSpendWithAbsoluteDokaThrowKeepRemountRename(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  shopSpend: number;
}): number | null {
  const renamed = committedDokaAfterRenameWithAbsoluteDokaThrowKeepRemount({
    remountDoka: args.remountDoka,
    liveDoka: args.liveDoka,
    keep: args.keep,
    stampedPreDoka: args.stampedPreDoka,
  });
  if (renamed == null) return null;
  return applySpendToCommitted(renamed, args.shopSpend);
}

function refuseStaleAbsoluteDokaThrowKeepRemountRenameSpend(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type AbsoluteDokaThrowKeepRemountRenameSpendPersist = {
  snapshot: () => { doka: number };
  commit?: (next: { doka?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * Rename / upgrade remount wallet used Play-entry Doka 200 after a
 * shop / heal saveBattleStats throw-after-accept. Fetch
 * `getCallerDokaBalance` when the #964 remount keep stamp exists.
 * Stale live ≥ stamped `preDoka` throws so the lock cannot commit
 * `200 − 100`. Fresh replica is adopted onto the lock **before**
 * `applyAndCommit` so production `committedDokaAfterRename(snapshot)`
 * / `committedDokaAfterSpellUpgrade(snapshot, …)` spend from 183 / 150.
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry again. Fail-close keeps the stamp. Do not skip the
 * canister rename / upgrade — those already debit stored Doka.
 */
export async function persistRenameSpendThroughAbsoluteDokaThrowKeepRemount<
  T,
>(args: {
  persist: AbsoluteDokaThrowKeepRemountRenameSpendPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readAbsoluteDokaThrowKeepRemountRenameSpend(
      args.storage,
      args.slot,
    );
    if (!stamp) return args.applyAndCommit();

    let liveDoka: number | null = null;
    try {
      liveDoka = dokaFromAbsoluteDokaThrowRenameSpendWalletRecord(
        await args.readWallet(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleAbsoluteDokaThrowKeepRemountRenameSpend();
    }

    const honoured = dokaForAbsoluteDokaThrowKeepRemountRenameSpend({
      remountDoka: toNat(args.persist.snapshot().doka),
      liveDoka,
      keep: true,
      stampedPreDoka: stamp.preDoka,
    });
    if (honoured == null) refuseStaleAbsoluteDokaThrowKeepRemountRenameSpend();
    args.persist.commit?.({ doka: honoured });
    clearAbsoluteDokaThrowKeepRemountRenameSpend(args.storage, args.slot);
    return args.applyAndCommit();
  });
}
