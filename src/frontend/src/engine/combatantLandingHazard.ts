/**
 * Map hazard landing damage for combatants (enemies and summons).
 *
 * Enemy AI apply already charges lava / spikes / ice when a unit lands on a
 * hazard tile (WorldExploration enemy hazard block). Player-controlled summon
 * walks (`applyControlledSummonWalk`) and the summon executor path update
 * position only — so a wolf can park on lava that would burn an enemy.
 *
 * Pure helper: same formulas as the enemy apply layer. Callers pass `rng`
 * (default Math.random). Do not change the ranges — only share them.
 */

export type LandingHazardKind = "lava" | "spikes" | "ice" | string;

export type LandingHazardEffect =
  | {
      kind: "lava";
      hpDamage: number;
      burning: { duration: number; dotDamagePerTurn: number };
    }
  | {
      kind: "spikes";
      hpDamage: number;
    }
  | {
      kind: "ice";
      hpDamage: 0;
      frozenMp: { modifier: number; duration: number };
    };

/** Enemy / player lava step: 8–15 inclusive. */
export function lavaLandingHpDamage(rng: () => number = Math.random): number {
  const r = Number(rng());
  const unit = Number.isFinite(r) ? Math.min(1, Math.max(0, r)) : 0;
  return 8 + Math.floor(unit * 8);
}

/** Enemy / player spike step: 5–10 inclusive. */
export function spikeLandingHpDamage(rng: () => number = Math.random): number {
  const r = Number(rng());
  const unit = Number.isFinite(r) ? Math.min(1, Math.max(0, r)) : 0;
  return 5 + Math.floor(unit * 6);
}

/**
 * Resolve the hazard under a newly occupied tile.
 * Unknown / empty kinds → null (no damage, no status).
 */
export function combatantLandingHazard(
  hazardKind: LandingHazardKind | null | undefined,
  rng: () => number = Math.random,
): LandingHazardEffect | null {
  if (hazardKind === "lava") {
    return {
      kind: "lava",
      hpDamage: lavaLandingHpDamage(rng),
      burning: { duration: 3, dotDamagePerTurn: 3 },
    };
  }
  if (hazardKind === "spikes") {
    return {
      kind: "spikes",
      hpDamage: spikeLandingHpDamage(rng),
    };
  }
  if (hazardKind === "ice") {
    return {
      kind: "ice",
      hpDamage: 0,
      frozenMp: { modifier: -2, duration: 2 },
    };
  }
  return null;
}

/**
 * True when a summon (control or AI executor) landing must apply the same
 * hazard contract as the enemy apply layer. Origin === dest is a no-op.
 */
export function shouldApplySummonLandingHazard(opts: {
  moved: boolean;
  hazardKind: LandingHazardKind | null | undefined;
}): boolean {
  if (opts.moved !== true) return false;
  return combatantLandingHazard(opts.hazardKind, () => 0) != null;
}
