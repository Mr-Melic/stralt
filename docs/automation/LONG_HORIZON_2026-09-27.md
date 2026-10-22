# Long-Horizon Infinite Progression — 2026-09-27

Stralt has no character level cap in data or persist. This run re-simulated the **live formulas** at HEAD `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` inspected). Players are **not** assumed to reach these levels quickly. The mid-teens already exhaust intended XP income. Observed max level (unknown here) is not a cap.

Stress levels: 1, 10, 15, 25, 48, 50, 78, 100, 250, 325, 500, 1000, 2500, 5000, 1018, 1019, **10000, 50000, 100000**.

**Telemetry:** none. No encounter / duration / death / discovery series. `#333` / `#395` / `#462` / `#502` / `#504` / `#527` / `#609` are still WAITING_FOR_TELEMETRY. Calibration is skipped. Real play would only check the synthetic model, not stop the horizon.

**This run does not redesign progression.** Findings are ACTION_IDs only. Prior `LHIPS-2026-08-31-001..014`, `09-01-001..004`, `09-02-001..002`, queued `09-21` (`#357`), `09-22` (`#407`), `09-23` (`#475`), `09-24` (`#530`), `09-25` (`#560`), and `09-26` (`#637`) stay NEW unless a formula moved. This file adds IDs only for live slopes the earlier harness never filed (player Frost TTK vs linear-then-capped enemy HP; catalog summon HP vs Crush `L/5`; shrine 300 vs ground `5+2L`).

Harness: `src/frontend/src/utils/longHorizonSim.ts`  
Ledger: [`ACTION_IDS_LHIPS_2026-09-27.md`](./ACTION_IDS_LHIPS_2026-09-27.md)  
Stack: restacked onto `#637` (`#357` + `#407` + `#475` + `#530` + `#560` ancestors). One export per helper — do not concatenate sibling copies.

---

## Method

Authoritative sources (not comments, not `backend_extended`):

| Topic | Live formula (2026-09-27) |
| :--- | :--- |
| XP threshold (persist) | `100n * (1n << (N-1))` — `xpCurve.ts` 24–26; Motoko twin `main.mo` 2126–2133 |
| XP threshold (HUD / recap) | same, but `xpForNextLevel` saturates at `Number.MAX_SAFE_INTEGER` from **level 48** |
| Kill XP | `sum(enemy.level * 20)` — `rewardResolver.ts` 89–101 |
| Player Frost | `calcScaledDamage(20, level, spellUpgrade)` then `floor(dmg * (1+SP/100))` (`WorldExploration.tsx` 3308–3322). `_casterLevel` ignored. Create SP 8. |
| Battle AP | `8 + floor(L/25)` (`progression.ts` 65–72). Persist cap 20 (`main.mo` 2044–2054). Formula wins at battle init. |
| Summon HP | `round(baseHp * hpScale * (1 + spellLevel*0.10))`. Catalog hunter 80 / archer 42 / bomber 25 / guardian 180. `unitDef.level` = 1. |
| Fallback melee | Crush 12 / Fire Bolt 8 × `max(1, L/5)` × enrage 6. Summon path: one RES pass (`WorldExploration.tsx` 16722–16738). |
| Ground Doka | `dokaSpawnBaseValue + avgLevel * 2` (`WorldExploration.tsx` 6782–6786), default base 5 |
| Shrine | literal 300 (`WorldExploration.tsx` 11308) |
| Dungeon complete | `maxDepth * 50` (`portalRules.ts` 195–196) |
| Enemy level | `pickEnemyLevelFromTiers`, `maxTier = floor(999 / tierSize)` |
| Kits | `buildEnemyKit(piece, currentMap.levelZone)` — object, not number (`WorldExploration.tsx` 11920) |

Monte Carlo: 4000 rolls per level, default tier config, no `localStorage` override.

---

## What moved since 2026-09-26

HEAD did not move (`0f5363f`). Formulas that 09-26 measured did not change. `#357` / `#407` / `#475` / `#530` / `#560` / `#637` are still open; this run **unions** that harness rather than overwriting it.

| Prior ID | Drift |
| :--- | :--- |
| LHIPS-2026-09-01-003 | Persist AP 20 vs formula AP 21 at 325 **not closed**. This run measures the **TTK** of unbounded battle AP against catalog Frost 21 and 999-capped enemy HP. |
| LHIPS-2026-09-26-001 | Enemy kits still 10/20 vs Crush `L/5`. This run measures the **player** Frost path (create SP 8, AP/turn). |
| LHIPS-2026-09-22-001 | Crush vs **player** HP unchanged. This run files Crush vs **catalog summon** HP (measured in the 09-25 harness, never given an ID). |
| (new measurement) | Optimistic Frost TTK vs cap HP 2597: 62 turns at AP 8, 8 at player 1000 (AP 48), **1 at player 10000** (AP 408 / 136 casts). Persist-20 counterfactual at 1000 is 21 turns. |
| (new measurement) | Crush one-shots bomber 25 at enemy **11**, archer 42 at **18**, hunter 80 at **34**, guardian 180 at **75**. Crush at 44 is 106. |
| (new measurement) | Ground Doka mean exceeds shrine 300 from enemy **148** (301 vs 300). Cap mean **2045**. Dungeon-complete 250. |

Unchanged and still NEW: XP wall 001; HUD sat 09-01-001; IEEE 002; enemy 999 cap 003; RES/HP/AI/kits/discovery/summoner/boss/challenge 004–011; jackpot + 100k/500k 09-01-002; leftover Nat / pow2 09-01-004; GameKey 10M 09-02-001; spell `10*2^n` 09-02-002; INIT/CHC 09-21; Crush vs player 09-22; lava/range 09-23; Blood Mend/fail 09-24; enrage/Shield-potion 09-25; kit vs Crush / idle regen 09-26; no telemetry 014.

