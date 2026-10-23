/**
 * #926 stamps remount Doka spend keep after `renameCharacter` /
 * `upgradeSpell` throw-after-debit (`pbv_spend_keep_remount_slotN`) and
 * honours replica wallet on remount **heal / shop** `persistAbsoluteProgress`.
 * Those flags / honour helpers never enter `persistDeathPenalty`.
 *
 * Production death persist reads `progressPersist.snapshot().doka` (or
 * `resolveCommittedDokaForAbsoluteWrite`, which on a seeded remount lock
 * returns committed immediately). Remount `createProgressPersist` seeds
 * GameFlow `dokaBalance` — HUD debit waits for parsed `#ok` /
 * `persistSpellUpgrade` return, so after a throw-after-debit that is still
 * Play-entry 200. `shouldApplyCallerDokaHydrate` ignores later wallet
 * refetches while the world session stays mounted.
 *
 * Remount after rename / upgrade spend keep **without** unpaid death is
 * still a wipe when the next write is lava death, not heal:
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200.
 * 2. Rename `renameCharacter` deducts 100 (canister 100) then throws
 *    (`replica went away`). Catch only toasts. Lock stays 200. Upgrade
 *    `upgradeSpell` deducts 10 (canister 190) then throws the same way.
 *    HUD debit never runs. No unpaid death marker. #387 session WeakMap
 *    is gone on remount. #926 stamps keep for remount heal / shop.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed-spend flags
 *    are gone.
 * 4. Leftover #926: heal `resolveCommittedDokaAfterSpendKeepRemount`
 *    fetches 100 / 190. Unique leftover: lava death `persistDeathPenalty`
 *    uses remount committed 200, `computeDeathPenalty` → Doka **120**.
 *    `saveBattleStats` never mints incoming-above-stored, so rename
 *    canister 100 stays put (missed 40 Doka tax). Incoming-below-stored
 *    applies for upgrade 190 → 120 (over-cuts remaining after the fee).
 *
 * Unique vs **#926** (heal/shop honour of this stamp), **#387** (session
 * WeakMap), **#909** / **#900** / **#869** / **#866** / **#877** (credit
 * remount death — skip live ≤ pre), and **#927** (heal double-charge).
 *
 * This sidecar reads the same #926 stamp and honours replica wallet as
 * the death-cut **base** so 20/40 taxes 100 → 60 or 190 → 114, not
 * Play-entry 200 → 120. Stale live ≥ stamped `preDoka` fail-closes (a
 * live wallet that did not drop is stale or the Play-entry cache).
 * Credit-style `live <= committed` would stuck-skip a real fee forever.
 * Fresh 100 / 190 commits onto the lock then the death write runs.
 * Pickup-only (no stamp) still cuts 200 → 120.
 *
 * Do not stamp here — #926 notes keep after rename / upgrade
 * throw-after-debit. Explicit `upgradeSpell failed` / `renameCharacter
 * failed` never stamps. Do not restack WX / progressPersist /
 * deathPenalty / renameCharacter / spellUpgrade / itemShop / #926 file.
 *
 * Tests reproduce remount death vs the gated skip. Restack death persist
 * onto `persistDeathPenaltyThroughSpendKeepRemount` after #926 lands.
 * No Motoko.
 */

import {
  type DeathPenaltyAmounts,
  type DeathPenaltyStorage,
  computeDeathPenalty,
} from "./deathPenalty.ts";
import { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT } from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

/**
 * Same key as #926 `spendKeepRemountKey`. Remount death honour must read
 * the rename / upgrade throw-after-debit stamp, not a second key.
 */
