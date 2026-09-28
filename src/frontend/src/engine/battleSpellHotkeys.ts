/**
 * Keyboard / shortcut combat actions vs painted slot badges.
 *
 * BattleUIPanel paints `slotIndex + 1` on eight slots and wires click
 * select. Only Attack Nearest `[S]` is on a keydown. Escape clears the
 * inspect card, not the selected spell (Walk does that). Digit keys
 * therefore cannot reach the same highlight → live → resource →
 * execute funnel as a slot click.
 *
 * This module is the shared table for:
 *   - Digit / Numpad 1–8 → slot index (there is no 9th slot)
 *   - Escape → cancel selection (same as `onSetWalk`)
 *   - whether that slot may be selected (cooldown + AP, including 0-AP
 *     Timestep via {@link planPlayerCastResources})
 *
 * After a legal select, tile / sprite / touch / Attack Nearest / S still
 * use `isTileCastableLive` + `planPlayerCastAttempt`. Do not change AP
 * costs, ranges, or damage. WorldExploration / BattleUIPanel / targeting
 * / playerCastPlan are left untouched so older open PRs stay merge-clean
 * (#340 picker, #432 slot range, #708 AP/CD highlight).
 */

import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import { isSpellOnCooldown } from "../utils/challengeCompletion.ts";
import { isAttackNearestHotkey } from "../utils/pointerParity.ts";
import {
  type PlayerCastAttemptPlan,
  planPlayerCastAttempt,
  planPlayerCastResources,
} from "./playerCastPlan.ts";
import {
  type BarrierTiles,
  type CasterPosition,
  type TileType,
  computeTargetableTiles,
  pickAttackNearestTile,
} from "./targeting.ts";

/** Live BattleUIPanel paints eight slots (`[0, 1, 2, 3, 4, 5, 6, 7]`). */
export const BATTLE_SPELL_SLOT_COUNT = 8;

export type BattleHotkeyKind = "slot" | "cancel" | "attack_nearest" | "ignore";

export interface BattleHotkeyEvent {
  key?: string;
  code?: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  target?: EventTarget | null;
}

/**
 * Same editable-field guard as {@link isAttackNearestHotkey}. Digit / Escape
 * must not fire while a chat or admin input is focused.
 */
