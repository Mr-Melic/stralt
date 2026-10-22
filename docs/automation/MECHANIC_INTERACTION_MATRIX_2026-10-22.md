# Mechanic interaction matrix — 2026-10-22

**Auditor:** Mechanic Interaction Matrix Auditor  
**HEAD:** `0f5363f` (unchanged since #332 / prior 09-21…10-21 memory runs)  
**Gameplay code:** not modified.

Hunt A: damage-loop consume vs early-return DoT / bounce / environment ticks (001–004).  
Hunt B: rewards / persistence / death / achievements / portals / dungeons / spell discovery — no new file (10-21-004/005 still open; no observe path).  
Skip list honored (08-31 / 09-01 / 09-02 / 09-21…09-29 / 10-21 + in-flight #391/#443/#496/#528/#555/#658/#692/#714/#728/#754/#763/#765/#790/#799/#803/#832/#856).

## New ACTION_IDs

| ID | Pair | Severity |
| :--- | :--- | :--- |
| [001](./ACTION_IDS_MIMA_2026-10-22.md) | Player DoT apply × Paper Windstorm miss / Mirror Field | P1 |
| [002](./ACTION_IDS_MIMA_2026-10-22.md) | Chain Lightning bounce × double RES/`dmg` + Void Mirror skip | P1 |
| [003](./ACTION_IDS_MIMA_2026-10-22.md) | Plague Zone player tick × Shield Charm / RES / Untouchable | P1 |
| [004](./ACTION_IDS_MIMA_2026-10-22.md) | Boss `damageToPlayer` × Shield Charm yes / RES no | P1 |

## Hunt verdicts (no new file)

| Pair | Result |
| :--- | :--- |
| Player `debuffStat` (Frost Bolt / Slow / Weaken / Expose) | In-flight **#528** / **#555** |
| Catalog `res_sp` shred | In-flight **#658** |
| Blood Mend / Rallying Cry CHC buff | In-flight **#692** |
| Mirror / Timestep self tile | In-flight **#496** |
| Summon kit DoT missing `dotDamagePerTurn` | In-flight **#856** |
| Bishop/queen 0-damage DoT in `ENEMY_KITS` | `pickBestDamageSpell` requires `damage > 0` — kit never selected; not a live consume |
| Push/pull × hazards | Unwired REPORT_ONLY — 08-31-005 |
| Spell observation × battle failure | No live observe path — do not invent |
| explore_25 × portal `mapsVisited++` | 10-21-005 |
| Boss Rush room-clear × threshold feats | 10-21-004 |
| Crit ×2 + upgrade scale twice | 10-21-006 |
| Mark consume-before-HP | 10-21-007 |
| Sacrifice × Mirror/Windstorm/Blood Moon | 10-21-009 |
| Shield Charm × lava/spikes/Thorned/rift/Mirror Field | 09-27-002 |
| Shield Charm × Void Mirror / Reflect Shield | 09-29-003 |
| Glass/Titans miss primary (bounce hooked) | 09-23-001 — bounce Glass not re-filed |
| Mark/Fury skip on Poison Arrow | 09-29-001/002 |

## Hunt B verdicts (rewards / persist)

| Pair | Result |
| :--- | :--- |
| Spell discovery unlock × death / reload | No live observe path |
| Challenge `applyRewards` × unpaid death | 09-26-004 |
| Feat claim × unpaid death | 09-25-004 |
| GameKey × unpaid death | 09-02-003 / **#391** |
| Doka Fever × shrine/ground/dungeon/challenge | 09-24-004 |
| Boss Rush modifiers persist / room-clear Fever | 09-29-004 |
| jackpot_heal banner-before-persist | 09-28-001 |

## Missing tests (for new IDs)

1. `isPaperWindstorm` miss on Poison Arrow ⇒ no DoT row; Mirror Field reflect on Inferno.  
2. Chain Lightning bounce: RES 50, no `dmg` buff ⇒ bounce is half of pre-RES (or one RES pass, not two); Void Mirror bounce reflects.  
3. Plague tick with `shieldHpRef=20` leaves player HP unchanged; RES 50 records 1.  
4. Boss `damageToPlayer: 20` with RES 50 and shield 0 writes 10 HP lost; shield 20 writes 0 HP.

## Matrix (evidence-backed)

| Pair | Should | Do (on `main`) | Gap |
| :--- | :--- | :--- | :--- |
| Poison Arrow × Windstorm / Mirror Field | Miss / reflect like Mark | DoT early-return | [001](./ACTION_IDS_MIMA_2026-10-22.md) |
| CL bounce × RES / `dmg` / Void Mirror | One resist pass; reflect | Half of final + RES again; no reflect | [002](./ACTION_IDS_MIMA_2026-10-22.md) |
| Plague × Shield Charm / RES | Same as DoT tick | Raw 2 HP | [003](./ACTION_IDS_MIMA_2026-10-22.md) |
| Boss slam × RES | Same as enemy spell | Shield only | [004](./ACTION_IDS_MIMA_2026-10-22.md) |
