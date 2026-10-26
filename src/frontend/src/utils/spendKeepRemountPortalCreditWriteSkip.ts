/**
 * #926 stamps remount Doka spend keep after rename / upgrade
 * throw-after-debit (`pbv_spend_keep_remount_slotN`) and honours replica
 * wallet on remount **heal / shop** `persistAbsoluteProgress`. #938
 * honours that stamp as the remount **death-cut** base. #1002 honours
 * replica as the remount **rename / upgrade debit** base. #1024 honours
 * it **before feat / GameKey**. Those helpers never enter portal
 * `persistIncrementalRewards(0, PORTAL_TRANSITION_XP)`.
 *
 * Production portal persist commits `{ xp: persisted.newXp, level }`
 * only (`WorldExploration.tsx` 6815–6818). `createProgressPersist` on
 * remount seeds GameFlow `dokaBalance` — HUD debit waits for parsed
 * `#ok`, and the throw-after-debit catch only toasts, so that seed is
 * still **200**. `persistIncrementalRewards` dokaDelta 0 still returns
 * canister `newDoka` **100** / **190**, but production does not commit
 * it. Seeded leftover `persistAbsoluteProgress` does not fetch
 * (`resolveCommittedDokaForAbsoluteWrite` 390–391); a later Items Buy
 * writes Play-entry Doka. `saveBattleStats` never mints
 * incoming-above-stored, so rename canister **100** stays put while the
 * item still lands — a free purchase. Upgrade canister **190** with
 * incoming **150** is incoming-below-stored and refunds the 10 Doka
 * fee. Retry hits "already renamed" / the spell level already rose, so
 * the fee cannot be re-farmed. Portal `newXp` *does* land (Play-entry
 * leftover +10), so this is the spend-keep dual of GameKey Doka keep ×
 * portal (#1147) with inverted skip (`live >= preDoka`).
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
 *    GameFlow `dokaBalance` stays 200: HUD debit waits for parsed
 *    `#ok` / `persistSpellUpgrade` return, and
 *    `shouldApplyCallerDokaHydrate` ignores later wallet refetches
 *    while the world session is mounted.
 * 2. Rename `renameCharacter` deducts 100 (canister 100) then throws
 *    transport. `#ok` is never parsed. Commit never runs. Catch only
 *    toasts. Upgrade `upgradeSpell` deducts 10 (canister 190) then
 *    throws the same way. Lock stays 200/100. No unpaid death. #926
 *    stamps `{ preDoka: 200 }`. #926 / #938 / #1002 / #1024 do not
 *    enter portal persist. Overworld portals stay live after remount.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance, xp: character.experience }` = **200 / 100**.
 *    Session unconfirmed-spend flags (#387 WeakMap) are gone.
 * 4. Leftover #926: shop / heal honour replica 100 / 190. Leftover
 *    #938: death taxes replica. Leftover #1002: rename / upgrade debit
 *    from replica. Leftover #1024: feat / GameKey add onto replica.
 *    Unique leftover: portal `persistIncrementalRewards(0, 10)` `#ok`
 *    commits leftover+10 XP **110** while lock Doka stays **200**.
 *    Leftover shop spend 50 writes `{ xp: 110, doka: 150 }` over
 *    canister `{ xp: 110, doka: 100 }` (never-mint free item) or
 *    `{ xp: 110, doka: 190 }` (incoming-below refunds the upgrade fee).
 *
 * Unique vs **#926** (heal/shop honour of this stamp), **#938** (death
 * honour), **#1002** (rename/upgrade debit), **#1024** (feat / GameKey
 * additive — claim adds a granted Nat; portal dokaDelta is 0), **#1147**
 * (GameKey Doka `pbv_gamekey_doka_keep_remount_*` × portal — credit
 * skip `live <= preDoka`, opposite of spend), **#1129** / **#1145** /
 * **#1149** / **#1151** (credit Doka stamps × portal), **#964** (shop /
 * heal throw-after-accept stamp), **#767** / **#1092** (portal XP throw
 * then leftover-XP — reverse order, leftover **XP**), and **#657**
 * (session unconfirmed keep — not remount).
 *
 * This sidecar reads the same #926 stamp and honours replica wallet
 * onto the remount lock **before** portal persist so leftover shop
 * writes 100 / 190, not Play-entry 200. Stale live ≥ stamped `preDoka`
 * fail-closes (`renameCharacter` / `upgradeSpell` only debit — a live
 * wallet that did not drop is stale or the Play-entry cache).
 * Pickup-only portal (no stamp) still commits leftover+10 XP with
 * remount Doka.
 *
 * Do not stamp here — #926 notes keep after rename / upgrade
 * throw-after-debit. `dokaDelta <= 0` never stamps (portal). Explicit
 * `upgradeSpell failed` / `renameCharacter failed` never stamps. Do not
 * restack WX / progressPersist / deathPenalty / applyRewardsResult /
 * rewardResolver / achievementReward / shopPurchase / renameCharacter /
 * spellUpgrade / dokaPersist / itemShop / BuffShop / #926 / #938 /
 * #1002 / #1024 / #1147 files.
 *
 * Tests reproduce remount portal vs the gated Doka honour. Restack
 * portal enqueue onto
 * `persistIncrementalRewardsThroughSpendKeepRemount` after #926
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
 * Same key as #926 `spendKeepRemountKey`. Remount portal honour must
 * read the rename / upgrade throw-after-debit stamp, not a second key
 * and not #1147 GameKey Doka keys, #1129 victory Doka keys, #1145
 * one-shot Doka keys, #964 shop-throw keys, or leftover-XP keys.
 */
