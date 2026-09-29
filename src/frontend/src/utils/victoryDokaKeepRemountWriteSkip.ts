/**
 * Seeded handleBattleEnd `resolveBattleRewards` / `applyRewards` can land
 * Doka on the canister then throw before `commit`. Same-session keep is
 * owned by #532 / #580 (`noteUnconfirmedCredit` on the persist lock) —
 * those flags die when WorldExploration remounts.
 *
 * Remount Doka stamps that require a death-cut are owned by #742.
 * Portal XP remount keep without unpaid death is owned by #767
 * (`pbv_portal_xp_keep_remount_slotN`). Portal enqueue is dokaDelta 0.
 *
 * Remount after victory Doka keep **without** unpaid death is still a wipe:
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200: HUD credit waits for commit, and
 *    `shouldApplyCallerDokaHydrate` ignores later wallet refetches while
 *    the world session is mounted.
 * 2. Victory `applyRewards(slot, 50, xp)` invokes then throws (canister
 *    250). Catch only `logDebugInfo`s. Lock stays 200. No unpaid death
 *    marker. #742 / #759 / #767 do not stamp this wallet.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are gone.
 * 4. Heal / shop `persistAbsoluteProgress` calls
 *    `resolveCommittedDokaForAbsoluteWrite`. Seeded && !unconfirmed
 *    returns committed 200 without fetching. `saveBattleStats` applies
 *    incoming-below-stored; the victory grant is gone.
 *
 * This sidecar stamps victory Doka transport-keep in sessionStorage
 * without requiring unpaid death. Remount absolute Doka resolve
 * re-fetches `getCallerDokaBalance`; live ≤ stamped `preDoka` fail-closes
 * (`applyRewards` only adds — a live wallet that did not rise is stale
 * or placeholder 0). Fresh 250 commits and clears the stamp.
 *
 * Explicit `applyRewards failed` must not stamp (canister did not add).
 *
 * `WorldExploration.tsx`, `progressPersist.ts`, `rewardResolver.ts`,
 * `deathPenalty.ts`, and the #532 / #580 / #742 / #767 remount files are
 * occupied / unmerged, so this PR does not restack them. Tests reproduce
 * remount heal vs the gated skip. Restack victory enqueue onto
 * `persistVictoryDokaThroughVictoryDokaKeepRemount` and absolute Doka onto
 * `resolveCommittedDokaAfterVictoryDokaKeepRemount` after those PRs land.
 */

import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT } from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function victoryDokaKeepRemountKey(slot: number): string {
  return `pbv_victory_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type VictoryDokaKeepRemountStamp = {
  /** Lock wallet before the throw-after-add grant. */
  preDoka: number;
};

/**
 * Parsed `#err` / `applyRewards failed` means the canister did not add.
 * Any other throw is after-or-during invoke — the replica may have the grant.
 */
export function shouldNoteVictoryDokaKeepRemount(args: {
  dokaDelta: number;
  error: unknown;
}): boolean {
  if (toNat(args.dokaDelta) <= 0) return false;
  const msg = toMessage(args.error);
  if (!msg) return false;
  if (msg.includes("applyRewards failed")) return false;
  return true;
}

export function readVictoryDokaKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): VictoryDokaKeepRemountStamp | null {
  try {
    const raw = storage.getItem(victoryDokaKeepRemountKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<VictoryDokaKeepRemountStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeVictoryDokaKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: VictoryDokaKeepRemountStamp,
): void {
  try {
    storage.setItem(
      victoryDokaKeepRemountKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearVictoryDokaKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(victoryDokaKeepRemountKey(slot));
  } catch {
    // ignore
  }
}

export function hasVictoryDokaKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readVictoryDokaKeepRemount(storage, slot) != null;
}

/**
 * Note remount-durable victory Doka keep. Does **not** require unpaid death
 * pending (that is #742 / #759). `preDoka` is the lock wallet before the grant.
 */
export function noteVictoryDokaKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  args: { dokaDelta: number; error: unknown; preDoka: number },
): void {
  if (
    !shouldNoteVictoryDokaKeepRemount({
      dokaDelta: args.dokaDelta,
      error: args.error,
    })
  ) {
    return;
  }
  writeVictoryDokaKeepRemount(storage, slot, { preDoka: args.preDoka });
}

export function dokaFromWalletRecord(raw: unknown): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromWalletRecord((raw as { ok: unknown }).ok);
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return toNat(n);
}

/**
 * Stale Play-entry / session cache still equals or sits below the pre-keep
 * lock. `applyRewards` only adds, so a live wallet that did not rise is
 * stale (or placeholder 0). Missing live is fail-closed only when a keep
 * stamp exists.
 */
export function shouldRefuseVictoryDokaKeepRemountStaleDoka(args: {
  keep: boolean;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) <= toNat(args.stampedPreDoka);
}

/**
 * Honour remount absolute Doka from replica wallet when the keep stamp
 * says a victory grant may already be on the canister. Stale Play-entry
 * equal to stamped `preDoka` must not fall back to remount wallet
 * (that is the wipe).
 */
export function dokaForVictoryDokaKeepRemountHonour(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseVictoryDokaKeepRemountStaleDoka({
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

function refuseStaleVictoryDokaKeepRemount(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type VictoryDokaKeepRemountPersist = {
  snapshot: () => { doka: number };
  commit?: (next: { doka?: number }) => void;
  enqueue: <T>(fn: () => Promise<T>) => Promise<T>;
};

/**
 * persistAbsoluteProgress remount wallet used Play-entry Doka 200 after a
 * victory throw-after-add. Fetch `getCallerDokaBalance` when the remount
 * keep stamp exists. Stale live ≤ stamped `preDoka` throws.
 */
export async function resolveCommittedDokaAfterVictoryDokaKeepRemount(
  persist: Pick<VictoryDokaKeepRemountPersist, "snapshot" | "commit">,
  readWallet: () => Promise<unknown>,
  storage: DeathPenaltyStorage,
  slot: number,
): Promise<number> {
  const remountDoka = toNat(persist.snapshot().doka);
  const stamp = readVictoryDokaKeepRemount(storage, slot);
  if (!stamp) return remountDoka;

  let liveDoka: number | null = null;
  try {
    liveDoka = dokaFromWalletRecord(await readWallet());
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
    ) {
      throw err;
    }
    refuseStaleVictoryDokaKeepRemount();
  }

  const honoured = dokaForVictoryDokaKeepRemountHonour({
    remountDoka,
    liveDoka,
    keep: true,
    stampedPreDoka: stamp.preDoka,
  });
  if (honoured == null) refuseStaleVictoryDokaKeepRemount();
  persist.commit?.({ doka: honoured });
  clearVictoryDokaKeepRemount(storage, slot);
  return honoured;
}

/**
 * Victory enqueue `resolveBattleRewards` then `commit`. A throw-after-add
 * never commits. Note sidecar keep before remount heal can honour
 * Play-entry wallet. Call this instead of bare `enqueue` when restacking
 * WorldExploration handleBattleEnd.
 */
export async function persistVictoryDokaThroughVictoryDokaKeepRemount<T>(args: {
  persist: Pick<VictoryDokaKeepRemountPersist, "enqueue" | "snapshot">;
  storage: DeathPenaltyStorage;
  slot: number;
  dokaDelta: number;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const preDoka = toNat(args.persist.snapshot().doka);
    try {
      return await args.applyAndCommit();
    } catch (err) {
      noteVictoryDokaKeepRemount(args.storage, args.slot, {
        dokaDelta: args.dokaDelta,
        error: err,
        preDoka,
      });
      throw err;
    }
  });
}
