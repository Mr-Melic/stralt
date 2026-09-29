/**
 * Seeded `redeemGameKeyThroughPersist` can land Doka on the canister then
 * throw before `#ok` is parsed / `commit`. Same-session keep is owned by
 * #545 (unseeded) / #552 (seeded) — those flags live on the persist lock
 * and die when WorldExploration remounts.
 *
 * Remount Doka stamps that require a death-cut are owned by #742.
 * Victory `applyRewards` throw-after-add remount keep without unpaid
 * death is owned by #774 (`pbv_victory_doka_keep_remount_slotN`).
 * One-shot shrine / ground / dungeon-complete remount keep is owned by
 * #800 (`pbv_oneshot_doka_keep_remount_slotN`). Portal XP remount keep
 * (dokaDelta 0) is owned by #767.
 *
 * Remount after GameKey redeem keep **without** unpaid death is still a
 * wipe:
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200: HUD credit waits for parsed `#ok` then
 *    `onDokaCredited`, and `shouldApplyCallerDokaHydrate` ignores later
 *    wallet refetches while the world session is mounted.
 * 2. Shop `redeemGameKey` adds 1000 (canister 1200) then the replica
 *    rejects. `#ok` is never parsed. Commit never runs. Shop catch only
 *    toasts "Redeem failed". Lock stays 200. No unpaid death marker.
 *    #545 / #552 session flags die on remount. #742 / #767 / #774 /
 *    #800 do not stamp this wallet (`redeemGameKey`, not `applyRewards`).
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are gone.
 * 4. Heal / shop `persistAbsoluteProgress` calls
 *    `resolveCommittedDokaForAbsoluteWrite`. Seeded && !unconfirmed
 *    returns committed 200 without fetching. `saveBattleStats` applies
 *    incoming-below-stored; the paid grant is gone. Retry hits
 *    "GameKey already used".
 *
 * This sidecar stamps GameKey Doka transport-keep in sessionStorage
 * without requiring unpaid death. Remount absolute Doka resolve
 * re-fetches `getCallerDokaBalance`; live ≤ stamped `preDoka` fail-closes
 * (`redeemGameKey` only adds). Fresh 1200 commits and clears the stamp.
 *
 * Explicit `#err` (`already used`, `Invalid GameKey`, `not yet approved`,
 * `redeemGameKey failed`) means the canister did not add. Do not stamp.
 *
 * `WorldExploration.tsx`, `progressPersist.ts`, `shopPurchase.ts`,
 * `DokaGameKeyShop.tsx`, `deathPenalty.ts`, and the #545 / #552 / #742 /
 * #767 / #774 / #800 remount files are occupied / unmerged, so this PR
 * does not restack them. Tests reproduce remount heal vs the gated skip.
 * Restack shop redeem onto
 * `persistGameKeyThroughGameKeyDokaKeepRemount` and absolute Doka onto
 * `resolveCommittedDokaAfterGameKeyDokaKeepRemount` after those PRs land.
 */

