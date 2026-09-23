# ACTION_IDs — Content Diversity & Repetition Auditor 2026-09-23

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Content Diversity & Repetition Auditor.  
Audit: [`CONTENT_DIVERSITY_AUDIT_2026-09-23.md`](./CONTENT_DIVERSITY_AUDIT_2026-09-23.md).  
HEAD: `0f5363f` (unchanged since 2026-09-21 and 2026-09-22). Gameplay / production code was **not** modified this run.

Prior ledger on `main`: [`ACTION_IDS_CONTENT_DIVERSITY_2026-09-02.md`](./ACTION_IDS_CONTENT_DIVERSITY_2026-09-02.md) (`CDA-2026-09-02-001` … `015`). Line numbers below match live HEAD (same as 09-22).

Unpublished ledgers: GitHub **PR #359** (09-21, `016`–`018`) and **PR #403** (09-22, copies `016`–`018` and mints `019`). Both still **OPEN**. Do **not** mint twins. Those ids are copied here so they exist on `main` if #359/#403 never merge. Status stays **NEW** until an implementer picks them.

Do not mint twins of SDE / WDEAD / formation / family-sheet / WDD ids. Do not implement combat from this file unless a later human or orchestrator picks an ID.

---

## Status of CDA-2026-09-02-001 … 015, unpublished 016–019, and 020

| ACTION_ID | STATUS | Note |
| :--- | :--- | :--- |
| CDA-2026-09-02-001 | OPEN | Overlay in `spawnPolicy.ts`; wipe unchanged |
| CDA-2026-09-02-002 | OPEN | Still NaN. **Must ship with 006** |
| CDA-2026-09-02-003 | OPEN | No elite type; three `WF-ELT-*` unwired |
| CDA-2026-09-02-004 | OPEN | Quadrant scatter + battle-start re-scatter |
| CDA-2026-09-02-005 | OPEN | Four clone pairs unchanged |
| CDA-2026-09-02-006 | OPEN | `inferArchetype` still `healAmount > 0` |
| CDA-2026-09-02-007 | OPEN | `0.12 + 0.02 * playerLevel`; saturates at 44 |
| CDA-2026-09-02-008 | OPEN | `combinedMechanic` unread; `weeping_pawn_2` ghost |
| CDA-2026-09-02-009 | OPEN | Nine challenges; HUD honesty only |
| CDA-2026-09-02-010 | OPEN | `level_10` still fires at WX 3632 |
| CDA-2026-09-02-011 | OPEN | Slime ≡ Frozen. Blood Moon / Mirror Field **live** in `spellEngine`. Gravity / Fog empty |
| CDA-2026-09-02-012 | OPEN | Frontend 32 vs backend six + ghost boss seeds |
| CDA-2026-09-02-013 | PARTIAL | Chrome = FLAVOR LORE (`9e28cf9`). Per-row copy still lies — CDA-016 |
| CDA-2026-09-02-014 | OPEN | Dungeon extras still `[0,2,3,4,4,5]`; 52 `WF-*` unused |
| CDA-2026-09-02-015 | OPEN | `applyPushback` / `applyAttract` tests-only. REACTION is the reflect cluster (CDA-017) |
| CDA-2026-09-21-016 | NEW | Unpublished in #359. Register row honesty |
| CDA-2026-09-21-017 | NEW | Unpublished in #359. Freeze fifth reflect; first non-reflect REACTION |
| CDA-2026-09-21-018 | NEW | Unpublished in #359. Freeze WF-* until one is wired |
| CDA-2026-09-22-019 | NEW | Unpublished in #403. Freeze ENC / Wave-5 Rush *code* until 014/008 |
| CDA-2026-09-23-020 | NEW | **This run.** Freeze Wave-6 TypeScript catalogs (`worldFeatures.ts` growth, Wave-6 `EnemyFamily`, Rush Table D code) until 001/014/008/018 |

---

ACTION_ID: CDA-2026-09-02-001  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Bind live families through battle start (chassis + integer stats + unique verb)  
CATEGORY: TEAM_SYNERGY  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Seven `EnemyFamily` ids (`gameTypes.ts` 12–20). 30% overlay (`spawnPolicy.ts` 35, 279–286; WX 5862–5866) writes HP/RES/SP then battle start overwrites HP via `calcEnemyMaxHp` (3607–3612, 11970–11974, 11997) and RES/SP via `computeEnemyStats` (11872, 11898–11902). Overlay `mp`/`ap` never assigned (`spawnPolicy.ts` 14–15, 64–66). Family RES `0.05–0.75` is the wrong unit vs integer `getEnemyBaseStats` (`progression.ts` 180–186). Only ember melee burn, tide melee MP−1 (WX 16789–16821), void 25% reflect (`castHelpers.ts` 335–345) exist. Chassis stays a random chess piece (5764–5765).  
SYSTEMS_AFFECTED: `spawnPolicy.ts`; `WorldExploration.tsx` generateEnemies + battle start; family pixel hooks; `getEnemyBaseStats`  
RECOMMENDED_ACTION: On family roll, force preferred chassis, persist family HP and integer RES/SP through battle start, and keep exactly one unique verb per family. Do not add Register-only families. NEW PLAYER DECISION: “this body is a golem / rat / mirror — I change target order, damage type, and positioning,” not “same pawn, different tint.”  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: Existing Wave-1 family sheets (do not rewrite); do not retune `pickEnemyLevelFromTiers`  
REGRESSION_RISK: HIGH if family HP double-applies with `calcEnemyMaxHp`, or if 0–1 RES is persisted on the integer pipeline  
VALIDATION_REQUIRED: After overlay, combatant HP and RES at turn 0 still match the family contract; a `wraith_bishop` is a bishop kit; iron_golem RES is ≥ default integer tank, not 0.75  
STATUS: OPEN  

