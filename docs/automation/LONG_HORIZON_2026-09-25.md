# Long-Horizon Infinite Progression — 2026-09-25

Stralt has no character level cap in data or persist. This run re-simulated the **live formulas** at HEAD `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` inspected). Players are **not** assumed to reach these levels quickly. The mid-teens already exhaust intended XP income. Observed max level (unknown here) is not a cap.

Stress levels: 1, 10, 15, 25, 48, 50, 78, 100, 250, 325, 500, 1000, 2500, 5000, 1018, 1019, **10000, 50000, 100000**.

**Telemetry:** none. No encounter / duration / death / discovery series. `#333` / `#395` / `#462` / `#502` / `#504` / `#527` are still WAITING_FOR_TELEMETRY. Calibration is skipped. Real play would only check the synthetic model, not stop the horizon.

**This run does not redesign progression.** Findings are ACTION_IDs only. Prior `LHIPS-2026-08-31-001..014`, `09-01-001..004`, `09-02-001..002`, queued `09-21-001..002` (`#357`), queued `09-22-001` (`#407`), queued `09-23-001..002` (`#475`), and queued `09-24-001..002` (`#530`) stay NEW unless a formula moved. This file adds IDs only for live slopes the earlier harness never filed (betrayal enrage 6× Crush/HP; BuffShop flat absorb / flat potion cost vs linear HP).

Harness: `src/frontend/src/utils/longHorizonSim.ts`  
Ledger: [`ACTION_IDS_LHIPS_2026-09-25.md`](./ACTION_IDS_LHIPS_2026-09-25.md)  
Stack: restacked onto `#530` (`#357` + `#407` + `#475` ancestors). One export per helper — do not concatenate sibling copies.

---

## Method

Authoritative sources (not comments, not `backend_extended`):

