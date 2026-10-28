/**
 * Combat action parity: boss kit damage/drain skip advertised player Mirror.
 * Live WX kit apply uses playerTakesDamage (RES only) and never consumes
 * the `"player"` Mirror token.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { activatePlayerMirror } from "../utils/playerMirror.ts";
import {
  BOSS_KIT_PLAYER_MIRROR_FIRE_DAMAGE,
  BOSS_KIT_PLAYER_MIRROR_FIRE_RANGE,
  BOSS_KIT_PLAYER_MIRROR_FIRE_SPELL_ID,
  PLAYER_MIRROR_KEY,
  bossKitPlayerMirrorAdvertisedReflect,
  bossKitPlayerMirrorHighlightedIsExecutable,
  canExecuteBossKitPlayerMirrorReflect,
  executeBossKitPlayerMirrorReflect,
  liveWxBossKitPlayerMirrorHit,
  liveWxBossKitSpellConsumesPlayerMirror,
  shouldDecideBossKitPlayerMirrorReflect,
} from "./bossKitPlayerMirrorReflect.ts";

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function wxSource(): string {
  return readFileSync(
    join(here(), "../components/WorldExploration.tsx"),
    "utf8",
  );
}

function useBossAiSource(): string {
  return readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
}

function bossKitsSource(): string {
  return readFileSync(join(here(), "../data/bossKits.ts"), "utf8");
}

function wxBossKitDamageBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf(
    "// Damage / drain → playerTakesDamage (mirror WX 13520-13646).",
  );
  assert.ok(start >= 0, "live boss kit damage arm is present");
  const end = wx.indexOf(
    "// Heal → updateCombatant on boss (store + strip).",
    start,
  );
  assert.ok(end > start, "heal arm still follows boss kit damage");
  return wx.slice(start, end);
}

function wxPackCastSoakBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("const spellRange = Number(chosenSpell.range);");
  assert.ok(start >= 0, "live pack cast arm is present");
  const plSp = wx.indexOf("const plSpEff = isSummonTarget", start);
  assert.ok(plSp > start, "live pack cast still builds plSpEff");
  const playerHit = wx.indexOf("actualDmg = playerTakesDamage(", plSp);
  assert.ok(playerHit > plSp, "player cast still ends in playerTakesDamage");
  const cooldown = wx.indexOf(
    "if (chosenSpell.cooldown && chosenSpell.cooldown > 0)",
    playerHit,
  );
  assert.ok(cooldown > playerHit, "cooldown arm still follows the soak");
  return wx.slice(plSp, cooldown);
}

function cursedWoundReady() {
  const mirrorUnits = activatePlayerMirror(new Set());
  return {
    rawDamage: BOSS_KIT_PLAYER_MIRROR_FIRE_DAMAGE,
    bossRes: 0,
    playerHp: 100,
    bossHp: 200,
    targetIsPlayer: true,
    isSpell: true,
    hitsMultiple: false,
    aoe: false,
    chebyshev: 2,
    range: BOSS_KIT_PLAYER_MIRROR_FIRE_RANGE,
    mirrorUnits,
  };
}

describe("boss kit cast player Mirror reflect", () => {
  it("catalog Cursed Wound 22 is a single-target spell and kit first-id", () => {
    const wound = starterSpells.find(
      (s) => s.id === BOSS_KIT_PLAYER_MIRROR_FIRE_SPELL_ID,
    );
    assert.ok(wound);
    assert.equal(Number(wound?.damage), BOSS_KIT_PLAYER_MIRROR_FIRE_DAMAGE);
    assert.equal(Number(wound?.range), BOSS_KIT_PLAYER_MIRROR_FIRE_RANGE);
    assert.equal(wound?.hitsMultiple, undefined);
    assert.equal(wound?.aoe, undefined);
    assert.equal(wound?.isPhysical, undefined);
    assert.equal(wound?.spellType, "damage");
    assert.equal(PLAYER_MIRROR_KEY, "player");

    const mirror = starterSpells.find((s) => s.id === "spell-mirror");
    assert.ok(mirror);
    assert.equal(mirror?.isMirror, true);
    assert.ok(
      String(mirror?.description).toLowerCase().includes("reflect"),
      "catalog Mirror still advertises reflect",
    );

    assert.equal(bossKitPlayerMirrorAdvertisedReflect(22, 0), 22);
    assert.equal(liveWxBossKitPlayerMirrorHit(22, 0), 22);
    assert.equal(liveWxBossKitSpellConsumesPlayerMirror(), false);

    const kits = bossKitsSource();
    for (const bossId of [
      "pale_archbishop",
      "midnight_bishop",
      "chessboard_lich",
      "pale_archivist",
    ]) {
      const heading = kits.indexOf(`${bossId}: {`);
      assert.ok(heading >= 0, `${bossId} kit is present`);
      const phase1 = kits.indexOf("phase1SpellIds:", heading);
      assert.ok(phase1 > heading, `${bossId} has phase1SpellIds`);
      const firstIdLine = kits.slice(phase1, phase1 + 80);
      assert.ok(
        firstIdLine.includes(`"${BOSS_KIT_PLAYER_MIRROR_FIRE_SPELL_ID}"`),
        `${bossId} phase 1 first-id is Cursed Wound`,
      );
    }
  });

  it("live kit damage never consumes Mirror; pack CAST still does", () => {
    const kit = wxBossKitDamageBlock();
    assert.ok(kit.includes("playerTakesDamage("));
    assert.ok(
      kit.includes("const bRawDmg = Math.max(1, Math.round(bSpellDmg))"),
    );
    assert.ok(
      kit.includes("playerTakesDamage(\n                      bRawDmg,"),
    );
    assert.equal(
      kit.includes("consumePlayerMirror"),
      false,
      "kit damage arm still never consumes player Mirror",
    );
    assert.equal(kit.includes("mirrorUnitsRef"), false);
    assert.equal(kit.includes("PLAYER_MIRROR_KEY"), false);
    assert.equal(kit.includes("isMirror"), false);

    const pack = wxPackCastSoakBlock();
    assert.ok(
      pack.includes("consumePlayerMirror(mirrorUnitsRef.current)"),
      "pack CAST still reflects single-target spells through consumePlayerMirror",
    );
    assert.ok(pack.includes("!chosenSpell.hitsMultiple"));
    assert.ok(pack.includes("!chosenSpell.aoe"));

    const wx = wxSource();
    assert.equal(wx.includes("executeBossKitPlayerMirrorReflect"), false);
    assert.equal(wx.includes("bossKitPlayerMirrorAdvertisedReflect"), false);

    const ai = useBossAiSource();
    assert.ok(ai.includes("new Map<string, number>()"));
    assert.equal(
      ai.includes("enemyCooldownsRef"),
      false,
      "pickBossKitSpell still receives an empty cooldown Map",
    );
  });

  it("executes Cursed Wound 22 as a reflect; live RES-only hits the player", () => {
    const ready = cursedWoundReady();
    const decided = shouldDecideBossKitPlayerMirrorReflect(ready);
    const executable = canExecuteBossKitPlayerMirrorReflect(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      bossKitPlayerMirrorHighlightedIsExecutable({ decided, executable }),
      true,
    );

    const next = executeBossKitPlayerMirrorReflect(ready);
    assert.deepEqual(next, {
      reflectedDamage: 22,
      playerHpAfter: 100,
      bossHpAfter: 178,
      playerDied: false,
      bossDied: false,
      mirrorConsumed: true,
    });
    assert.equal(ready.mirrorUnits.has(PLAYER_MIRROR_KEY), false);
    assert.equal(
      liveWxBossKitPlayerMirrorHit(ready.rawDamage, 0),
      22,
      "live RES 0 kit hit still lands 22 on the player",
    );
    assert.notEqual(next?.playerHpAfter, 78);

    assert.deepEqual(
      executeBossKitPlayerMirrorReflect({
        ...cursedWoundReady(),
        bossHp: 10,
      }),
      {
        reflectedDamage: 22,
        playerHpAfter: 100,
        bossHpAfter: 0,
        playerDied: false,
        bossDied: true,
        mirrorConsumed: true,
      },
    );

    // Boss RES 50 → advertised reflect 11. Live kit still hits the player
    // for 22 (RES 0) and leaves Mirror charged.
    assert.equal(bossKitPlayerMirrorAdvertisedReflect(22, 50), 11);
    assert.equal(liveWxBossKitPlayerMirrorHit(22, 0), 22);
  });

  it("cannot stamp hitsMultiple, physical, out-of-range, or sibling leftover payloads", () => {
    const ready = cursedWoundReady();
    assert.equal(
      executeBossKitPlayerMirrorReflect({
        ...ready,
        chebyshev: 5,
      }),
      null,
      "Chebyshev 5 is #888 kit range skip, not this Mirror reflect",
    );
    assert.equal(ready.mirrorUnits.has(PLAYER_MIRROR_KEY), true);

    assert.equal(
      executeBossKitPlayerMirrorReflect({
        ...cursedWoundReady(),
        targetIsPlayer: false,
      }),
      null,
      "kit summon short-circuit never reaches the damage arm",
    );
    assert.equal(
      executeBossKitPlayerMirrorReflect({
        ...cursedWoundReady(),
        isSpell: false,
      }),
      null,
      "physical_attack first-id is not advertised as a spell — leave",
    );
    assert.equal(
      executeBossKitPlayerMirrorReflect({
        ...cursedWoundReady(),
        hitsMultiple: true,
      }),
      null,
      "Chain Lightning hitsMultiple skip is pack-identical / #868 bounce",
    );
    assert.equal(
      executeBossKitPlayerMirrorReflect({
        ...cursedWoundReady(),
        aoe: true,
      }),
      null,
    );
    assert.equal(
      executeBossKitPlayerMirrorReflect({
        ...cursedWoundReady(),
        rawDamage: 0,
      }),
      null,
      "Inferno damage 0 never enters the kit damage arm",
    );
    assert.equal(
      executeBossKitPlayerMirrorReflect({
        ...cursedWoundReady(),
        mirrorUnits: new Set(),
      }),
      null,
      "unarmed Mirror is #1262 SR soak, not this reflect",
    );

    const crit = executeBossKitPlayerMirrorReflect(cursedWoundReady());
    assert.ok(crit);
    assert.equal("chc" in crit, false, "#1104 owns kit CHC");
    assert.equal("sr" in crit, false, "#1262 owns kit SR soak");
    assert.equal("heal" in crit, false, "#1148 owns Vampiric Ground heal");
    assert.equal("roll" in crit, false, "#1208 owns Titan 1–5×");
    assert.equal(
      "glass" in crit,
      false,
      "#1160 / #1252 own Glass Realm packets",
    );
    assert.equal("bounces" in crit, false, "#868 owns kit bounce");
    assert.equal(
      "apDrainLastTurn" in crit,
      false,
      "#1234 owns Enthroned Void last-turn AP stamp",
    );
    assert.equal(
      bossKitPlayerMirrorHighlightedIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off the player Mirror token, not announce copy or Chain Lightning", () => {
    assert.equal(PLAYER_MIRROR_KEY, "player");
    const ready = cursedWoundReady();
    assert.equal(
      shouldDecideBossKitPlayerMirrorReflect(ready),
      canExecuteBossKitPlayerMirrorReflect(ready),
    );
    const blast = starterSpells.find((s) => s.id === "starter-blast");
    assert.equal(blast?.hitsMultiple, true);
    assert.equal(
      canExecuteBossKitPlayerMirrorReflect({
        ...cursedWoundReady(),
        rawDamage: 20,
        hitsMultiple: true,
        range: 4,
        chebyshev: 3,
      }),
      false,
      "Void Grandmaster Chain Lightning is hitsMultiple — pack also skips Mirror",
    );
  });
});
