# Emergent Build & Meta Analysis — 2026-09-25

**Analyzer:** Emergent Build & Meta Analyzer  
**Automation:** `7b2f2b58-a49e-11f1-a7d1-d6b4613131ce` (cron `0 */72 * * *`)  
**HEAD:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Prior merged pass on `main`:** 2026-09-02 (`EMERGENT_META_2026-09-02.md`; ACTION_IDs `EBMA-2026-09-02-001` … `013`)  
**Prior unmerged passes (same HEAD, draft PRs only):** 2026-09-21 `#365`, 2026-09-22 `#414`, 2026-09-23 `#456`, 2026-09-24 `#522`  
**Gameplay code:** not modified. Balance was not changed.

This is a combination audit. Individual rows can look fair while two or three of them delete the rest of the kit.

Intervention is recommended only when a strategy:

- invalidates alternatives
- removes counterplay
- produces infinite / degenerate loops
- destroys progression or economy

Strong interesting synergy is left alone.

ACTION_IDs: [`ACTION_IDS_EBMA_2026-09-25.md`](./ACTION_IDS_EBMA_2026-09-25.md).

Prior IDs were **not implemented on `main`**. They are reissued with current line numbers. Escalate only where a cited gate actually moved. **005 stays closed.**

---

## 0. What changed since 2026-09-24 / last merge

`origin/main` is still `0f5363f`. Combat gates cited on 2026-09-24 still match. This pass re-read the live files; it does not invent a new HEAD.

Queued restores that are **not** on `main` (do not duplicate; do not treat as live):

| Ticket | Queued PR | What it would restore |
| :--- | :--- | :--- |
| 017 | `#496` Timestep / Mirror on the highlighted self tile | Once-per-battle AP/MP reset and next-hit reflect |
| 017 follow-on | `#581` keep 0-AP Timestep free under Arcane Surge | After 017, `applyApCost` min-1 would charge Timestep 1 AP on Surge/Overflow maps |
| 004 | `#528` Weaken/Slow on highlighted hostiles; `#555` advertised `debuffStat` after player hits | Player-bar control kit. Still needs the AP/MP stack cap in 004 |
| 015 | `#550` Wisp Blood Mend HP after the kit buff branch | Heal half of Blood Mend / Rally on `resolveSpellCast`. Targeting + amount-record still in 015 |
| — | `#443` player turn-start map-modifier HP/MP | Mending Mist on the **player**. Live `playerTurnStartModifierTarget` returns `undefined` because the player is not in `combatantsRef` |

Closed on `main` (do not re-open):

- Pacifist failing on spell-range preview
- BuffShop mid-fight potions paying no-heal
- Inf-HP summon catalog writes
- Player-controlled summons ignoring Void Rift ticks
- Free player summon placement (0 AP)
- Attack Nearest Inferno cooldown skip on the player bar
- Drain no-heal (`onPlayerHealed` → `recordChallengeHealFromHpRestore`)
- Bomber Inferno as a **Day-1** cooldown launder (Bomber spawn AP 1 cannot pay Inferno 5)
- Preview pacifist, Sacrifice Untouchable as an EBMA ticket

---

## 1. Access model (what a player can actually bring)

There is still no observe → win → unlock path. “Discovered enemy spells” and “achievement/challenge spells” remain design docs, not live systems.

| Source | What enters the library | Spell grant? |
| :--- | :--- | :--- |
| `starterSpells` | All starter ids forced `isBaseSpell: true` | Always owned |
| `getSpellConfigs()` | Every `usableByPlayer !== false` id (`adminSafety.ts` 712–719; `WX` 2412–2440) | Catalog membership **is** ownership |
| Achievements | Doka only (`admin.mo` `defaultAchievements`) | No |
| Challenges | Doka / XP / badge | No |
| Recap / `applyRewards` | XP + Doka | No |
| `upgradeSpell` | Levels a known id; canister `10 * 2^level` | Must not grant |
| GameKey shop | Admin-approved keys | No spells |

Real loadout constraint: **8-slot bar**. The broken strategies below are 8-slot legal.

Backend seed (`admin.mo` `defaultSpells` 168–191) that actually fires on the player path:

| Id | On paper | Live `resolvePlayerCast` | Class |
| :--- | :--- | :--- | :--- |
| `shadow_strike` | 35 dmg / 3 AP / CD 2 / diagonal | Damage loop | STRONG_BUT_HEALTHY |
| `thunder_clap` | 25 AoE / 4 AP / CD 3 | Damage loop via `hitsMultiple` | STRONG_BUT_HEALTHY |
| `void_collapse` | 80 AoE + pull / 12 AP / `minLevel` 30 | AoE damage only. Attract unused. 12 AP needs ~level 100 (`8 + floor(level/25)`). `minLevel` is **not** checked. `effectType` is `"attract_multi"` (not in Pacifist `offCats`) | NICHE until ~100, then STRONG_BUT_HEALTHY + Pacifist hole |
| `soul_rend` | DoT + 25 upfront | `effectType === "dot"` takes the DoT branch; no `dotDamagePerTurn` → 0 tick | UNDERPOWERED (inert) |
| `vampire_bite` | Drain 20 / heal 20 | `effectType` is `"heal"` not `"drain"` → 20 damage, **no heal**. Pacifist-legal | UNDERPOWERED heal + **DOMINANT** Pacifist payload |
| `reflect_barrier` | Reflect next spell | Generic `buff` without `buffStat` / `isMirror` / `targetType: "self"` | UNDERPOWERED (inert) |

