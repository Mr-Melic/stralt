# Long-Horizon Infinite Progression — 2026-09-28

Stralt has no character level cap in data or persist. This run re-simulated the **live formulas** at HEAD `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` inspected). Players are **not** assumed to reach these levels quickly. The mid-teens already exhaust intended XP income. Observed max level (unknown here) is not a cap.

Stress levels: 1, 10, 15, 25, 48, 50, 78, 100, 250, 325, 500, 1000, 2500, 5000, 1018, 1019, **10000, 50000, 100000**.

**Telemetry:** none. No encounter / duration / death / discovery series. `#333` / `#395` / `#462` / `#502` / `#504` / `#527` / `#609` / `#661` are still WAITING_FOR_TELEMETRY. Calibration is skipped. Real play would only check the synthetic model, not stop the horizon.

**This run does not redesign progression.** Findings are ACTION_IDs only. Prior `LHIPS-2026-08-31-001..014`, `09-01-001..004`, `09-02-001..002`, queued `09-21` (`#357`), `09-22` (`#407`), `09-23` (`#475`), `09-24` (`#530`), `09-25` (`#560`), `09-26` (`#637`), and `09-27` (`#670`) stay NEW unless a formula moved. This file adds IDs only for live slopes the earlier harness never filed (Boss Rush `player+2` ignores the overworld 999 cap; advertised room Doka/XP unused vs `1.5L` persist; formula MP vs the 16×16 Manhattan grid).

Harness: `src/frontend/src/utils/longHorizonSim.ts`  
Ledger: [`ACTION_IDS_LHIPS_2026-09-28.md`](./ACTION_IDS_LHIPS_2026-09-28.md)  
Stack: restacked onto `#670` (`#357` + `#407` + `#475` + `#530` + `#560` + `#637` ancestors). One export per helper — do not concatenate sibling copies.

---

## Method

Authoritative sources (not comments, not `backend_extended`):

| Topic | Live formula (2026-09-28) |
| :--- | :--- |
| XP threshold (persist) | `100n * (1n << (N-1))` — `xpCurve.ts` 24–26; Motoko twin `main.mo` 2126–2133 |
| Kill XP | `sum(enemy.level * 20)` — `rewardResolver.ts` 89–101 |
| Enemy level (overworld) | `pickEnemyLevelFromTiers`, `maxTier = floor(999 / tierSize)` (`combatMath.ts` 54–107) |
| Boss Rush level | `characterStats.level + 2` (`WorldExploration.tsx` 5330). No 999 cap. |
| Boss Rush combat HP | After `checkBattleTrigger`, `calcEnemyMaxHp(level)` (`3607–3611`, `11970–11974`). Spawn placeholder 100 is overwritten. `id` is `boss-rush-…`, so the `boss_` catalog branch does not apply. |
| Boss Rush kit | `buildEnemyKit(pieceType, levelZone)` with `pieceType` = display name (`Pale Archbishop`). Misses `ENEMY_KITS` → pawn Strike. |
| Boss Rush Doka | `max(5, floor(level * 1.5))` per defeated (`12749–12753`). Catalog `dokaReward` unused. `completeBossRushRoom` ignores client rewards (`main.mo` 3304–3322). |
| Battle walk | 4-dir BFS, 1 MP/tile (`getMpReachableTiles` 7062–7066). Grid `WORLD_GRID_SIZE = 16`. |
| Player Frost TTK | Unchanged from 09-27: catalog 20 + create SP 8 → 21; AP `8+floor(L/25)`. |

Monte Carlo: 4000 rolls per level, default tier config, no `localStorage` override.

---

## What moved since 2026-09-27

HEAD did not move (`0f5363f`). Formulas that 09-27 measured did not change. `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` are still open; this run **unions** that harness rather than overwriting it.

