# ACTION_IDs — 2026-10-21 Advanced Enemy AI Evolution Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source automation: Advanced Enemy AI Evolution Designer (`67b03c2f-a492-11f1-a7d1-d6b4613131ce`).  
Design: [`docs/ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md), [`docs/ENEMY_AI_EVOLUTION_2026-09-21.md`](../ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32 / FUT-36…47), [`docs/ENEMY_AI_EVOLUTION_2026-09-22.md`](../ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35 / FUT-48…53), [`docs/ENEMY_AI_EVOLUTION_2026-09-23.md`](../ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41 / FUT-54…59), [`docs/ENEMY_AI_EVOLUTION_2026-09-24.md`](../ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47 / FUT-60…65), [`docs/ENEMY_AI_EVOLUTION_2026-09-25.md`](../ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53 / FUT-66…71), [`docs/ENEMY_AI_EVOLUTION_2026-09-26.md`](../ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59 / FUT-72…77), [`docs/ENEMY_AI_EVOLUTION_2026-09-27.md`](../ENEMY_AI_EVOLUTION_2026-09-27.md) (open PR #689; SYS-60…65 / FUT-78…83), [`docs/ENEMY_AI_EVOLUTION_2026-09-28.md`](../ENEMY_AI_EVOLUTION_2026-09-28.md) (open PR #723; SYS-66…71 / FUT-84…89), [`docs/ENEMY_AI_EVOLUTION_2026-09-29.md`](../ENEMY_AI_EVOLUTION_2026-09-29.md) (open PR #804; SYS-72…77 / FUT-90…95), [`docs/ENEMY_AI_EVOLUTION_2026-10-21.md`](../ENEMY_AI_EVOLUTION_2026-10-21.md).

This run ships **docs only**. Do not implement gameplay from these IDs unless a later human or orchestrator explicitly picks one.

Do **not** re-file AEE-2026-09-21-001…010, AEE-2026-09-22-001…007, AEE-2026-09-23-001…007, AEE-2026-09-24-001…007, AEE-2026-09-25-001…007, AEE-2026-09-26-001…006, AEE-2026-09-27-001…006, AEE-2026-09-28-001…006, or AEE-2026-09-29-001…006. Those ids belong to PRs #351, #416, #458, #506, #565, #633, #689, #723, and #804.

Open production slices (do not duplicate in this docs PR). No new combat-AI PRs after 2026-09-29:

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

## Still-open IDs (line numbers confirmed 2026-10-21; not re-filed)

| ACTION_ID | Live evidence (2026-10-21) |
| :--- | :--- |
| `AEE-2026-08-31-001` | `computeAITier` `combatMath.ts` 36–52. Spawn WX **5823**. Family second roll WX **5865**. Gates WX **15508** / **15595**. |
| `AEE-2026-08-31-002` | Fire Bolt WX **16710–16715** (`e-firebolt` at **16712**). Ally heal WX **16648**. `enemyAI.ts` has **zero** `currentAp`/`currentMp`/`apCost` reads. Fallback also uses `level/5` (**16716–16720**) — SYS-72. |
| `AEE-2026-09-01-003` | Kit assign WX **11920**. Comment still “10 random spells” (**11915**). |
| `AEE-2026-09-01-005` | Focus setter; `scoreTargets` unread. |
| `AEE-2026-09-01-008` | `pickBossKitSpell` still `new Map()` (`useBossAI.ts` 169–173). |
| `AEE-2026-09-02-002` | Summon occupied empty WX **15156**. |
| `AEE-2026-09-21-002` | Healer Chebyshev-only 1099–1100. |
| `AEE-2026-09-21-004` | `findKitSpell` assigned fallback 1737–1745. |
| `AEE-2026-09-22-002` | Apply `playerPosition` WX **16436–16438** (open #495). |
| `AEE-2026-09-24-001` | Ally `targetId` fallback Crush/Fire Bolt 16704–16715. |
| `AEE-2026-09-26-001` | Strip / `resolveEnemyApMp` AP=`level` WX **17402–17411**. |
| `AEE-2026-09-26-002` | Hostile summons skip executor (still SYS-55). |
| `AEE-2026-09-28-001` | SYS-66 double RES + shield on pack→player spells. |
| `AEE-2026-09-28-002` | SYS-67 `enemyTakesDamage` return vs store. |
| `AEE-2026-09-28-003` | SYS-68 melee private write. |
| `AEE-2026-09-28-005` | SYS-70 Windstorm 30/50 — CD-on-miss is AEE-2026-09-29-004. |
| `AEE-2026-09-29-001` | SYS-72 kit vs Crush/`level/5` formulas. |
| `AEE-2026-09-29-002` | SYS-73 spawn `maxTier` from 999 (`combatMath.ts` 54–58). |
| `AEE-2026-09-29-005` | SYS-76 pack leftover `maxHp` — **summon already uses HUD; fork is AEE-2026-10-21-001**. |

P0 remains **AEE-2026-08-31-002** then **001**. Then 09-21…09-29 honesty. Then this file’s 001–006. Do not start FUT-96 first. Do not implement SYS-59’s “pack immunity.” Do not add `enemy.level` into `calcScaledDamage` as an AI slice. Do not read `allyCount` as pack size.

---

ACTION_ID: AEE-2026-10-21-001  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Pack and summon decide use different player max-HP snapshots  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Summon ctx WX **15150** sets `maxHp: maxHp` (HUD `useMemo` **3400–3406**). Pack ctx **16300** sets `characterStats.maxHp ?? characterStats.hp`. Init **3234** stamps leftover `s.hp` (canister `CharacterStats` has no max field). SYS-76 required HUD cap for pack; summon already complies. Same fight, wolves see 40/120 and bishops see 40/40.  
RECOMMENDED_ACTION: AI-SYS-78 + FUT-99. One vitals helper for pack, summon, and boss-minion. Do not keep a pack-only leftover fallback.  
DEPENDENCIES: AEE-2026-09-29-005 (SYS-76) is the pack half  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-VITALS  
STATUS: NEW

ACTION_ID: AEE-2026-10-21-002  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: `pickBestDamageSpell` origin-range filter makes move-then-cast dead  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `pickBestDamageSpell` (`enemyAI.ts` **555–568**) requires `enemySpellRange >= chebyshev(origin, target)`. Caster **1005**, charger **1233**, generic **1603** call it before `findNearestLegalCastTile` (**787–824**). Comment at **772–777** claims the helper covers out-of-range. Dist 5 + frost 3 → `null` → `stepToward` without a cast. Parent RES-02 is unimplemented and the existing hook is gated shut.  
RECOMMENDED_ACTION: AI-SYS-79 + FUT-96. Split kit-pick (ignore current range) from SYS-13 legality. Do not lengthen AI range. Still no Fire Bolt (AEE-2026-08-31-002).  
DEPENDENCIES: AEE-2026-08-31-002 (failed dest must not bolt)  
REGRESSION_RISK: MEDIUM if kit-pick is used for adjacent melee preference without a second helper  
VALIDATION_REQUIRED: TS-MTC, TS-MTC0, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-21-003  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Pack `scoreTargets(..., null)` ranks with Crush `level/5`, not kit frost  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Caster **947**, charger **1177**, flanker **1296**, berserker **1404**, generic **1493** pass `null`. `estimateDamage(null)` is `12 * max(1, level/5)` (**495–499**). `wKillable = 100`. SYS-72 split the formulas but did not name this call site. Hunter/archer already pass the kit id (**1935**, **2249**). Level-50 bishop stamps killableNow on 80 HP via Crush ~120, then casts frost 8.  
RECOMMENDED_ACTION: AI-SYS-80 + FUT-97. Pass the SYS-79 kit id. Crush `level/5` only for true melee after SYS-05.  
DEPENDENCIES: AEE-2026-09-29-001 (SYS-72 formulas); AEE-2026-10-21-002 (kit-pick)  
REGRESSION_RISK: MEDIUM for chargers that really will Crush  
VALIDATION_REQUIRED: TS-CRUSHRNK  
STATUS: NEW

ACTION_ID: AEE-2026-10-21-004  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: `applyOverkillSpread` trusts Crush-stamped `killableNow`  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `applyOverkillSpread` (`enemyAI.ts` **707–709**) gates on `primary.killableNow` from the SYS-80 list, then `overkill` from `estimateDamage(spell)`. Lookahead **733–735** re-checks kit dmg; spill does not. SYS-19 forbids hidden splash; this is the stamp. Comment at `gameConstants.ts` **226–228** still describes leftover HP hitting a second target — apply never does.  
RECOMMENDED_ACTION: AI-SYS-81 + FUT-98. Recompute killableNow with the same spell inside the helper. One apply hit.  
DEPENDENCIES: AEE-2026-10-21-003 (stamp source); AEE-2026-09-02 SYS-19 (no splash)  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-SPILLST  
STATUS: NEW

ACTION_ID: AEE-2026-10-21-005  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Apply crit uses spawn `enemy.chc`; strip overwrites `chc: 2`  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: WX **16470–16472** `Math.random() * 100 < (enemy.chc ?? 2)` plus enrage +10. Spawn copies catalog chc (**11902**). Strip forces `chc: 2` (**17408**) after `resolveEnemyApMp` (**17404**). Parent principle 6 + FUT-57 (no peek roll). Distinct from SYS-69 dummy ATK/RES/SP.  
RECOMMENDED_ACTION: AI-SYS-82 + FUT-101. Decide must not read `enemy.chc`. Default EV non-crit. Crit EV only after strip == apply. Unifying the number is a UI/combat PR, not an AI cheat.  
DEPENDENCIES: FUT-57 (no peek); SYS-69 (strip dummy)  
REGRESSION_RISK: MEDIUM if decide starts scoring spawn chc “because apply uses it”  
VALIDATION_REQUIRED: TS-CHCHID  
STATUS: NEW

ACTION_ID: AEE-2026-10-21-006  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: `allyCount` / `enemyCount` count every store combatant, including player summons  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Pack fill WX **16338–16342** from `getLiveCombatants` (`combatantStore.ts` **568–569**). Player-side summons live in that array (`combatantTurnEntryType` **132–138**). `enemyAI.ts` **259–261** declare the ints; decide never reads them. Summon ctx already side-filters (**15175–15178**). TEM/FUT pack-size gates on `allyCount >= 1` would treat a lone bishop + player wolf as a 2-enemy pack.  
RECOMMENDED_ACTION: AI-SYS-83. Do not read the ints until a side-filtered rewrite. Prefer `combatants.filter(side)`. Do not turn betrayal `aliveAllies` (**15593**) into a tactic.  
DEPENDENCIES: None (authoring). TEM-01 / FUT-94 must not use the raw ints.  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-ALLYINT  
STATUS: NEW
