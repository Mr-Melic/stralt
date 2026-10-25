/**
 * Pack-enemy `decideCaster` wounded-retreat vs in-range Strike.
 *
 * Rook `buildEnemyKit` z≥1 is `[physical_attack, spell-iron-skin]`. Pawn
 * z≥1 is `[physical_attack, spell-venom-strike]`. `inferArchetype` marks
 * those as caster because Iron Skin (range 3) / Venom (range 2) are the
 * ranged LoS majority over Strike (range 1). `decideCaster` returns
 * `intent: "retreat"` whenever `hpFrac < ENEMY_RETREAT_HP_PCT` (0.3)
 * *before* `pickBestDamageSpell`, so advertised Strike never fires on a
 * wounded mid/late rook or pawn even when a living hostile sits in
 * Chebyshev `Number(range)` (1). WorldExploration pack execute would
 * still fire that Strike if decide returned `kind: "cast"` (no HP check).
 *
 * Pawn z=0 / rook z=0 are Strike-only chargers (no 30% retreat). Knight
 * Strike-only is the flanker leftover (`#1087`). Bishop / queen / king
 * Frost leftovers stay on `#1054` / `#1081` / `#1085`. Healthy adjacent
 * Strike already casts (`#762`). Iron Skin decide stays `#978`. Venom /
 * Inferno 0-damage DoT stays `#967`. This sidecar only fills the
 * *caster* retreat hole when the live damage>0 pick is Strike: live
 * would walk away, Strike is in Chebyshev of a living hostile, decide
 * Strike instead of retreat.
 *
 * Do not steal Frost (`#1054` / `#1081` / `#1085`), flanker Strike
 * (`#1087`), Inferno (`#967` / `#1039`), Iron Skin (`#978`), Slow, Drain
 * (`#921`), empty-tile Strike leave, or player Strike copy. Chebyshev vs
 * `Number(spell.range)` — do not switch to `spellRangeBase` (would
 * rebalance). No LoS (WX pack execute skips it; melee range 1 is
 * adjacent). No AP (WX does not debit enemy AP).
 *
 * Unique vs `#762` / `#921` / `#967` / `#978` / `#985` / `#989` / `#1026` /
 * `#1033` / `#1034` / `#1039` / `#1054` / `#1081` / `#1085` / `#1087`.
 * WorldExploration / enemyAI / summonExecutor / targeting / spellEngine /
 * statusEffects left untouched so older open PRs stay merge-clean. Restack
 * the `decideCaster` retreat branch onto
 * `pickWxEnemyCasterRetreatStrikeSpell` after those PRs land.
 */

import { ENEMY_RETREAT_HP_PCT } from "../data/gameConstants.ts";
import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  enemyCastRangeOk,
  enemySpellRange,
  enemySpellRequiresLos,
} from "./targeting.ts";

export type WxEnemyCasterRetreatStrikeSpell =
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
      | "isPhysical"
      | "lineOfSight"
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
      isPhysical?: boolean | null;
      lineOfSight?: boolean | null;
    };

export type WxEnemyCasterRetreatStrikeTile = CasterPosition;

export type WxEnemyCasterRetreatStrikeOccupant =
  WxEnemyCasterRetreatStrikeTile & {
    id: string;
    hp?: number;
    maxHp?: number;
    side?: string;
    isSummon?: boolean;
    pieceType?: string;
  };

/**
 * Live `inferArchetype` healer test: `spellType === "heal"` or
 * `healAmount > 0` on assignedSpells (king Rallying Cry still infers
 * healer when `usableByEnemy: false` drops it from availableSpells).
 */
export function isWxEnemyCasterRetreatStrikeHealKitSpell(
  spell: WxEnemyCasterRetreatStrikeSpell,
): boolean {
  return (
    (spell.spellType ?? "damage") === "heal" ||
    Number(spell.healAmount ?? 0) > 0
  );
}

export function wxEnemyCasterRetreatStrikeKitIsHealer(
  spells: readonly WxEnemyCasterRetreatStrikeSpell[],
): boolean {
  return spells.some((s) => isWxEnemyCasterRetreatStrikeHealKitSpell(s));
}

/**
 * Live `inferArchetype` caster arm: ranged (`enemySpellRange > 1`)
 * majority with default LoS, after the healer check. Rook z≥1 Iron
 * Skin and pawn z≥1 Venom hit this before knight / charger.
 */