Enemy kits (`ENEMY_KITS` in `enemyAI.ts` 163–185) reuse starter ids. Seeing a bishop cast Frost teaches nothing and unlocks nothing.

---

## 2. Live gates (combo truth table)

| Gate | File | Live behavior |
| :--- | :--- | :--- |
| DoT append | `engine/dotStacks.ts` `appendDotStack` 31–37; `statusEffects.ts` `mergeIncomingEffect` 92–99; `WX` `applyActiveEffect` 1871–1892 | Same-type stacks add; no cap; independent durations |
| Player DoT apply | `spellEngine.ts` `resolvePlayerCast` 777–814 | Sets `dotDamagePerTurn` |
| Player damage debuffs | same, 876–1028 | **Does not** call `applyEffect` for `debuffStat` |
| Controlled-summon / enemy `resolveSpellCast` debuffs | `spellEngine.ts` 529–548 | **Does** apply `debuffStat`. Player-controlled Archer Slow is live |
| `resolveSpellCast` heal vs buff | 507–558 | `buffStat` returns **before** `healAmount`. Wisp Blood Mend / Rally never heal, even after targeting |
| Enemy / boss inline debuffs | `WX` ~16594 / ~16673 | Apply; same `effectName` replaces; different names with the same `stat` add |
| Summon cap | `gameConstants.ts` `ENEMY_SUMMON_CAP = 2` (300) | Enemy only. Player `spawnPlayerSummon` (`WX` 9582–9635) has no alive-cap. Comment at `enemyAI.ts` 1830 (“player-side summonCount gate”) is still false |
| Summon spell CD | `spellData.ts` 547–690 | No `cooldown` on the five kits |
| Summon kit CD | `summonControlCast.ts` `planSummonControlCast` 221–258 | AP, range, live geometry — **not** cooldown |
| Kit AP vs kit spell | `getSummonBaseStats` 229–232; `unitDef.ap` | Bomber 1 vs Inferno 5; Wisp 2 vs Mend 3 / Rally 4; Wolf 2 vs Venom 3; Sentinel 2 vs Iron Skin 3. Archer 2 vs Poison 2 **does** fire |
| Player summon AP | `challengeCompletion.ts` 330–331; `WX` 17162 | Charged |
| Pacifist execute | `WX` `recordPlayerSpellType` 17015–17033 | Offensive list: damage/drain/aoe/dot/pushback/attract/cc/teleport. **Not** summon/heal/debuff/defense/buff/`attract_multi` |
| Pacifist preview | `targeting.ts` 83–85 | Does not flip |
| Challenge heal (spells) | `WX` 17190–17196 | `targetType === "self" && effectType === "heal"` |
| Challenge heal (potions) | `challengeCompletion.ts` 231–236 | Counted in battle |
| Challenge heal (drain) | `WX` 9502–9508 `onPlayerHealed` | Counted when `healAmt > 0`. **005 closed** |
| Wisp / summon heal | `WX` `ctx.heal` 9185–9206, 15005–15016 | Only writes player HP for player ids; control-cast always targets `targetEnemy`; recorded delta is ref-after-setState (0) |
| Mending Mist on player | `battleSetup.ts` 364–368; `WX` 14262–14273 | Helper finds `id === "player"` in `combatantsRef` → `undefined`. Hook exists; player HP is not committed. `#443` is the restore |
| Summon-AI DoT | `summonExecutor.ts` 191–203 | `applyEffect` without `dotDamagePerTurn` or `stat`/`modifier` |
| Player-controlled summon DoT | `WX` `castControlledSummonSpell` → `resolveSpellCast` | Ticks (Archer Poison) |
| Timestep | `spellEngine.ts` 634–636 then 680–718 then 721–733 | `self`+`buff` is `isShieldSpell`. No `buffStat` → silent `"cast"` **before** `isTimestep`. Inert on the live self-tile path |
| Mirror | `spellEngine.ts` 917–926 | `activateMirror` sits inside `if (targetEnemy \|\| hitsMultiple)`. Self tile spends 4 AP and never activates |
| Sacrifice | `spellEngine.ts` 749–763 | 20% `characterStats.hp` → 3× via `dealDamage` → `enemyTakesDamage` (Enrage / Titan / Glass apply). Mark / crit do not |
| Upgrade damage | `combatMath.ts` `calcScaledDamage` 130–136 | `base * 1.03^level`. Floors 0 to 1. Does **not** scale `dotDamagePerTurn` literals |
| Battle AP | `progression.ts` `getPlayerBaseStats` 59–72 | Floor 8; +1 every `apMpGrowthEveryNLevels` (default 25) |
| `hard_3` | `challengeCompletion.ts` 80–86, 126–127 | `maxApUsedInTurn <= 8`. Levels 1–24 cannot fail it |
| Enemy kit zone | `WX` 11920 + `buildEnemyKit` 194–199 | `currentMap.levelZone` is `{name,minLevel,maxLevel}` (`WX` 4683–4687). `Math.floor(object)` is `NaN`. Every kit stays zone 0 |
| Enemy summoner roll | `WX` 11932–11942 | `0.12 + playerLevel * 0.02` **per enemy**. 100% at level 44+. Global alive cap still 2 |
| Null Field | `mapModifiers.ts` 419–431 | Suppresses buff/debuff only. DoTs still apply |
| `minLevel` | `resolvePlayerCast` | Not enforced |

