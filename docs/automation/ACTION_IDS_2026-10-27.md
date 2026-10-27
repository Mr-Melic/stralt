# ACTION_IDs — 2026-10-27 Master Technical Director

Durable director ledger. Reuse existing IDs. Do not append specialist catalogs here.

**HEAD:** `0f5363f` (`Merge pull request #332`) — **unchanged since 2026-09-03 00:28 UTC**  
**Prior director:** unmerged [`#1124`](https://github.com/Mr-Melic/stralt/pull/1124) + memories (`bc-07a3a496-74a2-483d-bcb9-6d92b9fa5510`). Unmerged [`#338`](https://github.com/Mr-Melic/stralt/pull/338) through [`#1124`](https://github.com/Mr-Melic/stralt/pull/1124) are earlier snapshots. On `main`, [`MASTER_ROADMAP.md`](./MASTER_ROADMAP.md) is still the 2026-09-02 text.  
**This agent:** `bc-149fb345-16c4-4e64-b793-853da4693811`  
**Gameplay / production code:** not modified this run.

Specialist IDs stay in their producer files. Do not concatenate into this ledger. Do not append to `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, or `ACTION_IDS_2026-09-21.md` through `ACTION_IDS_2026-10-26.md`.

---

## Status of prior director IDs (reuse; do not mint twins)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| MTD-2026-08-31-001 / MTD-2026-09-01-001 | OPEN | Halt-as-config failed 08-31…09-29, **10-21** (56), **10-22** (58), **10-23** (52), **10-24** (63), **10-25** (65), **10-26** (55, all-day). Recurring **2026-10-27 00:00**: **52** automations (**47 RUNNING**, **5 IDLE**, 0 ERROR). Halt-as-merge-stop held **54 days** (`main` still `0f5363f`). |
| MTD-2026-09-21-001 | PARTIAL | 09-21 wave opened **59** drafts. Humans **did not merge** them. |
| MTD-2026-09-22-001 … 29-001 | SUPERSEDED | Those waves already happened. |
| MTD-2026-10-21-001 … 10-25-001 | SUPERSEDED | Those recovered days already ran. Halt itself remains OPEN via MTD-2026-08-31-001. |
| MTD-2026-10-26-001 | SUPERSEDED | 10-26 wave **did not hold**. Opened **55** PRs `#1108`–`#1162`. See MTD-2026-10-27-001 / 003. |
| MTD-2026-10-26-002 | SUPERSEDED | Close-list extended by MTD-2026-10-27-002 (+#1124). |
| MTD-2026-10-26-003 | SUPERSEDED | 10-25 as fifth recovered-mill day is now historical. See MTD-2026-10-27-003 (sixth day). |
| MTD-2026-10-26-004 | SUPERSEDED | Queue was 776; now **831** before the 10-27 first two drafts (`#1163`/`#1164`). See MTD-2026-10-27-004. |
| MTD-2026-10-26-005 | OPEN | Soak mill still standing. 10-26 added `#1142` (Plague Zone tick) and `#1136` (controlled-summon walk tax). Still no `applyHazardLanding` in `src/`. HOLD `#1079/#1084/#1097/#1100/#1136/#1142` and Swap `#541/#754`. |
| MTD-2026-10-24-005 | OPEN | Empirically failed on **three** recovered days: 10-24 (24 after 01:00), 10-25 (24 after 01:00), **10-26 (18 of 55 after 01:00)**. |
| MTD-2026-09-02-001 | SUPERSEDED | 09-02 wave already merged. |
| MTD-2026-09-02-002 | IMPLEMENTED (source) | #259 / #311 / #324. Deploy half → MTD-2026-09-21-002. |
| MTD-2026-09-21-002 | OPEN | `.old` still Aug-31 no-GameKey. Grep GameKey in `.old` = 0. No `snapshots/deployed/` file newer than `pr259-tail-20260901.most`. **54 days.** |
| MTD-2026-09-02-003 | OPEN | Freeze new stables until deploy confirmed. Frozen chain files untouched on `main`. #362 edits `main.mo` **behavior only**. |
| MTD-2026-09-02-004 / AQA-2026-08-30-003 | PARTIAL | This run writes `ACTION_IDS_2026-10-27.md` only. Living index still off `main`. |
| MTD-2026-09-21-003 | OPEN | **#327 still open** (oldest draft, **55 days** stale, `mergeable_state: dirty`). #370 is a later Striker **superset** and still `clean`. |
| MTD-2026-09-21-004 | OPEN | #331 still open and **CONFLICTING**. Hold all open map punches. 10-26 added `#1127/#1146/#1154/#1161`. |
| MTD-2026-10-21-002 / 22-002 / 23-002 / 25-002 / 26-002 | OPEN | Subsumed by MTD-2026-10-27-002. |
| MTD-2026-10-21-003 | OPEN | Historical: 09-30…10-20 was ERROR/boot. Do not relabel the gap as a halt. |
| MTD-2026-10-22-003 | OPEN | Recovery rebuilt the mill. Still true. Six recovered days now. |
| MTD-2026-10-22-005 | OPEN | Pack-enemy / advertised-execute mill grew again. 10-26 added `#1123/#1148/#1150/#1155/#1158/#1160`. One `resolveKitExecute` helper after halt. |
| MTD-2026-10-23-005 | OPEN | Skip-wipe mill **93 → ~100**. 10-26 added `#1129/#1145/#1147/#1149/#1151/#1153/#1157`. One remount-wipe guard after halt. |
| MTD-2026-09-22-004 | OPEN | #370 still HOLD until after #327. Still `clean`. |
| MTD-2026-09-25-005 | OPEN | Oldest-first still makes the living index unreachable. #327 now 55 days CONFLICTING; queue 831+; sixteen director snapshots once this lands. |
| AQA-2026-08-30-008 | PARTIAL | Clamps + ignore-client level + AP/MP cap; **no ADR** (`docs/**/*ADR*` = 0). Security `c97e5c0c` RUNNING tonight. |
| AQA-2026-08-30-006 | BROKEN | mapGen still **1,937**. Guardian `9dcfd122` RUNNING. 10-26 added four more snaps. |
| AQA-2026-08-30-007 | BROKEN | WX still **19,213**. `#831/#842/#901/#961/#995/#1076/#1109` already touch it. Complexity-reduction `386a157d` RUNNING. |
| AQA-2026-08-30-005 | PARTIAL | Pale Archivist / Enthroned Void test mill continues (`#1113/#1152/#1159/#1164`). Defect-recurrence RUNNING. |
| AQA-2026-08-30-009 | BROKEN | Orchestrator `68f2958f` RUNNING tonight. |
| AQA-2026-08-30-010 | BROKEN | Skip-wipe **~100**. Persist auditor RUNNING tonight. |
| AQA-2026-08-30-012 | OPEN | Still 0 collectors. TBC `#1108` correctly WAITING (fifteenth inspection of this SHA). Tonight’s TBC is RUNNING (sixteenth incoming). |
| AQA-2026-09-27-001 | BROKEN | Queue 380 → 774 → 776 → **831+**. 0 closes in the audited week (`#1106`). |
| AQA-2026-09-27-003 | BROKEN | #62 daily paint extracts; `#1109` portal-cube extract joins `#1076`. |
| TBC-2026-08-31-001 | OPEN | WAITING_FOR_TELEMETRY. Confirmed this run. Keep **#333**; close later twins including **#871/#928/#994/#1053/#1108**. |
| MIMA-2026-08-31-001 | OPEN | Swap still teleports (`WX` 9389–9402). No `applyHazardLanding` in `src/`. **HOLD #541 and #754**. Soak mill is the same class (MTD-2026-10-26-005). |
| MIMA-2026-08-31-002 | PARTIAL | Dest occupancy/unseal landed; **no** hazard landing. |
| MIMA-2026-09-01-001 | IMPLEMENTED | #313 `battleWalkMpCost` on execute. |
| MIMA-2026-09-01-002 | PARTIAL | Barriers in `isBattleWalkTileBlocked`. Occupants still missing from `findPath`. |
| MIMA-2026-09-02-001 | IMPLEMENTED | #318 `enemyWalkMp.ts`. |
| MIMA-2026-09-02-003 | OPEN (helper drafted) | `redeemGameKeyThroughPersist` still raw lock+grant (`shopPurchase.ts` 294–330). **#391** adds the helper, **does not wire** redeem. |
| PXA-2026-09-02-002 | IMPLEMENTED | #332 accepted-challenge HUD. |
| SDA-2026-08-31-002 / SDA-2026-09-01-003 / SDA-2026-09-02-003 | OPEN | Catalog still hydrates into every book (`adminSafety.ts` 712–718: `usableByPlayer !== false` → true). |
| SDA-2026-08-31-004 | OPEN | No observe→win persist. |
| EXPANSION-PREREQ-A | OPEN | `WX` 11920 still passes LevelZone object. Number already at 1136. `buildEnemyKit` expects `number` (`enemyAI.ts` 194–197). **Eighteenth cycle.** |
| MTD-2026-08-31-003 | OPEN | HP/death extraction. Not tonight. |
| MTD-2026-08-31-004 | OPEN | Expansion freeze. AI `67b03c2f`, boss `39040ad2`, dungeon `73740435`, spell mechanics `1330956a`, spell discovery `c26e5a83`, expansion `3f31b18f`, combat-parity `f37b7505`, complexity `386a157d`, critical hunter `1aa41c6c` **RUNNING this hour**. |
| MTD-2026-08-31-005 | OPEN | `useSaveKillCount` has no TSX caller. |
| MTD-2026-08-31-006 | OPEN | Admin DVA not canister. Dashboard 8,280 lines. `#945`, `#1001`, `#1066`, `#1115` HOLD. |
| MTD-2026-08-31-007 | OPEN | Point at SDA-002/004; no fifth schema. Wave 17/18 catalogs are twins. |
| MTD-2026-08-31-008 | OPEN | 30% random AI tier (`combatMath.ts` 34–50). |
| LHIPS-2026-09-01-001 | HOLD | HUD saturates at 48. Do not retune curve. |
| LHIPS-2026-09-01-002 | HOLD | 100k/500k clamp vs jackpot. Architecture, not a BAL retune. |
| SDEG-2026-09-21-001 | OPEN on `main` | Unbounded GameKey serial + `saveActiveSpells` keep-store live only on **#362** (unmerged, `clean`). |
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
EVIDENCE: Failed 2026-08-31, 09-01, 09-02 (humans then merged). Halt-as-merge-stop then held **54 days** (`main` still `0f5363f`). Recurred 09-21…09-29 (~50 drafts/day), then a 22-day ERROR outage, then **2026-10-21** (56 PRs), **2026-10-22** (58), **2026-10-23** (52 all day), **2026-10-24** (63 all day), **2026-10-25** (65 all day), **2026-10-26** (55 all day), then **2026-10-27 00:00** with **52** automations (**47 RUNNING**, **5 IDLE**): map guardian, AI, combat-parity, persist auditor, boss, dungeon, complexity reduction, spell mechanics, spell discovery, critical hunter, expansion, invariants, admin implementer. GetAutomation confirms `1aa41c6c`, `f37b7505`, `9dcfd122`, `386a157d` still **enabled**. Cursor Cloud has no prompt write API. Weekly audit `#1106` independently classified the prior week as NEGATIVE_ROI mill.  
SYSTEMS_AFFECTED: all Cursor Cloud automations; leftover GitHub queue; WX / mapGen / persist / enemyAI / AdminDashboard  
RECOMMENDED_ACTION: HUMAN_CONFIG: disable implementers (Approved Design `fe5b679a`, complexity `386a157d`, combat-parity `f37b7505`, map guardian `9dcfd122`, persist `607e0304`, AI `67b03c2f`, boss `39040ad2`, dungeon `73740435`, spell mechanics `1330956a`, spell discovery `c26e5a83`, critical hunter `1aa41c6c`, admin implementer `3089f18d`, world-content `1592c6c0`, expansion `3f31b18f`, invariants `72eb90fe`) until P0/P1 close. Report-only specialists may stay on cron. Do not merge tonight’s PRs. Also disable daytime hunter-implementer cadences (MTD-2026-10-24-005). Do not dashboard-disable this director UUID.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: none  
REGRESSION_RISK: LOW for a pause; HIGH if implementers keep shipping  
VALIDATION_REQUIRED: Next director run sees fewer same-hour gameplay PRs than 10-26’s 33 non-docs drafts, and no 06/12/18 skip-wipe/map/pack-enemy/soak clones, or documents another config miss.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-10-27-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Hold the 2026-10-27 00:00 specialist wave; do not treat 10-21…10-26 recovery as a green light  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: 10-27 launched **52** automations (**47 RUNNING** + 5 IDLE) including map guardian, AI, combat-parity, persist auditor, boss, dungeon, complexity reduction, spell mechanics, spell discovery, critical hunter, expansion, invariants, admin implementer `3089f18d`. First-hour drafts already exist: `#1163`–`#1175` (admin re-audit, Enthroned Void test mill, TBC `#1165`, pack-enemy `#1166`, advertised Chaos `#1168`, persist test `#1171`, map snap `#1174`, Wave 20 boss `#1170`). Queue grew **831 → 844** while this ledger was written. 10-26 already proved halt-as-config failed for a sixth recovered day.  
SYSTEMS_AFFECTED: tonight’s implementer PRs; leftover queue  
RECOMMENDED_ACTION: Hold every 10-27 00:00 gameplay / extract / test-mill PR. Docs-only specialist reports may exist; do not merge them ahead of this living index. Do not merge-burst.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-08-31-001  
REGRESSION_RISK: LOW if held; HIGH if merged  
VALIDATION_REQUIRED: 10-27 gameplay PR count after this hour is ~0, or the next ledger documents another miss.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-10-27-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Close superseded director snapshots through #1124 when this living index lands  
CATEGORY: process  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Fifteen living-file snapshots are still open: #338, #402, #448, #509, #569, #618, #666, #718, #783, #814, #870, #946, #998, #1074, #1124. All rewrite `MASTER_ROADMAP.md`. Oldest-first cannot insert this index behind that queue (MTD-2026-09-25-005). On `main` the file is still the 2026-09-02 text.  
SYSTEMS_AFFECTED: `docs/automation/MASTER_ROADMAP.md`; `docs/automation/ACTION_IDS_2026-10-27.md`  
RECOMMENDED_ACTION: Close **#338, #402, #448, #509, #569, #618, #666, #718, #783, #814, #870, #946, #998, #1074, and #1124** without merge when this PR is the living index. Do not merge all sixteen.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-09-25-005  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Living `MASTER_ROADMAP.md` on `main` is this date; the fifteen listed PRs are closed.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-10-27-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Classify the 2026-10-26 flock as a sixth recovered-mill day, not a successful halt  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: 10-26 launched with 48 RUNNING and opened **55** PRs (`#1108`–`#1162`) including seven skip-wipe twins (`#1129/#1145/#1147/#1149/#1151/#1153/#1157`), pack-enemy / advertised combat (`#1123/#1148/#1150/#1155/#1158/#1160`), four map snaps (`#1127/#1146/#1154/#1161`), soak/tax `#1136/#1142`, WX extract `#1109`, Pale Archivist / Enthroned Void tests, and admin `#1115`. Hours: 00=37, then 04/06/08/12/16/18 = **18 more**. Queue 776 → **831**. Combined with 10-21’s 56, 10-22’s 58, 10-23’s 52, 10-24’s 63, and 10-25’s 65: **349 drafts in six recovered days**. That is the opposite of MTD-2026-10-26-001’s hold.  
SYSTEMS_AFFECTED: all Cursor Cloud automations; leftover queue  
RECOMMENDED_ACTION: Do not close MTD-2026-08-31-001. Do not praise 10-21…10-26 as “flock healthy.” Keep implementers paused through recovery. Log that six recovered crons that open ~52–65 drafts/day are **worse** than a silent outage for merge-stop.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-08-31-001; MTD-2026-10-26-003  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next director ledger distinguishes outage vs pause vs recovered-mill; implementers stay disabled.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-10-27-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Triage the 831-draft leftover queue; do not merge-burst it after a 54-day freeze  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open PR count = **831** GraphQL at first search, **844** by stack-compat list. Grew 482 (10-21 00:00) → 538 → 596 → 648 → 711 → 776 → 831 → **844**. Prefix mix: hundreds of docs, **~100** skip-wipe, pack-enemy / advertised combat, soak mill, map snaps, WX paint extracts, **16** director roadmaps once this lands, **15+** TBC WAITING clones, Pale Archivist / Enthroned Void test mill. Oldest #327 is CONFLICTING vs `0f5363f` (55 days). Only other CONFLICTING leftover named by directors is #331. Humans have not merged `main` since 2026-09-03. Merging oldest-first would restack eight weeks of overlapping WX / mapGen / persist / combat PRs onto a freeze that was working. `#1106` AQA-2026-09-27-001 asked drafts < 50; the week closed **0**.  
SYSTEMS_AFFECTED: GitHub merge queue; Caffeine import; `WorldExploration.tsx`; `mapGen.ts`; persist lock; `spellEngine.ts`  
RECOMMENDED_ACTION: Do not “clear the queue.” Close superseded director snapshots. Restack #327. Hold mills (map / skip-wipe / leftover-walk / Swap / combat-gate / share-kit / pack-enemy / soak / paint extract / Enthroned Void tests). Unique leftovers listed in MASTER_ROADMAP.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-27-002; MTD-2026-09-25-005  
REGRESSION_RISK: HIGH if the queue is merge-bursted  
VALIDATION_REQUIRED: `main` does not receive a multi-PR gameplay burst from #333–#1164 or the rest of the 10-27 wave. Open count falls by closes, not by merging mills.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-10-26-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Stop soak-like-playerTakesDamage clones; extract one landing/soak helper after halt  
CATEGORY: correctness  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. 10-25 opened `#1079/#1084/#1097/#1100`. 10-26 added `#1142` (Plague Zone turn-start tick) and `#1136` (tax player-controlled summon walk landings). Swap still teleports (`WX` 9389–9402) with no `applyHazardLanding` (grep in `src/` = 0). Local per-effect patches are no longer sufficient. Related to MIMA-2026-08-31-001, not a skip-wipe clone.  
SYSTEMS_AFFECTED: Swap; leftover walk; lava/spikes; reflect; Untouchable; summon walk; `WorldExploration.tsx`  
RECOMMENDED_ACTION: HOLD `#1079/#1084/#1097/#1100/#1136/#1142` and Swap mill `#541/#754`. After halt, one helper that taxes hazard/reflect landings the same as walk (`applyHazardLanding` or equivalent soak). One-line WX wiring. Do not change walk hazard math. Do not concatenate the six PRs.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-27-001 (halt first); MIMA-2026-08-31-001  
REGRESSION_RISK: HIGH if twins merge as concatenated copies; MEDIUM for a single helper  
VALIDATION_REQUIRED: Swap / leftover-walk / reflect / summon-walk onto lava/spikes charges the same HP as a walk landing; occupancy abort still holds; open soak count falls by close, not by merge-burst.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-10-24-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Halt must cover 06/12/18 hunter-implementer cadences, not only the 00:00 wave  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused; **validation failed three times**. 10-24: 24 of 63 PRs after 01:00. 10-25: 24 of 65 PRs after 01:00. **10-26: 18 of 55 PRs after 01:00** (`#1145` 04:18 skip-wipe, `#1146/#1147/#1148` 06:10–06:27, `#1149`–`#1152` 08:08–08:19, `#1153`–`#1156` 12:10–12:25, `#1157`–`#1159` 16:08–16:16, `#1160`–`#1162` 18:14–18:27).  
SYSTEMS_AFFECTED: 6h/8h/12h/18h automations; leftover skip-wipe / map / combat / soak mills  
RECOMMENDED_ACTION: HUMAN_CONFIG: disable every implementer and hunter that opens `fix:` / `refactor:` / `test:` PRs on frozen files, at every cron cadence. Report-only specialists may remain. Next director run must count PRs by hour, not only by midnight wave.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-08-31-001; MTD-2026-10-27-001  
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
EVIDENCE: Reused; mill grew again. Skip remount titles **93 → ~100**. 10-26 added leftover-Doka wipe twins `#1129/#1145/#1147/#1149/#1151/#1153/#1157` (portal / one-shot / GameKey / feat / Boss Rush / spend / shop-heal keep). Persist auditor `607e0304` is RUNNING this hour. Same shape as older `#330`-keep twins. Local patches are no longer sufficient. Distinct from `#391` (unpaid-death honour on GameKey redeem, still unwired in `shopPurchase.ts` 294–330).  
SYSTEMS_AFFECTED: `progressPersist.ts`; remount hydrate; `saveBattleStats`; Death Realm pending  
RECOMMENDED_ACTION: HOLD the ~100 skip-wipe PRs. After halt, one shared guard that skips remount `saveBattleStats` wipe when a committed keep exists and unpaid death is absent. Close twins. Do not concatenate. Do not fold `#391` into this helper.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-27-001 (halt first)  
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
EVIDENCE: Reused; mill grew. 10-26 added `#1123` (summon-hunter LoS Venom), `#1148` (Vampiric Ground lifesteal), `#1150` (summon-bomber Inferno CD), `#1155` (Iron Curse heal ×0.5), `#1158` (WX summon availableSpells pack CD), `#1160` (Glass Realm ×2). Growing `spellEngine.ts` / WX / enemyAI by one metadata field per cron is the combat mill’s standing shape. `applyHazardLanding` is still missing; Swap still teleports.  
SYSTEMS_AFFECTED: `spellEngine.ts`; `enemyAI.ts`; boss/summon kit tables; `WorldExploration.tsx`  
RECOMMENDED_ACTION: HOLD the share-kit and pack-enemy PRs. After halt, one helper that executes kits from advertised metadata with tests. Close twins. Do not concatenate. Hostile-summon empty-`spells` wiring is a **separate** spawn fix after halt — do not fold it into the helper PR.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-27-001 (halt first)  
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
EVIDENCE: Reused. Oldest open PR is still **#327** (`CONFLICTING` / `dirty`, created 2026-09-02, now **55 days**). #331 also CONFLICTING. Fifteen superseded director PRs plus this one all rewrite `MASTER_ROADMAP.md`. Stack-compat `--self` cannot insert a living index behind that queue.  
SYSTEMS_AFFECTED: `scripts/open-pr-stack-compat.sh`; GitHub merge button; `docs/automation/MASTER_ROADMAP.md`  
RECOMMENDED_ACTION: Restack #327 onto `0f5363f` or close it in favor of a fresh Striker PR **after** halt. Close #338/#402/#448/#509/#569/#618/#666/#718/#783/#814/#870/#946/#998/#1074/#1124 without merge. Then this living index is merge-clean as the next docs item.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-09-21-003; MTD-2026-10-27-002  
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
EVIDENCE: Reused. `.old/src/backend/dist/backend.most` GameKey grep = 0. Newest deployed snapshot is still `pr259-tail-20260901.most`. Source chain is frozen correctly (`20260831` no GameKey; `20260901` GameKey, `OldActor = {}`). Live Caffeine previous-version signature is still the Aug-31 import until a successful deploy refreshes it. **54 days** since source landed.  
SYSTEMS_AFFECTED: Caffeine import; GameKey shop; `mops check-stable`; `.old`  
RECOMMENDED_ACTION: HUMAN deploy of current `main` (or a GameKey-only stack) to Caffeine. After success, replace `.old` with that build’s `src/backend/dist/backend.most` and add the same file under `snapshots/deployed/`. Never hand-write `.old`.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-09-02-003  
REGRESSION_RISK: HIGH if `.old` is hand-written; MEDIUM for a real deploy refresh  
VALIDATION_REQUIRED: `python3 scripts/check-eop-stables.py` still passes; Caffeine import of a no-new-stable change is clean; GameKey grep in `.old` becomes non-zero only from a deployed `.most`.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-008  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Write the reward-trust ADR; do not retune clamps  
CATEGORY: security / persistence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Clamps exist (`applyRewards` 100k/500k; `saveBattleStats` no-mint Doka/XP/level; AP/MP cap `#322`). `docs/**/*ADR*` = 0. Security Finding 3 is stale if phrased as “`saveBattleStats` must not write Doka” — Architecture requires that write for heals/spends/death. Security `c97e5c0c` RUNNING tonight.  
SYSTEMS_AFFECTED: `applyRewards`; `saveBattleStats`; GameKey redeem; future discovery grants  
RECOMMENDED_ACTION: Write one ADR: official client (a) clamps + ignore-client level; custom clients can still drip-mint within caps; no new credit APIs until that is written. Finding 3 = unbounded/absolute misuse, not “Doka write is a bug.”  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: none  
REGRESSION_RISK: LOW for a doc; HIGH if security PRs “fix” the Doka write  
VALIDATION_REQUIRED: ADR exists under `docs/`; security reports cite it instead of Finding 3.  
STATUS: OPEN  

---

ACTION_ID: EXPANSION-PREREQ-A  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Pass a zone-tier number into buildEnemyKit  
CATEGORY: content-depth  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused; **eighteenth cycle**. `currentZoneTier` already exists (`WX` 1136). Battle start still calls `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WX` 11920). `buildEnemyKit` floors a `number` (`enemyAI.ts` 194–197). A LevelZone object floors to 0 → every overworld enemy is zone-0. This is the cheapest unlock of dynamic enemy spell pools. Do not implement tonight.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`; `enemyAI.ts` kits  
RECOMMENDED_ACTION: After halt, one call-site change + `enemyAI` test. Pass `currentZoneTier` or `currentMap.levelZone` numeric tier, not the object. Do not grow WX.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-27-001 (halt first); MTD-2026-08-31-004  
REGRESSION_RISK: MEDIUM (kit contents change for existing maps)  
VALIDATION_REQUIRED: Zone 1/2 kits appear in unit tests; zone-0 still used only when the number is 0.  
STATUS: OPEN  
