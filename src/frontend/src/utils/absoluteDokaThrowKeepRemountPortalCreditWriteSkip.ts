/**
 * #964 stamps remount Doka keep after shop / Doka-heal `saveBattleStats`
 * throw-after-accept (`pbv_absolute_doka_throw_keep_remount_slotN`) and
 * honours replica wallet on remount **heal / shop**
 * `persistAbsoluteProgress`. #969 honours that stamp as the remount
 * **death-cut** base. #971 skips a second Doka-heal when replica HP is
 * already the paid postHp. #977 honours replica as the remount **rename
 * / upgrade debit** base. #1021 honours it **before feat / GameKey**.
 * Those helpers never enter portal
 * `persistIncrementalRewards(0, PORTAL_TRANSITION_XP)`.
 *
 * Production portal persist commits `{ xp: persisted.newXp, level }`
 * only (`WorldExploration.tsx` 6815–6818). `createProgressPersist` on
 * remount seeds GameFlow `dokaBalance` — heal / shop catch rolls HUD
 * Doka back to Play-entry, so that seed is still **200**.
 * `persistIncrementalRewards` dokaDelta 0 still returns canister
 * `newDoka` **190** / **150**, but production does not commit it.
 * Seeded leftover `persistAbsoluteProgress` does not fetch
 * (`resolveCommittedDokaForAbsoluteWrite` 390–391); a later Items Buy
 * writes Play-entry Doka. Heal-throw canister **190** with incoming
 * **150** is incoming-below-stored and refunds the 10 Doka heal fee
 * while the paid HP still applies. Shop-throw canister **150** with
 * incoming **150** never-mints; inventory rolled back on the throw so
 * the leftover buy still lands — a free second checkout against the
 * already-paid fee. Retry of the original heal / buy cannot re-farm
 * (HP already on canister; first item was local-only). Portal `newXp`
 * *does* land (Play-entry leftover +10), so this is the shop-throw
 * dual of spend-keep × portal (#1153) with the same skip
 * (`live >= preDoka`).
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
 *    GameFlow `dokaBalance` stays 200.
 * 2. Doka-heal `saveBattleStats` accepts Doka 190 then throws
 *    (`replica went away`). Commit never runs. Catch returns false.
 *    Heal rollback HUD 200. Same class: Items Buy accepts Doka 150
 *    then throws; HUD + inventory roll back. No unpaid death. #964
 *    stamps `{ preDoka: 200 }`. #964 / #969 / #971 / #977 / #1021 do
 *    not enter portal persist. Overworld portals stay live after
 *    remount.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance, xp: character.experience }` = **200 / 100**.
 *    Session unconfirmed flags (#387 WeakMap) are gone.
 * 4. Leftover #964: shop / heal honour replica 190 / 150. Leftover
 *    #969: death taxes replica. Leftover #977: rename / upgrade debit
 *    from replica. Leftover #1021: feat / GameKey add onto replica.
 *    Unique leftover: portal `persistIncrementalRewards(0, 10)` `#ok`
 *    commits leftover+10 XP **110** while lock Doka stays **200**.
 *    Leftover shop spend 50 writes `{ xp: 110, doka: 150 }` over
 *    canister `{ xp: 110, doka: 190 }` (refunds the heal fee) or
 *    `{ xp: 110, doka: 150 }` (never-mint free leftover item).
 *
 * Unique vs **#964** (heal/shop honour of this stamp), **#969** (death
 * honour), **#971** (second Doka-heal skip of the #860 HP stamp),
 * **#977** (rename/upgrade debit), **#1021** (feat / GameKey additive —
 * claim adds a granted Nat; portal dokaDelta is 0), **#1153** (spend
 * keep `pbv_spend_keep_remount_*` × portal — rename / upgrade throw,
 * not `saveBattleStats`), **#1129** / **#1145** / **#1147** / **#1149**
 * / **#1151** (credit Doka stamps × portal — skip `live <= preDoka`),
 * **#767** / **#1092** (portal XP throw then leftover-XP — reverse
 * order, leftover **XP**), and **#657** (session unconfirmed keep —
 * not remount).
 *
 * This sidecar reads the same #964 stamp and honours replica wallet
 * onto the remount lock **before** portal persist so leftover shop
 * writes 190 / 150, not Play-entry 200. Stale live ≥ stamped `preDoka`
 * fail-closes (`saveBattleStats` shop / heal only debit — a live
 * wallet that did not drop is stale or the rollback cache).
 * Pickup-only portal (no stamp) still commits leftover+10 XP with
 * remount Doka.
 *
 * Do not stamp here — #964 notes keep after shop / heal
 * throw-after-accept. `dokaDelta <= 0` never stamps (portal). Explicit
 * `saveBattleStats failed` never stamps. Do not restack WX /
 * progressPersist / deathPenalty / applyRewardsResult /
 * rewardResolver / achievementReward / shopPurchase / renameCharacter /
 * spellUpgrade / dokaPersist / itemShop / BuffShop / #964 / #969 /
 * #971 / #977 / #1021 / #1153 files.
 *
 * Tests reproduce remount portal vs the gated Doka honour. Restack
 * portal enqueue onto
 * `persistIncrementalRewardsThroughAbsoluteDokaThrowKeepRemount` after
 * #964 lands. No Motoko.
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
 * Same key as #964 `absoluteDokaThrowKeepRemountKey`. Remount portal
 * honour must read the shop / heal throw-after-accept stamp, not a
 * second key and not #1153 spend-keep keys, #1129 victory Doka keys,
 * #1145 one-shot Doka keys, or leftover-XP keys.
 */
