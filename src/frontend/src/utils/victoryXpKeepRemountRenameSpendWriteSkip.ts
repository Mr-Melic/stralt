/**
 * #807 stamps remount leftover XP keep after a seeded victory /
 * Boss Rush room-clear `resolveBattleRewards` → `applyRewards`
 * throw-after-add (`pbv_victory_xp_keep_remount_slotN`) and honours
 * replica leftover on remount **heal / shop** `persistAbsoluteProgress`.
 * #918 honours that stamp as the remount **death-cut** XP base. #1043
 * honours replica leftover XP onto the remount lock **before feat /
 * GameKey**. Those helpers never enter `handleRenameCharacter` /
 * `handleUpgradeSpell`.
 *
 * Production rename commits `committedDokaAfterRename(snapshot().doka)`
 * only. `createProgressPersist` on remount seeds GameFlow
 * `character.experience` — `handlePlayCharacter` is the only writer, so
 * that seed stays Play-entry **100** after a victory throw that already
 * added leftover +80 on the canister. Seeded leftover
 * `persistAbsoluteProgress` writes `committed.xp` and does not fetch
 * character leftover; a later Items Buy / `saveBattleStats`
 * incoming-below-stored wipes victory leftover (`main.mo` never-raise
 * still applies a lower incoming XP). Rename / Upgrade stay live after
 * remount and do not honour leftover XP onto the lock, so leftover shop
 * after a remount rename still writes Play-entry 100 over canister 180.
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
 *    GameFlow `character.experience` stays Play-entry 100.
 * 2. Victory `applyRewards(slot, doka, 80)` invokes then throws
 *    (canister leftover 180). Catch only `logDebugInfo`s. Lock stays
 *    XP 100. No unpaid death. #807 stamps `{ preXp: 100 }`. #813 /
 *    #1041 do not stamp (no parsed leftover commit). #767 / #1045
 *    stamp a different portal-throw key. #807 / #918 / #1043 do not
 *    enter rename / upgrade. Victory Doka rise is a different stamp
 *    (#774 / #979).
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ xp: character.experience }` = **100**. Session unconfirmed
 *    flags are gone. `shouldStartRename(200)` is true.
 * 4. Leftover #807: shop / heal honour replica leftover 180. Leftover
 *    #918: death taxes replica leftover. Leftover #1043: feat / GameKey
 *    honour leftover XP then add Doka. Unique leftover: Rename
 *    `committedDokaAfterRename(200)` commits **100** (Doka matches
 *    canister 200−100 when the throw was XP-only) while lock XP stays
 *    **100**. Leftover shop spend 50 then writes `{ xp: 100, doka: 50 }`
 *    over canister `{ xp: 180, doka: 100 }` and wipes victory leftover.
 *    Upgrade with no wallet query, or with a risen leftover-XP query
 *    that does not drop Doka, commits `{ xp: 100, doka: 190 }` over
 *    canister 180/190.
 *
 * Unique vs **#807** (heal/shop honour of this stamp), **#918** (death
 * honour), **#1043** (feat / GameKey honour of this stamp — claim adds
 * Doka; rename subtracts), **#813** / **#1041** (successful leftover XP
 * keep `pbv_xp_credit_keep_remount_*` — parsed commit, not throw),
 * **#767** / **#1045** (portal XP throw `pbv_portal_xp_keep_remount_*`),
 * **#979** (victory Doka remount rename — replica wallet rise, different
 * key), **#1020** (Boss Rush Doka remount rename), **#977** (shop/heal
 * throw remount rename), **#986/#987** (one-shot remount rename),
 * **#1002** (spend-keep remount rename), **#1019** (GameKey remount
 * rename), and **#657** (session unconfirmed keep — not remount).
 *
 * This sidecar reads the same #807 stamp and honours replica leftover
 * XP onto the remount lock **before** rename / upgrade so leftover shop
 * writes leftover 180, not Play-entry 100. Stale live equal to stamped
 * `preXp` fail-closes (Play-entry still equals the pre-keep lock).
 * Level-up leftover already below `preXp` still honours. Doka
 * pickup-only (no stamp) still commits `200 − 100` with remount XP.
 *
 * Do not stamp here — #807 notes keep after a victory / room-clear
 * throw-after-add. `xpDelta <= 0` never stamps (Doka-only shrine /
 * ground / feat). Explicit `applyRewards failed` never stamps (that
 * stays on #807). Do not restack WX / progressPersist / deathPenalty /
 * applyRewardsResult / rewardResolver / renameCharacter / spellUpgrade /
 * achievementReward / shopPurchase / #807 / #918 / #1043 / #813 / #1041
 * / #767 / #1045 files.
 *
 * Tests reproduce remount rename / upgrade vs the gated leftover-XP
 * honour. Restack rename / upgrade enqueue onto
 * `persistRenameSpendThroughVictoryXpKeepRemount` after #807 lands.
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
 * Same key as #807 `victoryXpKeepRemountKey`. Remount rename / upgrade
 * honour must read the victory-throw XP keep stamp, not a second key and
 * not #813 / #1041 leftover-credit keys or #767's portal-throw key.
 */
