/**
 * Battle turn-index chrome. Display only — not wired into BattleUIPanel.tsx
 * (forbidden while older combat / a11y PRs own that file).
 *
 * UX-TURN-INDEX-T-PREFIX: the phase column prints `T{battleTurn}` with no
 * word “Turn”. Distinct from UX-TURN-TIMER-WHY (the `{n}s` countdown).
 */

/** Visible turn index under YOUR / ENEMY. */
export function turnIndexLabel(turn: number): string {
  const n = Math.max(1, Math.floor(Number(turn) || 1));
  return `Turn ${n}`;
}
