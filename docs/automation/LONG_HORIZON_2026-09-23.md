# Long-Horizon Infinite Progression — 2026-09-23

Stralt has no character level cap in data or persist. This run re-simulated the **live formulas** at HEAD `0f5363f` (same commit `#357` / `#407` inspected). Players are **not** assumed to reach these levels quickly. The mid-teens already exhaust intended XP income. Observed max level (unknown here) is not a cap.

Stress levels: 1, 10, 15, 25, 48, 50, 78, 100, 250, 325, 500, 1000, 2500, 5000, 1018, 1019, **10000, 50000, 100000**.

**Telemetry:** none. No encounter / duration / death / discovery series. `#333` / `#395` / `#447` are still WAITING_FOR_TELEMETRY. Calibration is skipped. Real play would only check the synthetic model, not stop the horizon.

**This run does not redesign progression.** Findings are ACTION_IDs only. Prior `LHIPS-2026-08-31-001..014`, `09-01-001..004`, `09-02-001..002`, queued `09-21-001..002` (`#357`), and queued `09-22-001` (`#407`) stay NEW unless a formula moved. This file adds IDs only for live slopes the earlier harness never filed (flat lava/spike/DoT vs linear HP, and `maxSpellRange` 5).

Harness: `src/frontend/src/utils/longHorizonSim.ts`  
Ledger: [`ACTION_IDS_LHIPS_2026-09-23.md`](./ACTION_IDS_LHIPS_2026-09-23.md)

---

## Method

Authoritative sources (not comments, not `backend_extended`):

