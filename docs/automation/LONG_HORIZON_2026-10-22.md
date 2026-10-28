# Long-Horizon Infinite Progression — 2026-10-22

Stralt has no character level cap in data or persist. This run re-simulated the **live formulas** at HEAD `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` / `#777` / `#819` inspected). Players are **not** assumed to reach these levels quickly. The mid-teens already exhaust intended XP income. Observed max level (unknown here) is not a cap.

Stress levels: 1, 10, 15, 25, 48, 50, 78, 100, 250, 325, 500, 1000, 2500, 5000, 1018, 1019, **10000, 50000, 100000**.

**Telemetry:** none. No encounter / duration / death / discovery series. Calibration is skipped. Real play would only check the synthetic model, not stop the horizon.

**This run does not redesign progression.** Findings are ACTION_IDs only. Prior `LHIPS-2026-08-31-001..014`, `09-01-001..004`, `09-02-001..002`, queued `09-21` (`#357`) through `10-21` (`#819`) stay NEW unless a formula moved. This file adds IDs only for live slopes the earlier harness never filed (family 30% combat identity wiped at battle-start; zero-CD Frost × unbounded battle AP; dungeon +30 after the 999-cap pick).

Harness: `src/frontend/src/utils/longHorizonSim.ts`  
Ledger: [`ACTION_IDS_LHIPS_2026-10-22.md`](./ACTION_IDS_LHIPS_2026-10-22.md)  
Stack: restacked onto `#819` (`#357` + `#407` + `#475` + `#530` + `#560` + `#637` + `#670` + `#748` + `#777` ancestors). One export per helper — do not concatenate sibling copies.

---

## Method

Authoritative sources (not comments, not `backend_extended`):

| Topic | Live formula (2026-10-22) |
| :--- | :--- |
| XP threshold (persist) | `100n * (1n << (N-1))` — `xpCurve.ts`; Motoko twin `main.mo` |
| Kill XP | `sum(enemy.level * 20)` — `rewardResolver.ts` |
| Enemy level (overworld) | `pickEnemyLevelFromTiers`, `maxTier = floor(999 / tierSize)` → last band **991–1000** |
| Dungeon level | that pick **plus** `dungeonTierBoost * tierSize` (depth 5 → +30 → **1030**) |
| Family 30% | spawn `hp *= hpMult`, `res = 0.05..0.75`. Battle-start overwrites HP to linear and RES/SP to `computeEnemyStats`. |
| Battle AP | `getPlayerBaseStats` `8 + floor(L/25)`. Persist 20. Frost cooldown **0**. |

Monte Carlo: 4000 rolls per level, default tier config, no `localStorage` override.

---

## What moved since 2026-10-21

HEAD did not move (`0f5363f`). Formulas that 10-21 measured did not change. `#357` … `#819` are still open; this run **unions** that harness rather than overwriting it.

| Prior ID | Drift |
| :--- | :--- |
| LHIPS-2026-08-31-003 | Overworld pick max is **1000**, not the 1020 Crush stress level. Dungeon +30 after the cap is new (10-22-003). |
| LHIPS-2026-08-31-005 | Family spawn HP is a fourth formula. Battle-start discards it for linear `50*(1+0.05*(L-1))`. |
| LHIPS-2026-09-01-003 | Persist still 20. Battle still inits formula AP. Frost CD 0 turns that AP into 7 / 1336 casts at 325 / 100000. |
| (new measurement) | iron-golem spawn HP 20450 vs combat 2597 at synthetic 1020 (7.87×). Catalog RES 0.75 is a fraction. |
| (new measurement) | Dungeon max 1030. Player 1000 can still roll +30 above. Player 2500+ is 100% under even in depth 5. |
| (new measurement) | Formula Frost casts 2 / 7 / 16 / 36 / 136 / 1336 at 1 / 325 / 1000 / 2500 / 10000 / 100000. First 100-cast turn at 7300. |

