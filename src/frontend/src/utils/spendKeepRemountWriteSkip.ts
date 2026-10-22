/**
 * Seeded `renameCharacter` / `upgradeSpell` can debit Doka on the canister
 * then throw before the persist lock `commit`s. Same-session spend keep is
 * owned by #387 (`noteUnconfirmedSpend` on a WeakMap keyed by the persist
 * lock) — that flag dies when WorldExploration remounts.
 *
 * Credit remount stamps (#774 victory Doka, #800 one-shot, #811 GameKey,
 * #812 feat, #864 Boss Rush) skip a live wallet that did **not rise**.
 * Spend skip is the inverse: a live wallet that did **not drop** is the
 * pre-debit snapshot. Credit-style `live <= committed` would stuck-skip a
 * real fee forever.
 *
 * Remount after rename / upgrade throw-after-debit **without** unpaid
 * death is still a free BuffShop item:
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200: HUD debit waits for parsed `#ok` /
 *    `persistSpellUpgrade` return, and `shouldApplyCallerDokaHydrate`
 *    ignores later wallet refetches while the world session is mounted.
 * 2. Rename `renameCharacter` deducts 100 (canister 100) then throws
 *    (`replica went away`). Catch only toasts. Lock stays 200. Upgrade
 *    `upgradeSpell` deducts 10 (canister 190) then throws the same way.
 *    HUD debit never runs. No unpaid death marker. #387 session WeakMap
 *    is gone on remount. #742 / #774 / #800 / #811 / #812 / #864 do not
 *    stamp a spend (those keys are credits).
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed-spend flags
 *    are gone.
 * 4. Items Buy `persistAbsoluteProgress` calls
 *    `resolveCommittedDokaForAbsoluteWrite`. Seeded && !unconfirmed
 *    returns committed 200 without fetching. Shop spend 50 writes 150.
 *    `saveBattleStats` never mints incoming-above-stored, so canister
 *    100 / 190 stays put while the item still lands — a free purchase.
 *
 * This sidecar stamps rename / upgrade transport-keep spend in
 * sessionStorage without requiring unpaid death. Remount absolute Doka
 * resolve re-fetches `getCallerDokaBalance`; live ≥ stamped `preDoka`
 * fail-closes (a live wallet that did not drop is stale or the Play-entry
 * cache). Fresh 100 / 190 commits and clears the stamp.
 *
 * Explicit `upgradeSpell failed` / parsed rename `#err` must not stamp
 * (canister did not debit). `spend <= 0` must not stamp.
 *
 * `WorldExploration.tsx`, `progressPersist.ts`, `renameCharacter.ts`,
 * `spellUpgrade.ts`, `itemShop.ts`, `BuffShop.tsx`, and the #387
 * `progressPersistSpend.ts` / WX restack are occupied / unmerged, so this
 * PR does not restack them. Tests reproduce remount shop vs the gated
 * skip. Restack rename / upgrade enqueue onto
 * `persistSpendThroughSpendKeepRemount` and absolute Doka onto
 * `resolveCommittedDokaAfterSpendKeepRemount` after those PRs land.
 */

