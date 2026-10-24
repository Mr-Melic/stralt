/**
 * Weeping Queen / Starborn Queen ATTACK_ALL_LINES advertised minion HP
 * (`WorldExploration` ~16025).
 *
 * `applyAttackAllLines` (`useBossSystem.ts` ~417) writes
 * `damageToPlayer = floor(atk * 0.8)` for the first occupant on a ray
 * who `isPlayer`, and `damageToTargets[id] = floor(atk * 0.8)` for every
 * other first occupant (rank, file, and diagonal; wall or first body
 * stops the ray). Live WorldExploration then:
 *   `if (res?.damageToPlayer && res.damageToPlayer > 0) { player HP }`
 *   merge `newBossState` / debuffs
 *   `updateCombatant({ x, y })` on the **boss**
 * so a pawn on a queen line never loses HP. After Strike kills the
 * remaining boss, that leftover minion still blocks `shouldAwardVictory`.
 *
 * Unique extra vs:
 * - #984 `bossVampiricAoeTargetHpCommit`: Manhattan-3 drain of 10, ability
 *   `VAMPIRIC_AOE`. This file is `ATTACK_ALL_LINES` and `floor(atk * 0.8)`.
 * - #975 `bossVampiricAoeHealCommit`: boss self-heal. This file does
 *   **not** heal the boss and does **not** change player HP.
 * - `CHAIN_LIGHTNING` stacked 8 from shock tiles (generic leftover).
 * - #968 LIFE_DRAIN trigger 15 HP / +1 atk (no `damageToTargets`).
 * - #916 melee player HP when `damageToPlayer` is missing.
 * - Dawn `damageToPlayer: -10` (#948).
 *
 * Boss-ability splash kills must not enter `applyRewards`
 * (`countsTowardKillRewards` is a player-kill roster). This helper
 * returns lethal flags; callers must not credit XP/Doka.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * bossVampiricAoeTargetHpCommit.ts, bossVampiricAoeHealCommit.ts,
 * bossLifeDrainHealCommit.ts, bossDawnHealCommit.ts,
 * bossAttackDamageCommit.ts, spellEngine.ts, or challengeCompletion.ts.
 * Restack the WX ability apply onto `resolveBossQueenRayTargetHpCommit`
 * after those PRs land.
 */

import {
  type Combatant,
  activeHostilesRemaining,
  countsTowardKillRewards,
  hpAfterIncomingDamage,
  isAliveCombatant,
} from "./battleSetup.ts";

export const QUEEN_RAY_TARGET_ABILITY = "ATTACK_ALL_LINES";

/** Production `applyAttackAllLines` multiplier on `bossEntry.atk`. */
export const QUEEN_RAY_ATK_SCALE = 0.8;

export const QUEEN_RAY_BLAST_LOG = "blasts";
export const QUEEN_RAY_LINE_LOG = "in all lines for";
export const QUEEN_RAY_EMPTY_LOG = "attacks all lines — no targets in range.";

const QUEEN_RAY_DIRS: ReadonlyArray<readonly [number, number]> = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

export type BossQueenRayTargetActionLike = {
  type?: string | null;
  ability?: string | null;
  abilityResult?: {
    damageToPlayer?: number | null;
    damageToTargets?: Record<string, number> | null;
    logMessages?: string[] | null;
    healAmount?: number | null;
  } | null;
};

export type QueenRayOccupant = {
  id: string;
  x: number;
  y: number;
  isPlayer?: boolean;
};

export type QueenRayTargetCombatant = Combatant & {
  id: string;
};

export type BossQueenRayTargetHpCommit = {
  combatants: QueenRayTargetCombatant[];
  hostilesRemaining: number;
  lethalIds: string[];
};

function finiteNumber(n: unknown): number | null {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  return v;
}

function positiveDamage(n: unknown): number {
  const v = finiteNumber(n);
  if (v == null || v <= 0) return 0;
  return v;
}

/** Production `Math.floor(bossEntry.atk * 0.8)`. */
export function queenRayDamageFromAtk(atk: number): number {
  const v = finiteNumber(atk);
  if (v == null || v <= 0) return 0;
  return Math.floor(v * QUEEN_RAY_ATK_SCALE);
}

/**
 * First occupant on each of the eight queen rays. Walls (`allTiles` false)
 * and the first body stop that ray — same walk as `getQueenRayTargets`.
 */
export function queenRayFirstOccupants(args: {
  boss: QueenRayOccupant;
  allTiles: boolean[][];
  combatants: readonly QueenRayOccupant[];
}): QueenRayOccupant[] {
  const { boss, allTiles, combatants } = args;
  const hits: QueenRayOccupant[] = [];
  for (const [dx, dy] of QUEEN_RAY_DIRS) {
    let cx = boss.x + dx;
    let cy = boss.y + dy;
    while (cx >= 0 && cx < 16 && cy >= 0 && cy < 16) {
      if (!allTiles[cy]?.[cx]) break;
      const hit = combatants.find((c) => c.x === cx && c.y === cy);
      if (hit) {
        hits.push(hit);
        break;
      }
      cx += dx;
      cy += dy;
    }
  }
  return hits;
}

