# ACTION_IDs — 2026-10-23 Mechanic Interaction Matrix Auditor

Durable ledger for the Report Action Orchestrator.  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
HEAD inspected: `0f5363f` (`Merge pull request #332`)  
Gameplay code: not modified.

Do not re-file OPEN / closed 08-31 / 09-01 / 09-02 / 09-21…09-29 / 10-21 / 10-22
items or in-flight **#391** / **#443** / **#496** / **#528** / **#555** / **#658** /
**#692** / **#714** / **#728** / **#754** / **#763** / **#765** / **#790** /
**#799** / **#803** / **#832** / **#856** / **#891**. Push/pull remain REPORT_ONLY
(08-31-005). Gravity Well / Fog of War / `applyRangeModification` unused —
do not re-file. Player DoT × Windstorm/Mirror Field remains 10-22-001.
Bounce RES/`dmg` + Void Mirror remains 10-22-002. Plague tick × Shield/RES
remains 10-22-003. Boss `damageToPlayer` RES skip remains 10-22-004.
Sacrifice loop-skip remains 10-21-009. Swap landing × hazards remains 08-31-001.
PXA owns Windstorm announce vs 30% rate / unused range-halve — this hunt is
consume-path pairing, not the rate.

---

ACTION_ID: MIMA-2026-10-23-001  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Enemy Paper Windstorm miss leaves `didAct` false so an adjacent caster still Crush/Fire Bolts  
CATEGORY: range + AP + death + player feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Player Windstorm miss is a consuming `"cast"` (`spellEngine.ts` 909–914; WX `paperWindstormMiss` 9563–9571): AP spent, no extra hit. Enemy kit damage (`WorldExploration.tsx` 16459–16495) logs a 50% miss when `spellRange > 1` and **does not** set `didAct`. Cooldown write is in the hit `else` (16640–16647), so a miss does not consume the kit spell either. The executor then always runs `if (action.kind === "melee" || !didAct)` (16704). `kind: "melee"` is only returned by hunter summon AI (`enemyAI.ts` 1970), which player-side summons execute through `executeSummonAction` (WX 15286) — enemy units never take that kind. The live `!didAct` consumer is this fallback. If Chebyshev to the target is ≤ 1 (16705–16709), it rolls Crush (range 1, 12 dmg) or Fire Bolt (range 3, 8 dmg). Crush skips the second Windstorm gate (`fb.range > 1` at 16729). Bishop/queen/king kits are live Frost Bolt (`starter-frost`, range 4, `ENEMY_KITS` 170–183; `pickBestDamageSpell` requires `damage > 0` so Inferno is never chosen). A player who walks adjacent to a bishop still satisfies `inRange` for Frost Bolt; a Windstorm “miss” then Crush is a second attack the log already called a miss. Ranged (nd > 1) miss has no fallback — only the adjacent case double-taps. No test asserts `didAct` after an enemy Windstorm miss. Distinct from PXA’s 30% vs 50% rate and from 10-22-001 (player DoT never rolls).  
EXPECTED_INTERACTION: A Windstorm miss consumes the enemy’s offensive action the way a player miss consumes AP: no follow-up Crush, kit cooldown starts, battle log and HP agree.  
ACTUAL_INTERACTION: Adjacent Frost Bolt can log a miss and still deal Crush (no second Windstorm roll) or Fire Bolt. Kit cooldown is not set.  
SYSTEMS_AFFECTED: Paper Windstorm, enemy kit (Frost Bolt), fallback Crush/Fire Bolt, AP/cooldown, death (Crush uses the melee HP write), player feedback  
RECOMMENDED_ACTION: Set `didAct = true` on the kit Windstorm miss branch (and start cooldown if product says the spell was used). Do not change the 50% roll or Crush numbers in the same PR. Tests: adjacent bishop, forced miss ⇒ no Crush/Fire Bolt and Frost Bolt cooldown set; nd > 1 miss stays a no-op. Do not fold Ember/Tide on-hit (004) into this PR unless the fallback block is rewritten once.  
AUTONOMY: IMPLEMENT_ONE_WX_ASSIGNMENT  
DEPENDENCIES: Distinct from 10-22-001 and PXA rate. 004 shares the fallback block.  
REGRESSION_RISK: LOW — misses become real misses; do not also delete the melee fallback for true `kind === "melee"` hunters (those never enter this WX path).  
VALIDATION_REQUIRED: WX-level or extracted `didAct` fixture; playtest adjacent bishop under Paper Windstorm.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-23-002  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Chain Lightning `hitsMultiple` hits every hostile in range 4 then bounce-loops each, and skips Mirror Field  
CATEGORY: damage + range + statuses + summons  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Catalog copy is “Hits primary target then bounces to 2 nearest enemies” (`spellData.ts` 69–83): `hitsMultiple: true`, `bounces: 2`, `areaShape: "single"`, range 4, no `areaRadius`. `getAoETargets` (`castHelpers.ts` 133–141) treats **any** `hitsMultiple` spell as “all live hostiles within `playerSpellEffectiveRange` of the **click**” (`targeting.ts` 224–229, 781–788). `getEffectiveSpellRange` does not halve for Windstorm (WX 3653–3665), so CL radius is 4 (+ level bonus). `resolvePlayerCast` then calls `applyDamageToEnemy` once per that list (`spellEngine.ts` 971–1015). Bounce lives **inside** `applyDamageToEnemy` (`castHelpers.ts` 430–460) and runs per invocation: each “primary” also deals 50%/25% to the two nearest *other* hostiles via `enemyTakesDamage`. Three pawns within Chebyshev 4 of the click each take a full CL packet **and** extra bounce packets. Mirror Field 20% is gated `!spell.hitsMultiple && !spell.aoe` (`spellEngine.ts` 901–907), so the CL primary never reflects; bounce Void Mirror skip remains 10-22-002 (do not re-file). Frost Nova / Lifesteal Nova also set `hitsMultiple` (intended AoE) — this ID is CL’s bounce flag stacked on that expander. `castHelpers.aoe.test.ts` never seeds `bounces`. Distinct from 10-21-006/007 (double scale/Mark on one packet) and 10-22-002 (RES/`dmg` on the bounce number).  
EXPECTED_INTERACTION: One primary at the clicked hostile, then two bounce hits. Mirror Field can reflect the single-target primary (and cancel bounces) like Strike. Pack AoE is Frost Nova / Lifesteal Nova, not CL.  
ACTUAL_INTERACTION: CL is a range-4 pack nuke plus per-target bounce storms. Mirror Field never rolls.  
SYSTEMS_AFFECTED: Chain Lightning, hitsMultiple targeting, bounce, Mirror Field, death (each bounce can `enemyTakesDamage` lethal), Attack Nearest (shares `resolvePlayerCast`)  
RECOMMENDED_ACTION: Stop setting `hitsMultiple` on CL (keep `bounces: 2` and pass the clicked enemy as the sole `targetEnemy`), **or** skip the bounce loop when `hitsMultiple` already expanded the list. Run Mirror Field on the CL primary (`hitsMultiple` must not mean “not single-target” for bounce spells). Tests: three hostiles in a 4-tile disk ⇒ one full hit + two bounce packets total, not three full hits; Mirror Field reflect on CL primary writes player HP and does not bounce. Do not change bounce coefficients (`0.5 ** (idx+1)`).  
AUTONOMY: IMPLEMENT_HELPER_THEN_CL_FLAG  
DEPENDENCIES: 10-22-002 bounce RES/Void Mirror — fix target-set first so bounce math is applied once. Distinct from Frost Nova radius (targeting.ts 219–222).  
REGRESSION_RISK: HIGH — live CL DPS drops to the advertised 1+2 pattern. Do not also retune Frost Nova `areaRadius` here.  
VALIDATION_REQUIRED: `getAoETargets` + bounce fixture with three hostiles; playtest starter CL vs a 3-pawn pack under Mirror Field.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-23-003  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Swap (range 3 teleport) skips Paper Windstorm miss and Mirror Field; landing still has no hazard tick  
CATEGORY: teleport + range + terrain + hazards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Swap is a live player spell (`spellData.ts` 142–158): range 3, `isSwap`, `effectType: "teleport"`, damage 0. `resolvePlayerCast` swaps and returns `"cast"` (`spellEngine.ts` 767–775) **before** Mirror Field (901–907) and Windstorm (909–915). Mark at the same range sits inside that loop (928–936) so Windstorm can blow it off course; Swap never rolls. `swapPositions` (WX 9389–9401) writes player and enemy cells with no `applyBattleWalkHazards` (9906 / 10553 / 11137). Landing × lava is 08-31-001 — do not re-file the hazard half; this ID is the miss/reflect skip on a ranged teleport. Player miss spends AP (`return "cast"`). No Swap × Windstorm test. Distinct from 10-22-001 (DoT apply) and 10-21-009 (Sacrifice `dealDamage`). Barrier (range 2, also pre-loop) is the same early-return class; file Swap as the teleport pair from the matrix prompt, do not clone Barrier unless product wants ground placement to miss too.  
EXPECTED_INTERACTION: A range-3 teleport is a ranged spell: Windstorm can spend AP and leave both units in place; Mirror Field either does not apply (teleport, 0 damage) or consumes the spell without swapping. Hazard landing stays 08-31-001.  
ACTUAL_INTERACTION: Swap always commits under Windstorm. Mirror Field never rolls.  
SYSTEMS_AFFECTED: Swap, Paper Windstorm, Mirror Field, teleport, occupancy (cells swap even onto lava/portal)  
RECOMMENDED_ACTION: Run the existing Windstorm helper before `swapPositions` (miss ⇒ `"cast"`, no swap). Product call on Mirror Field: skip (document) or consume-without-swap. Do not add lava ticks here unless 08-31-001 lands in the same helper. Tests: `isPaperWindstorm` miss ⇒ positions unchanged and AP spent; Mark at range 3 still misses on the same roll helper.  
AUTONOMY: IMPLEMENT_ONE_GATE_BEFORE_SWAP  
DEPENDENCIES: 08-31-001 for landing HP. Distinct from 10-22-001 / 10-21-009.  
REGRESSION_RISK: LOW — Swap becomes missable; do not also reflect the enemy onto the player tile unless product asks.  
VALIDATION_REQUIRED: spellEngine fixture with `isPaperWindstorm`; playtest Swap vs Mark under Windstorm.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-23-004  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Ember Knight burn / Tide Shade slow and Shield RES buffs never apply on kit hits; only the Windstorm-miss Crush fallback writes them  
CATEGORY: statuses + damage + challenges + death  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Family variants spawn at 30% (`spawnPolicy.ts` 35–57, `ember_knight` / `tide_shade`). Kit damage uses `playerTakesDamage` after `getStatModifier` RES (WX 16483–16568) and never inspects `enemy.family`. Ember ignite (3 dmg/turn × 3) and Tide slow (−1 MP × 2) run only in the fallback melee `else` (16789–16821), after Shield Charm soak on Crush/Fire Bolt (16750–16766). That block uses `characterStats.res` **without** `getStatModifier` (16722–16728), so Shield’s +30% RES (`starter-shield`) does not reduce Crush, while the same bishop’s Frost Bolt does. `playerTakesDamage` also floors post-RES at 1 before soak (3429–3436); fallback soak can reach 0 HP loss (16756) and still apply burn/slow (not gated on `meleeDmg > 0`). Untouchable records only `meleeDmg > 0` (16767–16771) then fails on the next DoT tick (`playerTakesDamage` at 1952–1960). Knight kit is `physical_attack` range 1 (`ENEMY_KITS` 166): Windstorm does not roll, `didAct` becomes true, fallback never runs — a spawned `ember_knight` knight **never** ignites. The live burn path is 001’s adjacent Windstorm miss (bishop family ember) or any other `!didAct` adjacent kit. Distinct from 10-22-004 (boss `damageToPlayer` shield vs RES) and 09-29-003 (Void Mirror skip shield). No family-on-hit test.  
EXPECTED_INTERACTION: Ember Knight / Tide Shade on-hit matches the attack that actually connected (kit Strike or Frost Bolt). Shield +30% RES applies to Crush the same way it applies to kit spells. A fully absorbed hit does not ignite if product treats 0 HP as a blocked hit (or does ignite consistently on kit and fallback).  
ACTUAL_INTERACTION: Family on-hit is almost dead on the kit path; Shield RES is invisible to Crush; a 0-HP shielded Crush can still burn and later break Untouchable.  
SYSTEMS_AFFECTED: ember_knight, tide_shade, Shield buff RES, Shield Charm, fallback Crush, challenges (Untouchable), DoT ticks, death  
RECOMMENDED_ACTION: Move Ember/Tide on-hit to the kit damage success branch (and melee if a future `kind === "melee"` enemy appears). Apply `getStatModifier` RES on fallback or route Crush through `playerTakesDamage`. Gate on-hit on `actualDmg > 0` or document that absorb still counts as a hit. Tests: ember knight kit Strike applies burn; Shield 1.3 RES reduces Crush; `shieldHp` ≥ Crush and `meleeDmg === 0` ⇒ no burn if that is the product call. Do not change tick numbers (3 / −1).  
AUTONOMY: IMPLEMENT_HELPER_THEN_TWO_WX_SITES  
DEPENDENCIES: 001 if burn should not apply after a Windstorm miss. Distinct from 10-22-004.  
REGRESSION_RISK: MEDIUM — ember knights start burning on ordinary hits (intended); do not double-apply if miss fallback remains.  
VALIDATION_REQUIRED: Family kit-hit fixture; playtest Shield then adjacent ember knight Strike vs Windstorm-miss Crush.  
STATUS: NEW  
