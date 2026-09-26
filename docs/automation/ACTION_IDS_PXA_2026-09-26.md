# ACTION_IDs — 2026-09-26 (Player Experience Coherence Auditor)

**Source:** Player Experience Coherence Auditor (`30118f7c-a49e-11f1-a7d1-d6b4613131ce`)  
**HEAD:** `0f5363f` (`Merge pull request #332`)  
**Narrative:** [`PX_COHERENCE_AUDIT_2026-09-26.md`](./PX_COHERENCE_AUDIT_2026-09-26.md)

Prior PX records remain **open** unless noted. Do not re-file:

- `PXA-2026-08-31-001` … `015` in [`ACTION_IDS_2026-08-31.md`](./ACTION_IDS_2026-08-31.md) (006 HUD hide is done)
- `PXA-2026-09-01-001` … `003` in [`ACTION_IDS_2026-09-01.md`](./ACTION_IDS_2026-09-01.md)
- `PXA-2026-09-02-001` and `PXA-2026-09-02-003` in [`ACTION_IDS_PXA_2026-09-02.md`](./ACTION_IDS_PXA_2026-09-02.md) (002 HUD is done)
- `PXA-2026-09-21-001` … `003` (PR **#343**)
- `PXA-2026-09-22-001` … `003` (PR **#393** — FAIL×Windstorm, summon 10× tag, challenge HUD clicks)
- `PXA-2026-09-23-001` … `003` (PR **#481** — silent Boost ×1.5, HP pots vs 1:3, idle regen)
- `PXA-2026-09-24-001` … `003` (PR **#529** — Board kills, betrayal 6×, portal-verb overload)
- `PXA-2026-09-25-001` … `003` (PR **#579** — hidden Doka lottery, recap challenge name, `maxSpellRange` 5)

Gameplay / production code was **not** modified this run. Do not implement from this file unless a human or the Report Action Orchestrator picks an ID.

---

ACTION_ID: PXA-2026-09-26-001  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Challenge predicates must stay a decision as AP, HP, and pack size grow  
CATEGORY: challenges  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: There is no level cap. Default battle AP is `PLAYER_BASE_AP + floor(level / apMpGrowthEveryNLevels)` (`progression.ts` 59–72) with `apMpGrowthEveryNLevels: 25` (`gameTypes.ts` 417–419). `hard_3` completes when `maxApUsedInTurn <= 8` (`challengeCompletion.ts` 84–86, 126–127). Until level 25 the player cannot spend 9 AP, so the contract cannot fail. After AP grows it becomes “do not dump the bar” — a different ask wearing the same row. `under_50_damage` / `no_healing_under_30_damage` (60–72, 120–123) are absolute HP. Player HP compounds at `statGrowthPercent` 5 (`progression.ts` 74–80). At level 1, 50 damage is half of 100 HP; at level 40 it is a rounding error against compounding HP. Untouchable (`totalDamage === 0`, 88–92, 128–129) stays a real mastery ask. Turn caps (`under_5_turns` / `under_10` / `under_15`) ignore pack size: overworld 1–8 (`spawnPolicy.ts` `OVERWORLD_ENEMY_COUNT_SPAN`) plus `DUNGEON_EXTRA_ENEMIES`. Every fight still rolls one of these 9 at random (`WorldExploration.tsx` 12210–12218), including legendary 1000 XP. PXA-004 scales *payouts*. PXA-009 shapes *which* offer (lava vs Untouchable, feat overlap). Neither rewrites the predicates for unbounded AP/HP/pack.  
SYSTEMS_AFFECTED: challenges, rewards, progression, dungeons, visual feedback  
RECOMMENDED_ACTION: REWORK the predicates (not only the offer table). Express AP-cap as a fraction of *this fight’s* max AP (e.g. never spend the last N, or ≤ 75% of the bar). Express damage caps as a fraction of max HP, or keep only Untouchable as the absolute. Express turn caps as a function of living hostiles (or drop Blitz when pack size is 1). Do not add a level gate and call it a cap. Do not change persist wiring in this ID. HUD visibility stays `shouldShowChallengeHud`.  
AUTONOMY: HUMAN_DESIGN_REQUIRED for the replacement formulas. ORCHESTRATOR_MAY_DRAFT to stop offering `hard_3` while `getPlayerBaseStats(...).ap <= 8`.  
DEPENDENCIES: PXA-2026-08-31-009 (offer shaping, feat overlap); PXA-2026-08-31-004 (payouts). Does not close 009.  
REGRESSION_RISK: MEDIUM — changing completion predicates changes who gets 150–1000 XP. LOW if only the offer is withheld when the contract cannot fail. Do not break `liveBattleChallengePersistEntries`.  
VALIDATION_REQUIRED: Level 1, AP 8: `hard_3` is not offered, or is documented as a free stamp. Level 25, AP 9: spending 9 AP fails `hard_3`. Level 1 vs 40: `under_50_damage` is either scaled or replaced. 1-pawn Blitz is not offered, or the turn cap uses pack size. `pnpm typecheck`. Opening-turn Blitz count (`shouldCountOpeningPlayerTurn`) unchanged.  
STATUS: NEW

---

ACTION_ID: PXA-2026-09-26-002  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Named map events must apply to the player, or the announce must say they do not  
CATEGORY: world-events  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `mapModifierRegistry.apply*` is live (`WorldExploration.tsx` `applyBattleStart` 12076–12079, `applyTurnStart` 14266–14273, `applyDamageDealt` 3499–3517, `applyTurnOrderSort` 14718–14720). The player is **not** in `combatantsRef`. Comment + helper: “Player lives outside `combatantsRef`”; `playerTurnStartModifierTarget` returns `undefined` when no `id === "player"` (`battleSetup.ts` 360–368; test 136–144). Battle start syncs **enemies** then runs `applyBattleStart(combatantsRef.current)` (12075–12079). Titan’s Vigor announce is “+1000 HP, damage rolls 1-5x” (`mapModifiers.ts` 300–316) — enemies in the store get the HP; the player does not. Iron Curse announce “+30% RES, healing halved” (379–397) multiplies store `res` only; heal-half is still `return true`. Mending Mist “5% max HP regen each turn” (350–365) and Swift Winds “+2 MP each turn” (368–376) tick `onTurnStart` on store rows; the player turn-start target is missing. Vampiric Ground “attackers heal 15%” (400–416): `enemyTakesDamage` passes a throwaway `{ hp: characterStats.hp, id: "player" }` (3499–3506), so lifesteal mutates garbage. Glass Realm “dealt and taken” (337–347): outbound `applyDamageDealt` can ×2; `playerTakesDamage` (3424–3432) never calls the registry; enemy melee also skips `playerTakesDamage` (16774–16776). Gravity/Fog empty hooks stay under 09-01-002; Windstorm dual-rate stays 09-02-003. This ID is **symmetric announce vs one-sided store**.  
SYSTEMS_AFFECTED: world events, visual feedback, challenges (no-heal / Untouchable on Mist maps), admin-enabled content, death  
RECOMMENDED_ACTION: REWORK. Either (a) pass a live player combatant into `applyBattleStart` / `applyTurnStart` / `applyDamageDealt` (HP/MP/RES written back through `updateCombatant` / `setCharacterStats`, challenge heal/damage recorded), or (b) rewrite every announce to the actual subject (“Enemies gain +1000 HP”). Do not leave flavor that reads as a shared field rule. Do not implement Gravity/Fog in this ID. Do not restack the whole `advanceTurn` block while **#327/#331/#364** own WX overlap.  
AUTONOMY: HUMAN_DESIGN_REQUIRED to choose (a) vs (b). ORCHESTRATOR_MAY_DRAFT (b) copy-only for Titan / Iron Curse / Mist / Winds / Vampiric / Glass.  
DEPENDENCIES: PXA-2026-09-01-002 (remaining announce-vs-engine); PXA-2026-08-31-008 (slim the set). Does not close 002. If Mending Mist actually heals the player, PXA-009 must stop offering no-heal on that map.  
REGRESSION_RISK: HIGH for (a) — player HP/MP/RES and Untouchable/no-heal will change on Titan/Mist/Glass maps. LOW for (b) copy. MEDIUM if throwaway Vampiric is “fixed” by writing HP without `recordChallengeHealFromHpRestore`.  
VALIDATION_REQUIRED: Titan map: player max HP unchanged unless (a) is chosen and then both sides gain +1000. Mist: either both sides regen and no-heal is withheld, or announce says enemies only. Vampiric: player HP does not move on a throwaway object. Glass: incoming player damage matches the sentence on screen. Import gate if WX is touched.  
STATUS: NEW

---

ACTION_ID: PXA-2026-09-26-003  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Stop printing player SR (and unused evasion/resilience) as if they mitigate incoming hits  
CATEGORY: visual-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Statistics sheet lists SP, **SR**, INIT, **RES**, CHC, FAIL (`WorldExploration.tsx` 18528–18563). SP is a real outbound multiplier (3318–3322). RES is a real inbound mitigator (`playerTakesDamage` 3427–3432). SR is applied when the **player hits an enemy** (`computeDamage` 3356–3363 uses `targetEnemy.sr`). Incoming player damage does **not** read `characterStats.sr` — `playerTakesDamage` states RES-only for that path. `startingChampionStats` still seeds `sr: 5n`, `evasion: 5n`, `resilience: 8n` (`startingChampionStats.ts` 14–18). `evasion` / `resilience` are required `CharacterStats` fields (`main.mo` 12-field contract) with no combat-math reader. EnemyRegister still teaches “evasion passive” (`EnemyRegister.tsx` 81). PXA-012 asked for one resist word unless combat actually splits. Combat *does* split SR/RES **on enemies**. The sheet teaches the player they have the same split inbound. They do not. FAIL as a sheet peer of RES remains 09-22-001’s miss-language problem; this ID is the inbound SR lie.  
SYSTEMS_AFFECTED: visual feedback, terminology, progression, enemies (Register copy)  
RECOMMENDED_ACTION: SIMPLIFY the player sheet: show inbound RES (and SP outbound). Hide player SR until `playerTakesDamage` (and the melee path that skips it, 16774–16776) actually apply it to spell hits. Do not surface evasion/resilience until a combat reader exists — do not invent one in this ID. Register evasion line stays 09-01-001. Do not rename Candid fields here.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT to hide SR / evasion / resilience on the player Statistics block. HUMAN_DESIGN_REQUIRED to make player SR a real inbound spell resist (must also cover the melee-skip path).  
DEPENDENCIES: PXA-2026-08-31-012 (one word per concept). Does not close 012. Do not block on EBA-013.  
REGRESSION_RISK: LOW for hide. HIGH if inbound SR is added only on `playerTakesDamage` while enemy melee still bypasses it. Do not change the 12-field persist contract.  
VALIDATION_REQUIRED: Statistics block has no player SR% (or inbound spell hits are reduced by printed SR on both `playerTakesDamage` and enemy melee). Forge still creates a 12-field payload including unused evasion/resilience. `pnpm typecheck`. A frost hit on the player matches the sheet.  
STATUS: NEW
