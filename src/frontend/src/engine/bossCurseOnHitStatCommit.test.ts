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
import {
  type BossCurseOnHitActionLike,
  CURSE_ON_HIT_ABILITY,
  CURSE_ON_HIT_DURATION,
  CURSE_ON_HIT_EFFECT_NAME,
  CURSE_ON_HIT_LOG_NEEDLE,
  CURSE_ON_HIT_MODIFIER,
  CURSE_ON_HIT_STAT_LIVE,
  bossCurseOnHitAllRowsFromAction,
  effectStatMatchesBossCurseAll,
  isBossCurseOnHitAllStatRow,
  playerHealAmountAfterHealRecv,
  playerHpAfterBloodMend,
  playerHpAfterIncoming,
  playerIncomingAfterResMod,
  playerOutgoingAfterDmgMod,
  resolveBossCurseOnHitStatCommit,
  wxBossCurseOnHitCommitWithoutAllStats,
  wxBossCurseOnHitDroppedCombatStats,
} from "./bossCurseOnHitStatCommit.ts";
import { getStatModifier } from "./statusEffects.ts";

const LEVEL_1_MAX_HP = 100;
const ARCHBISHOP_ATK = 35;
const PLAYER_RES = 12;
const PLAYER_OUTGOING = 20;

const easy1 = DEFAULT_CHALLENGES.find((c) => c.id === "easy_1");

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

const bloodMend = mustSpell("starter-heal");
const BLOOD_MEND_HEAL = Number(bloodMend.healAmount);

function curseRow() {
  return {
    stat: CURSE_ON_HIT_STAT_LIVE,
    modifier: CURSE_ON_HIT_MODIFIER,
    duration: CURSE_ON_HIT_DURATION,
    effectName: CURSE_ON_HIT_EFFECT_NAME,
    iconEmoji: "📿",
  };
}

