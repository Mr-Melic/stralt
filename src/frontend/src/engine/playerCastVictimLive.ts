/**
 * Preview vs effect-resolution for occupant-required player casts.
 *
 * Highlight (`isTileCastableLive`) paints every in-range `targetType: "enemy"`
 * / area-expansion tile. Execute already aborts — no AP — when:
 *   - single-target drain (`effectType === "drain"`, not `hitsMultiple`) has
 *     no `isActiveHostile` on the tile (`resolvePlayerCast` drain guard),
 *   - `hitsMultiple` `getAoETargets` builds an empty list (Chebyshev from
 *     the clicked tile, same radius as the live `effectiveRange`).
 *
 * Those painted cells were not executable. This module is the single extra
 * live-gate check so a highlighted tile can resolve and an illegal one
 * cannot. Damage numbers, drainPercent, and Strike / Mark empty rings are
 * unchanged (those kits are not this predicate).
 *
 * Do not import targeting.ts here (cycle: the live gate calls this).
 */

import { isActiveHostile } from "./battleSetup.ts";

export type PlayerCastVictimSpell = {
  effectType?: string;
  hitsMultiple?: boolean;
  hitsAllies?: boolean;
};

export type PlayerCastVictimOccupant = {
  x: number;
  y: number;
  hp?: number;
  isSummon?: boolean;
  side?: "player" | "enemy";
  id?: string;
};

export function playerVictimChebyshev(
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

/**
 * Same occupant rule as `resolvePlayerCast` / `getAoETargets`:
 * `effectType === "drain"` and not `hitsMultiple`. Lifesteal Nova stays on
 * the AoE-list path (empty anchors with a nearby hostile remain legal).
 */
export function playerSingleTargetDrainRequiresOccupant(
  spell: PlayerCastVictimSpell,
): boolean {
  return spell.effectType === "drain" && spell.hitsMultiple !== true;
}

export function playerDrainLiveHostileAt(
  tile: { x: number; y: number },
  combatants: readonly PlayerCastVictimOccupant[],
): boolean {
  return combatants.some(
    (e) =>
      e.x === tile.x &&
      e.y === tile.y &&
      isActiveHostile({
        hp: e.hp ?? 0,
        isSummon: e.isSummon,
        side: e.side,
        id: e.id,
      }),
  );
}

/**
 * Same radius + hostility filter `getAoETargets` uses for `hitsMultiple`
 * (`hitsMultipleIncludesOccupant` + `isActiveHostile`). Player-as-ally uses
 * the caster tile (player clicks / Attack Nearest origin).
 */
export function playerHitsMultipleHasVictim(args: {
  spell: PlayerCastVictimSpell;
  click: { x: number; y: number };
  caster: { x: number; y: number };
  combatants: readonly PlayerCastVictimOccupant[];
  radius: number;
}): boolean {
  if (args.spell.hitsMultiple !== true) return false;
  const radius = args.radius;
  for (const e of args.combatants) {
    if (playerVictimChebyshev(e, args.click) > radius) continue;
    if (
      isActiveHostile({
        hp: e.hp ?? 0,
        isSummon: e.isSummon,
        side: e.side,
        id: e.id,
      })
    ) {
      return true;
    }
  }
  if (args.spell.hitsAllies === true) {
    return playerVictimChebyshev(args.caster, args.click) <= radius;
  }
  return false;
}

/**
 * Extra live reject after geometry already said yes. `null` = keep the
 * geometric ok. Must never reject a tile execute already resolves.
 */
export function playerCastEffectLiveRejectReason(args: {
  spell: PlayerCastVictimSpell;
  tile: { x: number; y: number };
  caster: { x: number; y: number };
  combatants: readonly PlayerCastVictimOccupant[];
  radius: number;
}): string | null {
  if (playerSingleTargetDrainRequiresOccupant(args.spell)) {
    if (!playerDrainLiveHostileAt(args.tile, args.combatants)) {
      return "drain_no_enemy";
    }
  }
  if (args.spell.hitsMultiple === true) {
    if (
      !playerHitsMultipleHasVictim({
        spell: args.spell,
        click: args.tile,
        caster: args.caster,
        combatants: args.combatants,
        radius: args.radius,
      })
    ) {
      return "hits_multiple_no_victim";
    }
  }
  return null;
}

export function playerCastEffectLiveResult(args: {
  geometryReason: string;
  spell: PlayerCastVictimSpell;
  tile: { x: number; y: number };
  caster: { x: number; y: number };
  combatants: readonly PlayerCastVictimOccupant[];
  radius: number;
}): { ok: boolean; reason: string } {
  const reject = playerCastEffectLiveRejectReason(args);
  if (reject) return { ok: false, reason: reject };
  return { ok: true, reason: args.geometryReason };
}
