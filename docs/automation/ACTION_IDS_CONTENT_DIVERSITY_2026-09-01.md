# ACTION_IDs — 2026-09-01 Content Diversity & Repetition Auditor

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Content Diversity & Repetition Auditor.  
Audit: [`CONTENT_DIVERSITY_AUDIT_2026-09-01.md`](./CONTENT_DIVERSITY_AUDIT_2026-09-01.md).  
**Gameplay / production code was not modified this run.**

Do not implement from this file unless a later human or orchestrator explicitly picks an ID.

Sibling IDs to consume, not duplicate: `SDA-2026-08-31-*` (spell ownership / discovery), `EBA-2026-08-31-*` (admin spawn schema), Expansion `PREREQ-A`–`C` (kit band NaN, level-999 clamp, summoner saturation), PX combinedMechanic REWORK (`ACTION_IDS_2026-08-31.md`).

Every record names the **NEW PLAYER DECISION** it creates. None add HP/damage reskins.

---

ACTION_ID: CDA-2026-09-01-001  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Persist family through combat and bind kit, AI profile, and one combat hook  
CATEGORY: TEAM_SYNERGY  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `generateEnemies` writes a 30% family overlay (`WorldExploration.tsx` 6447–6537) then battle start overwrites HP via `calcEnemyMaxHp(level)` (12533–12561) and `res`/`sp` via `computeEnemyStats(level, pieceType)` (12424–12466). Overlay `mp`/`ap` are never applied. `buildEnemyKit` keys on `pieceType` only (`enemyAI.ts` 156–193). `inferArchetype` never reads a family contract (420–449). Live hooks are only ember melee burn, tide melee MP−1, void 25% reflect (`WorldExploration.tsx` 17224–17255; `castHelpers.ts` 327–336). Four families are art-only.  
SYSTEMS_AFFECTED: new `engine/enemyFamily.ts` (table); `WorldExploration.tsx` generateEnemies + battle start (call-site only); `enemyAI.ts` inferArchetype; `combatMath.ts` / `progression.ts` if stats must accept family  
RECOMMENDED_ACTION: Each `EnemyFamily` declares `aiProfile`, extra kit ids, and one metadata hook (already-true for ember/tide/void). Battle start must not wipe family HP/RES/SP. Do not invent name heuristics. Do not add Crimson Spawn / Shadow Lurker / Storm Caller until this binds. NEW PLAYER DECISION: “This is a golem — kite / stagger / ignore poison,” not “same Strike kit, purple pixels.”  
AUTONOMY: HUMAN_APPROVE — touches battle-start HP authority; extract helpers, do not grow WorldExploration.  
DEPENDENCIES: CDA-2026-09-01-002 (kit band must be numeric or family extras also stay on band 0); CDA-2026-09-01-013  
REGRESSION_RISK: HIGH if family HP stacks with `calcEnemyMaxHp` (double-thick golems) or RES stays 0–1 fractions while combat expects 0–100.  
VALIDATION_REQUIRED: Spawn an `iron_golem` rook; after battle start, `family` is still `iron_golem`, HP ≠ `calcEnemyMaxHp(level)` alone, kit includes the family extra, AI is the declared profile. A `default` pawn is unchanged. Unit tests; no PocketIC.  
STATUS: NEW  

---

ACTION_ID: CDA-2026-09-01-002  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Pass a numeric kit band from relative enemy level, not `levelZone` object  
CATEGORY: SPELL_DISCOVERY  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 12484). `levelZone` is `{ name, minLevel, maxLevel }` (5265, 5816). `buildEnemyKit` does `Math.floor(levelZone)` (`enemyAI.ts` 192) → `NaN` → every `z >= 1` fails. Every overworld enemy is stuck on the one-spell band-0 kit. Knight has no band-1 row at all (161). Same bug as Expansion PREREQ-A; still live at `dd275aa`.  
SYSTEMS_AFFECTED: `WorldExploration.tsx` assignEnemySpells; `enemyAI.ts` `buildEnemyKit`; tests on `buildEnemyKit`  
RECOMMENDED_ACTION: Pass `floor((enemy.level - 1) / tierSize)` or an explicit 0/1/2 band derived after `pickEnemyLevelFromTiers`. Keep existing kit rows. Do not treat a band as a character level cap. NEW PLAYER DECISION: “This equal-tier rook has Iron Skin — burn through the window or ignore it”; mid-band bishops add Poison, so the player chooses cleanse vs rush.  
AUTONOMY: HUMAN_APPROVE — one-line call-site + unit test; still a combat kit change.  
DEPENDENCIES: None. Sibling: Expansion PREREQ-A.  
REGRESSION_RISK: MEDIUM — suddenly every mid-tier queen self-heals (`inferArchetype` will reclassify her as healer). Must ship with CDA-2026-09-01-013 or drain/heal inference will swallow artillery.  
VALIDATION_REQUIRED: `buildEnemyKit("rook", 0)` is Strike only; `buildEnemyKit("rook", 1)` includes `spell-iron-skin`. Battle start on a level-15 enemy against a level-12 player is not band 0. `pnpm typecheck` + `pnpm check`.  
STATUS: NEW  

