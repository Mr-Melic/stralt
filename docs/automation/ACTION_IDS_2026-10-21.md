# ACTION_IDs — 2026-10-21 Master Technical Director

Durable director ledger. Reuse existing IDs. Do not append specialist catalogs here.

**HEAD:** `0f5363f` (`Merge pull request #332`) — **unchanged since 2026-09-03 00:28 UTC**  
**Prior director:** unmerged [`#783`](https://github.com/Mr-Melic/stralt/pull/783) + memories (`bc-4f25ed5f-2a56-4b2d-beee-85df1318fa6d`). Unmerged [`#338`](https://github.com/Mr-Melic/stralt/pull/338) / [`#402`](https://github.com/Mr-Melic/stralt/pull/402) / [`#448`](https://github.com/Mr-Melic/stralt/pull/448) / [`#509`](https://github.com/Mr-Melic/stralt/pull/509) / [`#569`](https://github.com/Mr-Melic/stralt/pull/569) / [`#618`](https://github.com/Mr-Melic/stralt/pull/618) / [`#666`](https://github.com/Mr-Melic/stralt/pull/666) / [`#718`](https://github.com/Mr-Melic/stralt/pull/718) are earlier snapshots. On `main`, [`MASTER_ROADMAP.md`](./MASTER_ROADMAP.md) is still the 2026-09-02 text.  
**This agent:** `bc-a344d1c1-af31-438f-8062-b115d87ef46b`  
**Gameplay / production code:** not modified this run.

Specialist IDs stay in their producer files. Do not concatenate into this ledger. Do not append to `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, or `ACTION_IDS_2026-09-21.md` through `ACTION_IDS_2026-09-29.md`.

---

## Status of prior director IDs (reuse; do not mint twins)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| MTD-2026-08-31-001 / MTD-2026-09-01-001 | OPEN | Halt-as-config failed 08-31…09-29. 09-30…10-20 was an **ERROR outage**, not a pause. Halt-as-merge-stop held **48 days** (`main` still `0f5363f`). Recurring **2026-10-21 00:00**: **22** automations already RUNNING. |
| MTD-2026-09-21-001 | PARTIAL | 09-21 wave opened **59** drafts. Humans **did not merge** them. |
| MTD-2026-09-22-001 … 28-001 / MTD-2026-09-29-001 | SUPERSEDED | Those waves already happened. See MTD-2026-10-21-001. |
| MTD-2026-09-02-001 | SUPERSEDED | 09-02 wave already merged. |
| MTD-2026-09-02-002 | IMPLEMENTED (source) | #259 / #311 / #324. Deploy half → MTD-2026-09-21-002. |
| MTD-2026-09-21-002 | OPEN | `.old` still Aug-31 no-GameKey. No `snapshots/deployed/` file newer than `pr259-tail-20260901.most`. 48 days. |
| MTD-2026-09-02-003 | OPEN | Freeze new stables until deploy confirmed. Frozen chain files untouched on `main`. #362 edits `main.mo` **behavior only**. |
| MTD-2026-09-02-004 / AQA-2026-08-30-003 | PARTIAL | 09-02 file stayed clean. 09-21…09-29 ledgers never landed on `main`. This run writes `ACTION_IDS_2026-10-21.md` only. |
| MTD-2026-09-21-003 | OPEN | **#327 still open** (oldest draft, **49 days** stale, `mergeable: CONFLICTING`). #370 is a later Striker **superset**. |
| MTD-2026-09-21-004 | OPEN | #331 still open and **CONFLICTING**. Hold all **31** mapGen punches (including **#770**). |
| MTD-2026-09-22-002 … 29-002 | OPEN | Close #338/#402/#448/#509/#569/#618/#666/#718/#783. Subsumed by MTD-2026-10-21-002. |
| MTD-2026-09-22-003 … 29-003 | OPEN | Leftover queue grew 59 → … → 444 → **482**. See MTD-2026-10-21-004. |
| MTD-2026-09-22-004 | OPEN | #370 still HOLD until after #327. Still `MERGEABLE`. |
| MTD-2026-09-25-004 / 26-004 / 27-004 / 28-004 / 29-004 | OPEN | Clone mill held on `main`; skip-wipe grew through **#813**. See MTD-2026-10-21-004. |
| MTD-2026-09-25-005 | OPEN | Oldest-first still makes the living index unreachable. #327 now 49 days CONFLICTING; #331 also CONFLICTING; queue 482; ten director snapshots. |
| AQA-2026-08-30-008 | PARTIAL | Clamps + ignore-client level + AP/MP cap; **no ADR** (`docs/**/*ADR*` = 0). |
| AQA-2026-08-30-006 | BROKEN | mapGen still **1,937**. Thirty-one open punch PRs. Guardian `9dcfd122-a484` enabled. |
| AQA-2026-08-30-007 | BROKEN | WX still **19,213**. Complexity-reduction `386a157d-a4a5` RUNNING. |
| AQA-2026-08-30-005 | PARTIAL | Test mill still in the leftover queue. |
| AQA-2026-08-30-012 | OPEN | Still 0 collectors. TBC correctly WAITING. Telemetry-architecture agent RUNNING tonight. |
| TBC-2026-08-31-001 | OPEN | WAITING_FOR_TELEMETRY. Confirmed this run. Keep **#333**; close later twins. |
| MIMA-2026-08-31-001 | OPEN | Swap still teleports (`WX` 9389–9402). No `applyHazardLanding` in `src/`. **HOLD #541 and #754**. |
| MIMA-2026-08-31-002 | PARTIAL | Dest occupancy/unseal landed; **no** hazard landing. |
| MIMA-2026-09-01-001 | IMPLEMENTED | #313 `battleWalkMpCost` on execute. |
| MIMA-2026-09-01-002 | PARTIAL | Barriers in `isBattleWalkTileBlocked`. Occupants still missing. |
| MIMA-2026-09-02-001 | IMPLEMENTED | #318 `enemyWalkMp.ts`. |
| MIMA-2026-09-02-003 | OPEN (helper drafted) | `redeemGameKeyThroughPersist` still raw lock+grant (`shopPurchase.ts` 294–330). **#391** adds the helper, **does not wire** redeem. |
| PXA-2026-09-02-002 | IMPLEMENTED | #332 accepted-challenge HUD. |
| SDA-2026-08-31-002 / SDA-2026-09-01-003 / SDA-2026-09-02-003 | OPEN | Catalog still hydrates into every book (`adminSafety.ts` 712–718). |
| SDA-2026-08-31-004 | OPEN | No observe→win persist. |
| EXPANSION-PREREQ-A | OPEN | `WX` 11920 still passes LevelZone object. Number already at 1136 / 4680. Twelfth cycle. |
| MTD-2026-08-31-003 | OPEN | HP/death extraction. Not tonight. |
| MTD-2026-08-31-004 | OPEN | Expansion freeze. AI `67b03c2f`, boss `39040ad2`, dungeon `73740435` **RUNNING this hour**. |
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
EVIDENCE: Failed 2026-08-31, 09-01, 09-02 (humans then merged). Halt-as-merge-stop then held **48 days** (`main` still `0f5363f`). Recurred 09-21…09-29 (~50 drafts/day). 09-30…10-20 produced **0 PRs** because agents died `ERROR` in ~20–30s (`bc-cedc9a70`, `bc-78b70643`, and ~20 siblings; `setupStatus` null; events empty) — that is not a dashboard pause. Recurred **2026-10-21 00:00**: **22** automations already RUNNING including AI `67b03c2f-a492`, complexity reduction `386a157d-a4a5`, boss `39040ad2-a493`, dungeon encounters `73740435-a493`. Map guardian / Approved Design / combat-parity / persist / admin implementer / TBC remain enabled. Cursor has no dashboard write API. Queue now **482** drafts.  
SYSTEMS_AFFECTED: all implementer automations; 482-draft merge queue; live Caffeine upgrade  
RECOMMENDED_ACTION: First-run and expansion specialists emit ACTION_IDs only. Do not open gameplay PRs this cycle unless unique, display-only, and not already drafted. Stagger crons. Pause map/combat/persist/Motoko-stables/AI/boss/dungeon implementers after a freeze restart **and** after an outage restart, not only after a merge burst. Keep one critical hunter. **Disable or pause `9dcfd122-a484`, `f37b7505-a484`, `386a157d-a4a5`, `67b03c2f-a492`, `3089f18d-a49a`, `fe5b679a-a489`, `39040ad2-a493`, `73740435-a493`, and `1aa41c6c-a483`** until P0/P1 are closed.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-001; AQA-2026-08-30-009  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next director run sees ≤3 **new** gameplay PRs from the 10-21 wave, and those PRs do not retouch persist / targeting / mapGen / WX / RAF / `main.mo` stables / `enemyAI`. The leftover queue is not merge-bursted.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-10-21-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Hold the 2026-10-21 00:00 specialist wave after the 22-day ERROR outage  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Same HEAD as 09-21…09-29 (`0f5363f`). P0 leftovers (Caffeine deploy, ADR, #327 restack, director-index merge) still open. Queue **482**. This hour launched 22 automations already RUNNING, including AI, complexity reduction, boss system, dungeon encounters, spell-discovery admin, world content, security, and adversarial QA. Map guardian / Approved Design Implementer / combat-parity / persist / admin implementer / TBC are enabled and likely still launching. Last successful PR mill ended `#813` at `2026-09-29T21:24Z`.  
SYSTEMS_AFFECTED: merge queue; `WorldExploration.tsx`; `mapGen.ts`; `enemyAI.ts`; `main.mo`; AdminDashboard; migrations; RAF  
RECOMMENDED_ACTION: Default HOLD any gameplay PR from this wave. Designers update their own dated files; do not rewrite SDA/SDE/EBA schemas; do not restack GameKey, Frozen MP, spawnPolicy, death-penalty, Striker, Swap, leftover-walk, Death Realm skip, dump-alcove, live-gate, combat-effect mill, skip-wipe mill, or RAF. Do not open another Striker / mapGen / persist / combat / expansion / AI / implementer PR while #327 / #331 / #333–#813 exist. Dashboard specialist: skip UI (AQA-012). AI / boss / dungeon / complexity / Approved Design: ACTION_IDs only.  
AUTONOMY: HUMAN_CONFIG + review  
DEPENDENCIES: MTD-2026-08-31-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: No mapGen / persist-lock / targeting / enemyAI / AdminDashboard / Motoko-stables / RAF / AI-behavior gameplay PR merges from this wave.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-10-21-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Supersede unmerged director PRs #338, #402, #448, #509, #569, #618, #666, #718, and #783; keep one living roadmap on main  
CATEGORY: process  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: 09-21 wrote living files on #338. 09-22 on #402. 09-23 on #448. 09-24 on #509. 09-25 on #569. 09-26 on #618. 09-27 on #666. 09-28 on #718. 09-29 on #783. None merged. `main` still serves the 2026-09-02 roadmap, so 09-21 through 10-21 flocks planned against a stale index. Ten open director PRs on the same files fail oldest-first stack-compat.  
SYSTEMS_AFFECTED: `docs/automation/MASTER_ROADMAP.md`; director ACTION_ID files; merge queue  
RECOMMENDED_ACTION: Close #338, #402, #448, #509, #569, #618, #666, #718, and #783 without merge (this PR subsumes all nine snapshots plus the 10-21 delta). Do not merge all ten. Future director runs write `ACTION_IDS_YYYY-MM-DD.md` and replace the living `MASTER_ROADMAP.md`.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-09-29-002  
REGRESSION_RISK: LOW — docs only; 09-21…09-29 facts are copied forward  
VALIDATION_REQUIRED: After merge, `main` `MASTER_ROADMAP.md` header date is this run; #338, #402, #448, #509, #569, #618, #666, #718, and #783 are closed.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-10-21-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Classify the 2026-09-30…10-20 ERROR mill as a platform outage, not a successful halt  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Zero PRs after `#813` (`2026-09-29T21:24Z`). `list-cloud-agents` for 09-30…10-20 shows sparse automation launches that reached `ERROR` in ~20–30s (`bc-cedc9a70` critical hunter 2026-10-20; `bc-78b70643` docs alignment; persist / economy / admin-safety / invariants siblings). `setupStatus` null; dashboard events empty. Director itself did not land a 09-30…10-20 ledger. Automations remained **enabled**. Tonight they are RUNNING again. Treating silence as “halt worked” would leave implementers armed.  
SYSTEMS_AFFECTED: all Cursor Cloud automations; leftover queue; director cron reliability  
RECOMMENDED_ACTION: Do not close MTD-2026-08-31-001. Investigate boot/setup failure for ERROR agents (environment build `bld-20261019-e333fc5a` is new; prior ERROR mill predates it). Keep implementers paused until P0/P1 close even if the platform recovers. Log that a 22-day outage is **not** an acceptable control surface.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-08-31-001; MTD-2026-10-21-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next outage is distinguished from a dashboard pause in the following director ledger; implementers stay disabled through recovery.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-10-21-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Triage the 482-draft leftover queue; do not merge-burst it after a 48-day freeze  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open PR count = **482**, all drafts. Grew 444 (09-29 00:13) → 482 by 09-29 21:24, then frozen 22 days. Oldest #327 is CONFLICTING vs `0f5363f` (49 days). Prefix mix includes **51** `fix(combat)` and **31** `fix(map)`. Humans have not merged `main` since 2026-09-03. Merging the queue oldest-first would restack seven weeks of overlapping WX / mapGen / persist / combat PRs onto a freeze that was working.  
SYSTEMS_AFFECTED: GitHub merge queue; Caffeine import; `WorldExploration.tsx`; `mapGen.ts`; persist lock  
RECOMMENDED_ACTION: Do not “clear the queue.” Close superseded director snapshots. Restack #327. Hold mills (map / skip-wipe / leftover-walk / Swap / combat-gate). Unique leftovers listed in MASTER_ROADMAP.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-21-002; MTD-2026-09-25-005  
REGRESSION_RISK: HIGH if the queue is merge-bursted  
VALIDATION_REQUIRED: `main` does not receive a multi-PR gameplay burst from #333–#813 or the 10-21 wave. Open count falls by closes, not by merging mills.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-09-25-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Unblock oldest-first so the living director index can land  
CATEGORY: process  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Oldest open PR is still **#327** (`CONFLICTING`, created 2026-09-02, now **49 days**). #331 also CONFLICTING. Nine superseded director PRs all rewrite `MASTER_ROADMAP.md`. Stack-compat `--self` cannot insert a tenth living index behind that queue.  
SYSTEMS_AFFECTED: `scripts/open-pr-stack-compat.sh`; GitHub merge button; `docs/automation/MASTER_ROADMAP.md`  
RECOMMENDED_ACTION: Restack #327 onto `0f5363f` or close it in favor of a fresh Striker PR **after** halt. Close #338/#402/#448/#509/#569/#618/#666/#718/#783 without merge. Then this living index is merge-clean as the next docs item.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-09-21-003; MTD-2026-10-21-002  
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
EVIDENCE: Reused. Source chain is correct (`20260901_000000.mo` GameKey, `OldActor = {}`, `check-limit = 5`). Tracked `.old` is still Caffeine’s **2026-08-31** no-GameKey signature (`snapshots/README.md`). Newest deployed snapshot on disk is `pr259-tail-20260901.most`. No evidence this run of a later successful Caffeine deploy. 48 days since `main` last moved.  
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
EVIDENCE: Reused. Frozen `NewActor`s on `main` were not amended this run. Discovery / telemetry / admin lifecycle maps would be new stables. #362 is behavior-only. Tonight’s spell-discovery admin `4efa22ec-a498` is RUNNING.  
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
EVIDENCE: Reused. Clamp/no-mint, ignore-client level, AP/MP cap are on `main`. Glob `docs/**/*ADR*` = 0. Finding 3 is still restated as “must not write Doka” by security runs. `calculateAndAwardDoka` unused. `markAchievementUnlocked` still client-asserted. Security `c97e5c0c-a485` is RUNNING this hour.  
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
EVIDENCE: Reused. Oldest open PR, created 2026-09-02, `mergeable: CONFLICTING` vs `0f5363f`, now 49 days. Twin #370 adds AI kit-cast / summon and is still `MERGEABLE`. Do not merge #370 first.  
SYSTEMS_AFFECTED: `challengeCompletion.ts`; targeting; `WorldExploration.tsx`  
RECOMMENDED_ACTION: Restack #327 onto current `main`. Merge. Then union #370 unique delta only (MTD-2026-09-22-004).  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-21-001 (halt first)  
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
CATEGORY: sensitive-code  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `mapGen.ts` **1,937** lines. #331 CONFLICTING. Open `fix(map)` count = **31**. Guardian `9dcfd122-a484` enabled. `AGENTS.md` forbids map-generation edits.  
SYSTEMS_AFFECTED: `src/frontend/src/engine/mapGen.ts`  
RECOMMENDED_ACTION: Report-only (ACTION_IDs + failing seed fixtures) unless a human authorizes a playtested change. Close or hold the thirty-one punch PRs (including **#770**).  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-006  
REGRESSION_RISK: HIGH if another punch lands without playtest  
VALIDATION_REQUIRED: Next solvability run opens 0 mapGen PRs.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Throttle the critical / high-severity bug hunter  
CATEGORY: automation-ops  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `996df6df` still not GetAutomation-visible. `1aa41c6c-a483` remains enabled and ERROR’d ~15h before this run (`bc-cedc9a70`). WX is 19,213 lines.  
SYSTEMS_AFFECTED: `1aa41c6c-a483-11f1-a7d1-d6b4613131ce`; `WorldExploration.tsx`  
RECOMMENDED_ACTION: REDUCE_FREQUENCY to at most once per 12–24 hours; pause 6 hours after a `main` merge that touches WX or persist; pause during the leftover-queue freeze.  
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
EVIDENCE: Reused. `1aa41c6c` remains enabled. Volume problem is the rest of the flock (22+ this hour + 482 drafts), not this hunter’s last unique PR.  
SYSTEMS_AFFECTED: `1aa41c6c-a483-11f1-a7d1-d6b4613131ce`; `996df6df-9d7a-11f1-a7d1-d6b4613131ce`  
RECOMMENDED_ACTION: MERGE hunters. Keep one at AQA-001 cadence.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Only one critical-bug automation ID fires per day.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-006  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze mapGen after #110 (and the follow-up punches)  
CATEGORY: sensitive-code  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `mapGen.ts` 988 → 1,348 → 1,544 → **1,937**. Thirty-one open punch PRs. Guardian enabled.  
SYSTEMS_AFFECTED: `src/frontend/src/engine/mapGen.ts`  
RECOMMENDED_ACTION: Report-only unless a human authorizes a playtested change. Close any 10-21 mapGen PR.  
AUTONOMY: HUMAN_CONFIG  
REGRESSION_RISK: HIGH if another punch lands without playtest  
VALIDATION_REQUIRED: Next solvability run opens 0 mapGen PRs.  
STATUS: BROKEN  

---

ACTION_ID: AQA-2026-08-30-007  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze drive-by WorldExploration edits  
CATEGORY: sensitive-code  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. WX **19,213**. Complexity-reduction `386a157d-a4a5` RUNNING. Leftover queue is full of WX combat/persist/extract PRs (**51** `fix(combat)`).  
SYSTEMS_AFFECTED: `src/frontend/src/components/WorldExploration.tsx`  
RECOMMENDED_ACTION: One-line helper wiring only after halt. No extracts, floats, or Share-gate clones tonight.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-001  
REGRESSION_RISK: HIGH  
VALIDATION_REQUIRED: Next director run’s new WX PRs = 0 from this wave.  
STATUS: BROKEN  

---

ACTION_ID: MIMA-2026-08-31-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Extract applyHazardLanding; Swap still teleports  
CATEGORY: correctness  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Independently confirmed `WX` 9389–9402 copies coordinates with no occupancy/hazard tax. Grep `applyHazardLanding` in `src/` = 0. #541 and **#754** are WX Swap patches in the leftover queue — HOLD both. Occupancy helper for summons already exists.  
SYSTEMS_AFFECTED: Swap; controlled-summon walk; Untouchable / lava challenges  
RECOMMENDED_ACTION: After halt, one helper PR `applyHazardLanding` + one-line WX wiring. Do not merge #541 or #754 as local patches.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-21-001  
REGRESSION_RISK: MEDIUM — landing HP  
VALIDATION_REQUIRED: Swap onto lava/spikes matches walk onto the same tile; Untouchable fails in both cases.  
STATUS: OPEN  

---

ACTION_ID: MIMA-2026-09-02-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Honour unpaid death before GameKey lock credit  
CATEGORY: data-persistence  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. #391 still OPEN MERGEABLE (`gameKeyUnpaidDeath.ts` helper, not wired into redeem). `redeemGameKeyThroughPersist` (`shopPurchase.ts` 294–330) is still raw lock+grant. Do not invent a second persist path.  
SYSTEMS_AFFECTED: `redeemGameKeyThroughPersist`; `deathPenalty.ts`; GameKey shop  
RECOMMENDED_ACTION: After halt, merge #391 then one import at the redeem call site. Do not sequential-merge with skip-wipe mill.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-21-001  
REGRESSION_RISK: MEDIUM — wallet  
VALIDATION_REQUIRED: Unpaid 20/40 applies before GameKey credit on the persist lock.  
STATUS: OPEN  

---

ACTION_ID: EXPANSION-PREREQ-A  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Pass a number into buildEnemyKit, not the LevelZone object  
CATEGORY: content-wiring  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Independently confirmed `WX` 11920 `buildEnemyKit(enemy.pieceType, currentMap.levelZone)`. `buildEnemyKit` types `levelZone: number` (`enemyAI.ts` 194–199). `currentZoneTier` already exists (`WX` 1136) and is set as a number (`WX` 4680). Twelfth director cycle.  
SYSTEMS_AFFECTED: overworld enemy spell pools; dynamic kits  
RECOMMENDED_ACTION: After flock halt, one call-site change + `enemyAI` test. Pass `currentZoneTier`. Do not grow WX. Do not rewrite kits.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-21-001; MTD-2026-08-31-004  
REGRESSION_RISK: LOW if only the call site changes  
VALIDATION_REQUIRED: Zone-2 maps assign the zone-2 kit, not zone-0.  
STATUS: OPEN  

---

ACTION_ID: SDA-2026-08-31-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Stop treating the live catalog as every player’s spellbook  
CATEGORY: content-wiring  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `shouldIncludeBackendSpellInLibrary` returns true whenever `usableByPlayer !== false` (`adminSafety.ts` 712–718). Blocks meaningful telemetry-by-acquisition-path. New ownership maps are new stables → blocked on MTD-2026-09-02-003. Spell-discovery admin RUNNING tonight.  
SYSTEMS_AFFECTED: spell library hydrate; discovery; admin catalog  
RECOMMENDED_ACTION: After ADR + deploy confirmation: seed starter ids; persist owned ids; never `spell.name`. One later migration. Do not implement Wave 4…13 catalogs first.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: SDA-2026-08-31-001; MTD-2026-08-31-004; MTD-2026-09-02-003; AQA-2026-08-30-008  
REGRESSION_RISK: HIGH if hydrate silently drops built-ins  
VALIDATION_REQUIRED: New profile owns starters only; admin add does not grant everyone.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-012  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Add query-only outcome counters before any telemetry dashboard  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Still 0 collectors on `0f5363f`. TBC-2026-08-31-001 WAITING_FOR_TELEMETRY. TADD drafts exist in the leftover queue with nothing to display. Increment maps would be new stables — blocked on MTD-2026-09-02-003. Telemetry-architecture `047ac8a1-a4a0` is RUNNING this hour.  
SYSTEMS_AFFECTED: persist lock; future telemetry maps; Admin Health tab  
RECOMMENDED_ACTION: Design + tiny isolated PR **after flock halt and deploy confirmation**. Persist-lock-enqueued counters. No dashboard UI first. TBC stays WAITING.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-09-02-003; MTD-2026-10-21-001  
REGRESSION_RISK: HIGH if writers bypass the persist lock  
VALIDATION_REQUIRED: `longHorizonSim.telemetry.available` can become true from real counters; no CLEAR_POSITIVE_SIGNAL claimed from empty series.  
STATUS: OPEN  

---

ACTION_ID: TBC-2026-08-31-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Remain WAITING_FOR_TELEMETRY; do not retune BAL-* from empty series  
CATEGORY: balance  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Confirmed this run. Nine WAITING_FOR_TELEMETRY twins already open (#333, #395, #462, #502, #556, #609, #661, #725, #768). TBC `2786666f-a4a0` is enabled. Keep **#333** as the single TBC docs leftover; close later dated twins after the living index lands.  
SYSTEMS_AFFECTED: balance reports; leftover TBC drafts  
RECOMMENDED_ACTION: Do not implement BAL-* retunes. Do not treat missing play data as “players don’t use X.” Do not open a tenth WAITING twin tonight.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-012  
REGRESSION_RISK: HIGH if jackpot/XP curve is “fixed” without telemetry  
VALIDATION_REQUIRED: No BAL formula PR merges from this wave.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-08-31-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze gameplay expansion until P0/P1 infrastructure exists  
CATEGORY: expansion-governance  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Wave 4…12 catalogs continue as unmerged docs twins. Tonight AI `67b03c2f-a492`, boss `39040ad2-a493`, dungeon encounters `73740435-a493`, formations `29176a08-a494`, and spell-discovery admin `4efa22ec-a498` are RUNNING. Core rules (discovery, kit-zone number, admin DVA, ownership persist) are still unwired.  
SYSTEMS_AFFECTED: expansion automations; `enemyAI.ts`; AdminDashboard; spell catalog  
RECOMMENDED_ACTION: Design-only. Do not implement catalogs, AI behaviors, or admin chrome from this hour. Point at SDA-002/004; no fifth discovery schema.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-10-21-001; EXPANSION-PREREQ-A; SDA-2026-08-31-002  
REGRESSION_RISK: HIGH if implementer lands content on the 19k WX file  
VALIDATION_REQUIRED: 0 expansion gameplay PRs merge from the 10-21 wave.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-09-02-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Stop concatenating specialist catalogs into dated director ACTION_ID files  
CATEGORY: process  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. This run writes `ACTION_IDS_2026-10-21.md` only. Do not append to 08-31, 09-01, 09-02, or 09-21 through 09-29.  
SYSTEMS_AFFECTED: `docs/automation/ACTION_IDS_*.md`  
RECOMMENDED_ACTION: UPDATE_PROMPT: each producer writes `ACTION_IDS_<PREFIX>_YYYY-MM-DD.md`. Director maintains MASTER_ROADMAP + `ACTION_IDS_YYYY-MM-DD.md` (director IDs only).  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-003  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: This wave adds 0 lines to ACTION_IDS_2026-08-31.md through ACTION_IDS_2026-09-29.md.  
STATUS: OPEN  
