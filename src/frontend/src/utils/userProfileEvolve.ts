/**
 * UserProfile is a two-field record. saveCallerUserProfile replaces the
 * whole row (main.mo does userProfiles.add(caller, profile) with no merge).
 * Official ProfileSetup therefore sends uiLayout: "" on first create.
 *
 * A later name-only write with the same empty blob wipes a layout that
 * saveUserUiLayout already stored. Keep the stored blob when the incoming
 * uiLayout is empty. Do not add required persist fields.
 */

export type UserProfileFields = {
  name: string;
  uiLayout: string;
};

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/**
 * Merge a saveCallerUserProfile payload onto the stored row.
 * Empty incoming uiLayout means "name-only" — keep stored layout.
 * Non-empty incoming uiLayout is an intentional replace (rare; layout
 * writes go through saveUserUiLayout).
 */
export function mergeUserProfileWrite(
  stored: UserProfileFields | null | undefined,
  incoming: UserProfileFields,
): UserProfileFields {
  const name = asText(incoming.name).trim();
  const incomingLayout = asText(incoming.uiLayout);
  const storedLayout = stored ? asText(stored.uiLayout) : "";
  return {
    name,
    uiLayout: incomingLayout.length > 0 ? incomingLayout : storedLayout,
  };
}

/**
 * App.tsx treats a timed-out / error getCallerUserProfile (null) as
 * "no profile" and shows ProfileSetup. Submitting then would send
 * uiLayout: "". Callers must merge first when a stored row might exist.
 */
export function profileSetupWouldWipeLayout(
  stored: UserProfileFields | null | undefined,
  incomingLayout: string,
): boolean {
  const storedLayout = stored ? asText(stored.uiLayout) : "";
  return storedLayout.length > 0 && asText(incomingLayout).length === 0;
}
