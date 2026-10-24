/**
 * Summon spell upgrade cost explainers.
 * Display only — SpellbookModal lists 10×; upgradeSpell charges the usual
 * rank-up (`spellUpgradeCanisterSpend`). Not wired into SpellbookModal yet.
 *
 * Gate fix (canAfford on the wallet debit, not the 10× list) is
 * UX-SUMMON-UPGRADE-COST-GATE (HUMAN). Distinct from #372 UX-SUMMON-UPGRADE-TAX,
 * which named the 10× as if it were the real charge.
 */

import { spellUpgradeCanisterSpend } from "./spellUpgrade.ts";

/** Shown under the summon Upgrade expand when the listed cost is 10×. */
export const SUMMON_UPGRADE_COST_NOTE =
  "This card lists 10× the usual rank-up. The Doka that leaves your wallet is the usual price.";

export function summonUpgradeCostHint(advertisedCost: number): string {
  const advertised = Math.max(0, Math.floor(Number(advertisedCost) || 0));
  const charged = spellUpgradeCanisterSpend(advertised);
  if (advertised <= 0 || charged === advertised) {
    return `Upgrade costs ${advertised.toLocaleString()} Doka.`;
  }
  return `Listed ${advertised.toLocaleString()} Doka · wallet pays ${charged.toLocaleString()} Doka.`;
}

/** Affordability for UI gating — prefer the wallet debit, not the 10× list. */
export function canAffordSummonUpgradeUi(
  dokaBalance: number,
  advertisedCost: number,
): boolean {
  const bal = Math.max(0, Math.floor(Number(dokaBalance) || 0));
  const need = spellUpgradeCanisterSpend(advertisedCost);
  return bal >= need;
}
