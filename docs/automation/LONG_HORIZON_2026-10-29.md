# Long-Horizon Infinite Progression — 2026-10-29

Stralt has no character level cap in data or persist. This run re-simulated the **live formulas** at HEAD `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` / `#777` / `#819` / `#898` / `#960` / `#1016` / `#1077` / `#1141` / `#1197` / `#1250` inspected). Players are **not** assumed to reach these levels quickly. The mid-teens already exhaust intended XP income. Observed max level (unknown here) is not a cap.

Stress levels: 1, 10, 15, 25, 48, 50, 78, 100, 250, 325, 500, 1000, 2500, 5000, 1018, 1019, **10000, 50000, 100000**.

**Telemetry:** none. No encounter / duration / death / discovery series. Calibration is skipped. Real play would only check the synthetic model, not stop the horizon.

**This run does not redesign progression.** Findings are ACTION_IDs only. Prior `LHIPS-2026-08-31-001..014`, `09-01-001..004`, `09-02-001..002`, queued `09-21` (`#357`) through `10-28` (`#1250`) stay NEW unless a formula moved. This file adds IDs only for live slopes the earlier harness never filed (Blood Mend / Rallying Cry CHC buff never applied; Iron Curse heal-halved no-op; victory AP/MP floors vs formula `/25`; player-cast Frost/Drain catalog debuffs dropped; Arcane Overflow 10% after spell-fail 0; portal +10 vs leftover death cut; intended kit zone saturates at 2; map zone label uncapped vs 999 pick; unused `usableByEnemy` random pool; `saveKillCount` never called).

Harness: `src/frontend/src/utils/longHorizonSim.ts`  
Ledger: [`ACTION_IDS_LHIPS_2026-10-29.md`](./ACTION_IDS_LHIPS_2026-10-29.md)  
Stack: restacked onto `#1250` (`#357` + `#407` + `#475` + `#530` + `#560` + `#637` + `#670` + `#748` + `#777` + `#819` + `#898` + `#960` + `#1016` + `#1077` + `#1141` + `#1197` ancestors). One export per helper — do not concatenate sibling copies.

---

## Method

Authoritative sources (not comments, not `backend_extended`):

| Topic | Live formula (2026-10-29) |
| :--- | :--- |
| XP threshold (persist) | `100n * (1n << (N-1))` — `xpCurve.ts`; Motoko twin `main.mo` |
| Kill XP | `sum(enemy.level * 20)` — `rewardResolver.ts` |
| Portal XP | Flat `PORTAL_TRANSITION_XP = 10` |
| Blood Mend / Rallying Cry CHC | Catalog `buffModifier: 0.15`. Heal branch returns after `ctx.heal`. |
| Iron Curse heal | Announce “healing halved”. Registry heal hook logs and returns true. WX never halves. |
| Victory AP/MP | `6+floor(L/20)` / `5+floor(L/10)` vs formula `8+floor(L/25)` / `4+floor(L/25)` |
| Player-cast debuffs | `resolvePlayerCast` damage loop never `applyEffect`s `debuffStat` |
| Arcane Overflow | Flat 10% on `applyEffectApplication` after spell-fail hits 0 at 201 |
| Kit zone | Intended `playerTier+1`. Queen/king gates stop at `z>=2`. Live call still passes a LevelZone object. |
| Zone label | Uncapped `Tier ${playerTier+1}` / player-tier band. Pick max `floor(999/ts)` + adj leak 1020. |
| Advanced pool | `_enemyUsableSpells` filtered, never assigned. Comment still says 10 random spells. |
| Kill counter | `useSaveKillCount` defined, never called. Canister rejects `kills > 64` per call. |

Monte Carlo: 4000 rolls per level, default tier config, no `localStorage` override.

---

## What moved since 2026-10-28

HEAD did not move (`0f5363f`). Formulas that 10-28 measured did not change. `#357` … `#1250` are still open; this run **unions** that harness rather than overwriting it.

