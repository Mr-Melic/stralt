# Long-Horizon Infinite Progression — 2026-09-29

Stralt has no character level cap in data or persist. This run re-simulated the **live formulas** at HEAD `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` inspected). Players are **not** assumed to reach these levels quickly. The mid-teens already exhaust intended XP income. Observed max level (unknown here) is not a cap.

Stress levels: 1, 10, 15, 25, 48, 50, 78, 100, 250, 325, 500, 1000, 2500, 5000, 1018, 1019, **10000, 50000, 100000**.

**Telemetry:** none. No encounter / duration / death / discovery series. `#333` / `#395` / `#462` / `#502` / `#504` / `#527` / `#609` / `#661` are still WAITING_FOR_TELEMETRY. Calibration is skipped. Real play would only check the synthetic model, not stop the horizon.

**This run does not redesign progression.** Findings are ACTION_IDs only. Prior `LHIPS-2026-08-31-001..014`, `09-01-001..004`, `09-02-001..002`, queued `09-21` (`#357`), `09-22` (`#407`), `09-23` (`#475`), `09-24` (`#530`), `09-25` (`#560`), `09-26` (`#637`), `09-27` (`#670`), and `09-28` (`#748`) stay NEW unless a formula moved. This file adds IDs only for live slopes the earlier harness never filed (catalog world-boss HP frozen while `computeEnemyStats(player+5)` still rolls RES/CHC; shop 3 HP/Doka vs linear maxHp and the 100k combat ceiling).

Harness: `src/frontend/src/utils/longHorizonSim.ts`  
Ledger: [`ACTION_IDS_LHIPS_2026-09-29.md`](./ACTION_IDS_LHIPS_2026-09-29.md)  
Stack: restacked onto `#748` (`#357` + `#407` + `#475` + `#530` + `#560` + `#637` + `#670` ancestors). One export per helper — do not concatenate sibling copies.

---

## Method

Authoritative sources (not comments, not `backend_extended`):

| Topic | Live formula (2026-09-29) |
| :--- | :--- |
| XP threshold (persist) | `100n * (1n << (N-1))` — `xpCurve.ts` 24–26; Motoko twin `main.mo` 2126–2133 |
| Kill XP | `sum(enemy.level * 20)` — `rewardResolver.ts` 89–101 |
| Enemy level (overworld) | `pickEnemyLevelFromTiers`, `maxTier = floor(999 / tierSize)` (`combatMath.ts` 54–107) |
| Boss Rush level | `characterStats.level + 2` (`WorldExploration.tsx` 5330). No 999 cap. |
| Catalog world-boss level | `characterStats.level + 5` (`WorldExploration.tsx` 6537). No 999 cap. |
| Catalog world-boss HP | `boss_` + `baseStats.hp` (~350–400) after `checkBattleTrigger` (11958–11974). Spawn RES `min(50, catalog)` (6559) is overwritten by `computeEnemyStats` (11872–11903). |
| Shop Doka-to-HP | `floor(doka * 3)` / `ceil(healHp / 3)` (`itemShop.ts` 261–272) |
| Battle walk | 4-dir BFS, 1 MP/tile. Grid `WORLD_GRID_SIZE = 16`. |

Monte Carlo: 4000 rolls per level, default tier config, no `localStorage` override.

---

## What moved since 2026-09-28

HEAD did not move (`0f5363f`). Formulas that 09-28 measured did not change. `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` are still open; this run **unions** that harness rather than overwriting it.

| Prior ID | Drift |
| :--- | :--- |
| LHIPS-2026-08-31-010 | Catalog world-boss **HP** is still ~350–400. Battle-start **RES/CHC/SP/INIT** are not catalog — they re-roll from uncapped `player+5`. Rook RES 100 from player **73**. |
| LHIPS-2026-09-21-002 | Bishop CHC 100 at enemy 115. Pale Archbishop is `pieceType: "bishop"`, so the player sees always-crit from **110**. |
| LHIPS-2026-09-27-001 | Frost vs the 1020 pack still collapses to 1 turn at 10000. Frost vs a RES-100 catalog boss is chip-1: 117 turns at player 73, recovering to 1 only when AP dump ≥ 350. |
| LHIPS-2026-09-25-002 | Potions still 30/70% of maxHp at 50/120 Doka. Shop 3 HP/Doka is a worse rate from player **82** and cannot fill from 1 HP with 100k Doka from **59982**. |
| (new measurement) | Optimistic Frost vs 350 HP: 9 turns at 1, 6 at 73. Chip-1: 117 / 22 / 3 / 1 at 73 / 1000 / 10000 / 100000. |
| (new measurement) | Doka-heal from 1 HP: 33 / 1698 / 83365 / 100002 / 166698 at 1 / 1000 / 50000 / 59982 / 100000. |

