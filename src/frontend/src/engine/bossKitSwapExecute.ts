/**
 * Boss kit Swap decide vs WorldExploration boss apply.
 *
 * `pickBossKitSpell` returns the first off-cooldown kit id. Every
 * `decide*Action` then sends `{ type: "spell", targetX/Y: player }` with
 * an empty cooldown Map, so the first pool id wins every turn.
 *
 * Enthroned Void phase 1 and 2 both start with `spell-swap`. Catalog Swap
 * is `isSwap: true`, `spellType: "damage"`, `damage: 0`. The WX boss apply
 * block then:
 *   1. summon when `isSummon`
 *   2. damage / drain only when `Number(damage) > 0`
 *   3. heal when `spellType === "heal"`
 *   4. `debuffStat` + `debuffDuration`
 *   5. DoT fields
 *   6. else-if spellType is NOT damage|drain|heal AND no debuff/dot
 *      AND targetType self|ally → buff
 * There is no `isSwap` branch (player `resolvePlayerCast` already has one).
 * A decided in-range kit Swap therefore ends the boss turn with no teleport.
 *
 * This module is that execute gate: advertised Swap exchanges the boss and
 * player tiles, Chebyshev vs `Number(spell.range)` (same as WX enemy
 * `inRange`, no LoS). Do not switch to `spellRangeBase` (would rebalance).
 * Do not steal Strike damage, Slow debuff, Iron Skin buff, Mark, or Mirror.
 * WorldExploration / useBossAI / targeting / swapTeleport left untouched so
 * older open PRs stay merge-clean (#498 kit aim, #541/#754 player Swap,
 * #843 kit buff).
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import { enemyCastRangeOk } from "./targeting.ts";

export type BossKitSwapSpell =
  | Pick<
      SpellConfig,
      | "range"
      | "spellType"
      | "damage"
      | "targetType"
      | "isSwap"
      | "isSummon"
      | "isMark"
      | "isMirror"
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
      isSwap?: boolean | null;
      isSummon?: boolean | null;
      isMark?: boolean | null;
      isMirror?: boolean | null;
      healAmount?: unknown;
      debuffStat?: string | null;
      debuffDuration?: unknown;
      dotDamage?: unknown;
      dotDamagePerTurn?: unknown;
      dotDuration?: unknown;
      buffStat?: string | null;
    };

export type BossKitTile = { x: number; y: number };

export type BossKitSwapTiles = {
  boss: BossKitTile;
  player: BossKitTile;
};

export type WxBossKitApplyKind =
  | "summon"
  | "damage"
  | "heal"
  | "debuff"
  | "dot"
  | "buff";

/** Same Chebyshev vs `Number(spell.range)` the WX enemy apply uses. */
export function bossKitSwapInRange(
  origin: BossKitTile,
  targetCell: BossKitTile,
  spell: BossKitSwapSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/** Catalog Swap. Do not require `effectType === "teleport"` (name heuristic). */
export function isBossKitSwapExecuteSpell(spell: BossKitSwapSpell): boolean {
  return spell.isSwap === true;
}

/**
 * Live WX boss kit apply kinds. There is no `"swap"` arm — Swap with
 * `spellType: "damage"` and `damage: 0` yields `[]`.
 */
export function wxBossKitApplyKinds(
  spell: BossKitSwapSpell,
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

export function canExecuteBossKitSwapCast(args: {
  spell: BossKitSwapSpell;
  origin: BossKitTile;
  targetCell: BossKitTile;
}): boolean {
  return (
    isBossKitSwapExecuteSpell(args.spell) &&
    bossKitSwapInRange(args.origin, args.targetCell, args.spell)
  );
}

/** Alias so decide and the WX Swap branch cannot fork. */
export function shouldDecideBossKitSwapCast(
  args: Parameters<typeof canExecuteBossKitSwapCast>[0],
): boolean {
  return canExecuteBossKitSwapCast(args);
}

export function bossKitHighlightedSwapIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/** Advertised Swap: caster and target exchange cells. */
export function bossKitSwapTiles(
  boss: BossKitTile,
  player: BossKitTile,
): BossKitSwapTiles {
  return {
    boss: { x: player.x, y: player.y },
    player: { x: boss.x, y: boss.y },
  };
}

/**
 * Execute a decided in-range kit Swap. Out of range / non-Swap returns null
 * so restack cannot treat `#498` kit aim as a walk dest.
 */
export function executeBossKitSwapCast(args: {
  spell: BossKitSwapSpell;
  boss: BossKitTile;
  player: BossKitTile;
}): BossKitSwapTiles | null {
  if (
    !canExecuteBossKitSwapCast({
      spell: args.spell,
      origin: args.boss,
      targetCell: args.player,
    })
  ) {
    return null;
  }
  return bossKitSwapTiles(args.boss, args.player);
}
