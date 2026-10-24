/**
 * Attack Nearest disabled hover reasons.
 * Display only — WorldExploration already composes canAttackNearest; BattleUIPanel
 * collapses mid-battle fails into one string. Not wired yet.
 */

export type AttackNearestGate =
  | "overworld"
  | "not_player_turn"
  | "wrong_mode"
  | "no_spell"
  | "cooldown"
  | "ap"
  | "no_target"
  | "ready";

const COPY: Record<AttackNearestGate, string> = {
  overworld: "Attack Nearest is usable once a fight starts",
  not_player_turn: "Wait for your turn to Attack Nearest",
  wrong_mode: "Switch to Attack mode, then Attack Nearest",
  no_spell: "Select a spell first, then Attack Nearest",
  cooldown: "That spell is on cooldown",
  ap: "Not enough AP for the selected spell",
  no_target: "No valid target in range / line of sight",
  ready: "Attack the nearest valid target",
};

export function attackNearestDisabledTitle(
  gate: AttackNearestGate,
  opts?: { isMobile?: boolean },
): string {
  if (gate === "ready") {
    return opts?.isMobile ? COPY.ready : `${COPY.ready} [S]`;
  }
  return COPY[gate];
}

/**
 * Resolve the first blocking gate from live flags (order matches player intent).
 * Callers still own canAttackNearest boolean; this only picks the hover string.
 */
export function resolveAttackNearestGate(flags: {
  inBattle: boolean;
  isPlayerTurn: boolean;
  attackMode: boolean;
  hasSpell: boolean;
  onCooldown: boolean;
  enoughAp: boolean;
  hasTarget: boolean;
}): AttackNearestGate {
  if (!flags.inBattle) return "overworld";
  if (!flags.isPlayerTurn) return "not_player_turn";
  if (!flags.attackMode) return "wrong_mode";
  if (!flags.hasSpell) return "no_spell";
  if (flags.onCooldown) return "cooldown";
  if (!flags.enoughAp) return "ap";
  if (!flags.hasTarget) return "no_target";
  return "ready";
}
