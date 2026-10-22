# ACTION_IDs — 2026-10-22 Telemetry-Driven Balance & Content Analyst

Durable ledger for the Master Technical Director and Report Action Orchestrator.  
Source: Telemetry-Driven Balance & Content Analyst (`2786666f-a4a0-11f1-a7d1-d6b4613131ce`).  
Full report: [`TELEMETRY_BALANCE_2026-10-22.md`](./TELEMETRY_BALANCE_2026-10-22.md).  
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
| `TBC-2026-09-21-002` | NEW | Unmerged `#333`. Calendar gap / unmerged telemetry-named PRs are not live data. |
| `TBC-2026-09-22-001` | NEW | Unmerged `#395`. Same SHA; still 0 collectors. |
| `TBC-2026-09-22-002` | NEW | Unmerged `#395`. Do not treat unmerged telemetry PRs as rows. |
| `TBC-2026-09-23-001` | NEW | Unmerged `#462`. Same SHA; 126 open drafts at that run. |
| `TBC-2026-09-23-002` | NEW | Unmerged `#462`. Unmerged telemetry-named PRs are not live data. |
| `TBC-2026-09-24-001` | NEW | Unmerged `#502`. Same SHA; 171 open drafts at that run. |
| `TBC-2026-09-24-002` | NEW | Unmerged `#502`. Unmerged telemetry-named PRs and BAL `#472` are not live data. |
| `TBC-2026-09-25-001` | NEW | Unmerged `#556`. Same SHA; 225 open drafts at that run. |
| `TBC-2026-09-25-002` | NEW | Unmerged `#556`. Unmerged telemetry-named PRs and BAL `#472` / `#505` are not live data. |
| `TBC-2026-09-26-001` | NEW | Unmerged `#609`. Same SHA; 278 open drafts at that run. |
| `TBC-2026-09-26-002` | NEW | Unmerged `#609`. Unmerged telemetry-named PRs and BAL `#472` / `#505` / `#582` are not live data. |
| `TBC-2026-09-27-001` | NEW | Unmerged `#661`. Same SHA; 328 open drafts at that run. |
| `TBC-2026-09-27-002` | NEW | Unmerged `#661`. Unmerged telemetry-named PRs and BAL `#472` / `#505` / `#582` / `#640` are not live data. |
| `TBC-2026-09-28-001` | NEW | Unmerged `#725`. Same SHA; 383 open drafts at that run. |
| `TBC-2026-09-28-002` | NEW | Unmerged `#725`. Unmerged telemetry-named PRs and BAL `#472` / `#505` / `#582` / `#640` / `#675` are not live data. |
| `TBC-2026-09-29-001` | NEW | Unmerged `#768`. Same SHA; 436 open drafts at that run. |
| `TBC-2026-09-29-002` | NEW | Unmerged `#768`. Unmerged telemetry-named PRs and BAL `#472` / `#505` / `#582` / `#640` / `#675` / `#736` are not live data. |
| `TBC-2026-10-21-001` | NEW | Unmerged `#833`. Tenth inspection of frozen `0f5363f`; 491 drafts; 0 collectors. |
| `TBC-2026-10-21-002` | NEW | Unmerged `#833`. Unmerged telemetry-named PRs, BAL through `#779`, and the 09-30..10-20 TBC silence are not live data. |

Do not open a second persist-counter PR. Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID.

---

