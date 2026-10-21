# Mechanic interaction matrix — 2026-10-21

**Auditor:** Mechanic Interaction Matrix Auditor  
**HEAD:** `0f5363f` (unchanged since #332 / prior 09-21…09-29 memory runs)  
**Gameplay code:** not modified.

Hunt: summons, push/pull (skip unwired), teleport/Swap, AP/MP, range, LoS, terrain, hazards, statuses, boss phases, portals, dungeons. Skip list honored (08-31 / 09-01 / 09-02 / 09-21…09-29 + in-flight #443/#728/#754/#763/#765).

## New ACTION_IDs

| ID | Pair | Severity |
| :--- | :--- | :--- |
| [001](./ACTION_IDS_MIMA_2026-10-21.md) | Summon kit select × walk greens / missing cast ring | P1 |
| [002](./ACTION_IDS_MIMA_2026-10-21.md) | Summon-control hover MP × player origin/wallet | P1 |
| [003](./ACTION_IDS_MIMA_2026-10-21.md) | Controlled-summon unseal slide × green click / MP debit | P1 |

## Hunt verdicts (no new file)

| Pair | Result |
| :--- | :--- |
| Blink / Swap landing × hazards | Already 08-31-001 / #754 |
| Timestep × DoT / lava / status / challenge AP | No new hole; Surge floor = 09-25-001 |
| Enemy summon × portals / hazards / victory leftover | Closed on this HEAD |
| Rest-exit × summons leftover | Closed (`inBattleRef` portal gate + roster replace) |
| Boss phase × live summon HP | Closed (boss/illusion only) |
| LoS through allied summons | No unit opacity for anyone — not a consume asymmetry |
| Range/LoS enemy vs player policy | Documented (`playerSpellRequiresLos` vs `enemySpellRequiresLos`) |
| Push/pull | Unwired REPORT_ONLY — not re-filed |
| Challenge AP from summon-control | Skipped per product note |

## Missing tests (for new IDs)

1. Kit select ⇒ cast-range highlight non-empty; walk greens suppressed.  
2. Hover affordance under `controllingSummon` with player MP 0 / summon MP > 0.  
3. Unique-bridge click ⇒ landed cell and MP debit agree (or cell not green).
