# ACTION_IDs — 2026-09-29 Emergent Build & Meta Analyzer

Durable ledger for implementers and the Report Action Orchestrator.  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
HEAD inspected: `0f5363f` (`Merge pull request #332` / report-findings orchestration)  
Gameplay code: not modified. Do not implement balance from this file unless a later human or orchestrator explicitly picks an ID.

Analysis: [`EMERGENT_META_2026-09-29.md`](./EMERGENT_META_2026-09-29.md).  
Reissues `EBMA-2026-09-28-001` … `004`, `006` … `023` (still unimplemented on `main`; **005 stays closed**). Adds `024`.

Unmerged prior ledgers (do not treat as `main`): `ACTION_IDS_EBMA_2026-09-28.md` on draft PR #721; 09-27 on #676; 09-26 on #627; 09-25 on #584; 09-24 on #522; 09-23 on #456; 09-22 on #414; 09-21 on #365.

Queued vehicles (do not duplicate in this automation): `#496` = 017; `#581` = Timestep 0 AP vs Arcane Surge min-1 (after 017); `#528`/`#555` = 004 wire (still need the AP/MP cap); `#550` = 015 buff-before-heal; `#443` = Mending Mist player HP (not live); `#596` = 018 player Haste live pool; `#598` = 019 summon walk/cast pool; `#597`/`#709` = 020 Sentinel kit ally target (pick one); `#644` = 013 Bite `spellType` drain; `#647` = 013 Soul Rend upfront; `#658` = 021 `res_sp`; `#659` = 022 Shield melee RES; `#714` = 003 control-mode kit half; `#749` = 003 auto-summon AI half (helper unwired); `#700` = 006 (blocked on 001); `#699` = 023; `#766` = 024. `#762` is CRP kit decide/execute, not 014.

---

