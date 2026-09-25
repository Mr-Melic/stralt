# ACTION_IDs — 2026-09-25 Master Technical Director

Durable director ledger. Reuse existing IDs. Do not append specialist catalogs here.

**HEAD:** `0f5363f` (`Merge pull request #332`) — **unchanged since 2026-09-03 00:28 UTC**  
**Prior director:** unmerged [`#509`](https://github.com/Mr-Melic/stralt/pull/509) + memories (`bc-2c6667d4-fa6d-4333-85bd-54bed9eb2bca`). Unmerged [`#338`](https://github.com/Mr-Melic/stralt/pull/338) / [`#402`](https://github.com/Mr-Melic/stralt/pull/402) / [`#448`](https://github.com/Mr-Melic/stralt/pull/448) are earlier snapshots. On `main`, [`MASTER_ROADMAP.md`](./MASTER_ROADMAP.md) is still the 2026-09-02 text.  
**This agent:** `bc-d12f7f6b-ca67-4cc8-b1b6-1f312225e612`  
**Gameplay / production code:** not modified this run.

Specialist IDs stay in their producer files. Do not concatenate into this ledger. Do not append to `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, `ACTION_IDS_2026-09-21.md`, `ACTION_IDS_2026-09-22.md`, `ACTION_IDS_2026-09-23.md`, or `ACTION_IDS_2026-09-24.md`.

---

## Status of prior director IDs (reuse; do not mint twins)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| MTD-2026-08-31-001 / MTD-2026-09-01-001 | OPEN | Halt-as-config failed 08-31, 09-01, 09-02, 09-21, 09-22, 09-23, 09-24, **09-25**. Halt-as-merge-stop held **22 days** (`main` still `0f5363f`). |
| MTD-2026-09-21-001 | PARTIAL | 09-21 wave opened **59** drafts. Humans **did not merge** them. |
| MTD-2026-09-22-001 | SUPERSEDED | 09-22 wave already happened. |
| MTD-2026-09-23-001 | SUPERSEDED | 09-23 wave already happened. |
| MTD-2026-09-24-001 | SUPERSEDED | 09-24 wave already happened. Validation “≤3 new gameplay PRs” **failed** (~28 gameplay PRs in #502–#555). See MTD-2026-09-25-001 / 003 / 004. |
| MTD-2026-09-02-001 | SUPERSEDED | 09-02 wave already merged. |
| MTD-2026-09-02-002 | IMPLEMENTED (source) | #259 / #311 / #324. Deploy half → MTD-2026-09-21-002. |
| MTD-2026-09-21-002 | OPEN | `.old` still Aug-31 no-GameKey. No `snapshots/deployed/` file newer than `pr259-tail-20260901.most`. |
| MTD-2026-09-02-003 | OPEN | Freeze new stables until deploy confirmed. Frozen chain files untouched on `main`. #362 edits `main.mo` **behavior only**. |
| MTD-2026-09-02-004 / AQA-2026-08-30-003 | PARTIAL | 09-02 file stayed clean. 09-21…09-24 ledgers never landed on `main`. This run writes `ACTION_IDS_2026-09-25.md` only. |
| MTD-2026-09-21-003 | OPEN | **#327 still open** (oldest draft, **23 days** stale, `mergeable_state: dirty`). #370 is a later Striker **superset**. Economy hunter RUNNING tonight. |
| MTD-2026-09-21-004 | OPEN | #331 still open. Hold all **sixteen** mapGen punches (prior twelve plus **#538 #542 #548 #553**). |
| MTD-2026-09-22-002 | OPEN | Close #338. Subsumed by MTD-2026-09-25-002. |
| MTD-2026-09-22-003 | OPEN | Leftover queue grew 59 → 116 → 171 → **230**. See MTD-2026-09-25-003. |
| MTD-2026-09-22-004 | OPEN | #370 still HOLD until after #327. |
| MTD-2026-09-23-002 / MTD-2026-09-24-002 | OPEN | Close #338/#402/#448; this run also closes #509 (MTD-2026-09-25-002). |
| MTD-2026-09-23-003 / MTD-2026-09-24-003 | OPEN | Queue grew again. See MTD-2026-09-25-003. |
| MTD-2026-09-23-004 / MTD-2026-09-24-004 | OPEN | Clone mill held on `main`; 09-24 cloned it again. See MTD-2026-09-25-004. |
| AQA-2026-08-30-008 | PARTIAL | Clamps + ignore-client level + AP/MP cap; **no ADR** (`docs/**/*ADR*` = 0). Security RUNNING tonight. |
| AQA-2026-08-30-006 | BROKEN | mapGen still **1,937**. Sixteen open punch PRs. Guardian `9dcfd122` enabled and RUNNING. |
| AQA-2026-08-30-007 | BROKEN | WX still **19,213**. Combat parity `f37b7505` enabled and RUNNING. |
| AQA-2026-08-30-005 | PARTIAL | Test mill still firing (`#542`). |
| AQA-2026-08-30-012 | OPEN | Still 0 collectors. TBC correctly WAITING (#556). Dashboard skipped fifth matrix (#559). |
| TBC-2026-08-31-001 | OPEN | WAITING_FOR_TELEMETRY. Confirmed this run (#556). |
| MIMA-2026-08-31-001 | OPEN | Swap still teleports (`WX` 9389–9402). No `applyHazardLanding`. **#541** is a later local Swap patch — HOLD. |
| MIMA-2026-08-31-002 | PARTIAL | Dest occupancy/unseal landed; **no** hazard landing. |
| MIMA-2026-09-01-001 | IMPLEMENTED | #313 `battleWalkMpCost` on execute. |
| MIMA-2026-09-01-002 | PARTIAL | Barriers in `isBattleWalkTileBlocked`. Occupants still missing. |
| MIMA-2026-09-02-001 | IMPLEMENTED | #318 `enemyWalkMp.ts`. |
| MIMA-2026-09-02-003 | OPEN (helper drafted) | `redeemGameKeyThroughPersist` still raw lock+grant. **#391** adds the helper, **does not wire** redeem. |
| PXA-2026-09-02-002 | IMPLEMENTED | #332 accepted-challenge HUD. |
| SDA-2026-08-31-002 / SDA-2026-09-01-003 / SDA-2026-09-02-003 | OPEN | Catalog still hydrates into every book (`adminSafety.ts` 712–718). |
| SDA-2026-08-31-004 | OPEN | No observe→win persist. |
| EXPANSION-PREREQ-A | OPEN | `WX` 11920 still passes LevelZone object. Number already at 1136 / 4680. Seventh cycle. |
| MTD-2026-08-31-003 | OPEN | HP/death extraction. Not tonight. |
| MTD-2026-08-31-004 | OPEN | Expansion freeze. Expansion `3f31b18f` and AI `67b03c2f` RUNNING this hour. `fe5b679a` not in this hour’s flock list. |
| MTD-2026-08-31-005 | OPEN | `useSaveKillCount` has no TSX caller. |
| MTD-2026-08-31-006 | OPEN | Admin DVA not canister. Dashboard 8,280 lines. |
| MTD-2026-08-31-007 | OPEN | Point at SDA-002/004; no fifth schema. |
| MTD-2026-08-31-008 | OPEN | 30% random AI tier (`combatMath.ts` 48–50). |
| LHIPS-2026-09-01-001 | HOLD | HUD saturates at 48. Do not retune curve. |
| LHIPS-2026-09-01-002 | HOLD | 100k/500k clamp vs jackpot. Architecture, not a BAL retune. |
| SDEG-2026-09-21-001 | OPEN on `main` | Unbounded GameKey serial + `saveActiveSpells` keep-store live only on **#362** (unmerged). |
| SDEG-2026-09-21-003 | OPEN / HUMAN | Persist AP/MP cap 20 vs unbounded formula. Do not raise the cap in this flock. |
| RAO-2026-09-03-0000-002 | DEFERRED | Feats vs Achievements recap copy. Drafted as **#354**. P3 display-only. |
| RAO-2026-09-03-0000-003 | NEEDS_HUMAN_DECISION | Paper Windstorm two live rates. Do not “fix” announce alone. |

---

ACTION_ID: MTD-2026-08-31-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Halt same-hour P2/P3 implementer flock after a merge burst or freeze restart  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Failed 2026-08-31, 09-01, 09-02 (humans then merged). Halt-as-merge-stop then held **22 days** (`main` still `0f5363f`). Recurred 09-21 (59 drafts), 09-22 (~55), 09-23 (55), 09-24 (~54, #502–#555). Recurred **2026-09-25 00:09**: **30** automations already launched including combat parity `f37b7505` (enabled, RUNNING), map guardian `9dcfd122` (enabled, RUNNING), expansion `3f31b18f` (enabled, RUNNING), AI `67b03c2f` (enabled, RUNNING), economy `1e548d83` (enabled, RUNNING), security `c97e5c0c`, admin safety, spell mechanics, dungeon encounters, world mechanics, enemy formations, game feel, defect recurrence, AdminDashboard. `fe5b679a` not GetAutomation-visible this run and not in the 00:00 flock list (it was RUNNING on 09-24). `996df6df` still not GetAutomation-visible. `1aa41c6c` remains enabled. Cursor has no dashboard write API. Queue now **230** drafts.  
SYSTEMS_AFFECTED: all implementer automations; 230-draft merge queue; live Caffeine upgrade  
RECOMMENDED_ACTION: First-run and expansion specialists emit ACTION_IDs only. Do not open gameplay PRs this cycle unless unique, display-only, and not already drafted. Stagger crons. Pause map/combat/persist/Motoko-stables implementers after a freeze restart, not only after a merge burst. Keep one critical hunter. **Disable or pause `f37b7505`, `9dcfd122`, `3f31b18f`, `67b03c2f`, and `1e548d83`** until P0/P1 are closed.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-001; AQA-2026-08-30-009  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next director run sees ≤3 **new** gameplay PRs from the 09-25 wave, and those PRs do not retouch persist / targeting / mapGen / WX / RAF / `main.mo` stables. The leftover queue is not merge-bursted. Expansion/AI do not open a gameplay PR.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-09-25-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Hold the 2026-09-25 00:00 specialist wave  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Same HEAD as 09-21…09-24. P0 leftovers (Caffeine deploy, ADR, #327 restack, director-index merge) still open. **230** drafts already in the queue. This hour already launched combat-parity, map guardian, expansion, AI, economy, security, admin, spell mechanics, dungeon/world/formations, game feel. 09-24’s first-hour docs-only PRs did **not** stay docs-only by end of day (~28 gameplay PRs). First-hour 09-25 docs (#556–#560) are acceptable; implementers still RUNNING.  
SYSTEMS_AFFECTED: merge queue; `WorldExploration.tsx`; `mapGen.ts`; `main.mo`; AdminDashboard; migrations; RAF  
RECOMMENDED_ACTION: Default HOLD any gameplay PR from this wave. Designers update their own dated files; do not rewrite SDA/SDE/EBA schemas; do not restack GameKey, Frozen MP, spawnPolicy, death-penalty, Striker, Swap, leftover-walk, or RAF. Do not open another Striker / mapGen / persist / combat-parity / expansion / AI PR while #327 / #331 / #333–#555 exist.  
AUTONOMY: HUMAN_CONFIG + review  
DEPENDENCIES: MTD-2026-08-31-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: No mapGen / persist-lock / targeting / enemyAI / AdminDashboard / Motoko-stables / RAF gameplay PR merges from this wave.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-09-25-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Supersede unmerged director PRs #338, #402, #448, and #509; keep one living roadmap on main  
CATEGORY: process  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: 09-21 wrote living files on #338. 09-22 on #402. 09-23 on #448. 09-24 on #509. None merged. `main` still serves the 2026-09-02 roadmap, so 09-21 through 09-25 flocks planned against a stale index. Five open director PRs on the same files fail oldest-first stack-compat.  
SYSTEMS_AFFECTED: `docs/automation/MASTER_ROADMAP.md`; director ACTION_ID files; merge queue  
RECOMMENDED_ACTION: Close #338, #402, #448, and #509 without merge (this PR subsumes all four snapshots plus the 09-25 delta). Do not merge all five. Future director runs write `ACTION_IDS_YYYY-MM-DD.md` and replace the living `MASTER_ROADMAP.md`.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-09-24-002; MTD-2026-09-23-002; MTD-2026-09-22-002  
REGRESSION_RISK: LOW — docs only; 09-21…09-24 facts are copied forward  
VALIDATION_REQUIRED: After merge, `main` `MASTER_ROADMAP.md` header date is this run; #338, #402, #448, and #509 are closed.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-09-25-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Triage the 230-draft leftover queue; do not merge-burst it  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: GitHub `pulls?state=open&per_page=1` `Link` last page **230**. Leftover **#327** + **#331**, then **#333–#501**, then **#502–#555** (09-24), then **#556–#560** (09-25 first-hour docs). Gameplay includes **sixteen** mapGen punches, a persist skip-wipe cluster, two Striker PRs, leftover-walk mill, Swap local patch #541, AdminDashboard chrome, feel/UX/a11y, and **#501 RAF**. 09-02 proved humans will merge this shape if it sits in the button.  
SYSTEMS_AFFECTED: GitHub merge queue; WX; mapGen; persist lock; AdminDashboard; RAF  
RECOMMENDED_ACTION: Ordered unique leftovers only (see MASTER_ROADMAP human merge queue). Close or hold duplicates. Docs catalogs may land **after** P0/P1 if they do not rewrite schemas or retune BAL-*. Do not sequential-merge 200+ gameplay drafts to “clear the queue.”  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-09-25-001; MTD-2026-09-24-003  
REGRESSION_RISK: HIGH if the 09-02 70-PR merge pattern repeats  
VALIDATION_REQUIRED: Next `main` merge is either this docs PR, restacked #327, or a single unique P1 from the leftover list — not a 20-PR burst.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-09-25-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Hold the 09-24 same-day mapGen / persist-HUD / leftover-walk / Swap clone mill  
CATEGORY: sensitive-code  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: After the 09-24 director named twelve mapGen punches as HOLD, the same day opened **#538 / #542 / #548 / #553**. Persist hunters opened skip-wipe twins **#532 / #540 / #545 / #552** on top of #330’s keep. Combat/critical opened leftover-walk **#544 / #546 / #547 / #554**, Swap local **#541**, Wisp Blood Mend **#550** (twin of #380). Local patches on these subsystems are no longer sufficient. Guardian / combat-parity / economy are RUNNING again tonight.  
SYSTEMS_AFFECTED: `mapGen.ts`; `progressPersist.ts` callers; `WorldExploration.tsx`; combat helpers; RAF  
RECOMMENDED_ACTION: HOLD all listed clones. Guardian / persist / combat-parity / economy automations = ACTION_IDs + failing fixtures only until a human authorizes one helper each (`shouldPunchPortalNeighbor`, unseeded-HUD adopt, `applyHazardLanding`, leftover-walk cancel). Do not sequential-merge twins. Do not land #501 or #541.  
AUTONOMY: HUMAN_CONFIG + review  
DEPENDENCIES: AQA-2026-08-30-006; AQA-2026-08-30-007; AQA-2026-08-30-010; MTD-2026-09-24-004  
REGRESSION_RISK: HIGH if another punch/keep/WX/RAF/Swap branch lands without playtest  
VALIDATION_REQUIRED: Next director run opens 0 new mapGen / persist-HUD / leftover-walk WX / RAF / Swap PRs from those automations.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-09-25-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Oldest-first merge queue makes the living director index unreachable  
CATEGORY: process  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Queue head is leftover **#327** (`createdAt` 2026-09-02 16:23, now **23 days** stale, `mergeable_state: dirty`, base `441266a` before #332, 20 files / +1371). Oldest-first (`scripts/open-pr-stack-compat.sh`) requires that PR before later docs, including this living roadmap. Seven director runs (09-21…09-25 plus 09-02 on `main`) could not land the index. Five director PRs on the same living files already conflict with each other. ENGINEERING: this is why `main` still serves the 09-02 roadmap.  
SYSTEMS_AFFECTED: merge queue; `docs/automation/MASTER_ROADMAP.md`; leftover #327; every later automation PR  
RECOMMENDED_ACTION: Human: (1) close superseded director snapshots #338/#402/#448/#509 without merge; (2) restack #327 onto current `origin/main` **or** close it if a human will re-author the Striker helper after halt; (3) do not treat “merge 200 drafts to unblock the button” as the fix. Docs-only director PRs should not wait behind a dirty 20-file gameplay PR.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-09-21-003; MTD-2026-09-25-002; MTD-2026-09-25-003  
REGRESSION_RISK: MEDIUM if #327 is closed without a replacement Striker helper; LOW if it is restacked.  
VALIDATION_REQUIRED: Next director run either sees #327 restacked/merged or explicitly closed by a human, and `main` `MASTER_ROADMAP.md` header date is this run or later.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-09-21-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Confirm Caffeine deploy of the 20260901 GameKey tail and refresh .old  
CATEGORY: data-persistence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Reconfirmed 2026-09-25: source chain unchanged (`20260831` frozen without GameKey; `20260901` adds GameKey with `OldActor = {}`; `check-limit = 5`). `snapshots/deployed/` still four files; newest GameKey shape is `pr259-tail-20260901.most`. No post-#324 refresh. **22 days** of zero `main` commits after #332. ENGINEERING: import of HEAD vs Aug-31 `.old` should now pass. Ops: this run cannot see Caffeine’s private copy.  
SYSTEMS_AFFECTED: Caffeine deploy; `.old`; `snapshots/deployed/`; GameKey shop  
RECOMMENDED_ACTION: Human: GitHub → Caffeine import of current `main`. On success, replace `.old` with that build’s `src/backend/dist/backend.most` and add the same file under `snapshots/deployed/`. Do not hand-write `.old`. Do not add new stables until this lands.  
AUTONOMY: HUMAN_REVIEW + deploy  
DEPENDENCIES: MTD-2026-09-02-002 (source done)  
REGRESSION_RISK: HIGH if a parallel agent amends 20260831 / 20260901; LOW if deploy is the only Motoko change.  
VALIDATION_REQUIRED: Caffeine `install_code` no longer traps; GameKey request/approve/redeem works on a populated canister; repo `.old` md5 matches the newly deployed `.most`; `python3 scripts/check-eop-stables.py` still passes.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-09-02-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze new persistent let/var on main.mo until the 20260901 tail is deployed and .old refreshed  
CATEGORY: data-persistence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Frozen chain files on `main` unchanged. #362 is behavior-only — still HOLD until flock triage, but it is **not** a stuffed NewActor. Discovery / telemetry / admin lifecycle maps would be new stables.  
SYSTEMS_AFFECTED: `src/backend/main.mo`; `src/backend/migrations/`; discovery persist; telemetry increment maps; admin lifecycle  
RECOMMENDED_ACTION: No new stables until MTD-2026-09-21-002. Then: new later lex file after `20260901`; never edit a shipped NewActor; bump `check-limit`; populated `check-stable`.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-09-21-002  
REGRESSION_RISK: HIGH if discovery or telemetry writers add maps this hour.  
VALIDATION_REQUIRED: Next Motoko PR that adds a `let`/`var` also adds a new migration file whose OldActor lacks that field.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-008  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Convert the security 9-finding set into an architecture decision  
CATEGORY: security-architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Clamp/no-mint is on `main`. `writeLevel` always `character.level`. #322 caps AP/MP. Glob `docs/**/*ADR*` = 0. Finding 3 is still restated as “must not write Doka.” Security `c97e5c0c` is RUNNING this hour.  
SYSTEMS_AFFECTED: `src/backend/main.mo`; `docs/ARCHITECTURE.md`  
RECOMMENDED_ACTION: Write the ADR: (a) official-client trust + store-relative clamps (current de-facto, including ignore-client level), or (b) canister proofs. Rewrite finding 3. Do not open a fifth clamp PR. Do not revert GameKey.  
AUTONOMY: HUMAN_DECISION + reviewed docs PR  
DEPENDENCIES: MTD-2026-08-31-002 (done); MTD-2026-09-01-005 (done)  
REGRESSION_RISK: HIGH if APIs tighten without a frontend roll.  
VALIDATION_REQUIRED: ADR merged; security findings marked decided.  
STATUS: PARTIAL  

---

ACTION_ID: MTD-2026-09-21-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Restack and merge leftover #327 — Striker fails when AoE or bounce lands beyond 2 tiles  
CATEGORY: economy-challenge  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Oldest open PR (`createdAt` 2026-09-02 16:23). Still draft, now **23 days** stale, `mergeable_state: dirty` vs `0f5363f` (base `441266a`). Unique on `main`: legendary_3 consulted only the aim tile. **#370** is a later **superset**. Economy hunter `1e548d83` is RUNNING tonight and must not open a third Striker PR. Also the oldest-first queue head (MTD-2026-09-25-005).  
SYSTEMS_AFFECTED: `challengeCompletion.ts`; targeting / player-cast; summon executor; Striker feat  
RECOMMENDED_ACTION: Restack **#327** onto current `origin/main` first (oldest `createdAt`). Keep one `export function` per name. After it merges, restack **#370**’s unique delta only (summon/AI kit-cast notice). Close #370 if its unique delta is folded into the #327 restack. Do not retune 400/800.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: None (oldest open PR). Hold tonight’s economy hunter from cloning it a third time.  
REGRESSION_RISK: MEDIUM if restack concatenates duplicate helpers; HIGH if #327 and #370 both merge with two `applyChallengeDirectHitOnCast` copies.  
VALIDATION_REQUIRED: AoE splash beyond 2 fails; bounce beyond 2 fails; nearby splash+bounce still pays; after #370 unique delta, AI kit-cast beyond 2 fails; `pnpm typecheck && pnpm check`; stack-compat `--self`.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-09-22-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Treat #370 as Striker follow-up, not a twin of #327  
CATEGORY: economy-challenge  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. #370 title still “fail Striker when AoE, bounce, or AI kit-cast lands beyond 2 tiles.” #327 already owns splash/bounce. Duplicate `applyChallengeDirectHitOnCast` in one file fails Caffeine `vite build`.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`; `challengeCompletion.ts`; `summonExecutor.ts`  
RECOMMENDED_ACTION: HOLD #370 until #327 is on `main`. Then union the unique summon/AI path. Do not open a third Striker PR this hour.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-09-21-003  
REGRESSION_RISK: HIGH if both land without union  
VALIDATION_REQUIRED: One `export function applyChallengeDirectHitOnCast` after merge.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-09-21-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Hold #331 and further mapGen portal-punch patches; extract a battle-graph punch policy  
CATEGORY: sensitive-code  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused, worse. `mapGen.ts` still **1,937**. Drafts now **sixteen**: prior twelve plus **#538 #542 #548 #553**. Guardian `9dcfd122` still enabled and RUNNING. `AGENTS.md` still forbids map-generation edits. Local patches are no longer sufficient.  
SYSTEMS_AFFECTED: `src/frontend/src/engine/mapGen.ts`; battle-start destack; portals  
RECOMMENDED_ACTION: HOLD all sixteen. Guardian = failing seed fixtures + ACTION_IDs only. When a human authorizes: one helper (`shouldPunchPortalNeighbor` / stay-on battle component) + the #321/#329/#331 seeds as tests. Do not rewrite cellular automata. Do not auto-refactor this hour.  
AUTONOMY: HUMAN_CONFIG + IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: AQA-2026-08-30-006; MTD-2026-09-25-004  
REGRESSION_RISK: HIGH if another punch lands without playtest of cramped portal + five far rats.  
VALIDATION_REQUIRED: Next solvability run opens 0 mapGen PRs. Human playtest of #321/#329 before any punch helper.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Throttle the critical / high-severity bug hunter  
CATEGORY: automation-ops  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `996df6df-9d7a-11f1-a7d1-d6b4613131ce` still not GetAutomation-visible (confirmed this run). WX is 19,213 lines. Leftover gameplay drafts already cover unique defects.  
SYSTEMS_AFFECTED: `996df6df-9d7a-11f1-a7d1-d6b4613131ce`; `WorldExploration.tsx`  
RECOMMENDED_ACTION: REDUCE_FREQUENCY to at most once per 12–24 hours; pause 6 hours after a `main` merge that touches WX or persist; pause the first tick after a freeze **and** while >20 gameplay drafts sit unmerged.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-002  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: ≤14 hunter runs/week.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Keep a single critical-bug automation  
CATEGORY: automation-ops  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Volume problem is combat/persist/admin/economy/map/expansion/AI implementers, not a missing hunter. `1aa41c6c` remains enabled.  
SYSTEMS_AFFECTED: `1aa41c6c`; `996df6df`  
RECOMMENDED_ACTION: MERGE hunters. Keep one at AQA-001 cadence. Pause expansion/AI/combat-parity/map-guardian until P0/P1 close.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Only one critical-bug automation ID fires per day. Expansion/AI do not open a gameplay PR this cycle.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-006  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze mapGen after #110 (and the follow-up punches)  
CATEGORY: sensitive-code  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. See MTD-2026-09-21-004 / MTD-2026-09-25-004. Sixteen open mapGen PRs. Guardian `9dcfd122` still enabled and RUNNING.  
SYSTEMS_AFFECTED: `src/frontend/src/engine/mapGen.ts`  
RECOMMENDED_ACTION: Report-only unless a human authorizes a playtested helper. Close or hold any 09-21…09-25 mapGen PR.  
AUTONOMY: HUMAN_CONFIG  
REGRESSION_RISK: HIGH if another punch lands without playtest.  
VALIDATION_REQUIRED: Next solvability run opens 0 mapGen PRs.  
STATUS: BROKEN  

---

ACTION_ID: AQA-2026-08-30-007  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze drive-by WorldExploration edits  
CATEGORY: sensitive-code  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. File is 19,213 lines. Combat parity `f37b7505` is enabled and RUNNING tonight. Open WX-touching drafts include the leftover-walk mill, Swap #541, and #501 RAF.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`  
RECOMMENDED_ACTION: New behavior in `engine/*` or `utils/*` with tests; WX one-line wiring. Reject PRs whose primary hunk is another WX branch. Exception: restack of #327 if it stays helper-shaped. Hold #501 and #541.  
AUTONOMY: HUMAN_CONFIG + review  
REGRESSION_RISK: MEDIUM — some remaining defects are still WX closures.  
VALIDATION_REQUIRED: Next director-week WX commit count under 10, excluding one-line helper wiring.  
STATUS: BROKEN  

---

ACTION_ID: MIMA-2026-08-31-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Swap landing skips lava, spikes, ice, and Void Rift walk damage  
CATEGORY: combat-correctness  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Reconfirmed on `0f5363f`. `swapPositions` (`WorldExploration.tsx` 9389–9402) still copies coordinates and does not call `applyBattleWalkHazards`. Glob `applyHazardLanding` = 0 files. Occupancy helper exists for summons; Swap does not use it. 09-24 opened **#541** “Swap uses live tile and aborts leftover walk” — a local WX patch on this hotspot. HOLD #541.  
SYSTEMS_AFFECTED: Swap; hazards; challenges  
RECOMMENDED_ACTION: Extract `applyHazardLanding` + tests; one WX call site. Do not change damage numbers. Do not grow WX without the helper. Do not merge #541 as a standalone Swap branch. After flock halt.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: AQA-2026-08-30-007; MTD-2026-09-25-001  
REGRESSION_RISK: MEDIUM — must not double-charge a walk that already ran the stepper.  
VALIDATION_REQUIRED: Swap onto lava increments challenge damage; walk path still charges once.  
STATUS: OPEN  

---

ACTION_ID: MIMA-2026-09-02-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: GameKey redeem commits canister Doka without honouring an unpaid death 20/40 cut  
CATEGORY: rewards + death + persistence  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Reconfirmed: `redeemGameKeyThroughPersist` still raw lock+grant. **#391** drafts the helper in a **new file** and explicitly does not edit `shopPurchase.ts`. Helper is the right shape; wiring is still open. `gameKeyUnpaidDeath.ts` is **not** on `main`.  
SYSTEMS_AFFECTED: GameKey shop; death penalty; persist lock; HUD wallet  
RECOMMENDED_ACTION: After flock halt: merge #391 (helper + tests) **or** restack the helper onto a quiet `shopPurchase.ts`, then one import at the redeem commit. Do not recut a `cutConfirmed` wallet. Do not change redeem canister math.  
AUTONOMY: IMPLEMENT_HELPER_THEN_SHOP_CREDIT  
DEPENDENCIES: Do not clone EOP. Reuse `applyUnpaidDeathPenaltyToWrite`. Hold persist twins that own `shopPurchase.ts` until unioned.  
REGRESSION_RISK: MEDIUM — must not tax a GameKey after the death cut already landed.  
VALIDATION_REQUIRED: Unit test: pending 80 Doka loss + redeem 1000 ⇒ lock Doka honours the cut; `cutConfirmed` redeem does not subtract again.  
STATUS: OPEN  

---

ACTION_ID: EXPANSION-PREREQ-A  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Pass a number into buildEnemyKit, not the LevelZone object  
CATEGORY: enemy-content  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Reconfirmed on `0f5363f`. `buildEnemyKit` (`enemyAI.ts` 194–199) takes `levelZone: number`. Call site `WX` 11920 still passes `currentMap.levelZone`. `setCurrentZoneTier(playerTier + 1)` already stores the number (`WX` 1136 / 4680). `Math.floor(object)` is `NaN` → zone-0 forever. Survived **seven** director cycles.  
SYSTEMS_AFFECTED: enemy kits; overworld spell pools; infinite progression  
RECOMMENDED_ACTION: After flock halt: pass `currentZoneTier` (or `playerTier`) into `buildEnemyKit`. One call site + `enemyAI` test. Do not grow WX. Do not rewrite kits. Do not ship it inside tonight’s AI/expansion PRs.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: MTD-2026-09-25-001; AQA-2026-08-30-007  
REGRESSION_RISK: LOW if only the argument changes; HIGH if bundled with an AI rewrite.  
VALIDATION_REQUIRED: Zone-1 pawn kit includes venom-strike; zone-0 does not.  
STATUS: OPEN  

---

ACTION_ID: SDA-2026-08-31-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Stop treating the live catalog as ownedSpells  
CATEGORY: ownership-persist  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–718) returns true whenever `usableByPlayer !== false`. No `ownedSpellIds` / observe path. 09-21…09-25 produced more overlapping discovery catalogs — content cards, not a persist shape.  
SYSTEMS_AFFECTED: spellbook; admin catalog; future discovery  
RECOMMENDED_ACTION: After ADR + deploy confirmation: new later migration for ownership maps; seed innates only; catalog `getSpellConfigs` does not imply ownership. Never `spell.name`. Do not stuff 20260901.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: MTD-2026-09-21-002; AQA-2026-08-30-008; SDA-2026-08-31-004  
REGRESSION_RISK: HIGH — under-seed drops the bar; over-seed reintroduces catalog-as-ownership.  
VALIDATION_REQUIRED: New character owns only innate ids. Admin adding a catalog spell does not change another account’s book.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-012  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Outcome telemetry before any dashboard  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Still no collectors on `0f5363f` (`src/backend` grep `recordTelemetry` = 0). TBC correctly WAITING this hour (#556). Dashboard specialist skipped a fifth Health matrix (#559). Telemetry increment maps would be new stables — blocked on MTD-2026-09-02-003.  
SYSTEMS_AFFECTED: future counters; Admin telemetry UI  
RECOMMENDED_ACTION: Design + tiny persist-lock-enqueued counters **after** deploy confirmation. No dashboard UI. No balance labels. Fail-open. Never join GameKey email/code.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: MTD-2026-09-02-003  
REGRESSION_RISK: HIGH if a second persist path is invented or stables are stuffed into 20260901.  
VALIDATION_REQUIRED: Zero CLEAR_POSITIVE_SIGNAL claims until rows exist.  
STATUS: OPEN  

---

ACTION_ID: TBC-2026-08-31-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Keep balance analyst gated until telemetry rows exist  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Fresh search this run: 0 `recordTelemetry` hits in `src/backend`. TBC agent `2786666f` opened [#556](https://github.com/Mr-Melic/stralt/pull/556) WAITING_FOR_TELEMETRY — correct.  
SYSTEMS_AFFECTED: Telemetry-Driven Balance automation  
RECOMMENDED_ACTION: STATUS WAITING_FOR_TELEMETRY. No BAL-* implementation. Write TBC ACTION_IDs to `ACTION_IDS_TBC_YYYY-MM-DD.md`, not the director file. Keep one TBC dated report; later twins (#395/#462/#502/#556) do not need sequential merge.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-012  
REGRESSION_RISK: HIGH if formulas change without data.  
VALIDATION_REQUIRED: Next TBC report is WAITING_FOR_TELEMETRY with 0 BAL implementation PRs.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-08-31-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze content / AI / feel / admin implementation until P0/P1 settle  
CATEGORY: expansion-gating  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused, worse. 09-21…09-24 catalog PRs plus tonight’s expansion `3f31b18f` (RUNNING), AI `67b03c2f` (RUNNING), spell mechanics, dungeon encounters, world mechanics, enemy formations. `fe5b679a` did not appear in this hour’s flock list. That is expansion overlap, not a license to implement.  
SYSTEMS_AFFECTED: expansion / AI / feel / admin implementers  
RECOMMENDED_ACTION: Docs and ACTION_IDs only until deploy confirmation + ADR + landing helper exist. Exception: PREREQ-A one-liner after halt. Pause `3f31b18f` and `67b03c2f`.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-09-25-001; MTD-2026-09-21-002  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: No SDA/SDE/EBA/AI/expansion gameplay PR from the 09-25 wave.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-09-02-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Stop concatenating specialist catalogs into dated director ACTION_ID files  
CATEGORY: process  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `ACTION_IDS_2026-09-01.md` remains concatenated. 09-02 director file stayed clean. 09-21…09-24 director files exist only on #338/#402/#448/#509. This run writes `ACTION_IDS_2026-09-25.md` only and does not append to those files.  
SYSTEMS_AFFECTED: `docs/automation/ACTION_IDS_*.md`  
RECOMMENDED_ACTION: Each producer writes `ACTION_IDS_<PREFIX>_YYYY-MM-DD.md`. Director maintains MASTER_ROADMAP + `ACTION_IDS_YYYY-MM-DD.md` (director IDs only). TBC must not write into the director file. Do not append to 08-31, 09-01, 09-02, 09-21, 09-22, 09-23, or 09-24.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-003  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next wave adds 0 lines to ACTION_IDS_2026-08-31.md, ACTION_IDS_2026-09-01.md, ACTION_IDS_2026-09-02.md, ACTION_IDS_2026-09-21.md, ACTION_IDS_2026-09-22.md, ACTION_IDS_2026-09-23.md, and ACTION_IDS_2026-09-24.md.  
STATUS: OPEN  
