# ACTION_IDs — 2026-09-22 Emergent Build & Meta Analyzer

Durable ledger for implementers and the Report Action Orchestrator.  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
HEAD inspected: `0f5363f` (`Merge pull request #332`)  
Gameplay code: not modified. Do not implement balance from this file unless a later human or orchestrator explicitly picks an ID.

Analysis: [`EMERGENT_META_2026-09-22.md`](./EMERGENT_META_2026-09-22.md).  
Reissues still-open `EBMA-2026-09-21-001` … `004`, `006` … `014` (those files never merged; PR #365). Closes `005` (drain counted; Wisp is not a farm). Adds `015`. Reframes `010` (Bomber Inferno not live).

---

ACTION_ID: EBMA-2026-09-22-001  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Cap or refresh same-source player DoT stacks  
CATEGORY: status-stacking  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `appendDotStack` (`engine/dotStacks.ts` 31–37) always appends. `mergeIncomingEffect` (`engine/statusEffects.ts` 92–99) routes every `type === "dot"` through it. `WX` `applyActiveEffect` 1871–1892 does not cap. Poison Arrow and Venom Strike have no `cooldown` (`spellData.ts` 49–67, 395–415). Inferno has CD 3 (519) but Poison does not. `resolvePlayerCast` 777–814 writes `dotDamagePerTurn`. Controlled Archer Poison goes through `resolveSpellCast` and also ticks (`WX` `castControlledSummonSpell` 9849–9872); Archer AP 2 matches Poison cost 2. Arcane Surge (`mapModifiers.ts` 210–217) drops Poison to 1 AP (min 1) via `onApCost`. An 8-AP turn is 4 Poison stacks (8 under Surge), each 4 dmg × 3 independent turns. `hard_3` pays 150 Doka / 450 XP when `maxApUsedInTurn <= 8` (`challengeCompletion.ts` 81–86, 126–127). Null Field does not suppress DoTs.  
SYSTEMS_AFFECTED: `engine/dotStacks.ts`; `engine/statusEffects.ts` `mergeIncomingEffect`; `WX` `applyActiveEffect`; player DoT branch in `spellEngine.ts`; optional map-modifier AP discount; Archer kit  
RECOMMENDED_ACTION: Same-name + same-caster refresh (reset duration, keep one stack) **or** a small per-target cap (e.g. 2 stacks per `effectName`). Keep Poison, Venom, and Inferno as three types that can coexist. Do not change per-tick numbers. Do not flatten DoT identity into one “poison.” Do not nerf Timestep because it amplifies one extra dump.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None. `EBMA-2026-09-22-006` must not land first.  
REGRESSION_RISK: MEDIUM — last-hostile DoT death tests assume stacks still tick. Refresh must still kill.  
VALIDATION_REQUIRED: Helper tests: two Poison casts → one stack, duration refreshed (or cap 2). Poison + Inferno still both tick. Controlled Archer Poison still ticks but does not unbounded-append past the cap. `pnpm typecheck` + `pnpm check`. Play a 10-turn boss and confirm the integral is bounded.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-22-002  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Player summon alive-cap and summon-spell cooldown  
CATEGORY: summon-abuse  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300) and `ENEMY_SUMMON_COOLDOWN_TURNS = 2` (301). Player `spawnPlayerSummon` (`WX` 9582–9635) calls `addCombatant` with no count check. All five summon rows omit `cooldown` (`spellData.ts` 547–690). Summon AP is charged (`castResultSpendsAp` includes `"summon"`, `challengeCompletion.ts` 330–331) — the 2026-08-31 free-place hole stays closed — but an 8-AP turn still buys Wolf + Archer + Wisp. Each unit gets its own turn. Occupancy unseal and Void Rift ticks are closed; they are not a cap. Player-side turns are control-mode, not AI (`WX` 14418–14421). Comment at `enemyAI.ts` 1830 (“player-side summonCount gate”) is still false.  
SYSTEMS_AFFECTED: `WX` `spawnPlayerSummon`; summon spell defs; `gameConstants.ts`; optional `summonSpawn.ts`  
RECOMMENDED_ACTION: Cap alive player-side summons (2 or 3) at spawn. Add a short cooldown (1–2 turns) on each summon spell. Keep five kit identities and current lifespan / upgrade formulas. Do not copy the enemy 2-turn summoner cadence onto the player if a per-spell CD already exists. Do not close ally-buff targeting (`resolvePlayerCast` 676–718) as a substitute for a cap.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None. Pair with `010`/`014` if Bomber Inferno is restored as a kit id that already has `cooldown: 3`.  
REGRESSION_RISK: MEDIUM — occupancy / reserved-cell fallback (`summonSpawn.ts`) and portal unseal must still run. Do not change enemy cap.  
VALIDATION_REQUIRED: Tests: fourth player summon is rejected (if cap is 3); recasting Wolf during CD is `on_cooldown`. A 2-summon board still plays. Import gate.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-22-003  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Pacifist Run matches advertised heal/buff-only; count Bite, Mark, Slow-1, summon damage, and attract_multi  
CATEGORY: achievement-spell  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Feat copy is “Win a battle using only heal or buff spells” (`admin.mo` 324, 500 Doka). Execute path is only `recordPlayerSpellType` (`WX` 17015–17033): `"summon"`, `"heal"`, `"debuff"`, `"defense"` do not flip. Vampire Bite (`admin.mo` 179) is `effectType: "heal"` with 20 damage and enters the damage loop (`resolvePlayerCast` 876+). Mark is `effectType: "debuff"` (`spellData.ts` 161–176). Slow / Weaken are `effectType: "debuff"` with `damage: 0`; `calcScaledDamage` (`combatMath.ts` 130–136) floors that to 1. Void Collapse (`admin.mo` 190) is `effectType: "attract_multi"` — `offCats` lists `"attract"` not `"attract_multi"`, so 80 AoE would stay legal once battle AP is 12 (`getPlayerBaseStats` 59–72). `applyHealBuffSideEffect` has **no WorldExploration caller**; preview must stay off (`shouldApplyHealBuffSideEffectOnRangePreview` `targeting.ts` 83–85). Summon damage still never flips `battleOnlyHealBuffSpellsRef`. `clientTrustedVictoryAchievementConditions` (`victoryAchievements.ts` 37) also runs from `handleBossRushRoomClear` (`WX` 12897–12916).  
SYSTEMS_AFFECTED: `WX` `recordPlayerSpellType` / achievement fire; summon spawn/cast; Bite/Mark/Slow execute; Void Collapse; `victoryAchievements.ts`  
RECOMMENDED_ACTION: Fail the feat unless every resolved player spell is heal, buff, Timestep, or (optionally) Mirror. Flip when the player casts a summon spell **or** when a player-side summon deals damage / applies an offensive kit spell. Vampire Bite must fail it even while heal metadata is still wrong. Normalize `"attract_multi"` to the attract/aoe bucket. For 0-base-damage debuffs, skip the damage loop (or allow a 0 scaled hit) so Slow is not a 1-damage Pacifist poke — do not change Slow/−2. **Do not** call `applyHealBuffSideEffect` from `getSpellRangeTiles`. Do not change the Doka amount. Keep Boss Rush room-clear feat fire for a *true* pacifist.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None. Complements `013` (Bite metadata) and `004` (debuff wire) but must not wait on them.  
REGRESSION_RISK: LOW — feat is once-per-account. Preview tests in `targeting.test.ts` must stay green. `victoryAchievements.test.ts` must keep room-clear conditions.  
VALIDATION_REQUIRED: Tests: Shield-only win still unlocks; Wolf kill does not; Bite kill does not; Slow does not; selecting Strike for range preview still does not fail; Boss Rush room-clear with heals-only still can unlock; a synthetic `"attract_multi"` cast fails the feat. Import gate.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-22-004  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Apply player `debuffStat` and cap stacked AP/MP denial  
CATEGORY: ap-mp-denial  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `resolvePlayerCast` damage loop (`spellEngine.ts` 876–1028) never calls `applyEffect` for `debuffStat`. Slow, Frost Bolt, Frost Nova, Weaken, Expose, Shadow Veil, Drain Courage, Cursed Wound, Life Drain therefore deal (or skip) damage and drop the advertised half. 0-damage Slow/Weaken still deal 1 because `calcScaledDamage` floors 0 to 1. `resolveSpellCast` 529–548 **does** apply the same fields — a player-controlled Archer Slow is live. Enemy / boss casts apply them on the inline path. `getStatModifier` (`statusEffects.ts` 45–63) **adds** every `ap`/`mp` modifier from different `effectName`s. Wiring the player path without a cap, then later fixing `buildEnemyKit` zone (`009`), would let Frost + Slow + Drain Courage approach 0 AP/MP. Same-name still replaces (`applyOrRefreshNonDotEffect` 71–84).  
SYSTEMS_AFFECTED: `spellEngine.ts` `resolvePlayerCast`; `statusEffects.ts` `getStatModifier`; enemy debuff path; optional `calcScaledDamage` 0-damage callers  
RECOMMENDED_ACTION: After a successful player hit (or on a pure-debuff spell), apply `debuffStat` the same way `resolveSpellCast` does. Cap combined AP/MP additives per target (e.g. cannot reduce the victim below 1 AP and 1 MP from debuffs). Do not change Slow/−2 or Frost/−1 numbers. Do not strip Archer kit Slow. Skip the 1-floor for baseDamage 0 on the player damage loop (keep `max(1, …)` for real nukes). This is a restore plus a safety rail, not a nerf of an existing player-bar combo.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: `009` makes the enemy-side cap load-bearing. Ship the cap in the same change as the player wire, or immediately after.  
REGRESSION_RISK: MEDIUM — Haste is `buffStat: "mp"` modifier `+2` (additive). The floor must not clamp buffs. Strike 10 must stay ≥ 1.  
VALIDATION_REQUIRED: Tests: player Slow writes `stat: "mp"` on the target and does not deal 1; two different MP debuffs cannot sum past the floor; Haste +2 still applies; controlled Archer Slow still applies; Strike 10 still scales with `max(1, …)`. Import gate.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-22-006  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Write `dotDamagePerTurn` (and Slow stat) on summon-AI applyEffect  
CATEGORY: summon-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Live AI summon path is `decideSummonAction` + `executeSummonAction` (`enemyAI.ts` 1748+; `WX` ~14400). `applyCast` (`summonExecutor.ts` 191–203) applies DoTs without `dotDamagePerTurn` and debuffs without `stat`/`modifier`. `tickDotStacks` (`dotStacks.ts` 105–108) ignores those rows. Player-controlled summons use `resolveSpellCast` (`WX` `castControlledSummonSpell`) and **do** tick / apply Slow. AI Archer Poison and AI Bomber Inferno are cosmetic **and** mostly uncastable until `014` (Bomber 1 AP vs Inferno 5; Wolf 2 vs Venom 3). Bomber kamikaze also only runs on the `damage > 0` branch; Inferno `damage` is 0.  
SYSTEMS_AFFECTED: `engine/summonExecutor.ts`; DoT tick; bomber lifespan  
RECOMMENDED_ACTION: Copy `dotDamagePerTurn` from the kit spell onto the effect. Copy `debuffStat` / `debuffModifier` for Slow. Restore bomber detonation on Inferno cast even when upfront damage is 0 **or** give Bomber a damage>0 detonate in `014`. **Do not ship DoT ticks before 001** — AI + player-controlled stacks would double the unbounded integral. Slow-stat restore may ship with 004.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: EBMA-2026-09-22-001 for DoT ticks; 014 for kits that cannot pay AP  
REGRESSION_RISK: HIGH if 001 is missing. MEDIUM after 001 (extra ticks on enemy-facing AI summons too).  
VALIDATION_REQUIRED: Tests: AI Poison effect has `dotDamagePerTurn === 4` and `sumDotTicks` > 0 **after** the kit can pay AP; bomber Inferno sets hp 0; AI Slow writes `stat: "mp"`. Import gate.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-22-007  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Keep catalog ≠ ownership; do not treat backend seed as discovery  
CATEGORY: discovery-progression  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–719) returns true whenever `usableByPlayer !== false`. `ownedSpells` (`WX` 2412–2440) unions starters with that filter. `OLD_SPELL_NAMES_SET` (`WX` 2356–2389) only drops leftover backend names (Inferno/Fireball/…). `defaultSpells()` (`admin.mo` 168–191) therefore grants Shadow Strike / Thunder Clap / Void Collapse / inert Soul Rend / Bite / Reflect to every seeded account. Achievements and challenges still grant Doka only. No `ownedSpellIds` / `observedSpellIds`. PR #300 did not ship the persist maps. Sibling design already owns the pipeline: `SDA-2026-08-31-002` … `004`, `SDE-2026-08-31-001` … `003`. GameKey shop does not grant spells.  
SYSTEMS_AFFECTED: `WX` `ownedSpells`; `adminSafety.ts`; `admin.mo` `defaultSpells`; future grant writers  
RECOMMENDED_ACTION: Do **not** implement observe-to-unlock from this automation. When SDA-002 lands, migrate existing characters from starters + `spellLevelKeys` ∪ `spellBarOrder`, not from the full catalog. Leave Shadow Strike numbers alone — it is STRONG_BUT_HEALTHY, not a dump-to-nerf.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-08-31-002 / 003 / 004  
REGRESSION_RISK: HIGH if migrate under-seeds the bar.  
VALIDATION_REQUIRED: Owned by the SDA tickets. This ID is a meta constraint, not a second implementation.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-22-008  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Monitor Titan’s Vigor × Glass Realm × Sacrifice; do not nerf yet  
CATEGORY: map-modifier-lottery  
PRIORITY: P2  
CONFIDENCE: MEDIUM  
EVIDENCE: `applyDamageDealt` is called from `enemyTakesDamage` (`WX` 3472–3516). The main player damage loop uses `calculatePlayerDamage` / `applyDamageToEnemy` and skips the hook. Sacrifice (`spellEngine.ts` 749–763) uses `dealDamage` → `enemyTakesDamage`, so it **does** get Titan 1–5× and Glass ×2. Sacrifice HP cost reads `characterStats.hp` (750), not necessarily Titan’s `onBattleStart` +1000. Mark and crit do not apply. Vampiric Ground is on the same hook and also misses the main bar. Self-HP now records for Untouchable (`WX` 9374–9386) — do not treat that as a nerf of this lottery.  
SYSTEMS_AFFECTED: `mapModifiers.ts`; `WX` `enemyTakesDamage`; Sacrifice  
RECOMMENDED_ACTION: No number change. If play data shows Glass+Titan maps are Sacrifice-or-skip, then either route all player damage through one modifier hook **or** exclude Sacrifice from `onDamageDealt`. Do not flatten Titan’s identity.  
AUTONOMY: MONITOR  
DEPENDENCIES: None  
REGRESSION_RISK: N/A until a number change is chosen.  
VALIDATION_REQUIRED: If a later ID changes the hook, add a test that Strike does or does not take Titan/Glass consistently with Sacrifice.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-22-009  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Pass a numeric zone into `buildEnemyKit`  
CATEGORY: relative-progression  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Call site `WX` 11920: `buildEnemyKit(enemy.pieceType, currentMap.levelZone)`. `levelZone` is `{ name, minLevel, maxLevel }`. `buildEnemyKit` (`enemyAI.ts` 194–199) does `Math.floor(levelZone)` → `NaN`; `z >= 1` is false. Every piece stays on the zone-0 kit (pawn Strike only, bishop Frost only, no queen Inferno/heal). Intended mid/late kits never appear, so player DoT/summon packages face a weaker field than the data file describes. `longHorizonSim.ts` still documents the `NaN`.  
SYSTEMS_AFFECTED: `WX` battle-start kit assign; `enemyAI.ts` `buildEnemyKit`; enemy threat  
RECOMMENDED_ACTION: Pass `playerTier`, `minLevel`, or `floor((minLevel-1)/tierSize)` — a number. Do not change kit contents in the same PR. After this ships, re-evaluate enemy Frost+Slow stacking (`004` cap). This restores counterplay; it is not a player nerf.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None. Makes `004`’s enemy-side cap relevant.  
REGRESSION_RISK: MEDIUM — zone 1+ bishops/queens gain Poison/Inferno/heal. Encounter length will change.  
VALIDATION_REQUIRED: Unit test: `buildEnemyKit("bishop", 0)` vs `buildEnemyKit("bishop", 1)`. Integration: `assignEnemySpells` with a real `LevelZone` object must not pass the object through. Import gate.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-22-010  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Honor kit-spell cooldowns on controlled and AI summons (after kit AP is aligned)  
CATEGORY: cooldown-circumvention  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Player Inferno CD is enforced on the bar. `planSummonControlCast` (`utils/summonControlCast.ts` 221–282) gates AP, range, live geometry, and Striker — not cooldown. Bomber `summonKit` is `["spell-inferno"]` (`spellData.ts` 650) but Bomber `ap` is 1 (`spellData.ts` 652; `SUMMON_AP.bomber` `gameConstants.ts` 42) while Inferno costs 5. Live `no_ap` (`summonControlCast.ts` 244–246; `summonExecutor.ts` 154–159). The 2026-08-31 Attack Nearest Inferno skip stays closed. This is **not** a Day-1 launder; it becomes one if `014` gives the kit enough AP without a lock.  
SYSTEMS_AFFECTED: `utils/summonControlCast.ts`; `WX` `castControlledSummonSpell`; `executeSummonAction`; player `spellCooldownsRef`  
RECOMMENDED_ACTION: Per-summon cooldown map keyed by kit spell id. If the kit spell declares `cooldown`, start it on that unit after a successful kit cast. Do not share the player Inferno lock with the Bomber (a spawned Bomber may still cast once) — just stop every-turn recast. Do not add a CD to a kit that cannot fire; ship with or immediately after `014`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: Stronger / load-bearing after `014`. Works alone as a no-op today.  
REGRESSION_RISK: LOW today. MEDIUM after 014 if CD is omitted. Wolf Strike / Archer Poison have no CD and stay spam-limited by summon AP (2).  
VALIDATION_REQUIRED: After 014: Bomber Inferno twice in two turns is `on_cooldown` after the first. Archer Poison still recasts if AP remains (or once per 2-AP turn). Import gate.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-22-011  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Retarget enemy summoner chance to pack/zone, not per-enemy × player level  
CATEGORY: summon-density  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `WX` 11932–11942: `0.12 + characterStats.level * 0.02` rolled **per enemy**. Level 44+ is 100% summoner on every trash mob. Comment in `gameConstants.ts` 295–297 still says “~12% of packs get one summoner; chance scales with levelZone.” `ENEMY_SUMMON_CAP = 2` keeps this from going infinite.  
SYSTEMS_AFFECTED: `WX` battle-start summoner flag; `gameConstants.ts`  
RECOMMENDED_ACTION: One roll per pack (or per non-summon enemy **using levelZone**, capped) so the comment matches the code. Keep the alive cap at 2. Do not remove enemy Wolf/Archer kits.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None  
REGRESSION_RISK: LOW — late-game boards get quieter; cap already bounded the abuse.  
VALIDATION_REQUIRED: Test the chance helper with level 1 vs 50 vs a zone number. Import gate.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-22-012  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Apply Blood Mend / Rally CHC buffs to the crit roll  
CATEGORY: underpowered-restore  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Both spells set `buffStat: "chc"`, `buffModifier: 0.15` (`spellData.ts` 96–98, 428–430). The heal branch (`resolvePlayerCast` 654–673) heals and returns **without** writing the buff effect. Crit uses `ctx.chc` from raw `characterStats.chc`. `getStatModifier` never sees `chc` on that path. If someone later multiplies `chc` by 0.15, that would **cut** crit chance — the literal is a +15 percentage-point intent, not a 0.15× multiplier.  
SYSTEMS_AFFECTED: `WX` `playerSpellContext`; heal/buff apply; `getStatModifier`; `resolvePlayerCast` heal branch  
RECOMMENDED_ACTION: Write the `chc` buff on the heal branch (or a shared heal+buff path). Feed crit chance through effects as **additive percentage points** (Blood Mend +15), not a 0.15 multiplier. Do not change heal amounts. This is a restore.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None  
REGRESSION_RISK: LOW — slightly more crits when the buff is up.  
VALIDATION_REQUIRED: Test: after Blood Mend, `chc` used by `resolvePlayerCast` is base+15. Import gate.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-22-013  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Restore Vampire Bite / Soul Rend / Reflect Barrier metadata so catalog seeds fire  
CATEGORY: underpowered-restore  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `defaultSpells()` (`admin.mo` 168–191) dumps three ids that `resolvePlayerCast` cannot execute as advertised. Vampire Bite: `effectType = "heal"` + `spellType = "drain"` + enemy target → 20 damage, no heal, Pacifist-legal (`003`). Soul Rend: `effectType = "dot"` without `dotDamagePerTurn` → DoT branch, 0 tick, 25 upfront lost. Reflect Barrier: `effectType = "buff"` without `buffStat` / `isMirror` / self target → no-op (player Mirror uses `isMirror` + `activatePlayerMirror`). Shadow Strike / Thunder Clap / Void Collapse on the same seed **do** fire.  
SYSTEMS_AFFECTED: `admin.mo` `defaultSpells`; optional frontend mapping of backend configs; Pacifist (`003`)  
RECOMMENDED_ACTION: Bite → `effectType: "drain"` (keep healAmount 20). Soul Rend → set `dotDamagePerTurn` (and keep or split the 25 upfront via `damage` on a non-dot `effectType`). Reflect Barrier → `isMirror: true` and `targetType: "self"`, or retire it as duplicate of starter Mirror. Do **not** change Shadow Strike 35/3. Ship Pacifist `003` even if Bite stays mis-typed. If Bite becomes `drain`, it already fails no-heal via `onPlayerHealed` and Pacifist via `offCats`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: `003` must not wait on this. If Bite becomes `drain`, Pacifist flips via `offCats` even without a broader 003 — still ship 003 for summons/Mark/Slow/`attract_multi`.  
REGRESSION_RISK: MEDIUM — live characters already “own” these ids. Changing Bite to drain makes it fail Pacifist. That is the advertised spell.  
VALIDATION_REQUIRED: Tests: Bite heals the caster and is `effectType === "drain"`; Soul Rend ticks; Reflect Barrier activates the same mirror consume as starter Mirror. Import gate. Motoko/bindgen if the seed rows change.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-22-014  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Align summon kit AP budgets with advertised kit spells  
CATEGORY: underpowered-restore  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `getSummonBaseStats` (`progression.ts` 218–244) sets `maxAp = (unitDef.ap ?? SUMMON_AP[ai] ?? 2) + floor(spellLevel / 3)`. Starter kits (`spellData.ts` 547–690) vs costs: Archer 2 vs Poison/Slow 2 (fires); Wolf 2 vs Strike 2 / Venom 3 (Venom dead); Sentinel 2 vs Shield 2 / Iron Skin 3 (Iron Skin dead); Wisp 2 vs Blood Mend 3 / Rally 4 (both dead **and** cannot target the player — 015); Bomber 1 vs Inferno 5 (dead). `planSummonControlCast` 244–246 and `summonExecutor.applyCast` 154–159 both reject `currentAp < apCost`. Bomber kamikaze only runs when `damage > 0` (`summonExecutor.ts` 177–180); Inferno `damage` is 0. Cards promise a healer and a kamikaze. Live package is occupancy + Archer + Wolf Strike. Prior 09-02 `010` treated Bomber Inferno as a Day-1 CD launder; it is not.  
SYSTEMS_AFFECTED: `spellData.ts` summon `ap` / kit ids; `gameConstants.ts` `SUMMON_AP`; optional dedicated Bomber detonate spell; `summonExecutor.ts` kamikaze gate  
RECOMMENDED_ACTION: Restore identities without recreating an Inferno launder. Prefer a 1-AP Bomber detonate with `damage > 0` (so kamikaze runs) over giving Bomber 5 AP to recast Inferno. Give Wisp 3 AP **or** a kit-local 2-AP mend **and ship 015 in the same change** (AP alone does not heal the player). Wolf Venom either costs 2 on the kit or Wolf has 3 AP. Do **not** lower player-bar Inferno / Blood Mend costs. Ship `010` in the same change if Bomber can cast a `cooldown: 3` id. Do not enable AI DoT ticks (`006`) before `001`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: `010` if the restored Bomber kit id has `cooldown`. `015` for Wisp. `006` after `001`.  
REGRESSION_RISK: MEDIUM — Wisp heal that actually restores player HP must fail no-heal (`recordChallengeHealFromHpRestore` with the amount). A 5-AP Bomber without `010` recreates the 09-02 launder.  
VALIDATION_REQUIRED: Tests: Wisp at spell level 0 can pay Blood Mend **and** restore player HP (015); Bomber detonates (hp 0) on a successful kit cast; Wolf can cast Venom or the kit no longer lists it; Inferno on the **player** bar still has CD 3. No-heal + Wisp Blood Mend on the player fails `easy_1`. Import gate.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-22-015  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Restore Wisp player/ally heal targeting; record no-heal from the clamped amount  
CATEGORY: underpowered-restore  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Card copy is “Summons a Wisp that heals allies” (`spellData.ts` 663–665) with kit `starter-heal` / `spell-rallying-cry`. Player-side summons are control-mode (`WX` 14418–14421), not `decideSummonHealer`. `castControlledSummonSpell` always builds the `resolveSpellCast` target from `targetEnemy` (`WX` 9825–9869). The player is not in `combatantsRef`. `resolveSpellCast` heals `target.id` (`spellEngine.ts` 551–557). `ctx.heal` writes character HP only when `isPlayerHealTargetId` (`WX` 9185–9186 / 15005–15016); enemy and summon ids are no-ops. The recorded challenge delta is `characterStatsRef.current.hp - previousHp` **after** `setCharacterStats`, whose ref assignment lives inside the React updater (`WX` 3261–3270), so the delta is 0 even if a player id ever arrived. Unused `runSummonAI` (`summonAI.ts` 415–418) would `ctx.heal(owner.id, …)` — not live. Drain no-heal (`onPlayerHealed` with the amount) stays closed. Open PR #380 is “fail no-heal when Wisp ctx.heal restores HP”; union the helper, do not fight over WX.  
SYSTEMS_AFFECTED: `WX` `castControlledSummonSpell` / `ctx.heal`; `utils/summonControlCast.ts` (self/ally targeting); `challengeCompletion.ts` `recordChallengeHealFromHpRestore`; optional summon HP writer for self-mend  
RECOMMENDED_ACTION: Let Wisp Blood Mend / Rally target the player and allied summons (self/ally). Write HP for those ids. Pass the **clamped heal amount** into `recordChallengeHealFromHpRestore` (do not subtract a stale ref). Do **not** heal hostiles. Do not re-open drain. Do not skip 014’s AP alignment — both are required for the advertised healer. Keep overworld Doka-to-HP from flipping the flag.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: Ship with or immediately after `014`. Sibling PR #380 if still open — union recording, do not duplicate WX blocks.  
REGRESSION_RISK: MEDIUM — a working Wisp heal that forgets the amount re-opens `easy_1` / `hard_1`. Occupancy / Striker distance must still use the summon tile.  
VALIDATION_REQUIRED: Tests: Wisp Blood Mend on the player increases character HP and sets `healUsed`; clicking an enemy with Blood Mend does not heal that enemy; overworld Doka-to-HP still does not set the flag; drain still sets it. Import gate.  
STATUS: NEW  
