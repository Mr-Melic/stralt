# ACTION_IDs — 2026-09-27 Quality Auditor

Durable ledger for the Report Action Orchestrator, Master Technical Director, and next week’s audit.  
Source: Automation Quality Auditor.  
Do not implement gameplay from this file unless a human or the orchestrator (display-only exception) picks an ID that is still unique and not already an OPEN PR.

Reuse beats minting. Several items below **are the same ID** as 2026-08-30 / director files with updated evidence.

**HEAD:** `0f5363f` (#332, 2026-09-03). **Open drafts at write time:** 380. **Week merges:** 0.

---

## Status of prior AQA / director IDs (do not mint twins)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| MTD-2026-08-31-001 / MTD-2026-09-01-001 / MTD-2026-09-02-001 | **OPEN / BROKEN** | Flock halt failed for a month. 609 runs this week; 87/day; 290 at 00 UTC. |
| AQA-2026-08-30-001 | **OPEN** | `996df6df` gone; `1aa41c6c` still 55 runs / 23 PRs. |
| AQA-2026-08-30-002 | **PARTIAL** | One critical hunter remains. Do not recreate `996df6df`. |
| AQA-2026-08-30-003 | **PARTIAL** | IDs exist in dated files; `main` ledger frozen 2026-09-03; no lifecycle. See AQA-2026-09-27-004. |
| AQA-2026-08-30-004 | **SUPERSEDED** | The #100–#111 stack is gone. Replace with AQA-2026-09-27-001 (380-draft triage). |
| AQA-2026-08-30-005 | **PARTIAL** | Occupancy clone mill stopped; 6 unmerged lock-test PRs remain. |
| AQA-2026-08-30-006 | **BROKEN** | 27 `fix(map)` PRs this week. |
| AQA-2026-08-30-007 | **BROKEN** (process) | 0 WX commits only because `main` is frozen; implementers still target WX. |
| AQA-2026-08-30-008 | **PARTIAL** | Clamps on `main.mo` 2119–2120; shop 60s is a no-op; **no ADR**. |
| AQA-2026-08-30-009 | **BROKEN** | Orchestrator 12 fix PRs. |
| AQA-2026-08-30-010 | **BROKEN** | 23 persist “wipe after keep” variants. |
| AQA-2026-08-30-011 | **PARTIAL** | Attack Nearest fork died; live-gate mill replaced it. |
| AQA-2026-08-30-012 | **OPEN** | `telemetry.available === false`. |
| SDA-2026-08-31-002 / 004 | **OPEN** | Discovery still not in the live book. Not a seventh design PDF. |
| TBC-2026-08-31-001 | **OPEN** | WAITING_FOR_TELEMETRY. Pause TBC/GTAD/dashboard specialists. |

---

ACTION_ID: MTD-2026-08-31-001  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: Halt the implementer flock until the draft queue is triaged  
CATEGORY: automation-ops  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: 2026-09-20→27: 609 automation runs, 55 IDs, 379 PRs opened, **0 merges**, 380 open drafts, +227,055/−4,782 unmerged lines. `origin/main` last moved 2026-09-03 (`0f5363f`, #332). 290 runs started in hour 00 UTC. Cursor automations have no dashboard write API from this agent — this is a human cron/dashboard action. Same ID as the director flock-halt (failed 08-31, 09-01, 09-02, and now empirically all of 09-20→27).  
AUTOMATION_AFFECTED: `1aa41c6c`; `9dcfd122`; `607e0304`; `f37b7505`; `68f2958f`; `08e7de28`; `1e548d83`; `1f90a60d`; `81c2e934`; `7e907066`; `386a157d`; daily design/docs specialists  
SYSTEMS_AFFECTED: merge queue; `WorldExploration.tsx`; `mapGen.ts`; persist lock callers; AdminDashboard  
RECOMMENDED_ACTION: REDUCE_AUTONOMY / PAUSE gameplay implementers (critical, persist, map, combat parity, adversarial QA, orchestrator-implement, economy, #62 WX extracts, admin-safety) until open drafts < 30 **or** a human publishes a keep/close list. Stretch remaining crons to daily-or-less. Design specialists: weekly, docs only, skip if yesterday’s file is still OPEN.  
DEPENDENCIES: AQA-2026-09-27-001  
REGRESSION_RISK: LOW — slowing implementers cannot unmerge what did not merge. Residual risk is slower response to a true new P0 on frozen `main` (invariants + one daily hunter can cover that).  
VALIDATION_REQUIRED: Next auditor window shows ≤1 gameplay PR/day from implementers, or a documented human exception. Open draft count falling, not rising.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-09-27-001  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: Lifecycle the 380-draft oldest-first queue  
CATEGORY: merge-hygiene  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `gh` search `is:pr is:open` = 380, all drafts. Week created 379, merged 0, closed 1 (`#655` dup). Oldest-first stack-compat means PR #711 cannot land until #333-class drafts merge or close. Duplicate exact title `chore: drop leftover dungeon-editor CSS after #286` ×6. Persist wipe-after-keep ×15+. Map punch-dump-alcove cluster. Supercedes AQA-2026-08-30-004 (that stack is gone).  
AUTOMATION_AFFECTED: `68f2958f` (orchestrator may **list** keep/close; must not merge via `gh`); humans  
SYSTEMS_AFFECTED: GitHub merge queue; every later automation  
RECOMMENDED_ACTION: Human pick, do not autonmerge. Close or supersede clones (CSS chore, Sentinel Shield `#709` vs `#597`, map alcove twins, telemetry architecture date clones). Candidate unique keeps if review agrees: `#658` `res_sp` shred; one persist-lock characterization (not 23); `#683` or `#369` #62 extract; one a11y (`#693` class); `#368` security ads if still unique. Hold all `fix(map)` until AQA-006.  
DEPENDENCIES: MTD-2026-08-31-001 (stop adding while draining)  
REGRESSION_RISK: HIGH if the 380 are merged oldest-first as-is — dirty WX/mapGen/persist unions.  
VALIDATION_REQUIRED: Open draft count < 50; at most one OPEN PR per theme; `bash scripts/open-pr-stack-compat.sh` meaningful again.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-08-30-001  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: Throttle Find Critical Gameplay Bugs (`1aa41c6c`)  
CATEGORY: automation-ops  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Prior ask was ≤14 hunter runs/week. This week `1aa41c6c` ran **55** times (~8/day) and opened 23 still-open fix PRs. `996df6df` is not GetAutomation-visible (AQA-002 partial success). `#655` closed as dup of `#658` in 5 minutes; `#709` restates `#597` Sentinel Shield. Frozen `main` means the 2nd–55th run re-inspected the same tree.  
AUTOMATION_AFFECTED: `1aa41c6c-a483-11f1-a7d1-d6b4613131ce`  
SYSTEMS_AFFECTED: combat; WorldExploration; statusEffects  
RECOMMENDED_ACTION: REDUCE_FREQUENCY to at most once per 24 hours. UPDATE_PROMPT: uniqueness vs open PR titles from the last 7 days; skip implement if `origin/main` SHA equals last run’s SHA unless the finding is absent from OPEN PRs; extract helpers instead of WX branches.  
DEPENDENCIES: MTD-2026-08-31-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next week ≤7 hunter runs and ≤3 new unique PRs, not 23.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-08-30-006  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: Map integrity stays report-only — no mapGen implementation  
CATEGORY: prompt-architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `AGENTS.md` still forbids map generation edits. Automation `9dcfd122` ran 28 times this week and opened 27 `fix(map):` / `test(map):` PRs (punch/unseal/destack/dump alcove/fight-graph). Same ID as 2026-08-30 (#110). Director marked BROKEN 2026-09-02 (`mapGen` 1,348 → 1,544); on this HEAD `mapGen.ts` is 1,937 lines.  
AUTOMATION_AFFECTED: `9dcfd122-a484-11f1-a7d1-d6b4613131ce`  
SYSTEMS_AFFECTED: `engine/mapGen.ts`; dungeon/overworld solvability  
RECOMMENDED_ACTION: UPDATE_PROMPT to ACTION_IDs + failing seed fixtures only. PAUSE implementation until a human names a seed. REDUCE_FREQUENCY to daily-or-less; skip when `main` SHA unchanged and last seed list unchanged. Close or hold the 27 map drafts.  
DEPENDENCIES: AQA-2026-09-27-001  
REGRESSION_RISK: LOW if drafts stay unmerged. HIGH if punch PRs merge without playtest of CA/void/dungeon-chain portals.  
VALIDATION_REQUIRED: Next week 0 new mapGen implementation PRs.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-08-30-010  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: One persist-lock PR per unfixed race — stop the wipe-after-keep mill  
CATEGORY: automation-ops  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Persist auditor `607e0304` opened 23 PRs this week whose titles are combinatorial variants of `skip saveBattleStats wipe after … keep` (death-cut remount, confirmed credit, stale fetch, seeded/unseeded portal/victory/GameKey/one-shot/feat). Economy `1e548d83` (6 PRs) and player-data `469b7020` overlap unpaid death / GameKey / version-wipe. Architecture still requires `saveBattleStats` Doka writes for heals/spends/death; the bug class is cutting a higher lock snapshot, not the write itself.  
AUTOMATION_AFFECTED: `607e0304-a484-11f1-a7d1-d6b4613131ce`; `1e548d83-a485-11f1-a7d1-d6b4613131ce`; `469b7020-a49f-11f1-a7d1-d6b4613131ce`  
SYSTEMS_AFFECTED: `progressPersist.ts` callers; death penalty; GameKey; one-shot Doka  
RECOMMENDED_ACTION: UPDATE_PROMPT: if an OPEN PR already names the race, emit ACTION_ID only. Collapse trigger variants into one characterization test file on `main` when a human picks a survivor. REDUCE_FREQUENCY to 1/day or less.  
DEPENDENCIES: AQA-2026-09-27-001  
REGRESSION_RISK: MEDIUM if the wrong variant merges and others are closed as dup without checking distinct triggers.  
VALIDATION_REQUIRED: Next persist/economy pair does not open two PRs that both say `saveBattleStats wipe`.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-09-27-002  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: Stop daily date-stamped design/telemetry clones  
CATEGORY: automation-ops  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: 178 week PRs start with `docs`. Normalized titles repeating 7× include gameplay telemetry architecture (~1350 lines each), WAITING_FOR_TELEMETRY balance, Emergent Meta, content diversity, admin re-audits, long-horizon sim, MTD roadmap, PX coherence, visual assets, enemy AI increments, MIMA, GFCF, world/dungeon admin. World mechanics `62dfc3fc` added escalating catalogs (`#680` +5359 wave 10). `longHorizonSim.ts` still `telemetry.available === false`. Open-PR addition sum +227,055 is almost entirely this class.  
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
TITLE: Reduce #62 to 2–3×/week and pause WX extracts while the queue is deep  
CATEGORY: modularity  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Automation `386a157d` ran daily (7 runs) and opened 7 unmerged `refactor(engine)` PRs, all targeting `WorldExploration.tsx` while 23 persist + 23 critical + 27 map + 21 combat-parity drafts also target that file. Extract *quality* is good (`#683` 11 characterization tests; `#369` into `statusEffects`; `#468` into `spawnPolicy`; `#514` starts `enemyWander` from 26 lines). Cadence is not: `#591` +722 DIFF SIZE CREEP; `#427`/`#468` edit `AGENTS.md`; 3/7 mergeState UNSTABLE; 0 landings. Shipped WX line count STABLE at 19,213.  
AUTOMATION_AFFECTED: `386a157d-a4a5-11f1-a7d1-d6b4613131ce`  
SYSTEMS_AFFECTED: `WorldExploration.tsx`; `engine/spawnPolicy.ts`; `engine/enemyWander.ts`; `engine/statusEffects.ts`; `engine/isoGrid.ts`; `engine/spriteHitTest.ts`; `engine/groundDokaSpawn.ts`  
RECOMMENDED_ACTION: REDUCE_FREQUENCY. UPDATE_PROMPT: (1) skip WX extracts while >30 open PRs touch WX; (2) no `AGENTS.md`/`README` edits; (3) prefer extending `spawnPolicy` / `portalRules` / `statusEffects` / `enemyWander` / `occupancy` over new files; (4) production diff cap ~400 lines; (5) land `#514` before `#591`; (6) tests before the move. Do not permanently stop modularity.  
DEPENDENCIES: MTD-2026-08-31-001; AQA-2026-09-27-001  
REGRESSION_RISK: LOW if paused. MEDIUM if `#591` merges before `#514` or unordered with hunter WX hunks.  
VALIDATION_REQUIRED: Next week ≤3 #62 PRs; 0 `AGENTS.md` hunks; no extract >400 production lines.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-08-30-012  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: Add backend-authoritative outcome counters — until then pause telemetry specialists  
CATEGORY: telemetry  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Four weeks after AQA-012, `src/frontend/src/utils/longHorizonSim.ts` still sets `telemetry.available === false`. No collectors in `src/backend`. This week’s TBC/GTAD/dashboard specialists still opened 7 clones each (dashboard titles even say “skip Nth Health telemetry matrix”). Outcome classes in the auditor prompt remain unmeasurable.  
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
EVIDENCE: `68f2958f` ran 28 times, opened 12 fix PRs (UX/a11y/feel/persist/perf). ACTION_ID files on `main` still end 2026-09-03. Display-only unique items (Inferno cooldown copy, Feat Unlocked toast) are the original exception, not 12/week.  
AUTOMATION_AFFECTED: `68f2958f-a489-11f1-a7d1-d6b4613131ce`  
SYSTEMS_AFFECTED: ACTION_ID ledger; merge-order notes  
RECOMMENDED_ACTION: REDUCE_AUTONOMY. Primary output = update statuses on existing IDs + a keep/close list for AQA-2026-09-27-001. Implement only if display-only, unique vs OPEN PRs, and open drafts < 30.  
DEPENDENCIES: AQA-2026-09-27-001; AQA-2026-09-27-004  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next week 0 orchestrator gameplay PRs unless one display-only IMPLEMENT ID is recorded first.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-09-27-004  
SOURCE_AUTOMATION: Automation Quality Auditor  
TITLE: ACTION_ID lifecycle — close stale NEW; stop dated twin files  
CATEGORY: process  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `docs/automation/ACTION_IDS_2026-08-30.md` still marks AQA-004 NEW though director files later SUPERSEDED it. Hundreds of specialist IDs remain NEW on `main` (last producer files 2026-09-02/03). This week’s drafts mint `WDD-2026-09-27-001` class twins instead of updating `WDD-2026-09-21-*`. Duplicate IDs for one persist race. Shop 60s and `applyRewards` clamps still discussed as if unfixed.  
AUTOMATION_AFFECTED: `68f2958f`; `0b92479e`; all ACTION_ID producers  
SYSTEMS_AFFECTED: `docs/automation/ACTION_IDS_*.md`; `MASTER_ROADMAP.md`  
RECOMMENDED_ACTION: UPDATE_PROMPT: reuse IDs; set IMPLEMENTED / SUPERSEDED / OBSOLETE / WAITING; do not open a new dated ACTION_IDS file when the finding set is unchanged. Close: AQA-004; shop-60s; “add applyRewards clamps”; throttle-`996df6df`-as-if-present. Living index = director roadmap + this file.  
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
EVIDENCE: `applyRewards` rejects `dokaDelta > 100_000` and `xpDelta > 500_000` (`main.mo` 2119–2120). `processPendingPurchases` calls empty `_autoCompletePendingPurchases` and returns 0. GameKey is the paid path. Security `c97e5c0c` still ran 14 times and opened one unrelated ads/changelog PR (`#368`). No ADR in `docs/ARCHITECTURE.md` stating official-client trust + clamps vs canister proofs.  
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
EVIDENCE: Cron is `0 19 * * 0`. Cloud-agent listing for 2026-09-06 / 09-13 / 09-20 18:50–19:20 UTC returned **0** runs (`includeArchived=true`). Last merged auditor report is PR #112 (2026-08-30). This run (`bc-6062a368`) is the first in four weeks. The ecosystem was unaudited while 380 drafts accumulated.  
AUTOMATION_AFFECTED: `976261d8-a49f-11f1-a7d1-d6b4613131ce`  
SYSTEMS_AFFECTED: automation dashboard; `docs/automation/QUALITY_AUDIT_*.md`  
RECOMMENDED_ACTION: Human: verify the automation remains enabled and the Sunday 19:00 UTC schedule is attached. KEEP weekly. A missed month is a process defect, not a reason to raise frequency.  
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
EVIDENCE: `48eb1df6` and `b1bc1d63` both run as “Admin dashboard audit” / “Stralt admin dashboard audit” (7+7 runs). Combined with admin-safety `7e907066` (11 fix PRs), admin-drift `e4d996b0`, admin-regression `67820d12`, and three admin-design specialists. Two dashboard UX bots are not independent verification.  
AUTOMATION_AFFECTED: `48eb1df6-a499-11f1-a7d1-d6b4613131ce`; `b1bc1d63-a497-11f1-a7d1-d6b4613131ce`  
SYSTEMS_AFFECTED: AdminDashboard  
RECOMMENDED_ACTION: MERGE into one admin UX auditor at weekly cadence. Keep `7e907066` as the guard (URL schemes, grants, catalog writes).  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next week only one dashboard-audit automation ID appears in the agent list.  
STATUS: NEW  
