/**
 * Spell-slot cooldown chrome. Display only — not wired into
 * BattleUIPanel.tsx (forbidden while older combat / a11y PRs own that file).
 *
 * UX-SPELL-CD-TURNS: hover uses `CD: {n}t` and the overlay is a bare integer.
 * Distinct from UX-TURN-TIMER-WHY (the 30s / Time Warp 15s clock) and
 * UX-SPELL-AP-DISABLED-REASON (AP-short slots stay clickable).
 */

function floorTurns(turns: number): number {
  return Math.max(0, Math.floor(Number(turns) || 0));
}

/** Hover / aria suffix while a spell waits. Empty when ready. */
export function spellCooldownTitleSuffix(turns: number): string {
  const n = floorTurns(turns);
  if (n <= 0) return "";
  return n === 1 ? " | 1 turn remaining" : ` | ${n} turns remaining`;
}

/** Number on the slot overlay, with a turns word the current `t` suffix hides. */
export function spellCooldownOverlayLabel(turns: number): string {
  const n = floorTurns(turns);
  if (n <= 0) return "";
  return n === 1 ? "1 turn" : `${n}`;
}
