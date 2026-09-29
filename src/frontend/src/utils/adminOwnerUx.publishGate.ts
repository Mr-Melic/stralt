/**
 * Owner live-publish gate.
 *
 * Level-up, palette, and Boss Rush seed from localStorage then hydrate
 * the canister. Publishing before that read finishes can overwrite live
 * config with a stale browser cache. Not wired into AdminDashboard (stack).
 */

export type OwnerPublishGate = {
  allow: boolean;
  reason: string | null;
};

export function shouldAllowOwnerLivePublish(args: {
  remoteHydrated: boolean;
  hydrateFailed?: boolean;
  localDraftOnly?: boolean;
}): OwnerPublishGate {
  if (args.localDraftOnly === true) {
    return {
      allow: true,
      reason: null,
    };
  }
  if (args.hydrateFailed === true) {
    return {
      allow: false,
      reason: "Canister read failed — do not publish the local cache as live.",
    };
  }
  if (args.remoteHydrated !== true) {
    return {
      allow: false,
      reason: "Waiting for canister values — local cache is not live yet.",
    };
  }
  return { allow: true, reason: null };
}
