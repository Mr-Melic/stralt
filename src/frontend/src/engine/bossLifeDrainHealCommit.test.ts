import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import {
  type ChallengePanelProgress,
  DEFAULT_CHALLENGES,
  isChallengeCompleted,
} from "../utils/challengeCompletion.ts";
import { shouldAwardVictory } from "./battleSetup.ts";
import {
  type BossLifeDrainHealActionLike,
  LIFE_DRAIN_ABILITY,
  LIFE_DRAIN_ATK_GAIN,
  LIFE_DRAIN_HEAL_AMOUNT,
  LIFE_DRAIN_TRIGGER_LOG,
  LIFE_DRAIN_TRIGGER_THRESHOLD,
  bossLifeDrainAtkFromAction,
  bossLifeDrainHealFromAction,
  resolveBossLifeDrainHpCommit,
  wxBossLifeDrainCommitWithoutHeal,
  wxBossLifeDrainDroppedHeal,
} from "./bossLifeDrainHealCommit.ts";

/** Starved Vampire Pawn `baseStats` — leftover melee, not this heal. */
const STARVED_VAMPIRE_HP = 60;
const STARVED_VAMPIRE_ATK = 8;
const GLYPH_TRAP_DAMAGE = 15;
const DAWN_NEGATIVE_DAMAGE_TO_PLAYER = -10;
const VAMPIRIC_AOE_DAMAGE = 10;
const PLAYER_STRIKE_DAMAGE = Number(physicalAttackSpell.damage);

const easy1 = DEFAULT_CHALLENGES.find((c) => c.id === "easy_1");
const hard1 = DEFAULT_CHALLENGES.find((c) => c.id === "hard_1");
const untouchable = DEFAULT_CHALLENGES.find((c) => c.id === "legendary_1");

function lifeDrainTriggerAction(): BossLifeDrainHealActionLike {
  return {
    type: "ability",
    ability: LIFE_DRAIN_ABILITY,
    abilityResult: {
      newBossState: { vampirePawnDrainAccumulated: 0 },
      logMessages: [LIFE_DRAIN_TRIGGER_LOG],
    },
  };
}

function lifeDrainProgressAction(accum: number): BossLifeDrainHealActionLike {
  return {
    type: "ability",
    ability: LIFE_DRAIN_ABILITY,
    abilityResult: {
      newBossState: { vampirePawnDrainAccumulated: accum },
      logMessages: [
        `The Starved Vampire Pawn drains your life force (${accum}/10)…`,
      ],
    },
  };
}

function challengeProgress(
  overrides: Partial<ChallengePanelProgress> = {},
): ChallengePanelProgress {
  return {
    turnCount: 3,
    totalDamage: 0,
    healUsed: false,
    directHit: true,
    maxApUsedInTurn: 4,
    directHitAttempts: 0,
    ...overrides,
  };
}

function victoryAfterHit(bossHp: number, hit: number): boolean {
  const after = Math.max(0, bossHp - hit);
  return shouldAwardVictory({
    inBattle: true,
    deathTriggered: false,
    battleStartIdsSize: 1,
    hostilesRemaining: after > 0 ? 1 : 0,
  });
}

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

