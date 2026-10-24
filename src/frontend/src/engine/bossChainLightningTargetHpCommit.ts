/**
 * Lord of Static CHAIN_LIGHTNING advertised minion HP
 * (`WorldExploration` ~16025).
 *
 * `applyChainLightning` (`useBossSystem.ts` ~738) walks every
 * `activeShockTiles` cell, then the four orthogonal neighbors from
 * `getAdjacentTiles` (N/S/W/E, in-bounds 16×16, `allTiles` true). Each
 * non-boss occupant on a neighbor takes **8**, stacked when a body sits
 * next to two tiles (`damageToTargets[id] += 8`). The player is summed
 * onto `damageToPlayer`; the occupant **on** a shock cell is not in the
 * neighbor set. Live WorldExploration then:
 *   `if (res?.damageToPlayer && res.damageToPlayer > 0) { player HP }`
 *   merge `newBossState` / debuffs
 *   `updateCombatant({ x, y })` on the **boss**
 * so a pawn beside a shock tile never loses HP. After Strike kills the
 * remaining boss, that leftover minion still blocks `shouldAwardVictory`.
 *
 * Unique extra vs:
 * - #984 `bossVampiricAoeTargetHpCommit`: Manhattan-3 drain of 10,
 *   ability `VAMPIRIC_AOE`. This file is orthogonal-adjacent stacked 8.
 * - #1022 `bossQueenRayTargetHpCommit`: first occupant on a queen ray,
 *   `floor(atk * 0.8)`, ability `ATTACK_ALL_LINES`.
 * - #868 `bossKitChainLightningExecute`: kit `starter-blast` bounce
 *   20 / 10 / 5 from `hitsMultiple` + `bounces`. `type:"spell"`.
 * - #975 VAMPIRIC_AOE boss self-heal. This file does **not** heal the
 *   boss and does **not** change player HP.
 * - #968 LIFE_DRAIN trigger 15 HP / +1 atk (no `damageToTargets`).
 * - #916 melee player HP when `damageToPlayer` is missing.
 * - Dawn `damageToPlayer: -10` (#948).
 *
 * Boss-ability splash kills must not enter `applyRewards`
 * (`countsTowardKillRewards` is a player-kill roster). This helper
 * returns lethal flags; callers must not credit XP/Doka.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * occupancyShockUnseal, bossQueenRayTargetHpCommit.ts,
 * bossVampiricAoeTargetHpCommit.ts, bossVampiricAoeHealCommit.ts,
 * bossLifeDrainHealCommit.ts, bossDawnHealCommit.ts,
 * bossAttackDamageCommit.ts, bossKitChainLightningExecute.ts,
 * spellEngine.ts, or challengeCompletion.ts. Restack the WX ability
 * apply onto `resolveBossChainLightningTargetHpCommit` after those
 * PRs land.
 */

import {
  type Combatant,
  activeHostilesRemaining,
  countsTowardKillRewards,
  hpAfterIncomingDamage,
  isAliveCombatant,
} from "./battleSetup.ts";

export const CHAIN_LIGHTNING_TARGET_ABILITY = "CHAIN_LIGHTNING";

/** Production `applyChainLightning` per adjacent occupant. */
export const CHAIN_LIGHTNING_TARGET_DAMAGE = 8;

export const CHAIN_LIGHTNING_HIT_LOG = "Chain lightning hits";

export const CHAIN_LIGHTNING_EMPTY_LOG =
  "chain lightning crackles but hits no one.";

const ORTH: ReadonlyArray<readonly [number, number]> = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
];

export type BossChainLightningTargetActionLike = {
  type?: string | null;
  ability?: string | null;
  abilityResult?: {
    damageToPlayer?: number | null;
    damageToTargets?: Record<string, number> | null;
    logMessages?: string[] | null;
    healAmount?: number | null;
  } | null;
};

export type ChainLightningOccupant = {
  id: string;
  x: number;
  y: number;
  isPlayer?: boolean;
};

export type ChainLightningShockTile = {
  x: number;
  y: number;
};

export type ChainLightningTargetCombatant = Combatant & {
  id: string;
};

