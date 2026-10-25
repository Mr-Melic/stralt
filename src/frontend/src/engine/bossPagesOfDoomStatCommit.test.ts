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
  type BossPagesOfDoomActionLike,
  PAGES_OF_DOOM_ABILITY,
  PAGES_OF_DOOM_DEFAULT_SCHOOL,
  PAGES_OF_DOOM_DURATION,
  PAGES_OF_DOOM_EFFECT_NAME_PREFIX,
  PAGES_OF_DOOM_LOG_NEEDLE,
  PAGES_OF_DOOM_MODIFIER,
  PAGES_OF_DOOM_STAT_LIVE,
  bossPagesOfDoomRowsFromAction,
  effectStatMatchesPagesOfDoom,
  isBossPagesOfDoomSpellStatRow,
  pagesOfDoomOutgoingSchool,
  pagesOfDoomStatForSchool,
  playerHealAmountAfterHealRecv,
  playerHpAfterBloodMend,
  playerOutgoingAfterDmgMod,
  resolveBossPagesOfDoomStatCommit,
  wxBossPagesOfDoomCommitWithoutSchoolDmg,
  wxBossPagesOfDoomDroppedPhysicalDmg,
} from "./bossPagesOfDoomStatCommit.ts";
import {
  formatBattleEffectMagnitude,
  getStatModifier,
} from "./statusEffects.ts";

const LEVEL_1_MAX_HP = 100;
const easy1 = DEFAULT_CHALLENGES.find((c) => c.id === "easy_1");

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

const strike = mustSpell("physical_attack");
const frostBolt = mustSpell("starter-frost");
const bloodMend = mustSpell("starter-heal");
const cursedWound = mustSpell("spell-cursed-wound");
const STRIKE_DAMAGE = Number(strike.damage);
const FROST_DAMAGE = Number(frostBolt.damage);
const BLOOD_MEND_HEAL = Number(bloodMend.healAmount);

function pagesRow(school = PAGES_OF_DOOM_DEFAULT_SCHOOL) {
  return {
    stat: pagesOfDoomStatForSchool(school),
    modifier: PAGES_OF_DOOM_MODIFIER,
    duration: PAGES_OF_DOOM_DURATION,
    effectName: `${PAGES_OF_DOOM_EFFECT_NAME_PREFIX} ${school}`,
    iconEmoji: "📜",
  };
}

