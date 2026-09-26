# ACTION_IDs — Gameplay Telemetry Architecture Director 2026-09-26

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Gameplay Telemetry Architecture Director  
(`047ac8a1-a4a0-11f1-a7d1-d6b4613131ce`).  
Design contract: [`TELEMETRY_ARCHITECTURE_2026-09-26.md`](./TELEMETRY_ARCHITECTURE_2026-09-26.md).  

**Do not re-implement from stale line numbers.** Phase 0/1 tickets remain  
`GTAD-2026-09-01-001`…`014` in [`ACTION_IDS_GTAD_2026-09-01.md`](./ACTION_IDS_GTAD_2026-09-01.md)  
(policy still NEW, not shipped). 09-02 deltas in [`ACTION_IDS_GTAD_2026-09-02.md`](./ACTION_IDS_GTAD_2026-09-02.md)  
are still NEW. Unmerged later ledgers: **#352** (09-21), **#422** (09-22), **#450** (09-23),  
**#527** (09-24), **#583** (09-25). This run adds **deltas only** (306-PR stack fence, extra  
persist-PR deferral, plague-zone linchpin tag on existing C-007). Recap five-path  
list is re-verified, not re-filed as a new recap ID. **No new metric IDs.**

This run ships **docs only**. Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID.

HEAD inspected: `0f5363f` (unchanged since 09-21). Oldest still-open PRs at this cron: **#327** then **#331**, then #333–#636 (**306** open).

---

