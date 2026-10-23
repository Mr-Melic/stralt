/**
 * #860 stamps remount HP keep after shop / Doka-heal `saveBattleStats`
 * throw-after-accept (`pbv_absolute_hp_throw_keep_remount_slotN`) and
 * honours replica HP on remount **shop leftover** writes. #964 stamps
 * remount Doka keep and honours replica wallet on remount heal / shop.
 * #969 honours that Doka stamp on remount **death**. Those helpers still
 * apply `healDelta` onto replica HP and still debit Doka.
 *
 * GameFlow `character.stats.hp` stays Play-entry forever
 * (`handlePlayCharacter` is the only writer). WorldExploration remount
 * re-inits `characterStats.hp` / `maxHp` from that snapshot.
 * `hydrateWhenIdle` copies doka / xp / level only.
 *
 * #860 / #964 polarity is Play-entry HIGH (enter 100 → local lava →
 * heal 70). Remount hp === derived maxHp so `shouldStartDokaHeal` is
 * false; Items Buy / death is the wipe. Unique leftover: Play-entry
 * already **below** level max (prior death respawn HP 50). Paid
 * Doka-heal `saveBattleStats` accepts HP 100 / Doka 183 then throws.
 * Catch rolls HUD back to 50 / 200. Remount HUD uses derived `maxHp`
 * (formula 100) against Play-entry 50, so the heal button shows.
 *
 * Chronology:
 * 1. Play from a wounded slot. `handlePlayCharacter` stores
 *    `stats.hp=50`. WX init hp=50. Derived maxHp formula = 100.
 *    Lock Doka seeds GameFlow 200. Canister 50/200.
 * 2. Doka-heal `resolveOverworldHealSpend` 50→100 for 17 Doka.
 *    `persistAbsoluteProgress(100, 183)` accepts HP 100 / Doka 183
 *    then throws (`replica went away`). Commit never runs. Catch
 *    returns false. Heal rollback HUD 50 / 200. No unpaid death.
 *    #860 stamps `{ preHp: 50, postHp: 100 }`. #964 stamps Doka keep
 *    `preDoka=200`. #854 / #927 do not stamp (throw, not parsed
 *    success).
 * 3. Actor reconnect remounts WorldExploration. Session HP =
 *    Play-entry **50**. Lock Doka seeds GameFlow rollback **200**.
 *    Heal button: `characterStats.hp < maxHp` (50 < 100). Same class
 *    without remount: second click in the same session while lock is
 *    still 200.
 * 4. Leftover #860: shop honours HP 100. Leftover #964: remount shop
 *    spends from replica 183. Leftover #969: death taxes 183. Unique
 *    leftover: second Doka-heal `persistAbsoluteProgress(100, 183)`.
 *    Spend is computed from rollback HUD 200 → 17. #964 honour
 *    fetches replica 183, `applySpendToCommitted(183, 17)` writes
 *    **166**. `saveBattleStats` HP stays 100; incoming-below-stored
 *    over-cuts the remaining after the first fee. Paid heal is
 *    charged twice. #927 skip reads `pbv_absolute_hp_keep_remount`
 *    (parsed success) — empty here.
 *
 * Unique vs **#927** (success-heal remount second charge — different
 * stamp key), **#860** (throw remount shop HP), **#964** (throw remount
 * shop / first-heal Doka honour), **#969** (throw remount death),
 * **#854** (parsed success HP shop), and **#653** (potion).
 *
 * This sidecar reads the same #860 stamp. Heal-up (`postHp > preHp`)
 * plus stale-low remount HP plus replica already at `postHp` skip the
 * second spend. Shop leftover (`clickHp === remountHp`) is #860 — do
 * not skip. HIGH Play-entry (`postHp < preHp`) is #860 — do not skip.
 * Replica still at `preHp` (heal never landed) must still charge.
 * Missing live fail-closes skip (do not risk a second debit).
 *
 * Do not stamp here — #860 notes keep after shop / heal
 * throw-after-accept. Explicit `saveBattleStats failed` never stamps.
 * Do not clear the stamp: HP is not on the persist lock.
 * Do not restack WX / progressPersist / deathPenalty / itemShop /
 * #860 / #927 / #964 / #969 files.
 *
 * Tests reproduce remount re-heal vs the gated skip. Restack the heal
 * click onto `persistHealSpendThroughAbsoluteHpThrowKeepRemount` after
 * #860 lands. No Motoko.
 */

import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
} from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

/**
 * Same key as #860 `absoluteHpThrowKeepRemountKey`. Remount heal-spend
 * skip must read the shop / heal throw-after-accept HP stamp, not a
 * second key and not #927's parsed-success key.
 */
