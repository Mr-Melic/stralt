# ACTION_IDs — 2026-09-22 Mechanic Interaction Matrix Auditor

Durable ledger for the Report Action Orchestrator.  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
HEAD inspected: `0f5363f` (`Merge pull request #332`)  
Gameplay code: not modified.

Do not re-file still-OPEN prior items (`MIMA-2026-08-31-001/002/005/008`, `MIMA-2026-09-01-002/006`, `MIMA-2026-09-02-002/003/004/005/006`, `MIMA-2026-09-21-001/002/003/004`). Frozen AI / execute, Wisp / Drain `healUsed`, Challenge HUD, Boss Rush feats, and Attack Nearest **origin** stay closed. Do not clone **#327** / **#370** (Striker AoE), **#331** / **#373** (portal destack), **#336** (09-21 matrix), **#376** (Dawn copy-only), **#379** (walk occupancy), **#380** (Wisp healUsed), **#382** (Shell Armor kill tracking), **#386** (victory HP floor), **#389** (Timestep / occupancy / spellbook range), **#391** (GameKey × unpaid death).

HEAD is unchanged since the 09-21 matrix. These IDs are joins that run never filed.

---

ACTION_ID: MIMA-2026-09-22-001  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Boss kit pick with an empty cooldown map always returns the first phase spell, so every special ability is unreachable  
CATEGORY: boss phases + spell discovery + summons + teleport + hazards + healing + AP  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `pickBossKitSpell` (`useBossAI.ts` 38–54) returns the first `phase1`/`phase2` `spellPoolIds` entry whose cooldown is missing or ≤ 0. The comment at 34–36 states decision functions pass `new Map()` so kits are “always considered available each turn.” Every `decide*Action` (e.g. Chessboard Lich 1116–1128, Twin Monarchs 1387–1399, Broodmother 776–788, Lord of Static 859–868, Starborn Queen 527–540) does that and `return`s `{ type: "spell", spellId }` before MAP_ROTATE / DAWN_BUFF / LARVAE_SPAWN / SPELL_MIRROR / REFLECT_SHIELD / ATTACK_ALL_LINES / SHOCK_TILES. `validateBossKits` requires 3–5 spells and non-empty phase subsets (`bossKits.ts` 714–740). Chessboard phase 1 is `spell-cursed-wound` first (512–517); Twin Monarchs is `spell-rallying-cry` (648); Broodmother is `summon-archer` (388). WX does write kit cooldown into `enemyCooldownsRef` after a successful look-up (`WorldExploration.tsx` 15830–15835) but the next decision still receives an empty map, so the same first id wins forever. `starterSpells.find` (`WorldExploration.tsx` 15814–15817) resolves those catalog ids, so the spell branch succeeds and never falls through to `abilityResult`. No `useBossAI` decision test exists. Distinct from 09-21-002 / 09-02-006 (Dawn consume, which this path never reaches) and from **#376** (log-only).  
EXPECTED_INTERACTION: Kit spells and announced phase abilities share a turn. Cooldown recorded at cast must be the map the next decision reads. A non-empty pool must not erase MAP_ROTATE, Dawn, larvae, shock tiles, or reflect.  
ACTUAL_INTERACTION: Every boss turn is the first kit id. Phase identity never runs. Player-facing guides (board rotate, Dawn blessing, larval shell, shock tiles) are dead while the log shows Cursed Wound / Rallying Cry / Summon Archer on repeat.  
SYSTEMS_AFFECTED: boss phases, kit spells, summons, teleport (MAP_ROTATE / Swap-in-kit), hazards (VOID_TILES / SHOCK_TILES), healing (Dawn), AP (BOARD_CLAIM), player feedback  
RECOMMENDED_ACTION: Pass the live `enemyCooldownsRef` map into `pickBossKitSpell`. Prefer a kit spell only when it is off cooldown **and** the decision has not reserved this turn for a phase ability (or weight kit vs ability). Do not empty the map to “always available.” Tests: Twin Monarchs phase 1 with `spell-rallying-cry` in the pool still returns `DAWN_BUFF` on turn 3; Chessboard Lich phase 1 still returns `MAP_ROTATE` at least once per three turns; Broodmother still returns `LARVAE_SPAWN` on an odd turn. Do not change kit spell math or RAF.  
AUTONOMY: IMPLEMENT_HELPER_THEN_DECISION_CALL_SITES  
DEPENDENCIES: None. After this lands, 09-21-002 / 09-02-006 / 09-02-004 and 09-22-003/004 become reachable. Do not fold those consume gaps into this PR.  
REGRESSION_RISK: MEDIUM — bosses that currently only kit-cast will start using abilities; keep kit spells legal on off-ability turns.  
VALIDATION_REQUIRED: Decision-fn fixtures per boss id; playtest Chessboard Lich and Twin Monarchs for one ability firing.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-22-002  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Boss kit execute ignores spell range, LoS, and ground targeting — always the player tile  
CATEGORY: boss phases + range + LoS + summons + damage + challenges  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Decision functions set `targetX/Y` to the player tile (`useBossAI.ts` 1125–1127, 1396–1398). WX kit execute (`WorldExploration.tsx` 15813–15870) looks up `starterSpells` and immediately calls `playerTakesDamage` for `damage`/`drain` or `spawnEnemySummonRef` for summons. There is no Chebyshev/`getEffectiveSpellRange` gate, no `playerSpellRequiresLos` / `hasLineOfSight`, and no `computeTargetableTiles`. `spell-cursed-wound` is range 3 (`spellData.ts` 468) and is Chessboard Lich’s every-turn kit id. `summon-archer` is `targetType: "ground"` range 2 (`spellData.ts` 612–629) but the dest is the player cell; occupancy then slides via `findNearestFreeCell` (hazard-blind — 09-02-002, do not re-file). Enemy AI / player preview still honour range + LoS (`targeting.ts`). Untouchable / under-N-damage therefore fail from a map-wide 22 damage kit that a range-3 spell should not reach. Distinct from 09-21-003 (player-side summon AI × Striker) and from **#327** (player AoE beyond 2).  
EXPECTED_INTERACTION: A kit spell uses the same range and LoS metadata as a player or regular-enemy cast of that id. Summon kits pick a free ground cell within range of the **boss**, not the player tile.  
ACTUAL_INTERACTION: Every kit hit is global. Summons request the player cell. Challenges and death see damage that range rules would have blocked.  
SYSTEMS_AFFECTED: boss kit execute, range, LoS, summons (hostile spawn dest), challenges (Untouchable / under-50), damage  
RECOMMENDED_ACTION: Before `playerTakesDamage` / `spawnEnemySummon`, reject (or walk-then-cast) when Chebyshev(boss, dest) > `Number(spell.range)` or when `spell.lineOfSight` and LoS fails. For `targetType: "ground"` summons, pass a free cell adjacent to the boss (reuse `getAdjacentTiles` / occupancy). Tests: Cursed Wound from Chebyshev 6 does not debit player HP; Archer spawn dest is within 2 of the boss and not the player tile when a neighbour is free. Do not change player targeting.  
AUTONOMY: IMPLEMENT_ONE_WX_KIT_GATE  
DEPENDENCIES: Independent of 001 (this is the live path). Distinct from 09-02-002 hazard slide.  
REGRESSION_RISK: MEDIUM — bosses will need to close before range-3 kits land; do not also disable melee.  
VALIDATION_REQUIRED: Kit-execute fixture with a distant player; playtest Lich vs a kiting player.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-22-003  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Boss `playerApModifier` is applied on the boss turn and overwritten by the next player-turn formula restore  
CATEGORY: boss phases + AP + MP + player feedback + challenges  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: WX applies every nonzero `res.playerApModifier` with `setCurrentBattleApSynced(prev => max(0, prev + mod))` during the boss ability branch (`WorldExploration.tsx` 16041–16046). `applyDawnBuff` roll 0 returns `playerApModifier: 2` “+2 AP” (`useBossSystem.ts` 1283–1288); roll 2 returns `playerApModifier: 1` (09-21-002 mislabel — do not re-file); `applyBoardClaim` returns `playerApModifier: -2` when the player is inside the new 2×2 and comments “if inside it on their turn” (`useBossSystem.ts` 949–972); `applyApDrain` returns `-1`. Player turn start then ignores `prev` and sets AP/MP to `getPlayerBaseStats` + `getStatModifier` only (`WorldExploration.tsx` 14346–14365). Boss modifiers are not written as active effects, so `apMod` is 0. The blessing/drain is visible on the HUD during the boss turn and gone when the player can act. Distinct from 09-21-002 (MP vs AP label) and **#376** (copy-only). Unreachable until 001 lets Dawn / BOARD_CLAIM fire.  
EXPECTED_INTERACTION: A boss AP/MP blessing or drain that is announced for “this turn” is still present when the player’s next turn starts, **or** it is applied as an active-effect `ap`/`mp` modifier the restore already reads. BOARD_CLAIM should test occupancy on the **player** turn, not leftover AP on the boss turn.  
ACTUAL_INTERACTION: Formula restore wins. Dawn +2, claim −2, and AP drain never change the actionable pool.  
SYSTEMS_AFFECTED: boss phases (Dawn, BOARD_CLAIM, AP drain), AP, MP (Dawn leftover), player feedback, hard_3 AP-peak (if drain were real)  
RECOMMENDED_ACTION: Push `playerApModifier` into a one-turn active effect (`stat: "ap"`) before restore, **or** add it into the turn-start `apMod` from `bossState`. Move BOARD_CLAIM’s −2 check to player turn start using `boardClaimZone`. Tests: Dawn roll 0 ⇒ next player `currentBattleAp === base + 2`; claim while standing in zone ⇒ next player AP is `base - 2`; turn-start restore without a boss mod is unchanged. Do not change `PLAYER_BASE_AP`.  
AUTONOMY: IMPLEMENT_ONE_EFFECT_OR_RESTORE_TERM  
DEPENDENCIES: MIMA-2026-09-22-001 (otherwise the branch never runs). Do not fold 09-21-002 / 09-02-006 into this change.  
REGRESSION_RISK: LOW if only the next-turn pool changes; MEDIUM if leftover mid-boss-turn AP is also kept after End Turn.  
VALIDATION_REQUIRED: Ability + turn-start fixture; playtest Twin Monarchs after 001.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-22-004  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: WX ability consume drops `newPositions`, `damageToTargets`, `newIllusions`, `newLarvae`, and `newShockTiles`  
CATEGORY: boss phases + teleport + occupancy + summons + hazards + damage + death  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `BossAbilityResult` (`bossTypes.ts` 311–349) includes `newPositions`, `newIllusions`, `newLarvae`, `newShockTiles`, `newVoidTiles`, `damageToTargets`, `reflectedDamage`. WX consume (`WorldExploration.tsx` 16021–16103) reads `newBossPosition`, `damageToPlayer > 0`, `playerApModifier`, `debuffsApplied`, `dotApplied`, `newBossState`, `newHazardTiles`, `spawns`, `endsTurn` only. `newPositions` is assigned in `applyMapRotate` / `applyMirrorInvert` (player + every non-boss enemy; `useBossSystem.ts` 903–921) and `applyTwinFlank` (synthetic id `twin_${bossId}`, 586–600) — zero WX reads. `applyAttackAllLines` / `applyChainLightning` fill `damageToTargets` for non-player combatants (417–442, 738–781); player HP is the only apply. `applyIllusionSplit` writes `newIllusions` + `newBossState.illusions` (301–335); `illusionsRef` is only cleared in cleanup (`WorldExploration.tsx` 11663) and never populated. `applyLarvaeSpawn` writes `newLarvae` + `bossState.larvae` (667–672); no combatant, so the player cannot step-explode or kill larvae; `SHELL_ARMOR` latches once `larvae.length > 0` (`castHelpers.ts` 351–360). `applyShockTiles` stores coords in `newBossState.activeShockTiles` (710–735) but never `hazardTiles`; walk landing is still lava/ice/spikes only. Distinct from 09-02-004 (`newVoidTiles` / type `"void"` in `hazardTiles`) and from **#382** (Shell Armor kill-tracking once larvae exist). Unreachable for rotate/larvae/shock until 001.  
EXPECTED_INTERACTION: Structured ability results become occupancy, HP, and painted hazards, or the log does not claim a board rotate / twin flank / illusion / larva / shock tile. Player-side summons in a queen ray take the same damage as the player.  
ACTUAL_INTERACTION: Merge + boss self-move + player-only damage. Board rotate only teleports the boss to (7,7) if the ability ever fires; illusions and larvae are state-only; shock tiles are invisible; summons in a ray take 0.  
SYSTEMS_AFFECTED: boss phases, teleport, occupancy, summons, hazards, damage, death, player feedback  
RECOMMENDED_ACTION: One consume helper: apply `newPositions` through `updateCombatant` / `setPlayerPositionSynced` (then `applyHazardLanding` from 08-31-001); `damageToTargets` through `updateCombatant` + `processCombatantDeath`; `newIllusions` / `newLarvae` through `addCombatant` (or draw + `isCellFree` blockers); `newShockTiles` into `hazardTiles` or a walk tick. Tests: MAP_ROTATE moves the player; ATTACK_ALL_LINES damages a summon on the ray; LARVAE_SPAWN adds a targetable occupant; a step on a shock tile matches the log. Do not change RAF.  
AUTONOMY: IMPLEMENT_ONE_WX_CONSUME_HELPER  
DEPENDENCIES: MIMA-2026-09-22-001 for reachability. Reuse 08-31-001 landing. Do not clone 09-02-004 void or **#382**.  
REGRESSION_RISK: MEDIUM — board rotate can stack or seal corridors; prefer slide-off occupancy over hard fail.  
VALIDATION_REQUIRED: Ability-result fixture; playtest Lich rotate and Broodmother larva after 001.  
STATUS: NEW  
