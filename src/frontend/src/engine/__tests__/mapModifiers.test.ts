import { describe, expect, it } from "vitest";
import type { CombatantEntry } from "../../components/InitiativeStrip";
import type { MapModifierConfig } from "../../types/gameTypes";
import {
  type CombatantExt,
  type ModifierCtx,
  getModifierDefinition,
  mapModifierRegistry,
} from "../mapModifiers";
import { makeTurnEntry } from "./fixtures";

function makeCtx(rng: () => number = () => 0): {
  ctx: ModifierCtx;
  logs: string[];
} {
  const logs: string[] = [];
  return { ctx: { log: (msg) => logs.push(msg), rng }, logs };
}

function combatant(overrides: Partial<CombatantExt> = {}): CombatantExt {
  return { hp: 40, maxHp: 40, ...overrides };
}

function modifierConfig(
  overrides: Partial<MapModifierConfig> & Pick<MapModifierConfig, "id">,
): MapModifierConfig {
  return {
    name: overrides.id,
    description: "",
    modifierType: overrides.id,
    active: true,
    ...overrides,
  };
}

describe("mapModifierRegistry.applyMpCost / applyApCost", () => {
  it("chains movement-cost doublers in registry order", () => {
    const { ctx } = makeCtx();
    expect(
      mapModifierRegistry.applyMpCost(
        2,
        new Set(["slime_flood", "frozen_terrain"]),
        ctx,
      ),
    ).toBe(8);
    expect(
      mapModifierRegistry.applyMpCost(2, new Set(["slime_flood"]), ctx),
    ).toBe(4);
    expect(mapModifierRegistry.applyMpCost(2, new Set(), ctx)).toBe(2);
  });

  it("reduces AP by 1 with a floor of 1, including stacked surge + overflow", () => {
    const { ctx } = makeCtx();
    expect(
      mapModifierRegistry.applyApCost(3, new Set(["arcane_surge"]), ctx),
    ).toBe(2);
    expect(
      mapModifierRegistry.applyApCost(1, new Set(["arcane_surge"]), ctx),
    ).toBe(1);
    expect(
      mapModifierRegistry.applyApCost(
        3,
        new Set(["arcane_surge", "arcane_overflow"]),
        ctx,
      ),
    ).toBe(1);
  });
});

describe("mapModifierRegistry.applyDamageDealt", () => {
  it("adds thorned-ground extra damage only past the 2-tile path threshold", () => {
    const { ctx, logs } = makeCtx();
    const attacker = combatant();
    expect(
      mapModifierRegistry.applyDamageDealt(
        attacker,
        combatant({ pathLength: 2 }),
        10,
        new Set(["thorned_ground"]),
        ctx,
      ),
    ).toBe(10);
    expect(logs).toEqual([]);
    expect(
      mapModifierRegistry.applyDamageDealt(
        attacker,
        combatant({ pathLength: 4 }),
        10,
        new Set(["thorned_ground"]),
        ctx,
      ),
    ).toBe(20);
    expect(logs).toEqual(["Thorned Ground deals 10 extra damage."]);
  });

  it("doubles glass-realm damage and heals vampiric attackers for 15% without changing the hit", () => {
    const { ctx } = makeCtx();
    const attacker = combatant({ hp: 40, assignedName: "Wolf" });
    const dmg = mapModifierRegistry.applyDamageDealt(
      attacker,
      combatant(),
      100,
      new Set(["glass_realm", "vampiric_ground"]),
      ctx,
    );
    expect(dmg).toBe(200);
    expect(attacker.hp).toBe(70);
  });

  it("rolls titan's vigor as a 1–5 multiplier from the injected rng", () => {
    const low = makeCtx(() => 0);
    expect(
      mapModifierRegistry.applyDamageDealt(
        combatant(),
        combatant(),
        10,
        new Set(["titans_vigor"]),
        low.ctx,
      ),
    ).toBe(10);
    expect(low.logs[0]).toBe("Titan's Vigor rolls x1 damage.");

    const high = makeCtx(() => 0.99);
    expect(
      mapModifierRegistry.applyDamageDealt(
        combatant(),
        combatant(),
        10,
        new Set(["titans_vigor"]),
        high.ctx,
      ),
    ).toBe(50);
  });
});

