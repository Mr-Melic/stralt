/**
 * Starved Vampire Pawn VAMPIRIC_AOE advertised minion HP
 * (`WorldExploration` ~16025).
 *
 * `applyVampiricAoe` (`useBossSystem.ts` ~1067) drains 10 HP from the
 * player (`damageToPlayer: 10`) and 10 HP from every non-boss combatant
 * within Manhattan 3 (`damageToTargets[id] = 10`), then logs
 * "Vampiric drain hits {name} for 10 HP!". There is **no** HP write for
 * those ids. Live WorldExploration then:
 *   `if (res?.damageToPlayer && res.damageToPlayer > 0) { player HP }`
 *   merge `newBossState` / debuffs
 *   `updateCombatant({ x, y })` on the **boss**
 * so nearby minion HP never moves. A 10 HP pawn stays 10 after the log.
 * After the player Strike-kills the 10 HP boss, that leftover minion
 * still counts as an active hostile and `shouldAwardVictory` stays false.
 *
 * Unique extra vs:
 * - #975 `bossVampiricAoeHealCommit`: boss self-heal from drained HP.
 *   That helper explicitly does not debit minion HP. This file does
 *   **not** heal the boss and does **not** change player HP.
 * - Queen-ray `ATTACK_ALL_LINES` / `CHAIN_LIGHTNING` `damageToTargets`
 *   (generic leftover; different ability ids and amounts).
 * - #968 LIFE_DRAIN trigger 15 HP / +1 atk (no `damageToTargets`).
 * - #916 melee player HP when `damageToPlayer` is missing.
 * - Kit `starter-drain` / `spell-lifesteal-nova` (`type:"spell"` ~15873).
 *
 * Boss-ability splash kills must not enter `applyRewards`
 * (`countsTowardKillRewards` is a player-kill roster). This helper
 * returns lethal flags; callers must not credit XP/Doka.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * bossVampiricAoeHealCommit.ts, bossLifeDrainHealCommit.ts,
 * bossDawnHealCommit.ts, bossAttackDamageCommit.ts, spellEngine.ts,
 * or challengeCompletion.ts. Restack the WX ability apply onto
 * `resolveBossVampiricAoeTargetHpCommit` after those PRs land.
 */

import {
  type Combatant,
  activeHostilesRemaining,
  countsTowardKillRewards,
  hpAfterIncomingDamage,
  isAliveCombatant,
} from "./battleSetup.ts";

export const VAMPIRIC_AOE_TARGET_ABILITY = "VAMPIRIC_AOE";

/** Production `applyVampiricAoe` radius (Manhattan). */
export const VAMPIRIC_AOE_TARGET_RADIUS = 3;

/** Advertised drain per in-radius non-boss combatant. */
export const VAMPIRIC_AOE_TARGET_DRAIN = 10;

export const VAMPIRIC_AOE_TARGET_HIT_LOG = "Vampiric drain hits";

export const VAMPIRIC_AOE_TARGET_AOE_LOG =
  "The Starved Vampire Pawn unleashes a vampiric AoE drain in 3-tile radius!";

export type BossVampiricAoeTargetActionLike = {
  type?: string | null;
  ability?: string | null;
  abilityResult?: {
    damageToPlayer?: number | null;
    damageToTargets?: Record<string, number> | null;
    logMessages?: string[] | null;
    healAmount?: number | null;
  } | null;
};

export type VampiricAoeTargetOccupant = {
  id: string;
  x: number;
  y: number;
};

export type VampiricAoeTargetCombatant = Combatant & {
  id: string;
};

