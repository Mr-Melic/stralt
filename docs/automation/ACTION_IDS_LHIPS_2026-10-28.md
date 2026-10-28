# ACTION_IDs — 2026-10-28 Long-Horizon Infinite Progression Simulator

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Long-Horizon Infinite Progression Simulator.  
Narrative: [`LONG_HORIZON_2026-10-28.md`](./LONG_HORIZON_2026-10-28.md).  
Harness: `src/frontend/src/utils/longHorizonSim.ts`.

Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **observation only** — no curve redesign.

HEAD inspected: `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` / `#777` / `#819` / `#898` / `#960` / `#1016` / `#1077` / `#1141` / `#1197` inspected). Stress includes 10000 / 50000 / 100000. Harness **unions** `#1197` rather than overwriting those files. This branch restacks onto `#1197` so oldest-first merge-tree stays clean.

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
| `LHIPS-2026-08-31-011` | NEW | Challenge under-30 / under-50 fail on one hit at 14 / 24. Thorn walk of 7 tiles also deals 30 at 75 (10-28-001). |
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
| `LHIPS-2026-09-23-001` | NEW | Flat lava/spikes/poison vs linear HP. Thorn is a walk-path cousin (10-28-001). Queued `#475`. |
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
| `LHIPS-2026-09-28-003` | NEW | Formula MP vs 16×16 grid at 300. Slime+Frozen 4× moves that to 1500 (10-27-004). Enemy step budget 3 does not (10-28-002). |
| `LHIPS-2026-09-29-001` | NEW | Catalog world-boss HP frozen while `computeEnemyStats(player+5)` rolls RES/CHC. |
| `LHIPS-2026-09-29-002` | NEW | Shop 3 HP/Doka vs potion % and 100k ceiling. Queued `#777`. |
| `LHIPS-2026-10-21-001` | NEW | Initiative overlay AP = level + hardcoded RES 0 / CHC 2. Queued `#819`. |
| `LHIPS-2026-10-21-002` | NEW | Create evasion / resilience / SR never enter combat. Queued `#819`. |
| `LHIPS-2026-10-22-001` | NEW | Family 30% combat identity wiped at battle-start. Family **string** still drives Void Mirror / Tide / Ember (10-26). Four other families have no string hook (10-28-005). |
| `LHIPS-2026-10-22-002` | NEW | Zero-CD Frost × unbounded battle AP. Time Warp 15s is the wall-clock gate (10-26-003). Paper Windstorm is the miss tax (10-27-001). |
| `LHIPS-2026-10-22-003` | NEW | Dungeon +30 after the 999-cap pick. Queued `#898`. |
| `LHIPS-2026-10-23-001` | NEW | Timestep restores formula AP. Queued `#960`. |
| `LHIPS-2026-10-23-002` | NEW | Player summons have no cap. Queued `#960`. |
| `LHIPS-2026-10-23-003` | NEW | Summon INIT/RES use player level + king fallback. Melee uses the same level (10-25-004). |
| `LHIPS-2026-10-24-001` | NEW | Mending Mist 5% never commits. Same combatantsRef miss as Titans HP (10-25-001) and Swift Winds (10-28-003). |
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
| `LHIPS-2026-10-27-001` | NEW | Paper Windstorm miss vs advertised range + Crush immunity. Queued `#1197`. |
| `LHIPS-2026-10-27-002` | NEW | Chaos Initiative vs INIT freeze + shuffle-after-dispatch. Queued `#1197`. |
| `LHIPS-2026-10-27-003` | NEW | Starter Shield skipped on Crush melee. Queued `#1197`. |
| `LHIPS-2026-10-27-004` | NEW | Slime+Frozen 4× walk MP vs formula MP. Enemy step budget is 10-28-002. Queued `#1197`. |
| `AQA-2026-08-30-012` | NEW | Collectors still missing. |

This file adds IDs only where a long-horizon failure was in-scope and never filed (Thorned Ground player-only walk tax vs grid-capped 145; AI `ENEMY_REACHABLE_STEP_BUDGET` 3 vs stacked cost 4 → 0 tiles; Swift Winds +2 never reaches `currentBattleMp` or the AI budget; Gravity Well / Fog of War occupy 2/22 trigger slots with empty hooks; four of seven family variants have no string combat identity after the 10-22 wipe).

---