import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT } from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function spendKeepRemountKey(slot: number): string {
  return `pbv_spend_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type SpendKeepRemountStamp = {
  /** Lock wallet before the throw-after-debit spend. */
  preDoka: number;
};

/**
 * Parsed `#err` / `upgradeSpell failed` means the canister did not debit.
 * Any other throw is after-or-during invoke — the replica may have the fee.
 */
export function shouldNoteSpendKeepRemount(args: {
  spend: number;
  error: unknown;
}): boolean {
  if (toNat(args.spend) <= 0) return false;
  const msg = toMessage(args.error);
  if (!msg) return false;
  if (msg.includes("upgradeSpell failed")) return false;
  if (msg.includes("renameCharacter failed")) return false;
  return true;
}

export function readSpendKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): SpendKeepRemountStamp | null {
  try {
    const raw = storage.getItem(spendKeepRemountKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SpendKeepRemountStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeSpendKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: SpendKeepRemountStamp,
): void {
  try {
    storage.setItem(
      spendKeepRemountKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearSpendKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(spendKeepRemountKey(slot));
  } catch {
    // ignore
  }
}

export function hasSpendKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readSpendKeepRemount(storage, slot) != null;
}

/**
 * Note remount-durable spend keep. Does **not** require unpaid death
 * pending (that is #742 / #759). `preDoka` is the lock wallet before the
 * debit.
 */
export function noteSpendKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  args: { spend: number; error: unknown; preDoka: number },
): void {
  if (
    !shouldNoteSpendKeepRemount({
      spend: args.spend,
      error: args.error,
    })
  ) {
    return;
  }
  writeSpendKeepRemount(storage, slot, { preDoka: args.preDoka });
}

export function dokaFromSpendKeepRemountWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromSpendKeepRemountWalletRecord((raw as { ok: unknown }).ok);
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
export function shouldRefuseSpendKeepRemountStaleDoka(args: {
  keep: boolean;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) >= toNat(args.stampedPreDoka);
}

/**
 * Honour remount absolute Doka from replica wallet when the keep stamp
 * says a rename / upgrade fee may already be on the canister. Stale
 * Play-entry equal to stamped `preDoka` must not fall back to remount
 * wallet (that is the free-item wipe).
 */
export function dokaForSpendKeepRemountHonour(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseSpendKeepRemountStaleDoka({
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

function refuseStaleSpendKeepRemount(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type SpendKeepRemountPersist = {
  snapshot: () => { doka: number };
  commit?: (next: { doka?: number }) => void;
  enqueue: <T>(fn: () => Promise<T>) => Promise<T>;
};

/**
 * persistAbsoluteProgress remount wallet used Play-entry Doka 200 after a
 * rename / upgrade throw-after-debit. Fetch `getCallerDokaBalance` when
 * the remount keep stamp exists. Stale live ≥ stamped `preDoka` throws.
 */
export async function resolveCommittedDokaAfterSpendKeepRemount(
  persist: Pick<SpendKeepRemountPersist, "snapshot" | "commit">,
  readWallet: () => Promise<unknown>,
  storage: DeathPenaltyStorage,
  slot: number,
): Promise<number> {
  const remountDoka = toNat(persist.snapshot().doka);
  const stamp = readSpendKeepRemount(storage, slot);
  if (!stamp) return remountDoka;

  let liveDoka: number | null = null;
  try {
    liveDoka = dokaFromSpendKeepRemountWalletRecord(await readWallet());
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
    ) {
      throw err;
    }
    refuseStaleSpendKeepRemount();
  }

  const honoured = dokaForSpendKeepRemountHonour({
    remountDoka,
    liveDoka,
    keep: true,
    stampedPreDoka: stamp.preDoka,
  });
  if (honoured == null) refuseStaleSpendKeepRemount();
  persist.commit?.({ doka: honoured });
  clearSpendKeepRemount(storage, slot);
  return honoured;
}

/**
 * Rename / upgrade enqueue then `commit` the spend. A throw-after-debit
 * never commits. Note sidecar keep before remount shop can honour
 * Play-entry wallet. Call this instead of bare `enqueue` when restacking
 * WorldExploration rename / spell upgrade.
 */
export async function persistSpendThroughSpendKeepRemount<T>(args: {
  persist: Pick<SpendKeepRemountPersist, "enqueue" | "snapshot">;
  storage: DeathPenaltyStorage;
  slot: number;
  spend: number;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const preDoka = toNat(args.persist.snapshot().doka);
    try {
      return await args.applyAndCommit();
    } catch (err) {
      noteSpendKeepRemount(args.storage, args.slot, {
        spend: args.spend,
        error: err,
        preDoka,
      });
      throw err;
    }
  });
}
