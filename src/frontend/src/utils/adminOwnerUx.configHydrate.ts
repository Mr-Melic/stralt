/**
 * System-config forms that seed from localStorage can look live while
 * players still read the canister. Tiers never call getTierSpawnConfig.
 * Visuals never call getColorPalette. Palette Reset only clears local
 * keys — it does not call adminRollbackColorPalette.
 *
 * Unique 2026-10-23 file — do not merge into adminOwnerUx.publishGate.ts
 * (#775 Save-before-hydrate gate) or adminOwnerUx.configWriterBusy.ts
 * (#883 click lock). Not wired into AdminDashboard (stack).
 */

export type OwnerConfigSurface =
  | "levelUp"
  | "palette"
  | "bossRush"
  | "tiers"
  | "gameConfig";

export function ownerConfigFormIsLive(args: {
  calledCanisterRead: boolean;
  readSucceeded: boolean;
}): boolean {
  return args.calledCanisterRead === true && args.readSucceeded === true;
}

export function ownerConfigHydrateHonestyCopy(args: {
  calledCanisterRead: boolean;
  readSucceeded: boolean;
  seededFromLocalStorage: boolean;
}): string {
  if (args.calledCanisterRead !== true) {
    return "Browser cache only — not the live canister value. Players still use the last published config.";
  }
  if (args.readSucceeded !== true) {
    return "Canister read failed — this form is a local draft, not live.";
  }
  if (args.seededFromLocalStorage === true) {
    return "Showing live canister values. Local cache was a seed only.";
  }
  return "Showing live canister values.";
}

export function ownerPaletteResetIsLiveRevert(args: {
  clearedLocalStorage: boolean;
  calledAdminRollback: boolean;
}): boolean {
  return args.calledAdminRollback === true;
}

export function ownerPaletteResetHonestyCopy(args: {
  calledAdminRollback: boolean;
}): string {
  if (args.calledAdminRollback === true) {
    return "Live palette rolled back to the last-good canister snapshot.";
  }
  return "Local draft discarded. Live palette is unchanged until a canister rollback or publish.";
}

/** Documented main-branch hydrate behavior — not a live probe. */
export function ownerConfigSurfaceHydratesOnMain(
  surface: OwnerConfigSurface,
): boolean {
  return (
    surface === "levelUp" || surface === "bossRush" || surface === "gameConfig"
  );
}
