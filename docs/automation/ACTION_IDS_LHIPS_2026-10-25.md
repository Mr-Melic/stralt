# ACTION_IDs — 2026-10-25 Long-Horizon Infinite Progression Simulator

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Long-Horizon Infinite Progression Simulator.  
Narrative: [`LONG_HORIZON_2026-10-25.md`](./LONG_HORIZON_2026-10-25.md).  
Harness: `src/frontend/src/utils/longHorizonSim.ts`.

Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **observation only** — no curve redesign.

HEAD inspected: `0f5363f` (same commit `#357` / `#407` / `#475` / `#530` / `#560` / `#637` / `#670` / `#748` / `#777` / `#819` / `#898` / `#960` / `#1016` inspected). Stress includes 10000 / 50000 / 100000. Harness **unions** `#1016` rather than overwriting those files. This branch restacks onto `#1016` so oldest-first merge-tree stays clean.

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
| `LHIPS-2026-08-31-011` | NEW | Challenge under-30 / under-50 fail on one hit at 14 / 24. |
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
| `LHIPS-2026-09-23-001` | NEW | Flat lava/spikes/poison vs linear HP. Queued `#475`. |
| `LHIPS-2026-09-23-002` | NEW | `maxSpellRange` 5 homogenizes starter ranges by 40. Queued `#475`. |
| `LHIPS-2026-09-24-001` | NEW | Flat Blood Mend 12 vs linear HP. Mending Mist 5% does not commit (10-24-001). |
| `LHIPS-2026-09-24-002` | NEW | Spell-fail hits 0 at 201. Queued `#530`. |
| `LHIPS-2026-09-25-001` | NEW | Betrayal enrage 6× Crush. Queued `#560`. |
| `LHIPS-2026-09-25-002` | NEW | Shield Charm 20; potion Doka 50/120 forever. Queued `#560`. |
| `LHIPS-2026-09-26-001` | NEW | Kit Strike/Frost stay catalog-flat vs Crush. |
| `LHIPS-2026-09-26-002` | NEW | Idle +1 HP / 10s vs linear maxHp. Queued `#637`. |
| `LHIPS-2026-09-27-001` | NEW | Player Frost vs 999-capped packs. Titans/Glass multiply chip-1 after RES (10-25-001). |
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
| `LHIPS-2026-10-22-002` | NEW | Zero-CD Frost × unbounded battle AP. |
| `LHIPS-2026-10-22-003` | NEW | Dungeon +30 after the 999-cap pick. Queued `#898`. |
| `LHIPS-2026-10-23-001` | NEW | Timestep restores formula AP. Queued `#960`. |
| `LHIPS-2026-10-23-002` | NEW | Player summons have no cap. Queued `#960`. |
| `LHIPS-2026-10-23-003` | NEW | Summon INIT/RES use player level + king fallback. Melee uses the same level (10-25-004). |
| `LHIPS-2026-10-24-001` | NEW | Mending Mist 5% never commits. Same combatantsRef miss as Titans HP (10-25-001). |
| `LHIPS-2026-10-24-002` | NEW | Sacrifice 0.6× HP then chip-1 vs RES 100. |
| `LHIPS-2026-10-24-003` | NEW | Arcane Surge Frost dump. Queued `#1016`. |
| `LHIPS-2026-10-24-004` | NEW | Two-roll Surge+Overflow Frost to 1 AP. Queued `#1016`. |
| `AQA-2026-08-30-012` | NEW | Collectors still missing. |

