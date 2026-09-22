/**
 * Life Drain's missing-HP cap.
 *
 * `applyDamageToEnemy` uses `maxHp - characterStats.hp`. That snapshot is
 * captured when `playerSpellContext` last recreated (enemyHpMap / other
 * deps — not HP). After an enemy hit the closure can still be battle-start
 * full HP, so `min(0, drain)` restored 0 and the advertised "gain 5 HP"
 * never landed on the first drain of the fight.
 *
 * WorldExploration must pass {@link livePlayerHpForDrainCap} as
 * `characterStats.hp` into `applyDamageToEnemy` so the existing cap sees
 * live HP. Do not edit `castHelpers.ts` for this — older open PRs already
 * restack that file.
 */

export function livePlayerHpForDrainCap(liveHp: number): number {
  return Math.max(0, Math.floor(Number(liveHp) || 0));
}

export function cappedDrainHeal(opts: {
  maxHp: number;
  currentHp: number;
  finalDmg: number;
  drainPercent?: number;
}): number {
  const maxHp = Math.max(0, Math.floor(Number(opts.maxHp) || 0));
  const currentHp = livePlayerHpForDrainCap(opts.currentHp);
  const missing = Math.max(0, maxHp - currentHp);
  const pct =
    Number.isFinite(Number(opts.drainPercent)) && Number(opts.drainPercent) > 0
      ? Number(opts.drainPercent)
      : 0.5;
  const raw = Math.round(Math.max(0, Number(opts.finalDmg) || 0) * pct);
  return Math.min(missing, raw);
}
