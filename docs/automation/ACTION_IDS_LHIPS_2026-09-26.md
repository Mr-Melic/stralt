# ACTION_IDs — 2026-09-26 Long-Horizon Infinite Progression Simulator

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Long-Horizon Infinite Progression Simulator.  
Narrative: [`LONG_HORIZON_2026-09-26.md`](./LONG_HORIZON_2026-09-26.md).  
Harness: `src/frontend/src/utils/longHorizonSim.ts`.

Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **observation only** — no curve redesign.

HEAD inspected: `0f5363f` (same as queued `#357` / `#407` / `#475` / `#530` / `#560`). Stress includes 10000 / 50000 / 100000. Harness **unions** `#357` (INIT / CHC), `#407` (Crush), `#475` (hazards / range), `#530` (Blood Mend / fail), and `#560` (enrage / Shield-potion) rather than overwriting those files. This branch restacks onto `#560` so oldest-first merge-tree stays clean.

## Still-open IDs (not re-filed)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| `LHIPS-2026-08-31-001` | NEW | Exponential XP vs linear kill XP. Practical wall ~15–22. |
| `LHIPS-2026-08-31-002` | NEW | IEEE Infinity of the raw float at 1019. HUD path superseded by 09-01-001. |
| `LHIPS-2026-08-31-003` | NEW | Enemy `maxTier = floor(999/tierSize)`. Player 2500+ is 100% under-level. Confirmed at 10000 / 50000 / 100000. |
| `LHIPS-2026-08-31-004` | NEW | RES/SR hit 100; player SP does not scale. Rook RES 100 at 78. |
| `LHIPS-2026-08-31-005` | NEW | Three HP formulas; victory floor exceeds maxHp at 10 on this HEAD. Queued `#386` caps the floor; not merged. Unused exponential HP is JSON-null from **14500**. |
| `LHIPS-2026-08-31-006` | NEW | 30% uniform AI 1–10; saturates ~901. Betrayal leak ~3% at level 1. |
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
| `LHIPS-2026-09-02-001` | NEW | GameKey redeem up to 10M Doka outside applyRewards 100k. Death then cuts 40% of the wallet. |
| `LHIPS-2026-09-02-002` | NEW | `upgradeSpell` `10*2^n` outruns combat Doka at 14, GameKey at 20, Number at 50. |
| `LHIPS-2026-09-21-001` | NEW | Frozen create INIT 10 vs scaling enemy INIT. Queued `#357`; not re-filed. |
| `LHIPS-2026-09-21-002` | NEW | Enemy CHC saturates at 100 from bishop 115. Queued `#357`; not re-filed. |
| `LHIPS-2026-09-22-001` | NEW | Unenraged fallback Crush one-shots over-level packs at 1–10, then cannot threaten 999-capped packs after ~378. Queued `#407`; not re-filed. Enrage ×6 is 09-25-001. |
| `LHIPS-2026-09-23-001` | NEW | Flat lava 8–15 / spikes 5–10 / poison 4 vs linear HP. Queued `#475`; not re-filed. |
| `LHIPS-2026-09-23-002` | NEW | `maxSpellRange` 5 homogenizes starter ranges by 40. Queued `#475`; not re-filed. |
| `LHIPS-2026-09-24-001` | NEW | Flat Blood Mend 12 vs linear HP. Queued `#530`; not re-filed. Potion *fraction* stays 30/70%; potion *cost* is 09-25-002. |
| `LHIPS-2026-09-24-002` | NEW | Spell-fail 20% − 0.1%/level hits 0 at 201; Strike never rolls it. Queued `#530`; not re-filed. |
| `LHIPS-2026-09-25-001` | NEW | Betrayal enrage 6× Crush/HP. Queued `#560`; not re-filed. |
| `LHIPS-2026-09-25-002` | NEW | Shield Charm 20; potion Doka 50/120 forever. Queued `#560`; not re-filed. |
| `AQA-2026-08-30-012` | NEW | Collectors still missing. |

This file adds IDs only where a long-horizon failure was in-scope and never filed (flat kit catalog vs Crush `L/5`; idle +1 HP / 10s vs linear maxHp).

---

