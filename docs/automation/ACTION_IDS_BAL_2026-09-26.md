# ACTION_IDs — 2026-09-26 quantitative game balance

SOURCE_AUTOMATION: Stralt quantitative game-balance analyst
HEAD: `0f5363f`
Gameplay numbers: **not modified**.
Analysis: [`GAME_BALANCE_2026-09-26.md`](./GAME_BALANCE_2026-09-26.md)

Reissues prior `BAL-*` (still unimplemented unless noted). Adds two NEW ids.
`BAL-RECAP-XP-BAR-WRONG` stays RESOLVED. `BAL-IAP-VALUE-DOMINANCE` stays SUPERSEDED.
2026-09-25 NEW ids (`BAL-HEAL-ADVERTISED-BUFF-DEAD`, `BAL-ENEMY-MITIGATION-UNCAPPED`, `BAL-TIER-THREE-MORE-UNUSED`) stay OPEN.

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
| BAL-HEAL-ADVERTISED-BUFF-DEAD | P1 | OPEN |
| BAL-ENEMY-MITIGATION-UNCAPPED | P1 | OPEN |
| BAL-TIER-THREE-MORE-UNUSED | P3 | OPEN |
| **BAL-BOOST-LOCKED-XP-150** | P1 | **NEW** |
| **BAL-LEVELUP-KNOBS-DEAD** | P2 | **NEW** |

P0/P1 reissue blocks: [`GAME_BALANCE_2026-09-26.md`](./GAME_BALANCE_2026-09-26.md). New IDs and remaining P2/P3 below.

---

ACTION_ID: BAL-BOOST-LOCKED-XP-150
TITLE: Victory XP is always ×1.5; Doka boost and BoostToggle never apply
CATEGORY: progression
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: App.tsx 360-362 and 497-501; GameFlow.tsx 48-49; WorldExploration.tsx 2098 and 12374-12441; BoostToggle.tsx
CURRENT_BEHAVIOUR: App toggle is discarded. WX boostMode stuck at "xp". Every victory `derivedBaseXp * 1.5`. Doka ×1.5 branch dead. Challenge XP not multiplied.
DESIRED_BEHAVIOUR: One live boostMode, or bake 1.5 into the XP formula and delete the pill.
EVIDENCE: HEAD `0f5363f`. BoostToggle zero importers. Live L1 3-pack ~999 XP vs 666 unboosted; L10 fights/level 50.9 vs 76.3.
RECOMMENDED_ACTION: Human: wire or bake. Do not ship a lying HUD pill.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — dropping 1.5 without a curve retune lengthens L8–L15 by 50%
VALIDATION_REQUIRED: Recap XP matches persist; pill (if kept) changes the next victory
STATUS: NEW

---

ACTION_ID: BAL-LEVELUP-KNOBS-DEAD
TITLE: spellLevelingCostMultiplier and spellDmgGrowthPercent are admin-only; AP threshold field is split
CATEGORY: progression
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: main.mo 1017-1023; combatMath.ts 130-137; spellEngine.ts 1038-1043; progression.ts 59-72; WorldExploration.tsx 2307-2314
CURRENT_BEHAVIOUR: Upgrade `cost * 2` loop ignores multiplier. Damage `1.03^u` ignores spellDmgGrowthPercent. Battle AP reads apMpGrowthEveryNLevels; admin writes apMpLevelThreshold.
DESIRED_BEHAVIOUR: Live formulas read the admin fields, or remove the fields.
EVIDENCE: Grep hits admin/mocks/migrations only for those two knobs. getPlayerBaseStats does not read apMpLevelThreshold.
RECOMMENDED_ACTION: Map threshold on load; use multiplier and dmg% on the single remaining scale/cost path.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW at defaults 2 and 3; HIGH if someone set multiplier 10 expecting no effect
VALIDATION_REQUIRED: Admin multiplier 3 changes L0→1 cost; dmg% 5 matches one-pass scale; AP every 30 at L30 is 9
STATUS: NEW

---

