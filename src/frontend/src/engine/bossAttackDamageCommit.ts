/**
 * Boss `type: "attack"` HP (`WorldExploration` ~16025).
 *
 * `useBossAI` `attackPlayer` (Countess bleed-miss, Pale Archbishop slam,
 * Final Pawn projectile, Broodmother shell, Alabaster Fortress crush,
 * Enthroned Void phase-2 strike) returns `{ type: "attack", targetId,
 * targetX, targetY, logMessage }` with either no `abilityResult` or an
 * abilityResult that only toggles shell / curse / rot state.
 * `applyShellArmor` / `applyCurseOnHit` never set `damageToPlayer`.
 * ATTACK_ALL_LINES / LIFE_DRAIN / CHAIN_LIGHTNING do.
 *
 * Live WorldExploration then:
 *   `if (res?.damageToPlayer && res.damageToPlayer > 0) { apply }`
 * so a melee with no `damageToPlayer` logs "attacks!" and deals 0 HP.
 * A 10 HP player keeps Untouchable; Countess never cuts; Final Pawn's
 * "feeble projectile" is flavor text. Kit `{ type: "spell" }` first-ids
 * still go through the kit apply (~15813) — this helper must not steal
 * that path. `type: "move"` dest is #872.
 *
 * Unique extra vs:
 * - #872 `resolveBossMoveCommit`: walks `type === "move"` `targetX/Y`.
 *   Adjacent melee must **stay put** and deal HP, not step onto the player.
 * - #498 `bossKitSpellPositionToCommit`: kit `{ type: "spell", targetX:
 *   player }` dest after the hit. Kit damage is `bossSpell.damage`, not
 *   `enemy.damage`.
 * - #888 `canExecuteBossKitRangedPrimary`: kit first-id range gate.
 *   Melee is the kit-empty / kit-on-cooldown fallback, same window as #872.
 * - #763 `wxBossAbilityCommitWithoutLanding`: taxes TELEPORT dest. Those
 *   abilities already move. This is HP when `damageToPlayer` is missing.
 * - #489 `canExecuteEnemyMelee`: regular-enemy Crush/Fire Bolt fallback
 *   (level formula + RES). Boss spawn copies `baseStats.atk` onto
 *   `enemy.damage` (WX ~6554); this helper uses that advertised number,
 *   not the Crush 12 × level/5 pool.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * bossMoveTargetCommit, or bossKitRangedPrimaryExecute.
 */

export type BossAttackActionLike = {
  type?: string | null;
  targetX?: number;
  targetY?: number;
  abilityResult?: {
    damageToPlayer?: number | null;
  } | null;
};

function finitePositive(n: unknown): number | null {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return null;
  return v;
}

/**
 * Production WX (~16025): `abilityResult.damageToPlayer` when `> 0`, else 0.
 * Drops Countess / Archbishop / Final Pawn / Broodmother melee.
 */
export function wxBossAttackCommitWithoutDamage(opts: {
  action: BossAttackActionLike;
  meleeDamage: number;
}): number {
  void opts.meleeDamage;
  return finitePositive(opts.action.abilityResult?.damageToPlayer) ?? 0;
}

/**
 * Advertised melee for `type === "attack"`. Kit spells and walks carry
 * `targetX/Y` aimed at the player — those types must not swing.
 */
export function bossAttackMeleeFromAction(
  action: BossAttackActionLike,
  meleeDamage: number,
): number | null {
  if (action.type !== "attack") return null;
  return finitePositive(meleeDamage);
}

/**
 * Raw HP the boss AI action should feed into the existing WX shield block.
 * 1. `abilityResult.damageToPlayer` when finite and `> 0` (queen rays,
 *    drain, shockwave).
 * 2. Else `type === "attack"` `enemy.damage` (Countess / Archbishop /
 *    Final Pawn / Broodmother shell).
 * 3. Else 0 (kit spell, move, skip, missing atk, Dawn `damageToPlayer: -10`).
 */
export function resolveBossAttackDamage(opts: {
  action: BossAttackActionLike;
  meleeDamage: number;
}): number {
  const fromAbility = finitePositive(opts.action.abilityResult?.damageToPlayer);
  if (fromAbility !== null) return fromAbility;
  return bossAttackMeleeFromAction(opts.action, opts.meleeDamage) ?? 0;
}

/** True when live WX would leave a `type: "attack"` swing on the floor. */
export function wxBossAttackDroppedDamage(opts: {
  action: BossAttackActionLike;
  meleeDamage: number;
}): boolean {
  return (
    resolveBossAttackDamage(opts) > 0 &&
    wxBossAttackCommitWithoutDamage(opts) === 0
  );
}
