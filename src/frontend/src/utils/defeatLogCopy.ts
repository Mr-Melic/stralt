/**
 * Battle-end outcome chrome. Display only — not wired into
 * WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-DEFEAT-RETURNING-MAP: handleBattleEnd logs `Defeated! Returning to map.`
 * on a loss. Combat death then opens Game Over → Death Realm; lava/spikes
 * fire the root recap and auto-enter the realm in 1.5s. Distinct from
 * UX-DEATH-DUAL-MODAL (two death UIs) and UX-RECAP-CONTINUE-VOID (recap CTA).
 */

export const VICTORY_LOG = "Victory! All enemies defeated.";

export const DEFEAT_LOG = "Defeated — next you enter the Death Realm.";
