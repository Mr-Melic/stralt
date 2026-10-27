# ACTION_IDs — 2026-10-27 Long-Horizon Infinite Progression Simulator

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Long-Horizon Infinite Progression Simulator.  
Narrative: [`LONG_HORIZON_2026-10-27.md`](./LONG_HORIZON_2026-10-27.md).  
Harness: `src/frontend/src/utils/longHorizonSim.ts`.

Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **observation only** — no curve redesign.

HEAD inspected: `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` / `#777` / `#819` / `#898` / `#960` / `#1016` / `#1077` / `#1141` inspected). Stress includes 10000 / 50000 / 100000. Harness **unions** `#1141` rather than overwriting those files. This branch restacks onto `#1141` so oldest-first merge-tree stays clean.

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
| `LHIPS-2026-09-21-001` | NEW | Frozen create INIT 10 vs scaling enemy INIT. Chaos Initiative is the remaining lottery (10-27-002). Queued `#357`. |
| `LHIPS-2026-09-21-002` | NEW | Enemy CHC saturates at 100 from bishop 115. |
| `LHIPS-2026-09-22-001` | NEW | Unenraged fallback Crush one-shots. Paper Windstorm cannot miss it (10-27-001). Starter Shield does not apply (10-27-003). Queued `#407`. |
| `LHIPS-2026-09-23-001` | NEW | Flat lava/spikes/poison vs linear HP. Queued `#475`. Ember burn 9 is the same class (not re-filed). |
| `LHIPS-2026-09-23-002` | NEW | `maxSpellRange` 5 homogenizes starter ranges by 40. Advertised Paper Windstorm 50% range is unused (10-27-001). Queued `#475`. |
| `LHIPS-2026-09-24-001` | NEW | Flat Blood Mend 12 vs linear HP. Mending Mist 5% does not commit (10-24-001). |
| `LHIPS-2026-09-24-002` | NEW | Spell-fail hits 0 at 201. Queued `#530`. |
| `LHIPS-2026-09-25-001` | NEW | Betrayal enrage 6× Crush. Queued `#560`. |
| `LHIPS-2026-09-25-002` | NEW | Shield Charm 20; potion Doka 50/120 forever. Starter Shield RES buff is a different skip (10-27-003). |
| `LHIPS-2026-09-26-001` | NEW | Kit Strike/Frost stay catalog-flat vs Crush. |
| `LHIPS-2026-09-26-002` | NEW | Idle +1 HP / 10s vs linear maxHp. Queued `#637`. |
| `LHIPS-2026-09-27-001` | NEW | Player Frost vs 999-capped packs. Titans/Glass multiply chip-1 after RES (10-25-001). Paper Windstorm drops 30% of the dump (10-27-001). |
| `LHIPS-2026-09-27-002` | NEW | Catalog summon HP vs Crush. Queued `#670`. |
| `LHIPS-2026-09-27-003` | NEW | Shrine 300 vs ground `5+2L`. Queued `#670`. |
| `LHIPS-2026-09-28-001` | NEW | Boss Rush `player+2` ignores 999 cap. Queued `#748`. |
| `LHIPS-2026-09-28-002` | NEW | Catalog room Doka unused vs `1.5L` persist. Queued `#748`. |
| `LHIPS-2026-09-28-003` | NEW | Formula MP vs 16×16 grid at 300. Slime+Frozen 4× moves that to 1500 (10-27-004). |
| `LHIPS-2026-09-29-001` | NEW | Catalog world-boss HP frozen while `computeEnemyStats(player+5)` rolls RES/CHC. |
| `LHIPS-2026-09-29-002` | NEW | Shop 3 HP/Doka vs potion % and 100k ceiling. Queued `#777`. |
| `LHIPS-2026-10-21-001` | NEW | Initiative overlay AP = level + hardcoded RES 0 / CHC 2. Queued `#819`. |
| `LHIPS-2026-10-21-002` | NEW | Create evasion / resilience / SR never enter combat. Queued `#819`. |
| `LHIPS-2026-10-22-001` | NEW | Family 30% combat identity wiped at battle-start. Family **string** still drives Void Mirror / Tide / Ember (10-26-002 / 004). |
| `LHIPS-2026-10-22-002` | NEW | Zero-CD Frost × unbounded battle AP. Time Warp 15s is the wall-clock gate (10-26-003). Paper Windstorm is the miss tax (10-27-001). |
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
| `LHIPS-2026-10-26-001` | NEW | Mirror Field 20% pre-RES self-hit + cancel. Queued `#1141`. |
| `LHIPS-2026-10-26-002` | NEW | Void Mirror family 25% after stat wipe. Queued `#1141`. |
| `LHIPS-2026-10-26-003` | NEW | Time Warp 15s vs Frost dump. Queued `#1141`. |
| `LHIPS-2026-10-26-004` | NEW | Tide Shade −1 MP vs formula MP. Queued `#1141`. |
| `AQA-2026-08-30-012` | NEW | Collectors still missing. |