Unchanged and still NEW: XP wall 001; HUD sat 09-01-001; IEEE 002; enemy 999 cap 003; RES/HP/AI/kits/discovery/summoner/challenge 004–011; jackpot + 100k/500k 09-01-002; leftover Nat / pow2 09-01-004; GameKey 10M 09-02-001; spell `10*2^n` 09-02-002; INIT/CHC 09-21; Crush vs player 09-22; lava/range 09-23; Blood Mend/fail 09-24; enrage/Shield-potion 09-25; kit vs Crush / idle regen 09-26; Frost TTK / summon HP / shrine 09-27; rush `player+2` / room Doka / MP-grid 09-28; no telemetry 014. Victory floor still uncapped on this HEAD (queued `#386`).

Line numbers in WorldExploration / `main.mo` match 09-28 on this HEAD.

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

Boss Rush combat level is still `player+2` (09-28-001). Catalog portal bosses are a **fourth** level path: `player+5`, HP catalog-frozen, stats re-rolled.

**LHIPS-2026-08-31-003 (still).** **LHIPS-2026-09-28-001 (still).** **LHIPS-2026-09-29-001 (new).**

---

## Catalog world bosses vs frozen HP

`boss_` combat HP stays catalog. Battle-start `computeEnemyStats(player+5, pieceType)` overwrites spawn `min(50, catalog.res)`. Crimson Countess is `pieceType: "rook"`. Pale Archbishop is `bishop`.

| Player | Boss level | Optimistic Frost TTK (350 HP) | Chip-1 TTK if RES 100 | Notes |
| ---: | ---: | ---: | ---: | :--- |
| 1 | 6 | **9** | n/a (RES not 100) | Spawn clamp 50 unused in combat |
| **73** | **78** | **6** | **117** | First rook max-RES 100 |
| 110 | 115 | 5 | 88 | Pale Archbishop always-crit |
| 1000 | 1005 | 2 | **22** | AP dump 16 Frosts/turn |
| 10000 | 10005 | 1 | **3** | |
| 100000 | 100005 | 1 | **1** | Chip-1 recovered by AP |

010 remains the static-HP ID. This ID is the RES/CHC overwrite that *inverts* the “350 HP is easy” reading from 73 until AP dump.

**LHIPS-2026-09-29-001 (new).** **LHIPS-2026-08-31-010 (still).** **LHIPS-2026-08-31-004 (still).** **LHIPS-2026-09-21-002 (still).**

---

## Shop Doka-to-HP vs potions and 100k

`paidHealFromLiveWallet` is 3 HP per Doka. Potions are 30/70% of linear maxHp at 50/120 Doka.

| Player | Linear maxHp | Doka to fill from 1 | 50-Doka potion HP | 50 Doka at 3:1 |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 100 | **33** | 30 | 150 |
| **82** | 505 | 168 | **151** | 150 |
| 1000 | 5095 | 1698 | 1528 | 150 |
| 50000 | 250095 | **83365** | 75028 | 150 |
| **59981** | 300000 | **100000** | 90000 | 150 |
| **59982** | 300005 | **100002** | 90001 | 150 |
| 100000 | 500095 | **166698** | 150028 | 150 |

From 82 the potion is the better 50-Doka spend. From 59982 a 1-HP fill needs more than one clamped combat grant. GameKey 10M still pays.

**LHIPS-2026-09-29-002 (new).** **LHIPS-2026-09-25-002 (still).** **LHIPS-2026-09-01-002 (still).**

---

## Spell pools and discovery

Live `LevelZone` object still yields zone-0 kits. Rush display names yield pawn Strike. Catalog bosses use real chess `pieceType` and still get zone-0 kits. All 32 starters are owned at create.

**LHIPS-2026-08-31-007, 008 (still).** **LHIPS-2026-09-26-001 (still).**

---

## Technical limits

Unchanged from 09-28 except: chip-1 TTK 117 is not a Number issue; Doka-heal cost 166698 is a safe Number and sits above the 100k persist ceiling.

**LHIPS-2026-09-01-001, 003, 004 (still).**

---

## Telemetry / calibration

No series to compare XP rate, relative-level mix, battle length, death rate, discovery, advanced-AI, elite, or wallet growth. No player has been observed at catalog `player+5` RES-100 or Doka-heal 59982; the synthetic splits do not require that. Observed max player level is not a cap and is not used as the simulation horizon.

**LHIPS-2026-08-31-014 (still).**

---

## What this run did not do

- No change to RAF, map generation, turn logic, or damage math.
- No curve / spawn / kit / jackpot / GameKey / Crush / Frost / Boss Rush / MP / heal retune.
- No claim that current live players are at any of these levels.
- No reopen of unchanged 2026-08-31 through 2026-09-28 IDs.
