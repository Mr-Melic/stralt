import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import {
  type ChallengePanelProgress,
  DEFAULT_CHALLENGES,
  isChallengeCompleted,
  recordChallengeDamageTaken,
} from "../utils/challengeCompletion.ts";
import { shouldAwardVictory } from "./battleSetup.ts";
import {
  type BossVampiricAoeHealActionLike,
  VAMPIRIC_AOE_ABILITY,
  VAMPIRIC_AOE_DRAIN_AMOUNT,
  VAMPIRIC_AOE_LOG,
  VAMPIRIC_AOE_RADIUS,
  bossVampiricAoeHealFromAction,
  resolveBossVampiricAoeHpCommit,
  vampiricAoeAdvertisedHealFromResult,
  vampiricAoeInRadius,
  vampiricAoePlayerDrain,
  vampiricAoeTargetDrain,
  wxBossVampiricAoeCommitWithoutHeal,
  wxBossVampiricAoeDroppedHeal,
  wxBossVampiricAoePlayerDamageFromAction,
} from "./bossVampiricAoeHealCommit.ts";

/** Starved Vampire Pawn `baseStats` — leftover melee, not this heal. */
const STARVED_VAMPIRE_HP = 60;
const GLYPH_TRAP_DAMAGE = 15;
const DAWN_NEGATIVE_DAMAGE_TO_PLAYER = -10;
const LIFE_DRAIN_TRIGGER_HEAL = 15;
const PLAYER_STRIKE_DAMAGE = Number(physicalAttackSpell.damage);

const easy1 = DEFAULT_CHALLENGES.find((c) => c.id === "easy_1");
const hard1 = DEFAULT_CHALLENGES.find((c) => c.id === "hard_1");
const untouchable = DEFAULT_CHALLENGES.find((c) => c.id === "legendary_1");

