# Emergent Build & Meta Analysis — 2026-09-23

**Analyzer:** Emergent Build & Meta Analyzer  
**Automation:** `7b2f2b58-a49e-11f1-a7d1-d6b4613131ce` (cron `0 */72 * * *`)  
**HEAD:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Prior pass:** 2026-09-22 (`EMERGENT_META_2026-09-22.md` lives on open PR #414; not on `main`). 2026-09-21 docs remain draft PR #365. Last merged pass on `main` is 2026-09-02 (`EMERGENT_META_2026-09-02.md`; ACTION_IDs `EBMA-2026-09-02-001` … `013`).  
**Gameplay code:** not modified. Balance was not changed.

This is a combination audit. Individual rows can look fair while two or three of them delete the rest of the kit.

Intervention is recommended only when a strategy:

- invalidates alternatives
- removes counterplay
- produces infinite / degenerate loops
- destroys progression or economy

Strong interesting synergy is left alone.

ACTION_IDs: [`ACTION_IDS_EBMA_2026-09-23.md`](./ACTION_IDS_EBMA_2026-09-23.md).

Prior IDs were **not implemented** except where a cited gate actually moved. Escalate only those. Do not re-open closed gates.

---

## 0. What changed since 2026-09-22 / 2026-09-02

`origin/main` is still `0f5363f`. No combat merge landed between the 2026-09-22 analyzer pass and this cron. This pass re-reads the same HEAD and weights one economy gate the 09-22 file named only as DoT-adjacent: **`hard_3` is auto-complete for every accepted fight while battle AP is 8** (levels 1–24).

Combat-relevant merges on `58302bc` (09-02) → `0f5363f` that still define the live meta (spell mechanics #282, discovery design #300, combat parity #304/#314/#326, economy #315, critical defects #319, Boss Rush feats `451d2ed`, drain no-heal `9f36239`):

| Gate | 2026-09-02 | 2026-09-23 (same SHA as 09-22) | Meta effect |
| :--- | :--- | :--- | :--- |
| Drain × no-heal | `drainPercent` never touched `healUsed` | `recordChallengeHealFromHpRestore` (`challengeCompletion.ts` 250–259); `onPlayerHealed` (`WX` 9502–9507; `castHelpers.ts`) | **Closed.** Do not re-open. |
| Wisp / ctx.heal × no-heal | summon `heal` skipped the flag | Helper is **called** (`WX` 9185–9196, 15005–15016) but (1) player-controlled casts always pass `targetEnemy` (`WX` 9849–9869), (2) `ctx.heal` writes HP only for `"player"` / `"__player__"`, (3) the recorded delta is `characterStatsRef.hp` immediately after `setCharacterStats`, whose ref write lives **inside** the React updater (`WX` 3261–3270) so the delta is 0. Wisp cannot heal the player at any spell level. Not a live no-heal farm. See 3.4 / 3.16 / 015. |
| BuffShop potions × no-heal | Closed | Still closed | Do not re-open. |
| Pacifist preview | Closed | Still closed (`targeting.ts` 83–85) | Do not re-open. |
| Pacifist execute | `recordPlayerSpellType` only | Unchanged (`WX` 17015–17033). Void Collapse records `"attract_multi"`; `offCats` lists `"attract"`. |
| Pacifist 0-damage debuffs | Not named in 09-02 | `calcScaledDamage` floors 0 to 1 (`combatMath.ts` 130–136). Slow / Weaken poke 1 without flipping the feat | Extra 003 evidence. |
| Sacrifice × Untouchable | Self-HP skipped `playerTakesDamage` | `recordChallengeSelfHpLoss` (`WX` 9374–9386) | Do not re-open. |
| Player summon AP | Charged | Still charged (`castResultSpendsAp` includes `"summon"`, `challengeCompletion.ts` 330–331) | Unchanged. |
| Attack Nearest Inferno CD | Closed on the player bar | Still closed | Unchanged. |
| Inferno via Bomber | Filed as DOMINANT CD launder | Bomber 1 AP vs Inferno 5. Live `no_ap`. **Mis-classified in 09-02.** |
| DoT append | no cap | unchanged (`appendDotStack` 31–37) | Still BROKEN. |
| Player `debuffStat` | damage loop never applied it | unchanged (`resolvePlayerCast` 876–1028) | Player-bar control kit still dead. Controlled Archer Slow still live (`resolveSpellCast` 529–548). |
| Catalog = ownership | `usableByPlayer !== false` dumps the library | unchanged (`adminSafety.ts` 712–719; `WX` 2412–2440) | Discovery still inert. #300 did not ship observe→unlock. |
| Enemy kit zone | object → NaN → zone 0 | unchanged (`WX` 11920 + `buildEnemyKit` 194–199) | Still latent. |
| `hard_3` vs live AP bar | Named only as “8-AP Poison dump is legal” | Battle AP is `8 + floor(level/25)` (`progression.ts` 59–72). Until level 25 the pool **is** 8, so `maxApUsedInTurn <= 8` (`challengeCompletion.ts` 126–127) cannot fail. **New 016.** |
| Inf-HP summon catalog | Closed | Still closed | Do not re-open. |
| Void Rift × controlled summon | Tick commits | Still commits (`WX` 14440–14448) | Do not re-open. |

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

Still unimplemented from 2026-09-02 / 09-21 / 09-22: DoT cap, player summon cap/CD, pacifist advertised categories, player `debuffStat` wire, AI DoT `dotDamagePerTurn`, catalog≠ownership, Titan monitor, numeric zone, kit-spell CD (gated on AP alignment), summoner-chance retarget, CHC restore, Bite / Soul Rend / Reflect metadata, kit AP vs kit cost, Wisp heal targeting. **New:** relative `hard_3` cap (016). **Queued, not live:** MIMA player turn-start vitals helper (#443) is not wired in `WorldExploration`; do not treat Mending Mist as a live heal loop.

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
| Pacifist fire | `victoryAchievements.ts` 37; `WX` 12483–12497 and 12897–12916 | Overworld victory **and** Boss Rush room-clear |
| Challenge heal (spells) | `WX` 17190–17196 | `targetType === "self" && effectType === "heal"` |
| Challenge heal (potions) | `challengeCompletion.ts` 231–235 | Counted in battle |
| Challenge heal (drain) | `onPlayerHealed` with the actual amount | **Counted** when HP actually increases |
| Challenge heal (ctx.heal) | wired, delta often 0; Wisp cannot target player | Not a live farm |
| Challenge offer | `WX` 12210–12218 | One random row from `DEFAULT_CHALLENGES` (9 ids). Must **accept**. `hard_3` is 1/9 of offers |
| Challenge `hard_3` | `challengeCompletion.ts` 80–86, 126–127 | `maxApUsedInTurn <= 8`. Live bar is 8 until level 25 |
| Summon-AI DoT | `summonExecutor.ts` 191–203 | `applyEffect` without `dotDamagePerTurn` or `stat`/`modifier` |
| Player-controlled summon DoT | `WX` `castControlledSummonSpell` → `resolveSpellCast` | Ticks (Archer Poison) |
| Live summon AI | `decideSummonAction` + `executeSummonAction` | Player-side is control-mode (`WX` 14418–14421). `engine/summonAI.ts` `runSummonAI` is unused |
| Timestep | `spellEngine.ts` 721–733 | Once per battle; 0 AP; restores formula AP/MP + active AP/MP additives |
| Sacrifice | `spellEngine.ts` 749–763 | 20% `characterStats.hp` → 3× via `dealDamage` → `enemyTakesDamage`. Challenge self-HP **is** recorded |
| Upgrade damage | `combatMath.ts` `calcScaledDamage` 130–136 | `max(1, floor(base * 1.03^level))`. Does **not** scale `dotDamagePerTurn` literals. Floors 0-damage to 1 |
| Battle AP | `progression.ts` `getPlayerBaseStats` 59–72; `PLAYER_BASE_AP = 8` | Floor 8; +1 every `apMpGrowthEveryNLevels` (default 25) via `floor(level/25)` |
| Enemy kit zone | `WX` 11920 + `buildEnemyKit` 194–199 | `currentMap.levelZone` is an object. `Math.floor(object)` is `NaN`. Every kit stays zone 0 |
| Enemy summoner roll | `WX` 11932–11942 | `0.12 + playerLevel * 0.02` **per enemy**. 100% at level 44+. Global alive cap still 2 |
| Null Field | `mapModifiers.ts` 419–431 | Suppresses buff/debuff only. DoTs still apply |
| `minLevel` | `resolvePlayerCast` | Not enforced |
| CHC buff | `WX` `playerSpellContext` 9158; heal branch 654–673 | Crit uses raw `characterStats.chc`. Blood Mend / Rally heal branch never writes the `chc` effect |
| Mending Mist (player) | `playerTurnStartModifierTarget` (`battleSetup.ts` 364–368); `WX` 14262–14274 | Looks up `id === "player"` in `combatantsRef`. Player is not in that list. Inert on the character. Player-side **summons** do tick mist on their turn (`WX` 14440–14448) |
| Queued MIMA vitals | Open PR #443 | Helper only. WX not wired. Not live combo space |

---

## 3. Combination reports

### 3.1 Unbounded player DoT recast — **BROKEN**

**COMPONENTS:** Poison Arrow (2 AP, 4/turn, 3 turns, no CD) + Venom Strike (3 AP, 4/turn, 3 turns, no CD) + Inferno (5 AP, 8/turn, 3 turns, CD 3). Optional: Arcane Surge / Arcane Overflow (−1 AP, min 1). Optional: player-controlled Archer (`resolveSpellCast` Poison, 2 AP vs 2 AP — this kit **does** fire). Optional: `hard_3` (max AP used ≤ 8) — see also 3.17.

**COMBO_SEQUENCE:**

1. Equip Poison + Venom + Inferno (and optionally an Archer).
2. Each player turn: dump leftover AP into Poison recasts (4 stacks at 8 AP; 8 stacks under Arcane Surge).
3. Mix Venom / Inferno when the extra tick is worth the AP.
4. Stacks append (`appendDotStack`). They do not refresh. A 10-turn boss fight is a damage integral, not a 4+4+8 ceiling.
5. Each controlled Archer turn adds another Poison stack (2 AP, no CD).
6. `hard_3` accepts `maxApUsedInTurn <= 8`. A full 8-AP Poison dump is a legal challenge clear **and** (until level 25) is also the entire bar.

**ACCESS_REQUIREMENTS:** Starter library. Arcane Surge is a map-modifier roll, not an unlock. Archer is a starter summon.

**WHY_IT_IS_STRONG:** Cost-to-stack is linear; duration is independent; there is no same-source cap. Long fights (boss, dungeon chain, boss rush) make the last recast strictly better than a front-loaded nuke. Inferno’s CD only gates the 8-tick, not Poison. Null Field does not suppress DoTs. Upgrade 3%/level never touches the 4-tick literal, so stack count is the real scaling.

**COUNTERPLAY:** Kill faster than the integral. RES reduces each tick once (summed). Enemy kits are stuck at zone 0, so they rarely apply cleanse or pressure that forces the player off the recast.

**RELATIVE_PROGRESSION_CONTEXT:** Available at level 1. Late-game the **stack count** is the scaling, not the upgrade curve.

**PERSISTENCE/ECONOMY_IMPACT:** Faster clears → more `applyRewards` XP/Doka. Soft-destroys “spend Doka on spell levels” for damage spells because recast beats 3%/level on a 4-tick. `hard_3` converts the same dump into a challenge payout (and, until AP grows, into a free payout — 3.17).

**RECOMMENDED_RESPONSE:** Same-source refresh or a small per-target / per-name cap. Keep Poison + Venom + Inferno as three different types that can coexist. Do not flatten DoT identity. Do not nerf Timestep because it amplifies one extra dump. See `EBMA-2026-09-23-001`. Relative `hard_3` is 016, not a Poison cost nerf.

---

### 3.2 Player summon flood — **DOMINANT**

**COMPONENTS:** Dire Wolf (3 AP spawn) + Archer (3) + Sentinel (3) + Bomber (2) + Wisp (2). No alive-cap. No summon-spell cooldown. Lifespan = `SUMMON_BASE_LIFESPAN` (4) + `floor(spellLevel / 2)` (`getSummonBaseStats` 239–242). Per-spell `summonLifespan` on the catalog row is **not** the canonical formula.

**COMBO_SEQUENCE:**

1. Turn 1 at 8 AP: Wolf + Archer + Wisp, or Wolf + two Wisps, or four Bombers.
2. Each summon gets its own turn (`type: "summon"`), own AP/MP budget, and (if player-controlled) a kit that goes through `resolveSpellCast` — Archer Poison **ticks** and Archer Slow **lands**. Wisp / Bomber kits do **not** fire at spell level 0 (3.16).
3. Next player turn: spawn again. Nothing evicts the previous wave except lifespan.
4. Player-side summons **do** take Void Rift / Mending Mist / plague on their turn (`WX` 14440–14448). Occupancy unseal still prevents sealing exits.

**ACCESS_REQUIREMENTS:** All five kits are starters. 8-slot bar is the only limiter.

**WHY_IT_IS_STRONG:** Action-economy multiplier. One player turn buys extra turns of units that occupy tiles, body-block, and (when the kit can pay AP) apply real DoTs and Slow. Enemy summons are capped at 2 with a 2-turn cadence; the player is not. AP cost only slows the first dump. Blitz (`legendary_2`, under 5 turns, 450 Doka / 900 XP) is the natural payout. Combined with 3.1, multiple Archers are extra Poison stacks.

**COUNTERPLAY:** Focus the bodies. AoE (Thunder Clap / Chain Lightning / Lifesteal Nova). Lifespan expiry. Occupancy / portal-reserved cells prevent sealing exits (closed). Void Rift now ticks controlled summons.

**RELATIVE_PROGRESSION_CONTEXT:** Spell-level buys HP (+10%/level), AP (+1/3 levels), MP, and lifespan. Cheap Doka upgrades on summon ids make the flood tankier without touching the missing cap.

**PERSISTENCE/ECONOMY_IMPACT:** Pacifist (3.3) converts the flood into Doka. Summon UI advertises 10× upgrade cost; canister still charges `10 * 2^level`.

**RECOMMENDED_RESPONSE:** Player alive-cap (2–3) and a short summon-spell cooldown. Keep five identities. See `EBMA-2026-09-23-002`. Do not close ally-buff targeting as a substitute. Do not also give AI summons ticking DoTs until 001 lands (`006`). Do not “fix” 3.16 by giving Bomber 5 AP without 010. Do not assume Wisp heal is a reason to skip the cap — occupancy alone is enough.

---

### 3.3 Pacifist Run + summons / Bite / Mark / Slow / Void Collapse — **DOMINANT** (economy) — *escalated*

**COMPONENTS:** Achievement `pacifist_run` (500 Doka, “Win a battle using only heal or buff spells”, `admin.mo` 324) + any of: damage summon (Wolf / Archer) + Vampire Bite (`effectType: "heal"`, 20 damage) + Mark (`effectType: "debuff"`) + Slow / Weaken (`effectType: "debuff"`, 0 listed damage → 1 via `calcScaledDamage`) + Barrier / Mirror (`defense`) + Void Collapse (`effectType: "attract_multi"`, 80 AoE, 12 AP).

**COMBO_SEQUENCE:**

1. Equip heals/buffs plus any of Bite, Mark, Slow, Barrier, Mirror, or a summon kit.
2. Cast them. `recordPlayerSpellType` only flips on `damage|drain|aoe|dot|pushback|attract|cc|teleport`.
3. Bite deals 20 through the damage loop (`resolvePlayerCast` 876+) and records `"heal"`.
4. Slow / Weaken deal 1 through the same loop (`calcScaledDamage` 130–136) and record `"debuff"`.
5. Summons kill. Recap fires `checkAndFireAchievement("pacifist_run")` from overworld victory **and** Boss Rush room-clear (`WX` 12483–12497, 12897–12916). Claim 500 Doka.

**ACCESS_REQUIREMENTS:** Starters + backend Bite if the catalog dump is live + the feat on the canister. Preview stays off (`shouldApplyHealBuffSideEffectOnRangePreview` 83–85).

**WHY_IT_IS_STRONG:** The condition is implemented as “the player character did not resolve a listed `effectType`,” not “the player side dealt no damage / used only heal or buff.” Bite is a 20-damage spell that the feat treats as a heal. That is the opposite of the advertised intent. Boss Rush multiplies the same hole across rooms.

**COUNTERPLAY:** None. The check cannot see summon damage, Bite damage, Mark, Slow-1, or `attract_multi`.

**RELATIVE_PROGRESSION_CONTEXT:** 500 Doka is `upgradeSpell` fuel. A single legal pacifist clear funds several damage-spell levels or a summon-level spike.

**PERSISTENCE/ECONOMY_IMPACT:** Direct. `claimAchievementReward` credits the persist-lock wallet. Once per account, but the first 500 is a free spike if the player knows the hole. Repeatable per Boss Rush room until claimed.

**RECOMMENDED_RESPONSE:** Fail the feat unless every resolved **player** spell is heal, buff, Timestep, or (optionally) Mirror. Count player-side summon damage / offensive kit casts. Bite must fail it even while its heal metadata is still wrong. Include `"attract_multi"` in `offCats` (or treat any `*attract*` as offensive). Keep a true pacifist (heals + buffs + Timestep, no kits, no Bite) as a feat. Do not change the Doka amount. Do not revert the preview fix. See `EBMA-2026-09-23-003`.

---

### 3.4 No-heal challenge + drain / Wisp — **NICHE** live (drain closed; Wisp cannot heal)

**COMPONENTS:** `easy_1` (50 Doka) / `hard_1` (200 Doka + 500 XP) + Life Drain / Lifesteal Nova / Drain Courage + Wisp Blood Mend / Rallying Cry.

**LIVE SEQUENCE:** Drain heals go through `onPlayerHealed` → `recordChallengeHealFromHpRestore` when HP actually increases. Self-heal spells and BuffShop potions already flip the flag. Wisp control-cast always targets `targetEnemy`; `ctx.heal` ignores non-player ids; recorded delta is 0 even if a player id were passed.

**WHY_IT_IS_NOT_A_FARM:** The 09-02 DOMINANT drain hole is closed. Wisp is not a no-heal sustain tool; it is an advertised healer that cannot heal the player (3.16 / 015).

**RECOMMENDED_RESPONSE:** Do **not** re-open 005. Restore Wisp targeting (015) **and** record the actual HP delta (the current ref-after-setState is 0). Keep overworld Doka-to-HP from flipping the next fight. Queued PR #380 (“fail no-heal when Wisp ctx.heal restores HP”) is a no-op on live targeting; land 015 first.

---

### 3.5 Dead player-bar control kit — **UNDERPOWERED** (player bar) / **STRONG_BUT_HEALTHY** (controlled Archer)

**COMPONENTS:** Slow (`mp` −2 / 2), Frost Bolt (`mp` −1 / 1), Weaken (`dmg` 0.7 / 2), Expose / Shadow Veil (`res_sp`), Drain Courage (`ap` −1 / 1), Cursed Wound (`healRecv` 0.5), Life Drain (`sp` 0.8), Frost Nova (AoE + `mp` −1). Archer kit: Poison + Slow.

**COMBO_SEQUENCE (player bar):** Player casts any of the above through `resolvePlayerCast`. Damage (if any) applies — 0-damage Slow/Weaken still poke **1**. `debuffStat` is never written.

**COMBO_SEQUENCE (controlled Archer):** Player-controlled Archer casts Slow through `resolveSpellCast` 529–548. The MP debuff **does** land. AI Archer Slow still goes through `executeSummonAction` `applyEffect` without `stat`/`modifier` (cosmetic).

**ACCESS_REQUIREMENTS:** Starters. 8-slot opportunity cost on the bar; Archer kit is a summon slot.

**WHY_IT_IS_STRONG:** The player bar is not. The cards advertise control that the player path cannot deliver. The **intended** Slow identity currently lives only on a controlled Archer, which is interesting synergy and should be kept if 002 caps the flood.

**COUNTERPLAY:** N/A on the bar (player is the one missing the tool). Kill the Archer to remove live Slow.

**RELATIVE_PROGRESSION_CONTEXT:** Upgrading Slow / Weaken on the bar spends Doka on a missing half of the spell. The 1-damage poke also keeps Slow Pacifist-legal (3.3).

**PERSISTENCE/ECONOMY_IMPACT:** Wasted upgrade spend. Does not break the wallet.

**RECOMMENDED_RESPONSE:** Wire `debuffStat` after the player damage loop (do not skip damage). Skip the `max(1, …)` floor on advertised 0-damage debuffs so Slow is not a 1-damage Pacifist payload. Then cap stacked AP/MP denial so the restored kit cannot lock a target at 0 AP/MP forever. See `EBMA-2026-09-23-004`. This is a restore, not a nerf. Do not strip Archer Slow.

---

### 3.6 Latent enemy AP/MP denial (Bishop + Archer Slow) — **NICHE** live / **DOMINANT** if kits grow

**COMPONENTS:** Bishop Frost Bolt + enemy Archer Slow (enemy summon kit). Same-stat additives in `getStatModifier` (`statusEffects.ts` 45–63).

**COMBO_SEQUENCE (if kits were zone-correct):** Frost (−1 MP, 1 turn) + Slow (−2 MP, 2 turns) = −3 on a 4-MP player. Refresh each enemy turn.

**LIVE SEQUENCE:** `buildEnemyKit(..., currentMap.levelZone)` stays zone 0. Bishops have Frost only. Slow is not on the bishop. Multiple Frosts **replace** by `effectName`. Live denial is −1 MP for 1 turn. Enemy AI Slow from an Archer summoner is cosmetic (`summonExecutor` omits `stat`).

**ACCESS_REQUIREMENTS:** Live: any bishop pack. Latent: zone ≥ 1 kits + enemy Archer summon.

**WHY_IT_IS_STRONG (latent):** Player mobility is the positional game. −3 MP on a 4-MP pool is near-root. Different spell names stack; same name refreshes.

**COUNTERPLAY (latent):** Kill the bishop / archer; Haste (+2 MP, 1 turn); Timestep (once); Null Field (suppresses buffs/debuffs).

**RELATIVE_PROGRESSION_CONTEXT:** Zone growth is supposed to add Slow / Inferno / heals and never does.

**PERSISTENCE/ECONOMY_IMPACT:** None live.

**RECOMMENDED_RESPONSE:** Do **not** nerf Frost or Slow. Pass a numeric zone into `buildEnemyKit` so intended kits exist (`EBMA-2026-09-23-009`). If that ships, add a same-stat AP/MP stack cap on the enemy path (`004` covers both sides).

---

### 3.7 Inferno cooldown circumvention via summons — **UNDERPOWERED** live / **DOMINANT** after kit AP alignment

**COMPONENTS:** Player Inferno (CD 3, 5 AP) + Bomber kit (`summonKit: ["spell-inferno"]`, `ap: 1`) + player-controlled `resolveSpellCast`.

**LIVE SEQUENCE:** `planSummonControlCast` has no cooldown map, but Bomber AP 1 cannot pay Inferno 5 → `no_ap`. AI Bomber Inferno also fails the `damage > 0` kamikaze branch (`summonExecutor` 164–180; Inferno `damage` is 0).

**WHY_IT_WAS_FILED AS DOMINANT:** 09-02 treated missing kit CD as a live launder. The launder is real **only after** 014 gives the Bomber 5 AP (or Inferno is replaced with a 1-AP kit spell).

**RECOMMENDED_RESPONSE:** Do not nerf player Inferno. Align kit AP (014) **and** honor kit-spell `cooldown` on that unit (010). A spawned Bomber may still fire Inferno once; it must not recast every summon turn. See `EBMA-2026-09-23-010` (depends on 014).

---

### 3.8 Titan’s Vigor × Glass Realm × Sacrifice — **STRONG_BUT_HEALTHY** (monitor)

**COMPONENTS:** Map modifiers Titan’s Vigor (`+1000` HP on `applyBattleStart`; `onDamageDealt` 1–5×) + Glass Realm (×2 on the same hook) + Sacrifice (20% current `characterStats.hp` × 3).

**COMBO_SEQUENCE:**

1. Roll both modifiers (independent map rolls; not guaranteed).
2. Sacrifice reads `characterStats.hp` (Titan’s store-HP bump may not be on that object).
3. `dealDamage` → `enemyTakesDamage` → `applyDamageDealt` applies Titan roll then Glass.

**WHY_IT_IS_STRONG:** Lottery on a path that already ignores Mark/crit. Main-bar nukes (Strike, Shadow Strike, Chain Lightning) **do not** go through `enemyTakesDamage`, so they do **not** get the 1–5× / ×2. The scary packet is Sacrifice-only. Vampiric Ground is on the same hook, so it also misses the main bar.

**COUNTERPLAY:** Don’t stand next to the target (range 1). Mirror. Don’t pick Sacrifice on a Glass map.

**RELATIVE_PROGRESSION_CONTEXT:** Modifier luck, not a loadout.

**PERSISTENCE/ECONOMY_IMPACT:** None beyond a lucky one-shot.

**RECOMMENDED_RESPONSE:** Monitor. Do not nerf Sacrifice or the modifiers unless play data shows every Glass+Titan map is a skip-or-Sacrifice binary. See `EBMA-2026-09-23-008`.

---

### 3.9 Enrage + Mark + Crit + Fury / Blood Moon — **STRONG_BUT_HEALTHY**

**COMPONENTS:** Enrage (×1.4 dmg, 2 turns, 3 AP, `targetType: "ally"`) + Mark (×2 next hit, 2 AP) + CHC crit (×2) + Fury potion (×1.25, 3 turns) + Blood Moon (×1.25, map). Optional: player Enrage on an allied Wolf (`resolvePlayerCast` 676–718).

**COMBO_SEQUENCE:** Enrage → Mark tile → nuke (Shadow Strike 35 or Chain Lightning / Expose). Setup is 5 AP before the hit; 8 AP bar leaves 3 for the nuke (Shadow Strike fits). Ally-Enrage on a Wolf is a second payload on the summon’s turn.

**WHY_IT_IS_STRONG:** Multipliers compose. Shadow Strike (backend seed) is the best payload. Ally-Enrage is targeting honesty, not a new number.

**COUNTERPLAY:** RES/SR. Don’t stand on the marked tile. Kill the caster during the setup turn. Paper Windstorm miss. Mirror. Kill the Wolf.

**RECOMMENDED_RESPONSE:** Preserve. This is the intended burst identity. Do not touch Mark, Enrage, or ally-buff targeting because the product is large.

---

### 3.10 Shield + Iron Skin (+ Sentinel / ally target) — **STRONG_BUT_HEALTHY**

**COMPONENTS:** Both `buffStat: "res"`, `buffModifier: 1.3`, different `effectName` (`Shield Shield` vs `Iron Skin Shield` after the buff branch rename) → multiplicative 1.69× RES for 3 turns. Sentinel kit can apply both **if** AP ever pays Iron Skin (3.16). Player Shield/Iron Skin can land on an allied summon (`targetType: "ally"`).

**WHY_IT_IS_STRONG:** Durable, not immortal. Costs 5 AP (or a Sentinel turn). Null Field suppresses. Duration is short. Buffing a 0.5-scale Bomber is a real decision, not a loop.

**RECOMMENDED_RESPONSE:** Preserve.

---

### 3.11 Timestep + Haste + Rally — **STRONG_BUT_HEALTHY**

**COMPONENTS:** Timestep (once, restores formula AP/MP + additives) + Haste (+2 MP, 1 turn) + Rally / Blood Mend (heal + advertised CHC).

**WHY_IT_IS_STRONG:** One extra full bar per fight is a real decision, not a loop. Haste is already included in `restoreApMp` via `getStatModifier("player", "mp")`. Combined with 3.1 it is an amplifier (one extra Poison dump); the loop is still the missing DoT cap, not Timestep.

**NOTE:** Blood Mend / Rally `buffModifier: 0.15` on `chc` never reaches the crit roll (`playerSpellContext` uses raw `characterStats.chc`, `WX` 9158). The heal branch returns before any buff write. The CHC half is **UNDERPOWERED** / inert. Heal half is fine.

**RECOMMENDED_RESPONSE:** Preserve Timestep. Optionally wire CHC through `getStatModifier` as **additive percentage points** (`EBMA-2026-09-23-012`) — restore, not nerf.

---

### 3.12 Swap / Barrier / Mirror — **STRONG_BUT_HEALTHY** (Swap has a hazard hole)

**COMPONENTS:** Swap (3 AP), Barrier (3 AP, 3-turn tile; copy says 2), Mirror (4 AP, next single-target reflect; `activatePlayerMirror` is wired).

**WHY_IT_IS_STRONG:** Positional and reactive. Swap onto lava/ice/rift does **not** run walk hazards (MIMA-2026-08-31-001). That is a challenge-integrity hole (Untouchable) more than a damage loop.

**RECOMMENDED_RESPONSE:** Do not nerf Swap. Hazard landing belongs to the MIMA ticket, not a damage nerf. Pacifist-legal Barrier/Mirror is owned by 003, not a Swap nerf.

---

### 3.13 Backend catalog + 8-slot bar — **NICHE** (discovery still inert)

There is no achievement-spell or enemy-discovery combination on the live path. The only extra combo space from the canister is Shadow Strike / Thunder Clap / late Void Collapse sitting next to starters, plus inert Bite / Soul Rend / Reflect. That is a **catalog dump**, not a discovery reward.

**RECOMMENDED_RESPONSE:** Do not invent unlocks in this PR. Point implementers at existing `SDA-2026-08-31-002` … `004` / `SDE-2026-08-31-001` … `003`. See `EBMA-2026-09-23-007`. Restore Bite / Soul Rend / Reflect metadata so the dump is at least honest (`EBMA-2026-09-23-013`).

---

### 3.14 Late-game enemy summoner density — **STRONG_BUT_HEALTHY**

**COMPONENTS:** `ENEMY_SUMMONER_CHANCE_BASE + level * 0.02` per enemy + Wolf/Archer kits + `ENEMY_SUMMON_CAP = 2`.

**WHY_IT_IS_STRONG:** By level 44 every trash mob is a summoner. The cap and 2-turn cadence keep this from flooding. Comment in `gameConstants.ts` 295–297 still says “~12% of packs.” AI enemy summons still do not tick DoTs.

**RECOMMENDED_RESPONSE:** Retarget the roll to pack-level / zone if the board feels noisy. Not a P0. See `EBMA-2026-09-23-011`.

---

### 3.15 Ally-buff summons (Enrage / Shield / Haste on kits) — **STRONG_BUT_HEALTHY** (preserve)

**COMPONENTS:** `resolvePlayerCast` ally branch (676–718) + Enrage / Shield / Iron Skin / Haste + any player-side summon.

**WHY_IT_IS_STRONG:** The spells already said “ally.” Landing them on a Wolf or Sentinel is the identity working. 1.4× Wolf damage and 1.69× Sentinel RES are large but duration-gated and Null-Field-vulnerable.

**RECOMMENDED_RESPONSE:** Preserve. Do not close ally targeting to “fix” 3.2. Cap the flood instead.

---

### 3.16 Kit AP mismatch + Wisp targeting — **UNDERPOWERED**

**COMPONENTS:** `getSummonBaseStats` AP (`unitDef.ap` + `floor(spellLevel/3)`) vs kit `apCost`. Wisp Blood Mend / Rally (`targetType: "self"`, heal) vs control-cast always `targetEnemy`.

**LIVE SEQUENCE:**

| Kit | Spell level 0 AP | Kit spell cost | Fires? |
| :--- | :--- | :--- | :--- |
| Archer Poison | 2 | 2 | Yes — and ticks |
| Archer Slow | 2 | 2 | Yes — `debuffStat` lands |
| Wolf Strike | 2 | 2 | Yes |
| Wolf Venom | 2 | 3 | No until spell level 3 |
| Sentinel Shield | 2 | 2 | Yes |
| Sentinel Iron Skin | 2 | 3 | No until spell level 3 |
| Bomber Inferno | 1 | 5 | Never at reasonable levels (`floor(slvl/3)` needs slvl 12 for 5 AP) |
| Wisp Blood Mend | 2 | 3 | No AP **and** wrong target |
| Wisp Rally | 2 | 4 | No AP **and** wrong target |

Even with AP, `resolveSpellCast` heal writes `ctx.heal(target.id)` and control-cast’s target is an enemy; `ctx.heal` then no-ops non-player ids. Wisp cannot heal the summoner.

**WHY_IT_IS_STRONG:** It is not. Four of five kits advertise a second identity that Day-1 AP cannot pay. Wisp’s advertised job (heal the player) is unreachable.

**RECOMMENDED_RESPONSE:** Set spawn AP to at least the cheapest advertised kit spell (014). Let Wisp target the player / allied summon (015). Record the actual HP restored for no-heal. Do **not** give Bomber 5 AP without 010. Do not restore AI DoT ticks before 001.

---

### 3.17 `hard_3` vs an 8-AP bar — **DOMINANT** (early-game challenge economy) — *new this pass*

**COMPONENTS:** Challenge `hard_3` (“Never spend more than 8 AP in any single turn”, 150 Doka + 450 XP, `challengeCompletion.ts` 80–86, 126–127) + `getPlayerBaseStats` AP `8 + floor(level / 25)` (`progression.ts` 59–72) + accept-gated random offer (`WX` 12210–12218, 1/9 of `DEFAULT_CHALLENGES`).

**COMBO_SEQUENCE:**

1. Battle starts. One of nine challenges is rolled. Player accepts `hard_3` when offered.
2. Until level 25, `currentBattleAp` is 8. `recordChallengeApSpend` cannot record a peak above 8 because there is no 9th AP to spend. Timestep restores the same 8; it does not raise the peak within a turn.
3. Arcane Surge / Overflow **reduce** costs (more casts per 8) and still keep spend ≤ 8.
4. Win. `isChallengeCompleted` is true. `applyRewards` credits 150 Doka + 450 XP on top of kill rewards.
5. XP curve is `100 * 2^(N-1)` (`xpCurve.ts`). 450 XP at level 1 is two full level-ups (100 + 200) plus 150 leftover toward 400.

**ACCESS_REQUIREMENTS:** Always offered as 1/9 of the random pool. Must accept. No spell unlock. Legal with any 8-slot bar, including the 3.1 Poison dump.

**WHY_IT_IS_STRONG:** The predicate is an absolute 8, not “leave AP on the table.” For 24 levels it measures nothing. Combined with 3.1 it also pays the unbounded DoT player for dumping the full bar. This invalidates `hard_3` as a skill check and injects challenge-tier XP into the earliest `applyRewards` steps.

**COUNTERPLAY:** Decline the challenge. That is not counterplay; it is leaving free XP on the table.

**RELATIVE_PROGRESSION_CONTEXT:** Becomes a real constraint at level 25 (AP 9) and grows slowly (+1 AP every 25 levels). The broken window is the entire early/mid catalog.

**PERSISTENCE/ECONOMY_IMPACT:** Direct `applyRewards` credit. Expected value if the player always accepts when offered: `(1/9) * 450 ≈ 50 XP` and ~17 Doka **per fight** on top of kills — with zero AP discipline. Not infinite, but it destroys the advertised “play cheap” identity until AP grows.

**RECOMMENDED_RESPONSE:** Relativize the cap to the live battle AP bar (e.g. never spend more than `max(1, currentMaxAp - 1)` or 75% of the bar). Keep 150 Doka / 450 XP. Keep the “play cheap” identity. Do **not** change Poison costs here (001 owns the integral). Do not fail the challenge for spending leftover AP if that spend is still under the relative cap. See `EBMA-2026-09-23-016`.

---

### 3.18 Mending Mist / Swift Winds on the player — **UNDERPOWERED** (inert) / queued combo risk

**COMPONENTS:** `mending_mist` (5% max HP / turn) + `swift_winds` (+2 MP / turn) + `playerTurnStartModifierTarget` (`battleSetup.ts` 364–368) + `WX` 14262–14274.

**LIVE SEQUENCE:** Player is not in `combatantsRef`. The lookup returns `undefined`. Player character gets neither regen nor bonus MP. Player-side summons on their turn **do** receive `applyTurnStart` (mist can heal a Wolf). Queued PR #443 adds `resolvePlayerTurnStartModifierVitals` but explicitly does **not** wire `WorldExploration`.

**RECOMMENDED_RESPONSE:** Owned by MIMA-2026-09-21-001. This analyzer only constrains the combo: if/when player mist HP lands, record it with `recordChallengeHealFromHpRestore` so no-heal / `hard_1` stay honest. Do not treat mist as a live immortality loop. Do not issue a duplicate restore ID.

---

## 4. Classification board (player-accessible)

| Package | Class | Intervene? |
| :--- | :--- | :--- |
| Poison recast / Poison+Venom+Inferno (+ Arcane Surge) (+ Archer) (+ `hard_3`) | BROKEN | Yes — cap / refresh (001) |
| Player summon flood (5 kits, no cap/CD) | DOMINANT | Yes — cap + kit CD (002) |
| Pacifist + summon / Bite / Mark / Slow-1 / `attract_multi` | DOMINANT | Yes — advertised categories (003) |
| `hard_3` while bar == 8 (levels 1–24) | DOMINANT | Yes — relative cap (016) |
| No-heal + drain / Wisp | NICHE (closed farm) | No for 005. Restore Wisp via 015 |
| Inferno via Bomber | UNDERPOWERED live | Kit CD after AP align (010 after 014) |
| Shadow Strike + Mark + Enrage | STRONG_BUT_HEALTHY | No |
| Shield + Iron Skin (+ Sentinel / ally) | STRONG_BUT_HEALTHY | No |
| Ally Enrage / Haste on kits | STRONG_BUT_HEALTHY | No |
| Timestep (once) | STRONG_BUT_HEALTHY | No |
| Sacrifice + Titan + Glass | STRONG_BUT_HEALTHY | Monitor (008) |
| Thunder Clap / Chain Lightning | STRONG_BUT_HEALTHY | No |
| Swap / Barrier / Mirror | STRONG_BUT_HEALTHY | Hazard landing is MIMA, not EBMA |
| Enemy summoner density (capped 2) | STRONG_BUT_HEALTHY | Soft formula fix (011) |
| Controlled Archer Slow | STRONG_BUT_HEALTHY | Restore the bar; keep the kit |
| Bishop Frost only (zone 0) | NICHE | Restore zone number (009) |
| Void Collapse (12 AP) | NICHE | Don’t enforce `minLevel` as a surprise nerf; fold `attract_multi` into 003 |
| Player Slow/Weaken/Expose/Frost/Courage | UNDERPOWERED | Restore `debuffStat` (004) |
| Soul Rend / Vampire Bite heal / Reflect Barrier | UNDERPOWERED | Metadata (013) |
| Blood Mend / Rally CHC half | UNDERPOWERED | Wire `chc` (012) |
| Kit AP mismatch / Wisp targeting | UNDERPOWERED | 014 + 015 |
| AI summon DoTs / AI Bomber kamikaze / AI Slow | UNDERPOWERED | Only after DoT cap (006) |
| Mending Mist on player | UNDERPOWERED (inert) | MIMA-2026-09-21-001; record no-heal if wired |

---

## 5. What not to touch

- RAF loop, map generation, turn order, damage formula (`calcScaledDamage` 3%/level).
- Mark, Enrage, Timestep-once, Mirror, Barrier geometry, Swap’s teleport identity, ally-buff targeting.
- 3% upgrade curve. Economy bugs around summon advertised cost vs canister debit are already owned by persist work.
- Inventing observe-to-unlock in this automation. That is SDA / SDE.
- Reverting the Pacifist preview fix.
- GameKey shop numbers (out of combat-combo scope).
- Occupancy dual-path unseal / Void Rift summon tick (closed correctly).
- Drain no-heal recording (closed). Do not re-open because Wisp still cannot heal.
- Sacrifice Untouchable recording (closed).
- Player Inferno numbers / Attack Nearest CD (closed).
- Flattening Poison + Venom + Inferno into one DoT type.

---

## 6. Prior ACTION_ID disposition

| Prior | 2026-09-23 | Notes |
| :--- | :--- | :--- |
| 09-02 / 09-21 / 09-22 001 DoT cap | Reissued as 001 | Still true; 016 is a separate economy rail |
| 09-22 002 Summon cap + CD | Reissued as 002 | AP still charged; cap/CD still missing |
| 09-22 003 Pacifist | Reissued as 003 | Bite/Mark/Slow-1/summon/`attract_multi`; Boss Rush fire stays |
| 09-22 004 Player debuff + stack cap | Reissued as 004 | Bar still dead; skip 1-floor on 0-damage debuffs |
| 09-02 005 Challenge drain | **Stays closed** | Do not reissue |
| 09-22 006 AI DoT ppt | Reissued as 006 | Still gated on 001 |
| 09-22 007 Catalog ≠ ownership | Reissued as 007 | Still inert; point at SDA/SDE |
| 09-22 008 Titan × Glass | Reissued as 008 | Still Sacrifice-only hook |
| 09-22 009 Numeric zone | Reissued as 009 | Call site still passes the object |
| 09-22 010 Kit cooldown | Reissued as 010 | After 014; not a live Day-1 launder |
| 09-22 011 Enemy summoner chance | Reissued as 011 | Still per-enemy × player level |
| 09-22 012 CHC buff restore | Reissued as 012 | `chc` still raw; heal branch never writes it |
| 09-22 013 Bite / Soul Rend / Reflect | Reissued as 013 | Metadata still wrong |
| 09-22 014 Kit AP alignment | Reissued as 014 | Pair Bomber with 010 |
| 09-22 015 Wisp targeting + amount | Reissued as 015 | Still cannot target/heal the player |
| — | **New 016** | Relative `hard_3` cap vs live AP bar |

Unmerged prior reports (do not treat as `main`): draft PR #365 (09-21), open PR #414 (09-22). This file does not overwrite those paths.

---

## 7. Search checklist (this pass)

| Pattern | Result |
| :--- | :--- |
| Excessive damage/AP combinations | 3.1 DoT recast; 3.9 burst (healthy) |
| Infinite / near-infinite loops | DoT append has no cap; summon recast limited only by AP + lifespan |
| Permanent control | Player-bar denial dead; latent after 009 |
| AP/MP denial chains | Latent 3.6; live Archer Slow is kit identity |
| Summon abuse | 3.2 flood; 3.7 Inferno launder latent until 014 |
| Cooldown circumvention | Attack Nearest Inferno **closed**; Bomber kit cannot pay 5 AP |
| Healing loops | Drain no-heal **closed**; Wisp cannot target player; Bite heal inert |
| Defensive immortality | Shield+Iron Skin duration-gated (healthy) |
| Status stacking | DoT append BROKEN; non-DoT replace-by-name |
| Displacement loops | Swap identity healthy; hazard landing is MIMA |
| Hazard combinations | Swap × lava is MIMA, not EBMA |
| Achievement-spell combinations | No spell grants. Pacifist is an achievement × existing kit combo |
| Enemy-discovery spell combinations | Discovery inert. Catalog dump is not discovery |
| Challenge × progression | **New:** `hard_3` auto-complete while AP bar is 8 (3.17) |

---

## 8. Queued PRs (not live; do not classify as current meta)

Older still-open PRs merge first. None of these are on `0f5363f`:

| PR | Relevance |
| :--- | :--- |
| #414 | Prior EBMA docs (09-22). Same HEAD. This pass adds dated 09-23 files only. |
| #365 | Draft 09-21 EBMA docs. Unmerged. |
| #443 | MIMA player turn-start vitals **helper**. WX not wired. If a later PR applies mist HP, pair with no-heal recording. |
| #380 | Fail no-heal when Wisp `ctx.heal` restores HP. Dead on live targeting until 015. |
| #440 | Life Drain vs live player HP. Drain no-heal already closed; this is a heal-identity restore, not a new farm. |
| #432 / #417 / #379 | Summon execute range / walk MP parity. Does not add a cap or kit CD. |

Do not implement those wires from this automation.
