/**
 * Owner version / changelog live-publish helpers.
 *
 * `setAppVersion` / `setChangelog` exist; Settings has no inputs.
 * A changelog write is player-visible. Confirm + validateChangelog.
 * Not wired (stack; HUMAN_APPROVAL_REQUIRED).
 */

import { validateChangelog } from "./adminSafety.ts";

export function ownerChangelogPublishGate(args: {
  version: string;
  text: string;
}): { allow: boolean; reason: string | null } {
  const err = validateChangelog(args.version, args.text);
  if (err) return { allow: false, reason: err };
  return { allow: true, reason: null };
}

export function ownerChangelogConfirmBody(version: string): string {
  const v = version.trim() || "(empty version)";
  return `Publishes changelog ${v} to every client immediately. This is not a draft. There is no undo except another publish.`;
}

export function shouldRunOwnerChangelogPublish(args: {
  version: string;
  text: string;
  confirmed: boolean;
}): boolean {
  if (args.confirmed !== true) return false;
  return ownerChangelogPublishGate({
    version: args.version,
    text: args.text,
  }).allow;
}
