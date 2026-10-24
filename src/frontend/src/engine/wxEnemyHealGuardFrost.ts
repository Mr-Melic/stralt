/**
 * Pack-enemy `decideHealer` backline-guard vs in-range Frost.
 *
 * Queen `buildEnemyKit` z>=1 is `[starter-frost, starter-heal]`.
 * `inferArchetype` marks any heal kit as healer (`assignedSpells`,
 * including king Rallying Cry even when `usableByEnemy: false` drops
 * it from WX `availableSpells`). After the wounded-ally branch,
 * `decideHealer` interposes via `backlineGuardCell` whenever
 * `AI_BACKLINE_PROTECT_ENABLED` and a distinct ally + opponent exist.
 * That move returns before `decideCaster` → `pickBestDamageSpell`, so
 * in-range Frost never fires on a healthy pack.
 *
 * #1026 is wounded-ally *approach* vs Frost (Blood Mend range 0 cannot
 * reach a distinct ally). #1033 is the same approach vs Inferno.
 * #985 is wounded-*caster* self-heal when no wounded ally exists.
 * #989 / #967 / #978 are decideCaster picker fills once the guard
 * branch is skipped (already standing on the guard tile, no allies).
 * This sidecar is the remaining *guard* leftover: live would walk to
 * the ward/threat line, Frost is in Chebyshev range of a living
 * hostile, decide Frost instead of backline-guard.
 *
 * Do not steal queen z>=2 Inferno (#1033 approach / next-cron guard),
 * rook Iron Skin (#978), Strike / Drain (#762 / #921), Slow, or
 * player Frost Bolt MP (#905). Chebyshev vs `Number(spell.range)` —
 * do not switch to `spellRangeBase` (would rebalance). No LoS (healer
 * skips LoS; WX pack execute does too). No AP (WX does not debit
 * enemy AP).
 *
 * Unique vs #692 / #757 / #762 / #905 / #924 / #967 / #978 / #985 /
 * #989 / #1026 / #1033. WorldExploration / enemyAI / summonExecutor /
 * targeting / spellEngine / statusEffects left untouched so older
 * open PRs stay merge-clean. Restack the `decideHealer` backline-guard
 * branch onto `pickWxEnemyHealGuardFrostSpell` after those PRs land.
 */

import {
  AI_BACKLINE_GUARD_DISTANCE,
  AI_BACKLINE_PROTECT_ENABLED,
  ENEMY_HEAL_ALLY_THRESHOLD_PCT,
} from "../data/gameConstants.ts";
import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  enemyCastRangeOk,
  enemySpellRange,
} from "./targeting.ts";

export type WxEnemyHealGuardFrostSpell =
  | Pick<
      SpellConfig,
      | "id"
      | "range"
      | "spellType"
      | "damage"
      | "targetType"
      | "healAmount"
      | "buffStat"
      | "buffModifier"
      | "buffDuration"
      | "debuffStat"
      | "debuffDuration"
      | "dotDamage"
      | "dotDamagePerTurn"
      | "dotDuration"
      | "effectType"
      | "isDotSpell"
      | "areaRadius"
      | "hitsMultiple"
      | "aoe"
      | "isSummon"
      | "isSwap"
      | "isMark"
      | "isMirror"
      | "isBarrier"
    >
  | {
      id?: string;
      range?: unknown;
      spellType?: string | null;
      damage?: unknown;
      targetType?: string | null;
      healAmount?: unknown;
      buffStat?: string | null;
      buffModifier?: unknown;
      buffDuration?: unknown;
      debuffStat?: string | null;
      debuffDuration?: unknown;
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
    };

export type WxEnemyHealGuardFrostTile = CasterPosition;

export type WxEnemyHealGuardFrostOccupant = WxEnemyHealGuardFrostTile & {
  id: string;
  hp?: number;
  maxHp?: number;
  side?: string;
  isSummon?: boolean;
};

/**
 * Range-0 self/ally heal that `decideHealer` uses as `healSpell`
 * (Blood Mend). Drain `healAmount` stays on #921. Do not require
 * `buffStat` — that identity is #989 / #924 / #985.
 */
