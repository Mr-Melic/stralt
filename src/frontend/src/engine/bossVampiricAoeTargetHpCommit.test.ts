import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { countsTowardKillRewards, shouldAwardVictory } from "./battleSetup.ts";
import {
  type BossVampiricAoeTargetActionLike,
  VAMPIRIC_AOE_TARGET_ABILITY,
  VAMPIRIC_AOE_TARGET_AOE_LOG,
  VAMPIRIC_AOE_TARGET_DRAIN,
  VAMPIRIC_AOE_TARGET_HIT_LOG,
  VAMPIRIC_AOE_TARGET_RADIUS,
  type VampiricAoeTargetCombatant,
  bossVampiricAoeTargetHpFromAction,
  resolveBossVampiricAoeTargetHpCommit,
  shouldCreditVampiricAoeTargetKill,
  vampiricAoeTargetDrainMap,
  vampiricAoeTargetInRadius,
  vampiricAoeTargetStillHostile,
  wxBossVampiricAoeCommitWithoutTargetHp,
  wxBossVampiricAoeDroppedTargetHp,
} from "./bossVampiricAoeTargetHpCommit.ts";

/** Starved Vampire Pawn `baseStats.hp`. */
const STARVED_VAMPIRE_HP = 60;
const PLAYER_STRIKE_DAMAGE = Number(physicalAttackSpell.damage);
const LIFE_DRAIN_TRIGGER_HEAL = 15;
const DAWN_NEGATIVE_DAMAGE_TO_PLAYER = -10;
const QUEEN_RAY_DAMAGE = Math.floor(8 * 0.8);
const CHAIN_LIGHTNING_DAMAGE = 8;

function vampiricAoeAction(
  damageToTargets: Record<string, number> = {},
): BossVampiricAoeTargetActionLike {
  return {
    type: "ability",
    ability: VAMPIRIC_AOE_TARGET_ABILITY,
    abilityResult: {
      damageToPlayer: VAMPIRIC_AOE_TARGET_DRAIN,
      damageToTargets,
      logMessages: [
        `${VAMPIRIC_AOE_TARGET_HIT_LOG} pawn for ${VAMPIRIC_AOE_TARGET_DRAIN} HP!`,
        VAMPIRIC_AOE_TARGET_AOE_LOG,
      ],
    },
  };
}

function unit(args: {
  id: string;
  hp: number;
  side?: "player" | "enemy";
  isSummon?: boolean;
}): VampiricAoeTargetCombatant {
  return {
    id: args.id,
    hp: args.hp,
    side: args.side,
    isSummon: args.isSummon,
  };
}

function roster(minionHp: number): VampiricAoeTargetCombatant[] {
  return [
    unit({ id: "boss-17", hp: 10 }),
    unit({ id: "minion-a", hp: minionHp }),
  ];
}

function victoryAfterStrike(hostilesRemaining: number): boolean {
  return shouldAwardVictory({
    inBattle: true,
    deathTriggered: false,
    battleStartIdsSize: 2,
    hostilesRemaining,
  });
}

function hostilesAfterStrikeOnBoss(
  combatants: readonly VampiricAoeTargetCombatant[],
): number {
  return combatants.filter((c) => {
    if (c.id === "boss-17") {
      return c.hp - PLAYER_STRIKE_DAMAGE > 0;
    }
    return vampiricAoeTargetStillHostile(c);
  }).length;
}

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