ACTION_ID: BAL-FAMILY-COMBAT-IDENTITY
TITLE: Family 30% overwrites res as a 0.05–0.75 fraction treated as percent
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spawnPolicy.ts FAMILY_STAT_MULTS; WorldExploration generateEnemies family apply
CURRENT_BEHAVIOUR: iron_golem res 0.75 → 0.75% mitigation. hpMult hits spawn HP then calcEnemyMaxHp discards it.
DESIRED_BEHAVIOUR: Store 75 for 75% or multiply existing res; apply hpMult to combat max HP
EVIDENCE: FAMILY_STAT_MULTS res 0.1–0.75; combat `1 - res/100`
RECOMMENDED_ACTION: Convert family res to percent points; apply hpMult after combat HP formula
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — families become real tanks/glass
VALIDATION_REQUIRED: iron_golem mitigation in 40–80% or stated; plague_rat combat HP < default
STATUS: OPEN

ACTION_ID: BAL-DOMINATED-SPELLS
TITLE: Several starters are strictly worse than a sibling on the same bar
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellData.ts starterSpells
CURRENT_BEHAVIOUR: Iron Skin 3 AP vs Shield 2 AP same +30% RES. Venom 3 AP vs Poison 2 AP same DoT. Expose/Shadow Veil < Cursed Wound DPA with dead extras.
DESIRED_BEHAVIOUR: Differentiate extras (and land them) or remove/retire dominated ids
EVIDENCE: 2026-09-26 ability table
RECOMMENDED_ACTION: After CC/heal extras live, re-score; until then retire or buff the losers
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: No two innate spells with identical effect at higher AP
STATUS: OPEN

ACTION_ID: BAL-SUMMON-UI-COST-10X
TITLE: Summon upgrade UI advertises 10× canister debit
CATEGORY: economy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellUpgrade.ts spellUpgradeCanisterSpend; summon upgrade UI
CURRENT_BEHAVIOUR: UI `100 * 2^level`; canister `10 * 2^level`. `spellUpgradeUiSpend` already corrects the wallet.
DESIRED_BEHAVIOUR: UI shows 10×2^n
EVIDENCE: spellUpgrade.ts comments 106-111
RECOMMENDED_ACTION: Copy change only unless design wants summons 10× expensive
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW if copy-only
VALIDATION_REQUIRED: Advertised cost equals canister for a summon L0→1
STATUS: OPEN

ACTION_ID: BAL-DEATH-DOKA-40
TITLE: Death deletes 40% of all Doka and 20% leftover XP
CATEGORY: economy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: deathPenalty.ts DEATH_DOKA_PENALTY_RATE 0.4
CURRENT_BEHAVIOUR: Wallet cut is all Doka, not leftover. After a 100k clamp jackpot, death deletes 40k.
DESIRED_BEHAVIOUR: 10–20% Doka and/or exempt persist-clamped jackpots
EVIDENCE: computeDeathPenalty
RECOMMENDED_ACTION: Human retune with lottery; do not only cut XP
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: L1 death Doka loss in a stated %; XP leftover 20% still
STATUS: OPEN

ACTION_ID: BAL-AP-GROWTH-UNREACHABLE
TITLE: Formula AP 21 at L325 is clamped to persist 20
CATEGORY: progression
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: adminGuard.mo MAX_PERSISTED_AP 20; progression.ts
CURRENT_BEHAVIOUR: `8+floor(L/25)` = 21 at L325. Cap 20. XP wall makes L325 fictional.
DESIRED_BEHAVIOUR: Raise cap or stop +1 after 20 in the formula
EVIDENCE: 8+13=21
RECOMMENDED_ACTION: After XP curve, decide a real AP ceiling
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW today
VALIDATION_REQUIRED: Formula and persist cap match
STATUS: OPEN

