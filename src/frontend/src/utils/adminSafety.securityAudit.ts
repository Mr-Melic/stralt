/**
 * Mirror of src/backend/lib/securityAudit.mo chat / name / spell-level / buff
 * caps. Sidecar so adminSafety.ts stays owned by older open PRs.
 */

export const MAX_SPELL_LEVEL = 99;
export const MAX_BUFF_STACK = 99;

export function containsDisallowedControls(text: string): boolean {
  for (const ch of text) {
    const n = ch.codePointAt(0) ?? 0;
    if (n < 32) return true;
    if (n === 0x7f) return true;
    if (
      n === 0x202a ||
      n === 0x202b ||
      n === 0x202c ||
      n === 0x202d ||
      n === 0x202e ||
      n === 0x2066 ||
      n === 0x2067 ||
      n === 0x2068 ||
      n === 0x2069
    ) {
      return true;
    }
  }
  return false;
}

export function chatTextRejected(text: string): string | null {
  return containsDisallowedControls(text)
    ? "Message contains control characters"
    : null;
}

export function displayNameRejected(name: string): string | null {
  return containsDisallowedControls(name)
    ? "Name contains control characters"
    : null;
}

export function spellLevelCapRejected(currentLevel: number): string | null {
  if (currentLevel >= MAX_SPELL_LEVEL) {
    return "Spell is already at maximum level";
  }
  return null;
}

export function buffStackRejected(quantity: number): string | null {
  if (quantity >= MAX_BUFF_STACK) {
    return "Inventory stack is full";
  }
  return null;
}

/**
 * assignUserRole uses these guards. MixinAuthorization.assignCallerUserRole
 * cannot be redeclared (Caffeine lint include-authorization /
 * no-redeclare-assign-caller-user-role), so last-admin lockout via the mixin
 * Candid method remains an architectural leftover.
 */
export function mixinRoleAssignRejected(args: {
  isAdmin: boolean;
  callerText: string;
  targetText: string;
  role: "admin" | "user" | "guest";
}): string | null {
  if (!args.isAdmin) return "Unauthorized: admin only";
  if (args.targetText === "2vxsx-fae") {
    return "Cannot assign a role to the anonymous principal";
  }
  if (args.callerText === args.targetText && args.role !== "admin") {
    return "Refusing self-demotion: another admin must change your role";
  }
  if (args.role === "guest") {
    return 'role must be "admin" or "user"';
  }
  return null;
}
