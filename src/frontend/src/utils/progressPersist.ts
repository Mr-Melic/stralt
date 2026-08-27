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

export function spendFromUiBalance(uiDoka: number, nextDoka: number): number {
  return Math.max(0, toNat(uiDoka, 0) - toNat(nextDoka, 0));
}

export function applySpendToCommitted(
  committedDoka: number,
  spend: number,
): number {
  return Math.max(0, toNat(committedDoka, 0) - Math.max(0, toNat(spend, 0)));
}

export function createProgressPersist(initial?: Partial<CommittedProgress>) {
  let committed: CommittedProgress = {
    doka: Math.max(0, toNat(initial?.doka, 0)),
    xp: Math.max(0, toNat(initial?.xp, 0)),
    level: Math.max(1, toNat(initial?.level, 1)),
  };
  let pending = 0;
  let chain: Promise<void> = Promise.resolve();

  const persist = {
    snapshot(): CommittedProgress {
      return { ...committed };
    },
    pendingCount(): number {
      return pending;
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
    },
    hydrateWhenIdle(next: CommittedProgress): boolean {
      if (pending > 0) return false;
      persist.commit(next);
      return true;
    },
    enqueue<T>(fn: () => Promise<T>): Promise<T> {
      pending += 1;
      const run = chain.then(fn, fn);
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