---

ACTION_ID: CDA-2026-09-01-003  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Diverge or retire the four clone spell pairs  
CATEGORY: STATUS  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Shield (`spellData.ts` 30–47) and Iron Skin (293–312) are +30% RES / 3 turns. Poison Arrow (48–67) and Venom Strike (394–415) are 4 DoT × 3, no upfront. Expose (373–393) and Shadow Veil (480–500) are damage + RES+SP shred. Blood Mend (84–102) and Rallying Cry (416–436) are self-heal +15% CHC / 2 turns. Guardian kit lists both Shield and Iron Skin (593).  
SYSTEMS_AFFECTED: `data/spellData.ts`; boss kits that list both of a pair; summon kits; Enemy Register copy  
RECOMMENDED_ACTION: Do not add a fifth DoT or a third drain. For each pair, either (a) delete one id from the live pool or (b) change **behavior**, not ±2 damage: e.g. Iron Skin physical-only, Venom stacks, Shadow Veil is a self-buff that shreds the next attacker, Rallying Cry is ally-AoE and `usableByEnemy: true`. NEW PLAYER DECISION: the player picks a spell because it answers a different question (who it hits, what it stacks with, what it fails against), not because the name changed.  
AUTONOMY: HUMAN_APPROVE — kit and upgrade persist keys (`spellLevelKeys`) must migrate if an id is retired.  
DEPENDENCIES: SDA-2026-08-31-001 (catalog metadata); CDA-2026-09-01-011 if boss kits drop a clone  
REGRESSION_RISK: MEDIUM — retiring an id the bar still holds blanks a slot. Diverging Iron Skin changes rook band-1 and Alabaster.  
VALIDATION_REQUIRED: Fixture: each remaining id has a unique (effectType, targetType, buffStat/debuffStat, duration) tuple. Guardian kit does not carry two RES clones.  
STATUS: NEW  

---

ACTION_ID: CDA-2026-09-01-004  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Ship one named formation (protector + artillery) from existing pieces  
CATEGORY: POSITIONING  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Placement is 4 quadrants + Chebyshev ≥ 4 (`WorldExploration.tsx` 6323–6442). Piece per slot is uniform random (6350–6351). `docs/design/ENEMY_FORMATIONS_2026-08-31.md` is PROPOSED. No formation id is read at spawn.  
SYSTEMS_AFFECTED: new `engine/enemyFormations.ts`; `WorldExploration.tsx` generateEnemies (composer call after solvability, not a mapGen rewrite)  
RECOMMENDED_ACTION: Implement **one** sheet (e.g. `FORM-CELL-PROTECT-ARTILLERY`: rook/`iron_golem` front, bishop/`wraith_bishop` back, optional pawn). Place roles with existing occupancy helpers. Do not rewrite `mapGen.ts`. Do not add sprites. NEW PLAYER DECISION: “Do I kill the bishop first, or is the rook going to body-block until I displace?”  
AUTONOMY: HUMAN_APPROVE — spawn composition; must `finalizePlayableLayout` after place.  
DEPENDENCIES: CDA-2026-09-01-001 (family must mean something); CDA-2026-09-01-002 (artillery kit must actually be frost)  
REGRESSION_RISK: MEDIUM — packed backliners can seal a corridor if occupancy is skipped.  
VALIDATION_REQUIRED: Solvability tests still pass. Pack of 3 has one charger/tank and one ranged caster on opposite sides of the player spawn, not four random pieces.  
STATUS: NEW  

---

