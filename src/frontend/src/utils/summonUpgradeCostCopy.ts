/**
 * Summon spell upgrade cost explainers.
 * Display only — SpellbookModal advertises 10×; canister charges base via
 * spellUpgradeCanisterSpend. Not wired into SpellbookModal yet.
 *
 * Gate fix (canAfford on canister spend) is UX-SUMMON-UPGRADE-COST-GATE (HUMAN).
 */

import { spellUpgradeCanisterSpend } from "./spellUpgrade.ts";

/** Shown under the summon Upgrade expand when the advertised cost is 10×. */
export const SUMMON_UPGRADE_COST_NOTE =
  "Summon upgrades show 10× the normal price here. Your wallet is charged the canister amount when the upgrade lands.";

export function summonUpgradeCostHint(advertisedCost: number): string {
  const advertised = Math.max(0, Math.floor(Number(advertisedCost) || 0));
  const charged = spellUpgradeCanisterSpend(advertised);
  if (advertised <= 0 || charged === advertised) {
    return `Upgrade costs ${advertised.toLocaleString()} Doka.`;
  }
  return `Listed ${advertised.toLocaleString()} Doka · charged ${charged.toLocaleString()} Doka when confirmed.`;
}

/** Affordability for UI gating — prefer canister spend, not the 10× list price. */
export function canAffordSummonUpgradeUi(
  dokaBalance: number,
  advertisedCost: number,
): boolean {
  const bal = Math.max(0, Math.floor(Number(dokaBalance) || 0));
  const need = spellUpgradeCanisterSpend(advertisedCost);
  return bal >= need;
}
