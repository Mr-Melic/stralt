# ACTION_IDs — 2026-09-25 Telemetry-Driven Balance & Content Analyst

Durable ledger for the Master Technical Director and Report Action Orchestrator.  
Source: Telemetry-Driven Balance & Content Analyst (`2786666f-a4a0-11f1-a7d1-d6b4613131ce`).  
Full report: [`TELEMETRY_BALANCE_2026-09-25.md`](./TELEMETRY_BALANCE_2026-09-25.md).  
This run ships **docs only**. No balance or collector implementation.

---

## Still-open IDs (not re-filed)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| `AQA-2026-08-30-012` | NEW | Smallest persist/victory/recap/shop counters. Still unimplemented at HEAD `0f5363f`. Implement **off** the persist lock (`GTAD-2026-09-01-002`); do not enqueue on `progressPersistRef`. |
| `TBC-2026-08-31-001` | NEW | Keep this analyst gated until real rows exist. Validation from that ID: this report is still `WAITING_FOR_TELEMETRY` with a fresh search. |
| `TBC-2026-08-31-002` | NEW | Human-designed `battle_end` / `spell_cast` / discovery / Doka ledger set. Depends on AQA-012. Names must not be confused with SFX. |
| `TBC-2026-09-01-001` | NEW | Do not treat design docs, `longHorizonSim`, or debug click-trace as live telemetry. Still applies. |
| `TBC-2026-09-02-001` | NEW | Another UTC day of gameplay merges still produced 0 collectors / 0 rows (on `58302bc`). Still true at `0f5363f`. |
| `TBC-2026-09-02-002` | NEW | Do not treat sound-engine `spell_cast` / `battle_end` as telemetry. Still true. |
| `TBC-2026-09-21-001` | NEW | Unmerged `#333`. Same SHA `0f5363f`; still WAITING. |
| `TBC-2026-09-21-002` | NEW | Unmerged `#333`. Unmerged telemetry-named PRs are not live data. |
| `TBC-2026-09-22-001` | NEW | Unmerged `#395`. Same SHA; still 0 collectors. |
| `TBC-2026-09-22-002` | NEW | Unmerged `#395`. Do not treat unmerged telemetry PRs as rows. |
| `TBC-2026-09-23-001` | NEW | Unmerged `#462`. Same SHA; 126 open drafts at that run. |
| `TBC-2026-09-23-002` | NEW | Unmerged `#462`. Unmerged telemetry-named PRs are not live data. |
| `TBC-2026-09-24-001` | NEW | Unmerged `#502`. Same SHA; 171 open drafts at that run. |
| `TBC-2026-09-24-002` | NEW | Unmerged `#502`. Unmerged telemetry-named PRs and BAL `#472` are not live data. |

Do not open a second persist-counter PR. Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID.

---

ACTION_ID: TBC-2026-09-25-001  
SOURCE_AUTOMATION: Telemetry-Driven Balance & Content Analyst  
TITLE: Fifth UTC day on frozen main 0f5363f — collectors and event rows still absent  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: HEAD `0f5363f` (`#332`, last `main` commit 2026-09-03 00:28 UTC). Same SHA as TBC 09-21 / 09-22 / 09-23 / 09-24. `src/backend` has 0 `telemetry` hits. Bindgen `backend.ts` (4817 lines) has 0 telemetry methods. GitHub code search `recordTelemetry` / `telemetrySidecar` / `adminGetTelemetry`: `total_count: 0`. Open collector PRs: 0. Open PRs targeting `main`: **225** (was 171 on 09-24). `longHorizonSim.ts` 532–536 still `telemetry.available: false` (asserted at `longHorizonSim.test.ts` 67). Persistence table (`docs/ARCHITECTURE.md` 37–50) has no event store. AdminDashboard tabs 5611–5625 have no Intelligence tab. Event dumps: 0 `csv`/`jsonl`/`parquet` files.  
SYSTEMS_AFFECTED: Master Technical Director priority queue; Quality Auditor / Game Balance specialists; this analyst’s next cron; `longHorizonSim.telemetry.available`  
RECOMMENDED_ACTION: Keep TBC in WAITING_FOR_TELEMETRY. Do not open enemy, spell, XP, Doka, or GameKey retune PRs from this run. Do not treat the 225-draft queue or frozen `main` as telemetry. Leave the gate until collectors 1–9 exist and ≥1 UTC day of rows is queryable.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None (does not re-file AQA-012 / TBC-08-31-002 / prior TBC daily IDs)  
REGRESSION_RISK: LOW (documentation / priority hygiene only).  
VALIDATION_REQUIRED: Next director or TBC run either still cites WAITING_FOR_TELEMETRY, or cites real event counts with sample sizes — not sim output, not SFX names, not wallet snapshots, not unmerged docs, not BAL `#472` / `#505`.  
STATUS: NEW

---

ACTION_ID: TBC-2026-09-25-002  
SOURCE_AUTOMATION: Telemetry-Driven Balance & Content Analyst  
TITLE: Unmerged telemetry-named PRs and BAL #472 / #505 are not live telemetry  
CATEGORY: telemetry  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Open TBC drafts `#333` / `#395` / `#462` / `#502` are dated WAITING reports only. Architecture `#352` / `#422` / `#450` / `#527` and dashboard `#345` / `#424` / `#455` / `#504` are design docs. `gh search prs` for collector symbols returned docs titles only. `#472` / `#505` are `GAME_BALANCE_*.md` (source analysis, not event rows). SoundEvent names remain audio: `useSoundHooks.ts` 7–16, `soundEngine.ts` 272–275 / 306–310.  
SYSTEMS_AFFECTED: TBC / Quality Auditor / BAL search methodology; `longHorizonSim.telemetry.available`; Master Technical Director intake  
RECOMMENDED_ACTION: Classify unmerged telemetry-named PRs and BAL docs as non-data. Classify `playSound("spell_cast"|"battle_end")` as audio. Do not flip the adequacy gate or `telemetry.available` from those strings, from open-PR counts, or from GAME_BALANCE write-ups.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None  
REGRESSION_RISK: LOW (search hygiene). HIGH only if someone later wires SFX dispatch into persist or treats draft docs as a win/loss counter.  
VALIDATION_REQUIRED: Next TBC grep table still separates SFX, unmerged docs, and BAL reports from collectors; `longHorizonSim.telemetry.available` stays false until real APIs are populated.  
STATUS: NEW
