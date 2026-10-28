/**
 * Buff / DoT apply battle-log chrome. Display only — not wired into
 * WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-EFFECT-APPLY-TARGETID: applyActiveEffect logs
 * `{name}: {mag} {STAT} on ${targetName}` where targetName is `you` for the
 * player and raw `effect.targetId` otherwise (`e-3`, `summon-12`). Distinct
 * from UX-HIT-LOG-PIECETYPE (damage lines) and UX-CHAT-STATUS-ENEMY-ID
 * (Status tab headings).
 */

function floorNat(n: number): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

function displayName(raw: string): string {
  const name = String(raw ?? "").trim();
  return name || "Effect";
}

/** Player → "you". Named unit → that name. Never an intern id. */
export function applyEffectTargetLabel(
  targetId: string,
  unitName?: string,
): string {
  if (String(targetId ?? "") === "player") return "you";
  const named = String(unitName ?? "").trim();
  if (named) return named;
  return "an enemy";
}

export function applyEffectLog(params: {
  effectName: string;
  targetLabel: string;
  duration: number;
  isDot: boolean;
  dmgPerTurn?: number;
  signedMag?: string;
  stat?: string;
}): string {
  const name = displayName(params.effectName);
  const who = String(params.targetLabel ?? "").trim() || "an enemy";
  const turns = floorNat(params.duration);
  const turnBit = turns === 1 ? "1 turn" : `${turns} turns`;
  if (params.isDot) {
    const dmg = floorNat(params.dmgPerTurn ?? 0);
    return `${name}: ${dmg} damage per turn on ${who} (${turnBit}).`;
  }
  const mag = String(params.signedMag ?? "").trim();
  const st = String(params.stat ?? "")
    .trim()
    .toUpperCase();
  const magBit = mag && st ? `: ${mag} ${st}` : "";
  return `${name}${magBit} on ${who} (${turnBit}).`;
}