ACTION_ID: CDA-2026-09-01-005  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Elite as a role overlay (bodyguard / patrol), not +HP  
CATEGORY: TEAM_SYNERGY  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: No elite/champion type. Leader = highest level (`WorldExploration.tsx` 12574–12579). `worldFeatures.ts` 441–459 describes `elite_patrol` (4–6 tile loop, hard reward). WorldExploration does not import `worldFeatures`.  
SYSTEMS_AFFECTED: `engine/worldFeatures.ts` (already designed); spawn + overworld wander; `applyRewards` multiplier only  
RECOMMENDED_ACTION: Add an `eliteRole` (`bodyguard` | `patrol`) rolled after level. Bodyguard uses existing charger AI and prefers tiles adjacent to the designated backliner. Patrol uses the existing wander loop with banner dots. Reward is a multiplier on `computeVictoryExp` / Doka via `applyRewards`, never `updateCharacter`. Do not multiply HP. NEW PLAYER DECISION: “Peel the elite off the caster, intercept the loop when it is far from the exit, or never touch it.”  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-01-004 (a backliner must exist to bodyguard); EBA-2026-08-31-001 if elite becomes an admin tag  
REGRESSION_RISK: MEDIUM — patrol loop must not spawn on portals; bodyguard must not stack on the backliner (occupancy).  
VALIDATION_REQUIRED: Elite kill pays the hard multiplier once through `applyRewards`. Patrol does not start combat until touch. No HP delta vs a non-elite of the same level/piece.  
STATUS: NEW  

---

ACTION_ID: CDA-2026-09-01-006  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Add one challenge that is not a turn-count or damage-taken clone  
CATEGORY: OBJECTIVE_PLAY  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `DEFAULT_CHALLENGES` (`challengeCompletion.ts` 38–103): three `under_N_turns`, three damage/untouchable, two no-heal, one AP cap, one Chebyshev≤2. Predicates are correct; the verbs repeat.  
SYSTEMS_AFFECTED: `utils/challengeCompletion.ts`; `ChallengePanel.tsx`; WX challenge roll (12775)  
RECOMMENDED_ACTION: Add **one** condition with explicit metadata, e.g. `no_hazard_step` (never take lava/spike/thorn/rift), `leave_summoner_last`, or `interrupt_cast` (damage the caster during a telegraph already in `BossAbility`). Do not add `under_20_turns` or `under_40_damage`. NEW PLAYER DECISION: the overlay forces a mid-fight plan change (path around lava, save the summoner, spend a turn to interrupt) instead of “go faster / get hit less.”  
AUTONOMY: HUMAN_APPROVE — challenge credit is persist-sensitive (`handleBattleEnd`).  
DEPENDENCIES: None for `no_hazard_step` (walk damage already recorded). `interrupt_cast` needs an existing telegraph.  
REGRESSION_RISK: MEDIUM if a new flag is set out of battle (same class as old `healUsed` / overworld lava).  
VALIDATION_REQUIRED: Unit tests on the new predicate; existing nine still pass `challengeCompletion.test.ts`. Reward only on victory via `applyRewards`.  
STATUS: NEW  

---

ACTION_ID: CDA-2026-09-01-007  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Wire or delete Boss Rush `combinedMechanic` and `weeping_pawn_2`  
CATEGORY: TEAM_SYNERGY  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `BOSS_RUSH_ROOMS` (`useBossRush.ts` 24–135) stores unique flavor strings. Repo grep: field is only declared and populated. Room 9 `boss2Id` is `weeping_pawn_2` (not in `BOSS_IDS` 390–410). `completeBossRushRoom` ignores client `dokaReward`/`xpReward` (AGENTS.md). Enemy Register repeats pair rules (`EnemyRegister.tsx` 86–150).  
SYSTEMS_AFFECTED: `hooks/useBossRush.ts`; `useBossSystem.ts` only if wiring real pair rules; `EnemyRegister.tsx`; Boss Guide  
RECOMMENDED_ACTION: REWORK. Either (a) replace strings with `mechanicIds` that map 1:1 to existing `BossAbility` handlers and show them on the pre-fight banner, or (b) delete `combinedMechanic` and Register pair tips. Do not leave “Kill Archbishop first or Pawn resurges” as a rule the engine does not run. NEW PLAYER DECISION: if wired — “I must choose a kill order because the survivor does X”; if deleted — the player stops planning a fake pair rule.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: Sibling PX REWORK in `ACTION_IDS_2026-08-31.md`. EBA room schema if admin owns Rush.  
REGRESSION_RISK: HIGH if a heal-on-ally or decoy-king rule is inferred from names. MEDIUM if `weeping_pawn_2` is spawned as a missing config.  
VALIDATION_REQUIRED: Grep `combinedMechanic` after (b) is zero, or after (a) each id has a test that the pair rule fires. Room 9 second id is a real `BossId`.  
STATUS: NEW  