export type BossChainLightningTargetHpCommit = {
  combatants: ChainLightningTargetCombatant[];
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

/**
 * Production `getAdjacentTiles` with `occupied = []`: orthogonal
 * neighbors that are in-bounds and `allTiles` true.
 */
export function chainLightningAdjacentTiles(args: {
  tile: ChainLightningShockTile;
  allTiles: boolean[][];
}): Array<{ x: number; y: number }> {
  const out: Array<{ x: number; y: number }> = [];
  for (const [dx, dy] of ORTH) {
    const x = args.tile.x + dx;
    const y = args.tile.y + dy;
    if (x < 0 || x >= 16 || y < 0 || y >= 16) continue;
    if (!args.allTiles[y]?.[x]) continue;
    out.push({ x, y });
  }
  return out;
}

/**
 * Nearby non-player `damageToTargets` the ability writes. Player is not
 * in this map — production always sums the player onto `damageToPlayer`.
 * Occupant on the shock cell itself is skipped. Amounts stack.
 */
export function chainLightningDamageToTargets(args: {
  bossId: string;
  shockTiles: readonly ChainLightningShockTile[];
  allTiles: boolean[][];
  others: readonly ChainLightningOccupant[];
}): Record<string, number> {
  const out: Record<string, number> = {};
  for (const tile of args.shockTiles) {
    for (const neighbor of chainLightningAdjacentTiles({
      tile,
      allTiles: args.allTiles,
    })) {
      const hit = args.others.find(
        (c) => c.x === neighbor.x && c.y === neighbor.y,
      );
      if (!hit) continue;
      if (hit.id === args.bossId) continue;
      if (hit.isPlayer) continue;
      out[hit.id] = (out[hit.id] ?? 0) + CHAIN_LIGHTNING_TARGET_DAMAGE;
    }
  }
  return out;
}

function isChainLightningAbilityAction(
  action: BossChainLightningTargetActionLike,
): boolean {
  if (
    action.type === "attack" ||
    action.type === "spell" ||
    action.type === "move"
  ) {
    return false;
  }
  if (action.ability === CHAIN_LIGHTNING_TARGET_ABILITY) return true;
  const logs = action.abilityResult?.logMessages ?? [];
  return logs.some(
    (line) =>
      line.includes(CHAIN_LIGHTNING_HIT_LOG) ||
      line.includes(CHAIN_LIGHTNING_EMPTY_LOG),
  );
}

/**
 * Advertised per-id stacked 8. VAMPIRIC / queen-ray / kit blast must
 * not match. Negative `damageToPlayer` is Dawn (#948) — not this helper.
 */
export function bossChainLightningTargetHpFromAction(
  action: BossChainLightningTargetActionLike,
): Record<string, number> | null {
  if (!isChainLightningAbilityAction(action)) return null;
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
export function shouldCreditChainLightningTargetKill(_combatant: {
  isSummon?: boolean;
  side?: "player" | "enemy";
}): boolean {
  return false;
}

function commitChainLightningTargets(opts: {
  combatants: readonly ChainLightningTargetCombatant[];
  action: BossChainLightningTargetActionLike;
  applyTargetHp: boolean;
}): BossChainLightningTargetHpCommit {
  const drains = opts.applyTargetHp
    ? bossChainLightningTargetHpFromAction(opts.action)
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
 * minion `damageToTargets` is skipped; adjacent HP stays put.
 */
export function wxBossChainLightningCommitWithoutTargetHp(opts: {
  combatants: readonly ChainLightningTargetCombatant[];
  action: BossChainLightningTargetActionLike;
}): BossChainLightningTargetHpCommit {
  return commitChainLightningTargets({ ...opts, applyTargetHp: false });
}

/**
 * Apply advertised CHAIN_LIGHTNING minion HP. Caps at 0. Does **not**
 * heal the boss, does **not** change player HP, does **not** record
 * player `healUsed`.
 */
export function resolveBossChainLightningTargetHpCommit(opts: {
  combatants: readonly ChainLightningTargetCombatant[];
  action: BossChainLightningTargetActionLike;
}): BossChainLightningTargetHpCommit {
  return commitChainLightningTargets({ ...opts, applyTargetHp: true });
}

/** True when live WX would leave advertised minion HP on the floor. */
export function wxBossChainLightningDroppedTargetHp(opts: {
  combatants: readonly ChainLightningTargetCombatant[];
  action: BossChainLightningTargetActionLike;
}): boolean {
  const live = wxBossChainLightningCommitWithoutTargetHp(opts);
  const fixed = resolveBossChainLightningTargetHpCommit(opts);
  if (live.lethalIds.length !== fixed.lethalIds.length) return true;
  for (let i = 0; i < live.combatants.length; i++) {
    const a = live.combatants[i];
    const b = fixed.combatants[i];
    if (a && b && a.hp !== b.hp) return true;
  }
  return false;
}

export function chainLightningTargetStillHostile(
  combatant: ChainLightningTargetCombatant,
): boolean {
  return isAliveCombatant(combatant) && countsTowardKillRewards(combatant);
}
