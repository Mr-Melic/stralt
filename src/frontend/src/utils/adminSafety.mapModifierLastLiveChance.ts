/**
 * Client mirror of AdminGuard.mapModifierLastLiveChanceRejected.
 * Do not add this to adminSafety.ts — queued PRs already own that file.
 * Do not recopy mapModifierLastLiveRejected (#650) — that path is
 * adminSetMapModifier, not this convenience chance endpoint.
 * Backend enforcement is authoritative.
 *
 * Failure: official Admin sets triggerChance=0 on the last remaining
 * seeded row via adminSetMapModifierChance. Full-row last-live is a
 * different helper. rollActiveModifiers keeps active registry ids;
 * pickWeighted with total weight 0 never rolls.
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

export function mapModifierLastLiveChanceRejected(args: {
  id: string;
  chance: number;
  existing: ReadonlyArray<{
    id: string;
    active: boolean;
    triggerChance?: number | bigint;
  }>;
}): string | null {
  if (!args.id) return "Map modifier id cannot be empty";
  if (args.id.length > 64) {
    return "Map modifier id exceeds maximum length";
  }
  const chance = Number(args.chance);
  if (!Number.isFinite(chance) || chance < 0 || chance > 100) {
    return "chance must be between 0 and 100";
  }
  if (chance > 0) return null;
  if (!isSeededMapModifierId(args.id)) return null;
  const row = args.existing.find((c) => c.id === args.id);
  if (row && row.active === false) return null;
  const otherLive = args.existing.filter(
    (c) =>
      c.id !== args.id &&
      isSeededMapModifierId(c.id) &&
      c.active &&
      liveWeight(c.triggerChance) > 0,
  ).length;
  if (otherLive === 0) {
    return "Cannot empty the live built-in map-modifier pool";
  }
  return null;
}
