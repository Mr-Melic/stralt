# ACTION_IDs — 2026-09-23 Long-Horizon Infinite Progression Simulator

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Long-Horizon Infinite Progression Simulator.  
Narrative: [`LONG_HORIZON_2026-09-23.md`](./LONG_HORIZON_2026-09-23.md).  
Harness: `src/frontend/src/utils/longHorizonSim.ts`.

Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **observation only** — no curve redesign.

HEAD inspected: `0f5363f` (same as queued `#357` / `#407`). Stress includes 10000 / 50000 / 100000. Harness **unions** `#357` (INIT / CHC) and `#407` (Crush) rather than overwriting those files.

## Still-open IDs (not re-filed)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| `LHIPS-2026-08-31-001` | NEW | Exponential XP vs linear kill XP. Practical wall ~15–22. |
| `LHIPS-2026-08-31-002` | NEW | IEEE Infinity of the raw float at 1019. HUD path superseded by 09-01-001. |
| `LHIPS-2026-08-31-003` | NEW | Enemy `maxTier = floor(999/tierSize)`. Player 2500+ is 100% under-level. Confirmed at 10000 / 50000 / 100000. |
| `LHIPS-2026-08-31-004` | NEW | RES/SR hit 100; player SP does not scale. Rook RES 100 at 78. |
| `LHIPS-2026-08-31-005` | NEW | Three HP formulas; victory floor exceeds maxHp at 10 on this HEAD. Queued `#386` caps the floor; not merged. Unused exponential HP is JSON-null from **14500**. |
| `LHIPS-2026-08-31-006` | NEW | 30% uniform AI 1–10; saturates ~901. |
| `LHIPS-2026-08-31-007` | NEW | `buildEnemyKit(currentMap.levelZone)` still passes an object. `setCurrentZoneTier` at WX 4680 is unused by kits. |
| `LHIPS-2026-08-31-008` | NEW | All 32 starters owned at create. `shouldIncludeBackendSpellInLibrary` only hides retired ids. |
| `LHIPS-2026-08-31-009` | NEW | Summoner 100% at player 44. |
| `LHIPS-2026-08-31-010` | NEW | Boss combat HP static (~350). Guide `1.08^diff` not applied. |
| `LHIPS-2026-08-31-011` | NEW | Challenge under-30 / under-50 fail on one hit at 14 / 24 (spawn placeholder `L*2+3`). |
| `LHIPS-2026-08-31-012` | NEW | Jackpot table unchanged. Persist 100k-capped. |
| `LHIPS-2026-08-31-013` | NEW | Level-skip claim closed (level is frozen on `saveBattleStats`). AP/MP remainder is 09-01-003. |
| `LHIPS-2026-08-31-014` | NEW | No player telemetry. |
| `LHIPS-2026-09-01-001` | NEW | HUD saturates at MAX_SAFE from 48. |
| `LHIPS-2026-09-01-002` | NEW | applyRewards 100k/500k vs jackpot and Void+boost XP. Dungeon-pack XP clamp is enemy 1924 (past spawn cap). |
| `LHIPS-2026-09-01-003` | NEW | Formula AP 21 at 325 vs persist 20. Persist is formula-aware until 20 (`persistApWriteCap`); battle still uses unbounded `getPlayerBaseStats`. |
| `LHIPS-2026-09-01-004` | NEW | Leftover Nat / Motoko pow2 / Number leftover. |
| `LHIPS-2026-09-02-001` | NEW | GameKey redeem up to 10M Doka outside applyRewards 100k. |
| `LHIPS-2026-09-02-002` | NEW | `upgradeSpell` `10*2^n` outruns combat Doka at 14, GameKey at 20, Number at 50. |
| `LHIPS-2026-09-21-001` | NEW | Frozen create INIT 10 vs scaling enemy INIT. Queued `#357`; not re-filed. |
| `LHIPS-2026-09-21-002` | NEW | Enemy CHC saturates at 100 from bishop 115. Queued `#357`; not re-filed. |
| `LHIPS-2026-09-22-001` | NEW | Fallback Crush one-shots over-level packs at 1–10, then cannot threaten 999-capped packs after ~378. Queued `#407`; not re-filed. |
| `AQA-2026-08-30-012` | NEW | Collectors still missing. |

This file adds IDs only where a long-horizon failure was in-scope and never filed (flat hazard/DoT vs linear HP; `maxSpellRange` 5 homogenizes starter ranges by 40).

---