This file adds IDs only where a long-horizon failure was in-scope and never filed (Paper Windstorm 30% player / 50% enemy-ranged miss while Crush range 1 never misses and advertised 50% range is unused; Chaos Initiative is the only remaining first-turn lottery after INIT freeze and shuffles after dispatch; starter-shield 1.3× RES is skipped on Crush melee; Slime+Frozen stack 4× walk MP and move 16-grid saturation from 300 to 1500).

---

ACTION_ID: LHIPS-2026-10-27-001  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Paper Windstorm is a 30% player / 50% enemy-ranged miss tax, not the advertised 50% range cut; Crush range 1 never misses  
CATEGORY: technical-limits  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Registry `paper_windstorm` is a no-op marker whose announce text is “ranged spell reach halved” (`mapModifiers.ts` 249–257). `MAP_MODIFIER_PAPER_WINDSTORM_RANGE_REDUCTION = 0.5` (`gameConstants.ts` 328) is never read by targeting — `rg` finds no combat consumer. Live WX is miss chance: player `paperWindstormMiss` is `Math.random() * 100 < 30` on every `spellEngine` damage loop (`WorldExploration.tsx` 9563–9572; `spellEngine.ts` 909–914), including melee-range Strike. Enemy kit-cast and fallback Fire Bolt miss when `range > 1 && Math.random() < 0.5` (16491–16495, 16729–16732). Fallback Crush `{range: 1, damage: 12}` (16710–16712) never enters that roll. Harness: `paperWindstormEnemyMissChance(1) === 0`, `(3) === 0.5`; expected dump hits **4.9 / 935.2** at 325 / 100000 (`7 * 0.7` / `1336 * 0.7`); stacked Surge+Overflow **2805.6** of 4008. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** for the 30% player miss and Crush immunity (independent of level). **325** for formula-AP dump (7 casts → 2.1 expected misses). **100000** for 400.8 expected misses on the un-surged dump. Unreachable by official kill income past the mid-teens.  
CAUSE: The modifier was authored as a 50% range cut. Live WX grew two miss rolls (30% player, 50% enemy if range > 1) instead. Crush was later the scaled one-shot (09-22-001) with range 1. Range cap 5 (09-23-002) would have been the thing a 50% cut homogenized; that constant was never wired. Those authors were not sized together.  
PLAYER_EFFECT: Announced “reach halved” is a 30% tax on the player Frost dump and a 50% tax on enemy Fire Bolt / kit spells. Crush — the hit that one-shots from enemy 52 (09-22-001) — always connects. After RES 100 the dump already chips 1; Windstorm throws away 30% of those chips. Time Warp (10-26-003) still caps clicks; Windstorm independently drops the ones that land.  
TECHNICAL_EFFECT: Expected 935.2 / 400.8 hit/miss at 100000 are safe Numbers. `PAPER_WINDSTORM_RANGE_REDUCTION_APPLIED === false`. Player Strike (range 1) still rolls the 30% miss; enemy Strike / Crush do not.  
SYSTEMS_AFFECTED: `paper_windstorm`; `spellEngine` damage loop; enemy kit-cast; fallback Crush / Fire Bolt; formula-AP Frost dump; `maxSpellRange`  
RECOMMENDED_ACTION: Report only. Do not wire the 0.5 range constant, retune 30%/50%, or make Crush miss here. If a human picks this ID, pick one published rule (range is halved as announced, or the announce text names a miss chance, and whether Crush can miss) — do not start missing overlay-AP Crush. 10-22-002 remains the dump; 09-22-001 remains the one-shot; 10-26-003 remains the 15s clock.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-10-22-002 (Frost dump); LHIPS-2026-09-22-001 (Crush); LHIPS-2026-09-23-002 (range cap); LHIPS-2026-10-26-003 (Time Warp); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if Crush starts rolling the 50% miss without a TTK re-sim. HIGH if player miss is removed while Mirror Field 20% self-hit (10-26-001) stays. LOW for documentation.  
VALIDATION_REQUIRED: `paperWindstormEnemyMissChance(1) === 0`; `paperWindstormEnemyMissChance(3) === 0.5`; `PAPER_WINDSTORM_RANGE_REDUCTION_APPLIED === false`; live `paperWindstormMiss` still uses 30; live Crush `{range:1}` still skips the 50% roll. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-27-002  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Chaos Initiative is the only remaining player-first lottery after INIT freeze, and it shuffles the strip after dispatching prevOrder[0]  
CATEGORY: ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Battle start sorts `[player, ...enemies]` by `b.initiative - a.initiative` (`WorldExploration.tsx` 11987–11989). Player INIT is frozen at create 10 (09-21-001). `monteCarloPlayerWinsInitiative(250)` is &lt; 0.02 (usually 0 across 4000 rolls). Chaos Initiative Fisher-Yates-shuffles non-summon owners (`mapModifiers.ts` 435–466). WX applies it when `currentTurnIndexRef.current === 0` **after** `setCurrentTurnIndex` has already dispatched `prevOrder[nextIdx]` (14717–14721). The acting combatant is the pre-shuffle index-0 row; the strip then shows a different order. P(player first | chaos) = `1 / livingOwners`: **0.25** on a 3-pack, **1/9** on an 8-pack. Summons trail their owner so they do not get an extra slot. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** for the strip/dispatch desync (any INIT order). **15** for INIT P(player first) already ~5% (09-21-001). **250** for INIT first ≈ 0, so Chaos is the only remaining lottery. Unreachable by official kill income past the mid-teens.  
CAUSE: Turn order was INIT-sorted with a frozen player INIT of 10. Chaos Initiative was later added as a round shuffle. The wrap-to-0 apply site was written under the comment that idx 0 is a live player terminator; INIT sort already puts the player last from the mid-teens, and the shuffle then runs after that slot has been dispatched. Those three authors were not sized together.  
PLAYER_EFFECT: After INIT freeze, the player always acts last unless this modifier is up. With it up they get a 25% (3-pack) / 11% (8-pack) chance to be first **on the next round’s strip**, but the current wrap still belongs to whoever was INIT-first. The announce text “turn order reshuffles each round” is true of the strip, not of the turn that just started.  
TECHNICAL_EFFECT: Fisher-Yates uses `Math.random` (not the seeded combat rng). Shuffle-after-dispatch can show a different actor at index 0 than `advanceTurn` already entered. The wrap-fix “player is always live at idx 0” is false after a shuffle that places the player elsewhere — a dead-entity skip could then wrap past the player.  
SYSTEMS_AFFECTED: `chaos_initiative`; `applyTurnOrderSort`; battle-start INIT sort; `advanceTurn` wrap; frozen create INIT  
RECOMMENDED_ACTION: Report only. Do not scale player INIT, move the shuffle before dispatch, or force player to idx 0 here. If a human picks this ID, pick one published rule (shuffle before the wrap dispatches, or Chaos is flavor and INIT remains the order) — do not start giving enemies overlay-AP extra actions to “match” a shuffle. 09-21-001 remains the INIT freeze.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-09-21-001 (INIT freeze); LHIPS-2026-10-21-001 (overlay AP still one action); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if the shuffle moves before dispatch without a skip-loop re-check (player-not-at-0). HIGH if player INIT starts scaling without a Crush TTK re-sim (player going first vs one-shot). LOW for documentation.  
VALIDATION_REQUIRED: `chaosInitiativePlayerFirstChance(4) === 0.25`; live `applyTurnOrderSort` still runs only when `currentTurnIndexRef === 0`; battle start still sorts by INIT descending. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-27-003  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Starter Shield 1.3× RES never applies to Crush melee; the one-shot path reads create RES 10 once and skips playerTakesDamage  
CATEGORY: enemy-stats  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `starter-shield` is `buffStat: "res", buffModifier: 1.3, buffDuration: 3` (`spellData.ts` 31–43). `getStatModifier` would multiply RES (`statusEffects.ts` 45–62) inside `playerTakesDamage` (`WorldExploration.tsx` 3429–3432). Fallback Crush melee does **not** call `playerTakesDamage` (comment 16774–16776): it reads `characterStats.res` once (16722–16728) and writes HP via `setCharacterStats`. Shield Charm absorb 20 still runs on that path (16750–16761; 09-25-002). Create RES is 10 and `saveBattleStats` cannot raise it. Harness: `starterShieldResMultiplier() === 1.3`; `crushMeleeResIfShieldApplied() === 13`; `CRUSH_MELEE_USES_GET_STAT_MODIFIER === false`. First unenraged Crush one-shot of player 1 is still enemy **52** (09-22-001 two-pass helper; live melee is one-pass and slightly harsher). Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** for the skip (Shield is owned at create — 008). **52** for Crush one-shoting player 1 regardless of the buff. Unreachable by official kill income past the mid-teens.  
CAUSE: Starter Shield was authored as a RES multiplier on the `playerTakesDamage` path. Fallback melee was later a direct HP write so Shield Charm absorb and death-bisect could run synchronously. Create RES stayed 10. Crush later scaled with `12 * max(1, L/5)`. The buff never joined the path that actually one-shots.  
PLAYER_EFFECT: The starter that advertises “+30% RES for 3 turns” does nothing against Crush, which is the hit that ends the fight. It can still cut kit Frost / Strike / DoTs that go through `playerTakesDamage` (18 instead of 20 on catalog Frost). After enemy RES 100 the player dump chips 1; the enemy one-shot is unmodified.  
TECHNICAL_EFFECT: 13 vs 10 is a safe Number. Two-pass helper in the 09-22 harness still uses create 10 twice; live melee is one-pass create 10. Neither path reads 1.3.  
SYSTEMS_AFFECTED: `starter-shield`; fallback Crush melee; `playerTakesDamage`; Shield Charm; create RES 10  
RECOMMENDED_ACTION: Report only. Do not route Crush through `playerTakesDamage`, start multiplying melee RES by Shield, or retune Crush here. If a human picks this ID, pick one published rule (Shield applies to Crush, or the description names spell/DoT RES only) — do not start scaling create RES with level as a silent side effect. 09-22-001 remains the one-shot; 09-25-002 remains Charm absorb 20; 008 remains all 32 starters owned.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-09-22-001 (Crush); LHIPS-2026-09-25-002 (Charm absorb); LHIPS-2026-08-31-008 (all starters owned); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if Crush starts using `playerTakesDamage` without a double-RES / death-bisect re-check. HIGH if Shield 1.3 is folded onto create 10 without a one-shot table re-sim. LOW for documentation.  
VALIDATION_REQUIRED: `starterShieldResMultiplier() === 1.3`; `crushMeleeResIfShieldApplied() === 13`; live fallback melee still reads `characterStats.res` and skips `playerTakesDamage`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-27-004  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Slime Flood + Frozen Terrain stack to 4 MP per tile; 16-grid saturation moves from 300 to 1500, then the extra cost is noise vs formula MP  
CATEGORY: technical-limits  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Each of `slime_flood` / `frozen_terrain` doubles walk MP (`mapModifiers.ts` 155–172; `enemyWalkCostPerTile` / `mapModifierRegistry.applyMpCost`). They stack: 1 → 2 → **4** (`mapModifiers.cost.test.ts`; harness `walkCostPerTile({slimeFlood:true, frozenTerrain:true}) === 4`). 09-28-003: formula MP `4 + floor(L/25)` covers a 16-tile grid walk at **300** (MP 16). Doubled cost needs MP 32 → **700**. Stacked 4× needs MP 64 → **1500**. At 1, 4 MP buys **1** tile under the stack (entire budget). At 100000, MP 4004 / 4 = 1001 tiles; stacked cost / MP = **0.001**. Tide Shade −1 MP (10-26-004) is a different family string; this is the walk-cost pair. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** for 4 MP = 1 stacked tile (harsh). **300** for unbuffed full-grid walks. **700** for doubled full-grid. **1500** for stacked full-grid, after which the modifier is flavor. Unreachable by official kill income past the mid-teens.  
CAUSE: Slime and Frozen were authored as independent 2× walk costs when MP was a small persist integer. Formula MP later grew with level and was shown to saturate the 16-grid at 300. The two 2× hooks were not paired with that slope, and they multiply when both roll.  
PLAYER_EFFECT: Early on, a dual roll is a one-tile turn. Past 1500 it does not change whether the player can cross the map. Enemy AI uses the same `enemyWalkCostPerTile`, so packs are also slow early and unrestricted late. Overlay enemy MP `floor(level/2)` (10-21-001) is not this budget — battle restore uses formula MP.  
TECHNICAL_EFFECT: 4, 16, 32, 64, 1500 are safe Numbers. Two-roll trigger can pair both modifiers (`MAP_MODIFIER_SECOND_CHANCE` 50).  
SYSTEMS_AFFECTED: `slime_flood`; `frozen_terrain`; `applyMpCost`; `enemyWalkCostPerTile`; formula MP; 16×16 grid  
RECOMMENDED_ACTION: Report only. Do not unstack the 2× hooks, retune formula MP, or change grid size here. If a human picks this ID, pick one published rule (the two floods do not stack, or stacked 4× is intended and the announce text names it) — do not start charging overlay enemy MP. 09-28-003 remains the unbuffed 300 breakpoint; 10-26-004 remains Tide −1.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-09-28-003 (MP vs grid); LHIPS-2026-10-26-004 (Tide −1 MP); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if the 2× hooks stop stacking without an AI walk-budget re-check. LOW for documentation.  
VALIDATION_REQUIRED: `walkCostPerTile({slimeFlood:true, frozenTerrain:true}) === 4`; `firstLevelFormulaMpCoversGridWalk({}) === 300`; doubled === 700; stacked === 1500; `formulaMp(1500) === 64`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  
