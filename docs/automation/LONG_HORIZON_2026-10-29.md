# Long-Horizon Infinite Progression — 2026-10-29

**This run does not redesign progression.** Findings are ACTION_IDs only. Prior `LHIPS-2026-08-31-001..014`, `09-01-001..004`, `09-02-001..002`, and queued `09-21`…`10-28` (`#357`…`#1250`) stay NEW unless a formula moved. This file adds IDs only for live slopes the earlier harness never filed.

HEAD: `0f5363f`. Harness: `src/frontend/src/utils/longHorizonSim.ts`. Stress includes 10000 / 50000 / 100000. Restack onto `#1250` (which already carries `#1197` ancestors).

## Drift check

| Prior ID | Still true on this HEAD? |
| :--- | :--- |
| LHIPS-2026-10-28-001..005 | Yes — Thorn / AI budget / Swift Winds / Gravity-Fog / paint-only unchanged. |
| LHIPS-2026-09-24-001 | Blood Mend heal 12 unchanged. CHC buff never applied is new (10-29-001). |
| LHIPS-2026-10-25-003 | Iron Curse RES×1.3 unchanged. Heal-halved announce is a separate no-op (10-29-002). |
| LHIPS-2026-08-31-005 | Victory HP floor unchanged. AP/MP floors are a new slope axis (10-29-003). |
| LHIPS-2026-10-22-002 | Frost dump unchanged. Catalog MP/SP debuffs never land on player cast (10-29-004). |
| LHIPS-2026-09-24-002 | Spell-fail still 0 at 201. Overflow’s 10% effect fizzle remains (10-29-005). |
| LHIPS-2026-08-31-001 | XP wall unchanged. Portal +10 vs leftover death cut is a new recovery axis (10-29-006). |
| LHIPS-2026-08-31-007 | LevelZone object still NaN. Intended zone≥2 terminal band is new (10-29-007). |
| LHIPS-2026-08-31-003 | 999 pick unchanged. Zone label uncapped is new (10-29-008). |

## New findings (summary)

1. **Blood Mend CHC buff** — heal branch returns without `applyEffect`; `buffModifier: 0.15` would be −85% if multiplied.
2. **Iron Curse heal-halved** — announce/registry claim WX halves; WX never does.
3. **Victory AP/MP floors** — `/20` and `/10` vs formula `/25`; MP>create max from 10; AP>formula from 220; at 100000 floors are 5006 / 10005 vs formula 4008 / 4004.
4. **Player-cast catalog debuffs** — Frost −1 MP and Life Drain SP 0.8 never applied by `resolvePlayerCast`.
5. **Arcane Overflow 10%** — permanent buff/debuff fizzle after spell-fail hits 0 at 201.
6. **Portal +10** — 10% of L1 threshold; ~0 by L100; death near-full bar needs 2 portals at 1 and >1e29 at 100.
7. **Intended kit zone** — saturates at 2 (player 11); queen Inferno kit identical at 11 and 100000.
8. **Map zone label** — Tier 10000 / 99991–100000 while pick max stays 1020.

## Numbers at stress levels

| Level | Formula AP/MP | Victory AP/MP | Portal XP / threshold | Intended kit zone | Zone label max |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 8 / 4 | 6 / 5 | 0.1 | 1 | 10 |
| 75 | 11 / 7 | 9 / 12 | ~5e-24 | 8 | 80 |
| 1500 | 68 / 64 | 81 / 155 | 0 (IEEE) | 150 | 1500 |
| 100000 | 4008 / 4004 | 5006 / 10005 | 0 | 10000 | 100000 |

## Verdict

Eight NEW IDs. No curve redesign. Official XP wall still arrives first for character leveling. Re-run with the same harness; do not reopen still-NEW IDs unless formulas move.