ACTION_ID: LHIPS-2026-10-28-001  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Thorned Ground is a player-only (pathLength−1)×5 walk tax; it equals under-30 at formula MP 7 / level 75, then grid-caps at 145 vs linear HP  
CATEGORY: enemy-stats  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Live walk is `thornedGroundWalkDamage` (`battleSetup.ts` 295–300): `(pathLength - 1) * 5` when `pathLength > 1`. Mouse and touch both call `applyBattleWalkHazards` (`WorldExploration.tsx` 9906–9928, 10553, 11137) which subtracts from `characterStats.hp` and records challenge damage. Registry `thorned_ground.onDamageDealt` uses a different threshold (`pathLength > 2` → `(n-2)*5`, `mapModifiers.ts` 175–189) and is not the walk path — at 7 tiles live is **30**, registry would be **25**. Enemy `computeReachable` never calls the walk helper (`enemyTakesThorn === false`). Under-30 / under-50: 7 tiles = 30 HP, 11 tiles = 50 HP. Formula MP `4 + floor(L/25)` first covers 7 tiles at **75**, 11 at **175**. At 1, a full-MP walk of 4 tiles deals **15**. Grid Manhattan diameter 30 caps live thorn at **145** (31% of HP 470 at 75; **0.029%** of HP 500095 at 100000). 08-31-011 is the melee one-shot of those challenges at 14 / 24; this is a self-walk path that first matches 30 at 75. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** for 15 HP on a full-MP walk (and for the player-only split). **75** for a full-MP walk dealing 30 (under-30 fail). **175** for 50 (under-50). **300** for a 16-tile spawn-to-edge walk at 75 HP vs HP 1595. Past that the grid cap 145 is noise vs linear HP. Unreachable by official kill income past the mid-teens.  
CAUSE: Thorned Ground was authored as a far-walk tax when MP was a small persist integer. Formula MP later grew every 25 levels and was shown to saturate the 16-grid at 300 (09-28-003). The live helper charges the player; AI walk never joined. The registry hook kept a different threshold (`> 2`) and is unused for walk. Challenge under-30/50 (011) were sized against spawn melee, not this self-damage. Those authors were not sized together.  
PLAYER_EFFECT: On Thorned Ground the player pays 5 HP per extra tile; packs do not. A careful 1-tile step is free. Spending the whole MP bar at 75 fails an under-30 challenge without being hit. At 100000 the same grid walk is 145 of 500095 HP — flavor. Enemies path for free, so the modifier is a player tax, not a shared hazard.  
TECHNICAL_EFFECT: 5, 30, 50, 75, 145 are safe Numbers. Two formulas exist (live `(n-1)*5` vs registry `(n-2)*5`). Challenge recording uses the live helper so Untouchable / under-damage see the walk. Uncapped `formulaMp / cost` at 100000 is 4004 tiles; the 16-grid caps the actual path at 30.  
SYSTEMS_AFFECTED: `thorned_ground`; `thornedGroundWalkDamage`; `applyBattleWalkHazards`; challenge walk-hazard recording; formula MP; 16×16 grid; under-30 / under-50  
RECOMMENDED_ACTION: Report only. Do not retune 5 HP/tile, apply thorns to AI, or change under-30 here. If a human picks this ID, pick one published rule (player-only is intended and the announce text names it, or both sides pay, and one threshold) — do not start scaling thorn with linear HP as a silent side effect. 08-31-011 remains the melee one-shot; 09-23-001 remains lava/spikes; 09-28-003 remains MP vs grid.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-011 (under-30/50 melee); LHIPS-2026-09-23-001 (flat hazards); LHIPS-2026-09-28-003 (MP vs grid); LHIPS-2026-10-27-004 (Slime+Frozen cost); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if AI starts taking thorn without a TTK re-sim (packs walking 3 tiles × 5). HIGH if the registry hook is wired onto spell damage using `target.pathLength`. LOW for documentation.  
VALIDATION_REQUIRED: `thornedWalkDamage(7) === 30`; `thornedRegistryHookDamage(7) === 25`; `firstLevelFormulaMpCoversThornWalk(30) === 75`; `THORNED_WALK_GRID_MAX_DAMAGE === 145`; live mouse/touch still call `applyBattleWalkHazards`; enemy `computeReachable` still has no thorn debit. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-28-002  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Enemy walk BFS is capped at 3 steps; Slime+Frozen cost 4 yields 0 tiles at every level while formula MP scales to 1001 stacked tiles  
CATEGORY: ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `computeReachable` adds `enemyWalkCostPerTile` per step and stops when `nextSteps > ENEMY_REACHABLE_STEP_BUDGET` (`enemyAI.ts` 365–378). Budget is the constant **3** (`gameConstants.ts` 166) — not formula MP, not overlay `floor(level/2)`, not `combatant.mp`. Cost is 1 / 2 / **4** (plain / Slime-or-Frozen / both). Tiles in budget: **3 / 1 / 1 / 0**. 10-27-004 measured the player 4× cost vs formula MP (breakpoints 300 / 700 / 1500) and wrote that packs become “unrestricted late”; the AI budget never grows, so stacked 4× is **0 tiles at level 1 and at 100000**. Player stacked tiles: **1** at 1 (MP 4), **16** at 1500 (MP 64), **1001** at 100000 (MP 4004). LoS reposition budget is 2 (`AI_LOS_REPOSITION_STEP_BUDGET`) and is also 0 under cost 4. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** for stacked 0-walk and for Slime-or-Frozen 1-tile packs. The asymmetry vs the player then grows at 300 / 700 / 1500 / 100000. Unreachable by official kill income past the mid-teens.  
CAUSE: Enemy BFS used a hardcoded `ns > 3` cutoff when MP was a small persist integer. Slime and Frozen later each doubled walk cost and stack. Formula MP later grew with level (09-28-003 / 10-27-004) and is what the player restores. The AI budget was never paired with that slope or with the 4× stack.  
PLAYER_EFFECT: On a dual Slime+Frozen roll, packs stand still while the player can still take one stacked tile at 1 and a full 16-grid at 1500. On a single flood, packs walk 1 tile forever; the player walks `floor(MP/2)`, which is 2 at 1 and 2002 at 100000. Crush (09-22-001) still one-shots if the pack is already adjacent. Advanced AI (erratic / betrayal) saturates by 901 (006) but cannot spend those tiers on movement the budget forbids.  
TECHNICAL_EFFECT: 0, 1, 3, 1001 are safe Numbers. Empty reachable set still lets melee fire from the origin tile (`canReach` uses budget+1 at `enemyAI.ts` 1196). Overlay AP = level (10-21-001) is a different display; it does not feed this BFS.  
SYSTEMS_AFFECTED: `computeReachable`; `ENEMY_REACHABLE_STEP_BUDGET`; `enemyWalkCostPerTile`; `slime_flood`; `frozen_terrain`; formula MP; LoS reposition  
RECOMMENDED_ACTION: Report only. Do not raise the step budget, unstack the 2× hooks, or charge overlay MP here. If a human picks this ID, pick one published rule (AI walk uses formula/catalog MP, or the budget is 3 and the announce text names a 0-step dual flood) — do not start giving overlay-AP extra steps. 10-27-004 remains the player 4× cost; 09-28-003 remains unbuffed 300.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-10-27-004 (player 4× cost); LHIPS-2026-09-28-003 (MP vs grid); LHIPS-2026-10-21-001 (overlay AP ≠ this budget); LHIPS-2026-08-31-006 (AI tier sat); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if the budget becomes formula MP without a 16-grid / Crush-adjacent re-sim (packs walking 4004 tiles). LOW for documentation.  
VALIDATION_REQUIRED: `enemyWalkTilesInBudget({}) === 3`; slime === 1; stacked === 0; `ENEMY_WALK_STEP_BUDGET_SIM === 3`; live `nextSteps > ENEMY_REACHABLE_STEP_BUDGET` still gates BFS. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-28-003  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Swift Winds advertised +2 MP never reaches currentBattleMp or the AI step budget  
CATEGORY: technical-limits  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Registry announce is “+2 MP each turn” (`mapModifiers.ts` 368–376). `onTurnStart` does `combatant.mp += 2`. Player turn-start calls `applyTurnStart` only if `playerTurnStartModifierTarget(combatantsRef)` finds `id === "player"` (`WorldExploration.tsx` 14262–14273; `battleSetup.ts` 364–368). Player is not in `combatantsRef` (`BATTLE_START_PLAYER_IN_COMBATANTS_REF === false`; same miss as Mending Mist 10-24-001 and Titans HP 10-25-001). Even if that target existed, the next block **overwrites** `currentBattleMp` from `getPlayerBaseStats` + `getStatModifier` (`WorldExploration.tsx` 14357–14365), which does not read `combatant.mp`. Enemy AI walk uses `ENEMY_REACHABLE_STEP_BUDGET` (10-28-002), not `combatant.mp`. Swift Boots the **item** does `setCurrentBattleMp(prev + 2)` (`WorldExploration.tsx` 3579–3581) — that is a different path. Advertised +2 is 50% of formula MP 4 at 1 and **0.05%** of MP 4004 at 100000 even if it applied. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** for the no-op (the modifier can roll on any map). The advertised +2 would have been 50% of MP at 1 and flavor by 100000. Unreachable by official kill income past the mid-teens.  
CAUSE: Swift Winds was authored as `combatant.mp += 2` on the turn-start modifier target. Player MP then moved to `currentBattleMp` restored from the progression formula. Player was removed from `combatantsRef` so plague/void would not tick the first enemy. AI walk never read `combatant.mp`. The +2 hook was not rewired to any of those three stores.  
PLAYER_EFFECT: Announced “+2 MP each turn” does nothing. Tide Shade −1 (10-26-004) still applies via the family string / `getStatModifier`. Haste +2 as a buff spell still feeds `getStatModifier`. The map modifier is flavor. At extreme MP the missing +2 would not have changed 16-grid coverage anyway (09-28-003).  
TECHNICAL_EFFECT: The hook mutates a throwaway `mp` field on the turn-order entry. `SWIFT_WINDS_REACHES_CURRENT_BATTLE_MP === false`. `SWIFT_WINDS_CHANGES_ENEMY_STEP_BUDGET === false`. Distinct from Mist/Titans: fixing `combatantsRef` membership alone would still lose the +2 on the formula overwrite.  
SYSTEMS_AFFECTED: `swift_winds`; `applyTurnStart`; `playerTurnStartModifierTarget`; `currentBattleMp`; `ENEMY_REACHABLE_STEP_BUDGET`; formula MP  
RECOMMENDED_ACTION: Report only. Do not add +2 onto `currentBattleMp`, raise the AI budget, or retune formula MP here. If a human picks this ID, pick one published rule (Swift Winds is flavor, or it is a `getStatModifier` mp buff like Haste) — do not start stacking it with Tide −1 without a walk-budget re-sim. 10-24-001 remains Mist; 10-25-001 remains Titans HP; 10-26-004 remains Tide −1; 10-28-002 remains the AI budget.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-10-24-001 (combatantsRef miss); LHIPS-2026-10-25-001 (Titans same miss); LHIPS-2026-10-26-004 (Tide −1 does apply); LHIPS-2026-10-28-002 (AI budget); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if +2 is folded onto formula restore without a 16-grid / thorn (10-28-001) re-sim. LOW for documentation.  
VALIDATION_REQUIRED: `SWIFT_WINDS_REACHES_CURRENT_BATTLE_MP === false`; `playerTurnStartFindsPlayerIn([{id:"enemy-1"}]) === false`; live player turn-start still overwrites `currentBattleMp` from `_baseStats.mp`; live Swift Boots item still uses `setCurrentBattleMp`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-28-004  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Gravity Well and Fog of War occupy 2/22 equal-weight modifier slots with empty hooks and unused `_is*` flags  
CATEGORY: technical-limits  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: `EXISTING_MAP_MODIFIER_IDS` has **22** entries (`worldFeatures.ts` 1890–1913). `gravity_well` and `fog_of_war` registry hooks are empty placeholders (`mapModifiers.ts` 280–295: “Mechanism not located”). WX binds `_isGravityWell` / `_isFogOfWar` (`WorldExploration.tsx` 2324, 2326) and never reads them (`rg` of the identifiers is those two lines). Two-roll trigger: global 20%, then weighted pick (`triggerChance` default 20), then 50% second (`mapModifiers.ts` 646–694). First-pick P(no-op) = **2/22 ≈ 9.1%**. Blood Moon / Mirror Field / Paper Windstorm / Time Warp also have empty registry hooks but WX implements them; Gravity and Fog have no second path. The pool does not grow with player level, so 9% of first picks stay flavor at 1 and at 100000. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** (independent of character level). Unreachable by official kill income past the mid-teens.  
CAUSE: Gravity Well and Fog of War were registered so they can roll and announce. Combat consumers were never written. WX kept underscored flags. Later modifiers (Surge, Overflow, Titans, …) grew real hooks; these two did not. Equal default weight means they compete with live modifiers forever.  
PLAYER_EFFECT: About one in eleven triggered first-picks is an announce with no combat change. A second roll can still attach a real modifier, so some of those maps are not fully empty — but the slot that could have been Thorn / Slime / Time Warp was spent. At extreme progression the 22-id catalog is unchanged, so this dilution never heals.  
TECHNICAL_EFFECT: 2/22 is a safe ratio. Underscored bindings are biome-legal unused locals only because of the `_` prefix. Distinct from Paper Windstorm (10-27-001): that one has a live miss tax; these two have zero.  
SYSTEMS_AFFECTED: `gravity_well`; `fog_of_war`; `rollActiveModifiers`; `EXISTING_MAP_MODIFIER_IDS`; MapModifiersPanel chips  
RECOMMENDED_ACTION: Report only. Do not implement gravity pull, fog vision, or reweight the pool here. If a human picks this ID, pick one published rule (remove them from the roll until hooked, or keep them as flavor and drop the implied combat announce) — do not start a vision system as a silent side effect. 10-27-001 remains Windstorm’s unused range constant.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-10-27-001 (advertised-but-unwired range is a different leftover); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if they are removed from the roll without a two-roll re-check (second-modifier remaining set). HIGH if a new vision/pull system ships without LoS / walk-budget pairing (10-28-002). LOW for documentation.  
VALIDATION_REQUIRED: `MAP_MODIFIER_POOL_SIZE === 22`; `noopModifierFirstPickChance() === 2/22`; live `_isGravityWell` / `_isFogOfWar` still have no readers; registry hooks still empty. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-28-005  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Four of seven family variants have no string combat identity after the battle-start overwrite — diversity is frozen at Ember / Tide / Void  
CATEGORY: enemy-generation  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `FAMILY_TYPES` is seven ids (`spawnPolicy.ts` 49–57). `maybeApplyEnemyFamilyVariant` is 30% (`FAMILY_VARIANT_CHANCE`). Battle-start overwrites family HP/RES/SP (10-22-001); the **string** survives and is what 10-26 used for Void Mirror 25%, Tide −1 MP, Ember burn 3. Live `family ===` combat readers are only `void_mirror` (`castHelpers.ts` 336), `ember_knight` / `tide_shade` (`WorldExploration.tsx` 16789, 16805). `wraith_bishop`, `iron_golem`, `plague_rat`, `bone_scribe` have pixels (`enemyPixelPatterns.ts`) and catalog mults (`FAMILY_STAT_MULTS`) that the overwrite discards — no string hook. P(paint-only family) = `0.3 × 4/7 ≈ 17.1%` of spawns. P(string identity) = `0.3 × 3/7 ≈ 12.9%`. Those three hooks do not scale with level (Tide −1 vs formula MP 4004 at 100000; Ember 3×3=9 vs linear HP; Void 25% of a chip-1 is 0). Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** for the 17% paint-only roll (the 30% variant can fire on any map). Extreme progression does not add families or hooks, so the mix at 100000 is the same as at 1. Unreachable by official kill income past the mid-teens.  
CAUSE: Seven family cosmetics were shipped with catalog HP/RES/SP. Battle-start later replaced those stats with the piece formula (10-22-001). Three families then gained string on-hit hooks. The other four never did. Kits still receive `currentMap.levelZone` as an object (007), so piece identity also freezes at z0. The 30% roll still picks among all seven.  
PLAYER_EFFECT: Almost one in six enemies is a recolor of the piece template. Almost one in eight is Ember, Tide, or Void — and those three identities are flat vs linear HP / formula MP / chip-1. High-level packs do not grow a fourth identity. Combined with the 999 level cap (003) and z0 kits (007), extreme-progression diversity is the starter roster plus three unscaled strings.  
TECHNICAL_EFFECT: 4/7, 0.171, 0.129 are safe Numbers. Pixel patterns still differ; combat does not. `FAMILY_STRING_SURVIVES_BATTLE_START_OVERWRITE === true` still holds for the three hooked ids.  
SYSTEMS_AFFECTED: `FAMILY_TYPES`; `maybeApplyEnemyFamilyVariant`; battle-start overwrite; `ember_knight` / `tide_shade` / `void_mirror` string hooks; enemy pixel catalog  
RECOMMENDED_ACTION: Report only. Do not add four new on-hits, restore catalog HP, or retune the 30% roll here. If a human picks this ID, pick one published rule (paint-only is intended and the 30% roll excludes them, or each family keeps one scaled hook) — do not start re-applying wiped catalog RES on top of rook-100 (004). 10-22-001 remains the overwrite; 10-26-002/004 remain Void/Tide; Ember burn stays the 09-23-001 class.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-10-22-001 (stat wipe); LHIPS-2026-10-26-002 (Void string); LHIPS-2026-10-26-004 (Tide string); LHIPS-2026-08-31-007 (kit zone object); LHIPS-2026-08-31-003 (999 cap); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if catalog family RES/HP is restored without pairing to the 10-22 overwrite (double-apply). HIGH if four new on-hits ship as unscaled flats (another 09-23-001 class). LOW for documentation.  
VALIDATION_REQUIRED: `FAMILIES_PAINT_ONLY_AFTER_STAT_WIPE.length === 4`; `FAMILIES_WITH_STRING_COMBAT_HOOKS.length === 3`; `paintOnlyFamilyChance() === 0.3*(4/7)`; live `family ===` combat readers still only ember / tide / void. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  
