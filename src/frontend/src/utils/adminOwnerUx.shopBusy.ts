/**
 * Shop grant / ban / unban write live Doka and ban flags with no undo.
 * ConfirmDialog closes before the actor returns, so a second Grant click
 * can mint twice. A sync lock must win over React state.
 */

export type ShopWalletOp = "grant" | "ban" | "unban";

export type ShopWalletLock = { current: ShopWalletOp | null };

export function createShopWalletLock(): ShopWalletLock {
  return { current: null };
}

export function shouldBlockShopWalletControls(
  lock: ShopWalletLock | null | undefined,
): boolean {
  return (lock?.current ?? null) !== null;
}

export function tryBeginShopWalletOp(
  lock: ShopWalletLock,
  next: ShopWalletOp,
): boolean {
  if (lock.current !== null) return false;
  lock.current = next;
  return true;
}

export function endShopWalletOp(lock: ShopWalletLock): void {
  lock.current = null;
}

export function shopWalletOpBusyLabel(op: ShopWalletOp): string {
  if (op === "grant") return "Granting…";
  if (op === "ban") return "Banning…";
  return "Unbanning…";
}

export function shopWalletControlLabel(args: {
  op: ShopWalletOp;
  lock: ShopWalletLock | null | undefined;
  idle: string;
}): string {
  if (args.lock?.current === args.op) return shopWalletOpBusyLabel(args.op);
  return args.idle;
}
