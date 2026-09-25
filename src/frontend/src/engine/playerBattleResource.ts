/**
 * Immediate player AP/MP pool delta when a resource buff/debuff lands.
 *
 * Walk / cast spend `currentBattleAp` / `currentBattleMp`. Haste (mp +2,
 * duration 1) and Drain Courage (ap −1, duration 1) only wrote an
 * ActiveEffect. Duration ticks at the *start* of the player's next turn
 * *before* restore, so a duration-1 row expires before getStatModifier
 * can change the pool. Swift Boots already bumps the live MP pool;
 * spell-applied AP/MP must too or the advertised resource never arrives.
 *
 * RES/DMG/CHC stay effect-list only (read at damage time). Enemy and
 * summon targets are unchanged — their walk budget is not this pool.
 *
 * Own file so #369's `modifiedResourcePool` restack is not concatenated.
 */

export type PlayerBattleResourceEffect = {
  targetId?: string;
  type?: string;
  stat?: string;
  modifier?: unknown;
};

export function playerBattleResourceDelta(effect: PlayerBattleResourceEffect): {
  ap: number;
  mp: number;
} {
  if (effect.targetId !== "player") return { ap: 0, mp: 0 };
  if (effect.type !== "buff" && effect.type !== "debuff") {
    return { ap: 0, mp: 0 };
  }
  const stat = effect.stat;
  if (stat !== "ap" && stat !== "mp") return { ap: 0, mp: 0 };
  const raw = Math.trunc(Number(effect.modifier));
  const delta = Number.isFinite(raw) ? raw : 0;
  if (delta === 0) return { ap: 0, mp: 0 };
  return stat === "ap" ? { ap: delta, mp: 0 } : { ap: 0, mp: delta };
}

/** Floor at 0 so a duration-1 AP drain cannot go negative. */
export function nextBattleResourceAfterDelta(
  current: number,
  delta: number,
): number {
  const cur = Math.max(0, Math.floor(Number(current) || 0));
  const raw = Math.trunc(Number(delta));
  const add = Number.isFinite(raw) ? raw : 0;
  return Math.max(0, cur + add);
}
