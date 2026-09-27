# ACTION_IDs — 2026-09-27 Advanced Enemy AI Evolution Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source automation: Advanced Enemy AI Evolution Designer (`67b03c2f-a492-11f1-a7d1-d6b4613131ce`).  
Design: [`docs/ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md), [`docs/ENEMY_AI_EVOLUTION_2026-09-21.md`](../ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32 / FUT-36…47), [`docs/ENEMY_AI_EVOLUTION_2026-09-22.md`](../ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35 / FUT-48…53), [`docs/ENEMY_AI_EVOLUTION_2026-09-23.md`](../ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41 / FUT-54…59), [`docs/ENEMY_AI_EVOLUTION_2026-09-24.md`](../ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47 / FUT-60…65), [`docs/ENEMY_AI_EVOLUTION_2026-09-25.md`](../ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53 / FUT-66…71), [`docs/ENEMY_AI_EVOLUTION_2026-09-26.md`](../ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59 / FUT-72…77), [`docs/ENEMY_AI_EVOLUTION_2026-09-27.md`](../ENEMY_AI_EVOLUTION_2026-09-27.md).

This run ships **docs only**. Do not implement gameplay from these IDs unless a later human or orchestrator explicitly picks one.

Do **not** re-file AEE-2026-09-21-001…010, AEE-2026-09-22-001…007, AEE-2026-09-23-001…007, AEE-2026-09-24-001…007, AEE-2026-09-25-001…007, or AEE-2026-09-26-001…006. Those ids belong to PRs #351, #416, #458, #506, #565, and #633.

Open production slices (do not duplicate in this docs PR):

- [#495](https://github.com/Mr-Melic/stralt/pull/495) — AI-SYS-34 apply `playerPositionRef`
- [#498](https://github.com/Mr-Melic/stralt/pull/498) — AI-SYS-45 boss kit aim is not a walk dest
- [#487](https://github.com/Mr-Melic/stralt/pull/487) — betrayal death pipeline (spectacle, not a tactic)
- [#644](https://github.com/Mr-Melic/stralt/pull/644) — player drain-as-lifesteal (not an AI module)
- [#647](https://github.com/Mr-Melic/stralt/pull/647) — Soul Rend apply
- [#649](https://github.com/Mr-Melic/stralt/pull/649) — Trap tile legality
- [#654](https://github.com/Mr-Melic/stralt/pull/654) — void-hole live gate
- [#658](https://github.com/Mr-Melic/stralt/pull/658) — catalog RES/SP shreds in `getStatModifier`
- [#659](https://github.com/Mr-Melic/stralt/pull/659) — Shield RES on melee (distinct from SYS-63 `shieldHpRef`)

## Still-open IDs (line numbers confirmed 2026-09-27; not re-filed)

| ACTION_ID | Live evidence (2026-09-27) |
| :--- | :--- |
| `AEE-2026-08-31-001` | `computeAITier` `combatMath.ts` 36–52. Spawn WX **5823**. Family second roll WX **5865**. Gates WX **15508** / **15595**. |
| `AEE-2026-08-31-002` | Fire Bolt WX **16710–16715** (`e-firebolt` at **16712**). Ally heal WX **16648**. `enemyAI.ts` has **zero** `currentAp`/`currentMp`/`apCost` reads. |
| `AEE-2026-09-01-003` | Kit assign WX **11920**. |
| `AEE-2026-09-01-005` | Focus setter; `scoreTargets` unread. |
| `AEE-2026-09-01-008` | `pickBossKitSpell` still `new Map()`. |
| `AEE-2026-09-02-002` | Summon occupied empty WX **15156**. |
| `AEE-2026-09-21-002` | Healer Chebyshev-only 1099–1100. |
| `AEE-2026-09-21-004` | `findKitSpell` assigned fallback 1737–1745. |
| `AEE-2026-09-22-002` | Apply `playerPosition` WX **16438** (open #495). |
| `AEE-2026-09-24-001` | Ally `targetId` fallback Crush/Fire Bolt 16704–16715. |
| `AEE-2026-09-24-005` | Boss peer dummy AP/MP/RES WX **15444–15448**. |
| `AEE-2026-09-25-001` | Boss portal-as-floor WX **15457–15460**. |
| `AEE-2026-09-26-001` | Strip / `resolveEnemyApMp` AP=`level` WX **17402–17411**. |
| `AEE-2026-09-26-002` | Hostile summons skip executor WX **14980**. |
| `AEE-2026-09-26-003` | Boss occupancy empty WX **15430–15435**. |
| `AEE-2026-09-26-006` | SYS-59 player-tick comment WX **14313** — **superseded for pack scoring by AEE-2026-09-27-001** (pack ticks at **14646**). |

P0 remains **AEE-2026-08-31-002** then **001**. Then 09-21-002 / 004, 09-22-002 / 003, 09-23-001…005, 09-24-001…006, 09-25-001…006, 09-26-001…005. Then this file’s 001–006. Do not start FUT-78 first. Do not implement SYS-59’s “pack immunity.”

---

ACTION_ID: AEE-2026-09-27-001  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Pack/summon Plague and Void store-tick; SYS-59 pack-immunity scoring is wrong  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: SYS-59 (09-26) treated WX 14309–14324 as the only Plague apply. Pack enemies commit `PLAGUE_ZONE_TICK` to the store at WX **14646–14668** (`enemyHpAfterHazardDamage` + `updateCombatant`) after `applyTurnStart` (**14635**). Player-side summons **14449–14472**. Hostile summons **14545–14559**. `plague_zone.onTurnStart` also subtracts 1 from the turn-order row (`mapModifiers.ts` 240–245); decide reads `enemyHpMap` (WX 16277), so EV must use the store tick (2), not 1+2. FUT-76 must not treat pack HP as immune.  
RECOMMENDED_ACTION: AI-SYS-60. Score store HP after the commit. FUT-78 self-HP pressure. Do not double-count the registry hook.  
DEPENDENCIES: None for the flag; FUT-78 after SYS-60  
REGRESSION_RISK: MEDIUM if someone adds a third tick “to match the comment”  
VALIDATION_REQUIRED: TS-PLAGUEPACK, TS-PLAGUESUM  
STATUS: NEW

ACTION_ID: AEE-2026-09-27-002  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: `applyDamageDealt` never runs on pack → player hits (Glass/Vampiric)  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Sole call site WX **3499–3516** inside `applyDamageToEnemy`. Pack spell 16532+ and fallback melee 16723+ do not call `mapModifierRegistry.applyDamageDealt`. Glass Realm ×2 (`mapModifiers.ts` 337–347) and Vampiric Ground 15% (`406–414`) therefore do not modify those hits. Scoring ×2 killable-now on enemy frost would be a cheat.  
RECOMMENDED_ACTION: AI-SYS-61 + FUT-79. Flag per apply site. Do not wire the registry in this docs PR.  
DEPENDENCIES: AEE-2026-08-31-002 (apply path must stay the scoring path)  
REGRESSION_RISK: HIGH if Glass is copied onto pack hits to “feel late-game”  
VALIDATION_REQUIRED: TS-GLASSRAW, TS-VAMPRAW  
STATUS: NEW

ACTION_ID: AEE-2026-09-27-003  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Pack dest-commit ignores reserved progression cells; `isCellFree` does not destack  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `isCellFree` (`occupancy.ts` 84–98) skips `reserved`. Pack `toOccupancyContext` (`enemyAI.ts` 404–412) omits `reserved`/`progressStart`. Summon executor collects mandatory cells (WX 15208–15214) and slides (`summonExecutor.ts` 137–147). Pack `enemyDestToCommit` (`battleSetup.ts` 394–406, WX 16421–16423) writes the raw dest. SYS-27 is summon-decide reserved; SYS-58 `isCellFree` alone cannot catch a unique bridge.  
RECOMMENDED_ACTION: AI-SYS-62. Treat reserved as occupied on pack decide + dest-commit. Prefer reject over hidden slide. FUT-82 dump vs unique bridge.  
DEPENDENCIES: AEE-2026-09-21 SYS-27; AEE-2026-09-26-005 (SYS-58)  
REGRESSION_RISK: MEDIUM if destack is copied as a free extra step  
VALIDATION_REQUIRED: TS-RESERVE, TS-DUMP  
STATUS: NEW

ACTION_ID: AEE-2026-09-27-004  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Shield Charm `shieldHpRef` soak is public but missing from estimateDamage  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `shieldHpRef` soaks boss `damageToPlayer` (WX **16027–16029**) and pack fallback melee (**16750–16761**). Log prints remaining. `estimateDamage` (`enemyAI.ts` 490–508) uses spell/melee raw only. Pack **spell** apply (16532+) does not soak — keep that split. Distinct from SYS-50 Mirror and open #659 RES-on-melee.  
RECOMMENDED_ACTION: AI-SYS-63 + FUT-81. Snapshot remaining shield when HUD/log shows it. Module off if the field is missing.  
DEPENDENCIES: AEE-2026-09-01-004 (SYS-10 snapshot)  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-SHIELD  
STATUS: NEW

ACTION_ID: AEE-2026-09-27-005  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Enumerator must use `applyApCost` (Arcane Surge), never raw `apCost` or `enemy.level`  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Player preview/execute calls `mapModifierRegistry.applyApCost` (WX **10335**, **17129**, `playerCastPlan.ts`). Decide never reads `apCost`. After SYS-07, raw `spell.apCost` disagrees with Surge/Overflow (−1, min 1). SYS-54 forbids seeding AP from `enemy.level` to paper over that.  
RECOMMENDED_ACTION: AI-SYS-64. Share `resolveCastApCost`. Overflow 10% fail stays a player `onEffectApplication`, not a pack roll.  
DEPENDENCIES: AEE-2026-09-01-002 (SYS-07); AEE-2026-09-26-001 (SYS-54)  
REGRESSION_RISK: MEDIUM if Surge is applied twice  
VALIDATION_REQUIRED: TS-SURGEAP  
STATUS: NEW

ACTION_ID: AEE-2026-09-27-006  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Null Field already skips non-DoT apply; decide still picks Iron Skin / shred  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `applyActiveEffect` (WX **1873–1886**) returns early when `applyEffectApplication` is false, except DoTs. Null Field (`mapModifiers.ts` 419–432) rejects buff/debuff. Failed pick falls through to Fire Bolt (SYS-42).  
RECOMMENDED_ACTION: AI-SYS-65. Filter `availableSpells` when Null Field is public. DoTs stay legal if profiled.  
DEPENDENCIES: AEE-2026-08-31-002 / SYS-42 (no Fire Bolt on a suppressed buff)  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-NULL  
STATUS: NEW
