/**
 * Chessboard Lich MAP_ROTATE / MIRROR_INVERT write `newPositions` for
 * every occupant and `newBossPosition` (map center). WorldExploration
 * (~16022 / ~16226) only commits the boss dest, then returns before
 * the enemy landing-hazard block (~16872). The player and minions stay
 * on their pre-rotate tiles. A last-hostile pawn can sit off lava and
 * take another turn; victory / applyRewards wait. A player who should
 * have landed on lava keeps Untouchable.
 *
 * Unique extra vs:
 * - #763 `planBossAbilityLanding`: one boss dest (TELEPORT / ADVANCE /
 *   KNIGHT_JUMP). This taxes every occupant in `newPositions`.
 * - #754 `planSwapLandings`: two-unit Swap teleport. Player dest also
 *   charges Void Rift — same player contract here, N occupants.
 * - #758 `planAutoSummonLanding`: one summon after occupancy slide.
 * - #728 claimed `combatantLandingHazard` (not shipped; End Turn only).
 *
 * Thorned Ground is path-length. A board transform is not a walk.
 * Plan against the pre-ability map. MAP_ROTATE / MIRROR_INVERT do not
 * plant hazards. Do not restack WorldExploration / useBossSystem.
 */

import { enemyHpAfterHazardDamage, voidRiftWalkDamage } from "./battleSetup.ts";

export const BOARD_TRANSFORM_SIZE = 16;
export const BOARD_TRANSFORM_BOSS_CENTER = { x: 7, y: 7 } as const;

export type BoardTile = { x: number; y: number };
export type BoardTransformKind = "MAP_ROTATE" | "MIRROR_INVERT";
export type BoardOccupantRole = "player" | "boss" | "enemy";
export type BoardHazardKind = "lava" | "ice" | "spikes";

export type BoardOccupant = {
  id: string;
  origin: BoardTile;
  hp: number;
  role: BoardOccupantRole;
};

export type BoardUnitLanding = {
  lavaDmg: number;
  spikeDmg: number;
  riftDmg: number;
  frozen: boolean;
  burning: boolean;
  hpLoss: number;
};

export type BoardTransformCommit = {
  id: string;
  role: BoardOccupantRole;
  dest: BoardTile;
  hp: number;
  lethal: boolean;
  landing: BoardUnitLanding;
  moved: boolean;
};

const EMPTY_LANDING: BoardUnitLanding = {
  lavaDmg: 0,
  spikeDmg: 0,
  riftDmg: 0,
  frozen: false,
  burning: false,
  hpLoss: 0,
};

export function emptyBoardUnitLanding(): BoardUnitLanding {
  return { ...EMPTY_LANDING };
}

export function sameBoardTile(a: BoardTile, b: BoardTile): boolean {
  return a.x === b.x && a.y === b.y;
}

/** useBossSystem applyMapRotate: newX = N-1-y, newY = x. */
export function rotateBoardTileClockwise(
  tile: BoardTile,
  n: number = BOARD_TRANSFORM_SIZE,
): BoardTile {
  return { x: n - 1 - tile.y, y: tile.x };
}

/** useBossSystem applyMirrorInvert: newX = N-1-x, newY = y. */
export function mirrorBoardTileHorizontal(
  tile: BoardTile,
  n: number = BOARD_TRANSFORM_SIZE,
): BoardTile {
  return { x: n - 1 - tile.x, y: tile.y };
}

export function transformBoardTile(
  kind: BoardTransformKind,
  tile: BoardTile,
): BoardTile {
  return kind === "MAP_ROTATE"
    ? rotateBoardTileClockwise(tile)
    : mirrorBoardTileHorizontal(tile);
}

/**
 * Same map as applyMapRotate / applyMirrorInvert: player + non-boss
 * enemies. Boss dest is `newBossPosition` (center), not this record.
 */
export function buildBoardTransformPositions(opts: {
  kind: BoardTransformKind;
  player: { id: string; origin: BoardTile };
  others?: readonly { id: string; origin: BoardTile }[];
}): Record<string, BoardTile> {
  const positions: Record<string, BoardTile> = {
    [opts.player.id]: transformBoardTile(opts.kind, opts.player.origin),
  };
  for (const other of opts.others ?? []) {
    positions[other.id] = transformBoardTile(opts.kind, other.origin);
  }
  return positions;
}

export function shouldApplyBoardTransformLanding(opts: {
  origin: BoardTile;
  dest: BoardTile;
}): boolean {
  return !sameBoardTile(opts.origin, opts.dest);
}

export function destForBoardOccupant(opts: {
  occupant: BoardOccupant;
  newBossPosition?: BoardTile | null;
  newPositions?: Record<string, BoardTile> | null;
}): BoardTile {
  if (opts.occupant.role === "boss") {
    const dest = opts.newBossPosition;
    if (dest && Number.isFinite(dest.x) && Number.isFinite(dest.y)) {
      return { x: dest.x, y: dest.y };
    }
    return opts.occupant.origin;
  }
  const fromMap = opts.newPositions?.[opts.occupant.id];
  if (fromMap && Number.isFinite(fromMap.x) && Number.isFinite(fromMap.y)) {
    return { x: fromMap.x, y: fromMap.y };
  }
  return opts.occupant.origin;
}

export function boardHazardKindAt(
  tiles: Map<string, string> | undefined | null,
  dest: BoardTile,
): BoardHazardKind | undefined {
  if (!tiles) return undefined;
  const raw = tiles.get(`${dest.x},${dest.y}`);
  if (raw === "lava" || raw === "ice" || raw === "spikes") return raw;
  return undefined;
}