---

## 3. Combination reports

### 3.1 Unbounded player DoT recast — **BROKEN**

**COMPONENTS:** Poison Arrow (2 AP, 4/turn, 3 turns, no CD) + Venom Strike (3 AP, 4/turn, 3 turns, no CD) + Inferno (5 AP, 8/turn, 3 turns, CD 3). Optional: Arcane Surge / Arcane Overflow (−1 AP, min 1; both stack to still min 1). Optional: player-controlled Archer (`resolveSpellCast` Poison). Optional: `hard_3` (max AP used ≤ 8).

**COMBO_SEQUENCE:**

1. Equip Poison + Venom + Inferno (and optionally an Archer).
2. Each player turn: dump leftover AP into Poison recasts (4 stacks at 8 AP; 8 stacks under Surge).
3. Mix Venom / Inferno when the extra tick is worth the AP.
4. Stacks append (`appendDotStack`). They do not refresh. A 10-turn boss fight is a damage integral, not a 4+4+8 ceiling.
5. `hard_3` accepts `maxApUsedInTurn <= 8`. A full 8-AP Poison dump is legal for 150 Doka + 450 XP. At levels 1–24 the bar **is** 8, so the challenge cannot fail.

**ACCESS_REQUIREMENTS:** Starter library. Arcane Surge is a map-modifier roll. Archer is a starter summon.

**WHY_IT_IS_STRONG:** Cost-to-stack is linear; duration is independent; there is no same-source cap. Long fights (boss, dungeon chain, boss rush) make the last recast strictly better than a front-loaded nuke. Inferno’s CD only gates the 8-tick, not Poison. Null Field does not suppress DoTs. Upgrade 3%/level never touches the 4-tick literal, so stack count is the real scaling.

**COUNTERPLAY:** Kill faster than the integral. RES reduces each tick once (summed). Enemy kits are stuck at zone 0, so they rarely apply cleanse or pressure that forces the player off the recast. Timestep cannot currently add a second dump (017).

**RELATIVE_PROGRESSION_CONTEXT:** Available at level 1. Late-game the **stack count** is the scaling, not the upgrade curve.

**PERSISTENCE/ECONOMY_IMPACT:** Faster clears → more `applyRewards` XP/Doka. Soft-destroys “spend Doka on spell levels” for damage spells because recast beats 3%/level on a 4-tick. `hard_3` converts the same dump into a challenge payout (016).

**RECOMMENDED_RESPONSE:** Same-source refresh or a small per-target / per-name cap. Keep Poison + Venom + Inferno as three different types that can coexist. Do not flatten DoT identity. Do not nerf Timestep because a restored once-per-battle dump is still one extra recast. See `EBMA-2026-09-25-001`.

---

### 3.2 Player summon flood — **DOMINANT**

**COMPONENTS:** Dire Wolf (3 AP) + Archer (3 AP) + Sentinel (3) + Bomber (2) + Wisp (2). No alive-cap. No summon-spell cooldown. Lifespan from `getSummonBaseStats`.

**COMBO_SEQUENCE:**

1. Turn 1 at 8 AP: Wolf + Archer + Wisp, or Wolf + two Wisps, or four Bombers.
2. Each summon gets its own turn (`type: "summon"`), own AP/MP budget, and (if player-controlled) a kit that goes through `resolveSpellCast` — including live Slow / ticking Poison.
3. Next player turn: spawn again. Nothing evicts the previous wave except lifespan.

**ACCESS_REQUIREMENTS:** All five kits are starters. 8-slot bar is the only limiter.

**WHY_IT_IS_STRONG:** Action-economy multiplier. One player turn buys three extra turns of units that occupy tiles, body-block, and (when controlled) apply real DoTs and Slow. Enemy summons are capped at 2 with a 2-turn cadence; the player is not. AP cost only slows the first dump. Blitz (`legendary_2`, under 5 turns, 450 Doka / 900 XP) is the natural payout.

