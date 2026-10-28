# Long-Horizon Infinite Progression — 2026-10-28

Stralt has no character level cap in data or persist. This run re-simulated the **live formulas** at HEAD `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` / `#777` / `#819` / `#898` / `#960` / `#1016` / `#1077` / `#1141` / `#1197` inspected). Players are **not** assumed to reach these levels quickly. The mid-teens already exhaust intended XP income. Observed max level (unknown here) is not a cap.

Stress levels: 1, 10, 15, 25, 48, 50, 78, 100, 250, 325, 500, 1000, 2500, 5000, 1018, 1019, **10000, 50000, 100000**.

**Telemetry:** none. No encounter / duration / death / discovery series. Calibration is skipped. Real play would only check the synthetic model, not stop the horizon.

**This run does not redesign progression.** Findings are ACTION_IDs only. Prior `LHIPS-2026-08-31-001..014`, `09-01-001..004`, `09-02-001..002`, queued `09-21` (`#357`) through `10-27` (`#1197`) stay NEW unless a formula moved. This file adds IDs only for live slopes the earlier harness never filed (Thorned Ground player-only walk tax; AI step budget 3 vs stacked cost 4; Swift Winds +2 never reaching live MP; Gravity Well / Fog of War empty slots; four family variants with no string combat identity).

Harness: `src/frontend/src/utils/longHorizonSim.ts`  
Ledger: [`ACTION_IDS_LHIPS_2026-10-28.md`](./ACTION_IDS_LHIPS_2026-10-28.md)  
Stack: restacked onto `#1197` (`#357` + `#407` + `#475` + `#530` + `#560` + `#637` + `#670` + `#748` + `#777` + `#819` + `#898` + `#960` + `#1016` + `#1077` + `#1141` ancestors). One export per helper — do not concatenate sibling copies.

---

## Method

Authoritative sources (not comments, not `backend_extended`):

| Topic | Live formula (2026-10-28) |
| :--- | :--- |
| XP threshold (persist) | `100n * (1n << (N-1))` — `xpCurve.ts`; Motoko twin `main.mo` |
| Kill XP | `sum(enemy.level * 20)` — `rewardResolver.ts` |
| Thorned Ground | Live walk `(pathLength-1)*5` (`battleSetup.ts`). Registry hook `(n-2)*5` if `n>2` is unused for walk. Player only. |
| Enemy walk | `ENEMY_REACHABLE_STEP_BUDGET = 3`. Cost 1 / 2 / 4. Tiles 3 / 1 / 0. |
| Swift Winds | `combatant.mp += 2` on turn-start target. Player MP restored from formula. AI uses the step budget. |
| Gravity / Fog | Empty registry hooks. `_isGravityWell` / `_isFogOfWar` unread. 2/22 first-pick. |
| Families | 30% × 7 ids. String hooks: ember / tide / void. Other four: pixels only after 10-22 overwrite. |

Monte Carlo: 4000 rolls per level, default tier config, no `localStorage` override.

---

## What moved since 2026-10-27

HEAD did not move (`0f5363f`). Formulas that 10-27 measured did not change. `#357` … `#1197` are still open; this run **unions** that harness rather than overwriting it.

| Prior ID | Drift |
| :--- | :--- |
| LHIPS-2026-10-27-004 | Player 4× walk cost unchanged (breakpoints 300 / 700 / 1500). Enemy step budget 3 was not measured; stacked cost 4 is 0 AI tiles (10-28-002). |
| LHIPS-2026-08-31-011 | Melee under-30 / under-50 at 14 / 24 unchanged. A full-MP Thorn walk also deals 30 at 75 (10-28-001). |
| LHIPS-2026-09-23-001 | Lava/spikes still flat. Thorn is a walk-path cousin, player-only, grid-capped at 145. |
| LHIPS-2026-10-24-001 / 10-25-001 | combatantsRef still has no player. Swift Winds +2 uses that miss **and** is overwritten by formula MP (10-28-003). |
| LHIPS-2026-10-22-001 | Family stats still wiped. String still drives Void / Tide / Ember. Four other families have no string hook (10-28-005). |
| (new measurement) | Thorn 0 / 5 / 30 / 50 at 1 / 2 / 7 / 11 tiles. Under-30 walk at **75**. Grid cap **145**. |
| (new measurement) | AI tiles 3 / 1 / 0. Player stacked tiles 1 / 16 / 1001 at 1 / 1500 / 100000. |
| (new measurement) | Swift Winds +2 is 50% of MP 4 at 1 and 0.05% of MP 4004 at 100000 — and does not apply. |
| (new measurement) | Gravity/Fog first-pick **9.1%**. Paint-only family **17.1%**. String-identity family **12.9%**. |