Unchanged and still NEW: XP wall 001; HUD sat 09-01-001; IEEE 002; RES/HP/AI/kits/discovery/summoner/challenge 004–011; jackpot + 100k/500k 09-01-002; leftover Nat / pow2 09-01-004; GameKey 10M 09-02-001; spell `10*2^n` 09-02-002; INIT/CHC 09-21; Crush vs player 09-22; lava/range 09-23; Blood Mend/fail 09-24; enrage/Shield-potion 09-25; kit vs Crush / idle regen 09-26; Frost TTK / summon HP / shrine 09-27; rush `player+2` / room Doka / MP-grid 09-28; portal-boss RES overwrite / shop 3:1 09-29; overlay AP / unused evasion 10-21; no telemetry 014. Victory floor still uncapped on this HEAD (queued `#386`).

Line numbers in WorldExploration / `main.mo` match 10-21 on this HEAD.

---

## XP and practical rate

Unchanged from 10-21. Official income cannot fund 25+ in a realistic session count.

**LHIPS-2026-08-31-001 (still).** **LHIPS-2026-09-01-001 (still).**

---

## Enemy generation — family identity and the dungeon cap

A 30% family roll still happens. Combat never sees it.

| Level / family | Spawn HP (placeholder × mult) | Combat HP (linear) | Catalog RES | Combat RES |
| :--- | ---: | ---: | ---: | :--- |
| 1020 default | 8180 | 2597 | (piece roll) | `computeEnemyStats` |
| 1020 iron_golem | **20450** | **2597** | **0.75** (fraction) | piece percent, often 100 on rook |
| 1020 plague_rat | 3272 | 2597 | **0.05** | piece percent |

Depth 5 adds +30 **after** the 999-cap pick:

| Player | Overworld max | Dungeon max | Relative |
| ---: | ---: | ---: | :--- |
| 1 | ~80 (003) | ~110 | already over-level |
| 1000 | 1000 | **1030** | dungeon can still be +30 |
| 2500 | 1000 | 1030 | 100% under |
| 100000 | 1000 | 1030 | 100% under |

**LHIPS-2026-10-22-001 (new).** **LHIPS-2026-10-22-003 (new).** **LHIPS-2026-08-31-003 (still).**

---

## Battle AP × zero-CD Frost

| Player | Formula AP | Persist AP | Frost casts / turn (CD 0, cost 3) |
| ---: | ---: | ---: | ---: |
| 1 | 8 | 8 | 2 |
| 325 | 21 | 20 | **7** (first extra vs persist) |
| 1000 | 48 | 20 | 16 |
| 2500 | 108 | 20 | 36 |
| 7300 | 300 | 20 | **100** |
| 10000 | 408 | 20 | 136 |
| 100000 | 4008 | 20 | **1336** |

AI still one Crush / kit cast. Overlay enemy AP at 100000 world-boss is 100005 and is still not spent (10-21-001).

**LHIPS-2026-10-22-002 (new).** **LHIPS-2026-09-01-003 (still).** **LHIPS-2026-09-27-001 (still).**

---

## Spell pools and discovery

Live `LevelZone` object still yields zone-0 kits. All 32 starters are owned at create. Family does not change kits.

**LHIPS-2026-08-31-007, 008 (still).** **LHIPS-2026-10-22-001 (new).**

---

## Technical limits

Formula AP 4008 / 1336 Frosts is a safe Number. Linear HP IEEE bound is still 1.801e15. Dungeon max 1030 is a safe Number. Motoko leftover / pow2 unchanged (09-01-004). HUD XP still saturates at 48 (09-01-001).

**LHIPS-2026-09-01-001, 003, 004 (still).** **LHIPS-2026-10-22-002 (new).**

---

## Telemetry / calibration

No series to compare XP rate, relative-level mix, battle length, death rate, discovery, advanced-AI, elite, or wallet growth. No player has been observed at dungeon 1030 vs player 2500, family-overwrite combat, or a 1336-Frost turn; the synthetic splits do not require that. Observed max player level is not a cap and is not used as the simulation horizon.

**LHIPS-2026-08-31-014 (still).**

---

## What this run did not do

- No change to RAF, map generation, turn logic, or damage math.
- No curve / spawn / kit / jackpot / GameKey / Crush / overlay / family / Frost-CD retune.
- No claim that current live players are at any of these levels.
- No reopen of unchanged 2026-08-31 through 2026-10-21 IDs.