export function spendKeepRemountPortalCreditKey(slot: number): string {
  return `pbv_spend_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type SpendKeepRemountPortalCreditStamp = {
  /** Lock wallet before the throw-after-debit spend. */
  preDoka: number;
};

export function readSpendKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): SpendKeepRemountPortalCreditStamp | null {
  try {
    const raw = storage.getItem(spendKeepRemountPortalCreditKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<SpendKeepRemountPortalCreditStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeSpendKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: SpendKeepRemountPortalCreditStamp,
): void {
  try {
    storage.setItem(
      spendKeepRemountPortalCreditKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearSpendKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(spendKeepRemountPortalCreditKey(slot));
  } catch {
    // ignore
  }
}

export function hasSpendKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readSpendKeepRemountPortalCredit(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #926
 * `noteSpendKeepRemount` after rename / upgrade throw-after-debit.
 */
export function noteSpendKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeSpendKeepRemountPortalCredit(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

/**
 * `getCallerDokaBalance` wallet. Unwrap `{ ok }` bindgen Results, then
 * read a number or bigint the same way death-replay does.
 */
export function dokaFromSpendKeepRemountPortalCreditWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromSpendKeepRemountPortalCreditWalletRecord(
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
export function shouldRefuseSpendKeepRemountPortalCreditStaleDoka(args: {
  keep: boolean;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) >= toNat(args.stampedPreDoka);
}

/**
 * Honour remount Doka from replica when the #926 keep stamp says a
 * rename / upgrade fee may already be on the canister. Stale
 * Play-entry equal to stamped `preDoka` must not fall back to remount
 * wallet (that is the free-item leftover).
 */
export function dokaForSpendKeepRemountPortalCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseSpendKeepRemountPortalCreditStaleDoka({
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
 * the pre-debit wallet so leftover shop writes a lie. Honour replica so
 * persistAbsoluteProgress writes 100 / 190.
 */
export function sessionDokaAfterSpendKeepRemountPortalCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number {
  const honoured = dokaForSpendKeepRemountPortalCredit(args);
  return honoured == null ? toNat(args.remountDoka) : honoured;
}

/**
 * Production portal persist commits leftover+10 XP from applyRewards
 * `newXp` / `newLevel`. Doka stays whatever the remount lock holds
 * unless this sidecar honoured replica first.
 */
export function committedProgressAfterPortalWithSpendKeep(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  portalNewXp: number;
  portalNewLevel: number;
}): { doka: number; xp: number; level: number } | null {
  const doka = dokaForSpendKeepRemountPortalCredit(args);
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
 * rename / upgrade Doka.
 */
export function leftoverShopWriteAfterPortalWithSpendKeep(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  portalNewXp: number;
  portalNewLevel: number;
  shopSpend: number;
}): { xp: number; doka: number } | null {
  const afterPortal = committedProgressAfterPortalWithSpendKeep(args);
  if (afterPortal == null) return null;
  return {
    xp: afterPortal.xp,
    doka: applySpendToCommitted(afterPortal.doka, args.shopSpend),
  };
}

function refuseStaleSpendKeepRemountPortalCredit(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type SpendKeepRemountPortalCreditPersist = {
  snapshot: () => { doka: number; xp: number; level: number };
  commit?: (next: { doka?: number; xp?: number; level?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * Portal remount wallet used Play-entry Doka 200 after a rename /
 * upgrade throw-after-debit. Fetch `getCallerDokaBalance` when the #926
 * remount keep stamp exists. Stale live ≥ stamped `preDoka` throws so
 * leftover shop cannot write Play-entry Doka. Fresh replica is adopted
 * onto the lock **before** `applyAndCommit` so production leftover shop
 * writes 100 / 190, not 200. Portal still commits XP / level from
 * applyRewards `newXp` (this sidecar does not reconstruct an XP keep —
 * that is #767 / #813 / #807).
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry Doka again. Fail-close keeps the stamp. Do not skip
 * the canister portal +10 — applyRewards already added leftover XP.
 */
export async function persistPortalThroughSpendKeepRemount<T>(args: {
  persist: SpendKeepRemountPortalCreditPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readSpendKeepRemountPortalCredit(args.storage, args.slot);
    if (!stamp) return args.applyAndCommit();

    let liveDoka: number | null = null;
    try {
      liveDoka = dokaFromSpendKeepRemountPortalCreditWalletRecord(
        await args.readWallet(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleSpendKeepRemountPortalCredit();
    }

    const honoured = dokaForSpendKeepRemountPortalCredit({
      remountDoka: toNat(args.persist.snapshot().doka),
      liveDoka,
      keep: true,
      stampedPreDoka: stamp.preDoka,
    });
    if (honoured == null) {
      refuseStaleSpendKeepRemountPortalCredit();
    }
    args.persist.commit?.({ doka: honoured });
    clearSpendKeepRemountPortalCredit(args.storage, args.slot);
    return args.applyAndCommit();
  });
}

/**
 * Production portal already enqueues, then `persistIncrementalRewards`
 * + `{ xp, level }` commit. Honour replica Doka first, then run that
 * body without a nested queue hop.
 */
export async function persistIncrementalRewardsThroughSpendKeepRemount(args: {
  // Same loose actor type as persistIncrementalRewards — Caffeine bindings vary.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actor: any;
  persist: SpendKeepRemountPortalCreditPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  dokaDelta: number;
  xpDelta: number;
  readWallet: () => Promise<unknown>;
}): Promise<ApplyRewardsOk> {
  return persistPortalThroughSpendKeepRemount({
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