export function isWxEnemyHealGuardFrostTriggerSpell(
  spell: WxEnemyHealGuardFrostSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "heal") return false;
  if (Number(spell.healAmount ?? 0) <= 0) return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  const targetType = spell.targetType ?? "enemy";
  if (targetType !== "self" && targetType !== "ally") return false;
  if (spell.debuffStat && spell.debuffDuration) return false;
  if (
    Number(spell.dotDamage ?? 0) > 0 ||
    Number(spell.dotDamagePerTurn ?? 0) > 0
  ) {
    return false;
  }
  if (spell.hitsMultiple || spell.aoe) return false;
  if (Math.max(0, Math.floor(Number(spell.areaRadius ?? 0))) > 0) {
    return false;
  }
  if (spell.isSummon || spell.isSwap || spell.isMark || spell.isMirror) {
    return false;
  }
  if (spell.isBarrier) return false;
  return true;
}

/** Catalog Blood Mend / Rallying Cry never reach a distinct ally. */
export function wxEnemyHealGuardFrostTriggerRequiresZeroRange(
  spell: WxEnemyHealGuardFrostSpell,
): boolean {
  return enemySpellRange(spell as Pick<SpellConfig, "range">) === 0;
}

/**
 * Frost Bolt leftover identity: `damage > 0` + advertised MP debuff.
 * Strike has no `debuffStat`. Slow is 0-damage. Frost Nova is
 * `hitsMultiple`. Inferno / Iron Skin stay on #1033 / #978.
 */
export function isWxEnemyHealGuardFrostSpell(
  spell: WxEnemyHealGuardFrostSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) <= 0) return false;
  if (spell.debuffStat !== "mp") return false;
  if (!spell.debuffDuration) return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (spell.buffStat) return false;
  if (
    Number(spell.dotDamage ?? 0) > 0 ||
    Number(spell.dotDamagePerTurn ?? 0) > 0
  ) {
    return false;
  }
  if (spell.hitsMultiple || spell.aoe) return false;
  if (Math.max(0, Math.floor(Number(spell.areaRadius ?? 0))) > 0) {
    return false;
  }
  if (spell.isSummon || spell.isSwap || spell.isMark || spell.isMirror) {
    return false;
  }
  if (spell.isBarrier) return false;
  return true;
}

