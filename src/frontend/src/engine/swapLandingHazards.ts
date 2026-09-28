/**
 * Official Swap (`spell-swap`) is a teleport. Walk rAF and enemy AI already
 * tax lava / spikes / ice on arrival; Void Rift taxes the player dest only
 * (`battleWalkHazardDamages`). `swapPositions` used to copy coordinates and
 * skip those hooks, so Untouchable / under-damage could persist after the
 * player occupied a lava or rift tile a walk would have failed.
 *
 * Thorned Ground is path-length (extra tiles after the first). A teleport
 * is not a walk — do not charge it here.
 *
 * Damage ranges match WorldExploration walk / enemy landing. Do not change
 * those numbers.
 */

import { voidRiftWalkDamage } from "./battleSetup.ts";
import { type SwapTile, sameSwapTile } from "./swapTeleport.ts";

export type MapHazardKind = "lava" | "ice" | "spikes";

export type SwapUnitLanding = {
  lavaDmg: number;
  spikeDmg: number;
  riftDmg: number;
  frozen: boolean;
  burning: boolean;
  hpLoss: number;
};

export type SwapLandingPlan = {
  player: SwapUnitLanding;
  enemy: SwapUnitLanding;
};

const EMPTY_LANDING: SwapUnitLanding = {
  lavaDmg: 0,
  spikeDmg: 0,
  riftDmg: 0,
  frozen: false,
  burning: false,
  hpLoss: 0,
};

export function emptySwapUnitLanding(): SwapUnitLanding {
  return { ...EMPTY_LANDING };
}

export function hazardKindAt(
  tiles: Map<string, string> | undefined | null,
  dest: SwapTile,
): MapHazardKind | undefined {
  if (!tiles) return undefined;
  const raw = tiles.get(`${dest.x},${dest.y}`);
  if (raw === "lava" || raw === "ice" || raw === "spikes") return raw;
  return undefined;
}

/** Same roll as WorldExploration player / enemy lava step (8–15). */
export function rollLavaLandingDamage(
  rand: () => number = Math.random,
): number {
  const r = Number(rand());
  const u = Number.isFinite(r) ? Math.min(1, Math.max(0, r)) : 0;
  return 8 + Math.floor(u * 8);
}

/** Same roll as WorldExploration player / enemy spike step (5–10). */
export function rollSpikeLandingDamage(
  rand: () => number = Math.random,
): number {
  const r = Number(rand());
  const u = Number.isFinite(r) ? Math.min(1, Math.max(0, r)) : 0;
  return 5 + Math.floor(u * 6);
}

export function planUnitLanding(opts: {
  dest: SwapTile;
  hazardTiles?: Map<string, string> | null;
  includeVoidRift: boolean;
  voidRiftActive?: boolean;
  riftTile?: SwapTile | null;
  lavaDmg?: number;
  spikeDmg?: number;
}): SwapUnitLanding {
  const kind = hazardKindAt(opts.hazardTiles, opts.dest);
  const lavaDmg =
    kind === "lava"
      ? Math.max(0, Math.floor(Number(opts.lavaDmg) || rollLavaLandingDamage()))
      : 0;
  const spikeDmg =
    kind === "spikes"
      ? Math.max(
          0,
          Math.floor(Number(opts.spikeDmg) || rollSpikeLandingDamage()),
        )
      : 0;
  const riftDmg =
    opts.includeVoidRift === true && opts.voidRiftActive === true
      ? voidRiftWalkDamage(opts.dest, opts.riftTile)
      : 0;
  return {
    lavaDmg,
    spikeDmg,
    riftDmg,
    frozen: kind === "ice",
    burning: kind === "lava",
    hpLoss: lavaDmg + spikeDmg + riftDmg,
  };
}

/**
 * Player dest matches walk arrival (lava/spikes/ice + Void Rift).
 * Enemy dest matches enemy-AI landing (lava/spikes/ice only).
 */
export function planSwapLandings(opts: {
  playerDest: SwapTile;
  enemyDest: SwapTile;
  hazardTiles?: Map<string, string> | null;
  voidRiftActive?: boolean;
  riftTile?: SwapTile | null;
  playerLavaDmg?: number;
  playerSpikeDmg?: number;
  enemyLavaDmg?: number;
  enemySpikeDmg?: number;
}): SwapLandingPlan {
  if (sameSwapTile(opts.playerDest, opts.enemyDest)) {
    return {
      player: emptySwapUnitLanding(),
      enemy: emptySwapUnitLanding(),
    };
  }
  return {
    player: planUnitLanding({
      dest: opts.playerDest,
      hazardTiles: opts.hazardTiles,
      includeVoidRift: true,
      voidRiftActive: opts.voidRiftActive,
      riftTile: opts.riftTile,
      lavaDmg: opts.playerLavaDmg,
      spikeDmg: opts.playerSpikeDmg,
    }),
    enemy: planUnitLanding({
      dest: opts.enemyDest,
      hazardTiles: opts.hazardTiles,
      includeVoidRift: false,
      voidRiftActive: opts.voidRiftActive,
      riftTile: opts.riftTile,
      lavaDmg: opts.enemyLavaDmg,
      spikeDmg: opts.enemySpikeDmg,
    }),
  };
}

/** Lava / spikes use the in-battle challenge recorder; rift uses the walk one. */
export function swapLandingChallengeHp(player: SwapUnitLanding): {
  lavaAndSpike: number;
  riftDmg: number;
} {
  return {
    lavaAndSpike: player.lavaDmg + player.spikeDmg,
    riftDmg: player.riftDmg,
  };
}

export function swapLandingFailsUntouchable(player: SwapUnitLanding): boolean {
  return player.hpLoss > 0;
}