| Prior ID | Drift |
| :--- | :--- |
| LHIPS-2026-08-31-003 / 010 | Overworld still caps near 1020; catalog world-boss HP still ~350. Boss Rush is a **third** level path: `player+2` with linear enemy HP and Crush `L/5`, uncapped. |
| LHIPS-2026-09-25-001 | Enraged Crush vs the **frozen** 1020 pack is outrun by player HP at 2361. Enraged Crush vs **uncapped** rush `player+2` one-shots from player **11** and never stops. |
| LHIPS-2026-09-27-001 | Frost vs the 1020 pack still collapses to 1 turn at player 10000. Frost vs rush HP converges to **9** turns (HP and AP both linear in L). |
| LHIPS-2026-09-01-003 | Persist AP/MP 20 vs formula. This run measures formula **MP** against the 16×16 4-dir grid (saturated at 300 from spawn-center). |
| (new measurement) | Rush HP 55 / 352 / 2552 / 25052 / 250052 at player 1 / 120 / 1000 / 10000 / 100000. Exceeds catalog 350 from **120**. |
| (new measurement) | Live two-boss Doka 10 at player 1 vs room-0 catalog 500; exceeds 500 from **168**; 100k clamp from **33334**. XP clamp from **12499**. |
| (new measurement) | Formula MP 16 at 300 (center-to-corner); 30 at 650 (diameter); 4004 at 100000. Persist 20 already covers spawn-center maps. |

Unchanged and still NEW: XP wall 001; HUD sat 09-01-001; IEEE 002; enemy 999 cap 003; RES/HP/AI/kits/discovery/summoner/boss/challenge 004–011; jackpot + 100k/500k 09-01-002; leftover Nat / pow2 09-01-004; GameKey 10M 09-02-001; spell `10*2^n` 09-02-002; INIT/CHC 09-21; Crush vs player 09-22; lava/range 09-23; Blood Mend/fail 09-24; enrage/Shield-potion 09-25; kit vs Crush / idle regen 09-26; Frost TTK / summon HP / shrine 09-27; no telemetry 014. Victory floor still uncapped on this HEAD (queued `#386`).

Line numbers in WorldExploration / `main.mo` match 09-27 on this HEAD.

---

## XP and practical rate

| Level | Exact XP to next | HUD `xpForNextLevel` | Typical 3-kill XP | Fights to next |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 100 | 100 | ~660 | 0.15 (mean enemy ~11) |
| 10 | 51,200 | 51,200 | ~660 | ~78 |
| 15 | 1.64e6 | 1.64e6 | ~1,080 | ~1.5e3 |
| 25 | 1.678e9 | 1.678e9 | ~1,620 | ~1.0e6 |
| 48 | 1.407e16 | **MAX_SAFE 9.01e15** | ~2,760 | ~5.1e12 |
| 1000 | 5.36e302 | MAX_SAFE | ~59,500 | ~9.0e297 |
| 1019 | **Infinity** (IEEE) | MAX_SAFE | ~59,580 | never |
| 100000 | Infinity | MAX_SAFE | ~59,580 | never |

Official income cannot fund 25+ in a realistic session count.

**LHIPS-2026-08-31-001 (still).** **LHIPS-2026-09-01-001 (still).**

---

## Enemy generation

Player 2500 / 10000 / 50000 / 100000 remain **100% below-tier** with max overworld enemy **1020**. Dungeon boost still `+ boost * tierSize` (max +30 at depth 5) on that window.

Boss Rush does **not** use `pickEnemyLevelFromTiers`. Combat level is `player+2` at every stress point including 100000 → **100002**.

**LHIPS-2026-08-31-003 (still).** **LHIPS-2026-09-28-001 (new).**

---

## Boss Rush vs overworld cap

Battle-start overwrites spawn HP 100 with `calcEnemyMaxHp(player+2)`. Catalog Pale Archbishop 350 is unused for rush ids (`boss-rush-…` does not match `boss_`). Display-name `pieceType` misses `ENEMY_KITS` and stays pawn Strike 10 (007/09-26).

| Player | Rush level | Rush HP | Unenraged Crush | Enraged recv | Player HP | Frost TTK |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 3 | **55** | 12 | 58 | 100 | **2** |
| 11 | 13 | 80 | 31 | **≥ HP** | 150 | 2 |
| 120 | 122 | **352** (>350) | 293 | 1424 | 695 | 5 |
| 1000 | 1002 | 2552 | 2405 | **11688** | 5095 | **8** |
| 10000 | 10002 | 25052 | 24005 | **116664** | 50095 | **9** |
| 100000 | 100002 | 250052 | 240005 | **1166424** | 500095 | **9** |