**COUNTERPLAY:** Focus the Wisp (enemy AI already scores it high). AoE (Thunder Clap / Chain Lightning / Lifesteal Nova). Lifespan expiry. Occupancy / portal-reserved cells prevent sealing exits. Void Rift now ticks controlled summons.

**RELATIVE_PROGRESSION_CONTEXT:** Spell-level buys HP (+10%/level), AP (+1/3 levels), MP, and lifespan. Cheap Doka upgrades on summon ids make the flood tankier without touching the missing cap.

**PERSISTENCE/ECONOMY_IMPACT:** Pacifist (3.3) converts the flood into 500 Doka. Summon UI advertises 10× upgrade cost; canister still charges `10 * 2^level`.

**RECOMMENDED_RESPONSE:** Player alive-cap (2–3) and a short summon-spell cooldown. Keep five identities. See `EBMA-2026-09-25-002`. Do not also give AI summons ticking DoTs until 001 lands (`006`). Do not close ally-buff targeting as a substitute for a cap.

---

### 3.3 Pacifist Run + summons / Bite / Mark / Slow-1 / attract_multi — **DOMINANT** (economy)

**COMPONENTS:** Achievement `pacifist_run` (500 Doka, “Win a battle using only heal or buff spells”, `admin.mo` 324) + any of: damage summon (Wolf / Archer / Bomber) + Vampire Bite (`effectType: "heal"`, 20 damage) + Mark (`effectType: "debuff"`) + Slow / Weaken (`effectType: "debuff"`, `damage: 0` floors to 1) + Barrier / Mirror (`defense`) + Void Collapse (`attract_multi`).

**COMBO_SEQUENCE:**

1. Equip heals/buffs plus any of Bite, Mark, Barrier, Mirror, Slow, or a summon kit.
2. Cast them. `recordPlayerSpellType` only flips on `damage|drain|aoe|dot|pushback|attract|cc|teleport`.
3. Bite deals 20 through the damage loop and records `"heal"`.
4. Summons kill. Recap fires `clientTrustedVictoryAchievementConditions` (`WX` 12483–12497) **and** Boss Rush room-clear uses the same list. Claim 500 Doka.

**ACCESS_REQUIREMENTS:** Starters + backend Bite if the catalog dump is live + the feat on the canister.

**WHY_IT_IS_STRONG:** The condition is implemented as “the player character did not resolve a listed `effectType`,” not “the player side dealt no damage / used only heal or buff.” Bite is a 20-damage spell that the feat treats as a heal. That is the opposite of the advertised intent.

**COUNTERPLAY:** None. The check cannot see summon damage, Bite damage, Mark, or Slow-1.

**RELATIVE_PROGRESSION_CONTEXT:** 500 Doka is `upgradeSpell` fuel. A single legal pacifist clear funds several damage-spell levels or a summon-level spike.

**PERSISTENCE/ECONOMY_IMPACT:** Direct. `claimAchievementReward` credits the persist-lock wallet. Once per account, but the first 500 is a free spike if the player knows the hole.

**RECOMMENDED_RESPONSE:** Fail the feat unless every resolved **player** spell is heal, buff, Timestep, or (optionally) Mirror. Count player-side summon damage / offensive kit casts. Bite must fail it even while its heal metadata is still wrong. Treat `"attract_multi"` as offensive. Keep a true pacifist (heals + buffs + Timestep, no kits, no Bite) as a feat. Do not change the Doka amount. Do not revert the preview fix. See `EBMA-2026-09-25-003`.

---

### 3.4 No-heal challenge + drain / Wisp — **UNDERPOWERED Wisp / drain closed**

**COMPONENTS:** `easy_1` / `hard_1` + Life Drain / Lifesteal Nova / Drain Courage + Wisp Blood Mend / Rallying Cry. BuffShop potions already counted.

**LIVE SEQUENCE:** Drain heals call `onPlayerHealed` with the actual `healAmt` (`castHelpers.ts` 473–487; `WX` 9502–9508). Flag flips. **005 stays closed.** Wisp cannot currently restore player HP (three independent kills: enemy-only control target, `buffStat` return before `healAmount`, recorded delta 0). That is 015, a restore, not a no-heal exploit.

**RECOMMENDED_RESPONSE:** Do not re-open 005. When 015 lands, record the actual HP delta so a working Wisp fails no-heal and stays legal for advertised Pacifist (heal/buff). Keep overworld Doka-to-HP excluded. Do not treat `#443` Mending Mist as live until the player target is committed.

---

### 3.5 Dead player-bar control kit — **UNDERPOWERED** (player bar) / **STRONG_BUT_HEALTHY** (controlled Archer)

