/**
 * Auto-summon AI `executeSummonAction` landing tax.
 *
 * Enemy apply (WorldExploration ~16872) charges lava 8–15 + Burning,
 * spikes 5–10, and ice Frozen after `newX !== origin`. Auto-summon MOVE
 * only updates position — then may slide off a sealed cut via
 * `resolveProgressionSafeOccupantCell`. Player-controlled walks
 * (`applyControlledSummonWalk`) are the same miss; #728 advertised
 * `combatantLandingHazard` for that path but shipped End Turn gates only.
 *
 * Unique extra vs:
 * - #754 `planSwapLandings`: Swap is a teleport. Player dest also charges
 *   Void Rift. Neither dest slides after occupancy unseal.
 * - #728: tax the **landed** cell after the executor slide, not the
 *   requested destination. A dest-only tax would burn a wolf that slid
 *   off lava, or miss one that slid onto spikes.
 *
 * Match enemy landing, not player walk: no Thorned Ground (path length),
 * no Void Rift. Do not restack summonExecutor / WorldExploration /
 * swapLandingHazards / combatantLandingHazard.
 */

import { enemyHpAfterHazardDamage } from "./battleSetup.ts";

export type AutoSummonTile = { x: number; y: number };

export type AutoSummonLanding = {
  lavaDmg: number;
  spikeDmg: number;
  frozen: boolean;
  burning: boolean;
  hpLoss: number;
};

const EMPTY_LANDING: AutoSummonLanding = {
  lavaDmg: 0,
  spikeDmg: 0,
  frozen: false,
  burning: false,
  hpLoss: 0,
};

export function emptyAutoSummonLanding(): AutoSummonLanding {
  return { ...EMPTY_LANDING };
}

export function sameAutoSummonTile(
  a: AutoSummonTile,
  b: AutoSummonTile,
): boolean {
  return a.x === b.x && a.y === b.y;
}

/**
 * Enemy apply only taxes when the committed dest differs from origin.
 * A blocked / same-tile MOVE must not re-tax a unit already standing
 * on lava.
 */
export function shouldApplyAutoSummonLandingHazard(opts: {
  origin: AutoSummonTile;
  landed: AutoSummonTile;
}): boolean {
  return !sameAutoSummonTile(opts.origin, opts.landed);
}

export type AutoSummonHazardKind = "lava" | "ice" | "spikes";

export function autoSummonHazardKindAt(
  tiles: Map<string, string> | undefined | null,
  dest: AutoSummonTile,
): AutoSummonHazardKind | undefined {
  if (!tiles) return undefined;
  const raw = tiles.get(`${dest.x},${dest.y}`);
  if (raw === "lava" || raw === "ice" || raw === "spikes") return raw;
  return undefined;
}

/** Same roll as WorldExploration enemy lava landing (8–15). */
export function rollAutoSummonLavaDamage(
  rand: () => number = Math.random,
): number {
  const r = Number(rand());
  const u = Number.isFinite(r) ? Math.min(1, Math.max(0, r)) : 0;
  return 8 + Math.floor(u * 8);
}

/** Same roll as WorldExploration enemy spike landing (5–10). */
export function rollAutoSummonSpikeDamage(
  rand: () => number = Math.random,
): number {
  const r = Number(rand());
  const u = Number.isFinite(r) ? Math.min(1, Math.max(0, r)) : 0;
  return 5 + Math.floor(u * 6);
}

/**
 * Tax the cell the executor actually occupied after occupancy slide.
 * Requested dest is intentionally not read — slide can leave lava.
 */
export function planAutoSummonLanding(opts: {
  origin: AutoSummonTile;
  landed: AutoSummonTile;
  hazardTiles?: Map<string, string> | null;
  lavaDmg?: number;
  spikeDmg?: number;
}): AutoSummonLanding {
  if (!shouldApplyAutoSummonLandingHazard(opts)) {
    return emptyAutoSummonLanding();
  }
  const kind = autoSummonHazardKindAt(opts.hazardTiles, opts.landed);
  const lavaDmg =
    kind === "lava"
      ? Math.max(
          0,
          Math.floor(Number(opts.lavaDmg) || rollAutoSummonLavaDamage()),
        )
      : 0;
  const spikeDmg =
    kind === "spikes"
      ? Math.max(
          0,
          Math.floor(Number(opts.spikeDmg) || rollAutoSummonSpikeDamage()),
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
 * last summon in the store so victory / applyRewards never fire.
 */
export function hpAfterAutoSummonLanding(
  currentHp: number,
  landing: AutoSummonLanding,
): { newHp: number; lethal: boolean } {
  return enemyHpAfterHazardDamage(currentHp, landing.hpLoss);
}

export type AutoSummonExecutorMove = {
  newPosition: AutoSummonTile;
  hp: number;
};

/**
 * WX restack after `executeSummonAction`: tax `result.newPosition`, not
 * the decided destination. Executor currently returns pre-move HP.
 */
export function applyAutoSummonLandingAfterExecutor(opts: {
  origin: AutoSummonTile;
  result: AutoSummonExecutorMove;
  hazardTiles?: Map<string, string> | null;
  lavaDmg?: number;
  spikeDmg?: number;
}): {
  newHp: number;
  lethal: boolean;
  landing: AutoSummonLanding;
} {
  const landing = planAutoSummonLanding({
    origin: opts.origin,
    landed: opts.result.newPosition,
    hazardTiles: opts.hazardTiles,
    lavaDmg: opts.lavaDmg,
    spikeDmg: opts.spikeDmg,
  });
  const hp = hpAfterAutoSummonLanding(opts.result.hp, landing);
  return { ...hp, landing };
}
