/**
 * Doka spends that stay live during the Death Realm wait.
 *
 * persistDeathPenalty restores respawn HP in the same death tick, then waits
 * 1.5s (exploration) / 300ms (in-battle lava). Portals and encounters already
 * use isDeathRealmTransitionPending. Heal is #576; Items buy is #595. Recap
 * overlay is pointer-events: none, so HUD Rename and Spellbook Upgrade stay
 * clickable. Those writes (renameCharacter −100, upgradeSpell canister debit
 * + level) land after the 20/40 snapshot and survive reload.
 *
 * WorldExploration gates both handlers with isDeathRealmTransitionPending
 * (already imported from deathGuards). These helpers lock the same rule
 * without restacking renameCharacter.ts / spellUpgrade.ts (#387),
 * deathGuards.ts (#554), or itemShop.ts (#576/#595).
 */

import { shouldStartRename } from "./renameCharacter.ts";

/** False while the Death Realm timer is pending after HP restore. */
export function shouldAllowProgressSpendDuringDeathRealm(
  deathRealmPending: boolean | undefined,
): boolean {
  return deathRealmPending !== true;
}

/**
 * Spellbook Upgrade during the wait writes a paid level after the death
 * snapshot. The canister debit and level survive Death Realm load / reload.
 */
export function shouldStartSpellUpgrade(args: {
  inFlight: boolean;
  liveDoka: number;
  cost: number;
  deathRealmPending?: boolean;
}): boolean {
  if (!shouldAllowProgressSpendDuringDeathRealm(args.deathRealmPending)) {
    return false;
  }
  if (args.inFlight) return false;
  const doka = Math.max(0, Math.floor(Number(args.liveDoka) || 0));
  const cost = Math.max(0, Math.floor(Number(args.cost) || 0));
  return cost > 0 && doka >= cost;
}

/**
 * Confirm Rename during the wait writes −100 Doka + the new name after the
 * death snapshot. Wraps shouldStartRename so renameCharacter.ts stays #387.
 */
export function shouldStartRenameDuringDeathRealm(args: {
  inFlight: boolean;
  liveDoka: number;
  deathRealmPending?: boolean;
}): boolean {
  if (!shouldAllowProgressSpendDuringDeathRealm(args.deathRealmPending)) {
    return false;
  }
  return shouldStartRename(args.inFlight, args.liveDoka);
}
