# Long-Horizon Infinite Progression — 2026-10-27

Stralt has no character level cap in data or persist. This run re-simulated the **live formulas** at HEAD `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` / `#777` / `#819` / `#898` / `#960` / `#1016` / `#1077` / `#1141` inspected). Players are **not** assumed to reach these levels quickly. The mid-teens already exhaust intended XP income. Observed max level (unknown here) is not a cap.

Stress levels: 1, 10, 15, 25, 48, 50, 78, 100, 250, 325, 500, 1000, 2500, 5000, 1018, 1019, **10000, 50000, 100000**.

**Telemetry:** none. No encounter / duration / death / discovery series. Calibration is skipped. Real play would only check the synthetic model, not stop the horizon.

**This run does not redesign progression.** Findings are ACTION_IDs only. Prior `LHIPS-2026-08-31-001..014`, `09-01-001..004`, `09-02-001..002`, queued `09-21` (`#357`) through `10-26` (`#1141`) stay NEW unless a formula moved. This file adds IDs only for live slopes the earlier harness never filed (Paper Windstorm 30%/50% miss vs advertised range and Crush immunity; Chaos Initiative vs INIT freeze + shuffle-after-dispatch; starter-shield skipped on Crush melee; Slime+Frozen 4× walk MP vs the 16-grid).

Harness: `src/frontend/src/utils/longHorizonSim.ts`  
Ledger: [`ACTION_IDS_LHIPS_2026-10-27.md`](./ACTION_IDS_LHIPS_2026-10-27.md)  
Stack: restacked onto `#1141` (`#357` + `#407` + `#475` + `#530` + `#560` + `#637` + `#670` + `#748` + `#777` + `#819` + `#898` + `#960` + `#1016` + `#1077` ancestors). One export per helper — do not concatenate sibling copies.

---

## Method

Authoritative sources (not comments, not `backend_extended`):

| Topic | Live formula (2026-10-27) |
| :--- | :--- |
| XP threshold (persist) | `100n * (1n << (N-1))` — `xpCurve.ts`; Motoko twin `main.mo` |
| Kill XP | `sum(enemy.level * 20)` — `rewardResolver.ts` |
| Paper Windstorm | Player 30% miss (`paperWindstormMiss`); enemy 50% miss if range &gt; 1; Crush range 1 never misses. Advertised 50% range unused. |
| Chaos Initiative | Fisher-Yates on owners when wrap to index 0, **after** dispatch |
| Starter Shield | `buffModifier` 1.3 on RES. Crush melee reads create RES 10 and skips `playerTakesDamage`. |
| Slime / Frozen | Each doubles walk MP; they stack to 4. Formula MP `4 + floor(L/25)`. Grid 16. |

Monte Carlo: 4000 rolls per level, default tier config, no `localStorage` override.

---

## What moved since 2026-10-26

HEAD did not move (`0f5363f`). Formulas that 10-26 measured did not change. `#357` … `#1141` are still open; this run **unions** that harness rather than overwriting it.

| Prior ID | Drift |
| :--- | :--- |
| LHIPS-2026-10-22-002 | Un-surged Frost dump unchanged. Paper Windstorm keeps 30% of those casts from landing (10-27-001). Time Warp is still the wall-clock (10-26-003). |
| LHIPS-2026-09-22-001 | Crush one-shot unchanged. Paper Windstorm cannot miss it (range 1). Starter Shield cannot cut it (10-27-003). |
| LHIPS-2026-09-21-001 | INIT freeze unchanged. Chaos Initiative is the remaining first-turn lottery (10-27-002). |
| LHIPS-2026-09-28-003 | Unbuffed MP vs 16-grid still saturates at 300. Slime+Frozen 4× moves that to 1500 (10-27-004). |
| LHIPS-2026-09-23-002 | Range cap 5 unchanged. Advertised Paper Windstorm 50% range is still unused. |
| LHIPS-2026-09-25-002 | Shield Charm absorb 20 still runs on Crush melee. Starter Shield RES buff does not. |
| (new measurement) | Player Windstorm expected dump hits 4.9 / 935.2 at 325 / 100000. Crush miss 0. Fire Bolt miss 0.5. |
| (new measurement) | Chaos P(player first) = 0.25 / 1/9 on 3-pack / 8-pack. INIT first at 250 &lt; 0.02. |
| (new measurement) | Shield 1.3 → RES 13 if applied; Crush melee still uses 10. |
| (new measurement) | Walk cost 1 / 2 / 4. Full-grid MP 16 / 32 / 64. Breakpoints 300 / 700 / 1500. |

