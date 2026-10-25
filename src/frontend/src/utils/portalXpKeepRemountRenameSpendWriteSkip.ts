/**
 * #767 stamps remount leftover XP keep after a seeded portal
 * `persistIncrementalRewards(0, 10)` throw-after-add
 * (`pbv_portal_xp_keep_remount_slotN`) and honours replica leftover on
 * remount **heal / shop** `persistAbsoluteProgress`. #912 honours that
 * stamp as the remount **death-cut** XP base. #1037 honours replica
 * leftover XP onto the remount lock **before feat / GameKey**. Those
 * helpers never enter `handleRenameCharacter` / `handleUpgradeSpell`.
 *
 * Production rename commits `committedDokaAfterRename(snapshot().doka)`
 * only. `createProgressPersist` on remount seeds GameFlow
 * `character.experience` — `handlePlayCharacter` is the only writer, so
 * that seed stays Play-entry **100** after a portal throw that already
 * added leftover +10 on the canister. Portal leftover does not change
 * Doka (Play-entry 200 matches canister 200; rename 200→100 matches the
 * canister debit). Seeded leftover `persistAbsoluteProgress` writes
 * `committed.xp` and does not fetch character leftover; a later Items
 * Buy / `saveBattleStats` incoming-below-stored wipes portal +10
 * (`main.mo` never-raise still applies a lower incoming XP). Rename /
 * Upgrade stay live after remount and do not honour leftover XP onto
 * the lock, so leftover shop after a remount rename still writes
 * Play-entry 100 over canister 110.
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
 *    GameFlow `character.experience` stays Play-entry 100.
 * 2. White portal `persistIncrementalRewards(0, 10)` invokes then
 *    throws (canister XP 110). Catch only `console.warn`s. Lock stays
 *    XP 100. No unpaid death. #767 stamps `{ preXp: 100 }`. #813 does
 *    not stamp (no parsed leftover commit). #807 stamps a different
 *    victory-throw key. #767 / #912 / #1037 do not enter rename /
 *    upgrade.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ xp: character.experience }` = **100**. Session unconfirmed
 *    flags are gone. `shouldStartRename(200)` is true.
 * 4. Leftover #767: shop / heal honour replica leftover 110. Leftover
 *    #912: death taxes replica leftover. Leftover #1037: feat / GameKey
 *    honour leftover XP then add Doka. Unique leftover: Rename
 *    `committedDokaAfterRename(200)` commits **100** (Doka matches
 *    canister 200−100) while lock XP stays **100**. Leftover shop spend
 *    50 then writes `{ xp: 100, doka: 50 }` over canister
 *    `{ xp: 110, doka: 100 }` and wipes portal +10. Upgrade with no
 *    wallet query, or with a risen leftover-XP query that does not
 *    drop Doka, commits `{ xp: 100, doka: 190 }` over canister 110/190.
 *
 * Unique vs **#767** (heal/shop honour of this stamp), **#912** (death
 * honour), **#1037** (feat / GameKey honour of this stamp — claim adds
 * Doka; rename subtracts), **#813** / **#1036** / **#1041** (successful
 * leftover-credit keep `pbv_xp_credit_keep_remount_*` — parsed commit,
 * not throw), **#807** (victory XP throw stamp), **#992** (feat Doka
 * remount rename — replica wallet rise, different key), **#977**
 * (shop/heal throw remount rename), **#986/#987** (one-shot remount
 * rename), **#1002** (spend-keep remount rename), **#1019** (GameKey
 * remount rename), **#979** (victory Doka remount rename), **#1020**
 * (Boss Rush remount rename), and **#657** (session unconfirmed keep —
 * not remount).
 *
 * This sidecar reads the same #767 stamp and honours replica leftover
 * XP onto the remount lock **before** rename / upgrade so leftover shop
 * writes leftover 110, not Play-entry 100. Stale live equal to stamped
 * `preXp` fail-closes (Play-entry still equals the pre-keep lock).
 * Level-up leftover already below `preXp` still honours. Doka
 * pickup-only (no stamp) still commits `200 − 100` with remount XP.
 *
 * Do not stamp here — #767 notes keep after a portal throw-after-add.
 * `xpDelta <= 0` never stamps (Doka-only shrine / ground / feat).
 * Explicit `applyRewards failed` never stamps (that stays on #767).
 * Do not restack WX / progressPersist / deathPenalty / applyRewardsResult
 * / rewardResolver / renameCharacter / spellUpgrade / achievementReward
 * / shopPurchase / #767 / #912 / #1037 / #1041 files.
 *
 * Tests reproduce remount rename / upgrade vs the gated leftover-XP
 * honour. Restack rename / upgrade enqueue onto
 * `persistRenameSpendThroughPortalXpKeepRemount` after #767 lands.
 * No Motoko.
 */

import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import { experienceFromCharacterRecord } from "./deathPenalty.ts";
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
 * Same key as #767 `portalXpKeepRemountKey`. Remount rename / upgrade
 * honour must read the portal-throw XP keep stamp, not a second key and
 * not #813 / #1041 leftover-credit keys or #807's victory-throw key.
 */
