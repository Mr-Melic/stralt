import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { HUD_XP_LABEL, HUD_XP_TITLE, hudXpReadout } from "./hudXpCopy.ts";

const wxSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);
const gameFlowSource = readFileSync(
  fileURLToPath(new URL("../components/GameFlow.tsx", import.meta.url)),
  "utf8",
);

describe("hudXpCopy", () => {
  it("names leftover XP in this level, not a lifetime total", () => {
    assert.equal(HUD_XP_LABEL, "XP");
    assert.match(HUD_XP_TITLE, /Leftover XP in this level/);
    assert.match(HUD_XP_TITLE, /not a lifetime total/);
    assert.equal(hudXpReadout(80, 100), "80/100");
    assert.equal(hudXpReadout(-3, 0), "0/1");
    assert.equal(hudXpReadout(Number.NaN, Number.NaN), "0/1");
    assert.equal(/lifetime total/i.test(HUD_XP_LABEL), false);
  });

  it("is not wired into WorldExploration or GameFlow (dummy bar stays gone)", () => {
    assert.match(wxSource, />\s*XP\s*</);
    assert.equal(wxSource.includes("hudXpCopy"), false);
    assert.equal(wxSource.includes("Leftover XP in this level"), false);
    assert.match(gameFlowSource, /Snap spacer only/);
    assert.equal(gameFlowSource.includes("hudXpReadout"), false);
  });
});
