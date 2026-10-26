/**
 * DESIGN.md: mobile interactive targets ≥44px. Purchases already sets
 * minHeight 44 on its buttons. AdminDashboard Btn (py-1.5 / 11px),
 * Field (py-1.5 / text-xs), ListSearch (padding 7px 10px / 12px), and
 * sidebar tabs (padding 10px 20px / 12px) do not. Owner phone use
 * mis-hits Grant vs Ban vs tab switch.
 *
 * Unique 2026-10-26 file — do not merge into adminOwnerUx.editorChrome.ts
 * (#775 breadcrumbs / density) or adminOwnerUx.confirmChrome.ts
 * (#1001 pending slots). Not wired (stack).
 */

export const OWNER_MIN_HIT_PX = 44;

export function ownerHitTargetMeetsMinimum(px: number): boolean {
  return Number.isFinite(px) && px >= OWNER_MIN_HIT_PX;
}

export function ownerDashboardBtnMinHeightOnMain(): null {
  return null;
}

export function ownerFieldMinHeightOnMain(): null {
  return null;
}

export function ownerListSearchMinHeightOnMain(): null {
  return null;
}

export function ownerSidebarTabMinHeightOnMain(): null {
  return null;
}

export function ownerPurchasesControlMinHeightOnMain(): 44 {
  return 44;
}
