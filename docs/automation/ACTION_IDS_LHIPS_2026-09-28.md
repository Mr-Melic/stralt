# ACTION_IDs — 2026-09-28 Long-Horizon Infinite Progression Simulator

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Long-Horizon Infinite Progression Simulator.  
Narrative: [`LONG_HORIZON_2026-09-28.md`](./LONG_HORIZON_2026-09-28.md).  
Harness: `src/frontend/src/utils/longHorizonSim.ts`.

Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **observation only** — no curve redesign.

HEAD inspected: `0f5363f` (same as queued `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670`). Stress includes 10000 / 50000 / 100000. Harness **unions** `#670` (Frost TTK / summon HP / shrine) rather than overwriting those files. This branch restacks onto `#670` so oldest-first merge-tree stays clean.

## Still-open IDs (not re-filed)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| `LHIPS-2026-08-31-001` | NEW | Exponential XP vs linear kill XP. Practical wall ~15–22. |
| `LHIPS-2026-08-31-002` | NEW | IEEE Infinity of the raw float at 1019. HUD path superseded by 09-01-001. |
| `LHIPS-2026-08-31-003` | NEW | Enemy `maxTier = floor(999/tierSize)`. Player 2500+ is 100% under-level. Confirmed at 10000 / 50000 / 100000. Boss Rush bypass is 09-28-001. |
| `LHIPS-2026-08-31-004` | NEW | RES/SR hit 100; player SP does not scale. Rook RES 100 at 78. |
| `LHIPS-2026-08-31-005` | NEW | Three HP formulas; victory floor exceeds maxHp at 10 on this HEAD. Queued `#386` caps the floor; not merged. Unused exponential HP is JSON-null from **14500**. |
| `LHIPS-2026-08-31-006` | NEW | 30% uniform AI 1–10; saturates ~901. Betrayal leak ~3% at level 1. |
| `LHIPS-2026-08-31-007` | NEW | `buildEnemyKit(currentMap.levelZone)` still passes an object. Display-name rush `pieceType` also misses the table (09-28-001). |
| `LHIPS-2026-08-31-008` | NEW | All 32 starters owned at create. `shouldIncludeBackendSpellInLibrary` only hides retired ids. |
| `LHIPS-2026-08-31-009` | NEW | Summoner 100% at player 44. |
| `LHIPS-2026-08-31-010` | NEW | Catalog world-boss combat HP static (~350). Guide `1.08^diff` not applied. Rush HP is linear `player+2` (09-28-001), not this 350. |
| `LHIPS-2026-08-31-011` | NEW | Challenge under-30 / under-50 fail on one hit at 14 / 24 (spawn placeholder `L*2+3`). |
| `LHIPS-2026-08-31-012` | NEW | Jackpot table unchanged. Persist 100k-capped. |
| `LHIPS-2026-08-31-013` | NEW | Level-skip claim closed (level is frozen on `saveBattleStats`). AP/MP remainder is 09-01-003. |
| `LHIPS-2026-08-31-014` | NEW | No player telemetry. |
| `LHIPS-2026-09-01-001` | NEW | HUD saturates at MAX_SAFE from 48. |
| `LHIPS-2026-09-01-002` | NEW | applyRewards 100k/500k vs jackpot and Void+boost XP. Rush two-boss clamp is 09-28-002. |
| `LHIPS-2026-09-01-003` | NEW | Formula AP 21 at 325 vs persist 20. MP vs the 16-grid is 09-28-003. |
| `LHIPS-2026-09-01-004` | NEW | Leftover Nat / Motoko pow2 / Number leftover. |
| `LHIPS-2026-09-02-001` | NEW | GameKey redeem up to 10M Doka outside applyRewards 100k. Death then cuts 40% of the wallet. |
| `LHIPS-2026-09-02-002` | NEW | `upgradeSpell` `10*2^n` outruns combat Doka at 14, GameKey at 20, Number at 50. |
| `LHIPS-2026-09-21-001` | NEW | Frozen create INIT 10 vs scaling enemy INIT. Queued `#357`; not re-filed. |
| `LHIPS-2026-09-21-002` | NEW | Enemy CHC saturates at 100 from bishop 115. Queued `#357`; not re-filed. |
| `LHIPS-2026-09-22-001` | NEW | Unenraged fallback Crush one-shots over-level packs at 1–10, then cannot threaten 999-capped packs after ~378. Queued `#407`; not re-filed. Rush unenraged Crush never one-shots (09-28-001). |
| `LHIPS-2026-09-23-001` | NEW | Flat lava 8–15 / spikes 5–10 / poison 4 vs linear HP. Queued `#475`; not re-filed. |
| `LHIPS-2026-09-23-002` | NEW | `maxSpellRange` 5 homogenizes starter ranges by 40. Queued `#475`; not re-filed. |
| `LHIPS-2026-09-24-001` | NEW | Flat Blood Mend 12 vs linear HP. Queued `#530`; not re-filed. |
| `LHIPS-2026-09-24-002` | NEW | Spell-fail 20% − 0.1%/level hits 0 at 201; Strike never rolls it. Queued `#530`; not re-filed. |
| `LHIPS-2026-09-25-001` | NEW | Betrayal enrage 6× Crush/HP vs the **capped** pack. Queued `#560`; not re-filed. Uncapped rush enrage is 09-28-001. |
| `LHIPS-2026-09-25-002` | NEW | Shield Charm 20; potion Doka 50/120 forever. Queued `#560`; not re-filed. |
| `LHIPS-2026-09-26-001` | NEW | Enemy kit Strike 10 / Frost 20 stay catalog-flat vs Crush `L/5`. Queued `#637`; not re-filed. Rush pawn-fallback Strike at player 100000 is Crush 240005 vs 10. |
| `LHIPS-2026-09-26-002` | NEW | Idle +1 HP / 10s vs linear maxHp. Queued `#637`; not re-filed. |
| `LHIPS-2026-09-27-001` | NEW | Player Frost 21 vs 999-capped packs: TTK 62 → 1 as AP dumps. Queued `#670`; not re-filed. Rush TTK converges to 9 (09-28-001). |
| `LHIPS-2026-09-27-002` | NEW | Catalog summon HP vs Crush `L/5`. Queued `#670`; not re-filed. |
| `LHIPS-2026-09-27-003` | NEW | Shrine 300 vs ground `5+2L`. Queued `#670`; not re-filed. |
| `AQA-2026-08-30-012` | NEW | Collectors still missing. |