ACTION_ID: EBMA-2026-09-29-001  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Cap or refresh same-source player DoT stacks  
CATEGORY: status-stacking  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `appendDotStack` (`engine/dotStacks.ts` 31–37) always appends. `mergeIncomingEffect` (`engine/statusEffects.ts` 92–99) routes every `type === "dot"` through it. `WX` `applyActiveEffect` 1871–1892 does not cap. Poison Arrow and Venom Strike have no `cooldown` (`spellData.ts` 49–67, 394–415). Inferno has CD 3 (519) but Poison does not. `resolvePlayerCast` 777–814 writes `dotDamagePerTurn`. Arcane Surge (`mapModifiers.ts` 210–217) and Arcane Overflow (324) each drop AP by 1 (min 1). Battle Elixir adds +3 AP this turn (`WX` 3576–3578). An 8-AP turn is 4 Poison stacks (8 under Surge), each 4 dmg × 3 independent turns. Controlled Archer Poison also ticks via `resolveSpellCast` 561–574. `hard_3` pays 150 Doka / 450 XP when `maxApUsedInTurn <= 8` (`challengeCompletion.ts` 80–86, 126–127). Null Field does not suppress DoTs (`mapModifiers.ts` 419–431). Timestep does not currently add a second dump (017). Queued `#700` would copy `dotDamagePerTurn` onto AI kit casts and append the same uncapped integral onto the **player**.  
SYSTEMS_AFFECTED: `engine/dotStacks.ts`; `engine/statusEffects.ts` `mergeIncomingEffect`; `WX` `applyActiveEffect`; player DoT branch in `spellEngine.ts`; optional map-modifier AP discount  
RECOMMENDED_ACTION: Same-name + same-caster refresh (reset duration, keep one stack) **or** a small per-target cap (e.g. 2 stacks per `effectName`). Keep Poison, Venom, and Inferno as three types that can coexist. Do not change per-tick numbers. Do not flatten DoT identity into one “poison.” Do not nerf Timestep, Battle Elixir, or Arcane Surge because they amplify one extra recast. Relative `hard_3` is 016, not a Poison cost change. **Do not merge `#700` until this cap exists.**  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None. `EBMA-2026-09-29-006` / `#700` must not land first.  
REGRESSION_RISK: MEDIUM — last-hostile DoT death tests assume stacks still tick. Refresh must still kill.  
VALIDATION_REQUIRED: Helper tests: two Poison casts → one stack, duration refreshed (or cap 2). Poison + Inferno still both tick. Archer Poison still applies one stack per cast. `pnpm typecheck` + `pnpm check`. Play a 10-turn boss and confirm the integral is bounded.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-29-002  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Player summon alive-cap and summon-spell cooldown  
CATEGORY: summon-abuse  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300) and `ENEMY_SUMMON_COOLDOWN_TURNS = 2` (301). Player `spawnPlayerSummon` (`WX` 9582–9635) calls `addCombatant` with no count check. All five summon rows omit `cooldown` (`spellData.ts` 547–690). Comment at `enemyAI.ts` 1830 (“player-side summonCount gate”) is still false. Summon AP is charged (`castResultSpendsAp` includes `"summon"`, `challengeCompletion.ts` 330–331) — the 2026-08-31 free-place hole stays closed — but an 8-AP turn still buys Wolf + Archer + Wisp. Each unit gets its own turn. Occupancy unseal and Void Rift ticks are closed; they are not a cap.  
SYSTEMS_AFFECTED: `WX` `spawnPlayerSummon`; summon spell defs; `gameConstants.ts`; optional `summonSpawn.ts`  
RECOMMENDED_ACTION: Cap alive player-side summons (2 or 3) at spawn. Add a short cooldown (1–2 turns) on each summon spell. Keep five kit identities and current lifespan / upgrade formulas. Do not copy the enemy 2-turn summoner cadence onto the player if a per-spell CD already exists. Do not close ally-buff targeting (`resolvePlayerCast` 676–718) as a substitute for a cap. Do not treat 019/020/023 as this cap.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None. Pair with `010` if Bomber Inferno remains a kit id that already has `cooldown: 3` after 014.  
REGRESSION_RISK: MEDIUM — occupancy / reserved-cell fallback (`summonSpawn.ts`) and portal unseal must still run. Do not change enemy cap.  
VALIDATION_REQUIRED: Tests: fourth player summon is rejected (if cap is 3); recasting Wolf during CD is `on_cooldown`. A 2-summon board still plays. Import gate.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-29-003  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Pacifist Run matches advertised heal/buff-only; count Bite, Mark, Slow-1, summons, attract_multi, auto-summon AI  
CATEGORY: achievement-spell  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Feat copy is “Win a battle using only heal or buff spells” (`admin.mo` 324, 500 Doka). Execute path is only `recordPlayerSpellType` (`WX` 17015–17033): `"summon"`, `"heal"`, `"debuff"`, `"defense"`, `"buff"`, `"attract_multi"` do not flip. Vampire Bite (`admin.mo` 179) is `effectType: "heal"` with 20 damage and enters the damage loop (`resolvePlayerCast` 876+). Queued `#644` would make Bite actually drain/heal and would **still** record `"heal"`. Mark is `effectType: "debuff"` (`spellData.ts` 160–176). Slow / Weaken list `damage: 0` but `calcScaledDamage` floors to 1 (`combatMath.ts` 130–136) and still record `"debuff"`. Void Collapse is `effectType: "attract_multi"` (`admin.mo` 190). `shouldApplyHealBuffSideEffectOnRangePreview` (`targeting.ts` 83–85) must stay false. Control-mode kit casts never call `recordPlayerSpellType` on `main`. Queued `#714` (`pacifistRun.ts`) flips after offensive kit `effectType`s (damage/dot/…) and **still** leaves Bite / Mark / Slow-1 / `attract_multi` / the summon spell legal. Auto-summon AI (`executeSummonAction`) also never calls the hook; queued `#749` (`autoSummonPacifist.ts`) is unique-file tests only — WX wiring deferred. Fire sites: `clientTrustedVictoryAchievementConditions` (`victoryAchievements.ts` 27) from `handleBattleEnd` (`WX` 12483–12497) **and** `handleBossRushRoomClear`.  
SYSTEMS_AFFECTED: `WX` `recordPlayerSpellType` / achievement fire; summon spawn/cast; auto-summon AI execute; Bite/Mark/Slow execute; Boss Rush room-clear  
RECOMMENDED_ACTION: Fail the feat unless every resolved player spell is heal, buff, Timestep, or (optionally) Mirror. Flip when the player casts a summon spell **or** when a player-side summon deals damage / applies an offensive kit spell **or** when auto-summon AI resolves an offensive kit/melee. Vampire Bite must fail it even while heal metadata is still wrong, and still fail it after `#644`. Treat `"attract_multi"` (or any attract*) as offensive. **Do not** call `applyHealBuffSideEffect` from `getSpellRangeTiles`. Do not change the Doka amount. Keep Boss Rush on the same predicate as overworld victory. Treat `#714` as the control-mode kit vehicle and `#749` as the AI vehicle — do not land a second copy of either; still ship Bite/Mark/Slow-1/`attract_multi`/summon-spell.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None. Complements `013` (Bite metadata) and `004` (0-damage floor) but must not wait on them. Do not treat `#644`, `#714`, or `#749` as the whole ID.  
REGRESSION_RISK: LOW — feat is once-per-account. Preview tests in `targeting.test.ts` must stay green.  
VALIDATION_REQUIRED: Tests: Shield-only win still unlocks; Wolf kill does not; Bite kill does not (before and after `#644`); Slow poke does not; selecting Strike for range preview still does not fail; Boss Rush room-clear uses the same flag; `#714` kit Poison still fails; `#749` auto-summon Poison/Inferno/melee still fails once wired. Import gate.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-29-004  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Apply player `debuffStat`, skip 1-floor on 0-damage debuffs, and cap stacked AP/MP denial  
CATEGORY: ap-mp-denial  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `resolvePlayerCast` damage loop (`spellEngine.ts` 876–1028) never calls `applyEffect` for `debuffStat`. Slow, Frost Bolt, Weaken, Expose, Shadow Veil, Drain Courage, Cursed Wound, Life Drain, Frost Nova therefore deal (or skip) damage and drop the advertised half. `calcScaledDamage` / `calcScaledDamageInline` (`combatMath.ts` 130–136; `spellEngine.ts` 1038–1044) floors 0 to 1, so Slow/Weaken poke 1 and stay Pacifist-legal. `resolveSpellCast` 529–548 **does** apply the same fields — a player-controlled Archer Slow is live on the effect list (walk pool is 019). Enemy / boss casts apply them on the inline path. `getStatModifier` (`statusEffects.ts` 45–63) **adds** every `ap`/`mp` modifier from different `effectName`s. Wiring the player path without a cap, then later fixing `buildEnemyKit` zone (`009`) and duration-1 live-pool (`018`), would let Frost + Slow + Drain Courage approach 0 AP/MP. Same-name still replaces (`applyOrRefreshNonDotEffect` 71–84). Queued `#528` / `#555` restore the wire on branches that are not `main`. Expose / Shadow Veil also need 021 or the write is a no-op.  
SYSTEMS_AFFECTED: `spellEngine.ts` `resolvePlayerCast`; `combatMath.ts` `calcScaledDamage` (only the 0-damage debuff path); `statusEffects.ts` `getStatModifier`; enemy debuff path  
RECOMMENDED_ACTION: After a successful player hit (or on a pure-debuff spell), apply `debuffStat` the same way `resolveSpellCast` does. Do not apply the `max(1, …)` floor when listed `damage` is 0 on a debuff/DoT-only spell. Cap combined AP/MP additives per target (e.g. cannot reduce the victim below 1 AP and 1 MP from debuffs). Do not change Slow/−2 or Frost/−1 numbers. Do not strip Archer kit Slow. If `#528` or `#555` merges, treat that PR as the wire and still land the stack cap — do not land a second copy of the apply. Pair Expose / Shadow Veil with 021. This is a restore plus a safety rail, not a nerf of an existing player-bar combo.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: `009` makes the enemy-side cap load-bearing. `018` makes duration-1 Frost/Drain Courage load-bearing. `021` makes `res_sp` writes load-bearing. Ship the cap in the same change as the player wire, or immediately after. Complements `003` (Slow-1 Pacifist).  
REGRESSION_RISK: MEDIUM — Haste is `buffStat: "mp"` modifier `+2` (additive). The floor must not clamp buffs. Strike 10 must still floor upgrades at 1.  
VALIDATION_REQUIRED: Tests: player Slow writes `stat: "mp"` on the target and deals 0 (not 1); two different MP debuffs cannot sum past the floor; Haste +2 still applies; controlled Archer Slow still applies. Import gate.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-29-006  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Write `dotDamagePerTurn` (and Slow stat) on summon-AI applyEffect  
CATEGORY: summon-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Live AI summon path is `decideSummonAction` + `executeSummonAction`. `applyCast` (`summonExecutor.ts` 191–203) applies DoTs without `dotDamagePerTurn` and debuffs without `stat`/`modifier`. `tickDotStacks` (`dotStacks.ts` 105–108) ignores those rows. Player-controlled summons use `resolveSpellCast` (`WX` `castControlledSummonSpell`) and **do** tick / apply Slow. AI Archer Poison and AI Bomber Inferno are cosmetic. Bomber kamikaze also only runs on the `damage > 0` branch; Inferno `damage` is 0, so AI Bombers neither tick nor explode. Queued `#700` (`kitCastStatusEffect`) copies those fields on the auto-summon executor.  
SYSTEMS_AFFECTED: `engine/summonExecutor.ts`; DoT tick; bomber lifespan  
RECOMMENDED_ACTION: Copy `dotDamagePerTurn` from the kit spell onto the effect. Copy `debuffStat` / `debuffModifier` for Slow. Restore bomber detonation on Inferno cast even when upfront damage is 0. **Do not ship DoT ticks before 001** — AI + player-controlled stacks would double the unbounded integral, and enemy Archers would append onto the player. Slow-stat restore may ship with 004. Treat `#700` as this vehicle; do not land a second copy. Hold `#700` merge until 001 exists, **or** strip the DoT `ppt` copy from that PR until 001 lands.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: EBMA-2026-09-29-001 for DoT ticks  
REGRESSION_RISK: HIGH if 001 is missing. MEDIUM after 001 (extra ticks on enemy-facing AI summons too).  
VALIDATION_REQUIRED: Tests: AI Poison effect has `dotDamagePerTurn === 4` and `sumDotTicks` > 0; bomber Inferno sets hp 0; AI Slow writes `stat: "mp"`. Import gate.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-29-007  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Keep catalog ≠ ownership; do not treat backend seed as discovery  
CATEGORY: discovery-progression  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–719) returns true whenever `usableByPlayer !== false`. `ownedSpells` (`WX` 2412–2440) unions starters with that filter (minus `OLD_SPELL_NAMES_SET`). `defaultSpells()` (`admin.mo` 168–191) therefore grants Shadow Strike / Thunder Clap / Void Collapse / inert Soul Rend / Bite / Reflect to every seeded account. Achievements and challenges still grant Doka only. No `ownedSpellIds` / `observedSpellIds`. Sibling design already owns the pipeline: `SDA-2026-08-31-002` … `004`, `SDE-2026-08-31-001` … `003`. GameKey shop does not grant spells.  
SYSTEMS_AFFECTED: `WX` `ownedSpells`; `adminSafety.ts`; `admin.mo` `defaultSpells`; future grant writers  
RECOMMENDED_ACTION: Do **not** implement observe-to-unlock from this automation. When SDA-002 lands, migrate existing characters from starters + `spellLevelKeys` ∪ `spellBarOrder`, not from the full catalog. Leave Shadow Strike numbers alone — it is STRONG_BUT_HEALTHY, not a dump-to-nerf.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-08-31-002 / 003 / 004  
REGRESSION_RISK: HIGH if migrate under-seeds the bar.  
VALIDATION_REQUIRED: Owned by the SDA tickets. This ID is a meta constraint, not a second implementation.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-29-008  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Monitor Titan’s Vigor × Glass Realm × Sacrifice; do not nerf yet  
CATEGORY: map-modifier-lottery  
PRIORITY: P2  
CONFIDENCE: MEDIUM  
EVIDENCE: `applyDamageDealt` is called from `enemyTakesDamage` (`WX` 3499). The main player damage loop uses `calculatePlayerDamage` / `applyDamageToEnemy` and skips the hook. Sacrifice (`spellEngine.ts` 749–763) uses `dealDamage` → `enemyTakesDamage`, so it **does** get Titan 1–5× (`mapModifiers.ts` 311–314) and Glass ×2 (345–346). Sacrifice HP cost reads `characterStats.hp` (750). `applyBattleStart` Titan +1000 mutates `combatantsRef` (`WX` 12075–12078), which does not include the player, so Sacrifice is unlikely to read the +1000. Mark and crit do not apply. Vampiric Ground is on the same hook and also misses the main bar.  
SYSTEMS_AFFECTED: `mapModifiers.ts`; `WX` `enemyTakesDamage`; Sacrifice  
RECOMMENDED_ACTION: No number change. If play data shows Glass+Titan maps are Sacrifice-or-skip, then either route all player damage through one modifier hook **or** exclude Sacrifice from `onDamageDealt`. Do not flatten Titan’s identity. Occupant-required Sacrifice (`#607`) is CRP, not this ID.  
AUTONOMY: MONITOR  
DEPENDENCIES: None  
REGRESSION_RISK: N/A until a number change is chosen.  
VALIDATION_REQUIRED: If a later ID changes the hook, add a test that Strike does or does not take Titan/Glass consistently with Sacrifice.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-29-009  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Pass a numeric zone into `buildEnemyKit`  
CATEGORY: relative-progression  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Call site `WX` 11920: `buildEnemyKit(enemy.pieceType, currentMap.levelZone)`. `levelZone` is `{ name, minLevel, maxLevel }` (`WX` 4683–4687). `buildEnemyKit` (`enemyAI.ts` 194–199) does `Math.floor(levelZone)` → `NaN`; `z >= 1` is false. Every piece stays on the zone-0 kit (pawn Strike only, bishop Frost only, no queen Inferno/heal). Intended mid/late kits never appear, so player DoT/summon packages face a weaker field than the data file describes. `longHorizonSim.ts` 50–53 still documents the `NaN`.  
SYSTEMS_AFFECTED: `WX` battle-start kit assign; `enemyAI.ts` `buildEnemyKit`; enemy threat  
RECOMMENDED_ACTION: Pass `playerTier`, `minLevel`, or `floor((minLevel-1)/tierSize)` — a number. Do not change kit contents in the same PR. After this ships, re-evaluate enemy Frost+Slow stacking (`004` cap) and duration-1 Frost vs the live MP pool (`018`). This restores counterplay; it is not a player nerf.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None. Makes `004`’s enemy-side cap relevant.  
REGRESSION_RISK: MEDIUM — zone 1+ bishops/queens gain Poison/Inferno/heal. Encounter length will change.  
VALIDATION_REQUIRED: Unit test: `buildEnemyKit("bishop", 0)` vs `buildEnemyKit("bishop", 1)`. Integration: `assignEnemySpells` with a real `LevelZone` object must not pass the object through. Import gate.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-29-010  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Honor kit-spell cooldowns on controlled and AI summons  
CATEGORY: cooldown-circumvention  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Player Inferno CD is enforced on the bar (`executeCastAttempt` `WX` 17200–17203; Attack Nearest still gates CD). `planSummonControlCast` (`summonControlCast.ts` 221–258) gates AP, range, and live geometry — not cooldown. Bomber `summonKit` is `["spell-inferno"]` with `ap: 1` (`spellData.ts` 646–654). Day-1 Bomber cannot pay Inferno 5. `getSummonBaseStats` (`progression.ts` 229–232) is `1 + floor(spellLevel / SUMMON_AP_PER_LEVELS)` with `SUMMON_AP_PER_LEVELS = 3` (`gameConstants.ts` 100). At **spell level 12** Bomber AP is 5 and Inferno becomes a live every-turn launder without 014. Canister cost to 12 is `10 * (2^12 - 1) = 40_950` Doka. After 014 raises Bomber AP, the same launder is Day-1.  
SYSTEMS_AFFECTED: `summonControlCast.ts`; `WX` `castControlledSummonSpell`; `executeSummonAction`; player `spellCooldownsRef`  
RECOMMENDED_ACTION: Per-summon cooldown map keyed by kit spell id. If the kit spell declares `cooldown`, start it on that unit after a successful kit cast. Do not share the player Inferno lock with the Bomber (a spawned Bomber may still cast once) — just stop every-turn recast. Do not ship Bomber 5 AP (014) without this lock. Do not wait for 014 — slvl 12 already opens it.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: Works alone. Load-bearing after `014` and at Bomber slvl ≥ 12. Stronger if `002` also CDs the summon **spell**.  
REGRESSION_RISK: LOW — Wolf Strike / Archer Poison have no CD and stay spam-limited by summon AP (2).  
VALIDATION_REQUIRED: Tests: Bomber Inferno twice in two turns is `on_cooldown` after the first (once AP can pay, including slvl 12). Archer Poison still recasts if AP remains. Import gate.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-29-011  
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

