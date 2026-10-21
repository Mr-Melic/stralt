# Mechanic interaction matrix — 2026-10-21

**Auditor:** Mechanic Interaction Matrix Auditor  
**HEAD:** `0f5363f` (unchanged since #332 / prior 09-21…09-29 memory runs)  
**Gameplay code:** not modified.

Hunt A: summons / range / MP / portals occupancy (001–003).  
Hunt B: rewards / persistence / death / achievements / challenges / portals / dungeons / spell discovery (004–005).  
Skip list honored (08-31 / 09-01 / 09-02 / 09-21…09-29 + prompt ALREADY FILED + in-flight #443/#491/#536/#577/#606/#629/#652/#728/#754/#763/#765/#800/#803).

## New ACTION_IDs

| ID | Pair | Severity |
| :--- | :--- | :--- |
| [001](./ACTION_IDS_MIMA_2026-10-21.md) | Summon kit select × walk greens / missing cast ring | P1 |
| [002](./ACTION_IDS_MIMA_2026-10-21.md) | Summon-control hover MP × player origin/wallet | P1 |
| [003](./ACTION_IDS_MIMA_2026-10-21.md) | Controlled-summon unseal slide × green click / MP debit | P1 |
| [004](./ACTION_IDS_MIMA_2026-10-21.md) | Boss Rush room-clear applyRewards × threshold feats | P1 |
| [005](./ACTION_IDS_MIMA_2026-10-21.md) | explore_25_maps × portal mapsVisited++ effect deps | P2 |

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

## Hunt B verdicts (rewards / persist — no extra file)

| Pair | Result |
| :--- | :--- |
| Spell discovery unlock × death / reload | No live observe path — do not invent |
| saveKillCount 64 × killCount achievements | No killCount conditions; UI never calls saveKillCount (SDEG) |
| Challenge applyRewards × unpaid death | 09-26-004 |
| Flee × rewards after last hostile | In-flight #629 |
| Boss Rush complete(9) × reset | In-flight #803 / #536 |
| Challenge Doka missing on victory recap | In-flight #491 |
| One-shot Doka × reload / remount keep wipe | Intentional keep; remount #800 |
| Shrine covenant × combat readers | Incomplete content — not scored |

## Missing tests (for new IDs)

1. Kit select ⇒ cast-range highlight non-empty; walk greens suppressed.  
2. Hover affordance under `controllingSummon` with player MP 0 / summon MP > 0.  
3. Unique-bridge click ⇒ landed cell and MP debit agree (or cell not green).  
4. Boss Rush room-clear crossing doka_1000 unlocks inside applyAndCommit; deathEpoch during persist still unlocks from persisted snapshot.  
5. Portal-only mapsVisited 24→25 with stable dokaBalance unlocks explore_25 once.
