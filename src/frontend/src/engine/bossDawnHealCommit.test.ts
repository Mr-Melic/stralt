import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  type ChallengePanelProgress,
  DEFAULT_CHALLENGES,
  isChallengeCompleted,
} from "../utils/challengeCompletion.ts";
import {
  type BossDawnHealActionLike,
  DAWN_HEAL_AMOUNT,
  DAWN_HEAL_LOG,
  DAWN_NEGATIVE_DAMAGE_TO_PLAYER,
  bossDawnHealFromAction,
  resolveBossDawnHpCommit,
  wxBossDawnCommitWithoutHeal,
  wxBossDawnDroppedHeal,
} from "./bossDawnHealCommit.ts";

/** Twin Monarchs `baseStats.atk` — #916 melee leftover, not this heal. */
const TWIN_MONARCHS_ATK = 22;
const LEVEL_1_MAX_HP = 100;
const GLYPH_TRAP_DAMAGE = 15;
const DUSK_DOT_TICK = 5;

const easy1 = DEFAULT_CHALLENGES.find((c) => c.id === "easy_1");
const hard1 = DEFAULT_CHALLENGES.find((c) => c.id === "hard_1");
const untouchable = DEFAULT_CHALLENGES.find((c) => c.id === "legendary_1");

function dawnHealAction(): BossDawnHealActionLike {
  return {
    type: "ability",
    abilityResult: {
      damageToPlayer: DAWN_NEGATIVE_DAMAGE_TO_PLAYER,
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

describe("wxBossDawnCommitWithoutHeal (live leftover)", () => {
  it("Dawn +10 HP log leaves 90/100 unchanged and keeps easy_1", () => {
    assert.equal(easy1?.rewards.doka, 50);
    const action = dawnHealAction();
    const live = wxBossDawnCommitWithoutHeal({
      hp: 90,
      maxHp: LEVEL_1_MAX_HP,
      action,
    });
    assert.equal(DAWN_HEAL_LOG.includes("+10 HP heal"), true);
    assert.equal(live.hp, 90);
    assert.equal(live.restored, 0);
    assert.equal(live.healUsed, false);
    assert.equal(
      wxBossDawnDroppedHeal({
        hp: 90,
        maxHp: LEVEL_1_MAX_HP,
        action,
      }),
      true,
      "live WX drops the advertised heal",
    );
    assert.equal(
      isChallengeCompleted(
        easy1!,
        challengeProgress({ healUsed: live.healUsed }),
      ),
      true,
      "easy_1 50 Doka still persists after a lying heal log",
    );
  });

  it("10 HP player is not topped before Glyph Trap 15", () => {
    const live = wxBossDawnCommitWithoutHeal({
      hp: 10,
      maxHp: LEVEL_1_MAX_HP,
      action: dawnHealAction(),
    });
    assert.equal(live.hp, 10);
    assert.equal(Math.max(0, live.hp - GLYPH_TRAP_DAMAGE), 0);
  });

  it("hard_1 200 Doka / 500 XP still persists after the unused heal", () => {
    assert.equal(hard1?.rewards.doka, 200);
    assert.equal(hard1?.rewards.xp, 500);
    const live = wxBossDawnCommitWithoutHeal({
      hp: 90,
      maxHp: LEVEL_1_MAX_HP,
      action: dawnHealAction(),
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

describe("resolveBossDawnHpCommit", () => {
  it("Dawn roll 1 restores 90 → 100 and fails easy_1", () => {
    const action = dawnHealAction();
    const next = resolveBossDawnHpCommit({
      hp: 90,
      maxHp: LEVEL_1_MAX_HP,
      action,
    });
    assert.equal(bossDawnHealFromAction(action), DAWN_HEAL_AMOUNT);
    assert.equal(next.hp, LEVEL_1_MAX_HP);
    assert.equal(next.restored, DAWN_HEAL_AMOUNT);
    assert.equal(next.healUsed, true);
    assert.equal(
      isChallengeCompleted(
        easy1!,
        challengeProgress({ healUsed: next.healUsed }),
      ),
      false,
      "no-heal 50 Doka must not persist after a real Dawn heal",
    );
  });

  it("hard_1 fails when Dawn actually restores HP", () => {
    const next = resolveBossDawnHpCommit({
      hp: 90,
      maxHp: LEVEL_1_MAX_HP,
      action: dawnHealAction(),
    });
    assert.equal(
      isChallengeCompleted(
        hard1!,
        challengeProgress({ healUsed: next.healUsed, totalDamage: 12 }),
      ),
      false,
    );
  });

  it("10 HP player is topped to 20 and survives Glyph Trap 15", () => {
    const next = resolveBossDawnHpCommit({
      hp: 10,
      maxHp: LEVEL_1_MAX_HP,
      action: dawnHealAction(),
    });
    assert.equal(next.hp, 20);
    assert.equal(Math.max(0, next.hp - GLYPH_TRAP_DAMAGE), 5);
    assert.equal(
      wxBossDawnDroppedHeal({
        hp: 10,
        maxHp: LEVEL_1_MAX_HP,
        action: dawnHealAction(),
      }),
      true,
    );
  });

  it("caps at maxHp (95 → 100) and still fails no-heal", () => {
    const next = resolveBossDawnHpCommit({
      hp: 95,
      maxHp: LEVEL_1_MAX_HP,
      action: dawnHealAction(),
    });
    assert.equal(next.hp, LEVEL_1_MAX_HP);
    assert.equal(next.restored, 5);
    assert.equal(next.healUsed, true);
  });

  it("full HP restores 0 and does not fail easy_1", () => {
    const next = resolveBossDawnHpCommit({
      hp: LEVEL_1_MAX_HP,
      maxHp: LEVEL_1_MAX_HP,
      action: dawnHealAction(),
    });
    assert.equal(next.hp, LEVEL_1_MAX_HP);
    assert.equal(next.restored, 0);
    assert.equal(next.healUsed, false);
    assert.equal(
      wxBossDawnDroppedHeal({
        hp: LEVEL_1_MAX_HP,
        maxHp: LEVEL_1_MAX_HP,
        action: dawnHealAction(),
      }),
      false,
      "cap-equal leftover is not a dropped heal",
    );
    assert.equal(
      isChallengeCompleted(
        easy1!,
        challengeProgress({ healUsed: next.healUsed }),
      ),
      true,
    );
  });

  it("caps 110 + 10 at an explicit maxHp of 115", () => {
    const next = resolveBossDawnHpCommit({
      hp: 110,
      maxHp: 115,
      action: dawnHealAction(),
    });
    assert.equal(next.hp, 115);
    assert.equal(next.restored, 5);
  });

  it("queen-ray damageToPlayer 28 is not a heal (unique vs #916 HP)", () => {
    const action: BossDawnHealActionLike = {
      type: "ability",
      abilityResult: { damageToPlayer: 28 },
    };
    assert.equal(bossDawnHealFromAction(action), null);
    const next = resolveBossDawnHpCommit({
      hp: 90,
      maxHp: LEVEL_1_MAX_HP,
      action,
    });
    assert.equal(next.hp, 90);
    assert.equal(next.healUsed, false);
    assert.equal(
      wxBossDawnDroppedHeal({ hp: 90, maxHp: LEVEL_1_MAX_HP, action }),
      false,
    );
  });

  it("Countess type:attack with no damageToPlayer is not a heal", () => {
    const action: BossDawnHealActionLike = { type: "attack" };
    const next = resolveBossDawnHpCommit({
      hp: 90,
      maxHp: LEVEL_1_MAX_HP,
      action,
    });
    assert.equal(bossDawnHealFromAction(action), null);
    assert.equal(next.hp, 90);
    assert.equal(
      next.hp,
      90,
      "this helper must not swing Twin Monarchs atk 22",
    );
    assert.equal(TWIN_MONARCHS_ATK, 22);
  });

  it("AP burst playerApModifier +2 is not a heal (unique vs #376 copy)", () => {
    const action: BossDawnHealActionLike = {
      type: "ability",
      abilityResult: { playerApModifier: 2 },
    };
    const next = resolveBossDawnHpCommit({
      hp: 90,
      maxHp: LEVEL_1_MAX_HP,
      action,
    });
    assert.equal(next.hp, 90);
    assert.equal(next.healUsed, false);
    assert.equal(
      wxBossDawnDroppedHeal({ hp: 90, maxHp: LEVEL_1_MAX_HP, action }),
      false,
    );
  });

  it("Dusk DoT-only abilityResult does not restore HP", () => {
    const action: BossDawnHealActionLike = {
      type: "ability",
      abilityResult: {},
    };
    const next = resolveBossDawnHpCommit({
      hp: 10,
      maxHp: LEVEL_1_MAX_HP,
      action,
    });
    assert.equal(next.hp, 10);
    assert.equal(Math.max(0, next.hp - DUSK_DOT_TICK), 5);
  });

  it("Glyph Trap damageToPlayer 15 is not inverted into a heal", () => {
    const action: BossDawnHealActionLike = {
      type: "ability",
      abilityResult: { damageToPlayer: GLYPH_TRAP_DAMAGE },
    };
    const next = resolveBossDawnHpCommit({
      hp: 90,
      maxHp: LEVEL_1_MAX_HP,
      action,
    });
    assert.equal(next.hp, 90);
    assert.equal(bossDawnHealFromAction(action), null);
  });

  it("shield HP does not absorb a Dawn heal", () => {
    const shieldHp = 20;
    const next = resolveBossDawnHpCommit({
      hp: 80,
      maxHp: LEVEL_1_MAX_HP,
      action: dawnHealAction(),
    });
    assert.equal(next.hp, 90);
    assert.equal(shieldHp, 20, "heal bypasses shieldHpRef");
  });

  it("Dawn heal is not challenge damage — Untouchable still holds", () => {
    assert.equal(untouchable?.rewards.xp, 1000);
    const next = resolveBossDawnHpCommit({
      hp: 90,
      maxHp: LEVEL_1_MAX_HP,
      action: dawnHealAction(),
    });
    assert.equal(next.hp, 100);
    assert.equal(
      isChallengeCompleted(
        untouchable!,
        challengeProgress({ healUsed: next.healUsed, totalDamage: 0 }),
      ),
      true,
      "heal is not incoming damage; legendary_3 stays on totalDamage === 0",
    );
  });

  it("overworld inBattle false must not stick healUsed", () => {
    const next = resolveBossDawnHpCommit({
      hp: 90,
      maxHp: LEVEL_1_MAX_HP,
      action: dawnHealAction(),
      inBattle: false,
    });
    assert.equal(next.hp, 100);
    assert.equal(next.healUsed, false);
  });

  it("non-finite damageToPlayer is not a heal", () => {
    const action: BossDawnHealActionLike = {
      type: "ability",
      abilityResult: { damageToPlayer: Number.NaN },
    };
    assert.equal(bossDawnHealFromAction(action), null);
    assert.equal(
      resolveBossDawnHpCommit({
        hp: 90,
        maxHp: LEVEL_1_MAX_HP,
        action,
      }).hp,
      90,
    );
  });

  it("damageToPlayer 0 is not a heal", () => {
    const action: BossDawnHealActionLike = {
      type: "ability",
      abilityResult: { damageToPlayer: 0 },
    };
    assert.equal(
      resolveBossDawnHpCommit({
        hp: 90,
        maxHp: LEVEL_1_MAX_HP,
        action,
      }).hp,
      90,
    );
  });
});
