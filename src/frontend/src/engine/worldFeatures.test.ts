import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MAX_ENEMIES, MAX_HAZARD_TILES } from "../data/gameConstants.ts";
import {
  EXISTING_MAP_MODIFIER_IDS,
  LATEST_CATALOG_WAVE,
  MAX_ROLLED_FEATURES,
  REWARD_MULT,
  SPAWN_SAFE_RADIUS,
  THREAT_MULT,
  WORLD_FEATURES,
  canAddEnemies,
  canAddHazardTiles,
  extraEnemyRoll,
  extraHazardRoll,
  featureCatalogWave,
  featureHasLevelCutoff,
  featuresInCatalogWave,
  getWorldFeature,
  hpTaxFromMax,
  isFeatureAllowedInContext,
  isTileReservedForSpawnOrPortal,
  mustRevalidateSolvability,
  pickWeightedFeatures,
  relativeRewardMultiplier,
  relativeThreatMultiplier,
  scaleReward,
  scaleSameTierStat,
} from "./worldFeatures.ts";

const REQUIRED_CATEGORIES = [
  "hazard",
  "moving_hazard",
  "trap",
  "destructible_terrain",
  "temporary_obstacle",
  "heal_buff_zone",
  "teleport_tile",
  "unstable_portal",
  "rare_invasion",
  "elite_patrol",
  "treasure_encounter",
  "spell_bearing_enemy",
  "risk_reward",
  "map_modifier",
  "world_event",
  "environmental_combat",
] as const;

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

