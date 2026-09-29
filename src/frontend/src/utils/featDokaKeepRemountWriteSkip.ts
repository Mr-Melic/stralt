/**
 * Seeded `creditAchievementRewardThroughPersist` can land Doka on the
 * canister then throw before `#ok` is parsed / `commit`. Same-session keep
 * is owned by #545 (unseeded) / #552 (seeded) — those flags live on the
 * persist lock and die when WorldExploration remounts.
 *
 * Remount Doka stamps that require a death-cut are owned by #742.
 * Victory `applyRewards` throw-after-add remount keep without unpaid
 * death is owned by #774 (`pbv_victory_doka_keep_remount_slotN`).
 * One-shot shrine / ground / dungeon-complete remount keep is owned by
 * #800 (`pbv_oneshot_doka_keep_remount_slotN`). GameKey `redeemGameKey`
 * remount keep is owned by #811 (`pbv_gamekey_doka_keep_remount_slotN`).
 * Portal XP remount keep (dokaDelta 0) is owned by #767.
 *
 * Remount after feat `claimAchievementReward` keep **without** unpaid
 * death is still a wipe:
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200: HUD credit waits for parsed `#ok` then
 *    `creditLiveDoka` in `persistAchievementClaim`, and
 *    `shouldApplyCallerDokaHydrate` ignores later wallet refetches while
 *    the world session is mounted.
 * 2. Trophy `claimAchievementReward` adds 500 (canister 700) then the
 *    replica rejects. `#ok` is never parsed. Commit never runs. Panel
 *    catch only toasts "Failed to claim reward". Lock stays 200. No
 *    unpaid death marker. #545 / #552 session flags die on remount.
 *    #742 / #767 / #774 / #800 / #811 do not stamp this wallet
 *    (`claimAchievementReward`, not `applyRewards` / `redeemGameKey`).
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are gone.
 * 4. Heal / shop `persistAbsoluteProgress` calls
 *    `resolveCommittedDokaForAbsoluteWrite`. Seeded && !unconfirmed
 *    returns committed 200 without fetching. `saveBattleStats` applies
 *    incoming-below-stored; the feat grant is gone. Retry hits
 *    "Reward already claimed".
 *
 * This sidecar stamps feat Doka transport-keep in sessionStorage
 * without requiring unpaid death. Remount absolute Doka resolve
 * re-fetches `getCallerDokaBalance`; live ≤ stamped `preDoka` fail-closes
 * (`claimAchievementReward` only adds). Fresh 700 commits and clears
 * the stamp.
 *
 * Explicit `#err` (`Reward already claimed`, `Achievement not yet
 * unlocked`, `Unknown achievement`, `claimAchievementReward failed`)
 * means the canister did not add. Do not stamp. Parsed `#err` from
 * `creditAchievementRewardThroughPersist` is a return, not a throw.
 *
 * `WorldExploration.tsx`, `progressPersist.ts`, `achievementReward.ts`,
 * `AchievementsPanel.tsx`, `deathPenalty.ts`, and the #545 / #552 /
 * #742 / #767 / #774 / #800 / #811 remount files are occupied /
 * unmerged, so this PR does not restack them. Tests reproduce remount
 * heal vs the gated skip. Restack world `persistClaim` onto
 * `persistFeatThroughFeatDokaKeepRemount` and absolute Doka onto
 * `resolveCommittedDokaAfterFeatDokaKeepRemount` after those PRs land.
 */

