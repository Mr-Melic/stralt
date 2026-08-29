/**
 * Normalize getCallerDokaBalance payloads. A missing value is a real 0
 * (new principal). Non-numeric payloads throw so React Query keeps the last
 * successful balance instead of treating the failure as "wallet is empty".
 */
export function normalizeCallerDokaBalance(raw: unknown): number {
  if (raw === null || raw === undefined) return 0;
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    throw new Error("getCallerDokaBalance returned a non-numeric value");
  }
  return n;
}

/**
 * GameFlow hydrates the session wallet from getCallerDokaBalance. After
 * WorldExploration owns that cache, a refetch (claim invalidate, window
 * focus) can restore a pre-spend snapshot. hydrateWhenIdle then copies
 * the refund into committed.doka and the next persist writes it back.
 *
 * Apply the query only before the world session is hydrated — or whenever
 * the world is not mounted (character select still needs rename spends).
 */
export function shouldApplyCallerDokaHydrate(args: {
  backendDoka: number | undefined;
  inWorld: boolean;
  alreadyHydratedInWorld: boolean;
}): boolean {
  if (args.backendDoka === undefined) return false;
  if (args.inWorld && args.alreadyHydratedInWorld) return false;
  return true;
}

/**
 * WorldExploration's idle hydrate treats walletReady as "the session cache
 * is the canister wallet, including a real 0".
 *
 * `queryResolved` alone is one render too early: GameFlow still holds the
 * placeholder 0 until the hydrate effect calls setDokaBalance. Passing that
 * pair lets hydrateWhenIdle overwrite a shop-credit seed with 0.
 */
export function shouldMarkCallerDokaWalletReady(args: {
  queryResolved: boolean;
  sessionCacheApplied: boolean;
}): boolean {
  return args.queryResolved && args.sessionCacheApplied;
}
