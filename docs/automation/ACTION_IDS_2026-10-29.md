# ACTION_IDs — 2026-10-29 Master Technical Director

Durable director ledger. Reuse existing IDs. Do not append specialist catalogs here.

**HEAD:** `0f5363f` (`Merge pull request #332`) — **unchanged since 2026-09-03 00:28 UTC**  
**Prior director:** unmerged [`#1254`](https://github.com/Mr-Melic/stralt/pull/1254) + memories (`bc-a10d07cd-1edb-4ea7-a500-ff3c617d7329`). Unmerged [`#338`](https://github.com/Mr-Melic/stralt/pull/338) through [`#1254`](https://github.com/Mr-Melic/stralt/pull/1254) are earlier snapshots. On `main`, [`MASTER_ROADMAP.md`](./MASTER_ROADMAP.md) is still the 2026-09-02 text.  
**This agent:** `bc-2723053f-7923-4204-ba34-dd06d550d432`  
**Gameplay / production code:** not modified this run.

Specialist IDs stay in their producer files. Do not concatenate into this ledger. Do not append to `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, or `ACTION_IDS_2026-09-21.md` through `ACTION_IDS_2026-10-28.md`.

---

## Status of prior director IDs (reuse; do not mint twins)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| MTD-2026-08-31-001 / MTD-2026-09-01-001 | OPEN | Halt-as-config failed 08-31…09-29, **10-21** (56), **10-22** (58), **10-23** (52), **10-24** (63), **10-25** (65), **10-26** (55), **10-27** (55, all-day), **10-28** (59, all-day). Recurring **2026-10-29 00:00**: **~51** automations (**~49 RUNNING**, **1 IDLE**, **1 ERROR**). Halt-as-merge-stop held **56 days** (`main` still `0f5363f`). |
| MTD-2026-09-21-001 | PARTIAL | 09-21 wave opened **59** drafts. Humans **did not merge** them. |
| MTD-2026-09-22-001 … 29-001 | SUPERSEDED | Those waves already happened. |
| MTD-2026-10-21-001 … 10-27-001 | SUPERSEDED | Those recovered days already ran. Halt itself remains OPEN via MTD-2026-08-31-001. |
| MTD-2026-10-28-001 | SUPERSEDED | 10-28 wave **did not hold**. Opened **59** PRs `#1218`–`#1276`. See MTD-2026-10-29-001 / 003. |
| MTD-2026-10-28-002 | SUPERSEDED | Close-list extended by MTD-2026-10-29-002 (+#1254). |
| MTD-2026-10-28-003 | SUPERSEDED | 10-27 as seventh recovered-mill day is now historical. See MTD-2026-10-29-003 (eighth day). |
| MTD-2026-10-28-004 | SUPERSEDED | Queue was 921; **945** at 10-29 first count. See MTD-2026-10-29-004. |
| MTD-2026-10-26-005 | OPEN | Soak mill **grew** on 10-28 (`#1257` pack SR, `#1262` boss-kit SR). Still no `applyHazardLanding` in `src/`. HOLD `#1079/#1084/#1097/#1100/#1136/#1142/#1257/#1262` and Swap `#541/#754`. |
| MTD-2026-10-24-005 | OPEN | Empirically failed on **five** recovered days: 10-24, 10-25, 10-26, 10-27, **and 10-28 (20 of 59 after 01:00)**. |
| MTD-2026-09-02-001 | SUPERSEDED | 09-02 wave already merged. |
| MTD-2026-09-02-002 | IMPLEMENTED (source) | #259 / #311 / #324. Deploy half → MTD-2026-09-21-002. |
| MTD-2026-09-21-002 | OPEN | `.old` still Aug-31 no-GameKey. Grep GameKey in `.old` = 0. No `snapshots/deployed/` file newer than `pr259-tail-20260901.most`. **56 days.** |
| MTD-2026-09-02-003 | OPEN | Freeze new stables until deploy confirmed. Frozen chain files untouched on `main`. #362 edits `main.mo` **behavior only**. |
| MTD-2026-09-02-004 / AQA-2026-08-30-003 | PARTIAL | This run writes `ACTION_IDS_2026-10-29.md` only. Living index still off `main`. |
| MTD-2026-09-21-003 | OPEN | **#327 still open** (oldest draft, **57 days** stale, `mergeable_state: dirty`). #370 is a later Striker **superset** and still open. |
| MTD-2026-09-21-004 | OPEN | #331 still open and **CONFLICTING**. Hold all open map punches. 10-28 added `#1229/#1258/#1265/#1275`. |
| MTD-2026-10-21-002 / 22-002 / 23-002 / 25-002 / 26-002 / 27-002 / 28-002 | OPEN | Subsumed by MTD-2026-10-29-002. |
| MTD-2026-10-21-003 | OPEN | Historical: 09-30…10-20 was ERROR/boot. Do not relabel the gap as a halt. |
| MTD-2026-10-22-003 | OPEN | Recovery rebuilt the mill. Still true. Eight recovered days now. |
| MTD-2026-10-22-005 | OPEN | **Still the dominant mill.** GitHub `advertised` = **129** (was 109). 10-28 added `#1220/#1231/#1252/#1259/#1264/#1273` plus share-kit `#1238/#1260/#1263/#1270`. `summon-control` search = **53**. One `resolveKitExecute` helper after halt. |
| MTD-2026-10-23-005 | OPEN | Skip-wipe mill standing. GitHub `"skip remount"` = **77**. 10-28 added `#1239/#1268/#1276`. One remount-wipe guard after halt. |
| MTD-2026-09-22-004 | OPEN | #370 still HOLD until after #327. Still open. |
| MTD-2026-09-25-005 | OPEN | Oldest-first still makes the living index unreachable. #327 now 57 days CONFLICTING; queue **945**; eighteen director snapshots once this lands. |
| AQA-2026-08-30-008 | PARTIAL | Clamps + ignore-client level + AP/MP cap; **no ADR** (`docs/**/*ADR*` = 0). Security `c97e5c0c-a485` RUNNING tonight. |
| AQA-2026-08-30-006 | BROKEN | mapGen still **1,937**. Guardian `9dcfd122-a484` RUNNING. 10-28 added four more snaps. |
| AQA-2026-08-30-007 | BROKEN | WX still **19,213**. `#831/#842/#901/#961/#995/#1076/#1109/#1196/#1241` already touch it. Complexity-reduction `386a157d-a4a5` RUNNING. |
| AQA-2026-08-30-005 | PARTIAL | Pale Archivist / Enthroned Void / Fetid Rook / Final Pawn test mill continues (`#1247/#1261/#1271/#1273`). Defect-recurrence RUNNING. |
| AQA-2026-08-30-009 | BROKEN | Orchestrator `68f2958f-a489` RUNNING tonight. |
| AQA-2026-08-30-010 | BROKEN | Skip-wipe **77** exact-phrase. Persist auditor RUNNING tonight. Advertised mill is the louder persist-adjacent combat stream. |
| AQA-2026-08-30-012 | OPEN | Still 0 collectors. TBC `#1232` correctly WAITING (seventeenth inspection of this SHA). Tonight’s TBC is the **eighteenth** WAITING clone. |
| AQA-2026-09-27-001 | BROKEN | Queue 380 → 774 → 776 → 831 → 886 → 921 → **945**. 0 closes in the audited week (`#1106`). |
| AQA-2026-09-27-003 | BROKEN | #62 daily paint extracts; `#1241` floor AO extract joins `#1196/#1109`. |
| TBC-2026-08-31-001 | OPEN | WAITING_FOR_TELEMETRY. Confirmed this run. Keep **#333**; close later twins including **#871/#928/#994/#1053/#1108/#1165/#1232**. |
| MIMA-2026-08-31-001 | OPEN | Swap still teleports (`WX` 9389–9402). No `applyHazardLanding` in `src/`. **HOLD #541 and #754**. Soak mill is the same class (MTD-2026-10-26-005). |
| MIMA-2026-08-31-002 | PARTIAL | Dest occupancy/unseal landed; **no** hazard landing. |
| MIMA-2026-09-01-001 | IMPLEMENTED | #313 `battleWalkMpCost` on execute. |
| MIMA-2026-09-01-002 | PARTIAL | Barriers in `isBattleWalkTileBlocked`. Occupants still missing from `findPath`. |
| MIMA-2026-09-02-001 | IMPLEMENTED | #318 `enemyWalkMp.ts`. |
| MIMA-2026-09-02-003 | OPEN (helper drafted) | `redeemGameKeyThroughPersist` still raw lock+grant (`shopPurchase.ts` 294–330). **#391** adds the helper, **does not wire** redeem. |
| PXA-2026-09-02-002 | IMPLEMENTED | #332 accepted-challenge HUD. |
| SDA-2026-08-31-002 / SDA-2026-09-01-003 / SDA-2026-09-02-003 | OPEN | Catalog still hydrates into every book (`adminSafety.ts` 712–718: `usableByPlayer !== false` → true). |
| SDA-2026-08-31-004 | OPEN | No observe→win persist. |
| EXPANSION-PREREQ-A | OPEN | `WX` 11920 still passes LevelZone object. Number already at 1136. `buildEnemyKit` expects `number` (`enemyAI.ts` 194–197). **Twentieth cycle.** |
| MTD-2026-08-31-003 | OPEN | HP/death extraction. Not tonight. |
| MTD-2026-08-31-004 | OPEN | Expansion freeze. AI `67b03c2f-a492`, boss `39040ad2-a493`, dungeon `73740435-a493`, spell mechanics `1330956a-a493`, spell discovery `c26e5a83-a492`, expansion `3f31b18f-a492`, combat-parity `f37b7505-a484`, complexity `386a157d-a4a5`, admin implementer `3089f18d-a49a` **RUNNING this hour**. Critical hunter `1aa41c6c-a483` **ERROR** this hour (still enabled). |
| MTD-2026-08-31-005 | OPEN | `useSaveKillCount` has no TSX caller (`useLeaderboardQueries.ts` 43–51 only). |
| MTD-2026-08-31-006 | OPEN | Admin DVA not canister. Dashboard 8,280 lines. `#945`, `#1001`, `#1066`, `#1115`, `#1190`, `#1223` HOLD. |
| MTD-2026-08-31-007 | OPEN | Point at SDA-002/004; no fifth schema. Wave 20/21 catalogs are twins of Wave 18/19. |
| MTD-2026-08-31-008 | OPEN | 30% random AI tier (`combatMath.ts` 34–50). |
| LHIPS-2026-09-01-001 | HOLD | HUD saturates at 48. Do not retune curve. |
| LHIPS-2026-09-01-002 | HOLD | 100k/500k clamp vs jackpot. Architecture, not a BAL retune. |
| SDEG-2026-09-21-001 | OPEN on `main` | Unbounded GameKey serial + `saveActiveSpells` keep-store live only on **#362** (unmerged). |
| SDEG-2026-09-21-003 | OPEN / HUMAN | Persist AP/MP cap 20 vs unbounded formula. Do not raise the cap in this flock. |
| RAO-2026-09-03-0000-002 | DEFERRED | Feats vs Achievements recap copy. Drafted as **#354**. P3 display-only. |
| RAO-2026-09-03-0000-003 | NEEDS_HUMAN_DECISION | Paper Windstorm two live rates. Do not “fix” announce alone. `#1272` is another Windstorm kit patch — HOLD. |

---

ACTION_ID: MTD-2026-08-31-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Halt same-hour P2/P3 implementer flock after a merge burst or freeze restart  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Failed 2026-08-31, 09-01, 09-02 (humans then merged). Halt-as-merge-stop then held **56 days** (`main` still `0f5363f`). Recurred 09-21…09-29 (~50 drafts/day), then a 22-day ERROR outage, then **2026-10-21** (56 PRs), **2026-10-22** (58), **2026-10-23** (52 all day), **2026-10-24** (63 all day), **2026-10-25** (65 all day), **2026-10-26** (55 all day), **2026-10-27** (55 all day), **2026-10-28** (59 all day), then **2026-10-29 00:00** with **~51** automations (**~49 RUNNING**, **1 IDLE**, **1 ERROR**): map guardian, AI, combat-parity, persist auditor, boss, dungeon, complexity reduction, spell mechanics, spell discovery, expansion, invariants, admin implementer `3089f18d-a49a`. GetAutomation confirms `1aa41c6c-a483`, `f37b7505-a484`, `9dcfd122-a484`, `386a157d-a4a5`, `fe5b679a-a489` still **enabled**. Critical hunter ERROR this hour is not a disable. Cursor Cloud has no prompt write API. Weekly audit `#1106` independently classified the prior week as NEGATIVE_ROI mill.  
SYSTEMS_AFFECTED: all Cursor Cloud automations; leftover GitHub queue; WX / mapGen / persist / enemyAI / spellEngine / AdminDashboard  
RECOMMENDED_ACTION: HUMAN_CONFIG: disable implementers (Approved Design `fe5b679a-a489`, complexity `386a157d-a4a5`, combat-parity `f37b7505-a484`, map guardian `9dcfd122-a484`, persist `607e0304-a484`, AI `67b03c2f-a492`, boss `39040ad2-a493`, dungeon `73740435-a493`, spell mechanics `1330956a-a493`, spell discovery `c26e5a83-a492`, expansion `3f31b18f-a492`, critical hunter `1aa41c6c-a483`, admin implementer `3089f18d-a49a`, invariants `72eb90fe-a483`). Leave report-only specialists. Do not merge tonight’s gameplay PRs.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: none  
REGRESSION_RISK: LOW if halted; HIGH if the 10-29 wave merges  
VALIDATION_REQUIRED: Next director ledger shows implementers disabled **and** daytime cadences not opening map/persist/combat PRs.  
STATUS: NEW

---

ACTION_ID: MTD-2026-10-29-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Hold the 2026-10-29 00:00 specialist wave; do not treat 10-21…10-28 recovery as a green light  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: 10-29 launched **~51** automations (**~49 RUNNING** + 1 IDLE + 1 ERROR) including map guardian, AI, combat-parity, persist auditor, boss, dungeon, complexity reduction, spell mechanics, spell discovery, expansion, invariants, admin implementer. During this ledger the wave already opened TBC `#1277` (eighteenth WAITING clone of `0f5363f`), advertised combat `#1278` Pale Archbishop skeleton-minion, and docs `#1279`. 10-28 already proved halt-as-config failed for an eighth recovered day (59 PRs). Queue **945 → 947**.  
SYSTEMS_AFFECTED: tonight’s implementer PRs; leftover queue  
RECOMMENDED_ACTION: Hold every 10-29 00:00 gameplay / extract / test-mill PR. Docs-only specialist reports may exist; do not merge them ahead of this living index. Do not merge-burst.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-08-31-001  
REGRESSION_RISK: LOW if held; HIGH if merged  
VALIDATION_REQUIRED: 10-29 gameplay PR count after this hour is ~0, or the next ledger documents another miss.  
STATUS: NEW

---

ACTION_ID: MTD-2026-10-29-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Close superseded director snapshots through #1254 when this living index lands  
CATEGORY: process  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Seventeen living-file snapshots are still open: #338, #402, #448, #509, #569, #618, #666, #718, #783, #814, #870, #946, #998, #1074, #1124, #1186, #1254. All rewrite `MASTER_ROADMAP.md`. Oldest-first cannot insert this index behind that queue (MTD-2026-09-25-005). On `main` the file is still the 2026-09-02 text.  
SYSTEMS_AFFECTED: `docs/automation/MASTER_ROADMAP.md`; `docs/automation/ACTION_IDS_2026-10-29.md`  
RECOMMENDED_ACTION: Close **#338, #402, #448, #509, #569, #618, #666, #718, #783, #814, #870, #946, #998, #1074, #1124, #1186, and #1254** without merge when this PR is the living index. Do not merge all eighteen.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-09-25-005  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Living `MASTER_ROADMAP.md` on `main` is this date; the seventeen listed PRs are closed.  
STATUS: NEW

---

ACTION_ID: MTD-2026-10-29-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Classify the 2026-10-28 flock as an eighth recovered-mill day, not a successful halt  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: 10-28 launched with 48 RUNNING and opened **59** PRs (`#1218`–`#1276`) including advertised-combat twins (`#1220/#1231/#1252/#1259/#1264/#1273`), share-kit (`#1238/#1260/#1263/#1270`), soak (`#1257/#1262`), four map snaps (`#1229/#1258/#1265/#1275`), WX extract `#1241`, skip-wipe `#1239/#1268/#1276`, Fetid Rook / Final Pawn / Pale Archivist tests, admin `#1223`, and Wave 20/21 catalogs. Hours: 00=39, then 04/06/08/12/16/18 = **20 more**. Queue 921 → **945**. Combined with 10-21’s 56, 10-22’s 58, 10-23’s 52, 10-24’s 63, 10-25’s 65, 10-26’s 55, and 10-27’s 55: **463 drafts in eight recovered days**. That is the opposite of MTD-2026-10-28-001’s hold. Soak mill, silent on 10-27, grew again.  
SYSTEMS_AFFECTED: all Cursor Cloud automations; leftover queue  
RECOMMENDED_ACTION: Do not close MTD-2026-08-31-001. Do not praise 10-21…10-28 as “flock healthy.” Keep implementers paused through recovery. Log that eight recovered crons that open ~52–65 drafts/day are **worse** than a silent outage for merge-stop. Note the mill **stayed** on advertised-combat (109 → 129 open) and **restarted** soak.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-08-31-001; MTD-2026-10-28-003  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next director ledger distinguishes outage vs pause vs recovered-mill; implementers stay disabled; advertised mill does not add another sixteen; soak mill does not add another pair.  
STATUS: NEW

---

ACTION_ID: MTD-2026-10-29-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Triage the 945-draft leftover queue; do not merge-burst it after a 56-day freeze  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open PR count = **945** GitHub search at first count, **947** after `#1277`–`#1279` during this run. Grew 482 (10-21 00:00) → 538 → 596 → 648 → 711 → 776 → 831 → 844 → 886 → 921 → 945 → **947**. Prefix mix: hundreds of docs, **77** `"skip remount"` (`#1239/#1268/#1276` on 10-28), **129** advertised combat, **53** summon-control, soak mill, map snaps, WX paint extracts (`#1241`), **18** director roadmaps once this lands, **17** TBC WAITING clones (`#1232`), Pale Archivist / Enthroned Void / Fetid Rook / Final Pawn test mill. Oldest #327 is CONFLICTING vs `0f5363f` (57 days). Only other CONFLICTING leftover named by directors is #331. Humans have not merged `main` since 2026-09-03. Merging oldest-first would restack eight weeks of overlapping WX / mapGen / persist / combat PRs onto a freeze that was working. `#1106` AQA-2026-09-27-001 asked drafts < 50; the week closed **0**.  
SYSTEMS_AFFECTED: GitHub merge queue; Caffeine import; `WorldExploration.tsx`; `mapGen.ts`; persist lock; `spellEngine.ts`  
RECOMMENDED_ACTION: Do not “clear the queue.” Close superseded director snapshots. Restack #327. Hold mills (map / skip-wipe / leftover-walk / Swap / combat-gate / share-kit / advertised / soak / paint extract / kit-HP tests). Unique leftovers listed in MASTER_ROADMAP.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-29-002; MTD-2026-09-25-005  
REGRESSION_RISK: HIGH if the queue is merge-bursted  
VALIDATION_REQUIRED: `main` does not receive a multi-PR gameplay burst from #333–#1276 or the rest of the 10-29 wave. Open count falls by closes, not by merging mills.  
STATUS: NEW

---

ACTION_ID: MTD-2026-10-24-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Halt 06:00 / 12:00 / 18:00 (and 04/08/16) implementer cadences, not only the midnight wave  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Empirically failed **five** recovered days. 10-28 after 01:00 = **20 of 59** PRs: 04:24 soak `#1257`; 06:13–06:16 map/advertised/share-kit `#1258`–`#1260`; 08:10–08:13 test/soak/share-kit `#1261`–`#1263`; 12:12–12:19 six combat/map/skip-wipe PRs `#1264`–`#1269`; 16:08–16:15 share-kit/test/Windstorm `#1270`–`#1272`; 18:10–18:22 advertised/UX/map/skip-wipe `#1273`–`#1276`. Midnight-only halt cannot stop this mill.  
SYSTEMS_AFFECTED: daytime Cursor Cloud automations; leftover queue; WX / mapGen / spellEngine / persist  
RECOMMENDED_ACTION: HUMAN_CONFIG: disable or convert to report-only every implementer cadence (04/06/08/12/16/18/20 UTC), not only `0 */24`.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-08-31-001  
REGRESSION_RISK: LOW if halted; HIGH if daytime cadences keep shipping  
VALIDATION_REQUIRED: Next recovered day has ~0 gameplay PRs after 01:00 UTC.  
STATUS: NEW

---

ACTION_ID: MTD-2026-10-22-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: One resolveKitExecute helper; hold the advertised / share-kit mill  
CATEGORY: correctness  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: GitHub `advertised` search = **129** (was 109 on 10-28). 10-28 added `#1220` Final Pawn ghost HP, `#1231` Fetid Rook split twins, `#1252` Glass Realm ×2, `#1259` Enthroned Void phantom atk 5, `#1264` Final Pawn ghost atk 5, `#1273` Pale Archivist scroll-summon atk 8, plus share-kit `#1238/#1260/#1263/#1270`. `summon-control` search = **53**. Combat-parity `f37b7505-a484` RUNNING tonight. Local one-flag patches are no longer sufficient.  
SYSTEMS_AFFECTED: `spellEngine.ts`; kit execute; `WorldExploration.tsx`  
RECOMMENDED_ACTION: After halt, extract one `resolveKitExecute` helper. Hold every advertised / share-kit / summon-control twin including tonight’s wave. Do not merge `#1220/#1231/#1238/#1252/#1259/#1260/#1263/#1264/#1270/#1273`.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-08-31-001  
REGRESSION_RISK: HIGH if twins merge; MEDIUM for a single helper after halt  
VALIDATION_REQUIRED: Open `advertised` count stops growing; one helper PR exists; WX does not grow.  
STATUS: NEW

---

ACTION_ID: MTD-2026-10-23-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: One remount-wipe guard; hold the skip-wipe mill  
CATEGORY: data-persistence  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: GitHub `"skip remount"` = **77**. 10-28 added `#1239` leftover spell-level keep, `#1268` leftover bar keep, `#1276` throw-after-accept inventory. Persist auditor `607e0304-a484` RUNNING tonight. Cluster is standing, not closed.  
SYSTEMS_AFFECTED: `saveBattleStats` remount path; inventory / spell-bar / spell-level keeps  
RECOMMENDED_ACTION: After halt, one remount-wipe guard. Hold `#1239/#1268/#1276` and the rest of the skip-remount titles.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-08-31-001  
REGRESSION_RISK: HIGH if twins merge  
VALIDATION_REQUIRED: `"skip remount"` count stops growing; one helper PR exists.  
STATUS: NEW

---

ACTION_ID: MTD-2026-10-26-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: One applyHazardLanding helper; hold Swap and the soak mill  
CATEGORY: correctness  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: No `applyHazardLanding` in `src/`. Swap still teleports (`WX` 9389–9402). Soak mill **grew** on 10-28: `#1257` pack SR, `#1262` boss-kit SR. Prior six still open: `#1079/#1084/#1097/#1100/#1136/#1142`. HOLD Swap `#541/#754` and share-kit Swap `#850`.  
SYSTEMS_AFFECTED: Swap; summon walk; reflect; plague; lava/spikes; `WorldExploration.tsx`  
RECOMMENDED_ACTION: After halt, extract `applyHazardLanding`. Hold every soak/tax/Swap-landing twin. Do not merge `#1257/#1262`.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-08-31-001; MIMA-2026-08-31-001  
REGRESSION_RISK: HIGH if twins merge; MEDIUM for a single helper after halt  
VALIDATION_REQUIRED: Soak count stops growing; helper exists; Swap still skip-landing until that helper wires.  
STATUS: NEW

---

ACTION_ID: MTD-2026-09-21-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Confirm Caffeine 20260901 GameKey deploy and refresh `.old`  
CATEGORY: data-persistence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `.old` GameKey grep = 0. Newest `snapshots/deployed/` file is still `pr259-tail-20260901.most`. `mops.toml` `check-limit = 5`. Frozen chain files untouched on `main`. **56 days** since last `main` merge; deploy half of #259 still unconfirmed.  
SYSTEMS_AFFECTED: `.old/src/backend/dist/backend.most`; Caffeine import; GameKey stables  
RECOMMENDED_ACTION: After a successful Caffeine deploy of the 20260901 tail, copy that build’s `backend.most` to `.old` and `snapshots/deployed/`. Never hand-write `.old`. Freeze new stables until then.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-09-02-003  
REGRESSION_RISK: HIGH if `.old` is hand-written  
VALIDATION_REQUIRED: GameKey appears in `.old` only from a Caffeine-deployed `.most`; `check-eop-stables.py` still passes.  
STATUS: NEW

---

ACTION_ID: AQA-2026-08-30-008  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Write the reward-trust ADR  
CATEGORY: data-persistence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Clamps (100k/500k), ignore-client `writeLevel`, and `saveBattleStats` no-mint are on `main`. `docs/**/*ADR*` = 0. Security `c97e5c0c-a485` RUNNING tonight with the stale Finding 3 phrasing risk. `applyRewards` remains client-trusted within clamps.  
SYSTEMS_AFFECTED: `applyRewards`; `saveBattleStats`; future discovery grants; custom-client mint surface  
RECOMMENDED_ACTION: Write a short ADR: (a) official client clamps + ignore-client level (already shipped); custom clients can still drip-mint until a later canister proof. Finding 3 = unbounded/absolute misuse, not “Doka write is a bug.” No new credit APIs until the ADR exists.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: none  
REGRESSION_RISK: LOW for a docs ADR  
VALIDATION_REQUIRED: An ADR file exists; security reports stop asking to remove the Doka write.  
STATUS: NEW

---

ACTION_ID: EXPANSION-PREREQ-A  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Pass a number into buildEnemyKit, not a LevelZone object  
CATEGORY: content-depth  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `WX` 11920 `buildEnemyKit(enemy.pieceType, currentMap.levelZone)`. `buildEnemyKit` signature is `(pieceType, levelZone: number)` (`enemyAI.ts` 194–197). `currentZoneTier` already exists at `WX` 1136. **Twentieth director cycle.** Unblocks dynamic enemy spell pools without an AI rewrite.  
SYSTEMS_AFFECTED: `WorldExploration.tsx` battle start; `enemyAI.ts` kits  
RECOMMENDED_ACTION: After flock halt, one call-site fix + `enemyAI` test. No WX growth. Do not start tonight.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-08-31-001  
REGRESSION_RISK: MEDIUM (kit contents change from zone-0 to real tier)  
VALIDATION_REQUIRED: Overworld enemies receive zone-1+ kits in a fixture; WX line count does not grow.  
STATUS: NEW

---

ACTION_ID: AQA-2026-08-30-012  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Outcome counters before any telemetry dashboard  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `longHorizonSim.telemetry.available === false`. No `recordTelemetry` in `src/`. TBC `#1232` correctly WAITING (seventeenth inspection of `0f5363f`). Dashboard specialist `4b026695-a4a0` RUNNING tonight with nothing to display.  
SYSTEMS_AFFECTED: persist lock (must not dual-write); future sidecar  
RECOMMENDED_ACTION: After halt, design + tiny isolated query-only / persist-lock-enqueued counters. Not a dashboard. Do not put counters on the persist lock’s Doka snapshot.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-08-31-001; AQA-2026-08-30-008  
REGRESSION_RISK: HIGH if counters share the wallet lock incorrectly  
VALIDATION_REQUIRED: TBC can exit WAITING_FOR_TELEMETRY with real rows; dashboard still not required.  
STATUS: NEW