---

ACTION_ID: CDA-2026-09-02-002  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Pass a numeric kit band so relative level actually changes enemy tools  
CATEGORY: SPELL_DISCOVERY  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at `WorldExploration.tsx` 11920. `levelZone` is `{ name, minLevel, maxLevel }` (WX 592). `enemyAI.ts` 199 `Math.floor(levelZone)` is NaN → every kit stays band 0. Knight kit is Strike-only (`enemyAI.ts` 168). Queen/king Inferno at z≥2 never appears. `longHorizonSim.ts` 50–57 already names this.  
SYSTEMS_AFFECTED: `WorldExploration.tsx` assignEnemySpells; `enemyAI.ts` `ENEMY_KITS`  
RECOMMENDED_ACTION: Pass a number (0/1/2) derived from relative band or dungeon depth — not the object. Do not grow kits by stuffing more DAMAGE ids into band 0. NEW PLAYER DECISION: “this map’s bishops have Poison; late queens have Inferno — I bring LoS break / Mirror / focus order I did not need on band 0.”  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-005 / SDE-2026-09-01-002 (kit G); **CDA-2026-09-02-006 in the same drop** — band-1 queen kit is `[nuke, starter-heal]` and `inferArchetype` treats `healAmount > 0` as healer; CDA-2026-09-02-001 if family kits replace piece kits  
REGRESSION_RISK: MEDIUM — empty kit must still arm Strike; G=0 must not receive Inferno; HIGH if 006 is skipped (every late queen kites as a medic)  
VALIDATION_REQUIRED: Band 0 pawn = `[physical_attack]`; a numeric z≥2 queen includes `spell-inferno`; passing the live object still must not silently NaN after the fix (type the arg as `number`); a band-1 queen is not archetype healer unless 006 explicitly wants that  
STATUS: OPEN  

---

ACTION_ID: CDA-2026-09-02-003  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Add veteran/elite/champion as AI and kit floors, not HP multipliers  
CATEGORY: TEAM_SYNERGY  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: No `isElite` / variant type. Leader = highest level (`WorldExploration.tsx` 12011–12015). `computeAITier` (`combatMath.ts` 36–50) 30% uniform 1–10. `WF-ELT-BANNER_PATROL` / `WF-ELT-TOLL_KEEPER` / `WF-ELT-CART_GUARD` (`worldFeatures.ts` 452, 1011, 1489) are unwired.  
SYSTEMS_AFFECTED: spawn overlay; `enemyAI.ts` gates; `worldFeatures.ts` elite_patrol (import only after CDA-001)  
RECOMMENDED_ACTION: Second roll after level pick: BASE / VETERAN / ELITE / CHAMPION raise `aiTier` floor and unlock one extra allowed category — never a flat HP% or damage%. Reuse Wave-1 floors (1 / 3 / 6 / 8). Do not invent new persist stats. NEW PLAYER DECISION: “the banner elite will not retreat and has one extra verb — intercept, pay the toll, or leave,” not “same kit, 1.35× HP.”  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-02-001; WDEAD-2026-08-31-011; `ENEMY_ELITE_EVOLUTION_*` sheets  
REGRESSION_RISK: MEDIUM if elite is implemented as `hpMult` (repeats the family-sticker failure)  
VALIDATION_REQUIRED: Two same-family same-level bodies can differ by variant floor; champion HP formula equals BASE unless a sheet names a persist-safe integer RES/HP contract  
STATUS: OPEN  

---

ACTION_ID: CDA-2026-09-02-004  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Replace quadrant scatter with one named formation per pack  
CATEGORY: POSITIONING  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live placement is 4-quadrant + Chebyshev ≥ 4 (`WorldExploration.tsx` 5744–5763) then battle-start re-scatter ≥ 2 (`11869–11886`). Named formation catalogs and `worldFeatures.ts` encounter slots are unwired. No `formationId` in spawn.  
SYSTEMS_AFFECTED: `generateEnemies`; battle-start placement; formation catalogs  
RECOMMENDED_ACTION: Pick one already-specified formation id (protector+artillery, tank+healer, …). Do not design a new formation list. Battle start must not dissolve the shape below the teaching distance. NEW PLAYER DECISION: “the frost bishop is behind the golem — I peel, Swap in, or eat the slow if I punch the tank.”  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: Formation drop 1/2/3 docs; CDA-2026-09-02-001 (roles need families/kits)  
REGRESSION_RISK: HIGH if turn-1 surround or sealed pockets appear (formation docs already ban those)  
VALIDATION_REQUIRED: Pack of 3+ is not uniform random tiles; artillery starts Chebyshev ≥ teaching range; solvability flood-fill still reaches a portal  
STATUS: OPEN  

