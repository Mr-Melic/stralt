# ACTION_IDs — Gameplay Telemetry Architecture Director 2026-10-22

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Gameplay Telemetry Architecture Director  
(`047ac8a1-a4a0-11f1-a7d1-d6b4613131ce`).  
Design contract: [`TELEMETRY_ARCHITECTURE_2026-10-22.md`](./TELEMETRY_ARCHITECTURE_2026-10-22.md).  

**Do not re-implement from stale line numbers.** Phase 0/1 tickets remain  
`GTAD-2026-09-01-001`…`014` in [`ACTION_IDS_GTAD_2026-09-01.md`](./ACTION_IDS_GTAD_2026-09-01.md)  
(policy still NEW, not shipped). This run adds **deltas only** (49-day freeze,  
543-PR queue, remount-keep burst, kit-parity fence). EVENT_SOURCE lines on  
`0f5363f` match the 2026-10-21 contract and were re-verified.

This run ships **docs only**. Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID.

---

ACTION_ID: GTAD-2026-10-22-001  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Privacy fence and unique-file stack — do not overwrite older GTAD siblings or feed Intelligence identifiable dumps  
CATEGORY: privacy  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `main` HEAD `0f5363f` still has no sidecar (49 days frozen). Open queue **543** PRs; oldest **#327** then **#331**. Latest **#874**. Unmerged GTAD siblings #352/#422/#450/#527/#583/#641/#682/#722/#806/#816 already own dated architecture files. `getAllCharacters` (`main.mo` 532), `getLeaderboard` (3390), OQL `gameKeyRequests` email (3780–3796), `GameKeyRequest.email` / `redeemedBy` (`types/admin.mo` 221–234), `chatMessages` (2610), Purchases tab emails. Mandate forbids identifiable Intelligence cells. README left untouched so sibling index rows are not overwritten.  
SYSTEMS_AFFECTED: future telemetry maps; Admin Intelligence tab; OQL (do not add owner-keyed event entities); do not call `getAllCharacters` / `adminListGameKeyRequests` / `adminGetGameKeyReveal` from Intelligence  
RECOMMENDED_ACTION: Keep this PR’s unique files (`TELEMETRY_ARCHITECTURE_2026-10-22.md`, `ACTION_IDS_GTAD_2026-10-22.md`). Phase 0 GameKey snapshot may return **status histogram only**. Never persist chat text, GameKey codes, emails, `uiLayout`, pixel patterns, click traces, or purchase KYC. Never reuse leaderboard / OQL / `getAllCharacters` as an analytics wire format. Union overlapping files if restacking; do not concatenate duplicate `export function` copies.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: GTAD-2026-09-01-001; GTAD-2026-09-02-001; GTAD-2026-10-21-001  
REGRESSION_RISK: LOW if followed; HIGH if someone charts OQL GameKey rows in the browser or overwrites sibling dated files.  
VALIDATION_REQUIRED: Intelligence responses contain no principal, display name, email, GameKey, or message body. Stack-compat `--self` does not clobber #352…#816 unique paths.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-10-22-002  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Re-read EVENT_SOURCE on frozen HEAD — same lines as 10-21; do not relocate onto kit-parity or remount-keep PRs  
CATEGORY: telemetry  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: On `0f5363f`, WX is **19,213** lines. Battle start **12097–12099**; victory recap **12517** from last-hostile **13936** (`handleBattleEnd(true)` only — no `false` caller); persist catch **12611**; Boss Rush catch **12863**; dual death **13261** vs HP-watch **13316**; plague linchpin **14331**; flee **18935**; family 30% `spawnPolicy.ts` 35 / 279–287 applied at WX **5864** (WX **5940** is camera); family overwrite **11898–11902**; summoner **11932–11943**; GameKey `shouldCommitGameKeyRedeem` **275–279** / UI **184**; remount no-op **1494**; recap dismiss five `onClose` sites 68/95/111/208/609 (one increment); `ownedSpells` **2412**; `shouldIncludeBackendSpellInLibrary` **712–718**. 09-02 catalog lines are stale. Open 2026-10-21 kit-parity PRs (#850–#868 class) and remount-keep PRs are **not** live EVENT_SOURCE.  
SYSTEMS_AFFECTED: Phase 0/1/2 hooks; C-001…C-012; E-007/E-008; S-007; Q-001/Q-004/Q-005/Q-006; P-010  
RECOMMENDED_ACTION: Implementers execute `GTAD-2026-09-01-001`…`014` against **this** file’s lines. Shop mint = `shouldCommitGameKeyRedeem`, never remount `processPendingPurchases`. Recap dismiss = one increment despite five UI paths. Do not relocate C-002 onto unmerged #652, Q-005 onto #693, N-003 onto #714, N-002 onto #803, or S-007/E-006 onto kit-parity PRs.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: GTAD-2026-09-01-004; GTAD-2026-09-01-005; GTAD-2026-09-02-002; GTAD-2026-09-02-004; GTAD-2026-10-21-002  
REGRESSION_RISK: HIGH if someone instruments camera code as family roll, counts remount no-ops as shop volume, double-counts recap dismiss, or treats unmerged kit-parity as the enemy-cast site.  
VALIDATION_REQUIRED: Family-variant increment site is `applyFamilyVariantsToRoster` / battle-start roster, not `updateCameraToFollowPlayer`. A throwing sidecar does not skip `applyRewards` / redeem / death persist.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-10-22-003  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Q-018 stays deferred — 2026-10-21 remount-keep persist PRs are not EVENT_SOURCE; Q-016 helper is already on main  
CATEGORY: telemetry  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `shouldSkipAbsoluteDokaWrite` exists on `main` (`progressPersist.ts` 202–212) — that is Q-016. No `unseeded*KeepWriteSkip` symbol in `src/`. Extra persist PRs after 09-28 still OPEN: #742, #759, #764, #767, #774, #800, #807, #811, #812, #813, plus 2026-10-21 **#847, #854, #860, #864, #866, #869**. Earlier persist PRs #445/#497/#653/#710 also open. `flushPendingDeathPenalty` (`deathPenalty.ts` 572) may run as persist `beforeEach` — increments must stay **off** that path. One-shot settle (`dokaPersist.ts` 144–215) is live on `main` (Q-015).  
SYSTEMS_AFFECTED: Q-014 / Q-015 / Q-016 / Q-018; persist lock; future sidecar flush in `dokaPersist.ts` / `progressPersist.ts` / `deathPenalty.ts`  
RECOMMENDED_ACTION: Instrument Q-015/Q-016 only after those functions **return**, off the lock. Do not invent Q-018 until a keep-write-skip helper exists on `main`. Never increment inside `beforeEach`. Never release a one-shot claim because telemetry failed.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: GTAD-2026-09-01-002; GTAD-2026-09-02-003; GTAD-2026-10-21-003  
REGRESSION_RISK: HIGH if someone treats an unmerged remount-keep PR as live, or enqueues telemetry on the wallet lock.  
VALIDATION_REQUIRED: Existing persist / dokaPersist / deathPenalty unit tests still pass with a throwing sidecar. Q-018 dashboard cells stay “not measured.”  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-10-22-004  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Telemetry Motoko maps need their own later migration — #259 is merged; do not hitchhike #327/#331 or the 543-PR queue  
CATEGORY: process  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: GameKey EOP PR #259 merged 2026-09-02. Frozen chain: genesis `20260801`, name-only `20260803_185500`, `20260827`, deployed tail `20260831` (no GameKey), GameKey `20260901`. `mops.toml` `check-limit = 5`. `.old/src/backend/dist/backend.most` is Caffeine’s Aug-31 import (42 stables, no GameKey). New `telemetryLifetime` / `telemetryDay` / `telemetryDayEpoch` on `main.mo` need a **new later** file after `20260901` with `OldActor = {}`, bindgen, mock shape. Oldest open PRs #327 (Striker range) and #331 (portal destack) are combat/map — not a telemetry vehicle. Caffeine import gate + oldest-first stack-compat are mandatory. Empty-canister M0263 if `.old` / genesis is skipped.  
SYSTEMS_AFFECTED: `src/backend/main.mo`; `src/backend/migrations/`; mocks; bindgen; `.old` (do not blank or hand-write)  
RECOMMENDED_ACTION: Land telemetry stables in a dedicated, human-approved PR. Never edit a shipped `NewActor`. Run `pnpm typecheck`, `pnpm check`, `python3 scripts/check-eop-stables.py`, `bash scripts/caffeine-import-gate.sh backend`, and `bash scripts/open-pr-stack-compat.sh --self`. Add increment/snapshot methods to the mock with the real shape.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: GTAD-2026-09-01-013; GTAD-2026-09-02-006 (EOP hitchhike onto #259 is obsolete; the later-file rule is not); GTAD-2026-10-21-004  
REGRESSION_RISK: HIGH if maps are dropped on upgrade, added on a frozen chain file, or conflict with GameKey `NewActor`.  
VALIDATION_REQUIRED: CI caffeine-import-gate and open-pr-stack jobs green; check-stable vs `.old` and `snapshots/deployed/*.most` plus `empty-canister.most`.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-10-22-005  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Point Quality Auditor, Balance Analyst, Dashboard Designer, and longHorizonSim at the 10-22 contract — stay WAITING until Phase 0/1  
CATEGORY: prompt-architecture  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `longHorizonSim.ts` 532–536 still sets `telemetry.available: false`. No sidecar in `src/`. Admin tabs (`gameTypes.ts` 483–498; `AdminDashboard.tsx` 5610–5626) have no intelligence/health. Cursor Cloud Automations have no prompt write API. TBC/TADD sibling docs remain WAITING / skipped Health matrices (#827 / #833 on 2026-10-21; same-day **#871**). `main` has been frozen at `0f5363f` since 2026-09-03; 49 days without a collector is not a player regression. Queue growth 482→543 is open-PR traffic, not telemetry.  
SYSTEMS_AFFECTED: Quality Auditor prompt; Balance Analyst; Dashboard Designer; `utils/longHorizonSim.ts` (do not flip `available` in this docs PR)  
RECOMMENDED_ACTION: UPDATE_PROMPT (human, dashboard): read `docs/automation/TELEMETRY_ARCHITECTURE_2026-10-22.md`. If increment/snapshot APIs are absent, repeat INCONCLUSIVE / WAITING. If present, cite persist-ok/fail, victory-paid, death-penalty, recap open/dismiss, GameKey redeem, death-replay, oneshot settle, absolute-skip, and snapshot level histogram. Never treat a missing increment as a player regression. Never require persist-lock enqueue. Never treat `processPendingPurchases` volume as shop health. Keep `longHorizonSim.telemetry.available = false` until APIs exist and are populated.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: GTAD-2026-09-01-003 or GTAD-2026-09-01-004 merged before sibling audits have numbers  
REGRESSION_RISK: LOW.  
VALIDATION_REQUIRED: Next auditor/balance/dashboard report either cites real counters or explicitly says “still no telemetry.”  
STATUS: NEW  

---

## Still NEW (do not re-file)

Implementers should execute these 09-01 IDs against **10-22 line numbers**:

| ID | Title (short) | 10-22 note |
| :--- | :--- | :--- |
| GTAD-2026-09-01-001 | Aggregates only; no principals | Extended by 09-02-001 / 10-21-001 / 10-22-001 (GameKey email + 543-PR stack) |
| GTAD-2026-09-01-002 | Fail-open sidecar; not on persist lock | Includes `beforeEach`. AQA enqueue clause still superseded |
| GTAD-2026-09-01-003 | Phase 0 snapshot buckets | `getAllCharacters` now `main.mo` 532; optional GameKey **status** histogram |
| GTAD-2026-09-01-004 | Phase 1 outcome + quality hooks | Shop hook = `shouldCommitGameKeyRedeem`; recap dismiss five `onClose` sites, one increment |
| GTAD-2026-09-01-005 | Tag flee vs combat vs lava/spike | Flee `WX` 18935; HP-watch 13316 still a second entry; plague 14331 is a linchpin caller |
| GTAD-2026-09-01-006 | Phase 2 combat/spell/content dims | E-008 summoner 11932; family overwrite 11898–11902; family roll = spawnPolicy + WX 5864 |
| GTAD-2026-09-01-007 | Intelligence tab, honest empty state | Distinct from Purchases GameKey inbox |
| GTAD-2026-09-01-008 | Do not invent spell-discovery persist | `ownedSpells` still catalog grant (WX 2412) |
| GTAD-2026-09-01-009 | Defer sequences / intent / URLs / world-features | Plus N-008 Enemy Register lore |
| GTAD-2026-09-01-010 | Sibling prompts stay WAITING | Citation path: 10-22-005 |
| GTAD-2026-09-01-011 | Keep increment maps off OQL | Do not OQL-expose telemetry or `gameKeyLedger` |
| GTAD-2026-09-01-012 | Sidecar outside WorldExploration | WX is now **19,213** lines |
| GTAD-2026-09-01-013 | Import gate on Motoko/mocks | Plus stack-compat; later migration after 20260901 (10-22-004) |
| GTAD-2026-09-01-014 | Family-variant / enemy-only extras | E-007 site is spawnPolicy, not WX camera 5940; still no elite_patrol |
