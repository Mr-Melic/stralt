# Long-Horizon Infinite Progression — 2026-10-26

Stralt has no character level cap in data or persist. This run re-simulated the **live formulas** at HEAD `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` / `#777` / `#819` / `#898` / `#960` / `#1016` / `#1077` inspected). Players are **not** assumed to reach these levels quickly. The mid-teens already exhaust intended XP income. Observed max level (unknown here) is not a cap.

Stress levels: 1, 10, 15, 25, 48, 50, 78, 100, 250, 325, 500, 1000, 2500, 5000, 1018, 1019, **10000, 50000, 100000**.

**Telemetry:** none. No encounter / duration / death / discovery series. Calibration is skipped. Real play would only check the synthetic model, not stop the horizon.

**This run does not redesign progression.** Findings are ACTION_IDs only. Prior `LHIPS-2026-08-31-001..014`, `09-01-001..004`, `09-02-001..002`, queued `09-21` (`#357`) through `10-25` (`#1077`) stay NEW unless a formula moved. This file adds IDs only for live slopes the earlier harness never filed (Mirror Field 20% reflects 100% of pre-RES Frost and cancels the hit; Void Mirror family 25% of pre-RES still keys on the family string after battle-start overwrite; Time Warp 15s is the wall-clock gate on the unbounded Frost dump; Tide Shade −1 MP becomes noise vs formula MP).

Harness: `src/frontend/src/utils/longHorizonSim.ts`  
Ledger: [`ACTION_IDS_LHIPS_2026-10-26.md`](./ACTION_IDS_LHIPS_2026-10-26.md)  
Stack: restacked onto `#1077` (`#357` + `#407` + `#475` + `#530` + `#560` + `#637` + `#670` + `#748` + `#777` + `#819` + `#898` + `#960` + `#1016` ancestors). One export per helper — do not concatenate sibling copies.

---

## Method

Authoritative sources (not comments, not `backend_extended`):

| Topic | Live formula (2026-10-26) |
| :--- | :--- |
| XP threshold (persist) | `100n * (1n << (N-1))` — `xpCurve.ts`; Motoko twin `main.mo` |
| Kill XP | `sum(enemy.level * 20)` — `rewardResolver.ts` |
| Mirror Field | 20% of single-target casts: `hp -= preCritDmgBM`, return true, skip `applyDamageToEnemy` |
| `preCritDmgBM` | catalog Frost after upgrade / crit / Blood Moon 1.25 / Fury 1.25; before SP and SR×RES |
| Void Mirror | `floor(preCritDmgBM * 0.25)` on `family === "void_mirror"`; hit still lands |
| Family roll | 30% then uniform among 7 ids (`spawnPolicy.ts`); battle-start wipes stats, keeps the string |
| Time Warp | `isTimeWarp ? 15 : 30` seconds; `advanceTurn` on expiry |
| Tide Shade | melee on-hit `{stat:"mp", modifier:-1, duration:2}` |

Monte Carlo: 4000 rolls per level, default tier config, no `localStorage` override.

---

## What moved since 2026-10-25

HEAD did not move (`0f5363f`). Formulas that 10-25 measured did not change. `#357` … `#1077` are still open; this run **unions** that harness rather than overwriting it.

| Prior ID | Drift |
| :--- | :--- |
| LHIPS-2026-10-25-001 | Titans +1000 / 1–5× unchanged. Mirror Field and Void Mirror skip `applyDamageDealt` on the player (different write). |
| LHIPS-2026-10-25-005 | Vampiric still mutates a throwaway snapshot. Reflect paths write `characterStats` directly instead. |
| LHIPS-2026-10-22-001 | Family **stats** still wiped. Family **string** still drives Void Mirror, Tide Shade, Ember Knight (10-26-002 / 004). |
| LHIPS-2026-10-22-002 | Un-surged Frost dump unchanged. Time Warp 15s is the wall-clock gate (10-26-003). Mirror Field expected self-damage is `0.2 * 20 * casts` (10-26-001). |
| LHIPS-2026-08-31-004 | Rook RES 100 at 78 still. Outgoing Blood Moon / Fury / crit become no-ops on chip-1, but they still raise reflected `preCritDmgBM`. |
| LHIPS-2026-08-31-011 | Spawn-placeholder one-shot at 14 / 24 unchanged. Void Mirror dump fails under-30 at 325 (10-26-002). |
| LHIPS-2026-09-28-003 | Formula MP vs 16-grid unchanged. Tide −1 MP is &lt; 5% of that MP from 425 (10-26-004). |
| LHIPS-2026-10-24-002 | Sacrifice still chips 1 vs RES 100 and still uses `dealDamage` — it skips Mirror Field and Void Mirror. |
| (new measurement) | Mirror Field reflect 20 / 25 / 31 / 40 (plain / Blood Moon / Blood+Fury / crit). Expected dump self-damage 28 / 5344 at 325 / 100000. |
| (new measurement) | Void Mirror reflect 5 from Frost 20. P(family) 0.3/7. Dump 10 / 35 / 6680 at 1 / 325 / 100000. Under-30 fails at 325. |
| (new measurement) | Time Warp 15s: 7 / 100 / 1336 un-surged casts at 325 / 7300 / 100000 → 0.47 / 6.67 / 89.07 casts/s. Stacked 267/s at 100000. |
| (new measurement) | Tide −1 / MP = 0.25 at 1; &lt; 0.05 from 425; 0.00025 at 100000. |

