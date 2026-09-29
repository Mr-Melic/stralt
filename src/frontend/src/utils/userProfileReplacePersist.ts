/**
 * saveCallerUserProfile writes the whole UserProfile (name + uiLayout) with
 * no field merge (main.mo userProfiles.add). saveUserUiLayout is the merge
 * writer for the HUD blob.
 *
 * ProfileSetup must send uiLayout: "" for a brand-new account (Candid requires
 * the field; empty is the create default). A later stale client that reuses
 * that create payload — or any rename/settings form that sends uiLayout: "" —
 * overwrites a newer layout blob. That is a stale-schema clobber, not a
 * missing-field default.
 *
 * Distinct from SDEG-006 (Character write generation). No required field add.
 * Do not edit main.mo while older persist PRs queue.
 */

export function saveCallerUserProfileMergesUiLayout(): boolean {
  return false;
}

export function saveUserUiLayoutMergesExistingName(): boolean {
  return true;
}

export function emptyUiLayoutIsCreateDefault(): boolean {
  return true;
}

/**
 * True when a full-replace profile write would drop a stored HUD blob.
 * Incoming empty string is the create default, not "keep existing".
 */
export function staleProfileSaveWouldWipeLayout(args: {
  storedLayout: string;
  incomingLayout: string;
}): boolean {
  return args.storedLayout.length > 0 && args.incomingLayout === "";
}
