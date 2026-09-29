/**
 * Nearby portal labels. Display only.
 *
 * WorldExploration draws a carved caption only when the whirlpool is
 * dungeon-colored or a dungeon chain is already active (~7916). Rest, boss,
 * colored explore, white sanctuary, and Death Realm exits stay unlabeled.
 *
 * This helper is locked, not wired — WorldExploration is in older open PRs
 * (#327 / #331 / #340 and later). Wire nearbyPortalLabel after those land.
 * Do not change spawn, keep-clear, or portalRules.
 */

export type NearbyPortalKind =
  | "dungeon"
  | "dungeon_continue"
  | "rest"
  | "boss"
  | "explore"
  | "sanctuary"
  | "death_realm_exit";

export function nearbyPortalLabel(
  kind: NearbyPortalKind,
  chain?: { depth: number; max: number },
): string {
  switch (kind) {
    case "dungeon":
      return "Enter Dungeon Chain";
    case "dungeon_continue": {
      const depth = Number.isFinite(chain?.depth)
        ? Math.max(0, Math.floor(chain?.depth ?? 0))
        : 0;
      const max = Number.isFinite(chain?.max)
        ? Math.max(0, Math.floor(chain?.max ?? 0))
        : 0;
      return `Continue Chain (${depth}/${max})`;
    }
    case "rest":
      return "Rest";
    case "boss":
      return "Boss";
    case "explore":
      return "Explore";
    case "sanctuary":
      return "Sanctuary";
    case "death_realm_exit":
      return "Death Realm exit";
  }
}
