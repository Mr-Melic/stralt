/**
 * Owner-tool summon editor helpers.
 *
 * Persist already round-trips isSummon / summonAI / summonLifespan /
 * summonUnitDef via adminSetSpellConfig. The spell form used to omit those
 * controls, so operators could not author summon catalog rows without
 * failing validateSpellConfig.
 *
 * Unique 2026-09-25 file — do not merge into adminOwnerUx.ts (#470/#539).
 */

export const ADMIN_SUMMON_AIS = [
  "hunter",
  "guardian",
  "archer",
  "kiter",
  "bomber",
  "kamikaze",
  "healer",
] as const;

export const ADMIN_SUMMON_PIECES = [
  "king",
  "queen",
  "pawn",
  "rook",
  "bishop",
  "knight",
  "wolf",
  "golem",
  "archer",
  "bomber",
  "wisp",
] as const;

export type AdminSummonAi = (typeof ADMIN_SUMMON_AIS)[number];
export type AdminSummonPiece = (typeof ADMIN_SUMMON_PIECES)[number];

export type SummonEditorSlice = {
  spellType?: "damage" | "heal" | "drain" | "summon";
  effectType: string;
  isSummon?: boolean;
  summonAI?: string;
  summonLifespan?: number;
  summonUnitDef?: {
    pieceType: string;
    level: number;
    hpScale?: number;
    damageScale?: number;
  };
};

const EMPTY_UNIT = {
  pieceType: "",
  level: 0,
  hpScale: 0,
  damageScale: 0,
} as const;

function isKnownAi(ai: string | undefined): ai is AdminSummonAi {
  return (
    typeof ai === "string" &&
    (ADMIN_SUMMON_AIS as readonly string[]).includes(ai)
  );
}

function isKnownPiece(piece: string | undefined): piece is AdminSummonPiece {
  return (
    typeof piece === "string" &&
    (ADMIN_SUMMON_PIECES as readonly string[]).includes(piece)
  );
}

function clampLifespan(n: number): number {
  if (!Number.isFinite(n)) return 3;
  return Math.min(20, Math.max(1, Math.round(n)));
}

function clampLevel(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.min(99, Math.max(1, Math.round(n)));
}

function clampScale(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.min(10, Math.max(0, n));
}

function readyUnit(
  def: SummonEditorSlice["summonUnitDef"],
): NonNullable<SummonEditorSlice["summonUnitDef"]> {
  const piece = isKnownPiece(def?.pieceType) ? def.pieceType : "pawn";
  const level = def?.level && def.level > 0 ? clampLevel(def.level) : 1;
  const hpScale =
    def?.hpScale != null && def.hpScale > 0 ? clampScale(def.hpScale) : 1;
  const damageScale =
    def?.damageScale != null && def.damageScale > 0
      ? clampScale(def.damageScale)
      : 1;
  return { pieceType: piece, level, hpScale, damageScale };
}

export function applySpellTypeChange<T extends SummonEditorSlice>(
  prev: T,
  nextType: NonNullable<SummonEditorSlice["spellType"]>,
): T {
  if (nextType === "summon") {
    return {
      ...prev,
      spellType: "summon",
      effectType: "summon",
      isSummon: true,
      summonAI: isKnownAi(prev.summonAI) ? prev.summonAI : "hunter",
      summonLifespan:
        prev.summonLifespan && prev.summonLifespan > 0
          ? clampLifespan(prev.summonLifespan)
          : 3,
      summonUnitDef: readyUnit(prev.summonUnitDef),
    };
  }
  const clearing = prev.spellType === "summon" || prev.isSummon === true;
  if (!clearing) return { ...prev, spellType: nextType };
  return {
    ...prev,
    spellType: nextType,
    isSummon: false,
    summonAI: "",
    summonLifespan: 0,
    summonUnitDef: { ...EMPTY_UNIT },
  };
}

export function applySummonEnabled<T extends SummonEditorSlice>(
  prev: T,
  enabled: boolean,
): T {
  if (enabled) return applySpellTypeChange(prev, "summon");
  if (!prev.isSummon && prev.spellType !== "summon") return prev;
  const keepType =
    prev.spellType === "summon" ? "damage" : (prev.spellType ?? "damage");
  return {
    ...prev,
    spellType: keepType,
    isSummon: false,
    summonAI: "",
    summonLifespan: 0,
    summonUnitDef: { ...EMPTY_UNIT },
  };
}

export function patchSummonField<T extends SummonEditorSlice>(
  prev: T,
  field:
    | "summonAI"
    | "summonLifespan"
    | "pieceType"
    | "level"
    | "hpScale"
    | "damageScale",
  value: string | number,
): T {
  if (!prev.isSummon && prev.spellType !== "summon") return prev;
  const unit = readyUnit(prev.summonUnitDef);
  if (field === "summonAI") {
    const ai = String(value);
    return { ...prev, summonAI: isKnownAi(ai) ? ai : prev.summonAI };
  }
  if (field === "summonLifespan") {
    return { ...prev, summonLifespan: clampLifespan(Number(value)) };
  }
  if (field === "pieceType") {
    const piece = String(value);
    return {
      ...prev,
      summonUnitDef: {
        ...unit,
        pieceType: isKnownPiece(piece) ? piece : unit.pieceType,
      },
    };
  }
  if (field === "level") {
    return {
      ...prev,
      summonUnitDef: { ...unit, level: clampLevel(Number(value)) },
    };
  }
  if (field === "hpScale") {
    return {
      ...prev,
      summonUnitDef: { ...unit, hpScale: clampScale(Number(value)) },
    };
  }
  return {
    ...prev,
    summonUnitDef: { ...unit, damageScale: clampScale(Number(value)) },
  };
}
