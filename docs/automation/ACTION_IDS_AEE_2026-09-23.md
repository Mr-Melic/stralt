# ACTION_IDs — 2026-09-23 Advanced Enemy AI Evolution Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source automation: Advanced Enemy AI Evolution Designer (`67b03c2f-a492-11f1-a7d1-d6b4613131ce`).  
Design: [`docs/ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md), [`docs/ENEMY_AI_EVOLUTION_2026-09-21.md`](../ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32 / FUT-36…47), [`docs/ENEMY_AI_EVOLUTION_2026-09-22.md`](../ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35 / FUT-48…53), [`docs/ENEMY_AI_EVOLUTION_2026-09-23.md`](../ENEMY_AI_EVOLUTION_2026-09-23.md).

This run ships **docs only**. Do not implement gameplay from these IDs unless a later human or orchestrator explicitly picks one.

Do **not** re-file AEE-2026-09-21-001…010 or AEE-2026-09-22-001…007. Those ids belong to PRs #351 and #416.

## Still-open IDs (line numbers confirmed 2026-09-23; not re-filed)

| ACTION_ID | Live evidence (2026-09-23) |
| :--- | :--- |
| `AEE-2026-08-31-001` | `computeAITier` `combatMath.ts` 36–52. Spawn WX **5823**. Family second roll WX **5864–5866**. Gates WX **15507** / **15594**. |
| `AEE-2026-08-31-002` | Fire Bolt WX **16710–16715**. Ally heal WX **16648**. `enemyAI.ts` has **zero** `currentAp`/`currentMp`/`apCost` reads. |
| `AEE-2026-09-01-003` | Kit assign WX **11920**. |
| `AEE-2026-09-01-005` | Focus setter 957 / 1539; `scoreTargets` unread; prepend 1682–1690. |
| `AEE-2026-09-01-008` | `pickBossKitSpell` still `new Map()`. |
| `AEE-2026-09-02-002` | Summon occupied empty WX **15156**. |
| `AEE-2026-09-21-002` | Healer Chebyshev-only 1099–1100. |
| `AEE-2026-09-21-004` | `findKitSpell` assigned fallback 1741–1745. |
| `AEE-2026-09-21-006` | Family second `computeAITier` 5864–5866. |
| `AEE-2026-09-22-001` | Summon `allyCount` WX **15175–15176**. |
| `AEE-2026-09-22-002` | Apply `playerPosition` WX **16438**. |
| `AEE-2026-09-22-003` | `estimateDamage` ignores SP; apply WX **16475–16537**. |

P0 remains **AEE-2026-08-31-002** then **001**. Then 09-21-002 / 004, 09-22-002 / 003. Then this file’s 001–006. Do not start FUT-54/59 first.

---

ACTION_ID: AEE-2026-09-23-001  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Pack snapshot `allyCount`/`enemyCount` count all `prevEnemies`, including player-side summons  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: WX 16338–16342. `decideEnemyAction` 1671–1676 filters by `side`. SYS-33 fixed summon ctx only (15175). TEM modules that read `allyCount` would count a wisp as an ally.  
RECOMMENDED_ACTION: AI-SYS-36. Same-side living units only.  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-PACKSIDE  
STATUS: NEW

ACTION_ID: AEE-2026-09-23-002  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: `getEffectiveStat` is `getStatModifier` (multiplier), not RES/SP/SR  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Pack WX 16347–16348 and summon 15183–15184 wire `getStatModifier` (`statusEffects.ts` 45–63, default `1`). 09-21 FUT-43 told implementers to read RES via this callback; 09-22 SYS-35 adds SP. Using the callback as RES treats mitigation as 1. Apply uses `characterStats.sp * modifier` (16475–16537). Do not change `calcScaledDamage`.  
RECOMMENDED_ACTION: AI-SYS-37. Snapshot numeric SP/RES/SR; modifier stays a multiplier.  
DEPENDENCIES: AEE-2026-09-01-004; AEE-2026-09-22-003  
REGRESSION_RISK: MEDIUM if EV uses modifier-as-RES  
VALIDATION_REQUIRED: TS-MODRES, TS-SPEV  
STATUS: NEW

ACTION_ID: AEE-2026-09-23-003  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: `decideHealer` selects drain via `healAmount > 0` and would damage the ally  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `decideHealer` 1095–1097. `starter-drain` has `healAmount: 5` (`spellData.ts` 104–121). Apply drain branch requires `spellDmg > 0` (16459–16462) and `enemyTakesDamage` on `resolvedTarget`.  
RECOMMENDED_ACTION: AI-SYS-38. Heal picker is `spellType === "heal"` + ally/self `targetType`. Drain self-heal stays FUT-48 on an opponent.  
DEPENDENCIES: AEE-2026-08-31-002 (no Fire Bolt if the fake heal fails)  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: TS-DRAINHEAL  
STATUS: NEW

ACTION_ID: AEE-2026-09-23-004  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Inferno DoT apply is nested under `spellDmg > 0` so `damage: 0` never burns  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `spell-inferno` `damage: 0`, `isDotSpell: true` (`spellData.ts` 502–522). DoT `applyActiveEffect` is inside the damage/drain branch (WX 16609–16625). SYS-02 EV cannot apply. Failed cast + adjacent still Fire-Bolts (FUT-41).  
RECOMMENDED_ACTION: AI-SYS-39. Category apply siblings; do not emit Inferno until the branch exists.  
DEPENDENCIES: AEE-2026-08-31-002; AEE-2026-09-01-009  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: TS-INFERNO0, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-09-23-005  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Summoner spawn short-circuit ignores range, LoS, occupancy, and AP  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX 16389–16404 returns after `spawnEnemySummonRef(action.destination)`. `decideSummonerAction` 1894–1902 uses player/ally midpoint. 09-22 FUT-49 is kit fall-through on cap/CD, not dest legality.  
RECOMMENDED_ACTION: AI-SYS-40 + FUT-56 ring scan. Illegal dest ⇒ no spawn.  
DEPENDENCIES: AEE-2026-09-22-005; SYS-13 / SYS-14 occupancy  
REGRESSION_RISK: MEDIUM if spawn is blocked with no fall-through  
VALIDATION_REQUIRED: TS-SUMMID, TS-SUMRING, TS-SUMFALL  
STATUS: NEW

ACTION_ID: AEE-2026-09-23-006  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: `inferArchetype` heal-first sees `usableByEnemy: false` Rallying Cry on assigned king kits  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: King kit `z >= 1` includes `spell-rallying-cry` (`enemyAI.ts` 181–184). Id is `usableByEnemy: false` (`spellData.ts` 432). `assignEnemySpells` WX 11919–11923 uses full `normalizedSpellPool`, not `_enemyUsableSpells` (11916–11918). `inferArchetype` 447–452 reads `assignedSpells`. Latent until SYS-09 repairs `Math.floor(levelZone)` NaN.  
RECOMMENDED_ACTION: AI-SYS-41 + SYS-04. Fallback inference ignores unusable assigned heals.  
DEPENDENCIES: AEE-2026-08-31-003; AEE-2026-09-01-003  
REGRESSION_RISK: HIGH if kit width ships without this  
VALIDATION_REQUIRED: TS-RALLYROLE, TS-QUEEN  
STATUS: NEW

ACTION_ID: AEE-2026-09-23-007  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: T6+ strafe, healer idle, summon ring, no-crit EV, kamikaze lock, ice-slip landing  
CATEGORY: combat-ai  
PRIORITY: P3  
CONFIDENCE: MEDIUM  
EVIDENCE: Last public player delta is not stored; healer 1165–1168 falls through to `decideCaster`; bomber 2387–2393 hardcodes blast radius vs Inferno `areaRadius: 0`; apply crit 16470–16473 is post-decide RNG; ice filter still equals lava (POS-04 / FUT-09).  
RECOMMENDED_ACTION: AI-FUT-54…59 after SYS-05 / SYS-36 / SYS-37 / SYS-40. Never `if (level >= X)`.  
DEPENDENCIES: AEE-2026-08-31-002; AEE-2026-09-23-001…005  
REGRESSION_RISK: HIGH if bomber radius leaks to pack Inferno; HIGH if crit is treated as certain  
VALIDATION_REQUIRED: TS-STRAFE, TS-HEALIDLE, TS-SUMRING, TS-NOCRIT, TS-NOBLAST, TS-ICESLIP  
STATUS: NEW
