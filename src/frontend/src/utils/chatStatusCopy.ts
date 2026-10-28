/**
 * Chat Status-tab group headings. Display only — not wired into
 * ChatPanel.tsx (forbidden while older open PRs own that file).
 *
 * UX-CHAT-STATUS-ENEMY-ID: non-player effects group as
 * `ENEMY ${enemyId.slice(-4).toUpperCase()}` so a live id `e-3` reads
 * `ENEMY E-3`. Distinct from UX-EFFECT-APPLY-TARGETID (battle log) and
 * UX-INSPECT-EFFECTS-EMPTY (inspect ACTIVE EFFECTS). Do not hide the Chat
 * Debug channel (AGENTS.md overlay).
 */

export function chatStatusGroupHeading(unitName?: string): string {
  const named = String(unitName ?? "").trim();
  if (!named) return "AN ENEMY";
  return named.toUpperCase();
}
