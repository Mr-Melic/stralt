/**
 * Chain Lightning bounce hops.
 *
 * Primary targeting / `hitsMultiple` use Chebyshev (`chebyshevOnBoard`).
 * Bounce hops have always used Manhattan from the primary tile — changing
 * that would re-order Frost/Chain victims (diagonal (1,1) vs cardinal (2,0)).
 * Keep Manhattan so execute matches the historic splash list.
 *
 * Hostility is the same live-hostile filter the primary list uses
 * (`isActiveHostile`): corpses and player-side summons cannot take a hop.
 */

import { isActiveHostile } from "./battleSetup.ts";

export type BounceCell = { x: number; y: number };

export type BounceOccupant = BounceCell & {
  id: string;
  hp?: number;
  side?: "player" | "enemy";
  isSummon?: boolean;
};

/** Manhattan hop from the primary hit. Not Chebyshev — do not merge. */
export function bounceHopDistance(a: BounceCell, b: BounceCell): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function chainBounceVictimAllowed(
  victim: BounceOccupant,
  primaryId: string,
): boolean {
  if (victim.id === primaryId) return false;
  return isActiveHostile({
    hp: victim.hp ?? 0,
    side: victim.side,
    isSummon: victim.isSummon,
  });
}

/**
 * Nearest living hostiles for bounce splash. Count 0 / invalid → none.
 * A highlighted legal primary still executes via `getAoETargets`; hops
 * from that tile cannot include an illegal occupant.
 */
export function pickChainBounceTargets<T extends BounceOccupant>(
  primary: BounceCell & { id: string },
  occupants: readonly T[],
  bounceCount: unknown,
): T[] {
  const n = Math.floor(Number(bounceCount) || 0);
  if (!Number.isFinite(n) || n <= 0) return [];
  return occupants
    .filter((row) => chainBounceVictimAllowed(row, primary.id))
    .sort(
      (a, b) => bounceHopDistance(a, primary) - bounceHopDistance(b, primary),
    )
    .slice(0, n);
}
