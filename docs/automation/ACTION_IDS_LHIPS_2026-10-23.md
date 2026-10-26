# ACTION_IDs — 2026-10-23 Long-Horizon Infinite Progression Simulator

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Long-Horizon Infinite Progression Simulator.  
Narrative: [`LONG_HORIZON_2026-10-23.md`](./LONG_HORIZON_2026-10-23.md).  
Harness: `src/frontend/src/utils/longHorizonSim.ts`.

Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **observation only** — no curve redesign.

HEAD inspected: `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` / `#777` / `#819` / `#898` inspected). Stress includes 10000 / 50000 / 100000. Harness **unions** `#898` rather than overwriting those files. This branch restacks onto `#898` so oldest-first merge-tree stays clean.

## Still-open IDs (not re-filed)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| `LHIPS-2026-08-31-001` | NEW | Exponential XP vs linear kill XP. Practical wall ~15–22. |
| `LHIPS-2026-08-31-002` | NEW | IEEE Infinity of the raw float at 1019. HUD path superseded by 09-01-001. |
| `LHIPS-2026-08-31-003` | NEW | Enemy `maxTier = floor(999/tierSize)`. Overworld pick max is **1000**. Dungeon +30 is 10-22-003. |
| `LHIPS-2026-08-31-004` | NEW | RES/SR hit 100; player SP does not scale. Overlay hides that RES (10-21-001). |
| `LHIPS-2026-08-31-005` | NEW | Three HP formulas; victory floor exceeds maxHp at 10. Family spawn HP is a fourth (10-22-001). |
| `LHIPS-2026-08-31-006` | NEW | 30% uniform AI 1–10; saturates ~901. |
| `LHIPS-2026-08-31-007` | NEW | `buildEnemyKit(currentMap.levelZone)` still passes an object. |
| `LHIPS-2026-08-31-008` | NEW | All 32 starters owned at create. Timestep and Dire Wolf are in that set (10-23-001 / 002). |
| `LHIPS-2026-08-31-009` | NEW | Summoner 100% at player 44. |
| `LHIPS-2026-08-31-010` | NEW | Catalog world-boss HP static. RES/CHC still scale (09-29-001). |
| `LHIPS-2026-08-31-011` | NEW | Challenge under-30 / under-50 fail on one hit at 14 / 24. |
| `LHIPS-2026-08-31-012` | NEW | Jackpot table unchanged. Persist 100k-capped. |
| `LHIPS-2026-08-31-013` | NEW | Level frozen on `saveBattleStats`. Battle AP dump is 10-22-002; Timestep doubles it (10-23-001). |
| `LHIPS-2026-08-31-014` | NEW | No player telemetry. |
| `LHIPS-2026-09-01-001` | NEW | HUD saturates at MAX_SAFE from 48. |
| `LHIPS-2026-09-01-002` | NEW | applyRewards 100k/500k vs jackpot and Void+boost XP. |
| `LHIPS-2026-09-01-003` | NEW | Formula AP 21 at 325 vs persist 20. Timestep restores the formula (10-23-001). |
| `LHIPS-2026-09-01-004` | NEW | Leftover Nat / Motoko pow2 / Number leftover. |
| `LHIPS-2026-09-02-001` | NEW | GameKey redeem up to 10M Doka outside applyRewards 100k. |
| `LHIPS-2026-09-02-002` | NEW | `upgradeSpell` `10*2^n` outruns combat Doka at 14, GameKey at 20, Number at 50. |
| `LHIPS-2026-09-21-001` | NEW | Frozen create INIT 10 vs scaling enemy INIT. Queued `#357`. Summon INIT uses player level (10-23-003). |
| `LHIPS-2026-09-21-002` | NEW | Enemy CHC saturates at 100 from bishop 115. |
| `LHIPS-2026-09-22-001` | NEW | Unenraged fallback Crush one-shots. Queued `#407`. |
| `LHIPS-2026-09-23-001` | NEW | Flat lava/spikes/poison vs linear HP. Queued `#475`. |
| `LHIPS-2026-09-23-002` | NEW | `maxSpellRange` 5 homogenizes starter ranges by 40. Queued `#475`. |
| `LHIPS-2026-09-24-001` | NEW | Flat Blood Mend 12 vs linear HP. Queued `#530`. |
| `LHIPS-2026-09-24-002` | NEW | Spell-fail hits 0 at 201. Queued `#530`. |
| `LHIPS-2026-09-25-001` | NEW | Betrayal enrage 6× Crush. Queued `#560`. |
| `LHIPS-2026-09-25-002` | NEW | Shield Charm 20; potion Doka 50/120 forever. Queued `#560`. |
| `LHIPS-2026-09-26-001` | NEW | Kit Strike/Frost stay catalog-flat vs Crush. Queued `#637`. |
| `LHIPS-2026-09-26-002` | NEW | Idle +1 HP / 10s vs linear maxHp. Queued `#637`. |
| `LHIPS-2026-09-27-001` | NEW | Player Frost vs 999-capped packs. Cast *count* dump is 10-22-002; Timestep doubles it (10-23-001). |
| `LHIPS-2026-09-27-002` | NEW | Catalog summon HP vs Crush. INIT/RES still scale with player level (10-23-003). |
| `LHIPS-2026-09-27-003` | NEW | Shrine 300 vs ground `5+2L`. Queued `#670`. |
| `LHIPS-2026-09-28-001` | NEW | Boss Rush `player+2` ignores 999 cap. Queued `#748`. |
| `LHIPS-2026-09-28-002` | NEW | Catalog room Doka unused vs `1.5L` persist. Queued `#748`. |
| `LHIPS-2026-09-28-003` | NEW | Formula MP vs 16×16 grid. Queued `#748`. |
| `LHIPS-2026-09-29-001` | NEW | Catalog world-boss HP frozen while `computeEnemyStats(player+5)` rolls RES/CHC. |
| `LHIPS-2026-09-29-002` | NEW | Shop 3 HP/Doka vs potion % and 100k ceiling. Queued `#777`. |
| `LHIPS-2026-10-21-001` | NEW | Initiative overlay AP = level + hardcoded RES 0 / CHC 2. Queued `#819`. |
| `LHIPS-2026-10-21-002` | NEW | Create evasion / resilience / SR never enter combat. Queued `#819`. |
| `LHIPS-2026-10-22-001` | NEW | Family 30% combat identity wiped at battle-start. Queued `#898`. |
| `LHIPS-2026-10-22-002` | NEW | Zero-CD Frost × unbounded battle AP. Timestep doubles that dump (10-23-001). |
| `LHIPS-2026-10-22-003` | NEW | Dungeon +30 after the 999-cap pick. Queued `#898`. |
| `AQA-2026-08-30-012` | NEW | Collectors still missing. |