**COMPONENTS:** Slow (`mp` −2 / 2), Frost Bolt (`mp` −1 / 1), Weaken (`dmg` 0.7 / 2), Expose / Shadow Veil (`res_sp`), Drain Courage (`ap` −1 / 1), Cursed Wound (`healRecv` 0.5), Life Drain (`sp` 0.8), Frost Nova (`mp` −1). Archer kit: Poison + Slow.

**COMBO_SEQUENCE (player bar):** Player casts any of the above through `resolvePlayerCast`. Damage (if any) applies. `debuffStat` is never written. `calcScaledDamage` floors listed 0 to 1, so Slow/Weaken poke 1 and stay Pacifist-legal.

**COMBO_SEQUENCE (controlled Archer):** Player-controlled Archer casts Slow through `resolveSpellCast` 529–548. The MP debuff **does** land. AI Archer Slow still goes through `executeSummonAction` `applyEffect` without `stat`/`modifier` (cosmetic).

**ACCESS_REQUIREMENTS:** Starters. 8-slot opportunity cost on the bar; Archer kit is a summon slot.

**WHY_IT_IS_STRONG:** The player bar is not. The cards advertise control that the player path cannot deliver. The **intended** Slow identity currently lives only on a controlled Archer, which is interesting synergy and should be kept if 002 caps the flood.

**COUNTERPLAY:** N/A on the bar. Kill the Archer to remove live Slow.

**RELATIVE_PROGRESSION_CONTEXT:** Upgrading Slow / Weaken on the bar spends Doka on a missing half of the spell.

**PERSISTENCE/ECONOMY_IMPACT:** Wasted upgrade spend. Does not break the wallet.

**RECOMMENDED_RESPONSE:** Wire `debuffStat` after the player damage loop (do not skip damage). Skip the `max(1, …)` floor when listed `damage` is 0 on a debuff-only spell. Then cap stacked AP/MP denial so the restored kit cannot lock a target at 0 AP/MP forever. See `EBMA-2026-09-25-004`. This is a restore, not a nerf. Do not strip Archer Slow. `#528` / `#555` are queued vehicles for the wire — they must still ship the stack cap; do not land a second copy of the wire.

---

### 3.6 Latent enemy AP/MP denial (Bishop + Archer Slow) — **NICHE** live / **DOMINANT** if kits grow

**COMPONENTS:** Bishop Frost Bolt + enemy Archer Slow. Same-stat additives in `getStatModifier` (`statusEffects.ts` 45–63).

**COMBO_SEQUENCE (if kits were zone-correct):** Frost (−1 MP, 1 turn) + Slow (−2 MP, 2 turns) = −3 on a 4-MP player. Refresh each enemy turn.

**LIVE SEQUENCE:** `buildEnemyKit(..., currentMap.levelZone)` stays zone 0. Bishops have Frost only. Multiple Frosts **replace** by `effectName`. Live denial is −1 MP for 1 turn. Enemy AI Slow from an Archer summoner is cosmetic.

**ACCESS_REQUIREMENTS:** Live: any bishop pack. Latent: zone ≥ 1 kits + enemy Archer summon.

**WHY_IT_IS_STRONG (latent):** Player mobility is the positional game. −3 MP on a 4-MP pool is near-root.

**COUNTERPLAY (latent):** Kill the bishop / archer; Haste (+2 MP, 1 turn); Timestep (once, after 017); Null Field.

**RECOMMENDED_RESPONSE:** Do **not** nerf Frost or Slow. Pass a numeric zone into `buildEnemyKit` (`009`). If that ships, the same-stat AP/MP stack cap in 004 covers both sides.

---

### 3.7 Inferno cooldown circumvention via summons — **NICHE** live / **DOMINANT** after 014

**COMPONENTS:** Player Inferno (CD 3, 5 AP) + Bomber kit (`summonKit: ["spell-inferno"]`, spawn AP 1).

**LIVE SEQUENCE:** `planSummonControlCast` returns `no_ap` because Inferno costs 5. Not a Day-1 launder. After 014 raises Bomber AP to 5, controlled Bomber applies an 8/turn × 3 Inferno stack every summon turn through `resolveSpellCast` with no kit cooldown.

**RECOMMENDED_RESPONSE:** Per-summon cooldown map for kit ids that declare `cooldown` (`010`). Do not ship Bomber 5 AP without that lock. Attack Nearest Inferno skip stays closed.

---

### 3.8 Titan’s Vigor × Glass Realm × Sacrifice — **STRONG_BUT_HEALTHY** (monitor)

**COMPONENTS:** Titan’s Vigor (`+1000` HP on `applyBattleStart`; `onDamageDealt` 1–5×) + Glass Realm (×2 on the same hook) + Sacrifice (20% current `characterStats.hp` × 3).

**COMBO_SEQUENCE:** Both modifiers roll independently. Sacrifice uses `dealDamage` → `enemyTakesDamage` → `applyDamageDealt`. Main-bar nukes skip that hook.

**WHY_IT_IS_STRONG:** Lottery on a path that already ignores Mark/crit. The scary packet is Sacrifice-only.

