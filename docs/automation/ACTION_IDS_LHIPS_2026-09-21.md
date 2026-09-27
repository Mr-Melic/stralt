# ACTION_IDs — 2026-09-21 Long-Horizon Infinite Progression Simulator

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Long-Horizon Infinite Progression Simulator.  
Narrative: [`LONG_HORIZON_2026-09-21.md`](./LONG_HORIZON_2026-09-21.md).  
Harness: `src/frontend/src/utils/longHorizonSim.ts`.

Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **observation only** — no curve redesign.

HEAD inspected: `0f5363f` (post-#332). Stress includes 10000 / 50000 / **100000**.

## Still-open IDs (not re-filed)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| `LHIPS-2026-08-31-001` | NEW | Exponential XP vs linear kill XP. Practical wall ~15–22. |
| `LHIPS-2026-08-31-002` | NEW | IEEE Infinity of the raw float at 1019. HUD path superseded by 09-01-001. |
| `LHIPS-2026-08-31-003` | NEW | Enemy `maxTier = floor(999/tierSize)`. Player 2500+ is 100% under-level. Confirmed at 10000 / 50000 / **100000**. |
| `LHIPS-2026-08-31-004` | NEW | RES/SR hit 100; player SP does not scale. Rook RES 100 at 78. |
| `LHIPS-2026-08-31-005` | NEW | Three HP formulas; victory floor exceeds maxHp at 10. Unused exponential HP is JSON-null at 50_000+. |
| `LHIPS-2026-08-31-006` | NEW | 30% uniform AI 1–10; saturates ~901. |
| `LHIPS-2026-08-31-007` | NEW | `buildEnemyKit(currentMap.levelZone)` still passes an object. `setCurrentZoneTier` at WX 4680 is unused by kits. |
| `LHIPS-2026-08-31-008` | NEW | All 32 starters owned at create. `shouldIncludeBackendSpellInLibrary` only hides retired ids. |
| `LHIPS-2026-08-31-009` | NEW | Summoner 100% at player 44. |
| `LHIPS-2026-08-31-010` | NEW | Boss combat HP static (~350). Guide `1.08^diff` not applied. |
| `LHIPS-2026-08-31-011` | NEW | Challenge under-30 / under-50 fail on one hit at 14 / 24. |
| `LHIPS-2026-08-31-012` | NEW | Jackpot table unchanged. Persist 100k-capped. |
| `LHIPS-2026-08-31-013` | NEW | Level-skip claim closed (level is frozen on `saveBattleStats`). AP/MP remainder is 09-01-003. |
| `LHIPS-2026-08-31-014` | NEW | No player telemetry. |
| `LHIPS-2026-09-01-001` | NEW | HUD saturates at MAX_SAFE from 48. |
| `LHIPS-2026-09-01-002` | NEW | applyRewards 100k/500k vs jackpot and Void+boost XP. Dungeon-pack XP clamp is enemy 1924 (past spawn cap). |
| `LHIPS-2026-09-01-003` | NEW | Formula AP 21 at 325 vs persist 20. Persist is now formula-aware until 20 (`persistApWriteCap`); battle still uses unbounded `getPlayerBaseStats`. |
| `LHIPS-2026-09-01-004` | NEW | Leftover Nat / Motoko pow2 / Number leftover. |
| `LHIPS-2026-09-02-001` | NEW | GameKey redeem up to 10M Doka outside applyRewards 100k. |
| `LHIPS-2026-09-02-002` | NEW | `upgradeSpell` `10*2^n` outruns combat Doka at 14, GameKey at 20, Number at 50. |
| `AQA-2026-08-30-012` | NEW | Collectors still missing. |

This file adds IDs only where a long-horizon failure was in-scope and never filed (INIT freeze, CHC saturation).

---

ACTION_ID: LHIPS-2026-09-21-001  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Create-time player INIT is frozen at 10 while enemy INIT scales with level  
CATEGORY: balance  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Champion create writes `init: BigInt(10)` (`src/frontend/src/utils/startingChampionStats.ts` 15). Battle turn order uses that persisted field (`WorldExploration.tsx` 11948) and sorts `b.initiative - a.initiative` (11987–11989). `saveBattleStats` cannot raise INIT: `init = _minNat(initiative, character.stats.init)` (`src/backend/main.mo` 2064–2066). `getPlayerBaseStats` does not produce INIT. Enemy INIT is `roll(3, 6 + level * 1.2, piece.mult)` (`src/frontend/src/engine/progression.ts` 183). 4000-sample 3-enemy packs via `monteCarloPlayerWinsInitiative` (`longHorizonSim.ts` 329–350): P(player strictly first) = 0.171 at player 1, 0.169 at 10, 0.040 at 15, 0.015 at 25, 0.002 at 48, 0 at 100 through 100000. Level-1 packs already roll mean enemy ~11 (max 78; LHIPS-003), so the tutorial band is already skewed. Sample rook at enemy 80: INIT 76 vs player 10. No other persist path mints INIT.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: 10 (same-band mean enemy INIT already exceeds create INIT). Share is already ~17% at 1 because of 003 over-level packs; same-band collapse is clear by 15. Official XP wall (001) still arrives first for character leveling.  
CAUSE: Player INIT is a one-time create field with a min-of-stored persist clamp. Enemy INIT is a linear function of enemy level. The two were never paired.  
PLAYER_EFFECT: From the mid-teens the player almost never wins opening initiative in a 3-pack. At 100+ the measured share is 0. Combined with zone-0 kits (007) and later RES-100 (004), late synthetic fights are enemy-first chip-1 slogs, not scaled contests.  
TECHNICAL_EFFECT: No overflow. Enemy INIT at the spawn cap (~1020) is still a safe Number (~1.2e3). Persist INIT stays 10 forever.  
SYSTEMS_AFFECTED: `startingChampionStats`; `saveBattleStats` init clamp; battle turn-order sort; `getEnemyBaseStats` init roll  
RECOMMENDED_ACTION: Report only. Do not add an INIT curve or change `saveBattleStats` here. If a human wants first-turn share to stay defined at any level, pair a player INIT formula (or relative-to-enemy roll) with the existing enemy `6+level*1.2` roll — do not raise stored INIT through `saveBattleStats` as a silent mint.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-003 (over-level packs at 1); LHIPS-2026-08-31-004 (defense saturation later)  
REGRESSION_RISK: HIGH if persist is allowed to raise INIT from a combat snapshot (the atk/res/init min-of-stored clamp is the anti-mint). LOW for documentation.  
VALIDATION_REQUIRED: Create INIT is 10; `saveBattleStats` with a higher INIT leaves stored 10; `getEnemyBaseStats(80,"rook")` init >> 10; re-run `longHorizonSim.test.ts` (`pPlayerWinsInitiative3` at 25 < 0.15, at 100 < 0.05).  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-09-21-002  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Enemy CHC is a percent that saturates at 100 (always-crit) from bishop 115  
CATEGORY: balance  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Enemy CHC is `roll(1, 3 + level * 0.7, piece.mult)` (`src/frontend/src/engine/progression.ts` 185). Combat treats it as a percent: `Math.random() * 100 < (enemy.chc ?? 2) + enrageBonus` (`WorldExploration.tsx` 16470–16472); a hit doubles damage. `firstLevelChcCanHit100` (`longHorizonSim.ts` 307–312): bishop 115, queen 120, king 138, pawn 163, knight 174, rook 199. Player CHC is create-time 5 (`startingChampionStats.ts` 19) and `saveBattleStats` never writes CHC (the clamp list is atk/res/init only). Crit happens before RES/SR reduction, so once RES also hits 100 (004, rook 78) the doubled hit is still chip-1. The bishop window 115–153 is 100% crit while max RES is still below 100. Spawn cap ~1020 puts every piece’s max CHC far above 100.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: 115 (bishop max CHC 100). After the practical XP wall (001). Synthetic / admin-level only under official income.  
CAUSE: CHC uses the same “linear roll, then compare to 100” shape as RES/SR, but it is an offense percent. There is no cap at 100 and no player CHC growth.  
PLAYER_EFFECT: Past 115, high-roll bishops (then queens, kings, …) always crit. Before RES-100 that is a silent 2× on already-flat `calcScaledDamage` (`combatMath.ts` 130–137, caster level ignored). After RES-100 it does not change the chip-1 floor. Player crit chance stays 5%.  
TECHNICAL_EFFECT: No Number overflow at the spawn cap (max CHC ~700 at enemy 1020). A 100000-level enemy that cannot spawn would roll CHC in the tens of thousands; the compare to 100 still saturates.  
SYSTEMS_AFFECTED: `getEnemyBaseStats` chc roll; enemy crit gate in WorldExploration; player create CHC  
RECOMMENDED_ACTION: Report only. Do not retune CHC or add a player crit curve here. If a human picks this ID, treat CHC like RES: either clamp the percent at 100 with a documented remainder, or stop using a 0–100 compare on an unbounded linear roll.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-004 (RES/SR percent cap); LHIPS-2026-08-31-001 (XP wall makes 115 synthetic)  
REGRESSION_RISK: HIGH if CHC is clamped without updating the enrage +10 path and the player 5% create value. LOW for documentation.  
VALIDATION_REQUIRED: `firstLevelChcCanHit100("bishop") === 115`; `firstLevelChcCanHit100("king") === 138`; `Math.random()*100 < 100` is always true; re-run `longHorizonSim.test.ts`.  
STATUS: NEW  
