/**
 * saveUserUiLayout missing-profile stub (SDEG-2026-10-25-006).
 *
 * Motoko saveUserUiLayout on a missing userProfiles row writes
 * { name = ""; uiLayout = layout }. Official ProfileSetup is mounted before
 * HUD, so this race is raw-client / future HUD-before-setup. Combined with
 * known saveCallerUserProfile full-replace (uiLayout:""), a later ProfileSetup
 * submit would wipe that stub layout.
 *
 * Do not create a required name field default other than "" — empty is the
 * pre-feature shape. Chat sendMessage binds the stored profile name.
 */

export function saveUserUiLayoutCreatesEmptyNameWhenProfileMissing(): boolean {
  return true;
}

export function profileSetupNewPayloadWipesUiLayout(): boolean {
  return true;
}

/** Official App shows ProfileSetup before GameFlow / DraggablePanel. */
export function officialHudMountsAfterProfileSetup(): boolean {
  return true;
}

export function shouldMergeUiLayoutWhenCreatingProfile(args: {
  existingUiLayout: string;
  incomingUiLayout: string;
}): string {
  const incoming = args.incomingUiLayout ?? "";
  const existing = args.existingUiLayout ?? "";
  if (incoming.length > 0) return incoming;
  return existing;
}
