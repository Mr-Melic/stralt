/**
 * Armed-once latch for owner Confirm dialogs. The confirm button has no
 * local disable; Shop grant/ban use shopBusy and GameKey writers use
 * gameKeyBusy. Remaining AdminDashboard ConfirmDialog deletes still
 * need this after #539 (Escape) lands — do not edit ConfirmDialog here.
 */

export type ConfirmOnceLock = { taken: boolean };

export function createConfirmOnceLock(): ConfirmOnceLock {
  return { taken: false };
}

export function tryBeginConfirmOnce(lock: ConfirmOnceLock): boolean {
  if (lock.taken) return false;
  lock.taken = true;
  return true;
}

export function shouldBlockConfirmOnce(
  lock: ConfirmOnceLock | null | undefined,
): boolean {
  return lock?.taken === true;
}

export function confirmOnceButtonLabel(armed: boolean, idle: string): string {
  return armed ? "Working…" : idle;
}
