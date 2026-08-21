import { describe, expect, it } from "vitest";
import { getAoETargets } from "../castHelpers";
import { makeEnemy, makeSpell } from "./fixtures";

function baseArgs(
  overrides: Partial<Parameters<typeof getAoETargets>[0]> = {},
) {
  const logs: string[] = [];
  return {
    args: {
      spell: makeSpell({ maxRange: 2, range: 2n }),
      gridPos: { x: 5, y: 5 },
      targetEnemy: undefined,
      enemies: [],
      playerPosition: { x: 0, y: 0 },
      characterName: "Hero",
      characterStats: {
        level: 1,
        res: 0,
        sp: 0,
        chc: 0,
        hp: 40,
        maxHp: 40,
      },
      getEffectiveSpellRange: (base: number) => base,
      logBattleEntry: (msg: string) => {
        logs.push(msg);
      },
      ...overrides,
    },
    logs,
  };
}

describe("getAoETargets", () => {
  it("anchors hitsMultiple to the clicked tile, not the caster", () => {
    const nearClick = makeEnemy({ id: "near-click", x: 6, y: 6, hp: 20 });
    const { args } = baseArgs({
      spell: makeSpell({ hitsMultiple: true, maxRange: 1, range: 1n }),
      gridPos: { x: 5, y: 5 },
      playerPosition: { x: 0, y: 0 },
      enemies: [nearClick],
    });
    const targets = getAoETargets(args);
    expect(targets.map((t) => t.id)).toEqual(["near-click"]);
  });

  it("excludes already-dead enemies from single-target and AoE lists", () => {
    const live = makeEnemy({ id: "live", x: 5, y: 5, hp: 12 });
    const corpse = makeEnemy({ id: "corpse", x: 6, y: 5, hp: 0 });
    const { args } = baseArgs({
      spell: makeSpell({
        aoe: true,
        hitTiles: [[1, 0]],
        maxRange: 2,
      }),
      targetEnemy: live,
      enemies: [live, corpse],
    });
    expect(getAoETargets(args).map((t) => t.id)).toEqual(["live"]);
  });

  it("logs and returns empty when nothing living is in range", () => {
    const { args, logs } = baseArgs({
      spell: makeSpell({ name: "Frost Nova", hitsMultiple: true, maxRange: 1 }),
      enemies: [makeEnemy({ id: "far", x: 12, y: 12, hp: 10 })],
    });
    expect(getAoETargets(args)).toEqual([]);
    expect(logs[0]).toMatch(/No target in range for Frost Nova/);
  });

  it("includes the player sentinel when hitsAllies and hitsMultiple are set", () => {
    const { args } = baseArgs({
      spell: makeSpell({
        hitsMultiple: true,
        hitsAllies: true,
        maxRange: 2,
      }),
      enemies: [makeEnemy({ id: "e1", x: 5, y: 6, hp: 8 })],
    });
    const ids = getAoETargets(args).map((t) => t.id);
    expect(ids).toContain("e1");
    expect(ids).toContain("__player__");
  });
});
