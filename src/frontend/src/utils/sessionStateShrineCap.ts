/**
 * Session shrineCount silent max (SDEG-2026-10-28-003).
 *
 * `updateSessionState` (`main.mo` 3120–3143) rejects `shrineCount > 100`
 * (and `bloodBalance > 100`). Official UI never calls that method
 * (10-22-009: getSessionState still fabricates blood=50 for null).
 * Live shrine visits write unbounded `pbv_shrine_count_${userId}_slotN`
 * (`WorldExploration.tsx` 11347 — cite only; do not edit).
 *
 * Unbounded progression: Motoko Nat on Character.shrineCount has no
 * stored max, but the unused write API silently assumes 100. Wiring
 * that API as the persist SoT for a shrine feat (10-25-004) would
 * `#err` every session write for a six-month player past 100 visits.
 * A player created before the optional field existed still has null;
 * getSessionState would report 0 shrine / 50 blood, not the local
 * counter.
 *
 * Distinct from 10-22-009 (blood default 50) and 10-25-004 (write-only
 * inherit / version-gate). Grandfather stored counts; do not reject
 * official totals. Do not add a required shrine field until a later
 * chain file after 20260901.
 */

export const HEAD_UPDATE_SESSION_SHRINE_CAP = 100;
export const HEAD_UPDATE_SESSION_BLOOD_CAP = 100;

export function officialUiCallsUpdateSessionState(): boolean {
  return false;
}

export function localShrineCounterIsUnbounded(): boolean {
  return true;
}

/** HEAD write-path: counts above 100 are rejected, not grandfathered. */
export function headRejectsShrineCountAboveCap(shrineCount: number): boolean {
  return shrineCount > HEAD_UPDATE_SESSION_SHRINE_CAP;
}

/**
 * Recommended persist policy: never freeze a six-month farmer. Cap is
 * anti-mint for raw clients only if the method is wired; official
 * totals must persist in full (same class as applyRewards ceilings).
 */
export function shouldRejectOfficialShrineCountWrite(
  shrineCount: number,
): boolean {
  void shrineCount;
  return false;
}

export function silentShrineCapWouldFreezeOldSaves(): boolean {
  return true;
}