describe("world feature catalog contract", () => {
  it("covers every requested category with unique WF- ids", () => {
    const ids = WORLD_FEATURES.map((f) => f.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const id of ids) {
      assert.match(id, /^WF-[A-Z]+-[A-Z0-9_]+$/);
    }
    const cats = new Set(WORLD_FEATURES.map((f) => f.category));
    for (const cat of REQUIRED_CATEGORIES) {
      assert.equal(cats.has(cat), true, `missing category ${cat}`);
    }
  });

  it("every feature has a decision, visual, solvability, rules, and counterplay", () => {
    for (const f of WORLD_FEATURES) {
      assert.ok(f.name.length > 0, f.id);
      assert.ok(f.mechanic.length > 20, f.id);
      assert.ok(f.playerDecision.length > 10, f.id);
      assert.ok(f.visual.glyph.length > 0, f.id);
      assert.match(f.visual.tileTint, /^#[0-9a-fA-F]{6}$/, f.id);
      assert.ok(f.visual.tooltip.length > 0, f.id);
      assert.ok(f.solvability.length > 10, f.id);
      assert.ok(f.combatRules.length > 10, f.id);
      assert.ok(f.counterplay.length > 10, f.id);
      assert.ok(
        f.rewardPath === "applyRewards" ||
          f.rewardPath === "saveBattleStats" ||
          f.rewardPath === "none",
        f.id,
      );
    }
  });

  it("does not use player-level cutoffs", () => {
    for (const f of WORLD_FEATURES) {
      assert.equal(featureHasLevelCutoff(f), false, f.id);
      const blob = `${f.mechanic} ${f.combatRules} ${f.solvability}`;
      assert.equal(
        /min(?:imum)?\s*level|level\s*[≥>=]{1,2}\s*\d+|only above level/i.test(
          blob,
        ),
        false,
        f.id,
      );
    }
  });

  it("does not reuse live map-modifier ids", () => {
    const ids = new Set(WORLD_FEATURES.map((f) => f.id));
    for (const live of EXISTING_MAP_MODIFIER_IDS) {
      assert.equal(ids.has(live), false, live);
    }
  });

  it("blocking features require a bypass and solvability re-check", () => {
    const blockers = WORLD_FEATURES.filter((f) => f.blocksWalk);
    assert.ok(blockers.length >= 2);
    for (const f of blockers) {
      assert.equal(f.requiresBypass, true, f.id);
      assert.equal(mustRevalidateSolvability(f), true, f.id);
    }
  });

  it("spell extras declare the enemy-usable catalog, never names", () => {
    const casters = WORLD_FEATURES.filter((f) => f.spellSource);
    assert.ok(casters.length >= 1);
    for (const f of casters) {
      assert.equal(f.spellSource, "enemyUsableCatalog", f.id);
      assert.equal(/named spell|if name includes/i.test(f.combatRules), false);
    }
  });

  it("looks up features by id", () => {
    assert.equal(getWorldFeature("WF-HAZ-EMBER_VEIN")?.name, "Ember Vein");
    assert.equal(getWorldFeature("WF-HAZ-SALT_CRUST")?.name, "Salt Crust");
    assert.equal(getWorldFeature("WF-HAZ-NEEDLE_GRASS")?.name, "Needle Grass");
    assert.equal(getWorldFeature("WF-HAZ-FLINT_DUST")?.name, "Flint Dust");
    assert.equal(getWorldFeature("WF-HAZ-GLASS_SHARD")?.name, "Glass Shard");
    assert.equal(getWorldFeature("WF-HAZ-SOOT_LIP")?.name, "Soot Lip");
    assert.equal(getWorldFeature("WF-HAZ-RIME_HEEL")?.name, "Rime Heel");
    assert.equal(getWorldFeature("WF-HAZ-BOG_SILT")?.name, "Bog Silt");
    assert.equal(getWorldFeature("WF-HAZ-LECTERN_ASH")?.name, "Lectern Ash");
    assert.equal(getWorldFeature("WF-HAZ-RETRACE_DUST")?.name, "Retrace Dust");
    assert.equal(getWorldFeature("WF-HAZ-LATE_SEAM")?.name, "Late Seam");
    assert.equal(getWorldFeature("WF-HAZ-BOND_SEAM")?.name, "Bonded Seam");
    assert.equal(getWorldFeature("WF-HAZ-ODD_SEAM")?.name, "Odd Seam");
    assert.equal(getWorldFeature("WF-HAZ-EVEN_SEAM")?.name, "Even Seam");
    assert.equal(getWorldFeature("WF-HAZ-LAST_SEAM")?.name, "Last Seam");
    assert.equal(getWorldFeature("WF-HAZ-SPENT_SEAM")?.name, "Spent Seam");
    assert.equal(getWorldFeature("WF-HAZ-HALE_SEAM")?.name, "Hale Seam");
    assert.equal(getWorldFeature("WF-HAZ-PAIR_SEAM")?.name, "Pair Seam");
    assert.equal(getWorldFeature("WF-HAZ-MATCH_SEAM")?.name, "Match Seam");
    assert.equal(getWorldFeature("WF-HAZ-POISE_SEAM")?.name, "Poise Seam");
    assert.equal(getWorldFeature("missing"), undefined);
  });

  it("keeps wave 2 as an additive catalog, one feature per requested category", () => {
    const wave1 = featuresInCatalogWave(1);
    const wave2 = featuresInCatalogWave(2);
    assert.ok(wave1.length >= 16);
    assert.equal(wave2.length, 16);
    const wave2Cats = new Set(wave2.map((f) => f.category));
    for (const cat of REQUIRED_CATEGORIES) {
      assert.equal(wave2Cats.has(cat), true, `wave 2 missing category ${cat}`);
    }
    for (const f of wave2) {
      assert.equal(featureCatalogWave(f), 2, f.id);
      assert.equal(f.catalogWave, 2, f.id);
    }
  });

  it("keeps wave 3 as an additive catalog, one feature per requested category", () => {
    const wave3 = featuresInCatalogWave(3);
    assert.equal(wave3.length, 16);
    const wave3Cats = new Set(wave3.map((f) => f.category));
    for (const cat of REQUIRED_CATEGORIES) {
      assert.equal(wave3Cats.has(cat), true, `wave 3 missing category ${cat}`);
    }
    for (const f of wave3) {
      assert.equal(featureCatalogWave(f), 3, f.id);
      assert.equal(f.catalogWave, 3, f.id);
    }
    const priorIds = new Set(
      [...featuresInCatalogWave(1), ...featuresInCatalogWave(2)].map(
        (f) => f.id,
      ),
    );
    for (const f of wave3) {
      assert.equal(priorIds.has(f.id), false, `wave 3 reused ${f.id}`);
    }
  });

  it("keeps wave 4 as an additive catalog, one feature per requested category", () => {
    const wave4 = featuresInCatalogWave(4);
    assert.equal(wave4.length, 16);
    const wave4Cats = new Set(wave4.map((f) => f.category));
    for (const cat of REQUIRED_CATEGORIES) {
      assert.equal(wave4Cats.has(cat), true, `wave 4 missing category ${cat}`);
    }
    for (const f of wave4) {
      assert.equal(featureCatalogWave(f), 4, f.id);
      assert.equal(f.catalogWave, 4, f.id);
    }
    const priorIds = new Set(
      [
        ...featuresInCatalogWave(1),
        ...featuresInCatalogWave(2),
        ...featuresInCatalogWave(3),
      ].map((f) => f.id),
    );
    for (const f of wave4) {
      assert.equal(priorIds.has(f.id), false, `wave 4 reused ${f.id}`);
    }
  });

  it("keeps wave 5 as an additive catalog, one feature per requested category", () => {
    const wave5 = featuresInCatalogWave(5);
    assert.equal(wave5.length, 16);
    const wave5Cats = new Set(wave5.map((f) => f.category));
    for (const cat of REQUIRED_CATEGORIES) {
      assert.equal(wave5Cats.has(cat), true, `wave 5 missing category ${cat}`);
    }
    for (const f of wave5) {
      assert.equal(featureCatalogWave(f), 5, f.id);
      assert.equal(f.catalogWave, 5, f.id);
    }
    const priorIds = new Set(
      [
        ...featuresInCatalogWave(1),
        ...featuresInCatalogWave(2),
        ...featuresInCatalogWave(3),
        ...featuresInCatalogWave(4),
      ].map((f) => f.id),
    );
    for (const f of wave5) {
      assert.equal(priorIds.has(f.id), false, `wave 5 reused ${f.id}`);
    }
  });

  it("keeps wave 6 as an additive catalog, one feature per requested category", () => {
    const wave6 = featuresInCatalogWave(6);
    assert.equal(wave6.length, 16);
    const wave6Cats = new Set(wave6.map((f) => f.category));
    for (const cat of REQUIRED_CATEGORIES) {
      assert.equal(wave6Cats.has(cat), true, `wave 6 missing category ${cat}`);
    }
    for (const f of wave6) {
      assert.equal(featureCatalogWave(f), 6, f.id);
      assert.equal(f.catalogWave, 6, f.id);
    }
    const priorIds = new Set(
      [
        ...featuresInCatalogWave(1),
        ...featuresInCatalogWave(2),
        ...featuresInCatalogWave(3),
        ...featuresInCatalogWave(4),
        ...featuresInCatalogWave(5),
      ].map((f) => f.id),
    );
    for (const f of wave6) {
      assert.equal(priorIds.has(f.id), false, `wave 6 reused ${f.id}`);
    }
  });

  it("keeps wave 7 as an additive catalog, one feature per requested category", () => {
    const wave7 = featuresInCatalogWave(7);
    assert.equal(wave7.length, 16);
    const wave7Cats = new Set(wave7.map((f) => f.category));
    for (const cat of REQUIRED_CATEGORIES) {
      assert.equal(wave7Cats.has(cat), true, `wave 7 missing category ${cat}`);
    }
    for (const f of wave7) {
      assert.equal(featureCatalogWave(f), 7, f.id);
      assert.equal(f.catalogWave, 7, f.id);
    }
    const priorIds = new Set(
      [
        ...featuresInCatalogWave(1),
        ...featuresInCatalogWave(2),
        ...featuresInCatalogWave(3),
        ...featuresInCatalogWave(4),
        ...featuresInCatalogWave(5),
        ...featuresInCatalogWave(6),
      ].map((f) => f.id),
    );
    for (const f of wave7) {
      assert.equal(priorIds.has(f.id), false, `wave 7 reused ${f.id}`);
    }
  });

  it("keeps wave 8 as an additive catalog, one feature per requested category", () => {
    const wave8 = featuresInCatalogWave(8);
    assert.equal(wave8.length, 16);
    const wave8Cats = new Set(wave8.map((f) => f.category));
    for (const cat of REQUIRED_CATEGORIES) {
      assert.equal(wave8Cats.has(cat), true, `wave 8 missing category ${cat}`);
    }
    for (const f of wave8) {
      assert.equal(featureCatalogWave(f), 8, f.id);
      assert.equal(f.catalogWave, 8, f.id);
    }
    const priorIds = new Set(
      [
        ...featuresInCatalogWave(1),
        ...featuresInCatalogWave(2),
        ...featuresInCatalogWave(3),
        ...featuresInCatalogWave(4),
        ...featuresInCatalogWave(5),
        ...featuresInCatalogWave(6),
        ...featuresInCatalogWave(7),
      ].map((f) => f.id),
    );
    for (const f of wave8) {
      assert.equal(priorIds.has(f.id), false, `wave 8 reused ${f.id}`);
    }
  });

  it("keeps wave 9 as an additive catalog, one feature per requested category", () => {
    const wave9 = featuresInCatalogWave(9);
    assert.equal(wave9.length, 16);
    const wave9Cats = new Set(wave9.map((f) => f.category));
    for (const cat of REQUIRED_CATEGORIES) {
      assert.equal(wave9Cats.has(cat), true, `wave 9 missing category ${cat}`);
    }
    for (const f of wave9) {
      assert.equal(featureCatalogWave(f), 9, f.id);
      assert.equal(f.catalogWave, 9, f.id);
    }
    const priorIds = new Set(
      [
        ...featuresInCatalogWave(1),
        ...featuresInCatalogWave(2),
        ...featuresInCatalogWave(3),
        ...featuresInCatalogWave(4),
        ...featuresInCatalogWave(5),
        ...featuresInCatalogWave(6),
        ...featuresInCatalogWave(7),
        ...featuresInCatalogWave(8),
      ].map((f) => f.id),
    );
    for (const f of wave9) {
      assert.equal(priorIds.has(f.id), false, `wave 9 reused ${f.id}`);
    }
  });

  it("keeps wave 10 as an additive catalog, one feature per requested category", () => {
    const wave10 = featuresInCatalogWave(10);
    assert.equal(wave10.length, 16);
    const wave10Cats = new Set(wave10.map((f) => f.category));
    for (const cat of REQUIRED_CATEGORIES) {
      assert.equal(
        wave10Cats.has(cat),
        true,
        `wave 10 missing category ${cat}`,
      );
    }
    for (const f of wave10) {
      assert.equal(featureCatalogWave(f), 10, f.id);
      assert.equal(f.catalogWave, 10, f.id);
    }
    const priorIds = new Set(
      [
        ...featuresInCatalogWave(1),
        ...featuresInCatalogWave(2),
        ...featuresInCatalogWave(3),
        ...featuresInCatalogWave(4),
        ...featuresInCatalogWave(5),
        ...featuresInCatalogWave(6),
        ...featuresInCatalogWave(7),
        ...featuresInCatalogWave(8),
        ...featuresInCatalogWave(9),
      ].map((f) => f.id),
    );
    for (const f of wave10) {
      assert.equal(priorIds.has(f.id), false, `wave 10 reused ${f.id}`);
    }
  });

  it("keeps wave 11 as an additive catalog, one feature per requested category", () => {
    const wave11 = featuresInCatalogWave(11);
    assert.equal(wave11.length, 16);
    const wave11Cats = new Set(wave11.map((f) => f.category));
    for (const cat of REQUIRED_CATEGORIES) {
      assert.equal(
        wave11Cats.has(cat),
        true,
        `wave 11 missing category ${cat}`,
      );
    }
    for (const f of wave11) {
      assert.equal(featureCatalogWave(f), 11, f.id);
      assert.equal(f.catalogWave, 11, f.id);
    }
    const priorIds = new Set(
      [
        ...featuresInCatalogWave(1),
        ...featuresInCatalogWave(2),
        ...featuresInCatalogWave(3),
        ...featuresInCatalogWave(4),
        ...featuresInCatalogWave(5),
        ...featuresInCatalogWave(6),
        ...featuresInCatalogWave(7),
        ...featuresInCatalogWave(8),
        ...featuresInCatalogWave(9),
        ...featuresInCatalogWave(10),
      ].map((f) => f.id),
    );
    for (const f of wave11) {
      assert.equal(priorIds.has(f.id), false, `wave 11 reused ${f.id}`);
    }
  });

  it("keeps wave 12 as an additive catalog, one feature per requested category", () => {
    const wave12 = featuresInCatalogWave(12);
    assert.equal(wave12.length, 16);
    const wave12Cats = new Set(wave12.map((f) => f.category));
    for (const cat of REQUIRED_CATEGORIES) {
      assert.equal(
        wave12Cats.has(cat),
        true,
        `wave 12 missing category ${cat}`,
      );
    }
    for (const f of wave12) {
      assert.equal(featureCatalogWave(f), 12, f.id);
      assert.equal(f.catalogWave, 12, f.id);
    }
    const priorIds = new Set(
      [
        ...featuresInCatalogWave(1),
        ...featuresInCatalogWave(2),
        ...featuresInCatalogWave(3),
        ...featuresInCatalogWave(4),
        ...featuresInCatalogWave(5),
        ...featuresInCatalogWave(6),
        ...featuresInCatalogWave(7),
        ...featuresInCatalogWave(8),
        ...featuresInCatalogWave(9),
        ...featuresInCatalogWave(10),
        ...featuresInCatalogWave(11),
      ].map((f) => f.id),
    );
    for (const f of wave12) {
      assert.equal(priorIds.has(f.id), false, `wave 12 reused ${f.id}`);
    }
  });

  it("keeps wave 13 as an additive catalog, one feature per requested category", () => {
    const wave13 = featuresInCatalogWave(13);
    assert.equal(wave13.length, 16);
    const wave13Cats = new Set(wave13.map((f) => f.category));
    for (const cat of REQUIRED_CATEGORIES) {
      assert.equal(
        wave13Cats.has(cat),
        true,
        `wave 13 missing category ${cat}`,
      );
    }
    for (const f of wave13) {
      assert.equal(featureCatalogWave(f), 13, f.id);
      assert.equal(f.catalogWave, 13, f.id);
    }
    const priorIds = new Set(
      [
        ...featuresInCatalogWave(1),
        ...featuresInCatalogWave(2),
        ...featuresInCatalogWave(3),
        ...featuresInCatalogWave(4),
        ...featuresInCatalogWave(5),
        ...featuresInCatalogWave(6),
        ...featuresInCatalogWave(7),
        ...featuresInCatalogWave(8),
        ...featuresInCatalogWave(9),
        ...featuresInCatalogWave(10),
        ...featuresInCatalogWave(11),
        ...featuresInCatalogWave(12),
      ].map((f) => f.id),
    );
    for (const f of wave13) {
      assert.equal(priorIds.has(f.id), false, `wave 13 reused ${f.id}`);
    }
  });

  it("keeps wave 14 as an additive catalog, one feature per requested category", () => {
    const wave14 = featuresInCatalogWave(14);
    assert.equal(wave14.length, 16);
    const wave14Cats = new Set(wave14.map((f) => f.category));
    for (const cat of REQUIRED_CATEGORIES) {
      assert.equal(
        wave14Cats.has(cat),
        true,
        `wave 14 missing category ${cat}`,
      );
    }
    for (const f of wave14) {
      assert.equal(featureCatalogWave(f), 14, f.id);
      assert.equal(f.catalogWave, 14, f.id);
    }
    const priorIds = new Set(
      [
        ...featuresInCatalogWave(1),
        ...featuresInCatalogWave(2),
        ...featuresInCatalogWave(3),
        ...featuresInCatalogWave(4),
        ...featuresInCatalogWave(5),
        ...featuresInCatalogWave(6),
        ...featuresInCatalogWave(7),
        ...featuresInCatalogWave(8),
        ...featuresInCatalogWave(9),
        ...featuresInCatalogWave(10),
        ...featuresInCatalogWave(11),
        ...featuresInCatalogWave(12),
        ...featuresInCatalogWave(13),
      ].map((f) => f.id),
    );
    for (const f of wave14) {
      assert.equal(priorIds.has(f.id), false, `wave 14 reused ${f.id}`);
    }
  });

  it("keeps wave 15 as an additive catalog, one feature per requested category", () => {
    const wave15 = featuresInCatalogWave(15);
    assert.equal(wave15.length, 16);
    const wave15Cats = new Set(wave15.map((f) => f.category));
    for (const cat of REQUIRED_CATEGORIES) {
      assert.equal(
        wave15Cats.has(cat),
        true,
        `wave 15 missing category ${cat}`,
      );
    }
    for (const f of wave15) {
      assert.equal(featureCatalogWave(f), 15, f.id);
      assert.equal(f.catalogWave, 15, f.id);
    }
    const priorIds = new Set(
      [
        ...featuresInCatalogWave(1),
        ...featuresInCatalogWave(2),
        ...featuresInCatalogWave(3),
        ...featuresInCatalogWave(4),
        ...featuresInCatalogWave(5),
        ...featuresInCatalogWave(6),
        ...featuresInCatalogWave(7),
        ...featuresInCatalogWave(8),
        ...featuresInCatalogWave(9),
        ...featuresInCatalogWave(10),
        ...featuresInCatalogWave(11),
        ...featuresInCatalogWave(12),
        ...featuresInCatalogWave(13),
        ...featuresInCatalogWave(14),
      ].map((f) => f.id),
    );
    for (const f of wave15) {
      assert.equal(priorIds.has(f.id), false, `wave 15 reused ${f.id}`);
    }
  });

  it("keeps wave 16 as an additive catalog, one feature per requested category", () => {
    const wave16 = featuresInCatalogWave(16);
    assert.equal(wave16.length, 16);
    const wave16Cats = new Set(wave16.map((f) => f.category));
    for (const cat of REQUIRED_CATEGORIES) {
      assert.equal(
        wave16Cats.has(cat),
        true,
        `wave 16 missing category ${cat}`,
      );
    }
    for (const f of wave16) {
      assert.equal(featureCatalogWave(f), 16, f.id);
      assert.equal(f.catalogWave, 16, f.id);
    }
    const priorIds = new Set(
      [
        ...featuresInCatalogWave(1),
        ...featuresInCatalogWave(2),
        ...featuresInCatalogWave(3),
        ...featuresInCatalogWave(4),
        ...featuresInCatalogWave(5),
        ...featuresInCatalogWave(6),
        ...featuresInCatalogWave(7),
        ...featuresInCatalogWave(8),
        ...featuresInCatalogWave(9),
        ...featuresInCatalogWave(10),
        ...featuresInCatalogWave(11),
        ...featuresInCatalogWave(12),
        ...featuresInCatalogWave(13),
        ...featuresInCatalogWave(14),
        ...featuresInCatalogWave(15),
      ].map((f) => f.id),
    );
    for (const f of wave16) {
      assert.equal(priorIds.has(f.id), false, `wave 16 reused ${f.id}`);
    }
  });

  it("keeps wave 17 as an additive catalog, one feature per requested category", () => {
    const wave17 = featuresInCatalogWave(17);
    assert.equal(wave17.length, 16);
    const wave17Cats = new Set(wave17.map((f) => f.category));
    for (const cat of REQUIRED_CATEGORIES) {
      assert.equal(
        wave17Cats.has(cat),
        true,
        `wave 17 missing category ${cat}`,
      );
    }
    for (const f of wave17) {
      assert.equal(featureCatalogWave(f), 17, f.id);
      assert.equal(f.catalogWave, 17, f.id);
    }
    const priorIds = new Set(
      [
        ...featuresInCatalogWave(1),
        ...featuresInCatalogWave(2),
        ...featuresInCatalogWave(3),
        ...featuresInCatalogWave(4),
        ...featuresInCatalogWave(5),
        ...featuresInCatalogWave(6),
        ...featuresInCatalogWave(7),
        ...featuresInCatalogWave(8),
        ...featuresInCatalogWave(9),
        ...featuresInCatalogWave(10),
        ...featuresInCatalogWave(11),
        ...featuresInCatalogWave(12),
        ...featuresInCatalogWave(13),
        ...featuresInCatalogWave(14),
        ...featuresInCatalogWave(15),
        ...featuresInCatalogWave(16),
      ].map((f) => f.id),
    );
    for (const f of wave17) {
      assert.equal(priorIds.has(f.id), false, `wave 17 reused ${f.id}`);
    }
  });

  it("keeps wave 18 as an additive catalog, one feature per requested category", () => {
    const wave18 = featuresInCatalogWave(18);
    assert.equal(wave18.length, 16);
    const wave18Cats = new Set(wave18.map((f) => f.category));
    for (const cat of REQUIRED_CATEGORIES) {
      assert.equal(
        wave18Cats.has(cat),
        true,
        `wave 18 missing category ${cat}`,
      );
    }
    for (const f of wave18) {
      assert.equal(featureCatalogWave(f), 18, f.id);
      assert.equal(f.catalogWave, 18, f.id);
    }
    const priorIds = new Set(
      [
        ...featuresInCatalogWave(1),
        ...featuresInCatalogWave(2),
        ...featuresInCatalogWave(3),
        ...featuresInCatalogWave(4),
        ...featuresInCatalogWave(5),
        ...featuresInCatalogWave(6),
        ...featuresInCatalogWave(7),
        ...featuresInCatalogWave(8),
        ...featuresInCatalogWave(9),
        ...featuresInCatalogWave(10),
        ...featuresInCatalogWave(11),
        ...featuresInCatalogWave(12),
        ...featuresInCatalogWave(13),
        ...featuresInCatalogWave(14),
        ...featuresInCatalogWave(15),
        ...featuresInCatalogWave(16),
        ...featuresInCatalogWave(17),
      ].map((f) => f.id),
    );
    for (const f of wave18) {
      assert.equal(priorIds.has(f.id), false, `wave 18 reused ${f.id}`);
    }
  });

  it("keeps wave 19 as an additive catalog, one feature per requested category", () => {
    const wave19 = featuresInCatalogWave(19);
    assert.equal(wave19.length, 16);
    const wave19Cats = new Set(wave19.map((f) => f.category));
    for (const cat of REQUIRED_CATEGORIES) {
      assert.equal(
        wave19Cats.has(cat),
        true,
        `wave 19 missing category ${cat}`,
      );
    }
    for (const f of wave19) {
      assert.equal(featureCatalogWave(f), 19, f.id);
      assert.equal(f.catalogWave, 19, f.id);
    }
    const priorIds = new Set(
      [
        ...featuresInCatalogWave(1),
        ...featuresInCatalogWave(2),
        ...featuresInCatalogWave(3),
        ...featuresInCatalogWave(4),
        ...featuresInCatalogWave(5),
        ...featuresInCatalogWave(6),
        ...featuresInCatalogWave(7),
        ...featuresInCatalogWave(8),
        ...featuresInCatalogWave(9),
        ...featuresInCatalogWave(10),
        ...featuresInCatalogWave(11),
        ...featuresInCatalogWave(12),
        ...featuresInCatalogWave(13),
        ...featuresInCatalogWave(14),
        ...featuresInCatalogWave(15),
        ...featuresInCatalogWave(16),
        ...featuresInCatalogWave(17),
        ...featuresInCatalogWave(18),
      ].map((f) => f.id),
    );
    for (const f of wave19) {
      assert.equal(priorIds.has(f.id), false, `wave 19 reused ${f.id}`);
    }
  });

  it("keeps wave 20 as an additive catalog, one feature per requested category", () => {
    assert.equal(LATEST_CATALOG_WAVE, 20);
    const wave20 = featuresInCatalogWave(20);
    assert.equal(wave20.length, 16);
    const wave20Cats = new Set(wave20.map((f) => f.category));
    for (const cat of REQUIRED_CATEGORIES) {
      assert.equal(
        wave20Cats.has(cat),
        true,
        `wave 20 missing category ${cat}`,
      );
    }
    for (const f of wave20) {
      assert.equal(featureCatalogWave(f), 20, f.id);
      assert.equal(f.catalogWave, 20, f.id);
    }
    const priorIds = new Set(
      [
        ...featuresInCatalogWave(1),
        ...featuresInCatalogWave(2),
        ...featuresInCatalogWave(3),
        ...featuresInCatalogWave(4),
        ...featuresInCatalogWave(5),
        ...featuresInCatalogWave(6),
        ...featuresInCatalogWave(7),
        ...featuresInCatalogWave(8),
        ...featuresInCatalogWave(9),
        ...featuresInCatalogWave(10),
        ...featuresInCatalogWave(11),
        ...featuresInCatalogWave(12),
        ...featuresInCatalogWave(13),
        ...featuresInCatalogWave(14),
        ...featuresInCatalogWave(15),
        ...featuresInCatalogWave(16),
        ...featuresInCatalogWave(17),
        ...featuresInCatalogWave(18),
        ...featuresInCatalogWave(19),
      ].map((f) => f.id),
    );
    for (const f of wave20) {
      assert.equal(priorIds.has(f.id), false, `wave 20 reused ${f.id}`);
    }
  });
});

describe("rarity and relative difficulty", () => {
  it("keeps threat and reward ordered by difficulty, not level", () => {
    assert.ok(THREAT_MULT.soft < THREAT_MULT.medium);
    assert.ok(THREAT_MULT.medium < THREAT_MULT.hard);
    assert.ok(THREAT_MULT.hard < THREAT_MULT.extreme);
    assert.ok(REWARD_MULT.soft <= REWARD_MULT.medium);
    assert.ok(REWARD_MULT.medium < REWARD_MULT.hard);
    assert.ok(REWARD_MULT.hard < REWARD_MULT.extreme);
    assert.equal(relativeThreatMultiplier("hard"), 1.35);
    assert.equal(relativeRewardMultiplier("extreme"), 2.5);
  });

  it("scales same-tier stats and rewards without a level argument", () => {
    assert.equal(scaleSameTierStat(100, "soft"), 60);
    assert.equal(scaleSameTierStat(100, "extreme"), 175);
    assert.equal(scaleReward(20, "medium"), 25);
    assert.equal(scaleReward(20, "extreme"), 50);
  });

  it("keeps % max-HP taxes relevant at high HP", () => {
    assert.equal(hpTaxFromMax(100, 0.04), 4);
    assert.equal(hpTaxFromMax(1000, 0.04), 40);
    assert.equal(hpTaxFromMax(10, 0.04), 1);
    assert.equal(hpTaxFromMax(100, -0.08), -8);
    assert.equal(hpTaxFromMax(0, 0.04), 0);
  });
});

describe("run-mode and placement guards", () => {
  it("suppresses every feature in Death Realm", () => {
    for (const f of WORLD_FEATURES) {
      assert.equal(
        isFeatureAllowedInContext(f, { runMode: "deathRealm" }),
        false,
        f.id,
      );
    }
    assert.deepEqual(
      pickWeightedFeatures(() => 0, { runMode: "deathRealm" }),
      [],
    );
  });

  it("keeps flicker gates, gambit chests, echo gates, pilgrim banners, latch gates, wager gates, pact gates, twilight gates, ash gates, hearth gates, wane gates, clean gates, still gates, tally gates, mercy bells, mark gates, incant gates, vow gates, stride gates, near gates, ready gates, match gates, and poise gates out of runs", () => {
    const flicker = getWorldFeature("WF-PRT-FLICKER_GATE");
    const gambit = getWorldFeature("WF-RSK-GAMBIT_CHEST");
    const echo = getWorldFeature("WF-PRT-ECHO_GATE");
    const banners = getWorldFeature("WF-EVT-PILGRIM_BANNERS");
    const latch = getWorldFeature("WF-PRT-LATCH_GATE");
    const wager = getWorldFeature("WF-PRT-WAGER_GATE");
    const pact = getWorldFeature("WF-PRT-PACT_GATE");
    const twilight = getWorldFeature("WF-PRT-TWILIGHT_GATE");
    const ash = getWorldFeature("WF-PRT-ASH_GATE");
    const hearth = getWorldFeature("WF-PRT-HEARTH_GATE");
    const wane = getWorldFeature("WF-PRT-WANE_GATE");
    const clean = getWorldFeature("WF-PRT-CLEAN_GATE");
    const still = getWorldFeature("WF-PRT-STILL_GATE");
    const tally = getWorldFeature("WF-PRT-TALLY_GATE");
    const mercy = getWorldFeature("WF-EVT-MERCY_BELL");
    const mark = getWorldFeature("WF-PRT-MARK_GATE");
    const incant = getWorldFeature("WF-PRT-INCANT_GATE");
    const vow = getWorldFeature("WF-PRT-VOW_GATE");
    const stride = getWorldFeature("WF-PRT-STRIDE_GATE");
    const near = getWorldFeature("WF-PRT-NEAR_GATE");
    const ready = getWorldFeature("WF-PRT-READY_GATE");
    const match = getWorldFeature("WF-PRT-MATCH_GATE");
    const poise = getWorldFeature("WF-PRT-POISE_GATE");
    assert.ok(
      flicker &&
        gambit &&
        echo &&
        banners &&
        latch &&
        wager &&
        pact &&
        twilight &&
        ash &&
        hearth &&
        wane &&
        clean &&
        still &&
        tally &&
        mercy &&
        mark &&
        incant &&
        vow &&
        stride &&
        near &&
        ready &&
        match &&
        poise,
    );
    for (const f of [
      flicker,
      gambit,
      echo,
      banners,
      latch,
      wager,
      pact,
      twilight,
      ash,
      hearth,
      wane,
      clean,
      still,
      tally,
      mercy,
      mark,
      incant,
      vow,
      stride,
      near,
      ready,
      match,
      poise,
    ]) {
      assert.equal(
        isFeatureAllowedInContext(f, { runMode: "dungeon" }),
        false,
        f.id,
      );
      assert.equal(
        isFeatureAllowedInContext(f, { runMode: "bossRush" }),
        false,
        f.id,
      );
      assert.equal(
        isFeatureAllowedInContext(f, { runMode: "none" }),
        true,
        f.id,
      );
    }
  });

  it("reserves spawn radius and portal cells", () => {
    const spawn = { x: 8, y: 8 };
    const portals = [{ x: 2, y: 2 }];
    assert.equal(
      isTileReservedForSpawnOrPortal({ x: 8, y: 8 }, spawn, portals),
      true,
    );
    assert.equal(
      isTileReservedForSpawnOrPortal(
        { x: spawn.x + SPAWN_SAFE_RADIUS, y: spawn.y },
        spawn,
        portals,
      ),
      true,
    );
    assert.equal(
      isTileReservedForSpawnOrPortal({ x: 2, y: 2 }, spawn, portals),
      true,
    );
    assert.equal(
      isTileReservedForSpawnOrPortal({ x: 0, y: 0 }, spawn, portals),
      false,
    );
  });

  it("honors MAX_HAZARD_TILES and MAX_ENEMIES", () => {
    assert.equal(canAddHazardTiles(48, 3), false);
    assert.equal(canAddHazardTiles(47, 3), true);
    assert.equal(canAddHazardTiles(MAX_HAZARD_TILES, 0), true);
    assert.equal(canAddEnemies(19, 2), false);
    assert.equal(canAddEnemies(15, 5), true);
    assert.equal(canAddEnemies(MAX_ENEMIES, 1), false);
  });

  it("rolls extra enemy/hazard counts inside the feature band", () => {
    const warband = getWorldFeature("WF-INV-WARBAND");
    assert.ok(warband);
    const n = extraEnemyRoll(warband, () => 0);
    assert.ok(n >= 3 && n <= 5);
    const ember = getWorldFeature("WF-HAZ-EMBER_VEIN");
    assert.ok(ember);
    const h = extraHazardRoll(ember, () => 0.99);
    assert.ok(h >= 3 && h <= 6);
    const duelist = getWorldFeature("WF-INV-DUELIST_CIRCLE");
    assert.ok(duelist);
    assert.equal(
      extraEnemyRoll(duelist, () => 0.5),
      2,
    );
    const salt = getWorldFeature("WF-HAZ-SALT_CRUST");
    assert.ok(salt);
    const saltHaz = extraHazardRoll(salt, () => 0);
    assert.ok(saltHaz >= 4 && saltHaz <= 8);
    const vanguard = getWorldFeature("WF-INV-SLEEPING_VANGUARD");
    assert.ok(vanguard);
    assert.equal(
      extraEnemyRoll(vanguard, () => 0.5),
      2,
    );
    const needle = getWorldFeature("WF-HAZ-NEEDLE_GRASS");
    assert.ok(needle);
    const needleHaz = extraHazardRoll(needle, () => 0.99);
    assert.ok(needleHaz >= 4 && needleHaz <= 8);
    const phalanx = getWorldFeature("WF-INV-PHALANX_LINE");
    assert.ok(phalanx);
    assert.equal(
      extraEnemyRoll(phalanx, () => 0.5),
      3,
    );
    const flint = getWorldFeature("WF-HAZ-FLINT_DUST");
    assert.ok(flint);
    const flintHaz = extraHazardRoll(flint, () => 0.99);
    assert.ok(flintHaz >= 4 && flintHaz <= 8);
    const host = getWorldFeature("WF-INV-MIRROR_HOST");
    assert.ok(host);
    assert.equal(
      extraEnemyRoll(host, () => 0.5),
      1,
    );
    const glass = getWorldFeature("WF-HAZ-GLASS_SHARD");
    assert.ok(glass);
    const glassHaz = extraHazardRoll(glass, () => 0.99);
    assert.ok(glassHaz >= 4 && glassHaz <= 8);
    const split = getWorldFeature("WF-INV-SPLIT_BANNER");
    assert.ok(split);
    assert.equal(
      extraEnemyRoll(split, () => 0.5),
      2,
    );
    const soot = getWorldFeature("WF-HAZ-SOOT_LIP");
    assert.ok(soot);
    const sootHaz = extraHazardRoll(soot, () => 0.99);
    assert.ok(sootHaz >= 4 && sootHaz <= 8);
    const camp = getWorldFeature("WF-INV-QUIET_CAMP");
    assert.ok(camp);
    assert.equal(
      extraEnemyRoll(camp, () => 0.5),
      3,
    );
    const rime = getWorldFeature("WF-HAZ-RIME_HEEL");
    assert.ok(rime);
    const rimeHaz = extraHazardRoll(rime, () => 0.99);
    assert.ok(rimeHaz >= 4 && rimeHaz <= 8);
    const horn = getWorldFeature("WF-INV-HORN_RELAY");
    assert.ok(horn);
    const hornN = extraEnemyRoll(horn, () => 0.5);
    assert.ok(hornN >= 1 && hornN <= 2);
    const silt = getWorldFeature("WF-HAZ-BOG_SILT");
    assert.ok(silt);
    const siltHaz = extraHazardRoll(silt, () => 0.99);
    assert.ok(siltHaz >= 4 && siltHaz <= 8);
    const heir = getWorldFeature("WF-INV-HEIR_CORDON");
    assert.ok(heir);
    assert.equal(
      extraEnemyRoll(heir, () => 0.5),
      3,
    );
    const lectern = getWorldFeature("WF-HAZ-LECTERN_ASH");
    assert.ok(lectern);
    const lecternHaz = extraHazardRoll(lectern, () => 0.99);
    assert.ok(lecternHaz >= 4 && lecternHaz <= 8);
    const column = getWorldFeature("WF-INV-RETREAT_COLUMN");
    assert.ok(column);
    assert.equal(
      extraEnemyRoll(column, () => 0.5),
      3,
    );
    const retrace = getWorldFeature("WF-HAZ-RETRACE_DUST");
    assert.ok(retrace);
    const retraceHaz = extraHazardRoll(retrace, () => 0.99);
    assert.ok(retraceHaz >= 4 && retraceHaz <= 8);
    const wounded = getWorldFeature("WF-INV-WOUNDED_FILE");
    assert.ok(wounded);
    assert.equal(
      extraEnemyRoll(wounded, () => 0.5),
      2,
    );
    const lateSeam = getWorldFeature("WF-HAZ-LATE_SEAM");
    assert.ok(lateSeam);
    const lateHaz = extraHazardRoll(lateSeam, () => 0.99);
    assert.ok(lateHaz >= 4 && lateHaz <= 8);
    const hollow = getWorldFeature("WF-INV-HOLLOW_FILE");
    assert.ok(hollow);
    const hollowN = extraEnemyRoll(hollow, () => 0.5);
    assert.ok(hollowN >= 4 && hollowN <= 6);
    const bondSeam = getWorldFeature("WF-HAZ-BOND_SEAM");
    assert.ok(bondSeam);
    const bondHaz = extraHazardRoll(bondSeam, () => 0.99);
    assert.ok(bondHaz >= 4 && bondHaz <= 8);
    const paired = getWorldFeature("WF-INV-PAIRED_FILE");
    assert.ok(paired);
    assert.equal(
      extraEnemyRoll(paired, () => 0.5),
      2,
    );
    const oddSeam = getWorldFeature("WF-HAZ-ODD_SEAM");
    assert.ok(oddSeam);
    const oddHaz = extraHazardRoll(oddSeam, () => 0.99);
    assert.ok(oddHaz >= 4 && oddHaz <= 8);
    const gap = getWorldFeature("WF-INV-GAP_FILE");
    assert.ok(gap);
    assert.equal(
      extraEnemyRoll(gap, () => 0.5),
      2,
    );
    const evenSeam = getWorldFeature("WF-HAZ-EVEN_SEAM");
    assert.ok(evenSeam);
    const evenHaz = extraHazardRoll(evenSeam, () => 0.99);
    assert.ok(evenHaz >= 4 && evenHaz <= 8);
    const sheath = getWorldFeature("WF-INV-SHEATH_FILE");
    assert.ok(sheath);
    assert.equal(
      extraEnemyRoll(sheath, () => 0.5),
      2,
    );
    const lastSeam = getWorldFeature("WF-HAZ-LAST_SEAM");
    assert.ok(lastSeam);
    const lastHaz = extraHazardRoll(lastSeam, () => 0.99);
    assert.ok(lastHaz >= 4 && lastHaz <= 8);
    const guard = getWorldFeature("WF-INV-GUARD_FILE");
    assert.ok(guard);
    assert.equal(
      extraEnemyRoll(guard, () => 0.5),
      2,
    );
    const spentSeam = getWorldFeature("WF-HAZ-SPENT_SEAM");
    assert.ok(spentSeam);
    const spentHaz = extraHazardRoll(spentSeam, () => 0.99);
    assert.ok(spentHaz >= 4 && spentHaz <= 8);
    const mute = getWorldFeature("WF-INV-MUTE_FILE");
    assert.ok(mute);
    assert.equal(
      extraEnemyRoll(mute, () => 0.5),
      2,
    );
    const haleSeam = getWorldFeature("WF-HAZ-HALE_SEAM");
    assert.ok(haleSeam);
    const haleHaz = extraHazardRoll(haleSeam, () => 0.99);
    assert.ok(haleHaz >= 4 && haleHaz <= 8);
    const readyFile = getWorldFeature("WF-INV-READY_FILE");
    assert.ok(readyFile);
    assert.equal(
      extraEnemyRoll(readyFile, () => 0.5),
      2,
    );
    const pairSeam = getWorldFeature("WF-HAZ-PAIR_SEAM");
    assert.ok(pairSeam);
    const pairHaz = extraHazardRoll(pairSeam, () => 0.99);
    assert.ok(pairHaz >= 4 && pairHaz <= 8);
    const matchFile = getWorldFeature("WF-INV-MATCH_FILE");
    assert.ok(matchFile);
    assert.equal(
      extraEnemyRoll(matchFile, () => 0.5),
      2,
    );
    const matchSeam = getWorldFeature("WF-HAZ-MATCH_SEAM");
    assert.ok(matchSeam);
    const matchHaz = extraHazardRoll(matchSeam, () => 0.99);
    assert.ok(matchHaz >= 4 && matchHaz <= 8);
    const poiseFile = getWorldFeature("WF-INV-POISE_FILE");
    assert.ok(poiseFile);
    assert.equal(
      extraEnemyRoll(poiseFile, () => 0.5),
      2,
    );
    const poiseSeam = getWorldFeature("WF-HAZ-POISE_SEAM");
    assert.ok(poiseSeam);
    const poiseHaz = extraHazardRoll(poiseSeam, () => 0.99);
    assert.ok(poiseHaz >= 4 && poiseHaz <= 8);
  });
});

describe("pickWeightedFeatures", () => {
  it("never exceeds the readability cap and stays deterministic", () => {
    const a = pickWeightedFeatures(mulberry32(7), { runMode: "none" });
    const b = pickWeightedFeatures(mulberry32(7), { runMode: "none" });
    assert.deepEqual(
      a.map((f) => f.id),
      b.map((f) => f.id),
    );
    assert.ok(a.length <= MAX_ROLLED_FEATURES);
  });

  it("can still surface rare ids across many rarity-weighted rolls", () => {
    const seen = new Set<string>();
    for (let seed = 1; seed <= 2800; seed++) {
      for (const f of pickWeightedFeatures(mulberry32(seed), {
        runMode: "none",
      })) {
        seen.add(f.id);
      }
    }
    assert.ok(seen.size >= 8, `only saw ${seen.size} ids`);
    assert.ok(
      [...seen].some((id) => {
        const f = getWorldFeature(id);
        return f?.rarity === "rare" || f?.rarity === "epic";
      }),
      "rarity weights never produced a rare/epic feature",
    );
    assert.ok(
      [...seen].some((id) => featureCatalogWave(getWorldFeature(id)!) === 2),
      "rarity weights never produced a wave-2 feature",
    );
    assert.ok(
      [...seen].some((id) => featureCatalogWave(getWorldFeature(id)!) === 3),
      "rarity weights never produced a wave-3 feature",
    );
    assert.ok(
      [...seen].some((id) => featureCatalogWave(getWorldFeature(id)!) === 4),
      "rarity weights never produced a wave-4 feature",
    );
    assert.ok(
      [...seen].some((id) => featureCatalogWave(getWorldFeature(id)!) === 5),
      "rarity weights never produced a wave-5 feature",
    );
    assert.ok(
      [...seen].some((id) => featureCatalogWave(getWorldFeature(id)!) === 6),
      "rarity weights never produced a wave-6 feature",
    );
    assert.ok(
      [...seen].some((id) => featureCatalogWave(getWorldFeature(id)!) === 7),
      "rarity weights never produced a wave-7 feature",
    );
    assert.ok(
      [...seen].some((id) => featureCatalogWave(getWorldFeature(id)!) === 8),
      "rarity weights never produced a wave-8 feature",
    );
    assert.ok(
      [...seen].some((id) => featureCatalogWave(getWorldFeature(id)!) === 9),
      "rarity weights never produced a wave-9 feature",
    );
    assert.ok(
      [...seen].some((id) => featureCatalogWave(getWorldFeature(id)!) === 10),
      "rarity weights never produced a wave-10 feature",
    );
    assert.ok(
      [...seen].some((id) => featureCatalogWave(getWorldFeature(id)!) === 11),
      "rarity weights never produced a wave-11 feature",
    );
    assert.ok(
      [...seen].some((id) => featureCatalogWave(getWorldFeature(id)!) === 12),
      "rarity weights never produced a wave-12 feature",
    );
    assert.ok(
      [...seen].some((id) => featureCatalogWave(getWorldFeature(id)!) === 13),
      "rarity weights never produced a wave-13 feature",
    );
    assert.ok(
      [...seen].some((id) => featureCatalogWave(getWorldFeature(id)!) === 14),
      "rarity weights never produced a wave-14 feature",
    );
    assert.ok(
      [...seen].some((id) => featureCatalogWave(getWorldFeature(id)!) === 15),
      "rarity weights never produced a wave-15 feature",
    );
    assert.ok(
      [...seen].some((id) => featureCatalogWave(getWorldFeature(id)!) === 16),
      "rarity weights never produced a wave-16 feature",
    );
    assert.ok(
      [...seen].some((id) => featureCatalogWave(getWorldFeature(id)!) === 17),
      "rarity weights never produced a wave-17 feature",
    );
    assert.ok(
      [...seen].some((id) => featureCatalogWave(getWorldFeature(id)!) === 18),
      "rarity weights never produced a wave-18 feature",
    );
    assert.ok(
      [...seen].some((id) => featureCatalogWave(getWorldFeature(id)!) === 19),
      "rarity weights never produced a wave-19 feature",
    );
    assert.ok(
      [...seen].some((id) => featureCatalogWave(getWorldFeature(id)!) === 20),
      "rarity weights never produced a wave-20 feature",
    );
  });

  it("does not emit run-illegal features inside a dungeon", () => {
    for (let seed = 1; seed <= 80; seed++) {
      const picked = pickWeightedFeatures(mulberry32(seed), {
        runMode: "dungeon",
      });
      for (const f of picked) {
        assert.equal(
          isFeatureAllowedInContext(f, { runMode: "dungeon" }),
          true,
          f.id,
        );
      }
    }
  });
});
