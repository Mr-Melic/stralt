# ACTION_IDs — 2026-09-27 Long-Horizon Infinite Progression Simulator

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Long-Horizon Infinite Progression Simulator.  
Narrative: [`LONG_HORIZON_2026-09-27.md`](./LONG_HORIZON_2026-09-27.md).  
Harness: `src/frontend/src/utils/longHorizonSim.ts`.

Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **observation only** — no curve redesign.

HEAD inspected: `0f5363f` (same as queued `#357` / `#407` / `#475` / `#530` / `#560` / `#637`). Stress includes 10000 / 50000 / 100000. Harness **unions** `#637` (kit vs Crush / idle regen) rather than overwriting those files. This branch restacks onto `#637` so oldest-first merge-tree stays clean.

## Still-open IDs (not re-filed)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| `LHIPS-2026-08-31-001` | NEW | Exponential XP vs linear kill XP. Practical wall ~15–22. |
| `LHIPS-2026-08-31-002` | NEW | IEEE Infinity of the raw float at 1019. HUD path superseded by 09-01-001. |
| `LHIPS-2026-08-31-003` | NEW | Enemy `maxTier = floor(999/tierSize)`. Player 2500+ is 100% under-level. Confirmed at 10000 / 50000 / 100000. |
| `LHIPS-2026-08-31-004` | NEW | RES/SR hit 100; player SP does not scale. Rook RES 100 at 78. |
| `LHIPS-2026-08-31-005` | NEW | Three HP formulas; victory floor exceeds maxHp at 10 on this HEAD. Queued `#386` caps the floor; not merged. Unused exponential HP is JSON-null from **14500**. |
| `LHIPS-2026-08-31-006` | NEW | 30% uniform AI 1–10; saturates ~901. Betrayal leak ~3% at level 1. |
| `LHIPS-2026-08-31-007` | NEW | `buildEnemyKit(currentMap.levelZone)` still passes an object. `setCurrentZoneTier` is unused by kits. |
| `LHIPS-2026-08-31-008` | NEW | All 32 starters owned at create. `shouldIncludeBackendSpellInLibrary` only hides retired ids. |
| `LHIPS-2026-08-31-009` | NEW | Summoner 100% at player 44. |
| `LHIPS-2026-08-31-010` | NEW | Boss combat HP static (~350). Guide `1.08^diff` not applied. |
| `LHIPS-2026-08-31-011` | NEW | Challenge under-30 / under-50 fail on one hit at 14 / 24 (spawn placeholder `L*2+3`). |
| `LHIPS-2026-08-31-012` | NEW | Jackpot table unchanged. Persist 100k-capped. |
| `LHIPS-2026-08-31-013` | NEW | Level-skip claim closed (level is frozen on `saveBattleStats`). AP/MP remainder is 09-01-003. |
| `LHIPS-2026-08-31-014` | NEW | No player telemetry. |
| `LHIPS-2026-09-01-001` | NEW | HUD saturates at MAX_SAFE from 48. |
| `LHIPS-2026-09-01-002` | NEW | applyRewards 100k/500k vs jackpot and Void+boost XP. Dungeon-pack XP clamp is enemy 1924 (past spawn cap). |
| `LHIPS-2026-09-01-003` | NEW | Formula AP 21 at 325 vs persist 20. Persist is formula-aware until 20; battle still uses unbounded `getPlayerBaseStats`. TTK slope of that unbounded AP is 09-27-001. |
| `LHIPS-2026-09-01-004` | NEW | Leftover Nat / Motoko pow2 / Number leftover. |
| `LHIPS-2026-09-02-001` | NEW | GameKey redeem up to 10M Doka outside applyRewards 100k. Death then cuts 40% of the wallet. |
| `LHIPS-2026-09-02-002` | NEW | `upgradeSpell` `10*2^n` outruns combat Doka at 14, GameKey at 20, Number at 50. |
| `LHIPS-2026-09-21-001` | NEW | Frozen create INIT 10 vs scaling enemy INIT. Queued `#357`; not re-filed. |
| `LHIPS-2026-09-21-002` | NEW | Enemy CHC saturates at 100 from bishop 115. Queued `#357`; not re-filed. |
| `LHIPS-2026-09-22-001` | NEW | Unenraged fallback Crush one-shots over-level packs at 1–10, then cannot threaten 999-capped packs after ~378. Queued `#407`; not re-filed. Enrage ×6 is 09-25-001. Summon HP vs the same Crush is 09-27-002. |
| `LHIPS-2026-09-23-001` | NEW | Flat lava 8–15 / spikes 5–10 / poison 4 vs linear HP. Queued `#475`; not re-filed. |
| `LHIPS-2026-09-23-002` | NEW | `maxSpellRange` 5 homogenizes starter ranges by 40. Queued `#475`; not re-filed. |
| `LHIPS-2026-09-24-001` | NEW | Flat Blood Mend 12 vs linear HP. Queued `#530`; not re-filed. |
| `LHIPS-2026-09-24-002` | NEW | Spell-fail 20% − 0.1%/level hits 0 at 201; Strike never rolls it. Queued `#530`; not re-filed. |
| `LHIPS-2026-09-25-001` | NEW | Betrayal enrage 6× Crush/HP. Queued `#560`; not re-filed. |
| `LHIPS-2026-09-25-002` | NEW | Shield Charm 20; potion Doka 50/120 forever. Queued `#560`; not re-filed. |
| `LHIPS-2026-09-26-001` | NEW | Enemy kit Strike 10 / Frost 20 stay catalog-flat vs Crush `L/5`. Queued `#637`; not re-filed. Player-side Frost TTK is 09-27-001. |
| `LHIPS-2026-09-26-002` | NEW | Idle +1 HP / 10s vs linear maxHp. Queued `#637`; not re-filed. |
| `AQA-2026-08-30-012` | NEW | Collectors still missing. |