describe("wxBossVampiricAoeCommitWithoutTargetHp (live leftover)", () => {
  it("10 HP nearby minion stays 10 after the drain log", () => {
    const action = vampiricAoeAction({ "minion-a": VAMPIRIC_AOE_TARGET_DRAIN });
    const live = wxBossVampiricAoeCommitWithoutTargetHp({
      combatants: roster(10),
      action,
    });
    assert.equal(VAMPIRIC_AOE_TARGET_AOE_LOG.includes("3-tile radius"), true);
    assert.equal(live.combatants[0]?.hp, 10, "boss HP is #975, not this file");
    assert.equal(live.combatants[1]?.hp, 10);
    assert.equal(live.hostilesRemaining, 2);
    assert.equal(live.lethalIds.length, 0);
    assert.equal(
      wxBossVampiricAoeDroppedTargetHp({
        combatants: roster(10),
        action,
      }),
      true,
      "live WX drops advertised minion HP",
    );
  });

  it("Strike 10 kills the 10 HP boss but leftover minion blocks victory persist", () => {
    assert.equal(PLAYER_STRIKE_DAMAGE, 10);
    const live = wxBossVampiricAoeCommitWithoutTargetHp({
      combatants: roster(10),
      action: vampiricAoeAction({ "minion-a": VAMPIRIC_AOE_TARGET_DRAIN }),
    });
    const hostiles = hostilesAfterStrikeOnBoss(live.combatants);
    assert.equal(hostiles, 1);
    assert.equal(victoryAfterStrike(hostiles), false);
  });
});

