# Long-Horizon Infinite Progression — 2026-10-25

Stralt has no character level cap in data or persist. This run re-simulated the **live formulas** at HEAD `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` / `#777` / `#819` / `#898` / `#960` / `#1016` inspected). Players are **not** assumed to reach these levels quickly. The mid-teens already exhaust intended XP income. Observed max level (unknown here) is not a cap.

Stress levels: 1, 10, 15, 25, 48, 50, 78, 100, 250, 325, 500, 1000, 2500, 5000, 1018, 1019, **10000, 50000, 100000**.

**Telemetry:** none. No encounter / duration / death / discovery series. Calibration is skipped. Real play would only check the synthetic model, not stop the horizon.

**This run does not redesign progression.** Findings are ACTION_IDs only. Prior `LHIPS-2026-08-31-001..014`, `09-01-001..004`, `09-02-001..002`, queued `09-21` (`#357`) through `10-24` (`#1016`) stay NEW unless a formula moved. This file adds IDs only for live slopes the earlier harness never filed (Titan's Vigor +1000 misses the player while 1–5× multiplies only outgoing chip-1; Doka Fever +25% HP no-ops on overworld spawn; Iron Curse pulls rook RES 100 from 78 to 59; enemy-summon melee equals uncapped player.level; Vampiric Ground 15% mutates a throwaway player snapshot and floors to 0 on chip-1).

Harness: `src/frontend/src/utils/longHorizonSim.ts`  
Ledger: [`ACTION_IDS_LHIPS_2026-10-25.md`](./ACTION_IDS_LHIPS_2026-10-25.md)  
Stack: restacked onto `#1016` (`#357` + `#407` + `#475` + `#530` + `#560` + `#637` + `#670` + `#748` + `#777` + `#819` + `#898` + `#960` ancestors). One export per helper — do not concatenate sibling copies.

---

## Method

Authoritative sources (not comments, not `backend_extended`):

| Topic | Live formula (2026-10-25) |
| :--- | :--- |
| XP threshold (persist) | `100n * (1n << (N-1))` — `xpCurve.ts`; Motoko twin `main.mo` |
| Kill XP | `sum(enemy.level * 20)` — `rewardResolver.ts` |
| Titan's Vigor | `hp += 1000` on `combatantsRef`; then 1–5× on `applyDamageDealt` after RES chip-1 |
| Glass Realm | ×2 on the same `applyDamageDealt` hook; two-roll can pair with Titans |
| Doka Fever | +25% HP if `isEnemy ?? side === "enemy"`; 2× Doka at victory then 100k clamp |
| Iron Curse | `floor(res * 1.3)` on `combatantsRef`; healing-halved is a separate WX id-check |
| Hostile summon melee | `calcScaledDamage(atk ?? level, level, 0)` with no `atk`; level is `characterStats.level` |
| Vampiric Ground | `attacker.hp += floor(damage * 0.15)` on the object passed to `applyDamageDealt` |

Monte Carlo: 4000 rolls per level, default tier config, no `localStorage` override.

---

## What moved since 2026-10-24

HEAD did not move (`0f5363f`). Formulas that 10-24 measured did not change. `#357` … `#1016` are still open; this run **unions** that harness rather than overwriting it.

| Prior ID | Drift |
| :--- | :--- |
| LHIPS-2026-10-24-001 | Mist 5% still never commits. Titans +1000 is the same `combatantsRef` miss (10-25-001). Swift Winds +2 MP is the same miss and is not re-filed. |
| LHIPS-2026-10-24-002 | Sacrifice still chips 1 vs RES 100. Iron Curse pulls that chip-1 19 levels earlier (10-25-003). |
| LHIPS-2026-10-22-002 | Un-surged Frost dump is unchanged. Titans/Glass multiply the chip-1 after RES (10-25-001). Vampiric 15% of that chip-1 is 0 (10-25-005). |
| LHIPS-2026-10-23-003 | Summon INIT/RES still use player.level + king fallback. Hostile melee uses the same level and has no `atk` (10-25-004). |
| LHIPS-2026-09-01-002 | applyRewards 100k still clamps. Doka Fever 2× still hits that ceiling (10-25-002). |
| (new measurement) | Titans HP 50→1050 at L1; dungeon-cap 2622→3622. Chip-1 becomes 5 / 2 / 10 (Titans max / Glass / both). Frost dump exceeds cap at 39175 / 98125 / 19525. |
| (new measurement) | Doka Fever HP gate is false on `{}`. Unused bonus 12 / 655 at 50 / 2622 HP. |
| (new measurement) | Cursed rook RES 100 at 59 (uncursed 78); king 81 (uncursed 107). `ironCursedRes(100) === 130` still chips 1. |
| (new measurement) | Wolf melee === player.level. Exceeds cap Crush 2448 at 2448; dungeon-cap HP 2622 at 2622. Player HP at 2448 is 12335. |
| (new measurement) | Vampiric heal 3 from raw Frost 21; 0 from chip-1 / Titans-max 5 / Glass 2; 1 from Titans+Glass 10. |

Unchanged and still NEW: XP wall 001; HUD sat 09-01-001; IEEE 002; RES/HP/AI/kits/discovery/summoner/challenge 004–011; jackpot + 100k/500k 09-01-002; leftover Nat / pow2 09-01-004; GameKey 10M 09-02-001; spell `10*2^n` 09-02-002; INIT/CHC 09-21; Crush vs player 09-22; lava/range 09-23; Blood Mend/fail 09-24; enrage/Shield-potion 09-25; kit vs Crush / idle regen 09-26; Frost TTK / summon HP / shrine 09-27; rush `player+2` / room Doka / MP-grid 09-28; portal-boss RES overwrite / shop 3:1 09-29; overlay AP / unused evasion 10-21; family overwrite / Frost dump / dungeon +30 10-22; Timestep / summon cap / summon INIT 10-23; Mist / Sacrifice / Surge / Surge+Overflow 10-24; no telemetry 014. Victory floor still uncapped on this HEAD (queued `#386`).

Line numbers in WorldExploration / `main.mo` match 10-24 on this HEAD.

---

## XP and practical rate

Unchanged from 10-24. Official income cannot fund 25+ in a realistic session count.

**LHIPS-2026-08-31-001 (still).** **LHIPS-2026-09-01-001 (still).**

---

## Titan's Vigor — +1000 and 1–5× miss the published rule

Battle-start writes `combatantsRef` only. The player is not in that store. Incoming Crush never enters `applyDamageDealt`. Outgoing hits already chipped to 1 before the 1–5× roll.

| Player / pack | Linear HP | +1000 | Chip-1 × Titans max / Glass / both |
| ---: | ---: | ---: | :--- |
| Enemy 1 | 50 | **1050** | n/a (RES not 100 yet) |
| Dungeon cap 1030 | 2622 | **3622** | **5 / 2 / 10** from rook 78 |
| Un-surged Frost dump vs 2622 | — | — | exceeds at **39175 / 98125 / 19525** |

Incoming Crush is unchanged. The strip can snapshot un-bonused HP until the first `updateCombatant`.

**LHIPS-2026-10-25-001 (new).** **LHIPS-2026-10-24-001 (still).** **LHIPS-2026-08-31-004 (still).** **LHIPS-2026-10-22-002 (still).**

---

## Doka Fever — +25% HP never runs; 2× Doka still clamps

Overworld `generateEnemies` does not write `side` or `isEnemy`. The HP gate is `isEnemy ?? side === "enemy"` → false. Victory still doubles Doka, then `clampApplyRewardsDeltas` to 100_000.

| Pack HP | Unused +25% | Live 2× Doka |
| ---: | ---: | :--- |
| 50 (L1) | **12** | doubles, then 100k ceiling |
| 2622 (1030 cap) | **655** | same clamp |

Enemy-side summons that do set `side: "enemy"` spawn after battle-start, so they miss the hook too.

**LHIPS-2026-10-25-002 (new).** **LHIPS-2026-09-01-002 (still).** **LHIPS-2026-08-31-012 (still).**

---

## Iron Curse — rook chip-1 19 levels early

`floor(res * 1.3)` on `combatantsRef` only. The player never receives 1.3×. After RES 100 the damage factor is already 0, so 130% is still chip-1.

| Piece | Uncursed RES 100 | Cursed RES 100 |
| :--- | ---: | ---: |
| rook | **78** | **59** |
| king | 107 | **81** |

`ironCursedRes(100) === 130`. Healing-halved is a separate WX id-check, not this hook.

**LHIPS-2026-10-25-003 (new).** **LHIPS-2026-08-31-004 (still).** **LHIPS-2026-10-24-002 (still).**

---

## Hostile summon melee — damage === player.level

`spawnSummonUnit` spreads `computeEnemyStats` (no `atk`) and does not copy `summonKit` onto `spells`. Hunter `findKitSpell` sees an empty array, so adjacent wolves melee. Executor `atk ?? level` with hostile spawn `characterStats.level`.

| Player | Wolf melee | Cap Crush 1020 | Dungeon-cap HP 2622 | Player HP |
| ---: | ---: | ---: | ---: | ---: |
| 1 | **1** | under | under | 100 |
| 44 (100% summoners) | **44** | under | under | 315 |
| **2448** | **2448** | **equal** | under | **12335** |
| **2622** | **2622** | over | **equal** | 13205 |
| 100000 | **100000** | 41× | over | 500095 |

Player-controlled Dire Wolves still spend kit Strike 10 / Venom through the control panel. Catalog hunter HP stays 80, so Crush still one-shots the wolf from 34.

**LHIPS-2026-10-25-004 (new).** **LHIPS-2026-10-23-003 (still).** **LHIPS-2026-08-31-009 (still).**

---

## Vampiric Ground — 15% writes a snapshot, then floors to 0

`applyDamageDealt` mutates `attacker.hp`. The player caster is a throwaway `{hp, maxHp, id}` object. Incoming Crush never enters the hook.

| Source damage | `floor(dmg * 0.15)` | Lands on player HP? |
| ---: | ---: | :--- |
| Frost 21 (pre RES 100) | **3** | no |
| Chip-1 | **0** | no |
| Titans-max 5 / Glass 2 | **0** | no |
| Titans+Glass max 10 | **1** | no |

**LHIPS-2026-10-25-005 (new).** **LHIPS-2026-10-25-001 (still).** **LHIPS-2026-08-31-004 (still).**

---

## Spell pools and discovery

Live `LevelZone` object still yields zone-0 kits. All 32 starters are owned at create. Family does not change kits.

**LHIPS-2026-08-31-007, 008 (still).**

---

## Technical limits

Titans +1000 / ×10 chip-1, Fever bonus 655, cursed RES 130, melee 100000, and Vampiric heal 0/1/3 are safe Numbers. Formula AP 4008 is a safe Number. Linear HP IEEE bound is still 1.801e15. Dungeon max 1030 is a safe Number. Motoko leftover / pow2 unchanged (09-01-004). HUD XP still saturates at 48 (09-01-001).

**LHIPS-2026-09-01-001, 003, 004 (still).** **LHIPS-2026-10-25-001, 002, 003, 004, 005 (new).**

---

## Telemetry / calibration

No series to compare XP rate, relative-level mix, battle length, death rate, discovery, advanced-AI, elite, or wallet growth. No player has been observed at a wired Titans +1000, a Doka Fever +25% pack, a cursed-rook 59 chip-1, a player-level wolf melee, or a committed Vampiric heal; the synthetic splits do not require that. Observed max player level is not a cap and is not used as the simulation horizon.

**LHIPS-2026-08-31-014 (still).**

---

## What this run did not do

- No change to RAF, map generation, turn logic, or damage math.
- No curve / spawn / kit / jackpot / GameKey / Crush / overlay / family / Frost-CD / Timestep / summon-cap / Mist / Sacrifice / Surge / Overflow / Titans / Fever / Iron Curse / summon-melee / Vampiric retune.
- No claim that current live players are at any of these levels.
- No reopen of unchanged 2026-08-31 through 2026-10-24 IDs.
- Swift Winds +2 MP is the same `combatantsRef` miss as Mist (10-24-001) and is not a new ID.
