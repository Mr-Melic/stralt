# Telemetry Admin Dashboard Designer — ACTION_IDs (2026-09-23)

Source automation: Telemetry Admin Dashboard Designer (`4b026695`).  
Design only. No production code in this run.

`origin/main` is still `0f5363f` — the same SHA as unmerged
[PR #345](https://github.com/Mr-Melic/stralt/pull/345) and
[PR #424](https://github.com/Mr-Melic/stralt/pull/424). Prior IDs
`TADD-2026-08-31-001` … `007`, `AQA-2026-08-30-012`,
`TADD-2026-09-01-002` … `005`, `TADD-2026-09-02-001` … `006`,
`TADD-2026-09-21-001` … `006`, and `TADD-2026-09-22-001` … `002` remain
**OPEN** except: bindgen half of `TADD-2026-09-01-001` is **done**;
`TADD-2026-09-02-002` dual-path shop wording is **superseded** by
`TADD-2026-09-21-001`. Do not open a second counter set. This file is the
process delta after the 2026-09-22 sibling PR swarm, not a restatement of
H1–H13.

---

ACTION_ID: TADD-2026-09-23-001  
SOURCE_AUTOMATION: Telemetry Admin Dashboard Designer  
TITLE: Do not treat queued 2026-09-22 sibling design PRs as Health data sources  
CATEGORY: process  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `origin/main` is still `0f5363f`. Re-inventory found 0 product hits for `recordTelemetry` / `telemetrySidecar` / `adminGetTelemetry` / `telemetryLifetime` / `incrementTelemetry` / `persist_ok`. No `tab: "health"` (`gameTypes.ts` 482–498; `AdminDashboard.tsx` 5606–5626). Open drafts created 2026-09-22 include #395 (TBC WAITING_FOR_TELEMETRY, 0 rows), #422 (GTAD architecture, same Phase 1 extras as #352), #418 (VAL library), #398 (SDA catalog), #424 (prior TADD matrix), plus formations/AI/LHIPS/WDD copies. Same-hour 2026-09-23 drafts already include #450 (GTAD 09-23 copy). TADD-2026-09-22-001 already fenced the 09-21 swarm (#333 TBC, #352 GTAD, #355 VAL, #371 SDE). None of those drafts are on `main`. Charting their proposed maps or TBC “0 rows” as live series would invent data.  
SYSTEMS_AFFECTED: Future Health implementers / hunters; do not touch RAF, map gen, turn logic, or damage math to “add telemetry.”  
RECOMMENDED_ACTION: Health reads only `LIVE_SNAPSHOT` APIs on the deployed actor and the AQA-012 seven counters after those ship. Ignore queued 09-21 **and** 09-22 **and** same-hour 09-23 docs as collectors. Do not paint TBC “0 rows” as zero battles. Do not chart SDE observe/owned, VAL load failures, formation/elite/AI usage, or `longHorizonSim`. Keep WX local `ownedIds` (`WorldExploration.tsx` 2421–2433) labeled retirement gating. Keep H12 as the seven-counter strip; do not pre-build #450/#422/#352 Phase 1 extras (battle start/defeat/flee, Q-015, Q-016).  
AUTONOMY: POLICY — no code  
DEPENDENCIES: TADD-2026-09-22-001; TADD-2026-09-22-002; TADD-2026-09-21-005; TADD-2026-09-21-006  
REGRESSION_RISK: LOW. Residual risk is an implementer wiring Health to a 09-22 draft filename because it is newer than #352.  
VALIDATION_REQUIRED: Next Health PR cites canister methods that exist on `main` (or AQA-012 after it ships). Network inspector on Health still shows no principals, emails, or GameKeys.  
STATUS: NEW  

---

ACTION_ID: TADD-2026-09-23-002  
SOURCE_AUTOMATION: Telemetry Admin Dashboard Designer  
TITLE: Restack unmerged TADD matrices as one Health card set — do not concatenate H1–H14  
CATEGORY: process  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Three TADD design PRs now sit on the same SHA `0f5363f`: #345 (09-21 full matrix + H9/H2/EOP/PII deltas), #424 (09-22 process fence; docs-only, no README), and this 09-23 refresh. Oldest-first stack-compat **unions** overlapping files; it must not concatenate three copies of H6/H9/H14 into AdminDashboard. Duplicate `export function` copies fail Caffeine `vite build`. The 09-22 memory already said not to re-open a PR that only restates H1–H14; this ID records the implementer rule for when those docs do land. Next TADD cron should skip a fourth matrix unless `origin/main` moves, AQA-012 ships, a Health tab lands, a custom-URL loader lands, SDE persist maps land, or a new owner aggregate ships.  
SYSTEMS_AFFECTED: Future Health tab (`AdminDashboard` only); TADD docs PRs; do not edit persist writers  
RECOMMENDED_ACTION: When a human picks TADD-002, implement **one** H1–H14 layout from the support matrix. Treat #345/#424/this file as dated captions on the same spec. Union README index rows; do not paste three Health sections. Do not open another TADD dashboard PR that only restates H1–H14 while HEAD stays `0f5363f` and AQA-012 is unshipped.  
AUTONOMY: POLICY — no production code  
DEPENDENCIES: TADD-2026-08-31-002; TADD-2026-09-22-001; open PRs #345 and #424 (docs union, not UI concatenate)  
REGRESSION_RISK: MEDIUM if an implementer copies H6 three times (esbuild duplicate export / vanity empty states). LOW if one card set.  
VALIDATION_REQUIRED: Health tab has one H6 GameKey funnel, one H9 master-finish scalar, one H14 action histogram. `python3 scripts/check-duplicate-exports.py src/frontend/src` stays clean.  
STATUS: NEW  