This file adds IDs only where a long-horizon failure was in-scope and never filed (Titan's Vigor +1000 misses the player while 1–5× multiplies only outgoing chip-1; Doka Fever +25% HP no-ops on overworld spawn; Iron Curse pulls rook RES 100 from 78 to 59; enemy-summon melee equals uncapped player.level; Vampiric Ground 15% mutates a throwaway player snapshot and floors to 0 on chip-1).

---

ACTION_ID: LHIPS-2026-10-25-001  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Titan's Vigor +1000 HP never lands on the player while 1–5× (and two-roll Glass ×2) multiply only enemyTakesDamage after the RES chip-1 floor  
CATEGORY: technical-limits  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `titans_vigor` `onBattleStart` (`mapModifiers.ts` 305–310) does `hp += 1000` on every combatant in the array. Battle start calls `applyBattleStart(combatantsRef.current)` (`WorldExploration.tsx` 12076–12079). The player is not in that store (`playerTurnStartModifierTarget`; 10-24-001). Incoming Crush uses `playerTakesDamage` (3424–3468) or melee `setCharacterStats` (16763–16766) — neither calls `applyDamageDealt`. Outgoing hits apply RES first, chip at least 1, then `applyDamageDealt` (3499–3516). Titan's Vigor rolls 1–5 on that already-floored value (311–315). Glass Realm ×2 is the same hook (345–346) and two-roll can pair them. Harness: `BATTLE_START_PLAYER_IN_COMBATANTS_REF === false`; `PLAYER_TAKES_DAMAGE_RUNS_APPLY_DAMAGE_DEALT === false`; L1 enemy HP **50 → 1050**; dungeon-cap **2622 → 3622**; chip-1 becomes **5 / 2 / 10** (Titans max / Glass / both). Un-surged Frost dump first exceeds dungeon-cap HP under Titans-max at **39175**, Glass at **98125**, both at **19525**. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** for the +1000 balloon on 50-HP packs and for the player missing the bonus. **78** for chip-1×(1–5) after rook RES 100. **19525** for a two-roll Titans+Glass Frost dump to one-turn the 1030 cap through chip-1. Unreachable by official kill income past the mid-teens.  
CAUSE: Titan's Vigor HP was authored against a combatant list that does not include the player. The 1–5× roll was hung on `enemyTakesDamage` after the RES floor. Incoming Crush was later moved off that hook. Those three authors were not sized together.  
PLAYER_EFFECT: Announced “+1000 HP, damage rolls 1–5x” buffs only enemies' store HP and only the player's outgoing hits. At create, a 50-HP pack becomes 1050 (21×). After RES 100, Frost chip-1 becomes 1–5 (2–10 with Glass) instead of escaping the floor. Incoming Crush is unchanged.  
TECHNICAL_EFFECT: +1000 and ×10 on chip-1 are safe Numbers. `setTurnOrder(orderWithLeader)` after `applyBattleStart` still snapshots un-bonused HP, so the strip can disagree with store HP until the first `updateCombatant`.  
SYSTEMS_AFFECTED: `titans_vigor`; `glass_realm`; `applyBattleStart`; `applyDamageDealt`; `enemyTakesDamage`; `playerTakesDamage`; enemy RES chip-1  
RECOMMENDED_ACTION: Report only. Do not wire Titans onto the player, retune +1000 / 1–5×, or fold Crush into `applyDamageDealt` here. If a human picks this ID, pick one published rule (battle-start HP writes `characterStats` too, or the 1–5× roll happens before the RES floor, or Glass actually doubles received Crush) — do not start multiplying overlay AP as a silent AI multi-act. 10-24-001 remains Mist; 004 remains RES 100; 10-22-002 remains the un-modded Frost dump.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-10-24-001 (combatantsRef miss); LHIPS-2026-08-31-004 (RES 100); LHIPS-2026-10-22-002 (Frost dump); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if Titans starts writing player HP without a paired HUD / challenge-heal flag. HIGH if 1–5× moves before RES without a cap-pack TTK check. LOW for documentation.  
VALIDATION_REQUIRED: `titansVigorHp(50) === 1050`; `titansMaxChip1() === 5`; `titansGlassMaxChip1() === 10`; live `applyBattleStart` still skips the player; live Crush still skips `applyDamageDealt`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-25-002  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Doka Fever +25% enemy HP is a no-op on overworld spawns because generateEnemies never sets side or isEnemy; only the 2× Doka hook fires, then applyRewards clamps 100k  
CATEGORY: economy  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `doka_fever` `onBattleStart` (`mapModifiers.ts` 476–484) gates on `c.isEnemy ?? c.side === "enemy"`. Overworld `generateEnemies` (`WorldExploration.tsx` 5809–5841) writes id/position/piece/level/stats/family/name and **does not write `side` or `isEnemy`**. `undefined ?? (undefined === "enemy")` is false, so the +25% never runs on the live spawn shape. The 2× Doka hook is still applied at victory (`applyRewardMultiplier` 12420–12427), then `clampApplyRewardsDeltas` to 100_000 (09-01-002). Harness: `dokaFeverAppliesHpBonus({}) === false`; `dokaFeverAppliesHpBonus({side:"enemy"}) === true`; unused bonus **12 / 655** at linear HP 50 / 2622. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** (the HP bonus is missing on every overworld pack; the 2× Doka still hits the 100k ceiling). Unreachable by official kill income past the mid-teens for the clamped 2× wallet.  
CAUSE: Doka Fever's HP gate was written for a `side: "enemy"` combatant model. Overworld spawn never adopted that field. The reward multiplier was wired on a different hook that does not check side.  
PLAYER_EFFECT: Announced “enemies +25% HP, Doka rewards doubled” only doubles Doka. Packs keep linear HP. Doubled Doka still persists 100k.  
TECHNICAL_EFFECT: Bonus 655 at the 1030 cap is a safe Number. No overflow. Enemy-side summons that do set `side: "enemy"` would receive the +25% if they go through `applyBattleStart` after spawn — battle-start already ran.  
SYSTEMS_AFFECTED: `doka_fever`; `generateEnemies`; `applyBattleStart`; `applyRewardMultiplier`; `clampApplyRewardsDeltas`  
RECOMMENDED_ACTION: Report only. Do not add `side: "enemy"` on spawn, retune +25%, or lift the 100k ceiling here. If a human picks this ID, pick one published rule (Fever HP uses the same hostile default as `countsTowardKillRewards`, or the announce text drops +25% HP) — do not start applying Fever to the player. 09-01-002 remains the combat clamp; 012 remains the jackpot table.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-09-01-002 (100k clamp); LHIPS-2026-08-31-012 (jackpot); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if spawn starts writing `side: "enemy"` without a paired Fever TTK check. HIGH if the HP gate is inverted and buffs the player. LOW for documentation.  
VALIDATION_REQUIRED: `dokaFeverAppliesHpBonus({}) === false`; live `generateEnemies` objects still omit `side`; a Doka Fever victory still calls `applyRewardMultiplier` then clamps 100k. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-25-003  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Iron Curse 1.3× RES on combatantsRef pulls rook chip-1 from 78 to 59 and is a no-op after RES 100; the player never receives the 1.3×  
CATEGORY: enemy-stats  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `iron_curse` `onBattleStart` (`mapModifiers.ts` 384–387) does `res = floor(res * 1.3)` on `combatantsRef`. The player is not in that store (10-24-001 / 10-25-001). Uncursed rook max RES 100 at **78** (004). Cursed rook max 100 at **59**; king 107 → **81**. `floor(100 * 1.3) === 130`, then `enemyTakesDamage` uses `max(0, 1 - res/100)` so 130% still chips 1. Harness: `firstLevelIronCursedResCanHit100("rook") === 59`; `ironCursedRes(100) === 130`; `damageAfterResThenMapMods(21, 130, 1) === 1`. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **59** for cursed rook chip-1 (19 levels before the uncursed 78). **1** for the player missing the RES bonus. Unreachable by official kill income past the mid-teens.  
CAUSE: Iron Curse was authored as +30% RES on the battle-start combatant list. Enemy RES later became a percent that saturates at 100. The player later left that list. Those three authors were not sized together.  
PLAYER_EFFECT: A random map modifier makes rook packs chip-1 19 levels earlier. The player's create RES 10 is unchanged. After 100, Iron Curse does not turn chip-1 into 0 — it stays 1. Healing-halved is a separate WX id-check, not this hook.  
TECHNICAL_EFFECT: Cursed RES 130 is a safe Number. Factor floor at 0 prevents negative damage.  
SYSTEMS_AFFECTED: `iron_curse`; `applyBattleStart`; `computeEnemyStats` RES; `enemyTakesDamage`  
RECOMMENDED_ACTION: Report only. Do not cap RES at 100 before the 1.3×, retune 1.3, or write player RES here. If a human picks this ID, pick one published rule (Iron Curse is a received-damage multiplier instead of RES, or RES is capped at 99 before the curse) — do not start ignoring RES on player spells as a silent execute. 004 remains RES 100; 10-24-002 remains Sacrifice chip-1.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-08-31-004 (RES 100); LHIPS-2026-10-24-001 (combatantsRef miss); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if RES is clamped at 99 without retuning Crush TTK. HIGH if Iron Curse starts writing player RES 10→13 without a Crush one-shot re-sim. LOW for documentation.  
VALIDATION_REQUIRED: `firstLevelResCanHit100("rook") === 78`; `firstLevelIronCursedResCanHit100("rook") === 59`; live `applyBattleStart` still skips the player. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-25-004  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Enemy-summon melee deals player.level because spawn writes no atk and copies no kit — a 999-capped summoner's wolf outdamages cap Crush from player 2448  
CATEGORY: enemy-stats  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `spawnSummonUnit` spreads `computeEnemyStats` (`summonSpawn.ts` 138, 185) which returns `{sp,sr,init,res,chc}` — no `atk`. It never copies `summonKit` onto `summon.spells`. Hunter `findKitSpell` (`enemyAI.ts` 1737–1745) reads `availableSpells` / `assignedSpells` from that empty array, so venom is null and adjacent wolves melee (1960–1974). Executor `calcScaledDamage(atk ?? level, level, 0)` (`summonExecutor.ts` 221–224) equals player.level. Hostile spawn passes `characterStats.level` (`WorldExploration.tsx` 14930), not the 999-capped pack level. Summoner chance is 100% at 44 (009). Harness: `summonMeleeRaw(1) === 1`; `summonMeleeRaw(100000) === 100000`; first melee ≥ cap Crush 2448 at **2448**; first melee ≥ dungeon-cap HP 2622 at **2622**. At 100000 the wolf hits **41×** unenraged cap Crush (2448). Player HP at 2448 is 12335, so the wolf is ~20% of player HP, not a player one-shot. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **44** for 100% summoners spawning player-level wolves. **2448** for melee to exceed cap Crush. **2622** for a raw one-shot of the 1030-cap pack (RES still chips). Unreachable by official kill income past the mid-teens.  
CAUSE: Summon melee was authored as `atk ?? level`. Spawn later used `computeEnemyStats` which has no atk. Kit lookup later required `summon.spells` which spawn does not copy. Hostile spawn later passed the player's uncapped level. The 999 cap was later applied only to overworld picks. Those five authors were not sized together.  
PLAYER_EFFECT: From summoner saturation (44), every pack can spawn a wolf whose melee tracks the player, not the 1000-cap enemy. Past 2448 that minion hits harder than the summoner's Crush. Player-controlled Dire Wolves still spend kit Strike 10 / Venom through the control panel — this is the AI/hostile path. Catalog hunter HP stays 80 (09-27-002) so Crush still one-shots the wolf from 34.  
TECHNICAL_EFFECT: Melee 100000 is a safe Number. `calcScaledDamage` ignores caster level, so upgrade 0 keeps damage === level.  
SYSTEMS_AFFECTED: `spawnSummonUnit`; `spawnEnemySummonUnit`; `decideSummonHunter`; `executeSummonAction`; `computeEnemyStats`; enemy summoner chance  
RECOMMENDED_ACTION: Report only. Do not add an atk field, copy summonKit onto spells, or cap hostile summon level here. If a human picks this ID, pick one published melee base (catalog Strike 10, or the 999-capped summoner level) — do not start using overlay AP as wolf melee. 10-23-003 remains INIT/RES; 10-23-002 remains the player summon cap; 09-27-002 remains catalog HP vs Crush.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-10-23-003 (summon stats use player.level); LHIPS-2026-10-23-002 (player summon cap); LHIPS-2026-08-31-009 (summoner 100% at 44); LHIPS-2026-08-31-003 (999 cap); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if hostile summons start using pack level without a TTK check vs player HP. HIGH if `summon.spells` is filled and venom (AP 3 vs wolf AP 2) starts being decided then dropped. LOW for documentation.  
VALIDATION_REQUIRED: `summonMeleeRaw(2448) === 2448`; `fallbackCrushRaw(1020) === 2448`; live `spawnEnemySummonUnit(..., characterStats.level)` still; live spawned summons still omit `atk` and `spells`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  

---

ACTION_ID: LHIPS-2026-10-25-005  
SOURCE_AUTOMATION: Long-Horizon Infinite Progression Simulator  
TITLE: Vampiric Ground 15% lifesteal mutates a throwaway player snapshot, and 15% of RES chip-1 floors to 0  
CATEGORY: technical-limits  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `vampiric_ground` `onDamageDealt` (`mapModifiers.ts` 406–414) does `attacker.hp += floor(damage * 0.15)` and returns the same damage. Live `enemyTakesDamage` (`WorldExploration.tsx` 3499–3508) passes `{hp: characterStats.hp, maxHp: characterStats.hp, id: "player", isEnemy: false}` when `casterId === "player"` — a snapshot, not `characterStats`. Incoming Crush uses `playerTakesDamage` (3424–3468) and never calls `applyDamageDealt`. Harness: `PLAYER_DAMAGE_DEALT_ATTACKER_IS_LIVE_STATS === false`; `vampiricHeal(21) === 3` (unfloored Frost); `vampiricHeal(1) === 0`; Titans-max chip-5 and Glass chip-2 still heal **0**; Titans+Glass max chip-10 heals **1**. Official XP wall (001) still arrives first.  
FIRST_APPROXIMATE_PROBLEM_LEVEL: **1** for the throwaway write (player never heals). **78** for 15% of chip-1 flooring to 0 even if the write landed. Unreachable by official kill income past the mid-teens.  
CAUSE: Lifesteal was authored against a live attacker object. The player damage path later constructed a one-off snapshot so modifiers would not mutate `combatantsRef[0]`. Enemy RES later became a percent that saturates at 100. Those three authors were not sized together.  
PLAYER_EFFECT: Announced “attackers heal for 15% of damage dealt” never heals the player. After rook RES 100, even a store-committed write would heal 0 on Frost / Sacrifice / chip-1. A two-roll Titans+Glass max roll is the first chip-1 path that would heal 1. Incoming Crush does not lifesteal for enemies either.  
TECHNICAL_EFFECT: Heal 3 / 0 / 1 are safe Numbers. Summons found in `combatantsRef` can still receive the mutate if they are the caster.  
SYSTEMS_AFFECTED: `vampiric_ground`; `applyDamageDealt`; `enemyTakesDamage`; `playerTakesDamage`; enemy RES chip-1  
RECOMMENDED_ACTION: Report only. Do not write `characterStats.hp` from the hook, retune 15%, or fold Crush into `applyDamageDealt` here. If a human picks this ID, pick one published rule (lifesteal writes `characterStats` / store HP, or the announce text drops 15%) — do not start healing the player from enemy `[0]`. 10-25-001 remains Titans/Glass on the same hook; 10-24-001 remains Mist.  
AUTONOMY: REPORT_ONLY  
DEPENDENCIES: LHIPS-2026-10-25-001 (same applyDamageDealt hook / throwaway player); LHIPS-2026-08-31-004 (RES 100); LHIPS-2026-10-24-001 (combatantsRef miss); LHIPS-2026-08-31-001 (XP wall)  
REGRESSION_RISK: HIGH if lifesteal starts writing player HP without a paired HUD / challenge-heal flag. HIGH if 15% ships on incoming Crush without a TTK check. LOW for documentation.  
VALIDATION_REQUIRED: `vampiricHeal(1) === 0`; `vampiricHeal(titansGlassMaxChip1()) === 1`; live `enemyTakesDamage` still passes a snapshot for `casterId === "player"`; live `playerTakesDamage` still skips `applyDamageDealt`. Re-run `longHorizonSim.test.ts`.  
STATUS: NEW  