This file adds IDs only where a long-horizon failure was in-scope and never filed (Boss Rush `player+2` ignores the 999 cap; advertised room rewards unused vs `1.5L` persist; formula MP vs the 16×16 grid).

---

ACTION_ID: LHIPS-2026-09-28-001  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Boss Rush combat level is player+2 with no 999 cap, so enraged Crush one-shots from 11 forever while overworld packs freeze at 1020  
CATEGORY: bosses-dungeons  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `spawnBossRushRoom` (`WorldExploration.tsx` 5326–5345) sets `level: characterStats.level + 2`, spawn HP 100, `id: boss-rush-${roomIndex}-0`, `pieceType: roomDef.boss1Name` (e.g. `"Pale Archbishop"`). `checkBattleTrigger` treats catalog bosses only when `e.id.startsWith("boss_")` (`11958–11959`); `boss-rush-` does not match, so HP becomes `calcEnemyMaxHp(level)` = `floor(50*(1+(L-1)*0.05))` (`3607–3611`, `11970–11974`) and stats come from `computeEnemyStats(level, pieceType, id)` with king-multiplier fallback (`progression.ts` 173–174). Overworld spawn still uses `pickEnemyLevelFromTiers` `maxTier = floor(999/tierSize)` (`combatMath.ts` 58) — confirmed 100% below-tier at player 2500–100000 with max **1020** (003). Harness: `bossRushCombatHp(1) === 55`; `(120) === 352` (exceeds catalog Pale Archbishop 350); `(1000) === 2552`; `(10000) === 25052`; `(100000) === 250052`. Unenraged Crush recv never reaches linear player HP (`firstPlayerLevelBossRushCrushOneShots(1) === null`). Enraged ×6 (`16710–16720`) one-shots from player **11** (`firstPlayerLevelBossRushCrushOneShots(6) === 11`) and still one-shots at 100000 (recv **1166424** vs HP 500095). Overworld enrage vs the frozen 1020 pack is outrun at player 2361 (09-25-001). `buildEnemyKit("Pale Archbishop", 0)` returns pawn `["physical_attack"]` (Strike 10) vs Crush **240005** at player 100000. Player Frost TTK vs rush HP is 2 / 8 / **9** / **9** at 1 / 1000 / 10000 / 100000 — AP and HP both linear, so TTK converges instead of collapsing to 1 (09-27-001 vs the 1020 pack). Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: player **11** for enraged one-shots (inside the documented over-level tail and before the XP wall's practical end). Rush HP exceeds catalog 350 at **120**. Synthetic 10000 / 100000 confirm there is no later inversion. Unreachable by official kill income past the mid-teens.  
CAUSE: Two enemy-level authors. Overworld later gained a 999 tier cap. Boss Rush kept `player+2` on a display-name unit that is not a catalog `boss_` id, so it inherits linear HP and Crush `L/5` with no cap and pawn kits. Enrage ×6 was balanced against the capped pack.  
PLAYER_EFFECT: A hypothetical uncapped player who enters Boss Rush never gets the “overworld packs become chips after 378 / 2361” rescue (09-22 / 09-25). Betrayal (006, ~3% at low level, ~73% at 901) on a rush unit is an instant kill from 11 onward. Without enrage the same unit is a time sink (~9 Frost turns) whose Strike 10 is cosmetic next to Crush. Catalog world bosses stay 350 HP (010) and are the weaker threat past player 120.  
TECHNICAL_EFFECT: No Number overflow (recv 1.17e6). Extra combatants from summoner 100% at 44 (009) can attach to rush units that already one-shot when enraged. Spawn placeholder 100 is not the combat HP.  
SYSTEMS_AFFECTED: `spawnBossRushRoom`; `checkBattleTrigger` `boss_` branch; `calcEnemyMaxHp`; `pickEnemyLevelFromTiers`; fallback Crush / enrage; `buildEnemyKit`; Boss Rush overlay  
RECOMMENDED_ACTION: Report only. Do not retune Crush, the 999 cap, or Boss Rush HP here. If a human picks this ID, pick one published rush-level rule (cap at 999, use catalog `baseStats`, or keep `player+2` and pair enrage) — do not raise overworld maxTier to 100000 as a silent side effect, and do not delete ×6 enrage without a paired rush survival path. 003 remains the overworld-cap ID; 010 remains the catalog-350 ID; 09-25-001 remains the capped-enrage ID.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-003 (overworld 999 cap); LHIPS-2026-08-31-010 (catalog 350); LHIPS-2026-09-25-001 (enrage ×6 on capped packs); LHIPS-2026-09-22-001 (unenraged Crush); LHIPS-2026-08-31-007 / 09-26-001 (kits); LHIPS-2026-09-27-001 (Frost vs cap pack); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if rush HP is switched to catalog 350 without retuning Crush `player+2`. HIGH if rush level is capped at 999 without a paired room-reward pass (002). LOW for documentation.  
VALIDATION_REQUIRED: `bossRushEnemyLevel(1) === 3`; `bossRushCombatHp(1) === 55`; `(120) === 352`; `firstPlayerLevelBossRushCrushOneShots(1) === null`; `(6) === 11`; `kitForPieceName("Pale Archbishop", 0)` is pawn Strike; Frost TTK vs rush at 10000 === 9; live `startsWith("boss_")` still excludes `boss-rush-`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-09-28-002  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Boss Rush catalog room Doka/XP are unused; persist is 1.5×playerLevel Doka per kill, which underpays room 0 until 168 and hits the 100k/500k clamps at 33334 / 12499  
CATEGORY: economy  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `BOSS_RUSH_ROOMS` advertises `dokaReward` 500–5000 and `xpReward` 200–2000 (`useBossRush.ts` 24–134). `handleBossRushRoomClear` ignores those fields and credits `computeVictoryExp` on `battleDefeatedRef` plus `dokaPerEnemy = max(5, floor(characterStats.level * 1.5))` (`WorldExploration.tsx` 12743–12757), `roomMultiplier = 1`. `completeBossRushRoom` documents that client `dokaReward`/`xpReward` must be 0 (`main.mo` 3304–3322; `bossRushProgress.ts` 164–186). Harness (two bosses): live Doka **10** at player 1 vs room-0 copy 500; **500** at 167; exceeds copy from **168**; exceeds jackpot-room copy 5000 from **1668**; unclamped **300000** at 100000. `clampApplyRewardsDeltas` caps Doka at 100_000 from player **33334** and XP at 500_000 from **12499** (`bossRushRoomXp(12499) === 500040`). Kill XP is `2 * (L+2) * 20` (001 curve). Official XP wall still arrives first; 168 is already past intended kill income.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: player **1** (room-0 pays 10 vs advertised 500). Copy-crossing at **168**. Combat-ceiling crossing at **12499** (XP) / **33334** (Doka). Unreachable by official kill income past the mid-teens.  
CAUSE: Room tables were authored as per-room prizes. Persist was later centralized on `applyRewards` kill XP + a linear Doka-per-enemy helper, and `completeBossRushRoom` was gutted so it cannot mint. The published 500–5000 copy was not deleted or retargeted.  
PLAYER_EFFECT: Early rush is a rounding error next to the advertised 500. Past 168 the live grant exceeds room-0 copy and still has nothing to do with which room you cleared (room 0 and jackpot room 9 pay the same `1.5L` helper). Past 12499 / 33334 every room persists the same 100k/500k ceiling as a stacked overworld jackpot (09-01-002). Ground coins at the 999 cap are 2045 (09-27-003); a 1000-level rush room already pays 3000.  
TECHNICAL_EFFECT: 300000 / 4e6 are clamped before Candid. `toLocaleString` HUD is fine through the ceiling. Two-boss assumption matches rooms that spawn `boss1Id` and `boss2Id`.  
SYSTEMS_AFFECTED: `BOSS_RUSH_ROOMS`; `handleBossRushRoomClear`; `completeBossRushRoom`; `clampApplyRewardsDeltas`; recap Doka/XP  
RECOMMENDED_ACTION: Report only. Do not retune `1.5L`, jackpot, or room tables here. If a human picks this ID, pick one published Doka-per-room number and make persist match it — do not raise the combat 100k ceiling to 300000 as a silent side effect of player 100000. 09-01-002 remains the clamp ID.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-09-01-002 (100k/500k ceilings); LHIPS-2026-09-28-001 (uncapped rush level feeds kill XP); LHIPS-2026-09-27-003 (shrine/ground Doka); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if catalog `dokaReward` is wired back into `completeBossRushRoom` without dropping the `applyRewards` path (double mint). LOW for documentation.  
VALIDATION_REQUIRED: `bossRushRoomDoka(1) === 10`; `(167) === 500`; `firstPlayerLevelBossRushRoomDokaExceedsCatalog(500) === 168`; Doka clamp 33334; XP clamp 12499; `completeBossRushRoom` still ignores client rewards. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-09-28-003  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Formula MP is 4+floor(L/25) on a 16×16 4-dir grid, so spawn-center maps are fully walkable at 300 and leftover MP at 100000 is 4004  
CATEGORY: technical-limits  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Battle walk is a 4-direction BFS at 1 MP/tile (`WorldExploration.tsx` `getMpReachableTiles` 7024–7066; `battleWalkCostPerTile`). `WORLD_GRID_SIZE = 16` (`gameConstants.ts` 8). Manhattan from spawn-center (8,8) to a corner is **16**; opposite-corner diameter is **30**. Formula MP is `PLAYER_BASE_MP + floor(L/25)` = `4 + floor(L/25)` (`progression.ts` 65–72; `formulaMp`). Persist writes `_minNat(..., 20)` for AP **and** MP (`main.mo` 2044–2054; 09-01-003). Harness: `formulaMp(1) === 4`; `(100) === 8`; `(300) === 16`; `(400) === 20`; `(10000) === 404`; `(100000) === 4004`. `firstLevelFormulaMpAtLeast(16) === 300`; `(30) === 650`. Persist 20 already covers every spawn-center map. Starter spells are `mpCost: 0` (`spellData.ts`), so surplus MP cannot dump into casts — only into leftover-walk slices. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: player **300** (formula MP reaches 16). Diameter 30 at **650**. Persist-20 players already cover spawn-center maps from 400. 10000 / 100000 are synthetic under kill income.  
CAUSE: MP growth was paired to the same `apMpGrowthEveryNLevels = 25` knob as AP. The battle grid is a fixed 16. Those were never re-based after walk stayed Manhattan-1.  
PLAYER_EFFECT: Past 300, more MP does not open more of the map from spawn-center. Past 650, even a corner-to-corner dump is covered and the rest of the 4004 MP is leftover-walk noise. Persist 20 never shows the 4004, but battle init uses formula MP (same as AP, 09-01-003), so the live orb can read 404 while the map was finished at 16.  
TECHNICAL_EFFECT: No Number overflow. Leftover MP walks are a RAF cost (out of scope to change). Frozen Terrain / Slime Flood 2× MP/tile (`enemyWalkMp.ts`) only delays saturation to 600 / 1300.  
SYSTEMS_AFFECTED: `getPlayerBaseStats` MP; `getMpReachableTiles`; `persistApWriteCap` (MP); Battle UI MP orb; leftover-walk  
RECOMMENDED_ACTION: Report only. Do not retune `apMpGrowthEveryNLevels` or grid size here. If a human picks this ID, pair published battle MP with the 16-tile Manhattan diameter — do not lift persist 20 to 4004 as a silent side effect. 09-01-003 remains the persist-write ID; 09-27-001 remains the AP-dump TTK ID.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-09-01-003 (unbounded formula vs persist 20); LHIPS-2026-09-27-001 (AP dump); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if battle MP is switched to persist 20 without retuning expected walk distance on Frozen Terrain maps. LOW for documentation.  
VALIDATION_REQUIRED: `formulaMp(300) === 16`; `firstLevelFormulaMpAtLeast(16) === 300`; `(30) === 650`; `formulaMp(100000) === 4004`; walk BFS still 4-dir; persist MP cap still 20. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  
