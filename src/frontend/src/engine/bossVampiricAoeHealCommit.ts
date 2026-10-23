/**
 * Starved Vampire Pawn VAMPIRIC_AOE advertised boss heal
 * (`WorldExploration` ~16025).
 *
 * `applyVampiricAoe` (`useBossSystem.ts` ~1067) drains 10 HP from the
 * player (`damageToPlayer: 10`) and 10 HP from every non-boss combatant
 * within Manhattan 3 (`damageToTargets`), then applies Exsanguinated.
 * The boss guide says "Spread out to reduce total healing the boss
 * receives." There is **no** boss HP field. Advertised heal is
 * `drainAmount` (10) times every drained body.
 *
 * Live WorldExploration then:
 *   `if (res?.damageToPlayer && res.damageToPlayer > 0) { apply player HP }`
 *   merge `newBossState` / debuffs
 *   `updateCombatant({ x, y })`
 * so the player takes 10 and boss HP never moves. A 10/60 pawn stays 10
 * (Strike 10 kills; with player-only drain heal it is 20). Two nearby
 * minions would feed +30. `atk` is unchanged (no LIFE_DRAIN +1).
 * Player `healUsed` stays false — this is a **boss** self-heal, not Dawn.
 *
 * Unique extra vs:
 * - #968 `bossLifeDrainHealCommit`: LIFE_DRAIN grow-stronger log heals
 *   **15** and grants **+1 atk** with no player HP field. Positive
 *   `damageToPlayer` 10 must not become that 15 / +atk.
 * - #948 `bossDawnHealCommit`: Twin Monarchs `damageToPlayer: -10` heals
 *   the **player** and flips `healUsed`. Negative damage must stay
 *   player HP, not invert into this boss heal.
 * - #916 `bossAttackDamageCommit`: melee player HP when `damageToPlayer`
 *   is missing.
 * - Kit `starter-drain` `healAmount` 5 / `spell-lifesteal-nova`
 *   `healAmount` 10 (type:"spell" ~15873).
 * - Queen-ray / Chain Lightning `damageToTargets` (no advertised boss
 *   heal). Map-modifier `vampiric_ground` is 15% attacker lifesteal.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * bossLifeDrainHealCommit.ts, bossDawnHealCommit.ts,
 * bossAttackDamageCommit.ts, spellEngine.ts, mapModifiers.ts, or
 * challengeCompletion.ts. Restack the WX ability apply onto
 * `resolveBossVampiricAoeHpCommit` after those PRs land.
 */

import { hpAfterHeal, isAliveCombatant } from "./battleSetup.ts";

export const VAMPIRIC_AOE_ABILITY = "VAMPIRIC_AOE";

/** Production `applyVampiricAoe` radius (Manhattan). */
export const VAMPIRIC_AOE_RADIUS = 3;

/** Advertised drain per body (player and each in-radius combatant). */
export const VAMPIRIC_AOE_DRAIN_AMOUNT = 10;

export const VAMPIRIC_AOE_LOG =
  "The Starved Vampire Pawn unleashes a vampiric AoE drain in 3-tile radius!";

export type BossVampiricAoeHealActionLike = {
  type?: string | null;
  ability?: string | null;
  abilityResult?: {
    damageToPlayer?: number | null;
    damageToTargets?: Record<string, number> | null;
    logMessages?: string[] | null;
    healAmount?: number | null;
    playerApModifier?: number | null;
  } | null;
};

export type BossVampiricAoeHealCommit = {
  hp: number;
  playerHp: number;
  restored: number;
  playerLost: number;
  healUsed: boolean;
  hostilesRemaining: number;
};

export type VampiricAoeOccupant = {
  id: string;
  x: number;
  y: number;
};

function finiteNumber(n: unknown): number | null {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  return v;
}

function positiveDrain(n: unknown): number {
  const v = finiteNumber(n);
  if (v == null || v <= 0) return 0;
  return v;
}