ACTION_ID: GTAD-2026-09-26-001  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Privacy fence — aggregates only; GameKey email, OQL, leaderboard, and getAllCharacters stay off Intelligence  
CATEGORY: privacy  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Mandate forbids individual surveillance. Re-read on `0f5363f`: `getLeaderboard` returns `principalId` (`main.mo` 3390). `getAllCharacters` (`main.mo` 532) dumps every Principal + `Character.name` and is unused by AdminDashboard. OQL `gameKeyRequests` payloads include `userPrincipal` and `email` (`main.mo` 3781–3796). `GameKeyRequest.email` / `redeemedBy` (`types/admin.mo` 221–234). `adminGetGameKeyReveal` is copy-once ops. Chat is in-memory (`sendMessage` 2610). `PurchaseRecord` still holds KYC fields (202–217). Same SHA as 09-21 through 09-25; fence reaffirmed.  
SYSTEMS_AFFECTED: future telemetry maps; Admin Intelligence tab; OQL (do not add owner-keyed event entities); do not call `getAllCharacters` / `adminListGameKeyRequests` / `adminGetGameKeyReveal` from Intelligence  
RECOMMENDED_ACTION: Phase 0 snapshots return **buckets only**. GameKey snapshot = status histogram only. Never persist chat text, GameKey codes, emails, `uiLayout`, pixel patterns, click traces, or purchase KYC. Never reuse leaderboard / OQL / getAllCharacters as an analytics wire format.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: GTAD-2026-09-01-001; GTAD-2026-09-02-001; GTAD-2026-09-25-001 (still NEW; this ID refreshes the citation path)  
REGRESSION_RISK: LOW if followed; HIGH if someone charts OQL GameKey rows in the browser.  
VALIDATION_REQUIRED: Intelligence responses contain no principal, display name, email, GameKey, or message body.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-09-26-002  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Fail-open sidecar stays off the persist lock — including beforeEach death flush and one-shot settle  
CATEGORY: architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `createProgressPersist` serializes credits, `saveBattleStats`, GameKey redeem, and optional `beforeEach` unpaid-death flush (`progressPersist.ts` 223–252). `AQA-2026-08-30-012` still says counters “must enqueue on createProgressPersist or be query-only.” Query-only is correct. Enqueue-on-lock (including `beforeEach`) is a wallet-race hazard. Victory recap is already shown before persist (`WX` 12517 then catch 12611 “non-blocking”). One-shot `keep` must remain `keep` if telemetry throws (`dokaPersist.ts` 144–152). Re-read 2026-09-26; same SHA as 09-25.  
SYSTEMS_AFFECTED: `utils/progressPersist.ts`; future `recordTelemetryIncrements`; outcome helpers after they return; Quality Auditor prompt  
RECOMMENDED_ACTION: Implement increments as fire-and-forget after persist / settle / flush functions return. Swallow all sidecar errors. Do not enqueue telemetry on `progressPersistRef`. Do not write HP/XP/Doka/spell levels from telemetry. Missing method on the mock actor = no-op. Treat AQA-012’s enqueue clause as superseded.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: GTAD-2026-09-01-002; GTAD-2026-09-25-002  
REGRESSION_RISK: HIGH if ignored (wallet races, unpaid victories, one-shot remint).  
VALIDATION_REQUIRED: Existing persist / dokaPersist / deathPenalty unit tests still pass with a throwing/missing increment API; a sidecar throw does not skip `applyRewards`, release a one-shot claim, or skip `shouldSkipAbsoluteDokaWrite`.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-09-26-003  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Do not hitchhike telemetry onto the 306-PR oldest-first queue; unique files must not overwrite GTAD siblings #352/#422/#450/#527/#583  
CATEGORY: process  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Oldest still-open PRs targeting main (createdAt ascending, 2026-09-26 ~00:16 UTC): #327 Striker AoE, #331 portal destack, then #333–#636 (**306** open). Unmerged GTAD designs: #352 (`TELEMETRY_ARCHITECTURE_2026-09-21.md`), #422 (`TELEMETRY_ARCHITECTURE_2026-09-22.md`), #450 (`TELEMETRY_ARCHITECTURE_2026-09-23.md`), #527 (`TELEMETRY_ARCHITECTURE_2026-09-24.md`), #583 (`TELEMETRY_ARCHITECTURE_2026-09-25.md`). Telemetry stables need bindgen/mocks — do not land them on #327/#331/#340/#356 or later persist/combat PRs through **#604**. This docs PR adds unique 09-26 files that must **union** with older docs PRs, not overwrite. Pre-existing queue breaks (#389 WX, #392 ChatPanel) are not this unique delta.  
SYSTEMS_AFFECTED: future Motoko/sidecar PR; stack-compat CI  
RECOMMENDED_ACTION: Keep this architecture PR docs-only. Land Phase 0/1 in a dedicated PR after #327/#331 (or a human-unioned restack). After older queue items merge, re-read EVENT_SOURCE line numbers. Run `bash scripts/open-pr-stack-compat.sh --self`. Unique 09-26 filenames must not replace #352/#422/#450/#527/#583 unique files.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: GTAD-2026-09-21-008; GTAD-2026-09-25-003  
REGRESSION_RISK: HIGH if WX/persist files are edited in the same PR as #327/#331 without union.  
VALIDATION_REQUIRED: `open-pr-stack-compat.sh --self` exit 0, or documented that remaining conflicts are older siblings (not this unique delta).  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-09-26-004  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Q-018 throw-after-mutation notes stay deferred — extra persist PRs #599/#602/#604 are also not EVENT_SOURCE; C-007 plague tags the linchpin caller  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: On main, `noteUnconfirmedCredit` is already called from one-shot settle (`dokaPersist.ts` 217–239); that path is Q-015 keep + Q-016 `shouldSkipAbsoluteDokaWrite` (progressPersist.ts 202–212). Open persist PRs listed in 09-25-004 remain unmerged. After 09-25 cron: **#599** seeded portal-keep skip, **#602** skip rename/upgrade while Death Realm pending, **#604** skip feat claim/GameKey redeem while Death Realm pending. Those helpers are **not** on `0f5363f` (`src/frontend/src/utils/unseeded*` is absent). Separately, plague-zone lethal **does** call `_handlePlayerDeath` (`WX` 14326–14331) while lava/spike HP-watch still does not (13316+). C-007 enum adds `plague` (same METRIC_ID).  
SYSTEMS_AFFECTED: future sidecar flush after persist-note helpers; Q-015 / Q-016 / Q-018; C-007 death-cause tagging  
RECOMMENDED_ACTION: Do not implement Q-018 against unmerged branches. After persist helpers merge, increment `quality.persist.throw_after.{credit|spend}` **after** the note helper returns, off the lock. Never double-count the live one-shot keep as Q-018. Never release a keep because the sidecar threw. Never invent spend-note helpers in a telemetry PR. Tag C-007 `plague` from the linchpin caller; do not merge HP-watch into `_handlePlayerDeath` solely for lava/spikes.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: GTAD-2026-09-25-004; GTAD-2026-09-21-006; merge of persist PRs listed in EVIDENCE (or equivalent on main)  
REGRESSION_RISK: HIGH if someone forks persist helpers in the telemetry PR, counts unmerged APIs as live, or unifies death persist to make a metric easier.  
VALIDATION_REQUIRED: Existing dokaPersist / progressPersist / death tests still pass with a throwing sidecar; Q-018 keys absent until the note helpers exist on main; plague lethal still applies one 20/40.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-09-26-005  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Point Quality Auditor, Balance Analyst, Dashboard Designer, and longHorizonSim at the 09-26 contract — stay WAITING until Phase 0/1  
CATEGORY: prompt-architecture  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `longHorizonSim.ts` 532–536 still sets `telemetry.available: false`. No sidecar in `src/`. Admin tabs (`gameTypes.ts` 483–498; `AdminDashboard.tsx` 5611–5625) have no intelligence/health. Cursor Cloud Automations have no prompt write API. TBC reports must remain WAITING_FOR_TELEMETRY — open **#609** already repeats that for 2026-09-26. AQA-012 shop site is GameKey + `shouldCommitGameKeyRedeem`. Q-015/Q-016/Q-018 are proposed, not live. Unmerged #333/#395/#462/#502/#556/#609 are TBC WAITING reports. Unmerged #345/#424/#455/#504/#559 are dashboard matrices; **#616** skipped a sixth Health matrix because collectors are still absent.  
SYSTEMS_AFFECTED: Quality Auditor prompt; Balance Analyst; Dashboard Designer; `utils/longHorizonSim.ts` (do not flip `available` in this docs PR)  
RECOMMENDED_ACTION: UPDATE_PROMPT (human, dashboard): read `docs/automation/TELEMETRY_ARCHITECTURE_2026-09-26.md`. If increment/snapshot APIs are absent, repeat INCONCLUSIVE / WAITING. If present, cite persist-ok/fail, victory-paid, death-penalty, recap open/dismiss (one increment despite five UI paths), GameKey redeem via `shouldCommitGameKeyRedeem`, death-replay, one-shot settle, absolute-write skip, plague vs lava/spike death causes, and snapshot level histogram. Never treat a missing increment as a player regression. Never require persist-lock enqueue. Never treat `processPendingPurchases` volume as shop health. Keep `longHorizonSim.telemetry.available = false` until APIs exist and are populated. This run cannot edit dashboard prompts.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: GTAD-2026-09-01-003 or GTAD-2026-09-01-004 merged before sibling audits have numbers  
REGRESSION_RISK: LOW.  
VALIDATION_REQUIRED: Next auditor/balance/dashboard report either cites real counters or explicitly says “still no telemetry.”  
STATUS: NEW  

