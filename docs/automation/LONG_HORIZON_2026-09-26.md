# Long-Horizon Infinite Progression — 2026-09-26

Stralt has no character level cap in data or persist. This run re-simulated the **live formulas** at HEAD `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` inspected). Players are **not** assumed to reach these levels quickly. The mid-teens already exhaust intended XP income. Observed max level (unknown here) is not a cap.

Stress levels: 1, 10, 15, 25, 48, 50, 78, 100, 250, 325, 500, 1000, 2500, 5000, 1018, 1019, **10000, 50000, 100000**.

**Telemetry:** none. No encounter / duration / death / discovery series. `#333` / `#395` / `#462` / `#502` / `#504` / `#527` / `#609` are still WAITING_FOR_TELEMETRY. Calibration is skipped. Real play would only check the synthetic model, not stop the horizon.

**This run does not redesign progression.** Findings are ACTION_IDs only. Prior `LHIPS-2026-08-31-001..014`, `09-01-001..004`, `09-02-001..002`, queued `09-21-001..002` (`#357`), queued `09-22-001` (`#407`), queued `09-23-001..002` (`#475`), queued `09-24-001..002` (`#530`), and queued `09-25-001..002` (`#560`) stay NEW unless a formula moved. This file adds IDs only for live slopes the earlier harness never filed (flat kit spells vs Crush `L/5`; out-of-battle +1 HP / 10s vs linear maxHp).

Harness: `src/frontend/src/utils/longHorizonSim.ts`  
Ledger: [`ACTION_IDS_LHIPS_2026-09-26.md`](./ACTION_IDS_LHIPS_2026-09-26.md)  
Stack: restacked onto `#560` (`#357` + `#407` + `#475` + `#530` ancestors). One export per helper — do not concatenate sibling copies.

---

## Method

Authoritative sources (not comments, not `backend_extended`):