Unchanged and still NEW: XP wall 001; HUD sat 09-01-001; IEEE 002; RES/HP/AI/kits/discovery/summoner/challenge 004–011; jackpot + 100k/500k 09-01-002; leftover Nat / pow2 09-01-004; GameKey 10M 09-02-001; spell `10*2^n` 09-02-002; INIT/CHC 09-21; Crush vs player 09-22; lava/range 09-23; Blood Mend/fail 09-24; enrage/Shield-potion 09-25; kit vs Crush / idle regen 09-26; Frost TTK / summon HP / shrine 09-27; rush `player+2` / room Doka / MP-grid 09-28; portal-boss RES overwrite / shop 3:1 09-29; overlay AP / unused evasion 10-21; family overwrite / Frost dump / dungeon +30 10-22; Timestep / summon cap / summon INIT 10-23; Mist / Sacrifice / Surge / Surge+Overflow 10-24; Titans / Doka Fever / Iron Curse / wolf melee / Vampiric 10-25; Mirror Field / Void Mirror / Time Warp / Tide 10-26; Windstorm / Chaos / Shield-skip / Slime+Frozen 10-27; no telemetry 014. Victory floor still uncapped on this HEAD (queued `#386`).

Line numbers in WorldExploration / `main.mo` match 10-27 on this HEAD.

---

## XP and practical rate

Unchanged from 10-27. Official income cannot fund 25+ in a realistic session count.

**LHIPS-2026-08-31-001 (still).** **LHIPS-2026-09-01-001 (still).**

---

## Thorned Ground — player-only walk tax, then grid-capped noise

| Path length | Live HP | Registry hook | Notes |
| ---: | ---: | ---: | :--- |
| 1 | 0 | 0 | Free step |
| 2 | **5** | 0 | Threshold split |
| 7 | **30** | 25 | under-30; first at formula MP 7 / level **75** |
| 11 | **50** | 45 | under-50; level **175** |
| 30 (grid diameter) | **145** | 140 | cap. 31% of HP at 75; 0.029% at 100000 |

Enemies do not pay. 08-31-011 remains the melee one-shot of those challenges.

**LHIPS-2026-10-28-001 (new).** **LHIPS-2026-08-31-011 (still).** **LHIPS-2026-09-23-001 (still).**

---

## Enemy walk budget — 3 steps forever; stacked floods freeze packs

| Cost | AI tiles | Player tiles at 1 | Player tiles at 1500 | Player tiles at 100000 |
| ---: | ---: | ---: | ---: | ---: |
| 1 (plain) | **3** | 4 | 64 | 4004 |
| 2 (Slime or Frozen) | **1** | 2 | 32 | 2002 |
| 4 (both) | **0** | 1 | 16 | 1001 |

10-27-004 is the player 4× cost. This is the AI budget that never joined formula MP.

**LHIPS-2026-10-28-002 (new).** **LHIPS-2026-10-27-004 (still).** **LHIPS-2026-09-28-003 (still).**

---

## Swift Winds — advertised +2 MP does not apply

The hook mutates `combatant.mp`. Player MP is `currentBattleMp` restored from the formula. The player is not in `combatantsRef`. AI walk does not read `combatant.mp`. Swift Boots the item is a different `setCurrentBattleMp(+2)` path.

| Level | Formula MP | +2 if it applied |
| ---: | ---: | ---: |
| 1 | 4 | **50%** |
| 100000 | 4004 | **0.05%** |

**LHIPS-2026-10-28-003 (new).** **LHIPS-2026-10-24-001 (still).** **LHIPS-2026-10-26-004 (still).**

---

## Gravity Well / Fog of War — 2/22 flavor slots

Empty hooks. Unused `_is*` flags. First-pick **9.1%**. Distinct from Paper Windstorm, which has a live miss tax.

**LHIPS-2026-10-28-004 (new).** **LHIPS-2026-10-27-001 (still).**

---

## Family diversity — 4/7 paint-only after the overwrite

| Roll | Chance |
| :--- | ---: |
| Family variant at all | 30% |
| Paint-only (wraith / golem / rat / scribe) | **17.1%** |
| String identity (ember / tide / void) | **12.9%** |

The three string hooks do not scale. Extreme progression does not add a fourth family.

**LHIPS-2026-10-28-005 (new).** **LHIPS-2026-10-22-001 (still).** **LHIPS-2026-10-26-002 (still).** **LHIPS-2026-10-26-004 (still).**

---

## Telemetry

None. `runLongHorizonSim().telemetry.available === false`. Observed max level is not a cap and is not the simulation horizon.

**LHIPS-2026-08-31-014 (still).** **AQA-2026-08-30-012 (still).**