This file adds IDs only where a long-horizon failure was in-scope and never filed (player Frost TTK vs linear-then-capped enemy HP; catalog summon HP vs Crush `L/5`; shrine 300 vs ground `5+2L`).

---

ACTION_ID: LHIPS-2026-09-27-001  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Player Frost stays 21 (create SP 8; character level ignored) while battle AP is unbounded +1/25, so TTK vs 999-capped packs peaks then collapses to a 1-turn dump  
CATEGORY: spell-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Player `computeDamage` (`WorldExploration.tsx` 3308–3322) calls `calcScaledDamage(base, characterStats.level, spellLevels[id])` then `floor(dmg * (1 + SP/100))`. `calcScaledDamage` ignores `_casterLevel` (`combatMath.ts` 130–137) and only applies `1.03^spellUpgradeLevel`. Create SP is 8 (`startingChampionStats.ts` 16) and `saveBattleStats` cannot raise it (`main.mo` 2064–2066). Frost catalog is 20 / 3 AP (`spellData.ts` 124–129). Harness: `playerFrostRaw(0) === 21`; `playerFrostRaw(14) === 32` (combat-Doka spell wall, 09-02-002). Battle AP is `getPlayerBaseStats` = `8 + floor(L/25)` (`progression.ts` 65–72) — persist writes `persistApWriteCap` at 20 (`main.mo` 2044–2054; `adminSafety.ts` 260–267) but formula wins at battle init (09-01-003). Frost casts/turn = `floor(AP/3)`: 2 at 1, 7 at 325, **16 at 1000**, **136 at 10000**. Linear enemy HP at spawn cap 1020 is 2597. Optimistic TTK (no enemy RES/SR): **62 turns at player 1**, 31 at 100, **8 at 1000**, **1 at 10000**. Persist-20 counterfactual at 1000 is 21 turns. Rook RES 100 (004, enemy 78) would chip Frost to 1 and stretch TTK to the full HP pool. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: enemy **133** for a 10-turn Frost fight at AP 8 (player 1 budget). The 999-cap pack is 62 turns on that budget, 8 turns at player 1000 (live formula AP 48), 1 turn at 10000. Unreachable by official kill income; persist-20 would freeze the cap fight at 21 turns from 325 onward.  
CAUSE: Catalog Frost and create SP are constants. Character level is not in the damage formula. Battle AP was later given unbounded `+1/25` while persist was capped at 20. Enemy HP is linear until the 999 spawn cap freezes it. Those four knobs were never paired, so TTK first grows with enemy HP and then collapses as AP inflation outruns the frozen pack.  
PLAYER_EFFECT: Early/mid fights stay a few Frost turns. Past the spawn cap, a hypothetical uncapped player stops having “longer fights” and instead dumps dozens of 21-damage Frosts per turn. Persist 20 never shows up in battle. Enemy kit Frost 20 (09-26-001) is the same catalog number without the player SP 8% or the AP dump.  
TECHNICAL_EFFECT: 136 casts/turn at 10000 is a client loop cost on the player turn, not a Number overflow (21×136=2856). RES 100 (004) is the only path that keeps TTK long at the cap. Spell upgrade +3% cannot catch AP inflation before cost `10*2^n` exceeds combat Doka (14) and GameKey (20).  
SYSTEMS_AFFECTED: `computeDamage`; `calcScaledDamage`; `getPlayerBaseStats`; `persistApWriteCap`; Frost Bolt; enemy HP `50*(1+(L-1)*0.05)`; `pickEnemyLevelFromTiers` 999 cap  
RECOMMENDED_ACTION: Report only. Do not retune Frost, AP growth, or the spawn cap here. If a human picks this ID, pick one published player-damage vs AP vs enemy-HP pairing — do not raise catalog Frost to 2597, and do not lift persist 20 to match formula AP 4008 at 100000 as a silent side effect. 09-01-003 remains the persist-write ID.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-09-01-003 (unbounded battle AP vs persist 20); LHIPS-2026-08-31-004 (SP frozen; RES 100 chip); LHIPS-2026-08-31-003 (999 cap freezes enemy HP); LHIPS-2026-09-26-001 (enemy kits stay 10/20); LHIPS-2026-09-02-002 (spell +3% is unaffordable); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if Frost is multiplied by character level without a paired RES/HP pass (one-shots move earlier than 09-22). HIGH if battle AP is switched to persist 20 without retuning expected TTK. LOW for documentation.  
VALIDATION_REQUIRED: `playerFrostRaw(0) === 21`; `playerFrostTurnsToKill(1020, 1) === 62`; `(1020, 1000) === 8`; `(1020, 10000) === 1`; persist-20 at 1000 is 21 turns; `firstEnemyLevelFrostTurnsAtLeast(10, 1, 0, 8) === 133`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-09-27-002  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Catalog summon HP (hunter 80 / archer 42 / bomber 25) is one-shot by Crush L/5 from enemy 11–34 while summoner chance is already 100% at player 44  
CATEGORY: enemy-stats  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `getSummonBaseStats` (`progression.ts` 218–227) is `round(baseHp * hpScale * (1 + spellLevel*0.10))`. Catalog (`spellData.ts` 559–679): hunter hpScale 1.0 → **80**; archer 0.7 → **42**; bomber 0.5 → **25**; guardian 1.5 → **180**; wisp/healer 0.6 → **42**. `unitDef.level` is **1** on every starter summon, so `computeEnemyStats` RES (`summonSpawn.ts` 138, 185) stays a level-1 roll (~2–4), not player level. Fallback Crush vs a summon applies RES once (`WorldExploration.tsx` 16722–16738); harness uses res 0. `firstEnemyLevelCrushOneShotsSummonHp`: bomber **11**, archer **18**, hunter **34**, guardian **75**. Raw Crush at player-44 (summoner 100%, 009) is **106**, which already exceeds hunter 80 and archer 42. Cap Crush 2448 (09-22) exceeds guardian 180 by 13.6×. Live enemy summoners only append Dire Wolf or Archer (`WorldExploration.tsx` 11935–11941); Sentinel/Bomber/Wisp are `usableByEnemy: false`. Spell-level HP +10% cannot outrun Crush `L/5` before upgrade cost `10*2^n` (09-02-002); hunter spell 14 is 192 HP vs Crush 106 at 44 and 2448 at 1020.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: enemy **11** (bomber); **18** (archer, the live enemy-summoner kit); **34** (hunter / Dire Wolf). Player 44 is 100% summoner (009) and typical enemies are already in that Crush window. Official XP wall (001) still arrives first for character leveling.  
CAUSE: Summon HP is a catalog base × scale × spell-level 10%. Crush is `12 * max(1, L/5)`. Summon `unitDef.level` is frozen at 1. Summoner chance was later raised to 100% at 44. Those were never paired, so the mechanic that saturates produces units Crush deletes in one hit.  
PLAYER_EFFECT: Saturated summoner fights (009) and player Dire Wolf / Archer summons do not become tanks at high enemy level. A 44+ overworld pack that falls through to melee (09-26-001: kits are the weaker weapon from enemy 9) deletes the wolf/archer and then hits the player with the same Crush. Guardian 180 (player-only) lasts one extra breakpoint (75) and still dies to cap Crush. Lifespan 3–5 turns is irrelevant if HP is gone on the first melee.  
TECHNICAL_EFFECT: No Number overflow (2448 vs 80). Enemy summoner appends a full summon spell onto the zone-0 kit, adding AI work (006) for units that do not survive Crush. Family 30% HP writes are still overwritten at battle start for enemies; summons use `getSummonBaseStats`, not `calcEnemyMaxHp`.  
SYSTEMS_AFFECTED: `getSummonBaseStats`; `spawnSummonUnit`; WorldExploration summoner roll and fallback melee; Crush `L/5`; `ENEMY_SUMMONER_CHANCE_*`; starter summon catalog  
RECOMMENDED_ACTION: Report only. Do not retune Crush, summon HP, or summoner chance here. If a human picks this ID, pair summon HP (or `unitDef.level`) with Crush `L/5` — do not raise hunter to 2448 as a silent side effect, and do not delete fallback Crush without a paired summon survival path. 009 remains the chance-saturation ID; 09-22 remains the player-HP Crush ID.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-009 (summoner 100% at 44); LHIPS-2026-09-22-001 (Crush `L/5`); LHIPS-2026-09-26-001 (AI prefers kits, melee is the scaling weapon); LHIPS-2026-09-02-002 (spell-level HP is unaffordable); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if summon HP is multiplied by enemy level without a paired player-summon vs boss pass. LOW for documentation.  
VALIDATION_REQUIRED: catalog HP hunter 80 / archer 42 / bomber 25 / guardian 180; one-shot enemy levels 34 / 18 / 11 / 75; `fallbackCrushVsSummon(44) === 106`; summoner chance at 44 is 1. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-09-27-003  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Shrine 300 and dungeon-complete 250 stay flat while ground Doka tracks 5+2L, so one cap coin (2045) outpays the shrine from enemy 148  
CATEGORY: economy  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Shrine altar credits a literal **300** (`WorldExploration.tsx` 11308) through `persistDokaCreditResult`. Dungeon-chain completion is `maxDepth * 50` (`portalRules.ts` 195–196) = **250** at depth 5. Ground coins are `round((dokaSpawnBaseValue + avgLevel * 2) * (0.8..1.2))` (`WorldExploration.tsx` 6782–6786); default base 5 (`gameTypes.ts` DEFAULT_GAME_CONFIG). Mean before jitter: `5 + 2L`. Harness: `groundDokaMean(1) === 7`; `(148) === 301`; `(1020) === 2045`; `firstEnemyLevelGroundDokaExceedsShrine() === 148`. 999-cap (003) freezes the mean at ~2045. Combat jackpot still persists 100k (09-01-002). Potions still cost 50/120 (09-25-002). Portal XP is 10 (001). All of these sit under `applyRewards` 100k except GameKey 10M (09-02-001).  
FIRST_APPROXIMATE_PROBLEM_LEVEL: enemy **148** (mean ground coin > shrine 300). At player 1 (mean enemy ~11) the shrine is still ~11× a ground coin. At the spawn cap the shrine is **0.15×** one coin. Official XP wall (001) still arrives first; 148 is past that wall under kill income.  
CAUSE: Shrine and dungeon-complete were fixed comfort grants on a low-level ground table. Ground Doka was later tied to enemy level. Enemy level was later capped at 999. The three were never re-based to one published Doka-per-map budget.  
PLAYER_EFFECT: The shrine stops being the map’s special Doka once enemies pass ~148. Depth-5 dungeon clear (250) is already below the shrine and far below one cap coin. Potion sticker prices 50/120 become a rounding error on a 2045 coin (09-25-002). Jackpot 100k remains the combat lottery, 49× a cap coin.  
TECHNICAL_EFFECT: 2045 fits the 100k `applyRewards` ceiling. `toLocaleString` HUD is fine. One-shot shrine/dungeon ids (`oneShotCredit.ts`) are unrelated to the amounts.  
SYSTEMS_AFFECTED: shrine persist 300; `dungeonChainCompletionBonus`; ground Doka spawn; `dokaSpawnBaseValue`; `clampApplyRewardsDeltas`; BuffShop potions  
RECOMMENDED_ACTION: Report only. Do not retune shrine, ground Doka, or jackpot here. If a human picks this ID, pick one published Doka-per-map curve and place shrine / dungeon-complete / ground coins on it — do not raise shrine to 2045 as a silent side effect of the 999 cap.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-003 (999 cap freezes ground Doka); LHIPS-2026-09-01-002 (100k combat ceiling); LHIPS-2026-09-25-002 (potion sticker prices); LHIPS-2026-08-31-012 (jackpot table); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if ground Doka `*2` is removed without a paired shrine/potion pass (early maps starve). LOW for documentation.  
VALIDATION_REQUIRED: `groundDokaMean(1) === 7`; `(148) === 301`; `(1020) === 2045`; `firstEnemyLevelGroundDokaExceedsShrine() === 148`; shrine persist is still 300; dungeon complete at depth 5 is 250. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  