export function absoluteDokaThrowKeepRemountPortalCreditKey(
  slot: number,
): string {
  return `pbv_absolute_doka_throw_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type AbsoluteDokaThrowKeepRemountPortalCreditStamp = {
  /** Lock wallet before the shop / heal saveBattleStats throw. */
  preDoka: number;
};

export function readAbsoluteDokaThrowKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): AbsoluteDokaThrowKeepRemountPortalCreditStamp | null {
  try {
    const raw = storage.getItem(
      absoluteDokaThrowKeepRemountPortalCreditKey(slot),
    );
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<AbsoluteDokaThrowKeepRemountPortalCreditStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeAbsoluteDokaThrowKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: AbsoluteDokaThrowKeepRemountPortalCreditStamp,
): void {
  try {
    storage.setItem(
      absoluteDokaThrowKeepRemountPortalCreditKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearAbsoluteDokaThrowKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(absoluteDokaThrowKeepRemountPortalCreditKey(slot));
  } catch {
    // ignore
  }
}

export function hasAbsoluteDokaThrowKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readAbsoluteDokaThrowKeepRemountPortalCredit(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #964
 * `noteAbsoluteDokaThrowKeepRemount` after shop / heal
 * throw-after-accept.
 */
export function noteAbsoluteDokaThrowKeepRemountPortalCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeAbsoluteDokaThrowKeepRemountPortalCredit(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

/**
 * `getCallerDokaBalance` wallet. Unwrap `{ ok }` bindgen Results, then
 * read a number or bigint the same way death-replay does.
 */
export function dokaFromAbsoluteDokaThrowKeepRemountPortalCreditWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromAbsoluteDokaThrowKeepRemountPortalCreditWalletRecord(
      (raw as { ok: unknown }).ok,
    );
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return toNat(n);
}

/**
 * Stale Play-entry / rollback HUD still equals or sits above the
 * pre-spend lock. Shop / heal only debit, so a live wallet that did
 * not drop is stale (or the rollback cache). Missing live is
 * fail-closed only when a keep stamp exists.
 */
export function shouldRefuseAbsoluteDokaThrowKeepRemountPortalCreditStaleDoka(args: {
  keep: boolean;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) >= toNat(args.stampedPreDoka);
}

/**
 * Honour remount Doka from replica when the #964 keep stamp says a
 * shop / heal fee may already be on the canister. Stale Play-entry
 * equal to stamped `preDoka` must not fall back to remount wallet
 * (that is the refund leftover).
 */
export function dokaForAbsoluteDokaThrowKeepRemountPortalCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseAbsoluteDokaThrowKeepRemountPortalCreditStaleDoka({
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
 * Session wallet after remount. Ungated Play-entry 200 still looks
 * like the pre-spend wallet so leftover shop writes a lie. Honour
 * replica so persistAbsoluteProgress writes 190 / 150.
 */
export function sessionDokaAfterAbsoluteDokaThrowKeepRemountPortalCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number {
  const honoured = dokaForAbsoluteDokaThrowKeepRemountPortalCredit(args);
  return honoured == null ? toNat(args.remountDoka) : honoured;
}

/**
 * Production portal persist commits leftover+10 XP from applyRewards
 * `newXp` / `newLevel`. Doka stays whatever the remount lock holds
 * unless this sidecar honoured replica first.
 */
export function committedProgressAfterPortalWithAbsoluteDokaThrowKeep(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  portalNewXp: number;
  portalNewLevel: number;
}): { doka: number; xp: number; level: number } | null {
  const doka = dokaForAbsoluteDokaThrowKeepRemountPortalCredit(args);
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
 * shop / heal Doka.
 */
export function leftoverShopWriteAfterPortalWithAbsoluteDokaThrowKeep(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  portalNewXp: number;
  portalNewLevel: number;
  shopSpend: number;
}): { xp: number; doka: number } | null {
  const afterPortal =
    committedProgressAfterPortalWithAbsoluteDokaThrowKeep(args);
  if (afterPortal == null) return null;
  return {
    xp: afterPortal.xp,
    doka: applySpendToCommitted(afterPortal.doka, args.shopSpend),
  };
}

function refuseStaleAbsoluteDokaThrowKeepRemountPortalCredit(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type AbsoluteDokaThrowKeepRemountPortalCreditPersist = {
  snapshot: () => { doka: number; xp: number; level: number };
  commit?: (next: { doka?: number; xp?: number; level?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * Portal remount wallet used Play-entry Doka 200 after a shop / heal
 * saveBattleStats throw-after-accept. Fetch `getCallerDokaBalance`
 * when the #964 remount keep stamp exists. Stale live ≥ stamped
 * `preDoka` throws so leftover shop cannot write Play-entry Doka.
 * Fresh replica is adopted onto the lock **before** `applyAndCommit`
 * so production leftover shop writes 190 / 150, not 200. Portal still
 * commits XP / level from applyRewards `newXp` (this sidecar does not
 * reconstruct an XP keep — that is #767 / #813 / #807).
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry Doka again. Fail-close keeps the stamp. Do not skip
 * the canister portal +10 — applyRewards already added leftover XP.
 */
export async function persistPortalThroughAbsoluteDokaThrowKeepRemount<
  T,
>(args: {
  persist: AbsoluteDokaThrowKeepRemountPortalCreditPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readAbsoluteDokaThrowKeepRemountPortalCredit(
      args.storage,
      args.slot,
    );
    if (!stamp) return args.applyAndCommit();

    let liveDoka: number | null = null;
    try {
      liveDoka = dokaFromAbsoluteDokaThrowKeepRemountPortalCreditWalletRecord(
        await args.readWallet(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleAbsoluteDokaThrowKeepRemountPortalCredit();
    }

    const honoured = dokaForAbsoluteDokaThrowKeepRemountPortalCredit({
      remountDoka: toNat(args.persist.snapshot().doka),
      liveDoka,
      keep: true,
      stampedPreDoka: stamp.preDoka,
    });
    if (honoured == null) {
      refuseStaleAbsoluteDokaThrowKeepRemountPortalCredit();
    }
    args.persist.commit?.({ doka: honoured });
    clearAbsoluteDokaThrowKeepRemountPortalCredit(args.storage, args.slot);
    return args.applyAndCommit();
  });
}

/**
 * Production portal already enqueues, then `persistIncrementalRewards`
 * + `{ xp, level }` commit. Honour replica Doka first, then run that
 * body without a nested queue hop.
 */
export async function persistIncrementalRewardsThroughAbsoluteDokaThrowKeepRemount(args: {
  // Same loose actor type as persistIncrementalRewards — Caffeine bindings vary.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actor: any;
  persist: AbsoluteDokaThrowKeepRemountPortalCreditPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  dokaDelta: number;
  xpDelta: number;
  readWallet: () => Promise<unknown>;
}): Promise<ApplyRewardsOk> {
  return persistPortalThroughAbsoluteDokaThrowKeepRemount({
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
