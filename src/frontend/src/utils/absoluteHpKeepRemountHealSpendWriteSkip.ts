/**
 * #854 stamps remount HP keep after a successful shop / Doka-heal
 * `persistAbsoluteProgress` (`pbv_absolute_hp_keep_remount_slotN`) and
 * honours replica HP on remount **shop leftover** writes. Those helpers
 * never skip a second Doka-heal spend.
 *
 * GameFlow `character.stats.hp` stays Play-entry forever
 * (`handlePlayCharacter` is the only writer). WorldExploration remount
 * re-inits `characterStats.hp` / `maxHp` from that snapshot.
 * `hydrateWhenIdle` copies doka / xp / level only.
 *
 * #854 polarity is Play-entry HIGH (enter 100 → local lava → heal 70).
 * Remount hp === maxHp so `shouldStartDokaHeal` is false; Items Buy is
 * the wipe. Unique leftover: Play-entry already **below** level max
 * (prior death respawn HP 50). Paid Doka-heal writes canister 100.
 * Remount HUD uses derived `maxHp` (formula 100) against Play-entry 50,
 * so the heal button shows. A second click spends 17 Doka for 0 HP.
 *
 * Chronology:
 * 1. Play from a wounded slot. `handlePlayCharacter` stores
 *    `stats.hp=50`. WX init hp=50. Derived maxHp formula = 100.
 *    Lock Doka seeds GameFlow 200. Canister 50/200.
 * 2. Doka-heal `resolveOverworldHealSpend` 50→100 for 17 Doka.
 *    `persistAbsoluteProgress(100, 183)` accepts. `saveBattleStats`
 *    writes HP 100 / Doka 183. GameFlow `stats.hp` stays 50.
 *    `onDokaBalanceChange` updates the wallet. No unpaid death.
 *    #854 stamps `{ preHp: 50, postHp: 100 }` after the parsed success.
 * 3. Actor reconnect remounts WorldExploration. Session HP = Play-entry
 *    **50**. `hydrateWhenIdle` skips HP. Heal button:
 *    `characterStats.hp < maxHp` (50 < 100).
 * 4. Second heal `persistAbsoluteProgress(100, 166)`.
 *    `saveBattleStats` HP stays 100; `writeDoka=min(166, 183)=166`.
 *    Paid heal is charged twice. #854 honour of leftover shop HP does
 *    not skip this spend (`healDelta` still debits Doka).
 *
 * Unique vs **#854** (shop leftover HIGH Play-entry HP write), **#847**
 * (death respawn HP remount shop), **#860** (throw-after-accept shop),
 * **#926** (rename/upgrade spend-keep BuffShop), and **#653** (potion).
 *
 * This sidecar reads the same #854 stamp. Heal-up (`postHp > preHp`)
 * plus stale-low remount HP plus replica already at `postHp` skip the
 * second spend. Shop leftover (`clickHp === remountHp`) is #854 — do
 * not skip. HIGH Play-entry (`postHp < preHp`) is #854 — do not skip.
 * Replica still at `preHp` (heal never landed) must still charge.
 * Missing live fail-closes skip (do not risk a second debit).
 *
 * Do not stamp here — #854 notes keep after the first parsed success.
 * Do not restack WX / itemShop / progressPersist / #854 file.
 *
 * Tests reproduce remount re-heal vs the gated skip. Restack the heal
 * click onto `persistHealSpendThroughAbsoluteHpKeepRemount` after #854
 * lands. No Motoko.
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
 * Same key as #854 `absoluteHpKeepRemountKey`. Remount heal-spend skip
 * must read the successful shop / heal HP stamp, not a second key.
 */
export function absoluteHpKeepRemountHealSpendKey(slot: number): string {
  return `pbv_absolute_hp_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type AbsoluteHpKeepRemountHealSpendStamp = {
  /** GameFlow Play-entry HP that remount will re-init from. */
  preHp: number;
  /** HP actually written by the first persistAbsoluteProgress. */
  postHp: number;
};

export function readAbsoluteHpKeepRemountHealSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): AbsoluteHpKeepRemountHealSpendStamp | null {
  try {
    const raw = storage.getItem(absoluteHpKeepRemountHealSpendKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<AbsoluteHpKeepRemountHealSpendStamp>;
    if (parsed.preHp == null || parsed.postHp == null) return null;
    return { preHp: toNat(parsed.preHp), postHp: toNat(parsed.postHp) };
  } catch {
    return null;
  }
}

export function writeAbsoluteHpKeepRemountHealSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: AbsoluteHpKeepRemountHealSpendStamp,
): void {
  try {
    storage.setItem(
      absoluteHpKeepRemountHealSpendKey(slot),
      JSON.stringify({
        preHp: toNat(stamp.preHp),
        postHp: toNat(stamp.postHp),
      }),
    );
  } catch {
    // private mode
  }
}

export function clearAbsoluteHpKeepRemountHealSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(absoluteHpKeepRemountHealSpendKey(slot));
  } catch {
    // ignore
  }
}

export function hasAbsoluteHpKeepRemountHealSpend(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readAbsoluteHpKeepRemountHealSpend(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #854
 * `noteAbsoluteHpKeepRemount` after the first parsed heal / shop success.
 */
export function noteAbsoluteHpKeepRemountHealSpend(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: AbsoluteHpKeepRemountHealSpendStamp,
): void {
  writeAbsoluteHpKeepRemountHealSpend(storage, slot, stamp);
}

/** Character HP from `getCharacter`. Play-entry TanStack can stay wounded. */
export function hpFromHealSpendCharacterRecord(
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
 * Second Doka-heal after a heal-up remount keep. Replica already holds
 * the paid HP; remount session is still the wounded Play-entry.
 */
export function shouldSkipHealSpendAfterAbsoluteHpKeepRemount(args: {
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
 * (`clickHp === remountHp`) falls through to the spend.
 */
export function dokaAfterHealSpendWithAbsoluteHpKeepRemount(args: {
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
    shouldSkipHealSpendAfterAbsoluteHpKeepRemount({
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
export function sessionHpAfterAbsoluteHpKeepRemountHealSpend(args: {
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

function refuseStaleAbsoluteHpKeepRemountHealSpend(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type AbsoluteHpKeepRemountHealSpendPersist = {
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * persistAbsoluteProgress remount heal used Play-entry 50 after a
 * successful Doka-heal to 100. Fetch character HP when the remount keep
 * stamp exists. Replica already at stamped `postHp` throws so the
 * second debit cannot land.
 *
 * Do not clear the stamp: HP is not on the persist lock, so a later
 * heal click would leftover-spend again.
 */
export async function persistHealSpendThroughAbsoluteHpKeepRemount<T>(args: {
  persist: AbsoluteHpKeepRemountHealSpendPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  remountHp: number;
  clickHp: number;
  readCharacter: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readAbsoluteHpKeepRemountHealSpend(args.storage, args.slot);
    if (!stamp) return args.applyAndCommit();

    let liveHp: number | null = null;
    try {
      liveHp = hpFromHealSpendCharacterRecord(await args.readCharacter());
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleAbsoluteHpKeepRemountHealSpend();
    }

    if (
      shouldSkipHealSpendAfterAbsoluteHpKeepRemount({
        keep: true,
        remountHp: args.remountHp,
        clickHp: args.clickHp,
        liveHp,
        stampedPreHp: stamp.preHp,
        stampedPostHp: stamp.postHp,
      })
    ) {
      refuseStaleAbsoluteHpKeepRemountHealSpend();
    }
    return args.applyAndCommit();
  });
}
