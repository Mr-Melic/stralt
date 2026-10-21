/**
 * Invariant 11: spell behaviour uses explicit metadata, never name heuristics.
 *
 * `pickBossKitSpell` always receives `new Map()`, so the first phase-pool id
 * is decided every turn. Void Grandmaster / Starborn Queen / Lord of Static /
 * Mirror Sovereign phase 1 start with `starter-blast` (Chain Lightning):
 * `hitsMultiple: true`, `bounces: 2`, `damage: 20`, `range: 4`.
 *
 * Live WX boss-kit apply (~15813) then:
 * 1. skips the regular-enemy `inRange` gate (~16451)
 * 2. `playerTakesDamage(Number(damage))` on the primary only
 * 3. never walks `bounces` (player bounce in `castHelpers` is the established
 *    funnel — and that path only bounces when the primary is **not** the
 *    player, so a boss blast at the player never enters it)
 *
 * A decided in-range blast with two player-side summons next to the player
 * spends the kit slot and leaves the summons unhit. Advertised 50% / 25%
 * bounce damage never applies. Unique vs:
 * - #766 player bounce-from-clicked-enemy-primary
 * - #417 regular-enemy `Number(range)` (WX ~16451)
 * - #498 kit aim dest
 * - #850–#852 / #843 / #857 Swap / Mark / Mirror / buffStat / heal+buff
 * - #856 summon DoT ticks
 *
 * Sidecar only. Do not restack WX / useBossAI / castHelpers / targeting /
 * spellEngine. Restack WX kit apply onto `executeBossKitChainLightning`
 * after those PRs land.
 */

export type BossKitChainLightningSpell = {
  id?: string;
  damage?: unknown;
  range?: unknown;
  hitsMultiple?: boolean;
  bounces?: unknown;
};

export type BossKitChainLightningCell = {
  x: number;
  y: number;
};

export type BossKitChainLightningOccupant = {
  id: string;
  x: number;
  y: number;
  hp?: number;
  side?: string;
};

export type BossKitChainLightningBounce = {
  id: string;
  damage: number;
};

export type BossKitChainLightningPlan = {
  primaryId: string;
  primaryDamage: number;
  bounces: BossKitChainLightningBounce[];
};

function toNat(n: unknown, fallback = 0): number {
  const value = Math.floor(Number(n));
  return Number.isFinite(value) ? Math.max(0, value) : fallback;
}

/** Same Chebyshev the regular-enemy `inRange` gate uses (WX ~16451). */
export function bossKitChainLightningChebyshev(
  from: BossKitChainLightningCell,
  to: BossKitChainLightningCell,
): number {
  return Math.max(Math.abs(from.x - to.x), Math.abs(from.y - to.y));
}

/**
 * Player bounce sort is Manhattan from the primary (`castHelpers` ~441).
 * Keep the same metric so a restack does not invent a second distance.
 */
export function bossKitChainLightningManhattan(
  from: BossKitChainLightningCell,
  to: BossKitChainLightningCell,
): number {
  return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
}

/**
 * Catalog Chain Lightning: damage + hitsMultiple + bounces. Do not key off
 * the display name.
 */
export function shouldDecideBossKitChainLightning(
  spell: BossKitChainLightningSpell | null | undefined,
): boolean {
  if (!spell) return false;
  if (spell.hitsMultiple !== true) return false;
  if (toNat(spell.bounces) <= 0) return false;
  return toNat(spell.damage) > 0;
}

export function canExecuteBossKitChainLightning(args: {
  spell: BossKitChainLightningSpell | null | undefined;
  from: BossKitChainLightningCell;
  to: BossKitChainLightningCell;
}): boolean {
  if (!shouldDecideBossKitChainLightning(args.spell)) return false;
  const range = toNat(args.spell?.range);
  return bossKitChainLightningChebyshev(args.from, args.to) <= range;
}

/**
 * Living player-side units (controlled summons). The other Boss Rush boss
 * is an ally — do not bounce onto it. The primary (the player) is excluded
 * by id at plan time.
 */
export function isBossKitChainLightningBounceOccupant(
  occupant: BossKitChainLightningOccupant,
  primaryId: string,
): boolean {
  if (!occupant || occupant.id === primaryId) return false;
  if (occupant.side !== "player") return false;
  return toNat(occupant.hp, 1) > 0;
}

/** Player bounce uses `finalDmg * 0.5 ** (idx + 1)` (`castHelpers` ~448). */
export function bossKitChainLightningBounceDamage(
  primaryDamage: number,
  bounceIndex: number,
): number {
  return Math.floor(toNat(primaryDamage) * 0.5 ** (bounceIndex + 1));
}

function rankBounceOccupants(
  primary: BossKitChainLightningOccupant,
  occupants: readonly BossKitChainLightningOccupant[],
  bounceCount: number,
): BossKitChainLightningOccupant[] {
  return occupants
    .filter((occupant) =>
      isBossKitChainLightningBounceOccupant(occupant, primary.id),
    )
    .sort((a, b) => {
      const da = bossKitChainLightningManhattan(primary, a);
      const db = bossKitChainLightningManhattan(primary, b);
      if (da !== db) return da - db;
      return a.id.localeCompare(b.id);
    })
    .slice(0, Math.max(0, bounceCount));
}

/**
 * Full kit plan: primary damage plus advertised bounce hits. Live WX apply
 * is `liveBossKitChainLightningHits` (primary only).
 */
export function executeBossKitChainLightning(args: {
  spell: BossKitChainLightningSpell | null | undefined;
  from: BossKitChainLightningCell;
  primary: BossKitChainLightningOccupant;
  occupants?: readonly BossKitChainLightningOccupant[];
}): BossKitChainLightningPlan | null {
  if (
    !canExecuteBossKitChainLightning({
      spell: args.spell,
      from: args.from,
      to: args.primary,
    })
  ) {
    return null;
  }
  const primaryDamage = toNat(args.spell?.damage);
  const ranked = rankBounceOccupants(
    args.primary,
    args.occupants ?? [],
    toNat(args.spell?.bounces),
  );
  return {
    primaryId: args.primary.id,
    primaryDamage,
    bounces: ranked.map((occupant, idx) => ({
      id: occupant.id,
      damage: bossKitChainLightningBounceDamage(primaryDamage, idx),
    })),
  };
}

/**
 * Live WX kit apply (~15860): `playerTakesDamage(Number(damage))` only.
 * Bounce ids never enter the hit list.
 */
export function liveBossKitChainLightningHits(
  plan: BossKitChainLightningPlan | null,
): string[] {
  if (!plan) return [];
  return [plan.primaryId];
}