ACTION_ID: TBC-2026-10-22-001  
SOURCE_AUTOMATION: Telemetry-Driven Balance & Content Analyst  
TITLE: Eleventh inspection of frozen main 0f5363f — collectors and event rows still absent  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: HEAD `0f5363f` (`#332`, last `main` commit 2026-09-03 00:28 UTC). Same SHA as TBC 09-21 through 09-29 and 10-21. `src/backend` has 0 `telemetry` hits. Bindgen `backend.ts` (4817 lines) has 0 telemetry methods. GitHub code search `recordTelemetryIncrements` / `telemetrySidecar` / `adminGetTelemetrySnapshot`: `total_count: 0`. Open collector PRs: 0. Open PRs targeting `main`: **538** all drafts (was 491 on 10-21 TBC; +47 since that search cutoff `#822`). `longHorizonSim.ts` 532–536 still `telemetry.available: false` (asserted at `longHorizonSim.test.ts` 67). Persistence table (`docs/ARCHITECTURE.md` 37–50) has no event store. AdminDashboard tabs 5611–5625 have no Intelligence tab. Event dumps: 0 `csv`/`jsonl`/`parquet` files. Last TBC draft `#833` still unmerged. Last `main` merge is **49** calendar days before this run.  
SYSTEMS_AFFECTED: Master Technical Director priority queue; Quality Auditor / Game Balance specialists; this analyst’s next cron; `longHorizonSim.telemetry.available`  
RECOMMENDED_ACTION: Keep TBC in WAITING_FOR_TELEMETRY. Do not open enemy, spell, XP, Doka, or GameKey retune PRs from this run. Do not treat the 538-draft queue, frozen `main`, or unmerged `#833` as telemetry. Leave the gate until collectors 1–9 exist and ≥1 UTC day of rows is queryable.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None (does not re-file AQA-012 / TBC-08-31-002 / prior TBC daily IDs)  
REGRESSION_RISK: LOW (documentation / priority hygiene only).  
VALIDATION_REQUIRED: Next director or TBC run either still cites WAITING_FOR_TELEMETRY, or cites real event counts with sample sizes — not sim output, not SFX names, not wallet snapshots, not unmerged docs, not calendar gaps, not BAL `#472` / `#505` / `#582` / `#640` / `#675` / `#736` / `#779`.  
STATUS: NEW

---

ACTION_ID: TBC-2026-10-22-002  
SOURCE_AUTOMATION: Telemetry-Driven Balance & Content Analyst  
TITLE: Unmerged telemetry-named PRs including #833 / #816 / #827 / #819, and BAL #472 / #505 / #582 / #640 / #675 / #736 / #779, are not live telemetry  
CATEGORY: telemetry  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Open TBC drafts `#333` / `#395` / `#462` / `#502` / `#556` / `#609` / `#661` / `#725` / `#768` / `#833` are dated WAITING reports only. Architecture `#352` / `#422` / `#450` / `#527` / `#583` / `#641` / `#682` / `#722` / `#806` / `#816` and dashboard `#345` / `#424` / `#455` / `#504` / `#559` / `#616` / `#668` / `#750` / `#801` / `#827` are design docs. LHIPS `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` / `#777` / `#819` remain synthetic. GitHub search for collector symbols returned no implementation titles. `#472` / `#505` / `#582` / `#640` / `#675` / `#736` / `#779` are `GAME_BALANCE_*.md` (source analysis, not event rows). No BAL PR dated 2026-10-21. Post-10-21-TBC opens `#823`–`#869` (20 docs / 23 fix / 2 test / 1 refactor / 1 perf) are not collectors. SoundEvent names remain audio: `useSoundHooks.ts` 7–16, `soundEngine.ts` 272–275 / 306–310. Repo glob on `main` has no `TELEMETRY_BALANCE_*` after 2026-09-02.  
SYSTEMS_AFFECTED: TBC / Quality Auditor / BAL search methodology; `longHorizonSim.telemetry.available`; Master Technical Director intake  
RECOMMENDED_ACTION: Classify unmerged telemetry-named PRs (including `#833` / `#816` / `#827` / `#819`), BAL docs, and open-PR growth as non-data. Classify `playSound("spell_cast"|"battle_end")` as audio. Do not flip the adequacy gate or `telemetry.available` from those strings, from open-PR counts, or from GAME_BALANCE write-ups.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None  
REGRESSION_RISK: LOW (search hygiene). HIGH only if someone later wires SFX dispatch into persist or treats draft docs as a win/loss counter.  
VALIDATION_REQUIRED: Next TBC grep table still separates SFX, unmerged docs, and BAL reports from collectors; `longHorizonSim.telemetry.available` stays false until real APIs are populated.  
STATUS: NEW
