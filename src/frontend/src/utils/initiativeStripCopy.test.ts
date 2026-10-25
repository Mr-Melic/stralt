import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ENRAGED_FLAME,
  INITIATIVE_BOLT,
  LEADER_CROWN,
  LEADER_HOVER_NOTE,
  initiativeValueLabel,
  spellsCountLabel,
} from "./initiativeStripCopy.ts";

const stripSource = readFileSync(
  fileURLToPath(new URL("../components/InitiativeStrip.tsx", import.meta.url)),
  "utf8",
);

describe("initiativeStripCopy", () => {
  it("uses real glyphs, not raw \\u escapes", () => {
    assert.equal(LEADER_CROWN, "👑");
    assert.equal(ENRAGED_FLAME, "🔥");
    assert.equal(INITIATIVE_BOLT, "⚡");
    assert.equal(/\\u[0-9A-Fa-f]{4}/.test(LEADER_CROWN), false);
    assert.equal(/\\u[0-9A-Fa-f]{4}/.test(ENRAGED_FLAME), false);
    assert.equal(/\\u[0-9A-Fa-f]{4}/.test(INITIATIVE_BOLT), false);
  });

  it("leader hover names the pack bonus", () => {
    assert.match(LEADER_HOVER_NOTE, /LEADER/);
    assert.match(LEADER_HOVER_NOTE, /ally death/i);
    assert.equal(LEADER_HOVER_NOTE.startsWith(LEADER_CROWN), true);
  });

  it("initiative and spell-count chips use the bolt glyph", () => {
    assert.equal(initiativeValueLabel(12), "⚡12");
    assert.equal(spellsCountLabel(3), "⚡ 3 spells");
  });

  it("is not wired — InitiativeStrip still prints raw JSXText escapes", () => {
    assert.match(stripSource, /\\uD83D\\uDC51/);
    assert.match(stripSource, /\\uD83D\\uDD25/);
    assert.match(stripSource, /\\u26A1\{combatant\.initiative\}/);
    assert.equal(stripSource.includes("initiativeStripCopy"), false);
  });
});
