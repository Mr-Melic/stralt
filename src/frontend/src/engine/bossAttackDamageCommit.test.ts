import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  type BossAttackActionLike,
  bossAttackMeleeFromAction,
  resolveBossAttackDamage,
  wxBossAttackCommitWithoutDamage,
  wxBossAttackDroppedDamage,
} from "./bossAttackDamageCommit.ts";

/** `DEFAULT_BOSS_CONFIGS` / WX spawn `enemy.damage = baseStats.atk`. */
const COUNTESS_ATK = 40;
const ARCHBISHOP_ATK = 35;
const FINAL_PAWN_ATK = 15;
const BROODMOTHER_ATK = 28;
const FORTRESS_ATK = 10;

function attackPlayer(): BossAttackActionLike {
  return {
    type: "attack",
    targetX: 8,
    targetY: 4,
  };
}

function broodmotherShell(): BossAttackActionLike {
  return {
    type: "attack",
    targetX: 8,
    targetY: 4,
    abilityResult: {},
  };
}

function lavaTrailMove(): BossAttackActionLike {
  return {
    type: "move",
    targetX: 5,
    targetY: 4,
    abilityResult: { damageToPlayer: undefined },
  };
}

describe("wxBossAttackCommitWithoutDamage (live leftover)", () => {
  it("Countess bleed-miss logs attacks and deals 0 HP", () => {
    const action = attackPlayer();
    const live = wxBossAttackCommitWithoutDamage({
      action,
      meleeDamage: COUNTESS_ATK,
    });
    assert.equal(live, 0);
    assert.equal(
      wxBossAttackDroppedDamage({ action, meleeDamage: COUNTESS_ATK }),
      true,
      "live WX drops the advertised melee",
    );
    assert.equal(Math.max(0, 10 - live), 10, "10 HP player keeps Untouchable");
  });

  it("Pale Archbishop slam deals 0 HP", () => {
    const action = attackPlayer();
    assert.equal(
      wxBossAttackCommitWithoutDamage({
        action,
        meleeDamage: ARCHBISHOP_ATK,
      }),
      0,
    );
  });

  it("Final Pawn feeble projectile deals 0 HP", () => {
    const action: BossAttackActionLike = {
      type: "attack",
      targetX: 8,
      targetY: 4,
    };
    assert.equal(
      wxBossAttackCommitWithoutDamage({
        action,
        meleeDamage: FINAL_PAWN_ATK,
      }),
      0,
    );
  });

  it("Broodmother type:attack + SHELL_ARMOR result still deals 0 HP", () => {
    const action = broodmotherShell();
    assert.equal(
      wxBossAttackCommitWithoutDamage({
        action,
        meleeDamage: BROODMOTHER_ATK,
      }),
      0,
    );
    assert.equal(
      wxBossAttackDroppedDamage({ action, meleeDamage: BROODMOTHER_ATK }),
      true,
    );
  });
});

