# ACTION_IDs — Gameplay Telemetry Architecture Director 2026-09-21

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Gameplay Telemetry Architecture Director  
(`047ac8a1-a4a0-11f1-a7d1-d6b4613131ce`).  
Design contract: [`TELEMETRY_ARCHITECTURE_2026-09-21.md`](./TELEMETRY_ARCHITECTURE_2026-09-21.md).  

**Do not re-implement from stale line numbers.** Phase 0/1 tickets remain  
`GTAD-2026-09-01-001`…`014` in [`ACTION_IDS_GTAD_2026-09-01.md`](./ACTION_IDS_GTAD_2026-09-01.md)  
(policy still NEW, not shipped). 09-02 deltas in [`ACTION_IDS_GTAD_2026-09-02.md`](./ACTION_IDS_GTAD_2026-09-02.md)  
are still NEW. This run adds **deltas only** (GameKey commit helper, one-shot settle,  
EOP later-file, dual-death, stack fence vs #327/#331).

This run ships **docs only**. Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID.

HEAD inspected: `0f5363f`. Oldest still-open PRs at this cron: **#327** then **#331**.

---

ACTION_ID: GTAD-2026-09-21-001  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Privacy fence — aggregates only; GameKey email, OQL, leaderboard, and getAllCharacters stay off Intelligence  
CATEGORY: privacy  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Mandate forbids individual surveillance. `getLeaderboard` returns `principalId` (`main.mo` 3390). `getAllCharacters` (`main.mo` 532) dumps every Principal + `Character.name` and is unused by AdminDashboard. OQL `gameKeyRequests` payloads include `userPrincipal` and `email` (`main.mo` 3781–3796). `GameKeyRequest.email` / `redeemedBy` (`types/admin.mo` 221–234). `adminGetGameKeyReveal` is copy-once ops. Chat is in-memory. `PurchaseRecord` still holds KYC fields (202–217).  
SYSTEMS_AFFECTED: future telemetry maps; Admin Intelligence tab; OQL (do not add owner-keyed event entities); do not call `getAllCharacters` / `adminListGameKeyRequests` / `adminGetGameKeyReveal` from Intelligence  
RECOMMENDED_ACTION: Phase 0 snapshots return **buckets only**. GameKey snapshot = status histogram only. Never persist chat text, GameKey codes, emails, `uiLayout`, pixel patterns, click traces, or purchase KYC. Never reuse leaderboard / OQL / getAllCharacters as an analytics wire format.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: GTAD-2026-09-01-001; GTAD-2026-09-02-001 (still NEW; this ID refreshes line numbers)  
REGRESSION_RISK: LOW if followed; HIGH if someone charts OQL GameKey rows in the browser.  
VALIDATION_REQUIRED: Intelligence responses contain no principal, display name, email, GameKey, or message body.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-09-21-002  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Fail-open sidecar stays off the persist lock — including beforeEach death flush and one-shot settle  
CATEGORY: architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `createProgressPersist` now serializes credits, `saveBattleStats`, GameKey redeem, and optional `beforeEach` unpaid-death flush (`progressPersist.ts` 223–252). `AQA-2026-08-30-012` still says counters “must enqueue on createProgressPersist or be query-only.” Query-only is correct. Enqueue-on-lock (including `beforeEach`) is a wallet-race hazard. Victory recap is already shown before persist (`WX` 12517 then catch 12611 “non-blocking”). One-shot `keep` must remain `keep` if telemetry throws (`dokaPersist.ts` 144–152).  
SYSTEMS_AFFECTED: `utils/progressPersist.ts`; future `recordTelemetryIncrements`; outcome helpers after they return; Quality Auditor prompt  
RECOMMENDED_ACTION: Implement increments as fire-and-forget after persist / settle / flush functions return. Swallow all sidecar errors. Do not enqueue telemetry on `progressPersistRef`. Do not write HP/XP/Doka/spell levels from telemetry. Missing method on the mock actor = no-op. Treat AQA-012’s enqueue clause as superseded.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: GTAD-2026-09-01-002  
REGRESSION_RISK: HIGH if ignored (wallet races, unpaid victories, one-shot remint).  
VALIDATION_REQUIRED: Existing persist / dokaPersist / deathPenalty unit tests still pass with a throwing/missing increment API; a sidecar throw does not skip `applyRewards`, release a one-shot claim, or skip `shouldSkipAbsoluteDokaWrite`.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-09-21-003  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Shop-credit increment predicate is shouldCommitGameKeyRedeem — not shouldCommitShopCredit or processPendingPurchases remount  
CATEGORY: telemetry  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `processPendingPurchases` still always returns 0 (`main.mo` 1338–1348). Paid Doka credits via `redeemGameKey` (`main.mo` 1469) through `redeemGameKeyThroughPersist` (`shopPurchase.ts` 294–330; `DokaGameKeyShop.tsx` 184). Commit helper is `shouldCommitGameKeyRedeem(walletSeeded, granted)` (275–279). `shouldCommitShopCredit` is the legacy remount path. WX remount still calls `creditPendingPurchasesThroughPersist` (1494) which cannot observe a gain. `calculateAndAwardDoka` still returns 0 (`main.mo` 3073–3076). 09-02-002 named the wrong helper.  
SYSTEMS_AFFECTED: future sidecar flush in `shopPurchase.ts`; Q-006 / P-010 / Q-013; Quality Auditor shop-credit interpretation; WX remount helper (do not treat as mint)  
RECOMMENDED_ACTION: Increment `quality.shop.redeem_ok` / `prog.doka_earned.shop_gamekey` only after redeem returns and `shouldCommitGameKeyRedeem(seeded, gained)`. Optional `quality.shop.redeem_fail` with enum reasons. Never increment on the no-op remount. Fire-and-forget **after** the persist-lock function returns. Swallow sidecar errors.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: GTAD-2026-09-01-004; GTAD-2026-09-02-002; GTAD-2026-09-21-001  
REGRESSION_RISK: HIGH if someone counts remount no-ops as shop volume, uses `shouldCommitShopCredit` for GameKey, or enqueues telemetry on the wallet lock.  
VALIDATION_REQUIRED: A redeem `#ok` with gain on a seeded lock produces one increment; remount `processPendingPurchases` produces zero; a throwing sidecar does not skip redeem.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-09-21-004  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: One-shot settle and absolute-write skip are quality counters — not a second mint writer  
CATEGORY: telemetry  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Ground / shrine / dungeon-complete credits claim a one-shot id then `applyRewards`. `settleOneShotAfterCredit` (`dokaPersist.ts` 144–152) is `commit` on gain, `release` on explicit `#err`, `keep` on transport miss. `confirmKeptOneShotCredit` (173–192) may later commit a live-wallet rise only when the lock is already seeded. `shouldSkipAbsoluteDokaWrite` (`progressPersist.ts` 202–212) skips a `saveBattleStats` heal/shop snapshot when `unconfirmedWalletCredit` and live ≤ committed — that skip is why grant wipes stopped. Q-015 / Q-016.  
SYSTEMS_AFFECTED: `dokaPersist.ts` after settle returns; `progressPersist.ts` skip site; GTAD-Q-015 / Q-016  
RECOMMENDED_ACTION: After settle returns, fire-and-forget `quality.oneshot.{commit|release|keep|confirm_commit}`. When an absolute write is skipped for unconfirmed credit, increment `quality.persist.absolute_skip.unconfirmed_credit`. Do not store claim ids, coordinates, or amounts. Do not release a claim because the sidecar threw.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: GTAD-2026-09-01-002; GTAD-2026-09-21-002  
REGRESSION_RISK: HIGH if someone releases a keep on increment failure or forks the skip predicate.  
VALIDATION_REQUIRED: Existing `dokaPersist.test.ts` / `progressPersist.test.ts` transport-keep and skip cases still pass with a throwing sidecar.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-09-21-005  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Telemetry Motoko maps require a new later migration after frozen 20260901 — never edit shipped NewActors  
CATEGORY: process  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Chain is five files, `check-limit = 5` (`mops.toml`). Frozen tails: `20260831_000000` (deployed Aug-31 shape, no GameKey) and `20260901_000000` (GameKey maps, `OldActor = {}`). `.old` is Caffeine-owned Aug-31 `.most` (PR #181 `f8aa05e`, 42 stables, no GameKey). PR #259 hitchhike warning is obsolete — GameKey is already on 20260901. moc 1.11.2 runtime matches the *most recently applied* name; a missing name → IC0503. Compile-time M0263 if a field is required at the `.old` position and no later file produces it. `check-eop-stables.py` freezes NewActor lists through 20260901.  
SYSTEMS_AFFECTED: `src/backend/main.mo`; `src/backend/migrations/20260921+`; `mops.toml` check-limit; mocks; bindgen; `.old` (do not rewrite); `snapshots/deployed/`  
RECOMMENDED_ACTION: Land `telemetryLifetime` / `telemetryDay` / `telemetryDayEpoch` via a **new** `YYYYMMDD_HHMMSS.mo` after `20260901` with `OldActor = {}` and empty/zero defaults. Bump `check-limit` to 6. Run `python3 scripts/check-eop-stables.py` and `bash scripts/caffeine-import-gate.sh backend` (`.old` + `snapshots/deployed/*.most` + `empty-canister.most`; `unsupported/` must fail). Never blank or hand-write `.old`. Dedicated human-approved PR — not unioned with #327/#331 unless a human says so. Add increment/snapshot methods to the mock with the real shape.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: GTAD-2026-09-01-013; GTAD-2026-09-02-006 (EOP fence still NEW; #259 target replaced)  
REGRESSION_RISK: HIGH if maps are dropped on upgrade, added on 20260831/20260901, or `.old` is rewritten.  
VALIDATION_REQUIRED: CI caffeine-import-gate and open-pr-stack jobs green; check-stable vs empty canister and vs Aug-31 `.old`.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-09-21-006  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Dual death remains two entries — tag flee vs combat vs lava/spike; do not unify persist  
CATEGORY: telemetry  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `_handlePlayerDeath` (`WX` 13261) comment claims HP-watch routes through the linchpin. HP-watch (`WX` 13316–13407) still calls `persistDeathPenalty` / `resetRunState` itself and does **not** call `_handlePlayerDeath`. Flee `onEndBattle` (18918–18935) does call it (run confirm unchanged). C-003 / C-004 / C-007.  
SYSTEMS_AFFECTED: Phase 1 death tagging; do not edit death math, RAF, or `persistDeathPenalty`  
RECOMMENDED_ACTION: Thread a closed `DeathCause` enum into **both** entries. Increment after persist returns. Do not merge HP-watch into `_handlePlayerDeath` solely to make a metric easier.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: GTAD-2026-09-01-005  
REGRESSION_RISK: HIGH if death persist is forked or lava deaths start calling the linchpin as a drive-by.  
VALIDATION_REQUIRED: Existing death / Death Realm tests still pass with a throwing sidecar; lava still does not double-apply 20/40.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-09-21-007  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Family-variant site is spawnPolicy; summoner roll is live; do not invent elite_patrol or Enemy Register encounters  
CATEGORY: content-scope  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: 30% overlay is `applyFamilyVariantsToRoster` (`spawnPolicy.ts` 289–296, `FAMILY_VARIANT_CHANCE` 35); WX calls it at 5862–5866. Battle start still overwrites `sp`/`sr`/`init`/`res`/`chc` (`WX` 11873–11903). Summoner roll live at 11932–11943 (`gameConstants.ts` 298–299). `worldFeatures.ts` has **no** WX importer. Enemy Register is flavour (`enemyRegisterCopy.ts`) — N-008. `ownedSpells` is still catalog grant (`WX` 2412–2440).  
SYSTEMS_AFFECTED: Phase 2 flush; Intelligence Enemies / Content panels  
RECOMMENDED_ACTION: Allow E-007 / E-008 once Phase 1 exists. Caption family W/L with the battle-start overwrite. Do not add `content.world_feature.elite_patrol`, discovery-source series, or Register-open charts until those systems persist an event.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: GTAD-2026-09-01-006; GTAD-2026-09-01-014; GTAD-2026-09-02-004  
REGRESSION_RISK: LOW.  
VALIDATION_REQUIRED: Dashboard does not show world-feature, discovery, or Enemy Register charts with invented zeros.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-09-21-008  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Do not hitchhike telemetry onto open PRs #327 or #331  
CATEGORY: process  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Oldest still-open PRs targeting main (createdAt ascending): #327 Striker AoE (WX, `challengeCompletion`, targeting, `dokaPersist`), #331 portal destack (WX, `mapGen`, persist), then same-hour #333 TBC docs (README), #334 admin tiers, #335 a11y, #336 MIMA docs, #337 world-encounter docs, #338 MTD roadmap (README), #339 dead CSS, #340 combat AP gates (WX), #341 admin spell delete. This docs PR unions README index rows from #333/#338. Telemetry stables also need bindgen/mocks — do not land them on #327/#331/#340.  
SYSTEMS_AFFECTED: future Motoko/sidecar PR; stack-compat CI  
RECOMMENDED_ACTION: Keep this architecture PR docs-only. Land Phase 0/1 in a dedicated PR after #327/#331 (or a human-unioned restack). Run `bash scripts/open-pr-stack-compat.sh --self`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: GTAD-2026-09-21-005  
REGRESSION_RISK: HIGH if WX/persist files are edited in the same PR as #327/#331 without union.  
VALIDATION_REQUIRED: `open-pr-stack-compat.sh --self` exit 0.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-09-21-009  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Recap dismiss is four discrete onClose sites — increment once  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `PostBattleRecap.tsx` Escape 67–68, backdrop 111, close button 208, Continue 609. All call `onClose`. 09-02 listed Escape/backdrop/Enter only. Q-005. Recap open sites: victory 12517, Boss Rush 12925, HP-watch defeat 13355.  
SYSTEMS_AFFECTED: `PostBattleRecap` wrapper or `onClose` once; Q-004 / Q-005  
RECOMMENDED_ACTION: Dedup to one `quality.recap.dismissed` per recap instance. Do not scrape canvas. Do not store enemy-name breakdowns.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: GTAD-2026-09-01-004  
REGRESSION_RISK: LOW.  
VALIDATION_REQUIRED: Escape + Continue in one recap = one increment.  
STATUS: NEW  

---

ACTION_ID: GTAD-2026-09-21-010  
SOURCE_AUTOMATION: Gameplay Telemetry Architecture Director  
TITLE: Point Quality Auditor, Balance Analyst, Dashboard Designer, and longHorizonSim at the 09-21 contract — stay WAITING until Phase 0/1  
CATEGORY: prompt-architecture  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `longHorizonSim.ts` 532–536 still sets `telemetry.available: false`. No sidecar in `src/`. Admin tabs (`gameTypes.ts` 483–498) have no intelligence/health. Cursor Cloud Automations have no prompt write API. TBC reports must remain WAITING_FOR_TELEMETRY. AQA-012 shop site is GameKey + `shouldCommitGameKeyRedeem`. Q-015/Q-016 are proposed, not live.  
SYSTEMS_AFFECTED: Quality Auditor prompt; Balance Analyst; Dashboard Designer; `utils/longHorizonSim.ts` (do not flip `available` in this docs PR)  
RECOMMENDED_ACTION: UPDATE_PROMPT (human, dashboard): read `docs/automation/TELEMETRY_ARCHITECTURE_2026-09-21.md`. If increment/snapshot APIs are absent, repeat INCONCLUSIVE / WAITING. If present, cite persist-ok/fail, victory-paid, death-penalty, recap open/dismiss, GameKey redeem via `shouldCommitGameKeyRedeem`, death-replay, one-shot settle, absolute-write skip, and snapshot level histogram. Never treat a missing increment as a player regression. Never require persist-lock enqueue. Never treat `processPendingPurchases` volume as shop health. Keep `longHorizonSim.telemetry.available = false` until APIs exist and are populated. This run cannot edit dashboard prompts.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: GTAD-2026-09-01-003 or GTAD-2026-09-01-004 merged before sibling audits have numbers  
REGRESSION_RISK: LOW.  
VALIDATION_REQUIRED: Next auditor/balance/dashboard report either cites real counters or explicitly says “still no telemetry.”  
STATUS: NEW  

---

## Still NEW (do not re-file)

Implementers should execute these 09-01 IDs against **09-21 line numbers**:

| ID | Title (short) | 09-21 note |
| :--- | :--- | :--- |
| GTAD-2026-09-01-001 | Aggregates only; no principals | Extended by 09-02-001 and 09-21-001 |
| GTAD-2026-09-01-002 | Fail-open sidecar; not on persist lock | Extended by 09-21-002 (`beforeEach` + one-shot keep) |
| GTAD-2026-09-01-003 | Phase 0 snapshot buckets | `getAllCharacters` now `main.mo` 532; optional GameKey **status** histogram |
| GTAD-2026-09-01-004 | Phase 1 outcome + quality hooks | Shop hook = 09-21-003; recap dismiss = 09-21-009; add Q-015/Q-016 |
| GTAD-2026-09-01-005 | Tag flee vs combat vs lava/spike | Flee `WX` 18935; HP-watch 13316 still a second entry (09-21-006) |
| GTAD-2026-09-01-006 | Phase 2 combat/spell/content dims | Family roll = `spawnPolicy.ts`; overwrite `WX` 11873; E-008 summoner 11932 |
| GTAD-2026-09-01-007 | Intelligence tab, honest empty state | Distinct from Purchases GameKey inbox; not combatant `intelligence` |
| GTAD-2026-09-01-008 | Do not invent spell-discovery persist | `ownedSpells` still catalog grant (WX 2412) |
| GTAD-2026-09-01-009 | Defer sequences / intent / URLs / world-features | Plus Enemy Register lore (N-008) |
| GTAD-2026-09-01-010 | Sibling prompts stay WAITING | Citation path superseded by 09-21-010 |
| GTAD-2026-09-01-011 | Keep increment maps off OQL | Do not OQL-expose telemetry or `gameKeyLedger` |
| GTAD-2026-09-01-012 | Sidecar outside WorldExploration | WX is now **19,213** lines |
| GTAD-2026-09-01-013 | Import gate on Motoko/mocks | Plus EOP later-file; see 09-21-005 |
| GTAD-2026-09-01-014 | Family-variant / enemy-only extras | Plus E-008; still no elite_patrol; family site = spawnPolicy |

09-02 IDs still NEW (do not re-file; prefer 09-21 where they overlap):

| ID | Prefer instead when implementing |
| :--- | :--- |
| GTAD-2026-09-02-001 | 09-21-001 (same fence, new line numbers) |
| GTAD-2026-09-02-002 | **09-21-003** (`shouldCommitGameKeyRedeem`) |
| GTAD-2026-09-02-003 | Still valid (unpaid death replay Q-014); `beforeEach` note in 09-21-002 |
| GTAD-2026-09-02-004 | 09-21-007 (spawnPolicy + N-008) |
| GTAD-2026-09-02-005 | Still valid (audit log is ops) |
| GTAD-2026-09-02-006 | **09-21-005** (#259 merged; later-file after 20260901) |
| GTAD-2026-09-02-007 | 09-21-010 (citation path) |