import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT } from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function gameKeyDokaKeepRemountKey(slot: number): string {
  return `pbv_gamekey_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type GameKeyDokaKeepRemountStamp = {
  /** Lock wallet before the throw-after-add grant. */
  preDoka: number;
};

/**
 * Parsed `#err` / `already used` / `Invalid GameKey` means the canister
 * did not add. `applyRewards failed` is a different credit path (#774 /
 * #800). Any other throw is after-or-during invoke — the replica may
 * have consumed the key and added Doka.
 */
export function shouldNoteGameKeyDokaKeepRemount(error: unknown): boolean {
  const msg = toMessage(error);
  if (!msg) return false;
  const lower = msg.toLowerCase();
  if (msg.includes("applyRewards failed")) return false;
  if (lower.includes("redeemgamekey failed")) return false;
  if (lower.includes("already used")) return false;
  if (lower.includes("invalid gamekey")) return false;
  if (lower.includes("not yet approved")) return false;
  if (lower.includes("gamekey is too short")) return false;
  return true;
}

export function readGameKeyDokaKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): GameKeyDokaKeepRemountStamp | null {
  try {
    const raw = storage.getItem(gameKeyDokaKeepRemountKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GameKeyDokaKeepRemountStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeGameKeyDokaKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: GameKeyDokaKeepRemountStamp,
): void {
  try {
    storage.setItem(
      gameKeyDokaKeepRemountKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearGameKeyDokaKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(gameKeyDokaKeepRemountKey(slot));
  } catch {
    // ignore
  }
}

export function hasGameKeyDokaKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readGameKeyDokaKeepRemount(storage, slot) != null;
}

/**
 * Note remount-durable GameKey Doka keep. Does **not** require unpaid death
 * pending (that is #742). `preDoka` is the lock wallet before the grant.
 */
export function noteGameKeyDokaKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  args: { error: unknown; preDoka: number },
): void {
  if (!shouldNoteGameKeyDokaKeepRemount(args.error)) return;
  writeGameKeyDokaKeepRemount(storage, slot, { preDoka: toNat(args.preDoka) });
}

export function dokaFromGameKeyKeepRemountWallet(raw: unknown): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromGameKeyKeepRemountWallet((raw as { ok: unknown }).ok);
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return toNat(n);
}

/**
 * Stale Play-entry / session cache still equals or sits below the pre-keep
 * lock. `redeemGameKey` only adds, so a live wallet that did not rise is
 * stale (or placeholder 0). Missing live is fail-closed only when a keep
 * stamp exists.
 */
export function shouldRefuseGameKeyDokaKeepRemountStaleDoka(args: {
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
 * says a GameKey grant may already be on the canister. Stale Play-entry
 * equal to stamped `preDoka` must not fall back to remount wallet
 * (that is the wipe).
 */
export function dokaForGameKeyDokaKeepRemountHonour(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseGameKeyDokaKeepRemountStaleDoka({
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

function refuseStaleGameKeyDokaKeepRemount(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type GameKeyDokaKeepRemountPersist = {
  snapshot: () => { doka: number };
  commit?: (next: { doka?: number }) => void;
  enqueue?: <T>(fn: () => Promise<T>) => Promise<T>;
};

/**
 * persistAbsoluteProgress remount wallet used Play-entry Doka 200 after a
 * GameKey throw-after-add. Fetch `getCallerDokaBalance` when the remount
 * keep stamp exists. Stale live ≤ stamped `preDoka` throws.
 */
export async function resolveCommittedDokaAfterGameKeyDokaKeepRemount(
  persist: Pick<GameKeyDokaKeepRemountPersist, "snapshot" | "commit">,
  readWallet: () => Promise<unknown>,
  storage: DeathPenaltyStorage,
  slot: number,
): Promise<number> {
  const remountDoka = toNat(persist.snapshot().doka);
  const stamp = readGameKeyDokaKeepRemount(storage, slot);
  if (!stamp) return remountDoka;

  let liveDoka: number | null = null;
  try {
    liveDoka = dokaFromGameKeyKeepRemountWallet(await readWallet());
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
    ) {
      throw err;
    }
    refuseStaleGameKeyDokaKeepRemount();
  }

  const honoured = dokaForGameKeyDokaKeepRemountHonour({
    remountDoka,
    liveDoka,
    keep: true,
    stampedPreDoka: stamp.preDoka,
  });
  if (honoured == null) refuseStaleGameKeyDokaKeepRemount();
  persist.commit?.({ doka: honoured });
  clearGameKeyDokaKeepRemount(storage, slot);
  return honoured;
}

/**
 * Shop `redeemGameKeyThroughPersist` already enqueues. Wrap the call so a
 * throw-after-add stamps remount keep before heal can honour Play-entry
 * wallet. Call this instead of the bare helper when restacking
 * DokaGameKeyShop.
 */
export async function persistGameKeyThroughGameKeyDokaKeepRemount<T>(args: {
  persist: Pick<GameKeyDokaKeepRemountPersist, "snapshot">;
  storage: DeathPenaltyStorage;
  slot: number;
  redeemAndCommit: () => Promise<T>;
}): Promise<T> {
  const preDoka = toNat(args.persist.snapshot().doka);
  try {
    return await args.redeemAndCommit();
  } catch (err) {
    noteGameKeyDokaKeepRemount(args.storage, args.slot, {
      error: err,
      preDoka,
    });
    throw err;
  }
}