ACTION_ID: BAL-VOID-COLLAPSE-UNREACHABLE
TITLE: Built-in void_collapse is not on the starter bar
CATEGORY: content
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: adminSafety.ts built-in ids; spellData.ts starterSpells
CURRENT_BEHAVIOUR: Protected from delete; not innate. Discovery path still Wave-1 blocked.
DESIRED_BEHAVIOUR: Discoverable or retire from built-in list
EVIDENCE: isBuiltInSpellId("void_collapse")
RECOMMENDED_ACTION: Coordinate with SDE discovery; do not add to innate bar in the same PR as gating
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Player can own it through a documented path, or it is retired
STATUS: OPEN

ACTION_ID: BAL-DUNGEON-MULT-FORMULA-SPLIT
TITLE: Live Doka chain table ≠ backend store ≠ XP persist multiplier
CATEGORY: economy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: portalRules.ts DUNGEON_DOKA_MULTIPLIERS; rewardResolver.ts PREAPPLIED_REWARD_MULTIPLIER=1; backend dungeon record
CURRENT_BEHAVIOUR: FE Doka 1.5–4×. XP persist ×1. BE `1+depth*0.25`.
DESIRED_BEHAVIOUR: One table for Doka and a documented XP rule
EVIDENCE: portalRules.test.ts vs PREAPPLIED_REWARD_MULTIPLIER
RECOMMENDED_ACTION: Apply the FE table in persist or stop showing it as XP
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Depth 5 victory Doka ×4 vs overworld; XP matches copy
STATUS: OPEN

ACTION_ID: BAL-TITAN-VIGOR-FLAT-1000
TITLE: Titan Vigor (or equivalent flat HP add) is a flat 1000
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: gameConstants.ts MAP_MODIFIER_TITANS_VIGOR_HP_BONUS; mapModifiers.ts Titans Vigor
CURRENT_BEHAVIOUR: Flat +1000 HP vs linear max 100–220 in the modeled bands — a full extra bar+ at L1, still huge at L25.
DESIRED_BEHAVIOUR: Percent of max HP (20–40%) or scale with L
EVIDENCE: MAP_MODIFIER_TITANS_VIGOR_HP_BONUS = 1000
RECOMMENDED_ACTION: Percent of HUD maxHP
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: L1 Titan HP add ≤ 40; L25 add tracks maxHP
STATUS: OPEN

ACTION_ID: BAL-JACKPOT-HEAL-1-DOKA
TITLE: Overworld jackpot heal is 0.5% for 1 Doka full HP
CATEGORY: economy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: itemShop.ts resolveOverworldHealSpend; WorldExploration.tsx 18416
CURRENT_BEHAVIOUR: 1:3 default; 0.5% full bar for 1 Doka. Dominates potions.
DESIRED_BEHAVIOUR: 0.1% or 10–20% HP for 1 Doka
EVIDENCE: Math.random() < 0.005
RECOMMENDED_ACTION: Retune with 1:3 still the default
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Jackpot rate in stated %; non-jackpot still 1:3
STATUS: OPEN

ACTION_ID: BAL-BUFF-SHOP-OVERWORLD-DOMINATED
TITLE: Health potions cost 5× overworld Doka/HP until ~L81
CATEGORY: economy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BuffShop.tsx BUFF_ITEMS 50 Doka / 30% HP
CURRENT_BEHAVIOUR: L1 50 Doka → 30 HP vs 10 Doka overworld. Battle-only items (elixir 80) compete with Timestep 0.
DESIRED_BEHAVIOUR: Potion 15–25 Doka or in-battle-only restriction with copy
EVIDENCE: 2026-09-26 heal table
RECOMMENDED_ACTION: Cut prices or disable overworld use
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: L1 potion Doka/HP within 1.5× of 1:3, or potions unusable overworld
STATUS: OPEN

ACTION_ID: BAL-TWO-SPELL-CATALOGS
TITLE: Static starterSpells vs admin SpellConfig catalog
CATEGORY: content
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellData.ts; backend spellConfigs
CURRENT_BEHAVIOUR: Two lists. Balance changes in one miss the other.
DESIRED_BEHAVIOUR: One registry
EVIDENCE: Dual sources on HEAD
RECOMMENDED_ACTION: Admin catalog wins at runtime for overlapping ids
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH
VALIDATION_REQUIRED: One id, one damage/AP
STATUS: OPEN