---

ACTION_ID: CDA-2026-09-02-005  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Collapse or truly diverge the four clone spell pairs  
CATEGORY: DAMAGE  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Shield ≡ Iron Skin (`spellData.ts` 30–47 vs 293–312: +30% RES / 3, range 3; AP 2 vs 3). Poison ≡ Venom (49–67 vs 394–415: 4×3 DoT). Expose ≈ Shadow Veil (373–393 vs 480–500: damage + `debuffStat: "res_sp"`). Blood Mend ≈ Rallying Cry (84–102 vs 416–436: self heal + +15% CHC / 2). Boss kits reuse Veil (7), Cursed Wound (6), Frost Nova (6), Swap (5). Guardian summon kit lists both Shield and Iron Skin (`spellData.ts` 593).  
SYSTEMS_AFFECTED: `spellData.ts`; `ENEMY_KITS`; `BOSS_KITS`; summon kits  
RECOMMENDED_ACTION: For each pair pick one: retire (`usableByPlayer=false` for unowned) **or** change the verb (e.g. Iron Skin = absorb buffer, Venom = AP-tax DoT, Veil = self stealth, Cry = ally-range heal). Do not add a fifth shred. NEW PLAYER DECISION: after the split, choosing Shield vs Iron Skin answers a different threat (RES% vs absorb expiry); Poison vs Venom answers range vs melee-tax.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE ownership split (do not retire an id the player never owned — AGENTS.md); CDA-2026-09-02-012 if backend Mirror clone is in scope  
REGRESSION_RISK: MEDIUM — guardian summon kit currently lists both Shield and Iron Skin  
VALIDATION_REQUIRED: `validateBossKits()` still passes; no two remaining player-facing ids share the same effectType + stat + duration + magnitude  
STATUS: OPEN  

---

ACTION_ID: CDA-2026-09-02-006  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Stop inferring healer from any healAmount; bind family AI explicitly  
CATEGORY: SUPPORT  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `inferArchetype` (`enemyAI.ts` 447–477) returns healer if `spellType === "heal"` **or** `healAmount > 0` (Life Drain, Drain Courage, Lifesteal Nova). Never returns `summoner` (WX uses `isSummoner` instead, 16375). `aiStrategy` is written `""` on boss minions at WX 16160. No family sets `"berserk"`. Knight → flanker by piece name even when kit is Strike-only.  
SYSTEMS_AFFECTED: `enemyAI.ts` inferArchetype; spawn `aiStrategy` / `aiProfile`; family sheets  
RECOMMENDED_ACTION: Healer only when `spellType === "heal"` and the heal can target an ally (Blood Mend is self — do not use it as pack support). Drain stays caster/charger. Set `aiStrategy` from family/role metadata. Keep `decideSummonerAction` on `isSummoner` but make that flag family- or role-gated (CDA-007). NEW PLAYER DECISION: “the scribe will Drain Courage from range; the wisp-cantor will walk to an ally — I do not treat every healAmount as a medic.”  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-02-001; SDE-2026-09-01-003 (aiHints); **block CDA-002 from landing alone**  
REGRESSION_RISK: HIGH if drain bishops start standing in melee because they lost healer kiting without gaining caster kiting  
VALIDATION_REQUIRED: A kit with only `starter-drain` is not archetype healer; a kit with ally Shield and no healAmount is not healer; `aiStrategy: "berserk"` on a test pawn returns berserker  
STATUS: OPEN  

---

ACTION_ID: CDA-2026-09-02-007  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Gate enemy summoners by relative zone and family, not raw player level  
CATEGORY: SUMMONING  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `ENEMY_SUMMONER_CHANCE_BASE + characterStats.level * ENEMY_SUMMONER_CHANCE_PER_LEVEL_ZONE` (`gameConstants.ts` 298–299; WX 11932–11942). Hits 1.0 at player level 44. Pets 50/50 wolf or archer only. Sentinel / bomber / wisp stay `usableByEnemy: false`. Comment says “scales with levelZone”; code uses raw level.  
SYSTEMS_AFFECTED: battle-start summoner overlay; `decideSummonerAction`; summon `usableByEnemy` flags  
RECOMMENDED_ACTION: Chance from relative band / dungeon depth, capped well below 100%. Family or role picks the pet (wolf vs archer vs, later, one flag-unlocked bomber). Do not give every late pack a summoner. NEW PLAYER DECISION: “this bone_scribe pack will add a wolf unless I kill the summoner this cadence; a proposed cantor would add a wisp — I change focus, not DPS.”  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-02-001; WDEAD-2026-08-31-012; `ENEMY_SUMMON_CAP` stays 2  
REGRESSION_RISK: MEDIUM — uncapped bomber + inferno on every pack is a new DAMAGE clone, not depth  
VALIDATION_REQUIRED: Player level 50 exploration pack is not 100% summoners; a family with no summoner sheet never rolls `isSummoner`  
STATUS: OPEN  

