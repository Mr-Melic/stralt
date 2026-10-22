/**
 * Live catalog Save (enemy / spell / region / modifier / achievement /
 * sprite) has no confirm on main — one click publishes. Cancel must not
 * write.
 *
 * Unique 2026-10-22 file — do not merge into adminOwnerUx.livePublish.ts
 * (#539 system-config bodies), adminOwnerUx.catalogPublish.ts (#564 list
 * notes), or adminOwnerUx.changelogPublish.ts (#838).
 */

export type OwnerLiveCatalogKind =
  | "enemy"
  | "spell"
  | "region"
  | "modifier"
  | "achievement"
  | "sprite";

const KIND_LABEL: Record<OwnerLiveCatalogKind, string> = {
  enemy: "enemy spawn template",
  spell: "spell",
  region: "region",
  modifier: "map modifier",
  achievement: "achievement",
  sprite: "player sprite",
};

export function ownerLiveCatalogSaveConfirmTitle(
  kind: OwnerLiveCatalogKind,
  name: string,
): string {
  const label = KIND_LABEL[kind];
  const trimmed = name.trim();
  if (!trimmed) return `Publish live ${label}?`;
  return `Publish live ${label} "${trimmed}"?`;
}

export function ownerLiveCatalogSaveConfirmBody(
  kind: OwnerLiveCatalogKind,
): string {
  if (kind === "enemy") {
    return "This publishes the spawn template to the live enemy catalog immediately. Encounter rolls pick it up after the next hydrate. Combat identity (damage/res/sp/sr/chc) is not on this form. Cancel does not write.";
  }
  if (kind === "spell") {
    return "This publishes the spell to the live catalog immediately. Summon fields persist when present; this editor still has no summon controls. Cancel does not write.";
  }
  if (kind === "region") {
    return "This publishes the region template to the live catalog immediately. Enemies assigned to it spawn there after the next hydrate. Cancel does not write.";
  }
  if (kind === "modifier") {
    return "This publishes the map modifier to the live catalog immediately. Active chance rolls use the stored row. Cancel does not write.";
  }
  if (kind === "achievement") {
    return "This publishes the achievement to the live catalog immediately. The active flag is player-visible on the next hydrate. Cancel does not write.";
  }
  return "This publishes the player-sprite catalog row immediately. World combat still uses chess-piece pixels until a renderer is wired. Cancel does not write.";
}

export function shouldPublishLiveCatalog(args: {
  confirmed: boolean;
}): boolean {
  return args.confirmed === true;
}
