# Long-Horizon Infinite Progression — 2026-10-23

Stralt has no character level cap in data or persist. This run re-simulated the **live formulas** at HEAD `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` / `#777` / `#819` / `#898` inspected). Players are **not** assumed to reach these levels quickly. The mid-teens already exhaust intended XP income. Observed max level (unknown here) is not a cap.

Stress levels: 1, 10, 15, 25, 48, 50, 78, 100, 250, 325, 500, 1000, 2500, 5000, 1018, 1019, **10000, 50000, 100000**.

**Telemetry:** none. No encounter / duration / death / discovery series. Calibration is skipped. Real play would only check the synthetic model, not stop the horizon.

**This run does not redesign progression.** Findings are ACTION_IDs only. Prior `LHIPS-2026-08-31-001..014`, `09-01-001..004`, `09-02-001..002`, queued `09-21` (`#357`) through `10-22` (`#898`) stay NEW unless a formula moved. This file adds IDs only for live slopes the earlier harness never filed (Timestep restores unbounded formula AP; player summons have no cap; summon INIT/RES/CHC use character level while HP stays catalog).

Harness: `src/frontend/src/utils/longHorizonSim.ts`  
Ledger: [`ACTION_IDS_LHIPS_2026-10-23.md`](./ACTION_IDS_LHIPS_2026-10-23.md)  
Stack: restacked onto `#898` (`#357` + `#407` + `#475` + `#530` + `#560` + `#637` + `#670` + `#748` + `#777` + `#819` ancestors). One export per helper — do not concatenate sibling copies.

---

## Method

Authoritative sources (not comments, not `backend_extended`):

| Topic | Live formula (2026-10-23) |
| :--- | :--- |
| XP threshold (persist) | `100n * (1n << (N-1))` — `xpCurve.ts`; Motoko twin `main.mo` |
| Kill XP | `sum(enemy.level * 20)` — `rewardResolver.ts` |
| Battle AP | `getPlayerBaseStats` `8 + floor(L/25)`. Persist 20. Frost cooldown **0**. |
| Timestep | AP 0, CD 0, once per battle. `restoreApMp` writes formula AP, not persist 20. |
| Player summons | Dire Wolf AP 3, CD 0, **no cap**. Enemy summoners cap at 2. Grid 16×16 = 256 cells. |
| Summon combat stats | `computeEnemyStats(player.level, pieceType="wolf"→king)`. HP from `getSummonBaseStats(spellLevel)`. |

Monte Carlo: 4000 rolls per level, default tier config, no `localStorage` override.

---

## What moved since 2026-10-22

HEAD did not move (`0f5363f`). Formulas that 10-22 measured did not change. `#357` … `#898` are still open; this run **unions** that harness rather than overwriting it.

| Prior ID | Drift |
| :--- | :--- |
| LHIPS-2026-10-22-002 | Single-bar Frost dump is unchanged (7 / 1336 at 325 / 100000). Timestep is a second formula bar (10-23-001). |
| LHIPS-2026-09-27-002 | Catalog summon HP vs Crush is unchanged (hunter 80, Crush from 34). INIT/RES on that body still scale with the player (10-23-003). |
| LHIPS-2026-08-31-008 | All 32 starters still owned at create. That set includes Timestep and Dire Wolf. |
| (new measurement) | Timestep Frost casts 14 / 2672 at 325 / 100000. First 100-cast Timestep turn at 3550. |
| (new measurement) | Player summons 7 / 36 / 136 / 1336 at 325 / 2500 / 10000 / 100000. Enemy cap 2. Grid fill at 19000. |
| (new measurement) | Summon max INIT 7 / 1206 / 3006 at player 1 / 1000 / 2500. King-fallback RES 100 at 107. Hunter HP still 80. |

Unchanged and still NEW: XP wall 001; HUD sat 09-01-001; IEEE 002; RES/HP/AI/kits/discovery/summoner/challenge 004–011; jackpot + 100k/500k 09-01-002; leftover Nat / pow2 09-01-004; GameKey 10M 09-02-001; spell `10*2^n` 09-02-002; INIT/CHC 09-21; Crush vs player 09-22; lava/range 09-23; Blood Mend/fail 09-24; enrage/Shield-potion 09-25; kit vs Crush / idle regen 09-26; Frost TTK / summon HP / shrine 09-27; rush `player+2` / room Doka / MP-grid 09-28; portal-boss RES overwrite / shop 3:1 09-29; overlay AP / unused evasion 10-21; family overwrite / Frost dump / dungeon +30 10-22; no telemetry 014. Victory floor still uncapped on this HEAD (queued `#386`).