function pagesAction(
  school = PAGES_OF_DOOM_DEFAULT_SCHOOL,
): BossPagesOfDoomActionLike {
  return {
    type: "ability",
    ability: PAGES_OF_DOOM_ABILITY,
    abilityResult: {
      debuffsApplied: [pagesRow(school)],
      logMessages: [
        `The Pale Archivist ${PAGES_OF_DOOM_LOG_NEEDLE} (${school})! -20% damage for 3 turns!`,
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

describe("wxBossPagesOfDoomCommitWithoutSchoolDmg (live leftover)", () => {
  it("copies spell_physical so Strike 10 and Frost Bolt 20 stay full", () => {
    const action = pagesAction();
    const live = wxBossPagesOfDoomCommitWithoutSchoolDmg({ action });
    assert.equal(live.effects[0]?.stat, PAGES_OF_DOOM_STAT_LIVE);
    assert.equal(live.school, PAGES_OF_DOOM_DEFAULT_SCHOOL);
    assert.equal(live.dmgPhysical, 1);
    assert.equal(live.dmgUnschooled, 1);
    assert.equal(live.dmgForRowSchool, 1);
    assert.equal(live.res, 1);
    assert.equal(live.healRecv, 1);
    assert.equal(
      getStatModifier("player", PAGES_OF_DOOM_STAT_LIVE, live.effects),
      PAGES_OF_DOOM_MODIFIER,
      "the row is live — it just is not a key combat reads",
    );
    assert.equal(
      playerOutgoingAfterDmgMod(STRIKE_DAMAGE, live.dmgPhysical),
      10,
    );
    assert.equal(
      playerOutgoingAfterDmgMod(FROST_DAMAGE, live.dmgUnschooled),
      20,
    );
    assert.equal(wxBossPagesOfDoomDroppedPhysicalDmg({ action }), true);
  });

  it("the -20% school log fires while advertised Strike shred is a no-op", () => {
    const action = pagesAction();
    assert.equal(
      action.abilityResult?.logMessages?.some((line) =>
        line.includes(PAGES_OF_DOOM_LOG_NEEDLE),
      ),
      true,
    );
    assert.equal(
      formatBattleEffectMagnitude(
        PAGES_OF_DOOM_STAT_LIVE,
        PAGES_OF_DOOM_MODIFIER,
      ),
      "-20%",
    );
    const live = wxBossPagesOfDoomCommitWithoutSchoolDmg({ action });
    assert.equal(
      playerOutgoingAfterDmgMod(STRIKE_DAMAGE, live.dmgPhysical),
      10,
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
  });

  it("ability result has no damageToPlayer — Pages is a school tax, not a hit", () => {
    const action = pagesAction();
    assert.equal(action.abilityResult?.damageToPlayer, undefined);
    assert.equal(wxBossPagesOfDoomDroppedPhysicalDmg({ action }), true);
  });
});

describe("resolveBossPagesOfDoomStatCommit", () => {
  it("honours spell_physical so Strike 10 becomes 8 and Frost Bolt stays 20", () => {
    const action = pagesAction();
    const next = resolveBossPagesOfDoomStatCommit({ action });
    assert.ok(bossPagesOfDoomRowsFromAction(action));
    assert.equal(next.effects[0]?.stat, PAGES_OF_DOOM_STAT_LIVE);
    assert.equal(next.effects[0]?.modifier, PAGES_OF_DOOM_MODIFIER);
    assert.equal(next.effects[0]?.duration, PAGES_OF_DOOM_DURATION);
    assert.equal(next.dmgPhysical, PAGES_OF_DOOM_MODIFIER);
    assert.equal(next.dmgUnschooled, 1);
    assert.equal(next.dmgForRowSchool, PAGES_OF_DOOM_MODIFIER);
    assert.equal(next.res, 1);
    assert.equal(next.healRecv, 1);
    assert.equal(playerOutgoingAfterDmgMod(STRIKE_DAMAGE, next.dmgPhysical), 8);
    assert.equal(
      playerOutgoingAfterDmgMod(FROST_DAMAGE, next.dmgUnschooled),
      20,
    );
    assert.equal(
      playerOutgoingAfterDmgMod(STRIKE_DAMAGE, next.dmgUnschooled),
      10,
      "rewriting stored stat to dmg would shred unschooled casts",
    );
  });

  it("Blood Mend 12 stays 12 — school tax is not healRecv (#1035 leftover)", () => {
    const next = resolveBossPagesOfDoomStatCommit({ action: pagesAction() });
    assert.equal(
      playerHealAmountAfterHealRecv(BLOOD_MEND_HEAL, next.healRecv),
      12,
    );
    assert.equal(
      playerHpAfterBloodMend({
        hp: 90,
        maxHp: LEVEL_1_MAX_HP,
        baseHeal: BLOOD_MEND_HEAL,
        healRecv: next.healRecv,
      }),
      LEVEL_1_MAX_HP,
    );
  });

  it("spell_fire does not shred Strike (school-specific, not CURSE all)", () => {
    const action = pagesAction("fire");
    const live = wxBossPagesOfDoomCommitWithoutSchoolDmg({ action });
    const next = resolveBossPagesOfDoomStatCommit({ action });
    assert.equal(next.effects[0]?.stat, "spell_fire");
    assert.equal(live.dmgPhysical, 1);
    assert.equal(next.dmgPhysical, 1);
    assert.equal(next.dmgUnschooled, 1);
    assert.equal(next.dmgForRowSchool, PAGES_OF_DOOM_MODIFIER);
    assert.equal(
      playerOutgoingAfterDmgMod(STRIKE_DAMAGE, next.dmgPhysical),
      10,
    );
    assert.equal(wxBossPagesOfDoomDroppedPhysicalDmg({ action }), false);
  });

  it("AP / MP stay additive 0 — 0.8 must not add a fraction", () => {
    const live = wxBossPagesOfDoomCommitWithoutSchoolDmg({
      action: pagesAction(),
    });
    const next = resolveBossPagesOfDoomStatCommit({ action: pagesAction() });
    assert.equal(live.ap, 0);
    assert.equal(live.mp, 0);
    assert.equal(next.ap, 0);
    assert.equal(next.mp, 0);
    assert.equal(
      effectStatMatchesPagesOfDoom("spell_physical", "ap", "physical"),
      false,
    );
    assert.equal(
      effectStatMatchesPagesOfDoom("spell_physical", "res", "physical"),
      false,
    );
    assert.equal(
      effectStatMatchesPagesOfDoom("spell_physical", "healRecv", "physical"),
      false,
    );
    assert.equal(
      effectStatMatchesPagesOfDoom("spell_physical", "dmg", "physical"),
      true,
    );
    assert.equal(
      effectStatMatchesPagesOfDoom("spell_physical", "dmg", ""),
      false,
    );
  });

  it("CURSE_ON_HIT stat all is not remapped (#1040 leftover)", () => {
    const action: BossPagesOfDoomActionLike = {
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
    assert.equal(isBossPagesOfDoomSpellStatRow({ stat: "all" }), false);
    assert.equal(bossPagesOfDoomRowsFromAction(action), null);
    const next = resolveBossPagesOfDoomStatCommit({ action });
    assert.equal(next.effects[0]?.stat, "all");
    assert.equal(next.dmgPhysical, 1);
    assert.equal(next.healRecv, 1);
    assert.equal(wxBossPagesOfDoomDroppedPhysicalDmg({ action }), false);
  });

  it("Exsanguinated healing is not remapped (#1035 leftover)", () => {
    const action: BossPagesOfDoomActionLike = {
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
    assert.equal(isBossPagesOfDoomSpellStatRow({ stat: "healing" }), false);
    assert.equal(bossPagesOfDoomRowsFromAction(action), null);
    const next = resolveBossPagesOfDoomStatCommit({ action });
    assert.equal(next.effects[0]?.stat, "healing");
    assert.equal(next.healRecv, 1);
    assert.equal(next.dmgPhysical, 1);
    assert.equal(wxBossPagesOfDoomDroppedPhysicalDmg({ action }), false);
  });

  it("Cursed Wound healRecv is already the heal-path key (#915) — no drop", () => {
    assert.equal(cursedWound.debuffStat, "healRecv");
    const action: BossPagesOfDoomActionLike = {
      type: "spell",
      ability: PAGES_OF_DOOM_ABILITY,
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
    assert.equal(isBossPagesOfDoomSpellStatRow({ stat: "healRecv" }), false);
    assert.equal(bossPagesOfDoomRowsFromAction(action), null);
    assert.equal(wxBossPagesOfDoomDroppedPhysicalDmg({ action }), false);
  });

  it("catalog res_sp is not remapped (#658 leftover)", () => {
    const veil = mustSpell("spell-shadow-veil");
    assert.equal(veil.debuffStat, "res_sp");
    const action: BossPagesOfDoomActionLike = {
      type: "ability",
      ability: PAGES_OF_DOOM_ABILITY,
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
    assert.equal(bossPagesOfDoomRowsFromAction(action), null);
    const next = resolveBossPagesOfDoomStatCommit({ action });
    assert.equal(next.effects[0]?.stat, "res_sp");
    assert.equal(next.dmgPhysical, 1);
  });

  it("type attack / spell / move do not enter the Pages arm", () => {
    for (const type of ["attack", "spell", "move"] as const) {
      const action: BossPagesOfDoomActionLike = {
        type,
        ability: PAGES_OF_DOOM_ABILITY,
        abilityResult: { debuffsApplied: [pagesRow()] },
      };
      assert.equal(bossPagesOfDoomRowsFromAction(action), null, type);
    }
  });

  it("Strike still fails easy_1 only when healUsed — uniqueness is the 8 dmg", () => {
    assert.equal(easy1?.rewards.doka, 50);
    assert.equal(
      isChallengeCompleted(easy1!, challengeProgress({ healUsed: false })),
      true,
    );
    assert.equal(
      isChallengeCompleted(easy1!, challengeProgress({ healUsed: true })),
      false,
    );
    const liveDmg = playerOutgoingAfterDmgMod(
      STRIKE_DAMAGE,
      wxBossPagesOfDoomCommitWithoutSchoolDmg({ action: pagesAction() })
        .dmgPhysical,
    );
    const fixedDmg = playerOutgoingAfterDmgMod(
      STRIKE_DAMAGE,
      resolveBossPagesOfDoomStatCommit({ action: pagesAction() }).dmgPhysical,
    );
    assert.equal(liveDmg, 10);
    assert.equal(fixedDmg, 8);
  });

  it("catalog Strike is the physical 10 that reads dmg, Frost Bolt is not", () => {
    assert.equal(strike.isPhysical, true);
    assert.equal(STRIKE_DAMAGE, 10);
    assert.equal(strike.effectType, "damage");
    assert.equal(frostBolt.isPhysical, undefined);
    assert.equal(FROST_DAMAGE, 20);
    assert.equal(bloodMend.spellType, "heal");
    assert.equal(BLOOD_MEND_HEAL, 12);
    assert.equal(PAGES_OF_DOOM_ABILITY, "PAGES_OF_DOOM");
    assert.equal(PAGES_OF_DOOM_STAT_LIVE, "spell_physical");
    assert.equal(pagesOfDoomOutgoingSchool({ isPhysical: true }), "physical");
    assert.equal(pagesOfDoomOutgoingSchool({ isPhysical: false }), "");
    assert.equal(pagesOfDoomOutgoingSchool({ school: "fire" }), "fire");
  });

  it("empty / non-finite Pages rows are not a shred", () => {
    const empty: BossPagesOfDoomActionLike = {
      type: "ability",
      ability: PAGES_OF_DOOM_ABILITY,
      abilityResult: { debuffsApplied: [] },
    };
    assert.equal(bossPagesOfDoomRowsFromAction(empty), null);
    const nanRow: BossPagesOfDoomActionLike = {
      type: "ability",
      ability: PAGES_OF_DOOM_ABILITY,
      abilityResult: {
        debuffsApplied: [
          {
            stat: PAGES_OF_DOOM_STAT_LIVE,
            modifier: Number.NaN,
            duration: 3,
            effectName: `${PAGES_OF_DOOM_EFFECT_NAME_PREFIX} physical`,
          },
        ],
      },
    };
    assert.equal(bossPagesOfDoomRowsFromAction(nanRow), null);
  });
});

describe("production still writes spell_physical and copies d.stat", () => {
  it("useBossSystem Pages of Doom still uses spell_${mostUsed} default physical", () => {
    const src = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../hooks/useBossSystem.ts",
      ),
      "utf8",
    );
    const body = src.slice(
      src.indexOf("function applyPagesOfDoom"),
      src.indexOf("function applyDawnBuff"),
    );
    assert.equal(body.includes('let mostUsed = "physical"'), true);
    assert.equal(body.includes("stat: `spell_${mostUsed}`"), true);
    assert.equal(body.includes("modifier: 0.8"), true);
    assert.equal(body.includes(PAGES_OF_DOOM_LOG_NEEDLE), true);
    assert.equal(body.includes("spellSchoolUsageCounts"), true);
  });

  it("WorldExploration still copies d.stat and queries dmg, not spell_physical", () => {
    const wx = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/WorldExploration.tsx",
      ),
      "utf8",
    );
    const debuffStart = wx.indexOf("if (res?.debuffsApplied)");
    assert.ok(debuffStart >= 0, "live debuffsApplied copy is present");
    const debuffBody = wx.slice(debuffStart, debuffStart + 700);
    assert.ok(debuffBody.includes("stat: d.stat"));
    assert.equal(
      debuffBody.includes("spell_physical"),
      false,
      "live copy does not remap spell_physical → dmg",
    );
    const dmgStart = wx.indexOf('getStatModifier("player", "dmg", effects)');
    assert.ok(dmgStart >= 0, "live computeDamage still queries dmg");
    const dmgBody = wx.slice(dmgStart, dmgStart + 220);
    assert.equal(dmgBody.includes("spell_physical"), false);
    assert.ok(dmgBody.includes("Math.floor(dmg * dmgMod)"));
  });

  it("Pale Archivist still prefers kit before Pages of Doom (not restored)", () => {
    const ai = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../hooks/useBossAI.ts"),
      "utf8",
    );
    const body = ai.slice(
      ai.indexOf("export const decidePaleArchivistAction"),
      ai.indexOf("export const decideTwinMonarchsAction"),
    );
    const kitAt = body.indexOf("pickBossKitSpell");
    const pagesAt = body.indexOf("BossAbility.PAGES_OF_DOOM");
    assert.ok(kitAt >= 0, "kit pick is present");
    assert.ok(pagesAt >= 0, "Pages of Doom arm is present");
    assert.ok(kitAt < pagesAt, "kit-first shadow is leftover turn logic");
  });
});