| Topic | Live formula (2026-09-23) |
| :--- | :--- |
| XP threshold (persist) | `100n * (1n << (N-1))` — `xpCurve.ts` 24–26; Motoko twin `main.mo` 2126–2133 |
| XP threshold (HUD / recap) | same, but `xpForNextLevel` saturates at `Number.MAX_SAFE_INTEGER` from **level 48** (`xpCurve.ts` 32–36) |
| Kill XP | `sum(enemy.level * 20)` — `rewardResolver.ts` 89–101 |
| Portal XP | 10 |
| `applyRewards` ceilings | `dokaDelta > 100_000` / `xpDelta > 500_000` → `#err` (`main.mo` 2119–2120); client `clampApplyRewardsDeltas` |
| `saveBattleStats` | cannot raise **or lower** level (`main.mo` 2092–2093); cannot raise atk/res/**init** (`2064–2066`); AP/MP `persistApWriteCap` = formula then `MAX_PERSISTED_AP` 20 |
| GameKey | `redeemGameKey` credits `entry.dokaAmount` directly; max `MAX_DOKA_GRANT` 10_000_000 |
| Spell upgrade | `baseCost * 2^currentLevel` (`main.mo` 1017–1023); default base 10 |
| Enemy level | `pickEnemyLevelFromTiers`, `maxTier = floor(999 / tierSize)` (`combatMath.ts` 54–107) |
| Enemy combat HP | `floor(50 * (1 + (L-1)*0.05))` (`WorldExploration.tsx` 3607–3612) |
| Player live max HP | `floor(100 * (1 + (L-1)*0.05))` (`WorldExploration.tsx` 3400–3406) |
| Player formula HP | `round(100 * 1.05^(L-1))` — unused for HP; JSON-null (IEEE Inf) from **14500** |
| Player battle AP/MP | unbounded `getPlayerBaseStats` (`WorldExploration.tsx` 12105–12116) |
| Player battle INIT | persisted `characterStats.init` (`WorldExploration.tsx` 11948); create value 10 |
| Fallback melee | Crush 12 / Fire Bolt 8 × `max(1, enemy.level / 5)` (`WorldExploration.tsx` 16710–16728), then RES twice |
| Lava / spikes | lava `8..15` then Burning 3/turn (`WorldExploration.tsx` 11428–11452); spikes `5..10` (`11469`). Direct HP subtract — no RES |
| Spell range | `min(max(1, base) + floor(level / 10), 5)` (`WorldExploration.tsx` 3652–3664; `spellRangeBase` `targeting.ts` 111–115) |
| AI tier | level table + 30% uniform 1–10 (`combatMath.ts` 36–51) |
| Kits | `buildEnemyKit(piece, currentMap.levelZone)` — object, not number (`WorldExploration.tsx` 11920) |
| Summoner | `0.12 + playerLevel * 0.02` (`WorldExploration.tsx` 11932–11934) |
| Boss combat | static `baseStats` (sample 350 HP), level `player+5` |
| Doka | frontend jackpot table (`WorldExploration.tsx` 12388–12408), then clamp to 100_000 per `applyRewards` call |
| Enemy CHC | `Math.random() * 100 < (enemy.chc ?? 2)` (`WorldExploration.tsx` 16470–16472) |

Monte Carlo: 4000 rolls per level, default tier config, no `localStorage` override.

---

## What moved since 2026-09-22

HEAD did not move (`0f5363f`). Formulas that 09-22 measured did not change. `#357` (INIT / CHC) and `#407` (Crush) are still open; this run **unions** that harness rather than overwriting it.

| Prior ID | Drift |
| :--- | :--- |
| LHIPS-2026-08-31-005 | Victory floor is still `50 + level*10` on this HEAD (150 > 145 at 10). Queued `#386` caps it at `scaledMaxHpForLevel`. Not re-filed as closed. Exact exponential-HP JSON-null is **14500**. |
| LHIPS-2026-09-21-001 / 002 | Still NEW. Queued `#357`. Re-sim: P(player first) 0.164 at 1, 0.168 at 10, 0.046 at 15, 0.013 at 25, 0.002 at 48, 0 from 250. CHC breakpoints unchanged (bishop 115, king 138). A 1/4000 sample at player 10000 is the unscaled INIT floor tail, not a reopen. |
| LHIPS-2026-09-22-001 | Still NEW. Queued `#407`. Crush one-shot from enemy **52** at player 1 and **75** at player 10; recv at cap 1020 is 1983. |
| (new measurement) | Lava `8..15` is 15% of HP at 1, under 5% from 42, under 1% from 282, 0.003% at 100000. Player lava/spikes bypass RES. |
| (new measurement) | `maxSpellRange` 5: Poison (base 4) caps at **10**, Frost at **20**, Strike at **40**. Stored range 0 becomes 1 (`spellRangeBase`) then the same Strike curve. |

Unchanged and still NEW: XP wall 001; HUD sat 09-01-001; IEEE 002; enemy 999 cap 003; RES/HP/AI/kits/discovery/summoner/boss/challenge 004–011; jackpot + 100k/500k 09-01-002; leftover Nat / pow2 09-01-004; GameKey 10M 09-02-001; spell `10*2^n` 09-02-002; INIT/CHC 09-21; Crush 09-22; no telemetry 014.

Line numbers in WorldExploration / `main.mo` match 09-22 on this HEAD.

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
| 100 | 6.34e31 | MAX_SAFE | ~5,760 | ~1.1e28 |
| 250 | 9.05e76 | MAX_SAFE | ~14,760 | ~6.1e72 |
| 500 | 1.64e152 | MAX_SAFE | ~29,700 | ~5.5e147 |
| 1000 | 5.36e302 | MAX_SAFE | ~59,520 | ~9.0e297 |
| 1018 | 1.40e308 | MAX_SAFE | ~59,580 | ~2.4e303 |
| 1019 | **Infinity** (IEEE) | MAX_SAFE | ~59,580 | never |
| 2500 | Infinity | MAX_SAFE | ~59,580 | never |
| 10000 | Infinity | MAX_SAFE | ~59,580 | never |
| 50000 | Infinity | MAX_SAFE | ~59,580 | never |
| 100000 | Infinity | MAX_SAFE | ~59,580 | never |

`applyXpDelta(0, 48, 1)` and `applyXpDelta(0, 1018, 1)` stay at that level. Official income cannot fund 25+ in a realistic session count. `saveBattleStats` cannot skip or demote the curve.

**LHIPS-2026-08-31-001 (still).** **LHIPS-2026-09-01-001 (still).**

---

## Enemy generation

Default weights: 60% same tier, 20% ±1, 10% ±2, leftover 10% ±3..6. `threeOrMorePercent: 5` is **not read**. Extra ±1 tier variance at 15% per side. Adjacent / ±2 do not clamp `maxTier`; ±3..6 do.

| Player | Mean enemy | Min | Max | P(below tier) | P(same) | P(above) |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 10.8 | 1 | **80** | 0 | 0.72 | 0.28 |
| 10 | 11.2 | 1 | 80 | 0 | 0.70 | 0.30 |
| 25 | 26.8 | 1 | 99 | 0.27 | 0.45 | 0.27 |
| 100 | 95.6 | 27 | 169 | 0.27 | 0.44 | 0.28 |
| 500 | 495.4 | 421 | 569 | 0.27 | 0.45 | 0.28 |
| 1000 | 991.7 | 921 | **1020** | 0.31 | 0.57 | 0.13 |
| 2500 | 993.2 | 931 | 1020 | **1.00** | 0 | 0 |
| 10000 | ~993 | 931 | 1020 | **1.00** | 0 | 0 |
| 50000 | ~993 | 931 | 1020 | **1.00** | 0 | 0 |
| 100000 | ~993 | 931 | 1020 | **1.00** | 0 | 0 |

Dungeon boost is `+ boost * tierSize` (max +30 at depth 5) on top of this window. Live dungeon `maxDepth` is still rolled 3–5. 100k confirms the 999 ceiling does not grow with the player.

**LHIPS-2026-08-31-003 (still).**

---

## Enemy / player stats

| Level | Live player HP | Formula (unused) HP | Victory HP floor | Persist AP | Formula AP |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 100 | 100 | 60 | 8 | 8 |
| 10 | 145 | 155 | **150 (> max)** | 8 | 8 |
| 25 | 220 | 323 | 300 | 9 | 9 |
| 50 | 345 | 1,092 | 550 | 10 | 10 |
| 100 | 595 | 12,524 | 1,050 | 12 | 12 |
| 325 | 1,720 | 7.33e8 | 3,300 | **20** | **21** |
| 500 | 2,595 | 3.75e12 | 5,050 | 20 | 28 |
| 1000 | 5,095 | 1.47e23 | 10,050 | 20 | 48 |
| 10000 | 50,095 | overflow-scale | 100,050 | 20 | 408 |
| 14500 | — | **JSON-null** | — | 20 | 588 |
| 100000 | 500,095 | JSON-null | 1,000,050 | 20 | 4008 |

First level a **max** RES roll can reach 100 (full reduction, then chip-1): rook 78, knight 84, king 107, pawn 126, queen 143, bishop 154. SR: rook 79, king 96.

First level a **max** CHC roll can reach 100 (always crit): bishop 115, queen 120, king 138, pawn 163, knight 174, rook 199.

`calcScaledDamage` still ignores caster level (`combatMath.ts` 130–137) — player offense grows only with spell upgrades (+3%/level). Family 30% is still overwritten at battle start (WX 11873–11902).

**LHIPS-2026-08-31-004, 005 (still).** **LHIPS-2026-09-21-002 (CHC, still).** `#386` would close the victory-floor half of 005; exponential vs linear HP remains.

---

## Flat hazards / DoT (new measurement)

Player lava and spikes write `hp: max(0, prev.hp - raw)` (`WorldExploration.tsx` 11428–11482). They never enter `playerTakesDamage`, so create RES 10 is skipped. Enemy landing uses the same 8–15 / 5–10 bands (`16878`, `16930`).

| Player | HP | Lava max 15 / HP | Spike max 10 / HP |
| ---: | ---: | ---: | ---: |
| 1 | 100 | **15%** | 10% |
| 10 | 145 | 10% | 7% |
| 25 | 220 | 6.8% | 4.5% |
| **42** | 305 | **under 5%** | 3.3% |
| 100 | 595 | 2.5% | 1.7% |
| **282** | 1,505 | **under 1%** | 0.7% |
| 1000 | 5,095 | 0.29% | 0.20% |
| 100000 | 500,095 | 0.003% | 0.002% |

Lava then applies Burning 3/turn for 3 turns. Poison Arrow is a flat 4/tick. Both are the same unscaled class: a rounding error next to linear HP and next to Crush recv 1983 at the spawn cap (09-22-001). Challenge lava/spike recording still fires; the tax no longer moves HP.

**LHIPS-2026-09-23-001.**

---

## Spell range cap (new measurement)

`getEffectiveSpellRange` is `min(base + floor(level / 10), 5)`. `spellRangeBase` lifts stored `range: 0` to **1** before that (`targeting.ts` 111–115), so Heal / Mirror / Timestep follow the Strike curve.

| Base range | Example | Hits cap 5 at |
| ---: | :--- | ---: |
| 4 | Poison Arrow | **10** |
| 3 | Frost Bolt | **20** |
| 2 | Life Drain | 30 |
| 1 / 0 | Strike / self | **40** |

From level 40 every starter is range 5 on a 17×17 map. Enemy AI still uses raw `Number(spell.range)` (`enemySpellRange`) so kits stay short while the player kit homogenizes. Official XP wall (001) still arrives first.

**LHIPS-2026-09-23-002.**

---

## Fallback melee (queued 09-22, re-sim)

| Player | HP | Crush one-shot from enemy | This run max enemy | One-shot at max? |
| ---: | ---: | ---: | ---: | :--- |
| 1 | 100 | **52** | 80 | **yes** (recv 156) |
| 10 | 145 | **75** | 80 | **yes** (recv 156) |
| 15 | 170 | 88 | 90 | yes at this run’s max |
| 25 | 220 | 113 | 99 | no |
| 1000 | 5,095 | never (cap 1020 recv 1983) | 1020 | no |

**LHIPS-2026-09-22-001 (still, `#407`).**

---

## Initiative (queued 09-21, re-sim)

| Player | P(player first) |
| ---: | ---: |
| 1 | 0.164 |
| 10 | 0.168 |
| 15 | 0.046 |
| 25 | 0.013 |
| 48 | 0.002 |
| 250+ | **0** |

**LHIPS-2026-09-21-001 (still, `#357`).**

---

## AI

| Enemy level | Mean tier | P(tier 10 / betrayal gate) | P(tier ≥ 5 / erratic gate) |
| ---: | ---: | ---: | ---: |
| 1 | 2.4 | 0.033 | 0.181 |
| 10 | 2.3 | 0.026 | 0.173 |
| 101 | 5.2 | 0.029 | 0.886 |
| 901 | 8.7 | 0.739 | 0.882 |
| 1000 | 8.7 | 0.732 | 0.879 |

Gates: erratic `aiTier >= 5`; betrayal `>= 10` and 5%. `instantKill` (gate 9) is unused. Summoner chance = 100% at player 44. Extra combatants + AI work stay saturated from 44 through 100000.

**LHIPS-2026-08-31-006, 009 (still).**

---

## Spell pools and discovery

Passing the live `LevelZone` object into `buildEnemyKit` (`WorldExploration.tsx` 11920) still yields the zone-0 kit at every player level. `setCurrentZoneTier(playerTier + 1)` at 4680 is a numeric zone and is **not** the kit argument.

| Piece | Live call (object) | Numeric zone 2 (intended late) |
| :--- | :--- | :--- |
| pawn | Strike | Strike + Venom |
| rook | Strike | Strike + Iron Skin |
| knight | Strike | Strike |
| bishop | Frost | Frost + Poison |
| queen | Frost | **Inferno + Heal** |
| king | Frost | **Inferno + Rally** |

All 32 frontend spells are `starterSpells` and are `baseSpells` at create (`WorldExploration.tsx` 2396–2408). `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–719) only hides **retired** catalog rows. No rarity, no duplicate-discovery path. Combined with 002, the player kit is owned on create and then loses range identity by 40.

**LHIPS-2026-08-31-007, 008 (still).**

---

## Rewards / economy

- Kill Doka = `enemy.level * multiplier`. The `roll < 0.0001` band is still 0.01% (comment still says 0.0001%) × `1..1e9` (`WorldExploration.tsx` 12388–12408).
- Persist still clamps the **whole `applyRewards` call** to 100_000 Doka / 500_000 XP.
- A jackpot hit at any simulated enemy level persists **exactly 100_000**.
- Stacked official XP (`3 * L * 20 * 6 * 1.5` Enthroned Void + XP boost) exceeds 500_000 from enemy **926**.
- Dungeon pack XP clamp first hits at enemy **1924**, which is past the spawn cap (~1020), so dungeon packs stay under 500k XP.
- Challenge XP is still flat 400–1000 and cannot move the exponential wall.
- `redeemGameKey` adds up to 10_000_000 Doka without going through `applyRewards`.
- `upgradeSpell` cost `10 * 2^n` exceeds one combat jackpot at **spell level 14** and a max GameKey at **spell level 20**. Frontend `Number` of that cost is inexact from spell level 50.

**LHIPS-2026-09-01-002 (still).** **LHIPS-2026-09-02-001, 002 (still).**

---

## Bosses / dungeons

Combat boss HP stays 350 (Pale Archbishop sample) at every player level including 100000. Guide `1.08^5` shows 514. Solvable at all simulated levels as a time sink, not as a scaled threat, once player HP grows and enemy kits stay in band 0. Dungeon extra-enemy / tier-boost / Doka-multiplier tables stop at depth 5 (`spawnPolicy.ts` `DUNGEON_SPAWN_DEPTH_CAP`). Live chain length is rolled 3–5. Highest catalog boss XP multiplier is 6 (`bossDefaults.ts` 755). Challenge under-30 / under-50 damage still fails on a single placeholder hit at 14 / 24.

**LHIPS-2026-08-31-010, 011 (still).**

---

## Technical limits

| Limit | What happens now |
| :--- | :--- |
| HUD `xpForNextLevel` | Saturates at `MAX_SAFE_INTEGER` from level 48 |
| Exact `100 * 2^(N-1)` as Number | Infinity at N=1019 (also 2500 / 10000 / 50000 / 100000) |
| Unused exponential HP as Number | JSON-null / Inf from **14500** |
| `Number(ok.newXp)` | Precision loss above 2^53 (`applyRewardsResult.ts` 28–31) |
| Motoko `pow2` | `O(level)` multiplies on every `applyRewards` (`main.mo` 2129) |
| `saveBattleStats.level` | Frozen to stored value |
| `saveBattleStats` AP/MP | Formula then 20; battle AP unbounded (21 at 325) |
| `saveBattleStats` INIT | Frozen at create 10 |
| Spell fail | 0 at 201 |
| Spell range | Cap 5 from **10** (base 4) / **40** (base 1) |
| Spell upgrade cost | `10 * 2^n` Nat; Number-inexact at spell 50+ |
| GameKey / admin grant | 10M Nat, bypasses 100k combat ceiling |
| Fallback Crush | Number-safe at the spawn cap; would be 240000 raw at a hypothetical enemy 100000 that cannot spawn |
| Lava / spikes | Always 8–15 / 5–10 Integer; no overflow; no RES |
| Enemy id | `enemy-${i}-${currentTime}` — not a level issue |
| UI leftover bar | `leftover / hudNeed`; at 48+ the denominator is 9.01e15 while persist need is 1.41e16 |

**LHIPS-2026-09-01-001, 003, 004 (still).** **LHIPS-2026-09-02-001, 002 (still).** **LHIPS-2026-09-21-001 (still).** **LHIPS-2026-09-22-001 (still).** **LHIPS-2026-09-23-001, 002.**

---

## Telemetry / calibration

No series to compare XP rate, relative-level mix, battle length, death rate, discovery, advanced-AI, elite, or wallet growth. Combat elite flags do not exist (`elite_patrol` is a world-feature design row only). Family 30% is cosmetic after battle-start overwrite. Open TBC PRs do not add collectors.

**LHIPS-2026-08-31-014 (still).**

---

## What this run did not do

- No change to RAF, map generation, turn logic, or damage math.
- No curve / spawn / kit / jackpot / GameKey / hazard / range retune.
- No claim that current live players are at any of these levels.
- No reopen of unchanged 2026-08-31, 2026-09-01, 2026-09-02, 2026-09-21, or 2026-09-22 IDs.
- No merge of queued `#357`, `#386`, or `#407`.