| Prior ID | Drift |
| :--- | :--- |
| LHIPS-2026-09-24-001 | Blood Mend heal 12 unchanged. Advertised +15% CHC never lands (10-29-001). Rallying Cry uses the same 0.15 catalog. |
| LHIPS-2026-10-25-003 | Iron Curse RES×1.3 unchanged. “Healing halved” is a separate no-op (10-29-002). |
| LHIPS-2026-08-31-005 | Victory HP floor unchanged. AP/MP floors are a new slope axis (10-29-003). |
| LHIPS-2026-10-22-002 | Frost dump unchanged. Catalog MP/SP debuffs never land on the player path (10-29-004). |
| LHIPS-2026-09-24-002 | Spell-fail still 0 at 201. Overflow’s 10% effect fizzle remains (10-29-005). |
| LHIPS-2026-08-31-001 | XP wall unchanged. Portal +10 vs leftover death cut is a recovery axis (10-29-006). |
| LHIPS-2026-08-31-007 | LevelZone object still NaN. Intended zone≥2 is a terminal kit band (10-29-007). Unused random pool is 10-29-009. |
| LHIPS-2026-08-31-003 | 999 pick unchanged. Zone label uncapped is new (10-29-008). |
| LHIPS-2026-08-31-008 | Player still owns all 32 starters. Enemy random pool is never assigned (10-29-009). |
| (new measurement) | Victory AP/MP 6 / 5 at 1 vs formula 8 / 4; 5006 / 10005 vs 4008 / 4004 at 100000. |
| (new measurement) | Portal fraction 0.1 at 1; IEEE 0 at 100000. Near-full-bar death needs 2 portals at 1, >1e29 at 100. |
| (new measurement) | Intended kit zone 1 / 2 / 10000 at 1 / 11 / 100000. Queen Inferno kit identical at 11 and 100000. |
| (new measurement) | Zone label max 100000 vs pick 1020. Advanced-pool chance 0. `saveKillCount` unused. |

Unchanged and still NEW: XP wall 001; HUD sat 09-01-001; IEEE 002; RES/HP/AI/kits/discovery/summoner/challenge 004–011; jackpot + 100k/500k 09-01-002; leftover Nat / pow2 09-01-004; GameKey 10M 09-02-001; spell `10*2^n` 09-02-002; INIT/CHC 09-21; Crush vs player 09-22; lava/range 09-23; Blood Mend heal/fail 09-24; enrage/Shield-potion 09-25; kit vs Crush / idle regen 09-26; Frost TTK / summon HP / shrine 09-27; rush `player+2` / room Doka / MP-grid 09-28; portal-boss RES overwrite / shop 3:1 09-29; overlay AP / unused evasion 10-21; family overwrite / Frost dump / dungeon +30 10-22; Timestep / summon cap / summon INIT 10-23; Mist / Sacrifice / Surge / Surge+Overflow 10-24; Titans / Doka Fever / Iron Curse RES / wolf melee / Vampiric 10-25; Mirror Field / Void Mirror / Time Warp / Tide 10-26; Windstorm / Chaos / Shield-skip / Slime+Frozen 10-27; Thorn / AI budget / Swift Winds / Gravity-Fog / paint-only 10-28; no telemetry 014. Victory floor still uncapped on this HEAD (queued `#386`).

Line numbers in WorldExploration / `main.mo` match 10-28 on this HEAD.

---

## XP and practical rate

Unchanged from 10-28. Official income cannot fund 25+ in a realistic session count.

**LHIPS-2026-08-31-001 (still).** **LHIPS-2026-09-01-001 (still).**

---

## Blood Mend / Rallying Cry — advertised +15% CHC never applied

Heal branch heals then `return "cast"`. Shield path requires `effectType === "buff"`. Catalog `buffModifier: 0.15` would multiply CHC by 0.15 (−85%) if the shield-style path ever saw it. Create CHC stays 5.

**LHIPS-2026-10-29-001 (new).** **LHIPS-2026-09-24-001 (still).** **LHIPS-2026-09-21-002 (still).**

---

## Iron Curse — “healing halved” is flavor