Line numbers in WorldExploration / `main.mo` match 09-26 on this HEAD.

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

`applyXpDelta(0, 48, 1)` and `applyXpDelta(0, 1018, 1)` stay at that level. Official income cannot fund 25+ in a realistic session count.

**LHIPS-2026-08-31-001 (still).** **LHIPS-2026-09-01-001 (still).**

---

## Enemy generation

Default weights: 60% same tier, 20% ±1, 10% ±2, leftover ±3..6. `threeOrMorePercent: 5` is **not read**. Player 2500 / 10000 / 50000 / 100000 remain **100% below-tier** with max enemy **1020**.

**LHIPS-2026-08-31-003 (still).**

---

## Player Frost TTK

Catalog Frost 20 + create SP 8 → raw **21**. Character level does not enter the damage formula. Spell 14 (combat Doka wall) → **32**.

Battle AP is unbounded `8 + floor(L/25)` even though persist caps at 20.

| Player | Formula AP | Frost casts/turn | Turns to kill cap HP 2597 (optimistic) |
| ---: | ---: | ---: | ---: |
| 1 | 8 | 2 | **62** |
| 100 | 12 | 4 | 31 |
| 325 | 21 | 7 | 18 |
| 1000 | 48 | 16 | **8** |
| 1000 persist-20 | 20 | 6 | 21 |
| 10000 | 408 | 136 | **1** |

First enemy level that takes ≥10 Frost turns on the AP-8 budget: **133**. Rook RES 100 (004) would chip Frost to 1 and replace this table with `enemyHp` turns.

**LHIPS-2026-09-27-001 (new).** **LHIPS-2026-09-01-003 (still, persist write).** **LHIPS-2026-09-26-001 (still, enemy kits).**

---

## Summons vs Crush

| Catalog | HP (spell 0) | First Crush one-shot | Notes |
| :--- | ---: | ---: | :--- |
| Bomber | 25 | enemy **11** | player-only (`usableByEnemy: false`) |
| Archer | 42 | **18** | live enemy-summoner kit |
| Hunter / Dire Wolf | 80 | **34** | live enemy-summoner kit |
| Wisp | 42 | 18 | player-only |
| Guardian / Sentinel | 180 | **75** | player-only |

Crush at player 44 (summoner 100%) is **106**. Cap Crush is **2448**. `unitDef.level` stays 1, so summon RES does not grow with the player.

**LHIPS-2026-09-27-002 (new).** **LHIPS-2026-08-31-009 (still).** **LHIPS-2026-09-22-001 (still, player HP).**

---

## Spell pools and discovery

Live `LevelZone` object still yields zone-0 kits. Inferno / Poison / Venom stay `damage: 0` and are skipped by `pickBestDamageSpell`. All 32 starters are owned at create.

**LHIPS-2026-08-31-007, 008 (still).** **LHIPS-2026-09-26-001 (still).**

---

## Rewards / economy

| Source | Amount | Scales with |
| :--- | ---: | :--- |
| Shrine altar | **300** | nothing |
| Dungeon complete (depth 5) | **250** | maxDepth only (table stops at 5) |
| Ground coin mean | 7 → **301** → **2045** | enemy level, then 999 cap |
| Combat jackpot persist | 100,000 | clamp |
| Health potion | 50 / 120 | nothing |
| GameKey max | 10,000,000 | admin grant cap |

Ground mean exceeds shrine 300 from enemy **148**. Cap coin is 6.8× the shrine and 8.2× the dungeon bonus.

**LHIPS-2026-09-27-003 (new).** **LHIPS-2026-09-01-002 / 09-02-001 / 09-25-002 (still).**

---

## Bosses / dungeons

Combat boss HP stays ~350 at player 100000. Guide `1.08^5` is UI-only. Dungeon extra-enemy / tier-boost tables stop at depth 5.

**LHIPS-2026-08-31-010, 011 (still).**

---

## Technical limits

| Limit | What happens now |
| :--- | :--- |
| HUD `xpForNextLevel` | Saturates at `MAX_SAFE_INTEGER` from level 48 |
| Exact `100 * 2^(N-1)` as Number | Infinity at N=1019 |
| Battle AP | Unbounded `8+floor(L/25)` — 408 at 10000, 4008 at 100000 |
| Persist AP | Silent cap 20 |
| Player Frost / 10000 AP | 136 casts/turn, TTK 1 vs cap HP — no Number overflow |
| Kit `calcScaledDamage` | Character level ignored; upgrade +3% only |
| Enemy id | `enemy-${i}-${currentTime}` — not a level issue |

**LHIPS-2026-09-01-001, 003, 004 (still).** **LHIPS-2026-09-27-001 (new, AP dump TTK).**

---

## Telemetry / calibration

No series to compare XP rate, relative-level mix, battle length, death rate, discovery, advanced-AI, elite, or wallet growth. Combat elite flags do not exist. Observed max player level is not a cap and is not used as the simulation horizon.

**LHIPS-2026-08-31-014 (still).**

---

## What this run did not do

- No change to RAF, map generation, turn logic, or damage math.
- No curve / spawn / kit / jackpot / GameKey / Crush / Frost / summon / shrine retune.
- No claim that current live players are at any of these levels.
- No reopen of unchanged 2026-08-31 through 2026-09-26 IDs.