describe("resolveBossAttackDamage", () => {
  it("Countess bleed-miss swings enemy.damage 40", () => {
    const action = attackPlayer();
    const raw = resolveBossAttackDamage({
      action,
      meleeDamage: COUNTESS_ATK,
    });
    assert.equal(raw, COUNTESS_ATK);
    assert.equal(Math.max(0, 100 - raw), 60);
    assert.equal(
      Math.max(0, 10 - raw),
      0,
      "10 HP player dies; Untouchable fails",
    );
  });

  it("Pale Archbishop slam swings 35", () => {
    const action = attackPlayer();
    assert.equal(
      resolveBossAttackDamage({ action, meleeDamage: ARCHBISHOP_ATK }),
      ARCHBISHOP_ATK,
    );
  });

  it("Final Pawn projectile swings 15 (range flavor, still type:attack)", () => {
    const action: BossAttackActionLike = {
      type: "attack",
      targetX: 9,
      targetY: 4,
    };
    assert.equal(
      resolveBossAttackDamage({ action, meleeDamage: FINAL_PAWN_ATK }),
      FINAL_PAWN_ATK,
    );
    assert.equal(
      wxBossAttackDroppedDamage({ action, meleeDamage: FINAL_PAWN_ATK }),
      true,
    );
  });

  it("Broodmother shell fallthrough uses melee, not 0", () => {
    const action = broodmotherShell();
    assert.equal(
      resolveBossAttackDamage({ action, meleeDamage: BROODMOTHER_ATK }),
      BROODMOTHER_ATK,
    );
  });

  it("Alabaster Fortress crush swings 10", () => {
    const action = attackPlayer();
    assert.equal(
      resolveBossAttackDamage({ action, meleeDamage: FORTRESS_ATK }),
      FORTRESS_ATK,
    );
  });

  it("ATTACK_ALL_LINES damageToPlayer still wins (does not steal queen-ray HP)", () => {
    const action: BossAttackActionLike = {
      type: "ability",
      abilityResult: { damageToPlayer: 28 },
    };
    const live = wxBossAttackCommitWithoutDamage({
      action,
      meleeDamage: ARCHBISHOP_ATK,
    });
    const raw = resolveBossAttackDamage({
      action,
      meleeDamage: ARCHBISHOP_ATK,
    });
    assert.equal(live, 28);
    assert.equal(raw, 28);
    assert.equal(
      wxBossAttackDroppedDamage({ action, meleeDamage: ARCHBISHOP_ATK }),
      false,
    );
  });

  it("type:attack with attached damageToPlayer 12 uses 12, not melee 40", () => {
    const action: BossAttackActionLike = {
      type: "attack",
      abilityResult: { damageToPlayer: 12 },
    };
    assert.equal(
      resolveBossAttackDamage({ action, meleeDamage: COUNTESS_ATK }),
      12,
    );
    assert.equal(
      wxBossAttackDroppedDamage({ action, meleeDamage: COUNTESS_ATK }),
      false,
    );
  });

  it("kit type:spell must not swing melee (unique vs #498 / #888)", () => {
    const action: BossAttackActionLike = {
      type: "spell",
      targetX: 8,
      targetY: 4,
    };
    assert.equal(bossAttackMeleeFromAction(action, COUNTESS_ATK), null);
    assert.equal(
      resolveBossAttackDamage({ action, meleeDamage: COUNTESS_ATK }),
      0,
    );
    assert.equal(
      wxBossAttackCommitWithoutDamage({ action, meleeDamage: COUNTESS_ATK }),
      0,
    );
    assert.equal(
      wxBossAttackDroppedDamage({ action, meleeDamage: COUNTESS_ATK }),
      false,
    );
  });

  it("type:move LAVA_TRAIL deals 0 HP (unique vs #872 dest)", () => {
    const action = lavaTrailMove();
    assert.equal(
      resolveBossAttackDamage({ action, meleeDamage: COUNTESS_ATK }),
      0,
    );
    assert.equal(
      wxBossAttackDroppedDamage({ action, meleeDamage: COUNTESS_ATK }),
      false,
    );
  });

  it("type:ability COMPOUNDING_ROT DoT-only stays 0 (bleed is not melee)", () => {
    const action: BossAttackActionLike = {
      type: "ability",
      abilityResult: {},
    };
    assert.equal(
      resolveBossAttackDamage({ action, meleeDamage: COUNTESS_ATK }),
      0,
    );
  });

  it("Dawn damageToPlayer -10 must not become melee", () => {
    const action: BossAttackActionLike = {
      type: "ability",
      abilityResult: { damageToPlayer: -10 },
    };
    assert.equal(
      wxBossAttackCommitWithoutDamage({ action, meleeDamage: 18 }),
      0,
    );
    assert.equal(resolveBossAttackDamage({ action, meleeDamage: 18 }), 0);
    assert.equal(wxBossAttackDroppedDamage({ action, meleeDamage: 18 }), false);
  });

  it("type:attack missing meleeDamage stays 0", () => {
    const action = attackPlayer();
    assert.equal(bossAttackMeleeFromAction(action, Number.NaN), null);
    assert.equal(resolveBossAttackDamage({ action, meleeDamage: 0 }), 0);
    assert.equal(resolveBossAttackDamage({ action, meleeDamage: -4 }), 0);
    assert.equal(wxBossAttackDroppedDamage({ action, meleeDamage: 0 }), false);
  });

  it("does not walk onto the player — dest leftover stays #872", () => {
    const action = attackPlayer();
    assert.equal(action.targetX, 8);
    assert.equal(
      resolveBossAttackDamage({ action, meleeDamage: ARCHBISHOP_ATK }),
      ARCHBISHOP_ATK,
      "this helper returns HP; WorldExploration must keep the boss on origin",
    );
  });
});
