/**
 * #767 stamps remount leftover XP keep after a seeded portal
 * `persistIncrementalRewards(0, 10)` throw-after-add
 * (`pbv_portal_xp_keep_remount_slotN`) and honours replica leftover on
 * remount **heal / shop** `persistAbsoluteProgress`. #912 honours that
 * stamp as the remount **death-cut** XP base. #1037 honours replica
 * leftover XP onto the remount lock **before feat / GameKey**. #1045 /
 * #1046 honour it **before rename / upgrade**. Those helpers never
 * enter shrine / ground / dungeon-complete `persistDokaCreditResult` →
 * `settleOneShotPersistLock`.
 *
 * Production one-shot settle commits `{ doka: newDoka }` only.
 * `createProgressPersist` on remount seeds GameFlow
 * `character.experience` — `handlePlayCharacter` is the only writer, so
 * that seed stays Play-entry **100** after a portal throw that already
 * added leftover +10 on the canister. Seeded leftover
 * `persistAbsoluteProgress` writes `committed.xp` and does not fetch
 * character leftover; a later Items Buy / `saveBattleStats`
 * incoming-below-stored wipes portal +10 (`main.mo` never-raise still
 * applies a lower incoming XP). Ground Doka / shrine altar /
 * dungeon-complete stay live after remount and do not honour leftover
 * XP onto the lock, so leftover shop after a remount pickup still
 * writes Play-entry 100 over canister 110.
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
 *    GameFlow `character.experience` stays Play-entry 100.
 * 2. White portal `persistIncrementalRewards(0, 10)` invokes then
 *    throws (canister leftover 110). Catch only `console.warn`s. Lock
 *    stays XP 100. No unpaid death. #767 stamps `{ preXp: 100 }`. #813
 *    / #1041 do not stamp (no parsed leftover commit). #807 / #1088
 *    stamp a different victory-throw key. #800 / #1029 stamp one-shot
 *    **Doka** keep, not leftover XP. #767 / #912 / #1037 / #1045 do
 *    not enter persistDokaCredit.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ xp: character.experience }` = **100**. Session unconfirmed
 *    flags are gone.
 * 4. Leftover #767: shop / heal honour replica leftover 110. Leftover
 *    #912: death taxes replica leftover. Leftover #1037: feat /
 *    GameKey honour leftover XP then add Doka. Leftover #1045: rename
 *    / upgrade honour leftover XP then debit Doka. Unique leftover:
 *    Ground `applyRewards(slot, 50, 0)` `#ok` settle commits Doka
 *    **250** while lock XP stays **100**. Leftover shop spend 50 then
 *    writes `{ xp: 100, doka: 200 }` over canister `{ xp: 110, doka:
 *    250 }` and wipes portal leftover. Shrine +300 is the same XP wipe
 *    on `{ xp: 100, doka: 450 }` over canister 500/110.
 *
 * Unique vs **#767** (heal/shop honour of this stamp), **#912** (death
 * honour), **#1037** (feat / GameKey honour — claim adds a granted
 * Nat; one-shot commits applyRewards absolute `newDoka`), **#1045** /
 * **#1046** (rename / upgrade debit), **#813** / **#1041** (successful
 * leftover XP keep `pbv_xp_credit_keep_remount_*` — parsed commit, not
 * throw), **#807** / **#1088** (victory XP throw
 * `pbv_victory_xp_keep_remount_*` — leftover +80, different key),
 * **#800** / **#1029** (one-shot Doka keep
 * `pbv_oneshot_doka_keep_remount_*` — replica wallet rise, different
 * key), **#1028** (victory Doka), and **#657** (session unconfirmed
 * keep — not remount).
 *
 * This sidecar reads the same #767 stamp and honours replica leftover
 * XP onto the remount lock **before** one-shot settle so leftover shop
 * writes leftover 110, not Play-entry 100. Stale live equal to stamped
 * `preXp` fail-closes (Play-entry still equals the pre-keep lock).
 * Level-up leftover already below `preXp` still honours. Doka
 * pickup-only (no stamp) still commits `newDoka` with remount XP.
 *
 * Do not stamp here — #767 notes keep after a portal throw-after-add.
 * `xpDelta <= 0` never stamps (Doka-only shrine / ground / feat).
 * Explicit `applyRewards failed` never stamps (that stays on #767).
 * Do not restack WX / progressPersist / deathPenalty / dokaPersist /
 * applyRewardsResult / rewardResolver / achievementReward /
 * shopPurchase / renameCharacter / spellUpgrade / #767 / #912 / #1037
 * / #1045 / #800 / #1029 / #1088 files.
 *
 * Tests reproduce remount ground / shrine / dungeon-complete vs the
 * gated leftover-XP honour. Restack one-shot enqueue onto
 * `persistDokaCreditThroughPortalXpKeepRemount` after #767 lands.
 * No Motoko.
 */

