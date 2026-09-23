# ACTION_IDs — 2026-09-21 World Dynamics Designer

Durable ledger for implementers.  
Source: World Events & Environmental Evolution Designer (`62dfc3fc-a494-11f1-a7d1-d6b4613131ce`).  
Contract: [`docs/WORLD_DYNAMICS.md`](../WORLD_DYNAMICS.md) + `src/frontend/src/engine/worldFeatures.ts`.

Prior IDs (still `DESIGNED`, do not re-issue): `WDD-2026-08-31-001`, `WDD-2026-09-01-001`, `WDD-2026-09-02-001`.  
Do not fork a second catalog. Extend `WORLD_FEATURES`. Do not wire into `mapGen.ts`, RAF, turn logic, or damage math unless a human/orchestrator picks an ID below.

This run ships **catalog data + tests + docs only**.

---

ACTION_ID: WDD-2026-09-21-001  
SOURCE_AUTOMATION: World Events & Environmental Evolution Designer (62dfc3fc-a494-11f1-a7d1-d6b4613131ce)  
TITLE: Wave-4 world feature catalog for indefinite variation  
EVIDENCE: Waves 1–3 (`WDD-2026-08-31-001`, `WDD-2026-09-01-001`, `WDD-2026-09-02-001`) are designed ids in `engine/worldFeatures.ts`. Long sessions still re-roll lava / ice / spikes and the live two-roll modifier pair; waves 1–3 become the new “same shape” after enough maps. Wave 4 adds 16 new ids (one per requested category) that do not clone waves 1–3, lava/ice/spikes, or the 22 live `EXISTING_MAP_MODIFIER_IDS`. Rarity weights and relative difficulty versus same-tier content — no level cutoffs. Distinct seams: AP-spend flint tax (not step/end-turn), pendulum reverse line (not chase/orbit/one-way), delayed fuse, walk-block with open LoS, time-to-wall arch, linear-only veil, nearest-unit swap, HP-wager extra portal, three-elite phalanx, leashed elite, wait-or-open cache, copy-last-cast scribe, repeating tithe, AP≥3 MP tax, no-heal lent, plant-tax haze.  
RECOMMENDED_ACTION: Keep `docs/WORLD_DYNAMICS.md` + `engine/worldFeatures.ts` as the contract. A later implementer may add a post-`finalizePlayableLayout` overlay that calls `pickWeightedFeatures`, then re-runs `evaluateSolvability`. Credits stay on `applyRewards`. Hazard HP stays on challenge recorders. Do not add level cutoffs. Death Realm stays quiet. Flicker Gate, Gambit Chest, Echo Gate, Pilgrim Banners, Latch Gate, and Wager Gate stay exploration-only. Toll Keeper toll-to-pass and Cart Guard departure stay exploration-only; in dungeon / boss rush those elites are required for map-clear. Sleeping Vanguard, Duelist Circle, Phalanx Line, and Leash Warden elites count as hostiles for run map-clear.  
DEPENDENCIES: WDD-2026-08-31-001 (wave 1 catalog); WDD-2026-09-01-001 (wave 2 catalog); WDD-2026-09-02-001 (wave 3 catalog)  
REGRESSION_RISK: LOW while unwired. HIGH if placed inside `mapGen.ts` or `WorldExploration.tsx` without a solvability re-check.  
VALIDATION_REQUIRED: Catalog tests in `worldFeatures.test.ts` stay green. Wave 4 covers every category. No feature id collides with `EXISTING_MAP_MODIFIER_IDS` or prior `WF-*` ids. Death Realm rolls stay empty. Wager Gate is illegal in dungeon / boss rush.  
STATUS: DESIGNED
