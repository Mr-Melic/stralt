/**
 * Combat action parity: Final Pawn GHOST_SUMMON advertised 1 HP commits
 * on the combat map. Live WX spawn write uses the init formula then
 * stamps HUD/Strike HP to 20.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { shouldAwardVictory } from "./battleSetup.ts";
import {
  FINAL_PAWN_HP,
  FINAL_PAWN_ID,
  FINAL_PAWN_INIT,
  GHOST_SUMMON_ABILITY_ID,
  GHOST_SUMMON_ADVERTISED_HP,
  GHOST_SUMMON_AP,
  GHOST_SUMMON_ATK,
  GHOST_SUMMON_LOG_NEEDLE,
  GHOST_SUMMON_PIECE,
  PHANTOM_SPAWN_ABILITY_ID,
  SCROLL_SUMMON_ABILITY_ID,
  SPAWN_MINIONS_ABILITY_ID,
  SPLIT_ROOKS_ABILITY_ID,
  WX_GHOST_MINION_HP_ADD,
  WX_GHOST_MINION_HP_MULT,
  WX_GHOST_MINION_INIT_OFFSET,
  WX_GHOST_SPAWN_HP_STAMP,
  finalPawnHostilesRemaining,
  ghostHpAfterStrike,
  isGhostSummonSpawn,
  leftoverGhostBlocksVictory,
  resolveGhostSummonCommittedHp,
  wxGhostMinionFormulaDamage,
  wxGhostMinionFormulaHp,
  wxGhostSummonHpOverwritesAdvertised,
  wxGhostSummonLiveCommittedHp,
} from "./bossGhostSummonHpCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
assert.ok(strike, "physical_attack");
const STRIKE_DAMAGE = Number(strike.damage);

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function wxSource(): string {
  return readFileSync(
    join(here(), "../components/WorldExploration.tsx"),
    "utf8",
  );
}

function bossSystemSource(): string {
  return readFileSync(join(here(), "../hooks/useBossSystem.ts"), "utf8");
}

function bossAiSource(): string {
  return readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
}

function bossDefaultsSource(): string {
  return readFileSync(join(here(), "../types/bossDefaults.ts"), "utf8");
}

function wxSpawnCommitBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("if (res?.spawns && res.spawns.length > 0) {");
  assert.ok(start >= 0, "live boss spawn commit is present");
  const end = wx.indexOf("if (res?.endsTurn === true)", start);
  assert.ok(end > start, "endsTurn still follows spawn commit");
  return wx.slice(start, end);
}

function applyGhostSummonBlock(): string {
  const src = bossSystemSource();
  const start = src.indexOf("function applyGhostSummon(");
  assert.ok(start >= 0, "applyGhostSummon is present");
  const end = src.indexOf("function applyResonanceShockwave(", start);
  assert.ok(end > start, "Resonance still follows Ghost Summon");
  return src.slice(start, end);
}

function ghostSpawn() {
  return {
    id: "ghost_pale_archbishop_1",
    pieceType: GHOST_SUMMON_PIECE,
    hp: GHOST_SUMMON_ADVERTISED_HP,
    maxHp: GHOST_SUMMON_ADVERTISED_HP,
    atk: GHOST_SUMMON_ATK,
    ap: GHOST_SUMMON_AP,
    isBossMinion: true,
  };
}

function phantomSpawn() {
  return {
    id: "void_phantom_1",
    pieceType: "pawn" as const,
    hp: 1,
    maxHp: 1,
    atk: 5,
    ap: 2,
    isBossMinion: true,
  };
}

function skeletonSpawn() {
  return {
    id: "minion_countess_0",
    pieceType: "pawn" as const,
    hp: 20,
    maxHp: 20,
    atk: 8,
    ap: 3,
    isBossMinion: true,
  };
}

function scrollSpawn() {
  return {
    id: "scroll_pale_archivist_1",
    pieceType: "bishop" as const,
    hp: 30,
    maxHp: 30,
    atk: 8,
    ap: 3,
    isBossMinion: true,
  };
}

function splitRookSpawn() {
  return {
    id: "split_rook_0",
    pieceType: "rook" as const,
    hp: 210,
    maxHp: 210,
    atk: 25,
    ap: 5,
    isBossMinion: true,
  };
}

describe("wxGhostSummonLiveCommittedHp (live leftover)", () => {
  it("stamps advertised 1 HP ghost kings to 20 on the combat map", () => {
    const spawn = ghostSpawn();
    assert.equal(isGhostSummonSpawn(spawn), true);
    assert.equal(wxGhostSummonLiveCommittedHp(spawn), WX_GHOST_SPAWN_HP_STAMP);
    assert.equal(wxGhostSummonLiveCommittedHp(spawn), 20);
    assert.notEqual(
      wxGhostSummonLiveCommittedHp(spawn),
      GHOST_SUMMON_ADVERTISED_HP,
    );
    assert.equal(wxGhostSummonHpOverwritesAdvertised(spawn), true);
  });

  it("computes the Final Pawn init formula 36 then discards it — Strike reads the stamp", () => {
    assert.equal(FINAL_PAWN_INIT, 4);
    assert.equal(WX_GHOST_MINION_INIT_OFFSET, 2);
    assert.equal(WX_GHOST_MINION_HP_MULT, 8);
    assert.equal(WX_GHOST_MINION_HP_ADD, 20);
    assert.equal(wxGhostMinionFormulaHp(FINAL_PAWN_INIT), 36);
    assert.notEqual(
      wxGhostMinionFormulaHp(FINAL_PAWN_INIT),
      GHOST_SUMMON_ADVERTISED_HP,
    );
    assert.notEqual(
      wxGhostMinionFormulaHp(FINAL_PAWN_INIT),
      WX_GHOST_SPAWN_HP_STAMP,
    );
    assert.equal(wxGhostSummonLiveCommittedHp(ghostSpawn()), 20);
  });

  it("does not treat phantom 1 / skeleton 20 / scroll 30 / split-rook as this leftover", () => {
    assert.equal(isGhostSummonSpawn(phantomSpawn()), false);
    assert.equal(isGhostSummonSpawn(skeletonSpawn()), false);
    assert.equal(isGhostSummonSpawn(scrollSpawn()), false);
    assert.equal(isGhostSummonSpawn(splitRookSpawn()), false);
    assert.equal(wxGhostSummonHpOverwritesAdvertised(phantomSpawn()), false);
    assert.equal(wxGhostSummonHpOverwritesAdvertised(skeletonSpawn()), false);
    assert.equal(wxGhostSummonHpOverwritesAdvertised(scrollSpawn()), false);
  });
});

describe("resolveGhostSummonCommittedHp", () => {
  it("keeps advertised 1 HP on a Final Pawn ghost king", () => {
    const spawn = ghostSpawn();
    assert.equal(
      resolveGhostSummonCommittedHp(spawn),
      GHOST_SUMMON_ADVERTISED_HP,
    );
    assert.equal(resolveGhostSummonCommittedHp(spawn), 1);
    assert.notEqual(
      resolveGhostSummonCommittedHp(spawn),
      wxGhostSummonLiveCommittedHp(spawn),
    );
  });

  it("still stamps phantom / scroll / split-rook / skeleton — not this leftover", () => {
    assert.equal(resolveGhostSummonCommittedHp(phantomSpawn()), 20);
    assert.equal(resolveGhostSummonCommittedHp(scrollSpawn()), 20);
    assert.equal(resolveGhostSummonCommittedHp(splitRookSpawn()), 20);
    assert.equal(resolveGhostSummonCommittedHp(skeletonSpawn()), 20);
    assert.notEqual(PHANTOM_SPAWN_ABILITY_ID, GHOST_SUMMON_ABILITY_ID);
    assert.notEqual(SCROLL_SUMMON_ABILITY_ID, GHOST_SUMMON_ABILITY_ID);
    assert.notEqual(SPLIT_ROOKS_ABILITY_ID, GHOST_SUMMON_ABILITY_ID);
    assert.notEqual(SPAWN_MINIONS_ABILITY_ID, GHOST_SUMMON_ABILITY_ID);
  });

  it("does not restore advertised atk 5 or ap 2", () => {
    assert.equal(GHOST_SUMMON_ATK, 5);
    assert.equal(GHOST_SUMMON_AP, 2);
    assert.equal(wxGhostMinionFormulaDamage(FINAL_PAWN_INIT), 7);
    assert.notEqual(
      wxGhostMinionFormulaDamage(FINAL_PAWN_INIT),
      GHOST_SUMMON_ATK,
    );
    assert.equal(resolveGhostSummonCommittedHp(ghostSpawn()), 1);
  });

  it("non-finite advertised HP fail-closed to the stamp", () => {
    assert.equal(
      resolveGhostSummonCommittedHp({
        pieceType: GHOST_SUMMON_PIECE,
        hp: Number.NaN,
        isBossMinion: true,
      }),
      WX_GHOST_SPAWN_HP_STAMP,
    );
    assert.equal(wxGhostMinionFormulaHp(Number.NaN), WX_GHOST_SPAWN_HP_STAMP);
    assert.equal(
      isGhostSummonSpawn({
        pieceType: GHOST_SUMMON_PIECE,
        hp: 1,
        isBossMinion: false,
      }),
      false,
    );
  });
});

describe("player-visible one-Strike fork", () => {
  it("live stamp 20 survives one Strike 10 and still blocks shouldAwardVictory", () => {
    const live = wxGhostSummonLiveCommittedHp(ghostSpawn());
    assert.equal(STRIKE_DAMAGE, 10);
    const afterOne = ghostHpAfterStrike({
      ghostHp: live,
      strikeDamage: STRIKE_DAMAGE,
    });
    assert.equal(afterOne, 10);
    assert.equal(
      leftoverGhostBlocksVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        bossHp: 0,
        ghostHp: afterOne,
      }),
      true,
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        hostilesRemaining: finalPawnHostilesRemaining({
          bossHp: 0,
          ghostHp: afterOne,
        }),
      }),
      false,
    );
  });

  it("advertised 1 HP dies on one Strike 10 and can award", () => {
    const advertised = resolveGhostSummonCommittedHp(ghostSpawn());
    const afterOne = ghostHpAfterStrike({
      ghostHp: advertised,
      strikeDamage: STRIKE_DAMAGE,
    });
    assert.equal(afterOne, 0);
    assert.equal(
      leftoverGhostBlocksVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        bossHp: 0,
        ghostHp: afterOne,
      }),
      false,
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 2,
        hostilesRemaining: finalPawnHostilesRemaining({
          bossHp: 0,
          ghostHp: afterOne,
        }),
      }),
      true,
    );
  });
});

describe("live WX / catalog leftover proof", () => {
  it("applyGhostSummon writes king HP 1 and the spawn commit never reads s.hp", () => {
    const ghost = applyGhostSummonBlock();
    assert.match(ghost, /pieceType:\s*"king"/);
    assert.match(ghost, /hp:\s*1/);
    assert.match(ghost, /maxHp:\s*1/);
    assert.match(ghost, /atk:\s*5/);
    assert.match(ghost, /ap:\s*2/);
    assert.match(ghost, /isBossMinion:\s*true/);
    assert.equal(ghost.includes(GHOST_SUMMON_LOG_NEEDLE.split("${")[0]), true);

    const spawn = wxSpawnCommitBlock();
    assert.match(spawn, /n\[m\.id\]\s*=\s*20/);
    assert.match(spawn, /\*\s*8\s*\+\s*20/);
    assert.equal(spawn.includes("s.hp"), false);
    assert.equal(spawn.includes("GHOST_SUMMON"), false);
    assert.equal(spawn.includes('pieceType === "king"'), false);
    assert.equal(spawn.includes("resolveGhostSummonCommittedHp"), false);
  });

  it("Final Pawn catalog + AI still advertise GHOST_SUMMON at 10% HP", () => {
    const defaults = bossDefaultsSource();
    assert.match(defaults, /id:\s*"final_pawn"/);
    assert.match(defaults, /init:\s*4/);
    assert.match(defaults, /hp:\s*600/);
    assert.equal(FINAL_PAWN_ID, "final_pawn");
    assert.equal(FINAL_PAWN_HP, 600);

    const ai = bossAiSource();
    assert.match(ai, /BossAbility\.GHOST_SUMMON/);
    assert.match(ai, /boss\.hp\s*\/\s*boss\.maxHp\s*<=\s*0\.1/);
    assert.equal(ai.includes("resolveGhostSummonCommittedHp"), false);
    assert.equal(wxSource().includes("resolveGhostSummonCommittedHp"), false);
  });
});
