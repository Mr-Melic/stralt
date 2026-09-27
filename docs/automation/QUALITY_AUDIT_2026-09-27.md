# Automation quality audit — week of 2026-09-20

**Auditor:** Automation Quality Auditor (`976261d8-a49f-11f1-a7d1-d6b4613131ce`)  
**Window:** 2026-09-20 19:00 UTC → 2026-09-27 19:00 UTC (weekly cron `0 19 * * 0`)  
**This run:** `bc-6062a368-c1fe-4412-affd-a34faf62bf36`  
**HEAD inspected:** `0f5363f` (`Merge pull request #332`, 2026-09-03 00:28 UTC)  
**Prior auditor report:** [`QUALITY_AUDIT_2026-08-30.md`](./QUALITY_AUDIT_2026-08-30.md) (PR #112). **No auditor run on 2026-09-06, 2026-09-13, or 2026-09-20** (cloud-agent listing in those 19:00 UTC windows returned 0).  
**Gameplay / production code:** not modified.

This audit judges whether automations improved the shipped game and codebase. Volume of PRs, docs, and ACTION_IDs is not a success metric. A correct “no justified change” is more valuable than another unmerged draft.

## Evidence sources

| Source | What it covered |
| :--- | :--- |
| Cursor cloud agents (this environment, `source=automations`) | **609** runs in the window (55 automation IDs). Listing newest-first capped at 500 for `createdAfter=2026-09-20T19:00Z`; the missing 109 were recovered with a 2026-09-20→22 slice. |
| GitHub `Mr-Melic/stralt` | Commits on `origin/main`; PR search `created:2026-09-20..2026-09-27`; open-PR JSON (380 drafts); sample PR bodies/files for #62 and #655 |
| Repo docs on this HEAD | `AGENTS.md`, `README.md`, `DESIGN.md`, `docs/ARCHITECTURE.md`, `docs/TROUBLESHOOTING.md`, `MASTER_ROADMAP.md`, ACTION_ID ledgers through 2026-09-03 |
| Player telemetry | **None.** `longHorizonSim.ts` still reports `telemetry.available === false`. The only `WorldExploration.tsx` hit is a comment. Seven unmerged “gameplay telemetry architecture” PRs do not create collectors. |

Formal `git revert` commits on `main` this week: **0** (there were no `main` commits). Closed-unmerged week PRs: **1** (`#655`, duplicate `res_sp` shred, closed in 5 minutes). GitHub issues dedicated to ACTION_IDs: none observed as a working queue; the live queue is **380 open draft PRs**.

---

## The week in one sentence

Automations kept discovering and drafting; **nothing landed on `main` for 24 days**, so the ecosystem produced activity rather than shipped improvement.

| Metric | 2026-08-23→30 (prior audit) | 2026-09-20→27 (this week) |
| :--- | ---: | ---: |
| Automation runs | 245 (16 IDs) | **609** (55 IDs) |
| PRs opened in window | ~98 with diffs that week | **379** |
| Merged in window | High (humans merging `#1`–`#332` class) | **0** |
| Open drafts at audit time | 10 (`#100`–`#111` minus merged `#102`) | **380** (all drafts) |
| `main` HEAD age | Same-day | **24 days** (`#332` on 2026-09-03) |
| Week open-PR diff sum | n/a | **+227,055 / −4,782** across 378 still-open week PRs |
| `WorldExploration.tsx` on `main` | 19,502 lines | **19,213** (unchanged this week; last WX commit 2026-09-02) |
| Player telemetry | None | **Still none** |

Daily automation volume this week is flat at **86–88 runs/day** (65 on the 22nd in the truncated listing; 87 on the 21st). **290 runs started in hour 00 UTC** — the midnight flock that `MTD-2026-08-31-001` asked to halt is now the steady-state schedule, not a burst.

`996df6df` (the 215-run critical hunter) is **gone** (`GetAutomation` → not found). That is the one prior AQA recommendation that actually stuck. Its replacement `1aa41c6c` (“Find Critical Gameplay Bugs” / run title “Stralt critical defects”) still ran **55 times** (~8/day) and opened **23** still-open fix PRs.

---

## Architecture this audit used (do not rediscover)

Live `docs/ARCHITECTURE.md` + `AGENTS.md` on `0f5363f`:

- Canonical actor is `src/backend/main.mo`. 12-field `CharacterStats`. No character level cap. XP curve `100 * 2^(N-1)`.
- Credits go through `applyRewards` (now clamped: `dokaDelta > 100_000`, `xpDelta > 500_000` at `main.mo` 2119–2120). Heals/spends/death still use `saveBattleStats` on `createProgressPersist`. Treating that Doka write as accidental remains **wrong**.
- `processPendingPurchases` is a signature-kept no-op (`_autoCompletePendingPurchases` is `{}`; returns `0`). Paid Doka is GameKey.
- EOP chain includes frozen `20260831_000000` (no GameKey) and later `20260901_000000` (GameKey). `mops.toml` `check-limit = 5`. `docs/ARCHITECTURE.md` still says `check-limit = 4` — **doc drift on `main`**, not a live moc setting.
- Do not touch RAF, map generation, turn logic, or damage math. Spell targeting uses explicit metadata.
- Player-relative enemy generation, evolving AI/spell pools, observation/discovery, Draft → Validate → Activate, and pixel visual fallback are still the product rules. Spell-discovery into the live book is **still not implemented** (`SDA-*` remain OPEN on the 2026-09-02 director ledger).

---

## Per-automation evaluation

Classifications require evidence. “KEEP” means the job is still justified, not that the current cadence is.

### Implementer flock (gameplay / sensitive surfaces)

#### Find Critical Gameplay Bugs — `1aa41c6c-a483-11f1-a7d1-d6b4613131ce`

**Runs:** 55. **Open PRs:** 23 (branch `stralt-critical-defects`). **Merged:** 0. **Closed unmerged:** `#655` (dup of `#658`, same `res_sp` title).

| Dimension | Assessment |
| :--- | :--- |
| Useful defects | Several look like real official-client holes **on frozen `main`**: Sentinel Shield not applying to the clicked allied summon; leftover-walk heals vs live tile; catalog `res_sp` unread by `getStatModifier`; Enrage/Shield on summons. These are the kind of findings that justified the hunter in August. |
| False positives / dupes | Same-day close of `#655` vs `#658` is correct. `#709` (2026-09-27 Sentinel Shield on allied summon) restates `#597` (2026-09-25). Kit-metadata auto-summon (`#700`) overlaps combat-parity live-gate PRs. |
| Efficiency | 55 full combat inspections of a **frozen** tree. After ~day 2 the unique yield is incremental kit branches, not a new defect class. |
| Safety | Unmerged, so no production regression. 23 more WX/combat drafts make the oldest-first queue worse. |
| Follow-through | **Zero.** The hunter is writing a private backlog, not changing the game. |

**Classification: REDUCE_FREQUENCY + UPDATE_PROMPT** (AQA-2026-08-30-001 reused). Cap at **one run per 24h**. Require uniqueness vs the last 7 days of open PR titles, not only vs `main`. Do not open a second Sentinel Shield / live-tile / leftover-walk PR.

`AQA-2026-08-30-002` (merge the two hunters): **PARTIAL**. `996df6df` is gone. Do not recreate it.

#### Generated map integrity — `9dcfd122-a484-11f1-a7d1-d6b4613131ce`

**Runs:** 28 (1 ERROR). **Open PRs:** 27, all `fix(map):` / one `test(map):`. Titles are punch/unseal/destack/dump-alcove/fight-graph variants. One ERROR 2026-09-21.

This is `AQA-2026-08-30-006` still **BROKEN**. `AGENTS.md` still forbids map generation edits. The prompt still implements. Many PRs are near-duplicates of the same occupancy-seal story (`punch dump floor 2` appears 2026-09-25 and 2026-09-26 under slightly different alcove/wander/destack triggers).

Independent verification of solvability would be **report-only + seed fixtures**. Daily `mapGen.ts` patches against a 380-deep queue is wasteful duplication with occupancy/combat-parity landings.

**Classification: PAUSE implementation + UPDATE_PROMPT + REDUCE_FREQUENCY.** Keep the automation; stop opening mapGen PRs until a human authorizes a specific seed failure.

#### Concurrency / persistence audit — `607e0304-a484-11f1-a7d1-d6b4613131ce`

**Runs:** 28 (1 ERROR). **Open PRs:** 23. Dominant title family: **`skip saveBattleStats wipe after … keep`** (death-cut remount, confirmed credit, stale fetch, feat/GameKey, seeded/unseeded portal/victory/one-shot/GameKey, handleBattleEnd, small feat grant, …).

This is one defect class (unseeded/absolute `saveBattleStats` cutting a higher persist-lock snapshot) with a combinatorial trigger matrix. That is not 23 independent P0s. It overlaps Economy (`1e548d83`, 21 runs / 6 PRs, also Death Realm pending + unpaid death Doka) and Player Data Evolution (`469b7020`, persist tests/fixes).

**Classification: UPDATE_PROMPT + REDUCE_FREQUENCY** (AQA-2026-08-30-010 reused). One characterization helper + one PR per **unfixed** race. Emit ACTION_IDs for trigger variants.

#### Combat rule parity — `f37b7505-a484-11f1-a7d1-d6b4613131ce`

**Runs:** 21. **Open PRs:** 21 `fix(combat): share … with live gate`. Preview vs execute is a real class (August `#105` was already this). Doing it kit-by-kit every 8 hours on frozen `main` is the mill.

Healthy independent verification would be a **parity matrix** (highlight vs execute) updated weekly, with at most one implementation PR. Wasteful duplication with the critical hunter starts when both “share X with the live gate” and “apply advertised X” land as separate drafts (`#708` AP/cooldown share vs `#709` Sentinel apply).

**Classification: UPDATE_PROMPT + REDUCE_FREQUENCY.** Report the matrix; implement one unique mismatch per week while the queue is >30.

#### Stralt system invariants — `72eb90fe-a483-11f1-a7d1-d6b4613131ce`

**Runs:** 41. **Open PRs attributed to this branch:** **0**.

This is the best implementer-adjacent behaviour this week: it did **not** dump 41 gameplay PRs onto frozen `main`. The cost is 41 full re-derivations of the same invariants against `0f5363f`. After a no-change result, daily re-analysis of an unchanged HEAD is redundant.

**Classification: KEEP + REDUCE_FREQUENCY** (2–3×/week, or skip when `origin/main` SHA is unchanged since last run).

#### Report findings orchestration — `68f2958f-a489-11f1-a7d1-d6b4613131ce`

**Runs:** 28. **Open PRs:** 12 (UX/a11y/feel/persist/perf mix). Still implementing (`AQA-2026-08-30-009` unmet). Some items look unique and display-sized (`Feat Unlocked` toast, Inferno 3-turn cooldown copy). That is the original orchestrator exception, but **12 gameplay PRs/week** during a freeze is not orchestration.

**Classification: UPDATE_PROMPT + REDUCE_AUTONOMY.** Ledger + merge-order only until open drafts < 30. Display-only exception: one unique item, and only if no open PR already names it.

#### Economy & exploit hunter — `1e548d83-a485-11f1-a7d1-d6b4613131ce`

**Runs:** 21 (1 ERROR). **Open PRs:** 6. Real themes (unpaid death Doka per slot, BuffShop keyed by II principal, Death Realm pending vs rename/upgrade). Overlaps persist auditor. Backend `applyRewards` clamps are **already on `main`** — do not rediscover them as new work.

**Classification: KEEP + UPDATE_PROMPT** (dedup vs open persist PRs; skip clamp rediscovery).

#### Adversarial QA — `08e7de28-a486-11f1-a7d1-d6b4613131ce`

**Runs:** 14. **Open PRs:** 13. Distinct *angle* (double-click MP, Flee after last hostile, victory at live HP 0). Overlaps critical hunter + invariants. Useful as a second perspective **if** it only files ACTION_IDs when a hunter already drafted the fix.

**Classification: UPDATE_PROMPT.** Independent verification: yes. 13 extra fix PRs: wasteful.

#### Regression investigation — `1f90a60d-a484-11f1-a7d1-d6b4613131ce`

**Runs:** 27. **Open PRs:** 5 (Death Realm pending walks/heals, stale hydrate). August classification was KEEP for a correct no-op. This week it implemented again.

**Classification: UPDATE_PROMPT.** Stay report-only unless a merged fix actually regressed on `main` (there were **no** merges to regress).

#### Defect recurrence prevention — `81c2e934-a485-11f1-a7d1-d6b4613131ce`

**Runs:** 21. **Open PRs:** 6 test-lock PRs (Frozen leftover walks, kamikaze occupancy, GameKey mailto, …). This is the healthier remnant of the August test mill: tests for *named* contracts, not occupancy-file clones. Merge rate still **0**. Overlaps critical-hunter tests that already ship inside fix PRs.

**Classification: KEEP + REDUCE_FREQUENCY.** Run after merges, not on a frozen tree. `AQA-2026-08-30-005` still applies to any reopen of a closed file set.

#### Interface consistency / contract guardian — `4fba3a56-a485-11f1-a7d1-d6b4613131ce`

**Runs:** 21. **Open PRs:** 0. Correct no-op against frozen bindgen/`main.mo`. Same efficiency note as invariants.

**Classification: KEEP + REDUCE_FREQUENCY** (weekly is enough while `main` is unchanged).

#### Security audit — `c97e5c0c-a485-11f1-a7d1-d6b4613131ce`

**Runs:** 14. **Open PRs:** 1 (`#368` changelog writes + https-only landing ads). Shop 60s auto-complete is **superseded** on `main` (empty `_autoCompletePendingPurchases`). Clamps exist. `AQA-2026-08-30-008` remains **PARTIAL** (no written ADR). Reconfirming canister-trust philosophy 14 times this week without an ADR is the August failure mode with a new ID.

**Classification: KEEP + REDUCE_FREQUENCY** (weekly). UPDATE_PROMPT: mark decided vs open; do not revive finding 3 as “saveBattleStats must not write Doka.”

#### Admin safety audit — `7e907066-a499-11f1-a7d1-d6b4613131ce`

**Runs:** 14 (1 ERROR). **Open PRs:** 11 `fix(admin):` (map-modifier pool empty, chance 0, id/type mismatch, seeded delete). Distinct from combat. Useful admin-guard work **if** it can land. During freeze it is another 11-deep stack on `AdminDashboard` / config helpers.

**Classification: KEEP + REDUCE_FREQUENCY** (one unique admin invariant per week while queue is deep).

---

### Code Modularity & Complexity Reduction Engineer — `#62` / `386a157d-a4a5-11f1-a7d1-d6b4613131ce`

**Official name:** Code Modularity & Complexity Reduction Engineer.  
**Week run titles:** “Module complexity reduction” (6) + “Code architecture strategy” (1 on 2026-09-21).  
**Runs:** 7 (daily 00 UTC). **Open PRs:** 7, all `refactor(engine): extract … from WorldExploration`. **Merged this week:** 0.  
**Historical landed extracts (not this week, still the canonical successes):** `#141` battle-start placement, `#186` dungeon Doka multiplier on `portalRules`, `#287` `spawnPolicy.ts`.

#### Week refactors (every one unmerged; behaviour claimed unchanged)

| PR | TARGET | BEFORE_RESPONSIBILITY | EXTRACTED_RESPONSIBILITY | NEW_MODULES | PR +/− | TESTS_ADDED | COMPLEXITY_REDUCTION | REGRESSION_RESULT | FUTURE_BENEFIT |
| :--- | :--- | :--- | :--- | :--- | ---: | :--- | :--- | :--- | :--- |
| `#369` | Player AP/MP restore | Inline WX restore using status modifiers | `modifiedResourcePool` in existing `statusEffects.ts` | none (extends stable module) | +175/−39, 5 files | `statusEffects.test.ts` | Real — status math belongs with statusEffects | Unmerged; mergeable CLEAN | High if landed |
| `#427` | Sprite-first hit testing | Inline WX hit test | Pure `spriteHitTest.ts` | `spriteHitTest.ts` | +432/−116, 6 files | `spriteHitTest.test.ts` | Real targeting/input boundary | Unmerged; **UNSTABLE**; also edits `AGENTS.md` | Medium (docs hunks fight the stack) |
| `#468` | Unique enemy name picker | Inline WX name pool | Name uniqueness in `spawnPolicy.ts` | none (extends `#287` domain) | +187/−77, 6 files | `spawnPolicy.test.ts` | Real — spawnPolicy is already canonical | Unmerged; **UNSTABLE**; also edits `AGENTS.md` | High if stacked onto `#287` |
| `#514` | `pickRandomWanderTarget` | Inline WX wander pick | `enemyWander.ts` (on `main` this file is **26 lines**, RAF skip only) | grows thin `enemyWander.ts` | +244/−54, 3 files | `enemyWander.test.ts` | Real domain start | Unmerged; CLEAN | High as the wander module’s second function |
| `#591` | `advanceEnemyWander` | Inline WX wander step | Full wander advance into `enemyWander.ts` | grows `#514` | +722/−145, 3 files | `enemyWander.test.ts` | Real, but **DIFF SIZE CREEP** vs “small extraction”; RAF-adjacent | Unmerged; CLEAN | High only if `#514` lands first; do not merge out of order |
| `#639` | Iso grid projection | Inline WX project/unproject | `isoGrid.ts` | `isoGrid.ts` | +503/−98, 3 files | `isoGrid.test.ts` | Mixed — math extract is testable; risk of **pass-through** if callers still own all policy | Unmerged; **UNSTABLE** | Medium |
| `#683` | Ground Doka loot roll | Inline portal map-swap loot | `planGroundDokaLoot` in `groundDokaSpawn.ts`; WX keeps `setDokaLoot` / claimed ids / `dokaPersist` | `groundDokaSpawn.ts` | +480/−53, 4 files | 11 characterization tests vs legacy formulas | **Best of the week** — clear domain, injected rng/now, Death Realm / chance-order locked | Unmerged; CLEAN | High |

WX net in `#683` is −34 lines of inline loot with persist ownership left in the orchestrator. That matches the desired architecture (WX composes; domain logic is pure).

#### Harmful-pattern watch

| Pattern | This week |
| :--- | :--- |
| FILE EXPLOSION | Mild. Three new files (`spriteHitTest`, `isoGrid`, `groundDokaSpawn`) plus growth of `enemyWander` / `spawnPolicy` / `statusEffects`. Not a utils dump. |
| FAKE MODULARITY | `isoGrid` is the closest: projection formulas with no policy. Still unit-testable; not a mega-hook. |
| MEGA-HOOKS | Not observed in these PRs. |
| UTILS DUMPING GROUND | Avoided. Extractions went to `engine/*` domains. |
| REFACTOR CHURN | `#514` then `#591` move wander in two daily PRs that **cannot stack** until merged. That is churn *in the queue*, not on `main`. |
| DIFF SIZE CREEP | `#591` +722. Prompt should keep a hard cap (~300 net production lines) or split characterization vs move. |
| AGENTS.md drive-by | `#427` and `#468` edit `AGENTS.md` / `README` / `ARCHITECTURE` inside a refactor. That fights every other PR and is out of scope for a modularity run. |
| Simultaneous WX writers | Daily #62 vs 23 persist + 23 critical + 27 map + 21 combat-parity drafts. **Schedule conflict**, not a bad extract. |

No production regression can be attributed to #62 this week (nothing merged). Failure mode if these merged unordered: **BAD_BOUNDARY** only if `#591` lands before `#514`; **OVERLARGE_DIFF** on `#591`; **stack union** risk because several also touch WX import lines (`worldHelpers` re-export in `#683` is an explicit union strategy — good).

#### WORLD_EXPLORATION_COMPLEXITY_TREND: **STABLE** (shipped) / **IMPROVING** (intent, blocked)

| Date | WX lines on `main` | Note |
| ---: | ---: | :--- |
| 2026-08-30 audit | 19,502 | |
| 2026-09-01 director | 20,063 | |
| 2026-09-02 director | 19,253 | Extracts + fixes |
| 2026-09-03 `0f5363f` (now) | **19,213** | Last WX commit 2026-09-02 |
| 2026-09-20→27 | **19,213** | Seven extracts exist only as drafts |

Shorter WX is not the goal. On `main`, WX is already an orchestration file that calls `spawnPolicy`, `portalRules`, `occupancy`, `deathGuards`, `rewardResolver`, `challengeCompletion`, `combatantStore`, `summon*`, `targeting`. That direction is **correct**. This week did not move shipped responsibility. Cognitive complexity of the live file is therefore **STABLE**. If #62 keeps touching WX daily without landings, the strategy is failing even when each PR is locally good.

#### #62 frequency decision: **REDUCE FREQUENCY**

Not KEEP DAILY: useful extraction candidates still exist (`enemyWander` is only 26 lines on `main`; ground Doka and hit-test are coherent), tests are present, and there is no landed regression. Daily cadence is still wrong because:

1. Oldest-first queue is 380 deep; another daily WX PR cannot land.
2. Hunters are rewriting the same file concurrently.
3. `#591` shows the “small extraction” task growing.

**Not TEMPORARILY PAUSE forever.** Pause *WX extracts* until open gameplay PRs are triaged or `main` moves; then resume **2–3×/week** with: tests first, no `AGENTS.md` edits, no PR >~400 production lines, skip if `origin/main` SHA unchanged **and** the last extract is still OPEN.

Overlap with Architecture Debt / Maintainability (`637c51d2`, 7 runs, 0 PRs) and Codebase Audit (`d449111b`, 7 PRs of the **same** `chore: drop leftover dungeon-editor CSS after #286` six times) is wasteful on the audit side. #62 should remain the **only** WX extractor.

**ROI:** **MEDIUM** long-term (the extracts are the right shape) / **LOW** this week (zero landings). Not NEGATIVE — these are not cosmetic renames.

---

### Design / docs specialists (daily dated catalogs)

These automations mostly justify their *existence* as design advisors. They do **not** justify daily PRs that only bump the date.

Repeated 7× (or 6×) normalized titles this week include: gameplay telemetry architecture; WAITING_FOR_TELEMETRY balance; Emergent Build & Meta; content diversity; enemy/boss admin re-audit; spell/discovery/achievement admin; world/dungeon/encounter admin; long-horizon sim; Master Technical Director roadmap; Expansion Director catalog; PX coherence; visual asset library; enemy AI evolution increment; mechanic interaction matrix; silent combat-feedback; world-dynamics **wave N catalog**.

Largest diffs are docs: `#680` +5359 (world dynamics wave 10), `#613` +4600, `#670` +3499 (long-horizon sim). Design-only catalogs are allowed by several prompts; **seven escalating waves in seven days with no playtest and no merge** is not architecture improvement.

| Automation | ID | Week PRs | Classification |
| :--- | :--- | ---: | :--- |
| World mechanics design | `62dfc3fc` | 7 catalogs, +21k | **REDUCE_FREQUENCY** (weekly) + UPDATE_PROMPT: skip PR if the prior wave is still OPEN |
| Gameplay telemetry architecture | `047ac8a1` | 7 × ~1350-line clones | **PAUSE** until collectors exist (AQA-012) |
| Telemetry admin dashboard | `4b026695` | 7 “skip Nth Health matrix” docs | **PAUSE** |
| Telemetry-driven balance | `2786666f` | 7 WAITING_FOR_TELEMETRY | **PAUSE** |
| Infinite progression sim | `aac69fba` | 7 long-horizon dumps | **REDUCE_FREQUENCY** weekly; do not retune the XP curve |
| Emergent meta | `7b2f2b58` | 7 clones | **REDUCE_FREQUENCY**; overlap with balance + PX |
| Spell mechanics / enemy evolution / boss / expansion / formations / AI / discovery admin / VAL / WDEAD / MIMA / GFCF / PX | various | 6–7 docs each | **REDUCE_FREQUENCY** to weekly; **MERGE** overlapping pairs listed below |
| Master technical direction | `0b92479e` | 7 roadmap restates | **KEEP** weekly (not daily). Last *merged* roadmap is 2026-09-02 |
| Documentation repository state | `013ac98d` | 7 tiny docs | **KEEP** + REDUCE_FREQUENCY; this is the rare docs bot whose diffs stay small |
| Codebase audit | `d449111b` | **6× identical** `chore: drop leftover dungeon-editor CSS after #286` | **UPDATE_PROMPT**: refuse to reopen a still-open chore |
| Admin dashboard audit ×2 | `48eb1df6`, `b1bc1d63` | 14 combined | **MERGE** into one admin UX auditor |
| Approved design recommendations | `fe5b679a` | 7 runs, **0 PRs** | **KEEP** (correct no-op during freeze) |
| Content retirement | `66fd8624` | 1 run | **KEEP** (cadence already sparse) |
| Game balance | `3c083a4a` | 5 docs | **REDUCE_FREQUENCY**; no telemetry → no number changes |
| Player data evolution | `469b7020` | 6 persist test/fix PRs | **UPDATE_PROMPT** (overlaps persist hunter) |
| Mobile/a11y | `c8f71c67` | 7 real `fix(a11y)` | **KEEP** + REDUCE_FREQUENCY (touch targets are unique; 7/week still floods) |
| UX audit | `96624677` | 6 fixes + 1 docs | **KEEP** + REDUCE_FREQUENCY; overlap with a11y / feel / orchestrator |
| Runtime performance | `4191af8a` | 7 small perf PRs | **KEEP** + REDUCE_FREQUENCY; none landed so no outcome |
| Admin feature drift | `e4d996b0` | mix docs/fix | **KEEP** weekly |
| Admin regression gate | `67820d12` | 7 runs, 1 tiny test PR | **KEEP** (mostly no-op) |
| Engineering summary / weekly changelog | `d066ac72` / `0c6caa64` | digest vs this auditor | **KEEP**. Changelog running in parallel this hour is **healthy** overlap (player/dev narrative vs automation ROI) |
| This Quality Auditor | `976261d8` | this PR | **KEEP** weekly. Cron missed three Sundays — see AQA-2026-09-27-005 |

---

## Overlap analysis

| Group | Independent verification? | This week |
| :--- | :--- | :--- |
| Critical hunter vs Invariants vs Regression vs Adversarial QA vs Combat parity | **Yes in principle** (P0 bug vs invariant vs “did a merge regress” vs attacker vs preview/execute) | **Wasteful in practice**: `main` did not move, so regression hunting cannot see a regression, and all five still opened combat/persist drafts. Invariants correctly stayed at 0 PRs; the others did not copy that discipline. |
| Persist auditor vs Economy vs Player-data evolution | Same persist-lock / unpaid-death / GameKey surface | **Wasteful.** One owner should write; the others ACTION_ID. |
| Map integrity vs occupancy/combat landing vs #62 wander | Solvability vs combat landing vs extraction | Map integrity is implementing punches that combat-parity then “shares with the live gate.” **Wasteful.** |
| Architecture debt / maintainability vs #62 vs codebase audit | Read-only debt vs extract vs dead CSS | Maintainability 0 PRs is healthy. Codebase audit cloned one CSS chore 6×. **#62 should be the only WX writer in this group.** |
| UX vs Game feel vs PX vs a11y vs orchestrator | Journey vs juice vs identity vs touch vs triage | Partial health (different lenses) but **seven daily docs/fix PRs each** collapse into the same HUD/recap/shop chrome. |
| Balance vs Telemetry-balance vs Emergent meta vs Long-horizon | Numbers vs measured numbers vs player meta vs XP curve | **Wasteful until telemetry exists.** All four should WAIT. |
| Admin safety vs Admin dashboard audit ×2 vs Admin drift vs Admin regression vs Spell/enemy/world admin design | Guard vs UX vs drift vs gate vs content admin | Too many admin specialists. **MERGE** the two dashboard auditors; keep safety-guard separate. |
| Quality Auditor vs Weekly changelog vs Master director | Process vs narrative vs roadmap | **Healthy** if director stays weekly and this auditor stays weekly. Director should not run daily during a freeze. |

---

## ACTION-ID health

On `main`, ACTION_ID files stop at **2026-09-03**. Producers still mint dated IDs **inside unmerged PRs**, so the in-repo ledger other agents read is 24 days stale while the draft tree contains hundreds of `STATUS: NEW` clones.

Observed failure modes:

| Failure | Evidence |
| :--- | :--- |
| Same problem, many IDs | Persist “saveBattleStats wipe after keep” is 15+ PR titles, not one `ACTION_ID`. |
| Same ID restated | Director files told specialists to reuse `MTD-2026-08-31-001`; the flock still implemented. |
| Stale NEW on `main` | `AQA-2026-08-30-*` still `NEW` in [`ACTION_IDS_2026-08-30.md`](./ACTION_IDS_2026-08-30.md) even where later director files marked PARTIAL/BROKEN. |
| Already fixed, still discussed | Shop 60s auto-complete; `applyRewards` clamps; `996df6df` hunter — still appear in leftover security/hunter narratives. |
| Endlessly deferred | `AQA-012` / `TBC-*` WAITING_FOR_TELEMETRY for four weeks of reports. Spell discovery `SDA-002/004`. MapGen freeze `AQA-006`. Flock halt `MTD-001`. |
| Contradictory | Map integrity implements punches; `AGENTS.md` forbids mapGen; auditor said PAUSE; all three still true. |
| Duplicate dated files | `ACTION_IDS_*_2026-09-21` … `09-27` in drafts are not a lifecycle: they never close yesterday’s NEW. |

**Consolidation:** one living ledger (`MASTER_ROADMAP.md` + a single `ACTION_IDS_OPEN.md` or director file). Daily specialists update **status** of existing IDs; they do not open a new dated file when the finding is unchanged. Close IDs when `main` contains the fix **or** when the finding is obsolete (shop 60s, missing `996df6df`).

---

## Prompt drift vs live architecture

Still accurate in live prompts that cite `AGENTS.md`: 12-field stats, leftover XP curve, persist lock, GameKey vs shop 60s, no level cap, Draft → Validate → Activate, pixel fallback.

Drift / stale assumptions still in circulation:

1. **Map generation is implementable** — Solvability prompt vs `AGENTS.md` line 5. Result: 27 `fix(map)` drafts.
2. **`saveBattleStats` Doka write is a bug** — if security still frames it that way. Architecture requires it; clamps are the remaining decision (`AQA-008`).
3. **`docs/ARCHITECTURE.md` `check-limit = 4`** — live `mops.toml` is **5**. Doc on `main` is stale; automations that cite the doc will mis-count the chain.
4. **Telemetry exists if a dashboard specialist ran** — it does not. `telemetry.available === false`.
5. **Daily director / expansion catalogs change the live game** — they do not, and must not, until discovery/admin DVA exists.
6. **Oldest-first stack is someone else’s problem** — every implementer prompt now checklists `open-pr-stack-compat.sh`, then opens PR #381 anyway. The prompt must say: **if >N open drafts targeting WX/mapGen/persist, do not implement**.

---

## Outcome quality (telemetry)

No player population, encounter, cancel, spell-pick, or error series exists. **Do not attribute live outcomes to automations.** Everything that follows is about *shipped code on `main`*, which **did not change this week**.

| Change class | Classification | Why |
| :--- | :--- | :--- |
| Persist / wallet / death / GameKey | **NO_MEASURABLE_EFFECT** this week | Fixes exist only as drafts. Last landed persist work is 2026-09-03 (`#330`). |
| Combat kit / preview-execute / summons | **NO_MEASURABLE_EFFECT** | 44 `fix(combat)` drafts, 0 merges. |
| Map solvability / dump alcoves | **NO_MEASURABLE_EFFECT** / process **POSSIBLE_NEGATIVE_EFFECT** | 27 mapGen drafts waiting to conflict with occupancy. |
| UX / a11y / feel | **NO_MEASURABLE_EFFECT** | Unmerged. |
| Spell balance / meta / discovery pacing | **NO_MEASURABLE_EFFECT** | Design docs only; no number changes on `main`. |
| Enemy expansion / world-dynamics waves | **NO_MEASURABLE_EFFECT** | Catalog PRs, not content activation. |
| Performance | **NO_MEASURABLE_EFFECT** | Unmerged micro-opts. |
| #62 modularity | **NO_MEASURABLE_EFFECT** on players; **LIKELY_POSITIVE** on testability *if* `#369/#514/#683` land in order | Characterization tests are the value, not line count. |
| Security posture (custom client mint) | **LIKELY_POSITIVE** vs August (clamps + GameKey no-op shop on `main`) / **INCONCLUSIVE** this week | No new landed security. `#368` unmerged. |
| Automation-driven stability of `main` | **POSSIBLE_NEGATIVE_EFFECT** (process) | 380 drafts + oldest-first rule means the next human merge is a stack-compat lottery, not a review of one patch. |

No **CLEAR_POSITIVE_SIGNAL** or **CLEAR_REGRESSION** in the shipped game this week.

---

## Follow-through on the 2026-08-30 auditor ledger

| ID | Aug 30 ask | Status 2026-09-27 |
| :--- | :--- | :--- |
| AQA-001 throttle hunter | ≤14 runs/week | **PARTIAL**: `996df6df` deleted; `1aa41c6c` still **55** |
| AQA-002 merge hunters | one critical ID | **PARTIAL** (one ID remains, still too hot) |
| AQA-003 ACTION_ID ledger | producers write IDs | **PARTIAL**: IDs exist; no lifecycle; `main` ledger frozen at 09-03 |
| AQA-004 don’t merge 08-30 stack as-is | human pick | **SUPERSEDED** (that stack is long merged; new stack is `#333`–`#711`) |
| AQA-005 test mill | stop clones | **PARTIAL**: occupancy clones gone; 6 targeted test PRs still unmerged |
| AQA-006 mapGen report-only | 0 mapGen PRs | **BROKEN** (27) |
| AQA-007 freeze WX drive-bys | <20 WX commits | **BROKEN** as process (0 commits only because **nothing merges**) |
| AQA-008 security ADR | decide clamp vs proofs | **PARTIAL** (clamps on `main`, no ADR) |
| AQA-009 orchestrator don’t implement | ledger only | **BROKEN** (12 fix PRs) |
| AQA-010 persist/economy dedup | one PR per race | **BROKEN** (23 persist wipe variants) |
| AQA-011 live architecture in prompts | no Attack Nearest fork | **PARTIAL** (that fork died; live-gate mill replaced it) |
| AQA-012 telemetry hooks | persist-ok/fail counters | **OPEN** (still none) |
| MTD-2026-08-31-001 halt flock | ≤3 gameplay PRs/wave | **BROKEN** for a month (87 runs/day) |

High-value ignored actions are **halt the flock**, **stop mapGen implementation**, **one persist race PR**, and **build telemetry**. They are not ignored because they are wrong. They are ignored because automations cannot change their own dashboards, and humans stopped merging on 2026-09-03.

---

## Engineering ROI (qualitative)

| Automation / class | ROI this week | Why |
| :--- | :--- | :--- |
| Invariants, contract guardian, approved-design (0 PRs) | **MEDIUM** | Correct “no justified change” on frozen `main`; still over-run |
| #62 extracts with tests | **MEDIUM** long-term / **LOW** now | Right shape, cannot land |
| Critical hunter unique kit bugs | **LOW** | Real findings, zero landings, 23-deep private backlog |
| Persist wipe-variant mill | **NEGATIVE_ROI** | Same race, 23 drafts |
| Map integrity implementations | **NEGATIVE_ROI** | Forbidden surface + duplicates |
| Daily design/telemetry clones | **NEGATIVE_ROI** | +227k lines of unmerged docs |
| Combat-parity kit mill | **LOW** | Real class, wrong cadence |
| Security weekly reconfirm | **LOW** | One small PR; no ADR |
| This auditor | **MEDIUM** | First signal in four weeks that the system is generating queue, not game |
| A11y / UX unique chrome | **MEDIUM** if a human later cherry-picks 1–2 | Not if all 14 merge |

---

## Weekly automation health report

### 1. AUTOMATIONS PERFORMING WELL

- **System invariants** (`72eb90fe`) and **contract/interface guardian** (`4fba3a56`): 62 combined runs, **0** gameplay PRs. This is what “no justified change” looks like.
- **Approved design implementer** (`fe5b679a`): 7 runs, 0 PRs during freeze.
- **#62** extract *quality* (especially `#683` ground Doka, `#369` status pool, `#468`/`#514` onto existing domains) — not its cadence.
- **`996df6df` removal**: the only AQA-001 follow-through that stuck.
- **Weekly changelog** overlapping this auditor: different job, keep both weekly.
- **Admin regression gate** mostly no-op.

### 2. AUTOMATIONS NEEDING PROMPT CHANGES

- Map integrity: report-only unless a named seed is human-approved (`AQA-006`).
- Critical hunter, combat parity, persist, economy, adversarial QA, orchestrator: uniqueness vs **open PRs**, skip implement if `origin/main` unchanged **and** an OPEN PR already names the theme.
- #62: no `AGENTS.md` edits; cap diff size; stack onto `spawnPolicy` / `enemyWander` / `statusEffects` / `portalRules` rather than new dump files; skip while >N WX drafts are open.
- Codebase audit: never reopen an OPEN identical chore (`dungeon-editor CSS` ×6).
- Security: decided vs open; shop 60s is closed.

### 3. AUTOMATIONS NEEDING FREQUENCY CHANGES

- **REDUCE** midnight flock: critical hunter, persist, map, combat parity, orchestrator, adversarial QA from many-per-day → **≤1/day** or pause while drafts >30.
- **REDUCE** all daily design/docs specialists → **weekly** (same day as this auditor or the director, not 00 UTC every night).
- **REDUCE #62** daily → **2–3×/week** after queue drain; not daily during freeze.
- **PAUSE** telemetry architecture / dashboard / TBC until AQA-012 collectors exist.
- **KEEP weekly:** this auditor, changelog, director, security, contract guardian, content retirement.
- **No INCREASE_FREQUENCY.**

### 4. AUTOMATIONS WITH EXCESSIVE OVERLAP

See overlap table. Highest waste: persist×economy×player-data; combat×critical×adversarial×parity; telemetry×balance×meta; two admin-dashboard auditors; UX×feel×PX×orchestrator chrome.

### 5. AUTOMATIONS CAUSING REGRESSIONS

None **on `main`** (no merges, no reverts). Process regression: 380-draft oldest-first queue. One closed dup (`#655`). Five ERROR runs (economy, spell-discovery, admin-safety, persist, map) look like infra — not treated as product findings.

### 6. HIGH-VALUE ACTIONS BEING IGNORED

- `MTD-2026-08-31-001` flock halt  
- `AQA-006` mapGen report-only  
- `AQA-012` backend-authoritative counters  
- `AQA-008` persist-trust ADR  
- `SDA-002/004` spell observation/discovery (product, not a seventh design PDF)  
- Human merge/close of the draft queue (without this, every other action is theatre)

### 7. STALE ACTIONS TO CLOSE

- `AQA-2026-08-30-004` (08-30 overlapping stack) → **SUPERSEDED**  
- Shop 60s auto-complete / `996df6df` throttle-as-if-it-exists  
- Any ACTION_ID that asks to add `applyRewards` clamps (already on `main` 2119–2120)  
- Duplicate dated telemetry/balance IDs that only change the calendar day

### 8. ARCHITECTURAL HOTSPOTS

- `WorldExploration.tsx` 19,213 — still the orchestration hotspot; freeze is process-only  
- `mapGen.ts` 1,937 + 27 pending punches  
- Persist lock callers (not `progressPersist.ts` itself, 421 lines — still the right module)  
- `AdminDashboard.tsx` 8,280  
- Unmerged docs tree (+227k) choking GitHub review  
- EOP/`main.mo` stables: do **not** let any automation add persistent `let`/`var` without a later chain file (director P0 from 09-02; still the rule)

**Stable canonical boundaries to preserve:** `spawnPolicy.ts`, `portalRules.ts`, `deathGuards.ts`, `rewardResolver.ts`, `challengeCompletion.ts`, `progressPersist.ts`, `occupancy.ts`, `combatantStore.ts`, `statusEffects.ts`, `dokaPersist.ts`. #62 should extend these rather than invent parallel helpers.

**Poor boundaries:** `worldHelpers.ts` as a re-export barrel (convenient for stack union, easy to become a dump); `enemyWander.ts` at 26 lines on `main` is *under*-grown, not poor — grow it via `#514` then `#591` **in order**.

### 9. CODE MODULARITY TREND

On `main`: **IMPROVING then frozen.** Engine/ now has real domains with tests. Giant-module change frequency dropped to **zero** only because merges stopped. Duplicated domain logic is accumulating in **drafts**, not in `main`. Pure/testable ratio would rise if `#369/#514/#683` landed.

### 10. WORLD EXPLORATION COMPLEXITY TREND

**STABLE** on shipped code. Intent of #62 remains IMPROVING (orchestration vs domain). Daily WX extracts without landings do not reduce cognitive load.

### 11. TELEMETRY-SUPPORTED OUTCOMES

**INCONCLUSIVE / none.** Repeat AQA-012. Do not let TBC/GTAD/dashboard specialists claim CLEAR_POSITIVE_SIGNAL.

### 12. RECOMMENDED AUTOMATION CHANGES FOR NEXT WEEK

1. **Human (or orchestrator at REDUCE_AUTONOMY):** close or supersede duplicate drafts; do not merge the 380 as a stack. Prefer a handful of unique P1s (`res_sp` `#658`, one persist-lock characterization, `#683` or `#369` extract, one a11y).  
2. **Dashboard (no agent write API):** disable or stretch crons for implementers and daily design bots until open drafts < 30.  
3. **#62:** 2–3×/week after (2); never daily beside hunters.  
4. **Map integrity:** report-only.  
5. **Telemetry trio:** pause.  
6. **This auditor cron:** confirm it actually fired; it missed three Sundays.  
7. Do not start GameKey/EOP/Motoko-stable work from a specialist this week.

Actionable records: [`ACTION_IDS_2026-09-27.md`](./ACTION_IDS_2026-09-27.md).