/** 0-damage DoT leftover identity (#967 / #1033). */
export function isWxEnemyHealGuardFrostBlockedDotSpell(
  spell: WxEnemyHealGuardFrostSpell,
): boolean {
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

/** 0-damage buff leftover identity (#978). */
export function isWxEnemyHealGuardFrostBlockedBuffSpell(
  spell: WxEnemyHealGuardFrostSpell,
): boolean {
  if (!spell.buffStat || !spell.buffDuration) return false;
  const targetType = spell.targetType ?? "enemy";
  if (targetType !== "self" && targetType !== "ally") return false;
  if ((spell.spellType ?? "damage") === "heal") return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (spell.debuffStat && spell.debuffDuration) return false;
  if (
    Number(spell.dotDamage ?? 0) > 0 ||
    Number(spell.dotDamagePerTurn ?? 0) > 0
  ) {
    return false;
  }
  return true;
}

export function wxEnemyHealGuardFrostRange(
  spell: WxEnemyHealGuardFrostSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

/** Live picker / WX range half: Chebyshev vs `Number(spell.range)`. No LoS. */
export function wxEnemyHealGuardFrostInRange(
  origin: WxEnemyHealGuardFrostTile,
  targetCell: WxEnemyHealGuardFrostTile,
  spell: WxEnemyHealGuardFrostSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/** Same `Number(s.damage) > 0` filter live `pickBestDamageSpell` uses. */
export function wxEnemyHealGuardFrostLivePickBestDamageSpellSelects(
  spell: WxEnemyHealGuardFrostSpell,
): boolean {
  const spellType = spell.spellType ?? "damage";
  const effectType = spell.effectType ?? "damage";
  return (
    Number(spell.damage ?? 0) > 0 &&
    (spellType === "damage" ||
      effectType === "damage" ||
      effectType === "drain")
  );
}

export function wxEnemyHealGuardFrostLivePickBestDamageSpell<
  T extends WxEnemyHealGuardFrostSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyHealGuardFrostTile;
  targetCell: WxEnemyHealGuardFrostTile;
}): T | null {
  const inRange = args.availableSpells.filter(
    (s) =>
      wxEnemyHealGuardFrostLivePickBestDamageSpellSelects(s) &&
      wxEnemyHealGuardFrostInRange(args.origin, args.targetCell, s),
  );
  if (inRange.length === 0) return null;
  return inRange.reduce((best, s) =>
    Number(s.damage ?? 0) > Number(best.damage ?? 0) ? s : best,
  );
}

/** Byte-for-byte live `hpFrac`: `hp / max(1, maxHp)` clamped to [0, 1]. */
export function wxEnemyHealGuardFrostHpFrac(unit: {
  hp?: number;
  maxHp?: number;
}): number {
  const hp = Number(unit.hp ?? 0);
  const max = Math.max(1, Number(unit.maxHp ?? hp));
  const frac = hp / max;
  if (!Number.isFinite(frac)) return 0;
  return Math.max(0, Math.min(1, frac));
}

export function isWxEnemyHealGuardFrostWoundedAlly(args: {
  ally: WxEnemyHealGuardFrostOccupant;
  casterSide: "player" | "enemy";
  casterId?: string;
}): boolean {
  if (!isAliveCombatant({ hp: args.ally.hp ?? 0 })) return false;
  if (args.casterId && args.ally.id === args.casterId) return false;
  const side = args.ally.side === "player" ? "player" : "enemy";
  if (side !== args.casterSide) return false;
  return wxEnemyHealGuardFrostHpFrac(args.ally) < ENEMY_HEAL_ALLY_THRESHOLD_PCT;
}

export function wxEnemyHealGuardFrostCasterIsWounded(caster: {
  hp?: number;
  maxHp?: number;
}): boolean {
  if (!isAliveCombatant({ hp: caster.hp ?? 0 })) return false;
  return wxEnemyHealGuardFrostHpFrac(caster) < ENEMY_HEAL_ALLY_THRESHOLD_PCT;
}

export function pickWxEnemyHealGuardFrostTriggerSpell<
  T extends WxEnemyHealGuardFrostSpell,
>(availableSpells: readonly T[]): T | null {
  const found = availableSpells.find(
    (s) =>
      isWxEnemyHealGuardFrostTriggerSpell(s) &&
      wxEnemyHealGuardFrostTriggerRequiresZeroRange(s),
  );
  return found ?? null;
}

/**
 * Live `decideHealer` first healSpell: `spellType === "heal"` or
 * `healAmount > 0`. Drain can win this race — do not skip it.
 */
export function wxEnemyHealGuardFrostLiveHealSpell<
  T extends WxEnemyHealGuardFrostSpell,
>(availableSpells: readonly T[]): T | undefined {
  return availableSpells.find(
    (s) => s.spellType === "heal" || Number(s.healAmount ?? 0) > 0,
  );
}

export function wxEnemyHealGuardFrostLiveWoundedAlly<
  T extends WxEnemyHealGuardFrostOccupant,
>(args: {
  allies: readonly T[];
  casterSide: "player" | "enemy";
  casterId?: string;
}): T | undefined {
  const wounded = args.allies
    .filter((a) =>
      isWxEnemyHealGuardFrostWoundedAlly({
        ally: a,
        casterSide: args.casterSide,
        casterId: args.casterId,
      }),
    )
    .sort(
      (a, b) => wxEnemyHealGuardFrostHpFrac(a) - wxEnemyHealGuardFrostHpFrac(b),
    );
  return wounded[0];
}

/**
 * Live wounded-ally heal / approach: when `healSpell` exists and a
 * wounded ally is in or out of `Number(range)`. Range-0 Blood Mend
 * always approaches a distinct ally — that hole is #1026 / #1033.
 */
export function wxEnemyHealLiveWouldHealOrApproachWoundedAlly(args: {
  availableSpells: readonly WxEnemyHealGuardFrostSpell[];
  origin: WxEnemyHealGuardFrostTile;
  allies: readonly WxEnemyHealGuardFrostOccupant[];
  casterSide: "player" | "enemy";
  casterId?: string;
}): boolean {
  const healSpell = wxEnemyHealGuardFrostLiveHealSpell(args.availableSpells);
  const wounded = wxEnemyHealGuardFrostLiveWoundedAlly({
    allies: args.allies,
    casterSide: args.casterSide,
    casterId: args.casterId,
  });
  return Boolean(healSpell && wounded);
}

/**
 * Ideal backline-guard cell: ward stepped `AI_BACKLINE_GUARD_DISTANCE`
 * toward the first opponent. Mirrors `backlineGuardCell` direction
 * math; tests use a free reachable tile so live would actually move.
 */
export function wxEnemyHealGuardFrostIdealCell(
  ward: WxEnemyHealGuardFrostTile,
  threat: WxEnemyHealGuardFrostTile,
): WxEnemyHealGuardFrostTile {
  const dx = threat.x - ward.x;
  const dy = threat.y - ward.y;
  const sx = dx > 0 ? 1 : dx < 0 ? -1 : 0;
  const sy = dy > 0 ? 1 : dy < 0 ? -1 : 0;
  return {
    x: ward.x + sx * AI_BACKLINE_GUARD_DISTANCE,
    y: ward.y + sy * AI_BACKLINE_GUARD_DISTANCE,
  };
}

/**
 * Live `decideHealer` backline-guard return: no wounded-ally heal /
 * approach, protect enabled, a ward + threat exist, and the ideal
 * guard cell is not the origin (already standing there falls through
 * to `decideCaster` — #762 / #989).
 */
export function wxEnemyHealLiveWouldBacklineGuardForFrost(args: {
  availableSpells: readonly WxEnemyHealGuardFrostSpell[];
  origin: WxEnemyHealGuardFrostTile;
  allies: readonly WxEnemyHealGuardFrostOccupant[];
  opponents: readonly WxEnemyHealGuardFrostOccupant[];
  casterSide: "player" | "enemy";
  casterId?: string;
}): boolean {
  if (!AI_BACKLINE_PROTECT_ENABLED) return false;
  if (args.opponents.length === 0 || args.allies.length === 0) return false;
  if (wxEnemyHealLiveWouldHealOrApproachWoundedAlly(args)) return false;
  const ward = args.allies.find((a) => a.isSummon !== true) ?? args.allies[0];
  const threat = args.opponents[0];
  if (!ward || !threat) return false;
  const guard = wxEnemyHealGuardFrostIdealCell(ward, threat);
  return guard.x !== args.origin.x || guard.y !== args.origin.y;
}

function wxEnemyHealGuardFrostOtherLeftoverInRange<
  T extends WxEnemyHealGuardFrostSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyHealGuardFrostTile;
  targetCell: WxEnemyHealGuardFrostTile;
}): boolean {
  return args.availableSpells.some(
    (s) =>
      (isWxEnemyHealGuardFrostBlockedDotSpell(s) ||
        isWxEnemyHealGuardFrostBlockedBuffSpell(s)) &&
      wxEnemyHealGuardFrostInRange(args.origin, args.targetCell, s),
  );
}