---

ACTION_ID: CDA-2026-09-01-008  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Cap summoner chance on tier and assign the role explicitly  
CATEGORY: SUMMONING  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `summonerChance = 0.12 + characterStats.level * 0.02` (`WorldExploration.tsx` 12496–12506; `gameConstants.ts` 298–299). At player level 44 the chance is 1.0. Kit is wolf or archer only. `inferArchetype` never returns `summoner` (`enemyAI.ts` 420–449) even though the union includes it (85).  
SYSTEMS_AFFECTED: `gameConstants.ts`; `WorldExploration.tsx` summoner roll; `enemyAI.ts`  
RECOMMENDED_ACTION: Use player **tier** (or an asymptotic curve). Keep `ENEMY_SUMMON_CAP`. Set `aiProfile: "summoner"` on the flagged unit instead of a random extra spell on any piece. NEW PLAYER DECISION: “There is one summoner — focus it before the board fills,” not “every late pack grows wolves.”  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: Expansion PREREQ-C; CDA-2026-09-01-013  
REGRESSION_RISK: LOW if the cap only lowers frequency. MEDIUM if existing high-level saves expected every enemy to summon.  
VALIDATION_REQUIRED: At player level 50, a pack of 6 has at most one summoner in a seeded test. `decideSummonerAction` still respects cap/cooldown.  
STATUS: NEW  

---

ACTION_ID: CDA-2026-09-01-009  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Replace grind milestones with family / modifier / discovery achievement conditions  
CATEGORY: SPELL_DISCOVERY  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `defaultAchievements()` (`admin.mo` 309–325) is 15 one-shots: first win, 1 HP, spell level 5, 1k/10k Doka, 25 maps, betrayal, leader, jackpot, loot 10, double betrayal, **level 10**, 8 spells equipped, 5 crits, pacifist. No family, modifier, formation, or observe condition. `unstoppable` is a capped milestone on an uncapped XP curve.  
SYSTEMS_AFFECTED: `src/backend/lib/admin.mo` seeds; achievement unlock call sites; Feats panel  
RECOMMENDED_ACTION: Add conditions that name live metadata (`family === void_mirror`, `activeModifier === null_field`, `observedSpellId`). Soft-retire or reword `level_10` so it is not a content cap. Doka rewards stay on `claimAchievementReward`. NEW PLAYER DECISION: “I will hunt a Void Mirror under Null Field to unlock the feat,” not “I will stand in maps until level 10.”  
AUTONOMY: HUMAN_APPROVE — persist + client-asserted unlock (`markAchievementUnlocked`) is already a known integrity issue.  
DEPENDENCIES: CDA-2026-09-01-001 (family must survive combat); SDA-2026-08-31-004 (observe path) for discovery feats  
REGRESSION_RISK: MEDIUM — new conditions that never fire look like dead Feats. Do not grant from name strings.  
VALIDATION_REQUIRED: Unlock fixture uses `family` / modifier id, not display name. Existing 15 still claimable.  
STATUS: NEW  

---

ACTION_ID: CDA-2026-09-01-010  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Make Enemy Register honest (remove unwired lore and proposed-only families)  
CATEGORY: SPELL_DISCOVERY  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Register (`EnemyRegister.tsx` 22–83) claims wall-phase, poison stacks, burn trails, regen, Weaken, magic immunity, plus Crimson Spawn / Shadow Lurker / Storm Caller — none are `EnemyFamily` and three live hooks do not match the text. Boss tips describe pair rules that `combinedMechanic` also fails to run (86–150).  
SYSTEMS_AFFECTED: `components/EnemyRegister.tsx`; optional Boss Guide  
RECOMMENDED_ACTION: Rewrite each row to the live hook (or “stat token only”). Delete the three proposed families until CDA-2026-09-01-001 ships a hook for them. Boss tips may list `BossAbility` enums that `useBossSystem` actually dispatches. NEW PLAYER DECISION: the player can plan from the book (“void reflects 25% — open with a small hit”) instead of executing a fake script.  
AUTONOMY: AUTO — copy-only, no combat. Still HUMAN_APPROVE if anyone wants to keep lore as aspiration.  
DEPENDENCIES: CDA-2026-09-01-007 for pair tips  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Every Register mechanic sentence greps to a live `family ===` or `BossAbility` handler.  
STATUS: NEW  