---

ACTION_ID: CDA-2026-09-02-008  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Execute Boss Rush combinedMechanic; replace weeping_pawn_2 ghost id  
CATEGORY: TEAM_SYNERGY  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `combinedMechanic` exists only as strings on `BOSS_RUSH_ROOMS` (`useBossRush.ts` 19–131). Grep finds no consumer. Room 9 `boss2Id: "weeping_pawn_2"` is not in `BOSS_IDS` (`bossTypes.ts` 390–410). Admin already documents the lie (`AdminDashboard.tsx` 7144). Kits remix Veil/Wound/Nova; phase 2 adds a catalog spell (`bossKits.ts` 90–92).  
SYSTEMS_AFFECTED: `useBossRush.ts`; `useBossAI.ts`; Boss Rush spawn; `BOSS_IDS`  
RECOMMENDED_ACTION: Implement the **printed** room-0 rule first (Archbishop heal / Pawn resurge) as explicit flags, not a name parse. Map `weeping_pawn_2` to `weeping_pawn` or a real second id. Do not write more combinedMechanic fiction. NEW PLAYER DECISION: “I must kill Archbishop first or the Pawn returns at 50% — target order is the fight,” which is currently flavor.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: Do not invent new BossAbility enums for text that already maps to existing tags; WDEAD-2026-08-31-008; CDA-2026-09-22-019 freeze on extra Rush rows  
REGRESSION_RISK: HIGH if resurge double-credits `applyRewards` or skips `completeBossRushRoom` index rules  
VALIDATION_REQUIRED: Room 9 loads a `BOSS_IDS` member; killing Pawn first with Archbishop alive triggers the documented resurge once; killing Archbishop first does not  
STATUS: OPEN  

---

ACTION_ID: CDA-2026-09-02-009  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Add three challenge kinds; stop shipping tighter numbers of the same verb  
CATEGORY: OBJECTIVE_PLAY  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Nine `DEFAULT_CHALLENGES` (`challengeCompletion.ts` 44–109). Three turn-count clones (15/10/5), three damage clones (50 / 30+no-heal / 0). Unique: `no_healing`, `under_8_ap_per_turn`, `direct_hit`. HUD honesty (`3e95eab`) landed; types did not.  
SYSTEMS_AFFECTED: `challengeCompletion.ts`; challenge recorders in WX; recap  
RECOMMENDED_ACTION: Add at most three new `ChallengeCondition`s, each a different category: OBJECTIVE_PLAY (ward/shrine lives), TEAM_SYNERGY (summoner dead before any pet kill, or leader first), SPELL_DISCOVERY (win after observing a non-base id — blocked until SDE split). Do not add `under_12_turns`. NEW PLAYER DECISION: “I cannot chase the rat because the shrine dies” / “I must spend the turn on the summoner” — not “win faster.”  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-02-014 for a ward token; SDE-2026-08-31-001 for discovery challenge  
REGRESSION_RISK: MEDIUM — new predicates must use existing recorders (`recordChallengeDamageTaken`, AP spend, etc.), not name heuristics  
VALIDATION_REQUIRED: Existing nine predicates unchanged; new ids fail closed if the objective token is missing  
STATUS: OPEN  

---

ACTION_ID: CDA-2026-09-02-010  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Replace grind-twin achievements with learn/observe keys; drop level_10 horizon  
CATEGORY: SPELL_DISCOVERY  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `defaultAchievements()` (`admin.mo` 309–326): `doka_1000` + `doka_10000`; `betrayal_witness` + `double_betrayal`; `level_10` (`unstoppable`) on a game with no level cap; all rewards Doka. WX still fires `level_10` at 10 (3632).  
SYSTEMS_AFFECTED: `admin.mo` defaultAchievements; WX achievement checks; AchievementsPanel  
RECOMMENDED_ACTION: Do not add a 100k Doka twin. Retire or relabel `level_10` as a relative milestone (first time relative-band ≥ N), not a cap. Prefer new keys: observe a live family verb, win a named formation peel, claim a discovered spell (after SDE). Rewards may stay Doka but must not be the only fantasy. NEW PLAYER DECISION: “I go looking for a Void Mirror to learn reflect,” not “I stand in maps until XP hits 10.”  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE discovery persist; CDA-2026-09-02-001 (family verbs must exist to observe)  
REGRESSION_RISK: LOW for new keys; MEDIUM if `level_10` is deleted while clients still call `markAchievementUnlocked("level_10")`  
VALIDATION_REQUIRED: Existing unlock ids that stay active still claim through `claimAchievementReward`; no achievement grants a spell until SDE commit exists  
STATUS: OPEN  

