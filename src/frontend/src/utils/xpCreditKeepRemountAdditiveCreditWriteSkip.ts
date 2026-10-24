/**
 * #813 stamps remount leftover XP keep after a successful portal /
 * victory / Boss Rush `applyRewards` leftover commit
 * (`pbv_xp_credit_keep_remount_slotN`) and honours replica leftover on
 * remount **heal / shop** `persistAbsoluteProgress`. #919 honours that
 * stamp as the remount **death-cut** XP base. Those helpers never enter
 * `claimAchievementReward` / `redeemGameKey`.
 *
 * Production feat / GameKey commits `snapshot().doka + grant` only.
 * `createProgressPersist` on remount seeds GameFlow
 * `character.experience` — `handlePlayCharacter` is the only writer, so
 * that seed stays Play-entry **100** after a leftover +10 / +80 grant.
 * Seeded leftover `persistAbsoluteProgress` writes `committed.xp` and
 * does not fetch character leftover; a later Items Buy /
 * `saveBattleStats` incoming-below-stored wipes the leftover
 * (`main.mo` never-raise still applies a lower incoming XP). Trophy /
 * Buy Doka stay live after remount and do not honour leftover XP onto
 * the lock, so leftover shop after a remount claim still writes
 * Play-entry 100 over canister 110 / 180.
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 / XP 100 seeded. Canister 200/100.
 *    GameFlow `character.experience` stays Play-entry 100.
 * 2. Portal `persistIncrementalRewards(0, 10)` or victory leftover
 *    commits 110 / 180. Catch is not taken. HUD `characterStats.exp`
 *    updates. GameFlow Play-entry does not. No unpaid death. #813
 *    stamps `{ preXp: 100 }`. #767 / #807 do not stamp (no throw).
 *    #813 / #919 do not enter claim / redeem.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ xp: character.experience }` = **100**. Session unconfirmed
 *    flags are gone.
 * 4. Leftover #813: shop / heal honour replica leftover 110. Leftover
 *    #919: death taxes replica leftover. Unique leftover: Claim
 *    `#ok(100)` commits Doka **300** (portal does not change Doka —
 *    that axis is correct) while lock XP stays **100**. Leftover shop
 *    spend 50 then writes `{ xp: 100, doka: 250 }` over canister
 *    `{ xp: 110, doka: 300 }` and wipes portal +10. GameKey
 *    `#ok(1000)` is the same XP wipe on `{ xp: 100, doka: 1150 }`.
 *
 * Unique vs **#813** (heal/shop honour of this stamp), **#919** (death
 * honour), **#767** (portal throw stamp `pbv_portal_xp_keep_remount_*`),
 * **#807** (victory XP throw stamp), **#1028** (victory Doka stamp —
 * replica wallet rise, different key), **#1025** (Boss Rush Doka),
 * **#1029** (one-shot Doka), **#1031** (GameKey Doka), **#1032** (feat
 * Doka), **#1021** (shop/heal throw — replica dropped), **#1024**
 * (spend-keep), and **#657** (session unconfirmed keep — not remount).
 *
 * This sidecar reads the same #813 stamp and honours replica leftover
 * XP onto the remount lock **before** feat / GameKey so leftover shop
 * writes leftover 110 / 180, not Play-entry 100. Stale live equal to
 * stamped `preXp` fail-closes (Play-entry still equals the pre-keep
 * lock). Level-up leftover already below `preXp` still honours. Doka
 * pickup-only (no stamp) still commits `200 + grant` with remount XP.
 *
 * Do not stamp here — #813 notes keep after a parsed leftover XP
 * commit. `xpDelta <= 0` never stamps (Doka-only shrine / ground /
 * feat). Explicit `applyRewards failed` is a throw path (#767 / #807).
 * Do not restack WX / progressPersist / deathPenalty / applyRewardsResult
 * / rewardResolver / achievementReward / shopPurchase / DokaGameKeyShop
 * / #813 / #919 / #767 / #807 / #1021 / #1024 / #1028 files.
 *
 * Tests reproduce remount claim / redeem vs the gated leftover-XP
 * honour. Restack feat / GameKey enqueue onto
 * `persistClaimThroughXpCreditKeepRemount` /
 * `persistRedeemThroughXpCreditKeepRemount` after #813 lands.
 * No Motoko.
 */

import {
  committedDokaAfterAchievementCredit,
  creditAchievementRewardThroughPersist,
} from "./achievementReward.ts";
import {
  type DeathPenaltyStorage,
  experienceFromCharacterRecord,
} from "./deathPenalty.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
} from "./progressPersist.ts";
import {
  committedDokaAfterGameKeyRedeem,
  redeemGameKeyThroughPersist,
} from "./shopPurchase.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

/**
 * Same key as #813 `xpCreditKeepRemountKey`. Remount feat / GameKey
 * honour must read the leftover-XP keep stamp, not a second key and
 * not #767 / #807 throw keys or #1028's victory Doka additive key.
 */
