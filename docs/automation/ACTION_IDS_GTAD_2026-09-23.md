# ACTION_IDs — Gameplay Telemetry Architecture Director 2026-09-23

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Gameplay Telemetry Architecture Director  
(`047ac8a1-a4a0-11f1-a7d1-d6b4613131ce`).  
Design contract: [`TELEMETRY_ARCHITECTURE_2026-09-23.md`](./TELEMETRY_ARCHITECTURE_2026-09-23.md).  

**Do not re-implement from stale line numbers.** Phase 0/1 tickets remain  
`GTAD-2026-09-01-001`…`014` in [`ACTION_IDS_GTAD_2026-09-01.md`](./ACTION_IDS_GTAD_2026-09-01.md)  
(policy still NEW, not shipped). 09-02 deltas in [`ACTION_IDS_GTAD_2026-09-02.md`](./ACTION_IDS_GTAD_2026-09-02.md)  
are still NEW. 09-21 deltas live on unmerged PR **#352**. 09-22 deltas live on  
unmerged PR **#422**. This run adds **deltas only** (116-PR stack fence, extra  
persist-PR deferral). Recap five-path list is re-verified, not re-filed as a  
new recap ID.

This run ships **docs only**. Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID.

HEAD inspected: `0f5363f` (unchanged since 09-21). Oldest still-open PRs at this cron: **#327** then **#331**, then #333–#446 (**116** open).

---

