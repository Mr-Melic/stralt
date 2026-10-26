/**
 * Status-effect duration chrome. Display only — not wired into
 * StatusEffectBadge.tsx (leave that host for a human / later union).
 *
 * UX-STATUS-TURNS-SUFFIX: the pill prints `{n}t` while the title already
 * says “N turn(s) remaining”. Distinct from UX-SPELL-CD-TURNS (spell slots)
 * and UX-TURN-INDEX-T-PREFIX (battle phase `T{n}`).
 */

function floorTurns(turns: number): number {
  return Math.max(0, Math.floor(Number(turns) || 0));
}

/** Visible duration on a status pill. */
export function statusTurnsLabel(turns: number): string {
  const n = floorTurns(turns);
  return n === 1 ? "1 turn" : `${n} turns`;
}
