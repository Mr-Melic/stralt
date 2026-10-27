/**
 * Player-controlled summon Inferno remaining never ticks on a summon turn.
 *
 * Catalog Inferno is the only summon-kit row with `cooldown: 3`. Player-bar
 * CD ticks at player-turn start (`spellCooldownsRef` forEach `cd - 1`,
 * `#708`). Control-mode summon dispatch ticks plague / Void Rift / DoT /
 * AP-MP budget and never remaining. `castControlledSummonSpell` never
 * writes remaining (`#1206`). Kit select never consults remaining
 * (`#1211`). Tile dest never consults remaining (`#1205`). Auto-AI
 * `applyCast` never writing CD is `#1166`.
 *
 * Unique fire: remaining 3 at a player-side summon-turn start ticks to 2;
 * remaining 1 ticks to 0 (ready); remaining 0 stays ready. Live summon
 * dispatch leaves 3 as 3. Player-turn tick of `spellCooldownsRef` is the
 * player-bar clock, not this leftover. Arm after a legal dest is `#1206`.
 * Kit select is `#1211`. Tile remaining empty-set is `#1205`. Catalog
 * bomber `summonUnitDef.ap` is 1, which cannot pay Inferno 5 — unique fire
 * needs `currentAp >= 5` only as context; do not rebalance (`#762`).
 *
 * Do not restack WorldExploration / SummonControlPanel / summonControlCast
 * / targeting / spellEngine / enemyAI / summonExecutor / statusEffects.
 * Restack control-mode dispatch onto `executeSummonControlCooldownTick`
 * after older combat PRs land.
 */

import {
  isSpellOnCooldown,
  nextSpellCooldownTurns,
} from "../utils/challengeCompletion.ts";

export type SummonControlCooldownTickSpell = {
  id?: string;
  range?: unknown;
  apCost?: unknown;
  spellType?: string | null;
  damage?: unknown;
  healAmount?: unknown;
  buffStat?: string | null;
  debuffStat?: string | null;
  dotDamage?: unknown;
  dotDamagePerTurn?: unknown;
  dotDuration?: unknown;
  effectType?: string | null;
  isDotSpell?: boolean | null;
  areaRadius?: unknown;
  hitsMultiple?: boolean | null;
  aoe?: boolean | null;
  isSummon?: boolean | null;
  isSwap?: boolean | null;
  isMark?: boolean | null;
  isMirror?: boolean | null;
  isBarrier?: boolean | null;
  cooldown?: unknown;
};

export type SummonControlCooldownTickArgs = {
  isPlayerSideSummonTurn: boolean;
  remaining?: unknown;
  spell: SummonControlCooldownTickSpell;
};

export type SummonControlCooldownTickExecute = {
  remaining: number;
};

function isZeroDamageDot(spell: SummonControlCooldownTickSpell): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (spell.buffStat) return false;
  if (spell.debuffStat) return false;
  const dpt = Number(spell.dotDamagePerTurn ?? spell.dotDamage ?? 0);
  const duration = Number(spell.dotDuration ?? 0);
  if (dpt <= 0 || duration <= 0) return false;
  return spell.isDotSpell === true || spell.effectType === "dot";
}

/**
 * Inferno leftover identity: 0-upfront-damage DoT at Chebyshev 3 with
 * advertised cooldown > 0. Poison is range 4. Venom is range 2. Strike
 * has damage 10. Slow is an MP debuff with no ticks.
 */
export function isSummonControlCooldownTickSpell(
  spell: SummonControlCooldownTickSpell,
): boolean {
  if (!isZeroDamageDot(spell)) return false;
  if (spell.hitsMultiple || spell.aoe) return false;
  if (Math.max(0, Math.floor(Number(spell.areaRadius ?? 0))) > 0) {
    return false;
  }
  if (spell.isSummon || spell.isSwap || spell.isMark || spell.isMirror) {
    return false;
  }
  if (spell.isBarrier) return false;
  if (summonControlCooldownTickTurns(spell) <= 0) return false;
  return Number(spell.range) === 3;
}

/** Advertised lock length. Catalog Inferno is 3. */
export function summonControlCooldownTickTurns(
  spell: SummonControlCooldownTickSpell,
): number {
  return nextSpellCooldownTurns(spell.cooldown);
}

/**
 * Same clock as live player-bar tick: values greater than 1 decrement;
 * 1 becomes ready (0). Invalid / missing remaining fail-closed to ready
 * so a NaN lock cannot mint a permanent CD.
 */
export function tickSummonControlCooldownRemaining(remaining: unknown): number {
  const n = Math.max(0, Math.floor(Number(remaining) || 0));
  if (!Number.isFinite(n)) return 0;
  if (n > 1) return n - 1;
  return 0;
}

export function summonControlCooldownTickIsReady(remaining?: unknown): boolean {
  return !isSpellOnCooldown(remaining);
}

/**
 * Live control-mode summon dispatch never decrements remaining. Always
 * true: proven by the WX source scan in the test file.
 */
export function liveWxSummonControlTurnTicksCooldown(): boolean {
  return false;
}

/**
 * Live player-turn start ticks `spellCooldownsRef`. That is the player
 * bar (`#708`), not this leftover.
 */
export function liveWxPlayerTurnTicksSpellCooldowns(): boolean {
  return true;
}

/**
 * Live `castControlledSummonSpell` never writes remaining. Arm leftover
 * is `#1206`.
 */
export function wxSummonControlCastWritesRemaining(): boolean {
  return false;
}

/**
 * Tick highlight. Player-side summon turn + Inferno remaining already
 * locked. Auto-AI / enemy-summon / player-turn / remaining 0 cannot.
 */
export function shouldTickSummonControlCooldown(
  args: SummonControlCooldownTickArgs,
): boolean {
  if (args.isPlayerSideSummonTurn !== true) return false;
  if (!isSummonControlCooldownTickSpell(args.spell)) return false;
  return isSpellOnCooldown(args.remaining);
}

export function canExecuteSummonControlCooldownTick(
  args: SummonControlCooldownTickArgs,
): boolean {
  return shouldTickSummonControlCooldown(args);
}

export function summonControlCooldownTickHighlightedIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Commit advertised summon-turn remaining decrement. Player-turn clock,
 * auto-AI, enemy-summon, and a missing / ready lock return null.
 */
export function executeSummonControlCooldownTick(
  args: SummonControlCooldownTickArgs,
): SummonControlCooldownTickExecute | null {
  if (!canExecuteSummonControlCooldownTick(args)) return null;
  return {
    remaining: tickSummonControlCooldownRemaining(args.remaining),
  };
}