describe("resolveBossVampiricAoeTargetHpCommit", () => {
  it("10 HP nearby minion dies so Strike 10 on the boss awards victory", () => {
    const action = vampiricAoeAction({ "minion-a": VAMPIRIC_AOE_TARGET_DRAIN });
    const next = resolveBossVampiricAoeTargetHpCommit({
      combatants: roster(10),
      action,
    });
    assert.deepEqual(bossVampiricAoeTargetHpFromAction(action), {
      "minion-a": VAMPIRIC_AOE_TARGET_DRAIN,
    });
    assert.equal(next.combatants[0]?.hp, 10, "must not heal the boss (#975)");
    assert.equal(next.combatants[1]?.hp, 0);
    assert.equal(next.hostilesRemaining, 1);
    assert.deepEqual(next.lethalIds, ["minion-a"]);
    const hostiles = hostilesAfterStrikeOnBoss(next.combatants);
    assert.equal(hostiles, 0);
    assert.equal(victoryAfterStrike(hostiles), true);
  });

  it("11 HP nearby minion survives at 1 and still blocks victory after Strike", () => {
    const next = resolveBossVampiricAoeTargetHpCommit({
      combatants: roster(11),
      action: vampiricAoeAction({ "minion-a": VAMPIRIC_AOE_TARGET_DRAIN }),
    });
    assert.equal(next.combatants[1]?.hp, 1);
    assert.equal(next.lethalIds.length, 0);
    const hostiles = hostilesAfterStrikeOnBoss(next.combatants);
    assert.equal(hostiles, 1);
    assert.equal(victoryAfterStrike(hostiles), false);
  });

  it("two nearby 10 HP minions both die", () => {
    const boss = { id: "boss-17", x: 8, y: 8 };
    const damageToTargets = vampiricAoeTargetDrainMap({
      boss,
      others: [
        { id: "minion-a", x: 9, y: 8 },
        { id: "minion-b", x: 8, y: 9 },
      ],
    });
    assert.deepEqual(damageToTargets, {
      "minion-a": VAMPIRIC_AOE_TARGET_DRAIN,
      "minion-b": VAMPIRIC_AOE_TARGET_DRAIN,
    });
    const next = resolveBossVampiricAoeTargetHpCommit({
      combatants: [
        unit({ id: "boss-17", hp: 10 }),
        unit({ id: "minion-a", hp: 10 }),
        unit({ id: "minion-b", hp: 10 }),
      ],
      action: vampiricAoeAction(damageToTargets),
    });
    assert.equal(next.combatants[0]?.hp, 10);
    assert.equal(next.combatants[1]?.hp, 0);
    assert.equal(next.combatants[2]?.hp, 0);
    assert.equal(next.hostilesRemaining, 1);
    assert.equal(next.lethalIds.length, 2);
  });

  it("a Manhattan-4 minion is not drained (spread-out guide)", () => {
    const boss = { id: "boss-17", x: 8, y: 8 };
    const far = { id: "minion-far", x: 12, y: 8 };
    assert.equal(VAMPIRIC_AOE_TARGET_RADIUS, 3);
    assert.equal(vampiricAoeTargetInRadius(boss, far), false);
    const damageToTargets = vampiricAoeTargetDrainMap({
      boss,
      others: [far, { id: "minion-near", x: 11, y: 8 }],
    });
    assert.equal(damageToTargets["minion-far"], undefined);
    assert.equal(damageToTargets["minion-near"], VAMPIRIC_AOE_TARGET_DRAIN);
    const next = resolveBossVampiricAoeTargetHpCommit({
      combatants: [
        unit({ id: "boss-17", hp: 10 }),
        unit({ id: "minion-far", hp: 10 }),
        unit({ id: "minion-near", hp: 10 }),
      ],
      action: vampiricAoeAction(damageToTargets),
    });
    assert.equal(next.combatants[1]?.hp, 10, "far crumb must not take 10");
    assert.equal(next.combatants[2]?.hp, 0);
    assert.equal(next.hostilesRemaining, 2);
  });

  it("does not change player HP — live WX already applied damageToPlayer", () => {
    const next = resolveBossVampiricAoeTargetHpCommit({
      combatants: roster(10),
      action: vampiricAoeAction({ "minion-a": VAMPIRIC_AOE_TARGET_DRAIN }),
    });
    assert.equal(
      next.combatants.some((c) => c.id === "player"),
      false,
    );
    assert.equal(next.combatants[0]?.hp, 10);
  });

  it("boss-ability minion death must not mint applyRewards XP/Doka", () => {
    const minion = unit({ id: "minion-a", hp: 0 });
    assert.equal(
      countsTowardKillRewards(minion),
      true,
      "legacy enemy-side minion would otherwise enter the kill roster",
    );
    assert.equal(shouldCreditVampiricAoeTargetKill(minion), false);
  });

  it("player-side summon drain does not count as a remaining hostile", () => {
    const wolf = unit({
      id: "wolf-1",
      hp: 10,
      side: "player",
      isSummon: true,
    });
    const next = resolveBossVampiricAoeTargetHpCommit({
      combatants: [unit({ id: "boss-17", hp: 10 }), wolf],
      action: vampiricAoeAction({ "wolf-1": VAMPIRIC_AOE_TARGET_DRAIN }),
    });
    assert.equal(next.combatants[1]?.hp, 0);
    assert.equal(next.hostilesRemaining, 1);
    assert.equal(shouldCreditVampiricAoeTargetKill(wolf), false);
  });

  it("LIFE_DRAIN trigger 15 / +atk is not minion HP (unique vs #968)", () => {
    const action: BossVampiricAoeTargetActionLike = {
      type: "ability",
      ability: "LIFE_DRAIN",
      abilityResult: {
        logMessages: [
          "The Starved Vampire Pawn drains your life force, growing stronger! It heals 15 HP and gains +1 attack!",
        ],
      },
    };
    assert.equal(bossVampiricAoeTargetHpFromAction(action), null);
    const next = resolveBossVampiricAoeTargetHpCommit({
      combatants: roster(10),
      action,
    });
    assert.equal(next.combatants[1]?.hp, 10);
    assert.notEqual(VAMPIRIC_AOE_TARGET_DRAIN, LIFE_DRAIN_TRIGGER_HEAL);
  });

  it("Dawn damageToPlayer -10 is not minion HP (unique vs #948)", () => {
    const action: BossVampiricAoeTargetActionLike = {
      type: "ability",
      abilityResult: { damageToPlayer: DAWN_NEGATIVE_DAMAGE_TO_PLAYER },
    };
    assert.equal(bossVampiricAoeTargetHpFromAction(action), null);
    const next = resolveBossVampiricAoeTargetHpCommit({
      combatants: roster(10),
      action,
    });
    assert.equal(next.combatants[1]?.hp, 10);
  });

  it("queen-ray damageToTargets is not this drain (unique leftover)", () => {
    assert.equal(QUEEN_RAY_DAMAGE, 6);
    const ray: BossVampiricAoeTargetActionLike = {
      type: "ability",
      ability: "ATTACK_ALL_LINES",
      abilityResult: {
        damageToPlayer: QUEEN_RAY_DAMAGE,
        damageToTargets: { "minion-a": QUEEN_RAY_DAMAGE },
      },
    };
    assert.equal(bossVampiricAoeTargetHpFromAction(ray), null);
    const next = resolveBossVampiricAoeTargetHpCommit({
      combatants: roster(10),
      action: ray,
    });
    assert.equal(next.combatants[1]?.hp, 10);
  });

  it("chain lightning damageToTargets is not this drain", () => {
    const chain: BossVampiricAoeTargetActionLike = {
      type: "ability",
      ability: "CHAIN_LIGHTNING",
      abilityResult: {
        damageToPlayer: CHAIN_LIGHTNING_DAMAGE,
        damageToTargets: { "minion-a": CHAIN_LIGHTNING_DAMAGE },
      },
    };
    assert.equal(bossVampiricAoeTargetHpFromAction(chain), null);
    assert.equal(
      resolveBossVampiricAoeTargetHpCommit({
        combatants: roster(10),
        action: chain,
      }).combatants[1]?.hp,
      10,
    );
  });

  it("Countess type:attack with no damageToTargets is not minion HP", () => {
    const action: BossVampiricAoeTargetActionLike = { type: "attack" };
    assert.equal(bossVampiricAoeTargetHpFromAction(action), null);
    assert.equal(
      resolveBossVampiricAoeTargetHpCommit({
        combatants: roster(10),
        action,
      }).combatants[1]?.hp,
      10,
    );
  });

  it("kit type:spell starter-drain is not this ability", () => {
    const drain = mustSpell("starter-drain");
    assert.equal(Number(drain.healAmount), 5);
    const drainAction: BossVampiricAoeTargetActionLike = {
      type: "spell",
      abilityResult: {
        healAmount: Number(drain.healAmount),
        damageToTargets: { "minion-a": 5 },
      },
    };
    assert.equal(bossVampiricAoeTargetHpFromAction(drainAction), null);
    assert.equal(
      resolveBossVampiricAoeTargetHpCommit({
        combatants: roster(10),
        action: drainAction,
      }).combatants[1]?.hp,
      10,
    );
  });

  it("VAMPIRIC_AOE ability id is the production enum string", () => {
    assert.equal(VAMPIRIC_AOE_TARGET_ABILITY, "VAMPIRIC_AOE");
  });

  it("type:move dest is not minion HP (unique vs #872)", () => {
    const action: BossVampiricAoeTargetActionLike = { type: "move" };
    assert.equal(
      resolveBossVampiricAoeTargetHpCommit({
        combatants: roster(10),
        action,
      }).combatants[1]?.hp,
      10,
    );
  });

  it("already-dead minion stays 0 and is not re-listed as lethal", () => {
    const next = resolveBossVampiricAoeTargetHpCommit({
      combatants: roster(0),
      action: vampiricAoeAction({ "minion-a": VAMPIRIC_AOE_TARGET_DRAIN }),
    });
    assert.equal(next.combatants[1]?.hp, 0);
    assert.deepEqual(next.lethalIds, []);
  });

  it("non-finite damageToTargets entries are not a drain", () => {
    const action = vampiricAoeAction({ "minion-a": Number.NaN });
    assert.equal(bossVampiricAoeTargetHpFromAction(action), null);
    assert.equal(
      resolveBossVampiricAoeTargetHpCommit({
        combatants: roster(10),
        action,
      }).combatants[1]?.hp,
      10,
    );
  });

  it("does not apply the #975 boss heal from drained bodies", () => {
    const action = vampiricAoeAction({
      "minion-a": VAMPIRIC_AOE_TARGET_DRAIN,
    });
    const next = resolveBossVampiricAoeTargetHpCommit({
      combatants: [
        unit({ id: "boss-17", hp: 10, side: "enemy" }),
        unit({ id: "minion-a", hp: 10 }),
      ],
      action,
    });
    assert.equal(next.combatants[0]?.hp, 10);
    assert.notEqual(next.combatants[0]?.hp, 30);
    assert.notEqual(STARVED_VAMPIRE_HP, next.combatants[0]?.hp);
  });
});