function vampiricAoeAction(args?: {
  damageToTargets?: Record<string, number>;
  damageToPlayer?: number;
}): BossVampiricAoeHealActionLike {
  return {
    type: "ability",
    ability: VAMPIRIC_AOE_ABILITY,
    abilityResult: {
      damageToPlayer: args?.damageToPlayer ?? vampiricAoePlayerDrain(),
      damageToTargets: args?.damageToTargets ?? {},
      logMessages: [VAMPIRIC_AOE_LOG],
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

describe("wxBossVampiricAoeCommitWithoutHeal (live leftover)", () => {
  it("player-only drain leaves 10/60 unchanged while the player takes 10", () => {
    const action = vampiricAoeAction();
    const live = wxBossVampiricAoeCommitWithoutHeal({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      playerHp: 40,
      action,
    });
    assert.equal(VAMPIRIC_AOE_LOG.includes("3-tile radius"), true);
    assert.equal(live.hp, 10);
    assert.equal(live.playerHp, 30);
    assert.equal(live.restored, 0);
    assert.equal(live.playerLost, VAMPIRIC_AOE_DRAIN_AMOUNT);
    assert.equal(live.healUsed, false);
    assert.equal(
      wxBossVampiricAoeDroppedHeal({
        hp: 10,
        maxHp: STARVED_VAMPIRE_HP,
        playerHp: 40,
        action,
      }),
      true,
      "live WX drops the advertised 10 HP boss heal from player drain",
    );
  });

  it("10 HP pawn dies to Strike 10 so victory persist still fires", () => {
    assert.equal(PLAYER_STRIKE_DAMAGE, 10);
    const live = wxBossVampiricAoeCommitWithoutHeal({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      playerHp: 40,
      action: vampiricAoeAction(),
    });
    assert.equal(live.hp, 10);
    assert.equal(victoryAfterHit(live.hp, PLAYER_STRIKE_DAMAGE), true);
  });

  it("easy_1 50 Doka still persists — leftover is not a player heal", () => {
    assert.equal(easy1?.rewards.doka, 50);
    const live = wxBossVampiricAoeCommitWithoutHeal({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      playerHp: 40,
      action: vampiricAoeAction(),
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
    const live = wxBossVampiricAoeCommitWithoutHeal({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      playerHp: 40,
      action: vampiricAoeAction(),
    });
    const totalDamage = recordChallengeDamageTaken(0, live.playerLost);
    assert.equal(totalDamage, 10);
    assert.equal(
      isChallengeCompleted(
        hard1!,
        challengeProgress({ healUsed: live.healUsed, totalDamage }),
      ),
      true,
    );
  });
});

describe("resolveBossVampiricAoeHpCommit", () => {
  it("player-only drain restores 10 → 20 without failing easy_1", () => {
    const action = vampiricAoeAction();
    const next = resolveBossVampiricAoeHpCommit({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      playerHp: 40,
      action,
    });
    assert.equal(
      bossVampiricAoeHealFromAction(action),
      VAMPIRIC_AOE_DRAIN_AMOUNT,
    );
    assert.equal(next.hp, 20);
    assert.equal(next.playerHp, 30);
    assert.equal(next.restored, VAMPIRIC_AOE_DRAIN_AMOUNT);
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
    const next = resolveBossVampiricAoeHpCommit({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      playerHp: 40,
      action: vampiricAoeAction(),
    });
    assert.equal(next.hp, 20);
    assert.equal(Math.max(0, next.hp - PLAYER_STRIKE_DAMAGE), 10);
    assert.equal(victoryAfterHit(next.hp, PLAYER_STRIKE_DAMAGE), false);
    assert.equal(next.hostilesRemaining, 1);
  });

  it("two nearby minions feed +30 so a 12 HP hit does not award victory", () => {
    const boss = { id: "boss-17", x: 8, y: 8 };
    const damageToTargets = vampiricAoeTargetDrain({
      boss,
      others: [
        { id: "minion-a", x: 9, y: 8 },
        { id: "minion-b", x: 8, y: 9 },
      ],
    });
    assert.deepEqual(damageToTargets, {
      "minion-a": VAMPIRIC_AOE_DRAIN_AMOUNT,
      "minion-b": VAMPIRIC_AOE_DRAIN_AMOUNT,
    });
    const action = vampiricAoeAction({ damageToTargets });
    assert.equal(
      vampiricAoeAdvertisedHealFromResult(action.abilityResult!),
      30,
    );
    const live = wxBossVampiricAoeCommitWithoutHeal({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      playerHp: 40,
      action,
    });
    assert.equal(victoryAfterHit(live.hp, 12), true);
    const next = resolveBossVampiricAoeHpCommit({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      playerHp: 40,
      action,
    });
    assert.equal(next.hp, 40);
    assert.equal(next.restored, 30);
    assert.equal(victoryAfterHit(next.hp, 12), false);
  });

  it("a Manhattan-4 minion does not feed the boss (spread-out guide)", () => {
    const boss = { id: "boss-17", x: 8, y: 8 };
    const far = { id: "minion-far", x: 12, y: 8 };
    assert.equal(VAMPIRIC_AOE_RADIUS, 3);
    assert.equal(vampiricAoeInRadius(boss, far), false);
    const damageToTargets = vampiricAoeTargetDrain({
      boss,
      others: [far, { id: "minion-near", x: 11, y: 8 }],
    });
    assert.equal(damageToTargets["minion-far"], undefined);
    assert.equal(damageToTargets["minion-near"], VAMPIRIC_AOE_DRAIN_AMOUNT);
    const action = vampiricAoeAction({ damageToTargets });
    const next = resolveBossVampiricAoeHpCommit({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      playerHp: 40,
      action,
    });
    assert.equal(next.hp, 30, "player 10 + one in-radius minion 10");
    assert.notEqual(next.hp, 40, "far crumb must not count");
  });

  it("spreading the player does not cut production player drain", () => {
    assert.equal(vampiricAoePlayerDrain(), VAMPIRIC_AOE_DRAIN_AMOUNT);
    const farPlayerAction = vampiricAoeAction();
    assert.equal(
      wxBossVampiricAoePlayerDamageFromAction(farPlayerAction),
      VAMPIRIC_AOE_DRAIN_AMOUNT,
      "applyVampiricAoe always writes damageToPlayer 10",
    );
  });

  it("caps at maxHp (50 → 60)", () => {
    const next = resolveBossVampiricAoeHpCommit({
      hp: 50,
      maxHp: STARVED_VAMPIRE_HP,
      playerHp: 40,
      action: vampiricAoeAction(),
    });
    assert.equal(next.hp, STARVED_VAMPIRE_HP);
    assert.equal(next.restored, 10);
  });

  it("full HP restores 0 — leftover at cap is invisible", () => {
    const action = vampiricAoeAction();
    const next = resolveBossVampiricAoeHpCommit({
      hp: STARVED_VAMPIRE_HP,
      maxHp: STARVED_VAMPIRE_HP,
      playerHp: 40,
      action,
    });
    assert.equal(next.hp, STARVED_VAMPIRE_HP);
    assert.equal(next.restored, 0);
    assert.equal(next.playerHp, 30);
    assert.equal(
      wxBossVampiricAoeDroppedHeal({
        hp: STARVED_VAMPIRE_HP,
        maxHp: STARVED_VAMPIRE_HP,
        playerHp: 40,
        action,
      }),
      false,
    );
  });

  it("LIFE_DRAIN trigger 15 / +atk is not this radius drain (unique vs #968)", () => {
    const action: BossVampiricAoeHealActionLike = {
      type: "ability",
      ability: "LIFE_DRAIN",
      abilityResult: {
        logMessages: [
          "The Starved Vampire Pawn drains your life force, growing stronger! It heals 15 HP and gains +1 attack!",
        ],
      },
    };
    assert.equal(bossVampiricAoeHealFromAction(action), null);
    const next = resolveBossVampiricAoeHpCommit({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      playerHp: 40,
      action,
    });
    assert.equal(next.hp, 10);
    assert.equal(next.playerHp, 40);
    assert.notEqual(VAMPIRIC_AOE_DRAIN_AMOUNT, LIFE_DRAIN_TRIGGER_HEAL);
  });

  it("Dawn damageToPlayer -10 is not this boss heal (unique vs #948)", () => {
    const action: BossVampiricAoeHealActionLike = {
      type: "ability",
      abilityResult: { damageToPlayer: DAWN_NEGATIVE_DAMAGE_TO_PLAYER },
    };
    assert.equal(bossVampiricAoeHealFromAction(action), null);
    const next = resolveBossVampiricAoeHpCommit({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      playerHp: 90,
      action,
    });
    assert.equal(next.hp, 10);
    assert.equal(next.playerHp, 90, "must not invert -10 onto the player here");
  });

  it("Countess type:attack with no damageToPlayer is not a boss heal", () => {
    const action: BossVampiricAoeHealActionLike = { type: "attack" };
    const next = resolveBossVampiricAoeHpCommit({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      playerHp: 40,
      action,
    });
    assert.equal(bossVampiricAoeHealFromAction(action), null);
    assert.equal(next.hp, 10);
    assert.equal(
      next.playerHp,
      40,
      "must not swing leftover atk at the player (#916)",
    );
  });

  it("Glyph Trap damageToPlayer 15 is not inverted into a boss heal", () => {
    const action: BossVampiricAoeHealActionLike = {
      type: "ability",
      ability: "GLYPH_TRAP",
      abilityResult: { damageToPlayer: GLYPH_TRAP_DAMAGE },
    };
    assert.equal(bossVampiricAoeHealFromAction(action), null);
    assert.equal(
      resolveBossVampiricAoeHpCommit({
        hp: 10,
        maxHp: STARVED_VAMPIRE_HP,
        playerHp: 40,
        action,
      }).hp,
      10,
    );
  });

  it("queen-ray / chain lightning damageToTargets is not this heal", () => {
    const ray: BossVampiricAoeHealActionLike = {
      type: "ability",
      ability: "ATTACK_ALL_LINES",
      abilityResult: {
        damageToPlayer: 6,
        damageToTargets: { "pawn-1": 6 },
      },
    };
    const chain: BossVampiricAoeHealActionLike = {
      type: "ability",
      ability: "CHAIN_LIGHTNING",
      abilityResult: {
        damageToPlayer: 8,
        damageToTargets: { "rook-1": 8 },
      },
    };
    assert.equal(bossVampiricAoeHealFromAction(ray), null);
    assert.equal(bossVampiricAoeHealFromAction(chain), null);
  });

  it("kit type:spell starter-drain / lifesteal-nova is not this ability", () => {
    const drain = mustSpell("starter-drain");
    const nova = mustSpell("spell-lifesteal-nova");
    assert.equal(Number(drain.healAmount), 5);
    assert.equal(Number(nova.healAmount), 10);
    const drainAction: BossVampiricAoeHealActionLike = {
      type: "spell",
      abilityResult: { healAmount: Number(drain.healAmount) },
    };
    const novaAction: BossVampiricAoeHealActionLike = {
      type: "spell",
      abilityResult: { healAmount: Number(nova.healAmount) },
    };
    assert.equal(bossVampiricAoeHealFromAction(drainAction), null);
    assert.equal(bossVampiricAoeHealFromAction(novaAction), null);
    assert.equal(
      resolveBossVampiricAoeHpCommit({
        hp: 10,
        maxHp: STARVED_VAMPIRE_HP,
        playerHp: 40,
        action: drainAction,
      }).hp,
      10,
      "kit drain 5 is the ~15873 arm, not radius-3 drained HP",
    );
  });

  it("VAMPIRIC_AOE ability id is the production enum string", () => {
    assert.equal(VAMPIRIC_AOE_ABILITY, "VAMPIRIC_AOE");
  });

  it("type:move dest is not a heal (unique vs #872)", () => {
    const action: BossVampiricAoeHealActionLike = { type: "move" };
    assert.equal(
      resolveBossVampiricAoeHpCommit({
        hp: 10,
        maxHp: STARVED_VAMPIRE_HP,
        playerHp: 40,
        action,
      }).hp,
      10,
    );
  });

  it("player HP loss fails Untouchable — unique vs #968 leftover with no player field", () => {
    assert.equal(untouchable?.rewards.xp, 1000);
    const next = resolveBossVampiricAoeHpCommit({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      playerHp: 40,
      action: vampiricAoeAction(),
    });
    const totalDamage = recordChallengeDamageTaken(0, next.playerLost);
    assert.equal(next.hp, 20);
    assert.equal(totalDamage, 10);
    assert.equal(
      isChallengeCompleted(
        untouchable!,
        challengeProgress({ healUsed: next.healUsed, totalDamage }),
      ),
      false,
    );
  });

  it("already-true player healUsed is preserved, not invented", () => {
    const next = resolveBossVampiricAoeHpCommit({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      playerHp: 40,
      action: vampiricAoeAction(),
      healUsed: true,
    });
    assert.equal(next.healUsed, true);
    assert.equal(next.hp, 20);
  });

  it("non-finite damageToPlayer with no targets is not a heal", () => {
    const action: BossVampiricAoeHealActionLike = {
      type: "ability",
      ability: VAMPIRIC_AOE_ABILITY,
      abilityResult: { damageToPlayer: Number.NaN },
    };
    assert.equal(bossVampiricAoeHealFromAction(action), null);
    assert.equal(
      resolveBossVampiricAoeHpCommit({
        hp: 10,
        maxHp: STARVED_VAMPIRE_HP,
        playerHp: 40,
        action,
      }).hp,
      10,
    );
  });

  it("does not apply minion HP — unique leftover is boss heal, not damageToTargets", () => {
    const action = vampiricAoeAction({
      damageToTargets: { "minion-a": 10 },
    });
    const next = resolveBossVampiricAoeHpCommit({
      hp: 10,
      maxHp: STARVED_VAMPIRE_HP,
      playerHp: 40,
      action,
    });
    assert.equal(next.hp, 30, "boss heals player 10 + minion 10");
    assert.equal(
      action.abilityResult?.damageToTargets?.["minion-a"],
      10,
      "WX still ignores damageToTargets; this helper does not debit minion HP",
    );
  });
});