describe("mapModifierRegistry.applyBattleStart / applyRewardMultiplier", () => {
  it("gives titan HP to everyone but doka-fever HP only to enemies, and doubles rewards", () => {
    const hero = combatant({ hp: 100, maxHp: 100, side: "player" });
    const foe = combatant({
      hp: 80,
      maxHp: 80,
      side: "enemy",
      isEnemy: true,
    });
    mapModifierRegistry.applyBattleStart(
      [hero, foe],
      new Set(["titans_vigor"]),
    );
    expect(hero.hp).toBe(1100);
    expect(hero.maxHp).toBe(1100);
    expect(foe.hp).toBe(1080);
    expect(foe.maxHp).toBe(1080);

    const feverFoe = combatant({
      hp: 80,
      maxHp: 80,
      side: "enemy",
      isEnemy: true,
    });
    const feverHero = combatant({ hp: 100, maxHp: 100, side: "player" });
    mapModifierRegistry.applyBattleStart(
      [feverHero, feverFoe],
      new Set(["doka_fever"]),
    );
    expect(feverHero.hp).toBe(100);
    expect(feverFoe.maxHp).toBe(100);
    expect(feverFoe.hp).toBe(100);

    const { ctx } = makeCtx();
    expect(
      mapModifierRegistry.applyRewardMultiplier(
        25,
        new Set(["doka_fever"]),
        ctx,
      ),
    ).toBe(50);
    expect(
      mapModifierRegistry.applyRewardMultiplier(
        25,
        new Set(["slime_flood"]),
        ctx,
      ),
    ).toBe(25);
  });

  it("applies iron curse +30% RES on battle start", () => {
    const foe = combatant({ res: 10 });
    mapModifierRegistry.applyBattleStart([foe], new Set(["iron_curse"]));
    expect(foe.res).toBe(13);
  });
});

describe("mapModifierRegistry.applyTurnStart", () => {
  it("ticks void rift, plague, mending mist, and swift winds in registry order", () => {
    const { ctx, logs } = makeCtx();
    const unit = combatant({
      hp: 40,
      maxHp: 100,
      mp: 1,
      assignedName: "Knight",
    });
    mapModifierRegistry.applyTurnStart(
      unit,
      new Set(["void_rift", "plague_zone", "mending_mist", "swift_winds"]),
      ctx,
    );
    // -3 void, -1 plague, +floor(100*0.05)=5 mist
    expect(unit.hp).toBe(41);
    expect(unit.mp).toBe(3);
    expect(logs).toEqual([
      "Void Rift tears at Knight for 3 damage.",
      "Plague Zone festers on Knight.",
      "Mending Mist heals Knight for 5.",
    ]);
  });
});

describe("mapModifierRegistry.applyEffectApplication", () => {
  it("lets a single veto suppress the effect (null field on buff/debuff)", () => {
    const { ctx, logs } = makeCtx();
    expect(
      mapModifierRegistry.applyEffectApplication(
        "buff",
        new Set(["null_field"]),
        ctx,
      ),
    ).toBe(false);
    expect(
      mapModifierRegistry.applyEffectApplication(
        "debuff",
        new Set(["null_field"]),
        ctx,
      ),
    ).toBe(false);
    expect(
      mapModifierRegistry.applyEffectApplication(
        "dot",
        new Set(["null_field"]),
        ctx,
      ),
    ).toBe(true);
    expect(logs).toEqual(["Null Field suppressed.", "Null Field suppressed."]);
  });

  it("never fizzles DoTs under arcane overflow, and fizzles other effects when rng < 10%", () => {
    const fail = makeCtx(() => 0.05);
    expect(
      mapModifierRegistry.applyEffectApplication(
        "dot",
        new Set(["arcane_overflow"]),
        fail.ctx,
      ),
    ).toBe(true);
    expect(
      mapModifierRegistry.applyEffectApplication(
        "buff",
        new Set(["arcane_overflow"]),
        fail.ctx,
      ),
    ).toBe(false);
    expect(fail.logs).toEqual(["Arcane Overflow makes the spell fizzle."]);

    const pass = makeCtx(() => 0.5);
    expect(
      mapModifierRegistry.applyEffectApplication(
        "buff",
        new Set(["arcane_overflow"]),
        pass.ctx,
      ),
    ).toBe(true);
  });
});

