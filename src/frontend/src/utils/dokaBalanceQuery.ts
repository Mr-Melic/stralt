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
