# ACTION_IDs — 2026-10-22 Master Technical Director

Durable director ledger. Reuse existing IDs. Do not append specialist catalogs here.

**HEAD:** `0f5363f` (`Merge pull request #332`) — **unchanged since 2026-09-03 00:28 UTC**  
**Prior director:** unmerged [`#814`](https://github.com/Mr-Melic/stralt/pull/814) + memories (`bc-a344d1c1-af31-438f-8062-b115d87ef46b`). Unmerged [`#338`](https://github.com/Mr-Melic/stralt/pull/338) / [`#402`](https://github.com/Mr-Melic/stralt/pull/402) / [`#448`](https://github.com/Mr-Melic/stralt/pull/448) / [`#509`](https://github.com/Mr-Melic/stralt/pull/509) / [`#569`](https://github.com/Mr-Melic/stralt/pull/569) / [`#618`](https://github.com/Mr-Melic/stralt/pull/618) / [`#666`](https://github.com/Mr-Melic/stralt/pull/666) / [`#718`](https://github.com/Mr-Melic/stralt/pull/718) / [`#783`](https://github.com/Mr-Melic/stralt/pull/783) are earlier snapshots. On `main`, [`MASTER_ROADMAP.md`](./MASTER_ROADMAP.md) is still the 2026-09-02 text.  
**This agent:** `bc-d4c11259-c6b6-4a7c-a98a-f0ecce5fa22d`  
**Gameplay / production code:** not modified this run.

Specialist IDs stay in their producer files. Do not concatenate into this ledger. Do not append to `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, `ACTION_IDS_2026-09-21.md` through `ACTION_IDS_2026-10-21.md`.

---

## Status of prior director IDs (reuse; do not mint twins)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| MTD-2026-08-31-001 / MTD-2026-09-01-001 | OPEN | Halt-as-config failed 08-31…09-29 and **10-21** (56 PRs). Recurring **2026-10-22 00:00**: **30** automations already RUNNING. Halt-as-merge-stop held **49 days** (`main` still `0f5363f`). |
| MTD-2026-09-21-001 | PARTIAL | 09-21 wave opened **59** drafts. Humans **did not merge** them. |
| MTD-2026-09-22-001 … 29-001 | SUPERSEDED | Those waves already happened. |
| MTD-2026-10-21-001 | SUPERSEDED | 10-21 wave already ran: 87 agents, 0 ERROR, **56 PRs**. See MTD-2026-10-22-001 / 003. |
| MTD-2026-09-02-001 | SUPERSEDED | 09-02 wave already merged. |
| MTD-2026-09-02-002 | IMPLEMENTED (source) | #259 / #311 / #324. Deploy half → MTD-2026-09-21-002. |
| MTD-2026-09-21-002 | OPEN | `.old` still Aug-31 no-GameKey. No `snapshots/deployed/` file newer than `pr259-tail-20260901.most`. **49 days.** |
| MTD-2026-09-02-003 | OPEN | Freeze new stables until deploy confirmed. Frozen chain files untouched on `main`. #362 edits `main.mo` **behavior only**. |
| MTD-2026-09-02-004 / AQA-2026-08-30-003 | PARTIAL | This run writes `ACTION_IDS_2026-10-22.md` only. Living index still off `main`. |
| MTD-2026-09-21-003 | OPEN | **#327 still open** (oldest draft, **50 days** stale, `mergeable: CONFLICTING`). #370 is a later Striker **superset**. |
| MTD-2026-09-21-004 | OPEN | #331 still open and **CONFLICTING**. Hold all **35** mapGen punches. |
| MTD-2026-10-21-002 | OPEN | Close #338/#402/#448/#509/#569/#618/#666/#718/#783. Subsumed/extended by MTD-2026-10-22-002 (+#814). |
| MTD-2026-10-21-003 | OPEN | Historical: 09-30…10-20 was ERROR/boot. 10-21 recovered (87 IDLE / 0 ERROR). Do not relabel the gap as a halt. |
| MTD-2026-10-21-004 | SUPERSEDED | Queue was 482; now **538**. See MTD-2026-10-22-004. |
| MTD-2026-09-22-004 | OPEN | #370 still HOLD until after #327. Still `MERGEABLE`. |
| MTD-2026-09-25-005 | OPEN | Oldest-first still makes the living index unreachable. #327 now 50 days CONFLICTING; #331 also CONFLICTING; queue 538; eleven director snapshots. |
| AQA-2026-08-30-008 | PARTIAL | Clamps + ignore-client level + AP/MP cap; **no ADR** (`docs/**/*ADR*` = 0). Security `c97e5c0c` RUNNING tonight. |
| AQA-2026-08-30-006 | BROKEN | mapGen still **1,937**. Thirty-five open punch PRs. Guardian `9dcfd122` RUNNING. |
| AQA-2026-08-30-007 | BROKEN | WX still **19,213**. `#831/#842` already touch it. Complexity-reduction `386a157d` RUNNING. |
| AQA-2026-08-30-005 | PARTIAL | Test mill still in the leftover queue. Defect-recurrence `81c2e934` RUNNING. |
| AQA-2026-08-30-012 | OPEN | Still 0 collectors. TBC `#833` correctly WAITING. Telemetry-architecture `#816` is design-only. |
| TBC-2026-08-31-001 | OPEN | WAITING_FOR_TELEMETRY. Confirmed this run (`longHorizonSim.telemetry.available === false`). Keep **#333**; close later twins including **#833** after the living TBC file lands — do not retune from any of them. |
| MIMA-2026-08-31-001 | OPEN | Swap still teleports (`WX` 9389–9402). No `applyHazardLanding` in `src/`. **HOLD #541 and #754**. |
| MIMA-2026-08-31-002 | PARTIAL | Dest occupancy/unseal landed; **no** hazard landing. |
| MIMA-2026-09-01-001 | IMPLEMENTED | #313 `battleWalkMpCost` on execute. |
| MIMA-2026-09-01-002 | PARTIAL | Barriers in `isBattleWalkTileBlocked`. Occupants still missing from `findPath` (`WX` 4466–4574). |
| MIMA-2026-09-02-001 | IMPLEMENTED | #318 `enemyWalkMp.ts`. |
| MIMA-2026-09-02-003 | OPEN (helper drafted) | `redeemGameKeyThroughPersist` still raw lock+grant (`shopPurchase.ts` 294–330). **#391** adds the helper, **does not wire** redeem. |
| PXA-2026-09-02-002 | IMPLEMENTED | #332 accepted-challenge HUD. |
| SDA-2026-08-31-002 / SDA-2026-09-01-003 / SDA-2026-09-02-003 | OPEN | Catalog still hydrates into every book (`adminSafety.ts` 712–718). |
| SDA-2026-08-31-004 | OPEN | No observe→win persist. |
| EXPANSION-PREREQ-A | OPEN | `WX` 11920 still passes LevelZone object. Number already at 1136 / 4680. Thirteenth cycle. |
| MTD-2026-08-31-003 | OPEN | HP/death extraction. Not tonight. |
| MTD-2026-08-31-004 | OPEN | Expansion freeze. AI `67b03c2f`, boss `39040ad2`, dungeon `73740435`, Approved Design `fe5b679a`, spell mechanics `1330956a` **RUNNING this hour**. |
| MTD-2026-08-31-005 | OPEN | `useSaveKillCount` has no TSX caller. |
| MTD-2026-08-31-006 | OPEN | Admin DVA not canister. Dashboard 8,280 lines. |
| MTD-2026-08-31-007 | OPEN | Point at SDA-002/004; no fifth schema. Wave 13/14 catalogs are twins. |
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
EVIDENCE: Failed 2026-08-31, 09-01, 09-02 (humans then merged). Halt-as-merge-stop then held **49 days** (`main` still `0f5363f`). Recurred 09-21…09-29 (~50 drafts/day), then a 22-day ERROR outage, then **2026-10-21** recovery that opened **56 PRs**, then **2026-10-22 00:00** with **30** agents already RUNNING (map guardian, AI, Approved Design, boss, dungeon, complexity reduction, spell mechanics, spell discovery, defect-test mill). Cursor Cloud has no prompt write API.  
SYSTEMS_AFFECTED: all Cursor Cloud automations; leftover GitHub queue; WX / mapGen / persist / enemyAI / AdminDashboard  
RECOMMENDED_ACTION: HUMAN_CONFIG: disable implementers (Approved Design `fe5b679a`, complexity `386a157d`, combat-parity `f37b7505`, map guardian `9dcfd122`, persist `607e0304`, AI `67b03c2f`, boss `39040ad2`, dungeon `73740435`, spell mechanics `1330956a`, spell discovery `c26e5a83`, critical hunter `1aa41c6c`, admin implementer `3089f18d`, world-content `1592c6c0`) until P0/P1 close. Report-only specialists may stay on cron. Do not merge tonight’s PRs.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: none  
REGRESSION_RISK: LOW for a pause; HIGH if implementers keep shipping  
VALIDATION_REQUIRED: Next director run sees fewer same-hour gameplay PRs than 10-21’s 29 non-docs drafts, or documents another config miss.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-10-22-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Hold the 2026-10-22 00:00 specialist wave; do not treat 10-21 recovery as a green light  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `list-cloud-agents` createdAfter 2026-10-22T00:00Z returned **30 RUNNING** in the first minutes, including map integrity `9dcfd122`, AI `67b03c2f`, Approved Design `fe5b679a`, boss `39040ad2`, dungeon `73740435`, complexity reduction `386a157d`, spell mechanics `1330956a`, spell discovery `c26e5a83`, defect-recurrence `81c2e934`, world-content admin `1592c6c0`. 10-21 same-hour pattern grew to 87 agents and 56 PRs. `main` still `0f5363f`. P0/P1 from #814 are all still open.  
SYSTEMS_AFFECTED: leftover queue; WX; mapGen; enemyAI; AdminDashboard; spellEngine; main.mo stables  
RECOMMENDED_ACTION: Default HOLD every PR this wave opens, especially gameplay. Docs-only catalogs may remain unmerged. Do not implement Wave 13/14, healer-interpose gates, or dust-mote extracts tonight.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-08-31-001  
REGRESSION_RISK: HIGH if tonight’s implementers land on frozen files  
VALIDATION_REQUIRED: 10-22 gameplay PR count is reported next run; none merged to `main`.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-10-22-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Supersede unmerged director PRs #338, #402, #448, #509, #569, #618, #666, #718, #783, and #814; keep one living roadmap on main  
CATEGORY: process  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Eleven open director PRs rewrite `MASTER_ROADMAP.md`. None merged. `main` still serves the 2026-09-02 roadmap, so 09-21 through 10-22 flocks planned against a stale index. Oldest-first stack-compat cannot insert a twelfth living index behind that queue plus CONFLICTING #327.  
SYSTEMS_AFFECTED: `docs/automation/MASTER_ROADMAP.md`; director ACTION_ID files; merge queue  
RECOMMENDED_ACTION: Close #338, #402, #448, #509, #569, #618, #666, #718, #783, and #814 without merge (this PR subsumes all ten snapshots plus the 10-22 delta). Do not merge all eleven. Future director runs write `ACTION_IDS_YYYY-MM-DD.md` and replace the living `MASTER_ROADMAP.md`.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-21-002  
REGRESSION_RISK: LOW — docs only; 09-21…10-21 facts are copied forward  
VALIDATION_REQUIRED: After merge, `main` `MASTER_ROADMAP.md` header date is this run; the ten listed PRs are closed.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-10-22-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Classify the 2026-10-21 flock as a recovered platform that immediately rebuilt the mill, not a successful halt  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: 10-21 launched **87** automations, **0 ERROR**, and opened **56** PRs (`#814`–`#869`) including WX hits `#831` (dust-mote extract) and `#842` (hostile summon kits), **11+** share-kit advertised-execute patches, **6** new skip-wipe twins, and **4** new map crumb punches. That is the opposite of MTD-2026-10-21-001’s hold. The 09-30…10-20 ERROR mill (MTD-2026-10-21-003) is still correctly an outage; recovery without dashboard disable is not a control.  
SYSTEMS_AFFECTED: all Cursor Cloud automations; leftover queue  
RECOMMENDED_ACTION: Do not close MTD-2026-08-31-001. Do not praise 10-21 as “flock healthy.” Keep implementers paused through recovery. Log that a recovered cron that opens 56 drafts in one day is **worse** than a silent outage for merge-stop.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-08-31-001; MTD-2026-10-21-003  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next director ledger distinguishes outage vs pause vs recovered-mill; implementers stay disabled.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-10-22-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Triage the 538-draft leftover queue; do not merge-burst it after a 49-day freeze  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open PR count = **538**, all drafts. Grew 482 (10-21 00:00) → 538 by 10-21 21:11, then this midnight. Prefix mix: **264** docs, **230** fix, **62** `fix(combat)`, **35** `fix(map)`, **14** skip-wipe, **33** leftover, **13** advertised-kit. Oldest #327 is CONFLICTING vs `0f5363f` (50 days). Humans have not merged `main` since 2026-09-03. Merging oldest-first would restack eight weeks of overlapping WX / mapGen / persist / combat PRs onto a freeze that was working.  
SYSTEMS_AFFECTED: GitHub merge queue; Caffeine import; `WorldExploration.tsx`; `mapGen.ts`; persist lock; `spellEngine.ts`  
RECOMMENDED_ACTION: Do not “clear the queue.” Close superseded director snapshots. Restack #327. Hold mills (map / skip-wipe / leftover-walk / Swap / combat-gate / share-kit). Unique leftovers listed in MASTER_ROADMAP.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-22-002; MTD-2026-09-25-005  
REGRESSION_RISK: HIGH if the queue is merge-bursted  
VALIDATION_REQUIRED: `main` does not receive a multi-PR gameplay burst from #333–#869 or the 10-22 wave. Open count falls by closes, not by merging mills.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-10-22-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Stop one-flag advertised-vs-execute kit patches; extract one resolveKitExecute helper after halt  
CATEGORY: correctness  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: 10-21 opened at least `#843` (boss buffStat), `#850` (boss isSwap), `#851` (boss isMark), `#852` (boss isMirror), `#856` (summon DoT ticks), `#857` (boss heal+buff CHC), `#862` (summon heal+buff CHC), `#865` (summon buffStat), `#868` (boss Chain Lightning bounces), plus `#842/#861` hostile/auto-summon catalog kits. That is **local patches no longer sufficient**. `applyHazardLanding` is still missing; Swap still teleports. Growing `spellEngine.ts` / WX / enemyAI by one metadata field per cron is the combat mill’s new shape.  
SYSTEMS_AFFECTED: `spellEngine.ts`; `enemyAI.ts`; boss/summon kit tables; `WorldExploration.tsx`  
RECOMMENDED_ACTION: HOLD the 10-21 share-kit PRs. After halt, one helper that executes kits from advertised metadata (`buffStat`, `isSwap`, `isMark`, `isMirror`, DoT ticks, bounce count, heal+buff CHC) with tests. Close twins. Do not concatenate. Hostile-summon empty-`spells` wiring (`#842/#861`) is a **separate** one-line spawn fix after halt — do not fold it into the helper PR.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-22-001 (halt first)  
REGRESSION_RISK: HIGH if twins merge as concatenated copies; MEDIUM for a single helper  
VALIDATION_REQUIRED: `python3 scripts/check-duplicate-exports.py src/frontend/src` clean; kit execute matches advertised flags in unit tests; open `share .* kit` count falls by close, not by merge-burst.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-09-25-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Unblock oldest-first so the living director index can land  
CATEGORY: process  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Oldest open PR is still **#327** (`CONFLICTING`, created 2026-09-02, now **50 days**). #331 also CONFLICTING. Ten superseded director PRs plus #814 all rewrite `MASTER_ROADMAP.md`. Stack-compat `--self` cannot insert a living index behind that queue.  
SYSTEMS_AFFECTED: `scripts/open-pr-stack-compat.sh`; GitHub merge button; `docs/automation/MASTER_ROADMAP.md`  
RECOMMENDED_ACTION: Restack #327 onto `0f5363f` or close it in favor of a fresh Striker PR **after** halt. Close #338/#402/#448/#509/#569/#618/#666/#718/#783/#814 without merge. Then this living index is merge-clean as the next docs item.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-09-21-003; MTD-2026-10-22-002  
REGRESSION_RISK: LOW for docs; HIGH if #327 is dropped without a replacement helper  
VALIDATION_REQUIRED: Living `MASTER_ROADMAP.md` is on `main`; #327 is either restacked MERGEABLE or explicitly replaced.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-09-21-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Confirm Caffeine deploy of the 20260901 GameKey tail and refresh `.old`  
CATEGORY: data-persistence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Source chain is correct (`20260901_000000.mo` GameKey, `OldActor = {}`, `check-limit = 5`). Tracked `.old` is still Caffeine’s **2026-08-31** no-GameKey signature (`snapshots/README.md`; grep GameKey in `.old` = 0). Newest deployed snapshot on disk is `pr259-tail-20260901.most`. No evidence this run of a later successful Caffeine deploy. 49 days since `main` last moved.  
SYSTEMS_AFFECTED: `.old/src/backend/dist/backend.most`; `src/backend/migrations/snapshots/deployed/`; GameKey shop on the live canister  
RECOMMENDED_ACTION: After a successful Caffeine deploy of HEAD, replace `.old` with that build’s `src/backend/dist/backend.most` (byte-identical) and add the same file under `snapshots/deployed/`. Never hand-write `.old`. Until then freeze new persistent `let`/`var`.  
AUTONOMY: HUMAN_REVIEW + deploy  
DEPENDENCIES: MTD-2026-09-02-002 (source done)  
REGRESSION_RISK: HIGH if `.old` is hand-written (PR #311 class)  
VALIDATION_REQUIRED: `python3 scripts/check-eop-stables.py` still passes; Caffeine import of HEAD does not M0263 GameKey; live `redeemGameKey` works on the populated canister.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-09-02-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze new persistent let/var on main.mo until 20260901 is confirmed deployed  
CATEGORY: data-persistence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Frozen `NewActor`s on `main` were not amended this run. Discovery / telemetry / admin lifecycle maps would be new stables. #362 is behavior-only. Tonight’s spell-discovery `c26e5a83` is RUNNING.  
SYSTEMS_AFFECTED: `src/backend/main.mo`; `src/backend/migrations/`  
RECOMMENDED_ACTION: No new stables until MTD-2026-09-21-002. Then: new later lex file after `20260901`; never edit a shipped NewActor; bump `check-limit`; populated `check-stable`.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-09-21-002  
REGRESSION_RISK: HIGH if discovery or telemetry writers add maps this hour  
VALIDATION_REQUIRED: Next Motoko PR that adds a `let`/`var` also adds a new migration file whose OldActor lacks that field.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-008  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Convert the security 9-finding set into an architecture decision  
CATEGORY: security-architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Clamp/no-mint, ignore-client level, AP/MP cap are on `main`. Glob `docs/**/*ADR*` = 0. Finding 3 is still restated as “must not write Doka” by security runs. `calculateAndAwardDoka` unused. `markAchievementUnlocked` still client-asserted. Security `c97e5c0c` is RUNNING this hour.  
SYSTEMS_AFFECTED: `src/backend/main.mo`; `docs/ARCHITECTURE.md`  
RECOMMENDED_ACTION: Write the ADR: (a) official-client trust + store-relative clamps (current de-facto), or (b) canister proofs. Rewrite finding 3. Do not open a third clamp PR. Do not revert GameKey.  
AUTONOMY: HUMAN_DECISION + reviewed docs PR  
DEPENDENCIES: MTD-2026-08-31-002 (done); MTD-2026-09-01-005 (done)  
REGRESSION_RISK: HIGH if APIs tighten without a frontend roll  
VALIDATION_REQUIRED: ADR merged; security findings marked decided.  
STATUS: PARTIAL  

---

ACTION_ID: MTD-2026-09-21-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Restack and merge #327 Striker AoE/bounce aim-tile helper  
CATEGORY: correctness  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Oldest open PR, created 2026-09-02, `mergeable: CONFLICTING` vs `0f5363f`, now 50 days. Twin #370 adds AI kit-cast / summon and is still `MERGEABLE`. Do not merge #370 first.  
SYSTEMS_AFFECTED: `challengeCompletion.ts`; targeting; `WorldExploration.tsx`  
RECOMMENDED_ACTION: Restack #327 onto current `main`. Merge. Then union #370 unique delta only (MTD-2026-09-22-004).  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-22-001 (halt first)  
REGRESSION_RISK: MEDIUM — challenge completion  
VALIDATION_REQUIRED: Striker fails when AoE/bounce lands beyond 2 tiles from the **player** tile; Attack Nearest caster-tile gates from #326 still hold.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-09-22-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: After #327, union #370 unique AI/summon Striker delta only  
CATEGORY: correctness  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. #370 still OPEN MERGEABLE. Contains the #327 hole plus AI kit-cast / summon. Concatenating both copies of the helper fails Caffeine `vite build`.  
SYSTEMS_AFFECTED: `challengeCompletion.ts`; `enemyAI.ts`  
RECOMMENDED_ACTION: HOLD until #327 lands. Union one `export function` per name.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-09-21-003  
REGRESSION_RISK: HIGH if both PRs merge as concatenations  
VALIDATION_REQUIRED: `python3 scripts/check-duplicate-exports.py src/frontend/src` clean.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-09-21-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze mapGen; hold all open portal-punch drafts including #331  
CATEGORY: map-integrity  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `mapGen.ts` is **1,937** lines on `main`. Open `fix(map)` count **31 → 35**. #331 still CONFLICTING. 10-21 added crumb/LAVA_TRAIL/SPIKE_ON_LAND/Chebyshev punches `#846/#855/#859/#867`. Guardian `9dcfd122` RUNNING tonight.  
SYSTEMS_AFFECTED: `src/frontend/src/engine/mapGen.ts`; spawn/portal keep-clear  
RECOMMENDED_ACTION: HOLD every mapGen implementation PR. Guardian emits fixtures + ACTION_IDs only. Do not playtest-by-merging.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-10-22-001  
REGRESSION_RISK: HIGH if punches land without a playtest of #321→#329  
VALIDATION_REQUIRED: `mapGen.ts` line count on `main` does not grow; open map-punch PRs close rather than merge.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Throttle the critical / high-severity bug hunter  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `996df6df` still not GetAutomation-visible. Volume problem remains the rest of the flock (30 RUNNING this hour; 87 yesterday).  
SYSTEMS_AFFECTED: Cursor automations  
RECOMMENDED_ACTION: HUMAN_CONFIG: identify and disable duplicate hunters. Keep a single critical hunter if any.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-002  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next director run does not see a same-hour critical-hunter mill.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Keep a single critical-bug automation  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `1aa41c6c` (“Find Critical Gameplay Bugs”) is **enabled**. Not in the first 30 of tonight’s wave yet; 10-21 ran it repeatedly through the day (00:03, 03:03, 06:02, 09:02, 12:03, 15:03, 18:01, 21:01).  
SYSTEMS_AFFECTED: leftover combat/persist mills  
RECOMMENDED_ACTION: Keep at most one enabled. Prefer report-only. Do not let it open skip-wipe or share-kit clones.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: At most one critical-hunter automation enabled.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-006  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze mapGen after #110 (and the follow-up punches)  
CATEGORY: map-integrity  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. See MTD-2026-09-21-004. BROKEN as intent; file frozen on `main` only because humans stopped merging.  
SYSTEMS_AFFECTED: `mapGen.ts`  
RECOMMENDED_ACTION: Same as MTD-2026-09-21-004.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-09-21-004  
REGRESSION_RISK: HIGH  
VALIDATION_REQUIRED: No mapGen implementation merge until an explicit human playtest.  
STATUS: BROKEN  

---

ACTION_ID: AQA-2026-08-30-007  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze drive-by WorldExploration edits  
CATEGORY: technical-health  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. WX **19,213**. 10-21 already opened `#831` (dust-mote extract) and `#842` (hostile summon kits). Complexity reduction `386a157d` RUNNING tonight.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`  
RECOMMENDED_ACTION: HOLD WX PRs except one-line helper wiring after halt (#327 restack, PREREQ-A, applyHazardLanding call site).  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-10-22-001  
REGRESSION_RISK: HIGH  
VALIDATION_REQUIRED: `main` WX line count does not grow; `#831/#842` stay unmerged.  
STATUS: BROKEN  

---

ACTION_ID: MIMA-2026-08-31-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Extract applyHazardLanding; Swap still teleports  
CATEGORY: correctness  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `WX` 9389–9402 `swapPositions` copies coordinates through `updateCombatant` with no occupancy and no hazard tax. Grep `applyHazardLanding` in `src/` = 0. `#541` and `#754` still OPEN MERGEABLE. `#850` is a share-kit `isSwap` twin — HOLD, not a landing fix.  
SYSTEMS_AFFECTED: Swap; controlled-summon walk; lava/spikes; Untouchable  
RECOMMENDED_ACTION: After halt, one helper + one-line WX/spellEngine wiring. HOLD `#541/#754/#850`. Do not change walk hazard math.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-22-001  
REGRESSION_RISK: MEDIUM — challenge Untouchable / lava deaths  
VALIDATION_REQUIRED: Swap onto lava/spikes charges the same HP as a walk landing; occupancy abort still holds.  
STATUS: OPEN  

---

ACTION_ID: MIMA-2026-09-02-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Honour unpaid death before GameKey lock credit  
CATEGORY: persistence  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `redeemGameKeyThroughPersist` (`shopPurchase.ts` 294–330) still lock+grant with no unpaid-death call. `#391` drafts a helper and does **not** wire redeem. Skip-wipe mill (`#847`…`#869`) is a different hole — do not treat those twins as this wire.  
SYSTEMS_AFFECTED: GameKey redeem; death penalty; persist lock  
RECOMMENDED_ACTION: Merge `#391` helper after halt, then a separate one-line wire inside `redeemGameKeyThroughPersist`. Do not merge skip-wipe clones instead.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-22-001  
REGRESSION_RISK: MEDIUM — wallet vs death cut  
VALIDATION_REQUIRED: Redeem after unpaid death applies 20/40 before crediting the grant; tests cover both.  
STATUS: OPEN  

---

ACTION_ID: EXPANSION-PREREQ-A  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Pass a number into buildEnemyKit, not the LevelZone object  
CATEGORY: content-infrastructure  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `buildEnemyKit` (`enemyAI.ts` 194–200) floors `levelZone: number`. Call site `WX` 11920 still passes `currentMap.levelZone`. Object constructed at `WX` 4683–4687. Number already at `currentZoneTier` (`WX` 1136 / 4680). Thirteenth director cycle. Unblocks “dynamic enemy spell pools” without an AI rewrite.  
SYSTEMS_AFFECTED: overworld enemy kits; `enemyAI.ts`; `WorldExploration.tsx`  
RECOMMENDED_ACTION: After halt, one call-site change + `enemyAI` test. No WX growth beyond that line. Do not retune kit contents.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-22-001; AQA-2026-08-30-007  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Zone-2 maps assign the zone-2 kit ids; `Math.floor` is not called on an object.  
STATUS: OPEN  

---

ACTION_ID: SDA-2026-08-31-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Stop treating the live catalog as every player’s spellbook  
CATEGORY: content-infrastructure  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–718) returns true whenever `usableByPlayer !== false`. Hydrate loop `WX` 2426–2438 still fills the book. Enemy-observed discovery and achievement/challenge/boss spell unlocks cannot ship on this shape. Requires a **new later** migration after deploy confirmation — not a stuffed NewActor.  
SYSTEMS_AFFECTED: spell library; discovery; admin catalog  
RECOMMENDED_ACTION: After P0 persist/deploy/ADR: ownership maps + starter seed. Do not implement Wave 13/14 spell catalogs first.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-09-21-002; AQA-2026-08-30-008; SDA-2026-08-31-004  
REGRESSION_RISK: HIGH if grants bypass the persist lock  
VALIDATION_REQUIRED: A newly activated catalog spell is not in a fresh profile’s book until observed/unlocked.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-012  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Add query-only outcome counters before any telemetry dashboard  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. No `recordTelemetry` / sidecar in `src/`. `longHorizonSim.telemetry.available === false`. 10-21 `#816` is architecture docs only. TBC `#833` WAITING. Game-balance automation `3c083a4a` is RUNNING tonight and must not retune.  
SYSTEMS_AFFECTED: future counters; AdminDashboard Health tab; TBC  
RECOMMENDED_ACTION: After halt + ADR: tiny isolated increment APIs, query-only or persist-lock-enqueued. No dashboard UI first. Keep `longHorizonSim.telemetry.available = false` until rows exist.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: AQA-2026-08-30-008; MTD-2026-10-22-001  
REGRESSION_RISK: MEDIUM if counters mint or block the persist lock  
VALIDATION_REQUIRED: At least persist-ok/fail, victory-paid, death-penalty-applied exist and TBC still WAITING until ≥1 UTC day of rows.  
STATUS: OPEN  

---

ACTION_ID: TBC-2026-08-31-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Remain WAITING_FOR_TELEMETRY; do not retune BAL-* from empty series  
CATEGORY: balance  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Confirmed this run. Keep `#333` as the first TBC leftover; later twins (`#395/#462/#502/#556/#609/#661/#833`) are dated copies. Tonight’s “Stralt game balance” `3c083a4a` is a **different** automation from TBC `2786666f` — neither may retune.  
SYSTEMS_AFFECTED: BAL-* / LHIPS-* ; TBC cron  
RECOMMENDED_ACTION: WAITING_FOR_TELEMETRY. No CLEAR_POSITIVE_SIGNAL. Distinguish MEASURED PLAYER BEHAVIOUR (none) from DESIGN INTERPRETATION and ENGINEERING EVIDENCE.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-012  
REGRESSION_RISK: HIGH if formulas move without rows  
VALIDATION_REQUIRED: Next TBC report is still WAITING or cites real counts with sample sizes.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-08-31-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze gameplay expansion until P0/P1 infrastructure exists  
CATEGORY: expansion-governance  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. 10-21 expansion `#823` already files EXP-037/038 on `decideHealer`. Tonight: expansion `3f31b18f`, AI `67b03c2f`, boss `39040ad2`, dungeon `73740435`, Approved Design `fe5b679a`, spell mechanics `1330956a`, spell discovery `c26e5a83`, world variation `62dfc3fc` all RUNNING. Core rules (discovery, DVA, zone kits, progressive AI) are still unwired.  
SYSTEMS_AFFECTED: enemyAI; boss kits; dungeon encounters; spell catalogs; AdminDashboard  
RECOMMENDED_ACTION: Design catalogs may exist unmerged. No implementation PRs until halt + #327 + landing helper + ADR + GameKey deploy confirmation.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-10-22-001; MTD-2026-09-21-002; AQA-2026-08-30-008  
REGRESSION_RISK: HIGH  
VALIDATION_REQUIRED: No expansion implementation merge this cycle.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-09-02-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Stop concatenating specialist catalogs into dated director ACTION_ID files  
CATEGORY: process  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. This run writes `ACTION_IDS_2026-10-22.md` only. Does not append to 08-31, 09-01, 09-02, or 09-21…10-21 files.  
SYSTEMS_AFFECTED: `docs/automation/ACTION_IDS_*.md`  
RECOMMENDED_ACTION: Director = this dated file + living `MASTER_ROADMAP.md`. Specialists = `ACTION_IDS_<PREFIX>_YYYY-MM-DD.md`.  
AUTONOMY: AGENT_WITH_REVIEW  
DEPENDENCIES: none  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: This PR’s diff is `MASTER_ROADMAP.md` + `ACTION_IDS_2026-10-22.md` only.  
STATUS: OPEN  