describe("mapModifierRegistry.applyTurnOrderSort", () => {
  it("keeps summons immediately after their owner after a chaos reshuffle", () => {
    const order: CombatantEntry[] = [
      makeTurnEntry({ id: "player", type: "player" }),
      makeTurnEntry({ id: "rat", type: "enemy" }),
      makeTurnEntry({
        id: "wolf",
        type: "summon",
        isSummon: true,
        ownerId: "player",
      }),
    ];
    const sorted = mapModifierRegistry.applyTurnOrderSort(
      order,
      new Set(["chaos_initiative"]),
    );
    expect(sorted.map((c) => c.id).sort()).toEqual(["player", "rat", "wolf"]);
    const ownerIdx = sorted.findIndex((c) => c.id === "player");
    expect(sorted[ownerIdx + 1]?.id).toBe("wolf");
  });

  it("returns the original order when no sort hook is active", () => {
    const order = [makeTurnEntry({ id: "a" }), makeTurnEntry({ id: "b" })];
    expect(
      mapModifierRegistry.applyTurnOrderSort(order, new Set(["slime_flood"])),
    ).toBe(order);
  });
});

describe("mapModifierRegistry.rollActiveModifiers", () => {
  it("activates nothing when the global roll misses or the pool is empty", () => {
    const miss = makeCtx(() => 0.5);
    expect(
      mapModifierRegistry.rollActiveModifiers(
        [modifierConfig({ id: "slime_flood", globalTriggerChance: 20 })],
        miss.ctx,
      ).size,
    ).toBe(0);

    const { ctx } = makeCtx();
    expect(
      mapModifierRegistry.rollActiveModifiers(
        [modifierConfig({ id: "not-a-real-modifier" })],
        ctx,
      ).size,
    ).toBe(0);
    expect(
      mapModifierRegistry.rollActiveModifiers(
        [modifierConfig({ id: "slime_flood", active: false })],
        ctx,
      ).size,
    ).toBe(0);
  });

  it("picks one modifier, then a second when the follow-up roll hits", () => {
    const one = [0.0, 0.0, 0.9][Symbol.iterator]();
    const oneCtx = makeCtx(() => one.next().value ?? 0);
    expect([
      ...mapModifierRegistry.rollActiveModifiers(
        [
          modifierConfig({ id: "slime_flood", secondModifierChance: 50 }),
          modifierConfig({ id: "frozen_terrain" }),
        ],
        oneCtx.ctx,
      ),
    ]).toEqual(["slime_flood"]);

    const two = [0.0, 0.0, 0.0, 0.0][Symbol.iterator]();
    const twoCtx = makeCtx(() => two.next().value ?? 0);
    expect(
      mapModifierRegistry.rollActiveModifiers(
        [
          modifierConfig({ id: "slime_flood" }),
          modifierConfig({ id: "frozen_terrain" }),
        ],
        twoCtx.ctx,
      ),
    ).toEqual(new Set(["slime_flood", "frozen_terrain"]));
  });
});

describe("getModifierDefinition", () => {
  it("resolves known ids and returns undefined for unknown ones", () => {
    expect(getModifierDefinition("doka_fever")?.name).toBe("Doka Fever");
    expect(getModifierDefinition("nope")).toBeUndefined();
  });
});