/**
 * Nearby non-player `damageToTargets` the ability writes. Player is not
 * in this map — production always puts the player on `damageToPlayer`.
 */
export function queenRayDamageToTargets(args: {
  boss: QueenRayOccupant;
  allTiles: boolean[][];
  others: readonly QueenRayOccupant[];
  atk: number;
}): Record<string, number> {
  const dmg = queenRayDamageFromAtk(args.atk);
  const out: Record<string, number> = {};
  if (dmg <= 0) return out;
  for (const hit of queenRayFirstOccupants({
    boss: args.boss,
    allTiles: args.allTiles,
    combatants: args.others,
  })) {
    if (hit.id === args.boss.id) continue;
    if (hit.isPlayer) continue;
    out[hit.id] = dmg;
  }
  return out;
}

function isQueenRayAbilityAction(
  action: BossQueenRayTargetActionLike,
): boolean {
  if (
    action.type === "attack" ||
    action.type === "spell" ||
    action.type === "move"
  ) {
    return false;
  }
  if (action.ability === QUEEN_RAY_TARGET_ABILITY) return true;
  const logs = action.abilityResult?.logMessages ?? [];
  return logs.some(
    (line) =>
      line.includes(QUEEN_RAY_BLAST_LOG) && line.includes(QUEEN_RAY_LINE_LOG),
  );
}

/**
 * Advertised per-id queen-line damage. VAMPIRIC / chain / kit drain must
 * not match. Negative `damageToPlayer` is Dawn (#948) — not this helper.
 */
export function bossQueenRayTargetHpFromAction(
  action: BossQueenRayTargetActionLike,
): Record<string, number> | null {
  if (!isQueenRayAbilityAction(action)) return null;
  const dmg = finiteNumber(action.abilityResult?.damageToPlayer);
  if (dmg != null && dmg < 0) return null;
  const targets = action.abilityResult?.damageToTargets;
  if (!targets) return null;
  const out: Record<string, number> = {};
  for (const [id, amount] of Object.entries(targets)) {
    const hit = positiveDamage(amount);
    if (hit <= 0) continue;
    out[id] = hit;
  }
  return Object.keys(out).length > 0 ? out : null;
}

/**
 * Boss-ability splash deaths are not player kills. `applyRewards` must
 * not mint XP/Doka for a minion this helper reduced to 0.
 */
export function shouldCreditQueenRayTargetKill(_combatant: {
  isSummon?: boolean;
  side?: "player" | "enemy";
}): boolean {
  return false;
}

function commitQueenRayTargets(opts: {
  combatants: readonly QueenRayTargetCombatant[];
  action: BossQueenRayTargetActionLike;
  applyTargetHp: boolean;
}): BossQueenRayTargetHpCommit {
  const drains = opts.applyTargetHp
    ? bossQueenRayTargetHpFromAction(opts.action)
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
 * minion `damageToTargets` is skipped; queen-line HP stays put.
 */
export function wxBossQueenRayCommitWithoutTargetHp(opts: {
  combatants: readonly QueenRayTargetCombatant[];
  action: BossQueenRayTargetActionLike;
}): BossQueenRayTargetHpCommit {
  return commitQueenRayTargets({ ...opts, applyTargetHp: false });
}

/**
 * Apply advertised ATTACK_ALL_LINES minion HP. Caps at 0. Does **not**
 * heal the boss, does **not** change player HP, does **not** record
 * player `healUsed`.
 */
export function resolveBossQueenRayTargetHpCommit(opts: {
  combatants: readonly QueenRayTargetCombatant[];
  action: BossQueenRayTargetActionLike;
}): BossQueenRayTargetHpCommit {
  return commitQueenRayTargets({ ...opts, applyTargetHp: true });
}

/** True when live WX would leave advertised minion HP on the floor. */
export function wxBossQueenRayDroppedTargetHp(opts: {
  combatants: readonly QueenRayTargetCombatant[];
  action: BossQueenRayTargetActionLike;
}): boolean {
  const live = wxBossQueenRayCommitWithoutTargetHp(opts);
  const fixed = resolveBossQueenRayTargetHpCommit(opts);
  if (live.lethalIds.length !== fixed.lethalIds.length) return true;
  for (let i = 0; i < live.combatants.length; i++) {
    const a = live.combatants[i];
    const b = fixed.combatants[i];
    if (a && b && a.hp !== b.hp) return true;
  }
  return false;
}

export function queenRayTargetStillHostile(
  combatant: QueenRayTargetCombatant,
): boolean {
  return isAliveCombatant(combatant) && countsTowardKillRewards(combatant);
}