---

ACTION_ID: CDA-2026-09-01-011  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Cut Shadow Veil / Cursed Wound / Frost Nova reuse on bosses that already have a unique ability  
CATEGORY: DAMAGE  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Kit counts at `dd275aa`: Shadow Veil 7 kits, Cursed Wound 6, Frost Nova 6, Swap 5 (`data/bossKits.ts`). `BossAbility` enums are unique and dispatched (`useBossSystem.ts` 1533+). Phase 2 is “add a catalog spell” (validator 742–749). Midnight Bishop, Chessboard Lich, Mirror Sovereign, and Enthroned Void all stack Veil+Swap+Nova/Mark.  
SYSTEMS_AFFECTED: `data/bossKits.ts`; `bossDefaults.ts` phase pools  
RECOMMENDED_ACTION: For each boss that already has a distinctive `BossAbility` (board shrink, larvae, illusions, lava trail, knight jump), drop Veil/Wound/Nova if another catalog id can carry the theme (Barrier, Timestep, Mark, Haste, a summon the boss does not already share). Do not invent effect types. Do not add a 20th boss. NEW PLAYER DECISION: “This fight is larvae + shell, not another RES shred,” so the player brings cleanse vs displacement vs focus-fire — one answer per boss, not the same shred kit.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-01-003 if a replacement id is a current clone  
REGRESSION_RISK: MEDIUM — AI that inferred caster from Veil range may change archetype.  
VALIDATION_REQUIRED: `validateBossKits()` still passes. No two remaining kits share more than one of {cursed-wound, shadow-veil, frost-nova}.  
STATUS: NEW  

---

ACTION_ID: CDA-2026-09-01-012  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Add one OBJECTIVE_PLAY dungeon beat (hold portal or escort token)  
CATEGORY: OBJECTIVE_PLAY  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Dungeon difficulty is extra enemy count + `dungeonTierBoost * tierSize` (`WorldExploration.tsx` 6291–6366). Portals stay locked while hostiles remain (ARCHITECTURE). No `encounterType`. `ENCOUNTER_EVOLUTION_2026-08-31.md` ENC-PROT-01 / ENC-SURV-01 are PROPOSED.  
SYSTEMS_AFFECTED: new encounter metadata module; dungeon-chain refs (`snapshotDungeonChain` / `decideDungeonChainPortal`); WX portal lock  
RECOMMENDED_ACTION: Implement **one** depth-3 beat: either a living token that must reach the exit (escort) or a portal that stays locked for N turns after the last kill (hold). Use existing tiles and occupancy. Rewards through `applyRewards` only. Do not add enemy level as the lever. NEW PLAYER DECISION: “Do I race the escort and leave a caster up, or clear first and fail the clock?”  
AUTONOMY: HUMAN_APPROVE — portal lock is a run-structure change.  
DEPENDENCIES: Maps must stay solvable (`finalizePlayableLayout`). Do not edit map-generation algorithms.  
REGRESSION_RISK: HIGH if a wave room clears the last hostile too early and unlocks the portal.  
VALIDATION_REQUIRED: Depth-3 dungeon of this type cannot exit before the objective; rest-exit still re-arms depth 1. Solvability tests pass.  
STATUS: NEW  

---