**COUNTERPLAY:** Don’t stand next to the target (range 1). Mirror (after 017). Don’t pick Sacrifice on a Glass map.

**RECOMMENDED_RESPONSE:** Monitor. Do not nerf Sacrifice or the modifiers unless play data shows every Glass+Titan map is a skip-or-Sacrifice binary. See `008`.

---

### 3.9 Enrage + Mark + Crit + Fury / Blood Moon — **STRONG_BUT_HEALTHY**

**COMPONENTS:** Enrage (×1.4 dmg, 2 turns, 3 AP) + Mark (×2 next hit, 2 AP) + CHC crit (×2) + Fury potion (×1.25) + Blood Moon (×1.25). Optional: ally-Enrage on a Wolf (`targetType: "ally"` resolves in `resolvePlayerCast` 676–718).

**COMBO_SEQUENCE:** Enrage → Mark tile → nuke (Shadow Strike 35 fits the leftover 3 AP). Ally-Enrage on a Wolf is a second payload on the summon’s turn.

**WHY_IT_IS_STRONG:** Multipliers compose. This is the intended burst identity.

**COUNTERPLAY:** RES/SR. Don’t stand on the marked tile. Kill the caster during the setup turn. Paper Windstorm miss. Mirror. Kill the Wolf.

**RECOMMENDED_RESPONSE:** Preserve. Do not touch Mark, Enrage, or ally-buff targeting because the product is large.

---

### 3.10 Shield + Iron Skin (+ Sentinel / ally target) — **STRONG_BUT_HEALTHY**

**COMPONENTS:** Both `buffStat: "res"`, `buffModifier: 1.3`, different `effectName` → multiplicative 1.69× RES for 3 turns. Sentinel kit can apply both. Player Shield/Iron Skin can land on an allied summon.

**WHY_IT_IS_STRONG:** Durable, not immortal. Costs 5 AP (or a Sentinel turn). Null Field suppresses. Duration is short.

**RECOMMENDED_RESPONSE:** Preserve.

---

### 3.11 Timestep + Haste + Rally — **UNDERPOWERED** (Timestep/Mirror inert) / **STRONG_BUT_HEALTHY** after 017

**COMPONENTS:** Timestep (once, 0 AP, `self`+`buff`, no `buffStat`) + Mirror (`self`+`defense`+`isMirror`) + Haste (+2 MP) + Rally / Blood Mend (heal + advertised CHC).

**LIVE SEQUENCE:** Highlight already allows the caster tile (`playerSpellAllowsCasterTile` 184–189; `targetType === "self"` 503–508). `isShieldSpell` (`self`/`ally` + `buff`) swallows Timestep: no `buffStat`, log nothing, `return "cast"` before `isTimestep`. Mirror’s `activateMirror` is inside the enemy-target loop, so a self tile spends 4 AP and never calls `activatePlayerMirror`. Blood Mend / Rally CHC never reaches the crit roll (`012`).

**WHY_IT_IS_STRONG (intended):** One extra full bar per fight is a real decision, not a loop. Combined with 3.1 it is an amplifier (one extra Poison dump); the loop is still the missing DoT cap, not Timestep.

**RECOMMENDED_RESPONSE:** Restore Timestep and Mirror (`017`). **Do not land a second copy if `#496` merges.** Do not nerf Timestep after restore. Optionally wire CHC (`012`). Do not use inert Timestep as a `hard_3` brake (`016`).

---

### 3.12 Swap / Barrier / Mirror — **STRONG_BUT_HEALTHY** (Swap has a hazard hole; Mirror currently inert)

**COMPONENTS:** Swap (3 AP), Barrier (3 AP, 3-turn tile; copy says 2), Mirror (4 AP).

**WHY_IT_IS_STRONG:** Positional and reactive. Swap onto lava/ice/rift does **not** run walk hazards (MIMA, not EBMA). Pacifist-legal Barrier is owned by 003.

**RECOMMENDED_RESPONSE:** Do not nerf Swap. Hazard landing belongs to MIMA. Mirror restore is 017.

---

### 3.13 Backend catalog + 8-slot bar — **NICHE** (discovery still inert)

There is no achievement-spell or enemy-discovery combination on the live path. The extra combo space from the canister is Shadow Strike / Thunder Clap / late Void Collapse sitting next to starters, plus inert Bite / Soul Rend / Reflect. That is a **catalog dump**, not a discovery reward.

**RECOMMENDED_RESPONSE:** Do not invent unlocks in this PR. Point implementers at existing SDA / SDE tickets. See `007`. Restore Bite / Soul Rend / Reflect metadata so the dump is at least honest (`013`).

---

### 3.14 Late-game enemy summoner density — **STRONG_BUT_HEALTHY**

**COMPONENTS:** `ENEMY_SUMMONER_CHANCE_BASE + level * 0.02` per enemy + Wolf/Archer kits + `ENEMY_SUMMON_CAP = 2`.