export function wxEnemyCasterRetreatStrikeKitIsCaster(
  spells: readonly WxEnemyCasterRetreatStrikeSpell[],
): boolean {
  if (wxEnemyCasterRetreatStrikeKitIsHealer(spells)) return false;
  const ranged = spells.filter(
    (s) => enemySpellRange(s as Pick<SpellConfig, "range">) > 1,
  );
  const melee = spells.filter(
    (s) => enemySpellRange(s as Pick<SpellConfig, "range">) <= 1,
  );
  return (
    ranged.length > 0 &&
    ranged.length >= melee.length &&
    ranged.some((s) =>
      enemySpellRequiresLos({
        lineOfSight: s.lineOfSight ?? undefined,
      }),
    )
  );
}

/**
 * Strike leftover identity: `damage > 0` melee (`Number(range) <= 1`)
 * without an advertised debuff. Frost is range 4 + `debuffStat === "mp"`
 * (`#1054` / `#1081` / `#1085`). Slow is 0-damage. Frost Nova is
 * `hitsMultiple`. Inferno / Iron Skin stay on `#967` / `#978`. Knight
 * Strike-only is `#1087`.
 */
export function isWxEnemyCasterRetreatStrikeSpell(
  spell: WxEnemyCasterRetreatStrikeSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) <= 0) return false;
  if (enemySpellRange(spell as Pick<SpellConfig, "range">) > 1) return false;
  if (spell.debuffStat) return false;
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

