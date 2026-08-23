import { describe, expect, it } from "vitest";
import { type ChallengeRefs, evaluateChallenges } from "../battleFixes";

function refs(overrides: Partial<Record<keyof ChallengeRefs, unknown>> = {}) {
  return {
    challengeHealUsedRef: { current: false },
    challengeTotalDamageRef: { current: 0 },
    challengeTurnCountRef: { current: 1 },
    challengeMaxApThisTurnRef: { current: 0 },
    challengeDirectHitRef: { current: true },
    ...overrides,
  } as ChallengeRefs;
}

function statusById(playerHp: number, playerMaxHp: number, r: ChallengeRefs) {
  return Object.fromEntries(
    evaluateChallenges(r, playerHp, playerMaxHp).map((row) => [
      row.id,
      row.status,
    ]),
  );
}

describe("evaluateChallenges", () => {
  it("keeps every challenge on_track at the passing boundaries", () => {
    const result = statusById(
      50,
      100,
      refs({
        challengeTurnCountRef: { current: 15 },
        challengeTotalDamageRef: { current: 499 },
      }),
    );
    expect(result).toEqual({
      no_healing: "on_track",
      under_15_turns: "on_track",
      direct_hit: "on_track",
      survive_with_50_hp: "on_track",
      deal_500_damage: "on_track",
    });
  });

  it("fails no-heal / turn-cap / direct-hit / half-HP and completes the damage challenge at its floor", () => {
    const result = statusById(
      49,
      100,
      refs({
        challengeHealUsedRef: { current: true },
        challengeTurnCountRef: { current: 16 },
        challengeDirectHitRef: { current: false },
        challengeTotalDamageRef: { current: 500 },
      }),
    );
    expect(result).toEqual({
      no_healing: "failed",
      under_15_turns: "failed",
      direct_hit: "failed",
      survive_with_50_hp: "failed",
      deal_500_damage: "completed",
    });
  });
});
