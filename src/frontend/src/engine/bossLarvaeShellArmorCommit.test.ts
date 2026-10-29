/**
 * Combat action parity: Broodmother first-spawn Shell Armor flag is
 * stamped from pre-spawn larvae.length (false) so Strike stays 10.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { startingChampionStats } from "../utils/startingChampionStats.ts";
import { shouldAwardVictory } from "./battleSetup.ts";
import {
  BROODMOTHER_IRON_SKIN_LEFTOVER_ID,
  BROODMOTHER_SHELL_COMMIT_ID,
  BROODMOTHER_SHELL_HP,
  BROODMOTHER_SHELL_KIT_FIRST_ID,
  BROODMOTHER_SHELL_STRIKE_DAMAGE,
  BROODMOTHER_SHELL_STRIKE_HALVED,
  FIRST_SPAWN_LARVA_COUNT,
  FIRST_SPAWN_LARVA_HP,
  LARVAE_EXPLODE_COMMIT_ABILITY,
  LARVAE_SPAWN_COMMIT_ABILITY,
  SHELL_ARMOR_CAST_LOG_NEEDLE,
  SHELL_ARMOR_COMMIT_ABILITY,
  SHELL_ARMOR_GUIDE_NEEDLE,
  SHELL_ARMOR_LOG_NEEDLE,
  SHELL_ARMOR_REGISTER_NEEDLE,
  advertisedFirstSpawnShellArmorActive,
  applyLarvaeSpawnWritesShellArmorFlag,
  broodmotherFirstSpawnShellStrike,
  broodmotherShellHighlightedIsExecutable,
  canExecuteBroodmotherShellArmorSoak,
  executeBroodmotherShellArmorSoak,
  liveWxFirstSpawnShellArmorActive,
  resolveBroodmotherFirstSpawnShellArmor,
  shouldDecideBroodmotherShellArmorSoak,
  wxAppliesBroodmotherShellNewBossState,
  wxFirstSpawnNewLarvaeBecomeCombatants,
  wxStampsFirstSpawnShellFromPreSpawnLength,
} from "./bossLarvaeShellArmorCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
const kitArcher = starterSpells.find((s) => s.id === "summon-archer");
const ironSkin = starterSpells.find((s) => s.id === "spell-iron-skin");
const frost = starterSpells.find((s) => s.id === "starter-blast");
assert.ok(strike, "physical_attack");
assert.ok(kitArcher, "summon-archer");
assert.ok(ironSkin, "spell-iron-skin");
assert.ok(frost, "starter-blast");

const PLAYER_HP = Number(startingChampionStats().hp);
const STRIKE_DAMAGE = Number(strike.damage);

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function firstSpawn() {
  return {
    spawnDecided: true,
    spawnWroteLarva: true,
    preSpawnLarvaeCount: 0,
    postSpawnLarvaeCount: FIRST_SPAWN_LARVA_COUNT,
  };
}

function soakReady(overrides: {
  shellArmorActive: boolean;
  larvaeCount: number;
  currentHp?: number;
}) {
  return {
    targetIsBroodmother: true,
    strikeDamage: BROODMOTHER_SHELL_STRIKE_DAMAGE,
    currentHp: overrides.currentHp ?? BROODMOTHER_SHELL_HP,
    larvaeCount: overrides.larvaeCount,
    shellArmorActive: overrides.shellArmorActive,
    isPhysical: true,
  };
}

describe("Broodmother first-spawn Shell Armor flag", () => {
  it("catalog 50% DR stays distinct from kit Iron Skin RES ×1.3 and explode 5×3", () => {
    const defaults = readFileSync(
      join(here(), "../types/bossDefaults.ts"),
      "utf8",
    );
    const brood = defaults.slice(
      defaults.indexOf('id: "broodmother_rook"'),
      defaults.indexOf('id: "lord_of_static"'),
    );
    assert.ok(brood.includes(`id: "${BROODMOTHER_SHELL_COMMIT_ID}"`));
    assert.ok(brood.includes("hp: 480"));
    assert.ok(brood.includes("BossAbility.LARVAE_SPAWN"));
    assert.ok(brood.includes("BossAbility.SHELL_ARMOR"));
    assert.ok(brood.includes("shell armor activates while they live"));
    assert.equal(BROODMOTHER_SHELL_HP, 480);
    assert.equal(FIRST_SPAWN_LARVA_COUNT, 1);
    assert.equal(FIRST_SPAWN_LARVA_HP, 1);
    assert.equal(BROODMOTHER_SHELL_STRIKE_DAMAGE, 10);
    assert.equal(BROODMOTHER_SHELL_STRIKE_HALVED, 5);
    assert.equal(Number(strike.damage), BROODMOTHER_SHELL_STRIKE_DAMAGE);
    assert.equal(strike.isPhysical, true);
    assert.equal(ironSkin.id, BROODMOTHER_IRON_SKIN_LEFTOVER_ID);
    assert.equal(ironSkin.buffStat, "res");
    assert.equal(ironSkin.buffModifier, 1.3);
    assert.notEqual(
      BROODMOTHER_SHELL_STRIKE_HALVED,
      Math.round(BROODMOTHER_SHELL_STRIKE_DAMAGE * 0.7),
      "50% DR is not Iron Skin RES ×1.3 on Strike 10",
    );
  });

  it("live first spawn stamps flag false from pre-spawn length 0", () => {
    const spawn = firstSpawn();
    assert.equal(liveWxFirstSpawnShellArmorActive(spawn), false);
    assert.equal(advertisedFirstSpawnShellArmorActive(spawn), true);
    assert.equal(resolveBroodmotherFirstSpawnShellArmor(spawn), true);
    assert.equal(wxStampsFirstSpawnShellFromPreSpawnLength(), true);
    assert.equal(applyLarvaeSpawnWritesShellArmorFlag(), false);
    assert.equal(wxAppliesBroodmotherShellNewBossState(), true);
    assert.equal(wxFirstSpawnNewLarvaeBecomeCombatants(), false);

    assert.equal(
      broodmotherFirstSpawnShellStrike({
        strikeDamage: STRIKE_DAMAGE,
        larvaeCount: FIRST_SPAWN_LARVA_COUNT,
        shellArmorActive: liveWxFirstSpawnShellArmorActive(spawn),
      }),
      BROODMOTHER_SHELL_STRIKE_DAMAGE,
    );
    assert.equal(
      broodmotherFirstSpawnShellStrike({
        strikeDamage: STRIKE_DAMAGE,
        larvaeCount: FIRST_SPAWN_LARVA_COUNT,
        shellArmorActive: advertisedFirstSpawnShellArmorActive(spawn),
      }),
      BROODMOTHER_SHELL_STRIKE_HALVED,
    );
  });

  it("subsequent spawn already has larvae so live also stamps true — not this leftover", () => {
    const later = {
      spawnDecided: true,
      spawnWroteLarva: true,
      preSpawnLarvaeCount: 1,
      postSpawnLarvaeCount: 2,
    };
    assert.equal(liveWxFirstSpawnShellArmorActive(later), true);
    assert.equal(advertisedFirstSpawnShellArmorActive(later), true);
  });

  it("kit-blocked and empty spawn cannot mint this flag", () => {
    assert.equal(
      liveWxFirstSpawnShellArmorActive({
        ...firstSpawn(),
        spawnDecided: false,
      }),
      false,
    );
    assert.equal(
      advertisedFirstSpawnShellArmorActive({
        ...firstSpawn(),
        spawnDecided: false,
      }),
      false,
      "kit-first Archer leftover of #1288 is decide, not this flag",
    );
    assert.equal(
      resolveBroodmotherFirstSpawnShellArmor({
        ...firstSpawn(),
        spawnDecided: false,
      }),
      null,
    );
    assert.equal(
      advertisedFirstSpawnShellArmorActive({
        spawnDecided: true,
        spawnWroteLarva: false,
        preSpawnLarvaeCount: 0,
        postSpawnLarvaeCount: 0,
      }),
      false,
      "full-board spawn miss must not activate shell",
    );
    assert.equal(
      resolveBroodmotherFirstSpawnShellArmor({
        bossId: "fetid_rook",
        ...firstSpawn(),
      }),
      null,
    );
  });
});

describe("player-visible Strike 10 vs first-spawn shell 5", () => {
  it("executes advertised 5 on 480 HP (475); live 10 leaves 470", () => {
    const spawn = firstSpawn();
    const advertised = soakReady({
      shellArmorActive: advertisedFirstSpawnShellArmorActive(spawn),
      larvaeCount: FIRST_SPAWN_LARVA_COUNT,
    });
    const live = soakReady({
      shellArmorActive: liveWxFirstSpawnShellArmorActive(spawn),
      larvaeCount: FIRST_SPAWN_LARVA_COUNT,
    });
    const decided = shouldDecideBroodmotherShellArmorSoak(advertised);
    const executable = canExecuteBroodmotherShellArmorSoak(advertised);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      broodmotherShellHighlightedIsExecutable({ decided, executable }),
      true,
    );

    const next = executeBroodmotherShellArmorSoak(advertised);
    assert.deepEqual(next, {
      damage: BROODMOTHER_SHELL_STRIKE_HALVED,
      hpAfter: BROODMOTHER_SHELL_HP - BROODMOTHER_SHELL_STRIKE_HALVED,
      rookDied: false,
    });
    const liveHit = executeBroodmotherShellArmorSoak(live);
    assert.deepEqual(liveHit, {
      damage: BROODMOTHER_SHELL_STRIKE_DAMAGE,
      hpAfter: BROODMOTHER_SHELL_HP - BROODMOTHER_SHELL_STRIKE_DAMAGE,
      rookDied: false,
    });
    assert.notEqual(next?.damage, liveHit?.damage);
    assert.equal(PLAYER_HP, 100);
  });

  it("10 HP rook: advertised shell leaves 5; live Strike 10 awards victory", () => {
    const spawn = firstSpawn();
    const advertised = executeBroodmotherShellArmorSoak(
      soakReady({
        shellArmorActive: advertisedFirstSpawnShellArmorActive(spawn),
        larvaeCount: FIRST_SPAWN_LARVA_COUNT,
        currentHp: 10,
      }),
    );
    const live = executeBroodmotherShellArmorSoak(
      soakReady({
        shellArmorActive: liveWxFirstSpawnShellArmorActive(spawn),
        larvaeCount: FIRST_SPAWN_LARVA_COUNT,
        currentHp: 10,
      }),
    );
    assert.deepEqual(advertised, {
      damage: 5,
      hpAfter: 5,
      rookDied: false,
    });
    assert.deepEqual(live, { damage: 10, hpAfter: 0, rookDied: true });
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: advertised?.rookDied ? 0 : 1,
      }),
      false,
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: live?.rookDied ? 0 : 1,
      }),
      true,
      "live leftover kills the 10 HP rook because first-spawn shell never armed",
    );
    assert.equal(
      wxFirstSpawnNewLarvaeBecomeCombatants(),
      false,
      "larva markers still do not occupy — leftover unread newLarvae",
    );
  });

  it("6 HP rook: advertised leaves 1; live Strike 10 kills", () => {
    const spawn = firstSpawn();
    assert.deepEqual(
      executeBroodmotherShellArmorSoak(
        soakReady({
          shellArmorActive: advertisedFirstSpawnShellArmorActive(spawn),
          larvaeCount: FIRST_SPAWN_LARVA_COUNT,
          currentHp: 6,
        }),
      ),
      { damage: 5, hpAfter: 1, rookDied: false },
    );
    assert.deepEqual(
      executeBroodmotherShellArmorSoak(
        soakReady({
          shellArmorActive: liveWxFirstSpawnShellArmorActive(spawn),
          larvaeCount: FIRST_SPAWN_LARVA_COUNT,
          currentHp: 6,
        }),
      ),
      { damage: 10, hpAfter: 0, rookDied: true },
    );
  });

  it("cannot stamp Frost Bolt, non-boss, explode, iron-skin, or sibling leftover payloads", () => {
    const spawn = firstSpawn();
    const ready = soakReady({
      shellArmorActive: advertisedFirstSpawnShellArmorActive(spawn),
      larvaeCount: FIRST_SPAWN_LARVA_COUNT,
    });
    assert.equal(
      executeBroodmotherShellArmorSoak({
        ...ready,
        isPhysical: false,
      }),
      null,
      "starter-blast SR leftover is not this Strike DR",
    );
    assert.equal(Number(frost.damage) > 0, true);
    assert.equal(
      executeBroodmotherShellArmorSoak({
        ...ready,
        targetIsBroodmother: false,
      }),
      null,
      "kit Archer / split-rook incoming soak is not this boss flag",
    );
    assert.equal(
      executeBroodmotherShellArmorSoak({
        ...ready,
        strikeDamage: 0,
      }),
      null,
    );
    assert.equal(
      broodmotherFirstSpawnShellStrike({
        strikeDamage: STRIKE_DAMAGE,
        larvaeCount: 0,
        shellArmorActive: true,
      }),
      STRIKE_DAMAGE,
      "flag without a larva marker must not halve — both gates required",
    );

    const crit = executeBroodmotherShellArmorSoak(ready);
    assert.ok(crit);
    assert.equal("hp" in crit, false, "#1231 owns split HP stamp");
    assert.equal("atk" in crit, false, "#1271 owns split atk 25");
    assert.equal("ap" in crit, false, "split ap 5 leftover stays unrestored");
    assert.equal("res" in crit, false, "#1316 owns split RES 18");
    assert.equal("chc" in crit, false, "#1107 / #1104 own CHC rolls");
    assert.equal("heal" in crit, false, "#1148 owns Vampiric Ground heal");
    assert.equal("roll" in crit, false, "#1208 owns Titan 1–5×");
    assert.equal("glass" in crit, false, "#1160 / #1252 own Glass Realm");
    assert.equal("glyph" in crit, false, "#1216 owns Glyph Trap 15");
    assert.equal("venom" in crit, false, "#1217 owns larva explode DoT");
    assert.equal("dot" in crit, false, "#1217 owns Larva Venom");
    assert.equal("sr" in crit, false, "#1257 / #1262 own player SR soak");
    assert.equal("decide" in crit, false, "#1288 owns kit-first vs spawn");
    assert.equal("iron" in crit, false, "kit Iron Skin RES ×1.3 leftover");
    assert.equal(
      broodmotherShellHighlightedIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
    assert.notEqual(SHELL_ARMOR_COMMIT_ABILITY, LARVAE_EXPLODE_COMMIT_ABILITY);
    assert.notEqual(SHELL_ARMOR_COMMIT_ABILITY, LARVAE_SPAWN_COMMIT_ABILITY);
  });
});

describe("production still stamps pre-spawn length and still requires both gates", () => {
  it("decideBroodmotherRookAction still copies larvae.length before spawn", () => {
    const src = readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
    const start = src.indexOf("// ── 10. Broodmother Rook");
    const end = src.indexOf("// ── 11. Lord of Static");
    assert.ok(start >= 0 && end > start, "Broodmother decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const spawnIdx = body.indexOf("BossAbility.LARVAE_SPAWN");
    const shellIdx = body.indexOf("BossAbility.SHELL_ARMOR");
    const isShellIdx = body.indexOf(
      "const isShellActive = bossState.larvae.length > 0",
    );
    const firstSpawnIdx = body.indexOf("BossAbility.LARVAE_SPAWN");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(spawnIdx >= 0, "LARVAE_SPAWN is present");
    assert.ok(shellIdx >= 0, "SHELL_ARMOR is present");
    assert.ok(isShellIdx >= 0, "pre-spawn isShellActive is present");
    assert.ok(kitIdx < spawnIdx, "kit still wins the spawn turn");
    assert.ok(
      isShellIdx < firstSpawnIdx,
      "isShellActive is still computed before the first spawn return",
    );
    assert.equal(body.includes("shellArmorActive: isShellActive"), true);
    assert.equal(
      (body.match(/shellArmorActive: isShellActive/g) ?? []).length,
      2,
      "both odd and phase-2 even spawn branches still stamp the pre-spawn flag",
    );
    assert.ok(body.includes("new Map<string, number>()"));
    assert.ok(body.includes("handled on player movement side"));
    assert.equal(
      body.includes("resolveBroodmotherFirstSpawnShellArmor"),
      false,
    );
    assert.equal(body.includes("executeBroodmotherShellArmorSoak"), false);
    assert.equal(body.includes("BossAbility.LARVAE_EXPLODE"), false);
  });

  it("applyLarvaeSpawn still writes 1 HP markers and never the flag", () => {
    const src = readFileSync(join(here(), "../hooks/useBossSystem.ts"), "utf8");
    const spawn = src.slice(
      src.indexOf("function applyLarvaeSpawn"),
      src.indexOf("function applyShellArmor"),
    );
    assert.ok(spawn.includes("larva_"));
    assert.ok(spawn.includes("hp: 1"));
    assert.ok(spawn.includes("newLarvae: [larva]"));
    assert.ok(spawn.includes("larvae: [...params.bossState.larvae, larva]"));
    assert.equal(spawn.includes("shellArmorActive"), false);
    assert.equal(
      spawn.includes("resolveBroodmotherFirstSpawnShellArmor"),
      false,
    );

    const shell = src.slice(
      src.indexOf("function applyShellArmor"),
      src.indexOf("function applyLarvaeExplode"),
    );
    assert.ok(shell.includes("params.bossState.larvae.length > 0"));
    assert.ok(shell.includes("shellArmorActive: active"));
    assert.ok(shell.includes(SHELL_ARMOR_LOG_NEEDLE));
    assert.ok(src.includes("case BossAbility.SHELL_ARMOR:"));
    assert.ok(src.includes("case BossAbility.LARVAE_SPAWN:"));
  });

  it("WorldExploration still merges newBossState but never newLarvae combatants", () => {
    const wx = readFileSync(
      join(here(), "../components/WorldExploration.tsx"),
      "utf8",
    );
    const start = wx.indexOf("if (res?.newBossState)");
    assert.ok(start >= 0, "live newBossState merge is present");
    const merge = wx.slice(
      start,
      wx.indexOf("// Add hazard tiles to map", start),
    );
    assert.ok(merge.includes("...res.newBossState"));
    assert.equal(merge.includes("shellArmorActive"), false);
    assert.equal(wx.includes("res.newLarvae"), false);
    assert.equal(wx.includes("resolveBroodmotherFirstSpawnShellArmor"), false);
    assert.equal(wx.includes("executeBroodmotherShellArmorSoak"), false);
    assert.equal(
      wx.includes("larvae"),
      false,
      "WX still never reads bossState.larvae — explode leftover of #1217",
    );
  });

  it("castHelpers Shell Armor still requires larvae.length AND the flag", () => {
    const cast = readFileSync(join(here(), "./castHelpers.ts"), "utf8");
    assert.ok(cast.includes("shellArmorActive === true"));
    assert.ok(cast.includes("larvae?.length ?? 0) > 0"));
    assert.ok(cast.includes("Math.max(1, Math.floor(finalDmg / 2))"));
    assert.ok(cast.includes(SHELL_ARMOR_CAST_LOG_NEEDLE));
    assert.equal(
      cast.includes("resolveBroodmotherFirstSpawnShellArmor"),
      false,
    );
    assert.equal(cast.includes("Larva Venom"), false);
    assert.equal(cast.includes("spell-iron-skin"), false);
  });

  it("Boss Guide / Enemy Register / kit still advertise shell while larvae live", () => {
    const guide = readFileSync(
      join(here(), "../components/BossGuideModal.tsx"),
      "utf8",
    );
    assert.ok(guide.includes(SHELL_ARMOR_GUIDE_NEEDLE));
    const gStart = guide.indexOf(SHELL_ARMOR_GUIDE_NEEDLE);
    const gLine = guide.slice(gStart, gStart + 120);
    assert.equal(gLine.includes("summon-archer"), false);
    assert.equal(gLine.includes("spell-iron-skin"), false);

    const register = readFileSync(
      join(here(), "../components/EnemyRegister.tsx"),
      "utf8",
    );
    assert.ok(register.includes(SHELL_ARMOR_REGISTER_NEEDLE));
    const rSlice = register.slice(
      register.indexOf("Broodmother Rook"),
      register.indexOf("Lord of Static"),
    );
    assert.ok(rSlice.includes("Constantly spawns larvae every 2 turns"));
    assert.equal(rSlice.includes("summon-archer"), false);

    const kits = readFileSync(join(here(), "../data/bossKits.ts"), "utf8");
    const brood = kits.slice(
      kits.indexOf("broodmother_rook: {"),
      kits.indexOf("lord_of_static: {"),
    );
    const p1 = brood.slice(
      brood.indexOf("phase1SpellIds:"),
      brood.indexOf("phase2SpellIds:"),
    );
    assert.ok(p1.includes(`"${BROODMOTHER_SHELL_KIT_FIRST_ID}"`));
    assert.equal(kitArcher.id, BROODMOTHER_SHELL_KIT_FIRST_ID);
    assert.ok(brood.includes(`"${BROODMOTHER_IRON_SKIN_LEFTOVER_ID}"`));
    assert.equal(kitArcher.isSummon, true);
    assert.equal(Number(kitArcher.damage), 0);
  });
});