export function battleHotkeyTargetIsEditable(
  target: EventTarget | null | undefined,
): boolean {
  if (typeof HTMLElement === "undefined" || !target) return false;
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

function hasHotkeyModifier(event: BattleHotkeyEvent): boolean {
  return Boolean(event.metaKey || event.ctrlKey || event.altKey);
}

/**
 * Slot index for Digit / Numpad 1–8. `9` is ignored — the bar has eight
 * slots. `code` wins so Shift+Digit does not remap on some layouts.
 */
export function spellSlotIndexFromKey(event: BattleHotkeyEvent): number | null {
  const code = event.code ?? "";
  const fromCode = /^(?:Digit|Numpad)([1-8])$/.exec(code);
  if (fromCode) return Number(fromCode[1]) - 1;
  const key = event.key ?? "";
  if (key.length === 1 && key >= "1" && key <= "8") return Number(key) - 1;
  return null;
}

export function isSpellSlotHotkey(event: BattleHotkeyEvent): boolean {
  if (hasHotkeyModifier(event)) return false;
  if (battleHotkeyTargetIsEditable(event.target)) return false;
  return spellSlotIndexFromKey(event) != null;
}

/**
 * Escape cancels spell selection the way Walk does. Inspect-open stays
 * on BattleUIPanel (close inspect only) — pass `inspectOpen: true`.
 */
export function isCancelSpellSelectionHotkey(
  event: BattleHotkeyEvent,
): boolean {
  if (event.key !== "Escape") return false;
  if (hasHotkeyModifier(event)) return false;
  if (battleHotkeyTargetIsEditable(event.target)) return false;
  return true;
}

export function classifyBattleSpellHotkey(
  event: BattleHotkeyEvent,
): BattleHotkeyKind {
  if (
    isAttackNearestHotkey({
      key: event.key ?? "",
      metaKey: event.metaKey,
      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
      target: event.target,
    })
  ) {
    return "attack_nearest";
  }
  if (isCancelSpellSelectionHotkey(event)) return "cancel";
  if (isSpellSlotHotkey(event)) return "slot";
  return "ignore";
}

/**
 * Slot click used to ignore leftover AP (CD only). WX `onSelectSpell`
 * then required `currentBattleAp > 0`, which blocked 0-AP Timestep
 * while `planPlayerCastAttempt` still executed it. Hotkey select uses
 * the execute wallet so a selected spell can actually fire.
 */
export function canHotkeySelectSpell(args: {
  inBattle: boolean;
  spell: Pick<SpellConfig, "apCost"> | null | undefined;
  cooldownTurnsRemaining: unknown;
  currentAp: number;
  applyApCost?: (base: number) => number;
}): boolean {
  if (!args.inBattle || !args.spell) return false;
  if (isSpellOnCooldown(args.cooldownTurnsRemaining)) return false;
  return planPlayerCastResources({
    currentAp: args.currentAp,
    baseApCost: Number(args.spell.apCost),
    cooldownTurnsRemaining: args.cooldownTurnsRemaining,
    applyApCost: args.applyApCost,
  }).ok;
}

export type SpellHotkeyDecision =
  | { action: "select"; slotIndex: number }
  | { action: "cancel" }
  | { action: "attack_nearest" }
  | { action: "ignore"; reason: string };

/**
 * One keydown: select a ready slot, cancel like Walk, or Attack Nearest.
 * Inspect-open Escape does not clear the spell (panel contract).
 */
export function decideSpellHotkey(args: {
  event: BattleHotkeyEvent;
  inBattle: boolean;
  inspectOpen?: boolean;
  slots: ReadonlyArray<Pick<SpellConfig, "id" | "apCost"> | null | undefined>;
  cooldownTurnsRemaining: (spellId: string) => unknown;
  currentAp: number;
  applyApCost?: (base: number) => number;
}): SpellHotkeyDecision {
  const kind = classifyBattleSpellHotkey(args.event);
  if (kind === "ignore") return { action: "ignore", reason: "unbound" };
  if (!args.inBattle) return { action: "ignore", reason: "out_of_battle" };
  if (kind === "cancel") {
    if (args.inspectOpen === true) {
      return { action: "ignore", reason: "inspect_open" };
    }
    return { action: "cancel" };
  }
  if (kind === "attack_nearest") return { action: "attack_nearest" };
  const slotIndex = spellSlotIndexFromKey(args.event);
  if (slotIndex == null || slotIndex >= BATTLE_SPELL_SLOT_COUNT) {
    return { action: "ignore", reason: "empty_slot" };
  }
  const spell = args.slots[slotIndex];
  if (!spell) return { action: "ignore", reason: "empty_slot" };
  if (
    !canHotkeySelectSpell({
      inBattle: args.inBattle,
      spell,
      cooldownTurnsRemaining: args.cooldownTurnsRemaining(spell.id),
      currentAp: args.currentAp,
      applyApCost: args.applyApCost,
    })
  ) {
    return { action: "ignore", reason: "cannot_select" };
  }
  return { action: "select", slotIndex };
}

/**
 * After a hotkey select, a painted live-ok tile must pass the same
 * execute plan mouse / sprite / touch / Attack Nearest use.
 */
export function hotkeySelectedCastPlan(args: {
  spell: SpellConfig;
  caster: CasterPosition;
  tile: { x: number; y: number };
  liveCombatants: Enemy[];
  mapTiles: TileType[][];
  effectiveRange: number;
  currentAp: number;
  cooldownTurnsRemaining: unknown;
  applyApCost?: (base: number) => number;
  barrierTiles?: BarrierTiles;
}): PlayerCastAttemptPlan {
  return planPlayerCastAttempt({
    spell: args.spell,
    caster: args.caster,
    tile: args.tile,
    liveCombatants: args.liveCombatants,
    mapTiles: args.mapTiles,
    effectiveRange: args.effectiveRange,
    barrierTiles: args.barrierTiles,
    currentAp: args.currentAp,
    baseApCost: Number(args.spell.apCost),
    cooldownTurnsRemaining: args.cooldownTurnsRemaining,
    applyApCost: args.applyApCost,
  });
}

export function hotkeyHighlightedTileIsExecutable(args: {
  highlighted: boolean;
  plan: PlayerCastAttemptPlan;
}): boolean {
  return args.highlighted === true && args.plan.ok === true;
}

/**
 * Attack Nearest / S after a hotkey select: the picked tile must be in
 * the highlight set and live-ok. Empty / LoS-blocked tiles cannot fire.
 */
export function hotkeyAttackNearestTile(args: {
  spell: SpellConfig;
  caster: CasterPosition;
  liveCombatants: Enemy[];
  mapTiles: TileType[][];
  effectiveRange: number;
  barrierTiles?: BarrierTiles;
}): { x: number; y: number } | null {
  return pickAttackNearestTile(
    args.spell,
    args.caster,
    args.liveCombatants,
    args.mapTiles,
    args.effectiveRange,
    args.barrierTiles,
  );
}

export function hotkeyHighlightContains(
  spell: SpellConfig,
  caster: CasterPosition,
  tile: { x: number; y: number },
  liveCombatants: Enemy[],
  mapTiles: TileType[][],
  effectiveRange: number,
  barrierTiles?: BarrierTiles,
): boolean {
  const keys = computeTargetableTiles(spell, caster, {
    tiles: mapTiles,
    enemies: liveCombatants,
    worldGridSize: mapTiles.length,
    effectiveRange,
    barrierTiles: barrierTiles ?? new Map(),
  });
  return keys.has(`${tile.x},${tile.y}`);
}
