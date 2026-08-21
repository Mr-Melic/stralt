import { describe, expect, it } from "vitest";
import {
  type Combatant,
  activeHostilesRemaining,
  despawnSummons,
  isActiveHostile,
  isAliveCombatant,
} from "../battleSetup";

function unit(
  overrides: Partial<Combatant> & Pick<Combatant, "hp">,
): Combatant {
  return { ...overrides, hp: overrides.hp };
}

describe("isActiveHostile", () => {
  it("treats living enemy-side non-summons as hostiles", () => {
    expect(isActiveHostile(unit({ hp: 10, side: "enemy" }))).toBe(true);
    expect(isActiveHostile(unit({ hp: 10 }))).toBe(true);
  });

  it("never treats player-side units or dead units as hostiles", () => {
    expect(isActiveHostile(unit({ hp: 10, side: "player" }))).toBe(false);
    expect(isActiveHostile(unit({ hp: 0, side: "enemy" }))).toBe(false);
  });

  it("treats player-side summons as non-hostile and enemy-side summons as hostile", () => {
    expect(
      isActiveHostile(unit({ hp: 10, isSummon: true, side: "player" })),
    ).toBe(false);
    expect(isActiveHostile(unit({ hp: 10, isSummon: true }))).toBe(false);
    expect(
      isActiveHostile(unit({ hp: 10, isSummon: true, side: "enemy" })),
    ).toBe(true);
  });
});

describe("isAliveCombatant / activeHostilesRemaining", () => {
  it("counts any living combatant, including player summons", () => {
    expect(
      isAliveCombatant(unit({ hp: 1, side: "player", isSummon: true })),
    ).toBe(true);
    expect(isAliveCombatant(unit({ hp: 0 }))).toBe(false);
  });

  it("does not count player summons toward victory", () => {
    const roster: Combatant[] = [
      unit({ hp: 20, side: "player", isSummon: true, id: "sum" }),
      unit({ hp: 0, side: "enemy", id: "dead" }),
    ];
    expect(activeHostilesRemaining(roster)).toBe(0);
    expect(
      activeHostilesRemaining([
        ...roster,
        unit({ hp: 8, side: "enemy", id: "alive" }),
      ]),
    ).toBe(1);
  });

  it("despawns every summon regardless of side or hp", () => {
    const roster: Combatant[] = [
      unit({ hp: 10, id: "e1" }),
      unit({ hp: 10, id: "s1", isSummon: true, side: "player" }),
      unit({ hp: 0, id: "s2", isSummon: true, side: "enemy" }),
    ];
    expect(despawnSummons(roster).map((e) => e.id)).toEqual(["e1"]);
  });
});
