# Telemetry Admin Dashboard Designer — ACTION_IDs (2026-09-22)

Source automation: Telemetry Admin Dashboard Designer (`4b026695`).  
Design only. No production code in this run.

`origin/main` is still `0f5363f` — the same SHA as unmerged
[PR #345](https://github.com/Mr-Melic/stralt/pull/345). Prior IDs
`TADD-2026-08-31-001` … `007`, `AQA-2026-08-30-012`,
`TADD-2026-09-01-002` … `005`, `TADD-2026-09-02-001` … `006`, and
`TADD-2026-09-21-001` … `006` remain **OPEN** except: bindgen half of
`TADD-2026-09-01-001` is **done**; `TADD-2026-09-02-002` dual-path shop
wording is **superseded** by `TADD-2026-09-21-001`. Do not open a second
counter set. This file is the process delta after the 2026-09-21 sibling
PR swarm, not a restatement of H1–H13.

---

ACTION_ID: TADD-2026-09-22-001  
SOURCE_AUTOMATION: Telemetry Admin Dashboard Designer  
TITLE: Do not treat queued 2026-09-21 sibling design PRs as Health data sources  
CATEGORY: process  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `origin/main` is still `0f5363f`. Re-inventory found 0 product hits for `recordTelemetry` / `telemetrySidecar` / `adminGetTelemetry` / `telemetryLifetime`. No `tab: "health"` (`gameTypes.ts` 482–498). Open drafts created the same hour as #345 include #333 (TBC WAITING_FOR_TELEMETRY, 0 rows), #352 (GTAD architecture), #355 (VAL library), #371 (SDE observe→win), #348/#349/#351 (formations / elites / AI), and #357 (LHIPS synthetic). #345 itself listed only older #327/#331. None of those drafts are on `main`. Charting their proposed maps as live series would invent data.  
SYSTEMS_AFFECTED: Future Health implementers / hunters; do not touch RAF, map gen, turn logic, or damage math to “add telemetry.”  
RECOMMENDED_ACTION: Health reads only `LIVE_SNAPSHOT` APIs on the deployed actor and the AQA-012 seven counters after those ship. Ignore queued docs as collectors. Do not paint TBC “0 rows” as zero battles. Do not chart SDE observe/owned, VAL load failures, formation/elite/AI usage, or `longHorizonSim`. Keep WX local `ownedIds` (`WorldExploration.tsx` 2421–2433) labeled retirement gating.  
AUTONOMY: POLICY — no code  
DEPENDENCIES: TADD-2026-09-21-005; TADD-2026-09-21-006; TADD-2026-09-02-006  
REGRESSION_RISK: LOW. Residual risk is an implementer wiring Health to a draft filename.  
VALIDATION_REQUIRED: Next Health PR cites canister methods that exist on `main` (or AQA-012 after it ships). Network inspector on Health still shows no principals, emails, or GameKeys.  
STATUS: NEW  

---

ACTION_ID: TADD-2026-09-22-002  
SOURCE_AUTOMATION: Telemetry Admin Dashboard Designer  
TITLE: Do not pre-build Health widgets for GTAD Phase 1 extras beyond the AQA-012 seven counters  
CATEGORY: telemetry  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Unmerged PR #352 (`TELEMETRY_ARCHITECTURE_2026-09-21.md`) Phase 1 names battles started / victory / defeat / flee plus quality series Q-015 (`settleOneShotAfterCredit` commit\|release\|keep) and Q-016 (`shouldSkipAbsoluteDokaWrite`). Those persist helpers exist on `main` as **wallet safety**, not increment maps. AQA-012 / TADD-2026-08-31-001 still approve **only** persist-ok, persist-fail, death-penalty applied, victory paid, recap opened, recap dismissed, shop credit committed. TADD policy: expanding 012 needs a new human-approved ID. Empty Q-015/Q-016 tiles would look like “zero one-shot failures.”  
SYSTEMS_AFFECTED: Health H12 / H13 only; do not change `dokaPersist.ts` / `progressPersist.ts` writers  
RECOMMENDED_ACTION: Keep H12 as the seven-counter strip (or “not shipped”). Put battle start/defeat/flee and one-shot/absolute-write outcomes on H13 “not measured” until a human expands 012 **and** the maps exist. Do not increment AQA-012 counters from `settleOneShotAfterCredit` or `shouldSkipAbsoluteDokaWrite`. Shop credit still ticks only when `shouldCommitGameKeyRedeem` is true.  
AUTONOMY: POLICY — implement captions with TADD-002 / H12  
DEPENDENCIES: AQA-2026-08-30-012; TADD-2026-08-31-001; TADD-2026-09-21-001; GTAD-2026-09-21 (queued, not a Health source)  
REGRESSION_RISK: MEDIUM if someone adds H15/H16 zeros that owners read as “one-shot path is healthy.” LOW if H13 lists them as not measured.  
VALIDATION_REQUIRED: Health Game section has no “one-shot settle = 0” / “battles started = 0” empty state. Next Quality Auditor still marks those series INCONCLUSIVE unless a human ID shipped them.  
STATUS: NEW  
