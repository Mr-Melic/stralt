# ACTION_IDs — 2026-09-26 World Dynamics Designer

Durable ledger for implementers.  
Source: World Events & Environmental Evolution Designer (`62dfc3fc-a494-11f1-a7d1-d6b4613131ce`).  
Contract: [`docs/WORLD_DYNAMICS.md`](../WORLD_DYNAMICS.md) + `src/frontend/src/engine/worldFeatures.ts`.

Prior IDs (still `DESIGNED`, do not re-issue): `WDD-2026-08-31-001`, `WDD-2026-09-01-001`, `WDD-2026-09-02-001`, `WDD-2026-09-21-001`, `WDD-2026-09-22-001`, `WDD-2026-09-23-001`, `WDD-2026-09-24-001`, `WDD-2026-09-25-001`.  
Do not fork a second catalog. Extend `WORLD_FEATURES`. Do not wire into `mapGen.ts`, RAF, turn logic, or damage math unless a human/orchestrator picks an ID below.

This run ships **catalog data + tests + docs only**. Wave 4 (`WDD-2026-09-21-001`, PR #344), wave 5 (`WDD-2026-09-22-001`, PR #399), wave 6 (`WDD-2026-09-23-001`, PR #454), wave 7 (`WDD-2026-09-24-001`, PR #503), and wave 8 (`WDD-2026-09-25-001`, PR #578) are still open — this catalog **unions** that file set and adds wave 9 on top.

---

ACTION_ID: WDD-2026-09-26-001  
SOURCE_AUTOMATION: World Events & Environmental Evolution Designer (62dfc3fc-a494-11f1-a7d1-d6b4613131ce)  
TITLE: Wave-9 world feature catalog for indefinite variation  
EVIDENCE: Waves 1–8 (`WDD-2026-08-31-001`, `WDD-2026-09-01-001`, `WDD-2026-09-02-001`, `WDD-2026-09-21-001`, `WDD-2026-09-22-001`, `WDD-2026-09-23-001`, `WDD-2026-09-24-001`, `WDD-2026-09-25-001`) are designed ids in `engine/worldFeatures.ts`. Long sessions still re-roll lava / ice / spikes and the live two-roll modifier pair; waves 1–8 become the new “same shape” after enough maps. Wave 9 adds 16 new ids (one per requested category) that do not clone waves 1–8, lava/ice/spikes, or the 22 live `EXISTING_MAP_MODIFIER_IDS`. Rarity weights and relative difficulty versus same-tier content — no level cutoffs. Distinct seams: spell-from-tile tax (not Flint Dust AP or Bog Silt MP), 2-tile skip hop on a 5-tile line (not square/orbit/pendulum/plus/lane/bar), camp-without-leaving plate (inverse Leave Bell), 1 AP walk-block ↔ LoS-block tilt (not static Reed/Frost), HP-to-open sill (not 1 AP Coin or free Latch), standing anti-knockback (not RES/linear), 1-tile right-of-facing step (not backstep or 2-forward kick), ≤30% HP extra portal (inverse Hearth, distinct from ≥50% Wager), heir+minions vanish-or-clear (not three equal elites), 3-tile proximity picket (not round parity), walk-then-open cache (inverse Trip Cache), death-tile one-cast glyph (not auto-grant), must-walk wager (inverse Stillness), minRange floor 2 (not maxRange −1), win-on-round-4+ event (inverse Swift March), LoS-to-you tax (not two-body LoS or wall adjacency).  
RECOMMENDED_ACTION: Keep `docs/WORLD_DYNAMICS.md` + `engine/worldFeatures.ts` as the contract. A later implementer may add a post-`finalizePlayableLayout` overlay that calls `pickWeightedFeatures`, then re-runs `evaluateSolvability`. Credits stay on `applyRewards`. Hazard HP stays on challenge recorders. Do not add level cutoffs. Death Realm stays quiet. Flicker Gate, Gambit Chest, Echo Gate, Pilgrim Banners, Latch Gate, Wager Gate, Pact Gate, Twilight Gate, Ash Gate, Hearth Gate, and Wane Gate stay exploration-only. Toll Keeper toll-to-pass and Cart Guard departure stay exploration-only; in dungeon / boss rush those elites are required for map-clear. Sleeping Vanguard, Duelist Circle, Phalanx Line, Leash Warden, Mirror Host, Drift Sentinel, Split Banner, Still Watch, Quiet Camp, Even Picket, Horn Relay, Odd Picket, Heir Cordon, and Near Picket elites count as hostiles for run map-clear.  
DEPENDENCIES: WDD-2026-08-31-001 (wave 1); WDD-2026-09-01-001 (wave 2); WDD-2026-09-02-001 (wave 3); WDD-2026-09-21-001 (wave 4, PR #344); WDD-2026-09-22-001 (wave 5, PR #399); WDD-2026-09-23-001 (wave 6, PR #454); WDD-2026-09-24-001 (wave 7, PR #503); WDD-2026-09-25-001 (wave 8, PR #578)  
REGRESSION_RISK: LOW while unwired. HIGH if placed inside `mapGen.ts` or `WorldExploration.tsx` without a solvability re-check.  
VALIDATION_REQUIRED: Catalog tests in `worldFeatures.test.ts` stay green. Wave 9 covers every category. No feature id collides with `EXISTING_MAP_MODIFIER_IDS` or prior `WF-*` ids. Death Realm rolls stay empty. Wane Gate is illegal in dungeon / boss rush.  
STATUS: DESIGNED