**WHY_IT_IS_STRONG:** By level 44 every trash mob is a summoner. The cap and 2-turn cadence keep this from flooding. Comment in `gameConstants.ts` 295–297 still says “~12% of packs.”

**RECOMMENDED_RESPONSE:** Retarget the roll to pack-level / zone if the board feels noisy. Not a P0. See `011`.

---

### 3.15 Ally-buff summons (Enrage / Shield / Haste on kits) — **STRONG_BUT_HEALTHY** (preserve)

**COMPONENTS:** `resolvePlayerCast` ally branch (676–718) + Enrage / Shield / Iron Skin / Haste + any player-side summon.

**WHY_IT_IS_STRONG:** The spells already said “ally.” Landing them on a Wolf or Sentinel is the identity working. Duration-gated and Null-Field-vulnerable.

**RECOMMENDED_RESPONSE:** Preserve. Do not close ally targeting to “fix” 3.2. Cap the flood instead.

---

### 3.16 Kit AP mismatch — **UNDERPOWERED** (kits) / **STRONG_BUT_HEALTHY** (Archer Poison)

**COMPONENTS:** Spawn AP vs advertised kit cost (014). Archer Poison 2/2 is the live DoT amplifier inside 001.

**RECOMMENDED_RESPONSE:** Raise spawn AP to at least the cheapest advertised kit spell. Bomber ≥ 5 **only with 010**. Pair Wisp with 015.

---

### 3.17 Wisp heal identity — **UNDERPOWERED** (restore, not a nerf)

**COMPONENTS:** Wisp kit Blood Mend / Rallying Cry.

**LIVE SEQUENCE:** Control-cast always passes `targetEnemy` (`WX` 9849–9869). `resolveSpellCast` takes `buffStat` and returns before `healAmount`. `ctx.heal` only mutates player HP for player ids. Recorded no-heal amount is 0.

**RECOMMENDED_RESPONSE:** Ally/self targeting, heal-before-or-with-buff, commit the intended amount into `recordChallengeHealFromHpRestore`. `#550` covers the buff-before-heal return — still ship targeting + amount. See `015`.

---

### 3.18 `hard_3` vs live AP bar — **DOMINANT** (challenge economy, early)

**COMPONENTS:** `hard_3` (150 Doka / 450 XP) + battle AP 8 at levels 1–24 + Poison dump (3.1).

**COMBO_SEQUENCE:** Accept “Never spend more than 8 AP in any single turn.” Spend the entire bar. `recordChallengeApSpend` cannot record a peak above the pool. Persist 150 Doka + 450 XP (`100 * 2^(N-1)` is two early level-ups plus leftover).

**ACCESS_REQUIREMENTS:** Challenge offer (1/9, must accept). Level 1.

**WHY_IT_IS_STRONG:** The advertised constraint is identical to the resource pool. Combined with 3.1 the same dump is both unbounded DoT and a free hard challenge.

**COUNTERPLAY:** None at AP 8. At AP 9+ (level 25+) spending 9 fails, so the check becomes real.

**RELATIVE_PROGRESSION_CONTEXT:** Inverse of intended difficulty: easiest when the player is weakest.

**PERSISTENCE/ECONOMY_IMPACT:** Direct `applyRewards` credit.

**RECOMMENDED_RESPONSE:** Compare peak spend to the **live** battle AP bar (`016`). Do not change Poison AP. Do not leave Timestep dead as a fake brake.

---

## 4. Classification board (player-accessible)

| Package | Class | Intervene? |
| :--- | :--- | :--- |
| Poison recast / Poison+Venom+Inferno (+ Arcane Surge) (+ `hard_3`) | BROKEN | Yes — cap / refresh |
| Player summon flood (5 kits, no cap/CD) | DOMINANT | Yes — cap + kit CD |
| Pacifist + summon / Bite / Mark / Slow-1 | DOMINANT | Yes — advertised categories |
| `hard_3` auto-complete at AP 8 | DOMINANT | Yes — relative cap |
| Shadow Strike + Mark + Enrage | STRONG_BUT_HEALTHY | No |
| Shield + Iron Skin (+ Sentinel / ally) | STRONG_BUT_HEALTHY | No |
| Ally Enrage / Haste on kits | STRONG_BUT_HEALTHY | No |
| Sacrifice + Titan + Glass | STRONG_BUT_HEALTHY | Monitor |
| Thunder Clap / Chain Lightning | STRONG_BUT_HEALTHY | No |
| Swap / Barrier | STRONG_BUT_HEALTHY | Hazard landing is MIMA |
| Enemy summoner density (capped 2) | STRONG_BUT_HEALTHY | Soft formula fix |
| Controlled Archer Slow / Poison | STRONG_BUT_HEALTHY | Restore the bar; keep the kit |
| Inferno via Bomber (Day-1) | NICHE | Lock before 014 |
| Bishop Frost only (zone 0) | NICHE | Restore zone number |
| Void Collapse (12 AP) | NICHE | Don’t enforce `minLevel` as a surprise nerf |
| Player Slow/Weaken/Expose/Frost/Courage | UNDERPOWERED | Restore `debuffStat` |
| Timestep / Mirror (self tile) | UNDERPOWERED | Restore ordering (`#496`) |
| Soul Rend / Vampire Bite heal / Reflect Barrier | UNDERPOWERED | Metadata, not a nerf |
| Blood Mend / Rally CHC half | UNDERPOWERED | Wire `chc` |
| Wisp heal | UNDERPOWERED | Targeting + buff/heal order |
| Kit AP mismatch (except Archer Poison) | UNDERPOWERED | Align spawn AP |
| AI summon DoTs / AI Bomber kamikaze / AI Slow | UNDERPOWERED | Only after DoT cap (DoTs) |
| Drain no-heal | — | Closed. Do not re-open |

