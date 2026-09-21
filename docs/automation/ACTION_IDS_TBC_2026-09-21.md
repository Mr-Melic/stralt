# ACTION_IDs — 2026-09-21 Telemetry-Driven Balance & Content Analyst

Durable ledger for the Master Technical Director and Report Action Orchestrator.  
Source: Telemetry-Driven Balance & Content Analyst (`2786666f-a4a0-11f1-a7d1-d6b4613131ce`).  
Full report: [`TELEMETRY_BALANCE_2026-09-21.md`](./TELEMETRY_BALANCE_2026-09-21.md).  
This run ships **docs only**. No balance or collector implementation.

---

## Still-open IDs (not re-filed)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| `AQA-2026-08-30-012` | NEW | Smallest persist/victory/recap/shop counters. Still unimplemented at HEAD `0f5363f`. Implement **off** the persist lock (`GTAD-2026-09-01-002`); do not enqueue on `progressPersistRef`. |
| `TBC-2026-08-31-001` | NEW | Keep this analyst gated until real rows exist. Validation from that ID: this report is still `WAITING_FOR_TELEMETRY` with a fresh search. |
| `TBC-2026-08-31-002` | NEW | Human-designed `battle_end` / `spell_cast` / discovery / Doka ledger set. Depends on AQA-012. Names must not be confused with SFX. |
| `TBC-2026-09-01-001` | NEW | Do not treat design docs, `longHorizonSim`, or debug click-trace as live telemetry. Still applies (`#283` / `#295` remain design-only). |
| `TBC-2026-09-02-001` | NEW | Collectors still absent after GameKey shop. Superseded as “latest HEAD check” by `TBC-2026-09-21-001`; do not re-file. |
| `TBC-2026-09-02-002` | NEW | SoundEvent `spell_cast` / `battle_end` are audio, not telemetry. Still true at `useSoundHooks.ts` 7–16. |

Do not open a second persist-counter PR. Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID.

---

ACTION_ID: TBC-2026-09-21-001  
SOURCE_AUTOMATION: Telemetry-Driven Balance & Content Analyst  
TITLE: After 158 commits / 70 merge PRs through #332, collectors and event rows are still absent  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: HEAD `0f5363f` (`#332` report orchestration, 2026-09-03). Prior TBC at `58302bc`. `src/backend` and bindgen have 0 `recordTelemetry` / `adminGetTelemetry` / `telemetrySidecar` hits. GitHub code search for those symbols: `total_count: 0`. Open collector PRs: 0 (`#327` Striker, `#331` destack). `longHorizonSim.ts` 532–536 still `telemetry.available: false` (asserted at `longHorizonSim.test.ts` 67). Persistence table (`docs/ARCHITECTURE.md` 37–50) has no event store. AdminDashboard tabs 5611–5626 have no Intelligence tab. OQL `Expose` has no telemetry entity. Event dumps: 0 `csv`/`jsonl`/`parquet` files. Telemetry-named merges `#283` and `#295` are docs.  
SYSTEMS_AFFECTED: Master Technical Director priority queue; Quality Auditor / Game Balance specialists; this analyst’s next cron; `longHorizonSim.telemetry.available`  
RECOMMENDED_ACTION: Keep TBC in WAITING_FOR_TELEMETRY. Do not open enemy, spell, XP, Doka, or GameKey retune PRs from this run. Do not treat `#283`/`#295` design docs or the 158-commit window as telemetry. Leave the gate until collectors 1–9 exist and ≥1 UTC day of rows is queryable.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None (does not re-file AQA-012 / TBC-08-31-002)  
REGRESSION_RISK: LOW (documentation / priority hygiene only).  
VALIDATION_REQUIRED: Next director or TBC run either still cites WAITING_FOR_TELEMETRY, or cites real event counts with sample sizes — not sim output, not SFX names, not wallet snapshots, not OQL progress entities.  
STATUS: NEW

---

ACTION_ID: TBC-2026-09-21-002  
SOURCE_AUTOMATION: Telemetry-Driven Balance & Content Analyst  
TITLE: No in-repo TBC ledger from 2026-09-03 through 2026-09-20; calendar gap is not play data  
CATEGORY: telemetry  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Repo glob `TELEMETRY_BALANCE_*` stops at 2026-09-02. GitHub commit search `TELEMETRY_BALANCE` has no hits after `#260`. `origin/main` tip author-date is 2026-09-03. This cron is 2026-09-21. No collector PR filled the gap.  
SYSTEMS_AFFECTED: TBC cron hygiene; Master Technical Director “latest specialist packet” assumption  
RECOMMENDED_ACTION: Do not treat the 18-day silence as a player sample or as proof that instrumentation shipped off-repo. Next TBC must re-search collectors. This agent cannot patch Cursor dashboard prompts (no write API).  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None  
REGRESSION_RISK: LOW (process note). HIGH only if a later run treats “no report” as “healthy balance.”  
VALIDATION_REQUIRED: Next TBC report exists in `docs/automation/` with a fresh HEAD search, still WAITING or with real row counts.  
STATUS: NEW
