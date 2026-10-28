/**
 * Player-controlled summon kit has no Digit / Numpad select.
 *
 * Player Digit 1–8 / Numpad are `#743` (`battleSpellHotkeys.ts`) and read
 * `selectedSpellIdRef` / the champion bar. Kit slots live on
 * `selectedSummonSpellId` with no numbered hotkeys. Live WorldExploration
 * keydown only binds Attack Nearest `S`. `SummonControlPanel` kit buttons
 * disable on AP only; `onSpellSelect` always writes the id. `#1267` skips
 * champion *pointer* bar select. `#1211` is kit *pointer* select vs
 * remaining Inferno CD.
 *
 * Distinct from kit Attack Nearest dest (`#1238`), enemy-sprite dest
 * (`#1260`), self/ally sprite dest (`#1263`), tile remaining (`#1205`),
 * execute arm (`#1206`), kit select remaining (`#1211`), summon-turn
 * remaining tick (`#1214`), and LoS/AP highlight (`#757`). Catalog wisp
 * `summonUnitDef.ap` is 2, which cannot pay Blood Mend 3 — unique fire
 * needs `currentAp >= 3`; do not rebalance (`#762`).
 *
 * Unique fire: controlling wisp, Digit / Numpad 1, remaining-ready Blood
 * Mend, `currentAp >= 3`. Live keydown never writes `selectedSummonSpellId`.
 * Sidecar select is kit[0]; the caster-tile dest is in the highlight set
 * and executes. Digit 2 Rallying Cry needs 4 AP. Empty Digit 3 / 2 AP /
 * player turn / Strike / Frost / Inferno / Venom / Poison / Slow / bomber
 * cannot as this leftover.
 *
 * Do not restack WorldExploration / BattleUIPanel / SummonControlPanel /
 * summonControlCast / targeting / spellEngine. Restack the summon-control
 * keydown onto `decideSummonControlKitHotkey` after older combat PRs land.
 */

import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import {
  type SummonKitCatalogSpell,
  pickSummonControlClickTarget,
  planSummonControlCast,
} from "../utils/summonControlCast.ts";
import { type TileType, canAffordCastAp } from "./targeting.ts";

/** Same eight-slot ceiling as the champion bar. Kit rows are often shorter. */
export const SUMMON_CONTROL_KIT_HOTKEY_SLOT_COUNT = 8;

export type SummonControlHotkeyEvent = {
  key?: string;
  code?: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  target?: EventTarget | null;
};

export type SummonControlKitHotkeyDecision =
  | { action: "select"; slotIndex: number; spellId: string }
  | { action: "ignore"; reason: string };

/**
 * Same editable-field guard as Attack Nearest `S`. Digit must not fire
 * while a chat or admin input is focused.
 */