---

ACTION_ID: CDA-2026-09-02-011  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Differentiate slime vs frozen; stop treating Blood Moon as empty; implement or delist gravity/fog  
CATEGORY: TERRAIN  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `slime_flood` and `frozen_terrain` are identical `onMpCost: ×2` (`mapModifiers.ts` 154–172). Enemy walks now pay Frozen too (`enemyWalkMp.ts`) — honesty, not a new verb. `MAP_MODIFIERS` hooks for `blood_moon` / `mirror_field` are empty (260–277) **but** `spellEngine.ts` applies Blood Moon ×1.25 player damage (895) and Mirror Field 20% ST reflect (901–907; WX 9538–9558). `gravity_well` / `fog_of_war` flags are unused (`_isGravityWell` / `_isFogOfWar`, WX 2324–2326). Numeric reskins already exist: `titans_vigor`, `glass_realm`, `doka_fever`, **and live Blood Moon**.  
SYSTEMS_AFFECTED: `mapModifiers.ts`; `spellEngine.ts`; WX active-id branches  
RECOMMENDED_ACTION: Frozen must be ice tiles / slip, not a second slime. Sync registry hooks with live engine (Blood Moon / Mirror Field). Replace Blood Moon’s ×1.25 DAMAGE with a distinct verb **or** delist it from the two-roll. Do not re-implement Mirror Field. Gravity / fog: one distinct verb each (vision cap, attract-on-move) **or** remove from the two-roll. Do not add another ×2 damage modifier. NEW PLAYER DECISION: “Fog: I cannot snipe, I must walk in; Frozen: standing still is safer than sliding into lava.”  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: Occupancy `applyAttract` for gravity_well; do not invent damage formulas; CDA-2026-09-21-017 if anyone proposes another reflect  
REGRESSION_RISK: MEDIUM if fog hides portals (solvability) or gravity pulls onto void  
VALIDATION_REQUIRED: `slime_flood` and `frozen_terrain` produce different battle-log verbs; a listed modifier with empty hooks **and** no engine branch cannot roll; Blood Moon is either a named non-DAMAGE verb or absent from the two-roll  
STATUS: OPEN  

---

ACTION_ID: CDA-2026-09-02-012  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Unify frontend 32-id catalog and backend defaultSpells / boss seed names  
CATEGORY: SPELL_DISCOVERY  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Frontend `SPELL_ID_CATALOG` (`bossKits.ts` 29–62) = 32 ids, all treated as base (`WorldExploration.tsx` 2395–2400). Backend `defaultSpells()` (`admin.mo` 168–191) = six different ids with `linear`/`diagonal`/`hitTiles`. `defaultBossConfigs()` still lists `fireball`, `cursed_gust`, `entangle`, `mist_form` (admin.mo 349+). Live kits cannot assign those ids.  
SYSTEMS_AFFECTED: `spellData.ts`; `admin.mo` defaultSpells / defaultBossConfigs; hydrate `ownedSpells`  
RECOMMENDED_ACTION: One catalog. Backend seeds must be ids that exist in frontend metadata. Do not append Wave-2 SPELL_PROPOSALS into `starterSpells` (that makes discovery worse). NEW PLAYER DECISION: once innate vs acquired splits, “I do not own Void Collapse yet — this bishop’s frost is information,” which is impossible while 32 ids are pre-owned and six others are a parallel universe.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDE-2026-08-31-001 (innate four); SDA catalog admin; CDA-2026-09-02-005 clone pass  
REGRESSION_RISK: HIGH if hydrate drops ids players already have in `spellLevelKeys`  
VALIDATION_REQUIRED: New character innate set is the intended four (after SDE), not 32; backend seed ids ⊆ frontend catalog  
STATUS: OPEN  

---

ACTION_ID: CDA-2026-09-02-013  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Freeze new family / Register rows until the live seven bind  
CATEGORY: TEAM_SYNERGY  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Enemy Register chrome is FLAVOR LORE (`enemyRegisterCopy.ts` 6–15; `9e28cf9`; honesty banner `EnemyRegister.tsx` 356–370). Rows still list Crimson Spawn / Shadow Lurker / Storm Caller (`EnemyRegister.tsx` 71–88) that are not `EnemyFamily`. Wave 1+2+3 sheets already propose 22+ ids. Open #349 (Wave 4 elites) would add more stickers.  
SYSTEMS_AFFECTED: `EnemyRegister.tsx`; `gameTypes.ts` EnemyFamily; elite evolution docs  
RECOMMENDED_ACTION: Implementers must not add `EnemyFamily` members or Register monsters until CDA-001 is live. Wave-2/3/4 families stay docs. NEW PLAYER DECISION: none until 001 exists — this id prevents a fake decision (“new name, same Strike pawn”).  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-02-001 is the gate; CDA-2026-09-21-016 for per-row honesty of the live seven  
REGRESSION_RISK: LOW (docs/process). HIGH if ignored (content flock adds stickers).  
VALIDATION_REQUIRED: `EnemyFamily` union still the original seven + `default` until 001 ships  
STATUS: PARTIAL  