ACTION_ID: GTAD-2026-09-23-001  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Privacy fence — aggregates only; GameKey email, OQL, leaderboard, and getAllCharacters stay off Intelligence  
CATEGORY: privacy  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Mandate forbids individual surveillance. Re-read on `0f5363f`: `getLeaderboard` returns `principalId` (`main.mo` 3390). `getAllCharacters` (`main.mo` 532) dumps every Principal + `Character.name` and is unused by AdminDashboard. OQL `gameKeyRequests` payloads include `userPrincipal` and `email` (`main.mo` 3781–3796). `GameKeyRequest.email` / `redeemedBy` (`types/admin.mo` 221–234). `adminGetGameKeyReveal` is copy-once ops. Chat is in-memory (`sendMessage` 2610). `PurchaseRecord` still holds KYC fields (202–217). Same SHA as 09-21/09-22; fence reaffirmed.  
SYSTEMS_AFFECTED: future telemetry maps; Admin Intelligence tab; OQL (do not add owner-keyed event entities); do not call `getAllCharacters` / `adminListGameKeyRequests` / `adminGetGameKeyReveal` from Intelligence  
RECOMMENDED_ACTION: Phase 0 snapshots return **buckets only**. GameKey snapshot = status histogram only. Never persist chat text, GameKey codes, emails, `uiLayout`, pixel patterns, click traces, or purchase KYC. Never reuse leaderboard / OQL / getAllCharacters as an analytics wire format.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: GTAD-2026-09-01-001; GTAD-2026-09-02-001; GTAD-2026-09-22-001 (still NEW; this ID refreshes the citation path)  
REGRESSION_RISK: LOW if followed; HIGH if someone charts OQL GameKey rows in the browser.  
VALIDATION_REQUIRED: Intelligence responses contain no principal, display name, email, GameKey, or message body.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-09-23-002  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Fail-open sidecar stays off the persist lock — including beforeEach death flush and one-shot settle  
CATEGORY: architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `createProgressPersist` serializes credits, `saveBattleStats`, GameKey redeem, and optional `beforeEach` unpaid-death flush (`progressPersist.ts` 223–252). `AQA-2026-08-30-012` still says counters “must enqueue on createProgressPersist or be query-only.” Query-only is correct. Enqueue-on-lock (including `beforeEach`) is a wallet-race hazard. Victory recap is already shown before persist (`WX` 12517 then catch 12611 “non-blocking”). One-shot `keep` must remain `keep` if telemetry throws (`dokaPersist.ts` 144–152). Re-read 2026-09-23; same SHA as 09-22.  
SYSTEMS_AFFECTED: `utils/progressPersist.ts`; future `recordTelemetryIncrements`; outcome helpers after they return; Quality Auditor prompt  
RECOMMENDED_ACTION: Implement increments as fire-and-forget after persist / settle / flush functions return. Swallow all sidecar errors. Do not enqueue telemetry on `progressPersistRef`. Do not write HP/XP/Doka/spell levels from telemetry. Missing method on the mock actor = no-op. Treat AQA-012’s enqueue clause as superseded.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: GTAD-2026-09-01-002; GTAD-2026-09-22-002  
REGRESSION_RISK: HIGH if ignored (wallet races, unpaid victories, one-shot remint).  
VALIDATION_REQUIRED: Existing persist / dokaPersist / deathPenalty unit tests still pass with a throwing/missing increment API; a sidecar throw does not skip `applyRewards`, release a one-shot claim, or skip `shouldSkipAbsoluteDokaWrite`.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-09-23-003  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Do not hitchhike telemetry onto the 116-PR oldest-first queue; union README; #352 and #422 are GTAD siblings  
CATEGORY: process  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Oldest still-open PRs targeting main (createdAt ascending, 2026-09-23 00:03 UTC): #327 Striker AoE, #331 portal destack, then #333–#446 (**116** open). Unmerged GTAD designs: #352 (`TELEMETRY_ARCHITECTURE_2026-09-21.md`) and #422 (`TELEMETRY_ARCHITECTURE_2026-09-22.md`). Telemetry stables need bindgen/mocks — do not land them on #327/#331/#340/#356/#375/#377/#379/#387/#389/#391/#426/#431/#435/#439/#445. This docs PR adds unique 09-23 files and README index rows that must **union** with older docs PRs, not overwrite. Pre-existing queue breaks (#389 WX, #392 ChatPanel) are not this unique delta.  
SYSTEMS_AFFECTED: future Motoko/sidecar PR; stack-compat CI; README.md index  
RECOMMENDED_ACTION: Keep this architecture PR docs-only. Land Phase 0/1 in a dedicated PR after #327/#331 (or a human-unioned restack). After older queue items merge, re-read EVENT_SOURCE line numbers. Run `bash scripts/open-pr-stack-compat.sh --self`. Unique 09-23 filenames must not replace #352/#422 unique files.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: GTAD-2026-09-21-008; GTAD-2026-09-22-004  
REGRESSION_RISK: HIGH if WX/persist files are edited in the same PR as #327/#331 without union.  
VALIDATION_REQUIRED: `open-pr-stack-compat.sh --self` exit 0, or documented that remaining conflicts are older siblings (not this unique delta).  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-09-23-004  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Q-018 throw-after-mutation notes stay deferred — extra persist PRs #426/#431/#435/#439/#445 are also not EVENT_SOURCE  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: On main, `noteUnconfirmedCredit` is already called from one-shot settle (`dokaPersist.ts` 217–239); that path is Q-015 keep + Q-016 `shouldSkipAbsoluteDokaWrite` (progressPersist.ts 202–212). Open PRs #375 / #377 / #387 / #391 still propose additional throw-after-credit/debit notes. After 09-22 cron: #426 skipBeforeEach death recut, #431/#439 unseeded HUD Doka, #435 flushed GameKey/feat vs first hydrate, #445 respawn HP after unpaid-death remount. Those helpers are **not** on `0f5363f`.  
SYSTEMS_AFFECTED: future sidecar flush after persist-note helpers; Q-015 / Q-016 / Q-018  
RECOMMENDED_ACTION: Do not implement Q-018 against unmerged branches. After persist helpers merge, increment `quality.persist.throw_after.{credit|spend}` **after** the note helper returns, off the lock. Never double-count the live one-shot keep as Q-018. Never release a keep because the sidecar threw. Never invent spend-note helpers in a telemetry PR.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: GTAD-2026-09-22-005; merge of persist PRs listed in EVIDENCE (or equivalent on main)  
REGRESSION_RISK: HIGH if someone forks persist helpers in the telemetry PR or counts unmerged APIs as live.  
VALIDATION_REQUIRED: Existing dokaPersist / progressPersist tests still pass with a throwing sidecar; Q-018 keys absent until the note helpers exist on main.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-09-23-005  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Point Quality Auditor, Balance Analyst, Dashboard Designer, and longHorizonSim at the 09-23 contract — stay WAITING until Phase 0/1  
CATEGORY: prompt-architecture  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `longHorizonSim.ts` 532–536 still sets `telemetry.available: false`. No sidecar in `src/`. Admin tabs (`gameTypes.ts` 483–498; `AdminDashboard.tsx` 5611–5625) have no intelligence/health. Cursor Cloud Automations have no prompt write API. TBC reports must remain WAITING_FOR_TELEMETRY. AQA-012 shop site is GameKey + `shouldCommitGameKeyRedeem`. Q-015/Q-016/Q-018 are proposed, not live. Unmerged #333/#395 are TBC WAITING reports. Unmerged #345/#424 are dashboard matrices.  
SYSTEMS_AFFECTED: Quality Auditor prompt; Balance Analyst; Dashboard Designer; `utils/longHorizonSim.ts` (do not flip `available` in this docs PR)  
RECOMMENDED_ACTION: UPDATE_PROMPT (human, dashboard): read `docs/automation/TELEMETRY_ARCHITECTURE_2026-09-23.md`. If increment/snapshot APIs are absent, repeat INCONCLUSIVE / WAITING. If present, cite persist-ok/fail, victory-paid, death-penalty, recap open/dismiss (one increment despite five UI paths), GameKey redeem via `shouldCommitGameKeyRedeem`, death-replay, one-shot settle, absolute-write skip, and snapshot level histogram. Never treat a missing increment as a player regression. Never require persist-lock enqueue. Never treat `processPendingPurchases` volume as shop health. Keep `longHorizonSim.telemetry.available = false` until APIs exist and are populated. This run cannot edit dashboard prompts.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: GTAD-2026-09-01-003 or GTAD-2026-09-01-004 merged before sibling audits have numbers  
REGRESSION_RISK: LOW.  
VALIDATION_REQUIRED: Next auditor/balance/dashboard report either cites real counters or explicitly says “still no telemetry.”  
STATUS: NEW  

