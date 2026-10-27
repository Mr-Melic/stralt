/**
 * DoT tick battle-log chrome. Display only — not wired into
 * WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-DOT-LOG-ENGINEER: each tick dumps
 * `[DOT] target=… type=… tick=… stacks=[…] resReduc=…`. Player ticks also
 * already log `Player took N damage from {type} DoT` via playerTakesDamage.
 * Distinct from UX-GROUND-DOKA-LOG-ONLY (`[COLLECT]`) and
 * UX-STATUS-TURNS-SUFFIX (HUD pills).
 */

function floorNat(n: number): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

function displayName(raw: string): string {
  const name = String(raw ?? "").trim();
  return name || "An enemy";
}

/** One player-facing DoT tick line. No key=value dump, no [DOT] tag. */
export function dotTickLog(params: {
  targetId: string;
  targetName?: string;
  effectName: string;
  damage: number;
  stacksLeft: number;
}): string {
  const dmg = floorNat(params.damage);
  const stacks = floorNat(params.stacksLeft);
  const effect = displayName(params.effectName || "DoT");
  const isPlayer = params.targetId === "player";
  const who = isPlayer ? "You" : displayName(params.targetName ?? "");
  const verb = isPlayer ? "take" : "takes";
  const stackBit = stacks === 1 ? "1 stack left" : `${stacks} stacks left`;
  return `${who} ${verb} ${dmg} from ${effect} (${stackBit}).`;
}