ACTION_ID: EBMA-2026-09-29-012  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Apply Blood Mend / Rally CHC buffs to the crit roll  
CATEGORY: underpowered-restore  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Both spells set `buffStat: "chc"`, `buffModifier: 0.15` (`spellData.ts` 96–98, 428–430). The heal branch (`resolvePlayerCast` 654–673) heals and returns without writing the buff. Crit uses `ctx.chc` from raw `characterStats.chc` (`WX` playerSpellContext; `spellEngine.ts` 891). `getStatModifier` never sees `chc` on that path. If someone later multiplies `chc` by 0.15, that would **cut** crit chance — the literal is a +15 percentage-point intent, not a 0.15× multiplier.  
SYSTEMS_AFFECTED: `WX` `playerSpellContext`; heal/buff apply in `resolvePlayerCast`; `getStatModifier`  
RECOMMENDED_ACTION: After the heal, write an additive CHC effect (+15 points for 2 turns). Feed crit chance through effects as **additive percentage points**, not a 0.15 multiplier. Do not change heal amounts. This is a restore.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None  
REGRESSION_RISK: LOW — slightly more crits when the buff is up.  
VALIDATION_REQUIRED: Test: after Blood Mend, `chc` used by `resolvePlayerCast` is base+15. Import gate.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-29-013  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Restore Vampire Bite / Soul Rend / Reflect Barrier metadata so catalog seeds fire  
CATEGORY: underpowered-restore  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `defaultSpells()` (`admin.mo` 168–191) dumps three ids that `resolvePlayerCast` cannot execute as advertised. Vampire Bite: player `isDrainSpell` is `effectType === "drain"` (`spellEngine.ts` 633); Bite is `effectType = "heal"` + `spellType = "drain"` → 20 damage, no heal, Pacifist-legal (`003`). Queued `#644` treats `spellType: "drain"` as lifesteal. Soul Rend: `effectType = "dot"` without `dotDamagePerTurn` → DoT branch, 0 tick, 25 upfront lost. Queued `#647` lands the 25. Reflect Barrier: `effectType = "buff"` without `buffStat` / `isMirror` / self target → no-op (player Mirror uses `isMirror` + `activatePlayerMirror`). Shadow Strike / Thunder Clap / Void Collapse on the same seed **do** fire.  
SYSTEMS_AFFECTED: `admin.mo` `defaultSpells`; optional frontend mapping of backend configs; Pacifist (`003`)  
RECOMMENDED_ACTION: Bite → `effectType: "drain"` (keep healAmount 20) **or** accept `#644` as the player-path vehicle and still fix the Motoko seed so `effectType` matches. Soul Rend → set `dotDamagePerTurn` (and keep or split the 25 upfront via `damage` on a non-dot `effectType`); `#647` is the upfront vehicle, not the tick. Reflect Barrier → `isMirror: true` and `targetType: "self"`, or retire it as duplicate of starter Mirror. Do **not** change Shadow Strike 35/3. Ship Pacifist `003` even if Bite stays mis-typed. **Do not land a second Bite/Soul Rend copy** if `#644`/`#647` merge.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: `003` must not wait on this. If Bite becomes `drain`, Pacifist flips via `offCats` even without a broader 003 — still ship 003 for summons/Mark. Drain Bite will also fail no-heal (`recordChallengeHealFromHpRestore`) — that is the advertised spell.  
REGRESSION_RISK: MEDIUM — live characters already “own” these ids.  
VALIDATION_REQUIRED: Tests: Bite heals the caster and is treated as drain; Soul Rend ticks (or at least deals 25); Reflect Barrier activates the same mirror consume as starter Mirror. Import gate. Motoko/bindgen if the seed rows change.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-29-014  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Align summon kit AP with advertised kit spells  
CATEGORY: underpowered-restore  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `getSummonBaseStats` (`progression.ts` 229–232) uses `unitDef.ap ?? SUMMON_AP[ai]`. Day-1 budgets: Bomber 1 vs Inferno 5; Wisp 2 vs Blood Mend 3 / Rally 4; Wolf 2 vs Venom 3; Sentinel 2 vs Iron Skin 3 (`spellData.ts` 547–690; `SUMMON_AP_PER_LEVELS = 3` in `gameConstants.ts` 100). `planSummonControlCast` returns `no_ap` (`summonControlCast.ts` 244–246). Archer Poison 2 vs 2 **does** fire and is the live DoT amplifier in 001. AP +1 every 3 spell levels reaches Inferno 5 at spell level 12 (010).  
SYSTEMS_AFFECTED: `summonSpawn.ts` / `progression.ts` `getSummonBaseStats`; summon `unitDef.ap`; kit rows  
RECOMMENDED_ACTION: Set each kit’s spawn AP to at least the cheapest advertised kit spell (Wisp ≥ 3, Wolf ≥ 3, Sentinel ≥ 3, Bomber ≥ 5 **only with 010**). Keep Strike/Shield/Poison payable on turn 1. Do not raise player summon **placement** AP. Pair Wisp with 015 — AP without a legal player/ally target still leaves Blood Mend a no-op on the player. Pair Sentinel with 020 — AP without ally targeting still leaves Shield on the caster. Combat-rule-parity `#762` (kit decide vs execute AP+range) is **not** this ID — do not duplicate it.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: `010` before or with Bomber 5 AP. `015` with Wisp AP. `020` with Sentinel AP. `001` before AI Inferno ticks (`006`).  
REGRESSION_RISK: MEDIUM — more kit casts per summon turn. Bomber without 010 re-opens the Inferno launder on Day-1.  
VALIDATION_REQUIRED: Tests: slvl-0 Wisp AP ≥ Blood Mend cost; slvl-0 Bomber cannot recast Inferno without cooldown once AP pays. Existing summon spawn budget contract. Import gate.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-29-015  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Let Wisp heal the player / allied summons and record the actual HP delta for no-heal  
CATEGORY: underpowered-restore  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Control-cast always passes `targetEnemy` (`WX` 9849–9869). `resolveSpellCast` takes `buffStat` (507–527) and **returns before** `healAmount` (551–558), so Blood Mend / Rally never heal on the kit path. `ctx.heal` only mutates character HP for player ids. Player is not in `combatantsRef`, so the player tile is never a control-cast target. Recorded no-heal delta is `characterStatsRef.hp - previousHp` immediately after `setCharacterStats` — the ref write lives inside the updater, so the recorded amount is 0 even on a true player heal. Drain no-heal (`005`) stays closed via `onPlayerHealed`. Queued `#550` restores HP after the kit buff branch on a branch that is not `main`.  
SYSTEMS_AFFECTED: `WX` `castControlledSummonSpell`; `resolveSpellCast` heal/buff order; summon heal targeting; `recordChallengeHealFromHpRestore` amount  
RECOMMENDED_ACTION: Allow Wisp kit heals to target the player and allied summons (ally/self targeting, not enemy-only). Apply heal as well as (or before) the CHC buff. Commit HP synchronously on the ref (or pass the intended `amount`) before recording no-heal so `restoredHp > 0` is true. Do not re-open drain. Keep overworld Doka-to-HP from flipping the next fight. Pair with 014 so Blood Mend is payable. If `#550` merges, treat that PR as the buff-before-heal half and still ship targeting + amount. Advertised Pacifist is heal/buff, so a Wisp heal should **remain legal** for Pacifist and **fail** no-heal.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: Works alone as a targeting restore. Stronger with 014.  
REGRESSION_RISK: MEDIUM — a working Wisp makes no-heal honest only if the amount is recorded.  
VALIDATION_REQUIRED: Tests: Wisp Blood Mend on player increases HP and sets `healUsed`; Wisp heal on an allied Wolf does not need to fail no-heal (player HP unchanged); overworld Doka heal does not stick. Import gate.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-29-016  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Relativize `hard_3` AP cap to the live battle bar  
CATEGORY: challenge-economy  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `hard_3` completes when `maxApUsedInTurn <= 8` (`challengeCompletion.ts` 80–86, 126–127) for 150 Doka + 450 XP. Battle AP is `max(8, 8 + floor(level / apMpGrowthEveryNLevels))` with default every-25 (`progression.ts` 59–72; `PLAYER_BASE_AP = 8` in `gameConstants.ts` 131). Levels 1–24 therefore have a pool of 8; `recordChallengeApSpend` cannot record a peak above 8. Challenges are a 1/9 random offer that must be accepted. XP curve is `100 * 2^(N-1)`; 450 XP at level 1 is two level-ups plus leftover. Combined with 001, a full Poison dump is both the DoT integral **and** a free challenge clear. Timestep cannot currently inflate the peak (017).  
SYSTEMS_AFFECTED: `challengeCompletion.ts` `isChallengeCompleted` / `under_8_ap_per_turn`; challenge copy; `WX` challenge progress that already tracks peak spend  
RECOMMENDED_ACTION: Compare peak spend to the **live** battle AP bar, not a literal 8. Preserve the “play cheap” identity: e.g. never spend more than `max(1, currentMaxAp - 1)` or 75% of the bar (rounded down). Keep 150 Doka / 450 XP. Update the challenge description to match. Do not change Poison AP (001 owns the integral). Do not fail the challenge for spending leftover AP if that spend is still under the relative cap. Pass `currentMaxAp` into `isChallengeCompleted` (or store it on `ChallengePanelProgress`) so tests do not hard-code 8 forever.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None. Complements 001 but must not wait on a DoT cap. Do not leave Timestep dead as a fake `hard_3` brake.  
REGRESSION_RISK: LOW — early-game `hard_3` becomes a real constraint (must leave 1 AP, or similar). Late-game (AP 9+) already had a real check against 8.  
VALIDATION_REQUIRED: Tests: at maxAp 8, spending 8 fails (or matches the chosen relative rule); spending 7 passes; at maxAp 9, spending 8 passes if the rule is maxAp-1. Existing `recordChallengeApSpend` peak tests stay green. Import gate.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-29-017  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Resolve Timestep and Mirror on the highlighted self tile  
CATEGORY: underpowered-restore  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Timestep is `targetType: "self"` + `effectType: "buff"` (`spellData.ts` 215–231) with no `buffStat`. `isShieldSpell` (`spellEngine.ts` 634–636) is therefore true. On a legal self tile the shield branch (`680–718`) logs nothing (no `buffStat`) and `return "cast"` **before** `isTimestep` (`721–733`). `restoreApMp` / `consumeTimestep` never run. Mirror is `isMirror` + `targetType: "self"` (`spellData.ts` 198–213); `activateMirror` sits inside `if (targetEnemy || spell.hitsMultiple)` (`917–926`), so a self tile spends 4 AP, records `"defense"`, and never calls `activatePlayerMirror` (`WX` 9574–9578). 09-02 classified both STRONG_BUT_HEALTHY from metadata. Queued PR `#496` already implements the restore on a branch that is not `main`. `playerSpecialCast.ts` does not exist on this HEAD.  
SYSTEMS_AFFECTED: `spellEngine.ts` `resolvePlayerCast` shield / Timestep / Mirror ordering; optional `playerSpecialCast.ts`; `WX` execute on self tile  
RECOMMENDED_ACTION: Restore, do not nerf. Skip Timestep and any `self`+`buff` without `buffStat` in the shield predicate. Hoist Mirror onto the caster tile before the damage loop. Keep Shield / Iron Skin / Haste / Enrage ally targeting (`676–718`). **Do not land a second copy** if `#496` merges — treat that PR as this ID. After restore, `applyApCost` min-1 (`mapModifiers.ts` 216, 324) would charge the 0-AP spell 1 AP on Surge/Overflow maps — `#581` owns that follow-on; do not duplicate. Do not nerf Timestep after restore because it amplifies one Poison dump (001 owns the integral). Do not leave Timestep dead as a `hard_3` brake (016). If `#496` merged, close this ID as implemented and re-classify Timestep/Mirror STRONG_BUT_HEALTHY.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None. Complements 001 (do not nerf Timestep) and 016 (do not use inert Timestep as challenge design).  
REGRESSION_RISK: MEDIUM — a working Timestep is one extra full bar per fight (intended). Shield-without-stat must not start restoring AP. Spent Timestep must still abort.  
VALIDATION_REQUIRED: Tests: highlighted self tile executes Timestep (`restoreApMp` once; second cast aborts); Mirror on self calls `activateMirror`; Shield with `buffStat` still buffs; off-self Timestep/Mirror still reject. Import gate. If `#496` is the vehicle, its parity tests are sufficient.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-29-018  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Duration-1 AP/MP effects must change the live resource pool  
CATEGORY: underpowered-restore  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Haste is `buffStat: "mp"`, `buffModifier: 2`, `buffDuration: 1` (`spellData.ts` 314–331). The shield/ally branch writes an `ActiveEffect` (`spellEngine.ts` 697–710) and returns `"cast"`. Walk/cast spend `currentBattleMp`, which `applyActiveEffect` (`WX` 1871–1922) never bumps. Swift Boots **does** bump the live pool (`WX` 3579–3581). Next player turn runs `processActiveEffects` (`WX` 14275) which ticks non-DoT duration (`1997–2017`) **before** restore (`14350–14365`), so a duration-1 row is gone when `getStatModifier("player", "mp")` is read. Enemy Drain Courage is AP −1 duration 1 (`spellData.ts` 449–452) — same tick-before-restore class if the effect is written. Enrage (dmg, duration 2) is fine because damage reads `getStatModifier` immediately. Queued `#596` restores player Haste this-turn on a branch that is not `main`.  
SYSTEMS_AFFECTED: `WX` `applyActiveEffect` / `currentBattleAp` / `currentBattleMp`; player turn-start restore vs `tickNonDotEffects`; Haste; duration-1 AP debuffs  
RECOMMENDED_ACTION: Restore, do not nerf. When an additive AP/MP effect is applied to the player, bump the live pool this turn (Haste +2 MP), matching Swift Boots. Keep duration-2 Slow working via restore after the tick. If tick order stays “tick then restore,” duration-1 AP debuffs applied on the enemy turn must still reduce the **next** player AP pool (carry leftover, or tick after restore). Do not change Haste +2 or Drain Courage −1 numbers. **Do not land a second copy** if `#596` merges — treat that PR as the player-Haste vehicle, then confirm duration-1 **AP debuffs** still reduce next-turn AP. Do not mint MP from Drain Courage leftover AP (`#596` already excludes that). After restore, re-classify Haste STRONG_BUT_HEALTHY.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None. Complements 004 (player-bar Drain Courage still does not write `debuffStat`) and 019 (summon pool is a separate budget).  
REGRESSION_RISK: MEDIUM — a working Haste is +2 walk this turn (intended). Must not double-apply on the following restore. Must not let stacked duration-1 Haste + Slow violate the 004 floor once 004 lands.  
VALIDATION_REQUIRED: Tests: Haste this turn increases `currentBattleMp` by 2; next turn restore is not +4; Swift Boots still +2; Shield RES does not mint MP. After `#596`, add or keep a Drain Courage leftover-AP case if that PR scoped it out. Import gate.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-29-019  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Apply Slow and Haste to the control-mode summon walk/cast pool  
CATEGORY: underpowered-restore  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `summonTurnBudget` (`summonControlCast.ts` 356–363) returns `currentAp/currentMp` from `maxAp`/`maxMp` only. Control-mode start writes that budget (`WX` 14520–14529) after `processActiveEffects`. Player restore **does** add `getStatModifier` after the tick (`WX` 14350–14365). Controlled Archer Slow writes `stat: "mp"` via `resolveSpellCast` 529–548, so the badge is live and the walk is not. Ally Haste duration 1 on a Wolf expires in the same tick, so +2 MP never arrives. `#596` only bumps the **player** pool. Queued `#598` is the summon-side restore on a branch that is not `main`.  
SYSTEMS_AFFECTED: `summonControlCast.ts` `summonTurnBudget`; `WX` control-mode turn start; Slow; ally Haste on player-side summons  
RECOMMENDED_ACTION: Restore, do not nerf. Next summon budget = max + remaining AP/MP modifiers (same semantics as player restore). Duration-1 AP/MP on a **player-side summon** must grant one budget (record at apply, consume once). Do not change Slow −2 / Haste +2. Do not change spawn AP (014). **Do not land a second copy** if `#598` merges. Do not treat this as a flood nerf (002).  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: Works alone for effect-list Slow/Haste. Player-bar Slow still needs 004 to write the effect. Player Haste this-turn is 018.  
REGRESSION_RISK: MEDIUM — Slowed Wolves walk shorter (intended). Duration-1 ally Haste must not be lost to tick order. Enemy-side AI summons use a different budget path — do not silently skip them if they share `currentMp`.  
VALIDATION_REQUIRED: Tests: Slow −2 on a 3-MP Wolf → walk pool 1; duration-1 ally Haste on a Wolf → +2 for one control turn; Archer Poison AP spend unchanged. Import gate. If `#598` is the vehicle, its `summonBattleResource` tests are sufficient.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-29-020  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Stamp Sentinel kit Shield / Iron Skin on the clicked ally  
CATEGORY: underpowered-restore  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Sentinel `summonKit` is `["starter-shield", "spell-iron-skin"]` (`spellData.ts` 593). Control-cast always passes `targetEnemy` (`WX` 9849–9869). `resolveSpellCast` buff branch writes `targetId: caster.id` (`spellEngine.ts` 511–514) and returns. Clicking an allied Wolf therefore puts 1.3× RES on the Sentinel. Player-bar Shield on the same Wolf **does** land (`resolvePlayerCast` 676–718). Self-click and Blood Mend should stay on the caster. Queued `#597` and `#709` (`kitBuffTarget.ts`) both restore kit ally targeting on branches that are not `main`. Not `#550` (heal-after-buff on `targetType: "self"`).  
SYSTEMS_AFFECTED: `spellEngine.ts` `resolveSpellCast` buff `targetId`; `WX` `castControlledSummonSpell` click target; Sentinel kit  
RECOMMENDED_ACTION: Restore, do not nerf. When the kit spell’s `targetType` is `"ally"`, stamp `targetId` from the clicked allied summon (live gate already picks that tile). Keep self-click and heal-on-caster. Do not close player-bar ally targeting. Do not raise Sentinel AP here (014). **Pick `#597` or `#709` — do not land both copies.**  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: Works alone. Stronger with 014 if Iron Skin 3 AP should be payable.  
REGRESSION_RISK: LOW — guardian identity starts working. Must not buff hostiles. Must not move Blood Mend off the caster.  
VALIDATION_REQUIRED: Tests: Sentinel Shield on a clicked Wolf writes `targetId` of the Wolf; `getStatModifier(wolfId, "res")` is 1.3; self-click stays on the Sentinel; Blood Mend still heals the caster after 015. Import gate. If `#597` or `#709` is the vehicle, its parity tests are sufficient.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-29-021  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Honor catalog `res_sp` shreds in `getStatModifier`  
CATEGORY: underpowered-restore  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Expose (`spellData.ts` 374–392) and Shadow Veil (481–499) set `debuffStat: "res_sp"` with modifiers 0.8 and 0.85. `getStatModifier` (`statusEffects.ts` 45–63) only matches `eff.stat !== stat` exactly. Player damage (`WX` 3347–3356, 16478–16490) and `enemyTakesDamage` (`WX` 3491) read `"res"` and `"sp"` / `"sr"`, never `"res_sp"`. Controlled-summon / enemy `resolveSpellCast` 529–548 **does** write `stat: "res_sp"` if those ids are on a kit — the badge can appear and still do nothing. Player-bar 004 would write the same dead key. Admin dashboard already lists `res_sp` as a debuff stat (`AdminDashboard.tsx` 3280). Queued `#658` restores the alias on a branch that is not `main`.  
SYSTEMS_AFFECTED: `engine/statusEffects.ts` `getStatModifier`; Expose / Shadow Veil apply; player and enemy RES/SP reads  
RECOMMENDED_ACTION: Restore, do not nerf. Either treat `res_sp` as applying to both `"res"` and `"sp"` inside `getStatModifier`, or split into two effects at apply time. Do not change 0.8 / 0.85. Do not invent a third Resist stat. **Do not land a second copy** if `#658` merges. Complements 004 but must not wait on it — enemy-applied shreds are already written and ignored. After restore, Expose + Mark + Shadow Strike is STRONG_BUT_HEALTHY burst; do not nerf Expose numbers because the product becomes real.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None. Makes 004’s Expose/Shadow Veil writes load-bearing.  
REGRESSION_RISK: LOW — advertised shred starts working. Must not also multiply `"res_sp"` as a third channel (double-dip). Must not treat `"res_sp"` as additive AP/MP.  
VALIDATION_REQUIRED: Tests: an effect `{ stat: "res_sp", modifier: 0.8 }` makes `getStatModifier(id, "res")` and `getStatModifier(id, "sp")` both 0.8; `"res"`-only Shield is unchanged; `"sp"`-only Life Drain shred still works if 004 writes it. Import gate. If `#658` is the vehicle, its tests are sufficient.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-29-022  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Apply Shield / Iron Skin RES to enemy fallback melee  
CATEGORY: underpowered-restore  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Enemy **spell** hits multiply player RES by `getStatModifier("player", "res")` (`WX` 16486–16490). Fallback melee (`action.kind === "melee" || !didAct`, `WX` 16703–16728) uses raw `characterStats.res` for `meleeRes`. Crush / Fire Bolt therefore ignore Shield and Iron Skin (1.3× and 1.69× stacked). Shield Charm HP absorb still runs (16751). Player `playerTakesDamage` (3429–3431) **does** use `getStatModifier`, but fallback melee writes HP via `setCharacterStats` directly (16765) and never calls it. Queued `#659` restores the modifier on a branch that is not `main`. This is a restore of advertised defense, not a nerf of melee.  
SYSTEMS_AFFECTED: `WX` enemy fallback melee; Shield / Iron Skin; optional shared incoming-damage helper  
RECOMMENDED_ACTION: Restore, do not nerf. Use the same `getStatModifier("player", "res")` product on fallback melee as the spell path (or route through `playerTakesDamage`). Keep Shield Charm absorb. Do not flatten Shield+Iron Skin 1.69× because melee starts respecting it. **Do not land a second copy** if `#659` merges. Do not treat this as a flood nerf or a DoT-cap substitute.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None. Combat-rule-parity `#659` is the preferred vehicle.  
REGRESSION_RISK: LOW — advertised RES starts applying to Crush/Fire Bolt. Must not double-apply RES if the path is later routed through `playerTakesDamage`. Summon-target melee already uses `resolvedTarget.res` (16722–16724) and should gain the summon’s Shield after 020.  
VALIDATION_REQUIRED: Tests: player Shield 1.3× reduces Crush fallback damage; unbuffed melee matches current math; spell-path RES unchanged. Import gate. If `#659` is the vehicle, its parity tests are sufficient.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-29-023  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Apply ally Enrage to player-side summon outgoing damage  
CATEGORY: underpowered-restore  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Starter Enrage (`spell-enrage`, `targetType: "ally"`, `buffStat: "dmg"`, `buffModifier: 1.4`) already writes on a clicked Wolf via `resolvePlayerCast` 676–718. `enemyTakesDamage` multiplies by `getStatModifier(casterId, "dmg")` (`WX` 3492–3494). Control-mode kit casts reuse `playerSpellContext.dealDamage` which hardcodes `"player"` (`WX` 9171–9183). Player-side summon-AI ctx does the same (`WX` 14997–15004). The wolf’s Strike / kit hit therefore ignores the 1.4× while the badge is live. Self-cast Enrage still uses the player path and is healthy. 09-27 classified this package STRONG_BUT_HEALTHY from targeting honesty alone. Queued `#699` (`summonOutgoingCasterId`) restores the summon id on kit + auto-summon melee.  
SYSTEMS_AFFECTED: `WX` `playerSpellContext.dealDamage`; player-side summon-AI `dealDamage`; `enemyTakesDamage` casterId; Enrage on allied summons  
RECOMMENDED_ACTION: Restore, do not nerf. Pass the summon’s combatant id as `casterId` when a player-side summon deals damage. Keep self-cast Enrage on `"player"`. Do not change 1.4 / duration 2. Do not close ally targeting to “fix” the flood (002). After restore, 1.4× Wolf is STRONG_BUT_HEALTHY burst on a second turn — do not flatten Enrage because the product becomes real. **Do not land a second copy** if `#699` merges.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None. Complements 002 (cap the flood; do not nerf Enrage). Combat-rule-parity `#699` is the preferred vehicle.  
REGRESSION_RISK: LOW — advertised 1.4× starts applying to Wolf hits. Must not apply player Enrage twice (player casterId + summon casterId on the same packet). Titan/Glass `onDamageDealt` currently keys `casterId === "player"` (`WX` 3500) — summon hits should stay off that lottery unless a later ID deliberately unifies the hook (008).  
VALIDATION_REQUIRED: Tests: Enrage on a Wolf makes `scaleSummonOutgoingDamage` 1.4×; unbuffed Wolf matches current math; player self-Enrage Strike unchanged. Import gate. If `#699` is the vehicle, its tests are sufficient.  
STATUS: NEW  

