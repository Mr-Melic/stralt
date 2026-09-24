# Emergent Build & Meta Analysis — 2026-09-24

**Analyzer:** Emergent Build & Meta Analyzer  
**Automation:** `7b2f2b58-a49e-11f1-a7d1-d6b4613131ce` (cron `0 */72 * * *`)  
**HEAD:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Prior pass:** 2026-09-23 (`EMERGENT_META_2026-09-23.md` lives on draft PR #456; not on `main`). 2026-09-22 docs remain open PR #414; 2026-09-21 docs remain draft PR #365. Last merged pass on `main` is 2026-09-02 (`EMERGENT_META_2026-09-02.md`; ACTION_IDs `EBMA-2026-09-02-001` … `013`).  
**Gameplay code:** not modified. Balance was not changed.

This is a combination audit. Individual rows can look fair while two or three of them delete the rest of the kit.

Intervention is recommended only when a strategy:

- invalidates alternatives
- removes counterplay
- produces infinite / degenerate loops
- destroys progression or economy

Strong interesting synergy is left alone.

ACTION_IDs: [`ACTION_IDS_EBMA_2026-09-24.md`](./ACTION_IDS_EBMA_2026-09-24.md).

Prior IDs were **not implemented** except where a cited gate actually moved. Escalate only those. Do not re-open closed gates.

---

## 0. What changed since 2026-09-23 / 2026-09-02

`origin/main` is still `0f5363f`. No combat merge landed between the 2026-09-23 analyzer pass and this cron. Queued PRs opened later on 2026-09-23 (`#489` melee adjacency, `#496` Timestep/Mirror self-tile, and a stack of persist/map PRs) are **not live**. Do not treat them as the current meta.

This pass re-reads the same HEAD and adds one identity hole the 09-23 file mis-classified as healthy: **Timestep and Mirror do not resolve on the highlighted self tile.**

Combat-relevant merges on `58302bc` (09-02) → `0f5363f` that still define the live meta (spell mechanics #282, discovery design #300, combat parity #304/#314/#326, economy #315, critical defects #319, Boss Rush feats `451d2ed`, drain no-heal `9f36239`):

| Gate | 2026-09-02 | 2026-09-24 (same SHA as 09-22 / 09-23) | Meta effect |
| :--- | :--- | :--- | :--- |
| Drain × no-heal | `drainPercent` never touched `healUsed` | `recordChallengeHealFromHpRestore` (`challengeCompletion.ts` 250–259); `onPlayerHealed` (`WX` 9502–9507; `castHelpers.ts` 473–487) | **Closed.** Do not re-open. |
| Wisp / ctx.heal × no-heal | summon `heal` skipped the flag | Helper is **called** (`WX` 9185–9196, 15005–15016) but (1) player-controlled casts always pass `targetEnemy` (`WX` 9849–9869), (2) `ctx.heal` writes HP only for `"player"` / `"__player__"`, (3) the recorded delta is `characterStatsRef.hp` immediately after `setCharacterStats` so the delta is 0. Wisp cannot heal the player. Not a live no-heal farm. See 015. |
| BuffShop potions × no-heal | Closed | Still closed | Do not re-open. |
| Pacifist preview | Closed | Still closed (`targeting.ts` 83–85) | Do not re-open. |
| Pacifist execute | `recordPlayerSpellType` only | Unchanged (`WX` 17015–17033). Void Collapse records `"attract_multi"`; `offCats` lists `"attract"`. |
| Pacifist 0-damage debuffs | Not named in 09-02 | `calcScaledDamage` floors 0 to 1 (`combatMath.ts` 130–136). Slow / Weaken poke 1 without flipping the feat | Extra 003 evidence. |
| Sacrifice × Untouchable | Self-HP skipped `playerTakesDamage` | `recordChallengeSelfHpLoss` | Do not re-open. |
| Player summon AP | Charged | Still charged (`castResultSpendsAp` includes `"summon"`, `challengeCompletion.ts` 330–331) | Unchanged. |
| Attack Nearest Inferno CD | Closed on the player bar | Still closed | Unchanged. |
| Inferno via Bomber | Filed as DOMINANT CD launder | Bomber 1 AP vs Inferno 5. Live `no_ap`. **Mis-classified in 09-02.** |
| DoT append | no cap | unchanged (`appendDotStack` 31–37) | Still BROKEN. |
| Player `debuffStat` | damage loop never applied it | unchanged (`resolvePlayerCast` 876–1028) | Player-bar control kit still dead. Controlled Archer Slow still live (`resolveSpellCast` 529–548). |
| Catalog = ownership | `usableByPlayer !== false` dumps the library | unchanged (`adminSafety.ts` 712–719; `WX` 2412–2440) | Discovery still inert. #300 did not ship observe→unlock. |
| Enemy kit zone | object → NaN → zone 0 | unchanged (`WX` 11920 + `buildEnemyKit` 194–199) | Still latent. |
| `hard_3` vs live AP bar | Named only as “8-AP Poison dump is legal” | Battle AP is `8 + floor(level/25)` (`progression.ts` 59–72). Until level 25 the pool **is** 8, so `maxApUsedInTurn <= 8` cannot fail. **016.** |
| **Timestep / Mirror self-tile** | Classified STRONG_BUT_HEALTHY | `isShieldSpell` (`spellEngine.ts` 634–636, 680–718) returns `"cast"` for any `self`+`buff` before `isTimestep` (721–733). Mirror sits inside the enemy-target loop (917–926). Highlight already allows the caster tile (`targeting.ts` 503–508, 184–189). **New 017.** Queued PR #496 implements the restore; it is not on `main`. |
| Inf-HP summon catalog | Closed | Still closed | Do not re-open. |
| Void Rift × controlled summon | Tick commits | Still commits | Do not re-open. |

Closed (do not re-open):

- Pacifist failing on spell-range preview.
- BuffShop mid-fight potions paying no-heal.
- Life Drain / Lifesteal Nova / Drain Courage restoring HP without failing no-heal.
- Inf-HP summon catalog writes.
- Player-controlled summons ignoring Void Rift ticks.
- Free player summon placement (0 AP).
- Attack Nearest Inferno cooldown skip on the player bar.
- Sacrifice skipping Untouchable / under-damage counters.
- Bomber Inferno as a Day-1 cooldown launder (kit cannot pay 5 AP).

Still unimplemented from 2026-09-02 / 09-21 / 09-22 / 09-23: DoT cap, player summon cap/CD, pacifist advertised categories, player `debuffStat` wire, AI DoT `dotDamagePerTurn`, catalog≠ownership, Titan monitor, numeric zone, kit-spell CD (gated on AP alignment), summoner-chance retarget, CHC restore, Bite / Soul Rend / Reflect metadata, kit AP vs kit cost, Wisp heal targeting, relative `hard_3` cap. **New:** Timestep/Mirror self-tile restore (017). **Queued, not live:** #496 (`playerSpecialCast.ts`); MIMA player turn-start vitals helper (#443) is not wired in `WorldExploration`; do not treat Mending Mist as a live heal loop.

---

## 1. Access model (what a player can actually bring)

There is still no observe → win → unlock path. “Discovered enemy spells” and “achievement/challenge spells” remain design docs (`SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md`, `SPELL_ADMIN_DESIGN_2026-09-02.md`), not live systems. PR #300 merged design, not a persist `ownedSpellIds` map.

| Source | What enters the library | Spell grant? |
| :--- | :--- | :--- |
| `starterSpells` | All starter ids forced `isBaseSpell: true` (`WX` 2395–2408) | Always owned |
| `getSpellConfigs()` | Every `usableByPlayer !== false` id not in `OLD_SPELL_NAMES_SET` (`adminSafety.ts` 712–719; `WX` 2356–2440) | Catalog membership **is** ownership |
| Achievements | Doka only (`admin.mo` `defaultAchievements` 309–325) | No |
| Challenges | Doka / XP / badge (`challengeCompletion.ts` 44–108) | No |
| Recap / `applyRewards` | XP + Doka | No |
| `upgradeSpell` | Levels a known id; charges `10 * 2^level` | Must not grant |
| GameKey shop | Admin-approved keys | No spells |

Real loadout constraint: **8-slot bar**. The broken strategies below are 8-slot legal.

Starter library (32 ids in `spellData.ts`): Strike, Shield, Poison Arrow, Chain Lightning, Blood Mend, Life Drain, Frost Bolt, Swap, Mark, Barrier, Mirror, Timestep, Sacrifice, Lifesteal Nova, Enrage, Iron Skin, Haste, Weaken, Slow, Expose, Venom Strike, Rallying Cry, Drain Courage, Cursed Wound, Shadow Veil, Inferno, Frost Nova, Dire Wolf, Sentinel, Archer, Bomber, Wisp.

Backend seed (`admin.mo` `defaultSpells` 168–191) that actually fires on the player path:

| Id | On paper | Live `resolvePlayerCast` | Class |
| :--- | :--- | :--- | :--- |
| `shadow_strike` | 35 dmg / 3 AP / CD 2 / diagonal | Damage loop (`hitsMultiple` false, `damage` 35) | STRONG_BUT_HEALTHY |
| `thunder_clap` | 25 AoE / 4 AP / CD 3 | Damage loop via `multiTarget` → `hitsMultiple` | STRONG_BUT_HEALTHY |
| `void_collapse` | 80 AoE + pull / 12 AP / `minLevel` 30 | AoE damage only. Attract unused. `effectType` is `"attract_multi"` (not in Pacifist `offCats`). 12 AP needs level 100 (`8 + floor(level/25)`). `minLevel` is listed and **not** checked | NICHE until ~100, then STRONG_BUT_HEALTHY + Pacifist payload |
| `soul_rend` | DoT + 25 upfront | `effectType === "dot"` takes the DoT branch; no `dotDamagePerTurn` → 0 tick | UNDERPOWERED (inert) |
| `vampire_bite` | Drain 20 / heal 20 | `effectType` is `"heal"` not `"drain"`; not `targetType === "self"` → 20 damage, **no heal**. `recordPlayerSpellType("heal")` does **not** flip Pacifist | UNDERPOWERED heal + **DOMINANT** Pacifist payload |
| `reflect_barrier` | Reflect next spell | Generic `buff` without `buffStat` / `isMirror` / `targetType: "self"` | UNDERPOWERED (inert) |

Enemy kits (`ENEMY_KITS` in `enemyAI.ts` 163–185) reuse starter ids. Seeing a bishop cast Frost teaches nothing and unlocks nothing.

---

## 2. Live gates (combo truth table)

| Gate | File | Live behavior |
| :--- | :--- | :--- |
| DoT append | `engine/dotStacks.ts` `appendDotStack` 31–37; `statusEffects.ts` `mergeIncomingEffect` 92–99; `WX` `applyActiveEffect` 1871–1892 | Same-type stacks add; no cap; independent durations |
| Player DoT apply | `spellEngine.ts` `resolvePlayerCast` 777–814 | Sets `dotDamagePerTurn` |
| Player damage debuffs | same, 876–1028 | **Does not** call `applyEffect` for `debuffStat`. 0-damage spells still deal **1** via `calcScaledDamage` floor |
| Controlled-summon / enemy `resolveSpellCast` debuffs | `spellEngine.ts` 529–548 | **Does** apply `debuffStat`. Player-controlled Archer Slow is live |
| Enemy / boss inline debuffs | `WX` enemy-cast path | Apply; same `effectName` replaces (`applyOrRefreshNonDotEffect` 71–84); different names with the same `stat` add (`getStatModifier` 45–63) |
| Summon cap | `gameConstants.ts` `ENEMY_SUMMON_CAP = 2` (300) | Enemy only. Player `spawnPlayerSummon` (`WX` 9582–9635) has no alive-cap |
| Summon spell CD | `spellData.ts` 547–690 | No `cooldown` on the five kits |
| Summon kit CD | `summonControlCast.ts` `planSummonControlCast` 221–282 | AP, range, live geometry, Striker distance — **not** cooldown |
| Summon kit AP | `getSummonBaseStats` 218–244 vs kit `apCost` | Bomber 1 vs Inferno 5; Wisp 2 vs Blood Mend 3 / Rally 4; Wolf 2 vs Venom 3; Sentinel 2 vs Iron Skin 3. Archer Poison 2 vs 2 **does** fire |
| Controlled-summon target | `WX` `castControlledSummonSpell` 9825–9869 | Always `targetEnemy`. Blood Mend / Rally cannot target the player (player is not in `combatantsRef`) |
| `ctx.heal` writer | `WX` 9185–9196 / 15005–15016 | Writes character HP only when `isPlayerHealTargetId`. Summon / enemy ids are no-ops. Recorded delta is ref-after-setState (0) |
| Player summon AP (placement) | `challengeCompletion.ts` 330–331 | Charged |
| Pacifist execute | `WX` `recordPlayerSpellType` 17015–17033 | Offensive list: damage/drain/aoe/dot/pushback/attract/cc/teleport. `"summon"`, `"heal"`, `"debuff"`, `"defense"`, `"buff"`, **`"attract_multi"`** do not flip |
| Pacifist preview | `targeting.ts` 83–85 | Does not flip |
| Challenge heal (spells) | `WX` 17190–17196 | `targetType === "self" && effectType === "heal"` only |
| Challenge heal (potions) | `challengeCompletion.ts` 231–236 | Counted in battle |
| Challenge heal (drain) | `castHelpers.ts` 473–487 + `WX` 9502–9507 | Counted when HP actually restored |
| Summon-AI DoT | `summonExecutor.ts` 191–203 | `applyEffect` without `dotDamagePerTurn` or `stat`/`modifier` |
| Player-controlled summon DoT | `WX` `castControlledSummonSpell` → `resolveSpellCast` | Ticks |
| Timestep | `spellEngine.ts` 634–636 then 680–718 vs 721–733 | **Inert.** `isShieldSpell` is true (`targetType: "self"` + `effectType: "buff"`). Legal self tile returns `"cast"` before `restoreApMp`. Live gate already allows the caster tile (`targeting.ts` 503–508) |
| Mirror | `spellEngine.ts` 917–926 | **Inert on self.** Branch is inside `if (targetEnemy \|\| spell.hitsMultiple)`. Self tile falls through, spends 4 AP, records `"defense"`, never `activateMirror` (`WX` 9574–9578) |
| Sacrifice | `spellEngine.ts` 749–763 | 20% `characterStats.hp` → 3× via `dealDamage` → `enemyTakesDamage` (Enrage / Titan / Glass apply). Mark / crit do not |
| Upgrade damage | `combatMath.ts` `calcScaledDamage` 130–136 | `max(1, base * 1.03^level)`. Does **not** scale `dotDamagePerTurn` literals |
| Battle AP | `progression.ts` `getPlayerBaseStats` 59–72 | Floor 8; +1 every `apMpGrowthEveryNLevels` (default 25) |
| Enemy kit zone | `WX` 11920 + `buildEnemyKit` 194–199 | `currentMap.levelZone` is `{name,minLevel,maxLevel}` (`WX` 4683–4687, 5230–5234). `Math.floor(object)` is `NaN`. Every kit stays zone 0 |
| Enemy summoner roll | `WX` 11932–11942 | `0.12 + playerLevel * 0.02` **per enemy**. 100% at level 44+. Global alive cap still 2 |
| Null Field | `mapModifiers.ts` 419–431 | Suppresses buff/debuff only. DoTs still apply |
| `minLevel` | `resolvePlayerCast` | Not enforced |
| Player turn-start modifiers | `playerTurnStartModifierTarget` (`battleSetup.ts` 364–368); `WX` 14262–14273 | Looks for `id === "player"` in `combatantsRef`. Player is not in that list. Mending Mist / Swift Winds registry ticks miss the player. Plague is special-cased later (`WX` 14309+) |
| `hard_3` | `challengeCompletion.ts` 80–86, 126–127 | `maxApUsedInTurn <= 8`. Vacuous while the bar is 8 |

---

## 3. Combination reports

### 3.1 Unbounded player DoT recast — **BROKEN**

**COMPONENTS:** Poison Arrow (2 AP, 4/turn, 3 turns, no CD) + Venom Strike (3 AP, 4/turn, 3 turns, no CD) + Inferno (5 AP, 8/turn, 3 turns, CD 3). Optional: Arcane Surge / Arcane Overflow (−1 AP, min 1). Optional: player-controlled Archer (`resolveSpellCast` Poison). Optional: `hard_3` (max AP used ≤ 8).

**COMBO_SEQUENCE:**

1. Equip Poison + Venom + Inferno (and optionally an Archer).
2. Each player turn: dump leftover AP into Poison recasts (4 stacks at 8 AP; 8 stacks under Arcane Surge).
3. Mix Venom / Inferno when the extra tick is worth the AP.
4. Stacks append (`appendDotStack`). They do not refresh. A 10-turn boss fight is a damage integral, not a 4+4+8 ceiling.
5. `hard_3` accepts `maxApUsedInTurn <= 8`. A full 8-AP Poison dump is legal for 150 Doka + 450 XP — and until level 25 it cannot fail (016).

**ACCESS_REQUIREMENTS:** Starter library. Arcane Surge is a map-modifier roll. Archer is a starter summon.

**WHY_IT_IS_STRONG:** Cost-to-stack is linear; duration is independent; there is no same-source cap. Long fights (boss, dungeon chain, boss rush) make the last recast strictly better than a front-loaded nuke. Inferno’s CD only gates the 8-tick, not Poison. Null Field does not suppress DoTs. Upgrade 3%/level never touches the 4-tick literal, so stack count is the real scaling. Timestep is currently inert (017), so this combo does **not** get a second dump from that spell — the integral is still unbounded.

**COUNTERPLAY:** Kill faster than the integral. RES reduces each tick once (summed). Enemy kits are stuck at zone 0, so they rarely apply cleanse or pressure that forces the player off the recast.

**RELATIVE_PROGRESSION_CONTEXT:** Available at level 1. Late-game the **stack count** is the scaling, not the upgrade curve.

**PERSISTENCE/ECONOMY_IMPACT:** Faster clears → more `applyRewards` XP/Doka. Soft-destroys “spend Doka on spell levels” for damage spells because recast beats 3%/level on a 4-tick. `hard_3` converts the same dump into a challenge payout.

**RECOMMENDED_RESPONSE:** Same-source refresh or a small per-target / per-name cap. Keep Poison + Venom + Inferno as three different types that can coexist. Do not flatten DoT identity. Do not nerf Timestep when 017 restores it. See `EBMA-2026-09-24-001`. Relative `hard_3` is 016.

---

### 3.2 Player summon flood — **DOMINANT**

**COMPONENTS:** Dire Wolf (3 AP) + Archer (3 AP) + Sentinel (3) + Bomber (2) + Wisp (2). No alive-cap. No summon-spell cooldown. Lifespan = `summonLifespan + floor(spellLevel / 2)` (`summonSpawn.ts` 154–157).

**COMBO_SEQUENCE:**

1. Turn 1 at 8 AP: Wolf + Archer + Wisp, or Wolf + two Wisps, or four Bombers.
2. Each summon gets its own turn (`type: "summon"`), own AP/MP budget, and (if player-controlled) a kit that goes through `resolveSpellCast` — including live Slow / ticking Poison on Archer.
3. Next player turn: spawn again. Nothing evicts the previous wave except lifespan.

**ACCESS_REQUIREMENTS:** All five kits are starters. 8-slot bar is the only limiter.

**WHY_IT_IS_STRONG:** Action-economy multiplier. One player turn buys extra turns of units that occupy tiles and body-block. Live damage on Day 1 is Archer Poison/Slow + Wolf Strike (kit AP mismatch, 014, keeps Bomber Inferno / Wisp Mend / Wolf Venom / Sentinel Iron Skin off). Enemy summons are capped at 2 with a 2-turn cadence; the player is not.

**COUNTERPLAY:** Focus the Wisp (enemy AI already scores it high). AoE (Thunder Clap / Chain Lightning / Lifesteal Nova). Lifespan expiry. Occupancy / portal-reserved cells prevent sealing exits. Void Rift ticks controlled summons.

**RELATIVE_PROGRESSION_CONTEXT:** Spell-level buys HP (+10%/level), AP (+1/3 levels), MP, and lifespan. Cheap Doka upgrades on summon ids make the flood tankier without touching the missing cap.

**PERSISTENCE/ECONOMY_IMPACT:** Pacifist (3.3) converts the flood into 500 Doka. Summon UI advertises 10× upgrade cost; canister still charges `10 * 2^level`.

**RECOMMENDED_RESPONSE:** Player alive-cap (2–3) and a short summon-spell cooldown. Keep five identities. See `EBMA-2026-09-24-002`. Do not also give AI summons ticking DoTs until 001 lands (`EBMA-2026-09-24-006`). Do not close ally-buff targeting as a substitute.

---

### 3.3 Pacifist Run + summons / Bite / Mark / Slow-1 / attract_multi — **DOMINANT** (economy)

**COMPONENTS:** Achievement `pacifist_run` (500 Doka, “Win a battle using only heal or buff spells”, `admin.mo` 324) + any of: damage summon (Wolf / Archer / Bomber) + Vampire Bite (`effectType: "heal"`, 20 damage) + Mark (`effectType: "debuff"`) + Slow / Weaken (0 listed damage, 1 dealt, records `"debuff"`) + Barrier / Mirror (`defense`) + Void Collapse (`attract_multi`, late).

**COMBO_SEQUENCE:**

1. Equip heals/buffs plus any of Bite, Mark, Slow, Barrier, Mirror, or a summon kit.
2. Cast them. `recordPlayerSpellType` only flips on `damage|drain|aoe|dot|pushback|attract|cc|teleport`.
3. Bite deals 20 through the damage loop and records `"heal"`. Slow pokes 1 and records `"debuff"`.
4. Summons kill. Recap fires `checkAndFireAchievement("pacifist_run")` from `handleBattleEnd` **and** `handleBossRushRoomClear` (`victoryAchievements.ts` 37; `WX` 12483–12497 and 12897+). Claim 500 Doka.

**ACCESS_REQUIREMENTS:** Starters + backend Bite if the catalog dump is live + the feat on the canister. Preview must stay off (`shouldApplyHealBuffSideEffectOnRangePreview` is `false`).

**WHY_IT_IS_STRONG:** The condition is implemented as “the player character did not resolve a listed `effectType`,” not “the player side dealt no damage / used only heal or buff.” Bite is a 20-damage spell that the feat treats as a heal. That is the opposite of the advertised intent.

**COUNTERPLAY:** None. The check cannot see summon damage, Bite damage, Mark, or Slow-1.

**RELATIVE_PROGRESSION_CONTEXT:** 500 Doka is `upgradeSpell` fuel. A single legal pacifist clear funds several damage-spell levels or a summon-level spike. Boss Rush room-clear is a second fire site.

**PERSISTENCE/ECONOMY_IMPACT:** Direct. `claimAchievementReward` credits the persist-lock wallet. Once per account, but the first 500 is a free spike if the player knows the hole.

**RECOMMENDED_RESPONSE:** Fail the feat unless every resolved **player** spell is heal, buff, Timestep, or (optionally) Mirror. Count player-side summon damage / offensive kit casts. Bite must fail it even while its heal metadata is still wrong. Treat `"attract_multi"` as offensive. Keep a true pacifist (heals + buffs + Timestep, no kits, no Bite) as a feat. Do not change the Doka amount. Do not revert the preview fix. See `EBMA-2026-09-24-003`.

---

### 3.4 No-heal challenge + drain / Wisp — drain **closed**; Wisp **UNDERPOWERED** (cannot heal the player)

**COMPONENTS:** `easy_1` (50 Doka) / `hard_1` (200 Doka + 500 XP) + Life Drain / Lifesteal Nova / Drain Courage + Wisp Blood Mend / Rallying Cry.

**LIVE SEQUENCE:** Drain HP restores call `onPlayerHealed` → `recordChallengeHealFromHpRestore` with the actual `healAmt`. BuffShop potions still count. Wisp control-cast always targets an enemy; `ctx.heal` ignores non-player ids; even a true player heal would record delta 0 because the ref is not updated before the subtract. Vampire Bite’s heal is still inert.

**WHY_IT_IS_STRONG:** It is not a live farm anymore on the drain path. Wisp is not a no-heal tool because it cannot raise player HP.

**RECOMMENDED_RESPONSE:** Do **not** re-open 005. Restore Wisp targeting + honest HP-delta recording (`015`). After 015, a Wisp heal should **fail no-heal** and **remain legal for advertised Pacifist** (heal/buff). Keep overworld Doka-to-HP excluded.

---

### 3.5 Dead player-bar control kit — **UNDERPOWERED** (player bar) / **STRONG_BUT_HEALTHY** (controlled Archer)

**COMPONENTS:** Slow (`mp` −2 / 2), Frost Bolt (`mp` −1 / 1), Weaken (`dmg` 0.7 / 2), Expose / Shadow Veil (`res_sp`), Drain Courage (`ap` −1 / 1), Cursed Wound (`healRecv` 0.5), Life Drain (`sp` 0.8), Frost Nova (AoE + advertised Slow). Archer kit: Poison + Slow.

**COMBO_SEQUENCE (player bar):** Player casts any of the above through `resolvePlayerCast`. Damage (if any) applies — 0-damage Slow/Weaken poke **1**. `debuffStat` is never written.

**COMBO_SEQUENCE (controlled Archer):** Player-controlled Archer casts Slow through `resolveSpellCast` 529–548. The MP debuff **does** land. AI Archer Slow still goes through `executeSummonAction` `applyEffect` without `stat`/`modifier` (cosmetic).

**ACCESS_REQUIREMENTS:** Starters. 8-slot opportunity cost on the bar; Archer kit is a summon slot.

**WHY_IT_IS_STRONG:** The player bar is not. The cards advertise control that the player path cannot deliver. The **intended** Slow identity currently lives only on a controlled Archer, which is interesting synergy and should be kept if 002 caps the flood.

**COUNTERPLAY:** N/A on the bar (player is the one missing the tool). Kill the Archer to remove live Slow.

**RELATIVE_PROGRESSION_CONTEXT:** Upgrading Slow / Weaken on the bar spends Doka on a missing half of the spell.

**PERSISTENCE/ECONOMY_IMPACT:** Wasted upgrade spend. Slow-1 is a Pacifist payload (003).

**RECOMMENDED_RESPONSE:** Wire `debuffStat` after the player damage loop (do not skip damage). Skip the `max(1, …)` floor when listed `damage` is 0 on a debuff/DoT-only spell. Then cap stacked AP/MP denial so the restored kit cannot lock a target at 0 AP/MP forever. See `EBMA-2026-09-24-004`. This is a restore, not a nerf. Do not strip Archer Slow.

---

### 3.6 Latent enemy AP/MP denial (Bishop + Archer Slow) — **NICHE** live / **DOMINANT** if kits grow

**COMPONENTS:** Bishop Frost Bolt + enemy Archer Slow (enemy summon kit). Same-stat additives in `getStatModifier` (`statusEffects.ts` 45–63).

**COMBO_SEQUENCE (if kits were zone-correct):** Frost (−1 MP, 1 turn) + Slow (−2 MP, 2 turns) = −3 on a 4-MP player. Refresh each enemy turn.

**LIVE SEQUENCE:** `buildEnemyKit(..., currentMap.levelZone)` stays zone 0. Bishops have Frost only. Multiple Frosts **replace** by `effectName`. Live denial is −1 MP for 1 turn. Enemy AI Slow from an Archer summoner is cosmetic (`summonExecutor` omits `stat`).

**ACCESS_REQUIREMENTS:** Live: any bishop pack. Latent: zone ≥ 1 kits + enemy Archer summon.

**WHY_IT_IS_STRONG (latent):** Player mobility is the positional game. −3 MP on a 4-MP pool is near-root. Different spell names stack; same name refreshes.

**COUNTERPLAY (latent):** Kill the bishop / archer; Haste (+2 MP, 1 turn); Timestep (once — currently inert, 017); Null Field (suppresses buffs/debuffs).

**RELATIVE_PROGRESSION_CONTEXT:** Zone growth is supposed to add Slow / Inferno / heals and never does.

**PERSISTENCE/ECONOMY_IMPACT:** None live.

**RECOMMENDED_RESPONSE:** Do **not** nerf Frost or Slow. Pass a numeric zone into `buildEnemyKit` so intended kits exist (`EBMA-2026-09-24-009`). If that ships, add a same-stat AP/MP stack cap on the enemy path (`004` covers both sides).

---

### 3.7 Inferno cooldown circumvention via summons — **UNDERPOWERED** live / **DOMINANT** after kit-AP restore

**COMPONENTS:** Player Inferno (CD 3, 5 AP) + Bomber kit (`summonKit: ["spell-inferno"]`, `ap: 1`) + player-controlled `resolveSpellCast`.

**LIVE SEQUENCE:** `planSummonControlCast` returns `no_ap` (need 5, have 1). Not a Day-1 launder. Spell-level +1 AP every 3 levels needs **level 12** to pay Inferno.

**LATENT SEQUENCE (if 014 raises Bomber AP to 5 without 010):** Controlled Bomber applies an 8/turn × 3 Inferno stack every summon turn. Player Inferno CD is irrelevant.

**RECOMMENDED_RESPONSE:** Honor kit-spell `cooldown` on the summon (`EBMA-2026-09-24-010`) **before or with** Bomber 5 AP (`014`). Do not share the player Inferno lock with the Bomber.

---

### 3.8 Titan’s Vigor × Glass Realm × Sacrifice — **STRONG_BUT_HEALTHY** (monitor)

**COMPONENTS:** Map modifiers Titan’s Vigor (`+1000` HP on `applyBattleStart`; `onDamageDealt` 1–5×) + Glass Realm (×2 on the same hook) + Sacrifice (20% current `characterStats.hp` × 3).

**COMBO_SEQUENCE:**

1. Roll both modifiers (independent map rolls; not guaranteed).
2. Sacrifice reads `characterStats.hp` (Titan’s store-HP bump may not be on that object).
3. `dealDamage` → `enemyTakesDamage` (`WX` 3499) → `applyDamageDealt` applies Titan roll then Glass.

**WHY_IT_IS_STRONG:** Lottery on a path that already ignores Mark/crit. Main-bar nukes (Strike, Shadow Strike, Chain Lightning) **do not** go through `enemyTakesDamage`, so they do **not** get the 1–5× / ×2. The scary packet is Sacrifice-only. Vampiric Ground is on the same hook, so it also misses the main bar.

**COUNTERPLAY:** Don’t stand next to the target (range 1). Mirror (currently inert on self, 017). Don’t pick Sacrifice on a Glass map.

**RELATIVE_PROGRESSION_CONTEXT:** Modifier luck, not a loadout.

**PERSISTENCE/ECONOMY_IMPACT:** None beyond a lucky one-shot.

**RECOMMENDED_RESPONSE:** Monitor. Do not nerf Sacrifice or the modifiers unless play data shows every Glass+Titan map is a skip-or-Sacrifice binary. See `EBMA-2026-09-24-008`.

---

### 3.9 Enrage + Mark + Crit + Fury / Blood Moon — **STRONG_BUT_HEALTHY**

**COMPONENTS:** Enrage (×1.4 dmg, 2 turns, 3 AP) + Mark (×2 next hit, 2 AP) + CHC crit (×2) + Fury potion (×1.25, 3 turns) + Blood Moon (×1.25, map). Optional: player Enrage on an allied Wolf (`targetType: "ally"` resolves to a player-side summon in `resolvePlayerCast` 676–718).

**COMBO_SEQUENCE:** Enrage → Mark tile → nuke (Shadow Strike 35 or Chain Lightning / Expose). Setup is 5 AP before the hit; 8 AP bar leaves 3 for the nuke (Shadow Strike fits). Ally-Enrage on a Wolf is a second payload on the summon’s turn.

**WHY_IT_IS_STRONG:** Multipliers compose. Shadow Strike (backend seed) is the best payload. Ally-Enrage is targeting honesty, not a new number.

**COUNTERPLAY:** RES/SR. Don’t stand on the marked tile. Kill the caster during the setup turn. Paper Windstorm miss. Mirror (when 017 restores it). Kill the Wolf.

**RECOMMENDED_RESPONSE:** Preserve. This is the intended burst identity. Do not touch Mark, Enrage, or ally-buff targeting because the product is large.

---

### 3.10 Shield + Iron Skin (+ Sentinel / ally target) — **STRONG_BUT_HEALTHY**

**COMPONENTS:** Both `buffStat: "res"`, `buffModifier: 1.3`, different `effectName` → multiplicative 1.69× RES for 3 turns. Sentinel kit can apply Shield (2 AP vs 2 AP) but not Iron Skin at slvl 0 (3 vs 2). Player Shield/Iron Skin can land on an allied summon.

**WHY_IT_IS_STRONG:** Durable, not immortal. Costs 5 AP (or a Sentinel turn after 014). Null Field suppresses. Duration is short. Buffing a 0.5-scale Bomber is a real decision, not a loop.

**RECOMMENDED_RESPONSE:** Preserve.

---

### 3.11 Timestep + Haste + Rally — **UNDERPOWERED** (Timestep inert) / Rally CHC half inert

**COMPONENTS:** Timestep (once, advertised restore) + Haste (+2 MP, 1 turn) + Rally / Blood Mend (heal + advertised CHC).

**LIVE SEQUENCE:** Highlight allows the caster tile. `executeCastAttempt` reaches `resolvePlayerCast`. `isShieldSpell` is true for Timestep. Self tile returns `"cast"` **without** `restoreApMp`. Haste still works (has `buffStat`). Blood Mend / Rally heal, then return without writing CHC (`654–673`). Crit uses raw `characterStats.chc` (`WX` 9158).

**WHY_IT_IS_STRONG:** It is not, on the Timestep half. One extra full bar per fight was a real decision, not a loop. Restoring it (017) re-amplifies 3.1 by one dump; that is still the missing DoT cap’s problem, not Timestep’s.

**RECOMMENDED_RESPONSE:** Restore Timestep/Mirror on the highlighted self tile (`017`). Do not nerf Timestep after restore. Optionally wire CHC through `getStatModifier` as additive points (`012`). Preserve Haste.

---

### 3.12 Swap / Barrier / Mirror — **STRONG_BUT_HEALTHY** (Swap) / **UNDERPOWERED** (Mirror self)

**COMPONENTS:** Swap (3 AP, `effectType: "teleport"` — **does** flip Pacifist), Barrier (3 AP, 3-turn tile; copy says 2), Mirror (4 AP, next single-target reflect; `activatePlayerMirror` is wired but never reached from self).

**WHY_IT_IS_STRONG:** Swap is positional and reactive. Swap onto lava/ice/rift does **not** run walk hazards (MIMA-2026-08-31-001). That is a challenge-integrity hole (Untouchable) more than a damage loop. Mirror currently spends 4 AP for `"defense"` and no shield.

**RECOMMENDED_RESPONSE:** Do not nerf Swap. Hazard landing belongs to the MIMA ticket. Restore Mirror on self (`017`). Pacifist-legal Barrier is owned by 003.

---

### 3.13 Backend catalog + 8-slot bar — **NICHE** (discovery still inert)

There is no achievement-spell or enemy-discovery combination on the live path. The only extra combo space from the canister is Shadow Strike / Thunder Clap / late Void Collapse sitting next to starters, plus inert Bite / Soul Rend / Reflect. That is a **catalog dump**, not a discovery reward.

**RECOMMENDED_RESPONSE:** Do not invent unlocks in this PR. Point implementers at existing `SDA-2026-08-31-002` … `004` / `SDE-2026-08-31-001` … `003`. See `EBMA-2026-09-24-007`. Restore Bite / Soul Rend / Reflect metadata so the dump is at least honest (`013`).

---

### 3.14 Late-game enemy summoner density — **STRONG_BUT_HEALTHY**

**COMPONENTS:** `ENEMY_SUMMONER_CHANCE_BASE + level * 0.02` per enemy + Wolf/Archer kits + `ENEMY_SUMMON_CAP = 2`.

**WHY_IT_IS_STRONG:** By level 44 every trash mob is a summoner. The cap and 2-turn cadence keep this from flooding. Comment in `gameConstants.ts` 295–297 still says “~12% of packs.” AI enemy summons still do not tick DoTs.

**RECOMMENDED_RESPONSE:** Retarget the roll to pack-level / zone if the board feels noisy. Not a P0. See `EBMA-2026-09-24-011`.

---

### 3.15 Ally-buff summons (Enrage / Shield / Haste on kits) — **STRONG_BUT_HEALTHY** (preserve)

**COMPONENTS:** `resolvePlayerCast` ally branch (676–718) + Enrage / Shield / Iron Skin / Haste + any player-side summon.

**WHY_IT_IS_STRONG:** The spells already said “ally.” Landing them on a Wolf or Sentinel is the identity working. 1.4× Wolf damage and 1.69× Sentinel RES are large but duration-gated and Null-Field-vulnerable. The same branch is what swallows Timestep (017) — do not remove ally targeting to fix Timestep; skip Timestep (and spells without `buffStat`) in the predicate instead.

**RECOMMENDED_RESPONSE:** Preserve ally targeting. Do not close it to “fix” 3.2 or 3.11. Cap the flood (002). Restore Timestep with a narrower shield predicate (017).

---

### 3.16 Kit AP mismatch + Wisp targeting — **UNDERPOWERED**

**COMPONENTS:** Spawn AP vs kit `apCost` (`getSummonBaseStats` vs `spellData.ts` 547–690) + control-cast enemy-only targeting.

**WHY_IT_IS_STRONG:** It is not. Advertised kit spells are mostly unpayable. Archer Poison is the exception and is the live DoT amplifier in 3.1. Wisp cannot heal the player even after AP alignment.

**RECOMMENDED_RESPONSE:** Align spawn AP to the cheapest advertised kit spell (`014`) **with** kit cooldown (`010`) before Bomber 5 AP. Restore Wisp player/ally targeting and honest no-heal recording (`015`).

---

### 3.17 `hard_3` vs 8-AP bar — **DOMINANT** (early-game challenge economy)

**COMPONENTS:** Challenge `hard_3` (“Never spend more than 8 AP in any single turn”, 150 Doka + 450 XP) + live battle AP `8 + floor(level/25)`.

**COMBO_SEQUENCE:** Accept `hard_3` at level 1–24. Play any legal fight. Peak spend cannot exceed the pool. Persist 150 Doka + 450 XP. 450 XP at level 1 is two `100 * 2^(N-1)` steps plus leftover.

**ACCESS_REQUIREMENTS:** Challenges are a 1/9 random offer that must be accepted. No discovery. No special loadout.

**WHY_IT_IS_STRONG:** The objective is vacuously true for the entire early game. Combined with 3.1 a full Poison dump is both the unbounded integral **and** a free challenge clear. This invalidates “play cheap” as a decision.

**COUNTERPLAY:** None until level 25 (AP 9). Timestep cannot inflate the peak because Timestep does not restore AP (017). If 017 lands first, a mid-turn Timestep + second dump **would** fail `hard_3` — that is not a reason to leave Timestep dead.

**RELATIVE_PROGRESSION_CONTEXT:** Early-game Doka/XP spike. Late-game (AP 9+) the literal 8 is suddenly a real constraint, which is the opposite of a smooth curve.

**PERSISTENCE/ECONOMY_IMPACT:** Direct `applyRewards` on an unfailable objective.

**RECOMMENDED_RESPONSE:** Relativize the cap to the live battle AP bar. Preserve 150 Doka / 450 XP. Do not nerf Poison costs here. See `EBMA-2026-09-24-016`.

---

### 3.18 Timestep / Mirror self-tile no-op — **UNDERPOWERED** (new this pass)

**COMPONENTS:** Timestep (`isTimestep`, `targetType: "self"`, `effectType: "buff"`, 0 AP) + Mirror (`isMirror`, `targetType: "self"`, `effectType: "defense"`, 4 AP) + `isTileCastableLive` self branch + `isShieldSpell` / damage-loop ordering.

**COMBO_SEQUENCE:**

1. Select Timestep or Mirror. Highlight paints the caster tile (`playerSpellAllowsCasterTile`).
2. Click / Attack Nearest / keyboard S on that tile. `planPlayerCastAttempt` returns ok.
3. Timestep: `isShieldSpell` is true; no `buffStat`; still `return "cast"` at 716–717. AP/MP unchanged. `timestepUsedRef` never consumed.
4. Mirror: no `targetEnemy` on the player tile; `isMirror` branch never runs. 4 AP spent. `activatePlayerMirror` never called.

**ACCESS_REQUIREMENTS:** Starters. No upgrade.

**WHY_IT_IS_STRONG:** It is not. The cards advertise a once-per-battle full bar and a reactive reflect. Both are dead on the only legal tile. 09-02 / 09-23 classified them STRONG_BUT_HEALTHY from metadata.

**COUNTERPLAY:** N/A (player is missing the tool).

**RELATIVE_PROGRESSION_CONTEXT:** Early. Restoring Timestep re-amplifies 3.1 by one dump — 001 still owns that loop.

**PERSISTENCE/ECONOMY_IMPACT:** None while inert. After restore, one extra Poison dump per fight (still bounded if 001 lands).

**RECOMMENDED_RESPONSE:** Restore, do not nerf. Skip Timestep (and spells without `buffStat`) in the shield predicate; hoist Mirror onto the caster tile before the damage loop. Queued PR #496 (`playerSpecialCast.ts`) is the same restore — merge it or an equivalent; do not land a second copy. See `EBMA-2026-09-24-017`.

---

## 4. Classification board (player-accessible)

| Package | Class | Intervene? |
| :--- | :--- | :--- |
| Poison recast / Poison+Venom+Inferno (+ Arcane Surge) (+ `hard_3`) | BROKEN | Yes — cap / refresh |
| Player summon flood (5 kits, no cap/CD) | DOMINANT | Yes — cap + kit CD |
| Pacifist + summon / Bite / Mark / Slow-1 / attract_multi | DOMINANT | Yes — advertised categories; keep preview fix |
| `hard_3` vs 8-AP bar (levels 1–24) | DOMINANT | Yes — relativize to live bar |
| No-heal + drain | CLOSED | Do not re-open |
| No-heal + Wisp | UNDERPOWERED (cannot heal) | Restore targeting (015), then count |
| Inferno via Bomber | UNDERPOWERED live / DOMINANT after 014 | Kit CD before Bomber 5 AP |
| Shadow Strike + Mark + Enrage | STRONG_BUT_HEALTHY | No |
| Shield + Iron Skin (+ Sentinel / ally) | STRONG_BUT_HEALTHY | No |
| Ally Enrage / Haste on kits | STRONG_BUT_HEALTHY | No |
| Timestep (once) | UNDERPOWERED (inert) | Restore self-tile (017); then preserve |
| Mirror (self) | UNDERPOWERED (inert) | Restore with 017 |
| Sacrifice + Titan + Glass | STRONG_BUT_HEALTHY | Monitor |
| Thunder Clap / Chain Lightning | STRONG_BUT_HEALTHY | No |
| Swap / Barrier | STRONG_BUT_HEALTHY | Hazard landing is MIMA, not EBMA |
| Enemy summoner density (capped 2) | STRONG_BUT_HEALTHY | Soft formula fix |
| Controlled Archer Slow | STRONG_BUT_HEALTHY | Restore the bar; keep the kit |
| Bishop Frost only (zone 0) | NICHE | Restore zone number |
| Void Collapse (12 AP) | NICHE | Don’t enforce `minLevel` as a surprise nerf |
| Player Slow/Weaken/Expose/Frost/Courage | UNDERPOWERED | Restore `debuffStat` |
| Soul Rend / Vampire Bite heal / Reflect Barrier | UNDERPOWERED | Metadata, not a nerf |
| Blood Mend / Rally CHC half | UNDERPOWERED | Wire `chc` after heal |
| Kit AP mismatch (Bomber/Wisp/Wolf/Sentinel) | UNDERPOWERED | Align AP; pair Bomber with 010 |
| AI summon DoTs / AI Bomber kamikaze / AI Slow | UNDERPOWERED | Only after DoT cap (DoTs); Slow restore is 004/006 adjacent |

---

## 5. What not to touch

- RAF loop, map generation, turn order, damage formula (`calcScaledDamage` 3%/level) except the 0-damage debuff floor in 004.
- Mark, Enrage, ally-buff targeting, Barrier geometry, Swap’s teleport identity.
- 3% upgrade curve. Economy bugs around summon advertised cost vs canister debit are already owned by persist work.
- Inventing observe-to-unlock in this automation. That is SDA / SDE.
- Reverting the Pacifist preview fix.
- GameKey shop numbers (out of combat-combo scope).
- Occupancy dual-path unseal / Void Rift summon tick / drain no-heal / Sacrifice Untouchable (closed correctly).
- Re-implementing #496 in this PR. Point at it.
- Treating queued #443 Mending Mist helper as live until WX is wired.

---

## 6. Prior ACTION_ID disposition

| Prior | 2026-09-24 | Notes |
| :--- | :--- | :--- |
| 08-31 … 09-23 001 DoT cap | Reissued as 001 | Still true; Timestep is not currently an amplifier |
| 09-23 002 Summon cap + CD | Reissued as 002 | AP still charged; cap/CD still missing |
| 09-23 003 Pacifist | Reissued as 003 | Bite/Mark/Slow-1/summon/`attract_multi`; Boss Rush fire stays |
| 09-23 004 Player debuff + 0-floor + stack cap | Reissued as 004 | Bar still dead; controlled Archer Slow live |
| 09-02 005 Challenge drain | **Stays closed** | Do not reissue |
| 09-23 006 AI DoT ppt | Reissued as 006 | Still gated on 001 |
| 09-23 007 Catalog ≠ ownership | Reissued as 007 | Still inert; point at SDA/SDE |
| 09-23 008 Titan × Glass | Reissued as 008 | Still Sacrifice-only hook |
| 09-23 009 Numeric zone | Reissued as 009 | Call site still passes the object |
| 09-23 010 Kit cooldown | Reissued as 010 | After 014; not a Day-1 launder |
| 09-23 011 Enemy summoner chance | Reissued as 011 | Still per-enemy × player level |
| 09-23 012 CHC buff restore | Reissued as 012 | Heal branch still skips the write |
| 09-23 013 Bite / Soul Rend / Reflect | Reissued as 013 | Metadata still wrong |
| 09-23 014 Kit AP align | Reissued as 014 | Pair Wisp with 015, Bomber with 010 |
| 09-23 015 Wisp targeting | Reissued as 015 | Control-cast still enemy-only |
| 09-23 016 Relative `hard_3` | Reissued as 016 | Still vacuous at AP 8 |
| — | **New 017** | Timestep swallowed by `isShieldSpell`; Mirror inside damage loop. Queued #496. |

---

## 7. Search checklist (this pass)

| Pattern | Result |
| :--- | :--- |
| Excessive damage/AP combinations | 3.1 DoT recast; 3.9 burst (healthy) |
| Infinite / near-infinite loops | DoT append has no cap; summon recast limited only by AP + lifespan |
| Permanent control | Player-bar denial dead; latent after 009 |
| AP/MP denial chains | Latent 3.6; live Archer Slow is kit identity |
| Summon abuse | 3.2 flood; 3.7 Inferno launder is latent |
| Cooldown circumvention | Player Inferno CD closed; kit CD missing and gated on AP |
| Healing loops | Drain no-heal **closed**; Wisp cannot heal the player; Bite heal inert; Mending Mist not WX-wired |
| Defensive immortality | Shield+Iron Skin duration-gated (healthy) |
| Status stacking | DoT append BROKEN; non-DoT replace-by-name |
| Displacement loops | Swap identity healthy; hazard landing is MIMA |
| Hazard combinations | Swap × lava is MIMA, not EBMA |
| Achievement-spell combinations | No spell grants. Pacifist is an achievement × existing kit combo |
| Enemy-discovery spell combinations | Discovery inert. Catalog dump is not discovery |
| Advertised identity dead | Timestep + Mirror self-tile (017); player-bar debuffs (004); kit AP (014) |
