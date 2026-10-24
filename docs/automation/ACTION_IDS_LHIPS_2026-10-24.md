# ACTION_IDs — 2026-10-24 Long-Horizon Infinite Progression Simulator

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Long-Horizon Infinite Progression Simulator.  
Narrative: [`LONG_HORIZON_2026-10-24.md`](./LONG_HORIZON_2026-10-24.md).  
Harness: `src/frontend/src/utils/longHorizonSim.ts`.

Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **observation only** — no curve redesign.

HEAD inspected: `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` / `#777` / `#819` / `#898` / `#960` inspected). Stress includes 10000 / 50000 / 100000. Harness **unions** `#960` rather than overwriting those files. This branch restacks onto `#960` so oldest-first merge-tree stays clean.

## Still-open IDs (not re-filed)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| `LHIPS-2026-08-31-001` | NEW | Exponential XP vs linear kill XP. Practical wall ~15–22. |
| `LHIPS-2026-08-31-002` | NEW | IEEE Infinity of the raw float at 1019. HUD path superseded by 09-01-001. |
| `LHIPS-2026-08-31-003` | NEW | Enemy `maxTier = floor(999/tierSize)`. Overworld pick max is **1000**. Dungeon +30 is 10-22-003. |
| `LHIPS-2026-08-31-004` | NEW | RES/SR hit 100; player SP does not scale. Sacrifice chips 1 after that (10-24-002). |
| `LHIPS-2026-08-31-005` | NEW | Three HP formulas; victory floor exceeds maxHp at 10. Family spawn HP is a fourth (10-22-001). |
| `LHIPS-2026-08-31-006` | NEW | 30% uniform AI 1–10; saturates ~901. |
| `LHIPS-2026-08-31-007` | NEW | `buildEnemyKit(currentMap.levelZone)` still passes an object. |
| `LHIPS-2026-08-31-008` | NEW | All 32 starters owned at create. Includes Timestep, Dire Wolf, Sacrifice (10-24-002). |
| `LHIPS-2026-08-31-009` | NEW | Summoner 100% at player 44. |
| `LHIPS-2026-08-31-010` | NEW | Catalog world-boss HP static. RES/CHC still scale (09-29-001). |
| `LHIPS-2026-08-31-011` | NEW | Challenge under-30 / under-50 fail on one hit at 14 / 24. |
| `LHIPS-2026-08-31-012` | NEW | Jackpot table unchanged. Persist 100k-capped. |
| `LHIPS-2026-08-31-013` | NEW | Level frozen on `saveBattleStats`. Battle AP dump is 10-22-002; Arcane Surge raises it (10-24-003). |
| `LHIPS-2026-08-31-014` | NEW | No player telemetry. |
| `LHIPS-2026-09-01-001` | NEW | HUD saturates at MAX_SAFE from 48. |
| `LHIPS-2026-09-01-002` | NEW | applyRewards 100k/500k vs jackpot and Void+boost XP. |
| `LHIPS-2026-09-01-003` | NEW | Formula AP 21 at 325 vs persist 20. |
| `LHIPS-2026-09-01-004` | NEW | Leftover Nat / Motoko pow2 / Number leftover. |
| `LHIPS-2026-09-02-001` | NEW | GameKey redeem up to 10M Doka outside applyRewards 100k. |
| `LHIPS-2026-09-02-002` | NEW | `upgradeSpell` `10*2^n` outruns combat Doka at 14, GameKey at 20, Number at 50. |
| `LHIPS-2026-09-21-001` | NEW | Frozen create INIT 10 vs scaling enemy INIT. Queued `#357`. |
| `LHIPS-2026-09-21-002` | NEW | Enemy CHC saturates at 100 from bishop 115. |
| `LHIPS-2026-09-22-001` | NEW | Unenraged fallback Crush one-shots. Queued `#407`. Mist would outheal it from 7917 if wired (10-24-001). |
| `LHIPS-2026-09-23-001` | NEW | Flat lava/spikes/poison vs linear HP. Queued `#475`. |
| `LHIPS-2026-09-23-002` | NEW | `maxSpellRange` 5 homogenizes starter ranges by 40. Queued `#475`. |
| `LHIPS-2026-09-24-001` | NEW | Flat Blood Mend 12 vs linear HP. Mending Mist 5% does not commit (10-24-001). |
| `LHIPS-2026-09-24-002` | NEW | Spell-fail hits 0 at 201. Queued `#530`. |
| `LHIPS-2026-09-25-001` | NEW | Betrayal enrage 6× Crush. Queued `#560`. |
| `LHIPS-2026-09-25-002` | NEW | Shield Charm 20; potion Doka 50/120 forever. Queued `#560`. |
| `LHIPS-2026-09-26-001` | NEW | Kit Strike/Frost stay catalog-flat vs Crush. Sacrifice is the HP-scaling exception (10-24-002). |
| `LHIPS-2026-09-26-002` | NEW | Idle +1 HP / 10s vs linear maxHp. Queued `#637`. |
| `LHIPS-2026-09-27-001` | NEW | Player Frost vs 999-capped packs. Arcane Surge raises the dump (10-24-003). |
| `LHIPS-2026-09-27-002` | NEW | Catalog summon HP vs Crush. Queued `#670`. |
| `LHIPS-2026-09-27-003` | NEW | Shrine 300 vs ground `5+2L`. Queued `#670`. |
| `LHIPS-2026-09-28-001` | NEW | Boss Rush `player+2` ignores 999 cap. Queued `#748`. |
| `LHIPS-2026-09-28-002` | NEW | Catalog room Doka unused vs `1.5L` persist. Queued `#748`. |
| `LHIPS-2026-09-28-003` | NEW | Formula MP vs 16×16 grid. Queued `#748`. |
| `LHIPS-2026-09-29-001` | NEW | Catalog world-boss HP frozen while `computeEnemyStats(player+5)` rolls RES/CHC. |
| `LHIPS-2026-09-29-002` | NEW | Shop 3 HP/Doka vs potion % and 100k ceiling. Queued `#777`. |
| `LHIPS-2026-10-21-001` | NEW | Initiative overlay AP = level + hardcoded RES 0 / CHC 2. Queued `#819`. |
| `LHIPS-2026-10-21-002` | NEW | Create evasion / resilience / SR never enter combat. Queued `#819`. |
| `LHIPS-2026-10-22-001` | NEW | Family 30% combat identity wiped at battle-start. Queued `#898`. |
| `LHIPS-2026-10-22-002` | NEW | Zero-CD Frost × unbounded battle AP. Arcane Surge is floor(AP/2) (10-24-003). Surge+Overflow is AP/1 (10-24-004). |
| `LHIPS-2026-10-22-003` | NEW | Dungeon +30 after the 999-cap pick. Queued `#898`. |
| `LHIPS-2026-10-23-001` | NEW | Timestep restores formula AP. Queued `#960`. |
| `LHIPS-2026-10-23-002` | NEW | Player summons have no cap. Queued `#960`. |
| `LHIPS-2026-10-23-003` | NEW | Summon INIT/RES use player level + king fallback. Queued `#960`. |
| `AQA-2026-08-30-012` | NEW | Collectors still missing. |

