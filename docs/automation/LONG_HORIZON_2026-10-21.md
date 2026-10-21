# Long-Horizon Infinite Progression — 2026-10-21

Stralt has no character level cap in data or persist. This run re-simulated the **live formulas** at HEAD `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` / `#777` inspected). Players are **not** assumed to reach these levels quickly. The mid-teens already exhaust intended XP income. Observed max level (unknown here) is not a cap.

Stress levels: 1, 10, 15, 25, 48, 50, 78, 100, 250, 325, 500, 1000, 2500, 5000, 1018, 1019, **10000, 50000, 100000**.

**Telemetry:** none. No encounter / duration / death / discovery series. Calibration is skipped. Real play would only check the synthetic model, not stop the horizon.

**This run does not redesign progression.** Findings are ACTION_IDs only. Prior `LHIPS-2026-08-31-001..014`, `09-01-001..004`, `09-02-001..002`, queued `09-21` (`#357`) through `09-29` (`#777`) stay NEW unless a formula moved. This file adds IDs only for live slopes the earlier harness never filed (initiative overlay AP = enemy level + hardcoded RES 0 / CHC 2; create-time evasion / resilience / SR never enter combat).

Harness: `src/frontend/src/utils/longHorizonSim.ts`  
Ledger: [`ACTION_IDS_LHIPS_2026-10-21.md`](./ACTION_IDS_LHIPS_2026-10-21.md)  
Stack: restacked onto `#777` (`#357` + `#407` + `#475` + `#530` + `#560` + `#637` + `#670` + `#748` ancestors). One export per helper — do not concatenate sibling copies.

---

## Method

Authoritative sources (not comments, not `backend_extended`):

| Topic | Live formula (2026-10-21) |
| :--- | :--- |
| XP threshold (persist) | `100n * (1n << (N-1))` — `xpCurve.ts` 24–26; Motoko twin `main.mo` 2126–2133 |
| Kill XP | `sum(enemy.level * 20)` — `rewardResolver.ts` 89–101 |
| Enemy level (overworld) | `pickEnemyLevelFromTiers`, `maxTier = floor(999 / tierSize)` (`combatMath.ts` 54–107) |
| Initiative overlay AP/MP | `resolveEnemyApMp`: `ap = level`, `mp = floor(level/2)` (`summonIntegration.ts` 206–209). Overlay then `atk = level*2`, `res: 0`, `sp: 0`, `chc: 2` (`WorldExploration.tsx` 17402–17408). |
| Create defenses | evasion 5 / resilience 8 / SR 5 / CHC 5. `saveBattleStats` writes atk/res/init only. Incoming enemy spells use player **SP** as the SR factor (`WorldExploration.tsx` 16475–16535). |
| Linear HP IEEE | `100 + 5*(L-1)` leaves MAX_SAFE at **1801439850948180**. |

Monte Carlo: 4000 rolls per level, default tier config, no `localStorage` override.

---

## What moved since 2026-09-29

HEAD did not move (`0f5363f`). Formulas that 09-29 measured did not change. `#357` … `#777` are still open; this run **unions** that harness rather than overwriting it.

| Prior ID | Drift |
| :--- | :--- |
| LHIPS-2026-08-31-004 / 09-21-002 / 09-29-001 | Combat RES/CHC still scale to 100. The initiative overlay never shows them — it paints RES 0 / CHC 2 at every level. |
| LHIPS-2026-09-01-003 | Player formula AP still exceeds persist 20 at 325. Overlay **enemy** AP is the enemy's level (1020 at the overworld cap). |
| LHIPS-2026-09-26-001 | Crush still exceeds uncrit Frost from 9. Always-crit Frost (40) still loses from **17**. |
| (new measurement) | Overlay AP 9 / 1020 / 100005 at enemy 9 / 1020 / world-boss player 100000. |
| (new measurement) | Create evasion 5 / resilience 8 / SR 5 are never read by combat. Incoming spells log `SP` reduction from create SP 8. |
| (new measurement) | Linear HP first exceeds MAX_SAFE_INTEGER at level 1801439850948180. Exponential unused HP still JSON-null from 14500 (005). |

