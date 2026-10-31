/**
 * Player-cast summon spawn chrome. Display only — not wired into
 * spellEngine.ts (forbidden while older open PRs own that file).
 *
 * UX-SUMMON-SPAWN-PIECETYPE: applySummon logs
 * `${spell.name} summoned a ${def.pieceType}!` so Dire Wolf reads
 * `Summon Dire Wolf summoned a wolf!`. Distinct from
 * UX-SUMMON-KIT-CAST-PIECETYPE (kit press), UX-SUMMON-EXPIRED-PIECETYPE
 * (fade), UX-SUMMON-NAME-PIECETYPE (control bar), and
 * UX-SUMMON-AI-LOG-DUMP (AI tags).
 */

const PIECE_DISPLAY: Record<string, string> = {
  wolf: "Dire Wolf",
  golem: "Sentinel",
  archer: "Archer",
  bomber: "Bomber",
  wisp: "Wisp",
};

function displayName(raw: string, fallback: string): string {
  const name = String(raw ?? "").trim();
  return name || fallback;
}

/** Prefer an assigned unit name. Never a raw chess pieceType. */
export function summonSpawnUnitLabel(unit: {
  name?: string;
  assignedName?: string;
  pieceType?: string;
}): string {
  const named = String(unit.name ?? "").trim();
  if (named) return named;
  const assigned = String(unit.assignedName ?? "").trim();
  if (assigned) return assigned;
  const piece = String(unit.pieceType ?? "")
    .trim()
    .toLowerCase();
  if (piece && PIECE_DISPLAY[piece]) return PIECE_DISPLAY[piece];
  return "a summon";
}

export function summonSpawnLog(spellName: string, unitName: string): string {
  const spell = displayName(spellName, "The spell");
  const who = displayName(unitName, "a summon");
  return `${spell} summoned ${who}!`;
}
