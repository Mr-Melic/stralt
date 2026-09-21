/**
 * Serializes wallet/XP persist writes and tracks the last backend-committed
 * progress so absolute saveBattleStats calls cannot clobber an in-flight
 * applyRewards delta.
 *
 * applyRewards adds a delta. saveBattleStats (heals, shop spends, death
 * penalty) writes an absolute Doka/XP snapshot captured from local UI state.
 * After a victory the recap is shown immediately and heal/shop become usable
 * while applyRewards is still in flight — a click-time snapshot then overwrites
 * the just-credited wallet.
 *
 * Paid-Doka processPendingPurchases and claimAchievementReward are the same
 * class of backend delta: they must enqueue on this lock and commit the
 * post-credit balance, or a recap heal reconstructs from the pre-credit
 * snapshot and wipes the grant.
 */

export type CommittedProgress = {
  doka: number;
  xp: number;
  level: number;
};

function toNat(n: number | undefined, fallback: number): number {
  const value = Math.floor(Number(n));
  return Number.isFinite(value) ? value : fallback;
}

function readWalletNumber(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function spendFromUiBalance(uiDoka: number, nextDoka: number): number {
  return Math.max(0, toNat(uiDoka, 0) - toNat(nextDoka, 0));
}

export function applySpendToCommitted(
  committedDoka: number,
  spend: number,
): number {
  return Math.max(0, toNat(committedDoka, 0) - Math.max(0, toNat(spend, 0)));
}

/**
 * saveBattleStats writes an absolute snapshot. Credits belong on
 * applyRewards / claim / shop-complete / upgrade. An absolute write must
 * never raise the canister wallet, XP, or level — that is how a stale
 * optimistic UI (failed applyRewards, ghost HUD) minted permanent progress.
 */
export function clampAbsoluteProgressWrite(
  proposed: number,
  current: number,
): number {
  const next = Math.max(0, toNat(proposed, 0));
  const live = Math.max(0, toNat(current, 0));
  return next > live ? live : next;
}

/**
 * processPendingPurchases writes an absolute wallet. Commit that balance so a
 * later saveBattleStats spend cannot reconstruct from a pre-credit snapshot.
 */
export function shouldPersistAbsoluteDokaSpend(spend: number): boolean {
  return Math.max(0, toNat(spend, 0)) > 0;
}

/** Never mint Doka through saveBattleStats. */

/** Alias: never-raise clamp for Doka absolute writes (same as clampAbsoluteProgressWrite). */
export function clampAbsoluteDokaWrite(
  committedDoka: number,
  requestedDoka: number,
): number {
  return clampAbsoluteProgressWrite(requestedDoka, committedDoka);
}

/** Alias: never-raise clamp for XP absolute writes (same as clampAbsoluteProgressWrite). */
export function clampAbsoluteXpWrite(
  committedXp: number,
  requestedXp: number,
): number {
  return clampAbsoluteProgressWrite(requestedXp, committedXp);
}

export function committedDokaAfterShopCredit(
  credited: number | null,
): number | null {
  if (credited == null) return null;
  return Math.max(0, toNat(credited, 0));
}

/**
 * Add the credited delta onto the live UI wallet. Replacing with the absolute
 * backend read would overwrite a heal/shop spend the player already applied
 * locally while this credit was waiting on the persist queue.
 */
export function applyShopCreditDeltaToUi(
  uiDoka: number,
  gained: number,
): number {
  return Math.max(0, toNat(uiDoka, 0) + Math.max(0, toNat(gained, 0)));
}

/**
 * Idle hydrate copies UI onto committed. applyRewards can bump
 * committed.level while shouldApplyVictoryLiveHydrate skips the live UI
 * update (lava/spike death mid-persist). Copying the stale UI level then
 * lets the next saveBattleStats downgrade the canister. Never write a
 * lower level than the lock already committed.
 */
export function floorHydratedLevel(
  committedLevel: number,
  uiLevel: number,
): number {
  return Math.max(1, toNat(committedLevel, 1), toNat(uiLevel, 1));
}

/**
 * Level-up resets leftover XP onto a new threshold. applyRewards can commit
 * `{ xp: 30, level: 5 }` while lava death skips the live UI hydrate, so the
 * hydrate effect still sees the old-level leftover (e.g. 80). Copying that
 * leftover over the post-level snapshot lets the next saveBattleStats refund
 * the death XP penalty.
 */
export function resolveHydratedXp(
  committedXp: number,
  committedLevel: number,
  uiXp: number,
  uiLevel: number,
): number {
  const committedLvl = Math.max(1, toNat(committedLevel, 1));
  const incomingLvl = Math.max(1, toNat(uiLevel, 1));
  if (committedLvl > incomingLvl) {
    return Math.max(0, toNat(committedXp, 0));
  }
  if (incomingLvl > committedLvl) {
    return Math.max(0, toNat(uiXp, 0));
  }
  // Same level: the lock is authoritative. Copying a higher ghost HUD
  // minted unpaid portal XP; copying a lower stale HUD refunded a
  // just-committed applyRewards leftover.
  return Math.max(0, toNat(committedXp, 0));
}

export type HydrateWhenIdleOptions = {
  /**
   * True once the session cache has been set from getCallerDokaBalance
   * (including a real 0). The query resolving is not enough: GameFlow's
   * dokaBalance state stays 0 for one render, and copying that placeholder
   * over a shop-credit seed lets a lava-death saveBattleStats write 0.
   */
  walletReady?: boolean;
};

/**
 * Idle hydrate must not treat GameFlow's pre-query 0 as the canister wallet.
 *
 * `walletReady` is only safe after setDokaBalance(query) — not merely when
 * the React Query data exists. A positive UI value can also be a feat-claim
 * or rename delta stacked on the placeholder; that must not seed.
 *
 * Once the lock is seeded, idle UI must not change the committed wallet.
 * A ghost HUD (failed applyRewards still credited locally, or a stale
 * high query) used to copy incoming >= committed and let the next
 * saveBattleStats mint. Credits and spends already commit on the lock.
 *
 * An unseeded GameKey / feat `#ok` must not be followed by an idle copy of
 * the in-flight getCallerDokaBalance snapshot. That query is the pre-credit
 * wallet; seeding from it marks the lock ready so the next saveBattleStats
 * skips resolveCommittedDokaForAbsoluteWrite and wipes the paid grant.
 */
export function shouldCopyIdleWalletDoka(args: {
  walletSeeded: boolean;
  walletReady?: boolean;
  incomingDoka: number;
  committedDoka: number;
  idleWalletSeedBlocked?: boolean;
}): boolean {
  if (args.walletSeeded) return false;
  if (args.idleWalletSeedBlocked === true) return false;
  return args.walletReady === true;
}

/**
 * Thrown when saveBattleStats would write a seeded pre-credit snapshot
 * after a one-shot applyRewards transport-keep whose confirm was stale.
 */
export const ABSOLUTE_WRITE_UNCONFIRMED_CREDIT =
  "absolute write skipped: unconfirmed credit";

/**
 * Thrown when saveBattleStats would write a pre-credit leftover after an
 * applyRewards transport-keep whose character confirm was stale.
 */
export const ABSOLUTE_WRITE_UNCONFIRMED_XP =
  "absolute write skipped: unconfirmed xp credit";

/**
 * Seeded one-shot transport-keep left the lock at the pre-credit wallet
 * when getCallerDokaBalance was stale or threw. Recap heal then
 * saveBattleStats-wrote that snapshot and wiped the canister grant
 * (incoming-below-stored is applied; saveBattleStats never mints).
 *
 * Skip the absolute write unless the live read is strictly above the
 * lock. A miss must not use the stale committed value.
 */
export function shouldSkipAbsoluteDokaWrite(args: {
  unconfirmedWalletCredit: boolean;
  liveDoka: number | null;
  committedDoka: number;
}): boolean {
  if (args.unconfirmedWalletCredit !== true) return false;
  if (args.liveDoka == null) return true;
  const live = Math.max(0, Math.floor(Number(args.liveDoka) || 0));
  const committed = Math.max(0, Math.floor(Number(args.committedDoka) || 0));
  return live <= committed;
}

/**
 * Portal +10 / victory applyRewards can land on the canister then throw.
 * Leftover XP may *drop* across a level-up (95 + 10 → leftover 5), so a
 * live-xp-not-higher test would miss the grant and let the next
 * saveBattleStats write the pre-level leftover.
 *
 * Credit landed when level rose, or leftover rose at the same level.
 */
export function shouldSkipAbsoluteXpWrite(args: {
  unconfirmedXpCredit: boolean;
  liveXp: number | null;
  liveLevel: number | null;
  committedXp: number;
  committedLevel: number;
}): boolean {
  if (args.unconfirmedXpCredit !== true) return false;
  if (args.liveXp == null || args.liveLevel == null) return true;
  const liveXp = Math.max(0, Math.floor(Number(args.liveXp) || 0));
  const liveLevel = Math.max(1, Math.floor(Number(args.liveLevel) || 1));
  const committedXp = Math.max(0, Math.floor(Number(args.committedXp) || 0));
  const committedLevel = Math.max(
    1,
    Math.floor(Number(args.committedLevel) || 1),
  );
  if (liveLevel > committedLevel) return false;
  if (liveLevel === committedLevel && liveXp > committedXp) return false;
  return true;
}

/** Parse `getCharacter` leftover XP + level for unconfirmed applyRewards. */
export function readCharacterProgress(
  raw: unknown,
): { xp: number; level: number } | null {
  if (raw == null || typeof raw !== "object") return null;
  const rec = raw as { experience?: unknown; level?: unknown };
  const xp = Number(rec.experience);
  const level = Number(rec.level);
  if (!Number.isFinite(xp) || !Number.isFinite(level)) return null;
  return {
    xp: Math.max(0, Math.floor(xp)),
    level: Math.max(1, Math.floor(level)),
  };
}

export type ProgressPersistEnqueueOptions = {
  /**
   * Death persist writes the pending marker then the 20/40 cut. Running
   * beforeEach (flush of that same marker) first would persist after, then
   * computeDeathPenalty on the already-cut lock — a second 20/40.
   */
  skipBeforeEach?: boolean;
};

export type ProgressPersistOptions = {
  /**
   * Runs at the head of every enqueue except skipBeforeEach. Used to flush
   * an unpaid death penalty before heal / shop / applyRewards / upgrade
   * can persist the unpenalized snapshot.
   */
  beforeEach?: () => Promise<void>;
};

export function createProgressPersist(
  initial?: Partial<CommittedProgress>,
  options?: ProgressPersistOptions,
) {
  let committed: CommittedProgress = {
    doka: Math.max(0, toNat(initial?.doka, 0)),
    xp: Math.max(0, toNat(initial?.xp, 0)),
    level: Math.max(1, toNat(initial?.level, 1)),
  };
  // A positive constructor seed came from GameFlow after the query landed.
  // 0 is ambiguous (new wallet vs query still in flight).
  let walletSeeded = initial?.doka != null && toNat(initial.doka, 0) > 0;
  // Set when a credit landed on an unseeded placeholder. Idle hydrate must
  // not copy the pre-credit query or death/heal will persist that snapshot.
  let idleWalletSeedBlocked = false;
  // Seeded one-shot transport-keep: canister may have the grant, confirm
  // did not see a rise. Absolute writes must re-fetch and skip if stale.
  let unconfirmedWalletCredit = false;
  // Portal +10 / victory applyRewards transport-keep: leftover/level may
  // have landed. Idle hydrate must not clear this by re-committing the
  // stale UI leftover; absolute writes must re-fetch getCharacter.
  let unconfirmedXpCredit = false;
  let pending = 0;
  let chain: Promise<void> = Promise.resolve();
  let beforeEach = options?.beforeEach;

  const persist = {
    snapshot(): CommittedProgress {
      return { ...committed };
    },
    pendingCount(): number {
      return pending;
    },
    isWalletSeeded(): boolean {
      return walletSeeded;
    },
    seedWallet(doka: number) {
      persist.commit({ doka: Math.max(0, toNat(doka, 0)) });
    },
    /**
     * redeemGameKey / claimAchievementReward `#ok` on an unseeded lock must
     * not seed at grant-only, but the next walletReady hydrate used to copy
     * the stale pre-credit query and mark the lock seeded. Death/heal then
     * skipped the live fetch and saveBattleStats-wiped the paid grant.
     */
    noteUnseededCredit() {
      if (!walletSeeded) idleWalletSeedBlocked = true;
    },
    /**
     * One-shot applyRewards invoked but the confirm did not see a rise.
     * Block idle seed (unseeded placeholder) and force the next absolute
     * write to re-fetch. A stale snapshot must not wipe the grant.
     */
    noteUnconfirmedCredit() {
      idleWalletSeedBlocked = true;
      if (walletSeeded) unconfirmedWalletCredit = true;
    },
    hasUnconfirmedWalletCredit() {
      return unconfirmedWalletCredit;
    },
    /**
     * persistIncrementalRewards invoked but the ok payload was lost.
     * Force the next saveBattleStats to re-fetch leftover XP/level.
     */
    noteUnconfirmedXpCredit() {
      unconfirmedXpCredit = true;
    },
    hasUnconfirmedXpCredit() {
      return unconfirmedXpCredit;
    },
    commit(next: Partial<CommittedProgress>) {
      committed = {
        doka:
          next.doka != null
            ? Math.max(0, toNat(next.doka, committed.doka))
            : committed.doka,
        xp:
          next.xp != null
            ? Math.max(0, toNat(next.xp, committed.xp))
            : committed.xp,
        level:
          next.level != null
            ? Math.max(1, toNat(next.level, committed.level))
            : committed.level,
      };
      if (next.doka != null) {
        walletSeeded = true;
        idleWalletSeedBlocked = false;
        unconfirmedWalletCredit = false;
      }
      if (next.xp != null) {
        unconfirmedXpCredit = false;
      }
    },
    hydrateWhenIdle(
      next: CommittedProgress,
      options?: HydrateWhenIdleOptions,
    ): boolean {
      if (pending > 0) return false;
      const copyDoka = shouldCopyIdleWalletDoka({
        walletSeeded,
        walletReady: options?.walletReady,
        incomingDoka: next.doka,
        committedDoka: committed.doka,
        idleWalletSeedBlocked,
      });
      // A dokaBalance-only idle pass must not re-commit the stale leftover
      // and clear unconfirmedXpCredit — that re-opens the wipe.
      persist.commit({
        doka: copyDoka ? next.doka : undefined,
        xp: unconfirmedXpCredit
          ? undefined
          : resolveHydratedXp(
              committed.xp,
              committed.level,
              next.xp,
              next.level,
            ),
        level: unconfirmedXpCredit
          ? undefined
          : floorHydratedLevel(committed.level, next.level),
      });
      return true;
    },
    setBeforeEach(fn: (() => Promise<void>) | undefined) {
      beforeEach = fn;
    },
    enqueue<T>(
      fn: () => Promise<T>,
      enqueueOptions?: ProgressPersistEnqueueOptions,
    ): Promise<T> {
      pending += 1;
      const runJob = async () => {
        if (!enqueueOptions?.skipBeforeEach && beforeEach) {
          await beforeEach();
        }
        return fn();
      };
      const run = chain.then(runJob, runJob);
      chain = run.then(
        () => {
          pending -= 1;
        },
        () => {
          pending -= 1;
        },
      );
      return run;
    },
  };

  return persist;
}

export type ProgressPersist = ReturnType<typeof createProgressPersist>;

export type AbsoluteWritePersist = Pick<
  ProgressPersist,
  "isWalletSeeded" | "seedWallet" | "snapshot"
> & {
  hasUnconfirmedWalletCredit?: () => boolean;
  hasUnconfirmedXpCredit?: () => boolean;
  commit?: (next: Partial<CommittedProgress>) => void;
};

/**
 * saveBattleStats writes an absolute wallet. The persist lock starts at 0
 * whenever WorldExploration mounts before getCallerDokaBalance resolves.
 * hydrateWhenIdle then copies that placeholder. A lava/combat death on the
 * first map penalizes committed.doka=0 and persists 0 — wiping the canister.
 *
 * Fetch the live wallet when the lock was never seeded from an authoritative
 * read/credit. Return null if the read fails so the caller can skip the
 * absolute write instead of persisting the placeholder.
 *
 * After a seeded one-shot transport-keep, re-fetch even when seeded. A
 * stale or missing live read must not return the pre-credit snapshot.
 */
export async function resolveCommittedDokaForAbsoluteWrite(
  persist: AbsoluteWritePersist,
  readWallet: () => Promise<unknown>,
): Promise<number | null> {
  const unconfirmed = persist.hasUnconfirmedWalletCredit?.() === true;
  if (persist.isWalletSeeded() && !unconfirmed) {
    return persist.snapshot().doka;
  }
  const skipStale = (live: number | null): boolean =>
    shouldSkipAbsoluteDokaWrite({
      unconfirmedWalletCredit: unconfirmed,
      liveDoka: live,
      committedDoka: persist.snapshot().doka,
    });
  const refuseStaleWrite = (): never => {
    throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
  };
  try {
    const live = readWalletNumber(await readWallet());
    if (skipStale(live)) {
      if (persist.isWalletSeeded()) refuseStaleWrite();
      return null;
    }
    if (live == null) return null;
    persist.seedWallet(live);
    return live;
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
    ) {
      throw err;
    }
    if (unconfirmed && persist.isWalletSeeded()) refuseStaleWrite();
    return null;
  }
}

