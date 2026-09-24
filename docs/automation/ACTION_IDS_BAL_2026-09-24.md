# ACTION_IDs — 2026-09-24 quantitative game balance

SOURCE_AUTOMATION: Stralt quantitative game-balance analyst  
HEAD: `0f5363f`  
Gameplay numbers: **not modified**.  
Analysis: [`GAME_BALANCE_2026-09-24.md`](./GAME_BALANCE_2026-09-24.md)

Reissues prior `BAL-*` (still unimplemented unless noted). Adds three NEW ids.  
`BAL-RECAP-XP-BAR-WRONG` stays RESOLVED. `BAL-IAP-VALUE-DOMINANCE` stays SUPERSEDED.  
2026-09-23 NEW ids (`BAL-BOSS-GUIDE-VS-COMBAT`, `BAL-RANGE-CAP-FAVORS-STRIKE`, `BAL-PLAYER-CC-DEAD-ON-BAR`, `BAL-PLAYER-SUMMON-NO-CAP`) stay OPEN.

Do not auto-implement numeric ranges.

---

## Status this run

| ID | Priority | Status |
| :--- | :--- | :--- |
| BAL-DOKA-LOTTERY-BILLION | P0 | OPEN |
| BAL-XP-EXPONENTIAL-WALL | P0 | OPEN |
| BAL-DMG-NO-LEVEL-SCALE | P0 | OPEN |
| **BAL-PLAYER-DMG-DOUBLE-PASS** | P0 | **NEW** |
| BAL-ENEMY-TIER-OUTLIER | P0 | OPEN |
| BAL-TIER-FLOOR-UPBIAS | P0 | OPEN |
| BAL-ENEMY-KIT-ZONE-OBJECT | P0 | OPEN |
| BAL-PLAYER-COMBAT-STATS-FLAT | P1 | OPEN |
| BAL-SPELL-FAIL-FLOOR | P1 | OPEN |
| BAL-TIMESTEP-FREE-TURN | P1 | OPEN |
| BAL-SACRIFICE-PERCENT-HP | P1 | OPEN |
| BAL-CHALLENGE-XP-EARLY-BREAK | P1 | OPEN |
| BAL-IAP-VALUE-DOMINANCE | P1 | SUPERSEDED |
| BAL-HP-FORMULA-SPLIT | P1 | OPEN |
| BAL-VICTORY-FLOOR-OVER-MAXHP | P1 | OPEN |
| BAL-RECAP-XP-BAR-WRONG | P2 | RESOLVED |
| BAL-FAMILY-COMBAT-IDENTITY | P2 | OPEN |
| BAL-DOMINATED-SPELLS | P2 | OPEN |
| BAL-SUMMON-UI-COST-10X | P2 | OPEN |
| BAL-DEATH-DOKA-40 | P2 | OPEN |
| BAL-AP-GROWTH-UNREACHABLE | P2 | OPEN |
| BAL-VOID-COLLAPSE-UNREACHABLE | P2 | OPEN |
| BAL-DUNGEON-MULT-FORMULA-SPLIT | P2 | OPEN |
| BAL-TITAN-VIGOR-FLAT-1000 | P2 | OPEN |
| BAL-JACKPOT-HEAL-1-DOKA | P3 | OPEN |
| BAL-BUFF-SHOP-OVERWORLD-DOMINATED | P3 | OPEN |
| BAL-TWO-SPELL-CATALOGS | P3 | OPEN |
| BAL-MP-UNUSED-ON-STARTERS | P3 | OPEN |
| BAL-BOSS-RUSH-TABLE-UNPAID | P1 | OPEN |
| BAL-STARTER-KIT-NO-GATING | P1 | OPEN |
| BAL-SUMMONER-SATURATION | P2 | OPEN |
| BAL-HARD3-AP8-FREE | P2 | OPEN |
| BAL-BOSS-CATALOG-SPLIT | P2 | OPEN |
| BAL-IAP-PACKAGES-ORPHANED | P3 | OPEN |
| BAL-GAMEKEY-MINT-UNBOUNDED | P2 | OPEN |
| BAL-CREATE-VITALS-MISMATCH | P3 | OPEN |
| BAL-BOSS-GUIDE-VS-COMBAT | P2 | OPEN |
| BAL-RANGE-CAP-FAVORS-STRIKE | P2 | OPEN |
| BAL-PLAYER-CC-DEAD-ON-BAR | P1 | OPEN |
| BAL-PLAYER-SUMMON-NO-CAP | P1 | OPEN |
| **BAL-FALLBACK-CRUSH-OUTSCALES-KIT** | P1 | **NEW** |
| **BAL-HAZARD-FLAT-DAMAGE** | P2 | **NEW** |

