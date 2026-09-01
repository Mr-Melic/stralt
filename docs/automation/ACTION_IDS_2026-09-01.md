# ACTION_IDs — 2026-09-01 Telemetry-Driven Balance & Content Analyst

Durable ledger for the Master Technical Director and Report Action Orchestrator.  
Source: Telemetry-Driven Balance & Content Analyst (`2786666f-a4a0-11f1-a7d1-d6b4613131ce`).  
Full report: [`TELEMETRY_BALANCE_2026-09-01.md`](./TELEMETRY_BALANCE_2026-09-01.md).  
This run ships **docs only**. No balance or collector implementation.

---

## Still-open IDs (not re-filed)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| `AQA-2026-08-30-012` | NEW | Smallest persist/victory/recap/shop counters. Still unimplemented at HEAD `dd275aa`. |
| `TBC-2026-08-31-001` | NEW | Keep this analyst gated until real rows exist. Validation from that ID: this report is still `WAITING_FOR_TELEMETRY` with a fresh search. |
| `TBC-2026-08-31-002` | NEW | Human-designed `battle_end` / `spell_cast` / discovery / Doka ledger set. Depends on AQA-012. |

Do not open a second persist-counter PR. Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID.

---

ACTION_ID: TBC-2026-09-01-001  
SOURCE_AUTOMATION: Telemetry-Driven Balance & Content Analyst  
TITLE: Do not treat design docs, longHorizonSim, or debug click-trace as live telemetry  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: After the 2026-08-31 TBC run, `TELEMETRY_ARCHITECTURE_2026-08-31.md`, `TELEMETRY_DASHBOARD_2026-08-31.md`, and `longHorizonSim.ts` landed. Architecture/dashboard texts state they are design-only and that increment APIs are unimplemented. `longHorizonSim.ts` 432–437 sets `telemetry.available: false`; `longHorizonSim.test.ts` asserts that. `clickTrace.ts` is DEV-only (capacity 20, local). `src/backend` still has no `recordTelemetryIncrements`. Open collector PRs: 0.  
SYSTEMS_AFFECTED: Master Technical Director priority queue; Quality Auditor / Game Balance specialists; this analyst’s next cron  
RECOMMENDED_ACTION: When scoring or scheduling 2026-09-01 work, classify those artifacts as DESIGN / SYNTHETIC / DEBUG. Do not open enemy, spell, XP, or Doka retune PRs from them. Leave TBC in WAITING_FOR_TELEMETRY until collectors 1–9 exist and ≥1 UTC day of rows is queryable.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None  
REGRESSION_RISK: LOW (documentation / priority hygiene only).  
VALIDATION_REQUIRED: Next director or TBC run either still cites WAITING_FOR_TELEMETRY, or cites real event counts with sample sizes — not sim output.  
STATUS: NEW