Unchanged and still NEW: XP wall 001; HUD sat 09-01-001; IEEE 002; RES/HP/AI/kits/discovery/summoner/challenge 004–011; jackpot + 100k/500k 09-01-002; leftover Nat / pow2 09-01-004; GameKey 10M 09-02-001; spell `10*2^n` 09-02-002; INIT/CHC 09-21; Crush vs player 09-22; lava/range 09-23; Blood Mend/fail 09-24; enrage/Shield-potion 09-25; kit vs Crush / idle regen 09-26; Frost TTK / summon HP / shrine 09-27; rush `player+2` / room Doka / MP-grid 09-28; portal-boss RES overwrite / shop 3:1 09-29; overlay AP / unused evasion 10-21; family overwrite / Frost dump / dungeon +30 10-22; Timestep / summon cap / summon INIT 10-23; Mist / Sacrifice / Surge / Surge+Overflow 10-24; Titans / Doka Fever / Iron Curse / wolf melee / Vampiric 10-25; no telemetry 014. Victory floor still uncapped on this HEAD (queued `#386`).

Line numbers in WorldExploration / `main.mo` match 10-25 on this HEAD.

---

## XP and practical rate

Unchanged from 10-25. Official income cannot fund 25+ in a realistic session count.

**LHIPS-2026-08-31-001 (still).** **LHIPS-2026-09-01-001 (still).**

---

## Mirror Field — 20% of the dump hits the player, not the pack

Registry hook is empty. Live WX reflects `preCritDmgBM` (catalog 20, not SP-buffed 21) and cancels the enemy hit. Blood Moon / Fury / crit still scale that pre-RES value after outgoing chip-1 is a floor of 1.

| Modifier on Frost 20 | Reflect (player) | Enemy after RES 100 |
| :--- | ---: | ---: |
| none | **20** | 1 (cancelled on the 20% roll) |
| Blood Moon | **25** | 1 |
| Blood Moon + Fury | **31** | 1 |
| crit | **40** | 1 |

Expected dump self-damage: **28** at 325, **5344** at 100000 (HP 500095). Not a one-shot. Two reflects fail under-30.

**LHIPS-2026-10-26-001 (new).** **LHIPS-2026-10-22-002 (still).** **LHIPS-2026-08-31-004 (still).**

---

## Void Mirror — family string survives the stat wipe

Battle-start still overwrites HP/RES/SP (10-22-001). `family === "void_mirror"` still reflects 25% of pre-RES Frost and the chip-1 hit still lands. Shield Charm is not consulted. P(family) = 0.3/7.

| Player level | Frost dump reflect | vs under-30 | vs linear HP |
| ---: | ---: | :--- | :--- |
| 1 | **10** (2×5) | under | 10% of 100 |
| 325 | **35** (7×5) | **fails** | 2.0% of 1720 |
| 100000 | **6680** (1336×5) | fails | 1.3% of 500095 |

After rook RES 100 the pack takes 1 and the player takes 5.

**LHIPS-2026-10-26-002 (new).** **LHIPS-2026-10-22-001 (still).** **LHIPS-2026-08-31-011 (still).**

---

## Time Warp — 15s vs the dump

The timer is the only wall-clock cap on zero-CD Frost × formula AP. Enemy AI is still one action, so the halved clock does not change enemy throughput.

| Level | Un-surged casts | Casts / 15s |
| ---: | ---: | ---: |
| 325 | 7 | 0.47 |
| 7300 | 100 | 6.67 |
| 100000 | 1336 | 89.07 |
| 100000 stacked | 4008 | 267.2 |

Humans cannot fill the theoretical dump. Time Warp truncates it further.

**LHIPS-2026-10-26-003 (new).** **LHIPS-2026-10-22-002 (still).** **LHIPS-2026-10-24-004 (still).**

---

## Tide Shade — −1 MP vs formula MP

Same surviving family string as Void Mirror. Additive −1 MP is 25% of create MP 4 and under 5% of formula MP from 425.

| Level | Formula MP | −1 / MP |
| ---: | ---: | ---: |
| 1 | 4 | **0.25** |
| 425 | 21 | **&lt; 0.05** |
| 100000 | 4004 | **0.00025** |

**LHIPS-2026-10-26-004 (new).** **LHIPS-2026-10-22-001 (still).** **LHIPS-2026-09-28-003 (still).**

---

## Telemetry

None. `runLongHorizonSim().telemetry.available === false`. Observed max level is not a cap and is not the simulation horizon.

**LHIPS-2026-08-31-014 (still).** **AQA-2026-08-30-012 (still).**
