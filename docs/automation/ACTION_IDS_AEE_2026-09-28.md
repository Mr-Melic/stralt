# ACTION_IDs — 2026-09-28 Advanced Enemy AI Evolution Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source automation: Advanced Enemy AI Evolution Designer (`67b03c2f-a492-11f1-a7d1-d6b4613131ce`).  
Design: [`docs/ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md), [`docs/ENEMY_AI_EVOLUTION_2026-09-21.md`](../ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32 / FUT-36…47), [`docs/ENEMY_AI_EVOLUTION_2026-09-22.md`](../ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35 / FUT-48…53), [`docs/ENEMY_AI_EVOLUTION_2026-09-23.md`](../ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41 / FUT-54…59), [`docs/ENEMY_AI_EVOLUTION_2026-09-24.md`](../ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47 / FUT-60…65), [`docs/ENEMY_AI_EVOLUTION_2026-09-25.md`](../ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53 / FUT-66…71), [`docs/ENEMY_AI_EVOLUTION_2026-09-26.md`](../ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59 / FUT-72…77), [`docs/ENEMY_AI_EVOLUTION_2026-09-27.md`](../ENEMY_AI_EVOLUTION_2026-09-27.md) (open PR #689; SYS-60…65 / FUT-78…83), [`docs/ENEMY_AI_EVOLUTION_2026-09-28.md`](../ENEMY_AI_EVOLUTION_2026-09-28.md).

This run ships **docs only**. Do not implement gameplay from these IDs unless a later human or orchestrator explicitly picks one.

Do **not** re-file AEE-2026-09-21-001…010, AEE-2026-09-22-001…007, AEE-2026-09-23-001…007, AEE-2026-09-24-001…007, AEE-2026-09-25-001…007, AEE-2026-09-26-001…006, or AEE-2026-09-27-001…006. Those ids belong to PRs #351, #416, #458, #506, #565, #633, and #689.

Open production slices (do not duplicate in this docs PR):

- [#495](https://github.com/Mr-Melic/stralt/pull/495) — AI-SYS-34 apply `playerPositionRef`
- [#498](https://github.com/Mr-Melic/stralt/pull/498) — AI-SYS-45 boss kit aim is not a walk dest
- [#487](https://github.com/Mr-Melic/stralt/pull/487) — betrayal death pipeline (spectacle, not a tactic)
- [#644](https://github.com/Mr-Melic/stralt/pull/644) — player drain-as-lifesteal (not an AI module)
- [#647](https://github.com/Mr-Melic/stralt/pull/647) — Soul Rend apply
- [#649](https://github.com/Mr-Melic/stralt/pull/649) — Trap tile legality
- [#654](https://github.com/Mr-Melic/stralt/pull/654) — void-hole live gate
- [#658](https://github.com/Mr-Melic/stralt/pull/658) — catalog RES/SP shreds in `getStatModifier`
- [#659](https://github.com/Mr-Melic/stralt/pull/659) — Shield RES on melee (distinct from SYS-63 snapshot and SYS-66 spell soak)
- [#700](https://github.com/Mr-Melic/stralt/pull/700) — player auto-summon kit metadata
- [#709](https://github.com/Mr-Melic/stralt/pull/709) — Sentinel Shield on clicked ally (player, not pack SYS-05)

## Still-open IDs (line numbers confirmed 2026-09-28; not re-filed)

| ACTION_ID | Live evidence (2026-09-28) |
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
| `AEE-2026-09-23-002` | SYS-37 one-pass SP×RES — **completed for the second RES by AEE-2026-09-28-001**. |
| `AEE-2026-09-24-001` | Ally `targetId` fallback Crush/Fire Bolt 16704–16715. |
| `AEE-2026-09-24-005` | Boss peer dummy AP/MP/RES WX **15444–15448**. |
| `AEE-2026-09-25-001` | Boss portal-as-floor WX **15457–15460**. |
| `AEE-2026-09-26-001` | Strip / `resolveEnemyApMp` AP=`level` WX **17402–17411**. SYS-69 is the remaining dummy ATK/RES/SP/CHC on the same mapper. |
| `AEE-2026-09-26-002` | Hostile summons skip executor WX **14980**. |
| `AEE-2026-09-26-003` | Boss occupancy empty WX **15430–15435**. |
| `AEE-2026-09-27-001` | Pack Plague store tick WX **14646**. |
| `AEE-2026-09-27-002` | SYS-61 pack→player skips `applyDamageDealt` — **pack→summon does not; see AEE-2026-09-28-002**. |
| `AEE-2026-09-27-004` | SYS-63 shield snapshot — **spell-path “no soak” superseded by AEE-2026-09-28-001**. |

P0 remains **AEE-2026-08-31-002** then **001**. Then 09-21-002 / 004, 09-22-002 / 003, 09-23-001…005, 09-24-001…006, 09-25-001…006, 09-26-001…005, 09-27-001…006. Then this file’s 001–006. Do not start FUT-84 first. Do not implement SYS-59’s “pack immunity.”

---

ACTION_ID: AEE-2026-09-28-001  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Pack→player spells apply SP×RES then `playerTakesDamage` RES again (and soak shield)  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: SYS-37 scored `scaled * (1-SP/100) * (1-RES/100)` from WX **16475–16537**. Player hits then call `playerTakesDamage` (**16566–16569**), which multiplies by RES again (**3429–3432**, floor 1) and soaks `shieldHpRef` (**3433–3438**). SYS-63 claimed pack spells do not soak; that is false on this path. Pack apply never reads `characterStats.sr`. Killable-now with one RES pass overestimates damage.  
RECOMMENDED_ACTION: AI-SYS-66 + FUT-84. Score both RES passes + soak. Do not drop the inner RES “for AI.” Do not score SR on this hit.  
DEPENDENCIES: AEE-2026-09-23-002 (SYS-37 one-pass); AEE-2026-09-27-004 (SYS-63 snapshot, spell-path superseded)  
REGRESSION_RISK: HIGH if the second RES is removed only for enemies  
VALIDATION_REQUIRED: TS-DOUBLERES, TS-SPELLSHIELD, TS-NOSR  
STATUS: NEW

ACTION_ID: AEE-2026-09-28-002  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: `enemyTakesDamage` discards `_dmgAfterMods`; pack→summon **does** hit `applyDamageDealt`  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: SYS-61 (09-27) said pack never calls `applyDamageDealt`. Pack→player is true. Pack→wisp calls `enemyTakesDamage` (WX **16550–16557**, **16734–16742**), which always runs the registry (**3499–3516**). Store HP uses `_dmgAfterMods` (**3517**); the function returns pre-mod `dmg` (**3538**). WX `actualDmg = dmg` (**16558**). Player-summon `dealDamage` returns input amount, casterId `"player"` (**15002–15003**). Glass/Titan's therefore hit summons in the store while logs/EV that trust the return lie.  
RECOMMENDED_ACTION: AI-SYS-67 + FUT-85. Flag per apply site. KillableNow vs summons follows store HP. Do not copy Glass onto pack→player. Do not assume Titan ×5.  
DEPENDENCIES: AEE-2026-09-27-002 (SYS-61 pack→player stays)  
REGRESSION_RISK: HIGH if Glass ×2 is copied onto pack→player to “match the wisp”  
VALIDATION_REQUIRED: TS-GLASSWISP, TS-GLASSPLAYER, TS-TITANMAX  
STATUS: NEW

ACTION_ID: AEE-2026-09-28-003  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Pack melee vs player is a private HP write (raw RES, inline soak, not `playerTakesDamage`)  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Comment WX **16773–16776**. Melee uses `characterStats.res` without `getStatModifier` (**16722–16728**), soaks shield (**16750–16761**), writes HP via `setCharacterStats` (**16763–16766**). Unifying into `playerTakesDamage` without removing the inline soak double-absorbs Shield Charm. Distinct from open #659.  
RECOMMENDED_ACTION: AI-SYS-68 + FUT-86. Split EV by apply site. One soak function if unified later.  
DEPENDENCIES: AEE-2026-08-31-002 (no Fire Bolt on this fallback); AEE-2026-09-24-001 (SYS-42 opponent-only)  
REGRESSION_RISK: MEDIUM if melee is folded into `playerTakesDamage` with both soaks left in  
VALIDATION_REQUIRED: TS-MELEERES  
STATUS: NEW

ACTION_ID: AEE-2026-09-28-004  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Initiative strip dummy ATK/RES/SP/CHC must not feed SYS-10  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX **17402–17411** sets non-player `atk: e.level * 2`, `res: 0`, `sp: 0`, `chc: 2` after `resolveEnemyApMp` (SYS-54). Pack snapshot **16279–16301** omits those fields. FUT-32 / TGT-05 copying strip enemy RES 0 treats every target as unarmored.  
RECOMMENDED_ACTION: AI-SYS-69 + FUT-87. Numeric RES/SP/SR from combatant fields (SYS-10), never the dummy mapper. Module off if missing, not RES 0.  
DEPENDENCIES: AEE-2026-09-26-001 (SYS-54 AP/MP on the same row)  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-STRIP0  
STATUS: NEW

ACTION_ID: AEE-2026-09-28-005  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Paper Windstorm miss is 30% player / 50% pack; AI range is not halved  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Registry comment says reach halved (`mapModifiers.ts` 249–257) and is a no-op. Player `paperWindstormMiss` is 30% (WX **9563–9568**). Pack kit/Fire Bolt miss is 50% when `spellRange > 1` (**16491–16495**, **16729–16732**). `enemySpellRange` stays `Number(spell.range)`. FUT-21 stub must not score range-halve or a single 50% for both sides.  
RECOMMENDED_ACTION: AI-SYS-70 + FUT-88. Acting-side `pMiss`. KillableNow stays non-miss.  
DEPENDENCIES: Parent FUT-21; AEE-2026-08-31-002 (delete Fire Bolt rather than keep it as “the 50% shot”)  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-WIND50, TS-WIND30  
STATUS: NEW

ACTION_ID: AEE-2026-09-28-006  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Fury / Blood Moon / Mirror Field / Titan's Vigor are path-specific; pack frost must not inherit them  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `spellEngine.ts` **895–906** applies Blood Moon ×1.25, Fury ×1.25, Mirror Field 20% on **player** casts. Pack apply never calls `spellEngine`. Titan's `onDamageDealt` (`mapModifiers.ts` 311–315) only runs inside `applyDamageDealt` (SYS-67). Public Fury log WX **3588** / wear-off **14290** may feed ADV-01 player threat. Mirror Field ≠ SYS-50 consume-once token.  
RECOMMENDED_ACTION: AI-SYS-71 + FUT-89. Flags per apply site. Pack outgoing EV unscaled.  
DEPENDENCIES: AEE-2026-09-28-002 (Titan's / Glass site); AEE-2026-09-25 SYS-50 (distinct Mirror token)  
REGRESSION_RISK: MEDIUM if pack frost gains 1.25 “because Fury is on”  
VALIDATION_REQUIRED: TS-FURYPACK, TS-FURYTHREAT  
STATUS: NEW