describe("wxBossLifeDrainCommitWithoutHeal (live leftover)", () => {
  it("grow-stronger log leaves 10/60 and atk 8 unchanged", () => {
    const action = lifeDrainTriggerAction();
    const live = wxBossLifeDrainCommitWithoutHeal({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      atk: STARVED_VAMPIRE_ATK,
      action,
    });
    assert.equal(LIFE_DRAIN_TRIGGER_LOG.includes("heals 15 HP"), true);
    assert.equal(LIFE_DRAIN_TRIGGER_LOG.includes("gains +1 attack"), true);
    assert.equal(live.hp, 10);
    assert.equal(live.atk, STARVED_VAMPIRE_ATK);
    assert.equal(live.restored, 0);
    assert.equal(live.atkGained, 0);
    assert.equal(live.healUsed, false);
    assert.equal(
      wxBossLifeDrainDroppedHeal({
        hp: 10,
        maxHp: STARVED_VAMPIRE_HP,
        atk: STARVED_VAMPIRE_ATK,
        action,
      }),
      true,
      "live WX drops the advertised 15 HP / +1 atk",
    );
  });

  it("10 HP pawn dies to Strike 10 so victory persist still fires", () => {
    assert.equal(PLAYER_STRIKE_DAMAGE, 10);
    const live = wxBossLifeDrainCommitWithoutHeal({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      atk: STARVED_VAMPIRE_ATK,
      action: lifeDrainTriggerAction(),
    });
    assert.equal(live.hp, 10);
    assert.equal(victoryAfterHit(live.hp, PLAYER_STRIKE_DAMAGE), true);
  });

  it("easy_1 50 Doka still persists — leftover is not a player heal", () => {
    assert.equal(easy1?.rewards.doka, 50);
    const live = wxBossLifeDrainCommitWithoutHeal({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      atk: STARVED_VAMPIRE_ATK,
      action: lifeDrainTriggerAction(),
    });
    assert.equal(
      isChallengeCompleted(
        easy1!,
        challengeProgress({ healUsed: live.healUsed }),
      ),
      true,
    );
  });

  it("hard_1 200 Doka / 500 XP still persists after the unused boss heal", () => {
    assert.equal(hard1?.rewards.doka, 200);
    assert.equal(hard1?.rewards.xp, 500);
    const live = wxBossLifeDrainCommitWithoutHeal({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      atk: STARVED_VAMPIRE_ATK,
      action: lifeDrainTriggerAction(),
    });
    assert.equal(
      isChallengeCompleted(
        hard1!,
        challengeProgress({ healUsed: live.healUsed, totalDamage: 12 }),
      ),
      true,
    );
  });
});