---

ACTION_ID: EBMA-2026-09-29-024  
SOURCE_AUTOMATION: Emergent Build & Meta Analyzer  
TITLE: Gate Chain Lightning bounce to the clicked primary occupant  
CATEGORY: excessive-damage  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Starter-blast is `hitsMultiple: true` plus `bounces: 2` (`spellData.ts` 69–83). `getAoETargets` already expands full damage to every hostile in Chebyshev range from the click (`castHelpers.ts` 124–136). `resolvePlayerCast` then calls `applyDamageToEnemy` once per occupant (`spellEngine.ts` 1005–1015). That helper retriggers 50%/25% hops from **each** `hitTarget` (`castHelpers.ts` 430–461) with no clicked-primary gate. A 3-pack therefore takes three full hits **plus** three bounce chains. Bounce hops use `enemyTakesDamage` (`WX` 3476–3500), so Titan/Glass can lottery the extra hops while the primary write does not. Advertised identity is “primary then bounce to 2 nearest.” Queued `#766` (`shouldApplyChainBounceOnHit`) gates hops to the occupant of the clicked tile. `#441` already owns `pickChainBounceTargets` — do not create a third helper.  
SYSTEMS_AFFECTED: `engine/castHelpers.ts` `applyDamageToEnemy` bounce; `spellEngine.ts` hitsMultiple loop; Chain Lightning; optional Titan/Glass on bounce hops (008)  
RECOMMENDED_ACTION: Run the bounce chain once per cast, from the clicked primary only. Keep `bounces: 2` and `Math.floor(finalDmg * 0.5 ** (idx + 1))`. Do not nerf 20 damage / 4 AP. Do not remove `hitsMultiple`. Drain already heals once per cast (`targetsToHit[0]`) — leave that. **Do not land a second copy** if `#766` merges. After restore, re-classify Chain Lightning STRONG_BUT_HEALTHY. Do not flatten Thunder Clap because CL starts being honest.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None. Complements 008 (bounce hops share `onDamageDealt`; do not nerf Titan). Critical-defects `#766` is the preferred vehicle.  
REGRESSION_RISK: MEDIUM — packed-room CL damage drops to advertised (full AoE + one bounce chain). Single-target CL with two neighbors still bounces. Must not skip bounce when the click occupant is also first in the combatant array. Must not use loop `isFirstTarget` (`getAoETargets` order is the combatant array, not the click — `#766` already documents this).  
VALIDATION_REQUIRED: Tests: three occupants in range, bounce ids only from the clicked primary; hop formula unchanged; Thunder Clap (no `bounces`) unchanged. Import gate. If `#766` is the vehicle, its `shouldApplyChainBounceOnHit` tests are sufficient.  
STATUS: NEW  
