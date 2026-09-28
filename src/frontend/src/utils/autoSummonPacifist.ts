/**
 * Pacifist Run (`pacifist_run`, 500 Doka) on the auto-summon AI path.
 *
 * Player-bar casts flip `battleOnlyHealBuffSpellsRef` through
 * `recordPlayerSpellType`. Player-controlled kit casts go through
 * `resolveSpellCast` (queued #714). Auto-summon turns call
 * `executeSummonAction` instead — Poison Arrow / Inferno / Strike /
 * melee never hit that hook, so a room cleared by an uncontrolled
 * Archer still unlocked the feat.
 *
 * Categories match `recordPlayerSpellType`. Heal / buff / debuff-only
 * (Slow) keep the feat. Unique vs #714: `kind === "move"` then a
 * cast/melee follow-up inside the executor — inspecting only the
 * decided kind would keep pacifist_run. Do not restack
 * WorldExploration / summonExecutor / pacifistRun.ts.
 */

const OFFENSIVE_SPELL_EFFECT_TYPES = [
  "damage",
  "drain",
  "aoe",
  "dot",
  "pushback",
  "attract",
  "cc",
  "teleport",
] as const;

export type AutoSummonPacifistAction = {
  kind: string;
  spell?: {
    effectType?: unknown;
    healAmount?: unknown;
    damage?: unknown;
  } | null;
};

export function autoSummonEffectBreaksPacifist(
  effectType: string | undefined | null,
): boolean {
  const cat = String(effectType ?? "").toLowerCase();
  return (OFFENSIVE_SPELL_EFFECT_TYPES as readonly string[]).includes(cat);
}

/**
 * Poison Arrow / Inferno advertise `damage: 0` and `effectType: "dot"`.
 * A wallet check on `Number(spell.damage)` would keep pacifist_run after
 * the executor's applyEffect branch.
 *
 * Default `effectType ?? "damage"` matches `recordSpellType` on the
 * player-bar path.
 */
export function autoSummonResolvedActionBreaksPacifist(
  action: AutoSummonPacifistAction,
): boolean {
  if (action.kind === "melee") return true;
  if (action.kind !== "cast") return false;
  const heal = Number(action.spell?.healAmount ?? 0);
  const dmg = Number(action.spell?.damage ?? 0);
  const healOnly =
    Number.isFinite(heal) && heal > 0 && !(Number.isFinite(dmg) && dmg > 0);
  if (healOnly) return false;
  return autoSummonEffectBreaksPacifist(
    String(action.spell?.effectType ?? "damage"),
  );
}

/**
 * `executeSummonAction` may apply a cast/melee follow-up after a move.
 * WorldExploration only sees the decided `kind === "move"` unless this
 * follow-up is passed through.
 */
export function pacifistAfterAutoSummonExecutor(
  currentlyPacifist: boolean,
  decided: AutoSummonPacifistAction,
  appliedFollowUp?: AutoSummonPacifistAction | null,
): boolean {
  if (!currentlyPacifist) return false;
  if (autoSummonResolvedActionBreaksPacifist(decided)) return false;
  if (
    appliedFollowUp &&
    autoSummonResolvedActionBreaksPacifist(appliedFollowUp)
  ) {
    return false;
  }
  return true;
}