export function victoryXpKeepRemountRenameSpendKey(slot: number): string {
  return `pbv_victory_xp_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type VictoryXpKeepRemountRenameSpendStamp = {
  /** Lock leftover XP before the throw-after-add grant. */
  preXp: number;
};

export function readVictoryXpKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): VictoryXpKeepRemountRenameSpendStamp | null {
  try {
    const raw = storage.getItem(victoryXpKeepRemountRenameSpendKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<VictoryXpKeepRemountRenameSpendStamp>;
    if (parsed.preXp == null) return null;
    return { preXp: toNat(parsed.preXp) };
  } catch {
    return null;
  }
}

export function writeVictoryXpKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: VictoryXpKeepRemountRenameSpendStamp,
): void {
  try {
    storage.setItem(
      victoryXpKeepRemountRenameSpendKey(slot),
      JSON.stringify({ preXp: toNat(stamp.preXp) }),
    );
  } catch {
    // private mode
  }
}

export function clearVictoryXpKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(victoryXpKeepRemountRenameSpendKey(slot));
  } catch {
    // ignore
  }
}

export function hasVictoryXpKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readVictoryXpKeepRemountRenameSpend(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #807
 * `noteVictoryXpKeepRemount` after a victory / room-clear throw-after-add.
 */
export function noteVictoryXpKeepRemountRenameSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  preXp: number,
): void {
  writeVictoryXpKeepRemountRenameSpend(storage, slot, {
    preXp: toNat(preXp),
  });
}

/**
 * `getCharacter` leftover. Unwrap `{ ok }` bindgen Results, then read
 * `experience` (number or bigint) the same way death-replay does.
 */
export function xpFromVictoryXpKeepRenameSpendCharacterRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return xpFromVictoryXpKeepRenameSpendCharacterRecord(
      (raw as { ok: unknown }).ok,
    );
  }
  return experienceFromCharacterRecord(raw);
}

/**
 * Stale Play-entry leftover still equals the pre-keep lock. A fresh
 * victory leftover (pre+kills) or leftover already below pre (level-up)
 * must honour. Missing live is fail-closed only when a keep stamp exists.
 * Equal-to-pre (not ≤) — leftover XP can legally drop below `preXp`
 * on a level-up.
 */
export function shouldRefuseVictoryXpKeepRemountRenameSpendStaleXp(args: {
  keep: boolean;
  liveXp: number | null;
  stampedPreXp: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveXp == null) return true;
  return toNat(args.liveXp) === toNat(args.stampedPreXp);
}

/**
 * Honour remount leftover XP from replica when the #807 keep stamp
 * says a victory grant may already be on the canister. Stale Play-entry
 * equal to stamped `preXp` must not fall back to remount leftover
 * (that is the wipe: leftover shop writes 100 over 180).
 */
export function xpForVictoryXpKeepRemountRenameSpend(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
}): number | null {
  if (
    shouldRefuseVictoryXpKeepRemountRenameSpendStaleXp({
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
 * Honour replica so persistAbsoluteProgress writes leftover 180.
 */
export function sessionXpAfterVictoryXpKeepRemountRenameSpend(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
}): number {
  const honoured = xpForVictoryXpKeepRemountRenameSpend(args);
  return honoured == null ? toNat(args.remountXp) : honoured;
}

/**
 * Leftover shop after the remount rename. Rename only commits Doka;
 * leftover shop `persistAbsoluteProgress` writes `committed.xp`.
 * Ungated writes Play-entry leftover over canister leftover.
 */
export function leftoverShopWriteAfterRenameWithVictoryXpKeep(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
  remountDoka: number;
  shopSpend: number;
}): { xp: number; doka: number } | null {
  const xp = xpForVictoryXpKeepRemountRenameSpend({
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

export function leftoverShopWriteAfterUpgradeWithVictoryXpKeep(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
  remountDoka: number;
  advertisedCost: number;
  backendDokaAfter: number | undefined;
  shopSpend: number;
}): { xp: number; doka: number } | null {
  const xp = xpForVictoryXpKeepRemountRenameSpend({
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

function refuseStaleVictoryXpKeepRemountRenameSpend(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type VictoryXpKeepRemountRenameSpendPersist = {
  snapshot: () => { doka: number; xp: number };
  commit?: (next: { doka?: number; xp?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * Rename / upgrade remount leftover used Play-entry XP 100 after a
 * victory throw-after-add. Fetch `getCharacter` when the #807 remount
 * keep stamp exists. Stale live equal to stamped `preXp` throws so
 * leftover shop cannot write Play-entry leftover. Fresh replica
 * leftover is adopted onto the lock **before** `applyAndCommit` so
 * production leftover shop writes 180. Rename / upgrade still spend
 * Doka from `snapshot().doka` (this sidecar does not reconstruct the
 * victory Doka grant — that is #774 / #979).
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry XP again. Fail-close keeps the stamp. Do not skip
 * the canister rename / upgrade — those already debit stored Doka.
 */
export async function persistRenameSpendThroughVictoryXpKeepRemount<T>(args: {
  persist: VictoryXpKeepRemountRenameSpendPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readCharacter: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readVictoryXpKeepRemountRenameSpend(args.storage, args.slot);
    if (!stamp) return args.applyAndCommit();

    let liveXp: number | null = null;
    try {
      liveXp = xpFromVictoryXpKeepRenameSpendCharacterRecord(
        await args.readCharacter(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleVictoryXpKeepRemountRenameSpend();
    }

    const honoured = xpForVictoryXpKeepRemountRenameSpend({
      remountXp: toNat(args.persist.snapshot().xp),
      liveXp,
      keep: true,
      stampedPreXp: stamp.preXp,
    });
    if (honoured == null) {
      refuseStaleVictoryXpKeepRemountRenameSpend();
    }
    args.persist.commit?.({ xp: honoured });
    clearVictoryXpKeepRemountRenameSpend(args.storage, args.slot);
    return args.applyAndCommit();
  });
}