/** 0-damage DoT leftover identity (#967 / #1039). */
export function isWxEnemyCasterRetreatStrikeBlockedDotSpell(
  spell: WxEnemyCasterRetreatStrikeSpell,
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
export function isWxEnemyCasterRetreatStrikeBlockedBuffSpell(
  spell: WxEnemyCasterRetreatStrikeSpell,
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

export function wxEnemyCasterRetreatStrikeRange(
  spell: WxEnemyCasterRetreatStrikeSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

/** Live picker / WX range half: Chebyshev vs `Number(spell.range)`. No LoS. */
export function wxEnemyCasterRetreatStrikeInRange(
  origin: WxEnemyCasterRetreatStrikeTile,
  targetCell: WxEnemyCasterRetreatStrikeTile,
  spell: WxEnemyCasterRetreatStrikeSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/** Same `Number(s.damage) > 0` filter live `pickBestDamageSpell` uses. */
export function wxEnemyCasterRetreatStrikeLivePickBestDamageSpellSelects(
  spell: WxEnemyCasterRetreatStrikeSpell,
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

export function wxEnemyCasterRetreatStrikeLivePickBestDamageSpell<
  T extends WxEnemyCasterRetreatStrikeSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyCasterRetreatStrikeTile;
  targetCell: WxEnemyCasterRetreatStrikeTile;
}): T | null {
  const inRange = args.availableSpells.filter(
    (s) =>
      wxEnemyCasterRetreatStrikeLivePickBestDamageSpellSelects(s) &&
      wxEnemyCasterRetreatStrikeInRange(args.origin, args.targetCell, s),
  );
  if (inRange.length === 0) return null;
  return inRange.reduce((best, s) =>
    Number(s.damage ?? 0) > Number(best.damage ?? 0) ? s : best,
  );
}

/** Byte-for-byte live `hpFrac`: `hp / max(1, maxHp)` clamped to [0, 1]. */
export function wxEnemyCasterRetreatStrikeHpFrac(unit: {
  hp?: number;
  maxHp?: number;
}): number {
  const hp = Number(unit.hp ?? 0);
  const max = Math.max(1, Number(unit.maxHp ?? 0));
  const frac = hp / max;
  if (!Number.isFinite(frac)) return 0;
  return Math.max(0, Math.min(1, frac));
}

export function wxEnemyCasterRetreatStrikeWouldRetreat(caster: {
  hp?: number;
  maxHp?: number;
}): boolean {
  if (!isAliveCombatant({ hp: caster.hp ?? 0 })) return false;
  return wxEnemyCasterRetreatStrikeHpFrac(caster) < ENEMY_RETREAT_HP_PCT;
}

/**
 * Live `decideCaster` retreat return: HP below 30%, a threat exists,
 * the kit infers caster (ranged LoS majority), and it is not a healer
 * (healers never reach this branch — `#985` / `#1034` / `#1039` /
 * `#1085`). Knight Strike-only never infers caster (`#1087`).
 */
export function wxEnemyCasterLiveWouldRetreatForStrike(args: {
  assignedSpells?: readonly WxEnemyCasterRetreatStrikeSpell[];
  availableSpells: readonly WxEnemyCasterRetreatStrikeSpell[];
  caster: WxEnemyCasterRetreatStrikeOccupant;
  opponents: readonly WxEnemyCasterRetreatStrikeOccupant[];
}): boolean {
  const kit = args.assignedSpells ?? args.availableSpells;
  if (wxEnemyCasterRetreatStrikeKitIsHealer(kit)) return false;
  if (!wxEnemyCasterRetreatStrikeKitIsCaster(kit)) return false;
  if (args.opponents.length === 0) return false;
  return wxEnemyCasterRetreatStrikeWouldRetreat(args.caster);
}

/**
 * Unique leftover: when live would retreat and Strike is the live
 * `pickBestDamageSpell` dest, pick that Strike. Returns null when live
 * damage>0 is empty (Poison / Inferno / Iron Skin stay on `#967` /
 * `#978`), when Frost / Drain win the damage pick (`#1054` / `#921`),
 * when the kit is not a caster (pawn/rook z=0 charger, knight flanker),
 * or when a heal kit still drives healer leftovers.
 */
export function pickWxEnemyCasterRetreatStrikeSpell<
  T extends WxEnemyCasterRetreatStrikeSpell,
>(args: {
  assignedSpells?: readonly T[];
  availableSpells: readonly T[];
  origin: WxEnemyCasterRetreatStrikeTile;
  targetCell: WxEnemyCasterRetreatStrikeTile;
  opponents: readonly WxEnemyCasterRetreatStrikeOccupant[];
  caster: WxEnemyCasterRetreatStrikeOccupant;
}): T | null {
  if (
    !wxEnemyCasterLiveWouldRetreatForStrike({
      assignedSpells: args.assignedSpells,
      availableSpells: args.availableSpells,
      caster: args.caster,
      opponents: args.opponents,
    })
  ) {
    return null;
  }
  const live = wxEnemyCasterRetreatStrikeLivePickBestDamageSpell({
    availableSpells: args.availableSpells,
    origin: args.origin,
    targetCell: args.targetCell,
  });
  if (!live || !isWxEnemyCasterRetreatStrikeSpell(live)) return null;
  return live;
}

export function isWxEnemyCasterRetreatStrikeHostile(args: {
  occupant: WxEnemyCasterRetreatStrikeOccupant;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.casterSide;
}

export function canExecuteWxEnemyCasterRetreatStrikeCast(args: {
  spell: WxEnemyCasterRetreatStrikeSpell;
  assignedSpells?: readonly WxEnemyCasterRetreatStrikeSpell[];
  availableSpells?: readonly WxEnemyCasterRetreatStrikeSpell[];
  origin: WxEnemyCasterRetreatStrikeTile;
  targetCell: WxEnemyCasterRetreatStrikeTile;
  occupant: WxEnemyCasterRetreatStrikeOccupant | null;
  opponents: readonly WxEnemyCasterRetreatStrikeOccupant[];
  caster: WxEnemyCasterRetreatStrikeOccupant;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isWxEnemyCasterRetreatStrikeSpell(args.spell)) return false;
  const available = args.availableSpells ?? [args.spell];
  if (
    pickWxEnemyCasterRetreatStrikeSpell({
      assignedSpells: args.assignedSpells,
      availableSpells: available,
      origin: args.origin,
      targetCell: args.targetCell,
      opponents: args.opponents,
      caster: args.caster,
    }) == null
  ) {
    return false;
  }
  if (
    !wxEnemyCasterRetreatStrikeInRange(args.origin, args.targetCell, args.spell)
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
  return isWxEnemyCasterRetreatStrikeHostile({
    occupant: args.occupant,
    casterSide: args.casterSide,
  });
}

/** Alias so decide and the WX damage branch cannot fork. */
export function shouldDecideWxEnemyCasterRetreatStrikeCast(
  args: Parameters<typeof canExecuteWxEnemyCasterRetreatStrikeCast>[0],
): boolean {
  return canExecuteWxEnemyCasterRetreatStrikeCast(args);
}

export function wxEnemyCasterRetreatStrikeHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
