/**
 * Escape still only closes inspect while a kit spell stays selected.
 *
 * Player Walk (`onSetWalk`) clears `selectedSpellIdRef` so the next canvas
 * click walks. Kit slots live on `selectedSummonSpellId` with no Walk
 * analog: `SummonControlPanel` has no walk button, no selected state, and
 * `onSpellSelect` always writes the id. Live WorldExploration routes
 * summon-control clicks with `if (selectedSummonSpellId) { cast } else
 * { walk }`. BattleUIPanel Escape only `setSelectedCombatantId(null)`.
 * WorldExploration keydown only binds Attack Nearest `S`.
 *
 * `#1270` named this leftover (`summonControlHotkeyCancel.ts`). Digit /
 * Numpad kit select is that PR; this sidecar is cancel. `#1267` is
 * champion *pointer* skip. `#743` player Digit is not on main.
 *
 * Unique fire: controlling wisp, Blood Mend selected, inspect closed,
 * Escape. Helper clears the kit id so the next canvas click walks.
 * Inspect-open Escape still closes inspect first and keeps the kit.
 * Player turn / empty kit / S / Digit 1 / modifiers cannot as this leftover.
 *
 * Do not restack WorldExploration / BattleUIPanel / SummonControlPanel /
 * summonControlCast / `#1270`. Restack summon-control keydown onto
 * `decideSummonControlHotkeyCancel` after older combat PRs land.
 */

export type SummonControlHotkeyCancelEvent = {
  key?: string;
  code?: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  target?: EventTarget | null;
};

export type SummonControlHotkeyCancelDecision =
  | { action: "none"; reason: string }
  | { action: "close-inspect" }
  | { action: "cancel-kit"; previousSpellId: string };

/**
 * Same editable-field guard as Attack Nearest `S`. Escape must not fire
 * while a chat or admin input is focused.
 */
export function summonControlHotkeyCancelTargetIsEditable(
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

function hasHotkeyModifier(event: SummonControlHotkeyCancelEvent): boolean {
  return Boolean(event.metaKey || event.ctrlKey || event.altKey);
}

export function isSummonControlEscapeHotkey(
  event: SummonControlHotkeyCancelEvent,
): boolean {
  if (hasHotkeyModifier(event)) return false;
  if (summonControlHotkeyCancelTargetIsEditable(event.target)) return false;
  return event.key === "Escape" || event.code === "Escape";
}

/**
 * Live canvas gate: a non-null kit id takes the cast arm; null walks.
 * Matches WorldExploration mouse (~10050) and touch (~10749).
 */
export function summonControlClickUsesKitCast(
  selectedSummonSpellId: string | null | undefined,
): boolean {
  return Boolean(selectedSummonSpellId);
}

/**
 * Spell id `setSelectedSummonSpellId` should keep. Null after cancel-kit
 * so the next click walks. Inspect-close and ignore keep the previous id.
 */
export function nextSummonSpellIdAfterEscape(
  decision: SummonControlHotkeyCancelDecision,
  currentId: string | null,
): string | null {
  if (decision.action === "cancel-kit") return null;
  return currentId;
}

/**
 * One Escape: close inspect first, then cancel a selected kit. Player
 * Walk / `#743` champion cancel stay out of this path.
 */
export function decideSummonControlHotkeyCancel(args: {
  event: SummonControlHotkeyCancelEvent;
  inBattle: boolean;
  isSummonControlled: boolean;
  selectedSummonSpellId: string | null;
  inspectOpen: boolean;
}): SummonControlHotkeyCancelDecision {
  if (!isSummonControlEscapeHotkey(args.event)) {
    return { action: "none", reason: "unbound" };
  }
  if (args.inBattle !== true) {
    return { action: "none", reason: "out_of_battle" };
  }
  if (args.inspectOpen === true) {
    return { action: "close-inspect" };
  }
  if (args.isSummonControlled !== true) {
    return { action: "none", reason: "player_turn" };
  }
  const id = args.selectedSummonSpellId;
  if (typeof id !== "string" || id.length === 0) {
    return { action: "none", reason: "no_kit" };
  }
  return { action: "cancel-kit", previousSpellId: id };
}
