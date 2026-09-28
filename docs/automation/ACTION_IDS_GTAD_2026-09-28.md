# ACTION_IDs — Gameplay Telemetry Architecture Director 2026-09-28

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Gameplay Telemetry Architecture Director  
(`047ac8a1-a4a0-11f1-a7d1-d6b4613131ce`).  
Design contract: [`TELEMETRY_ARCHITECTURE_2026-09-28.md`](./TELEMETRY_ARCHITECTURE_2026-09-28.md).

**Do not re-implement from stale line numbers.** Phase 0/1 tickets remain  
`GTAD-2026-09-01-001`…`014` in [`ACTION_IDS_GTAD_2026-09-01.md`](./ACTION_IDS_GTAD_2026-09-01.md)  
(policy still NEW, not shipped). This run adds **deltas only** (383-PR stack fence, extra persist-PR deferral, sibling WAITING caption).

This run ships **docs only**. Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID.

`main` HEAD is still `0f5363f`. Unmerged GTAD designs on the same SHA:  
**#352** (09-21), **#422** (09-22), **#450** (09-23), **#527** (09-24),  
**#583** (09-25), **#641** (09-26), **#682** (09-27). Unique 09-28 filenames  
must not overwrite those unique files.

---

ACTION_ID: GTAD-2026-09-28-001  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Privacy fence — GameKey email, ledger codes, redeemedBy, and OQL gameKeyRequests stay off Intelligence  
CATEGORY: privacy  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Re-read on `0f5363f`. `GameKeyRequest` still stores `email` and `redeemedBy` (`types/admin.mo` 221–234). OQL entity `gameKeyRequests` payloads include `userPrincipal` and `email` (`main.mo` 3781–3796). `adminGetGameKeyReveal` returns the 120-char code. `getAllCharacters` (`main.mo` 532) dumps principals + names. `getLeaderboard` (`main.mo` 3390) returns `principalId`. `chatMessages` is in-memory (`main.mo` 2604). Purchases tab is fulfillment, not analytics. Mandate forbids identifiable Intelligence cells.  
SYSTEMS_AFFECTED: future telemetry maps; Admin Intelligence tab; OQL (do not add owner-keyed event entities); do not call `adminListGameKeyRequests` / `adminGetGameKeyReveal` / `getAllCharacters` / `getLeaderboard` from Intelligence  
RECOMMENDED_ACTION: Phase 0 GameKey snapshot may return **status histogram only** (pending/approved/redeemed/rejected counts). Never persist chat text, GameKey codes, emails, `uiLayout`, pixel patterns, click traces, or purchase KYC. Never reuse `getLeaderboard`, `getAllCharacters`, or OQL `gameKeyRequests` as an analytics wire format.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: GTAD-2026-09-01-001 (still NEW; this ID reaffirms it after the 383-PR queue grew)  
REGRESSION_RISK: LOW if followed; HIGH if someone charts OQL GameKey rows in the browser.  
VALIDATION_REQUIRED: Intelligence responses contain no principal, display name, email, GameKey, or message body.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-09-28-002  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Fail-open sidecar — never on the persist lock (including beforeEach and one-shot keep)  
CATEGORY: architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `createProgressPersist` still serializes `applyRewards` / `saveBattleStats` / GameKey redeem. `beforeEach` flushes unpaid death (`progressPersist.ts` 223–228). One-shot `settleOneShotAfterCredit` (`dokaPersist.ts` 144–152) must `keep` on transport miss. AQA-012 enqueue-on-lock wording is still a wallet-race hazard. `handleBattleEnd` already shows recap (**12517**) then persist in a separate `try/catch` (**12611**).  
SYSTEMS_AFFECTED: `utils/progressPersist.ts`; `utils/dokaPersist.ts`; future `recordTelemetryIncrements`; WorldExploration outcome paths; Quality Auditor prompt  
RECOMMENDED_ACTION: Implement increments as fire-and-forget after persist functions return. Swallow all sidecar errors. Do not enqueue telemetry on `progressPersistRef` or inside `beforeEach`. Do not release a one-shot `keep` because the sidecar threw. Do not write HP/XP/Doka/spell levels from telemetry. Missing method on the mock actor = no-op.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: GTAD-2026-09-01-002; GTAD-2026-09-27-002  
REGRESSION_RISK: HIGH if ignored (wallet races, remint, unpaid victories).  
VALIDATION_REQUIRED: Existing persist / one-shot / death unit tests still pass with a throwing/missing increment API; a sidecar throw does not skip `applyRewards` or release a keep.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-09-28-003  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Telemetry Motoko/sidecar must not hitchhike the 383-PR oldest-first queue; unique 09-28 files must not overwrite GTAD siblings  
CATEGORY: process  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: **383** still-open PRs targeting `main` (createdAt ascending, 2026-09-28 ~00:10 UTC). Oldest **#327** (Striker / WX) then **#331** (portal destack / WX / mapGen / persist). Unmerged GTAD designs **#352 / #422 / #450 / #527 / #583 / #641 / #682**. New `telemetryLifetime` / `telemetryDay` maps need a **later** migration file after frozen `20260901`, bindgen, mock shape, `check-limit` 5→6, and `check-eop-stables.py`. Caffeine `.old` stays the Aug-31 no-GameKey signature.  
SYSTEMS_AFFECTED: future Motoko/sidecar PR; stack-compat CI  
RECOMMENDED_ACTION: Keep this architecture PR docs-only. Land Phase 0/1 in a dedicated PR after #327/#331 (or a human-unioned restack). After older queue items merge, re-read EVENT_SOURCE line numbers. Run `bash scripts/open-pr-stack-compat.sh --self`. Unique 09-28 filenames must not replace #352/#422/#450/#527/#583/#641/#682 unique files.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: GTAD-2026-09-27-003; GTAD-2026-09-21-005  
REGRESSION_RISK: HIGH if WX/persist files are edited in the same PR as #327/#331 without union.  
VALIDATION_REQUIRED: `open-pr-stack-compat.sh --self` exit 0, or documented that remaining conflicts are older siblings (not this unique delta).  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-09-28-004  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Q-018 throw-after-mutation notes stay deferred — extra persist PRs #698/#705/#710 are also not EVENT_SOURCE; do not relocate C-002/#652, N-003/#714, or Q-005/#693  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: On main, `noteUnconfirmedCredit` is already called from one-shot settle (`dokaPersist.ts` 217–239); that path is Q-015 keep + Q-016 `shouldSkipAbsoluteDokaWrite` (`progressPersist.ts` 202–212). Open persist PRs listed in 09-27-004 remain unmerged. After 09-27 cron: **#698** skip `saveBattleStats` wipe after death-cut keep stale fetch, **#705** skip wipe after death-cut then confirmed credit, **#710** skip wipe after death-cut credit remount replay. Combat **#652** (refuse victory when live HP is 0) and **#714** (fail Pacifist after offensive kit casts) are unmerged — C-002 stays `handleBattleEnd(true)` after recap **12517**, N-003 stays `isChallengeCompleted` on `main`. Recap a11y **#693** (Escape-only dismiss) is unmerged — Q-005 stays five `onClose` sites (`PostBattleRecap.tsx` 67–68 / 93–96 / 98–111 / 208 / 609), increment once. Plague-zone lethal **does** call `_handlePlayerDeath` (`WX` 14326–14331) while lava/spike HP-watch still does not (13316+).  
SYSTEMS_AFFECTED: future sidecar flush after persist-note helpers; Q-015 / Q-016 / Q-018; C-002 victory increment; C-007 death-cause tagging; Q-005 recap dismiss; N-003 challenge funnel  
RECOMMENDED_ACTION: Do not implement Q-018 against unmerged branches. After persist helpers merge, increment `quality.persist.throw_after.{credit|spend}` **after** the note helper returns, off the lock. Never double-count the live one-shot keep as Q-018. Never release a keep because the sidecar threw. Never invent spend-note helpers in a telemetry PR. Do not relocate C-002 onto #652, N-003 onto #714, or Q-005 onto #693 until those are on `main`. Tag C-007 `plague` from the linchpin caller; do not merge HP-watch into `_handlePlayerDeath` solely for lava/spikes.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: GTAD-2026-09-27-004; GTAD-2026-09-21-006; merge of persist PRs listed in EVIDENCE (or equivalent on main)  
REGRESSION_RISK: HIGH if someone forks persist helpers in the telemetry PR, counts unmerged APIs as live, unifies death persist to make a metric easier, or credits victories / challenge fails that #652/#714 would refuse.  
VALIDATION_REQUIRED: Existing dokaPersist / progressPersist / death tests still pass with a throwing sidecar; Q-018 keys absent until the note helpers exist on main; plague lethal still applies one 20/40; C-002 still fires after recap on `main`; Q-005 still one increment despite five UI paths.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-09-28-005  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Point Quality Auditor, Balance Analyst, Dashboard Designer, and longHorizonSim at the 09-28 contract — stay WAITING until Phase 0/1  
CATEGORY: prompt-architecture  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `longHorizonSim.ts` 532–536 still sets `telemetry.available: false`. No sidecar in `src/`. Admin tabs (`gameTypes.ts` 483–498) have no intelligence/health. Cursor Cloud Automations have no prompt write API. TBC reports must remain WAITING_FOR_TELEMETRY — open **#661** already repeats that for 2026-09-27. AQA-012 shop site is GameKey + `shouldCommitGameKeyRedeem`. Q-015/Q-016/Q-018 are proposed, not live. Unmerged #333/#395/#462/#502/#556/#609/#661 are TBC WAITING reports. Unmerged #345/#424/#455/#504/#559/#616/#668 are dashboard matrices; **#668** skipped a seventh Health matrix because collectors are still absent.  
SYSTEMS_AFFECTED: Quality Auditor prompt; Balance Analyst; Dashboard Designer; `utils/longHorizonSim.ts` (do not flip `available` in this docs PR)  
RECOMMENDED_ACTION: UPDATE_PROMPT (human, dashboard): read `docs/automation/TELEMETRY_ARCHITECTURE_2026-09-28.md`. If increment/snapshot APIs are absent, repeat INCONCLUSIVE / WAITING. If present, cite persist-ok/fail, victory-paid, death-penalty, recap open/dismiss (one increment despite five UI paths on `main`), GameKey redeem via `shouldCommitGameKeyRedeem`, death-replay, one-shot settle, absolute-write skip, plague vs lava/spike death causes, and snapshot level histogram. Never treat a missing increment as a player regression. Never require persist-lock enqueue. Never treat `processPendingPurchases` volume as shop health. Keep `longHorizonSim.telemetry.available = false` until APIs exist and are populated. This run cannot edit dashboard prompts.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: GTAD-2026-09-01-003 or GTAD-2026-09-01-004 merged before sibling audits have numbers  
REGRESSION_RISK: LOW.  
VALIDATION_REQUIRED: Next auditor/balance/dashboard report either cites real counters or explicitly says “still no telemetry.”  
STATUS: NEW  