Unchanged and still NEW: XP wall 001; HUD sat 09-01-001; IEEE 002; enemy 999 cap 003; RES/HP/AI/kits/discovery/summoner/challenge 004–011; jackpot + 100k/500k 09-01-002; leftover Nat / pow2 09-01-004; GameKey 10M 09-02-001; spell `10*2^n` 09-02-002; INIT/CHC 09-21; Crush vs player 09-22; lava/range 09-23; Blood Mend/fail 09-24; enrage/Shield-potion 09-25; kit vs Crush / idle regen 09-26; Frost TTK / summon HP / shrine 09-27; rush `player+2` / room Doka / MP-grid 09-28; portal-boss RES overwrite / shop 3:1 09-29; no telemetry 014. Victory floor still uncapped on this HEAD (queued `#386`).

Line numbers in WorldExploration / `main.mo` match 09-29 on this HEAD.

---

## XP and practical rate

Unchanged from 09-29. Official income cannot fund 25+ in a realistic session count.

**LHIPS-2026-08-31-001 (still).** **LHIPS-2026-09-01-001 (still).**

---

## Initiative overlay vs live stats

`resolveEnemyApMp` for a pack enemy is `ap = level`. The overlay then throws away battle-start RES/CHC.

| Enemy / context | Overlay AP | Overlay MP | Overlay ATK | Overlay RES | Overlay CHC | Live combat |
| :--- | ---: | ---: | ---: | ---: | ---: | :--- |
| Level 1 | **1** | 1 | 2 | **0** | **2** | one AI action |
| Level 9 | **9** (> player AP 8) | 4 | 18 | 0 | 2 | Crush 22 |
| Overworld cap 1020 | **1020** | 510 | 2040 | 0 | 2 | rook RES can be 100 |
| Portal boss player 73 (lv 78) | **78** | 39 | 156 | 0 | 2 | rook RES 100, Frost chip-1 TTK 117 |
| Portal boss player 100000 | **100005** | 50002 | 200010 | 0 | 2 | catalog HP ~350, AP dump chip-1 TTK 1 |

Always-crit kit Frost (CHC 100 → 40 dmg) still loses to Crush from enemy 17. Advanced kits do not recover role identity even when the overlay's hidden CHC would always crit.

**LHIPS-2026-10-21-001 (new).** **LHIPS-2026-08-31-004 (still).** **LHIPS-2026-09-21-002 (still).** **LHIPS-2026-09-29-001 (still).**

---

## Unused create defenses

| Field | Create | Persist after create | Combat |
| :--- | ---: | :--- | :--- |
| evasion | 5 | not in `saveBattleStats` | never read; crit is raw CHC |
| resilience | 8 | not in `saveBattleStats` | never read |
| SR | 5 | not in `saveBattleStats` | HUD only. Incoming spells use **SP 8** as the SR factor |
| CHC | 5 | not in `saveBattleStats` | player crit 5% forever |
| RES | 10 | `_minNat` vs stored | the only live player damage reduction |
| INIT | 10 | `_minNat` vs stored | 09-21-001 |

Linear HP (`100 + 5*(L-1)`) first exceeds `Number.MAX_SAFE_INTEGER` at level **1801439850948180**. That is a representation bound, not a content cap. Exponential unused HP is already JSON-null from 14500 (005).

**LHIPS-2026-10-21-002 (new).** **LHIPS-2026-09-21-001 (still).** **LHIPS-2026-08-31-005 (still).**

---

## Spell pools and discovery

Live `LevelZone` object still yields zone-0 kits. All 32 starters are owned at create. Overlay CHC 2 does not change that the live bishop crit roll can be 100.

**LHIPS-2026-08-31-007, 008 (still).** **LHIPS-2026-09-26-001 (still).**

---

## Technical limits

Overlay AP 100005 is a safe Number. Linear HP IEEE bound is 1.801e15. Motoko leftover / pow2 unchanged (09-01-004). HUD XP still saturates at 48 (09-01-001).

**LHIPS-2026-09-01-001, 003, 004 (still).** **LHIPS-2026-10-21-001 (new).**

---

## Telemetry / calibration

No series to compare XP rate, relative-level mix, battle length, death rate, discovery, advanced-AI, elite, or wallet growth. No player has been observed at overlay AP 1020 or unused SR 5 vs CHC 100; the synthetic splits do not require that. Observed max player level is not a cap and is not used as the simulation horizon.

**LHIPS-2026-08-31-014 (still).**

---

## What this run did not do

- No change to RAF, map generation, turn logic, or damage math.
- No curve / spawn / kit / jackpot / GameKey / Crush / overlay / evasion retune.
- No claim that current live players are at any of these levels.
- No reopen of unchanged 2026-08-31 through 2026-09-29 IDs.
