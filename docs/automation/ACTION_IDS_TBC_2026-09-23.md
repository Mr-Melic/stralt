# ACTION_IDs — 2026-09-23 Telemetry-Driven Balance & Content Analyst

Durable ledger for the Master Technical Director and Report Action Orchestrator.  
Source: Telemetry-Driven Balance & Content Analyst (`2786666f-a4a0-11f1-a7d1-d6b4613131ce`).  
Full report: [`TELEMETRY_BALANCE_2026-09-23.md`](./TELEMETRY_BALANCE_2026-09-23.md).  
This run ships **docs only**. No balance or collector implementation.

---

## Still-open IDs (not re-filed)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| `AQA-2026-08-30-012` | NEW | Smallest persist/victory/recap/shop counters. Still unimplemented at HEAD `0f5363f`. Implement **off** the persist lock (`GTAD-2026-09-01-002`); do not enqueue on `progressPersistRef`. |
| `TBC-2026-08-31-001` | NEW | Keep this analyst gated until real rows exist. Validation from that ID: this report is still `WAITING_FOR_TELEMETRY` with a fresh search. |
| `TBC-2026-08-31-002` | NEW | Human-designed `battle_end` / `spell_cast` / discovery / Doka ledger set. Depends on AQA-012. Names must not be confused with SFX. |
| `TBC-2026-09-01-001` | NEW | Do not treat design docs, `longHorizonSim`, or debug click-trace as live telemetry. Still applies (`#345` / `#352` / `#357` / `#422` / `#424` / `#450` / `#455` remain design or synthetic). |
| `TBC-2026-09-02-001` | NEW | Collectors still absent after GameKey shop. Superseded as “latest HEAD check” by later TBC IDs; do not re-file. |
| `TBC-2026-09-02-002` | NEW | SoundEvent `spell_cast` / `battle_end` are audio, not telemetry. Still true at `useSoundHooks.ts` 7–16. |
| `TBC-2026-09-21-001` | NEW | 158 commits / 70 first-parent merges through `#332` still 0 collectors. Filed on unmerged `#333`; do not re-file. |
| `TBC-2026-09-21-002` | NEW | No in-repo TBC ledger 2026-09-03..2026-09-20 on `main`; calendar gap is not play data. Filed on unmerged `#333`; do not re-file. |
| `TBC-2026-09-22-001` | NEW | Frozen `main` + 61 open drafts still 0 collectors. Filed on unmerged `#395`; do not re-file. |
| `TBC-2026-09-22-002` | NEW | Unmerged telemetry-named PRs are not live data. Filed on unmerged `#395`; do not re-file. |

Do not open a second persist-counter PR. Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID.

---

ACTION_ID: TBC-2026-09-23-001  
SOURCE_AUTOMATION: Telemetry-Driven Balance & Content Analyst  
TITLE: After another UTC day, origin/main is still 0f5363f; 126 open drafts still have 0 collectors and 0 event rows  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: HEAD `0f5363f` (`#332`, author date 2026-09-03). Prior TBC on `main` inspected `58302bc` (#260). `58302bc..HEAD` is still 158 commits / 70 first-parent merges. `src/backend` and bindgen have 0 `recordTelemetry` / `adminGetTelemetry` / `telemetrySidecar` hits. GitHub code search for those symbols: `total_count: 0`. Open collector PRs: 0. Open PRs vs `main`: 126, all draft (was 61 at the 2026-09-22 inspect). File-name scan of those 126 PRs for sidecar / `recordTelemetry` / `adminGetTelemetry`: empty. `longHorizonSim.ts` 532–536 still `telemetry.available: false` (asserted at `longHorizonSim.test.ts` 67). Persistence table (`docs/ARCHITECTURE.md` 37–50) has no event store. AdminDashboard tabs 5611–5626 have no Intelligence tab. Event dumps: 0 `csv`/`jsonl`/`parquet` files.  
SYSTEMS_AFFECTED: Master Technical Director priority queue; Quality Auditor / Game Balance specialists; this analyst’s next cron; `longHorizonSim.telemetry.available`  
RECOMMENDED_ACTION: Keep TBC in WAITING_FOR_TELEMETRY. Do not open enemy, spell, XP, Doka, or GameKey retune PRs from this run. Do not treat the 126-draft flock, `#332` freeze, or persist/combat open PRs as telemetry. Leave the gate until collectors 1–9 exist and ≥1 UTC day of rows is queryable.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None (does not re-file AQA-012 / TBC-08-31-002 / TBC-09-21-* / TBC-09-22-*)  
REGRESSION_RISK: LOW (documentation / priority hygiene only).  
VALIDATION_REQUIRED: Next director or TBC run either still cites WAITING_FOR_TELEMETRY, or cites real event counts with sample sizes — not sim output, not SFX names, not wallet snapshots, not open-PR counts.  
STATUS: NEW

---

ACTION_ID: TBC-2026-09-23-002  
SOURCE_AUTOMATION: Telemetry-Driven Balance & Content Analyst  
TITLE: Unmerged telemetry-named PRs and a 61→126 draft queue are not live gameplay telemetry  
CATEGORY: telemetry  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Open drafts `#333` (TBC 09-21, includes README) and `#395` (TBC 09-22, docs-only dated files). Dashboard design: `#345`, `#424`, `#455`. Architecture design: `#352`, `#422`, `#450`. Synthetic sim: `#357`. All `isDraft=true`. None add a collector module. Oldest queue items remain `#327` / `#331` (gameplay, not telemetry). Queue length 126 (`ready: 0`) vs 61 on 2026-09-22 is not a session sample.  
SYSTEMS_AFFECTED: TBC / Quality Auditor search methodology; `longHorizonSim.telemetry.available`; Master Technical Director intake  
RECOMMENDED_ACTION: Cite `#333` / `#395` as unmerged siblings. Do not flip the adequacy gate or `telemetry.available` from design PRs, from this ledger, or from flock size. If collectors later reuse `battle_end` / `spell_cast` names, they must be a distinct backend/export path, not WebAudio and not an open docs PR.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None  
REGRESSION_RISK: LOW (search hygiene). HIGH only if someone later wires SFX dispatch into persist or treats an unmerged design PR as a win/loss counter.  
VALIDATION_REQUIRED: Next TBC grep table still separates SFX, design docs, and open PRs from collectors; `longHorizonSim.telemetry.available` stays false until real APIs are populated.  
STATUS: NEW
