import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import {
  type ChallengePanelProgress,
  DEFAULT_CHALLENGES,
  isChallengeCompleted,
} from "../utils/challengeCompletion.ts";
import { hpAfterHeal } from "./battleSetup.ts";
import {
  type BossExsanguinatedActionLike,
  EXSANGUINATED_ABILITY,
  EXSANGUINATED_DURATION,
  EXSANGUINATED_EFFECT_NAME,
  EXSANGUINATED_LOG,
  EXSANGUINATED_MODIFIER,
  EXSANGUINATED_STAT_HEAL_PATH,
  EXSANGUINATED_STAT_LIVE,
  VAMPIRIC_AOE_ABILITY,
  bossExsanguinatedHealRecvFromAction,
  isBossExsanguinatedHealingStatRow,
  playerHealAmountAfterHealRecv,
  playerHpAfterBloodMend,
  resolveBossExsanguinatedHealRecvCommit,
  wxBossExsanguinatedCommitWithoutHealRecv,
  wxBossExsanguinatedDroppedHealRecv,
} from "./bossExsanguinatedHealRecvCommit.ts";
import { getStatModifier } from "./statusEffects.ts";

const LEVEL_1_MAX_HP = 100;
const VAMPIRIC_DRAIN = 10;
const LIFE_DRAIN_HEAL = 15;
const DAWN_NEGATIVE_DAMAGE_TO_PLAYER = -10;
const POTION_HEAL_30 = Math.floor(LEVEL_1_MAX_HP * 0.3);

const easy1 = DEFAULT_CHALLENGES.find((c) => c.id === "easy_1");

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

const bloodMend = mustSpell("starter-heal");
const BLOOD_MEND_HEAL = Number(bloodMend.healAmount);

function exsanguinatedRow() {
  return {
    stat: EXSANGUINATED_STAT_LIVE,
    modifier: EXSANGUINATED_MODIFIER,
    duration: EXSANGUINATED_DURATION,
    effectName: EXSANGUINATED_EFFECT_NAME,
    iconEmoji: "🩸",
  };
}

function vampiricAction(): BossExsanguinatedActionLike {
  return {
    type: "ability",
    ability: VAMPIRIC_AOE_ABILITY,
    abilityResult: {
      damageToPlayer: VAMPIRIC_DRAIN,
      damageToTargets: { "minion-a": VAMPIRIC_DRAIN },
      debuffsApplied: [exsanguinatedRow()],
      logMessages: [
        "The Starved Vampire Pawn unleashes a vampiric AoE drain in 3-tile radius!",
        EXSANGUINATED_LOG,
      ],
    },
  };
}

