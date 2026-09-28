/**
 * Owner-console content lifecycle copy.
 *
 * Full DRAFT → ACTIVE publishing stays HUMAN (canister states).
 * This helper only stops a saved local draft from reading as live.
 * Do not treat "Save" success as ACTIVE unless publishedLive is true.
 */

export type OwnerLifecycleState =
  | "DRAFT"
  | "VALIDATION_FAILED"
  | "READY_TO_ACTIVATE"
  | "ACTIVE"
  | "INACTIVE"
  | "LEGACY";

export type OwnerLifecycleFlags = {
  localDraftOnly?: boolean;
  publishedLive?: boolean;
  validationError?: string | null;
  active?: boolean;
  retired?: boolean;
  readyToActivate?: boolean;
};

export type OwnerLifecycleView = {
  state: OwnerLifecycleState;
  chip: string;
  detail: string;
  appearsLive: boolean;
};

function nonEmptyError(err: string | null | undefined): string | null {
  if (typeof err !== "string") return null;
  const trimmed = err.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function ownerLifecycleFromFlags(
  flags: OwnerLifecycleFlags | null | undefined,
): OwnerLifecycleView {
  const f = flags ?? {};
  const validationError = nonEmptyError(f.validationError);

  if (validationError) {
    return {
      state: "VALIDATION_FAILED",
      chip: "VALIDATION FAILED",
      detail: validationError,
      appearsLive: false,
    };
  }

  if (f.retired === true) {
    return {
      state: "LEGACY",
      chip: "LEGACY",
      detail: "Retired — kept for existing owners, not newly granted.",
      appearsLive: false,
    };
  }

  if (f.localDraftOnly === true) {
    return {
      state: "DRAFT",
      chip: "DRAFT",
      detail:
        "Saved draft — not live. This browser only until a canister writer exists.",
      appearsLive: false,
    };
  }

  if (f.publishedLive !== true) {
    if (f.readyToActivate === true) {
      return {
        state: "READY_TO_ACTIVATE",
        chip: "READY TO ACTIVATE",
        detail: "Valid and unpublished — preview before activate.",
        appearsLive: false,
      };
    }
    return {
      state: "DRAFT",
      chip: "DRAFT",
      detail: "Not published. A save that stays local is still a draft.",
      appearsLive: false,
    };
  }

  if (f.active === false) {
    return {
      state: "INACTIVE",
      chip: "INACTIVE",
      detail: "Saved on the canister — not visible or eligible for players.",
      appearsLive: false,
    };
  }

  return {
    state: "ACTIVE",
    chip: "ACTIVE",
    detail: "Published live. Players can encounter this configuration.",
    appearsLive: true,
  };
}

export function ownerSaveButtonLabel(args: {
  localDraftOnly?: boolean;
}): string {
  return args.localDraftOnly === true ? "Save browser draft" : "Publish live";
}

export function ownerSaveSuccessCopy(args: {
  localDraftOnly?: boolean;
}): string {
  return args.localDraftOnly === true
    ? "Draft saved (this browser only — not live)"
    : "Published (live)";
}

export function ownerBossRowLifecycle(
  savedInThisBrowser: boolean,
): OwnerLifecycleView {
  return ownerLifecycleFromFlags({
    localDraftOnly: true,
    publishedLive: false,
    readyToActivate: savedInThisBrowser,
  });
}