export function summonControlKitHotkeyTargetIsEditable(
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

function hasHotkeyModifier(event: SummonControlHotkeyEvent): boolean {
  return Boolean(event.metaKey || event.ctrlKey || event.altKey);
}

/**
 * Slot index for Digit / Numpad 1–8. `9` is ignored — the bar has eight
 * slots. `code` wins so Shift+Digit does not remap on some layouts.
 * Distinct from `#743` `spellSlotIndexFromKey` (player bar).
 */
export function summonControlKitSlotIndexFromKey(
  event: SummonControlHotkeyEvent,
): number | null {
  const code = event.code ?? "";
  const fromCode = /^(?:Digit|Numpad)([1-8])$/.exec(code);
  if (fromCode) return Number(fromCode[1]) - 1;
  const key = event.key ?? "";
  if (key.length === 1 && key >= "1" && key <= "8") return Number(key) - 1;
  return null;
}

export function isSummonControlKitSlotHotkey(
  event: SummonControlHotkeyEvent,
): boolean {
  if (hasHotkeyModifier(event)) return false;
  if (summonControlKitHotkeyTargetIsEditable(event.target)) return false;
  return summonControlKitSlotIndexFromKey(event) != null;
}

/**
 * Kit rows the panel already maps: `summonUnitDef.summonKit` ids through
 * the catalog, then `summon.spells` when the kit is empty.
 */
export function resolveSummonControlKitHotkeySlots<
  T extends SummonKitCatalogSpell,
>(pieceType: string, catalog: T[], fallbackSpells: T[] = []): T[] {
  const unitDef = catalog.find(
    (sp) => sp.summonUnitDef?.pieceType === pieceType,
  )?.summonUnitDef;
  const kitIds = Array.isArray(unitDef?.summonKit) ? unitDef.summonKit : [];
  const resolved = kitIds
    .map((id) => catalog.find((sp) => sp.id === id))
    .filter((sp): sp is T => Boolean(sp));
  return resolved.length > 0 ? resolved : fallbackSpells;
}

/**
 * Live panel disable: AP only. Remaining CD is `#1211`.
 */
export function summonControlKitHotkeySlotDisabled(args: {
  currentAp: number;
  apCost: unknown;
}): boolean {
  return !canAffordCastAp(args.currentAp, Number(args.apCost ?? 0));
}

/**
 * Digit may write `selectedSummonSpellId` only while a summon is
 * controlled, in battle, the slot exists, and AP covers the kit cost.
 * Player-turn Digit stays `#743`. Remaining 3 still selects (pointer
 * leftover is `#1211`).
 */
export function canHotkeySelectSummonControlKit(args: {
  controllingSummon: boolean;
  inBattle: boolean;
  currentAp: number;
  spell: { id?: string; apCost?: unknown } | null | undefined;
}): boolean {
  if (args.controllingSummon !== true) return false;
  if (args.inBattle !== true) return false;
  if (!args.spell || typeof args.spell.id !== "string" || !args.spell.id) {
    return false;
  }
  return !summonControlKitHotkeySlotDisabled({
    currentAp: args.currentAp,
    apCost: args.spell.apCost,
  });
}

/**
 * One keydown: select a ready kit slot. `S` stays `#1238`. Escape stays
 * inspect-close on BattleUIPanel / `#743` player cancel. Player-turn
 * Digit stays `#743`. Champion Inferno in bar slot 1 is `#1267` (pointer)
 * and `#743` (keyboard) — this path writes the *kit* id instead.
 */
export function decideSummonControlKitHotkey(args: {
  event: SummonControlHotkeyEvent;
  controllingSummon: boolean;
  inBattle: boolean;
  currentAp: number;
  kitSpells: ReadonlyArray<{ id: string; apCost?: unknown } | null | undefined>;
}): SummonControlKitHotkeyDecision {
  if (!isSummonControlKitSlotHotkey(args.event)) {
    return { action: "ignore", reason: "unbound" };
  }
  if (args.controllingSummon !== true) {
    return { action: "ignore", reason: "player_turn" };
  }
  if (args.inBattle !== true) {
    return { action: "ignore", reason: "out_of_battle" };
  }
  const slotIndex = summonControlKitSlotIndexFromKey(args.event);
  if (slotIndex == null || slotIndex >= SUMMON_CONTROL_KIT_HOTKEY_SLOT_COUNT) {
    return { action: "ignore", reason: "empty_slot" };
  }
  const spell = args.kitSpells[slotIndex];
  if (!spell) return { action: "ignore", reason: "empty_slot" };
  if (
    !canHotkeySelectSummonControlKit({
      controllingSummon: args.controllingSummon,
      inBattle: args.inBattle,
      currentAp: args.currentAp,
      spell,
    })
  ) {
    return { action: "ignore", reason: "cannot_select" };
  }
  return { action: "select", slotIndex, spellId: spell.id };
}

/**
 * Spell id `setSelectedSummonSpellId` should write. Null keeps the
 * previous kit (and does not arm `#743` / `#1267` champion Inferno).
 */
export function resolveSummonControlKitHotkeySelect(
  decision: SummonControlKitHotkeyDecision,
): string | null {
  return decision.action === "select" ? decision.spellId : null;
}

export type SummonControlKitHotkeyCastResult<
  T extends { id: string; x: number; y: number },
> = {
  spellId: string;
  target: T;
  remainingAp: number;
};

/**
 * After a legal Digit select, the dest must pass the same live gate a
 * kit-panel click already uses (`pickSummonControlClickTarget` +
 * `planSummonControlCast`). Highlighted caster-tile Blood Mend executes;
 * empty / enemy / short AP / player turn cannot.
 */
export function executeSummonControlKitHotkeyCast<
  T extends {
    id: string;
    x: number;
    y: number;
    hp?: number;
    side?: string;
    isSummon?: boolean;
  },
>(args: {
  event: SummonControlHotkeyEvent;
  controllingSummon: boolean;
  inBattle: boolean;
  currentAp: number;
  pieceType: string;
  catalog: Array<SummonKitCatalogSpell & Partial<SpellConfig>>;
  fallbackSpells?: Array<SummonKitCatalogSpell & Partial<SpellConfig>>;
  caster: T;
  tile: { x: number; y: number };
  combatants: T[];
  tiles: TileType[][];
  barrierTiles?: Map<string, number>;
}): SummonControlKitHotkeyCastResult<T> | null {
  const kitSpells = resolveSummonControlKitHotkeySlots(
    args.pieceType,
    args.catalog,
    args.fallbackSpells ?? [],
  );
  const decision = decideSummonControlKitHotkey({
    event: args.event,
    controllingSummon: args.controllingSummon,
    inBattle: args.inBattle,
    currentAp: args.currentAp,
    kitSpells,
  });
  const spellId = resolveSummonControlKitHotkeySelect(decision);
  if (!spellId) return null;
  const spell = kitSpells.find((row) => row.id === spellId);
  if (!spell) return null;
  const target = pickSummonControlClickTarget({
    spell,
    caster: args.caster,
    tile: args.tile,
    combatants: args.combatants,
    tiles: args.tiles,
    barrierTiles: args.barrierTiles,
  });
  if (!target) return null;
  const plan = planSummonControlCast({
    pieceType: args.pieceType,
    spellId,
    catalog: args.catalog,
    fallbackSpells: args.fallbackSpells,
    currentAp: args.currentAp,
    caster: args.caster,
    target: { x: args.tile.x, y: args.tile.y },
    liveGate: {
      tiles: args.tiles,
      combatants: args.combatants as unknown as Enemy[],
      barrierTiles: args.barrierTiles,
    },
  });
  if (!plan.ok) return null;
  return { spellId, target, remainingAp: plan.remainingAp };
}

/** Highlighted legal dest is executable when the hotkey cast landed. */
export function summonControlKitHotkeyHighlightedIsExecutable(args: {
  highlighted: boolean;
  executable: boolean;
}): boolean {
  return args.highlighted === true && args.executable === true;
}
