import { describe, expect, it } from "vitest";
import type { ActiveEffect } from "../../types/gameTypes";
import { appendDotStack, sumDotTicks, tickDotStacks } from "../dotStacks";

function burn(overrides: Partial<ActiveEffect> = {}): ActiveEffect {
  return {
    id: "burn-1",
    effectName: "Burn",
    type: "dot",
    targetId: "e1",
    duration: 2,
    iconEmoji: "🔥",
    description: "burning",
    dotDamagePerTurn: 8,
    stackId: "stack-a",
    ...overrides,
  };
}

describe("dotStacks", () => {
  it("stacks same-type DoTs additively instead of replacing them", () => {
    const first = appendDotStack([], burn());
    const stacked = appendDotStack(
      first,
      burn({ id: "burn-2", stackId: "stack-b", duration: 3 }),
    );
    expect(stacked).toHaveLength(2);
    expect(sumDotTicks(stacked, "e1")).toBe(16);
    expect(sumDotTicks(stacked, "other")).toBe(0);
  });

  it("ticks each stack independently and drops expired ones", () => {
    const effects: ActiveEffect[] = [
      burn({ stackId: "a", duration: 1, dotDamagePerTurn: 8 }),
      burn({ id: "burn-2", stackId: "b", duration: 3, dotDamagePerTurn: 5 }),
      {
        id: "buff",
        effectName: "Haste",
        type: "buff",
        targetId: "e1",
        duration: 2,
        iconEmoji: "💨",
        description: "fast",
      },
      burn({
        id: "other",
        stackId: "c",
        targetId: "e2",
        duration: 2,
        dotDamagePerTurn: 9,
      }),
    ];
    const result = tickDotStacks(effects, "e1");
    expect(result.damage).toBe(13);
    expect(result.stackCount).toBe(2);
    expect(result.perStackDurations).toEqual([0, 2]);
    expect(result.remaining.map((e) => e.id)).toEqual([
      "burn-2",
      "buff",
      "other",
    ]);
    expect(result.remaining.find((e) => e.id === "burn-2")?.duration).toBe(2);
    expect(result.remaining.find((e) => e.id === "other")?.duration).toBe(2);
  });
});
