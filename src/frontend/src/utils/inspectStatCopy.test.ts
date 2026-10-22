import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { INSPECT_STAT_TITLE, inspectStatTitle } from "./inspectStatCopy.ts";

const popupSource = readFileSync(
  fileURLToPath(new URL("../components/StatPopup.tsx", import.meta.url)),
  "utf8",
);
const wxSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("inspectStatCopy", () => {
  it("expands SP / SR / RES / CHC / INIT / FAIL without SaaS words", () => {
    assert.match(INSPECT_STAT_TITLE.SP, /Spell Power/);
    assert.match(INSPECT_STAT_TITLE.SR, /Spell Resist/);
    assert.match(INSPECT_STAT_TITLE.RES, /Resistance/);
    assert.match(INSPECT_STAT_TITLE.CHC, /Crit Chance/);
    assert.match(INSPECT_STAT_TITLE.INIT, /Initiative/);
    assert.match(INSPECT_STAT_TITLE.FAIL, /fizzles/);
    assert.equal(inspectStatTitle("sp"), INSPECT_STAT_TITLE.SP);
    assert.equal(inspectStatTitle("FAIL"), INSPECT_STAT_TITLE.FAIL);
    assert.equal(inspectStatTitle("unknown"), "UNKNOWN");
    assert.equal(/dashboard|tooltip|saas/i.test(INSPECT_STAT_TITLE.SP), false);
  });

  it("is not wired into StatPopup or WorldExploration Statistics", () => {
    assert.match(popupSource, />FAIL</);
    assert.equal(popupSource.includes("inspectStatTitle"), false);
    assert.equal(popupSource.includes("Spell Power"), false);
    assert.match(wxSource, /label: "FAIL"/);
    assert.equal(wxSource.includes("inspectStatCopy"), false);
    assert.equal(wxSource.includes("Spell Power —"), false);
  });
});
