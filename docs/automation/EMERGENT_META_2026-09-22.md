# Emergent Build & Meta Analysis — 2026-09-22

**Analyzer:** Emergent Build & Meta Analyzer  
**Automation:** `7b2f2b58-a49e-11f1-a7d1-d6b4613131ce` (cron `0 */72 * * *`)  
**HEAD:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Prior pass:** 2026-09-21 (`EMERGENT_META_2026-09-21.md` lives only on open draft PR #365; not on `main`). Last merged pass on `main` is 2026-09-02 (`EMERGENT_META_2026-09-02.md`; ACTION_IDs `EBMA-2026-09-02-001` … `013`).  
**Gameplay code:** not modified. Balance was not changed.

This is a combination audit. Individual rows can look fair while two or three of them delete the rest of the kit.

Intervention is recommended only when a strategy:

- invalidates alternatives
- removes counterplay
- produces infinite / degenerate loops
- destroys progression or economy

Strong interesting synergy is left alone.

ACTION_IDs: [`ACTION_IDS_EBMA_2026-09-22.md`](./ACTION_IDS_EBMA_2026-09-22.md).

Prior IDs were **not implemented** except where a cited gate actually moved. Escalate only those. Do not re-open closed gates.

---

## 0. What changed since 2026-09-21 / 2026-09-02

`origin/main` is still `0f5363f`. No combat merge landed between the 2026-09-21 analyzer pass and this cron. The 09-21 docs were never merged (PR #365 remains a draft). This pass re-reads the same HEAD with current line numbers and two extra execute-path facts the 09-21 file under-weighted.

Combat-relevant merges on `58302bc` (09-02) → `0f5363f` that still define the live meta (spell mechanics #282, discovery design #300, combat parity #304/#314/#326, economy #315, critical defects #319, Boss Rush feats `451d2ed`, drain no-heal `9f36239`):

| Gate | 2026-09-02 | 2026-09-22 (same as 09-21 unless noted) | Meta effect |
| :--- | :--- | :--- | :--- |
| Drain × no-heal | `drainPercent` never touched `healUsed` | `recordChallengeHealFromHpRestore` (`challengeCompletion.ts` 250–259); `onPlayerHealed` (`WX` 9502–9507; `castHelpers.ts`) | **Closed.** Do not re-open. |
| Wisp / ctx.heal × no-heal | summon `heal` skipped the flag | Helper is **called** (`WX` 9185–9196, 15005–15016) but (1) player-controlled casts always pass `targetEnemy` (`WX` 9849–9869), (2) `ctx.heal` writes HP only for `"player"` / `"__player__"`, (3) the recorded delta is `characterStatsRef.hp` immediately after `setCharacterStats`, whose ref write lives **inside** the React updater (`WX` 3261–3270) so the delta is 0. **New this pass:** Wisp cannot heal the player at any spell level. Not a live no-heal farm. See 3.4 / 3.16 / 015. |
| BuffShop potions × no-heal | Closed | Still closed | Do not re-open. |
| Pacifist preview | Closed | Still closed (`targeting.ts` 83–85) | Do not re-open. |
| Pacifist execute | `recordPlayerSpellType` only | Unchanged (`WX` 17015–17033). **New fold:** Void Collapse records `"attract_multi"`; `offCats` lists `"attract"` — 80 AoE would stay legal if the 12 AP bar ever exists (~level 100). |
| Pacifist 0-damage debuffs | Not named in 09-02 | `calcScaledDamage` floors 0 to 1 (`combatMath.ts` 130–136). Slow / Weaken poke 1 without flipping the feat | Extra 003 evidence. |
| Sacrifice × Untouchable | Self-HP skipped `playerTakesDamage` | `recordChallengeSelfHpLoss` (`WX` 9374–9386) | Do not re-open. |
| Player summon AP | Charged | Still charged (`castResultSpendsAp` includes `"summon"`, `challengeCompletion.ts` 330–331) | Unchanged. |
| Attack Nearest Inferno CD | Closed on the player bar | Still closed | Unchanged. |
| Inferno via Bomber | Filed as DOMINANT CD launder | Bomber 1 AP vs Inferno 5. Live `no_ap`. **Mis-classified in 09-02.** |
| DoT append | no cap | unchanged (`appendDotStack` 31–37) | Still BROKEN. |
| Player `debuffStat` | damage loop never applied it | unchanged (`resolvePlayerCast` 876–1028) | Player-bar control kit still dead. Controlled Archer Slow still live (`resolveSpellCast` 529–548). |
| Catalog = ownership | `usableByPlayer !== false` dumps the library | unchanged (`adminSafety.ts` 712–719; `WX` 2412–2440) | Discovery still inert. #300 did not ship observe→unlock. |
| Enemy kit zone | object → NaN → zone 0 | unchanged (`WX` 11920 + `buildEnemyKit` 194–199) | Still latent. |
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

Still unimplemented from 2026-09-02 / 09-21: DoT cap, player summon cap/CD, pacifist advertised categories, player `debuffStat` wire, AI DoT `dotDamagePerTurn`, catalog≠ownership, Titan monitor, numeric zone, kit-spell CD (gated on AP alignment), summoner-chance retarget, CHC restore, Bite / Soul Rend / Reflect metadata, kit AP vs kit cost. **New:** Wisp heal targeting (015).

---

## 1. Access model (what a player can actually bring)

There is still no observe → win → unlock path. “Discovered enemy spells” and “achievement/challenge spells” remain design docs (`SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md`, `SPELL_ADMIN_DESIGN_2026-09-02.md`), not live systems. PR #300 merged design, not a persist `ownedSpellIds` map.

| Source | What enters the library | Spell grant? |
| :--- | :--- | :--- |
| `starterSpells` | All starter ids forced `isBaseSpell: true` (`WX` 2395–2408) | Always owned |
| `getSpellConfigs()` | Every `usableByPlayer !== false` id not in `OLD_SPELL_NAMES_SET` (`adminSafety.ts` 712–719; `WX` 2356–2440) | Catalog membership **is** ownership |
| Achievements | Doka only (`admin.mo` `defaultAchievements` 309–325) | No |
| Challenges | Doka / XP / badge (`challengeCompletion.ts` 38–108) | No |
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
| Summon-AI DoT | `summonExecutor.ts` 191–203 | `applyEffect` without `dotDamagePerTurn` or `stat`/`modifier` |
| Player-controlled summon DoT | `WX` `castControlledSummonSpell` → `resolveSpellCast` | Ticks (Archer Poison) |
| Live summon AI | `decideSummonAction` + `executeSummonAction` | Player-side is control-mode (`WX` 14418–14421). `engine/summonAI.ts` `runSummonAI` is unused |
| Timestep | `spellEngine.ts` 721–733 | Once per battle; 0 AP; restores formula AP/MP + active AP/MP additives |
| Sacrifice | `spellEngine.ts` 749–763 | 20% `characterStats.hp` → 3× via `dealDamage` → `enemyTakesDamage`. Challenge self-HP **is** recorded |
| Upgrade damage | `combatMath.ts` `calcScaledDamage` 130–136 | `max(1, floor(base * 1.03^level))`. Does **not** scale `dotDamagePerTurn` literals. Floors 0-damage to 1 |
| Battle AP | `progression.ts` `getPlayerBaseStats` 59–72; `PLAYER_BASE_AP = 8` | Floor 8; +1 every `apMpGrowthEveryNLevels` (default 25) |
| Enemy kit zone | `WX` 11920 + `buildEnemyKit` 194–199 | `currentMap.levelZone` is an object. `Math.floor(object)` is `NaN`. Every kit stays zone 0 |
| Enemy summoner roll | `WX` 11932–11942 | `0.12 + playerLevel * 0.02` **per enemy**. 100% at level 44+. Global alive cap still 2 |
| Null Field | `mapModifiers.ts` | Suppresses buff/debuff only. DoTs still apply |
| `minLevel` | `resolvePlayerCast` | Not enforced |
| CHC buff | `WX` playerSpellContext; heal branch 654–673 | Crit uses raw `characterStats.chc`. Blood Mend / Rally heal branch never writes the `chc` effect |
| Mending Mist | `playerTurnStartModifierTarget` (`battleSetup.ts` 364–368) | Looks up `id === "player"` in `combatantsRef`. Player is not in that list. Inert on the character |

---

## 3. Combination reports

### 3.1 Unbounded player DoT recast — **BROKEN**

**COMPONENTS:** Poison Arrow (2 AP, 4/turn, 3 turns, no CD) + Venom Strike (3 AP, 4/turn, 3 turns, no CD) + Inferno (5 AP, 8/turn, 3 turns, CD 3). Optional: Arcane Surge / Arcane Overflow (−1 AP, min 1). Optional: player-controlled Archer (`resolveSpellCast` Poison, 2 AP vs 2 AP — this kit **does** fire). Optional: `hard_3` (max AP used ≤ 8).

**COMBO_SEQUENCE:**

1. Equip Poison + Venom + Inferno (and optionally an Archer).
2. Each player turn: dump leftover AP into Poison recasts (4 stacks at 8 AP; 8 stacks under Arcane Surge).
3. Mix Venom / Inferno when the extra tick is worth the AP.
4. Stacks append (`appendDotStack`). They do not refresh. A 10-turn boss fight is a damage integral, not a 4+4+8 ceiling.
5. Each controlled Archer turn adds another Poison stack (2 AP, no CD).
6. `hard_3` accepts `maxApUsedInTurn <= 8` (`challengeCompletion.ts` 126–127). A full 8-AP Poison dump is legal for 150 Doka + 450 XP.

**ACCESS_REQUIREMENTS:** Starter library. Arcane Surge is a map-modifier roll, not an unlock. Archer is a starter summon.

**WHY_IT_IS_STRONG:** Cost-to-stack is linear; duration is independent; there is no same-source cap. Long fights (boss, dungeon chain, boss rush) make the last recast strictly better than a front-loaded nuke. Inferno’s CD only gates the 8-tick, not Poison. Null Field does not suppress DoTs. Upgrade 3%/level never touches the 4-tick literal, so stack count is the real scaling.

**COUNTERPLAY:** Kill faster than the integral. RES reduces each tick once (summed). Enemy kits are stuck at zone 0, so they rarely apply cleanse or pressure that forces the player off the recast.

**RELATIVE_PROGRESSION_CONTEXT:** Available at level 1. Late-game the **stack count** is the scaling, not the upgrade curve.

**PERSISTENCE/ECONOMY_IMPACT:** Faster clears → more `applyRewards` XP/Doka. Soft-destroys “spend Doka on spell levels” for damage spells because recast beats 3%/level on a 4-tick. `hard_3` converts the same dump into a challenge payout.

**RECOMMENDED_RESPONSE:** Same-source refresh or a small per-target / per-name cap. Keep Poison + Venom + Inferno as three different types that can coexist. Do not flatten DoT identity. Do not nerf Timestep because it amplifies one extra dump. See `EBMA-2026-09-22-001`.

---

### 3.2 Player summon flood — **DOMINANT**

**COMPONENTS:** Dire Wolf (3 AP spawn) + Archer (3) + Sentinel (3) + Bomber (2) + Wisp (2). No alive-cap. No summon-spell cooldown. Lifespan = formula base + `floor(spellLevel / 2)` (`getSummonBaseStats` 239–242).

**COMBO_SEQUENCE:**

1. Turn 1 at 8 AP: Wolf + Archer + Wisp, or Wolf + two Wisps, or four Bombers.
2. Each summon gets its own turn (`type: "summon"`), own AP/MP budget, and (if player-controlled) a kit that goes through `resolveSpellCast` — Archer Poison **ticks** and Archer Slow **lands**. Wisp / Bomber kits do **not** fire at spell level 0 (3.16).
3. Next player turn: spawn again. Nothing evicts the previous wave except lifespan.

**ACCESS_REQUIREMENTS:** All five kits are starters. 8-slot bar is the only limiter.

**WHY_IT_IS_STRONG:** Action-economy multiplier. One player turn buys extra turns of units that occupy tiles, body-block, and (when the kit can pay AP) apply real DoTs and Slow. Enemy summons are capped at 2 with a 2-turn cadence; the player is not. AP cost only slows the first dump. Blitz (`legendary_2`, under 5 turns, 450 Doka / 900 XP) is the natural payout. Combined with 3.1, multiple Archers are extra Poison stacks.

**COUNTERPLAY:** Focus the bodies. AoE (Thunder Clap / Chain Lightning / Lifesteal Nova). Lifespan expiry. Occupancy / portal-reserved cells prevent sealing exits (closed). Void Rift now ticks controlled summons.

**RELATIVE_PROGRESSION_CONTEXT:** Spell-level buys HP (+10%/level), AP (+1/3 levels), MP, and lifespan. Cheap Doka upgrades on summon ids make the flood tankier without touching the missing cap.

**PERSISTENCE/ECONOMY_IMPACT:** Pacifist (3.3) converts the flood into Doka. Summon UI advertises 10× upgrade cost; canister still charges `10 * 2^level`.

**RECOMMENDED_RESPONSE:** Player alive-cap (2–3) and a short summon-spell cooldown. Keep five identities. See `EBMA-2026-09-22-002`. Do not close ally-buff targeting as a substitute. Do not also give AI summons ticking DoTs until 001 lands (`006`). Do not “fix” 3.16 by giving Bomber 5 AP without 010. Do not assume Wisp heal is a reason to skip the cap — occupancy alone is enough.

---

### 3.3 Pacifist Run + summons / Bite / Mark / Slow / Void Collapse — **DOMINANT** (economy) — *escalated*

**COMPONENTS:** Achievement `pacifist_run` (500 Doka, “Win a battle using only heal or buff spells”, `admin.mo` 324) + any of: damage summon (Wolf / Archer) + Vampire Bite (`effectType: "heal"`, 20 damage) + Mark (`effectType: "debuff"`) + Slow / Weaken (`effectType: "debuff"`, 0 listed damage → 1 via `calcScaledDamage`) + Barrier / Mirror (`defense`) + Void Collapse (`effectType: "attract_multi"`, 80 AoE, 12 AP).

**COMBO_SEQUENCE:**

1. Equip heals/buffs plus any of Bite, Mark, Slow, Barrier, Mirror, or a summon kit.
2. Cast them. `recordPlayerSpellType` only flips on `damage|drain|aoe|dot|pushback|attract|cc|teleport`.
3. Bite deals 20 through the damage loop (`resolvePlayerCast` 876+) and records `"heal"`.
4. Slow / Weaken deal 1 through the same loop (`calcScaledDamage` 130–136) and record `"debuff"`.
5. Summons kill. Recap fires `checkAndFireAchievement("pacifist_run")` from `clientTrustedVictoryAchievementConditions` (`victoryAchievements.ts` 37).
6. Boss Rush room-clear runs the same helper (`WX` 12897–12916).
7. **Latent late-game:** Void Collapse records `"attract_multi"` (not `"attract"` / `"aoe"`). Uncastable until battle AP is 12 (~level 100). Do not wait until then to fix the matcher.

**ACCESS_REQUIREMENTS:** Starters + backend Bite if the catalog dump is live + the feat on the canister. Preview must stay off.

**WHY_IT_IS_STRONG:** The condition is implemented as “the player character did not resolve a listed `effectType`,” not “the player side dealt no damage / used only heal or buff.” Bite is a 20-damage spell the feat treats as a heal. That is the opposite of the advertised intent. Boss Rush made the hole reachable on a scripted room, not only on a random overworld pack.

**COUNTERPLAY:** None. The check cannot see summon damage, Bite damage, Mark / Slow, or (later) Void Collapse.

**RELATIVE_PROGRESSION_CONTEXT:** 500 Doka is `upgradeSpell` fuel. Once per account, but the first 500 is a free spike if the player knows the hole. Room-clear is the easiest first-win.

**PERSISTENCE/ECONOMY_IMPACT:** Direct. `claimAchievementReward` credits the persist-lock wallet.

**RECOMMENDED_RESPONSE:** Fail the feat unless every resolved **player** spell is heal, buff, Timestep, or (optionally) Mirror. Count player-side summon damage / offensive kit casts. Vampire Bite must fail it even while its heal metadata is still wrong. Treat `"attract_multi"` as `"attract"` (or record `"aoe"`). Skip the damage loop (or skip the 1-floor) for 0-base-damage debuffs so Slow is not a Pacifist poke — that is honesty, not a Slow nerf. Keep a true pacifist (heals + buffs + Timestep, no kits, no Bite) as a feat. Do not change the Doka amount. Do not revert the preview fix. See `EBMA-2026-09-22-003`.

---

### 3.4 No-heal challenge + drain / Wisp — **CLOSED** (drain) / **UNDERPOWERED** (Wisp identity, not a farm)

**COMPONENTS:** `easy_1` / `hard_1` + Life Drain / Lifesteal Nova / Drain Courage + Wisp Blood Mend.

**LIVE SEQUENCE:** Drain that actually increases HP sets `healUsed` (`onPlayerHealed` with the amount). Player self-heal spells still set it (`WX` 17190–17196). Potions still set it. Overworld Doka-to-HP still excluded.

Wisp is **not** a live no-heal sustain tool:

1. Starter Wisp has 2 AP; Blood Mend costs 3 / Rally 4 (`no_ap` until spell level 3).
2. Player-side summons are control-mode (`WX` 14418–14421), not `decideSummonHealer`.
3. `castControlledSummonSpell` always resolves against `targetEnemy` (`WX` 9860–9869). The player is not in `combatantsRef`, so the Wisp cannot click the character.
4. `resolveSpellCast` heals `target.id` (`spellEngine.ts` 551–557). That is the enemy (or nothing).
5. `ctx.heal` writes character HP only for `"player"` / `"__player__"` (`WX` 9185–9186). Enemy / summon ids are no-ops.
6. Unused `runSummonAI` (`summonAI.ts` 415–418) would `ctx.heal(owner.id, …)` — that path is not live.

**WHY_IT_WAS_STRONG:** The predicate used to measure a narrow metadata pair, not “HP went up from a spell.” Drain was that hole. It is closed.

**RECOMMENDED_RESPONSE:** Do **not** re-open drain. Do not treat Wisp as a live no-heal farm. When 014/015 restore Wisp identity, pass the **clamped heal amount** into `recordChallengeHealFromHpRestore` (do not subtract a stale ref). Sibling open PR #380 is in this neighborhood; union, do not duplicate. Prefer 015 over reissuing closed 005.

---

### 3.5 Dead player-bar control kit — **UNDERPOWERED** (player bar) / **STRONG_BUT_HEALTHY** (controlled Archer)

**COMPONENTS:** Slow (`mp` −2 / 2), Frost Bolt (`mp` −1 / 1), Frost Nova (AoE 15 + advertised −1 MP), Weaken (`dmg` 0.7 / 2), Expose / Shadow Veil (`res_sp`), Drain Courage (`ap` −1 / 1), Cursed Wound (`healRecv` 0.5), Life Drain (`sp` 0.8). Archer kit: Poison + Slow.

**COMBO_SEQUENCE (player bar):** Player casts any of the above through `resolvePlayerCast`. Damage applies (including the 1-floor on 0-damage Slow / Weaken). `debuffStat` is never written.

**COMBO_SEQUENCE (controlled Archer):** Player-controlled Archer casts Slow through `resolveSpellCast` 529–548. The MP debuff **does** land. AI Archer Slow still goes through `executeSummonAction` `applyEffect` without `stat`/`modifier` (cosmetic).

**ACCESS_REQUIREMENTS:** Starters. 8-slot opportunity cost on the bar; Archer kit is a summon slot.

**WHY_IT_IS_STRONG:** The player bar is not. The cards advertise control that the player path cannot deliver. The **intended** Slow identity currently lives only on a controlled Archer, which is interesting synergy and should be kept if 002 caps the flood.

**COUNTERPLAY:** N/A on the bar (player is the one missing the tool). Kill the Archer to remove live Slow.

**RELATIVE_PROGRESSION_CONTEXT:** Upgrading Slow / Weaken on the bar spends Doka on a missing half of the spell.

**PERSISTENCE/ECONOMY_IMPACT:** Wasted upgrade spend. Does not break the wallet.

**RECOMMENDED_RESPONSE:** Wire `debuffStat` after the player damage loop (do not skip damage on Frost / Expose). Skip or allow-0 the damage floor for pure 0-damage debuffs. Then cap stacked AP/MP denial so the restored kit cannot lock a target at 0 AP/MP forever. See `EBMA-2026-09-22-004`. This is a restore, not a nerf. Do not strip Archer Slow.

---

### 3.6 Latent enemy AP/MP denial (Bishop + Archer Slow) — **NICHE** live / **DOMINANT** if kits grow

**COMPONENTS:** Bishop Frost Bolt + enemy Archer Slow (enemy summon kit). Same-stat additives in `getStatModifier` (`statusEffects.ts` 45–63). Frozen Terrain 2× walk MP is independent map tax (`MAP_MODIFIER_MP_COST_MULTIPLIER`).

**COMBO_SEQUENCE (if kits were zone-correct):** Frost (−1 MP, 1 turn) + Slow (−2 MP, 2 turns) = −3 on a 4-MP player. Refresh each enemy turn. Frozen makes a 2-tile step cost 4.

**LIVE SEQUENCE:** `buildEnemyKit(..., currentMap.levelZone)` stays zone 0. Bishops have Frost only. Slow is not on the bishop. Multiple Frosts **replace** by `effectName`. Live denial is −1 MP for 1 turn. Enemy AI Slow from an Archer summoner is cosmetic (`summonExecutor` omits `stat`). Frozen Terrain is a healthy positional tax, not a spell combo.

**ACCESS_REQUIREMENTS:** Live: any bishop pack. Latent: zone ≥ 1 kits + enemy Archer summon.

**WHY_IT_IS_STRONG (latent):** Player mobility is the positional game. −3 MP on a 4-MP pool is near-root. Different spell names stack; same name refreshes.

**COUNTERPLAY (latent):** Kill the bishop / archer; Haste (+2 MP, 1 turn); Timestep (once); Null Field (suppresses buffs/debuffs).

**RELATIVE_PROGRESSION_CONTEXT:** Zone growth is supposed to add Slow / Inferno / heals and never does.

**PERSISTENCE/ECONOMY_IMPACT:** None live.

**RECOMMENDED_RESPONSE:** Do **not** nerf Frost or Slow. Pass a numeric zone into `buildEnemyKit` so intended kits exist (`EBMA-2026-09-22-009`). If that ships, add a same-stat AP/MP stack cap on the enemy path (`004` covers both sides).

---

### 3.7 Inferno cooldown circumvention via summons — **UNDERPOWERED** live / **DOMINANT** if kit AP is aligned without a CD

**COMPONENTS:** Player Inferno (CD 3, 5 AP) + Bomber kit (`summonKit: ["spell-inferno"]`, `ap: 1`) + player-controlled `resolveSpellCast` or AI `executeSummonAction`.

**COMBO_SEQUENCE (paper, 2026-09-02):** Cast player Inferno (bar locks 3). Spawn a Bomber. Kit Inferno every summon turn, ignoring the player CD.

**LIVE SEQUENCE:** `planSummonControlCast` computes `cost = Number(spell.apCost)` (5) against Bomber `currentAp` (1 at spell level 0; +1 per 3 summon levels). Returns `no_ap`. `applyCast` does the same (`summonExecutor.ts` 154–159). Kamikaze only runs on the `damage > 0` branch; Inferno `damage` is 0, so even a paid Inferno would not detonate. AI Bomber walks toward a cluster and never explodes.

**ACCESS_REQUIREMENTS:** Starter Bomber. Paying Inferno on the kit needs `floor(spellLevel / 3) >= 4` → summon spell level 12 (5 AP). That is not a Day-1 combo.

**WHY_IT_WAS_FILED:** The only starter spell with a real cooldown looked launderable through a 2-AP **spawn**. The spawn cost was never the kit cost.

**COUNTERPLAY:** N/A — the kit does not fire.

**RECOMMENDED_RESPONSE:** Do **not** nerf player Inferno. First restore Bomber identity (`014`: 1-AP detonate **or** enough AP to cast Inferno **once**). Then honor kit `cooldown` (`010`) so a restored Bomber cannot recast Inferno every turn. Do not give the kit 5 AP and skip 010.

---

### 3.8 Titan’s Vigor × Glass Realm × Sacrifice — **STRONG_BUT_HEALTHY** (monitor)

**COMPONENTS:** Map modifiers Titan’s Vigor (`+1000` HP on `applyBattleStart`; `onDamageDealt` 1–5×) + Glass Realm (×2 on the same hook) + Sacrifice (20% current `characterStats.hp` × 3).

**COMBO_SEQUENCE:**

1. Roll both modifiers (independent map rolls; not guaranteed).
2. Sacrifice reads `characterStats.hp` (Titan’s store-HP bump may not be on that object).
3. `dealDamage` → `enemyTakesDamage` (`WX` 3472–3516) → `applyDamageDealt` applies Titan roll then Glass.

**WHY_IT_IS_STRONG:** Lottery on a path that already ignores Mark/crit. Main-bar nukes (Strike, Shadow Strike, Chain Lightning) **do not** go through `enemyTakesDamage`, so they do **not** get the 1–5× / ×2. The scary packet is Sacrifice-only. Vampiric Ground is on the same hook and also misses the main bar.

**COUNTERPLAY:** Don’t stand next to the target (range 1). Mirror. Don’t pick Sacrifice on a Glass map. Untouchable now sees the self-HP loss.

**RELATIVE_PROGRESSION_CONTEXT:** Modifier luck, not a loadout.

**PERSISTENCE/ECONOMY_IMPACT:** None beyond a lucky one-shot.

**RECOMMENDED_RESPONSE:** Monitor. Do not nerf Sacrifice or the modifiers unless play data shows every Glass+Titan map is a skip-or-Sacrifice binary. See `EBMA-2026-09-22-008`.

---

### 3.9 Enrage + Mark + Crit + Fury / Blood Moon — **STRONG_BUT_HEALTHY**

**COMPONENTS:** Enrage (×1.4 dmg, 2 turns, 3 AP) + Mark (×2 next hit, 2 AP) + CHC crit (×2) + Fury potion (×1.25, 3 turns) + Blood Moon (×1.25, map). Optional: player Enrage on an allied Wolf (`targetType: "ally"` resolves in `resolvePlayerCast` 676–718).

**COMBO_SEQUENCE:** Enrage → Mark tile → nuke (Shadow Strike 35 or Chain Lightning / Expose). Setup is 5 AP before the hit; 8 AP bar leaves 3 for the nuke (Shadow Strike fits). Ally-Enrage on a Wolf is a second payload on the summon’s turn.

**WHY_IT_IS_STRONG:** Multipliers compose. Shadow Strike (backend seed) is the best payload. Ally-Enrage is targeting honesty, not a new number.

**COUNTERPLAY:** RES/SR. Don’t stand on the marked tile. Kill the caster during the setup turn. Paper Windstorm miss. Mirror. Kill the Wolf.

**RECOMMENDED_RESPONSE:** Preserve. This is the intended burst identity. Do not touch Mark, Enrage, or ally-buff targeting because the product is large.

---

### 3.10 Shield + Iron Skin (+ Sentinel / ally target) — **STRONG_BUT_HEALTHY**

**COMPONENTS:** Both `buffStat: "res"`, `buffModifier: 1.3`, different `effectName` → multiplicative 1.69× RES for 3 turns. Sentinel kit can apply Shield (2 AP vs 2 AP) but **not** Iron Skin (3 AP vs 2 AP) until summon level 3. Player Shield/Iron Skin can land on an allied summon.

**WHY_IT_IS_STRONG:** Durable, not immortal. Costs 5 AP on the bar. Null Field suppresses. Duration is short. Buffing a 0.5-scale Bomber is a real decision, not a loop.

**RECOMMENDED_RESPONSE:** Preserve. Sentinel Iron Skin coming online with 014 is still duration-gated.

---

### 3.11 Timestep + Haste + Rally — **STRONG_BUT_HEALTHY**

**COMPONENTS:** Timestep (once, restores formula AP/MP + additives) + Haste (+2 MP, 1 turn) + Rally / Blood Mend (heal + advertised CHC).

**WHY_IT_IS_STRONG:** One extra full bar per fight is a real decision, not a loop. Haste is already included in `restoreApMp` via `getStatModifier("player", "mp")`. Combined with 3.1 it is an amplifier (one extra Poison dump); the loop is still the missing DoT cap, not Timestep.

**NOTE:** Blood Mend / Rally `buffModifier: 0.15` on `chc` never reaches the crit roll (`playerSpellContext` uses raw `characterStats.chc`). The heal branch (`resolvePlayerCast` 654–673) also never writes the buff effect. The CHC half is **UNDERPOWERED** / inert. Heal half is fine.

**RECOMMENDED_RESPONSE:** Preserve Timestep. Optionally wire CHC through `getStatModifier` as **+15 percentage points** (`EBMA-2026-09-22-012`) — restore, not nerf. Also apply attached `buffStat` on the heal branch or the CHC wire has nothing to read.

---

### 3.12 Swap / Barrier / Mirror — **STRONG_BUT_HEALTHY** (Swap has a hazard hole)

**COMPONENTS:** Swap (3 AP), Barrier (3 AP, 3-turn tile; copy says 2), Mirror (4 AP, next single-target reflect; `activatePlayerMirror` is wired).

**WHY_IT_IS_STRONG:** Positional and reactive. Swap onto lava/ice/rift does **not** run walk hazards (MIMA-2026-08-31-001). That is a challenge-integrity hole (Untouchable) more than a damage loop. Frozen Terrain 2× MP also does not apply to Swap — interesting, keep the teleport identity.

**RECOMMENDED_RESPONSE:** Do not nerf Swap. Hazard landing belongs to the MIMA ticket, not a damage nerf. Pacifist-legal Barrier/Mirror is owned by 003, not a Swap nerf.

---

### 3.13 Backend catalog + 8-slot bar — **NICHE** (discovery still inert)

There is no achievement-spell or enemy-discovery combination on the live path. The only extra combo space from the canister is Shadow Strike / Thunder Clap / late Void Collapse sitting next to starters, plus inert Bite / Soul Rend / Reflect. `OLD_SPELL_NAMES_SET` drops leftover backend rows named Inferno / Frost Nova / Fireball; it does not create an unlock. That is a **catalog dump**, not a discovery reward.

**RECOMMENDED_RESPONSE:** Do not invent unlocks in this PR. Point implementers at existing `SDA-2026-08-31-002` … `004` / `SDE-2026-08-31-001` … `003`. See `EBMA-2026-09-22-007`. Restore Bite / Soul Rend / Reflect metadata so the dump is at least honest (`EBMA-2026-09-22-013`).

---

### 3.14 Late-game enemy summoner density — **STRONG_BUT_HEALTHY**

**COMPONENTS:** `ENEMY_SUMMONER_CHANCE_BASE + level * 0.02` per enemy + Wolf/Archer kits + `ENEMY_SUMMON_CAP = 2`.

**WHY_IT_IS_STRONG:** By level 44 every trash mob is a summoner. The cap and 2-turn cadence keep this from flooding. Comment in `gameConstants.ts` 295–297 still says “~12% of packs.” AI enemy summons still do not tick DoTs, and Wolf Venom / Bomber Inferno cannot pay AP.

**RECOMMENDED_RESPONSE:** Retarget the roll to pack-level / zone if the board feels noisy. Not a P0. See `EBMA-2026-09-22-011`.

---

### 3.15 Ally-buff summons (Enrage / Shield / Haste on kits) — **STRONG_BUT_HEALTHY** (preserve)

**COMPONENTS:** `resolvePlayerCast` ally branch (676–718) + Enrage / Shield / Iron Skin / Haste + any player-side summon.

**WHY_IT_IS_STRONG:** The spells already said “ally.” Landing them on a Wolf or Sentinel is the identity working. 1.4× Wolf damage and 1.69× Sentinel RES are large but duration-gated and Null-Field-vulnerable.

**RECOMMENDED_RESPONSE:** Preserve. Do not close ally targeting to “fix” 3.2. Cap the flood instead.

---

### 3.16 Summon kit AP vs kit spell cost — **UNDERPOWERED**

**COMPONENTS:** `getSummonBaseStats` AP (`unitDef.ap` + `floor(spellLevel / 3)`) versus kit `apCost`.

| Kit | Budget (lv 0) | Kit spells | Fires? |
| :--- | :--- | :--- | :--- |
| Archer | 2 | Poison 2, Slow 2 | Yes — one per turn |
| Wolf | 2 | Strike 2, Venom 3 | Strike only |
| Sentinel | 2 | Shield 2, Iron Skin 3 | Shield only |
| Wisp | 2 | Blood Mend 3, Rally 4 | Neither; even with AP, heal cannot hit the player (015) |
| Bomber | 1 | Inferno 5 | Neither; no kamikaze |

**COMBO_SEQUENCE:** Player reads “Summons a Wisp that heals allies” / “Bomber that rushes and explodes.” The live control panel and AI executor both no-op the advertised spell (`no_ap` / `[cast] … blocked`). Giving Wisp 3 AP alone still leaves Blood Mend healing `targetEnemy` through a writer that ignores that id.

**ACCESS_REQUIREMENTS:** Starters. Spell level 3 turns Wisp/Sentinel/Wolf-Venom **AP** on. Bomber Inferno needs spell level 12. Wisp player-heal never turns on from AP.

**WHY_IT_IS_STRONG:** It is not. Four of five kits are missing their identity at the only progression band most players will occupy. The **live** summon package is occupancy + Archer Poison/Slow + Wolf Strike. That is still enough to make 3.2 DOMINANT; it is not the five-role army the cards describe.

**COUNTERPLAY:** N/A (player is missing tools).

**RELATIVE_PROGRESSION_CONTEXT:** Doka spent on Bomber / Wisp levels is mostly HP/lifespan until the AP breakpoint. Soft-destroys “upgrade the healer summon.”

**PERSISTENCE/ECONOMY_IMPACT:** Wasted upgrade spend. Indirectly **protects** no-heal and Inferno CD because those kits cannot fire.

**RECOMMENDED_RESPONSE:** Align budgets with advertised kits **without** recreating 3.7. Prefer a 1-AP Bomber detonate (damage > 0 so kamikaze runs) over giving Bomber 5 AP. Pair Bomber with `010`. Pair Wisp AP with `015` (player/ally heal target). Do not tick AI DoTs (`006`) until `001`. See `EBMA-2026-09-22-014`.

---

### 3.17 Striker + melee summons — **STRONG_BUT_HEALTHY** (preserve)

**COMPONENTS:** `legendary_3` (Chebyshev ≤ 2, 400 Doka / 800 XP) + Wolf Strike (range 1) + summon spawn (range 2).

**LIVE SEQUENCE:** Player spawn records Striker from the **player** tile to the ground tile (`WX` 17178–17187) — legal at range 2. Controlled kit casts record from the **summon** tile (`WX` 9874–9883). Archer Poison at range 4 fails Striker on purpose. AI does **not** run for player-side summons (`WX` 14418–14421), so there is no hidden kite.

**WHY_IT_IS_STRONG:** Wolf-in-your-face is a legal Striker clear. That is the badge’s identity, not a skip.

**RECOMMENDED_RESPONSE:** Preserve. Do not fail Striker on summon **placement**. Do not fail it on adjacent Wolf Strike.

---

### 3.18 Adaptive Resistance history — **UNDERPOWERED** (inert counterplay)

`playerSpellTypeHistoryRef` is appended in `recordPlayerSpellType` (`WX` 17015–17019) and cleared at battle start. Nothing reads it. Enemies do not adapt. Not a player combo. Do not file a balance ID; dead AI is not a loadout.

---

### 3.19 Wisp “heals allies” vs control-cast targeting — **UNDERPOWERED** (new this pass as a named package)

**COMPONENTS:** Summon Wisp (`summonKit: ["starter-heal", "spell-rallying-cry"]`, card: “heals allies”) + `castControlledSummonSpell` + `ctx.heal` player-only writer.

**COMBO_SEQUENCE:** Spawn Wisp. On the Wisp turn, pick Blood Mend. The control path requires an enemy tile (`targetEnemy`). `resolveSpellCast` runs `ctx.heal(enemyId, 12)`. The writer ignores that id. Player HP does not change. Challenge `healUsed` does not flip (and should not — nothing was restored).

**ACCESS_REQUIREMENTS:** Starter. AP alignment (014) does not open this.

**WHY_IT_IS_STRONG:** It is not. The advertised healer role is missing. Occupancy-only Wisp is still a 3.2 body.

**COUNTERPLAY:** N/A.

**RELATIVE_PROGRESSION_CONTEXT:** Wisp upgrades buy HP/lifespan, not a healer.

**PERSISTENCE/ECONOMY_IMPACT:** Wasted Doka. Protects no-heal until 015 ships.

**RECOMMENDED_RESPONSE:** Restore the identity: kit heal/rally must be able to target the player and allied summons (self/ally, not `targetEnemy`). Write HP for those ids. Pass the clamped amount into `recordChallengeHealFromHpRestore` so no-heal stays honest. Do **not** let Blood Mend heal hostiles. See `EBMA-2026-09-22-015`. Ship with or immediately after 014. Open PR #380 touches recording; union the helper, do not fight over WX heal.

---

## 4. Classification board (player-accessible)

| Package | Class | Intervene? |
| :--- | :--- | :--- |
| Poison recast / Poison+Venom+Inferno (+ Arcane Surge) (+ Archer) (+ `hard_3`) | BROKEN | Yes — cap / refresh |
| Player summon flood (5 kits, no cap/CD) | DOMINANT | Yes — cap + summon-spell CD |
| Pacifist + summon / Bite / Mark / Slow-1 / (late Void Collapse) | DOMINANT | Yes — advertised categories; keep preview fix; Boss Rush fire stays |
| No-heal + drain | CLOSED | Do not re-open |
| No-heal + Wisp | NOT LIVE (cannot target player) | Restore identity via 015; verify the flag with the amount |
| Inferno via Bomber at slvl 0 | UNDERPOWERED | Restore identity, then kit CD |
| Shadow Strike + Mark + Enrage | STRONG_BUT_HEALTHY | No |
| Shield + Iron Skin (+ ally) | STRONG_BUT_HEALTHY | No |
| Ally Enrage / Haste on kits | STRONG_BUT_HEALTHY | No |
| Timestep (once) | STRONG_BUT_HEALTHY | No |
| Sacrifice + Titan + Glass | STRONG_BUT_HEALTHY | Monitor |
| Thunder Clap / Chain Lightning / Frost Nova damage | STRONG_BUT_HEALTHY | No (Frost Nova slow is dead — 004) |
| Swap / Barrier / Mirror | STRONG_BUT_HEALTHY | Hazard landing is MIMA, not EBMA |
| Enemy summoner density (capped 2) | STRONG_BUT_HEALTHY | Soft formula fix |
| Controlled Archer Slow / Poison | STRONG_BUT_HEALTHY | Restore the bar; keep the kit; cap flood |
| Striker + adjacent Wolf | STRONG_BUT_HEALTHY | No |
| Bishop Frost only (zone 0) | NICHE | Restore zone number |
| Void Collapse (12 AP) | NICHE | Don’t enforce `minLevel` as a surprise nerf; fold `attract_multi` into 003 |
| Player Slow/Weaken/Expose/Frost/Courage | UNDERPOWERED | Restore `debuffStat`; skip 1-floor on 0-damage |
| Soul Rend / Vampire Bite heal / Reflect Barrier | UNDERPOWERED | Metadata, not a nerf |
| Blood Mend / Rally CHC half | UNDERPOWERED | Wire `chc` + heal-branch buff |
| Bomber / Wisp / Wolf-Venom / Sentinel-Iron Skin kits | UNDERPOWERED | Align AP (`014`) + Wisp targeting (`015`) |
| AI summon DoTs / AI Bomber kamikaze / AI Slow | UNDERPOWERED | Only after DoT cap (DoTs); Slow restore is 004/006 adjacent |

---

## 5. What not to touch

- RAF loop, map generation, turn order, damage formula (`calcScaledDamage` 3%/level) except the 0→1 floor on **pure 0-damage debuffs** called out in 003/004.
- Mark, Enrage, Timestep-once, Mirror, Barrier geometry, Swap’s teleport identity, ally-buff targeting.
- 3% upgrade curve. Economy bugs around summon advertised cost vs canister debit are already owned by persist work.
- Inventing observe-to-unlock in this automation. That is SDA / SDE.
- Reverting the Pacifist preview fix.
- Reverting drain no-heal recording.
- GameKey shop numbers (out of combat-combo scope).
- Occupancy dual-path unseal / Void Rift summon tick / Frozen execute MP / Sacrifice Untouchable (closed correctly).
- Striker adjacent-Wolf.

---

## 6. Prior ACTION_ID disposition

| Prior | 2026-09-22 | Notes |
| :--- | :--- | :--- |
| 09-02 / 09-21 001 DoT cap | Reissued as 001 | Still true; Archer named as extra stack source; `hard_3` payout named |
| 09-02 / 09-21 002 Summon cap + CD | Reissued as 002 | AP still charged; cap/CD still missing |
| 09-02 / 09-21 003 Pacifist | Reissued as 003 | Boss Rush room-clear; Bite; Slow-1; **`attract_multi` named** |
| 09-02 / 09-21 004 Player debuff + stack cap | Reissued as 004 | Bar still dead; controlled Archer Slow live |
| 09-02 005 / 09-21 closed | **Stay closed** | Drain counted. Wisp is not a farm (015 owns identity + recording rail) |
| 09-02 / 09-21 006 AI DoT ppt | Reissued as 006 | Still gated on 001. Mostly inert until 014 anyway |
| 09-02 / 09-21 007 Catalog ≠ ownership | Reissued as 007 | Still inert; #300 did not ship unlocks |
| 09-02 / 09-21 008 Titan × Glass | Reissued as 008 | Still Sacrifice-only hook |
| 09-02 / 09-21 009 Numeric zone | Reissued as 009 | Call site still passes the object |
| 09-02 / 09-21 010 Kit cooldown | Reissued as 010 | **Reframed** — not live DOMINANT; rail after 014 |
| 09-02 / 09-21 011 Enemy summoner chance | Reissued as 011 | Still per-enemy × player level |
| 09-02 / 09-21 012 CHC buff restore | Reissued as 012 | `chc` still raw; heal branch still skips buffStat |
| 09-02 / 09-21 013 Bite / Soul Rend / Reflect | Reissued as 013 | Metadata still wrong |
| 09-21 014 Kit AP | Reissued as 014 | Still true; Wisp AP without 015 still leaves the healer dead |
| — | **New 015** | Wisp heal targeting + no-heal amount recording |

09-21 ACTION_IDs (`EBMA-2026-09-21-*`) were never merged. Treat 09-22 IDs as the current ledger. Same-SHA work on PR #365 is subsumed by this dated file set (different filenames).

---

## 7. Search checklist (this pass)

| Pattern | Result |
| :--- | :--- |
| Excessive damage/AP combinations | 3.1 DoT recast; 3.9 burst (healthy) |
| Infinite / near-infinite loops | DoT append has no cap; summon recast limited only by AP + lifespan |
| Permanent control | Player-bar denial dead; latent after 009 |
| AP/MP denial chains | Latent 3.6; live Archer Slow is kit identity; Frozen Terrain is healthy map tax |
| Summon abuse | 3.2 flood; 3.16 dead kits; 3.7 not live; 3.19 Wisp cannot heal the player |
| Cooldown circumvention | Player Inferno CD holds; Bomber cannot pay the kit; Attack Nearest Inferno **closed** |
| Healing loops | Drain **closed**; Wisp cannot target player; potions **closed**; Bite heal inert; Mending Mist mutates a missing player combatant |
| Defensive immortality | Shield+Iron Skin duration-gated (healthy) |
| Status stacking | DoT append BROKEN; non-DoT replace-by-name |
| Displacement loops | Swap identity healthy; push/attract still unwired on `resolvePlayerCast`; Void Collapse pull unused; hazard landing is MIMA |
| Hazard combinations | Swap × lava is MIMA, not EBMA |
| Achievement-spell combinations | No spell grants. Pacifist is an achievement × existing kit combo; now also on Boss Rush room-clear; `attract_multi` would join at ~100 |
| Enemy-discovery spell combinations | Discovery inert. Catalog dump is not discovery |
