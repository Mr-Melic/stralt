# ACTION_IDS BAL — 2026-09-28

Ledger for quantitative balance. HEAD `0f5363f`. Report-only. Do not auto-implement numeric ranges.

Companion: [`GAME_BALANCE_2026-09-28.md`](./GAME_BALANCE_2026-09-28.md).
Prior ledger: [`ACTION_IDS_BAL_2026-09-27.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-game-balance-566a/docs/automation/ACTION_IDS_BAL_2026-09-27.md) (#675).

## Index

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
| BAL-BOOST-LOCKED-XP-150 | P1 | OPEN |
| BAL-LEVELUP-KNOBS-DEAD | P2 | OPEN |
| BAL-AI-TIER-VARIANCE-30 | P2 | OPEN |
| BAL-AI-TIER-GATES-DEAD | P3 | OPEN |
| BAL-IDLE-HP-REGEN-FREE | P2 | NEW |
| BAL-PACK-SIZE-REWARD-SWING | P2 | NEW |
| BAL-MODIFIER-GRAVITY-FOG-DEAD | P3 | NEW |

---

ACTION_ID: BAL-DOKA-LOTTERY-BILLION
TITLE: Victory Doka jackpot band is 0.01% of 1..1e9 × enemy.level
CATEGORY: economy
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx; src/backend/main.mo applyRewards; src/frontend/src/utils/applyRewardsResult.ts
CURRENT_BEHAVIOUR: Per kill, roll < 0.0001 (comment says 0.0001%) × uniform 1..1_000_000_000 × enemy.level. Unclamped EV ~level×50007. Persist clamped to 100_000 Doka/call. Comment/code mismatch (0.01% not 0.0001%).
DESIRED_BEHAVIOUR: Jackpot in 1e4–5e4 × level or a server-side table; comment matches code; persist EV in the same band as shops (tens–low hundreds per fight at L1).
EVIDENCE: WX 12388–12414; applyRewards rejects dokaDelta > 100_000 (main.mo 2119); clampApplyRewardsDeltas. MC/analytic persist 3-pack EV ~255 at mean L 10.91 (seed 20260928).
RECOMMENDED_ACTION: Replace client jackpot with a bounded table; fix comment; consider canister-side roll.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: High — feel of “Doka Fever” / jackpot feat.
VALIDATION_REQUIRED: Persist EV vs BuffShop 50–150 and GameKey 100/€; applyRewards never #err on official rolls.
STATUS: OPEN

ACTION_ID: BAL-XP-EXPONENTIAL-WALL
TITLE: XP need doubles every level while fight XP is ~linear in enemy level
CATEGORY: progression
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/utils/xpCurve.ts; src/backend/main.mo applyRewards; WorldExploration handleBattleEnd
CURRENT_BEHAVIOUR: Need 100×2^(N−1). Live fight XP sum(eL×20)×1.5. L1: 0.10 fights/level (trivial). L10: 52. L15: 1020. L25: 6.97e5. Mean overworld pack 4.52 is ~1.51× these XP figures.
DESIRED_BEHAVIOUR: After ~L8–10, growth closer to 1.12–1.20× or quadratic so L15 is tens of fights not thousands.
EVIDENCE: xpCurve.ts 4–12, 23–26; WX 12363–12377; MC seed 20260928.
RECOMMENDED_ACTION: Piecewise curve; keep leftover-in-level store; do not use 100×2^N (off-by-one).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: High — all recap/HUD/persist tests.
VALIDATION_REQUIRED: applyRewards + xpHudProgress + recapXpAfterGrant + death 20% leftover.
STATUS: OPEN

ACTION_ID: BAL-DMG-NO-LEVEL-SCALE
TITLE: Spell damage ignores caster level; only 3%/spell-upgrade
CATEGORY: combat
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/engine/combatMath.ts calcScaledDamage; spellEngine calcScaledDamageInline
CURRENT_BEHAVIOUR: floor(base × 1.03^upgrade). _casterLevel unused. Enemy HP linear 5%/level. Player atk unused.
DESIRED_BEHAVIOUR: Damage tracks eHP (e.g. +1.5–3%/player level) or atk contributes; DoTs should scale too (Poison ignores upgrade).
EVIDENCE: combatMath.ts 130–137; spellEngine.ts 1038–1044; calcEnemyMaxHp WX 3606–3612.
RECOMMENDED_ACTION: One scaling function used by player, enemy kit, and DoT.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: High — all DPS.
VALIDATION_REQUIRED: L1 vs L15 TTK vs mean eHP; Poison vs Frost.
STATUS: OPEN

ACTION_ID: BAL-PLAYER-DMG-DOUBLE-PASS
TITLE: Player damage applies upgrade scale and crit twice
CATEGORY: combat
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/engine/spellEngine.ts resolvePlayerCast; WorldExploration computeDamage
CURRENT_BEHAVIOUR: rawDmg = scale(base); preCrit = crit? raw×2; then calculatePlayerDamage scales again and crits again. L0 crit = 4× advertised. Frost L5 live crit 106 vs advertised 23.
DESIRED_BEHAVIOUR: Scale once, crit once (2× advertised on crit).
EVIDENCE: spellEngine.ts 882–998; WX 3295–3339.
RECOMMENDED_ACTION: Pass unscaled base into computeDamage, or skip second scale/crit.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: High — player DPS drop.
VALIDATION_REQUIRED: Frost/Strike/Chain L0 and L5 crit vs recap log.
STATUS: OPEN

ACTION_ID: BAL-ENEMY-TIER-OUTLIER
TITLE: Leftover spawn weight can pick tiers ±3..6 (levels ±30..60)
CATEGORY: spawn
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/engine/combatMath.ts pickEnemyLevelFromTiers
CURRENT_BEHAVIOUR: After 60+20+10, leftover 10% uses dist 3..6. L1 max 80 in MC.
DESIRED_BEHAVIOUR: Cap distance at ±2 or use threeOrMorePercent for a true ±3 tail <5%.
EVIDENCE: combatMath.ts 71–97; MC max 80 at L1 seed 20260928.
RECOMMENDED_ACTION: Clamp chosenTier; wire threeOrMorePercent.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium — fewer “impossible” packs.
VALIDATION_REQUIRED: MC max/p99 at L1 and L15.
STATUS: OPEN

ACTION_ID: BAL-TIER-FLOOR-UPBIAS
TITLE: L1–10 share a tier; downward rolls clamp at 0 so L1 mean ~11
CATEGORY: spawn
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/engine/combatMath.ts pickEnemyLevelFromTiers
CURRENT_BEHAVIOUR: playerTier = floor((L−1)/10). Adjacent −1 clamps to 0. L1 mean 10.91, p(eL>L)=0.931.
DESIRED_BEHAVIOUR: Sample around player level, not tier index; allow below-player; L1 mean 2–6.
EVIDENCE: combatMath.ts 54–107; MC 8k seed 20260928.
RECOMMENDED_ACTION: Level-centric Gaussian or weighted offsets from playerLevel.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: High — early game much easier.
VALIDATION_REQUIRED: L1/L8/L10 mean, p(above), dungeon boost still bites.
STATUS: OPEN

ACTION_ID: BAL-ENEMY-KIT-ZONE-OBJECT
TITLE: buildEnemyKit receives a LevelZone object so kits stay zone-0
CATEGORY: combat
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx assignEnemySpells; engine/enemyAI.ts buildEnemyKit
CURRENT_BEHAVIOUR: buildEnemyKit(piece, currentMap.levelZone). Math.floor(object) is NaN → max(0,NaN)=NaN → z>=1 false. Pawns never gain venom; queens never inferno.
DESIRED_BEHAVIOUR: Pass a numeric zone (e.g. currentZoneTier−1) or levelZone.minLevel band.
EVIDENCE: WX 11920; enemyAI.ts 194–199; levelZone object WX 4683–4687.
RECOMMENDED_ACTION: Number(zone) helper; tests with object vs number.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium — late kits suddenly appear.
VALIDATION_REQUIRED: pawn/queen/king kits at zone 0/1/2.
STATUS: OPEN

ACTION_ID: BAL-PLAYER-COMBAT-STATS-FLAT
TITLE: Persisted atk/res/init do not drive outgoing damage
CATEGORY: progression
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: startingChampionStats.ts; combatMath calcScaledDamage; CharacterStats
CURRENT_BEHAVIOUR: Create atk 15 / res 10 / init 10. Outgoing dmg uses spell base only. Incoming uses RES%.
DESIRED_BEHAVIOUR: atk contributes to physical; init already used for turn order; document or wire.
EVIDENCE: startingChampionStats.ts 7–22; calcScaledDamage ignores atk.
RECOMMENDED_ACTION: Physical: base + k×atk or %; or hide atk on HUD.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium.
VALIDATION_REQUIRED: Strike vs Frost with atk 15 vs 30.
STATUS: OPEN

ACTION_ID: BAL-SPELL-FAIL-FLOOR
TITLE: Spell fail starts at 20% and takes 200 levels to reach 0
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration spellFailChance; LevelUpConfig
CURRENT_BEHAVIOUR: max(0, 20 − (L−1)×0.1). L1 20%, L50 15.1%, L201 0%. Physical Strike immune.
DESIRED_BEHAVIOUR: 5–10% at L1, 0 by L20–30, or fail only on non-combat spells.
EVIDENCE: WX 3646–3650; DEFAULT_LEVELUP_CONFIG.
RECOMMENDED_ACTION: Raise reduction or lower base.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Low–medium.
VALIDATION_REQUIRED: Fail overlay; challenge AP spend on fizzle.
STATUS: OPEN

ACTION_ID: BAL-TIMESTEP-FREE-TURN
TITLE: Timestep costs 0 AP and restores full AP/MP once per battle
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellData spell-timestep; spellEngine resolvePlayerCast
CURRENT_BEHAVIOUR: apCost 0; consumeTimestep then restoreApMp; return "no_ap" so caller does not deduct. Free extra turn.
DESIRED_BEHAVIOUR: Cost 3–6 AP, or restore half, or once per N battles.
EVIDENCE: spellData.ts 216–231; spellEngine.ts 721–733.
RECOMMENDED_ACTION: Price the reset; keep once-per-battle.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium — boss DPS windows.
VALIDATION_REQUIRED: Second Timestep abort; AP after restore.
STATUS: OPEN

ACTION_ID: BAL-SACRIFICE-PERCENT-HP
TITLE: Sacrifice deals 60% of current HP; oneshots most same-level eHP
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellEngine resolvePlayerCast isSacrifice
CURRENT_BEHAVIOUR: floor(hp×0.2)×3. L1 full 60 vs mean eHP 74, p(oneshot)=0.36 vs live uptier; vs same-level eHP 50 almost always lethal. Ignores RES in the HP-loss term.
DESIRED_BEHAVIOUR: Flat 20–40 or 20% of missing HP; apply RES to outgoing.
EVIDENCE: spellEngine.ts 749–763; MC pSac 0.36 at L1, 0.82 at L10 (seed 20260928).
RECOMMENDED_ACTION: Retune coefficient; keep challenge self-HP recording.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: High — starter nuke.
VALIDATION_REQUIRED: Untouchable records lost HP; floor at 1.
STATUS: OPEN

ACTION_ID: BAL-CHALLENGE-XP-EARLY-BREAK
TITLE: Hard/legendary XP is a large share of an early fight and tiny later
CATEGORY: challenges
PRIORITY: P1
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: utils/challengeCompletion.ts DEFAULT_CHALLENGES
CURRENT_BEHAVIOUR: Hard 400–500 XP, legendary 800–1000. L1 3-pack fight 982 so hard ≈ half a level after the trivial 100-need. L15 fight 1606 so legendary < 1 fight while level need is 1.64e6.
DESIRED_BEHAVIOUR: Scale challenge XP with player level or remaining-to-next (10–25% of fight XP).
EVIDENCE: challengeCompletion.ts 44–109; MC fight XP.
RECOMMENDED_ACTION: rewards.xp = f(playerLevel) or % of computeVictoryExp.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium.
VALIDATION_REQUIRED: liveBattleChallengePersistEntries; clamp 500_000.
STATUS: OPEN

ACTION_ID: BAL-IAP-VALUE-DOMINANCE
TITLE: Legacy euro packages vs fight Doka (superseded on player shop)
CATEGORY: economy
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/backend/lib/admin.mo shopPackages; DokaGameKeyShop.tsx
CURRENT_BEHAVIOUR: Player shop is GameKey 100 Doka/€. Seed packages still exist (10 Doka / €1 …). initiatePurchase always #err.
DESIRED_BEHAVIOUR: Keep GameKey as the live path; do not restore package IAP without a new economy pass.
EVIDENCE: main.mo 1154–1168; DokaGameKeyShop hint 100 Doka/€; admin.mo 267–281.
RECOMMENDED_ACTION: None for player shop. Leave packages admin-only or delete later.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: N/A
VALIDATION_REQUIRED: N/A
STATUS: SUPERSEDED

ACTION_ID: BAL-HP-FORMULA-SPLIT
TITLE: HUD HP is linear 5%/level; getPlayerBaseStats HP is compounding 5%
CATEGORY: progression
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration maxHp; engine/progression.ts getPlayerBaseStats; backend getEnemyHPForLevel
CURRENT_BEHAVIOUR: HUD floor(100×(1+(L−1)×0.05)). Battle AP/MP from getPlayerBaseStats (HP unused for HUD). L25 HUD 220 vs formula 323. BE getEnemyHPForLevel uses 30+20×tier — unused by WX.
DESIRED_BEHAVIOUR: One HP function for HUD, persist max, respawn, victory floor.
EVIDENCE: WX 3400–3406; progression.ts 74–80; main.mo 2947–2953.
RECOMMENDED_ACTION: Pick linear or compound; migrate persist.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: High — heals, death HP, orbs.
VALIDATION_REQUIRED: respawnHpAfterDeath vs maxHp; saveBattleStats maxHp.
STATUS: OPEN

ACTION_ID: BAL-VICTORY-FLOOR-OVER-MAXHP
TITLE: Post-victory HP floor 50+10L exceeds linear max from L10
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: utils/deathPenalty.ts victoryResourceFloor; WorldExploration mergeVictoryRewardLiveStats
CURRENT_BEHAVIOUR: hp floor 50+level×10. L10: 150 > max 145. L25: 300 > 220. Queued #386.
DESIRED_BEHAVIOUR: min(floor, maxHp).
EVIDENCE: deathPenalty.ts 144–155; MC floorGtMax from L10.
RECOMMENDED_ACTION: Merge #386 or clamp here.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Low.
VALIDATION_REQUIRED: Recap heal vs floor; paid Doka heal not overwritten.
STATUS: OPEN

ACTION_ID: BAL-RECAP-XP-BAR-WRONG
TITLE: Recap XP bar used the wrong leftover/threshold
CATEGORY: hud
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration handleBattleEnd; utils/xpCurve.ts recapXpAfterGrant
CURRENT_BEHAVIOUR: Recap uses recapXpAfterGrant(leftover, level, xpDelta).
DESIRED_BEHAVIOUR: Already the leftover-in-level bar.
EVIDENCE: WX 12451–12467; xpCurve.ts 91–102.
RECOMMENDED_ACTION: None.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: N/A
VALIDATION_REQUIRED: Recap after level-up.
STATUS: RESOLVED

ACTION_ID: BAL-FAMILY-COMBAT-IDENTITY
TITLE: Family variants overwrite RES with 0–1 fractions treated as percent
CATEGORY: spawn
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: engine/spawnPolicy.ts applyEnemyFamilyStats
CURRENT_BEHAVIOUR: 30% family; enemy.res = m.res (0.05–0.75). Damage uses 1−RES/100 so iron_golem 0.75 ⇒ 0.75% mitigation, not 75%. Catalog ap/mp unused.
DESIRED_BEHAVIOUR: Store 5–75 as percent, or multiply rolled RES.
EVIDENCE: spawnPolicy.ts 261–272, 279–287; FAMILY_STAT_MULTS.
RECOMMENDED_ACTION: Multiply instead of replace; write ap/mp or drop from catalog.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium — family tanks become real.
VALIDATION_REQUIRED: iron_golem vs plague_rat TTK.
STATUS: OPEN

ACTION_ID: BAL-DOMINATED-SPELLS
TITLE: Several starter spells are mathematically worse than Frost on one target
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: data/spellData.ts; resolvePlayerCast
CURRENT_BEHAVIOUR: Frost 6.67 dmg/AP live vs Strike 5, Chain 5 (unless 2 bounces), Drain 3.3, Poison 6 over time no upgrade. CC extras dead.
DESIRED_BEHAVIOUR: Each bar slot a unique job (control, physical vs SR, AoE, heal).
EVIDENCE: Ability table this run; BAL-PLAYER-CC-DEAD-ON-BAR.
RECOMMENDED_ACTION: Buff AoE/DoT/physical identity; wire CC.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium.
VALIDATION_REQUIRED: Normalized dmg/AP with RES/SR.
STATUS: OPEN

ACTION_ID: BAL-SUMMON-UI-COST-10X
TITLE: Summon spellbook shows 10× the canister upgrade price
CATEGORY: economy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: gameConstants SUMMON_UPGRADE_COST_MULTIPLIER; utils/spellUpgrade.ts; SpellbookModal
CURRENT_BEHAVIOUR: UI 100×2^L; upgradeSpell 10×2^L. UI spend helper divides by 10 when advertised % 100 === 0.
DESIRED_BEHAVIOUR: Show canister price, or actually charge 10×.
EVIDENCE: gameConstants.ts 94–102; spellUpgrade.ts 103–142; main.mo 1017–1023.
RECOMMENDED_ACTION: One number on modal and canister.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium — wallet debit.
VALIDATION_REQUIRED: spellUpgradeUiSpend; idle hydrate.
STATUS: OPEN

ACTION_ID: BAL-DEATH-DOKA-40
TITLE: Death removes 40% of all Doka and 20% leftover XP
CATEGORY: economy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: utils/deathPenalty.ts
CURRENT_BEHAVIOUR: 40% wallet, 20% leftover XP (not lifetime). Lottery wallets make death huge vs XP slap.
DESIRED_BEHAVIOUR: 10–20% Doka and/or a floor; or tax fight EV not wallet.
EVIDENCE: deathPenalty.ts 11–12, 47–60.
RECOMMENDED_ACTION: Lower Doka rate or cap loss.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium — unpaid pending replay.
VALIDATION_REQUIRED: persistDeathPenalty; resolvePendingDeathReplay.
STATUS: OPEN

ACTION_ID: BAL-AP-GROWTH-UNREACHABLE
TITLE: +1 AP/MP every 25 levels; persist cap 20
CATEGORY: progression
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: progression getPlayerBaseStats; adminSafety maxPersistedAp
CURRENT_BEHAVIOUR: AP 8 until L25; 9 at 25. Cap 20 ⇒ last point at L300. hard_3 is free until then.
DESIRED_BEHAVIOUR: Every 5–8 levels, or raise base to 10 and grow faster.
EVIDENCE: progression.ts 65–72; adminSafety.ts 257–266.
RECOMMENDED_ACTION: Align apMpLevelThreshold with intended mid-game.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium — hard_3, Timestep.
VALIDATION_REQUIRED: Battle init AP vs persist cap.
STATUS: OPEN

ACTION_ID: BAL-VOID-COLLAPSE-UNREACHABLE
TITLE: void_collapse is a built-in id with no starter/runtime spell
CATEGORY: content
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: utils/adminSafety.ts isBuiltInSpellId; SpellbookModal color map
CURRENT_BEHAVIOUR: Built-in cannot be deleted; not in starterSpells; no combat definition in spellData.
DESIRED_BEHAVIOUR: Add the spell or drop the built-in id.
EVIDENCE: adminSafety.ts 15; spellData.ts has no void_collapse export.
RECOMMENDED_ACTION: Content or retire id.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Low.
VALIDATION_REQUIRED: upgradeSpell retired check.
STATUS: OPEN

ACTION_ID: BAL-DUNGEON-MULT-FORMULA-SPLIT
TITLE: Dungeon Doka uses 1.5–4×; persist XP uses multiplier 1
CATEGORY: economy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: engine/portalRules.ts dungeonDokaMultiplierFor; rewardResolver PREAPPLIED; WX handleBattleEnd
CURRENT_BEHAVIOUR: Doka multiplied in WX then persist with PREAPPLIED=1 so XP is not chain-multiplied. Complete bonus maxDepth×50.
DESIRED_BEHAVIOUR: Same multiplier on XP and Doka, or explicitly 1× XP.
EVIDENCE: portalRules.ts 148–162; WX 12428–12536; rewardResolver.ts 46, 147–152.
RECOMMENDED_ACTION: Document or apply chain to XP.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium — dungeon XP spike.
VALIDATION_REQUIRED: Depth 5 persist XP vs overworld.
STATUS: OPEN

ACTION_ID: BAL-TITAN-VIGOR-FLAT-1000
TITLE: Titans Vigor adds a flat 1000 HP
CATEGORY: modifiers
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: data/gameConstants.ts MAP_MODIFIER_TITANS_VIGOR_HP_BONUS
CURRENT_BEHAVIOUR: +1000 HP (10× L1 max). Live onDamageDealt also rolls ×1..5 (mapModifiers.ts 311–314) AFTER player double-pass. Frost L0 crit 80 ×5 = 400 vs mean eHP 75; Crush 26 ×5 = 130 vs L1 player 100 HP.
DESIRED_BEHAVIOUR: +20–50% max HP (not +1000 flat); damage roll 1.0–1.5× or none until double-pass is fixed.
EVIDENCE: gameConstants.ts 330–333; mapModifiers.ts 300–315; stacks with BAL-PLAYER-DMG-DOUBLE-PASS and glass_realm ×2.
RECOMMENDED_ACTION: Percent of maxHp; cap the damage roll.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Low–medium.
VALIDATION_REQUIRED: Modifier + death persist HP.
STATUS: OPEN

ACTION_ID: BAL-JACKPOT-HEAL-1-DOKA
TITLE: Jackpot overworld heal costs 1 Doka
CATEGORY: economy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: utils/itemShop.ts resolveOverworldHealSpend
CURRENT_BEHAVIOUR: jackpot true → dokaCost 1, full heal. 0.5% roll in WX shop click.
EVIDENCE: itemShop.ts 206–212; WX ~18416.
RECOMMENDED_ACTION: Treat as feat trigger only, or cost normal heal.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Low.
VALIDATION_REQUIRED: jackpot_heal achievement; no-heal challenges out of battle.
STATUS: OPEN

ACTION_ID: BAL-BUFF-SHOP-OVERWORLD-DOMINATED
TITLE: Overworld Doka heal is cheaper HP than potions
CATEGORY: economy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: itemShop overworldHealCost; BuffShop BUFF_ITEMS
CURRENT_BEHAVIOUR: ceil(hp/3) Doka (30 HP = 10 Doka) vs health_potion 50 Doka for 30% max (30 HP at L1).
DESIRED_BEHAVIOUR: Potions cheaper or unique (in-battle only, already true for elixir). Raise overworld cost or cut potion price.
EVIDENCE: itemShop.ts 58–65; BuffShop.tsx 31–39.
RECOMMENDED_ACTION: Reprice; keep battle-only items.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Low.
VALIDATION_REQUIRED: In-battle potion vs easy_1 healUsed.
STATUS: OPEN

ACTION_ID: BAL-TWO-SPELL-CATALOGS
TITLE: Frontend starterSpells vs backend spellConfigs can diverge
CATEGORY: content
PRIORITY: P3
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: data/spellData.ts; backend spellConfigs
CURRENT_BEHAVIOUR: Combat uses frontend pool; admin/canister catalog is separate. Binding lag documented in AGENTS.md.
DESIRED_BEHAVIOUR: One catalog or a sync test.
EVIDENCE: spellData.ts starterSpells; main.mo spellConfigs.
RECOMMENDED_ACTION: CI diff of ids.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Low.
VALIDATION_REQUIRED: usableByPlayer retirement.
STATUS: OPEN

ACTION_ID: BAL-MP-UNUSED-ON-STARTERS
TITLE: Starter bar spells cost 0 MP while PLAYER_BASE_MP is 4
CATEGORY: combat
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: data/spellData.ts starterSpells
CURRENT_BEHAVIOUR: Strike/Frost/Chain/Poison/Heal/Drain mpCost 0. MP only for walk/Frozen/Slime.
DESIRED_BEHAVIOUR: Put MP on 1–2 casters so MP growth matters.
EVIDENCE: spellData.ts 14–140.
RECOMMENDED_ACTION: Frost/Chain 1–2 MP.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Low–medium.
VALIDATION_REQUIRED: Frozen Terrain 2× MP; hard_3 AP still independent.
STATUS: OPEN

ACTION_ID: BAL-BOSS-RUSH-TABLE-UNPAID
TITLE: BOSS_RUSH_ROOMS dokaReward/xpReward never persist
CATEGORY: boss-rush
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: hooks/useBossRush.ts BOSS_RUSH_ROOMS; WX handleBossRushRoomClear
CURRENT_BEHAVIOUR: Table 500 Doka / 200 XP (room 0) etc. Persist max(5, floor(L×1.5)) Doka/kill + kill XP. completeBossRushRoom args ignored.
DESIRED_BEHAVIOUR: Pay the table through applyRewards or hide it.
EVIDENCE: useBossRush.ts 24–80; WX 12748–12757; main.mo completeBossRushRoom.
RECOMMENDED_ACTION: Wire bossRushRoomReward in buildBossRushPersistInput.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium — Rush farm.
VALIDATION_REQUIRED: Room 0 persist vs kill-only; clamp 100k.
STATUS: OPEN

ACTION_ID: BAL-STARTER-KIT-NO-GATING
TITLE: Full starter kit including Timestep/Sacrifice is on the bar from L1
CATEGORY: progression
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: data/spellData.ts starterSpells; WorldExploration spell pool
CURRENT_BEHAVIOUR: Strike, Shield, Poison, Chain, Heal, Drain, Frost, Swap, Mark, Barrier, Mirror, Timestep, Sacrifice all exist as static data without level gates.
DESIRED_BEHAVIOUR: Unlock control/nuke over L3–10; keep Strike+one tool at L1.
EVIDENCE: spellData.ts 27–248.
RECOMMENDED_ACTION: minLevel metadata (already exists on some types) enforced at bar.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium.
VALIDATION_REQUIRED: Discovery vs upgradeSpell retired.
STATUS: OPEN

ACTION_ID: BAL-SUMMONER-SATURATION
TITLE: Summoner chance uses player level and exceeds 100% by L44
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: gameConstants ENEMY_SUMMONER_*; WX battle start
CURRENT_BEHAVIOUR: 0.12 + L×0.02 (comment says levelZone / pack). Rolled independently per enemy. L1 14% each → 3-pack P(≥1)=0.36, 8-pack 0.70. L25 62%, L44 100% of enemies. Enemy cap 2; player cap none.
DESIRED_BEHAVIOUR: Use zone 0–2; cap chance 20–35%; keep enemy cap.
EVIDENCE: gameConstants.ts 294–301; WX 11932–11942.
RECOMMENDED_ACTION: Chance from zone; clamp 1.0.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium — board clutter.
VALIDATION_REQUIRED: ENEMY_SUMMON_CAP; cooldown.
STATUS: OPEN

ACTION_ID: BAL-HARD3-AP8-FREE
TITLE: Never spend >8 AP/turn is automatic until AP grows at L25
CATEGORY: challenges
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: challengeCompletion hard_3; PLAYER_BASE_AP
CURRENT_BEHAVIOUR: maxApUsedInTurn <= 8; battle AP is 8. 150 Doka + 450 XP for doing nothing extra.
DESIRED_BEHAVIOUR: Cap 6, or scale with max AP − 1, or delay offer until AP>8.
EVIDENCE: challengeCompletion.ts 81–86, 126–127; PLAYER_BASE_AP 8.
RECOMMENDED_ACTION: Change threshold or gate by level.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Low.
VALIDATION_REQUIRED: Peak AP across Timestep restore.
STATUS: OPEN

ACTION_ID: BAL-BOSS-CATALOG-SPLIT
TITLE: Boss kits / guide / combat templates can disagree
CATEGORY: bosses
PRIORITY: P2
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: data/bossKits.ts; types/bossTypes.ts; WX boss spawn
CURRENT_BEHAVIOUR: Guide uses getBossEffectiveStats; combat uses WX HP/spells. Enemy Register is flavor (PR #328).
DESIRED_BEHAVIOUR: One BossBaseStats → guide and combat.
EVIDENCE: progression.ts 249–338; bossKits.ts.
RECOMMENDED_ACTION: Shared factory.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium.
VALIDATION_REQUIRED: Phase 2 multiplier still composes.
STATUS: OPEN

ACTION_ID: BAL-IAP-PACKAGES-ORPHANED
TITLE: Seed shopPackages cannot be bought
CATEGORY: economy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: main.mo initiatePurchase; admin.mo packages
CURRENT_BEHAVIOUR: initiatePurchase returns GameKey error. Packages still seeded.
DESIRED_BEHAVIOUR: Remove from player UI (already GameKey) or admin-only.
EVIDENCE: main.mo 1154–1168; admin.mo 267–281.
RECOMMENDED_ACTION: Hide packages tab from players.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: Low.
VALIDATION_REQUIRED: Admin shop editor.
STATUS: OPEN

ACTION_ID: BAL-GAMEKEY-MINT-UNBOUNDED
TITLE: GameKey/admin grant cap 10_000_000 vs applyRewards 100_000
CATEGORY: economy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: adminGuard validateDokaGrant; redeemGameKey
CURRENT_BEHAVIOUR: Admin/GameKey can credit up to 1e7 in one write; fight funnel 1e5.
DESIRED_BEHAVIOUR: Align caps or document IAP as the exception.
EVIDENCE: adminGuard.mo MAX_DOKA_GRANT; main.mo 2119.
RECOMMENDED_ACTION: Policy: IAP high cap OK; admin grants log.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Low if IAP kept.
VALIDATION_REQUIRED: redeemGameKeyThroughPersist.
STATUS: OPEN

ACTION_ID: BAL-CREATE-VITALS-MISMATCH
TITLE: Create payload AP 10 / MP 5 vs battle floors 8 / 4
CATEGORY: progression
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: startingChampionStats.ts; gameConstants PLAYER_BASE_*
CURRENT_BEHAVIOUR: Forge shows 10/5; battle init formula 8/4.
DESIRED_BEHAVIOUR: Same numbers on forge and battle.
EVIDENCE: startingChampionStats.ts 10–11; PLAYER_BASE_AP/MP 8/4.
RECOMMENDED_ACTION: Create 8/4 or battle 10/5.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Low.
VALIDATION_REQUIRED: First battle AP/MP; persist cap.
STATUS: OPEN

ACTION_ID: BAL-BOSS-GUIDE-VS-COMBAT
TITLE: Boss Guide ±8%/level-diff does not drive combat HP
CATEGORY: bosses
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: progression getBossEffectiveStats; WorldExploration boss spawn
CURRENT_BEHAVIOUR: Guide table only. Combat HP from calcEnemyMaxHp / config.
DESIRED_BEHAVIOUR: Apply the same multiplier in combat or label the table “preview”.
EVIDENCE: progression.ts 249–338 comment: does NOT replace WX phase2 site.
RECOMMENDED_ACTION: Wire or copy.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: High if wired blindly.
VALIDATION_REQUIRED: Even match vs +5 diff.
STATUS: OPEN

ACTION_ID: BAL-RANGE-CAP-FAVORS-STRIKE
TITLE: maxSpellRange 5 mostly buffs Strike; Frost already 4
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration getEffectiveSpellRange; LevelUpConfig
CURRENT_BEHAVIOUR: min(base+floor(L/10), 5). L1 Strike 1 Frost 4; L10 Strike 2 Frost 5; L40 both 5. Striker challenge Chebyshev ≤2.
DESIRED_BEHAVIOUR: Higher cap for casters or no cap on Strike.
EVIDENCE: WX 3653–3664; legendary_3 direct_hit.
RECOMMENDED_ACTION: Cap 6–8 for non-physical, or +range on spell metadata only.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Low–medium — Striker.
VALIDATION_REQUIRED: Attack Nearest range vs player tile.
STATUS: OPEN

ACTION_ID: BAL-PLAYER-CC-DEAD-ON-BAR
TITLE: Player damage loop never applies advertised debuffStat
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellEngine resolvePlayerCast; queued PRs #528 #555
CURRENT_BEHAVIOUR: After AoE damage, function records type and returns. Frost −1 MP, Drain SP, etc. never land. Enemies do apply debuffs.
DESIRED_BEHAVIOUR: Apply debuffStat on first highlighted hostile (queued PRs).
EVIDENCE: spellEngine.ts 876–1028; #528 #555 open.
RECOMMENDED_ACTION: Land #555/#528; restack union one applyDebuff helper.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium.
VALIDATION_REQUIRED: Frost MP, Drain SP, Slow, Weaken on player casts only.
STATUS: OPEN

ACTION_ID: BAL-PLAYER-SUMMON-NO-CAP
TITLE: Player summons have no alive-cap; enemies cap at 2
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellEngine summon branch; gameConstants ENEMY_SUMMON_CAP
CURRENT_BEHAVIOUR: Each summon spell spawns; AP deducted. No PLAYER_SUMMON_CAP. Enemy cap 2.
DESIRED_BEHAVIOUR: Player cap 2–3.
EVIDENCE: spellEngine.ts 825–836; gameConstants.ts 298–301; grep PLAYER_SUMMON_CAP = 0 hits.
RECOMMENDED_ACTION: Cap + replace-oldest or refuse.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium — summoner identity.
VALIDATION_REQUIRED: AP still deducted on refuse; challenge AP.
STATUS: OPEN

ACTION_ID: BAL-FALLBACK-CRUSH-OUTSCALES-KIT
TITLE: Fallback Crush scales with enemy.level; kit Strike does not
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration fallback melee pool
CURRENT_BEHAVIOUR: Crush 12×max(1, level/5)×enrage. Kit Strike 10 via calcScaledDamage(level unused). Mean L11 Crush ~26 vs Strike 10.
DESIRED_BEHAVIOUR: Fallback ≤ kit melee, or kit uses the same level term.
EVIDENCE: WX 16710–16721; calcScaledDamage.
RECOMMENDED_ACTION: Crush = Strike base or share formula.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium — early TTK.
VALIDATION_REQUIRED: L1 vs L15 melee vs kit.
STATUS: OPEN

ACTION_ID: BAL-HAZARD-FLAT-DAMAGE
TITLE: Lava 8–15 and spikes 5–10 ignore RES and player level
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration hazard step
CURRENT_BEHAVIOUR: Lava 8–15 + Burning 3×3; spikes 5–10; no RES. L1 8–15% max; L25 4–7%.
DESIRED_BEHAVIOUR: % max HP or apply RES; scale with zone.
EVIDENCE: WX 11428–11469.
RECOMMENDED_ACTION: Percent or RES; keep challenge debit.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium — Untouchable / lava deaths.
VALIDATION_REQUIRED: recordInBattleChallengeDamage; Death Realm timer.
STATUS: OPEN

ACTION_ID: BAL-HEAL-ADVERTISED-BUFF-DEAD
TITLE: Blood Mend CHC buff never applies
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellData starter-heal; spellEngine heal branch
CURRENT_BEHAVIOUR: Heal 12 (crit 24). buffStat chc / 0.15 / 2 turns ignored. Shield branch is separate (effectType buff).
DESIRED_BEHAVIOUR: Apply CHC buff after heal.
EVIDENCE: spellData.ts 84–101; spellEngine.ts 654–672.
RECOMMENDED_ACTION: After heal, applyEffect like shield branch.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Low.
VALIDATION_REQUIRED: Crit chance next hits; easy_1 healUsed.
STATUS: OPEN

ACTION_ID: BAL-ENEMY-MITIGATION-UNCAPPED
TITLE: Enemy RES and SR grow without cap and can reach 100
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: progression getEnemyBaseStats; spellEngine computeDamage
CURRENT_BEHAVIOUR: res roll(2, 4+L×0.9)×piece. Rook max RES 100 at L78; king SR 100 at L96. Factor max(0, 1−x/100) ⇒ immunity. Family overwrite can also zero RES.
DESIRED_BEHAVIOUR: Soft cap 40–60 or diminishing returns.
EVIDENCE: progression.ts 180–186; computeDamage 393–407; firstLevelResCanHit100.
RECOMMENDED_ACTION: Clamp effectiveRes/Sr; keep piece identity.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: High — late TTK.
VALIDATION_REQUIRED: Rook L80 vs Strike and Frost.
STATUS: OPEN

ACTION_ID: BAL-TIER-THREE-MORE-UNUSED
TITLE: Admin threeOrMorePercent is not the leftover weight
CATEGORY: spawn
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: combatMath pickEnemyLevelFromTiers; main.mo default 5.0
CURRENT_BEHAVIOUR: leftover = 100−same−adj−twoAway (10 with defaults). threeOrMorePercent stored/validated unused. dist 3..6 not 3+.
DESIRED_BEHAVIOUR: Use the field as the ±3+ weight.
EVIDENCE: combatMath.ts 72–75; main.mo 1717.
RECOMMENDED_ACTION: Wire field; leftover 5%.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Low if 5% vs 10%.
VALIDATION_REQUIRED: Admin save round-trip; MC tail.
STATUS: OPEN

ACTION_ID: BAL-BOOST-LOCKED-XP-150
TITLE: Victory XP always ×1.5; Doka boost dead; BoostToggle unmounted
CATEGORY: economy
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: App.tsx boostMode; GameFlow unused props; WorldExploration boostMode; BoostToggle.tsx
CURRENT_BEHAVIOUR: WX useState("xp") with _setBoostMode unused. App has its own boostMode passed to GameFlow as _boostMode. BoostToggle never rendered. Live XP always ×1.5; Doka ×1.5 never. Prior fights/level tables without 1.5 overstated grind 50%.
DESIRED_BEHAVIOUR: One store; mount toggle; default 1.0× with opt-in 1.5× one currency.
EVIDENCE: WX 2098, 12374–12441; GameFlow 42–49; App 360–362, 497–501.
RECOMMENDED_ACTION: Delete dual store; wire toggle or remove 1.5×.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: High — −33% XP if default off.
VALIDATION_REQUIRED: Recap XP vs persist; Doka boost path.
STATUS: OPEN

ACTION_ID: BAL-LEVELUP-KNOBS-DEAD
TITLE: spellLevelingCostMultiplier and spellDmgGrowthPercent unused; AP field split
CATEGORY: admin
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: main.mo levelUpConfig; upgradeSpell; calcScaledDamage; types/gameTypes.ts LevelUpConfig
CURRENT_BEHAVIOUR: Motoko seeds multiplier 2.0 and dmgGrowth 3. upgradeSpell uses only baseCost×2^L. Damage uses 1.03^upgrade. Frontend LevelUpConfig has apMpGrowthEveryNLevels not apMpLevelThreshold (adminContract maps them).
DESIRED_BEHAVIOUR: Wire knobs or remove from admin.
EVIDENCE: main.mo 621–631, 1017–1023; combatMath.ts 135–136; gameTypes.ts 408–424; adminContract.ts 333–373.
RECOMMENDED_ACTION: Use multiplier and dmg% or hide fields.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium if wired (2.0× cost, 3% vs 3% hardcoded already similar).
VALIDATION_REQUIRED: Admin save; upgrade cost table; damage L5.
STATUS: OPEN

ACTION_ID: BAL-AI-TIER-VARIANCE-30
TITLE: 30% of enemies roll a uniform AI tier 1–10 regardless of level
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: engine/combatMath.ts computeAITier; WorldExploration enemy turn
CURRENT_BEHAVIOUR: Base tier from enemy level, then 30% replace with 1..10. Live gates: aiTier>=5 erratic on leader death; >=10 then 5%/turn betrayal. L1 MC seed 20260928: p(erratic)=0.179, p(betrayal-eligible)=0.029. Instant-kill gate 9 is not live (see BAL-AI-TIER-GATES-DEAD).
DESIRED_BEHAVIOUR: Variance ±1 around base, or 5% chaos roll, not 30% full shuffle.
EVIDENCE: combatMath.ts 34–52; WX 15508–15598; MC seed 20260928, 8k L1 p(erratic)=0.179 p(betrayal)=0.029.
RECOMMENDED_ACTION: Clamp random to base±1; keep betrayal rare at high level.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium — less early chaos.
VALIDATION_REQUIRED: L1 p(betrayal-eligible)<1%; L100 still can betray.
STATUS: OPEN

ACTION_ID: BAL-AI-TIER-GATES-DEAD
TITLE: ENEMY_AI_TIER_GATES constants are never read
CATEGORY: combat
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: data/gameConstants.ts ENEMY_AI_TIER_GATES; WorldExploration hardcoded 5 and 10
CURRENT_BEHAVIOUR: Gates advertise erratic 5, groupTactics 4, instantKill 9, betrayal 10, etc. Grep of ENEMY_AI_TIER_GATES. in src/frontend = 0 live reads. WX uses >=5 and >=10 literals. instantKill/groupTactics/chokepoint never fire from this table.
DESIRED_BEHAVIOUR: Import gates in WX/enemyAI, or delete dead knobs.
EVIDENCE: gameConstants.ts 199–209; WX 15508, 15595; enemyAI.ts comment only at 1422.
RECOMMENDED_ACTION: Wire or remove; do not imply instant-kill exists.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Low if only wiring existing 5/10.
VALIDATION_REQUIRED: Erratic/betrayal still match current literals until a balance pass.
STATUS: OPEN

ACTION_ID: BAL-IDLE-HP-REGEN-FREE
TITLE: Out-of-battle HP regenerates 1 point every 10 seconds for free
CATEGORY: healing
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx idle regen interval
CURRENT_BEHAVIOUR: When not inBattle, setCharacterStats hp+1 every 10s up to linear maxHp. L1: 990s from 1→100. L25: 2190s from 1→220. Does not set challenge healUsed (interval skipped in battle). Stacks with overworld Doka heal ceil(missing/3) and 50% death respawn.
DESIRED_BEHAVIOUR: No idle regen, or 1 HP / 60s, or shrine/rest-map only, so potions and Doka heal remain the sustain loop.
EVIDENCE: WX 3399 comment; WX 3617–3625 setInterval 10000. MC maxHp L1=100 L10=145 L25=220.
RECOMMENDED_ACTION: Gate regen to rest maps / shrines, or slow to 1/60s, or disable while death-guard armed.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Medium — between-fight pacing; Death Realm 1.5s still separate.
VALIDATION_REQUIRED: inBattle skip; challenge healUsed; persist HP after idle; rest-map still feels like a rest.
STATUS: NEW

ACTION_ID: BAL-PACK-SIZE-REWARD-SWING
TITLE: One collision fights the whole 1–8 enemy map roster
CATEGORY: economy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: engine/spawnPolicy.ts rollOverworldEnemyCount; WorldExploration checkBattleTrigger
CURRENT_BEHAVIOUR: Overworld count = floor(rng×8)+1 (mean 4.52). Dungeon extras [0,2,3,4,4,5]. Stepping on one enemy maps `enemies` (all live combatants) into battle start. Victory XP/Doka sum every defeated unit. 1-pack vs 8-pack is 8× rewards; 3-pack tables understate mean ~51%. Depth-5 mean pack ~9.5.
DESIRED_BEHAVIOUR: Aggro radius (Chebyshev ≤1–2) or a 2–4 enemy encounter draw; keep full-map as a named “horde” modifier.
EVIDENCE: spawnPolicy.ts 31–32, 155–160; WX 11808–11816 collision; WX 11872 updatedEnemies = enemies.map; MC meanPack 4.518 seed 20260928.
RECOMMENDED_ACTION: Pull only nearby hostiles, or clamp overworld count to 2–4.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: High — XP/Doka/fight time; dungeon extras still add density.
VALIDATION_REQUIRED: 1-enemy map still starts; dungeon depth extras; Boss Rush rooms unchanged.
STATUS: NEW

ACTION_ID: BAL-MODIFIER-GRAVITY-FOG-DEAD
TITLE: gravity_well and fog_of_war announce but have no combat effect
CATEGORY: modifiers
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: engine/mapModifiers.ts; WorldExploration.tsx _isGravityWell / _isFogOfWar
CURRENT_BEHAVIOUR: Registry hooks are empty placeholders. WX stores `_isGravityWell` and `_isFogOfWar` (underscore = unused). Blood Moon ×1.25 and Mirror Field reflect ARE live in resolvePlayerCast. Players see chips with no mechanical change — a local difficulty collapse vs named threat.
DESIRED_BEHAVIOUR: Implement (e.g. gravity extra MP, fog range/LoS) or stop rolling them in the two-roll trigger.
EVIDENCE: mapModifiers.ts 280–296; WX 2324–2326; contrast spellEngine.ts 895–904.
RECOMMENDED_ACTION: Wire hooks or remove from trigger pool / panel.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Low if removed from pool; medium if gravity/fog suddenly bite.
VALIDATION_REQUIRED: Modifier panel; two-roll trigger still can pick 20 live ids; paper_windstorm/time_warp stay WX-flag based.
STATUS: NEW
