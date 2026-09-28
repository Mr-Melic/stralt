/**
 * Boss TELEPORT_ADJACENT / ADVANCE_PER_TURN / KNIGHT_JUMP_IGNORE_WALLS
 * write `newBossPosition`, then WorldExploration returns (~16230)
 * before the enemy landing-hazard block (~16872). A last-hostile boss
 * can stand on lava and take another turn; victory / applyRewards wait.
 *
 * Unique extra vs:
 * - #754 `planSwapLandings`: Swap teleports two units. Player dest also
 *   charges Void Rift. Boss ability dest is one unit, enemy landing only.
 * - #758 `planAutoSummonLanding`: taxes the cell after executor occupancy
 *   slide (MOVE). Boss WX writes `newBossPosition` raw — tax that dest.
 * - #728 claimed `combatantLandingHazard` (not shipped; End Turn only).
 *
 * Plan against the **pre-ability** hazard map. Do not merge
 * `res.newHazardTiles` first — Bone Cavalier phase 2 SPIKE_ON_LAND
 * plants spikes on the jump dest; a post-plant tax would hit the boss
 * for their own plant.
 *
 * Match enemy landing, not player walk: lava 8–15 + Burning, spikes 5–10,
 * ice Frozen. No Thorned Ground (path length), no Void Rift.
 * Do not restack WorldExploration / useBossSystem / autoSummonLandingHazard
 * / swapLandingHazards.
 */

import { enemyHpAfterHazardDamage } from "./battleSetup.ts";

export type BossAbilityTile = { x: number; y: number };

export type BossAbilityLanding = {
  lavaDmg: number;
  spikeDmg: number;
  frozen: boolean;
  burning: boolean;
  hpLoss: number;
};

const EMPTY_LANDING: BossAbilityLanding = {
  lavaDmg: 0,
  spikeDmg: 0,
  frozen: false,
  burning: false,
  hpLoss: 0,
};

export function emptyBossAbilityLanding(): BossAbilityLanding {
  return { ...EMPTY_LANDING };
}

export function sameBossAbilityTile(
  a: BossAbilityTile,
  b: BossAbilityTile,
): boolean {
  return a.x === b.x && a.y === b.y;
}

/**
 * Enemy apply only taxes when the committed dest differs from origin.
 * A blocked teleport (no `newBossPosition`) must not re-tax a boss
 * already standing on lava.
 */
export function shouldApplyBossAbilityLandingHazard(opts: {
  origin: BossAbilityTile;
  dest: BossAbilityTile;
}): boolean {
  return !sameBossAbilityTile(opts.origin, opts.dest);
}

export type BossAbilityHazardKind = "lava" | "ice" | "spikes";

export type BossAbilityPlantedHazard = {
  x: number;
  y: number;
  type: string;
};

/**
 * True when this ability just planted a hazard on `dest`. Those tiles
 * must not enter the landing map — SPIKE_ON_LAND would self-tax.
 */
export function isSelfPlantedBossAbilityHazard(
  dest: BossAbilityTile,
  planted: readonly BossAbilityPlantedHazard[] | undefined | null,
): boolean {
  if (!planted || planted.length === 0) return false;
  return planted.some(
    (p) => p.x === dest.x && p.y === dest.y && typeof p.type === "string",
  );
}

export function bossAbilityHazardKindAt(
  tiles: Map<string, string> | undefined | null,
  dest: BossAbilityTile,
): BossAbilityHazardKind | undefined {
  if (!tiles) return undefined;
  const raw = tiles.get(`${dest.x},${dest.y}`);
  if (raw === "lava" || raw === "ice" || raw === "spikes") return raw;
  return undefined;
}

/** Same roll as WorldExploration enemy lava landing (8–15). */
export function rollBossAbilityLavaDamage(
  rand: () => number = Math.random,
): number {
  const r = Number(rand());
  const u = Number.isFinite(r) ? Math.min(1, Math.max(0, r)) : 0;
  return 8 + Math.floor(u * 8);
}

