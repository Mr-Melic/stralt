/**
 * #774 stamps remount Doka keep after victory `applyRewards` throw-after-add
 * (`pbv_victory_doka_keep_remount_slotN`) and honours replica wallet on
 * remount **heal / shop** `persistAbsoluteProgress`. Those flags / honour
 * helpers never enter `persistDeathPenalty`.
 *
 * Production death persist reads `progressPersist.snapshot().doka` (or
 * `resolveCommittedDokaForAbsoluteWrite`, which on a seeded remount lock
 * returns committed immediately). Remount `createProgressPersist` seeds
 * GameFlow `dokaBalance` — HUD credit waits for parsed commit, so after a
 * throw-after-add that is still Play-entry 200.
 *
 * Remount after victory Doka keep **without** unpaid death is still a
 * wipe when the next write is lava death, not heal:
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200.
 * 2. Victory `applyRewards(slot, 50, xp)` invokes then throws (canister
 *    250). Catch only `logDebugInfo`s. Lock stays 200. No unpaid death
 *    marker. #774 stamps keep.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are gone.
 * 4. Leftover #774: heal `resolveCommittedDokaAfterVictoryDokaKeepRemount`
 *    fetches 250. Unique leftover: lava death `persistDeathPenalty` uses
 *    remount committed 200, `computeDeathPenalty` → Doka **120**.
 *    `saveBattleStats` applies incoming-below-stored; the victory grant
 *    is gone.
 *
 * This sidecar reads the same #774 stamp and honours replica wallet as
 * the death-cut **base** so 20/40 taxes 250 → 150, not Play-entry 200 →
 * 120. Stale live ≤ stamped `preDoka` fail-closes. Fresh 250 commits
 * onto the lock then the death write runs. Pickup-only (no stamp) still
 * cuts 200 → 120.
 *
 * Do not stamp here — #774 notes keep after victory throw-after-add.
 * Explicit `applyRewards failed` never stamps. Do not restack WX /
 * progressPersist / deathPenalty / rewardResolver / #774 file.
 *
 * Tests reproduce remount death vs the gated skip. Restack death persist
 * onto `persistDeathPenaltyThroughVictoryDokaKeepRemount` after #774
 * lands. No Motoko.
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
 * Same key as #774 `victoryDokaKeepRemountKey`. Remount death honour
 * must read the victory throw-after-add stamp, not a second key.
 */
export function victoryDokaKeepRemountDeathCutKey(slot: number): string {
  return `pbv_victory_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type VictoryDokaKeepRemountDeathCutStamp = {
  /** Lock wallet before the throw-after-add grant. */
  preDoka: number;
};

export function readVictoryDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): VictoryDokaKeepRemountDeathCutStamp | null {
  try {
    const raw = storage.getItem(victoryDokaKeepRemountDeathCutKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<VictoryDokaKeepRemountDeathCutStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeVictoryDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: VictoryDokaKeepRemountDeathCutStamp,
): void {
  try {
    storage.setItem(
      victoryDokaKeepRemountDeathCutKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearVictoryDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(victoryDokaKeepRemountDeathCutKey(slot));
  } catch {
    // ignore
  }
}

export function hasVictoryDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readVictoryDokaKeepRemountDeathCut(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #774
 * `noteVictoryDokaKeepRemount` after victory throw-after-add.
 */
export function noteVictoryDokaKeepRemountDeathCut(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeVictoryDokaKeepRemountDeathCut(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

export function dokaFromVictoryDeathCutWallet(raw: unknown): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromVictoryDeathCutWallet((raw as { ok: unknown }).ok);
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
export function shouldRefuseVictoryDokaKeepRemountDeathCutStaleDoka(args: {
  keep: boolean;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) <= toNat(args.stampedPreDoka);
}

/**
 * Honour remount death-cut **base** Doka from replica wallet when the
 * #774 keep stamp says a victory grant may already be on the canister.
 * Stale Play-entry equal to stamped `preDoka` must not fall back to
 * remount wallet (that is the wipe: 40% of 200 → 120 over 250).
 */
export function dokaForVictoryDokaKeepRemountDeathCut(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseVictoryDokaKeepRemountDeathCutStaleDoka({
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
 * 120. Gated fresh 250 → 150.
 */
export function deathPenaltyAfterVictoryDokaKeepRemount(args: {
  xp: number;
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): DeathPenaltyAmounts | null {
  const base = dokaForVictoryDokaKeepRemountDeathCut({
    remountDoka: args.remountDoka,
    liveDoka: args.liveDoka,
    keep: args.keep,
    stampedPreDoka: args.stampedPreDoka,
  });
  if (base == null) return null;
  return computeDeathPenalty(args.xp, base);
}

function refuseStaleVictoryDokaKeepRemountDeathCut(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type VictoryDokaKeepRemountDeathCutPersist = {
  snapshot: () => { doka: number; xp: number; level: number };
  commit?: (next: { doka?: number; xp?: number; level?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
};

/**
 * persistDeathPenalty remount wallet used Play-entry Doka 200 after a
 * victory throw-after-add. Fetch `getCallerDokaBalance` when the #774
 * remount keep stamp exists. Stale live ≤ stamped `preDoka` throws.
 *
 * Success adopts replica onto the lock and clears the stamp so a later
 * leftover heal cannot tax Play-entry again. Fail-close keeps the stamp.
 */
export async function resolveCommittedDokaAfterVictoryDokaKeepRemountDeathCut(
  persist: Pick<VictoryDokaKeepRemountDeathCutPersist, "snapshot" | "commit">,
  readWallet: () => Promise<unknown>,
  storage: DeathPenaltyStorage,
  slot: number,
): Promise<number> {
  const remountDoka = toNat(persist.snapshot().doka);
  const stamp = readVictoryDokaKeepRemountDeathCut(storage, slot);
  if (!stamp) return remountDoka;

  let liveDoka: number | null = null;
  try {
    liveDoka = dokaFromVictoryDeathCutWallet(await readWallet());
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
    ) {
      throw err;
    }
    refuseStaleVictoryDokaKeepRemountDeathCut();
  }

  const honoured = dokaForVictoryDokaKeepRemountDeathCut({
    remountDoka,
    liveDoka,
    keep: true,
    stampedPreDoka: stamp.preDoka,
  });
  if (honoured == null) refuseStaleVictoryDokaKeepRemountDeathCut();
  persist.commit?.({ doka: honoured });
  clearVictoryDokaKeepRemountDeathCut(storage, slot);
  return honoured;
}

/**
 * Death persist enqueue: honour replica Doka from the #774 stamp, then
 * `computeDeathPenalty` on that base. Production uses `skipBeforeEach`
 * so unpaid flush cannot recut. Call this instead of bare death enqueue
 * when restacking WorldExploration `persistDeathPenalty`.
 */
export async function persistDeathPenaltyThroughVictoryDokaKeepRemount<
  T,
>(args: {
  persist: VictoryDokaKeepRemountDeathCutPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: (after: DeathPenaltyAmounts) => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(
    async () => {
      const committed = args.persist.snapshot();
      const dokaBase =
        await resolveCommittedDokaAfterVictoryDokaKeepRemountDeathCut(
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