/**
 * saveBattleStats writes leftover XP absolutely. Portal +10 / victory
 * applyRewards can land then throw, leaving the lock at the pre-credit
 * leftover. A later heal/death used to persist that leftover and wipe
 * the grant (incoming-below-stored is applied).
 *
 * Re-fetch getCharacter while unconfirmed. Skip when live leftover/level
 * did not advance. A miss must not use the stale committed leftover.
 */
export async function resolveCommittedXpForAbsoluteWrite(
  persist: AbsoluteWritePersist,
  readCharacter: () => Promise<unknown>,
): Promise<{ xp: number; level: number } | null> {
  const unconfirmed = persist.hasUnconfirmedXpCredit?.() === true;
  if (!unconfirmed) {
    const snap = persist.snapshot();
    return { xp: snap.xp, level: snap.level };
  }
  const skipStale = (live: { xp: number; level: number } | null): boolean =>
    shouldSkipAbsoluteXpWrite({
      unconfirmedXpCredit: true,
      liveXp: live?.xp ?? null,
      liveLevel: live?.level ?? null,
      committedXp: persist.snapshot().xp,
      committedLevel: persist.snapshot().level,
    });
  const refuseStaleWrite = (): never => {
    throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_XP);
  };
  try {
    const live = readCharacterProgress(await readCharacter());
    if (skipStale(live)) refuseStaleWrite();
    if (live == null) return null;
    persist.commit?.({ xp: live.xp, level: live.level });
    return live;
  } catch (err) {
    if (err instanceof Error && err.message === ABSOLUTE_WRITE_UNCONFIRMED_XP) {
      throw err;
    }
    return refuseStaleWrite();
  }
}

/**
 * After applyRewards transport-keep, confirm leftover/level rose without
 * releasing a retry. Null means keep unconfirmed — do not remint and do
 * not saveBattleStats the pre-credit leftover.
 */
export async function confirmKeptIncrementalXp(
  committed: { xp: number; level: number },
  readCharacter: () => Promise<unknown>,
): Promise<{ xp: number; level: number } | null> {
  try {
    const live = readCharacterProgress(await readCharacter());
    if (
      live == null ||
      shouldSkipAbsoluteXpWrite({
        unconfirmedXpCredit: true,
        liveXp: live.xp,
        liveLevel: live.level,
        committedXp: committed.xp,
        committedLevel: committed.level,
      })
    ) {
      return null;
    }
    return live;
  } catch {
    return null;
  }
}

/** Live wallet rose after an applyRewards transport-keep. */
export async function confirmKeptIncrementalDoka(
  committedDoka: number,
  readWallet: () => Promise<unknown>,
): Promise<number | null> {
  try {
    const live = readWalletNumber(await readWallet());
    if (live == null) return null;
    const committed = Math.max(0, Math.floor(Number(committedDoka) || 0));
    if (live <= committed) return null;
    return live;
  } catch {
    return null;
  }
}
