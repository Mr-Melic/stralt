/**
 * Player-controlled summon AP/MP budget after turn-start ticks.
 *
 * Walk / kit spend `currentAp` / `currentMp`. Control mode resets those
 * from `maxAp` / `maxMp` only (`summonTurnBudget`), so Slow (mp −2,
 * duration 2) and ally Haste (mp +2, duration 1) never changed the live
 * pool. Player restore already adds `getStatModifier` after the tick;
 * #596 bumps the player pool on apply. Summon budget did neither.
 *
 * Duration ≥ 2: remaining effects after `tickNonDotEffects` still apply —
 * pass `getStatModifier` into `nextSummonTurnBudget`.
 * Duration 1: the tick expires the row before budget. Record the delta
 * at apply (control-mode player summons only) and add it once.
 *
 * Does not change tick order, RAF, map gen, or damage math.
 */

export type SummonBattleResourceEffect = {
  id?: string;
  effectName?: string;
  targetId?: string;
  type?: string;
  stat?: string;
  modifier?: unknown;
  duration?: unknown;
};

export type SummonBattleResourceMods = {
  ap?: unknown;
  mp?: unknown;
};

export function isPlayerSummonCombatant(
  unit: { isSummon?: boolean; side?: string } | null | undefined,
): boolean {
  return unit?.isSummon === true && unit?.side === "player";
}

function finiteTruncDelta(value: unknown): number {
  const raw = Math.trunc(Number(value));
  return Number.isFinite(raw) ? raw : 0;
}

function resourceDeltaFromEffect(effect: SummonBattleResourceEffect): {
  ap: number;
  mp: number;
} {
  if (effect.type !== "buff" && effect.type !== "debuff") {
    return { ap: 0, mp: 0 };
  }
  const stat = effect.stat;
  if (stat !== "ap" && stat !== "mp") return { ap: 0, mp: 0 };
  const delta = finiteTruncDelta(effect.modifier);
  if (delta === 0) return { ap: 0, mp: 0 };
  return stat === "ap" ? { ap: delta, mp: 0 } : { ap: 0, mp: delta };
}

function duration1CarryKey(effect: SummonBattleResourceEffect): string {
  const name = String(effect.effectName ?? "").trim();
  if (name.length > 0) return name;
  const id = String(effect.id ?? "").trim();
  return id.length > 0 ? id : "unnamed";
}

/** effectName (or id) → delta. Replace-or-refresh matches mergeIncomingEffect. */
type CarryRows = Map<string, { ap: number; mp: number }>;

const duration1CarryByTarget = new Map<string, CarryRows>();

export function clearSummonDuration1ResourceCarry(): void {
  duration1CarryByTarget.clear();
}

/**
 * Remember a duration-1 AP/MP row so the next control-mode budget can
 * apply it after the turn-start tick drops the effect.
 */
export function recordSummonDuration1Resource(
  effect: SummonBattleResourceEffect,
  isPlayerSummon: boolean,
): void {
  if (!isPlayerSummon) return;
  const targetId = String(effect.targetId ?? "").trim();
  if (targetId.length === 0 || targetId === "player") return;
  if (Math.floor(Number(effect.duration) || 0) !== 1) return;
  const delta = resourceDeltaFromEffect(effect);
  if (delta.ap === 0 && delta.mp === 0) return;
  const rows = duration1CarryByTarget.get(targetId) ?? new Map();
  rows.set(duration1CarryKey(effect), delta);
  duration1CarryByTarget.set(targetId, rows);
}

/** Sum and drop duration-1 carry for this summon's budget refresh. */
export function consumeSummonDuration1Resource(summonId: string): {
  ap: number;
  mp: number;
} {
  const id = String(summonId ?? "").trim();
  const rows = duration1CarryByTarget.get(id);
  duration1CarryByTarget.delete(id);
  if (!rows) return { ap: 0, mp: 0 };
  let ap = 0;
  let mp = 0;
  for (const delta of rows.values()) {
    ap += delta.ap;
    mp += delta.mp;
  }
  return { ap, mp };
}

/**
 * Per-turn AP/MP for a player-controlled summon. `mods` is remaining
 * `getStatModifier` after the tick plus consumed duration-1 carry.
 */
export function nextSummonTurnBudget(
  summon: { maxAp?: unknown; maxMp?: unknown },
  mods?: SummonBattleResourceMods,
): { currentAp: number; currentMp: number } {
  const maxAp = Math.max(0, Math.floor(Number(summon.maxAp) || 0));
  const maxMp = Math.max(0, Math.floor(Number(summon.maxMp) || 0));
  const apMod = finiteTruncDelta(mods?.ap);
  const mpMod = finiteTruncDelta(mods?.mp);
  return {
    currentAp: Math.max(0, maxAp + apMod),
    currentMp: Math.max(0, maxMp + mpMod),
  };
}
