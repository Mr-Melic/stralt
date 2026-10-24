/**
 * Enemy Names Add / Enter / Load Defaults fire actor writes with no
 * isPending lock. addEnemyName (main.mo) always List.add — duplicates
 * are legal. Rapid Enter inserts the same live name twice.
 *
 * Unique 2026-10-24 file — do not merge into adminOwnerUx.configWriterBusy.ts
 * (#883 system-config lock) or adminOwnerUx.shopBusy.ts (#631 grant lock).
 * Not wired into AdminDashboard (stack).
 */

export function shouldBlockOwnerNameMutate(pending: boolean): boolean {
  return pending === true;
}

export function ownerNameIsDuplicate(
  name: string,
  existing: readonly string[],
): boolean {
  const n = name.trim().toLowerCase();
  if (!n) return false;
  return existing.some((row) => row.trim().toLowerCase() === n);
}

export function shouldSubmitOwnerNameAdd(args: {
  pending: boolean;
  name: string;
  existing: readonly string[];
}): boolean {
  if (shouldBlockOwnerNameMutate(args.pending)) return false;
  const trimmed = args.name.trim();
  if (!trimmed) return false;
  return !ownerNameIsDuplicate(trimmed, args.existing);
}

export function shouldSubmitOwnerNameInit(args: {
  pending: boolean;
  poolEmpty: boolean;
}): boolean {
  return args.pending !== true && args.poolEmpty === true;
}

export function ownerNameAddControlLabel(
  pending: boolean,
  idle = "+ Add Name",
): string {
  return pending ? "Adding…" : idle;
}

export function ownerNameInitControlLabel(pending: boolean): string {
  return pending ? "Loading defaults…" : "Load Defaults";
}
