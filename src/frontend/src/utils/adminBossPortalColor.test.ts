import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

/**
 * AFDA-2026-10-29-047 lock.
 *
 * Admin Bosses persist `portalColor` (hex). Motoko/bindgen BossConfig also
 * has `bossMapColor`. WorldExploration.drawPortalWhirlpool paints from the
 * local PortalColor enum (`boss` → hardcoded #1a0033 / #5b1fa0 / #9333ea).
 * It never reads BossConfig.portalColor or bossMapColor. Admin has no
 * bossMapColor editor. Custom art is not required (013); new bosses still
 * use chess-piece pixels. Distinct from 002 (localStorage vs canister).
 *
 * Do not restack AdminDashboard / WorldExploration / bossTypes here.
 */
const here = dirname(fileURLToPath(import.meta.url));
const worldExploration = readFileSync(
  join(here, "../components/WorldExploration.tsx"),
  "utf8",
);
const adminDashboard = readFileSync(
  join(here, "../components/AdminDashboard.tsx"),
  "utf8",
);
const bossDefaults = readFileSync(
  join(here, "../types/bossDefaults.ts"),
  "utf8",
);
const bossTypes = readFileSync(join(here, "../types/bossTypes.ts"), "utf8");

describe("AFDA-2026-10-29-047 admin boss portalColor / bossMapColor unused by paint", () => {
  it("default boss catalog and frontend type store portalColor and bossMapColor", () => {
    const portalCount = bossDefaults.split("portalColor:").length - 1;
    const mapCount = bossDefaults.split("bossMapColor:").length - 1;
    assert.equal(portalCount >= 12, true);
    assert.equal(mapCount, portalCount);
    assert.equal(bossTypes.includes("portalColor: string"), true);
    assert.equal(bossTypes.includes("bossMapColor: string"), true);
  });

  it("world whirlpool paints from the PortalColor enum, not BossConfig.portalColor", () => {
    assert.equal(worldExploration.includes('boss: ["#1a0033"'), true);
    assert.equal(/\bbossMapColor\b/.test(worldExploration), false);
    assert.equal(/\.portalColor\b/.test(worldExploration), false);
  });

  it("admin Bosses edit portalColor and never expose bossMapColor", () => {
    assert.equal(adminDashboard.includes("draft.portalColor"), true);
    assert.equal(/\bbossMapColor\b/.test(adminDashboard), false);
  });

  it("a stored hex other than the enum purple would not change the whirlpool", () => {
    const paintedPurple = "#9333ea";
    const adminHex = "#00ff00";
    assert.notEqual(adminHex, paintedPurple);
    assert.equal(worldExploration.includes(adminHex), false);
    assert.equal(worldExploration.includes(paintedPurple), true);
  });
});
