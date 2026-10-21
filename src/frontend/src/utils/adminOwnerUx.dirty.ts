/**
 * Owner unsaved-change helpers.
 *
 * `AdminDashboardState.isDirty` is hardcoded false. Leave-editor warns
 * whenever any listed editor is open, including an unchanged form.
 * `beforeunload` is missing. Not wired (stack).
 */

function snapshotOwnerValue(value: unknown): string {
  return JSON.stringify(value, (_key, inner) =>
    typeof inner === "bigint" ? `bigint:${inner.toString()}` : inner,
  );
}

export function ownerFormIsDirty(baseline: unknown, current: unknown): boolean {
  return snapshotOwnerValue(baseline) !== snapshotOwnerValue(current);
}

export function shouldWarnOwnerBeforeUnload(isDirty: boolean): boolean {
  return isDirty === true;
}

export function ownerDirtyLeaveCopy(isDirty: boolean): string | null {
  if (!isDirty) return null;
  return "Unsaved edits in the open form will be discarded. Save first if you want to keep them.";
}

export function shouldPromptOwnerLeave(args: {
  editorOpen: boolean;
  isDirty: boolean;
}): boolean {
  return args.editorOpen === true && args.isDirty === true;
}
