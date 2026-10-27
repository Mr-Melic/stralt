# ACTION_IDs — 2026-10-22 Long-Horizon Infinite Progression Simulator

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Long-Horizon Infinite Progression Simulator.  
Narrative: [`LONG_HORIZON_2026-10-22.md`](./LONG_HORIZON_2026-10-22.md).  
Harness: `src/frontend/src/utils/longHorizonSim.ts`.

Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **observation only** — no curve redesign.

HEAD inspected: `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` / `#777` / `#819` inspected). Stress includes 10000 / 50000 / 100000. Harness **unions** `#819` rather than overwriting those files. This branch restacks onto `#819` so oldest-first merge-tree stays clean.

## Still-open IDs (not re-filed)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| `LHIPS-2026-08-31-001` | NEW | Exponential XP vs linear kill XP. Practical wall ~15–22. |
| `LHIPS-2026-08-31-002` | NEW | IEEE Infinity of the raw float at 1019. HUD path superseded by 09-01-001. |
| `LHIPS-2026-08-31-003` | NEW | Enemy `maxTier = floor(999/tierSize)`. Overworld pick max is **1000**. Player 2500+ is 100% under-level. Dungeon +30 after the cap is 10-22-003. |
| `LHIPS-2026-08-31-004` | NEW | RES/SR hit 100; player SP does not scale. Overlay hides that RES (10-21-001). |
| `LHIPS-2026-08-31-005` | NEW | Three HP formulas; victory floor exceeds maxHp at 10. Family spawn HP is a fourth that battle-start discards (10-22-001). |
| `LHIPS-2026-08-31-006` | NEW | 30% uniform AI 1–10; saturates ~901. |
| `LHIPS-2026-08-31-007` | NEW | `buildEnemyKit(currentMap.levelZone)` still passes an object. |
| `LHIPS-2026-08-31-008` | NEW | All 32 starters owned at create. |
| `LHIPS-2026-08-31-009` | NEW | Summoner 100% at player 44. |
| `LHIPS-2026-08-31-010` | NEW | Catalog world-boss HP static. RES/CHC still scale (09-29-001). Overlay still shows RES 0 / CHC 2 (10-21-001). |
| `LHIPS-2026-08-31-011` | NEW | Challenge under-30 / under-50 fail on one hit at 14 / 24. |
| `LHIPS-2026-08-31-012` | NEW | Jackpot table unchanged. Persist 100k-capped. |
| `LHIPS-2026-08-31-013` | NEW | Level frozen on `saveBattleStats`. AP/MP remainder is 09-01-003. Battle AP dump is 10-22-002. |
| `LHIPS-2026-08-31-014` | NEW | No player telemetry. |
| `LHIPS-2026-09-01-001` | NEW | HUD saturates at MAX_SAFE from 48. |
| `LHIPS-2026-09-01-002` | NEW | applyRewards 100k/500k vs jackpot and Void+boost XP. |
| `LHIPS-2026-09-01-003` | NEW | Formula AP 21 at 325 vs persist 20. Battle still inits the formula; zero-CD Frost dump is 10-22-002. |
| `LHIPS-2026-09-01-004` | NEW | Leftover Nat / Motoko pow2 / Number leftover. |
| `LHIPS-2026-09-02-001` | NEW | GameKey redeem up to 10M Doka outside applyRewards 100k. |
| `LHIPS-2026-09-02-002` | NEW | `upgradeSpell` `10*2^n` outruns combat Doka at 14, GameKey at 20, Number at 50. |
| `LHIPS-2026-09-21-001` | NEW | Frozen create INIT 10 vs scaling enemy INIT. Queued `#357`. |
| `LHIPS-2026-09-21-002` | NEW | Enemy CHC saturates at 100 from bishop 115. Overlay still paints CHC 2 (10-21-001). |
| `LHIPS-2026-09-22-001` | NEW | Unenraged fallback Crush one-shots. Queued `#407`. |
| `LHIPS-2026-09-23-001` | NEW | Flat lava/spikes/poison vs linear HP. Queued `#475`. |
| `LHIPS-2026-09-23-002` | NEW | `maxSpellRange` 5 homogenizes starter ranges by 40. Queued `#475`. |
| `LHIPS-2026-09-24-001` | NEW | Flat Blood Mend 12 vs linear HP. Queued `#530`. |
| `LHIPS-2026-09-24-002` | NEW | Spell-fail hits 0 at 201. Queued `#530`. |
| `LHIPS-2026-09-25-001` | NEW | Betrayal enrage 6× Crush. Queued `#560`. |
| `LHIPS-2026-09-25-002` | NEW | Shield Charm 20; potion Doka 50/120 forever. Queued `#560`. |
| `LHIPS-2026-09-26-001` | NEW | Kit Strike/Frost stay catalog-flat vs Crush. Crit Frost still loses from 17 (10-21-001). |
| `LHIPS-2026-09-26-002` | NEW | Idle +1 HP / 10s vs linear maxHp. Queued `#637`. |
| `LHIPS-2026-09-27-001` | NEW | Player Frost vs 999-capped packs. Queued `#670`. Cast *count* dump is 10-22-002. |
| `LHIPS-2026-09-27-002` | NEW | Catalog summon HP vs Crush. Queued `#670`. |
| `LHIPS-2026-09-27-003` | NEW | Shrine 300 vs ground `5+2L`. Queued `#670`. |
| `LHIPS-2026-09-28-001` | NEW | Boss Rush `player+2` ignores 999 cap. Queued `#748`. |
| `LHIPS-2026-09-28-002` | NEW | Catalog room Doka unused vs `1.5L` persist. Queued `#748`. |
| `LHIPS-2026-09-28-003` | NEW | Formula MP vs 16×16 grid. Queued `#748`. |
| `LHIPS-2026-09-29-001` | NEW | Catalog world-boss HP frozen while `computeEnemyStats(player+5)` rolls RES/CHC. Overlay still shows RES 0 (10-21-001). |
| `LHIPS-2026-09-29-002` | NEW | Shop 3 HP/Doka vs potion % and 100k ceiling. Queued `#777`. |
| `LHIPS-2026-10-21-001` | NEW | Initiative overlay AP = level + hardcoded RES 0 / CHC 2. Queued `#819`. |
| `LHIPS-2026-10-21-002` | NEW | Create evasion / resilience / SR never enter combat. Queued `#819`. |
| `AQA-2026-08-30-012` | NEW | Collectors still missing. |

