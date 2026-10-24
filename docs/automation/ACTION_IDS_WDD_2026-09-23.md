# ACTION_IDs — 2026-09-23 World Dynamics Designer

Durable ledger for implementers.  
Source: World Events & Environmental Evolution Designer (`62dfc3fc-a494-11f1-a7d1-d6b4613131ce`).  
Contract: [`docs/WORLD_DYNAMICS.md`](../WORLD_DYNAMICS.md) + `src/frontend/src/engine/worldFeatures.ts`.

Prior IDs (still `DESIGNED`, do not re-issue): `WDD-2026-08-31-001`, `WDD-2026-09-01-001`, `WDD-2026-09-02-001`, `WDD-2026-09-21-001`, `WDD-2026-09-22-001`.  
Do not fork a second catalog. Extend `WORLD_FEATURES`. Do not wire into `mapGen.ts`, RAF, turn logic, or damage math unless a human/orchestrator picks an ID below.

This run ships **catalog data + tests + docs only**. Wave 4 (`WDD-2026-09-21-001`, PR #344) and wave 5 (`WDD-2026-09-22-001`, PR #399) are still open — this catalog **unions** that file set and adds wave 6 on top.

---

ACTION_ID: WDD-2026-09-23-001  
SOURCE_AUTOMATION: World Events & Environmental Evolution Designer (62dfc3fc-a494-11f1-a7d1-d6b4613131ce)  
TITLE: Wave-6 world feature catalog for indefinite variation  
EVIDENCE: Waves 1–5 (`WDD-2026-08-31-001`, `WDD-2026-09-01-001`, `WDD-2026-09-02-001`, `WDD-2026-09-21-001`, `WDD-2026-09-22-001`) are designed ids in `engine/worldFeatures.ts`. Long sessions still re-roll lava / ice / spikes and the live two-roll modifier pair; waves 1–5 become the new “same shape” after enough maps. Wave 6 adds 16 new ids (one per requested category) that do not clone waves 1–5, lava/ice/spikes, or the 22 live `EXISTING_MAP_MODIFIER_IDS`. Rarity weights and relative difficulty versus same-tier content — no level cutoffs. Distinct seams: start-of-turn soot tax (not step/end-turn/AP/dump), opposite-orb swap (not chase/orbit/pendulum/ratchet/lane), leave-trigger bell, light-then-blast pyre, one-round mercy window, post-formula incoming pulse (not RES), facing 2-tile kick, even-round extra portal, two independent distant elites, stationary facing-cone watch, open-before-MP cache, hush-on-kill bearer, cash-out-low-HP wager, 0-MP→1-MP tight grip, round-1-win event, LoS-to-two-bodies tax.  
RECOMMENDED_ACTION: Keep `docs/WORLD_DYNAMICS.md` + `engine/worldFeatures.ts` as the contract. A later implementer may add a post-`finalizePlayableLayout` overlay that calls `pickWeightedFeatures`, then re-runs `evaluateSolvability`. Credits stay on `applyRewards`. Hazard HP stays on challenge recorders. Do not add level cutoffs. Death Realm stays quiet. Flicker Gate, Gambit Chest, Echo Gate, Pilgrim Banners, Latch Gate, Wager Gate, Pact Gate, and Twilight Gate stay exploration-only. Toll Keeper toll-to-pass and Cart Guard departure stay exploration-only; in dungeon / boss rush those elites are required for map-clear. Sleeping Vanguard, Duelist Circle, Phalanx Line, Leash Warden, Mirror Host, Drift Sentinel, Split Banner, and Still Watch elites count as hostiles for run map-clear.  
DEPENDENCIES: WDD-2026-08-31-001 (wave 1); WDD-2026-09-01-001 (wave 2); WDD-2026-09-02-001 (wave 3); WDD-2026-09-21-001 (wave 4, PR #344); WDD-2026-09-22-001 (wave 5, PR #399)  
REGRESSION_RISK: LOW while unwired. HIGH if placed inside `mapGen.ts` or `WorldExploration.tsx` without a solvability re-check.  
VALIDATION_REQUIRED: Catalog tests in `worldFeatures.test.ts` stay green. Wave 6 covers every category. No feature id collides with `EXISTING_MAP_MODIFIER_IDS` or prior `WF-*` ids. Death Realm rolls stay empty. Twilight Gate is illegal in dungeon / boss rush.  
STATUS: DESIGNED
