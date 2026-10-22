/**
 * SpriteList.handleSave calls onSave then immediately clears the editor.
 * Parent walk-URL validation and the canister write still run after the
 * form is gone, so a failed Save discards the draft with only a toast.
 *
 * Unique 2026-10-22 file — do not merge into adminOwnerUx.dirty.ts (#838)
 * or restack AdminDashboard SpriteList (#413 / #564).
 */

export type OwnerEditorSaveOutcome =
  | "idle"
  | "validation_failed"
  | "pending"
  | "ok"
  | "err";

export function shouldCloseOwnerEditorAfterSave(
  outcome: OwnerEditorSaveOutcome,
): boolean {
  return outcome === "ok";
}

export function shouldKeepOwnerEditorOpen(
  outcome: OwnerEditorSaveOutcome,
): boolean {
  return !shouldCloseOwnerEditorAfterSave(outcome);
}

export function spriteEditorClosedBeforeSaveSettled(args: {
  editorClosed: boolean;
  outcome: OwnerEditorSaveOutcome;
}): boolean {
  return args.editorClosed && args.outcome !== "ok";
}