This file adds IDs only where a long-horizon failure was in-scope and never filed (Mending Mist 5% never commits; Sacrifice scales with HP then chips 1 vs RES 100; Arcane Surge raises the zero-CD Frost dump; two-roll Surge+Overflow stacks Frost to 1 AP).

---

ACTION_ID: LHIPS-2026-10-24-001  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Mending Mist 5% max-HP regen never commits, so the only percent-heal in battle is a no-op while Blood Mend stays 12 vs uncapped linear HP  
CATEGORY: technical-limits  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Registry hook `mending_mist` (`mapModifiers.ts` 349–365) does `combatant.hp += floor(maxHp * 0.05)`. Player turn-start calls `playerTurnStartModifierTarget(combatantsRef)` (`WorldExploration.tsx` 14262–14274), which is `combatants.find(id === "player")` (`battleSetup.ts` 364–368). The player is not in that store, so the target is `undefined` and the hook is skipped. Plague Zone / Void Rift have separate `setCharacterStats` / `updateCombatant` writes; Mending Mist does not. Enemy `applyTurnStart` mutates the turn-order copy only — Void Rift needed an extra store commit for the same reason (`WorldExploration.tsx` 14671–14696). Harness: `PLAYER_TURN_START_COMMITS_MENDING_MIST === false`; `playerCombatantsRefHasPlayerEntry([{id:"rat-1"}]) === false`; formula regen **5 / 254 / 25004** at player 1 / 1000 / 100000. If the hook were store-committed, regen would exceed unenraged 1020 Crush recv **1983** from player **7917** and enraged recv **11897** from **47573**. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** for the no-op (Mist never heals). **7917** for the unwired formula to outheal unenraged cap Crush; **47573** vs enraged. Unreachable by official kill income past the mid-teens.  
CAUSE: Player HP lives on `characterStats`, not `combatantsRef`. Turn-start modifiers were pointed at the store to stop mutating enemy `[0]`. Percent-heal was left on the registry object with no player write.  
PLAYER_EFFECT: Announced “5% max HP regen each turn” does nothing. In-battle healing stays Blood Mend 12 (09-24-001) against linear HP 5095 / 500095 at 1000 / 100000. Shop potions still scale.  
TECHNICAL_EFFECT: Formula regen 25004 at 100000 is a safe Number. No overflow. Enemy Mist is the same turn-order-only mutation class as the pre-fix Void Rift tick.  
SYSTEMS_AFFECTED: `mending_mist`; `applyTurnStart`; `playerTurnStartModifierTarget`; `characterStats.hp`; Blood Mend  
RECOMMENDED_ACTION: Report only. Do not wire Mist, retune 5%, or change Blood Mend here. If a human picks this ID, pick one published rule (Mist writes `characterStats` / store HP, or Mist is removed from the announce list) — do not start healing the player from enemy `[0]`. 09-24-001 remains the flat heal; 09-26-002 remains idle +1 / 10s.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-09-24-001 (Blood Mend 12); LHIPS-2026-09-26-002 (idle regen); LHIPS-2026-09-22-001 (Crush recv); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if Mist starts writing player HP without a paired HUD / challenge-heal flag. HIGH if 5% ships on enemies via store write without a cap-pack TTK check. LOW for documentation.  
VALIDATION_REQUIRED: `playerTurnStartModifierTarget([{id:"rat-1"}]) === undefined`; live player turn-start still has no `mending_mist` `setCharacterStats`; `mendingMistRegenAtPlayerLevel(100000) === 25004`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-24-002  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Starter Sacrifice deals 0.6× current HP at cooldown 0 — the only HP-scaling attack — then chips 1 vs RES 100 from rook 78, before it can one-shot the 1030 dungeon cap at player 855  
CATEGORY: spells  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `spell-sacrifice` (`spellData.ts` 233–250) is in the create kit (008), `apCost` 3, no `cooldown`. `resolvePlayerCast` (`spellEngine.ts` 749–763) does `floor(characterStats.hp * 0.2) * 3` and `dealDamage` → `enemyTakesDamage` (`WorldExploration.tsx` 9171–9183), which applies enemy RES once then chips at least 1. Harness: raw **60** at player 1 vs Frost **21**; **2622** at 855 vs dungeon-cap linear HP **2622**; **3057 / 300057** at 1000 / 100000. `sacrificeDamageAfterEnemyRes(raw, 100) === 1`. Rook max RES 100 at **78** (004), **777 levels before** the raw one-shot of the 1030 cap. Catalog `isPhysical` is unset; the live path still uses the RES-only `enemyTakesDamage` fallback, not SR. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** for Sacrifice > Frost (60 vs 21). **78** for rook RES 100 turning it into chip-1. **855** for raw damage to match the 1030 dungeon cap (never reached against typical RES rolls). Unreachable by official kill income past the mid-teens.  
CAUSE: Sacrifice was authored as a percent of current HP. Enemy RES later became a percent that saturates at 100. The 999-cap pack sits after that saturation. Those three authors were not sized together.  
PLAYER_EFFECT: At create, Sacrifice already out-damages Frost. Through the mid-game it scales with linear HP. From rook 78 onward the 999-cap pack chips 1, same as Frost (09-27-001). The HP-scaling exception does not survive the cap. Subsequent casts in one turn diminish because they spend current HP (floor at 1).  
TECHNICAL_EFFECT: Raw 300057 at player 100000 is a safe Number. Chip-1 is a safe Number. `isPhysical` on the catalog object is unused by `dealDamage` (`_opts`).  
SYSTEMS_AFFECTED: `spell-sacrifice`; `enemyTakesDamage`; enemy RES; create kit; Frost TTK  
RECOMMENDED_ACTION: Report only. Do not retune 20%/3×, add a Sacrifice cooldown, or change RES 100 here. If a human picks this ID, pick one published damage base (flat, spell-level, or percent of *enemy* HP) — do not start ignoring RES on Sacrifice as a silent execute. 09-26-001 remains kit vs Crush; 004 remains RES 100.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-004 (RES 100); LHIPS-2026-08-31-008 (create kit); LHIPS-2026-09-26-001 (flat kit damage); LHIPS-2026-10-22-003 (dungeon cap 1030); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if Sacrifice starts using maxHp instead of current without a floor-1 check. HIGH if it bypasses RES. LOW for documentation.  
VALIDATION_REQUIRED: `sacrificeRawAtFullHp(1) === 60`; `firstPlayerLevelSacrificeRawExceeds(linearEnemyMaxHp(1030)) === 855`; `sacrificeDamageAfterEnemyRes(2622, 100) === 1`; live `dealDamage` still calls `enemyTakesDamage`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-24-003  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Arcane Surge max(1, cost−1) turns zero-CD Frost into floor(AP/2) casts — 10 / 2004 at 325 / 100000 — and bills Timestep 1 AP instead of 0  
CATEGORY: technical-limits  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `arcane_surge` `onApCost` (`mapModifiers.ts` 210–217) is `Math.max(1, baseCost - 1)`. Cast sites call `mapModifierRegistry.applyApCost` (`WorldExploration.tsx` 10336, 17130, 17246). Frost catalog cost 3 → **2**; dump becomes `floor(AP/2)` instead of `floor(AP/3)` (10-22-002). Harness: **10 / 2004** casts at formula AP 21 / 4008 (player 325 / 100000) vs 7 / 1336 without Surge. First 100-cast Surge turn at **4800** (vs 7300). With Timestep (10-23-001) that is **20 / 4008** at 325 / 100000; first 100-cast Timestep+Surge turn at **2300**. Timestep catalog cost 0 becomes `max(1, -1) === 1`, so restore writes formula AP−1 if the runtime cost is forwarded. Two-roll maps can also pair Surge with Overflow (10-24-004) or Time Warp 15s. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** for Timestep costing 1 instead of 0. **325** for 10 Frosts vs persist 6. **2300** for a 100-cast Timestep+Surge turn. **4800** for a 100-cast single-bar turn. **100000** for 2004 / 4008 resolutions. Unreachable by official kill income past the mid-teens.  
CAUSE: Arcane Surge was authored as “spells cost 1 less, min 1.” Battle AP later used the unbounded formula. Frost never got a cooldown. Timestep cost 0 was not excluded from min-1. Those four authors were not sized together.  
PLAYER_EFFECT: A random map modifier is a 50% more Frost dump than 10-22-002 on the same AP bar, and it taxes the once-per-battle refill. AI still Crush/kit-casts once. TTK vs the 1000-cap pack already hits 1 turn at player 10000 from one un-surged bar (09-27-001).  
TECHNICAL_EFFECT: 4008 sequential `computeDamage` + log + VFX is a RAF hitch on top of 10-22-002 / 10-23-001. Numbers stay finite. Persist still writes 20.  
SYSTEMS_AFFECTED: `arcane_surge`; `applyApCost`; starter Frost cooldown; `spell-timestep`; formula AP  
RECOMMENDED_ACTION: Report only. Do not add a Frost cooldown, cap battle AP, or special-case cost 0 here. If a human picks this ID, pick one published rule (Surge does not raise min cost above catalog 0, or dump spells have a cooldown, or battle AP is persist 20) — do not start spending overlay enemy AP as a silent AI multi-act. 10-22-002 remains the un-surged dump; 10-23-001 remains Timestep; 10-24-004 remains the two-roll stack.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-10-22-002 (Frost dump); LHIPS-2026-10-23-001 (Timestep); LHIPS-2026-09-01-003 (persist 20); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if Surge starts allowing cost 0 without a paired Timestep once-per-battle check. HIGH if Frost gains a cooldown without retuning the create kit. LOW for documentation.  
VALIDATION_REQUIRED: `arcaneSurgeApCost(3) === 2`; `arcaneSurgeApCost(0) === 1`; `playerFrostCastsPerTurnWithArcaneSurge(formulaAp(100000)) === 2004`; live `applyApCost` still uses `max(1, base-1)`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-24-004  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Two-roll Arcane Surge + Arcane Overflow chains two max(1, cost−1) hooks so zero-CD Frost costs 1 AP — 21 / 4008 casts at 325 / 100000, 8016 with Timestep  
CATEGORY: technical-limits  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `applyApCost` walks every active `onApCost` in registry order (`mapModifiers.ts` 538–550). `arcane_surge` (216) and `arcane_overflow` (324) are the same `max(1, baseCost - 1)`. Live test already locks the stack: `applyApCost(3, {surge, overflow}) === 1` (`mapModifiers.cost.test.ts` 27–38). `rollActiveModifiers` can return two ids (20% global, then 50% second, excluding the first; 22 equal-weight modifiers). Frost 3 → **1**; dump is `floor(AP/1)` instead of `floor(AP/2)` (10-24-003) or `floor(AP/3)` (10-22-002). Harness: **21 / 4008** casts at formula AP 21 / 4008 (player 325 / 100000). First 100-cast stacked turn at **2300**. With Timestep that is **42 / 8016**; first 100-cast Timestep+stack turn at **1050**. Timestep 0 stays **1** after both discounts (min 1). Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** for Frost costing 1 on a two-roll map. **325** for 21 Frosts vs persist 6. **1050** for a 100-cast Timestep+stack turn. **2300** for a 100-cast single-bar turn. **100000** for 4008 / 8016 resolutions. Unreachable by official kill income past the mid-teens.  
CAUSE: Two modifiers independently authored “AP −1, min 1.” The two-roll trigger later allowed both on one map. `applyApCost` later chained every hook. Battle AP later used the unbounded formula. Frost never got a cooldown. Those five authors were not sized together.  
PLAYER_EFFECT: A rare two-roll map spends the whole formula AP bar on Frost. AI still Crush/kit-casts once. TTK vs the 1000-cap pack already hits 1 turn at player 10000 from one un-surged bar (09-27-001) — the stack is leftover fire after the pack is dead.  
TECHNICAL_EFFECT: 8016 sequential `computeDamage` + log + VFX is a RAF hitch on top of 10-24-003 / 10-23-001. Numbers stay finite. Persist still writes 20. Overflow’s extra 10% fizzle does not apply to Frost’s direct damage path.  
SYSTEMS_AFFECTED: `arcane_surge`; `arcane_overflow`; `applyApCost`; `rollActiveModifiers`; starter Frost cooldown; `spell-timestep`; formula AP  
RECOMMENDED_ACTION: Report only. Do not add a Frost cooldown, cap battle AP, or forbid the two-roll pair here. If a human picks this ID, pick one published rule (AP discounts do not stack, or dump spells have a cooldown, or battle AP is persist 20) — do not start spending overlay enemy AP as a silent AI multi-act. 10-24-003 remains single Surge; 10-22-002 remains the un-discounted dump.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-10-24-003 (single Surge); LHIPS-2026-10-22-002 (Frost dump); LHIPS-2026-10-23-001 (Timestep); LHIPS-2026-09-01-003 (persist 20); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if stacking is removed without retuning Overflow’s fizzle as the remaining identity. HIGH if Frost gains a cooldown without retuning the create kit. LOW for documentation.  
VALIDATION_REQUIRED: `stackedArcaneDiscountApCost(3) === 1`; `playerFrostCastsPerTurnWithStackedArcane(formulaAp(100000)) === 4008`; `firstLevelStackedArcaneFrostCastsAtLeast(100) === 2300`; live `applyApCost(3, {surge, overflow}) === 1`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  