| Topic | Live formula (2026-09-26) |
| :--- | :--- |
| XP threshold (persist) | `100n * (1n << (N-1))` — `xpCurve.ts` 24–26; Motoko twin `main.mo` 2126–2133 |
| XP threshold (HUD / recap) | same, but `xpForNextLevel` saturates at `Number.MAX_SAFE_INTEGER` from **level 48** (`xpCurve.ts` 32–36) |
| Kill XP | `sum(enemy.level * 20)` — `rewardResolver.ts` 89–101 |
| Portal XP | 10 |
| `applyRewards` ceilings | `dokaDelta > 100_000` / `xpDelta > 500_000` → `#err` (`main.mo` 2119–2120) |
| `saveBattleStats` | cannot raise **or lower** level; cannot raise atk/res/**init**; AP/MP cap 20 |
| GameKey | `redeemGameKey` up to `MAX_DOKA_GRANT` 10_000_000 |
| Death | 20% leftover XP / **40% Doka** |
| Spell upgrade | `10 * 2^n` |
| Enemy level | `pickEnemyLevelFromTiers`, `maxTier = floor(999 / tierSize)` |
| Enemy combat HP | `floor(50 * (1 + (L-1)*0.05))` (`WorldExploration.tsx` 3607–3612) |
| Player live max HP | `floor(100 * (1 + (L-1)*0.05))` (`WorldExploration.tsx` 3400–3406) |
| Kit cast | `calcScaledDamage(catalogDamage, enemy.level, 0)` — **ignores caster level** (`combatMath.ts` 130–137; WX 16464–16468) |
| Strike / Frost / Inferno | catalog 10 / 20 / **0** (`spellData.ts`); Poison / Venom also 0 |
| AI damage pick | `Number(s.damage) > 0` (`enemyAI.ts` 555–572) — Inferno / Poison / Venom never chosen |
| Fallback melee | Crush 12 / Fire Bolt 8 × `max(1, L/5)` × enrage 6 (`WorldExploration.tsx` 16710–16720) |
| Out-of-battle regen | `+1` HP every **10_000 ms** while not in battle (`WorldExploration.tsx` 3618–3625) |
| Kits | `buildEnemyKit(piece, currentMap.levelZone)` — object, not number (`WorldExploration.tsx` 11920) |
| Family 30% | `applyFamilyVariantsToRoster` then battle-start `calcEnemyMaxHp` overwrite (`11970–11998`) |
| AI tier | level table + 30% uniform 1–10 |
| Boss combat | static `baseStats` (~350 HP) |

Monte Carlo: 4000 rolls per level, default tier config, no `localStorage` override.

---

## What moved since 2026-09-25

HEAD did not move (`0f5363f`). Formulas that 09-25 measured did not change. `#357` / `#407` / `#475` / `#530` / `#560` are still open; this run **unions** that harness rather than overwriting it.

| Prior ID | Drift |
| :--- | :--- |
| LHIPS-2026-09-22-001 | Unenraged Crush still one-shots from 52 / 75; cap recv still 1983. **Not closed.** This run measures the **kit** path those IDs treated as flavor. |
| LHIPS-2026-08-31-007 | Live call still passes a `LevelZone` object. Zone-2 Inferno still never assigned. New: even if it were, catalog `damage` is 0 so `pickBestDamageSpell` skips it. |
| LHIPS-2026-09-24-001 | Blood Mend 12 still under 5% from 30. This run files the **out-of-battle** +1/10s clock that 09-24 listed in the harness but did not ID. |
| (new measurement) | Crush raw exceeds Frost 20 from enemy **9** (22 vs 20). At spawn cap 1020, Crush/Frost = **122.4×** (2448 vs 20); Crush/Strike = **244.8×**. Kit Strike 10 is below Crush’s floor of 12 at **every** enemy level. |
| (new measurement) | Passive regen to full from 0: 1000 s at 1, 1450 s at 10, 5950 s at 100, **50950 s (~14.2 h)** at 1000, **5000950 s (~58 d)** at 100000. |

Unchanged and still NEW: XP wall 001; HUD sat 09-01-001; IEEE 002; enemy 999 cap 003; RES/HP/AI/kits/discovery/summoner/boss/challenge 004–011; jackpot + 100k/500k 09-01-002; leftover Nat / pow2 09-01-004; GameKey 10M 09-02-001; spell `10*2^n` 09-02-002; INIT/CHC 09-21; Crush 09-22; lava/range 09-23; Blood Mend/fail 09-24; enrage/Shield-potion 09-25; no telemetry 014.

Line numbers in WorldExploration / `main.mo` match 09-25 on this HEAD.

---

## XP and practical rate

| Level | Exact XP to next | HUD `xpForNextLevel` | Typical 3-kill XP | Fights to next |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 100 | 100 | ~660 | 0.15 (mean enemy ~11) |
| 10 | 51,200 | 51,200 | ~660 | ~78 |
| 15 | 1.64e6 | 1.64e6 | ~1,080 | ~1.5e3 |
| 25 | 1.678e9 | 1.678e9 | ~1,620 | ~1.0e6 |
| 48 | 1.407e16 | **MAX_SAFE 9.01e15** | ~2,760 | ~5.1e12 |
| 100 | 6.34e31 | MAX_SAFE | ~5,700 | ~1.1e28 |
| 1000 | 5.36e302 | MAX_SAFE | ~59,500 | ~9.0e297 |
| 1019 | **Infinity** (IEEE) | MAX_SAFE | ~59,580 | never |
| 100000 | Infinity | MAX_SAFE | ~59,580 | never |

`applyXpDelta(0, 48, 1)` and `applyXpDelta(0, 1018, 1)` stay at that level. Official income cannot fund 25+ in a realistic session count.

**LHIPS-2026-08-31-001 (still).** **LHIPS-2026-09-01-001 (still).**

---

## Enemy generation

Default weights: 60% same tier, 20% ±1, 10% ±2, leftover ±3..6. `threeOrMorePercent: 5` is **not read**.

| Player | Mean enemy | Min | Max | P(below tier) | P(same) | P(above) |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 10.8 | 1 | **74–80** | 0 | ~0.72 | ~0.28 |
| 25 | 26.9 | 1 | 100 | 0.28 | 0.46 | 0.26 |
| 100 | 95.4 | ~22 | 168 | 0.28 | 0.46 | 0.26 |
| 1000 | 991.6 | ~921 | **1020** | 0.29 | 0.57 | 0.14 |
| 2500 | 993.3 | ~931 | 1020 | **1.00** | 0 | 0 |
| 100000 | 993.5 | ~931 | 1020 | **1.00** | 0 | 0 |

Family 30% (`spawnPolicy.ts` `FAMILY_VARIANT_CHANCE`) still writes iron_golem 2.5× HP, then battle start replaces HP with `calcEnemyMaxHp` (`WorldExploration.tsx` 11970–11998). Diversity does not grow with the player.

**LHIPS-2026-08-31-003 (still).**

---

## Enemy / player stats

Live player HP is linear; unused exponential `getPlayerBaseStats` HP is JSON-null from **14500**. Victory floor `50+10L` still exceeds maxHp at 10 (`#386` queued, not merged). Rook max RES 100 at 78. Bishop max CHC 100 at 115.

**LHIPS-2026-08-31-004, 005 (still).** **LHIPS-2026-09-21-001, 002 (still).**

---

## AI

| Enemy level | Mean tier | P(tier 10 / betrayal) | P(tier ≥ 5 / erratic) |
| ---: | ---: | ---: | ---: |
| 1 | ~2.3 | 0.030 | 0.18 |
| 101 | ~5.2 | 0.030 | 0.88 |
| 901 | 8.6 | 0.725 | 0.880 |

Advanced AI saturates and **prefers kits** (`pickBestDamageSpell`, `kind: "cast"`). Kits are the weaker weapon past enemy 9 (see Spell pools). Summoner 100% at player 44.

**LHIPS-2026-08-31-006, 009 (still).**

---

## Spell pools and discovery

Passing the live `LevelZone` object into `buildEnemyKit` still yields the zone-0 kit at every player level.

| Piece | Live call (object) | Numeric zone 2 (intended late) |
| :--- | :--- | :--- |
| pawn | Strike | Strike + Venom (`damage: 0` — skipped) |
| knight | Strike | Strike |
| bishop | Frost | Frost + Poison (`damage: 0` — skipped) |
| queen | Frost | **Inferno (`damage: 0`) + Heal** |
| king | Frost | **Inferno + Rally** |

Kit Strike is **10** at every enemy level (`calcScaledDamage` ignores `_casterLevel`). Kit Frost is **20**. Fallback Crush is `12 * max(1, L/5)`: 12 at 1–5, **22 at 9**, 192 at 80, **2448 at 1020**. Crush/Frost = 1.1× at 9, 9.6× at 80, **122.4× at 1020**. Strike is below Crush’s floor of 12 at enemy **1**. CHC 100 (09-21-002) can double Frost to 40 — still 61× below cap Crush.

`pickBestDamageSpell` requires `Number(s.damage) > 0`, so Inferno / Poison / Venom are never the chosen damage spell. Smarter AI therefore casts Frost 20 or Strike 10 instead of Crush 2448.

All 32 starters are owned at create. No rarity, no duplicate-discovery path.

**LHIPS-2026-08-31-007, 008 (still).** **LHIPS-2026-09-26-001 (new).**

---

## Spell discovery

Pacing is “everything at create.” Undiscovered content is exhausted at character birth. Rare-spell rates are undefined (no rarity field). Duplicate discovery has no path (`shouldIncludeBackendSpellInLibrary` only hides retired ids).

**LHIPS-2026-08-31-008 (still).**

---

## Rewards / economy

Jackpot hit still persists **exactly 100_000**. Void+boost XP clamp from enemy **926**. GameKey 10M bypasses that ceiling. `upgradeSpell` `10*2^n` outruns combat Doka at 14. Dungeon Doka multiplier saturates at ×4 (depth 5). Completion bonus is `maxDepth * 50` (250 at depth 5). Challenge XP 400–1000 cannot move the exponential wall. Death cuts 40% of a max GameKey (4_000_000).

**LHIPS-2026-09-01-002 (still).** **LHIPS-2026-09-02-001, 002 (still).** **LHIPS-2026-09-25-002 (still).**

---

## Bosses / dungeons

Combat boss HP stays ~350 at player 100000. Guide `1.08^5` is UI-only. Dungeon extra-enemy / tier-boost tables stop at depth 5 (pack 1–8+5, boost +3 tiers). Solvable as a time sink once linear player HP outgrows static boss HP.

**LHIPS-2026-08-31-010, 011 (still).**

---

## Out-of-battle regen

| Level | Linear maxHp | Seconds to full from 0 (+1 / 10s) |
| ---: | ---: | ---: |
| 1 | 100 | 1,000 (17 min) |
| 10 | 145 | 1,450 (24 min) |
| 100 | 595 | 5,950 (99 min) |
| 1000 | 5,095 | **50,950 (~14.2 h)** |
| 100000 | 500,095 | **5,000,950 (~58 d)** |

Shop potions still restore 30/70% of `maxHp` (cost 50/120, 09-25-002). Blood Mend is still 12 (09-24-001). The idle clock is the only heal that is both flat **and** gated on wall-clock time.

**LHIPS-2026-09-26-002 (new).**

---

## Technical limits

| Limit | What happens now |
| :--- | :--- |
| HUD `xpForNextLevel` | Saturates at `MAX_SAFE_INTEGER` from level 48 |
| Exact `100 * 2^(N-1)` as Number | Infinity at N=1019 (also 2500 / 10000 / 100000) |
| `Number(ok.newXp)` | Precision loss above 2^53 |
| Motoko `pow2` | `O(level)` multiplies on every `applyRewards` |
| `saveBattleStats` AP/MP | Silent cap 20; formula AP 21 at 325 |
| Kit `calcScaledDamage` | Floor 1; catalog 0 becomes 1 **if** it were called — live picker never calls it |
| Enemy id | `enemy-${i}-${currentTime}` — not a level issue |
| Regen interval | `setInterval` 10s; at 100000 that is 500095 ticks to full |

**LHIPS-2026-09-01-001, 003, 004 (still).**

---

## Telemetry / calibration

No series to compare XP rate, relative-level mix, battle length, death rate, discovery, advanced-AI, elite, or wallet growth. Combat elite flags do not exist. `#609` (2026-09-26) is still WAITING_FOR_TELEMETRY. Observed max player level is not a cap and is not used as the simulation horizon.

**LHIPS-2026-08-31-014 (still).**

---

## What this run did not do

- No change to RAF, map generation, turn logic, or damage math.
- No curve / spawn / kit / jackpot / GameKey / Crush / regen retune.
- No claim that current live players are at any of these levels.
- No reopen of unchanged 2026-08-31 through 2026-09-25 IDs.
