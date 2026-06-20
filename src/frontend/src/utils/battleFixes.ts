import type { CharacterStats } from "../backend";
import type { ActiveEffect, Enemy } from "../types/gameTypes";

export function getEffectiveStats(
  baseStats: CharacterStats,
  effects: ActiveEffect[],
): CharacterStats {
  const effective = { ...baseStats };
  for (const effect of effects) {
    if (effect.stat && effect.modifier !== undefined) {
      const current = Number(
        (effective as Record<string, unknown>)[effect.stat],
      );
      if (effect.type === "buff" && effect.modifier > 0) {
        (effective as Record<string, unknown>)[effect.stat] = Math.floor(
          current * (1 + Math.abs(effect.modifier) / 100),
        );
      } else if (effect.type === "debuff" && effect.modifier < 0) {
        (effective as Record<string, unknown>)[effect.stat] = Math.floor(
          current * (1 - Math.abs(effect.modifier) / 100),
        );
      } else if (effect.type === "dot") {
        // DoT effects do not modify stats directly
      }
    }
  }
  return effective;
}

export function getEffectiveEnemyStats(
  enemy: Enemy,
  effects: ActiveEffect[],
): Enemy {
  const effective = { ...enemy };
  for (const effect of effects) {
    if (effect.stat && effect.modifier !== undefined) {
      const current = Number(
        (effective as Record<string, unknown>)[effect.stat],
      );
      if (effect.type === "buff" && effect.modifier > 0) {
        (effective as Record<string, unknown>)[effect.stat] = Math.floor(
          current * (1 + Math.abs(effect.modifier) / 100),
        );
      } else if (effect.type === "debuff" && effect.modifier < 0) {
        (effective as Record<string, unknown>)[effect.stat] = Math.floor(
          current * (1 - Math.abs(effect.modifier) / 100),
        );
      } else if (effect.type === "dot") {
        // DoT effects do not modify stats directly
      }
    }
  }
  return effective;
}

export interface ChallengeRefs {
  challengeHealUsedRef: React.MutableRefObject<boolean>;
  challengeTotalDamageRef: React.MutableRefObject<number>;
  challengeTurnCountRef: React.MutableRefObject<number>;
  challengeMaxApThisTurnRef: React.MutableRefObject<number>;
  challengePhysicalOnlyRef: React.MutableRefObject<boolean>;
}

export function evaluateChallenges(
  refs: ChallengeRefs,
  playerHp: number,
  playerMaxHp: number,
): { id: string; status: "on_track" | "failed" | "completed" }[] {
  const results: { id: string; status: "on_track" | "failed" | "completed" }[] =
    [];

  // no_healing
  results.push({
    id: "no_healing",
    status: refs.challengeHealUsedRef.current ? "failed" : "on_track",
  });

  // under_15_turns
  results.push({
    id: "under_15_turns",
    status: refs.challengeTurnCountRef.current > 15 ? "failed" : "on_track",
  });

  // physical_only
  results.push({
    id: "physical_only",
    status: !refs.challengePhysicalOnlyRef.current ? "failed" : "on_track",
  });

  // survive_with_50_hp
  results.push({
    id: "survive_with_50_hp",
    status: playerHp < playerMaxHp * 0.5 ? "failed" : "on_track",
  });

  // deal_500_damage
  results.push({
    id: "deal_500_damage",
    status:
      refs.challengeTotalDamageRef.current >= 500 ? "completed" : "on_track",
  });

  return results;
}