---

## Still NEW (do not re-file)

Implementers should execute these 09-01 IDs against **09-28 line numbers** (same SHA as 09-21 through 09-27; re-read this cron):

| ID | Title (short) | 09-28 note |
| :--- | :--- | :--- |
| GTAD-2026-09-01-001 | Aggregates only; no principals | Extended by 09-02-001, 09-27-001, 09-28-001 |
| GTAD-2026-09-01-002 | Fail-open sidecar; not on persist lock | Extended by 09-27-002 / 09-28-002 (`beforeEach` + one-shot keep) |
| GTAD-2026-09-01-003 | Phase 0 snapshot buckets | `getAllCharacters` now `main.mo` 532; optional GameKey **status** histogram |
| GTAD-2026-09-01-004 | Phase 1 outcome + quality hooks | Shop hook = 09-21-003; recap dismiss = **09-22-003** (five paths on `main`; #693 not live); add Q-015/Q-016; Q-018 deferred via 09-28-004 |
| GTAD-2026-09-01-005 | Tag flee vs combat vs lava/spike | Flee `WX` 18935; HP-watch 13316 still a second persist entry (recap 13355); plague 14331 is a linchpin caller (C-007 `plague`) |
| GTAD-2026-09-01-006 | Phase 2 combat/spell/content dims | Family roll = `spawnPolicy.ts`; overwrite `WX` 11873; E-008 summoner 11932 |
| GTAD-2026-09-01-007 | Intelligence tab, honest empty state | Distinct from Purchases GameKey inbox; not combatant `intelligence`; TADD #668 skipped Health |
| GTAD-2026-09-01-008 | Do not invent spell-discovery persist | `ownedSpells` still catalog grant (WX 2412) |
| GTAD-2026-09-01-009 | Defer sequences / intent / URLs / world-features | Plus Enemy Register lore (N-008); world-feature catalogs still not WX importers |
| GTAD-2026-09-01-010 | Sibling prompts stay WAITING | Citation path superseded by 09-28-005 |
| GTAD-2026-09-01-011 | Keep increment maps off OQL | Do not OQL-expose telemetry or `gameKeyLedger` |
| GTAD-2026-09-01-012 | Sidecar outside WorldExploration | WX is still **19,213** lines |
| GTAD-2026-09-01-013 | Import gate on Motoko/mocks | Plus EOP later-file after frozen `20260901` |
| GTAD-2026-09-01-014 | Family-variant / enemy-only extras | Plus E-008; still no elite_patrol; family site = spawnPolicy |

09-02 IDs still NEW (do not re-file; prefer later IDs where they overlap):

| ID | Prefer instead when implementing |
| :--- | :--- |
| GTAD-2026-09-02-001 | 09-28-001 (same fence) |
| GTAD-2026-09-02-002 | **09-21-003** (`shouldCommitGameKeyRedeem`) |
| GTAD-2026-09-02-003 | Still valid (unpaid death replay Q-014); `beforeEach` note in 09-28-002 |
| GTAD-2026-09-02-004 | 09-21-007 (spawnPolicy + N-008) |
| GTAD-2026-09-02-005 | Still valid (audit log is ops) |
| GTAD-2026-09-02-006 | **09-21-005** (#259 merged; later-file after 20260901) |
| GTAD-2026-09-02-007 | 09-28-005 (citation path) |

09-21 IDs still NEW on unmerged PR #352 (do not re-file):

| ID | Prefer instead when implementing |
| :--- | :--- |
| GTAD-2026-09-21-001 | 09-28-001 |
| GTAD-2026-09-21-002 | 09-28-002 |
| GTAD-2026-09-21-003 | Still the GameKey predicate ID (`shouldCommitGameKeyRedeem`) |
| GTAD-2026-09-21-004 | Still Q-015/Q-016; Q-018 is 09-28-004 |
| GTAD-2026-09-21-005 | Still the EOP later-file ID |
| GTAD-2026-09-21-006 | Dual-death persist entries; plague linchpin tag still in force |
| GTAD-2026-09-21-007 | Still family/summoner/Register scope |
| GTAD-2026-09-21-008 | **09-28-003** (queue is now 383 PRs) |
| GTAD-2026-09-21-009 | **09-22-003** (five onClose sites on `main`; #693 not live) |
| GTAD-2026-09-21-010 | 09-28-005 |

09-22 / 09-23 / 09-24 / 09-25 / 09-26 / 09-27 IDs still NEW on unmerged PRs #422 / #450 / #527 / #583 / #641 / #682 (do not re-file; prefer 09-28 where they overlap):

| ID | Prefer instead when implementing |
| :--- | :--- |
| GTAD-2026-09-22-001 / 09-23-001 / 09-24-001 / 09-25-001 / 09-26-001 / 09-27-001 | 09-28-001 |
| GTAD-2026-09-22-002 / 09-23-002 / 09-24-002 / 09-25-002 / 09-26-002 / 09-27-002 | 09-28-002 |
| GTAD-2026-09-22-003 | Still the recap five-path ID (re-verified on `main`; do not mint a twin; do not relocate onto #693) |
| GTAD-2026-09-22-004 / 09-23-003 / 09-24-003 / 09-25-003 / 09-26-003 / 09-27-003 | **09-28-003** (queue 79 → 383) |
| GTAD-2026-09-22-005 / 09-23-004 / 09-24-004 / 09-25-004 / 09-26-004 / 09-27-004 | **09-28-004** (extra persist PRs #698/#705/#710; #652/#714/#693 not live EVENT_SOURCE) |
| GTAD-2026-09-22-006 / 09-23-005 / 09-24-005 / 09-25-005 / 09-26-005 / 09-27-005 | 09-28-005 |