ACTION_ID: CDA-2026-09-01-013  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Infer AI from explicit `aiProfile`; drain spells must not classify as healer  
CATEGORY: SUPPORT  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `inferArchetype` (`enemyAI.ts` 422–425) returns `healer` if any assigned spell has `spellType === "heal"` or `healAmount > 0`. `starter-drain`, `spell-drain-courage`, and `spell-lifesteal-nova` all set `healAmount`. Queen band 1 adds `starter-heal` and becomes a healer even if she is meant as artillery. `summoner` is on the union (85) and is never returned. Berserker requires `family` to contain `"berserk"` (442) — no family does.  
SYSTEMS_AFFECTED: `enemyAI.ts` inferArchetype; Enemy / CombatantEntry type (`aiProfile`); battle-start assignment  
RECOMMENDED_ACTION: Prefer `enemy.aiProfile` when set. Heal inference must require `spellType === "heal"` and must ignore drain. Map `isSummoner` → `summoner`. NEW PLAYER DECISION: “The drain queen is a glass cannon I can race; the mend queen is the one I interrupt” — two different targets, not one mis-tagged healer.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-01-001 (family writes `aiProfile`); CDA-2026-09-01-002 (band 1 heal actually appears)  
REGRESSION_RISK: MEDIUM — existing packs that relied on drain-as-healer will press instead of mend. That is the intended fix.  
VALIDATION_REQUIRED: Fixture: kit `[starter-drain]` → not healer. Kit `[starter-heal]` → healer. `isSummoner` → summoner. `pnpm check`.  
STATUS: NEW  

---

ACTION_ID: CDA-2026-09-01-014  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Wire or retire placeholder modifiers; split slime flood from frozen terrain  
CATEGORY: TERRAIN  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `slime_flood` and `frozen_terrain` both double MP (`mapModifiers.ts` 155–172). `blood_moon`, `mirror_field`, `gravity_well`, `fog_of_war` are empty hooks (260–296). Titan's Vigor / Glass Realm / Doka Fever are HP/damage amplifiers. Admin labels promise +25% dmg / 20% reflect / vision shroud (`AdminDashboard.tsx` 4482–4494).  
SYSTEMS_AFFECTED: `engine/mapModifiers.ts`; WX active-id branches for timer/range; Admin labels  
RECOMMENDED_ACTION: Either implement one placeholder as a **new verb** (fog = shrink targeting range / hide enemy intents; gravity = extra step cost toward a tile; blood moon = heal received ×0.75 and damage ×1.25 via existing hook points) or delete the id from the roll pool and Admin list. Give frozen a different hook than slime (e.g. ice hazard seed, already a tile type). Do not add another ×2 damage modifier. NEW PLAYER DECISION: “Fog means I must close; ice means I pay to reposition; slime is the same tax I already know” — three answers, not one MP doubler with three names.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None. Do not invent name-based hazard logic.  
REGRESSION_RISK: MEDIUM if fog hides targeting without updating Attack Nearest. LOW if ids are only removed from the roll pool.  
VALIDATION_REQUIRED: `mapModifiers.cost.test.ts` no longer treats slime+frozen as a stacked ×4 unless that is an explicit design. Each remaining id has a non-empty hook or a documented WX branch.  
STATUS: NEW  

---

ACTION_ID: CDA-2026-09-01-015  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Ship one TEAM_SYNERGY pair using existing art (golem rook + wraith bishop)  
CATEGORY: TEAM_SYNERGY  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Packs do not coordinate roles. Leader is highest level. Rallying Cry is self-targeted and `usableByEnemy: false` (`spellData.ts` 416–436) but sits on the king kit (`enemyAI.ts` 174–177). Formation catalog ROLE-PROTECTOR + ROLE-ARTILLERY is PROPOSED.  
SYSTEMS_AFFECTED: formation composer (CDA-2026-09-01-004); `spell-rallying-cry` `usableByEnemy` if court support is desired; AI ally-heal already exists for `healer`  
RECOMMENDED_ACTION: After 001+004, seed one pair: iron_golem rook (charger, Iron Skin on the bishop when wounded) + wraith_bishop bishop (frost, keep range ≥ 3). Reuse `ENEMY_HEAL_ALLY_THRESHOLD_PCT` / shield-ally behavior already in healer/guardian AI. Do not add a new spell. NEW PLAYER DECISION: “If I ignore the rook, the bishop lives forever behind armor; if I ignore the bishop, I eat frost every turn.”  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-01-001; CDA-2026-09-01-004; CDA-2026-09-01-013  
REGRESSION_RISK: LOW if limited to a named formation id. MEDIUM if Rallying Cry is flipped `usableByEnemy` globally (king band 1 becomes a team heal).  
VALIDATION_REQUIRED: In the named pair, the rook’s first defensive cast targets the bishop when the bishop is under the heal/armor threshold. Random packs unchanged.  
STATUS: NEW  