---

## Still NEW (do not re-file)

Implementers should execute these 09-01 IDs against **09-26 line numbers** (same SHA as 09-21 through 09-25; re-read this cron):

| ID | Title (short) | 09-26 note |
| :--- | :--- | :--- |
| GTAD-2026-09-01-001 | Aggregates only; no principals | Extended by 09-02-001, 09-25-001, 09-26-001 |
| GTAD-2026-09-01-002 | Fail-open sidecar; not on persist lock | Extended by 09-25-002 / 09-26-002 (`beforeEach` + one-shot keep) |
| GTAD-2026-09-01-003 | Phase 0 snapshot buckets | `getAllCharacters` now `main.mo` 532; optional GameKey **status** histogram |
| GTAD-2026-09-01-004 | Phase 1 outcome + quality hooks | Shop hook = 09-21-003; recap dismiss = **09-22-003** (five paths, re-verified); add Q-015/Q-016; Q-018 deferred via 09-26-004 |
| GTAD-2026-09-01-005 | Tag flee vs combat vs lava/spike | Flee `WX` 18935; HP-watch 13316 still a second persist entry (recap 13355); plague 14331 is a linchpin caller (C-007 `plague`) |
| GTAD-2026-09-01-006 | Phase 2 combat/spell/content dims | Family roll = `spawnPolicy.ts`; overwrite `WX` 11873; E-008 summoner 11932 |
| GTAD-2026-09-01-007 | Intelligence tab, honest empty state | Distinct from Purchases GameKey inbox; not combatant `intelligence`; TADD #616 skipped Health |
| GTAD-2026-09-01-008 | Do not invent spell-discovery persist | `ownedSpells` still catalog grant (WX 2412) |
| GTAD-2026-09-01-009 | Defer sequences / intent / URLs / world-features | Plus Enemy Register lore (N-008); world-feature catalogs still not WX importers |
| GTAD-2026-09-01-010 | Sibling prompts stay WAITING | Citation path superseded by 09-26-005 |
| GTAD-2026-09-01-011 | Keep increment maps off OQL | Do not OQL-expose telemetry or `gameKeyLedger` |
| GTAD-2026-09-01-012 | Sidecar outside WorldExploration | WX is still **19,213** lines |
| GTAD-2026-09-01-013 | Import gate on Motoko/mocks | Plus EOP later-file after frozen `20260901` |
| GTAD-2026-09-01-014 | Family-variant / enemy-only extras | Plus E-008; still no elite_patrol; family site = spawnPolicy |