export function spendKeepRemountDeathCutKey(slot: number): string {
  return `pbv_spend_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type SpendKeepRemountDeathCutStamp = {
  /** Lock wallet before the throw-after-debit spend. */
  preDoka: number;
};

export function readSpendKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): SpendKeepRemountDeathCutStamp | null {
  try {
    const raw = storage.getItem(spendKeepRemountDeathCutKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SpendKeepRemountDeathCutStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeSpendKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: SpendKeepRemountDeathCutStamp,
): void {
  try {
    storage.setItem(
      spendKeepRemountDeathCutKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearSpendKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(spendKeepRemountDeathCutKey(slot));
  } catch {
    // ignore
  }
}

export function hasSpendKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readSpendKeepRemountDeathCut(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #926
 * `noteSpendKeepRemount` after rename / upgrade throw-after-debit.
 */
export function noteSpendKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeSpendKeepRemountDeathCut(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

export function dokaFromSpendDeathCutWallet(raw: unknown): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromSpendDeathCutWallet((raw as { ok: unknown }).ok);
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return toNat(n);
}

/**
 * Stale Play-entry / session cache still equals or sits above the pre-spend
 * lock. `renameCharacter` / `upgradeSpell` only debit, so a live wallet
 * that did not drop is stale (or the Play-entry cache). Missing live is
 * fail-closed only when a keep stamp exists.
 */
export function shouldRefuseSpendKeepRemountDeathCutStaleDoka(args: {
  keep: boolean;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) >= toNat(args.stampedPreDoka);
}

/**
 * Honour remount death-cut **base** Doka from replica wallet when the
 * #926 keep stamp says a rename / upgrade fee may already be on the
 * canister. Stale Play-entry equal to stamped `preDoka` must not fall
 * back to remount wallet (that is the wipe: 40% of 200 → 120 over 100).
 */
export function dokaForSpendKeepRemountDeathCut(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseSpendKeepRemountDeathCutStaleDoka({
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
 * 20/40 on the honoured wallet. Ungated remount uses Play-entry 200 →
 * 120. Gated fresh rename 100 → 60; upgrade 190 → 114.
 */
export function deathPenaltyAfterSpendKeepRemount(args: {
  xp: number;
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): DeathPenaltyAmounts | null {
  const base = dokaForSpendKeepRemountDeathCut({
    remountDoka: args.remountDoka,
    liveDoka: args.liveDoka,
    keep: args.keep,
    stampedPreDoka: args.stampedPreDoka,
  });
  if (base == null) return null;
  return computeDeathPenalty(args.xp, base);
}

function refuseStaleSpendKeepRemountDeathCut(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type SpendKeepRemountDeathCutPersist = {
  snapshot: () => { doka: number; xp: number; level: number };
  commit?: (next: { doka?: number; xp?: number; level?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * persistDeathPenalty remount wallet used Play-entry Doka 200 after a
 * rename / upgrade throw-after-debit. Fetch `getCallerDokaBalance` when
 * the #926 remount keep stamp exists. Stale live ≥ stamped `preDoka`
 * throws.
 *
 * Success adopts replica onto the lock and clears the stamp so a later
 * leftover heal cannot tax Play-entry again. Fail-close keeps the stamp.
 */
export async function resolveCommittedDokaAfterSpendKeepRemountDeathCut(
  persist: Pick<SpendKeepRemountDeathCutPersist, "snapshot" | "commit">,
  readWallet: () => Promise<unknown>,
  storage: DeathPenaltyStorage,
  slot: number,
): Promise<number> {
  const remountDoka = toNat(persist.snapshot().doka);
  const stamp = readSpendKeepRemountDeathCut(storage, slot);
  if (!stamp) return remountDoka;

  let liveDoka: number | null = null;
  try {
    liveDoka = dokaFromSpendDeathCutWallet(await readWallet());
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
    ) {
      throw err;
    }
    refuseStaleSpendKeepRemountDeathCut();
  }

  const honoured = dokaForSpendKeepRemountDeathCut({
    remountDoka,
    liveDoka,
    keep: true,
    stampedPreDoka: stamp.preDoka,
  });
  if (honoured == null) refuseStaleSpendKeepRemountDeathCut();
  persist.commit?.({ doka: honoured });
  clearSpendKeepRemountDeathCut(storage, slot);
  return honoured;
}

/**
 * Death persist enqueue: honour replica Doka from the #926 stamp, then
 * `computeDeathPenalty` on that base. Production uses `skipBeforeEach`
 * so unpaid flush cannot recut. Call this instead of bare death enqueue
 * when restacking WorldExploration `persistDeathPenalty`.
 */
export async function persistDeathPenaltyThroughSpendKeepRemount<T>(args: {
  persist: SpendKeepRemountDeathCutPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: (after: DeathPenaltyAmounts) => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(
    async () => {
      const committed = args.persist.snapshot();
      const dokaBase = await resolveCommittedDokaAfterSpendKeepRemountDeathCut(
        args.persist,
        args.readWallet,
        args.storage,
        args.slot,
      );
      const after = computeDeathPenalty(committed.xp, dokaBase);
      return args.applyAndCommit(after);
    },
    { skipBeforeEach: true },
  );
}
