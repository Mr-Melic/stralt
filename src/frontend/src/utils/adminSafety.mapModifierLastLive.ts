/**
 * Client mirror of AdminGuard.mapModifierLastLiveRejected.
 * Do not add this to adminSafety.ts — queued PRs already own that file.
 * Backend enforcement is authoritative.
 *
 * Failure: official Admin unchecks "Eligible for portal modifier roll" on
 * Slime Flood then Paper Windstorm (or sets the last remaining
 * triggerChance to 0). Seeded hard-delete is a different helper. Engine
 * rollActiveModifiers keeps only active registry ids with weight > 0.
 */

const SEEDED_MAP_MODIFIER_IDS = ["slime_flood", "paper_windstorm"] as const;

function isSeededMapModifierId(id: string): boolean {
  return (SEEDED_MAP_MODIFIER_IDS as readonly string[]).includes(id);
}

function liveWeight(chance: number | bigint | undefined): number {
  if (chance === undefined) return 20;
  const n = Number(chance);
  return Number.isFinite(n) ? n : 0;
}

export function mapModifierLastLiveRejected(args: {
  incoming: {
    id: string;
    active: boolean;
    triggerChance?: number | bigint;
  };
  existing: ReadonlyArray<{
    id: string;
    active: boolean;
    triggerChance?: number | bigint;
  }>;
}): string | null {
  if (!args.incoming.id) return "Map modifier id cannot be empty";
  if (args.incoming.id.length > 64) {
    return "Map modifier id exceeds maximum length";
  }
  if (!isSeededMapModifierId(args.incoming.id)) return null;
  if (args.incoming.active && liveWeight(args.incoming.triggerChance) > 0) {
    return null;
  }
  const otherLive = args.existing.filter(
    (c) =>
      c.id !== args.incoming.id &&
      isSeededMapModifierId(c.id) &&
      c.active &&
      liveWeight(c.triggerChance) > 0,
  ).length;
  if (otherLive === 0) {
    return "Cannot empty the live built-in map-modifier pool";
  }
  return null;
}