/**
 * #985 leftover: live ally path did not fire, first healSpell is a
 * range-0 self/ally heal, caster is wounded. Do not replace that
 * self-heal with Frost.
 */
export function wxEnemyHealGuardFrostYieldsToWoundedCasterSelfHeal(args: {
  availableSpells: readonly WxEnemyHealGuardFrostSpell[];
  origin: WxEnemyHealGuardFrostTile;
  allies: readonly WxEnemyHealGuardFrostOccupant[];
  caster: WxEnemyHealGuardFrostOccupant;
  casterSide: "player" | "enemy";
  casterId?: string;
}): boolean {
  if (wxEnemyHealLiveWouldHealOrApproachWoundedAlly(args)) return false;
  const healSpell = wxEnemyHealGuardFrostLiveHealSpell(args.availableSpells);
  if (!healSpell || !isWxEnemyHealGuardFrostTriggerSpell(healSpell)) {
    return false;
  }
  if (!wxEnemyHealGuardFrostTriggerRequiresZeroRange(healSpell)) return false;
  return wxEnemyHealGuardFrostCasterIsWounded(args.caster);
}

/**
 * Unique leftover: when live would backline-guard and Frost is in
 * range of `targetCell`, pick that Frost. Returns null when live
 * damage>0 is empty, when Inferno / Iron Skin leftovers already own
 * the dest, when a wounded ally still drives approach (#1026 /
 * #1033), or when #985 owns wounded-caster self-heal.
 */