function curseAction(): BossCurseOnHitActionLike {
  return {
    type: "ability",
    ability: CURSE_ON_HIT_ABILITY,
    abilityResult: {
      debuffsApplied: [curseRow()],
      logMessages: [
        `The Pale Archbishop's strike carries a curse! ${CURSE_ON_HIT_LOG_NEEDLE} for 2 turns!`,
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

describe("wxBossCurseOnHitCommitWithoutAllStats (live leftover)", () => {
  it("copies stat all so outgoing 20 and Blood Mend 12 stay full", () => {
    const action = curseAction();
    const live = wxBossCurseOnHitCommitWithoutAllStats({ action });
    assert.equal(live.effects[0]?.stat, CURSE_ON_HIT_STAT_LIVE);
    assert.equal(live.dmg, 1);
    assert.equal(live.res, 1);
    assert.equal(live.healRecv, 1);
    assert.equal(
      getStatModifier("player", CURSE_ON_HIT_STAT_LIVE, live.effects),
      CURSE_ON_HIT_MODIFIER,
      "the row is live — it just is not a key combat reads",
    );
    assert.equal(playerOutgoingAfterDmgMod(PLAYER_OUTGOING, live.dmg), 20);
    assert.equal(
      playerHpAfterBloodMend({
        hp: 90,
        maxHp: LEVEL_1_MAX_HP,
        baseHeal: BLOOD_MEND_HEAL,
        healRecv: live.healRecv,
      }),
      LEVEL_1_MAX_HP,
    );
    assert.equal(wxBossCurseOnHitDroppedCombatStats({ action }), true);
  });

  it("the halved-stats log fires while advertised shred is a no-op", () => {
    const action = curseAction();
    assert.equal(
      action.abilityResult?.logMessages?.some((line) =>
        line.includes(CURSE_ON_HIT_LOG_NEEDLE),
      ),
      true,
    );
    const live = wxBossCurseOnHitCommitWithoutAllStats({ action });
    assert.equal(
      playerIncomingAfterResMod(ARCHBISHOP_ATK, PLAYER_RES, live.res),
      playerIncomingAfterResMod(ARCHBISHOP_ATK, PLAYER_RES, 1),
    );
    assert.equal(
      playerHpAfterIncoming({
        hp: 100,
        incomingDamage: ARCHBISHOP_ATK,
        baseRes: PLAYER_RES,
        resMod: live.res,
      }),
      69,
    );
  });

  it("ability result has no damageToPlayer — curse replaces the melee", () => {
    const action = curseAction();
    assert.equal(action.abilityResult?.damageToPlayer, undefined);
    assert.equal(wxBossCurseOnHitDroppedCombatStats({ action }), true);
  });
});

describe("resolveBossCurseOnHitStatCommit", () => {
  it("honours all so outgoing 20 becomes 10 and RES 12 acts as 6", () => {
    const action = curseAction();
    const next = resolveBossCurseOnHitStatCommit({ action });
    assert.ok(bossCurseOnHitAllRowsFromAction(action));
    assert.equal(next.effects[0]?.stat, CURSE_ON_HIT_STAT_LIVE);
    assert.equal(next.effects[0]?.modifier, CURSE_ON_HIT_MODIFIER);
    assert.equal(next.effects[0]?.duration, CURSE_ON_HIT_DURATION);
    assert.equal(next.dmg, CURSE_ON_HIT_MODIFIER);
    assert.equal(next.res, CURSE_ON_HIT_MODIFIER);
    assert.equal(next.healRecv, CURSE_ON_HIT_MODIFIER);
    assert.equal(playerOutgoingAfterDmgMod(PLAYER_OUTGOING, next.dmg), 10);
    assert.equal(playerIncomingAfterResMod(ARCHBISHOP_ATK, PLAYER_RES, 1), 31);
    assert.equal(
      playerIncomingAfterResMod(ARCHBISHOP_ATK, PLAYER_RES, next.res),
      33,
    );
    assert.equal(
      playerHpAfterIncoming({
        hp: 100,
        incomingDamage: ARCHBISHOP_ATK,
        baseRes: PLAYER_RES,
        resMod: next.res,
      }),
      67,
    );
  });

  it("Blood Mend 12 becomes 6 at 90 HP after the shred", () => {
    const next = resolveBossCurseOnHitStatCommit({ action: curseAction() });
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

  it("does not mint the skipped melee (unique leftover of turn logic)", () => {
    const action = curseAction();
    const next = resolveBossCurseOnHitStatCommit({ action });
    assert.equal(action.abilityResult?.damageToPlayer, undefined);
    assert.equal(next.effects.length, 1);
    assert.equal(next.effects[0]?.stat, CURSE_ON_HIT_STAT_LIVE);
  });

  it("AP / MP stay additive 0 — 0.5 must not add half a point", () => {
    const live = wxBossCurseOnHitCommitWithoutAllStats({
      action: curseAction(),
    });
    const next = resolveBossCurseOnHitStatCommit({ action: curseAction() });
    assert.equal(live.ap, 0);
    assert.equal(live.mp, 0);
    assert.equal(next.ap, 0);
    assert.equal(next.mp, 0);
    assert.equal(effectStatMatchesBossCurseAll("all", "ap"), false);
    assert.equal(effectStatMatchesBossCurseAll("all", "mp"), false);
    assert.equal(effectStatMatchesBossCurseAll("all", "dmg"), true);
    assert.equal(effectStatMatchesBossCurseAll("all", "res"), true);
  });

  it("Exsanguinated healing is not remapped (#1035 leftover)", () => {
    const action: BossCurseOnHitActionLike = {
      type: "ability",
      ability: "EXSANGUINATED_DEBUFF",
      abilityResult: {
        debuffsApplied: [
          {
            stat: "healing",
            modifier: 0.5,
            duration: 2,
            effectName: "Exsanguinated",
          },
        ],
      },
    };
    assert.equal(isBossCurseOnHitAllStatRow({ stat: "healing" }), false);
    assert.equal(bossCurseOnHitAllRowsFromAction(action), null);
    const next = resolveBossCurseOnHitStatCommit({ action });
    assert.equal(next.effects[0]?.stat, "healing");
    assert.equal(next.healRecv, 1);
    assert.equal(wxBossCurseOnHitDroppedCombatStats({ action }), false);
  });

  it("Pages of Doom spell_physical is not remapped to dmg", () => {
    const action: BossCurseOnHitActionLike = {
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
    const live = wxBossCurseOnHitCommitWithoutAllStats({ action });
    const next = resolveBossCurseOnHitStatCommit({ action });
    assert.equal(next.effects[0]?.stat, "spell_physical");
    assert.equal(live.dmg, 1);
    assert.equal(next.dmg, 1);
    assert.equal(wxBossCurseOnHitDroppedCombatStats({ action }), false);
  });

  it("catalog res_sp is not remapped (#658 leftover)", () => {
    const veil = mustSpell("spell-shadow-veil");
    assert.equal(veil.debuffStat, "res_sp");
    const action: BossCurseOnHitActionLike = {
      type: "ability",
      ability: CURSE_ON_HIT_ABILITY,
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
    assert.equal(bossCurseOnHitAllRowsFromAction(action), null);
    const next = resolveBossCurseOnHitStatCommit({ action });
    assert.equal(next.effects[0]?.stat, "res_sp");
    assert.equal(next.res, 1);
    assert.equal(next.sp, 1);
  });

  it("Cursed Wound healRecv is already the heal-path key (#915)", () => {
    const wound = mustSpell("spell-cursed-wound");
    assert.equal(wound.debuffStat, "healRecv");
    const action: BossCurseOnHitActionLike = {
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
    assert.equal(bossCurseOnHitAllRowsFromAction(action), null);
    assert.equal(wxBossCurseOnHitDroppedCombatStats({ action }), false);
  });

  it("type attack / spell / move do not enter the curse arm", () => {
    for (const type of ["attack", "spell", "move"] as const) {
      const action: BossCurseOnHitActionLike = {
        type,
        ability: CURSE_ON_HIT_ABILITY,
        abilityResult: { debuffsApplied: [curseRow()] },
      };
      assert.equal(bossCurseOnHitAllRowsFromAction(action), null, type);
    }
  });

  it("Weeping Pawn and Final Pawn share applyCurseOnHit", () => {
    const weeping: BossCurseOnHitActionLike = {
      type: "ability",
      ability: CURSE_ON_HIT_ABILITY,
      abilityResult: {
        debuffsApplied: [curseRow()],
        logMessages: [
          `The Weeping Pawn's strike carries a curse! ${CURSE_ON_HIT_LOG_NEEDLE} for 2 turns!`,
        ],
      },
    };
    assert.equal(wxBossCurseOnHitDroppedCombatStats({ action: weeping }), true);
    const next = resolveBossCurseOnHitStatCommit({ action: weeping });
    assert.equal(next.dmg, CURSE_ON_HIT_MODIFIER);
  });

  it("Blood Mend still fails easy_1 either way — uniqueness is the shred", () => {
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
      healRecv: CURSE_ON_HIT_MODIFIER,
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
    assert.equal(CURSE_ON_HIT_ABILITY, "CURSE_ON_HIT");
  });

  it("empty / non-finite curse rows are not a shred", () => {
    const empty: BossCurseOnHitActionLike = {
      type: "ability",
      ability: CURSE_ON_HIT_ABILITY,
      abilityResult: { debuffsApplied: [] },
    };
    assert.equal(bossCurseOnHitAllRowsFromAction(empty), null);
    const nanRow: BossCurseOnHitActionLike = {
      type: "ability",
      ability: CURSE_ON_HIT_ABILITY,
      abilityResult: {
        debuffsApplied: [
          {
            stat: CURSE_ON_HIT_STAT_LIVE,
            modifier: Number.NaN,
            duration: 2,
            effectName: CURSE_ON_HIT_EFFECT_NAME,
          },
        ],
      },
    };
    assert.equal(bossCurseOnHitAllRowsFromAction(nanRow), null);
  });
});

describe("production still writes all and copies d.stat", () => {
  it("useBossSystem applyCurseOnHit still uses stat all", () => {
    const src = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../hooks/useBossSystem.ts",
      ),
      "utf8",
    );
    const curse = src.slice(
      src.indexOf("function applyCurseOnHit"),
      src.indexOf("function applyPromoteQueen"),
    );
    assert.equal(curse.includes('stat: "all"'), true);
    assert.equal(curse.includes(CURSE_ON_HIT_EFFECT_NAME), true);
    assert.equal(curse.includes(CURSE_ON_HIT_LOG_NEEDLE), true);
    assert.equal(curse.includes("damageToPlayer"), false);
  });

  it("useBossAI Pale Archbishop / Weeping Pawn return ability instead of melee", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../hooks/useBossAI.ts"),
      "utf8",
    );
    const arch = src.slice(
      src.indexOf("// Adjacent: attack with curse chance"),
      src.indexOf("return moveToward(boss, player, allTiles, allEnemies);"),
    );
    assert.ok(arch.includes("BossAbility.CURSE_ON_HIT"));
    assert.ok(arch.includes('type: "ability"'));
    assert.ok(arch.includes("return attackPlayer(boss, player)"));
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
      body.includes("HonoringBossCurseAll"),
      false,
      "live copy does not honour stat all",
    );
  });

  it("getStatModifier still requires an exact stat match", () => {
    const engine = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "./statusEffects.ts"),
      "utf8",
    );
    const fn = engine.slice(
      engine.indexOf("export function getStatModifier"),
      engine.indexOf("export function applyOrRefreshNonDotEffect"),
    );
    assert.ok(fn.includes("eff.stat !== stat"));
    assert.equal(fn.includes('"all"'), false);
  });

  it("computeDamage still queries player dmg; playerTakesDamage still queries res", () => {
    const wx = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/WorldExploration.tsx",
      ),
      "utf8",
    );
    assert.ok(wx.includes('getStatModifier("player", "dmg", effects)'));
    assert.ok(
      wx.includes('getStatModifier("player", "res", activeEffectsRef.current)'),
    );
  });

  it("pale_archbishop and weeping_pawn still advertise CURSE_ON_HIT", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../types/bossDefaults.ts"),
      "utf8",
    );
    assert.ok(src.includes("BossAbility.CURSE_ON_HIT"));
    const arch = src.slice(
      src.indexOf('id: "pale_archbishop"'),
      src.indexOf("phase2:"),
    );
    assert.ok(arch.includes("CURSE_ON_HIT"));
  });
});
