/**
 * Mid-fight spell-bar queue chrome. Display only — not wired into
 * WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-SPELLBAR-DEFER-TOAST (reported 2026-10-28, helper locked this run):
 * queue toast is `⚔️ Changes will apply after battle` (no noun). Flush
 * toast is `Spell bar changes applied after battle`. Do not apply the bar
 * mid-fight (that desyncs AP/slots).
 */

export const SPELLBAR_QUEUE_TOAST = "Spell bar changes apply after this fight.";

export const SPELLBAR_APPLIED_TOAST = "Spell bar changes applied.";