Full ACTION blocks (current behaviour, evidence, recommended action, autonomy, regression, validation) for every ID are in `GAME_BALANCE_2026-09-24.md`. New IDs only below.

---

ACTION_ID: BAL-PLAYER-DMG-DOUBLE-PASS
TITLE: Player damage scales and crits twice before HP write
CATEGORY: combat
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellEngine.ts resolvePlayerCast 882-892 and 990-998; castHelpers.ts applyDamageToEnemy 321-330; WorldExploration.tsx computeDamage 3308-3339
CURRENT_BEHAVIOUR: Resolver computes rawDmg = floor(base×1.03^upgrade), doubles on crit, then applyDamageToEnemy calls calculatePlayerDamage on that already-scaled/crit value with isCrit still true, which scales and crits again. Upgrade 0 crit ≈ 4× advertised. Upgrade 10 live write ≈ 1.81× base vs intended 1.34×. Mark ×2 is applied then deleted on the first calculatePlayerDamage, so the HP write often has no Mark.
DESIRED_BEHAVIOUR: Single scale, single crit, single RES/SR pass. Consume Mark after the HP write (or only in computeDamage). Death detection must use the same number as the write.
EVIDENCE: 2026-09-24 sim: Frost L0 crit intended ~39 live ~80; L10 non-crit intended 26 live 34; L20 non-crit intended 35 live 65. Enemy path (WX 16464-16473) scales once.
RECOMMENDED_ACTION: Stop calling calculatePlayerDamage from resolvePlayerCast (use applyDamageToEnemy only), **or** pass unscaled base into computeDamage and do not pre-double crit. Pair tests. Do not retune 1.03 or CHC in the same PR.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — every player hit, Mark, drain heal (50% of live dmg), recap hits/crits
VALIDATION_REQUIRED: Strike 10 non-crit stays 10; Strike crit is 20 not 40; Frost L10 non-crit matches 1.03^10 once; Mark ×2 on the HP write; drain heal = 50% of that write
STATUS: NEW

---

ACTION_ID: BAL-FALLBACK-CRUSH-OUTSCALES-KIT
TITLE: Fallback Crush scales with enemy level; kit Strike does not
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 16710-16721; enemyAI.ts estimateDamage 494-508; spellData.ts physical_attack damage 10
CURRENT_BEHAVIOUR: Kit physical_attack is 10 forever (calcScaledDamage ignores caster level). Fallback Crush = 12 × max(1, enemy.level/5) × enrage. L1: 12 vs 10. L10: 24 vs 10. L25: 60 vs 10. Enrage ×6 applies to both (Crush 360 at L25).
DESIRED_BEHAVIOUR: Fallback uses the same Strike formula as the kit, **or** kit Strike gains the Crush level term. Missing the spell must not deal more than landing it.
EVIDENCE: 2026-09-24 crushVsStrike table. estimateDamage melee fallback already uses 12*(L/5).
RECOMMENDED_ACTION: Point fallback at physical_attack + calcScaledDamage, or add a caster-level term to Strike in the same pass as BAL-DMG-NO-LEVEL-SCALE.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — enemy TTK, charger tests
VALIDATION_REQUIRED: enemy L1/L10/L25 Strike vs Crush; enrage ×6
STATUS: NEW

---

ACTION_ID: BAL-HAZARD-FLAT-DAMAGE
TITLE: Lava/spikes are flat HP and bypass RES
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 11429-11469
CURRENT_BEHAVIOUR: Lava 8–15 plus Burning 3/turn × 3. Spikes 5–10. Direct setCharacterStats; not playerTakesDamage. L1 lava up to ~24% of 100 HP; L25 lava 15 is ~7% of 220. Shield Charm / RES do not apply. Challenge damage **is** recorded.
DESIRED_BEHAVIOUR: Scale with linear maxHP (e.g. 8–12% per lava step) and route through playerTakesDamage so RES/shield work. Keep challenge recording.
EVIDENCE: 11429 comment `8-15`; 11469 `5-10`; playerTakesDamage is 3424+ and unused here.
RECOMMENDED_ACTION: Percent of maxHP + playerTakesDamage. Recheck easy_3 / hard_1 after the change.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — Untouchable / under-30 / under-50
VALIDATION_REQUIRED: lava hits RES; L1 vs L25 share of maxHP; challenge totalDamage increments
STATUS: NEW
