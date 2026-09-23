# ACTION_IDs — 2026-09-23 quantitative game balance

SOURCE_AUTOMATION: Stralt quantitative game-balance analyst  
HEAD: `0f5363f`  
Gameplay numbers: **not modified**.  
Analysis: [`GAME_BALANCE_2026-09-23.md`](./GAME_BALANCE_2026-09-23.md)

Reissues prior `BAL-*` (still unimplemented unless noted). Adds four NEW ids.  
`BAL-RECAP-XP-BAR-WRONG` stays RESOLVED. `BAL-IAP-VALUE-DOMINANCE` stays SUPERSEDED.

Do not auto-implement numeric ranges.

---

## Status this run

| ID | Priority | Status |
| :--- | :--- | :--- |
| BAL-DOKA-LOTTERY-BILLION | P0 | OPEN |
| BAL-XP-EXPONENTIAL-WALL | P0 | OPEN |
| BAL-DMG-NO-LEVEL-SCALE | P0 | OPEN |
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
| BAL-BOSS-GUIDE-VS-COMBAT | P2 | NEW |
| BAL-RANGE-CAP-FAVORS-STRIKE | P2 | NEW |
| BAL-PLAYER-CC-DEAD-ON-BAR | P1 | NEW |
| BAL-PLAYER-SUMMON-NO-CAP | P1 | NEW |

Full ACTION blocks (current behaviour, evidence, recommended action, autonomy, regression, validation) are in `GAME_BALANCE_2026-09-23.md`. New IDs only below.

---

ACTION_ID: BAL-BOSS-GUIDE-VS-COMBAT
TITLE: Boss Guide 8%/level is not combat HP
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/engine/progression.ts getBossEffectiveStats; src/frontend/src/types/bossDefaults.ts; WorldExploration boss HP
CURRENT_BEHAVIOUR: Guide HP = round(base×1.08^(bossLevel-playerLevel)). Combat uses catalog baseStats.hp (frontend Pale Archbishop 350) plus phase2.statMultiplier at the HP threshold.
DESIRED_BEHAVIOUR: Combat consumes getBossEffectiveStats, or the Guide labels the table as non-authoritative.
EVIDENCE: progression.ts 249-272 documents the helper as Boss Guide only; DEFAULT_BOSS_CONFIGS hp 350; longHorizonSim.bossGuideVsCombat.
RECOMMENDED_ACTION: Label first (low risk). Wiring combat to 1.08^Δ is a full boss HP retune — do not auto-implement.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH if combat is scaled without a HP pass
VALIDATION_REQUIRED: Boss Guide row vs in-fight maxHp for Δ=0 and Δ=+5
STATUS: NEW

---

ACTION_ID: BAL-RANGE-CAP-FAVORS-STRIKE
TITLE: maxSpellRange 5 grows Strike more than casters
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx getEffectiveSpellRange; DEFAULT_LEVELUP_CONFIG maxSpellRange=5
CURRENT_BEHAVIOUR: effective = min(base + floor(L/10), 5). Strike 1→5 by L40. Frost 4→5 at L10. Strike never fizzles.
DESIRED_BEHAVIOUR: Cap ≥ 6–8, or grow range from spell upgrade, or stop growing Strike past 2–3.
EVIDENCE: 2026-09-23 range table; spellEngine.ts physical fail exemption 641-651.
RECOMMENDED_ACTION: Change maxSpellRange or exclude isPhysical from the level bonus. Pair with BAL-SPELL-FAIL-FLOOR.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — targeting.parity tests
VALIDATION_REQUIRED: Strike vs Frost effective range at L1/L10/L40
STATUS: NEW

---

ACTION_ID: BAL-PLAYER-CC-DEAD-ON-BAR
TITLE: Player casts do not apply debuffStat
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellEngine.ts resolvePlayerCast 876-1028 vs resolveSpellCast 529-548
CURRENT_BEHAVIOUR: Enemy/summon path writes Slow/Frost/Weaken/Expose extras. Player damage loop deals damage and returns. Advertised CC is dead on the bar. Buffs still apply.
DESIRED_BEHAVIOUR: Apply debuffStat after a successful player hit. Floor combined AP/MP debuffs at 1.
EVIDENCE: No applyEffect in the player damage loop. Parallel to EBMA-2026-09-02-004; filed here because it changes the DPA/CC table.
RECOMMENDED_ACTION: Wiring + AP/MP floor. Do not change Slow/−2 or Frost/−1 numbers in the same PR.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: player Slow writes mp debuff; two MP debuffs cannot pass the floor; Haste still stacks; Archer kit Slow still works
STATUS: NEW

---

ACTION_ID: BAL-PLAYER-SUMMON-NO-CAP
TITLE: Player summons have no alive-cap or cooldown
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellData.ts 547-688; gameConstants.ts ENEMY_SUMMON_CAP=2
CURRENT_BEHAVIOUR: Five innate summons, AP 2-3, no cooldown. Enemy side is capped at 2 with a 2-turn CD. An 8-AP turn places Wolf+Archer+Wisp.
DESIRED_BEHAVIOUR: Alive cap 2 or 3; 1-2 turn cooldown per summon spell. Keep kit identities and lifespan formulas.
EVIDENCE: ENEMY_SUMMON_CAP vs no player check. Parallel to EBMA-2026-09-02-002.
RECOMMENDED_ACTION: Cap at spawn; add CD. Do not change hpScale numbers here.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — occupancy fallback
VALIDATION_REQUIRED: fourth summon rejected if cap=3; recast during CD on_cooldown
STATUS: NEW
