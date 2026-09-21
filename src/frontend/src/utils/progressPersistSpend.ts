/**
 * Throw-after-debit spend tracking for renameCharacter / upgradeSpell.
 *
 * Lives beside createProgressPersist so older persist PRs (#356 XP keep,
 * #375 spend-commit must not clear a credit keep, #377 GameKey/claim)
 * can merge that file without overlapping these helpers. Credit-style
 * live<=committed skip would stuck-skip a spend drop forever.
 */

export const ABSOLUTE_WRITE_UNCONFIRMED_SPEND =
  "absolute write skipped: unconfirmed spend";

const unconfirmedSpend = new WeakMap<object, boolean>();

export function noteUnconfirmedSpend(persist: object): void {
  unconfirmedSpend.set(persist, true);
}

export function hasUnconfirmedWalletSpend(persist: object): boolean {
  return unconfirmedSpend.get(persist) === true;
}

export function clearUnconfirmedWalletSpend(persist: object): void {
  unconfirmedSpend.delete(persist);
}

/**
 * Seeded rename / upgradeSpell invoked then threw. Recap shop used to
 * saveBattleStats-write the pre-spend lock (incoming-above-stored is
 * ignored) while BuffShop still granted the item — a free purchase.
 *
 * Skip unless the live read is strictly below the lock. A stale-equal
 * or missing read must not use the pre-spend snapshot.
 */
export function shouldSkipAbsoluteDokaSpendWrite(args: {
  unconfirmedWalletSpend: boolean;
  liveDoka: number | null;
  committedDoka: number;
}): boolean {
  if (args.unconfirmedWalletSpend !== true) return false;
  if (args.liveDoka == null) return true;
  const live = Math.max(0, Math.floor(Number(args.liveDoka) || 0));
  const committed = Math.max(0, Math.floor(Number(args.committedDoka) || 0));
  return live >= committed;
}

export function shouldSkipAbsoluteUnconfirmedDokaWrite(args: {
  unconfirmedWalletCredit: boolean;
  unconfirmedWalletSpend?: boolean;
  liveDoka: number | null;
  committedDoka: number;
  creditSkip: (args: {
    unconfirmedWalletCredit: boolean;
    liveDoka: number | null;
    committedDoka: number;
  }) => boolean;
}): boolean {
  const credit = args.unconfirmedWalletCredit === true;
  const spend = args.unconfirmedWalletSpend === true;
  if (!credit && !spend) {
    return args.creditSkip({
      unconfirmedWalletCredit: false,
      liveDoka: args.liveDoka,
      committedDoka: args.committedDoka,
    });
  }
  if (args.liveDoka == null) return true;
  if (credit && spend) {
    const live = Math.max(0, Math.floor(Number(args.liveDoka) || 0));
    const committed = Math.max(0, Math.floor(Number(args.committedDoka) || 0));
    return live === committed;
  }
  if (spend) {
    return shouldSkipAbsoluteDokaSpendWrite({
      unconfirmedWalletSpend: true,
      liveDoka: args.liveDoka,
      committedDoka: args.committedDoka,
    });
  }
  return args.creditSkip({
    unconfirmedWalletCredit: true,
    liveDoka: args.liveDoka,
    committedDoka: args.committedDoka,
  });
}
