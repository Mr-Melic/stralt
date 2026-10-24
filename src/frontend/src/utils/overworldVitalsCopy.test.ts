import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  HEAL_AFFORD_TITLE,
  HEAL_BROKE_TITLE,
  HEAL_JACKPOT_HINT,
  HEAL_NEED_DOKA_LABEL,
  HEAL_WITH_DOKA_LABEL,
  OVERWORLD_ORB_TITLE,
} from "./overworldVitalsCopy.ts";

const wxSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("overworldVitalsCopy", () => {
  it("heal copy names 3 HP per 1 Doka instead of bare 1:3", () => {
    assert.equal(
      HEAL_WITH_DOKA_LABEL(30, 10),
      "♥ Heal 30 HP for 10 Doka (3 HP per 1 Doka)",
    );
    assert.equal(/\(1:3\)/.test(HEAL_WITH_DOKA_LABEL(9, 3)), false);
    assert.match(HEAL_AFFORD_TITLE(12, 4), /3 HP per 1 Doka/);
    assert.match(HEAL_NEED_DOKA_LABEL, /Need Doka/);
    assert.match(HEAL_BROKE_TITLE, /Not enough Doka/i);
  });

  it("overworld AP/MP titles say battle budget", () => {
    assert.match(OVERWORLD_ORB_TITLE("AP", 6, 6), /battle budget/i);
    assert.match(OVERWORLD_ORB_TITLE("MP", 3, 3), /not spent while exploring/i);
    assert.equal(
      /battle budget/i.test(OVERWORLD_ORB_TITLE("HP", 100, 100)),
      false,
    );
  });

  it("names the rare full-heal blessing without casino chrome", () => {
    assert.match(HEAL_JACKPOT_HINT, /Rare blessing/i);
    assert.match(HEAL_JACKPOT_HINT, /1 Doka/);
    assert.equal(/🎰|jackpot/i.test(HEAL_JACKPOT_HINT), false);
  });

  it("is not wired into WorldExploration (hosts still print 1:3 and Portal...)", () => {
    assert.match(wxSource, /\(1:3\)/);
    assert.match(wxSource, /Portal\.\.\./);
    assert.equal(wxSource.includes("overworldVitalsCopy"), false);
    assert.equal(wxSource.includes("HEAL_JACKPOT_HINT"), false);
  });
});
