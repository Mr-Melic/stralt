/**
 * engine/dustMotes.ts
 *
 * Pure ambient dust-mote seed / recycle / cap math. WorldExploration still
 * owns:
 *   - dustMotesRef / dustFrameRef
 *   - the AO map-id gate that currently triggers seeding
 *   - RAF physics, fade, bound bounce, and canvas draw
 *   - clearing motes on cleanupMap and battle start
 *
 * Live cap policies — do not merge them:
 *   - map-change: if already seeded and over cap, keep the FIRST 40
 *     (`slice(0, DUST_MOTE_CAP)`)
 *   - RAF: if motes piled up between cleanupMap calls, keep the LAST 40
 *     (`slice(-DUST_MOTE_CAP)`)
 *
 * Seed vs recycle also differ: seed rolls a random `life` in `[0, maxLife)`;
 * recycle always restarts at `life = 0` and draws `maxLife` last. Do not
 * unify the rng stream order.
 */

export const DUST_MOTE_CAP = 40;

export type DustMote = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
};

export type DustMoteRng = () => number;

/**
 * `min(40, 18 + floor(rng * 8))`. Live seed never reaches the cap through
 * this formula (18–25); the cap is defensive for the map-change trim.
 */
export function dustMoteSeedCount(rng: DustMoteRng): number {
  return Math.min(DUST_MOTE_CAP, 18 + Math.floor(rng() * 8));
}

/** First-map / empty-roster mote. `life` is a random point in the lifespan. */
export function createSeedDustMote(
  mapPxW: number,
  mapPxH: number,
  rng: DustMoteRng,
): DustMote {
  const maxLife = 180 + Math.floor(rng() * 120);
  return {
    x: (rng() - 0.5) * mapPxW,
    y: (rng() - 0.5) * mapPxH,
    vx: (rng() - 0.5) * 0.3,
    vy: (rng() - 0.5) * 0.3,
    size: 1.5 + rng() * 1.5,
    alpha: 0,
    life: Math.floor(rng() * maxLife),
    maxLife,
  };
}

/**
 * End-of-life respawn. Mutates in place, matching the RAF `else` branch.
 * `life` is 0; `maxLife` is drawn after position / velocity / size.
 */
export function recycleDustMote(
  mote: DustMote,
  mapPxW: number,
  mapPxH: number,
  rng: DustMoteRng = Math.random,
): void {
  mote.x = (rng() - 0.5) * mapPxW;
  mote.y = (rng() - 0.5) * mapPxH;
  mote.vx = (rng() - 0.5) * 0.3;
  mote.vy = (rng() - 0.5) * 0.3;
  mote.size = 1.5 + rng() * 1.5;
  mote.alpha = 0;
  mote.life = 0;
  mote.maxLife = 180 + Math.floor(rng() * 120);
}

export function seedDustMotes(
  mapPxW: number,
  mapPxH: number,
  rng: DustMoteRng,
): DustMote[] {
  const count = dustMoteSeedCount(rng);
  const motes: DustMote[] = [];
  for (let i = 0; i < count; i++) {
    motes.push(createSeedDustMote(mapPxW, mapPxH, rng));
  }
  return motes;
}

/** Map-change overflow: keep the first 40. */
export function clipDustMotesKeepFirst(motes: readonly DustMote[]): DustMote[] {
  return motes.slice(0, DUST_MOTE_CAP);
}

/** Per-frame overflow: keep the last 40. */
export function clipDustMotesKeepLast(motes: readonly DustMote[]): DustMote[] {
  return motes.slice(-DUST_MOTE_CAP);
}

/**
 * Map-id gate body. Empty roster seeds; over-cap trims keep-first; otherwise
 * the same array is returned so the WX ref identity is unchanged.
 */
export function resolveDustMotesOnMapChange(
  existing: DustMote[],
  mapPxW: number,
  mapPxH: number,
  rng: DustMoteRng = Math.random,
): DustMote[] {
  if (existing.length === 0) {
    return seedDustMotes(mapPxW, mapPxH, rng);
  }
  if (existing.length > DUST_MOTE_CAP) {
    return clipDustMotesKeepFirst(existing);
  }
  return existing;
}
