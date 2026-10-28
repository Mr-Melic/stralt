/**
 * Boss-kit summon execute vs advertised enemy-summon cap / cadence.
 *
 * Pack summoners (`decideSummonerAction`) skip when living enemy-side
 * summons ≥ `ENEMY_SUMMON_CAP` (2) or when the last summon was within
 * `ENEMY_SUMMON_COOLDOWN_TURNS` (2). Comment at gameConstants:
 * "Enemy summons are capped at ENEMY_SUMMON_CAP alive and fire every
 * other turn … to avoid runaway board complexity."
 *
 * Live leftover — execute. Broodmother Rook phase-1 first-id is
 * `summon-archer` (`isSummon`). `pickBossKitSpell` always receives
 * `new Map()`, so that id is decided every turn. WorldExploration kit
 * apply (~15828) short-circuits `bossSpell.isSummon` straight into
 * `spawnEnemySummonRef(bossSpellDest, bossSpell)` — no cap, no
 * `ENEMY_SUMMON_COOLDOWN_TURNS` check. The cooldown map written after
 * spawn is ignored next decide because the Map is empty again.
 *
 * Sequence: Broodmother kit Archer with 2 living enemy summons already
 * on the board (or last summon 1 turn ago) → advertised skip (pack
 * gates), live spawn #3 / every-turn flood. Leftover archers remain
 * hostiles after the Rook dies, so `shouldAwardVictory` stays blocked
 * past the advertised cap of 2.
 *
 * Unique leftover of **#910** `bossKitSummonExecute` (ground range 2 /
 * player-tile dest; that sidecar explicitly left "regular summoner,
 * cap + cooldown"). Unique vs:
 * - **#910** Manhattan range / occupied dest (not a count gate)
 * - **#1247** Final Pawn kit-first Strike vs GHOST_SUMMON (decide, HP≤10%)
 * - **#1261** Fetid Rook kit-first Venom vs SPLIT_ROOKS
 * - **#1217** Broodmother larva-explode contact (larvae never spawn)
 * - **#1159** Enthroned Void kit-first Swap vs PHANTOM_SPAWN
 * - pack `decideSummonerAction` (already honors both gates)
 *
 * Do not restack WorldExploration / useBossAI / enemyAI / summonSpawn /
 * targeting / bossKitSummonExecute. Restack the kit summon short-circuit
 * onto `executeBossKitSummonPackGates` after older combat PRs land.
 * Do not change `ENEMY_SUMMON_CAP` / cooldown numbers (balance).
 */

import {
  ENEMY_SUMMON_CAP,
  ENEMY_SUMMON_COOLDOWN_TURNS,
} from "../data/gameConstants.ts";

export const BROODMOTHER_ROOK_ID = "broodmother_rook";

/** Phase-1 and phase-2 first kit id (`bossKits` `phase1SpellIds[0]`). */
export const BROODMOTHER_KIT_FIRST_ID = "summon-archer";

export const BOSS_KIT_SUMMON_CAP = ENEMY_SUMMON_CAP;

export const BOSS_KIT_SUMMON_COOLDOWN_TURNS = ENEMY_SUMMON_COOLDOWN_TURNS;

export const LARVAE_SPAWN_ABILITY = "LARVAE_SPAWN";

export const GHOST_SUMMON_ABILITY = "GHOST_SUMMON";

export const SPLIT_ROOKS_ABILITY = "SPLIT_ROOKS";

export const PHANTOM_SPAWN_ABILITY = "PHANTOM_SPAWN";

/** #910 leftover — range / dest, not this count gate. */
export const BOSS_KIT_SUMMON_RANGE_LEFTOVER_ID = "summon-archer";

export type EnemySummonCapCombatant = {
  id?: string;
  isSummon?: boolean;
  side?: string;
  hp?: number;
};

export type BossKitSummonPackGatesArgs = {
  /** Live store combatants (enemy summons counted with `side === "enemy"`). */
  combatants: ReadonlyArray<EnemySummonCapCombatant>;
  /** Catalog / kit spell. Non-summon packets skip this leftover. */
  isSummon: boolean;
  /**
   * Battle turn of this kit apply. Pack summoner uses
   * `currentTurn - lastSummonTurn < ENEMY_SUMMON_COOLDOWN_TURNS`.
   */
  currentTurn?: number | null;
  /** Battle turn of this summoner's last successful kit/pack summon. */
  lastSummonTurn?: number | null;
};

