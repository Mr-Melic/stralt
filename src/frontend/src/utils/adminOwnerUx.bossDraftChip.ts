/**
 * BossesTab collapsed rows (`AdminDashboard.tsx` ~7906–7919) show name,
 * piece, phase threshold, rewards, and portal swatch — no DRAFT chip.
 * Header copy and “Save browser draft” are already honest; the closed
 * row still looks like a live kit.
 *
 * Unique 2026-10-31 file — do not merge into adminOwnerUx.lifecycle.ts
 * (#564) or restack BossesTab (#341 / #413 / #470). Not wired (stack).
 */

export const OWNER_BOSS_DRAFT_CHIP = "DRAFT — this browser";
export const OWNER_BOSS_DRAFT_STATUS =
  "Browser-local draft — not canister-live";

export function ownerBossCollapsedRowChip(): string {
  return OWNER_BOSS_DRAFT_CHIP;
}

export function ownerBossCollapsedRowStatus(): string {
  return OWNER_BOSS_DRAFT_STATUS;
}

export function ownerBossCollapsedRowLooksLiveOnMain(): true {
  return true;
}