import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import { ABSOLUTE_WRITE_UNCONFIRMED_CREDIT } from "./progressPersist.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function featDokaKeepRemountKey(slot: number): string {
  return `pbv_feat_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type FeatDokaKeepRemountStamp = {
  /** Lock wallet before the throw-after-add grant. */
  preDoka: number;
};

/**
 * Parsed `#err` / already-claimed / not-unlocked means the canister did
 * not add. `applyRewards failed` and GameKey `#err` strings are different
 * credit paths (#774 / #800 / #811). Any other throw is after-or-during
 * invoke — the replica may have marked claimed and added Doka.
 */
export function shouldNoteFeatDokaKeepRemount(error: unknown): boolean {
  const msg = toMessage(error);
  if (!msg) return false;
  const lower = msg.toLowerCase();
  if (msg.includes("applyRewards failed")) return false;
  if (lower.includes("redeemgamekey failed")) return false;
  if (lower.includes("already used")) return false;
  if (lower.includes("invalid gamekey")) return false;
  if (lower.includes("not yet approved")) return false;
  if (lower.includes("claimachievementreward failed")) return false;
  if (lower.includes("claimachievementreward returned an empty result")) {
    return false;
  }
  if (lower.includes("claimachievementreward missing granted amount")) {
    return false;
  }
  if (lower.includes("already claimed")) return false;
  if (lower.includes("not yet unlocked")) return false;
  if (lower.includes("unknown achievement")) return false;
  if (lower.includes("unauthorized")) return false;
  if (lower.includes("account banned")) return false;
  if (lower.includes("condition is not a recognized value")) return false;
  return true;
}

export function readFeatDokaKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): FeatDokaKeepRemountStamp | null {
  try {
    const raw = storage.getItem(featDokaKeepRemountKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<FeatDokaKeepRemountStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeFeatDokaKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: FeatDokaKeepRemountStamp,
): void {
  try {
    storage.setItem(
      featDokaKeepRemountKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearFeatDokaKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(featDokaKeepRemountKey(slot));
  } catch {
    // ignore
  }
}

export function hasFeatDokaKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readFeatDokaKeepRemount(storage, slot) != null;
}

/**
 * Note remount-durable feat Doka keep. Does **not** require unpaid death
 * pending (that is #742). `preDoka` is the lock wallet before the grant.
 */
export function noteFeatDokaKeepRemount(
  storage: DeathPenaltyStorage,
  slot: number,
  args: { error: unknown; preDoka: number },
): void {
  if (!shouldNoteFeatDokaKeepRemount(args.error)) return;
  writeFeatDokaKeepRemount(storage, slot, { preDoka: toNat(args.preDoka) });
}

export function dokaFromFeatKeepRemountWallet(raw: unknown): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromFeatKeepRemountWallet((raw as { ok: unknown }).ok);
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return toNat(n);
}

/**
 * Stale Play-entry / session cache still equals or sits below the pre-keep
 * lock. `claimAchievementReward` only adds, so a live wallet that did not
 * rise is stale (or placeholder 0). Missing live is fail-closed only when
 * a keep stamp exists.
 */
export function shouldRefuseFeatDokaKeepRemountStaleDoka(args: {
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
 * says a feat grant may already be on the canister. Stale Play-entry
 * equal to stamped `preDoka` must not fall back to remount wallet
 * (that is the wipe).
 */
export function dokaForFeatDokaKeepRemountHonour(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseFeatDokaKeepRemountStaleDoka({
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

function refuseStaleFeatDokaKeepRemount(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type FeatDokaKeepRemountPersist = {
  snapshot: () => { doka: number };
  commit?: (next: { doka?: number }) => void;
  enqueue?: <T>(fn: () => Promise<T>) => Promise<T>;
};

/**
 * persistAbsoluteProgress remount wallet used Play-entry Doka 200 after a
 * feat throw-after-add. Fetch `getCallerDokaBalance` when the remount
 * keep stamp exists. Stale live ≤ stamped `preDoka` throws.
 */
export async function resolveCommittedDokaAfterFeatDokaKeepRemount(
  persist: Pick<FeatDokaKeepRemountPersist, "snapshot" | "commit">,
  readWallet: () => Promise<unknown>,
  storage: DeathPenaltyStorage,
  slot: number,
): Promise<number> {
  const remountDoka = toNat(persist.snapshot().doka);
  const stamp = readFeatDokaKeepRemount(storage, slot);
  if (!stamp) return remountDoka;

  let liveDoka: number | null = null;
  try {
    liveDoka = dokaFromFeatKeepRemountWallet(await readWallet());
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
    ) {
      throw err;
    }
    refuseStaleFeatDokaKeepRemount();
  }

  const honoured = dokaForFeatDokaKeepRemountHonour({
    remountDoka,
    liveDoka,
    keep: true,
    stampedPreDoka: stamp.preDoka,
  });
  if (honoured == null) refuseStaleFeatDokaKeepRemount();
  persist.commit?.({ doka: honoured });
  clearFeatDokaKeepRemount(storage, slot);
  return honoured;
}

/**
 * World `persistAchievementClaim` already enqueues
 * `creditAchievementRewardThroughPersist`. Wrap the call so a
 * throw-after-add stamps remount keep before heal can honour Play-entry
 * wallet. Call this instead of the bare helper when restacking
 * WorldExploration `persistClaim`.
 */
export async function persistFeatThroughFeatDokaKeepRemount<T>(args: {
  persist: Pick<FeatDokaKeepRemountPersist, "snapshot">;
  storage: DeathPenaltyStorage;
  slot: number;
  claimAndCommit: () => Promise<T>;
}): Promise<T> {
  const preDoka = toNat(args.persist.snapshot().doka);
  try {
    return await args.claimAndCommit();
  } catch (err) {
    noteFeatDokaKeepRemount(args.storage, args.slot, {
      error: err,
      preDoka,
    });
    throw err;
  }
}