ACTION_ID: LHIPS-2026-09-26-001  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Enemy kit spells stay catalog-flat (Strike 10 / Frost 20 / Inferno 0) while fallback Crush scales L/5, so advanced AI becomes the weaker attacker  
CATEGORY: spell-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live kit assignment is `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`src/frontend/src/components/WorldExploration.tsx` 11920) — a `LevelZone` object, so `Math.floor` is NaN and every piece stays on the zone-0 kit (007). Those kits resolve to Strike (`physical_attack` damage 10, `spellData.ts` 10–16) or Frost Bolt (20, 124–130). Inferno / Poison Arrow / Venom Strike are catalog `damage: 0` (Inferno 502–516). Kit execution uses `calcScaledDamage(spellDmg, enemy.level, 0)` (`WorldExploration.tsx` 16464–16468); `calcScaledDamage` ignores `_casterLevel` (`combatMath.ts` 130–137) so the raw is still 10 / 20 at enemy 1020. `pickBestDamageSpell` keeps only `Number(s.damage) > 0` (`enemyAI.ts` 555–572), so Inferno / Poison / Venom are never the chosen damage spell — even a numeric zone-2 queen kit would skip Inferno. Fallback melee is Crush 12 / Fire Bolt 8 × `max(1, enemy.level / 5)` (`WorldExploration.tsx` 16710–16720); `estimateDamage` for a null spell uses the same Crush formula (`enemyAI.ts` 494–499). Harness: `kitCastRaw(20) === 20`; `firstEnemyLevelCrushExceedsKit(20) === 9` (Crush 22); `firstEnemyLevelCrushExceedsKit(10) === 1` (Crush floor 12); `crushOverKitRatio(80, 20) === 9.6`; `crushOverKitRatio(1020, 20) === 122.4`; `crushOverKitRatio(1020, 10) === 244.8`. CHC 100 (09-21-002) can double Frost to 40; cap Crush is still 61× that. Erratic gate `aiTier >= 5` is already ~88% at enemy 101 (`monteCarloAiTiers`) — those AIs prefer `kind: "cast"` kits.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: enemy 1 for Strike (Crush floor 12 > 10); enemy **9** for Frost (Crush 22 > 20). This run’s player-1 pack already rolls max enemy 74–80 (Crush 192 = 9.6× Frost). At the 999-cap (player 2500+, 003) the ratio is frozen at 122× because enemy level no longer grows. Official XP wall (001) still arrives first for character leveling.  
CAUSE: Two damage paths were never paired. Catalog kits are intended identity (piece role, zone-2 Inferno) but their numbers are constants and several “advanced” ids have zero direct damage. Fallback Crush is the only kit-adjacent attack that scales with enemy level. Smarter AI selects the constant path.  
PLAYER_EFFECT: High-level fights do not become “advanced casters.” A bishop that successfully casts Frost deals 20 (40 on a CHC-100 crit). The same bishop that falls through to melee deals Crush 2448 at the spawn cap (recv 1983 after two create-RES 10% passes; 11897 if enraged, 09-25-001). Role identity collapses: pawn/knight/bishop/queen/king all threaten through fallback Crush, not through their kits. Advanced AI saturation (006) makes that collapse more likely, not less.  
TECHNICAL_EFFECT: No Number overflow (2448 / 122.4 are small). `calcScaledDamage(0, …)` would floor to 1 if Inferno were forced through that helper; the live picker never calls it. Family 30% HP/damage writes are still overwritten at battle start (`WorldExploration.tsx` 11970–11998) so elite identity cannot rescue kits.  
SYSTEMS_AFFECTED: `buildEnemyKit`; `pickBestDamageSpell`; `calcScaledDamage`; WorldExploration kit cast and fallback melee; `spellData.ts` Inferno/Poison/Venom; AI tier / erratic gate  
RECOMMENDED_ACTION: Report only. Do not retune Crush, kit catalog, or AI here. If a human picks this ID, pick one published scaling for kit damage versus Crush `L/5` — do not raise catalog Frost to 2448 as a silent side effect, and do not delete fallback Crush without a paired kit-damage path. Zone-object 007 is a separate assignment bug; fixing the object would still leave Inferno at 0.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-007 (zone object); LHIPS-2026-08-31-006 (AI saturation / kit preference); LHIPS-2026-09-22-001 (Crush `L/5`); LHIPS-2026-09-21-002 (CHC 100 doubles kits, not Crush); LHIPS-2026-08-31-003 (999 cap freezes the ratio); LHIPS-2026-09-25-001 (enrage ×6 on Crush only)  
REGRESSION_RISK: HIGH if kit damage is multiplied by `L/5` without a paired RES/HP pass (one-shots move earlier than 09-22). LOW for documentation.  
VALIDATION_REQUIRED: `kitCastRaw(10) === 10`; `kitCastRaw(20) === 20`; `firstEnemyLevelCrushExceedsKit(20) === 9`; `crushOverKitRatio(1020, 20) === 122.4`; `pickBestDamageSpell` still drops `damage === 0`; live `buildEnemyKit` on a LevelZone object still returns Frost for queen. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-09-26-002  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Out-of-battle regen stays +1 HP per 10s while linear maxHp grows, so idle full-heal reaches 14 hours at 1000 and 58 days at 100000  
CATEGORY: economy  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Idle regen is `setInterval` 10000 ms, `hp + 1`, skipped while `inBattleRef` (`src/frontend/src/components/WorldExploration.tsx` 3618–3625). Live maxHp is `floor(100 * (1 + (L-1)*0.05))` (`3400–3406`). Seconds to full from 0 = `maxHp * 10`. Harness: `passiveRegenSecondsToFull(1) === 1000`; `(10) === 1450`; `(100) === 5950`; `(1000) === 50950` (~14.2 h); `(100000) === 5000950` (~57.9 d). Blood Mend remains catalog 12 (09-24-001). Shop potions restore `floor(maxHp * 0.3)` / `0.7` but cost 50 / 120 forever (09-25-002). Death respawn HP is 50% of linear max (`respawnHpAfterDeath`). The idle clock is the only heal that is both a constant **1** and gated on wall-clock time rather than AP/Doka.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: 1 is already 17 minutes from empty; the slope is obvious by **100** (99 minutes) and extreme at **1000** (14 hours). Official XP wall (001) still arrives first for character leveling; 1000 / 100000 are synthetic under kill income.  
CAUSE: Regen was a presentation comfort tick (+1 / 10s) on a 100-HP create budget. Player HP later became a linear function of level. The interval and the +1 were never paired to `statGrowthPercent`.  
PLAYER_EFFECT: After a non-potion, non-shop heal (or a leftover chip below a potion buy), waiting out of battle scales with level. At 1000, idling from 1 HP is a 14-hour real-time sink. Potions still fill 30/70% instantly if the player has 50/120 Doka (and those Doka/HP ratios collapse — 09-25-002). Blood Mend 12 is irrelevant out of battle. At 100000 the clock is a multi-week wait; that is a stress bound, not an expected live session.  
TECHNICAL_EFFECT: `setInterval` 10s at 500095 ticks is ~58 days of timer callbacks if someone sat at empty; each tick is a React `setCharacterStats`. No Number overflow (`5000950` seconds fits). Battle HP is not this path (`inBattleRef` returns early).  
SYSTEMS_AFFECTED: WorldExploration idle regen `useEffect`; linear `maxHp`; BuffShop potions; Blood Mend; `respawnHpAfterDeath`  
RECOMMENDED_ACTION: Report only. Do not retune the 10s interval or linear HP here. If a human picks this ID, pair idle regen to maxHp (or to the potion fraction) rather than shrinking Crush or raising Blood Mend as a substitute.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-09-24-001 (in-battle Blood Mend 12 vs the same linear HP); LHIPS-2026-09-25-002 (potions scale HP, not time); LHIPS-2026-08-31-005 (which HP formula is live); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if the interval is shortened globally (battery / RAF-adjacent timer load on the overworld). LOW for documentation.  
VALIDATION_REQUIRED: `passiveRegenSecondsToFull(1) === 1000`; `(1000) === 50950`; interval is still 10000; `inBattleRef` still skips the tick; potions still `floor(maxHp * 0.3)` at cost 50. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  