export function portalXpKeepRemountRenameSpendKey(slot: number): string {
  return `pbv_portal_xp_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type PortalXpKeepRemountRenameSpendStamp = {
  /** Lock leftover XP before the throw-after-add grant. */
  preXp: number;
};

export function readPortalXpKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): PortalXpKeepRemountRenameSpendStamp | null {
  try {
    const raw = storage.getItem(portalXpKeepRemountRenameSpendKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<PortalXpKeepRemountRenameSpendStamp>;
    if (parsed.preXp == null) return null;
    return { preXp: toNat(parsed.preXp) };
  } catch {
    return null;
  }
}

export function writePortalXpKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: PortalXpKeepRemountRenameSpendStamp,
): void {
  try {
    storage.setItem(
      portalXpKeepRemountRenameSpendKey(slot),
      JSON.stringify({ preXp: toNat(stamp.preXp) }),
    );
  } catch {
    // private mode
  }
}

export function clearPortalXpKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(portalXpKeepRemountRenameSpendKey(slot));
  } catch {
    // ignore
  }
}

export function hasPortalXpKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readPortalXpKeepRemountRenameSpend(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #767
 * `notePortalXpKeepRemount` after a portal throw-after-add.
 */
export function notePortalXpKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  preXp: number,
): void {
  writePortalXpKeepRemountRenameSpend(storage, slot, {
    preXp: toNat(preXp),
  });
}

/**
 * `getCharacter` leftover. Unwrap `{ ok }` bindgen Results, then read
 * `experience` (number or bigint) the same way death-replay does.
 */
export function xpFromPortalXpKeepRenameSpendCharacterRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return xpFromPortalXpKeepRenameSpendCharacterRecord(
      (raw as { ok: unknown }).ok,
    );
  }
  return experienceFromCharacterRecord(raw);
}

/**
 * Stale Play-entry leftover still equals the pre-keep lock. A fresh
 * portal leftover (pre+10) or a leftover already below pre (level-up
 * from a later victory that used this stamp in tests) must honour.
 * Missing live is fail-closed only when a keep stamp exists.
 * Equal-to-pre (not ≤) — leftover XP can legally drop below `preXp`
 * on a level-up.
 */
export function shouldRefusePortalXpKeepRemountRenameSpendStaleXp(args: {
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
 * says a portal grant may already be on the canister. Stale Play-entry
 * equal to stamped `preXp` must not fall back to remount leftover
 * (that is the wipe: leftover shop writes 100 over 110).
 */
export function xpForPortalXpKeepRemountRenameSpend(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
}): number | null {
  if (
    shouldRefusePortalXpKeepRemountRenameSpendStaleXp({
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
export function sessionXpAfterPortalXpKeepRemountRenameSpend(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
}): number {
  const honoured = xpForPortalXpKeepRemountRenameSpend(args);
  return honoured == null ? toNat(args.remountXp) : honoured;
}

/**
 * Leftover shop after the remount rename. Rename only commits Doka;
 * leftover shop `persistAbsoluteProgress` writes `committed.xp`.
 * Ungated writes Play-entry leftover over canister leftover.
 */
export function leftoverShopWriteAfterRenameWithPortalXpKeep(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
  remountDoka: number;
  shopSpend: number;
}): { xp: number; doka: number } | null {
  const xp = xpForPortalXpKeepRemountRenameSpend({
    remountXp: args.remountXp,
    liveXp: args.liveXp,
    keep: args.keep,
    stampedPreXp: args.stampedPreXp,
  });
  if (xp == null) return null;
  return {
    xp,
    doka: applySpendToCommitted(
      committedDokaAfterRename(args.remountDoka),
      args.shopSpend,
    ),
  };
}

export function leftoverShopWriteAfterUpgradeWithPortalXpKeep(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
  remountDoka: number;
  advertisedCost: number;
  backendDokaAfter: number | undefined;
  shopSpend: number;
}): { xp: number; doka: number } | null {
  const xp = xpForPortalXpKeepRemountRenameSpend({
    remountXp: args.remountXp,
    liveXp: args.liveXp,
    keep: args.keep,
    stampedPreXp: args.stampedPreXp,
  });
  if (xp == null) return null;
  return {
    xp,
    doka: applySpendToCommitted(
      committedDokaAfterSpellUpgrade(
        args.remountDoka,
        args.backendDokaAfter,
        args.advertisedCost,
      ),
      args.shopSpend,
    ),
  };
}

function refuseStalePortalXpKeepRemountRenameSpend(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type PortalXpKeepRemountRenameSpendPersist = {
  snapshot: () => { doka: number; xp: number };
  commit?: (next: { doka?: number; xp?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * Rename / upgrade remount leftover used Play-entry XP 100 after a
 * portal throw-after-add. Fetch `getCharacter` when the #767 remount
 * keep stamp exists. Stale live equal to stamped `preXp` throws so
 * leftover shop cannot write Play-entry leftover. Fresh replica
 * leftover is adopted onto the lock **before** `applyAndCommit` so
 * production leftover shop writes 110. Rename / upgrade still spend
 * Doka from `snapshot().doka` (portal leftover does not change Doka).
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry XP again. Fail-close keeps the stamp. Do not skip
 * the canister rename / upgrade — those already debit stored Doka.
 */
export async function persistRenameSpendThroughPortalXpKeepRemount<T>(args: {
  persist: PortalXpKeepRemountRenameSpendPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readCharacter: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readPortalXpKeepRemountRenameSpend(args.storage, args.slot);
    if (!stamp) return args.applyAndCommit();

    let liveXp: number | null = null;
    try {
      liveXp = xpFromPortalXpKeepRenameSpendCharacterRecord(
        await args.readCharacter(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStalePortalXpKeepRemountRenameSpend();
    }

    const honoured = xpForPortalXpKeepRemountRenameSpend({
      remountXp: toNat(args.persist.snapshot().xp),
      liveXp,
      keep: true,
      stampedPreXp: stamp.preXp,
    });
    if (honoured == null) {
      refuseStalePortalXpKeepRemountRenameSpend();
    }
    args.persist.commit?.({ xp: honoured });
    clearPortalXpKeepRemountRenameSpend(args.storage, args.slot);
    return args.applyAndCommit();
  });
}
