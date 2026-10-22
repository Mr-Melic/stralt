/**
 * hitsAllies `__player__` sentinel damage never enters playerTakesDamage.
 * applyDamageToEnemy deducts HP via setCharacterStats only. Void Mirror /
 * Reflect Shield already debit Untouchable via onPlayerReflectedDamage;
 * the hitsAllies branch does not, so a self-AoE can still persist
 * legendary_1 (500 Doka / 1000 XP) and under-N-damage rewards.
 *
 * Wire in applyDamageToEnemy's `__player__` branch:
 *   const challengeDmg = hitsAlliesPlayerDamageForChallenge(finalDmg);
 *   if (challengeDmg > 0) onPlayerReflectedDamage(challengeDmg);
 *
 * Not applied in WorldExploration / castHelpers here — those files conflict
 * with the oldest-first open-PR queue.
 */

export function hitsAlliesPlayerDamageForChallenge(finalDmg: number): number {
  return Math.max(0, Math.floor(Number(finalDmg) || 0));
}

export function shouldDebitHitsAlliesChallengeDamage(
  finalDmg: number,
): boolean {
  return hitsAlliesPlayerDamageForChallenge(finalDmg) > 0;
}