export function xpCreditKeepRemountAdditiveCreditKey(slot: number): string {
  return `pbv_xp_credit_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type XpCreditKeepRemountAdditiveCreditStamp = {
  /** Lock leftover XP before the successful grant. */
  preXp: number;
};

export function readXpCreditKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): XpCreditKeepRemountAdditiveCreditStamp | null {
  try {
    const raw = storage.getItem(xpCreditKeepRemountAdditiveCreditKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<XpCreditKeepRemountAdditiveCreditStamp>;
    if (parsed.preXp == null) return null;
    return { preXp: toNat(parsed.preXp) };
  } catch {
    return null;
  }
}

export function writeXpCreditKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: XpCreditKeepRemountAdditiveCreditStamp,
): void {
  try {
    storage.setItem(
      xpCreditKeepRemountAdditiveCreditKey(slot),
      JSON.stringify({ preXp: toNat(stamp.preXp) }),
    );
  } catch {
    // private mode
  }
}

export function clearXpCreditKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(xpCreditKeepRemountAdditiveCreditKey(slot));
  } catch {
    // ignore
  }
}

export function hasXpCreditKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readXpCreditKeepRemountAdditiveCredit(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #813
 * `noteXpCreditKeepRemount` after a parsed leftover XP commit.
 */
export function noteXpCreditKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  preXp: number,
): void {
  writeXpCreditKeepRemountAdditiveCredit(storage, slot, {
    preXp: toNat(preXp),
  });
}

/**
 * `getCharacter` leftover. Unwrap `{ ok }` bindgen Results, then read
 * `experience` (number or bigint) the same way death-replay does.
 */
export function xpFromXpCreditKeepAdditiveCreditCharacterRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return xpFromXpCreditKeepAdditiveCreditCharacterRecord(
      (raw as { ok: unknown }).ok,
    );
  }
  return experienceFromCharacterRecord(raw);
}

/**
 * Stale Play-entry leftover still equals the pre-keep lock. A fresh
 * portal leftover (pre+10), a victory leftover (pre+kills), or a
 * level-up leftover already below pre must honour. Missing live is
 * fail-closed only when a keep stamp exists. Equal-to-pre (not ≤) —
 * leftover XP can legally drop below `preXp` on a level-up.
 */
export function shouldRefuseXpCreditKeepRemountAdditiveCreditStaleXp(args: {
  keep: boolean;
  liveXp: number | null;
  stampedPreXp: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveXp == null) return true;
  return toNat(args.liveXp) === toNat(args.stampedPreXp);
}

/**
 * Honour remount leftover XP from replica when the #813 keep stamp
 * says a leftover grant is already on the canister. Stale Play-entry
 * equal to stamped `preXp` must not fall back to remount leftover
 * (that is the wipe: leftover shop writes 100 over 110).
 */
export function xpForXpCreditKeepRemountAdditiveCredit(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
}): number | null {
  if (
    shouldRefuseXpCreditKeepRemountAdditiveCreditStaleXp({
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
export function sessionXpAfterXpCreditKeepRemountAdditiveCredit(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
}): number {
  const honoured = xpForXpCreditKeepRemountAdditiveCredit(args);
  return honoured == null ? toNat(args.remountXp) : honoured;
}

/**
 * Leftover shop after the remount claim. Feat / GameKey only commit
 * Doka; leftover shop `persistAbsoluteProgress` writes `committed.xp`.
 * Ungated writes Play-entry leftover over canister leftover.
 */
export function leftoverShopWriteAfterXpCreditKeepRemountAdditiveCredit(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
  remountDoka: number;
  granted: number;
  shopSpend: number;
}): { xp: number; doka: number } | null {
  const xp = xpForXpCreditKeepRemountAdditiveCredit({
    remountXp: args.remountXp,
    liveXp: args.liveXp,
    keep: args.keep,
    stampedPreXp: args.stampedPreXp,
  });
  if (xp == null) return null;
  return {
    xp,
    doka: applySpendToCommitted(
      committedDokaAfterAchievementCredit(args.remountDoka, args.granted),
      args.shopSpend,
    ),
  };
}

export function leftoverShopWriteAfterGameKeyWithXpCreditKeepRemount(args: {
  remountXp: number;
  liveXp: number | null;
  keep: boolean;
  stampedPreXp: number;
  remountDoka: number;
  granted: number;
  shopSpend: number;
}): { xp: number; doka: number } | null {
  const xp = xpForXpCreditKeepRemountAdditiveCredit({
    remountXp: args.remountXp,
    liveXp: args.liveXp,
    keep: args.keep,
    stampedPreXp: args.stampedPreXp,
  });
  if (xp == null) return null;
  return {
    xp,
    doka: applySpendToCommitted(
      committedDokaAfterGameKeyRedeem(args.remountDoka, args.granted),
      args.shopSpend,
    ),
  };
}

function refuseStaleXpCreditKeepRemountAdditiveCredit(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type XpCreditKeepRemountAdditiveCreditPersist = {
  snapshot: () => { doka: number; xp: number };
  commit?: (next: { doka?: number; xp?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
  isWalletSeeded?: () => boolean;
  noteUnseededCredit?: () => void;
};

/**
 * Feat / GameKey remount leftover used Play-entry XP 100 after a
 * successful leftover XP credit. Fetch `getCharacter` when the #813
 * remount keep stamp exists. Stale live equal to stamped `preXp`
 * throws so leftover shop cannot write Play-entry leftover. Fresh
 * replica leftover is adopted onto the lock **before** `applyAndCommit`
 * so production leftover shop writes 110 / 180. Feat / GameKey still
 * add Doka onto `snapshot().doka` (portal leftover does not change
 * Doka).
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry XP again. Fail-close keeps the stamp. Do not skip
 * the canister claim / redeem — those already credit stored Doka.
 */
export async function persistAdditiveCreditThroughXpCreditKeepRemount<T>(args: {
  persist: XpCreditKeepRemountAdditiveCreditPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readCharacter: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readXpCreditKeepRemountAdditiveCredit(
      args.storage,
      args.slot,
    );
    if (!stamp) return args.applyAndCommit();

    let liveXp: number | null = null;
    try {
      liveXp = xpFromXpCreditKeepAdditiveCreditCharacterRecord(
        await args.readCharacter(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleXpCreditKeepRemountAdditiveCredit();
    }

    const honoured = xpForXpCreditKeepRemountAdditiveCredit({
      remountXp: toNat(args.persist.snapshot().xp),
      liveXp,
      keep: true,
      stampedPreXp: stamp.preXp,
    });
    if (honoured == null) {
      refuseStaleXpCreditKeepRemountAdditiveCredit();
    }
    args.persist.commit?.({ xp: honoured });
    clearXpCreditKeepRemountAdditiveCredit(args.storage, args.slot);
    return args.applyAndCommit();
  });
}

/**
 * Production `creditAchievementRewardThroughPersist` already enqueues.
 * Call it from `applyAndCommit` via a passthrough enqueue so the honour
 * job cannot deadlock on a nested persist lock.
 */
function passthroughEnqueuePersist(
  persist: XpCreditKeepRemountAdditiveCreditPersist,
): {
  enqueue: <T>(fn: () => Promise<T>) => Promise<T>;
  commit: (next: { doka?: number; xp?: number }) => void;
  snapshot: () => { doka: number; xp: number };
  isWalletSeeded: () => boolean;
  noteUnseededCredit?: () => void;
} {
  return {
    enqueue: <T>(fn: () => Promise<T>) => fn(),
    commit: (next: { doka?: number; xp?: number }) => {
      persist.commit?.(next);
    },
    snapshot: () => persist.snapshot(),
    isWalletSeeded: () =>
      persist.isWalletSeeded?.() ?? persist.snapshot().doka > 0,
    noteUnseededCredit: persist.noteUnseededCredit,
  };
}

/**
 * `creditAchievementRewardThroughPersist` already enqueues. Honour
 * replica leftover XP onto the remount lock first, then run the
 * production claim body without a nested queue hop.
 */
export async function persistClaimThroughXpCreditKeepRemount(
  actor: Parameters<typeof creditAchievementRewardThroughPersist>[0],
  persist: XpCreditKeepRemountAdditiveCreditPersist,
  achievementId: string,
  args: {
    storage: DeathPenaltyStorage;
    slot: number;
    readCharacter: () => Promise<unknown>;
  },
): ReturnType<typeof creditAchievementRewardThroughPersist> {
  return persistAdditiveCreditThroughXpCreditKeepRemount({
    persist,
    storage: args.storage,
    slot: args.slot,
    readCharacter: args.readCharacter,
    applyAndCommit: () =>
      creditAchievementRewardThroughPersist(
        actor,
        passthroughEnqueuePersist(persist),
        achievementId,
      ),
  });
}

/**
 * `redeemGameKeyThroughPersist` already enqueues. Same leftover-XP
 * honour as feat claim: leftover shop must write replica leftover, not
 * remount Play-entry 100.
 */
export async function persistRedeemThroughXpCreditKeepRemount(
  actor: Parameters<typeof redeemGameKeyThroughPersist>[0],
  persist: XpCreditKeepRemountAdditiveCreditPersist,
  code: string,
  args: {
    storage: DeathPenaltyStorage;
    slot: number;
    readCharacter: () => Promise<unknown>;
  },
): ReturnType<typeof redeemGameKeyThroughPersist> {
  return persistAdditiveCreditThroughXpCreditKeepRemount({
    persist,
    storage: args.storage,
    slot: args.slot,
    readCharacter: args.readCharacter,
    applyAndCommit: () =>
      redeemGameKeyThroughPersist(
        actor,
        passthroughEnqueuePersist(persist),
        code,
      ),
  });
}
