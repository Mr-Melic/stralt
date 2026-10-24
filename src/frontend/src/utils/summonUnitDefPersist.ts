/**
 * SummonUnitDef persist surface vs combat kit fields.
 *
 * Motoko / bindgen SummonUnitDef is only pieceType, level, hpScale,
 * damageScale. Frontend combat also carries summonKit / ap / mp on
 * starterSpells. toBackendSummonUnitDef + fromBackendSpellConfig drop the
 * kit fields, so an admin round-trip cannot persist player-control kits.
 */

export const MOTOKO_SUMMON_UNIT_DEF_FIELDS = [
  "pieceType",
  "level",
  "hpScale",
  "damageScale",
] as const;

export const FRONTEND_ONLY_SUMMON_UNIT_DEF_FIELDS = [
  "summonKit",
  "ap",
  "mp",
] as const;

export type SummonUnitDefLike = {
  pieceType?: string;
  level?: number;
  hpScale?: number;
  damageScale?: number;
  summonKit?: string[];
  ap?: number;
  mp?: number;
};

/** Shape written/read through adminContract ↔ Motoko SpellConfig.summonUnitDef. */
export function toPersistedSummonUnitDef(
  def: SummonUnitDefLike | null | undefined,
): {
  pieceType: string;
  level: number;
  hpScale: number;
  damageScale: number;
} {
  if (def == null) {
    return { pieceType: "", level: 0, hpScale: 0, damageScale: 0 };
  }
  return {
    pieceType: typeof def.pieceType === "string" ? def.pieceType : "",
    level: Math.max(0, Math.floor(Number(def.level) || 0)),
    hpScale: Number(def.hpScale) || 0,
    damageScale: Number(def.damageScale) || 0,
  };
}

/** True when a combat kit would be lost on canister round-trip. */
export function summonKitLostOnBackendRoundTrip(
  def: SummonUnitDefLike | null | undefined,
): boolean {
  const kit = def?.summonKit;
  if (!Array.isArray(kit) || kit.length === 0) return false;
  const persisted = toPersistedSummonUnitDef(def);
  return !("summonKit" in persisted);
}

export function frontendOnlySummonFieldsPresent(
  def: SummonUnitDefLike | null | undefined,
): string[] {
  if (def == null) return [];
  return FRONTEND_ONLY_SUMMON_UNIT_DEF_FIELDS.filter((k) => {
    const v = def[k];
    if (k === "summonKit") return Array.isArray(v) && v.length > 0;
    return v != null && Number(v) !== 0;
  });
}