/** Same roll as WorldExploration enemy spike landing (5–10). */
export function rollBossAbilitySpikeDamage(
  rand: () => number = Math.random,
): number {
  const r = Number(rand());
  const u = Number.isFinite(r) ? Math.min(1, Math.max(0, r)) : 0;
  return 5 + Math.floor(u * 6);
}

/**
 * Tax the dest WorldExploration writes from `newBossPosition`.
 * `hazardTiles` is the map **before** `res.newHazardTiles`.
 */
export function planBossAbilityLanding(opts: {
  origin: BossAbilityTile;
  dest: BossAbilityTile;
  hazardTiles?: Map<string, string> | null;
  plantedThisAbility?: readonly BossAbilityPlantedHazard[] | null;
  lavaDmg?: number;
  spikeDmg?: number;
}): BossAbilityLanding {
  if (!shouldApplyBossAbilityLandingHazard(opts)) {
    return emptyBossAbilityLanding();
  }
  if (isSelfPlantedBossAbilityHazard(opts.dest, opts.plantedThisAbility)) {
    const preKind = bossAbilityHazardKindAt(opts.hazardTiles, opts.dest);
    const planted = opts.plantedThisAbility?.find(
      (p) => p.x === opts.dest.x && p.y === opts.dest.y,
    );
    if (!preKind || preKind === planted?.type) {
      return emptyBossAbilityLanding();
    }
  }
  const kind = bossAbilityHazardKindAt(opts.hazardTiles, opts.dest);
  const lavaDmg =
    kind === "lava"
      ? Math.max(
          0,
          Math.floor(Number(opts.lavaDmg) || rollBossAbilityLavaDamage()),
        )
      : 0;
  const spikeDmg =
    kind === "spikes"
      ? Math.max(
          0,
          Math.floor(Number(opts.spikeDmg) || rollBossAbilitySpikeDamage()),
        )
      : 0;
  return {
    lavaDmg,
    spikeDmg,
    frozen: kind === "ice",
    burning: kind === "lava",
    hpLoss: lavaDmg + spikeDmg,
  };
}

/**
 * Store HP after landing. Callers must `updateCombatant` and, when
 * lethal, `processCombatantDeath` — React-only writes leave a lava-killed
 * last boss in the store so victory / applyRewards never fire.
 */
export function hpAfterBossAbilityLanding(
  currentHp: number,
  landing: BossAbilityLanding,
): { newHp: number; lethal: boolean } {
  return enemyHpAfterHazardDamage(currentHp, landing.hpLoss);
}

export type BossAbilityCommit = {
  dest: BossAbilityTile;
  hp: number;
};

/**
 * Production WX (~16022 / ~16226): write dest, keep HP, return.
 * That is the miss this helper closes.
 */
export function wxBossAbilityCommitWithoutLanding(opts: {
  origin: BossAbilityTile;
  newBossPosition?: BossAbilityTile | null;
  hp: number;
}): BossAbilityCommit {
  const dest = opts.newBossPosition ?? opts.origin;
  return { dest, hp: opts.hp };
}

/**
 * Restack after WX writes `newBossPosition`: tax dest against the
 * pre-ability map. Executor / occupancy slide is not in this path.
 */
export function applyBossAbilityLandingAfterCommit(opts: {
  origin: BossAbilityTile;
  dest: BossAbilityTile;
  hp: number;
  hazardTiles?: Map<string, string> | null;
  plantedThisAbility?: readonly BossAbilityPlantedHazard[] | null;
  lavaDmg?: number;
  spikeDmg?: number;
}): {
  newHp: number;
  lethal: boolean;
  landing: BossAbilityLanding;
} {
  const landing = planBossAbilityLanding({
    origin: opts.origin,
    dest: opts.dest,
    hazardTiles: opts.hazardTiles,
    plantedThisAbility: opts.plantedThisAbility,
    lavaDmg: opts.lavaDmg,
    spikeDmg: opts.spikeDmg,
  });
  const hp = hpAfterBossAbilityLanding(opts.hp, landing);
  return { ...hp, landing };
}
