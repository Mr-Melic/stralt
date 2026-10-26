/**
 * Player-controlled summon walk landing tax.
 *
 * Enemy apply (WorldExploration ~16872) charges lava 8–15 + Burning,
 * spikes 5–10, and ice Frozen after `newX !== origin`. Auto-summon AI
 * MOVE is the same miss (#758 `executeSummonAction`). Canvas control
 * (`applyControlledSummonWalk`, mouse + touch) only writes
 * `resolveControlledSummonMoveDest` + MP — then may slide off a sealed
 * cut. #728 advertised `combatantLandingHazard` for that path but shipped
 * End Turn gates only.
 *
 * Unique extra vs:
 * - #758 `planAutoSummonLanding`: AI executor MOVE. This path is the
 *   player-control dest resolver (mouse/touch share one helper).
 * - #754 `planSwapLandings`: Swap is a teleport. Player dest also charges
 *   Void Rift. Neither dest slides after occupancy unseal on this path.
 * - #728: tax the **landed** cell after `resolveControlledSummonMoveDest`,
 *   not the clicked destination. A dest-only tax would burn a wolf that
 *   slid off lava, or miss one that slid onto spikes.
 *
 * Match enemy landing, not player walk: no Thorned Ground (path length),
 * no Void Rift. Do not restack WorldExploration / occupancy /
 * summonExecutor / autoSummonLandingHazard / swapLandingHazards.
 */

import { enemyHpAfterHazardDamage } from "./battleSetup.ts";

export type ControlledSummonTile = { x: number; y: number };

export type ControlledSummonLanding = {
  lavaDmg: number;
  spikeDmg: number;
  frozen: boolean;
  burning: boolean;
  hpLoss: number;
};

const EMPTY_LANDING: ControlledSummonLanding = {
  lavaDmg: 0,
  spikeDmg: 0,
  frozen: false,
  burning: false,
  hpLoss: 0,
};

export function emptyControlledSummonLanding(): ControlledSummonLanding {
  return { ...EMPTY_LANDING };
}

export function sameControlledSummonTile(
  a: ControlledSummonTile,
  b: ControlledSummonTile,
): boolean {
  return a.x === b.x && a.y === b.y;
}

/**
 * Enemy apply only taxes when the committed dest differs from origin.
 * A rejected / same-tile click must not re-tax a unit already standing
 * on lava.
 */
export function shouldApplyControlledSummonLandingHazard(opts: {
  origin: ControlledSummonTile;
  landed: ControlledSummonTile | null;
}): boolean {
  if (!opts.landed) return false;
  return !sameControlledSummonTile(opts.origin, opts.landed);
}

export type ControlledSummonHazardKind = "lava" | "ice" | "spikes";

export function controlledSummonHazardKindAt(
  tiles: Map<string, string> | undefined | null,
  dest: ControlledSummonTile,
): ControlledSummonHazardKind | undefined {
  if (!tiles) return undefined;
  const raw = tiles.get(`${dest.x},${dest.y}`);
  if (raw === "lava" || raw === "ice" || raw === "spikes") return raw;
  return undefined;
}

/** Same roll as WorldExploration enemy lava landing (8–15). */
export function rollControlledSummonLavaDamage(
  rand: () => number = Math.random,
): number {
  const r = Number(rand());
  const u = Number.isFinite(r) ? Math.min(1, Math.max(0, r)) : 0;
  return 8 + Math.floor(u * 8);
}

/** Same roll as WorldExploration enemy spike landing (5–10). */
export function rollControlledSummonSpikeDamage(
  rand: () => number = Math.random,
): number {
  const r = Number(rand());
  const u = Number.isFinite(r) ? Math.min(1, Math.max(0, r)) : 0;
  return 5 + Math.floor(u * 6);
}

/**
 * Tax the cell the control walk actually occupied after occupancy slide.
 * Requested dest is intentionally not read — slide can leave lava.
 */
export function planControlledSummonLanding(opts: {
  origin: ControlledSummonTile;
  landed: ControlledSummonTile | null;
  hazardTiles?: Map<string, string> | null;
  lavaDmg?: number;
  spikeDmg?: number;
}): ControlledSummonLanding {
  if (!shouldApplyControlledSummonLandingHazard(opts)) {
    return emptyControlledSummonLanding();
  }
  const landed = opts.landed;
  if (!landed) return emptyControlledSummonLanding();
  const kind = controlledSummonHazardKindAt(opts.hazardTiles, landed);
  const lavaDmg =
    kind === "lava"
      ? Math.max(
          0,
          Math.floor(Number(opts.lavaDmg) || rollControlledSummonLavaDamage()),
        )
      : 0;
  const spikeDmg =
    kind === "spikes"
      ? Math.max(
          0,
          Math.floor(
            Number(opts.spikeDmg) || rollControlledSummonSpikeDamage(),
          ),
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
export function hpAfterControlledSummonLanding(
  currentHp: number,
  landing: ControlledSummonLanding,
): { newHp: number; lethal: boolean } {
  return enemyHpAfterHazardDamage(currentHp, landing.hpLoss);
}

/**
 * WX restack after `resolveControlledSummonMoveDest`: tax `landed`, not
 * the clicked destination. Live `applyControlledSummonWalk` currently
 * returns only a boolean and never changes HP.
 *
 * Mouse `handleCanvasClick` and touch `onTouchEnd` both call
 * `applyControlledSummonWalk` — one helper covers both input paths.
 */
export function applyControlledSummonLandingAfterWalk(opts: {
  origin: ControlledSummonTile;
  landed: ControlledSummonTile | null;
  currentHp: number;
  hazardTiles?: Map<string, string> | null;
  lavaDmg?: number;
  spikeDmg?: number;
}): {
  newHp: number;
  lethal: boolean;
  landing: ControlledSummonLanding;
  moved: boolean;
} {
  const moved = shouldApplyControlledSummonLandingHazard({
    origin: opts.origin,
    landed: opts.landed,
  });
  const landing = planControlledSummonLanding({
    origin: opts.origin,
    landed: opts.landed,
    hazardTiles: opts.hazardTiles,
    lavaDmg: opts.lavaDmg,
    spikeDmg: opts.spikeDmg,
  });
  const hp = hpAfterControlledSummonLanding(opts.currentHp, landing);
  return { ...hp, landing, moved };
}
