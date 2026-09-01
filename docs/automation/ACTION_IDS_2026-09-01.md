# ACTION_IDs — 2026-09-01 Advanced Enemy AI Evolution Designer

Durable ledger for implementers.  
Source automation: Advanced Enemy AI Evolution Designer (`67b03c2f-a492-11f1-a7d1-d6b4613131ce`).  
Design: [`docs/ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md) (T0–T5) and [`docs/ENEMY_AI_EVOLUTION_2026-09-01.md`](../ENEMY_AI_EVOLUTION_2026-09-01.md) (re-read + T6+).  
This run ships **docs only**. Do not implement gameplay from these IDs unless a later human or orchestrator explicitly picks one.

Prior open IDs (still valid; line numbers updated below): `AEE-2026-08-31-001` … `003`.

---

ACTION_ID: AEE-2026-08-31-001  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Replace `computeAITier` level bands with relative module eligibility  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `combatMath.ts` 36–52 still maps `enemyLevel` → tiers 1–10 + 30% scramble. Assigned WX 6408 / 6536. Behaviour gates `aiTier >= 5` (WX 15956) and `>= 10` (WX 16043). Brief forbids “Level X always equals AI tier Y.”  
RECOMMENDED_ACTION: Implement AI-SYS-01. Delete those integer gates.  
DEPENDENCIES: None  
REGRESSION_RISK: MEDIUM — spawn + leader-death / betrayal  
VALIDATION_REQUIRED: Same absolute enemy level, player 5 vs 50 → different attach distributions; seeded RNG deterministic.  
STATUS: OPEN  

---

ACTION_ID: AEE-2026-08-31-002  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Apply-layer honesty (Fire Bolt, AP/MP, ally heal)  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: WX 17145–17150 fallback pool still includes `e-firebolt` range 3. `decideEnemyAction` never reads `Enemy.currentAp` / `currentMp` (`gameTypes.ts` 312–316). WX 17083 heals only when `spellType === "heal" && spellRange === 0`.  
RECOMMENDED_ACTION: AI-SYS-05 before new roles. Mirror `summonExecutor.ts` 122–210.  
DEPENDENCIES: None  
REGRESSION_RISK: HIGH if WX apply is edited without tests  
VALIDATION_REQUIRED: TS-LEGAL, TS-AP, TS-MP, TS-HEAL, TS-BOLT  
STATUS: OPEN  

---

ACTION_ID: AEE-2026-08-31-003  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Explicit roles + spell score profiles (stop heal-first inference)  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `inferArchetype` 420–425 still heal-first. Kit width is currently dead (see AEE-2026-09-01-003); repairing width without SYS-04 makes queens healers again.  
RECOMMENDED_ACTION: AI-SYS-02, AI-SYS-04, AI-ROL-08.  
DEPENDENCIES: AEE-2026-08-31-002  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: TS-QUEEN, TS-DOT  
STATUS: OPEN  

---

ACTION_ID: AEE-2026-09-01-001  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Shared targeting-shape legality for enemy decide  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `findNearestLegalCastTile` (`enemyAI.ts` 762–804) checks Chebyshev ≤ `spell.range` and `lineOfSight !== false` only. Player `isTileCastableLive` (`targeting.ts` ~660+) also gates `minRange`, `linear`, `diagonal`, `freeCells`, Manhattan ground. AI LoS policy is default-on; player is opt-in (`targeting.ts` 107–114) — do not unify by turning AI LoS off.  
RECOMMENDED_ACTION: AI-SYS-06 + AI-SYS-11. Extract one helper; enumerator drops illegal dests.  
DEPENDENCIES: AEE-2026-08-31-002 (apply must not Fire-Bolt a rejected shape)  
REGRESSION_RISK: MEDIUM — linear/minRange spells become uncastable if the helper is wrong  
VALIDATION_REQUIRED: TS-LINEAR, TS-MINR, TS-LEGAL  
STATUS: NEW  

---

ACTION_ID: AEE-2026-09-01-002  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Movement budget = actual MP, not constant 3  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `computeReachable` 351 uses `ENEMY_REACHABLE_STEP_BUDGET` (3). Charger `canReach` uses `budget + 1` (1178). `Enemy.currentMp` exists but is unused. Summons already spend MP (`summonExecutor.ts` 126–131).  
RECOMMENDED_ACTION: AI-SYS-07. Missing MP ⇒ 0 walk, not silent 3.  
DEPENDENCIES: AEE-2026-08-31-002; AEE-2026-09-01-004  
REGRESSION_RISK: MEDIUM — chargers wait more often  
VALIDATION_REQUIRED: TS-MP3; charger test updated to inject `currentMp`  
STATUS: NEW  

---

ACTION_ID: AEE-2026-09-01-003  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Relative kit width — stop `Math.floor(levelZoneObject)`  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: WX 12483–12487 passes `currentMap.levelZone` (`{ name, minLevel, maxLevel }`). `buildEnemyKit` (`enemyAI.ts` 192) `Math.floor`s it → `NaN` → every kit is zone 0. `longHorizonSim.ts` 45–52 documents this. Do not substitute `minLevel` (that is a map band, not AI).  
RECOMMENDED_ACTION: AI-SYS-09. Width from SYS-01 `score`. Do not ship width without AEE-2026-08-31-003 (heal-first queens).  
DEPENDENCIES: AEE-2026-08-31-003 for role; AEE-2026-08-31-002 for apply  
REGRESSION_RISK: HIGH if width opens inferno/heal without profiles  
VALIDATION_REQUIRED: TS-KITOBJ; relative width distribution  
STATUS: NEW  

---

ACTION_ID: AEE-2026-09-01-004  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Copy public AP/MP/RES/SR/effects onto `AICombatant`  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX snapshot 16722–16751 omits them. `getEffectiveStat` on ctx is unused by `estimateDamage` 463–482. Guardian recasts shield every turn (2111–2117) because effects are invisible.  
RECOMMENDED_ACTION: AI-SYS-10. Unknown field ⇒ disable modules that need it.  
DEPENDENCIES: None  
REGRESSION_RISK: LOW if read-only  
VALIDATION_REQUIRED: RES 50 changes estimate; missing AP disables ADV-04  
STATUS: NEW  

---

ACTION_ID: AEE-2026-09-01-005  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Consume `focusTargetId` in `scoreTargets`  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Setter at `enemyAI.ts` 939 / 1525; `scoreTargets` 501–525 never reads `ctx.focusTargetId`. Charger/flanker/berserker never write it.  
RECOMMENDED_ACTION: AI-SYS-08 / TEM-01.  
DEPENDENCIES: None for the reader; roles later  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-FOCUS  
STATUS: NEW  

---

ACTION_ID: AEE-2026-09-01-006  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Isolate erratic / betrayal — do not upgrade the logged wild-cast  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX 16007–16014 logs a random spell name and does not apply it. WX 16043+ 5% betrayal + 6× enrage. Neither is a tactic.  
RECOMMENDED_ACTION: AI-SYS-12. If flavour is kept, spawn-flag + low `pMax`, not `aiTier >= 5/10`. Never turn the log into off-kit damage.  
DEPENDENCIES: AEE-2026-08-31-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-ERRATIC  
STATUS: NEW  

---

ACTION_ID: AEE-2026-09-01-007  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Cap summoner chance; kit fallback when summon is illegal  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX 12496–12498 `0.12 + characterStats.level * 0.02` reaches 1.0 at level 44. `decideSummonerAction` 1827–1873 returns skip on cap/CD; midpoint can be a wall.  
RECOMMENDED_ACTION: AI-FUT-23 + parent ROL-06. `Pmax ≈ 0.35`. Fall through to chassis kit.  
DEPENDENCIES: AEE-2026-08-31-002 if the fallback is a cast  
REGRESSION_RISK: MEDIUM — fewer late-game summoners  
VALIDATION_REQUIRED: TS-SUMCAP; cap + frost in kit → frost  
STATUS: NEW  

---

ACTION_ID: AEE-2026-09-01-008  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Boss kit respects real cooldowns; phase overlay later  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `pickBossKitSpell` (`useBossAI.ts` 38–54). Pale Archbishop 169–173 passes `new Map()` so the first pool id is always chosen.  
RECOMMENDED_ACTION: Pass the live cooldown map now. Full enumerator overlay is AI-FUT-20 (after SYS-03).  
DEPENDENCIES: None for the Map fix; FUT-20 after honesty slices  
REGRESSION_RISK: LOW for the Map fix  
VALIDATION_REQUIRED: TS-BOSSCD  
STATUS: NEW  

---

ACTION_ID: AEE-2026-09-01-009  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Do not assign unprofiled enemy-usable utilities (swap/mark/sacrifice/DoT)  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `spellData.ts` sets `usableByEnemy: true` on swap (155), mark (173), sacrifice (247), inferno (518), nova (268), enrage/haste/shield, etc. Decide `pickBestDamageSpell` requires `damage > 0`. Elite extras (`worldFeatures.ts`) draw from that flag.  
RECOMMENDED_ACTION: AI-SYS-02 + AI-FUT-17 + AI-FUT-22. Enumerator treats missing profile as illegal. Elite filter = profiled ids only.  
DEPENDENCIES: AEE-2026-08-31-002 for apply  
REGRESSION_RISK: MEDIUM — elites look less “magic” until profiles exist  
VALIDATION_REQUIRED: TS-SWAP; TS-DOT once inferno is profiled  
STATUS: NEW  

---

ACTION_ID: AEE-2026-09-01-010  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: T6+ modules are stackable scorers, not a level-900 final form  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Parent §14 was a five-row sketch. 2026-09-01 file specifies FUT-01…FUT-23 (bait, CD rotation, fake retreat, summon screen, hazard escort, next-actor, visible bar, family/reflect, hazard split, occupy exit, surround, friendly-blast, lead tile, overwatch, buff hygiene, linear corridor, elite honesty, post-player tempo, multi-hit EV, boss overlay, public miss, swap/mark/sacrifice, summoner cap).  
RECOMMENDED_ACTION: Implement only after P0 honesty + enumerator. One module per PR with `enemyAI*.test.ts`. Never `if (level >= X)`.  
DEPENDENCIES: AEE-2026-08-31-001…003; AEE-2026-09-01-001…005  
REGRESSION_RISK: HIGH if stacked before legality  
VALIDATION_REQUIRED: Per-module TEST_SCENARIOS in the 2026-09-01 doc  
STATUS: NEW  
