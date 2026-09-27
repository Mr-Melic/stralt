/**
 * GameKey approve / reject / reveal / mark-emailed write live purchase
 * state. Confirm overlays unmount then fire the actor, so a second click
 * can mint two keys or wipe the plaintext reveal twice. A sync lock must
 * win over React `busyId`. Distinct from Shop grant/ban (`shopBusy`).
 */

export type GameKeyAdminOp = "approve" | "reject" | "reveal" | "emailed";

export type GameKeyAdminLock = { current: GameKeyAdminOp | null };

export function createGameKeyAdminLock(): GameKeyAdminLock {
  return { current: null };
}

export function shouldBlockGameKeyAdminControls(
  lock: GameKeyAdminLock | null | undefined,
): boolean {
  return (lock?.current ?? null) !== null;
}

export function tryBeginGameKeyAdminOp(
  lock: GameKeyAdminLock,
  next: GameKeyAdminOp,
): boolean {
  if (lock.current !== null) return false;
  lock.current = next;
  return true;
}

export function endGameKeyAdminOp(lock: GameKeyAdminLock): void {
  lock.current = null;
}

export function gameKeyAdminOpBusyLabel(op: GameKeyAdminOp): string {
  if (op === "approve") return "Approving…";
  if (op === "reject") return "Rejecting…";
  if (op === "reveal") return "Loading…";
  return "Wiping…";
}

export function gameKeyAdminControlLabel(args: {
  op: GameKeyAdminOp;
  lock: GameKeyAdminLock | null | undefined;
  idle: string;
}): string {
  if (args.lock?.current === args.op) return gameKeyAdminOpBusyLabel(args.op);
  return args.idle;
}
