# ACTION_IDs — 2026-10-26 Long-Horizon Infinite Progression Simulator

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Long-Horizon Infinite Progression Simulator.  
Narrative: [`LONG_HORIZON_2026-10-26.md`](./LONG_HORIZON_2026-10-26.md).  
Harness: `src/frontend/src/utils/longHorizonSim.ts`.

Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **observation only** — no curve redesign.

HEAD inspected: `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` / `#777` / `#819` / `#898` / `#960` / `#1016` / `#1077` inspected). Stress includes 10000 / 50000 / 100000. Harness **unions** `#1077` rather than overwriting those files. This branch restacks onto `#1077` so oldest-first merge-tree stays clean.

## Still-open IDs (not re-filed)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| `LHIPS-2026-08-31-001` | NEW | Exponential XP vs linear kill XP. Practical wall ~15–22. |
| `LHIPS-2026-08-31-002` | NEW | IEEE Infinity of the raw float at 1019. HUD path superseded by 09-01-001. |
| `LHIPS-2026-08-31-003` | NEW | Enemy `maxTier = floor(999/tierSize)`. Overworld pick max is **1000**. Dungeon +30 is 10-22-003. |
| `LHIPS-2026-08-31-004` | NEW | RES/SR hit 100; player SP does not scale. Iron Curse pulls rook 100 earlier (10-25-003). |
| `LHIPS-2026-08-31-005` | NEW | Three HP formulas; victory floor exceeds maxHp at 10. Titans +1000 is a fifth on the store (10-25-001). |
| `LHIPS-2026-08-31-006` | NEW | 30% uniform AI 1–10; saturates ~901. |
| `LHIPS-2026-08-31-007` | NEW | `buildEnemyKit(currentMap.levelZone)` still passes an object. |
| `LHIPS-2026-08-31-008` | NEW | All 32 starters owned at create. |
| `LHIPS-2026-08-31-009` | NEW | Summoner 100% at player 44. Wolf melee uses player.level (10-25-004). |
| `LHIPS-2026-08-31-010` | NEW | Catalog world-boss HP static. RES/CHC still scale (09-29-001). |
| `LHIPS-2026-08-31-011` | NEW | Challenge under-30 / under-50 fail on one hit at 14 / 24. Void Mirror dump fails under-30 at 325 (10-26-002). |
| `LHIPS-2026-08-31-012` | NEW | Jackpot table unchanged. Persist 100k-capped. Doka Fever 2× still clamps (10-25-002). |
| `LHIPS-2026-08-31-013` | NEW | Level frozen on `saveBattleStats`. |
| `LHIPS-2026-08-31-014` | NEW | No player telemetry. |
| `LHIPS-2026-09-01-001` | NEW | HUD saturates at MAX_SAFE from 48. |
| `LHIPS-2026-09-01-002` | NEW | applyRewards 100k/500k vs jackpot and Void+boost XP. |
| `LHIPS-2026-09-01-003` | NEW | Formula AP 21 at 325 vs persist 20. |
| `LHIPS-2026-09-01-004` | NEW | Leftover Nat / Motoko pow2 / Number leftover. |
| `LHIPS-2026-09-02-001` | NEW | GameKey redeem up to 10M Doka outside applyRewards 100k. |
| `LHIPS-2026-09-02-002` | NEW | `upgradeSpell` `10*2^n` outruns combat Doka at 14, GameKey at 20, Number at 50. |
| `LHIPS-2026-09-21-001` | NEW | Frozen create INIT 10 vs scaling enemy INIT. Queued `#357`. |
| `LHIPS-2026-09-21-002` | NEW | Enemy CHC saturates at 100 from bishop 115. |
| `LHIPS-2026-09-22-001` | NEW | Unenraged fallback Crush one-shots. Queued `#407`. |
| `LHIPS-2026-09-23-001` | NEW | Flat lava/spikes/poison vs linear HP. Queued `#475`. Ember burn 9 is the same class (not re-filed). |
| `LHIPS-2026-09-23-002` | NEW | `maxSpellRange` 5 homogenizes starter ranges by 40. Queued `#475`. |
| `LHIPS-2026-09-24-001` | NEW | Flat Blood Mend 12 vs linear HP. Mending Mist 5% does not commit (10-24-001). |
| `LHIPS-2026-09-24-002` | NEW | Spell-fail hits 0 at 201. Queued `#530`. |
| `LHIPS-2026-09-25-001` | NEW | Betrayal enrage 6× Crush. Queued `#560`. |
| `LHIPS-2026-09-25-002` | NEW | Shield Charm 20; potion Doka 50/120 forever. Mirror Field / Void Mirror skip the charm (10-26-001 / 002). |
| `LHIPS-2026-09-26-001` | NEW | Kit Strike/Frost stay catalog-flat vs Crush. |
| `LHIPS-2026-09-26-002` | NEW | Idle +1 HP / 10s vs linear maxHp. Queued `#637`. |
| `LHIPS-2026-09-27-001` | NEW | Player Frost vs 999-capped packs. Titans/Glass multiply chip-1 after RES (10-25-001). |
| `LHIPS-2026-09-27-002` | NEW | Catalog summon HP vs Crush. Queued `#670`. |
| `LHIPS-2026-09-27-003` | NEW | Shrine 300 vs ground `5+2L`. Queued `#670`. |
| `LHIPS-2026-09-28-001` | NEW | Boss Rush `player+2` ignores 999 cap. Queued `#748`. |
| `LHIPS-2026-09-28-002` | NEW | Catalog room Doka unused vs `1.5L` persist. Queued `#748`. |
| `LHIPS-2026-09-28-003` | NEW | Formula MP vs 16×16 grid. Tide Shade −1 MP vs that MP (10-26-004). |
| `LHIPS-2026-09-29-001` | NEW | Catalog world-boss HP frozen while `computeEnemyStats(player+5)` rolls RES/CHC. |
| `LHIPS-2026-09-29-002` | NEW | Shop 3 HP/Doka vs potion % and 100k ceiling. Queued `#777`. |
| `LHIPS-2026-10-21-001` | NEW | Initiative overlay AP = level + hardcoded RES 0 / CHC 2. Queued `#819`. |
| `LHIPS-2026-10-21-002` | NEW | Create evasion / resilience / SR never enter combat. Queued `#819`. |
| `LHIPS-2026-10-22-001` | NEW | Family 30% combat identity wiped at battle-start. Family **string** still drives Void Mirror / Tide / Ember (10-26-002 / 004). |
| `LHIPS-2026-10-22-002` | NEW | Zero-CD Frost × unbounded battle AP. Time Warp 15s is the wall-clock gate (10-26-003). |
| `LHIPS-2026-10-22-003` | NEW | Dungeon +30 after the 999-cap pick. Queued `#898`. |
| `LHIPS-2026-10-23-001` | NEW | Timestep restores formula AP. Queued `#960`. |
| `LHIPS-2026-10-23-002` | NEW | Player summons have no cap. Queued `#960`. |
| `LHIPS-2026-10-23-003` | NEW | Summon INIT/RES use player level + king fallback. Melee uses the same level (10-25-004). |
| `LHIPS-2026-10-24-001` | NEW | Mending Mist 5% never commits. Same combatantsRef miss as Titans HP (10-25-001). |
| `LHIPS-2026-10-24-002` | NEW | Sacrifice 0.6× HP then chip-1 vs RES 100. Sacrifice skips Mirror Field and Void Mirror. |
| `LHIPS-2026-10-24-003` | NEW | Arcane Surge Frost dump. Queued `#1016`. |
| `LHIPS-2026-10-24-004` | NEW | Two-roll Surge+Overflow Frost to 1 AP. Queued `#1016`. |
| `LHIPS-2026-10-25-001` | NEW | Titans +1000 misses the player; 1–5× multiplies only outgoing chip-1. Queued `#1077`. |
| `LHIPS-2026-10-25-002` | NEW | Doka Fever +25% HP no-op on overworld spawn. Queued `#1077`. |
| `LHIPS-2026-10-25-003` | NEW | Iron Curse rook RES 100 at 59. Queued `#1077`. |
| `LHIPS-2026-10-25-004` | NEW | Hostile summon melee === player.level. Queued `#1077`. |
| `LHIPS-2026-10-25-005` | NEW | Vampiric 15% mutates a throwaway snapshot. Queued `#1077`. |
| `AQA-2026-08-30-012` | NEW | Collectors still missing. |