describe("resolveBossLifeDrainHpCommit", () => {
  it("trigger restores 10 → 25 and atk 8 → 9 without failing easy_1", () => {
    const action = lifeDrainTriggerAction();
    const next = resolveBossLifeDrainHpCommit({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      atk: STARVED_VAMPIRE_ATK,
      action,
    });
    assert.equal(bossLifeDrainHealFromAction(action), LIFE_DRAIN_HEAL_AMOUNT);
    assert.equal(bossLifeDrainAtkFromAction(action), LIFE_DRAIN_ATK_GAIN);
    assert.equal(next.hp, 25);
    assert.equal(next.atk, 9);
    assert.equal(next.restored, LIFE_DRAIN_HEAL_AMOUNT);
    assert.equal(next.atkGained, LIFE_DRAIN_ATK_GAIN);
    assert.equal(next.healUsed, false);
    assert.equal(
      isChallengeCompleted(
        easy1!,
        challengeProgress({ healUsed: next.healUsed }),
      ),
      true,
      "boss self-heal must not fail no-heal 50 Doka (unique vs #948 Dawn)",
    );
  });

  it("10 HP pawn survives Strike 10 and victory must not persist", () => {
    const next = resolveBossLifeDrainHpCommit({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      atk: STARVED_VAMPIRE_ATK,
      action: lifeDrainTriggerAction(),
    });
    assert.equal(next.hp, 25);
    assert.equal(Math.max(0, next.hp - PLAYER_STRIKE_DAMAGE), 15);
    assert.equal(victoryAfterHit(next.hp, PLAYER_STRIKE_DAMAGE), false);
    assert.equal(next.hostilesRemaining, 1);
  });

  it("1 HP pawn is topped to 16 so a 12 HP hit does not award victory", () => {
    const live = wxBossLifeDrainCommitWithoutHeal({
      hp: 1,
      maxHp: STARVED_VAMPIRE_HP,
      atk: STARVED_VAMPIRE_ATK,
      action: lifeDrainTriggerAction(),
    });
    assert.equal(victoryAfterHit(live.hp, 12), true);
    const next = resolveBossLifeDrainHpCommit({
      hp: 1,
      maxHp: STARVED_VAMPIRE_HP,
      atk: STARVED_VAMPIRE_ATK,
      action: lifeDrainTriggerAction(),
    });
    assert.equal(next.hp, 16);
    assert.equal(victoryAfterHit(next.hp, 12), false);
  });

  it("caps at maxHp (50 → 60) and still grants +1 atk", () => {
    const next = resolveBossLifeDrainHpCommit({
      hp: 50,
      maxHp: STARVED_VAMPIRE_HP,
      atk: STARVED_VAMPIRE_ATK,
      action: lifeDrainTriggerAction(),
    });
    assert.equal(next.hp, STARVED_VAMPIRE_HP);
    assert.equal(next.restored, 10);
    assert.equal(next.atk, 9);
  });

  it("full HP restores 0 but still grants +1 atk", () => {
    const next = resolveBossLifeDrainHpCommit({
      hp: STARVED_VAMPIRE_HP,
      maxHp: STARVED_VAMPIRE_HP,
      atk: STARVED_VAMPIRE_ATK,
      action: lifeDrainTriggerAction(),
    });
    assert.equal(next.hp, STARVED_VAMPIRE_HP);
    assert.equal(next.restored, 0);
    assert.equal(next.atk, 9);
    assert.equal(next.atkGained, 1);
    assert.equal(
      wxBossLifeDrainDroppedHeal({
        hp: STARVED_VAMPIRE_HP,
        maxHp: STARVED_VAMPIRE_HP,
        atk: STARVED_VAMPIRE_ATK,
        action: lifeDrainTriggerAction(),
      }),
      true,
      "full-HP leftover still drops the advertised +1 atk",
    );
  });

  it("progress 7/10 log is not a heal", () => {
    const action = lifeDrainProgressAction(7);
    assert.equal(bossLifeDrainHealFromAction(action), null);
    const next = resolveBossLifeDrainHpCommit({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      atk: STARVED_VAMPIRE_ATK,
      action,
    });
    assert.equal(next.hp, 10);
    assert.equal(next.atk, STARVED_VAMPIRE_ATK);
    assert.equal(
      wxBossLifeDrainDroppedHeal({
        hp: 10,
        maxHp: STARVED_VAMPIRE_HP,
        atk: STARVED_VAMPIRE_ATK,
        action,
      }),
      false,
    );
  });

  it("0 extra damageDealt never matches the trigger (useBossAI leftover)", () => {
    const action = lifeDrainProgressAction(0);
    assert.equal(LIFE_DRAIN_TRIGGER_THRESHOLD, 10);
    assert.equal(bossLifeDrainHealFromAction(action), null);
    assert.equal(
      resolveBossLifeDrainHpCommit({
        hp: 10,
        maxHp: STARVED_VAMPIRE_HP,
        atk: STARVED_VAMPIRE_ATK,
        action,
      }).hp,
      10,
    );
  });

  it("Dawn damageToPlayer -10 is not this 15 HP boss heal (unique vs #948)", () => {
    const action: BossLifeDrainHealActionLike = {
      type: "ability",
      abilityResult: { damageToPlayer: DAWN_NEGATIVE_DAMAGE_TO_PLAYER },
    };
    assert.equal(bossLifeDrainHealFromAction(action), null);
    const next = resolveBossLifeDrainHpCommit({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      atk: STARVED_VAMPIRE_ATK,
      action,
    });
    assert.equal(next.hp, 10);
    assert.equal(next.atk, STARVED_VAMPIRE_ATK);
  });

  it("Countess type:attack with no damageToPlayer is not a boss heal", () => {
    const action: BossLifeDrainHealActionLike = { type: "attack" };
    const next = resolveBossLifeDrainHpCommit({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      atk: STARVED_VAMPIRE_ATK,
      action,
    });
    assert.equal(bossLifeDrainHealFromAction(action), null);
    assert.equal(next.hp, 10);
    assert.equal(
      next.atk,
      STARVED_VAMPIRE_ATK,
      "this helper must not swing leftover atk 8 at the player (#916)",
    );
  });

  it("Glyph Trap damageToPlayer 15 is not inverted into a boss heal", () => {
    const action: BossLifeDrainHealActionLike = {
      type: "ability",
      abilityResult: { damageToPlayer: GLYPH_TRAP_DAMAGE },
    };
    assert.equal(bossLifeDrainHealFromAction(action), null);
    assert.equal(
      resolveBossLifeDrainHpCommit({
        hp: 10,
        maxHp: STARVED_VAMPIRE_HP,
        atk: STARVED_VAMPIRE_ATK,
        action,
      }).hp,
      10,
    );
  });

  it("VAMPIRIC_AOE damageToPlayer 10 is not this 15 HP self-heal", () => {
    const action: BossLifeDrainHealActionLike = {
      type: "ability",
      ability: "VAMPIRIC_AOE",
      abilityResult: { damageToPlayer: VAMPIRIC_AOE_DAMAGE },
    };
    assert.equal(bossLifeDrainHealFromAction(action), null);
    const next = resolveBossLifeDrainHpCommit({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      atk: STARVED_VAMPIRE_ATK,
      action,
    });
    assert.equal(next.hp, 10);
    assert.equal(next.atk, STARVED_VAMPIRE_ATK);
  });

  it("kit type:spell starter-drain healAmount 5 is not this trigger", () => {
    const drain = mustSpell("starter-drain");
    assert.equal(Number(drain.healAmount), 5);
    assert.equal(Number(drain.damage), 10);
    const action: BossLifeDrainHealActionLike = {
      type: "spell",
      abilityResult: { healAmount: Number(drain.healAmount) },
    };
    assert.equal(bossLifeDrainHealFromAction(action), null);
    const next = resolveBossLifeDrainHpCommit({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      atk: STARVED_VAMPIRE_ATK,
      action,
    });
    assert.equal(next.hp, 10, "kit drain 5 is the ~15873 arm, not 15");
    assert.equal(next.atk, STARVED_VAMPIRE_ATK, "kit drain does not +atk");
    assert.notEqual(LIFE_DRAIN_HEAL_AMOUNT, Number(drain.healAmount));
  });

  it("LIFE_DRAIN ability id is the production enum string", () => {
    assert.equal(LIFE_DRAIN_ABILITY, "LIFE_DRAIN");
  });

  it("type:move dest is not a heal (unique vs #872)", () => {
    const action: BossLifeDrainHealActionLike = { type: "move" };
    assert.equal(
      resolveBossLifeDrainHpCommit({
        hp: 10,
        maxHp: STARVED_VAMPIRE_HP,
        atk: STARVED_VAMPIRE_ATK,
        action,
      }).hp,
      10,
    );
  });

  it("boss self-heal is not challenge damage — Untouchable still holds", () => {
    assert.equal(untouchable?.rewards.xp, 1000);
    const next = resolveBossLifeDrainHpCommit({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      atk: STARVED_VAMPIRE_ATK,
      action: lifeDrainTriggerAction(),
    });
    assert.equal(next.hp, 25);
    assert.equal(
      isChallengeCompleted(
        untouchable!,
        challengeProgress({ healUsed: next.healUsed, totalDamage: 0 }),
      ),
      true,
    );
  });

  it("already-true player healUsed is preserved, not invented", () => {
    const next = resolveBossLifeDrainHpCommit({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      atk: STARVED_VAMPIRE_ATK,
      action: lifeDrainTriggerAction(),
      healUsed: true,
    });
    assert.equal(next.healUsed, true);
    assert.equal(next.hp, 25);
  });

  it("non-finite damageToPlayer with no trigger log is not a heal", () => {
    const action: BossLifeDrainHealActionLike = {
      type: "ability",
      abilityResult: { damageToPlayer: Number.NaN },
    };
    assert.equal(bossLifeDrainHealFromAction(action), null);
    assert.equal(
      resolveBossLifeDrainHpCommit({
        hp: 10,
        maxHp: STARVED_VAMPIRE_HP,
        atk: STARVED_VAMPIRE_ATK,
        action,
      }).hp,
      10,
    );
  });
});