---

ACTION_ID: CDA-2026-09-02-014  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Replace dungeon extra-bodies with one wired encounter object  
CATEGORY: OBJECTIVE_PLAY  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Dungeon only adds `[0,2,3,4,4,5]` enemies and `[0,1,2,2,3,3]` tier steps (`spawnPolicy.ts` 27–28; WX 5720–5722). ENC-* catalogs and `worldFeatures.ts` (52 `WF-*` rows: shrine, teleport, elite patrol, spell-bearing enemy) are unwired. Live fight structure is always kill-all.  
SYSTEMS_AFFECTED: dungeon generateEnemies; `worldFeatures.ts` import; ENC-* (pick one)  
RECOMMENDED_ACTION: Wire **one** existing object: ENC-HOLD / ENC-PROT shrine, ENC-WAVE, or `WF-ELT-TOLL_KEEPER`. Do not write ENC-TEACH-04. Depth may pick which **object**, not how many extra pawns. NEW PLAYER DECISION: “the shrine dies if I tunnel the rat” or “I pay HP, take the long path, or fight the keeper.”  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: WDEAD-2026-08-31-005 / 007; ENC-PROT-01/02; CDA-2026-09-02-009 if a challenge overlay is added; CDA-2026-09-21-018 freeze on more WF rows; CDA-2026-09-22-019 freeze on extra ENC TypeScript  
REGRESSION_RISK: HIGH if a ward token skips `isCellFree` / challenge HP recorders  
VALIDATION_REQUIRED: A depth-2 dungeon can spawn the chosen object; extra random pawn count does not silently remain the only depth lever for that room  
STATUS: OPEN  

---

ACTION_ID: CDA-2026-09-02-015  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Fill POSITIONING gap with unused occupancy verbs; do not add another reflect  
CATEGORY: POSITIONING  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `applyPushback` / `applyAttract` (`occupancy.ts` 482, 537) have tests and no spell caller. Live POSITIONING is Swap only. REACTION is four percent-reflects: Mirror spell + Void 25% + Mirror Field 20% + boss Reflect Shield 30%. SPELL_PROPOSALS Wave 1 already reserved push, pull, delayed execute, root, real trap, absorb, redirect.  
SYSTEMS_AFFECTED: `spellData.ts` (one id at a time); occupancy callers; enemy kits only after CDA-002  
RECOMMENDED_ACTION: Consume **one** already-proposed id (push **or** attract, not both in the same drop) as metadata + occupancy call. Do not author a new shred. Do not put it on `starterSpells` (CDA-012 / SDE). Do not add a reflect. NEW PLAYER DECISION: “if I stand on this file they slam me into lava / pull me off the shrine — my tile choice is the counter,” which no current enemy kit asks.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SPELL_PROPOSALS-2026-08-31 push/attract ids; CDA-2026-09-02-012 (do not dual-catalog it); CDA-2026-09-02-002 before enemies get it; CDA-2026-09-21-017 owns non-reflect REACTION  
REGRESSION_RISK: HIGH if push ignores occupancy / hazards (MIMA landing-authority class)  
VALIDATION_REQUIRED: Spell resolves via flags not `spell.name`; landing uses `isCellFree`; lava/spike HP goes through challenge recorders  
STATUS: OPEN  

---

## Unpublished 09-21 ids (copied so they exist if PR #359 never merges)

---

ACTION_ID: CDA-2026-09-21-016  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Rewrite live-family Register rows to the three combat hooks; keep extras as proposed  
CATEGORY: TEAM_SYNERGY  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Chrome is honest (`enemyRegisterCopy.ts` 11–15: “Flavor only — not the live spawn roster”; banner `EnemyRegister.tsx` 356–370). The seven live-family rows (`EnemyRegister.tsx` 28–70) still teach wall-phase, poison-on-hit, burning tiles, adjacent slow + regen, Weaken-from-range, magic immunity until physical. Live verbs are only ember melee burn, tide melee MP−1 (WX 16789–16821), void 25% reflect (`castHelpers.ts` 335–345). Crimson / Lurker / Storm (71–88) are not `EnemyFamily`. Re-verified 2026-09-23 on HEAD `0f5363f`.  
SYSTEMS_AFFECTED: `EnemyRegister.tsx` MONSTERS copy; optionally `enemyRegisterCopy.ts`  
RECOMMENDED_ACTION: For each of the seven live ids, describe the actual combat hook or “pixel overlay only until CDA-001.” Label Crimson / Lurker / Storm as proposed/unwired in the row, not only in the header chip. Do not invent mechanics in the Register. NEW PLAYER DECISION: “I read Ember = melee burn, so I save a cleanse for the strike, not for tiles it walked” — the current row creates the opposite (wrong) decision.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-02-013 chrome; CDA-2026-09-02-001 if/when live verbs expand — then update the same rows, do not add a tenth monster  
REGRESSION_RISK: LOW (display copy). MEDIUM if copy claims a persist stat that battle start still wipes.  
VALIDATION_REQUIRED: No Register sentence for a live family names a verb grep cannot find in WX / `castHelpers.ts`; extras remain off `EnemyFamily`  
STATUS: NEW  

