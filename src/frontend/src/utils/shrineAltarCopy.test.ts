import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  SHRINE_ALTAR_DOKA,
  SHRINE_ROOM_CHIP,
  SHRINE_ROOM_HINT,
  shrineAltarHover,
  shrineCreditToast,
} from "./shrineAltarCopy.ts";

const wxSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("shrineAltarCopy", () => {
  it("names the 300 Doka altar without a SaaS label", () => {
    assert.equal(SHRINE_ALTAR_DOKA, 300);
    assert.equal(SHRINE_ROOM_CHIP, "Shrine");
    assert.match(SHRINE_ROOM_HINT, /altar/i);
    assert.match(SHRINE_ROOM_HINT, /300 Doka/);
    assert.equal(shrineAltarHover(), "Altar — step here for 300 Doka");
    assert.equal(shrineAltarHover(300), "Altar — step here for 300 Doka");
    assert.equal(shrineCreditToast(), "+300 Doka from the altar");
    assert.equal(shrineAltarHover(0), "Altar — step here for 300 Doka");
    assert.equal(shrineCreditToast(Number.NaN), "+300 Doka from the altar");
    assert.equal(/shop|checkout|claim reward/i.test(SHRINE_ROOM_HINT), false);
  });

  it("is not wired into WorldExploration (hosts still silent)", () => {
    assert.match(wxSource, /shrineAltarPosRef/);
    assert.match(wxSource, /characterSlot,\s*300/);
    assert.equal(wxSource.includes("shrineAltarCopy"), false);
    assert.equal(wxSource.includes("Altar — step here"), false);
    assert.equal(wxSource.includes("from the altar"), false);
    assert.equal(wxSource.includes("The center tile is an altar"), false);
  });
});