import {
  type DeathPenaltyStorage,
  experienceFromCharacterRecord,
} from "./deathPenalty.ts";
import {
  type DokaCreditActor,
  persistDokaCreditResult,
  resolveOneShotCreditSettle,
  settleOneShotPersistLock,
} from "./dokaPersist.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
} from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

/**
 * Same key as #767 `portalXpKeepRemountKey`. Remount one-shot honour
 * must read the portal-throw XP keep stamp, not a second key and not
 * #813 / #1041 leftover-credit keys, #807 / #1088 victory-throw keys, or
 * #800 / #1029 one-shot Doka keys.
 */
export function portalXpKeepRemountOneShotCreditKey(slot: number): string {
  return `pbv_portal_xp_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type PortalXpKeepRemountOneShotCreditStamp = {
  /** Lock leftover XP before the throw-after-add grant. */
  preXp: number;
};

export function readPortalXpKeepRemountOneShotCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): PortalXpKeepRemountOneShotCreditStamp | null {
  try {
    const raw = storage.getItem(portalXpKeepRemountOneShotCreditKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<PortalXpKeepRemountOneShotCreditStamp>;
    if (parsed.preXp == null) return null;
    return { preXp: toNat(parsed.preXp) };
  } catch {
    return null;
  }
}

export function writePortalXpKeepRemountOneShotCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: PortalXpKeepRemountOneShotCreditStamp,
): void {
  try {
    storage.setItem(
      portalXpKeepRemountOneShotCreditKey(slot),
      JSON.stringify({ preXp: toNat(stamp.preXp) }),
    );
  } catch {
    // private mode
  }
}

export function clearPortalXpKeepRemountOneShotCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(portalXpKeepRemountOneShotCreditKey(slot));
  } catch {
    // ignore
  }
}

export function hasPortalXpKeepRemountOneShotCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readPortalXpKeepRemountOneShotCredit(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #767
 * `notePortalXpKeepRemount` after a portal throw-after-add.
 */
export function notePortalXpKeepRemountOneShotCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  preXp: number,
): void {
  writePortalXpKeepRemountOneShotCredit(storage, slot, {
    preXp: toNat(preXp),
  });
}

/**
 * `getCharacter` leftover. Unwrap `{ ok }` bindgen Results, then read
 * `experience` (number or bigint) the same way death-replay does.
 */
export function xpFromPortalXpKeepOneShotCreditCharacterRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return xpFromPortalXpKeepOneShotCreditCharacterRecord(
      (raw as { ok: unknown }).ok,
    );
  }
  return experienceFromCharacterRecord(raw);
}

/**
 * Stale Play-entry leftover still equals the pre-keep lock. A fresh
 * portal leftover (pre+10) or leftover already below preXp (level-up)
 * must honour. Missing live is fail-closed only when a keep stamp
 * exists. Equal-to-pre (not ≤) — leftover XP can legally drop below
 * `preXp` on a level-up.
 */
export function shouldRefusePortalXpKeepRemountOneShotCreditStaleXp(args: {
  keep: boolean;
  liveXp: number | null;
  stampedPreXp: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveXp == null) return true;
  return toNat(args.liveXp) === toNat(args.stampedPreXp);
}

/**
 * Honour remount leftover XP from replica when the #767 keep stamp
 * says a portal grant may already be on the canister. Stale
 * Play-entry equal to stamped `preXp` must not fall back to remount
 * leftover (that is the wipe: leftover shop writes 100 over 110).
 */
export function xpForPortalXpKeepRemountOneShotCredit(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
}): number | null {
  if (
    shouldRefusePortalXpKeepRemountOneShotCreditStaleXp({
      keep: args.keep,
      liveXp: args.liveXp,
      stampedPreXp: args.stampedPreXp,
    })
  ) {
    return null;
  }
  if (args.keep === true) {
    return args.liveXp == null ? null : toNat(args.liveXp);
  }
  return toNat(args.remountXp);
}

/**
 * Session leftover XP after remount. Ungated Play-entry 100 still
 * looks like the pre-grant leftover so leftover shop writes a lie.
 * Honour replica so persistAbsoluteProgress writes leftover 110.
 */
export function sessionXpAfterPortalXpKeepRemountOneShotCredit(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
}): number {
  const honoured = xpForPortalXpKeepRemountOneShotCredit(args);
  return honoured == null ? toNat(args.remountXp) : honoured;
}

/**
 * Production one-shot settle commits applyRewards absolute `newDoka`,
 * not `snapshot + pickup`. Leftover shop then spends from that wallet.
 */
export function committedDokaAfterOneShotWithPortalXpKeep(
  canisterNewDoka: number,
): number {
  return toNat(canisterNewDoka);
}

/**
 * Leftover shop after the remount pickup. One-shot settle only commits
 * Doka; leftover shop `persistAbsoluteProgress` writes `committed.xp`.
 * Ungated writes Play-entry leftover over canister leftover.
 */
export function leftoverShopWriteAfterOneShotWithPortalXpKeep(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
  canisterNewDoka: number;
  shopSpend: number;
}): { xp: number; doka: number } | null {
  const xp = xpForPortalXpKeepRemountOneShotCredit({
    remountXp: args.remountXp,
    liveXp: args.liveXp,
    keep: args.keep,
    stampedPreXp: args.stampedPreXp,
  });
  if (xp == null) return null;
  return {
    xp,
    doka: applySpendToCommitted(
      committedDokaAfterOneShotWithPortalXpKeep(args.canisterNewDoka),
      args.shopSpend,
    ),
  };
}

function refuseStalePortalXpKeepRemountOneShotCredit(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type PortalXpKeepRemountOneShotPersist = {
  snapshot: () => { doka: number; xp: number };
  commit?: (next: { doka?: number; xp?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
  isWalletSeeded?: () => boolean;
  noteUnconfirmedCredit?: () => void;
};

/**
 * One-shot remount leftover used Play-entry XP 100 after a portal
 * throw-after-add. Fetch `getCharacter` when the #767 remount keep
 * stamp exists. Stale live equal to stamped `preXp` throws so leftover
 * shop cannot write Play-entry leftover. Fresh replica leftover is
 * adopted onto the lock **before** `applyAndCommit` so production
 * leftover shop writes 110. One-shot still commits Doka from
 * applyRewards `newDoka` (this sidecar does not reconstruct a Doka
 * keep — that is #800 / #1029).
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry XP again. Fail-close keeps the stamp. Do not skip
 * the canister pickup — applyRewards already added stored Doka.
 */
export async function persistOneShotThroughPortalXpKeepRemount<T>(args: {
  persist: PortalXpKeepRemountOneShotPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readCharacter: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readPortalXpKeepRemountOneShotCredit(args.storage, args.slot);
    if (!stamp) return args.applyAndCommit();

    let liveXp: number | null = null;
    try {
      liveXp = xpFromPortalXpKeepOneShotCreditCharacterRecord(
        await args.readCharacter(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStalePortalXpKeepRemountOneShotCredit();
    }

    const honoured = xpForPortalXpKeepRemountOneShotCredit({
      remountXp: toNat(args.persist.snapshot().xp),
      liveXp,
      keep: true,
      stampedPreXp: stamp.preXp,
    });
    if (honoured == null) {
      refuseStalePortalXpKeepRemountOneShotCredit();
    }
    args.persist.commit?.({ xp: honoured });
    clearPortalXpKeepRemountOneShotCredit(args.storage, args.slot);
    return args.applyAndCommit();
  });
}

/**
 * Production shrine / ground / dungeon-complete already enqueue, then
 * `persistDokaCreditResult` + settle. Honour replica leftover XP first,
 * then run that body without a nested queue hop.
 */
export async function persistDokaCreditThroughPortalXpKeepRemount(args: {
  actor: DokaCreditActor;
  persist: PortalXpKeepRemountOneShotPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  amount: number;
  readCharacter: () => Promise<unknown>;
  readWallet: () => Promise<unknown>;
}): Promise<"commit" | "release" | "keep"> {
  return persistOneShotThroughPortalXpKeepRemount({
    persist: args.persist,
    storage: args.storage,
    slot: args.slot,
    readCharacter: args.readCharacter,
    applyAndCommit: async () => {
      const credited = await persistDokaCreditResult(
        args.actor,
        args.slot,
        args.amount,
      );
      const settle = await resolveOneShotCreditSettle(credited, {
        committedDoka: args.persist.snapshot().doka,
        walletSeeded: args.persist.isWalletSeeded?.() === true,
        readWallet: args.readWallet,
      });
      settleOneShotPersistLock(
        {
          commit: (next: { doka?: number }) => {
            args.persist.commit?.(next);
          },
          noteUnconfirmedCredit: () => {
            args.persist.noteUnconfirmedCredit?.();
          },
        },
        settle,
      );
      return settle.kind;
    },
  });
}
