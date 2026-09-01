# ACTION_IDs — 2026-09-01

ACTION_ID: WDD-2026-09-01-001  
SOURCE_AUTOMATION: World Dynamics Designer (62dfc3fc-a494-11f1-a7d1-d6b4613131ce)  
TITLE: Wave-2 world feature catalog for indefinite variation  
CATEGORY: design  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Wave 1 (`WDD-2026-08-31-001`) is 18 designed ids in `engine/worldFeatures.ts`. Long sessions still re-roll the same lava / ice / spikes tints and the same two-roll live-modifier pair. Wave 2 adds 16 new ids (one per requested category) that do not clone wave 1, lava/ice/spikes, or the 22 live `EXISTING_MAP_MODIFIER_IDS`.  
RECOMMENDED_ACTION: Keep `docs/WORLD_DYNAMICS.md` + `engine/worldFeatures.ts` as the contract. A later implementer may add a post-`finalizePlayableLayout` overlay that calls `pickWeightedFeatures`, then re-runs `evaluateSolvability`. Credits stay on `applyRewards`. Do not add level cutoffs. Death Realm stays quiet. Flicker Gate, Gambit Chest, Echo Gate, and Pilgrim Banners stay exploration-only.  
DEPENDENCIES: WDD-2026-08-31-001 (wave 1 catalog)  
REGRESSION_RISK: LOW while unwired. HIGH if placed inside `mapGen.ts` or `WorldExploration.tsx` without a solvability re-check.  
VALIDATION_REQUIRED: Catalog tests in `worldFeatures.test.ts` stay green. Wave 2 covers every category. No feature id collides with `EXISTING_MAP_MODIFIER_IDS`. Death Realm rolls stay empty.  
STATUS: DESIGNED