Unchanged and still NEW: XP wall 001; HUD sat 09-01-001; IEEE 002; RES/HP/AI/kits/discovery/summoner/challenge 004–011; jackpot + 100k/500k 09-01-002; leftover Nat / pow2 09-01-004; GameKey 10M 09-02-001; spell `10*2^n` 09-02-002; INIT/CHC 09-21; Crush vs player 09-22; lava/range 09-23; Blood Mend/fail 09-24; enrage/Shield-potion 09-25; kit vs Crush / idle regen 09-26; Frost TTK / summon HP / shrine 09-27; rush `player+2` / room Doka / MP-grid 09-28; portal-boss RES overwrite / shop 3:1 09-29; overlay AP / unused evasion 10-21; family overwrite / Frost dump / dungeon +30 10-22; Timestep / summon cap / summon INIT 10-23; Mist / Sacrifice / Surge / Surge+Overflow 10-24; Titans / Doka Fever / Iron Curse / wolf melee / Vampiric 10-25; Mirror Field / Void Mirror / Time Warp / Tide 10-26; no telemetry 014. Victory floor still uncapped on this HEAD (queued `#386`).

Line numbers in WorldExploration / `main.mo` match 10-26 on this HEAD.

---

## XP and practical rate

Unchanged from 10-26. Official income cannot fund 25+ in a realistic session count.

**LHIPS-2026-08-31-001 (still).** **LHIPS-2026-09-01-001 (still).**

---

## Paper Windstorm — 30% of the dump misses; Crush never does

Announce text and `MAP_MODIFIER_PAPER_WINDSTORM_RANGE_REDUCTION` say range ×0.5. Targeting never reads that constant. Live rolls are miss chances, and they are asymmetric.

| Path | Rule | At 100000 dump |
| :--- | :--- | ---: |
| Player Frost / any `spellEngine` hit | 30% miss | **400.8** expected misses, **935.2** hits |
| Enemy kit / Fire Bolt (range &gt; 1) | 50% miss | Fire Bolt is the weaker fallback |
| Enemy Crush (range 1) | **never misses** | one-shot path (09-22-001) |

**LHIPS-2026-10-27-001 (new).** **LHIPS-2026-10-22-002 (still).** **LHIPS-2026-09-22-001 (still).**

---

## Chaos Initiative — only first-turn lottery after INIT freeze

Player INIT 10 is frozen. INIT-sort P(player first) is already small in the teens and &lt; 2% at 250. Chaos shuffles owners when the wrap lands on index 0, **after** that index has already been dispatched.

| Living owners (player + enemies) | P(player first \| chaos) |
| ---: | ---: |
| 4 (3-pack) | **0.25** |
| 9 (8-pack) | **1/9** |

The strip then disagrees with the actor `advanceTurn` already entered.

**LHIPS-2026-10-27-002 (new).** **LHIPS-2026-09-21-001 (still).**

---

## Starter Shield — 1.3× RES skipped on Crush

`playerTakesDamage` would apply the buff. Crush melee does not call it. Create RES 10 is used once. Shield Charm absorb 20 still runs.

| If Shield applied | Live Crush melee |
| :--- | :--- |
| RES **13** | RES **10** |

**LHIPS-2026-10-27-003 (new).** **LHIPS-2026-09-22-001 (still).** **LHIPS-2026-09-25-002 (still).**

---

## Slime + Frozen — 4 MP/tile vs formula MP

| Modifier | MP / tile | Full 16-grid | First level formula MP covers it |
| :--- | ---: | ---: | ---: |
| none | 1 | 16 | **300** |
| Slime or Frozen | 2 | 32 | **700** |
| both | **4** | **64** | **1500** |

At 1, stacked cost is the entire MP 4 budget for one tile. At 100000 it is 0.001 of MP 4004.

**LHIPS-2026-10-27-004 (new).** **LHIPS-2026-09-28-003 (still).** **LHIPS-2026-10-26-004 (still).**

---

## Telemetry

None. `runLongHorizonSim().telemetry.available === false`. Observed max level is not a cap and is not the simulation horizon.

**LHIPS-2026-08-31-014 (still).** **AQA-2026-08-30-012 (still).**
