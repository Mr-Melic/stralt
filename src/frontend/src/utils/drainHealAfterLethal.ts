/**
 * Same-cast Life Drain after lethal Void Mirror / Reflect Shield.
 *
 * applyDamageToEnemy order on a killing-blow drain:
 *   1. Reflect writes player HP (Void Mirror 25% of pre-crit, Reflect Shield
 *      30% of final) through setCharacterStats — no death linchpin.
 *   2. processCombatantDeath / recheckVictory. Persist waits for the
 *      [inBattle, enemies] victory-gate effect.
 *   3. Drain heals `round(finalDmg * drainPercent)` onto the same setter.
 *
 * If step 1 left HP at 0, step 3 resurrects before paint. The HP-watch
 * effect then sees hp > 0 and skips _handlePlayerDeath, so
 * shouldAwardVictory({ deathTriggered: false }) still awards applyRewards.
 *
 * Ratios and the snapshot heal cap (`maxHp - pre-hit hp`) stay unchanged.
 * Only skip the heal when this cast already reduced the player to 0.
 * Distinct from hitsAllies self-AoE tally / lethal victory (player is
 * appended after enemies, so drain on targetsToHit[0] runs while alive).
 */

export const LIFE_DRAIN_PERCENT = 0.5;
export const VOID_MIRROR_REFLECT_RATIO = 0.25;
export const REFLECT_SHIELD_RATIO = 0.3;

export function voidMirrorReflectAmount(preCritDmgBM: number): number {
  const dmg = Number(preCritDmgBM);
  if (!Number.isFinite(dmg) || dmg <= 0) return 0;
  return Math.floor(dmg * VOID_MIRROR_REFLECT_RATIO);
}

export function reflectShieldAmount(finalDmg: number): number {
  const dmg = Number(finalDmg);
  if (!Number.isFinite(dmg) || dmg <= 0) return 0;
  return Math.floor(dmg * REFLECT_SHIELD_RATIO);
}

export function playerHpAfterIncoming(
  currentHp: number,
  incoming: number,
): number {
  const hp = Math.max(0, Math.floor(Number(currentHp) || 0));
  const dmg = Math.max(0, Math.floor(Number(incoming) || 0));
  return Math.max(0, hp - dmg);
}

/** Live Life Drain percent when the spell omits drainPercent. */
export function drainHealAmount(
  finalDmg: number,
  drainPercent: number = LIFE_DRAIN_PERCENT,
): number {
  const dmg = Number(finalDmg);
  const pct = Number(drainPercent);
  if (!Number.isFinite(dmg) || dmg <= 0 || !Number.isFinite(pct) || pct <= 0) {
    return 0;
  }
  return Math.round(dmg * pct);
}

/**
 * Snapshot cap used by applyDamageToEnemy: room is `maxHp - pre-hit hp`,
 * not the post-reflect missing HP. Keep this so non-lethal reflect heals
 * the same amount as today.
 */
export function cappedDrainHealAmount(
  maxHp: number,
  snapshotHp: number,
  finalDmg: number,
  drainPercent: number = LIFE_DRAIN_PERCENT,
): number {
  const max = Math.max(0, Math.floor(Number(maxHp) || 0));
  const snap = Math.max(0, Math.floor(Number(snapshotHp) || 0));
  const room = Math.max(0, max - snap);
  return Math.min(room, drainHealAmount(finalDmg, drainPercent));
}

/** False when this cast already reduced the player to 0 HP. */
export function shouldApplyDrainHeal(playerHpAfterSameCast: number): boolean {
  return Math.max(0, Math.floor(Number(playerHpAfterSameCast) || 0)) > 0;
}

/**
 * What HP would be after applying drain. Documents the resurrection
 * divergence: lethal 0 + healAmt > 0 writes a living HP.
 */
export function playerHpAfterDrainHeal(
  playerHpAfterSameCast: number,
  healAmt: number,
  maxHp: number,
): number {
  const hp = Math.max(0, Math.floor(Number(playerHpAfterSameCast) || 0));
  const heal = Math.max(0, Math.floor(Number(healAmt) || 0));
  const max = Math.max(0, Math.floor(Number(maxHp) || 0));
  return Math.min(max, hp + heal);
}