/** Same roll as WorldExploration player / enemy lava step (8–15). */
export function rollBoardTransformLavaDamage(
  rand: () => number = Math.random,
): number {
  const r = Number(rand());
  const u = Number.isFinite(r) ? Math.min(1, Math.max(0, r)) : 0;
  return 8 + Math.floor(u * 8);
}

/** Same roll as WorldExploration player / enemy spike step (5–10). */
export function rollBoardTransformSpikeDamage(
  rand: () => number = Math.random,
): number {
  const r = Number(rand());
  const u = Number.isFinite(r) ? Math.min(1, Math.max(0, r)) : 0;
  return 5 + Math.floor(u * 6);
}

export function planBoardOccupantLanding(opts: {
  origin: BoardTile;
  dest: BoardTile;
  includeVoidRift: boolean;
  hazardTiles?: Map<string, string> | null;
  voidRiftActive?: boolean;
  riftTile?: BoardTile | null;
  lavaDmg?: number;
  spikeDmg?: number;
}): BoardUnitLanding {
  if (!shouldApplyBoardTransformLanding(opts)) {
    return emptyBoardUnitLanding();
  }
  const kind = boardHazardKindAt(opts.hazardTiles, opts.dest);
  const lavaDmg =
    kind === "lava"
      ? Math.max(
          0,
          Math.floor(Number(opts.lavaDmg) || rollBoardTransformLavaDamage()),
        )
      : 0;
  const spikeDmg =
    kind === "spikes"
      ? Math.max(
          0,
          Math.floor(Number(opts.spikeDmg) || rollBoardTransformSpikeDamage()),
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

function hpAfterRoleLanding(
  role: BoardOccupantRole,
  currentHp: number,
  landing: BoardUnitLanding,
): { newHp: number; lethal: boolean } {
  if (role === "player") {
    const hp = Number.isFinite(currentHp) ? currentHp : 0;
    const newHp = Math.max(0, hp - landing.hpLoss);
    return { newHp, lethal: landing.hpLoss > 0 && newHp === 0 };
  }
  return enemyHpAfterHazardDamage(currentHp, landing.hpLoss);
}

/**
 * Production WX (~16022 / ~16226): write boss dest, keep everyone
 * else on origin, skip landing tax. That is the miss this helper closes.
 */
export function wxBoardTransformCommitWithoutOccupants(opts: {
  occupants: readonly BoardOccupant[];
  newBossPosition?: BoardTile | null;
}): BoardTransformCommit[] {
  return opts.occupants.map((occupant) => {
    const dest =
      occupant.role === "boss"
        ? destForBoardOccupant({
            occupant,
            newBossPosition: opts.newBossPosition,
          })
        : occupant.origin;
    const moved = shouldApplyBoardTransformLanding({
      origin: occupant.origin,
      dest,
    });
    return {
      id: occupant.id,
      role: occupant.role,
      dest,
      hp: occupant.hp,
      lethal: false,
      landing: emptyBoardUnitLanding(),
      moved,
    };
  });
}

export function applyBoardTransformLandingsAfterCommit(opts: {
  occupants: readonly BoardOccupant[];
  newBossPosition?: BoardTile | null;
  newPositions?: Record<string, BoardTile> | null;
  hazardTiles?: Map<string, string> | null;
  voidRiftActive?: boolean;
  riftTile?: BoardTile | null;
  lavaDmg?: number;
  spikeDmg?: number;
}): BoardTransformCommit[] {
  return opts.occupants.map((occupant) => {
    const dest = destForBoardOccupant({
      occupant,
      newBossPosition: opts.newBossPosition,
      newPositions: opts.newPositions,
    });
    const moved = shouldApplyBoardTransformLanding({
      origin: occupant.origin,
      dest,
    });
    if (!moved) {
      return {
        id: occupant.id,
        role: occupant.role,
        dest,
        hp: occupant.hp,
        lethal: false,
        landing: emptyBoardUnitLanding(),
        moved,
      };
    }
    const landing = planBoardOccupantLanding({
      origin: occupant.origin,
      dest,
      includeVoidRift: occupant.role === "player",
      hazardTiles: opts.hazardTiles,
      voidRiftActive: opts.voidRiftActive,
      riftTile: opts.riftTile,
      lavaDmg: opts.lavaDmg,
      spikeDmg: opts.spikeDmg,
    });
    const hp = hpAfterRoleLanding(occupant.role, occupant.hp, landing);
    return {
      id: occupant.id,
      role: occupant.role,
      dest,
      hp: hp.newHp,
      lethal: hp.lethal,
      landing,
      moved,
    };
  });
}

/** Lava / spikes use the in-battle recorder; rift uses the walk one. */
export function boardTransformPlayerChallengeHp(player: BoardUnitLanding): {
  lavaAndSpike: number;
  riftDmg: number;
} {
  return {
    lavaAndSpike: player.lavaDmg + player.spikeDmg,
    riftDmg: player.riftDmg,
  };
}

export function boardTransformPlayerFailsUntouchable(
  player: BoardUnitLanding,
): boolean {
  return player.hpLoss > 0;
}

export function hostilesRemainingAfterBoardTransform(
  commits: readonly BoardTransformCommit[],
  priorHostiles: number,
): number {
  const killed = commits.filter((c) => c.lethal && c.role !== "player").length;
  const prior = Number.isFinite(priorHostiles)
    ? Math.max(0, Math.floor(priorHostiles))
    : 0;
  return Math.max(0, prior - killed);
}