Line numbers in WorldExploration / `main.mo` match 10-22 on this HEAD.

---

## XP and practical rate

Unchanged from 10-22. Official income cannot fund 25+ in a realistic session count.

**LHIPS-2026-08-31-001 (still).** **LHIPS-2026-09-01-001 (still).**

---

## Timestep × unbounded battle AP

Dump, Timestep, dump. Restore uses `getPlayerBaseStats`, not persist 20.

| Player | Formula AP | Frost / turn | After Timestep |
| ---: | ---: | ---: | ---: |
| 1 | 8 | 2 | 4 |
| 325 | 21 | 7 | **14** |
| 1000 | 48 | 16 | 32 |
| 3550 | 150 | 50 | **100** |
| 7300 | 300 | 100 | 200 |
| 10000 | 408 | 136 | 272 |
| 100000 | 4008 | 1336 | **2672** |

AI still one Crush / kit cast. Overlay enemy AP at 100000 world-boss is 100005 and is still not spent (10-21-001).

**LHIPS-2026-10-23-001 (new).** **LHIPS-2026-10-22-002 (still).** **LHIPS-2026-09-01-003 (still).**

---

## Player summons — count and identity

Enemy summoners skip at 2 alive. Player spawn does not.

| Player | Dire Wolf casts / turn | vs enemy cap 2 | vs MAX_ENEMIES 20 | vs 256-cell grid |
| ---: | ---: | :--- | :--- | :--- |
| 1 | 2 | equal | under | under |
| 25 | 3 | **over** | under | under |
| 325 | 7 | over | under | under |
| 1375 | 21 | over | **over** | under |
| 10000 | 136 | over | over | under |
| 19000 | 256 | over | over | **fill** |
| 100000 | 1336 | over | over | occupancy fallback |

Combat stats are a split formula. HP uses spell level (catalog 80). INIT/RES/CHC use **player** level and king multipliers (`pieceType: "wolf"` is not a chess piece):

| Player | Hunter HP | Summon max INIT | Summon max RES | Player INIT |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 80 | 7 | 5 | 10 |
| 4 | 80 | **11** | 8 | 10 |
| 107 | 80 | 134 | **100** | 10 |
| 1000 | 80 | **1206** | 100 | 10 |
| 2500 | 80 | **3006** | 100 | 10 |

A 1000-cap king pack max INIT is 1206. Player-2500 summons act first, then die to Crush from enemy 34 (09-27-002). Hostile minions also receive `characterStats.level`, not the summoner's 1030-capped level.

**LHIPS-2026-10-23-002 (new).** **LHIPS-2026-10-23-003 (new).** **LHIPS-2026-09-27-002 (still).**

---

## Spell pools and discovery

Live `LevelZone` object still yields zone-0 kits. All 32 starters are owned at create. Family does not change kits. Timestep and Dire Wolf are create-owned; they are not discovered.

**LHIPS-2026-08-31-007, 008 (still).**

---

## Technical limits

Formula AP 4008 / 2672 Timestep Frosts / 1336 summons is a safe Number. Linear HP IEEE bound is still 1.801e15. Dungeon max 1030 is a safe Number. Motoko leftover / pow2 unchanged (09-01-004). HUD XP still saturates at 48 (09-01-001). Summon IDs are `Math.random` strings.

**LHIPS-2026-09-01-001, 003, 004 (still).** **LHIPS-2026-10-22-002 (still).** **LHIPS-2026-10-23-001, 002 (new).**

---

## Telemetry / calibration

No series to compare XP rate, relative-level mix, battle length, death rate, discovery, advanced-AI, elite, or wallet growth. No player has been observed at a Timestep double-dump, a 1336-summon turn, or a 3006-INIT catalog-HP wolf; the synthetic splits do not require that. Observed max player level is not a cap and is not used as the simulation horizon.

**LHIPS-2026-08-31-014 (still).**

---

## What this run did not do

- No change to RAF, map generation, turn logic, or damage math.
- No curve / spawn / kit / jackpot / GameKey / Crush / overlay / family / Frost-CD / Timestep / summon-cap retune.
- No claim that current live players are at any of these levels.
- No reopen of unchanged 2026-08-31 through 2026-10-22 IDs.
