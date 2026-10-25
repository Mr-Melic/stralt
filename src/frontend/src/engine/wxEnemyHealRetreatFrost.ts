/**
 * Pack-enemy healer fallback into `decideCaster` wounded-retreat vs
 * in-range Frost.
 *
 * King `buildEnemyKit` z>=1 is `[starter-frost, spell-rallying-cry]`.
 * `assignEnemySpells` puts Rallying Cry on `assignedSpells` even though
 * `usableByEnemy: false` drops it from WX `availableSpells`.
 * `inferArchetype` therefore marks the king a healer (`healAmount > 0`).
 * `decideHealer` then looks up `healSpell` on **available** spells, finds
 * none, skips the wounded-ally branch, and either backline-guards
 * (#1034) or falls through to `decideCaster`. `decideCaster` returns
 * `intent: "retreat"` whenever `hpFrac < ENEMY_RETREAT_HP_PCT` (0.3)
 * *before* `pickBestDamageSpell`, so advertised Frost never fires on a
 * wounded king when live would reach that fallback (solo king, or a
 * pack king already standing on the guard tile).
 *
 * #1054 is the same retreat hole for Frost **casters** (queen z=0 /
 * bishop) and explicitly yields healer kits, including assigned
 * Rallying Cry. #985 is wounded-caster self-heal when Blood Mend is
 * **available**. #1026 / #1033 are wounded-ally approach. #1034 /
 * #1039 are backline-guard while the guard cell is not the origin.
 * #1081 is caster LoS-reposition. This sidecar is the remaining
 * *healer-kit fallback-retreat* leftover: live would walk away,
 * Frost is in Chebyshev of a living hostile, decide Frost instead
 * of retreat.
 *
 * Do not steal Strike (#762), Inferno (#967 / #1033 / #1039), Iron
 * Skin (#978), Slow, Drain (#921), player Frost Bolt MP (#905), or
 * queen Blood Mend self-heal (#985). Chebyshev vs
 * `Number(spell.range)` — do not switch to `spellRangeBase` (would
 * rebalance). No LoS (WX pack execute skips it). No AP (WX does not
 * debit enemy AP).
 *
 * Unique vs #762 / #905 / #921 / #967 / #978 / #985 / #989 / #1026 /
 * #1033 / #1034 / #1039 / #1054 / #1081. WorldExploration / enemyAI /
 * summonExecutor / targeting / spellEngine / statusEffects left
 * untouched so older open PRs stay merge-clean. Restack the
 * `decideHealer` → `decideCaster` retreat fallback onto
 * `pickWxEnemyHealRetreatFrostSpell` after those PRs land.
 */

import {
  AI_BACKLINE_GUARD_DISTANCE,
  AI_BACKLINE_PROTECT_ENABLED,
  ENEMY_HEAL_ALLY_THRESHOLD_PCT,
  ENEMY_RETREAT_HP_PCT,
} from "../data/gameConstants.ts";
import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  enemyCastRangeOk,
  enemySpellRange,
} from "./targeting.ts";

export type WxEnemyHealRetreatFrostSpell =
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

export type WxEnemyHealRetreatFrostTile = CasterPosition;

export type WxEnemyHealRetreatFrostOccupant = WxEnemyHealRetreatFrostTile & {
  id: string;
  hp?: number;
  maxHp?: number;
  side?: string;
  isSummon?: boolean;
};

/**
 * Live `inferArchetype` healer test: `spellType === "heal"` or
 * `healAmount > 0` on assignedSpells (king Rallying Cry still infers
 * healer when `usableByEnemy: false` drops it from availableSpells).
 */
export function isWxEnemyHealRetreatFrostHealKitSpell(
  spell: WxEnemyHealRetreatFrostSpell,
): boolean {
  return (
    (spell.spellType ?? "damage") === "heal" ||
    Number(spell.healAmount ?? 0) > 0
  );
}

export function wxEnemyHealRetreatFrostKitIsHealer(
  spells: readonly WxEnemyHealRetreatFrostSpell[],
): boolean {
  return spells.some((s) => isWxEnemyHealRetreatFrostHealKitSpell(s));
}

/**
 * Range-0 self/ally heal that `decideHealer` uses as `healSpell`
 * (Blood Mend). Drain `healAmount` stays on #921. Rallying Cry is
 * `usableByEnemy: false` and never reaches WX `availableSpells`.
 */
