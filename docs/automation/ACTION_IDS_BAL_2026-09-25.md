# ACTION_IDs — 2026-09-25 quantitative game balance

SOURCE_AUTOMATION: Stralt quantitative game-balance analyst
HEAD: `0f5363f`
Gameplay numbers: **not modified**.
Analysis: [`GAME_BALANCE_2026-09-25.md`](./GAME_BALANCE_2026-09-25.md)

Reissues prior `BAL-*` (still unimplemented unless noted). Adds three NEW ids.
`BAL-RECAP-XP-BAR-WRONG` stays RESOLVED. `BAL-IAP-VALUE-DOMINANCE` stays SUPERSEDED.
2026-09-24 NEW ids (`BAL-PLAYER-DMG-DOUBLE-PASS`, `BAL-FALLBACK-CRUSH-OUTSCALES-KIT`, `BAL-HAZARD-FLAT-DAMAGE`) stay OPEN.

Do not auto-implement numeric ranges.

---

## Status this run

| ID | Priority | Status |
| :--- | :--- | :--- |
| BAL-DOKA-LOTTERY-BILLION | P0 | OPEN |
| BAL-XP-EXPONENTIAL-WALL | P0 | OPEN |
| BAL-DMG-NO-LEVEL-SCALE | P0 | OPEN |
| BAL-PLAYER-DMG-DOUBLE-PASS | P0 | OPEN |
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
| BAL-FALLBACK-CRUSH-OUTSCALES-KIT | P1 | OPEN |
| BAL-HAZARD-FLAT-DAMAGE | P2 | OPEN |
| **BAL-HEAL-ADVERTISED-BUFF-DEAD** | P1 | **NEW** |
| **BAL-ENEMY-MITIGATION-UNCAPPED** | P1 | **NEW** |
| **BAL-TIER-THREE-MORE-UNUSED** | P3 | **NEW** |

Full ACTION blocks for every ID are in `GAME_BALANCE_2026-09-25.md`. New IDs only below.

---

ACTION_ID: BAL-HEAL-ADVERTISED-BUFF-DEAD
TITLE: Blood Mend / Rallying Cry never apply CHC; 0.15 would invert if wired as a factor
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellData.ts starter-heal and spell-rallying-cry; spellEngine.ts 655-672; statusEffects.ts getStatModifier
CURRENT_BEHAVIOUR: Heal branch heals and returns. buffStat chc / buffModifier 0.15 never applyEffect. Shield uses 1.3 as a multiplicative factor. getStatModifier multiplies CHC, so 0.15 would be −85% CHC.
DESIRED_BEHAVIOUR: Apply +15 percentage points CHC for 2 turns, **or** store 1.15 and multiply. Heal crit stays 2× HP (not the damage double-pass).
EVIDENCE: 2026-09-25 read of heal branch vs Shield branch 697-710. Encoded 0.15 vs 1.3.
RECOMMENDED_ACTION: One encoding for percent buffs (always 1+p). Apply from the heal branch before return. Tests: Mend at CHC 1 → effective 16 (additive) or ×1.15 (factor), never ×0.15.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — crit rate if double-pass remains
VALIDATION_REQUIRED: Blood Mend does not change CHC today (document); after fix, next Strike crit chance matches the chosen encoding; HP still 12/24
STATUS: NEW

---

ACTION_ID: BAL-ENEMY-MITIGATION-UNCAPPED
TITLE: Enemy RES/SR can roll 100+ and floor kit damage at 1
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: progression.ts getEnemyBaseStats 175-186; spellEngine.ts computeDamage 393-407
CURRENT_BEHAVIOUR: res roll [2, 4+L×0.9]×pieceMult with no cap. Rook max RES 100 at L78; king 107 at L107. SR similar (king 100 at L96). Hits are max(1, round(dmg×(1−res/100)×(1−sr/100))). Sacrifice ignores this.
DESIRED_BEHAVIOUR: Cap effective RES and SR at 60–75, **or** retune rolls to a 0–40 band.
EVIDENCE: 2026-09-25 closed-form table. Family identity bug is separate (0.05–0.75 written as percent).
RECOMMENDED_ACTION: Clamp after the roll. Do not mix with family×100 in the same PR.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — late tanks
VALIDATION_REQUIRED: L78 rook res ≤ cap; Strike still deals ≥ 25% of raw; Sacrifice unchanged
STATUS: NEW

---

ACTION_ID: BAL-TIER-THREE-MORE-UNUSED
TITLE: threeOrMorePercent config is ignored; leftover band is 10%
CATEGORY: spawn
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: combatMath.ts DEFAULT_TIER_CONFIG and pickEnemyLevelFromTiers 72-97
CURRENT_BEHAVIOUR: threeOrMorePercent=5 never read. Leftover 100-60-20-10=10% goes to dist 3..6. L1 cannot down-tier.
DESIRED_BEHAVIOUR: Honor the 5% field; do not dump remainder into the farthest band.
EVIDENCE: `_threeMore` is computed from leftover, config key unused. L1 MC 5.5% in 21–30 plus ~6% 31+.
RECOMMENDED_ACTION: `const three = min(leftover, cfg.threeOrMorePercent)` and park unused percent in same-tier. Combine with BAL-ENEMY-TIER-OUTLIER cap.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: with default config, far-tier rate is 5% not 10%; admin 0% far-tier actually 0
STATUS: NEW