---

ACTION_ID: CDA-2026-09-21-017  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Freeze additional reflect clones; ship the first non-reflect REACTION  
CATEGORY: REACTION  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Four live reflects: `spell-mirror` (next ST, `spellEngine.ts` 917–926); `void_mirror` 25% of pre-crit (`castHelpers.ts` 335–345); `mirror_field` 20% ST (`spellEngine.ts` 901–907, WX 9538–9558); boss `reflectShieldActive` 30% (`castHelpers.ts` 363–375). Backend `reflect_barrier` is a fifth ghost (`admin.mo` 182). 09-02 census listed REACTION as Under; it is a numeric clone cluster. SPELL_PROPOSALS already reserved delayed execute / redirect / absorb — unused. Re-verified 2026-09-23.  
SYSTEMS_AFFECTED: `spellData.ts`; `mapModifiers.ts` Mirror Field; boss reflect shield; SDE Wave-1 redirect/absorb ids  
RECOMMENDED_ACTION: Do not add a fifth reflect (no new family, modifier, or boss shield that returns % damage). First new REACTION must be a different verb: delayed interrupt, counter-attack on move, or absorb-then-release from an existing SPELL_PROPOSALS id. Do not put it on `starterSpells`. NEW PLAYER DECISION: “I held the cast / stepped off the file because a counter would fire,” which no current reflect asks — reflects only ask “will I eat the bounce?”  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SPELL_PROPOSALS Wave 1 redirect/absorb/delayed-execute ids; CDA-2026-09-02-012; CDA-2026-09-02-015 stays POSITIONING (push/attract)  
REGRESSION_RISK: HIGH if a counter ignores occupancy or double-records challenge HP (same class as Void reflect honesty tests in `castHelpers.reflect.test.ts`)  
VALIDATION_REQUIRED: New id’s `effectType` / flags are not a percent-reflect; existing four reflects’ magnitudes unchanged; Untouchable still fails after the new reaction damages the player  
STATUS: NEW  

---

