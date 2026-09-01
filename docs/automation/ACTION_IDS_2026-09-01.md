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
# ACTION_IDs — 2026-09-01 Master Technical Director
Durable director ledger. Reuse existing IDs. Do not append specialist catalogs here.
**HEAD:** `dd275aa` (#182)  
**Prior director:** [`ACTION_IDS_2026-08-31.md`](./ACTION_IDS_2026-08-31.md) + [`MASTER_ROADMAP.md`](./MASTER_ROADMAP.md)  
**Gameplay / production code:** not modified this run.
Specialist IDs stay in their producer files (`ACTION_IDS_SDE_*`, `ACTION_IDS_MIMA_*`, `ACTION_IDS_ENEMY_BOSS_ADMIN_*`, orchestrator `ACTION_IDS_2026-08-31-0604/1200/1800.md`, etc.).
ACTION_ID: MTD-2026-08-31-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Halt same-hour P2/P3 implementer flock after a merge burst  
CATEGORY: automation-coherence  
EVIDENCE: Failed on 2026-08-31 (25+ agents; humans then merged three bursts). Recurred 2026-09-01 00:00–00:02 UTC: **34** automations including map integrity `9dcfd122`, combat parity `f37b7505`, adversarial QA `08e7de28`, security `c97e5c0c`, admin safety `7e907066`, test mill `81c2e934`, orchestrator `68f2958f`, plus expansion/AI/feel/admin/telemetry designers. P0 leftover #183 and ADR AQA-008 are still open.  
SYSTEMS_AFFECTED: all implementer automations; merge queue  
RECOMMENDED_ACTION: First-run and expansion specialists emit ACTION_IDs only. Do not open gameplay PRs this cycle unless unique, display-only, and not already drafted. Stagger crons. Pause map/combat/persist implementers 6 hours after a `main` merge that touches WX, `progressPersist`, `mapGen`, or `main.mo` rewards.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-001; AQA-2026-08-30-009  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next director run sees ≤3 new gameplay PRs from this wave, and those PRs do not retouch persist / targeting / mapGen / WX.  
STATUS: OPEN  
ACTION_ID: MTD-2026-09-01-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Hold the 2026-09-01 00:00 specialist wave  
CATEGORY: automation-coherence  
EVIDENCE: 34 RUNNING agents listed this hour (see MASTER_ROADMAP). Yesterday the same pattern produced overlapping persist/targeting/mapGen PRs that later merged dirty and required #167/#169/#171/#175/#179/#181 cleanup.  
SYSTEMS_AFFECTED: merge queue; `WorldExploration.tsx`; `mapGen.ts`; `main.mo`; AdminDashboard  
RECOMMENDED_ACTION: Default HOLD any PR from this wave. Orchestrator may implement one unique display-only item. Designers update their own dated files; do not rewrite SDA/SDE/EBA schemas.  
AUTONOMY: HUMAN_CONFIG + review  
DEPENDENCIES: MTD-2026-08-31-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: No mapGen / persist-lock / targeting / enemyAI / AdminDashboard gameplay PR merges from this wave.  
ACTION_ID: AQA-2026-08-30-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Throttle the critical / high-severity bug hunter  
CATEGORY: automation-ops  
EVIDENCE: Reused. `996df6df` still not GetAutomation-visible. WX is 20,063 lines / 149 commits since 2026-08-24.  
SYSTEMS_AFFECTED: `996df6df-9d7a-11f1-a7d1-d6b4613131ce`; `WorldExploration.tsx`  
RECOMMENDED_ACTION: REDUCE_FREQUENCY to at most once per 12–24 hours; pause 6 hours after a `main` merge that touches WX or persist.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-002  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: ≤14 hunter runs/week.  
STATUS: OPEN  
ACTION_ID: AQA-2026-08-30-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Keep a single critical-bug automation  
CATEGORY: automation-ops  
EVIDENCE: Reused. `1aa41c6c` remains enabled and correctly opened unique #183 after the 19:07 burst. Volume problem is the rest of the flock, not this hunter’s last PR.  
SYSTEMS_AFFECTED: `1aa41c6c-a483-11f1-a7d1-d6b4613131ce`; `996df6df-9d7a-11f1-a7d1-d6b4613131ce`  
RECOMMENDED_ACTION: MERGE hunters. Keep one at AQA-001 cadence. Fold #183 into the human merge queue as the surviving critical PR.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Only one critical-bug automation ID fires per day.  
STATUS: OPEN  
ACTION_ID: MTD-2026-09-01-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Human merge #183 — death replay after portal or Doka-only credit  
CATEGORY: persist  
EVIDENCE: `resolvePendingDeathReplay` (`deathPenalty.ts` 426–449) writes only when both axes are still `pre`, or XP is `pre` and Doka already spent. Portal +10 or a Doka-only credit moves one axis above `pre`; reload **clears** the marker and the 20/40 cut never retries. #183 is +24/−0 on `deathPenalty.ts` + tests, clean vs `dd275aa`, unique among open PRs. #175 already on `main` (double-victory / cleanup).  
SYSTEMS_AFFECTED: `src/frontend/src/utils/deathPenalty.ts`  
RECOMMENDED_ACTION: Review/merge #183. Do not open a second death-replay PR. After merge, freeze death-penalty helpers except proven unique holes.  
AUTONOMY: HUMAN_REVIEW  
REGRESSION_RISK: MEDIUM if both axes above `pre` are recut (later earn). #183 keeps that as clear.  
VALIDATION_REQUIRED: Portal +10 then lava-reload still applies 20/40 to the credited snapshot; dual-axis victory credit still clears.  
ACTION_ID: MTD-2026-08-31-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Human merge queue — #114 then #107 clamp-only rebase  
CATEGORY: merge-hygiene  
EVIDENCE: Both themes are on `main` (#114 09:33; clamps via #107/#144/#171). `applyRewards` rejects `dokaDelta > 100_000` and `xpDelta > 500_000` (`main.mo` 1798–1799). `saveBattleStats` cannot raise Doka/XP (`main.mo` 1767–1768).  
SYSTEMS_AFFECTED: `main.mo`; persist callers  
RECOMMENDED_ACTION: CLOSED. Do not re-implement clamps. Leftover trust work is AQA-008 + MTD-2026-09-01-005.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: AQA-2026-08-30-008  
REGRESSION_RISK: n/a  
VALIDATION_REQUIRED: n/a  
STATUS: IMPLEMENTED  
ACTION_ID: AQA-2026-08-30-008  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Convert the security 9-finding set into an architecture decision  
CATEGORY: security-architecture  
EVIDENCE: Reused. Clamp/no-mint is now on `main`. No written ADR. Finding 3 is still restated as “must not write Doka” by security runs. `writeLevel` still uses client `_level` when ≤ stored (`main.mo` 1769) despite the comment that level is ignored. `calculateAndAwardDoka` unused. `markAchievementUnlocked` still client-asserted. Shop 60s auto-complete still architecture. Security `c97e5c0c` is running this hour.  
SYSTEMS_AFFECTED: `src/backend/main.mo`; `docs/ARCHITECTURE.md`  
RECOMMENDED_ACTION: Write the ADR: (a) official-client trust + store-relative clamps (current de-facto), or (b) canister proofs. Rewrite finding 3. Then land MTD-2026-09-01-005. Do not open a third clamp PR.  
AUTONOMY: HUMAN_DECISION + reviewed docs PR  
DEPENDENCIES: MTD-2026-08-31-002 (done)  
REGRESSION_RISK: HIGH if APIs tighten without a frontend roll.  
VALIDATION_REQUIRED: ADR merged; security findings marked decided; `writeLevel` ignores client.  
STATUS: PARTIAL  
ACTION_ID: MTD-2026-09-01-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: saveBattleStats must ignore client level (stored level always wins)  
CATEGORY: persist  
EVIDENCE: `main.mo` 1688–1692 says applyRewards is the sole level writer and the client level argument is ignored. Line 1769: `writeLevel = if (_level > character.level) { character.level } else { _level }` — a stale lower client level after an in-flight `applyRewards` can drop the character. RAO-2026-08-31-1800-008 flagged remount leftover of the same class.  
SYSTEMS_AFFECTED: `src/backend/main.mo` `saveBattleStats`  
RECOMMENDED_ACTION: `writeLevel = character.level`. Keep `_level` in the signature for Candid compat. Tests: client level 5 / store 6 stays 6; client 7 / store 6 stays 6. Do not bundle with discovery or admin.  
AUTONOMY: HUMAN_APPROVE — Motoko reward path  
DEPENDENCIES: AQA-2026-08-30-008  
REGRESSION_RISK: LOW if only level is pinned; HIGH if bundled with Doka/XP rules.  
VALIDATION_REQUIRED: `mops check` / `caffeine check`; official heal/death still persist HP/Doka/XP cuts.  
ACTION_ID: MTD-2026-09-01-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Stop appending specialist catalogs to ACTION_IDS_2026-08-31.md  
CATEGORY: process  
EVIDENCE: File is ~4,200 lines. Header is SDA designer. Contains SDA, MTD, AQA, TADD, VAL, TBC, WDEAD, EED, PXA, GTAD, UX-*, AEE, AFDA, SDEG, RAO, AUX, WDD, LHIPS, MAA, GFCF. AQA-003 asked for one ledger; the result is unreadable. Producers already have dated files (SDE, MIMA, EBA, PERF, 0604/1200/1800).  
SYSTEMS_AFFECTED: `docs/automation/ACTION_IDS_*.md`  
RECOMMENDED_ACTION: UPDATE_PROMPT: each producer writes `ACTION_IDS_<PREFIX>_YYYY-MM-DD.md`. Director maintains this index + MASTER_ROADMAP. Do not append to the 08-31 dump.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-003  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next wave adds 0 lines to ACTION_IDS_2026-08-31.md.  
ACTION_ID: AQA-2026-08-30-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Adopt an in-repo ACTION_ID ledger all producers write to  
CATEGORY: process  
EVIDENCE: Reused. Ledger exists and is now a dump yard (see MTD-2026-09-01-004). Dedup still fails (portal XP / targeting / persist twins).  
SYSTEMS_AFFECTED: all producer prompts  
RECOMMENDED_ACTION: Index + per-producer files. Refuse a second PR for an ID that is OPEN or matches an open PR theme.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-09-01-004  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Director can list OPEN P0/P1 without grepping 4k lines.  
STATUS: PARTIAL  
ACTION_ID: AQA-2026-08-30-006  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze mapGen after #110 (and the 08-31 follow-up punches)  
CATEGORY: sensitive-code  
EVIDENCE: Reused. After #110, #155 #158 #164 #179 still edited `mapGen.ts` (988 → 1,348 lines). Guardian `9dcfd122` is RUNNING this hour. `AGENTS.md` still forbids map-generation edits.  
SYSTEMS_AFFECTED: `src/frontend/src/engine/mapGen.ts`  
RECOMMENDED_ACTION: Report-only (ACTION_IDs + failing seed fixtures) unless a human authorizes a playtested change. Close any 09-01 mapGen PR.  
AUTONOMY: HUMAN_CONFIG  
REGRESSION_RISK: HIGH if another punch lands without playtest.  
VALIDATION_REQUIRED: Next solvability run opens 0 mapGen PRs.  
STATUS: BROKEN  
ACTION_ID: AQA-2026-08-30-007  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze drive-by WorldExploration edits  
CATEGORY: sensitive-code  
EVIDENCE: Reused. File is 20,063 lines; 149 commits since 2026-08-24. #180 wants another WX persist restack. Tonight’s feel / AI / expansion / invariant / combat agents will add more branches if allowed.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`  
RECOMMENDED_ACTION: New behavior in `engine/*` or `utils/*` with tests; WX one-line wiring. Reject PRs whose primary hunk is another WX branch. Exception: #183 does not touch WX.  
AUTONOMY: HUMAN_CONFIG + review  
DEPENDENCIES: MTD-2026-09-01-002  
REGRESSION_RISK: MEDIUM — some remaining defects are still WX closures.  
VALIDATION_REQUIRED: Next week WX commit count under 20.  
STATUS: BROKEN  
ACTION_ID: MTD-2026-09-01-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Rebase #180 live-Doka helpers; do not merge dirty  
CATEGORY: persist  
EVIDENCE: `writeLiveDoka` / `creditLiveDoka` / `beginRename` / `shouldRollbackFailedShopSpend` are not on `main`. #180 implements them but is dirty vs `dd275aa`, based on `036600f`, and restacks WX credit/death/heal paths already patched by #167/#169/#175.  
SYSTEMS_AFFECTED: `itemShop.ts`; `renameCharacter.ts`; `WorldExploration.tsx`; `BuffShop.tsx`  
RECOMMENDED_ACTION: Hold. Rebase on post-#183 `main`. Keep helpers + tests; drop WX hunks already landed. Do not open a third persist PR.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-09-01-002  
REGRESSION_RISK: HIGH if merged dirty.  
VALIDATION_REQUIRED: Victory-then-heal cannot ghost Doka; rename double-click debits once; failed shop persist does not refund a later buy.  
ACTION_ID: MIMA-2026-08-31-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Swap landing skips lava, spikes, ice, and Void Rift walk damage  
CATEGORY: combat-correctness  
EVIDENCE: Reused. Reconfirmed on `dd275aa`. `swapPositions` (`WorldExploration.tsx` 10009–10021) still copies coordinates and does not call `applyBattleWalkHazards`. RAO-1800-002 still NEEDS_HUMAN_DECISION. Not drafted as a unique PR.  
SYSTEMS_AFFECTED: Swap; hazards; challenges  
RECOMMENDED_ACTION: Extract `applyHazardLanding` + tests; one WX call site. Do not change damage numbers. Do not grow WX without the helper.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: AQA-2026-08-30-007  
REGRESSION_RISK: MEDIUM — must not double-charge a walk that already ran the stepper.  
VALIDATION_REQUIRED: Swap onto lava increments challenge damage; walk path still charges once.  
STATUS: OPEN  
ACTION_ID: MIMA-2026-08-31-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Player-controlled summon walk ignores occupancy and tile hazards  
CATEGORY: combat-correctness  
EVIDENCE: Reused. Reconfirmed on `dd275aa`. Controlled summon walk (`WorldExploration.tsx` 10583–10594) is `findPath` + `updateCombatant` with no `isCellFree` and no hazard landing.  
SYSTEMS_AFFECTED: summons; occupancy; hazards  
RECOMMENDED_ACTION: Same helper as MIMA-001. Reject occupied destinations; then land hazards.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: MIMA-2026-08-31-001  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Path onto occupied tile is a no-op; path onto lava commits store HP.  
STATUS: OPEN  
ACTION_ID: MTD-2026-08-31-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Controlled extraction of HP and death authority out of WorldExploration  
CATEGORY: architecture  
EVIDENCE: Reused. Cluster #78–#114 plus Swap/summon landing (MIMA-001/002). Dual authority remains. Do not start this in the 00:00 wave.  
SYSTEMS_AFFECTED: `combatantStore.ts`; `deathPipeline.ts`; `battleSetup.ts`; WX  
RECOMMENDED_ACTION: After #183 and MIMA landing helper. One scoped PR. No RAF / mapGen / damage-formula changes.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: MTD-2026-09-01-002; MIMA-2026-08-31-001  
REGRESSION_RISK: HIGH if bundled with targeting or persist.  
VALIDATION_REQUIRED: Engine tests for plague / DoT / lava / reflect / swap-landing / last-hostile.  
STATUS: OPEN  
ACTION_ID: MTD-2026-08-31-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze content / AI / feel / admin implementation until P0/P1 settle  
CATEGORY: expansion-gating  
EVIDENCE: Reused. Design catalogs from 08-31 are on `main` (correct). Gameplay from those catalogs is still blocked: no ownership persist, zone-0 kits, no ADR, flock active.  
SYSTEMS_AFFECTED: expansion / AI / feel / admin implementers  
RECOMMENDED_ACTION: Docs and ACTION_IDs only until #183 + ADR + landing helper exist.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-09-01-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: No SDA/SDE/EBA/AI gameplay PR from the 09-01 wave.  
STATUS: OPEN  
ACTION_ID: AQA-2026-08-30-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Stop the test-clone mill  
CATEGORY: automation-ops  
EVIDENCE: Reused. #100/#101/#106 merged or closed in the 10:14 burst. #173 is a stale restack on `bcb0721`. Test builder `81c2e934` is RUNNING this hour.  
SYSTEMS_AFFECTED: `src/frontend/src/**/*.test.ts`  
RECOMMENDED_ACTION: Close or hold #173. New tests only lock a unique merged contract.  
AUTONOMY: HUMAN_REVIEW  
REGRESSION_RISK: LOW if closed; MEDIUM if merged dirty.  
VALIDATION_REQUIRED: 0 clone suites referencing removed exports.  
STATUS: OPEN  
ACTION_ID: AQA-2026-08-30-009  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Orchestrator must not implement gameplay  
CATEGORY: automation-ops  
EVIDENCE: Reused. 06:04/12:00/18:00 implemented unique display (feat recap, recap click-through, vitals jewels) — acceptable. Orchestrator `68f2958f` is RUNNING this hour and must not restack persist/combat.  
SYSTEMS_AFFECTED: `68f2958f-a489-11f1-a7d1-d6b4613131ce`  
RECOMMENDED_ACTION: ACTION_IDs + at most one unique display-only item.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-09-01-001  
REGRESSION_RISK: MEDIUM if it implements persist.  
VALIDATION_REQUIRED: Orchestrator PR (if any) is display-only and unique.  
STATUS: PARTIAL  
ACTION_ID: AQA-2026-08-30-010  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Dedup persist / economy implementers  
CATEGORY: automation-ops  
EVIDENCE: Reused. Official-client races largely on `main`. Leftovers are #183 (unique) and #180 (dirty). Economy hunter `1e548d83` produced #175 (merged).  
SYSTEMS_AFFECTED: persist / economy automations  
RECOMMENDED_ACTION: ACTION_IDs only if a race is already drafted. Do not open a third clamp.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-09-01-002; MTD-2026-09-01-003  
REGRESSION_RISK: HIGH if another persist rewrite lands.  
VALIDATION_REQUIRED: At most one open persist PR.  
STATUS: PARTIAL  
ACTION_ID: AQA-2026-08-30-012  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Outcome telemetry before any dashboard  
EVIDENCE: Reused. Still no collectors. TBC-2026-08-31-001 WAITING_FOR_TELEMETRY. Dashboard specialist `4b026695` and architecture `047ac8a1` are RUNNING this hour. `longHorizonSim.telemetry.available === false`.  
SYSTEMS_AFFECTED: future counters; Admin telemetry UI  
RECOMMENDED_ACTION: Design + tiny persist-lock-enqueued counters first. No dashboard UI. No balance labels.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None for design; persist freeze for any writer  
REGRESSION_RISK: HIGH if a second persist path is invented.  
VALIDATION_REQUIRED: Zero CLEAR_POSITIVE_SIGNAL claims until rows exist.  
STATUS: OPEN  
ACTION_ID: TBC-2026-08-31-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Keep balance analyst gated until telemetry rows exist  
EVIDENCE: Reused. No collectors on `dd275aa`. Do not infer balance from source.  
SYSTEMS_AFFECTED: Telemetry-Driven Balance automation `2786666f`  
RECOMMENDED_ACTION: STATUS WAITING_FOR_TELEMETRY. No BAL-* implementation.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-012  
REGRESSION_RISK: HIGH if formulas change without data.  
VALIDATION_REQUIRED: No OVERPERFORMING labels.  
STATUS: OPEN  
ACTION_ID: SDA-2026-08-31-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Split catalog from ownership; persist owned and observed spell ids  
CATEGORY: ownership-persist  
EVIDENCE: Reused. `ownedSpells` is still starters ∪ filtered backend (`WX` ~2410). Admin add still grants everyone. Blocks meaningful telemetry-by-acquisition-path.  
SYSTEMS_AFFECTED: `main.mo`; spellbook; WX ownedSpells  
RECOMMENDED_ACTION: After P0/P1 persist freeze. Do not implement from the 09-01 wave. Canonical persist shape; SDE/EBA/SPELL_DISCOVERY cards attach later.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-08-31-001; MTD-2026-08-31-004  
REGRESSION_RISK: HIGH  
VALIDATION_REQUIRED: New character owns only base ids; admin catalog add does not hydrate into others’ books.  
STATUS: OPEN  
ACTION_ID: SDA-2026-08-31-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Implement enemy-discovery default (cast → observe → win → unlock)  
CATEGORY: discovery-pipeline  
EVIDENCE: Reused. Still no `recordSpellObservation`. Core Stralt rule. Must enqueue on persist lock; must not use `spell.name`.  
SYSTEMS_AFFECTED: enemy cast hook; persist lock; recap  
RECOMMENDED_ACTION: Blocked on SDA-002/003 and persist quiet.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-08-31-002; SDA-2026-08-31-003  
REGRESSION_RISK: HIGH if granted off the lock.  
VALIDATION_REQUIRED: Cast-then-flee observes without unlock; cast-then-win unlocks once.  
STATUS: OPEN  
ACTION_ID: MTD-2026-08-31-006  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Admin Draft → Validate → Activate on the canister  
CATEGORY: admin-pipeline  
EVIDENCE: Reused. Dashboard 7,737 lines. Hard delete still exists historically; #165 hardened some retirement. Not a canister publish workflow. EBA/SDA/WORLD_ENCOUNTER designs overlap — pick SDA-005 lifecycle, do not grow chrome first.  
SYSTEMS_AFFECTED: `main.mo` admin; AdminDashboard  
RECOMMENDED_ACTION: Canister states first; UI second. Hold 09-01 admin implementers.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-08-31-005; AQA-008  
REGRESSION_RISK: HIGH if hard-delete remains.  
VALIDATION_REQUIRED: Retire does not strip owned levels.  
STATUS: OPEN  
ACTION_ID: MTD-2026-08-31-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Wire saveKillCount or drop it from the leaderboard  
CATEGORY: persistence  
EVIDENCE: Reused. Hook in `useLeaderboardQueries.ts`; no UI caller. Canister rejects `kills > 64`.  
SYSTEMS_AFFECTED: leaderboard; `saveKillCount`  
RECOMMENDED_ACTION: One caller on attributed player-side kills **or** remove from HUD. Not tonight.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: persist freeze  
REGRESSION_RISK: MEDIUM if it races `applyRewards`.  
VALIDATION_REQUIRED: Allied summons never increment.  
STATUS: OPEN  
ACTION_ID: MTD-2026-08-31-008  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Revisit computeAITier 30% full-random roll  
CATEGORY: design  
EVIDENCE: Reused. `combatMath.ts` 48–50 unchanged. Contradicts progressively sophisticated enemies. Do not rewrite `enemyAI.ts`.  
SYSTEMS_AFFECTED: `computeAITier`  
RECOMMENDED_ACTION: Design decision: variance within adjacent tiers, not uniform 1–10.  
AUTONOMY: HUMAN_DECISION  
DEPENDENCIES: MTD-2026-08-31-004  
REGRESSION_RISK: HIGH if bundled with an AI rewrite.  
VALIDATION_REQUIRED: Report only until human picks.  
STATUS: OPEN  
ACTION_ID: MTD-2026-08-31-007  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Enemy-observed spell discovery design (canonical persist shape)  
CATEGORY: design  
EVIDENCE: Reused. SDA-002/004 is the persist shape. Do not author a fifth schema this hour (SDE / SPELL_DISCOVERY / EBA already exist).  
SYSTEMS_AFFECTED: design docs only  
RECOMMENDED_ACTION: Point implementers at SDA-002/004. Mark overlapping docs as content cards.  
AUTONOMY: DOCS_ONLY  
DEPENDENCIES: SDA-2026-08-31-002  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: No new discovery schema file from the 09-01 wave.  
STATUS: OPEN  
ACTION_ID: EXPANSION-PREREQ-A  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Pass a numeric zone into buildEnemyKit  
CATEGORY: content-infrastructure  
EVIDENCE: Reused from `EXPANSION_PROPOSALS_2026-08-31.md` PREREQ-A. `buildEnemyKit` does `Math.floor(levelZone)` on an object → `NaN` → zone-0 kits forever. Unblocks dynamic pools without an AI rewrite.  
SYSTEMS_AFFECTED: battle-start kit assign; `enemyAI.ts`  
RECOMMENDED_ACTION: After flock hold. One call site + unit test. WX one-line. Do not invent new kits in the same PR.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: MTD-2026-08-31-004; AQA-2026-08-30-007  
REGRESSION_RISK: MEDIUM — zone-1 kits suddenly appear.  
VALIDATION_REQUIRED: Zone 0 pawn kit unchanged; zone ≥1 adds the advanced id.  
STATUS: OPEN  
ACTION_ID: SDA-2026-08-31-007  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Seed frontend starter ids into the canister catalog  
CATEGORY: catalog-sync  
EVIDENCE: Reused. Dual catalogs remain. `upgradeSpell("physical_attack")` still fails if purged. Blocked on SDA-001 type alignment and a canister upgrade.  
SYSTEMS_AFFECTED: `AdminLib.defaultSpells`; purge list; `upgradeSpell`  
RECOMMENDED_ACTION: After ADR/type work. Not the 09-01 wave.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-08-31-001  
REGRESSION_RISK: HIGH if purge still drops `physical_attack`.  
VALIDATION_REQUIRED: `upgradeSpell` on Strike and a summon returns `#ok`.  
STATUS: OPEN  
ACTION_ID: MTD-2026-08-31-009  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Leftover XP HUD on selection / top bar / recap  
CATEGORY: display  
PRIORITY: P3  
EVIDENCE: #108 / #138 / #178-class HUD work is on `main`. Recap uses `xpForNextLevel`.  
SYSTEMS_AFFECTED: HUD / recap  
RECOMMENDED_ACTION: CLOSED. Do not re-implement.  
AUTONOMY: n/a  
DEPENDENCIES: none  
REGRESSION_RISK: n/a  
VALIDATION_REQUIRED: n/a  
STATUS: IMPLEMENTED  
ACTION_ID: RAO-2026-08-31-1800-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Side-panel vitals jewels use live HP/AP/MP caps  
CATEGORY: display  
PRIORITY: P3  
EVIDENCE: #178 merged 19:08 UTC.  
RECOMMENDED_ACTION: CLOSED.  
STATUS: IMPLEMENTED  
ACTION_ID: MIMA-2026-08-31-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Ignore canvas walk / hazard clicks while the app-root recap is open  
CATEGORY: display / input  
PRIORITY: P3  
EVIDENCE: #166 merged (`shouldIgnoreWorldInputDuringRecap`).  
RECOMMENDED_ACTION: CLOSED. Measure later via AQA-012; do not re-patch.  
STATUS: IMPLEMENTED  
ACTION_ID: RAO-2026-08-31-1200-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Recap click-through gate  
CATEGORY: display / input  
PRIORITY: P3  
EVIDENCE: Same as MIMA-003 / #166.  
STATUS: IMPLEMENTED  
