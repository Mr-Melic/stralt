/**
 * Battle-bar empty spell slot hover. Display only.
 *
 * Spellbook empty slots already say “click a spell below to add”.
 * BattleUIPanel empty slots only print “Empty slot N” — they never name
 * Book as the place that fills them.
 *
 * This helper is locked, not wired — BattleUIPanel is owned by older
 * open PRs (#335 / #340). Do not change slot persistence or upgradeSpell
 * when wiring.
 */

export function emptyBattleSlotTitle(slotIndex: number): string {
  const n = Math.trunc(slotIndex) + 1;
  const label = Number.isFinite(n) && n > 0 ? n : 1;
  return `Empty slot ${label} — open Book to equip`;
}
