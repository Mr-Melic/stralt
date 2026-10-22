# ACTION_IDs — 2026-10-22 Mechanic Interaction Matrix Auditor

Durable ledger for the Report Action Orchestrator.  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
HEAD inspected: `0f5363f` (`Merge pull request #332`)  
Gameplay code: not modified.

Do not re-file OPEN / closed 08-31 / 09-01 / 09-02 / 09-21…09-29 / 10-21 items
or in-flight **#391** / **#443** / **#496** / **#528** / **#555** / **#658** /
**#692** / **#714** / **#728** / **#754** / **#763** / **#765** / **#790** /
**#799** / **#803** / **#832** / **#856**. Push/pull remain REPORT_ONLY
(08-31-005). Gravity Well / Fog of War / `applyRangeModification` unused —
do not re-file. Mark/Fury skip on Poison Arrow / Sacrifice remain 09-29-001/002.
Sacrifice miss/reflect skip remains 10-21-009. Player catalog `debuffStat`
remain **#528** / **#555**. `res_sp` shred remain **#658**.

---

ACTION_ID: MIMA-2026-10-22-001  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Player DoT apply (Poison Arrow / Inferno / Venom Strike) skips Paper Windstorm miss and Mirror Field reflect  
CATEGORY: statuses + map modifiers + range  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live player casts (`executeCastAttempt` → `resolvePlayerCast`, `WorldExploration.tsx` 17149) treat `isDotSpell` / `effectType === "dot"` as an early return (`spellEngine.ts` 777–815): `applyEffect` + log + `return "cast"` **before** Mirror Field 20% (`901–907`) and Paper Windstorm miss (`909–915`). Catalog DoTs are ranged single-target: Poison Arrow range 4 (`spellData.ts` 49–67), Inferno range 3 (`501–523`), Venom Strike range 2 (`394–415`). Windstorm consume on the damage-loop path is a 30% miss that still spends AP (`WorldExploration.tsx` 9563–9571; miss returns `"cast"`). Mark (range 4) sits **inside** that loop (`spellEngine.ts` 928–936) so Windstorm can blow it off course; Poison Arrow never rolls. Summon-control Archer Poison Arrow uses `resolveSpellCast` (`WorldExploration.tsx` 9849), whose DoT branch (`spellEngine.ts` 561–574) also never calls `paperWindstormMiss`. Attack Nearest shares `resolvePlayerCast`. Distinct from Sacrifice loop-skip (10-21-009, `dealDamage` packet) and from Mark/Fury skip on Poison (09-29-001/002). PXA owns Windstorm **announce vs 30% rate / unused range-halve**; this is a consume skip. No test asserts a DoT apply under `isPaperWindstorm` / `isMirrorField`.  
EXPECTED_INTERACTION: A ranged DoT apply is a single-target player spell: Windstorm can miss (AP spent, no poison) and Mirror Field can reflect (poison/burn lands on the caster, or the spell is consumed). Mark and Strike already use those gates.  
ACTUAL_INTERACTION: Poison / Inferno / Venom always apply on a legal click; Windstorm and Mirror Field never run. Mark at the same range can still miss.  
SYSTEMS_AFFECTED: statuses (DoT apply), Paper Windstorm, Mirror Field, Poison Arrow / Inferno / Venom Strike, Attack Nearest, summon-control kit  
RECOMMENDED_ACTION: Run the Windstorm + Mirror Field gates before the DoT `applyEffect` (same helpers as the damage loop), then apply or abort. Do not change tick numbers or DoT stacking. Tests: `isPaperWindstorm` miss ⇒ no DoT row; Mirror Field reflect ⇒ either player is poisoned or the enemy is not. Do not fold Sacrifice into this helper unless 10-21-009 is implemented in the same pass.  
AUTONOMY: IMPLEMENT_HELPER_THEN_DOT_BRANCH  
DEPENDENCIES: Distinct from 10-21-009 (Sacrifice `dealDamage`) and 09-29-001/002 (Mark/Fury). Do not change PXA’s miss rate.  
REGRESSION_RISK: MEDIUM — DoTs become missable/reflectable; self-poison on Mirror Field needs a product call (apply to caster vs consume-without-apply).  
VALIDATION_REQUIRED: spellEngine fixture with `isPaperWindstorm` / `isMirrorField`; playtest Poison Arrow under Windstorm vs Mark under Windstorm.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-22-002  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Chain Lightning bounce re-applies RES and dmg buff on an already-final packet and skips Void Mirror reflect  
CATEGORY: damage + statuses + summons  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Bounce is inside `applyDamageToEnemy` (`castHelpers.ts` 430–456): `bounceDmg = floor(finalDmg * 0.5^(idx+1))` then `enemyTakesDamage(id, bounceDmg, "player", …)`. `finalDmg` already ran `calculatePlayerDamage` (`321–330`) which applies SP, `dmg` buff, Mark, crit, SR, and RES (`WorldExploration.tsx` 3295–3364). `enemyTakesDamage` (`3472–3498`) then multiplies `incomingDamage` by the caster `dmg` buff **again** and applies target RES **again** (explicitly “RES only”, no SR). Catalog CL is `bounces: 2` (`spellData.ts` 69–83). Primary Void Mirror 25% reflect uses `preCritDmgBM` in the same helper (`castHelpers.ts` 335–346`) and records challenge HP; bounce never inspects `family === "void_mirror"`. Glass/Titans on bounce remain 09-23-001 (do not re-file). Bounce using primary `finalDmg` for Mark is a 10-21-007 leftover, not this ID. No bounce RES / Void Mirror test (`castHelpers.reflect.test.ts` covers primary reflect only).  
EXPECTED_INTERACTION: Bounce is a follow-up hit at 50%/25% of the **pre-resist** (or documented) packet, then one RES/`dmg` pass, and Void Mirror reflects bounce hits like the primary.  
ACTUAL_INTERACTION: Bounce is half of the already-resisted primary, then RES + `dmg` again. A marked/high-RES primary shrinks bounces twice; an Enrage/`dmg` buff inflates them twice. Bouncing onto a Void Mirror deals HP with no 25% reflect.  
SYSTEMS_AFFECTED: Chain Lightning, RES, `dmg` buff, Void Mirror family, death (bounce lethal via `enemyTakesDamage` 3535–3537)  
RECOMMENDED_ACTION: Bounce from the pre-RES packet (or pass a flag so `enemyTakesDamage` does not re-apply RES/`dmg`), and run the Void Mirror reflect already in `applyDamageToEnemy` per bounce target. Tests: 20 post-scale hit, target RES 50, no buff ⇒ bounce 5 not `floor(10*0.5)` then RES again; Void Mirror bounce writes player reflect HP. Do not change bounce count (`bounces: 2`) or clone **#868** / **#766**.  
AUTONOMY: IMPLEMENT_HELPER_THEN_BOUNCE_LOOP  
DEPENDENCIES: 10-21-006/007 share `calculatePlayerDamage`; fix bounce on the post-commit packet, not by adding a third `calculatePlayerDamage`. Distinct from 09-23-001 (Glass on bounce).  
REGRESSION_RISK: MEDIUM — bounce DPS changes; do not also hook Glass here unless 09-23-001 is in the same helper.  
VALIDATION_REQUIRED: `applyDamageToEnemy` fixture with two live hostiles + RES 50; playtest CL onto pawn + Void Mirror.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-22-003  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Plague Zone player tick bypasses Shield Charm and RES while DoT / enemy spells use playerTakesDamage  
CATEGORY: hazards + statuses + challenges + death  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Player turn-start Plague (`WorldExploration.tsx` 14309–14324) writes `hpAfterIncomingDamage(hp, PLAGUE_ZONE_TICK)` (2 HP, `battleSetup.ts` 285) straight into `setCharacterStats` and records the raw 2 via `recordChallengeDamageTaken`. It never calls `playerTakesDamage` (`3424–3438`), which applies RES then Shield Charm (`shieldHpRef`, 20 HP from BuffShop, 3583–3586, copy “Absorbs next 20 damage”). Poison/burn ticks on the player **do** go through `playerTakesDamage` (`1952–1960`). Enemy kit spells do too (`16566–16568`). Registry `onTurnStart` plague −1 does not hit the player: `playerTurnStartModifierTarget` only returns a `"player"` combatant (`battleSetup.ts` 364–368) and the player is not in `combatantsRef` (comment 14259–14261). 09-27-002 lists Shield Charm vs lava/spikes/Thorned/rift/Mirror Field — not Plague. 09-24-001 is store-commit vs turn-order copy. Tests lock `hpAfterIncomingDamage` math (`battleSetup.turnStart.test.ts`) but never Shield Charm remaining after a plague tick.  
EXPECTED_INTERACTION: Map-modifier HP loss that is announced as turn-start damage uses the same absorb/RES path as DoT ticks, so a 20-HP Shield Charm covers two plague ticks and high RES reduces them; Untouchable / under-N still see post-absorb HP.  
ACTUAL_INTERACTION: Shield Charm and RES are invisible to plague; Untouchable fails on a fully shielded player; poison ticks still soak.  
SYSTEMS_AFFECTED: Plague Zone, Shield Charm, RES, challenges (Untouchable / under-50 / hard_1), death (`lethal` 14325–14332)  
RECOMMENDED_ACTION: Replace the inline player plague write with `playerTakesDamage(PLAGUE_ZONE_TICK, "Plague Zone")` (keep the existing lethal / `shouldContinuePlayerTurnAfterHazard` gate). Do not change the 2 HP constant. Tests: `shieldHpRef=20` + plague ⇒ HP unchanged, shield 18; RES 50 ⇒ 1 HP recorded. Do not fold Void Rift player tick into this PR (**#443**).  
AUTONOMY: IMPLEMENT_ONE_WX_CALL  
DEPENDENCIES: None. Distinct from 09-27-002 and 09-21-001 / **#443**.  
REGRESSION_RISK: LOW — plague becomes slightly weaker with RES/shield (intended).  
VALIDATION_REQUIRED: Helper or WX-level test; playtest Shield Charm then Plague Untouchable.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-22-004  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Boss ability `damageToPlayer` soaks Shield Charm but skips RES (and SR) that enemy kit spells apply  
CATEGORY: boss phases + damage + statuses  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX applies `res.damageToPlayer > 0` (`WorldExploration.tsx` 16025–16039) as `rawDmg` → Shield Charm absorb → `setCharacterStats` HP minus remainder. No `playerTakesDamage`, so `characterStats.res` / `getStatModifier(..., "res")` never run. Enemy kit damage on the player **does** use `playerTakesDamage` after SP+RES (`16532–16568`). Several live abilities emit that packet: shock tiles (`useBossSystem.ts` 868), 5-damage ticks (894), mirror (994), drain (1075), 15-damage slam (1238). Challenge HP uses the post-shield remainder only. Distinct from 09-29-003 (Void Mirror / Reflect Shield skip **shield** via raw `setCharacterStats` in `applyDamageToEnemy`) and from 09-02-006 (Dawn `damageToPlayer: -10` ignored). No boss-ability RES test.  
EXPECTED_INTERACTION: Incoming boss HP packets share Shield Charm **and** RES with enemy spells / DoT ticks. SR stays off if the ability is physical; apply SR only when the ability is a spell hit.  
ACTUAL_INTERACTION: A 50 RES player with a full Shield Charm still takes the full post-shield boss packet; the same player reduces a bishop Frost Bolt.  
SYSTEMS_AFFECTED: boss phases, Shield Charm, RES, challenges, death (HP can hit 0 without the DoT lethal helper)  
RECOMMENDED_ACTION: After shield soak, call `playerTakesDamage(finalDmg, logSource)` **or** apply the same RES factor `playerTakesDamage` uses before the HP write, and keep the existing `> 0` gate so Dawn −10 stays 09-02-006. Tests: RES 50, shield 0, `damageToPlayer: 20` ⇒ 10 HP lost; shield 20, RES 0 ⇒ 0 HP, shield 0. Do not change ability tables.  
AUTONOMY: IMPLEMENT_ONE_WX_BRANCH  
DEPENDENCIES: Distinct from 09-29-003 and 09-02-006. Do not clone **#852** / **#850** (kit metadata).  
REGRESSION_RISK: MEDIUM — boss fights get easier with RES; do not also apply SR to physical slams.  
VALIDATION_REQUIRED: Ability-result fixture; playtest a slam with Shield Charm + high RES.  
STATUS: NEW  
