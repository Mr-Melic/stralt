# ACTION_IDs — 2026-10-25 Quality Auditor

Durable ledger for the Report Action Orchestrator, Master Technical Director, and next week’s audit.  
Source: Automation Quality Auditor.  
Do not implement gameplay from this file unless a human or the orchestrator (display-only exception) picks an ID that is still unique and not already an OPEN PR.

Reuse beats minting. Items below **are the same IDs** as 2026-08-30 / 2026-09-27 with updated evidence, plus two new records that did not exist then.

**HEAD:** `0f5363f` (#332, 2026-09-03). **Open drafts at write time:** 774. **Week merges:** 0. **Week closes:** 0.  
**Prior auditor PR #713** (2026-09-27 report) is still draft — statuses in that file never reached `main`.

---

## Status of prior AQA / director IDs (do not mint twins)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| MTD-2026-08-31-001 / MTD-2026-09-01-001 / MTD-2026-09-02-001 | **OPEN / BROKEN** | Flock halt failed for 52 days of frozen `main`. This week 436 runs, 87/day, 226 at 00 UTC, 292 PRs, 0 merges. |
| AQA-2026-08-30-001 | **OPEN / BROKEN** | `1aa41c6c` 38 runs in four days (not ≤7/week). |
| AQA-2026-08-30-002 | **PARTIAL** | One critical hunter remains. Do not recreate `996df6df`. |
| AQA-2026-08-30-003 | **PARTIAL** | IDs exist in dated files; `main` ledger frozen 2026-09-03; #713 never merged. |
| AQA-2026-08-30-004 | **SUPERSEDED** | Still marked NEW on `main` because #713 never landed. |
| AQA-2026-08-30-005 | **PARTIAL** | Occupancy clones gone; Pale Archivist lock mill is the new test clone (12 PRs). |
| AQA-2026-08-30-006 | **BROKEN** | Worse: 90 `fix(map)` hits / 29 `snap leftover crumbs` titles. |
| AQA-2026-08-30-007 | **BROKEN** (process) | 0 WX commits only because `main` is frozen. |
| AQA-2026-08-30-008 | **PARTIAL** | Clamps on `main`; shop 60s no-op; **no ADR**. |
| AQA-2026-08-30-009 | **BROKEN** | Orchestrator `#1105` / `#1096`. |
| AQA-2026-08-30-010 | **BROKEN** | 18 leftover-XP remount titles. |
| AQA-2026-08-30-011 | **PARTIAL** | Live-gate mill became pack-enemy LoS / Pale Archivist mill. |
| AQA-2026-08-30-012 | **OPEN** | `telemetry.available === false`. |
| AQA-2026-09-27-001 | **BROKEN** | Queue 380 → **774**; 0 closes this week. |
| AQA-2026-09-27-002 | **BROKEN** | 170 docs / 56 Wave / 60 design-only. |
| AQA-2026-09-27-003 | **BROKEN** | #62 daily paint mill; `#995` +935; docs drive-bys. |
| AQA-2026-09-27-004 | **OPEN** | Lifecycle never reached `main`. |
| AQA-2026-09-27-005 | **PARTIAL** | Fired 2026-10-25; missed 10-04 / 10-11 / 10-18; Oct 4–18 was 11 ERROR runs. |
| AQA-2026-09-27-006 | **OPEN** | Both admin-dashboard IDs still ran ×5. |
| SDA-2026-08-31-002 / 004 | **OPEN** | Discovery still not in the live book. Wave 17 is not that work. |
| TBC-2026-08-31-001 | **OPEN** | WAITING_FOR_TELEMETRY ×6 this week. Pause TBC/GTAD/dashboard. |

---

ACTION_ID: MTD-2026-08-31-001  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: Halt the implementer flock until the draft queue is triaged  
CATEGORY: automation-ops  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: 2026-10-18→25: 436 automation runs, 53 IDs, 292 PRs opened, **0 merges**, **0 closes**, 774 open drafts. `origin/main` last moved 2026-09-03 (`0f5363f`, #332) — **52 days**. 226/400 sampled runs started in hour 00 UTC. Oct 4–18: 11 ERROR-only runs, then 87/day. Cursor automations have no dashboard write API from this agent — this is a human cron/dashboard action. Same ID as the director flock-halt (failed 08-31 through 10-25).  
AUTOMATION_AFFECTED: `1aa41c6c`; `9dcfd122`; `607e0304`; `f37b7505`; `68f2958f`; `08e7de28`; `1e548d83`; `1f90a60d`; `81c2e934`; `7e907066`; `72eb90fe`; `386a157d`; daily design/docs specialists  
SYSTEMS_AFFECTED: merge queue; `WorldExploration.tsx`; `mapGen.ts`; persist lock callers; AdminDashboard  
RECOMMENDED_ACTION: REDUCE_AUTONOMY / PAUSE gameplay implementers until open drafts < 30 **or** a human publishes a keep/close list. Stretch remaining crons to daily-or-less. Design specialists: weekly, docs only, skip if yesterday’s file is still OPEN.  
DEPENDENCIES: AQA-2026-09-27-001  
REGRESSION_RISK: LOW — slowing implementers cannot unmerge what did not merge. Residual risk is slower response to a true new P0 on frozen `main` (contract guardian + one daily hunter can cover that).  
VALIDATION_REQUIRED: Next auditor window shows ≤1 gameplay PR/day from implementers, or a documented human exception. Open draft count falling, not rising.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-09-27-001  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: Lifecycle the oldest-first draft queue (now 774)  
CATEGORY: merge-hygiene  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `is:pr is:open` = **774** (was 380 on 2026-09-27). Week created 292, merged 0, closed 0. Oldest-first stack-compat means PR #1105 cannot land until #333-class drafts merge or close. Leftover-XP remount ×18; pack-enemy ×28; Pale Archivist ×12; map snap-crumbs ×29; docs Wave clones. Supercedes AQA-2026-08-30-004. Also land or close **#713** so the Sep 27 audit is visible on `main`.  
AUTOMATION_AFFECTED: `68f2958f` (orchestrator may **list** keep/close; must not merge via `gh`); humans  
SYSTEMS_AFFECTED: GitHub merge queue; every later automation  
RECOMMENDED_ACTION: Human pick, do not autonmerge. Close or supersede clones. Candidate unique keeps if review agrees: one persist-lock characterization (not 18); `#683` or `#369` #62 extract (**not** `#995` tile paint); one a11y. Hold all `fix(map)` until AQA-006. Close paint extracts `#831/#901/#961/#995` or park them until domain extracts land.  
DEPENDENCIES: MTD-2026-08-31-001 (stop adding while draining)  
REGRESSION_RISK: HIGH if the 774 are merged oldest-first as-is — dirty WX/mapGen/persist/paint unions.  
VALIDATION_REQUIRED: Open draft count < 50; at most one OPEN PR per theme; `bash scripts/open-pr-stack-compat.sh` meaningful again.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-08-30-001  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: Throttle Find Critical Gameplay Bugs (`1aa41c6c`)  
CATEGORY: automation-ops  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Prior ask ≤7 runs/week (Sep 27) / ≤14 (Aug 30). This week `1aa41c6c` ran **38** times in the Oct 21–25 slice. Two sampled runs opened no PR (`bc-8449600b`, `bc-0f1f6405`) — the correct behaviour. Pale Archivist shadowing ×12 and pack-enemy LoS/retreat ×28 show the other runs did not uniqueness-check open titles. Frozen `main` means the 2nd–38th run re-inspected `0f5363f`.  
AUTOMATION_AFFECTED: `1aa41c6c-a483-11f1-a7d1-d6b4613131ce`  
SYSTEMS_AFFECTED: combat; WorldExploration; statusEffects  
RECOMMENDED_ACTION: REDUCE_FREQUENCY to at most once per 24 hours. UPDATE_PROMPT: uniqueness vs open PR titles from the last 7 days; skip implement if `origin/main` SHA equals last run’s SHA unless the finding is absent from OPEN PRs; extract helpers instead of WX branches.  
DEPENDENCIES: MTD-2026-08-31-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next week ≤7 hunter runs and ≤3 new unique PRs, not another Archivist/pack-enemy matrix.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-08-30-006  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: Map integrity stays report-only — no mapGen implementation  
CATEGORY: prompt-architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `AGENTS.md` still forbids map generation edits. Automation `9dcfd122` ran ~20 times this week. GitHub `fix(map)` created this week = **90**; `snap ` leftover-crumbs titles = **29**. Sample diffs `#1103` +1488, `#1093` +1136. Sep 27 was already BROKEN at 27 map PRs; this week is worse. `mapGen.ts` on `main` is still 1,937 lines.  
AUTOMATION_AFFECTED: `9dcfd122-a484-11f1-a7d1-d6b4613131ce`  
SYSTEMS_AFFECTED: `engine/mapGen.ts`; dungeon/overworld solvability  
RECOMMENDED_ACTION: UPDATE_PROMPT to ACTION_IDs + failing seed fixtures only. PAUSE implementation until a human names a seed. REDUCE_FREQUENCY; skip when `main` SHA unchanged and last seed list unchanged. Close or hold the map drafts. Success = **0** new mapGen implementation PRs.  
DEPENDENCIES: AQA-2026-09-27-001  
REGRESSION_RISK: LOW if drafts stay unmerged. HIGH if punch PRs merge without playtest of CA/void/dungeon-chain portals.  
VALIDATION_REQUIRED: Next week 0 new mapGen implementation PRs.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-08-30-010  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: One persist-lock PR per unfixed race — stop the leftover-XP remount mill  
CATEGORY: automation-ops  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Persist auditor `607e0304` plus overlapping writers produced **18** titles of the form `skip remount leftover-XP wipe after … keep` (one-shot Doka keep following leftover XP keep / portal XP throw / victory XP throw / rename/upgrade). 143 week PRs match `leftover`. Sample `#1092` +1174. One sampled persist run opened no PR — copy that. Architecture still requires `saveBattleStats` Doka writes for heals/spends/death; the bug class is cutting a higher lock snapshot.  
AUTOMATION_AFFECTED: `607e0304-a484-11f1-a7d1-d6b4613131ce`; `1e548d83-a485-11f1-a7d1-d6b4613131ce`; `469b7020-a49f-11f1-a7d1-d6b4613131ce`  
SYSTEMS_AFFECTED: `progressPersist.ts` callers; death penalty; GameKey; one-shot Doka  
RECOMMENDED_ACTION: UPDATE_PROMPT: if an OPEN PR already names the race, emit ACTION_ID only. Collapse trigger variants into one characterization test file when a human picks a survivor. REDUCE_FREQUENCY to 1/day or less.  
DEPENDENCIES: AQA-2026-09-27-001  
REGRESSION_RISK: MEDIUM if the wrong variant merges and others are closed as dup without checking distinct triggers.  
VALIDATION_REQUIRED: Next persist/economy pair does not open two PRs that both say leftover-XP wipe.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-09-27-002  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: Stop daily date-stamped design/telemetry clones  
CATEGORY: automation-ops  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: 170 week PRs start with `docs`; 56 match `Wave`; 60 match `design only`; 6 match `WAITING_FOR_TELEMETRY`. Same-hour `#1082` Wave 17 discovery + `#1080` Wave 18 boss sheets. Search `"no justified"` = 0. `longHorizonSim` still `telemetry.available === false`.  
AUTOMATION_AFFECTED: `047ac8a1`; `4b026695`; `2786666f`; `62dfc3fc`; `7b2f2b58`; `aac69fba`; `0b92479e`; `5acab6fe`; `3f31b18f`; `1330956a`; `93fcf1b7`; `39040ad2`; `67b03c2f`; `091b545a`; `4efa22ec`; `1592c6c0`; `299b70f5`; `cf1460bd`; `078e61d4`; `30118f7c`; `c26e5a83`; `29176a08`; `73740435`; `3c083a4a`  
SYSTEMS_AFFECTED: `docs/automation/*`; review bandwidth; not the live game  
RECOMMENDED_ACTION: REDUCE_FREQUENCY to weekly. UPDATE_PROMPT: if the previous dated report is still OPEN or the finding set is unchanged, do **not** open a PR (log “no justified change”). PAUSE `047ac8a1` / `4b026695` / `2786666f` until AQA-2026-08-30-012 collectors exist. Director `0b92479e` stays weekly, not daily.  
DEPENDENCIES: AQA-2026-08-30-012 for the telemetry pause  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next week ≤1 docs PR per design specialist, and 0 telemetry-architecture clones.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-09-27-003  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: Pause #62 WX extracts; then 2–3×/week on domain, not paint  
CATEGORY: modularity  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Automation `386a157d` ran daily Oct 21–25 (5 runs) and opened 5 unmerged paint extracts: `#831` dust motes, `#901` whirlpool (README+ARCHITECTURE drive-by), `#961` pixel pattern (README drive-by), `#995` isometric tile paint **+935/−384** (`tilePaint.ts` 498 lines), `#1076` hazard overlay (18 tests; best of *this* week, still paint). Sep 27 asked to extend `spawnPolicy` / `enemyWander` / `statusEffects` / `#683` ground Doka. On `main`, `enemyWander.ts` is still 26 lines; `groundDokaSpawn.ts` does not exist. WX shipped complexity STABLE at 19,213. Open WX-touching drafts include hunters + map + persist + **invariants**.  
AUTOMATION_AFFECTED: `386a157d-a4a5-11f1-a7d1-d6b4613131ce`  
SYSTEMS_AFFECTED: `WorldExploration.tsx`; RAF paint path; `engine/dustMotes.ts`; `portalWhirlpool.ts`; `pixelPattern.ts`; `tilePaint.ts`; `mapHazardPaint.ts`  
RECOMMENDED_ACTION: TEMPORARILY PAUSE WX extracts while open drafts >30 or WX-touching drafts >10. Then REDUCE_FREQUENCY 2–3×/week. UPDATE_PROMPT: (1) no paint/RAF extracts until domain PRs `#369/#514/#683` land or are explicitly closed; (2) no `AGENTS.md`/`README`/`ARCHITECTURE` edits; (3) prefer extending `spawnPolicy` / `portalRules` / `statusEffects` / `enemyWander` / `occupancy`; (4) production diff cap ~400 lines; (5) tests before the move; (6) skip if last extract is still OPEN and `main` SHA unchanged. Do not permanently stop modularity.  
DEPENDENCIES: MTD-2026-08-31-001; AQA-2026-09-27-001  
REGRESSION_RISK: LOW if paused. HIGH if `#995` merges unordered with hunter WX hunks.  
VALIDATION_REQUIRED: Next week 0 #62 paint PRs; ≤3 domain extracts after pause lifts; 0 docs hunks; no extract >400 production lines.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-10-25-001  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: System invariants stay report-only on an unchanged HEAD  
CATEGORY: automation-ops  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Sep 27 scored `72eb90fe` KEEP because 41 runs opened **0** PRs. This week it opened `#1100` `fix(combat): soak leftover-walk lava and spikes like playerTakesDamage` (+495) while adversarial QA opened sibling soak `#1097` the same afternoon. 29 invariant runs against `0f5363f` plus an implementation PR is not independent verification.  
AUTOMATION_AFFECTED: `72eb90fe-a483-11f1-a7d1-d6b4613131ce`  
SYSTEMS_AFFECTED: combat soak / leftover-walk; WorldExploration  
RECOMMENDED_ACTION: UPDATE_PROMPT + REDUCE_AUTONOMY: if `origin/main` SHA equals last run, exit with no PR. If a hunter/adversarial/parity OPEN PR already names the invariant hole, emit ACTION_ID only. REDUCE_FREQUENCY to 2–3×/week.  
DEPENDENCIES: AQA-2026-08-30-001 (hunter uniqueness)  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next week 0 invariants implementation PRs unless `main` moved and the hole is absent from OPEN PRs.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-08-30-012  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: Add backend-authoritative outcome counters — until then pause telemetry specialists  
CATEGORY: telemetry  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Eight weeks after AQA-012, `src/frontend/src/utils/longHorizonSim.test.ts` still asserts `telemetry.available === false`. No collectors in `src/backend`. This week TBC/GTAD/dashboard specialists still opened WAITING_FOR_TELEMETRY clones (6 hits). Outcome classes in the auditor prompt remain unmeasurable.  
AUTOMATION_AFFECTED: `047ac8a1`; `4b026695`; `2786666f`; `976261d8` (consumer)  
SYSTEMS_AFFECTED: persist funnel; recap; death penalty; shop/GameKey (query-only counters)  
RECOMMENDED_ACTION: Human-designed, backend-authoritative counters only (no gameplay math): persist-ok vs persist-err, death-penalty applied, victory paid, recap opened/dismissed, GameKey redeem committed. PAUSE the three telemetry automations until those exist. Automations must not claim CLEAR_POSITIVE_SIGNAL.  
DEPENDENCIES: None. Must enqueue on `createProgressPersist` or be query-only — do not invent a second wallet path.  
REGRESSION_RISK: MEDIUM if counters write off the persist lock.  
VALIDATION_REQUIRED: Next Quality Auditor can cite persist-ok/fail counts, or must again say “still no telemetry.”  
STATUS: NEW  

---

ACTION_ID: AQA-2026-08-30-009  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: Orchestrator writes the ledger — it does not implement gameplay during a freeze  
CATEGORY: automation-ops  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `68f2958f` ran 19 times. Sampled PRs `#1105` Pale Archivist Cursed Wound test and `#1096` summon-archer LoS-reposition with Poison (+1014) are implementation, not a keep/close list for 774 drafts. ACTION_ID files on `main` still end 2026-09-03.  
AUTOMATION_AFFECTED: `68f2958f-a489-11f1-a7d1-d6b4613131ce`  
SYSTEMS_AFFECTED: ACTION_ID ledger; merge-order notes  
RECOMMENDED_ACTION: REDUCE_AUTONOMY. Primary output = update statuses on existing IDs + a keep/close list for AQA-2026-09-27-001. Implement only if display-only, unique vs OPEN PRs, and open drafts < 30.  
DEPENDENCIES: AQA-2026-09-27-001; AQA-2026-09-27-004  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next week 0 orchestrator gameplay/test PRs unless one display-only IMPLEMENT ID is recorded first.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-09-27-004  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: ACTION_ID lifecycle — close stale NEW; stop dated twin files  
CATEGORY: process  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `docs/automation/ACTION_IDS_2026-08-30.md` still marks AQA-004 NEW on `main`. PR #713’s SUPERSEDED notes never merged. This week’s drafts mint Wave 17/18 twins instead of updating `SDA-*`. Duplicate titles for one persist race and one Archivist contract. Shop 60s and `applyRewards` clamps still discussed as if unfixed.  
AUTOMATION_AFFECTED: `68f2958f`; `0b92479e`; all ACTION_ID producers  
SYSTEMS_AFFECTED: `docs/automation/ACTION_IDS_*.md`; `MASTER_ROADMAP.md`  
RECOMMENDED_ACTION: UPDATE_PROMPT: reuse IDs; set IMPLEMENTED / SUPERSEDED / OBSOLETE / WAITING; do not open a new dated ACTION_IDS file when the finding set is unchanged. Close: AQA-004; shop-60s; “add applyRewards clamps”; throttle-`996df6df`-as-if-present. Living index = director roadmap + the latest merged AQA ledger. Land or close #713.  
DEPENDENCIES: AQA-2026-08-30-003  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next week’s `main` (if any docs merge) contains STATUS updates, not a 7th copy of TBC-001.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-08-30-008  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: Write the persist-trust ADR — clamps are on main, the decision is not  
CATEGORY: security-architecture  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `applyRewards` rejects `dokaDelta > 100_000` and `xpDelta > 500_000`. `processPendingPurchases` is a no-op. GameKey is the paid path. Sampled security run `bc-884783e9` opened no PR (good). No ADR in `docs/ARCHITECTURE.md` stating official-client trust + clamps vs canister proofs. Line 28 of that file still says `check-limit = 4` while `mops.toml` and line 452 say 5.  
AUTOMATION_AFFECTED: `c97e5c0c-a485-11f1-a7d1-d6b4613131ce`  
SYSTEMS_AFFECTED: `applyRewards`; `saveBattleStats`; GameKey  
RECOMMENDED_ACTION: REDUCE_FREQUENCY to weekly. Human or docs automation: add the ADR. UPDATE_PROMPT: finding 3 is unbounded absolute values, not “must not write Doka.” Mark shop 60s OBSOLETE.  
DEPENDENCIES: None  
REGRESSION_RISK: HIGH if APIs are tightened without a frontend roll.  
VALIDATION_REQUIRED: `docs/ARCHITECTURE.md` states the decision, or this ID stays OPEN.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-09-27-005  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: Confirm the weekly Quality Auditor cron actually fires  
CATEGORY: automation-ops  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Cron is `0 19 * * 0`. Missed 2026-09-06 / 09-13 / 09-20 (recorded Sep 27) **and** 2026-10-04 / 10-11 / 10-18. This run (`bc-b4d52abf`) fired 2026-10-25. Between 2026-10-04 18:00 and 2026-10-19 00:00 the automations listing returned **11 runs, all ERROR** — not only this auditor. Last merged auditor report is still PR #112 (2026-08-30). #713 never landed.  
AUTOMATION_AFFECTED: `976261d8-a49f-11f1-a7d1-d6b4613131ce`; dashboard (all crons)  
SYSTEMS_AFFECTED: automation dashboard; `docs/automation/QUALITY_AUDIT_*.md`  
RECOMMENDED_ACTION: Human: verify the automation remains enabled and the Sunday 19:00 UTC schedule is attached. Investigate the Oct 4–18 ERROR outage (whiplash into 87 runs/day). KEEP weekly. A missed month is a process defect, not a reason to raise frequency.  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next Sunday 19:00 UTC produces a run (even a no-PR “main still frozen” report).  
STATUS: NEW  

---

ACTION_ID: AQA-2026-09-27-006  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: Merge the two Admin Dashboard auditor automations  
CATEGORY: automation-ops  
PRIORITY: P3  
CONFIDENCE: MEDIUM  
EVIDENCE: `48eb1df6` and `b1bc1d63` both ran ×5 this week as “Admin dashboard audit” / “Stralt admin dashboard audit”. `3089f18d` (“Admin dashboard visual management”) ran ×5 on the same surface. Combined with admin-safety `7e907066`, admin-drift `e4d996b0`, admin-regression `67820d12`. Two dashboard UX bots plus a visual-management bot are not independent verification.  
AUTOMATION_AFFECTED: `48eb1df6-a499-11f1-a7d1-d6b4613131ce`; `b1bc1d63-a497-11f1-a7d1-d6b4613131ce`; `3089f18d-a49a-11f1-a7d1-d6b4613131ce`  
SYSTEMS_AFFECTED: AdminDashboard  
RECOMMENDED_ACTION: MERGE into one admin UX auditor at weekly cadence. Keep `7e907066` as the guard (URL schemes, grants, catalog writes).  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next week only one dashboard-audit automation ID appears in the agent list.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-10-25-002  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: Stop the pack-enemy / Pale Archivist combinatorial combat mill  
CATEGORY: automation-ops  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: This week 108 PRs match `fix(combat)`; 28 match `pack-enemy` (LoS-reposition / wounded-retreat × Slow/Poison/Frost/Strike fallbacks); 12 match `Pale Archivist` kit-first shadowing (Cursed Wound / Mark / Scroll Summon / Pages of Doom, plus orchestrator `#1105`). Combat parity, critical hunter, regression (`#1104` CHC share), and test-lock `81c2e934` all write the same matrix. This is AQA-011’s live-gate mill under new titles.  
AUTOMATION_AFFECTED: `f37b7505`; `1aa41c6c`; `1f90a60d`; `81c2e934`; `68f2958f`  
SYSTEMS_AFFECTED: enemy AI fallbacks; Pale Archivist kit metadata  
RECOMMENDED_ACTION: UPDATE_PROMPT: one characterization table (preview vs execute; kit vs fallback spell) updated weekly; at most one implementation PR per week while drafts >30. Pale Archivist shadowing is **one** contract — one test file, not 12 PRs.  
DEPENDENCIES: AQA-2026-08-30-001; AQA-2026-08-30-011  
REGRESSION_RISK: LOW if drafts stay unmerged. MEDIUM if fallback-share PRs merge out of order and change advertised vs executed AI.  
VALIDATION_REQUIRED: Next week ≤1 new pack-enemy PR and ≤1 new Archivist lock PR unless `main` moved.  
STATUS: NEW  