This file adds IDs only where a long-horizon failure was in-scope and never filed (Timestep restores unbounded formula AP; player summons have no cap; summon INIT/RES/CHC use character level while HP stays catalog).

---

ACTION_ID: LHIPS-2026-10-23-001  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Starter Timestep restores unbounded getPlayerBaseStats AP mid-turn at cost 0, doubling the zero-CD Frost dump to 14 / 2672 sequential casts at 325 / 100000  
CATEGORY: technical-limits  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: All 32 starters are owned at create (008), including `spell-timestep` (`spellData.ts` 216–231): `apCost` 0, no `cooldown`, `isTimestep: true`. `resolvePlayerCast` (`spellEngine.ts` 721–733) calls `restoreApMp` once per battle and returns `"no_ap"` so the caller does not deduct. Live restore (`WorldExploration.tsx` 9355–9372) sets AP to `getPlayerBaseStats(level).ap` minus the Timestep cost of 0 — the unbounded formula `8 + floor(L/25)`, not persist 20. `timestepUsedRef` resets at battle-start (12177). Combined with Frost CD 0 (10-22-002), dump-then-Timestep-then-dump is `2 * floor(AP/3)` casts in one turn. Harness: `starterTimestepApCost() === 0`; `frostCastsWithTimestepRefill(formulaAp(325)) === 14`; `(formulaAp(100000)) === 2672`; first 100-cast Timestep turn at **3550** (vs 7300 for a single AP bar). Persist still writes 20. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **325** for the first extra full AP bar vs persist (14 Frosts vs 6). **3550** for a 100-cast Timestep turn. **100000** for 2672 resolutions. Unreachable by official kill income past the mid-teens.  
CAUSE: Timestep was authored as a once-per-battle refill of “full AP.” Battle init later used the unbounded formula. Persist later capped writes at 20. Frost never got a cooldown. Those four authors were not sized together.  
PLAYER_EFFECT: At reachable levels this is one extra 7-cast Frost dump after the persist budget of 6. At the synthetic horizon a single player turn is two full formula bars against an AI that still Crush/kit-casts once. TTK vs the 1000-cap pack already hits 1 turn at player 10000 from one bar (09-27-001) — Timestep is leftover fire after the pack is dead.  
TECHNICAL_EFFECT: 2672 `computeDamage` + battle-log + VFX on one turn is a RAF hitch risk on top of 10-22-002. Numbers stay finite (`4008 * 2` AP throughput is a safe Number). Persist still writes 20.  
SYSTEMS_AFFECTED: `spell-timestep`; `restoreApMp`; `getPlayerBaseStats`; `timestepUsedRef`; starter Frost cooldown; player cast loop  
RECOMMENDED_ACTION: Report only. Do not add a Frost cooldown, cap battle AP, or retune Timestep here. If a human picks this ID, pick one published rule (Timestep restores persist 20, or Timestep is not in the create kit, or a per-turn cast cap) — do not start spending overlay enemy AP as a silent AI multi-act. 10-22-002 remains the single-bar dump; 09-01-003 remains the persist/formula split.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-10-22-002 (single-bar Frost dump); LHIPS-2026-09-01-003 (persist 20); LHIPS-2026-08-31-008 (all starters owned); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if Timestep starts restoring persist 20 without a paired HUD. HIGH if Timestep is removed from the create kit without a discovery replacement. LOW for documentation.  
VALIDATION_REQUIRED: `starterTimestepApCost() === 0`; `starterTimestepIsOncePerBattle() === true`; `frostCastsWithTimestepRefill(formulaAp(100000)) === 2672`; live `restoreApMp` still calls `getPlayerBaseStats`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-23-002  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Player summons have no cap and cooldown 0, so unbounded battle AP places 7 / 36 / 136 / 1336 Dire Wolves per turn at 325 / 2500 / 10000 / 100000 against an enemy cap of 2 and a 16×16 grid  
CATEGORY: technical-limits  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `summon-dire-wolf` (`spellData.ts` 547–573) has `apCost` 3 and **no `cooldown`**. `nextSpellCooldownTurns` treats that as 0 (`challengeCompletion.ts` 365–367). `executeCastAttempt` deducts AP on `"summon"` (`WorldExploration.tsx` 17158–17165) so this is not the old 0-AP spawn bug — it is `floor(AP/3)` summons per turn, same cadence as Frost. `spawnPlayerSummon` (`9582–9635`) calls `addCombatant` with **no** `ENEMY_SUMMON_CAP` / `MAX_ENEMIES` check. Enemy summoners skip at `existingEnemySummons.length >= ENEMY_SUMMON_CAP` (2) (`enemyAI.ts` 1854–1867). `MAX_ENEMIES` 20 is used for boss minion slots (`WorldExploration.tsx` 16164–16167), not the player spawn path. The 16×16 battle grid is 256 cells (`WORLD_GRID_SIZE`). Harness: `PLAYER_SUMMON_CAP_LIVE === null`; `playerSummonCastsPerTurn(formulaAp(325)) === 7`; `(100000) === 1336`; first level that exceeds the enemy cap of 2 is **25**; exceeds overworld `MAX_ENEMIES` 20 at **1375**; fills 256 cells at **19000**. Timestep (001) can dump a second bar into leftover empty cells. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **25** for the first extra summon vs the enemy cap of 2. **1375** to exceed `MAX_ENEMIES` 20. **19000** to fill the 16×16. **10000** / **100000** for 136 / 1336 attempted spawns. Unreachable by official kill income past the mid-teens.  
CAUSE: Enemy summoners later got a cap of 2 and an every-other-turn cadence to bound board complexity. Player spawn kept catalog CD 0, formula AP, and `addCombatant` with no cap. Those two sides were not sized together.  
PLAYER_EFFECT: At reachable levels this is two wolves, matching the enemy cap. At the synthetic horizon a single player turn fills the board with catalog-HP minions (003) that each take a turn. Occupancy then falls back to the nearest free cell until every floor tile is taken.  
TECHNICAL_EFFECT: 1336 `addCombatant` + turn-order inserts + summon AI ticks on a 256-cell grid is a RAF hitch and a larger combatant-store walk than any overworld pack (max 13 before extras). IDs are `summon-${Math.random()…}` (`summonSpawn.ts` 153) — no overflow. `MAX_ENEMIES` 20 is not a battle-start bound here.  
SYSTEMS_AFFECTED: `spawnPlayerSummon`; `addCombatant`; `summon-dire-wolf` cooldown; `ENEMY_SUMMON_CAP`; `MAX_ENEMIES`; 16×16 grid occupancy  
RECOMMENDED_ACTION: Report only. Do not add a player summon cap or a Dire Wolf cooldown here. If a human picks this ID, pick one published rule (player cap matches ENEMY_SUMMON_CAP 2, or summon spells have a cooldown, or battle AP is persist 20) — do not apply `MAX_ENEMIES` 20 to player summons as a silent side effect of a boss-minion helper. 10-22-002 remains Frost; 09-27-002 remains catalog HP vs Crush.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-10-22-002 (same AP dump cadence); LHIPS-2026-10-23-001 (Timestep second bar); LHIPS-2026-10-23-003 (summon stats split); LHIPS-2026-08-31-008 (all starters owned); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if a player cap of 2 ships without a paired summon-UI reject. HIGH if Dire Wolf gains a cooldown without retuning the create kit. LOW for documentation.  
VALIDATION_REQUIRED: `starterDireWolfCooldownTurns() === 0`; `PLAYER_SUMMON_CAP_LIVE === null`; `playerSummonCastsPerTurn(formulaAp(100000)) === 1336`; live `spawnPlayerSummon` still has no cap branch. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-23-003  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Player and enemy summons roll computeEnemyStats at the player character level (king fallback), so INIT/RES/CHC scale to 3006 / 100 while catalog HP stays 80  
CATEGORY: enemy-stats  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `spawnPlayerSummon` passes `characterStats.level` into `spawnSummonUnit` (`WorldExploration.tsx` 9583–9587). Hostile minions do the same (`14926–14930`). `spawnSummonUnit` then calls `computeEnemyStats(level, unitDef.pieceType, spell.id)` (`summonSpawn.ts` 138) **and** `getSummonBaseStats(spellLevel, …)` for HP/AP/MP/lifespan (147–152). Catalog Dire Wolf `pieceType` is `"wolf"` (`spellData.ts` 560), which is not a chess piece, so `getEnemyBaseStats` falls back to **king** multipliers (`progression.ts` 173–174). King max INIT is `round(6 + 1.2 L)`; king max RES hits 100 at **107** (`firstLevelResCanHit100("king")`). Harness: summon max INIT **7** at player 1, **1206** at 1000, **3006** at 2500 vs create player INIT 10 (09-21-001) and vs a 1000-cap king pack max INIT 1206. Hunter catalog HP at spell level 0 is still **80** (09-27-002); Crush one-shots that HP from enemy 34. Enemy summons are capped at 2 (002) but they inherit the *player* level, not the 1030-capped summoner. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **4** for summon max INIT to exceed create 10. **107** for summon RES 100 (chip-1 vs player spells that hit the minion). **1000** for player-summon INIT to match the last overworld band. **2500** for 3006 INIT vs a 100% under-level pack (003 / 10-22-003). Unreachable by official kill income past the mid-teens.  
CAUSE: Spawn reused `computeEnemyStats` with the only level the caller had on hand (the player). HP was later moved to `getSummonBaseStats(spellLevel)`. Catalog `pieceType` values (`wolf`, `golem`, `archer`) were never added to the chess-piece table, so king 1.0 multipliers apply. Those three authors were not sized together.  
PLAYER_EFFECT: A Dire Wolf at player 2500 wins INIT against the player and against a 1030 dungeon pack, then dies to one Crush because HP is still 80. RES 100 on that body does not save it from Crush (physical). Allied summons acting first is a turn-order inversion, not a tank. Enemy minions at high player level are also INIT-scaled off the player, so the two capped enemy summons act before their own summoner.  
TECHNICAL_EFFECT: INIT 3006 and RES 100 are safe Numbers. Catalog HP 80 is a safe Number. No overflow. Overlay still shows RES 0 / CHC 2 (10-21-001) if the summon is painted there.  
SYSTEMS_AFFECTED: `spawnSummonUnit`; `spawnPlayerSummon`; `spawnEnemySummonUnit`; `getEnemyBaseStats` king fallback; `getSummonBaseStats`; summon turn order  
RECOMMENDED_ACTION: Report only. Do not retune king multipliers, catalog HP, or the 999 cap here. If a human picks this ID, pick one published level for summon combat stats (spell level, summoner level, or unitDef.level 1) — do not start feeding `"wolf"` into the chess-piece table as a silent king-1.0. 09-27-002 remains catalog HP vs Crush; 09-21-001 remains player INIT 10.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-09-27-002 (catalog HP); LHIPS-2026-09-21-001 (player INIT 10); LHIPS-2026-10-23-002 (uncapped player spawn count); LHIPS-2026-08-31-004 (RES 100); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if summon INIT switches to unitDef.level 1 without a paired turn-order check (summons that used to act first would act last). HIGH if HP starts using character level *and* family 2.5×. LOW for documentation.  
VALIDATION_REQUIRED: `playerSummonStatBounds(2500).init.max === 3006`; `firstPlayerLevelSummonResCanHit100() === 107`; `catalogSummonMaxHp("hunter", 1) === 80`; live spawn still passes `characterStats.level` into `computeEnemyStats`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  
