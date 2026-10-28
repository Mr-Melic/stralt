# ACTION_IDs — 2026-10-28 Mechanic Interaction Matrix Auditor

Durable ledger for the Report Action Orchestrator.  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
HEAD inspected: `0f5363f` (`Merge pull request #332`)  
Gameplay code: not modified.

Do not re-file OPEN 08-31 / 09-01 / 09-02 / 09-21…09-29 / 10-21 / 10-22 / 10-23 / 10-24 / 10-25 / 10-26 / 10-27 items or this file's 001–004. Do not clone **#1173** (10-27 move/attack consume / resonance / larvae explode / reflect duration / split revive), **#1131**, **#1062**, **#1012**, **#1035**, **#1040**, **#1042**, **#852**, **#858**, **#965**, **#1058**, **#1094**, **#1152**, **#948**, **09-22-001**, **09-22-004** (dropped `newPositions` / `damageToTargets` / `newIllusions` / `newLarvae` / `newShockTiles`), or **09-02-004**. Do not invent Gravity Well / Fog of War, push/pull unwired, or a watch-enemy-cast unlock path.

---

ACTION_ID: MIMA-2026-10-28-001  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Boss `allEnemies` is `getPlayerSideTargets` ∩ `type === "enemy"` and is always empty, so occupancy, spawn caps, rays, and vampiric drain never see minions or player summons  
CATEGORY: boss phases + summons + occupancy + damage + death  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: The only `getPlayerSideTargets` call site is the boss-AI roster (`WorldExploration.tsx` 15430–15456). That helper (`summonIntegration.ts` 184–186) keeps `side === "player"` or `isPlayer`. The next filter is `c.type === "enemy"`. Player-side summons are `type: "summon"` (`combatantStore.ts` 123–138). Boss minions from `res.spawns` omit `side` / `isSummon`, so `toCombatantEntry` defaults `side: "enemy"` and `type: "enemy"` — and `getPlayerSideTargets` drops them. The player row is `type: "player"`. Intersection is **[]** every turn. `applySpawnMinions` / `applyScrollSummon` / `applyPhantomSpawn` / `applyGhostSummon` occupancy is `allEnemies` tiles + player (`useBossSystem.ts` 235–236, 1185–1188); the 19-cap is `allEnemies.length` (225–226, 1176). `moveToward` occupied set is the same empty list plus the player (90–99). Queen rays / chain / vampiric iterate `[...allEnemies, playerEntry]` (417–423, 753, 1078–1083). **09-22-004** owns WX dropping `damageToTargets`; it cannot fill ids that were never scanned. Distinct from **10-27-001** (move/attack `targetX/Y` consume). No `enemiesForBossAI` fixture.  
EXPECTED_INTERACTION: `allEnemies` is every other live combatant (boss minions, player summons, leftover hostiles). Spawn/move occupancy treats those cells as taken. The 19-cap counts them. Queen rays / chain lightning / vampiric drain include them (consume of `damageToTargets` remains 09-22-004).  
ACTUAL_INTERACTION: Abilities treat the board as boss + player only. A second scroll/phantom/split-rook can land on last turn’s minion. `moveToward` can plan through a wolf. Rays never list summon ids even after 09-22-004 lands.  
SYSTEMS_AFFECTED: every `decide*Action` `allEnemies`, minion/scroll/phantom/ghost/split occupancy, 19-cap, queen rays, chain lightning, vampiric drain, player-summon HP  
RECOMMENDED_ACTION: Build `enemiesForBossAI` from `turnOrderRef` (or live combatants) excluding the acting boss id — do not reuse `getPlayerSideTargets`. Keep player-side summons and `type: "enemy"` minions. Tests: after one `SCROLL_SUMMON`, a second spawn’s dest ≠ the live scroll cell; `ATTACK_ALL_LINES` with a wolf on a queen ray includes the wolf id in `damageToTargets`; `moveToward` will not pick an occupied minion tile. Do not change RAF.  
AUTONOMY: IMPLEMENT_ONE_ROSTER_HELPER_THEN_WX_CALL  
DEPENDENCIES: **09-22-001** for abilities to be chosen. Complements **09-22-004** (consume still required). Distinct from 10-27-001. Do not fold larva *combatant* placement (09-22-004) into this PR.  
REGRESSION_RISK: MEDIUM — stacked minions become illegal (intended); do not also block the boss’s own tile twice or fail cramped maps.  
VALIDATION_REQUIRED: Roster helper unit test (player + wolf + scroll ⇒ two non-boss entries); playtest Archivist second scroll after 001.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-28-002  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Starved Vampire VAMPIRIC_AOE always hits the player (ignores its 3-tile radius) and never heals the boss; LIFE_DRAIN’s ≥10 trigger has no HP/atk payload  
CATEGORY: boss phases + range + healing + damage + player feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `applyVampiricAoe` (`useBossSystem.ts` 1065–1108) documents “Drains HP from player + all entities within 3 tiles” and logs a 3-tile radius. `damageToPlayer` is hardcoded `drainAmount` (1074–1075) with **zero** `manhattanDistance(playerEntry, bossEntry)` test. Only `allEnemies` uses `RADIUS` (1078–1083). Guide (`BossGuideModal.tsx` 189–190) says “Spread out to reduce total healing the boss receives.” The result has no boss HP/atk field; WX consume heals nobody (16025–16040 only `damageToPlayer > 0`). Phase-2 AI fires this every even turn (`useBossAI.ts` 1270–1277). `applyLifeDrain` (1034–1062) comments “Negative damage to player = heal boss (caller applies to boss HP)” and “heals 15 HP and gains +1 attack” but the ≥10 return is only `vampirePawnDrainAccumulated: remainder` — no heal amount, no atk. AI calls it with default `damageDealtToPlayer ?? 0` (1282). Accum never reaching 10 is the **10-27-002** extras-buffer class; the empty success payload is independent. Distinct from **09-02-006** (Dawn `damageToPlayer: -10` player heal). Exsanguinated `stat: "healing"` vs `healRecv` is **#1040** / **#1035** — do not clone. No radius/heal fixture.  
EXPECTED_INTERACTION: Vampiric AoE taxes the player only when Chebyshev/Manhattan ≤ 3, drains in-radius allies, and heals the boss by the documented amount (or the guide drops “healing the boss receives”). LIFE_DRAIN at ≥10 committed player HP restores 15 boss HP and +1 atk.  
ACTUAL_INTERACTION: Map-wide 10 HP to the player every even phase-2 turn; boss HP unchanged; spreading out does nothing. LIFE_DRAIN adjacent is a log-only accumulator.  
SYSTEMS_AFFECTED: Starved Vampire Pawn, range, healing, player HP/challenges, boss atk growth, player feedback  
RECOMMENDED_ACTION: Gate `damageToPlayer` on the same RADIUS as minions; add a boss self-heal field (or `updateCombatant` HP/atk) for both VAMPIRIC_AOE and the LIFE_DRAIN ≥10 path. Pass `damageDealtToPlayer` from the hit that actually landed (that writer is 10-27-002 class — do not invent a second counter). Tests: player at dist 4 ⇒ 0 vampiric HP; dist 2 ⇒ 10 and boss HP + documented heal; LIFE_DRAIN extra 10 ⇒ +15 HP / +1 atk. Do not change Shield Charm soak of `damageToPlayer` (10-22-004).  
AUTONOMY: IMPLEMENT_RADIUS_GATE_PLUS_BOSS_HEAL_FIELD  
DEPENDENCIES: **09-22-001** + **10-26-001** for phase 2. **001** so in-radius minions exist in `allEnemies`. Distinct from 09-02-006 / 10-27-002 / #1040.  
REGRESSION_RISK: MEDIUM — kiting outside 3 tiles becomes the advertised counter (intended). Do not also fail no_healing unless product says a boss self-heal is a player heal.  
VALIDATION_REQUIRED: Ability-result fixture for radius and boss HP; playtest Vampire phase 2 after 001.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-28-003  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Weeping Pawn PROMOTE_QUEEN never selects ATTACK_ALL_LINES and never retags `pieceType`, so advertised queen range does not exist  
CATEGORY: boss phases + range + damage + player feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Phase 2 lists `PROMOTE_QUEEN` and `ATTACK_ALL_LINES` (`bossDefaults.ts` 199–208). Guide (`BossGuideModal.tsx` 139–142) says the pawn “transforms into a queen with vastly increased range” and that all-lines attacks need off-axis play. `decideWeepingPawnAction` (`useBossAI.ts` 481–504) promotes once at 30% HP, then only adjacent curse / `attackPlayer` / `moveToward` — **zero** `applyBossAbility(ATTACK_ALL_LINES)`. Starborn Queen *does* call that ability (545–549). `applyPromoteQueen` (407–414) writes `currentPhase: 2` / `phase2Triggered` only; no `pieceType`. WX kit/ability consume never writes `pieceType`. The “FULL HP RESTORED” log (15790–15794) is gated on `checkPhaseTransition` (`phase2.hpThreshold` is **0.0** here — **10-26-001**); do not re-file that heal. Distinct from **10-27-001** (melee consume of `attackPlayer`). No Weeping decision fixture.  
EXPECTED_INTERACTION: After promote, the unit is a queen for range/identity and ATTACK_ALL_LINES can fire on a later turn (same helper as Starborn). Off-axis kiting is a real counter.  
ACTUAL_INTERACTION: Log/guide claim a queen; the decide fn stays pawn melee/walk. All-lines never runs even after 09-22-001 lets promote fire.  
SYSTEMS_AFFECTED: Weeping Pawn, queen rays, range, piece identity, player feedback  
RECOMMENDED_ACTION: After `phase2Triggered`, call `ATTACK_ALL_LINES` on a cadence (copy Starborn’s adjacent/lines gate). Set live `pieceType: "queen"` on promote (store + strip). Tests: post-promote decision can return `ATTACK_ALL_LINES`; `pieceType` is queen. Do not fold 10-26-001 full-HP into this PR.  
AUTONOMY: IMPLEMENT_DECISION_BRANCH_PLUS_PIECETYPE  
DEPENDENCIES: **09-22-001** so promote is reachable. Distinct from 10-26-001 / 10-27-001. Queen-ray HP on summons still needs **001** + **09-22-004**.  
REGRESSION_RISK: MEDIUM — Weeping phase 2 becomes a Starborn-like ray threat (intended). Do not also change Starborn.  
VALIDATION_REQUIRED: `decideWeepingPawnAction` fixture with `phase2Triggered: true`; playtest promote then an off-axis tile.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-10-28-004  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Final Pawn GHOST_SUMMON announces a 5-turn window but never despawns ghosts or fails the fight when the timer hits 0  
CATEGORY: boss phases + summons + death + victory + player feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `applyGhostSummon` log (`useBossSystem.ts` 845–847) says “Defeat them all in 5 turns!” Guide (`BossGuideModal.tsx` 171–172) calls ghosts “temporary.” AI stores `invincibleTurnsLeft: 5` and decrements it on `type: "skip"` (947–989). When the counter reaches 0 the decide fn returns to phase-1 projectile/melee — **no** ghost despawn, **no** leftover-hostile check, **no** player-fail. Spawned `Enemy` objects have no `turnsRemaining` (`WorldExploration.tsx` 16104–16163). `expireSummonsAtTurnStart` only decrements `isSummon` lifespans. Incoming HP while the flag is on is **10-25-004**; spawn HP stamp 20 is **#1152** — do not clone either. Distinct from **10-27-004** (Archbishop `reflectShieldTurnsLeft` never decrements — this timer *does* decrement). No ghost-expiry fixture.  
EXPECTED_INTERACTION: At 0 turns, remaining ghosts despawn **or** the player loses if any ghost still lives **or** the log/guide drop the deadline. Ghosts that are “temporary” must carry a lifespan.  
ACTUAL_INTERACTION: Five skips later the pawn attacks again; ghosts remain as ordinary minions. Waiting does not clear them; killing them is optional.  
SYSTEMS_AFFECTED: Final Pawn, ghost minions, summon lifespan, victory leftover hostiles, player feedback  
RECOMMENDED_ACTION: Set `turnsRemaining: 5` (or `isSummon: true` + lifespan) on ghost spawns **or** on timer 0 `removeCombatant` every `ghost_*` id. If product wants a fail, trigger death when any ghost is live at 0. Tests: five decrements ⇒ ghost count 0 **or** documented fail; a live wolf is not removed. Do not change the 30% reflect tick (10-27-004) or incoming-HP gate (10-25-004).  
AUTONOMY: IMPLEMENT_GHOST_LIFESPAN_OR_TIMER_SWEEP  
DEPENDENCIES: **09-22-001** + **10-26-001** for the 10% trigger. Distinct from 10-25-004 / #1152 / 10-27-004.  
REGRESSION_RISK: LOW–MEDIUM — leftover ghosts after the window currently pad victory; despawn is the advertised rule. Do not expire the Final Pawn itself.  
VALIDATION_REQUIRED: Timer-sweep fixture with one ghost id + one wolf; playtest Final Pawn phase 2 after 001.  
STATUS: NEW  
