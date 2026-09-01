# ACTION_IDs — 2026-09-01 Telemetry-Driven Balance & Content Analyst

Durable ledger for the Master Technical Director and Report Action Orchestrator.  
Source: Telemetry-Driven Balance & Content Analyst (`2786666f-a4a0-11f1-a7d1-d6b4613131ce`).  
Full report: [`TELEMETRY_BALANCE_2026-09-01.md`](./TELEMETRY_BALANCE_2026-09-01.md).  
This run ships **docs only**. No balance or collector implementation.

---

## Still-open IDs (not re-filed)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| `AQA-2026-08-30-012` | NEW | Smallest persist/victory/recap/shop counters. Still unimplemented at HEAD `dd275aa`. |
| `TBC-2026-08-31-001` | NEW | Keep this analyst gated until real rows exist. Validation from that ID: this report is still `WAITING_FOR_TELEMETRY` with a fresh search. |
| `TBC-2026-08-31-002` | NEW | Human-designed `battle_end` / `spell_cast` / discovery / Doka ledger set. Depends on AQA-012. |

Do not open a second persist-counter PR. Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID.

---

ACTION_ID: TBC-2026-09-01-001  
SOURCE_AUTOMATION: Telemetry-Driven Balance & Content Analyst  
TITLE: Do not treat design docs, longHorizonSim, or debug click-trace as live telemetry  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: After the 2026-08-31 TBC run, `TELEMETRY_ARCHITECTURE_2026-08-31.md`, `TELEMETRY_DASHBOARD_2026-08-31.md`, and `longHorizonSim.ts` landed. Architecture/dashboard texts state they are design-only and that increment APIs are unimplemented. `longHorizonSim.ts` 432–437 sets `telemetry.available: false`; `longHorizonSim.test.ts` asserts that. `clickTrace.ts` is DEV-only (capacity 20, local). `src/backend` still has no `recordTelemetryIncrements`. Open collector PRs: 0.  
SYSTEMS_AFFECTED: Master Technical Director priority queue; Quality Auditor / Game Balance specialists; this analyst’s next cron  
RECOMMENDED_ACTION: When scoring or scheduling 2026-09-01 work, classify those artifacts as DESIGN / SYNTHETIC / DEBUG. Do not open enemy, spell, XP, or Doka retune PRs from them. Leave TBC in WAITING_FOR_TELEMETRY until collectors 1–9 exist and ≥1 UTC day of rows is queryable.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None  
REGRESSION_RISK: LOW (documentation / priority hygiene only).  
VALIDATION_REQUIRED: Next director or TBC run either still cites WAITING_FOR_TELEMETRY, or cites real event counts with sample sizes — not sim output.  
STATUS: NEW
# ACTION_IDs — 2026-09-01 Long-Horizon Infinite Progression Simulator
Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Long-Horizon Infinite Progression Simulator.  
Narrative: [`LONG_HORIZON_2026-09-01.md`](./LONG_HORIZON_2026-09-01.md).  
Harness: `src/frontend/src/utils/longHorizonSim.ts`.
Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **observation only** — no curve redesign.
Prior IDs `LHIPS-2026-08-31-001..014` remain NEW. This file adds IDs only where formulas moved or a new failure became visible.
ACTION_ID: LHIPS-2026-09-01-001  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: HUD XP threshold saturates at MAX_SAFE_INTEGER from level 48  
CATEGORY: technical  
PRIORITY: P0  
EVIDENCE: `xpForNextLevel` (`src/frontend/src/utils/xpCurve.ts` 32–36) returns `Number.MAX_SAFE_INTEGER` once `100n * (1n << (N-1))` exceeds `2^53-1`. First saturation is level 48 (exact need `1.407e16`; HUD shows `9.007e15`). Recap `needed` uses the same helper (`recapXpAfterGrant` 91–101; `WorldExploration.tsx` 13014–13027, 7505). Persist math stays exact via `xpThresholdBigInt` (24–26) and Motoko `100 * pow2(level-1)` (`main.mo` 1808–1812). `applyXpDelta(0, 48, 1)` stays `{ newXp: 1, newLevel: 48 }`. `Number(ok.newXp)` / `Number(ok.newLevel)` still coerce canister `Nat` (`applyRewardsResult.ts` 28–31). IEEE Infinity of the raw float `100 * 2^(N-1)` still appears at 1019 (`xpNeedExactAsNumber(1019)` is not finite); HUD no longer reports Infinity.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: 48 (HUD lie); 1019 (exact Number overflow). Unreachable by official kill/portal/challenge income (see LHIPS-2026-08-31-001).  
CAUSE: HUD path was switched from raw Number (Infinity at 1019) to bigint-then-saturate so bars never become NaN. Saturation is earlier than the old hard stop and disagrees with persist.  
PLAYER_EFFECT: A synthetic or legacy level-48+ character sees a leftover bar against 9.01e15 while the canister still requires 1.41e16. Percent fill is permanently wrong. Official play hits the XP wall at 15–22 first.  
TECHNICAL_EFFECT: Frontend/backend leftover-need twins diverge at 48. `JSON.stringify` of HUD need is a safe integer, not `null`.  
SYSTEMS_AFFECTED: xpCurve.xpForNextLevel, recapXpAfterGrant, PostBattleRecap, leftover HUD, readApplyRewardsOk  
RECOMMENDED_ACTION: Do not retune the curve. If a human wants a truthful bar at 48+, format leftover/need as decimal text or bigint and stop saturating `xpForNextLevel`. Keep persist on `xpThresholdBigInt` / Motoko `Nat`.  
DEPENDENCIES: LHIPS-2026-08-31-001; supersedes the Infinity-at-1019 display claim in LHIPS-2026-08-31-002  
REGRESSION_RISK: HIGH — leftover HUD and recap already had an off-by-one that blocked level-ups.  
VALIDATION_REQUIRED: `xpForNextLevel(47) < MAX_SAFE_INTEGER`; `xpForNextLevel(48) === MAX_SAFE_INTEGER`; recap `needed` at 48 vs `Number(xpThresholdBigInt(48))`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  
ACTION_ID: LHIPS-2026-09-01-002  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: applyRewards 100k/500k ceilings truncate official jackpot and stacked boss XP  
CATEGORY: economy  
PRIORITY: P0  
EVIDENCE: Canister rejects `dokaDelta > 100_000` and `xpDelta > 500_000` (`src/backend/main.mo` 1798–1799). Official client clamps before the call (`applyRewardsResult.ts` 46–61). Victory Doka still rolls `roll < 0.0001` × uniform `1..1e9` × `enemy.level` (`WorldExploration.tsx` 12951–12977; comment still says 0.0001%). Mean unclamped jackpot at enemy 1 is `5.5e9`; persist if hit is **100_000** at every simulated level. Recap now shows the clamped pair (13010–13027) — the old `(level)*100` leftover lie is gone. Stacked official XP `3 * L * 20 * 6 * 1.5` (Enthroned Void `rewardXpMultiplier` 6 at `bossDefaults.ts` 755, plus XP boost 1.5 at WX 12937–12940) exceeds 500_000 from enemy **926**; at the 1020 spawn cap that stack is 550_800 → persist 500_000. Dungeon ×4 applies to Doka only on this path (`PREAPPLIED_REWARD_MULTIPLIER`, WX 13109).  
FIRST_APPROXIMATE_PROBLEM_LEVEL: 1 (every jackpot hit is truncated); 926 (Void + XP-boost XP clamp)  
CAUSE: Per-call mint guard was added so a raw client cannot Nat-max. Official jackpot and the top boss+boost stack were not resized to fit.  
PLAYER_EFFECT: Jackpot is a 100k ticket, not a billion-mint. Late Void+boost victories silently lose ~50k XP versus the unclamped formula. Recap matches persist (clamped). Mid-rare Doka bands at high enemy level also saturate the 100k fight cap.  
TECHNICAL_EFFECT: Wallet inflation is ceilinged at 100k Doka per `applyRewards` call. `Number(enemy.level * 1e9)` stays inside `MAX_SAFE` because enemy level caps near 1020.  
SYSTEMS_AFFECTED: main.mo applyRewards, clampApplyRewardsDeltas, handleBattleEnd Doka table, PostBattleRecap  
RECOMMENDED_ACTION: Report only. Do not retune jackpot or the ceiling here. If a human picks this ID, either shrink the jackpot table to fit 100k or raise the official-client ceiling to the documented max official stack — not both independently.  
DEPENDENCIES: LHIPS-2026-08-31-012 (jackpot table unchanged; persist contract moved)  
REGRESSION_RISK: HIGH — unclamping re-opens the reject-whole-call bug the ceiling fixed; shrinking jackpot changes the wallet.  
VALIDATION_REQUIRED: `clampApplyRewardsDeltas(1e12, 550800)` → `{ 100000, 500000 }`; recap `dokaEarned` after a jackpot fixture; Void+boost XP at enemy 926 vs 925.  
STATUS: NEW  
ACTION_ID: LHIPS-2026-09-01-003  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Formula AP/MP exceed silent saveBattleStats clamp of 20 at level 325  
CATEGORY: technical  
PRIORITY: P1  
EVIDENCE: Battle AP/MP init uses `getPlayerBaseStats` (`progression.ts` 71–72, `WorldExploration.tsx` 12669–12680): `8 + floor(L/25)` / `4 + floor(L/25)`. First AP 21 at level 325. `saveBattleStats` writes `safeAp/safeMp = _minNat(..., 20)` (`main.mo` 1734–1735) and **cannot raise** level (`writeLevel` 1769). `updateCharacter` is cosmetics-only (422–425). Debug already warns when persisted AP/MP diverge from formula (WX 12681–12688). Spell fail hits 0 at 201 (WX 3664–3668). Spell range saturates at `maxSpellRange` 5 by the teens (3671–3682).  
FIRST_APPROXIMATE_PROBLEM_LEVEL: 201 (fail=0); 325 (AP persist clamp)  
CAUSE: Persist validators and the live formula were not updated together. The old unconstrained `saveBattleStats.level` skip is closed; the AP/MP cap was converted from reject to silent clamp.  
PLAYER_EFFECT: A 325+ character fights with AP 21+ and stores 20. Next battle still uses the formula, so play is not stuck at 20 — only the persisted snapshot is wrong. Fail chance and range stop being progression knobs much earlier. Extreme levels are no longer reachable via heal/death persist.  
TECHNICAL_EFFECT: Official-client trust on `saveBattleStats.level` as a skip path is gone. Synthetic 1000/2500 rows now require `applyRewards` grinding (blocked by 001) or legacy canister rows.  
SYSTEMS_AFFECTED: saveBattleStats, getPlayerBaseStats, battle AP init, spell fail/range  
RECOMMENDED_ACTION: Architecture decision, not a silent raise of the 20 cap. Do not implement here.  
DEPENDENCIES: LHIPS-2026-08-31-013 (level-skip claim closed; AP remainder remains)  
REGRESSION_RISK: HIGH if the 20 cap is lifted without a paired Motoko + battle-init update.  
VALIDATION_REQUIRED: formula AP at 300/325; saveBattleStats of maxAp 21 stores 20; battle init at 325 still 21.  
STATUS: NEW  
ACTION_ID: LHIPS-2026-09-01-004  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Leftover XP is unbounded Nat; frontend Number and Motoko pow2 do not scale  
CATEGORY: technical  
PRIORITY: P1  
EVIDENCE: After the practical wall, leftover XP grows by official deltas and never wraps (`applyRewards` 1803–1818). Frontend `readApplyRewardsOk` does `Number(ok.newXp)` (`applyRewardsResult.ts` 28–31); `toNatXp` re-floors that Number (`xpCurve.ts` 19–21). Integers above `2^53` are not exact. Motoko `pow2(n)` is a `while (i < n) { r *= 2 }` on **every** applyRewards call (1808–1808) using `n = level-1`. `xpDelta` is now ≤ 500_000 so the wrap loop cannot run away, but computing `2^(level-1)` at a stored high level is O(level) multiplies of a growing Nat. `applyXpDelta` also stops after 100_000 wraps (`xpCurve.ts` 58–63). Death penalty 20% leftover uses `Number()` (`deathPenalty.ts` 95–103).  
FIRST_APPROXIMATE_PROBLEM_LEVEL: leftover `> 2^53` (precision); stored level thousands+ (pow2 trap). Official leftover at 19 is ~26e6 need / ~1k per fight — precision is far.  
CAUSE: Persist lock closed the skip-to-1018 path; leftover Nat and the pow2 helper were not given a size/iteration guard for synthetic or legacy high levels.  
PLAYER_EFFECT: Official players at the wall see leftover climb forever with a truthful-looking bar until 48. A legacy high-level row can instruction-trap `applyRewards` on the next portal +10.  
TECHNICAL_EFFECT: Frontend/backend leftover disagreement; possible Motoko instruction trap; death 20% of a rounded leftover.  
SYSTEMS_AFFECTED: applyRewards pow2, readApplyRewardsOk, applyXpDelta maxSteps, deathPenalty Number()  
RECOMMENDED_ACTION: Add an iteration/size guard on Motoko `xpToAdvance` without changing the published curve. Keep leftover as Nat/bigint on the HUD persist path. Do not implement here.  
DEPENDENCIES: LHIPS-2026-09-01-001; LHIPS-2026-08-31-002  
REGRESSION_RISK: HIGH — persist funnel.  
VALIDATION_REQUIRED: `Number` round-trip of leftover `2^53+1`; pow2(level-1) cost at 1 / 100 / 10000 (test-only, do not deploy a 10000-level row).  
STATUS: NEW  
