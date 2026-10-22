/**
 * Level-up, palette, tiers, game config, Boss Rush, and ads fire actor
 * writes without a sync lock. A second click republishes live JSON.
 * Distinct from Shop grant/ban (`shopBusy` #631) and GameKey (`gameKeyBusy`
 * #664).
 *
 * Unique 2026-10-22 file — do not merge into those locks.
 */

export type OwnerConfigWriter =
  | "levelUp"
  | "palette"
  | "tiers"
  | "gameConfig"
  | "bossRush"
  | "ads";

export type OwnerConfigWriterLock = { current: OwnerConfigWriter | null };

export function createOwnerConfigWriterLock(): OwnerConfigWriterLock {
  return { current: null };
}

export function shouldBlockOwnerConfigWriter(
  lock: OwnerConfigWriterLock | null | undefined,
): boolean {
  return (lock?.current ?? null) !== null;
}

export function tryBeginOwnerConfigWriter(
  lock: OwnerConfigWriterLock,
  next: OwnerConfigWriter,
): boolean {
  if (lock.current !== null) return false;
  lock.current = next;
  return true;
}

export function endOwnerConfigWriter(lock: OwnerConfigWriterLock): void {
  lock.current = null;
}

export function ownerConfigWriterBusyLabel(op: OwnerConfigWriter): string {
  if (op === "ads") return "Saving…";
  return "Publishing…";
}

export function ownerConfigWriterControlLabel(args: {
  op: OwnerConfigWriter;
  lock: OwnerConfigWriterLock | null | undefined;
  idle: string;
}): string {
  if (args.lock?.current === args.op)
    return ownerConfigWriterBusyLabel(args.op);
  return args.idle;
}
