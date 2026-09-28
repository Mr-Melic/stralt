/**
 * Read-only owner dependency badges. Counts only — never mutate.
 * Zero relations is a valid empty set, not an error.
 */

export type OwnerDependencyEntity = "spell" | "enemy" | "asset";

export type OwnerDependencyRelation =
  | "enemyPools"
  | "achievements"
  | "challenges"
  | "bosses"
  | "aiRequirements"
  | "acquisitionRoutes"
  | "spells"
  | "visualPool"
  | "formations"
  | "encounters"
  | "dungeonUsage"
  | "enemyBossUsage";

const RELATION_LABEL: Record<OwnerDependencyRelation, string> = {
  enemyPools: "Enemy pools",
  achievements: "Achievements",
  challenges: "Challenges",
  bosses: "Bosses",
  aiRequirements: "AI requirements",
  acquisitionRoutes: "Acquisition routes",
  spells: "Spells",
  visualPool: "Visual pool",
  formations: "Formations",
  encounters: "Encounters",
  dungeonUsage: "Dungeon usage",
  enemyBossUsage: "Enemy / boss usage",
};

export type OwnerDependencyBadge = {
  entity: OwnerDependencyEntity;
  relation: OwnerDependencyRelation;
  label: string;
  count: number;
  countLabel: string;
  emptyIsValid: true;
  isError: false;
};

function normalizeCount(count: number): number {
  if (typeof count !== "number" || !Number.isFinite(count)) return 0;
  return Math.max(0, Math.floor(count));
}

export function ownerDependencyBadge(
  entity: OwnerDependencyEntity,
  relation: OwnerDependencyRelation,
  count: number,
): OwnerDependencyBadge {
  const n = normalizeCount(count);
  const label = RELATION_LABEL[relation];
  return {
    entity,
    relation,
    label,
    count: n,
    countLabel: n === 0 ? `${label} — none` : `${label} — ${n}`,
    emptyIsValid: true,
    isError: false,
  };
}

export function ownerSpellDependencyRail(counts: {
  enemyPools?: number;
  achievements?: number;
  challenges?: number;
  bosses?: number;
  aiRequirements?: number;
  acquisitionRoutes?: number;
}): OwnerDependencyBadge[] {
  return (
    [
      "enemyPools",
      "achievements",
      "challenges",
      "bosses",
      "aiRequirements",
      "acquisitionRoutes",
    ] as const
  ).map((relation) =>
    ownerDependencyBadge("spell", relation, counts[relation] ?? 0),
  );
}

export function ownerEnemyDependencyRail(counts: {
  spells?: number;
  visualPool?: number;
  formations?: number;
  encounters?: number;
  dungeonUsage?: number;
}): OwnerDependencyBadge[] {
  return (
    [
      "spells",
      "visualPool",
      "formations",
      "encounters",
      "dungeonUsage",
    ] as const
  ).map((relation) =>
    ownerDependencyBadge("enemy", relation, counts[relation] ?? 0),
  );
}

export function ownerAssetDependencyRail(counts: {
  enemyBossUsage?: number;
}): OwnerDependencyBadge[] {
  return [
    ownerDependencyBadge("asset", "enemyBossUsage", counts.enemyBossUsage ?? 0),
  ];
}
