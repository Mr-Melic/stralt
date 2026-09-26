# Mechanic interaction matrix — 2026-09-26

**Auditor:** Mechanic Interaction Matrix Auditor  
**HEAD:** `0f5363f` (unchanged since #332 / 09-21…09-25 matrices)  
**Gameplay code:** not modified.

Pairs are scored only when current source shows a real join. Do not re-file OPEN 08-31 / 09-01 / 09-02 / 09-21 / 09-22 / 09-23 / 09-24 / 09-25 items. Do not clone in-flight **#327** / **#331** / **#336** / **#370** / **#376** / **#379** / **#380** / **#382** / **#386** / **#389** / **#391** / **#410** / **#443** / **#467** / **#476** / **#487** / **#489** / **#491** / **#495** / **#496** / **#498** / **#508** / **#524** / **#541** / **#543** / **#546** / **#547** / **#550** / **#551** / **#553** / **#554** / **#555** / **#566** / **#596** / **#597** / **#598** / **#599** / **#601** / **#602** / **#604** / **#606** / **#607**.

## Focus this run

| Modifier / pair | Verdict |
| :--- | :--- |
| Time Warp | **Wired** — 15s timer via `isTimeWarp` (WX 14036–14038, 14778–14806). Do not file. |
| Chaos Initiative | **Broken join** — hook runs; `turnOrderRef` / `liveTurnOrder` discard the shuffle. **MIMA-2026-09-26-001**. |
| Vampiric Ground × healUsed / no_healing | Already **09-21-001**. Do not re-file. |
| Paper Windstorm consume vs targeting | Targeting does not read the active set; miss vs announce is **PXA**. Skip. |
| Titans 1–5× | Same `onDamageDealt` miss as Glass — **09-23-001**. Skip. |

## New ACTION_IDs

`docs/automation/ACTION_IDS_MIMA_2026-09-26.md` — **001** only.

## Matrix (evidence-backed, this focus)

| Pair | Should they interact? | Do they? | Deterministic? | Contradictory state? | Bypass? | Player feedback? | Regression tests? | Why distinct |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Chaos Initiative × turn-queue authority (strip vs `turnOrderRef`) | Yes — announce “reshuffles each round” | Hook called at wrap-to-0 (WX 14717–14721); `liveTurnOrder` prefers unsynced ref (`turnQueue.ts` 135–137; WX 14099) | Hook uses `Math.random()` (non-deterministic even if synced) | Yes — React strip / `battleTurnOrderForUi` can show shuffled order; AI / `isPlayerTurn` read ref | Gameplay never leaves initiative (or last store) order | Chip + announce fire; strip may lie about who is next | None for sort+ref sync | Not 09-24-001 (Mist/Winds HP copy); not a placeholder — call site exists but authority is the ref |

## Non-findings (do not invent)

- Time Warp **is** wired (15s).
- Vampiric × challenge healUsed stays under **09-21-001** (and 09-23-001’s “do not re-file Vampiric stub”).
- Titans 1–5× stays under **09-23-001** (primary / incoming miss); Titans +1000 vs `hpMap` under **09-23-002**.
- Paper Windstorm: `targeting.ts` has no windstorm branch; consume miss + announce lie remain **PXA**.
- Gravity Well / Fog unused placeholders; Blood Moon / Mirror Field wired in `spellEngine`; push/pull unwired; Drain / Wisp healUsed closed — unchanged.

Actionable record: [`ACTION_IDS_MIMA_2026-09-26.md`](./ACTION_IDS_MIMA_2026-09-26.md).
