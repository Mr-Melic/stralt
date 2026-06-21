import type { ChessPieceType } from "../types/gameTypes";

export interface TierSpawnConfig {
  tierSize: number;
  sameTierPercent: number;
  adjacentTierPercent: number;
  twoAwayPercent: number;
  threeOrMorePercent: number;
  levelVarianceChance?: number;
}

const DEFAULT_TIER_CONFIG: TierSpawnConfig = {
  tierSize: 10,
  sameTierPercent: 60,
  adjacentTierPercent: 20,
  twoAwayPercent: 10,
  threeOrMorePercent: 5,
};

let _cachedBackendTierConfig: TierSpawnConfig | null = null;

export function loadTierConfig(): TierSpawnConfig {
  if (_cachedBackendTierConfig) return _cachedBackendTierConfig;
  try {
    const raw = localStorage.getItem("pbv_tier_spawn_config");
    if (raw) return { ...DEFAULT_TIER_CONFIG, ...JSON.parse(raw) };
  } catch (e) {
    console.warn("[AI] Tier config load failed, using safe defaults:", e);
  }
  return DEFAULT_TIER_CONFIG;
}

const AI_TIER_VARIANCE_CHANCE = 0.3;

export const computeAITier = (enemyLevel: number): number => {
  let baseTier: number;
  if (enemyLevel <= 10) baseTier = 1;
  else if (enemyLevel <= 30) baseTier = 2;
  else if (enemyLevel <= 60) baseTier = 3;
  else if (enemyLevel <= 100) baseTier = 4;
  else if (enemyLevel <= 150) baseTier = 5;
  else if (enemyLevel <= 250) baseTier = 6;
  else if (enemyLevel <= 400) baseTier = 7;
  else if (enemyLevel <= 600) baseTier = 8;
  else if (enemyLevel <= 900) baseTier = 9;
  else baseTier = 10;
  if (Math.random() < AI_TIER_VARIANCE_CHANCE) {
    return Math.floor(Math.random() * 10) + 1;
  }
  return baseTier;
};

export function pickEnemyLevelFromTiers(playerLevel: number): number {
  const cfg = loadTierConfig();
  const ts = Math.max(1, cfg.tierSize);
  const playerTier = Math.floor((playerLevel - 1) / ts);
  const maxTier = Math.floor(999 / ts); // cap for reasonable range

  // Level variance roll — 15% default chance to shift tier ±1 (admin-configurable)
  const _lvlVarChance = (cfg.levelVarianceChance ?? 15) / 100;
  const _lvlVarRoll = Math.random();
  let _tierAdj = 0;
  if (_lvlVarRoll < _lvlVarChance) _tierAdj = -1;
  else if (_lvlVarRoll > 1 - _lvlVarChance) _tierAdj = 1;
  const adjustedPlayerTier = Math.max(
    0,
    Math.min(maxTier, playerTier + _tierAdj),
  );

  // Build weighted candidates
  const same = Math.min(100, cfg.sameTierPercent);
  const adj = Math.min(100 - same, cfg.adjacentTierPercent);
  const twoAway = Math.min(100 - same - adj, cfg.twoAwayPercent);
  const _threeMore = Math.max(0, 100 - same - adj - twoAway);

  const rand = Math.random() * 100;
  let chosenTier: number;

  if (rand < same) {
    chosenTier = adjustedPlayerTier;
  } else if (rand < same + adj) {
    // ±1 tier
    const side = Math.random() < 0.5 ? 1 : -1;
    chosenTier = Math.max(0, adjustedPlayerTier + side);
  } else if (rand < same + adj + twoAway) {
    // ±2 tier
    const side = Math.random() < 0.5 ? 2 : -2;
    chosenTier = Math.max(0, adjustedPlayerTier + side);
  } else {
    // ±3 or more — biased toward ±3 but can go higher
    const dist = 3 + Math.floor(Math.random() * 4); // 3..6
    const side = Math.random() < 0.5 ? 1 : -1;
    chosenTier = Math.max(
      0,
      Math.min(maxTier, adjustedPlayerTier + side * dist),
    );
  }

  // Convert tier index to a level in that tier's range
  const tierMin = chosenTier * ts + 1;
  const tierMax = (chosenTier + 1) * ts; // no upper cap for last tier
  return Math.max(
    1,
    Math.floor(Math.random() * (tierMax - tierMin + 1)) + tierMin,
  );
}

// Seeded pseudo-random number generator (pure, deterministic per grid position)
export function computeEnemyStats(
  level: number,
  pieceType: ChessPieceType,
  seedKey: string | number,
) {
  const rng = seededRng(
    typeof seedKey === "string"
      ? seedKey.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
      : seedKey,
  );
  const base = Math.max(1, level);
  const pieceMultipliers: Record<
    ChessPieceType,
    {
      sp: number;
      wr: number;
      sr: number;
      scp: number;
      wp: number;
      init: number;
      res: number;
      chc: number;
    }
  > = {
    pawn: {
      sp: 0.85,
      wr: 0.85,
      sr: 0.85,
      scp: 0.85,
      wp: 0.85,
      init: 0.85,
      res: 0.85,
      chc: 0.85,
    },
    rook: {
      sp: 0.8,
      wr: 1.3,
      sr: 1.2,
      scp: 0.8,
      wp: 1.1,
      init: 1.1,
      res: 1.35,
      chc: 0.7,
    },
    knight: {
      sp: 0.85,
      wr: 1.25,
      sr: 1.15,
      scp: 0.85,
      wp: 1.05,
      init: 1.2,
      res: 1.25,
      chc: 0.8,
    },
    bishop: {
      sp: 1.3,
      wr: 0.75,
      sr: 0.85,
      scp: 1.25,
      wp: 0.9,
      init: 1.0,
      res: 0.7,
      chc: 1.2,
    },
    queen: {
      sp: 1.25,
      wr: 0.8,
      sr: 0.9,
      scp: 1.2,
      wp: 0.95,
      init: 1.1,
      res: 0.75,
      chc: 1.15,
    },
    king: {
      sp: 1.0,
      wr: 1.0,
      sr: 1.0,
      scp: 1.0,
      wp: 1.0,
      init: 1.0,
      res: 1.0,
      chc: 1.0,
    },
  };
  const mult = pieceMultipliers[pieceType] ?? pieceMultipliers.king;
  const roll = (min: number, max: number, m: number) => {
    const raw = min + rng() * (max - min);
    return Math.max(1, Math.round(raw * m));
  };
  return {
    sp: roll(3, 6 + base * 1.2, mult.sp),
    wr: roll(2, 4 + base * 1.0, mult.wr),
    sr: roll(2, 4 + base * 1.0, mult.sr),
    scp: roll(3, 6 + base * 1.2, mult.scp),
    wp: roll(3, 6 + base * 1.2, mult.wp),
    init: roll(3, 6 + base * 1.2, mult.init),
    res: roll(2, 4 + base * 0.9, mult.res),
    chc: roll(1, 3 + base * 0.7, mult.chc),
  };
}

export function seededRng(seed: number): () => number {
  let val = Math.abs(seed) + 1;
  return () => {
    val = (val * 16807) % 2147483647;
    return (val - 1) / 2147483646;
  };
}

export function calcScaledDamage(
  baseDamage: number,
  _casterLevel: number,
  spellUpgradeLevel = 0,
): number {
  // Base damage from spellbook PLUS upgrade bonus (+3% per level)
  return Math.max(1, Math.floor(baseDamage * 1.03 ** spellUpgradeLevel));
}
