# ACTION_IDs — 2026-09-29 Advanced Enemy AI Evolution Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source automation: Advanced Enemy AI Evolution Designer (`67b03c2f-a492-11f1-a7d1-d6b4613131ce`).  
Design: [`docs/ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md), [`docs/ENEMY_AI_EVOLUTION_2026-09-21.md`](../ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32 / FUT-36…47), [`docs/ENEMY_AI_EVOLUTION_2026-09-22.md`](../ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35 / FUT-48…53), [`docs/ENEMY_AI_EVOLUTION_2026-09-23.md`](../ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41 / FUT-54…59), [`docs/ENEMY_AI_EVOLUTION_2026-09-24.md`](../ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47 / FUT-60…65), [`docs/ENEMY_AI_EVOLUTION_2026-09-25.md`](../ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53 / FUT-66…71), [`docs/ENEMY_AI_EVOLUTION_2026-09-26.md`](../ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59 / FUT-72…77), [`docs/ENEMY_AI_EVOLUTION_2026-09-27.md`](../ENEMY_AI_EVOLUTION_2026-09-27.md) (open PR #689; SYS-60…65 / FUT-78…83), [`docs/ENEMY_AI_EVOLUTION_2026-09-28.md`](../ENEMY_AI_EVOLUTION_2026-09-28.md) (open PR #723; SYS-66…71 / FUT-84…89), [`docs/ENEMY_AI_EVOLUTION_2026-09-29.md`](../ENEMY_AI_EVOLUTION_2026-09-29.md).

This run ships **docs only**. Do not implement gameplay from these IDs unless a later human or orchestrator explicitly picks one.

Do **not** re-file AEE-2026-09-21-001…010, AEE-2026-09-22-001…007, AEE-2026-09-23-001…007, AEE-2026-09-24-001…007, AEE-2026-09-25-001…007, AEE-2026-09-26-001…006, AEE-2026-09-27-001…006, or AEE-2026-09-28-001…006. Those ids belong to PRs #351, #416, #458, #506, #565, #633, #689, and #723.

Open production slices (do not duplicate in this docs PR):

- [#495](https://github.com/Mr-Melic/stralt/pull/495) — AI-SYS-34 apply `playerPositionRef`
- [#498](https://github.com/Mr-Melic/stralt/pull/498) — AI-SYS-45 boss kit aim is not a walk dest
- [#487](https://github.com/Mr-Melic/stralt/pull/487) — betrayal death pipeline (spectacle, not a tactic)
- [#644](https://github.com/Mr-Melic/stralt/pull/644) — player drain-as-lifesteal (not an AI module)
- [#647](https://github.com/Mr-Melic/stralt/pull/647) — Soul Rend apply
- [#649](https://github.com/Mr-Melic/stralt/pull/649) — Trap tile legality
- [#654](https://github.com/Mr-Melic/stralt/pull/654) — void-hole live gate
- [#658](https://github.com/Mr-Melic/stralt/pull/658) — catalog RES/SP shreds in `getStatModifier`
- [#659](https://github.com/Mr-Melic/stralt/pull/659) — Shield RES on melee (distinct from SYS-63 / SYS-66 / SYS-68)
- [#700](https://github.com/Mr-Melic/stralt/pull/700) — player auto-summon kit metadata
- [#709](https://github.com/Mr-Melic/stralt/pull/709) — Sentinel Shield on clicked ally (player, not pack SYS-05)

## Still-open IDs (line numbers confirmed 2026-09-29; not re-filed)

| ACTION_ID | Live evidence (2026-09-29) |
| :--- | :--- |
| `AEE-2026-08-31-001` | `computeAITier` `combatMath.ts` 36–52. Spawn WX **5823**. Family second roll WX **5865**. Gates WX **15508** / **15595**. |
| `AEE-2026-08-31-002` | Fire Bolt WX **16710–16715** (`e-firebolt` at **16712**). Ally heal WX **16648**. `enemyAI.ts` has **zero** `currentAp`/`currentMp`/`apCost` reads. Fallback also uses `level/5` (**16716–16720**) — SYS-72. |
| `AEE-2026-09-01-003` | Kit assign WX **11920**. |
| `AEE-2026-09-01-005` | Focus setter; `scoreTargets` unread. |
| `AEE-2026-09-01-008` | `pickBossKitSpell` still `new Map()` (`useBossAI.ts` 169–173). |
| `AEE-2026-09-02-002` | Summon occupied empty WX **15156**. |
| `AEE-2026-09-21-002` | Healer Chebyshev-only 1099–1100. |
| `AEE-2026-09-21-004` | `findKitSpell` assigned fallback 1737–1745. |
| `AEE-2026-09-22-002` | Apply `playerPosition` WX **16438** (open #495). |
| `AEE-2026-09-24-001` | Ally `targetId` fallback Crush/Fire Bolt 16704–16715. |
| `AEE-2026-09-26-001` | Strip / `resolveEnemyApMp` AP=`level` WX **17402–17411**. |
| `AEE-2026-09-26-002` | Hostile summons skip executor WX **14980**. |
| `AEE-2026-09-28-001` | SYS-66 double RES + shield on pack→player spells. |
| `AEE-2026-09-28-002` | SYS-67 `enemyTakesDamage` return vs store. |
| `AEE-2026-09-28-003` | SYS-68 melee private write. |
| `AEE-2026-09-28-005` | SYS-70 Windstorm 30/50 — **CD-on-miss is AEE-2026-09-29-004**. |

P0 remains **AEE-2026-08-31-002** then **001**. Then 09-21…09-28 honesty. Then this file’s 001–006. Do not start FUT-90 first. Do not implement SYS-59’s “pack immunity.” Do not add `enemy.level` into `calcScaledDamage` as an AI slice.

---

ACTION_ID: AEE-2026-09-29-001  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Kit-spell EV uses `calcScaledDamage` (level unused); Crush/Fire Bolt uses `level/5`  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `calcScaledDamage` (`combatMath.ts` 130–137) ignores `_casterLevel`. Pack apply passes upgrade 0 (WX **16464–16468**). `estimateDamage` matches for `damage > 0` (`enemyAI.ts` 501–508). Null melee uses `12 * level/5` (**495–499**). Fallback Crush/Fire Bolt uses `fb.damage * max(1, enemy.level/5)` (**16716–16720**). Late-game frost does not scale; the cheat bolt does.  
RECOMMENDED_ACTION: AI-SYS-72 + FUT-91. Split EV. Delete `e-firebolt` via AEE-2026-08-31-002 rather than keeping it as the scaling path. Do not patch `calcScaledDamage` in the AI PR.  
DEPENDENCIES: AEE-2026-08-31-002 (remove bolt)  
REGRESSION_RISK: HIGH if Fire Bolt is kept “so high-level fights hurt”  
VALIDATION_REQUIRED: TS-KITLVL, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-09-29-002  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: `pickEnemyLevelFromTiers` must not clamp at absolute 999  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `combatMath.ts` **54–58** `maxTier = Math.floor(999 / ts)`. Default `tierSize` 10 → enemy levels forced near ≤ 1000. Player level is unbounded. Parent §4 `peer = log2(enemy/player)` then goes negative → SYS-01 attaches tutorial modules to “endgame” packs. Comment at **102** claims no last-tier cap; `maxTier` is that cap.  
RECOMMENDED_ACTION: AI-SYS-73 + FUT-92. Draw around current player tier with no absolute ceiling. Do not replace 999 with another constant. Do not use `computeAITier` bands as a workaround.  
DEPENDENCIES: AEE-2026-08-31-001 (SYS-01 sigmoid needs honest `enemy.level`)  
REGRESSION_RISK: MEDIUM for tests that assumed `level <= 1000`  
VALIDATION_REQUIRED: TS-SPAWN999, TS-PEER3K  
STATUS: NEW

ACTION_ID: AEE-2026-09-29-003  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Mirror reflect is a fourth HP pipeline (`dmgAC`, attacker RES, `enemyHpMap`)  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX **16496–16528**. Reflects post-crit `dmgAC` with `getStatModifier(..., activeEffects)` not `activeEffectsRef` (**16507** vs **16478–16490**). HP from `enemyHpMap` (**16511**), not `enemyTakesDamage` / `liveCombatantHp`. Glass/Titan's (SYS-67) do not run. `battleSetup.ts` **227–231** documents the stale-map + lava bug this write caused. SYS-50 is token visibility; this is apply math. Distinct from FUT-86 (melee vs frost).  
RECOMMENDED_ACTION: AI-SYS-74. Score this formula for “they die to Mirror.” Do not apply Glass ×2 to the reflect. Unify later via `enemyTakesDamage` and delete the map write.  
DEPENDENCIES: AEE-2026-09-25 SYS-50 (token); AEE-2026-09-28-002 (SYS-67 does not cover this path)  
REGRESSION_RISK: HIGH if reflect is folded into `enemyTakesDamage` without deleting `enemyHpMap`  
VALIDATION_REQUIRED: TS-MIRRORHP, TS-MIRREF  
STATUS: NEW

ACTION_ID: AEE-2026-09-29-004  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Windstorm miss still writes kit cooldown and `didAct`  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Miss at WX **16491–16495** stays inside the `damage > 0` branch. Cooldown **16640–16646**. `didAct = true` **16647** (no SYS-42 fallback that turn). Decide cannot see the roll (FUT-57). Next snapshot must drop the id. Distinct from SYS-70’s 30/50 rates and FUT-88’s expected miss.  
RECOMMENDED_ACTION: AI-SYS-75 + FUT-94. After a public miss log, that actor’s id is on CD. Same-round pack mates must not plan as if frost were still coming. Do not skip the CD write “so they can retry.”  
DEPENDENCIES: AEE-2026-09-28-005 (SYS-70 rates); AEE-2026-08-31-002 (still no Fire Bolt)  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-WINDCD  
STATUS: NEW

ACTION_ID: AEE-2026-09-29-005  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Player `AICombatant.maxHp` must be the HUD orb cap, not leftover `stats.hp`  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Decide snapshot WX **16299–16300** `characterStats.maxHp ?? characterStats.hp`. Init **3234** stamps `maxHp` from leftover `s.hp` (canister `CharacterStats` has no max field, `backend.d.ts` 201–214). HUD / `playerEntry` use `useMemo` growth **3400–3406** / **11952**. Wounded entry → `maxHp === hp` → `scoreTargets` `lowHp` is 0.  
RECOMMENDED_ACTION: AI-SYS-76 + FUT-95. Copy the same cap `vitalsOrbCaps` uses. Do not invent a hidden true-max.  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-HUDMAX  
STATUS: NEW

ACTION_ID: AEE-2026-09-29-006  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Do not feed `playerSpellTypeHistoryRef` into decide (hidden Adaptive Resistance)  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: WX **1839**, **17014–17019** keep last five `effectType`s “for Adaptive Resistance AI.” `decideEnemyAction` / summon / boss never read it. Parent principle 6 forbids hidden player information. Pacifist-run may keep the writer.  
RECOMMENDED_ACTION: AI-SYS-77 + FUT-90. Legal source = battle log or a HUD chip of the same list. Until then, no SR-bias from the ref. Do not pass the ref into `DecideEnemyContext`.  
DEPENDENCIES: FUT-08 (physical/magic kit) for a spell swap; positioning-only bias can land earlier  
REGRESSION_RISK: MEDIUM if the ref is wired “because the comment says Adaptive Resistance”  
VALIDATION_REQUIRED: TS-ADAPTREF  
STATUS: NEW