This file adds IDs only where a long-horizon failure was in-scope and never filed (Mirror Field 20% reflects 100% of pre-RES Frost and cancels the hit; Void Mirror family 25% of pre-RES still keys on the family string after battle-start overwrite; Time Warp 15s is the wall-clock gate on the unbounded Frost dump; Tide Shade −1 MP becomes noise vs formula MP).

---

ACTION_ID: LHIPS-2026-10-26-001  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Mirror Field 20% reflects 100% of pre-RES Frost onto the player and cancels the enemy hit; Blood Moon / Fury still raise self-damage after outgoing chip-1  
CATEGORY: technical-limits  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Registry `mirror_field` is a placeholder (`mapModifiers.ts` 271–277). Live path is the WX id-check (`WorldExploration.tsx` 2329, 9538–9562) plus `spellEngine.ts` 901–906: 20% of single-target non-AoE casts call `mirrorFieldReflect(preCritDmgBM)`, write `hp -= preCritDmgBM`, return true, and **do not enter** `applyDamageToEnemy`. `preCritDmgBM` is catalog Frost **after** upgrade / crit / Blood Moon 1.25 / Fury 1.25 and **before** SP and enemy SR×RES (`spellEngine.ts` 883–899). Skips `playerTakesDamage` (create RES 10 and Shield Charm never apply). Challenge damage is recorded (9549–9553). Sacrifice uses `dealDamage` (`spellEngine.ts` 750–760) and skips this path (10-24-002). Harness: `frostPreCritDmgBm() === 20` (SP-buffed `playerFrostRaw(0) === 21` is not what reflects); Blood Moon **25**; Blood+Fury **31**; crit **40**; expected dump self-damage **28 / 5344** at 325 / 100000 (`0.2 * 20 * 7 / 1336`). After rook RES 100 (004) the cancelled hit would have been chip-1, so a reflect is **20×** the intended chip. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** for the 20 self-damage / cancelled hit (player HP 100). **78** for 20× chip-1 after rook RES 100. Unreachable by official kill income past the mid-teens.  
CAUSE: Mirror Field was authored against pre-RES `preCritDmgBM` as a 20% self-hit that consumes the cast. Enemy RES later became a percent that saturates at 100. Blood Moon / Fury were folded onto that same pre-RES value. `playerTakesDamage` later grew RES and Shield Charm, which this write bypasses. Those authors were not sized together.  
PLAYER_EFFECT: Announced “reflections shimmer” is a 20% chance that a Frost dump damages the player for 20 (25/31/40 with Blood Moon / Fury / crit) and the pack takes nothing. After RES 100 that is 20× (or 31× / 40×) the chip-1 the enemy would have taken. Two reflects fail under-30 (08-31-011). Expected dump self-damage 5344 at 100000 vs HP 500095 — not a one-shot, but the player is the main target of their own dump.  
TECHNICAL_EFFECT: Reflect 20 / 31 / 40 are safe Numbers. `setCharacterStats` can race the HUD vs Shield Charm / death-bisect because melee Crush uses a different shield path.  
SYSTEMS_AFFECTED: `mirror_field`; `spellEngine` damage loop; `mirrorFieldReflect`; `playerTakesDamage`; Shield Charm; Blood Moon; Fury Potion; enemy RES chip-1; under-30 challenges  
RECOMMENDED_ACTION: Report only. Do not wire the registry hook, retune 20%, or fold Crush into this path here. If a human picks this ID, pick one published rule (reflect uses post-RES damage, or the hit still lands, or the announce text names a 20% self-hit) — do not start reflecting overlay AP. 10-22-002 remains the dump; 004 remains RES 100; 10-24-002 remains Sacrifice (this path skipped).  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-10-22-002 (Frost dump); LHIPS-2026-08-31-004 (RES 100); LHIPS-2026-09-25-002 (Shield Charm); LHIPS-2026-08-31-011 (under-30); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if reflect starts using post-RES chip-1 without a challenge re-check. HIGH if Sacrifice is routed through this path (0.6× HP self-hit). LOW for documentation.  
VALIDATION_REQUIRED: `frostPreCritDmgBm() === 20`; `mirrorFieldReflect(20) === 20`; live `spellEngine` still returns `"cast"` on a true reflect without `applyDamageToEnemy`; live WX still writes HP without `playerTakesDamage`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-26-002  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Void Mirror 25% of pre-RES Frost still keys on the family string after battle-start overwrite, and skips playerTakesDamage / Shield Charm while the chip-1 hit still lands  
CATEGORY: enemy-stats  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `maybeApplyEnemyFamilyVariant` (`spawnPolicy.ts` 279–286) rolls 30% then uniform among 7 families → P(`void_mirror`) **0.3/7 ≈ 4.29%**. Battle-start overwrites HP/RES/SP to linear / `computeEnemyStats` (10-22-001) but **does not clear `family`**. `applyDamageToEnemy` (`castHelpers.ts` 336–345) does `floor(preCritDmgBM * 0.25)` and `setCharacterStats` HP, then the post-SR×RES hit still lands. Skips `playerTakesDamage` and the melee Shield Charm branch (`WorldExploration.tsx` 16750–16756). `onPlayerReflectedDamage` records challenge damage. Ember Knight burn 3×3 and Tide Shade −1 MP (16805–16820) are the same surviving family string; Ember 9 vs linear HP is 09-23-001's class (not re-filed); Tide is 10-26-004. Sacrifice skips this path. Harness: `voidMirrorReflect(20) === 5`; Blood+Fury 31 → **7**; dump **10 / 35 / 6680** at 1 / 325 / 100000. First dump to exceed under-30 is **325** (7×5). After RES 100 the pack takes 1 and the player takes 5. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** for the 5 self-damage on a family roll (HP 100). **78** for 5× chip-1 after rook RES 100. **325** for a 7-Frost dump to fail under-30 without being hit by the pack. Unreachable by official kill income past the mid-teens.  
CAUSE: Void Mirror reflect was keyed on a family tag and pre-RES `preCritDmgBM`. Battle-start later wiped family **stats** but kept the string. Enemy RES later saturated at 100. `playerTakesDamage` later grew RES and Shield Charm on a different path. Those four authors were not sized together.  
PLAYER_EFFECT: ~4.3% of packs still reflect 25% of pre-RES Frost after they look like a linear-HP rook. After RES 100 the player takes 5 while the mirror takes 1. A 325-AP dump (7 Frosts) deals 35 to the player and fails Untouchable / under-30 even if Crush never connects. At 100000 the dump reflects 6680 vs HP 500095 (~1.3%) — not a one-shot.  
TECHNICAL_EFFECT: Reflect 5 / 7 / 6680 are safe Numbers. Family catalog RES 0.2 is unused in combat (10-22-001) so the reflect is the remaining identity.  
SYSTEMS_AFFECTED: `void_mirror`; `applyDamageToEnemy`; `maybeApplyEnemyFamilyVariant`; `playerTakesDamage`; Shield Charm; under-30 / Untouchable; enemy RES chip-1  
RECOMMENDED_ACTION: Report only. Do not strip `family` at battle-start, retune 25%, or route this through `playerTakesDamage` here. If a human picks this ID, pick one published rule (reflect uses post-RES damage, or battle-start clears the family tag, or the announce/catalog drops the reflect) — do not start reflecting Crush. 10-22-001 remains the stat wipe; 10-26-001 remains Mirror Field; 10-26-004 remains Tide MP.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-10-22-001 (family overwrite); LHIPS-2026-10-26-001 (same preCritDmgBM); LHIPS-2026-08-31-004 (RES 100); LHIPS-2026-08-31-011 (under-30); LHIPS-2026-09-25-002 (Shield Charm); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if `family` is cleared without a sprite/on-hit replacement. HIGH if reflect starts using post-RES chip-1 and Untouchable starts persisting on a visual-mirror pack. LOW for documentation.  
VALIDATION_REQUIRED: `voidMirrorReflect(20) === 5`; `voidMirrorFamilyChance() === 0.3/7`; `firstLevelFrostDumpSelfDamageExceeds(5, 30) === 325`; live `applyDamageToEnemy` still keys on `family === "void_mirror"` after battle-start HP overwrite. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-26-003  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Time Warp 15s is the only wall-clock gate on unbounded formula-AP Frost dumps; 100 casts need 6.7 clicks/s at 7300 and 89/s at 100000  
CATEGORY: technical-limits  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Time Warp is a no-op in the registry (`mapModifiers.ts` 220–229) and a WX timer branch: `isTimeWarp ? 15 : 30` (`WorldExploration.tsx` 14036–14038, 14778–14779; constants `MAP_MODIFIER_TIME_WARP_TIMER` / `NORMAL_TIMER` in `gameConstants.ts` 324–325). The interval fires `advanceTurn` on expiry for **player and enemy** turns (14765–14796). Starter Frost cooldown is 0 (10-22-002). Formula AP is `8 + floor(L/25)` (09-01-003). Harness: un-surged casts **7 / 100 / 1336** at 325 / 7300 / 100000 → **0.47 / 6.67 / 89.07** casts per warp-second. Two-roll Surge+Overflow (10-24-004) is **4008** casts at 100000 → **267/s**. Enemy AI is one action (10-21-001) so the halved timer does not change enemy throughput. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **325** for formula AP to exceed persist 20 (7 casts in 15s is still clickable). **7300** for 100 casts in 15s (6.7/s). **100000** for 89/s un-surged and 267/s stacked. Unreachable by official kill income past the mid-teens.  
CAUSE: Time Warp was authored as “halve the 30s turn clock.” Battle AP later used the uncapped formula and Frost later had cooldown 0. No pairing of the wall-clock to a max casts-per-turn.  
PLAYER_EFFECT: The modifier advertised as a faster clock is the only real-time cap on the dump. Without it the 30s timer is the same class of cap. Humans cannot fire 100 Frosts in 15s, so Time Warp silently truncates the theoretical dump rather than changing combat math. Enemies still act once.  
TECHNICAL_EFFECT: 1336 sequential `applyDamageToEnemy` calls in one player turn would be a main-thread stall if a future auto-cast ever filled the dump; the live click loop cannot. Timer generation ref already guards stale intervals.  
SYSTEMS_AFFECTED: `time_warp`; turn timer; formula AP Frost dump; Arcane Surge / Overflow stacked dump  
RECOMMENDED_ACTION: Report only. Do not retune 15s, add a cast cap, or change Frost cooldown here. If a human picks this ID, pick one published rule (timer is flavor and dump is click-limited, or AP dumps are capped independently of the clock) — do not start giving enemies overlay-AP extra actions to “match” 15s. 10-22-002 remains the dump; 10-24-004 remains the stacked cost-1 dump.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-10-22-002 (Frost dump); LHIPS-2026-10-24-004 (stacked dump); LHIPS-2026-09-01-003 (formula AP vs persist 20); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if the timer is removed and an auto-cast fills formula AP. LOW for documentation.  
VALIDATION_REQUIRED: `TIME_WARP_TIMER_SECONDS === 15`; `playerFrostCastsPerTurn(formulaAp(7300)) === 100`; live WX still uses `isTimeWarp ? 15 : 30`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-26-004  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Tide Shade −1 MP for 2 turns still keys on the family string after battle-start overwrite, and falls under 5% of formula MP from 425  
CATEGORY: enemy-stats  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: After a fallback melee, `enemy?.family === "tide_shade"` applies `{stat:"mp", modifier:-1, duration:2}` (`WorldExploration.tsx` 16805–16820). `getStatModifier` treats MP as additive (`statusEffects.ts` 31–33, 55–56). Formula MP is `4 + floor(L/25)` (09-28-003). Family stats are wiped at battle-start (10-22-001) but the **string** remains, same as Void Mirror (10-26-002). Harness: −1 / MP = **0.25** at 1 (MP 4); **&lt; 0.05** from **425** (MP 21); **0.00025** at 100000 (MP 4004). Overlay enemy MP is `floor(level/2)` (10-21-001) and is not what this debuff reads — it debuffs the player. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** for −1 of 4 MP (25%, still coherent). **425** for the debuff to drop under 5% of formula MP. Unreachable by official kill income past the mid-teens.  
CAUSE: Tide Shade on-hit was authored as −1 MP when player MP was a small persist integer. Formula MP later grew with level. Battle-start later wiped family **stats** but kept the tag that fires the debuff. Those three authors were not sized together.  
PLAYER_EFFECT: ~4.3% of packs (30%/7) can still apply Tide after they look like a linear-HP pawn. Early on it is a real −25% MP. From 425 it is flavor. At 100000 it is one tile in a 4004-MP pool. Family combat identity is then the name and this no-op.  
TECHNICAL_EFFECT: −1 is a safe Number. Additive MP cannot floor movement to 0 by itself once formula MP ≥ 2.  
SYSTEMS_AFFECTED: `tide_shade`; melee on-hit; `getStatModifier` MP; formula MP; family variant roll  
RECOMMENDED_ACTION: Report only. Do not scale the −1 with formula MP, strip `family`, or retune formula MP here. If a human picks this ID, pick one published rule (Tide is a percent of current MP, or battle-start clears on-hit tags with the stats) — do not start subtracting overlay enemy MP from the player. 10-22-001 remains the stat wipe; 10-26-002 remains Void Mirror on the same string; 09-28-003 remains the MP-vs-grid slope.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-10-22-001 (family overwrite); LHIPS-2026-10-26-002 (same family string); LHIPS-2026-09-28-003 (formula MP); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if Tide becomes `floor(MP * 0.25)` without a TTK / walk-budget re-sim. LOW for documentation.  
VALIDATION_REQUIRED: `tideShadeMpDebuffOverFormulaMp(1) === 0.25`; `firstLevelTideShadeDebuffBelowMpPercent(0.05) === 425`; live melee still keys on `family === "tide_shade"` after battle-start HP overwrite. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  
