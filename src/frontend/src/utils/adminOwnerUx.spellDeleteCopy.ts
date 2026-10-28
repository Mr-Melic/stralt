/**
 * SpellList Delete always confirms “removes the live spell immediately”
 * and toasts “Spell deleted”. The canister:
 *   - `#err` for built-in ids (retire via usableByPlayer=false)
 *   - `#ok` after retiring a player-owned spell
 *   - `#ok` after a real remove
 * `onError` swallows the `#err` text (“Failed to delete spell”).
 *
 * Unique 2026-10-28 file — do not merge into adminOwnerUx.summon.ts /
 * SpellSummonFields.tsx (#564) or restack AdminDashboard (#341 builtin
 * delete). Not wired (stack).
 */

import { isBuiltInSpellId } from "./adminSafety.ts";

export function ownerSpellDeleteBlockedReason(id: string): string | null {
  if (isBuiltInSpellId(id)) {
    return "Cannot delete a built-in spell; uncheck usableByPlayer to retire it";
  }
  return null;
}

export function shouldOpenOwnerSpellDeleteConfirm(id: string): boolean {
  return ownerSpellDeleteBlockedReason(id) == null;
}

export function ownerSpellDeleteConfirmBody(): string {
  return "If any player already owns this spell, the canister will retire it (usableByPlayer=false) instead of removing the row. Built-in spells cannot be deleted. There is no undo.";
}

export function ownerSpellDeleteSuccessCopy(stillInCatalog: boolean): string {
  if (stillInCatalog) {
    return "Spell retired (usableByPlayer=false). It remains in the catalog.";
  }
  return "Spell removed from the live catalog.";
}

export function ownerActorErrorToast(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message.trim().length > 0) {
    return err.message;
  }
  if (typeof err === "string" && err.trim().length > 0) {
    return err;
  }
  return fallback;
}

export function ownerSpellDeleteToastsDeletedOnMain(): true {
  return true;
}
