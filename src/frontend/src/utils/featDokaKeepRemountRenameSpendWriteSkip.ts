/**
 * #812 stamps remount Doka keep after feat `claimAchievementReward`
 * throw-after-add (`pbv_feat_doka_keep_remount_slotN`) and honours replica
 * wallet on remount **heal / shop** `persistAbsoluteProgress`. #909
 * honours that stamp as the remount **death-cut** base. Those helpers
 * never enter `handleRenameCharacter` / `handleUpgradeSpell`.
 *
 * Production rename commits `committedDokaAfterRename(snapshot().doka)`
 * from the remount lock. `createProgressPersist` on remount seeds
 * GameFlow `dokaBalance` — feat HUD credit waits for parsed `#ok` then
 * `creditLiveDoka` in `persistAchievementClaim`, so a throw-after-add
 * leaves that seed at **200**. `renameCharacter` deducts 100 from the
 * **canister** wallet (700 after a +500 grant). The lock then sits 500
 * below stored. Seeded leftover `persistAbsoluteProgress` does not
 * fetch; a later Items Buy writes that lie and wipes the feat grant
 * (`saveBattleStats` incoming-below-stored). Retry hits
 * "Reward already claimed".
 *
 * `upgradeSpell` with a fresh `getCallerDokaBalance` already adopts a
 * **drop** vs remount 200 (`committedDokaAfterSpellUpgrade(200, 173)`).
 * A feat keep replica **rose** (690), so `after < before` is false
 * and the advertised spend still commits **190** over canister 690.
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200: HUD credit waits for parsed `#ok`, and
 *    `shouldApplyCallerDokaHydrate` ignores later wallet refetches while
 *    the world session is mounted.
 * 2. Trophy `claimAchievementReward` adds 500 (canister 700) then the
 *    replica rejects. `#ok` is never parsed. Commit never runs. Panel
 *    catch only toasts. Lock stays 200. No unpaid death. #812 stamps
 *    `{ preDoka: 200 }`. #812 / #909 do not enter rename.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are
 *    gone. `shouldStartRename(200)` is true.
 * 4. Leftover #812: shop / heal honour replica 700. Leftover #909:
 *    death taxes replica. Unique leftover: Rename
 *    `committedDokaAfterRename(200)` commits **100**. Canister
 *    `renameCharacter` deducts 100 from 700 → **600**. Leftover shop
 *    spend 50 then writes **50** over 600 (wipes the +500 grant;
 *    correct remaining is 550). Upgrade with no wallet query, or with
 *    a risen 690 query, commits 190 over canister 690.
 *
 * Unique vs **#812** (heal/shop honour of this stamp), **#909** (death
 * honour), **#979** (victory applyRewards remount rename — different
 * stamp key; grant is +50), **#977** (shop/heal throw remount rename —
 * different stamp; replica dropped), **#811** (GameKey remount heal),
 * **#926** (rename/upgrade throw-after-debit remount shop), and **#938**
 * (that spend stamp's remount death).
 *
 * This sidecar reads the same #812 stamp and honours replica wallet as
 * the rename / upgrade debit **base** so the lock commit is 600 / 690,
 * not Play-entry 100 / 190. Stale live ≤ stamped `preDoka` fail-closes
 * (`claimAchievementReward` only adds — a live wallet that did not rise
 * is stale or placeholder 0). Pickup-only (no stamp) still commits
 * 200 − 100.
 *
 * Do not stamp here — #812 notes keep after feat throw-after-add.
 * Explicit `#err` (`Reward already claimed`, `Achievement not yet
 * unlocked`, `Unknown achievement`, `claimAchievementReward failed`)
 * never stamps. Parsed `#err` from
 * `creditAchievementRewardThroughPersist` is a return, not a throw.
 * Do not restack WX / progressPersist / deathPenalty /
 * achievementReward / AchievementsPanel / renameCharacter /
 * spellUpgrade / #812 / #909 / #977 / #979 files.
 *
 * Tests reproduce remount rename / upgrade vs the gated honour.
 * Restack rename / upgrade enqueue onto
 * `persistRenameSpendThroughFeatDokaKeepRemount` after #812 lands.
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
 * Same key as #812 `featDokaKeepRemountKey`. Remount rename /
 * upgrade honour must read the feat throw-after-add stamp, not a
 * second key and not #979's victory rename key or #977's shop-throw
 * rename key.
 */