export type BossVampiricAoeTargetHpCommit = {
  combatants: VampiricAoeTargetCombatant[];
  hostilesRemaining: number;
  lethalIds: string[];
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

export function vampiricAoeTargetManhattan(
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function vampiricAoeTargetInRadius(
  boss: { x: number; y: number },
  cell: { x: number; y: number },
): boolean {
  return vampiricAoeTargetManhattan(boss, cell) <= VAMPIRIC_AOE_TARGET_RADIUS;
}

/**
 * Nearby non-boss `damageToTargets` the ability writes. Player is not
 * in this map — production always puts the player on `damageToPlayer`.
 */
export function vampiricAoeTargetDrainMap(args: {
  boss: VampiricAoeTargetOccupant;
  others: readonly VampiricAoeTargetOccupant[];
}): Record<string, number> {
  const out: Record<string, number> = {};
  for (const e of args.others) {
    if (e.id === args.boss.id) continue;
    if (!vampiricAoeTargetInRadius(args.boss, e)) continue;
    out[e.id] = VAMPIRIC_AOE_TARGET_DRAIN;
  }
  return out;
}

function isVampiricAoeTargetAbilityAction(
  action: BossVampiricAoeTargetActionLike,
): boolean {
  if (
    action.type === "attack" ||
    action.type === "spell" ||
    action.type === "move"
  ) {
    return false;
  }
  if (action.ability === VAMPIRIC_AOE_TARGET_ABILITY) return true;
  const logs = action.abilityResult?.logMessages ?? [];
  return logs.includes(VAMPIRIC_AOE_TARGET_AOE_LOG);
}

/**
 * Advertised per-id drain. Queen-ray / chain / kit drain must not
 * match. Negative `damageToPlayer` is Dawn (#948) — not this helper.
 */
export function bossVampiricAoeTargetHpFromAction(
  action: BossVampiricAoeTargetActionLike,
): Record<string, number> | null {
  if (!isVampiricAoeTargetAbilityAction(action)) return null;
  const dmg = finiteNumber(action.abilityResult?.damageToPlayer);
  if (dmg != null && dmg < 0) return null;
  const targets = action.abilityResult?.damageToTargets;
  if (!targets) return null;
  const out: Record<string, number> = {};
  for (const [id, amount] of Object.entries(targets)) {
    const drain = positiveDrain(amount);
    if (drain <= 0) continue;
    out[id] = drain;
  }
  return Object.keys(out).length > 0 ? out : null;
}

/**
 * Boss-ability splash deaths are not player kills. `applyRewards` must
 * not mint XP/Doka for a minion this helper reduced to 0.
 */
export function shouldCreditVampiricAoeTargetKill(_combatant: {
  isSummon?: boolean;
  side?: "player" | "enemy";
}): boolean {
  return false;
}

function commitVampiricAoeTargets(opts: {
  combatants: readonly VampiricAoeTargetCombatant[];
  action: BossVampiricAoeTargetActionLike;
  applyTargetHp: boolean;
}): BossVampiricAoeTargetHpCommit {
  const drains = opts.applyTargetHp
    ? bossVampiricAoeTargetHpFromAction(opts.action)
    : null;
  const lethalIds: string[] = [];
  const combatants = opts.combatants.map((c) => {
    const drain = drains?.[c.id] ?? 0;
    if (drain <= 0) return { ...c };
    const before = finiteNumber(c.hp) ?? 0;
    const { newHp, lethal } = hpAfterIncomingDamage(before, drain);
    if (lethal && isAliveCombatant({ hp: before })) {
      lethalIds.push(c.id);
    }
    return { ...c, hp: newHp };
  });
  return {
    combatants,
    hostilesRemaining: activeHostilesRemaining(combatants),
    lethalIds,
  };
}

/**
 * Production WX (~16025 / ~16226): only `damageToPlayer > 0` as player
 * HP loss, then `updateCombatant({ x, y })` on the boss. Advertised
 * minion `damageToTargets` is skipped; nearby HP stays put.
 */
export function wxBossVampiricAoeCommitWithoutTargetHp(opts: {
  combatants: readonly VampiricAoeTargetCombatant[];
  action: BossVampiricAoeTargetActionLike;
}): BossVampiricAoeTargetHpCommit {
  return commitVampiricAoeTargets({ ...opts, applyTargetHp: false });
}

/**
 * Apply advertised VAMPIRIC_AOE minion HP. Caps at 0. Does **not**
 * heal the boss, does **not** change player HP, does **not** record
 * player `healUsed`.
 */
export function resolveBossVampiricAoeTargetHpCommit(opts: {
  combatants: readonly VampiricAoeTargetCombatant[];
  action: BossVampiricAoeTargetActionLike;
}): BossVampiricAoeTargetHpCommit {
  return commitVampiricAoeTargets({ ...opts, applyTargetHp: true });
}

/** True when live WX would leave advertised minion HP on the floor. */
export function wxBossVampiricAoeDroppedTargetHp(opts: {
  combatants: readonly VampiricAoeTargetCombatant[];
  action: BossVampiricAoeTargetActionLike;
}): boolean {
  const live = wxBossVampiricAoeCommitWithoutTargetHp(opts);
  const fixed = resolveBossVampiricAoeTargetHpCommit(opts);
  if (live.lethalIds.length !== fixed.lethalIds.length) return true;
  for (let i = 0; i < live.combatants.length; i++) {
    const a = live.combatants[i];
    const b = fixed.combatants[i];
    if (a && b && a.hp !== b.hp) return true;
  }
  return false;
}

export function vampiricAoeTargetStillHostile(
  combatant: VampiricAoeTargetCombatant,
): boolean {
  return isAliveCombatant(combatant) && countsTowardKillRewards(combatant);
}
