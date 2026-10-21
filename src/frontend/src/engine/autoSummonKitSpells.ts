/**
 * Player auto-summon catalog kit lookup.
 *
 * spawnSummonUnit never copies summonUnitDef.summonKit onto summon.spells.
 * SummonControlPanel / resolveSummonControlSpell already resolve that kit for
 * a clicked id. Hostile spawn attach is #842 (attachEnemySummonKit on
 * spawnEnemySummonUnit only). The live auto-summon decide at
 * WorldExploration ~15172 still passes `summonEnemy.spells ?? []`, so
 * findKitSpell misses every catalog id.
 *
 * Player-only kits (Bomber Inferno, Sentinel Shield, Wisp Blood Mend) never
 * auto-cast. Bomber decide holds immediately when Inferno is missing, so the
 * unit neither detonates nor walks to a cluster. Control-mode clicks still
 * work. Restack WX availableSpells/assignedSpells onto
 * resolveAutoSummonAvailableSpells after #842 lands — do not restack WX here.
 */

export function shouldPreferCatalogSummonKit(
  storedSpells: readonly unknown[] | null | undefined,
): boolean {
  return !Array.isArray(storedSpells) || storedSpells.length === 0;
}

export function catalogSummonKitIds(
  pieceType: string | undefined,
  catalog: ReadonlyArray<{
    id: string;
    summonUnitDef?: { pieceType?: string; summonKit?: string[] };
  }>,
): string[] {
  const key = (pieceType ?? "").trim();
  if (!key) return [];
  const unitDef = catalog.find(
    (row) => row.summonUnitDef?.pieceType === key,
  )?.summonUnitDef;
  const ids = unitDef?.summonKit;
  return Array.isArray(ids) ? ids.filter((id) => typeof id === "string") : [];
}

export function resolveCatalogSummonKitSpells<T extends { id: string }>(
  pieceType: string | undefined,
  catalog: ReadonlyArray<
    T & { summonUnitDef?: { pieceType?: string; summonKit?: string[] } }
  >,
): T[] {
  const ids = catalogSummonKitIds(pieceType, catalog);
  if (ids.length === 0) return [];
  const out: T[] = [];
  for (const id of ids) {
    const row = catalog.find((spell) => spell.id === id);
    if (row) out.push(row);
  }
  return out;
}

/**
 * Spells decideSummonAction should see. Honour a non-empty stored list so a
 * later #842 hostile attach is not overwritten. Empty/missing stored lists
 * fall through to the catalog summonKit for this pieceType.
 */
export function resolveAutoSummonAvailableSpells<T extends { id: string }>(
  summon: { pieceType?: string; spells?: T[] | null },
  catalog: ReadonlyArray<
    T & { summonUnitDef?: { pieceType?: string; summonKit?: string[] } }
  >,
): T[] {
  if (!shouldPreferCatalogSummonKit(summon.spells)) {
    return summon.spells as T[];
  }
  return resolveCatalogSummonKitSpells(summon.pieceType, catalog);
}
