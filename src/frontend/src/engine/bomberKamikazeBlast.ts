/**
 * Bomber kamikaze decide vs `executeSummonAction` applyCast splash.
 *
 * `decideSummonBomber` counts cluster targets with Chebyshev
 * `AI_KAMIKAZE_BLAST_RADIUS` (2) and detonates Inferno on the densest
 * center. Inferno is a single-target DoT (`areaRadius` 0, `damage` 0),
 * so applyCast's `Number(spell.areaRadius ?? 0)` splash never fires and
 * the bomber suicide (`hp = 0`) lives only on the `damage > 0` branch.
 * A decided radius-2 cluster therefore spends AP on a primary DoT and
 * leaves neighbors untouched.
 *
 * This module is that shared blast gate: kamikaze radius, living
 * opposite-side splash, and self-detonate on a spent Inferno even when
 * `damage` is 0. Do not write `areaRadius: 2` onto Inferno (would
 * rebalance the player kit). AP + Chebyshev cast range stay in
 * `summonKitDecideExecute` (#762). enemyAI / summonExecutor /
 * WorldExploration are left untouched so older open PRs stay
 * merge-clean (#432 execute range/AoE liveness, #762 kit AP+range).
 */

import {
  AI_KAMIKAZE_BLAST_RADIUS,
  AI_KAMIKAZE_LOW_HP_PCT,
  AI_KAMIKAZE_MIN_TARGETS,
} from "../data/gameConstants.ts";
import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  chebyshevOnBoard,
  enemyCastRangeOk,
} from "./targeting.ts";

export type BomberBlastCell = CasterPosition;

export type BomberBlastOccupant = BomberBlastCell & {
  id: string;
  hp?: number;
  side?: string;
};

export type BomberInfernoSpell =
  | Pick<SpellConfig, "range" | "areaRadius" | "damage">
  | {
      range?: unknown;
      areaRadius?: unknown;
      damage?: unknown;
    };

/** Decide's hardcoded kamikaze radius. Never Inferno `areaRadius`. */
export function bomberKamikazeBlastRadius(): number {
  return AI_KAMIKAZE_BLAST_RADIUS;
}

/**
 * Execute splash radius. Bomber always uses the kamikaze constant so
 * Inferno's 0 cannot fork from decide. Non-bomber kits keep catalog
 * `areaRadius` (Frost Nova 2, Strike 0) — do not steal #432.
 */
export function resolveBomberExecuteBlastRadius(
  spell: BomberInfernoSpell,
  isBomber: boolean,
): number {
  if (isBomber) return bomberKamikazeBlastRadius();
  return Math.max(0, Math.floor(Number(spell.areaRadius) || 0));
}

/** Same scan as private `countTargetsInBlast` in enemyAI. */
export function countBomberClusterTargets(
  center: BomberBlastCell,
  opponents: readonly BomberBlastCell[],
): number {
  const radius = bomberKamikazeBlastRadius();
  let count = 0;
  for (const opponent of opponents) {
    if (chebyshevOnBoard(center, opponent) <= radius) count += 1;
  }
  return count;
}

/**
 * Splash may hit a living opposite-side occupant inside the kamikaze
 * radius of the primary. The primary is the Inferno DoT target, not
 * splash. Corpses must not take a second hit after kill detection.
 */
export function canExecuteBomberKamikazeSplash(args: {
  primary: BomberBlastOccupant;
  victim: BomberBlastOccupant;
  casterSide: "player" | "enemy";
}): boolean {
  if (args.victim.id === args.primary.id) return false;
  if (!isAliveCombatant({ hp: args.victim.hp ?? 0 })) return false;
  const side = args.victim.side === "player" ? "player" : "enemy";
  if (side === args.casterSide) return false;
  return (
    chebyshevOnBoard(args.primary, args.victim) <= bomberKamikazeBlastRadius()
  );
}

/** Alias so decide's cluster membership and execute splash cannot fork. */
export function shouldDecideBomberClusterVictim(
  args: Parameters<typeof canExecuteBomberKamikazeSplash>[0],
): boolean {
  return canExecuteBomberKamikazeSplash(args);
}

/**
 * Decide detonates when the cluster is dense enough (or HP is critical)
 * and the center is inside Inferno Chebyshev range. Execute must use
 * the same primary gate; splash uses {@link canExecuteBomberKamikazeSplash}.
 */
export function canExecuteBomberKamikazePrimary(args: {
  origin: BomberBlastCell;
  primary: BomberBlastCell;
  spell: BomberInfernoSpell;
  clusterCount: number;
  hpFrac: number;
}): boolean {
  const eligible =
    args.clusterCount >= AI_KAMIKAZE_MIN_TARGETS ||
    args.hpFrac < AI_KAMIKAZE_LOW_HP_PCT;
  if (!eligible) return false;
  return enemyCastRangeOk(
    args.origin,
    args.primary,
    args.spell as Pick<SpellConfig, "range">,
  );
}

/** Alias so decide detonate and execute primary cannot fork. */
export function shouldDecideBomberDetonate(
  args: Parameters<typeof canExecuteBomberKamikazePrimary>[0],
): boolean {
  return canExecuteBomberKamikazePrimary(args);
}

/**
 * applyCast only sets `hp = 0` inside `damage > 0`. Inferno damage is 0
 * (DoT). A spent bomber Inferno must still detonate the caster.
 */
export function bomberKamikazeDetonatesSelf(args: {
  isBomber: boolean;
  spentCast: boolean;
}): boolean {
  return args.isBomber === true && args.spentCast === true;
}

export function bomberKamikazeExecuteDetonatesOnInferno(
  spell: BomberInfernoSpell,
  isBomber: boolean,
): boolean {
  if (isBomber !== true) return false;
  // Inferno `damage` is 0 (DoT). applyCast suicide must not require > 0.
  return Number(spell.damage ?? 0) >= 0;
}

export function bomberHighlightedClusterVictimIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
