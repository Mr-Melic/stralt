/**
 * Client mirror of AdminGuard.spellAxisFlagsRejected.
 * Backend enforcement is authoritative; this proves the failure path.
 *
 * Failure: Admin Linear + Diagonal checkboxes are independent.
 * isTileCastableLive requires a cardinal axis AND |dx|===|dy|, so only
 * (0,0) survives. Damage rows default minRange>=1, so adminSetSpellConfig
 * used to replace a valid catalog row with an uncastable spell. Spells
 * have no last-good rollback.
 */

export function spellAxisFlagsRejected(args: {
  linear: boolean;
  diagonal: boolean;
}): string | null {
  if (args.linear && args.diagonal) {
    return "linear and diagonal cannot both be set";
  }
  return null;
}