09-02 IDs still NEW (do not re-file; prefer later IDs where they overlap):

| ID | Prefer instead when implementing |
| :--- | :--- |
| GTAD-2026-09-02-001 | 09-26-001 (same fence) |
| GTAD-2026-09-02-002 | **09-21-003** (`shouldCommitGameKeyRedeem`) |
| GTAD-2026-09-02-003 | Still valid (unpaid death replay Q-014); `beforeEach` note in 09-26-002 |
| GTAD-2026-09-02-004 | 09-21-007 (spawnPolicy + N-008) |
| GTAD-2026-09-02-005 | Still valid (audit log is ops) |
| GTAD-2026-09-02-006 | **09-21-005** (#259 merged; later-file after 20260901) |
| GTAD-2026-09-02-007 | 09-26-005 (citation path) |

09-21 IDs still NEW on unmerged PR #352 (do not re-file):

| ID | Prefer instead when implementing |
| :--- | :--- |
| GTAD-2026-09-21-001 | 09-26-001 |
| GTAD-2026-09-21-002 | 09-26-002 |
| GTAD-2026-09-21-003 | Still the GameKey predicate ID (`shouldCommitGameKeyRedeem`) |
| GTAD-2026-09-21-004 | Still Q-015/Q-016; Q-018 is 09-26-004 |
| GTAD-2026-09-21-005 | Still the EOP later-file ID |
| GTAD-2026-09-21-006 | Dual-death persist entries; 09-26-004 adds plague linchpin tag |
| GTAD-2026-09-21-007 | Still family/summoner/Register scope |
| GTAD-2026-09-21-008 | **09-26-003** (queue is now 306 PRs) |
| GTAD-2026-09-21-009 | **09-22-003** (five onClose sites; re-verified this run, not re-filed) |
| GTAD-2026-09-21-010 | 09-26-005 |

09-22 / 09-23 / 09-24 / 09-25 IDs still NEW on unmerged PRs #422 / #450 / #527 / #583 (do not re-file; prefer 09-26 where they overlap):

| ID | Prefer instead when implementing |
| :--- | :--- |
| GTAD-2026-09-22-001 / 09-23-001 / 09-24-001 / 09-25-001 | 09-26-001 |
| GTAD-2026-09-22-002 / 09-23-002 / 09-24-002 / 09-25-002 | 09-26-002 |
| GTAD-2026-09-22-003 | Still the recap five-path ID (re-verified; do not mint a twin) |
| GTAD-2026-09-22-004 / 09-23-003 / 09-24-003 / 09-25-003 | **09-26-003** (queue 79 → 306) |
| GTAD-2026-09-22-005 / 09-23-004 / 09-24-004 / 09-25-004 | **09-26-004** (extra persist PRs + plague tag) |
| GTAD-2026-09-22-006 / 09-23-005 / 09-24-005 / 09-25-005 | 09-26-005 |