| Topic | Live formula (2026-09-25) |
| :--- | :--- |
| XP threshold (persist) | `100n * (1n << (N-1))` — `xpCurve.ts` 24–26; Motoko twin `main.mo` 2126–2133 |
| XP threshold (HUD / recap) | same, but `xpForNextLevel` saturates at `Number.MAX_SAFE_INTEGER` from **level 48** (`xpCurve.ts` 32–36) |
| Kill XP | `sum(enemy.level * 20)` — `rewardResolver.ts` 89–101 |
| Portal XP | 10 |
| `applyRewards` ceilings | `dokaDelta > 100_000` / `xpDelta > 500_000` → `#err` (`main.mo` 2119–2120); client `clampApplyRewardsDeltas` |
| `saveBattleStats` | cannot raise **or lower** level (`main.mo` 2092–2093); cannot raise atk/res/**init** (`2064–2066`); AP/MP `persistApWriteCap` = formula then `MAX_PERSISTED_AP` 20 |
| GameKey | `redeemGameKey` credits `entry.dokaAmount` directly; max `MAX_DOKA_GRANT` 10_000_000 |
| Death | 20% leftover XP / **40% Doka** (`deathPenalty.ts` 11–12) via `saveBattleStats` |
| Spell upgrade | `baseCost * 2^currentLevel` (`main.mo` 1017–1023); default base 10 |
| Enemy level | `pickEnemyLevelFromTiers`, `maxTier = floor(999 / tierSize)` (`combatMath.ts` 54–107) |
| Enemy combat HP | `floor(50 * (1 + (L-1)*0.05))` (`WorldExploration.tsx` 3607–3612) |
| Player live max HP | `floor(100 * (1 + (L-1)*0.05))` (`WorldExploration.tsx` 3400–3406) |
| Fallback melee | Crush 12 / Fire Bolt 8 × `max(1, enemy.level / 5)` × **enrage 6** (`WorldExploration.tsx` 16710–16720), then RES twice |
| Betrayal enrage | AI tier ≥ 10 and 5% (`15594–15598`); on ally kill, Crush/HP ×6 (`15625–15646`, `16257`) |
| Shield Charm | absorb **20** (`WorldExploration.tsx` 3583–3585); BuffShop cost 100 |
| Shop potions | 30% / 70% of live `maxHp` (`3558–3571`); Doka cost **50 / 120** forever (`BuffShop.tsx` 31–46) |
| Blood Mend | catalog `healAmount: 12`; no `1.03^upgrade` |
| AI tier | level table + 30% uniform 1–10 (`combatMath.ts` 36–51) |
| Kits | `buildEnemyKit(piece, currentMap.levelZone)` — object, not number (`WorldExploration.tsx` 11920) |
| Summoner | `0.12 + playerLevel * 0.02` (`WorldExploration.tsx` 11932–11934) |
| Player summons | `SUMMON_BASE_HP` 50–120 at spell 0 (`gameConstants.ts` 71–82) |
| Boss combat | static `baseStats` (sample 350 HP), level `player+5` |
| Doka | frontend jackpot table (`WorldExploration.tsx` 12388–12408), then clamp to 100_000 per `applyRewards` call |

Monte Carlo: 4000 rolls per level, default tier config, no `localStorage` override.

---

## What moved since 2026-09-24

HEAD did not move (`0f5363f`). Formulas that 09-24 measured did not change. `#357` (INIT / CHC), `#407` (Crush), `#475` (hazards / range), and `#530` (Blood Mend / fail) are still open; this run **unions** that harness rather than overwriting it.

| Prior ID | Drift |
| :--- | :--- |
| LHIPS-2026-09-22-001 | Unenraged Crush still one-shots from 52 / 75 and recv at cap is still 1983. **Not closed.** This run measures the betrayal ×6 path that 09-22 left at `enrageMultiplier = 1`. |
| LHIPS-2026-09-24-001 | Blood Mend 12 still under 5% from 30. Shop potions still 30/70% of `maxHp`. This run files the **flat Doka cost** (50 / 120) and Shield Charm 20 that 09-24 only contrasted. |
| (new measurement) | Enraged Crush one-shots player 1 from enemy **9** (recv 107) and player 10 from **13**. At the spawn cap, recv is **11897** — linear HP exceeds that only from **2361**. |
| (new measurement) | Shield Charm 20 is punched through by Crush from enemy **11** (this run’s mean enemy at player 1 is 10.9, max 79). Health potion Doka/HP = 1.67 at 1, 0.28 at 100, 0.033 at 1000. |

Unchanged and still NEW: XP wall 001; HUD sat 09-01-001; IEEE 002; enemy 999 cap 003; RES/HP/AI/kits/discovery/summoner/boss/challenge 004–011; jackpot + 100k/500k 09-01-002; leftover Nat / pow2 09-01-004; GameKey 10M 09-02-001; spell `10*2^n` 09-02-002; INIT/CHC 09-21; Crush 09-22; lava/range 09-23; Blood Mend/fail 09-24; no telemetry 014.

Line numbers in WorldExploration / `main.mo` match 09-24 on this HEAD.

---

## XP and practical rate

| Level | Exact XP to next | HUD `xpForNextLevel` | Typical 3-kill XP | Fights to next |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 100 | 100 | ~660 | 0.15 (mean enemy ~11) |
| 10 | 51,200 | 51,200 | ~660 | ~78 |
| 15 | 1.64e6 | 1.64e6 | ~1,080 | ~1.5e3 |
| 25 | 1.678e9 | 1.678e9 | ~1,620 | ~1.0e6 |
| 48 | 1.407e16 | **MAX_SAFE 9.01e15** | ~2,760 | ~5.1e12 |
| 50 | 5.63e16 | MAX_SAFE | ~2,760 | ~2.0e13 |
| 100 | 6.34e31 | MAX_SAFE | ~5,700 | ~1.1e28 |
| 250 | 9.05e76 | MAX_SAFE | ~14,700 | ~6.2e72 |
| 500 | 1.64e152 | MAX_SAFE | ~29,700 | ~5.5e147 |
| 1000 | 5.36e302 | MAX_SAFE | ~59,520 | ~9.0e297 |
| 1018 | 1.40e308 | MAX_SAFE | ~59,580 | ~2.4e303 |
| 1019 | **Infinity** (IEEE) | MAX_SAFE | ~59,580 | never |
| 2500 | Infinity | MAX_SAFE | ~59,580 | never |
| 10000 | Infinity | MAX_SAFE | ~59,580 | never |
| 100000 | Infinity | MAX_SAFE | ~59,580 | never |

`applyXpDelta(0, 48, 1)` and `applyXpDelta(0, 1018, 1)` stay at that level. Official income cannot fund 25+ in a realistic session count. `saveBattleStats` cannot skip or demote the curve.

**LHIPS-2026-08-31-001 (still).** **LHIPS-2026-09-01-001 (still).**

---

## Enemy generation

Default weights: 60% same tier, 20% ±1, 10% ±2, leftover 10% ±3..6. `threeOrMorePercent: 5` is **not read**. Extra ±1 tier variance at 15% per side. Adjacent / ±2 do not clamp `maxTier`; ±3..6 do.

| Player | Mean enemy | Min | Max | P(below tier) | P(same) | P(above) |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 10.9 | 1 | **79** | 0 | 0.71 | 0.29 |
| 10 | 11.1 | 1 | 80 | 0 | 0.71 | 0.29 |
| 25 | 26.9 | 1 | 100 | 0.28 | 0.45 | 0.27 |
| 100 | 95.3 | 21 | 170 | 0.27 | 0.47 | 0.26 |
| 500 | 495.4 | 421 | 570 | 0.28 | 0.44 | 0.28 |
| 1000 | 992.0 | 926 | **1020** | 0.28 | 0.58 | 0.14 |
| 2500 | 993.3 | 931 | 1020 | **1.00** | 0 | 0 |
| 10000 | ~993 | 931 | 1020 | **1.00** | 0 | 0 |
| 100000 | ~993 | 931 | 1020 | **1.00** | 0 | 0 |

Dungeon boost is `+ boost * tierSize` (max +30 at depth 5) on top of this window. 100k confirms the 999 ceiling does not grow with the player.

**LHIPS-2026-08-31-003 (still).**

---

## Betrayal enrage 6× (new measurement)

Unenraged Crush (09-22-001) one-shots from enemy 52 / 75 and recv at cap 1020 is 1983 (trivial after player ~378). Live fallback multiplies that raw by `enragedEnemies.has(id) ? 6 : 1` (`WorldExploration.tsx` 16257, 16719). Enrage is armed only after a **betrayal kill**: `aiTier >= 10` and 5% (`15594–15598`), then HP/maxHp ×6 (`15638–15646`).

AI variance already leaks tier 10 at level 1 (~3.2% this run). Combined per-turn betrayal attempt ≈ 0.16% at low enemy level and ≈ 3.7% at 901+ (`0.73 * 0.05`) when an ally is still up.

| Player | HP | Enraged Crush one-shot from | Unenraged (09-22) |
| ---: | ---: | ---: | ---: |
| 1 | 100 | **9** (recv 107) | 52 |
| 10 | 145 | **13** | 75 |
| 15 | 170 | 15 | 88 |
| 25 | 220 | 19 | 113 |
| 1000 | 5,095 | 425 | never vs cap 1020 |
| 2360 | 11,895 | still dies to cap recv **11897** | — |
| **2361** | 11,900 | first survive at cap | — |
| 2500 | 12,595 | cap recv is 94% of HP | chip |
| 100000 | 500,095 | cap recv is 2.4% of HP | chip |

Enraged Crush at this run’s player-1 max enemy 79: recv 933 vs HP 100. Hunter / guardian / bomber summons (80 / 120 / 50) die to **unenraged** Crush 192 at enemy 80 (one RES pass, summon `res` 0). Enraged betrayer HP at cap is `2597 * 6 = 15582` vs Strike 10 / Frost 20.

**LHIPS-2026-09-25-001.**

---

## BuffShop catalog (new measurement)

HP potions are the only official heal that tracks `maxHp` (09-24-001). Their **Doka cost does not**. Combat items stay flat integers.

| Item | Cost | Effect | vs Crush / HP |
| :--- | ---: | :--- | :--- |
| Health Potion | **50** | `floor(maxHp * 0.3)` | 30 HP at 1; **1528** at 1000 |
| Greater Potion | **120** | `floor(maxHp * 0.7)` | 70 HP at 1; 3566 at 1000 |
| Shield Charm | 100 | absorb **20** | Crush recv > 20 from enemy **11** |
| Battle Elixir | 80 | +3 AP this turn | formula AP already 8–20 |
| Swift Boots | 90 | +2 MP this turn | — |
| Fury Potion | 150 | +25% damage 3 turns | +2.5 on Strike 10 |

Health potion Doka per HP restored: **1.67** at 1, **0.28** at 100, **0.033** at 1000, **0.00033** at 100000. One clamped jackpot (100_000) buys **2000** health potions. Death still cuts **40% of the whole wallet** (`deathPenalty.ts` 12) — 4_000_000 off one max GameKey — and does not touch the potion *rate*.

**LHIPS-2026-09-25-002.**

---

## Enemy / player stats (re-sim)

| Level | Live player HP | Formula (unused) HP | Victory HP floor | Persist AP | Formula AP |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 100 | 100 | 60 | 8 | 8 |
| 10 | 145 | 155 | **150 (> max)** | 8 | 8 |
| 25 | 220 | 323 | 300 | 9 | 9 |
| 100 | 595 | 12,524 | 1,050 | 12 | 12 |
| 325 | 1,720 | 7.33e8 | 3,300 | **20** | **21** |
| 1000 | 5,095 | 1.47e23 | 10,050 | 20 | 48 |
| 10000 | 50,095 | overflow-scale | 100,050 | 20 | 408 |
| 14500 | — | **JSON-null** | — | 20 | 588 |
| 100000 | 500,095 | JSON-null | 1,000,050 | 20 | 4008 |

First level a **max** RES roll can reach 100: rook 78, knight 84, king 107, pawn 126, queen 143, bishop 154. CHC 100: bishop 115, queen 120, king 138. `calcScaledDamage` still ignores caster level.

**LHIPS-2026-08-31-004, 005 (still).** **LHIPS-2026-09-21-002 (still).**

---

## AI

| Enemy level | Mean tier | P(tier 10 / betrayal gate) | P(tier ≥ 5 / erratic gate) |
| ---: | ---: | ---: | ---: |
| 1 | 2.4 | 0.032 | 0.176 |
| 10 | 2.3 | 0.026 | 0.174 |
| 101 | 5.2 | 0.034 | 0.887 |
| 901 | 8.7 | 0.734 | 0.878 |
| 1000 | 8.6 | 0.732 | 0.874 |

`instantKill` (gate 9) is unused. Summoner chance = 100% at player 44. Extra combatants stay saturated from 44 through 100000. Combined with 09-25-001, late packs are the ones most likely to arm the 6× Crush.

**LHIPS-2026-08-31-006, 009 (still).**

---

## Spell pools, discovery, fail, range, heals

Live `buildEnemyKit(currentMap.levelZone)` still yields the zone-0 kit. All 32 starters are owned at create. Blood Mend 12 under 5% from 30 / under 1% from 222. Spell fail 0 at 201 (Strike bypasses). Range cap 5 from 10 (base 4) / 40 (base 1).

**LHIPS-2026-08-31-007, 008 (still).** **LHIPS-2026-09-23-002 (still).** **LHIPS-2026-09-24-001, 002 (still).**

---

## Rewards / economy

- Kill Doka = `enemy.level * multiplier`. `roll < 0.0001` band still 0.01% × `1..1e9`.
- Persist still clamps the whole `applyRewards` call to 100_000 Doka / 500_000 XP.
- Jackpot hit persists **exactly 100_000**. Void+boost XP clamp from enemy **926**.
- `redeemGameKey` adds up to 10_000_000 Doka. Death then removes 40% of whatever is in the wallet (4M off one max key).
- `upgradeSpell` `10 * 2^n` still exceeds combat Doka at spell 14 and a max GameKey at 20.

**LHIPS-2026-09-01-002 (still).** **LHIPS-2026-09-02-001, 002 (still).** **LHIPS-2026-09-25-002 (potion cost / Shield).**

---

## Bosses / dungeons / hazards

Combat boss HP stays 350. Guide `1.08^5` shows 514. Lava under 5% from 42 / under 1% from 282. Challenge under-30 / under-50 still fail on a placeholder hit at 14 / 24.

**LHIPS-2026-08-31-010, 011 (still).** **LHIPS-2026-09-23-001 (still).**

---

## Technical limits

| Limit | What happens now |
| :--- | :--- |
| HUD `xpForNextLevel` | Saturates at `MAX_SAFE_INTEGER` from level 48 |
| Exact `100 * 2^(N-1)` as Number | Infinity at N=1019 (also 2500 / 10000 / 100000) |
| Unused exponential HP as Number | JSON-null / Inf from **14500** |
| Motoko `pow2` | `O(level)` multiplies on every `applyRewards` |
| `saveBattleStats` AP/MP | Formula then 20; battle AP unbounded (21 at 325) |
| Spell fail | **0 at 201** (Strike never rolled) |
| Spell range | Cap 5 from **10** / **40** |
| Blood Mend | Flat 12 |
| Shield Charm | Flat 20; Crush exceeds it from enemy 11 |
| Enraged Crush | Number-safe at cap (recv 11897); would be 240000×6 raw at a hypothetical enemy 100000 that cannot spawn |
| Potion costs | 50 / 120 Integer; no overflow; heal `floor` stays Number-safe through 100000 |
| Death 40% Doka | Exact through GameKey max; leftover XP 20% uses `Number` (09-01-004) |

**LHIPS-2026-09-01-001, 003, 004 (still).** **LHIPS-2026-09-25-001, 002.**

---

## Telemetry / calibration

No series to compare XP rate, relative-level mix, battle length, death rate, discovery, advanced-AI, elite, or wallet growth. Combat elite flags do not exist. Family 30% is cosmetic after battle-start overwrite. Open TBC / dashboard PRs do not add collectors. This run does not treat any observed max level as a cap.

**LHIPS-2026-08-31-014 (still).**

---

## What this run did not do

- No change to RAF, map generation, turn logic, or damage math.
- No curve / spawn / kit / jackpot / GameKey / enrage / BuffShop / heal / fail retune.
- No claim that current live players are at any of these levels.
- No reopen of unchanged 2026-08-31 through 2026-09-24 IDs.
- No merge of queued `#357`, `#386`, `#407`, `#475`, or `#530`.