export function vampiricAoeManhattan(
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function vampiricAoeInRadius(
  boss: { x: number; y: number },
  cell: { x: number; y: number },
): boolean {
  return vampiricAoeManhattan(boss, cell) <= VAMPIRIC_AOE_RADIUS;
}

/**
 * Nearby non-boss `damageToTargets` the ability writes. Player is not
 * in this map — production always puts the player on `damageToPlayer`.
 */
export function vampiricAoeTargetDrain(args: {
  boss: VampiricAoeOccupant;
  others: readonly VampiricAoeOccupant[];
}): Record<string, number> {
  const out: Record<string, number> = {};
  for (const e of args.others) {
    if (e.id === args.boss.id) continue;
    if (!vampiricAoeInRadius(args.boss, e)) continue;
    out[e.id] = VAMPIRIC_AOE_DRAIN_AMOUNT;
  }
  return out;
}

/**
 * Production always writes `damageToPlayer = 10` even when the player
 * is outside radius 3. Spreading the player does not cut this drain;
 * spreading other bodies does.
 */
export function vampiricAoePlayerDrain(): number {
  return VAMPIRIC_AOE_DRAIN_AMOUNT;
}

export function vampiricAoeAdvertisedHealFromResult(result: {
  damageToPlayer?: number | null;
  damageToTargets?: Record<string, number> | null;
}): number {
  let total = positiveDrain(result.damageToPlayer);
  const targets = result.damageToTargets;
  if (targets) {
    for (const amount of Object.values(targets)) {
      total += positiveDrain(amount);
    }
  }
  return total;
}

function isVampiricAoeAbilityAction(
  action: BossVampiricAoeHealActionLike,
): boolean {
  if (
    action.type === "attack" ||
    action.type === "spell" ||
    action.type === "move"
  ) {
    return false;
  }
  if (action.ability === VAMPIRIC_AOE_ABILITY) return true;
  const logs = action.abilityResult?.logMessages ?? [];
  return logs.includes(VAMPIRIC_AOE_LOG);
}

/**
 * Advertised boss self-heal from drained HP. Positive `damageToPlayer`
 * is player HP loss (already applied by live WX) **and** feeds this
 * heal. Negative `damageToPlayer` is Dawn (#948) — not this helper.
 * Kit `healAmount` on type:"spell" is the ~15873 drain arm.
 */
export function bossVampiricAoeHealFromAction(
  action: BossVampiricAoeHealActionLike,
): number | null {
  if (!isVampiricAoeAbilityAction(action)) return null;
  const dmg = finiteNumber(action.abilityResult?.damageToPlayer);
  if (dmg != null && dmg < 0) return null;
  const heal = vampiricAoeAdvertisedHealFromResult({
    damageToPlayer: action.abilityResult?.damageToPlayer,
    damageToTargets: action.abilityResult?.damageToTargets,
  });
  return heal > 0 ? heal : null;
}

/**
 * Live WX (~16025): `damageToPlayer > 0` is player HP loss only.
 * Returns that loss so tests can show Untouchable failing while the
 * boss heal is dropped.
 */
export function wxBossVampiricAoePlayerDamageFromAction(
  action: BossVampiricAoeHealActionLike,
): number {
  const dmg = finiteNumber(action.abilityResult?.damageToPlayer);
  if (dmg == null || dmg <= 0) return 0;
  return dmg;
}

function commitVampiricAoe(opts: {
  hp: number;
  maxHp: number;
  playerHp: number;
  action: BossVampiricAoeHealActionLike;
  applyHeal: boolean;
  healUsed?: boolean;
}): BossVampiricAoeHealCommit {
  const playerLost = wxBossVampiricAoePlayerDamageFromAction(opts.action);
  const beforeHp = finiteNumber(opts.hp) ?? 0;
  const heal = opts.applyHeal
    ? bossVampiricAoeHealFromAction(opts.action)
    : null;
  const nextHp =
    heal != null ? hpAfterHeal(opts.hp, opts.maxHp, heal) : beforeHp;
  const beforePlayer = finiteNumber(opts.playerHp) ?? 0;
  const nextPlayer = Math.max(0, beforePlayer - playerLost);
  return {
    hp: nextHp,
    playerHp: nextPlayer,
    restored: nextHp - beforeHp,
    playerLost,
    healUsed: opts.healUsed === true,
    hostilesRemaining: isAliveCombatant({ hp: nextHp }) ? 1 : 0,
  };
}

/**
 * Production WX (~16025 / ~16226): only `damageToPlayer > 0` as player
 * HP loss, then `updateCombatant({ x, y })`. Advertised boss heal from
 * drained HP is skipped; boss HP stays put.
 */
export function wxBossVampiricAoeCommitWithoutHeal(opts: {
  hp: number;
  maxHp: number;
  playerHp: number;
  action: BossVampiricAoeHealActionLike;
  healUsed?: boolean;
}): BossVampiricAoeHealCommit {
  return commitVampiricAoe({ ...opts, applyHeal: false });
}

/**
 * Apply advertised VAMPIRIC_AOE boss heal (sum of drained bodies).
 * Caps HP at `maxHp`. Does **not** record player `healUsed`.
 * Still applies live player HP loss so Dawn / missing melee cannot
 * fork onto this path.
 */
export function resolveBossVampiricAoeHpCommit(opts: {
  hp: number;
  maxHp: number;
  playerHp: number;
  action: BossVampiricAoeHealActionLike;
  healUsed?: boolean;
}): BossVampiricAoeHealCommit {
  return commitVampiricAoe({ ...opts, applyHeal: true });
}

/** True when live WX would leave the advertised drained-HP heal on the floor. */
export function wxBossVampiricAoeDroppedHeal(opts: {
  hp: number;
  maxHp: number;
  playerHp: number;
  action: BossVampiricAoeHealActionLike;
  healUsed?: boolean;
}): boolean {
  const live = wxBossVampiricAoeCommitWithoutHeal(opts);
  const fixed = resolveBossVampiricAoeHpCommit(opts);
  return fixed.hp > live.hp;
}