---

## 5. What not to touch

- RAF loop, map generation, turn order, damage formula (`calcScaledDamage` 3%/level).
- Mark, Enrage, Timestep-once **identity**, Mirror identity, Barrier geometry, Swap’s teleport identity, ally-buff targeting.
- 3% upgrade curve. Economy bugs around summon advertised cost vs canister debit are already owned by persist work.
- Inventing observe-to-unlock in this automation. That is SDA / SDE.
- Reverting the Pacifist preview fix.
- GameKey shop numbers (out of combat-combo scope).
- Occupancy dual-path unseal / Void Rift summon tick (closed correctly).
- Implementing `#496` / `#528` / `#550` / `#555` / `#443` in this PR.
- Re-opening 005, preview pacifist, Inf-HP catalog, free summons, Attack Nearest Inferno CD, Bomber Inferno as Day-1 launder.

---

## 6. Prior ACTION_ID disposition

| Prior | 2026-09-25 | Notes |
| :--- | :--- | :--- |
| 001 DoT cap | Reissued as 001 | Still true; `hard_3` payout named in 016 |
| 002 Summon cap + CD | Reissued as 002 | AP still charged; cap/CD still missing |
| 003 Pacifist | Reissued as 003 | Bite/Mark/summon/`attract_multi`/Slow-1 |
| 004 Player debuff + stack cap | Reissued as 004 | Bar still dead; `#528`/`#555` queued — keep the cap |
| 005 Challenge drain | **Stays closed** | `onPlayerHealed` is live |
| 006 AI DoT ppt | Reissued as 006 | Still gated on 001 |
| 007 Catalog ≠ ownership | Reissued as 007 | Still inert; point at SDA/SDE |
| 008 Titan × Glass | Reissued as 008 | Still Sacrifice-only hook |
| 009 Numeric zone | Reissued as 009 | Call site still passes the object |
| 010 Kit cooldown | Reissued as 010 | Load-bearing after 014 |
| 011 Enemy summoner chance | Reissued as 011 | Still per-enemy × player level |
| 012 CHC buff restore | Reissued as 012 | Heal branch still skips the buff |
| 013 Inert backend seed | Reissued as 013 | Bite / Soul Rend / Reflect |
| 014 Kit AP | Reissued as 014 | Bomber/Wisp/Wolf/Sentinel |
| 015 Wisp targeting | Reissued as 015 | Plus buff-before-heal; `#550` is partial |
| 016 `hard_3` relative cap | Reissued as 016 | Levels 1–24 cannot fail |
| 017 Timestep / Mirror | Reissued as 017 | `#496` is the restore — do not duplicate |

No **018**. Mending Mist on the player is still unwired (`playerTurnStartModifierTarget` → `undefined`). Do not open a ticket that `#443` already owns.

---

## 7. Search checklist (this pass)

| Pattern | Result |
| :--- | :--- |
| Excessive damage/AP combinations | 3.1 DoT recast; 3.9 burst (healthy) |
| Infinite / near-infinite loops | DoT append has no cap; summon recast limited only by AP + lifespan |
| Permanent control | Player-bar denial dead; latent after 009 |
| AP/MP denial chains | Latent 3.6; live Archer Slow is kit identity |
| Summon abuse | 3.2 flood; 3.7 Inferno launder after 014 |
| Cooldown circumvention | 3.7 latent; Attack Nearest Inferno **closed**; Bomber Day-1 **closed** |
| Healing loops | Drain counted; Wisp inert; potions counted; Bite heal inert; Mending Mist not on player |
| Defensive immortality | Shield+Iron Skin duration-gated (healthy); Mirror inert until 017 |
| Status stacking | DoT append BROKEN; non-DoT replace-by-name |
| Displacement loops | Swap identity healthy; hazard landing is MIMA |
| Hazard combinations | Swap × lava is MIMA, not EBMA |
| Achievement-spell combinations | No spell grants. Pacifist is an achievement × existing kit combo |
| Enemy-discovery spell combinations | Discovery inert. Catalog dump is not discovery |