export function absoluteHpThrowKeepRemountHealSpendKey(slot: number): string {
  return `pbv_absolute_hp_throw_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type AbsoluteHpThrowKeepRemountHealSpendStamp = {
  /** GameFlow Play-entry HP that remount will re-init from. */
  preHp: number;
  /** HP passed into saveBattleStats before the transport-keep throw. */
  postHp: number;
};

export function readAbsoluteHpThrowKeepRemountHealSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): AbsoluteHpThrowKeepRemountHealSpendStamp | null {
  try {
    const raw = storage.getItem(absoluteHpThrowKeepRemountHealSpendKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<AbsoluteHpThrowKeepRemountHealSpendStamp>;
    if (parsed.preHp == null || parsed.postHp == null) return null;
    return { preHp: toNat(parsed.preHp), postHp: toNat(parsed.postHp) };
  } catch {
    return null;
  }
}

export function writeAbsoluteHpThrowKeepRemountHealSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: AbsoluteHpThrowKeepRemountHealSpendStamp,
): void {
  try {
    storage.setItem(
      absoluteHpThrowKeepRemountHealSpendKey(slot),
      JSON.stringify({
        preHp: toNat(stamp.preHp),
        postHp: toNat(stamp.postHp),
      }),
    );
  } catch {
    // private mode
  }
}

export function clearAbsoluteHpThrowKeepRemountHealSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(absoluteHpThrowKeepRemountHealSpendKey(slot));
  } catch {
    // ignore
  }
}

export function hasAbsoluteHpThrowKeepRemountHealSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readAbsoluteHpThrowKeepRemountHealSpend(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #860
 * `noteAbsoluteHpThrowKeepRemount` after shop / heal throw-after-accept.
 */
export function noteAbsoluteHpThrowKeepRemountHealSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: AbsoluteHpThrowKeepRemountHealSpendStamp,
): void {
  writeAbsoluteHpThrowKeepRemountHealSpend(storage, slot, stamp);
}

/** Character HP from `getCharacter`. Play-entry TanStack can stay wounded. */
export function hpFromThrowHealSpendCharacterRecord(
  record: { stats?: { hp?: unknown } } | null | undefined | unknown,
): number | null {
  if (record == null || typeof record !== "object") return null;
  const stats = (record as { stats?: unknown }).stats;
  if (stats == null || typeof stats !== "object") return null;
  const hp = Number((stats as { hp?: unknown }).hp);
  if (!Number.isFinite(hp)) return null;
  return toNat(hp);
}

/**
 * Second Doka-heal after a heal-up throw-keep remount. Replica already
 * holds the paid HP; remount session is still the wounded Play-entry
 * (HUD rollback after the throw).
 */
export function shouldSkipHealSpendAfterAbsoluteHpThrowKeepRemount(args: {
  keep: boolean;
  remountHp: number;
  clickHp: number;
  liveHp: number | null;
  stampedPreHp: number;
  stampedPostHp: number;
}): boolean {
  if (args.keep !== true) return false;
  const pre = toNat(args.stampedPreHp);
  const post = toNat(args.stampedPostHp);
  if (post <= pre) return false;
  const remount = toNat(args.remountHp);
  const click = toNat(args.clickHp);
  if (remount > pre) return false;
  if (click <= remount) return false;
  if (args.liveHp == null) return true;
  return toNat(args.liveHp) >= post;
}

/**
 * Honour remount heal Doka: skip the second debit when the keep stamp
 * says canister HP is already the paid heal. Shop leftover
 * (`clickHp === remountHp`) falls through to the spend. #964 honour of
 * replica wallet must not spend again on this heal-up path.
 */
export function dokaAfterHealSpendWithAbsoluteHpThrowKeepRemount(args: {
  remountDoka: number;
  spend: number;
  keep: boolean;
  remountHp: number;
  clickHp: number;
  liveHp: number | null;
  stampedPreHp: number;
  stampedPostHp: number;
}): number {
  if (
    shouldSkipHealSpendAfterAbsoluteHpThrowKeepRemount({
      keep: args.keep,
      remountHp: args.remountHp,
      clickHp: args.clickHp,
      liveHp: args.liveHp,
      stampedPreHp: args.stampedPreHp,
      stampedPostHp: args.stampedPostHp,
    })
  ) {
    return toNat(args.remountDoka);
  }
  return applySpendToCommitted(args.remountDoka, args.spend);
}

/**
 * Session HUD after remount. Ungated Play-entry 50 vs derived max 100
 * re-opens the heal button. Honour replica paid HP so the button hides.
 */
export function sessionHpAfterAbsoluteHpThrowKeepRemountHealSpend(args: {
  remountHp: number;
  liveHp: number | null;
  keep: boolean;
  stampedPreHp: number;
  stampedPostHp: number;
}): number {
  const remount = toNat(args.remountHp);
  if (args.keep !== true) return remount;
  const pre = toNat(args.stampedPreHp);
  const post = toNat(args.stampedPostHp);
  if (post <= pre) return remount;
  if (remount > pre) return remount;
  if (args.liveHp == null) return remount;
  if (toNat(args.liveHp) < post) return remount;
  return toNat(args.liveHp);
}

function refuseStaleAbsoluteHpThrowKeepRemountHealSpend(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type AbsoluteHpThrowKeepRemountHealSpendPersist = {
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * persistAbsoluteProgress remount heal used Play-entry 50 after a
 * Doka-heal saveBattleStats accept-then-throw to 100. Fetch character
 * HP when the #860 remount keep stamp exists. Replica already at
 * stamped `postHp` throws so the second debit cannot land.
 *
 * Do not clear the stamp: HP is not on the persist lock, so a later
 * heal click would leftover-spend again.
 */
export async function persistHealSpendThroughAbsoluteHpThrowKeepRemount<
  T,
>(args: {
  persist: AbsoluteHpThrowKeepRemountHealSpendPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  remountHp: number;
  clickHp: number;
  readCharacter: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readAbsoluteHpThrowKeepRemountHealSpend(
      args.storage,
      args.slot,
    );
    if (!stamp) return args.applyAndCommit();

    let liveHp: number | null = null;
    try {
      liveHp = hpFromThrowHealSpendCharacterRecord(await args.readCharacter());
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleAbsoluteHpThrowKeepRemountHealSpend();
    }

    if (
      shouldSkipHealSpendAfterAbsoluteHpThrowKeepRemount({
        keep: true,
        remountHp: args.remountHp,
        clickHp: args.clickHp,
        liveHp,
        stampedPreHp: stamp.preHp,
        stampedPostHp: stamp.postHp,
      })
    ) {
      refuseStaleAbsoluteHpThrowKeepRemountHealSpend();
    }
    return args.applyAndCommit();
  });
}