Unenraged Crush never one-shots (HP slope 5/level vs recv ~1.94/level). Enraged ×6 one-shots from player **11** and **does not invert** — there is no 2361-style rescue because level is not frozen at 1020.

Frost vs the 1020 pack still hits 1 turn at 10000 (09-27-001). Frost vs rush HP stays ~9 turns once AP and HP are both linear in L.

**LHIPS-2026-09-28-001 (new).** **LHIPS-2026-08-31-010 (still, catalog world bosses).** **LHIPS-2026-09-25-001 (still, capped enrage).** **LHIPS-2026-09-27-001 (still, Frost vs cap pack).**

---

## Boss Rush rewards

`BOSS_RUSH_ROOMS[].dokaReward` / `xpReward` (500–5000 / 200–2000) are not the persist path. Room clear credits `computeVictoryExp` (kill `L*20`) plus `max(5, floor(playerLevel * 1.5))` Doka per defeated, then `clampApplyRewardsDeltas`. `completeBossRushRoom` is progress-only (`0, 0`).

| Player | Live 2-boss Doka | Room-0 catalog 500 | Live 2-boss XP | Clamp |
| ---: | ---: | ---: | ---: | :--- |
| 1 | **10** | 500 | 120 | under |
| 167 | 500 | 500 | 6760 | equal Doka |
| 168 | **504** | 500 | 6800 | Doka exceeds copy |
| 1000 | 3000 | 500 | 40080 | under XP clamp |
| 1668 | **5004** | room-9 copy 5000 | 66800 | Doka exceeds jackpot-room copy |
| 12499 | 37497 | — | **500040** | XP clamp |
| 33334 | **100002** | — | 1.33e6 | Doka clamp |
| 100000 | 300000 → **100000** | — | 4.00e6 → **500000** | both clamps |

**LHIPS-2026-09-28-002 (new).** **LHIPS-2026-09-01-002 (still, combat ceilings).**

---

## Battle MP vs 16×16 grid

Walk BFS is 4-directional, 1 MP/tile. `WORLD_GRID_SIZE = 16`. Spawn-center (8,8) to a corner is Manhattan **16**. Opposite corners **30**. Formula MP is `4 + floor(L/25)` (persist write still 20).

| Player | Formula MP | Covers center→corner (16) | Covers diameter (30) |
| ---: | ---: | :---: | :---: |
| 1 | 4 | no | no |
| 100 | 8 | no | no |
| **300** | **16** | **yes** | no |
| 400 | 20 (persist cap) | yes | no |
| **650** | **30** | yes | **yes** |
| 10000 | 404 | wasted | wasted |
| 100000 | **4004** | wasted | wasted |

Persist 20 already covers every spawn-center map. Extra formula MP after 300 cannot spend on a longer path.

**LHIPS-2026-09-28-003 (new).** **LHIPS-2026-09-01-003 (still, persist-write cap).**

---

## Spell pools and discovery

Live `LevelZone` object still yields zone-0 kits. Rush display names yield pawn Strike. All 32 starters are owned at create.

**LHIPS-2026-08-31-007, 008 (still).** **LHIPS-2026-09-26-001 (still).**

---

## Technical limits

Unchanged from 09-27 except: rush Crush raw 240005 at player 100000 is still a safe Number; enraged recv 1.17e6 is still a safe Number; formula MP 4004 is not a Number overflow.

**LHIPS-2026-09-01-001, 003, 004 (still).**

---

## Telemetry / calibration

No series to compare XP rate, relative-level mix, battle length, death rate, discovery, advanced-AI, elite, or wallet growth. No player has been observed at Boss Rush `player+2` stress levels; the synthetic cap bypass does not require that. Observed max player level is not a cap and is not used as the simulation horizon.

**LHIPS-2026-08-31-014 (still).**

---

## What this run did not do

- No change to RAF, map generation, turn logic, or damage math.
- No curve / spawn / kit / jackpot / GameKey / Crush / Frost / Boss Rush / MP retune.
- No claim that current live players are at any of these levels.
- No reopen of unchanged 2026-08-31 through 2026-09-27 IDs.
