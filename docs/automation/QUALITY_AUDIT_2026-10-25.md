# Automation quality audit — week of 2026-10-18

**Auditor:** Automation Quality Auditor (`976261d8-a49f-11f1-a7d1-d6b4613131ce`)  
**Window:** 2026-10-18 19:00 UTC → 2026-10-25 19:01 UTC (weekly cron `0 19 * * 0`)  
**This run:** `bc-b4d52abf-7204-4a80-be0c-c15d24e5e480`  
**HEAD inspected:** `0f5363f` (`Merge pull request #332`, 2026-09-03 00:28 UTC) — **same SHA as the 2026-09-27 audit**  
**Prior auditor reports:** [`QUALITY_AUDIT_2026-08-30.md`](./QUALITY_AUDIT_2026-08-30.md) (PR #112, merged). [`QUALITY_AUDIT_2026-09-27.md`](https://github.com/Mr-Melic/stralt/pull/713) (PR #713, **still draft**, never landed on `main`).  
**Missed Sundays since last successful fire:** 2026-10-04, 2026-10-11, 2026-10-18 (plus the 09-06 / 09-13 / 09-20 misses already recorded).  
**Gameplay / production code:** not modified.

This audit judges whether automations improved the **shipped** game and codebase. Volume of PRs, docs, and ACTION_IDs is not a success metric. A correct “no justified change” is more valuable than another unmerged draft.

## Evidence sources

| Source | What it covered |
| :--- | :--- |
| Cursor cloud agents (`source=automations`, `includeArchived=true`) | **436** runs in the window (53 IDs in the 400-run Oct 21–25 slice; page-3 remainder is the Oct 18–21 tail). 226 of the 400 sampled runs started in hour **00 UTC**. |
| GitHub `Mr-Melic/stralt` | `list_commits` on `main` since 2026-10-18 = **[]**. PR search `created:2026-10-18..2026-10-25` = **292** (all drafts). `is:merged` / `is:closed` in the window = **0**. `is:pr is:open` = **774**. Last merged quality-audit PR is still #112; #713 remains open. |
| Sampled run diffs (`batch-fetch-details`) | #62 PRs #831/#901/#961/#995/#1076; map #1103/#1093; persist #1092; combat-parity #1098; invariants #1100; orchestrator #1105/#1096; regression #1104; adversarial #1097; contract/security/latest-critical: **no PR**. |
| Repo docs on this HEAD | `AGENTS.md`, `README.md`, `DESIGN.md`, `docs/ARCHITECTURE.md`, `docs/TROUBLESHOOTING.md`, ACTION_ID files through 2026-09-03 |
| Player telemetry | **None.** `longHorizonSim.test.ts` still asserts `report.telemetry.available === false`. |

Formal `git revert` commits on `main` this week: **0** (there were no `main` commits). Closed-unmerged week PRs: **0**. GitHub issues as an ACTION_ID queue: none. The live queue is **774 open draft PRs**.

---

## The week in one sentence

After a two-week near-outage, the flock resumed at ~87 runs/day and doubled the unmerged backlog; **`main` has not moved in 52 days**, so none of this improved the game.

| Metric | 2026-08-23→30 | 2026-09-20→27 | 2026-10-18→25 (this week) |
| :--- | ---: | ---: | ---: |
| Automation runs | 245 (16 IDs) | 609 (55 IDs) | **436** (53 IDs; 11 ERROR-only runs in the prior 14 days) |
| PRs opened in window | ~98 | 379 | **292** (all drafts) |
| Merged in window | High (`#1`–`#332` class) | **0** | **0** |
| Closed unmerged | 11 | 1 (`#655`) | **0** |
| Open drafts at audit time | 10 | 380 | **774** |
| `main` HEAD age | Same-day | 24 days | **52 days** (`#332` on 2026-09-03) |
| `WorldExploration.tsx` on `main` | 19,502 | 19,213 | **19,213** (unchanged) |
| Player telemetry | None | None | **Still none** |

Daily volume inside the productive slice: 21st 53 → **22nd–25th 86–87/day**. That matches the Sep 20–27 plateau. **226 / 400** sampled runs started at 00 UTC — `MTD-2026-08-31-001` is still the schedule, not a burst.

Between 2026-10-04 18:00 and 2026-10-19 00:00 the listing returned **11 runs, all ERROR**. The ecosystem was dark for two weeks, then dumped another 292 drafts onto a queue that was already un-reviewable.

Do **not** treat new hunter PRs as shipped improvement while SHA is `0f5363f`.

---

## Architecture this audit used (do not rediscover)

Live `docs/ARCHITECTURE.md` + `AGENTS.md` on `0f5363f`:

- Canonical actor is `src/backend/main.mo`. 12-field `CharacterStats`. No character level cap. XP curve `100 * 2^(N-1)`.
- Credits go through `applyRewards` (clamped: `dokaDelta > 100_000`, `xpDelta > 500_000`). Heals/spends/death still use `saveBattleStats` on `createProgressPersist`. Treating that Doka write as accidental remains **wrong**.
- `processPendingPurchases` is a signature-kept no-op. Paid Doka is GameKey.
- EOP chain includes frozen `20260831_000000` (no GameKey) and later `20260901_000000` (GameKey). Live `mops.toml` `check-limit = 5`. `docs/ARCHITECTURE.md` line 28 still says `check-limit = 4` while line 452 says `5` — **internal doc contradiction on `main`**, unchanged since Sep 27.
- Do not touch RAF, map generation, turn logic, or damage math. Spell targeting uses explicit metadata.
- Player-relative enemy generation, evolving AI/spell pools, observation/discovery, Draft → Validate → Activate, and pixel visual fallback are still the product rules. Spell-discovery into the live book is **still not implemented**.
- WX on `main` already composes 36 `engine/*` imports (`spawnPolicy`, `portalRules`, `occupancy`, `combatantStore`, `summon*`, `targeting`, `barrierRender`, …). `enemyWander.ts` is still **26 lines** (RAF skip only). `groundDokaSpawn.ts` / `isoGrid.ts` / `spriteHitTest.ts` still **do not exist on `main`**.

---

## Per-automation evaluation

Classifications require evidence. KEEP means the job is still justified, not that the current cadence is.

### Implementer flock

#### Find Critical Gameplay Bugs — `1aa41c6c-a483-11f1-a7d1-d6b4613131ce`

**Runs (Oct 21–25 slice):** 38. **Latest sampled PRs:** one no-PR (`bc-8449600b`, `bc-0f1f6405`); the flock still opened a dense `fix(combat)` stream. **Merged:** 0.

| Dimension | Assessment |
| :--- | :--- |
| Useful defects | Kit-level holes on **frozen** `main` can be real (Pale Archivist shadowing, leftover-walk soak). They are not new *classes* vs Sep 27. |
| Efficiency | 38 full combat inspections of `0f5363f`. Title mill: 12 “Pale Archivist kit-first … from shadowing …” PRs this week; 28 “pack-enemy” PRs. Combinatorial triggers, not 28 P0s. |
| Follow-through | **Zero.** Private backlog only. |
| Overlap | Combat parity, adversarial QA, regression hunter, and (new this week) **invariants**. |

**Classification: REDUCE_FREQUENCY + UPDATE_PROMPT** (AQA-2026-08-30-001 reused). Cap at **one run per 24h**. Uniqueness vs open PR titles from the last 7 days. Two no-PR samples today are the right behaviour — the other 36 runs did not copy it.

#### Generated map integrity — `9dcfd122-a484-11f1-a7d1-d6b4613131ce`

**Runs:** 20 in the Oct 21–25 slice. **GitHub:** 90 PRs matching `fix(map)` created this week; 29 titles matching `snap ` leftover-crumbs. Sample diffs: `#1103` +1488 / 2 files, `#1093` +1136 / 2 files.

`AGENTS.md` still forbids map generation edits. `AQA-2026-08-30-006` asked for **0 implementation PRs**. This week is **worse** than Sep 27’s 27 map drafts.

**Classification: PAUSE implementation + UPDATE_PROMPT + REDUCE_FREQUENCY.** Report-only + failing seed fixtures. Close or hold the map stack. Success next week = **0** `fix(map)` implementation PRs.

#### Concurrency / persistence audit — `607e0304-a484-11f1-a7d1-d6b4613131ce`

**Runs:** 19. **GitHub:** 18 “skip remount leftover-XP wipe after … keep” titles; 143 PRs matching `leftover`; 75 matching `persist`. Sample: `#1092` +1174 (one-shot Doka keep following portal XP throw); `#1099` same mill, different trigger suffix. One sampled run (`bc-d9f1b406`) correctly opened **no** PR.

This is still one race (absolute `saveBattleStats` / remount cutting a higher persist-lock snapshot) with a combinatorial suffix matrix. Architecture still requires `saveBattleStats` Doka writes for heals/spends/death.

**Classification: UPDATE_PROMPT + REDUCE_FREQUENCY** (AQA-2026-08-30-010 reused). One characterization helper. ACTION_ID for trigger variants.

#### Combat rule parity — `f37b7505-a484-11f1-a7d1-d6b4613131ce`

**Runs:** 14. **GitHub:** 108 `fix(combat)` PRs this week (shared with the hunter). Sample `#1098` +1171: “share summon-archer LoS-reposition with Slow fallback”; siblings Poison / Frost / Strike / wounded-retreat / auto-summon.

Preview vs execute is a real class. Kit-by-kit every few hours on frozen `main` is the mill.

**Classification: UPDATE_PROMPT + REDUCE_FREQUENCY.** Weekly parity matrix; at most one unique mismatch PR per week while the queue is >30.

#### Stralt system invariants — `72eb90fe-a483-11f1-a7d1-d6b4613131ce`

**Runs:** 29 (+ early-week ERROR `bc-7e81121b`). **Sep 27:** 41 runs, **0 PRs** — the best implementer-adjacent behaviour that week. **This week:** `#1100` `fix(combat): soak leftover-walk lava and spikes like playerTakesDamage` (+495). Adversarial QA opened the sibling `#1097` soak for Thorned Ground / Void Rift the same afternoon.

The KEEP rating from Sep 27 is **revoked**. Re-deriving invariants against an unchanged SHA and then implementing a soak already in the hunter/adversarial mill is wasteful duplication, not independent verification.

**Classification: UPDATE_PROMPT + REDUCE_AUTONOMY + REDUCE_FREQUENCY.** Skip entirely when `origin/main` SHA is unchanged. Stay report-only. Independent verification means **not** opening the third soak PR.

#### Report findings orchestration — `68f2958f-a489-11f1-a7d1-d6b4613131ce`

**Runs:** 19. Sampled PRs: `#1105` Pale Archivist Cursed Wound test; `#1096` summon-archer LoS-reposition with Poison (+1014). Still implementing (`AQA-2026-08-30-009` unmet). Pale Archivist tests are a lock-suite, not a merge-order ledger.

**Classification: UPDATE_PROMPT + REDUCE_AUTONOMY.** Ledger + keep/close list until open drafts < 30.

#### Economy & exploit hunter — `1e548d83-a485-11f1-a7d1-d6b4613131ce`

**Runs:** 15 (1 ERROR). Overlaps persist leftover-XP / unpaid death. Clamps already on `main`.

**Classification: KEEP + UPDATE_PROMPT** (dedup vs open persist PRs; skip clamp rediscovery) + REDUCE_FREQUENCY.

#### Adversarial QA — `08e7de28-a486-11f1-a7d1-d6b4613131ce`

**Runs:** 9. Sample `#1097` soak battle-walk Thorned Ground / Void Rift (same soak class as invariants `#1100`). Distinct *angle* in principle; this week it filed the same PR family.

**Classification: UPDATE_PROMPT.** ACTION_IDs when a hunter already drafted the fix.

#### Regression investigation — `1f90a60d-a484-11f1-a7d1-d6b4613131ce`

**Runs:** 20 (1 ERROR). Sample `#1104` `fix(combat): share boss kit damage execute with advertised CHC` (+482). There were **no merges to regress**. “Regression” on a frozen tree is just a fourth combat hunter.

**Classification: UPDATE_PROMPT + REDUCE_FREQUENCY.** Report-only unless a merged fix actually regressed on `main`.

#### Defect recurrence prevention — `81c2e934-a485-11f1-a7d1-d6b4613131ce`

**Runs:** 14 (1 ERROR). Pale Archivist `test:` locks (`#1102`, `#1089`, …) overlap orchestrator `#1105`. Targeted tests are healthier than occupancy clones; merge rate still **0**; 12 Archivist variants is a test mill.

**Classification: KEEP + REDUCE_FREQUENCY.** Run after merges. One lock per unfixed contract, not one PR per shadowed spell id.

#### Interface consistency / contract guardian — `4fba3a56-a485-11f1-a7d1-d6b4613131ce`

**Runs:** 14. Sampled run: **no PR**. Correct no-op against frozen bindgen/`main.mo`.

**Classification: KEEP + REDUCE_FREQUENCY** (weekly while `main` is unchanged).

#### Security audit — `c97e5c0c-a485-11f1-a7d1-d6b4613131ce`

**Runs:** 9. Sampled run: **no PR**. Better than Sep 27’s leftover ads PR. Still no persist-trust ADR (`AQA-008`). Shop 60s auto-complete remains obsolete.

**Classification: KEEP + REDUCE_FREQUENCY** (weekly). UPDATE_PROMPT: decided vs open; finding 3 is unbounded absolute values, not “must not write Doka.”

#### Admin safety audit — `7e907066-a499-11f1-a7d1-d6b4613131ce`

**Runs:** 9. Distinct from combat. During a 774-deep freeze it is still another AdminDashboard stack.

**Classification: KEEP + REDUCE_FREQUENCY** (one unique admin invariant per week while queue is deep).

---

### Code Modularity & Complexity Reduction Engineer — `#62` / `386a157d-a4a5-11f1-a7d1-d6b4613131ce`

**Official name:** Code Modularity & Complexity Reduction Engineer.  
**Week run titles:** Module complexity reduction / Code modularity reduction / Code architecture improvement.  
**Runs:** **5** (daily 00 UTC Oct 21–25; 4 in the 400-run slice + `bc-9e82851c` on the Oct 21 tail).  
**Open PRs:** 5, all `refactor(engine): extract … from WorldExploration`. **Merged:** 0.  
**Sep 27 ask (AQA-2026-09-27-003):** 2–3×/week; no `AGENTS.md` edits; cap ~400 production lines; prefer extending `spawnPolicy` / `portalRules` / `statusEffects` / `enemyWander`; skip WX extracts while >30 WX drafts are open.

Cadence improved only from 7 → 5 because of the Oct 4–18 outage, not because the prompt changed. Daily resumed Oct 21.

#### Week refactors (every one unmerged; behaviour claimed unchanged)

| PR | TARGET | BEFORE_RESPONSIBILITY | EXTRACTED_RESPONSIBILITY | NEW_MODULES | BEFORE_LINES (WX on `main`) | AFTER_LINES (claimed) | PR +/− | TESTS_ADDED | COMPLEXITY_REDUCTION | REGRESSION_RESULT | FUTURE_BENEFIT |
| :--- | :--- | :--- | :--- | ---: | ---: | ---: | ---: | :--- | :--- | :--- | :--- |
| `#831` | Dust-mote seed/recycle | Inline WX RAF dust | Pure `dustMotes.ts` | `dustMotes.ts` | 19213 | ~19183 (WX −30 net) | +402/−51, 3 files | `dustMotes.test.ts` (+257) | Cosmetic render helper. Not combat/persist/portal. | Unmerged | Low |
| `#901` | Portal whirlpool paint | Inline WX portal draw | `portalWhirlpool.ts` | `portalWhirlpool.ts` | 19213 | WX −167 draw, +1 import | +399/−171, **5 files** | `portalWhirlpool.test.ts` (+165) | Paint-only. **Docs drive-by** on `README.md` + `docs/ARCHITECTURE.md`. | Unmerged | Low; docs hunks fight the stack |
| `#961` | Pixel-pattern paint | Inline WX pattern fill | `pixelPattern.ts` | `pixelPattern.ts` | 19213 | WX −25 net | +286/−30, 4 files | `pixelPattern.test.ts` (+168) | Paint-only. **README drive-by**. | Unmerged | Low |
| `#995` | Isometric tile paint | Inline WX `drawIsometricTile` | `tilePaint.ts` (**498** lines) | `tilePaint.ts` | 19213 | WX −367 net | **+935/−384**, 3 files | `tilePaint.test.ts` (+420) | **DIFF SIZE CREEP.** RAF-adjacent core renderer. Closest to FAKE MODULARITY: WX still owns when/what to paint. | Unmerged | Medium testability / **high** merge risk vs hunters |
| `#1076` | Hazard overlay paint | Inline WX lava/ice/spikes overlay | `mapHazardPaint.ts`; WX keeps `hazardTiles` lookup | `mapHazardPaint.ts` | 19213 | **19117** claimed | +627/−115, 3 files | **18** characterization tests (+400) | Best of *this* week: explicitly not folded into `hazardStep` (walk tax) or `tilePaint`. Still **paint**, not domain. | Unmerged | Medium if landed **after** queue drain |

WX net in the best paint extract (`#1076`) is −96 lines of overlay draw. Combat, persist, portals, death, and spawn policy on `main` did not move.

#### Harmful-pattern watch

| Pattern | This week |
| :--- | :--- |
| FILE EXPLOSION | **Yes.** Five new paint modules in five days (`dustMotes`, `portalWhirlpool`, `pixelPattern`, `tilePaint`, `mapHazardPaint`). Navigation cost rises; none are on `main`. |
| FAKE MODULARITY | **Yes for paint.** Callers still pass iso screen anchor + RAF clock. `#1076` body: “forwards the iso screen anchor plus the render-loop clock so lava pulse stays in sync.” Extraction without a new domain boundary. |
| MEGA-HOOKS | Not observed. |
| PASS-THROUGH | Tile/whirlpool/dust extracts are mostly move-the-function. |
| UTILS DUMPING GROUND | Avoided (engine-named files). |
| REFACTOR CHURN | Strategy churn vs Sep 27: last week’s best extracts were `statusEffects` / `spawnPolicy` / `enemyWander` / `groundDokaSpawn`. This week **abandoned those domains**. `enemyWander.ts` is still 26 lines on `main`. `groundDokaSpawn.ts` still absent. |
| DIFF SIZE CREEP | `#995` +935. Exceeds the ~400 production-line cap from AQA-2026-09-27-003. |
| RAF / AGENTS.md | All five touch the render path `AGENTS.md` says not to rewrite. `#901`/`#961` still edit docs (the exact drive-by #427/#468 were scored for). |
| Simultaneous WX writers | Daily #62 vs critical / persist / map / combat-parity / **invariants** drafts. Schedule conflict unchanged. |

No production regression can be attributed to #62 (nothing merged). Failure mode if unordered merge: **OVERLARGE_DIFF** (`#995`), **BAD_BOUNDARY** if `tilePaint` and `mapHazardPaint` land against hunter WX hunks, **INCORRECT_BEHAVIOUR_ASSUMPTION** if overlay clock drifts from row shimmer.

Sep 27 named `#683` (ground Doka, 11 tests, persist ownership left in WX) as the week’s best. That PR is **still open**. This week did not stack on it. That is the modularity failure, not “WX is still 19k lines.”

#### WORLD_EXPLORATION_COMPLEXITY_TREND: **STABLE** (shipped) / **WORSENING** (extractor strategy)

| Date | WX lines on `main` | Note |
| ---: | ---: | :--- |
| 2026-08-30 audit | 19,502 | |
| 2026-09-02 | 19,253 | Extracts + fixes |
| 2026-09-03 `0f5363f` | **19,213** | Last WX commit |
| 2026-09-27 audit | 19,213 | Seven domain extracts as drafts |
| 2026-10-25 | **19,213** | Five **paint** extracts as drafts; domain extracts still unmerged |

Shorter WX is not the goal. Desired: WX as orchestration, domain in `spawnPolicy` / `portalRules` / death / persist / targeting / enemy lifecycle. This week moved **pixels**. Cognitive complexity of combat/persist in the live file is therefore **STABLE**. The extractor’s own strategy is **WORSENING** (paint mill + file explosion + RAF adjacency).

If #62 repeatedly touches WorldExploration but cognitive complexity is not genuinely decreasing: **change its strategy** (already asked 2026-09-27; now evidenced).

#### #62 frequency decision: **TEMPORARILY PAUSE** WX extracts, then **REDUCE FREQUENCY** (not KEEP DAILY)

Pause because:

1. Open drafts **774** (was 380). Another daily WX PR cannot land.
2. Hunters, map integrity, persist, combat parity, **and now invariants** rewrite the same file.
3. Last five extracts are RAF-adjacent paint, not the remaining domain candidates (`enemyWander` still 26 lines; `#514`/`#591`/`#683`/`#369` still open).
4. `#995` shows DIFF SIZE CREEP.

Do not permanently stop architectural improvement. After a human keep/close pass (open drafts < 30 **or** WX-touching drafts < 10):

- Resume **2–3×/week**.
- Tests first; no `README`/`AGENTS.md`/`ARCHITECTURE` hunks; production diff cap ~400 lines.
- Prefer extending `spawnPolicy` / `portalRules` / `statusEffects` / `enemyWander` / `occupancy` / persist helpers.
- Skip paint/RAF until domain extracts from Sep 21–27 land or are closed as superseded.
- Skip if `origin/main` SHA unchanged **and** the last extract is still OPEN.

**ROI:** **LOW** this week (paint mill, zero landings) / **MEDIUM** long-term **only if** strategy returns to domain boundaries. Paint-file explosion without landings trends **NEGATIVE**.

---

### Design / docs specialists

Daily date-stamped catalogs resumed after the outage. GitHub this week: **170** PRs matching `docs:`; **56** matching `Wave`; **60** matching `design only`; **6** matching `WAITING_FOR_TELEMETRY`. Search for `"no justified"` = **0**. Specialists are not logging skip; they are cloning yesterday’s file with a new date.

| Automation | ID | Week runs (slice) | Classification |
| :--- | :--- | ---: | :--- |
| World mechanics design | `62dfc3fc` | 4 | **REDUCE_FREQUENCY** weekly; skip if prior wave OPEN |
| Gameplay telemetry architecture | `047ac8a1` | 4 | **PAUSE** until collectors exist |
| Telemetry admin dashboard | `4b026695` | 5 | **PAUSE** |
| Telemetry-driven balance | `2786666f` | 5 | **PAUSE** |
| Infinite progression sim | `aac69fba` | 4 | **REDUCE_FREQUENCY** weekly; do not retune XP |
| Emergent meta | `7b2f2b58` | 4 | **REDUCE_FREQUENCY**; overlap with balance + PX |
| Spell / enemy / boss / expansion / formations / AI / discovery / VAL / WDEAD / MIMA / GFCF / PX | various | 4–5 each | **REDUCE_FREQUENCY** to weekly |
| Master technical direction | `0b92479e` | 4 | **KEEP** weekly (not daily) |
| Documentation repository state | `013ac98d` | 5 | **KEEP** + REDUCE_FREQUENCY |
| Codebase audit | `d449111b` | 4 | **UPDATE_PROMPT**: refuse to reopen an OPEN identical chore |
| Admin dashboard audit ×2 | `48eb1df6`, `b1bc1d63` | 5+5 | **MERGE** (AQA-2026-09-27-006 unmet) |
| Admin visual management | `3089f18d` | 5 | **MERGE** into the single admin UX auditor |
| Approved design recommendations | `fe5b679a` | 5 | **KEEP** (historically 0 PRs during freeze; not the paint mill) |
| Content retirement | `66fd8624` | 1 | **KEEP** (sparse; `#1101` docs-only audit) |
| Game balance | `3c083a4a` | 4 | **REDUCE_FREQUENCY**; no telemetry → no number changes |
| Player data evolution | `469b7020` | 5 | **UPDATE_PROMPT** (overlaps persist; `#1083` dated persist tests) |
| Mobile/a11y | `c8f71c67` | 5 | **KEEP** + REDUCE_FREQUENCY |
| UX audit | `96624677` | 4 | **KEEP** + REDUCE_FREQUENCY; overlap with a11y / feel / orchestrator |
| Runtime performance | `4191af8a` | 5 | **KEEP** + REDUCE_FREQUENCY |
| Admin feature drift / regression gate | `e4d996b0` / `67820d12` | 4 / 5 | **KEEP** weekly |
| Engineering summary | `d066ac72` | 4 | **KEEP** weekly (narrative vs this auditor) |
| Maintainability / codebase debt | `637c51d2` | 4 | **KEEP** as read-only; #62 remains the only WX extractor |
| This Quality Auditor | `976261d8` | this PR | **KEEP** weekly. Cron missed Oct 4/11/18 — AQA-2026-09-27-005 still OPEN |

---

## Overlap analysis

| Group | Independent verification? | This week |
| :--- | :--- | :--- |
| Critical hunter vs Invariants vs Regression vs Adversarial QA vs Combat parity | **Was** useful (P0 vs invariant vs merge-regress vs attacker vs preview/execute) | **Wasteful.** `main` did not move. Invariants **lost** the 0-PR discipline and filed soak `#1100` beside adversarial soak `#1097` and hunter leftover-walk work. Regression filed CHC share `#1104` beside parity LoS-share mill. |
| Persist auditor vs Economy vs Player-data evolution | Same persist-lock / leftover-XP / GameKey surface | **Wasteful.** 18 leftover-XP remount titles. |
| Map integrity vs occupancy/combat vs #62 wander | Solvability vs landing vs extraction | Map integrity still punches `mapGen` (90 `fix(map)` hits). #62 did not touch wander. **Wasteful** on the map side. |
| Architecture debt vs #62 vs codebase audit | Read-only vs extract vs dead CSS | #62 should remain the **only** WX writer. This week it wrote paint, not domain. |
| UX vs Game feel vs PX vs a11y vs orchestrator | Journey vs juice vs identity vs touch vs triage | Partial health, collapsed into HUD/recap/shop chrome plus Pale Archivist tests. |
| Balance vs Telemetry-balance vs Emergent meta vs Long-horizon | Numbers vs measured numbers vs meta vs XP | **Wasteful until telemetry exists.** Six WAITING_FOR_TELEMETRY clones this week. |
| Admin safety vs dashboard audit ×2 vs visual mgmt vs drift vs regression vs content-admin design | Guard vs UX vs pixels vs drift vs gate vs catalogs | Too many. **MERGE** dashboard UX bots; keep safety-guard separate. |
| Quality Auditor vs Engineering summary vs Master director | Process vs narrative vs roadmap | **Healthy** if director stays weekly. This auditor’s own reports are not landing (#713 still draft). |

Healthy independent verification this week: **contract guardian** (no PR) and **security** (no PR on the sampled run). Everything else that opened a combat/persist/map PR against `0f5363f` is a duplicate writer.

---

## ACTION-ID health

On `main`, ACTION_ID files still stop at **2026-09-03**. PR #713’s `ACTION_IDS_2026-09-27.md` never merged, so later agents reading `main` cannot see Sep 27 statuses. Producers still mint dated IDs inside unmerged PRs.

| Failure | Evidence |
| :--- | :--- |
| Same problem, many IDs / titles | Leftover-XP remount ×18; pack-enemy LoS/retreat ×28; Pale Archivist shadowing ×12; map `snap … leftover crumbs` ×29. |
| Same ID restated, never executed | `MTD-2026-08-31-001`, `AQA-006`, `AQA-012`, `AQA-009`, `AQA-010` still BROKEN. Draft count 380 → **774**. |
| Stale NEW on `main` | `ACTION_IDS_2026-08-30.md` still marks AQA-001…012 NEW. #713’s SUPERSEDED notes never landed. |
| Already fixed, still discussed | Shop 60s; `applyRewards` clamps; `996df6df` hunter. |
| Endlessly deferred | Telemetry collectors; spell discovery `SDA-002/004`; mapGen freeze; flock halt; persist-trust ADR. |
| Contradictory | Map integrity implements punches; `AGENTS.md` forbids mapGen; auditor said PAUSE; all three still true. |
| Auditor ledger itself stale | The only prior weekly audit still on `main` is 2026-08-30. Four missed Sundays after Sep 27. |
| Duplicate dated files | Wave 17/18 design-only PRs the same hour (`#1082`, `#1080`). |

**Consolidation:** one living ledger. Daily specialists update **status** of existing IDs. Do not open a new dated file when the finding is unchanged. Close IDs when `main` contains the fix **or** the finding is obsolete.

Search `"no justified"` among this week’s PRs = 0. The ecosystem has no skip artefact other than a silent no-PR run (contract/security did this; most others did not).

---

## Prompt drift vs live architecture

Still accurate when prompts cite `AGENTS.md`: 12-field stats, leftover XP curve, persist lock, GameKey vs shop 60s, no level cap, Draft → Validate → Activate, pixel fallback.

Drift still in circulation:

1. **Map generation is implementable** — 90 `fix(map)` hits vs `AGENTS.md` line 5.
2. **`saveBattleStats` Doka write is a bug** — architecture requires it; the race is cutting a higher lock snapshot.
3. **`docs/ARCHITECTURE.md` `check-limit = 4`** (line 28) vs live `mops.toml` **5** and the same file’s line 452. Automations citing line 28 will mis-count the chain.
4. **Telemetry exists if a dashboard specialist ran** — `telemetry.available === false`.
5. **Paint extraction is a modularity win** — #62’s prompt allowed “small extraction”; this week it interpreted that as RAF overlays. Domain candidates from Sep 27 were ignored.
6. **Invariant checking implies a fix PR** — 72eb90fe crossed that line.
7. **Oldest-first stack is someone else’s problem** — 774 drafts. Prompts must say: **if >N open drafts targeting WX/mapGen/persist, do not implement**.
8. **Regression hunting on a freeze** — no merges ⇒ no regressions to hunt.

---

## Outcome quality (telemetry)

No player population, encounter, cancel, spell-pick, or error series exists. **Do not attribute live outcomes to automations.** Shipped code on `main` **did not change this week** (or any week since 2026-09-03).

| Change class | Classification | Why |
| :--- | :--- | :--- |
| Persist / wallet / death / GameKey | **NO_MEASURABLE_EFFECT** | Leftover-XP mill exists only as drafts. |
| Combat kit / preview-execute / summons | **NO_MEASURABLE_EFFECT** | 108 `fix(combat)` drafts, 0 merges. |
| Map solvability | **NO_MEASURABLE_EFFECT** / process **POSSIBLE_NEGATIVE_EFFECT** | 29+ snap/punch drafts waiting to conflict with occupancy. |
| UX / a11y / feel | **NO_MEASURABLE_EFFECT** | Unmerged. |
| Spell balance / meta / discovery pacing | **NO_MEASURABLE_EFFECT** | Design-only Waves 17–18. |
| Enemy expansion | **NO_MEASURABLE_EFFECT** | Catalog PRs, not activation. |
| Performance | **NO_MEASURABLE_EFFECT** | Unmerged. |
| #62 modularity | **NO_MEASURABLE_EFFECT** on players; paint extracts are **not** LIKELY_POSITIVE for testability of combat/persist | Characterization tests of canvas fill do not unlock safer persist changes. |
| Security posture | **INCONCLUSIVE** this week | Sampled security run opened no PR; no ADR. |
| Automation-driven stability of `main` | **POSSIBLE_NEGATIVE_EFFECT** (process) | 774 drafts. Oldest-first merge is a lottery. Two-week ERROR outage then 87 runs/day. |
| #62 strategy | **POSSIBLE_NEGATIVE_EFFECT** (process) | Paint-file explosion increases future union cost without reducing WX cognitive load. |

No **CLEAR_POSITIVE_SIGNAL** or **CLEAR_REGRESSION** in the shipped game. The Oct 4–18 ERROR outage is infrastructure, not a product finding.

---

## Follow-through on prior auditor ledgers

| ID | Ask | Status 2026-10-25 |
| :--- | :--- | :--- |
| MTD-2026-08-31-001 flock halt | ≤3 gameplay PRs/wave | **BROKEN.** 436 runs; 87/day; 226 at 00 UTC; 292 new PRs. |
| AQA-2026-09-27-001 queue lifecycle | drafts < 50 | **BROKEN.** 380 → **774**. 0 closed this week. |
| AQA-2026-08-30-001 throttle hunter | ≤7 runs/week | **BROKEN.** 38 runs in four days. |
| AQA-2026-08-30-002 merge hunters | one critical ID | **PARTIAL** (still one ID, still too hot). |
| AQA-2026-08-30-006 mapGen report-only | 0 mapGen PRs | **BROKEN** (worse: 90 `fix(map)` hits / 29 snap titles). |
| AQA-2026-08-30-009 orchestrator ledger-only | 0 gameplay PRs | **BROKEN** (`#1105`, `#1096`). |
| AQA-2026-08-30-010 one persist race | no wipe-after-keep mill | **BROKEN** (18 leftover-XP remount titles). |
| AQA-2026-09-27-002 stop docs clones | ≤1 docs PR per specialist | **BROKEN** (170 docs / 56 Wave / 60 design-only). |
| AQA-2026-09-27-003 #62 2–3×/week | ≤3 PRs; no docs hunks; no >400-line extract | **BROKEN** (5 daily paint PRs; `#995` +935; `#901`/`#961` docs). |
| AQA-2026-08-30-012 telemetry counters | persist-ok/fail | **OPEN** (`available === false`). |
| AQA-2026-09-27-004 ACTION_ID lifecycle | status updates on `main` | **OPEN** (#713 never merged; `main` ledger frozen 09-03). |
| AQA-2026-08-30-008 persist-trust ADR | write the decision | **OPEN**. |
| AQA-2026-09-27-005 auditor cron | fire next Sunday | **PARTIAL.** Fired 2026-10-25; missed 10-04 / 10-11 / 10-18. |
| AQA-2026-09-27-006 merge admin dashboard auditors | one ID | **OPEN** (`48eb1df6` + `b1bc1d63` both ran ×5). |
| SDA-2026-08-31-002 / 004 | discovery in the live book | **OPEN** (Wave 17 is another design PDF). |

High-value ignored actions are still **halt the flock**, **stop mapGen implementation**, **one persist race PR**, **build telemetry**, and **human merge/close of the draft queue**. Automations cannot change their own dashboards. Humans stopped merging on 2026-09-03 and stopped closing on 2026-10-18 (0 closes this week).

---

## Engineering ROI (qualitative)

| Automation / class | ROI this week | Why |
| :--- | :--- | :--- |
| Contract guardian, security (sampled no-PR) | **MEDIUM** | Correct “no justified change” on frozen `main`; still over-run |
| Invariants | **NEGATIVE_ROI** | Lost the 0-PR discipline; third soak writer |
| #62 paint extracts | **NEGATIVE_ROI** now / MEDIUM only if strategy reverts | File explosion, RAF adjacency, zero landings |
| Critical hunter unique kit bugs | **LOW** | Real findings possible, 38 re-inspects, 0 landings |
| Persist leftover-XP mill | **NEGATIVE_ROI** | Same race, 18 drafts |
| Map integrity implementations | **NEGATIVE_ROI** | Forbidden surface; +1100–1500 line diffs |
| Combat-parity / pack-enemy mill | **NEGATIVE_ROI** | Combinatorial LoS fallbacks |
| Daily design/telemetry clones | **NEGATIVE_ROI** | 170 docs PRs |
| Pale Archivist test mill | **LOW** | One contract, 12 PRs |
| This auditor | **MEDIUM** | First signal in four weeks; previous report still unmerged (#713) |
| Content retirement (1 run, docs) | **MEDIUM** | Sparse cadence is the model others should copy |

---

## Weekly automation health report

### 1. AUTOMATIONS PERFORMING WELL

- **Contract/interface guardian** (`4fba3a56`): sampled no-PR against frozen bindgen.
- **Security** (`c97e5c0c`): sampled no-PR; weekly is enough.
- **Content retirement** (`66fd8624`): 1 run, docs-only `#1101`.
- **Approved-design implementer** (`fe5b679a`): historically the correct freeze no-op; keep it that way.
- **Two sampled critical-hunter runs** that opened **no** PR — that is the bar the other 36 missed.
- **This auditor’s existence** (weekly). Cadence is right; landing the report is not.

### 2. AUTOMATIONS NEEDING PROMPT CHANGES

- Map integrity: report-only unless a named seed is human-approved.
- Critical hunter, combat parity, persist, economy, adversarial QA, regression, **invariants**, orchestrator: uniqueness vs **open PRs**; skip implement if `origin/main` unchanged **and** an OPEN PR already names the theme.
- #62: **stop paint/RAF extracts**; no docs hunks; cap diff size; stack onto `spawnPolicy` / `enemyWander` / `statusEffects` / `portalRules` / `#683` ground Doka; skip while >N WX drafts are open.
- Codebase audit: never reopen an OPEN identical chore.
- Security: decided vs open; shop 60s is closed.
- Design specialists: if yesterday’s dated report is still OPEN, do not open a PR.

### 3. AUTOMATIONS NEEDING FREQUENCY CHANGES

- **REDUCE** midnight flock: critical, persist, map, combat parity, orchestrator, adversarial, regression, economy, invariants from many-per-day → **≤1/day** or pause while drafts >30.
- **REDUCE** all daily design/docs specialists → **weekly**.
- **TEMPORARILY PAUSE** #62 WX extracts; then **2–3×/week** on domain, not paint.
- **PAUSE** telemetry architecture / dashboard / TBC until AQA-012 collectors exist.
- **PAUSE** map integrity **implementation**.
- **KEEP weekly:** this auditor, changelog, director, security, contract guardian, content retirement.
- **No INCREASE_FREQUENCY.**

### 4. AUTOMATIONS WITH EXCESSIVE OVERLAP

Highest waste this week: persist×economy×player-data (leftover-XP); combat×critical×adversarial×parity×**invariants** (soak + LoS-share); telemetry×balance×meta; two admin-dashboard auditors + visual management; UX×feel×PX×orchestrator; #62 paint vs hunter WX rewrites.

### 5. AUTOMATIONS CAUSING REGRESSIONS

None **on `main`** (no merges, no reverts, 0 closes). Process regressions:

- Invariants becoming a third combat implementer.
- #62 paint-file explosion (future union cost).
- Map integrity +1100–1500 line `mapGen` diffs.
- Two-week ERROR outage then 87 runs/day (whiplash).

ERROR runs (economy, tests, regression, early invariants/critical) look like infra — not treated as product findings.

### 6. HIGH-VALUE ACTIONS BEING IGNORED

- `MTD-2026-08-31-001` flock halt  
- `AQA-2026-09-27-001` 774-draft triage (was 380)  
- `AQA-006` mapGen report-only  
- `AQA-012` backend-authoritative counters  
- `AQA-008` persist-trust ADR  
- `SDA-002/004` spell observation/discovery (product, not Wave 17)  
- Land or close #713 so later auditors are not invisible on `main`  
- Human merge/close of the draft queue

### 7. STALE ACTIONS TO CLOSE

- `AQA-2026-08-30-004` (already SUPERSEDED; still NEW on `main` because #713 never merged)  
- Shop 60s auto-complete / throttle-`996df6df`-as-if-present  
- Any ACTION_ID that asks to add `applyRewards` clamps (already on `main`)  
- Duplicate dated telemetry/balance IDs that only change the calendar day  
- Sep 27 #62 extracts that this week superseded with paint (`#369`/`#514`/`#683` should be **kept or explicitly closed**, not silently abandoned)

### 8. ARCHITECTURAL HOTSPOTS

- `WorldExploration.tsx` **19,213** — orchestration hotspot; freeze is process-only  
- `mapGen.ts` **1,937** + 29+ pending punches  
- Persist lock callers (not `progressPersist.ts` itself, **421** lines — still the right module)  
- `AdminDashboard.tsx` **8,280**  
- Unmerged docs/combat tree choking GitHub review (774 drafts)  
- EOP/`main.mo` stables: do **not** let any automation add persistent `let`/`var` without a later chain file  

**Stable canonical boundaries to preserve:** `spawnPolicy.ts`, `portalRules.ts`, `deathGuards.ts`, `rewardResolver.ts`, `challengeCompletion.ts`, `progressPersist.ts`, `occupancy.ts`, `combatantStore.ts`, `statusEffects.ts`, `dokaPersist.ts`, `barrierRender.ts` (render-only, already extracted).

**Poor / premature boundaries this week:** `dustMotes.ts`, `portalWhirlpool.ts`, `pixelPattern.ts`, `tilePaint.ts` as five parallel paint files. Reconsider as **one** `isoPaint` domain *after* queue drain, or leave inline until domain extracts land. `enemyWander.ts` at 26 lines is *under*-grown — grow it via the still-open `#514` then `#591` **in order**, not via dust motes.

### 9. CODE MODULARITY TREND

On `main`: **STABLE / frozen.** Engine/ still has real domains with tests from August–September. Giant-module change frequency is zero because merges stopped. Duplicated domain logic accumulates in **drafts**. Pure/testable ratio of *combat/persist* would rise if `#369/#514/#683` landed; paint tests do not substitute.

### 10. WORLD EXPLORATION COMPLEXITY TREND

**STABLE** on shipped code. Extractor strategy **WORSENING** (orchestration-vs-domain stalled; paint mill). Daily WX extracts without landings do not reduce cognitive load.

### 11. TELEMETRY-SUPPORTED OUTCOMES

**INCONCLUSIVE / none.** Repeat AQA-012. Do not let TBC/GTAD/dashboard specialists claim CLEAR_POSITIVE_SIGNAL.

### 12. RECOMMENDED AUTOMATION CHANGES FOR NEXT WEEK

1. **Human:** close or supersede duplicate drafts; do **not** merge the 774 oldest-first. Prefer a handful of unique P1s if any review happens: one persist-lock characterization; `#683` or `#369` (not `#995`); one a11y; hold all `fix(map)`. Land or close **#713** so this ledger chain is visible on `main`.  
2. **Dashboard (no agent write API):** disable or stretch crons for implementers and daily design bots until open drafts < 30. Investigate the Oct 4–18 ERROR outage (11 failed runs, then 87/day).  
3. **#62:** pause WX extracts this week; when resumed, domain only, 2–3×/week.  
4. **Map integrity:** report-only.  
5. **Invariants:** revert to skip-if-SHA-unchanged; no soak PRs.  
6. **Telemetry trio:** pause.  
7. **This auditor cron:** it fired today; keep weekly; do not raise frequency because of missed Sundays.  
8. Do not start GameKey/EOP/Motoko-stable work from a specialist this week.

Actionable records: [`ACTION_IDS_2026-10-25.md`](./ACTION_IDS_2026-10-25.md).
