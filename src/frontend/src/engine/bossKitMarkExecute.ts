/**
 * Boss kit Mark decide vs WorldExploration boss apply.
 *
 * `pickBossKitSpell` returns the first off-cooldown kit id. Every
 * `decide*Action` then sends `{ type: "spell", targetX/Y: player }` with
 * an empty cooldown Map, so the first pool id wins every turn.
 *
 * Pale Archivist phase 2 starts with `spell-mark`. Catalog Mark is
 * `isMark: true`, `spellType: "damage"`, `damage: 0`, `range: 4`,
 * `targetType: "enemy"`. The WX boss apply block then:
 *   1. summon when `isSummon`
 *   2. damage / drain only when `Number(damage) > 0`
 *   3. heal when `spellType === "heal"`
 *   4. `debuffStat` + `debuffDuration`
 *   5. DoT fields
 *   6. else-if spellType is NOT damage|drain|heal AND no debuff/dot
 *      AND targetType self|ally → buff
 * There is no `isMark` / `placeMark` branch (player `resolvePlayerCast`
 * already has one). A decided in-range kit Mark therefore ends the boss
 * turn with no tile mark. Player `placeMark` writes `${x},${y}` onto
 * `markedTilesRef`; this module is that execute gate.
 *
 * Chebyshev vs `Number(spell.range)` (same as WX enemy `inRange`, no
 * LoS). Do not switch to `spellRangeBase` (would rebalance). Do not steal
 * Strike damage, Slow debuff, Iron Skin buff, Swap, Mirror, or Barrier.
 * WorldExploration / useBossAI / targeting / player Mark left untouched
 * so older open PRs stay merge-clean (#498 kit aim, #551 player Mark,
 * #843 kit buff, #850 kit Swap).
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import { enemyCastRangeOk } from "./targeting.ts";

export type BossKitMarkSpell =
  | Pick<
      SpellConfig,
      | "range"
      | "spellType"
      | "damage"
      | "targetType"
      | "isMark"
      | "isSwap"
      | "isSummon"
      | "isMirror"
      | "isBarrier"
      | "healAmount"
      | "debuffStat"
      | "debuffDuration"
      | "dotDamage"
      | "dotDamagePerTurn"
      | "dotDuration"
      | "buffStat"
    >
  | {
      range?: unknown;
      spellType?: string | null;
      damage?: unknown;
      targetType?: string | null;
      isMark?: boolean | null;
      isSwap?: boolean | null;
      isSummon?: boolean | null;
      isMirror?: boolean | null;
      isBarrier?: boolean | null;
      healAmount?: unknown;
      debuffStat?: string | null;
      debuffDuration?: unknown;
      dotDamage?: unknown;
      dotDamagePerTurn?: unknown;
      dotDuration?: unknown;
      buffStat?: string | null;
    };

export type BossKitTile = { x: number; y: number };

export type WxBossKitApplyKind =
  | "summon"
  | "damage"
  | "heal"
  | "debuff"
  | "dot"
  | "buff";

/** Same Chebyshev vs `Number(spell.range)` the WX enemy apply uses. */
export function bossKitMarkInRange(
  origin: BossKitTile,
  targetCell: BossKitTile,
  spell: BossKitMarkSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/** Catalog Mark. Do not require `effectType === "debuff"` (name heuristic). */
export function isBossKitMarkExecuteSpell(spell: BossKitMarkSpell): boolean {
  return spell.isMark === true;
}

/**
 * Live WX boss kit apply kinds. There is no `"mark"` arm — Mark with
 * `spellType: "damage"` and `damage: 0` yields `[]`.
 */
export function wxBossKitApplyKinds(
  spell: BossKitMarkSpell,
): WxBossKitApplyKind[] {
  if (spell.isSummon) return ["summon"];
  const kinds: WxBossKitApplyKind[] = [];
  const spellType = spell.spellType ?? "damage";
  if (
    (spellType === "damage" || spellType === "drain") &&
    Number(spell.damage) > 0
  ) {
    kinds.push("damage");
  }
  if (spellType === "heal" && spell.healAmount) {
    kinds.push("heal");
  }
  if (spell.debuffStat && spell.debuffDuration) {
    kinds.push("debuff");
  }
  if ((spell.dotDamagePerTurn ?? spell.dotDamage) && spell.dotDuration) {
    kinds.push("dot");
  }
  if (
    spellType !== "damage" &&
    spellType !== "drain" &&
    spellType !== "heal" &&
    !spell.debuffStat &&
    !(spell.dotDamagePerTurn ?? spell.dotDamage) &&
    (spell.targetType === "self" || spell.targetType === "ally")
  ) {
    kinds.push("buff");
  }
  return kinds;
}

export function canExecuteBossKitMarkCast(args: {
  spell: BossKitMarkSpell;
  origin: BossKitTile;
  targetCell: BossKitTile;
}): boolean {
  return (
    isBossKitMarkExecuteSpell(args.spell) &&
    bossKitMarkInRange(args.origin, args.targetCell, args.spell)
  );
}

/** Alias so decide and the WX Mark branch cannot fork. */
export function shouldDecideBossKitMarkCast(
  args: Parameters<typeof canExecuteBossKitMarkCast>[0],
): boolean {
  return canExecuteBossKitMarkCast(args);
}

export function bossKitHighlightedMarkIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/** Same key player `placeMark` writes onto `markedTilesRef`. */
export function bossKitMarkTileKey(cell: BossKitTile): string {
  return `${cell.x},${cell.y}`;
}

/**
 * Execute a decided in-range kit Mark. Out of range / non-Mark returns
 * null so restack cannot treat `#498` kit aim as a walk dest.
 */
export function executeBossKitMarkCast(args: {
  spell: BossKitMarkSpell;
  origin: BossKitTile;
  targetCell: BossKitTile;
}): { tile: BossKitTile; key: string } | null {
  if (
    !canExecuteBossKitMarkCast({
      spell: args.spell,
      origin: args.origin,
      targetCell: args.targetCell,
    })
  ) {
    return null;
  }
  const tile = { x: args.targetCell.x, y: args.targetCell.y };
  return { tile, key: bossKitMarkTileKey(tile) };
}