export type BossKitSummonPackGatesExecute = {
  spawned: boolean;
  livingEnemySummons: number;
  capReached: boolean;
  onCooldown: boolean;
};

function finiteInt(value: unknown): number | null {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.floor(n);
}

export function isEnemySideSummon(
  combatant: EnemySummonCapCombatant | null | undefined,
): boolean {
  if (!combatant) return false;
  if (combatant.isSummon !== true) return false;
  return combatant.side === "enemy";
}

/** Living enemy-side summons — same filter as `decideSummonerAction`. */
export function countLivingEnemySummons(
  combatants: ReadonlyArray<EnemySummonCapCombatant>,
): number {
  let n = 0;
  for (const c of combatants) {
    if (!isEnemySideSummon(c)) continue;
    const hp = finiteInt(c.hp);
    if (hp != null && hp <= 0) continue;
    n += 1;
  }
  return n;
}

export function isBossKitSummonCapReached(livingEnemySummons: number): boolean {
  return livingEnemySummons >= BOSS_KIT_SUMMON_CAP;
}

/**
 * Pack summoner cooldown: skip when both turns are present and the
 * gap is strictly less than `ENEMY_SUMMON_COOLDOWN_TURNS`.
 */
export function isBossKitSummonOnCooldown(args: {
  currentTurn?: number | null;
  lastSummonTurn?: number | null;
}): boolean {
  const current = finiteInt(args.currentTurn);
  const last = finiteInt(args.lastSummonTurn);
  if (current == null || last == null) return false;
  return current - last < BOSS_KIT_SUMMON_COOLDOWN_TURNS;
}

export function canSpawnBossKitSummonUnderPackGates(
  args: BossKitSummonPackGatesArgs,
): boolean {
  if (args.isSummon !== true) return false;
  const living = countLivingEnemySummons(args.combatants);
  if (isBossKitSummonCapReached(living)) return false;
  if (
    isBossKitSummonOnCooldown({
      currentTurn: args.currentTurn,
      lastSummonTurn: args.lastSummonTurn,
    })
  ) {
    return false;
  }
  return true;
}

/** Alias so decide and the kit short-circuit cannot fork. */
export function shouldSpawnBossKitSummonUnderPackGates(
  args: BossKitSummonPackGatesArgs,
): boolean {
  return canSpawnBossKitSummonUnderPackGates(args);
}

/**
 * Advertised pack gates. Incoming non-summon is a no-op so a kit Strike
 * cannot mint a spawn from this leftover.
 */
export function executeBossKitSummonPackGates(
  args: BossKitSummonPackGatesArgs,
): BossKitSummonPackGatesExecute | null {
  if (args.isSummon !== true) return null;
  const livingEnemySummons = countLivingEnemySummons(args.combatants);
  const capReached = isBossKitSummonCapReached(livingEnemySummons);
  const onCooldown = isBossKitSummonOnCooldown({
    currentTurn: args.currentTurn,
    lastSummonTurn: args.lastSummonTurn,
  });
  return {
    spawned: !capReached && !onCooldown,
    livingEnemySummons,
    capReached,
    onCooldown,
  };
}

/**
 * Live WX kit apply (~15828): `bossSpell.isSummon` → spawn, no cap.
 * Empty decide Map means WX's post-spawn cooldown write never gates
 * the next first-id Archer.
 */
export function liveWxBossKitSummonHonorsPackGates(): boolean {
  return false;
}

/** Pack `decideSummonerAction` already skips at cap / cooldown. */
export function packSummonerHonorsPackGates(): boolean {
  return true;
}

/** Live kit short-circuit still calls spawn at cap. */
export function wxBossKitSummonSpawnsAtCap(): boolean {
  return true;
}

/** Live kit short-circuit still calls spawn on consecutive boss turns. */
export function wxBossKitSummonSpawnsOnCooldown(): boolean {
  return true;
}

export function liveHostilesAfterBossKitSummon(args: {
  bossAlive: boolean;
  livingEnemySummonsBefore: number;
  spawned: boolean;
}): number {
  const boss = args.bossAlive ? 1 : 0;
  const extra = args.spawned ? 1 : 0;
  return boss + Math.max(0, args.livingEnemySummonsBefore) + extra;
}