export function isWxEnemyHealRetreatFrostTriggerSpell(
  spell: WxEnemyHealRetreatFrostSpell,
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

export function wxEnemyHealRetreatFrostTriggerRequiresZeroRange(
  spell: WxEnemyHealRetreatFrostSpell,
): boolean {
  return enemySpellRange(spell as Pick<SpellConfig, "range">) === 0;
}

/**
 * Frost Bolt leftover identity: `damage > 0` + advertised MP debuff.
 * Strike has no `debuffStat`. Slow is 0-damage. Frost Nova is
 * `hitsMultiple`. Inferno / Iron Skin stay on #967 / #978.
 */
export function isWxEnemyHealRetreatFrostSpell(
  spell: WxEnemyHealRetreatFrostSpell,
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

/** 0-damage DoT leftover identity (#967 / #1033 / #1039). */
export function isWxEnemyHealRetreatFrostBlockedDotSpell(
  spell: WxEnemyHealRetreatFrostSpell,
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
export function isWxEnemyHealRetreatFrostBlockedBuffSpell(
  spell: WxEnemyHealRetreatFrostSpell,
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

export function wxEnemyHealRetreatFrostRange(
  spell: WxEnemyHealRetreatFrostSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

/** Live picker / WX range half: Chebyshev vs `Number(spell.range)`. No LoS. */
export function wxEnemyHealRetreatFrostInRange(
  origin: WxEnemyHealRetreatFrostTile,
  targetCell: WxEnemyHealRetreatFrostTile,
  spell: WxEnemyHealRetreatFrostSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/** Same `Number(s.damage) > 0` filter live `pickBestDamageSpell` uses. */
export function wxEnemyHealRetreatFrostLivePickBestDamageSpellSelects(
  spell: WxEnemyHealRetreatFrostSpell,
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

export function wxEnemyHealRetreatFrostLivePickBestDamageSpell<
  T extends WxEnemyHealRetreatFrostSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyHealRetreatFrostTile;
  targetCell: WxEnemyHealRetreatFrostTile;
}): T | null {
  const inRange = args.availableSpells.filter(
    (s) =>
      wxEnemyHealRetreatFrostLivePickBestDamageSpellSelects(s) &&
      wxEnemyHealRetreatFrostInRange(args.origin, args.targetCell, s),
  );
  if (inRange.length === 0) return null;
  return inRange.reduce((best, s) =>
    Number(s.damage ?? 0) > Number(best.damage ?? 0) ? s : best,
  );
}

/** Byte-for-byte live `hpFrac`: `hp / max(1, maxHp)` clamped to [0, 1]. */
export function wxEnemyHealRetreatFrostHpFrac(unit: {
  hp?: number;
  maxHp?: number;
}): number {
  const hp = Number(unit.hp ?? 0);
  const max = Math.max(1, Number(unit.maxHp ?? 0));
  const frac = hp / max;
  if (!Number.isFinite(frac)) return 0;
  return Math.max(0, Math.min(1, frac));
}

export function wxEnemyHealRetreatFrostCasterWouldRetreat(caster: {
  hp?: number;
  maxHp?: number;
}): boolean {
  if (!isAliveCombatant({ hp: caster.hp ?? 0 })) return false;
  return wxEnemyHealRetreatFrostHpFrac(caster) < ENEMY_RETREAT_HP_PCT;
}

export function wxEnemyHealRetreatFrostCasterIsWounded(caster: {
  hp?: number;
  maxHp?: number;
}): boolean {
  if (!isAliveCombatant({ hp: caster.hp ?? 0 })) return false;
  return wxEnemyHealRetreatFrostHpFrac(caster) < ENEMY_HEAL_ALLY_THRESHOLD_PCT;
}

export function isWxEnemyHealRetreatFrostWoundedAlly(args: {
  ally: WxEnemyHealRetreatFrostOccupant;
  casterSide: "player" | "enemy";
  casterId?: string;
}): boolean {
  if (!isAliveCombatant({ hp: args.ally.hp ?? 0 })) return false;
  if (args.casterId && args.ally.id === args.casterId) return false;
  const side = args.ally.side === "player" ? "player" : "enemy";
  if (side !== args.casterSide) return false;
  return (
    wxEnemyHealRetreatFrostHpFrac(args.ally) < ENEMY_HEAL_ALLY_THRESHOLD_PCT
  );
}

export function wxEnemyHealRetreatFrostLiveHealSpell<
  T extends WxEnemyHealRetreatFrostSpell,
>(availableSpells: readonly T[]): T | undefined {
  return availableSpells.find(
    (s) => s.spellType === "heal" || Number(s.healAmount ?? 0) > 0,
  );
}

export function pickWxEnemyHealRetreatFrostTriggerSpell<
  T extends WxEnemyHealRetreatFrostSpell,
>(availableSpells: readonly T[]): T | null {
  const found = availableSpells.find(
    (s) =>
      isWxEnemyHealRetreatFrostTriggerSpell(s) &&
      wxEnemyHealRetreatFrostTriggerRequiresZeroRange(s),
  );
  return found ?? null;
}

export function wxEnemyHealRetreatFrostLiveWoundedAlly<
  T extends WxEnemyHealRetreatFrostOccupant,
>(args: {
  allies: readonly T[];
  casterSide: "player" | "enemy";
  casterId?: string;
}): T | undefined {
  const wounded = args.allies
    .filter((a) =>
      isWxEnemyHealRetreatFrostWoundedAlly({
        ally: a,
        casterSide: args.casterSide,
        casterId: args.casterId,
      }),
    )
    .sort(
      (a, b) =>
        wxEnemyHealRetreatFrostHpFrac(a) - wxEnemyHealRetreatFrostHpFrac(b),
    );
  return wounded[0];
}

/**
 * Live wounded-ally heal / approach: `healSpell` exists on available
 * spells and a wounded ally is present. Range-0 Blood Mend always
 * approaches a distinct ally — that hole is #1026 / #1033.
 */
export function wxEnemyHealLiveWouldHealOrApproachWoundedAlly(args: {
  availableSpells: readonly WxEnemyHealRetreatFrostSpell[];
  allies: readonly WxEnemyHealRetreatFrostOccupant[];
  casterSide: "player" | "enemy";
  casterId?: string;
}): boolean {
  const healSpell = wxEnemyHealRetreatFrostLiveHealSpell(args.availableSpells);
  const wounded = wxEnemyHealRetreatFrostLiveWoundedAlly({
    allies: args.allies,
    casterSide: args.casterSide,
    casterId: args.casterId,
  });
  return Boolean(healSpell && wounded);
}

/**
 * #985 leftover: live ally path did not fire, first available healSpell
 * is a range-0 self/ally heal, caster is wounded. Do not replace that
 * self-heal with Frost.
 */
export function wxEnemyHealRetreatFrostYieldsToWoundedCasterSelfHeal(args: {
  availableSpells: readonly WxEnemyHealRetreatFrostSpell[];
  allies: readonly WxEnemyHealRetreatFrostOccupant[];
  caster: WxEnemyHealRetreatFrostOccupant;
  casterSide: "player" | "enemy";
  casterId?: string;
}): boolean {
  if (wxEnemyHealLiveWouldHealOrApproachWoundedAlly(args)) return false;
  const healSpell = wxEnemyHealRetreatFrostLiveHealSpell(args.availableSpells);
  if (!healSpell || !isWxEnemyHealRetreatFrostTriggerSpell(healSpell)) {
    return false;
  }
  if (!wxEnemyHealRetreatFrostTriggerRequiresZeroRange(healSpell)) return false;
  return wxEnemyHealRetreatFrostCasterIsWounded(args.caster);
}

export function wxEnemyHealRetreatFrostIdealGuardCell(
  ward: WxEnemyHealRetreatFrostTile,
  threat: WxEnemyHealRetreatFrostTile,
): WxEnemyHealRetreatFrostTile {
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
 * to `decideCaster` — this leftover).
 */
export function wxEnemyHealLiveWouldBacklineGuardForFrost(args: {
  availableSpells: readonly WxEnemyHealRetreatFrostSpell[];
  origin: WxEnemyHealRetreatFrostTile;
  allies: readonly WxEnemyHealRetreatFrostOccupant[];
  opponents: readonly WxEnemyHealRetreatFrostOccupant[];
  casterSide: "player" | "enemy";
  casterId?: string;
}): boolean {
  if (!AI_BACKLINE_PROTECT_ENABLED) return false;
  if (args.opponents.length === 0 || args.allies.length === 0) return false;
  if (wxEnemyHealLiveWouldHealOrApproachWoundedAlly(args)) return false;
  const ward = args.allies.find((a) => a.isSummon !== true) ?? args.allies[0];
  const threat = args.opponents[0];
  if (!ward || !threat) return false;
  const guard = wxEnemyHealRetreatFrostIdealGuardCell(ward, threat);
  return guard.x !== args.origin.x || guard.y !== args.origin.y;
}

/**
 * Live `decideHealer` → `decideCaster` retreat: healer kit, HP below
 * 30%, a threat exists, and live did not take self-heal (#985),
 * approach (#1026), or backline-guard (#1034).
 */
export function wxEnemyHealLiveWouldRetreatForFrost(args: {
  assignedSpells?: readonly WxEnemyHealRetreatFrostSpell[];
  availableSpells: readonly WxEnemyHealRetreatFrostSpell[];
  origin: WxEnemyHealRetreatFrostTile;
  caster: WxEnemyHealRetreatFrostOccupant;
  allies?: readonly WxEnemyHealRetreatFrostOccupant[];
  opponents: readonly WxEnemyHealRetreatFrostOccupant[];
  casterSide?: "player" | "enemy";
}): boolean {
  const kit = args.assignedSpells ?? args.availableSpells;
  if (!wxEnemyHealRetreatFrostKitIsHealer(kit)) return false;
  if (args.opponents.length === 0) return false;
  if (!wxEnemyHealRetreatFrostCasterWouldRetreat(args.caster)) return false;
  const casterSide = args.casterSide ?? "enemy";
  const allies = args.allies ?? [];
  const share = {
    availableSpells: args.availableSpells,
    allies,
    casterSide,
    casterId: args.caster.id,
  };
  if (
    wxEnemyHealRetreatFrostYieldsToWoundedCasterSelfHeal({
      ...share,
      caster: args.caster,
    })
  ) {
    return false;
  }
  if (wxEnemyHealLiveWouldHealOrApproachWoundedAlly(share)) return false;
  if (
    wxEnemyHealLiveWouldBacklineGuardForFrost({
      availableSpells: args.availableSpells,
      origin: args.origin,
      allies,
      opponents: args.opponents,
      casterSide,
      casterId: args.caster.id,
    })
  ) {
    return false;
  }
  return true;
}

/**
 * Unique leftover: when live would retreat a healer-kit fallback and
 * Frost is the live `pickBestDamageSpell` dest, pick that Frost.
 * Returns null when live damage>0 is empty (Poison / Inferno / Iron
 * Skin stay on #967 / #978), when Strike / Drain win the damage pick
 * (#762 / #921), when a Frost caster still drives #1054, or when
 * #985 / #1026 / #1034 own the dest.
 */
export function pickWxEnemyHealRetreatFrostSpell<
  T extends WxEnemyHealRetreatFrostSpell,
>(args: {
  assignedSpells?: readonly T[];
  availableSpells: readonly T[];
  origin: WxEnemyHealRetreatFrostTile;
  targetCell: WxEnemyHealRetreatFrostTile;
  allies?: readonly WxEnemyHealRetreatFrostOccupant[];
  opponents: readonly WxEnemyHealRetreatFrostOccupant[];
  caster: WxEnemyHealRetreatFrostOccupant;
  casterSide?: "player" | "enemy";
}): T | null {
  if (
    !wxEnemyHealLiveWouldRetreatForFrost({
      assignedSpells: args.assignedSpells,
      availableSpells: args.availableSpells,
      origin: args.origin,
      caster: args.caster,
      allies: args.allies,
      opponents: args.opponents,
      casterSide: args.casterSide,
    })
  ) {
    return null;
  }
  const live = wxEnemyHealRetreatFrostLivePickBestDamageSpell({
    availableSpells: args.availableSpells,
    origin: args.origin,
    targetCell: args.targetCell,
  });
  if (!live || !isWxEnemyHealRetreatFrostSpell(live)) return null;
  return live;
}

export function isWxEnemyHealRetreatFrostHostile(args: {
  occupant: WxEnemyHealRetreatFrostOccupant;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.casterSide;
}

export function canExecuteWxEnemyHealRetreatFrostCast(args: {
  spell: WxEnemyHealRetreatFrostSpell;
  assignedSpells?: readonly WxEnemyHealRetreatFrostSpell[];
  availableSpells?: readonly WxEnemyHealRetreatFrostSpell[];
  origin: WxEnemyHealRetreatFrostTile;
  targetCell: WxEnemyHealRetreatFrostTile;
  occupant: WxEnemyHealRetreatFrostOccupant | null;
  allies?: readonly WxEnemyHealRetreatFrostOccupant[];
  opponents: readonly WxEnemyHealRetreatFrostOccupant[];
  caster: WxEnemyHealRetreatFrostOccupant;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isWxEnemyHealRetreatFrostSpell(args.spell)) return false;
  const available = args.availableSpells ?? [args.spell];
  if (
    pickWxEnemyHealRetreatFrostSpell({
      assignedSpells: args.assignedSpells,
      availableSpells: available,
      origin: args.origin,
      targetCell: args.targetCell,
      allies: args.allies,
      opponents: args.opponents,
      caster: args.caster,
      casterSide: args.casterSide,
    }) == null
  ) {
    return false;
  }
  if (
    !wxEnemyHealRetreatFrostInRange(args.origin, args.targetCell, args.spell)
  ) {
    return false;
  }
  if (!args.occupant) return false;
  if (
    args.occupant.x !== args.targetCell.x ||
    args.occupant.y !== args.targetCell.y
  ) {
    return false;
  }
  return isWxEnemyHealRetreatFrostHostile({
    occupant: args.occupant,
    casterSide: args.casterSide,
  });
}

/** Alias so decide and the WX damage branch cannot fork. */
export function shouldDecideWxEnemyHealRetreatFrostCast(
  args: Parameters<typeof canExecuteWxEnemyHealRetreatFrostCast>[0],
): boolean {
  return canExecuteWxEnemyHealRetreatFrostCast(args);
}

export function wxEnemyHealRetreatFrostHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
