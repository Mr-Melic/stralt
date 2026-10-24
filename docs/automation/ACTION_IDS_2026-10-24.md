# ACTION_IDs — 2026-10-24 Master Technical Director

Durable director ledger. Reuse existing IDs. Do not append specialist catalogs here.

**HEAD:** `0f5363f` (`Merge pull request #332`) — **unchanged since 2026-09-03 00:28 UTC**  
**Prior director:** unmerged [`#946`](https://github.com/Mr-Melic/stralt/pull/946) + memories (`bc-979c9352-9439-4db5-92a8-34e54f310a9e`). Unmerged [`#338`](https://github.com/Mr-Melic/stralt/pull/338) / [`#402`](https://github.com/Mr-Melic/stralt/pull/402) / [`#448`](https://github.com/Mr-Melic/stralt/pull/448) / [`#509`](https://github.com/Mr-Melic/stralt/pull/509) / [`#569`](https://github.com/Mr-Melic/stralt/pull/569) / [`#618`](https://github.com/Mr-Melic/stralt/pull/618) / [`#666`](https://github.com/Mr-Melic/stralt/pull/666) / [`#718`](https://github.com/Mr-Melic/stralt/pull/718) / [`#783`](https://github.com/Mr-Melic/stralt/pull/783) / [`#814`](https://github.com/Mr-Melic/stralt/pull/814) / [`#870`](https://github.com/Mr-Melic/stralt/pull/870) are earlier snapshots. On `main`, [`MASTER_ROADMAP.md`](./MASTER_ROADMAP.md) is still the 2026-09-02 text.  
**This agent:** `bc-8354b7b8-9e24-4e2e-b681-e35aba498095`  
**Gameplay / production code:** not modified this run.

Specialist IDs stay in their producer files. Do not concatenate into this ledger. Do not append to `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, or `ACTION_IDS_2026-09-21.md` through `ACTION_IDS_2026-10-23.md`.

---

## Status of prior director IDs (reuse; do not mint twins)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| MTD-2026-08-31-001 / MTD-2026-09-01-001 | OPEN | Halt-as-config failed 08-31…09-29, **10-21** (56 PRs), **10-22** (58 PRs), **10-23** (52 PRs, all-day). Recurring **2026-10-24 00:00**: **47** automations RUNNING (0 ERROR) plus later joiners. Halt-as-merge-stop held **51 days** (`main` still `0f5363f`). |
| MTD-2026-09-21-001 | PARTIAL | 09-21 wave opened **59** drafts. Humans **did not merge** them. |
| MTD-2026-09-22-001 … 29-001 | SUPERSEDED | Those waves already happened. |
| MTD-2026-10-21-001 | SUPERSEDED | 10-21 wave already ran: 87 agents, 0 ERROR, **56 PRs**. |
| MTD-2026-10-22-001 | SUPERSEDED | 10-22 wave already ran: **58 PRs** `#870`–`#927`. |
| MTD-2026-10-23-001 | SUPERSEDED | 10-23 wave already ran: **52 PRs** `#928`–`#979` across 00/06/08/12/16/18/21 UTC. See MTD-2026-10-24-001 / 003 / 005. |
| MTD-2026-09-02-001 | SUPERSEDED | 09-02 wave already merged. |
| MTD-2026-09-02-002 | IMPLEMENTED (source) | #259 / #311 / #324. Deploy half → MTD-2026-09-21-002. |
| MTD-2026-09-21-002 | OPEN | `.old` still Aug-31 no-GameKey. No `snapshots/deployed/` file newer than `pr259-tail-20260901.most`. **51 days.** |
| MTD-2026-09-02-003 | OPEN | Freeze new stables until deploy confirmed. Frozen chain files untouched on `main`. #362 edits `main.mo` **behavior only**. |
| MTD-2026-09-02-004 / AQA-2026-08-30-003 | PARTIAL | This run writes `ACTION_IDS_2026-10-24.md` only. Living index still off `main`. |
| MTD-2026-09-21-003 | OPEN | **#327 still open** (oldest draft, **52 days** stale, `mergeable_state: dirty`). #370 is a later Striker **superset**. |
| MTD-2026-09-21-004 | OPEN | #331 still open and **CONFLICTING**. Hold all open map punches. |
| MTD-2026-10-21-002 | OPEN | Close #338/#402/#448/#509/#569/#618/#666/#718/#783. Subsumed by MTD-2026-10-24-002. |
| MTD-2026-10-22-002 | OPEN | Close those plus #814. Subsumed by MTD-2026-10-24-002. |
| MTD-2026-10-23-002 | OPEN | Close those plus #870. Subsumed/extended by MTD-2026-10-24-002 (+#946). |
| MTD-2026-10-21-003 | OPEN | Historical: 09-30…10-20 was ERROR/boot. 10-21 recovered (87 IDLE / 0 ERROR). Do not relabel the gap as a halt. |
| MTD-2026-10-21-004 | SUPERSEDED | Queue was 482; then 538; then 596; now **648+**. See MTD-2026-10-24-004. |
| MTD-2026-10-22-003 | OPEN | 10-21 recovery rebuilt the mill (56 PRs). Still true. 10-22 added 58; 10-23 added 52. |
| MTD-2026-10-22-004 | SUPERSEDED | Queue was 538; then 596; now 648+. See MTD-2026-10-24-004. |
| MTD-2026-10-23-003 | SUPERSEDED | 10-22 as second recovered-mill day is now historical. See MTD-2026-10-24-003 (third day + all-day cadence). |
| MTD-2026-10-23-004 | SUPERSEDED | Queue was 596; now 648+. See MTD-2026-10-24-004. |
| MTD-2026-10-22-005 | OPEN | Advertised mill **23** titled `advertised` plus pack-enemy `#967/#972/#978`. One `resolveKitExecute` helper after halt. |
| MTD-2026-10-23-005 | OPEN | Skip-wipe mill **22 → 30**. One remount-wipe guard after halt. |
| MTD-2026-09-22-004 | OPEN | #370 still HOLD until after #327. Still `MERGEABLE`. |
| MTD-2026-09-25-005 | OPEN | Oldest-first still makes the living index unreachable. #327 now 52 days CONFLICTING; #331 also CONFLICTING; queue 648+; thirteen director snapshots. |
| AQA-2026-08-30-008 | PARTIAL | Clamps + ignore-client level + AP/MP cap; **no ADR** (`docs/**/*ADR*` = 0). Security `c97e5c0c` RUNNING tonight. |
| AQA-2026-08-30-006 | BROKEN | mapGen still **1,937**. Fifty-two open `fix(map)` PRs. Guardian `9dcfd122` RUNNING. |
| AQA-2026-08-30-007 | BROKEN | WX still **19,213**. `#831/#842/#901/#961` already touch it. Complexity-reduction `386a157d` RUNNING. |
| AQA-2026-08-30-005 | PARTIAL | Test mill still in the leftover queue (`#948/#959/#968/#975` on 10-23). Defect-recurrence `81c2e934` RUNNING. |
| AQA-2026-08-30-012 | OPEN | Still 0 collectors. TBC `#928` correctly WAITING. This hour `#981` is design-only. Dashboard specialist RUNNING. |
| TBC-2026-08-31-001 | OPEN | WAITING_FOR_TELEMETRY. Confirmed this run (`longHorizonSim.telemetry.available === false`). Keep **#333**; close later twins including **#871/#928**. |
| MIMA-2026-08-31-001 | OPEN | Swap still teleports (`WX` 9389–9402). No `applyHazardLanding` in `src/`. **HOLD #541 and #754**. |
| MIMA-2026-08-31-002 | PARTIAL | Dest occupancy/unseal landed; **no** hazard landing. |
| MIMA-2026-09-01-001 | IMPLEMENTED | #313 `battleWalkMpCost` on execute. |
| MIMA-2026-09-01-002 | PARTIAL | Barriers in `isBattleWalkTileBlocked`. Occupants still missing from `findPath` (`WX` 4466–4574). |
| MIMA-2026-09-02-001 | IMPLEMENTED | #318 `enemyWalkMp.ts`. |
| MIMA-2026-09-02-003 | OPEN (helper drafted) | `redeemGameKeyThroughPersist` still raw lock+grant (`shopPurchase.ts` 294–330). **#391** adds the helper, **does not wire** redeem. |
| PXA-2026-09-02-002 | IMPLEMENTED | #332 accepted-challenge HUD. |
| SDA-2026-08-31-002 / SDA-2026-09-01-003 / SDA-2026-09-02-003 | OPEN | Catalog still hydrates into every book (`adminSafety.ts` 712–718). |
| SDA-2026-08-31-004 | OPEN | No observe→win persist. |
| EXPANSION-PREREQ-A | OPEN | `WX` 11920 still passes LevelZone object. Number already at 1136 / 4680. Fifteenth cycle. |
| MTD-2026-08-31-003 | OPEN | HP/death extraction. Not tonight. |
| MTD-2026-08-31-004 | OPEN | Expansion freeze. AI `67b03c2f`, boss `39040ad2`, dungeon `73740435`, Approved Design `fe5b679a`, spell mechanics `1330956a`, expansion `3f31b18f`, combat-parity `f37b7505` **RUNNING this hour**. |
| MTD-2026-08-31-005 | OPEN | `useSaveKillCount` has no TSX caller. |
| MTD-2026-08-31-006 | OPEN | Admin DVA not canister. Dashboard 8,280 lines. `#945` HOLD. Admin implementer `3089f18d` RUNNING. |
| MTD-2026-08-31-007 | OPEN | Point at SDA-002/004; no fifth schema. Wave 15/16 catalogs are twins. |
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
EVIDENCE: Failed 2026-08-31, 09-01, 09-02 (humans then merged). Halt-as-merge-stop then held **51 days** (`main` still `0f5363f`). Recurred 09-21…09-29 (~50 drafts/day), then a 22-day ERROR outage, then **2026-10-21** (56 PRs), **2026-10-22** (58 PRs), **2026-10-23** (52 PRs all day), then **2026-10-24 00:00** with **47 RUNNING** + later joiners (map guardian, AI, Approved Design, combat-parity, boss, dungeon, complexity reduction, spell mechanics, spell discovery, critical hunter, expansion, admin implementer, persist auditor). GetAutomation confirms those UUIDs still **enabled**. Cursor Cloud has no prompt write API.  
SYSTEMS_AFFECTED: all Cursor Cloud automations; leftover GitHub queue; WX / mapGen / persist / enemyAI / AdminDashboard  
RECOMMENDED_ACTION: HUMAN_CONFIG: disable implementers (Approved Design `fe5b679a`, complexity `386a157d`, combat-parity `f37b7505`, map guardian `9dcfd122`, persist `607e0304`, AI `67b03c2f`, boss `39040ad2`, dungeon `73740435`, spell mechanics `1330956a`, spell discovery `c26e5a83`, critical hunter `1aa41c6c`, admin implementer `3089f18d`, world-content `1592c6c0`, expansion `3f31b18f`) until P0/P1 close. Report-only specialists may stay on cron. Do not merge tonight’s PRs. Also disable daytime hunter-implementer cadences (MTD-2026-10-24-005).  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: none  
REGRESSION_RISK: LOW for a pause; HIGH if implementers keep shipping  
VALIDATION_REQUIRED: Next director run sees fewer same-hour gameplay PRs than 10-23’s 24 non-docs drafts, and no 06/12/18 skip-wipe/map/share-kit clones, or documents another config miss.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-10-24-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Hold the 2026-10-24 00:00 specialist wave; do not treat 10-21/10-22/10-23 recovery as a green light  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `list-cloud-agents` createdAfter 2026-10-23T23:50Z / RUNNING filter returned **47 RUNNING** (0 ERROR) in the first minutes, then expansion `3f31b18f`, admin UX `48eb1df6`, and mobile a11y `c8f71c67` joined. Implementers named in #946 are still enabled. 10-23 same-hour hold was ignored and grew to 52 PRs. `main` still `0f5363f`. This hour already opened `#980`–`#993` including skip-wipe `#986/#987/#992` and pack-enemy `#985/#989`. P0/P1 from #946 are all still open.  
SYSTEMS_AFFECTED: leftover queue; WX; mapGen; enemyAI; AdminDashboard; spellEngine; main.mo stables  
RECOMMENDED_ACTION: Default HOLD every PR this wave opens, especially gameplay. Docs-only catalogs may remain unmerged. Do not implement Wave 15/16, pack-enemy gates, pixel-pattern extracts, skip-wipe clones, or share-kit flags tonight.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-08-31-001  
REGRESSION_RISK: HIGH if tonight’s implementers land on frozen files  
VALIDATION_REQUIRED: 10-24 gameplay PR count is reported next run; none merged to `main`.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-10-24-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Supersede unmerged director PRs #338, #402, #448, #509, #569, #618, #666, #718, #783, #814, #870, and #946; keep one living roadmap on main  
CATEGORY: process  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Thirteen open director PRs (this one included) rewrite `MASTER_ROADMAP.md`. None merged. `main` still serves the 2026-09-02 roadmap, so 09-21 through 10-24 flocks planned against a stale index. Oldest-first stack-compat cannot insert a fourteenth living index behind that queue plus CONFLICTING #327.  
SYSTEMS_AFFECTED: `docs/automation/MASTER_ROADMAP.md`; director ACTION_ID files; merge queue  
RECOMMENDED_ACTION: Close #338, #402, #448, #509, #569, #618, #666, #718, #783, #814, #870, and #946 without merge (this PR subsumes all twelve snapshots plus the 10-24 delta). Do not merge all thirteen. Future director runs write `ACTION_IDS_YYYY-MM-DD.md` and replace the living `MASTER_ROADMAP.md`.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-23-002  
REGRESSION_RISK: LOW — docs only; 09-21…10-23 facts are copied forward  
VALIDATION_REQUIRED: After merge, `main` `MASTER_ROADMAP.md` header date is this run; the twelve listed PRs are closed.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-10-24-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Classify the 2026-10-23 flock as a third recovered-mill day, not a successful halt  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: 10-23 launched with 48 RUNNING and opened **52** PRs (`#928`–`#979`) including **6** skip-wipe twins (`#938/#964/#969/#971/#977/#979`), **4** map snaps (`#933/#965/#970/#976`), advertised/pack-enemy combat (`#947/#967/#972/#974/#978`), WX extract `#961`, and admin helpers `#945`. Queue 596 → 648. Combined with 10-21’s 56 and 10-22’s 58: **166 drafts in three recovered days**. That is the opposite of MTD-2026-10-23-001’s hold.  
SYSTEMS_AFFECTED: all Cursor Cloud automations; leftover queue  
RECOMMENDED_ACTION: Do not close MTD-2026-08-31-001. Do not praise 10-21…10-23 as “flock healthy.” Keep implementers paused through recovery. Log that three recovered crons that open ~55 drafts/day are **worse** than a silent outage for merge-stop.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-08-31-001; MTD-2026-10-22-003  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next director ledger distinguishes outage vs pause vs recovered-mill; implementers stay disabled.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-10-24-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Triage the 648-draft leftover queue; do not merge-burst it after a 51-day freeze  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open PR count = **648** at first search, then this hour `#980`–`#993` (and climbing). Grew 482 (10-21 00:00) → 538 (10-22) → 596 (10-23) → 648+ → **#993 already open**. Prefix mix: ~400 docs, **30** skip-wipe, **23** advertised share-kit, **52** `fix(map)`, **12** WX extracts, **13** director roadmaps. Oldest #327 is CONFLICTING vs `0f5363f` (52 days). Only other CONFLICTING is #331. Humans have not merged `main` since 2026-09-03. Merging oldest-first would restack eight weeks of overlapping WX / mapGen / persist / combat PRs onto a freeze that was working.  
SYSTEMS_AFFECTED: GitHub merge queue; Caffeine import; `WorldExploration.tsx`; `mapGen.ts`; persist lock; `spellEngine.ts`  
RECOMMENDED_ACTION: Do not “clear the queue.” Close superseded director snapshots. Restack #327. Hold mills (map / skip-wipe / leftover-walk / Swap / combat-gate / share-kit / pack-enemy). Unique leftovers listed in MASTER_ROADMAP.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-24-002; MTD-2026-09-25-005  
REGRESSION_RISK: HIGH if the queue is merge-bursted  
VALIDATION_REQUIRED: `main` does not receive a multi-PR gameplay burst from #333–#981 or the 10-24 wave. Open count falls by closes, not by merging mills.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-10-24-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Halt must cover 06/12/18 hunter-implementer cadences, not only the 00:00 wave  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: 10-23 gameplay did not stop after midnight. Skip-wipe/map/share-kit continued at 06:11 (`#964/#965`), 08:15 (`#967/#969`), 12:10 (`#970/#971/#972/#973`), 16:11 (`#974`), 18:13 (`#976/#977/#978`), and 21:20 (`#979`). A dashboard pause that only disables 00:00 implementers would still leak the mill. Combined 10-23 non-docs = 24 of 52 PRs, most of them after 00:00.  
SYSTEMS_AFFECTED: 6h/8h/12h/18h automations; leftover skip-wipe / map / combat mills  
RECOMMENDED_ACTION: HUMAN_CONFIG: disable every implementer and hunter that opens `fix:` / `refactor:` PRs on frozen files, at every cron cadence. Report-only specialists may remain. Next director run must count PRs by hour, not only by midnight wave.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-08-31-001; MTD-2026-10-24-001  
REGRESSION_RISK: LOW for a pause; HIGH if only 00:00 is paused  
VALIDATION_REQUIRED: Next recovered day has ~0 gameplay PRs after 01:00 UTC, not just a quieter midnight.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-10-23-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Stop remount saveBattleStats skip-wipe clones; extract one hydrate-wipe guard after halt  
CATEGORY: persistence  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused; mill grew. Skip remount titles **22 → 30**. 10-23 added `#938` (rename/upgrade spend keep), `#964` (Doka wipe after shop/heal throw-after-accept), `#969` (death wipe after shop/heal throw), `#971` (Doka-heal double charge), `#977` (rename/upgrade wallet lie after shop/heal throw), `#979` (rename/upgrade wallet lie after victory Doka keep). Same shape as `#847/#854/#860/#864/#866/#869` and older `#330`-keep twins. Local patches are no longer sufficient. Distinct from `#391` (unpaid-death honour on GameKey redeem, still unwired in `shopPurchase.ts` 294–330).  
SYSTEMS_AFFECTED: `progressPersist.ts`; remount hydrate; `saveBattleStats`; Death Realm pending  
RECOMMENDED_ACTION: HOLD the 30 skip-wipe PRs. After halt, one shared guard that skips remount `saveBattleStats` wipe when a committed keep exists and unpaid death is absent. Close twins. Do not concatenate. Do not fold `#391` into this helper.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-24-001 (halt first)  
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
EVIDENCE: Reused; mill still standing. GitHub `advertised in:title` = **23** open drafts. 10-23 added `#947` (WX enemy DoT ticks), `#974` (pack-enemy buffStat). Adjacent pack-enemy mill: `#967` DoT decide, `#972` Inferno cooldown outside `damage>0`, `#978` buff decide. Growing `spellEngine.ts` / WX / enemyAI by one metadata field per cron is the combat mill’s standing shape. `applyHazardLanding` is still missing; Swap still teleports.  
SYSTEMS_AFFECTED: `spellEngine.ts`; `enemyAI.ts`; boss/summon kit tables; `WorldExploration.tsx`  
RECOMMENDED_ACTION: HOLD the share-kit and pack-enemy PRs. After halt, one helper that executes kits from advertised metadata with tests. Close twins. Do not concatenate. Hostile-summon empty-`spells` wiring (`#842/#861`) is a **separate** spawn fix after halt — do not fold it into the helper PR.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-24-001 (halt first)  
REGRESSION_RISK: HIGH if twins merge as concatenated copies; MEDIUM for a single helper  
VALIDATION_REQUIRED: `python3 scripts/check-duplicate-exports.py src/frontend/src` clean; kit execute matches advertised flags in unit tests; open `share .* advertised` count falls by close, not by merge-burst.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-09-25-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Unblock oldest-first so the living director index can land  
CATEGORY: process  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Oldest open PR is still **#327** (`CONFLICTING` / `dirty`, created 2026-09-02, now **52 days**). #331 also CONFLICTING. Twelve superseded director PRs plus this one all rewrite `MASTER_ROADMAP.md`. Stack-compat `--self` cannot insert a living index behind that queue.  
SYSTEMS_AFFECTED: `scripts/open-pr-stack-compat.sh`; GitHub merge button; `docs/automation/MASTER_ROADMAP.md`  
RECOMMENDED_ACTION: Restack #327 onto `0f5363f` or close it in favor of a fresh Striker PR **after** halt. Close #338/#402/#448/#509/#569/#618/#666/#718/#783/#814/#870/#946 without merge. Then this living index is merge-clean as the next docs item.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-09-21-003; MTD-2026-10-24-002  
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
EVIDENCE: Reused. Source chain is correct (`20260901_000000.mo` GameKey, `OldActor = {}`, `check-limit = 5`). Tracked `.old` is still Caffeine’s **2026-08-31** no-GameKey signature (grep GameKey = 0). Newest deployed snapshot on disk is `pr259-tail-20260901.most`. No evidence this run of a later successful Caffeine deploy. 51 days since `main` last moved.  
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
EVIDENCE: Reused. Oldest open PR, created 2026-09-02, `mergeable_state: dirty` vs `0f5363f`, now 52 days. Twin #370 adds AI kit-cast / summon and is still `MERGEABLE`. Do not merge #370 first.  
SYSTEMS_AFFECTED: `challengeCompletion.ts`; targeting; `WorldExploration.tsx`  
RECOMMENDED_ACTION: Restack #327 onto current `main`. Merge. Then union #370 unique delta only (MTD-2026-09-22-004).  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-24-001 (halt first)  
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
EVIDENCE: Reused. `mapGen.ts` is **1,937** lines on `main`. Open `fix(map)` count is **52**. 10-23 added `#933` boss minions, `#965` BOARD_CLAIM, `#970` Void Rift, `#976` generate-time lava/ice/spikes. #331 still CONFLICTING. Guardian `9dcfd122` RUNNING tonight.  
SYSTEMS_AFFECTED: `src/frontend/src/engine/mapGen.ts`; spawn/portal keep-clear  
RECOMMENDED_ACTION: HOLD every mapGen implementation PR. Guardian emits fixtures + ACTION_IDs only. Do not playtest-by-merging.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-10-24-001  
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
EVIDENCE: Reused. `996df6df` still not GetAutomation-visible. Volume problem remains the rest of the flock (47+ RUNNING this hour; 52 PRs yesterday including daytime clones).  
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
EVIDENCE: Reused. `1aa41c6c` (“Find Critical Gameplay Bugs”) is **enabled and RUNNING** this hour. 10-23 used daytime cadences to open skip-wipe `#964/#969/#971/#977/#979` and related clones.  
SYSTEMS_AFFECTED: leftover combat/persist mills  
RECOMMENDED_ACTION: Keep at most one enabled. Prefer report-only. Do not let it open skip-wipe or share-kit clones at any cadence.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: At most one critical-hunter automation enabled. Next run does not add skip-wipe twins from it.  
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
EVIDENCE: Reused. WX **19,213**. 10-21 opened `#831` (dust-mote extract) and `#842` (hostile summon kits). 10-22 opened `#901` (portal whirlpool extract). 10-23 opened `#961` (pixel-pattern paint extract). Complexity reduction `386a157d` RUNNING tonight.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`  
RECOMMENDED_ACTION: HOLD WX PRs except one-line helper wiring after halt (#327 restack, PREREQ-A, applyHazardLanding call site).  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-10-24-001  
REGRESSION_RISK: HIGH  
VALIDATION_REQUIRED: `main` WX line count does not grow; `#831/#842/#901/#961` stay unmerged.  
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
DEPENDENCIES: MTD-2026-10-24-001  
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
EVIDENCE: Reused. `redeemGameKeyThroughPersist` (`shopPurchase.ts` 294–330) still lock+grant with no unpaid-death call. `#391` drafts a helper and does **not** wire redeem. Skip-wipe mill (`#877`…`#979`) is a different hole — do not treat those twins as this wire.  
SYSTEMS_AFFECTED: GameKey redeem; death penalty; persist lock  
RECOMMENDED_ACTION: Merge `#391` helper after halt, then a separate one-line wire inside `redeemGameKeyThroughPersist`. Do not merge skip-wipe clones instead.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-24-001  
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
EVIDENCE: Reused. `buildEnemyKit` (`enemyAI.ts` 194–200) floors `levelZone: number`. Call site `WX` 11920 still passes `currentMap.levelZone`. Object constructed at `WX` 4683–4687. Number already at `currentZoneTier` (`WX` 1136 / 4680). Fifteenth director cycle. Unblocks “dynamic enemy spell pools” without an AI rewrite.  
SYSTEMS_AFFECTED: overworld enemy kits; `enemyAI.ts`; `WorldExploration.tsx`  
RECOMMENDED_ACTION: After halt, one call-site change + `enemyAI` test. No WX growth beyond that line. Do not retune kit contents.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-10-24-001; AQA-2026-08-30-007  
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
EVIDENCE: Reused. `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–718) returns true whenever `usableByPlayer !== false`. Hydrate loop still fills the book. Enemy-observed discovery and achievement/challenge/boss spell unlocks cannot ship on this shape. Requires a **new later** migration after deploy confirmation — not a stuffed NewActor.  
SYSTEMS_AFFECTED: spell library; discovery; admin catalog  
RECOMMENDED_ACTION: After P0 persist/deploy/ADR: ownership maps + starter seed. Do not implement Wave 15/16 spell catalogs first.  
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
EVIDENCE: Reused. No `recordTelemetry` / sidecar in `src/`. `longHorizonSim.telemetry.available === false`. TBC `#928` WAITING (twelfth inspection of this SHA). This hour `#981` is architecture docs only. Game-balance automation `3c083a4a` and dashboard `4b026695` are RUNNING tonight and must not retune or ship a Health tab.  
SYSTEMS_AFFECTED: future counters; AdminDashboard Health tab; TBC  
RECOMMENDED_ACTION: After halt + ADR: tiny isolated increment APIs, query-only or fire-and-forget **after** persist returns (never on `progressPersistRef`). No dashboard UI first. Keep `longHorizonSim.telemetry.available = false` until rows exist.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: AQA-2026-08-30-008; MTD-2026-10-24-001  
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
EVIDENCE: Reused. Confirmed this run. Keep `#333` as the first TBC leftover; later twins (`#395/#462/#502/#556/#609/#661/#833/#871/#928`) are dated copies. Tonight’s TBC `2786666f` and “Stralt game balance” `3c083a4a` are **different** automations — neither may retune.  
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
EVIDENCE: Reused. 10-23 expansion `#944`, elites `#941`, boss `#951`, spell `#953`, formations `#956`, AI `#958`, discovery `#962` already filed Wave 15/16 catalogs. Tonight: expansion `3f31b18f`, AI `67b03c2f`, boss `39040ad2`, dungeon `73740435`, Approved Design `fe5b679a`, spell mechanics `1330956a`, spell discovery `c26e5a83` all RUNNING; `#980` already opened. Core rules (discovery, DVA, zone kits, progressive AI) are still unwired.  
SYSTEMS_AFFECTED: enemyAI; boss kits; dungeon encounters; spell catalogs; AdminDashboard  
RECOMMENDED_ACTION: Design catalogs may exist unmerged. No implementation PRs until halt + #327 + landing helper + ADR + GameKey deploy confirmation.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-10-24-001; MTD-2026-09-21-002; AQA-2026-08-30-008  
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
EVIDENCE: Reused. This run writes `ACTION_IDS_2026-10-24.md` only. Does not append to 08-31, 09-01, 09-02, or 09-21…10-23 files.  
SYSTEMS_AFFECTED: `docs/automation/ACTION_IDS_*.md`  
RECOMMENDED_ACTION: Director = this dated file + living `MASTER_ROADMAP.md`. Specialists = `ACTION_IDS_<PREFIX>_YYYY-MM-DD.md`.  
AUTONOMY: AGENT_WITH_REVIEW  
DEPENDENCIES: none  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: This PR’s diff is `MASTER_ROADMAP.md` + `ACTION_IDS_2026-10-24.md` only.  
STATUS: OPEN  
