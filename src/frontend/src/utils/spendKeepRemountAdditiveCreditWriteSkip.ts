/**
 * #926 stamps remount Doka spend keep after `renameCharacter` /
 * `upgradeSpell` throw-after-debit (`pbv_spend_keep_remount_slotN`) and
 * honours replica wallet on remount **heal / shop**
 * `persistAbsoluteProgress`. #938 honours that stamp as the remount
 * **death-cut** base. #1002 honours replica as the remount **rename /
 * upgrade debit** base. Those helpers never enter
 * `claimAchievementReward` / `redeemGameKey`.
 *
 * Production feat / GameKey commits `snapshot().doka + grant` from the
 * remount lock. `createProgressPersist` on remount seeds GameFlow
 * `dokaBalance` — HUD debit waits for parsed `#ok` /
 * `persistSpellUpgrade` return, so that seed is still **200**.
 * `claimAchievementReward` / `redeemGameKey` add the grant onto the
 * **canister** wallet (100 after a rename throw, 190 after an upgrade
 * throw). The lock then sits 100 / 10 above stored. Seeded leftover
 * `persistAbsoluteProgress` does not fetch; a later Items Buy writes
 * that lie. `saveBattleStats` never mints incoming-above-stored, so the
 * item still lands while the original fee is skipped (rename→claim shop
 * writes 250 over 200) or refunded (upgrade→claim shop writes 250 over
 * 290).
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
 *    `{ preDoka: 200 }`. #926 / #938 / #1002 do not enter claim /
 *    redeem.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed-spend
 *    flags are gone. Trophy / Buy Doka stay live.
 * 4. Leftover #926: shop / heal honour replica 100 / 190. Leftover
 *    #938: death taxes replica. Leftover #1002: rename / upgrade debit
 *    from replica. Unique leftover: Claim `#ok(100)` commits **300**.
 *    Canister adds 100 to 100 → **200** (rename throw) or 190 → **290**
 *    (upgrade throw). Leftover shop spend 50 then writes **250** over
 *    200 (never-raise; free BuffShop item) or **250** over 290 (refunds
 *    the 10 upgrade fee). GameKey `#ok(1000)` commits **1200** over
 *    canister 1100 / 1190.
 *
 * Unique vs **#926** (heal/shop honour of this stamp), **#938** (death
 * honour), **#1002** (rename/upgrade debit honour of this stamp),
 * **#1021** (shop/heal throw remount feat/GameKey — different stamp
 * key), **#992** (feat keep remount rename — replica rose), **#657**
 * (session unconfirmed keep then additive — not remount), and **#604**
 * (Death Realm claim/redeem gate).
 *
 * This sidecar reads the same #926 stamp and honours replica wallet as
 * the feat / GameKey additive **base** so the lock commit is 200 / 290
 * / 1100, not Play-entry 300 / 1200. Stale live ≥ stamped `preDoka`
 * fail-closes (`renameCharacter` / `upgradeSpell` only debit — a live
 * wallet that did not drop is stale or the Play-entry cache).
 * Pickup-only (no stamp) still commits 200 + grant.
 *
 * Do not stamp here — #926 notes keep after rename / upgrade
 * throw-after-debit. Explicit `upgradeSpell failed` / parsed rename
 * `#err` never stamps. Do not restack WX / progressPersist /
 * deathPenalty / itemShop / achievementReward / shopPurchase /
 * DokaGameKeyShop / #926 / #938 / #1002 / #1021 files.
 *
 * Tests reproduce remount claim / redeem vs the gated honour.
 * Restack feat / GameKey enqueue onto
 * `persistClaimThroughSpendKeepRemount` /
 * `persistRedeemThroughSpendKeepRemount` after #926 lands.
 * No Motoko.
 */

import {
  committedDokaAfterAchievementCredit,
  creditAchievementRewardThroughPersist,
} from "./achievementReward.ts";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
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
 * Same key as #926 `spendKeepRemountKey`. Remount feat / GameKey honour
 * must read the rename / upgrade throw-after-debit stamp, not a second
 * key and not #1021's shop-throw additive key.
 */
