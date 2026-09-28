/**
 * Official version / changelog persist is a frontend constant + localStorage,
 * not the canister appVersion / changelogShownVersions maps.
 *
 * App.tsx APP_VERSION ("v163") drives localStorage.clear() on mismatch
 * (the most destructive official client "migration"). markChangelogShown and
 * getChangelogShownVersion have no component callers. Dismiss only writes
 * pbv_show_changelog. Version-gate keep-list does not include those keys —
 * wipe is the point of a bump. Canister setAppVersion does not wipe browsers.
 *
 * Distinct from #508 / #577 (what the wipe must keep) and 09-25-003 (session
 * APIs unused by official play). No schema. Do not add a required Character
 * lastSeenVersion.
 */

import { shouldPreserveVersionGateKey } from "./versionGate.ts";

export function officialVersionWipeUsesFrontendAppVersion(): boolean {
  return true;
}

export function officialDismissMarksCanisterChangelog(): boolean {
  return false;
}

export function versionGatePreservesShowChangelogFlag(): boolean {
  return shouldPreserveVersionGateKey("pbv_show_changelog");
}

export function versionGatePreservesAppVersionKey(): boolean {
  return shouldPreserveVersionGateKey("pbv_app_version");
}

export function versionGatePreservesBossConfigCache(): boolean {
  return shouldPreserveVersionGateKey("pbv_boss_configs");
}

export function versionGatePreservesColorPaletteCache(): boolean {
  return shouldPreserveVersionGateKey("pbv_color_palette");
}

export function versionGatePreservesBossRushConfigCache(): boolean {
  return shouldPreserveVersionGateKey("pbv_boss_rush_config");
}

/** Frontend bump wipes; canister setAppVersion does not. Two authorities. */
export function frontendAndCanisterAppVersionsAreIndependent(): boolean {
  return true;
}
