# ACTION_IDs — 2026-10-26 Master Technical Director

Durable director ledger. Reuse existing IDs. Do not append specialist catalogs here.

**HEAD:** `0f5363f` (`Merge pull request #332`) — **unchanged since 2026-09-03 00:28 UTC**  
**Prior director:** unmerged [`#1074`](https://github.com/Mr-Melic/stralt/pull/1074) + memories (`bc-a0d7fd84-a8ac-480c-acf9-a5a12235e0cc`). Unmerged [`#338`](https://github.com/Mr-Melic/stralt/pull/338) through [`#1074`](https://github.com/Mr-Melic/stralt/pull/1074) are earlier snapshots. On `main`, [`MASTER_ROADMAP.md`](./MASTER_ROADMAP.md) is still the 2026-09-02 text.  
**This agent:** `bc-07a3a496-74a2-483d-bcb9-6d92b9fa5510`  
**Gameplay / production code:** not modified this run.

Specialist IDs stay in their producer files. Do not concatenate into this ledger. Do not append to `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, or `ACTION_IDS_2026-09-21.md` through `ACTION_IDS_2026-10-25.md`.

---

## Status of prior director IDs (reuse; do not mint twins)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| MTD-2026-08-31-001 / MTD-2026-09-01-001 | OPEN | Halt-as-config failed 08-31…09-29, **10-21** (56), **10-22** (58), **10-23** (52), **10-24** (63), **10-25** (65, all-day). Recurring **2026-10-26 00:00**: **48** automations RUNNING (4 IDLE, 0 ERROR). Halt-as-merge-stop held **53 days** (`main` still `0f5363f`). |
| MTD-2026-09-21-001 | PARTIAL | 09-21 wave opened **59** drafts. Humans **did not merge** them. |
| MTD-2026-09-22-001 … 29-001 | SUPERSEDED | Those waves already happened. |
| MTD-2026-10-21-001 | SUPERSEDED | 10-21 wave already ran: **56 PRs**. |
| MTD-2026-10-22-001 | SUPERSEDED | 10-22 wave already ran: **58 PRs**. |
| MTD-2026-10-23-001 | SUPERSEDED | 10-23 wave already ran: **52 PRs**. |
| MTD-2026-10-24-001 | SUPERSEDED | 10-24 wave already ran: **63 PRs**. Halt itself remains OPEN via MTD-2026-08-31-001. |
| MTD-2026-10-25-001 | SUPERSEDED | 10-25 wave **did not hold**. Opened **65** PRs `#1043`–`#1107`. See MTD-2026-10-26-001 / 003. |
| MTD-2026-10-25-002 | SUPERSEDED | Close-list extended by MTD-2026-10-26-002 (+#1074). |
| MTD-2026-10-25-003 | SUPERSEDED | 10-24 as fourth recovered-mill day is now historical. See MTD-2026-10-26-003 (fifth day). |
| MTD-2026-10-25-004 | SUPERSEDED | Queue was 711; now **776**. See MTD-2026-10-26-004. |
| MTD-2026-10-24-005 | OPEN | Empirically failed on **two** recovered days: 10-24 and 10-25 both shipped 24 PRs after 01:00 UTC. |
| MTD-2026-09-02-001 | SUPERSEDED | 09-02 wave already merged. |
| MTD-2026-09-02-002 | IMPLEMENTED (source) | #259 / #311 / #324. Deploy half → MTD-2026-09-21-002. |
| MTD-2026-09-21-002 | OPEN | `.old` still Aug-31 no-GameKey. No `snapshots/deployed/` file newer than `pr259-tail-20260901.most`. **53 days.** |
| MTD-2026-09-02-003 | OPEN | Freeze new stables until deploy confirmed. Frozen chain files untouched on `main`. #362 edits `main.mo` **behavior only**. |
| MTD-2026-09-02-004 / AQA-2026-08-30-003 | PARTIAL | This run writes `ACTION_IDS_2026-10-26.md` only. Living index still off `main`. |
| MTD-2026-09-21-003 | OPEN | **#327 still open** (oldest draft, **54 days** stale, `mergeable_state: dirty`). #370 is a later Striker **superset**. |
| MTD-2026-09-21-004 | OPEN | #331 still open and **CONFLICTING**. Hold all open map punches. 10-25 added `#1071/#1086/#1093/#1103`. |
| MTD-2026-10-21-002 / 22-002 / 23-002 / 25-002 | OPEN | Subsumed by MTD-2026-10-26-002. |
| MTD-2026-10-21-003 | OPEN | Historical: 09-30…10-20 was ERROR/boot. Do not relabel the gap as a halt. |
| MTD-2026-10-22-003 | OPEN | Recovery rebuilt the mill. Still true. Five recovered days now. |
| MTD-2026-10-22-005 | OPEN | Pack-enemy combat titles **11 → 25**. One `resolveKitExecute` helper after halt. |
| MTD-2026-10-23-005 | OPEN | Skip-wipe mill **~46 → 93**. One remount-wipe guard after halt. |
| MTD-2026-09-22-004 | OPEN | #370 still HOLD until after #327. Still `MERGEABLE`. |
| MTD-2026-09-25-005 | OPEN | Oldest-first still makes the living index unreachable. #327 now 54 days CONFLICTING; queue 776; fifteen director snapshots. |
| AQA-2026-08-30-008 | PARTIAL | Clamps + ignore-client level + AP/MP cap; **no ADR** (`docs/**/*ADR*` = 0). Security `c97e5c0c` RUNNING tonight. |
| AQA-2026-08-30-006 | BROKEN | mapGen still **1,937**. Guardian `9dcfd122` RUNNING. `#1106`: 90 `fix(map)` hits in the week. |
| AQA-2026-08-30-007 | BROKEN | WX still **19,213**. `#831/#842/#901/#961/#995/#1076` already touch it. Complexity-reduction `386a157d` RUNNING. |
| AQA-2026-08-30-005 | PARTIAL | Pale Archivist test mill **13** titles. Defect-recurrence RUNNING. |
| AQA-2026-08-30-009 | BROKEN | Orchestrator implemented `#1105/#1096`. RUNNING tonight. |
| AQA-2026-08-30-010 | BROKEN | Skip-wipe **93**. Persist auditor RUNNING tonight. |
| AQA-2026-08-30-012 | OPEN | Still 0 collectors. TBC `#1053` correctly WAITING (fourteenth inspection of this SHA). |
| AQA-2026-09-27-001 | BROKEN | Queue 380 → 774 → **776**. 0 closes in the audited week (`#1106`). |
| AQA-2026-09-27-003 | BROKEN | #62 daily paint extracts; `#995` +935. |
| TBC-2026-08-31-001 | OPEN | WAITING_FOR_TELEMETRY. Confirmed this run. Keep **#333**; close later twins including **#871/#928/#994/#1053/#1108**. |
| MIMA-2026-08-31-001 | OPEN | Swap still teleports (`WX` 9389–9402). No `applyHazardLanding` in `src/`. **HOLD #541 and #754**. Soak mill is the same class (MTD-2026-10-26-005). |
| MIMA-2026-08-31-002 | PARTIAL | Dest occupancy/unseal landed; **no** hazard landing. |
| MIMA-2026-09-01-001 | IMPLEMENTED | #313 `battleWalkMpCost` on execute. |
| MIMA-2026-09-01-002 | PARTIAL | Barriers in `isBattleWalkTileBlocked`. Occupants still missing from `findPath` (`WX` 4466–4536; `walkRejectCopy.ts` 21–34 has no occupant arg). |
| MIMA-2026-09-02-001 | IMPLEMENTED | #318 `enemyWalkMp.ts`. |
| MIMA-2026-09-02-003 | OPEN (helper drafted) | `redeemGameKeyThroughPersist` still raw lock+grant (`shopPurchase.ts` 294–330). **#391** adds the helper, **does not wire** redeem. |
| PXA-2026-09-02-002 | IMPLEMENTED | #332 accepted-challenge HUD. |
| SDA-2026-08-31-002 / SDA-2026-09-01-003 / SDA-2026-09-02-003 | OPEN | Catalog still hydrates into every book (`adminSafety.ts` 712–718). |
| SDA-2026-08-31-004 | OPEN | No observe→win persist. |
| EXPANSION-PREREQ-A | OPEN | `WX` 11920 still passes LevelZone object. Number already at 1136. Seventeenth cycle. |
| MTD-2026-08-31-003 | OPEN | HP/death extraction. Not tonight. |
| MTD-2026-08-31-004 | OPEN | Expansion freeze. AI `67b03c2f`, boss `39040ad2`, dungeon `73740435`, spell mechanics `1330956a`, expansion `3f31b18f`, combat-parity `f37b7505` **RUNNING this hour**. |
| MTD-2026-08-31-005 | OPEN | `useSaveKillCount` has no TSX caller. |
| MTD-2026-08-31-006 | OPEN | Admin DVA not canister. Dashboard 8,280 lines. `#945`, `#1001`, `#1066` HOLD. |
| MTD-2026-08-31-007 | OPEN | Point at SDA-002/004; no fifth schema. Wave 16/17 catalogs are twins. |
| MTD-2026-08-31-008 | OPEN | 30% random AI tier (`combatMath.ts` 48–50). |
| LHIPS-2026-09-01-001 | HOLD | HUD saturates at 48. Do not retune curve. |
| LHIPS-2026-09-01-002 | HOLD | 100k/500k clamp vs jackpot. Architecture, not a BAL retune. |
| SDEG-2026-09-21-001 | OPEN on `main` | Unbounded GameKey serial + `saveActiveSpells` keep-store live only on **#362** (unmerged). |
| SDEG-2026-09-21-003 | OPEN / HUMAN | Persist AP/MP cap 20 vs unbounded formula. Do not raise the cap in this flock. |
| RAO-2026-09-03-0000-002 | DEFERRED | Feats vs Achievements recap copy. Drafted as **#354**. P3 display-only. |
| RAO-2026-09-03-0000-003 | NEEDS_HUMAN_DECISION | Paper Windstorm two live rates. Do not “fix” announce alone. `#1042` is a related combat mill — HOLD. |

---

ACTION_ID: MTD-2026-08-31-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Halt same-hour P2/P3 implementer flock after a merge burst or freeze restart  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Failed 2026-08-31, 09-01, 09-02 (humans then merged). Halt-as-merge-stop then held **53 days** (`main` still `0f5363f`). Recurred 09-21…09-29 (~50 drafts/day), then a 22-day ERROR outage, then **2026-10-21** (56 PRs), **2026-10-22** (58), **2026-10-23** (52 all day), **2026-10-24** (63 all day), **2026-10-25** (65 all day), then **2026-10-26 00:00** with **48 RUNNING** + 4 IDLE (map guardian, AI, combat-parity, persist auditor, boss, dungeon, complexity reduction, spell mechanics, spell discovery, critical hunter, expansion, invariants). GetAutomation confirms those UUIDs still **enabled**. Cursor Cloud has no prompt write API. Weekly audit `#1106` independently classified the week as NEGATIVE_ROI mill.  
SYSTEMS_AFFECTED: all Cursor Cloud automations; leftover GitHub queue; WX / mapGen / persist / enemyAI / AdminDashboard  
RECOMMENDED_ACTION: HUMAN_CONFIG: disable implementers (Approved Design `fe5b679a`, complexity `386a157d`, combat-parity `f37b7505`, map guardian `9dcfd122`, persist `607e0304`, AI `67b03c2f`, boss `39040ad2`, dungeon `73740435`, spell mechanics `1330956a`, spell discovery `c26e5a83`, critical hunter `1aa41c6c`, admin implementer `3089f18d`, world-content `1592c6c0`, expansion `3f31b18f`, invariants `72eb90fe`) until P0/P1 close. Report-only specialists may stay on cron. Do not merge tonight’s PRs. Also disable daytime hunter-implementer cadences (MTD-2026-10-24-005). Do not dashboard-disable this director UUID.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: none  
REGRESSION_RISK: LOW for a pause; HIGH if implementers keep shipping  
VALIDATION_REQUIRED: Next director run sees fewer same-hour gameplay PRs than 10-25’s 32 non-docs drafts, and no 06/12/18 skip-wipe/map/pack-enemy/soak clones, or documents another config miss.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-10-26-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Hold the 2026-10-26 00:00 specialist wave; do not treat 10-21…10-25 recovery as a green light  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `list-cloud-agents` createdAfter 2026-10-25T23:50Z returned **52** agents (**48 RUNNING**, 4 IDLE, 0 ERROR). Implementers named in #1074 are still enabled. Persist auditor flipped IDLE→RUNNING vs the 10-25 first snapshot. Admin implementer was IDLE in the first snapshot and still opened `#1115`. 10-25 same-hour hold was ignored and grew to 65 PRs. `main` still `0f5363f`. This hour already opened `#1108`–`#1120`: TBC WAITING `#1108` (fifteenth inspection), WX portal-cube extract `#1109`, expansion `#1112`, Pale Archivist `#1113`, admin `#1115`, telemetry clones `#1116/#1118`. P0/P1 from #1074 are all still open.  
SYSTEMS_AFFECTED: leftover queue; WX; mapGen; enemyAI; AdminDashboard; spellEngine; main.mo stables  
RECOMMENDED_ACTION: Default HOLD every PR this wave opens, especially gameplay. Docs-only catalogs may remain unmerged. Do not implement Wave 17, pack-enemy gates, paint extracts, skip-wipe clones, share-kit flags, soak clones, or canvas perf tonight.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-08-31-001  
REGRESSION_RISK: HIGH if tonight’s implementers land on frozen files  
VALIDATION_REQUIRED: 10-26 gameplay PR count is reported next run; none merged to `main`.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-10-26-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Supersede unmerged director PRs #338, #402, #448, #509, #569, #618, #666, #718, #783, #814, #870, #946, #998, and #1074; keep one living roadmap on main  
CATEGORY: process  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Fifteen open director PRs (this one included) rewrite `MASTER_ROADMAP.md`. None merged. `main` still serves the 2026-09-02 roadmap, so 09-21 through 10-26 flocks planned against a stale index. Oldest-first stack-compat cannot insert a sixteenth living index behind that queue plus CONFLICTING #327. `#1106` asked director KEEP weekly; the mill is unmerged snapshots, not the director UUID.  
SYSTEMS_AFFECTED: `docs/automation/MASTER_ROADMAP.md`; director ACTION_ID files; merge queue  
RECOMMENDED_ACTION: Close #338, #402, #448, #509, #569, #618, #666, #718, #783, #814, #870, #946, #998, and #1074 without merge (this PR subsumes all fourteen snapshots plus the 10-26 delta). Do not merge all fifteen. Future director runs write `ACTION_IDS_YYYY-MM-DD.md` and replace the living `MASTER_ROADMAP.md`.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-25-002  
REGRESSION_RISK: LOW — docs only; 09-21…10-25 facts are copied forward  
VALIDATION_REQUIRED: After merge, `main` `MASTER_ROADMAP.md` header date is this run; the fourteen listed PRs are closed.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-10-26-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Classify the 2026-10-25 flock as a fifth recovered-mill day, not a successful halt  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: 10-25 launched with 47 RUNNING and opened **65** PRs (`#1043`–`#1107`) including skip-wipe twins, pack-enemy combat, four map snaps, soak mill `#1079/#1084/#1097/#1100`, WX extract `#1076`, Pale Archivist tests, and admin helpers `#1066`. Hours: 00=41, then 03/04/06/08/12/16/18/19/21 = 24 more. Queue 711 → **776**. Combined with 10-21’s 56, 10-22’s 58, 10-23’s 52, and 10-24’s 63: **294 drafts in five recovered days**. That is the opposite of MTD-2026-10-25-001’s hold. `#1106` independently counted 292 drafts in the week with 0 merges and 0 closes.  
SYSTEMS_AFFECTED: all Cursor Cloud automations; leftover queue  
RECOMMENDED_ACTION: Do not close MTD-2026-08-31-001. Do not praise 10-21…10-25 as “flock healthy.” Keep implementers paused through recovery. Log that five recovered crons that open ~52–65 drafts/day are **worse** than a silent outage for merge-stop.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-08-31-001; MTD-2026-10-25-003  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next director ledger distinguishes outage vs pause vs recovered-mill; implementers stay disabled.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-10-26-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Triage the 776-draft leftover queue; do not merge-burst it after a 53-day freeze  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open PR count = **776** GraphQL. Grew 482 (10-21 00:00) → 538 → 596 → 648 → 711 → **776**. Prefix mix: hundreds of docs, **93** skip-wipe, **25** pack-enemy combat, soak mill, map snaps (**47** `snap` titles), WX paint extracts, **15** director roadmaps, **14** TBC WAITING clones, **13** Pale Archivist tests. Oldest #327 is CONFLICTING vs `0f5363f` (54 days). Only other CONFLICTING leftover named by directors is #331. Humans have not merged `main` since 2026-09-03. Merging oldest-first would restack eight weeks of overlapping WX / mapGen / persist / combat PRs onto a freeze that was working. `#1106` AQA-2026-09-27-001 asked drafts < 50; the week closed **0**.  
SYSTEMS_AFFECTED: GitHub merge queue; Caffeine import; `WorldExploration.tsx`; `mapGen.ts`; persist lock; `spellEngine.ts`  
RECOMMENDED_ACTION: Do not “clear the queue.” Close superseded director snapshots. Restack #327. Hold mills (map / skip-wipe / leftover-walk / Swap / combat-gate / share-kit / pack-enemy / soak / paint extract). Unique leftovers listed in MASTER_ROADMAP.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-26-002; MTD-2026-09-25-005  
REGRESSION_RISK: HIGH if the queue is merge-bursted  
VALIDATION_REQUIRED: `main` does not receive a multi-PR gameplay burst from #333–#1107 or the 10-26 wave. Open count falls by closes, not by merging mills.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-10-26-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Stop soak-like-playerTakesDamage clones; extract one landing/soak helper after halt  
CATEGORY: correctness  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: 10-25 opened four twins that apply walk/reflect/leftover-walk HP through `playerTakesDamage`: `#1079` Mirror Field, `#1084` Void Mirror, `#1097` Thorned Ground / Void Rift, `#1100` leftover-walk lava/spikes. `#1106` notes invariants `72eb90fe` lost its 0-PR discipline and became a third soak writer beside adversarial QA. Swap still teleports (`WX` 9389–9402) with no `applyHazardLanding` (grep in `src/` = 0). Local per-effect patches are no longer sufficient. Related to MIMA-2026-08-31-001, not a skip-wipe clone.  
SYSTEMS_AFFECTED: Swap; leftover walk; lava/spikes; reflect; Untouchable; `WorldExploration.tsx`  
RECOMMENDED_ACTION: HOLD `#1079/#1084/#1097/#1100` and Swap mill `#541/#754`. After halt, one helper that taxes hazard/reflect landings the same as walk (`applyHazardLanding` or equivalent soak). One-line WX wiring. Do not change walk hazard math. Do not concatenate the four PRs.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-26-001 (halt first); MIMA-2026-08-31-001  
REGRESSION_RISK: HIGH if twins merge as concatenated copies; MEDIUM for a single helper  
VALIDATION_REQUIRED: Swap / leftover-walk / reflect onto lava/spikes charges the same HP as a walk landing; occupancy abort still holds; open soak count falls by close, not by merge-burst.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-10-24-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Halt must cover 06/12/18 hunter-implementer cadences, not only the 00:00 wave  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused; **validation failed twice**. 10-24: 24 of 63 PRs after 01:00. 10-25: 24 of 65 PRs after 01:00 (`#1084` 03:12 soak, `#1085` 04:23 pack-enemy, `#1086/#1087/#1088` 06:24–06:30, `#1089/#1090/#1091` 08:11–08:21, `#1092`–`#1097` 12:11–12:20, `#1098`–`#1102` 16:11–16:16, `#1103`–`#1105` 18:13–18:20, `#1106` 19:12, `#1107` 21:16).  
SYSTEMS_AFFECTED: 6h/8h/12h/18h automations; leftover skip-wipe / map / combat / soak mills  
RECOMMENDED_ACTION: HUMAN_CONFIG: disable every implementer and hunter that opens `fix:` / `refactor:` PRs on frozen files, at every cron cadence. Report-only specialists may remain. Next director run must count PRs by hour, not only by midnight wave.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-08-31-001; MTD-2026-10-26-001  
REGRESSION_RISK: LOW for a pause; HIGH if only 00:00 is paused  
VALIDATION_REQUIRED: Next recovered day has ~0 gameplay PRs after 01:00 UTC, not just a quieter midnight.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-10-23-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Stop remount saveBattleStats skip-wipe clones; extract one hydrate-wipe guard after halt  
CATEGORY: persistence  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused; mill doubled. Skip remount titles **~46 → 93**. 10-25 added leftover-XP wipe twins `#1043/#1045/#1046/#1070/#1088/#1092/#1099`. Persist auditor `607e0304` is RUNNING this hour (was IDLE in the 10-25 first snapshot). Same shape as `#847/#854/#860/#864/#866/#869` and older `#330`-keep twins. Local patches are no longer sufficient. Distinct from `#391` (unpaid-death honour on GameKey redeem, still unwired in `shopPurchase.ts` 294–330).  
SYSTEMS_AFFECTED: `progressPersist.ts`; remount hydrate; `saveBattleStats`; Death Realm pending  
RECOMMENDED_ACTION: HOLD the 93 skip-wipe PRs. After halt, one shared guard that skips remount `saveBattleStats` wipe when a committed keep exists and unpaid death is absent. Close twins. Do not concatenate. Do not fold `#391` into this helper.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-26-001 (halt first)  
REGRESSION_RISK: HIGH if twins merge as concatenated copies; MEDIUM for a single helper  
VALIDATION_REQUIRED: `python3 scripts/check-duplicate-exports.py src/frontend/src` clean; remount after portal/victory/GameKey/feat/shop/heal keep does not cut committed Doka/XP; unpaid-death still applies 20/40; open skip-wipe count falls by close, not by merge-burst.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-10-22-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Stop one-flag advertised-vs-execute kit patches; extract one resolveKitExecute helper after halt  
CATEGORY: correctness  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused; mill grew. Pack-enemy **combat** titles **11 → 25**. 10-25 added `#1054/#1081/#1085/#1087/#1090/#1091/#1107` plus summon-archer LoS-share `#1095/#1096/#1098` and advertised CHC `#1104`. Growing `spellEngine.ts` / WX / enemyAI by one metadata field per cron is the combat mill’s standing shape. `applyHazardLanding` is still missing; Swap still teleports.  
SYSTEMS_AFFECTED: `spellEngine.ts`; `enemyAI.ts`; boss/summon kit tables; `WorldExploration.tsx`  
RECOMMENDED_ACTION: HOLD the share-kit and pack-enemy PRs. After halt, one helper that executes kits from advertised metadata with tests. Close twins. Do not concatenate. Hostile-summon empty-`spells` wiring (`#842/#861`) is a **separate** spawn fix after halt — do not fold it into the helper PR.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-26-001 (halt first)  
REGRESSION_RISK: HIGH if twins merge as concatenated copies; MEDIUM for a single helper  
VALIDATION_REQUIRED: `python3 scripts/check-duplicate-exports.py src/frontend/src` clean; kit execute matches advertised flags in unit tests; open pack-enemy combat count falls by close, not by merge-burst.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-09-25-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Unblock oldest-first so the living director index can land  
CATEGORY: process  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Oldest open PR is still **#327** (`CONFLICTING` / `dirty`, created 2026-09-02, now **54 days**). #331 also CONFLICTING. Fourteen superseded director PRs plus this one all rewrite `MASTER_ROADMAP.md`. Stack-compat `--self` cannot insert a living index behind that queue.  
SYSTEMS_AFFECTED: `scripts/open-pr-stack-compat.sh`; GitHub merge button; `docs/automation/MASTER_ROADMAP.md`  
RECOMMENDED_ACTION: Restack #327 onto `0f5363f` or close it in favor of a fresh Striker PR **after** halt. Close #338/#402/#448/#509/#569/#618/#666/#718/#783/#814/#870/#946/#998/#1074 without merge. Then this living index is merge-clean as the next docs item.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-09-21-003; MTD-2026-10-26-002  
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
EVIDENCE: Reused. Source chain is correct (`20260901_000000.mo` GameKey, `OldActor = {}`, `check-limit = 5`). Tracked `.old` is still Caffeine’s **2026-08-31** no-GameKey signature (grep GameKey = 0). Newest deployed snapshot on disk is `pr259-tail-20260901.most`. No evidence this run of a later successful Caffeine deploy. 53 days since `main` last moved.  
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
EVIDENCE: Reused. Frozen `NewActor`s on `main` were not amended this run. Discovery / telemetry / admin lifecycle maps would be new stables. #362 is behavior-only. Tonight’s spell-discovery `c26e5a83` and persistent-data-evolution `469b7020` are RUNNING.  
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
EVIDENCE: Reused. Clamp/no-mint, ignore-client level, AP/MP cap are on `main`. Glob `docs/**/*ADR*` = 0. Finding 3 is still restated as “must not write Doka” by security runs. `calculateAndAwardDoka` unused. `markAchievementUnlocked` still client-asserted. Security `c97e5c0c` is RUNNING this hour. `#1106` sampled security run opened no PR (correct no-op) and still asked for the ADR.  
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
EVIDENCE: Reused. Oldest open PR, created 2026-09-02, `mergeable_state: dirty` vs `0f5363f`, now 54 days. Twin #370 adds AI kit-cast / summon and is still `MERGEABLE`. Do not merge #370 first.  
SYSTEMS_AFFECTED: `challengeCompletion.ts`; targeting; `WorldExploration.tsx`  
RECOMMENDED_ACTION: Restack #327 onto current `main`. Merge. Then union #370 unique delta only (MTD-2026-09-22-004).  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-26-001 (halt first)  
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
EVIDENCE: Reused. `mapGen.ts` is **1,937** lines on `main`. 10-25 added `#1071` Orbiting Cinder, `#1086` Gutter Steam, `#1093` Frost Pane, `#1103` Triune Pads. #331 still CONFLICTING. Guardian `9dcfd122` RUNNING tonight. `#1106`: 90 `fix(map)` hits in the week / 47 `snap` titles.  
SYSTEMS_AFFECTED: `src/frontend/src/engine/mapGen.ts`; spawn/portal keep-clear  
RECOMMENDED_ACTION: HOLD every mapGen implementation PR. Guardian emits fixtures + ACTION_IDs only. Do not playtest-by-merging.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-10-26-001  
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
EVIDENCE: Reused. `996df6df` still not GetAutomation-visible. `#1106`: 38 hunter runs in four days. Volume problem remains the rest of the flock (48 RUNNING this hour; 65 PRs yesterday including daytime clones).  
SYSTEMS_AFFECTED: Cursor automations  
RECOMMENDED_ACTION: HUMAN_CONFIG: identify and disable duplicate hunters. Keep a single critical hunter if any. Prefer report-only while `origin/main` SHA is unchanged.  
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
EVIDENCE: Reused. `1aa41c6c` (“Stralt critical defects”) is **RUNNING** this hour (GetAutomation UUID not visible to this principal; agent list confirms the short id). 10-25 used daytime cadences to open skip-wipe / pack-enemy / soak clones.  
SYSTEMS_AFFECTED: leftover combat/persist mills  
RECOMMENDED_ACTION: Keep at most one enabled. Prefer report-only. Do not let it open skip-wipe, share-kit, or soak clones at any cadence.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: At most one critical-hunter automation enabled. Next run does not add skip-wipe or soak twins from it.  
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
EVIDENCE: Reused. WX **19,213**. 10-21 opened `#831` (dust-mote extract) and `#842` (hostile summon kits). 10-22 opened `#901` (portal whirlpool extract). 10-23 opened `#961` (pixel-pattern paint extract). 10-24 opened `#995` (isometric tile paint extract). 10-25 opened `#1076` (hazard overlay paint extract). Complexity reduction `386a157d` RUNNING tonight. `#1106` scores the paint strategy as NEGATIVE_ROI / FAKE MODULARITY.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`  
RECOMMENDED_ACTION: HOLD WX PRs except one-line helper wiring after halt (#327 restack, PREREQ-A, applyHazardLanding call site). Pause #62 paint extracts. Prefer domain extracts `#369/#514/#683` or close them.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-10-26-001  
REGRESSION_RISK: HIGH  
VALIDATION_REQUIRED: `main` WX line count does not grow; `#831/#842/#901/#961/#995/#1076` stay unmerged.  
STATUS: BROKEN  

---

ACTION_ID: MIMA-2026-08-31-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Extract applyHazardLanding; Swap still teleports  
CATEGORY: correctness  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `WX` 9389–9402 `swapPositions` copies coordinates through `updateCombatant` with no occupancy and no hazard tax. Grep `applyHazardLanding` in `src/` = 0. `#541` and `#754` still OPEN MERGEABLE. `#850` is a share-kit `isSwap` twin — HOLD, not a landing fix. Soak mill MTD-2026-10-26-005 is the same class with a new title.  
SYSTEMS_AFFECTED: Swap; controlled-summon walk; lava/spikes; Untouchable  
RECOMMENDED_ACTION: After halt, one helper + one-line WX/spellEngine wiring. HOLD `#541/#754/#850` and soak twins. Do not change walk hazard math. Fold MTD-2026-10-26-005 into this helper rather than shipping two.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-26-001  
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
EVIDENCE: Reused. `redeemGameKeyThroughPersist` (`shopPurchase.ts` 294–330) still lock+grant with no unpaid-death call. `#391` drafts a helper and does **not** wire redeem. Skip-wipe mill (`#877`…`#1099`) is a different hole — do not treat those twins as this wire.  
SYSTEMS_AFFECTED: GameKey redeem; death penalty; persist lock  
RECOMMENDED_ACTION: Merge `#391` helper after halt, then a separate one-line wire inside `redeemGameKeyThroughPersist`. Do not merge skip-wipe clones instead.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-26-001  
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
EVIDENCE: Reused. `buildEnemyKit` (`enemyAI.ts` 194–200) floors `levelZone: number`. Call site `WX` 11920 still passes `currentMap.levelZone`. `currentZoneTier` already exists (`WX` 1136). Seventeenth director cycle. Unblocks “dynamic enemy spell pools” without an AI rewrite.  
SYSTEMS_AFFECTED: overworld enemy kits; `enemyAI.ts`; `WorldExploration.tsx`  
RECOMMENDED_ACTION: After halt, one call-site change + `enemyAI` test. No WX growth beyond that line. Do not retune kit contents.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-26-001; AQA-2026-08-30-007  
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
EVIDENCE: Reused. `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–718) returns true whenever `usableByPlayer !== false`. Hydrate loop still fills the book. Enemy-observed discovery and achievement/challenge/boss spell unlocks cannot ship on this shape. Requires a **new later** migration after deploy confirmation — not a stuffed NewActor. Wave 17 discovery `#1082` is a catalog, not this persist.  
SYSTEMS_AFFECTED: spell library; discovery; admin catalog  
RECOMMENDED_ACTION: After P0 persist/deploy/ADR: ownership maps + starter seed. Do not implement Wave 16/17 spell catalogs first.  
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
EVIDENCE: Reused. No `recordTelemetry` / sidecar in `src/`. `longHorizonSim.telemetry.available === false` (lines 532–536). TBC `#1053` WAITING (fourteenth inspection of this SHA). Game-balance automation `3c083a4a` and dashboard `4b026695` are RUNNING tonight and must not retune or ship a Health tab. `#1106` asked to PAUSE the telemetry trio.  
SYSTEMS_AFFECTED: future counters; AdminDashboard Health tab; TBC  
RECOMMENDED_ACTION: After halt + ADR: tiny isolated increment APIs, query-only or fire-and-forget **after** persist returns (never on `progressPersistRef`). No dashboard UI first. Keep `longHorizonSim.telemetry.available = false` until rows exist.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: AQA-2026-08-30-008; MTD-2026-10-26-001  
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
EVIDENCE: Reused. Confirmed this run (`longHorizonSim.ts` 532–536). Keep `#333` as the first TBC leftover; later twins (`#395/#462/#502/#556/#609/#661/#833/#871/#928/#994/#1053/#1108`) are dated copies (**15** WAITING reports). Tonight’s TBC `2786666f` already opened `#1108`. “Stralt game balance” `3c083a4a` is a **different** automation — neither may retune.  
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
EVIDENCE: Reused. 10-25 expansion `#1052`, elites `#1073`, boss `#1080`, spell `#1063`, discovery `#1082`, AI `#1072` already filed Wave 17 catalogs. Tonight: expansion `3f31b18f`, AI `67b03c2f`, boss `39040ad2`, dungeon `73740435`, spell mechanics `1330956a`, spell discovery `c26e5a83` all RUNNING. Core rules (discovery, DVA, zone kits, progressive AI) are still unwired.  
SYSTEMS_AFFECTED: enemyAI; boss kits; dungeon encounters; spell catalogs; AdminDashboard  
RECOMMENDED_ACTION: Design catalogs may exist unmerged. No implementation PRs until halt + #327 + landing helper + ADR + GameKey deploy confirmation.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-10-26-001; MTD-2026-09-21-002; AQA-2026-08-30-008  
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
EVIDENCE: Reused. This run writes `ACTION_IDS_2026-10-26.md` only. Does not append to 08-31, 09-01, 09-02, or 09-21…10-25 files.  
SYSTEMS_AFFECTED: `docs/automation/ACTION_IDS_*.md`  
RECOMMENDED_ACTION: Director = this dated file + living `MASTER_ROADMAP.md`. Specialists = `ACTION_IDS_<PREFIX>_YYYY-MM-DD.md`.  
AUTONOMY: AGENT_WITH_REVIEW  
DEPENDENCIES: none  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: This PR’s diff is `MASTER_ROADMAP.md` + `ACTION_IDS_2026-10-26.md` only.  
STATUS: OPEN  