Announce and registry log claim a 0.5 tax. WX has no `iron_curse` heal branch. Blood Mend uses `ctx.heal`. RES×1.3 still runs on `combatantsRef` (10-25-003).

**LHIPS-2026-10-29-002 (new).** **LHIPS-2026-10-25-003 (still).**

---

## Victory AP/MP floors — `/20` and `/10` vs formula `/25`

| Level | Formula AP/MP | Victory AP/MP |
| ---: | ---: | ---: |
| 1 | 8 / 4 | 6 / 5 |
| 75 | 11 / 7 | 9 / 12 |
| 1500 | 68 / 64 | 81 / 155 |
| 100000 | 4008 / 4004 | 5006 / 10005 |

MP exceeds create maxMp (5) from **10**. AP exceeds formula from **220**. Next battle still restores formula.

**LHIPS-2026-10-29-003 (new).** **LHIPS-2026-08-31-005 (still).** **LHIPS-2026-09-01-003 (still).**

---

## Player-cast catalog debuffs dropped

Frost −1 MP and Life Drain SP 0.8 never `applyEffect` on the player path. Enemy AI still applies its own. Frost dump at 100000 is 1336 casts with zero MP tax.

**LHIPS-2026-10-29-004 (new).** **LHIPS-2026-10-22-002 (still).** **LHIPS-2026-10-26-004 (still).**

---

## Arcane Overflow 10% after spell-fail hits 0

Base fail is 0 at **201**. Overflow still rolls `rng < 0.1` on non-DoT `applyEffectApplication` (Shield / Haste). Damage Frost dump never enters that gate.

**LHIPS-2026-10-29-005 (new).** **LHIPS-2026-09-24-002 (still).** **LHIPS-2026-10-24-004 (still).**

---

## Portal +10 vs exponential threshold / death recovery

| Level | Portal / threshold | Portals to recover near-full leftover |
| ---: | ---: | ---: |
| 1 | **0.1** | **2** |
| 100 | <1e-30 | **>1e29** |
| 100000 | **0** (IEEE) | n/a (threshold not IEEE-finite) |

**LHIPS-2026-10-29-006 (new).** **LHIPS-2026-08-31-001 (still).** **LHIPS-2026-09-01-001 (still).**

---

## Intended kit zone saturates at 2 (player 11)

Queen intended kit at 11 / 100 / 100000 is the same `["spell-inferno","starter-heal"]`. Live object call is still zone-0 (007). Inferno direct damage is still 0 (09-26-001).

**LHIPS-2026-10-29-007 (new).** **LHIPS-2026-08-31-007 (still).** **LHIPS-2026-09-26-001 (still).**

---

## Map zone label uncapped vs pick max 1020

At 100000 the label is Tier **10000** / levels 99991–100000 while packs roll ≤1020 (dungeon 1030).

**LHIPS-2026-10-29-008 (new).** **LHIPS-2026-08-31-003 (still).** **LHIPS-2026-10-22-003 (still).**

---

## Advanced / rare enemy pool is never assigned

Battle-start comment: “Assign 10 random spells per enemy from usableByEnemy pool.” Live code filters `_enemyUsableSpells` and never reads it. `assignEnemySpells` is kits only. Random advanced chance is **0** at 1 and at 100000. Summoner 100% at 44 (009 of 08-31) can still append wolf/archer.

**LHIPS-2026-10-29-009 (new).** **LHIPS-2026-08-31-007 (still).** **LHIPS-2026-10-29-007 (still).** **LHIPS-2026-08-31-008 (still).**

---

## Kill-count counter stays at create 0

`useSaveKillCount` is defined and never called from play UI. Canister `saveKillCount` rejects `kills > 64` per call. Create `killCount` is 0. Official clients never hit the bound.

**LHIPS-2026-10-29-010 (new).**

---

## Telemetry

None. `runLongHorizonSim().telemetry.available === false`. Observed max level is not a cap and is not the simulation horizon.

**LHIPS-2026-08-31-014 (still).** **AQA-2026-08-30-012 (still).**