---

## Still NEW (do not re-file)

Implementers should execute these 09-01 IDs against **09-23 line numbers** (same SHA as 09-21/09-22; re-read this cron):

| ID | Title (short) | 09-23 note |
| :--- | :--- | :--- |
| GTAD-2026-09-01-001 | Aggregates only; no principals | Extended by 09-02-001, 09-22-001, 09-23-001 |
| GTAD-2026-09-01-002 | Fail-open sidecar; not on persist lock | Extended by 09-22-002 / 09-23-002 (`beforeEach` + one-shot keep) |
| GTAD-2026-09-01-003 | Phase 0 snapshot buckets | `getAllCharacters` now `main.mo` 532; optional GameKey **status** histogram |
| GTAD-2026-09-01-004 | Phase 1 outcome + quality hooks | Shop hook = 09-21-003; recap dismiss = **09-22-003** (five paths, re-verified); add Q-015/Q-016; Q-018 deferred via 09-23-004 |
| GTAD-2026-09-01-005 | Tag flee vs combat vs lava/spike | Flee `WX` 18935; HP-watch 13316 still a second entry |
| GTAD-2026-09-01-006 | Phase 2 combat/spell/content dims | Family roll = `spawnPolicy.ts`; overwrite `WX` 11873; E-008 summoner 11932 |
| GTAD-2026-09-01-007 | Intelligence tab, honest empty state | Distinct from Purchases GameKey inbox; not combatant `intelligence` |
| GTAD-2026-09-01-008 | Do not invent spell-discovery persist | `ownedSpells` still catalog grant (WX 2412) |
| GTAD-2026-09-01-009 | Defer sequences / intent / URLs / world-features | Plus Enemy Register lore (N-008) |
| GTAD-2026-09-01-010 | Sibling prompts stay WAITING | Citation path superseded by 09-23-005 |
| GTAD-2026-09-01-011 | Keep increment maps off OQL | Do not OQL-expose telemetry or `gameKeyLedger` |
| GTAD-2026-09-01-012 | Sidecar outside WorldExploration | WX is still **19,213** lines |
| GTAD-2026-09-01-013 | Import gate on Motoko/mocks | Plus EOP later-file after frozen `20260901` |
| GTAD-2026-09-01-014 | Family-variant / enemy-only extras | Plus E-008; still no elite_patrol; family site = spawnPolicy |

09-02 IDs still NEW (do not re-file; prefer later IDs where they overlap):

| ID | Prefer instead when implementing |
| :--- | :--- |
| GTAD-2026-09-02-001 | 09-23-001 (same fence) |
| GTAD-2026-09-02-002 | **09-21-003** (`shouldCommitGameKeyRedeem`) |
| GTAD-2026-09-02-003 | Still valid (unpaid death replay Q-014); `beforeEach` note in 09-23-002 |
| GTAD-2026-09-02-004 | 09-21-007 (spawnPolicy + N-008) |
| GTAD-2026-09-02-005 | Still valid (audit log is ops) |
| GTAD-2026-09-02-006 | **09-21-005** (#259 merged; later-file after 20260901) |
| GTAD-2026-09-02-007 | 09-23-005 (citation path) |

09-21 IDs still NEW on unmerged PR #352 (do not re-file):

| ID | Prefer instead when implementing |
| :--- | :--- |
| GTAD-2026-09-21-001 | 09-23-001 |
| GTAD-2026-09-21-002 | 09-23-002 |
| GTAD-2026-09-21-003 | Still the GameKey predicate ID (`shouldCommitGameKeyRedeem`) |
| GTAD-2026-09-21-004 | Still Q-015/Q-016; Q-018 is 09-23-004 |
| GTAD-2026-09-21-005 | Still the EOP later-file ID |
| GTAD-2026-09-21-006 | Still dual-death |
| GTAD-2026-09-21-007 | Still family/summoner/Register scope |
| GTAD-2026-09-21-008 | **09-23-003** (queue is now 116 PRs) |
| GTAD-2026-09-21-009 | **09-22-003** (five onClose sites; re-verified this run, not re-filed) |
| GTAD-2026-09-21-010 | 09-23-005 |

09-22 IDs still NEW on unmerged PR #422 (do not re-file; prefer 09-23 where they overlap):

| ID | Prefer instead when implementing |
| :--- | :--- |
| GTAD-2026-09-22-001 | 09-23-001 |
| GTAD-2026-09-22-002 | 09-23-002 |
| GTAD-2026-09-22-003 | Still the recap five-path ID (re-verified; do not mint a twin) |
| GTAD-2026-09-22-004 | **09-23-003** (queue 79 → 116) |
| GTAD-2026-09-22-005 | **09-23-004** (extra persist PRs) |
| GTAD-2026-09-22-006 | 09-23-005 |
