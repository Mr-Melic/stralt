# Long-Horizon Infinite Progression — 2026-10-24

Stralt has no character level cap in data or persist. This run re-simulated the **live formulas** at HEAD `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` / `#777` / `#819` / `#898` / `#960` inspected). Players are **not** assumed to reach these levels quickly. The mid-teens already exhaust intended XP income. Observed max level (unknown here) is not a cap.

Stress levels: 1, 10, 15, 25, 48, 50, 78, 100, 250, 325, 500, 1000, 2500, 5000, 1018, 1019, **10000, 50000, 100000**.

**Telemetry:** none. No encounter / duration / death / discovery series. Calibration is skipped. Real play would only check the synthetic model, not stop the horizon.

**This run does not redesign progression.** Findings are ACTION_IDs only. Prior `LHIPS-2026-08-31-001..014`, `09-01-001..004`, `09-02-001..002`, queued `09-21` (`#357`) through `10-23` (`#960`) stay NEW unless a formula moved. This file adds IDs only for live slopes the earlier harness never filed (Mending Mist 5% never commits; Sacrifice scales with HP then chips 1 vs RES 100; Arcane Surge raises the zero-CD Frost dump; two-roll Surge+Overflow stacks Frost to 1 AP).

Harness: `src/frontend/src/utils/longHorizonSim.ts`  
Ledger: [`ACTION_IDS_LHIPS_2026-10-24.md`](./ACTION_IDS_LHIPS_2026-10-24.md)  
Stack: restacked onto `#960` (`#357` + `#407` + `#475` + `#530` + `#560` + `#637` + `#670` + `#748` + `#777` + `#819` + `#898` ancestors). One export per helper — do not concatenate sibling copies.

---

## Method

Authoritative sources (not comments, not `backend_extended`):

| Topic | Live formula (2026-10-24) |
| :--- | :--- |
| XP threshold (persist) | `100n * (1n << (N-1))` — `xpCurve.ts`; Motoko twin `main.mo` |
| Kill XP | `sum(enemy.level * 20)` — `rewardResolver.ts` |
| Battle AP | `getPlayerBaseStats` `8 + floor(L/25)`. Persist 20. Frost cooldown **0**. |
| Mending Mist | `floor(maxHp * 0.05)` on `applyTurnStart`. Player is not in `combatantsRef`. |
| Sacrifice | `floor(currentHp * 0.2) * 3`. CD 0. `enemyTakesDamage` applies RES once. |
| Arcane Surge | `max(1, apCost - 1)` at cast. Frost 3→2. Timestep 0→1. |
| Surge + Overflow | Two-roll chain of the same hook. Frost 3→1. Timestep stays 1. |

Monte Carlo: 4000 rolls per level, default tier config, no `localStorage` override.

---

## What moved since 2026-10-23

HEAD did not move (`0f5363f`). Formulas that 10-23 measured did not change. `#357` … `#960` are still open; this run **unions** that harness rather than overwriting it.

| Prior ID | Drift |
| :--- | :--- |
| LHIPS-2026-09-24-001 | Blood Mend 12 is unchanged. Mending Mist 5% is the percent-heal that never commits (10-24-001). |
| LHIPS-2026-09-26-001 | Kit Frost stays catalog-flat. Sacrifice is the HP-scaling exception, then chip-1 vs RES 100 (10-24-002). |
| LHIPS-2026-10-22-002 | Un-surged Frost dump is unchanged (7 / 1336 at 325 / 100000). Arcane Surge is floor(AP/2) (10-24-003). Surge+Overflow is AP/1 (10-24-004). |
| (new measurement) | Mist formula regen 5 / 254 / 25004 at 1 / 1000 / 100000. Would outheal cap Crush from 7917 if wired. |
| (new measurement) | Sacrifice raw 60 / 2622 / 300057 at 1 / 855 / 100000. Rook RES 100 at 78. |
| (new measurement) | Surge Frost 10 / 2004 at 325 / 100000. First 100-cast turn at 4800. Timestep cost 1. |
| (new measurement) | Surge+Overflow Frost 21 / 4008 at 325 / 100000. First 100-cast turn at 2300. Timestep+stack 42 / 8016; first 100-cast at 1050. |

Unchanged and still NEW: XP wall 001; HUD sat 09-01-001; IEEE 002; RES/HP/AI/kits/discovery/summoner/challenge 004–011; jackpot + 100k/500k 09-01-002; leftover Nat / pow2 09-01-004; GameKey 10M 09-02-001; spell `10*2^n` 09-02-002; INIT/CHC 09-21; Crush vs player 09-22; lava/range 09-23; Blood Mend/fail 09-24; enrage/Shield-potion 09-25; kit vs Crush / idle regen 09-26; Frost TTK / summon HP / shrine 09-27; rush `player+2` / room Doka / MP-grid 09-28; portal-boss RES overwrite / shop 3:1 09-29; overlay AP / unused evasion 10-21; family overwrite / Frost dump / dungeon +30 10-22; Timestep / summon cap / summon INIT 10-23; no telemetry 014. Victory floor still uncapped on this HEAD (queued `#386`).

Line numbers in WorldExploration / `main.mo` match 10-23 on this HEAD.

