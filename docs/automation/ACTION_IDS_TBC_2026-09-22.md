# ACTION_IDs — 2026-09-22 Telemetry-Driven Balance & Content Analyst

Durable ledger for the Master Technical Director and Report Action Orchestrator.  
Source: Telemetry-Driven Balance & Content Analyst (`2786666f-a4a0-11f1-a7d1-d6b4613131ce`).  
Full report: [`TELEMETRY_BALANCE_2026-09-22.md`](./TELEMETRY_BALANCE_2026-09-22.md).  
This run ships **docs only**. No balance or collector implementation.

---

## Still-open IDs (not re-filed)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| `AQA-2026-08-30-012` | NEW | Smallest persist/victory/recap/shop counters. Still unimplemented at HEAD `0f5363f`. Implement **off** the persist lock (`GTAD-2026-09-01-002`); do not enqueue on `progressPersistRef`. |
| `TBC-2026-08-31-001` | NEW | Keep this analyst gated until real rows exist. Validation from that ID: this report is still `WAITING_FOR_TELEMETRY` with a fresh search. |
| `TBC-2026-08-31-002` | NEW | Human-designed `battle_end` / `spell_cast` / discovery / Doka ledger set. Depends on AQA-012. Names must not be confused with SFX. |
| `TBC-2026-09-01-001` | NEW | Do not treat design docs, `longHorizonSim`, or debug click-trace as live telemetry. Still applies (`#345` / `#352` / `#357` remain design or synthetic). |
| `TBC-2026-09-02-001` | NEW | Collectors still absent after GameKey shop. Superseded as “latest HEAD check” by later TBC IDs; do not re-file. |
| `TBC-2026-09-02-002` | NEW | SoundEvent `spell_cast` / `battle_end` are audio, not telemetry. Still true at `useSoundHooks.ts` 7–16. |
| `TBC-2026-09-21-001` | NEW | 158 commits / 70 first-parent merges through `#332` still 0 collectors. Filed on unmerged `#333`; do not re-file. |
| `TBC-2026-09-21-002` | NEW | No in-repo TBC ledger 2026-09-03..2026-09-20 on `main`; calendar gap is not play data. Filed on unmerged `#333`; do not re-file. |

Do not open a second persist-counter PR. Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID.

---

ACTION_ID: TBC-2026-09-22-001  
SOURCE_AUTOMATION: Telemetry-Driven Balance & Content Analyst  
TITLE: Another UTC day later, main is still 0f5363f with 61 open drafts and 0 collectors / 0 event rows  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: HEAD `0f5363f` (`#332`, author date 2026-09-03). `git fetch origin/main` unchanged vs 2026-09-21 TBC. `src/backend` and bindgen have 0 `recordTelemetry` / `adminGetTelemetry` / `telemetrySidecar` hits. GitHub code search for those symbols: `total_count: 0`. Open PRs vs `main`: 61, all draft; collector-implementation PRs: 0. `longHorizonSim.ts` 532–536 still `telemetry.available: false` (asserted at `longHorizonSim.test.ts` 67). Persistence table (`docs/ARCHITECTURE.md` 37–50) has no event store. AdminDashboard tabs 5611–5626 have no Intelligence tab. OQL `Expose` 3498–3882 has no telemetry entity. Event dumps: 0 `csv`/`jsonl`/`parquet` files.  
SYSTEMS_AFFECTED: Master Technical Director priority queue; Quality Auditor / Game Balance specialists; this analyst’s next cron; `longHorizonSim.telemetry.available`  
RECOMMENDED_ACTION: Keep TBC in WAITING_FOR_TELEMETRY. Do not open enemy, spell, XP, Doka, or GameKey retune PRs from this run. Do not treat the 61-draft flock as telemetry. Leave the gate until collectors 1–9 exist and ≥1 UTC day of rows is queryable.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None (does not re-file AQA-012 / TBC-08-31-002 / TBC-09-21-001)  
REGRESSION_RISK: LOW (documentation / priority hygiene only).  
VALIDATION_REQUIRED: Next director or TBC run either still cites WAITING_FOR_TELEMETRY, or cites real event counts with sample sizes — not sim output, not SFX names, not wallet snapshots, not OQL progress entities, not open-PR counts.  
STATUS: NEW

---

ACTION_ID: TBC-2026-09-22-002  
SOURCE_AUTOMATION: Telemetry-Driven Balance & Content Analyst  
TITLE: Unmerged telemetry-named PRs 333/345/352 and sim 357 are not live telemetry or a landed TBC ledger  
CATEGORY: telemetry  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: `#333` `docs: WAITING_FOR_TELEMETRY balance report (2026-09-21)` still draft/open (`created_at` 2026-09-21T00:07:58Z). `#345` Health matrix and `#352` architecture are design docs. `#357` long-horizon sim is synthetic (`telemetry.available === false` on `main` at `longHorizonSim.ts` 532–536). `origin/main` does not contain `TELEMETRY_BALANCE_2026-09-21.md`. GitHub collector symbol search still `total_count: 0`.  
SYSTEMS_AFFECTED: TBC / Quality Auditor search methodology; Master Technical Director “latest specialist packet” assumption; `longHorizonSim.telemetry.available`  
RECOMMENDED_ACTION: Treat `#333` as an unmerged sibling. Do not flip the adequacy gate from `#345`/`#352`/`#357`. Do not assume the 2026-09-21 TBC IDs exist on `main` until `#333` merges. Next TBC must re-search collectors.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: None  
REGRESSION_RISK: LOW (search hygiene). HIGH only if a later run treats an open design PR as populated telemetry.  
VALIDATION_REQUIRED: Next TBC grep table still separates design PRs / SFX / sim from collectors; `longHorizonSim.telemetry.available` stays false until real APIs are populated.  
STATUS: NEW
