# ACTION_IDs — 2026-09-22 Long-Horizon Infinite Progression Simulator

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Long-Horizon Infinite Progression Simulator.  
Narrative: [`LONG_HORIZON_2026-09-22.md`](./LONG_HORIZON_2026-09-22.md).  
Harness: `src/frontend/src/utils/longHorizonSim.ts`.

Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **observation only** — no curve redesign.

HEAD inspected: `0f5363f` (same as queued `#357` / 2026-09-21). Stress includes 10000 / 50000 / 100000.

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
| `AQA-2026-08-30-012` | NEW | Collectors still missing. |

This file adds IDs only where a long-horizon failure was in-scope and never filed (live fallback Crush one-shot vs over-level packs, then the same slope is trivial after the 999 cap).

---

ACTION_ID: LHIPS-2026-09-22-001  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Fallback Crush 12×max(1, L/5) one-shots over-level packs at 1–10, then cannot threaten 999-capped packs after ~378  
CATEGORY: enemy-stats  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live fallback melee (`src/frontend/src/components/WorldExploration.tsx` 16710–16728) is not the spawn placeholder `L*2+3` (011). It picks Crush 12 or Fire Bolt 8 and sets `raw = round(pool * max(1, enemy.level / 5))`, then `round(raw * (1 - playerRes/100))`, then `playerTakesDamage` applies RES again (`3424–3432`). Create RES is 10 (`startingChampionStats.ts` 13) and `saveBattleStats` cannot raise it (`main.mo` 2064–2066). Harness `firstEnemyLevelFallbackCrushOneShots`: player 1 one-shot from enemy **52** (recv  after two 10% cuts); player 10 from enemy **75**. `pickEnemyLevelFromTiers` at player 1 already rolls max **80** (pAbove ~0.28, LHIPS-003). Crush at 80: raw 192, recv 156 vs HP 100. At player 10: max enemy 79, recv 154 vs HP 145 — still a one-shot. Kit spells stay flat (`calcScaledDamage` ignores caster level, frost 20) so Crush is the lethal path. Inverse: Crush at the spawn cap 1020 is raw 2448 / recv 1983. Linear player HP exceeds 1983 from level **378**. At 2500 / 10000 / 100000 the player is 100% under-level (003) and Crush recv stays 1983 vs HP 12595 / 50095 / 500095.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: 1 (over-level pack can roll enemy 52+; confirmed max 80). Same-band collapse of the one-shot is gone by ~15 (needs enemy 88; this run’s max was 82). Inverse “cannot threaten” from ~378; guaranteed after 2500. Official XP wall (001) still arrives first for character leveling.  
CAUSE: Fallback melee is a linear `L/5` times a flat 12. Player HP is a different linear. Enemy level is independently capped at `floor(999/tierSize)` with ±2 overflow to 1020. The three were never paired. RES is a frozen 10% applied twice, which delays the one-shot by a few enemy levels but does not change the slope.  
PLAYER_EFFECT: Tutorial / early packs that roll the documented 003 over-level tail can die to one Crush. Past the mid-teens the same swing is no longer a one-shot against same-band HP, then after ~378 (synthetic under official income) even a max-cap Crush is a chip. Combined with zone-0 kits (007) and static boss HP (010), late synthetic fights are time sinks.  
TECHNICAL_EFFECT: No Number overflow at 100000 (Crush raw 12*(100000/5) would be 240000 if such an enemy could spawn; it cannot). Recv at the live cap is 1983. Challenge 011 still uses the unused overworld placeholder `L*2+3`, so the two one-shot formulas disagree.  
SYSTEMS_AFFECTED: WorldExploration fallback melee pool; `playerTakesDamage` RES; `pickEnemyLevelFromTiers`; linear `maxHp`; create RES  
RECOMMENDED_ACTION: Report only. Do not retune Crush, RES, or spawn here. If a human picks this ID, pair the fallback pool with the 999 cap and the linear HP curve — do not raise placeholder `L*2+3` as a substitute, and do not silently drop the double-RES apply.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-003 (over-level tail / 999 cap); LHIPS-2026-08-31-011 (different one-shot formula on challenges); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if Crush/`L/5` is changed without a paired challenge-placeholder and kit-spell pass (frost stays 20). LOW for documentation.  
VALIDATION_REQUIRED: `fallbackCrushRaw(80) === 192`; `firstEnemyLevelFallbackCrushOneShots(1) === 52`; `firstEnemyLevelFallbackCrushOneShots(10) === 75`; player-1 `fallbackCrushOneShotsAtMaxEnemy === true`; Crush recv at 1020 === 1983 < linear HP at 1000 (5095). Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  
