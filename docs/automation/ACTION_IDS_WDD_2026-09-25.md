# ACTION_IDs — 2026-09-25 World Dynamics Designer

Durable ledger for implementers.  
Source: World Events & Environmental Evolution Designer (`62dfc3fc-a494-11f1-a7d1-d6b4613131ce`).  
Contract: [`docs/WORLD_DYNAMICS.md`](../WORLD_DYNAMICS.md) + `src/frontend/src/engine/worldFeatures.ts`.

Prior IDs (still `DESIGNED`, do not re-issue): `WDD-2026-08-31-001`, `WDD-2026-09-01-001`, `WDD-2026-09-02-001`, `WDD-2026-09-21-001`, `WDD-2026-09-22-001`, `WDD-2026-09-23-001`, `WDD-2026-09-24-001`.  
Do not fork a second catalog. Extend `WORLD_FEATURES`. Do not wire into `mapGen.ts`, RAF, turn logic, or damage math unless a human/orchestrator picks an ID below.

This run ships **catalog data + tests + docs only**. Wave 4 (`WDD-2026-09-21-001`, PR #344), wave 5 (`WDD-2026-09-22-001`, PR #399), wave 6 (`WDD-2026-09-23-001`, PR #454), and wave 7 (`WDD-2026-09-24-001`, PR #503) are still open — this catalog **unions** that file set and adds wave 8 on top.

---

ACTION_ID: WDD-2026-09-25-001  
SOURCE_AUTOMATION: World Events & Environmental Evolution Designer (62dfc3fc-a494-11f1-a7d1-d6b4613131ce)  
TITLE: Wave-8 world feature catalog for indefinite variation  
EVIDENCE: Waves 1–7 (`WDD-2026-08-31-001`, `WDD-2026-09-01-001`, `WDD-2026-09-02-001`, `WDD-2026-09-21-001`, `WDD-2026-09-22-001`, `WDD-2026-09-23-001`, `WDD-2026-09-24-001`) are designed ids in `engine/worldFeatures.ts`. Long sessions still re-roll lava / ice / spikes and the live two-roll modifier pair; waves 1–7 become the new “same shape” after enough maps. Wave 8 adds 16 new ids (one per requested category) that do not clone waves 1–7, lava/ice/spikes, or the 22 live `EXISTING_MAP_MODIFIER_IDS`. Rarity weights and relative difficulty versus same-tier content — no level cutoffs. Distinct seams: MP-from-silt tax (inverse Flint Dust AP), clockwise plus turnstile (not square/orbit/pendulum/ratchet/lane/swap/windrow), 2+ AP weary plate (inverse Idle Pin), no-damage LoS crate (not barrel/sandbag), 1 AP coin-unlatch sill (not free end-turn Latch Sill), standing linear +15% (not Keen Edge Attack Nearest), 1-tile backstep (not 2-forward kick or file slide), full-HP hearth extra portal (not ≥50% Wager or fight-then Ash), wait-or-fight horn relay (not leave/weaken), odd-round picket (inverse Even Picket), below-50% wound cache (not isolation/HP-pay), silence-without-gain vow keeper (not steal/hush-on-death), keep-a-summon wager (inverse Solo Oath), linear −1 range (inverse Echoing Halls), paid-AP-spell event (inverse Steel Hour), MP-spend gale tax (inverse Stagnant Haze).  
RECOMMENDED_ACTION: Keep `docs/WORLD_DYNAMICS.md` + `engine/worldFeatures.ts` as the contract. A later implementer may add a post-`finalizePlayableLayout` overlay that calls `pickWeightedFeatures`, then re-runs `evaluateSolvability`. Credits stay on `applyRewards`. Hazard HP stays on challenge recorders. Do not add level cutoffs. Death Realm stays quiet. Flicker Gate, Gambit Chest, Echo Gate, Pilgrim Banners, Latch Gate, Wager Gate, Pact Gate, Twilight Gate, Ash Gate, and Hearth Gate stay exploration-only. Toll Keeper toll-to-pass and Cart Guard departure stay exploration-only; in dungeon / boss rush those elites are required for map-clear. Sleeping Vanguard, Duelist Circle, Phalanx Line, Leash Warden, Mirror Host, Drift Sentinel, Split Banner, Still Watch, Quiet Camp, Even Picket, Horn Relay, and Odd Picket elites count as hostiles for run map-clear.  
DEPENDENCIES: WDD-2026-08-31-001 (wave 1); WDD-2026-09-01-001 (wave 2); WDD-2026-09-02-001 (wave 3); WDD-2026-09-21-001 (wave 4, PR #344); WDD-2026-09-22-001 (wave 5, PR #399); WDD-2026-09-23-001 (wave 6, PR #454); WDD-2026-09-24-001 (wave 7, PR #503)  
REGRESSION_RISK: LOW while unwired. HIGH if placed inside `mapGen.ts` or `WorldExploration.tsx` without a solvability re-check.  
VALIDATION_REQUIRED: Catalog tests in `worldFeatures.test.ts` stay green. Wave 8 covers every category. No feature id collides with `EXISTING_MAP_MODIFIER_IDS` or prior `WF-*` ids. Death Realm rolls stay empty. Hearth Gate is illegal in dungeon / boss rush.  
STATUS: DESIGNED
