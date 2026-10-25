/**
 * Shop-package catalog hard-delete (SDEG-2026-10-25-005).
 *
 * adminDeleteShopPackage is shopPackages.remove with a last-row floor, no
 * alias table, no purchaseRecords rewrite. Historical KYC rows keep packageId.
 * initiatePurchase is a stub (#err); GameKey replaced auto-complete. Character
 * stores no package ids today — do not add a required Character.packageId
 * without a later chain file after 20260901 and aliases.
 *
 * Distinct from enemy/region/modifier hard-delete (SDEG-2026-10-24-014/018)
 * and from GameKey ledger one-shot redeem.
 */

export function shopPackageDeleteIsHardRemove(): boolean {
  return true;
}

export function lastShopPackageIsProtected(): boolean {
  return true;
}

export function purchaseRecordsKeepPackageIdAfterDelete(): boolean {
  return true;
}

export function characterStoresShopPackageId(): boolean {
  return false;
}

export function persistingPackageIdOnCharacterWouldBreakOldPlayers(): boolean {
  return true;
}

export function officialClientWritesPurchaseRecords(): boolean {
  return false;
}