export function spendKeepRemountAdditiveCreditKey(slot: number): string {
  return `pbv_spend_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type SpendKeepRemountAdditiveCreditStamp = {
  /** Lock wallet before the throw-after-debit spend. */
  preDoka: number;
};

export function readSpendKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): SpendKeepRemountAdditiveCreditStamp | null {
  try {
    const raw = storage.getItem(spendKeepRemountAdditiveCreditKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<SpendKeepRemountAdditiveCreditStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeSpendKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: SpendKeepRemountAdditiveCreditStamp,
): void {
  try {
    storage.setItem(
      spendKeepRemountAdditiveCreditKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearSpendKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(spendKeepRemountAdditiveCreditKey(slot));
  } catch {
    // ignore
  }
}

export function hasSpendKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readSpendKeepRemountAdditiveCredit(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #926
 * `noteSpendKeepRemount` after rename / upgrade throw-after-debit.
 */
export function noteSpendKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeSpendKeepRemountAdditiveCredit(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

export function dokaFromSpendKeepAdditiveCreditWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromSpendKeepAdditiveCreditWalletRecord(
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
export function shouldRefuseSpendKeepRemountAdditiveCreditStaleDoka(args: {
  keep: boolean;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) >= toNat(args.stampedPreDoka);
}

/**
 * Honour remount feat / GameKey additive **base** Doka from replica
 * wallet when the #926 keep stamp says a fee may already be on the
 * canister. Stale Play-entry equal to stamped `preDoka` must not fall
 * back to remount wallet (that is the refund: claim commits 300 over
 * 200).
 */
export function dokaForSpendKeepRemountAdditiveCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseSpendKeepRemountAdditiveCreditStaleDoka({
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
 * Feat-claim lock commit. Ungated remount uses Play-entry 200 + 100 →
 * 300. Gated fresh rename-throw 100 + 100 → 200; upgrade-throw 190 +
 * 100 → 290.
 */
export function committedDokaAfterAchievementCreditWithSpendKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  granted: number;
}): number | null {
  const base = dokaForSpendKeepRemountAdditiveCredit(args);
  if (base == null) return null;
  return committedDokaAfterAchievementCredit(base, args.granted);
}

/**
 * GameKey-redeem lock commit. Ungated remount uses Play-entry 200 +
 * 1000 → 1200. Gated fresh rename-throw 100 + 1000 → 1100.
 */
export function committedDokaAfterGameKeyRedeemWithSpendKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  granted: number;
}): number | null {
  const base = dokaForSpendKeepRemountAdditiveCredit(args);
  if (base == null) return null;
  return committedDokaAfterGameKeyRedeem(base, args.granted);
}

/**
 * Session HUD after remount. Ungated Play-entry 200 still looks like
 * the pre-spend wallet so Trophy / Buy Doka credit from a lie. Honour
 * replica so the additive grant matches the canister.
 */
export function sessionDokaAfterSpendKeepRemountAdditiveCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number {
  const honoured = dokaForSpendKeepRemountAdditiveCredit(args);
  return honoured == null ? toNat(args.remountDoka) : honoured;
}

/**
 * Leftover shop after the remount claim lock-lie. Ungated writes
 * `claim(200)+grant − shopSpend` over the canister post-claim wallet:
 * never-raise free item after a rename throw, or incoming-below-stored
 * refund of the upgrade fee after an upgrade throw.
 */
export function dokaAfterShopSpendWithSpendKeepRemountAdditiveCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  granted: number;
  shopSpend: number;
}): number | null {
  const credited = committedDokaAfterAchievementCreditWithSpendKeepRemount({
    remountDoka: args.remountDoka,
    liveDoka: args.liveDoka,
    keep: args.keep,
    stampedPreDoka: args.stampedPreDoka,
    granted: args.granted,
  });
  if (credited == null) return null;
  return applySpendToCommitted(credited, args.shopSpend);
}

function refuseStaleSpendKeepRemountAdditiveCredit(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type SpendKeepRemountAdditiveCreditPersist = {
  snapshot: () => { doka: number };
  commit?: (next: { doka?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
  isWalletSeeded?: () => boolean;
  noteUnseededCredit?: () => void;
};

/**
 * Feat / GameKey remount wallet used Play-entry Doka 200 after a rename
 * / upgrade throw-after-debit. Fetch `getCallerDokaBalance` when the
 * #926 remount keep stamp exists. Stale live ≥ stamped `preDoka`
 * throws so the lock cannot commit `200 + grant`. Fresh replica is
 * adopted onto the lock **before** `applyAndCommit` so production
 * `committedDokaAfterAchievementCredit(snapshot, grant)` /
 * `committedDokaAfterGameKeyRedeem(snapshot, grant)` add onto 100 /
 * 190.
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry again. Fail-close keeps the stamp. Do not skip the
 * canister claim / redeem — those already credit stored Doka.
 */
export async function persistAdditiveCreditThroughSpendKeepRemount<T>(args: {
  persist: SpendKeepRemountAdditiveCreditPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readSpendKeepRemountAdditiveCredit(args.storage, args.slot);
    if (!stamp) return args.applyAndCommit();

    let liveDoka: number | null = null;
    try {
      liveDoka = dokaFromSpendKeepAdditiveCreditWalletRecord(
        await args.readWallet(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleSpendKeepRemountAdditiveCredit();
    }

    const honoured = dokaForSpendKeepRemountAdditiveCredit({
      remountDoka: toNat(args.persist.snapshot().doka),
      liveDoka,
      keep: true,
      stampedPreDoka: stamp.preDoka,
    });
    if (honoured == null) refuseStaleSpendKeepRemountAdditiveCredit();
    args.persist.commit?.({ doka: honoured });
    clearSpendKeepRemountAdditiveCredit(args.storage, args.slot);
    return args.applyAndCommit();
  });
}

/**
 * Production `creditAchievementRewardThroughPersist` already enqueues.
 * Call it from `applyAndCommit` via a passthrough enqueue so the honour
 * job cannot deadlock on a nested persist lock.
 */
function passthroughEnqueuePersist(
  persist: SpendKeepRemountAdditiveCreditPersist,
): {
  enqueue: <T>(fn: () => Promise<T>) => Promise<T>;
  commit: (next: { doka?: number }) => void;
  snapshot: () => { doka: number };
  isWalletSeeded: () => boolean;
  noteUnseededCredit?: () => void;
} {
  return {
    enqueue: <T>(fn: () => Promise<T>) => fn(),
    commit: (next: { doka?: number }) => {
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
 * replica onto the remount lock first, then run the production claim
 * body without a nested queue hop.
 */
export async function persistClaimThroughSpendKeepRemount(
  actor: Parameters<typeof creditAchievementRewardThroughPersist>[0],
  persist: SpendKeepRemountAdditiveCreditPersist,
  achievementId: string,
  args: {
    storage: DeathPenaltyStorage;
    slot: number;
    readWallet: () => Promise<unknown>;
  },
): ReturnType<typeof creditAchievementRewardThroughPersist> {
  return persistAdditiveCreditThroughSpendKeepRemount({
    persist,
    storage: args.storage,
    slot: args.slot,
    readWallet: args.readWallet,
    applyAndCommit: () =>
      creditAchievementRewardThroughPersist(
        actor,
        passthroughEnqueuePersist(persist),
        achievementId,
      ),
  });
}

/**
 * `redeemGameKeyThroughPersist` already enqueues. Same honour as feat
 * claim: `#ok` must add onto replica 100 / 190, not remount 200.
 */
export async function persistRedeemThroughSpendKeepRemount(
  actor: Parameters<typeof redeemGameKeyThroughPersist>[0],
  persist: SpendKeepRemountAdditiveCreditPersist,
  code: string,
  args: {
    storage: DeathPenaltyStorage;
    slot: number;
    readWallet: () => Promise<unknown>;
  },
): ReturnType<typeof redeemGameKeyThroughPersist> {
  return persistAdditiveCreditThroughSpendKeepRemount({
    persist,
    storage: args.storage,
    slot: args.slot,
    readWallet: args.readWallet,
    applyAndCommit: () =>
      redeemGameKeyThroughPersist(
        actor,
        passthroughEnqueuePersist(persist),
        code,
      ),
  });
}