export function pickWxEnemyHealGuardFrostSpell<
  T extends WxEnemyHealGuardFrostSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyHealGuardFrostTile;
  targetCell: WxEnemyHealGuardFrostTile;
  allies: readonly WxEnemyHealGuardFrostOccupant[];
  opponents: readonly WxEnemyHealGuardFrostOccupant[];
  caster: WxEnemyHealGuardFrostOccupant;
  casterSide: "player" | "enemy";
  casterId?: string;
}): T | null {
  if (
    wxEnemyHealGuardFrostYieldsToWoundedCasterSelfHeal({
      availableSpells: args.availableSpells,
      origin: args.origin,
      allies: args.allies,
      caster: args.caster,
      casterSide: args.casterSide,
      casterId: args.casterId,
    })
  ) {
    return null;
  }
  if (
    !wxEnemyHealLiveWouldBacklineGuardForFrost({
      availableSpells: args.availableSpells,
      origin: args.origin,
      allies: args.allies,
      opponents: args.opponents,
      casterSide: args.casterSide,
      casterId: args.casterId,
    })
  ) {
    return null;
  }
  if (wxEnemyHealGuardFrostOtherLeftoverInRange(args)) return null;
  const live = wxEnemyHealGuardFrostLivePickBestDamageSpell({
    availableSpells: args.availableSpells,
    origin: args.origin,
    targetCell: args.targetCell,
  });
  if (!live || !isWxEnemyHealGuardFrostSpell(live)) return null;
  return live;
}

export function isWxEnemyHealGuardFrostHostile(args: {
  occupant: WxEnemyHealGuardFrostOccupant;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.casterSide;
}

export function canExecuteWxEnemyHealGuardFrostCast(args: {
  spell: WxEnemyHealGuardFrostSpell;
  availableSpells?: readonly WxEnemyHealGuardFrostSpell[];
  origin: WxEnemyHealGuardFrostTile;
  targetCell: WxEnemyHealGuardFrostTile;
  occupant: WxEnemyHealGuardFrostOccupant | null;
  allies: readonly WxEnemyHealGuardFrostOccupant[];
  opponents: readonly WxEnemyHealGuardFrostOccupant[];
  caster: WxEnemyHealGuardFrostOccupant;
  casterSide: "player" | "enemy";
  casterId?: string;
}): boolean {
  if (!isWxEnemyHealGuardFrostSpell(args.spell)) return false;
  const available = args.availableSpells ?? [args.spell];
  if (
    pickWxEnemyHealGuardFrostSpell({
      availableSpells: available,
      origin: args.origin,
      targetCell: args.targetCell,
      allies: args.allies,
      opponents: args.opponents,
      caster: args.caster,
      casterSide: args.casterSide,
      casterId: args.casterId,
    }) == null
  ) {
    return false;
  }
  if (!wxEnemyHealGuardFrostInRange(args.origin, args.targetCell, args.spell)) {
    return false;
  }
  if (!args.occupant) return false;
  if (
    args.occupant.x !== args.targetCell.x ||
    args.occupant.y !== args.targetCell.y
  ) {
    return false;
  }
  return isWxEnemyHealGuardFrostHostile({
    occupant: args.occupant,
    casterSide: args.casterSide,
  });
}

/** Alias so decide and the WX damage branch cannot fork. */
export function shouldDecideWxEnemyHealGuardFrostCast(
  args: Parameters<typeof canExecuteWxEnemyHealGuardFrostCast>[0],
): boolean {
  return canExecuteWxEnemyHealGuardFrostCast(args);
}

export function wxEnemyHealGuardFrostHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