This file adds IDs only where a long-horizon failure was in-scope and never filed (family 30% combat identity wiped at battle-start; zero-CD Frost × unbounded battle AP; dungeon +30 after the 999-cap pick).

---

ACTION_ID: LHIPS-2026-10-22-001  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Family 30% variants write HP/RES/SP at spawn, then battle-start overwrites them, so the seven families never change combat TTK or defenses  
CATEGORY: enemy-generation  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `maybeApplyEnemyFamilyVariant` (`spawnPolicy.ts` 279–287, `FAMILY_VARIANT_CHANCE = 0.3`) calls `applyEnemyFamilyStats` (`261–273`): `hp *= hpMult`, `res = m.res`, `sp = m.spRes`. Catalog RES is a **0–1 fraction** (`iron_golem` 0.75, `plague_rat` 0.05) while combat RES is a 1–100 percent (`computeEnemyStats`). Battle-start then spreads a fresh `computeEnemyStats(e.level, e.pieceType, e.id)` onto `sp/sr/init/res/chc` (`WorldExploration.tsx` 11873, 11898–11902) and sets turn-order HP to `calcEnemyMaxHp(e.level)` = linear `50*(1+0.05*(L-1))` (`11969–11974`, `3607–3612`). Spawn placeholder `round(L*8+20)` × iron-golem 2.5 at synthetic 1020 is **20450**; combat HP at that level is **2597** (7.87× discarded). Family ap/mp stay unused (spawnPolicy comment). Overworld at player 2500+ is already 100% under-level (003); family was the remaining diversity lever and it does not survive contact. Harness: `familyCatalogRes("iron_golem") === 0.75`, `familySpawnHp(1020, "iron_golem") === 20450`, `combatReadsFamilyRes === false`. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** (the overwrite is on every battle-start). The lie is the only remaining pack identity once the 999 cap makes every overworld enemy the same last-tier band (player 2500+). Unreachable by official kill income past the mid-teens.  
CAUSE: Family catalog was authored as spawn-time HP/damage/RES/SP. Battle-start later became the source of truth for linear HP and seeded `computeEnemyStats`. Those two authors were not sized together. Catalog RES is also on a different unit (fraction vs percent).  
PLAYER_EFFECT: A 30% “iron golem / plague rat / wraith” roll changes overworld scaleX/Y and the family tag. In combat every variant has the same linear HP, the same piece RES/CHC/INIT, and the same zone-0 kit (007). Role identity at extreme progression is piece type + overlay AP, not family.  
TECHNICAL_EFFECT: No overflow. Battle-start does extra `computeEnemyStats` work that throws away the family write. If a later change stopped the overwrite, iron-golem RES 0.75 would mean 0.75% reduction, not 75%.  
SYSTEMS_AFFECTED: `applyEnemyFamilyStats`; `generateEnemies`; battle-start `computeEnemyStats`; `calcEnemyMaxHp`; family catalog  
RECOMMENDED_ACTION: Report only. Do not retune family percents, linear HP, or the 999 cap here. If a human picks this ID, pick one published rule (family multipliers apply in combat, or stop advertising seven combat families) — do not start reading fraction RES as percents. 003 remains the spawn cap; 007 remains kits.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-003 (999 cap); LHIPS-2026-08-31-005 (HP formula split); LHIPS-2026-08-31-007 (zone-0 kits); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if family RES 0.75 is fed into `1 - res/100` without retuning. HIGH if family HP 2.5× spawn placeholder is kept *and* linear HP. LOW for documentation.  
VALIDATION_REQUIRED: `familyCatalogRes("iron_golem") === 0.75`; spawn HP 20450 vs combat 2597 at 1020; live battle-start still writes `res: stats.res` and `hp: calcEnemyMaxHp(e.level)`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-22-002  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Starter Frost has cooldown 0, so unbounded battle AP from getPlayerBaseStats becomes 7 / 36 / 136 / 1336 sequential casts per turn at 325 / 2500 / 10000 / 100000 while persist still writes 20  
CATEGORY: technical-limits  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Battle-start AP is `getPlayerBaseStats(level).ap` (`WorldExploration.tsx` 12101–12115) = `8 + floor(L/25)` (`progression.ts` 66–71). Persist writes `min(20, formula)` (`adminSafety.ts` 260–266). `starter-frost` (`spellData.ts` 124–140) has **no `cooldown` field**; `nextSpellCooldownTurns` treats that as 0 (`challengeCompletion.ts` 365–367). Each player turn can therefore fire `floor(AP/3)` Frosts (`FROST_AP_COST = 3`) as sequential `resolvePlayerCast` / `computeDamage` calls. Harness: persist 20 → **6** casts; formula **7** at 325; **16** at 1000; **36** at 2500; **136** at 10000; **1336** at 100000 (AP **4008**). First 100-cast turn is level **7300**. AI still one action (`enemyAI.ts` `decideEnemyAction`). Kit Frost stays catalog 20 (09-26-001); this ID is the *count*, not the per-hit damage. Overlay enemy AP = level (10-21-001) is display-only and is not spent. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **325** for the first extra Frost vs the persist budget of 6. **7300** for a 100-cast turn. **10000** / **100000** for 136 / 1336 resolutions. Unreachable by official kill income past the mid-teens.  
CAUSE: Battle init uses the unbounded formula. Catalog Frost never got a cooldown. Persist later capped AP at 20. Those three authors were not sized together.  
PLAYER_EFFECT: At reachable levels the extra is one bonus Frost (7 vs 6). At the synthetic horizon a single player turn is a cast storm against an AI that still Crush/kit-casts once. TTK vs the 1000-cap pack already hits 1 turn at player 10000 (09-27-001) because AP dump × flat Frost 21 exceeds linear pack HP — not because Frost scaled.  
TECHNICAL_EFFECT: 1336 `computeDamage` + battle-log + VFX on one turn is a RAF hitch risk. Numbers stay finite (`4008` is a safe Number). Persist still writes 20, so the next idle `saveBattleStats` cannot store the battle budget.  
SYSTEMS_AFFECTED: `getPlayerBaseStats`; battle-start AP init; `starter-frost` cooldown; `nextSpellCooldownTurns`; `persistApWriteCap`; player cast loop  
RECOMMENDED_ACTION: Report only. Do not add a Frost cooldown or cap battle AP here. If a human picks this ID, pick one published rule (battle AP is the persist 20, or Frost has a cooldown, or a per-turn cast cap) — do not start spending overlay enemy AP as a silent AI multi-act. 09-01-003 remains the persist/formula split; 09-27-001 remains Frost TTK.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-09-01-003 (persist 20); LHIPS-2026-09-27-001 (Frost TTK); LHIPS-2026-10-21-001 (overlay AP unused by AI); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if battle AP is clamped to 20 without a paired HUD. HIGH if Frost gains a cooldown without retuning TTK vs the 1000-cap pack. LOW for documentation.  
VALIDATION_REQUIRED: `starterFrostCooldownTurns() === 0`; `playerFrostCastsPerTurn(formulaAp(325)) === 7`; `playerFrostCastsPerTurn(formulaAp(100000)) === 1336`; live battle-start still calls `getPlayerBaseStats`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-22-003  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Dungeon tier boost is added after the 999-cap pick, so depth-5 packs top out at 1030 and are 100% under-level from player 2500 while player 1000 can still roll +30 above  
CATEGORY: enemy-generation  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `pickEnemyLevelFromTiers` caps `maxTier = floor(999 / tierSize)` (`combatMath.ts` 54–58). Default `tierSize` 10 → last band **991–1000** (`overworldPickMaxLevel() === 1000`). `generateEnemies` then adds `dungeonScaledEnemyLevel(base, dungeonTierBoost, tierSize)` (`WorldExploration.tsx` 5777–5780; `spawnPolicy.ts` 162–169). Depth 5 is `DUNGEON_TIER_BOOST[5] = 3` (`spawnPolicy.ts` 28, 140–148) → **+30** levels with no second cap. Spawnable dungeon max is **1030**. Harness: `dungeonMaxEnemyLevel() === 1030`; `firstStressLevelFullyUnderDungeonCap() === 2500`; player 1000 can still face 1030 (`player1000CanStillRollDungeonAbove === true`). Overworld at 1000 is already at the last tier (003). Boss Rush `player+2` and catalog world-boss `player+5` still ignore this cap (09-28-001 / 08-31-010). Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1000** for the last overworld band plus dungeon +30 as the only remaining above-level roll. **2500** (first requested stress above 1030) for 100% under-level even in depth 5. Confirmed at 10000 / 50000 / 100000. Unreachable by official kill income past the mid-teens.  
CAUSE: The 999-cap was applied inside the overworld picker. Dungeon extras were later added as a post-pick offset. Depth 5’s +3 tiers was never paired with a second cap or with player levels past 1030.  
PLAYER_EFFECT: Dungeon “harder than overworld” is a 30-level bump that expires as soon as the player is past 1030. From 2500 onward every depth-5 pack is the same last-tier 1000+30 band — more under-level than a player-10 dungeon is over-level. Rush/world-boss still scale with the player (09-28-001) so those two modes become the only above-level content.  
TECHNICAL_EFFECT: 1030 is a safe Number. Linear HP at 1030 is 2622. No overflow. Family overwrite (001) still discards spawn HP after this bump.  
SYSTEMS_AFFECTED: `pickEnemyLevelFromTiers`; `dungeonScaledEnemyLevel`; `DUNGEON_TIER_BOOST`; `generateEnemies`  
RECOMMENDED_ACTION: Report only. Do not raise the 999 cap or retune dungeon extras here. If a human picks this ID, pick one published rule (dungeon boost is inside the cap, or dungeon uses a relative offset like Rush `player+2`) — do not add the boost *and* lift maxTier in the same change. 003 remains the overworld picker; 09-28-001 remains Rush.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-003 (999 cap); LHIPS-2026-09-28-001 (Rush `player+2`); LHIPS-2026-10-22-001 (family overwrite after this level pick); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if dungeon boost is moved inside the picker without a paired depth-1 overworld check (level-1 packs already roll ~80). LOW for documentation.  
VALIDATION_REQUIRED: `overworldPickMaxLevel() === 1000`; `dungeonMaxEnemyLevel() === 1030`; `dungeonScaledEnemyLevel(1000, 3, 10) === 1030`; live `generateEnemies` still adds the boost after `pickEnemyLevelFromTiers`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  