ACTION_ID: BAL-MP-UNUSED-ON-STARTERS
TITLE: Starter spells cost 0 MP
CATEGORY: combat
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellData.ts mpCost BigInt(0)
CURRENT_BEHAVIOUR: MP 4 exists; starters do not spend it. Family catalog mp unused at spawn.
DESIRED_BEHAVIOUR: Some starters cost 1–2 MP
EVIDENCE: physicalAttackSpell and starter array
RECOMMENDED_ACTION: Put MP on 2–4 non-Strike spells
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: At least one innate spell debit MP
STATUS: OPEN

ACTION_ID: BAL-SUMMONER-SATURATION
TITLE: Enemy summoner chance is 100% at player L44
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration summoner chance `0.12 + playerLevel * 0.02`
CURRENT_BEHAVIOUR: L1 14%; L44 100%. Player has no cap; enemy cap 2.
DESIRED_BEHAVIOUR: Asymptote 25–40%
EVIDENCE: 0.12+44*0.02=1.0
RECOMMENDED_ACTION: `min(0.35, 0.12+0.005*L)` or similar
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: L44 chance ≤ 40%
STATUS: OPEN

ACTION_ID: BAL-HARD3-AP8-FREE
TITLE: hard_3 (≤8 AP/turn) is free while the player has 8 AP
CATEGORY: progression
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: challengeCompletion.ts hard_3; getPlayerBaseStats AP 8 until L25
CURRENT_BEHAVIOUR: 150 Doka / 450 XP for never spending >8 AP. Opening AP is 8. Timestep restores 8 and can be used as a second 8-AP turn.
DESIRED_BEHAVIOUR: Cap 6 AP **or** exclude until AP>8 **or** count Timestep as a spend
EVIDENCE: PLAYER_BASE_AP=8; hard_3 under_8_ap_per_turn
RECOMMENDED_ACTION: Change threshold to 6 or retier to easy
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: L1 hard_3 fails if the player spends a 4+4 turn or Timestep+full bar
STATUS: OPEN

ACTION_ID: BAL-BOSS-CATALOG-SPLIT
TITLE: Boss Guide / kits / live combat are not one stat block
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: bossKits.ts; progression.ts getBossEffectiveStats; WorldExploration boss spawn
CURRENT_BEHAVIOUR: Guide uses 1.08^Δ on a base block; combat uses spawn/kit path. Two catalogs.
DESIRED_BEHAVIOUR: Guide numbers = combat numbers
EVIDENCE: BAL-BOSS-GUIDE-VS-COMBAT sibling; getBossEffectiveStats comment "does NOT replace phase2"
RECOMMENDED_ACTION: Drive both from one BossBaseStats
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH
VALIDATION_REQUIRED: Guide HP at Δ0 equals in-fight max HP
STATUS: OPEN

ACTION_ID: BAL-IAP-PACKAGES-ORPHANED
TITLE: ShopPackage IAP catalog is not the player Buy Doka path
CATEGORY: economy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: initiatePurchase stub; DokaGameKeyShop.tsx
CURRENT_BEHAVIOUR: initiatePurchase always #err. GameKey is the paid path.
DESIRED_BEHAVIOUR: Hide ShopPackage from player UI or delete CRUD
EVIDENCE: AGENTS.md; admin leftover packages
RECOMMENDED_ACTION: Admin copy: leftover; player shop GameKey only
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Player cannot start a ShopPackage checkout
STATUS: OPEN