ACTION_ID: LHIPS-2026-09-23-001  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Flat lava 8–15 / spikes 5–10 / poison 4 ignore linear HP and bypass RES  
CATEGORY: enemy-stats  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Player lava is `8 + floor(rng * 8)` then a direct `hp: max(0, prev.hp - rawDmg)` write (`src/frontend/src/components/WorldExploration.tsx` 11428–11432). It does not call `playerTakesDamage` (3424–3432), so create RES 10 (`startingChampionStats.ts` 13) is skipped. Lava also applies Burning `dotDamagePerTurn: 3` for 3 turns (11444–11452). Spikes are `5 + floor(rng * 6)` with the same direct subtract (11469–11472). Enemy landing uses the same bands (`16878`, `16930`) through `enemyHpAfterHazardDamage`. Poison Arrow is a catalog flat 4/tick (`spellData.ts` 61–62). Live player HP is `floor(100 * (1 + (L-1)*0.05))` (WX 3400–3406). Harness: `firstLevelHazardMaxBelowHpPercent(15, 0.05) === 42`; `(15, 0.01) === 282`. Lava max / HP = 0.15 at 1, 0.025 at 100, 0.0029 at 1000, 0.00003 at 100000. Crush at the spawn cap still deals 1983 after two RES cuts (09-22-001); lava never scales into that band. Challenge lava/spike recorders still fire (`recordInBattleChallengeDamage`) so Untouchable can fail on a 15-HP chip that no longer threatens the pool.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: 42 (lava max drops under 5% of linear HP). Under 1% from 282. Official XP wall (001) still arrives first for character leveling; this is a combat-tax collapse on the same linear HP 09-22 Crush already used.  
CAUSE: Hazard and several DoT numbers are unscaled integers. Player HP is a different linear. RES is applied only on the `playerTakesDamage` path, which lava/spikes skip. The three were never paired.  
PLAYER_EFFECT: Early lava is a real 8–15% chunk that ignores the 10% RES shield path. From the 40s it is a chip; from the 200s it is HUD noise. Late synthetic fights (already Crush-trivial after ~378, kits stuck in zone 0) have no remaining environmental pressure. Burning 3/turn and Poison 4/tick follow the same collapse.  
TECHNICAL_EFFECT: No Number overflow (max 15). Direct HP writes skip shield absorb as well as RES. Enemy lava can still kill a wounded unit; it cannot threaten full linear HP past the mid-game.  
SYSTEMS_AFFECTED: WorldExploration lava/spike step; Burning DoT; Poison Arrow; `playerTakesDamage` (not on this path); linear `maxHp`; challenge lava/spike recorders  
RECOMMENDED_ACTION: Report only. Do not retune lava, spikes, or HP here. If a human picks this ID, pair hazard/DoT with the linear HP curve — or route player lava through `playerTakesDamage` so RES/shield apply — and do not raise Crush/`L/5` as a substitute.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-09-22-001 (Crush vs the same linear HP); LHIPS-2026-08-31-005 (HP formula split); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if lava is scaled without a paired challenge-Untouchable pass (a percent-of-HP lava would fail under-30 / under-50 at every level). LOW for documentation.  
VALIDATION_REQUIRED: lava band 8–15; spikes 5–10; `firstLevelHazardMaxBelowHpPercent(15, 0.05) === 42`; `=== 282` at 1%; player lava does not call `playerTakesDamage`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-09-23-002  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: maxSpellRange 5 homogenizes every starter range by level 40  
CATEGORY: spells  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `getEffectiveSpellRange` (`src/frontend/src/components/WorldExploration.tsx` 3652–3664) is `min(baseRange + floor(level / spellRangeGrowthLevels), maxSpellRange)` with defaults 10 and 5 (`gameTypes.ts` 417–423). Highlight/execution feed `spellRangeBase` (`targeting.ts` 111–115): `spell.maxRange ?? Math.max(1, Number(spell.range))`, so stored range 0 (Heal / Mirror / Timestep, `spellData.ts` 92 / 205 / 223) becomes **1** before the bonus. Harness: `firstLevelSpellRangeHitsCap(4) === 10` (Poison Arrow); `(3) === 20` (Frost); `(1) === 40` (Strike); `(0) === 40`. From 40 every starter is range 5 on the 17-wide map. Enemy AI keeps `enemySpellRange = Number(spell.range)` (`targeting.ts` 133–137) with no level bonus, so zone-0 kits (007) stay range-1 Strike / range-3 Frost while the player kit is full-board. `calcScaledDamage` still ignores caster level (004). All 32 starters are already owned at create (008), so there is no late-game range identity left to discover.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: 10 (base-4 spells already at cap 5). All starters at cap from **40**. Official XP wall (001) still arrives first; 40 is synthetic under kill income.  
CAUSE: Range growth is `+1 every 10 levels` into a hard cap of 5, and `spellRangeBase` never leaves a 0-range self spell at 0. The cap is smaller than the map, so identity collapses instead of approaching a horizon.  
PLAYER_EFFECT: Poison is already map-wide at 10. Frost joins at 20. Strike / self spells join at 40. Past 40, upgrading a spell no longer changes where it can land — only the +3%/level damage (itself tiny vs RES-100). Combined with 008 there is no undiscovered long-range kit.  
TECHNICAL_EFFECT: No overflow (`min(..., 5)`). Admin can raise `maxSpellRange` up to 20 (`adminSafety.ts` 513–514); the live default is 5. Self spells with `targetType: "self"` may still be caster-gated in targeting — range 5 on those ids is at least a highlight/Attack-Nearest input lie.  
SYSTEMS_AFFECTED: `getEffectiveSpellRange`; `spellRangeBase` / `playerSpellEffectiveRange`; starter `range` fields; enemy `enemySpellRange` (intentionally unbonused)  
RECOMMENDED_ACTION: Report only. Do not raise `maxSpellRange` or change `spellRangeBase` here. If a human wants range identity at any level, pair a per-spell cap or a relative-to-map function with the existing +1/10 growth — and keep enemy AI on a documented policy so 007 kits do not silently inherit the player bonus.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-008 (all starters owned); LHIPS-2026-08-31-007 (enemy kits stuck at zone 0 / raw range); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if `Math.max(1, range)` is removed without a self-spell targeting pass (Heal/Mirror/Timestep currently rely on the lift plus `targetType`). LOW for documentation.  
VALIDATION_REQUIRED: `effectiveSpellRange(4, 10) === 5`; `effectiveSpellRange(1, 40) === 5`; `effectiveSpellRange(0, 1) === 1`; `firstLevelSpellRangeHitsCap(3) === 20`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  