ACTION_ID: CDA-2026-09-21-018  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Freeze new world-feature rows until one existing WF-* is imported by spawn  
CATEGORY: OBJECTIVE_PLAY  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `worldFeatures.ts` holds **52** `WF-*` ids (Wave 1–3). Grep: imported only by `worldFeatures.test.ts`. WX does not import the module. 09-02 counted ~20 rows; Wave 2+3 added more unused catalog. Open #344 (Wave-4), #399 (Wave-5), and **#454 (Wave-6, +1436 lines on `worldFeatures.ts`)** would append more TypeScript rows. CDA-014 already asks to wire **one** object. Re-verified 2026-09-23: still 52 on `main` `0f5363f`.  
SYSTEMS_AFFECTED: `engine/worldFeatures.ts`; WDD / ENC design docs; dungeon `generateEnemies`  
RECOMMENDED_ACTION: Implementers must not append `WF-*` rows until CDA-014 (or equivalent) imports one existing id (`WF-ELT-TOLL_KEEPER` or `WF-ZON-SHRINE_POOL` preferred). Wave-4/5/6 world-dynamics catalogs stay docs without new TypeScript rows (#344, #399, #454). NEW PLAYER DECISION: none until one object is live — this id prevents a fake decision (“new shrine name, same kill-all pack”).  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-02-014 is the gate; do not invent a 53rd id to “teach” hold/escort; CDA-2026-09-22-019 for ENC/Rush code freeze; CDA-2026-09-23-020 for the Wave-6 TypeScript hour  
REGRESSION_RISK: LOW (process). HIGH if ignored (catalog grows while spawn stays extra pawns).  
VALIDATION_REQUIRED: `worldFeatures.ts` id count does not increase until WX (or spawnPolicy) imports one id; a depth-2 dungeon can spawn that object  
STATUS: NEW  

---

## Unpublished 09-22 id (copied so it exists if PR #403 never merges)

---

ACTION_ID: CDA-2026-09-22-019  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Freeze same-cycle ENC / Wave-5 Rush code until one encounter object and room-0 resurge exist  
CATEGORY: OBJECTIVE_PLAY  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live spawn is still extra-bodies (`spawnPolicy.ts` 27–28) and unread `combinedMechanic` (`useBossRush.ts` 19–131; room 9 `weeping_pawn_2`). 09-21 CDA PR #359 is still open 48h later. Still-open design PRs that would grow unread catalogs: Wave-4 world dynamics (#344), Tide/File/Clock ENC (#347), formations drop 4 (#348), Wave-4 elites (#349), Wave-5 boss sheets (#367), Wave-4 spell discovery (#371). Same-hour 09-22 siblings: world/dungeon/encounter admin (#394), Wick/Rime/Smoke ENC (#396), Wave-5 world dynamics (#399). Re-verified 2026-09-23: #359 and #403 still open; `BOSS_RUSH_ROOMS.length` still 10; room 9 still `weeping_pawn_2`. CDA-013/018 freeze families and `WF-*` rows; this id covers **BOSS_RUSH_ROOMS rows, generateEnemies encounter branches, and ENC TypeScript**. Wave-6 TypeScript growth is CDA-2026-09-23-020.  
SYSTEMS_AFFECTED: `useBossRush.ts` `BOSS_RUSH_ROOMS`; dungeon `generateEnemies`; ENC-* / WDEAD TypeScript if any; Wave-5 boss sheets  
RECOMMENDED_ACTION: Those PRs may land as **docs**. They must not add `BOSS_RUSH_ROOMS` entries, `combinedMechanic` strings, extra `BOSS_IDS`, or `generateEnemies` encounter branches until CDA-008 (room-0 resurge + `weeping_pawn_2` mapped) and CDA-014 (one existing ENC/WF object imported) exist. Do not write ENC-TEACH-04. NEW PLAYER DECISION: none until 008/014 — this prevents an 11th flavor dual-boss lie and a second kill-all pack with a new encounter name.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-02-008; CDA-2026-09-02-014; CDA-2026-09-21-018 (WF rows); CDA-2026-09-02-013 (families); CDA-2026-09-23-020 (Wave-6 TypeScript)  
REGRESSION_RISK: LOW (process). HIGH if ignored (Rush table grows while room 9 still ghosts; dungeon still only extra pawns).  
VALIDATION_REQUIRED: `BOSS_RUSH_ROOMS.length` stays 10 and `worldFeatures.ts` stays 52 `WF-*` until 008/014 ship; room 9 `boss2Id` is a `BOSS_IDS` member after 008  
STATUS: NEW

---

## New this run (do not twin 001–019)

---

ACTION_ID: CDA-2026-09-23-020  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Freeze Wave-6 TypeScript catalogs until one family binds, one WF-* is imported, and room-0 resurge exists  
CATEGORY: OBJECTIVE_PLAY  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Live spawn on HEAD `0f5363f` is unchanged vs 09-21/09-22: 30% family sticker (`spawnPolicy.ts` 279–286) wiped at battle start; 52 unused `WF-*` rows (WX does not import `worldFeatures.ts`); `BOSS_RUSH_ROOMS.length === 10` with unread `combinedMechanic` and room-9 `weeping_pawn_2` (`useBossRush.ts` 24–135). Same-hour 2026-09-23 flock would grow unread catalogs: Wave-6 elite sheets (#452, docs), Expansion Director (#453, docs), **Wave-6 world dynamics (#454) mutates `src/frontend/src/engine/worldFeatures.ts` (+1436 / −3) and its test file** — that is TypeScript catalog growth, not docs. Still-open Wave-5/6 Rush *docs* (#367 Table C, #406 Table D) must not become extra `BOSS_RUSH_ROOMS` rows. CDA-018 already forbids a 53rd `WF-*`; CDA-019 already forbids ENC/Rush *code*. This id names the Wave-6 hour so implementers do not treat #454 as a green light.  
SYSTEMS_AFFECTED: `engine/worldFeatures.ts`; `gameTypes.ts` `EnemyFamily`; `useBossRush.ts` `BOSS_RUSH_ROOMS`; spawn / dungeon `generateEnemies`; Wave-6 elite docs  
RECOMMENDED_ACTION: #452 / #453 / #406 / #367 may land as **docs**. #454 must not land additional `WF-*` ids until CDA-014 imports one existing id (prefer `WF-ELT-TOLL_KEEPER` or `WF-ZON-SHRINE_POOL`). Do not add Wave-6 names to `EnemyFamily` until CDA-001. Do not append Rush Table C/D as live rooms until CDA-008. Do not write ENC-TEACH-05. NEW PLAYER DECISION: none until 001/008/014 — this prevents a 53rd unread shrine name, an eighth family sticker, and an 11th dual-boss flavor lie.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-02-001; CDA-2026-09-02-008; CDA-2026-09-02-013; CDA-2026-09-02-014; CDA-2026-09-21-018; CDA-2026-09-22-019  
REGRESSION_RISK: LOW (process). HIGH if ignored (`worldFeatures.ts` grows while spawn stays extra pawns; Wave-6 families become Register-class stickers).  
VALIDATION_REQUIRED: `worldFeatures.ts` stays 52 `WF-*` ids and `EnemyFamily` stays the live seven + `default` until 001/014 ship; `BOSS_RUSH_ROOMS.length` stays 10 until 008 maps `weeping_pawn_2`  
STATUS: NEW  