function standaloneAction(): BossExsanguinatedActionLike {
  return {
    type: "ability",
    ability: EXSANGUINATED_ABILITY,
    abilityResult: {
      debuffsApplied: [exsanguinatedRow()],
      logMessages: [EXSANGUINATED_LOG],
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

describe("wxBossExsanguinatedCommitWithoutHealRecv (live leftover)", () => {
  it("VAMPIRIC_AOE copies stat healing so Blood Mend 12 still restores 12", () => {
    const action = vampiricAction();
    const live = wxBossExsanguinatedCommitWithoutHealRecv({ action });
    assert.equal(live.effects[0]?.stat, EXSANGUINATED_STAT_LIVE);
    assert.equal(live.healRecv, 1);
    assert.equal(
      getStatModifier("player", EXSANGUINATED_STAT_LIVE, live.effects),
      EXSANGUINATED_MODIFIER,
      "the row is live — it just is not the key Blood Mend reads",
    );
    assert.equal(
      playerHealAmountAfterHealRecv(BLOOD_MEND_HEAL, live.healRecv),
      BLOOD_MEND_HEAL,
    );
    assert.equal(
      playerHpAfterBloodMend({
        hp: 90,
        maxHp: LEVEL_1_MAX_HP,
        baseHeal: BLOOD_MEND_HEAL,
        healRecv: live.healRecv,
      }),
      LEVEL_1_MAX_HP,
    );
    assert.equal(wxBossExsanguinatedDroppedHealRecv({ action }), true);
  });

  it("the Exsanguinated log fires while advertised 50% shred is a no-op", () => {
    const action = standaloneAction();
    assert.equal(
      action.abilityResult?.logMessages?.includes(EXSANGUINATED_LOG),
      true,
    );
    const live = wxBossExsanguinatedCommitWithoutHealRecv({ action });
    assert.equal(live.healRecv, 1);
    assert.equal(
      playerHpAfterBloodMend({
        hp: 88,
        maxHp: LEVEL_1_MAX_HP,
        baseHeal: BLOOD_MEND_HEAL,
        healRecv: live.healRecv,
      }),
      100,
    );
  });
});

describe("resolveBossExsanguinatedHealRecvCommit", () => {
  it("remaps healing → healRecv so Blood Mend 12 becomes 6 at 90 HP", () => {
    const action = vampiricAction();
    const next = resolveBossExsanguinatedHealRecvCommit({ action });
    assert.ok(bossExsanguinatedHealRecvFromAction(action));
    assert.equal(next.effects[0]?.stat, EXSANGUINATED_STAT_HEAL_PATH);
    assert.equal(next.effects[0]?.modifier, EXSANGUINATED_MODIFIER);
    assert.equal(next.effects[0]?.duration, EXSANGUINATED_DURATION);
    assert.equal(next.healRecv, EXSANGUINATED_MODIFIER);
    assert.equal(
      playerHealAmountAfterHealRecv(BLOOD_MEND_HEAL, next.healRecv),
      6,
    );
    assert.equal(
      playerHpAfterBloodMend({
        hp: 90,
        maxHp: LEVEL_1_MAX_HP,
        baseHeal: BLOOD_MEND_HEAL,
        healRecv: next.healRecv,
      }),
      96,
    );
  });

  it("standalone EXSANGUINATED_DEBUFF is the same remap (no VAMPIRIC drain)", () => {
    const next = resolveBossExsanguinatedHealRecvCommit({
      action: standaloneAction(),
    });
    assert.equal(next.healRecv, EXSANGUINATED_MODIFIER);
    assert.equal(
      playerHpAfterBloodMend({
        hp: 88,
        maxHp: LEVEL_1_MAX_HP,
        baseHeal: BLOOD_MEND_HEAL,
        healRecv: next.healRecv,
      }),
      94,
    );
  });

  it("does not apply VAMPIRIC drain of 10 or minion HP (unique leftover of #975/#984)", () => {
    const action = vampiricAction();
    const next = resolveBossExsanguinatedHealRecvCommit({ action });
    assert.equal(action.abilityResult?.damageToPlayer, VAMPIRIC_DRAIN);
    assert.equal(action.abilityResult?.damageToTargets?.["minion-a"], 10);
    assert.equal(next.effects.length, 1);
    assert.equal(next.effects[0]?.stat, EXSANGUINATED_STAT_HEAL_PATH);
  });

  it("full-HP Blood Mend still restores 0 after the shred", () => {
    const next = resolveBossExsanguinatedHealRecvCommit({
      action: standaloneAction(),
    });
    assert.equal(
      playerHpAfterBloodMend({
        hp: LEVEL_1_MAX_HP,
        maxHp: LEVEL_1_MAX_HP,
        baseHeal: BLOOD_MEND_HEAL,
        healRecv: next.healRecv,
      }),
      LEVEL_1_MAX_HP,
    );
  });

  it("crit doubles after healRecv (12→6→12), not before (live 24)", () => {
    const live = wxBossExsanguinatedCommitWithoutHealRecv({
      action: standaloneAction(),
    });
    const next = resolveBossExsanguinatedHealRecvCommit({
      action: standaloneAction(),
    });
    assert.equal(
      playerHpAfterBloodMend({
        hp: 70,
        maxHp: LEVEL_1_MAX_HP,
        baseHeal: BLOOD_MEND_HEAL,
        healRecv: live.healRecv,
        crit: true,
      }),
      94,
    );
    assert.equal(
      playerHpAfterBloodMend({
        hp: 70,
        maxHp: LEVEL_1_MAX_HP,
        baseHeal: BLOOD_MEND_HEAL,
        healRecv: next.healRecv,
        crit: true,
      }),
      82,
    );
  });

  it("Cursed Wound healRecv is already the heal-path key (#915) — no drop", () => {
    const wound = mustSpell("spell-cursed-wound");
    assert.equal(wound.debuffStat, EXSANGUINATED_STAT_HEAL_PATH);
    const action: BossExsanguinatedActionLike = {
      type: "spell",
      abilityResult: {
        debuffsApplied: [
          {
            stat: "healRecv",
            modifier: 0.5,
            duration: 2,
            effectName: "Cursed Wound",
          },
        ],
      },
    };
    assert.equal(
      isBossExsanguinatedHealingStatRow({ stat: "healRecv" }),
      false,
    );
    assert.equal(bossExsanguinatedHealRecvFromAction(action), null);
    assert.equal(wxBossExsanguinatedDroppedHealRecv({ action }), false);
    const next = resolveBossExsanguinatedHealRecvCommit({ action });
    assert.equal(next.effects[0]?.stat, "healRecv");
    assert.equal(next.healRecv, 0.5);
  });

  it("CURSE_ON_HIT stat all is not remapped to healRecv", () => {
    const action: BossExsanguinatedActionLike = {
      type: "ability",
      ability: "CURSE_ON_HIT",
      abilityResult: {
        debuffsApplied: [
          {
            stat: "all",
            modifier: 0.5,
            duration: 2,
            effectName: "Archbishop's Curse",
          },
        ],
      },
    };
    assert.equal(bossExsanguinatedHealRecvFromAction(action), null);
    const next = resolveBossExsanguinatedHealRecvCommit({ action });
    assert.equal(next.effects[0]?.stat, "all");
    assert.equal(next.healRecv, 1);
    assert.equal(wxBossExsanguinatedDroppedHealRecv({ action }), false);
  });

  it("Pages of Doom spell_physical is not remapped to healRecv", () => {
    const action: BossExsanguinatedActionLike = {
      type: "ability",
      ability: "PAGES_OF_DOOM",
      abilityResult: {
        debuffsApplied: [
          {
            stat: "spell_physical",
            modifier: 0.8,
            duration: 3,
            effectName: "Pages of Doom: physical",
          },
        ],
      },
    };
    const next = resolveBossExsanguinatedHealRecvCommit({ action });
    assert.equal(next.effects[0]?.stat, "spell_physical");
    assert.equal(next.healRecv, 1);
  });

  it("catalog res_sp is not remapped (#658 leftover)", () => {
    const veil = mustSpell("spell-shadow-veil");
    assert.equal(veil.debuffStat, "res_sp");
    const action: BossExsanguinatedActionLike = {
      type: "ability",
      ability: EXSANGUINATED_ABILITY,
      abilityResult: {
        debuffsApplied: [
          {
            stat: "res_sp",
            modifier: 0.85,
            duration: 2,
            effectName: "Shadow Veil",
          },
        ],
      },
    };
    assert.equal(bossExsanguinatedHealRecvFromAction(action), null);
    const next = resolveBossExsanguinatedHealRecvCommit({ action });
    assert.equal(next.effects[0]?.stat, "res_sp");
    assert.equal(next.healRecv, 1);
  });

  it("Dawn damageToPlayer: -10 is not this shred (#948)", () => {
    const action: BossExsanguinatedActionLike = {
      type: "ability",
      ability: EXSANGUINATED_ABILITY,
      abilityResult: {
        damageToPlayer: DAWN_NEGATIVE_DAMAGE_TO_PLAYER,
        debuffsApplied: [exsanguinatedRow()],
      },
    };
    assert.equal(bossExsanguinatedHealRecvFromAction(action), null);
  });

  it("LIFE_DRAIN 15 / +atk is not this shred (#968)", () => {
    const action: BossExsanguinatedActionLike = {
      type: "ability",
      ability: "LIFE_DRAIN",
      abilityResult: {
        damageToPlayer: LIFE_DRAIN_HEAL,
        logMessages: ["The Starved Vampire Pawn grows stronger!"],
      },
    };
    assert.equal(bossExsanguinatedHealRecvFromAction(action), null);
    const next = resolveBossExsanguinatedHealRecvCommit({ action });
    assert.equal(next.effects.length, 0);
    assert.equal(next.healRecv, 1);
  });

  it("potion 30 HP is not shredded — live potions skip healRecv", () => {
    const next = resolveBossExsanguinatedHealRecvCommit({
      action: standaloneAction(),
    });
    assert.equal(POTION_HEAL_30, 30);
    assert.equal(hpAfterHeal(60, LEVEL_1_MAX_HP, POTION_HEAL_30), 90);
    assert.equal(
      playerHealAmountAfterHealRecv(POTION_HEAL_30, next.healRecv),
      15,
      "if potions later consume healRecv they would halve; live WX does not",
    );
  });

  it("type attack / spell / move do not enter the Exsanguinated arm", () => {
    for (const type of ["attack", "spell", "move"] as const) {
      const action: BossExsanguinatedActionLike = {
        type,
        ability: EXSANGUINATED_ABILITY,
        abilityResult: { debuffsApplied: [exsanguinatedRow()] },
      };
      assert.equal(bossExsanguinatedHealRecvFromAction(action), null, type);
    }
  });

  it("Blood Mend still fails easy_1 either way — uniqueness is the 6 HP, not healUsed", () => {
    assert.equal(easy1?.rewards.doka, 50);
    assert.equal(
      isChallengeCompleted(easy1!, challengeProgress({ healUsed: true })),
      false,
    );
    const liveHp = playerHpAfterBloodMend({
      hp: 90,
      maxHp: LEVEL_1_MAX_HP,
      baseHeal: BLOOD_MEND_HEAL,
      healRecv: 1,
    });
    const fixedHp = playerHpAfterBloodMend({
      hp: 90,
      maxHp: LEVEL_1_MAX_HP,
      baseHeal: BLOOD_MEND_HEAL,
      healRecv: EXSANGUINATED_MODIFIER,
    });
    assert.equal(liveHp, 100);
    assert.equal(fixedHp, 96);
  });

  it("catalog Blood Mend is the 12 HP self heal that reads healRecv", () => {
    assert.equal(bloodMend.spellType, "heal");
    assert.equal(bloodMend.effectType, "heal");
    assert.equal(bloodMend.targetType, "self");
    assert.equal(BLOOD_MEND_HEAL, 12);
    assert.equal(Number(bloodMend.damage), 0);
    assert.equal(EXSANGUINATED_ABILITY, "EXSANGUINATED_DEBUFF");
    assert.equal(VAMPIRIC_AOE_ABILITY, "VAMPIRIC_AOE");
  });

  it("empty / non-finite Exsanguinated rows are not a shred", () => {
    const empty: BossExsanguinatedActionLike = {
      type: "ability",
      ability: EXSANGUINATED_ABILITY,
      abilityResult: { debuffsApplied: [] },
    };
    assert.equal(bossExsanguinatedHealRecvFromAction(empty), null);
    const nanRow: BossExsanguinatedActionLike = {
      type: "ability",
      ability: EXSANGUINATED_ABILITY,
      abilityResult: {
        debuffsApplied: [
          {
            stat: EXSANGUINATED_STAT_LIVE,
            modifier: Number.NaN,
            duration: 2,
            effectName: EXSANGUINATED_EFFECT_NAME,
          },
        ],
      },
    };
    assert.equal(bossExsanguinatedHealRecvFromAction(nanRow), null);
  });
});

describe("production still writes healing and copies d.stat", () => {
  it("useBossSystem Exsanguinated / VAMPIRIC rows still use stat healing", () => {
    const src = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../hooks/useBossSystem.ts",
      ),
      "utf8",
    );
    const vamp = src.slice(
      src.indexOf("function applyVampiricAoe"),
      src.indexOf("function applyExsanguinatedDebuff"),
    );
    const standalone = src.slice(
      src.indexOf("function applyExsanguinatedDebuff"),
      src.indexOf("function applyInkVeil"),
    );
    assert.equal(vamp.includes('stat: "healing"'), true);
    assert.equal(standalone.includes('stat: "healing"'), true);
    assert.equal(vamp.includes(EXSANGUINATED_EFFECT_NAME), true);
    assert.equal(standalone.includes(EXSANGUINATED_LOG), true);
  });

  it("WorldExploration still copies d.stat as-is onto applyActiveEffect", () => {
    const wx = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/WorldExploration.tsx",
      ),
      "utf8",
    );
    const start = wx.indexOf("if (res?.debuffsApplied)");
    assert.ok(start >= 0, "live debuffsApplied copy is present");
    const body = wx.slice(start, start + 700);
    assert.ok(body.includes("stat: d.stat"));
    assert.equal(
      body.includes("healRecv"),
      false,
      "live copy does not remap healing → healRecv",
    );
  });

  it("resolvePlayerCast still multiplies Blood Mend by healRecv, not healing", () => {
    const engine = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "./spellEngine.ts"),
      "utf8",
    );
    const healArm = engine.slice(
      engine.indexOf("if (isHealSpell && isPlayerTile)"),
      engine.indexOf("// ── Shield / self-buff spells"),
    );
    assert.ok(healArm.includes('getEffectiveStat("player", "healRecv")'));
    assert.equal(healArm.includes('"healing"'), false);
  });
});