export function featDokaKeepRemountRenameSpendKey(slot: number): string {
  return `pbv_feat_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type FeatDokaKeepRemountRenameSpendStamp = {
  /** Lock wallet before the throw-after-add grant. */
  preDoka: number;
};

export function readFeatDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): FeatDokaKeepRemountRenameSpendStamp | null {
  try {
    const raw = storage.getItem(featDokaKeepRemountRenameSpendKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<FeatDokaKeepRemountRenameSpendStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeFeatDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: FeatDokaKeepRemountRenameSpendStamp,
): void {
  try {
    storage.setItem(
      featDokaKeepRemountRenameSpendKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearFeatDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(featDokaKeepRemountRenameSpendKey(slot));
  } catch {
    // ignore
  }
}

export function hasFeatDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readFeatDokaKeepRemountRenameSpend(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #812
 * `noteFeatDokaKeepRemount` after feat throw-after-add.
 */
export function noteFeatDokaKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeFeatDokaKeepRemountRenameSpend(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

export function dokaFromFeatDokaKeepRenameSpendWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromFeatDokaKeepRenameSpendWalletRecord(
      (raw as { ok: unknown }).ok,
    );
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return toNat(n);
}

/**
 * Stale Play-entry / session cache still equals or sits below the
 * pre-keep lock. `claimAchievementReward` only adds, so a live wallet
 * that did not rise is stale (or placeholder 0). Missing live is
 * fail-closed only when a keep stamp exists.
 */
export function shouldRefuseFeatDokaKeepRemountRenameSpendStaleDoka(args: {
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
 * wallet when the #812 keep stamp says feat already invoked.
 * Stale Play-entry equal to stamped `preDoka` must not fall back to
 * remount wallet (that is the wipe: rename commits 100 over 600).
 */
export function dokaForFeatDokaKeepRemountRenameSpend(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseFeatDokaKeepRemountRenameSpendStaleDoka({
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
 * Gated fresh feat 700 → 600.
 */
export function committedDokaAfterRenameWithFeatDokaKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  const base = dokaForFeatDokaKeepRemountRenameSpend(args);
  if (base == null) return null;
  return committedDokaAfterRename(base);
}

/**
 * Upgrade lock commit. A risen replica (690) is **not** adopted by
 * `committedDokaAfterSpellUpgrade(200, 690)` (`after < before` is
 * false). Honour replica first so the advertised spend is 700 − 10 =
 * 690.
 */
export function committedDokaAfterSpellUpgradeWithFeatDokaKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  backendDokaAfter: number | undefined;
  advertisedCost: number;
}): number | null {
  const base = dokaForFeatDokaKeepRemountRenameSpend(args);
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
export function sessionDokaAfterFeatDokaKeepRemountRenameSpend(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number {
  const honoured = dokaForFeatDokaKeepRemountRenameSpend(args);
  return honoured == null ? toNat(args.remountDoka) : honoured;
}

/**
 * Leftover shop after the remount rename lock-lie. Ungated writes
 * `rename(200) − shopSpend` over the canister post-rename wallet and
 * wipes the feat grant.
 */
export function dokaAfterShopSpendWithFeatDokaKeepRemountRename(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  shopSpend: number;
}): number | null {
  const renamed = committedDokaAfterRenameWithFeatDokaKeepRemount({
    remountDoka: args.remountDoka,
    liveDoka: args.liveDoka,
    keep: args.keep,
    stampedPreDoka: args.stampedPreDoka,
  });
  if (renamed == null) return null;
  return applySpendToCommitted(renamed, args.shopSpend);
}

function refuseStaleFeatDokaKeepRemountRenameSpend(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type FeatDokaKeepRemountRenameSpendPersist = {
  snapshot: () => { doka: number };
  commit?: (next: { doka?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * Rename / upgrade remount wallet used Play-entry Doka 200 after a
 * feat claim throw-after-add. Fetch `getCallerDokaBalance` when the
 * #812 remount keep stamp exists. Stale live ≤ stamped `preDoka`
 * throws so the lock cannot commit `200 − 100`. Fresh replica is
 * adopted onto the lock **before** `applyAndCommit` so production
 * `committedDokaAfterRename(snapshot)` /
 * `committedDokaAfterSpellUpgrade(snapshot, …)` spend from 700.
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry again. Fail-close keeps the stamp. Do not skip the
 * canister rename / upgrade — those already debit stored Doka.
 */
export async function persistRenameSpendThroughFeatDokaKeepRemount<T>(args: {
  persist: FeatDokaKeepRemountRenameSpendPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readFeatDokaKeepRemountRenameSpend(args.storage, args.slot);
    if (!stamp) return args.applyAndCommit();

    let liveDoka: number | null = null;
    try {
      liveDoka = dokaFromFeatDokaKeepRenameSpendWalletRecord(
        await args.readWallet(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleFeatDokaKeepRemountRenameSpend();
    }

    const honoured = dokaForFeatDokaKeepRemountRenameSpend({
      remountDoka: toNat(args.persist.snapshot().doka),
      liveDoka,
      keep: true,
      stampedPreDoka: stamp.preDoka,
    });
    if (honoured == null) refuseStaleFeatDokaKeepRemountRenameSpend();
    args.persist.commit?.({ doka: honoured });
    clearFeatDokaKeepRemountRenameSpend(args.storage, args.slot);
    return args.applyAndCommit();
  });
}
