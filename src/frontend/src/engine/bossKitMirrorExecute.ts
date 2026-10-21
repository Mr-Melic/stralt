/**
 * Boss kit Mirror decide vs WorldExploration boss apply.
 *
 * `pickBossKitSpell` returns the first off-cooldown kit id. Every
 * `decide*Action` then sends `{ type: "spell", targetX/Y: player }` with
 * an empty cooldown Map, so the first pool id wins every turn.
 *
 * Mirror Sovereign phase 2 and Midnight Bishop phase 2 both start with
 * `spell-mirror`. Catalog Mirror is `isMirror: true`, `spellType:
 * "damage"`, `damage: 0`, `range: 0`, `targetType: "self"`. The WX boss
 * apply block then:
 *   1. summon when `isSummon`
 *   2. damage / drain only when `Number(damage) > 0`
 *   3. heal when `spellType === "heal"`
 *   4. `debuffStat` + `debuffDuration`
 *   5. DoT fields
 *   6. else-if spellType is NOT damage|drain|heal AND no debuff/dot
 *      AND targetType self|ally → buff
 * There is no `isMirror` / `activateMirror` branch (player
 * `resolvePlayerCast` already has one). A decided kit Mirror therefore
 * ends the boss turn with no reflect token. Player-cast
 * `mirrorRedirect` reads `${targetEnemy.x},${targetEnemy.y}` on
 * `mirrorUnitsRef`; this module is that execute gate.
 *
 * Self range 0 cannot use the decide action's player cell as the
 * Chebyshev dest (that would make every legal Mirror fail). Apply cell
 * is the boss tile. Do not switch to `spellRangeBase` (would rebalance).
 * Do not steal Strike damage, Slow debuff, Iron Skin buff, Swap, Mark,
 * or Barrier. Do not write `"player"` (that is player Mirror
 * `activatePlayerMirror`). WorldExploration / useBossAI / targeting /
 * playerMirror left untouched so older open PRs stay merge-clean
 * (#496 player Mirror, #498 kit aim, #843 kit buff, #850 kit Swap,
 * #851 kit Mark).
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import { enemyCastRangeOk } from "./targeting.ts";

export type BossKitMirrorSpell =
  | Pick<
      SpellConfig,
      | "range"
      | "spellType"
      | "damage"
      | "targetType"
      | "isMirror"
      | "isSwap"
      | "isSummon"
      | "isMark"
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
      isMirror?: boolean | null;
      isSwap?: boolean | null;
      isSummon?: boolean | null;
      isMark?: boolean | null;
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

/** Catalog Mirror. Do not require `effectType === "defense"` (name heuristic). */
export function isBossKitMirrorExecuteSpell(
  spell: BossKitMirrorSpell,
): boolean {
  return spell.isMirror === true;
}

/**
 * Self Mirror shields the caster tile. Decide still aims `targetX/Y` at
 * the player; using that cell vs range 0 would skip every legal cast.
 */
export function bossKitMirrorApplyCell(
  spell: BossKitMirrorSpell,
  origin: BossKitTile,
  targetCell: BossKitTile,
): BossKitTile {
  if (isBossKitMirrorExecuteSpell(spell) || spell.targetType === "self") {
    return { x: origin.x, y: origin.y };
  }
  return { x: targetCell.x, y: targetCell.y };
}

/** Same Chebyshev vs `Number(spell.range)` the WX enemy apply uses. */
export function bossKitMirrorInRange(
  origin: BossKitTile,
  targetCell: BossKitTile,
  spell: BossKitMirrorSpell,
): boolean {
  const applyCell = bossKitMirrorApplyCell(spell, origin, targetCell);
  return enemyCastRangeOk(
    origin,
    applyCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/**
 * Live WX boss kit apply kinds. There is no `"mirror"` arm — Mirror with
 * `spellType: "damage"` and `damage: 0` yields `[]`.
 */
export function wxBossKitApplyKinds(
  spell: BossKitMirrorSpell,
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

export function canExecuteBossKitMirrorCast(args: {
  spell: BossKitMirrorSpell;
  origin: BossKitTile;
  targetCell: BossKitTile;
}): boolean {
  return (
    isBossKitMirrorExecuteSpell(args.spell) &&
    bossKitMirrorInRange(args.origin, args.targetCell, args.spell)
  );
}

/** Alias so decide and the WX Mirror branch cannot fork. */
export function shouldDecideBossKitMirrorCast(
  args: Parameters<typeof canExecuteBossKitMirrorCast>[0],
): boolean {
  return canExecuteBossKitMirrorCast(args);
}

export function bossKitHighlightedMirrorIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/** Same key player-cast `mirrorRedirect` reads from `mirrorUnitsRef`. */
export function bossKitMirrorTileKey(cell: BossKitTile): string {
  return `${cell.x},${cell.y}`;
}

/**
 * Execute a decided kit Mirror. Non-Mirror returns null so restack
 * cannot treat `#498` kit aim as a walk dest. The shield key is the
 * boss tile, not the decide action's player cell.
 */
export function executeBossKitMirrorCast(args: {
  spell: BossKitMirrorSpell;
  origin: BossKitTile;
  targetCell: BossKitTile;
}): { tile: BossKitTile; key: string } | null {
  if (
    !canExecuteBossKitMirrorCast({
      spell: args.spell,
      origin: args.origin,
      targetCell: args.targetCell,
    })
  ) {
    return null;
  }
  const tile = bossKitMirrorApplyCell(args.spell, args.origin, args.targetCell);
  return { tile, key: bossKitMirrorTileKey(tile) };
}

/** Restack: add the execute key onto `mirrorUnitsRef` (not `"player"`). */
export function activateBossKitMirror(
  mirrorUnits: Set<string>,
  tile: BossKitTile,
): Set<string> {
  mirrorUnits.add(bossKitMirrorTileKey(tile));
  return mirrorUnits;
}

/**
 * Same consume as WX `mirrorRedirect`: the clicked enemy's live tile.
 * Distinct from `consumePlayerMirror` (`"player"`).
 */
export function consumeBossKitMirror(
  mirrorUnits: Set<string>,
  targetTile: BossKitTile,
): boolean {
  const key = bossKitMirrorTileKey(targetTile);
  if (!mirrorUnits.has(key)) return false;
  mirrorUnits.delete(key);
  return true;
}