ACTION_ID: BAL-GAMEKEY-MINT-UNBOUNDED
TITLE: Admin GameKey grant cap 10_000_000 bypasses applyRewards 100_000
CATEGORY: economy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: adminGuard.mo MAX_DOKA_GRANT; gameKey.mo MAX_HINT_EURO_CENTS; redeemGameKey
CURRENT_BEHAVIOUR: Hint/grant up to 10M Doka. applyRewards rejects >100k. Redeem is a different funnel.
DESIRED_BEHAVIOUR: Align grant cap with economy (100k–1M) or keep 10M as explicit admin-only with audit
EVIDENCE: validateDokaGrant 1–10_000_000
RECOMMENDED_ACTION: Human policy; do not treat as player combat EV
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Player redeem cannot exceed the chosen cap
STATUS: OPEN

ACTION_ID: BAL-CREATE-VITALS-MISMATCH
TITLE: Create AP 10 / MP 5 vs battle formula 8 / 4
CATEGORY: progression
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: startingChampionStats.ts; WorldExploration.tsx 12105-12116
CURRENT_BEHAVIOUR: Forge shows 10/5. Battle overwrites 8/4. Divergence warn once.
DESIRED_BEHAVIOUR: Create payload uses formula floors
EVIDENCE: startingChampionStats.test.ts ap 10 mp 5; getPlayerBaseStats(1) 8/4
RECOMMENDED_ACTION: Write 8/4 on create
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Forge orbs 8/4; first battle AP 8
STATUS: OPEN

ACTION_ID: BAL-BOSS-GUIDE-VS-COMBAT
TITLE: Boss Guide 1.08^Δ is UI-only
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: progression.ts BOSS_LEVEL_DIFF_STEP 1.08; BossGuideModal.tsx
CURRENT_BEHAVIOUR: Table scales HP/AP/MP/init/sp/sr. Combat does not call getBossEffectiveStats.
DESIRED_BEHAVIOUR: Combat uses the same multiplier, or the table is labeled forecast-only
EVIDENCE: progression.ts comment
RECOMMENDED_ACTION: Wire or relabel
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH if wired on current kits
VALIDATION_REQUIRED: Δ+2 fight HP matches guide or copy says "not live"
STATUS: OPEN

ACTION_ID: BAL-RANGE-CAP-FAVORS-STRIKE
TITLE: maxSpellRange 5 grows Strike 1→5 by L40; long spells stay capped
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 3656-3663
CURRENT_BEHAVIOUR: Range += floor(L / spellRangeGrowthLevels) capped at 5. Strike 1 becomes 5. Frost 4 becomes 5. AoE identity flattened.
DESIRED_BEHAVIOUR: Grow only spells with base range 1, or cap Strike at 2
EVIDENCE: physicalAttackSpell range 1; maxSpellRange 5
RECOMMENDED_ACTION: Physical melee stays 1–2
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: L40 Strike range ≤ 2; Frost still 4–5
STATUS: OPEN

ACTION_ID: BAL-HAZARD-FLAT-DAMAGE
TITLE: Lava 8–15 + Burning 3×3 and spikes 5–10 ignore level and RES
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 11429-11452; battle walk hazards
CURRENT_BEHAVIOUR: Flat rolls. Bypass RES. L1 8–15 is 8–15% of 100 HP; L25 same vs 220.
DESIRED_BEHAVIOUR: Scale with L or % maxHP; apply RES on lava/spikes
EVIDENCE: `8 + Math.floor(Math.random() * 8)`
RECOMMENDED_ACTION: `max(1, floor(maxHP * 0.05..0.08))` or apply RES
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Lava hits go through playerTakesDamage RES; amount scales or is %HP
STATUS: OPEN

ACTION_ID: BAL-TIER-THREE-MORE-UNUSED
TITLE: threeOrMorePercent config is ignored; leftover band is 10%
CATEGORY: spawn
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: combatMath.ts 72-97
CURRENT_BEHAVIOUR: Field 5 never read. Leftover 10% is dist 3..6.
DESIRED_BEHAVIOUR: Honor 5%; park unused percent in same-tier
EVIDENCE: `_threeMore` from leftover; L1 hist ~6% in 31+
RECOMMENDED_ACTION: Combine with BAL-ENEMY-TIER-OUTLIER
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Default far-tier 5% not 10%; admin 0% is 0
STATUS: OPEN