---

## XP and practical rate

Unchanged from 10-23. Official income cannot fund 25+ in a realistic session count.

**LHIPS-2026-08-31-001 (still).** **LHIPS-2026-09-01-001 (still).**

---

## Mending Mist — 5% that never lands

Player turn-start looks up `id === "player"` in `combatantsRef` and skips. Enemy turn-start mutates the turn-order copy, not the store.

| Player | Linear max HP | Formula regen | vs unenraged 1020 Crush 1983 |
| ---: | ---: | ---: | :--- |
| 1 | 100 | 5 | under |
| 1000 | 5095 | 254 | under |
| **7917** | 39680 | **1984** | **over** (if wired) |
| 47573 | 237865 | 11893 | still under enraged 11897 |
| **47573+** | … | **>11897** | over enraged (if wired) |
| 100000 | 500095 | **25004** | over both (if wired) |

Live effect is 0. Blood Mend stays 12.

**LHIPS-2026-10-24-001 (new).** **LHIPS-2026-09-24-001 (still).**

---

## Sacrifice — HP-scaling then chip-1

Create-owned. CD 0. Raw `0.6 × current HP`. `enemyTakesDamage` applies RES once.

| Player | Raw Sacrifice | Frost | Dungeon-cap HP 2622 | Rook RES 100 (78+) |
| ---: | ---: | ---: | :--- | :--- |
| 1 | **60** | 21 | under | n/a |
| 78 | 330 | 21 | under | **chip-1** |
| **855** | **2622** | 21 | **raw equal** | still chip-1 |
| 1000 | 3057 | 21 | raw over | chip-1 |
| 100000 | 300057 | 21 | raw over | chip-1 |

The only HP-scaling starter attack is nullified by the same RES 100 that flattens Frost, **777 levels before** it could one-shot the 1030 cap on a 0-RES dummy.

**LHIPS-2026-10-24-002 (new).** **LHIPS-2026-08-31-004 (still).** **LHIPS-2026-09-26-001 (still).**

---

## Arcane Surge — min-1 AP discount

Wired at every player cast. Frost 3→2. Timestep 0→1.

| Player | Formula AP | Frost / turn | Surge | Surge + Timestep |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 8 | 2 | 4 | 8 |
| 325 | 21 | 7 | **10** | **20** |
| 2300 | 100 | 33 | 50 | **100** |
| 4800 | 200 | 66 | **100** | 200 |
| 7300 | 300 | 100 | 150 | 300 |
| 100000 | 4008 | 1336 | **2004** | **4008** |

AI still one Crush / kit cast.

**LHIPS-2026-10-24-003 (new).** **LHIPS-2026-10-22-002 (still).** **LHIPS-2026-10-23-001 (still).**

---

## Surge + Overflow — two min-1 discounts

`applyApCost` chains every active hook. Two-roll can pair Surge with Overflow. Frost 3→1.

| Player | Formula AP | Frost / turn | Surge | Surge+Overflow | + Timestep |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 8 | 2 | 4 | **8** | **16** |
| 325 | 21 | 7 | 10 | **21** | **42** |
| 1050 | 50 | 16 | 25 | 50 | **100** |
| 2300 | 100 | 33 | 50 | **100** | 200 |
| 100000 | 4008 | 1336 | 2004 | **4008** | **8016** |

Overflow’s 10% fizzle does not apply to Frost’s direct damage path.

**LHIPS-2026-10-24-004 (new).** **LHIPS-2026-10-24-003 (still).**

---

## Spell pools and discovery

Live `LevelZone` object still yields zone-0 kits. All 32 starters are owned at create. Family does not change kits. Sacrifice is create-owned; it is not discovered.

**LHIPS-2026-08-31-007, 008 (still).**

---

## Technical limits

Formula AP 4008 / 8016 Surge+Overflow+Timestep Frosts / 1336 summons is a safe Number. Linear HP IEEE bound is still 1.801e15. Dungeon max 1030 is a safe Number. Mist regen 25004 is a safe Number. Sacrifice raw 300057 is a safe Number. Motoko leftover / pow2 unchanged (09-01-004). HUD XP still saturates at 48 (09-01-001).

**LHIPS-2026-09-01-001, 003, 004 (still).** **LHIPS-2026-10-24-001, 002, 003, 004 (new).**

---

## Telemetry / calibration

No series to compare XP rate, relative-level mix, battle length, death rate, discovery, advanced-AI, elite, or wallet growth. No player has been observed at a wired 5% Mist, a 300057-Sacrifice, a 2004-cast Surge turn, or an 8016-cast Surge+Overflow+Timestep turn; the synthetic splits do not require that. Observed max player level is not a cap and is not used as the simulation horizon.

**LHIPS-2026-08-31-014 (still).**

---

## What this run did not do

- No change to RAF, map generation, turn logic, or damage math.
- No curve / spawn / kit / jackpot / GameKey / Crush / overlay / family / Frost-CD / Timestep / summon-cap / Mist / Sacrifice / Surge / Overflow retune.
- No claim that current live players are at any of these levels.
- No reopen of unchanged 2026-08-31 through 2026-10-23 IDs.
