/**
 * Player-controlled summon casts.
 *
 * SummonControlPanel lists kit spells from starterSpells via
 * summonUnitDef.summonKit. spawnSummonUnit never copies that kit onto
 * summon.spells, so looking up selectedSummonSpellId on summon.spells
 * silently no-ops — the panel buttons do nothing.
 *
 * Resolve the kit the same way the panel does, then gate on AP and
 * Chebyshev range before resolveSpellCast. Debit AP after the attempt
 * (including fizzle) so a 2-AP Archer cannot wipe the room in one turn.
 */

export interface SummonKitCatalogSpell {
  id: string;
  name?: string;
  apCost?: unknown;
  range?: unknown;
  summonUnitDef?: {
    pieceType?: string;
    summonKit?: string[];
  };
}

export type SummonControlCastFail = "no_spell" | "no_ap" | "out_of_range";

export type SummonControlCastPlan<T extends SummonKitCatalogSpell> =
  | { ok: false; reason: SummonControlCastFail }
  | {
      ok: true;
      spell: T;
      remainingAp: number;
      breaksStriker: boolean;
    };

export function resolveSummonControlSpell<T extends SummonKitCatalogSpell>(
  pieceType: string,
  spellId: string,
  catalog: T[],
  fallbackSpells: T[] = [],
): T | undefined {
  const unitDef = catalog.find(
    (sp) => sp.summonUnitDef?.pieceType === pieceType,
  )?.summonUnitDef;
  const kitIds = Array.isArray(unitDef?.summonKit) ? unitDef.summonKit : [];
  if (kitIds.includes(spellId)) {
    const fromCatalog = catalog.find((sp) => sp.id === spellId);
    if (fromCatalog) return fromCatalog;
  }
  return fallbackSpells.find((sp) => sp.id === spellId);
}

export function chebyshevDistance(
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  const dx = Math.abs(Number(b.x) - Number(a.x));
  const dy = Math.abs(Number(b.y) - Number(a.y));
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) {
    return Number.POSITIVE_INFINITY;
  }
  return Math.max(dx, dy);
}

export function planSummonControlCast<T extends SummonKitCatalogSpell>(args: {
  pieceType: string;
  spellId: string;
  catalog: T[];
  fallbackSpells?: T[];
  currentAp: number;
  caster: { x: number; y: number };
  target: { x: number; y: number };
}): SummonControlCastPlan<T> {
  const spell = resolveSummonControlSpell(
    args.pieceType,
    args.spellId,
    args.catalog,
    args.fallbackSpells,
  );
  if (!spell) return { ok: false, reason: "no_spell" };

  const cost = Math.max(0, Math.floor(Number(spell.apCost) || 0));
  const ap = Math.max(0, Math.floor(Number(args.currentAp) || 0));
  if (ap < cost) return { ok: false, reason: "no_ap" };

  const range = Math.max(1, Math.floor(Number(spell.range) || 0));
  const dist = chebyshevDistance(args.caster, args.target);
  if (dist > range) return { ok: false, reason: "out_of_range" };

  return {
    ok: true,
    spell,
    remainingAp: ap - cost,
    // legendary_3 Striker: every spent attempt must land within 2 tiles
    // of the caster (the summon tile, not the player).
    breaksStriker: dist > 2,
  };
}

export function summonControlCastFailMessage(
  reason: SummonControlCastFail,
): string {
  switch (reason) {
    case "no_ap":
      return "Not enough AP";
    case "out_of_range":
      return "Out of range";
    default:
      return "Unknown spell";
  }
}

/**
 * Summon-control id after a turn advance.
 *
 * Previous control is never carried forward. The 30s turn timer (and any
 * other advanceTurn caller) used to leave activeControlledSummonId set, so
 * canvas clicks and BattleUIPanel End Turn stayed locked to the summon
 * through later player and enemy turns.
 */
export function summonControlIdAfterAdvance(
  nextCombatant:
    | { id?: string; isSummon?: boolean; side?: string }
    | null
    | undefined,
): string | null {
  if (
    nextCombatant &&
    nextCombatant.isSummon === true &&
    nextCombatant.side === "player" &&
    typeof nextCombatant.id === "string" &&
    nextCombatant.id.length > 0
  ) {
    return nextCombatant.id;
  }
  return null;
}
