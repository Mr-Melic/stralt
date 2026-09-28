# Telemetry Admin Dashboard Designer — ACTION_IDs (2026-09-28)

Source automation: Telemetry Admin Dashboard Designer (`4b026695`).  
Design only. No production code in this run.

`origin/main` is still `0f5363f` — the same SHA as unmerged
[PR #345](https://github.com/Mr-Melic/stralt/pull/345),
[PR #424](https://github.com/Mr-Melic/stralt/pull/424),
[PR #455](https://github.com/Mr-Melic/stralt/pull/455),
[PR #504](https://github.com/Mr-Melic/stralt/pull/504),
[PR #559](https://github.com/Mr-Melic/stralt/pull/559),
[PR #616](https://github.com/Mr-Melic/stralt/pull/616), and
[PR #668](https://github.com/Mr-Melic/stralt/pull/668). Prior IDs
`TADD-2026-08-31-001` … `007`, `AQA-2026-08-30-012`,
`TADD-2026-09-01-002` … `005`, `TADD-2026-09-02-001` … `006`,
`TADD-2026-09-21-001` … `006`, `TADD-2026-09-22-001` … `002`,
`TADD-2026-09-23-001` … `002`, `TADD-2026-09-24-001` … `002`,
`TADD-2026-09-25-001` … `002`, `TADD-2026-09-26-001` … `002`, and
`TADD-2026-09-27-001` … `002` remain **OPEN** except: bindgen half of
`TADD-2026-09-01-001` is **done**; `TADD-2026-09-02-002` dual-path shop
wording is **superseded** by `TADD-2026-09-21-001`. Do not open a second
counter set. This file is the 72-hour skip record, not a restatement of
H1–H14.

---

ACTION_ID: TADD-2026-09-28-001
SOURCE_AUTOMATION: Telemetry Admin Dashboard Designer
TITLE: Skip an eighth H1–H14 restatement — origin/main still 0f5363f; implement one Health card set from #345
CATEGORY: process
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: Re-inventory 2026-09-28 at HEAD `0f5363f` (unchanged vs #345/#424/#455/#504/#559/#616/#668). Zero product hits for `recordTelemetry` / `telemetrySidecar` / `adminGetTelemetry` / `telemetryLifetime` / `incrementTelemetry` / `persist_ok` / `victory_paid` / `shop_credit_committed`. No `tab: "health"` (`gameTypes.ts` 482–498; `AdminDashboard.tsx` 5605–5626). `shouldCommitGameKeyRedeem` remains the shop-credit site (`shopPurchase.ts` 275–328). `getAdminAuditLog` still has no AdminDashboard caller (comment only at 4232–4234). WorldExploration still has 0 `spriteUrl` / `drawImage`. Persist-fail remains a local log (`WorldExploration.tsx` 12614, 12866). `TADD-2026-09-27-001` already forbade another TADD dashboard PR that only restates H1–H14 while this SHA and unshipped AQA-012 hold. This cron obeyed that: new files are captions + fence, not an eighth widget spec. Eight unmerged TADD docs on one SHA must **union**, not concatenate (duplicate `export function` copies fail Caffeine `vite build`).
SYSTEMS_AFFECTED: Future Health tab (`AdminDashboard` only); TADD docs PRs #345/#424/#455/#504/#559/#616/#668/this file; do not edit persist writers, RAF, map gen, turn logic, or damage math.
RECOMMENDED_ACTION: When a human picks TADD-002, implement **one** H1–H14 layout from PR #345. Treat #424/#455/#504/#559/#616/#668/this file as dated captions on that spec. Do not paste eight Health sections. Do not open another TADD matrix that restates H1–H14 until `origin/main` moves or AQA-012 / Health tab / custom-URL loader / SDE persist maps / a new owner aggregate ships. Next cron: same skip rule.
AUTONOMY: POLICY — no production code
DEPENDENCIES: TADD-2026-08-31-002; TADD-2026-09-27-001; open PRs #345, #424, #455, #504, #559, #616, #668 (docs union, not UI concatenate)
REGRESSION_RISK: MEDIUM if an implementer copies H6 eight times (esbuild duplicate export / vanity empty states). LOW if one card set. Residual risk of continued owner blindness is already true.
VALIDATION_REQUIRED: Health tab has one H6 GameKey funnel, one H9 master-finish scalar, one H14 action histogram. `python3 scripts/check-duplicate-exports.py src/frontend/src` stays clean. Network inspector on Health shows no principals, emails, or GameKeys.
STATUS: NEW

---

ACTION_ID: TADD-2026-09-28-002
SOURCE_AUTOMATION: Telemetry Admin Dashboard Designer
TITLE: Do not treat 09-27 remaining drafts (#669–#714) or same-hour 09-28 copies as Health data sources
CATEGORY: process
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: After TADD #668 opened (2026-09-27T00:14Z), `origin/main` stayed `0f5363f`. Open PRs #669–#714 are combat/map/persist/UX/admin fixes plus more design copies (formations #669, LHIPS #670, MIMA #671, SDA #677, GFCF #678, SDE #679, WDD #680, GTAD #682, VAL #694). First 09-28 sibling: #715 (2026-09-28T00:07Z, VAL fact sheet); same-hour copies include #722 (GTAD), #725 (TBC WAITING_FOR_TELEMETRY), #729 (SDA), #734 (MIMA), #735 (GFCF), #744 (PX). None of those land increment maps, a Health tab, or a custom-URL loader on `main`. TADD-2026-09-27-002 already fenced 09-26 remaining and same-hour 09-27 docs at 00:08 UTC; this ID covers the rest of 09-27 and whatever dated copies this 00:18 UTC swarm opens.
SYSTEMS_AFFECTED: Future Health implementers / hunters; do not touch RAF, map gen, turn logic, or damage math to “add telemetry.”
RECOMMENDED_ACTION: Health reads only `LIVE_SNAPSHOT` APIs on the deployed actor and the AQA-012 seven counters after those ship. Ignore queued 09-21 through 09-28 design/code drafts as collectors. Do not paint TBC zeros as zero battles. Do not pre-build #722/#682/#641/#583 Phase 1 extras (battle start/defeat/flee, Q-015, Q-016). Keep H12 as the seven-counter strip. Keep WX `ownedIds` labeled retirement gating. Empty URL remains `NORMAL_DEFAULT`; stored unused URL remains `STORED_NOT_RENDERED`; neither is `CUSTOM_FALLBACK`.
AUTONOMY: POLICY — no code
DEPENDENCIES: TADD-2026-09-27-002; TADD-2026-09-26-002; TADD-2026-09-25-002; TADD-2026-09-24-002; TADD-2026-09-23-001; TADD-2026-09-22-001; TADD-2026-09-21-005
REGRESSION_RISK: LOW. Residual risk is an implementer wiring Health to a newer draft filename (#679 SDE, #715/#694 VAL, #722 GTAD, #725 TBC) because it is dated after #345.
VALIDATION_REQUIRED: Next Health PR cites canister methods that exist on `main` (or AQA-012 after it ships).
STATUS: NEW
